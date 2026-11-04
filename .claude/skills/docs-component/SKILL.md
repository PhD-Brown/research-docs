---
name: docs-component
description: Choisir, utiliser ou créer un composant React MDX pour le site research-docs (website/src/components). Contient le catalogue complet des 74 composants existants (rôle, props, origine des données, compatibilité mode clair, page d'exemple). À utiliser avant d'insérer un bloc visuel dans une page, avant de créer ou modifier un composant, ou pour savoir d'où viennent les chiffres affichés par un composant (runs.json, module @site/src/data/astrospectro).
---

# docs-component

## 0. Règle des chiffres de run (décision éditoriale n° 4)

**Aucun chiffre de run codé en dur dans un composant.** Un composant qui affiche des résultats lit
`website/src/data/astrospectro/runs.json` via le module d'accès, ou reçoit ses valeurs par props :

```jsx
import { getReferenceRun, resolveRun, fmt, generationLabel } from '@site/src/data/astrospectro';

export default function MyBlock({ run }) {
  const r = resolveRun(run, 'classifier');      // prop `run` = clé du registre ou identifiant ; défaut = référence
  return <span>{fmt.pct(r.metrics.balanced_accuracy)} · {generationLabel(r)}</span>;
}
```

- `runs.json` est **généré** (`python3 scripts/build_runs_data.py`) depuis `_facts/` et le registre de `FACTS_INDEX.md` :
  ne jamais l'éditer à la main (procédure : skill `docs-new-run`).
- Fonctions utiles (`website/src/data/astrospectro/index.js`) : `getRun(id)`, `getReferenceRun(clé)`,
  `getReferenceRuns(clé)`, `resolveRun(runOuId, cléParDéfaut)`, `findRuns({kind, generation…})`, `shapRunFor(génération)`,
  `fmt.{pct,pctRaw,num,signed,int,sci,seconds,date}`, `generationLabel(run)`, `shortName(run)`, `leakNote(run)`,
  `prettyFeature(nom)`, `featureFamily(nom)`, `familyShares(loadings)`, `mean`, `ratio`.
- Tout bloc qui cite un run portant le drapeau `gaia_leak` (v6, mais aussi v3–v5) affiche `<GaiaLeakNote run={r} />`.
- Un bloc ne mélange jamais G1 et G2 (règle 2) : séparer en groupes étiquetés (`generationLabel`), cf. `ResultsHero`.
- Texte qualitatif propre à un run (ex. « axe 1 = gravité ») : le signaler dans l'en-tête du fichier.
- Les constantes physiques ou instrumentales (longueurs d'onde, résolution LAMOST, plages Teff de Harvard, 183
  descripteurs du catalogue) ne sont pas des chiffres de run.

## 1. D'abord chercher dans le catalogue

Lire `catalog.md` (même dossier). Il recense **tous** les fichiers de `website/src/components/` avec :
rôle · props · données (codées en dur / props / `content.js`) · statut mode clair · page d'exemple · état des chiffres.

Ordre de préférence :

1. **Composant générique prop-driven** (catalogue §1) : `CrossReferences`, `RunProvenance`, `RelatedPages`, `FigureGallery`, `SpectralLineRows`.
2. **Composant spécifique existant** (§2–§3) si la page traite exactement du même sujet — après avoir vérifié ses chiffres codés dans `FACTS_INDEX.md` §6. Un composant marqué ❌ (chiffres périmés ou sans source) ne doit **pas** être posé sur une nouvelle page tant qu'il n'est pas corrigé.
3. **Tableau Markdown** (cf. `science/model-card.mdx`) quand aucun composant ne convient.
4. **Nouveau composant** seulement si 1–3 ne suffisent pas et si la tâche autorise la modification de `website/src/components/`.

Usage dans une page :

```mdx
import RunProvenance from '@site/src/components/RunProvenance';

<RunProvenance experiment="…" savedAt="…" md5="…" notes="…" stack="…" keyResultsHref="…" />
```

Les valeurs passées en props viennent des fichiers listés dans `FACTS_INDEX.md` (jamais de mémoire).

## 2. Règles pour un nouveau composant

| Règle | Pourquoi |
|---|---|
| Fichier `website/src/components/PascalCase.jsx` (ou dossier + `index.jsx` + `styles.module.css` si le style est conséquent) | Convention du dépôt |
| En-tête de commentaire « Usage » avec un exemple de props (modèle : `CrossReferences.jsx`, `RunProvenance.jsx`) | Le catalogue et les autres sessions s'en servent |
| **Données de run** : lues dans `runs.json` (module `@site/src/data/astrospectro`) ou reçues par props ; jamais codées | Mise à jour d'un run en quelques minutes (décision n° 4) |
| Couleurs de texte/fond/bordure via `var(--ifm-…)` uniquement ; accents tirés de la palette de `page-style-guide.mdx` §4.11 | Lisible en clair **et** en sombre |
| Pas de `rgba(255,255,255,…)`, pas de fond sombre codé (`#06080f`, `#0a0c14`, `#0d1117`) | Invisible ou bloc noir en mode clair |
| Liens internes via `@docusaurus/Link` (`<Link to="/docs/…">`) plutôt que `<a href>` | Docusaurus vérifie alors les liens au build et ajoute la baseUrl |
| Images via `useBaseUrl` / `useBaseUrlUtils` (modèle : `FigureGallery`) | `baseUrl` = `/research-docs/` |
| Mise en page fluide : `flexWrap: 'wrap'` ou `grid-template-columns: repeat(auto-fill, minmax(…))` | Mobile (390 px) |
| Hooks au niveau du composant, jamais dans un `.map` (anti-exemple : `AEKeyMetrics`) | Règles des hooks React |
| Pas de dépendance npm nouvelle sans accord | Build et maintenance |

## 3. Après création ou modification

1. Ajouter / mettre à jour la ligne correspondante dans `catalog.md` (rôle, props, données, clair, page d'exemple) ;
   si le composant lit `runs.json`, l'indiquer (« runs.json : clé du registre ») — la liste sert au skill `docs-new-run`.
2. Utiliser le composant sur une page, puis lancer le skill `docs-verify` (build, liens, **captures clair/sombre/mobile**, chiffres).
3. Ne pas modifier un composant utilisé par d'autres pages sans vérifier ces pages aussi (colonne « Exemple » du catalogue, ou `grep -rl "components/<Nom>" website/docs*`).
