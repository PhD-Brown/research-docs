---
title: Train a Classifier
description: Train SimpleCNN or EfficientNet-B0 on Galaxy10 DECaLS with AstroVision's shared training loop, including the two-phase EfficientNet recipe, and evaluate balanced accuracy.
sidebar_position: 2
---

import Fact from '@site/src/components/astrovision/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* code: src/astrovision/{models,trainer,data_loader}.py · recipe values: notebook 01 (facts.json models.simplecnn.*, models.efficientnet.*) */}

# Train a Classifier

`trainer.train` is the loop used for SimpleCNN, EfficientNet-B0 and the DINOv2 head: AdamW on trainable parameters, cosine schedule down to 1 % of the initial learning rate, cross-entropy with label smoothing 0.1, validation balanced accuracy after each epoch, best checkpoint saved to `checkpoints/<model_name>_best.pt` and reloaded at the end.

## Step 1 — Data

```python
from src.astrovision import load_galaxy10_splits
train_loader, val_loader, test_loader = load_galaxy10_splits(batch_size=64, num_workers=0)
```

The split is a seed-42 random permutation ([Data Preparation](../data/data-preparation.md)).

## Step 2 — SimpleCNN from scratch

```python
from src.astrovision import build_model, train
model = build_model('simplecnn')
model = train(model, train_loader, val_loader,
              model_name='simplecnn_galaxy10', epochs=30, lr=1e-3, use_wandb=False, device='cuda')
```

Reference recipe: <Fact k="models.simplecnn.epochs" /> epochs at 1e-3 (see [Baseline CNN](../models/baseline-cnn.md)).

## Step 3 — EfficientNet-B0 in two phases

```python
effnet = build_model('efficientnet', freeze_backbone=True)       # phase 1: head only
effnet = train(effnet, train_loader, val_loader,
               model_name='efficientnet_galaxy10_warmup', epochs=5, lr=1e-3, use_wandb=False)

for p in effnet.parameters():                                    # phase 2: unfreeze everything
    p.requires_grad = True
effnet = train(effnet, train_loader, val_loader,
               model_name='efficientnet_galaxy10_finetune', epochs=25, lr=1e-4, use_wandb=False)
```

The reference recipe uses <Fact k="models.efficientnet.warmup.epochs" /> warm-up epochs and <Fact k="models.efficientnet.finetune.epochs" /> fine-tuning epochs ([EfficientNet-B0](../models/efficientnet.md)).

## Step 4 — Evaluate on the test set

`trainer._run_epoch` returns `loss`, `acc` and `balanced_acc`; reuse it for the test loader:

```python
import torch.nn as nn
from src.astrovision.trainer import _run_epoch
m = _run_epoch(model, test_loader, None, nn.CrossEntropyLoss(), 'cuda', train=False)
print(m['acc'], m['balanced_acc'])
```

## DINOv2 and fusion

The DINOv2 classifier (`DINOv2Classifier`) is defined in notebook 04 and the fusion model has its own loop (`fusion.train_fusion`); neither goes through `build_model`. Follow the notebooks: [fine-tuned DINOv2](../models/dinov2-finetuned.md), [late fusion](../models/late-fusion.md).

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `OSError` from `DataLoader` on Windows | use `num_workers=0` |
| CUDA out of memory with DINOv2 | the notebook uses batch size 32 and FP16 autocast |
| W&B login prompt | pass `use_wandb=False` |
| Rare classes never predicted | expected for SimpleCNN ([Baseline CNN](../models/baseline-cnn.md)) |

<RelatedPages pages={[
  { href: '/astrovision/guides/run-gradcam', title: 'Run GradCAM', desc: 'Explain the trained model', category: 'guides' },
  { href: '/astrovision/api/trainer', title: 'trainer.py', desc: 'API reference', category: 'api' },
]} />
