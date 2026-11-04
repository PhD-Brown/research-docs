---
title: Uncertainty Quantification
description: MC Dropout, temperature scaling and conformal prediction applied to the AstroVision fusion model — coverage reaches the 90 % target, while temperature scaling worsens calibration.
sidebar_position: 2
---

import Fact from '@site/src/components/astrovision/Fact';
import FactCards from '@site/src/components/astrovision/FactCards';
import FactTable from '@site/src/components/astrovision/FactTable';
import FactBars from '@site/src/components/astrovision/FactBars';
import FactProvenance from '@site/src/components/astrovision/FactProvenance';
import FigureGallery from '@site/src/components/astrovision/Gallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json uncertainty.* (notebook 09, complement; FACTS_INDEX §4.6–4.7) · code: src/astrovision/uncertainty.py · model: fusion (models.fusion.*) */}

export const uncFigures = [
  { src: '/img/astrovision/uncertainty_mc_dropout.png', title: 'MC Dropout uncertainty', desc: 'Entropy and mutual information by class; correct versus wrong predictions.' },
  { src: '/img/astrovision/calibration_reliability.png', title: 'Reliability diagrams', desc: 'Before and after temperature scaling.' },
  { src: '/img/astrovision/conformal_prediction.png', title: 'Conformal prediction sets', desc: 'Set sizes and examples.' },
];

# Uncertainty Quantification

All analyses of this page use the **late-fusion model** and the stratified test split of notebook 09. Three complementary tools are applied.

## Key results

<FactCards cards={[
  { k: 'uncertainty.mc_dropout.balanced_accuracy', format: 'pct', label: 'MC Dropout balanced acc.', context: '30 stochastic passes, mean probabilities', accent: '#38BDF8' },
  { k: 'uncertainty.conformal.coverage_test', format: 'pct', label: 'Conformal coverage', context: 'target 90 % · evaluation half of the test set', accent: '#34D399' },
  { k: 'uncertainty.conformal.singleton_rate', format: 'pct', label: 'Single-class sets', context: 'mean set size 1.09', accent: '#A78BFA' },
  { k: 'uncertainty.temperature.ece_after', format: 'num', digits: 3, label: 'ECE after scaling', context: 'worse than before (see below)', accent: '#F87171' },
]} />

<FactProvenance prefixes={['uncertainty']} />

## 1 — MC Dropout (epistemic uncertainty)

Dropout stays active at inference and the model is run <Fact k="uncertainty.mc_dropout.passes" /> times. The mean probabilities give a balanced accuracy of <Fact k="uncertainty.mc_dropout.balanced_accuracy" format="pct" /> (the deterministic run scored <Fact k="models.fusion.test.balanced_accuracy" format="pct" />). Predictive entropy has a median of <Fact k="uncertainty.mc_dropout.median_entropy" format="num" digits={2} /> nats; the mutual information, which isolates epistemic uncertainty, has a median of only <Fact k="uncertainty.mc_dropout.median_mutual_info" format="num" digits={3} />.

Uncertainty follows class difficulty: a Kruskal–Wallis test on entropy across classes gives H = <Fact k="uncertainty.kruskal_wallis.entropy_stat" format="num" digits={1} /> (p ≈ 0), and the classes order as the recall tables suggest.

<FactBars title="Median predictive entropy by class (higher = more uncertain)" format="num" digits={2} max={1} perClass="uncertainty.median_entropy_by_class.{slug}" accent="#38BDF8" />

*Disturbed* (<Fact k="uncertainty.median_entropy_by_class.disturbed" format="num" digits={2} />) and *Unbarred Loose Spiral* (<Fact k="uncertainty.median_entropy_by_class.unbarred_loose_spiral" format="num" digits={2} />) are the most uncertain; the edge-on classes the least. Wrongly classified galaxies have a clearly wider entropy distribution than correct ones (figure below), so entropy is a usable error flag.

## 2 — Temperature scaling (calibration)

A single temperature is fitted on validation logits (T* = <Fact k="uncertainty.temperature.t_star" format="num" digits={3} />) by minimising cross-entropy, and applied to the test probabilities.

<FactTable labelHeader="Expected calibration error (15 bins)" columns={[{ header: 'Before', format: 'num', digits: 4 }, { header: 'After', format: 'num', digits: 4 }]} rows={[
  { label: 'Test, MC-averaged probabilities (retained)', highlight: true, keys: ['uncertainty.temperature.ece_before', 'uncertainty.temperature.ece_after'] },
  { label: 'Validation logits, single pass', keys: ['uncertainty.temperature.ece_before_val', 'uncertainty.temperature.ece_after_val'] },
]} caption="Two cells of notebook 09 give different values; both show the ECE increasing." />

:::warning[Temperature scaling did not help]
In both evaluations the ECE **increases** after scaling. A temperature above 1 softens the probabilities; a plausible reading is that a model trained with label smoothing 0.1 is already close to calibrated or under-confident, so softening moves it further away. Two further details of the experiment may contribute: T is fitted on single-pass logits but applied to MC-averaged probabilities, and ECE on about 2,660 samples in 15 bins is noisy. None of these explanations was tested (no reliability-diagram analysis per bin is recorded); the result is reported as found.
:::

## 3 — Conformal prediction (guaranteed coverage)

Split-conformal prediction with the *least ambiguous* score (1 − probability of the true class): the threshold q̂ = <Fact k="uncertainty.conformal.q_hat" format="num" digits={3} /> is chosen on one half of the test set so that sets contain the true class with probability at least 1 − α = <Fact k="uncertainty.conformal.alpha" format="num" digits={2} />. The other half (<Fact k="uncertainty.conformal.n_eval" format="int" /> galaxies) is used for evaluation.

<FactTable labelHeader="Prediction sets (α = 0.10)" columns={[{ header: 'Value', format: 'raw' }]} rows={[
  { label: 'Empirical coverage', keys: ['uncertainty.conformal.coverage_test'] },
  { label: 'Calibration-set coverage', keys: ['uncertainty.conformal.coverage_cal'] },
  { label: 'Mean set size', keys: ['uncertainty.conformal.mean_set_size'] },
  { label: 'Sets with 1 class', keys: ['uncertainty.conformal.size1'] },
  { label: 'Sets with 2 classes', keys: ['uncertainty.conformal.size2'] },
  { label: 'Sets with 3 classes', keys: ['uncertainty.conformal.size3'] },
]} caption="Source: notebook 09 (cells 14–15)." />

Coverage (<Fact k="uncertainty.conformal.coverage_test" format="pct" />) meets the 90 % target, and almost all sets contain a single class (<Fact k="uncertainty.conformal.singleton_rate" format="pct" />): the guarantee is cheap because the underlying classifier is accurate. The guarantee is marginal (averaged over galaxies), not per class: coverage within a hard class such as *Disturbed* is not controlled, and was not measured in the notebook.

<FigureGallery figures={uncFigures} columns={3} />

<RelatedPages pages={[
  { href: '/astrovision/models/late-fusion', title: 'Late-Fusion Multimodal', desc: 'The model analysed here', category: 'science' },
  { href: '/astrovision/results/limitations', title: 'Limitations', desc: 'Scope of these analyses', category: 'science' },
  { href: '/astrovision/results/evaluation-protocol', title: 'Evaluation Protocol', desc: 'Calibration reporting rules', category: 'guides' },
]} />
