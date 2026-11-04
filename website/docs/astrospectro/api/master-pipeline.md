---
title: MasterPipeline API
description: API reference for src/pipeline/master.py — the MasterPipeline orchestrator, from batch selection and catalogue enrichment to training, artefact logging and the interactive runner.
sidebar_position: 4
---

{/* facts: aucun chiffre de run — signatures et défauts relus dans AstroSpectro/src/pipeline/master.py (une seule classe publique, MasterPipeline) ; valeurs numériques = défauts du code, pas des chiffres de run */}

# MasterPipeline API

`MasterPipeline` chains the steps that the notebooks run one by one: pick a batch of FITS files, build and optionally Gaia-enrich the catalogue, extract features, train a classifier, and write the model, figures and reports. For the workflow as a whole, see [Master pipeline](../pipeline/master-pipeline.md) and [Pipeline overview](../concepts/pipeline-overview.mdx).

```python
from pipeline.master import MasterPipeline
```

`src/` must be on `sys.path` (see [Preprocessor API](./preprocessor.md)). The module imports `IPython` at load time, so it must be installed even for a non-interactive run; `ipywidgets` is optional and only needed by `interactive_training_runner`.

---

## Constructor

```python
MasterPipeline(raw_data_dir, catalog_dir, processed_dir, models_dir, reports_dir, use_wandb=False)
```

| Parameter | Type | Description |
|---|---|---|
| `raw_data_dir` | `str` | Folder with the raw FITS files. |
| `catalog_dir` | `str` | Output folder of the intermediate and Gaia-enriched catalogues. |
| `processed_dir` | `str` | Output folder of the `features_<timestamp>.csv` files. |
| `models_dir` | `str` | Output folder of the serialised models. |
| `reports_dir` | `str` | Output folder of the session reports and figures. |
| `use_wandb` | `bool` | Default value of the Weights & Biases switch (see [Experiment tracking](../pipeline/experiment-tracking.md)). |

All folders except `raw_data_dir` are created if missing. The constructor also creates a `DatasetBuilder` on `raw_data_dir` and `catalog_dir`.

**Attributes**

| Attribute | Description |
|---|---|
| `builder` | `DatasetBuilder`: batch selection and the `trained_spectra.csv` log. |
| `current_batch` | Relative paths of the current batch (`list[str]`). |
| `master_catalog_df` | Current catalogue (`pd.DataFrame`). |
| `features_df` | Latest loaded or generated features (`pd.DataFrame`). |
| `master_catalog_path` | `<catalog_dir>/master_catalog_temp.csv`. |
| `gaia_catalog_path` | `<catalog_dir>/master_catalog_gaia.csv`. |
| `last_features_path` | Path of the last features CSV, or `None`. |

---

## Step methods

The steps are meant to be called in this order. Each one stores its result on the instance.

### `select_batch(batch_size=500, strategy="random")`

Asks the `DatasetBuilder` for a batch of spectra not yet listed in `trained_spectra.csv`. Returns the list of relative paths and stores it in `current_batch`.

### `generate_and_enrich_catalog(enrich_gaia=False, **gaia_kwargs)`

Builds the catalogue from the FITS headers of `current_batch` (`generate_catalog_from_fits`). With `enrich_gaia=True`, the remaining keyword arguments are forwarded to `enrich_catalog_with_gaia` and the result is written to `master_catalog_gaia.csv`; otherwise to `master_catalog_temp.csv`. Returns `None`; the result is in `master_catalog_df`. Prints an error and returns if no batch is selected. A "pending session" file lets `process_data` resume after a kernel restart without repeating the cross-match.

### `process_data()`

Runs `ProcessingPipeline` on the current catalogue and batch, adds the derived target columns, writes `features_<UTC timestamp>.csv` in `processed_dir`, and returns the DataFrame (or `None` if the catalogue is empty or nothing was produced). See [Processing pipeline](../pipeline/processing-pipeline.md).

### `load_features_from_csv(path=None, use_last=False)`

Alternative to the three steps above: loads an existing features CSV (`use_last=True` takes the most recent `features_*.csv` of `processed_dir`), rebuilds the derived targets, casts the target columns to `category`, and stores the result in `features_df`. Returns the DataFrame, or `None` after printing the error.

### `run_training_session(model_type="XGBoost", n_estimators=200, prediction_target="main_class", save_and_log=True, ...)`

Trains and evaluates a [`SpectralClassifier`](./classifier.md) on `self.features_df`, then writes the artefacts. The main parameters are listed below; the method has 58 named parameters (plus an unused `**kwargs`), most of them forwarded unchanged to `SpectralClassifier.train_and_evaluate`.

