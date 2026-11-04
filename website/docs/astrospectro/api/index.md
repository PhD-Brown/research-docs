---
title: API Reference
description: Technical reference for the AstroSpectro Python modules — pipeline classes and the dimred sub-package — with the signatures and defaults of the current code.
sidebar_position: 8
---

{/* facts: aucun chiffre de run — contenu fusionné depuis l'ancien docs/api/index.mdx (FR), signatures relues dans AstroSpectro/src */}

# API Reference

This section describes the classes and functions of the [AstroSpectro code repository](https://github.com/PhD-Brown/AstroSpectro) in enough detail to use them from your own scripts or to contribute to them. Each page follows the same layout: overview, signature, parameters, returns, methods, example, notes.

These pages document **what the code does today**. They are checked against `src/` and are not generated from the docstrings, so where a docstring and the code disagree, the page follows the code and says so. For the reasoning behind each step, follow the links to the [Concepts](../concepts/index.mdx) and [Core Pipeline](../pipeline/index.md) pages.

Modules live in `src/` and are imported without a prefix (`from pipeline.classifier import SpectralClassifier`, `from dimred import PCAAnalyzer`). Put `src/` on `sys.path`, or call `utils.setup_project_env()` as the notebooks do.

---

## Core pipeline — `src/pipeline/`

The order below is the order of execution for one spectrum, then for a training session.

| Page | Module | Main classes | Role |
|---|---|---|---|
| [Preprocessor](./preprocessor.md) | `preprocessor.py` | `SpectraPreprocessor`, `ProcessedSpectrum` | Read a LAMOST FITS file, rebuild the wavelength axis, normalise the flux, sanitise the inverse-variance. |
| [FeatureEngineer](./feature-engineer.md) | `peak_detector.py`, `feature_engineering.py` | `PeakDetector`, `FeatureEngineer`, `SpectralLineLibrary` | Detect absorption lines, compute the feature vector, add catalogue-derived columns. |
| [Classifier](./classifier.md) | `classifier.py` | `SpectralClassifier`, `CollinearityFilter`, `ThresholdTunedClassifier` | Prepare labels, select features, search hyper-parameters, evaluate, persist. |
| [MasterPipeline](./master-pipeline.md) | `master.py` | `MasterPipeline` | Orchestrate every step, from batch selection to logged artefacts. |

`processing.py` (`ProcessingPipeline`) glues the first two together with a multi-process worker; it is described in [Processing pipeline](../pipeline/processing-pipeline.md) and has no API page yet.

## Dimensionality reduction — `src/dimred/`

The sub-package exposes its public names through `dimred/__init__.py`: `from dimred import DimRedDataLoader, PCAAnalyzer, EmbeddingEngine, HDBSCANAnalyzer, …`.

| Page | Module | Main classes and functions | Role |
|---|---|---|---|
| [Data loader](./dimred/data-loader.md) | `data_loader.py` | `DimRedDataLoader`, `SpectralMatrixLoader` | Merge features and Gaia metadata, filter, scale; or build a flux matrix on a common wavelength grid. |
| [PCA analyzer](./dimred/pca-analyzer.md) | `pca_analyzer.py` | `PCAAnalyzer` | PCA with variance, loadings, correlations with physical parameters, reconstruction error. |
| [Embedding](./dimred/embedding.md) | `embedding.py` | `EmbeddingEngine`, `compare_embeddings` | Reproducible UMAP and t-SNE, stability and negative control. |
| [HDBSCAN analyzer](./dimred/hdbscan-analyzer.md) | `hdbscan_analyzer.py` | `HDBSCANAnalyzer`, `compute_sensitivity`, `compute_feature_profiles` | Density clustering on an embedding and physical profile of each cluster. |

The results obtained with these classes are in the [Dimensionality Reduction](../dimred/index.mdx) section, which is built on the PHY-3500 · G1 · 43,019 spectra dataset.

---

## Modules without a reference page yet

| Module | Public names |
|---|---|
| `dimred/autoencoder.py` | `SpectralAutoencoder`, `tester_candidat`, `latent_arithmetic` |
| `dimred/xgboost_bridge.py` | `load_and_predict` (exported as `xgboost_predict`) |
| `dimred/run_reporter.py` | `save_pca_run`, `save_umap_tsne_run`, `save_autoencoder_run` |
| `dimred/dimred_visualizer.py` | `DimRedVisualizer` |
| `tools/` | `SmartDownloader`, `SpectraManager`, `AstroVisualizer`, `DatasetBuilder`, `enrich_catalog_with_gaia`, `generate_catalog_from_fits` |

Until these pages exist, the source files carry full docstrings.

:::info[Keeping this section in sync]
The reference is written by hand and verified against the code at the date of each page. A future step could generate it from the docstrings; the discrepancies noted on the pages (for example in `MasterPipeline.run_training_session`) would then need to be fixed in the code first.
:::

---

## See also

- [Project structure](../concepts/project-structure.mdx) — where each module sits in the repository
- [Practical guides](../guides/index.mdx) — task-oriented walkthroughs
- [Contributing](../community/contributing.md) — how to propose a change to the code or the documentation
