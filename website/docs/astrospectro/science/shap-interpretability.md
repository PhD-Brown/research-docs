---
title: SHAP Interpretability
description: "SHAP analysis of the AstroSpectro XGBoost classifier — the central scientific finding."
sidebar_position: 2
tags: [shap, interpretability, ca-ii, balmer, xgboost, metallicity]
---

import RunFact from '@site/src/components/RunFact';
import GaiaLeakNote from '@site/src/components/GaiaLeakNote';
import SHAPTop10 from '@site/src/components/SHAPTop10';

{/* facts: runs.json shap (reference SHAP of v6: metrics.physical_share, metrics.top30_physical, metrics.top.*), pca (G1: metrics.variance.0), classifier · FACTS_INDEX §1.1, §3 · figures: shap/features_20260305T174836Z (model v5) */}

# SHAP Interpretability

:::note[Run context]

SHAP of the reference classifier <code><RunFact path="label" format="raw" /></code> (<code><RunFact path="id" format="raw" /></code>) · XGBoost · `spectro_only` mode · **G2**, <RunFact path="n.processed" format="int" /> spectra · <RunFact run="shap" path="n_features" format="int" /> selected features · classes A / F / G / K / M.

:::

<GaiaLeakNote />

## The central finding

:::info[Key scientific result]
Current SHAP results for the reference model **suggest** that a small set of spectroscopic features (Mg b, CaH2, the deep-red continuum slope, Ca II K and Hα) carries most of the learned classification structure, alongside classical Balmer temperature indicators.

- **<RunFact run="shap" path="metrics.physical_share" format="pct" />** of the total mean |SHAP| comes from spectroscopic features; <RunFact run="shap" path="metrics.top30_physical" format="int" /> of the 30 most important features are spectroscopic. The remainder belongs to Gaia/photometric columns (<RunFact run="shap" path="metrics.gaia_photometric_share" format="pct" />), see the Data Leakage Audit
- Ranks 1–3: <code><RunFact run="shap" path="metrics.top.0.feature" format="raw" /></code>, <code><RunFact run="shap" path="metrics.top.1.feature" format="raw" /></code>, <code><RunFact run="shap" path="metrics.top.2.feature" format="raw" /></code>; Ca II K equivalent width (<code><RunFact run="shap" path="metrics.top.3.feature" format="raw" /></code>) is rank 4
- This contrasts with PCA where Balmer lines dominate PC1 (the temperature axis)

*"Suggest" is used deliberately — the finding is robust within this dataset and model
configuration, but replication across independent surveys and model families remains future work.*
:::

---

## SHAP vs PCA: two complementary questions

| Method | Question answered | Dominant feature | Physical result |
|--------|-----------------|-----------------|----------------|
| PCA (unsupervised, PHY-3500 · G1) | What is the primary source of variance? | **Balmer lines** (PC1 = thermal axis, <RunFact run="pca" path="metrics.variance.0" format="pct" /> of the variance) | Temperature T_eff dominates variance |
| XGBoost + SHAP (supervised, reference run) | What best separates spectral classes? | **Mg b, CaH2, deep-red slope** (ranks 1–3), then Ca II K | Mixed metal and band indicators are the most discriminative |

These results are **not contradictory** — they answer different questions.
Temperature (Balmer) drives the most variance in spectral space.
Metal and molecular-band indicators are more discriminative for class boundary decisions.

| ![SHAP comparison PCA vs XGBoost](/img/dimred/class_feature_heatmap.png) |
|--|
| *SHAP importance heatmap by feature × class — SHAP analysis `features_20260305T174836Z` (model v5, which also kept Gaia/photometric columns)* |

---

## Top-10 SHAP features (mean |SHAP value| across all classes)

<SHAPTop10 />

The share of spectroscopic features is reported above (<RunFact run="shap" path="metrics.physical_share" format="pct" /> of the summed mean |SHAP|, not a share of the top-30). Gaia absolute magnitudes (`M_G`, `M_BP`, `M_RP`) and `ag_gspphot` are among the selected features and carry the rest, so the claim "no Gaia-derived feature is used" does not hold for this run.

| ![Top features SHAP](/img/dimred/class_specific_importance.png) |
|--|
| *Class-specific SHAP importance — top discriminating features per spectral type (model v5 analysis `features_20260305T174836Z`)* |

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

The correlation between Ca II K prominence (a Ca II K descriptor; its equivalent width ranks 4th in the reference run) and Gaia DR3 [Fe/H]
provides independent physical validation of the finding.

![Ca II K vs metallicity](/img/dimred/caIIK_prom_vs_mh.png)

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

4. **Gaia/photometric columns:** The reference model includes four Gaia/photometric features (`M_G`, `M_BP`, `M_RP`, `ag_gspphot`). A SHAP analysis of a model without them is not available: the validation run v7 is partial. See the [Data Leakage Audit](../concepts/data-leakage-audit.mdx).
:::

---

## See also

- [Classification Performance](./classification-performance) — balanced accuracy and per-class metrics of the reference run
- [Feature Catalogue](../data/feature-catalog) — all 183 features documented
- [PCA — Physical Interpretation](../dimred/pca) — the complementary unsupervised result
- [Known Limitations](./limitations) — full list of documented limitations
