---
title: Data Overview
description: The datasets behind AstroVision — Galaxy10 DECaLS images, the SDSS DR16 cross-match and the derived morphometry tables — with their sizes and coverage.
sidebar_position: 1
---

import Fact from '@site/src/components/astrovision/Fact';
import FactCards from '@site/src/components/astrovision/FactCards';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json dataset.*, crossmatch.*, morphometry.n, attention_morphometry.n · data/master_synthesis.csv, morphometry_galaxy10.csv, attn_morphometry_df.csv */}

# Data Overview

AstroVision uses a single image survey — **Galaxy10 DECaLS** — and enriches it with a photometric cross-match and two morphometry tables. All sizes below are read from the documentation data pack.

## At a glance

<FactCards cards={[
  { k: 'dataset.n_images', format: 'int', label: 'Galaxy10 images', context: '256×256 RGB · 10 classes', accent: '#38BDF8' },
  { k: 'crossmatch.n_matched', format: 'int', label: 'Matched to SDSS DR16', context: '3″ radius, photometry', accent: '#34D399' },
  { k: 'crossmatch.n_with_mr', format: 'int', label: 'With absolute magnitude', context: 'needs a spectroscopic redshift', accent: '#F59E0B' },
  { k: 'morphometry.n', format: 'int', label: 'Galaxies with CAS/Gini/M20', context: 'random sub-sample', accent: '#A78BFA' },
]} />

## Tables used by the analyses

| Table | Rows | Origin | Page |
|---|---|---|---|
| Galaxy10 DECaLS (HDF5) | <Fact k="dataset.n_images" format="int" /> | Zenodo record 10845026 | [Galaxy10 DECaLS](./galaxy10-decals.md) |
| SDSS cross-match | <Fact k="crossmatch.n_matched" format="int" /> | CDS XMatch, VizieR `V/154/sdss16` | [SDSS DR16 Crossmatch](./sdss-crossmatch.md) |
| Master synthesis table | <Fact k="dataset.n_images" format="int" /> × 58 columns | cross-match + U-Net bulge fractions | [Physical Interpretation](../results/physical-interpretation.md) |
| Morphometry (Otsu mask) | <Fact k="morphometry.n" format="int" /> | `batch_morphometry`, seed 42 | [Morphometry](../models/morphometry.md) |
| Morphometry (attention mask) | <Fact k="attention_morphometry.n" format="int" /> | 200 galaxies per class | [Attention & Grad-CAM](../results/attention-gradcam.md) |

:::note[Coverage differs by modality]
Only a fraction of galaxies carry each auxiliary modality: morphometry exists for <Fact k="morphometry.n" format="int" /> of <Fact k="dataset.n_images" format="int" /> images and absolute magnitudes for <Fact k="crossmatch.n_with_mr" format="int" />. The [fusion model](../models/late-fusion.md) masks missing values rather than dropping galaxies.
:::

<RelatedPages pages={[
  { href: '/astrovision/data/galaxy10-decals', title: 'Galaxy10 DECaLS', desc: 'Images, classes and imbalance', category: 'science' },
  { href: '/astrovision/data/morphology-classes', title: 'Morphology Classes', desc: 'The 10 classes with their properties', category: 'science' },
  { href: '/astrovision/data/data-preparation', title: 'Data Preparation', desc: 'Splits, augmentation, normalisation', category: 'guides' },
]} />
