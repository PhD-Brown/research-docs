---
title: API Reference
description: Module-level reference of the AstroVision Python package — models, trainer, morphometry, Grad-CAM and cross-matcher — and the modules without a dedicated page yet.
sidebar_position: 6
---

import RelatedPages from '@site/src/components/RelatedPages';

{/* code: AstroVision/src/astrovision/*.py · signatures read from the source; no numeric result on this page */}

# API Reference

Package `src/astrovision` (import as `src.astrovision` from the repository root, as the notebooks do). Signatures below are read from the source; the code is the reference when they diverge.

## Documented modules

| Page | Module | Main objects |
|---|---|---|
| [models.py](./models.md) | `models.py` | `SimpleCNN`, `EfficientNetGalaxy`, `build_model` |
| [trainer.py](./trainer.md) | `trainer.py` | `train` |
| [morphometry.py](./morphometry.md) | `morphometry.py` | `GalaxyMorphometry`, `batch_morphometry`, plot helpers |
| [gradcam.py](./gradcam.md) | `gradcam.py` | `GradCAM`, `plot_gradcam_grid` |
| [crossmatcher.py](./crossmatcher.md) | `crossmatcher.py` | `Galaxy10Crossmatcher` |

## Modules without a dedicated page

| Module | Content | Where it is described |
|---|---|---|
| `data_loader.py` | `download_galaxy10`, `Galaxy10Dataset`, `get_transforms`, `load_galaxy10_splits`, `CLASS_NAMES` | [Data Preparation](../data/data-preparation.md) |
| `fusion.py` | `GalaxyFusionClassifier`, `FusionDataset`, `build_fusion_datasets`, `train_fusion`, `evaluate_fusion`, `ablation_study` | [Late-Fusion](../models/late-fusion.md) |
| `uncertainty.py` | `MCDropoutPredictor`, `TemperatureScaler`, `ConformalPredictor`, `find_most_uncertain` | [Uncertainty](../results/uncertainty.md) |
| `unet.py`, `segmenter.py` | `UNet`, `CombinedLoss`, `train_unet`; `OtsuSegmenter`, `DINOv2PatchSegmenter`, `SAMSegmenter` | [U-Net](../models/segmentation.md), [Run Segmentation](../guides/run-segmentation.md) |
| `attention_morphometry.py` | `extract_attention_map`, `attention_to_mask`, `AttentionMorphometry` | [Attention](../results/attention-gradcam.md) |
| `synthesis.py`, `spectral_viz.py` | master table, correlation and synthesis figures, colour–magnitude plots | [Physical Interpretation](../results/physical-interpretation.md) |

`src/astrovision/__init__.py` re-exports `load_galaxy10_splits`, `CLASS_NAMES`, `download_galaxy10`, `SimpleCNN`, `EfficientNetGalaxy`, `build_model`, `train`, `GradCAM` and `plot_gradcam_grid`.

<RelatedPages pages={[
  { href: '/astrovision/guides', title: 'Guides', desc: 'Task-oriented usage', category: 'guides' },
  { href: '/astrovision/overview/project-structure', title: 'Project Structure', desc: 'Repository layout', category: 'concepts' },
]} />
