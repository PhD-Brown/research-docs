---
title: Likelihood Functions
description: "The combined Pantheon+SH0ES + DESI DR2 BAO Gaussian likelihood used by ξ Dark Energy — χ² for supernovae and BAO with full covariances, the numerical distance integrals, and the log-probability with top-hat priors."
sidebar_position: 2
---

import Fact from '@site/src/components/xi/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/xi/results/protocol1b_pantheon_desi/summary_protocol1b_combined.txt (SNe, BAO) · config: chi2_sn, chi2_bao, log_probability, distance_grids @ 25ed86e · docs/model_notes.md */}

# Likelihood Functions

This page defines the function that the sampler evaluates for each parameter vector: a **Gaussian likelihood** on <Fact path="data.n_sne" format="int" /> supernova distance moduli and <Fact path="data.n_bao" /> BAO ratios, each with its full covariance, multiplied by uniform priors.

---

## Combined likelihood

$$
\ln p(\theta \mid \text{data}) = \ln \text{prior}(\theta) - \tfrac{1}{2}\left[\chi^2_{\mathrm{SN}}(\theta) + \chi^2_{\mathrm{BAO}}(\theta)\right]
$$

$$
\chi^2_{\mathrm{SN}} = \Delta\mu^{\mathsf T}\, C_{\mathrm{SN}}^{-1}\, \Delta\mu, \qquad \Delta\mu = \mu_{\mathrm{obs}} - \mu_{\mathrm{th}}(z;\theta)
$$

$$
\chi^2_{\mathrm{BAO}} = \Delta B^{\mathsf T}\, C_{\mathrm{BAO}}^{-1}\, \Delta B, \qquad \Delta B = B_{\mathrm{obs}} - B_{\mathrm{th}}(z;\theta)
$$

- `ln prior` is **0 inside the bounds and −∞ outside** (top-hat priors; see [Prior Specification](./priors.mdx)).
- The covariance matrices are fixed, so the determinant term of the Gaussian is a constant and is dropped.
- The two probes are summed as independent ([Covariance Handling](../data/covariance.md)).
- There is **no nuisance parameter** (no absolute-magnitude offset): the only parameters are those of the model.

## Model predictions

| Quantity | Definition |
|---|---|
| Luminosity distance | `D_L = (1+z) D_C`, with `D_C = (c/H₀) ∫₀ᶻ dz′/E(z′)` |
| Supernova prediction | `μ_th = 5 log₁₀(D_L / Mpc) + 25` |
| BAO predictions | `D_M/r_d`, `D_H/r_d`, `D_V/r_d` with `D_H = c/(H₀E)`, `D_V = [z D_M² D_H]^(1/3)`, r<sub>d</sub> = <Fact path="data.rd_mpc" digits={2} /> Mpc |

with c = <Fact path="config.c_light_km_s" digits={3} /> km/s, flat geometry (D<sub>M</sub> = D<sub>C</sub>) and E(z) from [the model](../overview/models.md).

### Numerical integration

`distance_grids` evaluates E(z) on a uniform grid of <Fact path="config.ngrid" format="int" /> points from 0 to the largest redshift **of the probe being evaluated**, integrates 1/E with a cumulative trapezoidal rule, and **linearly interpolates** D<sub>L</sub>, D<sub>C</sub> and D<sub>H</sub> at the data redshifts. The grid is rebuilt on every call, separately for supernovae and for BAO.

:::caution[Numerical accuracy is not validated in the repository]
The tests of the repository check the result tables and the AIC/BIC arithmetic, not the distance integrals. The grid resolution is a fixed choice, not a convergence-tested one.
:::

---

## Sampling target

`log_probability(params, model, data, xi_helper)` returns `ln prior − ½ χ²`, or −∞ as soon as a parameter leaves its bounds. Because the prior is flat, the log-probability of a sample **is** −½χ² up to a constant: this is what makes the "best sampled point" a usable χ² estimate ([Model Comparison](./model-comparison.md)).

---

<RelatedPages pages={[
  { href: '/xi-dark-energy/inference/mcmc-setup', title: 'MCMC Setup', desc: 'How the likelihood is sampled', category: 'concepts' },
  { href: '/xi-dark-energy/api/likelihood', title: 'API · Likelihood Functions', desc: 'Signatures and arguments', category: 'api' },
  { href: '/xi-dark-energy/overview/models', title: 'Three Model Families', desc: 'E(z) for each model', category: 'concepts' },
]} />
