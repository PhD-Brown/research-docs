---
title: Likelihood Functions
description: "API for the ξ Dark Energy likelihood — data loaders, log_prior, chi2_sn, chi2_bao, chi2_combined and log_probability in src/xi_protocol1b_bao_run.py."
sidebar_position: 2
---

import Fact from '@site/src/components/xi/Fact';

{/* facts: none (signatures only) · source: src/xi_protocol1b_bao_run.py @ 25ed86e · config.priors */}

# Likelihood Functions

## Overview

Functions of `src/xi_protocol1b_bao_run.py` that load the data and evaluate the posterior. Definition and interpretation: [Likelihood Functions](../inference/likelihood.md) (concept page).

## Data loaders

```python
# src/xi_protocol1b_bao_run.py
def load_pantheon_data(filepath: Path, zcut: float = 0.01)
    -> (z, mu, mu_err, kept_idx, n_rows_total)
def load_pantheon_covariance(cov_filepath: Path, kept_idx: np.ndarray)
    -> (cov, cov_inv)
def load_desi_bao(mean_filepath: Path, cov_filepath: Path)
    -> (z_bao, types, values, cov, cov_inv)
```

| Function | Raises |
|---|---|
| `load_pantheon_data` | `FileNotFoundError` if the file is missing; `ValueError` listing the columns if `zHD`, `MU_SH0ES`, `MU_SH0ES_ERR_DIAG` (or their `SHOES` spellings) are absent |
| `load_pantheon_covariance` | `FileNotFoundError`; `ValueError` if the entry count is not N² |
| `load_desi_bao` | `FileNotFoundError`; `ValueError` if no row can be read or the covariance shape does not match |

`z`, `mu` and `mu_err` are already restricted to z > `zcut`; `kept_idx` indexes the original rows and must be passed to `load_pantheon_covariance` so that the matrix is cut consistently. See [Covariance Handling](../data/covariance.md).

## `log_prior`

```python
def log_prior(params: np.ndarray, model: str) -> float
```

Returns `0.0` inside the model's bounds and `-inf` outside (including for an unknown model name). Bounds: [Prior Specification](../inference/priors.mdx). For Ξosc: <Fact path="config.priors.eps.0" digits={1} /> < ε < <Fact path="config.priors.eps.1" digits={1} />.

## χ² functions

```python
def chi2_sn(params, model, z_sn, mu_sn, C_sn_inv, xi_helper=None) -> float
def chi2_bao(params, model, z_bao, types_bao, vals_bao, C_bao_inv, xi_helper=None) -> float
def chi2_combined(params, model, data: tuple, xi_helper=None) -> float
```

`data` is the tuple `(z_sn, mu_sn, C_sn_inv, z_bao, types_bao, vals_bao, C_bao_inv)`. `chi2_combined` is `chi2_sn + chi2_bao`. All three return the quadratic form `Δᵀ C⁻¹ Δ` with the **inverse** covariance passed in.

## `log_probability`

```python
def log_probability(params, model, data, xi_helper=None) -> float
```

Returns `log_prior − ½ chi2_combined`, or `-inf` as soon as the prior is violated — without evaluating the χ². This is the function handed to `emcee.EnsembleSampler`.

## Example

```python
import numpy as np
from xi_protocol1b_bao_run import log_probability, XiOscillator   # src/ on sys.path

# data = (z_sn, mu_sn, C_sn_inv, z_bao, types_bao, vals_bao, C_bao_inv) from the loaders above
lp = log_probability(np.array([70.0, 0.3]), "LCDM", data)            # illustrative parameters
```

## Notes

- Parameter vectors are ordered as in [`MODEL_LABELS`](./diagnostics.md).
- `xi_helper` is only used by `"Xi_osc"`.
- Every call recomputes the distance grids; there is no caching.
