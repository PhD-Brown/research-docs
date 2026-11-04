# FACTS_INDEX — ξ Dark Energy : d'où vient chaque chiffre

> **Règle absolue** : tout chiffre publié dans `website/docs-xi/` provient d'un fichier de `_facts/xi/` (ou, pour
> une valeur de *configuration*, du code du dépôt `xi-dark-energy-bao-mcmc` — §3, signalé comme tel).
> Les pages lisent leurs chiffres dans `website/src/data/xi/facts.json` (composant `xi/Fact`), généré par
> `scripts/build_xi_data.py` depuis ce pack et le registre ci-dessous. Chemins relatifs à `_facts/xi/`.
> Source du pack : `MANIFEST.md` (export du 2026-11-04). Dépôt de code : `PhD-Brown/xi-dark-energy-bao-mcmc`, commit `25ed86e`.

---

## Registre des résultats de référence — **le seul endroit à changer quand un run arrive**

| Clé | Rôle | Dossier de résultats | Statut éditorial |
|---|---|---|---|
| `protocol1b` | **Protocole 1b — Pantheon+SH0ES + DESI DR2 BAO, run long final** (100 000 pas · 96 walkers) | `results/protocol1b_pantheon_desi` | **Référence, mis en avant.** Toujours accompagné de la mention « exploratoire » et des limites (`results/caveats`) |
| `protocol1` | Protocole 1 — Pantheon+SH0ES seul | *(aucun fichier de résultats chiffrés dans le pack)* | En comparaison, **figures seulement** (`figures/protocol1_pantheon_only/`) ; aucun chiffre publiable |

Format lu par `build_xi_data.py` : 1re colonne = clé entre backticks ; 3e colonne = dossier entre backticks (relatif à `_facts/xi/`).
Un nouveau run = changer ce dossier (et `figures/…`), relancer le script (§6).

---

## 1. Protocole 1b — run long final (`results/protocol1b_pantheon_desi/`)

### 1.1 Fichiers et clés

| Fichier | Contenu | Utilisé pour |
|---|---|---|
| `final_parameter_estimates.csv` | `model,parameter,median,plus,minus,unit` — **valeurs de référence** des paramètres | tous les paramètres (`H0`, `Omega_m`, `w0`, `wa`, `w0_mean`, `eps`, `T_Gyr`, `phi0`) |
| `final_model_comparison.csv` | `model,chi2,k,aic,bic,delta_aic` | χ², k, AIC, BIC, ΔAIC |
| `summary_protocol1b_combined.txt` | en-tête **en français** (`SNe utilisées`, `BAO utilisées`, `rd fixé`, `Quick mode: False` ; pas de ligne `N total`), `acceptance =` par modèle, bloc « Comparaison AIC/BIC », `eps/sigma` | N (SNe, BAO), r_d, taux d'acceptation LCDM/CPL |
| `run_100000_96.tail.log` | **400 dernières lignes** du journal : barre de progression `100000/100000`, `échantillons conservés = 7680000`, `acceptance fraction moyenne = 0.180`, `autocorr time tau = [...]` (Ξosc), tableau de comparaison | pas, échantillons conservés, τ de Ξosc, acceptation Ξosc |
| `final_model_comparison.md` | idem csv + `eps/sigma ≈ 2.26` | contrôle croisé |
| `../../docs/reproducibility.md` | commande exacte du run (`--nsteps 100000 --burn-in 20000 --nwalkers 96`), critère `N/50 > τ_max`, `τ_max ≈ 1504` | burn-in, walkers |
| `../../reports/latex/main.tex` | rapport (mai 2026) : 1701 SNe avant coupure, plage `z ∈ [0.01016, 2.26137]` | N avant coupure, plage de z |
| `../../MANIFEST.md` | tailles des chaînes `.npy` (« exclu (.npy, 368.6 Mo) ») | page `reproducibility/outputs` |

### 1.2 Chiffres clés

