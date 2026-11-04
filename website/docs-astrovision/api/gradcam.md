---
title: gradcam.py
description: API reference for AstroVision's Grad-CAM implementation — the GradCAM class and plot_gradcam_grid.
sidebar_position: 4
---

import RelatedPages from '@site/src/components/RelatedPages';

{/* code: src/astrovision/gradcam.py · no numeric result on this page */}

# gradcam.py

Implements Grad-CAM (Selvaraju et al. 2017).

## `GradCAM(model, target_layer)`

Registers forward and backward hooks on `target_layer` (activations and output gradients).

### `compute(img_tensor, class_idx=None) → (heatmap, class_idx)`

- `img_tensor`: `(1, C, H, W)` on the model's device;
- `class_idx`: class to explain; the predicted class if `None`;
- puts the model in `eval()`, back-propagates the selected logit, weights the activations by the spatially averaged gradients, applies ReLU, bilinearly resizes to `(H, W)` and min–max normalises to [0, 1].

Returns the heat map as a NumPy `(H, W)` array and the explained class index. Gradients are required, so call it outside `torch.no_grad()`.

## `plot_gradcam_grid(model, gradcam, images, labels, device, n_samples=8, alpha=0.45, filename='gradcam_grid.png') → Figure`

`images` are the **normalised** tensors of a loader batch; the function de-normalises them with ImageNet statistics, shows original · heat map (jet) · overlay, labels each row with the true class and titles the overlay with the prediction (green ✓ / red ✗), and saves to `figures/<filename>`.

```python
from src.astrovision import GradCAM, plot_gradcam_grid
gcam = GradCAM(model, model.gradcam_target)
heatmap, pred = gcam.compute(images[:1].to('cuda'))
```

<RelatedPages pages={[
  { href: '/astrovision/guides/run-gradcam', title: 'Run GradCAM', desc: 'Guide', category: 'guides' },
  { href: '/astrovision/results/attention-gradcam', title: 'Attention & GradCAM', desc: 'Interpretation', category: 'science' },
]} />
