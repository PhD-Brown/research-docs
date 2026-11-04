# CLAUDE.md — research-docs

Site Docusaurus 3 multi-projets (AstroSpectro · AstroVision · ξ Dark Energy) publié sur
<https://phd-brown.github.io/research-docs/>. Ce fichier donne le contexte minimal pour travailler dans ce dépôt.

## Règles non négociables

1. **Tout chiffre publié provient de `_facts/`.** `FACTS_INDEX.md` (AstroSpectro) et `_facts/astrovision/FACTS_INDEX.md`, `_facts/xi/FACTS_INDEX.md` disent quel fichier et quelle clé ; `check_facts.py` (skill `docs-verify`, AstroSpectro) contrôle une page. Pas de chiffre de mémoire, ni recopié d'une page ou d'un composant existant sans l'avoir retrouvé dans `_facts/`. Dans les pages, un chiffre de résultat s'écrit avec `<RunFact />` (AstroSpectro), `<Fact k="…" />` d'`astrovision/` ou de `xi/` (couches de données ci-dessous), jamais en dur.
2. **Deux générations de données AstroSpectro** : G1 = 43 019 spectres (PHY-3500, pages dimred) ; G2 = 349 998 spectres (XGBoost v6 `20260522T161236Z`, modèle de référence). Ne jamais les mélanger dans une phrase ou un bloc.
3. **Périmètre** : ne modifier que ce que la tâche demande. Pages existantes et composants ne sont pas retouchés « au passage » : signaler l'écart dans le compte rendu.
4. **Langue** : pages du site en anglais (`website/docs/editorial-guide.mdx` §4.2) ; documents internes (racine, `.claude/`, `_facts/`) en français.
5. **Dépôts de code en lecture seule** pour la doc : `PhD-Brown/AstroSpectro`, `PhD-Brown/AstroVision`, `PhD-Brown/xi-dark-energy-bao-mcmc`.
6. Pas de commit sur `main` (hook pre-commit `no-commit-to-branch`) : travailler sur une branche, ouvrir une PR.

## Décisions éditoriales (2026-11-03)

| # | Décision | Conséquence pratique |
|---|---|---|
| 1 | **Run de référence = XGBoost v6** `20260522T161236Z` (`ST_350k_xgb_AFGKM_v6`, run complet, G2). | Toute page qui cite v6 mentionne la **fuite Gaia** : `M_G`, `M_BP`, `M_RP` et `ag_gspphot` figurent parmi ses 99 features sélectionnées. Formulation de référence (EN) dans `FACTS_INDEX.md` §1.1. |
| 1b | **v7** `20260525T191109Z` (`VALIDATION_spectro_only_v7`) = run de validation **partiel** (cross-match Gaia incomplet, SHAP partiel). | Documenté (`FACTS_INDEX.md` §1.2), cité au besoin dans l'audit de fuite ou les limitations ; **jamais mis en avant** (ni *Key results*, ni hero, ni résumé). |
| 2 | Les pages de réduction de dimension restent sur G1. | Étiquette obligatoire **« PHY-3500 · G1 · 43,019 spectra »** (version anglaise de « PHY-3500 · G1 · 43 019 spectres ») sur chaque page dimred et dans le contexte de chaque résultat dimred. |
| 3 | Courriel de contact : **`albak1@ulaval.ca`**. | Remplace `alex.baker.1@ulaval.ca` de l'ancien site lors des migrations. |
| 4 | **La doc doit se mettre à jour en quelques minutes à chaque nouveau run.** | Un run de référence n'est nommé qu'au registre en tête de `FACTS_INDEX.md` ; chaque page déclare ses sources (`{/* facts: … */}`) ; les nouveaux composants reçoivent leurs chiffres par props. Procédure : `FACTS_INDEX.md` §7. |

## Carte du dépôt

