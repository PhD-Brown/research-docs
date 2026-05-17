---
title: Key Results at a Glance
description: AstroSpectro's most important metrics and scientific findings.
sidebar_position: 3
---

# Key Results at a Glance

:::note Run context
Model: XGBoost · Mode: `spectro_only=True` · Dataset: N=43,019 · Classes: A/F/G/K/M
:::

## Classification performance

| Metric | Value | Notes |
|--------|-------|-------|
| Balanced accuracy | **87%** | 5-class: A, F, G, K, M |
| ROC-AUC (macro) | **~0.964** | Near-perfect discrimination |
| Median confidence | **96.3%** | Probability of predicted class |
| F/G confusion | Expected | Physically continuous boundary at 5500–6200 K |

## Dimensionality reduction

| Method | Key result |
|--------|-----------|
| PCA | 91 components → 95% variance · PC1 correlates with T_eff (ρ=+0.831) |
| UMAP | Harvard sequence emerges without supervision · 20 HDBSCAN clusters |
| t-SNE | 60× more stable than UMAP (Procrustes, init='pca') |
| Autoencoder | Lower MSE than PCA at K=2 · Interpretable latent arithmetic |

## ⭐ Central scientific finding (SHAP)

:::info Key finding
Current SHAP results **suggest** that metallicity-sensitive features (Ca II H&K and Mg b)
play a major role alongside classical Balmer temperature indicators in the learned
classification structure.

- **97.9%** of the top-30 SHAP features are physical spectroscopic features
- Ca II K ranks in positions 1–3 across multiple stellar classes
- This contrasts with PCA where Balmer lines dominate PC1 (temperature axis)
:::

**Interpretation:** PCA maximises variance → temperature dominates. XGBoost minimises classification error → metallicity discriminates better between adjacent spectral classes.

## Historical pipeline progression

| Version | Method | Balanced accuracy | Notes |
|---------|--------|-------------------|-------|
| Baseline | Random Forest, 4 binary features | 32% | Proof of concept |
| V1 | RF/XGBoost + metadata | 75–84% | ⚠️ Includes ra, dec, Gaia — data leakage risk |
| **V2 (current)** | **XGBoost, spectro_only=True** | **87%** | Physical features only |

> **Counter-intuitive result:** removing ra, dec, redshift *increased* performance from 84% to 87%. These features added observational bias signal, not physical signal.

## See also

- [SHAP Interpretability](../science/shap-interpretability)
- [Classification Performance](../science/classification-performance)
- [spectro_only=True Mode](../concepts/spectro-only-mode)
