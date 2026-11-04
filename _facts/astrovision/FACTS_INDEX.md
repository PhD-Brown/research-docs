# FACTS_INDEX — AstroVision : d'où vient chaque chiffre

> **Règle** : tout chiffre publié dans `website/docs-astrovision/` provient d'un fichier de `_facts/astrovision/`
> **ou** du registre de la §3 ci-dessous (valeurs de complément, signalées comme telles). Les pages ne codent
> aucun chiffre de résultat : elles lisent `website/src/data/astrovision/facts.json` (généré par
> `scripts/build_astrovision_data.py`) via `<Fact k="…"/>` ou les composants de `website/src/components/astrovision/`.
>
> Source du pack : `_facts/astrovision/MANIFEST.md` (export du 2026-11-04, dépôt local `AstroVision/`).
> Chemins relatifs à `_facts/astrovision/`. Ce fichier est le seul à modifier quand un nouveau résultat arrive (§6).

## 0. Ce que contient — et ne contient pas — le pack

Le pack ne contient **aucun fichier de métriques d'entraînement** (pas de JSON d'évaluation, pas de journal W&B) :
seuls `data/fusion_ablation_results.json` (4 valeurs) et les tables de synthèse (`master_synthesis.csv`,
`synthesis_summary_table.csv`, `morphometry_galaxy10.csv`, `attn_morphometry_df.csv`) sont des données. Les scores
des modèles (accuracy, balanced accuracy, mIoU, ECE, couverture conforme…) n'existent que dans les **sorties des
notebooks** du dépôt `AstroVision` (`notebooks/00…10`, lues en lecture seule) et, pour les rappels par classe de
DINOv2 fine-tuné, dans une **figure** du pack. Ces valeurs sont enregistrées en §3 avec leur notebook et leur
cellule, et portent un statut :

| Statut | Signification |
|---|---|
| *(calculé)* | Calculé par le script à partir d'un fichier de `data/` (§2) — **source de vérité**. |
| `notebook` | Recopié d'une sortie de notebook (complément, **non vérifiable dans `_facts/`**). |
| `figure` | Lu sur une figure de `figures/` (lecture visuelle, 2 décimales). |
| `code` | Constante du code source (`src/astrovision/*.py`) ou hyperparamètre fixé en dur. |

Les valeurs `notebook` doivent être remplacées par un export de métriques (JSON) dès qu'il existe : voir §6.

## 1. Modèles et résultats de référence

Sélection : on retient, pour chaque rôle, le modèle qui figure dans la **synthèse** du projet
(`notebooks/07_synthesis.ipynb` → `data/master_synthesis.csv`, `data/synthesis_summary_table.csv`) et dans la
progression du `README` ; les variantes intermédiaires (échauffement, probe) sont documentées comme étapes, pas comme résultats.
Jeu de données commun : **Galaxy10 DECaLS, 17 736 images, 10 classes** ; métrique principale : *balanced accuracy* sur le jeu de test.

| Rôle | Modèle retenu | Checkpoint (non exporté) | Clés `facts.json` | Candidats écartés |
|---|---|---|---|---|
| Référence from scratch | SimpleCNN (651 946 paramètres) | `simplecnn_galaxy10_best.pt` | `models.simplecnn.*` | — |
| Référence convolutive | EfficientNet-B0, **fine-tuning complet** | `efficientnet_galaxy10_finetune_best.pt` | `models.efficientnet.test.*` | **Échauffement** (tête seule, val 0,330) : `models.efficientnet.warmup.*` |
| Représentation gelée | DINOv2 ViT-B/14, **probe linéaire zero-shot** | — (`dinov2_features.npz`) | `models.dinov2_probe.test.*` | Probe de validation de nb 04 (0,550) : `models.dinov2_probe.val.*` |
| **Meilleur modèle d'image** | DINOv2 ViT-B/14, **fine-tuning complet** (10 epochs) | `dinov2_galaxy10_finetune_best.pt` | `models.dinov2_ft.*` | `dinov2_galaxy10_warmup_best.pt` (phase 1 = probe, §0) |
| Fusion multimodale | `GalaxyFusionClassifier` (DINOv2 + morpho + photométrie SDSS) | `fusion_dinov2_morpho_photo_best.pt` | `models.fusion.*` + `ablation.*` | Ablation de 30 epochs : `ablation.*` (valeurs distinctes, voir §4.1) |
| Segmentation | U-Net 3 classes (fond / disque / « bulbe ») sur pseudo-labels Otsu | `unet_galaxy10_best.pt` | `unet.*` | — |
| Incertitude | MC Dropout (T = 30) + mise à l'échelle de température + prédiction conforme (α = 0,10), appliqués à la fusion | — | `uncertainty.*` | — |

## 2. Chiffres calculés depuis `data/` (aucune valeur à saisir)

