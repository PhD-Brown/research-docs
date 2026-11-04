---
title: Data Preparation
description: How Galaxy10 DECaLS is split, augmented and normalised for the CNN, DINOv2 and fusion models, and how missing auxiliary data are handled.
sidebar_position: 5
---

import Fact from '@site/src/components/astrovision/Fact';
import FactTable from '@site/src/components/astrovision/FactTable';
import FactProvenance from '@site/src/components/astrovision/FactProvenance';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json split.*, dataset.*, models.fusion.coverage.* · code: src/astrovision/data_loader.py, fusion.py, notebooks 04 and 08 (complement) */}

# Data Preparation

## Two split protocols

Two different splits are used in the project, so test sets differ between experiments.

<FactTable labelHeader="Protocol" columns={[{ header: 'Train', format: 'int' }, { header: 'Val', format: 'int' }, { header: 'Test', format: 'int' }]} rows={[
  { label: 'Random permutation, seed 42 (notebooks 01–06: CNNs, DINOv2, U-Net)', keys: ['split.train', 'split.val', 'split.test'] },
  { label: 'Stratified 70/15/15, random_state 42 (notebooks 08–09: fusion, uncertainty)', keys: ['split.fusion.train', 'split.fusion.val', 'split.fusion.test'] },
]} caption="Sizes read from the notebook outputs (FACTS_INDEX §3)." />

<FactProvenance prefixes={['split']} />

`load_galaxy10_splits` shuffles indices with `numpy.random.default_rng(seed)` (seed <Fact k="split.seed" />), takes 15 % for test and 15 % for validation, and returns the rest for training; it is **not stratified**. The fusion notebooks use scikit-learn's stratified `train_test_split` instead. Because the two test sets are different image subsets, results from the two groups of notebooks are not strictly comparable (see [Benchmarking](../results/benchmarking.md)).

## Image preprocessing

| Model | Input | Training augmentation | Evaluation |
|---|---|---|---|
| SimpleCNN, EfficientNet-B0 | <Fact k="dataset.image_size" />×<Fact k="dataset.image_size" /> tensor in [0, 1], ImageNet mean/std | horizontal and vertical flips, rotation up to 180°, colour jitter (brightness 0.2, contrast 0.2, saturation 0.1) | normalisation only |
| DINOv2 ViT-B/14 | resize to 256, crop to <Fact k="dataset.dino_input_size" />×<Fact k="dataset.dino_input_size" /> | same family plus random crop | resize to 256, centre crop to 224 (no augmentation) |

Flips and arbitrary rotations are appropriate because galaxy orientation on the sky carries no label information. Normalisation uses ImageNet statistics for all pretrained backbones (EfficientNet, DINOv2).

## Auxiliary modalities for the fusion model

The [fusion model](../models/late-fusion.md) takes DINOv2 features (768 values), morphometry (5 values: C, A, S, Gini, M20) and SDSS colours (g−r, u−r, Mr). Auxiliary tables do not cover every galaxy:

- morphometry exists for <Fact k="models.fusion.coverage.morph" format="int" /> galaxies; <Fact k="models.fusion.coverage.morph_masked" format="int" /> are masked;
- the colour triple exists only where `Mr` is defined: <Fact k="crossmatch.n_with_mr" format="int" /> galaxies.

Missing values are replaced by 0 after standardisation (scalers are fitted on valid rows only), and the corresponding branch embedding is multiplied by a validity mask, so the network learns to ignore absent modalities.

:::caution[Features and splits]
The DINOv2 features fed to the fusion model are cached (`dino_features.npy`, not in the data pack). The notebook extracts them from the **fine-tuned** backbone when the cache is missing, and the fine-tuning split differs from the fusion split. If the cache was built that way, part of the fusion test set was seen by the backbone during fine-tuning. This is documented as an open verification point in the [fusion page](../models/late-fusion.md).
:::

<RelatedPages pages={[
  { href: '/astrovision/guides/train-classifier', title: 'Train a Classifier', desc: 'Reproduce the training runs', category: 'guides' },
  { href: '/astrovision/results/evaluation-protocol', title: 'Evaluation Protocol', desc: 'Reporting conventions', category: 'guides' },
]} />
