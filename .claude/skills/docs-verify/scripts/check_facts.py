#!/usr/bin/env python3
"""Contre-vérifie les chiffres d'une page (et des composants qu'elle importe) avec _facts/.

Usage (depuis la racine du dépôt) :
    python3 .claude/skills/docs-verify/scripts/check_facts.py website/docs/astrospectro/dimred/pca.mdx [autres pages…]
    python3 .claude/skills/docs-verify/scripts/check_facts.py --from-git=main          # pages modifiées depuis main
Options :
    --no-components   ne pas analyser les composants importés par la page
    --all             afficher aussi les chiffres trouvés (par défaut : seulement les non trouvés)
    --facts=DIR       dossier de faits (défaut : _facts/astrospectro)

Principe : chaque nombre de la page est arrondi à sa propre précision et cherché parmi tous les nombres
des fichiers texte de _facts (json, txt, csv, md), y compris en pourcentage (0.8919 ↔ 89.19 %).
Les identifiants de run (AAAAMMJJTHHMMSSZ) sont cherchés dans les noms de fichiers.
Un résultat « TROUVÉ » signifie « cette valeur existe quelque part dans _facts » : vérifier que la source
proposée est bien celle de FACTS_INDEX.md (bon run, bonne génération G1/G2). « INTROUVABLE » = à justifier
ou à retirer ; « RAPPORT À JUSTIFIER » = un « N× » calculé, à recalculer depuis les valeurs sources ;
« FAIBLE » = valeur courte (entier < 1000, ≤ 2 décimales, %) trouvée seulement hors des runs de référence.
Avec --all, chaque valeur trouvée affiche sa source la plus probable : la comparer à FACTS_INDEX.md.
Ignorés : longueurs d'onde (Å), températures en K, années, versions, couleurs, styles CSS/SVG,
abréviations du type 350k / 5950X, petits entiers (< 10). Les valeurs tirées du code (hyperparamètres
d'un exemple Python) sortent en INTROUVABLE : les justifier par le fichier source.
Code de sortie : 0 si tout est trouvé, 1 s'il reste des valeurs introuvables.
"""
from __future__ import annotations

import os
import re
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

REPO = Path(__file__).resolve().parents[4]
WEBSITE = REPO / "website"
EXCLUDE = re.compile(r"(test_predictions_.*\.csv|valid_plan_urls\.csv|downloaded_plans\.csv|session_pending\.json|MANIFEST\.md)$")
# Fichiers à proposer en premier comme source (runs de référence de FACTS_INDEX.md).
PRIORITY = [
    "20260522T161236Z", "20260525T191109Z", "20260306T020848Z",
    "phy3500_pca_run_20260408T012751Z", "phy3500_umap_tsne_run_20260405T214233Z",
    "phy3500_umap_tsne_run_20260430T215407Z", "phy3500_autoencoder_run_20260405T220839Z",
    "_20260522T", "features_20260522T153123Z", "features_20260305T174836Z", "last_config_used",
]
NUM_IN_FACTS = re.compile(r"-?\d+(?:\.\d+)?(?:[eE][-+]?\d+)?")
RUN_ID = re.compile(r"\b\d{8}T\d{6}Z\b")
# Nombre dans une page : 43,019 · 43 019 · 0.489 · +0.831 · 89.2 % · 5×10⁻⁴ · 1.2e-3
PAGE_NUM = re.compile(
    r"(?<![\w#.\-/])([+−-]?)(\d{1,3}(?:[,   ]\d{3})+|\d+(?:\.\d+)?)"
    r"(?:\s?[×x]\s?10([⁻\-]?[⁰¹²³⁴⁵⁶⁷⁸⁹\d]+))?"
    r"(?:[eE]([-+]?\d+))?"
    r"(\s?%)?(?![\w.]*\d)"
)
SUP = str.maketrans("⁰¹²³⁴⁵⁶⁷⁸⁹⁻", "0123456789-")


def build_index(facts: Path):
    index: dict[str, set[str]] = defaultdict(set)
    names: set[str] = set()
    for root, _, files in os.walk(facts):
        for fn in files:
            p = Path(root) / fn
            rel = str(p.relative_to(facts))
            names.add(rel)
            if EXCLUDE.search(rel) or p.suffix.lower() not in {".json", ".txt", ".csv", ".md"}:
                continue
            try:
                text = p.read_text(encoding="utf-8", errors="ignore")
            except OSError:
                continue
            for m in NUM_IN_FACTS.finditer(text):
                try:
                    v = abs(float(m.group()))
                except ValueError:
                    continue
                for key in keys_for(v):
                    index[key].add(rel)
    return index, names


