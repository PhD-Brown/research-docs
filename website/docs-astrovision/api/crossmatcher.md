---
title: crossmatcher.py
description: API reference for Galaxy10Crossmatcher — CDS XMatch of Galaxy10 DECaLS with SDSS DR16 and the NASA-Sloan Atlas, with derived colours, populations and absolute magnitude.
sidebar_position: 5
---

import Fact from '@site/src/components/astrovision/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* code: src/astrovision/crossmatcher.py · facts.json crossmatch.radius_arcsec, crossmatch.ur_* (code constants) */}

# crossmatcher.py

Constants: `SDSS_CATALOG = "vizier:V/154/sdss16"`, `NSA_CATALOG = "vizier:J/AJ/149/77"`. Requires `astroquery` and `astropy` (not in `requirements.txt`).

## `Galaxy10Crossmatcher(h5_path, cache_dir='../data/', radius_as=3.0)`

Loads positions (`ra`, `dec`), label and redshift field from the HDF5 file into `g10_idx`, `ra`, `dec`, `label`, `z_photo`, `class_name`. The default radius is <Fact k="crossmatch.radius_arcsec" format="num" digits={1} />″.

| Method | Description |
|---|---|
| `run_sdss()` | cross-match with SDSS DR16, cached as `galaxy10_sdss_xmatch.csv.gz` |
| `run_nsa()` | cross-match with NSA v1.0.1 (stellar mass, SFR, Sérsic *n*), cached as `galaxy10_nsa_xmatch.csv.gz` |
| `stats(df)` | prints match counts per class, median g−r and population counts |
| `_xmatch(catalog, cache_name, batch_size=5000)` | private; queries CDS in batches, **returns the cache if it exists** |

## Derived columns (SDSS)

- colours `u-g`, `g-r`, `r-i`, `i-z`, `u-r` from the five magnitudes;
- `blue_cloud` (u−r &lt; <Fact k="crossmatch.ur_blue_cloud_max" format="num" digits={2} />), `red_sequence` (u−r &gt; <Fact k="crossmatch.ur_red_sequence_min" format="num" digits={2} />), `green_valley` (otherwise) and a `population` label;
- `Mr` = r − 5 log₁₀(cz/H₀ × 10⁶ / 10) with H₀ = 70 km/s/Mpc, using `zsp` when the column exists, only for redshifts above 0.001 — no K-correction or extinction.

```python
from src.astrovision.crossmatcher import Galaxy10Crossmatcher
xm = Galaxy10Crossmatcher(h5_path='data/Galaxy10_DECals.h5', cache_dir='data/')
df = xm.run_sdss()
xm.stats(df)
```

Cached results are reused silently: delete the `.csv.gz` to force a new query. Results and caveats: [SDSS DR16 Crossmatch](../data/sdss-crossmatch.md).

<RelatedPages pages={[
  { href: '/astrovision/data/sdss-crossmatch', title: 'SDSS DR16 Crossmatch', desc: 'Results and caveats', category: 'science' },
  { href: '/astrovision/api', title: 'API Reference', desc: 'All modules', category: 'api' },
]} />
