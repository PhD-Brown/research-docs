# Catalogue des composants — `website/src/components/`

Inventaire exhaustif (85 fichiers JSX/TSX : 74 relus le 2026-11-03 + `GaiaLeakNote` et `RunFact` (2026-11-04) + 11 composants `astrovision/` et `xi/`, §7). Pour chaque composant : rôle, props,
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
| `CrossReferences` | Tableau « Related page / Relation » de fin de page | `links=[{href, label, relation, featured?}]` (défaut `[]` → rien) | ✅ | `astrospectro/index.mdx` | `<Link>` Docusaurus : préférer les routes absolues `/docs/…` (baseUrl ajoutée, vérifiées au build). Ligne `featured` lisible en clair et en sombre (variable CSS `--cross-ref-featured-bg`, corrigé 2026-11-04) |
| `RunProvenance` | Carte « Current run » (expérience, date UTC, MD5, stack, notes, lien) + mention de fuite Gaia | `run?` (clé de registre ou ID ; défaut `classifier`), `experiment, savedAt, md5, notes, stack` (surchargent `runs.json`), `keyResultsHref='./overview/key-results'` | ✅ | `astrospectro/index.mdx` | Sans props : run de référence lu dans `runs.json` |
| `RelatedPages` | Grille de cartes « Related pages » colorées par catégorie | `pages=[{href, title, desc, category, badge?}]`, `title='Related pages'` ; catégories `science·guides·concepts·api·community·journal·external` | ⚠️ | 11 pages, ex. `astrospectro/dimred/autoencoder.mdx` | `<Link>` Docusaurus : écrire des routes absolues `/docs/astrospectro/…` (les anciennes routes ont été corrigées le 2026-11-04) |
| `FigureGallery` | Galerie d'images + lightbox (clavier ←/→/Échap) | `figures=[{src, title, desc?, tag?}]`, `columns=3` | ⚠️ | `astrospectro/dimred/autoencoder.mdx` ; aussi toutes les pages AstroVision et ξ | `src` sans baseUrl (ajoutée via `useBaseUrlUtils`) ; déclarer `export const xFigures = […]` dans la page. Depuis 2026-11-04 les images déjà chargées avant l'hydratation sont marquées chargées au montage (elles restaient à `opacity: 0`) : plus besoin de l'ancien contournement `astrovision/Gallery` (supprimé) |
| `SpectralLineRows` | Tableau générique de raies avec barre de position λ (3690–9100 Å) | `color='#60A5FA'`, `columns=[…]`, `rows=[{label, lambda?, tag?, desc, highlight?}]`, `footer?` | ⚠️ | `astrospectro/data/feature-dataset.mdx` (familles 1–3) | Seul composant « données » entièrement paramétré |
| `UnderConstruction` | Boîte animée « Under Construction » | — | ✅ (CSS module) | 98 stubs (STUBS.md) | À remplacer par `:::info Under construction` (editorial-guide §6.3) |
| `GaiaLeakNote` | Mention courte de fuite Gaia (FACTS_INDEX §1.1) avec lien vers le Data Leakage Audit ; ne rend rien si le run n'a pas le drapeau `gaia_leak` | `run?` (clé de registre, ID ou objet ; défaut `classifier`), `style?` | ✅ | `atlas/page-style-guide.mdx` §4.10 | Rendue automatiquement par les composants qui citent un run ; à poser à la main sous un tableau Markdown qui cite v6 |
| `RunFact` | Chiffre de run en ligne dans la prose (`runs.json`) | `run='classifier'`, `path` (ex. `metrics.balanced_accuracy`), `format` (`pct·num·signed·int·sci·seconds·raw`), `digits?` | ✅ | `atlas/page-style-guide.mdx` §5.2 | Chemin introuvable → erreur de build. Remplace tout chiffre de run tapé dans une page. Les listes s'affichent séparées par « , » (`A, F, G, K, M`) |

## 2. Page d'accueil AstroSpectro (`astrospectro/index.mdx`) — statiques, thème-compatibles

