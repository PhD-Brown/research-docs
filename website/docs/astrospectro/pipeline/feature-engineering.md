---
title: Feature Engineering
description: "How AstroSpectro's FeatureEngineer module extracts 183 physics-based spectroscopic features from LAMOST spectra."
sidebar_position: 3
tags: [feature-engineering, spectroscopy, balmer, calcium, equivalent-width]
---

# Feature Engineering

## Overview

The `FeatureEngineer` class extracts **183 physics-based spectroscopic features**
from each preprocessed LAMOST spectrum. All features correspond to physically
interpretable spectral properties — no positional, instrumental, or metadata features
are included in `spectro_only=True` mode.

:::info Design philosophy
Every feature in AstroSpectro can be computed by a spectroscopist working with only
the stellar spectrum. No positional information, survey metadata, or Gaia-derived
parameters are used in `spectro_only=True` mode.
:::

---

## The 9 feature families

### 1. Balmer series (Hα to Hθ) — ~25 features

For each Balmer line, three measurements are extracted:

| Measurement | Symbol | Unit | Description |
|-------------|--------|------|-------------|
| Equivalent width | EW | Å | Integrated line strength relative to continuum |
| Prominence | prom | — | Peak depth relative to local pseudo-continuum |
| FWHM | fwhm | Å | Full width at half maximum |

**Reference wavelengths (NIST):**

| Line | λ (Å) | Series |
|------|--------|--------|
| Hα | 6562.8 | n=3→2 |
| Hβ | 4861.3 | n=4→2 |
| Hγ | 4340.5 | n=5→2 |
| Hδ | 4101.7 | n=6→2 |

### 2. Ca II H&K doublet — ~20 features

| Line | λ (Å) | Importance |
|------|--------|-----------|
| Ca II K | 3933.7 | **#1 SHAP feature** |
| Ca II H | 3968.5 | **#4 SHAP feature** |
| Ca II IR triplet | 8498, 8542, 8662 | Additional gravity indicator |

### 3. Mg / Na / α-elements — ~15 features

| Line | λ (Å) | Physical use |
|------|--------|-------------|
| Mg b triplet | 5167, 5173, 5184 | Gravity + metallicity |
| Na D doublet | 5890, 5896 | ISM + chromospheric |
| [Mg/Fe] proxy | derived | α-element enhancement |

### 4. Molecular bands — ~20 features

Active for T_eff < ~4,000 K (K-M stars):

| Band | Molecule | λ range (Å) |
|------|---------|------------|
| TiO γ | TiO | 5167–5169 |
| TiO ε | TiO | 8432–8452 |
| CaH | CaH | 6382–6389 |
| MgH | MgH | 4780–4850 |

### 5. Fe & metal lines — ~25 features

Key iron lines used in metallicity indices:

| Line | λ (Å) |
|------|--------|
| Fe I | 4668, 5270, 5335, 5406, 5709, 5782 |
| Fe II | 4924, 5018, 5169 |

### 6. Continuum indices — ~30 features

Shape-based features computed from spectral continuum:

- Synthetic colour indices (B−V, V−I, R−I equivalents)
- Blue/red flux ratios
- Continuum slope fits
- Lick IDS indices

### 7. Line ratios — ~20 features

Physically motivated ratios between pairs of lines:

```python
# Examples
Ca_K_to_Hb    = Ca_II_K_EW / Hbeta_EW     # metallicity/temperature
Fe_to_Mg      = Fe_EW_sum / Mg_b_EW        # [Fe/Mg] proxy
TiO_to_CaH    = TiO_index / CaH_index      # luminosity class (M stars)
```

### 8. Line-profile moments — ~15 features

For key lines (Hα, Ca II K, Mg b):
- **Asymmetry:** skewness of the line profile
- **Kurtosis:** peakedness relative to Gaussian
- **EW/FWHM ratio:** shape parameter

### 9. match_* columns — ~13 features

These features are added by `ProcessingPipeline` during the line-matching step.
They represent the best-match line measurements after correcting for radial velocity:

```
match_CaIIK_prom, match_CaIIH_prom, match_Hbeta_EW, ...
```

:::note
These `match_*` columns are the difference between the 174-feature FeatureEngineer output
and the **canonical 183-feature** total. Always use `spectro_only=True` mode to ensure
all 183 features are properly computed.
:::

---

## Implementation

```python
from pipeline.feature_engineering import FeatureEngineer

fe = FeatureEngineer(spectro_only=True)
features_df = fe.extract_features(spectra_df)
# → DataFrame with 183 columns per spectrum
```

### NumPy 2.0 compatibility note

The module uses `np.trapezoid` (NumPy 2.0+) with a fallback to `np.trapz` (NumPy < 2.0):

```python
try:
    area = np.trapezoid(y, x)
except AttributeError:
    area = np.trapz(y, x)  # NumPy < 2.0
```

---

## Performance

| | Value |
|--|-------|
| Extraction time per spectrum | ~2 ms |
| Full dataset (N = 43,019) | ~90 s (Ryzen 9 5950X, 32 threads) |
| Parallelisation | `joblib` with `num_workers=0` (Windows) |
| Memory footprint | ~45 MB for full feature matrix |

---

## See also

- [Feature Catalogue](../data/feature-catalog) — all 183 features documented
- [spectro_only=True Mode](../concepts/spectro-only-mode) — which features are included
- [Processing Pipeline](./processing-pipeline) — how match_* columns are added
- [FeatureEngineer API](../api/feature-engineer) — complete API reference
