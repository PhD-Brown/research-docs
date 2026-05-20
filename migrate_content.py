#!/usr/bin/env python3
"""
AstroSpectro Documentation Migration — FR → EN
================================================
Migrates and translates all archived French documentation pages into the
new research-docs V2 structure under docs/astrospectro/.

Images reference the old AstroSpectro site (still live) until copied.
Image copy instructions are printed at the end.

Run from the ROOT of the research-docs repository:
    python migrate_content.py

Safe by default — skips existing files unless --force is passed.
"""

import sys
from pathlib import Path

BASE  = Path("website")
FORCE = "--force" in sys.argv
FIXED = 0
IMG   = "https://phd-brown.github.io/AstroSpectro/img"   # old site base


def write(path: str, content: str) -> None:
    global FIXED
    full = BASE / path
    if full.exists() and not FORCE:
        print(f"  [skip]   {path}")
        return
    full.parent.mkdir(parents=True, exist_ok=True)
    full.write_text(content.lstrip("\n"), encoding="utf-8")
    print(f"  [create] {path}")
    FIXED += 1


# ══════════════════════════════════════════════════════════════════════════════
#  OVERVIEW
# ══════════════════════════════════════════════════════════════════════════════

def create_overview():
    write("docs/astrospectro/overview/scientific-motivation.md", f"""---
title: Scientific Motivation
description: "Why AstroSpectro was built and what scientific question it addresses."
sidebar_position: 2
tags: [astrospectro, motivation, lamost, shap, spectroscopy]
---

# Scientific Motivation

## The core question

> *What physical information are modern machine-learning models actually learning from stellar spectra?*

This question sits at the heart of AstroSpectro. Stellar spectral classification has been
performed manually by astronomers for over a century using the Harvard–MK system. The question
is not whether a model *can* classify spectra accurately — it can — but whether the features
it learns correspond to physically meaningful quantities or to observational biases.

## Why LAMOST DR5 × Gaia DR3

The Large Sky Area Multi-Object fiber Spectroscopic Telescope (LAMOST) Data Release 5 offers
one of the largest homogeneous collections of stellar spectra available, with over 9 million
spectra at medium resolution (R ≈ 1 800). Crossed with Gaia DR3 astrophysical parameters
(T_eff, log g, [Fe/H] from GSP-Phot), it provides a natural validation set: we can check
whether the features selected by an ML model correlate with the physical parameters that
astrophysicists measure independently.

**Key properties of the working dataset:**
- N = 43,019 spectra (after quality filtering)
- Wavelength range: 3 700–9 000 Å
- Spectral resolution: R ≈ 1 800
- Five stellar classes: A, F, G, K, M
- 183 physics-based spectroscopic features extracted per spectrum

## The interpretability gap

Most ML pipelines for spectral classification optimise for accuracy and stop there.
AstroSpectro takes a different stance: **accuracy is a necessary but insufficient goal**.
A model that achieves 87 % balanced accuracy by exploiting the positional correlation between
LAMOST survey programs and spectral type (via `ra`, `dec`) is not learning spectral physics —
it is learning the survey design.

This is why:
1. All positional and instrumental metadata are excluded in `spectro_only=True` mode
2. SHAP analysis is used to validate that the model's decisions align with known astrophysics
3. The finding that removing `ra`, `dec`, `redshift` **increases** accuracy from 84 % to 87 %
   is treated as a scientific result, not an engineering detail

## Why SHAP

SHapley Additive exPlanations (Lundberg & Lee, 2017) provide a game-theoretic framework
for attributing a model's prediction to each input feature. In the context of stellar
spectroscopy, SHAP values answer the question: *which spectral feature contributed most
to classifying this star as type G?*

The central finding — that Ca II H&K features rank above Balmer-series features in the
learned classification structure — contrasts with the PCA result where Balmer lines dominate
the first principal component. This difference is physically meaningful and scientifically
interesting: **temperature maximises variance; metallicity maximises class separability**.

## Connection to the broader research programme

AstroSpectro is the first of three projects that share a common research philosophy:
physics-grounded, interpretable, reproducible machine learning applied to large
astronomical surveys. See [Research Ecosystem](/research-docs/docs/ecosystem) for
how AstroSpectro, AstroVision, and ξ Dark Energy connect.
""")

    write("docs/astrospectro/overview/key-results.md", f"""---
title: Key Results at a Glance
description: "AstroSpectro's most important metrics and scientific findings."
sidebar_position: 3
tags: [astrospectro, results, xgboost, shap, pca, umap]
---

# Key Results at a Glance

:::note Run context
Model: XGBoost · Mode: `spectro_only=True` · Dataset: N = 43,019
Classes: A / F / G / K / M · Run: 20260213T225019Z
:::

## Classification performance

| Metric | Value | Notes |
|--------|-------|-------|
| Balanced accuracy | **87 %** | 5-class: A, F, G, K, M |
| ROC-AUC (macro) | **~0.964** | Near-perfect discrimination |
| Median confidence | **96.3 %** | Probability of predicted class |
| F/G boundary confusion | Expected | Continuous physical transition at 5 500–6 200 K |

## Dimensionality reduction

| Method | Key result |
|--------|-----------|
| PCA | 91 components → 95 % variance · PC1: ρ(T_eff) = +0.831 |
| UMAP | Harvard sequence emerges without labels · 20 HDBSCAN clusters |
| t-SNE | 60× more stable than UMAP (Procrustes, init='pca') |
| Autoencoder | Lower MSE than PCA at K = 2 · interpretable latent arithmetic |

## ⭐ Central scientific finding (SHAP)

:::info Key finding
Current SHAP results **suggest** that metallicity-sensitive features (Ca II H&K and Mg b)
play a major role alongside classical Balmer temperature indicators in the learned
classification structure.

- **97.9 %** of the top-30 SHAP features are physical spectroscopic features
- Ca II K ranks in positions 1–3 for multiple stellar classes
- This contrasts with PCA where Balmer lines dominate PC1 (the temperature axis)
:::

**Physical interpretation:** PCA maximises variance → temperature dominates.
XGBoost minimises classification error → metallicity discriminates better between
adjacent spectral classes. These two results are **complementary, not contradictory**.

## Historical pipeline progression

| Version | Method | Balanced accuracy | Notes |
|---------|--------|-------------------|-------|
| Baseline | Random Forest, 4 binary features | 32 % | Proof of concept |
| V1 | RF/XGBoost + metadata (ra, dec, Gaia) | 75–84 % | ⚠️ Positional leakage risk |
| **V2 (current)** | **XGBoost, spectro_only=True** | **87 %** | Physical features only |

> **Counter-intuitive result:** removing `ra`, `dec`, `redshift` *increased* accuracy from
> 84 % to 87 %. These features encoded LAMOST's observational program biases, not stellar physics.
""")


# ══════════════════════════════════════════════════════════════════════════════
#  DIMRED — PCA (rich translation from pca-physical-interpretation)
# ══════════════════════════════════════════════════════════════════════════════

