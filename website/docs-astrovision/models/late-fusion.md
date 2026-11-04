---
title: Late-Fusion Multimodal ⭐
description: A three-branch MLP fusing DINOv2 features, CAS/Gini/M20 morphometry and SDSS colours — and an ablation showing that the added modalities do not measurably improve on the DINOv2 branch alone.
sidebar_position: 5
---

import Fact from '@site/src/components/astrovision/Fact';
import FactCards from '@site/src/components/astrovision/FactCards';
import FactBars from '@site/src/components/astrovision/FactBars';
import FactTable from '@site/src/components/astrovision/FactTable';
import FactProvenance from '@site/src/components/astrovision/FactProvenance';
import FigureGallery from '@site/src/components/FigureGallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json models.fusion.*, ablation.* (data/fusion_ablation_results.json), split.fusion.* · notebook 08 (complement) · FACTS_INDEX §4.1–4.2 · code: src/astrovision/fusion.py */}

export const fusionFigures = [
  { src: '/img/astrovision/fusion_ablation.png', title: 'Ablation', desc: 'Test balanced accuracy for four modality combinations (dashed line: fine-tuned DINOv2 alone).' },
  { src: '/img/astrovision/fusion_confusion.png', title: 'Fusion confusion matrix', desc: 'Single 50-epoch run, test set.' },
];

# Late-Fusion Multimodal ⭐

`GalaxyFusionClassifier` combines three inputs in separate branches that are concatenated late, just before a classification head. The question it tests: does explicit morphometry and photometry add information beyond what DINOv2 already encodes?

## Architecture

| Branch | Input | Layers | Embedding |
|---|---|---|---|
| A — DINOv2 | 768 standardised features | 768 → 512 → 256 (MLP) | 256 |
| B — morphometry | C, A, S, Gini, M20 | 5 → 64 → 32 | 32 |
| C — photometry | g−r, u−r, Mr | 3 → 32 → 16 | 16 |
| Head | concatenation (304) | 256 → 128 → 10, BatchNorm, GELU, dropout | logits |

The full model has <Fact k="models.fusion.params" format="int" /> parameters. Branches B and C are optional, and **missing modalities are masked** (embedding multiplied by a validity flag) instead of imputed: morphometry is available for <Fact k="models.fusion.coverage.morph" format="int" /> galaxies and the photometric triple for <Fact k="crossmatch.n_with_mr" format="int" /> (see [Data Preparation](../data/data-preparation.md)). Training: <Fact k="models.fusion.epochs" /> epochs, learning rate <Fact k="models.fusion.lr" format="sci" />, dropout <Fact k="models.fusion.dropout" format="num" digits={2} />, label smoothing 0.1, AdamW with a cosine schedule.

Why late fusion: the modalities have very different dimensionality and coverage, and a late design lets each branch be switched off — which the ablation below does.

## Results

<FactCards cards={[
  { k: 'models.fusion.test.balanced_accuracy', format: 'pct', label: 'Balanced accuracy', context: 'single 50-epoch run · 2,661 test images', accent: '#F59E0B' },
  { k: 'models.fusion.test.accuracy', format: 'pct', label: 'Accuracy', context: 'same run', accent: '#38BDF8' },
  { k: 'models.dinov2_ft.test.balanced_accuracy', format: 'pct', label: 'DINOv2 fine-tuned alone', context: 'different test split', accent: '#34D399' },
]} />

<FactProvenance prefixes={['models.fusion']} />

### Ablation: what do the extra modalities add?

