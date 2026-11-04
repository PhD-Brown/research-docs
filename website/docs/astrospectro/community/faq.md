---
title: FAQ
description: Answers to the questions most often asked about AstroSpectro — data and surveys, spectro_only, model choice, class imbalance, reproducing the reference run, and how to read the SHAP result.
sidebar_position: 4
---

import RunFact from '@site/src/components/RunFact';
import GaiaLeakNote from '@site/src/components/GaiaLeakNote';

{/* facts: runs.json (clé « classifier » : metrics, n, hyperparameters, stack, class_filter, trained_on_file, md5, notes ; clé « shap » : metrics.physical_share, gaia_photometric_share, top30_physical, n_features ; clé « pca » : n) · G1 + G2 · _facts/astrospectro/data/reports/last_config_used.json (config du run v7, citée comme telle) */}

# FAQ

If your question is not here, [open an issue](https://github.com/PhD-Brown/AstroSpectro/issues/new): the answer may help others.

---

## Data

### Can I use AstroSpectro with SDSS or another survey?

Not without changes. The reader [`SpectraPreprocessor.load_spectrum`](../api/preprocessor.md) expects the LAMOST DR5 FITS layout: flux in row 0 of the data array, inverse-variance in row 1, and the wavelength axis rebuilt from the header keywords `COEFF0` and `COEFF1`. Another survey needs a reader that returns the same three arrays `(wavelength, flux, invvar)`.

Past that point, the feature extractor measures lines at fixed wavelengths (see [Peak detection](../pipeline/peak-detection.md)) and assumes the spectral range of LAMOST; coverage, resolution and flux calibration of another survey change what the features mean, and a model trained on LAMOST should not be applied to it without a check. Multi-survey support is on the [Roadmap](./roadmap.md); nothing in the repository handles it today.

### How much data do I need to download?

Much less than the survey. The pipeline works in **batches**: `MasterPipeline.select_batch` takes 500 spectra by default and skips spectra already listed in `trained_spectra.csv`, so you can grow a dataset step by step. The downloader caps what it fetches with `limit_plans` (number of observation plans) and `max_spectra` (total spectra); on the command line, `--limit` and `--max-spectres`. See [Downloading data](../guides/downloading-data.mdx).

For scale: the reference classifier run processed <RunFact run="classifier" path="n.processed" format="int" /> spectra. You do not need that to try the pipeline, but small batches give noisy metrics, especially for rare classes.

### Why do the pages quote two different numbers of spectra?

Two generations of data exist and they are never mixed on this site.

- The dimensionality-reduction pages use the PHY-3500 dataset (**G1**): <RunFact run="pca" path="n" format="int" /> spectra, labelled "PHY-3500 · G1".
- The reference classifier was trained on a later, larger extraction (**G2**) of <RunFact run="classifier" path="n.processed" format="int" /> processed spectra.

A figure from one generation says nothing about the other. See [Dataset versions](../data/dataset-versions.md).

---

## Technical

### Why both notebooks and Python scripts in `src/`?

By design. The modules in `src/` hold the logic: classes that can be tested, imported and reused. The notebooks orchestrate those modules, display results and record experiments. Keeping the two apart means that a notebook cell is never the only place where something is implemented. See [Project structure](../concepts/project-structure.mdx).

### Why `spectro_only=True` instead of all columns?

The feature table contains columns that do not come from the spectrum itself: coordinates, redshift, SNR, observation and instrument metadata, and Gaia photometry and astrometry. A model that uses them can score well without reading the spectrum. In `spectro_only` mode, `SpectralClassifier` and `DimRedDataLoader` drop those columns, so that the model has to rely on what is measured in the flux. See [Spectro-only mode](../concepts/spectro-only-mode.md).

:::warning[The mode removes columns by name]
The original rule was a list of name prefixes, and columns derived from Gaia that did not match it stayed in the candidate set (this is how the reference run v6 kept four of them). Fixed in the code with an explicit list of Gaia/photometric columns (the 22 columns absent from v7). v7 was trained with this fix, but no complete spectro-only reference run exists yet.

<GaiaLeakNote />

Check `selected_features_` after every training.
:::

---

## Machine learning

### Why XGBoost and not a neural network?

Three reasons, in order of weight:

1. **The input is tabular.** The model reads a table of measured quantities (prominences, widths, equivalent widths, indices), not an image or a raw sequence. Gradient-boosted trees are a standard and strong choice for that kind of input.
2. **Interpretability.** Feature importances and SHAP values are directly available, which is what the physical reading of the result relies on (see below).
3. **Cost of iteration.** Training is fast enough to repeat many experiments.

This is a choice for this stage of the project, not a claim that a network could not do better. A 1D convolutional network on the raw flux is on the [Roadmap](./roadmap.md); it is not implemented in the repository.

### How is class imbalance handled?

At three levels, all visible in [`SpectralClassifier`](../api/classifier.md):

- **Filtering.** Classes with fewer than 10 samples are dropped, and `exclude_classes` removes chosen labels. The reference run excluded <RunFact run="classifier" path="class_filter.classes" />.
- **Sample weights.** `use_balanced_weights=True` is the default and gives rare classes more weight.
- **Oversampling.** SMOTE, Borderline-SMOTE, SMOTE-ENN and ADASYN are available through the `sampler` argument (they need `imbalanced-learn`). The default is no oversampling. In the last configuration file written by the pipeline in the exported pack (`last_config_used.json`, which belongs to the v7 validation run, not to the reference run), the sampler is off and the weights are on.

The report of the reference run does not record the sampler or the weighting it used; do not infer them from another run.

### How do I reproduce the reference result?

The reference result is the balanced accuracy of the reference XGBoost run, <RunFact run="classifier" path="metrics.balanced_accuracy" format="pct" /> on its held-out test set of <RunFact run="classifier" path="n.test" format="int" /> spectra, for the main-class labels (balanced accuracy, not plain accuracy).

<GaiaLeakNote />

What the run files let you set up:

1. **Environment.** Python <RunFact run="classifier" path="stack.python" />, scikit-learn <RunFact run="classifier" path="stack.scikit_learn" />, XGBoost <RunFact run="classifier" path="stack.xgboost" />.
2. **Data.** The features table <code><RunFact run="classifier" path="trained_on_file" /></code>, produced by the pipeline from LAMOST DR5 spectra cross-matched with Gaia DR3 (the table is not distributed with this documentation). The run trained on <RunFact run="classifier" path="n.train" format="int" /> spectra and tested on <RunFact run="classifier" path="n.test" format="int" />.
3. **Labels and filter.** `prediction_target="main_class"`, excluding the labels listed above.
4. **Model.** `model_type="XGBoost"`, with <code>random_state=<RunFact run="classifier" path="hyperparameters.random_state" /></code>, <code>n_estimators=<RunFact run="classifier" path="hyperparameters.n_estimators" /></code>, <code>max_depth=<RunFact run="classifier" path="hyperparameters.max_depth" /></code>, <code>learning_rate=<RunFact run="classifier" path="hyperparameters.learning_rate" /></code>, <code>subsample=<RunFact run="classifier" path="hyperparameters.subsample" /></code> and <code>colsample_bytree=<RunFact run="classifier" path="hyperparameters.colsample_bytree" /></code>. Pass them through `param_overrides` (`train_and_evaluate`) or `base_params` (`MasterPipeline.run_training_session`).
5. **Check.** The saved model of the run has the MD5 <code><RunFact run="classifier" path="md5" /></code>. Run notes: "<RunFact run="classifier" path="notes" />".

Two limits apply. The run files do not give every training option (see the previous answer), so an exact bit-for-bit match is not guaranteed; and the result depends on the Gaia-derived columns noted above. Earlier versions of this site quoted the score of a previous model; the figure of reference is the one on this page, which is also the one in the [Model Card](../science/model-card.mdx).

### What exactly does the SHAP result say?

**Result.** For the reference model, which selected <RunFact run="shap" path="n_features" format="int" /> features, spectroscopic features carry <RunFact run="shap" path="metrics.physical_share" format="pct" /> of the total mean absolute SHAP value and Gaia/photometric features <RunFact run="shap" path="metrics.gaia_photometric_share" format="pct" />; <RunFact run="shap" path="metrics.top30_physical" format="int" /> of its 30 most important features are spectroscopic.

**Interpretation.** The model relies mostly on line-based features rather than on the photometric columns. The percentage is a share of the **summed importance**, not a fraction of the top 30 features, and the two numbers must not be swapped.

**Caveats.** SHAP values describe what the model uses, not what causes a stellar type. The model still uses a few Gaia-derived columns, so the picture is not purely spectroscopic.

<GaiaLeakNote />

Details, rankings and figures: [SHAP interpretability](../science/shap-interpretability.md).

---

## See also

- [Community](./index.md)
- [Contributing](./contributing.md)
- [Model Card](../science/model-card.mdx)
- [Data Leakage Audit](../concepts/data-leakage-audit.mdx)
