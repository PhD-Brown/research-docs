---
title: Citing AstroSpectro
description: How to cite the AstroSpectro software and the associated manuscript — BibTeX entries, a plain-text form, and a note on future archiving with a DOI.
sidebar_position: 3
---

{/* facts: aucun chiffre de run — BibTeX de la page existante conservés ; citation texte et note DOI reprises de docs/_archive/community/citing.mdx (année harmonisée sur 2026) */}

# Citing AstroSpectro

If you use AstroSpectro in your research, please cite it. Citations are how research software gets recognised and maintained.

---

## Software

Use this entry for any work that runs the pipeline or builds on its code.

```bibtex
@software{baker2026astrospectro_software,
  author  = {Baker, Alex},
  title   = {AstroSpectro: Interpretable ML Pipeline for Stellar Spectral Classification},
  year    = {2026},
  url     = {https://github.com/PhD-Brown/AstroSpectro},
  version = {1.0.0}
}
```

### Plain-text form

For a report, a poster or a web page:

```text
Baker, A. (2026). AstroSpectro: Interpretable ML Pipeline for Stellar Spectral Classification [Software]. https://github.com/PhD-Brown/AstroSpectro
```

:::note[A DOI is planned]
An official archive of the project on Zenodo is planned for a future release. It will provide a DOI, a permanent and more stable reference for software. Until then, cite the repository address and, if you can, the commit or release you used.
:::

---

## Manuscript in preparation

```bibtex
@article{baker2026shap,
  author  = {Baker, Alex},
  title   = {Interpretable Machine Learning for Stellar Spectral Classification
             with {LAMOST} {DR5} and {Gaia} {DR3}},
  journal = {Research Notes of the AAS},
  year    = {2026},
  note    = {Manuscript in preparation; target venue under consideration},
  url     = {https://github.com/PhD-Brown/AstroSpectro}
}
```

When the manuscript is accepted, its reference will replace this entry.

---

## Cite the results with their context

When you quote a figure from this site, give the run and the dataset it comes from, not only the number: the model, whether it is `spectro_only`, and the number of spectra. The reference model includes a few Gaia-derived features, and the dimensionality-reduction results come from a different, smaller dataset; see the [Data Leakage Audit](../concepts/data-leakage-audit.mdx) and the [Model Card](../science/model-card.mdx).

## Cite the data

The data have their own acknowledgement requirements for LAMOST and Gaia; the standard texts are on the [Acknowledgements](./acknowledgements.md) page.

---

## See also

- [Community](./index.md)
- [Acknowledgements](./acknowledgements.md)
- [Contributing](./contributing.md)
