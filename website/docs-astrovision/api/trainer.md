---
title: trainer.py
description: API reference for AstroVision's training loop — train() with AdamW, cosine schedule, label smoothing, balanced-accuracy checkpointing and W&B logging.
sidebar_position: 2
---

import RelatedPages from '@site/src/components/RelatedPages';

{/* code: src/astrovision/trainer.py · no numeric result on this page */}

# trainer.py

## `train(model, train_loader, val_loader, model_name='astrovision', epochs=30, lr=1e-3, weight_decay=1e-4, use_wandb=True, device='cuda') → nn.Module`

| Argument | Meaning |
|---|---|
| `model` | any `nn.Module` returning logits |
| `train_loader`, `val_loader` | loaders yielding `(images, labels)` |
| `model_name` | checkpoint stem: weights go to `checkpoints/<model_name>_best.pt` (directory next to `src/`, created on import) |
| `epochs`, `lr`, `weight_decay` | AdamW over `requires_grad` parameters; `CosineAnnealingLR(T_max=epochs, eta_min=lr × 0.01)` |
| `use_wandb` | log to W&B project `AstroVision` (loss, accuracy, balanced accuracy, learning rate per epoch) |
| `device` | falls back to CPU if CUDA is unavailable |

Behaviour:

- loss: `CrossEntropyLoss(label_smoothing=0.1)`;
- each epoch computes `loss`, `acc` and `balanced_acc` (scikit-learn) on train and validation;
- the checkpoint is overwritten when validation balanced accuracy improves; at the end the best weights are **reloaded** into the model, which is returned;
- the best-epoch criterion is balanced accuracy on the validation set, never the test set.

Not included: mixed precision (the DINOv2 and U-Net notebooks use their own loops with FP16 autocast), early stopping, class re-weighting.

Private helper `_run_epoch(model, loader, optimizer, criterion, device, train)` returns `{'loss', 'acc', 'balanced_acc'}`; it is convenient for test-set evaluation ([guide](../guides/train-classifier.md)).

```python
model = train(model, train_loader, val_loader,
              model_name='efficientnet_galaxy10_finetune', epochs=25, lr=1e-4, use_wandb=False)
```

<RelatedPages pages={[
  { href: '/astrovision/api/models', title: 'models.py', desc: 'Models to train', category: 'api' },
  { href: '/astrovision/guides/train-classifier', title: 'Train a Classifier', desc: 'Guide', category: 'guides' },
]} />
