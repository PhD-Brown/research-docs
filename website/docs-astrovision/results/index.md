---
title: Results Overview
description: Map of the AstroVision results — benchmark, uncertainty, attention, physical interpretation and limitations — with the main number of each section.
sidebar_position: 4
---

import Fact from '@site/src/components/astrovision/Fact';
import FactCards from '@site/src/components/astrovision/FactCards';
import FactProvenance from '@site/src/components/astrovision/FactProvenance';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json models.*, uncertainty.*, dinov2_pca.*, segmentation.* · FACTS_INDEX §1 and §4 */}

# Results Overview

Every result is measured on Galaxy10 DECaLS (<Fact k="dataset.n_images" format="int" /> images, 10 classes). Scores come from notebook outputs and are **single runs**; see [Limitations](./limitations.md) before comparing two numbers.

<FactCards cards={[
  { k: 'models.dinov2_ft.test.balanced_accuracy', format: 'pct', label: 'Best image model', context: 'DINOv2 fine-tuned · balanced accuracy', accent: '#34D399' },
  { k: 'uncertainty.conformal.coverage_test', format: 'pct', label: 'Conformal coverage', context: 'α = 0.10 · fusion model', accent: '#A78BFA' },
  { k: 'dinov2_pca.pc2.gini_rho', format: 'num', digits: 2, label: 'PC2 × Gini (ρ)', context: 'zero-shot DINOv2 features', accent: '#38BDF8' },
  { k: 'segmentation.spearman_bulge.gr.rho', format: 'signed', digits: 3, label: 'U-Net bulge fraction × g−r (ρ)', context: 'essentially uncorrelated', accent: '#F59E0B' },
]} />

<FactProvenance prefixes={['models', 'uncertainty', 'dinov2_pca']} />

| Section | Question | Main finding |
|---|---|---|
| [Model Benchmarking](./benchmarking.md) | How do the five models compare? | Fine-tuned DINOv2 leads; fusion adds nothing measurable in the ablation |
| [Uncertainty Quantification](./uncertainty.md) | Can confidence be trusted? | Conformal sets reach the target coverage; temperature scaling worsens ECE |
| [Attention & Grad-CAM](./attention-gradcam.md) | Where does the model look? | Attention covers the galaxy after fine-tuning; attention masks separate classes better than Otsu masks |
| [Physical Interpretation](./physical-interpretation.md) | Do features encode physics? | Moderate correlations with concentration and colour; no causal claim |
| [Limitations](./limitations.md) | What do these results not show? | Pseudo-labels, split differences, possible feature leakage, ambiguous classes |
| [Evaluation Protocol](./evaluation-protocol.mdx) | How should results be reported? | Balanced accuracy as primary metric |

<RelatedPages pages={[
  { href: '/astrovision/overview/key-results', title: 'Key Results', desc: 'One-page summary', category: 'science' },
  { href: '/astrovision/models/late-fusion', title: 'Late-Fusion Multimodal', desc: 'The fusion ablation', category: 'science' },
]} />
