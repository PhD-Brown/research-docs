import React from 'react';

const STEPS = [
  {
    step: 1,
    label: 'Baseline',
    accuracy: 32,
    model: 'Random Forest',
    mode: '4 binary features',
    modeColor: '#94A3B8',
    color: '#94A3B8',
    note: 'Initial proof of concept',
    current: false,
  },
  {
    step: 2,
    label: 'Features V1 + metadata',
    accuracy: '75–84',
    model: 'RF / XGBoost',
    mode: 'With ra, dec, Gaia',
    modeColor: '#F59E0B',
    color: '#F59E0B',
    note: 'Improvement but data leakage',
    current: false,
    warning: true,
  },
  {
    step: 3,
    label: 'Features V2',
    accuracy: 87,
    model: 'XGBoost',
    mode: 'spectro_only=True',
    modeColor: '#34D399',
    color: '#34D399',
    note: 'Intrinsic physics only',
    current: true,
  },
];

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

export default function ProgressionPipeline() {
  return (
    <div style={{ margin: '28px 0' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'stretch' }}>
        {STEPS.map((s, i) => (
          <React.Fragment key={s.step}>
            <Step {...s} />
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
        <strong style={{ color: '#34D399' }}>Counter-intuitive:</strong> going from 84% to 87% by <em>removing</em> features — <code>ra</code>, <code>dec</code>, <code>redshift</code> provided a correlated signal via LAMOST observational biases (observation programs targeted by spectral type), not via real physics. Removing them forces the model to learn true physical indicators → better generalisation.
      </div>
    </div>
  );
}
