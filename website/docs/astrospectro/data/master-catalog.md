---
title: Master Catalog
description: Structure of AstroSpectro's master catalogue — LAMOST DR5 header metadata built by generate_catalog_from_fits, optionally extended with Gaia DR3 columns (107 columns in the exported snapshot) — and how it relates to the feature tables.
sidebar_position: 3
---

import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/astrospectro/csv_summaries.json (master_catalog_gaia.csv · master_catalog_temp.csv · trained_spectra.csv) · code: AS/src/tools/generate_catalog_from_fits.py, dataset_builder.py, gaia_crossmatcher.py */}

# Master Catalog

The **master catalogue** is the metadata table that accompanies the spectra: one row per FITS file, built from the primary FITS header and, optionally, enriched with Gaia DR3 columns. It is distinct from the **feature tables** (`features_*.csv`), which hold the measured spectroscopic features and are joined to the catalogue during [processing](../pipeline/processing-pipeline). This page documents the structure of the catalogue; it does not describe a dataset size, because the exported catalogue is only a snapshot.

:::note[Snapshot, not the full catalogue]
The documentation data pack contains a **summary** of `master_catalog_gaia.csv` dated 2026-05-25: **4,999 rows × 107 columns**. This is a working snapshot, not the catalogue of the full 349,998-spectrum run, and it must not be read as the catalogue size. The 43,019-spectrum count quoted on dimensionality-reduction pages is the PHY-3500 · G1 analysis set (see [Dataset Versions](./dataset-versions)), not the catalogue.
:::

---

## Source & provenance

| Step | Code | Output |
|---|---|---|
| Choose the spectra | `DatasetBuilder.get_new_training_batch` — scans `data/raw/` for `.fits.gz` files and excludes those listed in the ledger `trained_spectra.csv` | List of relative paths |
| Read headers | `generate_catalog_from_fits` / `_row_from_header` — reads only HDU 0 headers, never the flux arrays | `master_catalog_temp.csv` (delimiter `\|`) |
| Add Gaia | `enrich_catalog_with_gaia` (see [Gaia DR3](./gaia-dr3)) | `master_catalog_gaia.csv` (delimiter `,`) |

Missing header values are written as the string `"UNKNOWN"` in the local catalogue, and as NaN for numeric fields. The two files use **different delimiters**: pipe for the header-only catalogue, comma for the Gaia-enriched one.

## Schema

Columns are listed by group; names are those of the exported file.

### LAMOST header columns

| Group | Columns |
|---|---|
| Identification | `file_path`, `fits_name`, `obsid`, `plan_id`, `designation`, `object_name`, `objname`, `filename_original`, `spid`, `fiber_id` |
| Position | `ra`, `dec`, `ra_obs`, `dec_obs`, `spra`, `spdec` |
| Time and site | `mjd`, `jd`, `obs_date_utc`, `date_creation`, `telescope`, `longitude_site`, `latitude_site` |
| LAMOST classification | `class`, `subclass`, `catalog_object_type`, `obs_type`, `fiber_type`, `tcomment`, `tsource`, `tfrom`, `obscomm` |
| Catalogue magnitudes | `magnitude_type`, `magnitude_u`, `_g`, `_r`, `_i`, `_z`, `_j`, `_h` (value 99 is replaced by NaN downstream) |
| Quality | `snr_u`, `snr_g`, `snr_r`, `snr_i`, `snr_z`, `seeing`, `redshift`, `redshift_error`, `radial_velocity_corr`, `heliocentric_correction` |
| Instrument and reduction | `author`, `data_version`, `pipeline_version`, `focus_mm`, `x_value_mm`, `y_value_mm`, `offset`, `offset_v`, `fibermas`, `scamean`, `slit_mod`, `skychi2`, `schi2min`, `schi2max`, `nstd`, `fstar`, `nskies`, `sflatten`, `pcaskysb`, `wfit_type`, `coeff0`, `coeff1`, `crval1`, `cd1_1`, `crpix1`, `dc_flag` |

`class` is the LAMOST pipeline label (`STAR`, `GALAXY`, `QSO`); The `main_class` training target is derived later by `MasterPipeline` as the first spectral-type letter found in `subclass` (or `class`); see [Class Taxonomy](./class-taxonomy).

### Gaia DR3 columns (enriched file only)

`source_id`, `gaia_ra`, `gaia_dec`, `match_dist_arcsec`, `parallax`, `parallax_error`, `pmra`, `pmdec`, `radial_velocity`, `ruwe`, `astrometric_excess_noise`, the G/BP/RP magnitudes and fluxes, `bp_rp`, `bp_g`, `g_rp`, `phot_bp_rp_excess_factor`, `phot_variable_flag`, the GSP-Phot parameters (`teff_gspphot`, `logg_gspphot`, `mh_gspphot`, `ag_gspphot`, `ebpminrp_gspphot`, `distance_gspphot`, `lum_gspphot`, `evolstage_gspphot`) and the derived `parallax_snr` and `M_G`. Definitions: [Gaia DR3 Cross-match](./gaia-dr3).

## Quality flags

The catalogue stores quality *measurements* (`snr_*`, `ruwe`, `parallax_snr`, `match_dist_arcsec`) rather than pass/fail flags; the one exception is `is_good_ruwe`, computed later in the processing pipeline. Cuts are applied downstream; see [Quality Filters](./quality-filters).

## Known limitations

- Several columns are instrument or reduction metadata, not stellar properties. They are excluded from the classifier and from the dimensionality-reduction features (see [Physical Purity](../concepts/physical-purity)).
- Rows whose Gaia RUWE exceeds the threshold keep their LAMOST columns but have empty Gaia columns.
- Header fields absent from a FITS file appear as `UNKNOWN` (text) or NaN (numeric); consumers must handle both.

## How to load

```python
# src/tools/generate_catalog_from_fits.py
import pandas as pd

local = pd.read_csv("data/catalog/master_catalog_temp.csv", sep="|")
enriched = pd.read_csv("data/catalog/master_catalog_gaia.csv")      # comma-delimited
```

---

<RelatedPages pages={[
  { href: '/docs/astrospectro/data/feature-dataset', title: 'Feature Dataset', desc: 'The feature table joined to this catalogue', category: 'concepts' },
  { href: '/docs/astrospectro/data/quality-filters', title: 'Quality Filters', desc: 'How SNR and RUWE are used', category: 'concepts' },
  { href: '/docs/astrospectro/data/gaia-dr3', title: 'Gaia DR3 Cross-match', desc: 'Origin of the Gaia columns', category: 'concepts' },
  { href: '/docs/astrospectro/data/dataset-versions', title: 'Dataset Versions', desc: 'Which analysis used which spectra', category: 'concepts' },
  { href: 'https://github.com/PhD-Brown/AstroSpectro/blob/main/src/tools/generate_catalog_from_fits.py', title: 'Source — generate_catalog_from_fits.py', desc: 'Header-to-CSV catalogue builder', category: 'external' },
]} />