def create_pca():
    write("docs/astrospectro/dimred/pca.md", f"""---
title: PCA — Physical Interpretation
description: "Principal component analysis of 183 spectroscopic features — variance structure and physical correlations with Gaia DR3."
sidebar_position: 3
tags: [pca, eigenspectra, temperature, metallicity, lamost, gaia]
---

# PCA — Physical Interpretation

This page presents the astrophysical interpretation of the Principal Component Analysis (PCA)
applied to the **183 spectroscopic descriptors** extracted from N = 43,019 LAMOST DR5 × Gaia DR3
spectra. Each principal axis is validated by cross-correlation with independent Gaia DR3 parameters.

## Summary of the two main axes

| | PC1 | PC2 |
|--|-----|-----|
| **Label** | Thermal axis | Metallicity axis |
| **Variance** | 16.9 % · λ₁ = 30.19 | 12.0 % · λ₂ = 21.39 |
| **Top correlation** | ρ(T_eff) = +0.831 | ρ([Fe/H]) = −0.548 |
| **Colour correlation** | ρ(G_BP − G_RP) = −0.768 | ρ(SNR_r) = −0.310 ⚠️ |
| **Dominant family** | Balmer (31.5 %) + Ca II (22.4 %) | Fe & metals (43.3 %) |

:::caution PC2 contamination
ρ(PC2, SNR_r) = −0.310 reveals an instrumental contribution to PC2.
It is not a pure metallicity axis.
:::

---

## Mathematical foundations

PCA finds the orthogonal directions $\\mathbf{{w}}_k \\in \\mathbb{{R}}^p$ that successively
maximise the projected variance of the centred data $\\mathbf{{X}} \\in \\mathbb{{R}}^{{N \\times p}}$.
This is equivalent to diagonalising the empirical covariance matrix:

$$\\mathbf{{C}} = \\frac{{1}}{{N-1}}\\mathbf{{X}}^\\top\\mathbf{{X}} \\in \\mathbb{{R}}^{{p \\times p}}$$

The spectral theorem guarantees $\\mathbf{{C}} = \\mathbf{{W}}\\mathbf{{\\Lambda}}\\mathbf{{W}}^\\top$
with $\\lambda_1 \\geq \\cdots \\geq \\lambda_p \\geq 0$.

In practice, a truncated SVD is used: $\\mathbf{{X}} \\approx \\mathbf{{U}}_K\\mathbf{{\\Sigma}}_K\\mathbf{{W}}_K^\\top$
(Lanczos algorithm for N = 43,019, p = 183). The Eckart–Young theorem guarantees this truncation
is the best rank-K approximation in the Frobenius norm sense.

---

## Variance explained and reconstruction error

The explained variance profile reveals the **high intrinsic dimensionality** of the 183-feature space:
eigenvalues decay smoothly without a visible elbow — unlike the raw-flux PCA.

| Threshold V(K) | Components K | MSE(K) | Notes |
|----------------|-------------|--------|-------|
| 28.8 % | 2 | 0.696 | Visualisation only |
| 50.6 % | 10 | 0.494 | Half the information |
| 80.4 % | 51 | 0.196 | Fast-analysis threshold |
| **95.0 %** | **91** | **~0.050** | **Retained for UMAP/t-SNE** |
| 99.0 % | 100 | <0.010 | Near-total variance |

The first two components capture only 28.8 % of total variance (PC1: 16.9 %, PC2: 12.0 %).
This has a key practical implication: **UMAP and t-SNE are applied to the first 91 PCA
components** rather than the 183 raw features. This pre-reduction removes noise from late
components while preserving the essential physical structure.

| | ![Variance explained]({IMG}/dimred/pca_variance_explained.png) | ![Reconstruction error]({IMG}/dimred/pca_reconstruction_error.png) |
|--|--|--|
| | *Explained variance — individual + cumulative with 80/90/95/99 % thresholds* | *MSE(K) reconstruction error as a function of K* |

---

## PCA on raw fluxes — Eigenspectra

In addition to the engineered descriptors, PCA was also applied directly to the **raw fluxes**
of 10,000 LAMOST spectra (3,921 channels). The resulting eigenvectors — the *eigenspectra* —
are interpretable as basis spectra in flux space.

### Contrast with the descriptors

| | Raw fluxes | 183 descriptors |
|--|-----------|----------------|
| N channels | 3,921 | 183 |
| Components for 95 % variance | **K = 3** | **K = 91** |
| Top-3 cumulative | 91.3 % | 38.4 % |

**Why the difference?** Adjacent flux pixels (Δλ ~ 2 Å) are strongly correlated — coherence
length ~10 Å. Three components suffice. The 183 descriptors encode physically orthogonal
information (temperature, metallicity, gravity, chromospheric activity…): dimensionality
rises from ~3 to ~91 — a sign of richness, not inefficiency.

### Physical interpretation of the 3 first eigenspectra

**PC1 (46.6 %) — Colour slope (T_eff):**
Dominated by a quasi-uniform blue continuum (3700–6500 Å) that collapses toward the red.
This is the global continuum slope, directly related to effective temperature.
Hot stars (A-F types) contribute positively; cool stars (K-M) negatively.

**PC2 (31.8 %) — Infrared rise (cool stars):**
Captures the progressive flux increase toward the near-infrared (> 6500 Å).
Distinctive signature of cool K-M stars whose blackbody emission peaks in the red.

**PC3 (12.9 %) — LAMOST instrumental transition ⚠️:**
Isolates an abrupt transition around 6500–7000 Å, corresponding to the LAMOST
spectrograph's blue/red arm junction. This is an instrumental artefact, not a
physical property of the stars.

:::info PC3 artefact lesson
The presence of an instrumental artefact in PC3 illustrates a fundamental limitation of
unsupervised PCA: it maximises *total* variance, including instrumental variations that
can mask physical signals.
:::

![Eigenspectra]({IMG}/dimred/pca_eigenspectra.png)

*PC1 = colour slope (T_eff) · PC2 = infrared rise · PC3 = instrumental cut*

---

## PC1/PC2 projection and physical interpretation

### Spearman correlations with Gaia DR3 parameters

| Gaia DR3 parameter | Unit | ρ(PC1, ·) | ρ(PC2, ·) |
|-------------------|------|-----------|-----------|
| T_eff | K | **+0.831** | +0.156 |
| log g | dex | −0.155 | +0.081 |
| [Fe/H] | dex | −0.548 | **−0.082** |
| G_BP − G_RP | mag | **−0.768** | −0.025 |
| SNR_r | — | +0.071 | **−0.310** |
| A_G | mag | −0.070 | +0.196 |

**PC1 = thermal axis** — dominated by Balmer (31.5 %) + Ca II (22.4 %). Continuous T_eff
gradient from hot A-F stars (positive side) to cool K-M stars (negative side).

**PC2 = metallicity axis** — dominated by metals (43.3 %). ⚠️ Partially contaminated by
SNR (ρ = −0.310): unavoidable instrumental artefact in unsupervised PCA.

**Physical reading of ρ(PC1, T_eff) = +0.831:**
Effective temperature is the *dominant source of variance* in the 183-feature space.
This is consistent with the MK classification scheme — Balmer line strengths and continuum
slope vary massively from O to M types, far exceeding metallicity effects.

**Physical reading of ρ(PC1, [Fe/H]) = −0.548:**
Natural co-variation: cool K-M stars tend to be more metal-rich than hot A-F stars.
Linear PCA absorbs this into the same axis.

| ![PC1/PC2 projection]({IMG}/dimred/pca_scores_classes.png) | ![Score grid]({IMG}/dimred/pca_scores_grid.png) |
|--|--|
| *PC1/PC2 projection coloured by LAMOST spectral type* | *PC1/PC2/PC3 grid — cross-projections* |

![Correlation heatmap]({IMG}/dimred/pca_correlation_heatmap.png)

*Spearman correlation heatmap between PCA axes and Gaia DR3 parameters*

---

## Contribution by spectroscopic family

| Family | PC1 (thermal axis) | PC2 (metallicity axis) |
|--------|-------------------|----------------------|
| Balmer lines (Hα–Hθ) | **31.5 %** ★ | 8.2 % |
| Ca II (H&K + IR) | **22.4 %** | 12.1 % |
| Fe & metals | 15.3 % | **43.3 %** ★ |
| Mg / α-elements | 10.8 % | 18.4 % |
| Lick / SDSS indices | 9.7 % | 11.6 % |
| Continuum | 10.3 % | 6.4 % |

**PC1 thermal:** Balmer (31.5 %) + Ca II (22.4 %) = 53.9 % — temperature indicators
dominate unambiguously.

**PC2 composition:** Fe & metals (43.3 %) is the only family clearly dominating PC2.

| ![PC1 loadings]({IMG}/dimred/pca_loadings_pc1.png) | ![PC2 loadings]({IMG}/dimred/pca_loadings_pc2.png) |
|--|--|
| *Top absolute loadings of PC1* | *Top absolute loadings of PC2* |

![Loadings heatmap]({IMG}/dimred/pca_loadings_heatmap.png)

*Full loading heatmap across spectroscopic families*

---

## Top-5 absolute loadings of PC1 and PC2

### PC1 — Thermal axis

| Rank | Descriptor | Loading w | Interpretation |
|------|-----------|-----------|---------------|
| 1 | W(Hα) | +0.173 | Equivalent width of Hα — robust T_eff indicator |
| 2 | Continuum asymmetry | +0.172 | Blue/red slope |
| 3 | W(Mg b) | −0.171 | Mg b equivalent width |
| 4 | Synthetic B−V | −0.163 | Colour temperature proxy |
| 5 | f_blue / f_red | +0.161 | Flux ratio — temperature |

**W(Hα) at rank 1** is physically expected: Hα equivalent width is one of the most
robust temperature indicators in the MK classification scheme. Its positive sign means
hot stars (strong Hα) have high PC1 scores.

### PC2 — Metallicity axis

| Rank | Descriptor | Loading w | Interpretation |
|------|-----------|-----------|---------------|
| 1 | [Fe/H] proxy | +0.205 | Metallicity index |
| 2 | Combined metal index | +0.198 | |
| 3 | α-element index | +0.194 | |
| 4 | Metal-poor index | −0.193 | |
| 5 | W(Fe λ5270) | +0.174 | Fe I equivalent width |

**All five top loadings of PC2 are metallicity indices** — consistent with the
interpretation of PC2 as a chemical composition axis.

---

## HR diagram coloured by PC1

The correlation ρ(PC1, T_eff) = +0.831 is directly visualised on the
Hertzsprung–Russell diagram (T_eff vs log g).

The PC1 colour gradient follows the main sequence precisely from right (cool, negative PC1)
to left (hot, positive PC1), **visually validating the thermal interpretation of PC1**.

Evolved stars (log g < 3) show intermediate PC1 values — they have left the main sequence,
and their spectra combine thermal and gravity characteristics not captured linearly by PC1 alone.

| ![HR diagram PC1]({IMG}/dimred/hr_diagram_pca_pc1.png) | ![HR diagram PC2]({IMG}/dimred/hr_diagram_pca_pc2.png) |
|--|--|
| *HR diagram coloured by PC1 — thermal gradient along the main sequence* | *HR diagram coloured by PC2 — partial metallicity/gravity signal* |

---

## Limitations of PCA

**Linearity.** PCA is blind to any non-linear structure. The relationships between T_eff,
log g, and [Fe/H] in spectral space are not strictly linear — this is why UMAP and t-SNE
reveal additional structures (giant subgroups, dwarf/giant bifurcation) that PCA flattens.

**L₂ optimality only.** The Eckart–Young theorem guarantees PCA is the best rank-K
approximation in the Frobenius norm — not in terms of neighbourhood preservation or
cluster separation.

**Sensitivity to outliers in late components.** PC1 and PC2 are robust as they maximise
global variance. Late components (PC80–PC183) are sensitive to outlier spectra that maximise
residual variance.

**Physical mixing in PC1.** ρ(PC1, [Fe/H]) = −0.548 reveals that PC1 is not a pure
temperature axis: the natural T_eff/[Fe/H] co-variation is inevitably absorbed.

---

## See also

- [Feature Catalogue](../data/feature-catalog) — loading definitions and spectroscopic families
- [UMAP & HDBSCAN](./umap-hdbscan) — non-linear structure beyond PCA
- [PCA vs UMAP vs AE Comparison](./comparison) — systematic comparison
- [Feature Dataset](../data/feature-dataset) — composition, filters, standardisation
""")


