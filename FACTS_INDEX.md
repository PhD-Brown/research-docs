# FACTS_INDEX — d'où vient chaque chiffre AstroSpectro

> **Règle absolue** : tout chiffre publié sur le site provient d'un fichier de `_facts/astrospectro/`.
> Ce document dit **quel fichier** (et quelle clé). Si un chiffre n'est pas ici, retrouve-le avec
> `python3 .claude/skills/docs-verify/scripts/check_facts.py <page>`. Si l'outil ne le trouve pas,
> **ne le publie pas**.
>
> Source du pack : `_facts/astrospectro/MANIFEST.md` (export du 2026-11-03, 1 198 fichiers).
> Toutes les valeurs citées ci-dessous ont été relues dans les fichiers lors de la rédaction de cet index.
> Chemins relatifs à `_facts/astrospectro/`.
> Décisions éditoriales qui s'appliquent ici : `CLAUDE.md` § « Décisions éditoriales ».

---

## Registre des runs de référence — **le seul endroit à changer quand un run arrive**

| Rôle | Run | Statut éditorial |
|---|---|---|
| Classifieur de référence | `20260522T161236Z` — `ST_350k_xgb_AFGKM_v6` (G2, 349 998 spectres) | **Mis en avant.** Toujours accompagné de la mention de fuite Gaia (§1.1) |
| Classifieur — validation | `20260525T191109Z` — `VALIDATION_spectro_only_v7` (G2) | Run de validation **partiel** : documenté (§1.2), **jamais mis en avant** |
| PCA | G1 `phy3500_pca_run_20260408T012751Z` | Pages dimred, étiquette « PHY-3500 · G1 · 43 019 spectres » |
| UMAP / t-SNE / HDBSCAN | G1 `phy3500_umap_tsne_run_20260405T214233Z` (+ résumés `…_20260430T215407Z.json`) | idem |
| Autoencodeur | G1 `phy3500_autoencoder_run_20260405T220839Z` | idem |
| SHAP | v6 : `logs/shap/features_20260522T153123Z/01_data_leak/` | Avec la mention de fuite |
| Validation scientifique | G2 : `logs/validation/features_20260522T153123Z/` | — |

Procédure de mise à jour : §7.

---

## 0. Deux générations de données — à ne jamais mélanger

Le pack contient **deux générations de features** ; le site actuel mélange les deux.

| Génération | Fichier de features | N | Utilisée par | Figures |
|---|---|---|---|---|
| **G1 « PHY-3500 »** | `features_20260305T174836Z.csv` | **43 019** (STAR 42 956 · GALAXY 56 · QSO 7) × 183 features | Toutes les pages *dimred* actuelles, l'article PHY-3500 (Baker, Caillat & Jean, 2026) | `data/reports/figures/phy3500/features_20260305T174836Z/`, publiées sous `website/static/img/dimred/` |
| **G2 « 350k »** | `features_20260522T153123Z.csv` | **349 998** spectres traités (classifieur) · 153 060 × 183 (dimred) | XGBoost **v6** (modèle de référence), v7, SHAP 2026-05, validation 2026-05, runs dimred du 2026-05-22 | `data/reports/figures/phy3500/features_20260522T153123Z/` (pas encore publiées) |

- Le classifieur de référence (v6) a été entraîné sur **G2** ; les analyses dimred publiées viennent de **G1**.
  Une page ne doit **jamais** juxtaposer « N = 43 019 » et « 87 %/89 % de balanced accuracy » comme s'il s'agissait du même jeu.
- **Décision** : les pages dimred restent sur G1 et portent l'étiquette **« PHY-3500 · G1 · 43 019 spectres »**
  (sur le site, en anglais : « PHY-3500 · G1 · 43,019 spectra »). Les runs G2 du 2026-05-22 restent documentés ici,
  sans être publiés tant que cette décision n'est pas revue.

---

## 1. Classifieur — runs de référence

### 1.1 XGBoost v6 — **modèle de référence** · `20260522T161236Z`

