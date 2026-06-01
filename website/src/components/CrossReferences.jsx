// src/components/CrossReferences.jsx
// Prop-driven — reusable across all pages.
// Renders a cross-reference table from a `links` array.
//
// Usage:
//   <CrossReferences links={[
//     { href: './science/shap', label: 'SHAP Interpretability', relation: 'Central scientific contribution', featured: true },
//     { href: './overview/key-results', label: 'Key Results at a Glance', relation: 'All current performance metrics' },
//   ]} />
//
// Link object shape:
//   href      string   — relative or absolute URL
//   label     string   — display text (can include leading emoji)
//   relation  string   — short description of the relation
//   featured  boolean  — optional, highlights the row

import React from 'react';

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
    padding: '0.6rem 1.1rem',
    fontWeight: 700,
    textAlign: 'left',
    borderBottom: '2px solid var(--ifm-toc-border-color)',
    color: 'var(--ifm-font-color-base)',
  },
  td: (featured, isLast) => ({
    padding: '0.55rem 1.1rem',
    borderBottom: isLast ? 'none' : '1px solid var(--ifm-toc-border-color)',
    verticalAlign: 'middle',
    background: featured
      ? 'var(--ifm-color-primary-lightest, rgba(53,120,229,0.05))'
      : 'transparent',
  }),
  link: (featured) => ({
    color: 'var(--ifm-link-color)',
    fontWeight: featured ? 700 : 500,
    textDecoration: 'none',
  }),
  relation: {
    color: 'var(--ifm-color-emphasis-700)',
    fontSize: '0.875rem',
  },
};

// ─── component ───────────────────────────────────────────────────────────────

export default function CrossReferences({ links = [] }) {
  if (!links.length) return null;

  return (
    <div style={s.wrap}>
      <table style={s.table}>
        <thead style={s.thead}>
          <tr>
            <th style={{ ...s.th, width: '38%' }}>Related page</th>
            <th style={s.th}>Relation</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link, i) => {
            const isLast = i === links.length - 1;
            const featured = Boolean(link.featured);
            return (
              <tr key={link.href + i}>
                <td style={s.td(featured, isLast)}>
                  <a href={link.href} style={s.link(featured)}>
                    {link.label}
                  </a>
                </td>
                <td style={{ ...s.td(featured, isLast), ...s.relation }}>
                  {link.relation}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
