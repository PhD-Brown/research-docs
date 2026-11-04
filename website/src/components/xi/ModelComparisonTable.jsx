// src/components/xi/ModelComparisonTable.jsx — tableau χ² / k / AIC / BIC / ΔAIC (facts.json), trié par AIC.
// Props : protocol (défaut 'protocol1b'), withAcceptance (ajoute le taux d'acceptation).
import React from 'react';
import { getProtocol, modelsByAic, fmt, MODEL_DISPLAY } from '@site/src/data/xi';
import { s } from './styles';

export default function ModelComparisonTable({ protocol = 'protocol1b', withAcceptance = false }) {
  const p = getProtocol(protocol);
  const rows = modelsByAic(p);
  const head = ['Model', 'χ²', 'k', 'AIC', 'BIC', 'ΔAIC', ...(withAcceptance ? ['Acceptance'] : [])];
  return (
    <div style={s.wrap}>
      <table style={s.table}>
        <thead><tr>{head.map((h) => <th key={h} style={s.th}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.key} style={i === 0 ? s.best : undefined}>
              <td style={s.tdText}>{MODEL_DISPLAY[r.key]}</td>
              <td style={s.td}>{fmt.num(r.chi2, 3)}</td>
              <td style={s.td}>{r.k}</td>
              <td style={s.td}>{fmt.num(r.aic, 3)}</td>
              <td style={s.td}>{fmt.num(r.bic, 3)}</td>
              <td style={s.td}>{fmt.num(r.delta_aic, 3)}</td>
              {withAcceptance && <td style={s.td}>{fmt.num(r.acceptance, 3)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
