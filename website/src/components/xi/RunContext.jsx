// src/components/xi/RunContext.jsx — bandeau de contexte d'un protocole (équivalent léger de RunProvenance).
// Props : protocol (défaut 'protocol1b'). Valeurs lues dans facts.json.
import React from 'react';
import { getProtocol, fmt, config } from '@site/src/data/xi';
import { s } from './styles';

export default function RunContext({ protocol = 'protocol1b' }) {
  const p = getProtocol(protocol);
  const items = [
    ['Protocol', p.label],
    ['Data', `${fmt.int(p.data.n_sne)} SNe (z > ${config.z_cut}) + ${fmt.int(p.data.n_bao)} BAO · N = ${fmt.int(p.data.n_total)}`],
    ['Sampler', `emcee · ${fmt.int(p.run.nsteps)} steps × ${fmt.int(p.run.nwalkers)} walkers · burn-in ${fmt.int(p.run.burn_in)}`],
    ['Fixed', `r_d = ${p.data.rd_mpc} Mpc`],
    ['Status', 'v0.1.0 exploratory'],
  ];
  return (
    <div style={{ ...s.card, margin: '1rem 0' }}>
      {items.map(([k, v]) => (
        <div key={k} style={{ display: 'flex', gap: 12, padding: '3px 0', flexWrap: 'wrap' }}>
          <span style={{ minWidth: 80, color: 'var(--ifm-color-emphasis-700)', fontWeight: 600 }}>{k}</span>
          <span>{v}</span>
        </div>
      ))}
    </div>
  );
}
