// src/components/TrainingConfig.jsx
// Configuration d'entraînement et hyperparamètres d'un run classifieur, lus dans runs.json.
// Correction (FACTS_INDEX §6) : l'ancienne version mêlait N = 43,019 (jeu dimred G1), le run
// 20260213T225019Z et les hyperparamètres de v6.
//
// Usage :
//   <TrainingConfig />                          // run de référence 'classifier' (registre FACTS_INDEX.md)
//   <TrainingConfig run="20260306T020848Z" />

import React from 'react';
import GaiaLeakNote from './GaiaLeakNote';
import { resolveRun, fmt } from '@site/src/data/astrospectro';

const HP_COLORS = ['#38BDF8', '#34D399', '#FBBF24', '#A78BFA', '#FB923C', '#F87171'];
const HP_KEYS = ['n_estimators', 'max_depth', 'learning_rate', 'colsample_bytree', 'subsample', 'tree_method'];

function configOf(run) {
  const f = run.features;
  const total = (run.n.train || 0) + (run.n.test || 0);
  return [
    { key: 'Dataset', value: 'LAMOST DR5 × Gaia DR3', sub: `N = ${fmt.int(run.n.processed)} spectra · ${run.generation}`, color: '#38BDF8', icon: '◎' },
    { key: 'Descriptors', value: String(f.used), sub: f.selected ? `selected from ${f.candidates} candidates` : `${f.candidates} candidates, no selection`, color: '#34D399', icon: 'p', mono: true },
    { key: 'Target classes', value: run.classes.join(' · '), sub: `${run.classes.length} stellar spectral types`, color: '#FBBF24', icon: '★' },
    { key: 'Metric', value: 'balanced_accuracy', sub: 'optimization & evaluation', color: '#A78BFA', icon: '≡', mono: true },
    { key: 'Split train/test', value: `${fmt.int(run.n.train)} / ${fmt.int(run.n.test)}`, sub: total ? `${Math.round((run.n.train / total) * 100)} / ${Math.round((run.n.test / total) * 100)} · stratified by class` : 'stratified by class', color: '#FB923C', icon: '⊘' },
  ];
}

function hyperparamsOf(run) {
  const hp = run.hyperparameters || {};
  return HP_KEYS.filter((k) => hp[k] !== undefined).map((k, i) => ({
    name: k, value: typeof hp[k] === 'string' ? `"${hp[k]}"` : String(hp[k]), color: HP_COLORS[i % HP_COLORS.length],
  }));
}

function ConfigRow({ k, value, sub, color, icon, mono }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: '36px 160px 1fr',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        background: hov ? `${color}09` : 'transparent',
        transition: 'background 0.12s',
        cursor: 'default',
      }}
    >
      {/* Icon */}
      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '6px',
        background: `${color}18`,
        border: `1px solid ${color}30`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'monospace',
        fontSize: '13px',
        fontWeight: '700',
        color: color,
        flexShrink: 0,
      }}>{icon}</div>

      {/* Key */}
      <div style={{
        fontSize: '12px',
        color: 'var(--ifm-font-color-base)',
        opacity: 0.6,
        fontWeight: '500',
      }}>{k}</div>

      {/* Value */}
      <div>
        <div style={{
          fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit',
          fontSize: mono ? '13px' : '14px',
          fontWeight: '700',
          color: hov ? color : 'var(--ifm-font-color-base)',
          transition: 'color 0.12s',
        }}>{value}</div>
        {sub && (
          <div style={{ fontSize: '10.5px', opacity: 0.45, color: 'var(--ifm-font-color-base)', marginTop: '1px' }}>
            {sub}
          </div>
        )}
      </div>
    </div>
  );
}

function HyperParam({ name, value, color }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '10px 12px',
        background: hov ? `${color}10` : `${color}06`,
        border: `1px solid ${hov ? color + '44' : color + '20'}`,
        borderRadius: '7px',
        transition: 'all 0.12s',
        cursor: 'default',
      }}
    >
      <div style={{
        fontFamily: 'monospace',
        fontSize: '10px',
        color: 'var(--ifm-font-color-base)',
        opacity: 0.5,
      }}>{name}</div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '16px',
        fontWeight: '800',
        color: color,
        lineHeight: 1,
      }}>{value}</div>
    </div>
  );
}

export default function TrainingConfig({ run: runProp }) {
  const run = resolveRun(runProp, 'classifier');
  const CONFIG = configOf(run);
  const HYPERPARAMS = hyperparamsOf(run);
  return (
    <div style={{ margin: '24px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>

      {/* Left: config */}
      <div style={{
        background: 'var(--ifm-card-background-color)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '10px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          fontSize: '11px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          opacity: 0.4,
          color: 'var(--ifm-font-color-base)',
        }}>Experimental configuration</div>

        {CONFIG.map((c) => <ConfigRow key={c.key} k={c.key} {...c} />)}
      </div>

      {/* Right: hyperparams */}
      <div style={{
        background: 'var(--ifm-card-background-color)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '10px',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          fontSize: '11px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          opacity: 0.4,
          color: 'var(--ifm-font-color-base)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>XGBoost hyperparameters</span>
          <span style={{ fontSize: '9px', opacity: 0.6, textTransform: 'none', letterSpacing: 0, fontWeight: '400', fontFamily: 'monospace' }}>
            run {run.id}
          </span>
        </div>

        <div style={{
          padding: '14px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
        }}>
          {HYPERPARAMS.map((p) => <HyperParam key={p.name} {...p} />)}
        </div>

        <div style={{
          padding: '10px 14px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          fontSize: '11px',
          opacity: 0.5,
          color: 'var(--ifm-font-color-base)',
          fontFamily: 'monospace',
        }}>
          Tuning with GridSearchCV · tree_method hist = GPU/CPU
        </div>
      </div>
      <div style={{ gridColumn: '1 / -1', marginTop: '-4px' }}>
        <GaiaLeakNote run={run} />
      </div>
    </div>
  );
}
