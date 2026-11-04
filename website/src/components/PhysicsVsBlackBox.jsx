// src/components/PhysicsVsBlackBox.jsx
// Onglets « approche physique vs boîte noire » + progression du classifieur. Les chiffres viennent de
// runs.json : run de référence 'classifier' pour la carte retenue, historique FACTS_INDEX §1.3 pour la
// progression. Retirés faute de source (FACTS_INDEX §6) : paliers 32 % / 50 % / 75 % / 84 %, « ~5 min ».
//
// Usage :
//   <PhysicsVsBlackBox />
//   <PhysicsVsBlackBox runs={['20260306T011253Z', '20260306T013341Z', '20260306T020848Z', 'classifier']} />

import React from 'react';
import GaiaLeakNote from './GaiaLeakNote';
import { resolveRun, getReferenceRun, fmt, shortName, generationLabel } from '@site/src/data/astrospectro';

export const DEFAULT_EVOLUTION = ['20260306T011253Z', '20260306T013341Z', '20260306T020848Z', 'classifier'];

function approachesOf(ref) {
  const f = ref.features;
  return [
    {
      name: 'Black Box (raw Deep Learning)',
      subtitle: 'Not retained for AstroSpectro',
      color: '#F87171',
      icon: '◻',
      adopted: false,
      pros: ['No prior knowledge required', 'Can capture unknown patterns'],
      cons: ['Millions of parameters to train', 'Requires ~10⁵–10⁶ annotated spectra', 'Results hard to validate physically', 'Sensitive to unmodelled instrumental noise', '"Why this type A?" — no answer'],
      example: 'CNN on the 3,921 raw flux channels',
    },
    {
      name: 'Physics-Informed + classical ML',
      subtitle: 'Retained approach — AstroSpectro V2',
      color: '#34D399',
      icon: '◆',
      adopted: true,
      pros: [`${f.used} interpretable features selected from ${f.candidates}`, 'SHAP validates decisions physically', `${fmt.int(ref.n.processed)} spectra — no need for millions`, 'Robust to noise (local features, not pixels)', 'Every decision explained in astrophysical terms', `${fmt.pct(ref.metrics.balanced_accuracy)} balanced accuracy (${shortName(ref)})`],
      cons: ['Astrophysical expertise required to define lines', 'May miss unknown patterns'],
      example: `XGBoost on ${f.used} selected features (W(Hα), Ca II prominence…)`,
    },
  ];
}

function evolutionOf(ids) {
  const ref = getReferenceRun('classifier');
  return ids.map((id, i) => {
    const run = resolveRun(id, 'classifier');
    const gaia = run.features.gaia_photometric.length;
    const current = run.id === ref.id;
    return {
      step: i + 1,
      label: `${shortName(run)} · ${fmt.int(run.n.processed)}`,
      acc: (run.metrics.balanced_accuracy * 100).toFixed(1),
      features: `${run.features.used} features${gaia ? ` · ${gaia} Gaia/phot.` : ''}`,
      model: run.model_type,
      color: current ? '#34D399' : '#F59E0B',
      note: `run ${run.id}`,
      warning: gaia ? '⚠ Gaia/photometric features' : null,
      current,
      run,
    };
  });
}

