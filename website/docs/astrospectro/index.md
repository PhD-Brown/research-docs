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
| [Overview](./overview/) | Scientific motivation, key results, project map |
| [Concepts](./concepts/) | Architecture decisions, spectro_only mode, physical purity |
| [Data](./data/) | LAMOST DR5, Gaia DR3, feature catalogue |
| [Pipeline](./pipeline/) | Preprocessing, feature engineering, classification |
| [Dimred](./dimred/) | PCA, UMAP, t-SNE, autoencoder, HDBSCAN |
| [Science](./science/) | SHAP finding, validation, limitations |
| [Guides](./guides/) | Installation, quick start, how-to guides |
| [API](./api/) | Module reference |
| [Community](./community/) | Roadmap, contributing, citing |

## Key result

:::info Central scientific finding
SHAP analysis reveals that **metallicity-sensitive features (Ca II H&K and Mg b)**
play a major role alongside classical Balmer temperature indicators in the learned
classification structure. Manuscript in preparation; target venue under consideration.
:::
