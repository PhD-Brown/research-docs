---
title: Acknowledgements
description: Thanks to the supervisors, the survey teams (LAMOST, Gaia) and the open-source libraries that AstroSpectro is built on, with the standard acknowledgement texts for the data.
sidebar_position: 5
---

{/* facts: aucun chiffre de run — rôles des bibliothèques relus dans AstroSpectro/src ; contenu migré de docs/_archive/community/acknowledgments.mdx, complété (Gaia, astroquery, PyTorch, UMAP, HDBSCAN, SHAP, W&B) */}

# Acknowledgements

AstroSpectro stands on public data and on open-source software. Thank you to everyone who makes them available.

---

## Supervisory support

- **Prof. Antoine Allard** (Université Laval) — supervision of the PHY-3500 course project
- **Prof. Carmelle Robert** (Université Laval) — astrophysics guidance

---

## Data

### LAMOST

The spectra come from the data releases of the [LAMOST collaboration](http://www.lamost.org/public/) (Guo Shou Jing Telescope), operated by the National Astronomical Observatories of the Chinese Academy of Sciences. Acquiring, reducing and publishing millions of spectra is a large effort, and this work would not exist without it. See [LAMOST DR5](../data/lamost-dr5.mdx).

### Gaia

The stellar parameters, photometry and astrometry used to label and interpret the spectra come from the ESA **Gaia** mission, processed by the Gaia Data Processing and Analysis Consortium (DPAC). See [Gaia DR3](../data/gaia-dr3.md).

### CDS

Cross-matching uses the **CDS XMatch** service of the Centre de Données astronomiques de Strasbourg, and the `astroquery` interface to the Gaia archive.

### Standard acknowledgement texts

If you publish work that uses these data, use the wording requested by the data providers. Check the current text on the LAMOST and Gaia web sites before reuse; the texts below are the standard ones at the time of writing.

> Guoshoujing Telescope (the Large Sky Area Multi-Object Fiber Spectroscopic Telescope LAMOST) is a National Major Scientific Project built by the Chinese Academy of Sciences. Funding for the project has been provided by the National Development and Reform Commission. LAMOST is operated and managed by the National Astronomical Observatories, Chinese Academy of Sciences.

> This work has made use of data from the European Space Agency (ESA) mission Gaia (https://www.cosmos.esa.int/gaia), processed by the Gaia Data Processing and Analysis Consortium (DPAC, https://www.cosmos.esa.int/web/gaia/dpac/consortium). Funding for the DPAC has been provided by national institutions, in particular the institutions participating in the Gaia Multilateral Agreement.

---

## Software

| Library | Used for |
|---|---|
| [NumPy](https://numpy.org/), [pandas](https://pandas.pydata.org/) | Numerical and tabular data throughout the pipeline. |
| [SciPy](https://scipy.org/) | Peak detection (`find_peaks`), Savitzky–Golay smoothing, Procrustes analysis. |
| [Astropy](https://www.astropy.org/), [specutils](https://specutils.readthedocs.io/) | Reading FITS files, units, coordinates, equivalent widths and FWHM. |
| [astroquery](https://astroquery.readthedocs.io/) | Queries to the Gaia archive. |
| [scikit-learn](https://scikit-learn.org/) | Pipelines, preprocessing, PCA, cross-validated search, metrics, t-SNE. |
| [XGBoost](https://xgboost.readthedocs.io/) | The reference classifier. LightGBM and CatBoost are optional alternatives. |
| [imbalanced-learn](https://imbalanced-learn.org/) | Optional oversampling (SMOTE and variants). |
| [SHAP](https://shap.readthedocs.io/) | Feature-attribution analysis. |
| [PyTorch](https://pytorch.org/) | The spectral autoencoder. |
| [umap-learn](https://umap-learn.readthedocs.io/), [HDBSCAN](https://hdbscan.readthedocs.io/) | Non-linear embedding and density clustering. |
| [Matplotlib](https://matplotlib.org/), [seaborn](https://seaborn.pydata.org/), [Plotly](https://plotly.com/python/) | Static and interactive figures. |
| [Jupyter](https://jupyter.org/), [ipywidgets](https://ipywidgets.readthedocs.io/) | Notebooks and the interactive training runner. |
| [joblib](https://joblib.readthedocs.io/) | Model persistence and parallel loading. |
| [Streamlit](https://streamlit.io/) | The visualisation application. |
| [Weights & Biases](https://wandb.ai/) | Optional experiment tracking. |
| [Docusaurus](https://docusaurus.io/) | This documentation site. |

...and many other packages that these depend on.

---

## See also

- [Community](./index.md)
- [Citing AstroSpectro](./citing.md)