<FactTable labelHeader="Configuration (30 epochs, test)" columns={[{ header: 'Balanced acc.', format: 'pct', digits: 2 }, { header: 'Δ vs DINOv2 only', format: 'signed', digits: 3 }]} rows={[
  { label: 'DINOv2 only', keys: ['ablation.dinov2_only', 'ablation.delta_vs_dinov2_only.dinov2_only'] },
  { label: 'DINOv2 + morphometry', keys: ['ablation.dinov2_morpho', 'ablation.delta_vs_dinov2_only.dinov2_morpho'] },
  { label: 'DINOv2 + photometry', keys: ['ablation.dinov2_photo', 'ablation.delta_vs_dinov2_only.dinov2_photo'] },
  { label: 'DINOv2 + morphometry + photometry', keys: ['ablation.dinov2_morpho_photo', 'ablation.delta_vs_dinov2_only.dinov2_morpho_photo'] },
]} caption="Source: data/fusion_ablation_results.json (same features, same split as the fusion run)." />

:::tip[Result]
The four configurations lie within about half a point of each other, and the full model (<Fact k="ablation.dinov2_morpho_photo" format="pct" digits={2} />) is slightly *below* the DINOv2-only head (<Fact k="ablation.dinov2_only" format="pct" digits={2} />). The 50-epoch run of the same full architecture scored <Fact k="models.fusion.test.balanced_accuracy" format="pct" digits={2} />: the spread between two trainings of one configuration is as large as the spread between configurations. **There is no evidence that morphometry or SDSS colours improve classification.**
:::

This is consistent with the physical picture: concentration and colour are strongly correlated with morphology, so a representation that already encodes morphology has little left to gain from them, and both auxiliary modalities are missing for most galaxies.

### Where the ~2 points over fine-tuned DINOv2 come from

Fusion scores roughly two points above fine-tuned DINOv2 (<Fact k="models.fusion.test.balanced_accuracy" format="pct" /> against <Fact k="models.dinov2_ft.test.balanced_accuracy" format="pct" />), yet the **DINOv2-only branch already reaches** <Fact k="ablation.dinov2_only" format="pct" />. The gain therefore comes from the MLP head trained on cached, standardised features — not from the added modalities. It is also not a like-for-like comparison:

- the fusion split is stratified with <Fact k="split.fusion.test" format="int" /> test images; the DINOv2 evaluation used a random split with <Fact k="split.test" format="int" /> — different image subsets;
- the cached DINOv2 features (`dino_features.npy`) are, according to the notebook, extracted from the **fine-tuned** backbone. That backbone was trained on a different split, so some of the fusion test images may have been seen during fine-tuning. The data pack does not contain the feature file, so this **cannot be verified here**; until it is, the fusion score should be read as an upper bound.

### Per-class behaviour

<FactBars title="Fusion recall per class (single run, test)" format="pct" digits={0} perClass="models.fusion.recall.{slug}" accent="#F59E0B" />

The run makes <Fact k="models.fusion.test.errors" format="int" /> errors on <Fact k="split.fusion.test" format="int" /> test galaxies, <Fact k="models.fusion.test.errors_high_confidence" format="int" /> of them with a maximum probability above 0.8 — confident mistakes that motivate the [uncertainty analysis](../results/uncertainty.md). *Disturbed* has the lowest recall (<Fact k="models.fusion.recall.disturbed" format="num" digits={2} />, precision <Fact k="models.fusion.precision.disturbed" format="num" digits={2} />).

<FigureGallery figures={fusionFigures} columns={2} />

:::note[Notebook conclusion table]
The "Conclusions" table at the end of notebook 08 still reads "to be measured" for the ablation rows, although the ablation was run and saved afterwards.
:::

<RelatedPages pages={[
  { href: '/astrovision/results/uncertainty', title: 'Uncertainty Quantification', desc: 'MC Dropout, calibration and conformal sets on this model', category: 'science' },
  { href: '/astrovision/models/morphometry', title: 'Non-parametric Morphometrics', desc: 'Branch B inputs', category: 'science' },
  { href: '/astrovision/results/limitations', title: 'Limitations', desc: 'Test-split and feature-provenance caveats', category: 'science' },
  { href: '/astrovision/api/models', title: 'API Reference', desc: 'Module overview', category: 'api' },
]} />
