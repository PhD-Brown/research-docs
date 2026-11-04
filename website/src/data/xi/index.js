// src/data/xi/index.js
// Accès aux faits ξ Dark Energy générés par scripts/build_xi_data.py (→ facts.json).
// Ne jamais éditer facts.json à la main : mettre à jour _facts/xi/ et le registre de _facts/xi/FACTS_INDEX.md,
// puis relancer `python3 scripts/build_xi_data.py`.

import data from './facts.json';

export const facts = data;
export const config = data.config;
export const MODELS = ['LCDM', 'CPL', 'Xi_osc'];
export const MODEL_DISPLAY = { LCDM: 'ΛCDM', CPL: 'CPL', Xi_osc: 'Ξosc' };
export const PARAM_DISPLAY = {
  H0: 'H₀', Omega_m: 'Ωₘ', w0: 'w₀', wa: 'wₐ', w0_mean: 'w₀,mean', eps: 'ε', T_Gyr: 'T', phi0: 'φ₀',
};

/** Protocole par clé du registre (défaut : protocol1b). Lève une erreur s'il n'a pas de résultats chiffrés. */
export function getProtocol(key = 'protocol1b') {
  const p = data.protocols[key];
  if (!p) throw new Error(`[xi data] protocole sans résultats chiffrés : ${key} — voir _facts/xi/FACTS_INDEX.md`);
  return p;
}

/** Valeur par chemin pointé (tableaux : indices numériques). Lève une erreur si absente. */
export function resolve(path, protocol = 'protocol1b') {
  const root = String(path).startsWith('config.') ? data : getProtocol(protocol);
  const v = String(path).split('.').reduce((o, k) => (o == null ? undefined : o[k]), root);
  if (v === undefined || v === null) throw new Error(`[xi data] chemin introuvable : ${path}`);
  return v;
}

const isNum = (x) => typeof x === 'number' && Number.isFinite(x);
const MINUS = '−';

export const fmt = {
  num(x, digits = 3) { return isNum(x) ? x.toFixed(digits).replace('-', MINUS) : '—'; },
  signed(x, digits = 3) {
    if (!isNum(x)) return '—';
    return `${x < 0 ? MINUS : '+'}${Math.abs(x).toFixed(digits)}`;
  },
  int(n) { return isNum(n) ? Math.round(n).toLocaleString('en-US') : '—'; },
  sigma(x, digits = 2) { return isNum(x) ? `${x.toFixed(digits)}σ` : '—'; },
};

/** Libellé de contexte d'un protocole : '1,590 SNe + 13 BAO · 100,000 steps × 96 walkers'. */
export function runLabel(p) {
  return `${fmt.int(p.data.n_sne)} SNe + ${fmt.int(p.data.n_bao)} BAO · ${fmt.int(p.run.nsteps)} steps × ${fmt.int(p.run.nwalkers)} walkers`;
}

/** Modèles triés par AIC croissant. */
export function modelsByAic(p) {
  return MODELS.map((m) => ({ key: m, ...p.models[m] })).sort((a, b) => a.aic - b.aic);
}
