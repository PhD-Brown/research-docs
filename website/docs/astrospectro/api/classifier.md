---
title: Classifier API
description: API reference for src/pipeline/classifier.py — SpectralClassifier, CollinearityFilter and ThresholdTunedClassifier, from a features table to a persisted model with JSON metadata.
sidebar_position: 3
---

{/* facts: aucun chiffre de run — signatures et défauts relus dans AstroSpectro/src/pipeline/classifier.py */}

# Classifier API

`src/pipeline/classifier.py` wraps the whole supervised step: label construction, cleaning, feature selection, imputation and scaling, optional class-imbalance handling, hyper-parameter search, evaluation and persistence. The defaults documented below are those of the code; the settings of the reference run are described in [Classification](../pipeline/classification.md) and in the [Model Card](../science/model-card.mdx).

```python
from pipeline.classifier import SpectralClassifier, CollinearityFilter, ThresholdTunedClassifier
```

---

## SpectralClassifier

### Constructor

```python
SpectralClassifier(
    model_type="XGBoost", prediction_target="main_class",
    use_feature_selection=True, selector_threshold="median", selector_model="xgb",
    selector_n_estimators=200, random_state=42,
    imputer_strategy="median", scaler_type="standard",
    var_threshold=0.0, corr_threshold=0.98,
    use_pca=False, pca_components=0.99,
    sampler=None, tune_thresholds=False, threshold_metric="f1_macro",
)
```

