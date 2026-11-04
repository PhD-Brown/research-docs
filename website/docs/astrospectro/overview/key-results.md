---
title: Key Results at a Glance
description: "AstroSpectro's most important metrics and scientific findings."
sidebar_position: 3
tags: [astrospectro, results, xgboost, shap, pca, umap]
---

import RunFact from '@site/src/components/RunFact';
import GaiaLeakNote from '@site/src/components/GaiaLeakNote';

{/* facts: runs.json classifier (metrics.balanced_accuracy, metrics.roc_auc_macro, metrics.f1_macro, n.*), shap (metrics.physical_share, metrics.top30_physical, metrics.top.*), pca / umap_tsne (G1), runs 20260306T011253Z / 20260306T013341Z / 20260306T020848Z (v3, v4, v5) · FACTS_INDEX §1.1, §1.3, §2.2–2.3, §3 */}

# Key Results at a Glance

:::note[Run context]

**Classifier:** XGBoost <code><RunFact path="label" format="raw" /></code> · saved <code><RunFact path="id" format="raw" /></code> · `spectro_only` mode · **G2**, <RunFact path="n.processed" format="int" /> spectra processed · classes A / F / G / K / M.

**Dimensionality reduction:** PHY-3500 · G1 · 43,019 spectra (a different, earlier extraction — the two are never combined in a metric).

:::

<GaiaLeakNote />

## Classification performance

Held-out test set of <RunFact path="n.test" format="int" /> spectra, reference run (v6, G2).

| Metric | Value | Notes |
|--------|-------|-------|
| Balanced accuracy | **<RunFact path="metrics.balanced_accuracy" format="pct" />** | 5-class: A, F, G, K, M |
| Accuracy | **<RunFact path="metrics.accuracy" format="pct" />** | Plain accuracy — not the same metric as balanced accuracy |
| F1 (macro) | **<RunFact path="metrics.f1_macro" format="num" />** | Unweighted mean over the five classes |
| ROC-AUC (macro) | **<RunFact path="metrics.roc_auc_macro" format="num" />** | One-vs-rest |
| F/G boundary confusion | Expected | Continuous physical transition at 5 500–6 200 K |

Run v6 includes four Gaia/photometric features, so these metrics are not purely spectroscopic; see the [Data Leakage Audit](../concepts/data-leakage-audit.mdx).

## Dimensionality reduction

**PHY-3500 · G1 · 43,019 spectra** — these analyses were run on the earlier PHY-3500 extraction, not on the data of the classifier above.

| Method | Key result |
|--------|-----------|
| PCA | <RunFact run="pca" path="metrics.n_components_for_variance.95pct" format="int" /> components → 95 % variance · PC1: ρ(T_eff) = <RunFact run="pca" path="metrics.gaia_spearman.PC1.teff_gspphot" format="signed" /> |
| UMAP | Harvard sequence emerges without labels · <RunFact run="umap_tsne" path="metrics.hdbscan.n_clusters" format="int" /> HDBSCAN clusters |
| t-SNE | 60× more stable than UMAP (Procrustes, init='pca') |
| Autoencoder | Lower MSE than PCA at K = 2 · interpretable latent arithmetic |

## ⭐ Central scientific finding (SHAP)

:::info[Key finding]

Current SHAP results for the reference model **suggest** that a small set of spectroscopic features carries most of the learned classification structure, alongside classical Balmer temperature indicators.

- **<RunFact run="shap" path="metrics.physical_share" format="pct" />** of the total mean |SHAP| comes from spectroscopic features; <RunFact run="shap" path="metrics.top30_physical" format="int" /> of the 30 most important features are spectroscopic (the rest of the attribution belongs to Gaia/photometric columns)
- Top-ranked features: <code><RunFact run="shap" path="metrics.top.0.feature" format="raw" /></code> (rank 1), <code><RunFact run="shap" path="metrics.top.1.feature" format="raw" /></code> (rank 2), <code><RunFact run="shap" path="metrics.top.2.feature" format="raw" /></code> (rank 3); <code><RunFact run="shap" path="metrics.top.3.feature" format="raw" /></code> is rank 4
- This contrasts with PCA, where Balmer lines dominate PC1 (the temperature axis)

:::

<GaiaLeakNote />

**Physical interpretation:** PCA maximises variance → temperature dominates.
XGBoost minimises classification error → metallicity-sensitive indices help discriminate between
adjacent spectral classes. These two results are **complementary, not contradictory**.

## Historical pipeline progression

Balanced accuracy of successive runs (the earlier 100k runs processed 99,999 spectra; v6 processed <RunFact path="n.processed" format="int" />):

| Run | Experiment | Balanced accuracy | Notes |
|-----|-----------|-------------------|-------|
| `20260306T011253Z` | <RunFact run="20260306T011253Z" path="label" format="raw" /> | <RunFact run="20260306T011253Z" path="metrics.balanced_accuracy" format="pct" /> | 100k spectra |
| `20260306T013341Z` | <RunFact run="20260306T013341Z" path="label" format="raw" /> | <RunFact run="20260306T013341Z" path="metrics.balanced_accuracy" format="pct" /> | 100k, `spectro_only` |
| `20260306T020848Z` | <RunFact run="20260306T020848Z" path="label" format="raw" /> | <RunFact run="20260306T020848Z" path="metrics.balanced_accuracy" format="pct" /> | 100k, `spectro_only` + isotonic calibration |
| **`20260522T161236Z`** | **<RunFact path="label" format="raw" />** | **<RunFact path="metrics.balanced_accuracy" format="pct" />** | **Reference run**, 350k spectra, isotonic calibration |

> The "87 %" quoted in older material is the balanced accuracy of the v5 row above; the reference run is v6. Earlier runs also kept Gaia/photometric columns among their selected features, so this progression does not isolate a purely spectroscopic model. Earlier figures for the pre-2026 pipeline and the claimed effect of removing `ra`, `dec` and `redshift` are not backed by the exported run reports and are no longer quoted here.
