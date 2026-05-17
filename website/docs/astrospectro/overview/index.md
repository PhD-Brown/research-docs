---
title: "What is AstroSpectro?"
description: Overview of the AstroSpectro project — goals, approach, and key results.
sidebar_position: 1
---

# What is AstroSpectro?

**AstroSpectro** is an open-source, interpretable machine-learning pipeline for stellar spectral classification using data from the LAMOST DR5 survey cross-matched with Gaia DR3.

The project is designed to answer a fundamental question:

> *What physical information are modern machine-learning models actually learning from stellar spectra?*

## What it does

1. Ingests raw FITS spectra from LAMOST DR5
2. Preprocesses and normalises spectra (continuum removal, inverse-variance weighting)
3. Extracts **183 physics-based spectroscopic features** (line profiles, equivalent widths, molecular bands, continuum indices)
4. Trains an XGBoost classifier in `spectro_only=True` mode — no positional or instrumental metadata
5. Applies PCA, UMAP, t-SNE, and autoencoder for dimensionality reduction and structure discovery
6. Validates classification decisions using SHAP interpretability

## What makes it different

- **Physics-first features:** every feature corresponds to a physically interpretable spectral property
- **Leakage-free mode:** `spectro_only=True` removes all non-physical metadata
- **SHAP validation:** model decisions are validated against known astrophysical priors
- **Full reproducibility:** 85+ experiment runs tracked with Weights & Biases

## Navigate this section

- [Scientific Motivation](./scientific-motivation)
- [Key Results at a Glance](./key-results)
- [Project Map](./project-map)
- [Current Status](./current-status)