| Parameter | Default | Description |
|---|---|---|
| `model_type` | `"XGBoost"` | Final model: `"XGBoost"`, `"RandomForest"`, `"SVM"`, `"ExtraTrees"`, `"LogRegOVR"`, `"KNN"`, `"MLP"`, `"NaiveBayes"`, `"LDA"`, `"QDA"`, `"CatBoost"`, `"LightGBM"` or `"SoftVoting"` (`"CatBoost"` and `"LightGBM"` raise `ImportError` if their package is missing). The constructor docstring lists only the first two; `_build_estimator` accepts all thirteen. |
| `prediction_target` | `"main_class"` | `"main_class"` (first letter of `subclass`), `"sub_class_top25"` (the 25 most frequent sub-classes) or `"sub_class_bins"` (`X_early` / `X_late` bins for A, F, G, K, M). Any other value raises `ValueError`. |
| `use_feature_selection` | `True` | Enable `SelectFromModel`. |
| `selector_threshold` | `"median"` | Selection threshold (`"median"`, `"mean"`, `"0.5*mean"`…). |
| `selector_model` | `"xgb"` | Estimator used for selection: `"xgb"` or `"rf"`. |
| `selector_n_estimators` | `200` | Trees or boosting rounds of the selector. |
| `random_state` | `42` | Seed. |
| `imputer_strategy` | `"median"` | `"median"`, `"mean"`, `"most_frequent"`, `"knn"` (`KNNImputer`, neighbours set by `knn_imputer_k`, default 5) or `"none"`. |
| `scaler_type` | `"standard"` | `"standard"`, `"robust"` or `"none"`. The SVM always gets a standard scaler. |
| `var_threshold`, `corr_threshold` | `0.0`, `0.98` | Parameters of [`CollinearityFilter`](#collinearityfilter). |
| `use_pca`, `pca_components` | `False`, `0.99` | Optional PCA step inside the pipeline. |
| `sampler` | `None` (stored as `"none"`) | Oversampler: `"smote"`, `"borderline"`, `"smoteenn"` or `"adasyn"`. Needs `imbalanced-learn`; an unknown name is disabled with an info message. |
| `tune_thresholds`, `threshold_metric` | `False`, `"f1_macro"` | Per-class threshold tuning with [`ThresholdTunedClassifier`](#thresholdtunedclassifier). |

**Attributes after training**

| Attribute | Description |
|---|---|
| `feature_names_used` | Candidate feature names detected during preparation. |
| `selected_features_` | Subset kept by the selector, or `None`. |
| `best_estimator_` | Final pipeline from the hyper-parameter search. |
| `model_pipeline` | Full pipeline (preprocessing + estimator), used for prediction. |
| `label_encoder` | `LabelEncoder` (used with XGBoost), or `None`. |
| `class_labels` | Class labels in encoder order. |
| `best_params_` | Best hyper-parameters (read by `save_model` when present). |

### `train_and_evaluate(features_df, ...)`

Runs the full session: cleaning, `X`/`y` preparation, optional selection, search, final fit and evaluation on the held-out set.

```python
clf = SpectralClassifier(model_type="XGBoost", prediction_target="main_class")
clf, cols, X, y, groups = clf.train_and_evaluate(features_df, spectro_only=True)
```

| Parameter | Default | Description |
|---|---|---|
| `features_df` | — | Features plus metadata columns; must contain `subclass`. |
| `test_size` | `0.21` | Held-out fraction. |
| `n_estimators` | `300` | Trees or iterations of the final estimator. |
| `search` | `None` | `"grid"` (`GridSearchCV`), `"random"` (`RandomizedSearchCV`) or none. |
| `cv_folds` / `scoring` | `5` / `"accuracy"` | Cross-validation folds and scoring metric of the search. |
| `n_iter` | `80` | Iterations of the randomised search. |
| `param_grid`, `param_distributions`, `param_overrides` | `None` | Search spaces and forced estimator parameters. |
| `early_stopping`, `early_stopping_rounds`, `val_size` | `False`, `50`, `0.15` | Early stopping on a validation split. |
| `use_groups`, `group_col` | `False`, `None` | Group-aware splitting. |
| `use_balanced_weights` | `True` | Inverse-frequency sample weights. |
| `class_weight_mode`, `class_weight_alpha` | `None`, `1.0` | Weighting method and exponent. |
| `weight_col`, `weight_norm`, `weight_gamma` | `None`, `"minmax"`, `1.0` | Custom per-sample weights. |
| `calibrate_probs`, `calibration_method`, `calibrate_cv`, `calibrate_holdout_size` | `False`, `"sigmoid"`, `3`, `0.0` | Post-hoc probability calibration (`"sigmoid"` or `"isotonic"`). |
| `repeated_cv`, `cv_repeats` | `False`, `1` | Repeated stratified cross-validation. |
| `imputer_strategy`, `knn_imputer_k`, `scaler_type` | `None`, `5`, `None` | Override the instance values for this session. |
| `selector_method`, `mi_top_k` | `None`, `None` | Alternative selection (for example `"rfecv"`, mutual information). |
| `sampler`, `var_threshold`, `corr_threshold`, `use_pca`, `pca_components` | `None` | Override the instance values for this session. |
| `tune_thresholds`, `threshold_metric` | `None` | Override the instance values for this session. |
| `exclude_classes` | `None` | Labels removed after label creation (for example `"s"` for `sdK2`). |
| `spectro_only` | `False` | Additionally drops every column whose name starts with a non-spectroscopic prefix (`parallax`, `pmra`, `pmdec`, `ruwe`, `phot_`, `bp_rp`, `bp_g`, `g_rp`, `radial_velocity`, `rv_`, `teff`, `logg`, `fe_h`, `alpha_fe`, `dist_`, `v_`, `J_`, `H_`, `K_`, `l_`, `b_`). The rule works on names only: see the note on leakage below and [Spectro-only mode](../concepts/spectro-only-mode.md). |

**Returns** `(self, cols_for_report, X, y, groups)`: the trained instance, the columns used, the feature matrix before the split, the label vector, and the group array or `None`.

**Cleaning rules** applied before training:

- rows whose label is null or in `["U", "n", "N", "O", "OTHER"]` are removed;
- labels in `exclude_classes` are removed;
- classes with fewer than 10 samples are dropped;
- fewer than 20 rows left after cleaning stops the session.

### `evaluate(X_test, y_test)`

Predicts with `model_pipeline`, decodes the labels if an encoder is used, and **prints** the classification report and the confusion matrix. It returns `None`.

### `save_model(path="model.pkl", trained_on_file=None, extra_info=None)`

Pickles the object with `joblib` and writes a JSON file next to it. The metadata file is named after the model file **without its extension**: `model.pkl` gives `model_meta.json`.

The JSON contains the UTC save time, the versions of Python, NumPy, scikit-learn and XGBoost, `model_type`, `prediction_target`, `spectro_only`, `best_params_`, `class_labels`, `feature_names_used`, `selected_features_` and `trained_on_file`; `extra_info` is merged on top.

### `SpectralClassifier.load_model(path="model.pkl")`

Static method. Loads the pickle with `joblib`, prints the path of the metadata file if it exists, and returns the `SpectralClassifier`.

```python
clf = SpectralClassifier.load_model("data/models/spectral_classifier_xgboost.pkl")
proba = clf.model_pipeline.predict_proba(X_new)   # X_new: same feature columns as at training
labels = clf.label_encoder.inverse_transform(proba.argmax(axis=1))
```

---

## CollinearityFilter

A scikit-learn transformer for DataFrames. `fit` first drops columns whose variance is below `var_threshold` (skipped when it is `0.0`), fills the remaining NaN with column medians for the computation only, then drops every column whose absolute correlation with an **earlier** column exceeds `corr_threshold` (upper triangle of the correlation matrix, so the first column of each correlated group is kept). The check is skipped when `corr_threshold` is 1 or more.

```python
CollinearityFilter(var_threshold: float = 0.0, corr_threshold: float = 0.98)
```

The retained names are stored in `keep_columns_` after `fit(X, y=None)`. `transform(X)` keeps those columns.

## ThresholdTunedClassifier

Wraps an estimator that supports `predict_proba` and applies one threshold per class: prediction is `argmax(proba - thresholds)`.

```python
ThresholdTunedClassifier(base_estimator, tune=False, metric="f1_macro", grid=None, random_state=42)
```

With `tune=True`, `fit` searches the thresholds on an internal validation subset (`metric` is `"f1_macro"` or `"balanced_accuracy"`), then refits on the full training set. The learned vector is `thresholds_`.

---

## Notes

- **Import path.** Modules are imported as `pipeline.classifier` with `src/` on `sys.path` (see [Preprocessor API](./preprocessor.md)).
- **Return value on failure.** The docstring announces a tuple, but if cleaning leaves no usable data, `train_and_evaluate` returns `False`.
- **Defaults differ by entry point.** `MasterPipeline.run_training_session` and `SpectralClassifier` default to XGBoost; `MasterPipeline.run_full_pipeline` defaults to `RandomForest` (see [MasterPipeline API](./master-pipeline.md)).
- **Imbalance.** No oversampler is active unless `sampler` is set; class imbalance is handled by sample weights (`use_balanced_weights=True`) by default. SMOTE and its variants are options.
- **Leakage.** The exclusion lists of `_prepare_features_and_labels` are name-based. In the version of the code read for this page, the absolute magnitudes `M_G`, `M_BP`, `M_RP` and the extinction `ag_gspphot` match none of them, with or without `spectro_only=True`, so they remain candidate features. This is consistent with the Gaia leak documented for the reference model; see the [Data Leakage Audit](../concepts/data-leakage-audit.mdx). Check `selected_features_` after training.
- **Source.** [`src/pipeline/classifier.py`](https://github.com/PhD-Brown/AstroSpectro/blob/main/src/pipeline/classifier.py).

---

## See also

- [Classification](../pipeline/classification.md) — pipeline concept and reference configuration
- [Feature engineering API](./feature-engineer.md) — produces the input table
- [Model training guide](../guides/model-training.mdx)
