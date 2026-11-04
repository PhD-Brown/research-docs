---
title: HDBSCAN Analyzer API
description: API reference for src/dimred/hdbscan_analyzer.py — HDBSCANAnalyzer, compute_sensitivity and compute_feature_profiles, for density-based clustering of a 2D embedding and the physical profile of each cluster.
sidebar_position: 4
---

{/* facts: aucun chiffre de run — signatures et défauts relus dans AstroSpectro/src/dimred/hdbscan_analyzer.py (dimred v0.3.0) */}

# HDBSCAN Analyzer API

This module clusters a 2D embedding (normally UMAP) with HDBSCAN and describes each cluster with the mean Gaia parameters of its members. It was extracted from cells of the `phy3500_02_umap_tsne` notebook. For the clustering results and their reading, see [UMAP and HDBSCAN](../../dimred/umap-hdbscan.md).

```python
from dimred import HDBSCANAnalyzer, compute_sensitivity, compute_feature_profiles
```

The `hdbscan` package must be installed (an `ImportError` says so otherwise).

---

## HDBSCANAnalyzer

```python
HDBSCANAnalyzer(min_cluster_size=75, min_samples=20, metric="euclidean", cluster_selection_method="eom")
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `min_cluster_size` | `int` | `75` | Smallest group accepted as a cluster. |
| `min_samples` | `int` | `20` | Neighbours required for a core point. |
| `metric` | `str` | `"euclidean"` | Distance metric. |
| `cluster_selection_method` | `str` | `"eom"` | `"eom"` or `"leaf"`. |

**Attributes after `fit`**

| Attribute | Description |
|---|---|
| `clusterer_` | The fitted `hdbscan.HDBSCAN` (fitted with `prediction_data=True`). |
| `labels_` | Cluster label per point; `-1` marks noise. |
| `n_clusters_`, `n_noise_` | Number of clusters (noise excluded) and of noise points. |
| `cluster_ids_` | Sorted cluster identifiers. |
| `color_map_` | `{cluster_id: RGBA}` from the `turbo` colormap; noise is translucent grey. |

**Attributes after `fit_presentation`**: `clusterer_pres_`, `labels_pres_`, `n_clusters_pres_`, `ids_pres_`, `color_map_pres_` (`tab20` colormap).

### `fit(Z)`

Fits HDBSCAN on `Z`, an `(N, 2)` array. **Returns** `self`.

### `fit_presentation(Z, min_cluster_size=300)`

Fits a second, coarser clustering (same `min_samples`, `metric` and selection method, larger `min_cluster_size`) for figures. **Returns** the label array; it does not alter `labels_`.

### `physical_profile_table(meta, y, phys_cols=None)`

Builds a table of the mean ± standard deviation of Gaia parameters per cluster.

| Parameter | Description |
|---|---|
| `meta` | DataFrame aligned with `labels_` (same rows, same order). |
| `y` | Array of LAMOST class labels, same length. |
| `phys_cols` | List of `(column, label)` pairs. Default: `teff_gspphot`, `logg_gspphot`, `mh_gspphot`, `bp_rp`, `phot_g_mean_mag`, `distance_gspphot`. Columns absent from `meta` are skipped. |

**Returns** `(df_table, df_interp)`:

- `df_table`: one row per cluster plus a noise row, with the number of spectra, the dominant LAMOST class, and `mean ± std` strings (noise: mean only);
- `df_interp`: one row per cluster with a short text label derived from fixed thresholds (see the note below).

Raises `RuntimeError` if `fit` has not been called. The table's column names and labels are in French in the code (`Classe dom.`, `Bruit`, `Interprétation`).

### Helpers

| Method | Description |
|---|---|
| `print_physical_profile(df_table, df_interp)` | Prints both tables to the console. |
| `centroid(Z, mask)` | Mean of the rows of `Z` selected by the boolean `mask`. |
| `sensitivity_df` (property) | Always an empty DataFrame; use `compute_sensitivity` instead. |

---

## compute_sensitivity

```python
compute_sensitivity(Z, min_samples=20, min_sizes=None) -> pd.DataFrame
```

Refits HDBSCAN (`metric="euclidean"`, method `"eom"`) for each `min_cluster_size` of `min_sizes` (default `[50, 100, 150, 300, 500]`) and reports how many clusters and noise points result.

**Returns** a DataFrame with columns `min_cluster_size`, `n_clusters`, `n_noise`, `pct_noise` (percentage rounded to 2 decimals). Only `min_cluster_size` is varied: `min_samples` is held fixed.

---

## compute_feature_profiles

```python
compute_feature_profiles(paths, features_stem, Z_umap, cluster_labels) -> (df_feat, cluster_means, cluster_labels_aligned)
```

Reloads the features CSV `paths["PROCESSED_DIR"] / f"{features_stem}.csv"`, re-applies the quality filters, standardises the features, and averages them per cluster.

| Parameter | Description |
|---|---|
| `paths` | Dictionary of project paths (needs `PROCESSED_DIR`, as returned by `utils.setup_project_env()`). |
| `features_stem` | File name without extension, for example `features_<timestamp>`. |
| `Z_umap` | The embedding, used only to check that the row counts agree. |
| `cluster_labels` | HDBSCAN labels, `(N,)`. |

**Returns**

| Name | Description |
|---|---|
| `df_feat` | Filtered, unscaled features of the spectra kept. |
| `cluster_means` | DataFrame `(clusters × features)` of mean standardised features; noise excluded. |
| `cluster_labels_aligned` | Labels aligned with `df_feat`. |

The filter is: `snr_r >= 10.0` (if the column exists), the same excluded columns and non-spectroscopic prefixes as `DimRedDataLoader`, numeric columns only, more than one distinct value, at most 10 % NaN, then rows with any NaN dropped. Raises `FileNotFoundError` if the CSV is missing.

---

## Example

```python
from dimred import EmbeddingEngine, HDBSCANAnalyzer, compute_sensitivity

