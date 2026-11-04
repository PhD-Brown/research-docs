// src/data/astrovision/index.js
// Accès aux chiffres AstroVision : facts.json est GÉNÉRÉ par scripts/build_astrovision_data.py
// (depuis _facts/astrovision/ et le registre de _facts/astrovision/FACTS_INDEX.md) — ne jamais l'éditer à la main.
// Les pages et composants ne codent aucun chiffre de résultat : ils lisent ce module.
//
//   import { getFact, fmt, CLASSES } from '@site/src/data/astrovision';
//   getFact('models.dinov2_ft.test.balanced_accuracy')   // 0.8389
//   fmt.pct(0.8389)                                       // '83.9%'
//   statusOf(k) : 'calculé' (fichier de _facts) | 'notebook' | 'figure' | 'code' (registre §3)

import data from './facts.json';

const MINUS = '−';
const isNum = (x) => typeof x === 'number' && Number.isFinite(x);

export const facts = data.facts;
export const CLASSES = data.classes; // [{index, slug, name, short}] — ordre Galaxy10 0–9

/** Valeur pointée ('models.fusion.test.accuracy'), undefined si absente. */
export function getFact(path) {
  return String(path || '')
    .split('.')
    .reduce((o, k) => (o == null ? undefined : o[k]), facts);
}

/** Comme getFact mais échoue au build si la clé est introuvable (jamais de valeur fausse affichée). */
export function requireFact(path) {
  const v = getFact(path);
  if (v === undefined || v === null || typeof v === 'object') {
    throw new Error(`[astrovision] clé « ${path} » introuvable (ou non scalaire) dans facts.json`);
  }
  return v;
}

export const sourceOf = (path) => data.sources[path];
export const statusOf = (path) => data.status[path];

/** Statuts des clés commençant par l'un des préfixes (tous si la liste est vide). */
export function statusesFor(prefixes = []) {
  const keys = Object.keys(data.status);
  const sel = prefixes.length ? keys.filter((k) => prefixes.some((p) => k === p || k.startsWith(p + '.'))) : keys;
  const out = {};
  sel.forEach((k) => {
    out[data.status[k]] = (out[data.status[k]] || 0) + 1;
  });
  return out;
}

/** Remplace {slug} dans un modèle de clé ('models.fusion.recall.{slug}'). */
export const forClass = (template, cls) => template.replace('{slug}', cls.slug);

export const fmt = {
  /** 0.8389 → '83.9%' */
  pct: (x, d = 1) => (isNum(x) ? `${(x * 100).toFixed(d)}%` : '—'),
  /** valeur déjà en % : 13.2 → '13.2%' */
  pctRaw: (x, d = 1) => (isNum(x) ? `${x.toFixed(d)}%` : '—'),
  /** 0.8389 → '0.839' */
  num: (x, d = 3) => (isNum(x) ? x.toFixed(d).replace('-', MINUS) : '—'),
  /** −0.045 → '−0.045' ; 0.07 → '+0.070' */
  signed: (x, d = 3) => (isNum(x) ? `${x < 0 ? MINUS : '+'}${Math.abs(x).toFixed(d)}` : '—'),
  /** 17736 → '17,736' */
  int: (x) => (isNum(x) ? Math.round(x).toLocaleString('en-US') : '—'),
  /** 5e-6 → '5 × 10⁻⁶' */
  sci: (x, d = 0) => {
    if (!isNum(x)) return '—';
    const [m, e] = x.toExponential(d).split('e');
    const sup = String(parseInt(e, 10)).replace('-', '⁻').replace(/\d/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]);
    return `${m} × 10${sup}`;
  },
  /** 86.6 → '86.6' */
  raw: (x) => (x === undefined || x === null ? '—' : String(x)),
};

/** Applique un format nommé ('pct', 'num', 'int', 'sci', 'signed', 'pctRaw', 'raw'). */
export function format(value, f = 'raw', digits) {
  const fn = fmt[f];
  if (!fn) throw new Error(`[astrovision] format inconnu « ${f} »`);
  return digits !== undefined ? fn(value, digits) : fn(value);
}
