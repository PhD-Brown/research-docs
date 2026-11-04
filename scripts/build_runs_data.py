#!/usr/bin/env python3
"""
build_runs_data.py — Génère website/src/data/astrospectro/runs.json à partir de
_facts/astrospectro/ et du registre des runs en tête de FACTS_INDEX.md.

Décision éditoriale n° 4 : la documentation doit passer à un nouveau run en quelques minutes.
Les composants du site lisent leurs chiffres dans runs.json (via website/src/data/astrospectro/index.js)
au lieu de les coder en dur ; ce script est la seule passerelle entre le pack de faits et le site.

Usage (depuis la racine du dépôt, bibliothèque standard uniquement) :
    python3 scripts/build_runs_data.py            # écrit runs.json
    python3 scripts/build_runs_data.py --check    # échoue (code 1) si runs.json n'est pas à jour
    python3 scripts/build_runs_data.py --summary  # affiche les runs de référence et leurs chiffres clés

Ce qui est extrait (un objet par run, clé = identifiant du run) :
    - classifieurs : data/reports/<ID>/session_report_*.json (+ data/models/*_<ID>_meta.json)
    - PCA / UMAP-t-SNE / autoencodeur : data/reports/runs/phy3500_*/phy3500_*_run_<ID>.json
    - SHAP : logs/shap/**/shap_feature_importance.csv
    - validation scientifique : logs/validation/**/validation_summary.csv
Chaque objet porte : kind, label, date, generation (G1/G2), n, features, metrics, stack, md5, notes,
flags {gaia_leak, partial}, reference (bool), role (clé du registre ou null), source (fichiers lus).

Le registre (FACTS_INDEX.md, section « Registre des runs de référence ») est un tableau Markdown dont
la première colonne est une clé `entre backticks` (classifier, classifier_validation, pca, umap_tsne,
autoencoder, shap, validation) et la colonne « Run » liste les identifiants complets entre backticks.
Le mot « partiel » dans la colonne « Statut » pose le drapeau `partial`.
"""
from __future__ import annotations

import argparse
import csv
import json
import math
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
FACTS = REPO / "_facts" / "astrospectro"
FACTS_INDEX = REPO / "FACTS_INDEX.md"
OUT = REPO / "website" / "src" / "data" / "astrospectro" / "runs.json"

SCHEMA_VERSION = 1

# Fichier de features → génération de données (FACTS_INDEX §0). Nouvelle génération = nouvelle ligne ici
# et dans FACTS_INDEX §0.
GENERATIONS = {
    "features_20260305T174836Z": "G1",
    "features_20260522T153123Z": "G2",
}

# Colonnes Gaia / photométriques (non spectroscopiques). Le jeu exact recoupe la catégorie
# « Gaia / Photometric » des CSV SHAP du pipeline et la mention de fuite de FACTS_INDEX §1.1.
GAIA_PHOT_EXACT = {
    "M_G", "M_BP", "M_RP", "ag_gspphot", "ebpminrp_gspphot", "teff_gspphot", "logg_gspphot",
    "mh_gspphot", "bp_rp", "bp_g", "g_rp", "parallax", "pmra", "pmdec", "ruwe", "is_good_ruwe",
    "distance_gspphot", "phot_g_mean_mag", "phot_bp_mean_mag", "phot_rp_mean_mag", "delta_ms",
}
GAIA_PHOT_PREFIXES = ("magnitude_", "phot_")

TS_RE = re.compile(r"\d{8}T\d{6}Z")


# ─── utilitaires ─────────────────────────────────────────────────────────────

def rel(p: Path) -> str:
    return p.relative_to(REPO).as_posix()


def load_json(p: Path):
    """JSON tolérant : le pipeline écrit parfois NaN / nan / Infinity."""
    txt = p.read_text(encoding="utf-8")
    try:
        return json.loads(txt)
    except json.JSONDecodeError:
        txt = re.sub(r"(?<=[\s:\[,])-?(nan|NaN|Infinity|inf)(?=[\s,\]}])", "null", txt)
        return json.loads(txt)


def clean(x):
    """Remplace NaN/inf par None (JSON strict) et arrondit les flottants à 10 chiffres significatifs."""
    if isinstance(x, float):
        if math.isnan(x) or math.isinf(x):
            return None
        return float(f"{x:.10g}")
    if isinstance(x, dict):
        return {k: clean(v) for k, v in x.items()}
    if isinstance(x, list):
        return [clean(v) for v in x]
    return x


