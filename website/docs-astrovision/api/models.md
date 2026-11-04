---
title: models.py
description: API reference for AstroVision's image classifiers — SimpleCNN, EfficientNetGalaxy and the build_model factory.
sidebar_position: 1
---

import Fact from '@site/src/components/astrovision/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* code: src/astrovision/models.py · facts.json models.simplecnn.params */}

# models.py

`NUM_CLASSES = 10`. Both classifiers take `(B, 3, 256, 256)` ImageNet-normalised tensors and return `(B, 10)` logits. Both expose `gradcam_target`, the layer used by [`GradCAM`](./gradcam.md).

## `SimpleCNN(num_classes=10, dropout=0.4)`

Four-stage CNN from scratch (three `conv_block`s of two 3×3 convolutions with BatchNorm, ReLU, max-pool and Dropout2d, then a 128→256 convolution) followed by `AdaptiveAvgPool2d → Linear(256, 256) → ReLU → Dropout → Linear(256, num_classes)`. <Fact k="models.simplecnn.params" format="int" /> trainable parameters with the default arguments. `gradcam_target` = the 128→256 convolution. See [Baseline CNN](../models/baseline-cnn.md).

## `EfficientNetGalaxy(num_classes=10, freeze_backbone=False)`

`torchvision.models.efficientnet_b0` with ImageNet weights; the classifier becomes `Dropout(0.3) → Linear(in_features, num_classes)`. With `freeze_backbone=True` all backbone parameters have `requires_grad=False` (the new head stays trainable). `gradcam_target` = `backbone.features[-1]`. See [EfficientNet-B0](../models/efficientnet.md).

## `build_model(name='simplecnn', **kwargs)`

Factory over the registry `{"simplecnn": SimpleCNN, "efficientnet": EfficientNetGalaxy}`; raises `ValueError` for any other name — in particular **there is no `'dinov2'` entry** (the DINOv2 classifier lives in notebook 04).

```python
from src.astrovision import build_model
cnn = build_model('simplecnn', dropout=0.4)
eff = build_model('efficientnet', freeze_backbone=True)
```

<RelatedPages pages={[
  { href: '/astrovision/api/trainer', title: 'trainer.py', desc: 'Training loop', category: 'api' },
  { href: '/astrovision/guides/train-classifier', title: 'Train a Classifier', desc: 'Guide', category: 'guides' },
]} />
