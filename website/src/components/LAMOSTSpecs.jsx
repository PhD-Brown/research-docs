import React from 'react';

const SPECS = [
  {
    group: 'Telescope',
    color: '#38BDF8',
    fields: [
      { label: 'Full name',        value: 'Large Sky Area Multi-Object Fiber Spectroscopic Telescope', mono: false },
      { label: 'Location',         value: 'Xinglong Astronomical Station, Hebei, China (alt. 900 m)', mono: false },
      { label: 'Primary mirror',   value: '4 m × 3.7 m (segmented, active)', mono: false },
      { label: 'Field of view',    value: '5° diameter — largest in the world', mono: false },
      { label: 'Optical fibres',   value: '4,000 simultaneous fibres', mono: false },
    ],
  },
  {
    group: 'Spectral',
    color: '#A78BFA',
    fields: [
      { label: 'Spectral coverage',         value: '3,690–9,100 Å (blue arm + red arm)', mono: true },
      { label: 'Spectral resolution',       value: 'R ≈ 1,800 (low resolution)', mono: true },
      { label: 'Channels per spectrum',     value: '3,921 channels', mono: true },
      { label: 'Instrumental cut',          value: '~5,900 Å (blue/red arm separation)', mono: true },
    ],
  },
  {
    group: 'Data Release 5',
    color: '#34D399',
    fields: [
      { label: 'Total DR5 spectra',         value: '> 9 million spectra', mono: false },
      { label: 'Observational period',      value: '2011–2017', mono: false },
      { label: 'Distribution format',      value: '.fits.gz (gzip-compressed FITS)', mono: true },
      { label: 'Public access',            value: 'http://dr5.lamost.org/', mono: true },
    ],
  },
  {
    group: 'AstroSpectro — subset',
    color: '#F59E0B',
    fields: [
      { label: 'Downloaded spectra',        value: '~250,000 FITS files', mono: false },
      { label: 'After quality filtering',   value: 'N = 43,019 (SNR > 10 · RUWE < 1.4)', mono: false },
      { label: 'Extracted features',        value: 'p = 183 (spectro_only=True mode)', mono: false },
      { label: 'Gaia DR3 cross-match',     value: '1″ radius · ~100% of stars matched', mono: false },
    ],
  },
];

export default function LAMOSTSpecs() {
  const [activeGroup, setActiveGroup] = React.useState(null);

  return (
    <div style={{ margin: '28px 0' }}>
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '0', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {SPECS.map((g) => {
          const isActive = activeGroup === g.group || (activeGroup === null && g.group === SPECS[0].group);
          return (
            <button key={g.group} onClick={() => setActiveGroup(g.group)} style={{ background: isActive ? `${g.color}14` : 'transparent', border: 'none', borderBottom: `3px solid ${isActive ? g.color : 'transparent'}`, padding: '9px 16px', cursor: 'pointer', fontSize: '12px', fontWeight: isActive ? '700' : '400', color: isActive ? g.color : 'var(--ifm-font-color-base)', opacity: isActive ? 1 : 0.5, borderRadius: '6px 6px 0 0', marginBottom: '-1px', transition: 'all 0.13s' }}>{g.group}</button>
          );
        })}
      </div>

      {SPECS.map((g) => {
        const isActive = activeGroup === g.group || (activeGroup === null && g.group === SPECS[0].group);
        if (!isActive) return null;
        return (
          <div key={g.group} style={{ background: 'var(--ifm-card-background-color)', border: `1px solid ${g.color}25`, borderTop: 'none', borderRadius: '0 0 10px 10px' }}>
            {g.fields.map((f, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', alignItems: 'center', gap: '16px', padding: '12px 18px', borderBottom: i < g.fields.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                <div style={{ fontSize: '12px', color: 'var(--ifm-font-color-base)', opacity: 0.55, fontWeight: '500' }}>{f.label}</div>
                <div style={{ fontFamily: f.mono ? "'JetBrains Mono', monospace" : 'inherit', fontSize: f.mono ? '13px' : '14px', fontWeight: '600', color: g.color }}>{f.value}</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
