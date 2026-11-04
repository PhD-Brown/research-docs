// src/components/VarianceChart.jsx
// Variance par composante + seuils de variance cumulée + MSE de reconstruction, lus dans le run PCA de
// référence (runs.json : metrics.variance / cumulative / n_components_for_variance / reconstruction_mse).
// Le pack de faits n'exporte que PC1–PC10 (variance_summary_top10) et MSE(k) pour k ≤ 50 : l'ancienne
// version affichait des valeurs « approximatives » pour PC3–PC20 (FACTS_INDEX §6), retirées.
//
// Thème : bordures, pistes et barres neutres via les variables --ifm-color-emphasis-* (lisibles en clair et en sombre) ;
// les barres sont des enfants à hauteur en % d'un conteneur de hauteur fixe (80 px) : la colonne doit donc avoir height:100%.
//
// Usage :
//   <VarianceChart />                             // run PCA de référence (registre FACTS_INDEX.md)
//   <VarianceChart run="phy3500_pca_run_…" />

import React from 'react';
import { resolveRun } from '@site/src/data/astrospectro';

const THRESHOLD_STYLE = {
  '80pct': { pct: 80, color: '#FBBF24' },
  '90pct': { pct: 90, color: '#FB923C' },
  '95pct': { pct: 95, color: '#34D399', highlighted: true },
  '99pct': { pct: 99, color: '#F87171' },
};

const r1 = (x) => Number((x * 100).toFixed(1));

function dataOf(run) {
  const m = run.metrics;
  const PC_VARIANCES = m.variance.map(r1);
  const THRESHOLDS = Object.entries(THRESHOLD_STYLE).map(([key, s]) => ({ ...s, k: m.n_components_for_variance[key] }));
  const k95 = m.n_components_for_variance['95pct'];
  const mse = (k) => (m.reconstruction_mse.length >= k ? m.reconstruction_mse[k - 1] : null);
  const captured = (k) => (k <= m.cumulative.length ? r1(m.cumulative[k - 1]) : null);
  const kMax = m.reconstruction_mse.length;
  const MSE_ROWS = [2, 10, kMax].map((k) => ({ k, mse: mse(k), captured: captured(k), capturedText: captured(k) !== null ? `${captured(k)}% captured` : (k < m.n_components_for_variance['80pct'] ? '< 80% captured' : '') }));
  MSE_ROWS.push({ k: k95, mse: mse(k95), captured: 95, capturedText: '≥ 95% captured' });
  MSE_ROWS.forEach((r) => { if (r.captured === null) r.captured = 80; });
  return { PC_VARIANCES, THRESHOLDS, MSE_ROWS, k95, p: run.p };
}

