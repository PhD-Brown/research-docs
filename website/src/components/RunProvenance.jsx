// src/components/RunProvenance.jsx
// Prop-driven — reusable across pages.
// Renders a compact current-run provenance card.
//
// Usage:
//   <RunProvenance
//     experiment="ST_350k_xgb_AFGKM_v6"
//     savedAt="20260522T161236Z"
//     md5="e752bb7ce5494364364f77a4200aa480"
//     notes="Full dataset retraining · 350k spectra · spectro_only = True · isotonic calibration"
//     stack="Python 3.11.9 / XGBoost 3.1.1"
//     keyResultsHref="./overview/key-results"
//   />

import React from 'react';

// ─── styles ──────────────────────────────────────────────────────────────────

const s = {
  card: {
    background: 'var(--ifm-code-background)',
    border: '1px solid var(--ifm-toc-border-color)',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '1rem',
    fontSize: '0.88rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '0.65rem 1.1rem',
    borderBottom: '1px solid var(--ifm-toc-border-color)',
    background: 'rgba(53,120,229,0.06)',
  },
  headerDot: {
    width: '0.55rem',
    height: '0.55rem',
    borderRadius: '50%',
    background: 'var(--ifm-color-primary)',
    flexShrink: 0,
  },
  headerLabel: {
    fontSize: '0.68rem',
    fontWeight: 800,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--ifm-color-primary)',
  },
  experimentName: {
    fontFamily: 'var(--ifm-font-family-monospace)',
    fontSize: '0.9rem',
    fontWeight: 700,
    color: 'var(--ifm-font-color-base)',
    marginLeft: 'auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 0,
  },
  field: {
    padding: '0.55rem 1.1rem',
    borderRight: '1px solid var(--ifm-toc-border-color)',
    borderBottom: '1px solid var(--ifm-toc-border-color)',
  },
  fieldLast: {
    padding: '0.55rem 1.1rem',
    borderBottom: '1px solid var(--ifm-toc-border-color)',
  },
  fieldLabel: {
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: 'var(--ifm-color-emphasis-600)',
    marginBottom: '0.2rem',
  },
  fieldValue: {
    fontFamily: 'var(--ifm-font-family-monospace)',
    fontSize: '0.82rem',
    color: 'var(--ifm-font-color-base)',
    wordBreak: 'break-all',
  },
  footer: {
    padding: '0.55rem 1.1rem',
    color: 'var(--ifm-color-emphasis-600)',
    fontSize: '0.82rem',
    lineHeight: 1.55,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  footerLink: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--ifm-link-color)',
    textDecoration: 'none',
    whiteSpace: 'nowrap',
  },
};

// ─── component ───────────────────────────────────────────────────────────────

export default function RunProvenance({
  experiment = '',
  savedAt = '',
  md5 = '',
  notes = '',
  stack = '',
  keyResultsHref = './overview/key-results',
}) {
  const fields = [
    { label: 'Experiment', value: experiment },
    { label: 'Saved (UTC)', value: savedAt },
    { label: 'MD5', value: md5 },
    { label: 'Stack', value: stack },
  ].filter((f) => f.value);

  return (
    <div style={s.card}>
      {/* Header */}
      <div style={s.header}>
        <span style={s.headerDot} />
        <span style={s.headerLabel}>Current run</span>
        <span style={s.experimentName}>{experiment}</span>
      </div>

      {/* Key fields grid */}
      <div style={s.grid}>
        {fields.map((f, i) => {
          const isLastInRow = i === fields.length - 1;
          return (
            <div key={f.label} style={isLastInRow ? s.fieldLast : s.field}>
              <div style={s.fieldLabel}>{f.label}</div>
              <div style={s.fieldValue}>{f.value}</div>
            </div>
          );
        })}
      </div>

      {/* Notes + link footer */}
      <div style={s.footer}>
        <span>{notes}</span>
        {keyResultsHref && (
          <a href={keyResultsHref} style={s.footerLink}>
            For detailed metrics →
          </a>
        )}
      </div>
    </div>
  );
}