| Composant | Rôle | Props | Données | Clair | Exemple |
|---|---|---|---|---|---|
| `ProjectHero` | Cadre « Scientific question » + 3 piliers (Physics-informed, Interpretable by design, Leakage-aware) | — | codées (texte) | ✅ | `astrospectro/index.mdx` |
| `ProjectPhilosophy` | Grille des 5 principes du projet | — | codées (texte) | ✅ | `astrospectro/index.mdx` |
| `WhatAstroSpectroDoes` | Stepper vertical des 6 étapes du pipeline, chaque étape liée à sa page | — | codées (texte + hrefs `./astrospectro/...`) | ✅ | `astrospectro/index.mdx` |
| `ResearchSections` | Table de navigation des sections (✓ statut) | — | codées (hrefs) | ✅ | `astrospectro/index.mdx` |
| `ResultsLocator` | Encadré « Latest highlighted analysis » + table « If you are looking for… → Go to » | — | codées (texte + hrefs) | ✅ | `astrospectro/index.mdx` |
| `ProgressionPipeline` | Frise des étapes 32 % → 75–84 % → 87 % (RF → XGBoost → spectro_only) | runs.json : v3 → v5 → `classifier` (BA de chaque run) | codées | ⚠️ | ✅ |

> `ProgressionPipeline` : depuis le 2026-11-04, étapes = runs enregistrés (v3, v5, référence) lus dans runs.json.

## 3. Composants « résultats » AstroSpectro — données de run

> Depuis le 2026-11-04, les composants ci-dessous marqués **runs.json** lisent leurs chiffres dans
> `website/src/data/astrospectro/runs.json` (module `@site/src/data/astrospectro`, généré par
> `scripts/build_runs_data.py`) ; la clé du registre utilisée est indiquée. Les chiffres sans source (FACTS_INDEX §6)
> ont été retirés ou remplacés. Liste à jour : `grep -l "src/data/astrospectro" website/src/components/*.jsx`.

### 3.1 Classification / SHAP

| Composant | Rôle | Données codées | Clair | Exemple | Statut des chiffres |
|---|---|---|---|---|---|
| `ClassifierMetrics` | 3 cartes (BA, confiance médiane, ROC-AUC) | runs.json `classifier` : BA, F1 macro, ROC-AUC macro + mention de fuite | ⚠️ | `science/classification-performance.mdx` (+ results-analysis, model-training) | ✅ v6 (prop `run`) |
| `ResultsHero` | 5 cartes de synthèse (PCA ρ, HDBSCAN, Procrustes, ROC-AUC, part SHAP) | runs.json `pca`, `umap_tsne`, `autoencoder`, `classifier`, `shap` — deux groupes G1 / G2 | ✅ | `science/results-analysis.mdx` | ✅ |
| `SHAPTop10` | Barres du top-10 SHAP par famille | runs.json `shap` : top-10 mean \|SHAP\|, familles du CSV + fuite | ⚠️ | `science/classification-performance.mdx`, `science/results-analysis.mdx` | ✅ v6 (prop `run`) |
| `PCAvsXGBoost` | Deux colonnes « PCA (variance) vs XGBoost (discrimination) » | runs.json `pca` + SHAP de même génération (`shapRunFor`) : v5 / G1 | ⚠️ | idem | ✅ |
| `SpectralClasses` | Cartes des classes A–M (Teff, performance qualitative, fraction) + barre Harvard | Teff Harvard (manuel) ; F1 et part du test set : runs.json `classifier` | ⚠️ | `science/classification-performance.mdx` | ✅ Cartes `flex: 1 1 170px` (passent à la ligne en mobile) |
| `TrainingConfig` | Carte de configuration d'entraînement + hyperparamètres | runs.json `classifier` : N, features, classes, split, hyperparamètres | ⚠️ | `science/classification-performance.mdx` | ✅ (prop `run`) |
| `UMAPPredictions` | Onglets d'images UMAP colorées par prédiction XGBoost + annotations de régions | images G1 ; confiance médiane et modèle projeté (v5) : runs.json `umap_tsne` | ⚠️ | `science/classification-performance.mdx` | ✅ (image déjà chargée avant l'hydratation → marquée chargée au montage, 2026-11-04) |
| `ModelSelector` | Grille des 11 modèles disponibles dans `SpectralClassifier` | badge du champion : BA runs.json `classifier` | ⚠️ | `guides/model-training.mdx` | ✅ |
| `TrainingPipelineFlow` | Onglets « Integrated pipeline » / « W&B tracking (121 metrics) » | « 121 metrics » / « 85+ runs » retirés | ⚠️ | `guides/model-training.mdx` | ✅ |
| `ArtifactsTree` | Arborescence `data/models`, `data/reports/<ISO>` + champs du `_meta.json` | noms de fichiers, champs | ❌ fond `#06080f` | `guides/model-training.mdx` | Champs à jour (cf. meta v6). Grille `auto-fit` et arbre défilant (`overflow-x: auto`) : plus de débordement mobile ; fond sombre toujours codé |

