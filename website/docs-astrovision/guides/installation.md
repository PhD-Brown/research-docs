---
title: Installation
description: Install the AstroVision environment — Python, PyTorch with CUDA, the Python dependencies, optional packages for notebooks — and download Galaxy10 DECaLS.
sidebar_position: 1
---

import Fact from '@site/src/components/astrovision/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* code: AstroVision/requirements.txt, README (hardware notes), src/astrovision/data_loader.py · facts.json dataset.n_images */}

# Installation

## Requirements

- Python 3.11 or later (the project was developed with 3.11).
- A CUDA-capable GPU is recommended; the author used an NVIDIA RTX 5060 Ti (16 GB, Blackwell) on Windows 11.
- Disk: Galaxy10 DECaLS is a single HDF5 file of about 2.7 GB; training caches (features, U-Net predictions) add several GB.
- RAM: the loaders read the whole image array (<Fact k="dataset.n_images" format="int" /> × 256 × 256 × 3 bytes) into memory.

## Steps

```bash
git clone https://github.com/PhD-Brown/AstroVision.git
cd AstroVision
python -m venv .venv && source .venv/bin/activate     # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

`requirements.txt` pins `torch>=2.7.0`, `torchvision>=0.22.0`, `h5py`, `numpy`, `scikit-learn`, `matplotlib`, `pandas`, `wandb` and `tqdm`.

For recent NVIDIA GPUs (RTX 50xx, compute capability 12.0) install the CUDA 12.8 wheels first:

```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cu128
```

### Packages used by the notebooks but not in `requirements.txt`

| Package | Needed for |
|---|---|
| `scipy` | morphometry, Spearman and Kruskal–Wallis tests (installed with scikit-learn) |
| `scikit-image` | Otsu threshold (a mean-based fallback is used if absent) |
| `astroquery`, `astropy` | SDSS and NSA cross-match ([crossmatcher](../api/crossmatcher.md)) |
| `umap-learn` | UMAP figures of the DINOv2 notebooks |
| `segment-anything` | optional SAM segmenter |

## Download the data

```python
from src.astrovision.data_loader import download_galaxy10
download_galaxy10()        # saves data/Galaxy10_DECals.h5 (Zenodo record 10845026), skipped if present
```

## Weights & Biases

`trainer.train` and the other training functions log to W&B by default (`use_wandb=True`, project `AstroVision`). Run `wandb login`, or pass `use_wandb=False` to train offline.

## Windows note

Use `num_workers=0` in every `DataLoader`; multiprocessing workers raised `OSError` in the author's setup.

## Check the installation

```python
import torch
from src.astrovision import build_model, CLASS_NAMES
print(torch.cuda.is_available(), len(CLASS_NAMES))   # expect: True 10
print(sum(p.numel() for p in build_model('simplecnn').parameters()))
```

<RelatedPages pages={[
  { href: '/astrovision/guides/train-classifier', title: 'Train a Classifier', desc: 'Next step', category: 'guides' },
  { href: '/astrovision/data/galaxy10-decals', title: 'Galaxy10 DECaLS', desc: 'About the dataset', category: 'science' },
]} />
