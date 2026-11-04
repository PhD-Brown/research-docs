#!/usr/bin/env python3
"""
build_astrovision_data.py — Génère website/src/data/astrovision/facts.json à partir de
_facts/astrovision/ et du registre de _facts/astrovision/FACTS_INDEX.md (§3).

Décision éditoriale n° 4 : la documentation doit se mettre à jour en quelques minutes à chaque nouveau
résultat. Les pages de website/docs-astrovision/ et les composants de website/src/components/astrovision/
lisent leurs chiffres dans facts.json (via website/src/data/astrovision/index.js) au lieu de les coder en dur ;
ce script est la seule passerelle entre le pack de faits et le site.

Usage (depuis la racine du dépôt, bibliothèque standard uniquement) :
    python3 scripts/build_astrovision_data.py            # écrit facts.json
    python3 scripts/build_astrovision_data.py --check    # échoue (code 1) si facts.json n'est pas à jour
    python3 scripts/build_astrovision_data.py --summary  # affiche les chiffres clés

Deux origines de valeurs (statut conservé dans facts.json → "status") :
    calculé   : lu/calculé dans _facts/astrovision/data/*.csv|json (source de vérité)
    notebook · figure · code : lignes du registre §3 de FACTS_INDEX.md (le pack ne contient pas de fichier
                de métriques ; voir FACTS_INDEX.md §0)

Structure de facts.json : { schema_version, inputs, classes[], facts{…}, sources{clé→texte}, status{clé→statut} }.
Les clés sont pointées (ex. models.dinov2_ft.test.balanced_accuracy) ; l'objet `facts` est l'imbrication de ces clés.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
FACTS = REPO / "_facts" / "astrovision"
DATA = FACTS / "data"
INDEX = FACTS / "FACTS_INDEX.md"
OUT = REPO / "website" / "src" / "data" / "astrovision" / "facts.json"
SCHEMA_VERSION = 1

# Ordre canonique Galaxy10 (indices 0–9) → (slug, nom court des figures du dépôt)
CLASSES = [
    ("disturbed", "Disturbed", "Dist."),
    ("merging", "Merging", "Merg."),
    ("round_smooth", "Round Smooth", "R.Smo."),
    ("in_between_round_smooth", "In-between Round Smooth", "IbRS"),
    ("cigar_shaped_smooth", "Cigar Shaped Smooth", "Cig."),
    ("barred_spiral", "Barred Spiral", "BarSp"),
    ("unbarred_tight_spiral", "Unbarred Tight Spiral", "UTSp"),
    ("unbarred_loose_spiral", "Unbarred Loose Spiral", "ULSp"),
    ("edge_on_without_bulge", "Edge-on without Bulge", "E-nB"),
    ("edge_on_with_bulge", "Edge-on with Bulge", "E+B"),
]
NAME2SLUG = {n: s for s, n, _ in CLASSES}


# ─── utilitaires ─────────────────────────────────────────────────────────────

def read_csv(name: str) -> list[dict]:
    with (DATA / name).open(newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def num(x):
    """Cellule CSV → float, ou None si vide / NaN."""
    if x is None or x == "" or x.lower() == "nan":
        return None
    return float(x)


def median(xs):
    xs = sorted(x for x in xs if x is not None)
    if not xs:
        return None
    n = len(xs)
    return xs[n // 2] if n % 2 else (xs[n // 2 - 1] + xs[n // 2]) / 2


def ranks(xs):
    """Rangs moyens (égalités) — pour Spearman."""
    order = sorted(range(len(xs)), key=lambda i: xs[i])
    r = [0.0] * len(xs)
    i = 0
    while i < len(order):
        j = i
        while j + 1 < len(order) and xs[order[j + 1]] == xs[order[i]]:
            j += 1
        avg = (i + j) / 2 + 1
        for k in range(i, j + 1):
            r[order[k]] = avg
        i = j + 1
    return r


def spearman(a, b):
    pairs = [(x, y) for x, y in zip(a, b) if x is not None and y is not None]
    x, y = [p[0] for p in pairs], [p[1] for p in pairs]
    rx, ry = ranks(x), ranks(y)
    n = len(rx)
    mx, my = sum(rx) / n, sum(ry) / n
    sxy = sum((p - mx) * (q - my) for p, q in zip(rx, ry))
    sxx = sum((p - mx) ** 2 for p in rx)
    syy = sum((q - my) ** 2 for q in ry)
    return sxy / (sxx * syy) ** 0.5, n


def sha(p: Path) -> str:
    return hashlib.sha256(p.read_bytes()).hexdigest()[:16]


def setpath(root: dict, key: str, value):
    parts = key.split(".")
    d = root
    for p in parts[:-1]:
        d = d.setdefault(p, {})
        if not isinstance(d, dict):
            raise SystemExit(f"[build_astrovision_data] conflit de clé : « {key} » traverse une valeur")
    if parts[-1] in d and isinstance(d[parts[-1]], dict):
        raise SystemExit(f"[build_astrovision_data] conflit de clé : « {key} » écrase un objet")
    d[parts[-1]] = value


def rnd(x, nd=6):
    return None if x is None else round(x, nd)


# ─── registre de FACTS_INDEX.md (§3) ─────────────────────────────────────────

ROW = re.compile(r"^\|\s*`([a-z0-9_.]+)`\s*\|\s*([^|]+?)\s*\|\s*((?:[^|\\]|\\\|)*?)\s*\|\s*(notebook|figure|code)\s*\|\s*$")


def parse_registry():
    text = INDEX.read_text(encoding="utf-8")
    m = re.search(r"^## 3\. Registre.*?$(.*?)^## 4\.", text, re.S | re.M)
    if not m:
        raise SystemExit("[build_astrovision_data] section « ## 3. Registre … » introuvable dans FACTS_INDEX.md")
    rows = []
    for line in m.group(1).splitlines():
        r = ROW.match(line.strip())
        if r:
            key, val, src, status = r.groups()
            rows.append((key, float(val), src.replace("\\|", "|"), status))
    if not rows:
        raise SystemExit("[build_astrovision_data] aucune ligne de registre lue (format de la table modifié ?)")
    return rows


# ─── calculs depuis data/ ────────────────────────────────────────────────────

def compute(facts: dict, sources: dict, status: dict):
    def put(key, value, src):
        setpath(facts, key, value)
        sources[key] = src
        status[key] = "calculé"

    # --- master_synthesis.csv ------------------------------------------------
    ms = read_csv("master_synthesis.csv")
    n = len(ms)
    f_ms = "data/master_synthesis.csv"
    by = {s: [r for r in ms if NAME2SLUG[r["class_name"]] == s] for s, _, _ in CLASSES}
    assert sum(len(v) for v in by.values()) == n, "classe inconnue dans master_synthesis.csv"
    put("dataset.n_images", n, f_ms + " (lignes)")
    put("dataset.n_classes", len(CLASSES), f_ms + " (valeurs distinctes de class_name)")
    sizes = [len(by[s]) for s, _, _ in CLASSES]
    put("dataset.imbalance_ratio", rnd(max(sizes) / min(sizes), 4), f_ms + " (max / min des effectifs par classe)")
    put("dataset.majority_class_accuracy", rnd(max(sizes) / n, 6), f_ms + " (effectif max / N)")
    for s, _, _ in CLASSES:
        rows = by[s]
        put(f"dataset.by_class.{s}.n", len(rows), f_ms)
        put(f"dataset.by_class.{s}.share", rnd(len(rows) / n, 6), f_ms)

    n_matched = sum(1 for r in ms if r["objID"] != "")
    put("crossmatch.n_matched", n_matched, f_ms + " (objID non nul)")
    put("crossmatch.n_unmatched", n - n_matched, f_ms)
    put("crossmatch.match_rate", rnd(n_matched / n, 6), f_ms)
    put("crossmatch.n_with_gr", sum(1 for r in ms if num(r["g-r"]) is not None), f_ms + " (g-r non nul)")
    put("crossmatch.n_with_mr", sum(1 for r in ms if num(r["Mr"]) is not None), f_ms + " (Mr non nul)")
    put("crossmatch.n_with_zsp", sum(1 for r in ms if num(r["zsp"]) is not None), f_ms + " (zsp non nul)")
    put("crossmatch.median_gr", rnd(median([num(r["g-r"]) for r in ms]), 4), f_ms + " (médiane de g-r)")
    put("crossmatch.max_ang_dist_arcsec", rnd(max(num(r["angDist"]) for r in ms if num(r["angDist"]) is not None), 4), f_ms + " (angDist)")
    pop = {"Blue Cloud": "blue_cloud", "Green Valley": "green_valley", "Red Sequence": "red_sequence"}
    for label, slug in pop.items():
        c = sum(1 for r in ms if r["population"] == label)
        put(f"crossmatch.population.{slug}.n", c, f_ms + " (population)")
        put(f"crossmatch.population.{slug}.share", rnd(c / n_matched, 6), f_ms + " (part des appariements)")

    # segmentation U-Net (fractions de pixels) et corrélations
    for col, slug in (("frac_fond", "background"), ("frac_disque", "disk"), ("frac_bulbe", "bulge")):
        put(f"segmentation.fraction.{slug}.median", rnd(median([num(r[col]) for r in ms]), 4), f_ms + f" (médiane de {col})")
        for s, _, _ in CLASSES:
            put(f"segmentation.fraction.{slug}.by_class.{s}", rnd(median([num(r[col]) for r in by[s]]), 4), f_ms + f" (médiane de {col})")
    fb = [num(r["frac_bulbe"]) for r in ms]
    for col, slug in (("g-r", "gr"), ("Mr", "mr"), ("z_photo", "z_photo")):
        rho, npair = spearman(fb, [num(r[col]) for r in ms])
        put(f"segmentation.spearman_bulge.{slug}.rho", rnd(rho, 4), f_ms + f" (Spearman frac_bulbe × {col})")
        put(f"segmentation.spearman_bulge.{slug}.n", npair, f_ms)
    nc = [int(float(r["n_comp_bulbe"])) for r in ms]
    put("segmentation.n_components.one", sum(1 for c in nc if c == 1), f_ms + " (n_comp_bulbe = 1)")
    put("segmentation.n_components.one_share", rnd(sum(1 for c in nc if c == 1) / n, 6), f_ms)
    put("segmentation.n_components.max", max(nc), f_ms)
    bc = median([num(r["frac_bulbe"]) for r in ms if r["population"] == "Blue Cloud"])
    rs = median([num(r["frac_bulbe"]) for r in ms if r["population"] == "Red Sequence"])
    put("segmentation.bulge_median_blue_cloud", rnd(bc, 4), f_ms)
    put("segmentation.bulge_median_red_sequence", rnd(rs, 4), f_ms)

    # --- synthesis_summary_table.csv (recoupé avec master_synthesis) ----------
    f_st = "data/synthesis_summary_table.csv"
    for r in read_csv("synthesis_summary_table.csv"):
        s = NAME2SLUG[r["Classe"]]
        n_cls = int(r["N total"])
        if n_cls != len(by[s]):
            raise SystemExit(f"[build_astrovision_data] écart d'effectif pour {s} : table {n_cls} ≠ master {len(by[s])}")
        n_sdss = sum(1 for x in by[s] if x["objID"] != "")
        if int(r["N SDSS"]) != n_sdss:
            raise SystemExit(f"[build_astrovision_data] écart N SDSS pour {s} : table {r['N SDSS']} ≠ master {n_sdss}")
        med_gr = median([num(x["g-r"]) for x in by[s]])
        if abs(float(r["g-r médian"]) - med_gr) > 0.0006:
            raise SystemExit(f"[build_astrovision_data] écart g-r médian pour {s}")
        put(f"dataset.by_class.{s}.n_sdss", int(r["N SDSS"]), f_st)
        put(f"dataset.by_class.{s}.median_gr", float(r["g-r médian"]), f_st)
        put(f"dataset.by_class.{s}.median_bulge_fraction", float(r["Frac. bulbe médiane"]), f_st)
        put(f"dataset.by_class.{s}.pct_blue_cloud", int(r["% Blue Cloud"].rstrip("%")) / 100, f_st)
        put(f"dataset.by_class.{s}.pct_red_sequence", int(r["% Red Sequence"].rstrip("%")) / 100, f_st)

    # --- morphometry_galaxy10.csv ---------------------------------------------
    mo = read_csv("morphometry_galaxy10.csv")
    f_mo = "data/morphometry_galaxy10.csv"
    metrics = ["C", "A", "S", "Gini", "M20", "sersic_n"]
    put("morphometry.n", len(mo), f_mo + " (lignes)")
    put("morphometry.n_valid", sum(1 for r in mo if all(num(r[m]) is not None for m in metrics)), f_mo + " (lignes sans valeur manquante)")
    for m in metrics:
        put(f"morphometry.overall.{m}", rnd(median([num(r[m]) for r in mo]), 4), f_mo + f" (médiane de {m})")
    for s, name, _ in CLASSES:
        rows = [r for r in mo if r["class_name"] == name]
        put(f"morphometry.by_class.{s}.n", len(rows), f_mo)
        for m in metrics:
            put(f"morphometry.by_class.{s}.{m}", rnd(median([num(r[m]) for r in rows]), 4), f_mo + f" (médiane de {m})")

    # --- attn_morphometry_df.csv ------------------------------------------------
    at = read_csv("attn_morphometry_df.csv")
    f_at = "data/attn_morphometry_df.csv"
    am = ["C", "A", "S", "Gini", "M20", "n_components", "mask_coverage"]
    put("attention_morphometry.n", len(at), f_at + " (lignes)")
    for s, name, _ in CLASSES:
        rows = [r for r in at if r["class_name"] == name]
        put(f"attention_morphometry.by_class.{s}.n", len(rows), f_at)
        for m in am:
            put(f"attention_morphometry.by_class.{s}.{m}", rnd(median([num(r[m]) for r in rows]), 4), f_at + f" (médiane de {m})")

    # --- fusion_ablation_results.json -----------------------------------------
    ab = json.loads((DATA / "fusion_ablation_results.json").read_text(encoding="utf-8"))
    f_ab = "data/fusion_ablation_results.json"
    keys = {"DINOv2 seul": "dinov2_only", "DINOv2 + Morpho": "dinov2_morpho",
            "DINOv2 + Photo": "dinov2_photo", "DINOv2 + Morpho + Photo": "dinov2_morpho_photo"}
    base = ab["DINOv2 seul"]
    for label, slug in keys.items():
        put(f"ablation.{slug}", rnd(ab[label], 6), f_ab + f" (« {label} »)")
        put(f"ablation.delta_vs_dinov2_only.{slug}", rnd(ab[label] - base, 6), f_ab + " (valeur − « DINOv2 seul »)")


# ─── assemblage ─────────────────────────────────────────────────────────────

def build() -> dict:
    facts: dict = {}
    sources: dict = {}
    status: dict = {}
    compute(facts, sources, status)
    for key, val, src, st in parse_registry():
        if key in sources:
            raise SystemExit(f"[build_astrovision_data] clé « {key} » à la fois calculée et dans le registre")
        v = int(val) if float(val).is_integer() and "e" not in repr(val) else val
        setpath(facts, key, v)
        sources[key] = src
        status[key] = st
    inputs = {p.relative_to(REPO).as_posix(): sha(p) for p in sorted(DATA.glob("*")) if p.is_file()}
    inputs[INDEX.relative_to(REPO).as_posix()] = sha(INDEX)
    return {
        "schema_version": SCHEMA_VERSION,
        "generated_by": "scripts/build_astrovision_data.py — ne pas éditer à la main",
        "inputs": inputs,
        "classes": [{"index": i, "slug": s, "name": n, "short": sh} for i, (s, n, sh) in enumerate(CLASSES)],
        "facts": facts,
        "sources": sources,
        "status": status,
    }


def dumps(d: dict) -> str:
    return json.dumps(d, indent=1, ensure_ascii=False, sort_keys=False) + "\n"


def summary(d: dict):
    f = d["facts"]
    st = d["status"]
    n_by = {}
    for s in st.values():
        n_by[s] = n_by.get(s, 0) + 1
    print(f"facts.json — {len(st)} valeurs : " + " · ".join(f"{k} {v}" for k, v in sorted(n_by.items())))
    print(f"Galaxy10 : {f['dataset']['n_images']} images, {f['dataset']['n_classes']} classes, "
          f"déséquilibre ×{f['dataset']['imbalance_ratio']}")
    cm = f["crossmatch"]
    print(f"SDSS DR16 : {cm['n_matched']} appariées ({cm['match_rate']:.1%}) · avec Mr {cm['n_with_mr']} · zsp {cm['n_with_zsp']}")
    print("Ablation :", {k: v for k, v in f["ablation"].items() if k != "delta_vs_dinov2_only"})
    m = f["models"]
    for k in ("simplecnn", "efficientnet", "dinov2_probe", "dinov2_ft", "fusion"):
        print(f"  {k:<13} BA test {m[k]['test']['balanced_accuracy']:.4f}  ({st[f'models.{k}.test.balanced_accuracy']})")
    print(f"U-Net mIoU test {f['unet']['test']['miou']}  · MC Dropout T={f['uncertainty']['mc_dropout']['passes']}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--check", action="store_true", help="échoue si facts.json n'est pas à jour")
    ap.add_argument("--summary", action="store_true", help="affiche les chiffres clés")
    args = ap.parse_args()

    d = build()
    text = dumps(d)
    if args.check:
        cur = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
        if cur != text:
            print("facts.json n'est pas à jour : lancer python3 scripts/build_astrovision_data.py", file=sys.stderr)
            sys.exit(1)
        print(f"facts.json à jour ({len(d['status'])} valeurs).")
        return
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(text, encoding="utf-8")
    print(f"écrit {OUT.relative_to(REPO)} ({len(d['status'])} valeurs, {len(text) // 1024} Ko)")
    if args.summary:
        summary(d)


if __name__ == "__main__":
    main()
