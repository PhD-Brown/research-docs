---
title: Scientific Validation
description: "How AstroSpectro checks that its features and models follow known stellar physics — feature-versus-theory tests on the 350k-spectrum generation (G2), SHAP attribution of the reference XGBoost run, and the negative control and UMAP coherence test of the PHY-3500 dimensionality-reduction dataset (G1)."
sidebar_position: 1
---

import RunFact from '@site/src/components/RunFact';
import GaiaLeakNote from '@site/src/components/GaiaLeakNote';
import FigureGallery from '@site/src/components/FigureGallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts:
  G2 · _facts/astrospectro/logs/validation/features_20260522T153123Z/validation_summary.csv (Feature, Theory_Matches, Correlation) → runs.json `validation`
  G2 · _facts/astrospectro/logs/shap/features_20260522T153123Z/01_data_leak/shap_feature_importance.csv (physical share, top-30) → runs.json `shap` (model 20260522T161236Z, v6)
  G2 · _facts/astrospectro/data/reports/20260522T161236Z/session_report_xgboost_20260522T161236Z.json (selected_features) → runs.json `classifier`
  G1 · _facts/astrospectro/logs/validation/features_20260305T174836Z/validation_summary.csv → runs.json `validation/features_20260305T174836Z`
  G1 · _facts/astrospectro/logs/shap/features_20260305T174836Z/shap_feature_importance.csv (v5, 20260306T020848Z) → runs.json `shap/features_20260305T174836Z`
  G1 · _facts/astrospectro/data/reports/runs/phy3500_umap_tsne/phy3500_umap_tsne_run_20260405T214233Z.json (xgboost_summary: v5 projected on G1) → runs.json `umap_tsne`
  Figures G2 copied from _facts/astrospectro/logs/validation/features_20260522T153123Z/ to static/img/astrospectro/ ; G1 figures already in static/img/dimred/ (MANIFEST).
  Code: AS/src/pipeline/classifier.py (StratifiedShuffleSplit, StratifiedKFold) ; AS/notebooks/03_scientific_validation.ipynb
  Row order of validation checks: 0 Hα FWHM · 1 Ca II K prominence · 2 colour g−r · 3 SNR quality (CSV order). */}

# Scientific Validation

This page documents the checks that AstroSpectro uses to tell physically meaningful results from algorithmic artefacts. It covers two data generations that are **never mixed**: feature-versus-theory tests and SHAP attribution on the 350k-spectrum generation used by the reference classifier (**G2**), and the negative control and UMAP coherence test on the PHY-3500 dimensionality-reduction dataset (**PHY-3500 · G1 · 43,019 spectra**).

:::info[Run context]
**G2** — feature validation `logs/validation/features_20260522T153123Z/` · SHAP of the reference classifier <RunFact path="label" format="raw" /> (`logs/shap/features_20260522T153123Z/01_data_leak/`).
**G1** — PHY-3500 dimensionality-reduction runs (UMAP/t-SNE reference run), feature validation `logs/validation/features_20260305T174836Z/`.
:::

---

## Key results

Feature-versus-theory checks, **G2** (`features_20260522T153123Z`, as written by `notebooks/03_scientific_validation.ipynb`):

| Check | Measured correlation | Matches theory (pipeline verdict) |
|---|---|---|
| Hα FWHM vs T<sub>eff</sub> | <RunFact run="validation" path="metrics.checks.0.correlation" format="raw" /> | <RunFact run="validation" path="metrics.checks.0.theory_matches" format="raw" /> |
| Ca II K prominence vs spectral type / [M/H] | <RunFact run="validation" path="metrics.checks.1.correlation" format="raw" /> | <RunFact run="validation" path="metrics.checks.1.theory_matches" format="raw" /> |
| Colour g − r vs spectral type | <RunFact run="validation" path="metrics.checks.2.correlation" format="raw" /> | <RunFact run="validation" path="metrics.checks.2.theory_matches" format="raw" /> |
| Feature residual vs SNR | <RunFact run="validation" path="metrics.checks.3.correlation" format="raw" /> | <RunFact run="validation" path="metrics.checks.3.theory_matches" format="raw" /> |

SHAP attribution of the reference classifier, **G2**: <RunFact run="shap" path="metrics.physical_share" format="pct" /> of the total mean \|SHAP\| goes to features of the *Physical (spectroscopic)* category, and <RunFact run="shap" path="metrics.top30_physical" /> of the 30 most important features belong to that category.

<GaiaLeakNote />

---

## Feature-versus-theory tests (G2)

### Result