export default function VarianceChart({ run: runProp }) {
  const [hovPc, setHovPc] = React.useState(null);
  const { PC_VARIANCES, THRESHOLDS, MSE_ROWS, k95, p } = dataOf(resolveRun(runProp, 'pca'));
  const maxVar = Math.max(...PC_VARIANCES);

  return (
    <div style={{ margin: '28px 0' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
        gap: '16px',
      }}>
        {/* Left: bar chart of individual variance */}
        <div style={{
          background: 'var(--ifm-card-background-color)',
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: '10px',
          padding: '18px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', opacity: 0.7, marginBottom: '14px', color: 'var(--ifm-font-color-base)' }}>
            Individual variance — PC1 to PC{PC_VARIANCES.length}
          </div>

          {/* Bars */}
          <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end', height: '80px', marginBottom: '8px', borderBottom: '1px solid var(--ifm-color-emphasis-400)', background: 'var(--ifm-color-emphasis-100)', borderRadius: '4px 4px 0 0', padding: '0 2px' }}>
            {PC_VARIANCES.map((v, i) => {
              const isHov = hovPc === i;
              const isTop2 = i < 2;
              const height = (v / maxVar) * 100;
              const color = i === 0 ? '#38BDF8' : i === 1 ? '#F59E0B' : 'var(--ifm-color-emphasis-600)';
              return (
                <div
                  key={i}
                  onMouseEnter={() => setHovPc(i)}
                  onMouseLeave={() => setHovPc(null)}
                  title={`PC${i+1}: ${v}%`}
                  style={{ flex: 1, height: '100%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', cursor: 'default' }}
                >
                  {isHov && (
                    <div style={{
                      position: 'absolute', left: '50%', bottom: `calc(${height}% + 2px)`, transform: 'translateX(-50%)',
                      fontSize: '9px', fontFamily: 'monospace', textAlign: 'center',
                      color: color, whiteSpace: 'nowrap', zIndex: 1,
                    }}>{v}%</div>
                  )}
                  <div style={{
                    height: `${height}%`,
                    background: isHov || isTop2 ? color : 'var(--ifm-color-emphasis-500)',
                    borderRadius: '2px 2px 0 0',
                    transition: 'background 0.1s',
                    minHeight: '2px',
                  }} />
                </div>
              );
            })}
          </div>

          {/* X axis labels */}
          <div style={{ display: 'flex', gap: '3px' }}>
            {PC_VARIANCES.map((_, i) => (
              <div key={i} style={{
                flex: 1,
                fontSize: '8px',
                textAlign: 'center',
                color: i < 2 ? (i === 0 ? '#38BDF8' : '#F59E0B') : 'var(--ifm-font-color-base)',
                opacity: i < 2 ? 0.9 : (i % 5 === 4 ? 0.7 : 0.4),
                fontFamily: 'monospace',
                fontWeight: i < 2 ? '700' : '400',
              }}>
                {i < 2 ? `PC${i+1}` : (i % 5 === 4 ? `${i+1}` : '')}
              </div>
            ))}
          </div>

          {/* PC1 PC2 labels */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
            {[
              { label: 'PC1 — Thermal axis', color: '#38BDF8', pct: PC_VARIANCES[0] },
              { label: 'PC2 — Metallicity axis', color: '#F59E0B', pct: PC_VARIANCES[1] },
            ].map((p) => (
              <div key={p.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: p.color }} />
                <span style={{ fontSize: '11px', color: p.color, fontWeight: '600' }}>
                  {p.label} ({p.pct}%)
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: cumulative thresholds */}
        <div style={{
          background: 'var(--ifm-card-background-color)',
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: '10px',
          padding: '18px',
        }}>
          <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', opacity: 0.7, marginBottom: '14px', color: 'var(--ifm-font-color-base)' }}>
            Cumulative-variance thresholds requiring K components
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {THRESHOLDS.map((t) => {
              const barWidth = t.k / p * 100;
              return (
                <div key={t.pct} style={{
                  padding: '10px 12px',
                  background: t.highlighted ? `${t.color}14` : 'var(--ifm-color-emphasis-100)',
                  border: `1px solid ${t.highlighted ? t.color + '66' : 'var(--ifm-color-emphasis-200)'}`,
                  borderRadius: '7px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: t.highlighted ? '800' : '600', color: t.color }}>
                      V(K) ≥ {t.pct}%
                    </span>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{
                        fontFamily: 'monospace',
                        fontSize: t.highlighted ? '20px' : '16px',
                        fontWeight: '800',
                        color: t.color,
                      }}>K = {t.k}</span>
                      <span style={{ fontSize: '10px', opacity: 0.7, color: 'var(--ifm-font-color-base)' }}>/ {p}</span>
                    </div>
                  </div>
                  {/* Bar */}
                  <div style={{ height: '5px', background: 'var(--ifm-color-emphasis-200)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${barWidth}%`,
                      height: '100%',
                      background: t.color,
                      borderRadius: '3px',
                      opacity: 0.8,
                    }} />
                  </div>
                  <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '4px', color: 'var(--ifm-font-color-base)' }}>
                    {barWidth.toFixed(0)}% of components used
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            marginTop: '12px',
            padding: '8px 12px',
            background: 'rgba(56,189,248,0.05)',
            border: '1px solid rgba(56,189,248,0.15)',
            borderRadius: '6px',
            fontSize: '11px',
            color: 'var(--ifm-font-color-base)',
            opacity: 0.75,
          }}>
            ↪ UMAP and t-SNE use the <strong style={{ color: '#38BDF8' }}>first {k95} components</strong> (95% threshold) as input.
          </div>
        </div>
      </div>

      {/* MSE table */}
      <div style={{ marginTop: '16px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))',
          gap: '10px',
        }}>
          {MSE_ROWS.map((row) => {
            const isKstar = row.k === k95;
            return (
              <div key={row.k} style={{
                padding: '12px 16px',
                background: isKstar ? 'rgba(52,211,153,0.07)' : 'var(--ifm-card-background-color)',
                border: `1px solid ${isKstar ? '#34D39966' : 'var(--ifm-color-emphasis-300)'}`,
                borderRadius: '8px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '10px', opacity: 0.7, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ifm-font-color-base)' }}>
                  K = {row.k} {isKstar && '★'}
                </div>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '20px',
                  fontWeight: '800',
                  color: isKstar ? '#34D399' : 'var(--ifm-font-color-base)',
                  lineHeight: 1,
                  marginBottom: '4px',
                }}>{row.mse !== null ? row.mse.toFixed(3) : '—'}</div>
                <div style={{ fontSize: '10px', opacity: 0.7, color: 'var(--ifm-font-color-base)' }}>{row.mse !== null ? 'MSE(K)' : 'MSE(K) not exported'}</div>
                <div style={{
                  marginTop: '8px',
                  height: '4px',
                  background: 'var(--ifm-color-emphasis-200)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${row.captured}%`,
                    height: '100%',
                    background: isKstar ? '#34D399' : '#38BDF8',
                    opacity: 0.7,
                    borderRadius: '2px',
                  }} />
                </div>
                <div style={{ fontSize: '9px', opacity: 0.7, marginTop: '3px', color: 'var(--ifm-font-color-base)' }}>
                  {row.capturedText}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
