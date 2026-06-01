// src/components/ProjectHero.jsx
// Fully static — no props required.
// Renders the AstroSpectro hero: scientific question frame + three differentiator pillars.

import React from 'react';

const PILLARS = [
  {
    symbol: '⚛',
    accent: 'var(--ifm-color-primary)',
    title: 'Physics-informed',
    body:
      '183 spectroscopic descriptors derived from astrophysical line physics — equivalent widths, FWHM, Lick indices, molecular band strengths. Every feature carries physical meaning before the model sees it.',
  },
  {
    symbol: '◎',
    accent: '#e5a435',
    title: 'Interpretable by design',
    body:
      'TreeSHAP post-hoc analysis validates what the classifier actually learns against known stellar physics — not just whether the accuracy score meets an arbitrary threshold.',
  },
  {
    symbol: '⊘',
    accent: '#2e9e6b',
    title: 'Leakage-aware',
    body:
      'spectro_only = True enforces strict exclusion of positional coordinates, redshift, and observational metadata at training time. Physical purity is a design constraint, not an afterthought.',
  },
];

// ─── styles ─────────────────────────────────────────────────────────────────

const styles = {
  wrap: {
    marginBottom: '0.5rem',
  },
  question: {
    background: 'var(--ifm-code-background)',
    border: '1px solid var(--ifm-toc-border-color)',
    borderLeft: '4px solid var(--ifm-color-primary)',
    borderRadius: '6px',
    padding: '1.25rem 1.5rem',
    marginBottom: '1.25rem',
  },
  label: {
    display: 'block',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'var(--ifm-color-primary)',
    marginBottom: '0.55rem',
  },
  questionText: {
    margin: 0,
    fontSize: '1.05rem',
    lineHeight: 1.65,
    color: 'var(--ifm-font-color-base)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1rem',
  },
  card: {
    background: 'var(--ifm-code-background)',
    border: '1px solid var(--ifm-toc-border-color)',
    borderRadius: '8px',
    padding: '1.2rem 1.3rem',
  },
  icon: {
    fontSize: '1.7rem',
    marginBottom: '0.5rem',
    lineHeight: 1,
  },
  cardTitle: {
    fontWeight: 700,
    fontSize: '0.95rem',
    marginBottom: '0.4rem',
  },
  cardBody: {
    fontSize: '0.86rem',
    lineHeight: 1.6,
    color: 'var(--ifm-color-emphasis-700)',
  },
};

// ─── component ───────────────────────────────────────────────────────────────

export default function ProjectHero() {
  return (
    <div style={styles.wrap}>
      {/* Scientific question frame */}
      <div style={styles.question}>
        <span style={styles.label}>Scientific question</span>
        <p style={styles.questionText}>
          When a modern ML classifier is trained on large-scale stellar spectroscopy,{' '}
          <em>which physical indicators actually drive its decisions?</em>
          <br />
          AstroSpectro was built to answer this — with physics-motivated descriptors,
          a reproducible pipeline, and post-hoc SHAP interpretability on N&thinsp;≈&thinsp;350k
          LAMOST DR5 × Gaia DR3 spectra.
        </p>
      </div>

      {/* Differentiator pillars */}
      <div style={styles.grid}>
        {PILLARS.map((p) => (
          <div key={p.title} style={styles.card}>
            <div style={styles.icon}>{p.symbol}</div>
            <div style={{ ...styles.cardTitle, color: p.accent }}>{p.title}</div>
            <div style={styles.cardBody}>{p.body}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
