---
title: DESI DR2 BAO
description: "The DESI DR2 BAO measurements used by ξ Dark Energy — file format, the three distance observables divided by r_d, the fixed sound horizon and the normalised residuals of the three models."
sidebar_position: 3
---

import Fact from '@site/src/components/xi/Fact';
import FigureGallery from '@site/src/components/FigureGallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/xi/results/protocol1b_pantheon_desi/summary_protocol1b_combined.txt (BAO utilisées, rd fixé) · figures/protocol1b_pantheon_desi/bao_residuals_combined.png · config: load_desi_bao, bao_predictions, download_data.py @ 25ed86e · data/README.md */}

# DESI DR2 BAO

This page documents the BAO half of the data: <Fact path="data.n_bao" /> **DESI DR2 Gaussian BAO measurements** (the `ALL_GCcomb` combination), each a distance divided by the sound horizon r<sub>d</sub>, together with their covariance.

---

## Observables

| Type in the file | Observable | Model prediction (flat universe) |
|---|---|---|
| `DM_over_rs` | D<sub>M</sub>/r<sub>d</sub> | `D_C(z) / r_d`, with D<sub>M</sub> = D<sub>C</sub> for Ω<sub>k</sub> = 0 |
| `DH_over_rs` | D<sub>H</sub>/r<sub>d</sub> | `c / (H(z) r_d)` |
| `DV_over_rs` | D<sub>V</sub>/r<sub>d</sub> | `[ z D_M² D_H ]^(1/3) / r_d` |

r<sub>d</sub> is **fixed** to <Fact path="data.rd_mpc" digits={2} /> Mpc for every model and every sample. It is not fitted and no uncertainty on it is propagated — limitation 1 on [Known Limitations](../results/caveats.md).

## File format and loading

The mean file lists measurements as `z value quantity`, and the covariance file holds the full matrix. The loader reads the mean file as a token stream and accepts a row only when it is two numbers followed by one of the three known quantity names; it then checks that the covariance shape matches the number of measurements and raises an error otherwise.

```python
# src/xi_protocol1b_bao_run.py
from pathlib import Path
from xi_protocol1b_bao_run import load_desi_bao

z_bao, types, values, cov, cov_inv = load_desi_bao(
    Path("data/raw/desi_gaussian_bao_ALL_GCcomb_mean.txt"),
    Path("data/raw/desi_gaussian_bao_ALL_GCcomb_cov.txt"),
)
```

The two files can be fetched with `python scripts/download_data.py`, which downloads them from the `desi_bao_dr2` folder of the public `CobayaSampler/bao_data` repository.

---

## Normalised residuals

The figure shows (data − model)/σ for each BAO point and each model, using the **best sampled point** of each chain. Residuals are normalised by the *marginal* standard deviation of each measurement, which is the square root of the diagonal of the covariance; the likelihood itself uses the full matrix, so the plot is a visual guide rather than the χ².

export const baoFigures = [
  {
    src: '/img/xi/protocol1b/bao_residuals_combined.png',
    title: 'Normalised BAO residuals — ΛCDM, CPL, Ξosc',
    desc: 'Protocol 1b · Pantheon+SH0ES + DESI DR2 BAO · axis labels in French (« résidus normalisés »)',
    tag: 'Residuals',
  },
];

<FigureGallery figures={baoFigures} columns={1} />

*Figure 1 — Normalised residuals of the DESI DR2 BAO measurements. Symbols distinguish D<sub>M</sub>/r<sub>d</sub> (squares), D<sub>H</sub>/r<sub>d</sub> (triangles) and D<sub>V</sub>/r<sub>d</sub> (circles).*

:::note[Reading the figure]
The D<sub>M</sub>/r<sub>d</sub> and D<sub>V</sub>/r<sub>d</sub> residuals at the lowest redshifts are large and positive for all three models, and the models differ most visibly in D<sub>H</sub>/r<sub>d</sub> at the highest redshift, where ΛCDM is furthest from zero. Because the points are strongly correlated, a large marginal residual does not translate directly into a large χ² contribution.
:::

---

<RelatedPages pages={[
  { href: '/xi-dark-energy/data/covariance', title: 'Covariance Handling', desc: 'Why residuals are normalised by marginal σ', category: 'concepts' },
  { href: '/xi-dark-energy/inference/likelihood', title: 'Likelihood Functions', desc: 'χ²_BAO and the model predictions', category: 'concepts' },
  { href: '/xi-dark-energy/results/caveats', title: 'Known Limitations', desc: 'Fixed r_d', category: 'science' },
]} />
