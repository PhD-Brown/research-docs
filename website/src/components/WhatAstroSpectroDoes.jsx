// src/components/WhatAstroSpectroDoes.jsx
// Fully static — no props required.
// Renders the 6 pipeline stages as a vertical stepper.

import React from 'react';

const STAGES = [
  {
    n: '01',
    title: 'LAMOST DR5 spectra',
    tag: 'SmartDownloader',
    body:
      'Raw .fits.gz spectra are downloaded from the LAMOST DR5 public archive. The SmartDownloader module implements idempotent, resumable parallel downloading organised by observation plan — progress is preserved across sessions.',
    href: './astrospectro/data/lamost-dr5',
    hrefLabel: 'LAMOST DR5 →',
  },
  {
    n: '02',
    title: 'Preprocessing',
    tag: null,
    body:
      'Each spectrum is wavelength-normalised onto a common λ grid (3,690–9,100 Å, 3,921 channels), continuum-divided, and subjected to quality filters (SNRg threshold, Gaia RUWE filter). Spectra failing quality criteria are rejected before any features are computed.',
    href: './astrospectro/pipeline/preprocessing',
    hrefLabel: 'Preprocessing →',
  },
  {
    n: '03',
    title: 'Feature engineering',
    tag: '183 descriptors',
    body:
      'The FeatureEngineer module extracts 183 spectroscopic descriptors spanning six physical families: Balmer lines, Ca II H&K and IR triplet, Mg b and α-elements, iron-peak metals, Lick/SDSS band indices, and continuum slopes. Each descriptor carries a direct astrophysical interpretation before the classifier ever sees it.',
    href: './astrospectro/pipeline/feature-engineering-theory',
    hrefLabel: 'Feature engineering →',
  },
  {
    n: '04',
    title: 'Classifier training',
    tag: 'spectro_only = True',
    body:
      'An XGBoost gradient-boosted classifier is trained on the feature matrix with spectro_only = True enforced throughout. The calibrated model outputs class-conditional probability vectors, and every run is logged to Weights & Biases with a reproducible session report and MD5 hash.',
    href: './astrospectro/pipeline/classification',
    hrefLabel: 'Classification →',
  },
  {
    n: '05',
    title: 'Dimensionality reduction',
    tag: 'PCA · UMAP · t-SNE · AE',
    body:
      'Independently of the supervised pipeline, the same 183-feature matrix is explored via PCA, UMAP + HDBSCAN, t-SNE, and a symmetric autoencoder. This multi-method analysis reveals what physical structure the high-dimensional feature space contains and whether different projection methods recover equivalent information.',
    href: './astrospectro/dimred',
    hrefLabel: 'Dimensionality reduction →',
  },
  {
    n: '06',
    title: 'Scientific interpretation',
    tag: 'TreeSHAP',
    body:
      'TreeSHAP is applied post-hoc to the trained classifier to decompose every prediction into per-feature contributions. The global importance ranking is then cross-validated against Gaia DR3 stellar parameters — T_eff, log g, [Fe/H] — to assess the physical coherence of what the model has learned.',
    href: './astrospectro/science/shap-interpretability',
    hrefLabel: 'SHAP Interpretability →',
  },
];

// ─── styles ──────────────────────────────────────────────────────────────────

const s = {
  list: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
  },
  item: {
    display: 'flex',
    gap: '1rem',
    position: 'relative',
  },
  // Left column: number + connector line
  left: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexShrink: 0,
    width: '2.6rem',
  },
  badge: {
    width: '2.2rem',
    height: '2.2rem',
    borderRadius: '50%',
    background: 'var(--ifm-color-primary)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '0.72rem',
    letterSpacing: '0.02em',
    flexShrink: 0,
    zIndex: 1,
  },
  connector: {
    flex: 1,
    width: '2px',
    background: 'var(--ifm-toc-border-color)',
    margin: '4px 0',
  },
  // Right column: content
  content: {
    flex: 1,
    paddingBottom: '1.5rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
    marginBottom: '0.4rem',
  },
  title: {
    fontWeight: 700,
    fontSize: '0.97rem',
    color: 'var(--ifm-font-color-base)',
    margin: 0,
  },
  tag: {
    fontFamily: 'var(--ifm-font-family-monospace)',
    fontSize: '0.71rem',
    background: 'var(--ifm-color-primary-lightest, rgba(53,120,229,0.1))',
    color: 'var(--ifm-color-primary)',
    borderRadius: '4px',
    padding: '0.1em 0.5em',
  },
  body: {
    fontSize: '0.87rem',
    lineHeight: 1.65,
    color: 'var(--ifm-color-emphasis-700)',
    margin: '0 0 0.45rem',
  },
  link: {
    fontSize: '0.8rem',
    fontWeight: 600,
    color: 'var(--ifm-link-color)',
    textDecoration: 'none',
  },
};

// ─── component ───────────────────────────────────────────────────────────────

export default function WhatAstroSpectroDoes() {
  return (
    <ul style={s.list}>
      {STAGES.map((stage, i) => {
        const isLast = i === STAGES.length - 1;
        return (
          <li key={stage.n} style={s.item}>
            {/* Left: circle + line */}
            <div style={s.left}>
              <div style={s.badge}>{stage.n}</div>
              {!isLast && <div style={s.connector} />}
            </div>

            {/* Right: content */}
            <div style={s.content}>
              <div style={s.header}>
                <span style={s.title}>{stage.title}</span>
                {stage.tag && <span style={s.tag}>{stage.tag}</span>}
              </div>
              <p style={s.body}>{stage.body}</p>
              <a href={stage.href} style={s.link}>{stage.hrefLabel}</a>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
