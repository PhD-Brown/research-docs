---
title: Data Loader API
description: API reference for src/dimred/data_loader.py — DimRedDataLoader (features and Gaia metadata) and SpectralMatrixLoader (raw flux on a common wavelength grid), the inputs of PCA, UMAP, t-SNE and the autoencoder.
sidebar_position: 1
---

{/* facts: aucun chiffre de run — signatures relues dans AstroSpectro/src/dimred/data_loader.py (dimred v0.3.0) */}

# Data Loader API

`src/dimred/data_loader.py` prepares the input matrix of every dimensionality-reduction method. It has two entry points: `DimRedDataLoader` reads the engineered-features CSV and joins it to the Gaia-enriched catalogue, and `SpectralMatrixLoader` reads raw FITS files and interpolates them on a common wavelength grid. Both return a triplet `(X, y, meta)`.

For the dataset these classes were used on, see [Dataset — LAMOST DR5 × Gaia DR3 (PHY-3500)](../../dimred/data-loader.mdx). This page only documents the code.

```python
from dimred import DimRedDataLoader
from dimred.data_loader import SpectralMatrixLoader
```

---

## DimRedDataLoader

```python
DimRedDataLoader(features_path, catalog_path, merge_key="obsid", random_state=42)
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `features_path` | `str \| Path` | — | CSV of engineered features (output of the pipeline). |
| `catalog_path` | `str \| Path` | — | `master_catalog_gaia.csv`. |
| `merge_key` | `str` | `"obsid"` | Join key between features and catalogue. |
| `random_state` | `int` | `42` | Seed of the class-balancing subsample. |

**Attributes filled by `load()`**: `feature_names_` (`list[str]`), `scaler_` (`StandardScaler` or `None`), `_df_merged` (the final merged DataFrame, kept for follow-up analyses).

### `load(mode="features", snr_min=10.0, snr_band="snr_r", classes=None, scale=True, class_balance=False, n_per_class=5000, drop_nan_threshold=0.10, spectro_only=False)`

| Parameter | Default | Description |
|---|---|---|
| `mode` | `"features"` | Only `"features"` is handled here. `"spectra"` raises `NotImplementedError` and points to `SpectralMatrixLoader`. |
| `snr_min` | `10.0` | Rows with `snr_band < snr_min` are removed (the comparison keeps `>=`). If the SNR column is missing, the filter is skipped with a warning. |
| `snr_band` | `"snr_r"` | SNR column used by the filter. |
| `classes` | `None` | Keep only these values of the `class` column (`"STAR"`, `"GALAXY"`, `"QSO"`). |
| `scale` | `True` | Apply a `StandardScaler` (stored in `scaler_`). |
| `class_balance` | `False` | Randomly subsample each class to at most `n_per_class` rows. |
| `n_per_class` | `5000` | Cap per class when `class_balance=True`. |
| `drop_nan_threshold` | `0.10` | Maximum NaN fraction per feature column; columns above it are dropped. |
| `spectro_only` | `False` | Keep spectroscopic columns only (see below). |

**Returns**

| Name | Type | Description |
|---|---|---|
| `X` | `np.ndarray` `(N, D)` | Feature matrix, standardised if `scale=True`. |
| `y` | `np.ndarray` `(N,)` | Values of the `class` column. |
| `meta` | `pd.DataFrame` `(N, …)` | Gaia parameters, SNR columns, `class`, `subclass`, `ra`, `dec` and `redshift` when present, for colouring embeddings. |

**Order of operations**: read both CSV files (with a tolerant Python parser as a fallback when the C parser fails on unescaped commas), left-join the catalogue columns missing from the features table, apply the SNR filter, apply the class filter, select the feature columns, drop rows with a remaining NaN, optionally balance the classes, build `X`, `y` and `meta`, and finally scale.

**Feature column selection.** A numeric column is a feature unless it is one of the following:

- an identifier or label column (`obsid`, `fits_name`, `class`, `subclass`, `label`, `main_class`, `source_id`…);
- a Gaia metadata column (`teff_gspphot`, `logg_gspphot`, `mh_gspphot`, `bp_rp`, `phot_g_mean_mag`, `parallax`, `ruwe`, `ag_gspphot`…) or one of the five SNR columns;
- constant, or above `drop_nan_threshold` in NaN.

With `spectro_only=True` the loader also removes the instrumental columns (FITS calibration, coordinates, site and observation metadata, LAMOST quality flags) and every numeric column whose name starts with a non-spectroscopic prefix (`parallax`, `pmra`, `pmdec`, `ruwe`, `phot_`, `bp_rp`, `bp_g`, `g_rp`, `radial_velocity`, `rv_`, `teff`, `logg`, `fe_h`, `dist_`, `distance_`, `ag_gspphot`, `astrometric_`…). The code comments say this rule mirrors the one in `SpectralClassifier(spectro_only=True)`, so that unsupervised and supervised methods work on comparable features; the two prefix lists are not identical (for example only the loader lists `ag_gspphot`, `distance_` and `astrometric_`, and only the classifier lists `v_`, `J_`, `H_`, `K_`, `l_`, `b_`).

### Other methods

| Method | Returns | Description |
|---|---|---|
| `get_feature_names()` | `list[str]` | Names of the retained feature columns. Raises `RuntimeError` before `load()`. |
| `inverse_transform(X_scaled)` | `np.ndarray` | Undo the standardisation; returns the input unchanged if no scaler was fitted. |

Failures: `FileNotFoundError` if a CSV is missing (the message tells you to run the pipeline or the Gaia cross-match first).

---

## SpectralMatrixLoader

```python
SpectralMatrixLoader(fits_dir, catalog_path, wl_grid=None, n_jobs=4, random_state=42)
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `fits_dir` | `str \| Path` | — | Folder with the FITS files; searched recursively, so per-plan sub-folders are fine. |
| `catalog_path` | `str \| Path` | — | `master_catalog_gaia.csv`; its `fits_name` column must match the file names. |
| `wl_grid` | `np.ndarray \| None` | `None` | Target wavelength grid in Å. If `None`: `np.arange(WL_MIN, WL_MAX, WL_STEP)`. |
| `n_jobs` | `int` | `4` | Worker processes (joblib, `loky` backend). |
| `random_state` | `int` | `42` | Seed of the optional subsample. |

