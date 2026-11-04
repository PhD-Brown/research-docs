---
title: U-Net Segmentation
description: A U-Net trained on Otsu pseudo-labels to segment galaxy images into background, disk and bright core — what the mIoU means and what the "bulge" class really is.
sidebar_position: 6
---

import Fact from '@site/src/components/astrovision/Fact';
import FactCards from '@site/src/components/astrovision/FactCards';
import FactTable from '@site/src/components/astrovision/FactTable';
import FactBars from '@site/src/components/astrovision/FactBars';
import FactProvenance from '@site/src/components/astrovision/FactProvenance';
import FigureGallery from '@site/src/components/FigureGallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json unet.*, segmenter.*, segmentation.* (notebook 06 complement; data/master_synthesis.csv for bulge fractions) · code: src/astrovision/unet.py, segmenter.py */}

export const segFigures = [
  { src: '/img/astrovision/seg_pseudo_labels_sample.png', title: 'Pseudo-label sample', desc: 'Images with their Otsu pseudo-labels.' },
  { src: '/img/astrovision/seg_otsu_gallery.jpg', title: 'Otsu pseudo-labels', desc: 'Background / disk / bright core by thresholding.' },
  { src: '/img/astrovision/seg_unet_gallery.jpg', title: 'U-Net predictions', desc: 'Test images with predicted masks.' },
  { src: '/img/astrovision/seg_comparison_3methods.jpg', title: 'Three methods', desc: 'Otsu, DINOv2 patch clustering and U-Net.' },
  { src: '/img/astrovision/seg_dino_clusters_grid.jpg', title: 'DINOv2 patch clusters', desc: 'Self-supervised clustering of patch features.' },
  { src: '/img/astrovision/seg_miou_by_class.png', title: 'mIoU by morphology class', desc: 'U-Net quality per galaxy class.' },
  { src: '/img/astrovision/seg_structure_stats.png', title: 'Structure statistics', desc: 'Bulge fraction and components in U-Net masks.' },
];

# U-Net Segmentation

There are no manual galaxy masks in Galaxy10, so segmentation is **weakly supervised**: an Otsu-based teacher produces three-class pseudo-labels, and a U-Net is trained to reproduce and regularise them.

## Pseudo-labels (the “teacher”)

`OtsuSegmenter` (background percentile <Fact k="segmenter.otsu.background_percentile" />) builds a galaxy mask by Otsu threshold, hole filling and largest-component selection, then splits it:

| Class | Definition |
|---|---|
| 0 — background | outside the galaxy mask |
| 1 — disk | galaxy mask, below the <Fact k="segmenter.otsu.bulge_percentile" />th percentile of galaxy pixel brightness |
| 2 — “bulge” | pixels above that percentile |

:::warning[The “bulge” is a brightness quantile]
Class 2 is **by construction the brightest 20 % of the galaxy's pixels**, so the Otsu bulge fraction is 0.200 for every morphology class. It is not a physical bulge/disk decomposition. The U-Net learns this brightness criterion; its predicted bulge fraction (median <Fact k="segmentation.fraction.bulge.median" format="num" digits={3} />) correlates only very weakly with colour (see [Physical Interpretation](../results/physical-interpretation.md)).
:::

Pseudo-label pixel shares on the training set: <Fact k="unet.pixel_share.background" format="pctRaw" /> background, <Fact k="unet.pixel_share.disk" format="pctRaw" /> disk, <Fact k="unet.pixel_share.bulge" format="pctRaw" /> bulge; class weights in the loss compensate the imbalance.

## Model and training

U-Net (Ronneberger et al. 2015) with four encoder levels (64 → 512 filters), a 1,024-filter bottleneck with dropout 0.3 and bilinear up-sampling. Loss: 0.5 × Dice + 0.5 × cross-entropy (label smoothing 0.05, class weights 0.3 / 1.5 / 3.0). AdamW, learning rate <Fact k="unet.lr" format="sci" />, <Fact k="unet.epochs" /> epochs, FP16, best epoch by validation mean IoU.

## Results

<FactCards cards={[
  { k: 'unet.test.miou', format: 'num', label: 'Test mIoU', context: 'against Otsu pseudo-labels', accent: '#F59E0B' },
  { k: 'unet.test.pixel_accuracy', format: 'pct', label: 'Pixel accuracy', context: 'all test pixels', accent: '#38BDF8' },
  { k: 'unet.test.bulge.recall', format: 'pct', label: 'Bulge recall', context: 'brightest-quantile class', accent: '#F87171' },
]} />

<FactProvenance prefixes={['unet']} />

<FactTable labelHeader="Pixel class (test)" columns={[{ header: 'Precision', format: 'num', digits: 3 }, { header: 'Recall', format: 'num', digits: 3 }, { header: 'F1', format: 'num', digits: 3 }]} rows={[
  { label: 'Background', keys: ['unet.test.background.precision', 'unet.test.background.recall', 'unet.test.background.f1'] },
  { label: 'Disk', keys: ['unet.test.disk.precision', 'unet.test.disk.recall', 'unet.test.disk.f1'] },
  { label: '“Bulge”', keys: ['unet.test.bulge.precision', 'unet.test.bulge.recall', 'unet.test.bulge.f1'] },
]} caption="Notebook 06, per-pixel classification report." />

:::caution[What the mIoU does and does not mean]
The mIoU is measured **against the Otsu pseudo-labels**, not against human masks, so it quantifies how well the network reproduces its teacher. The comparison table in the project README (random ≈ 0.167, Otsu ≈ 0.500, “+4 % over the teacher”) has no counterpart in the notebook outputs and is not reproduced here: the teacher scored against itself is trivially perfect. The network misses most of the “bulge” pixels (recall <Fact k="unet.test.bulge.recall" format="pct" />) because a quantile threshold is a noisy target at the pixel level.
:::

By morphology class, the U-Net mIoU ranges from <Fact k="unet.miou_by_class.cigar_shaped_smooth" format="num" digits={3} /> (*Cigar Shaped Smooth*) to <Fact k="unet.miou_by_class.unbarred_tight_spiral" format="num" digits={3} /> (*Unbarred Tight Spiral*).

<FactBars title="U-Net mIoU by galaxy class" format="num" digits={2} perClass="unet.miou_by_class.{slug}" accent="#F59E0B" />

## Other segmenters

`DINOv2PatchSegmenter` clusters patch features with k-means (k = 3, 4, 5 tried in the notebook) — a label-free alternative, shown qualitatively. `SAMSegmenter` (Segment Anything) is optional and was not run: its checkpoint was absent in the recorded notebook.

<FigureGallery figures={segFigures} columns={3} />

<RelatedPages pages={[
  { href: '/astrovision/guides/run-segmentation', title: 'Run Segmentation', desc: 'Apply Otsu and the U-Net', category: 'guides' },
  { href: '/astrovision/models/morphometry', title: 'Non-parametric Morphometrics', desc: 'The mask-dependent statistics', category: 'science' },
  { href: '/astrovision/results/physical-interpretation', title: 'Physical Interpretation', desc: 'Bulge fraction versus colour', category: 'science' },
]} />
