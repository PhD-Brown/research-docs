// src/components/EigenspectraContrast.jsx
// PCA sur flux brut vs PCA sur les features, lues dans le run PCA de référence (runs.json :
// spectra.variance / n_components_for_variance et metrics.variance / n_components_for_variance).
// Correction (FACTS_INDEX §6) : 95 % de variance du flux brut demandent 5 composantes, pas 3.
//
// Usage :
//   <EigenspectraContrast />                          // run PCA de référence (registre FACTS_INDEX.md)
//   <EigenspectraContrast run="phy3500_pca_run_…" />

import React from 'react';
import { resolveRun, fmt } from '@site/src/data/astrospectro';

const r1 = (x) => Number((x * 100).toFixed(1));

function dataOf(run) {
  const s = run.spectra;
  const m = run.metrics;
  const FLUX_PCS = [
    { pc: 'PC1', pct: r1(s.variance[0]), interp: 'Colour slope — T_eff',           color: '#38BDF8', physical: true },
    { pc: 'PC2', pct: r1(s.variance[1]), interp: 'Infrared rise — K-M cool stars', color: '#60A5FA', physical: true },
    { pc: 'PC3', pct: r1(s.variance[2]), interp: 'LAMOST instrumental cut',        color: '#F87171', physical: false },
  ];
  const DESC_PCS = [
    { pc: 'PC1', pct: r1(m.variance[0]), interp: `Thermal axis ρ(Teff)=${fmt.signed(m.gaia_spearman.PC1.teff_gspphot)}`, color: '#38BDF8', physical: true },
    { pc: 'PC2', pct: r1(m.variance[1]), interp: 'Metallicity axis + instrumental SNR', color: '#F59E0B', physical: true },
    { pc: 'PC3', pct: r1(m.variance[2]), interp: 'Mixed spectral structure',            color: '#94A3B8', physical: true },
  ];
  return {
    FLUX_PCS, DESC_PCS,
    flux: { k95: s.n_components_for_variance['95pct'], top3: r1(s.cumulative[2]), n: s.n, channels: s.channels },
    desc: { k95: m.n_components_for_variance['95pct'], top3: r1(m.cumulative[2]), n: run.n, p: run.p },
  };
}

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
    <div style={{ flex: '1 1 300px', background: 'var(--ifm-card-background-color)', border: `1px solid ${color}30`, borderTop: `3px solid ${color}`, borderRadius: '10px', padding: '18px', minWidth: 0 }}>
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

export default function EigenspectraContrast({ run }) {
  const { FLUX_PCS, DESC_PCS, flux, desc } = dataOf(resolveRun(run, 'pca'));
  return (
    <div style={{ margin: '28px 0' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        <Panel title="PCA on raw flux" subtitle={`${fmt.int(flux.channels)} spectral channels · ${fmt.int(flux.n)} spectra`} color="#A78BFA" k95={flux.k95} totalPct3={flux.top3} pcs={FLUX_PCS}
          badge={`✓ Physically: adjacent pixels (Δλ~2 Å) are strongly correlated — coherence length ~10 Å. ${flux.k95} components suffice!`}
          badgeColor="#34D399" />
        <Panel title={`PCA on ${desc.p} features`} subtitle={`Engineered features · ${fmt.int(desc.n)} spectra`} color="#38BDF8" k95={desc.k95} totalPct3={desc.top3} pcs={DESC_PCS}
          badge={`→ Features eliminate spectral redundancy but introduce genuinely orthogonal physical information: ${desc.k95} components for 95%.`}
          badgeColor="#38BDF8" />
      </div>
      <div style={{ marginTop: '14px', padding: '14px 18px', background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '8px', fontSize: '13px', color: 'var(--ifm-font-color-base)', opacity: 0.85, lineHeight: 1.6 }}>
        <strong style={{ color: '#A78BFA' }}>Interpretation of the contrast:</strong> The {desc.p} features eliminate adjacent pixel redundancy but introduce genuinely orthogonal physical information (temperature, metallicity, gravity, chromospheric activity…). Result: intrinsic dimensionality rises from ~{flux.k95} to ~{desc.k95} — not a sign of inefficiency, but proof that features encode <em>distinct</em> physical dimensions.
      </div>
    </div>
  );
}
