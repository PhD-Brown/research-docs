// src/components/FamilyContributions.jsx
// Part de chaque famille de descripteurs dans Σ|loading| des 10 premiers loadings de PC1 et PC2
// (run PCA de référence, runs.json : metrics.loadings ; familles : featureFamily()).
// L'ancienne version affichait des pourcentages par famille sans source (31.5 %, 22.4 %, 43.3 %…) : le pack
// n'exporte que les 10 premiers loadings, d'où ce calcul sur le top-10.
//
// Usage :
//   <FamilyContributions />                            // run PCA de référence (registre FACTS_INDEX.md)
//   <FamilyContributions run="phy3500_pca_run_…" />

import React from 'react';
import { resolveRun, familyShares } from '@site/src/data/astrospectro';

function familiesOf(run) {
  const s1 = familyShares(run.metrics.loadings.PC1);
  const s2 = familyShares(run.metrics.loadings.PC2);
  const max1 = Math.max(...s1.map((f) => f.pct));
  const max2 = Math.max(...s2.map((f) => f.pct));
  return s1.map((f, i) => ({
    name: f.label, sub: f.sub, color: f.color, pc1: f.pct, pc2: s2[i].pct,
    pc1dom: f.pct === max1, pc2dom: s2[i].pct === max2,
  }));
}

const top = (fams, key) => [...fams].sort((a, b) => b[key] - a[key]);

const MAX_PCT = 100;
const PC1_COLOR = '#38BDF8';
const PC2_COLOR = '#F59E0B';

function Row({ name, sub, pc1, pc2, color, pc1dom, pc2dom }) {
  const [hov, setHov] = React.useState(false);
  const pc1Width = (pc1 / MAX_PCT) * 100;
  const pc2Width = (pc2 / MAX_PCT) * 100;

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', alignItems: 'center', gap: '0', padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: hov ? `${color}08` : 'transparent', transition: 'background 0.12s', cursor: 'default' }}>
      <div>
        <div style={{ fontSize: '13px', fontWeight: '600', color: hov ? color : 'var(--ifm-font-color-base)', transition: 'color 0.12s', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: color, flexShrink: 0 }} />{name}
        </div>
        <div style={{ fontSize: '10px', opacity: 0.4, marginLeft: '14px', color: 'var(--ifm-font-color-base)' }}>{sub}</div>
      </div>
      <div style={{ paddingRight: '8px', paddingLeft: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '18px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${pc1Width}%`, height: '100%', background: pc1dom ? PC1_COLOR : `${PC1_COLOR}60`, borderRadius: '4px', transition: 'width 0.3s ease', display: 'flex', alignItems: 'center', paddingLeft: '6px' }}>
              {pc1 > 8 && (<span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: pc1dom ? '800' : '400', color: pc1dom ? '#000' : 'rgba(0,0,0,0.6)', whiteSpace: 'nowrap' }}>{pc1}%</span>)}
            </div>
          </div>
          {pc1 <= 8 && (<span style={{ fontSize: '11px', fontFamily: 'monospace', color: PC1_COLOR, opacity: 0.7, minWidth: '32px' }}>{pc1}%</span>)}
          {pc1dom && (<span style={{ fontSize: '9px', color: PC1_COLOR, fontWeight: '700', whiteSpace: 'nowrap' }}>★ dom.</span>)}
        </div>
      </div>
      <div style={{ paddingLeft: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ flex: 1, height: '18px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${pc2Width}%`, height: '100%', background: pc2dom ? PC2_COLOR : `${PC2_COLOR}60`, borderRadius: '4px', transition: 'width 0.3s ease', display: 'flex', alignItems: 'center', paddingLeft: '6px' }}>
              {pc2 > 8 && (<span style={{ fontSize: '11px', fontFamily: 'monospace', fontWeight: pc2dom ? '800' : '400', color: pc2dom ? '#000' : 'rgba(0,0,0,0.6)', whiteSpace: 'nowrap' }}>{pc2}%</span>)}
            </div>
          </div>
          {pc2 <= 8 && (<span style={{ fontSize: '11px', fontFamily: 'monospace', color: PC2_COLOR, opacity: 0.7, minWidth: '32px' }}>{pc2}%</span>)}
          {pc2dom && (<span style={{ fontSize: '9px', color: PC2_COLOR, fontWeight: '700', whiteSpace: 'nowrap' }}>★ dom.</span>)}
        </div>
      </div>
    </div>
  );
}

export default function FamilyContributions({ run }) {
  const FAMILIES = familiesOf(resolveRun(run, 'pca'));
  const [a1, b1] = top(FAMILIES, 'pc1');
  const [a2, b2] = top(FAMILIES, 'pc2');
  return (
    <div style={{ margin: '28px 0' }}>
      <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '10px 14px', gap: '0' }}>
          <div style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.4, color: 'var(--ifm-font-color-base)' }}>Family</div>
          <div style={{ paddingLeft: '8px', fontSize: '12px', fontWeight: '800', color: PC1_COLOR, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: PC1_COLOR }} />PC1 — Thermal axis
          </div>
          <div style={{ paddingLeft: '8px', fontSize: '12px', fontWeight: '800', color: PC2_COLOR, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: PC2_COLOR }} />PC2 — Metallicity axis
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr 1fr', padding: '4px 14px', background: 'rgba(255,255,255,0.01)', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <div />
          <div style={{ paddingLeft: '8px', fontSize: '9px', opacity: 0.3, color: 'var(--ifm-font-color-base)', fontFamily: 'monospace' }}>0%{'─'.repeat(10)}→ {MAX_PCT}%</div>
          <div style={{ paddingLeft: '8px', fontSize: '9px', opacity: 0.3, color: 'var(--ifm-font-color-base)', fontFamily: 'monospace' }}>0%{'─'.repeat(10)}→ {MAX_PCT}%</div>
        </div>
        {FAMILIES.map((f) => <Row key={f.name} {...f} />)}
      </div>
      <div style={{ marginTop: '6px', fontSize: '10.5px', opacity: 0.55, color: 'var(--ifm-font-color-base)' }}>
        Share of Σ|loading| over the 10 largest loadings of each component (the facts pack exports the top 10 only).
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '14px' }}>
        <div style={{ padding: '10px 14px', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '7px', fontSize: '12px', color: 'var(--ifm-font-color-base)', opacity: 0.8 }}>
          <strong style={{ color: '#38BDF8' }}>PC1 thermal:</strong> {a1.name} ({a1.pc1}%) + {b1.name} ({b1.pc1}%) of the top-10 |loadings| — the two leading families of the thermal axis.
        </div>
        <div style={{ padding: '10px 14px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '7px', fontSize: '12px', color: 'var(--ifm-font-color-base)', opacity: 0.8 }}>
          <strong style={{ color: '#F59E0B' }}>PC2 composition:</strong> {a2.name} ({a2.pc2}%) dominates the top-10 |loadings| of PC2, followed by {b2.name} ({b2.pc2}%).
        </div>
      </div>
    </div>
  );
}
