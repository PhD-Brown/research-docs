import React from 'react';

const COLOR = '#F87171';
const WL_MIN = 3690; const WL_MAX = 9100;
function wlPct(l) { return ((l - WL_MIN) / (WL_MAX - WL_MIN)) * 100; }

const SLOPES = [
  { name: 'feature_slope_blue',             range: [3800, 4200], interp: 'UV — hot stars',              note: 'negative = blue spectrum' },
  { name: 'feature_slope_green',            range: [4500, 5500], interp: 'Mid visible',                 note: '' },
  { name: 'feature_slope_red',              range: [5500, 6500], interp: 'Red visible',                 note: '' },
  { name: 'feature_slope_deep_red',         range: [6500, 7500], interp: 'Near-IR — cool stars',        note: '' },
  { name: 'feature_continuum_slope_global', range: [3800, 7500], interp: 'Global blue/red slope',       note: '' },
];

const CURVATURES = [
  { name: 'feature_curvature_4000', centre: 4000, interp: '4000 Å break — age/metallicity boundary' },
  { name: 'feature_curvature_5000', centre: 5000, interp: 'Mid visible — blackbody curvature' },
  { name: 'feature_curvature_6000', centre: 6000, interp: 'Red — transition to IR' },
];

const JUMPS = [
  { name: 'feature_paschen_jump_strength',  desc: 'Paschen jump 8120/8220 Å',  indicator: 'Luminosity class',             available: true },
  { name: 'feature_break_4000A_strength',   desc: 'D4000 break strength',       indicator: 'Age / metallicity',            available: true },
  { name: 'feature_break_4000A_width',      desc: 'D4000 break width',          indicator: 'Age / metallicity',            available: true },
  { name: 'feature_balmer_jump_strength',   desc: 'Balmer jump 3646 Å',         indicator: 'NaN — outside LAMOST coverage',available: false },
  { name: 'feature_brackett_jump_strength', desc: 'Brackett jump 14,500 Å',     indicator: 'NaN — outside LAMOST coverage',available: false },
];

const COLORS_SYN = [
  { name: 'feature_continuum_asymmetry',   formula: '(f_blue − f_red) / (f_blue + f_red)', interp: 'Blue/red asymmetry' },
  { name: 'feature_flux_ratio_blue_red',   formula: 'f_blue / f_red',                       interp: 'B/R flux ratio' },
  { name: 'feature_UV_excess_3900',        formula: 'f(3850–3950) / f(4400–4600)',           interp: 'UV excess — A stars' },
  { name: 'feature_color_index_BlueRed',   formula: 'derived from flux',                     interp: 'Global colour proxy' },
  { name: 'feature_color_gr',              formula: 'magnitude g − r',                       interp: 'LAMOST g−r colour' },
  { name: 'feature_color_ri',              formula: 'magnitude r − i',                       interp: 'LAMOST r−i colour' },
  { name: 'feature_synthetic_BV',          formula: 'computed from spectrum',                interp: 'Synthetic B−V proxy' },
];

function SectionHeader({ title, count, color, icon }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', background: `${color}0e`, borderBottom: `1px solid ${color}25` }}>
      <span style={{ fontSize: '14px' }}>{icon}</span>
      <span style={{ fontWeight: '700', fontSize: '13px', color: color }}>{title}</span>
      <span style={{ marginLeft: 'auto', background: `${color}18`, border: `1px solid ${color}35`, borderRadius: '12px', padding: '1px 8px', fontSize: '10px', fontWeight: '700', color: color, fontFamily: 'monospace' }}>{count}</span>
    </div>
  );
}

function SlopeRow({ name, range, interp, note }) {
  const [hov, setHov] = React.useState(false);
  const leftPct = wlPct(range[0]); const widthPct = wlPct(range[1]) - leftPct;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: 'grid', gridTemplateColumns: '220px 1fr 160px', alignItems: 'center', gap: '12px', padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: hov ? `${COLOR}09` : 'transparent', transition: 'background 0.1s', cursor: 'default' }}>
      <code style={{ fontSize: '11px', color: hov ? COLOR : 'var(--ifm-font-color-base)', opacity: hov ? 1 : 0.75, lineHeight: 1.3 }}>{name}</code>
      <div style={{ position: 'relative', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: `${leftPct}%`, width: `${widthPct}%`, top: 0, bottom: 0, background: `linear-gradient(90deg, ${COLOR}88, ${COLOR})`, borderRadius: '3px' }} />
      </div>
      <div>
        <div style={{ fontSize: '11.5px', fontWeight: '600', color: 'var(--ifm-font-color-base)', opacity: 0.8 }}>{interp}</div>
        {note && <div style={{ fontSize: '10px', opacity: 0.4, fontFamily: 'monospace', color: 'var(--ifm-font-color-base)' }}>{note}</div>}
      </div>
    </div>
  );
}

function CurvatureRow({ name, centre, interp }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: 'grid', gridTemplateColumns: '220px 60px 1fr', alignItems: 'center', gap: '12px', padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: hov ? `${COLOR}09` : 'transparent', transition: 'background 0.1s', cursor: 'default' }}>
      <code style={{ fontSize: '11px', color: hov ? COLOR : 'var(--ifm-font-color-base)', opacity: hov ? 1 : 0.75 }}>{name}</code>
      <div style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '700', color: COLOR }}>{centre} Å</div>
      <div style={{ fontSize: '11.5px', opacity: 0.7, color: 'var(--ifm-font-color-base)' }}>{interp}</div>
    </div>
  );
}

