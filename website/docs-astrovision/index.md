---
title: AstroVision
description: Deep learning pipeline for galaxy morphological classification with multimodal fusion and uncertainty quantification.
sidebar_position: 1
---

# AstroVision

**Deep learning for galaxy morphological classification.**

> Galaxy10 DECaLS · DINOv2 + morphometrics + SDSS · 86.3% balanced accuracy · MC Dropout · Conformal prediction

---

## Quick navigation

| Section | What you'll find |
|---------|-----------------|
| [Overview](/research-docs/astrovision/overview/) | Scientific motivation, key results |
| [Data](/research-docs/astrovision/data/) | Galaxy10 DECaLS, morphology classes, SDSS crossmatch |
| [Models](/research-docs/astrovision/models/) | CNN, EfficientNet, DINOv2, Late-fusion |
| [Results](/research-docs/astrovision/results/) | Benchmarking, uncertainty, physical interpretation |
| [Guides](/research-docs/astrovision/guides/) | Installation, training, GradCAM, segmentation |
| [API](/research-docs/astrovision/api/) | Module reference |

## Key result

:::info Central finding
DINOv2 visual representations encode physically meaningful galaxy structure —
principal components of the DINOv2 feature space correlate with non-parametric
morphometrics such as Gini coefficient and with photometric colour (R²=0.536 with g-r).
:::
