# STUBS — pages `UnderConstruction` restantes

> **État final au 2026-11-04** (`main`, après les PR #1 à #8) : sur les 98 pages en chantier inventoriées le 2026-11-03
> (AstroSpectro 33 · Atlas 5 · AstroVision 35 · ξ Dark Energy 25), **93 ont été rédigées**. Il en reste **5**, toutes dans
> l'Atlas (`website/docs/atlas/`). Commande de contrôle :
>
> ```bash
> grep -rl "components/UnderConstruction" website/docs website/docs-astrovision website/docs-xi | grep -v _archive
> ```
>
> Le détail des 93 pages traitées (sources, pièges) est dans l'historique git de ce fichier (version du 2026-11-03).
> Procédure de rédaction : skill `.claude/skills/docs-page` ; vérification : `.claude/skills/docs-verify`.
> Les puces « What this page covers » des stubs contiennent des chiffres **non sourcés** : ne pas les recopier.

Abréviations : `AS/` = dépôt `PhD-Brown/AstroSpectro` ; `F/` = `_facts/astrospectro/` ; `G1`/`G2` = générations de données (`FACTS_INDEX.md` §0).

---

## 1. Pages restantes (Atlas)

| Page (`website/docs/…`) | Priorité | Sources | Pièges / décisions |
|---|---|---|---|
| `atlas/notebook-atlas.md` | P2 | `AS/notebooks/{00..04}_*.ipynb`, `AS/notebooks/dimred/phy3500_0{1,2,3}_*.ipynb` ; `AstroVision/notebooks/00–10` ; `xi-dark-energy-bao-mcmc/notebooks/00–03` | Lire les notebooks en lecture seule ; ne citer aucun chiffre de sortie sans le retrouver dans `_facts/`. |
| `atlas/figures-index.md` | P2 | `website/static/img/dimred/` + table « Figures déjà sur le site » de `F/MANIFEST.md` ; pages de chaque projet pour AstroVision et ξ | Les figures publiées sont **G1** ; les figures G2 ne sont pas publiées (`FACTS_INDEX.md` §0). Indiquer pour chaque figure le run et la génération. |
| `atlas/datasets-index.md` | P2 | `FACTS_INDEX.md` §0 et §5 ; pages `data/` de chaque projet | Deux générations AstroSpectro (G1 43 019 / G2 349 998) : ne jamais les mélanger. Pour AstroVision et ξ, citer les `FACTS_INDEX.md` de `_facts/astrovision/` et `_facts/xi/`. |
| `atlas/methods-index.md` | P3 | Pages méthodes existantes (`dimred/*`, `science/shap-interpretability`, pages `models/` et `inference/` des deux autres projets) | Index uniquement : lier les pages canoniques (editorial-guide §3.2), ne pas résumer leurs résultats. |
| `atlas/repository-map.md` | P3 | Les quatre dépôts (`AstroSpectro`, `AstroVision`, `xi-dark-energy-bao-mcmc`, `research-docs`) | Dépôts de code en lecture seule (`CLAUDE.md` règle 5). L'ancien site `PhD-Brown.github.io/AstroSpectro` est fermé : ne pas y renvoyer. |

---

## 2. Page partielle plutôt que stub

Pour une page encore incomplète, `editorial-guide.mdx` §6.3 recommande un admonition informatif plutôt que la boîte animée.
Syntaxe correcte (le titre va entre crochets, avec une ligne vide après l'ouverture et avant la fermeture) :

```mdx
:::info[Under construction]

This page is being expanded. The current version defines the scope of the topic and the core questions it will document.

:::
```

Quand une page est rédigée : retirer l'import et la balise `<UnderConstruction />`, **et** la section « What this page covers »
(liste de promesses) au profit du contenu réel, puis mettre à jour ce fichier.
