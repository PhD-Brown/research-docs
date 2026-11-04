// src/components/ClassDistribution.jsx
// Répartition STAR / GALAXY / QSO du jeu dimred (class_counts du run PCA, runs.json) ; le rapport d'erreur
// QSO/STAR vient du run autoencodeur de même génération (médianes, mse_by_class).
//
// Usage :
//   <ClassDistribution />                              // runs de référence 'pca' et 'autoencoder'
//   <ClassDistribution run="phy3500_pca_run_…" aeRun="phy3500_autoencoder_run_…" />

import React from 'react';
import { resolveRun, ratio } from '@site/src/data/astrospectro';

function classesOf(run, ae) {
  const cc = run.class_counts;
  const total = Object.values(cc).reduce((s, x) => s + x, 0);
  const pct = (n) => Number(((n / total) * 100).toFixed(2));
  const byClass = ae && ae.generation === run.generation ? ae.metrics.mse_by_class : null;
  const qsoNote = byClass && byClass.QSO && byClass.STAR
    ? `Median reconstruction error ×${ratio(byClass.QSO.median, byClass.STAR.median).replace('×', '')} vs stars (autoencoder)`
    : 'Too rare for clustering';
  return [
    { label: 'Stars',    count: cc.STAR,   pct: pct(cc.STAR),   color: '#38BDF8', icon: '★', note: 'Main population — all analyses' },
    { label: 'Galaxies', count: cc.GALAXY, pct: pct(cc.GALAXY), color: '#A78BFA', icon: '◎', note: 'Too rare — excluded from HDBSCAN clustering' },
    { label: 'QSO',      count: cc.QSO,    pct: pct(cc.QSO),    color: '#FB923C', icon: '◉', note: qsoNote },
  ];
}

function fmt(n) { return n.toLocaleString('en-US'); }

export default function ClassDistribution({ run: runProp, aeRun }) {
  const CLASSES = classesOf(resolveRun(runProp, 'pca'), resolveRun(aeRun, 'autoencoder'));
  const [hoveredIdx, setHoveredIdx] = React.useState(null);

  return (
    <div style={{ margin: '24px 0' }}>
      <div style={{ display: 'flex', height: '52px', borderRadius: '10px', overflow: 'hidden', marginBottom: '18px', boxShadow: '0 2px 16px rgba(0,0,0,0.2)' }}>
        {CLASSES.map((c, i) => (
          <div key={c.label} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} title={`${c.label}: ${fmt(c.count)} spectra (${c.pct}%)`}
            style={{ flex: i === 0 ? `0 0 calc(${c.pct}% - 8px)` : '0 0 8px', minWidth: i === 0 ? undefined : '8px', background: i === 0 ? `linear-gradient(135deg, ${c.color}dd, ${c.color})` : c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', filter: hoveredIdx === i ? 'brightness(1.15)' : 'brightness(1)', transition: 'filter 0.15s ease', cursor: 'default', position: 'relative' }}>
            {i === 0 && (<span style={{ color: '#0a0a0a', fontWeight: '800', fontSize: '15px', fontFamily: "'JetBrains Mono', 'Fira Code', monospace", letterSpacing: '-0.3px', userSelect: 'none' }}>{CLASSES[0].pct}% stars</span>)}
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
        {CLASSES.map((c, i) => (
          <div key={c.label} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}
            style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', padding: '12px 14px', background: hoveredIdx === i ? `${c.color}0f` : 'var(--ifm-card-background-color)', border: `1px solid ${hoveredIdx === i ? c.color + '44' : c.color + '22'}`, borderLeft: `3px solid ${c.color}`, borderRadius: '8px', transition: 'background 0.15s, border-color 0.15s', cursor: 'default' }}>
            <div style={{ fontSize: '20px', lineHeight: 1, color: c.color, flexShrink: 0, marginTop: '1px' }}>{c.icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '8px', marginBottom: '3px' }}>
                <span style={{ fontWeight: '700', fontSize: '14px', color: c.color }}>{c.label}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: '700', color: 'var(--ifm-font-color-base)', whiteSpace: 'nowrap' }}>
                  {fmt(c.count)}<span style={{ fontSize: '11px', fontWeight: '400', opacity: 0.6, marginLeft: '4px' }}>({c.pct}%)</span>
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--ifm-font-color-base)', opacity: 0.55, lineHeight: 1.4 }}>{c.note}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
