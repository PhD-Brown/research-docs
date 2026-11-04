---
title: Dataset Versions
description: What each AstroSpectro analysis was run on — the PHY-3500 · G1 set of 43,019 spectra for dimensionality reduction, the G2 set of 349,998 spectra for the reference classifier — plus the history of processed batch sizes recorded in session reports.
sidebar_position: 8
---

import RunFact from '@site/src/components/RunFact';
import GaiaLeakNote from '@site/src/components/GaiaLeakNote';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: runs.json (classifier n.processed; pca n, p; umap_tsne n) · _facts/astrospectro/data/reports/<run>/session_report_<run>.json (total_spectra_processed) · data/reports/runs/phy3500_pca/<run>.json (shapes.X) · csv_summaries.json (features_*.csv) · FACTS_INDEX §0 */}

# Dataset Versions

The project has no formally numbered dataset releases. What exists are **two generations of feature tables** and a long series of smaller development batches. This page records which spectra each analysis used, so that numbers from different analyses are never compared as if they came from the same set. Everything below comes from files in the documentation data pack; the numbered "v1 / v2 / v3" dataset versions and sizes announced in the former stub of this page cannot be traced to any file and are not repeated.

:::info[Two generations — never mixed]
- **G1 · PHY-3500 · 43,019 spectra** — analysis set of all dimensionality-reduction pages (PCA, UMAP, t-SNE, autoencoder) and of the PHY-3500 article.
- **G2 · 349,998 spectra** — set processed for the reference classifier run and the 2026-05 SHAP and validation outputs.

A metric computed on one generation must not be quoted next to a size from the other.
:::

---

## Generation G1 — PHY-3500

**PHY-3500 · G1 · 43,019 spectra**

| Property | Value |
|---|---|
| Feature file | `features_20260305T174836Z.csv` |
| Matrix used by the reference PCA run (`phy3500_pca_run_20260408T012751Z`) | <RunFact run="pca" path="n" format="int" /> spectra × <RunFact run="pca" path="p" format="int" /> features |
| Same N in the UMAP / t-SNE reference run | <RunFact run="umap_tsne" path="n" format="int" /> |
| Composition | STAR <RunFact run="pca" path="class_counts.STAR" format="int" /> · GALAXY <RunFact run="pca" path="class_counts.GALAXY" format="int" /> · QSO <RunFact run="pca" path="class_counts.QSO" format="int" /> |

All figures published under `static/img/dimred/` come from this generation.

### How the PCA input matrix changed

The reference PCA run was preceded by exploratory runs on matrices of different shapes (`shapes.X` in each run report). Rows are **runs**, not dataset releases; the pack does not record why the shape changed between them.

| Run (UTC) | Rows × columns of `X` | Comment |
|---|---|---|
| `phy3500_pca_run_20260402T161436Z` | 42,920 × 208 | First run in the pack |
| `phy3500_pca_run_20260405T180648Z` | 43,335 × 184 | — |
| `phy3500_pca_run_20260405T181402Z` | 43,019 × 184 | First run with 43,019 rows, 184 columns |
| `phy3500_pca_run_20260405T211716Z` | 43,019 × 183 | 183 columns from here on |
| `phy3500_pca_run_20260408T012751Z` | 43,019 × 183 | **Reference run** (only one with the raw-flux PCA cited on the site) |

## Generation G2 — 350k

| Property | Value |
|---|---|
| Feature file | `features_20260522T153123Z.csv` — 349,998 rows × 308 columns (summary in `csv_summaries.json`) |
| Spectra processed by the reference classifier run | <RunFact run="classifier" path="n.processed" format="int" /> (train <RunFact run="classifier" path="n.train" format="int" />, test <RunFact run="classifier" path="n.test" format="int" />) |
| Matrix used by the G2 dimensionality-reduction runs | 153,060 × 183 (`phy3500_pca_run_20260522T193711Z`) |

The dimensionality-reduction matrix is smaller than the processed set because the loader applies SNR, NaN and class rules (see [Quality Filters](./quality-filters)); the pack does not give counts per step. Two intermediate dimensionality-reduction matrices of 153,052 and 59,786 rows (`phy3500_pca_run_20260430T111007Z` and `…T173157Z`) also exist; their source feature files are not identified in the pack.

<GaiaLeakNote />

The G2 dimensionality-reduction runs are documented in `FACTS_INDEX.md` but not published on the site.

---

## Batch sizes of classifier sessions

Each classifier session writes a `session_report_*.json` with `total_spectra_processed`. Grouping the reports of the pack by that value gives the history of batch sizes (development runs included):

| Spectra processed | Sessions | First → last session (UTC) |
|---:|---:|---|
| 500 | 1 | 2026-03-04 |
| 1,000 | 14 | 2025-08-23 → 2026-05-14 |
| 2,500 | 59 | 2025-08-26 → 2025-11-20 |
| 5,000 | 2 | 2025-08-23 → 2025-08-25 |
| 9,999 | 5 | 2025-08-23 → 2025-08-26 |
| 49,999 | 5 | 2025-10-11 → 2026-02-13 |
| 99,999 | 7 | 2026-03-05 → 2026-05-14 |
| 349,998 | 2 | 2026-05-22 → 2026-05-25 |

Two further reports record 0 spectra (2026-03-04) and one report could not be parsed. The 99,999-spectra sessions include the `ST_100k_xgb_AFGKM_v3` to `v5` experiments; the 349,998-spectra sessions are the reference run (`20260522T161236Z`) and the later partial validation run.

:::note[Reading this table]
A "batch" is a set of spectra processed in one session; it is not a cumulative dataset. Sessions of different sizes were trained on different, partly overlapping selections, so their metrics are not directly comparable. The experiment history is detailed in [Reproducibility](../concepts/reproducibility).
:::

## Provenance

- Every feature file name carries its UTC creation timestamp (`features_<timestamp>.csv`); the session report records the file used (`trained_on_file`).
- `trained_spectra.csv` is the ledger that prevents a spectrum from being reused across sessions; its exported summary has 349,998 rows.
- Raw spectra come from LAMOST DR5 (see [LAMOST DR5](./lamost-dr5)).

---

<RelatedPages pages={[
  { href: '/docs/astrospectro/overview/current-status', title: 'Current Status', desc: 'Which run is the reference', category: 'concepts' },
  { href: '/docs/astrospectro/concepts/reproducibility', title: 'Reproducibility', desc: 'Session reports and seeds', category: 'concepts' },
  { href: '/docs/astrospectro/data/master-catalog', title: 'Master Catalog', desc: 'The catalogue behind each feature file', category: 'concepts' },
  { href: '/docs/astrospectro/dimred/data-loader', title: 'PHY-3500 Dataset', desc: 'The G1 analysis set in detail', category: 'science' },
]} />
