---
title: Compute Morphometry
description: Compute CAS, Gini, M20, Petrosian radius and Sérsic proxy for single galaxy images or a batch, and group the results by morphology class.
sidebar_position: 5
---

import Fact from '@site/src/components/astrovision/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* code: src/astrovision/morphometry.py · facts.json morphometry.n (data/morphometry_galaxy10.csv) */}

# Compute Morphometry

## One image

```python
from src.astrovision.morphometry import GalaxyMorphometry

m = GalaxyMorphometry(image_uint8, bg_pct=10.0, smooth_sigma=3.0)   # (H, W, 3) or (H, W)
stats = m.compute_all()
# {'C', 'A', 'S', 'Gini', 'M20', 'r_petrosian', 'sersic_n', 'n_pixels', 'cx', 'cy'}
```

Statistics are `NaN` when the Otsu mask has fewer than 10 pixels (20 for the Petrosian radius and the Sérsic fit).

## A batch

```python
from src.astrovision.morphometry import batch_morphometry

df = batch_morphometry(images, labels, max_n=5000)      # random sub-sample, seed 42
print(df.groupby('class_name')[['C', 'Gini', 'M20']].median())
```

`batch_morphometry` samples at most `max_n` images (default 5,000 — the reference table has <Fact k="morphometry.n" format="int" /> rows) and records `g10_idx`, `label` and `class_name`; failing images give a row of NaN. Expect roughly 10–20 minutes for 5,000 images on a desktop CPU (the notebooks report this order of magnitude).

## Plots

```python
from src.astrovision.morphometry import plot_cas_diagram, plot_morphometry_by_class
plot_cas_diagram(df, save_path='figures/seg_cas_diagram.png')
plot_morphometry_by_class(df)
```

## Attention-guided variant

```python
from src.astrovision.attention_morphometry import AttentionMorphometry
am = AttentionMorphometry(dino_model, device='cuda', percentile=60.0)    # fine-tuned DINOv2 ViT-B/14
df_attn = am.batch_compute(images, labels)
```

This uses the DINOv2 attention map as the galaxy mask. Its `C` is defined differently from `GalaxyMorphometry.concentration`; do not mix the two tables ([Morphometry](../models/morphometry.md), [Attention](../results/attention-gradcam.md)).

## Troubleshooting

| Symptom | Cause |
|---|---|
| Many NaN rows | the Otsu mask is empty or tiny (faint or very small target) |
| Sérsic *n* near 1 for all classes | known property of the simplified radial-profile fit |
| Slow | the loop is pure Python per image; subsample with `max_n` |

<RelatedPages pages={[
  { href: '/astrovision/models/morphometry', title: 'Non-parametric Morphometrics', desc: 'Definitions and per-class medians', category: 'science' },
  { href: '/astrovision/api/morphometry', title: 'morphometry.py', desc: 'API reference', category: 'api' },
]} />
