---
title: Convergence Diagnostics
description: "Convergence of the ξ Dark Energy final MCMC run — acceptance fractions, the integrated autocorrelation time of Ξosc and the practical N/50 > τmax criterion — and what these diagnostics do not test."
sidebar_position: 4
---

import Fact from '@site/src/components/xi/Fact';
import FigureGallery from '@site/src/components/FigureGallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/xi/results/protocol1b_pantheon_desi/run_100000_96.tail.log (tau, acceptance Ξosc) · summary_protocol1b_combined.txt (acceptance) · docs/reproducibility.md · figures/diagnostics/ · config: convergence_flag @ 25ed86e */}

# Convergence Diagnostics

This page reports the sampling diagnostics of the final Protocol 1b run (<Fact path="run.nwalkers" /> walkers × <Fact path="run.nsteps" format="int" /> steps) and states what they do and do not establish. The headline: the Ξosc chain **meets the practical criterion N/50 > τ<sub>max</sub>**, while T and φ₀ remain broad.

---

## Key results

| Diagnostic | ΛCDM | CPL | Ξosc |
|---|---:|---:|---:|
| Mean acceptance fraction | <Fact path="models.LCDM.acceptance" digits={3} /> | <Fact path="models.CPL.acceptance" digits={3} /> | <Fact path="models.Xi_osc.acceptance" digits={3} /> |
| Largest τ | not in the exported files | not in the exported files | <Fact path="models.Xi_osc.tau_max" digits={1} /> (parameter T) |

:::note[Why only Ξosc has a τ]
The exported run journal is truncated to its last 400 lines, which contain the autocorrelation times of Ξosc only. The project report quotes approximate values for the other two models, but no exported output file contains them, so they are not published here.
:::

## Autocorrelation times of Ξosc

`emcee` returns one integrated autocorrelation time per parameter (in steps). Those of Ξosc, computed on the full chain:

| Parameter | H₀ | Ωₘ | w₀,mean | ε | T | φ₀ |
|---|---:|---:|---:|---:|---:|---:|
| τ | <Fact path="models.Xi_osc.tau.H0" digits={1} /> | <Fact path="models.Xi_osc.tau.Omega_m" digits={1} /> | <Fact path="models.Xi_osc.tau.w0_mean" digits={1} /> | <Fact path="models.Xi_osc.tau.eps" digits={1} /> | <Fact path="models.Xi_osc.tau.T_Gyr" digits={1} /> | <Fact path="models.Xi_osc.tau.phi0" digits={1} /> |

The cosmological parameters decorrelate in about <Fact path="models.Xi_osc.tau.H0" digits={0} /> steps; the oscillation period T and phase φ₀ are markedly slower. That is expected from a periodic model: T and φ₀ are strongly coupled (see the diagonal bands in the T–φ₀ panel of the [corner plot](../results/corner-plots.md)).

## The practical criterion

The run uses the rule of thumb **N/50 > τ<sub>max</sub>**, where N is the number of steps per walker (`convergence_flag` in `xi_cosmo.diagnostics`, factor <Fact path="config.convergence_factor" />):

| Quantity | Value |
|---|---:|
| N/50 | <Fact path="convergence.n_over_50" format="int" /> |
| τ<sub>max</sub> (Ξosc) | <Fact path="convergence.tau_max" digits={1} /> |
| Criterion satisfied | yes |

:::tip[Result]
For Ξosc N/50 exceeds τ<sub>max</sub> by a factor <Fact path="convergence.margin" digits={2} /> — enough, but with little margin, for the slowest parameters.
:::

## The Ξosc acceptance fraction is low

Ξosc accepts <Fact path="models.Xi_osc.acceptance" digits={3} /> of proposals, against <Fact path="models.LCDM.acceptance" digits={3} /> for ΛCDM. A low value is typical when the posterior is narrow in some directions and bounded or multimodal in others; it is one reason the chain needs so many steps.

---

## What these diagnostics do not test

| Not tested | Consequence |
|---|---|
| Multimodality / other starting regions | Walkers start from one fixed point ([MCMC Setup](./mcmc-setup.md)); no multi-start or Gelman–Rubin comparison is implemented |
| Prior-boundary accumulation | A well-sampled posterior can still pile up against a bound (ε, T) — see [Oscillation Diagnostic](../results/oscillation.md) |
| Walker traces | Only the flattened chain is saved |
| ΛCDM and CPL τ | Not in the exported files |

## Diagnostic figures from the saved chain

`scripts/make_chain_diagnostics.py` draws two lightweight figures from the flattened Ξosc chain. They are **not** trace plots.

export const diagFigures = [
  {
    src: '/img/xi/diagnostics/running_median_Xi_osc.png',
    title: 'Running median of each Ξosc parameter',
    desc: 'Protocol 1b · flattened chain, median of the first i samples',
    tag: 'Stability',
  },
  {
    src: '/img/xi/diagnostics/marginals_Xi_osc.png',
    title: '1D marginal histograms of Ξosc',
    desc: 'Protocol 1b · flattened chain, 60 bins',
    tag: 'Marginals',
  },
];

<FigureGallery figures={diagFigures} columns={2} />

---

<RelatedPages pages={[
  { href: '/xi-dark-energy/inference/mcmc-setup', title: 'MCMC Setup', desc: 'Walkers, steps, burn-in, initialisation', category: 'concepts' },
  { href: '/xi-dark-energy/results/oscillation', title: 'Oscillation Diagnostic', desc: 'ε, T, φ₀ and prior limits', category: 'science' },
  { href: '/xi-dark-energy/api/diagnostics', title: 'API · Diagnostics & Plotting', desc: 'convergence_flag, plot_running_median', category: 'api' },
]} />