# ══════════════════════════════════════════════════════════════════════════════
#  DIMRED — UMAP & HDBSCAN
# ══════════════════════════════════════════════════════════════════════════════

def create_umap():
    write("docs/astrospectro/dimred/umap-hdbscan.md", f"""---
title: UMAP & HDBSCAN Clustering
description: "UMAP topological projection and unsupervised HDBSCAN clustering of the stellar spectral feature space."
sidebar_position: 4
tags: [umap, hdbscan, clustering, lamost, spectroscopy]
---

# UMAP & HDBSCAN Clustering

## UMAP projection

UMAP is applied to the first **91 PCA components** (95 % variance threshold) with:
`n_neighbors=15`, `min_dist=0.1`, 200 epochs (t = 40.1 s on Ryzen 9 5950X).

The projection reveals a **"continuous continent" structure** where the Harvard spectral
sequence (M → K → G → F → A) unfolds without supervision along the main axis.

**Correlations:**
- ρ(UMAP axis 1, T_eff) = **+0.464** — thermal gradient along first axis
- The luminosity class (dwarfs vs giants) induces a visible topological bifurcation
  when coloured by log g

![UMAP coloured by spectral type]({IMG}/dimred/umap_classes.png)

*UMAP projection coloured by LAMOST spectral type — Harvard sequence emerges without supervision*

### Negative control

UMAP applied to data with randomly permuted columns → compact homogeneous cloud with
no structure. The observed structure is of **physical origin**, not an algorithmic artefact.

![Negative control]({IMG}/dimred/umap_negative_control.png)

*Permuted features → no structure. Physical origin confirmed.*

---

## HDBSCAN clustering — 20 groups without any label

HDBSCAN (Hierarchical Density-Based Spatial Clustering of Applications with Noise)
is applied to the UMAP embedding with `min_cluster_size=75`, `min_samples=20`.

### Summary statistics

| | Value |
|--|-------|
| Total clusters | **20** |
| Noise points | **2,643 (6.14 %)** |
| Largest cluster (C11) | 16,716 stars — G-K main sequence |
| Second cluster (C13) | 10,373 stars — cool K dwarfs |

### Top-12 cluster populations

| Cluster | N stars | Physical identification |
|---------|---------|------------------------|
| C11 | 16,716 | G-K main sequence |
| C13 | 10,373 | Cool K dwarfs |
| C5 | 5,083 | — |
| C2 | 915 | Subgiants / base RGB |
| C19 | 900 | Subgiants / base RGB |
| C12 | 851 | Subgiants / base RGB |
| C1 | 654 | Subgiants / base RGB |
| C16 | 620 | — |
| C17 | 615 | — |
| C3 | 818 | — |
| C9 | 576 | — |
| C7 | 474 | — |

### Physical identification on the HR diagram

| Clusters | T_eff | log g | Physical interpretation |
|----------|-------|-------|------------------------|
| C19, C1, C12 | 5000–5500 K | ≈ 3.0–3.5 | Subgiants / base RGB — strengthened Ca II, weakened Balmer → lower surface radiation pressure |
| C13 | 4500–5000 K | ≈ 4.5 | Cool K dwarfs — clearest physical identity |
| C11 | 5000–6000 K | ≈ 4.0–4.5 | G-K main sequence — dominant population |

:::info Original astrophysical result
Without any label or log g information, UMAP organises spectra such that HDBSCAN
**recovers the dwarf/subgiant distinction at fixed T_eff**. Clusters C19, C1, and C12
are spectrally distinguished by strengthened Ca II lines and weakened Balmer lines —
the signature of lower surface radiation pressure in giant atmospheres.
:::

| ![HDBSCAN clusters]({IMG}/dimred/umap_hdbscan_clusters.png) | ![Clusters on HR diagram]({IMG}/dimred/umap_hdbscan_hr.png) |
|--|--|
| *20 HDBSCAN clusters · 6.14 % noise · C11 = 16,716 stars* | *Clusters on HR diagram: C19/C1/C12 = subgiants · C13 = K dwarfs* |

| ![Feature heatmap per cluster]({IMG}/dimred/umap_hdbscan_feature_heatmap.png) | ![Feature profiles]({IMG}/dimred/umap_hdbscan_feature_profiles.png) |
|--|--|
| *SHAP-weighted feature heatmap by cluster* | *Spectral feature profiles for each cluster* |

---

## UMAP sensitivity analysis

Hyperparameter sensitivity was assessed over: `n_neighbors` ∈ {{5, 10, 15, 30, 50}},
`min_dist` ∈ {{0.0, 0.1, 0.25, 0.5}}.

**Robust results:**
- The Harvard-sequence gradient along axis 1 is stable across all tested parameters
- The dwarf/giant bifurcation appears consistently for `n_neighbors` ≥ 10
- `min_dist = 0.1` offers the best balance between local and global structure

![UMAP sensitivity n_neighbors]({IMG}/dimred/umap_sensitivity_n_neighbors.png)

*UMAP sensitivity to n_neighbors parameter*

---

## See also

- [PCA — Physical Interpretation](./pca) — linear baseline for comparison
- [t-SNE & Stability](./tsne) — probabilistic counterpart
- [PCA vs UMAP vs AE Comparison](./comparison) — systematic comparison table
- [SHAP Interpretability](../science/shap-interpretability) — supervised validation of UMAP structure
""")


# ══════════════════════════════════════════════════════════════════════════════
#  DIMRED — t-SNE
# ══════════════════════════════════════════════════════════════════════════════

def create_tsne():
    write("docs/astrospectro/dimred/tsne.md", f"""---
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

| ![t-SNE grid]({IMG}/dimred/tsne_grid.png) |
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

| ![UMAP stability (4 seeds)]({IMG}/dimred/stability_umap.png) | ![t-SNE stability (4 seeds)]({IMG}/dimred/stability_tsne.png) |
|--|--|
| *UMAP: dP ~ 0.030 — significant run-to-run variability* | *t-SNE: dP ~ 5×10⁻⁴ — 60× more stable* |

### Perplexity sensitivity

The t-SNE projection is robust to perplexity in the range [15, 50].
Below perplexity = 15, cluster separation becomes artifactual.
Above perplexity = 50, local structure blurs toward a UMAP-like gradient.

**Recommended setting:** `perplexity=30` — optimal for N ≈ 43,000 spectra.

![Perplexity sensitivity]({IMG}/dimred/tsne_sensitivity_perplexity.png)

*t-SNE robustness across perplexity ∈ [15, 50]*

---

## HR diagram coloured by t-SNE axis 1

ρ(t-SNE axis 1, T_eff) = **+0.623** — intermediate between PCA (0.831) and UMAP (0.464).
The thermal gradient is visible on the HR diagram but with more local structure than PCA.

![HR diagram t-SNE axis 1]({IMG}/dimred/hr_diagram_tsne_ax1.png)

*HR diagram coloured by t-SNE axis 1 — thermal correlation in t-SNE space*

---

## UMAP vs t-SNE side-by-side

| | ![UMAP vs t-SNE]({IMG}/dimred/umap_all_classes_pair.png) |
|--|--|
| | *Continuous continent (UMAP) vs compact archipelago (t-SNE)* |

---

## See also

- [PCA — Physical Interpretation](./pca)
- [UMAP & HDBSCAN](./umap-hdbscan)
- [PCA vs UMAP vs AE Comparison](./comparison)
""")


# ══════════════════════════════════════════════════════════════════════════════
#  DIMRED — AUTOENCODER
# ══════════════════════════════════════════════════════════════════════════════

