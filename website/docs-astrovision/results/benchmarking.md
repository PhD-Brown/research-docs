---
title: Model Benchmarking
description: Test-set comparison of SimpleCNN, EfficientNet-B0, a DINOv2 linear probe, fine-tuned DINOv2 and the fusion model on Galaxy10 DECaLS — overall and per class, with the protocol differences that limit the comparison.
sidebar_position: 1
---

import Fact from '@site/src/components/astrovision/Fact';
import FactTable from '@site/src/components/astrovision/FactTable';
import ClassTable from '@site/src/components/astrovision/ClassTable';
import FactBars from '@site/src/components/astrovision/FactBars';
import FactProvenance from '@site/src/components/astrovision/FactProvenance';
import FigureGallery from '@site/src/components/FigureGallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json models.*.test.*, models.*.recall.*, split.*, ablation.* · notebooks 02, 03, 04, 08 (complement) · figures/results_*.png, dino_finetune_comparison.png */}

export const benchFigures = [
  { src: '/img/astrovision/results_final_comparison.png', title: 'SimpleCNN vs EfficientNet-B0', desc: 'Per-class recall and global metrics.' },
  { src: '/img/astrovision/results_confusion_matrices.png', title: 'Confusion matrices', desc: 'SimpleCNN and EfficientNet-B0.' },
  { src: '/img/astrovision/dino_finetune_comparison.png', title: 'Benchmark including DINOv2', desc: 'Balanced accuracy by model.' },
  { src: '/img/astrovision/results_metrics_by_class.png', title: 'Metrics by class', desc: 'Precision, recall, F1.' },
  { src: '/img/astrovision/results_confidence_distribution.png', title: 'Confidence distribution', desc: 'Correct versus wrong predictions.' },
];

# Model Benchmarking

## Overall comparison

<FactTable labelHeader="Model" columns={[{ header: 'Accuracy', format: 'pct' }, { header: 'Balanced acc.', format: 'pct' }]} rows={[
  { label: 'Random baseline (10 balanced classes)', keys: [null, null], text: ['—', '10.0%'] },
  { label: 'Majority class', keys: ['dataset.majority_class_accuracy', null], text: ['', '10.0%'] },
  { label: 'SimpleCNN (scratch)', keys: ['models.simplecnn.test.accuracy', 'models.simplecnn.test.balanced_accuracy'] },
  { label: 'DINOv2 linear probe (frozen)', keys: ['models.dinov2_probe.test.accuracy', 'models.dinov2_probe.test.balanced_accuracy'] },
  { label: 'EfficientNet-B0 fine-tuned', keys: ['models.efficientnet.test.accuracy', 'models.efficientnet.test.balanced_accuracy'] },
  { label: 'DINOv2 ViT-B/14 fine-tuned', highlight: true, keys: ['models.dinov2_ft.test.accuracy', 'models.dinov2_ft.test.balanced_accuracy'] },
  { label: 'Fusion head (single run, other test split)', keys: ['models.fusion.test.accuracy', 'models.fusion.test.balanced_accuracy'] },
]} caption="Test sets: first four image models on the seed-42 random split (2,660 images); fusion on a stratified split (2,661 images)." />

<FactProvenance prefixes={['models']} />

<FactBars title="Balanced accuracy" format="pct" items={[
  { label: 'SimpleCNN', k: 'models.simplecnn.test.balanced_accuracy', accent: '#94A3B8' },
  { label: 'DINOv2 probe', k: 'models.dinov2_probe.test.balanced_accuracy', accent: '#A78BFA' },
  { label: 'EfficientNet-B0', k: 'models.efficientnet.test.balanced_accuracy', accent: '#38BDF8' },
  { label: 'DINOv2 fine-tuned', k: 'models.dinov2_ft.test.balanced_accuracy', accent: '#34D399' },
  { label: 'Fusion (single run)', k: 'models.fusion.test.balanced_accuracy', accent: '#F59E0B' },
]} />

The progression is not monotonic with model size: the frozen 86 M-parameter DINOv2 (<Fact k="models.dinov2_probe.test.balanced_accuracy" format="pct" />) is below a 0.65 M-parameter CNN (<Fact k="models.simplecnn.test.balanced_accuracy" format="pct" />), and fine-tuning is what makes DINOv2 competitive. The margin of fine-tuned DINOv2 over EfficientNet-B0 is <Fact k="models.dinov2_ft.test.balanced_accuracy" format="pct" /> against <Fact k="models.efficientnet.test.balanced_accuracy" format="pct" /> — about one point, on about 2,660 test images and one training run each; it supports "comparable or slightly better", not a ranking.

## Per class

<ClassTable columns={[
  { header: 'SimpleCNN', path: 'models.simplecnn.recall.{slug}', format: 'num', digits: 2 },
  { header: 'EfficientNet-B0', path: 'models.efficientnet.recall.{slug}', format: 'num', digits: 2 },
  { header: 'DINOv2 FT', path: 'models.dinov2_ft.recall.{slug}', format: 'num', digits: 2 },
  { header: 'Fusion', path: 'models.fusion.recall.{slug}', format: 'num', digits: 2 },
]} highlight="disturbed" caption="Recall on the test set. DINOv2 values are read from the exported confusion matrix (2 decimals)." />

Across models, the ordering of classes by difficulty is broadly stable: *Disturbed* is the hardest, followed by *Cigar Shaped Smooth* (for the CNNs), *Unbarred Loose Spiral* and *Unbarred Tight Spiral*; edge-on and smooth classes are easiest. Notably, adding modalities in the fusion model does not rescue *Disturbed* (recall <Fact k="models.fusion.recall.disturbed" format="num" digits={2} />).

## How comparable are these numbers?

| Issue | Consequence |
|---|---|
| Two different test splits (<Fact k="split.test" format="int" /> random versus <Fact k="split.fusion.test" format="int" /> stratified images) | Fusion versus the other models is an inter-split comparison |
| One training run per model; no seed repetition | Differences of 1–2 points are within plausible run-to-run variation (the fusion configuration scored <Fact k="models.fusion.test.balanced_accuracy" format="pct" /> in one run and <Fact k="ablation.dinov2_morpho_photo" format="pct" /> in another) |
| Selection by validation balanced accuracy, reporting on test | Fine; but the validation curve of DINOv2 is noisy |
| Fusion features possibly from a backbone fine-tuned on part of its test set | Fusion score possibly optimistic (see [Late-Fusion](../models/late-fusion.md)) |

<FigureGallery figures={benchFigures} columns={3} />

<RelatedPages pages={[
  { href: '/astrovision/results/limitations', title: 'Limitations', desc: 'What the benchmark cannot say', category: 'science' },
  { href: '/astrovision/results/evaluation-protocol', title: 'Evaluation Protocol', desc: 'Conventions for reporting', category: 'guides' },
  { href: '/astrovision/models/dinov2-finetuned', title: 'DINOv2 — Fine-tuned', desc: 'Recipe and per-class behaviour', category: 'science' },
]} />
