# CLAUDE.md — research-docs

Site Docusaurus 3 multi-projets (AstroSpectro · AstroVision · ξ Dark Energy) publié sur
<https://phd-brown.github.io/research-docs/>. Ce fichier donne le contexte minimal pour travailler dans ce dépôt.

## Règles non négociables

1. **Tout chiffre publié provient de `_facts/`.** `FACTS_INDEX.md` dit quel fichier et quelle clé ; `check_facts.py` (skill `docs-verify`) contrôle une page. Pas de chiffre de mémoire, ni recopié d'une page ou d'un composant existant sans l'avoir retrouvé dans `_facts/`.
2. **Deux générations de données AstroSpectro** : G1 = 43 019 spectres (PHY-3500, pages dimred) ; G2 = 349 998 spectres (XGBoost v6 `20260522T161236Z`, modèle de référence). Ne jamais les mélanger dans une phrase ou un bloc.
3. **Périmètre** : ne modifier que ce que la tâche demande. Pages existantes et composants ne sont pas retouchés « au passage » : signaler l'écart dans le compte rendu.
4. **Langue** : pages du site en anglais (`website/docs/editorial-guide.mdx` §4.2) ; documents internes (racine, `.claude/`, `_facts/`) en français.
5. **Dépôts de code en lecture seule** pour la doc : `PhD-Brown/AstroSpectro`, `PhD-Brown/AstroVision`, `PhD-Brown/xi-dark-energy-bao-mcmc`.
6. Pas de commit sur `main` (hook pre-commit `no-commit-to-branch`) : travailler sur une branche, ouvrir une PR.

## Carte du dépôt

| Chemin | Rôle |
|---|---|
| `website/` | Projet Docusaurus (toutes les commandes npm se lancent ici) |
| `website/docs/` | Instance principale : accueil, `astrospectro/`, `atlas/`, `editorial-guide.mdx` |
| `website/docs-astrovision/`, `website/docs-xi/` | Instances `astrovision` (route `/astrovision`) et `xi-dark-energy` (route `/xi-dark-energy`) |
| `website/docs/_archive/` | Copie FR de l'ancien site AstroSpectro — exclue du build (préfixe `_`), source pour la migration |
| `website/docs/api/` | Doublon FR des pages API de l'ancien site, publié mais hors sidebar (à fusionner, cf. `MIGRATION_MAP.md`) |
| `website/src/components/` | 72 composants MDX → catalogue : `.claude/skills/docs-component/catalog.md` |
| `website/src/css/custom.css` | Thème (Inter / JetBrains Mono, variables clair/sombre) |
| `website/static/img/` | Images publiées (`img/dimred/` = figures G1) |
| `website/sidebars*.ts` | Une sidebar par instance ; une nouvelle page doit y être ajoutée |
| `_facts/astrospectro/` | Pack de faits exporté d'AstroSpectro (runs, rapports, SHAP, validation) + `MANIFEST.md` |
| `_internal/page-style-guide.v1.mdx` | Ancien guide de style (périmé, conservé pour l'historique) |

## Documents de pilotage (racine)

| Fichier | Contenu |
|---|---|
| `FACTS_INDEX.md` | Runs de référence et fichier/clé exacts pour chaque chiffre clé ; chiffres du site sans source |
| `STUBS.md` | Les 98 pages `UnderConstruction`, priorisées, avec leurs sources et pièges |
| `MIGRATION_MAP.md` | Correspondance ancien site AstroSpectro → research-docs, statut, contenu à récupérer |
| `website/docs/atlas/page-style-guide.mdx` | Gabarits par type de page + couche visuelle (composants, admonitions, galeries, thème) |
| `website/docs/editorial-guide.mdx` | Règles d'écriture, pages canoniques, contexte des métriques |

## Skills (`.claude/skills/`)

| Skill | Quand |
|---|---|
| `docs-page` | Écrire / réécrire / migrer une page (dont remplacer un stub) |
| `docs-component` | Choisir ou créer un composant ; catalogue complet dans `catalog.md` |
| `docs-verify` | Avant tout commit : build, liens (`check-links.mjs`), captures Playwright (`screenshots.cjs`), chiffres (`check_facts.py`) |

## Commandes

```bash
cd website && npm ci            # installation (Node ≥ 18 ; la CI utilise Node 22)
cd website && npm run start     # dev → http://localhost:3000/research-docs/
cd website && npm run build     # build de production (la CI de déploiement fait npm ci + npm run build)
cd website && npm run serve     # sert website/build
node .claude/skills/docs-verify/scripts/check-links.mjs website/build
node .claude/skills/docs-verify/scripts/screenshots.cjs --from-git=main
python3 .claude/skills/docs-verify/scripts/check_facts.py --from-git=main --all
```

## État connu de `main` (2026-11-03)

`npm run build` passe (`[SUCCESS]`) avec des avertissements préexistants — à ne pas confondre avec une régression :

- Browserslist : `caniuse-lite` vieux de 7 mois.
- `Critical dependency` dans `vscode-languageserver-types` (dépendance de Mermaid).
- Minifieur HTML (SSG) sur 6 pages : `/docs/api/classifier`, `/docs/astrospectro/concepts`, `/docs/astrospectro/guides/{downloading-data, feature-extraction, quick-start, visualization}`.
- Liens cassés sur **toutes** les pages : `/research-docs/blog` (navbar `to: "/blog"` vs `routeBasePath: "Blog"`) et `/research-docs/journal` (footer) ; plus 12 liens propres à 7 pages (détail dans `.claude/skills/docs-verify/SKILL.md`).
- `check-links.mjs` trouve 59 liens internes cassés uniques, la plupart dans des `<a href>` de composants que Docusaurus ne contrôle pas.

## Pièges

- `onBrokenLinks: "warn"` : un lien cassé ne fait pas échouer le build — lire le journal ou lancer `check-links.mjs`.
- `trailingSlash: false` : dans les props de composants (`<a href>` bruts), un chemin relatif se résout depuis l'URL rendue ; sur une page `index.mdx` de catégorie, `./x` vise le dossier **parent**.
- `baseUrl` = `/research-docs/` : les chemins d'images passés à `FigureGallery` s'écrivent sans (`/img/dimred/x.png`).
- Mode clair : beaucoup de composants utilisent des bordures `rgba(255,255,255,…)` ; toujours contrôler les captures en clair.
- Mobile : `custom.css` force `.markdown table { display: table }` → les tableaux larges font déborder la page.
- Les classes `stats-row` / `summary-cards` du guide v1 n'ont aucun CSS.
