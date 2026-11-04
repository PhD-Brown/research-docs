---
title: PCA Analyzer API
description: API reference for src/dimred/pca_analyzer.py — PCAAnalyzer, a scikit-learn PCA wrapper oriented towards physical interpretation (variance, loadings, correlations with stellar parameters, reconstruction error).
sidebar_position: 2
---

{/* facts: aucun chiffre de run — signatures relues dans AstroSpectro/src/dimred/pca_analyzer.py (dimred v0.3.0) */}

# PCA Analyzer API

`PCAAnalyzer` wraps `sklearn.decomposition.PCA` and adds the questions asked in this project: how many components reach a variance threshold, which features dominate each axis, which stellar parameters each axis correlates with, and how well the first components reconstruct a spectrum. The class computes only: figures are drawn by `DimRedVisualizer`. For the results, see [PCA](../../dimred/pca.mdx).

```python
from dimred import PCAAnalyzer
```

---

## Constructor

```python
PCAAnalyzer(n_components=50, random_state=42, svd_solver="auto")
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `n_components` | `int \| float \| "mle"` | `50` | Number of components, fraction of variance to keep (float in (0, 1)), or `"mle"`. |
| `random_state` | `int` | `42` | Seed, used by scikit-learn when the solver is randomised. |
| `svd_solver` | `str` | `"auto"` | `"auto"`, `"full"` or `"randomized"`. |

---

## Fitting

### `fit(X, feature_names=None)`

Fits the PCA on `X`, an `(N, D)` array that should already be centred and scaled (a `StandardScaler`, as done by [`DimRedDataLoader`](./data-loader.md)). Stores `X` for later computations and the feature names (`f0`…`f{D-1}` if none are given). **Returns** `self`.

### `fit_transform(X, feature_names=None)`

`fit`, then returns the scores `(N, K)`.

### `transform(X)`

Projects new data on the fitted components. Raises `RuntimeError` if the analyzer is not fitted.

---

## Variance

| Member | Returns | Description |
|---|---|---|
| `explained_variance_ratio` (property) | `np.ndarray` | Fraction of variance of each component. |
| `cumulative_variance` (property) | `np.ndarray` | Cumulative sum of the above. |
| `n_components_for_variance(threshold=0.95)` | `int` | Smallest number of components whose cumulative variance reaches `threshold`. Relies on the fitted components only: if fewer than the needed components were kept, the result is the number kept plus one. |
| `variance_summary()` | `pd.DataFrame` | Columns `PC`, `variance_individuelle`, `variance_cumulee`, `valeur_propre` (the column names are in French in the code). |

---

## Loadings

| Member | Returns | Description |
|---|---|---|
| `loadings` (property) | `np.ndarray` `(n_components, n_features)` | Eigenvectors in feature space (`components_`). |
| `loadings_dataframe()` | `pd.DataFrame` | Features as rows, `PC1`, `PC2`… as columns. |
| `top_features_per_pc(pc_idx=0, n_top=10)` | `pd.DataFrame` | Columns `feature`, `loading`, `abs_loading`, `PC`; sorted by absolute loading. `pc_idx` is 0-based. |
| `loadings_family_breakdown(feature_names=None, pc_indices=(0, 1))` | `dict` | Normalised squared loadings summed per spectroscopic family, for each requested component. The family of a feature is the first group, in this order, whose regular expression matches its name: Balmer, calcium, magnesium, iron and other metals, sodium, titanium and molecules, Sr/Ba, continuum, line profiles, Lick and synthetic indices, peak detection, other. The matching is by name, so `CaH` features fall under calcium. |

---

## Physical interpretation

### `correlations_with_params(meta, scores=None, method="spearman", n_pcs=10)`

Correlates the scores of the first `n_pcs` components with the numeric columns of `meta` (rows in the same order as `X`).

| Parameter | Default | Description |
|---|---|---|
| `meta` | — | DataFrame of physical parameters (`teff_gspphot`, `logg_gspphot`, `mh_gspphot`, `bp_rp`…). |
| `scores` | `None` | Scores `(N, K)`; if `None`, recomputed from the stored `X`. |
| `method` | `"spearman"` | `"spearman"` or `"pearson"`. |
| `n_pcs` | `10` | Number of components analysed. |

**Returns** a DataFrame `(n_pcs, n_params)` of correlation coefficients.

### `class_separation(X, y, n_pcs=5)`

For each class and each of the first `n_pcs` components: count, mean, standard deviation, median and quartiles of the scores. **Returns** a DataFrame indexed by `(classe, PC)`.

---

## Reconstruction

| Method | Returns | Description |
|---|---|---|
| `reconstruction_error(X, n_components=None)` | `np.ndarray` `(N,)` | Per-sample mean squared error when only the first `n_components` components are used (`None` = all). |
| `reconstruction_error_vs_n(X, n_range=None)` | `pd.DataFrame` | Columns `n_components`, `mse_mean`, `mse_std`. Default range: 1 to `min(n_components, 50)`. |

---

## Low-level access and persistence

| Member | Description |
|---|---|
| `sklearn_pca` (property) | The underlying `sklearn.decomposition.PCA`. |
| `mean_` (property) | Estimated mean, for manual reconstruction. |
| `feature_names_` | Feature names given to `fit`. |
| `save(path)` | Writes the fitted PCA and the feature names with `joblib`. |
| `PCAAnalyzer.load(path)` | Class method; rebuilds an analyzer from a file written by `save`. The training matrix is not saved, so `correlations_with_params` then needs explicit `scores`. |

---

## Example

```python
from dimred import DimRedDataLoader, PCAAnalyzer

loader = DimRedDataLoader(features_path, catalog_path)
X, y, meta = loader.load(spectro_only=True)
pca = PCAAnalyzer(n_components=50, random_state=42)
scores = pca.fit_transform(X, feature_names=loader.get_feature_names())

k95 = pca.n_components_for_variance(0.95)
corr = pca.correlations_with_params(meta[["teff_gspphot", "logg_gspphot", "mh_gspphot"]], scores)
print(pca.top_features_per_pc(pc_idx=0, n_top=10))
```

---

## Notes

- **Threshold beyond the fitted range.** `n_components_for_variance` uses `np.searchsorted` on the cumulative curve; if the threshold is never reached within the components kept, it returns `len(curve) + 1`, which is larger than the number of fitted components. Fit with enough components (or a float `n_components`) before asking for a high threshold.
- **Scaling.** The class does not scale. Feed it standardised data.
- **Correlations are exploratory.** A correlation between a score and a Gaia parameter describes the dataset, not a causal link; Gaia parameters are model-based estimates.
- **Source.** [`src/dimred/pca_analyzer.py`](https://github.com/PhD-Brown/AstroSpectro/blob/main/src/dimred/pca_analyzer.py).

---

## See also

- [Data loader API](./data-loader.md) — produces `X`, `y`, `meta`
- [Embedding API](./embedding.md) — usually applied to the PCA scores
- [PCA results](../../dimred/pca.mdx) — what the PCA of the PHY-3500 · G1 · 43,019 spectra dataset shows
