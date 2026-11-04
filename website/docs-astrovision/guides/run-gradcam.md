---
title: Run GradCAM
description: Compute and plot Grad-CAM heat maps for a trained SimpleCNN or EfficientNet-B0 on Galaxy10 DECaLS test images.
sidebar_position: 3
---

import RelatedPages from '@site/src/components/RelatedPages';

{/* code: src/astrovision/gradcam.py, models.py (gradcam_target) · no numeric result on this page */}

# Run GradCAM

## Step 1 — Load a trained model

```python
import torch
from src.astrovision import build_model, load_galaxy10_splits

model = build_model('efficientnet')
model.load_state_dict(torch.load('checkpoints/efficientnet_galaxy10_finetune_best.pt', map_location='cuda'))
model = model.to('cuda').eval()
```

## Step 2 — Create the explainer

Each CNN exposes its target layer as `model.gradcam_target`.

```python
from src.astrovision import GradCAM
gcam = GradCAM(model, model.gradcam_target)
```

## Step 3 — One image

```python
_, _, test_loader = load_galaxy10_splits(batch_size=16, num_workers=0)
images, labels = next(iter(test_loader))
heatmap, pred = gcam.compute(images[:1].to('cuda'))                 # heat map (H, W) in [0, 1] and predicted class
heatmap_true, _ = gcam.compute(images[:1].to('cuda'), class_idx=int(labels[0]))   # explain the true class instead
```

`compute` expects a normalised `(1, 3, H, W)` tensor on the model's device and returns the heat map resized to the input size.

## Step 4 — A grid of examples

```python
from src.astrovision import plot_gradcam_grid
fig = plot_gradcam_grid(model, gcam, images, labels, device='cuda',
                        n_samples=8, alpha=0.45, filename='gradcam_grid.png')   # saved to figures/
```

The grid shows original · heat map · overlay, with ✓ / ✗ and the predicted class.

## Expected output

A PNG in `figures/` with `n_samples` rows. Compare with the exported [EfficientNet figure](../results/attention-gradcam.md).

## Notes

- Grad-CAM needs gradients: do not wrap `compute` in `torch.no_grad()`.
- For the DINOv2 classifier, use the attention maps of [Attention & Grad-CAM](../results/attention-gradcam.md) (`attention_morphometry.extract_attention_map`); the README example hooks `model.backbone.blocks[-1].norm1`, which is not a convolutional layer.

<RelatedPages pages={[
  { href: '/astrovision/results/attention-gradcam', title: 'Attention & GradCAM', desc: 'Interpretation and caveats', category: 'science' },
  { href: '/astrovision/api/gradcam', title: 'gradcam.py', desc: 'API reference', category: 'api' },
]} />
