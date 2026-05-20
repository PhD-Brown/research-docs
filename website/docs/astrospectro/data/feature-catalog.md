---
title: Feature Catalogue — 183 Spectroscopic Features
description: "Complete reference for all 183 spectroscopic features extracted by AstroSpectro in spectro_only=True mode."
sidebar_position: 5
tags: [features, spectroscopy, calcium, balmer, feature-engineering]
---

# Feature Catalogue — 183 Spectroscopic Features

:::note[Canonical mode]
All features listed here are extracted in `spectro_only=True` mode.
Total: **183 features** across 9 families.
:::

:::info[Feature count clarification]
Earlier documentation cited 174 features (FeatureEngineer output only).
The canonical count of **183** includes ~9 `match_*` columns added by ProcessingPipeline
during the line-matching step. See [spectro_only=True Mode](../concepts/spectro-only-mode).
:::

---

## Feature families overview

| Family | Count | Physical domain | Example features |
|--------|-------|----------------|-----------------|
| Balmer lines | ~25 | Temperature | Hα EW, Hβ prominence, Hγ FWHM |
| Ca II H&K | ~20 | Metallicity / activity | Ca II K EW, Ca II H prominence |
| Na / Mg / α-elements | ~15 | Chemistry / gravity | Na D EW, Mg b EW, Mg b prominence |
| Molecular bands | ~20 | Cool stars (T_eff < 4000 K) | TiO Δm, CaH index, MgH band |
| Fe & metals | ~25 | Metallicity | Fe I λ5270 EW, Fe I λ4668 |
| Continuum indices | ~30 | Temperature / gravity | B−V synthetic, fblue/fred, colour slopes |
| Line ratios | ~20 | Temperature / metallicity | Ca II K / Hβ, Fe / Mg |
| Line-profile moments | ~15 | Pressure / rotation | FWHM, asymmetry, kurtosis |
| match_* columns | ~13 | Line-matching (ProcessingPipeline) | match_CaIIH_prom, match_Hβ_EW |

---

## Key features by SHAP importance

These features rank highest in the SHAP analysis on the canonical `spectro_only=True` run
(see [SHAP Interpretability](../science/shap-interpretability)):

| SHAP rank | Feature name | Family | Physical interpretation |
|-----------|-------------|--------|------------------------|
| 1 | `num_feature_CaIIK_prom` | Ca II | Ca II K line prominence — metallicity proxy |
| 2 | `num_feature_CaIIK_ew` | Ca II | Ca II K equivalent width |
| 3 | `num_feature_CaIIK_fwhm` | Ca II | Ca II K line width (pressure broadening) |
| 4 | `num_feature_CaIIH_prom` | Ca II | Ca II H prominence |
| 5 | `num_feature_CaIIH_ew` | Ca II | Ca II H equivalent width |
| 6 | `num_feature_Ha_ew` | Balmer | H-alpha equivalent width |
| 7 | `num_feature_Ha_prom` | Balmer | H-alpha prominence |
| 8 | `num_feature_Mgb_ew` | Metals | Mg b equivalent width |
| 9 | `num_feature_Mgb_prom` | Metals | Mg b prominence |
| 10 | `num_feature_Balmer_temp_index` | Balmer | Combined Balmer temperature index |

---

## Key features by PCA loading (PC1 — thermal axis)

These features contribute most to PC1 (ρ(PC1, T_eff) = +0.831):

| PC1 rank | Feature | Loading w | Interpretation |
|----------|---------|-----------|---------------|
| 1 | W(Hα) | +0.173 | Hα equivalent width — T_eff indicator |
| 2 | Continuum asymmetry | +0.172 | Blue/red slope |
| 3 | W(Mg b) | −0.171 | Mg b EW |
| 4 | Synthetic B−V | −0.163 | Colour temperature proxy |
| 5 | f_blue / f_red | +0.161 | Flux ratio |

---

## Feature families in detail

### Balmer series (Hα to Hθ)

Hydrogen Balmer absorption lines are the primary temperature indicators in stellar spectra.
For each line, three measurements are extracted:
- **EW (equivalent width):** integrated line strength in Å
- **Prominence:** peak depth relative to local pseudo-continuum
- **FWHM:** full width at half maximum in Å

```
Features: Ha_ew, Ha_prom, Ha_fwhm, Hb_ew, Hb_prom, Hb_fwhm, ...
```

![Hα FWHM vs T_eff](https://phd-brown.github.io/AstroSpectro/img/dimred/ha_fwhm_vs_teff.png)

*Hα FWHM vs Gaia DR3 T_eff — strong correlation confirming physical grounding*

---

### Ca II H&K doublet

Ca II H (3968 Å) and K (3933 Å) are the strongest lines in stellar optical spectra.
They serve simultaneously as:
- **Metallicity proxies** (line strength ∝ Ca abundance)
- **Chromospheric activity indicators** (emission cores in active stars)

These are the top SHAP-ranked features in the canonical model.

![Ca II K vs metallicity](https://phd-brown.github.io/AstroSpectro/img/dimred/caIIK_prom_vs_mh.png)

*Ca II K prominence vs Gaia DR3 [Fe/H] — physical correlation between top SHAP feature and metallicity*

---

### Molecular bands (cool stars)

For T_eff < ~4,000 K, molecular absorption bands become the dominant spectral features:

| Band | Molecule | Wavelength range | Physical use |
|------|---------|-----------------|-------------|
| TiO | Titanium oxide | Multiple (5000–9000 Å) | Cool K-M stars |
| CaH | Calcium hydride | 6382–6389 Å | M subdwarfs vs giants |
| MgH | Magnesium hydride | 4780–4850 Å | Cool star gravity indicator |
| VO | Vanadium oxide | 7850–7860 Å | Very cool M stars |

---

### SNR quality check

![SNR quality check](https://phd-brown.github.io/AstroSpectro/img/dimred/snr_quality_check.png)

*SNR distribution across the 43,019-spectrum dataset — quality filtering at SNR_g > threshold*

---

### Colour indices

![Colour indices](https://phd-brown.github.io/AstroSpectro/img/dimred/color_indices.png)

*Synthetic colour indices (B−V, V−I, etc.) derived from the spectroscopic continuum*

---

## Column naming convention

```
num_feature_{line}_{measurement}

Examples:
  num_feature_CaIIK_ew       → Ca II K equivalent width
  num_feature_Ha_fwhm        → Hα full width at half maximum
  num_feature_Mgb_prom       → Mg b prominence
  num_feature_Balmer_temp_index → combined Balmer temperature index
  match_CaIIH_prom           → Ca II H match from ProcessingPipeline
```

---

## See also

- [spectro_only=True Mode](../concepts/spectro-only-mode) — which features are included/excluded
- [Physical Purity & Leakage](../concepts/physical-purity) — why non-physical features are excluded
- [Feature Engineering](../pipeline/feature-engineering) — how features are computed
- [SHAP Interpretability](../science/shap-interpretability) — feature importance analysis
- [PCA — Physical Interpretation](../dimred/pca) — PCA loadings by feature family
