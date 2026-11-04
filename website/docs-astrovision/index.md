---
title: AstroVision
description: Deep learning pipeline for galaxy morphological classification with multimodal fusion and uncertainty quantification.
sidebar_position: 1
---

import Fact from '@site/src/components/astrovision/Fact';

{/* facts: facts.json models.dinov2_ft.test.* · models.fusion.test.* · dinov2_pca.pc2.gini_rho (figure) · crossmatch.lasso_gr.r2_mean (nb 05) · FACTS_INDEX §4.1, §4.4, §4.5 */}

# AstroVision

**Deep learning for galaxy morphological classification.**

> Galaxy10 DECaLS · DINOv2 + morphometrics + SDSS · <Fact k="models.dinov2_ft.test.balanced_accuracy" format="pct" /> balanced accuracy (DINOv2 fine-tuned) · MC Dropout · Conformal prediction

---

## Quick navigation

| Section | What you'll find |
|---------|-----------------|
| [Overview](/research-docs/astrovision/overview/) | Scientific motivation, key results |
| [Data](/research-docs/astrovision/data/) | Galaxy10 DECaLS, morphology classes, SDSS crossmatch |
| [Models](/research-docs/astrovision/models/) | CNN, EfficientNet, DINOv2, Late-fusion |
| [Results](/research-docs/astrovision/results/) | Benchmarking, uncertainty, physical interpretation |
| [Guides](/research-docs/astrovision/guides/) | Installation, training, GradCAM, segmentation |
| [API](/research-docs/astrovision/api/) | Module reference |

## Key result

:::info[Central finding]

DINOv2 visual representations encode physically meaningful galaxy structure, but only partly: the second principal component of the zero-shot feature space correlates with the Gini coefficient (ρ = <Fact k="dinov2_pca.pc2.gini_rho" format="num" digits={2} />), and a Lasso regression recovers photometric colour g−r from the 768 features with a cross-validated R² of <Fact k="crossmatch.lasso_gr.r2_mean" format="num" digits={3} />. More than half of the colour variance is not recovered. Details and caveats: [Physical Interpretation](/research-docs/astrovision/results/physical-interpretation).

The late-fusion model reaches <Fact k="models.fusion.test.balanced_accuracy" format="pct" /> on its own test split, but this is not a gain from the added modalities (see [Evaluation Protocol](/research-docs/astrovision/results/evaluation-protocol)).

:::
