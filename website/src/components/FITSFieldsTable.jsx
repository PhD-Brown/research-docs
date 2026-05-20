import React from 'react';

const CATEGORIES = ['All', 'Identification', 'Observation', 'Spectral', 'Quality'];

const FIELDS = [
  // Identification
  { field: 'OBSID',      cat: 'Identification', type: 'int',    desc: 'Unique observation identifier',          role: 'Primary cross-match key',    color: '#38BDF8' },
  { field: 'DESIGNID',   cat: 'Identification', type: 'int',    desc: 'Observation plan identifier',            role: 'Master catalogue',           color: '#38BDF8' },
  { field: 'FILENAME',   cat: 'Identification', type: 'str',    desc: 'Source FITS file name',                  role: 'Traceability',               color: '#38BDF8' },
  { field: 'CLASS',      cat: 'Identification', type: 'str',    desc: 'LAMOST spectral type (STAR/GALAXY/QSO)', role: 'Classification target',      color: '#38BDF8' },
  { field: 'SUBCLASS',   cat: 'Identification', type: 'str',    desc: 'Spectral subclass (A, F, G, K, M…)',    role: 'Classification target',      color: '#38BDF8' },
  // Observation
  { field: 'RA',         cat: 'Observation',    type: 'float',  desc: 'Right ascension (degrees J2000)',        role: 'Excluded — geographic bias',  color: '#F87171', excluded: true },
  { field: 'DEC',        cat: 'Observation',    type: 'float',  desc: 'Declination (degrees J2000)',            role: 'Excluded — geographic bias',  color: '#F87171', excluded: true },
  { field: 'LMJD',       cat: 'Observation',    type: 'int',    desc: 'LAMOST Modified Julian Date',            role: 'Temporal metadata',          color: '#F59E0B' },
  { field: 'PLANID',     cat: 'Observation',    type: 'str',    desc: 'Nightly observation plan ID',            role: 'Download organisation',      color: '#F59E0B' },
  { field: 'SEEING',     cat: 'Observation',    type: 'float',  desc: 'Atmospheric seeing (arcsec)',             role: 'Excluded — instrumental bias',color: '#F87171', excluded: true },
  // Spectral
  { field: 'Z',          cat: 'Spectral',       type: 'float',  desc: 'Measured redshift (radial velocity)',    role: 'Excluded — LAMOST metadata', color: '#F87171', excluded: true },
  { field: 'Z_ERR',      cat: 'Spectral',       type: 'float',  desc: 'Redshift uncertainty',                   role: 'LAMOST metadata',            color: '#A78BFA' },
  { field: 'COEFF0',     cat: 'Spectral',       type: 'float',  desc: 'λ₀ of spectrum (WCS — log or linear)',  role: 'λ grid reconstruction',      color: '#A78BFA' },
  { field: 'COEFF1',     cat: 'Spectral',       type: 'float',  desc: 'Spectral step dλ/dpixel',               role: 'λ grid reconstruction',      color: '#A78BFA' },
  // Quality
  { field: 'SNR_U',      cat: 'Quality',        type: 'float',  desc: 'Signal-to-noise ratio band u (~3700 Å)', role: 'UV quality',                 color: '#34D399' },
  { field: 'SNR_G',      cat: 'Quality',        type: 'float',  desc: 'Signal-to-noise ratio band g (~5000 Å)', role: 'Green visible quality',      color: '#34D399' },
  { field: 'SNR_R',      cat: 'Quality',        type: 'float',  desc: 'Signal-to-noise ratio band r (~6500 Å)', role: 'Retained threshold: SNR_r > 10', color: '#34D399', important: true },
  { field: 'SNR_I',      cat: 'Quality',        type: 'float',  desc: 'Signal-to-noise ratio band i (~7500 Å)', role: 'Near-IR quality',            color: '#34D399' },
  { field: 'SNR_Z',      cat: 'Quality',        type: 'float',  desc: 'Signal-to-noise ratio band z (~9000 Å)', role: 'Deep IR quality',            color: '#34D399' },
];

const TYPE_COLORS = {
  int:   '#60A5FA',
  float: '#FBBF24',
  str:   '#34D399',
};

