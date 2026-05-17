---
title: Known Limitations
description: Documented limitations of the AstroSpectro pipeline — scientific, technical, and data-related.
sidebar_position: 6
---

# Known Limitations

:::info Scientific integrity
Documenting limitations is a core commitment of this project.
All claims are calibrated to the evidence available.
:::

## Scientific limitations

### 1. SHAP findings are model-specific
SHAP values reflect the decision structure of a single XGBoost model trained on one dataset. Different model families (neural networks, random forests) or different datasets may yield different feature importance rankings.

### 2. Ca II H&K: metallicity vs chromospheric activity
Ca II H&K are strong metallicity proxies, but they are also sensitive to stellar chromospheric activity (e.g., active M dwarfs show Ca II emission). The SHAP finding conflates these two physical effects.

### 3. F/G confusion is irreducible
The F/G boundary is a continuous physical transition. Any classifier trained on LAMOST resolution spectra will have non-zero F/G confusion. This is not a failure — it reflects the true physical overlap.

### 4. Class imbalance
Galaxies (N=56) and QSOs (N=7) are too rare for meaningful classification in the current dataset. The 5-class model excludes these objects entirely.

## Technical limitations

### 5. Feature count inconsistency (resolved)
Earlier model artifacts cited 174 features (FeatureEngineer only) or 130 (incomplete run). The canonical count is **183** in `spectro_only=True` mode. See [Feature Catalogue](../data/feature-catalog).

### 6. Canonical model artifact
The archived model `20260213T225019Z` was trained on N=5,000 spectra with mixed features (not spectro_only=True). The canonical 43,019-spectra spectro_only=True model artifact needs to be properly archived.

### 7. No hyperparameter optimisation
Current hyperparameters come from manual GridSearchCV. Optuna integration is planned but not yet implemented.

## Data limitations

### 8. LAMOST observational biases
LAMOST targets specific sky regions according to survey programs. Removing ra/dec from features reduces but does not eliminate this bias.

### 9. Gaia DR4 cross-match issues
Extending the dataset to the full ~139k FITS files is blocked by Gaia DR4 cross-match instability. See [Current Status](../overview/current-status).

## See also

- [spectro_only=True Mode](../concepts/spectro-only-mode)
- [Physical Purity & Leakage](../concepts/physical-purity)
- [Current Status](../overview/current-status)
