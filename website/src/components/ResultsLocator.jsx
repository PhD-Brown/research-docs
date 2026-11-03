// src/components/ResultsLocator.jsx
// Fully static — no props required.
// "Where to find current results" section: callout + lookup table.

import React from 'react';

const LOOKUP = [
  {
    query: 'Classification accuracy and per-class metrics',
    href: './astrospectro/overview/key-results',
    label: 'Key Results at a Glance',
  },
  {
    query: 'SHAP feature importance ranking',
    href: './astrospectro/science/shap-interpretability',
    label: 'SHAP Interpretability',
  },
  {
    query: 'Physical validation plots (Ca II K vs [Fe/H], Hα FWHM vs T_eff)',
    href: './astrospectro/science/validation',
    label: 'Scientific Validation',
  },
  {
    query: 'PCA, UMAP, t-SNE, autoencoder quantitative results',
    href: './astrospectro/dimred',
    label: 'Dimensionality Reduction',
  },
  {
    query: 'XGBoost hyperparameters and model architecture',
    href: './astrospectro/pipeline/classification',
    label: 'Classification',
  },
  {
    query: 'Evidence levels for all findings',
    href: './astrospectro/science/claims-register',
    label: 'Scientific Claims Register',
  },
  {
    query: 'F/G boundary confusion analysis',
    href: './astrospectro/science/fg-confusion',
    label: 'F/G Confusion Analysis',
  },
];

// ─── styles ──────────────────────────────────────────────────────────────────

const s = {
  wrap: { marginBottom: '1rem' },

  // Callout box — mimics the :::note admonition visually
  callout: {
    background: 'var(--ifm-code-background)',
    border: '1px solid var(--ifm-toc-border-color)',
    borderLeft: '4px solid var(--ifm-color-info, #54c7ec)',
    borderRadius: '6px',
    padding: '1rem 1.25rem',
    marginBottom: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  calloutHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
  },
  calloutLabel: {
    fontSize: '0.7rem',
    fontWeight: 800,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: 'var(--ifm-color-info, #54c7ec)',
  },
  calloutText: {
    fontSize: '0.9rem',
    lineHeight: 1.65,
    color: 'var(--ifm-font-color-base)',
    margin: 0,
  },
  calloutMeta: {
    fontSize: '0.8rem',
    color: 'var(--ifm-color-emphasis-600)',
    margin: 0,
  },

  // Lookup table
  tableWrap: {
    border: '1px solid var(--ifm-toc-border-color)',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9rem',
  },
  thead: {
    background: 'var(--ifm-code-background)',
  },
  th: {
    padding: '0.6rem 1.1rem',
    fontWeight: 700,
    textAlign: 'left',
    borderBottom: '2px solid var(--ifm-toc-border-color)',
  },
  tdQuery: {
    padding: '0.55rem 1.1rem',
    borderBottom: '1px solid var(--ifm-toc-border-color)',
    color: 'var(--ifm-color-emphasis-700)',
    fontSize: '0.875rem',
  },
  tdLink: {
    padding: '0.55rem 1.1rem',
    borderBottom: '1px solid var(--ifm-toc-border-color)',
    whiteSpace: 'nowrap',
  },
  link: {
    color: 'var(--ifm-link-color)',
    fontWeight: 500,
    textDecoration: 'none',
  },
};

// ─── component ───────────────────────────────────────────────────────────────

export default function ResultsLocator() {
  return (
    <div style={s.wrap}>
      {/* Callout */}
      <div style={s.callout}>
        <div style={s.calloutHeader}>
          <span style={{ fontSize: '1rem' }}>ℹ</span>
          <span style={s.calloutLabel}>Latest highlighted analysis</span>
        </div>
        <p style={s.calloutText}>
          The current SHAP analysis suggests that metallicity-sensitive spectroscopic
          descriptors, including Mg b and Ca II features, play a major role in the
          learned classification structure — above classical Balmer temperature indicators.
        </p>
        <p style={s.calloutMeta}>
          This finding is tracked in the dedicated SHAP and Claims Register pages, which
          are the authoritative sources for all quantitative claims.
        </p>
      </div>

      {/* Lookup table */}
      <div style={s.tableWrap}>
        <table style={s.table}>
          <thead style={s.thead}>
            <tr>
              <th style={s.th}>If you are looking for&hellip;</th>
              <th style={{ ...s.th, width: '32%' }}>Go to</th>
            </tr>
          </thead>
          <tbody>
            {LOOKUP.map((row, i) => {
              const isLast = i === LOOKUP.length - 1;
              const tdBase = isLast
                ? { ...s.tdQuery, borderBottom: 'none' }
                : s.tdQuery;
              const tdLink = isLast
                ? { ...s.tdLink, borderBottom: 'none' }
                : s.tdLink;
              return (
                <tr key={row.href}>
                  <td style={tdBase}>{row.query}</td>
                  <td style={tdLink}>
                    <a href={row.href} style={s.link}>{row.label}</a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
