---
title: Current Status
description: "Current state of AstroSpectro — the reference classifier run and its Gaia leak, the PHY-3500 dimensionality-reduction study, open issues and planned work."
sidebar_position: 5
---

import RunFact from '@site/src/components/RunFact';
import RunProvenance from '@site/src/components/RunProvenance';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts:
  G2 · runs.json `classifier` (20260522T161236Z, v6): label, date, n.processed, features.selected, features.gaia_photometric — session_report + _meta.json
  G2 · runs.json `classifier_validation` (20260525T191109Z, v7): label, flags.partial — cited as open work only (CLAUDE.md decision 1b: never featured, no metrics here)
  G1 · runs.json `pca`: n (PHY-3500 label)
  Unsourced items of the former stub (Optuna on a larger set, manuscript status) are stated as intentions, without figures. */}

# Current Status

This page summarises where AstroSpectro stands: which runs are the current references, what is known to be wrong or incomplete, and what is planned. It is updated whenever the reference run changes.

---

## Reference runs

| Analysis | Current reference | Data generation |
|---|---|---|
| Spectral-type classifier | <RunFact path="label" format="raw" /> (saved <RunFact path="date" format="raw" />) | G2 — <RunFact path="n.processed" /> spectra processed |
| SHAP attribution | SHAP of the reference classifier | G2 |
| Scientific validation | Feature-versus-theory checks | G2 |
| PCA, UMAP, t-SNE, HDBSCAN, autoencoder | PHY-3500 runs | **PHY-3500 · G1 · <RunFact run="pca" path="n" /> spectra** |

<RunProvenance keyResultsHref="./key-results" />

Metrics: [Classification Performance](../science/classification-performance.mdx) · [Model Card](../science/model-card.mdx) · [Key Results](./key-results.md).

---

## Known issues

### Gaia/photometric features in the reference classifier

Run v6 (`ST_350k_xgb_AFGKM_v6`) was trained with `spectro_only` enabled, but its <RunFact run="20260522T161236Z" path="features.selected" /> selected features include <RunFact run="20260522T161236Z" path="features.gaia_photometric.length" /> Gaia/photometric columns (`M_G`, `M_BP`, `M_RP`, `ag_gspphot`). Its metrics are therefore not purely spectroscopic; see the [Data Leakage Audit](../concepts/data-leakage-audit.mdx).

The cause was in the code: the `spectro_only` exclusion worked by column-name prefixes, and the Gaia-derived columns did not match any of them (see [Classification](../pipeline/classification.md#feature-columns-and-spectro_only)). Fixed in the code with an explicit list of Gaia/photometric columns (the 22 columns absent from v7). v7 was trained with this fix, but no complete spectro-only reference run exists yet.

### No complete spectro-only reference run yet

The fix is in the code, and the validation run v7 (<RunFact run="classifier_validation" path="label" format="raw" />) was trained with it, without the Gaia/photometric columns. That run is **partial**: according to the author, its Gaia cross-match is incomplete and its SHAP analysis was not completed. It is therefore not used as a reference and its metrics are not reported as results. No complete spectro-only reference run exists yet, so the reference classifier is still v6, with its Gaia columns.

### Two data generations

The dimensionality-reduction pages and the classifier use different datasets (G1 and G2). The dimensionality-reduction runs on G2 exist but are not published yet; until they are, results from the two studies must not be combined. See [Data & Datasets](../data/index.md#data-generations).

### Other open points

| Area | Issue | Page |
|---|---|---|
| Validation | Hα FWHM test fails; Ca II K versus metallicity is inverted on G1 and untestable on G2 | [Scientific Validation](../science/validation.md) |
| Preprocessing | Inverse variance not rescaled after median normalisation | [Preprocessing](../pipeline/preprocessing.md#known-limitations) |
| Labels | F/G errors cannot be separated from label noise without an external reference | [F/G Confusion](../science/fg-confusion.md) |
| Data provenance | Gaia match rate and per-filter counts are not in the exported fact pack | [Data & Datasets](../data/index.md#what-is-not-documented-yet) |

---

## Planned work

These items are intentions; none of them has published results yet.

- **A complete spectroscopic-only reference run** — retrain with the corrected exclusion list on the full generation, with a complete Gaia cross-match and a full SHAP analysis, and use it to replace v6 as the reference.
- **Hyperparameter optimisation** — a systematic search (Optuna is the planned tool) instead of reusing the parameters of an earlier run.
- **Dimensionality reduction on G2** — decide whether the PHY-3500 study is extended to the larger generation.
- **Publication** — a short manuscript on the classifier is in preparation; a complete spectro-only reference run (the code fix is in place) is a prerequisite.

See the [Roadmap](../community/roadmap.md) and [Limitations](../science/limitations.md).

---

<RelatedPages pages={[
  { href: '/docs/astrospectro/concepts/data-leakage-audit', title: 'Data Leakage Audit', desc: 'Which non-spectroscopic columns reached the model', category: 'concepts' },
  { href: '/docs/astrospectro/science/limitations', title: 'Limitations', desc: 'Project-wide caveats', category: 'science' },
  { href: '/docs/astrospectro/community/roadmap', title: 'Roadmap', desc: 'Longer-term directions', category: 'community' },
  { href: '/docs/astrospectro/concepts/reproducibility', title: 'Reproducibility', desc: 'How runs are recorded and replayed', category: 'concepts' },
]} />
