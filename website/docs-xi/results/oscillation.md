---
title: "Ξosc Oscillation Diagnostic"
description: "The oscillation-amplitude diagnostic of the Ξosc dark-energy model on Pantheon+SH0ES + DESI DR2 BAO (Protocol 1b final run): ε and ε/σ, why this ratio is not a detection, and the weakly constrained period and phase."
sidebar_position: 3
---

import RunContext from '@site/src/components/xi/RunContext';
import Fact from '@site/src/components/xi/Fact';
import FigureGallery from '@site/src/components/FigureGallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/xi/results/protocol1b_pantheon_desi/final_parameter_estimates.csv (eps, T_Gyr, phi0) · final_model_comparison.md (eps/sigma) · figures/protocol1b_pantheon_desi/{corner_Xi_osc_combined,w_of_z_combined}.png · config priors @ 25ed86e · protocol1b */}

# Ξosc Oscillation Diagnostic

This page analyses the oscillation amplitude ε of the Ξosc model on Pantheon+SH0ES + DESI DR2 BAO. The amplitude is the parameter that decides whether an oscillation is needed at all, so it is the project's central diagnostic — and the one most easily over-read.

<RunContext />

:::caution[Not a detection]
ε/σ<sub>ε</sub> ≈ <Fact path="eps.significance" digits={2} /> is a **descriptive ratio** computed under a one-sided, bounded prior. The project does not claim to detect oscillating dark energy.
:::

---

## Key results

| Quantity | Value | Context |
|---|---|---|
| ε (median) | <Fact path="eps.median" digits={4} /> | Ξosc, final run |
| 16–84% offsets | +<Fact path="eps.plus" digits={4} /> / −<Fact path="eps.minus" digits={4} /> | asymmetric |
| σ<sub>ε</sub> (symmetrised) | <Fact path="eps.sigma_sym" digits={4} /> | ½(plus + minus) |
| ε / σ<sub>ε</sub> | <Fact path="eps.significance" digits={2} /> | descriptive |
| Prior on ε | 0 < ε < <Fact path="eps.prior_max" digits={1} /> | uniform, one-sided |
| T | <Fact path="models.Xi_osc.params.T_Gyr.median" digits={2} /> (+<Fact path="models.Xi_osc.params.T_Gyr.plus" digits={2} />, −<Fact path="models.Xi_osc.params.T_Gyr.minus" digits={2} />) Gyr | prior <Fact path="config.priors.T_Gyr.0" format="int" />–<Fact path="config.priors.T_Gyr.1" format="int" /> Gyr |
| φ₀ | <Fact path="models.Xi_osc.params.phi0.median" digits={2} /> (+<Fact path="models.Xi_osc.params.phi0.plus" digits={2} />, −<Fact path="models.Xi_osc.params.phi0.minus" digits={2} />) rad | prior −π to π |

---

## What the amplitude says

**Result.** The posterior median of ε is non-zero and its 16–84% interval excludes zero (lower edge: ε − σ₋ = <Fact path="eps.median" digits={3} /> − <Fact path="eps.minus" digits={3} />).

**Interpretation.** The combined data *allow* an oscillatory component and give Ξosc the lowest raw χ² of the three models. The preference does not survive the complexity penalty: CPL keeps the lowest AIC and BIC ([Model Comparison](../inference/model-comparison.md)).

**Caveats — why ε/σ is not a significance.**

1. **One-sided prior.** ε is restricted to 0 < ε < <Fact path="eps.prior_max" digits={1} />. A posterior on a half-line cannot be summarised by a Gaussian σ: part of the apparent offset from zero is the boundary itself.
2. **The posterior reaches the upper bound.** In the [corner plot](./corner-plots.md) the ε marginal stays high up to the prior's upper edge; the upper 1σ edge (<Fact path="eps.upper_1sigma" digits={3} />) is not far from it. The inferred amplitude is therefore partly set by the prior range, not only by the data.
3. **ε = 0 is not ΛCDM.** At ε = 0 the model is a constant-w model, not w = −1 ([Three Model Families](../overview/models.md)).
4. **Asymmetric interval.** The symmetrised σ averages an upper offset of <Fact path="eps.plus" digits={3} /> and a lower one of <Fact path="eps.minus" digits={3} />.

## Period and phase are weakly constrained

T has a multi-featured posterior that reaches its upper prior edge, and φ₀ is nearly unconstrained over its periodic range. The autocorrelation times of these two parameters are also the longest of the model ([Convergence Diagnostics](../inference/convergence.md)). The medians of T and φ₀ in the table above are summaries of broad distributions, not best-fit values.

## Reconstructed w(z)

export const wFigures = [
  {
    src: '/img/xi/protocol1b/w_of_z_combined.png',
    title: 'Reconstructed equation of state w(z)',
    desc: 'Protocol 1b · curves drawn with posterior medians · ΛCDM, CPL, Ξosc · title in French',
    tag: 'w(z)',
  },
];

<FigureGallery figures={wFigures} columns={1} />

*Figure 1 — w(z) for ΛCDM (constant), CPL (monotonic) and Ξosc (oscillating), each drawn with the posterior medians of its parameters.*

:::note[How to read this figure]
The Ξosc curve is evaluated at the **median** of each parameter. For a multi-featured posterior in T and φ₀ the median combination need not correspond to a high-probability curve, and the oscillation phase today (hence w at z = 0) depends on it. The figure illustrates the form of the model; it is not a reconstruction with uncertainty bands.
:::

---

## Planned checks

The [Roadmap](../community/roadmap.mdx) lists the tests that would settle how much of the amplitude preference is prior-driven: a symmetric prior on ε, a wider and a logarithmic prior on T, and a time variable defined consistently with the sampled cosmology.

---

<RelatedPages pages={[
  { href: '/xi-dark-energy/results/caveats', title: 'Known Limitations', desc: 'r_d, reference-cosmology time, prior boundaries', category: 'science' },
  { href: '/xi-dark-energy/inference/priors', title: 'Prior Specification', desc: 'Bounds and sensitivity checks', category: 'concepts' },
  { href: '/xi-dark-energy/results/corner-plots', title: 'Corner Plots', desc: 'Shapes of the ε, T, φ₀ posteriors', category: 'science' },
]} />
