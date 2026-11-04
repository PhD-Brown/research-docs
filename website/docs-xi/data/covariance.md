---
title: Covariance Handling
description: "How ξ Dark Energy loads and uses the Pantheon+SH0ES STAT+SYS covariance and the DESI DR2 BAO covariance — subsetting after the redshift cut, inversion, and the independence assumption between probes."
sidebar_position: 4
---

import Fact from '@site/src/components/xi/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/xi/results/protocol1b_pantheon_desi/summary_protocol1b_combined.txt (SNe, BAO) · config: load_pantheon_covariance, load_desi_bao, plot_bao_residuals @ 25ed86e */}

# Covariance Handling

Both probes enter the likelihood through their **full covariance matrices**, not through diagonal errors. This page explains how the matrices are loaded, aligned with the data and used.

---

## At a glance

| | Pantheon+SH0ES | DESI DR2 BAO |
|---|---|---|
| Matrix | STAT+SYS | full BAO covariance |
| Size used | <Fact path="data.n_sne" format="int" /> × <Fact path="data.n_sne" format="int" /> | <Fact path="data.n_bao" /> × <Fact path="data.n_bao" /> |
| Loaded by | `load_pantheon_covariance` | `load_desi_bao` |
| Inversion | `numpy.linalg.inv`, once | `numpy.linalg.inv`, once |

---

## Pantheon+SH0ES: STAT+SYS, subset to the kept supernovae

The `.cov` file stores N on its first line, then N² entries. The loader reshapes them to an N × N matrix and raises an error if the count does not match. After the redshift cut, it extracts the **rows and columns of the kept supernovae** (`cov_full[np.ix_(kept_idx, kept_idx)]`), so the matrix stays aligned with the retained distance moduli, and inverts it **once**. The inverse is stored and reused at every MCMC step.

Cutting rows and columns of the full matrix keeps the correlations between the retained supernovae unchanged; it does not renormalise anything.

## DESI BAO: full matrix, with a shape check

The covariance file is read with `numpy.loadtxt` and, if it comes flat, reshaped to a square matrix. The loader checks that its dimensions match the number of parsed measurements before inverting.

## Independence between probes

The combined χ² is the **sum** of the supernova and BAO terms. This assumes no covariance between the two probes — there is no cross-block in the code. The assumption is not tested in the pipeline.

:::note[Why the BAO residual plot uses marginal σ]
`plot_bao_residuals` normalises each residual by the square root of the diagonal of the BAO covariance (obtained by inverting the stored inverse). This is a convenient visual scale; the likelihood uses the full matrix, so correlated points can look discrepant individually without contributing much to χ².
:::

---

<RelatedPages pages={[
  { href: '/xi-dark-energy/data/pantheon-shoes', title: 'Pantheon+SH0ES', desc: 'The redshift cut that defines the kept rows', category: 'concepts' },
  { href: '/xi-dark-energy/data/desi-dr2-bao', title: 'DESI DR2 BAO', desc: 'Observables and residuals', category: 'concepts' },
  { href: '/xi-dark-energy/inference/likelihood', title: 'Likelihood Functions', desc: 'How the matrices enter χ²', category: 'concepts' },
]} />
