---
title: Roadmap
description: What AstroSpectro already does, what is planned next, and known issues — three axes (scientific content, models and data, infrastructure), with each status checked against the code repository.
sidebar_position: 1
---

{/* facts: aucun chiffre de run — états vérifiés dans AstroSpectro/src (HEAD du dépôt de code lu le 2026-11-04) ; axes repris de docs/_archive/community/roadmap.mdx, chiffres non sourcés retirés */}

# Roadmap

This page is a living document. It lists what the pipeline does today, what is planned, and what is known to be unfinished. Contributions that tackle any open item are welcome: see [Contributing](./contributing.md).

:::info[How the statuses were set]
A box is ticked only if the corresponding code exists in the [AstroSpectro repository](https://github.com/PhD-Brown/AstroSpectro) (`src/`, `app.py`, `.devcontainer/`, `.github/`). The repository also keeps a more detailed `ROADMAP.md`, in French; some of its boxes are older than the code and may not match it.
:::

---

## Axis 1 — Scientific content

Extract more, and more reliable, information from each spectrum.

- [x] Base measurements on six lines (Hα, Hβ, Ca II K and H, Mg b, Na D): prominence, FWHM and equivalent width.
- [x] Line ratios and spectral indices (among them TiO5, Dn4000, G4300, CaH2, CaH3).
- [x] Extended extractor: molecular bands, extended Balmer series, metal lines, extended indices, continuum analysis, line profiles, synthetic colours and composite indices. See [Feature engineering theory](../pipeline/feature-engineering-theory.mdx).
- [x] Gaia DR3 cross-match and derived quantities (distance, absolute magnitudes, tangential velocity).
- [x] `spectro_only` mode, which removes non-spectroscopic columns by name. See [Spectro-only mode](../concepts/spectro-only-mode.md) and the [Data Leakage Audit](../concepts/data-leakage-audit.mdx) for its present limits.
- [x] SHAP interpretability (notebook `04_shap_interpretability`). See [SHAP interpretability](../science/shap-interpretability.md).
- [ ] Anomaly detection: intersect the HDBSCAN noise points with the spectra of highest autoencoder reconstruction error.
- [ ] Characterise the HDBSCAN clusters against rare objects (variables, binaries, red-giant-branch stars).

## Axis 2 — Models and data

Explore better models and richer data handling.

- [x] XGBoost as the main model, with RandomForest as an alternative.
- [x] Other estimators selectable in `SpectralClassifier`: LightGBM, CatBoost, ExtraTrees, SVM, k-NN, MLP, soft voting and others. See the [Classifier API](../api/classifier.md).
- [x] Grid and randomised hyper-parameter search with cross-validation.
- [x] Probability calibration (sigmoid, isotonic) and an Expected Calibration Error helper.
- [x] Dimensionality reduction and clustering: PCA, UMAP, t-SNE, HDBSCAN, and a spectral autoencoder (PyTorch) in `src/dimred/`. See the [dimensionality reduction](../dimred/index.mdx) section.
- [x] Opt-in Weights & Biases logging (`use_wandb`). See [Experiment tracking](../pipeline/experiment-tracking.md).
- Partial: class-imbalance oversampling (SMOTE and variants) is integrated as an option of `SpectralClassifier`; the default is no oversampling.
- [ ] Optuna-based search: not in the code today; hyper-parameters are searched with `GridSearchCV` or `RandomizedSearchCV`.
- [ ] Extension to other LAMOST releases or to SDSS (see multi-survey support below).
- [ ] 1D convolutional network on the raw flux: planned, not implemented.

## Axis 3 — Infrastructure

Make the pipeline more robust, more accessible and easier to use.

- [x] Modular layout (`src/pipeline/`, `src/dimred/`, `src/tools/`) packaged with `pyproject.toml`. See [Project structure](../concepts/project-structure.mdx).
- [x] GitHub Codespaces dev container: no local installation needed.
- [x] Documentation deployed to GitHub Pages with GitHub Actions.
- [x] Streamlit application (`app.py`).
- [x] Parallel feature extraction: a thread pool for reading files, a process pool for the CPU-bound stage. See [Processing pipeline](../pipeline/processing-pipeline.md).
- [x] Timestamped artefacts for every run: model pickle plus JSON metadata.
- [ ] Automated tests: the repository has no test suite yet.
- [ ] REST API for predictions (a `/predict` endpoint).
- [ ] Workflow orchestration (Snakemake or Prefect) to chain download, preprocessing, features, classification and reporting.
- [ ] Multi-survey support (SDSS, Gaia RVS).

---

## Upcoming releases

An earlier version of this page gave Q3 2026 as the target for v1.1. That date has passed and is not repeated here.

### v1.1

- [ ] Optuna hyper-parameter optimisation, tracked with Weights & Biases sweeps.
- [ ] Scale the processing to the full set of downloaded FITS files, once the Gaia cross-match issue below is solved.
- [ ] Archive the canonical model artefact with its full metadata.
- [ ] Submit the manuscript (see [Citing AstroSpectro](./citing.md)).

### v1.2

- [ ] Extension to a later LAMOST release or to SDSS.
- [ ] Anomaly-detection pipeline (HDBSCAN noise intersected with high reconstruction error).
- [ ] Identification of binary-star candidates.

## Known issues

- Gaia cross-match instability blocking the large-scale extension.
- Feature-count discrepancy: resolved in the documentation, model artefact still to be regenerated.
- Optuna is not integrated: searches use `GridSearchCV`.

---

## See also

- [Community](./index.md)
- [Current status](../overview/current-status.md)
- [Limitations](../science/limitations.md)
