// Styles partagés des composants xi/ : variables Infima uniquement (thème clair et sombre).
export const s = {
  wrap: { border: '1px solid var(--ifm-toc-border-color)', borderRadius: 8, overflowX: 'auto', margin: '1rem 0' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', display: 'table', margin: 0 },
  th: { textAlign: 'left', padding: '8px 12px', borderBottom: '1px solid var(--ifm-toc-border-color)', color: 'var(--ifm-color-emphasis-700)', fontWeight: 600, whiteSpace: 'nowrap' },
  td: { padding: '8px 12px', borderBottom: '1px solid var(--ifm-toc-border-color)', fontFamily: 'var(--ifm-font-family-monospace)', whiteSpace: 'nowrap' },
  tdText: { padding: '8px 12px', borderBottom: '1px solid var(--ifm-toc-border-color)' },
  best: { background: 'var(--ifm-color-emphasis-100)', fontWeight: 700 },
  grid: (min = 180) => ({ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`, gap: 12, margin: '1rem 0' }),
  card: { border: '1px solid var(--ifm-toc-border-color)', borderRadius: 8, padding: '12px 14px', background: 'var(--ifm-card-background-color)' },
  value: { fontFamily: 'var(--ifm-font-family-monospace)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--ifm-color-primary)', lineHeight: 1.2 },
  label: { fontWeight: 600, marginTop: 4 },
  ctx: { fontSize: '0.8rem', color: 'var(--ifm-color-emphasis-700)', marginTop: 2 },
};
