---
title: "Models & Methods"
description: Overview of all classification models benchmarked in AstroVision.
sidebar_position: 3
---

import Fact from '@site/src/components/astrovision/Fact';

{/* facts: facts.json models.{simplecnn,efficientnet,dinov2_probe,dinov2_ft,fusion}.test.balanced_accuracy · split.* · ablation.* · FACTS_INDEX §4.1–4.2 */}

# Models & Methods

AstroVision benchmarks 5 modelling strategies in increasing order of complexity:

| Model | Balanced accuracy | Key feature |
|-------|------------------|-------------|
| SimpleCNN (baseline) | <Fact k="models.simplecnn.test.balanced_accuracy" format="pct" /> | 3 conv layers from scratch |
| EfficientNet-B0 | <Fact k="models.efficientnet.test.balanced_accuracy" format="pct" /> | Transfer learning from ImageNet (full fine-tuning) |
| DINOv2 (linear probe) | <Fact k="models.dinov2_probe.test.balanced_accuracy" format="pct" /> | Frozen ViT-B/14 features, zero-shot |
| **DINOv2 (fine-tuned)** | **<Fact k="models.dinov2_ft.test.balanced_accuracy" format="pct" />** | Full ViT-B/14 fine-tuning — best image-only model |
| Late-fusion multimodal | <Fact k="models.fusion.test.balanced_accuracy" format="pct" /> | DINOv2 + morphometrics + SDSS (different split, see below) |

Balanced accuracy on each model's test set. The first four rows share one split (<Fact k="split.test" format="int" /> test images); the late-fusion model uses another stratified split (<Fact k="split.fusion.test" format="int" /> test images), so the step from <Fact k="models.dinov2_ft.test.balanced_accuracy" format="pct" /> to <Fact k="models.fusion.test.balanced_accuracy" format="pct" /> compares different test sets. In the 30-epoch ablation the four feature configurations stay within 0.4 points of one another (<Fact k="ablation.dinov2_only" format="pct" /> for DINOv2 alone, <Fact k="ablation.dinov2_morpho_photo" format="pct" /> with morphometrics and photometry): the gain comes from the MLP head on frozen features, not from the added modalities. The fine-tuned backbone may also have seen part of the fusion test images, a leak that cannot be checked from the exported facts.

The **late-fusion model** combines:
- DINOv2 visual features (768-dim from ViT-B/14)
- Non-parametric morphometrics (CAS, Gini, M20)
- SDSS photometric colours (u-g, g-r, r-i, i-z)

Navigate to each model's page for implementation details and analysis.
