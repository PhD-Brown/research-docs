// src/components/AEKeyMetrics.jsx
// 4 cartes clés de l'autoencodeur, lues dans le run de référence 'autoencoder' (runs.json).
// Le « 107× » de l'ancienne version n'avait pas de source (FACTS_INDEX §6) : la carte affiche désormais le
// rapport des médianes MSE(QSO)/MSE(STAR) du run.
//
// Usage :
//   <AEKeyMetrics />                                   // run de référence
//   <AEKeyMetrics run="phy3500_autoencoder_run_…" />

import React from 'react';
import { resolveRun, fmt, ratio } from '@site/src/data/astrospectro';

function metricsOf(run) {
  const m = run.metrics;
  const pcaK = Object.entries(m.pca_mse_by_k).map(([k, mse]) => ({ k: Number(k), mse }));
  const equiv = pcaK.reduce((b, p) => (Math.abs(p.mse - m.mse) < Math.abs(b.mse - m.mse) ? p : b), pcaK[0]);
  const gain = ((m.mse - m.pca_mse_2) / m.pca_mse_2) * 100;
  const byClass = m.mse_by_class;
  return [
    { value: fmt.num(m.mse),      label: 'Reconstruction MSE',      sub: `autoencoder z = 2 · N = ${fmt.int(run.n)}`,            color: '#34D399', detail: `vs PCA(z=2) = ${fmt.num(m.pca_mse_2)} · ${gain < 0 ? '−' : '+'}${Math.abs(gain).toFixed(1)}%`, symbol: 'MSE', highlight: true },
    { value: `≈ PCA@${equiv.k}`,  label: 'Compression equivalence', sub: `MSE(AE, z=2) ≈ MSE(PCA, k=${equiv.k})`,                 color: '#38BDF8', detail: `${equiv.k / 2}× fewer dimensions than PCA`, symbol: 'z=2' },
    { value: String(m.epochs),    label: 'Training epochs',         sub: `Best val loss = ${fmt.num(m.best_val_loss)} · ${m.fit_time_s.toFixed(1)} s`, color: '#F59E0B', detail: 'Early stopping', symbol: 'ep.' },
    { value: ratio(byClass.QSO.median, byClass.STAR.median), label: 'QSO vs star error', sub: 'MSE(QSO) / MSE(STAR) median', color: '#C084FC', detail: 'Unsupervised anomaly detection', symbol: '⚡' },
  ];
}

function MetricCard({ m }) {
  const [hov, setHov] = React.useState(false);
  return (
          <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ flex: 1, background: hov ? `${m.color}10` : m.highlight ? `${m.color}06` : 'var(--ifm-card-background-color)', border: `1px solid ${hov ? m.color + '55' : m.highlight ? m.color + '35' : m.color + '22'}`, borderTop: `4px solid ${m.color}`, borderRadius: '12px', padding: '20px', textAlign: 'center', transition: 'all 0.15s', boxShadow: hov ? `0 8px 24px ${m.color}18` : m.highlight ? `0 2px 12px ${m.color}12` : 'none', cursor: 'default', position: 'relative', overflow: 'hidden', minWidth: '160px' }}>
            <div style={{ position: 'absolute', top: '8px', right: '10px', fontFamily: 'monospace', fontSize: '11px', fontStyle: 'italic', color: m.color, opacity: hov ? 0.4 : 0.15, userSelect: 'none' }}>{m.symbol}</div>
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${m.color}12, transparent 70%)`, opacity: hov ? 1 : 0, transition: 'opacity 0.2s', pointerEvents: 'none' }} />
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '36px', fontWeight: '900', color: m.color, lineHeight: 1, marginBottom: '8px', letterSpacing: '-1px', position: 'relative' }}>{m.value}</div>
            <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--ifm-font-color-base)', marginBottom: '4px', position: 'relative' }}>{m.label}</div>
            <div style={{ fontSize: '11px', color: 'var(--ifm-font-color-base)', opacity: 0.5, marginBottom: '10px', position: 'relative' }}>{m.sub}</div>
            <div style={{ display: 'inline-block', background: `${m.color}14`, border: `1px solid ${m.color}30`, borderRadius: '12px', padding: '3px 10px', fontSize: '11px', color: m.color, opacity: 0.85, position: 'relative' }}>{m.detail}</div>
          </div>
  );
}

export default function AEKeyMetrics({ run }) {
  const METRICS = metricsOf(resolveRun(run, 'autoencoder'));
  return (
    <div style={{ display: 'flex', gap: '12px', margin: '28px 0', flexWrap: 'wrap' }}>
      {METRICS.map((m, i) => <MetricCard key={i} m={m} />)}
    </div>
  );
}
