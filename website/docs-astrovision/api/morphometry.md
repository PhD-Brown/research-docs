---
title: morphometry.py
description: API reference for AstroVision's non-parametric morphometry — GalaxyMorphometry (C, A, S, Gini, M20, Petrosian radius, Sérsic proxy), batch_morphometry and plot helpers.
sidebar_position: 3
---

import RelatedPages from '@site/src/components/RelatedPages';

{/* code: src/astrovision/morphometry.py · no numeric result on this page */}

# morphometry.py

References cited in the module: Conselice et al. 2003, Lotz et al. 2004, Abraham et al. 1996.

## `GalaxyMorphometry(image, bg_pct=10.0, smooth_sigma=3.0)`

`image`: `(H, W)` grey-scale or `(H, W, 3)` RGB (converted with luminance weights 0.299 / 0.587 / 0.114), uint8 or float. The constructor subtracts the `bg_pct`-th percentile as sky, builds the Otsu mask (hole filling, largest component) and the flux-weighted centre.

| Method | Returns |
|---|---|
| `concentration()` | C = 5 log₁₀(r₈₀ / r₂₀) |
| `asymmetry()` | A = Σ\|I − I₁₈₀\| / (2 Σ\|I\|), rotation about the centre of mass |
| `smoothness()` | S = Σ\|I − I_smooth\| / Σ\|I\| (Gaussian, `smooth_sigma` px) |
| `gini()` | Gini coefficient of the pixel fluxes in the mask |
| `m20()` | log₁₀ of the second-order moment of the brightest 20 % over the total |
| `petrosian_radius(eta=0.2)` | radius where η(r) = `eta` |
| `sersic_index_proxy()` | *n* from a simplified 1-D Sérsic fit of the mean radial profile |
| `compute_all()` | dict: `C, A, S, Gini, M20, r_petrosian, sersic_n, n_pixels, cx, cy` |

Each statistic returns `NaN` when the mask is too small (fewer than 10 pixels; 20 for Petrosian and Sérsic).

## `batch_morphometry(images, labels, max_n=5000, verbose=True) → DataFrame`

Samples up to `max_n` images at random (`numpy` seed 42), computes `compute_all()` for each and adds `label`, `class_name` and `g10_idx` (index in the full array). An exception on one image yields a row with only the identifying columns.

## Plot helpers

`plot_cas_diagram(df, save_path=None)` and `plot_morphometry_by_class(df, ...)` draw the CAS plane and per-class distributions (dark theme via `DARK_PARAMS`).

```python
from src.astrovision.morphometry import GalaxyMorphometry, batch_morphometry
stats = GalaxyMorphometry(img).compute_all()
df = batch_morphometry(images, labels)
```

<RelatedPages pages={[
  { href: '/astrovision/models/morphometry', title: 'Non-parametric Morphometrics', desc: 'Definitions and results', category: 'science' },
  { href: '/astrovision/guides/compute-morphometry', title: 'Compute Morphometry', desc: 'Guide', category: 'guides' },
]} />
