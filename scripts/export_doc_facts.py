"""
export_doc_facts.py — Exporte les « faits » d'un projet (résultats, métadonnées, rapports,
figures) vers research-docs/_facts/<projet>/, pour que les sessions Claude cloud documentent
à partir des vrais chiffres sans accès aux dossiers locaux gitignorés.

À placer dans research-docs/scripts/. Usage (depuis la racine de research-docs) :
    python scripts/export_doc_facts.py --project astrospectro --source ..\\AstroSpectro
    python scripts/export_doc_facts.py --project astrovision  --source ..\\AstroVision
    python scripts/export_doc_facts.py --project xi           --source ..\\xi-dark-energy-bao-mcmc
Options : --dry-run (rien n'est écrit), --no-png, --include-archive, --target <research-docs>.

Copié : petits fichiers texte (json, txt, md, yaml, tex, csv sous plafond) et figures PNG/SVG.
Jamais copié : .pkl, .joblib, .npy/.npz, .h5, .pt/.pth, FITS, .gz, .env.
Gros CSV : résumé (colonnes + nombre de lignes) dans csv_summaries.json.
Chemins locaux : remplacés par <PROJECT_ROOT> / <HOME> dans les fichiers texte copiés.
Tout ce qui est trouvé, copié ou non, est listé dans MANIFEST.md.

ATTENTION : research-docs est public. Relis MANIFEST.md avant de committer.
"""
from __future__ import annotations

import argparse
import gzip
import io
import json
import shutil
from datetime import datetime, timezone
from pathlib import Path

PRESETS = {
    "astrospectro": {
        "marker": "src/pipeline",
        "roots": ["data/models", "data/reports", "data/catalog", "data/processed",
                  "logs/shap", "logs/validation"],
        "csv_max": 1_000_000,
        "summarize_latest": {"data/processed": ("features_*.csv", 3)},
    },
    "astrovision": {
        "marker": "src/astrovision",
        # checkpoints/ : seuls les noms sont listés dans le manifeste (.pt jamais copiés)
        "roots": ["data", "figures", "infos", "checkpoints"],
        "csv_max": 10_000_000,
        "summarize_latest": {},
    },
    "xi": {
        "marker": "src/xi_cosmo",
        "roots": ["results", "figures", "reports", "data/processed", "docs"],
        "csv_max": 5_000_000,
        "summarize_latest": {},
    },
}

TEXT_MAX = {".json": 2_000_000, ".txt": 2_000_000, ".md": 2_000_000, ".tex": 2_000_000,
            ".log": 2_000_000,
            ".yaml": 500_000, ".yml": 500_000, ".cff": 100_000}
IMG_MAX = {".png": 1_500_000, ".svg": 1_500_000}
NEVER = {".pkl", ".joblib", ".fits", ".gz", ".npy", ".npz", ".pt", ".pth", ".h5", ".hdf5",
         ".ckpt", ".onnx", ".env", ".db"}
SKIP_NAME_PARTS = ("secret", "token", "apikey", "api_key", ".env")
MAX_TOTAL_MB = 150
RESIZE_MAX_PX = 2000  # figures trop lourdes : réduites (Pillow) au lieu d'être ignorées


def shrink_image(p: Path, limit: int):
    """Réduit une figure trop lourde. Renvoie (octets, extension), "no-pillow" ou None."""
    try:
        from PIL import Image
    except ImportError:
        return "no-pillow"
    src_img = Image.open(p)
    for max_px in (RESIZE_MAX_PX, 1600, 1200):
        img = src_img.copy()
        img.thumbnail((max_px, max_px))
        buf = io.BytesIO()
        img.save(buf, format="PNG", optimize=True)
        if buf.tell() <= limit:
            return buf.getvalue(), ".png"
        buf = io.BytesIO()  # JPEG : photos de galaxies, galeries d'images
        img.convert("RGB").save(buf, format="JPEG", quality=88, optimize=True)
        if buf.tell() <= limit:
            return buf.getvalue(), ".jpg"
    return None


def count_lines(path: Path) -> int:
    n = 0
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1 << 24), b""):
            n += chunk.count(b"\n")
    return n


def csv_summary(path: Path, rel: str) -> dict:
    if path.name.lower().endswith(".csv.gz"):
        with gzip.open(path, "rt", encoding="utf-8", errors="replace") as f:
            header = f.readline().rstrip("\n\r").split(",")
            n = 1 + sum(1 for _ in f)
        return {"file": rel, "size_mb": round(path.stat().st_size / 1e6, 2), "compressed": True,
                "n_rows": n - 1, "n_columns": len(header), "columns": header,
                "modified": datetime.fromtimestamp(path.stat().st_mtime).isoformat(timespec="seconds")}
    with path.open("r", encoding="utf-8", errors="replace") as f:
        header = f.readline().rstrip("\n\r").split(",")
    return {"file": rel, "size_mb": round(path.stat().st_size / 1e6, 2),
            "n_rows": max(count_lines(path) - 1, 0), "n_columns": len(header),
            "columns": header,
            "modified": datetime.fromtimestamp(path.stat().st_mtime).isoformat(timespec="seconds")}


