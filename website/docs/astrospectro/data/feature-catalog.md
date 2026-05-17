---
title: Feature Catalogue — 183 Spectroscopic Features
description: "Complete reference for all 183 spectroscopic features extracted by AstroSpectro in spectro_only=True mode."
sidebar_position: 5
---

# Feature Catalogue — 183 Spectroscopic Features

:::note Canonical mode
All features listed here are extracted in `spectro_only=True` mode.
Total: **183 features** across 9 families.
:::

## Feature families overview

| Family | Count | Description |
|--------|-------|-------------|
| Balmer lines | ~25 | H-alpha, H-beta, H-gamma, H-delta profiles |
| Ca II H&K | ~20 | Calcium ionised doublet — key metallicity proxy |
| Sodium / Magnesium | ~15 | Na D, Mg b triplet |
| Molecular bands | ~20 | TiO, CaH, MgH, VO bands (cool stars) |
| Iron & metals | ~25 | Fe I/II multiplets, metallic lines |
| Continuum indices | ~30 | Colour-temperature shape indices |
| Line ratios | ~20 | Physically motivated feature ratios |
| Line-profile moments | ~15 | FWHM, asymmetry, kurtosis for key lines |
| match_* columns | ~13 | Line-matching step from ProcessingPipeline |
| **Total** | **183** | |

## Key features by SHAP importance

The following features rank highest in the SHAP analysis (see [SHAP Interpretability](../science/shap-interpretability)):

| Rank | Feature | Family | Physical interpretation |
|------|---------|--------|------------------------|
| 1 | `num_feature_CaIIK_prom` | Ca II | Ca II K line prominence — metallicity proxy |
| 2 | `num_feature_CaIIK_ew` | Ca II | Ca II K equivalent width |
| 3 | `num_feature_CaIIK_fwhm` | Ca II | Ca II K line width |
| 4 | `num_feature_CaIIH_prom` | Ca II | Ca II H prominence |
| 5 | `num_feature_CaIIH_ew` | Ca II | Ca II H equivalent width |
| 6 | `num_feature_Ha_ew` | Balmer | H-alpha equivalent width |
| 7 | `num_feature_Ha_prom` | Balmer | H-alpha prominence |
| 8 | `num_feature_Mgb_ew` | Metals | Mg b equivalent width |
| 9 | `num_feature_Mgb_prom` | Metals | Mg b prominence |
| 10 | `num_feature_Balmer_temp_index` | Balmer | Balmer temperature index |

:::info Feature count note
Earlier documentation cited 174 features (FeatureEngineer output only).
The canonical count of **183** includes the ~9 `match_*` columns added by ProcessingPipeline.
See [spectro_only=True Mode](../concepts/spectro-only-mode) for the full breakdown.
:::

## See also

- [spectro_only=True Mode](../concepts/spectro-only-mode)
- [Feature Engineering](../pipeline/feature-engineering)
- [SHAP Interpretability](../science/shap-interpretability)
