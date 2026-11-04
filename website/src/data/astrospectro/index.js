// src/data/astrospectro/index.js
// Accès aux runs AstroSpectro générés par scripts/build_runs_data.py (→ runs.json).
// Ne jamais éditer runs.json à la main : mettre à jour _facts/ et le registre de FACTS_INDEX.md,
// puis relancer `python3 scripts/build_runs_data.py`.
//
// Usage dans un composant :
//   import { getReferenceRun, fmt, generationLabel } from '@site/src/data/astrospectro';
//   const run = getReferenceRun('classifier');            // clé du registre (FACTS_INDEX.md)
//   fmt.pct(run.metrics.balanced_accuracy)                 // '89.2%'
//
// Clés du registre : classifier · classifier_validation · pca · umap_tsne · autoencoder · shap · validation

import data from './runs.json';

export const runs = data.runs;
export const registry = data.registry;
export const generations = data.generations;

/** Run par identifiant (`20260522T161236Z`, `phy3500_pca_run_…`, `shap/…`). Lève une erreur si absent. */
export function getRun(id) {
  const run = data.runs[id];
  if (!run) throw new Error(`[astrospectro data] run inconnu : ${id} — relancer scripts/build_runs_data.py ?`);
  return run;
}

/** Tous les runs de référence d'une clé du registre (le premier est le run principal). */
export function getReferenceRuns(role) {
  const entry = data.registry[role];
  if (!entry) throw new Error(`[astrospectro data] clé de registre inconnue : ${role}`);
  return entry.runs.map(getRun);
}

/** Run de référence principal d'une clé du registre. */
export function getReferenceRun(role) {
  return getReferenceRuns(role)[0];
}

/** Runs filtrés : findRuns({ kind: 'shap', generation: 'G1' }). Ordre de runs.json (classifieurs par date). */
export function findRuns(filter = {}) {
  return Object.values(data.runs).filter((r) => Object.entries(filter).every(([k, v]) => r[k] === v));
}

/**
 * Run SHAP à associer à une génération (règle 2 : ne pas mélanger G1 et G2 dans un bloc) :
 * le SHAP de référence s'il est de cette génération, sinon le SHAP de cette génération dont le modèle
 * analysé est identifié (`model_run`).
 */
export function shapRunFor(generation) {
  const ref = getReferenceRun('shap');
  if (ref.generation === generation) return ref;
  return findRuns({ kind: 'shap', generation }).find((r) => r.model_run) || null;
}

/** Accepte un run, un identifiant ou une clé de registre ; défaut = `fallbackRole`. */
export function resolveRun(runOrId, fallbackRole) {
  if (runOrId && typeof runOrId === 'object') return runOrId;
  if (typeof runOrId === 'string') return data.registry[runOrId] ? getReferenceRun(runOrId) : getRun(runOrId);
  return getReferenceRun(fallbackRole);
}

// ─── formatage (anglais : pages du site en anglais) ─────────────────────────

const isNum = (x) => typeof x === 'number' && Number.isFinite(x);
const MINUS = '−';

