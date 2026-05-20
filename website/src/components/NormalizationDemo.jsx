import React from 'react';

function generateSpectrum(teff, scaleFactor, noise) {
  const n = 120;
  const lambdas = Array.from({ length: n }, (_, i) => 3690 + (i / n) * (9100 - 3690));
  return lambdas.map((lam, i) => {
    const x = 2898000 / (teff * lam);
    const bb = scaleFactor / (Math.exp(x) - 1) * 1e12;
    const ha  = lam > 6550 && lam < 6575 ? 0.25 : 0;
    const hb  = lam > 4850 && lam < 4875 ? 0.20 : 0;
    const caK = lam > 3920 && lam < 3940 ? 0.30 : 0;
    const split = lam > 5850 && lam < 5950 ? 0.05 : 0;
    const noiseVal = (Math.sin(i * 7.3) * 0.02 + Math.cos(i * 3.1) * 0.015) * noise;
    return { lambda: lam, flux: Math.max(0, bb * (1 - ha - hb - caK - split) + noiseVal * bb) };
  });
}

const STAR_A = generateSpectrum(9000, 1.8, 1);
const STAR_K = generateSpectrum(4500, 0.6, 1);

function normSpectrum(spectrum) {
  const fluxes = spectrum.map((p) => p.flux).filter((f) => f > 0);
  const sorted = [...fluxes].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)];
  return spectrum.map((p) => ({ lambda: p.lambda, flux: p.flux / median }));
}

const STAR_A_NORM = normSpectrum(STAR_A);
const STAR_K_NORM = normSpectrum(STAR_K);

function MiniSpectrum({ dataA, dataK, title, subtitle, yLabel, showAnnotations }) {
  const width = 320; const height = 100;
  const pad = { left: 36, right: 10, top: 10, bottom: 18 };
  const allFlux = [...dataA, ...dataK].map((p) => p.flux);
  const yMin = 0; const yMax = Math.max(...allFlux) * 1.12;
  const xMin = 3690; const xMax = 9100;
  function px(lambda) { return pad.left + ((lambda - xMin) / (xMax - xMin)) * (width - pad.left - pad.right); }
  function py(flux) { return height - pad.bottom - ((flux - yMin) / (yMax - yMin)) * (height - pad.top - pad.bottom); }
  function pathFor(data) { return data.map((p, i) => `${i === 0 ? 'M' : 'L'}${px(p.lambda).toFixed(1)},${py(p.flux).toFixed(1)}`).join(' '); }
  const ha_x = px(6563);

  return (
    <div style={{ background: '#06080f', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '14px', flex: 1, minWidth: 0 }}>
      <div style={{ marginBottom: '8px' }}>
        <div style={{ fontWeight: '700', fontSize: '13px', color: 'var(--ifm-font-color-base)' }}>{title}</div>
        <div style={{ fontSize: '10px', opacity: 0.45, color: 'var(--ifm-font-color-base)' }}>{subtitle}</div>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {[0.25, 0.5, 0.75, 1.0].map((f) => (<line key={f} x1={pad.left} y1={py(yMax * f)} x2={width - pad.right} y2={py(yMax * f)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />))}
        {showAnnotations && (<><line x1={ha_x} y1={pad.top} x2={ha_x} y2={height - pad.bottom} stroke="rgba(96,165,250,0.3)" strokeWidth="1" strokeDasharray="3,2" /><text x={ha_x + 2} y={pad.top + 10} fill="rgba(96,165,250,0.6)" fontSize="8" fontFamily="monospace">Hα</text></>)}
        <path d={pathFor(dataK)} fill="none" stroke="#FB923C" strokeWidth="1.5" opacity="0.85" />
        <path d={pathFor(dataA)} fill="none" stroke="#60A5FA" strokeWidth="1.5" opacity="0.85" />
        <line x1={pad.left} y1={pad.top} x2={pad.left} y2={height - pad.bottom} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
        <text x={4} y={height / 2} fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace" transform={`rotate(-90, 4, ${height / 2})`} textAnchor="middle">{yLabel}</text>
        {[4000, 5500, 7000, 8500].map((wl) => (<text key={wl} x={px(wl)} y={height - 3} fill="rgba(255,255,255,0.25)" fontSize="7" fontFamily="monospace" textAnchor="middle">{wl}</text>))}
      </svg>
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        {[{ color: '#60A5FA', label: 'Type A — hot (> 7,500 K)' }, { color: '#FB923C', label: 'Type K — cool (< 5,200 K)' }].map((l) => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <div style={{ width: '16px', height: '2px', background: l.color, borderRadius: '1px' }} />
            <span style={{ fontSize: '9.5px', color: 'var(--ifm-font-color-base)', opacity: 0.55 }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NormalizationDemo() {
  return (
    <div style={{ margin: '28px 0' }}>
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <MiniSpectrum dataA={STAR_A} dataK={STAR_K} title="Before normalisation" subtitle="Raw flux — incomparable scales" yLabel="flux" showAnnotations={false} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '24px', color: 'rgba(255,255,255,0.2)', padding: '0 4px' }}>→</div>
        <MiniSpectrum dataA={STAR_A_NORM} dataK={STAR_K_NORM} title="After normalisation" subtitle="Flux / median — continuum ≈ 1 · comparable lines" yLabel="f/f̃" showAnnotations={true} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
        <div style={{ padding: '12px 14px', background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)', borderLeft: '3px solid #F59E0B', borderRadius: '7px' }}>
          <div style={{ fontWeight: '700', fontSize: '12px', color: '#F59E0B', marginBottom: '6px' }}>✓ Why the median?</div>
          <div style={{ fontSize: '11.5px', color: 'var(--ifm-font-color-base)', opacity: 0.75, lineHeight: 1.5 }}>
            The median is robust to <strong>emission lines</strong> (positive outliers) and <strong>cosmic rays</strong> that inflate the mean. 50% of continuum pixels are above, 50% below — a stable reference point.
          </div>
        </div>
        <div style={{ padding: '12px 14px', background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.2)', borderLeft: '3px solid #F87171', borderRadius: '7px' }}>
          <div style={{ fontWeight: '700', fontSize: '12px', color: '#F87171', marginBottom: '6px' }}>✗ Why not the mean?</div>
          <div style={{ fontSize: '11.5px', color: 'var(--ifm-font-color-base)', opacity: 0.75, lineHeight: 1.5 }}>
            LAMOST spectra contain <strong>nebular emission lines</strong>, <strong>cosmic rays</strong> and <strong>instrumental artefacts</strong> that pull the mean upward, producing a biased normalisation.
          </div>
        </div>
      </div>

      <div style={{ padding: '10px 14px', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '7px', fontSize: '12px', color: 'var(--ifm-font-color-base)', opacity: 0.8 }}>
        <strong style={{ color: '#38BDF8' }}>Guard clause:</strong> if the median is ≤ 0 (corrupted or fully masked spectrum), the flux is returned unchanged and the spectrum is flagged in the error log for manual inspection.
        <code style={{ marginLeft: '8px', fontSize: '11px', color: '#38BDF8' }}>if median &gt; 0: flux /= median</code>
      </div>
    </div>
  );
}