def scrub(text: str, src: Path) -> str:
    """Remplace les chemins absolus locaux (formes brutes et échappées JSON)."""
    pairs = [(str(src), "<PROJECT_ROOT>"), (str(Path.home()), "<HOME>")]
    for raw, ph in pairs:
        for form in (raw, raw.replace("\\", "\\\\"), raw.replace("\\", "/")):
            if form and len(form) > 3:
                text = text.replace(form, ph)
    return text


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True, choices=sorted(PRESETS))
    ap.add_argument("--source", required=True, help="racine du dépôt du projet")
    ap.add_argument("--target", default=str(Path(__file__).resolve().parents[1]),
                    help="racine de research-docs (défaut : dépôt de ce script)")
    ap.add_argument("--no-png", action="store_true")
    ap.add_argument("--include-archive", action="store_true")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    cfg = PRESETS[args.project]
    src = Path(args.source).resolve()
    out = Path(args.target).resolve() / "_facts" / args.project
    if not (src / cfg["marker"]).exists():
        raise SystemExit(f"{src} ne ressemble pas au projet {args.project} ({cfg['marker']} absent).")

    latest_only = {}
    for root, (pattern, n) in cfg["summarize_latest"].items():
        files = sorted((src / root).glob(pattern), key=lambda p: p.stat().st_mtime)
        latest_only[root] = set(files[-n:])

    copied, skipped, summaries, resized, total = [], [], [], [], 0
    for root in cfg["roots"]:
        base = src / root
        if not base.exists():
            skipped.append((root, "racine absente"))
            continue
        for p in sorted(base.rglob("*")):
            if not p.is_file():
                continue
            rel = p.relative_to(src).as_posix()
            ext, size, name = p.suffix.lower(), p.stat().st_size, p.name.lower()

            if name.endswith(".csv.gz"):
                summaries.append(csv_summary(p, rel))
                skipped.append((rel, f"CSV compressé : résumé seulement, {size/1e6:.1f} Mo")); continue
            if not args.include_archive and "archive" in p.relative_to(src).parts:
                skipped.append((rel, "archive")); continue
            if ext in NEVER or any(s in name for s in SKIP_NAME_PARTS):
                skipped.append((rel, f"exclu ({ext or name}, {size/1e6:.1f} Mo)")); continue
            if ext == ".csv":
                if size > cfg["csv_max"]:
                    if root in latest_only and p not in latest_only[root]:
                        skipped.append((rel, f"gros CSV ancien, {size/1e6:.1f} Mo")); continue
                    summaries.append(csv_summary(p, rel))
                    skipped.append((rel, f"résumé seulement, {size/1e6:.1f} Mo")); continue
                limit, is_text = cfg["csv_max"], True
            elif ext in TEXT_MAX:
                limit, is_text = TEXT_MAX[ext], True
            elif ext in IMG_MAX:
                if args.no_png:
                    skipped.append((rel, "--no-png")); continue
                limit, is_text = IMG_MAX[ext], False
            else:
                skipped.append((rel, f"type non retenu ({ext or 'sans extension'})")); continue
            if size > limit and not is_text:
                shrunk = shrink_image(p, limit)
                if shrunk == "no-pillow":
                    skipped.append((rel, f"trop gros ({size/1e6:.2f} Mo) — pip install pillow pour le réduire")); continue
                if shrunk is None:
                    skipped.append((rel, f"trop gros ({size/1e6:.2f} Mo), irréductible sous la limite")); continue
                data, new_ext = shrunk
                out_rel = rel[: -len(ext)] + new_ext
                resized.append((out_rel, data, rel, size))
                copied.append((out_rel, len(data), "resized")); total += len(data)
                continue
            if size > limit:
                skipped.append((rel, f"trop gros ({size/1e6:.2f} Mo)")); continue

            copied.append((rel, size, is_text)); total += size

    if total / 1e6 > MAX_TOTAL_MB:
        raise SystemExit(f"Export de {total/1e6:.0f} Mo > {MAX_TOTAL_MB} Mo : relance avec --no-png.")

    lines = [
        f"# Faits {args.project} — export pour la documentation", "",
        f"- Exporté le : {datetime.now(timezone.utc).isoformat(timespec='seconds')}",
        f"- Source : dépôt local `{src.name}/` (dossiers de résultats gitignorés inclus)",
        f"- Fichiers copiés : {len(copied)} ({total/1e6:.1f} Mo) · CSV résumés : {len(summaries)}",
        "- Chemins locaux remplacés par `<PROJECT_ROOT>` / `<HOME>`.",
        "- **Règle** : tout chiffre publié dans la doc doit venir d'un fichier de ce dossier.", "",
        "## Copiés", "", *[f"- `{r}` ({s/1e3:.0f} Ko)" for r, s, _ in copied], "",
        "## Figures réduites (≤ %d px, original trop lourd)" % RESIZE_MAX_PX, "",
        *[f"- `{o}` ← `{r}` ({s/1e6:.1f} Mo à l'origine)" for o, _, r, s in resized], "",
        "## Présents localement mais non copiés", "", *[f"- `{r}` — {why}" for r, why in skipped],
    ]
    print(f"[{args.project}] {len(copied)} fichiers ({total/1e6:.1f} Mo, dont {len(resized)} figures "
          f"réduites), {len(summaries)} CSV résumés, {len(skipped)} non copiés.")
    if args.dry_run:
        print("[dry-run] rien n'a été écrit.")
        return
    if out.exists():
        shutil.rmtree(out)  # export propre : aucun fichier orphelin d'un export précédent
    resized_map = {o: d for o, d, _, _ in resized}
    for rel, _, is_text in copied:
        dest = out / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        if is_text == "resized":
            dest.write_bytes(resized_map[rel]); continue
        p = src / rel
        if is_text:
            dest.write_text(scrub(p.read_text(encoding="utf-8", errors="replace"), src),
                            encoding="utf-8")
        else:
            shutil.copy2(p, dest)
    (out / "MANIFEST.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    (out / "csv_summaries.json").write_text(json.dumps(summaries, indent=2, ensure_ascii=False),
                                            encoding="utf-8")
    print(f"OK → {out}  — relis MANIFEST.md avant de committer.")


if __name__ == "__main__":
    main()
