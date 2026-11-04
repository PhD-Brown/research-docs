// src/components/PCAVarianceMilestones.jsx
// Jalons k → variance cumulée et MSE de reconstruction, lus dans le run PCA de référence (runs.json).
// Le pack n'exporte la MSE que pour k ≤ 50 et la variance cumulée que pour k ≤ 10 : au-delà, la variance
// affichée est le seuil (80/95/99 %) et la MSE « n/a » (l'ancienne version donnait « ~0.050 », « <0.010 »
// sans source, FACTS_INDEX §6).
//
// Usage :
//   <PCAVarianceMilestones />                            // run PCA de référence (registre FACTS_INDEX.md)
//   <PCAVarianceMilestones run="phy3500_pca_run_…" />

import React from 'react';
import { resolveRun } from '@site/src/data/astrospectro';

function milestonesOf(run) {
  const m = run.metrics;
  const nc = m.n_components_for_variance;
  const mse = (k) => (k <= m.reconstruction_mse.length ? m.reconstruction_mse[k - 1].toFixed(3) : 'n/a');
  const cum = (k) => Number((m.cumulative[k - 1] * 100).toFixed(1));
  return [
    { k: 2,             variance: cum(2),  mse: mse(2),             desc: 'PC1 + PC2 only — basic 2D visualisation.',                              color: '#64748B', highlight: false },
    { k: 10,            variance: cum(10), mse: mse(10),            desc: 'Captures about half of the variance.',                                  color: '#8B5CF6', highlight: false },
    { k: nc['80pct'],   variance: 80.0,    mse: mse(nc['80pct']),   desc: 'Fast analysis threshold — good speed/accuracy trade-off.',              color: '#F59E0B', highlight: false },
    { k: nc['95pct'],   variance: 95.0,    mse: mse(nc['95pct']),   desc: 'RETAINED THRESHOLD FOR UMAP/t-SNE — Captures the essential variance.', color: '#38BDF8', highlight: true  },
    { k: nc['99pct'],   variance: 99.0,    mse: mse(nc['99pct']),   desc: 'Near-total variance (includes residual noise).',                        color: '#10B981', highlight: false },
  ];
}

export default function PCAVarianceMilestones({ run }) {
  const milestones = milestonesOf(resolveRun(run, 'pca'));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '24px 0' }}>
      {milestones.map((item, index) => (
        <div key={item.k} style={{ display: 'flex', alignItems: 'center', background: item.highlight ? 'rgba(56, 189, 248, 0.05)' : 'var(--ifm-background-surface-color, #0a0c14)', border: `1px solid ${item.highlight ? item.color : 'rgba(255, 255, 255, 0.08)'}`, borderRadius: '8px', padding: '16px 20px', boxShadow: item.highlight ? `0 0 20px ${item.color}20` : 'none', position: 'relative', overflow: 'hidden', flexWrap: 'wrap', gap: '16px' }}>
          {item.highlight && (<div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: item.color, boxShadow: `0 0 10px ${item.color}` }}></div>)}

          <div style={{ minWidth: '70px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', opacity: 0.5, fontWeight: 'bold' }}>K =</div>
            <div style={{ fontSize: '24px', fontWeight: '900', color: item.highlight ? item.color : 'var(--ifm-font-color-base)' }}>{item.k}</div>
          </div>

          <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 'bold' }}>
              <span>Variance: {item.k > 10 ? '≥ ' : ''}{item.variance}%</span>
              <span style={{ opacity: 0.7, fontWeight: 'normal', fontFamily: 'monospace' }}>MSE: {item.mse}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${item.variance}%`, height: '100%', background: item.color, transition: 'width 1s ease-in-out' }}></div>
            </div>
          </div>

          <div style={{ flex: '2 1 250px', fontSize: '13.5px', color: item.highlight ? '#fff' : 'var(--ifm-font-color-base)', opacity: item.highlight ? 1 : 0.8, fontWeight: item.highlight ? '600' : '400', borderLeft: '1px solid rgba(255, 255, 255, 0.1)', paddingLeft: '16px' }}>
            {item.desc}
          </div>
        </div>
      ))}
    </div>
  );
}
