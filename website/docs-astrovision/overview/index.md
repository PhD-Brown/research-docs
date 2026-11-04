---
title: "What is AstroVision?"
description: "AstroVision classifies 17,736 Galaxy10 DECaLS images into 10 morphology classes and tests whether self-supervised DINOv2 features carry physical information (colour, concentration)."
sidebar_position: 1
---

import Fact from '@site/src/components/astrovision/Fact';
import FactCards from '@site/src/components/astrovision/FactCards';
import FactProvenance from '@site/src/components/astrovision/FactProvenance';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/astrovision/FACTS_INDEX.md §1–§3 · data/master_synthesis.csv, data/fusion_ablation_results.json · scores: notebooks 02–09 (complement, see FACTS_INDEX §0) */}

# What is AstroVision?

AstroVision is an open-source pipeline for **galaxy morphology** on Galaxy10 DECaLS (<Fact k="dataset.n_images" /> RGB images of <Fact k="dataset.image_size" />×<Fact k="dataset.image_size" /> pixels, <Fact k="dataset.n_classes" /> classes). It is the image-domain companion of [AstroSpectro](/docs/astrospectro), which works on stellar spectra. Beyond classification, it asks whether features learned **without any astronomy data** also encode measurable physical properties of galaxies.

:::info[The scientific question]
Do self-supervised visual representations (DINOv2 ViT-B/14) encode physical galaxy structure — concentration, colour, stellar population — or only appearance? The evidence collected so far is correlational: see [Physical Interpretation](../results/physical-interpretation.md) and [Limitations](../results/limitations.md).
:::

---

## Key results

<FactCards cards={[
  { k: 'models.dinov2_ft.test.balanced_accuracy', format: 'pct', label: 'Balanced accuracy', context: 'DINOv2 ViT-B/14 fine-tuned · test set', accent: '#34D399' },
  { k: 'models.efficientnet.test.balanced_accuracy', format: 'pct', label: 'Balanced accuracy', context: 'EfficientNet-B0 fine-tuned · test set', accent: '#38BDF8' },
  { k: 'unet.test.miou', format: 'num', label: 'U-Net test mIoU', context: '3 pixel classes · against Otsu pseudo-labels', accent: '#F59E0B' },
  { k: 'uncertainty.conformal.coverage_test', format: 'pct', label: 'Conformal coverage', context: 'target 90 % · mean set size 1.09 · fusion model', accent: '#A78BFA' },
  { k: 'crossmatch.match_rate', format: 'pct', label: 'SDSS DR16 match', context: '3″ radius · photometry for most galaxies', accent: '#FB923C' },
]} />

<FactProvenance prefixes={['models', 'unet', 'uncertainty']} />

The per-model comparison, with its test-set caveats, is on [Model Benchmarking](../results/benchmarking.md). The multimodal **late-fusion** model reaches <Fact k="models.fusion.test.balanced_accuracy" format="pct" /> in a single run, but its ablation shows that the extra modalities add no measurable gain over the DINOv2 branch alone — see [Late-Fusion Multimodal](../models/late-fusion.md).

---

## What the pipeline contains

| Stage | What it does | Page |
|---|---|---|
| Data | Galaxy10 DECaLS (HDF5), seed-42 split, SDSS DR16 cross-match | [Data](../data/index.md) |
| Image classifiers | SimpleCNN, EfficientNet-B0, DINOv2 linear probe and fine-tuning | [Models](../models/baseline-cnn.md) |
| Fusion | DINOv2 features + morphometry (CAS, Gini, M20) + SDSS colours | [Late-Fusion](../models/late-fusion.md) |
| Segmentation | Otsu pseudo-labels → U-Net (background / disk / bright core) | [U-Net](../models/segmentation.md) |
| Morphometry | Non-parametric CAS / Gini / M20 on Otsu and on attention masks | [Morphometry](../models/morphometry.md) |
| Uncertainty | MC Dropout, temperature scaling, conformal prediction | [Uncertainty](../results/uncertainty.md) |
| Interpretation | Grad-CAM, DINOv2 attention maps, colour and population links | [Attention](../results/attention-gradcam.md) |

:::caution[Reading the numbers]
Scores come from the project notebooks' output cells; the documentation data pack contains no metrics file for them. Each value carries its origin (hover over a number, or read `_facts/astrovision/FACTS_INDEX.md`). Models were not all evaluated on the same test images, and some headline numbers from earlier descriptions of the project do not survive a comparison with the ablation: the discrepancies are listed in the data registry rather than smoothed over.
:::

<RelatedPages pages={[
  { href: '/astrovision/overview/key-results', title: 'Key Results', desc: 'Headline numbers with context and caveats', category: 'science' },
  { href: '/astrovision/overview/scientific-motivation', title: 'Scientific Motivation', desc: 'Why test DINOv2 on galaxies', category: 'concepts' },
  { href: '/astrovision/data', title: 'Data Overview', desc: 'Galaxy10 DECaLS and the SDSS cross-match', category: 'science' },
  { href: '/astrovision/guides/installation', title: 'Installation', desc: 'Run the pipeline yourself', category: 'guides' },
]} />
