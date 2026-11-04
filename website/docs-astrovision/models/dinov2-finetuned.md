---
title: DINOv2 — Fine-tuned
description: Full fine-tuning of DINOv2 ViT-B/14 on Galaxy10 DECaLS — 10 epochs at a low learning rate, initialised from the linear probe — the best single-image model of AstroVision.
sidebar_position: 4
---

import Fact from '@site/src/components/astrovision/Fact';
import FactCards from '@site/src/components/astrovision/FactCards';
import FactBars from '@site/src/components/astrovision/FactBars';
import FactProvenance from '@site/src/components/astrovision/FactProvenance';
import FigureGallery from '@site/src/components/astrovision/Gallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json models.dinov2_ft.* (notebook 04; per-class recall read from figures/dino_finetune_confusion.png) · FACTS_INDEX §1: fine-tune checkpoint retained over warm-up/probe */}

export const ftFigures = [
  { src: '/img/astrovision/dino_finetune_confusion.png', title: 'Confusion matrix', desc: 'Row-normalised recall, test set.' },
  { src: '/img/astrovision/dino_finetune_comparison.png', title: 'Comparison with other models', desc: 'Balanced accuracy of the benchmark models.' },
  { src: '/img/astrovision/dino_attention_before_after.jpg', title: 'Attention before / after fine-tuning', desc: 'CLS attention of the zero-shot and fine-tuned backbone.' },
];

# DINOv2 — Fine-tuned

## Key results

<FactCards cards={[
  { k: 'models.dinov2_ft.test.balanced_accuracy', format: 'pct', label: 'Balanced accuracy', context: 'test set, 2,660 images', accent: '#34D399' },
  { k: 'models.dinov2_ft.test.accuracy', format: 'pct', label: 'Accuracy', context: 'test set', accent: '#38BDF8' },
  { k: 'models.dinov2_ft.val.balanced_accuracy_best', format: 'pct', label: 'Best validation', context: 'epoch 6 of 10', accent: '#A78BFA' },
  { k: 'models.dinov2.params_millions', format: 'num', digits: 1, label: 'Parameters (M)', context: 'all trainable', accent: '#F59E0B' },
]} />

<FactProvenance prefixes={['models.dinov2_ft']} />

## Recipe

| Item | Value |
|---|---|
| Backbone | DINOv2 ViT-B/14 (`torch.hub`, `dinov2_vitb14`), CLS token → `LayerNorm → Dropout(0.3) → Linear(768→10)` |
| Phase 1 | linear probe on cached features (about 20 s) initialises the head — validation balanced accuracy <Fact k="models.dinov2_probe.val.balanced_accuracy" format="pct" /> |
| Phase 2 | full fine-tuning, <Fact k="models.dinov2_ft.epochs" /> epochs, learning rate <Fact k="models.dinov2_ft.lr" format="sci" />, weight decay <Fact k="models.dinov2_ft.weight_decay" format="sci" />, batch size <Fact k="models.dinov2_ft.batch_size" />, FP16 mixed precision |
| Augmentation | resize 256, random crop 224, flips, rotation 180°, colour jitter |

The learning rate is deliberately very low: large rates destabilise a ViT that is already well initialised. The head is initialised from the probe so the first epochs do not spend their gradient on a random classifier. The class `DINOv2Classifier` is defined in notebook 04 (not in `src/astrovision/models.py`).

## Per-class recall

<FactBars title="Recall per class, DINOv2 fine-tuned (test)" format="pct" digits={0} perClass="models.dinov2_ft.recall.{slug}" accent="#34D399" />

Most classes exceed 0.85 recall. The weak ones are *Disturbed* (<Fact k="models.dinov2_ft.recall.disturbed" format="num" digits={2} />, often confused with loose spirals and in-between smooth galaxies), *Cigar Shaped Smooth* (<Fact k="models.dinov2_ft.recall.cigar_shaped_smooth" format="num" digits={2} />, confused with *In-between Round Smooth*) and *Unbarred Loose Spiral* (<Fact k="models.dinov2_ft.recall.unbarred_loose_spiral" format="num" digits={2} />). Per-class values are read from the exported confusion matrix (two decimals).

## What changes inside the network

Before fine-tuning, attention of the CLS token is partly drawn to bright background stars; afterwards it covers the galaxy structure (qualitative, figure below; see [Attention & Grad-CAM](../results/attention-gradcam.md)).

<FigureGallery figures={ftFigures} columns={3} />

:::caution[Reading the test score]
The validation maximum (<Fact k="models.dinov2_ft.val.balanced_accuracy_best" format="pct" />, epoch <Fact k="models.dinov2_ft.best_epoch" />) is higher than the final test balanced accuracy (<Fact k="models.dinov2_ft.test.balanced_accuracy" format="pct" />); the validation curve is noisy (it dips in the middle of training), so differences of one to two points between models on 2,660 test images should not be over-interpreted. One training run per model, no seeds repeated.
:::

<RelatedPages pages={[
  { href: '/astrovision/models/late-fusion', title: 'Late-Fusion Multimodal', desc: 'Adding morphometry and colour', category: 'science' },
  { href: '/astrovision/results/benchmarking', title: 'Model Benchmarking', desc: 'Where this model stands', category: 'science' },
  { href: '/astrovision/guides/train-classifier', title: 'Train a Classifier', desc: 'Reproduce the training', category: 'guides' },
]} />
