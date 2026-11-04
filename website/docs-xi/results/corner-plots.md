---
title: Corner Plots
description: "Corner plots of the ξ Dark Energy posteriors — Protocol 1b (Pantheon+SH0ES + DESI DR2 BAO, final run) for ΛCDM and Ξosc, and the Pantheon-only Protocol 1 figures for comparison — with a guide to reading the Ξosc plot."
sidebar_position: 2
---

import FigureGallery from '@site/src/components/FigureGallery';
import RunContext from '@site/src/components/xi/RunContext';
import Fact from '@site/src/components/xi/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/xi/figures/protocol1b_pantheon_desi/{corner_LCDM_combined,corner_Xi_osc_combined}.png · figures/protocol1_pantheon_only/corner_{LCDM,CPL,Xi_osc}.png (figures only — no Protocol 1 numbers in the pack) · protocol1b */}

# Corner Plots

This page shows the posterior distributions as corner plots: one-dimensional marginals on the diagonal and two-dimensional contours below it. The **reference figures** are those of Protocol 1b (<Fact path="data.n_sne" format="int" /> SNe + <Fact path="data.n_bao" /> BAO); the Pantheon-only Protocol 1 figures are included to show how the BAO data change the shapes.

<RunContext />

---

## Protocol 1b — Pantheon+SH0ES + DESI DR2 BAO

export const p1bFigures = [
  {
    src: '/img/xi/protocol1b/corner_Xi_osc_combined.png',
    title: 'Ξosc posterior — Protocol 1b',
    desc: 'Final run · six parameters · titles show rounded medians',
    tag: 'Ξosc',
  },
  {
    src: '/img/xi/protocol1b/corner_LCDM_combined.png',
    title: 'ΛCDM posterior — Protocol 1b',
    desc: 'Final run · H₀ and Ωₘ',
    tag: 'ΛCDM',
  },
];

<FigureGallery figures={p1bFigures} columns={2} />

:::note[CPL]
The corner plot of CPL for the final run is not part of the exported figure set, so none is shown here. The CPL constraints are in [Parameter Constraints](./parameter-constraints.md).
:::

### Reading the Ξosc plot

| Panel | What to look for | Reading |
|---|---|---|
| H₀, Ωₘ, w₀,mean marginals | single, near-Gaussian peaks | well constrained |
| Ωₘ – w₀,mean | tilted, elongated contour | anti-correlated: a more negative mean w goes with a smaller Ωₘ |
| **ε marginal** | density rises from ε = 0 and stays high up to the right-hand edge | the posterior is **truncated by the prior upper bound** (0 < ε < <Fact path="config.priors.eps.1" digits={1} />) |
| **T marginal** | a narrow peak at short T *and* a broad shoulder growing towards the upper edge | **multi-featured**, extends to the prior bound (<Fact path="config.priors.T_Gyr.0" format="int" /> < T < <Fact path="config.priors.T_Gyr.1" format="int" /> Gyr) |
| **φ₀ marginal** | high at both ends, low in the middle | φ₀ is periodic, so the two ends are the same region: a mode near ±π |
| T – φ₀ | diagonal bands | T and φ₀ are degenerate (the same oscillation phase today can come from several (T, φ₀) pairs) |

The titles above each column quote the median and a symmetric ± at two decimals; for ε, T and φ₀ they hide the shape of the distributions, which is why the median is a poor summary for these three parameters.

---

## Protocol 1 — Pantheon+SH0ES only (comparison)

export const p1Figures = [
  {
    src: '/img/xi/protocol1/corner_Xi_osc.png',
    title: 'Ξosc posterior — Protocol 1',
    desc: 'Supernovae only · run settings not recorded in the fact pack',
    tag: 'Ξosc',
  },
  {
    src: '/img/xi/protocol1/corner_CPL.png',
    title: 'CPL posterior — Protocol 1',
    desc: 'Supernovae only · run settings not recorded in the fact pack',
    tag: 'CPL',
  },
  {
    src: '/img/xi/protocol1/corner_LCDM.png',
    title: 'ΛCDM posterior — Protocol 1',
    desc: 'Supernovae only · run settings not recorded in the fact pack',
    tag: 'ΛCDM',
  },
];

<FigureGallery figures={p1Figures} columns={3} />

:::caution[Figures only]
Protocol 1 used the supernovae alone (no BAO). The exported pack contains its three corner plots but **no numerical summary and no record of its chain length**, so no Protocol 1 number is quoted anywhere on this site and the figures are not a like-for-like comparison with the final run.
:::

---

<RelatedPages pages={[
  { href: '/xi-dark-energy/results/oscillation', title: 'Oscillation Diagnostic', desc: 'Why ε, T, φ₀ are weakly constrained', category: 'science' },
  { href: '/xi-dark-energy/results/parameter-constraints', title: 'Parameter Constraints', desc: 'Medians and intervals', category: 'science' },
  { href: '/xi-dark-energy/inference/convergence', title: 'Convergence Diagnostics', desc: 'Chain quality', category: 'concepts' },
]} />
