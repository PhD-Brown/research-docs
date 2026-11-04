# MIGRATION_MAP — AstroSpectro/website/docs → research-docs/website/docs

> Inventaire du 2026-11-03. Source : `PhD-Brown/AstroSpectro` (`website/docs/`, 35 pages, **en français**).
> Cible : `PhD-Brown/research-docs` (`website/docs/`, **en anglais**, cf. `editorial-guide.mdx` §4.2).
> Ce document ne modifie aucune page : il dit quoi récupérer, où, et ce qui bloque.

## Légende

| Statut | Signification |
|---|---|
| **couverte** | La cible existe et reprend tout le contenu source (en pratique : traduction FR→EN ligne à ligne, similarité textuelle 0.65–0.86, même nombre de lignes). Rien à récupérer, mais la **dette** héritée (liens, chiffres) reste à traiter. |
| **partielle** | La cible existe mais ne reprend qu'une partie du contenu source (stub `UnderConstruction`, résumé plus court, ou contenu éclaté). |
| **absente** | Aucune page cible n'accueille ce contenu. |
| **sans objet** | La page source n'a pas de contenu (placeholder) ou est entièrement obsolète. |

Chemins cible relatifs à `website/docs/`. « Dette » = liens hérités de l'ancien site relevés par `check-links.mjs` sur le build de `main`, et chiffres à revalider contre `FACTS_INDEX.md`.

---

## 1. Correspondance page par page

### Accueil & démarrage

| Source (AstroSpectro) | Cible (research-docs) | Statut | Contenu à récupérer / dette |
|---|---|---|---|
| `intro.mdx` (hub « Bienvenue », `HomepageHub`) | `astrospectro/index.mdx` (+ `astrospectro/overview/index.md`) | **sans objet** | La cible est plus riche. Ne pas reprendre l'affirmation « plus de 80 % de précision » ni le bandeau « v1.0.0 complète et stable » (périmés). Seul élément utile : la carte « Journal de bord » → lien vers le blog (`/Blog`, cf. §3). |
| `getting-started/index.mdx` | `astrospectro/guides/index.mdx` | **partielle** | La cible est la traduction de `user-guides/index.mdx`, pas de cette page. Récupérer l'**itinéraire suggéré** (Installation → Premier lancement → Guides / Concepts / API) et le renvoi FAQ/Issues, sous forme de bloc « Start here » en tête de `guides/index.mdx`. |
| `getting-started/installation.mdx` | `astrospectro/guides/installation.mdx` | **couverte** | Traduction complète (Codespaces + installation locale). Vérifier les commandes contre `AstroSpectro/README.md` et `pyproject.toml` actuels. |
| `getting-started/first-run.mdx` | `astrospectro/guides/quick-start.mdx` | **couverte** | Traduction. Dette : 2 avertissements HTML (`</p>` orphelins) au build sur `quick-start`. |

### Concepts

| Source | Cible | Statut | Contenu à récupérer / dette |
|---|---|---|---|
| `concepts/index.mdx` | `astrospectro/concepts/index.mdx` | **couverte** | Dette : lien `../docs/api` → `/docs/docs/api` (cassé) ; titres imbriqués (`<h1>` dans un titre) signalés par le minifieur HTML. |
| `concepts/pipeline-overview.mdx` | `astrospectro/concepts/pipeline-overview.mdx` | **couverte** | — |
| `concepts/project-structure.mdx` | `astrospectro/concepts/project-structure.mdx` | **couverte** | Arborescence à recouper avec l'état actuel de `AstroSpectro/src/` (ajout de `src/dimred/`, `src/tools/`). |
| `concepts/feature-engineering-theory.mdx` | `astrospectro/pipeline/feature-engineering-theory.mdx` | **couverte** (déplacée vers *Core Pipeline*) | Dette : 6 liens vers les anciennes routes (`../../science/features-list-183`, `xgboost-comparison`, `results-analysis`, `pca-physical-interpretation`, `./feature-extraction`) + lien absolu `/AstroSpectro/docs/science/features-list-183` dans `DescriptorFamilies.jsx`. Le composant `PhysicsVsBlackBox` affiche une progression 32→87 % sans source (FACTS_INDEX §6). |