function JumpRow({ name, desc, indicator, available }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: 'grid', gridTemplateColumns: '220px 1fr auto', alignItems: 'center', gap: '12px', padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: hov ? `${COLOR}09` : 'transparent', transition: 'background 0.1s', cursor: 'default', opacity: available ? 1 : 0.5 }}>
      <code style={{ fontSize: '11px', color: hov && available ? COLOR : 'var(--ifm-font-color-base)', opacity: hov ? 1 : 0.75 }}>{name}</code>
      <div>
        <div style={{ fontSize: '11.5px', fontWeight: '500', color: 'var(--ifm-font-color-base)', opacity: 0.8 }}>{desc}</div>
        <div style={{ fontSize: '10.5px', opacity: 0.5, marginTop: '1px', fontStyle: 'italic', color: 'var(--ifm-font-color-base)' }}>{indicator}</div>
      </div>
      <div style={{ fontSize: '11px', fontWeight: '700', color: available ? '#34D399' : '#F87171', padding: '2px 8px', background: available ? 'rgba(52,211,153,0.1)' : 'rgba(248,113,113,0.1)', border: `1px solid ${available ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)'}`, borderRadius: '4px', whiteSpace: 'nowrap' }}>
        {available ? '✓ active' : '✗ NaN'}
      </div>
    </div>
  );
}

function ColorRow({ name, formula, interp }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: 'grid', gridTemplateColumns: '200px 1fr 160px', alignItems: 'center', gap: '12px', padding: '8px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: hov ? `${COLOR}09` : 'transparent', transition: 'background 0.1s', cursor: 'default' }}>
      <code style={{ fontSize: '11px', color: hov ? COLOR : 'var(--ifm-font-color-base)', opacity: hov ? 1 : 0.75 }}>{name}</code>
      <div style={{ fontFamily: 'monospace', fontSize: '11px', color: COLOR, opacity: 0.8 }}>{formula}</div>
      <div style={{ fontSize: '11.5px', opacity: 0.7, color: 'var(--ifm-font-color-base)' }}>{interp}</div>
    </div>
  );
}

export default function ContinuumDescriptors() {
  const hdr = (cols) => (
    <div style={{ display: 'grid', gridTemplateColumns: cols, gap: '12px', padding: '4px 14px 6px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      {['Feature', 'Position 3690–9100 Å', 'Interpretation'].slice(0, cols.split(' ').length).map((h) => (
        <div key={h} style={{ fontSize: '9.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.35, color: 'var(--ifm-font-color-base)' }}>{h}</div>
      ))}
    </div>
  );

  return (
    <div style={{ margin: '20px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '9px', overflow: 'hidden' }}>
        <SectionHeader title="Local slopes — sigma-clipped (σ = 2.5)" count={`${SLOPES.length} features`} color={COLOR} icon="〜" />
        <div style={{ padding: '6px 0 2px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 160px', gap: '12px', padding: '4px 14px 6px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            {['Feature', 'Position 3690–9100 Å', 'Interpretation'].map((h) => (<div key={h} style={{ fontSize: '9.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.35, color: 'var(--ifm-font-color-base)' }}>{h}</div>))}
          </div>
          {SLOPES.map((s) => <SlopeRow key={s.name} {...s} />)}
        </div>
      </div>

      <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '9px', overflow: 'hidden' }}>
        <SectionHeader title="Local curvatures — Savitzky-Golay (second derivative)" count={`${CURVATURES.length} features`} color={COLOR} icon="∪" />
        <div style={{ padding: '6px 0 2px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 60px 1fr', gap: '12px', padding: '4px 14px 6px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            {['Feature', 'Centre', 'Interpretation'].map((h) => (<div key={h} style={{ fontSize: '9.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.35, color: 'var(--ifm-font-color-base)' }}>{h}</div>))}
          </div>
          {CURVATURES.map((c) => <CurvatureRow key={c.name} {...c} />)}
        </div>
      </div>

      <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '9px', overflow: 'hidden' }}>
        <SectionHeader title="Spectral breaks — continuum discontinuities" count={`${JUMPS.length} features`} color={COLOR} icon="↑" />
        <div style={{ padding: '6px 0 2px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr auto', gap: '12px', padding: '4px 14px 6px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            {['Feature', 'Description', 'Status'].map((h) => (<div key={h} style={{ fontSize: '9.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.35, color: 'var(--ifm-font-color-base)' }}>{h}</div>))}
          </div>
          {JUMPS.map((j) => <JumpRow key={j.name} {...j} />)}
        </div>
      </div>

      <div style={{ border: '1px solid rgba(255,255,255,0.07)', borderRadius: '9px', overflow: 'hidden' }}>
        <SectionHeader title="Asymmetry and synthetic colours" count={`${COLORS_SYN.length} features`} color={COLOR} icon="≈" />
        <div style={{ padding: '6px 0 2px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr 160px', gap: '12px', padding: '4px 14px 6px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            {['Feature', 'Formula', 'Interpretation'].map((h) => (<div key={h} style={{ fontSize: '9.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.35, color: 'var(--ifm-font-color-base)' }}>{h}</div>))}
          </div>
          {COLORS_SYN.map((c) => <ColorRow key={c.name} {...c} />)}
        </div>
      </div>

      <div style={{ fontSize: '11px', opacity: 0.45, color: 'var(--ifm-font-color-base)', fontStyle: 'italic', paddingLeft: '4px' }}>
        All continuum features are computed on the normalised spectrum after sigma-clipping. NaN values correspond to wavelengths outside LAMOST coverage (3,690–9,100 Å).
      </div>
    </div>
  );
}