def create_autoencoder():
    write("docs/astrospectro/dimred/autoencoder.md", f"""---
title: Autoencoder
description: "Convolutional autoencoder for spectral compression, reconstruction, and latent space exploration."
sidebar_position: 6
tags: [autoencoder, latent-space, reconstruction, anomaly-detection]
---

# Autoencoder

## Architecture

The AstroSpectro autoencoder is a symmetric encoder-decoder network applied to the
183 standardised spectroscopic features.

**Encoder:** 183 → 128 → 64 → 32 → **K** (latent)

**Decoder:** K → 32 → 64 → 128 → 183

- Activation: LeakyReLU (α = 0.01)
- Regularisation: BatchNorm + Dropout (p = 0.1)
- Loss: Mean Squared Error (MSE) on standardised features
- Optimiser: AdamW (lr = 1e-3, weight_decay = 1e-4)

---

## Reconstruction performance vs PCA

The autoencoder achieves lower reconstruction MSE than PCA at equivalent latent dimensions,
confirming the value of non-linear compression.

| K (latent dim) | MSE — Autoencoder | MSE — PCA | Improvement |
|---------------|------------------|-----------|-------------|
| 2 | **~0.55** | 0.696 | −21 % |
| 10 | **~0.35** | 0.494 | −29 % |
| 32 | **~0.08** | ~0.20 | −60 % |

![AE vs PCA MSE]({IMG}/dimred/ae_vs_pca_mse.png)

*Reconstruction MSE comparison: Autoencoder vs PCA across latent dimensions*

![Training history]({IMG}/dimred/ae_training_history.png)

*Training and validation loss curves*

---

## Reconstruction by spectral class

| ![Reconstruction examples]({IMG}/dimred/ae_reconstruction_examples.png) |
|--|
| *Reconstruction examples per spectral class — original vs reconstructed* |

| ![Reconstruction by spectral type]({IMG}/dimred/ae_recon_by_spectral_type.png) | ![Error by family]({IMG}/dimred/ae_recon_error_by_family.png) |
|--|--|
| *Mean reconstruction error per spectral type* | *Reconstruction error distribution by feature family* |

**Key observations:**
- M-type stars have the highest reconstruction error — their TiO/VO molecular bands
  introduce non-linear structure that the autoencoder compresses less efficiently
- A-type stars are reconstructed most accurately — their spectra are dominated by broad,
  regular Balmer lines
- Ca II H&K features show consistently low reconstruction error across all classes

---

## Latent space exploration

### KDE of the latent space

The 2D latent space (K=2) shows a structured distribution where stellar classes occupy
distinct but overlapping regions — confirming that the latent space encodes physically
meaningful information.

| ![Latent KDE]({IMG}/dimred/ae_latent_kde.png) | ![Latent grid]({IMG}/dimred/ae_latent_grid.png) |
|--|--|
| *KDE of the 2D latent space coloured by spectral type* | *Latent space grid — decoded spectra at each position* |

### Latent arithmetic

A key validation test: **latent arithmetic** on stellar types.

Taking the mean latent vector of K giants and the mean of G dwarfs, and combining them:

```
z(K giant) + z(G dwarf) ≈ z(intermediate K-G spectrum)
```

The decoded result produces a physically plausible intermediate spectrum — confirming that
the latent space encodes a continuous, physically meaningful manifold.

![Latent arithmetic]({IMG}/dimred/ae_latent_arithmetic.png)

*Latent arithmetic: K giant + G dwarf → intermediate spectrum*

### Latent interpolation

Smooth interpolation between two extreme points in the latent space (A-type star → M-type star)
produces a sequence of physically plausible intermediate spectra following the Harvard sequence.

![Latent interpolation]({IMG}/dimred/ae_latent_interpolation.png)

*Continuous interpolation from A → M type through latent space*

---

## Reconstruction error distribution

The MSE distribution is strongly right-skewed. The top 1 % highest-error spectra are
candidates for anomaly detection: spectra that the autoencoder struggles to reconstruct
are likely physically unusual (binary stars, chemically peculiar stars, misclassified objects).

| ![Error distribution]({IMG}/dimred/ae_error_distribution.png) | ![Log-scale distribution]({IMG}/dimred/ae_error_distribution_logscale.png) |
|--|--|
| *MSE distribution (linear scale)* | *MSE distribution (log scale) — long tail of anomalies* |

### Candidate anomalies

The three figures below show spectra from the top-1 % highest-error pool, one per class:

| ![Candidate K giant]({IMG}/dimred/ae_candidat_Étoile_K_géante.png) |
|--|
| *High-MSE K giant candidate — possible giant branch or chemically peculiar* |

| ![Candidate G dwarf]({IMG}/dimred/ae_candidat_Étoile_G_naine.png) |
|--|
| *High-MSE G dwarf candidate* |

| ![Candidate A type]({IMG}/dimred/ae_candidat_Étoile_A_typique.png) |
|--|
| *High-MSE A-type candidate — possible Ap/Am chemically peculiar star* |

---

## See also

- [PCA — Physical Interpretation](./pca)
- [UMAP & HDBSCAN](./umap-hdbscan)
- [PCA vs UMAP vs AE Comparison](./comparison)
- [Known Limitations](../science/limitations)
""")


# ══════════════════════════════════════════════════════════════════════════════
#  DIMRED — COMPARISON
# ══════════════════════════════════════════════════════════════════════════════

def create_comparison():
    write("docs/astrospectro/dimred/comparison.md", f"""---
title: PCA vs UMAP vs AE — Comparison
description: "Systematic comparison of PCA, UMAP, t-SNE, and autoencoder applied to AstroSpectro."
sidebar_position: 8
tags: [pca, umap, tsne, autoencoder, comparison]
---

# PCA vs UMAP vs t-SNE vs AE — Comparison

## Quantitative comparison

| Metric | PCA | UMAP | t-SNE | Autoencoder |
|--------|-----|------|-------|-------------|
| **Reconstruction MSE (K=2)** | 0.696 | — | — | ~0.55 |
| **ρ(axis 1, T_eff)** | **+0.831** | +0.464 | +0.623 | N/A |
| **Procrustes stability dP** | 0 (exact) | 3.0 × 10⁻² | **5.0 × 10⁻⁴** | — |
| **CPU time (Ryzen 9 5950X)** | < 1 s | 40.1 s | 80.2 s | ~5 min |
| **Parametric** | ✓ | Partial | ✗ | ✓ |
| **Non-linear** | ✗ | ✓ | ✓ | ✓ |
| **Interpretable axes** | ✓ | ✗ | ✗ | ✗ |
| **Latent generation** | Partial | ✗ | ✗ | ✓ |

## When to use each method

| Method | Best for |
|--------|---------|
| **PCA** | Interpretable linear baseline; axis physical meaning; input to UMAP/t-SNE |
| **UMAP** | Topological structure; continuous gradients; HDBSCAN clustering |
| **t-SNE** | Sharp discrete cluster separation; stability; subpopulation isolation |
| **Autoencoder** | Non-linear compression; anomaly detection; latent arithmetic |

## Synthesis figure

![PCA/UMAP/AE synthesis]({IMG}/dimred/synthesis_pca_umap_ae.png)

*Synthesis: three latent spaces side by side — same data, different geometries*

## Physical structure captured by each method

All three methods capture the same underlying physical structure — but at different levels:

- **PCA:** Linear temperature gradient (ρ = +0.831) + partial metallicity separation
- **UMAP:** Non-linear Harvard sequence + dwarf/giant bifurcation + 20 HDBSCAN clusters
- **t-SNE:** Sharp A-F hotspot + compact G-K archipelago + isolated subgiant masses
- **Autoencoder:** Smooth continuous latent manifold enabling interpolation and generation

The convergence of all four methods on the same physical structure validates the
183 spectroscopic feature set as a physically meaningful representation of stellar spectra.
""")


# ══════════════════════════════════════════════════════════════════════════════
#  SCIENCE — SHAP INTERPRETABILITY (enriched)
# ══════════════════════════════════════════════════════════════════════════════