def keys_for(v: float):
    out = set()
    for d in range(0, 5):
        out.add(f"{round(v, d):.{d}f}")
        if v <= 1.0:
            out.add(f"{round(v * 100, d):.{d}f}%")
    return out


def strip_code_noise(line: str) -> str:
    line = re.sub(r"#[0-9A-Fa-f]{3,8}\b", " ", line)          # couleurs
    line = re.sub(r"rgba?\([^)]*\)", " ", line)                # couleurs rgba()
    line = re.sub(r"--[\w-]+", " ", line)                       # variables CSS (--ifm-color-emphasis-700)
    line = re.sub(r"§\s?\d+(\.\d+)*", " ", line)               # renvois de section (§4.9)
    line = re.sub(r"\b(?:width|height|margin|padding|gap|font\w*|border\w*|opacity|top|left|right|bottom|r|x|y|cx|cy|x1|x2|y1|y2|rx|columns|depth|size|delay)\s*[:=]\s*[{'\"]?[-\d.]+", " ", line)  # styles/SVG
    line = re.sub(r"\b\d+\.\d+\.\d+\b", " ", line)            # versions x.y.z
    line = re.sub(r"\b(19|20)\d{2}-\d{2}(-\d{2})?\b", " ", line)  # dates
    line = re.sub(r"(\d[\d,.\u202f\u00a0 ]*\s?[–-]\s?)?\d[\d,.\u202f\u00a0 ]*\s?\+?\s?(Å|AA|nm|px|ms|MB|GB|Mo|Ko|K|dex|em|rem|vh|vw)\b", " ", line)  # unités non vérifiables (λ, Teff illustratifs, CSS), y compris plages « a–b K »
    line = re.sub(r"\b\d+[A-Za-z]\w*", " ", line)               # 5950X, 2D, 350k… (abréviations non vérifiées)
    line = re.sub(r"\b[A-Za-z_]+\d+[A-Za-z_\d]*\b", " ", line)  # identifiants (PC1, H10, C11, k95…)
    return line


def page_numbers(path: Path):
    in_front = False
    for no, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
        if no == 1 and raw.strip() == "---":
            in_front = True
            continue
        if in_front and raw.strip() == "---":
            in_front = False
        if re.match(r"^\s*(import|export) ", raw) and "from" in raw:
            continue
        for rid in RUN_ID.findall(raw):
            yield no, rid, "run", raw
        line = strip_code_noise(RUN_ID.sub(" ", raw))
        line = re.sub(r"^\s*#+\s*\d+(\.\d+)*\.?\s", " ", line)     # numéros de section
        line = re.sub(r"^\s*\d+\.\s", " ", line)                   # listes numérotées
        for m in PAGE_NUM.finditer(line):
            sign, num, exp10, expe, pct = m.groups()
            txt = num
            clean = re.sub(r"[,   ]", "", num)
            try:
                val = float(clean)
            except ValueError:
                continue
            if exp10:
                val *= 10 ** int(exp10.translate(SUP))
                txt = f"{num}×10^{exp10.translate(SUP)}"
            elif expe:
                val *= 10 ** int(expe)
            decimals = len(clean.split(".")[1]) if "." in clean and not (exp10 or expe) else 0
            if not pct and not exp10 and not expe and decimals == 0 and val < 10:
                continue
            if not pct and decimals == 0 and 1900 <= val <= 2100:
                continue
            after = line[m.end():m.end() + 2]
            if after.strip().startswith(("×", "x")) and not exp10:
                yield no, txt + "×", "ratio", raw
                continue
            yield no, (sign or "") + txt + (pct or "").strip(), ("pct" if pct else (decimals, val)), raw


