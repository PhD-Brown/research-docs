---
title: Peak Detection
description: How AstroSpectro finds absorption minima in a normalised LAMOST spectrum and associates them with six reference lines (Hα, Hβ, Ca II K/H, Mg b, Na D) using scipy's find_peaks.
sidebar_position: 2
---

import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: none — page derived from AS/src/pipeline/peak_detector.py, processing.py, feature_engineering.py (no run-level number); reference wavelengths in the table are constants hard-coded in peak_detector.py (PeakDetector.target_lines) */}

# Peak Detection

This page documents the **absorption-line detection step** of the AstroSpectro pipeline: the `PeakDetector` class finds local flux minima in a normalised spectrum and links them to a small vocabulary of six reference lines. Its output seeds the line-based features computed by the [feature engineering](./feature-engineering) step. The page describes the code; it quotes no run-level result.

:::note[Scope]
`PeakDetector` is deliberately minimal. It only answers "is there a significant minimum near this reference wavelength, and how deep is it?". Line widths, equivalent widths, indices and molecular bands are computed afterwards by `FeatureEngineer` (see [Feature Engineering](./feature-engineering)).
:::

---

## Why this step exists

Spectral classification relies on a handful of lines whose strength changes with temperature and luminosity. Rather than fitting every line, the pipeline first locates the minimum nearest to each expected position, so that downstream measurements (full width at half maximum, equivalent width) start from the right pixel even when the line is shifted by a few ångströms.

## Pipeline position

```mermaid
flowchart LR
    A[Normalised flux<br/>SpectraPreprocessor] --> B[Mask NaN / Inf]
    B --> C["Invert flux<br/>(−flux)"]
    C --> D["scipy.signal.find_peaks<br/>prominence ≥ threshold"]
    D --> E["Match to reference lines<br/>± window Å"]
    E --> F["match_* columns<br/>+ FeatureEngineer input"]
```

---

## Algorithm

1. **Mask** non-finite wavelength/flux pairs so that indices stay aligned.
2. **Invert** the flux (`-flux`): absorption minima become positive peaks.
3. **Detect** peaks with `scipy.signal.find_peaks(inverted_flux, prominence=prominence)`. Only the prominence criterion is used — no width or height constraint.
4. **Associate**: for each reference line, keep the detected peak within `± window` Å of the reference wavelength that has the **highest prominence**. If none exists, the line is reported as unmatched (`None`).

### Reference lines

The vocabulary is a hard-coded dictionary (`PeakDetector.target_lines`), in this order:

| Key | Reference λ (Å) | Role in the code comment |
|---|---:|---|
| `Hα` | 6563.0 | Balmer series (hot A/F stars) |
| `Hβ` | 4861.0 | Balmer series |
| `CaII K` | 3933.0 | Calcium |
| `CaII H` | 3968.0 | Calcium |
| `Mg_b` | 5175.0 | Magnesium triplet, approximate centre (cooler G/K stars) |
| `Na_D` | 5893.0 | Sodium doublet, approximate centre (cooler G/K stars) |

:::caution[Not a NIST table]
These wavelengths are rounded, hard-coded values in the module; the code does not read a NIST list or any external line database. Mg b and Na D are blend centres, not individual components. The more precise rest wavelengths used elsewhere (e.g. Hα 6562.8 Å, Ca II K 3933.7 Å) live in `SpectralLineLibrary` inside `feature_engineering.py` and are used for the feature measurements, not for peak association.
:::

## Parameters

| Parameter | `PeakDetector` default | Value used by `ProcessingPipeline` | Meaning |
|---|---:|---:|---|
| `prominence` | 0.85 | **0.15** | Minimum prominence of an inverted peak, in normalised-flux units |
| `window` | 28 Å | **8 Å** | Half-width of the association window around each reference wavelength |

The class defaults and the values actually used in production differ. `ProcessingPipeline.__init__` defaults to `prominence=0.15, window=8`, and `MasterPipeline.process_data()` instantiates it without overriding them, so a standard run uses **0.15 and 8 Å**. The docstring example `PeakDetector(prominence=0.85, window=28)` describes the standalone class defaults only.

A lower prominence yields more candidate minima (more noise-driven matches in low-SNR spectra); a wider window tolerates larger offsets but can pick a neighbouring feature. The repository does not record a sensitivity study of these two values.

---

## Outputs

`analyze_spectrum(wavelength, flux)` returns a dictionary with the same keys and order as `target_lines`: `(detected_wavelength, prominence)` or `None`.

```python
# src/pipeline/peak_detector.py
from pipeline.peak_detector import PeakDetector, matches_to_dataframe, matches_to_series

detector = PeakDetector(prominence=0.15, window=8)
matches = detector.analyze_spectrum(wavelength, flux_norm)
matches["Hβ"]                      # (λ_detected, prominence) or None
matches_to_dataframe(matches)      # index = line; columns lambda_A, prominence, matched
matches_to_series(matches, order=["Hα", "Hβ"], prefix="match_")
```

| Helper | Returns |
|---|---|
| `matches_to_dataframe` | One row per line: `lambda_A`, `prominence`, `matched` (boolean); NaN when unmatched |
| `matches_to_series` | A single row with `match_<line>_wl` and `match_<line>_prom` per line, NaN when unmatched. Used by the processing pipeline to produce the [`match_*` columns](./processing-pipeline) |

## Limitations

- Six lines only; no molecular bands or metal lines are detected here.
- Association keeps one peak per line, chosen by prominence rather than by proximity.
- Results depend on the flux normalisation upstream (see [Preprocessing](./preprocessing)).

---

<RelatedPages pages={[
  { href: '/docs/astrospectro/pipeline/processing-pipeline', title: 'Processing Pipeline', desc: 'Where PeakDetector is called and how match_* columns are built', category: 'concepts' },
  { href: '/docs/astrospectro/pipeline/feature-engineering', title: 'Feature Engineering', desc: 'Line widths, equivalent widths, indices', category: 'concepts' },
  { href: '/docs/astrospectro/pipeline/preprocessing', title: 'Preprocessing', desc: 'Flux normalisation that precedes detection', category: 'concepts' },
  { href: 'https://github.com/PhD-Brown/AstroSpectro/blob/main/src/pipeline/peak_detector.py', title: 'Source — peak_detector.py', desc: 'PeakDetector on GitHub', category: 'external' },
]} />
