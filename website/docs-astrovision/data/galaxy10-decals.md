---
title: Galaxy10 DECaLS
description: Galaxy10 DECaLS — 17,736 RGB galaxy images in 10 morphology classes from Galaxy Zoo DECaLS — with class counts, imbalance and example figures.
sidebar_position: 2
---

import Fact from '@site/src/components/astrovision/Fact';
import FactBars from '@site/src/components/astrovision/FactBars';
import FigureGallery from '@site/src/components/astrovision/Gallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json dataset.* (data/master_synthesis.csv) · notebook 00 (complement, figures only) · figures/eda_*.png, galaxy10_samples.jpg */}

export const edaFigures = [
  { src: '/img/astrovision/galaxy10_samples.jpg', title: 'Galaxy10 samples', desc: 'Random images from the dataset.' },
  { src: '/img/astrovision/eda_class_distribution.png', title: 'Class distribution', desc: 'Images per class.' },
  { src: '/img/astrovision/eda_mean_images.png', title: 'Mean image per class', desc: 'Pixel-wise average of each class.' },
  { src: '/img/astrovision/eda_brightness_contrast.png', title: 'Brightness and contrast', desc: 'Per-class mean brightness and contrast.' },
  { src: '/img/astrovision/eda_rgb_channels.png', title: 'RGB channels', desc: 'Mean channel values per class.' },
  { src: '/img/astrovision/eda_astro_metadata.png', title: 'Astrometric metadata', desc: 'Coordinates, redshift and pixel scale.' },
  { src: '/img/astrovision/eda_pca_pixels.png', title: 'Pixel PCA', desc: 'Projection of raw pixels.' },
];

# Galaxy10 DECaLS

Galaxy10 DECaLS is a curated subset of the **Galaxy Zoo DECaLS** volunteer classifications (Walmsley et al. 2022) distributed as one HDF5 file (about 2.7 GB, Zenodo record 10845026). It holds <Fact k="dataset.n_images" format="int" /> galaxy cut-outs of <Fact k="dataset.image_size" />×<Fact k="dataset.image_size" /> pixels in RGB (DECaLS *g, r, z* bands rendered as colour images) with a label from <Fact k="dataset.n_classes" /> morphology classes. The file also stores coordinates (`ra`, `dec`), a pixel scale and a redshift field.

## Class balance

<FactBars title="Share of images per class" format="pct" digits={1} max={0.2} perClass="dataset.by_class.{slug}.share" accent="#38BDF8" />

The classes are imbalanced: the largest holds <Fact k="dataset.by_class.round_smooth.n" format="int" /> images (*Round Smooth*) and the smallest <Fact k="dataset.by_class.cigar_shaped_smooth.n" format="int" /> (*Cigar Shaped Smooth*), a ratio of <Fact k="dataset.imbalance_ratio" format="num" digits={1} />. A classifier that always predicts the majority class scores <Fact k="dataset.majority_class_accuracy" format="pct" /> accuracy, which is why AstroVision reports **balanced accuracy**. Exact counts per class: [Morphology Classes](./morphology-classes.md).

## Figures

<FigureGallery figures={edaFigures} columns={3} />

:::caution[Labels are volunteer classifications]
Labels come from Galaxy Zoo vote fractions converted to ten hard classes. Classes such as *Disturbed* and *Unbarred Loose Spiral* are intrinsically ambiguous, which bounds achievable accuracy: see [Limitations](../results/limitations.md).
:::

## Loading the data

```python
from src.astrovision.data_loader import download_galaxy10, load_galaxy10_splits

download_galaxy10()                                   # fetches Galaxy10_DECals.h5 from Zenodo if absent
train_loader, val_loader, test_loader = load_galaxy10_splits(batch_size=64, num_workers=0)
```

`num_workers=0` avoids multiprocessing errors on Windows (the project was developed there). Splits are described in [Data Preparation](./data-preparation.md).

<RelatedPages pages={[
  { href: '/astrovision/data/morphology-classes', title: 'Morphology Classes', desc: 'Per-class counts and photometry', category: 'science' },
  { href: '/astrovision/data/data-preparation', title: 'Data Preparation', desc: 'Splits and augmentation', category: 'guides' },
  { href: 'https://zenodo.org/records/10845026', title: 'Zenodo record', desc: 'Galaxy10 DECaLS HDF5', category: 'external' },
]} />
