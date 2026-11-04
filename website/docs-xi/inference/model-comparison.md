---
title: Model Comparison
description: "How ξ Dark Energy ranks ΛCDM, CPL and Ξosc with χ², AIC and BIC on Pantheon+SH0ES + DESI DR2 BAO (N = 1,603): the final-run table, how χ² is obtained from the chains, and the limits of the information criteria."
sidebar_position: 5
---

import ModelComparisonTable from '@site/src/components/xi/ModelComparisonTable';
import Fact from '@site/src/components/xi/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/xi/results/protocol1b_pantheon_desi/final_model_comparison.csv · summary_protocol1b_combined.txt (N) · config: run_mcmc (chi2_min), compare_models @ 25ed86e */}

# Model Comparison

This page ranks the three models with the **Akaike** and **Bayesian** information criteria on the combined dataset (N = <Fact path="data.n_total" format="int" /> points: <Fact path="data.n_sne" format="int" /> SNe + <Fact path="data.n_bao" /> BAO). CPL is preferred by both criteria; Ξosc has the lowest raw χ² but pays for its two extra parameters.

---

## Key results

<ModelComparisonTable withAcceptance />

Rows are sorted by AIC; the first row has the lowest AIC. ΔAIC is relative to it.

---

## Definitions

$$
\mathrm{AIC} = \chi^2 + 2k, \qquad \mathrm{BIC} = \chi^2 + k\ln N, \qquad N = N_{\mathrm{SNe}} + N_{\mathrm{BAO}}
$$

k is the number of free parameters (<Fact path="models.LCDM.k" /> for ΛCDM, <Fact path="models.CPL.k" /> for CPL, <Fact path="models.Xi_osc.k" /> for Ξosc).

## How χ² is obtained

`run_mcmc` does not minimise χ². It takes the **sample with the highest log-probability** in the retained chain and sets `chi2_min = −2 ln p`. With flat priors this is χ² at the best *sampled* point.

:::caution[Approximate χ²]
The value can only equal or exceed the true minimum: a longer chain could find a slightly better point. For Ξosc, whose ε and T posteriors extend to their prior bounds, the best sampled point is the least certain of the three. The AIC and BIC inherit that uncertainty.
:::

## Reading the table

| Comparison | Result | Meaning |
|---|---|---|
| ΛCDM vs the dynamical models | ΔAIC = <Fact path="models.LCDM.delta_aic" digits={1} /> | ΛCDM is clearly worse by AIC |
| CPL vs Ξosc (AIC) | ΔAIC = <Fact path="models.Xi_osc.delta_aic" digits={2} /> | close; CPL slightly ahead |
| ΛCDM vs Ξosc (BIC) | BIC <Fact path="models.LCDM.bic" digits={3} /> vs <Fact path="models.Xi_osc.bic" digits={3} /> | **the BIC puts ΛCDM ahead of Ξosc** |
| Raw χ² | Ξosc <Fact path="models.Xi_osc.chi2" digits={3} /> vs CPL <Fact path="models.CPL.chi2" digits={3} /> | Ξosc fits best, by a small margin |

**Interpretation.** The data *suggest* departures from w = −1 (both dynamical models beat ΛCDM by AIC), but they do not choose between a smooth CPL evolution and an oscillation. The oscillating model is the most flexible and is not rewarded for it by the BIC.

## Limits of AIC and BIC here

- **Prior volume is ignored.** T, φ₀ and (near its bound) ε are weakly constrained; an information criterion that counts them as k = 6 does not capture how much of the prior volume they leave unconstrained. A Bayesian evidence (e.g. nested sampling) would — it is listed as future work in the project README.
- **N counts data points, not independent constraints.** Supernova errors are correlated through the covariance matrix.
- **Models are not nested** ([Three Model Families](../overview/models.md)), so differences in χ² do not follow a χ² distribution.
- **Fixed r_d** and the fixed reference cosmology for the Ξosc time axis apply to every row ([Known Limitations](../results/caveats.md)).

---

<RelatedPages pages={[
  { href: '/xi-dark-energy/overview/key-findings', title: 'Key Findings', desc: 'The ranking in context', category: 'science' },
  { href: '/xi-dark-energy/results/oscillation', title: 'Oscillation Diagnostic', desc: 'ε and the prior', category: 'science' },
  { href: '/xi-dark-energy/inference/convergence', title: 'Convergence Diagnostics', desc: 'Chain quality behind the χ² values', category: 'concepts' },
]} />
