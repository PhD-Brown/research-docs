---
title: "Models & Methods"
description: Overview of all classification models benchmarked in AstroVision.
sidebar_position: 3
---

# Models & Methods

AstroVision benchmarks 5 modelling strategies in increasing order of complexity:

| Model | Balanced accuracy | Key feature |
|-------|------------------|-------------|
| SimpleCNN (baseline) | ~60% | 3 conv layers from scratch |
| EfficientNet-B0 | ~74% | Transfer learning from ImageNet |
| DINOv2 (linear probe) | ~78% | Frozen ViT-S/14 features |
| DINOv2 (fine-tuned) | ~82% | Full ViT-S/14 fine-tuning |
| **Late-fusion multimodal** | **86.3%** | DINOv2 + morphometrics + SDSS |

The **late-fusion model** is the flagship result. It combines:
- DINOv2 visual features (768-dim from ViT-S/14)
- Non-parametric morphometrics (CAS, Gini, M20)
- SDSS photometric colours (u-g, g-r, r-i, i-z)

Navigate to each model's page for implementation details and analysis.
