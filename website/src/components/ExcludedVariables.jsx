import React from 'react';

export default function ExcludedVariables() {
  const exclusions = [
    { id: 'ra',       variable: 'ra',       category: 'Angular coordinate', reason: 'Geographic and instrumental observational bias.',                              icon: '⦵', color: '#F43F5E', glow: 'rgba(244, 63, 94, 0.08)' },
    { id: 'dec',      variable: 'dec',      category: 'Angular coordinate', reason: 'Geographic and instrumental bias (redundant with RA).',                        icon: '⦶', color: '#F43F5E', glow: 'rgba(244, 63, 94, 0.08)' },
    { id: 'redshift', variable: 'redshift', category: 'LAMOST metadata',    reason: 'Observational bias unrelated to intrinsic physical properties of the star.', icon: '⤆', color: '#F59E0B', glow: 'rgba(245, 158, 11, 0.08)' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', margin: '24px 0' }}>
      {exclusions.map((item) => (
        <div key={item.id}
          style={{ position: 'relative', background: 'var(--ifm-background-surface-color, #0a0c14)', backgroundImage: `linear-gradient(to bottom, ${item.glow}, transparent 60%)`, border: '1px solid rgba(255, 255, 255, 0.06)', borderTop: `2px solid ${item.color}`, borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'default' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 24px -10px ${item.color}50`; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)'; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <code style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)', color: item.color, border: `1px solid ${item.color}40`, borderRadius: '6px', padding: '4px 8px', fontSize: '13px', fontWeight: '800', fontFamily: 'monospace', boxShadow: `inset 0 0 8px ${item.glow}` }}>{item.variable}</code>
            <span style={{ fontSize: '18px', opacity: 0.6, color: item.color, fontFamily: 'sans-serif' }}>{item.icon}</span>
          </div>
          <div>
            <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700', color: 'var(--ifm-font-color-base)', opacity: 0.45, marginBottom: '6px' }}>{item.category}</div>
            <div style={{ fontSize: '13px', color: 'var(--ifm-font-color-base)', opacity: 0.9, lineHeight: 1.5 }}>{item.reason}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
