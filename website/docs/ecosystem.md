---
title: Research Ecosystem
description: "How AstroSpectro, AstroVision, and ξ Dark Energy connect as a coherent research programme."
sidebar_position: 2
---

# Research Ecosystem

The three projects share a common research philosophy: **physics-grounded, interpretable, reproducible machine learning applied to large astronomical surveys.**

## How the projects connect

```
LAMOST DR5 spectra  ──►  AstroSpectro  ──►  Stellar classification + SHAP finding
                              │
                              │  bridge: what spectral features encode
                              ▼
Galaxy10 DECaLS     ──►  AstroVision   ──►  Morphological classification + DINOv2 analysis
                              │
                              │  shared: Bayesian inference methodology
                              ▼
Pantheon+SH0ES/DESI ──►  ξ Dark Energy ──►  Cosmological model comparison
```

## Common themes across projects

| Theme | AstroSpectro | AstroVision | ξ Dark Energy |
|-------|-------------|-------------|---------------|
| **Interpretability** | SHAP analysis | Attention maps, GradCAM | Explicit caveats |
| **Uncertainty** | Confidence scores | MC Dropout, conformal | Posterior asymmetry |
| **Reproducibility** | W&B (85+ runs) | Versioned notebooks | emcee + diagnostics |
| **Physical grounding** | 183 spectroscopic features | Morphometrics (CAS, Gini, M20) | ΛCDM/CPL/Ξosc |

## Scientific questions

- **AstroSpectro:** *What physical information do modern ML models actually learn from stellar spectra?*
- **AstroVision:** *Can self-supervised visual representations trained outside astronomy capture physically meaningful galaxy structure?*
- **ξ Dark Energy:** *How do alternative dark-energy parameterisations behave under current observational constraints?*