The validation notebook compares four extracted quantities with the trend expected from stellar astrophysics and writes one row per test to `validation_summary.csv`. The pipeline marks three of the four tests as consistent with theory; the Hα FWHM test fails.

### Interpretation

- **Hα FWHM** — the expected ordering of the line width with temperature is not recovered. The note written by the pipeline attributes this to the limited spectral resolution of LAMOST: at low resolution the measured FWHM is dominated by the instrumental profile rather than by the intrinsic line width.
- **Ca II K prominence** — the trend with spectral type has the expected sign but is very weak. The metallicity test cannot be run on this generation: the run is `spectro_only` and no [M/H] column is available (`N/A` above).
- **Colour g − r** — the sign of the trend is correct, but the correlation coefficient is close to zero.
- **SNR** — the residual of the features shows no measurable dependence on SNR, which suggests that feature extraction is not driven by data quality.

### Caveat

"Matches theory" is the boolean written by the notebook, not an independent statistical test: a correlation coefficient close to zero is accepted as a pass when the sign is right. These tests therefore *do not contradict* stellar physics; they do not *confirm* it quantitatively. In the colour–colour panel of the composite figure, a group of points lies far outside the physical colour range, which points to placeholder values in the catalogue magnitudes; the g − r test should be re-run once these values are masked.

export const validationFigures = [
  { src: '/img/astrospectro/validation_20260522T153123Z_ha_fwhm_vs_teff.png', title: 'Hα FWHM vs Teff', desc: 'G2 · features_20260522T153123Z — resolution-limited line widths', tag: 'G2' },
  { src: '/img/astrospectro/validation_20260522T153123Z_caii_validation.png', title: 'Ca II K validation', desc: 'G2 · features_20260522T153123Z — prominence by spectral type', tag: 'G2' },
  { src: '/img/astrospectro/validation_20260522T153123Z_color_indices.png', title: 'Colour indices by type', desc: 'G2 · features_20260522T153123Z — g − r and related colours', tag: 'G2' },
  { src: '/img/astrospectro/validation_20260522T153123Z_snr_quality_check.png', title: 'SNR quality check', desc: 'G2 · features_20260522T153123Z — feature residual vs SNR', tag: 'G2' },
];

<FigureGallery figures={validationFigures} columns={2} />

---

## SHAP attribution of the reference classifier (G2)

### Result

SHAP is computed on the reference classifier (<RunFact path="label" format="raw" />, <RunFact path="features.selected" /> selected features). The share of the total mean \|SHAP\| carried by spectroscopic features is <RunFact run="shap" path="metrics.physical_share" format="pct" />; the remaining <RunFact run="shap" path="metrics.gaia_photometric_share" format="pct" /> goes to Gaia/photometric columns.

### Interpretation

The classifier relies overwhelmingly on absorption-line and continuum descriptors, i.e. on the same information a spectroscopist uses to assign a type. The ranking itself is documented on [SHAP Interpretability](./shap-interpretability.md).

### Caveat

This percentage is a **share of total importance**, not a fraction of the top-30 list, and it is specific to one run. The value of the earlier run v5 on the PHY-3500 generation (<RunFact run="shap/features_20260305T174836Z" path="metrics.physical_share" format="pct" />, G1) is often quoted on older pages; it must not be attached to the reference run.

:::caution[Gaia leak in run v6]
Run v6 (`ST_350k_xgb_AFGKM_v6`) was trained with `spectro_only` enabled, but its <RunFact run="20260522T161236Z" path="features.selected" /> selected features include <RunFact run="20260522T161236Z" path="features.gaia_photometric.length" /> Gaia/photometric columns (`M_G`, `M_BP`, `M_RP`, `ag_gspphot`). Its metrics are therefore not purely spectroscopic; see the [Data Leakage Audit](../concepts/data-leakage-audit.mdx).
:::

---

## Evaluation protocol of the classifier

Performance figures are measured on a held-out test set that the model never sees during training. In `SpectralClassifier.train_and_evaluate` (`src/pipeline/classifier.py`):

| Step | Implementation | Role |
|---|---|---|
| Train/test split | `StratifiedShuffleSplit(n_splits=1, test_size, random_state)` | Keeps class proportions identical in both sets |
| Group-aware split (optional) | `StratifiedGroupKFold` / `GroupShuffleSplit` when `use_groups=True` | Prevents spectra of the same group from appearing in train and test |
| Cross-validation | `StratifiedKFold(cv_folds, shuffle=True)` or `RepeatedStratifiedKFold` | Used only when a hyperparameter search (`search="grid"` / `"random"`) is requested |
| Calibration (optional) | `CalibratedClassifierCV` (sigmoid or isotonic), by CV or on a dedicated hold-out | Makes predicted probabilities interpretable as confidences |

