---
title: Key Findings (v0.1.0)
description: "Key findings of the ξ Dark Energy v0.1.0 exploratory analysis on Pantheon+SH0ES + DESI DR2 BAO (Protocol 1b, final long run): model ranking by χ², AIC and BIC, and the oscillation-amplitude diagnostic, each with its caveat."
sidebar_position: 4
---

import RunContext from '@site/src/components/xi/RunContext';
import KeyMetrics from '@site/src/components/xi/KeyMetrics';
import ModelComparisonTable from '@site/src/components/xi/ModelComparisonTable';
import Fact from '@site/src/components/xi/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/xi/results/protocol1b_pantheon_desi/{final_model_comparison.csv,final_parameter_estimates.csv} · run_100000_96.tail.log (tau) · protocol1b */}

# Key Findings (v0.1.0)

This page states what the final Protocol 1b run supports, in the order **result → interpretation → caveat**. The data are <Fact path="data.n_sne" format="int" /> Pantheon+SH0ES supernovae and <Fact path="data.n_bao" /> DESI DR2 BAO measurements, sampled with <Fact path="run.nsteps" format="int" /> steps and <Fact path="run.nwalkers" /> walkers per model.

<RunContext />

:::caution[Exploratory]
None of the findings below is a detection. Each is conditional on a fixed sound horizon, bounded priors and a fixed reference cosmology for the Ξosc time axis ([Known Limitations](../results/caveats.md)).
:::

---

## Key results

<KeyMetrics />

---

## 1. ΛCDM is disfavoured by this dataset combination

**Result.** ΛCDM has ΔAIC = <Fact path="models.LCDM.delta_aic" digits={1} /> relative to the best model, with χ² = <Fact path="models.LCDM.chi2" digits={1} /> against <Fact path="models.CPL.chi2" digits={1} /> for CPL and <Fact path="models.Xi_osc.chi2" digits={1} /> for Ξosc.

**Interpretation.** Both dynamical models fit the combined data markedly better than a constant w = −1 does, even after the AIC penalty for their extra parameters. This *suggests* that the data prefer something other than w = −1 within this setup — it does not identify which.

**Caveat.** The BIC, which penalises parameters more heavily, narrows the gap (next section), and r_d is fixed rather than marginalised.

## 2. CPL and Ξosc are close by AIC; the BIC reorders the three

<ModelComparisonTable />

**Result.** CPL has the lowest AIC and the lowest BIC. Ξosc has the lowest raw χ² but ΔAIC = <Fact path="models.Xi_osc.delta_aic" digits={2} /> relative to CPL. Under the BIC, Ξosc (<Fact path="models.Xi_osc.bic" digits={3} />) falls **behind ΛCDM** (<Fact path="models.LCDM.bic" digits={3} />).

**Interpretation.** The extra two parameters of Ξosc buy a small χ² gain that the AIC almost forgives and the BIC does not. The data do not single out the oscillating model.

**Caveat.** The χ² of each model is the best sampled point of its chain, not an exact minimum; see [Model Comparison](../inference/model-comparison.md).

## 3. A non-zero amplitude is allowed, but it is prior-limited

**Result.** ε = <Fact path="models.Xi_osc.params.eps.median" digits={3} /> (+<Fact path="models.Xi_osc.params.eps.plus" digits={3} />, −<Fact path="models.Xi_osc.params.eps.minus" digits={3} />), i.e. ε/σ<sub>ε</sub> ≈ <Fact path="eps.significance" digits={2} /> with a symmetrised σ<sub>ε</sub>.

**Interpretation.** The posterior prefers ε > 0, but ε is sampled under a one-sided prior (0 < ε < <Fact path="config.priors.eps.1" digits={1} />), and the corner plot shows its distribution rising towards the upper bound. The ratio is a descriptive summary; it is not the significance of a detection.

**Caveat.** T and φ₀ remain weakly constrained. Details: [Ξosc Oscillation Diagnostic](../results/oscillation.md).

## 4. The final chains satisfy the practical convergence criterion

**Result.** N/50 = <Fact path="convergence.n_over_50" format="int" /> exceeds the largest autocorrelation time of Ξosc, τ<sub>max</sub> = <Fact path="convergence.tau_max" digits={0} /> (parameter T).

**Caveat.** The criterion measures sampling noise, not prior-boundary pile-up or multimodality. See [Convergence Diagnostics](../inference/convergence.md).

---

## Evidence level

These statements correspond to the ξ entries of the [Claims Register](/docs/atlas/claims-register): *preliminary* for the amplitude preference, and not stronger for anything else.

---

<RelatedPages pages={[
  { href: '/xi-dark-energy/results', title: 'Results', desc: 'Constraints, corner plots, oscillation diagnostic', category: 'science' },
  { href: '/xi-dark-energy/inference/model-comparison', title: 'Model Comparison', desc: 'How χ², AIC and BIC are computed', category: 'concepts' },
  { href: '/xi-dark-energy/results/caveats', title: 'Known Limitations', desc: 'Fixed r_d, t(z) reference, prior boundaries', category: 'science' },
]} />
