---
title: Roadmap
description: Planned features and improvements for future AstroSpectro versions.
sidebar_position: 1
---

# Roadmap

## v1.1 (planned — Q3 2026)

- [ ] Optuna hyperparameter optimisation with W&B sweeps
- [ ] Scale to full ~139k FITS files (pending Gaia DR4 cross-match fix)
- [ ] Canonical model artifact properly archived with full metadata
- [ ] RNAAS manuscript submitted

## v1.2 (planned)

- [ ] LAMOST DR10 / SDSS extension
- [ ] Anomaly detection pipeline (HDBSCAN noise ∩ high-MSE autoencoder)
- [ ] Binary star candidate identification

## Known issues being tracked

- Gaia DR4 cross-match instability blocking large-scale extension
- Feature count discrepancy (resolved in docs, model artifact pending)
- Optuna not yet integrated (using GridSearchCV)