| Parameter | Default | Description |
|---|---|---|
| `model_type` | `"XGBoost"` | Estimator (see the [Classifier API](./classifier.md)). |
| `n_estimators` | `200` | Trees or iterations. |
| `prediction_target` | `"main_class"` | `"main_class"`, `"sub_class_top25"` or `"sub_class_bins"`. |
| `save_and_log` | `True` | Persist the model, report and figures. |
| `use_feature_selection`, `selector_model`, `selector_threshold`, `selector_n_estimators`, `selector_method` | `True`, `"xgb"`, `"median"`, `200`, `"sfrommodel"` | Feature selection. |
| `search`, `cv_folds`, `scoring`, `n_iter` | `None`, `3`, `"accuracy"`, `60` | Hyper-parameter search (`"grid"` or `"random"`). |
| `early_stopping`, `early_stopping_rounds`, `val_size` | `True`, `50`, `0.15` | Early stopping. |
| `test_size`, `random_state` | `0.21`, `42` | Split and seed. |
| `use_balanced_weights`, `class_weight_mode`, `class_weight_alpha` | `True`, `None`, `1.0` | Class weighting. |
| `calibrate_probs`, `calibration_method` | `False`, `"sigmoid"` | Probability calibration. |
| `sampler` | `None` | Oversampler, if any. |
| `exclude_classes` | `None` | Labels removed before training (applied through `_apply_class_filter`). |
| `spectro_only` | `False` | Spectroscopic features only. |
| `exp_name`, `notes` | `None`, `""` | Free-text identification of the run in the report. |
| `use_wandb` | `False` | Log to Weights & Biases. |
| `save_curves_roc_pr`, `save_feature_importance`, `save_confusion_png`, `save_calibration`, `export_test_predictions` | `True`, `True`, `False`, `False`, `False` | Output artefacts. |

**Returns** the trained `SpectralClassifier`, or `None` if training could not proceed (empty features, invalid `group_col`, class filter errors). Several of these failures **print a message and return** rather than raise.

### `run_full_pipeline(batch_size=500, model_type="RandomForest", n_estimators=100, prediction_target="main_class", save_and_log=True, enrich_gaia=False, **gaia_kwargs)`

One-shot chain of `select_batch`, `generate_and_enrich_catalog`, `process_data` and `run_training_session`; when `save_and_log` is true it then records the batch in `trained_spectra.csv`. It trains with the arguments above only: the other training options keep the defaults of `run_training_session`.

### `interactive_training_runner()`

Displays an `ipywidgets` interface (Jupyter or VS Code): tabs for the feature source and split, model and parameters, selection and search, weights and calibration, and artefacts; a button that calls `run_training_session` with the current settings; and a table of earlier runs. The widget values can be saved to, and reloaded from, a JSON preset file.

---

## Example

```python
from utils import setup_project_env
paths = setup_project_env(verbose=False)

from pipeline.master import MasterPipeline

mp = MasterPipeline(
    raw_data_dir=paths["RAW_DATA_DIR"],
    catalog_dir=paths["CATALOG_DIR"],
    processed_dir=paths["PROCESSED_DIR"],
    models_dir=paths["MODELS_DIR"],
    reports_dir=paths["REPORTS_DIR"],
)

# From raw spectra
mp.select_batch(batch_size=500)
mp.generate_and_enrich_catalog(enrich_gaia=False)
mp.process_data()

# Or from an existing features table
# mp.load_features_from_csv(use_last=True)

clf = mp.run_training_session(model_type="XGBoost", spectro_only=True)
```

---

## Notes

- **Two sets of defaults.** `run_full_pipeline` defaults to `RandomForest` with 100 trees. `run_training_session` defaults to XGBoost with 200 trees, 3 CV folds and early stopping on, while `SpectralClassifier.train_and_evaluate` alone defaults to 300 trees, 5 folds and no early stopping. State the arguments explicitly when you want to reproduce a run.
- **Docstring and signature disagree.** The `run_training_session` docstring lists `features_df`, `excluded_classes` and `xgb_tree_method`. The signature has none of them: the method always trains on `self.features_df`, the argument is named `exclude_classes`, and the trailing `**kwargs` is not read.
- **Presets are JSON.** The interactive runner saves widget values as JSON (`_save_preset` / `_load_preset`); there is no YAML configuration in this module.
- **Leakage.** `run_training_session` does not enable `spectro_only` by default: see [Spectro-only mode](../concepts/spectro-only-mode.md) and the [Data Leakage Audit](../concepts/data-leakage-audit.mdx).
- **Copy of the module.** `src/pipeline/` also holds a file named `master (1).py`; it is a copy and not the module documented here.
- **Source.** [`src/pipeline/master.py`](https://github.com/PhD-Brown/AstroSpectro/blob/main/src/pipeline/master.py).

---

## See also

- [Classifier API](./classifier.md)
- [Preprocessor API](./preprocessor.md)
- [Quick start guide](../guides/quick-start.mdx)
