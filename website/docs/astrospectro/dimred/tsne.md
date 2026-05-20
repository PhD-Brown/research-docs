---
title: t-SNE & Stability Analysis
description: "t-SNE projection and Procrustes stability analysis compared to UMAP."
sidebar_position: 5
tags: [tsne, procrustes, stability, dimensionality-reduction]
---

# t-SNE & Stability Analysis

## t-SNE projection

t-SNE is applied to the same 91 PCA components with `perplexity=30`, `init='pca'`,
1,000 iterations (t = 80.2 s — approximately 2× UMAP). The projection produces an
**"archipelago" of compact, separated masses**, as opposed to UMAP's continuous continent.

**Structural differences:**
- Hot stars (A-F, T_eff > 7,000 K) form a distinct isolated cluster
- The central mass groups G-K main-sequence stars
- Log g colouring reveals partially isolated subgiant clusters

**Complementarity with UMAP:**
- t-SNE excels at **sharp separation of discrete sub-populations**
- UMAP better preserves **continuous gradients** (T_eff, [Fe/H])

| ![t-SNE grid](https://phd-brown.github.io/AstroSpectro/img/dimred/tsne_grid.png) |
|--|
| *t-SNE projection coloured by spectral type, T_eff, log g, [Fe/H]* |

---

## Procrustes stability analysis

### Counter-intuitive result: t-SNE is 60× more stable than UMAP

Both methods use stochastic gradient descent (SGD), making this result surprising.

| Method | Initialisation | Mean Procrustes distance dP | Relative stability |
|--------|---------------|----------------------------|-------------------|
| UMAP | Spectral (Laplacian) | **3.0 × 10⁻²** | Baseline |
| t-SNE | `init='pca'` | **5.0 × 10⁻⁴** | **60× more stable** |

**Why UMAP is less stable:**
- Spectral initialisation varies between seeds
- SGD with negative sampling introduces strong stochasticity in repulsive forces

**Why t-SNE is more stable:**
- `init='pca'` fixes an identical starting position across seeds
- KL penalty only penalises close neighbours — less sensitive to distant structure

| ![UMAP stability (4 seeds)](https://phd-brown.github.io/AstroSpectro/img/dimred/stability_umap.png) | ![t-SNE stability (4 seeds)](https://phd-brown.github.io/AstroSpectro/img/dimred/stability_tsne.png) |
|--|--|
| *UMAP: dP ~ 0.030 — significant run-to-run variability* | *t-SNE: dP ~ 5×10⁻⁴ — 60× more stable* |

### Perplexity sensitivity

The t-SNE projection is robust to perplexity in the range [15, 50].
Below perplexity = 15, cluster separation becomes artifactual.
Above perplexity = 50, local structure blurs toward a UMAP-like gradient.

**Recommended setting:** `perplexity=30` — optimal for N ≈ 43,000 spectra.

![Perplexity sensitivity](https://phd-brown.github.io/AstroSpectro/img/dimred/tsne_sensitivity_perplexity.png)

*t-SNE robustness across perplexity ∈ [15, 50]*

---

## HR diagram coloured by t-SNE axis 1

ρ(t-SNE axis 1, T_eff) = **+0.623** — intermediate between PCA (0.831) and UMAP (0.464).
The thermal gradient is visible on the HR diagram but with more local structure than PCA.

![HR diagram t-SNE axis 1](https://phd-brown.github.io/AstroSpectro/img/dimred/hr_diagram_tsne_ax1.png)

*HR diagram coloured by t-SNE axis 1 — thermal correlation in t-SNE space*

---

## UMAP vs t-SNE side-by-side

| | ![UMAP vs t-SNE](https://phd-brown.github.io/AstroSpectro/img/dimred/umap_all_classes_pair.png) |
|--|--|
| | *Continuous continent (UMAP) vs compact archipelago (t-SNE)* |

---

## See also

- [PCA — Physical Interpretation](./pca)
- [UMAP & HDBSCAN](./umap-hdbscan)
- [PCA vs UMAP vs AE Comparison](./comparison)