| Clé(s) `facts.json` | Fichier | Calcul |
|---|---|---|
| `dataset.n_images`, `dataset.by_class.<classe>.n`, `.share`, `dataset.imbalance_ratio`, `dataset.majority_class_accuracy` | `data/master_synthesis.csv` | 1 ligne = 1 galaxie (`g10_idx`) ; comptage par `class_name` ; ratio = max/min ; accuracy de la classe majoritaire = max/N |
| `crossmatch.n_matched`, `.n_unmatched`, `.match_rate`, `.n_with_gr`, `.n_with_mr`, `.n_with_zsp`, `.median_gr`, `.max_ang_dist_arcsec` | `data/master_synthesis.csv` | `objID` non nul ; `g-r`, `Mr`, `zsp` non nuls ; médiane de `g-r` ; max de `angDist` |
| `crossmatch.population.{blue_cloud,green_valley,red_sequence}.n` / `.share` | idem | comptage de `population` (part = sur les 17 665 appariements) |
| `dataset.by_class.<classe>.{n_sdss,median_gr,median_bulge_fraction,pct_blue_cloud,pct_red_sequence}` | `data/synthesis_summary_table.csv` | lecture directe ; **recoupée** avec `master_synthesis.csv` (le script échoue en cas d'écart) |
| `segmentation.bulge_fraction.*`, `segmentation.spearman_bulge.*`, `segmentation.n_components.*` | `data/master_synthesis.csv` | médianes de `frac_fond/disque/bulbe`, ρ de Spearman (rangs moyens) de `frac_bulbe` avec `g-r`, `Mr`, `z_photo`, répartition de `n_comp_bulbe` |
| `morphometry.n`, `morphometry.by_class.<classe>.{n,C,A,S,Gini,M20,sersic_n}`, `morphometry.overall.*` | `data/morphometry_galaxy10.csv` | médianes par classe sur le sous-échantillon de 5 000 galaxies (1 valeur manquante par colonne) |
| `attention_morphometry.n`, `.by_class.<classe>.{C,A,S,Gini,M20,n_components,mask_coverage}` | `data/attn_morphometry_df.csv` | médianes par classe (2 000 galaxies, 200 par classe) |
| `ablation.dinov2_only`, `.dinov2_morpho`, `.dinov2_photo`, `.dinov2_morpho_photo`, `ablation.delta_vs_dinov2_only.*` | `data/fusion_ablation_results.json` | lecture directe (balanced accuracy de test, 30 epochs) ; delta = valeur − « DINOv2 seul » |

Colonnes de `master_synthesis.csv` : 58 (`g10_idx`, `label`, `class_name`, `angDist`, `ra`, `dec`, `z_photo`, `objID`, colonnes VizieR
SDSS DR16, `u-g`…`u-r`, `population`, `Mr`, `pxscale`, `frac_fond`, `frac_disque`, `frac_bulbe`, `n_comp_bulbe`).

## 3. Registre des valeurs de complément — lu par `scripts/build_astrovision_data.py`

Format : 1re colonne = clé pointée entre backticks (l'imbrication de `facts.json` suit les points) ; 2e = valeur numérique ;
3e = source (notebook et cellule, figure ou code) ; 4e = statut. Les `|` d'une source s'écrivent `\|`. **Ne pas renommer
une clé** sans mettre à jour les pages qui l'utilisent (`grep -r "k=\"<clé>\"" website/docs-astrovision`).
Notebooks : `nb 04` = `notebooks/04_dinov2_finetune.ipynb`, etc. Numéros de cellule = indice dans le fichier `.ipynb`.

| Clé | Valeur | Source | Statut |
|---|---|---|---|
| `split.seed` | 42 | `src/astrovision/data_loader.py` (`load_galaxy10_splits`, seed=42) ; nb 04 `SEED` | code |
| `split.train` | 12416 | nb 01 / 02 / 04 / 06 — « Train: 12416 \| Val: 2660 \| Test: 2660 » | notebook |
| `split.val` | 2660 | idem | notebook |
| `split.test` | 2660 | idem | notebook |
| `split.fusion.train` | 12415 | nb 08 cellule 7 (split stratifié 70/15/15, `random_state=42`) | notebook |
| `split.fusion.val` | 2660 | idem | notebook |
| `split.fusion.test` | 2661 | idem | notebook |
| `dataset.image_size` | 256 | `data_loader.py` (tableau `(N, 256, 256, 3)`) ; nb 00 | code |
| `dataset.dino_input_size` | 224 | nb 03 / 04 (`Resize` 224×224 avant DINOv2) | code |
| `models.simplecnn.params` | 651946 | nb 01 cellule 5 — « Paramètres entraînables : 651,946 » | notebook |
| `models.simplecnn.epochs` | 30 | nb 01 cellule 9 (`epochs=30, lr=1e-3`) ; la sortie enregistrée est une reprise de 5 epochs à `lr=1e-4` (cellule 8) | notebook |
| `models.simplecnn.val.balanced_accuracy` | 0.61 | nb 01 cellule 8 — « Meilleur val balanced_acc : 0.610 » | notebook |
| `models.simplecnn.test.accuracy` | 0.6718 | nb 02 — « SimpleCNN acc=0.6718 balanced_acc=0.5952 » | notebook |
| `models.simplecnn.test.balanced_accuracy` | 0.5952 | idem | notebook |
| `models.simplecnn.recall.disturbed` | 0.106 | nb 02 — `classification_report` SimpleCNN (colonne recall) | notebook |
| `models.simplecnn.recall.merging` | 0.55 | nb 02 — `classification_report` SimpleCNN (colonne recall) | notebook |
| `models.simplecnn.recall.round_smooth` | 0.898 | nb 02 — `classification_report` SimpleCNN (colonne recall) | notebook |
| `models.simplecnn.recall.in_between_round_smooth` | 0.855 | nb 02 — `classification_report` SimpleCNN (colonne recall) | notebook |
| `models.simplecnn.recall.cigar_shaped_smooth` | 0.121 | nb 02 — `classification_report` SimpleCNN (colonne recall) | notebook |
| `models.simplecnn.recall.barred_spiral` | 0.679 | nb 02 — `classification_report` SimpleCNN (colonne recall) | notebook |
| `models.simplecnn.recall.unbarred_tight_spiral` | 0.626 | nb 02 — `classification_report` SimpleCNN (colonne recall) | notebook |
| `models.simplecnn.recall.unbarred_loose_spiral` | 0.613 | nb 02 — `classification_report` SimpleCNN (colonne recall) | notebook |
| `models.simplecnn.recall.edge_on_without_bulge` | 0.746 | nb 02 — `classification_report` SimpleCNN (colonne recall) | notebook |
| `models.simplecnn.recall.edge_on_with_bulge` | 0.759 | nb 02 — `classification_report` SimpleCNN (colonne recall) | notebook |
| `models.efficientnet.warmup.epochs` | 5 | nb 01 cellule 11 (backbone gelé, `lr=1e-3`) | notebook |
| `models.efficientnet.warmup.val.balanced_accuracy` | 0.33 | nb 01 cellule 11 — « Meilleur val balanced_acc : 0.330 » | notebook |
| `models.efficientnet.finetune.epochs` | 25 | nb 01 cellule 12 (tout dégelé, `lr=1e-4`) | notebook |
| `models.efficientnet.finetune.val.balanced_accuracy` | 0.845 | nb 01 cellule 12 — « Meilleur val balanced_acc : 0.845 » | notebook |
| `models.efficientnet.test.accuracy` | 0.8455 | nb 02 — « EfficientNet acc=0.8455 balanced_acc=0.8273 » (checkpoint `efficientnet_galaxy10_finetune_best.pt`) | notebook |
| `models.efficientnet.test.balanced_accuracy` | 0.8273 | idem | notebook |
| `models.efficientnet.recall.disturbed` | 0.441 | nb 02 — `classification_report` EfficientNet (colonne recall) | notebook |
| `models.efficientnet.recall.merging` | 0.889 | nb 02 — `classification_report` EfficientNet (colonne recall) | notebook |
| `models.efficientnet.recall.round_smooth` | 0.903 | nb 02 — `classification_report` EfficientNet (colonne recall) | notebook |
| `models.efficientnet.recall.in_between_round_smooth` | 0.947 | nb 02 — `classification_report` EfficientNet (colonne recall) | notebook |
| `models.efficientnet.recall.cigar_shaped_smooth` | 0.828 | nb 02 — `classification_report` EfficientNet (colonne recall) | notebook |
| `models.efficientnet.recall.barred_spiral` | 0.843 | nb 02 — `classification_report` EfficientNet (colonne recall) | notebook |
| `models.efficientnet.recall.unbarred_tight_spiral` | 0.783 | nb 02 — `classification_report` EfficientNet (colonne recall) | notebook |
| `models.efficientnet.recall.unbarred_loose_spiral` | 0.756 | nb 02 — `classification_report` EfficientNet (colonne recall) | notebook |
| `models.efficientnet.recall.edge_on_without_bulge` | 0.964 | nb 02 — `classification_report` EfficientNet (colonne recall) | notebook |
| `models.efficientnet.recall.edge_on_with_bulge` | 0.92 | nb 02 — `classification_report` EfficientNet (colonne recall) | notebook |
| `models.dinov2.feature_dim` | 768 | nb 03 — « Feature dim : 768 (CLS token) » | notebook |
| `models.dinov2.params_millions` | 86.6 | nb 03 / 04 — « DINOv2 ViT-B/14 chargé : 86.6M paramètres » | notebook |
| `models.dinov2.n_blocks` | 12 | nb 03 — « Num blocks : 12 » | notebook |
| `models.dinov2.n_heads` | 12 | nb 03 — « Num heads : 12 » | notebook |
| `models.dinov2.patch_size` | 14 | nb 03 — « Patch size : 14×14 pixels » | notebook |
| `models.dinov2_probe.test.accuracy` | 0.6365 | nb 03 — « Probe linéaire acc : 0.6365 » (features zero-shot, `dinov2_features.npz`) | notebook |
| `models.dinov2_probe.test.balanced_accuracy` | 0.5545 | nb 03 — « Probe linéaire bal : 0.5545 » | notebook |
| `models.dinov2_probe.val.balanced_accuracy` | 0.55 | nb 04 cellule 8 — « Probe : val balanced_acc = 0.550 » (initialisation de la tête, phase « warmup » de nb 04) | notebook |
| `models.dinov2_ft.epochs` | 10 | nb 04 cellule 12 (`epochs=10`) | notebook |
| `models.dinov2_ft.lr` | 5e-06 | nb 04 cellule 12 (`lr=5e-6`) | notebook |
| `models.dinov2_ft.weight_decay` | 0.0001 | nb 04 cellule 12 | notebook |
| `models.dinov2_ft.batch_size` | 32 | nb 04 (DataLoader d'entraînement `batch_size=32`) | notebook |
| `models.dinov2_ft.val.balanced_accuracy_best` | 0.847 | nb 04 cellule 12 — meilleur val (epoch 06) | notebook |
| `models.dinov2_ft.best_epoch` | 6 | nb 04 cellule 12 — « Epoch 06/10 … bal=0.847 » | notebook |
| `models.dinov2_ft.test.accuracy` | 0.8647 | nb 04 cellule 14 — « Accuracy : 0.8647 » | notebook |
| `models.dinov2_ft.test.balanced_accuracy` | 0.8389 | nb 04 cellule 14 — « Balanced Acc : 0.8389 » | notebook |
| `models.dinov2_ft.recall.disturbed` | 0.53 | `figures/dino_finetune_confusion.png` (diagonale de la matrice normalisée, lecture visuelle) | figure |
| `models.dinov2_ft.recall.merging` | 0.86 | `figures/dino_finetune_confusion.png` (diagonale de la matrice normalisée, lecture visuelle) | figure |
| `models.dinov2_ft.recall.round_smooth` | 0.94 | `figures/dino_finetune_confusion.png` (diagonale de la matrice normalisée, lecture visuelle) | figure |
| `models.dinov2_ft.recall.in_between_round_smooth` | 0.95 | `figures/dino_finetune_confusion.png` (diagonale de la matrice normalisée, lecture visuelle) | figure |
| `models.dinov2_ft.recall.cigar_shaped_smooth` | 0.72 | `figures/dino_finetune_confusion.png` (diagonale de la matrice normalisée, lecture visuelle) | figure |
| `models.dinov2_ft.recall.barred_spiral` | 0.87 | `figures/dino_finetune_confusion.png` (diagonale de la matrice normalisée, lecture visuelle) | figure |
| `models.dinov2_ft.recall.unbarred_tight_spiral` | 0.83 | `figures/dino_finetune_confusion.png` (diagonale de la matrice normalisée, lecture visuelle) | figure |
| `models.dinov2_ft.recall.unbarred_loose_spiral` | 0.78 | `figures/dino_finetune_confusion.png` (diagonale de la matrice normalisée, lecture visuelle) | figure |
| `models.dinov2_ft.recall.edge_on_without_bulge` | 0.96 | `figures/dino_finetune_confusion.png` (diagonale de la matrice normalisée, lecture visuelle) | figure |
| `models.dinov2_ft.recall.edge_on_with_bulge` | 0.93 | `figures/dino_finetune_confusion.png` (diagonale de la matrice normalisée, lecture visuelle) | figure |
| `models.fusion.params` | 643034 | nb 08 cellule 9 — « Paramètres : 643,034 » | notebook |
| `models.fusion.epochs` | 50 | nb 08 cellule 9 (`epochs=50, lr=3e-4`) | notebook |
| `models.fusion.lr` | 0.0003 | nb 08 cellule 9 | notebook |
| `models.fusion.dropout` | 0.35 | nb 08 cellule 9 | notebook |
| `models.fusion.test.balanced_accuracy` | 0.8631 | nb 08 cellule 11 — « Balanced Accuracy : 0.8631 » (test n = 2 661) | notebook |
| `models.fusion.test.accuracy` | 0.8752 | nb 08 cellule 11 — « Accuracy : 0.8752 » | notebook |
| `models.fusion.test.errors` | 332 | nb 08 cellule 18 — « Erreurs totales : 332 / 2,661 » | notebook |
| `models.fusion.test.errors_high_confidence` | 144 | nb 08 cellule 18 — « Erreurs haute confiance (>0.8) : 144 » | notebook |
| `models.fusion.coverage.morph` | 4999 | nb 08 cellule 6 — « Avec métriques : 4,999 \| NaN (masqués) : 12,737 » | notebook |
| `models.fusion.coverage.morph_masked` | 12737 | idem | notebook |
| `models.fusion.recall.disturbed` | 0.59 | nb 08 cellule 11 — `classification_report` (colonne recall) | notebook |
| `models.fusion.recall.merging` | 0.9 | nb 08 cellule 11 — `classification_report` (colonne recall) | notebook |
| `models.fusion.recall.round_smooth` | 0.95 | nb 08 cellule 11 — `classification_report` (colonne recall) | notebook |
| `models.fusion.recall.in_between_round_smooth` | 0.91 | nb 08 cellule 11 — `classification_report` (colonne recall) | notebook |
| `models.fusion.recall.cigar_shaped_smooth` | 0.86 | nb 08 cellule 11 — `classification_report` (colonne recall) | notebook |
| `models.fusion.recall.barred_spiral` | 0.91 | nb 08 cellule 11 — `classification_report` (colonne recall) | notebook |
| `models.fusion.recall.unbarred_tight_spiral` | 0.83 | nb 08 cellule 11 — `classification_report` (colonne recall) | notebook |
| `models.fusion.recall.unbarred_loose_spiral` | 0.79 | nb 08 cellule 11 — `classification_report` (colonne recall) | notebook |
| `models.fusion.recall.edge_on_without_bulge` | 0.93 | nb 08 cellule 11 — `classification_report` (colonne recall) | notebook |
| `models.fusion.recall.edge_on_with_bulge` | 0.97 | nb 08 cellule 11 — `classification_report` (colonne recall) | notebook |
| `models.fusion.precision.disturbed` | 0.63 | nb 08 cellule 11 — `classification_report` (colonne precision) | notebook |
| `models.fusion.precision.merging` | 0.92 | nb 08 cellule 11 — `classification_report` (colonne precision) | notebook |
| `models.fusion.precision.round_smooth` | 0.93 | nb 08 cellule 11 — `classification_report` (colonne precision) | notebook |
| `models.fusion.precision.in_between_round_smooth` | 0.93 | nb 08 cellule 11 — `classification_report` (colonne precision) | notebook |
| `models.fusion.precision.cigar_shaped_smooth` | 0.75 | nb 08 cellule 11 — `classification_report` (colonne precision) | notebook |
| `models.fusion.precision.barred_spiral` | 0.91 | nb 08 cellule 11 — `classification_report` (colonne precision) | notebook |
| `models.fusion.precision.unbarred_tight_spiral` | 0.79 | nb 08 cellule 11 — `classification_report` (colonne precision) | notebook |
| `models.fusion.precision.unbarred_loose_spiral` | 0.8 | nb 08 cellule 11 — `classification_report` (colonne precision) | notebook |
| `models.fusion.precision.edge_on_without_bulge` | 0.94 | nb 08 cellule 11 — `classification_report` (colonne precision) | notebook |
| `models.fusion.precision.edge_on_with_bulge` | 0.96 | nb 08 cellule 11 — `classification_report` (colonne precision) | notebook |
| `models.fusion.support.disturbed` | 162 | nb 08 cellule 11 — `classification_report` (support, test n = 2 661) | notebook |
| `models.fusion.support.merging` | 278 | nb 08 cellule 11 — `classification_report` (support, test n = 2 661) | notebook |
| `models.fusion.support.round_smooth` | 397 | nb 08 cellule 11 — `classification_report` (support, test n = 2 661) | notebook |
| `models.fusion.support.in_between_round_smooth` | 304 | nb 08 cellule 11 — `classification_report` (support, test n = 2 661) | notebook |
| `models.fusion.support.cigar_shaped_smooth` | 50 | nb 08 cellule 11 — `classification_report` (support, test n = 2 661) | notebook |
| `models.fusion.support.barred_spiral` | 307 | nb 08 cellule 11 — `classification_report` (support, test n = 2 661) | notebook |
| `models.fusion.support.unbarred_tight_spiral` | 275 | nb 08 cellule 11 — `classification_report` (support, test n = 2 661) | notebook |
| `models.fusion.support.unbarred_loose_spiral` | 394 | nb 08 cellule 11 — `classification_report` (support, test n = 2 661) | notebook |
| `models.fusion.support.edge_on_without_bulge` | 213 | nb 08 cellule 11 — `classification_report` (support, test n = 2 661) | notebook |
| `models.fusion.support.edge_on_with_bulge` | 281 | nb 08 cellule 11 — `classification_report` (support, test n = 2 661) | notebook |
| `models.fusion.ablation.epochs` | 30 | nb 08 cellule 15 (`ablation_study(..., epochs=30)`) | notebook |
| `unet.epochs` | 20 | `unet.py` (`train_unet`, défaut `epochs=20`) ; README | code |
| `unet.lr` | 0.0001 | `unet.py` (`train_unet`, défaut `lr=1e-4`) | code |
| `unet.test.miou` | 0.5399 | nb 06 — « Test mIoU : 0.5399 » (référence = pseudo-labels Otsu, pas un étiquetage manuel) | notebook |
| `unet.test.pixel_accuracy` | 0.807 | nb 06 — rapport par classe, « accuracy 0.807 » (174 325 760 pixels) | notebook |
| `unet.pixel_share.background` | 9.5 | nb 06 — distribution des pixels (train) des pseudo-labels Otsu, en % | notebook |
| `unet.pixel_share.disk` | 72.4 | idem | notebook |
| `unet.pixel_share.bulge` | 18.1 | idem | notebook |
| `unet.test.background.precision` | 0.722 | nb 06 — rapport par classe de pixels | notebook |
| `unet.test.background.recall` | 0.611 | idem | notebook |
| `unet.test.background.f1` | 0.662 | idem | notebook |
| `unet.test.disk.precision` | 0.825 | nb 06 — rapport par classe de pixels | notebook |
| `unet.test.disk.recall` | 0.935 | idem | notebook |
| `unet.test.disk.f1` | 0.876 | idem | notebook |
| `unet.test.bulge.precision` | 0.73 | nb 06 — rapport par classe de pixels | notebook |
| `unet.test.bulge.recall` | 0.396 | idem | notebook |
| `unet.test.bulge.f1` | 0.513 | idem | notebook |
| `unet.miou_by_class.disturbed` | 0.413 | nb 06 — « mIoU par classe morphologique » | notebook |
| `unet.miou_by_class.merging` | 0.418 | nb 06 — « mIoU par classe morphologique » | notebook |
| `unet.miou_by_class.round_smooth` | 0.418 | nb 06 — « mIoU par classe morphologique » | notebook |
| `unet.miou_by_class.in_between_round_smooth` | 0.388 | nb 06 — « mIoU par classe morphologique » | notebook |
| `unet.miou_by_class.cigar_shaped_smooth` | 0.355 | nb 06 — « mIoU par classe morphologique » | notebook |
| `unet.miou_by_class.barred_spiral` | 0.491 | nb 06 — « mIoU par classe morphologique » | notebook |
| `unet.miou_by_class.unbarred_tight_spiral` | 0.517 | nb 06 — « mIoU par classe morphologique » | notebook |
| `unet.miou_by_class.unbarred_loose_spiral` | 0.44 | nb 06 — « mIoU par classe morphologique » | notebook |
| `unet.miou_by_class.edge_on_without_bulge` | 0.386 | nb 06 — « mIoU par classe morphologique » | notebook |
| `unet.miou_by_class.edge_on_with_bulge` | 0.372 | nb 06 — « mIoU par classe morphologique » | notebook |
| `segmenter.otsu.bulge_percentile` | 80 | `segmenter.py` (`OtsuSegmenter(bulge_pct=80.0)`) : le « bulbe » = pixels > 80e percentile de la galaxie | code |
| `segmenter.otsu.background_percentile` | 5 | `segmenter.py` (`OtsuSegmenter(bg_pct=5.0)`) | code |
| `uncertainty.mc_dropout.passes` | 30 | nb 09 cellule 6 (`T = 30`) | notebook |
| `uncertainty.mc_dropout.balanced_accuracy` | 0.8616 | nb 09 cellule 6 — « Balanced Acc (mean probs) : 0.8616 » | notebook |
| `uncertainty.mc_dropout.mean_entropy` | 0.6926 | nb 09 cellule 6 | notebook |
| `uncertainty.mc_dropout.mean_mutual_info` | 0.0394 | nb 09 cellule 6 | notebook |
| `uncertainty.mc_dropout.median_entropy` | 0.5438 | nb 09 cellule 21 (résumé) | notebook |
| `uncertainty.mc_dropout.median_mutual_info` | 0.0175 | nb 09 cellule 21 (résumé) | notebook |
| `uncertainty.kruskal_wallis.entropy_stat` | 275.77 | nb 09 cellule 19 | notebook |
| `uncertainty.temperature.t_star` | 1.1807 | nb 09 cellules 10–11, 21 | notebook |
| `uncertainty.temperature.ece_before` | 0.0494 | nb 09 cellule 11 / 21 (probabilités MC moyennes, jeu de test) — retenu : valeur du résumé | notebook |
| `uncertainty.temperature.ece_after` | 0.1197 | idem | notebook |
| `uncertainty.temperature.ece_before_val` | 0.0307 | nb 09 cellule 10 (logits de validation, passe unique) — voir « Ambiguïtés » | notebook |
| `uncertainty.temperature.ece_after_val` | 0.0665 | idem | notebook |
| `uncertainty.conformal.alpha` | 0.1 | nb 09 cellule 14 | notebook |
| `uncertainty.conformal.q_hat` | 0.7633 | nb 09 cellule 14 | notebook |
| `uncertainty.conformal.coverage_cal` | 0.9008 | nb 09 cellule 14 | notebook |
| `uncertainty.conformal.coverage_test` | 0.9046 | nb 09 cellule 15 | notebook |
| `uncertainty.conformal.mean_set_size` | 1.09 | nb 09 cellule 15 | notebook |
| `uncertainty.conformal.singleton_rate` | 0.911 | nb 09 cellule 15 — « Taux singletons : 91.1% » | notebook |
| `uncertainty.conformal.size1` | 1212 | nb 09 cellule 15 — « Taille 1 : 1212 galaxies » | notebook |
| `uncertainty.conformal.size2` | 118 | idem | notebook |
| `uncertainty.conformal.size3` | 1 | idem | notebook |
| `uncertainty.conformal.n_eval` | 1331 | nb 09 cellule 15 — 1212 + 118 + 1 (moitié du jeu de test ; l'autre moitié calibre) | notebook |
| `uncertainty.median_entropy_by_class.disturbed` | 0.7804 | nb 09 cellule 18 — médiane de l'entropie prédictive par classe | notebook |
| `uncertainty.median_entropy_by_class.merging` | 0.5079 | nb 09 cellule 18 — médiane de l'entropie prédictive par classe | notebook |
| `uncertainty.median_entropy_by_class.round_smooth` | 0.5081 | nb 09 cellule 18 — médiane de l'entropie prédictive par classe | notebook |
| `uncertainty.median_entropy_by_class.in_between_round_smooth` | 0.593 | nb 09 cellule 18 — médiane de l'entropie prédictive par classe | notebook |
| `uncertainty.median_entropy_by_class.cigar_shaped_smooth` | 0.6632 | nb 09 cellule 18 — médiane de l'entropie prédictive par classe | notebook |
| `uncertainty.median_entropy_by_class.barred_spiral` | 0.5283 | nb 09 cellule 18 — médiane de l'entropie prédictive par classe | notebook |
| `uncertainty.median_entropy_by_class.unbarred_tight_spiral` | 0.6269 | nb 09 cellule 18 — médiane de l'entropie prédictive par classe | notebook |
| `uncertainty.median_entropy_by_class.unbarred_loose_spiral` | 0.7367 | nb 09 cellule 18 — médiane de l'entropie prédictive par classe | notebook |
| `uncertainty.median_entropy_by_class.edge_on_without_bulge` | 0.4668 | nb 09 cellule 18 — médiane de l'entropie prédictive par classe | notebook |
| `uncertainty.median_entropy_by_class.edge_on_with_bulge` | 0.4744 | nb 09 cellule 18 — médiane de l'entropie prédictive par classe | notebook |
| `attention.otsu_sample_size` | 599 | nb 10 — « Otsu charge : (599, 13) » | notebook |
| `attention.mask_percentile` | 60 | `attention_morphometry.py` (`AttentionMorphometry(percentile=60.0)`) | code |
| `attention.kruskal_wallis.c.otsu` | 202.0 | nb 10 — tableau « Kruskal-Wallis : Otsu vs Attention » | notebook |
| `attention.kruskal_wallis.c.attention` | 444.4 | idem | notebook |
| `attention.kruskal_wallis.a.otsu` | 100.9 | nb 10 — tableau « Kruskal-Wallis : Otsu vs Attention » | notebook |
| `attention.kruskal_wallis.a.attention` | 229.3 | idem | notebook |
| `attention.kruskal_wallis.s.otsu` | 150.8 | nb 10 — tableau « Kruskal-Wallis : Otsu vs Attention » | notebook |
| `attention.kruskal_wallis.s.attention` | 305.9 | idem | notebook |
| `attention.kruskal_wallis.gini.otsu` | 177.8 | nb 10 — tableau « Kruskal-Wallis : Otsu vs Attention » | notebook |
| `attention.kruskal_wallis.gini.attention` | 311.2 | idem | notebook |
| `attention.kruskal_wallis.m20.otsu` | 61.6 | nb 10 — tableau « Kruskal-Wallis : Otsu vs Attention » | notebook |
| `attention.kruskal_wallis.m20.attention` | 373.0 | idem | notebook |
| `attention.spearman_gr.c` | 0.07 | nb 10 — corrélations Spearman métriques attentionnelles × g-r (n = 1 957) | notebook |
| `attention.spearman_gr.a` | 0.063 | nb 10 — corrélations Spearman métriques attentionnelles × g-r (n = 1 957) | notebook |
| `attention.spearman_gr.s` | -0.072 | nb 10 — corrélations Spearman métriques attentionnelles × g-r (n = 1 957) | notebook |
| `attention.spearman_gr.gini` | -0.054 | nb 10 — corrélations Spearman métriques attentionnelles × g-r (n = 1 957) | notebook |
| `attention.spearman_gr.m20` | 0.087 | nb 10 — corrélations Spearman métriques attentionnelles × g-r (n = 1 957) | notebook |
| `attention.spearman_gr.n` | 1957 | idem | notebook |
| `crossmatch.radius_arcsec` | 3.0 | `crossmatcher.py` (`radius_as=3.0`) ; nb 05 — « rayon 3.0″ » | code |
| `crossmatch.ur_blue_cloud_max` | 2.22 | `crossmatcher.py` (`_add_sdss_columns` : `u-r < 2.22`) | code |
| `crossmatch.ur_red_sequence_min` | 2.55 | `crossmatcher.py` (`_add_sdss_columns` : `u-r > 2.55`) | code |
| `crossmatch.ks_pairs_significant` | 44 | nb 05 — « Paires significativement différentes (p<0.01) : 44/45 » | notebook |
| `crossmatch.ks_pairs_total` | 45 | idem | notebook |
| `crossmatch.lasso_gr.r2_mean` | 0.4431 | nb 05 — « Lasso (α=0.001) R²=0.4431 ± 0.1026 » (validation croisée, N = 17 430) | notebook |
| `crossmatch.lasso_gr.r2_std` | 0.1026 | idem | notebook |
| `crossmatch.lasso_gr.nonzero_features` | 315 | nb 05 — « 315 features non-nulles sur 768 » | notebook |
| `crossmatch.pc2_gr_rho` | 0.3006 | nb 05 — « PC2 g-r 0.300551 » (features zero-shot) | notebook |
| `dinov2_pca.pc2.variance_pct` | 13.2 | `figures/seg_dino_morpho_corr.png` (étiquette « PC2 (13.2%) », lecture visuelle ; features zero-shot, PCA sur vecteurs normalisés L2) | figure |
| `dinov2_pca.pc2.gini_rho` | 0.53 | `figures/seg_dino_morpho_corr.png` (cellule PC2 × Gini ; 4 999 galaxies avec morphométrie) | figure |
| `dinov2_pca.pc2.smoothness_rho` | 0.45 | idem (PC2 × S) | figure |
| `dinov2_pca.pc1.variance_pct` | 22.3 | `figures/seg_dino_morpho_corr.png` (étiquette « PC1 (22.3%) ») | figure |

## 4. Ambiguïtés et écarts entre sources

1. **Le « 86,3 % » de la fusion tardive n'est pas un gain de modalités.** Le notebook 08 donne 0,8631 (un entraînement de 50 epochs,
   test n = 2 661) ; l'ablation de 30 epochs sur les mêmes features donne `DINOv2 seul` = 0,8595, `+ Morpho` = 0,8612, `+ Photo` = 0,8590,
   `+ Morpho + Photo` = 0,8575 (fichier `fusion_ablation_results.json`, donc dans `_facts`). L'écart entre configurations (< 0,4 point) est du
   même ordre que l'écart entre deux entraînements de la même configuration (0,8631 contre 0,8575). Le gain de ≈ 2 points sur DINOv2
   fine-tuné seul (0,8389) vient de la **tête MLP sur features figées**, pas des modalités ajoutées. Les pages présentent la fusion avec
   l'ablation, jamais comme « le » résultat. Le tableau « Conclusions » du notebook 08 indique « à mesurer » alors que l'ablation existe.
2. **Splits différents, jeux de test différents.** SimpleCNN, EfficientNet, DINOv2 (nb 01–06) : permutation aléatoire `seed=42`, 12 416 / 2 660 / 2 660.
   Fusion, incertitude (nb 08–09) : split stratifié `random_state=42`, 12 415 / 2 660 / 2 661. Les deux tests ne sont pas le même ensemble :
   la comparaison 0,8389 → 0,8631 est inter-jeux. De plus, `dino_features.npy` (entrée de la fusion) est extrait, quand le cache est absent,
   du backbone **fine-tuné** (nb 08 cellule 4) : une partie des images de test du split stratifié a pu servir à entraîner ce backbone dans nb 04.
   Le pack ne contient pas `dino_features.npy` : **fuite possible non vérifiable** (à contrôler avant d'écrire « 86,3 % » sans réserve).
3. **« 5 651 galaxies appariées » (README, nb 08) est le nombre de galaxies avec `Mr`**, soit celles qui ont un redshift spectroscopique SDSS
   (`zsp` : 5 652). L'appariement photométrique SDSS DR16 (rayon 3″) couvre **17 665 galaxies (99,6 %)** (nb 05 ; recalculé depuis `master_synthesis.csv`).
   La mention « 31,9 % » du README est donc une couverture en `Mr`, pas un taux d'appariement. `Mr` n'a ni correction K ni extinction (`H0 = 70`, `crossmatcher.py`).
4. **R² DINOv2 → g-r** : 0,536 (README) et « ≈ 54 % » (docstring de `fusion.py`) contre **0,4431 ± 0,1026** (sortie de nb 05, Lasso α = 0,001, validation croisée,
   N = 17 430). Retenu : la sortie du notebook. Le 0,536 n'est retrouvé dans aucun fichier.
5. **ρ(PC2, Gini) = 0,53 et PC2 = 13,2 % de variance** : absents des sorties texte, mais lisibles sur `figures/seg_dino_morpho_corr.png` (statut `figure`).
   Features **zero-shot** (`dinov2_features.npz`), PCA sur vecteurs normalisés L2 ; corrélation sur les 4 999 galaxies avec morphométrie.
6. **Deux ECE avant/après mise à l'échelle de température** dans nb 09 : 0,0307 → 0,0665 (cellule 10, logits de validation, une passe) et 0,0494 → 0,1197
   (cellule 11 et résumé, probabilités MC moyennées sur le test). Retenu : la seconde (celle du résumé) ; **dans les deux cas l'ECE augmente**.
7. **Prédiction conforme sur 1 331 galaxies**, pas 2 661 : le jeu de test est coupé en deux moitiés (calibration / évaluation, `random_state=42`).
8. **« Bulbe » des pseudo-labels = 20 % de pixels les plus brillants** de la galaxie (`OtsuSegmenter(bulge_pct=80)`), donc fraction de bulbe Otsu = 0,200 pour toutes les classes
   (nb 06). Le U-Net apprend ce critère de brillance, pas un bulbe physique ; la fraction de bulbe U-Net (médiane 0,10) est quasi indépendante de `g-r` (ρ = −0,045).
   Le mIoU de test (0,5399) est mesuré **contre les pseudo-labels** ; « Otsu ≈ 0,500 » et « aléatoire ≈ 0,167 » (README) n'ont pas de sortie de notebook ; « +4 % vs teacher » n'est pas une comparaison valide.
9. **`C` n'a pas la même définition** dans `morphometry.py` (Conselice : 5 log₁₀ r80/r20, médiane ≈ 2,4) et dans `attention_morphometry.py` (rapport de flux cumulés dans le masque,
   médiane ≈ 0,7) : les deux colonnes ne sont pas comparables. Les statistiques de Kruskal-Wallis « Otsu vs attention » (nb 10) portent sur 599 contre 2 000 galaxies : leur comparaison directe est biaisée par la taille d'échantillon.
10. **Probe DINOv2** : 0,5545 (test, nb 03) ; 0,550 (validation, nb 04) ; 0,555 (README). Retenu : 0,5545 test.
11. **`build_model('dinov2')`** (README) n'existe pas : `models.py` n'enregistre que `simplecnn` et `efficientnet` ; `DINOv2Classifier` est défini dans le notebook 04.
12. **nb 00** affiche « 90 % de variance atteinte avec 1 composante » (PCA de pixels) alors que PC1 = 19,6 % : incohérent, non publié.

## 5. Chiffres du site actuel (pages non modifiées) sans source dans `_facts/`

| Page | Chiffre | Constat |
|---|---|---|
| `docs-astrovision/index.md` | « 86,3 % balanced accuracy » | = fusion nb 08 (§4.1) ; R² = 0,536 → §4.4 |
| `docs-astrovision/results/evaluation-protocol.mdx` | « 86,3 % », « ≈ 0,53 » (Disturbed) | 0,53 = rappel de DINOv2 fine-tuné (figure), pas de la fusion (0,59) |
| `docs-astrovision/community/roadmap.mdx`, `citing.mdx` | — | non relues pour les chiffres |

## 6. Procédure de mise à jour

1. Nouvel export `_facts/astrovision/` (ou, mieux, un JSON de métriques) → relire §2 : les valeurs calculées se mettent à jour seules.
2. Valeurs de complément : modifier **uniquement** la table de la §3 (valeur + cellule source) ; si un fichier de métriques apparaît, déplacer le calcul dans `scripts/build_astrovision_data.py` et supprimer la ligne du registre.
3. `python3 scripts/build_astrovision_data.py` puis `python3 scripts/build_astrovision_data.py --check` ; `cd website && npm run build`.
4. Reprendre les ambiguïtés de la §4 (une ligne à retirer ou à mettre à jour) et lancer le skill `docs-verify`.