def iso(ts: str | None) -> str | None:
    if not ts or not TS_RE.fullmatch(ts):
        return None
    return f"{ts[0:4]}-{ts[4:6]}-{ts[6:8]}T{ts[9:11]}:{ts[11:13]}:{ts[13:15]}Z"


def generation_of(text: str | None) -> str | None:
    if not text:
        return None
    for stem, gen in GENERATIONS.items():
        if stem in text:
            return gen
    return None


def features_file_of(text: str | None) -> str | None:
    if not text:
        return None
    m = re.search(r"features_\d{8}T\d{6}Z(\.csv)?", text)
    if not m:
        return None
    return m.group(0) if m.group(0).endswith(".csv") else m.group(0) + ".csv"


def is_gaia_phot(name: str) -> bool:
    name = name.removeprefix("num__")
    return name in GAIA_PHOT_EXACT or name.startswith(GAIA_PHOT_PREFIXES)


def ts_of(path_text: str | None) -> str | None:
    if not path_text:
        return None
    m = TS_RE.findall(path_text)
    return m[-1] if m else None


# ─── registre ────────────────────────────────────────────────────────────────

def parse_registry(text: str) -> dict:
    """Lit le tableau du registre : {clé: {"runs": [...], "status": str, "label": str}}."""
    m = re.search(r"^## Registre des runs.*?$(.*?)^---", text, re.S | re.M)
    if not m:
        sys.exit("Registre introuvable dans FACTS_INDEX.md (section « ## Registre des runs … »).")
    registry = {}
    for line in m.group(1).splitlines():
        line = line.strip()
        if not line.startswith("|") or set(line) <= {"|", "-", " "}:
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        if len(cells) < 4:
            continue
        key = re.findall(r"`([^`]+)`", cells[0])
        if not key:
            continue  # ligne d'en-tête
        runs = re.findall(r"`([^`]+)`", cells[2])
        registry[key[0]] = {"label": cells[1], "runs": runs, "status": cells[3]}
    if not registry:
        sys.exit("Registre vide ou mal formé (première colonne = clé entre backticks).")
    return registry


# ─── extraction par type de run ──────────────────────────────────────────────

def classifier_run(report: Path) -> tuple[str, dict]:
    d = load_json(report)
    rid = d.get("session_id") or ts_of(report.name)
    meta_paths = sorted(FACTS.glob(f"data/models/*_{rid}_meta.json")) or sorted(report.parent.glob("*_meta.json"))
    meta = load_json(meta_paths[0]) if meta_paths else {}
    cr = d.get("classification_report") or {}
    labels = d.get("class_labels") or []
    roc = d.get("roc_auc") or {}
    ap = d.get("avg_precision") or {}
    brier = d.get("brier_score") or {}
    per_class = {}
    for c in labels:
        r = cr.get(c) or {}
        per_class[c] = {
            "precision": r.get("precision"), "recall": r.get("recall"), "f1": r.get("f1-score"),
            "support": int(r["support"]) if r.get("support") is not None else None,
            "roc_auc": roc.get(c), "avg_precision": ap.get(c), "brier": brier.get(c),
        }
    candidates = d.get("feature_columns") or meta.get("feature_names_used") or []
    selected = d.get("selected_features") or meta.get("selected_features_") or []
    used = selected or candidates
    gaia = sorted({f for f in used if is_gaia_phot(f)})
    params = {}
    for k, v in (d.get("best_model_params") or meta.get("best_params_") or {}).items():
        if v is None or isinstance(v, (dict, list)):
            continue
        params[k.removeprefix("base_estimator__")] = v
    trained_on = meta.get("trained_on_file")
    stack = {k: meta[k] for k in ("python", "numpy", "scikit_learn", "xgboost") if meta.get(k)}
    macro = cr.get("macro avg") or {}
    run = {
        "id": rid,
        "kind": "classifier",
        "label": d.get("exp_name") or None,
        "model_type": d.get("model_type"),
        "date": iso(rid),
        "generation": generation_of(trained_on),
        "trained_on_file": trained_on,
        "n": {
            "processed": d.get("total_spectra_processed"),
            "train": d.get("training_set_size"),
            "test": d.get("test_set_size"),
        },
        "classes": labels,
        "class_filter": d.get("class_filter"),
        "features": {
            "candidates": len(candidates),
            "selected": len(selected) or None,
            "used": len(used),
            "gaia_photometric": gaia,
        },
        "metrics": {
            "accuracy": d.get("accuracy"),
            "balanced_accuracy": d.get("balanced_accuracy"),
            "f1_macro": macro.get("f1-score"),
            "roc_auc_macro": d.get("roc_auc_macro") if d.get("roc_auc_macro") is not None else roc.get("macro"),
            "roc_auc_micro": roc.get("micro"),
            "per_class": per_class,
            "confusion_matrix": d.get("confusion_matrix"),
        },
        "hyperparameters": params,
        "stack": stack,
        "md5": d.get("model_hash_md5"),
        "notes": d.get("notes") or None,
        "flags": {"gaia_leak": bool(gaia), "partial": False},
        "reference": False,
        "role": None,
        "source": [rel(report)] + ([rel(meta_paths[0])] if meta_paths else []),
    }
    return rid, run


