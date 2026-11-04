---
title: Scientific Motivation
description: "Why ξ Dark Energy compares ΛCDM, CPL and an oscillating equation of state with supernova and BAO distances, and what the exploratory analysis is — and is not — meant to establish."
sidebar_position: 2
---

import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: none (no numeric result on this page) · sources: xi-dark-energy-bao-mcmc README.md §2, docs/model_notes.md */}

# Scientific Motivation

This page explains **why** the project exists. Standard flat ΛCDM assumes that cosmic acceleration is driven by a cosmological constant, w = −1. Current distance probes — Type Ia supernovae and baryon acoustic oscillations — motivate checking whether w could instead vary with cosmic time, and ξ Dark Energy adds one further phenomenological possibility to the usual test.

:::info[Central question]
Could current supernova + BAO distance data accommodate a small oscillatory component in the dark-energy equation of state?
:::

---

## Why a ΛCDM baseline

ΛCDM has the fewest free parameters of the three models (H₀ and Ωₘ) and is the reference against which any extension has to justify its extra freedom. The pipeline fits it with exactly the same data, covariances and sampler as the other models, so differences in χ², AIC and BIC come from the model and not from the setup.

## Why CPL

The Chevallier–Polarski–Linder parameterisation, w(z) = w₀ + wₐ z/(1+z), is the conventional way to let w evolve smoothly with redshift. It plays the role of the **standard dynamical comparator**: a Ξosc result only means something relative to what a monotonic evolution already achieves.

## Why an oscillating w

Ξosc replaces the monotonic drift with a cosine in cosmic time, w(t) = w₀,mean + ε cos(2πt/T + φ₀). It is a **phenomenological probe**, not a physical theory: it asks whether the data tolerate (or mildly prefer) a periodic modulation, and constrains its amplitude ε, period T and phase φ₀. The definition and its numerical implementation are on [Three Model Families](./models.md).

---

## What this analysis is not

| Not | Because |
|---|---|
| A discovery claim | The amplitude preference is mild and prior-limited — see [Oscillation Diagnostic](../results/oscillation.md) |
| An independent H₀ measurement | The supernova distance moduli are the SH0ES-calibrated `MU_SH0ES` column; see [Pantheon+SH0ES](../data/pantheon-shoes.md) |
| A full cosmological analysis | The sound horizon r_d is fixed and no CMB or other probe is included — see [Known Limitations](../results/caveats.md) |

---

<RelatedPages pages={[
  { href: '/xi-dark-energy/overview/models', title: 'Three Model Families', desc: 'Equations, parameters and priors', category: 'concepts' },
  { href: '/xi-dark-energy/overview/key-findings', title: 'Key Findings', desc: 'What the final run shows, with caveats', category: 'science' },
  { href: '/xi-dark-energy/results/caveats', title: 'Known Limitations', desc: 'What the results cannot support', category: 'science' },
]} />
