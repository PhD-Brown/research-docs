---
title: Parameter Constraints
description: "Posterior medians and 16–84% intervals for ΛCDM, CPL and Ξosc fitted to Pantheon+SH0ES + DESI DR2 BAO (Protocol 1b final run, exploratory v0.1.0)."
sidebar_position: 1
---

import RunContext from '@site/src/components/xi/RunContext';
import ParameterTable from '@site/src/components/xi/ParameterTable';
import Fact from '@site/src/components/xi/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/xi/results/protocol1b_pantheon_desi/final_parameter_estimates.csv · protocol1b */}

# Parameter Constraints

This page lists the marginalised constraints on every parameter of the three models for the Protocol 1b final run. Values are the **median** with the **16th–84th percentile** offsets of <Fact path="run.samples_kept" format="int" /> retained samples per model.

<RunContext />

---

## Key results

<ParameterTable />

Medians and offsets come from `final_parameter_estimates.csv`. The raw text summary of the same run differs slightly for ΛCDM and CPL (third decimal) because of a different post-processing; the CSV is used throughout the documentation.

---

## Shared parameters: H₀ and Ωₘ

**Result.** H₀ lies near <Fact path="models.LCDM.params.H0.median" digits={1} /> km/s/Mpc in all three models, while Ωₘ moves from <Fact path="models.LCDM.params.Omega_m.median" digits={3} /> (ΛCDM) to <Fact path="models.CPL.params.Omega_m.median" digits={3} /> (CPL) and <Fact path="models.Xi_osc.params.Omega_m.median" digits={3} /> (Ξosc).

**Interpretation.** H₀ is pinned by the SH0ES-calibrated distance moduli ([Pantheon+SH0ES](../data/pantheon-shoes.md)); it is not an independent measurement. Ωₘ is shifted by the dark-energy freedom: it is anti-correlated with w₀,mean in the Ξosc corner plot ([Corner Plots](./corner-plots.md)), so models that let w depart from −1 settle on a different matter fraction.

**Caveat.** This page does not compare with published Planck or DESI constraints: no external values are part of the verified fact set.

## CPL: w₀ and wₐ

**Result.** w₀ = <Fact path="models.CPL.params.w0.median" digits={3} /> (±<Fact path="models.CPL.params.w0.plus" digits={3} />) and wₐ = <Fact path="models.CPL.params.wa.median" digits={3} /> (+<Fact path="models.CPL.params.wa.plus" digits={3} />, −<Fact path="models.CPL.params.wa.minus" digits={3} />).

**Interpretation.** w₀ is close to −1, with an uncertainty that comfortably includes it; the weight of the CPL preference over ΛCDM sits in a **negative wₐ**, whose 16–84% interval stays below zero. In this parameterisation that *suggests* an equation of state that crosses −1 at very low redshift and grows increasingly negative towards higher z (see the w(z) figure on [Ξosc Oscillation Diagnostic](./oscillation.md)) — but wₐ is the least precisely constrained CPL parameter.

## Ξosc: w₀,mean, ε, T, φ₀

**Result.** w₀,mean = <Fact path="models.Xi_osc.params.w0_mean.median" digits={3} /> (+<Fact path="models.Xi_osc.params.w0_mean.plus" digits={3} />, −<Fact path="models.Xi_osc.params.w0_mean.minus" digits={3} />); ε, T and φ₀ are listed above.

**Interpretation.** The mean level sits below −1 (its 16–84% interval does not include −1), i.e. on average in the phantom regime, with the oscillation superposed. T and φ₀ have intervals spanning a large part of their prior (T: <Fact path="config.priors.T_Gyr.0" format="int" /> to <Fact path="config.priors.T_Gyr.1" format="int" /> Gyr; φ₀: −π to π): **they are weakly constrained**, and their medians should not be read as best-fit values. Discussion: [Oscillation Diagnostic](./oscillation.md).

---

<RelatedPages pages={[
  { href: '/xi-dark-energy/results/corner-plots', title: 'Corner Plots', desc: 'Correlations and posterior shapes', category: 'science' },
  { href: '/xi-dark-energy/results/oscillation', title: 'Oscillation Diagnostic', desc: 'ε, T, φ₀', category: 'science' },
  { href: '/xi-dark-energy/inference/model-comparison', title: 'Model Comparison', desc: 'χ², AIC and BIC', category: 'concepts' },
  { href: '/xi-dark-energy/overview/models', title: 'Three Model Families', desc: 'Parameter definitions and priors', category: 'concepts' },
]} />
