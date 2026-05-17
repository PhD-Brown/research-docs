---
title: Glossary
description: "Definitions of all technical and scientific terms used across AstroSpectro, AstroVision, and ξ Dark Energy."
sidebar_position: 1
---

# Glossary

Terms are listed alphabetically. Click a term to see its full definition.

---

**Balanced Accuracy (BA)**
Classification metric that averages per-class recall, giving equal weight to each class regardless of class frequency. Used throughout AstroSpectro and AstroVision due to class imbalance.

**BAO (Baryon Acoustic Oscillations)**
Characteristic scale imprinted in the large-scale structure of the universe by sound waves in the early universe. Used as a standard ruler in cosmological distance measurements. See ξ Dark Energy.

**Ca II H&K lines**
Calcium ionised doublet at 3933 Å (K) and 3968 Å (H). Strong metallicity proxies and chromospheric activity indicators. Rank #1–5 in AstroSpectro SHAP analysis.

**CPL (Chevallier-Polarski-Linder)**
A dark energy equation-of-state parameterisation: w(a) = w₀ + w_a(1-a). One of three models compared in ξ Dark Energy.

**Equivalent Width (EW)**
Measure of spectral line strength — the width of a rectangular absorption feature with the same integrated flux as the observed line. Used extensively in AstroSpectro feature engineering.

**HDBSCAN**
Hierarchical Density-Based Spatial Clustering of Applications with Noise. Used in AstroSpectro to identify 20 stellar population clusters in UMAP space without labels.

**Harvard Spectral Sequence**
The stellar classification sequence O-B-A-F-G-K-M ordered by decreasing temperature. AstroSpectro classifies A, F, G, K, M types.

**LAMOST DR5**
The 5th data release of the Large Sky Area Multi-Object fiber Spectroscopic Telescope survey (~9 million spectra). Primary data source for AstroSpectro.

**MC Dropout**
Monte Carlo Dropout — a Bayesian approximation technique for uncertainty quantification in neural networks. Used in AstroVision.

**ROC-AUC**
Area Under the Receiver Operating Characteristic curve. Measures discrimination ability; AstroSpectro achieves ~0.964 macro-average.

**SHAP (SHapley Additive exPlanations)**
A game-theoretic method for explaining ML model predictions by attributing each feature's contribution to the output. Central validation tool in AstroSpectro.

**spectro_only=True**
The canonical feature mode in AstroSpectro that includes only physically interpretable spectroscopic features, excluding positional and instrumental metadata. See [spectro_only=True Mode](../astrospectro/concepts/spectro-only-mode).

**T_eff (Effective Temperature)**
The temperature of a blackbody with the same total luminosity as a star. Primary axis of the Harvard spectral sequence.

**UMAP (Uniform Manifold Approximation and Projection)**
Non-linear dimensionality reduction algorithm. Used in AstroSpectro to project 183 spectral features to 2D, revealing the Harvard sequence without supervision.

**ξosc (Oscillating dark energy)**
An exploratory dark energy parameterisation with an oscillating equation of state. One of three models in ξ Dark Energy (v0.1.0-exploratory, not a claimed detection).

---

*See also: [Acronyms](./acronyms)*
