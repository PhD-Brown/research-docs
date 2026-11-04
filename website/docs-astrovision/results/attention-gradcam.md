---
title: "Attention & GradCAM"
description: Grad-CAM for the CNNs and CLS-token attention for DINOv2, plus attention-guided morphometry — where the models look, and whether attention masks separate morphology classes better than Otsu masks.
sidebar_position: 3
---

import Fact from '@site/src/components/astrovision/Fact';
import FactTable from '@site/src/components/astrovision/FactTable';
import ClassTable from '@site/src/components/astrovision/ClassTable';
import FactProvenance from '@site/src/components/astrovision/FactProvenance';
import FigureGallery from '@site/src/components/astrovision/Gallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json attention.*, attention_morphometry.* (data/attn_morphometry_df.csv; notebook 10 complement) · code: src/astrovision/gradcam.py, attention_morphometry.py · FACTS_INDEX §4.9 */}

export const gradFigures = [
  { src: '/img/astrovision/gradcam_efficientnet.jpg', title: 'Grad-CAM — EfficientNet-B0', desc: 'Overlay of class-specific heat maps.' },
  { src: '/img/astrovision/gradcam_simplecnn.jpg', title: 'Grad-CAM — SimpleCNN', desc: 'Same procedure on the from-scratch CNN.' },
  { src: '/img/astrovision/dino_attention_before_after.jpg', title: 'DINOv2 attention, before and after fine-tuning', desc: 'CLS-token attention maps.' },
  { src: '/img/astrovision/dino_attention_by_class.png', title: 'DINOv2 attention by class', desc: 'Zero-shot backbone.' },
  { src: '/img/astrovision/dino_multihead_attention.png', title: 'Attention per head', desc: 'The 12 heads of the last block.' },
];
export const attnFigures = [
  { src: '/img/astrovision/attn_morpho_gallery.jpg', title: 'Attention masks', desc: 'Galaxy, attention map and mask.' },
  { src: '/img/astrovision/attn_morpho_components.png', title: 'Mask components', desc: 'Connected components of the attention masks.' },
  { src: '/img/astrovision/attn_vs_otsu_comparison.png', title: 'Attention versus Otsu', desc: 'Per-class distributions of the statistics.' },
];

# Attention & GradCAM

## Grad-CAM (CNNs)

`GradCAM` hooks a target layer, weights its activations by the spatially averaged gradient of the class logit, applies a ReLU, upsamples to the input size and normalises to [0, 1]. Target layers: the 128→256 convolution for `SimpleCNN`, the last `features` block for EfficientNet-B0 (`model.gradcam_target`). `plot_gradcam_grid` renders image · heat map · overlay with the predicted class and a ✓ / ✗ marker.

:::caution[Heat maps are not evidence of physics]
A heat map shows where the logit is sensitive, not that the model uses a physically meaningful feature. The figures are qualitative; no quantitative faithfulness test (deletion curves, sanity checks) was run.
:::

## DINOv2 attention (ViT)

For the ViT the explanation is the **CLS-token attention** of the last block, averaged over the 12 heads and reshaped to the 16×16 patch grid (Caron et al. 2021). The qualitative observation of the project: with the frozen backbone, several heads attend to bright background stars; after fine-tuning, the attention covers the galaxy body. This is read from the figures, not quantified.

<FigureGallery figures={gradFigures} columns={3} />

## Attention-guided morphometry

`AttentionMorphometry` replaces the Otsu mask of [CAS/Gini/M20](../models/morphometry.md) with a mask from the fine-tuned DINOv2 attention map (threshold at the <Fact k="attention.mask_percentile" />th percentile, holes filled) and recomputes the statistics on it. The aim is to define the galaxy region by *structure* rather than brightness. It was applied to <Fact k="attention_morphometry.n" format="int" /> galaxies, 200 per class.

### Do the statistics separate classes better?

A Kruskal–Wallis statistic across the ten classes measures class separation (larger = better):

<FactTable labelHeader="Statistic" columns={[{ header: 'Otsu mask', format: 'num', digits: 1 }, { header: 'Attention mask', format: 'num', digits: 1 }]} rows={[
  { label: 'C (concentration)', keys: ['attention.kruskal_wallis.c.otsu', 'attention.kruskal_wallis.c.attention'] },
  { label: 'A (asymmetry)', keys: ['attention.kruskal_wallis.a.otsu', 'attention.kruskal_wallis.a.attention'] },
  { label: 'S (smoothness)', keys: ['attention.kruskal_wallis.s.otsu', 'attention.kruskal_wallis.s.attention'] },
  { label: 'Gini', keys: ['attention.kruskal_wallis.gini.otsu', 'attention.kruskal_wallis.gini.attention'] },
  { label: 'M20', keys: ['attention.kruskal_wallis.m20.otsu', 'attention.kruskal_wallis.m20.attention'] },
]} caption="Notebook 10. All p-values print as 0.0000." />

<FactProvenance prefixes={['attention']} />

The attention-based statistics have larger KW values for all five measures, most strikingly M20 (<Fact k="attention.kruskal_wallis.m20.otsu" format="num" digits={1} /> → <Fact k="attention.kruskal_wallis.m20.attention" format="num" digits={1} />).

:::warning[Not a like-for-like comparison]
The Otsu sample has <Fact k="attention.otsu_sample_size" format="int" /> galaxies, the attention sample <Fact k="attention_morphometry.n" format="int" />; a Kruskal–Wallis H grows with sample size, so part of the gap is a sample-size effect. The two `C` statistics also use different formulas. The result is suggestive of better class separation, not a measured improvement.
:::

### Medians by class (attention masks)

<ClassTable columns={[
  { header: 'C', path: 'attention_morphometry.by_class.{slug}.C', format: 'num', digits: 2 },
  { header: 'A', path: 'attention_morphometry.by_class.{slug}.A', format: 'num', digits: 2 },
  { header: 'Gini', path: 'attention_morphometry.by_class.{slug}.Gini', format: 'num', digits: 2 },
  { header: 'M20', path: 'attention_morphometry.by_class.{slug}.M20', format: 'num', digits: 2 },
  { header: 'Components', path: 'attention_morphometry.by_class.{slug}.n_components', format: 'num', digits: 0 },
]} caption="Source: data/attn_morphometry_df.csv. Values are not comparable with the Otsu-mask medians of the Morphometry page." />

The median number of connected components is <Fact k="attention_morphometry.by_class.merging.n_components" format="num" digits={0} /> even for *Merging* galaxies: a 16×16 attention map thresholded at a percentile yields one blob almost always, so the method cannot count multiple nuclei.

### Link with colour

Correlations of the attention statistics with SDSS g−r are tiny: ρ = <Fact k="attention.spearman_gr.c" format="signed" digits={3} /> for C and <Fact k="attention.spearman_gr.m20" format="signed" digits={3} /> for M20 (<Fact k="attention.spearman_gr.n" format="int" /> galaxies). Significant at p &lt; 0.05 with this many galaxies, but explaining under 1 % of the variance.

<FigureGallery figures={attnFigures} columns={3} />

<RelatedPages pages={[
  { href: '/astrovision/guides/run-gradcam', title: 'Run GradCAM', desc: 'Produce the heat maps', category: 'guides' },
  { href: '/astrovision/results/physical-interpretation', title: 'Physical Interpretation', desc: 'What the correlations mean', category: 'science' },
  { href: '/astrovision/api/gradcam', title: 'gradcam.py', desc: 'API reference', category: 'api' },
]} />
