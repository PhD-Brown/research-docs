---
title: "Experiment Tracking (W&B)"
description: "How AstroSpectro optionally logs a training session to Weights & Biases — what is sent, how logging degrades gracefully, and how local session reports remain the reference record."
sidebar_position: 7
---

import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: none — page derived from AS/src/pipeline/wandb_config.py and master.py (_log_to_wandb); no W&B export is available in _facts */}

# Experiment Tracking (W&B)

AstroSpectro can mirror each training session to [Weights & Biases](https://wandb.ai/). The integration is **opt-in and non-invasive**: it reads the session report, metadata and figures already written to disk and uploads them, without generating anything new. This page documents what the code logs. The W&B workspace itself is not part of the documentation data, so no run count or metric total is quoted here.

:::info[What is the reference record?]
The authoritative record of a run is the local `session_report_<model>_<timestamp>.json` (with its `_meta.json`), exported to `_facts/`. W&B is a convenience layer for browsing and comparing sessions; the documentation does not depend on it.
:::

---

## Activation

Logging runs only if all conditions hold (`should_use_wandb` in `src/pipeline/wandb_config.py`):

1. `use_wandb=True` was passed to `MasterPipeline` / `run_training_session` (or the **Log to W&B** checkbox is ticked in the dashboard); the default is `False`.
2. The environment variable `WANDB_DISABLED` is not `"true"`.
3. The `wandb` package is importable (otherwise a warning asks to install it).

All W&B calls are wrapped so that a failure never interrupts training. Credentials come from the `WANDB_API_KEY` entry of the `.env` file (see [Gaia Connection](../guides/connexion-gaia) for the `.env` file).

## What is logged per run

W&B project: `AstroSpectro`. Run name: `<model>-<UTC timestamp>`.

| Group | Content |
|---|---|
| **Config** | Model type, prediction target, candidate and selected feature counts and the list of selected features, train/test/total sizes, class labels and excluded classes, Python / NumPy / scikit-learn / XGBoost versions, experiment name, timestamp, training file, best hyper-parameters (`hp/<name>`) |
| **Tags** | Model type, target, rounded accuracy and macro-F1 (`acc_<n>`, `f1_<n>`), selected feature count, experiment name |
| **Summary** | Accuracy, macro F1, macro ROC-AUC, number of features used |
| **Scalar metrics** | Accuracy, balanced accuracy; ROC-AUC, average precision and Brier score (global and per class); precision / recall / F1 / support per class and averages; confusion-matrix counts (correct, incorrect, per-class TP/FP/FN); dataset and feature counts |
| **Images** | Confusion matrix, calibration, ROC, PR and feature-importance PNGs, when present in the run directory |
| **Tables and charts** | A random sample of at most 1,000 test predictions, F1-by-class bar chart, precision-vs-recall scatter |
| **Artifact** | The serialised model file, typed `model` |

Notes written in the session report are copied to the run notes.

---

## Reproducing a run

Reproduction relies on the **local** files, not on W&B:

| To recover | Use |
|---|---|
| Hyper-parameters, selected features, library versions, training file | `<model>_<timestamp>_meta.json` and `session_report_*.json` |
| Exact dashboard parameters of the latest session | `last_config_used.json` |
| Model integrity | MD5 hash stored in the session report |
| Seeds | `random_state` in the configuration |

The experiment name and timestamp are identical in the report and on W&B, so a W&B run can be matched to its local files from the run name.

:::note[Not documented here]
Counts of historical W&B runs, the number of metrics per run, and links to the W&B workspace appear in older pages of the previous site. None of them can be checked against `_facts/`, so they are intentionally omitted. See [Reproducibility](../concepts/reproducibility) for the verifiable record of sessions.
:::

---

<RelatedPages pages={[
  { href: '/docs/astrospectro/pipeline/master-pipeline', title: 'Master Pipeline', desc: 'Where use_wandb is set', category: 'concepts' },
  { href: '/docs/astrospectro/concepts/reproducibility', title: 'Reproducibility', desc: 'Session reports, hashes and seeds', category: 'concepts' },
  { href: '/docs/astrospectro/guides/model-training', title: 'Model Training', desc: 'Guide to running a training session', category: 'guides' },
  { href: 'https://github.com/PhD-Brown/AstroSpectro/blob/main/src/pipeline/wandb_config.py', title: 'Source — wandb_config.py', desc: 'should_use_wandb and init_wandb_run', category: 'external' },
]} />
