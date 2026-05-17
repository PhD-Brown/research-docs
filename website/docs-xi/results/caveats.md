---
title: Known Limitations
description: "Documented limitations of the ξ Dark Energy v0.1.0-exploratory analysis — three critical caveats."
sidebar_position: 4
---

# Known Limitations

:::caution Exploratory release
All results in this project are from `v0.1.0-exploratory`.
The following limitations have been explicitly documented before making any physical claims.
:::

## Limitation 1 — Fixed sound horizon (r_d)

The sound horizon r_d is fixed to a CMB-derived value (~147.09 Mpc). This implicitly imports a CMB prior on early-universe physics, making the analysis not fully independent of CMB constraints.

**Planned fix (v0.2):** Free r_d as a nuisance parameter, marginalising over it with a Gaussian prior.

## Limitation 2 — t(z) self-consistency bias

The comoving distance integral t(z) is computed assuming a fixed reference cosmology, not the current MCMC sample. This creates a self-consistency bias — the likelihood is evaluated at a slightly different cosmology than what is being sampled.

**Planned fix (v0.2):** Compute t(z) self-consistently for each MCMC sample.

## Limitation 3 — ε prior boundary effects

The oscillation amplitude ε in Ξosc is constrained to ε ≥ 0 by a one-sided prior. The ~2.26σ preference for non-zero ε is partially a boundary effect — if the true posterior extends to negative ε, the one-sided prior artificially inflates the apparent significance.

**Planned fix (v0.2):** Implement a symmetric prior on ε, centred at zero.

---

## What this means for the current results

The ΛCDM and CPL results are minimally affected by these limitations and can be considered indicative. The Ξosc results should be treated as **preliminary and not physically interpretable** until v0.2 fixes are implemented.

## See also

- [Roadmap (planned v0.2)](#) — fix timeline
- [Results](/research-docs/xi-dark-energy/results/) — current outputs