def create_shap():
    write("docs/astrospectro/science/shap-interpretability.md", f"""---
title: SHAP Interpretability
description: "SHAP analysis of the AstroSpectro XGBoost classifier — the central scientific finding."
sidebar_position: 2
tags: [shap, interpretability, ca-ii, balmer, xgboost, metallicity]
---

# SHAP Interpretability

:::note Run context
Model: XGBoost · Mode: `spectro_only=True` · Dataset: N = 43,019
Classes: A / F / G / K / M · Run: 20260213T225019Z
:::

## The central finding

:::info Key scientific result
Current SHAP results **suggest** that metallicity-sensitive features
(Ca II H&K and Mg b) play a major role alongside classical Balmer temperature
indicators in the learned classification structure.

- **97.9 %** of the top-30 SHAP features are physically interpretable spectroscopic features
- Ca II K ranks in positions 1–3 for multiple stellar classes
- This contrasts with PCA where Balmer lines dominate PC1 (the temperature axis)

*"Suggest" is used deliberately — the finding is robust within this dataset and model
configuration, but replication across independent surveys and model families remains future work.*
:::

---

## SHAP vs PCA: two complementary questions

| Method | Question answered | Dominant feature | Physical result |
|--------|-----------------|-----------------|----------------|
| PCA (unsupervised) | What is the primary source of variance? | **Balmer lines** (PC1 = thermal axis, 31.5 %) | Temperature T_eff dominates variance |
| XGBoost + SHAP (supervised) | What best separates spectral classes? | **Ca II H&K** (ranks 1–5) | Metallicity is more discriminative |

These results are **not contradictory** — they answer different questions.
Temperature (Balmer) drives the most variance in spectral space.
Metallicity (Ca II) is more discriminative for class boundary decisions.

| ![SHAP comparison PCA vs XGBoost]({IMG}/dimred/class_feature_heatmap.png) |
|--|
| *SHAP importance heatmap by feature × class — Ca II dominates A/F/G/K* |

---

## Top-10 SHAP features (mean |SHAP value| across all classes)

| Rank | Feature | SHAP importance | Family | Physical interpretation |
|------|---------|----------------|--------|------------------------|
| 1 | Ca II K prominence | 0.98 | Ca II | K-line prominence — metallicity proxy |
| 2 | Ca II K EW | 0.94 | Ca II | K equivalent width |
| 3 | Ca II K FWHM | 0.91 | Ca II | K line width (pressure broadening) |
| 4 | Ca II H prominence | 0.87 | Ca II | H-line prominence |
| 5 | Ca II H EW | 0.84 | Ca II | H equivalent width |
| 6 | Hα EW | 0.76 | Balmer | H-alpha equivalent width |
| 7 | Hα prominence | 0.73 | Balmer | H-alpha prominence |
| 8 | Mg b EW | 0.68 | Metals | Mg b equivalent width |
| 9 | Mg b prominence | 0.64 | Metals | Mg b prominence |
| 10 | Balmer temperature index | 0.59 | Balmer | Combined Balmer index |

**97.9 % of the top-30 features are physically interpretable spectroscopic features.**
No positional, instrumental, or Gaia-derived feature appears in the top-30.

| ![Top features SHAP]({IMG}/dimred/class_specific_importance.png) |
|--|
| *Class-specific SHAP importance — top discriminating features per spectral type* |

---

## Per-class dominant features

| Class | Primary discriminators | Physical interpretation |
|-------|----------------------|------------------------|
| **A** | Hα EW (weak), Hβ FWHM (broad) | Strong, broad Balmer at high T_eff |
| **F** | Moderate Hα + emerging Ca II K | Transition temperature regime |
| **G** | Ca II K + H (strong), Mg b | Solar-type — metallicity + moderate T_eff |
| **K** | Ca II K (very strong), nascent TiO | Cool, metal-rich — Ca II peaks here |
| **M** | TiO/VO/CaH bands, Balmer absent | Molecular atmosphere |

---

## Physical validation: Ca II K vs [Fe/H]

The correlation between Ca II K prominence (top SHAP feature) and Gaia DR3 [Fe/H]
provides independent physical validation of the finding.

![Ca II K vs metallicity]({IMG}/dimred/caIIK_prom_vs_mh.png)

*Ca II K prominence vs Gaia DR3 [Fe/H] — physical correlation validates the SHAP finding*

---

## PCA vs XGBoost: why the difference matters

```
PCA: maximises total variance    → Temperature (Balmer) dominates
XGBoost: minimises class error   → Metallicity (Ca II) discriminates
```

Both results are physically coherent:

1. **Temperature is the dominant source of spectral variance** — this is why the Harvard
   MK sequence was discovered empirically from stellar colours and line strengths.

2. **Metallicity is the better class separator** — because adjacent spectral classes
   (e.g. G vs K) overlap heavily in temperature at the boundary. Ca II strength varies
   significantly even at fixed T_eff, providing additional discriminating power.

The fact that both a supervised (XGBoost + SHAP) and an unsupervised (PCA) approach
converge on the same physical quantities, albeit with different rankings, confirms
the validity of the 183 spectroscopic feature set.

---

## Known limitations of this SHAP analysis

:::caution Limitations
1. **Model-specific:** SHAP values reflect the decision structure of a single XGBoost model.
   Different model families (neural networks, random forests) may yield different rankings.

2. **Ca II H&K and chromospheric activity:** These lines respond to both metallicity
   and stellar chromospheric activity (e.g., active M dwarfs show Ca II emission).
   The SHAP finding conflates these two physical effects.

3. **Single train/test split:** Bootstrapped SHAP stability across multiple splits
   has not been assessed in the current version.

4. **Canonical model artifact:** The run `20260213T225019Z` uses an intermediate model
   artifact. The analysis should be re-run on the final canonical spectro_only=True model.
:::

---

## See also

- [Classification Performance](./classification-performance) — 87 % balanced accuracy details
- [Feature Catalogue](../data/feature-catalog) — all 183 features documented
- [PCA — Physical Interpretation](../dimred/pca) — the complementary unsupervised result
- [Known Limitations](./limitations) — full list of documented limitations
""")


# ══════════════════════════════════════════════════════════════════════════════
#  SCIENCE — CLASSIFICATION PERFORMANCE
# ══════════════════════════════════════════════════════════════════════════════

def create_classification_performance():
    write("docs/astrospectro/science/classification-performance.md", f"""---
title: Classification Performance
description: "Detailed XGBoost classification results — balanced accuracy, ROC-AUC, confusion matrix, and per-class metrics."
sidebar_position: 3
tags: [xgboost, classification, balanced-accuracy, roc-auc, shap]
---

# Classification Performance

:::note Run context
Model: XGBoost · Mode: `spectro_only=True` · Dataset: N = 43,019
Classes: A / F / G / K / M · Run: 20260213T225019Z
:::

## Global performance

| Metric | Value | Notes |
|--------|-------|-------|
| **Balanced accuracy** | **87 %** | Average per-class recall |
| **ROC-AUC (macro)** | **~0.964** | Near-perfect discrimination |
| **Median prediction confidence** | **96.3 %** | Probability of predicted class |

## Historical pipeline progression

| Step | Method | Features | Balanced acc. | Notes |
|------|--------|---------|---------------|-------|
| 1 — Baseline | Random Forest | 4 binary features | 32 % | Proof of concept |
| 2 — V1 metadata | RF / XGBoost | + ra, dec, Gaia | 75–84 % | ⚠️ Positional leakage risk |
| 3 — **V2 current** | **XGBoost** | **spectro_only=True** | **87 %** | Physical features only |

:::info Counter-intuitive result
Accuracy **increased** from 84 % to 87 % by **removing** `ra`, `dec`, `redshift`.
These features encoded LAMOST's observational program biases (programs target specific
spectral types in specific sky regions), providing a shortcut that bypassed physical
learning. Their removal forces the model to learn genuine spectral physics → better generalisation.
:::

---

## XGBoost configuration

| Hyperparameter | Value | Selection method |
|---------------|-------|-----------------|
| n_estimators | 300 | GridSearchCV |
| max_depth | 6 | GridSearchCV |
| learning_rate | 0.1 | GridSearchCV |
| subsample | 0.8 | GridSearchCV |
| colsample_bytree | 0.8 | GridSearchCV |
| scale_pos_weight | SMOTE balanced | Class imbalance handling |

Class balancing: SMOTE (Synthetic Minority Over-sampling Technique) applied in training
to equalise class frequencies before fitting.

---

## Supervised / unsupervised coherence

The geographic distribution of XGBoost predictions in UMAP space is coherent with
the unsupervised structure:
- A-type stars form a hot "peninsula" at the positive UMAP axis 1 extreme
- G-type stars cluster at the centre
- K-type stars occupy the cold periphery

Both supervised and unsupervised approaches capture the **same physical structure** —
the UMAP projection serves as a qualitative validation space for the classifier.

| ![XGBoost predictions in UMAP]({IMG}/dimred/umap_xgboost_predictions.png) | ![F/G confusion in UMAP]({IMG}/dimred/umap_xgboost_FG_confusion.png) |
|--|--|
| *XGBoost predictions in UMAP — geographic coherence* | *F/G confusion zone: continuous transition at 5500–6200 K* |

---

## F/G confusion analysis

The main confusion zone is the F/G boundary. This is **physically expected** — not a
classifier failure:

- The F/G boundary corresponds to T_eff ≈ 5,500–6,200 K
- This is a continuous physical transition in stellar atmosphere physics
- No discrete boundary exists that a classifier could learn perfectly
- The confusion rate mirrors human expert disagreement at this boundary

See [F/G Confusion Analysis](./fg-confusion) for a detailed treatment.

---

## See also

- [SHAP Interpretability](./shap-interpretability) — feature importance behind these results
- [UMAP & HDBSCAN](../dimred/umap-hdbscan) — unsupervised structure coherence
- [spectro_only=True Mode](../concepts/spectro-only-mode) — why metadata was excluded
- [Known Limitations](./limitations)
""")


# ══════════════════════════════════════════════════════════════════════════════
#  DATA — FEATURE CATALOG (enriched translation)
# ══════════════════════════════════════════════════════════════════════════════

