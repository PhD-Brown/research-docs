---
title: MCMC Setup
description: "How ξ Dark Energy samples the posterior with emcee — initialisation, run modes (quick, default, final), burn-in, flattened chains and their size — for the Pantheon+SH0ES + DESI DR2 BAO final run."
sidebar_position: 3
---

import Fact from '@site/src/components/xi/Fact';
import PriorTable from '@site/src/components/xi/PriorTable';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/xi/docs/reproducibility.md (command) · results/protocol1b_pantheon_desi/run_100000_96.tail.log (steps, samples kept) · MANIFEST.md (chain sizes) · config: run_mcmc, make_initial_walkers, main @ 25ed86e */}

# MCMC Setup

This page documents the sampler configuration of the **final Protocol 1b run**: <Fact path="run.nwalkers" /> walkers × <Fact path="run.nsteps" format="int" /> steps per model with `emcee`, burn-in <Fact path="run.burn_in" format="int" />, giving <Fact path="run.samples_kept" format="int" /> retained samples per model.

---

## Final run

```bash
python src/xi_protocol1b_bao_run.py --nsteps 100000 --burn-in 20000 --nwalkers 96
```

| Setting | Value |
|---|---|
| Sampler | `emcee.EnsembleSampler` (default stretch move) |
| Walkers | <Fact path="run.nwalkers" /> |
| Steps per walker | <Fact path="run.nsteps" format="int" /> |
| Burn-in discarded | <Fact path="run.burn_in" format="int" /> steps per walker |
| Retained samples | <Fact path="run.samples_kept" format="int" /> per model (= walkers × (steps − burn-in)) |
| Thinning | none |
| Models | ΛCDM, CPL, Ξosc — each run separately |

## Run modes

| Mode | Flag | Steps | Burn-in | Walkers | Use |
|---|---|---:|---:|---:|---|
| Quick | `--quick` | <Fact path="config.quick.nsteps" format="int" /> | <Fact path="config.quick.burn_in" format="int" /> | <Fact path="config.quick.nwalkers" /> | smoke test only |
| Default | *(none)* | <Fact path="config.default.nsteps" format="int" /> | <Fact path="config.default.burn_in" format="int" /> | <Fact path="config.default.nwalkers" /> | medium check |
| Custom | `--nsteps N` | N | `--burn-in`, else max(1000, N/5) | `--nwalkers` | final run |

:::warning[A quick run is not a result]
A quick run is far too short for the Ξosc chain (see [Convergence Diagnostics](./convergence.md)). Its outputs are written to the same default folder as any other run and must not be mistaken for the curated final results ([Outputs](../reproducibility/outputs.md)).
:::

---

## Initialisation

Each walker starts from a small Gaussian ball around a fixed centre (relative width <Fact path="config.init_spread_fraction" digits={2} />, or absolute when the centre is 0), redrawn until it falls inside the prior.

| Model | Centre |
|---|---|
| ΛCDM | H₀ = <Fact path="config.init_center.LCDM.H0" format="int" />, Ωₘ = <Fact path="config.init_center.LCDM.Omega_m" digits={1} /> |
| CPL | + w₀ = <Fact path="config.init_center.CPL.w0" digits={1} />, wₐ = <Fact path="config.init_center.CPL.wa" digits={1} /> |
| Ξosc | + w₀,mean = <Fact path="config.init_center.Xi_osc.w0_mean" digits={1} />, ε = <Fact path="config.init_center.Xi_osc.eps" digits={1} />, T = <Fact path="config.init_center.Xi_osc.T_Gyr" digits={1} /> Gyr, φ₀ = <Fact path="config.init_center.Xi_osc.phi0" digits={1} /> |

The starting point is fixed, not randomised across the prior, and the Ξosc posterior is multi-featured in T and φ₀ ([Corner Plots](../results/corner-plots.md)). The convergence criterion does not test whether other starting regions would give the same answer.

## Priors

<PriorTable />

## What is stored

`run_mcmc` discards the burn-in, **flattens** the walkers into one array of shape (samples, parameters) and saves it as `chains_<MODEL>_combined.npy` (float64). The unflattened chain is not kept, so walker-by-walker trace plots cannot be made from the saved files. Chain sizes in the final run: ΛCDM <Fact path="models.LCDM.chain_mb" digits={1} /> MB, CPL <Fact path="models.CPL.chain_mb" digits={1} /> MB, Ξosc <Fact path="models.Xi_osc.chain_mb" digits={1} /> MB — they are excluded from Git.

Parameters are summarised as the median and the 16th–84th percentile interval of the retained samples.

---

<RelatedPages pages={[
  { href: '/xi-dark-energy/inference/convergence', title: 'Convergence Diagnostics', desc: 'Acceptance, τ and the N/50 criterion', category: 'concepts' },
  { href: '/xi-dark-energy/inference/priors', title: 'Prior Specification', desc: 'Bounds and boundary effects', category: 'concepts' },
  { href: '/xi-dark-energy/reproducibility/quick-run', title: 'Quick Run', desc: 'Run the sampler yourself', category: 'guides' },
]} />
