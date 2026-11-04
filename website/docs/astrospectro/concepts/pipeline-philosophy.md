---
title: Pipeline Philosophy
description: The design goals behind AstroSpectro — physics-first features, interpretability as a requirement, leakage as a design concern, reproducible runs — and the trade-off between accuracy and physical purity, with the numbers of the runs concerned.
sidebar_position: 1
---

import RunFact from '@site/src/components/RunFact';
import GaiaLeakNote from '@site/src/components/GaiaLeakNote';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: runs.json classifier (metrics.accuracy, metrics.balanced_accuracy) and shap (metrics.physical_share) — run v6 · FACTS_INDEX §1.3 (v5 row: 20260306T020848Z, BA 0.8732) and §3 (v5 SHAP 97.9 %) · code: AS/src/pipeline/classifier.py, master.py */}

# Pipeline Philosophy

AstroSpectro is built around one idea: a classifier of stellar spectra is only useful to an astronomer if its decisions can be traced back to spectroscopy. This page states the design principles that follow, shows where each one appears in the code, and quantifies the main trade-off — accuracy versus physical purity — for the runs concerned. The principles are also summarised on the [project landing page](../index.mdx).

---

## Five principles

| # | Principle | How it shows up in the code or the process |
|---|---|---|
| 1 | **Physics first** | Features are line strengths, widths, band indices and continuum slopes computed from the spectrum itself (`FeatureEngineer`, `SpectralLineLibrary`); see [Physical Meaning of Features](../science/feature-physics) |
| 2 | **Interpretability is a goal, not an afterthought** | SHAP analysis and physical validation are part of the workflow, not an optional report; see [SHAP Interpretability](../science/shap-interpretability) and [Scientific Validation](../science/validation) |
| 3 | **Leakage is a design concern** | `spectro_only` mode excludes SNR, instrumental, positional and Gaia columns; a [Data Leakage Audit](./data-leakage-audit) documents what remains |
| 4 | **Every run is reproducible** | Session reports with hyper-parameters, feature lists and model MD5; fixed seeds; opt-in W&B logging; see [Reproducibility](./reproducibility) |
| 5 | **Claims are graded** | Findings carry an evidence level in the Claims Register ("suggests" vs "confirms") |

### Why classical models for the classifier

The classifier module supports several tabular models (XGBoost, Random Forest, SVM, Extra Trees, logistic regression, k-NN, among others), and the reference runs use gradient-boosted trees. The only neural network in the project is the [autoencoder](../dimred/autoencoder), used for unsupervised reduction. The repository does not contain a documented comparison between gradient boosting and deep networks for this task, so this page does not claim one is better; the practical argument is that tree models work on a table of named physical features, which keeps SHAP attributions directly readable.

---

## The trade-off: accuracy versus physical purity

Removing non-spectroscopic columns can reduce what a model can exploit, but makes its decisions attributable to spectra. Two numbers are used on the site for this, and they come from **different runs**:

| Run | Spectra processed | Balanced accuracy | Share of SHAP importance from physical features |
|---|---:|---:|---:|
| v5 · `20260306T020848Z` (100k, `spectro_only`, isotonic calibration) | 99,999 | 87.3 % | 97.9 % (analysis `features_20260305T174836Z`) |
| **v6 · `20260522T161236Z`** (reference, G2) | <RunFact run="classifier" path="n.processed" format="int" /> | <RunFact run="classifier" path="metrics.balanced_accuracy" format="pct" /> | <RunFact run="shap" path="metrics.physical_share" format="pct" /> |

<GaiaLeakNote />

Three precisions avoid recurrent misreadings:

- The "87 %" quoted in many places is the **balanced accuracy of v5**; the reference run reaches an accuracy of <RunFact run="classifier" path="metrics.accuracy" format="pct" /> and a balanced accuracy of <RunFact run="classifier" path="metrics.balanced_accuracy" format="pct" />. Always say which metric and which run.
- The "physical share" is the fraction of the **summed |SHAP|** attributed to features classified as physical, not the fraction of the top-30 features.
- A physical share of 100 % does not describe any published run. For v6 the remainder is Gaia and photometric features, which is exactly what the leakage audit documents.

So the trade-off is not "87 % versus 100 % purity": it is a few percent of attribution that remains non-spectroscopic in the reference run, which is the reason the project keeps a leakage audit and does not present the reference metrics as purely spectroscopic.

---

## Consequences for contributors

- Adding a feature means giving it a physical definition and a place in a family before it enters a model.
- A new run is reported with its SHAP physical share and its list of non-spectroscopic columns, not only with accuracy.
- Any metric quoted on a page states its run and dataset generation.

---

<RelatedPages pages={[
  { href: '/docs/astrospectro/concepts/spectro-only-mode', title: 'spectro_only mode', desc: 'What it excludes', category: 'concepts' },
  { href: '/docs/astrospectro/concepts/physical-purity', title: 'Physical Purity', desc: 'Types of problematic features', category: 'concepts' },
  { href: '/docs/astrospectro/concepts/data-leakage-audit', title: 'Data Leakage Audit', desc: 'What remains in the reference run', category: 'concepts' },
  { href: '/docs/astrospectro/concepts/reproducibility', title: 'Reproducibility', desc: 'How runs are recorded', category: 'concepts' },
]} />
