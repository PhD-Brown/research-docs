---
title: FeatureEngineer API
description: API reference for src/pipeline/peak_detector.py and src/pipeline/feature_engineering.py — PeakDetector, FeatureEngineer, SpectralLineLibrary and the post-merge helper functions.
sidebar_position: 2
---

{/* facts: aucun chiffre de run — signatures relues dans AstroSpectro/src/pipeline/peak_detector.py et feature_engineering.py */}

# FeatureEngineer API

Feature extraction is split over two modules. `PeakDetector` finds absorption minima and matches them to six reference lines; `FeatureEngineer` turns those matches, plus the normalised spectrum, into one numeric vector per spectrum. A set of module-level functions then adds catalogue-derived columns after the Gaia merge. For the physics behind the descriptors, see [Feature engineering theory](../pipeline/feature-engineering-theory.mdx) and the [Feature catalogue](../data/feature-catalog.md).

```python
from pipeline.peak_detector import PeakDetector, matches_to_dataframe, matches_to_series
from pipeline.feature_engineering import FeatureEngineer, SpectralLineLibrary
```

---

## PeakDetector

Detects local minima of a normalised spectrum and associates them with a small vocabulary of reference lines.

```python
PeakDetector(prominence: float = 0.85, window: int = 28)
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `prominence` | `float` | `0.85` | Prominence threshold passed to `scipy.signal.find_peaks` on the inverted flux. Higher values keep fewer peaks. |
| `window` | `int` | `28` | Half-width in Å of the tolerance around each reference wavelength. |

**Attribute `target_lines`** (`dict[str, float]`, Å): `Hα` 6563.0 · `Hβ` 4861.0 · `CaII K` 3933.0 · `CaII H` 3968.0 · `Mg_b` 5175.0 · `Na_D` 5893.0. These wavelengths are hard-coded in the class; the module does not cite a line list.

### `detect_peaks(wavelength, flux)`

Masks NaN and Inf, inverts the flux and calls `find_peaks(-flux, prominence=self.prominence)`.

**Returns** `(indices, properties)` — peak indices and the dictionary of `find_peaks` (it contains `"prominences"`).

### `match_known_lines(peak_indices, peak_wavelengths, properties)`

For each entry of `target_lines`, keeps the most prominent peak within `± window` Å of the theoretical wavelength.

**Returns** `dict[str, tuple[float, float] | None]` — `{line: (detected_wavelength, prominence)}`, or `None` for an unmatched line. Keys follow the order of `target_lines`.

### `analyze_spectrum(wavelength, flux)`

Full pass: applies the NaN/Inf mask, calls `detect_peaks`, then `match_known_lines`. If no peak is found, returns `{line: None}` for every line.

### Module functions

| Function | Signature | Returns |
|---|---|---|
| `matches_to_dataframe` | `(matches)` | `pd.DataFrame` indexed by line name, columns `lambda_A`, `prominence`, `matched`. Requires pandas. |
| `matches_to_series` | `(matches, order=None, prefix="match_")` | `pd.Series` with two columns per line, `{prefix}{LINE}_wl` and `{prefix}{LINE}_prom`; unmatched lines are NaN. |

---

## SpectralLineLibrary and LineDefinition

`LineDefinition` is a dataclass `(name, wavelength, species, category, strength)` where `wavelength` is the line centre in Å and `strength` is `'strong'`, `'medium'` or `'weak'`.

`SpectralLineLibrary` is a container of class attributes, each a `dict[str, LineDefinition]`:

| Attribute | Content |
|---|---|
| `MOLECULAR_BANDS` | TiO, VO, CN, CH, CaH and MgH bands |
| `BALMER_SERIES` | Hα to H10 |
| `METAL_LINES` | Fe, Mg, Ca (including the near-infrared triplet), Na, Si, Ti, Cr, Ni, Ba, Sr, Al, Co and V lines |

---

## FeatureEngineer

Unified extractor: the six-line base features (prominence, FWHM, equivalent width), prominence ratios and spectral indices, plus molecular bands, extended Balmer series, metal lines, extended indices, continuum analysis, line profiles, synthetic colours and composite indices.

```python
fe = FeatureEngineer()
```

The constructor takes no argument. It runs a dry extraction on a synthetic spectrum to lock the feature names.

| Attribute | Type | Description |
|---|---|---|
| `feature_names` | `list[str]` | Canonical column names, in **alphabetical order**, fixed at construction. The length is determined at runtime: use `len(fe.feature_names)`. |
| `base_lines` | `list[str]` | `["Hα", "Hβ", "CaII K", "CaII H", "Mg_b", "Na_D"]`. |
| `line_metrics` | `list[str]` | `["prominence", "fwhm", "eq_width"]`. |
| `ratio_definitions` | `dict` | Three prominence ratios: `ratio_prom_CaK_Hbeta`, `ratio_prom_Halpha_Hbeta`, `ratio_prom_Mgb_Hbeta`. |
| `index_definitions` | `dict` | Band definitions of the V1 spectral indices (for example `TiO5`, `Dn4000`, `G4300`). |

### `extract_features(matched_lines, wavelength, flux_norm, invvar, catalog_row=None)`

| Parameter | Type | Description |
|---|---|---|
| `matched_lines` | `Mapping[str, tuple[float, float] \| None]` | Output of `PeakDetector.analyze_spectrum`. |
| `wavelength` | `np.ndarray` | Wavelength grid in Å. |
| `flux_norm` | `np.ndarray` | Median-normalised flux. |
| `invvar` | `np.ndarray` | Per-pixel inverse-variance (raw is fine: it is converted with `safe_sigma_from_invvar`). |
| `catalog_row` | `pd.Series` or `None` | Catalogue row, optional. In the normal pipeline it is `None`. |

**Returns** `list[float]` aligned with `feature_names`. Features that could not be computed are NaN.

For each base line:

- the **prominence** comes from the matcher, and is `0.0` if the line is unmatched;
- the **FWHM** is computed with `specutils.gaussian_fwhm` on a Savitzky–Golay-smoothed (window 5, order 2) cut of ±20 Å around the detected wavelength;
- the **equivalent width** is computed with `specutils.equivalent_width` over the same ±20 Å region;
- FWHM and equivalent width are NaN when the line is unmatched or the computation fails.

### `batch_features(matched_lines_list, wavelengths, flux_norms, invvars, catalog_rows=None)`

Loops over lists of per-spectrum inputs (the wavelength grids may differ) and returns an `np.ndarray` of shape `(n_spectra, n_features)`.

### Post-merge helper functions

These module-level functions are called by `ProcessingPipeline` after the catalogue join. Each takes a DataFrame and returns a copy.

| Function | Signature | Role |
|---|---|---|
| `add_gaia_derived_features` | `(df, *, min_parallax_snr=5.0)` → `(df, new_columns)` | Colours, dereddened colour, absolute magnitude, distance, tangential velocity from Gaia DR3 columns. |
| `add_photometric_composites` | `(df)` → `(df, new_columns)` | Fills the colour features left as NaN during per-spectrum extraction. Must run after `add_gaia_derived_features`. |
| `add_line_composites` | `(df)` → `(df, new_columns)` | Equivalent-width and FWHM combinations from the existing columns. |
| `add_main_sequence_delta` | `(df, *, min_parallax_snr=10.0, poly_degree=3)` → `(df, coefficients \| None)` | Adds `delta_ms`, the offset from a polynomial main-sequence fit. Returns NaN if fewer than 200 clean stars are available. |
| `stabilize_spectral_features` | `(df)` → `df` | Clips equivalent widths, prominences and FWHMs to the 0.5 %–99.5 % quantile range, applies signed-log1p or log1p, and adds `*_present` flags. |

:::warning[Gaia-derived columns]
`add_gaia_derived_features` creates the absolute magnitudes `M_G`, `M_BP` and `M_RP`, and applies `ag_gspphot` to `M_G`. These are photometric columns, not spectral features: a model that selects them is not purely spectroscopic. See [Spectro-only mode](../concepts/spectro-only-mode.md) and the [Data Leakage Audit](../concepts/data-leakage-audit.mdx).
:::

---

## Example

```python
from pipeline.peak_detector import PeakDetector
from pipeline.feature_engineering import FeatureEngineer
from pipeline.preprocessor import SpectraPreprocessor

