# Catalogue des composants — `website/src/components/`

Inventaire exhaustif (72 fichiers JSX/TSX, relus le 2026-11-03). Pour chaque composant : rôle, props,
origine des données, compatibilité mode clair, page d'exemple.

## Légende

- **Props** : `—` = aucun prop, tout est codé en dur dans le fichier.
- **Données** : `codées` = constantes dans le JSX (chiffres à vérifier contre `FACTS_INDEX.md` avant réutilisation) ; `props` = fournies par la page ; `content.js` = fichier de contenu voisin.
- **Clair** : ✅ uniquement des variables `--ifm-*` / CSS module ; ⚠️ bordures ou fonds `rgba(255,255,255,…)` peu visibles en clair ; ❌ fond sombre codé en dur.
- **Exemple** : page (relative à `website/docs/`) où le composant est utilisé — à ouvrir pour voir l'intégration.
- Import : `import X from '@site/src/components/X';` (sous-dossiers : `@site/src/components/home/X`, `…/ecosystem/X`).

---

## 1. Composants génériques réutilisables (prop-driven) — à privilégier

| Composant | Rôle | Props | Clair | Exemple | Notes |
|---|---|---|---|---|---|
| `CrossReferences` | Tableau « Related page / Relation » de fin de page | `links=[{href, label, relation, featured?}]` (défaut `[]` → rien) | ✅ sauf `featured` | `astrospectro/index.mdx` | `<a href>` bruts : non vérifiés par Docusaurus ; href résolu depuis l'URL rendue. **Bug** : la ligne `featured` est illisible en sombre (fond `--ifm-color-primary-lightest` sous texte clair) → ne pas utiliser `featured` |
| `RunProvenance` | Carte « Current run » (expérience, date UTC, MD5, stack, notes, lien) | `experiment, savedAt, md5, notes, stack, keyResultsHref='./overview/key-results'` (champs vides masqués) | ✅ | `astrospectro/index.mdx` | Valeurs : FACTS_INDEX §1.1 |
| `RelatedPages` | Grille de cartes « Related pages » colorées par catégorie | `pages=[{href, title, desc, category, badge?}]`, `title='Related pages'` ; catégories `science·guides·concepts·api·community·journal·external` | ⚠️ | 11 pages, ex. `astrospectro/dimred/autoencoder.mdx` | `<a href>` bruts ; beaucoup d'instances pointent vers les anciennes routes (MIGRATION_MAP) |
| `FigureGallery` | Galerie d'images + lightbox (clavier ←/→/Échap) | `figures=[{src, title, desc?, tag?}]`, `columns=3` | ⚠️ | `astrospectro/dimred/autoencoder.mdx` | `src` sans baseUrl (ajoutée via `useBaseUrlUtils`) ; déclarer `export const xFigures = […]` dans la page |
| `SpectralLineRows` | Tableau générique de raies avec barre de position λ (3690–9100 Å) | `color='#60A5FA'`, `columns=[…]`, `rows=[{label, lambda?, tag?, desc, highlight?}]`, `footer?` | ⚠️ | `astrospectro/data/feature-dataset.mdx` (familles 1–3) | Seul composant « données » entièrement paramétré |
| `UnderConstruction` | Boîte animée « Under Construction » | — | ✅ (CSS module) | 98 stubs (STUBS.md) | À remplacer par `:::info Under construction` (editorial-guide §6.3) |

## 2. Page d'accueil AstroSpectro (`astrospectro/index.mdx`) — statiques, thème-compatibles

