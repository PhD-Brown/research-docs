// src/components/ProgressionPipeline.jsx
// Frise de progression du classifieur : chaque étape est un run enregistré de runs.json (balanced accuracy
// du test set). Remplace l'ancienne frise 32 % → 75–84 % → 87 % dont seul le dernier palier avait une
// source (FACTS_INDEX §6). Étapes par défaut : historique FACTS_INDEX §1.3 (v3, v5) puis le run de référence.
//
// Usage :
//   <ProgressionPipeline />
//   <ProgressionPipeline runs={['20260306T011253Z', '20260306T020848Z', 'classifier']} />

import React from 'react';
import GaiaLeakNote from './GaiaLeakNote';
import { resolveRun, getReferenceRun, fmt, shortName, generationLabel } from '@site/src/data/astrospectro';

export const DEFAULT_PROGRESSION = ['20260306T011253Z', '20260306T020848Z', 'classifier'];
const COLORS = ['#94A3B8', '#F59E0B', '#34D399', '#38BDF8'];

function stepsOf(ids) {
  const ref = getReferenceRun('classifier');
  return ids.map((id, i) => {
    const run = resolveRun(id, 'classifier');
    const gaia = run.features.gaia_photometric.length;
    const current = run.id === ref.id;
    return {
      step: i + 1,
      label: `${shortName(run)} · ${generationLabel(run)}`,
      accuracy: Number((run.metrics.balanced_accuracy * 100).toFixed(1)),
      model: run.model_type,
      mode: `${run.features.used} features${gaia ? ` · ${gaia} Gaia/phot.` : ''}`,
      modeColor: gaia ? '#F59E0B' : '#34D399',
      color: current ? '#34D399' : COLORS[i % COLORS.length],
      note: `run ${run.id}`,
      current,
      warning: gaia > 0,
      run,
    };
  });
}

function Step({ step, label, accuracy, model, mode, modeColor, color, note, current, warning }) {
  const [hov, setHov] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1,
        background: current
          ? `${color}0e`
          : hov ? 'rgba(255,255,255,0.03)' : 'var(--ifm-card-background-color)',
        border: `2px solid ${current ? color + '55' : hov ? color + '30' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '10px',
        padding: '18px',
        transition: 'all 0.15s',
        boxShadow: current ? `0 4px 20px ${color}18` : 'none',
        cursor: 'default',
        position: 'relative',
        minWidth: 0,
      }}
    >
      {current && (
        <div style={{
          position: 'absolute',
          top: '-1px',
          right: '14px',
          background: color,
          color: '#000',
          fontSize: '9px',
          fontWeight: '800',
          padding: '2px 8px',
          borderRadius: '0 0 5px 5px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}>CURRENT</div>
      )}

      <div style={{
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        background: color,
        color: '#000',
        fontWeight: '900',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '12px',
        boxShadow: `0 0 0 3px ${color}25`,
      }}>{step}</div>

      <div style={{
        fontWeight: '700',
        fontSize: '12px',
        color: 'var(--ifm-font-color-base)',
        opacity: 0.8,
        marginBottom: '8px',
        lineHeight: 1.3,
      }}>{label}</div>

      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '36px',
        fontWeight: '900',
        color: color,
        lineHeight: 1,
        marginBottom: '4px',
        letterSpacing: '-1px',
      }}>{accuracy}%</div>

      <div style={{
        height: '5px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '3px',
        marginBottom: '12px',
        overflow: 'hidden',
      }}>
        <div style={{
          width: `${typeof accuracy === 'string' ? 82 : accuracy}%`,
          height: '100%',
          background: color,
          borderRadius: '3px',
          opacity: 0.8,
        }} />
      </div>

      <div style={{
        fontSize: '12px',
        fontFamily: 'monospace',
        color: 'var(--ifm-font-color-base)',
        opacity: 0.7,
        marginBottom: '6px',
      }}>{model}</div>

      <div style={{
        display: 'inline-block',
        background: `${modeColor}15`,
        border: `1px solid ${modeColor}40`,
        borderRadius: '4px',
        padding: '2px 8px',
        fontSize: '10.5px',
        fontFamily: 'monospace',
        fontWeight: '700',
        color: modeColor,
        marginBottom: '8px',
      }}>{mode}</div>

      <div style={{
        fontSize: '11px',
        color: 'var(--ifm-font-color-base)',
        opacity: 0.5,
        lineHeight: 1.4,
        fontStyle: 'italic',
      }}>
        {warning && <span style={{ color: '#F59E0B' }}>⚠ </span>}
        {note}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: 'rgba(255,255,255,0.2)',
      fontSize: '20px',
      userSelect: 'none',
    }}>→</div>
  );
}

export default function ProgressionPipeline({ runs = DEFAULT_PROGRESSION }) {
  const STEPS = stepsOf(runs);
  const current = STEPS.find((s) => s.current) || STEPS[STEPS.length - 1];
  return (
    <div style={{ margin: '28px 0' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s.step}>
            <Step {...s} run={undefined} />
            {i < STEPS.length - 1 && <Arrow />}
          </React.Fragment>
        ))}
      </div>

      <div style={{
        marginTop: '14px',
        padding: '12px 16px',
        background: 'rgba(52,211,153,0.06)',
        border: '1px solid rgba(52,211,153,0.2)',
        borderRadius: '8px',
        fontSize: '12.5px',
        color: 'var(--ifm-font-color-base)',
        opacity: 0.85,
        lineHeight: 1.6,
      }}>
        <strong style={{ color: '#34D399' }}>Reading this timeline:</strong> each step is a recorded run; the value is the <em>balanced accuracy</em> on its own test set (A, F, G, K, M). Runs differ in sample size and feature set, so the steps are not a controlled ablation. ⚠ marks runs whose selected features include Gaia/photometric columns.
      </div>
      <GaiaLeakNote run={current.run} style={{ marginTop: '8px' }} />
    </div>
  );
}
