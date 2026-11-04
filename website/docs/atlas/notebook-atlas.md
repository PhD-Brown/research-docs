---
title: Notebook Atlas
description: "Index of the Jupyter notebooks of AstroSpectro, AstroVision and xi-dark-energy-bao-mcmc — what each notebook does, in which order to read them, and which documentation page covers the same material."
sidebar_position: 4
---

{/* facts: no numbers. Notebook file names and titles read (read-only) from the notebooks/ folders of PhD-Brown/AstroSpectro, PhD-Brown/AstroVision and PhD-Brown/xi-dark-energy-bao-mcmc. Results shown in notebooks are not quoted here; see the linked pages. */}

# Notebook Atlas

Each project keeps its analysis in numbered notebooks. This page lists them in reading order and points to the documentation page that explains the same step. Notebook outputs are not reproduced here: the documentation quotes only values that are traceable to an exported result file.

---

## AstroSpectro

Repository: [`PhD-Brown/AstroSpectro`](https://github.com/PhD-Brown/AstroSpectro), folder `notebooks/`.

| Notebook | Purpose | Documentation |
|---|---|---|
| `00_master_pipeline.ipynb` | Runs the whole pipeline from data selection to a session report | [Quick Start](../astrospectro/guides/quick-start.mdx) · [Master Pipeline](../astrospectro/pipeline/master-pipeline.md) |
| `01_download_spectra.ipynb` | Interactive download of LAMOST DR5 spectra | [Data download](../astrospectro/guides/downloading-data.mdx) |
| `02_tools_and_visuals.ipynb` | Interactive spectrum analyzer and visualization tools | [Visualization](../astrospectro/guides/visualization.mdx) |
| `03_scientific_validation.ipynb` | Checks that the extracted features behave as spectroscopy predicts | [Scientific Validation](../astrospectro/science/validation.md) |
| `04_shap_interpretability.ipynb` | SHAP analysis of the classifier | [SHAP Interpretability](../astrospectro/science/shap-interpretability.md) |
| `dimred/phy3500_01_pca.ipynb` | PCA of the PHY-3500 feature table (G1) | [PCA](../astrospectro/dimred/pca.mdx) |
| `dimred/phy3500_02_umap_tsne.ipynb` | UMAP, t-SNE and HDBSCAN (G1) | [UMAP & HDBSCAN](../astrospectro/dimred/umap-hdbscan.md) · [t-SNE](../astrospectro/dimred/tsne.md) |
| `dimred/phy3500_03_autoencoder.ipynb` | Autoencoder (G1) | [Autoencoder](../astrospectro/dimred/autoencoder.mdx) |

The three `dimred/` notebooks belong to the **PHY-3500 · G1** generation of data; the other notebooks work on the pipeline and the reference classifier. The two generations are described in [Data & Datasets](../astrospectro/data/index.md).

---

## AstroVision

Repository: [`PhD-Brown/AstroVision`](https://github.com/PhD-Brown/AstroVision), folder `notebooks/`.

| Notebook | Purpose | Documentation |
|---|---|---|
| `00_eda_galaxy10.ipynb` | Exploratory analysis of Galaxy10 DECaLS | [Galaxy10 DECaLS](/astrovision/data/galaxy10-decals) |
| `01_galaxy10_cnn.ipynb` | Baseline CNN and EfficientNet training, with Grad-CAM | [Baseline CNN](/astrovision/models/baseline-cnn) · [EfficientNet-B0](/astrovision/models/efficientnet) |
| `02_results_analysis.ipynb` | Comparison of the first models, per-class results and errors | [Model Benchmarking](/astrovision/results/benchmarking) |
| `03_dinov2_features.ipynb` | Zero-shot DINOv2 features and linear probe | [DINOv2 — Linear Probe](/astrovision/models/dinov2-probing) |
| `04_dinov2_finetune.ipynb` | Fine-tuning DINOv2 | [DINOv2 — Fine-tuned](/astrovision/models/dinov2-finetuned) |
| `05_crossmatch_analysis.ipynb` | SDSS DR16 cross-match and colour analysis | [SDSS DR16 Crossmatch](/astrovision/data/sdss-crossmatch) · [Physical Interpretation](/astrovision/results/physical-interpretation) |
| `06_segmentation.ipynb` | U-Net segmentation on Otsu pseudo-labels | [U-Net Segmentation](/astrovision/models/segmentation) |
| `07_synthesis.ipynb` | Synthesis of morphology, photometry and segmentation | [Physical Interpretation](/astrovision/results/physical-interpretation) |
| `08_multimodal_fusion.ipynb` | Late-fusion multimodal classifier and its ablation | [Late-Fusion Multimodal](/astrovision/models/late-fusion) |
| `09_uncertainty_calibration.ipynb` | MC Dropout, temperature scaling, conformal prediction | [Uncertainty Quantification](/astrovision/results/uncertainty) |
| `10_attention_morphometry.ipynb` | CAS/Gini/M20 measured inside DINOv2 attention masks | [Attention & GradCAM](/astrovision/results/attention-gradcam) · [Non-parametric Morphometrics](/astrovision/models/morphometry) |

AstroVision scores exist only in notebook outputs, not in exported metric files; the AstroVision pages state which values are read from which notebook (see `_facts/astrovision/FACTS_INDEX.md`).

---

## ξ Dark Energy

Repository: [`PhD-Brown/xi-dark-energy-bao-mcmc`](https://github.com/PhD-Brown/xi-dark-energy-bao-mcmc), folder `notebooks/`.

| Notebook | Purpose | Documentation |
|---|---|---|
| `00_project_overview.ipynb` | Tour of the final results; does not rerun the MCMC | [Key Findings](/xi-dark-energy/overview/key-findings) |
| `01_data_inspection.ipynb` | Checks that the local data files are present and inspects their dimensions | [Data Overview](/xi-dark-energy/data) |
| `02_results_review.ipynb` | Loads the final result tables and summarises them | [Parameter Constraints](/xi-dark-energy/results/parameter-constraints) |
| `03_mcmc_diagnostics.ipynb` | Convergence diagnostics from the saved chains (chains are not committed) | [Convergence Diagnostics](/xi-dark-energy/inference/convergence) |

The MCMC itself is run by scripts (`src/xi_protocol1_run.py`, `src/xi_protocol1b_bao_run.py`), not by a notebook; see [Quick Run](/xi-dark-energy/reproducibility/quick-run).

---

See also: [Repository Map](./repository-map.md) · [Methods Index](./methods-index.md).
