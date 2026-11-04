---
name: docs-new-run
description: Mettre à jour le site research-docs quand un nouveau run AstroSpectro arrive (classifieur, PCA, UMAP/t-SNE, autoencodeur, SHAP, validation) — export des faits, registre de FACTS_INDEX.md, régénération de website/src/data/astrospectro/runs.json par scripts/build_runs_data.py, puis docs-verify. À utiliser dès qu'une tâche parle d'un nouveau run, d'un nouveau modèle de référence, d'un nouvel export _facts ou de « mettre à jour les chiffres du site ».
---

# docs-new-run

Décision éditoriale n° 4 : la documentation se met à jour **en quelques minutes** à chaque nouveau run.
Un run de référence n'est nommé qu'à un endroit — le **registre en tête de `FACTS_INDEX.md`**. Les composants lisent
leurs chiffres dans `website/src/data/astrospectro/runs.json` (généré) ; aucune page ni aucun composant ne code un
chiffre de run en dur.

```text
export_doc_facts.py (AstroSpectro/scripts) → commit _facts → registre → build_runs_data.py → docs-verify
```

## 1. Exporter les faits (machine qui a `data/` et `logs/` d'AstroSpectro)

```bash
cd AstroSpectro
python scripts/export_doc_facts.py --target ../research-docs --dry-run   # voir ce qui sera copié
python scripts/export_doc_facts.py --target ../research-docs             # régénère _facts/astrospectro/ + MANIFEST.md
```

Dans une session cloud sans `data/`, ce pas est fait par l'auteur : partir d'un `_facts/` déjà à jour.

## 2. Committer `_facts/` (branche, jamais `main`)

```bash
cd research-docs
git switch -c facts/<run-id>
git add _facts && git commit -m "facts: export <run-id>"
```

## 3. Mettre à jour le registre (`FACTS_INDEX.md`, en tête)

| Clé | Contenu de la colonne « Run(s) » |
|---|---|
| `classifier` | horodatage du `session_report` (ex. `20260522T161236Z`) |
| `classifier_validation` | idem (run de validation, jamais mis en avant) |
| `pca`, `umap_tsne`, `autoencoder` | nom de fichier sans extension (`phy3500_pca_run_<ID>`) ; plusieurs IDs possibles, le premier est le principal |
| `shap`, `validation` | dossier `logs/shap/<…>/` ou `logs/validation/<…>/` |

- Ne pas renommer les clés (les composants appellent `getReferenceRun('<clé>')`).
- Mettre « partiel » dans la colonne « Statut » d'un run partiel → drapeau `partial`.
- Compléter aussi la section détaillée (§1.1 classifieur, §2.x dimred, §3 SHAP, §4 validation) et l'historique §1.3.
- Nouveau fichier de features (nouvelle génération) : l'ajouter à `GENERATIONS` dans `scripts/build_runs_data.py`
  et à FACTS_INDEX §0. Ne jamais mélanger deux générations dans un bloc (CLAUDE.md, règle 2).

## 4. Régénérer les données

```bash
python3 scripts/build_runs_data.py --summary   # écrit runs.json et affiche chaque clé du registre
python3 scripts/build_runs_data.py --check     # doit répondre « à jour » (à relancer avant commit)
```

Relire la sortie `--summary` : identifiant, génération (G1/G2), BA/AUC, colonnes Gaia/photométriques. Le drapeau
`gaia_leak` est **calculé** (colonnes Gaia/photométriques parmi les features utilisées) ; si un run de référence en a,
tous les composants qui le citent affichent automatiquement la mention courte (`GaiaLeakNote`, FACTS_INDEX §1.1).
Un `session_report` illisible est signalé (`! ignoré …`) et sauté.

## 5. Vérifier (skill `docs-verify`)

1. `cd website && npm run build` — `[SUCCESS]`.
2. Liens : `node .claude/skills/docs-verify/scripts/check-links.mjs website/build`.
3. Captures des pages qui portent des composants à données :

   ```bash
   grep -l "src/data/astrospectro" website/src/components/*.jsx   # composants concernés
   ```

   puis leurs pages d'exemple (catalogue `.claude/skills/docs-component/catalog.md`, colonne « Exemple »), par ex.
   `docs/astrospectro/science/classification-performance`, `…/science/results-analysis`, `…/dimred`, `…/dimred/pca`,
   `…/dimred/autoencoder`, `…/dimred/data-loader`, `…/guides/model-training`, `docs/astrospectro`.
4. `check_facts.py` sur les pages dont la **prose** cite des chiffres.

## 6. Ce qui ne se met pas à jour tout seul

- **La prose des pages** : `grep -rln "<ancien run ID>\|<ancienne valeur>" website/docs*` puis réécrire (skill `docs-page`).
- **Les interprétations qualitatives** des composants (ex. « axe 1 de l'AE = gravité », étiquettes de population des
  clusters HDBSCAN) : elles sont propres au run G1 et signalées dans l'en-tête du fichier du composant.
- Les étapes de `ProgressionPipeline` / `PhysicsVsBlackBox` (historique fixe : v3, v4, v5 + run de référence) :
  changer `DEFAULT_PROGRESSION` / `DEFAULT_EVOLUTION` si l'historique doit montrer un autre run.

## 7. Compte rendu

Run(s) changé(s) dans le registre, sortie de `--summary` pour les clés touchées, composants/pages vérifiés
(captures), prose à réécrire repérée par grep (avec la liste des pages), résultat de docs-verify.