export const fmt = {
  /** 0.8919 → '89.2%' */
  pct(x, digits = 1) {
    return isNum(x) ? `${(x * 100).toFixed(digits)}%` : '—';
  },
  /** valeur déjà en % : 6.1438 → '6.14%' */
  pctRaw(x, digits = 1) {
    return isNum(x) ? `${x.toFixed(digits)}%` : '—';
  },
  /** 0.98572 → '0.986' */
  num(x, digits = 3) {
    return isNum(x) ? x.toFixed(digits).replace('-', MINUS) : '—';
  },
  /** 0.8311 → '+0.831' ; −0.548 → '−0.548' */
  signed(x, digits = 3) {
    if (!isNum(x)) return '—';
    const s = Math.abs(x).toFixed(digits);
    return `${x < 0 ? MINUS : '+'}${s}`;
  },
  /** 349998 → '349,998' */
  int(n) {
    return isNum(n) ? Math.round(n).toLocaleString('en-US') : '—';
  },
  /** 0.00047 → '4.7×10⁻⁴' */
  sci(x, digits = 1) {
    if (!isNum(x) || x === 0) return isNum(x) ? '0' : '—';
    const e = Math.floor(Math.log10(Math.abs(x)));
    const m = x / 10 ** e;
    const sup = String(e).replace('-', '⁻').replace(/\d/g, (d) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
    return `${m.toFixed(digits)}×10${sup}`;
  },
  /** 40.13 → '40.1 s' */
  seconds(x, digits = 1) {
    return isNum(x) ? `${x.toFixed(digits)} s` : '—';
  },
  /** '20260522T161236Z' → '2026-05-22 16:12:36 UTC' */
  date(run) {
    const d = run && run.date;
    return d ? d.replace('T', ' ').replace('Z', ' UTC') : '—';
  },
};

/**
 * Nom lisible d'une feature du pipeline :
 * 'feature_Mg_b_eq_width' → 'Mg b EW' · 'feature_index_CaH2' → 'CaH2 index' · 'M_G' → 'M_G'.
 */
export function prettyFeature(name) {
  let s = String(name || '').replace(/^num__/, '');
  if (!s.startsWith('feature_')) return s;
  s = s.replace(/^feature_/, '');
  let suffix = '';
  if (s.endsWith('_eq_width')) { s = s.slice(0, -'_eq_width'.length); suffix = ' EW'; }
  else if (s.endsWith('_index') && s.startsWith('index_')) { s = s.slice('index_'.length, -'_index'.length); suffix = ' index'; }
  else if (s.startsWith('index_')) { s = s.slice('index_'.length); suffix = ' index'; }
  return s.replace(/_/g, ' ') + suffix;
}

/** Familles de descripteurs (ordre d'affichage) — clés stables utilisées par les composants PCA. */
export const FEATURE_FAMILIES = [
  { key: 'balmer',    label: 'Balmer lines',    short: 'Balmer (H)',    sub: 'H α–θ',           color: '#60A5FA' },
  { key: 'caii',      label: 'Ionised calcium', short: 'Ca II',         sub: 'Ca II H&K + IR',  color: '#C084FC' },
  { key: 'fe',        label: 'Iron & metals',   short: 'Iron & metals', sub: 'Fe, Cr, V, Ni…',  color: '#FB923C' },
  { key: 'mg',        label: 'Magnesium / α',   short: 'Mg / α',        sub: 'Mg b, [Mg/Fe]',   color: '#34D399' },
  { key: 'lick',      label: 'Lick indices',    short: 'Lick/SDSS',     sub: 'Lick IDS, SDSS',  color: '#FBBF24' },
  { key: 'continuum', label: 'Continuum',       short: 'Continuum',     sub: 'slopes, colours', color: '#F87171' },
  { key: 'other',     label: 'Other',           short: 'Other',         sub: '—',               color: '#94A3B8' },
];

/** Famille d'une feature d'après son nom (heuristique sur la nomenclature du pipeline). */
export function featureFamily(name) {
  const s = String(name || '').replace(/^num__/, '').replace(/^feature_/, '');
  if (/^(H(α|β|γ|δ|ε|alpha|beta|gamma|delta|epsilon|zeta|eta|theta)|H\d+_|balmer)/i.test(s) || /^index_Hbeta|Balmer/i.test(s)) return 'balmer';
  if (/CaII|Ca_II|CaH\d|CaK|CaHK/i.test(s)) return 'caii';
  if (/(^|_)Mg|alpha/i.test(s)) return 'mg';
  if (/(^|_)(Fe|Cr|V|Ni|Ti|Co|Mn)(_|\d)|metal|iron|FeH/i.test(s)) return 'fe';
  if (/continuum|slope|flux_ratio|synthetic|UV_|color|asymmetry|curvature|break|jump/i.test(s)) return 'continuum';
  if (/^index_|lick/i.test(s)) return 'lick';
  return 'other';
}

/**
 * Part de chaque famille dans Σ|loading| des loadings fournis (top-10 exportés par le pipeline) :
 * [{ key, label, short, sub, color, pct }] en %, familles absentes incluses à 0.
 */
export function familyShares(loadings) {
  const tot = (loadings || []).reduce((s, l) => s + Math.abs(l.loading), 0) || 1;
  return FEATURE_FAMILIES.map((f) => ({
    ...f,
    pct: Number(((loadings || []).filter((l) => featureFamily(l.feature) === f.key).reduce((s, l) => s + Math.abs(l.loading), 0) / tot * 100).toFixed(1)),
  })).filter((f) => f.key !== 'other' || f.pct > 0);
}

/** Ratio a/b arrondi : 0.954/0.227 → '4.2×'. */
export function ratio(a, b, digits = 1) {
  return isNum(a) && isNum(b) && b !== 0 ? `${(a / b).toFixed(digits)}×` : '—';
}

/** Moyenne d'une liste de nombres (valeurs non numériques ignorées). */
export function mean(xs) {
  const v = (xs || []).filter(isNum);
  return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null;
}

// ─── étiquettes éditoriales (CLAUDE.md, décisions 1, 1b et 2) ───────────────

/**
 * Étiquette de génération.
 * - run dimred G1 ou chaîne 'G1' → 'PHY-3500 · G1 · 43,019 spectra' (étiquette obligatoire, décision n° 2) ;
 * - run classifieur → '<génération> · <N traités> spectra' (ex. 'G2 · 349,998 spectra', 'G1 · 99,999 spectra') ;
 * - chaîne 'G2' → 'G2 · 349,998 spectra'.
 */
export function generationLabel(genOrRun) {
  const run = typeof genOrRun === 'object' ? genOrRun : null;
  const gen = run ? run.generation : genOrRun;
  const g = data.generations[gen];
  if (!g) return '';
  let n = g.n;
  if (run && run.kind === 'classifier') n = run.n && run.n.processed;
  else if (run && typeof run.n === 'number') n = run.n;
  const label = `${fmt.int(n)} spectra`;
  return gen === 'G1' && !(run && run.kind === 'classifier') ? `PHY-3500 · G1 · ${label}` : `${gen} · ${label}`;
}

/** Libellé court d'un classifieur : 'v6' pour 'ST_350k_xgb_AFGKM_v6'. */
export function shortName(run) {
  const m = run && run.label && run.label.match(/_(v\d+)$/);
  return m ? m[1] : (run && (run.label || run.id)) || '';
}

/**
 * Mention courte de fuite Gaia (FACTS_INDEX §1.1) ou null si le run n'en a pas.
 * → 'v6 · includes 4 Gaia/photometric features — see Data Leakage Audit'
 */
export function leakNote(runOrId) {
  const run = resolveRun(runOrId, 'classifier');
  const gaia = run.features && run.features.gaia_photometric;
  const n = Array.isArray(gaia) ? gaia.length : gaia;
  if (!run.flags || !run.flags.gaia_leak || !n) return null;
  return `${shortName(run)} · includes ${n} Gaia/photometric feature${n > 1 ? 's' : ''} — see Data Leakage Audit`;
}

export const LEAK_AUDIT_PATH = '/docs/astrospectro/concepts/data-leakage-audit';