### 3.2 Réduction de dimension

| Composant | Rôle | Données codées | Clair | Exemple | Statut des chiffres |
|---|---|---|---|---|---|
| `AEKeyMetrics` | 4 cartes clés de l'autoencodeur | runs.json `autoencoder` ; « 107× » remplacé par le rapport des médianes (4.2×) | ⚠️ | `dimred/autoencoder.mdx` | ✅ (hooks corrigés) |
| `AEArchitecture` | Schéma interactif encodeur/décodeur 183→256→128→64→2 | dims, Dropout 0.1, Adam 1e-3, batch 512, patience 15, ~330k params | ⚠️ | `dimred/autoencoder.mdx` | À recouper avec `AS/src/dimred/autoencoder.py` |
| `AEReconBenchmark` | Courbe SVG MSE(k) PCA vs ligne AE(z=2) | runs.json `autoencoder` (`pca_mse_by_k`, `mse`) | ⚠️ | `dimred/autoencoder.mdx` | ✅ |
| `AELatentCorrelations` | ρ Spearman des axes AE vs PCA avec Gaia (Teff, log g, [Fe/H], BP−RP) | runs.json `autoencoder` ; interprétations propres au run G1 | ⚠️ | `dimred/autoencoder.mdx` | ✅ |
| `PCAxisCards` | 2 cartes d'axe (PC1 thermique, PC2 métallicité) avec contributions par famille | runs.json `pca` ; familles = part du top-10 \|loadings\| ; ρ(PC2,[M/H]) corrigé (affichait la valeur de PC1) | ⚠️ | `dimred/pca.mdx` | ✅ Cartes `flex: 1 1 300px` + `minWidth: 0` (débordement mobile corrigé) |
| `VarianceChart` | Histogramme variance PC1–PC20 + seuils 80/90/95/99 % + table MSE | runs.json `pca` : PC1–PC10 (seules exportées), seuils, MSE(k ≤ 50) | ✅ | `dimred/pca.mdx` | ✅ Histogramme corrigé (colonnes `height: 100%`, barres visibles), bordures/pistes via `--ifm-color-emphasis-*`, grilles `auto-fit` |
| `PCAVarianceMilestones` | Jalons k = 2/10/51/91/100 avec variance et MSE | runs.json `pca` ; MSE « n/a » au-delà de k = 50 | ✅ | `science/results-analysis.mdx` | ✅ Texte, fonds et bordures via variables Infima (plus de `#fff`) |
| `EigenspectraContrast` | PCA flux brut vs PCA features (3 PC chacun) | runs.json `pca` (flux brut : k95 = 5, corrigé) | ⚠️ | `dimred/pca.mdx` | ✅ Panneaux `flex: 1 1 300px` (débordement mobile corrigé) |
| `FamilyContributions` | Barres doubles PC1/PC2 par famille spectroscopique | runs.json `pca` : part de chaque famille dans le top-10 \|loadings\| (anciens % sans source retirés) | ⚠️ (texte noir sur barres) | `dimred/pca.mdx` | ✅ |
| `LoadingsBars` | Top-5 loadings PC1 et PC2 | runs.json `pca` : top-5 loadings PC1/PC2 | ⚠️ | `dimred/pca.mdx`, `data/feature-dataset.mdx` | ✅ |
| `GaiaCorrelations` | Heatmap ρ(PC1/PC2, paramètres Gaia/SNR/A_G) | runs.json `pca` : ρ Spearman PC1/PC2 | ⚠️ | `dimred/pca.mdx`, `data/feature-dataset.mdx` | ✅ Tableau défilant dans son bloc en mobile |
| `MethodComparison` | Tableau comparatif PCA / UMAP / t-SNE (MSE, ρ, Procrustes, CPU, paramétrique…) | runs.json `pca`, `autoencoder`, `umap_tsne` ; ρ t-SNE, temps PCA et matériel retirés | ⚠️ | `dimred/index.mdx` | ✅ Tableau à 4 colonnes défilant dans son bloc sous 600 px |
| `ProcrustesStability` | Barres de distance de Procrustes par seed (UMAP vs t-SNE) | runs.json `umap_tsne` | ⚠️ | `dimred/index.mdx` | ✅ |
| `HDBSCANClusters` | Barres des clusters HDBSCAN + groupes HR | runs.json `umap_tsne` ; plages Teff/log g sans source retirées | ⚠️ | `dimred/index.mdx` | ✅ |
| `HyperparamSensitivity` | Onglets UMAP `n_neighbors` / t-SNE `perplexity` (5–100) avec verdict | qualitatif | ⚠️ | `dimred/index.mdx` | Qualitatif (figures de sensibilité) |
| `DimRedPipeline` | Diagramme de flux X → scaler → PCA(91) → UMAP / t-SNE | runs.json `pca`, `umap_tsne` | ⚠️ | `dimred/index.mdx` | ✅ |
| `UMAP3DViewer` | Onglets d'iframes Plotly 3D (classes, Teff, [Fe/H]) | fichiers HTML G1 ; N : runs.json `umap_tsne` | ⚠️ | `dimred/index.mdx` | ✅ Animation de chargement dans `UMAP3DViewer.module.css` : l'ancien `<style>` en ligne causait l'erreur React #418 (hydratation) |
| `DatasetStats` | 5 cartes du jeu dimred (N, p, λ, R, rayon Gaia) | runs.json `pca` (N, p) ; carte « Gaia 1″ » retirée | ⚠️ | `dimred/data-loader.mdx` | ✅ |
| `ClassDistribution` | Barre STAR/GALAXY/QSO + cartes | runs.json `pca` (class_counts) + `autoencoder` (rapport des médianes QSO/STAR) | ✅ | `dimred/data-loader.mdx` | ✅ |
| `QualityPipeline` | Étapes de filtrage (SNR_r > 10, RUWE < 1.4) | N : runs.json `pca` ; « ~250k » retiré | ⚠️ | `dimred/data-loader.mdx` | ⚠️ code : `>=` et masquage RUWE (STUBS #16) |
| `DescriptorFamilies` | Cartes des 6 familles de descripteurs + barre de répartition | effectifs ~ (constants) ; ligne « → PCA » : runs.json `pca` | ⚠️ | `dimred/data-loader.mdx`, `pipeline/feature-engineering-theory.mdx` | Lien « complete catalogue » corrigé (`<Link>` vers `data/feature-dataset`) |

### 3.3 Données et features

| Composant | Rôle | Données codées | Clair | Exemple |
|---|---|---|---|---|
| `LAMOSTSpecs` | Fiche technique LAMOST + jeu AstroSpectro | specs instrument ; N, p : runs.json `pca` ; « ~250,000 FITS » et « 1″ · ~100 % » retirés | ⚠️ | `data/lamost-dr5.mdx` |
| `FITSFieldsTable` | Table filtrable des champs d'en-tête FITS (catégories, exclus par spectro_only) | 19 champs | ⚠️ | `data/lamost-dr5.mdx` |
| `FamilyOverview` | Mosaïque 183 cellules par famille + légende | effectifs du catalogue (constants) ; badges PC1/PC2 : part du top-10 \|loadings\|, runs.json `pca` | ⚠️ | `data/feature-dataset.mdx` |
| `SpectralCoverage` | Spectre 3690–9100 Å avec positions des raies par famille | longueurs d'onde | ⚠️ | `data/feature-dataset.mdx` |
| `ExcludedVariables` | 3 cartes des variables exclues (ra, dec, redshift) | texte | ❌ fond de repli `#0a0c14` | `data/feature-dataset.mdx` |
| `MetalsTable` | Cartes par élément (Fe, Cr, Ni, Na, Ba, Sr, Si, Ti, Al, Co, V) avec raies | λ, force | ⚠️ | `data/feature-dataset.mdx` | Grille `auto-fill` ; cartes « large » sur 2 colonnes seulement au-dessus de 640 px (`MetalsTable.module.css`) |
| `LickIndexTable` | Indices Lick/SDSS/standard avec domaine λ | bandes | ⚠️ | `data/feature-dataset.mdx` |
| `MolecularBands` | Bandes TiO/VO/CN/CH/CaH/MgH sur l'axe λ | centres, demi-largeurs | ⚠️ | `data/feature-dataset.mdx` |
| `ContinuumDescriptors` | Pentes, courbures, sauts, couleurs synthétiques | noms de features, plages | ⚠️ | `data/feature-dataset.mdx` |
| `PhysicsVsBlackBox` | Onglets « approche physique vs boîte noire » + progression 32 → 87 % | runs.json `classifier` + historique v3–v5 (FACTS_INDEX §1.3) | ⚠️ | `pipeline/feature-engineering-theory.mdx` |

### 3.4 Prétraitement (guides)

| Composant | Rôle | Données | Clair | Exemple |
|---|---|---|---|---|
| `PreprocessingFlow` | 5 étapes cliquables (FITS → λ → normalisation → QC → features) avec extrait de code | N retenu : runs.json `pca` ; « ~250,000 » retiré | ⚠️ | `guides/preprocessing.mdx` |
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

> La **page d'accueil du site** (`src/pages/index.js`, route `/`) n'utilise pas ces composants : elle lit ses chiffres dans `runs.json` (run de référence, SHAP), `astrovision/facts.json` et `xi/facts.json` (via `getReferenceRun`, `getFact`, `getProtocol`) et affiche la mention de fuite Gaia (`leakNote`). Style : `src/pages/index.module.css` (thème sombre propre à la page).

## 5. Code mort (aucune page ne l'importe)

| Composant | Ce que c'est | Recommandation |
|---|---|---|
| `AstroSpectroIndex/index.jsx` (+ CSS) | 3 exports nommés `AstroSpectroStats` (4 cartes v6 **conformes** : 89.2 %, 0.986, 350k, 99/207), `AstroSpectroSections`, `AstroSpectroRun` | Candidat naturel au bloc *Key results* de `overview/key-results` ; sinon supprimer |
| `HomepageHub.tsx` | Cartes du hub de l'ancien site (liens `/AstroSpectro/docs/...`) | Supprimer |
| `HomepageFeatures/index.tsx` (+ CSS) | Gabarit Docusaurus par défaut (« Easy to Use »…) | Supprimer |

## 6. Problèmes transverses à connaître

1. **Mode clair** : 43 composants utilisent `rgba(255,255,255,…)` pour bordures/grilles ; `ArtifactsTree` et `ExcludedVariables` ont un fond sombre codé, `FamilyContributions` écrit en noir sur les barres, et plusieurs info-bulles SVG ont un fond `#0d1117`. Toujours contrôler les captures en clair.
2. **Liens** : `RelatedPages`, `CrossReferences`, `ResultsLocator`, `ResearchSections`, `DescriptorFamilies` utilisent `<Link>` (routes absolues vérifiées au build) ; `WhatAstroSpectroDoes` et `RunProvenance` (lien « detailed metrics ») rendent encore des `<a href>` relatifs → `docs-verify/scripts/check-links.mjs`.
3. **Chiffres de run** : lus dans `runs.json` (§3) ; ne jamais en recoder dans un composant ou une page (skill `docs-new-run`). Restent codés : constantes instrumentales/physiques et `AstroSpectroIndex` (code mort, §5).
4. **Défauts de rendu corrigés (2026-11-04)** : histogramme de `VarianceChart` (hauteurs en % dans un conteneur flex sans hauteur) ; texte `#fff` de `PCAVarianceMilestones` en mode clair ; erreur React #418 sur `dimred` (élément `<style>` en ligne de `UMAP3DViewer`, voir ci-dessus) ; débordements mobiles de `MethodComparison`, `SpectralClasses`, `PCAxisCards`, `EigenspectraContrast`, `GaiaCorrelations`, `ArtifactsTree`, `MetalsTable` et des images à `max-width` fixe (règle `.theme-doc-markdown img[style*="max-width"]` de `custom.css`). **Restent** : les composants listés au point 1 (`rgba(255,255,255,…)`, fonds sombres codés), non retouchés hors périmètre. Règle à retenir : pas d'élément `<style>{`…`}</style>` dans un composant (le minifieur HTML du build en normalise le texte), et pas de `flex: 1` / `repeat(N, 1fr)` / `span 2` sans repli mobile.

## 7. Composants des instances AstroVision et ξ Dark Energy (11, tous prop-driven, lisent `facts.json`)

Aucun chiffre codé : chaque valeur est lue au build dans `website/src/data/astrovision/facts.json` ou `website/src/data/xi/facts.json`
(générés par `scripts/build_{astrovision,xi}_data.py` depuis `_facts/{astrovision,xi}/` ; clé ou chemin introuvable ⇒ le build échoue).
Styles : variables `--ifm-*` / CSS module (`astrovision/styles.module.css`) ou `xi/styles.js` — aucun fond sombre ni `rgba(255,255,255,…)` codé : ✅ en clair et en sombre.
Skill `docs-new-run` : ces composants se mettent à jour seuls après `build_astrovision_data.py` / `build_xi_data.py`.

### 7.1 AstroVision — `@site/src/components/astrovision/…`

| Composant | Rôle | Props | Données | Clair | Exemple (`website/docs-astrovision/`) |
|---|---|---|---|---|---|
| `Fact` | Chiffre en ligne dans la prose | `k` (clé pointée de `facts.json`), `format` (`pct·pctRaw·num·signed·int·sci·raw`), `digits?` | `astrovision/facts.json` | ✅ | `results/physical-interpretation.md`, `index.md` |
| `FactCards` | Rangée de cartes « Key results » (3 à 6) | `cards=[{k, format?, digits?, label, context?, accent?}]` | idem | ✅ | `overview/index.md`, `models/dinov2-finetuned.md` |
| `FactTable` | Tableau dont les cellules numériques sont lues dans `facts.json` | `columns=[{header, format?, digits?}]`, `rows=[{label, keys[], text?[], highlight?}]`, `labelHeader`, `caption?` | idem | ✅ | `overview/key-results.md`, `models/late-fusion.md` |
| `FactBars` | Barres horizontales (modèles ou une barre par classe) | `items=[{label, k, accent?}]` ou `perClass='…{slug}'`, `format`, `digits?`, `max=1`, `accent`, `title` | idem | ✅ | `overview/key-results.md`, `models/dinov2-finetuned.md` |
| `ClassTable` | Tableau « une ligne par classe Galaxy10 » (modèles de clé avec `{slug}`) | `columns=[{header, path, format?, digits?}]`, `highlight?` (slug), `caption?` | idem | ✅ | `models/morphometry.md`, `results/benchmarking.md` |
| `FactProvenance` | Mention de provenance (notebook · figure · code) ; disparaît quand les valeurs deviennent « calculées » | `prefixes=[…]` (aucun = tout) | `facts.json` → `status` | ✅ | `overview/key-results.md`, `overview/scientific-motivation.md` |

### 7.2 ξ Dark Energy — `@site/src/components/xi/…`

| Composant | Rôle | Props | Données | Clair | Exemple (`website/docs-xi/`) |
|---|---|---|---|---|---|
| `Fact` | Chiffre en ligne dans la prose | `path` (dans le protocole, ou `config.…`), `protocol='protocol1b'`, `format` (`num·signed·int·sigma·raw`), `digits?` | `xi/facts.json` | ✅ | `inference/priors.mdx`, `results/caveats.md` |
| `KeyMetrics` | Cartes de résultats clés d'un protocole | `protocol?` | idem | ✅ | `overview/index.md`, `overview/key-findings.md` |
| `ModelComparisonTable` | χ² / k / AIC / BIC / ΔAIC trié par AIC | `protocol?`, `withAcceptance?` | idem | ✅ | `overview/key-findings.md`, `inference/model-comparison.md` |
| `ParameterTable` | Médiane (+ −) 16–84 % des paramètres | `protocol?`, `model?` (`LCDM·CPL·Xi_osc`, omis = les trois) | idem | ✅ | `results/parameter-constraints.md` |
| `PriorTable` | Bornes des priors top-hat (valeurs **du code** @ `25ed86e`, `config.priors`) | `models?` | idem (`config`) | ✅ | `inference/priors.mdx`, `overview/models.md`, `inference/mcmc-setup.md` |
| `RunContext` | Bandeau de contexte d'un protocole (équivalent léger de `RunProvenance`) | `protocol?` | idem | ✅ | `overview/index.md`, `overview/key-findings.md` |

Module d'accès : `website/src/data/astrovision/index.js` (`getFact`, `requireFact`, `fmt`, `CLASSES`, `statusOf`) et `website/src/data/xi/index.js` (`getProtocol`, `resolve`, `fmt`, `MODELS`).
Les équations des pages ξ s'écrivent en LaTeX (`$…$`, `$$…$$`) : l'instance `xi-dark-energy` a `remark-math` **et** `rehype-katex` (comme les deux autres).
