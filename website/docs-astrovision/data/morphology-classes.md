---
title: Morphology Classes
description: The ten Galaxy10 DECaLS morphology classes — image counts, SDSS colour and stellar-population fractions per class, and how difficult each class is for the classifiers.
sidebar_position: 3
---

import Fact from '@site/src/components/astrovision/Fact';
import ClassTable from '@site/src/components/astrovision/ClassTable';
import FactProvenance from '@site/src/components/astrovision/FactProvenance';
import FigureGallery from '@site/src/components/FigureGallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json dataset.by_class.* (data/synthesis_summary_table.csv, cross-checked with master_synthesis.csv) · models.*.recall.* (notebook 02/08, figure dino_finetune_confusion.png) */}

export const classFigures = [
  { src: '/img/astrovision/eda_gallery_by_class.jpg', title: 'Gallery by class', desc: 'Examples of each of the ten classes.' },
  { src: '/img/astrovision/eda_diversity_class3.jpg', title: 'Diversity within class 3', desc: 'In-between Round Smooth.' },
  { src: '/img/astrovision/eda_diversity_class5.jpg', title: 'Diversity within class 5', desc: 'Barred Spiral.' },
  { src: '/img/astrovision/eda_diversity_class6.jpg', title: 'Diversity within class 6', desc: 'Unbarred Tight Spiral.' },
];

# Morphology Classes

Class indices follow the Galaxy10 convention (0–9) used by every module of `src/astrovision`.

## Counts and photometry

<ClassTable columns={[
  { header: 'Images', path: 'dataset.by_class.{slug}.n', format: 'int' },
  { header: 'With SDSS', path: 'dataset.by_class.{slug}.n_sdss', format: 'int' },
  { header: 'Median g−r', path: 'dataset.by_class.{slug}.median_gr', format: 'num' },
  { header: 'Blue cloud', path: 'dataset.by_class.{slug}.pct_blue_cloud', format: 'pct', digits: 0 },
  { header: 'Red sequence', path: 'dataset.by_class.{slug}.pct_red_sequence', format: 'pct', digits: 0 },
]} caption="Source: data/synthesis_summary_table.csv. Blue cloud / red sequence fractions are shares of each class; green valley makes up the remainder (definition: SDSS Cross-match page)." />

Colour separates the classes strongly: *Edge-on with Bulge* has a median g−r of <Fact k="dataset.by_class.edge_on_with_bulge.median_gr" format="num" /> and <Fact k="dataset.by_class.edge_on_with_bulge.pct_red_sequence" format="pct" digits={0} /> of its galaxies on the red sequence, while *Unbarred Loose Spiral* has <Fact k="dataset.by_class.unbarred_loose_spiral.pct_blue_cloud" format="pct" digits={0} /> on the blue cloud. Merging and disturbed systems differ sharply from each other: <Fact k="dataset.by_class.disturbed.pct_blue_cloud" format="pct" digits={0} /> of *Disturbed* galaxies are blue, against <Fact k="dataset.by_class.merging.pct_blue_cloud" format="pct" digits={0} /> of *Merging* ones.

## Recall by class

<ClassTable columns={[
  { header: 'SimpleCNN', path: 'models.simplecnn.recall.{slug}', format: 'num', digits: 2 },
  { header: 'EfficientNet-B0', path: 'models.efficientnet.recall.{slug}', format: 'num', digits: 2 },
  { header: 'DINOv2 fine-tuned', path: 'models.dinov2_ft.recall.{slug}', format: 'num', digits: 2 },
  { header: 'Fusion', path: 'models.fusion.recall.{slug}', format: 'num', digits: 2 },
]} highlight="disturbed" caption="Test-set recall. SimpleCNN and EfficientNet: notebook 02; DINOv2: read from the exported confusion matrix; fusion: notebook 08 (different test split, 2,661 images)." />

<FactProvenance prefixes={['models']} />

*Disturbed* is the hardest class for every model, and *Cigar Shaped Smooth* (the smallest) is the most sensitive to the model family: a recall of <Fact k="models.simplecnn.recall.cigar_shaped_smooth" format="num" digits={2} /> for SimpleCNN against <Fact k="models.efficientnet.recall.cigar_shaped_smooth" format="num" digits={2} /> for EfficientNet-B0.

## Examples

<FigureGallery figures={classFigures} columns={2} />

<RelatedPages pages={[
  { href: '/astrovision/data/sdss-crossmatch', title: 'SDSS DR16 Crossmatch', desc: 'How colours and populations are defined', category: 'science' },
  { href: '/astrovision/results/benchmarking', title: 'Model Benchmarking', desc: 'Per-class results in context', category: 'science' },
  { href: '/astrovision/results/limitations', title: 'Limitations', desc: 'Why Disturbed stays hard', category: 'science' },
]} />
