// src/components/PCAxisCards.jsx
// Cartes PC1 / PC2 : variance, λ, ρ de Spearman avec Gaia, loading principal et répartition par famille
// du top-10 des loadings (run PCA de référence, runs.json).
// Correction : la carte PC2 affichait ρ([Fe/H]) = −0.548, qui est la valeur de PC1 ; ρ(PC2, [M/H]) vient
// désormais du run.
//
// Usage :
//   <PCAxisCards />                            // run PCA de référence (registre FACTS_INDEX.md)
//   <PCAxisCards run="phy3500_pca_run_…" />

import React from 'react';
import { resolveRun, familyShares, prettyFeature, fmt } from '@site/src/data/astrospectro';

const toBar = (shares) => shares.filter((f) => f.pct > 0).map((f) => ({ name: f.short, pct: f.pct, color: f.color }));

function FamilyBar({ families }) {
  return (
    <div>
      <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' }}>
        {families.map((f) => (<div key={f.name} title={`${f.name}: ${f.pct}%`} style={{ flex: `0 0 ${f.pct}%`, background: f.color }} />))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {families.map((f) => (
          <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: f.color, flexShrink: 0 }} />
            <span style={{ fontSize: '10px', opacity: 0.6, color: 'var(--ifm-font-color-base)', whiteSpace: 'nowrap' }}>{f.name} {f.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RhoDisplay({ value, label, color, isBig }) {
  const abs = Math.abs(value);
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: isBig ? '36px' : '22px', fontWeight: '900', color: color, lineHeight: 1, letterSpacing: '-1px' }}>{value > 0 ? '+' : ''}{value.toFixed(3)}</div>
      <div style={{ fontSize: '10px', opacity: 0.5, marginTop: '3px', color: 'var(--ifm-font-color-base)' }}>ρ({label})</div>
      <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px', marginTop: '5px', overflow: 'hidden' }}>
        <div style={{ width: `${abs * 100}%`, height: '100%', background: color, borderRadius: '2px' }} />
      </div>
    </div>
  );
}

function PCCard({ pcLabel, axiName, axiSub, color, variancePct, lambda, topRho, topRhoLabel, secondRho, secondRhoLabel, families, topLoading, topLoadingW, warning }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ flex: 1, background: 'var(--ifm-card-background-color)', border: `1px solid ${hov ? color + '66' : color + '30'}`, borderTop: `4px solid ${color}`, borderRadius: '12px', padding: '22px', transition: 'border-color 0.15s, box-shadow 0.15s', boxShadow: hov ? `0 8px 28px ${color}15` : '0 2px 8px rgba(0,0,0,0.08)', minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: '900', fontSize: '28px', color: color, lineHeight: 1, letterSpacing: '-1px' }}>{pcLabel}</div>
          <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--ifm-font-color-base)', marginTop: '4px' }}>{axiName}</div>
          <div style={{ fontSize: '12px', opacity: 0.55, marginTop: '2px', color: 'var(--ifm-font-color-base)' }}>{axiSub}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'monospace', fontSize: '22px', fontWeight: '800', color: color }}>{variancePct}%</div>
          <div style={{ fontSize: '10px', opacity: 0.45, color: 'var(--ifm-font-color-base)' }}>variance · λ={lambda}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', padding: '14px', background: `${color}08`, border: `1px solid ${color}20`, borderRadius: '8px', marginBottom: '16px' }}>
        <RhoDisplay value={topRho} label={topRhoLabel} color={color} isBig />
        <RhoDisplay value={secondRho} label={secondRhoLabel} color={color} isBig={false} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '10px', opacity: 0.4, marginBottom: '2px', color: 'var(--ifm-font-color-base)' }}>Top absolute loading</div>
          <div style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: '600', color: 'var(--ifm-font-color-base)' }}>{topLoading}</div>
        </div>
        <div style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '16px', color: color }}>{topLoadingW > 0 ? '+' : ''}{topLoadingW.toFixed(3)}</div>
      </div>

      <div style={{ marginBottom: warning ? '14px' : '0' }}>
        <div style={{ fontSize: '10px', opacity: 0.4, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ifm-font-color-base)' }}>Family share of top-10 |loadings|</div>
        <FamilyBar families={families} />
      </div>

      {warning && (<div style={{ padding: '8px 12px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '6px', fontSize: '11px', color: 'var(--ifm-font-color-base)', lineHeight: 1.5 }}>⚠️ {warning}</div>)}
    </div>
  );
}

export default function PCAxisCards({ run: runProp }) {
  const run = resolveRun(runProp, 'pca');
  const m = run.metrics;
  const g1 = m.gaia_spearman.PC1;
  const g2 = m.gaia_spearman.PC2;
  const [l1] = m.loadings.PC1;
  const [l2] = m.loadings.PC2;
  const pct = (x) => Number((x * 100).toFixed(1));
  return (
    <div style={{ display: 'flex', gap: '16px', margin: '28px 0', flexWrap: 'wrap' }}>
      <PCCard pcLabel="PC1" axiName="Thermal Axis" axiSub="Dominant effective temperature" color="#38BDF8" variancePct={pct(m.variance[0])} lambda={fmt.num(m.eigenvalues[0], 2)} topRho={g1.teff_gspphot} topRhoLabel="Teff" secondRho={g1.bp_rp} secondRhoLabel="GBP−GRP" families={toBar(familyShares(m.loadings.PC1))} topLoading={prettyFeature(l1.feature)} topLoadingW={l1.loading} warning={null} />
      <PCCard pcLabel="PC2" axiName="Metallicity Axis" axiSub="Chemical composition + SNR contamination" color="#F59E0B" variancePct={pct(m.variance[1])} lambda={fmt.num(m.eigenvalues[1], 2)} topRho={g2.mh_gspphot} topRhoLabel="[M/H]" secondRho={g2.snr_r} secondRhoLabel="SNR_r" families={toBar(familyShares(m.loadings.PC2))} topLoading={prettyFeature(l2.feature)} topLoadingW={l2.loading} warning={`ρ(SNRr) = ${fmt.signed(g2.snr_r)}: PC2 contains a share of instrumental variance — it is not a pure metallicity axis.`} />
    </div>
  );
}
