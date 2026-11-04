---
title: Project Goal
description: "ξ Dark Energy tests whether a phenomenological oscillating dark-energy equation of state stays competitive with ΛCDM and CPL on Pantheon+SH0ES supernovae and DESI DR2 BAO, with a fully reproducible MCMC pipeline."
sidebar_position: 1
---

import RunContext from '@site/src/components/xi/RunContext';
import KeyMetrics from '@site/src/components/xi/KeyMetrics';
import CrossReferences from '@site/src/components/CrossReferences';

{/* facts: _facts/xi/results/protocol1b_pantheon_desi/{final_model_comparison.csv,final_parameter_estimates.csv,summary_protocol1b_combined.txt} · run_100000_96.tail.log · protocol1b */}

# Project Goal

This project builds a **transparent, reproducible inference pipeline** that confronts three dark-energy models — ΛCDM, CPL and an oscillating equation of state (Ξosc) — with Pantheon+SH0ES supernovae and DESI DR2 BAO distances. The question it asks is deliberately modest: *can current distance data accommodate a small oscillatory component in w, and how does that compare with standard parameterisations once model complexity is penalised?*

:::caution[Exploratory release — not a detection]
The project is released as `v0.1.0` and is exploratory. It does not claim new physics: the aim is to document the pipeline, its constraints and its limits. See [Known Limitations](../results/caveats.md).
:::

<RunContext />

---

## What the project delivers

| Deliverable | Where |
|---|---|
| Three models with explicit equations and priors | [Three Model Families](./models.md) · [Prior Specification](../inference/priors.mdx) |
| Combined supernova + BAO likelihood with full covariances | [Inference Pipeline](../inference/index.md) |
| MCMC chains, convergence diagnostics and AIC/BIC comparison | [Convergence](../inference/convergence.md) · [Model Comparison](../inference/model-comparison.md) |
| Constraints, corner plots and the oscillation-amplitude diagnostic | [Results](../results/index.md) |
| A pipeline you can rerun, from a smoke test to the final run | [Reproducibility](../reproducibility/index.md) |

---

## Where the project stands

The four figures below summarise the final Protocol 1b run (Pantheon+SH0ES + DESI DR2 BAO). Their reading, and what they do **not** show, is on [Key Findings](./key-findings.md).

<KeyMetrics />

---

## Cross-references

<CrossReferences links={[
  { href: '/xi-dark-energy/overview/scientific-motivation', label: 'Scientific Motivation', relation: 'Why test an oscillating w(t)' },
  { href: '/xi-dark-energy/overview/key-findings', label: 'Key Findings (v0.1.0)', relation: 'Results with their caveats', featured: true },
  { href: '/xi-dark-energy/results/caveats', label: 'Known Limitations', relation: 'Fixed r_d, reference-cosmology time, prior boundaries' },
  { href: '/xi-dark-energy/reproducibility', label: 'Reproducibility', relation: 'Rerun the analysis' },
]} />