def create_feature_catalog():
    write("docs/astrospectro/data/feature-catalog.md", f"""---
title: Feature Catalogue — 183 Spectroscopic Features
description: "Complete reference for all 183 spectroscopic features extracted by AstroSpectro in spectro_only=True mode."
sidebar_position: 5
tags: [features, spectroscopy, calcium, balmer, feature-engineering]
---

# Feature Catalogue — 183 Spectroscopic Features

:::note Canonical mode
All features listed here are extracted in `spectro_only=True` mode.
Total: **183 features** across 9 families.
:::

:::info Feature count clarification
Earlier documentation cited 174 features (FeatureEngineer output only).
The canonical count of **183** includes ~9 `match_*` columns added by ProcessingPipeline
during the line-matching step. See [spectro_only=True Mode](../concepts/spectro-only-mode).
:::

---

## Feature families overview

| Family | Count | Physical domain | Example features |
|--------|-------|----------------|-----------------|
| Balmer lines | ~25 | Temperature | Hα EW, Hβ prominence, Hγ FWHM |
| Ca II H&K | ~20 | Metallicity / activity | Ca II K EW, Ca II H prominence |
| Na / Mg / α-elements | ~15 | Chemistry / gravity | Na D EW, Mg b EW, Mg b prominence |
| Molecular bands | ~20 | Cool stars (T_eff < 4000 K) | TiO Δm, CaH index, MgH band |
| Fe & metals | ~25 | Metallicity | Fe I λ5270 EW, Fe I λ4668 |
| Continuum indices | ~30 | Temperature / gravity | B−V synthetic, fblue/fred, colour slopes |
| Line ratios | ~20 | Temperature / metallicity | Ca II K / Hβ, Fe / Mg |
| Line-profile moments | ~15 | Pressure / rotation | FWHM, asymmetry, kurtosis |
| match_* columns | ~13 | Line-matching (ProcessingPipeline) | match_CaIIH_prom, match_Hβ_EW |

---

## Key features by SHAP importance

These features rank highest in the SHAP analysis on the canonical `spectro_only=True` run
(see [SHAP Interpretability](../science/shap-interpretability)):

| SHAP rank | Feature name | Family | Physical interpretation |
|-----------|-------------|--------|------------------------|
| 1 | `num_feature_CaIIK_prom` | Ca II | Ca II K line prominence — metallicity proxy |
| 2 | `num_feature_CaIIK_ew` | Ca II | Ca II K equivalent width |
| 3 | `num_feature_CaIIK_fwhm` | Ca II | Ca II K line width (pressure broadening) |
| 4 | `num_feature_CaIIH_prom` | Ca II | Ca II H prominence |
| 5 | `num_feature_CaIIH_ew` | Ca II | Ca II H equivalent width |
| 6 | `num_feature_Ha_ew` | Balmer | H-alpha equivalent width |
| 7 | `num_feature_Ha_prom` | Balmer | H-alpha prominence |
| 8 | `num_feature_Mgb_ew` | Metals | Mg b equivalent width |
| 9 | `num_feature_Mgb_prom` | Metals | Mg b prominence |
| 10 | `num_feature_Balmer_temp_index` | Balmer | Combined Balmer temperature index |

---

## Key features by PCA loading (PC1 — thermal axis)

These features contribute most to PC1 (ρ(PC1, T_eff) = +0.831):

| PC1 rank | Feature | Loading w | Interpretation |
|----------|---------|-----------|---------------|
| 1 | W(Hα) | +0.173 | Hα equivalent width — T_eff indicator |
| 2 | Continuum asymmetry | +0.172 | Blue/red slope |
| 3 | W(Mg b) | −0.171 | Mg b EW |
| 4 | Synthetic B−V | −0.163 | Colour temperature proxy |
| 5 | f_blue / f_red | +0.161 | Flux ratio |

---

## Feature families in detail

### Balmer series (Hα to Hθ)

Hydrogen Balmer absorption lines are the primary temperature indicators in stellar spectra.
For each line, three measurements are extracted:
- **EW (equivalent width):** integrated line strength in Å
- **Prominence:** peak depth relative to local pseudo-continuum
- **FWHM:** full width at half maximum in Å

```
Features: Ha_ew, Ha_prom, Ha_fwhm, Hb_ew, Hb_prom, Hb_fwhm, ...
```

![Hα FWHM vs T_eff]({IMG}/dimred/ha_fwhm_vs_teff.png)

*Hα FWHM vs Gaia DR3 T_eff — strong correlation confirming physical grounding*

---

### Ca II H&K doublet

Ca II H (3968 Å) and K (3933 Å) are the strongest lines in stellar optical spectra.
They serve simultaneously as:
- **Metallicity proxies** (line strength ∝ Ca abundance)
- **Chromospheric activity indicators** (emission cores in active stars)

These are the top SHAP-ranked features in the canonical model.

![Ca II K vs metallicity]({IMG}/dimred/caIIK_prom_vs_mh.png)

*Ca II K prominence vs Gaia DR3 [Fe/H] — physical correlation between top SHAP feature and metallicity*

---

### Molecular bands (cool stars)

For T_eff < ~4,000 K, molecular absorption bands become the dominant spectral features:

| Band | Molecule | Wavelength range | Physical use |
|------|---------|-----------------|-------------|
| TiO | Titanium oxide | Multiple (5000–9000 Å) | Cool K-M stars |
| CaH | Calcium hydride | 6382–6389 Å | M subdwarfs vs giants |
| MgH | Magnesium hydride | 4780–4850 Å | Cool star gravity indicator |
| VO | Vanadium oxide | 7850–7860 Å | Very cool M stars |

---

### SNR quality check

![SNR quality check]({IMG}/dimred/snr_quality_check.png)

*SNR distribution across the 43,019-spectrum dataset — quality filtering at SNR_g > threshold*

---

### Colour indices

![Colour indices]({IMG}/dimred/color_indices.png)

*Synthetic colour indices (B−V, V−I, etc.) derived from the spectroscopic continuum*

---

## Column naming convention

```
num_feature_{{line}}_{{measurement}}

Examples:
  num_feature_CaIIK_ew       → Ca II K equivalent width
  num_feature_Ha_fwhm        → Hα full width at half maximum
  num_feature_Mgb_prom       → Mg b prominence
  num_feature_Balmer_temp_index → combined Balmer temperature index
  match_CaIIH_prom           → Ca II H match from ProcessingPipeline
```

---

## See also

- [spectro_only=True Mode](../concepts/spectro-only-mode) — which features are included/excluded
- [Physical Purity & Leakage](../concepts/physical-purity) — why non-physical features are excluded
- [Feature Engineering](../pipeline/feature-engineering) — how features are computed
- [SHAP Interpretability](../science/shap-interpretability) — feature importance analysis
- [PCA — Physical Interpretation](../dimred/pca) — PCA loadings by feature family
""")


# ══════════════════════════════════════════════════════════════════════════════
#  DATA — LAMOST DR5
# ══════════════════════════════════════════════════════════════════════════════

def create_lamost():
    write("docs/astrospectro/data/lamost-dr5.md", f"""---
title: LAMOST DR5
description: "The LAMOST Data Release 5 spectroscopic survey — overview, access, and properties relevant to AstroSpectro."
sidebar_position: 1
tags: [lamost, dr5, survey, spectroscopy, data]
---

# LAMOST DR5

## Survey overview

The **Large Sky Area Multi-Object fiber Spectroscopic Telescope (LAMOST)**, also known as
the Guoshoujing Telescope, is a 4-metre reflecting Schmidt telescope located at the
Xinglong Observatory in China.

Key technical specifications:

| Property | Value |
|----------|-------|
| Aperture | 4 m effective |
| Field of view | 5° diameter |
| Fibres | 4,000 per pointing |
| Wavelength range | 3 700 – 9 000 Å |
| Spectral resolution | R ≈ 1 800 (medium resolution) |
| Magnitude limit | g ≈ 19 (low resolution) |

## Data Release 5 statistics

| | Count |
|--|-------|
| Total spectra | ~9 million |
| Stellar spectra | ~6.5 million |
| After AstroSpectro quality filtering | **43,019** |

## LAMOST spectral classes

LAMOST performs automatic spectral classification using the LASP (LAMOST Stellar Parameter)
pipeline. The primary classification output is a 4-character `subclass` field:

| LAMOST subclass | Physical type |
|----------------|--------------|
| A0, A1, ..., A9 | A-type stars (T_eff: 7 500–10 000 K) |
| F0, F1, ..., F9 | F-type stars (T_eff: 6 000–7 500 K) |
| G0, G1, ..., G9 | G-type stars (T_eff: 5 200–6 000 K) |
| K0, K1, ..., K9 | K-type stars (T_eff: 3 700–5 200 K) |
| M0, M1, ..., M9 | M-type stars (T_eff: < 3 700 K) |
| GALAXY | Extragalactic object |
| QSO | Quasi-stellar object |

In AstroSpectro, these are collapsed to 5 primary classes: A, F, G, K, M.
GALAXY and QSO are excluded due to insufficient sample size (56 and 7 respectively).

## FITS file structure

Each LAMOST DR5 FITS file contains:

```
HDU 0: Primary — empty
HDU 1: FLUX — normalised flux array (3921 channels)
HDU 2: IVAR — inverse variance (signal quality)
HDU 3: WAVELENGTH — wavelength solution (Å)
HDU 4: ANDMASK — bad pixel mask
```

The AstroSpectro preprocessor reads HDU 1 (flux) and HDU 2 (ivar) and applies:
1. Continuum normalisation
2. Inverse-variance weighting
3. Quality flag checking

## Data access

LAMOST DR5 data is publicly available at:
- **Official portal:** http://dr5.lamost.org
- **VizieR:** Catalogue V/153 (CDS Strasbourg)
- **CDS XMatch:** For cross-matching with Gaia DR3

See [Downloading Data](../guides/downloading-data) for step-by-step instructions
using `dr5_downloader.py`.

## Quality filtering applied in AstroSpectro

The following filters are applied before feature extraction:

| Filter | Value | Rationale |
|--------|-------|-----------|
| SNR_g | > threshold | Minimum blue-arm quality |
| `class` | STAR | Exclude GALAXY, QSO |
| Wavelength coverage | Complete (3700–9000 Å) | Required for all 183 features |
| LAMOST flags | Clean | Exclude bad-fibre spectra |

After filtering: N = **43,019 spectra** from an initial pool of ~200,000+ raw LAMOST
DR5 stellar spectra in the downloaded sample.

## Known LAMOST systematics

1. **Observational program bias:** LAMOST targets specific sky regions according to
   survey programs. Some programs target particular stellar populations, creating
   positional correlations with spectral type. This is why `ra`, `dec` are excluded
   in `spectro_only=True` mode.

2. **Instrumental transition:** The blue/red arm junction (6500–7000 Å) creates
   a systematic flux discontinuity visible in the raw spectra and in PCA (PC3 of eigenspectra).

3. **Fibre cross-talk:** Rare fibres suffer from flux contamination from adjacent fibres.
   These are removed by the quality flag filter.

---

## See also

- [Gaia DR3 Cross-match](./gaia-dr3)
- [Quality Filters](./quality-filters)
- [Downloading Data](../guides/downloading-data)
""")


