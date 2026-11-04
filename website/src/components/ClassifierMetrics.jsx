// src/components/ClassifierMetrics.jsx
// 3 cartes de métriques d'un run classifieur, lues dans runs.json (scripts/build_runs_data.py).
//
// Usage :
//   <ClassifierMetrics />                          // run de référence 'classifier' (registre FACTS_INDEX.md)
//   <ClassifierMetrics run="20260306T020848Z" />   // autre run (identifiant ou clé de registre)

import React from 'react';
import GaiaLeakNote from './GaiaLeakNote';
import { resolveRun, fmt, generationLabel } from '@site/src/data/astrospectro';

function metricsOf(run) {
  const m = run.metrics;
  const classes = (run.classes || []).join(', ');
  return [
    { value: fmt.pct(m.balanced_accuracy), label: 'Balanced accuracy', sub: `balanced accuracy · ${run.classes.length} classes`, color: '#34D399', symbol: 'BA',  detail: `On types ${classes}` },
    { value: fmt.num(m.f1_macro),          label: 'Macro F1',          sub: `test set · N = ${fmt.int(run.n.test)}`,               color: '#38BDF8', symbol: 'F1',  detail: `Accuracy ${fmt.pct(m.accuracy)}` },
    { value: fmt.num(m.roc_auc_macro),     label: 'ROC-AUC macro',     sub: 'global discriminability',                             color: '#A78BFA', symbol: 'AUC', detail: '1.000 = perfect' },
  ];
}

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

export default function ClassifierMetrics({ run: runProp }) {
  const run = resolveRun(runProp, 'classifier');
  return (
    <div style={{ margin: '28px 0' }}>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
        {metricsOf(run).map((m) => <MetricCard key={m.label} {...m} />)}
      </div>
      <div style={{ marginTop: '10px', fontSize: '11px', fontFamily: 'var(--ifm-font-family-monospace)', color: 'var(--ifm-font-color-base)', opacity: 0.6 }}>
        {run.label} · run {run.id} · {generationLabel(run)}
      </div>
      <GaiaLeakNote run={run} style={{ marginTop: '4px' }} />
    </div>
  );
}
