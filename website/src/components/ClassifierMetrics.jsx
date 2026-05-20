import React from 'react';

const METRICS = [
  { value: '87%',    label: 'Balanced accuracy',  sub: 'balanced accuracy · 5 classes',     color: '#34D399', symbol: 'BA',  detail: 'On types A, F, G, K, M' },
  { value: '96.3%',  label: 'Median confidence',  sub: 'predictions in UMAP space',          color: '#38BDF8', symbol: 'P',   detail: 'Probability of predicted class' },
  { value: '~0.964', label: 'ROC-AUC macro',      sub: 'global discriminability',            color: '#A78BFA', symbol: 'AUC', detail: 'Near-perfect · 1.000 = perfect' },
];

function MetricCard({ value, label, sub, color, symbol, detail }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ flex: 1, background: hov ? `${color}10` : 'var(--ifm-card-background-color)', border: `1px solid ${hov ? color + '55' : color + '25'}`, borderTop: `4px solid ${color}`, borderRadius: '12px', padding: '22px', textAlign: 'center', transition: 'all 0.15s', boxShadow: hov ? `0 8px 28px ${color}18` : 'none', cursor: 'default', position: 'relative', overflow: 'hidden', minWidth: 0 }}>
      <div style={{ position: 'absolute', top: '8px', right: '14px', fontFamily: "'JetBrains Mono', monospace", fontStyle: 'italic', fontSize: '13px', color: color, opacity: hov ? 0.45 : 0.2, transition: 'opacity 0.15s', userSelect: 'none' }}>{symbol}</div>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${color}10 0%, transparent 70%)`, opacity: hov ? 1 : 0, transition: 'opacity 0.2s', pointerEvents: 'none' }} />
      <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace", fontSize: '44px', fontWeight: '900', color: color, lineHeight: 1, marginBottom: '10px', letterSpacing: '-2px', position: 'relative' }}>{value}</div>
      <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--ifm-font-color-base)', marginBottom: '4px', position: 'relative' }}>{label}</div>
      <div style={{ fontSize: '11px', color: 'var(--ifm-font-color-base)', opacity: 0.5, marginBottom: '12px', position: 'relative' }}>{sub}</div>
      <div style={{ display: 'inline-block', background: `${color}12`, border: `1px solid ${color}30`, borderRadius: '12px', padding: '3px 12px', fontSize: '11px', color: color, opacity: 0.85, position: 'relative' }}>{detail}</div>
    </div>
  );
}

export default function ClassifierMetrics() {
  return (
    <div style={{ display: 'flex', gap: '14px', margin: '28px 0', flexWrap: 'wrap' }}>
      {METRICS.map((m) => <MetricCard key={m.label} {...m} />)}
    </div>
  );
}
