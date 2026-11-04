---
title: Data Overview
description: "The two distance probes used by ξ Dark Energy — Pantheon+SH0ES Type Ia supernovae and DESI DR2 BAO — with the files the pipeline reads, the selection applied and the covariances used."
sidebar_position: 1
---

import Fact from '@site/src/components/xi/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/xi/results/protocol1b_pantheon_desi/summary_protocol1b_combined.txt (SNe, BAO, r_d) · reports/latex/main.tex (1701 before cut, z range) · config: load_pantheon_data, load_desi_bao @ 25ed86e */}

# Data Overview

The analysis combines **<Fact path="data.n_sne" format="int" /> Pantheon+SH0ES supernovae** (after a redshift cut, out of <Fact path="data.n_sne_before_cut" format="int" />) with **<Fact path="data.n_bao" /> DESI DR2 BAO measurements**, for N = <Fact path="data.n_total" format="int" /> data points in the AIC/BIC. Raw survey files are not committed to the repository; the pipeline expects four files in `data/raw/`.

---

## At a glance

| | Pantheon+SH0ES | DESI DR2 BAO |
|---|---|---|
| Observable | distance modulus μ(z) | D<sub>V</sub>/r<sub>d</sub>, D<sub>M</sub>/r<sub>d</sub>, D<sub>H</sub>/r<sub>d</sub> |
| Points used | <Fact path="data.n_sne" format="int" /> | <Fact path="data.n_bao" /> |
| Selection | z > <Fact path="config.z_cut" digits={2} /> | none |
| Covariance | full STAT+SYS | full BAO matrix |
| Files | `Pantheon+SH0ES.dat`, `Pantheon+SH0ES_STAT+SYS.cov` | `desi_gaussian_bao_ALL_GCcomb_mean.txt`, `…_cov.txt` |
| Acquisition | manual download (external product) | `python scripts/download_data.py` |

:::note[Fixed sound horizon]
BAO observables are divided by r<sub>d</sub>, which is **fixed** to <Fact path="data.rd_mpc" digits={2} /> Mpc rather than fitted. The two probes therefore share one assumption about early-universe physics; see [Known Limitations](../results/caveats.md).
:::

---

## Where the data enter

```text
Pantheon+SH0ES.dat ──► z, μ_obs, σ_μ  (z > cut)  ─┐
Pantheon+SH0ES_STAT+SYS.cov ──► C_SN (kept rows)  ─┤
                                                   ├─► χ²_SN + χ²_BAO ─► ln p ─► emcee
DESI mean file  ──► (z, value, type) × N_BAO      ─┤
DESI cov file   ──► C_BAO                         ─┘
```

The two probes are combined by **adding their χ²** — they are treated as independent. Details: [Covariance Handling](./covariance.md) and [Likelihood Functions](../inference/likelihood.md).

---

<RelatedPages pages={[
  { href: '/xi-dark-energy/data/pantheon-shoes', title: 'Pantheon+SH0ES', desc: 'Columns, redshift cut, calibration', category: 'concepts' },
  { href: '/xi-dark-energy/data/desi-dr2-bao', title: 'DESI DR2 BAO', desc: 'File format, observables, residuals', category: 'concepts' },
  { href: '/xi-dark-energy/data/covariance', title: 'Covariance Handling', desc: 'How the matrices are loaded and used', category: 'concepts' },
  { href: '/xi-dark-energy/reproducibility/quick-run', title: 'Quick Run', desc: 'Place the files and run a smoke test', category: 'guides' },
]} />
