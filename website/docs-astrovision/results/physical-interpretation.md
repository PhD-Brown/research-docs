---
title: Physical Interpretation
description: What DINOv2 features, SDSS colours and CAS/Gini/M20 morphometry say about each other on Galaxy10 DECaLS — moderate correlations, a null result for the U-Net bulge fraction, and the caveats.
sidebar_position: 4
---

import Fact from '@site/src/components/astrovision/Fact';
import FactCards from '@site/src/components/astrovision/FactCards';
import FactTable from '@site/src/components/astrovision/FactTable';
import ClassTable from '@site/src/components/astrovision/ClassTable';
import FactProvenance from '@site/src/components/astrovision/FactProvenance';
import FigureGallery from '@site/src/components/astrovision/Gallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json dinov2_pca.* (figures/seg_dino_morpho_corr.png), crossmatch.*, segmentation.* (data/master_synthesis.csv), dataset.by_class.* · notebooks 05–07 (complement) · FACTS_INDEX §4.4–4.5, §4.8 */}

export const physFigures = [
  { src: '/img/astrovision/seg_dino_morpho_corr.png', title: 'PCA(DINOv2) × morphometry', desc: 'Spearman ρ between principal components and C, A, S, Gini, M20, Sérsic n.' },
  { src: '/img/astrovision/xm_feature_correlation.png', title: 'DINOv2 components × SDSS properties', desc: 'Spearman ρ with g−r, u−r, Mr, z.' },
  { src: '/img/astrovision/xm_umap_spectral.png', title: 'UMAP coloured by SDSS property', desc: 'Zero-shot DINOv2 features, sub-sample of galaxies.' },
  { src: '/img/astrovision/xm_regression_color.png', title: 'Predicting g−r from DINOv2', desc: 'Regression results.' },
  { src: '/img/astrovision/syn_bulge_vs_color.png', title: 'U-Net bulge fraction versus colour', desc: 'Synthesis notebook.' },
];

# Physical Interpretation

The central question — *do DINOv2 features encode physical galaxy properties?* — is tested by correlating the representation with independent measurements: morphometry (from the images) and SDSS colour (from a separate survey).

## Key results

<FactCards cards={[
  { k: 'dinov2_pca.pc2.gini_rho', format: 'num', digits: 2, label: 'PC2 × Gini (ρ)', context: 'second component of zero-shot DINOv2 features', accent: '#38BDF8' },
  { k: 'crossmatch.pc2_gr_rho', format: 'num', digits: 2, label: 'PC2 × g−r (ρ)', context: 'SDSS colour, zero-shot features', accent: '#A78BFA' },
  { k: 'crossmatch.lasso_gr.r2_mean', format: 'num', digits: 2, label: 'R² predicting g−r', context: 'Lasso, cross-validated, 768 features', accent: '#34D399' },
  { k: 'segmentation.spearman_bulge.gr.rho', format: 'signed', digits: 3, label: 'Bulge fraction × g−r (ρ)', context: 'U-Net masks · essentially null', accent: '#F59E0B' },
]} />

<FactProvenance prefixes={['dinov2_pca', 'crossmatch.lasso_gr', 'crossmatch.pc2_gr_rho']} />

## 1 — The principal axes of DINOv2 features

On the <Fact k="morphometry.n_valid" format="int" /> galaxies with morphometry, the second principal component of the **zero-shot** features (PCA on L2-normalised vectors) correlates with several statistics at once: Gini (ρ = <Fact k="dinov2_pca.pc2.gini_rho" format="num" digits={2} />), smoothness S (<Fact k="dinov2_pca.pc2.smoothness_rho" format="num" digits={2} />) and, with SDSS, g−r (<Fact k="crossmatch.pc2_gr_rho" format="num" digits={2} />). PC2 carries <Fact k="dinov2_pca.pc2.variance_pct" format="pctRaw" /> of the feature variance and PC1 <Fact k="dinov2_pca.pc1.variance_pct" format="pctRaw" />.

:::note[How to read this]
These are rank correlations of moderate size, obtained without any astronomical training of the backbone, which is the interesting part. They are consistent with the picture that concentration and colour covary along the Hubble sequence, so a feature axis that tracks morphology will correlate with both. The analysis does not control for class label, so it cannot separate "DINOv2 encodes colour" from "DINOv2 encodes morphology, which correlates with colour". Values for PC2 are read from the exported figure.
:::

