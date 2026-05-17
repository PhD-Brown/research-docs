---
title: SHAP Interpretability
description: SHAP analysis of the AstroSpectro XGBoost classifier — the central scientific finding.
sidebar_position: 2
tags:
  - shap
  - interpretability
  - caII
  - balmer

---

# SHAP Interpretability

:::note Run context
Model: XGBoost · Mode: `spectro_only=True` · Dataset: N=43,019 · Run: 20260213T225019Z
:::

## The central finding

:::info Key scientific result
Current SHAP results **suggest** that metallicity-sensitive features
(Ca II H&K and Mg b) play a major role alongside classical Balmer temperature
indicators in the learned classification structure.

- **97.9%** of the top-30 SHAP features are physically interpretable spectroscopic features
- Ca II K ranks in positions 1–3 for multiple stellar classes
- This is consistent with, but not identical to, the PCA result (where Balmer dominates PC1)

*Caveat: "suggest" is used deliberately — the finding is robust within this dataset and
model configuration but has not yet been replicated across independent surveys or model families.*
:::

## SHAP vs PCA: two complementary questions

| Method | Question answered | Feature dominance |
|--------|------------------|------------------|
| PCA (unsupervised) | What is the primary source of variance? | **Balmer lines** (PC1 = temperature axis) |
| SHAP (supervised) | What best separates spectral classes? | **Ca II H&K** (metallicity proxy) |

These results are **not contradictory** — they answer different questions. Temperature (Balmer) drives the most variance in the spectral space, but metallicity (Ca II) is more discriminative for classification.

## Top-30 SHAP features

| Rank | Feature | Family | Physical meaning |
|------|---------|--------|-----------------|
| 1 | `num_feature_CaIIK_prom` | Ca II | K line prominence — metallicity proxy |
| 2 | `num_feature_CaIIK_ew` | Ca II | K equivalent width |
| 3 | `num_feature_CaIIK_fwhm` | Ca II | K line width (pressure broadening) |
| 4 | `num_feature_CaIIH_prom` | Ca II | H line prominence |
| 5 | `num_feature_CaIIH_ew` | Ca II | H equivalent width |
| 6 | `num_feature_Ha_ew` | Balmer | H-alpha equivalent width |
| 7 | `num_feature_Ha_prom` | Balmer | H-alpha prominence |
| 8 | `num_feature_Mgb_ew` | Metals | Mg b equivalent width |
| 9 | `num_feature_Mgb_prom` | Metals | Mg b prominence |
| 10 | `num_feature_Balmer_temp_index` | Balmer | Balmer temperature index |

97.9% of the top-30 features are physically interpretable. No positional or instrumental features appear.

## Per-class dominant features

| Class | Primary discriminators | Physical interpretation |
|-------|----------------------|------------------------|
| **A** | Hα EW (weak), Hβ FWHM (wide) | Strong, broad Balmer at high T_eff |
| **F** | Moderate Hα + Ca II K emerging | Transition temperature regime |
| **G** | Ca II K + H (strong), Mg b | Solar-type — metallicity + moderate T_eff |
| **K** | Ca II K (very strong), TiO nascent | Cool, metal-rich — Ca II peaks here |
| **M** | TiO/VO/CaH bands, Balmer absent | Molecular atmosphere |

## Known limitations of this analysis

- SHAP values are model-specific — a different model family may yield different rankings
- The analysis is on a single train/test split; bootstrapped SHAP stability has not been tested
- Ca II H&K are known metallicity proxies, but they also respond to chromospheric activity
- The canonical run (`20260213T225019Z`) uses an intermediate model artifact; the analysis should be re-run on the final canonical model

## See also

- [Classification Performance](./classification-performance)
- [Feature Catalogue](../data/feature-catalog)
- [Key Results at a Glance](../overview/key-results)
- [Limitations](./limitations)
