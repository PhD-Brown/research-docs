---
title: Key Results
description: AstroVision headline results on Galaxy10 DECaLS — balanced accuracy of five models, segmentation, calibration and conformal coverage — each with its context and caveat.
sidebar_position: 3
---

import Fact from '@site/src/components/astrovision/Fact';
import FactBars from '@site/src/components/astrovision/FactBars';
import FactTable from '@site/src/components/astrovision/FactTable';
import FactProvenance from '@site/src/components/astrovision/FactProvenance';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json models.*, ablation.*, unet.*, uncertainty.* · FACTS_INDEX §1, §4 · data/fusion_ablation_results.json */}

# Key Results

All results are on **Galaxy10 DECaLS** (<Fact k="dataset.n_images" /> images, 10 classes). The primary metric is **balanced accuracy** (mean per-class recall), because the largest class is <Fact k="dataset.imbalance_ratio" format="num" digits={1} />× the smallest. Accuracy of a classifier that always predicts the majority class would be <Fact k="dataset.majority_class_accuracy" format="pct" />.

## Classification

<FactBars title="Balanced accuracy on the test set" format="pct" items={[
  { label: 'SimpleCNN (scratch)', k: 'models.simplecnn.test.balanced_accuracy', accent: '#94A3B8' },
  { label: 'DINOv2 linear probe', k: 'models.dinov2_probe.test.balanced_accuracy', accent: '#A78BFA' },
  { label: 'EfficientNet-B0 fine-tuned', k: 'models.efficientnet.test.balanced_accuracy', accent: '#38BDF8' },
  { label: 'DINOv2 ViT-B/14 fine-tuned', k: 'models.dinov2_ft.test.balanced_accuracy', accent: '#34D399' },
  { label: 'Fusion head (single run)', k: 'models.fusion.test.balanced_accuracy', accent: '#F59E0B' },
]} />

<FactProvenance prefixes={['models']} />

:::tip[Fine-tuning closes the domain gap]
DINOv2 goes from <Fact k="models.dinov2_probe.test.balanced_accuracy" format="pct" /> (frozen features) to <Fact k="models.dinov2_ft.test.balanced_accuracy" format="pct" /> after 10 epochs at a learning rate of <Fact k="models.dinov2_ft.lr" format="sci" />, ahead of EfficientNet-B0 (<Fact k="models.efficientnet.test.balanced_accuracy" format="pct" />).
:::

:::warning[The fusion bar is not directly comparable]
The fusion model is evaluated on a different test split (<Fact k="split.fusion.test" format="int" /> images, stratified) from the other models (<Fact k="split.test" format="int" />, random permutation), and an ablation of the same architecture shows no gain from the added modalities:
:::

<FactTable labelHeader="Fusion ablation (30 epochs, test)" columns={[{ header: 'Balanced acc.', format: 'pct', digits: 2 }, { header: 'Δ vs DINOv2 only', format: 'signed', digits: 3 }]} rows={[
  { label: 'DINOv2 only', keys: ['ablation.dinov2_only', 'ablation.delta_vs_dinov2_only.dinov2_only'] },
  { label: '+ morphometry', keys: ['ablation.dinov2_morpho', 'ablation.delta_vs_dinov2_only.dinov2_morpho'] },
  { label: '+ SDSS photometry', keys: ['ablation.dinov2_photo', 'ablation.delta_vs_dinov2_only.dinov2_photo'] },
  { label: '+ morphometry + photometry', keys: ['ablation.dinov2_morpho_photo', 'ablation.delta_vs_dinov2_only.dinov2_morpho_photo'] },
]} caption="Source: data/fusion_ablation_results.json. Differences stay below half a point, comparable to the gap between two trainings of the same configuration." />

Details: [Late-Fusion Multimodal](../models/late-fusion.md), [Model Benchmarking](../results/benchmarking.md).

## Segmentation

The U-Net reaches a test mIoU of <Fact k="unet.test.miou" format="num" /> against **Otsu pseudo-labels** (not manual masks). Its "bulge" class is by construction the brightest 20 % of pixels of the galaxy. See [U-Net Segmentation](../models/segmentation.md).

## Uncertainty

On the fusion model, conformal prediction at α = <Fact k="uncertainty.conformal.alpha" format="num" digits={2} /> gives an empirical coverage of <Fact k="uncertainty.conformal.coverage_test" format="pct" /> with a mean set size of <Fact k="uncertainty.conformal.mean_set_size" format="num" digits={2} /> classes. Temperature scaling **degrades** calibration (ECE <Fact k="uncertainty.temperature.ece_before" format="num" digits={3} /> → <Fact k="uncertainty.temperature.ece_after" format="num" digits={3} />). See [Uncertainty Quantification](../results/uncertainty.md).

## Hardest class

*Disturbed* galaxies have the lowest recall for every model: <Fact k="models.dinov2_ft.recall.disturbed" format="num" digits={2} /> for fine-tuned DINOv2, <Fact k="models.efficientnet.recall.disturbed" format="num" digits={2} /> for EfficientNet-B0. See [Limitations](../results/limitations.md).

<RelatedPages pages={[
  { href: '/astrovision/results/benchmarking', title: 'Model Benchmarking', desc: 'Per-class recall and protocol differences', category: 'science' },
  { href: '/astrovision/results/limitations', title: 'Limitations', desc: 'What these numbers do not show', category: 'science' },
  { href: '/astrovision/results/evaluation-protocol', title: 'Evaluation Protocol', desc: 'Metric and split conventions', category: 'guides' },
]} />