The reference run reused the hyperparameters of an earlier search (its `notes` field reads: <RunFact path="notes" format="raw" />), so its cross-validation happened in that earlier run. Its test set holds <RunFact path="n.test" /> spectra. Full metrics: [Classification Performance](./classification-performance.mdx) and [Model Card](./model-card.mdx).

---

## Negative control and UMAP coherence (PHY-3500 · G1 · 43,019 spectra)

These two tests belong to the dimensionality-reduction study and use the G1 generation only.

### Negative control

**Result.** UMAP applied to the same feature matrix with each column independently permuted (`EmbeddingEngine.negative_control`, `src/dimred/embedding.py`, which destroys the correlations between features while keeping their marginal distributions) produces a homogeneous cloud with no structure.

**Interpretation.** The continuous sequence observed on the real data is carried by the joint behaviour of the features, i.e. by the physics of the spectra, and is not produced by UMAP itself.

**Caveat.** The control is qualitative (visual comparison): the run report stores only summary statistics of the permuted embedding, no structure score.

### Supervised / unsupervised coherence

**Result.** The predictions of an XGBoost model projected onto the G1 UMAP embedding follow its geography: hot types on one side, cool types on the other, transitions where the embedding is continuous. The projected model is v5 (`ST_100k_xgb_AFGKM_v5`), not the reference classifier; its median prediction confidence on the projected spectra is <RunFact run="umap_tsne" path="metrics.xgboost_projection.median_confidence" format="pct" /> (<RunFact run="umap_tsne" path="metrics.xgboost_projection.n_predictions" /> predictions).

<GaiaLeakNote run="20260306T020848Z" />

**Interpretation.** A supervised model and an unsupervised projection built on the same features recover the same ordering, which suggests that both follow the temperature sequence rather than an artefact of either method.

**Caveat.** This is a qualitative agreement on G1 with an older model; it is not a validation of the reference run.

### Ca II K and metallicity (G1)

On G1, where Gaia metallicities are available, the Ca II K test gives <RunFact run="validation/features_20260305T174836Z" path="metrics.checks.1.correlation" format="raw" />. The sign of the metallicity correlation is **inverted** with respect to expectation: the prominence decreases as [M/H] increases, whereas metal-rich stars should show stronger Ca II K. This result is open: it may come from the prominence definition, from the temperature dependence of Ca II K dominating the metallicity signal, or from the Gaia metallicities themselves. It cannot be checked on G2 (`spectro_only`, no [M/H]).

export const g1Figures = [
  { src: '/img/dimred/umap_negative_control.png', title: 'Negative control', desc: 'PHY-3500 · G1 · 43,019 spectra — permuted features give a structureless cloud', tag: 'G1' },
  { src: '/img/dimred/umap_xgboost_predictions.png', title: 'XGBoost predictions in UMAP', desc: 'PHY-3500 · G1 · 43,019 spectra — model v5 projected', tag: 'G1' },
  { src: '/img/dimred/caIIK_prom_vs_mh.png', title: 'Ca II K prominence vs [M/H]', desc: 'G1 validation — inverted metallicity trend', tag: 'G1' },
];

<FigureGallery figures={g1Figures} columns={3} />

---

## Limitations of these checks

- The feature tests are univariate correlations; they do not test the joint behaviour of the descriptors that the classifier uses.
- Two of the four "passing" tests rest on correlation coefficients close to zero.
- The metallicity dimension is untested on the reference generation.
- No external benchmark (another survey's classification of the same stars) is part of the exported results.

See [Limitations](./limitations.md) for the project-wide list.

---

<RelatedPages pages={[
  { href: '/docs/astrospectro/science/shap-interpretability', title: 'SHAP Interpretability', desc: 'Feature ranking and per-class attribution', category: 'science' },
  { href: '/docs/astrospectro/science/classification-performance', title: 'Classification Performance', desc: 'Metrics of the reference XGBoost run', category: 'science' },
  { href: '/docs/astrospectro/concepts/data-leakage-audit', title: 'Data Leakage Audit', desc: 'Which Gaia/photometric columns reached the model', category: 'concepts' },
  { href: '/docs/astrospectro/dimred', title: 'Dimensionality Reduction', desc: 'PHY-3500 · G1 · 43,019 spectra — UMAP, t-SNE, PCA', category: 'science' },
]} />
