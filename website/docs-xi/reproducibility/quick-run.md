---
title: Quick Run
description: "Run the ξ Dark Energy pipeline — place the Pantheon+SH0ES and DESI DR2 BAO files, run the quick smoke test, then the medium and final runs — and understand what each command writes."
sidebar_position: 2
---

import Fact from '@site/src/components/xi/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/xi/docs/reproducibility.md (final command, N/50) · config: parse_args, main, scripts/run_*.sh @ 25ed86e · data/README.md */}

# Quick Run

This guide takes you from a fresh install to a first run. The quick mode is a **smoke test**: it shows that the pipeline works end to end, not what the data say.

:::note[Prerequisites]
The package is installed ([Installation](./installation.md)) and you are in the repository root.
:::

---

## Step 1 — Place the data

Four files go in `data/raw/` (the folder is git-ignored apart from its README):

```text
Pantheon+SH0ES.dat
Pantheon+SH0ES_STAT+SYS.cov
desi_gaussian_bao_ALL_GCcomb_mean.txt
desi_gaussian_bao_ALL_GCcomb_cov.txt
```

```bash
python scripts/download_data.py     # fetches only the two DESI files
```

The two Pantheon+SH0ES files are external products and **must be obtained separately** from the official release and copied in by hand ([Pantheon+SH0ES](../data/pantheon-shoes.md)).

## Step 2 — Smoke test

```bash
python src/xi_protocol1b_bao_run.py --quick     # or: make quick · scripts/run_quick.sh
```

Quick mode runs <Fact path="config.quick.nsteps" format="int" /> steps with burn-in <Fact path="config.quick.burn_in" format="int" /> and <Fact path="config.quick.nwalkers" /> walkers for each of the three models.

## Step 3 — Medium run (optional)

```bash
python src/xi_protocol1b_bao_run.py --nsteps 5000 --burn-in 1000 --nwalkers 64
```

## Step 4 — Final run

```bash
python src/xi_protocol1b_bao_run.py --nsteps 100000 --burn-in 20000 --nwalkers 96
```

This is the command behind the published results. Capture the console log if you want to keep the progress and diagnostics:

```bash
bash scripts/run_long_final.sh        # same command, output copied to run_100000_96.log
```

The Ξosc chain is the long one; `scripts/run_xi_only_long.ps1` repeats it for Ξosc alone (`--models Xi_osc`) when only that convergence check is needed. Wall-clock time depends on the machine and is not recorded in the exported facts.

---

## Expected outputs

Every run writes to the **default** `results/` and `figures/` folders — including quick runs. A new run therefore overwrites the previous one there.

:::warning[Do not cite a quick run]
A quick run's `summary_protocol1b_combined.txt` reads `Quick mode: True`, and its numbers differ from the final ones — a 500-step chain is not converged for Ξosc. The authoritative results live in `results/protocol1b_pantheon_desi/` ([Outputs](./outputs.md)).
:::

For a converged Ξosc chain the practical criterion is N/50 > τ<sub>max</sub>; for the final run this is <Fact path="convergence.n_over_50" format="int" /> > <Fact path="convergence.tau_max" digits={0} /> ([Convergence Diagnostics](../inference/convergence.md)).

## Troubleshooting

| Error | Cause |
|---|---|
| `Missing Pantheon file` | `Pantheon+SH0ES.dat` not in `data/raw/` (or pass `--sne-data`) |
| `Required Pantheon+ columns not found` | file lacks `zHD`, `MU_SH0ES`, `MU_SH0ES_ERR_DIAG` |
| `Unexpected Pantheon covariance` | the `.cov` file is truncated or not the STAT+SYS matrix |
| `No BAO rows could be read` | DESI mean file in an unexpected format |

## Next steps

[Outputs](./outputs.md) — which files to trust and how to regenerate the tables.

---

<RelatedPages pages={[
  { href: '/xi-dark-energy/reproducibility/outputs', title: 'Outputs', desc: 'Curated vs raw outputs', category: 'guides' },
  { href: '/xi-dark-energy/inference/mcmc-setup', title: 'MCMC Setup', desc: 'What the run settings mean', category: 'concepts' },
  { href: '/xi-dark-energy/data', title: 'Data Overview', desc: 'The files and their format', category: 'concepts' },
]} />
