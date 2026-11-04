---
title: Physical Meaning of Features
description: The astrophysical meaning of AstroSpectro's main spectroscopic features — Balmer lines, Ca II H&K, Mg b, Na D, molecular bands and continuum shape — and what the SHAP ranking of the reference run suggests about them.
sidebar_position: 4
---

import GaiaLeakNote from '@site/src/components/GaiaLeakNote';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: _facts/astrospectro/logs/shap/features_20260522T153123Z/01_data_leak/discoveries.csv (rank, family — run v6, G2) · FACTS_INDEX §3, §4 · code: AS/src/pipeline/feature_engineering.py (SpectralLineLibrary, index_definitions) */}

# Physical Meaning of Features

This page explains **what each family of AstroSpectro features measures physically**, so that a SHAP ranking or a principal component can be read as astrophysics rather than as a list of column names. It is an interpretation page: the definitions of the features themselves are in the [Feature Catalogue](../data/feature-catalog) and the [Feature Extraction Theory](../pipeline/feature-engineering-theory), and the importance ranking is in [SHAP Interpretability](./shap-interpretability). Statements about importance refer to the reference classifier run (G2, v6) and carry its leakage caveat.

:::info[How to read the "meaning" column]
The physical roles below are standard stellar-spectroscopy expectations, implemented by the line and band definitions in `feature_engineering.py`. Whether the model actually uses a feature for that reason is a separate question, addressed (partially) in [Scientific Validation](./validation).
:::

---

## Families and their physical meaning

| Family | Typical features | What it traces | Why it discriminates A–M stars |
|---|---|---|---|
| **Balmer lines** | Hα, Hβ, Hγ, Hδ (equivalent width, FWHM, prominence, `Hbeta_index`) | Population of the n = 2 level of hydrogen, set mainly by temperature | Hydrogen lines are strongest in A-type stars and weaken towards both hotter and cooler types, so they separate A/F from G/K/M |
| **Ca II H & K** (3968 Å, 3934 Å) | `CaIIK_eq_width`, `CaIIK_depth`, `CaIIK_prominence`, K/Hβ ratio | Ionised calcium; strengthens towards cooler photospheres and also carries chromospheric and interstellar contributions | Strong, temperature-sensitive lines in F–K stars; their dependence on metallicity is expected but see the caution below |
| **Mg b triplet** (≈5170 Å) | `Mg_b_eq_width`, `Mgb_index`, individual `Mg_5167/5173/5184` | Neutral magnesium lines, pressure-sensitive in G–K stars | Sensitive to temperature and, in cool stars, to surface gravity (dwarf/giant) |
| **Na D doublet** (≈5890 Å) | `Na_D_eq_width`, `NaD_Lick` | Neutral sodium; strong in cool photospheres, can be contaminated by interstellar absorption | Rises towards K and M types |
| **Molecular bands** | TiO (several bands), VO, CaH (`CaH2`, `CaH3`), CN, CH (`G4300`), MgH | Molecules that form only in cool atmospheres | TiO and VO dominate M-type spectra; CaH is a classical dwarf/giant indicator; the G band (CH) is strong in G–K stars |
| **Continuum and colour** | `slope_blue/green/red/deep_red`, `cont_slope`, `cont_curvature`, `continuum_rms`, colour indices, UV excess at 3900 Å | Overall spectral energy distribution, hence effective temperature (plus reddening and flux-calibration effects) | A smooth, robust temperature proxy; also the family most exposed to instrumental systematics |

:::caution[CaH is a molecule, not calcium]
The index `feature_index_CaH2` (a CaH band near 6814–6846 Å, referenced to the continuum near 7042–7056 Å in the code) is labelled with the family "Ca II" in the SHAP `discoveries.csv` file. That label is a grouping artefact; physically it belongs with the molecular bands.
:::

## What the ranking suggests

In the SHAP analysis of the reference classifier run, the highest-ranked features are the Mg b equivalent width, the CaH2 index, the deep-red continuum slope, the Ca II K equivalent width and the Hα equivalent width, in that order; Na D, Hβ, G4300 and CN indices follow. Most of the top-30 are therefore line, band or continuum measurements that match the families above. The exact shares and ranks are on the [SHAP Interpretability](./shap-interpretability) page.

**This is consistent with the model using physically meaningful information**, and it suggests that no single family explains the classification: line strengths, molecular bands and continuum slopes all appear among the leading features, as expected for a task that is largely a temperature sequence with gravity-sensitive refinements.

<GaiaLeakNote />

The same SHAP table also contains `M_G`, a Gaia-derived absolute magnitude, within its top 30, and colour features such as `bp_g` that are partly photometric; the ranking is therefore not a purely spectroscopic one.

### Why some features rank higher than others

- **Redundancy**: several features measure related quantities (Mg b equivalent width, Mg b index, three individual Mg lines; many continuum slopes). Importance is shared or concentrated unpredictably among correlated features, so a feature's rank is not a clean measure of its physical weight.
- **Dynamic range across classes**: features that change monotonically from A to M (continuum slopes, molecular bands) give the model easy splits; features that peak in the middle of the sequence (Balmer lines) are informative but non-monotonic.
- **Adjacent-class confusion**: the largest remaining errors are between neighbouring types (F/G, G/K), where all features vary slowly; see [F/G Confusion](./fg-confusion).

## Caution: metallicity and Ca II

Ca II H&K is often cited as a metallicity indicator. In the scientific validation, the expected Ca II K–metallicity relation is **not reproduced** on the PHY-3500 · G1 · 43,019 spectra analysis (the correlation has the opposite sign to the expectation) and cannot be tested on the G2 set because metallicity is unavailable in `spectro_only` mode. The physical reading of Ca II features as metallicity tracers is therefore **not supported by this work**; see [Scientific Validation](./validation).

## Limitations of this interpretation

- Feature definitions use fixed wavelength windows; they do not correct for radial velocity or for blends.
- SHAP importance describes the trained model, not stellar physics: a feature can be important because it proxies another quantity.
- The Gaia-related columns in the reference run mean the ranking cannot be read as a purely spectroscopic one.

---

<RelatedPages pages={[
  { href: '/docs/astrospectro/data/feature-catalog', title: 'Feature Catalogue', desc: 'Definition of each feature', category: 'concepts' },
  { href: '/docs/astrospectro/science/shap-interpretability', title: 'SHAP Interpretability', desc: 'Ranking and shares', category: 'science' },
  { href: '/docs/astrospectro/science/validation', title: 'Scientific Validation', desc: 'Physical checks and their limits', category: 'science' },
  { href: '/docs/astrospectro/pipeline/feature-engineering-theory', title: 'Feature Extraction Theory', desc: 'Descriptor families', category: 'concepts' },
  { href: '/docs/astrospectro/concepts/data-leakage-audit', title: 'Data Leakage Audit', desc: 'Gaia and photometric columns in v6', category: 'concepts' },
]} />
