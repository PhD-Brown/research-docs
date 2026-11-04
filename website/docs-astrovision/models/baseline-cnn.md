---
title: Baseline CNN
description: SimpleCNN — a 651,946-parameter four-block CNN trained from scratch on Galaxy10 DECaLS, the lower reference of the benchmark.
sidebar_position: 1
---

import Fact from '@site/src/components/astrovision/Fact';
import FactCards from '@site/src/components/astrovision/FactCards';
import FactBars from '@site/src/components/astrovision/FactBars';
import FactProvenance from '@site/src/components/astrovision/FactProvenance';
import FigureGallery from '@site/src/components/astrovision/Gallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json models.simplecnn.* (notebooks 01–02, complement) · code: src/astrovision/models.py, trainer.py */}

export const cnnFigures = [
  { src: '/img/astrovision/gradcam_simplecnn.jpg', title: 'Grad-CAM — SimpleCNN', desc: 'Heat maps from the last convolution.' },
  { src: '/img/astrovision/results_gradcam_simplecnn.jpg', title: 'Grad-CAM on test images', desc: 'Results notebook.' },
  { src: '/img/astrovision/results_confusion_matrices.png', title: 'Confusion matrices', desc: 'SimpleCNN and EfficientNet-B0, test set.' },
  { src: '/img/astrovision/results_worst_errors_simplecnn.jpg', title: 'Worst errors', desc: 'Most confident misclassifications.' },
];

# Baseline CNN

`SimpleCNN` is the from-scratch reference: if a pretrained model cannot beat it, transfer learning is not helping.

## Key results

<FactCards cards={[
  { k: 'models.simplecnn.test.balanced_accuracy', format: 'pct', label: 'Balanced accuracy', context: 'test set, 2,660 images', accent: '#94A3B8' },
  { k: 'models.simplecnn.test.accuracy', format: 'pct', label: 'Accuracy', context: 'test set', accent: '#38BDF8' },
  { k: 'models.simplecnn.params', format: 'int', label: 'Trainable parameters', context: 'four conv blocks + MLP head', accent: '#A78BFA' },
]} />

<FactProvenance prefixes={['models.simplecnn']} />

## Architecture

```text
Input (3, 256, 256)
  conv_block(3→32)    2×[Conv3×3 · BN · ReLU] · MaxPool · Dropout2d(0.1)   → 128×128
  conv_block(32→64)   idem                                                  →  64×64
  conv_block(64→128)  idem, Dropout2d(0.2)                                  →  32×32
  Conv3×3(128→256) · BN · ReLU · MaxPool                                    →  16×16
  AdaptiveAvgPool → Linear(256→256) · ReLU · Dropout(0.4) → Linear(256→10)
```

The Grad-CAM target layer (`gradcam_target`) is the 128→256 convolution before global pooling.

## Training

Loss: cross-entropy with label smoothing 0.1; optimiser AdamW (weight decay 1e-4) with a cosine schedule (`trainer.train`). The notebook trains for <Fact k="models.simplecnn.epochs" /> epochs at a learning rate of 1e-3; the recorded output is a final 5-epoch continuation at 1e-4 from an epoch-25 checkpoint, whose best validation balanced accuracy is <Fact k="models.simplecnn.val.balanced_accuracy" format="num" digits={3} />. The best-validation checkpoint is kept.

## Behaviour by class

<FactBars title="SimpleCNN recall per class (test)" format="pct" digits={0} perClass="models.simplecnn.recall.{slug}" accent="#94A3B8" />

Smooth and edge-on classes are recognised well, but the model almost ignores two classes: *Disturbed* (recall <Fact k="models.simplecnn.recall.disturbed" format="num" digits={2} />) and *Cigar Shaped Smooth* (<Fact k="models.simplecnn.recall.cigar_shaped_smooth" format="num" digits={2} />) — the rarest classes. With 651k parameters trained on about 12,400 images, the network cannot learn the minority classes without class re-weighting.

<FigureGallery figures={cnnFigures} columns={3} />

<RelatedPages pages={[
  { href: '/astrovision/models/efficientnet', title: 'EfficientNet-B0', desc: 'The pretrained convolutional baseline', category: 'science' },
  { href: '/astrovision/results/benchmarking', title: 'Model Benchmarking', desc: 'All models side by side', category: 'science' },
  { href: '/astrovision/api/models', title: 'models.py', desc: 'API reference', category: 'api' },
]} />
