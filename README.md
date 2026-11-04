# Alex Baker · Research Documentation

[![Deploy](https://github.com/PhD-Brown/research-docs/actions/workflows/deploy.yml/badge.svg)](https://github.com/PhD-Brown/research-docs/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docusaurus](https://img.shields.io/badge/Built%20with-Docusaurus%20v3-3ECC5F)](https://docusaurus.io)

> **Live site → [phd-brown.github.io/research-docs](https://phd-brown.github.io/research-docs/)**

Technical and scientific reference documentation for my astrophysics, astro-ML and computational-physics research projects: how they work, what they found, and how to reproduce it.

---

## Projects covered

| Project | What it is | Documentation |
|---|---|---|
| [**AstroSpectro**](https://github.com/PhD-Brown/AstroSpectro) | Interpretable ML pipeline for stellar spectral classification — LAMOST DR5 × Gaia DR3, physically motivated spectroscopic descriptors, XGBoost + SHAP, dimensionality-reduction study | [`/docs/astrospectro`](https://phd-brown.github.io/research-docs/docs/astrospectro) |
| [**AstroVision**](https://github.com/PhD-Brown/AstroVision) | Deep learning for galaxy morphology — Galaxy10 DECaLS, CNN / EfficientNet / DINOv2, morphometry, segmentation, SDSS cross-match | [`/astrovision`](https://phd-brown.github.io/research-docs/astrovision) |
| [**ξ Dark Energy · BAO MCMC**](https://github.com/PhD-Brown/xi-dark-energy-bao-mcmc) | Bayesian MCMC comparison of ΛCDM, CPL and an oscillating dark-energy model (Ξosc) on Pantheon+ and DESI DR2 BAO | [`/xi-dark-energy`](https://phd-brown.github.io/research-docs/xi-dark-energy) |

Results and metrics are deliberately **not** repeated here: they live on the site, where every figure is generated from a versioned facts pack (see [Keeping the docs current](#keeping-the-docs-current)).

The old AstroSpectro documentation site (`phd-brown.github.io/AstroSpectro`) has been retired; every one of its URLs now redirects to the matching page here.

---

## Three-layer architecture

```
phd-brown.github.io                 →  Personal hub (narrative, CV, publications)
phd-brown.github.io/research-docs   →  THIS SITE (technical and scientific reference)
github.com/PhD-Brown/*              →  Project repositories (code, READMEs, releases)
```

| Layer | Answers |
|---|---|
| Personal site | **Why** these projects exist |
| **This site** | **How** they work, what they found, how to reproduce them |
| GitHub repositories | **What** is in each repository |

Start with the [ecosystem overview](https://phd-brown.github.io/research-docs/docs/ecosystem) or the [reading paths](https://phd-brown.github.io/research-docs/docs/reading-paths).

---

## Local development

**Requirements:** Node.js ≥ 18 (CI uses Node 22), npm ≥ 9. The Docusaurus project lives in `website/`.

```bash
git clone https://github.com/PhD-Brown/research-docs.git
cd research-docs/website

npm ci              # install exact dependencies
npm run start       # dev server with hot reload → http://localhost:3000/research-docs/
npm run build       # production build (what CI runs)
npm run serve       # serve the production build locally
```

Pushing to `main` builds and deploys the site through GitHub Actions ([`deploy.yml`](.github/workflows/deploy.yml)). Work on a branch and open a pull request; nothing is published until it is merged.

---

## Repository structure

```
research-docs/
├── website/                       # Docusaurus project (run npm commands here)
│   ├── docs/                      # Main instance
│   │   ├── astrospectro/          #   AstroSpectro: overview, concepts, data, pipeline,
│   │   │                          #   dimred, science, guides, API, community
│   │   ├── atlas/                 #   Cross-project glossary, indexes, claims register,
│   │   │                          #   page style guide
│   │   ├── ecosystem.mdx          #   How the three projects connect
│   │   ├── reading-paths.md       #   Navigation by reader profile
│   │   └── editorial-guide.mdx    #   Writing and structure rules
│   ├── docs-astrovision/          # AstroVision instance   (route /astrovision)
│   ├── docs-xi/                   # ξ Dark Energy instance (route /xi-dark-energy)
│   ├── blog/                      # Research log           (route /Blog)
│   ├── src/
│   │   ├── components/            # MDX components (shared + astrovision/ + xi/)
│   │   ├── data/                  # Generated data layers: astrospectro/runs.json,
│   │   │                          #   astrovision/facts.json, xi/facts.json
│   │   └── css/custom.css         # Theme (light/dark)
│   ├── static/img/                # Published figures
│   ├── docusaurus.config.ts
│   └── sidebars*.ts               # One sidebar per instance
│
├── _facts/                        # Facts packs exported from the project repos
│   ├── astrospectro/              #   (results, run reports, metadata, figures)
│   ├── astrovision/               #   Each pack has a MANIFEST.md
│   └── xi/
├── scripts/
│   ├── export_doc_facts.py        # Export a facts pack from a local project checkout
│   └── build_*_data.py            # Build the data layers from _facts/
├── FACTS_INDEX.md                 # Registry: which file/key every published number comes from
├── CLAUDE.md · .claude/skills/    # Conventions and procedures for AI-assisted editing
└── .github/workflows/deploy.yml
```

---

## Keeping the docs current

**Rule:** every number published on the site comes from a file in `_facts/`. Pages and components never hard-code results; they read the generated data layers (`<RunFact />` for AstroSpectro, `<Fact />` for AstroVision and ξ).

When a project produces a new run or result:

```bash
# 1. Export the facts pack from your local checkout (copies results, reports and
#    figures; skips models and large binaries; masks local paths)
python scripts/export_doc_facts.py --project astrospectro --source ../AstroSpectro
#    --project astrovision | xi   ·   add --dry-run to preview

# 2. Point the registry at the new reference run if it changed
#    (FACTS_INDEX.md for AstroSpectro, _facts/<project>/FACTS_INDEX.md otherwise)

# 3. Regenerate the data layer
python scripts/build_runs_data.py          # AstroSpectro → website/src/data/astrospectro/runs.json
python scripts/build_astrovision_data.py   # or build_xi_data.py
#    add --check to verify the generated file is up to date

# 4. Verify, then open a pull request
cd website && npm run build
node ../.claude/skills/docs-verify/scripts/check-links.mjs build
```

The full procedure, including screenshot and number checks, is in [`.claude/skills/docs-new-run`](.claude/skills/docs-new-run/SKILL.md) and [`.claude/skills/docs-verify`](.claude/skills/docs-verify/SKILL.md).

---

## Editorial rules (short version)

- **One page = one mission:** theory, guide, results or API reference — never all at once.
- **Every result carries its context:** run ID, dataset, sample size, and any known limitation (for example, the Gaia/photometric features present in the AstroSpectro v6 reference run).
- **Stable vs. volatile:** overview pages describe concepts; numbers live in dedicated results pages fed by the data layers.

Full rules: [editorial guide](https://phd-brown.github.io/research-docs/docs/editorial-guide) · [page style guide](https://phd-brown.github.io/research-docs/docs/atlas/page-style-guide) · [claims register](https://phd-brown.github.io/research-docs/docs/atlas/claims-register).

---

## Contributing

This is a personal research documentation site. Issues and suggestions are welcome via [GitHub Issues](https://github.com/PhD-Brown/research-docs/issues).

If you spot a scientific error, an unsourced number or a broken link, please open an issue — reproducibility and accuracy are core to this project.

---

## Citation

If you use material from these docs, please cite the relevant research project:

```bibtex
@misc{baker2026astrospectro,
  author = {Baker, Alex},
  title  = {AstroSpectro: Interpretable ML for Stellar Spectral Classification},
  year   = {2026},
  url    = {https://phd-brown.github.io/research-docs/docs/astrospectro}
}
```

Each project's documentation has its own citation page.

---

## Links

- **Personal site:** [phd-brown.github.io](https://phd-brown.github.io)
- **GitHub:** [github.com/PhD-Brown](https://github.com/PhD-Brown)
- **ORCID:** [0009-0007-3242-1829](https://orcid.org/0009-0007-3242-1829)
- **Contact:** [albak1@ulaval.ca](mailto:albak1@ulaval.ca)

---

*Built with [Docusaurus](https://docusaurus.io) · MIT License · © 2026 Alex Baker*
