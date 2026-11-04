// src/components/xi/PriorTable.jsx — bornes des priors top-hat (config du code, facts.json → config.priors).
// Props : models (liste de modèles, défaut les trois ; chaque paramètre n'apparaît qu'une fois, au 1er modèle qui le porte).
import React from 'react';
import { config, MODELS, MODEL_DISPLAY, PARAM_DISPLAY, getProtocol } from '@site/src/data/xi';
import { s } from './styles';

const bound = (x) => (typeof x === 'number' ? String(x).replace('-', '−') : x === 'pi' ? 'π' : x === '-pi' ? '−π' : String(x));

export default function PriorTable({ models = MODELS }) {
  const p = getProtocol();
  const seen = new Set();
  const rows = [];
  models.forEach((m) => {
    Object.entries(p.models[m].params).forEach(([name, v]) => {
      if (seen.has(name)) return;
      seen.add(name);
      const [lo, hi] = config.priors[name];
      rows.push({ m, name, lo, hi, unit: v.unit });
    });
  });
  return (
    <div style={s.wrap}>
      <table style={s.table}>
        <thead><tr>{['Parameter', 'First used in', 'Prior (uniform, open interval)', 'Unit'].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td style={s.tdText}>{PARAM_DISPLAY[r.name] || r.name}</td>
              <td style={s.tdText}>{MODEL_DISPLAY[r.m]}</td>
              <td style={s.td}>{bound(r.lo)} &lt; x &lt; {bound(r.hi)}</td>
              <td style={s.tdText}>{r.unit || (r.name === 'phi0' ? 'rad' : '—')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
