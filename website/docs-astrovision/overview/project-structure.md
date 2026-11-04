---
title: Project Structure
description: Layout of the AstroVision repository — Python package modules, the eleven notebooks, and which artefacts are not versioned.
sidebar_position: 5
---

import RelatedPages from '@site/src/components/RelatedPages';

{/* code: AstroVision/src/astrovision/*.py (14 files), notebooks/00–10 · no numeric result on this page */}

# Project Structure

The code lives in the `PhD-Brown/AstroVision` repository (read-only for this documentation). The Python package is `src/astrovision/`; analyses are notebooks that import it.

```text
AstroVision/
├── src/astrovision/
│   ├── data_loader.py            Galaxy10 HDF5 → DataLoaders (seed-42 split)
│   ├── models.py                 SimpleCNN, EfficientNetGalaxy, build_model
│   ├── trainer.py                Training loop (AdamW, cosine schedule, W&B)
│   ├── gradcam.py                Grad-CAM and overlay grids
│   ├── crossmatcher.py           CDS XMatch with SDSS DR16 and NSA
│   ├── morphometry.py            CAS, Gini, M20, Petrosian radius, Sérsic proxy
│   ├── segmenter.py              Otsu, DINOv2 patch clustering, optional SAM
│   ├── unet.py                   U-Net, Dice + CE loss, training loop
│   ├── fusion.py                 Late-fusion classifier and ablation
│   ├── uncertainty.py            MC Dropout, temperature scaling, conformal
│   ├── attention_morphometry.py  Morphometry on DINOv2 attention masks
│   ├── spectral_viz.py           Morphology × photometry plots
│   └── synthesis.py              Master table and synthesis figures
├── notebooks/                    00 … 10 (see below)
├── data/          (not versioned) Galaxy10 HDF5, caches, features
├── checkpoints/   (not versioned) trained weights (.pt)
└── figures/                      exported figures
```

## Notebooks

| # | Notebook | Content | Documented in |
|---|---|---|---|
| 00 | `00_eda_galaxy10` | Distributions, galleries, pixel PCA | [Galaxy10 DECaLS](../data/galaxy10-decals.md) |
| 01 | `01_galaxy10_cnn` | SimpleCNN, EfficientNet-B0, Grad-CAM | [Baseline CNN](../models/baseline-cnn.md), [EfficientNet](../models/efficientnet.md) |
| 02 | `02_results_analysis` | Confusion matrices, per-class metrics, errors | [Benchmarking](../results/benchmarking.md) |
| 03 | `03_dinov2_features` | Zero-shot features, UMAP, neighbours, probe | [Linear Probe](../models/dinov2-probing.md) |
| 04 | `04_dinov2_finetune` | DINOv2 fine-tuning, attention before/after | [Fine-tuned](../models/dinov2-finetuned.md) |
| 05 | `05_crossmatch_analysis` | SDSS DR16, colours, populations | [SDSS Cross-match](../data/sdss-crossmatch.md) |
| 06 | `06_segmentation` | CAS/Gini/M20, Otsu, DINOv2 clusters, U-Net | [Morphometry](../models/morphometry.md), [U-Net](../models/segmentation.md) |
| 07 | `07_synthesis` | Master table, bulge fraction × colour | [Physical Interpretation](../results/physical-interpretation.md) |
| 08 | `08_multimodal_fusion` | Late fusion and ablation | [Late-Fusion](../models/late-fusion.md) |
| 09 | `09_uncertainty_calibration` | MC Dropout, temperature, conformal | [Uncertainty](../results/uncertainty.md) |
| 10 | `10_attention_morphometry` | Attention-mask morphometry | [Attention & Grad-CAM](../results/attention-gradcam.md) |

:::note[Repository README]
The upstream README describes eight notebooks and a shorter module list; notebooks 08–10 and the modules `fusion.py`, `uncertainty.py`, `attention_morphometry.py` and `spectral_viz.py` were added later and are not in its tree. Its `build_model('dinov2')` example does not match `models.py`, which registers only `simplecnn` and `efficientnet`; the DINOv2 classifier is defined inside notebook 04.
:::

<RelatedPages pages={[
  { href: '/astrovision/guides/installation', title: 'Installation', desc: 'Set up the environment', category: 'guides' },
  { href: '/astrovision/api', title: 'API Reference', desc: 'Module-level documentation', category: 'api' },
]} />
