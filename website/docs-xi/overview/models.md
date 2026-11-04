---
title: Three Model Families
description: "The three dark-energy models compared by ξ Dark Energy — ΛCDM, CPL and the oscillating Ξosc — with their equations, free parameters, priors and numerical implementation."
sidebar_position: 3
---

import PriorTable from '@site/src/components/xi/PriorTable';
import RelatedPages from '@site/src/components/RelatedPages';
import Fact from '@site/src/components/xi/Fact';

{/* facts: _facts/xi/results/protocol1b_pantheon_desi/final_parameter_estimates.csv (parameter list, k) · config: src/xi_protocol1b_bao_run.py (log_prior, XiOscillator) @ 25ed86e · docs/model_notes.md */}

# Three Model Families

This page defines the three flat-universe models fitted to Pantheon+SH0ES + DESI DR2 BAO: **ΛCDM** (<Fact path="models.LCDM.k" /> free parameters), **CPL** (<Fact path="models.CPL.k" />) and **Ξosc** (<Fact path="models.Xi_osc.k" />). All three share H₀ and Ωₘ and are sampled with the same top-hat priors on those parameters.

---

## Expansion histories

In a flat universe, E(z) = H(z)/H₀. Matter is the only other component, so only the dark-energy density term changes between models.

| Model | w | E²(z) |
|---|---|---|
| **ΛCDM** | −1 | `Ωm (1+z)³ + (1 − Ωm)` |
| **CPL** | `w₀ + wₐ z/(1+z)` | `Ωm (1+z)³ + (1 − Ωm)(1+z)^(3(1+w₀+wₐ)) exp[−3 wₐ z/(1+z)]` |
| **Ξosc** | `w₀,mean + ε cos(2π t/T + φ₀)` | `Ωm (1+z)³ + (1 − Ωm) ρ_DE(z)/ρ_DE(0)` with `ρ_DE(z)/ρ_DE(0) = exp[3 ∫₀ᶻ (1+w)/(1+z′) dz′]` |

### How Ξosc is implemented

The oscillation is a function of **cosmic time** t, but the likelihood is evaluated in redshift. The code (`XiOscillator`) therefore builds, once, a redshift grid and the cosmic age t(z) on that grid from a **fixed reference cosmology** — flat ΛCDM with H₀ = <Fact path="config.xi_time_reference.H0" format="int" /> and Ωₘ = <Fact path="config.xi_time_reference.Omega_m" digits={1} /> (`astropy`) — then evaluates w on it, integrates the density ratio with a trapezoidal rule and interpolates. The time axis is **not** recomputed from the cosmology being sampled; this is limitation 2 on [Known Limitations](../results/caveats.md).

:::note[Two consequences worth knowing]
**w(z=0) is not w₀,mean.** The present-day value is w₀,mean + ε cos(2π t₀/T + φ₀), which depends on the phase. The `w0_mean` parameter is the *average* level around which w oscillates.

**Ξosc does not nest ΛCDM.** Setting ε → 0 gives a constant w = w₀,mean (a wCDM model), which equals ΛCDM only if w₀,mean = −1 as well. Neither is Ξosc nested in CPL. AIC and BIC remain usable, but a likelihood-ratio reading of "ε = 0" is not a test of ΛCDM.
:::

---

## Free parameters and priors

All priors are uniform inside the bounds below and zero outside (open intervals; `log_prior` returns −∞ outside). They are read from the sampling script — see the [Prior Specification](../inference/priors.mdx) page for the discussion of why they matter.

<PriorTable />

---

## Why these three

| Property | ΛCDM | CPL | Ξosc |
|---|---|---|---|
| Dark-energy behaviour | constant | smooth, monotonic in z | periodic in cosmic time |
| Role | baseline | standard dynamical comparator | exploratory probe |
| Extra parameters vs ΛCDM | — | w₀, wₐ | w₀,mean, ε, T, φ₀ |
| Weakly constrained parameters | — | wₐ | T, φ₀ (and ε near its bounds) |

---

<RelatedPages pages={[
  { href: '/xi-dark-energy/inference/priors', title: 'Prior Specification', desc: 'Bounds, boundary effects, sensitivity checks', category: 'concepts' },
  { href: '/xi-dark-energy/inference/likelihood', title: 'Likelihood Functions', desc: 'How each model meets the data', category: 'concepts' },
  { href: '/xi-dark-energy/results/parameter-constraints', title: 'Parameter Constraints', desc: 'Posterior medians and 16–84% intervals', category: 'science' },
  { href: '/xi-dark-energy/api/models', title: 'API · Cosmological Models', desc: 'E_lcdm, E_cpl, XiOscillator', category: 'api' },
]} />
