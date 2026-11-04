---
title: EfficientNet-B0
description: EfficientNet-B0 pretrained on ImageNet and fine-tuned in two phases (frozen head, then full network) on Galaxy10 DECaLS — the strongest convolutional baseline.
sidebar_position: 2
---

import Fact from '@site/src/components/astrovision/Fact';
import FactCards from '@site/src/components/astrovision/FactCards';
import FactTable from '@site/src/components/astrovision/FactTable';
import FactProvenance from '@site/src/components/astrovision/FactProvenance';
import FigureGallery from '@site/src/components/astrovision/Gallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json models.efficientnet.* (notebooks 01–02, complement; fine-tune checkpoint retained over warm-up — FACTS_INDEX §1) · code: src/astrovision/models.py */}

export const effFigures = [
  { src: '/img/astrovision/gradcam_efficientnet.jpg', title: 'Grad-CAM — EfficientNet-B0', desc: 'Heat maps from the last feature block.' },
  { src: '/img/astrovision/results_gradcam_efficientnet.jpg', title: 'Grad-CAM on test errors and successes', desc: 'Results notebook.' },
  { src: '/img/astrovision/results_worst_errors_efficientnet.jpg', title: 'Worst errors', desc: 'Most confident misclassifications.' },
  { src: '/img/astrovision/results_metrics_by_class.png', title: 'Metrics by class', desc: 'Precision, recall and F1 per class.' },
];

# EfficientNet-B0

`EfficientNetGalaxy` wraps `torchvision`'s EfficientNet-B0 (ImageNet weights) and replaces the classifier with `Dropout(0.3) → Linear(1280→10)`. The Grad-CAM target is the last block of `features`.

## Key results

<FactCards cards={[
  { k: 'models.efficientnet.test.balanced_accuracy', format: 'pct', label: 'Balanced accuracy', context: 'fine-tuned checkpoint · test set', accent: '#38BDF8' },
  { k: 'models.efficientnet.test.accuracy', format: 'pct', label: 'Accuracy', context: 'test set, 2,660 images', accent: '#34D399' },
  { k: 'models.efficientnet.finetune.val.balanced_accuracy', format: 'pct', label: 'Best validation', context: 'phase 2 (full fine-tuning)', accent: '#A78BFA' },
]} />

<FactProvenance prefixes={['models.efficientnet']} />

## Two-phase transfer learning

| Phase | Trainable | Epochs | Learning rate | Best validation balanced acc. |
|---|---|---|---|---|
| 1 — warm-up | classifier head only (`freeze_backbone=True`) | <Fact k="models.efficientnet.warmup.epochs" /> | 1e-3 | <Fact k="models.efficientnet.warmup.val.balanced_accuracy" format="pct" /> |
| 2 — fine-tuning | whole network | <Fact k="models.efficientnet.finetune.epochs" /> | 1e-4 | <Fact k="models.efficientnet.finetune.val.balanced_accuracy" format="pct" /> |

The warm-up checkpoint (`efficientnet_galaxy10_warmup_best.pt`) only initialises phase 2 and is **not** the reference model. The reference is `efficientnet_galaxy10_finetune_best.pt`, evaluated in the results notebook. Both phases use the shared `trainer.train` loop (label smoothing 0.1, AdamW, cosine schedule).

## Per class

<FactTable labelHeader="Class (recall, test)" columns={[{ header: 'SimpleCNN', format: 'num', digits: 2 }, { header: 'EfficientNet-B0', format: 'num', digits: 2 }]} rows={[
  { label: 'Disturbed', keys: ['models.simplecnn.recall.disturbed', 'models.efficientnet.recall.disturbed'] },
  { label: 'Cigar Shaped Smooth', keys: ['models.simplecnn.recall.cigar_shaped_smooth', 'models.efficientnet.recall.cigar_shaped_smooth'] },
  { label: 'Unbarred Loose Spiral', keys: ['models.simplecnn.recall.unbarred_loose_spiral', 'models.efficientnet.recall.unbarred_loose_spiral'] },
  { label: 'Edge-on without Bulge', keys: ['models.simplecnn.recall.edge_on_without_bulge', 'models.efficientnet.recall.edge_on_without_bulge'] },
]} caption="Full per-class table: Morphology Classes page." />

Pretraining on ImageNet roughly closes the gap on the rare classes: *Cigar Shaped Smooth* goes from <Fact k="models.simplecnn.recall.cigar_shaped_smooth" format="num" digits={2} /> to <Fact k="models.efficientnet.recall.cigar_shaped_smooth" format="num" digits={2} />. *Disturbed* remains the weakest class at <Fact k="models.efficientnet.recall.disturbed" format="num" digits={2} />.

<FigureGallery figures={effFigures} columns={2} />

<RelatedPages pages={[
  { href: '/astrovision/models/baseline-cnn', title: 'Baseline CNN', desc: 'From-scratch reference', category: 'science' },
  { href: '/astrovision/models/dinov2-finetuned', title: 'DINOv2 — Fine-tuned', desc: 'The model that surpasses it', category: 'science' },
  { href: '/astrovision/guides/train-classifier', title: 'Train a Classifier', desc: 'Two-phase recipe', category: 'guides' },
]} />