def corr_rows(rows) -> dict:
    out = {}
    for r in rows or []:
        idx = r.get("index")
        if idx:
            out[idx] = {k: v for k, v in r.items() if k != "index"}
    return out


def dimred_common(p: Path, d: dict, kind: str) -> dict:
    paths = d.get("paths") or {}
    ff = features_file_of(paths.get("features_path") or paths.get("figures_dir"))
    rid = p.stem
    ts = d.get("run_timestamp_utc") or ts_of(p.stem)
    cc = d.get("class_counts") or {}
    if "y" in cc:
        cc = cc["y"]
    return {
        "id": rid,
        "kind": kind,
        "label": rid,
        "date": iso(ts),
        "generation": generation_of(ff),
        "features_file": ff,
        "class_counts": cc,
        "flags": {"gaia_leak": False, "partial": False},
        "reference": False,
        "role": None,
        "source": [rel(p)] + ([rel(p.with_suffix(".txt"))] if p.with_suffix(".txt").exists() else []),
    }


def pca_run(p: Path) -> tuple[str, dict]:
    d = load_json(p)
    run = dimred_common(p, d, "pca")
    shapes = d.get("shapes") or {}
    pf = d.get("pca_features") or {}
    ps = d.get("pca_spectra") or {}
    vs = pf.get("variance_summary_top10") or []
    vss = ps.get("variance_summary_top10") or []
    X = shapes.get("X") or [None, None]
    Xs = shapes.get("X_spec") or [None, None]
    run.update({
        "n": X[0], "p": X[1],
        "metrics": {
            "variance": [r.get("variance_individuelle") for r in vs],
            "cumulative": [r.get("variance_cumulee") for r in vs],
            "eigenvalues": [r.get("valeur_propre") for r in vs],
            "variance_total": pf.get("variance_explained_total"),
            "n_components_for_variance": pf.get("n_components_for_variance"),
            "reconstruction_mse": [r.get("mse_mean") for r in sorted(d.get("reconstruction_error") or [], key=lambda r: r["n_components"])],
            "loadings": {
                "PC1": [{"feature": r["feature"], "loading": r["loading"]} for r in pf.get("top_features_pc1") or []],
                "PC2": [{"feature": r["feature"], "loading": r["loading"]} for r in pf.get("top_features_pc2") or []],
            },
            # PC1–PC4 seulement (les composants n'affichent que les premiers axes)
            "gaia_spearman": {k: v for k, v in corr_rows(d.get("corrélations_pc_gaia_spearman")).items() if k in ("PC1", "PC2", "PC3", "PC4")},
        },
        "spectra": {
            "n": Xs[0], "channels": Xs[1],
            "variance": [r.get("variance_individuelle") for r in vss],
            "cumulative": [r.get("variance_cumulee") for r in vss],
            "n_components_for_variance": ps.get("n_components_for_variance"),
        },
    })
    return run["id"], run


