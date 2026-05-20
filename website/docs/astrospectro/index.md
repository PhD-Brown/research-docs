---
title: AstroSpectro
description: Interpretable ML pipeline for stellar spectral classification using LAMOST DR5 × Gaia DR3.
sidebar_position: 1
---

# AstroSpectro

**Interpretable machine-learning pipeline for stellar spectral classification.**

> LAMOST DR5 × Gaia DR3 · 183 physical features · XGBoost · 87% balanced accuracy · SHAP interpretability

---

## Quick navigation

| Section | What you'll find |
|---------|-----------------|
| [Overview](/research-docs/docs/astrospectro/overview/) | Scientific motivation, key results, project map |
| [Concepts](/research-docs/docs/astrospectro/concepts/) | Architecture decisions, spectro_only mode, physical purity |
| [Data](/research-docs/docs/astrospectro/data/) | LAMOST DR5, Gaia DR3, feature catalogue |
| [Pipeline](/research-docs/docs/astrospectro/pipeline/) | Preprocessing, feature engineering, classification |
| [Dimred](/research-docs/docs/astrospectro/dimred/) | PCA, UMAP, t-SNE, autoencoder, HDBSCAN |
| [Science](/research-docs/docs/astrospectro/science/) | SHAP finding, validation, limitations |
| [Guides](/research-docs/docs/astrospectro/guides/) | Installation, quick start, how-to guides |
| [API](/research-docs/docs/astrospectro/api/) | Module reference |
| [Community](/research-docs/docs/astrospectro/community/) | Roadmap, contributing, citing |

## Key result

:::info[Central scientific finding]
SHAP analysis reveals that **metallicity-sensitive features (Ca II H&K and Mg b)**
play a major role alongside classical Balmer temperature indicators in the learned
classification structure. Manuscript in preparation; target venue under consideration.
:::
