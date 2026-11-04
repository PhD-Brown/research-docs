---
title: DINOv2 — Linear Probe
description: Frozen DINOv2 ViT-B/14 features with a linear classifier on Galaxy10 DECaLS — a test of how well natural-image self-supervised features transfer to galaxies.
sidebar_position: 3
---

import Fact from '@site/src/components/astrovision/Fact';
import FactCards from '@site/src/components/astrovision/FactCards';
import FactProvenance from '@site/src/components/astrovision/FactProvenance';
import FigureGallery from '@site/src/components/FigureGallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json models.dinov2.*, models.dinov2_probe.* (notebooks 03 and 04, complement) · figures/dino_*.png */}

export const probeFigures = [
  { src: '/img/astrovision/dino_umap_features.png', title: 'UMAP of DINOv2 features', desc: 'Zero-shot CLS features, coloured by class.' },
  { src: '/img/astrovision/dino_umap_comparison.png', title: 'Pixels vs DINOv2', desc: 'Same UMAP on raw pixels and on DINOv2 features.' },
  { src: '/img/astrovision/dino_nearest_neighbors.jpg', title: 'Nearest neighbours', desc: 'Visually similar galaxies in feature space.' },
  { src: '/img/astrovision/dino_multihead_attention.png', title: 'Attention heads', desc: 'CLS attention of the 12 heads.' },
  { src: '/img/astrovision/dino_attention_by_class.png', title: 'Attention by class', desc: 'Zero-shot attention maps per class.' },
  { src: '/img/astrovision/dino_probe_comparison.png', title: 'Probe vs baselines', desc: 'Balanced accuracy comparison.' },
];

# DINOv2 — Linear Probe

DINOv2 ViT-B/14 (<Fact k="models.dinov2.params_millions" format="num" digits={1} /> M parameters, <Fact k="models.dinov2.n_blocks" /> blocks, <Fact k="models.dinov2.n_heads" /> heads, patch size <Fact k="models.dinov2.patch_size" />) was trained by self-supervision on natural images. The probe asks: **without any astronomical training, how much morphology is linearly decodable from its features?**

## Protocol

1. Resize each image to <Fact k="dataset.dino_input_size" />×<Fact k="dataset.dino_input_size" /> and take the **CLS token** (<Fact k="models.dinov2.feature_dim" />-dimensional) of the frozen backbone for all images; cache in `dinov2_features.npz`.
2. Fit a logistic-regression probe on the training split; evaluate on the test split.

## Key results

<FactCards cards={[
  { k: 'models.dinov2_probe.test.balanced_accuracy', format: 'pct', label: 'Balanced accuracy', context: 'linear probe · test set', accent: '#A78BFA' },
  { k: 'models.dinov2_probe.test.accuracy', format: 'pct', label: 'Accuracy', context: 'linear probe · test set', accent: '#38BDF8' },
  { k: 'models.simplecnn.test.balanced_accuracy', format: 'pct', label: 'SimpleCNN, for comparison', context: 'trained from scratch', accent: '#94A3B8' },
]} />

<FactProvenance prefixes={['models.dinov2']} />

:::tip[A measurable domain gap]
Frozen DINOv2 features give <Fact k="models.dinov2_probe.test.balanced_accuracy" format="pct" /> balanced accuracy, below a small CNN trained from scratch (<Fact k="models.simplecnn.test.balanced_accuracy" format="pct" />). Natural-image features alone are not enough for galaxy morphology; [fine-tuning](./dinov2-finetuned.md) recovers and exceeds the CNN baselines.
:::

The same features nevertheless show structure without supervision: neighbours in feature space are often of the same class, and a UMAP of DINOv2 features separates the classes more cleanly than a UMAP of raw pixels (qualitative, figures below). The first principal components also correlate with morphometry and colour — see [Physical Interpretation](../results/physical-interpretation.md).

:::note[Which number is "the probe"?]
Three values circulate: <Fact k="models.dinov2_probe.test.balanced_accuracy" format="num" digits={4} /> (test set, notebook 03, retained here), <Fact k="models.dinov2_probe.val.balanced_accuracy" format="num" digits={3} /> (validation set, used as head initialisation in notebook 04) and a rounded 0.555 in the project README.
:::

<FigureGallery figures={probeFigures} columns={3} />

<RelatedPages pages={[
  { href: '/astrovision/models/dinov2-finetuned', title: 'DINOv2 — Fine-tuned', desc: 'Adapting the backbone', category: 'science' },
  { href: '/astrovision/results/attention-gradcam', title: 'Attention & Grad-CAM', desc: 'Where the model looks', category: 'science' },
]} />
