#!/usr/bin/env python3
"""
build_xi_data.py — Génère website/src/data/xi/facts.json à partir de _facts/xi/ et du registre de
_facts/xi/FACTS_INDEX.md.

Décision éditoriale n° 4 : la documentation doit passer à un nouveau run en quelques minutes. Les pages ξ lisent leurs
chiffres dans facts.json (composants de website/src/components/xi/, <Fact/>), jamais recopiés à la main.

Usage (depuis la racine du dépôt, bibliothèque standard uniquement) :
    python3 scripts/build_xi_data.py            # écrit facts.json
    python3 scripts/build_xi_data.py --check    # code 1 si facts.json n'est pas à jour
    python3 scripts/build_xi_data.py --summary  # affiche les chiffres clés et les contrôles de cohérence

Lit uniquement le dossier de résultats nommé dans le registre (jamais les fichiers de la racine de results/, qui sont
ceux d'un run quick — FACTS_INDEX §2.1). Échoue (code 2) si un contrôle de cohérence casse : mieux vaut un build
rouge qu'un chiffre faux publié.
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
FACTS = REPO / "_facts" / "xi"
INDEX = FACTS / "FACTS_INDEX.md"
OUT = REPO / "website" / "src" / "data" / "xi" / "facts.json"
SCHEMA_VERSION = 1

# Valeurs de CONFIGURATION lues dans le code de PhD-Brown/xi-dark-energy-bao-mcmc @ 25ed86e (FACTS_INDEX §3).
# Ce ne sont pas des résultats ; le pack ne contient pas src/ : à remplacer par une extraction dès qu'il l'inclura.
CODE_COMMIT = "25ed86e"
SCRIPT = "src/xi_protocol1b_bao_run.py"
CONFIG = {
    "source": {"repo": "PhD-Brown/xi-dark-energy-bao-mcmc", "commit": CODE_COMMIT, "file": SCRIPT},
    "z_cut": 0.01,                       # load_pantheon_data(zcut=0.01)
    "c_light_km_s": 299792.458,          # C_LIGHT
    "ngrid": 3000,                       # distance_grids(ngrid=3000)
    "priors": {                          # log_prior : bornes ouvertes (top-hat)
        "H0": [50.0, 100.0], "Omega_m": [0.1, 0.5],
        "w0": [-2.0, 0.0], "wa": [-3.0, 2.0],
        "w0_mean": [-1.5, -0.5], "eps": [0.0, 0.3], "T_Gyr": [1.0, 10.0], "phi0": ["-pi", "pi"],
    },
    "init_center": {                     # model_setup ; boule gaussienne de 1 % (make_initial_walkers)
        "LCDM": {"H0": 70.0, "Omega_m": 0.3},
        "CPL": {"H0": 70.0, "Omega_m": 0.3, "w0": -1.0, "wa": 0.0},
        "Xi_osc": {"H0": 70.0, "Omega_m": 0.3, "w0_mean": -1.0, "eps": 0.1, "T_Gyr": 2.8, "phi0": 0.0},
    },
    "init_spread_fraction": 0.01,
    "quick": {"nsteps": 500, "burn_in": 100, "nwalkers": 32},
    "default": {"nsteps": 5000, "burn_in": 1000, "nwalkers": 32},
    "xi_time_reference": {"H0": 70.0, "Omega_m": 0.3, "T_cmb_K": 2.725},   # XiOscillator
    "convergence_factor": 50,            # diagnostics.convergence_flag(factor=50.0)
}

MODELS = ["LCDM", "CPL", "Xi_osc"]
MODEL_K = {"LCDM": 2, "CPL": 4, "Xi_osc": 6}
TAU_ORDER = ["H0", "Omega_m", "w0_mean", "eps", "T_Gyr", "phi0"]


class FactsError(Exception):
    pass


def rel(p: Path) -> str:
    return p.relative_to(REPO).as_posix()


def need(cond: bool, msg: str):
    if not cond:
        raise FactsError(msg)


def read(p: Path) -> str:
    need(p.exists(), f"fichier manquant : {rel(p)}")
    return p.read_text(encoding="utf-8", errors="replace")


def read_registry() -> dict:
    reg = {}
    for line in read(INDEX).splitlines():
        m = re.match(r"\|\s*`(\w+)`\s*\|(.*)", line)
        if not m:
            continue
        cells = [c.strip() for c in line.strip().strip("|").split("|")]
        dirs = re.findall(r"`([^`]+)`", cells[2]) if len(cells) > 2 else []
        d = next((x for x in dirs if x.startswith("results/")), None)
        reg[m.group(1)] = {"role": cells[1], "dir": d, "status": cells[3] if len(cells) > 3 else ""}
    need("protocol1b" in reg and reg["protocol1b"]["dir"], "registre : clé `protocol1b` ou son dossier introuvable")
    return reg


def read_csv(p: Path) -> list[dict]:
    need(p.exists(), f"fichier manquant : {rel(p)}")
    with p.open(encoding="utf-8", newline="") as f:
        return list(csv.DictReader(f))


def parse_summary(txt: str) -> dict:
    def g(pat, cast=str):
        m = re.search(pat, txt)
        need(m is not None, f"summary : motif introuvable {pat!r}")
        return cast(m.group(1))

    out = {
        "n_sne": g(r"SNe utilis\S*:\s*(\d+)", int), "n_bao": g(r"BAO utilis\S*:\s*(\d+)", int),
        "rd_mpc": g(r"rd fix\S*:\s*([\d.]+)", float),
        "quick": g(r"Quick mode:\s*(\w+)") == "True",
        "acceptance": {},
    }
    for model in MODELS:
        m = re.search(rf"--- {model} ---(.*?)(?=\n--- |\n\nComparaison|\n\nModel comparison|\Z)", txt, re.S)
        need(m is not None, f"summary : bloc {model} introuvable")
        a = re.search(r"acceptance\s*=\s*([\d.]+)", m.group(1))
        need(a is not None, f"summary : acceptance {model} introuvable")
        out["acceptance"][model] = float(a.group(1))
    return out


def parse_log(txt: str) -> dict:
    prog = re.findall(r"(\d+)/(\d+) \[", txt)
    need(prog, "log : barre de progression introuvable")
    done, total = (int(prog[-1][0]), int(prog[-1][1]))
    need(done == total, f"log : run incomplet ({done}/{total})")
    kept = re.search(r"chantillons conserv\S* = (\d+)", txt)
    acc = re.search(r"acceptance fraction moyenne = ([\d.]+)", txt)
    tau = re.search(r"autocorr time tau = \[([^\]]*)\]", txt)
    need(kept and acc and tau, "log : échantillons / acceptance / tau introuvables")
    taus = [float(x) for x in tau.group(1).split()]
    need(len(taus) == len(TAU_ORDER), f"log : {len(taus)} valeurs de tau, {len(TAU_ORDER)} attendues")
    return {"nsteps": total, "samples_kept_xi": int(kept.group(1)), "acceptance_xi": float(acc.group(1)),
            "tau_xi": dict(zip(TAU_ORDER, taus))}


def parse_repro(txt: str) -> dict:
    m = re.search(r"--nsteps\s+(\d+)\s+--burn-in\s+(\d+)\s+--nwalkers\s+(\d+)", txt)
    need(m, "reproducibility.md : commande du run final introuvable")
    return {"nsteps": int(m.group(1)), "burn_in": int(m.group(2)), "nwalkers": int(m.group(3)), "command": m.group(0)}


def parse_tex(txt: str) -> dict:
    n = re.search(r"sur un total initial de \$(\d+)\$", txt)
    z = re.search(r"z \\in \[([\d.]+),\\ ([\d.]+)\]", txt)
    need(n and z, "main.tex : total initial de SNe / plage de z introuvables")
    t = re.search(r"N_\{\\rm total\} = N_\{\\rm SNe\} \+ N_\{\\rm BAO\} = \d+ \+ \d+ = (\d+)", txt)
    need(t, "main.tex : N total introuvable")
    return {"n_sne_before_cut": int(n.group(1)), "z_min": float(z.group(1)), "z_max": float(z.group(2)),
            "n_total": int(t.group(1))}


def parse_manifest(txt: str) -> dict:
    out = {}
    for m in re.finditer(r"chains/chains_(\w+)_combined\.npy`[^\n]*?\(\.npy, ([\d.]+) Mo\)", txt):
        out[m.group(1)] = float(m.group(2))
    need(set(out) == set(MODELS), f"MANIFEST : tailles de chaînes trouvées pour {sorted(out)}")
    return out


def build() -> dict:
    reg = read_registry()
    d = FACTS / reg["protocol1b"]["dir"]
    est = read_csv(d / "final_parameter_estimates.csv")
    cmp_rows = read_csv(d / "final_model_comparison.csv")
    summ = parse_summary(read(d / "summary_protocol1b_combined.txt"))
    need(not summ["quick"], "le résumé du dossier de référence est un run quick")
    logs = sorted(d.glob("*.log"))
    need(len(logs) == 1, f"un seul journal attendu dans {rel(d)}, trouvé {[p.name for p in logs]}")
    log = parse_log(read(logs[0]))
    repro = parse_repro(read(FACTS / "docs" / "reproducibility.md"))
    tex = parse_tex(read(FACTS / "reports" / "latex" / "main.tex"))
    chains_mb = parse_manifest(read(FACTS / "MANIFEST.md"))

    models: dict = {m: {"k": MODEL_K[m], "params": {}} for m in MODELS}
    for r in est:
        m, p = r["model"], r["parameter"]
        need(m in models, f"modèle inconnu dans le CSV : {m}")
        models[m]["params"][p] = {"median": float(r["median"]), "plus": float(r["plus"]), "minus": float(r["minus"]),
                                  "unit": r["unit"] or ""}
    for r in cmp_rows:
        m = r["model"]
        need(m in models, f"modèle inconnu dans le CSV de comparaison : {m}")
        models[m].update(chi2=float(r["chi2"]), aic=float(r["aic"]), bic=float(r["bic"]), delta_aic=float(r["delta_aic"]))
        need(int(r["k"]) == MODEL_K[m], f"k incohérent pour {m}")
    for m in MODELS:
        need(len(models[m]["params"]) == MODEL_K[m], f"{m} : {len(models[m]['params'])} paramètres, {MODEL_K[m]} attendus")
        models[m]["acceptance"] = summ["acceptance"][m]
    models["Xi_osc"]["tau"] = log["tau_xi"]
    models["Xi_osc"]["tau_max"] = max(log["tau_xi"].values())
    models["Xi_osc"]["tau_max_param"] = max(log["tau_xi"], key=log["tau_xi"].get)

    # ── contrôles de cohérence (échec = build rouge)
    n = summ["n_sne"] + summ["n_bao"]          # le résumé final n'écrit pas « N total » (FACTS_INDEX §1.2)
    need(n == tex["n_total"], f"N total : {n} (SNe + BAO) ≠ {tex['n_total']} (main.tex)")
    need(repro["nsteps"] == log["nsteps"], "pas : commande ≠ barre de progression du log")
    kept = (repro["nsteps"] - repro["burn_in"]) * repro["nwalkers"]
    need(kept == log["samples_kept_xi"], f"échantillons conservés : {kept} calculé ≠ {log['samples_kept_xi']} log")
    for m in MODELS:
        x = models[m]
        need(abs(x["aic"] - (x["chi2"] + 2 * x["k"])) < 2e-3, f"{m} : AIC ≠ χ² + 2k")
        need(abs(x["bic"] - (x["chi2"] + x["k"] * math.log(n))) < 2e-3, f"{m} : BIC ≠ χ² + k ln N")
        # taille de chaîne float64 : N échantillons × k × 8 octets
        need(abs(kept * x["k"] * 8 / 1e6 - chains_mb[m]) < 0.1, f"{m} : taille de chaîne ≠ MANIFEST")
        x["chain_mb"] = chains_mb[m]
    amin = min(models[m]["aic"] for m in MODELS)
    for m in MODELS:
        need(abs(models[m]["aic"] - amin - models[m]["delta_aic"]) < 2e-3, f"{m} : ΔAIC incohérent")
    need(abs(log["acceptance_xi"] - models["Xi_osc"]["acceptance"]) < 1e-3, "acceptation Ξosc : log ≠ summary")

    eps = models["Xi_osc"]["params"]["eps"]
    sigma = 0.5 * (eps["plus"] + eps["minus"])
    best = min(MODELS, key=lambda m: models[m]["aic"])
    lowest_chi2 = min(MODELS, key=lambda m: models[m]["chi2"])
    best_bic = min(MODELS, key=lambda m: models[m]["bic"])
    n_over = repro["nsteps"] / CONFIG["convergence_factor"]

    return {
        "schema_version": SCHEMA_VERSION,
        "registry": reg,
        "protocols": {"protocol1b": {
            "dir": reg["protocol1b"]["dir"],
            "label": "Protocol 1b — Pantheon+SH0ES + DESI DR2 BAO",
            "data": {"n_sne": summ["n_sne"], "n_sne_before_cut": tex["n_sne_before_cut"], "z_min": tex["z_min"],
                     "z_max": tex["z_max"], "n_bao": summ["n_bao"], "n_total": n, "rd_mpc": summ["rd_mpc"]},
            "run": {"nsteps": repro["nsteps"], "burn_in": repro["burn_in"], "nwalkers": repro["nwalkers"],
                    "samples_kept": log["samples_kept_xi"], "command": repro["command"]},
            "models": models,
            "ranking": {"best_aic": best, "lowest_chi2": lowest_chi2, "best_bic": best_bic},
            "eps": {"median": eps["median"], "plus": eps["plus"], "minus": eps["minus"], "sigma_sym": sigma,
                    "significance": eps["median"] / sigma, "prior_max": CONFIG["priors"]["eps"][1],
                    "upper_1sigma": eps["median"] + eps["plus"]},
            "convergence": {"n_over_50": n_over, "tau_max": models["Xi_osc"]["tau_max"],
                            "margin": n_over / models["Xi_osc"]["tau_max"],
                            "criterion_met": n_over > models["Xi_osc"]["tau_max"]},
        }},
        "config": CONFIG,
        "provenance": {"results_dir": reg["protocol1b"]["dir"], "log": logs[0].name,
                       "note": "facts.json est généré — ne pas éditer ; voir _facts/xi/FACTS_INDEX.md"},
    }


def dumps(obj) -> str:
    return json.dumps(obj, indent=2, ensure_ascii=False) + "\n"


def summary(d: dict):
    p = d["protocols"]["protocol1b"]
    print(f"protocol1b ← {p['dir']}  (journal {d['provenance']['log']})")
    print(f"  N = {p['data']['n_sne']} SNe + {p['data']['n_bao']} BAO = {p['data']['n_total']} · r_d = {p['data']['rd_mpc']} Mpc")
    r = p["run"]
    print(f"  run : {r['nsteps']} pas · burn-in {r['burn_in']} · {r['nwalkers']} walkers · {r['samples_kept']} échantillons/modèle")
    for m in MODELS:
        x = p["models"][m]
        print(f"  {m:7s} χ²={x['chi2']:.3f} k={x['k']} AIC={x['aic']:.3f} BIC={x['bic']:.3f} ΔAIC={x['delta_aic']:.3f} acc={x['acceptance']:.4f}")
    e = p["eps"]
    print(f"  ε = {e['median']:.4f} +{e['plus']:.4f} −{e['minus']:.4f} · σ_sym = {e['sigma_sym']:.4f} · ε/σ = {e['significance']:.3f}")
    c = p["convergence"]
    print(f"  N/50 = {c['n_over_50']:.0f} vs τ_max = {c['tau_max']:.1f} → critère {'satisfait' if c['criterion_met'] else 'NON satisfait'}")
    print(f"  classement : AIC {p['ranking']['best_aic']} · χ² {p['ranking']['lowest_chi2']} · BIC {p['ranking']['best_bic']}")
    print("  contrôles de cohérence : OK (AIC/BIC recalculés, échantillons = (pas − burn-in) × walkers, tailles de chaînes)")


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--check", action="store_true")
    ap.add_argument("--summary", action="store_true")
    a = ap.parse_args()
    try:
        data = build()
    except FactsError as e:
        print(f"ERREUR : {e}", file=sys.stderr)
        return 2
    text = dumps(data)
    if a.summary:
        summary(data)
    if a.check:
        ok = OUT.exists() and OUT.read_text(encoding="utf-8") == text
        print("facts.json à jour" if ok else "facts.json PÉRIMÉ — relancer scripts/build_xi_data.py", file=None if ok else sys.stderr)
        return 0 if ok else 1
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(text, encoding="utf-8")
    print(f"écrit {rel(OUT)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
