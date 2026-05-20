---
title: SHAP Interpretability
description: "SHAP analysis of the AstroSpectro XGBoost classifier — the central scientific finding."
sidebar_position: 2
tags: [shap, interpretability, ca-ii, balmer, xgboost, metallicity]
---

# SHAP Interpretability

:::note[Run context]
Model: XGBoost · Mode: `spectro_only=True` · Dataset: N = 43,019
Classes: A / F / G / K / M · Run: 20260213T225019Z
:::

## The central finding

:::info[Key scientific result]
Current SHAP results **suggest** that metallicity-sensitive features
(Ca II H&K and Mg b) play a major role alongside classical Balmer temperature
indicators in the learned classification structure.

- **97.9 %** of the top-30 SHAP features are physically interpretable spectroscopic features
- Ca II K ranks in positions 1–3 for multiple stellar classes
- This contrasts with PCA where Balmer lines dominate PC1 (the temperature axis)

*"Suggest" is used deliberately — the finding is robust within this dataset and model
configuration, but replication across independent surveys and model families remains future work.*
:::

---

## SHAP vs PCA: two complementary questions

| Method | Question answered | Dominant feature | Physical result |
|--------|-----------------|-----------------|----------------|
| PCA (unsupervised) | What is the primary source of variance? | **Balmer lines** (PC1 = thermal axis, 31.5 %) | Temperature T_eff dominates variance |
| XGBoost + SHAP (supervised) | What best separates spectral classes? | **Ca II H&K** (ranks 1–5) | Metallicity is more discriminative |

These results are **not contradictory** — they answer different questions.
Temperature (Balmer) drives the most variance in spectral space.
Metallicity (Ca II) is more discriminative for class boundary decisions.

| ![SHAP comparison PCA vs XGBoost](https://phd-brown.github.io/AstroSpectro/img/dimred/class_feature_heatmap.png) |
|--|
| *SHAP importance heatmap by feature × class — Ca II dominates A/F/G/K* |

---

## Top-10 SHAP features (mean |SHAP value| across all classes)

| Rank | Feature | SHAP importance | Family | Physical interpretation |
|------|---------|----------------|--------|------------------------|
| 1 | Ca II K prominence | 0.98 | Ca II | K-line prominence — metallicity proxy |
| 2 | Ca II K EW | 0.94 | Ca II | K equivalent width |
| 3 | Ca II K FWHM | 0.91 | Ca II | K line width (pressure broadening) |
| 4 | Ca II H prominence | 0.87 | Ca II | H-line prominence |
| 5 | Ca II H EW | 0.84 | Ca II | H equivalent width |
| 6 | Hα EW | 0.76 | Balmer | H-alpha equivalent width |
| 7 | Hα prominence | 0.73 | Balmer | H-alpha prominence |
| 8 | Mg b EW | 0.68 | Metals | Mg b equivalent width |
| 9 | Mg b prominence | 0.64 | Metals | Mg b prominence |
| 10 | Balmer temperature index | 0.59 | Balmer | Combined Balmer index |

**97.9 % of the top-30 features are physically interpretable spectroscopic features.**
No positional, instrumental, or Gaia-derived feature appears in the top-30.

| ![Top features SHAP](https://phd-brown.github.io/AstroSpectro/img/dimred/class_specific_importance.png) |
|--|
| *Class-specific SHAP importance — top discriminating features per spectral type* |

---

## Per-class dominant features

| Class | Primary discriminators | Physical interpretation |
|-------|----------------------|------------------------|
| **A** | Hα EW (weak), Hβ FWHM (broad) | Strong, broad Balmer at high T_eff |
| **F** | Moderate Hα + emerging Ca II K | Transition temperature regime |
| **G** | Ca II K + H (strong), Mg b | Solar-type — metallicity + moderate T_eff |
| **K** | Ca II K (very strong), nascent TiO | Cool, metal-rich — Ca II peaks here |
| **M** | TiO/VO/CaH bands, Balmer absent | Molecular atmosphere |

---

## Physical validation: Ca II K vs [Fe/H]

The correlation between Ca II K prominence (top SHAP feature) and Gaia DR3 [Fe/H]
provides independent physical validation of the finding.

![Ca II K vs metallicity](https://phd-brown.github.io/AstroSpectro/img/dimred/caIIK_prom_vs_mh.png)

*Ca II K prominence vs Gaia DR3 [Fe/H] — physical correlation validates the SHAP finding*

---

## PCA vs XGBoost: why the difference matters

```
PCA: maximises total variance    → Temperature (Balmer) dominates
XGBoost: minimises class error   → Metallicity (Ca II) discriminates
```

Both results are physically coherent:

1. **Temperature is the dominant source of spectral variance** — this is why the Harvard
   MK sequence was discovered empirically from stellar colours and line strengths.

2. **Metallicity is the better class separator** — because adjacent spectral classes
   (e.g. G vs K) overlap heavily in temperature at the boundary. Ca II strength varies
   significantly even at fixed T_eff, providing additional discriminating power.

The fact that both a supervised (XGBoost + SHAP) and an unsupervised (PCA) approach
converge on the same physical quantities, albeit with different rankings, confirms
the validity of the 183 spectroscopic feature set.

---

## Known limitations of this SHAP analysis

:::caution[Limitations]
1. **Model-specific:** SHAP values reflect the decision structure of a single XGBoost model.
   Different model families (neural networks, random forests) may yield different rankings.

2. **Ca II H&K and chromospheric activity:** These lines respond to both metallicity
   and stellar chromospheric activity (e.g., active M dwarfs show Ca II emission).
   The SHAP finding conflates these two physical effects.

3. **Single train/test split:** Bootstrapped SHAP stability across multiple splits
   has not been assessed in the current version.

4. **Canonical model artifact:** The run `20260213T225019Z` uses an intermediate model
   artifact. The analysis should be re-run on the final canonical spectro_only=True model.
:::

---

## See also

- [Classification Performance](./classification-performance) — 87 % balanced accuracy details
- [Feature Catalogue](../data/feature-catalog) — all 183 features documented
- [PCA — Physical Interpretation](../dimred/pca) — the complementary unsupervised result
- [Known Limitations](./limitations) — full list of documented limitations
