---
name: docs-verify
description: Vérifie une modification du site research-docs avant commit ou PR — build Docusaurus sans nouvel avertissement, aucun lien interne cassé (y compris les <a href> bruts des composants), captures Playwright clair/sombre × bureau/mobile des pages modifiées, et contre-vérification de chaque chiffre avec _facts/. À utiliser après toute modification de website/docs*, website/src ou sidebars, et avant d'annoncer qu'une page est terminée.
---

# docs-verify

Quatre contrôles, dans cet ordre. Une page n'est « prête » que si les quatre passent (ou si chaque écart est justifié dans le rapport).

Prérequis : Node ≥ 18, dépendances installées (`cd website && npm ci`), Python 3, Playwright + Chromium
(`require('playwright')` ; sinon `npm i -D playwright && npx playwright install chromium`).
Toutes les commandes se lancent depuis la racine du dépôt sauf mention contraire.

## 0. Référence de comparaison (une fois par session)

Les avertissements et liens cassés **préexistants** ne doivent pas bloquer : on compare à `main`.

```bash
git fetch origin main
git worktree add /tmp/rd-main origin/main          # copie propre de main, sans toucher à la branche courante
(cd /tmp/rd-main/website && npm ci && npm run build) > /tmp/build-main.log 2>&1
node .claude/skills/docs-verify/scripts/check-links.mjs /tmp/rd-main/website/build --json > /tmp/links-main.json
git worktree remove --force /tmp/rd-main
```

État connu de `main` au 2026-11-03 (`npm run build` **passe**, `[SUCCESS]`) :

| Avertissement | Détail |
|---|---|
| Browserslist | `caniuse-lite` vieux de 7 mois (informatif) |
| Critical dependency | `vscode-languageserver-types/lib/umd/main.js` (dépendance de Mermaid) |
| SSG — minifieur HTML (6 pages) | `/docs/api/classifier`, `/docs/astrospectro/guides/{downloading-data, feature-extraction, quick-start ×2, visualization}` : `</p>` orphelin ; `/docs/astrospectro/concepts` : titre dans un titre + `</h1>` orphelin |
| Liens cassés globaux (toutes les pages) | `/research-docs/blog` (navbar `to: "/blog"` alors que `routeBasePath: "Blog"`) et `/research-docs/journal` (footer) |
| Liens cassés propres à une page (12) | `atlas/claims-register` ×6 (`../astrovision/…`, `../xi-dark-energy/…`), `astrovision/community/citing` (`../../atlas/claims-register`), `astrospectro/concepts` (`../docs/api`), `astrospectro/dimred` et `science/results-analysis` (`./pca-physical-interpretation`), `dimred/data-loader` (`../user-guides/downloading-data`), `astrospectro/guides` (`/docs/concepts`) |
| `check-links.mjs` | 59 liens cassés uniques (dont les 2 globaux) — la plupart dans des `<a href>` de composants que Docusaurus ne voit pas |

## 1. Build

```bash
cd website && npm run build 2>&1 | tee /tmp/build-branch.log; cd ..
grep -E "\[(WARNING|ERROR|SUCCESS)\]" /tmp/build-branch.log
diff <(grep -E '^- "' /tmp/build-main.log) <(grep -E '^- "' /tmp/build-branch.log)   # SSG : rien de nouveau
grep -A20 "Broken link on source page path = /research-docs/<route modifiée>" /tmp/build-branch.log
```

Critères : `[SUCCESS]` ; aucune nouvelle page dans la liste SSG ; les pages modifiées n'ont que les deux liens globaux connus. `onBrokenLinks: "warn"` : le build ne casse **pas** sur un lien cassé, il faut lire le journal.

## 2. Liens internes (HTML construit)

```bash
node .claude/skills/docs-verify/scripts/check-links.mjs website/build --baseline=/tmp/links-main.json
node .claude/skills/docs-verify/scripts/check-links.mjs website/build --only=<morceau d'URL de la page> --ignore=/research-docs/blog,/research-docs/journal
```

- Vérifie `a[href]`, `img[src]`, `iframe[src]`, `link[href]` de chaque page générée, en résolvant l'URL comme un navigateur.
- Indispensable car `RelatedPages`, `CrossReferences`, `ResultsLocator`, `WhatAstroSpectroDoes`… rendent des `<a href>` bruts, ignorés par Docusaurus.
- Piège fréquent : `trailingSlash: false` ⇒ sur une page d'index de catégorie (`dimred/index.mdx` servie à `/docs/astrospectro/dimred`), `./pca` vise `/docs/astrospectro/pca`.
- Critère : `NOUVEAUX vs baseline : 0` (sortie 0).

## 3. Captures Playwright

```bash
node .claude/skills/docs-verify/scripts/screenshots.cjs --from-git=main            # routes déduites du diff
node .claude/skills/docs-verify/scripts/screenshots.cjs docs/astrospectro/dimred/pca docs/atlas/page-style-guide
```

- 4 captures pleine page par route dans `.screenshots/` (ignoré par git) : `<route>.{desktop,mobile}.{light,dark}.png`.
- Le script signale : thème non appliqué, erreurs console/exceptions JS, ressources locales manquantes, images cassées, débordement horizontal (avec l'élément fautif).
- **Regarder les images** (outil Read) : au minimum le haut de page et chaque composant, en clair **et** en sombre. Points de contrôle : bordures `rgba(255,255,255,…)` invisibles en clair, fonds sombres codés en dur, texte illisible (ex. ligne `featured` de `CrossReferences` en sombre), cartes qui débordent en mobile.
- Connu et non bloquant : les tableaux Markdown larges débordent en mobile sur **toutes** les pages (`custom.css` force `.markdown table { display: table }`) ; les ressources externes (Google Fonts, CDN KaTeX) peuvent échouer hors ligne → simple avertissement.

## 4. Chiffres contre `_facts/`

```bash
python3 .claude/skills/docs-verify/scripts/check_facts.py --from-git=main --all
python3 .claude/skills/docs-verify/scripts/check_facts.py website/docs/astrospectro/science/validation.md --all
```

- Analyse la page **et** les composants qu'elle importe (`--no-components` pour s'en passer).
- `✗ INTROUVABLE` : retirer le chiffre, ou le justifier (valeur tirée du code source → citer le fichier ; valeur dérivée → montrer le calcul à partir de valeurs sourcées).
- `✗ RAPPORT À JUSTIFIER` : un « N× » calculé ; recalculer depuis les valeurs sources.
- `~ FAIBLE` : valeur courte trouvée seulement hors runs de référence → probablement une coïncidence.
- `✓` **n'est pas une preuve** : l'outil dit seulement que la valeur existe quelque part (ex. « 87 % » correspond aussi à l'accuracy de v6). Pour chaque chiffre clé, comparer la source affichée au fichier et à la clé indiqués dans `FACTS_INDEX.md` (bon run, bonne génération G1/G2).

## 5. Rapport

Terminer par un compte rendu court :

```text
Build : SUCCESS · avertissements SSG : identiques à main · liens propres aux pages modifiées : aucun
check-links : 0 nouveau lien cassé (N vérifiés)
Captures : <routes> × 4 — problèmes : … (images relues : oui)
Chiffres : X retrouvés (sources conformes à FACTS_INDEX), Y introuvables → <liste et décision>
```

Ne jamais écrire « vérifié » pour un contrôle qui n'a pas été exécuté ; dire lequel manque et pourquoi.
