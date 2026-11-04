---
title: Contributing
description: How to report a problem, propose a change to the AstroSpectro code, or improve this documentation — fork, branch, code style (black, ruff, pre-commit), pull request.
sidebar_position: 2
---

{/* facts: aucun chiffre de run — procédure relue dans AstroSpectro/pyproject.toml, .pre-commit-config.yaml, README.md ; contenu migré de docs/_archive/community/contributing.mdx */}

# Contributing

Every contribution is welcome, from a typo fix to a new feature. You do not need to be an expert in Python or astrophysics: a clear bug report or a sentence that was hard to follow in the documentation already helps.

This page covers four kinds of contribution. The code lives in the [AstroSpectro repository](https://github.com/PhD-Brown/AstroSpectro) and this documentation in [research-docs](https://github.com/PhD-Brown/research-docs).

---

## Report a problem or suggest an improvement

Open an issue in the [AstroSpectro repository](https://github.com/PhD-Brown/AstroSpectro/issues/new). The repository has no issue templates, so include the following yourself:

- **A bug**: what you ran (notebook and cell, or the call to `MasterPipeline`, `SpectralClassifier`…), what you expected, what happened (full traceback), and your environment (Python version, operating system, `pip freeze` for the packages involved).
- **A suggestion**: the problem you want to solve, rather than only the solution; the [Roadmap](./roadmap.md) shows what is already planned.
- **A documentation error**: the page address and the sentence concerned.

Check the [FAQ](./faq.md) first; your question may already have an answer.

---

## Contribute code

### 1. Prepare

1. **Fork** the repository on GitHub, then clone your fork:

   ```bash
   git clone https://github.com/<your-user>/AstroSpectro.git
   cd AstroSpectro
   ```

2. **Install** the project in a Python 3.11 environment (the package declares `>=3.11,<3.12`):

   ```bash
   python -m pip install --upgrade pip
   python -m pip install -e . -r requirements.txt
   ```

   The [installation guide](../guides/installation.mdx) also describes the zero-install GitHub Codespaces route.

3. **Create a branch.** Never work on `main`. Use a prefix that says what the change is:

   ```bash
   git checkout -b feature/add-tio-lines     # new capability
   git checkout -b fix/preprocessor-median   # bug fix
   git checkout -b docs/clarify-spectro-only # documentation
   ```

### 2. Develop

- **Respect the structure.** Pipeline logic lives in `src/pipeline/`, dimensionality reduction in `src/dimred/`, helpers in `src/tools/` and `src/utils.py`. Notebooks orchestrate and display; they should not hold logic that other code needs. See [Project structure](../concepts/project-structure.mdx).
- **Follow the code style.** The repository uses `black` and `ruff` through [pre-commit](https://pre-commit.com/):

  ```bash
  python -m pip install pre-commit
  pre-commit install
  pre-commit run --all-files   # optional: check the whole tree
  ```

  Hooks then run on every commit (`black` reformats, `ruff --fix` corrects what it can). The existing modules use NumPy-style docstrings with a *Parameters / Returns / Raises* layout; keep to it for new public functions.
- **Test what you change.** The repository does not contain an automated test suite yet (it is on the [Roadmap](./roadmap.md)). Run the part of the pipeline you modified on a small batch, and say in the pull request what you ran and what you saw.
- **Keep reproducibility.** Seeds are explicit (`random_state=42` by default); do not introduce unseeded randomness.

### 3. Submit

1. Commit with a clear message:

   ```bash
   git add <files>
   git commit -m "Add TiO band features to FeatureEngineer"
   ```

2. Push your branch to your fork:

   ```bash
   git push -u origin feature/add-tio-lines
   ```

3. Open a **pull request** from your fork. Describe what changes and why, how you checked it, and link the issue it closes (`Closes #<number>`).

The maintainer reviews the pull request, may ask for changes, and merges it when it is ready.

---

## Contribute to the documentation

This site is built with Docusaurus from the [research-docs](https://github.com/PhD-Brown/research-docs) repository. Its rules are in the [Editorial guide](../../editorial-guide.mdx) and the [page style guide](../../atlas/page-style-guide.mdx). The ones that matter most:

- Pages are written in **English**.
- **Every number comes from a source file.** A published figure must be traceable to the exported fact files of the repository (`_facts/`); run figures are read from the generated run data and not typed into pages.
- **Context goes with every metric**: model, mode (`spectro_only` or not), number of spectra, classes, run. Two generations of data exist and must not be mixed in one sentence.
- Work on a branch and open a pull request; `main` is protected by a pre-commit hook.
- Before opening it, run `npm run build` in `website/` and read the log for broken links: the build only warns about them.

---

## Contribute scientific work

New analyses, a different survey, a new feature family or a critique of a result are all useful. To make them easy to review:

- State the **dataset** (survey, cross-match, number of spectra, filters) and whether the analysis is `spectro_only`.
- Give the **model and its configuration**, and whether Gaia-derived columns could be among the inputs. Results that use them must say so; see the [Data Leakage Audit](../concepts/data-leakage-audit.mdx).
- Separate the **result** from its **interpretation**, and use calibrated verbs ("suggests", "is consistent with").
- Keep the exploratory work labelled as exploratory.

If you are unsure where an idea fits, open an issue first.

---

## Contact

For a private question or a collaboration, write to [albak1@ulaval.ca](mailto:albak1@ulaval.ca).

---

## See also

- [Community](./index.md)
- [Roadmap](./roadmap.md)
- [API Reference](../api/index.md)
- [Editorial guide](../../editorial-guide.mdx)
