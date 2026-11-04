// src/components/DatasetStats.jsx
// Cartes du jeu de données dimred. N et p viennent du run PCA (runs.json) ; couverture et résolution sont
// des constantes de l'instrument LAMOST. Le rayon de cross-match Gaia n'a pas de source dans _facts
// (FACTS_INDEX §6) : la carte a été retirée.
//
// Usage :
//   <DatasetStats />                              // run PCA de référence (registre FACTS_INDEX.md)
//   <DatasetStats run="phy3500_pca_run_…" />

import React from 'react';
import { resolveRun, fmt, generationLabel } from '@site/src/data/astrospectro';

function statsOf(run) {
  return [
    { symbol: 'N', value: fmt.int(run.n),  label: 'Retained spectra',  sub: generationLabel(run),  color: '#F59E0B' },
    { symbol: 'p', value: String(run.p),   label: 'Features',          sub: 'pure spectroscopic',  color: '#38BDF8' },
    { symbol: 'λ', value: '3690–9100',     label: 'Spectral coverage', sub: 'Ångströms',           color: '#A78BFA' },
    { symbol: 'R', value: '≈ 1800',        label: 'Resolution',        sub: 'low resolution',      color: '#34D399' },
  ];
}

function StatCard({ symbol, value, label, sub, color }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ position: 'relative', background: 'var(--ifm-card-background-color)', border: `1px solid ${hovered ? color + '55' : color + '22'}`, borderTop: `3px solid ${color}`, borderRadius: '10px', padding: '18px 16px 14px', overflow: 'hidden', transition: 'transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease', transform: hovered ? 'translateY(-3px)' : 'translateY(0)', boxShadow: hovered ? `0 10px 28px ${color}20` : '0 2px 8px rgba(0,0,0,0.08)', cursor: 'default' }}>
      <div style={{ position: 'absolute', top: '10px', right: '14px', fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic', fontSize: '20px', color: color, opacity: hovered ? 0.55 : 0.3, transition: 'opacity 0.18s ease', userSelect: 'none', lineHeight: 1 }}>{symbol}</div>
      <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', 'Courier New', monospace", fontSize: '26px', fontWeight: '800', color: color, lineHeight: 1.05, marginBottom: '8px', letterSpacing: '-0.5px' }}>{value}</div>
      <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--ifm-font-color-base)', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: '11px', color: 'var(--ifm-font-color-base)', opacity: 0.5 }}>{sub}</div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${color}00, ${color}44, ${color}00)`, opacity: hovered ? 1 : 0, transition: 'opacity 0.18s ease' }} />
    </div>
  );
}

export default function DatasetStats({ run: runProp }) {
  const STATS = statsOf(resolveRun(runProp, 'pca'));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '12px', margin: '28px 0' }}>
      {STATS.map((s) => <StatCard key={s.label} {...s} />)}
    </div>
  );
}
