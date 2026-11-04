---
title: Results
description: "Summary of the ξ Dark Energy v0.1.0 exploratory results on Pantheon+SH0ES + DESI DR2 BAO (Protocol 1b final run): model comparison, parameter constraints and the Ξosc oscillation-amplitude diagnostic."
sidebar_position: 5
---

import RunContext from '@site/src/components/xi/RunContext';
import KeyMetrics from '@site/src/components/xi/KeyMetrics';
import ModelComparisonTable from '@site/src/components/xi/ModelComparisonTable';
import FigureGallery from '@site/src/components/FigureGallery';
import CrossReferences from '@site/src/components/CrossReferences';

{/* facts: _facts/xi/results/protocol1b_pantheon_desi/{final_model_comparison.csv,final_parameter_estimates.csv} · figures/protocol1b_pantheon_desi/ · protocol1b */}

# Results

This section presents the results of the **final Protocol 1b run** — ΛCDM, CPL and Ξosc fitted to Pantheon+SH0ES + DESI DR2 BAO. All numbers on these pages are read from the exported result files; the older Pantheon-only Protocol 1 is shown only through its figures ([Corner Plots](./corner-plots.md)).

<RunContext />

:::caution[Exploratory]
`v0.1.0` results. Read them together with [Known Limitations](./caveats.md).
:::

---

## Key results

<KeyMetrics />

---

## Model comparison

<ModelComparisonTable />

Ranking, definitions and limits: [Model Comparison](../inference/model-comparison.md).

---

## Reference figures

export const resultFigures = [
  {
    src: '/img/xi/protocol1b/corner_Xi_osc_combined.png',
    title: 'Ξosc posterior (corner plot)',
    desc: 'Protocol 1b · Pantheon+SH0ES + DESI DR2 BAO',
    tag: 'Posterior',
  },
  {
    src: '/img/xi/protocol1b/w_of_z_combined.png',
    title: 'Reconstructed w(z) from posterior medians',
    desc: 'Protocol 1b · ΛCDM, CPL, Ξosc · title in French',
    tag: 'w(z)',
  },
  {
    src: '/img/xi/protocol1b/bao_residuals_combined.png',
    title: 'Normalised BAO residuals',
    desc: 'Protocol 1b · DESI DR2 · labels in French',
    tag: 'Residuals',
  },
];

<FigureGallery figures={resultFigures} columns={3} />

---

## Cross-references

<CrossReferences links={[
  { href: '/xi-dark-energy/results/parameter-constraints', label: 'Parameter Constraints', relation: 'Medians and 16–84% intervals for all three models', featured: true },
  { href: '/xi-dark-energy/results/corner-plots', label: 'Corner Plots', relation: 'Posterior shapes, Protocol 1b and Protocol 1' },
  { href: '/xi-dark-energy/results/oscillation', label: 'Ξosc Oscillation Diagnostic', relation: 'ε, T, φ₀ and prior limits' },
  { href: '/xi-dark-energy/results/caveats', label: 'Known Limitations', relation: 'What the results cannot support' },
]} />