### Science → Data / Dimred / Science

| Source | Cible | Statut | Contenu à récupérer / dette |
|---|---|---|---|
| `science/index.mdx` | `astrospectro/science/index.mdx` | **couverte** | Dette : liens `./science/lamost-dr5-data`, `./science/methodology` cassés (pointent vers les anciennes routes). |
| `science/methodology.mdx` | `astrospectro/overview/scientific-motivation.mdx` | **couverte** (déplacée vers *Overview*, titre « Methodology & Overview ») | — |
| `science/lamost-dr5-data.mdx` | `astrospectro/data/lamost-dr5.mdx` | **couverte** | Dette : `./dataset-dimred`, `./features-list-183` cassés. `LAMOSTSpecs` affiche « ~250 000 FITS », « 1″ · ~100 % matched » sans source. |
| `science/dataset-dimred.mdx` | `astrospectro/dimred/data-loader.mdx` | **couverte** | Dette : 7 liens hérités (`./dimensionality-reduction`, `./pca-physical-interpretation`, `./features-list-183`, `../user-guides/*`). Chiffres G1 (43 019) cohérents avec FACTS_INDEX §2. |
| `science/features-list-183.mdx` | `astrospectro/data/feature-dataset.mdx` | **couverte** | Doublon partiel avec `data/feature-catalog.md` (canonique selon `editorial-guide` §3.2) : décider laquelle est canonique. Dette : 4 liens hérités. |
| `science/dimensionality-reduction.mdx` | `astrospectro/dimred/index.mdx` | **couverte** | Contenu repris tel quel dans l'index ; `dimred/umap-hdbscan.md` et `dimred/tsne.md` sont des pages nouvelles plus courtes qui **dupliquent** une partie de l'index → choisir la page canonique. Dette : 7 liens hérités (`./pca-physical-interpretation`, `./xgboost-comparison`, `./dataset-dimred`, `../user-guides/visualization`…) — sur une page d'index, `./x` se résout depuis `/docs/astrospectro/` (pas `/dimred/`). |
| `science/pca-physical-interpretation.mdx` | `astrospectro/dimred/pca.mdx` | **couverte** | Dette : `./dimensionality-reduction`, `./dataset-dimred`, `./features-list-183`, `./xgboost-comparison` cassés. `VarianceChart` utilise des valeurs « approximatives » ; `EigenspectraContrast` donne 3 PC pour 95 % (faits : 5). |
| `science/autoencoder.mdx` | `astrospectro/dimred/autoencoder.mdx` | **couverte** | Dette : 4 liens hérités dans `RelatedPages`. « 107× » sans source (FACTS_INDEX §6). Le reste = run G1 `20260405T220839Z` ✓. |
| `science/xgboost-comparison.mdx` | `astrospectro/science/classification-performance.mdx` | **couverte** | Contenu **périmé** : métriques v5/G1 (87 %, ~0.964) alors que la référence est v6 (89.2 %, 0.986). À réécrire depuis FACTS_INDEX §1. Dette : 4 liens hérités. |
| `science/results-analysis.mdx` | `astrospectro/science/results-analysis.mdx` | **couverte** | Page « synthèse » qui duplique dimred + classification + SHAP (contraire à la politique de page canonique). `SHAPTop10` / `ResultsHero` sans source. Dette : 6 liens hérités. |

### Guides utilisateur