sp, pd_, fe = SpectraPreprocessor(), PeakDetector(), FeatureEngineer()

wavelength, flux, invvar = sp.load_spectrum(hdul)
flux_norm = sp.normalize_spectrum(flux)

matches = pd_.analyze_spectrum(wavelength, flux_norm)      # {"Hα": (λ, prom) | None, ...}
vector = fe.extract_features(matches, wavelength, flux_norm, invvar)

row = dict(zip(fe.feature_names, vector))
```

---

## Notes

- **Order matters.** The vector is only meaningful together with `fe.feature_names`; never rely on positions across versions of the module.
- **NaN versus zero.** An unmatched base line gets a prominence of `0.0` but a NaN FWHM and equivalent width. `stabilize_spectral_features` later fills NaN with 0 before its log transform, and adds `*_present` flags so that the model can tell the two cases apart.
- **Gaia columns.** `catalog_row` and the `add_*` helpers are the only entry points for catalogue data; per-spectrum extraction never reads it.
- **Source.** [`peak_detector.py`](https://github.com/PhD-Brown/AstroSpectro/blob/main/src/pipeline/peak_detector.py) and [`feature_engineering.py`](https://github.com/PhD-Brown/AstroSpectro/blob/main/src/pipeline/feature_engineering.py).

---

## See also

- [Preprocessor API](./preprocessor.md) — produces the inputs of this page
- [Classifier API](./classifier.md) — consumes the features
- [Peak detection](../pipeline/peak-detection.md)
