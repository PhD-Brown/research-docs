---
name: docs-page
description: Rédiger, compléter ou réécrire une page du site research-docs (Docusaurus, website/docs*) — notamment remplacer un stub UnderConstruction ou migrer une page de l'ancien site AstroSpectro. Donne la procédure (sources, gabarit par type de page, composants, chiffres tirés de _facts/, navigation) et renvoie vers docs-component et docs-verify. À utiliser dès qu'une tâche demande d'écrire du contenu de documentation.
---

# docs-page

## 0. Cadre

- Pages du site **en anglais** (`editorial-guide.mdx` §4.2) ; documents internes du dépôt (racine, `.claude/`) en français.
- **Tout chiffre vient de `_facts/`** via `FACTS_INDEX.md`. Pas de chiffre de mémoire, ni recopié d'une autre page ou d'un composant sans l'avoir retrouvé dans `_facts/`.
- Ne pas modifier d'autres pages ni des composants que la tâche ne vise pas. Si une correction ailleurs est nécessaire (lien, chiffre), la signaler dans le compte rendu.
- Le code source vit dans `PhD-Brown/AstroSpectro` (lecture seule) ; `AstroVision` et `xi-dark-energy-bao-mcmc` pour les autres projets.

## 1. Préparer

1. **Situer la page** : `STUBS.md` (priorité, sources, pièges) et `MIGRATION_MAP.md` (contenu FR à récupérer dans `website/docs/_archive/`, dette de liens).
2. **Type de page** → gabarit de `website/docs/atlas/page-style-guide.mdx` §3 : method/analysis · data · pipeline/concept · guide · result/science · API.
3. **Faits** : ouvrir dans `FACTS_INDEX.md` la section utile, puis les fichiers eux-mêmes. Noter pour chaque chiffre : fichier, clé, run, génération (**G1** = 43 019 spectres PHY-3500 · **G2** = 350k / v6). Ne jamais mélanger G1 et G2 dans un même bloc.
4. **Code** (pages pipeline/API/guides) : lire le module cité dans `STUBS.md` et vérifier chaque affirmation du stub (les puces « What this page covers » contiennent des chiffres et des fonctionnalités non vérifiés).
5. **Page canonique** : vérifier qu'aucune autre page ne porte déjà ce contenu (editorial-guide §3.2) ; sinon résumer et lier.

## 2. Écrire

Squelette (détails : style guide §4) :

```mdx
---
title: …
description: … (contexte du jeu de données ; pour un résultat : run + résultat clé sourcé)
---

import X from '@site/src/components/X';

{/* facts: _facts/astrospectro/<fichier> (<clé>) · run <ID> · G1|G2 */}

# Titre

Paragraphe d'ouverture (≤ 3 phrases, contexte : N, features, relevé, génération).

:::note[…]   ou   :::info[…]   ou   <RunProvenance …/>

---

## Key results
<ComposantCléOuTableau />

---
… sections du gabarit, séparées par `---` …

---

<RelatedPages pages={[…]} />
```

Règles qui reviennent le plus souvent :

- Le commentaire MDX `{/* facts: … */}` (invisible) liste les fichiers de `_facts/` utilisés : il sert à la relecture et à la mise à jour.
- Chaque métrique avec son contexte : modèle, mode (`spectro_only`), N, classes, run (editorial-guide §5.1). Préciser *accuracy* vs *balanced accuracy*.
- Résultat → interprétation → réserve (editorial-guide §5.2) ; « suggests » / « confirms » selon le [Claims Register](../../../website/docs/atlas/claims-register.mdx).
- Composants : choisir dans `.claude/skills/docs-component/catalog.md` ; un composant aux chiffres marqués ❌ n'est pas réutilisé tel quel.
- Figures : chemins locaux `/img/...` (copier depuis `_facts/` vers `website/static/img/<projet>/` si besoin, en réutilisant les chemins déjà publiés listés dans `_facts/astrospectro/MANIFEST.md`).
- Liens : en prose, liens Markdown vers le fichier (`[PCA](./pca.mdx)`) ; dans les props de composants, URL relatives à l'URL rendue (attention aux pages `index`).
- Stub remplacé : supprimer l'import et la balise `<UnderConstruction />` **et** la liste « What this page covers ». Page encore partielle : `:::info Under construction` (editorial-guide §6.3).
- Nouvelle page : l'ajouter à la sidebar concernée (`website/sidebars*.ts`), sinon elle n'apparaît pas dans la navigation.

## 3. Vérifier

Lancer le skill **docs-verify** (build, liens, captures clair/sombre × bureau/mobile, chiffres) et parcourir la checklist du style guide §7. Mettre à jour `STUBS.md` / `MIGRATION_MAP.md` si la page en sort.

## 4. Compte rendu

Indiquer : page(s) écrite(s), sources `_facts/` et code utilisées, chiffres écartés faute de source, écarts trouvés ailleurs (non corrigés), résultat de docs-verify.
