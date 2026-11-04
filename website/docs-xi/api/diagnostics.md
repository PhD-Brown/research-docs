---
title: "Diagnostics & Plotting"
description: "API for the xi_cosmo package — chain loading and summaries, the N/50 convergence flag, marginal and running-median plots, result tables and AIC/BIC helpers, and parameter labels."
sidebar_position: 3
---

import Fact from '@site/src/components/xi/Fact';

{/* facts: none (signatures only) · source: src/xi_cosmo/{diagnostics,plotting,results,labels}.py, scripts/{make_chain_diagnostics,export_final_tables}.py @ 25ed86e · config.convergence_factor */}

# Diagnostics & Plotting

## Overview

`xi_cosmo` is a lightweight package (`pip install -e .`). It works on **flattened chains** — the `chains_<MODEL>_combined.npy` arrays saved by the run — not on walker-by-walker traces. Concepts: [Convergence Diagnostics](../inference/convergence.md).

## `xi_cosmo.diagnostics`

```python
# src/xi_cosmo/diagnostics.py
def load_chain(path) -> np.ndarray
def summarize_chain(chain: np.ndarray, labels: Sequence[str]) -> list[dict]
def effective_sample_size_rough(n_steps: int, tau: float) -> float
def convergence_flag(n_steps: int, tau_max: float, factor: float = 50.0) -> bool
```

| Function | Description | Raises / returns |
|---|---|---|
| `load_chain` | loads a `.npy` array | `ValueError` unless 2-D |
| `summarize_chain` | 16/50/84 percentiles per column | dicts with `parameter`, `median`, `plus`, `minus`; `ValueError` if `labels` does not match the number of columns |
| `effective_sample_size_rough` | `n_steps / (2 τ)` for one parameter | `nan` if `tau <= 0`; a rough, per-chain figure |
| `convergence_flag` | `n_steps / factor > tau_max` | `bool`; the project uses factor <Fact path="config.convergence_factor" /> |

## `xi_cosmo.plotting`

```python
# src/xi_cosmo/plotting.py
def plot_marginals(chain, labels, output_path) -> None
def plot_running_median(chain, labels, output_path, n_grid: int = 300) -> None
```

`plot_marginals` draws one 60-bin step histogram per parameter. `plot_running_median` plots the median of the first *i* flattened samples against *i*; the docstring notes it is a lightweight stability check, **not** a replacement for walker traces. Both create the output folder and need `matplotlib`.

## `xi_cosmo.results`

```python
# src/xi_cosmo/results.py
@dataclass(frozen=True) class ParameterEstimate: model, parameter, median, plus, minus, unit=""
@dataclass(frozen=True) class ModelComparison:   model, chi2, k, aic, bic, delta_aic

FINAL_PARAMETER_ESTIMATES: list[ParameterEstimate]
FINAL_MODEL_COMPARISON: list[ModelComparison]

def symmetrized_sigma(plus, minus) -> float
def eps_significance() -> float
def compute_information_criteria(chi2, k, n) -> tuple[float, float]     # (AIC, BIC)
def write_csv(path, rows) -> None
def write_default_tables(output_dir) -> None
def markdown_model_comparison(rows=FINAL_MODEL_COMPARISON) -> str
```

:::caution[Typed-in values]
`FINAL_PARAMETER_ESTIMATES` and `FINAL_MODEL_COMPARISON` are **stored in the module**, not computed from a chain. They match the exported final tables at the time of writing but must be updated by hand after a new run. This documentation reads the exported tables instead ([Outputs](../reproducibility/outputs.md)).
:::

## `xi_cosmo.labels`

```python
# src/xi_cosmo/labels.py
MODEL_LABELS  = {"LCDM": [...], "CPL": [...], "Xi_osc": [...]}   # parameter order of each chain
MODEL_DISPLAY = {"LCDM": ..., "CPL": ..., "Xi_osc": ...}         # LaTeX display names
```

`MODEL_LABELS` fixes the column order of the saved chains: `H0, Om` · `H0, Om, w0, wa` · `H0, Om, w0_mean, eps, T(Gyr), phi0`.

## Example

```python
from xi_cosmo.diagnostics import load_chain, summarize_chain, convergence_flag
from xi_cosmo.labels import MODEL_LABELS

chain = load_chain("results/protocol1b_pantheon_desi/chains/chains_Xi_osc_combined.npy")
for row in summarize_chain(chain, MODEL_LABELS["Xi_osc"]):
    print(row["parameter"], row["median"], row["plus"], row["minus"])
```

## Command-line helper

`python scripts/make_chain_diagnostics.py --model Xi_osc` loads the chain, prints the summary and writes the two diagnostic figures to `figures/diagnostics/`.
