---
title: Scientific Motivation
description: Why AstroVision tests self-supervised DINOv2 features on Galaxy10 DECaLS — what is expected, what has been measured and what remains open.
sidebar_position: 2
---

import Fact from '@site/src/components/astrovision/Fact';
import FactProvenance from '@site/src/components/astrovision/FactProvenance';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: notebooks 03, 05, 06 (complement) · figures/seg_dino_morpho_corr.png · data/master_synthesis.csv */}

# Scientific Motivation

Galaxy morphology (smooth, barred spiral, merging, edge-on…) correlates with star-formation history and assembly history. Classifying it at survey scale needs models that are accurate, calibrated and, ideally, **interpretable in physical terms**. AstroVision uses Galaxy10 DECaLS as a controlled testbed for three questions.

## 1. Do foundation-model features transfer to galaxies?

DINOv2 was trained on natural images. A linear probe on its frozen features reaches only <Fact k="models.dinov2_probe.test.balanced_accuracy" format="pct" /> balanced accuracy, below a small CNN trained from scratch (<Fact k="models.simplecnn.test.balanced_accuracy" format="pct" />). Full fine-tuning lifts it to <Fact k="models.dinov2_ft.test.balanced_accuracy" format="pct" />, above fine-tuned EfficientNet-B0 (<Fact k="models.efficientnet.test.balanced_accuracy" format="pct" />). The gap between probe and fine-tuning is the measurable **domain gap** ([probe](../models/dinov2-probing.md), [fine-tuning](../models/dinov2-finetuned.md)).

## 2. Do the features carry physical information?

Two quantities were checked against the zero-shot DINOv2 features, using the SDSS DR16 cross-match and CAS/Gini/M20 morphometry:

- the second principal component (<Fact k="dinov2_pca.pc2.variance_pct" format="pctRaw" /> of feature variance) correlates with the Gini coefficient (ρ = <Fact k="dinov2_pca.pc2.gini_rho" format="num" digits={2} />) and with the g−r colour (ρ = <Fact k="crossmatch.pc2_gr_rho" format="num" digits={2} />);
- a Lasso regression of g−r on the 768 features reaches R² = <Fact k="crossmatch.lasso_gr.r2_mean" format="num" /> ± <Fact k="crossmatch.lasso_gr.r2_std" format="num" /> in cross-validation.

These are **moderate correlations**, not proof that the model has learned physics; the Hubble sequence links concentration and colour, so a shared axis is expected from morphology alone. Details and caveats: [Physical Interpretation](../results/physical-interpretation.md).

<FactProvenance prefixes={['dinov2_pca', 'crossmatch.lasso_gr', 'crossmatch.pc2_gr_rho']} />

## 3. Can predictions be trusted and explained?

Misclassifications concentrate in physically ambiguous classes (disturbed systems, loose spirals). AstroVision therefore pairs the classifier with uncertainty estimates ([MC Dropout, calibration, conformal sets](../results/uncertainty.md)) and with attention- and gradient-based explanations ([Grad-CAM and attention](../results/attention-gradcam.md)).

## Open question: images × spectra

The longer-term goal is to relate visual morphology to spectroscopic quantities such as metallicity — the link to [AstroSpectro](./link-to-astrospectro.md). A cross-match of Galaxy10 with LAMOST DR7 was attempted in the synthesis notebook and returned no data (the VizieR table was not available on the CDS XMatch server), so this remains a research direction, not a result.

<RelatedPages pages={[
  { href: '/astrovision/overview/key-results', title: 'Key Results', desc: 'Numbers with context', category: 'science' },
  { href: '/astrovision/results/physical-interpretation', title: 'Physical Interpretation', desc: 'What the correlations do and do not show', category: 'science' },
  { href: '/astrovision/overview/link-to-astrospectro', title: 'Bridge to AstroSpectro', desc: 'Status of the images × spectra link', category: 'concepts' },
]} />