function ApproachCard({ name, subtitle, color, icon, adopted, pros, cons, example }) {
  return (
    <div style={{ flex: 1, background: adopted ? `${color}06` : 'rgba(255,255,255,0.02)', border: `2px solid ${adopted ? color + '40' : 'rgba(255,255,255,0.07)'}`, borderTop: `4px solid ${adopted ? color : 'rgba(248,113,113,0.4)'}`, borderRadius: '10px', padding: '20px', position: 'relative', minWidth: 0 }}>
      {adopted && (<div style={{ position: 'absolute', top: '-1px', right: '16px', background: color, color: '#000', fontSize: '9px', fontWeight: '800', padding: '2px 8px', borderRadius: '0 0 5px 5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>RETAINED</div>)}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontWeight: '800', fontSize: '14px', color: color, marginBottom: '3px', lineHeight: 1.3 }}>{name}</div>
        <div style={{ fontSize: '11px', opacity: 0.55, color: 'var(--ifm-font-color-base)', fontStyle: 'italic' }}>{subtitle}</div>
      </div>
      <div style={{ padding: '8px 12px', background: `${color}0c`, border: `1px solid ${color}25`, borderRadius: '6px', marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', opacity: 0.45, marginBottom: '3px', color: 'var(--ifm-font-color-base)' }}>Concrete example</div>
        <div style={{ fontFamily: 'monospace', fontSize: '11.5px', color: color, opacity: 0.85 }}>{example}</div>
      </div>
      <div style={{ marginBottom: '10px' }}>
        <div style={{ fontSize: '10px', fontWeight: '700', color: '#34D399', opacity: 0.8, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>✓ Advantages</div>
        {pros.map((p, i) => (<div key={i} style={{ display: 'flex', gap: '6px', fontSize: '11.5px', color: 'var(--ifm-font-color-base)', opacity: 0.75, lineHeight: 1.5, marginBottom: '3px' }}><span style={{ color: '#34D399', flexShrink: 0 }}>›</span>{p}</div>))}
      </div>
      <div>
        <div style={{ fontSize: '10px', fontWeight: '700', color: '#F87171', opacity: 0.7, marginBottom: '5px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>✗ Limitations</div>
        {cons.map((c, i) => (<div key={i} style={{ display: 'flex', gap: '6px', fontSize: '11.5px', color: 'var(--ifm-font-color-base)', opacity: 0.6, lineHeight: 1.5, marginBottom: '3px' }}><span style={{ color: '#F87171', flexShrink: 0 }}>›</span>{c}</div>))}
      </div>
    </div>
  );
}

function EvolutionStep({ step, label, acc, features, model, color, note, warning, current }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: 'grid', gridTemplateColumns: '32px 140px 60px 1fr 120px', alignItems: 'center', gap: '12px', padding: '10px 14px', background: hov ? `${color}0e` : current ? `${color}06` : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.04)', borderLeft: current ? `3px solid ${color}` : '3px solid transparent', transition: 'background 0.12s', cursor: 'default' }}>
      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: current ? color : `${color}30`, border: `2px solid ${color}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '800', color: current ? '#000' : color, flexShrink: 0 }}>{step}</div>
      <div style={{ fontSize: '12.5px', fontWeight: current ? '700' : '500', color: current ? color : 'var(--ifm-font-color-base)', lineHeight: 1.3 }}>
        {label}
        {warning && (<div style={{ fontSize: '10px', color: '#F59E0B', fontWeight: '400', marginTop: '1px' }}>{warning}</div>)}
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: '900', color: color, textAlign: 'center' }}>{acc}%</div>
      <div style={{ fontSize: '11.5px', color: 'var(--ifm-font-color-base)', opacity: 0.65 }}>{features}</div>
      <div>
        <div style={{ fontFamily: 'monospace', fontSize: '11px', color: color, opacity: 0.8 }}>{model}</div>
        <div style={{ fontSize: '10px', opacity: 0.45, marginTop: '1px', color: 'var(--ifm-font-color-base)' }}>{note}</div>
      </div>
    </div>
  );
}

export default function PhysicsVsBlackBox({ runs = DEFAULT_EVOLUTION }) {
  const [tab, setTab] = React.useState('approach');
  const ref = getReferenceRun('classifier');
  const APPROACHES = approachesOf(ref);
  const EVOLUTION = evolutionOf(runs);
  return (
    <div style={{ margin: '28px 0' }}>
      <div style={{ display: 'flex', gap: '4px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '0' }}>
        {[
          { id: 'approach',  label: 'Physics-Informed philosophy',  color: '#34D399' },
          { id: 'evolution', label: `Progression ${EVOLUTION[0].acc}% → ${EVOLUTION[EVOLUTION.length - 1].acc}%`, color: '#F59E0B' },
        ].map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? `${t.color}12` : 'transparent', border: 'none', borderBottom: `2px solid ${tab === t.id ? t.color : 'transparent'}`, padding: '9px 16px', cursor: 'pointer', fontSize: '12px', fontWeight: tab === t.id ? '700' : '400', color: tab === t.id ? t.color : 'var(--ifm-font-color-base)', opacity: tab === t.id ? 1 : 0.5, borderRadius: '5px 5px 0 0', marginBottom: '-1px', transition: 'all 0.13s' }}>{t.label}</button>
        ))}
      </div>

      <div style={{ background: 'var(--ifm-card-background-color)', border: '1px solid rgba(255,255,255,0.07)', borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '20px' }}>
        {tab === 'approach' && (<div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>{APPROACHES.map((a) => <ApproachCard key={a.name} {...a} />)}</div>)}
        <GaiaLeakNote run={ref} style={{ marginTop: '12px' }} />
        {tab === 'evolution' && (
          <>
            <div style={{ fontSize: '11px', opacity: 0.4, marginBottom: '14px', color: 'var(--ifm-font-color-base)' }}>Hover each step · ★ = current reference version</div>
            <div style={{ display: 'grid', gridTemplateColumns: '32px 140px 60px 1fr 120px', gap: '12px', padding: '4px 14px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              {['#', 'Step', 'BA', 'Features', 'Model'].map((h) => (<div key={h} style={{ fontSize: '9.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.35, color: 'var(--ifm-font-color-base)' }}>{h}</div>))}
            </div>
            {EVOLUTION.map((e) => <EvolutionStep key={e.step} {...e} run={undefined} />)}
            <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '7px', fontSize: '12px', color: 'var(--ifm-font-color-base)', opacity: 0.8 }}>
              <strong style={{ color: '#F87171' }}>Reading this table:</strong> balanced accuracy on each run's own test set ({generationLabel(ref)} for the reference run). Runs differ in sample size and feature set — not a controlled ablation.
            </div>
          </>
        )}
      </div>
    </div>
  );
}