def umap_run(p: Path) -> tuple[str, dict]:
    d = load_json(p)
    run = dimred_common(p, d, "umap_tsne")
    shapes = d.get("shapes") or {}
    st = d.get("stability") or {}
    hd = d.get("hdbscan_summary") or {}
    xg = d.get("xgboost_summary") or {}
    u3 = d.get("umap3d_summary") or {}
    tm = d.get("timings_seconds") or {}
    mp = xg.get("model_path") or ""
    run.update({
        "n": (shapes.get("Z_umap") or [None])[0],
        "input_dims": (shapes.get("scores_95") or [None, None])[1],
        "parameters": d.get("parameters", {}),
        "metrics": {
            "umap_fit_time_s": tm.get("umap_fit_time"),
            "tsne_fit_time_s": tm.get("tsne_fit_time"),
            "procrustes_umap": [{"seed": r["seed"], "d": r["procrustes_distance"]} for r in st.get("umap") or []],
            "procrustes_tsne": [{"seed": r["seed"], "d": r["procrustes_distance"]} for r in st.get("tsne") or []],
            "hdbscan": {
                "n_clusters": hd.get("n_clusters"), "n_noise": hd.get("n_noise"), "pct_noise": hd.get("pct_noise"),
                "largest_clusters": hd.get("largest_clusters"), "params": hd.get("params"),
                "presentation_mode": {k: v for k, v in (hd.get("presentation_mode") or {}).items() if k != "largest_clusters"} or None,
            } if hd else None,
            "xgboost_projection": {
                "n_predictions": xg.get("n_predictions"),
                "median_confidence": (xg.get("confidence_stats") or {}).get("p50"),
                "pred_class_counts": xg.get("pred_class_counts"),
                "model_run": ts_of(mp) if mp.endswith(".pkl") else None,
            } if xg else None,
            "umap3d_axis3": {"param": u3.get("axis3_best_param"), "rho": u3.get("axis3_best_corr")} if u3 else None,
        },
    })
    return run["id"], run


def ae_run(p: Path) -> tuple[str, dict]:
    d = load_json(p)
    run = dimred_common(p, d, "autoencoder")
    m = d.get("metrics") or {}
    c = (d.get("correlations") or {}).get("ae_latent_vs_physical_spearman") or {}
    t = d.get("tables") or {}
    shapes = d.get("shapes") or {}
    run.update({
        "n": (shapes.get("X") or [None])[0], "p": (shapes.get("X") or [None, None])[1],
        "metrics": {
            "mse": m.get("ae_mse_global"),
            "pca_mse_2": m.get("pca_mse_2_components"),
            "epochs": m.get("ae_epochs_done"),
            "best_val_loss": m.get("ae_best_val_loss"),
            "fit_time_s": m.get("ae_fit_time_s"),
            "latent_spearman": {k: [v.get("latent_axis_1"), v.get("latent_axis_2")] for k, v in c.items()},
            "pca_spearman": corr_rows((d.get("correlations") or {}).get("pca_corr_table")),
            "pca_mse_by_k": {str(r["n_components"]): r["mse_mean"] for r in t.get("comparison_df") or [] if r.get("method") == "PCA"},
            "mse_by_class": {r["classe"]: {"n": r["n"], "mean": r["mse_mean"], "median": r["mse_median"]} for r in t.get("reconstruction_summary") or []},
            "rho_axis1_teff": {r["method"]: r.get("ρ(axe 1, T_eff)") for r in t.get("method_summary") or []},
        },
    })
    return run["id"], run


def shap_run(csv_path: Path, classifier_runs: dict) -> tuple[str, dict]:
    folder = csv_path.parent
    rid = "shap/" + folder.relative_to(FACTS / "logs" / "shap").as_posix() if folder != FACTS / "logs" / "shap" else "shap/root"
    with csv_path.open(encoding="utf-8") as f:
        rows = [r for r in csv.DictReader(f)]
    for r in rows:
        r["mean_abs_shap"] = float(r["mean_abs_shap"])
    rows.sort(key=lambda r: -r["mean_abs_shap"])
    total = sum(r["mean_abs_shap"] for r in rows) or 1.0
    phys = sum(r["mean_abs_shap"] for r in rows if r["category"].startswith("Physical"))
    names = {r["feature"].removeprefix("num__") for r in rows}
    # Modèle analysé : classifieur dont l'ensemble de features utilisé est identique (déduction).
    model = None
    for cid, c in classifier_runs.items():
        if c.get("_used_set") == names:
            model = cid  # le plus récent l'emporte (dict trié par date)
    top30 = rows[:30]
    run = {
        "id": rid,
        "kind": "shap",
        "label": rid,
        "date": None,
        "generation": generation_of(folder.as_posix()),
        "model_run": model,
        "n_features": len(rows),
        "metrics": {
            "physical_share": phys / total,
            "gaia_photometric_share": 1 - phys / total,
            "top30_physical": sum(1 for r in top30 if r["category"].startswith("Physical")),
            "top": [
                {"rank": i + 1, "feature": r["feature"].removeprefix("num__"), "family": r["family"],
                 "category": r["category"], "mean_abs_shap": r["mean_abs_shap"]}
                for i, r in enumerate(rows[:15])
            ],
        },
        "flags": {"gaia_leak": phys < total, "partial": False},
        "reference": False,
        "role": None,
        "source": [rel(csv_path)],
    }
    return rid, run


