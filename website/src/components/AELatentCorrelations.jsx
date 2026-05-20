import React from 'react';

const DATA = {
  ae:  { axis1: { teff: +0.019, logg: +0.340, feh: -0.224, bprp: -0.320, interp: 'Surface gravity (log g)' }, axis2: { teff: +0.793, logg: -0.112, feh: -0.542, bprp: -0.770, interp: 'Temperature + metallicity' } },
  pca: { pc1:   { teff: +0.831, logg: -0.155, feh: -0.548, bprp: -0.768, interp: 'Thermal (T_eff)' },         pc2:   { teff: +0.156, logg: +0.081, feh: -0.082, bprp: -0.025, interp: 'Mixed (weak signal)' } },
};

const PARAMS = [
  { key: 'teff', label: 'Teff (K)',     color: '#F59E0B' },
  { key: 'logg', label: 'log g (dex)', color: '#34D399' },
  { key: 'feh',  label: '[Fe/H] (dex)',color: '#C084FC' },
  { key: 'bprp', label: 'G_BP−G_RP',  color: '#60A5FA' },
];

function RhoBar({ value, color, maxAbs = 1.0 }) {
  const abs = Math.abs(value); const w = (abs / maxAbs) * 100; const pos = value >= 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', height: '18px' }}>
      <div style={{ flex: 1, height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', ...(pos ? { left: '50%' } : { right: '50%' }), width: `${w / 2}%`, top: 0, bottom: 0, background: pos ? color : `${color}aa`, borderRadius: '3px' }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.15)' }} />
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: '11.5px', fontWeight: '700', color: abs > 0.5 ? color : 'var(--ifm-font-color-base)', opacity: abs > 0.5 ? 1 : 0.6, width: '44px', textAlign: 'right', flexShrink: 0 }}>
        {value >= 0 ? '+' : ''}{value.toFixed(3)}
      </div>
    </div>
  );
}

function AxisCard({ title, axisLabel, interp, values, color, isDiscovery }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ flex: 1, background: hov ? `${color}0a` : isDiscovery ? `${color}05` : 'var(--ifm-card-background-color)', border: `1px solid ${hov ? color + '50' : isDiscovery ? color + '30' : 'rgba(255,255,255,0.07)'}`, borderTop: `3px solid ${color}`, borderRadius: '8px', padding: '14px', transition: 'all 0.14s', cursor: 'default', minWidth: 0 }}>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
          <div style={{ fontFamily: 'monospace', fontWeight: '800', fontSize: '13px', color }}>{axisLabel}</div>
          {isDiscovery && (<div style={{ background: `${color}18`, border: `1px solid ${color}35`, borderRadius: '4px', padding: '1px 6px', fontSize: '9px', fontWeight: '700', color }}>Discovery</div>)}
        </div>
        <div style={{ fontSize: '11.5px', fontWeight: '600', color, opacity: 0.8 }}>{interp}</div>
        <div style={{ fontSize: '10px', opacity: 0.4, marginTop: '2px', color: 'var(--ifm-font-color-base)', fontStyle: 'italic' }}>{title}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
        {PARAMS.map((p) => (
          <div key={p.key} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', alignItems: 'center', gap: '8px' }}>
            <div style={{ fontSize: '11px', color: p.color, fontWeight: '600', opacity: 0.85 }}>{p.label}</div>
            <RhoBar value={values[p.key]} color={p.color} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AELatentCorrelations() {
  return (
    <div style={{ margin: '28px 0' }}>
      <div style={{ padding: '14px 18px', background: 'rgba(192,132,252,0.08)', border: '1px solid rgba(192,132,252,0.3)', borderRadius: '10px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '22px', flexShrink: 0 }}>🔄</div>
        <div>
          <div style={{ fontWeight: '800', fontSize: '14px', color: '#C084FC', marginBottom: '4px' }}>
            Discovery — the autoencoder encodes gravity on its first axis
          </div>
          <div style={{ fontSize: '12.5px', color: 'var(--ifm-font-color-base)', opacity: 0.8, lineHeight: 1.55 }}>
            Unlike PCA (PC1 = temperature, ρ = +0.831), the autoencoder's first latent axis is weakly correlated with T_eff (ρ = +0.019) but moderately with log g (ρ = +0.340). Axis 2 encodes temperature (ρ = +0.793). This inversion suggests that the <strong>non-linear structure of gravity</strong> is more salient in the network's learned space.
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.4, marginBottom: '8px', color: '#C084FC' }}>Autoencoder (z = 2)</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <AxisCard title="Autoencoder" axisLabel="AE axis 1" interp="Surface gravity" values={DATA.ae.axis1} color="#34D399" isDiscovery={true} />
            <AxisCard title="Autoencoder" axisLabel="AE axis 2" interp="Effective temperature" values={DATA.ae.axis2} color="#F59E0B" />
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.4, marginBottom: '8px', color: '#38BDF8' }}>PCA — linear baseline</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <AxisCard title="PCA" axisLabel="PC1" interp="Effective temperature" values={DATA.pca.pc1} color="#38BDF8" />
            <AxisCard title="PCA" axisLabel="PC2" interp="Mixed (weak signal)" values={DATA.pca.pc2} color="#94A3B8" />
          </div>
        </div>
      </div>

      <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '9px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 80px 80px', padding: '7px 14px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)', gap: '8px' }}>
          {['Method / axis', 'ρ(Teff)', 'ρ(log g)', 'ρ([Fe/H])', 'ρ(BP−RP)', 'Interpretation'].map((h) => (
            <div key={h} style={{ fontSize: '9.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.35, color: 'var(--ifm-font-color-base)' }}>{h}</div>
          ))}
        </div>
        {[
          { label: 'AE axis 1',  color: '#34D399', teff: +0.019, logg: +0.340, feh: -0.224, bprp: -0.320, interp: '← Gravity',       bold: true },
          { label: 'AE axis 2',  color: '#F59E0B', teff: +0.793, logg: -0.112, feh: -0.542, bprp: -0.770, interp: 'Thermal',         bold: false },
          { label: 'PCA — PC1',  color: '#38BDF8', teff: +0.831, logg: -0.155, feh: -0.548, bprp: -0.768, interp: '← Thermal',       bold: false },
          { label: 'PCA — PC2',  color: '#94A3B8', teff: +0.156, logg: +0.081, feh: -0.082, bprp: -0.025, interp: 'Weak / Mixed',    bold: false },
        ].map((r, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px 80px 80px', padding: '9px 14px', gap: '8px', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: r.bold ? `${r.color}06` : 'transparent', alignItems: 'center' }}>
            <code style={{ fontSize: '12px', fontWeight: r.bold ? '700' : '400', color: r.color }}>{r.label}</code>
            {[r.teff, r.logg, r.feh, r.bprp].map((v, j) => {
              const param = PARAMS[j]; const abs = Math.abs(v);
              return (<div key={j} style={{ fontFamily: 'monospace', fontSize: '11.5px', fontWeight: abs > 0.5 ? '700' : '400', color: abs > 0.5 ? param.color : 'var(--ifm-font-color-base)', opacity: abs > 0.5 ? 1 : 0.45 }}>{v >= 0 ? '+' : ''}{v.toFixed(3)}</div>);
            })}
            <div style={{ fontSize: '11px', fontWeight: r.bold ? '700' : '400', color: r.color, opacity: r.bold ? 0.9 : 0.5 }}>{r.interp}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