export default function FITSFieldsTable() {
  const [activeCat, setActiveCat] = React.useState('All');
  const [hovIdx, setHovIdx] = React.useState(null);

  const visible = activeCat === 'All' ? FIELDS : FIELDS.filter((f) => f.cat === activeCat);

  return (
    <div style={{ margin: '28px 0' }}>
      {/* Filter chips */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCat === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              style={{
                background: isActive ? 'rgba(56,189,248,0.12)' : 'transparent',
                border: `1px solid ${isActive ? 'rgba(56,189,248,0.4)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '6px',
                padding: '4px 12px',
                fontSize: '11px',
                fontWeight: isActive ? '700' : '400',
                color: isActive ? '#38BDF8' : 'var(--ifm-font-color-base)',
                opacity: isActive ? 1 : 0.6,
                cursor: 'pointer',
                transition: 'all 0.12s',
              }}
            >
              {cat}
              {cat !== 'All' && (
                <span style={{ marginLeft: '5px', opacity: 0.5, fontFamily: 'monospace', fontSize: '10px' }}>
                  ({FIELDS.filter((f) => f.cat === cat).length})
                </span>
              )}
            </button>
          );
        })}

        {/* Legend */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px', alignItems: 'center' }}>
          {Object.entries(TYPE_COLORS).map(([t, c]) => (
            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', opacity: 0.5, color: 'var(--ifm-font-color-base)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: c }} />
              {t}
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', opacity: 0.5, color: '#F87171' }}>
            ✗ excluded (spectro_only)
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: '10px',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '120px 80px 100px 1fr 1fr',
          padding: '8px 14px',
          background: 'rgba(255,255,255,0.03)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          gap: '10px',
        }}>
          {['FITS Field', 'Type', 'Category', 'Description', 'Role in AstroSpectro'].map((h) => (
            <div key={h} style={{
              fontSize: '9.5px',
              fontWeight: '700',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              opacity: 0.35,
              color: 'var(--ifm-font-color-base)',
            }}>{h}</div>
          ))}
        </div>

        {visible.map((f, i) => {
          const isHov = hovIdx === i;
          return (
            <div
              key={i}
              onMouseEnter={() => setHovIdx(i)}
              onMouseLeave={() => setHovIdx(null)}
              style={{
                display: 'grid',
                gridTemplateColumns: '120px 80px 100px 1fr 1fr',
                padding: '9px 14px',
                gap: '10px',
                alignItems: 'center',
                borderBottom: i < visible.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                background: isHov
                  ? `${f.color}0a`
                  : f.excluded ? 'rgba(248,113,113,0.03)'
                  : f.important ? 'rgba(52,211,153,0.04)'
                  : i % 2 === 0 ? 'rgba(255,255,255,0.01)' : 'transparent',
                transition: 'background 0.1s',
                cursor: 'default',
                opacity: f.excluded ? 0.7 : 1,
              }}
            >
              <code style={{
                fontSize: '12px',
                fontWeight: '700',
                color: isHov ? f.color : (f.excluded ? '#F87171' : 'var(--ifm-font-color-base)'),
                opacity: f.excluded ? 0.75 : 1,
                transition: 'color 0.1s',
              }}>
                {f.excluded && <span style={{ marginRight: '4px', fontSize: '10px' }}>✗</span>}
                {f.important && <span style={{ marginRight: '4px', fontSize: '10px' }}>★</span>}
                {f.field}
              </code>

              <div>
                <code style={{
                  fontSize: '10px',
                  background: `${TYPE_COLORS[f.type]}18`,
                  border: `1px solid ${TYPE_COLORS[f.type]}35`,
                  borderRadius: '4px',
                  padding: '1px 6px',
                  color: TYPE_COLORS[f.type],
                }}>{f.type}</code>
              </div>

              <div style={{ fontSize: '10.5px', opacity: 0.45, color: 'var(--ifm-font-color-base)', fontStyle: 'italic' }}>
                {f.cat}
              </div>

              <div style={{
                fontSize: '12px',
                color: 'var(--ifm-font-color-base)',
                opacity: 0.65,
                lineHeight: 1.4,
              }}>{f.desc}</div>

              <div style={{
                fontSize: '11.5px',
                fontWeight: f.important ? '700' : f.excluded ? '600' : '400',
                color: f.excluded ? '#F87171' : f.important ? '#34D399' : 'var(--ifm-font-color-base)',
                opacity: f.excluded || f.important ? 0.9 : 0.55,
                lineHeight: 1.4,
              }}>{f.role}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '8px', fontSize: '11px', opacity: 0.4, color: 'var(--ifm-font-color-base)' }}>
        ★ retained quality filter threshold · ✗ excluded by <code>spectro_only=True</code>
      </div>
    </div>
  );
}