Class constants: `WL_MIN = 3690.0`, `WL_MAX = 9100.0`, `WL_STEP = 1.38` (Å). The step is described in the code as "approximately" the DR5 sampling.

### `load(n_spectra=None, snr_min=10.0, classes=None, normalize=True)`

| Parameter | Default | Description |
|---|---|---|
| `n_spectra` | `None` | Maximum number of spectra; a random subsample (seeded) if the catalogue is larger. |
| `snr_min` | `10.0` | Minimum `snr_r` (skipped if the column is absent or `snr_min <= 0`). |
| `classes` | `None` | Class filter. |
| `normalize` | `True` | Divide each interpolated spectrum by its NaN-aware median (only if the median is positive). |

**Returns** `(X, y, meta)` with `X` of shape `(N, len(wl_grid))`.

For each file the loader rebuilds the wavelength axis from `COEFF0` and `COEFF1`, then interpolates the flux linearly on the grid (NaN outside the observed range). Spectra with 20 % or more NaN after interpolation are discarded, and the remaining NaN are set to 0. A file that cannot be read yields an all-NaN row and is therefore discarded as well.

### `inspect_sample_fits(n_samples=3)`

Quick diagnostic: returns a list of text lines describing the first `n_samples` FITS files found (to be printed in a notebook).

---

## Example

```python
from dimred import DimRedDataLoader, PCAAnalyzer

loader = DimRedDataLoader(
    features_path="data/processed/features_<timestamp>.csv",
    catalog_path="data/catalog/master_catalog_gaia.csv",
)
X, y, meta = loader.load(mode="features", snr_min=10, spectro_only=True)

pca = PCAAnalyzer(n_components=50).fit(X, feature_names=loader.get_feature_names())
```

---

## Notes

- **Exclusion works on names.** Without `spectro_only`, only the columns listed above are excluded. With it, the prefix list above is added. Gaia-derived columns that match neither rule, such as the absolute magnitudes `M_G`, `M_BP`, `M_RP` created by `add_gaia_derived_features`, stay in the feature set in both modes. Whatever the mode, print `get_feature_names()` when the analysis must be purely spectroscopic. See [Spectro-only mode](../../concepts/spectro-only-mode.md).
- **Scaling.** PCA, UMAP and t-SNE assume a centred and scaled matrix; keep `scale=True` unless you do it yourself.
- **Memory.** `SpectralMatrixLoader` holds the full `N × len(wl_grid)` matrix in memory; use `n_spectra` for trials.
- **Source.** [`src/dimred/data_loader.py`](https://github.com/PhD-Brown/AstroSpectro/blob/main/src/dimred/data_loader.py).

---

## See also

- [PCA analyzer API](./pca-analyzer.md) — usual next step
- [Embedding API](./embedding.md)
- [API Reference index](../index.md)