# ══════════════════════════════════════════════════════════════════════════════
#  PIPELINE — FEATURE ENGINEERING
# ══════════════════════════════════════════════════════════════════════════════

def create_feature_engineering():
    write("docs/astrospectro/pipeline/feature-engineering.md", f"""---
title: Feature Engineering
description: "How AstroSpectro's FeatureEngineer module extracts 183 physics-based spectroscopic features from LAMOST spectra."
sidebar_position: 3
tags: [feature-engineering, spectroscopy, balmer, calcium, equivalent-width]
---

# Feature Engineering

## Overview

The `FeatureEngineer` class extracts **183 physics-based spectroscopic features**
from each preprocessed LAMOST spectrum. All features correspond to physically
interpretable spectral properties — no positional, instrumental, or metadata features
are included in `spectro_only=True` mode.

:::info Design philosophy
Every feature in AstroSpectro can be computed by a spectroscopist working with only
the stellar spectrum. No positional information, survey metadata, or Gaia-derived
parameters are used in `spectro_only=True` mode.
:::

---

## The 9 feature families

### 1. Balmer series (Hα to Hθ) — ~25 features

For each Balmer line, three measurements are extracted:

| Measurement | Symbol | Unit | Description |
|-------------|--------|------|-------------|
| Equivalent width | EW | Å | Integrated line strength relative to continuum |
| Prominence | prom | — | Peak depth relative to local pseudo-continuum |
| FWHM | fwhm | Å | Full width at half maximum |

**Reference wavelengths (NIST):**

| Line | λ (Å) | Series |
|------|--------|--------|
| Hα | 6562.8 | n=3→2 |
| Hβ | 4861.3 | n=4→2 |
| Hγ | 4340.5 | n=5→2 |
| Hδ | 4101.7 | n=6→2 |

### 2. Ca II H&K doublet — ~20 features

| Line | λ (Å) | Importance |
|------|--------|-----------|
| Ca II K | 3933.7 | **#1 SHAP feature** |
| Ca II H | 3968.5 | **#4 SHAP feature** |
| Ca II IR triplet | 8498, 8542, 8662 | Additional gravity indicator |

### 3. Mg / Na / α-elements — ~15 features

| Line | λ (Å) | Physical use |
|------|--------|-------------|
| Mg b triplet | 5167, 5173, 5184 | Gravity + metallicity |
| Na D doublet | 5890, 5896 | ISM + chromospheric |
| [Mg/Fe] proxy | derived | α-element enhancement |

### 4. Molecular bands — ~20 features

Active for T_eff < ~4,000 K (K-M stars):

| Band | Molecule | λ range (Å) |
|------|---------|------------|
| TiO γ | TiO | 5167–5169 |
| TiO ε | TiO | 8432–8452 |
| CaH | CaH | 6382–6389 |
| MgH | MgH | 4780–4850 |

### 5. Fe & metal lines — ~25 features

Key iron lines used in metallicity indices:

| Line | λ (Å) |
|------|--------|
| Fe I | 4668, 5270, 5335, 5406, 5709, 5782 |
| Fe II | 4924, 5018, 5169 |

### 6. Continuum indices — ~30 features

Shape-based features computed from spectral continuum:

- Synthetic colour indices (B−V, V−I, R−I equivalents)
- Blue/red flux ratios
- Continuum slope fits
- Lick IDS indices

### 7. Line ratios — ~20 features

Physically motivated ratios between pairs of lines:

```python
# Examples
Ca_K_to_Hb    = Ca_II_K_EW / Hbeta_EW     # metallicity/temperature
Fe_to_Mg      = Fe_EW_sum / Mg_b_EW        # [Fe/Mg] proxy
TiO_to_CaH    = TiO_index / CaH_index      # luminosity class (M stars)
```

### 8. Line-profile moments — ~15 features

For key lines (Hα, Ca II K, Mg b):
- **Asymmetry:** skewness of the line profile
- **Kurtosis:** peakedness relative to Gaussian
- **EW/FWHM ratio:** shape parameter

### 9. match_* columns — ~13 features

These features are added by `ProcessingPipeline` during the line-matching step.
They represent the best-match line measurements after correcting for radial velocity:

```
match_CaIIK_prom, match_CaIIH_prom, match_Hbeta_EW, ...
```

:::note
These `match_*` columns are the difference between the 174-feature FeatureEngineer output
and the **canonical 183-feature** total. Always use `spectro_only=True` mode to ensure
all 183 features are properly computed.
:::

---

## Implementation

```python
from pipeline.feature_engineering import FeatureEngineer

fe = FeatureEngineer(spectro_only=True)
features_df = fe.extract_features(spectra_df)
# → DataFrame with 183 columns per spectrum
```

### NumPy 2.0 compatibility note

The module uses `np.trapezoid` (NumPy 2.0+) with a fallback to `np.trapz` (NumPy < 2.0):

```python
try:
    area = np.trapezoid(y, x)
except AttributeError:
    area = np.trapz(y, x)  # NumPy < 2.0
```

---

## Performance

| | Value |
|--|-------|
| Extraction time per spectrum | ~2 ms |
| Full dataset (N = 43,019) | ~90 s (Ryzen 9 5950X, 32 threads) |
| Parallelisation | `joblib` with `num_workers=0` (Windows) |
| Memory footprint | ~45 MB for full feature matrix |

---

## See also

- [Feature Catalogue](../data/feature-catalog) — all 183 features documented
- [spectro_only=True Mode](../concepts/spectro-only-mode) — which features are included
- [Processing Pipeline](./processing-pipeline) — how match_* columns are added
- [FeatureEngineer API](../api/feature-engineer) — complete API reference
""")


# ══════════════════════════════════════════════════════════════════════════════
#  GUIDES — INSTALLATION & QUICK START
# ══════════════════════════════════════════════════════════════════════════════

