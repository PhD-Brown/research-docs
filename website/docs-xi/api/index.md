---
title: API Reference
description: "Module map of the ξ Dark Energy BAO MCMC code — the self-contained Protocol 1b script and the lightweight xi_cosmo package — with where each function lives and where to find its documentation."
sidebar_position: 7
---

import CrossReferences from '@site/src/components/CrossReferences';

{/* facts: none (no result) · sources: src/xi_protocol1b_bao_run.py, src/xi_cosmo/*.py @ 25ed86e */}

# API Reference

The code has two layers: a **self-contained script** that implements the models, the likelihood and the sampler, and a small **`xi_cosmo` package** of helpers for result tables, chain diagnostics and plots. API pages here are deliberately minimal; the scientific discussion lives on the linked concept pages.

---

## Module map

| Module | Role | Page |
|---|---|---|
| `src/xi_protocol1b_bao_run.py` | Data loaders, `E(z)` for each model, `XiOscillator`, distances, χ², `log_prior`, `log_probability`, `run_mcmc`, reporting | [Cosmological Models](./models.md) · [Likelihood Functions](./likelihood.md) |
| `xi_cosmo.diagnostics` | Load, summarise and check flattened chains | [Diagnostics & Plotting](./diagnostics.md) |
| `xi_cosmo.plotting` | Marginal histograms, running medians | [Diagnostics & Plotting](./diagnostics.md) |
| `xi_cosmo.results` | Final tables as data classes; AIC/BIC helpers | [Diagnostics & Plotting](./diagnostics.md) |
| `xi_cosmo.labels` | Parameter names and display names per model | [Diagnostics & Plotting](./diagnostics.md) |
| `src/xi_protocol1_run.py` | Earlier Pantheon-only script (Protocol 1) | not documented here |

:::note[The models are not in `xi_cosmo`]
The installable package (`pip install -e .`) does not contain the cosmological models or the likelihood. Those are functions of the Protocol 1b script, which is meant to be run from the command line. To import them, put `src/` on `sys.path`, as the helper scripts do for `xi_cosmo`.
:::

---

## Cross-references

<CrossReferences links={[
  { href: '/xi-dark-energy/overview/models', label: 'Three Model Families', relation: 'Equations behind the model functions' },
  { href: '/xi-dark-energy/inference/likelihood', label: 'Likelihood Functions (concept)', relation: 'What the χ² functions compute', featured: true },
  { href: '/xi-dark-energy/reproducibility/outputs', label: 'Outputs', relation: 'Files written by these functions' },
]} />