| Source | Cible | Statut | Contenu à récupérer / dette |
|---|---|---|---|
| `user-guides/index.mdx` | `astrospectro/guides/index.mdx` | **couverte** | Dette : les 5 cartes pointent vers `./user-guides/*` (cassés) ; lien `/docs/concepts` cassé. |
| `user-guides/connexion-gaia.mdx` | `astrospectro/guides/connexion-gaia.mdx` (+ `data/gaia-dr3.md`) | **sans objet** | La source est elle-même un placeholder. Contenu à **écrire** depuis `AstroSpectro/src/tools/gaia_crossmatcher.py` (cf. STUBS.md). |
| `user-guides/downloading-data.mdx` | `astrospectro/guides/downloading-data.mdx` | **couverte** | Avertissement HTML (`</p>` orphelin). Recouper avec `src/tools/dr5_downloader.py` (CLI `SmartDownloader`). |
| `user-guides/feature-extraction.mdx` | `astrospectro/guides/feature-extraction.mdx` | **couverte** | Avertissement HTML (`</p>` orphelin). |
| `user-guides/model-training.mdx` | `astrospectro/guides/model-training.mdx` | **couverte** | Dette : `../science/xgboost-comparison` cassé ; `ModelSelector` badge « 87 % BA ». |
| `user-guides/preprocessing.mdx` | `astrospectro/guides/preprocessing.mdx` | **couverte** | Dette : 4 liens hérités (`../science/lamost-dr5-data`, `features-list-183`, `dataset-dimred`, `../concepts/feature-engineering-theory`). |
| `user-guides/visualization.mdx` | `astrospectro/guides/visualization.mdx` | **couverte** | Avertissement HTML (`</p>` orphelin). |

### API

| Source | Cible | Statut | Contenu à récupérer / dette |
|---|---|---|---|
| `api/index.mdx` | `astrospectro/api/index.md` (stub) | **partielle** | Contenu FR complet présent **en double** dans `docs/api/index.mdx` (copie identique, hors sidebar mais publiée à `/docs/api`). Traduire et fusionner dans le stub, puis retirer `docs/api/`. |
| `api/preprocessor.mdx` | `astrospectro/api/preprocessor.md` (stub) | **partielle** | Idem (`docs/api/preprocessor.mdx`). Dette : lien `../user-guides/extracting-features` cassé. Vérifier les signatures contre `src/pipeline/preprocessor.py` (`SpectraPreprocessor`, `ProcessedSpectrum`). |
| `api/feature-engineer.mdx` | `astrospectro/api/feature-engineer.md` (stub) | **partielle** | Idem (`docs/api/feature-engineer.mdx`). Signatures : `src/pipeline/feature_engineering.py` (`FeatureEngineer`, `SpectralLineLibrary`, fonctions `add_*`). |
| `api/classifier.mdx` | `astrospectro/api/classifier.md` (stub) | **partielle** | Idem (`docs/api/classifier.mdx`, avertissement HTML). Signatures : `src/pipeline/classifier.py` (`SpectralClassifier`, `CollinearityFilter`, `ThresholdTunedClassifier`). |

### Communauté

