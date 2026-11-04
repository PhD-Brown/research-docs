---
title: Embedding API
description: API reference for src/dimred/embedding.py — EmbeddingEngine (reproducible UMAP and t-SNE with stability report, negative control and parameter sweep) and compare_embeddings.
sidebar_position: 3
---

{/* facts: aucun chiffre de run — signatures et défauts relus dans AstroSpectro/src/dimred/embedding.py (dimred v0.3.0) */}

# Embedding API

`EmbeddingEngine` gives UMAP and t-SNE one interface, with the defaults used in the project and three checks that guard against over-reading a picture: a multi-seed stability report, a negative control on permuted data, and a one-parameter sweep. The module recommends applying it to **PCA scores** rather than to the raw matrix. For the methods and results, see [UMAP and HDBSCAN](../../dimred/umap-hdbscan.md), [t-SNE](../../dimred/tsne.md) and [Hyper-parameter sensitivity](../../dimred/sensitivity.md).

```python
from dimred import EmbeddingEngine
from dimred.embedding import compare_embeddings
```

UMAP needs `umap-learn` (an `ImportError` explains it otherwise); t-SNE uses `sklearn.manifold.TSNE`.

---

## EmbeddingEngine

```python
EmbeddingEngine(method="umap", n_components=2, random_state=42, **kwargs)
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `method` | `"umap" \| "tsne"` | `"umap"` | Algorithm. Any other value raises `ValueError`. |
| `n_components` | `int` | `2` | Output dimension. |
| `random_state` | `int` | `42` | Seed. |
| `**kwargs` | | | Passed to UMAP or t-SNE; they override the defaults below. |

**Defaults**

| Method | Parameters |
|---|---|
| UMAP | `n_neighbors=15`, `min_dist=0.1`, `metric="euclidean"`, `n_epochs=200`, `low_memory=False` |
| t-SNE | `perplexity=30`, `learning_rate="auto"`, `max_iter=1000`, `metric="euclidean"`, `init="pca"`; `n_jobs=-1` is always set |

**Attributes**: `fit_time_` (seconds of the last fit), `embedding` (property, last result), `params_used` (property, parameters of the last fit, `{}` before any fit).

### `fit_transform(X, n_pca_components=None)`

Computes the embedding of `X`, an `(N, D)` array. If `n_pca_components` is given, `X` is first truncated to its first columns (useful when `X` holds the full PCA score matrix). **Returns** an `(N, n_components)` array.

### `transform(X_new)`

Projects new points with the fitted UMAP model. Raises `RuntimeError` before `fit_transform`, and `NotImplementedError` for t-SNE, which is non-parametric.

### `stability_report(X, n_seeds=5, n_pca_components=None, metric="procrustes")`

Fits the same configuration with seeds `0 … n_seeds-1` on a random subsample of at most 5,000 points, then measures the Procrustes distance between each embedding and the one of seed 0.

**Returns** a DataFrame with columns `seed`, `procrustes_distance`, `method`. The distance of seed 0 is 0 by construction; a failed Procrustes alignment gives NaN. The code comment reads a distance below 0.05 as good stability; that threshold is a rule of thumb of the module, not a statistical test.

### `negative_control(X, n_pca_components=None)`

Shuffles each column of a copy of `X` independently (seed `random_state + 999`), which keeps the one-dimensional distributions and destroys the correlations, and embeds the result with the same configuration. **Returns** the embedding of the permuted data. Structure that persists in it is not due to the correlations of the data.

### `parameter_sensitivity(X, param_grid=None, n_pca_components=None)`

Computes one embedding per value of a single parameter. Default grids: UMAP `n_neighbors` in `[5, 15, 30, 50, 100]`, t-SNE `perplexity` in `[5, 15, 30, 50, 100]`. Only the first key of `param_grid` is used. **Returns** a `dict` `{"n_neighbors=15": Z, …}`.

### `compute_umap3d(...)` and `compute_tsne3d(...)`

Methods that factor out the 3D cells of the `phy3500_02_umap_tsne` notebook: compute a 3D embedding on a subsample (`n_subsample=20_000` by default), correlate the third axis with the physical parameters, and write Plotly figures to `figures_dir`. They take notebook-specific arguments (`scores_95`, `meta`, `y`, `figures_dir`, and `cluster_labels` for UMAP) and return a `dict`. `compute_tsne3d` raises `ImportError` without Plotly. These two methods are tied to the notebook and are not documented further here.

---

## compare_embeddings

```python
compare_embeddings(X, methods=None, n_pca_components=20, random_state=42)
```

Fits one `EmbeddingEngine` per method (default `["umap", "tsne"]`) on the first `n_pca_components` columns of `X` and returns `{"umap": Z_umap, "tsne": Z_tsne}`. The methods are computed one after the other.

---

## Example

```python
from dimred import DimRedDataLoader, PCAAnalyzer, EmbeddingEngine

loader = DimRedDataLoader(features_path, catalog_path)
X, y, meta = loader.load(spectro_only=True)
scores = PCAAnalyzer(n_components=50).fit_transform(X, loader.get_feature_names())

umap = EmbeddingEngine(method="umap", n_neighbors=30, min_dist=0.1)
Z = umap.fit_transform(scores, n_pca_components=20)

report = umap.stability_report(scores, n_seeds=5, n_pca_components=20)
Z_null = umap.negative_control(scores, n_pca_components=20)
```

---

## Notes

- **Distances are not physical.** Absolute distances in a t-SNE map are not interpretable, and UMAP preserves cluster density only partly. Read an embedding as a map of neighbourhoods and compare several seeds before drawing a conclusion.
- **Stability uses a subsample.** `stability_report` works on at most 5,000 points, whatever the size of `X`, and the seed also changes the UMAP random initialisation.
- **Seeds.** Every embedding uses `random_state` (default 42). Run `stability_report` to see how much the layout still changes from one seed to another.
- **Docstring versus code.** The docstring of `parameter_sensitivity` lists `n_neighbors` 15, 30, 50, 100; the code also includes 5, and the same for `perplexity`. The page follows the code.
- **Source.** [`src/dimred/embedding.py`](https://github.com/PhD-Brown/AstroSpectro/blob/main/src/dimred/embedding.py).

---

## See also

- [PCA analyzer API](./pca-analyzer.md) — produces the scores
- [HDBSCAN analyzer API](./hdbscan-analyzer.md) — clusters an embedding
- [Dimensionality reduction comparison](../../dimred/comparison.md)
