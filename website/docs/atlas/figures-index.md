---
title: Figures Index
description: "Where the figures of the documentation come from — which folder of website/static/img holds which figure set, from which run and data generation, and which pages use them."
sidebar_position: 5
---

{/* facts: no numbers. Figure provenance from _facts/astrospectro/MANIFEST.md (section "Figures déjà sur le site"), FACTS_INDEX.md §0 and §3, _facts/astrovision/MANIFEST.md and _facts/xi/MANIFEST.md; folder contents listed from website/static/img/. */}

# Figures Index

Every figure of the documentation lives in `website/static/img/`. This page says which folder holds which figure set, which run or data generation it comes from, and which pages use it. Pages cite figures by their image path, written without the site prefix (for example `/img/dimred/x.png`).

---

## AstroSpectro

| Folder | Content | Provenance | Used by |
|---|---|---|---|
| `img/dimred/` | PCA, UMAP, t-SNE, HDBSCAN, autoencoder and stability figures; SHAP and validation figures of the earlier model | **PHY-3500 · G1 · 43,019 spectra** feature table (`features_20260305T174836Z`); the SHAP figures are those of the model v5 analysis, which also kept Gaia/photometric columns | [Dimensionality Reduction](../astrospectro/dimred/index.mdx) pages · [SHAP Interpretability](../astrospectro/science/shap-interpretability.md) · [Feature dataset](../astrospectro/data/feature-dataset.mdx) |
| `img/astrospectro/` | Confusion matrix of the reference classifier; SHAP (`01_data_leak`) and validation figures of the G2 feature table | **G2** · reference classifier `20260522T161236Z` and `features_20260522T153123Z`; the classifier includes four Gaia/photometric features, see the [Data Leakage Audit](../astrospectro/concepts/data-leakage-audit.mdx) | [Scientific Validation](../astrospectro/science/validation.md) · [F/G Confusion](../astrospectro/science/fg-confusion.md) · [Results Analysis](../astrospectro/science/results-analysis.mdx) |
| `img/getting-started/` | Screenshots of the installation and quick-start steps | Screenshots, not results | [Installation](../astrospectro/guides/installation.mdx) · [Quick Start](../astrospectro/guides/quick-start.mdx) |
| `img/` (root) | Older figures from the first version of the site (early confusion matrices, feature importances, missing-feature checks, a screenshot of the spectrum analyzer) | Early development runs of 2025, kept to illustrate the blog posts; **not results of the reference runs** | The 2025 blog posts and the [Visualization](../astrospectro/guides/visualization.mdx) guide (screenshot) |
| `img/blog/` | Cover images of the blog posts | Illustrations | [Journal](/Blog) |

The figures of the G2 dimensionality-reduction runs exist in the fact pack but are **not published**: the dimensionality-reduction pages stay on G1 (editorial decision). Do not place a G2 figure on a G1 page, or the reverse.

## AstroVision

Folder: `img/astrovision/`. The figures come from the notebooks of the project and are grouped by file-name prefix:

| Prefix | Content | Notebook | Pages |
|---|---|---|---|
| `eda_*`, `galaxy10_samples` | Exploration of Galaxy10 DECaLS | `00` | [Galaxy10 DECaLS](/astrovision/data/galaxy10-decals) · [Morphology Classes](/astrovision/data/morphology-classes) |
| `results_*`, `gradcam_*` | Comparison of the first models, per-class results, errors, Grad-CAM | `01`, `02` | [Model Benchmarking](/astrovision/results/benchmarking) · [Baseline CNN](/astrovision/models/baseline-cnn) · [EfficientNet-B0](/astrovision/models/efficientnet) |
| `dino_*` | DINOv2 features, UMAP, attention, probe and fine-tuning | `03`, `04` | [Linear Probe](/astrovision/models/dinov2-probing) · [Fine-tuned](/astrovision/models/dinov2-finetuned) |
| `xm_*` | SDSS DR16 cross-match, colours, populations | `05` | [SDSS DR16 Crossmatch](/astrovision/data/sdss-crossmatch) · [Physical Interpretation](/astrovision/results/physical-interpretation) |
| `seg_*`, `syn_*` | Segmentation, morphometry, synthesis | `06`, `07` | [U-Net Segmentation](/astrovision/models/segmentation) · [Non-parametric Morphometrics](/astrovision/models/morphometry) |
| `fusion_*` | Late-fusion confusion matrix and ablation | `08` | [Late-Fusion Multimodal](/astrovision/models/late-fusion) |
| `calibration_*`, `conformal_*`, `uncertainty_*` | Calibration and uncertainty | `09` | [Uncertainty Quantification](/astrovision/results/uncertainty) |
| `attn_*` | Attention-guided morphometry | `10` | [Attention & GradCAM](/astrovision/results/attention-gradcam) |

Notebook numbers refer to the [Notebook Atlas](./notebook-atlas.md).

## ξ Dark Energy

Folder: `img/xi/`. The figures come from the `figures/` folder of the project repository.

| Folder | Content | Provenance |
|---|---|---|
| `img/xi/protocol1b/` | Corner plots, reconstructed equation of state, BAO residuals | Protocol 1b — Pantheon+SH0ES + DESI DR2 BAO, the reference run |
| `img/xi/protocol1/` | Corner plots of the supernova-only protocol | Protocol 1, shown for qualitative comparison only (no numbers are published for it) |
| `img/xi/diagnostics/` | Marginal posteriors and running medians of the oscillating model | Chain diagnostics |

Titles and axis labels of some ξ figures are in French, as produced by the analysis code; the captions on the pages are in English. See [Corner Plots](/xi-dark-energy/results/corner-plots).

---

See also: [Datasets Index](./datasets-index.md) · [Notebook Atlas](./notebook-atlas.md) · [Claims Register](./claims-register.mdx).
