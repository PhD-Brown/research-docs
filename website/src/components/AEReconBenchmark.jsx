// src/components/AEReconBenchmark.jsx
// Courbe MSE(k) de la PCA vs MSE de l'autoencodeur (z = 2), lues dans le run autoencodeur de référence
// (runs.json : metrics.pca_mse_by_k, metrics.mse).
//
// Usage : <AEReconBenchmark />

import React from 'react';
import { getReferenceRun, fmt, generationLabel } from '@site/src/data/astrospectro';

const AE_RUN = getReferenceRun('autoencoder');
const PCA_POINTS = Object.entries(AE_RUN.metrics.pca_mse_by_k)
  .map(([k, mse]) => ({ k: Number(k), mse }))
  .sort((a, b) => a.k - b.k);
const AE_MSE = AE_RUN.metrics.mse;
const K_LAST = PCA_POINTS[PCA_POINTS.length - 1];
const W = 480; const H = 200;
const PAD = { left: 50, right: 20, top: 22, bottom: 36 };
const K_MIN = 0; const K_MAX = 52; const MSE_MIN = 0.1; const MSE_MAX = 0.85;

function px(k)   { return PAD.left + ((k - K_MIN) / (K_MAX - K_MIN)) * (W - PAD.left - PAD.right); }
function py(mse) { return H - PAD.bottom - ((mse - MSE_MIN) / (MSE_MAX - MSE_MIN)) * (H - PAD.top - PAD.bottom); }
function pathPCA() { return PCA_POINTS.map((p, i) => `${i === 0 ? 'M' : 'L'}${px(p.k).toFixed(1)},${py(p.mse).toFixed(1)}`).join(' '); }

const AE_PY = py(AE_MSE);
// Plus petit k dont la MSE PCA est la plus proche de celle de l'AE
const EQUIV = PCA_POINTS.reduce((best, p) => (Math.abs(p.mse - AE_MSE) < Math.abs(best.mse - AE_MSE) ? p : best), PCA_POINTS[0]);
const EQUIV_K = EQUIV.k;

export default function AEReconBenchmark() {
  const [hovPt, setHovPt] = React.useState(null);

  return (
    <div style={{ margin: '28px 0' }}>
      <div style={{ background: 'var(--ifm-card-background-color)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: 'var(--ifm-font-color-base)' }}>
              Reconstruction MSE: Autoencoder (z=2) vs PCA (k=1…50)
            </div>
            <div style={{ fontSize: '10.5px', opacity: 0.45, color: 'var(--ifm-font-color-base)', marginTop: '2px' }}>
              {generationLabel(AE_RUN)} · {AE_RUN.p} features · run {AE_RUN.id.replace('phy3500_autoencoder_run_', '')}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { color: '#38BDF8', label: 'PCA (k components)' },
              { color: '#34D399', label: 'AE (z = 2 fixed)', dot: true },
            ].map((l) => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: l.color, opacity: 0.8 }}>
                <div style={{ width: '12px', height: '2px', background: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
          {[0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8].map((m) => (
            <g key={m}>
              <line x1={PAD.left} y1={py(m)} x2={W - PAD.right} y2={py(m)} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              <text x={PAD.left - 4} y={py(m) + 3.5} fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="monospace" textAnchor="end">{m.toFixed(1)}</text>
            </g>
          ))}
          <line x1={PAD.left} y1={AE_PY} x2={W - PAD.right} y2={AE_PY} stroke="#34D399" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7" />
          <text x={W - PAD.right - 2} y={AE_PY - 4} fill="#34D399" fontSize="9" fontFamily="monospace" textAnchor="end" fontWeight="bold">AE(z=2) = {fmt.num(AE_MSE)}</text>
          <line x1={px(EQUIV_K)} y1={py(EQUIV.mse)} x2={px(EQUIV_K)} y2={py(AE_MSE)} stroke="#FBBF24" strokeWidth="1" strokeDasharray="2,2" opacity="0.7" />
          <circle cx={px(EQUIV_K)} cy={py(EQUIV.mse)} r="4" fill="#FBBF24" opacity="0.8" />
          <text x={px(EQUIV_K) + 5} y={py(0.52)} fill="#FBBF24" fontSize="8.5" fontFamily="monospace">PCA(k={EQUIV_K})≈AE</text>
          <path d={pathPCA()} fill="none" stroke="#38BDF8" strokeWidth="2" opacity="0.85" />
          {PCA_POINTS.map((p, i) => (<circle key={i} cx={px(p.k)} cy={py(p.mse)} r={hovPt === i ? 5 : 3.5} fill="#38BDF8" opacity={hovPt === i ? 1 : 0.8} style={{ cursor: 'pointer', transition: 'r 0.1s' }} onMouseEnter={() => setHovPt(i)} onMouseLeave={() => setHovPt(null)} />))}
          {hovPt !== null && (() => { const p = PCA_POINTS[hovPt]; const tx = px(p.k); const ty = py(p.mse) - 26; return (<g><rect x={tx - 28} y={ty - 2} width="56" height="20" rx="4" fill="#0d1117" stroke="#38BDF8" strokeWidth="0.5" opacity="0.95" /><text x={tx} y={ty + 12} fill="#38BDF8" fontSize="10" fontFamily="monospace" textAnchor="middle">k={p.k} · {p.mse.toFixed(3)}</text></g>); })()}
          <line x1={PAD.left} y1={PAD.top} x2={PAD.left} y2={H - PAD.bottom} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1={PAD.left} y1={H - PAD.bottom} x2={W - PAD.right} y2={H - PAD.bottom} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          {[1, 2, 5, 10, 20, 30, 50].map((k) => (<g key={k}><line x1={px(k)} y1={H - PAD.bottom} x2={px(k)} y2={H - PAD.bottom + 4} stroke="rgba(255,255,255,0.2)" strokeWidth="1" /><text x={px(k)} y={H - PAD.bottom + 13} fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace" textAnchor="middle">{k}</text></g>))}
          <text x={PAD.left + (W - PAD.left - PAD.right) / 2} y={H - 2} fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="monospace" textAnchor="middle">PCA components K →</text>
          <text x={10} y={H / 2} fill="rgba(255,255,255,0.25)" fontSize="9" fontFamily="monospace" transform={`rotate(-90, 10, ${H / 2})`} textAnchor="middle">MSE</text>
        </svg>

        <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div style={{ padding: '10px 14px', background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.22)', borderLeft: '3px solid #34D399', borderRadius: '7px', fontSize: '12px', color: 'var(--ifm-font-color-base)', opacity: 0.85, lineHeight: 1.6 }}>
            <strong style={{ color: '#34D399' }}>AE(z=2) ≈ PCA(k={EQUIV_K})</strong> — with only 2 latent dimensions, the autoencoder achieves the same MSE as PCA with {EQUIV_K} components. Non-linearity compensates for dimensionality.
          </div>
          <div style={{ padding: '10px 14px', background: 'rgba(56,189,248,0.05)', border: '1px solid rgba(56,189,248,0.15)', borderLeft: '3px solid #38BDF8', borderRadius: '7px', fontSize: '12px', color: 'var(--ifm-font-color-base)', opacity: 0.85, lineHeight: 1.6 }}>
            <strong style={{ color: '#38BDF8' }}>Limitation:</strong> PCA(k={K_LAST.k}) reaches MSE = {fmt.num(K_LAST.mse)}, well below AE(z=2). PCA benefits from its {K_LAST.k} degrees of freedom — the 2D autoencoder is constrained by its low latent dimensionality.
          </div>
        </div>
      </div>
    </div>
  );
}
