// src/components/xi/ParameterTable.jsx — médiane (+ −) 16–84 % des paramètres d'un ou de tous les modèles.
// Props : protocol (défaut 'protocol1b'), model ('LCDM' | 'CPL' | 'Xi_osc' ; omis = les trois).
import React from 'react';
import { getProtocol, MODELS, MODEL_DISPLAY, PARAM_DISPLAY, fmt } from '@site/src/data/xi';
import { s } from './styles';

export default function ParameterTable({ protocol = 'protocol1b', model }) {
  const p = getProtocol(protocol);
  const rows = [];
  (model ? [model] : MODELS).forEach((m) => {
    Object.entries(p.models[m].params).forEach(([name, v]) => rows.push({ m, name, ...v }));
  });
  return (
    <div style={s.wrap}>
      <table style={s.table}>
        <thead><tr>{['Model', 'Parameter', 'Median', '+1σ', '−1σ', 'Unit'].map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={`${r.m}-${r.name}`}>
              <td style={s.tdText}>{MODEL_DISPLAY[r.m]}</td>
              <td style={s.tdText}>{PARAM_DISPLAY[r.name] || r.name}</td>
              <td style={s.td}>{fmt.num(r.median, 3)}</td>
              <td style={s.td}>{fmt.signed(r.plus, 3)}</td>
              <td style={s.td}>{fmt.signed(-r.minus, 3)}</td>
              <td style={s.tdText}>{r.unit || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
