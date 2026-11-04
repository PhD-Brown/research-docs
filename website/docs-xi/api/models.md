---
title: Cosmological Models
description: "API for the ξ Dark Energy model functions — E_lcdm, E_cpl, the XiOscillator class, E_model, distance_grids, mu_model and bao_predictions in src/xi_protocol1b_bao_run.py."
sidebar_position: 1
---

import Fact from '@site/src/components/xi/Fact';

{/* facts: none (signatures only) · source: src/xi_protocol1b_bao_run.py @ 25ed86e · config.ngrid, config.xi_time_reference */}

# Cosmological Models

## Overview

The model functions live in `src/xi_protocol1b_bao_run.py`, not in `xi_cosmo`. Each `E_*` function returns the dimensionless expansion rate E(z) = H(z)/H₀ for a flat universe. Equations and interpretation: [Three Model Families](../overview/models.md).

## `E_lcdm`

```python
# src/xi_protocol1b_bao_run.py
def E_lcdm(z: np.ndarray, Om: float) -> np.ndarray
```

| Parameter | Description |
|---|---|
| `z` | redshift array |
| `Om` | matter fraction Ωₘ |

**Returns** `sqrt(Om (1+z)³ + (1 − Om))`.

## `E_cpl`

```python
def E_cpl(z: np.ndarray, Om: float, w0: float, wa: float) -> np.ndarray
```

**Returns** E(z) for w(z) = w₀ + wₐ z/(1+z), using the closed-form dark-energy density `(1+z)^(3(1+w0+wa)) · exp(−3 wa z/(1+z))`.

## `XiOscillator`

```python
class XiOscillator:
    def __init__(self, zmax: float, ngrid: int = 3000, Om_ref: float = 0.3, H0_ref: float = 70.0)
    def w_grid(self, w0_mean, eps, T_gyr, phi0) -> np.ndarray
    def rho_de_ratio_grid(self, w0_mean, eps, T_gyr, phi0) -> np.ndarray
    def E_grid(self, z_grid, Om, w0_mean, eps, T_gyr, phi0) -> np.ndarray
    def w_of_z(self, z, w0_mean, eps, T_gyr, phi0) -> np.ndarray
```

| Constructor argument | Description |
|---|---|
| `zmax` | upper end of the internal redshift grid; must cover the largest redshift evaluated |
| `ngrid` | grid size (default <Fact path="config.ngrid" format="int" />) |
| `Om_ref`, `H0_ref` | **reference** cosmology used once to compute the cosmic age t(z) on the grid (defaults <Fact path="config.xi_time_reference.Omega_m" digits={1} />, <Fact path="config.xi_time_reference.H0" format="int" />); `astropy.cosmology.FlatLambdaCDM` |

| Method | Returns |
|---|---|
| `w_grid` | w(t(z)) = w₀,mean + ε cos(2π t/T + φ₀) on the internal grid; `T_gyr` in Gyr, `phi0` in rad |
| `rho_de_ratio_grid` | ρ_DE(z)/ρ_DE(0) = exp(3 ∫(1+w)/(1+z′)dz′), cumulative trapezoid |
| `E_grid` | E(z) at the requested redshifts, by linear interpolation of the density ratio |
| `w_of_z` | w at the requested redshifts, by linear interpolation |

**Example**

```python
import numpy as np
from xi_protocol1b_bao_run import XiOscillator

xi = XiOscillator(zmax=2.4)
z = np.linspace(0, 2.4, 100)
w = xi.w_of_z(z, w0_mean=-1.0, eps=0.1, T_gyr=5.0, phi0=0.0)   # illustrative values
```

## `E_model`

```python
def E_model(z, params, model: str, xi_helper: XiOscillator | None = None) -> np.ndarray
```

Dispatches on `model` ∈ {`"LCDM"`, `"CPL"`, `"Xi_osc"`}. `params` is ordered as in [`MODEL_LABELS`](./diagnostics.md): `[H0, Om]`, `[H0, Om, w0, wa]`, `[H0, Om, w0_mean, eps, T_gyr, phi0]`. `xi_helper` is **required** for `"Xi_osc"` (raises `ValueError` otherwise); any other model name raises `ValueError`.

## Distances

```python
def distance_grids(zmax, params, model, xi_helper=None, ngrid=3000)
    -> (zg, Eg, DC, DH, DL)          # Mpc
def mu_model(z_sn, params, model, xi_helper=None) -> np.ndarray
def bao_predictions(z_bao, types_bao, params, model, xi_helper=None, rd=147.09) -> np.ndarray
```

- `distance_grids` integrates 1/E on a uniform grid with a cumulative trapezoidal rule: `DC = (c/H0) ∫ dz/E`, `DH = c/(H0 E)`, `DL = (1+z) DC`.
- `mu_model` interpolates `DL` at the supernova redshifts and returns `5 log10(DL) + 25`.
- `bao_predictions` returns `DM/rd`, `DH/rd` or `DV/rd` for each entry of `types_bao` (`"DM_over_rs"`, `"DH_over_rs"`, `"DV_over_rs"`); any other type raises `ValueError`. `rd` defaults to the fixed fiducial value.

## Notes

- The grid for each probe ends at the largest redshift **of that probe**, and `XiOscillator` must be built with a `zmax` at least as large as both.
- Results are not validated against an independent distance code in the repository's tests.
- Interpretation of the oscillation and its time variable: [Three Model Families](../overview/models.md).
