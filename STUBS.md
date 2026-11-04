# STUBS — plus aucune page `UnderConstruction`

> **État final au 2026-11-04** : les 98 pages en chantier inventoriées le 2026-11-03 (AstroSpectro 33 · Atlas 5 ·
> AstroVision 35 · ξ Dark Energy 25) ont toutes été rédigées. Les cinq dernières (Atlas : `notebook-atlas`, `figures-index`,
> `datasets-index`, `methods-index`, `repository-map`) l'ont été dans la PR de finition S1.
>
> Commande de contrôle (doit ne rien afficher) :
>
> ```bash
> grep -rl "components/UnderConstruction" website/docs website/docs-astrovision website/docs-xi | grep -v _archive
> ```
>
> Le détail des pages traitées (sources, pièges) est dans l'historique git de ce fichier (version du 2026-11-03).
> Le composant `UnderConstruction` reste disponible (`website/src/components/UnderConstruction`), mais l'admonition ci-dessous lui est préférée.

---

## Page partielle plutôt que stub

Pour une page encore incomplète, `editorial-guide.mdx` §6.3 recommande un admonition informatif plutôt que la boîte animée.
Syntaxe correcte (le titre va entre crochets, avec une ligne vide après l'ouverture et avant la fermeture ; `:::info Titre`
s'afficherait en texte brut) :

```mdx
:::info[Under construction]

This page is being expanded. The current version defines the scope of the topic and the core questions it will document.

:::
```

Quand une page est rédigée à partir d'un stub : retirer l'import et la balise `<UnderConstruction />`, **et** la section
« What this page covers » (liste de promesses) au profit du contenu réel. Procédure : skill `.claude/skills/docs-page`.