## 2 — Predicting colour

A Lasso regression of g−r on the 768 zero-shot features gives R² = <Fact k="crossmatch.lasso_gr.r2_mean" format="num" digits={3} /> ± <Fact k="crossmatch.lasso_gr.r2_std" format="num" digits={3} /> across folds (<Fact k="crossmatch.lasso_gr.nonzero_features" format="int" /> of 768 coefficients non-zero) on <Fact k="crossmatch.n_with_gr" format="int" /> galaxies. Colour is therefore **partly** recoverable from visual features; more than half of its variance is not. Older descriptions quote R² = 0.536, which does not appear in the notebook output and is not used here.

## 3 — Colour across morphology

<ClassTable columns={[
  { header: 'Median g−r', path: 'dataset.by_class.{slug}.median_gr', format: 'num' },
  { header: 'Blue cloud', path: 'dataset.by_class.{slug}.pct_blue_cloud', format: 'pct', digits: 0 },
  { header: 'Red sequence', path: 'dataset.by_class.{slug}.pct_red_sequence', format: 'pct', digits: 0 },
]} caption="Source: data/synthesis_summary_table.csv." />

The astrophysical expectations hold: smooth and edge-on-with-bulge galaxies are mostly red, loose and tight spirals mostly blue. *Disturbed* galaxies are mostly blue (<Fact k="dataset.by_class.disturbed.pct_blue_cloud" format="pct" digits={0} />) while *Merging* ones are mostly red (<Fact k="dataset.by_class.merging.pct_red_sequence" format="pct" digits={0} />), which is not what a simple "interaction triggers star formation" picture predicts; colour is a coarse photometric proxy and classes are crowd-sourced.

## 4 — U-Net bulge fraction: a null result

Does the bright-core fraction from the U-Net track stellar population? No:

<FactTable labelHeader="Spearman ρ with bulge fraction" columns={[{ header: 'ρ', format: 'signed', digits: 3 }, { header: 'Galaxies', format: 'int' }]} rows={[
  { label: 'g−r', keys: ['segmentation.spearman_bulge.gr.rho', 'segmentation.spearman_bulge.gr.n'] },
  { label: 'Absolute magnitude Mr', keys: ['segmentation.spearman_bulge.mr.rho', 'segmentation.spearman_bulge.mr.n'] },
  { label: 'Redshift z_photo', keys: ['segmentation.spearman_bulge.z_photo.rho', 'segmentation.spearman_bulge.z_photo.n'] },
]} caption="Computed from data/master_synthesis.csv." />

The median bulge fraction is <Fact k="segmentation.bulge_median_blue_cloud" format="num" digits={3} /> for blue-cloud and <Fact k="segmentation.bulge_median_red_sequence" format="num" digits={3} /> for red-sequence galaxies — indistinguishable. This is expected, since the "bulge" is a brightness quantile ([U-Net page](../models/segmentation.md)). The stronger correlation with redshift (ρ = <Fact k="segmentation.spearman_bulge.z_photo.rho" format="signed" digits={2} />) suggests an angular-size or resolution effect rather than physics.

<FigureGallery figures={physFigures} columns={3} />

## Summary of claims

| Claim | Support | Strength |
|---|---|---|
| DINOv2 zero-shot features correlate with Gini, S and g−r | Spearman ρ, moderate (section 1) | Suggests a shared morphology–colour axis; confounded by class |
| g−r is partly predictable from the features | Lasso, cross-validated R² (section 2) | Moderate |
| Bulge fraction (U-Net) tracks stellar population | ρ close to 0 (section 4) | Not supported |
| Visual features encode metallicity | no spectroscopic data | Untested |

<RelatedPages pages={[
  { href: '/astrovision/results/limitations', title: 'Limitations', desc: 'Confounds and caveats', category: 'science' },
  { href: '/astrovision/data/sdss-crossmatch', title: 'SDSS DR16 Crossmatch', desc: 'Where g−r comes from', category: 'science' },
  { href: '/astrovision/overview/link-to-astrospectro', title: 'Bridge to AstroSpectro', desc: 'The untested spectroscopic link', category: 'concepts' },
]} />
