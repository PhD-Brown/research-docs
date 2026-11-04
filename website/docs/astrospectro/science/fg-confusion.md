---
title: F/G Confusion Analysis
description: "Analysis of the F/G spectral-type confusion of the reference XGBoost classifier (350k-spectrum generation, G2) — confusion matrix, per-class SHAP attribution — and of its UMAP picture on the PHY-3500 dataset (G1): why the boundary is physically ambiguous rather than a classifier failure."
sidebar_position: 5
---

import RunFact from '@site/src/components/RunFact';
import RunProvenance from '@site/src/components/RunProvenance';
import FigureGallery from '@site/src/components/FigureGallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts:
  G2 · runs.json `classifier` (20260522T161236Z, v6): metrics.per_class.{F,G}.{precision,recall,f1,support} ; metrics.confusion_matrix (rows = true, columns = predicted, order of `classes` = A, F, G, K, M → index 1 = F, 2 = G, 3 = K)
       source _facts/astrospectro/data/reports/20260522T161236Z/session_report_xgboost_20260522T161236Z.json (classification_report, confusion_matrix)
  G2 · figure _facts/astrospectro/data/reports/20260522T161236Z/confusion_matrix_xgboost_20260522T161236Z.png → static/img/astrospectro/
  G2 · SHAP v6 _facts/astrospectro/logs/shap/features_20260522T153123Z/01_data_leak/{class_specific_importance,beeswarm_per_class}.png → static/img/astrospectro/
  G1 · static/img/dimred/umap_xgboost_FG_confusion.png (G1 UMAP + model v5 20260306T020848Z, MANIFEST)
  Qualitative statements tied to v6: G→F and F→G are the two largest off-diagonal cells; F and G have the lowest F1. To re-check on a new run. */}

# F/G Confusion Analysis

This page documents where the reference XGBoost classifier confuses F and G stars and why this boundary is expected to be ambiguous. Metrics and SHAP figures come from the reference run on the 350k-spectrum generation (**G2**); the UMAP picture of the transition zone comes from the PHY-3500 dimensionality-reduction study (**PHY-3500 · G1 · 43,019 spectra**) and is discussed separately.

<RunProvenance keyResultsHref="../science/classification-performance" />

---

## Key results

Reference run <RunFact path="label" format="raw" />, test set of <RunFact path="n.test" /> spectra:

| Quantity | F | G |
|---|---|---|
| Precision | <RunFact path="metrics.per_class.F.precision" format="num" /> | <RunFact path="metrics.per_class.G.precision" format="num" /> |
| Recall | <RunFact path="metrics.per_class.F.recall" format="num" /> | <RunFact path="metrics.per_class.G.recall" format="num" /> |
| F1 | <RunFact path="metrics.per_class.F.f1" format="num" /> | <RunFact path="metrics.per_class.G.f1" format="num" /> |
| Test spectra (support) | <RunFact path="metrics.per_class.F.support" /> | <RunFact path="metrics.per_class.G.support" /> |
| Misclassified into the other class | <RunFact path="metrics.confusion_matrix.1.2" /> true F predicted G | <RunFact path="metrics.confusion_matrix.2.1" /> true G predicted F |

For comparison, the other errors of these two classes: true F predicted A <RunFact path="metrics.confusion_matrix.1.0" />, true G predicted K <RunFact path="metrics.confusion_matrix.2.3" />, true K predicted G <RunFact path="metrics.confusion_matrix.3.2" />.

:::caution[Gaia leak in run v6]
Run v6 (`ST_350k_xgb_AFGKM_v6`) was trained with `spectro_only` enabled, but its <RunFact run="20260522T161236Z" path="features.selected" /> selected features include <RunFact run="20260522T161236Z" path="features.gaia_photometric.length" /> Gaia/photometric columns (`M_G`, `M_BP`, `M_RP`, `ag_gspphot`). Its metrics are therefore not purely spectroscopic; see the [Data Leakage Audit](../concepts/data-leakage-audit.mdx).
:::

---

## Where the errors are

### Result

In the reference run, the two largest off-diagonal cells of the confusion matrix are G predicted as F and F predicted as G, and F and G have the lowest F1 scores of the five classes. The errors are **between neighbours** in the temperature sequence: G stars are otherwise confused with K, F stars with A, and almost never with distant types.

### Interpretation