| Chiffre | Valeur | Fichier · emplacement |
|---|---|---|
| SNe utilisées (z > 0.01) | 1590 | `summary…txt` · `SNe utilisées` |
| SNe avant coupure | 1701 | `main.tex` · § Pantheon+SH0ES (« sur un total initial de 1701 ») |
| Plage de z des SNe | 0.01016 → 2.26137 | `main.tex` · § Pantheon+SH0ES |
| Mesures BAO | 13 | `summary…txt` · `BAO utilisées` |
| N total (AIC/BIC) | 1603 | `main.tex` (« 1590 + 13 = 1603 ») ; = SNe + BAO du résumé (contrôlé par le script) |
| r_d fixé | 147.09 Mpc | `summary…txt` · `rd fixé` |
| Pas · burn-in · walkers | 100 000 · 20 000 · 96 | `docs/reproducibility.md` (commande) ; barre `100000/100000` du log |
| Échantillons conservés (par modèle) | 7 680 000 (= 96 × 80 000) | `run…tail.log` · `échantillons conservés` (Ξosc) ; dérivé pour LCDM/CPL |
| χ² / k / AIC / BIC / ΔAIC | CPL 1531.824/4/1539.824/1561.343/0 · Ξosc 1529.763/6/1541.763/1574.041/1.939 · ΛCDM 1554.165/2/1558.165/1568.924/18.341 | `final_model_comparison.csv` |
| ε | 0.184711 (+0.076844, −0.086663) | `final_parameter_estimates.csv` · `Xi_osc,eps` |
| σ_ε symétrisé | 0.0817535 = ½(plus+minus) | dérivé (même formule que `write_summary_txt`) ; `summary…txt` du run *quick* seulement donne la formule |
| ε/σ_ε | 2.259 (« ≈ 2.26 ») | dérivé ; `final_model_comparison.md` ; `main.tex` |
| T | 5.473208 (+3.595961, −2.222862) Gyr | `final_parameter_estimates.csv` · `Xi_osc,T_Gyr` |
| φ₀ | −0.090217 (+2.459786, −2.382394) | idem · `Xi_osc,phi0` |
| τ de Ξosc (H0, Om, w0_mean, eps, T, phi0) | 508.0 · 513.6 · 508.8 · 489.1 · **1503.8** · 1250.1 | `run…tail.log` · `autocorr time tau` |
| N/50 | 2000 (= 100 000/50) | dérivé ; `docs/reproducibility.md` |
| Acceptation | LCDM 0.7154 · CPL 0.5937 · Ξosc 0.1803 (log : 0.180) | `summary…txt` · `acceptance =` ; log (Ξosc) |
| Autres paramètres | H0, Ω_m (3 modèles) ; w0, wa (CPL) ; w0_mean (Ξosc) | `final_parameter_estimates.csv` |

---

## 2. Ambiguïtés et pièges relevés (à lire avant de citer un chiffre)

1. **Deux jeux de fichiers de résultats dans le pack.** `results/summary_protocol1b_combined.txt` et
   `results/model_comparison_combined.csv` (à la racine de `results/`) sont ceux d'un **run quick** (`Quick mode: True`,
   500 pas, 100 de burn-in, 32 walkers : ε = 0.118, ε/σ = 1.389, ΔAIC(Ξosc) = 3.548). Ils **ne doivent jamais être cités** ;
   la référence est le sous-dossier `protocol1b_pantheon_desi/`. Le script ne lit que ce dossier.
2. **`summary…txt` du run final ≠ `final_parameter_estimates.csv`** pour LCDM et CPL (ex. CPL w0 = −0.950887 vs −0.952521 ;
   wa = −1.195742 vs −1.182916 ; LCDM H0 = 73.860207 vs 73.861155). Les deux fichiers sont du run final (Ξosc identique au
   chiffre près, χ² identiques) ; l'écart vient d'un post-traitement différent (non documenté). **Choix** : le CSV (c'est lui
   que reprennent `xi_cosmo/results.py` et le rapport).
3. **Taux d'acceptation de CPL** : 0.5937 (`summary…txt`) contre « ∼0.575 » dans `main.tex` (tableau de convergence). On publie
   0.5937. Le rapport donne aussi τ_max ∼33 (LCDM) et ∼60 (CPL) : **absents de tout fichier de sortie** (le log est tronqué
   et ne contient que Ξosc) → non publiés.
4. **Journal tronqué** (400 dernières lignes) : pas de τ pour LCDM/CPL, pas de nombre de pas lu directement sauf la barre
   de progression de Ξosc. Les pas/burn-in/walkers viennent de la commande consignée dans `docs/reproducibility.md`.
5. **Encodage** : le log est en cp437/cp1252 (« échantillons » → `Úchantillons`) ; le script extrait par motifs sans accents.
6. **Protocole 1 : aucun chiffre** (pas de résumé, pas de CSV) — seulement 3 corner plots (`corner_LCDM/CPL/Xi_osc.png`).
   Les réglages de ce run (pas, walkers, covariance utilisée — elle est optionnelle dans `xi_protocol1_run.py`) ne sont pas dans le pack.