| Composant | Rôle | Props | Données | Clair | Exemple |
|---|---|---|---|---|---|
| `ProjectHero` | Cadre « Scientific question » + 3 piliers (Physics-informed, Interpretable by design, Leakage-aware) | — | codées (texte) | ✅ | `astrospectro/index.mdx` |
| `ProjectPhilosophy` | Grille des 5 principes du projet | — | codées (texte) | ✅ | `astrospectro/index.mdx` |
| `WhatAstroSpectroDoes` | Stepper vertical des 6 étapes du pipeline, chaque étape liée à sa page | — | codées (texte + hrefs `./astrospectro/...`) | ✅ | `astrospectro/index.mdx` |
| `ResearchSections` | Table de navigation des sections (✓ statut) | — | codées (hrefs) | ✅ | `astrospectro/index.mdx` |
| `ResultsLocator` | Encadré « Latest highlighted analysis » + table « If you are looking for… → Go to » | — | codées (texte + hrefs) | ✅ | `astrospectro/index.mdx` |
| `ProgressionPipeline` | Frise des étapes 32 % → 75–84 % → 87 % (RF → XGBoost → spectro_only) | — | codées | ⚠️ | `astrospectro/index.mdx`, `science/results-analysis.mdx`, `science/classification-performance.mdx` |

> `ProgressionPipeline` : seul le palier 87 % a une source (BA v5) — FACTS_INDEX §6.

## 3. Composants « résultats » AstroSpectro — chiffres codés en dur

### 3.1 Classification / SHAP

| Composant | Rôle | Données codées | Clair | Exemple | Statut des chiffres |
|---|---|---|---|---|---|
| `ClassifierMetrics` | 3 cartes (BA, confiance médiane, ROC-AUC) | 87 %, 96.3 %, ~0.964 | ⚠️ | `science/classification-performance.mdx` (+ results-analysis, model-training) | ❌ périmés / sans source (FACTS_INDEX §6) |
| `ResultsHero` | 5 cartes de synthèse (PCA ρ, HDBSCAN, Procrustes, ROC-AUC, part SHAP) | +0.831, 20, 5×10⁻⁴, ~0.964, 97.9 % | ✅ | `science/results-analysis.mdx` | ⚠️ 0.964 sans source ; 97.9 % mal libellé |
| `SHAPTop10` | Barres du top-10 SHAP par famille | importances 0.98…0.59 (Ca II K en tête) | ⚠️ | `science/classification-performance.mdx`, `science/results-analysis.mdx` | ❌ aucun CSV SHAP ne donne ce classement |
| `PCAvsXGBoost` | Deux colonnes « PCA (variance) vs XGBoost (discrimination) » | ρ(PC1,Teff) +0.831 ; « Ca II dominates SHAP top-5 » | ⚠️ | idem | ⚠️ affirmation SHAP contredite par `_facts` |
| `SpectralClasses` | Cartes des classes A–M (Teff, performance qualitative, fraction) + barre Harvard | Teff, « ~2 % / ~8 %… », « Good / Very good » | ⚠️ | `science/classification-performance.mdx` | ⚠️ fractions sans source (comptes : `last_config_used.json` `class_counts`) |
| `TrainingConfig` | Carte de configuration d'entraînement + hyperparamètres | N = 43,019 ; run 20260213T225019Z ; hyperparamètres v6 | ⚠️ | `science/classification-performance.mdx` | ❌ mélange G1 / v6 / run de février |
| `UMAPPredictions` | Onglets d'images UMAP colorées par prédiction XGBoost + annotations de régions | images `/img/dimred/umap_xgboost_{predictions,FG_confusion}.png` | ⚠️ | `science/classification-performance.mdx` | Images G1, modèle v5 |
| `ModelSelector` | Grille des 11 modèles disponibles dans `SpectralClassifier` | badge « 87 % BA » sur XGBoost | ⚠️ | `guides/model-training.mdx` | Liste à recouper avec `AS/src/pipeline/classifier.py` |
| `TrainingPipelineFlow` | Onglets « Integrated pipeline » / « W&B tracking (121 metrics) » | étapes du pipeline, catégories W&B | ⚠️ | `guides/model-training.mdx` | « 121 metrics » sans source |
| `ArtifactsTree` | Arborescence `data/models`, `data/reports/<ISO>` + champs du `_meta.json` | noms de fichiers, champs | ❌ fond `#06080f` | `guides/model-training.mdx` | Champs à jour (cf. meta v6) |

### 3.2 Réduction de dimension

