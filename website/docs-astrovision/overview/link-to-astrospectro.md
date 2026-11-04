---
title: Bridge to AstroSpectro
description: How AstroVision (galaxy images) relates to AstroSpectro (stellar spectra) — shared design principles, the code in place, and what has not been achieved yet.
sidebar_position: 4
---

import Fact from '@site/src/components/astrovision/Fact';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: notebooks 05 and 07 (complement) · src/astrovision/spectral_viz.py, synthesis.py · FACTS_INDEX §4 */}

# Bridge to AstroSpectro

[AstroSpectro](/docs/astrospectro) classifies **stellar spectra** (LAMOST DR5 × Gaia DR3); AstroVision classifies **galaxy images** (Galaxy10 DECaLS). They share a design philosophy — reproducible runs, interpretability, explicit leakage and limitation tracking — but they operate on different objects: stars in the Milky Way and extragalactic systems. **No AstroSpectro number applies to AstroVision, and vice versa.**

:::note[Status of the bridge]
The "images × spectra" link is a **research direction**. It has not produced a result yet.
:::

## What exists

| Element | Where | Status |
|---|---|---|
| Photometric proxy for star formation (u−r populations, g−r) | `crossmatcher.py`, notebook 05 | Done, from SDSS DR16 — see [SDSS Cross-match](../data/sdss-crossmatch.md) |
| Plot helpers for morphology × spectral properties | `spectral_viz.py` | Code in place (CMD, colour by class, UMAP by property, BPT proxy) |
| Cross-match with LAMOST DR7 (VizieR `V/156`) | `synthesis.py` (`attempt_lamost_xmatch`), notebook 07 | **Failed**: the table was not available on the CDS XMatch server; no [Fe/H] was obtained for Galaxy10 galaxies |
| Spectroscopic redshifts | SDSS `zsp` | Available for <Fact k="crossmatch.n_with_zsp" format="int" /> galaxies; used to compute absolute magnitudes |

## What would make the bridge real

1. A spectroscopic catalogue overlapping the Galaxy10 footprint (the notebook mentions LAMOST DR7 as the next attempt).
2. A definition of the shared quantity — for galaxies, integrated spectral indices; for stars, atmospheric parameters — since [Fe/H] of a star is not the metallicity of a galaxy.
3. A common evaluation protocol, so that comparisons are made on matched objects only.

Until then, the physical link used in AstroVision is photometric: SDSS colours and population labels (see [Physical Interpretation](../results/physical-interpretation.md)).

<RelatedPages pages={[
  { href: '/astrovision/data/sdss-crossmatch', title: 'SDSS DR16 Crossmatch', desc: 'The photometric link in place', category: 'science' },
  { href: '/docs/astrospectro', title: 'AstroSpectro', desc: 'Stellar spectra classification', category: 'external' },
  { href: '/docs/atlas/repository-map', title: 'Repository map', desc: 'All projects in the ecosystem', category: 'concepts' },
]} />
