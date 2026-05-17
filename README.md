# Alex Baker · Research Documentation

[![Deploy](https://github.com/PhD-Brown/research-docs/actions/workflows/deploy.yml/badge.svg)](https://github.com/PhD-Brown/research-docs/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docusaurus](https://img.shields.io/badge/Built%20with-Docusaurus%20v3-3ECC5F)](https://docusaurus.io)

> **Live site → [phd-brown.github.io/research-docs](https://phd-brown.github.io/research-docs/)**

Technical and scientific reference documentation for my astrophysics, astro-ML, and computational physics research projects.

---

## Projects covered

| Project | Description | Status |
|---------|-------------|--------|
| [**AstroSpectro**](https://github.com/PhD-Brown/AstroSpectro) | Interpretable ML pipeline for stellar spectral classification — LAMOST DR5 × Gaia DR3 · 183 features · 87% balanced accuracy | `v1.0` |
| [**AstroVision**](https://github.com/PhD-Brown/AstroVision) | Deep learning for galaxy morphological classification — DINOv2 + morphometrics + SDSS · 86.3% balanced accuracy | `active` |
| [**ξ Dark Energy · BAO MCMC**](https://github.com/PhD-Brown/xi-dark-energy-bao-mcmc) | Bayesian MCMC inference comparing ΛCDM, CPL, and Ξosc dark-energy models | `v0.1.0-exploratory` |

---

## Three-layer architecture

```
phd-brown.github.io          →  Personal hub (narrative, CV, publications)
phd-brown.github.io/research-docs  →  THIS SITE (technical/scientific reference)
github.com/PhD-Brown/*       →  Project repos (code, READMEs, releases)
```

**This site answers:** *how the projects work, what results they produce, how to reproduce them.*

---

## Local development

**Requirements:** Node.js ≥ 18, npm ≥ 9

```bash
# Clone
git clone https://github.com/PhD-Brown/research-docs.git
cd research-docs

# Install dependencies
npm install

# Start dev server (hot reload)
npm run start
# → http://localhost:3000/research-docs/

# Production build
npm run build

# Serve the production build locally
npm run serve
```

---

## Repository structure

```
research-docs/
├── docs/                     # AstroSpectro documentation (primary)
│   ├── astrospectro/         # Science, pipeline, API reference
│   ├── atlas/                # Cross-project glossary and index
│   ├── ecosystem.md          # How the 3 projects connect
│   └── reading-paths.md      # Navigation guide by persona
│
├── docs-astrovision/         # AstroVision documentation
├── docs-xi/                  # ξ Dark Energy documentation
│
├── blog/                     # Journal de bord (research log)
├── src/
│   ├── pages/index.js        # Landing page (custom React)
│   ├── pages/index.module.css
│   └── css/custom.css        # Global theme overrides
│
├── static/
│   └── img/                  # Figures, logos, social card
│
├── docusaurus.config.ts      # Main Docusaurus configuration
├── sidebars.ts               # AstroSpectro sidebar
├── sidebars-astrovision.ts   # AstroVision sidebar
└── sidebars-xi.ts            # ξ Dark Energy sidebar
```

---

## Editorial rules (short version)

| Layer | Answers |
|-------|---------|
| Personal site | Why these projects exist |
| **This site** | How they work, how to reproduce them |
| GitHub READMEs | What each repo is |

**One page = one mission.** A page is either theory, guide, results, or API — never all at once.

Full rules in [`docs/editorial-guide.md`](docs/editorial-guide.md).

---

## Contributing

This is a personal research documentation site. Issues and suggestions are welcome via [GitHub Issues](https://github.com/PhD-Brown/research-docs/issues).

If you spot a scientific error or a broken link, please open an issue — reproducibility and accuracy are core to this project.

---

## Citation

If you use material from these docs in your own work, please cite the relevant research project:

```bibtex
@misc{baker2026astrospectro,
  author  = {Baker, Alex},
  title   = {AstroSpectro: Interpretable ML for Stellar Spectral Classification},
  year    = {2026},
  url     = {https://phd-brown.github.io/research-docs/docs/astrospectro/overview}
}
```

---

## Links

- **Personal site:** [phd-brown.github.io](https://phd-brown.github.io)
- **GitHub:** [github.com/PhD-Brown](https://github.com/PhD-Brown)
- **ORCID:** [0009-0007-3242-1829](https://orcid.org/0009-0007-3242-1829)
- **Contact:** albak1@ulaval.ca

---

*Built with [Docusaurus](https://docusaurus.io) · MIT License · © 2026 Alex Baker*