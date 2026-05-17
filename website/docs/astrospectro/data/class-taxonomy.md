---
title: Class Taxonomy
description: The five stellar spectral classes used in AstroSpectro and their physical properties.
sidebar_position: 6
---

# Class Taxonomy

AstroSpectro classifies stellar spectra into **5 primary classes** based on the Harvard spectral classification system.

## The five classes

| Class | T_eff range | Key spectral features | LAMOST count |
|-------|------------|----------------------|-------------|
| **A** | 7,500–10,000 K | Strong Balmer absorption, weak Ca II | ~4,000 |
| **F** | 6,000–7,500 K | Moderate Balmer + Ca II transition | ~8,000 |
| **G** | 5,200–6,000 K | Strong Ca II H&K, moderate Balmer | ~15,000 |
| **K** | 3,700–5,200 K | Very strong Ca II, weak Balmer, metals | ~12,000 |
| **M** | < 3,700 K | TiO molecular bands, very weak Balmer | ~4,000 |

## Class boundaries and known confusion

The **F/G boundary** (5,500–6,200 K) is the primary confusion zone. This is **physically expected** — the boundary is a continuous transition in stellar atmosphere physics, not a sharp discontinuity. The classifier's F/G confusion is a physically accurate reflection of this continuity, not a failure mode.

See [F/G Confusion Analysis](../science/fg-confusion) for details.

## Rare classes (excluded from 5-class model)

The following classes appear in LAMOST DR5 but are excluded from the primary classifier due to insufficient sample size:

- **B stars** (T_eff > 10,000 K) — rare in LAMOST targeting
- **M subdwarfs (sdM)** — low surface gravity
- **Carbon stars (C)** — unusual molecular chemistry
- **White dwarfs (DA/DB)** — different physical regime
