---
title: Gaia DR3 Cross-match
description: How LAMOST DR5 spectra are cross-matched with Gaia DR3 astrometry, photometry and GSP-Phot parameters in AstroSpectro — strategies, 0.5″ default radius, RUWE masking, derived columns and what they mean for spectro_only.
sidebar_position: 2
---

import GaiaLeakNote from '@site/src/components/GaiaLeakNote';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/astrospectro/csv_summaries.json (master_catalog_gaia.csv: 107 columns, 4,999-row snapshot) · code: AS/src/tools/gaia_crossmatcher.py, notebooks/00_master_pipeline.ipynb */}

# Gaia DR3 Cross-match

AstroSpectro enriches the LAMOST DR5 catalogue with **Gaia DR3** columns so that spectroscopic results can be compared with independent astrophysical parameters (T<sub>eff</sub>, log g, colours, parallax). The cross-match is implemented in `src/tools/gaia_crossmatcher.py` (`enrich_catalog_with_gaia`). This page describes the method and the output columns; match statistics are not available in the documentation data pack (see [Match statistics](#match-statistics)).

:::info[Why Gaia is used at all]
Gaia values serve as **reference labels for interpretation** (colouring embeddings, correlating principal components with T<sub>eff</sub>). They are not meant to be classifier inputs: see [`spectro_only` mode](../concepts/spectro-only-mode) and [Physical Purity](../concepts/physical-purity).
:::

---

## Method

### Strategies

`mode` selects how positions are matched; `auto` (default) tries them in order and falls back on failure.

| Mode | Service | Status in the code |
|---|---|---|
| `xmatch` | CDS X-Match against VizieR `I/355/gaiadr3`, then a TAP query on `source_id` for GSP-Phot and extra columns | Primary strategy, no table upload needed |
| `bulk` | ESA TAP_UPLOAD join on `gaiadr3.gaia_source`, with a pre-computed RA/Dec box and exact circular filter applied in Python | Legacy fallback; documented as unreliable since April 2026 (server-side error) |
| `cone` | One `cone_search_async` query per source | Slow but always available |

For every source the **closest** Gaia counterpart (smallest angular distance) is kept; the distance is stored in `match_dist_arcsec`.

### Search radius

`search_radius_arcsec` defaults to **0.5″**. The notebook `00_master_pipeline.ipynb` does not override it (it passes only `mode='auto'`, `ruwe_max=1.4`, `include_risky=False`), so a standard session uses 0.5″. Earlier descriptions quoting 1″ or 1.5″ do not match the code's default.

### RUWE masking

If `RUWE ≥ ruwe_max` (default 1.4), the row is **kept** but **all Gaia columns are set to NaN**; it is not removed from the catalogue. Passing `ruwe_max=None` disables the step. The consequence is that a spectrum with a poor astrometric solution simply has no Gaia parameters.

### Authentication

Credentials (`GAIA_USER`, `GAIA_PASS` in `.env`) are optional: a failed `Gaia.login` is logged as a non-blocking warning. See the [Gaia Connection guide](../guides/connexion-gaia).

---

## Columns added

The enriched catalogue `master_catalog_gaia.csv` has **107 columns** in the exported snapshot (see [Master Catalog](./master-catalog)). The Gaia-related ones are:

| Group | Columns |
|---|---|
| Identification and match | `source_id`, `gaia_ra`, `gaia_dec`, `match_dist_arcsec` |
| Astrometry | `parallax`, `parallax_error`, `pmra`, `pmdec`, `radial_velocity`, `ruwe`, `astrometric_excess_noise` |
| Photometry | `phot_g_mean_mag`, `phot_bp_mean_mag`, `phot_rp_mean_mag`, the three `*_flux` columns, `bp_rp`, `phot_bp_rp_excess_factor`, `phot_variable_flag`, `bp_g`, `g_rp` |
| GSP-Phot parameters | `teff_gspphot`, `logg_gspphot`, `mh_gspphot`, `ag_gspphot`, `ebpminrp_gspphot`, `distance_gspphot`, `lum_gspphot`, `evolstage_gspphot` |
| Derived here | `parallax_snr` = parallax / parallax_error; `M_G` = G + 5 log₁₀(parallax/1000) + 5, defined only when parallax > 0 and `parallax_snr` ≥ 5 |
| Optional (`include_risky=True`) | `radius_gspphot`, `mass_gspphot`, `age_gspphot` — GSP-Phot fields flagged as unstable |

GSP-Phot parameters are model-based estimates from Gaia low-resolution spectrophotometry, not direct measurements; treat them as approximate references.

## Gaia columns and `spectro_only`

All columns above are non-spectroscopic. In [`spectro_only` mode](../concepts/spectro-only-mode) the classifier excludes Gaia prefixes and photometry, and the dimensionality-reduction loader excludes them from the feature matrix while keeping the Gaia values as metadata for colouring and correlations.

:::warning[The reference classifier still contains Gaia-derived columns]
The `ProcessingPipeline` adds further columns computed from Gaia (absolute magnitudes such as `M_G`, `M_BP`, `M_RP`) that are present in the candidate feature table. The `spectro_only` filter works on name prefixes (`parallax`, `phot_`, `teff`, `logg`, `dist_`…), and names such as `M_G` or `ag_gspphot` match none of them. The reference run's selected features include four such columns; see the [Data Leakage Audit](../concepts/data-leakage-audit).

<GaiaLeakNote />
:::

## Match statistics

The match rate, the number of sources lost to the RUWE mask and the number of sources with `M_G` or `teff_gspphot` are computed by the code (`stats` dictionary: `matched`, `total`, `match_rate_pct`, `mode_used`, `n_with_M_G`, `n_with_teff`) but are **not recorded in the documentation data pack**, whose catalogue file is a 4,999-row snapshot. They are therefore not quoted here.

## Usage

```python
# src/tools/gaia_crossmatcher.py
from tools.gaia_crossmatcher import enrich_catalog_with_gaia

df_enriched, stats = enrich_catalog_with_gaia(
    input_catalog_df=catalog,            # needs 'ra', 'dec' in degrees
    output_catalog_path="data/catalog/master_catalog_gaia.csv",
    search_radius_arcsec=0.5,
    ruwe_max=1.4,
    mode="auto",
    overwrite=True,
)
stats["match_rate_pct"]
```

---

<RelatedPages pages={[
  { href: '/docs/astrospectro/guides/connexion-gaia', title: 'Gaia Connection', desc: 'Credentials and first cross-match', category: 'guides' },
  { href: '/docs/astrospectro/data/master-catalog', title: 'Master Catalog', desc: 'Column groups of master_catalog_gaia.csv', category: 'concepts' },
  { href: '/docs/astrospectro/data/quality-filters', title: 'Quality Filters', desc: 'SNR and RUWE criteria as implemented', category: 'concepts' },
  { href: '/docs/astrospectro/concepts/physical-purity', title: 'Physical Purity', desc: 'Why Gaia columns are not classifier inputs', category: 'concepts' },
  { href: 'https://github.com/PhD-Brown/AstroSpectro/blob/main/src/tools/gaia_crossmatcher.py', title: 'Source — gaia_crossmatcher.py', desc: 'enrich_catalog_with_gaia on GitHub', category: 'external' },
]} />