| Chemin | Rôle |
|---|---|
| `website/` | Projet Docusaurus (toutes les commandes npm se lancent ici) |
| `website/docs/` | Instance principale : accueil, `astrospectro/`, `atlas/`, `editorial-guide.mdx` |
| `website/docs-astrovision/`, `website/docs-xi/` | Instances `astrovision` (route `/astrovision`) et `xi-dark-energy` (route `/xi-dark-energy`) |
| `website/docs/_archive/` | Copie FR de l'ancien site AstroSpectro — exclue du build (préfixe `_`), source pour la migration |
| `website/src/components/` | Composants MDX : racine (AstroSpectro et transverses), `astrovision/` (`Fact`, `FactTable`, `FactBars`, `FactCards`, `ClassTable`…), `xi/` (`Fact`, `KeyMetrics`, `ParameterTable`, `PriorTable`…) → catalogue : `.claude/skills/docs-component/catalog.md` |
| `website/src/data/astrospectro/` | `runs.json` (**généré**, ne pas éditer) + `index.js` (accès : `getReferenceRun`, `fmt`…) — source des chiffres de run des composants |
| `website/src/data/astrovision/`, `website/src/data/xi/` | `facts.json` (**généré**, ne pas éditer) + `index.js` — source des composants `<Fact k="…" />` des instances AstroVision et ξ |
| `scripts/build_runs_data.py` | `_facts/astrospectro/` + registre de `FACTS_INDEX.md` → `runs.json` (`--check`, `--summary`) |
| `scripts/build_astrovision_data.py`, `scripts/build_xi_data.py` | `_facts/astrovision/` (+ registre §3 de son `FACTS_INDEX.md`), `_facts/xi/` (+ registre) → `facts.json` (`--check`, `--summary`) |
| `scripts/export_doc_facts.py` | Export des faits depuis un dépôt de code : `--project {astrospectro,astrovision,xi} --source <dépôt>` (`--dry-run`) → `_facts/<projet>/` + `MANIFEST.md` |
| `website/src/css/custom.css` | Thème (Inter / JetBrains Mono, variables clair/sombre) |
| `website/static/img/` | Images publiées (`img/dimred/` = figures G1) |
| `website/sidebars*.ts` | Une sidebar par instance ; une nouvelle page doit y être ajoutée |
| `_facts/astrospectro/` | Pack de faits exporté d'AstroSpectro (runs, rapports, SHAP, validation) + `MANIFEST.md` |
| `_facts/astrovision/`, `_facts/xi/` | Packs de faits d'AstroVision et de ξ Dark Energy, chacun avec son `FACTS_INDEX.md` (registre des valeurs de complément) et `MANIFEST.md` |
| `_internal/page-style-guide.v1.mdx` | Ancien guide de style (périmé, conservé pour l'historique) |

## Documents de pilotage (racine)

| Fichier | Contenu |
|---|---|
| `FACTS_INDEX.md` | AstroSpectro : runs de référence et fichier/clé exacts pour chaque chiffre clé ; chiffres du site sans source. AstroVision et ξ : `_facts/astrovision/FACTS_INDEX.md`, `_facts/xi/FACTS_INDEX.md` |
| `STUBS.md` | État final : plus aucune page `UnderConstruction` ; rappel de la syntaxe de l'admonition pour une page partielle |
| `MIGRATION_MAP.md` | Migration de l'ancien site AstroSpectro **terminée** (ancien site fermé, redirections en place) ; conservé comme table de correspondance ancienne route → page actuelle |
| `website/docs/atlas/page-style-guide.mdx` | Gabarits par type de page + couche visuelle (composants, admonitions, galeries, thème) |
| `website/docs/editorial-guide.mdx` | Règles d'écriture, pages canoniques, contexte des métriques |

## Skills (`.claude/skills/`)

| Skill | Quand |
|---|---|
| `docs-page` | Écrire / réécrire / migrer une page (dont remplacer un stub) |
| `docs-component` | Choisir ou créer un composant ; catalogue complet dans `catalog.md` |
| `docs-verify` | Avant tout commit : build, liens (`check-links.mjs`), captures Playwright (`screenshots.cjs`), chiffres (`check_facts.py`) |
| `docs-new-run` | Nouveau run AstroSpectro : export `_facts` → registre → `build_runs_data.py` → docs-verify |

## Commandes

```bash
cd website && npm ci            # installation (Node ≥ 18 ; la CI utilise Node 22)
cd website && npm run start     # dev → http://localhost:3000/research-docs/
cd website && npm run build     # build de production (la CI de déploiement fait npm ci + npm run build)
cd website && npm run serve     # sert website/build
python3 scripts/build_runs_data.py --summary    # régénère website/src/data/astrospectro/runs.json
python3 scripts/build_astrovision_data.py --summary   # régénère website/src/data/astrovision/facts.json (idem build_xi_data.py → xi/facts.json ; --check = contrôle sans écrire)
python3 scripts/export_doc_facts.py --project astrospectro --source ../AstroSpectro --dry-run   # export de faits (--project astrovision|xi)
node .claude/skills/docs-verify/scripts/check-links.mjs website/build
node .claude/skills/docs-verify/scripts/screenshots.cjs --from-git=main
python3 .claude/skills/docs-verify/scripts/check_facts.py --from-git=main --all
```

## État connu de `main` (après la PR « fondations », 2026-11-04)

`npm run build` passe (`[SUCCESS]`) avec deux avertissements préexistants seulement — à ne pas confondre avec une régression :

- Browserslist : `caniuse-lite` vieux de 7 mois.
- `Critical dependency` dans `vscode-languageserver-types` (dépendance de Mermaid).

Aucune erreur du minifieur HTML, aucun lien cassé (Docusaurus et `check-links.mjs` : 0). Défauts connus restants
(captures) : débordements mobiles de quelques grilles de composants et erreur React #418 sur `docs/astrospectro/dimred`
(détail : `.claude/skills/docs-verify/SKILL.md` §0).

## Pièges

- Admonitions : le titre se met entre crochets, `:::info[Titre]`, avec une ligne vide après l'ouverture et avant la fermeture. `:::info Titre` s'affiche en texte brut.
- `onBrokenLinks: "warn"` : un lien cassé ne fait pas échouer le build — lire le journal ou lancer `check-links.mjs`.
- Blog : `routeBasePath: "Blog"` → liens vers `/Blog` (sensible à la casse ; `/blog` et `/journal` n'existent pas).
- `trailingSlash: false` : dans les props de composants, un chemin relatif se résout depuis l'URL rendue ; sur une page `index.mdx` de catégorie, `./x` vise le dossier **parent**. `RelatedPages`/`CrossReferences` utilisent `<Link>` : y écrire des routes absolues `/docs/…`.
- `baseUrl` = `/research-docs/` : les chemins d'images passés à `FigureGallery` s'écrivent sans (`/img/dimred/x.png`).
- Mode clair : beaucoup de composants utilisent des bordures `rgba(255,255,255,…)` ; toujours contrôler les captures en clair.
- Mobile : sous 997 px les tableaux Markdown défilent dans leur bloc (`custom.css`) ; les grilles de composants à colonnes fixes peuvent encore déborder.
- Chiffres de run : jamais codés dans une page ou un composant — composant qui lit `runs.json`, ou `<RunFact …/>` dans la prose.
- Les classes `stats-row` / `summary-cards` du guide v1 n'ont aucun CSS.
