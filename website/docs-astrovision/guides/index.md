---
title: Guides
description: Step-by-step guides to install AstroVision, train a classifier, compute morphometry, run Grad-CAM and run segmentation.
sidebar_position: 5
---

import RelatedPages from '@site/src/components/RelatedPages';

{/* code: AstroVision/src/astrovision/*.py, requirements.txt · no numeric result on this page */}

# Guides

The guides assume the repository layout described in [Project Structure](../overview/project-structure.md) and a CUDA GPU (CPU works but is slow for DINOv2 and the U-Net).

| Guide | Goal | Modules involved |
|---|---|---|
| [Installation](./installation.md) | Environment, dependencies, Galaxy10 download | `requirements.txt`, `data_loader.py` |
| [Train a Classifier](./train-classifier.md) | SimpleCNN or EfficientNet-B0 with the shared training loop | `models.py`, `trainer.py` |
| [Run GradCAM](./run-gradcam.md) | Heat maps for a trained CNN | `gradcam.py` |
| [Run Segmentation](./run-segmentation.md) | Otsu masks, U-Net training and inference | `segmenter.py`, `unet.py` |
| [Compute Morphometry](./compute-morphometry.md) | CAS / Gini / M20 on a set of images | `morphometry.py` |

Analyses that exist only as notebooks (DINOv2 fine-tuning, fusion, uncertainty, attention morphometry) are listed in [Project Structure](../overview/project-structure.md).

<RelatedPages pages={[
  { href: '/astrovision/guides/installation', title: 'Installation', desc: 'Start here', category: 'guides' },
  { href: '/astrovision/api', title: 'API Reference', desc: 'Module reference', category: 'api' },
]} />
