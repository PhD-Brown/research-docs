---
title: Non-parametric Morphometrics
description: CAS, Gini and M20 morphometry computed on Galaxy10 DECaLS images with Otsu masks — definitions, per-class medians and how well each statistic separates the classes.
sidebar_position: 7
---

import Fact from '@site/src/components/astrovision/Fact';
import ClassTable from '@site/src/components/astrovision/ClassTable';
import FigureGallery from '@site/src/components/FigureGallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json morphometry.* (data/morphometry_galaxy10.csv) · notebook 06 (complement: KS ranking not quoted) · code: src/astrovision/morphometry.py */}

export const morphFigures = [
  { src: '/img/astrovision/seg_cas_diagram.png', title: 'CAS diagram', desc: 'Concentration–asymmetry–smoothness plane by class.' },
  { src: '/img/astrovision/seg_morphometry_by_class.png', title: 'Morphometry by class', desc: 'Distributions of C, A, S, Gini, M20 per class.' },
  { src: '/img/astrovision/seg_dino_morpho_corr.png', title: 'PCA(DINOv2) × morphometry', desc: 'Spearman correlations with the first ten components of zero-shot DINOv2 features.' },
];

# Non-parametric Morphometrics

`GalaxyMorphometry` computes the classical non-parametric statistics used in galaxy-structure studies on a single image. They need no training and give interpretable, physically grounded descriptors to compare with learned features.

## Method

1. Convert RGB to luminance (0.299 R + 0.587 G + 0.114 B).
2. Subtract the sky level (10th percentile of pixel values).
3. Build the galaxy mask: Otsu threshold on the background-subtracted image, fill holes, keep the largest connected component. The centre is the flux-weighted centre of mass.

| Statistic | Definition (reference) | Reading |
|---|---|---|
| **C** concentration | 5 log₁₀(r₈₀ / r₂₀) (Conselice 2003) | higher = flux concentrated toward the centre |
| **A** asymmetry | Σ\|I − I₁₈₀\| / (2 Σ\|I\|) (Abraham 1996) | higher = disturbed or merging |
| **S** smoothness | Σ\|I − I_smooth\| / Σ\|I\| (Gaussian σ = 3 px) | higher = clumpy, high-frequency structure |
| **Gini** | inequality of flux among pixels (Lotz 2004) | near 1 = a few pixels carry most flux |
| **M20** | log₁₀ of the second-order moment of the brightest 20 % of pixels over the total | more negative = concentrated; near 0 = several bright nuclei |
| Petrosian radius, Sérsic *n* | η = 0.2 radius; 1-D radial-profile fit | length scale; profile shape |

`batch_morphometry` processes a random sub-sample (seed 42, `max_n` = 5,000 by default): <Fact k="morphometry.n" format="int" /> galaxies, of which <Fact k="morphometry.n_valid" format="int" /> have all six statistics.

## Medians by class

<ClassTable columns={[
  { header: 'C', path: 'morphometry.by_class.{slug}.C', format: 'num', digits: 2 },
  { header: 'A', path: 'morphometry.by_class.{slug}.A', format: 'num', digits: 2 },
  { header: 'S', path: 'morphometry.by_class.{slug}.S', format: 'num', digits: 2 },
  { header: 'Gini', path: 'morphometry.by_class.{slug}.Gini', format: 'num', digits: 3 },
  { header: 'M20', path: 'morphometry.by_class.{slug}.M20', format: 'num', digits: 2 },
  { header: 'n (galaxies)', path: 'morphometry.by_class.{slug}.n', format: 'int' },
]} caption="Source: data/morphometry_galaxy10.csv (class sizes follow the random sub-sample, not the full dataset)." />

Reading the table:

- **Asymmetry** is highest for *Cigar Shaped Smooth* (<Fact k="morphometry.by_class.cigar_shaped_smooth.A" format="num" digits={2} />) and *Edge-on with Bulge* (<Fact k="morphometry.by_class.edge_on_with_bulge.A" format="num" digits={2} />) and lowest for spirals (<Fact k="morphometry.by_class.unbarred_tight_spiral.A" format="num" digits={2} /> for *Unbarred Tight Spiral*). *Disturbed* and *Merging* sit in the middle (<Fact k="morphometry.by_class.disturbed.A" format="num" digits={2} />, <Fact k="morphometry.by_class.merging.A" format="num" digits={2} />), contrary to the textbook expectation that A flags disturbed systems. The notebooks do not investigate why; mask and centring effects on small cut-outs are a candidate, not a tested explanation.
- **Concentration** is highest for the edge-on classes (<Fact k="morphometry.by_class.edge_on_without_bulge.C" format="num" digits={2} /> for *Edge-on without Bulge*) and lowest for spirals (<Fact k="morphometry.by_class.unbarred_tight_spiral.C" format="num" digits={2} /> for *Unbarred Tight Spiral*).
- **Sérsic *n*** stays close to 1 for every class (median <Fact k="morphometry.overall.sersic_n" format="num" digits={2} /> overall, <Fact k="morphometry.by_class.round_smooth.sersic_n" format="num" digits={2} /> for *Round Smooth*), whereas smooth ellipticals should approach 4: the radial-profile proxy does not separate morphologies and should not be interpreted physically.

:::caution[Mask dependence]
Every statistic depends on the Otsu mask, which responds to **brightness**, not to galactic structure. The attention-guided variant ([Attention & Grad-CAM](../results/attention-gradcam.md)) replaces the mask by the DINOv2 attention map; its `C` uses a different formula (ratio of cumulative flux in the mask), so its values are **not comparable** with the `C` of this page.
:::

<FigureGallery figures={morphFigures} columns={3} />

<RelatedPages pages={[
  { href: '/astrovision/guides/compute-morphometry', title: 'Compute Morphometry', desc: 'Run it on your images', category: 'guides' },
  { href: '/astrovision/results/physical-interpretation', title: 'Physical Interpretation', desc: 'Correlations with DINOv2 features', category: 'science' },
  { href: '/astrovision/api/morphometry', title: 'morphometry.py', desc: 'API reference', category: 'api' },
]} />
