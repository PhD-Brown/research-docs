---
title: Pantheon+SH0ES
description: "How ξ Dark Energy reads the Pantheon+SH0ES Type Ia supernova catalogue — columns, the z > 0.01 cut, the SH0ES-calibrated distance moduli and what that implies for H0."
sidebar_position: 2
---

import Fact from '@site/src/components/xi/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/xi/results/protocol1b_pantheon_desi/summary_protocol1b_combined.txt (SNe utilisées) · reports/latex/main.tex (1701, z range) · config: load_pantheon_data(zcut) @ 25ed86e · data/README.md */}

# Pantheon+SH0ES

This page documents the supernova half of the data: the **Pantheon+SH0ES** distance-modulus catalogue, of which <Fact path="data.n_sne" format="int" /> of <Fact path="data.n_sne_before_cut" format="int" /> entries survive the redshift cut and enter the likelihood.

---

## At a glance

| Quantity | Value |
|---|---|
| Entries in the file | <Fact path="data.n_sne_before_cut" format="int" /> |
| Kept (z > <Fact path="config.z_cut" digits={2} />) | <Fact path="data.n_sne" format="int" /> |
| Redshift range kept | <Fact path="data.z_min" digits={5} /> → <Fact path="data.z_max" digits={5} /> |
| Distance modulus | `MU_SH0ES` (or `MU_SHOES`) |
| Covariance | `Pantheon+SH0ES_STAT+SYS.cov`, rows/columns of the kept SNe |

---

## Columns read

| Column | Meaning | Fallback name |
|---|---|---|
| `zHD` | Hubble-diagram redshift | — |
| `MU_SH0ES` | observed distance modulus | `MU_SHOES` |
| `MU_SH0ES_ERR_DIAG` | diagonal error on μ | `MU_SHOES_ERR_DIAG` |

The loader (`load_pantheon_data`) raises an explicit error listing the available columns if one of the three is missing. The diagonal errors are only used for reporting: the likelihood uses the **full covariance matrix** ([Covariance Handling](./covariance.md)).

## The redshift cut

Supernovae with z ≤ <Fact path="config.z_cut" digits={2} /> are removed to limit the influence of local peculiar velocities. The cut is applied to `zHD`, and the **row indices of the kept supernovae are carried over** to the covariance matrix so that the two stay aligned.

---

## The distance moduli are SH0ES-calibrated

:::caution[Read H₀ with this in mind]
`MU_SH0ES` is the Pantheon+ distance modulus on the SH0ES calibration scale. The fit has **no free absolute-magnitude nuisance parameter**: it compares `MU_SH0ES` directly with the model μ(z) = 5 log₁₀(D<sub>L</sub>/Mpc) + 25. The H₀ values obtained ([Parameter Constraints](../results/parameter-constraints.md)) therefore sit on that calibration scale and should not be read as an independent H₀ measurement.
:::

---

## How to load

```python
# src/xi_protocol1b_bao_run.py
from pathlib import Path
from xi_protocol1b_bao_run import load_pantheon_data, load_pantheon_covariance

z, mu, mu_err, kept_idx, n_total = load_pantheon_data(Path("data/raw/Pantheon+SH0ES.dat"), zcut=0.01)
cov, cov_inv = load_pantheon_covariance(Path("data/raw/Pantheon+SH0ES_STAT+SYS.cov"), kept_idx)
```

The catalogue is an external survey product and is not redistributed with the repository; place it in `data/raw/` by hand ([Quick Run](../reproducibility/quick-run.md)).

---

<RelatedPages pages={[
  { href: '/xi-dark-energy/data/covariance', title: 'Covariance Handling', desc: 'STAT+SYS matrix, subsetting, inversion', category: 'concepts' },
  { href: '/xi-dark-energy/inference/likelihood', title: 'Likelihood Functions', desc: 'χ²_SN and the combined likelihood', category: 'concepts' },
  { href: '/xi-dark-energy/results/caveats', title: 'Known Limitations', desc: 'What is fixed in v0.1.0', category: 'science' },
]} />
