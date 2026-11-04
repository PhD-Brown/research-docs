---
title: Preprocessor API
description: API reference for src/pipeline/preprocessor.py — SpectraPreprocessor and ProcessedSpectrum, from a LAMOST FITS file to wavelength, flux and cleaned inverse-variance arrays.
sidebar_position: 1
---

{/* facts: aucun chiffre de run — signatures relues dans AstroSpectro/src/pipeline/preprocessor.py et src/utils.py */}

# Preprocessor API

`src/pipeline/preprocessor.py` turns an opened LAMOST DR5 FITS file into plain arrays: wavelength, flux and inverse-variance, with optional median normalisation and an Astropy uncertainty object. It is the first active step of the pipeline. For the concept and the design choices, see [Preprocessing](../pipeline/preprocessing.md); for a task-oriented walkthrough, see the [Preprocessing guide](../guides/preprocessing.mdx).

```python
from pipeline.preprocessor import SpectraPreprocessor, ProcessedSpectrum
```

The package modules live in `src/`. Add that folder to `sys.path` (the notebooks do it with `utils.setup_project_env()`) before importing `pipeline`, `tools` or `dimred`.

---

## SpectraPreprocessor

A stateless class: the constructor takes no argument and keeps no state between calls.

```python
sp = SpectraPreprocessor()
```

### `load_spectrum(hdul)`

Reads one spectrum from an already opened `astropy.io.fits.HDUList`.

| Parameter | Type | Description |
|---|---|---|
| `hdul` | `astropy.io.fits.HDUList` | Opened FITS file. Compressed `.fits.gz` files are handled by `fits.open`. |

**Returns** a tuple `(wavelength, flux, invvar)` of three `np.ndarray` of shape `(N,)`.

- `flux` is row 0 of `hdul[0].data`, `invvar` is row 1.
- `wavelength` (Å) is rebuilt as `10 ** (COEFF0 + i * COEFF1)` from the header keywords `COEFF0` (starting log₁₀ wavelength) and `COEFF1` (log₁₀ step).

**Raises** `ValueError` if the data array has fewer than two rows, or if `COEFF0` or `COEFF1` is missing from the header.

### `normalize_spectrum(flux, method="median")`

Divides a flux vector by its median.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `flux` | `np.ndarray` | — | One-dimensional flux array. |
| `method` | `str` | `"median"` | Only `"median"` is implemented. |

**Returns** an `np.ndarray` with the same shape as `flux`.

**Raises** `ValueError` if `method` is not `"median"`.

**Edge case.** If the median is zero, negative or not finite, the function emits a `UserWarning` and returns the flux unchanged (no exception).

### `prepare(hdul, normalize=True, return_uncertainty=False, min_invvar=1e-12)`

Short pipeline: read, sanitise the inverse-variance, optionally normalise, optionally build the uncertainty.

| Parameter | Type | Default | Description |
|---|---|---|---|
| `hdul` | `astropy.io.fits.HDUList` | — | Opened FITS file. |
| `normalize` | `bool` | `True` | Fill `flux_norm` with the median-normalised flux. |
| `return_uncertainty` | `bool` | `False` | Fill `uncertainty` with a `StdDevUncertainty`. |
| `min_invvar` | `float` | `1e-12` | Floor applied to the inverse-variance during sanitisation. |

**Returns** a [`ProcessedSpectrum`](#processedspectrum).

---

## ProcessedSpectrum

A `@dataclass` returned by `prepare()`.

| Field | Type | Description |
|---|---|---|
| `wavelength` | `np.ndarray` `(N,)` | Wavelength grid in Å. |
| `flux` | `np.ndarray` `(N,)` | Raw flux. |
| `invvar` | `np.ndarray` `(N,)` | Raw inverse-variance (see the note on in-place cleaning below). |
| `flux_norm` | `np.ndarray` or `None` | Median-normalised flux, if `normalize=True`. |
| `invvar_clean` | `np.ndarray` or `None` | Inverse-variance after `sanitize_invvar` (`prepare()` always fills it). |
| `uncertainty` | `StdDevUncertainty` or `None` | Standard deviation, if `return_uncertainty=True`. |

---

## Helpers from `src/utils.py`

`prepare()` relies on two helpers that can also be used on their own.

| Function | Signature | Behaviour |
|---|---|---|
| `sanitize_invvar` | `(invvar, min_val=1e-12) -> np.ndarray` | Replaces NaN, Inf and non-positive entries with 0, then clips to `[min_val, +inf)`. |
| `make_stddev_uncertainty_from_invvar` | `(invvar, min_val=1e-12) -> StdDevUncertainty` | Sanitises, then returns `1 / sqrt(invvar)` as an Astropy `StdDevUncertainty`. |

The feature extractor uses a third helper, `safe_sigma_from_invvar(invvar, *, bad_to_inf=True)`, which returns `+inf` (or NaN) instead of a floor for invalid pixels.

---

## Example

```python
from astropy.io import fits
from pipeline.preprocessor import SpectraPreprocessor

sp = SpectraPreprocessor()

with fits.open("data/raw/<plan>/<spectrum>.fits.gz") as hdul:
    # Step by step
    wavelength, flux, invvar = sp.load_spectrum(hdul)
    flux_norm = sp.normalize_spectrum(flux)

    # Or in one call
    spec = sp.prepare(hdul, normalize=True, return_uncertainty=True)

print(spec.wavelength.min(), spec.wavelength.max())  # Å
print(spec.flux_norm.shape, spec.uncertainty.array.shape)
```

---

## Notes

- **Units.** Wavelengths are in Å. The reader assumes the LAMOST DR5 layout (flux in row 0, inverse-variance in row 1, `COEFF0`/`COEFF1` in the primary header); other surveys need a different reader.
- **In-place cleaning.** `sanitize_invvar` calls `np.asarray(..., dtype=float)`, which does not copy a `float64` array. Invalid pixels of the array passed in are therefore set to 0 in place, and the `invvar` field of a `ProcessedSpectrum` can already be partly cleaned. `invvar_clean` is the field to use downstream.
- **Where it is called.** `ProcessingPipeline` calls `load_spectrum()` and `normalize_spectrum()` directly for each spectrum, not `prepare()` (see [Processing pipeline](../pipeline/processing-pipeline.md)). Errors on corrupted files are caught there, not in this module.
- **Source.** [`src/pipeline/preprocessor.py`](https://github.com/PhD-Brown/AstroSpectro/blob/main/src/pipeline/preprocessor.py) and [`src/utils.py`](https://github.com/PhD-Brown/AstroSpectro/blob/main/src/utils.py).

---

## See also

- [Peak detection](../pipeline/peak-detection.md) — the next step after normalisation
- [FeatureEngineer API](./feature-engineer.md)
- [API Reference index](./index.md)
