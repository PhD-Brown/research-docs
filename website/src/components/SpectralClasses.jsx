import React from 'react';

// Approximate blackbody colors for stellar spectral types
const CLASSES = [
  {
    letter: 'A',
    name: 'Hot stars',
    examples: 'Sirius, Vega, Altair',
    teff: '> 7 500 K',
    teffRange: [7500, 10000],
    color: '#93C5FD',        // pale blue-white
    bgColor: '#93C5FD',
    performance: 'Good',
    perfColor: '#FBBF24',
    perfNote: 'Rare in the sample',
    features: 'Very strong Balmer lines',
    fraction: '~2%',
  },
  {
    letter: 'F',
    name: 'Yellow-white stars',
    examples: 'Procyon, Canopus',
    teff: '6 000–7 500 K',
    teffRange: [6000, 7500],
    color: '#FEF9C3',
    bgColor: '#FEF3C7',
    performance: 'Good',
    perfColor: '#FBBF24',
    perfNote: 'Delicate F/G boundary',
    features: 'Moderate Balmer lines, weak Ca II',
    fraction: '~8%',
  },
  {
    letter: 'G',
    name: 'Solar-type stars',
    examples: 'Sun, Tau Ceti, Alpha Cen A',
    teff: '5 200–6 000 K',
    teffRange: [5200, 6000],
    color: '#FDE68A',
    bgColor: '#FDE047',
    performance: 'Good',
    perfColor: '#FBBF24',
    perfNote: 'Pivot class — F and K boundary',
    features: 'Moderate Ca II, weak Balmer lines',
    fraction: '~15%',
  },
  {
    letter: 'K',
    name: 'Orange stars',
    examples: 'Alpha Centauri B, Arcturus',
    teff: '3 700–5 200 K',
    teffRange: [3700, 5200],
    color: '#FCA5A1',
    bgColor: '#FB923C',
    performance: 'Very good',
    perfColor: '#34D399',
    perfNote: 'Large population — well represented',
    features: 'Strong Ca II, visible Mg b',
    fraction: '~35%',
  },
  {
    letter: 'M',
    name: 'Cool red stars',
    examples: 'Proxima Centauri, Betelgeuse',
    teff: '< 3 700 K',
    teffRange: [2400, 3700],
    color: '#FCA5A5',
    bgColor: '#DC2626',
    performance: 'Excellent',
    perfColor: '#34D399',
    perfNote: 'Highly distinctive TiO/VO/CaH bands',
    features: 'TiO, VO, CaH molecular bands',
    fraction: '~40%',
  },
];

function ClassCard({ letter, name, examples, teff, color, bgColor, performance, perfColor, perfNote, features, fraction }) {
  const [hov, setHov] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1,
        background: 'var(--ifm-card-background-color)',
        border: `1px solid ${hov ? bgColor + '66' : bgColor + '30'}`,
        borderTop: `4px solid ${bgColor}`,
        borderRadius: '10px',
        padding: '16px',
        transition: 'all 0.15s',
        boxShadow: hov ? `0 6px 20px ${bgColor}20` : 'none',
        cursor: 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        minWidth: 0,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          background: `radial-gradient(circle at 35% 35%, ${color}, ${bgColor}cc)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Georgia, serif',
          fontWeight: '900',
          fontSize: '22px',
          color: '#000',
          boxShadow: `0 0 16px ${bgColor}55`,
          flexShrink: 0,
          textShadow: '0 1px 2px rgba(255,255,255,0.3)',
        }}>{letter}</div>

        <div style={{ textAlign: 'right' }}>
          <div style={{
            background: `${perfColor}18`,
            border: `1px solid ${perfColor}44`,
            borderRadius: '5px',
            padding: '2px 8px',
            fontSize: '11px',
            fontWeight: '700',
            color: perfColor,
          }}>{performance}</div>
          <div style={{ fontSize: '10px', opacity: 0.4, marginTop: '3px', color: 'var(--ifm-font-color-base)' }}>
            {fraction} of dataset
          </div>
        </div>
      </div>

      {/* Name & Teff */}
      <div>
        <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--ifm-font-color-base)', marginBottom: '2px' }}>
          {name}
        </div>
        <div style={{
          fontFamily: 'monospace',
          fontSize: '12px',
          fontWeight: '700',
          color: bgColor,
        }}>{teff}</div>
      </div>

      {/* Teff bar */}
      <div style={{
        height: '4px',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: `linear-gradient(90deg, ${bgColor}88, ${bgColor})`,
          borderRadius: '2px',
        }} />
      </div>

      {/* Features */}
      <div style={{
        fontSize: '11px',
        color: 'var(--ifm-font-color-base)',
        opacity: 0.6,
        fontStyle: 'italic',
        lineHeight: 1.4,
      }}>{features}</div>

      {/* Examples */}
      <div style={{
        fontSize: '10.5px',
        color: bgColor,
        opacity: 0.8,
        borderTop: `1px solid ${bgColor}20`,
        paddingTop: '8px',
      }}>★ {examples}</div>

      {/* Perf note */}
      {hov && (
        <div style={{
          fontSize: '10.5px',
          color: 'var(--ifm-font-color-base)',
          opacity: 0.55,
          fontStyle: 'italic',
        }}>{perfNote}</div>
      )}
    </div>
  );
}

// Mini Harvard sequence temperature bar
function HarvardBar() {
  return (
    <div style={{ margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ fontSize: '10px', opacity: 0.4, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--ifm-font-color-base)' }}>
        Harvard sequence — effective temperature (K)
      </div>
      <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
        {CLASSES.map((c) => (
          <div key={c.letter} title={`${c.letter}: ${c.teff}`} style={{
            flex: c.teffRange[1] - c.teffRange[0],
            background: c.bgColor,
          }} />
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        {CLASSES.map((c) => (
          <div key={c.letter} style={{
            flex: c.teffRange[1] - c.teffRange[0],
            fontSize: '9px',
            fontFamily: 'monospace',
            fontWeight: '700',
            color: c.bgColor,
            textAlign: 'center',
          }}>{c.letter}</div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'monospace', opacity: 0.35, color: 'var(--ifm-font-color-base)' }}>
        <span>7 500+ K →</span>
        <span>← &lt; 3 700 K</span>
      </div>
    </div>
  );
}

export default function SpectralClasses() {
  return (
    <div style={{ margin: '28px 0' }}>
      <HarvardBar />
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {CLASSES.map((c) => <ClassCard key={c.letter} {...c} />)}
      </div>
      <div style={{
        marginTop: '12px',
        padding: '10px 14px',
        background: 'rgba(220,38,38,0.06)',
        border: '1px solid rgba(220,38,38,0.2)',
        borderRadius: '7px',
        fontSize: '12px',
        color: 'var(--ifm-font-color-base)',
        opacity: 0.8,
      }}>
        <strong style={{ color: '#DC2626' }}>Class M — Excellent</strong>: TiO, VO, and CaH molecular bands are absent from all hot types — class M is spectrally unmistakable. Hover over the cards for performance notes.
      </div>
    </div>
  );
}
