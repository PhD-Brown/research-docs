// src/components/LoadingsBars.jsx
// Top-5 loadings de PC1 et PC2 du run PCA de référence (runs.json : metrics.loadings), familles par
// featureFamily().
//
// Usage :
//   <LoadingsBars />                            // run PCA de référence (registre FACTS_INDEX.md)
//   <LoadingsBars run="phy3500_pca_run_…" />

import React from 'react';
import { resolveRun, prettyFeature, featureFamily, FEATURE_FAMILIES, fmt } from '@site/src/data/astrospectro';

const FAMILY_COLORS = Object.fromEntries(FEATURE_FAMILIES.map((f) => [f.key, f.color]));
const FAMILY_LABELS = Object.fromEntries(FEATURE_FAMILIES.map((f) => [f.key, f.label]));

function top5(loadings) {
  return loadings.slice(0, 5).map((l, i) => {
    const family = featureFamily(l.feature);
    return { rank: i + 1, descriptor: prettyFeature(l.feature), w: l.loading, family, familyLabel: FAMILY_LABELS[family] };
  });
}

const MAX_W = 0.22;

function LoadingBar({ rank, descriptor, w, family, familyLabel, maxW }) {
  const [hov, setHov] = React.useState(false);
  const color = FAMILY_COLORS[family];
  const pct = (Math.abs(w) / maxW) * 100;
  const isPos = w > 0;

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: 'grid', gridTemplateColumns: '20px 140px 1fr 60px', alignItems: 'center', gap: '10px', padding: '8px 12px', background: hov ? `${color}0c` : 'transparent', borderRadius: '6px', transition: 'background 0.12s', cursor: 'default' }}>
      <div style={{ fontFamily: 'monospace', fontSize: '11px', color: color, opacity: 0.6, textAlign: 'right' }}>{rank}</div>
      <div style={{ fontSize: '12.5px', fontFamily: 'monospace', color: 'var(--ifm-font-color-base)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{descriptor}</div>
      <div style={{ display: 'flex', alignItems: 'center', height: '16px', position: 'relative' }}>
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', left: isPos ? '50%' : `calc(50% - ${pct / 2}%)`, width: `${pct / 2}%`, height: '10px', top: '50%', transform: 'translateY(-50%)', background: hov ? color : `${color}cc`, borderRadius: isPos ? '0 3px 3px 0' : '3px 0 0 3px', transition: 'background 0.12s' }} />
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: '700', color: color, textAlign: 'right' }}>{w > 0 ? '+' : ''}{w.toFixed(3)}</div>
    </div>
  );
}

function PCPanel({ title, sub, color, loadings, indicator }) {
  return (
    <div style={{ background: 'var(--ifm-card-background-color)', border: `1px solid ${color}28`, borderTop: `3px solid ${color}`, borderRadius: '10px', overflow: 'hidden' }}>
      <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: '900', fontSize: '20px', color: color, lineHeight: 1, marginBottom: '4px' }}>{title}</div>
            <div style={{ fontSize: '12px', color: 'var(--ifm-font-color-base)', opacity: 0.55 }}>{sub}</div>
          </div>
          <div style={{ background: `${color}18`, border: `1px solid ${color}40`, borderRadius: '6px', padding: '6px 12px', textAlign: 'center' }}>
            <div style={{ fontSize: '10px', opacity: 0.6, color: 'var(--ifm-font-color-base)', marginBottom: '2px' }}>interpretation</div>
            <div style={{ fontWeight: '700', fontSize: '12px', color: color }}>{indicator}</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '20px 140px 1fr 60px', gap: '10px', padding: '6px 12px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ fontSize: '9px', opacity: 0.35, textAlign: 'right', color: 'var(--ifm-font-color-base)' }}>#</div>
        <div style={{ fontSize: '9px', opacity: 0.35, color: 'var(--ifm-font-color-base)' }}>Feature</div>
        <div style={{ fontSize: '9px', opacity: 0.35, textAlign: 'center', color: 'var(--ifm-font-color-base)' }}>← negative · · · · positive →</div>
        <div style={{ fontSize: '9px', opacity: 0.35, textAlign: 'right', color: 'var(--ifm-font-color-base)' }}>w</div>
      </div>

      <div style={{ padding: '6px 0 10px' }}>
        {loadings.map((l) => <LoadingBar key={l.rank} {...l} maxW={MAX_W} />)}
      </div>
    </div>
  );
}

export default function LoadingsBars({ run: runProp }) {
  const run = resolveRun(runProp, 'pca');
  const m = run.metrics;
  return (
    <div style={{ margin: '28px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
      <PCPanel title="PC1" sub={`thermal axis · ${fmt.pct(m.variance[0])} variance · ρ(Teff) = ${fmt.signed(m.gaia_spearman.PC1.teff_gspphot)}`} color="#38BDF8" loadings={top5(m.loadings.PC1)} indicator="Temperature T_eff" />
      <PCPanel title="PC2" sub={`metallicity axis · ${fmt.pct(m.variance[1])} variance`} color="#F59E0B" loadings={top5(m.loadings.PC2)} indicator="Metallicity [Fe/H]" />
    </div>
  );
}
