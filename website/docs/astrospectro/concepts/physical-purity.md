---
title: "Physical Purity & Leakage Prevention"
description: Why certain features are excluded from the canonical pipeline and how leakage is prevented.
sidebar_position: 4
---

# Physical Purity & Leakage Prevention

AstroSpectro distinguishes between **physical features** (spectroscopic properties of stars) and **non-physical features** (observational, instrumental, or Gaia-derived metadata).

## Types of problematic features

### 1. Positional features: `ra`, `dec`

LAMOST observes targets according to survey programs. Certain programs target specific spectral types in specific sky regions. Including `ra` and `dec` allows the model to exploit this geographic correlation rather than learning spectral physics.

**Effect:** Removing ra/dec increased BA from 84% → 87%.

### 2. Instrumental metadata: `fiber_id`, `seeing`, `jd`

These encode nothing about the stellar physics — only the observational conditions.

### 3. Observational proxies: `redshift`, `snr_*`

For Galactic stars, `redshift` ≈ radial velocity / c ≈ 0. It is correlated with spectral class only because of population dynamics, not intrinsic spectral physics. SNR bands can correlate with spectral type due to instrumental sensitivity curves.

### 4. Gaia-derived features: `teff_gspphot`, `logg_gspphot`

:::caution Partially circular features
Gaia's GSP-Phot derives `teff_gspphot` from BP/RP photometry and spectra. Using this to predict spectral class (which is itself a temperature sequence) creates a partially circular inference chain. These features are excluded in `spectro_only=True` mode.
:::

## Rule of thumb

> *A feature is physical if a spectroscopist working with only the spectrum could compute it.*

## See also

- [spectro_only=True Mode](./spectro-only-mode)
- [Feature Catalogue](../data/feature-catalog)
- [Limitations](../science/limitations)