Spectral types are bins cut into a continuous temperature sequence. Near the F/G boundary, consecutive subtypes (late F, early G) differ by small changes in line strengths, so a spectrum close to the cut can carry the label of either side. Errors that stay between adjacent classes are the pattern expected from a classifier that has learned the ordering of the sequence; random errors would spread over all classes.

### Caveat

The labels are the LAMOST pipeline types, not an independent reference. Part of the F/G "errors" may therefore come from the labels themselves; the exported results do not allow separating classifier errors from label noise.

export const confusionFigures = [
  { src: '/img/astrospectro/confusion_matrix_xgboost_20260522T161236Z.png', title: 'Confusion matrix (row-normalised)', desc: 'G2 · reference run v6 · test set — includes Gaia/photometric features (Data Leakage Audit)', tag: 'G2 · v6' },
];

<FigureGallery figures={confusionFigures} columns={1} />

---

## Which features separate F from G

### Result

The per-class SHAP attribution of the reference run (`logs/shap/features_20260522T153123Z/01_data_leak/`) ranks different features at the top for the two classes. For **F**, the leading features are the Mg b equivalent width, the Na D equivalent width and the continuum curvature. For **G**, the Mg I 5184 Å equivalent width, the CNO index and the Hα/Hβ equivalent-width ratio lead. The leading features of F and G have smaller mean |SHAP| values than those of A, K and M.

### Interpretation

Between F and G, the classifier relies on a combination of moderate signals — the growth of metal lines (Mg b, Na D) and the weakening of the Balmer lines as temperature decreases — rather than on one decisive line. A spread of small contributions is consistent with a boundary that is defined by gradual changes.

### Caveat

The per-class ranking is read from the figure produced by the pipeline (mean \|SHAP\| per class); the per-class values are not part of the exported CSV. The SHAP run analyses a model that includes Gaia/photometric features.

export const shapFigures = [
  { src: '/img/astrospectro/shap_20260522T153123Z_01_data_leak_class_specific_importance.png', title: 'Top features per class', desc: 'G2 · SHAP of run v6 (01_data_leak) — mean |SHAP| per class', tag: 'G2 · v6' },
  { src: '/img/astrospectro/shap_20260522T153123Z_01_data_leak_beeswarm_per_class.png', title: 'Beeswarm per class', desc: 'G2 · SHAP of run v6 (01_data_leak) — direction of each feature effect', tag: 'G2 · v6' },
];

<FigureGallery figures={shapFigures} columns={2} />

---

## The transition zone in UMAP (PHY-3500 · G1 · 43,019 spectra)

This section uses a different dataset and an older model: predictions of the XGBoost run v5 (`ST_100k_xgb_AFGKM_v5`) projected onto the UMAP embedding of the PHY-3500 dataset.

**Result.** Spectra whose predicted type differs between F and G concentrate along the zone where the F and G populations meet in the embedding, not in isolated islands.

**Interpretation.** The unsupervised embedding, built without labels, places these spectra between the two populations: the ambiguity is present in the features themselves, not introduced by the classifier.

**Caveat.** Qualitative, on G1 and with model v5 (which also includes a Gaia-derived column, `M_G`); it illustrates the mechanism but is not a measurement on the reference run.

export const umapFigures = [
  { src: '/img/dimred/umap_xgboost_FG_confusion.png', title: 'F/G confusion in UMAP', desc: 'PHY-3500 · G1 · 43,019 spectra — model v5 predictions projected', tag: 'G1 · v5' },
];

<FigureGallery figures={umapFigures} columns={1} />

---

## Limitations of this result

- No independent reference classification (another survey or manual typing) is part of the exported results, so the share of label noise in the F/G errors is unknown.
- The analysis is at the level of main types; the subtype of misclassified spectra (late F vs early G) is not exported.
- All G2 numbers come from a run whose features include Gaia/photometric columns.

---

<RelatedPages pages={[
  { href: '/docs/astrospectro/science/classification-performance', title: 'Classification Performance', desc: 'All metrics of the reference run', category: 'science' },
  { href: '/docs/astrospectro/science/model-card', title: 'Model Card', desc: 'Per-class table and intended use', category: 'science' },
  { href: '/docs/astrospectro/data/class-taxonomy', title: 'Class Taxonomy', desc: 'How labels are derived from LAMOST subclasses', category: 'science' },
  { href: '/docs/astrospectro/science/shap-interpretability', title: 'SHAP Interpretability', desc: 'Global feature attribution', category: 'science' },
]} />