7. **`corner_CPL_combined.png` absent du pack** (le README des figures et le rapport le listent) : pas de corner plot CPL du run final.
8. **Figures** : titres et axes en **français** (`Équation d'état reconstruite…`, `Résidus BAO normalisés…`) ; légendes décrites en anglais dans les pages.
9. **`chi2_min` n'est pas un minimum exact** : c'est −2 × ln p maximal parmi les échantillons de la chaîne (`run_mcmc`,
   `chi2_min = -2.0 * float(logp[best_idx])`). Pour Ξosc, ε est borné par le prior (0 < ε < 0.3) et le postérieur de ε, T
   s'accumule aux bornes : χ², AIC et BIC de Ξosc sont donc des *approximations par le meilleur échantillon*.
10. **Pas de paramètre de nuisance** (pas de M / offset) dans le code : `MU_SH0ES` est ajusté directement. La page
    `inference/priors.mdx` (existante, hors périmètre des stubs) mentionne « `M` or offset » et des bornes `VERIFY_MIN` : à corriger (voir §3).
11. **Valeurs écrites en dur dans le code ξ** : `xi_cosmo/results.py` (`FINAL_PARAMETER_ESTIMATES`) recopie le CSV ; identiques aujourd'hui (vérifié), mais elles dériveront au prochain run.

---

## 3. Valeurs de configuration lues dans le code (hors `_facts/`) — à exporter au prochain pack

Le pack ne contient pas `src/`. Ces constantes (non des *résultats*) sont citées dans les pages avec leur fichier ;
`build_xi_data.py` les porte dans `facts.json` sous `config`, avec la même provenance. **Dépôt `xi-dark-energy-bao-mcmc` @ `25ed86e`.**

| Constante | Valeur | Fichier · fonction |
|---|---|---|
| Coupure SNe | z > 0.01 | `src/xi_protocol1b_bao_run.py` · `load_pantheon_data(zcut=0.01)` |
| Vitesse de la lumière | 299 792.458 km/s | idem · `C_LIGHT` |
| Priors (top-hat) ΛCDM | 50 < H0 < 100 · 0.1 < Ωm < 0.5 | idem · `log_prior` |
| Priors CPL | + −2 < w0 < 0 · −3 < wa < 2 | idem |
| Priors Ξosc | −1.5 < w0_mean < −0.5 · **0 < ε < 0.3** · 1 < T < 10 Gyr · −π < φ0 < π | idem |
| Départ des walkers | boule gaussienne, 1 % relatif, autour de (H0, Ωm) = (70, 0.3) ; CPL (w0, wa) = (−1, 0) ; Ξosc (w0_mean, ε, T, φ0) = (−1, 0.1, 2.8, 0) | idem · `model_setup`, `make_initial_walkers` |
| Modes | `--quick` 500 pas / burn-in 100 ; défaut 5000 / 1000 ; walkers 32 | idem · `main`, `parse_args` |
| Grille de distances | 3000 points, intégration trapézoïdale | idem · `distance_grids(ngrid=3000)` |
| Cosmologie de référence du temps t(z) de Ξosc | ΛCDM plat, H0 = 70, Ωm = 0.3, T_CMB = 2.725 K (`astropy`) | idem · `XiOscillator` |
| Critère de convergence | N/50 > τ_max | `src/xi_cosmo/diagnostics.py` · `convergence_flag` |

---

## 4. Ce qui n'est pas dans le pack (donc non publié)

Les valeurs individuelles des 13 mesures DESI DR2 (z, type, valeur) et la taille de leur covariance ; la liste des traceurs ;
la forme de la matrice de covariance Pantheon+ au-delà de « 1590 × 1590 » (déduit de la coupure) ; les temps de calcul du
run hors barre de progression de Ξosc ; la version des paquets du run ; le protocole 1 (chiffres).

## 5. Décisions éditoriales ξ

- Résultat présenté comme **exploratoire** (v0.1.0) ; jamais « détection » ; ε/σ ≈ 2.3 est un indicateur descriptif (prior borné).
- Protocole 1b en tête, protocole 1 en comparaison *qualitative* (figures).
- Le run *quick* n'est jamais cité.

## 6. Procédure « nouveau run » ξ

1. Exporter le nouveau pack dans `_facts/xi/` (dossier de résultats, journal complet si possible, CSV, `src/` pour §3).
2. Changer le dossier dans le registre ci-dessus (colonne 3) ; mettre à jour §1.2 et §2.
3. `python3 scripts/build_xi_data.py --summary` puis `--check`.
4. docs-verify (pages `xi-dark-energy/…`), puis relire la prose qualitative (« CPL est préféré par l'AIC » etc.) : les composants et `<Fact/>` se mettent à jour seuls, pas les phrases.
