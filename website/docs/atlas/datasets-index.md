---
title: Datasets Index
description: "The datasets behind the three research projects — LAMOST DR5 × Gaia DR3 spectra (two data generations), Galaxy10 DECaLS with SDSS DR16, and Pantheon+SH0ES with DESI DR2 BAO — with their sizes read from the project fact files and links to the data pages."
sidebar_position: 2
---

import RunFact from '@site/src/components/RunFact';
import AVFact from '@site/src/components/astrovision/Fact';
import XiFact from '@site/src/components/xi/Fact';

{/* facts:
  AstroSpectro · runs.json `pca` (G1: n, features_file) and `classifier` (G2: n.processed, trained_on_file) — FACTS_INDEX §0, §5
  AstroVision · facts.json dataset.n_images, crossmatch.n_matched — _facts/astrovision/FACTS_INDEX.md §2 (data/master_synthesis.csv)
  ξ · facts.json protocol1b data.n_sne, data.n_bao, data.rd_mpc — _facts/xi/FACTS_INDEX.md §1.2 */}

# Datasets Index

One line per dataset, with its size and the page that describes it. Sizes are read from the exported fact files of each project; nothing on this page is typed by hand.

---

## AstroSpectro — LAMOST DR5 × Gaia DR3

| Data generation | Spectra | Feature file | Used by |
|---|---|---|---|
| **PHY-3500 · G1 · <RunFact run="pca" path="n" format="int" /> spectra** | <RunFact run="pca" path="n" format="int" /> | <RunFact run="pca" path="features_file" format="raw" /> | PCA, UMAP, t-SNE, HDBSCAN and autoencoder pages |
| **G2** | <RunFact path="n.processed" format="int" /> processed | <RunFact path="trained_on_file" format="raw" /> | The reference classifier, its SHAP analysis and the scientific validation |

The two generations are never combined in a single result. The reference classifier also contains Gaia/photometric columns; see the [Data Leakage Audit](../astrospectro/concepts/data-leakage-audit.mdx).

Pages: [Data & Datasets](../astrospectro/data/index.md) · [LAMOST DR5](../astrospectro/data/lamost-dr5.mdx) · [Gaia DR3 cross-match](../astrospectro/data/gaia-dr3.md) · [Master catalogue](../astrospectro/data/master-catalog.md) · [Feature catalogue](../astrospectro/data/feature-catalog.md) · [Quality filters](../astrospectro/data/quality-filters.md) · [Dataset versions](../astrospectro/data/dataset-versions.md) · [Class taxonomy](../astrospectro/data/class-taxonomy.md)

---

## AstroVision — Galaxy10 DECaLS × SDSS DR16

| Dataset | Content | Size |
|---|---|---|
| Galaxy10 DECaLS | Galaxy cut-outs with morphological classes | <AVFact k="dataset.n_images" format="int" /> images |
| SDSS DR16 cross-match | Photometry and spectroscopic redshift added from VizieR | <AVFact k="crossmatch.n_matched" format="int" /> galaxies matched |

Pages: [Data Overview](/astrovision/data) · [Galaxy10 DECaLS](/astrovision/data/galaxy10-decals) · [Morphology Classes](/astrovision/data/morphology-classes) · [Data Preparation](/astrovision/data/data-preparation) · [SDSS DR16 Crossmatch](/astrovision/data/sdss-crossmatch)

---

## ξ Dark Energy — Pantheon+SH0ES and DESI DR2 BAO

| Dataset | Content | Size |
|---|---|---|
| Pantheon+SH0ES | Type Ia supernovae, after a redshift cut at z > 0.01 | <XiFact path="data.n_sne" format="int" /> supernovae |
| DESI DR2 BAO | Baryon acoustic oscillation distance measurements | <XiFact path="data.n_bao" format="int" /> measurements |

The BAO analysis fixes the sound horizon at r<sub>d</sub> = <XiFact path="data.rd_mpc" format="num" digits={2} /> Mpc; the [Known Limitations](/xi-dark-energy/results/caveats) page discusses what this implies.

Pages: [Data Overview](/xi-dark-energy/data) · [Pantheon+SH0ES](/xi-dark-energy/data/pantheon-shoes) · [DESI DR2 BAO](/xi-dark-energy/data/desi-dr2-bao) · [Covariance Handling](/xi-dark-energy/data/covariance)

---

See also: [Repository Map](./repository-map.md) · [Notebook Atlas](./notebook-atlas.md) · [Figures Index](./figures-index.md).
