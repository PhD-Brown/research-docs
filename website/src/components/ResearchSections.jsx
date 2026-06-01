// src/components/ResearchSections.jsx
// Fully static — no props required.
// Renders the AstroSpectro section navigation hub as an enhanced table.

import React from 'react';

const SECTIONS = [
  {
    href: './',
    label: 'Overview',
    contents: 'Scientific motivation · key results · project map',
    featured: false,
  },
  {
    href: './astrospectro/concepts',
    label: 'Concepts & Architecture',
    tag: 'spectro_only=True',
    contents: ' · physical purity · data lifecycle',
    featured: false,
  },
  {
    href: './astrospectro/data',
    label: 'Data & Datasets',
    contents: 'LAMOST DR5 · Gaia DR3 · feature catalogue (183 features)',
    featured: false,
  },
  {
    href: './astrospectro/pipeline',
    label: 'Core Pipeline',
    contents: 'Preprocessing · feature engineering · XGBoost v6',
    featured: false,
  },
  {
    href: './astrospectro/dimred',
    label: 'Dimensionality Reduction',
    contents: 'PCA · UMAP + HDBSCAN · t-SNE · Autoencoder',
    featured: false,
  },
  {
    href: './astrospectro/science/shap-interpretability',
    label: 'Scientific Analysis',
    contents: 'SHAP · classification · validation · limitations',
    featured: true,   // highlighted row
    icon: '⭐',
  },
  {
    href: './astrospectro/guides',
    label: 'Guides',
    contents: 'Installation · quick start · Gaia connection',
    featured: false,
  },
  {
    href: './astrospectro/api',
    label: 'API Reference',
    contents: 'Preprocessor · FeatureEngineer · Classifier · Dimred',
    featured: false,
  },
  {
    href: './astrospectro/community/roadmap',
    label: 'Community',
    contents: 'Roadmap · RNAAS manuscript · citing',
    featured: false,
  },
];

// ─── styles ──────────────────────────────────────────────────────────────────

const s = {
  wrap: {
    border: '1px solid var(--ifm-toc-border-color)',
    borderRadius: '8px',
    overflow: 'hidden',
    marginBottom: '1rem',
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
    padding: '0.65rem 1.1rem',
    fontWeight: 700,
    textAlign: 'left',
    borderBottom: '2px solid var(--ifm-toc-border-color)',
    color: 'var(--ifm-font-color-base)',
  },
  td: {
    padding: '0.6rem 1.1rem',
    borderBottom: '1px solid var(--ifm-toc-border-color)',
    verticalAlign: 'middle',
  },
  tdFeatured: {
    padding: '0.6rem 1.1rem',
    borderBottom: '1px solid var(--ifm-toc-border-color)',
    verticalAlign: 'middle',
    background: 'var(--ifm-color-primary-lightest, rgba(53,120,229,0.06))',
  },
  link: {
    color: 'var(--ifm-link-color)',
    fontWeight: 500,
    textDecoration: 'none',
  },
  featuredLink: {
    color: 'var(--ifm-link-color)',
    fontWeight: 700,
    textDecoration: 'none',
  },
  tag: {
    fontFamily: 'var(--ifm-font-family-monospace)',
    fontSize: '0.72rem',
    background: 'var(--ifm-code-background)',
    border: '1px solid var(--ifm-toc-border-color)',
    borderRadius: '3px',
    padding: '0.1em 0.4em',
    color: 'var(--ifm-color-primary)',
  },
  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '1.4rem',
    height: '1.4rem',
    borderRadius: '50%',
    background: 'rgba(39,174,96,0.15)',
    color: '#27ae60',
    fontWeight: 700,
    fontSize: '0.75rem',
  },
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function SectionCell({ section }) {
  const tdStyle = section.featured ? s.tdFeatured : s.td;
  const linkStyle = section.featured ? s.featuredLink : s.link;
  return (
    <td style={tdStyle}>
      {section.icon && <span style={{ marginRight: '0.35rem' }}>{section.icon}</span>}
      <a href={section.href} style={linkStyle}>{section.label}</a>
    </td>
  );
}

function ContentsCell({ section }) {
  const tdStyle = section.featured ? s.tdFeatured : s.td;
  return (
    <td style={{ ...tdStyle, color: 'var(--ifm-color-emphasis-700)' }}>
      {section.tag && (
        <>
          <code style={s.tag}>{section.tag}</code>
          {section.contents}
        </>
      )}
      {!section.tag && section.contents}
    </td>
  );
}

function StatusCell({ section }) {
  const tdStyle = { ...(section.featured ? s.tdFeatured : s.td), textAlign: 'center', width: '4rem' };
  return (
    <td style={tdStyle}>
      <span style={s.statusBadge}>✓</span>
    </td>
  );
}

// ─── component ───────────────────────────────────────────────────────────────

export default function ResearchSections() {
  return (
    <div style={s.wrap}>
      <table style={s.table}>
        <thead style={s.thead}>
          <tr>
            <th style={{ ...s.th, width: '30%' }}>Section</th>
            <th style={s.th}>Contents</th>
            <th style={{ ...s.th, textAlign: 'center', width: '4rem' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {SECTIONS.map((section) => (
            <tr key={section.href}>
              <SectionCell section={section} />
              <ContentsCell section={section} />
              <StatusCell section={section} />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