def validation_run(csv_path: Path) -> tuple[str, dict]:
    folder = csv_path.parent
    sub = folder.relative_to(FACTS / "logs" / "validation").as_posix()
    rid = "validation/" + (sub if sub != "." else "root")
    with csv_path.open(encoding="utf-8") as f:
        rows = list(csv.DictReader(f))
    run = {
        "id": rid,
        "kind": "validation",
        "label": rid,
        "date": None,
        "generation": generation_of(folder.as_posix()),
        "metrics": {
            "checks": [
                {"feature": r.get("Feature"), "theory_matches": r.get("Theory_Matches") == "True",
                 "correlation": r.get("Correlation"), "notes": r.get("Notes")}
                for r in rows
            ]
        },
        "flags": {"gaia_leak": False, "partial": False},
        "reference": False,
        "role": None,
        "source": [rel(csv_path)],
    }
    return rid, run


SUMMARY_METRICS = {
    "classifier": ("accuracy", "balanced_accuracy", "f1_macro", "roc_auc_macro"),
    "pca": ("variance", "cumulative", "n_components_for_variance"),
    "umap_tsne": ("umap_fit_time_s", "tsne_fit_time_s"),
    "autoencoder": ("mse", "pca_mse_2", "epochs"),
}


def summarize(run: dict) -> None:
    """Réduit un run hors registre à ses chiffres principaux."""
    keep = SUMMARY_METRICS.get(run["kind"])
    if keep is not None:
        run["metrics"] = {k: v for k, v in run.get("metrics", {}).items() if k in keep}
    for k in ("hyperparameters", "class_filter", "spectra", "parameters", "stack", "classes", "class_counts", "trained_on_file"):
        run.pop(k, None)
    if "features" in run:
        run["features"]["gaia_photometric"] = len(run["features"]["gaia_photometric"])
    run["source"] = run["source"][:1]


# ─── assemblage ──────────────────────────────────────────────────────────────

def resolve(token: str, runs: dict) -> str | None:
    """Identifiant du registre → clé de runs.json."""
    t = token.strip().rstrip("/")
    t = re.sub(r"\.(json|txt)$", "", t)
    if t in runs:
        return t
    if t.startswith("logs/shap/"):
        k = "shap/" + t.removeprefix("logs/shap/")
        return k if k in runs else None
    if t.startswith("logs/validation/"):
        k = "validation/" + t.removeprefix("logs/validation/")
        return k if k in runs else None
    return None


