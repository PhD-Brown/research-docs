import React from 'react';

const FLUX_PCS = [
  { pc: 'PC1', pct: 46.6, interp: 'Colour slope — T_eff',             color: '#38BDF8', physical: true },
  { pc: 'PC2', pct: 31.8, interp: 'Infrared rise — K-M cool stars',   color: '#60A5FA', physical: true },
  { pc: 'PC3', pct: 12.9, interp: 'LAMOST instrumental cut',          color: '#F87171', physical: false },
];

const DESC_PCS = [
  { pc: 'PC1', pct: 16.9, interp: 'Thermal axis ρ(Teff)=+0.831',     color: '#38BDF8', physical: true },
  { pc: 'PC2', pct: 12.0, interp: 'Metallicity axis + instrumental SNR', color: '#F59E0B', physical: true },
  { pc: 'PC3', pct:  9.5, interp: 'Mixed spectral structure',          color: '#94A3B8', physical: true },
];

function PCRow({ pc, pct, interp, color, physical }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '6px', background: hov ? `${color}0e` : 'transparent', transition: 'background 0.12s', cursor: 'default' }}>
      <div style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '13px', color: color, width: '28px', flexShrink: 0 }}>{pc}</div>
      <div style={{ flex: 1 }}>
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden', marginBottom: '4px' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: '4px', opacity: 0.8 }} />
        </div>
        <div style={{ fontSize: '11px', color: 'var(--ifm-font-color-base)', opacity: 0.6, lineHeight: 1.3 }}>{interp}</div>
      </div>
      <div style={{ fontFamily: 'monospace', fontWeight: '700', fontSize: '14px', color: color, flexShrink: 0, textAlign: 'right' }}>{pct}%</div>
      <div style={{ width: '14px', height: '14px', borderRadius: '50%', background: physical ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)', border: `1px solid ${physical ? '#34D399' : '#F87171'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', flexShrink: 0 }}>
        {physical ? '✓' : '⚠'}
      </div>
    </div>
  );
}

function Panel({ title, subtitle, color, k95, totalPct3, pcs, badge, badgeColor }) {
  return (
    <div style={{ flex: 1, background: 'var(--ifm-card-background-color)', border: `1px solid ${color}30`, borderTop: `3px solid ${color}`, borderRadius: '10px', padding: '18px', minWidth: 0 }}>
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--ifm-font-color-base)', marginBottom: '3px' }}>{title}</div>
        <div style={{ fontSize: '11px', opacity: 0.5, color: 'var(--ifm-font-color-base)' }}>{subtitle}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: `${color}0a`, border: `1px solid ${color}25`, borderRadius: '7px', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '10px', opacity: 0.45, marginBottom: '2px', color: 'var(--ifm-font-color-base)' }}>Components for 95% variance</div>
          <div style={{ fontFamily: 'monospace', fontSize: '26px', fontWeight: '900', color: color, lineHeight: 1 }}>K = {k95}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', opacity: 0.45, marginBottom: '2px', color: 'var(--ifm-font-color-base)' }}>Top 3 cumulate</div>
          <div style={{ fontFamily: 'monospace', fontSize: '20px', fontWeight: '700', color: color }}>{totalPct3}%</div>
        </div>
      </div>
      <div style={{ marginBottom: '12px' }}>{pcs.map((p) => <PCRow key={p.pc} {...p} />)}</div>
      <div style={{ padding: '8px 12px', background: `${badgeColor}0c`, border: `1px solid ${badgeColor}30`, borderRadius: '6px', fontSize: '11px', color: 'var(--ifm-font-color-base)', opacity: 0.8 }}>{badge}</div>
    </div>
  );
}

export default function EigenspectraContrast() {
  return (
    <div style={{ margin: '28px 0' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Panel title="PCA on raw flux" subtitle="3,921 spectral channels · 10,000 spectra" color="#A78BFA" k95={3} totalPct3={91.3} pcs={FLUX_PCS}
          badge="✓ Physically: adjacent pixels (Δλ~2 Å) are strongly correlated — coherence length ~10 Å. 3 components suffice!"
          badgeColor="#34D399" />
        <Panel title="PCA on 183 features" subtitle="Engineered features · 43,019 spectra" color="#38BDF8" k95={91} totalPct3={38.4} pcs={DESC_PCS}
          badge="→ Features eliminate spectral redundancy but introduce genuinely orthogonal physical information: 91 components for 95%."
          badgeColor="#38BDF8" />
      </div>
      <div style={{ marginTop: '14px', padding: '14px 18px', background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '8px', fontSize: '13px', color: 'var(--ifm-font-color-base)', opacity: 0.85, lineHeight: 1.6 }}>
        <strong style={{ color: '#A78BFA' }}>Interpretation of the contrast:</strong> The 183 features eliminate adjacent pixel redundancy but introduce genuinely orthogonal physical information (temperature, metallicity, gravity, chromospheric activity…). Result: intrinsic dimensionality rises from ~3 to ~91 — not a sign of inefficiency, but proof that features encode <em>distinct</em> physical dimensions.
      </div>
    </div>
  );
}
