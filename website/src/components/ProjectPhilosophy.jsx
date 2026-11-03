// src/components/ProjectPhilosophy.jsx
// Fully static — no props required.
// Renders the five stable principles of the AstroSpectro project as a card grid.

import React from 'react';

const PRINCIPLES = [
  {
    id: '01',
    tag: 'spectro_only = True',
    title: 'Spectroscopy first',
    body:
      'The classifier ingests only spectroscopic descriptors — line strengths, profiles, and indices derived from the stellar spectrum itself. Positional coordinates, redshift, and Gaia metadata are excluded at training time. The model must earn its accuracy from physics alone.',
  },
  {
    id: '02',
    tag: 'SHAP + physical validation',
    title: 'Interpretability over accuracy',
    body:
      'A high accuracy score that cannot be explained by astrophysics is not sufficient. Every classification decision should be traceable to known stellar physics via SHAP values, and the resulting rankings should be validated against independent stellar parameters from Gaia DR3.',
  },
  {
    id: '03',
    tag: 'feature audit + claims register',
    title: 'Leakage as a design concern',
    body:
      'Observational shortcuts — features that correlate with labels for non-physical reasons — are tracked and excluded explicitly. A Data Leakage Audit documents every exclusion decision, and the spectro_only mode enforces the boundary at runtime.',
  },
  {
    id: '04',
    tag: 'W&B · session reports · MD5',
    title: 'Reproducible runs',
    body:
      'Every training run is logged to Weights & Biases and produces a JSON session report containing hyperparameters, feature lists, and a model MD5 hash. Results are never stated without a pointer to the specific experiment that produced them.',
  },
  {
    id: '05',
    tag: 'Scientific Claims Register',
    title: 'Claims backed by evidence',
    body:
      'Scientific findings are tracked in a dedicated Claims Register with an explicit evidence level — suggests vs. confirms — and a pointer to the analysis that supports each claim. No finding is promoted to the documentation without it.',
  },
];

// ─── styles ─────────────────────────────────────────────────────────────────

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(275px, 1fr))',
    gap: '1rem',
    marginBottom: '1rem',
  },
  card: {
    background: 'var(--ifm-code-background)',
    border: '1px solid var(--ifm-toc-border-color)',
    borderRadius: '8px',
    padding: '1.2rem 1.4rem 1.3rem',
    position: 'relative',
  },
  idBadge: {
    position: 'absolute',
    top: '0.9rem',
    right: '1.1rem',
    fontSize: '1.6rem',
    fontWeight: 800,
    lineHeight: 1,
    userSelect: 'none',
    color: 'var(--ifm-toc-border-color)',
  },
  tag: {
    display: 'inline-block',
    fontFamily: 'var(--ifm-font-family-monospace)',
    fontSize: '0.71rem',
    background: 'var(--ifm-color-primary-lightest, rgba(53,120,229,0.1))',
    color: 'var(--ifm-color-primary)',
    borderRadius: '4px',
    padding: '0.12em 0.5em',
    marginBottom: '0.5rem',
    maxWidth: 'calc(100% - 3rem)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  title: {
    fontWeight: 700,
    fontSize: '0.96rem',
    marginBottom: '0.45rem',
    color: 'var(--ifm-font-color-base)',
  },
  body: {
    fontSize: '0.86rem',
    lineHeight: 1.62,
    color: 'var(--ifm-color-emphasis-700)',
    margin: 0,
  },
};

// ─── component ───────────────────────────────────────────────────────────────

export default function ProjectPhilosophy() {
  return (
    <div style={styles.grid}>
      {PRINCIPLES.map((p) => (
        <div key={p.id} style={styles.card}>
          <span style={styles.idBadge}>{p.id}</span>
          <div style={styles.tag}>{p.tag}</div>
          <div style={styles.title}>{p.title}</div>
          <p style={styles.body}>{p.body}</p>
        </div>
      ))}
    </div>
  );
}