def create_guides():
    write("docs/astrospectro/guides/installation.md", f"""---
title: Installation
description: "Setting up the AstroSpectro environment — Python, dependencies, and GPU support."
sidebar_position: 1
tags: [installation, setup, python, cuda]
---

# Installation

## System requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Python | 3.10 | 3.11+ |
| RAM | 8 GB | 16 GB+ |
| Storage | 5 GB (code + features) | 60 GB (+ FITS files) |
| GPU | Not required | CUDA 12.x (autoencoder training) |
| OS | Linux / macOS / Windows | Windows 11 + WSL2 |

## Clone and install

```bash
git clone https://github.com/PhD-Brown/AstroSpectro.git
cd AstroSpectro
pip install -r requirements.txt
```

### Key dependencies

```
numpy>=2.0
scipy>=1.11
scikit-learn>=1.3
xgboost>=2.0
umap-learn>=0.5.4
hdbscan>=0.8.33
astropy>=6.0
shap>=0.44
matplotlib>=3.8
plotly>=5.18
pandas>=2.1
joblib>=1.3
torch>=2.1          # for autoencoder only
wandb>=0.16          # for experiment tracking
```

### Windows-specific notes

```python
# In all pipeline calls, always use:
num_workers = 0  # Required on Windows — multiprocessing spawn issues
```

## Verify installation

```python
import astrospectro
print(astrospectro.__version__)

# Quick sanity check
from pipeline.feature_engineering import FeatureEngineer
from pipeline.classifier import SpectralClassifier
print("Installation successful")
```

## GPU setup (optional — autoencoder only)

The autoencoder uses PyTorch and benefits from CUDA acceleration:

```bash
# Install PyTorch with CUDA 12.x
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
```

Verify:
```python
import torch
print(f"CUDA available: {{torch.cuda.is_available()}}")
print(f"Device: {{torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'CPU'}}")
```

---

## See also

- [Quick Start](./quick-start) — first pipeline run
- [Downloading Data](./downloading-data) — FITS file download
""")

    write("docs/astrospectro/guides/quick-start.md", f"""---
title: Quick Start
description: "Running AstroSpectro on a sample of spectra — from raw FITS to predictions in minutes."
sidebar_position: 2
tags: [quick-start, tutorial, xgboost, pipeline]
---

# Quick Start

This guide walks through a complete AstroSpectro pipeline run on a small sample
of spectra, producing classification predictions and SHAP feature importance.

## Step 1 — Load sample data

The repository includes a sample catalog for testing:

```python
import pandas as pd
from pipeline.processing import ProcessingPipeline

# Load sample catalog (100 spectra)
catalog = pd.read_csv("data/sample_catalog.csv")
print(f"Loaded {{len(catalog)}} spectra")
```

## Step 2 — Run preprocessing and feature extraction

```python
# spectro_only=True → 183 physical features only (canonical mode)
pipeline = ProcessingPipeline(spectro_only=True)
features_df = pipeline.run(catalog)

print(f"Feature matrix shape: {{features_df.shape}}")
# Expected: (100, 183)
```

## Step 3 — Load the trained classifier

```python
from pipeline.classifier import SpectralClassifier

clf = SpectralClassifier.load("models/spectral_classifier_canonical.pkl")
predictions = clf.predict(features_df)
probabilities = clf.predict_proba(features_df)

print(predictions.head())
# Expected: Series of ['G', 'K', 'A', 'F', 'M', ...]
```

## Step 4 — SHAP analysis

```python
import shap

explainer = shap.TreeExplainer(clf.model_)
shap_values = explainer.shap_values(features_df)

# Summary plot
shap.summary_plot(shap_values, features_df, max_display=20)
```

## Step 5 — Run with Weights & Biases tracking

```bash
python master.py --spectro-only --track --project astrospectro-runs
```

Expected output:

```
[INFO] AstroSpectro pipeline starting...
[INFO] Dataset: 43,019 spectra · 183 features
[INFO] Mode: spectro_only=True
[INFO] Balanced accuracy: 87.0 %
[INFO] ROC-AUC macro: 0.964
[INFO] W&B run: https://wandb.ai/phd-brown/astrospectro/runs/XXXXX
```

## Expected results (canonical run)

| Metric | Expected value |
|--------|---------------|
| Balanced accuracy | **87 %** |
| ROC-AUC macro | **~0.964** |
| Median confidence | **96.3 %** |
| Runtime (43k spectra) | ~5 min (Ryzen 9 5950X) |

---

## See also

- [Installation](./installation)
- [Downloading Data](./downloading-data)
- [Model Training](./model-training)
- [Experiment Tracking](../pipeline/experiment-tracking)
""")

    write("docs/astrospectro/guides/downloading-data.md", f"""---
title: Downloading Data
description: "How to download LAMOST DR5 FITS files using dr5_downloader.py."
sidebar_position: 3
tags: [data, lamost, fits, download]
---

# Downloading Data

## LAMOST DR5 access

LAMOST DR5 data requires a free account at http://dr5.lamost.org

After registration:
1. Go to **Data Access → Bulk Download**
2. Select spectral type filter (e.g., "STAR only")
3. Download the observation plan URL list

## Using dr5_downloader.py

The `dr5_downloader.py` script handles batch download with resume support:

```bash
python dr5_downloader.py \\
    --url-list data/valid_plan_urls.csv \\
    --output-dir data/fits/ \\
    --workers 4 \\
    --retry 3
```

### Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| `--url-list` | required | CSV file with download URLs |
| `--output-dir` | `data/fits/` | Target directory |
| `--workers` | 4 | Parallel downloads |
| `--retry` | 3 | Retry failed downloads |

### Storage requirements

| Scale | Storage |
|-------|---------|
| Sample (1,000 spectra) | ~50 MB |
| Working set (43,019) | ~2 GB |
| Full pipeline (~139k) | ~7 GB |

## The valid_plan_urls.csv file

The repository includes `valid_plan_urls.csv` with 4,152 observation plan URLs
corresponding to the 43,019-spectrum canonical dataset.

```csv
url
http://dr5.lamost.org/download/spectrum/fits/...
...
```

## Building the master catalog

After downloading FITS files, run:

```bash
python generate_catalog_from_fits.py \\
    --fits-dir data/fits/ \\
    --output data/master_catalog.csv
```

This extracts FITS headers and creates the master catalog structure needed
by the preprocessing pipeline.

---

## See also

- [LAMOST DR5](../data/lamost-dr5)
- [Master Catalog](../data/master-catalog)
- [Preprocessing](../pipeline/preprocessing)
""")


# ══════════════════════════════════════════════════════════════════════════════
#  MAIN
# ══════════════════════════════════════════════════════════════════════════════

def main():
    print(f"\n{'='*60}")
    print(f"  AstroSpectro Content Migration — FR → EN")
    mode = "FORCE" if FORCE else "SAFE (skip existing)"
    print(f"  Mode: {mode}")
    print(f"  Base: {BASE.resolve()}")
    print(f"{'='*60}\n")

    if not (BASE / "docusaurus.config.ts").exists():
        print("ERROR: Run from the ROOT of research-docs repo.")
        import sys; sys.exit(1)

    print("[ Overview ]")
    create_overview()

    print("\n[ PCA ]")
    create_pca()

    print("\n[ UMAP & HDBSCAN ]")
    create_umap()

    print("\n[ t-SNE ]")
    create_tsne()

    print("\n[ Autoencoder ]")
    create_autoencoder()

    print("\n[ Comparison ]")
    create_comparison()

    print("\n[ SHAP Interpretability ]")
    create_shap()

    print("\n[ Classification Performance ]")
    create_classification_performance()

    print("\n[ Feature Catalogue ]")
    create_feature_catalog()

    print("\n[ LAMOST DR5 ]")
    create_lamost()

    print("\n[ Feature Engineering ]")
    create_feature_engineering()

    print("\n[ Guides: Installation, Quick Start, Downloading Data ]")
    create_guides()

    print(f"\n{'='*60}")
    print(f"  ✅  {FIXED} pages created/updated")
    print(f"{'='*60}\n")

    print("📦  IMAGE MIGRATION (optional but recommended)")
    print("    Images currently reference the old AstroSpectro site.")
    print("    To host them locally, copy to website/static/img/astrospectro/:\n")

    images = [
        "pca_variance_explained.png", "pca_reconstruction_error.png",
        "pca_eigenspectra.png", "pca_scores_classes.png", "pca_scores_grid.png",
        "pca_correlation_heatmap.png", "pca_loadings_pc1.png", "pca_loadings_pc2.png",
        "pca_loadings_heatmap.png", "hr_diagram_pca_pc1.png", "hr_diagram_pca_pc2.png",
        "umap_classes.png", "umap_negative_control.png", "umap_hdbscan_clusters.png",
        "umap_hdbscan_hr.png", "umap_hdbscan_feature_heatmap.png",
        "umap_hdbscan_feature_profiles.png", "umap_sensitivity_n_neighbors.png",
        "tsne_grid.png", "hr_diagram_tsne_ax1.png", "tsne_sensitivity_perplexity.png",
        "stability_umap.png", "stability_tsne.png", "umap_all_classes_pair.png",
        "umap_xgboost_predictions.png", "umap_xgboost_FG_confusion.png",
        "ae_vs_pca_mse.png", "ae_training_history.png", "ae_reconstruction_examples.png",
        "ae_recon_by_spectral_type.png", "ae_recon_error_by_family.png",
        "ae_latent_kde.png", "ae_latent_grid.png", "ae_latent_arithmetic.png",
        "ae_latent_interpolation.png", "ae_error_distribution.png",
        "ae_error_distribution_logscale.png", "synthesis_pca_umap_ae.png",
        "class_feature_heatmap.png", "class_specific_importance.png",
        "caIIK_prom_vs_mh.png", "ha_fwhm_vs_teff.png",
        "snr_quality_check.png", "color_indices.png",
    ]

    print("    mkdir website\\static\\img\\astrospectro")
    for img in images:
        print(f"    copy data\\project\\{img} website\\static\\img\\astrospectro\\")
    print()
    print("    Then update IMG base URL in each page from:")
    print("    https://phd-brown.github.io/AstroSpectro/img/dimred/")
    print("    to: /img/astrospectro/")
    print()
    print("Next steps:")
    print("  cd website && npm run start")
    print("  git add . && git commit -m 'feat: migrate FR docs → EN with full content'")
    print("  git push origin main\n")


if __name__ == "__main__":
    main()
