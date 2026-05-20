import React from 'react';

const FAMILIES = [
  { name: 'Balmer lines', range: 'Hα – Hθ', count: '~35', indicator: 'Teff — thermal axis PC1', color: '#60A5FA', description: 'Hydrogen absorption series. Primary thermal indicator: maximum strength around 10,000 K (type A), weakens toward M and O.', lines: 'Hα 6563 Å · Hβ 4861 Å · Hγ 4341 Å · Hδ 4102 Å · Hθ 3798 Å', pcaRole: 'PC1 (Balmer: 31.5%)' },
  { name: 'Ca II H&K + IR triplet', range: 'H 3968 · K 3933 · IR 8498–8662', count: '~20', indicator: 'Metallicity + chromospheric activity', color: '#C084FC', description: 'Ionised calcium in absorption. Sensitive to both metallicity ([Ca/H]) and stellar magnetic activity (emission core filling).', lines: 'Ca II H 3968 Å · Ca II K 3933 Å · IR triplet 8498, 8542, 8662 Å', pcaRole: 'PC1 (Ca: 22.4%) · SHAP top-3' },
  { name: 'Magnesium & α-elements', range: 'Mg b · Mg I 5184 · Mg II', count: '~15', indicator: '[Mg/Fe] · stellar population', color: '#34D399', description: 'Mg b triplet and magnesium lines. Tracers of α-element enrichment — discriminates halo and Galactic disk populations.', lines: 'Mg b 5167–5183 Å · Mg I 5184 Å · Mg II 4481 Å', pcaRole: 'PC1 (W(Mgb) = −0.171)' },
  { name: 'Iron peak metals', range: 'Fe, Cr, V, Ni, Ba, Sr...', count: '~30', indicator: '[Fe/H] · metallicity', color: '#FB923C', description: 'Iron peak element lines. Direct measurement of iron abundance and heavy metals. Dominate PC2.', lines: 'Fe I 5270, 5335 Å · Cr I · V I · Ni I · Ba II · Sr II', pcaRole: 'PC2 ([Fe/H]proxy: 0.205)' },
  { name: 'Lick/SDSS/CaH indices', range: 'Lick IDS indices · CaH · TiO', count: '~18', indicator: 'Age + composite metallicity', color: '#FBBF24', description: 'Standardised spectral indices. Narrow-band combinations calibrated to measure age and metallicity of stellar populations.', lines: 'Lick IDS indices · CaH1, CaH2 · TiO1, TiO2 · SDSS composites', pcaRole: 'PC2 (Idxmétal: 0.198)' },
  { name: 'Continuum · slopes · colours', range: 'Flux ratios · photom. indices', count: '~65', indicator: 'Teff (slope) · luminosity (breaks)', color: '#F87171', description: 'Global spectral continuum shape. Largest family by count. Encodes temperature via blackbody slope and luminosity via spectral breaks.', lines: 'fblue/fred · synthetic B−V · local slopes · photometric indices', pcaRole: 'PC1 (continuum: fblue/fred = 0.161)' },
];

function FamilyCard({ name, range, count, indicator, color, description, lines, pcaRole }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: 'var(--ifm-card-background-color)', border: `1px solid ${hovered ? color + '50' : 'rgba(255,255,255,0.07)'}`, borderLeft: `4px solid ${color}`, borderRadius: '10px', padding: '16px 18px', transition: 'transform 0.16s ease, box-shadow 0.16s ease, border-color 0.16s ease', transform: hovered ? 'translateX(3px)' : 'translateX(0)', boxShadow: hovered ? `0 4px 20px ${color}18` : '0 1px 4px rgba(0,0,0,0.06)', cursor: 'default', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: '700', fontSize: '14px', color: color, marginBottom: '2px', lineHeight: 1.3 }}>{name}</div>
          <div style={{ fontSize: '10.5px', fontFamily: "'JetBrains Mono', monospace", color: 'var(--ifm-font-color-base)', opacity: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{range}</div>
        </div>
        <div style={{ background: `${color}18`, border: `1px solid ${color}44`, borderRadius: '14px', padding: '3px 11px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', fontWeight: '800', color: color, whiteSpace: 'nowrap', flexShrink: 0 }}>{count}</div>
      </div>
      <div style={{ fontSize: '12px', color: 'var(--ifm-font-color-base)', opacity: 0.72, lineHeight: 1.55 }}>{description}</div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', color: color, opacity: 0.75, background: `${color}0c`, border: `1px solid ${color}22`, borderRadius: '5px', padding: '5px 9px', lineHeight: 1.5 }}>{lines}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: '600', color: color }}>
        <span style={{ opacity: 0.6 }}>→ PCA:</span>
        <span>{pcaRole}</span>
      </div>
    </div>
  );
}

export default function DescriptorFamilies() {
  const total = 183;
  return (
    <div style={{ margin: '24px 0' }}>
      <div style={{ display: 'flex', gap: '0', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '20px' }}>
        {FAMILIES.map((f) => { const n = parseInt(f.count.replace('~', ''), 10); return (<div key={f.name} title={`${f.name}: ${f.count} features`} style={{ flex: `0 0 ${(n / total) * 100}%`, background: f.color, opacity: 0.85 }} />); })}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '14px' }}>
        {FAMILIES.map((f) => <FamilyCard key={f.name} {...f} />)}
      </div>
      <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--ifm-font-color-base)', opacity: 0.5, textAlign: 'center' }}>
        183 features · 6 spectroscopic families ·{' '}
        <a href="/AstroSpectro/docs/science/features-list-183" style={{ color: 'inherit', textDecoration: 'underline dotted' }}>complete catalogue →</a>
      </div>
    </div>
  );
}
