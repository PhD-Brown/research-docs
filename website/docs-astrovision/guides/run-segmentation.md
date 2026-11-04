---
title: Run Segmentation
description: Generate Otsu pseudo-labels, train the U-Net on them and run inference on Galaxy10 DECaLS images.
sidebar_position: 4
---

import Fact from '@site/src/components/astrovision/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* code: src/astrovision/segmenter.py, unet.py · recipe values: facts.json unet.* (notebook 06 / code defaults) */}

# Run Segmentation

Segmentation is weakly supervised: Otsu produces the labels, the U-Net learns them ([U-Net Segmentation](../models/segmentation.md) explains what the “bulge” class is).

## Step 1 — Otsu pseudo-labels

```python
from src.astrovision.segmenter import OtsuSegmenter
otsu = OtsuSegmenter(bg_pct=5.0, bulge_pct=80.0)
one = otsu.segment(image_uint8)            # dict: seg_map, galaxy_mask, bulge_mask, disk_mask, bulge_fraction
masks = otsu.batch_segment(images)         # (N, H, W) uint8 with labels 0 / 1 / 2
```

`images` is an `(N, 256, 256, 3)` uint8 array read from the HDF5 file. Label 2 is the brightest <Fact k="segmenter.otsu.bulge_percentile" />–100 % of galaxy pixels.

## Step 2 — Train the U-Net

```python
from torch.utils.data import DataLoader
from src.astrovision.unet import UNet, GalaxySegDataset, train_unet

train_ds = GalaxySegDataset(images_train, masks_train, train=True)
val_ds   = GalaxySegDataset(images_val,   masks_val,   train=False)
train_loader = DataLoader(train_ds, batch_size=16, shuffle=True,  num_workers=0)
val_loader   = DataLoader(val_ds,   batch_size=32, shuffle=False, num_workers=0)

model = train_unet(UNet(n_classes=3), train_loader, val_loader,
                   epochs=20, lr=1e-4, ckpt_dir='checkpoints/', use_wandb=False)
```

Defaults: <Fact k="unet.epochs" /> epochs, learning rate <Fact k="unet.lr" format="sci" />, Dice + cross-entropy loss, class weights (0.3, 1.5, 3.0), FP16. The best epoch by validation mean IoU is saved as `checkpoints/unet_galaxy10_best.pt`. On the author's GPU the 20 epochs took several hours.

## Step 3 — Inference

```python
import torch
model.eval()
with torch.no_grad():
    logits = model(images_batch.to('cuda'))     # (B, 3, 256, 256), ImageNet-normalised input
    seg = logits.argmax(1)                      # 0 background · 1 disk · 2 bright core
```

`UNet.predict` returns the arg-max directly.

## Step 4 — Inspect

```python
from src.astrovision.unet import plot_unet_gallery, segmap_to_rgb
```

`plot_unet_gallery` draws image · pseudo-label · prediction; `segmap_to_rgb` colours a label map. For the label-free alternative, `DINOv2PatchSegmenter(dino_model).segment(image, n_clusters=4)` clusters patch features with k-means.

## Expected output

A checkpoint and per-class IoU values; the reference test mIoU is on the [U-Net page](../models/segmentation.md) — it is measured against the Otsu labels, so do not read it as agreement with human masks.

<RelatedPages pages={[
  { href: '/astrovision/models/segmentation', title: 'U-Net Segmentation', desc: 'Model and results', category: 'science' },
  { href: '/astrovision/guides/compute-morphometry', title: 'Compute Morphometry', desc: 'Statistics on masks', category: 'guides' },
]} />
