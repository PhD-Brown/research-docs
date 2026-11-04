// src/components/xi/KeyMetrics.jsx — cartes de résultats clés d'un protocole (valeurs lues dans facts.json).
// Props : protocol (défaut 'protocol1b').
import React from 'react';
import { getProtocol, fmt, MODEL_DISPLAY } from '@site/src/data/xi';
import { s } from './styles';

export default function KeyMetrics({ protocol = 'protocol1b' }) {
  const p = getProtocol(protocol);
  const best = p.ranking.best_aic;
  const xi = p.models.Xi_osc;
  const cards = [
    { v: fmt.num(p.models.LCDM.delta_aic, 1), l: 'ΔAIC of ΛCDM', c: `vs ${MODEL_DISPLAY[best]} (lowest AIC) · N = ${fmt.int(p.data.n_total)}` },
    { v: fmt.num(xi.delta_aic, 2), l: 'ΔAIC of Ξosc', c: `vs ${MODEL_DISPLAY[best]} · χ² lowest: ${MODEL_DISPLAY[p.ranking.lowest_chi2]}` },
    { v: fmt.num(p.eps.median, 3), l: 'Oscillation amplitude ε', c: `+${fmt.num(p.eps.plus, 3)} −${fmt.num(p.eps.minus, 3)} · prior 0 < ε < ${fmt.num(p.eps.prior_max, 1)}` },
    { v: fmt.sigma(p.eps.significance, 2), l: 'ε / σ_ε (symmetrised)', c: 'descriptive ratio, not a detection' },
  ];
  return (
    <div style={s.grid(200)}>
      {cards.map((c) => (
        <div key={c.l} style={s.card}>
          <div style={s.value}>{c.v}</div>
          <div style={s.label}>{c.l}</div>
          <div style={s.ctx}>{c.c}</div>
        </div>
      ))}
    </div>
  );
}