Z = EmbeddingEngine(method="umap").fit_transform(scores, n_pca_components=20)

hdb = HDBSCANAnalyzer(min_cluster_size=75, min_samples=20).fit(Z)
print(hdb.n_clusters_, hdb.n_noise_)

df_table, df_interp = hdb.physical_profile_table(meta, y)
hdb.print_physical_profile(df_table, df_interp)

sens = compute_sensitivity(Z, min_sizes=[50, 100, 300])
```

---

## Notes

- **Alignment.** `physical_profile_table` assumes `meta` and `y` have the same rows, in the same order, as the points clustered. `compute_feature_profiles` rebuilds its own filtered table and, if its length differs from `Z_umap`, **truncates** both to the shorter length with a warning. That is only correct if the rows were dropped at the end; check the warning in the log.
- **The text labels are rules of thumb.** `df_interp` assigns a temperature class (above 7,500 K, above 5,500 K, above 4,000 K, below), a gravity class (log g below 2.5, below 3.5, above) and a metallicity class ([M/H] below −0.8, below −0.3, above) to the **mean** of each cluster. They are fixed thresholds of the code, not a classification of the members, and the Gaia parameters are model-based estimates.
- **Clusters are exploratory.** HDBSCAN on a UMAP map depends on the embedding; see the sensitivity analysis in [Hyper-parameter sensitivity](../../dimred/sensitivity.md) before interpreting a cluster physically.
- **Source.** [`src/dimred/hdbscan_analyzer.py`](https://github.com/PhD-Brown/AstroSpectro/blob/main/src/dimred/hdbscan_analyzer.py).

---

## See also

- [Embedding API](./embedding.md) — produces the 2D map
- [Data loader API](./data-loader.md) — the filter reused by `compute_feature_profiles`
- [API Reference index](../index.md)
