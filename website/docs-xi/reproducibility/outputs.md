---
title: Outputs
description: "Files produced by the ξ Dark Energy pipeline — raw run outputs versus the curated Protocol 1b results, chain sizes, how to regenerate the result tables and the chain-diagnostic figures."
sidebar_position: 3
---

import Fact from '@site/src/components/xi/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/xi/MANIFEST.md (chain sizes, log size) · results/protocol1b_pantheon_desi/ · config: main, export_final_tables.py, make_chain_diagnostics.py, .gitignore @ 25ed86e */}

# Outputs

A run writes a handful of files; only some of them are results. This page separates the **raw outputs** of a run from the **curated final results** that the documentation uses, and says how to regenerate the latter.

---

## Raw outputs of a run

Written to the default `results/` and `figures/` folders by `xi_protocol1b_bao_run.py`:

```text
results/
├── summary_protocol1b_combined.txt     text summary (medians, χ², acceptance, τ, AIC/BIC, ε/σ)
├── model_comparison_combined.csv       χ², k, AIC, BIC, ΔAIC
└── chains_<MODEL>_combined.npy         flattened chains (LCDM, CPL, Xi_osc)
figures/
├── corner_<MODEL>_combined.png
├── w_of_z_combined.png
└── bao_residuals_combined.png
```

:::danger[These files are overwritten by every run, quick or not]
A quick smoke test replaces them with a 500-step result. Never cite a file from this level unless you know which run produced it: check `Quick mode:` in the summary.
:::

## Curated final results

The final run's outputs are copied by hand into dedicated sub-folders and these are the reference:

```text
results/protocol1b_pantheon_desi/
├── final_parameter_estimates.csv       median, +, − per parameter
├── final_model_comparison.csv          χ², k, AIC, BIC, ΔAIC
├── final_model_comparison.md           the same as a Markdown table, plus ε/σ
├── summary_protocol1b_combined.txt     raw text summary of the final run
└── chains/chains_<MODEL>_combined.npy  git-ignored
figures/protocol1b_pantheon_desi/       final corner plots, w(z), BAO residuals
figures/diagnostics/                    marginals and running medians (Ξosc)
```

The two tables are written by `scripts/export_final_tables.py` (`make tables`) from values stored in `xi_cosmo.results`. Those values are typed into the module, not read from the chains, so they must be updated by hand after a new run.

## Chain files

Chains are float64 arrays of shape (retained samples, parameters) and are excluded from Git because of their size:

| Model | File | Size in the final run |
|---|---|---:|
| ΛCDM | `chains_LCDM_combined.npy` | <Fact path="models.LCDM.chain_mb" digits={1} /> MB |
| CPL | `chains_CPL_combined.npy` | <Fact path="models.CPL.chain_mb" digits={1} /> MB |
| Ξosc | `chains_Xi_osc_combined.npy` | <Fact path="models.Xi_osc.chain_mb" digits={1} /> MB |

Keep them locally or attach them to a release. The console log (`*.log`) is also git-ignored.

## Regenerate derived products

```bash
python scripts/export_final_tables.py                    # result tables
python scripts/make_chain_diagnostics.py --model Xi_osc  # marginals + running median
```

The second command expects the chain at `results/protocol1b_pantheon_desi/chains/chains_Xi_osc_combined.npy` (override with `--chains-dir`).

---

<RelatedPages pages={[
  { href: '/xi-dark-energy/results', title: 'Results', desc: 'What the curated outputs contain', category: 'science' },
  { href: '/xi-dark-energy/inference/convergence', title: 'Convergence Diagnostics', desc: 'The diagnostic figures', category: 'concepts' },
  { href: '/xi-dark-energy/api/diagnostics', title: 'API · Diagnostics & Plotting', desc: 'load_chain, summarize_chain', category: 'api' },
]} />
