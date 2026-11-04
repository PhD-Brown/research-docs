---
title: Limitations
description: What AstroVision results do not show — pseudo-label teachers, single runs, different test splits, a possible feature-provenance leak, crude derived quantities and ambiguous classes.
sidebar_position: 5
---

import Fact from '@site/src/components/astrovision/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json split.*, models.*, ablation.*, crossmatch.*, unet.* · FACTS_INDEX §0 and §4 */}

# Limitations

This page lists the limits that change how a number should be read. Each item points to the evidence.

## Evaluation

| Limitation | Evidence | Consequence |
|---|---|---|
| **Scores are not exported as data.** | The documentation pack contains no metrics file; model scores are taken from notebook output cells (FACTS_INDEX §0). | Values cannot be re-derived from the pack; they were not verified against the checkpoints. |
| **Single training run per model.** | One recorded run each; no seeds. The full fusion architecture scored <Fact k="models.fusion.test.balanced_accuracy" format="pct" /> and <Fact k="ablation.dinov2_morpho_photo" format="pct" /> in two runs. | Differences below about one point are not interpretable. |
| **Different test splits.** | <Fact k="split.test" format="int" /> random images versus <Fact k="split.fusion.test" format="int" /> stratified images. | Fusion versus single-image models is not like-for-like ([Benchmarking](./benchmarking.md)). |
| **Possible feature-provenance leak in the fusion model.** | Cached DINOv2 features are extracted from the fine-tuned backbone; its fine-tuning split differs from the fusion split; the feature file is not in the pack. | The fusion score may be optimistic until verified ([Late-Fusion](../models/late-fusion.md)). |
| **Fusion gain is not attributable to modalities.** | Ablation spread is below 0.5 point ([Key Results](../overview/key-results.md)). | Do not describe the fusion model as benefiting from morphometry or colour. |
| **Calibration was not improved.** | Temperature scaling raised the ECE ([Uncertainty](./uncertainty.md)). | The reported probabilities are used as is; coverage guarantees are marginal, not per class. |

## Data and labels

| Limitation | Evidence | Consequence |
|---|---|---|
| **Crowd-sourced labels, ten hard classes.** | Galaxy Zoo vote fractions binned into classes. | A ceiling below 100 % is plausible; *Disturbed* recall stays near 0.5 (<Fact k="models.dinov2_ft.recall.disturbed" format="num" digits={2} /> for the best image model, <Fact k="models.fusion.recall.disturbed" format="num" digits={2} /> for fusion). Whether this is an intrinsic physical limit, a labelling limit or a data limit is not established. |
| **Class imbalance.** | Ratio <Fact k="dataset.imbalance_ratio" format="num" digits={1} /> between the largest and smallest class. | Balanced accuracy is used; small-class recall (<Fact k="dataset.by_class.cigar_shaped_smooth.n" format="int" /> *Cigar Shaped Smooth* images) is noisy. |
| **One survey, one resolution.** | Galaxy10 is a DECaLS subset. | No out-of-distribution evaluation (other surveys, depths, seeing). |
| **Auxiliary modalities cover few galaxies.** | Morphometry: <Fact k="morphometry.n" format="int" /> galaxies; absolute magnitude: <Fact k="crossmatch.n_with_mr" format="int" /> of <Fact k="dataset.n_images" format="int" />. | Branches B and C of the fusion model are masked for most images. |

## Derived physical quantities

| Limitation | Evidence | Consequence |
|---|---|---|
| **“Bulge” is the brightest 20 % of pixels.** | `OtsuSegmenter(bulge_pct=80)`; Otsu bulge fraction is 0.200 in every class. | U-Net “bulge” results say nothing about bulge/disk decomposition ([U-Net](../models/segmentation.md)). |
| **U-Net mIoU is measured against its own teacher.** | Pseudo-labels from Otsu; no manual masks. | mIoU (<Fact k="unet.test.miou" format="num" />) is not a measure of agreement with real structure. |
| **Crude `Mr`.** | No K-correction or extinction, Hubble-flow distance (`H0 = 70`). | Use for ranking, not for luminosity functions. |
| **Positional cross-match only.** | 3″ radius, nearest neighbour. | Some counterparts may be neighbours ([SDSS cross-match](../data/sdss-crossmatch.md)). |
| **Morphometry depends on the mask.** | Otsu or attention percentile; two different `C` definitions. | Statistics from the two masks are not comparable ([Morphometry](../models/morphometry.md)). |
| **Correlation, not mechanism.** | DINOv2–colour correlations do not control for class. | “Encodes physics” is a hypothesis, not a result ([Physical Interpretation](./physical-interpretation.md)). |

<RelatedPages pages={[
  { href: '/astrovision/results/benchmarking', title: 'Model Benchmarking', desc: 'The comparison these limits qualify', category: 'science' },
  { href: '/astrovision/community/roadmap', title: 'Roadmap', desc: 'Planned work', category: 'community' },
]} />