| Fichier | Contenu |
|---|---|
| `data/reports/20260522T161236Z/session_report_xgboost_20260522T161236Z.json` | **Métriques** (toutes les valeurs ci-dessous) |
| `data/models/spectral_classifier_xgboost_20260522T161236Z_meta.json` | Hyperparamètres (`best_params_`), versions (`python`, `xgboost`…), `feature_names_used` (207), `selected_features_` (99), `trained_on_file` |
| `data/reports/20260522T161236Z/spectral_classifier_xgboost_20260522T161236Z_meta.json` | Copie du meta ci-dessus |
| `data/reports/20260522T161236Z/{confusion_matrix,roc,pr,calibration}_xgboost_20260522T161236Z.png` | Figures (pas de `feature_importance` pour ce run) |

| Chiffre clé | Valeur exacte | Clé JSON (session_report) |
|---|---|---|
| Expérience | `ST_350k_xgb_AFGKM_v6` | `exp_name` |
| Notes | « Full dataset retraining — 350k spectra — best params from v5 — spectro_only — isotonic calibration » | `notes` |
| Spectres traités | 349 998 | `total_spectra_processed` |
| Train / test | 229 274 / 60 947 | `training_set_size` / `test_set_size` |
| Classes | A, F, G, K, M | `class_labels` |
| Classes exclues | B, C, D, S, W, s (1 668 lignes retirées) | `class_filter.classes`, `class_filter.rows_removed` |
| Accuracy | 0.8743990680427256 → **87.4 %** | `accuracy` |
| **Balanced accuracy** | 0.8918747463516477 → **89.2 %** | `balanced_accuracy` |
| F1 macro | 0.8830241218906265 → **0.883** | `classification_report["macro avg"]["f1-score"]` |
| ROC-AUC macro | 0.9857240687151001 → **0.986** | `roc_auc_macro` (= `roc_auc.macro`) |
| ROC-AUC micro | 0.9875626632604465 | `roc_auc.micro` |
| Par classe (P / R / F1 / support) | A 0.854/0.935/0.893/3 738 · F 0.810/0.835/0.822/12 803 · G 0.885/0.839/0.861/21 902 · K 0.879/0.907/0.893/13 642 · M 0.948/0.944/0.946/8 862 | `classification_report.<classe>` |
| ROC-AUC par classe | A 0.9973 · F 0.9741 · G 0.9714 · K 0.9886 · M 0.9971 | `roc_auc.<classe>` |
| Average precision | A 0.9703 · F 0.9186 · G 0.9478 · K 0.9653 · M 0.9884 | `avg_precision.<classe>` |
| Brier | A 0.0097 · F 0.0517 · G 0.0675 · K 0.0345 · M 0.0116 | `brier_score.<classe>` |
| Matrice de confusion (lignes = vrai A→M) | `[[3494,212,13,11,8],[560,10691,1478,42,32],[11,2179,18371,1279,62],[6,54,856,12369,357],[18,61,51,365,8367]]` | `confusion_matrix` |
| MD5 du modèle | `e752bb7ce5494364364f77a4200aa480` | `model_hash_md5` |
| Hyperparamètres | `n_estimators` 600 · `max_depth` 6 · `learning_rate` 0.1 · `subsample` 0.8 · `colsample_bytree` 0.8 · `tree_method` hist · `objective` multi:softprob · `eval_metric` mlogloss · `random_state` 42 | `best_model_params.base_estimator__*` |
| Features | 207 candidates → **99 sélectionnées** | `len(feature_columns)`, `len(selected_features)` |
| Stack | Python 3.11.9 · numpy 2.3.4 · scikit-learn 1.7.2 · XGBoost 3.1.1 | meta : `python`, `numpy`, `scikit_learn`, `xgboost` |
| Fichier d'entraînement | `features_20260522T153123Z.csv` | meta : `trained_on_file` |

> ⚠️ **Mention obligatoire partout où v6 est cité** (décision éditoriale). Bien que `notes` dise « spectro_only »,
> les 99 features sélectionnées de v6 contiennent `M_G`, `M_BP`, `M_RP` et `ag_gspphot` (Gaia/photométrie) —
> vérifiable dans `selected_features` du session report. La page `concepts/data-leakage-audit.mdx` traite ce point ;
> le SHAP correspondant est rangé dans `01_data_leak/` (§3).
>
> Formulation de référence à réutiliser sur le site (EN) :
>
> > *Run v6 (`ST_350k_xgb_AFGKM_v6`) was trained with `spectro_only` enabled, but its 99 selected features include four
> > Gaia/photometric columns (`M_G`, `M_BP`, `M_RP`, `ag_gspphot`). Its metrics are therefore not purely spectroscopic;
> > see the [Data Leakage Audit](…/concepts/data-leakage-audit).*
>
> Sous forme courte (cartes, légendes) : *« v6 · includes 4 Gaia/photometric features — see Data Leakage Audit »*.

