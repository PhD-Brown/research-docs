---
title: Installation
description: "Install the ξ Dark Energy BAO MCMC package — pip or conda environment, editable install, environment check and tests — to run the Pantheon+SH0ES + DESI DR2 BAO analysis."
sidebar_position: 1
---

import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: none (no numeric result) · sources: xi-dark-energy-bao-mcmc README.md §10, pyproject.toml, environment.yml, requirements.txt, scripts/check_environment.py, Makefile, tests/ @ 25ed86e */}

# Installation

This guide sets up a Python environment able to run the analysis.

:::note[Prerequisites]
Python ≥ 3.10 (the conda environment pins 3.11), `git`, and enough disk for the chains of a long run ([Outputs](./outputs.md)).
:::

---

## Step 1 — Get the code

```bash
git clone https://github.com/PhD-Brown/xi-dark-energy-bao-mcmc.git
cd xi-dark-energy-bao-mcmc
```

## Step 2 — Create an environment

### Option A — standard Python

```bash
python -m venv .venv
source .venv/bin/activate        # Windows PowerShell: .\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
pip install -e .
```

### Option B — conda

```bash
conda env create -f environment.yml
conda activate xi-dark-energy
pip install -e .
```

The core dependencies are `numpy`, `pandas`, `scipy`, `matplotlib`, `astropy`, `emcee`, `corner` and `tqdm`. `astropy` supplies the reference-cosmology cosmic age used by Ξosc; `corner` draws the corner plots (if it is missing the script skips them and continues).

## Step 3 — Check the environment

```bash
python scripts/check_environment.py     # or: make check
```

It prints the version of each required package and exits with an error listing the missing ones.

## Step 4 — Run the tests

```bash
python -m pytest tests -q
```

The tests check that the package imports, that the AIC/BIC arithmetic reproduces the table, and that the stored result tables are sorted and give an ε/σ in the expected range. They **do not** run the MCMC and do not check the numerical distance integrals. A GitHub Actions workflow runs them on every push.

---

## Expected outputs

A successful check prints one `OK` line per package and ends with *Environment looks good.*

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `Missing packages: …` | environment incomplete | `pip install -r requirements.txt` |
| `ModuleNotFoundError: xi_cosmo` | package not installed | `pip install -e .` from the repository root |
| No corner plots | `corner` not importable | install `corner`; the run itself is unaffected |

## Next steps

[Quick Run](./quick-run.md) — place the data and run the pipeline.

---

<RelatedPages pages={[
  { href: '/xi-dark-energy/reproducibility/quick-run', title: 'Quick Run', desc: 'Data placement and run commands', category: 'guides' },
  { href: '/xi-dark-energy/reproducibility/outputs', title: 'Outputs', desc: 'What a run writes and where', category: 'guides' },
]} />
