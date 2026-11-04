---
title: Methods Index
description: "Index of the methods used across AstroSpectro, AstroVision and ξ Dark Energy — classification, dimensionality reduction, clustering, interpretability, uncertainty quantification and Bayesian inference — each linked to the page that explains and evaluates it."
sidebar_position: 3
---

{/* facts: no numbers. Index of existing pages only; results are on the linked pages. */}

# Methods Index

This page lists the methods used in the three projects and links each one to its canonical page. It does not summarise results: each linked page states its dataset, run and caveats.

---

## Classification

| Method | Project | Page |
|---|---|---|
| XGBoost spectral classifier | AstroSpectro | [Classification](../astrospectro/pipeline/classification.md) · [Classification Performance](../astrospectro/science/classification-performance.mdx) · [Model Card](../astrospectro/science/model-card.mdx) |
| Probability calibration, threshold tuning | AstroSpectro | [Classification](../astrospectro/pipeline/classification.md) |
| Baseline CNN, EfficientNet-B0 | AstroVision | [Baseline CNN](/astrovision/models/baseline-cnn) · [EfficientNet-B0](/astrovision/models/efficientnet) |
| DINOv2 linear probe and fine-tuning | AstroVision | [Linear Probe](/astrovision/models/dinov2-probing) · [Fine-tuned](/astrovision/models/dinov2-finetuned) |
| Late-fusion multimodal classifier | AstroVision | [Late-Fusion Multimodal](/astrovision/models/late-fusion) |

## Features and physical measurements

| Method | Project | Page |
|---|---|---|
| Peak detection and line matching | AstroSpectro | [Peak Detection](../astrospectro/pipeline/peak-detection.md) |
| Physics-informed feature engineering | AstroSpectro | [Feature Extraction Theory](../astrospectro/pipeline/feature-engineering-theory.mdx) · [Feature Engineering](../astrospectro/pipeline/feature-engineering.md) · [Physical Meaning of Features](../astrospectro/science/feature-physics.md) |
| CAS, Gini, M20 morphometry | AstroVision | [Non-parametric Morphometrics](/astrovision/models/morphometry) |
| U-Net segmentation | AstroVision | [U-Net Segmentation](/astrovision/models/segmentation) |

## Dimensionality reduction and clustering

| Method | Project | Page |
|---|---|---|
| PCA | AstroSpectro | [PCA](../astrospectro/dimred/pca.mdx) |
| UMAP, HDBSCAN | AstroSpectro | [UMAP & HDBSCAN](../astrospectro/dimred/umap-hdbscan.md) |
| t-SNE, Procrustes stability | AstroSpectro | [t-SNE & Stability](../astrospectro/dimred/tsne.md) · [Sensitivity](../astrospectro/dimred/sensitivity.md) |
| Autoencoder | AstroSpectro | [Autoencoder](../astrospectro/dimred/autoencoder.mdx) |
| Comparison of the four | AstroSpectro | [Comparison](../astrospectro/dimred/comparison.md) |

All dimensionality-reduction pages use the PHY-3500 · G1 · 43,019 spectra dataset.

## Interpretability and validation

| Method | Project | Page |
|---|---|---|
| SHAP attributions | AstroSpectro | [SHAP Interpretability](../astrospectro/science/shap-interpretability.md) |
| Physical validation of features | AstroSpectro | [Scientific Validation](../astrospectro/science/validation.md) |
| Data-leakage audit | AstroSpectro | [Data Leakage Audit](../astrospectro/concepts/data-leakage-audit.mdx) · [`spectro_only` mode](../astrospectro/concepts/spectro-only-mode.md) |
| Grad-CAM and DINOv2 attention | AstroVision | [Attention & GradCAM](/astrovision/results/attention-gradcam) |

## Uncertainty and evaluation

| Method | Project | Page |
|---|---|---|
| MC Dropout, temperature scaling, conformal prediction | AstroVision | [Uncertainty Quantification](/astrovision/results/uncertainty) |
| Evaluation protocol | AstroVision | [Evaluation Protocol](/astrovision/results/evaluation-protocol) |
| Cross-project evidence levels | All | [Claims Register](./claims-register.mdx) |

## Bayesian inference

| Method | Project | Page |
|---|---|---|
| Likelihood (supernovae and BAO) | ξ Dark Energy | [Likelihood Functions](/xi-dark-energy/inference/likelihood) |
| MCMC sampling (emcee) | ξ Dark Energy | [MCMC Setup](/xi-dark-energy/inference/mcmc-setup) · [Prior Specification](/xi-dark-energy/inference/priors) |
| Convergence diagnostics | ξ Dark Energy | [Convergence Diagnostics](/xi-dark-energy/inference/convergence) |
| Model comparison (AIC, BIC) | ξ Dark Energy | [Model Comparison](/xi-dark-energy/inference/model-comparison) |

---

See also: [Notebook Atlas](./notebook-atlas.md) · [Glossary](./glossary.md) · [Acronyms](./acronyms.md).
