# STUBS — pages `UnderConstruction` à rédiger

> Inventaire du 2026-11-03 sur `main` : **98 pages** importent `@site/src/components/UnderConstruction`
> (AstroSpectro 33 · Atlas 5 · AstroVision 35 · ξ Dark Energy 25). Aucune n'est modifiée par cette PR.
>
> Pour chaque page : priorité, fichiers sources qui l'alimentent (code dans `PhD-Brown/AstroSpectro`,
> chiffres dans `_facts/astrospectro/` — voir `FACTS_INDEX.md`), et **pièges** relevés en lisant le stub.
> Les puces « What this page covers » des stubs contiennent des chiffres **non sourcés** : ne pas les recopier.
>
> Procédure de rédaction : skill `.claude/skills/docs-page` ; vérification : `.claude/skills/docs-verify`.

## Priorités

| Niveau | Critère |
|---|---|
| **P1** | Sur le chemin de lecture principal (liée depuis `astrospectro/index`, `ResultsLocator`, `WhatAstroSpectroDoes`, sidebar d'entrée) **ou** porte une affirmation scientifique centrale ; chiffres disponibles dans `_facts/`. |
| **P2** | Page technique dont le contenu se déduit du code ; peu ou pas de chiffres. |
| **P3** | Référence API / communauté ; contenu mécanique (docstrings, traduction de `_archive/`). |
| **Bloqué** | Chiffres nécessaires absents de `_facts/` → rédiger sans chiffres ou demander un nouvel export. |

Abréviations : `AS/` = dépôt `PhD-Brown/AstroSpectro` ; `F/` = `_facts/astrospectro/` ; `G1`/`G2` = générations de données (FACTS_INDEX §0).

---

## 1. AstroSpectro (33 pages) — à traiter en premier

### 1.1 P1 — chemin critique

| # | Page (`website/docs/…`) | Sources | Pièges / décisions |
|---|---|---|---|
| 1 | `astrospectro/science/validation.md` | `F/logs/validation/features_20260522T153123Z/validation_summary.csv` + figures (G2) ; idem `features_20260305T174836Z/` (G1) ; `F/logs/shap/*/shap_feature_importance.csv` (part physique) ; négatif : `static/img/dimred/umap_negative_control.png` ; `AS/notebooks/03_scientific_validation.ipynb` | Le stub annonce « SHAP physical feature fraction (97.9 %) » : 97.9 % = part Σ\|SHAP\| du run **v5**, pas une fraction du top-30 (FACTS_INDEX §3). Ca II K vs [M/H] est **inversé** en G1 (ρ = −0.324) et non mesurable en G2 (spectro_only) : le dire. Liée par `ResultsLocator`. |
| 2 | `astrospectro/pipeline/classification.md` | `AS/src/pipeline/classifier.py` (`SpectralClassifier`, `CollinearityFilter`, `ThresholdTunedClassifier`, `_ece_score`) ; `F/data/models/spectral_classifier_xgboost_20260522T161236Z_meta.json` ; `F/data/reports/last_config_used.json` | Le stub annonce « SMOTE class balancing » : la config de référence a `sampler: null` et `use_balanced_weights: true` → SMOTE est une **option** du code, pas le réglage retenu. Signaler la fuite Gaia de v6 (FACTS_INDEX §1.1). Liée par `WhatAstroSpectroDoes`, `ResultsLocator`, `CrossReferences` (index). |
| 3 | `astrospectro/pipeline/preprocessing.md` | `AS/src/pipeline/preprocessor.py` (`SpectraPreprocessor`, `ProcessedSpectrum`) ; `AS/src/utils.py` (`sanitize_invvar`, `safe_sigma_from_invvar`, `make_stddev_uncertainty_from_invvar`) | Vérifier dans le code chaque puce du stub (« inverse-variance weighting », « wavelength grid interpolation », « flux clipping ») avant de l'écrire. Ne pas dupliquer `guides/preprocessing.mdx` (guide) : cette page = concept/pipeline. Liée par `WhatAstroSpectroDoes`. |
| 4 | `astrospectro/pipeline/index.md` | `AS/src/pipeline/*`, `AS/src/tools/*`, `AS/notebooks/00_master_pipeline.ipynb` | Page hub : pas de chiffres ; diagramme Mermaid FITS → catalogue → prétraitement → pics → features → classifieur. |
| 5 | `astrospectro/data/index.md` | FACTS_INDEX §0 et §5 ; `F/csv_summaries.json` | Page hub. Annoncer clairement les deux générations (G1 43 019 dimred / G2 349 998 classifieur). |
| 6 | `astrospectro/science/fg-confusion.md` | v6 : `confusion_matrix`, `classification_report.F/G` ; `F/data/reports/20260522T161236Z/confusion_matrix_xgboost_20260522T161236Z.png` ; `static/img/dimred/umap_xgboost_FG_confusion.png` (G1, modèle v5) ; `F/logs/shap/features_20260522T153123Z/{class_specific_importance,beeswarm_per_class}.png` | « Comparison with manual classification agreement rates » : **aucune source** → retirer. La figure UMAP F/G publiée vient de G1 + v5 : légender en conséquence. |
| 7 | `astrospectro/overview/current-status.md` | Runs v6/v7 (FACTS_INDEX §1) ; `concepts/data-leakage-audit.mdx` | « Planned v1.1 (Optuna, 139k spectra) », « RNAAS in preparation » : pas dans `_facts` → formuler comme intention, sans chiffre. |
| 8 | `astrospectro/concepts/reproducibility.md` | `AS/src/dimred/run_reporter.py` (paires `.json/.txt`, `make_timestamp`) ; `AS/src/utils.py` (`md5sum`, `utc_now_tag`) ; champs `_meta.json` ; `random_state` 42 ; `AS/src/pipeline/wandb_config.py` | « 85+ W&B runs » : sans source. Chiffre sourçable à la place : nombre de `session_report_*.json` présents dans `F/data/reports/`. |

### 1.2 P2 — contenu technique déduit du code

| # | Page | Sources | Pièges / décisions |
|---|---|---|---|
| 9 | `astrospectro/pipeline/peak-detection.md` | `AS/src/pipeline/peak_detector.py` (`PeakDetector`, `matches_to_dataframe`, `matches_to_series`) ; `AS/src/pipeline/feature_engineering.py` (`SpectralLineLibrary`, `LineDefinition`) | « NIST wavelengths » : vérifier l'origine des longueurs d'onde dans `SpectralLineLibrary`. |
| 10 | `astrospectro/pipeline/processing-pipeline.md` | `AS/src/pipeline/processing.py` (`ProcessingPipeline`, `_init_cpu_worker`, `_compute_features_worker`) | Expliquer l'origine des colonnes `match_*` et l'aiguillage `spectro_only`. |
| 11 | `astrospectro/pipeline/master-pipeline.md` | `AS/src/pipeline/master.py` (`MasterPipeline`, presets `_save_preset/_load_preset`, `_load_runs_table`) | Ignorer `AS/src/pipeline/master (1).py` (copie). Le stub parle de « Configuration via YAML » : à vérifier (le code utilise des presets JSON via widgets). |
| 12 | `astrospectro/pipeline/experiment-tracking.md` | `AS/src/pipeline/wandb_config.py` (`should_use_wandb`, `init_wandb_run`) ; `use_wandb` dans `last_config_used.json` | **Bloqué partiellement** : aucun log W&B dans `_facts` (« 85+ runs », « 121 metrics » invérifiables). |
| 13 | `astrospectro/data/gaia-dr3.md` | `AS/src/tools/gaia_crossmatcher.py` (`enrich_catalog_with_gaia`, modes `_xmatch/_cone/_bulk_crossmatch`, `RISKY_FIELDS`, `_add_derived_columns`) | Rayon : le stub dit 1.5″, `DatasetStats` dit 1″, la docstring montre 0.5″ → lire la valeur réellement passée dans `AS/notebooks/00_master_pipeline.ipynb`. RUWE : le code **conserve** la ligne et vide les colonnes Gaia si `RUWE ≥ ruwe_max` (pas de rejet). Taux d'appariement : **bloqué** (absent de `_facts`). |
| 14 | `astrospectro/guides/connexion-gaia.mdx` | Idem + `.env` décrit dans `guides/installation.mdx` (étape « Configure `.env` (Gaia) ») | Guide pas-à-pas ; la source FR est vide (MIGRATION_MAP). |
| 15 | `astrospectro/data/master-catalog.md` | `AS/src/tools/generate_catalog_from_fits.py` (`_row_from_header`, `generate_catalog_from_fits`) ; `AS/src/tools/dataset_builder.py` (`DatasetBuilder`) ; `F/csv_summaries.json` (liste des 107 colonnes de `master_catalog_gaia.csv`) | « N = 43,019 after cleaning » est le jeu dimred G1, pas le catalogue maître. L'instantané de `csv_summaries.json` n'a que 4 999 lignes : ne pas le présenter comme la taille du catalogue. |
| 16 | `astrospectro/data/quality-filters.md` | `AS/src/dimred/data_loader.py` (`snr_min=10` sur `snr_r`, filtre `>=`) ; `AS/src/tools/gaia_crossmatcher.py` (`ruwe_max`) | Le site écrit « SNR_r > 10 » (code : `>=`) et présente RUWE < 1.4 comme un rejet (code : masquage). Comptes par étape : **bloqué**. |
| 17 | `astrospectro/data/dataset-versions.md` | `total_spectra_processed` des `session_report` (1 000 · 49 999 · 99 999 · 349 998) ; shapes des runs PCA (43 019 · 59 786 · 153 052 · 153 060) ; `F/csv_summaries.json` (fichiers `features_*.csv`) | « v1 : 5 000 », « v3 : 139 000+ » : sans source. Construire la table des versions **uniquement** à partir de ces fichiers. |
| 18 | `astrospectro/dimred/sensitivity.md` | `AS/src/dimred/hdbscan_analyzer.py` (`compute_sensitivity`) ; `AS/src/dimred/embedding.py` (`EmbeddingEngine`, `compare_embeddings`) ; Procrustes FACTS_INDEX §2.3 ; figures `umap_sensitivity_n_neighbors.png`, `tsne_sensitivity_perplexity.png`, `umap_hdbscan_sensitivity.png`, `stability_{umap,tsne}.png` (G1, déjà dans `static/img/dimred/`) | `min_dist` et `min_samples` ne sont pas balayés dans les runs (seuls `n_neighbors` et `perplexity` ont des `sensitivity_shapes`). Réutiliser `HyperparamSensitivity` / `ProcrustesStability` plutôt que dupliquer `dimred/index`. |
| 19 | `astrospectro/science/feature-physics.md` | `AS/src/pipeline/feature_engineering.py` ; `F/logs/shap/*/discoveries.csv` (famille, rang, verdict) ; validation §4 | Canonique ? Recoupe `data/feature-catalog.md` et `pipeline/feature-engineering-theory.mdx` : se limiter à l'interprétation physique et lier le reste. |
| 20 | `astrospectro/concepts/pipeline-philosophy.md` | `astrospectro/index.mdx` (`ProjectPhilosophy`), `AS/README.md` | « 87 % BA vs 100 % physical purity » : préciser v5 vs v6/v7 (FACTS_INDEX §1.3). |
| 21 | `astrospectro/concepts/data-lifecycle.md` | `AS/src/tools/dr5_downloader.py` → `generate_catalog_from_fits.py` → `gaia_crossmatcher.py` → `src/pipeline/*` → `logs/shap`, `logs/validation` | Diagramme de flux ; aucun chiffre requis. |
| 22 | `astrospectro/overview/project-map.md` | Arborescence `AS/src/`, `AS/notebooks/` | Ne pas dupliquer `concepts/project-structure.mdx` : carte des dépendances entre modules. |

### 1.3 P3 — API et communauté

| # | Page | Sources | Pièges / décisions |
|---|---|---|---|
| 23 | `astrospectro/api/index.md` | `website/docs/api/index.mdx` (FR, complet) | Fusionner puis retirer `docs/api/` (MIGRATION_MAP §3). |
| 24 | `astrospectro/api/preprocessor.md` | `website/docs/api/preprocessor.mdx` (FR) ; `AS/src/pipeline/preprocessor.py` | Signatures à revérifier dans le code. |
| 25 | `astrospectro/api/feature-engineer.md` | `website/docs/api/feature-engineer.mdx` (FR) ; `AS/src/pipeline/feature_engineering.py` | Idem. |
| 26 | `astrospectro/api/classifier.md` | `website/docs/api/classifier.mdx` (FR) ; `AS/src/pipeline/classifier.py` | Idem. |
| 27 | `astrospectro/api/master-pipeline.md` | `AS/src/pipeline/master.py` | Aucune source FR. |
| 28 | `astrospectro/api/dimred/data-loader.md` | `AS/src/dimred/data_loader.py` (`DimRedDataLoader`, `SpectralMatrixLoader`) | Le stub suppose `fit()/transform()` : ces classes exposent `load(...)`. |
| 29 | `astrospectro/api/dimred/pca-analyzer.md` | `AS/src/dimred/pca_analyzer.py` (`PCAAnalyzer`) | — |
| 30 | `astrospectro/api/dimred/embedding.md` | `AS/src/dimred/embedding.py` (`EmbeddingEngine`, `compare_embeddings`) | — |
| 31 | `astrospectro/api/dimred/hdbscan-analyzer.md` | `AS/src/dimred/hdbscan_analyzer.py` (`HDBSCANAnalyzer`, `compute_sensitivity`, `compute_feature_profiles`) | — |
| 32 | `astrospectro/community/contributing.md` | `website/docs/_archive/community/contributing.mdx` (FR) ; `AS/pyproject.toml`, `.pre-commit-config.yaml` | Voir MIGRATION_MAP. |
| 33 | `astrospectro/community/faq.md` | `website/docs/_archive/community/faq.mdx` (FR) | « How do I reproduce the 87 % result? » → reformuler sur v6 (BA 89.2 %) ou v5 explicitement. |

**Pages API manquantes** (modules sans page, à créer plus tard) : `AS/src/dimred/autoencoder.py` (`SpectralAutoencoder`, `tester_candidat`, `latent_arithmetic`), `xgboost_bridge.py`, `run_reporter.py`, `dimred_visualizer.py`, `AS/src/tools/*` (`SmartDownloader`, `SpectraManager`, `AstroVisualizer`).

---

## 2. Atlas (5 pages, transverses)

| Page | Priorité | Sources |
|---|---|---|
| `atlas/notebook-atlas.md` | P2 | `AS/notebooks/{00..04}_*.ipynb`, `AS/notebooks/dimred/phy3500_0{1,2,3}_*.ipynb` ; `AstroVision/notebooks/00–10` ; `xi-dark-energy-bao-mcmc/notebooks/00–03` |
| `atlas/figures-index.md` | P2 | `website/static/img/dimred/` (67 fichiers) + table « Figures déjà sur le site » de `F/MANIFEST.md` ; figures G2 non publiées listées dans FACTS_INDEX |
| `atlas/datasets-index.md` | P2 | FACTS_INDEX §0, §5 ; pages data de chaque projet |
| `atlas/methods-index.md` | P3 | Pages méthodes existantes (dimred/*, science/shap-interpretability, AstroVision/Xi stubs) |
| `atlas/repository-map.md` | P3 | Les 4 dépôts + `PhD-Brown.github.io` |

---

## 3. AstroVision (35 pages) — après AstroSpectro

> **Bloqué pour les chiffres** : il n'existe pas de `_facts/astrovision/`. Rédiger la structure et les méthodes depuis le code ; pour tout résultat chiffré, demander un export équivalent à `_facts/astrospectro/`.

| Section | Pages | Sources (`PhD-Brown/AstroVision`) |
|---|---|---|
| overview (5) | `index`, `scientific-motivation`, `key-results`, `project-structure`, `link-to-astrospectro` | `README.md`, `notebooks/07_synthesis.ipynb`, `src/astrovision/spectral_viz.py` (pont AstroSpectro) |
| data (5) | `index`, `galaxy10-decals`, `morphology-classes`, `data-preparation`, `sdss-crossmatch` | `src/astrovision/data_loader.py`, `crossmatcher.py`, `notebooks/00_eda_galaxy10.ipynb`, `05_crossmatch_analysis.ipynb` |
| models (7) | `baseline-cnn`, `efficientnet`, `dinov2-probing`, `dinov2-finetuned`, `late-fusion`, `morphometry`, `segmentation` | `src/astrovision/models.py`, `fusion.py`, `morphometry.py`, `unet.py`, `segmenter.py` ; notebooks 01, 03, 04, 06, 08 |
| results (6) | `index`, `benchmarking`, `attention-gradcam`, `uncertainty`, `physical-interpretation`, `limitations` | `gradcam.py`, `uncertainty.py`, `attention_morphometry.py` ; notebooks 02, 09, 10 — **chiffres bloqués** |
| guides (6) | `index`, `installation`, `train-classifier`, `compute-morphometry`, `run-gradcam`, `run-segmentation` | `requirements.txt`, `trainer.py`, `morphometry.py`, `gradcam.py`, `segmenter.py` |
| api (6) | `index`, `models`, `trainer`, `morphometry`, `gradcam`, `crossmatcher` | modules homonymes de `src/astrovision/` |

Priorité interne : `overview/index` → `data/galaxy10-decals` → `models/*` → `guides/*` → `results/*` (dès qu'un pack de faits existe) → `api/*`.
Dette existante : `atlas/claims-register.mdx` pointe vers `../astrovision/results/{benchmarking,limitations,uncertainty,physical-interpretation}` (routes cassées : l'instance est servie sous `/astrovision/`, pas `/docs/astrovision/`).

---

## 4. ξ Dark Energy (25 pages) — en dernier

> **Bloqué pour les chiffres** : pas de `_facts/xi/`. Le dépôt contient pourtant des sorties texte exportables
> (`results/protocol1b_pantheon_desi/final_model_comparison.md`, `results/summary_protocol1b_combined.txt`) :
> les copier dans `_facts/xi/` avant de rédiger `results/*` et `overview/key-findings`.

| Section | Pages | Sources (`PhD-Brown/xi-dark-energy-bao-mcmc`) |
|---|---|---|
| overview (4) | `index`, `scientific-motivation`, `models`, `key-findings` | `README.md`, `docs/model_notes.md`, `reports/latex/main.tex`, `notebooks/00_project_overview.ipynb` |
| data (4) | `index`, `pantheon-shoes`, `desi-dr2-bao`, `covariance` | `data/README.md`, `data/raw/README.md`, `src/00_load_pantheon.py`, `scripts/download_data.py`, `notebooks/01_data_inspection.ipynb` |
| inference (5) | `index`, `likelihood`, `mcmc-setup`, `convergence`, `model-comparison` | `src/xi_protocol1_run.py`, `src/xi_protocol1b_bao_run.py`, `src/xi_cosmo/diagnostics.py`, `scripts/make_chain_diagnostics.py`, `notebooks/03_mcmc_diagnostics.ipynb` (`inference/priors.mdx` existe déjà) |
| results (4) | `index`, `parameter-constraints`, `corner-plots`, `oscillation` | `results/**`, `src/xi_cosmo/results.py`, `plotting.py`, `scripts/export_final_tables.py`, `figures/**` — **chiffres bloqués** |
| reproducibility (4) | `index`, `installation`, `quick-run`, `outputs` | `docs/reproducibility.md`, `environment.yml`, `pyproject.toml`, `Makefile`, `scripts/run_quick.{sh,ps1}`, `scripts/check_environment.py` |
| api (4) | `index`, `models`, `likelihood`, `diagnostics` | `src/xi_cosmo/*.py` |

Dette existante : `atlas/claims-register.mdx` → `../xi-dark-energy/results/{caveats,parameter-constraints}` (routes cassées, même cause).

---

## 5. Remplacement du composant `UnderConstruction`

`editorial-guide.mdx` §6.3 recommande, pour une page encore incomplète, un admonition informatif plutôt que la boîte animée :

```mdx
:::info Under construction
This page is being expanded. The current version defines the scope of the topic and the core questions it will document.
:::
```

Quand une page est rédigée : retirer l'import et la balise `<UnderConstruction />`, **et** la section « What this page covers » (liste de promesses) au profit du contenu réel.
