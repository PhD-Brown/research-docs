---
title: "spectro_only=True Mode"
description: The canonical feature mode for AstroSpectro — what it is, why it exists, and what it excludes.
sidebar_position: 2
---

# `spectro_only=True` Mode

The `spectro_only=True` flag is the **canonical feature mode** for AstroSpectro. It is the setting used for all scientific results reported in the documentation, the SHAP analysis, and the manuscript in preparation.

## What it does

When `spectro_only=True`, the pipeline includes **only physically interpretable spectroscopic features**:

- ✅ Line prominence, equivalent width, FWHM for known spectral lines
- ✅ Molecular band indices (TiO, CaH, MgH)
- ✅ Continuum shape indices
- ✅ Line ratio features
- ✅ `match_*` columns from the line-matching step

When `spectro_only=False` (enriched mode), additional columns are available:

- ⚠️ `ra`, `dec` — positional (observational bias risk)
- ⚠️ `redshift`, `redshift_error` — not physical for stellar classification
- ⚠️ `snr_u/g/r/i/z` — SNR bands (instrumental)
- ⚠️ `teff_gspphot`, `logg_gspphot`, `mh_gspphot` — Gaia-derived (partially circular)
- ⚠️ `fiber_id`, `seeing`, `jd` — observational metadata

## Why this matters

:::caution[Physical purity]
The removal of `ra`, `dec`, and `redshift` from the feature set **increased** balanced accuracy from 84% to 87%. These features encoded LAMOST's observational programs (which targeted certain sky regions by stellar type), providing a shortcut that bypassed physical learning.

Using `spectro_only=False` for scientific conclusions about *what ML learns from spectra* would be misleading — the model could exploit positional correlations rather than spectral physics.
:::

## The canonical feature count

In `spectro_only=True` mode, the canonical feature vector has **183 dimensions**:

| Source | Features |
|--------|----------|
| FeatureEngineer (line profiles, bands, indices) | ~174 |
| match_* columns (ProcessingPipeline) | ~9 |
| **Total** | **183** |

:::note[Discrepancy note]
Earlier model artifacts (e.g., `20260213T225019Z`) were trained with a different feature set and different mode settings. The canonical 183-feature spectro_only=True run is the reference for all scientific claims.
:::

## How to use it

```python
from pipeline.processing import ProcessingPipeline

pipeline = ProcessingPipeline(spectro_only=True)
features_df = pipeline.run(catalog_df)
# → 183 columns, all physically interpretable
```

## See also

- [Feature Catalogue](../data/feature-catalog) — all 183 features documented
- [Physical Purity & Leakage](./physical-purity) — why enriched features are excluded
- [Classification Performance](../science/classification-performance) — results in this mode