### 1.2 XGBoost v7 — validation du correctif spectro_only · `20260525T191109Z`

> **Statut éditorial : run de validation partiel — documenté, jamais mis en avant.** Selon l'auteur, le cross-match
> Gaia y est incomplet et le SHAP associé partiel ; ces deux points ne sont pas vérifiables dans `_facts/` (le pack ne
> contient ni statistiques de cross-match ni journal SHAP rattaché explicitement à v7). Ses métriques peuvent figurer
> dans une page de limitations ou dans l'audit de fuite, à titre de comparaison avec v6, jamais dans un bloc
> *Key results*, un hero ou un résumé.

| Fichier | `data/reports/20260525T191109Z/session_report_xgboost_20260525T191109Z.json` (+ `_meta.json`, figures ROC/PR/calibration/feature_importance) |
|---|---|
| Config exacte | `data/reports/last_config_used.json` (c'est la config de v7 : `exp_name` = `VALIDATION_spectro_only_v7`, `spectro_only: true`, `test_size` 0.21, `cv_folds` 5, `corr_threshold` 0.98, `class_counts` du jeu complet) |

| Chiffre | Valeur | Clé |
|---|---|---|
| Accuracy / BA / F1 macro | 0.8606 / 0.8804 / 0.8714 | `accuracy`, `balanced_accuracy`, `classification_report["macro avg"]["f1-score"]` |
| ROC-AUC macro | 0.9824 | `roc_auc_macro` |
| Features | 185 (aucune Gaia/photométrie ; pas de sélection) | `feature_columns`, `selected_features` vide |
| Colonnes retirées vs v6 (22) | `M_BP, M_G, M_RP, ag_gspphot, delta_ms, feature_Q_parameter, feature_X_parameter, feature_bp_g, feature_color_gr, feature_color_iz, feature_color_ri, feature_color_ug, feature_g_rp, feature_synthetic_BV, is_good_ruwe, magnitude_{g,h,i,j,r,u,z}` | différence d'ensembles |

### 1.3 Historique (pour pages « progression » / limitations uniquement)

Tous dans `data/reports/<run>/session_report_*.json`. Clés : `accuracy`, `balanced_accuracy`, `classification_report["macro avg"]["f1-score"]`, `roc_auc_macro`.

| Run | Expérience | N traités | Test | Acc | BA | F1 macro | AUC macro |
|---|---|---|---|---|---|---|---|
| `20260306T011253Z` | ST_100k_xgb_AFGKM_v3 | 99 999 | 12 493 | 0.8588 | 0.8637 | 0.8692 | 0.9787 |
| `20260306T013341Z` | ST_100k_xgb_AFGKM_v4 (spectro only) | 99 999 | 12 493 | 0.8558 | 0.8638 | 0.8678 | 0.9787 |
| `20260306T020848Z` | ST_100k_xgb_AFGKM_v5 (spectro only, isotonic) | 99 999 | 12 493 | 0.8559 | **0.8732** | 0.8665 | 0.9825 |
| `20260522T161236Z` | **v6** | 349 998 | 60 947 | 0.8744 | **0.8919** | 0.8830 | 0.9857 |
| `20260525T191109Z` | v7 (validation partielle — ne pas mettre en avant) | 349 998 | 60 947 | 0.8606 | 0.8804 | 0.8714 | 0.9824 |

Les runs 2025 (`20250823T…` → `20251217T…`) n'ont plus de PNG (allègement post-export) mais leurs JSON restent ; ils ne servent qu'à l'historique.
Le « 87 % » omniprésent sur le site correspond à la **BA de v5** (0.8732, 100k) — ou à l'**accuracy de v6** (0.8744) : préciser lequel.

---

## 2. Réduction de dimension (phy3500)

Dossiers : `data/reports/runs/phy3500_{pca,umap_tsne,autoencoder}/`. Chaque run = un `.json` (structuré) + un `.txt` (résumé lisible).
`*_run_latest.*` est **identique** au run du 2026-05-22 (G2) — ne pas le citer comme référence G1.

### 2.1 Runs de référence

| Méthode | Run de référence **G1** (pages actuelles) | Run **G2** (350k, latest) |
|---|---|---|
| PCA | `phy3500_pca_run_20260408T012751Z` (PCA features identique à `20260406T001511Z`, `20260408T012122Z`, `20260430T213828Z` ; **seul** `0408T…` porte la PCA flux brut citée) | `phy3500_pca_run_20260522T193711Z` |
| UMAP / t-SNE / HDBSCAN | `phy3500_umap_tsne_run_20260405T214233Z` (seul run qui réunit timings 40.13 s / 80.20 s, seeds t-SNE et HDBSCAN 20 clusters ; `20260406T003240Z` a les mêmes seeds/HDBSCAN) — résumés HDBSCAN/XGBoost complets dans `…_20260430T215407Z.json` | `phy3500_umap_tsne_run_20260522T205645Z` |
| Autoencodeur | `phy3500_autoencoder_run_20260405T220839Z` | `phy3500_autoencoder_run_20260522T213855Z` |

### 2.2 PCA — chiffres clés

| Chiffre | G1 (`20260408T012751Z`) | G2 (`20260522T193711Z`) | Où |
|---|---|---|---|
| Matrice | 43 019 × 183 | 153 060 × 183 | `.txt` §[Shapes] `X` ; `.json` `shapes` |
| Variance PC1 / PC2 | 16.87 % / 11.95 % (cumul 28.8 %) | 16.07 % / 11.38 % | `.txt` « Variance summary » ; `.json` `pca_features.variance_summary_top10` |
| Composantes pour 80/90/95/99 % | 51 / 73 / **91** / 100 | 53 / 75 / 93 / 100 | `pca_features.n_components_for_variance` |
| ρ Spearman (PC1, Teff) | **+0.831** | +0.835 | `.txt` « Corrélations Spearman » ; `.json` `corrélations_pc_gaia_spearman` |
| ρ (PC1, log g / [Fe/H] / BP−RP) | −0.155 / −0.548 / −0.768 | −0.154 / NaN / −0.770 | idem |
| ρ (PC2, Teff) | +0.156 | +0.157 | idem |
| Top loadings PC1 / PC2 | `.txt` « Top features PC1/PC2 » | idem | `.json` `pca_features.top_features_pc1` / `top_features_pc2` |
| PCA flux brut (10 000 spectres × 3 921 canaux) | PC1 46.6 % · PC2 31.8 % · PC3 12.9 % (cumul 3 PC = 91.3 %) ; 80/90/95/99 % → **3 / 3 / 5 / 36** PC | 80/90/95/99 % → 5/19/100/100 | `.json` `pca_spectra.variance_summary_top10`, `pca_spectra.n_components_for_variance` |
| MSE de reconstruction(k) | `.json` `reconstruction_error` ; aussi table « Comparison AE vs PCA » du run AE | idem | |

### 2.3 UMAP / t-SNE / HDBSCAN — chiffres clés (G1)

| Chiffre | Valeur | Fichier · clé |
|---|---|---|
| Paramètres UMAP | `n_neighbors` 15 · `min_dist` 0.1 · euclidean · `n_epochs` 200 | `…_20260430T215407Z.json` · `parameters.umap` |
| Paramètres t-SNE | `perplexity` 30 · `init` pca · `max_iter` 1000 · lr auto | idem · `parameters.tsne` |
| Temps UMAP / t-SNE | 40.13 s / 80.20 s | `…_20260405T214233Z.txt` · [Timing] |
| Procrustes UMAP (seeds 1–4) | 0.007011 · 0.038018 · 0.049714 · 0.024613 (moyenne seeds 1–4 = 0.030 ; moyenne 5 seeds incl. seed 0 = 0.0239) | `…_20260430T215407Z.json` · `stability.umap`, `stability.umap_numeric_means` |
| Procrustes t-SNE (seeds 1–4) | 0.000490 · 0.000101 · 0.000285 · 0.001016 (moyenne ≈ 4.7 × 10⁻⁴) | `…_20260405T214233Z.json` · `stability.tsne` (absent des runs 0408/0430) |
| HDBSCAN | 20 clusters · bruit 2 643 (6.14 %) · `min_cluster_size` 75 · `min_samples` 20 · eom | `…_20260430T215407Z.json` · `hdbscan_summary` |
| Plus gros clusters | C11 16 716 · C13 10 373 · C5 5 083 · C2 915 · C19 900 · C12 851 · C3 818 · C1 654 · C16 620 · C17 615 · C9 576 · C7 474 | `hdbscan_summary.largest_clusters` |
| Mode présentation | 13 clusters · bruit 2 617 (6.08 %) | `hdbscan_summary.presentation_mode` |
| Prédictions XGBoost projetées | 42 920 prédictions ; confiance médiane 0.9629 (modèle **v5** `20260306T020848Z`) ; A 2 540 · F 11 163 · G 19 742 · K 8 437 · M 1 038 | `xgboost_summary` (`…_20260406T003240Z.json` donne le `model_path`) |
| UMAP 3D axe 3 | meilleur paramètre log g, ρ = −0.214 | `umap3d_summary` |

G2 (`20260522T205645Z.txt`) : HDBSCAN 56 clusters · bruit 19 059 (12.45 %) ; UMAP 3D axe 3 ↔ Teff ρ = 0.710 ; confiance médiane 0.9643 (152 774 prédictions).

### 2.4 Autoencodeur — chiffres clés

| Chiffre | G1 (`20260405T220839Z`) | G2 (`20260522T213855Z`) | Clé (`.txt` [Metrics]) |
|---|---|---|---|
| MSE AE (z = 2) | **0.4891** | 0.5256 | `AE MSE global` |
| MSE PCA (k = 2) | 0.6963 | 0.7168 | `PCA MSE (2)` |
| Époques / meilleure val_loss | 145 / 0.5481 | 200 / 0.5487 | `AE epochs`, `AE best val_loss` |
| Temps d'entraînement | 143.67 s | 847.89 s | `AE fit time` |
| ρ (axe 1 ; axe 2) vs Teff | +0.019 ; +0.793 | −0.823 ; −0.581 | « AE latent correlations — Spearman » |
| ρ vs log g | +0.340 ; −0.112 | +0.232 ; +0.048 | idem |
| MSE par classe (moyenne / médiane) | STAR 0.485/0.227 · GALAXY 3.009/1.170 · QSO 5.794/0.954 | STAR 0.522/0.216 · GALAXY 3.556/1.027 · QSO 2.575/1.220 | « Reconstruction summary by class » |

> Sur G2, l'axe 1 de l'AE redevient thermique (ρ Teff = −0.823) : la « découverte gravité sur l'axe 1 » est **propre au run G1** — à formuler avec prudence.

---

## 3. SHAP

Dossier : `logs/shap/`. Le fichier chiffré est toujours `shap_feature_importance.csv` (colonnes `feature, mean_abs_shap, family, category`) ; `discoveries.csv` donne rang, famille et verdict.

| Dossier | Modèle analysé (déduit) | n features | Part de Σ\|SHAP\| « Physical (spectroscopic) » | Top 3 |
|---|---|---|---|---|
| `features_20260522T153123Z/01_data_leak/` | **v6** (99 features sélectionnées, dont Gaia) | 99 | **96.8 %** (Gaia/photométrie 3.2 %) | Mg b EW · CaH2 · slope_deep_red |
| `features_20260522T153123Z/` (racine) | modèle spectro-only patché (**v7 probable** : 185 colonnes → 176 après filtre de colinéarité — *déduction, à confirmer*). SHAP **partiel** selon l'auteur → ne pas mettre en avant | 176 | **100 %** | CaH2 · Mg b EW · Hα EW |
| `features_20260305T174836Z/` | **v5** (98 features sélectionnées = v5) | 98 | **97.9 %** (Gaia/photométrie 2.1 %) | CaH2 · Mg b EW · Hα EW |
| `logs/shap/` (racine) | modèle antérieur (58 features) | 58 | 77.6 % | CaH2 · Mg b EW · G4300 |

- Le « **97.9 %** » des pages = part de l'importance SHAP totale, run v5 (`features_20260305T174836Z`) — **pas** « 97.9 % des top-30 » (le top-30 contient 29/30 features physiques).
- Le « 96.8 % » du style guide v1 = run v6 (`01_data_leak`).
- Figures : `FIGURE_2_shap_composite.png`, `global_importance.png`, `beeswarm_per_class.png`, `class_feature_heatmap.png`, `class_specific_importance.png`, `physical_vs_observational.png`, `shap_interaction_matrix.png`, `shap_vs_native_rank.png`, `dependence_top4.png`, `summary_bar.png` dans chaque dossier ; 3 d'entre elles (run v5) sont déjà sous `website/static/img/dimred/` (cf. MANIFEST §« Figures déjà sur le site »).

---

## 4. Validation scientifique

Dossier : `logs/validation/`. Fichier chiffré : `validation_summary.csv` (colonnes `Feature, Theory_Matches, Correlation, Notes`).

| Contrôle | G1 `features_20260305T174836Z/` | G2 `features_20260522T153123Z/` |
|---|---|---|
| Hα FWHM vs Teff | ρ = −0.394 (ordre A>F>G>K non respecté) | ρ = −0.397 |
| Ca II K prominence | ρ(type) = +0.040 ; ρ([M/H]) = −0.324 (**inversé**) | ρ(type) = +0.041 ; [M/H] N/A (spectro_only) |
| Couleur g−r | r(type) = +0.038 | r(type) = +0.014 |
| SNR | r(SNR, résidu) = −0.010 | r = −0.006 |

Figures : `FIGURE_1_validation_composite.png`, `caii_validation.png`, `cak_hbeta_ratio_by_spt.png`, `color_indices.png`, `ha_fwhm_vs_teff.png`, `halpha_fwhm_validation.png`, `snr_quality_check.png` (+ à la racine `caIIK_prom_vs_mh.png`, `color_br_vs_teff.png`, `ha_fwhm_by_spt.png`, `color_indices_by_spt.png`, `caIIK_prom_by_spt.png`).

---

## 5. Catalogue et téléchargement

| Fichier | Contenu |
|---|---|
| `data/catalog/downloaded_plans.csv` | URLs des plans LAMOST téléchargés (colonne `url`, 147 lignes) |
| `data/catalog/valid_plan_urls.csv` | URLs de plans valides (colonne `url`, 4 152 lignes) |
| `data/catalog/spectra_position_catalog.csv` | `plan_id, ra, dec, spectra_count` (107 plans) |
| `data/catalog/session_pending.json` | File d'attente de téléchargement |
| `data/reports/last_config_used.json` → `class_counts` | Comptes de classes du jeu complet : G 104 293 · K 64 962 · F 60 967 · NaN 57 819 · M 42 485 · A 17 801 · W 739 · B 570 · D 254 · C 105 · O 3 |
| `csv_summaries.json` | Métadonnées (lignes × colonnes, colonnes, date) des CSV **non copiés** : `features_20260522T153123Z.csv` = 349 998 × 308 ; `trained_spectra.csv` = 349 998 lignes ; `master_catalog_gaia.csv` = instantané de 4 999 × 107 (2026-05-25, **pas** le catalogue complet) ; `test_predictions_xgboost_20260522T161236Z.csv` = 60 947 lignes |
| `data/reports/cmd_*.png`, `rpm_*.png` | Figures 2025–2026 non documentées dans le pack (vérifier l'en-tête de la figure avant usage) |

**Absents du pack** (donc non publiables sans nouvel export) : le contenu de `master_catalog_gaia.csv` et des `features_*.csv`, les statistiques de cross-match Gaia (taux d'appariement, rayon effectif), les comptes par étape de filtre qualité (SNR, RUWE), les logs W&B (le « 85+ runs / 121 métriques » n'a aucune source ici).

---

## 6. Chiffres du site sans source ou contradictoires (relevé du 2026-11-03)

À corriger lors de la réécriture des pages concernées — **pas dans cette PR**.

| Où | Affiché | Constat d'après `_facts/` |
|---|---|---|
| `ClassifierMetrics.jsx` (3 pages) | « 87 % » BA · « ~0.964 » ROC-AUC · « 96.3 % » confiance | BA 87 % = v5 ; v6 = 89.2 % / 0.986. **0.964 introuvable**. 96.3 % = confiance médiane v5 sur G1 (§2.3) |
| `ResultsHero.jsx` | ROC-AUC « ~0.964 », « 97.9 % physical features top-30 » | 0.964 introuvable ; 97.9 % = part Σ\|SHAP\| v5, pas top-30 |
| `SHAPTop10.jsx` (2 pages) | Top-10 dominé par Ca II K (importances 0.98, 0.94…) | **Aucun CSV SHAP ne donne ce classement** ; tous les runs 2026 placent CaH2 / Mg b / Hα en tête. Valeurs normalisées sans source |
| `PCAvsXGBoost.jsx` | « Ca II dominates SHAP top-5 » | Contredit par §3 |
| `VarianceChart.jsx` | Commentaire « approximate realistic values » pour PC1–PC20 | Remplacer par `pca_features.variance_summary_top10` (+ suite) du run G1 |
| `EigenspectraContrast.jsx` | Flux brut : 95 % avec **3** PC | 3 PC = 91.3 % (90 %) ; 95 % → **5** PC |
| `TrainingConfig.jsx` | « N = 43,019 » + « run 20260213T225019Z » + hyperparamètres v6 | Le run `20260213T225019Z` = 49 999 spectres ; hyperparamètres = v6 ; 43 019 = jeu dimred |
| `AEKeyMetrics.jsx`, `ClassDistribution.jsx` | « 107× » erreur QSO/STAR | Run G1 : ratio moyenne 11.9×, médiane 4.2× — **107× introuvable** |
| `DatasetStats.jsx`, `LAMOSTSpecs.jsx` | Rayon de cross-match Gaia 1″ ; « ~100 % matched » ; ~250 000 FITS | Aucune source dans `_facts` (le code `gaia_crossmatcher.py` montre 0.5″ en exemple ; le stub `gaia-dr3.md` dit 1.5″) |
| `ProgressionPipeline.jsx`, `PhysicsVsBlackBox.jsx` | 32 % → 50 % → 75 % → 84 % → 87 % | Seul le dernier palier a une source (v5) ; les runs 2025 sont dans `data/reports/2025*` à recouper |
| `TrainingPipelineFlow.jsx`, stubs | « 121 métriques W&B », « 85+ runs » | Aucune source |
| `editorial-guide.mdx` | « 87 % BA … 43,019-spectrum » | Mélange G1/G2 (le classifieur n'a jamais été évalué sur 43 019 spectres) |
| `index.mdx` (`AstroSpectroIndex`, non utilisé) | 89.2 % · 0.986 · 350k · 99/207 | ✓ conforme à v6 |
| `science/model-card.mdx` | 89.19 · 88.3 | ✓ conforme à v6 |

---

## 7. Procédure « nouveau run » (objectif : quelques minutes)

Principe (décision éditoriale) : la documentation doit pouvoir passer à un nouveau run en quelques minutes.
Concrètement, un run de référence n'est nommé qu'à **un** endroit (registre en tête de ce fichier) et chaque page
déclare les fichiers dont elle tire ses chiffres (commentaire `{/* facts: … */}`, skill `docs-page`).

1. **Exporter** le nouveau run dans `_facts/astrospectro/` (même arborescence ; `MANIFEST.md` régénéré).
2. **Lire ses chiffres** : `session_report_*.json` (classifieur) ou `phy3500_*_run_<ID>.txt` (dimred). Comparer aux
   tableaux §1–§4 ; vérifier en particulier la présence de colonnes Gaia/photométriques dans `selected_features`.
3. **Mettre à jour ce fichier** : registre en tête, section concernée (§1.1 ou §2.x), historique §1.3, et la mention de
   fuite si elle change.
4. **Trouver les pages touchées** :

   ```bash
   grep -rln "<ancien run ID>" website/docs* website/src/components   # pages et composants qui citent l'ancien run
   grep -rln "facts:.*<ancien fichier>" website/docs*                  # pages qui déclarent l'ancienne source
   python3 .claude/skills/docs-verify/scripts/check_facts.py <page> --all   # après remplacement des valeurs
   ```

5. **Remplacer les valeurs** dans les pages (et dans les props des composants), puis lancer le skill `docs-verify`.
6. **Composants à chiffres codés en dur** (catalogue `.claude/skills/docs-component/catalog.md`, §3) : ce sont eux qui
   rendent la mise à jour lente. À chaque passage, préférer les convertir en composants *prop-driven* (valeurs passées
   par la page) — à faire dans une tâche dédiée, pas au fil de l'eau.