def build() -> dict:
    text = FACTS_INDEX.read_text(encoding="utf-8")
    registry = parse_registry(text)

    runs: dict[str, dict] = {}
    # Classifieurs, triés par date
    reports = sorted(FACTS.glob("data/reports/*/session_report_*.json"), key=lambda p: p.parent.name)
    classifiers = {}
    for rp in reports:
        try:
            rid, run = classifier_run(rp)
        except (json.JSONDecodeError, KeyError, TypeError) as e:
            print(f"  ! ignoré {rel(rp)} : {e}", file=sys.stderr)
            continue
        d = load_json(rp)
        run["_used_set"] = set(d.get("selected_features") or d.get("feature_columns") or [])
        classifiers[rid] = run
    # Dimred
    for kind, fn in (("pca", pca_run), ("umap_tsne", umap_run), ("autoencoder", ae_run)):
        for p in sorted(FACTS.glob(f"data/reports/runs/phy3500_{kind}/phy3500_{kind}_run_*.json")):
            if p.stem.endswith("_latest"):
                continue  # copie d'un run daté (FACTS_INDEX §2)
            rid, run = fn(p)
            runs[rid] = run
    # SHAP et validation
    for p in sorted(FACTS.glob("logs/shap/**/shap_feature_importance.csv")):
        rid, run = shap_run(p, classifiers)
        runs[rid] = run
    for p in sorted(FACTS.glob("logs/validation/**/validation_summary.csv")):
        rid, run = validation_run(p)
        runs[rid] = run
    for rid, run in classifiers.items():
        run.pop("_used_set", None)
        runs[rid] = run

    # Registre → reference / role / partial
    reference = {}
    for key, entry in registry.items():
        ids = []
        for tok in entry["runs"]:
            rid = resolve(tok, runs)
            if rid:
                ids.append(rid)
        if not ids:
            sys.exit(f"Registre : aucun run trouvé dans _facts pour la clé « {key} » ({entry['runs']}).")
        reference[key] = ids
        partial = "partiel" in entry["status"].lower()
        for rid in ids:
            runs[rid]["reference"] = True
            runs[rid]["role"] = key
            if partial:
                runs[rid]["flags"]["partial"] = True

    # Niveau de détail : complet pour les runs du registre et ceux cités dans FACTS_INDEX.md
    # (historique §1.3, runs G2 §2…), résumé pour les autres (garde runs.json léger dans le bundle du site).
    cited = set(TS_RE.findall(text))
    for rid, run in runs.items():
        full = run["reference"] or bool(cited & set(TS_RE.findall(rid))) or run["kind"] in ("shap", "validation")
        run["detail"] = "full" if full else "summary"
        if not full:
            summarize(run)

    # Générations : N de référence
    gens = {}
    for stem, gen in GENERATIONS.items():
        gens[gen] = {"features_file": stem + ".csv"}
    pca_g1 = next((runs[r] for r in reference.get("pca", []) if runs[r]["generation"] == "G1"), None)
    if pca_g1:
        gens["G1"]["n"] = pca_g1["n"]
        gens["G1"]["p"] = pca_g1["p"]
        gens["G1"]["source"] = pca_g1["source"][0] + " (shapes.X)"
    summaries = load_json(FACTS / "csv_summaries.json") if (FACTS / "csv_summaries.json").exists() else []
    for s in summaries:
        gen = generation_of(s.get("file"))
        if gen and s["file"] == gens[gen]["features_file"] and "n" not in gens[gen]:
            gens[gen]["n"] = s["n_rows"]
            gens[gen]["source"] = "_facts/astrospectro/csv_summaries.json (n_rows)"

    manifest = (FACTS / "MANIFEST.md").read_text(encoding="utf-8") if (FACTS / "MANIFEST.md").exists() else ""
    m = re.search(r"Exporté le\s*:\s*(\S+)", manifest)
    return clean({
        "schema": SCHEMA_VERSION,
        "generated_by": "scripts/build_runs_data.py",
        "facts_export": m.group(1) if m else None,
        "registry": {k: {"label": v["label"], "runs": reference[k], "status": v["status"]} for k, v in registry.items()},
        "generations": gens,
        "runs": runs,
    })


def summary(data: dict) -> None:
    for key, entry in data["registry"].items():
        for rid in entry["runs"]:
            r = data["runs"][rid]
            m = r.get("metrics", {})
            bits = [f"{key:22s}", rid, r.get("generation") or "-"]
            if r["kind"] == "classifier":
                bits += [r.get("label") or "", f"BA={m['balanced_accuracy']:.4f}", f"AUC={m['roc_auc_macro']:.4f}",
                         f"gaia={r['features']['gaia_photometric']}"]
            if r["flags"]["partial"]:
                bits.append("PARTIEL")
            print("  ".join(str(b) for b in bits))


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[1])
    ap.add_argument("--check", action="store_true", help="échoue si runs.json n'est pas à jour")
    ap.add_argument("--summary", action="store_true", help="affiche les runs de référence")
    a = ap.parse_args()
    data = build()
    out = json.dumps(data, ensure_ascii=False, indent=1) + "\n"
    if a.check:
        cur = OUT.read_text(encoding="utf-8") if OUT.exists() else ""
        if cur != out:
            print(f"{rel(OUT)} n'est pas à jour : relancer python3 scripts/build_runs_data.py", file=sys.stderr)
            return 1
        print(f"{rel(OUT)} à jour ({len(data['runs'])} runs).")
    else:
        OUT.parent.mkdir(parents=True, exist_ok=True)
        OUT.write_text(out, encoding="utf-8")
        print(f"Écrit {rel(OUT)} : {len(data['runs'])} runs, {len(out) / 1024:.0f} Ko.")
    if a.summary:
        summary(data)
    return 0


if __name__ == "__main__":
    sys.exit(main())
