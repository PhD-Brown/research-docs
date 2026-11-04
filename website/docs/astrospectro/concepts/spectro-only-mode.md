---
title: "spectro_only=True Mode"
description: The canonical feature mode for AstroSpectro — what it is, why it exists, and what it excludes.
sidebar_position: 2
---

import RunFact from '@site/src/components/RunFact';
import GaiaLeakNote from '@site/src/components/GaiaLeakNote';

{/* facts: runs.json runs 20260306T011253Z / 20260306T013341Z / 20260306T020848Z (v3, v4, v5: metrics.balanced_accuracy), classifier (v6: features.gaia_photometric) · FACTS_INDEX §1.1, §1.3 */}

# `spectro_only=True` Mode

The `spectro_only=True` flag is the **canonical feature mode** for AstroSpectro. It is the setting used for all scientific results reported in the documentation, the SHAP analysis, and the manuscript in preparation.

## What it does

When `spectro_only=True`, the pipeline is meant to include **only physically interpretable spectroscopic features**. The reference run v6 did not fully meet that goal, because Gaia/photometric columns passed the old prefix-based filter (see the [Data Leakage Audit](./data-leakage-audit.mdx)). Fixed in the code with an explicit list of Gaia/photometric columns (the 22 columns absent from v7). v7 was trained with this fix, but no complete spectro-only reference run exists yet.

The intended feature set:

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
`ra`, `dec` and `redshift` can encode LAMOST's observational programs (which targeted certain sky regions by stellar type), a potential shortcut that bypasses physical learning. The exported run reports do not show a clear accuracy gain from removing them: the 100k runs v3 (before `spectro_only`) and v4 (`spectro_only`) reach a balanced accuracy of <RunFact run="20260306T011253Z" path="metrics.balanced_accuracy" format="pct" /> and <RunFact run="20260306T013341Z" path="metrics.balanced_accuracy" format="pct" />, and v5 (`spectro_only` plus isotonic calibration) reaches <RunFact run="20260306T020848Z" path="metrics.balanced_accuracy" format="pct" />. The figure "84% → 87%" that circulated earlier is therefore no longer quoted.

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