| Composant | Rôle | Données codées | Clair | Exemple | Statut des chiffres |
|---|---|---|---|---|---|
| `AEKeyMetrics` | 4 cartes clés de l'autoencodeur | 0.489 · ≈PCA@10 · 145 epochs · 107× | ⚠️ | `dimred/autoencoder.mdx` | ✅ run G1 `20260405T220839Z` sauf **107×** (sans source). Bug : `useState` dans un `.map` |
| `AEArchitecture` | Schéma interactif encodeur/décodeur 183→256→128→64→2 | dims, Dropout 0.1, Adam 1e-3, batch 512, patience 15, ~330k params | ⚠️ | `dimred/autoencoder.mdx` | À recouper avec `AS/src/dimred/autoencoder.py` |
| `AEReconBenchmark` | Courbe SVG MSE(k) PCA vs ligne AE(z=2) | MSE PCA k=1…50, AE 0.489, run 20260405T220839Z | ⚠️ | `dimred/autoencoder.mdx` | ✅ G1 |
| `AELatentCorrelations` | ρ Spearman des axes AE vs PCA avec Gaia (Teff, log g, [Fe/H], BP−RP) | ρ AE et PCA (G1) | ⚠️ | `dimred/autoencoder.mdx` | ✅ G1 (sur G2 l'interprétation change, FACTS_INDEX §2.4) |
| `PCAxisCards` | 2 cartes d'axe (PC1 thermique, PC2 métallicité) avec contributions par famille | variance %, λ, ρ, % par famille | ⚠️ | `dimred/pca.mdx` | ✅ variance/ρ G1 ; % par famille à vérifier |
| `VarianceChart` | Histogramme variance PC1–PC20 + seuils 80/90/95/99 % + table MSE | **valeurs « approximate realistic »** pour PC3–PC20 | ⚠️ | `dimred/pca.mdx` | ❌ remplacer par `pca_features.variance_summary_top10` |
| `PCAVarianceMilestones` | Jalons k = 2/10/51/91/100 avec variance et MSE | 28.8 %, 50.6 %, 80 %, 95 %, 99 % ; MSE | ⚠️ | `science/results-analysis.mdx` | ⚠️ « ~0.050 », « <0.010 » à sourcer |
| `EigenspectraContrast` | PCA flux brut vs PCA features (3 PC chacun) | 46.6/31.8/12.9 % ; 16.9/12.0/9.5 % ; k95 3 vs 91 | ⚠️ | `dimred/pca.mdx` | ❌ k95 flux brut = 5, pas 3 |
| `FamilyContributions` | Barres doubles PC1/PC2 par famille spectroscopique | % par famille | ⚠️ (texte noir sur barres) | `dimred/pca.mdx` | À sourcer |
| `LoadingsBars` | Top-5 loadings PC1 et PC2 | poids ±0.17–0.21 | ⚠️ | `dimred/pca.mdx`, `data/feature-dataset.mdx` | Comparer à `pca_features.top_features_pc1/2` (G1) |
| `GaiaCorrelations` | Heatmap ρ(PC1/PC2, paramètres Gaia/SNR/A_G) | ρ G1 | ⚠️ | `dimred/pca.mdx`, `data/feature-dataset.mdx` | ✅ G1 (`corrélations_pc_gaia_spearman`) |
| `MethodComparison` | Tableau comparatif PCA / UMAP / t-SNE (MSE, ρ, Procrustes, CPU, paramétrique…) | 0.696 · +0.831/+0.464/+0.623 · 3.0×10⁻² / 5.0×10⁻⁴ · 40.1 s / 80.2 s | ⚠️ | `dimred/index.mdx` | ✅ G1 sauf ρ UMAP/t-SNE à recouper |
| `ProcrustesStability` | Barres de distance de Procrustes par seed (UMAP vs t-SNE) | seeds 1–4 | ⚠️ | `dimred/index.mdx` | ✅ G1 (`20260430T215407Z`, `20260405T214233Z`) |
| `HDBSCANClusters` | Barres des clusters HDBSCAN + groupes HR | 20 clusters, bruit 2,643 (6.14 %), tailles | ⚠️ | `dimred/index.mdx` | ✅ G1 ; étiquettes physiques (Teff, log g) à sourcer |
| `HyperparamSensitivity` | Onglets UMAP `n_neighbors` / t-SNE `perplexity` (5–100) avec verdict | qualitatif | ⚠️ | `dimred/index.mdx` | Qualitatif (figures de sensibilité) |
| `DimRedPipeline` | Diagramme de flux X → scaler → PCA(91) → UMAP / t-SNE | dimensions, temps 40.1/80.2 s | ⚠️ | `dimred/index.mdx` | ✅ G1 |
| `UMAP3DViewer` | Onglets d'iframes Plotly 3D (classes, Teff, [Fe/H]) | `/img/dimred/umap3d_{classes,teff,feh}.html` | ⚠️ | `dimred/index.mdx` | Fichiers HTML G1 |
| `DatasetStats` | 5 cartes du jeu dimred (N, p, λ, R, rayon Gaia) | 43,019 · 183 · 3690–9100 · ≈1800 · 1″ | ⚠️ | `dimred/data-loader.mdx` | ⚠️ rayon 1″ sans source |
| `ClassDistribution` | Barre STAR/GALAXY/QSO + cartes | 42,956 / 56 / 7 | ✅ | `dimred/data-loader.mdx` | ✅ G1 ; note « ×107 » sans source |
| `QualityPipeline` | Étapes de filtrage (SNR_r > 10, RUWE < 1.4) | critères | ⚠️ | `dimred/data-loader.mdx` | ⚠️ code : `>=` et masquage RUWE (STUBS #16) |
| `DescriptorFamilies` | Cartes des 6 familles de descripteurs + barre de répartition | ~35/~20/~15/~30/~18/~65 | ⚠️ | `dimred/data-loader.mdx`, `pipeline/feature-engineering-theory.mdx` | Lien codé cassé `/AstroSpectro/docs/science/features-list-183` |

### 3.3 Données et features

| Composant | Rôle | Données codées | Clair | Exemple |
|---|---|---|---|---|
| `LAMOSTSpecs` | Fiche technique LAMOST + jeu AstroSpectro | spécifications instrument, « ~250,000 FITS », « 1″ · ~100 % » | ⚠️ | `data/lamost-dr5.mdx` |
| `FITSFieldsTable` | Table filtrable des champs d'en-tête FITS (catégories, exclus par spectro_only) | 19 champs | ⚠️ | `data/lamost-dr5.mdx` |
| `FamilyOverview` | Mosaïque 183 cellules par famille + légende | effectifs par famille | ⚠️ | `data/feature-dataset.mdx` |
| `SpectralCoverage` | Spectre 3690–9100 Å avec positions des raies par famille | longueurs d'onde | ⚠️ | `data/feature-dataset.mdx` |
| `ExcludedVariables` | 3 cartes des variables exclues (ra, dec, redshift) | texte | ❌ fond de repli `#0a0c14` | `data/feature-dataset.mdx` |
| `MetalsTable` | Cartes par élément (Fe, Cr, Ni, Na, Ba, Sr, Si, Ti, Al, Co, V) avec raies | λ, force | ⚠️ | `data/feature-dataset.mdx` |
| `LickIndexTable` | Indices Lick/SDSS/standard avec domaine λ | bandes | ⚠️ | `data/feature-dataset.mdx` |
| `MolecularBands` | Bandes TiO/VO/CN/CH/CaH/MgH sur l'axe λ | centres, demi-largeurs | ⚠️ | `data/feature-dataset.mdx` |
| `ContinuumDescriptors` | Pentes, courbures, sauts, couleurs synthétiques | noms de features, plages | ⚠️ | `data/feature-dataset.mdx` |
| `PhysicsVsBlackBox` | Onglets « approche physique vs boîte noire » + progression 32 → 87 % | % de progression | ⚠️ | `pipeline/feature-engineering-theory.mdx` |

### 3.4 Prétraitement (guides)

| Composant | Rôle | Données | Clair | Exemple |
|---|---|---|---|---|
| `PreprocessingFlow` | 5 étapes cliquables (FITS → λ → normalisation → QC → features) avec extrait de code | texte + code ; « 43,019 / ~250,000 » | ⚠️ | `guides/preprocessing.mdx` |
| `WavelengthReconstruction` | Règle spectrale interactive (3 921 pixels, bras bleu/rouge, raies clés) + fallbacks WCS | constantes instrument | ⚠️ | `guides/preprocessing.mdx` |
| `NormalizationDemo` | Spectres synthétiques A/K avant/après normalisation médiane | **spectres générés** (illustratifs) | ⚠️ | `guides/preprocessing.mdx` |

## 4. Accueil du site et page Écosystème (CSS modules, contenu dans `content.js`)

| Composant | Rôle | Données | Clair | Exemple |
|---|---|---|---|---|
| `home/ResearchHomeHero` | Hero de l'accueil (titre, programmes, boutons) | `home/content.js` → `heroPrograms` | ✅ | `index.mdx` |
| `home/ResearchProjectGrid` | Cartes des 3 projets (docs + dépôt) | `projectCards` | ✅ | `index.mdx` |
| `home/ResearchLayerMap` | Modèle à trois couches (site perso / docs / GitHub) | `layerCards` | ✅ | `index.mdx` |
| `home/ResearchReadingPaths` | Parcours de lecture | `readingPaths` | ✅ | `index.mdx` |
| `home/ResearchHighlights` | Cartes de mise en avant par projet | `highlightCards` | ✅ | `index.mdx` |
| `home/ResearchBrowseGrid` | Grille « Browse » (écosystème, parcours, données, atlas) | `browseCards` | ✅ | `index.mdx` |
| `ecosystem/EcosystemHero` | Hero de la page Écosystème | codé | ✅ | `ecosystem.mdx` |
| `ecosystem/ProjectConnectionMap` | Flux dataset → projet | `ecosystem/content.js` → `projectFlows` | ✅ | `ecosystem.mdx` |
| `ecosystem/CrossProjectThemes` | Thèmes transverses | `themes` | ✅ | `ecosystem.mdx` |
| `ecosystem/ScientificQuestionGrid` | Questions scientifiques par projet | `scientificQuestions` | ✅ | `ecosystem.mdx` |
| `ecosystem/EcosystemPrinciples` | Principes de l'écosystème | `ecosystemPrinciples` | ✅ | `ecosystem.mdx` |
| `ecosystem/EcosystemCTA` | Appels à l'action de fin de page | `ctas` | ✅ | `ecosystem.mdx` |

Modifier le texte de ces blocs = modifier `content.js`, pas le JSX.

## 5. Code mort (aucune page ne l'importe)

| Composant | Ce que c'est | Recommandation |
|---|---|---|
| `AstroSpectroIndex/index.jsx` (+ CSS) | 3 exports nommés `AstroSpectroStats` (4 cartes v6 **conformes** : 89.2 %, 0.986, 350k, 99/207), `AstroSpectroSections`, `AstroSpectroRun` | Candidat naturel au bloc *Key results* de `overview/key-results` ; sinon supprimer |
| `HomepageHub.tsx` | Cartes du hub de l'ancien site (liens `/AstroSpectro/docs/...`) | Supprimer |
| `HomepageFeatures/index.tsx` (+ CSS) | Gabarit Docusaurus par défaut (« Easy to Use »…) | Supprimer |

## 6. Problèmes transverses à connaître

1. **Mode clair** : 43 composants utilisent `rgba(255,255,255,…)` pour bordures/grilles ; `ArtifactsTree` et `ExcludedVariables` ont un fond sombre codé, `FamilyContributions` écrit en noir sur les barres, et plusieurs info-bulles SVG ont un fond `#0d1117`. Toujours contrôler les captures en clair.
2. **Liens non vérifiés** : `RelatedPages`, `CrossReferences`, `ResultsLocator`, `ResearchSections`, `WhatAstroSpectroDoes`, `RunProvenance`, `DescriptorFamilies` rendent des `<a href>` que `docusaurus build` ne contrôle pas → `docs-verify/scripts/check-links.mjs`.
3. **Chiffres codés** : la majorité des composants de §3 embarquent leurs chiffres. Ne pas les citer sans les retrouver dans `_facts/` (FACTS_INDEX §6 liste les écarts connus).
4. **Hooks dans des boucles** : `AEKeyMetrics` appelle `useState` dans un `.map` (fonctionne tant que la liste est fixe, mais viole les règles des hooks).