def lookup(kind, token, index, names):
    if kind == "ratio":
        return []  # un rapport calculé n'existe pas tel quel dans _facts : à justifier par le calcul
    if kind == "run":
        hits = sorted(n for n in names if token in n)
        return hits
    if kind == "pct":
        v = float(re.sub(r"[^\d.]", "", token.replace(",", "")))
        d = len(str(v).split(".")[1]) if "." in token else 0
        return sorted(index.get(f"{v:.{d}f}%", set()) | index.get(f"{v:.{d}f}", set()))
    decimals, val = kind
    if decimals == 0 and val >= 1e5:  # grands entiers : tolérer l'arrondi (350k, 1.2e5…)
        return sorted(index.get(f"{val:.0f}", set()))
    return sorted(index.get(f"{abs(val):.{decimals}f}", set()))


def rank(files):
    def score(f):
        for i, p in enumerate(PRIORITY):
            if p in f:
                return i
        return len(PRIORITY)
    return sorted(files, key=lambda f: (score(f), f))


def imported_components(page: Path):
    out = []
    for m in re.finditer(r"from\s+['\"]@site/src/components/([^'\"]+)['\"]", page.read_text(encoding="utf-8")):
        base = WEBSITE / "src" / "components" / m.group(1)
        for cand in (base.with_suffix(".jsx"), base.with_suffix(".tsx"), base / "index.jsx", base / "index.tsx"):
            if cand.exists():
                out.append(cand)
                break
    return out


def main():
    args = sys.argv[1:]
    opts = {a.split("=")[0]: (a.split("=", 1)[1] if "=" in a else True) for a in args if a.startswith("--")}
    pages = [Path(a) for a in args if not a.startswith("--")]
    if "--from-git" in opts:
        ref = opts["--from-git"] if isinstance(opts["--from-git"], str) else "main"
        scope = ["website/docs", "website/docs-astrovision", "website/docs-xi", "website/src/components"]
        diff = subprocess.run(["git", "diff", "--name-only", ref, "--", *scope], cwd=REPO, capture_output=True, text=True).stdout
        # Fichiers nouveaux pas encore suivis par git (page créée mais non commitée).
        diff += subprocess.run(["git", "ls-files", "--others", "--exclude-standard", "--", *scope],
                               cwd=REPO, capture_output=True, text=True).stdout
        pages += [REPO / f for f in dict.fromkeys(diff.split())
                  if re.search(r"\.(mdx?|jsx|tsx)$", f) and "/_" not in f and (REPO / f).exists()]
    if not pages:
        print(__doc__)
        return 2
    facts = REPO / (opts.get("--facts") if isinstance(opts.get("--facts"), str) else "_facts/astrospectro")
    index, names = build_index(facts)
    targets = []
    for p in pages:
        p = p if p.is_absolute() else (Path.cwd() / p)
        targets.append(p)
        if "--no-components" not in opts and p.suffix in {".md", ".mdx"}:
            targets += imported_components(p)
    seen, missing, found = set(), 0, 0
    for t in dict.fromkeys(targets):
        rows = []
        for no, token, kind, raw in page_numbers(t):
            key = (t, token)
            if key in seen:
                continue
            seen.add(key)
            hits = lookup(kind, token, index, names)
            # Valeur courte (entier < 1000, ≤ 2 décimales, pourcentage) trouvée seulement hors runs de référence :
            # probablement une coïncidence → à confirmer à la main.
            short = kind == "pct" or (isinstance(kind, tuple) and kind[0] <= 2 and kind[1] < 1000)
            weak = short and hits and not any(any(p in h for p in PRIORITY) for h in hits)
            if weak:
                found += 1
                rows.append(f"  ~ l.{no:<4} {token:<14} FAIBLE (seulement hors runs de référence : {', '.join(sorted(hits)[:2])}…)")
                continue
            if hits:
                found += 1
                if "--all" in opts:
                    rows.append(f"  ✓ l.{no:<4} {token:<14} ← {', '.join(rank(hits)[:2])}{' …' if len(hits) > 2 else ''}")
            else:
                missing += 1
                label = "RAPPORT À JUSTIFIER" if kind == "ratio" else "INTROUVABLE"
                rows.append(f"  ✗ l.{no:<4} {token:<14} {label:<13} « {raw.strip()[:90]} »")
        rel = t.relative_to(REPO) if REPO in t.parents else t
        print(f"\n{rel}")
        print("\n".join(rows) if rows else "  (aucun chiffre introuvable)")
    print(f"\nBilan : {found} valeur(s) retrouvée(s) dans _facts, {missing} introuvable(s).")
    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
