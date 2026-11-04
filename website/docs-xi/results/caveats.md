---
title: Known Limitations
description: "Documented limitations of the ξ Dark Energy v0.1.0-exploratory analysis — three critical caveats."
sidebar_position: 4
---

import Fact from '@site/src/components/xi/Fact';

{/* facts: facts.json config.xi_time_reference.* · config.priors.* · eps.* · models.Xi_osc.params.* (protocol1b) · FACTS_INDEX ξ §2.9, §3 */}

# Known Limitations

:::caution[Exploratory release]
All results in this project are from `v0.1.0-exploratory`.
The following limitations have been explicitly documented before making any physical claims.
:::

## Limitation 1 — Fixed sound horizon (r_d)

The sound horizon r_d is fixed to a CMB-derived value (<Fact path="data.rd_mpc" digits={2} /> Mpc). This implicitly imports a CMB prior on early-universe physics, making the analysis not fully independent of CMB constraints.

**Planned fix (v0.2):** Free r_d as a nuisance parameter, marginalising over it with a Gaussian prior.

## Limitation 2 — t(z) self-consistency bias

The oscillating equation of state of Ξosc is a function of cosmic time, w(t) = w₀,mean + ε cos(2π t/T + φ₀). The cosmic age t(z) that maps redshift to time is computed **once, for a fixed reference cosmology** (flat ΛCDM with H₀ = <Fact path="config.xi_time_reference.H0" format="int" />, Ωₘ = <Fact path="config.xi_time_reference.Omega_m" digits={1} />, T<sub>CMB</sub> = <Fact path="config.xi_time_reference.T_cmb_K" digits={3} /> K, via `astropy`), not for the H₀ and Ωₘ of the current MCMC sample. The time axis on which the oscillation is defined is therefore inconsistent with the cosmology being sampled, and the period T and phase φ₀ are expressed in the time of the reference cosmology. This does not affect ΛCDM or CPL.

**Planned fix (v0.2):** Compute t(z) self-consistently for each MCMC sample.

## Limitation 3 — ε prior boundary effects

The oscillation amplitude ε in Ξosc is constrained to ε ≥ 0 by a one-sided prior. The ~2.26σ preference for non-zero ε is partially a boundary effect — if the true posterior extends to negative ε, the one-sided prior artificially inflates the apparent significance.

**Planned fix (v0.2):** Implement a symmetric prior on ε, centred at zero.

### The posteriors of ε and T reach their prior bounds

The boundary problem is not limited to ε ≥ 0. The ε marginal stays high up to its upper bound (0 < ε < <Fact path="config.priors.eps.1" digits={1} />; median <Fact path="models.Xi_osc.params.eps.median" digits={3} />, upper 1σ edge <Fact path="eps.upper_1sigma" digits={3} />), and the T posterior is multi-featured up to its upper bound (<Fact path="config.priors.T_Gyr.0" format="int" /> < T < <Fact path="config.priors.T_Gyr.1" format="int" /> Gyr; median <Fact path="models.Xi_osc.params.T_Gyr.median" digits={2} /> Gyr). Where the posterior is cut off by the prior, the reported median and interval describe the prior range as much as the data, and the best-sample χ², AIC and BIC of Ξosc are approximations (FACTS_INDEX ξ §2.9). See [Oscillation Amplitude](./oscillation) and [Prior Specification](../inference/priors).

---

## What this means for the current results

The ΛCDM and CPL results are minimally affected by these limitations and can be considered indicative. The Ξosc results should be treated as **preliminary and not physically interpretable** until v0.2 fixes are implemented.

## See also

- [Roadmap (planned v0.2)](../community/roadmap) — fix timeline
- [Results](/research-docs/xi-dark-energy/results/) — current outputs