| Source | Cible | Statut | Contenu à récupérer / dette |
|---|---|---|---|
| `community/index.mdx` | — | **absente** | Pas de page d'accueil *Community* (la sidebar commence par `roadmap`). Récupérer : les 4 cartes (Contribuer / Roadmap / Citer / FAQ) + bloc Remerciements & Contact. Option : `astrospectro/community/index.md` ou intégrer au début de `roadmap.md`. Courriel : utiliser **`albak1@ulaval.ca`** (décision éditoriale n° 3, `CLAUDE.md`) à la place de `alex.baker.1@ulaval.ca` de la source. |
| `community/roadmap.mdx` | `astrospectro/community/roadmap.md` | **partielle** | Cible = 26 lignes (v1.1/v1.2 + issues). Récupérer les 3 axes (scientifique, ML & données, infra) et leur état `[x]/[ ]`. Les chiffres de la source (« 174 features », « 97,9 % des top-30 », « 87 % BA », « 85+ runs, 121 métriques ») sont **à revalider** : seuls 97.9 % (part SHAP v5) et 87 % (BA v5) ont une source, avec un sens différent (FACTS_INDEX §3, §6). |
| `community/acknowledgments.mdx` | `astrospectro/community/acknowledgements.md` | **partielle** | Cible = 22 lignes. Récupérer : remerciements LAMOST (+ phrase d'acknowledgement officielle), liste des bibliothèques (NumPy, Pandas, SciPy, Astropy, specutils, scikit-learn, XGBoost, imbalanced-learn, Matplotlib, Seaborn, Jupyter, ipywidgets, Docusaurus) avec leur rôle. Ajouter Gaia/ESA (absent de la source) et PyTorch/UMAP/HDBSCAN/SHAP (utilisés par `src/dimred/`). |
| `community/citing.mdx` | `astrospectro/community/citing.md` | **partielle** | La cible a des BibTeX plus récents (2026). Récupérer : la note Zenodo/DOI à venir et la citation texte simple ; harmoniser les deux BibTeX (année, titre). |
| `community/contributing.mdx` | `astrospectro/community/contributing.md` (stub) | **partielle** | Récupérer tout le guide (types de contribution, fork → branche `feature/`/`fix/`/`docs/` → PR, normes PEP8). Mettre à jour avec `ruff` + `pre-commit` (`AstroSpectro/pyproject.toml`). |
| `community/faq.mdx` | `astrospectro/community/faq.md` (stub) | **partielle** | Récupérer les questions *Données* (autres relevés, volume à télécharger), *Techniques* (notebooks vs `src/`), *ML* ; ajouter celles prévues par le stub (spectro_only, XGBoost vs réseau, reproduire la BA, lecture du résultat SHAP) avec chiffres de FACTS_INDEX. |

---

## 2. Bilan

| Statut | Nombre | Pages source |
|---|---|---|
| couverte | 22 | installation, first-run, concepts ×4, science ×10, user-guides ×6 (hors connexion-gaia) |
| partielle | 10 | getting-started/index, api ×4, community roadmap/acknowledgments/citing/contributing/faq |
| absente | 1 | community/index |
| sans objet | 2 | intro, user-guides/connexion-gaia |
| **total** | **35** | |

**Priorités de migration** (ordre conseillé) :

1. **API** : fusionner `docs/api/*.mdx` (FR) → `astrospectro/api/*.md` (EN), puis supprimer le doublon `docs/api/` (publié, non référencé, en français, 1 lien cassé, 1 avertissement HTML).
2. **Community** : contributing + FAQ (contenu complet disponible), puis roadmap et acknowledgements.
3. **Liens hérités** : 59 occurrences (page × lien) sur les pages `astrospectro/*` pointent vers des routes inexistantes, la plupart héritées de l'ancien site (`science/*`, `user-guides/*`) ; ils sont invisibles pour `docusaurus build` car rendus par `RelatedPages` / `<a href>`. Corriger page par page avec `check-links.mjs`. **Corrigés le 2026-11-04** (PR « fondations ») : routes absolues `/docs/astrospectro/…` dans les props, liens de fichier dans la prose ; `check-links.mjs` : 0.

---

## 3. Écarts structurels à connaître

- **`website/docs/_archive/`** est une copie **exacte** de `AstroSpectro/website/docs` (hors `api/` et `intro.mdx`), exclue du build (préfixe `_`). Seule différence : dans 14 fichiers le frontmatter `description: >` a été transformé en `description: ">"` (description littérale « > »). Ne pas éditer `_archive/` ; s'en servir comme source FR.
- **`website/docs/api/`** (4 pages FR) duplique `AstroSpectro/website/docs/api/` et est **publié** à `/research-docs/docs/api/*` sans être dans une sidebar.
- **Routes** : l'ancien site utilisait `/AstroSpectro/docs/<section>/<page>` ; le nouveau `/research-docs/docs/astrospectro/<section>/<page>`. Les sections ont été renommées : `science/` → `data/` + `dimred/` + `science/` ; `user-guides/` + `getting-started/` → `guides/` ; `concepts/feature-engineering-theory` → `pipeline/`.
- **Blog** : `routeBasePath: "Blog"` (majuscule) alors que la navbar pointe vers `/blog` et le footer vers `/journal` → deux liens cassés sur **toutes** les pages (236 occurrences chacun). Correctif de config, hors périmètre de cette PR.
- **Pages research-docs sans équivalent dans AstroSpectro** (contenu nouveau, pas de migration possible) : `concepts/{spectro-only-mode, physical-purity, data-leakage-audit}`, `data/{class-taxonomy, feature-catalog}`, `pipeline/feature-engineering`, `dimred/{umap-hdbscan, tsne, comparison}`, `science/{shap-interpretability, model-card, limitations}`, `overview/key-results`, ainsi que tous les stubs listés dans `STUBS.md`.
