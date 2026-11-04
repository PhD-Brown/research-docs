import React from 'react';
import GaiaLeakNote from './GaiaLeakNote';
import { resolveRun, getRun, shapRunFor, fmt, prettyFeature, generationLabel } from '@site/src/data/astrospectro';

// Les deux colonnes sont tirées de runs.json pour une même génération de données (règle 2) : la PCA de
// référence et le SHAP calculé sur le même fichier de features (shapRunFor).
//
// Usage :
//   <PCAvsXGBoost />                                   // PCA de référence (registre) + SHAP de même génération
//   <PCAvsXGBoost pcaRun="phy3500_pca_run_…" />

function sidesOf(pca, shap, model) {
  const pm = pca.metrics;
  const top = pm.loadings.PC1[0];
  const sm = shap.metrics;
  const top3 = sm.top.slice(0, 3).map((f) => prettyFeature(f.feature));
  return [
    {
      method: 'PCA',
      goal: 'Direction of maximum variance',
      color: '#38BDF8',
      topFeature: prettyFeature(top.feature),
      topFeatureColor: '#60A5FA',
      topFeatureSub: `top PC1 loading ${fmt.signed(top.loading)} · PC1 = ${fmt.pct(pm.variance[0])} variance`,
      result: 'Temperature T_eff',
      resultMetric: `ρ(PC1, Teff) = ${fmt.signed(pm.gaia_spearman.PC1.teff_gspphot)}`,
      nature: 'Unsupervised',
      bullets: [
        'Maximises total variance',
        'Balmer and continuum shape load PC1 → thermal axis',
        'Temperature = variance source #1',
        'No labels used',
      ],
    },
    {
      method: 'XGBoost',
      goal: 'Optimal decision boundary',
      color: '#F59E0B',
      topFeature: top3[0],
      topFeatureColor: '#C084FC',
      topFeatureSub: `SHAP top 3: ${top3.join(' · ')}`,
      result: 'Spectroscopic features dominate',
      resultMetric: `${fmt.pct(sm.physical_share)} of Σ|SHAP| · ${sm.top30_physical}/30 top features`,
      nature: 'Supervised',
      bullets: [
        'Minimises classification error',
        `SHAP on ${model ? model.label : shap.id} (${shap.n_features} features)`,
        'Mixes molecular bands, Mg b and Balmer lines',
        'Spectral type labels used',
      ],
    },
  ];
}

function Side({ method, goal, color, topFeature, topFeatureColor, topFeatureSub, result, resultMetric, nature, bullets }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ flex: 1, background: hov ? `${color}08` : 'var(--ifm-card-background-color)', border: `1px solid ${hov ? color + '55' : color + '25'}`, borderTop: `4px solid ${color}`, borderRadius: '10px', padding: '20px', transition: 'all 0.15s', cursor: 'default', minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: '900', fontSize: '20px', color: color }}>{method}</div>
          <div style={{ fontSize: '11px', opacity: 0.55, color: 'var(--ifm-font-color-base)' }}>{goal}</div>
        </div>
        <div style={{ background: `${color}15`, border: `1px solid ${color}35`, borderRadius: '5px', padding: '2px 8px', fontSize: '10px', fontWeight: '700', color: color }}>{nature}</div>
      </div>

      <div style={{ padding: '12px', background: `${topFeatureColor}0e`, border: `1px solid ${topFeatureColor}30`, borderRadius: '7px', marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', opacity: 0.45, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ifm-font-color-base)' }}>Dominant feature</div>
        <div style={{ fontWeight: '700', fontSize: '14px', color: topFeatureColor, marginBottom: '2px' }}>{topFeature}</div>
        <div style={{ fontSize: '11px', fontFamily: 'monospace', color: topFeatureColor, opacity: 0.7 }}>{topFeatureSub}</div>
      </div>

      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '10px', opacity: 0.4, marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--ifm-font-color-base)' }}>Physical result</div>
        <div style={{ fontWeight: '800', fontSize: '15px', color: color, marginBottom: '3px' }}>{result}</div>
        <div style={{ fontFamily: 'monospace', fontSize: '11px', color: color, opacity: 0.75 }}>{resultMetric}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {bullets.map((b, i) => (
          <div key={i} style={{ display: 'flex', gap: '7px', alignItems: 'flex-start', fontSize: '11.5px', color: 'var(--ifm-font-color-base)', opacity: 0.7 }}>
            <span style={{ color: color, flexShrink: 0, marginTop: '1px' }}>›</span><span>{b}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PCAvsXGBoost({ pcaRun }) {
  const pca = resolveRun(pcaRun, 'pca');
  const shap = shapRunFor(pca.generation);
  if (!shap) return null;
  const model = shap.model_run ? getRun(shap.model_run) : null;
  return (
    <div style={{ margin: '28px 0' }}>
      <div style={{ fontSize: '11px', fontFamily: 'var(--ifm-font-family-monospace)', color: 'var(--ifm-font-color-base)', opacity: 0.6, marginBottom: '8px' }}>
        PCA {pca.id} ({generationLabel(pca)}) · SHAP {model ? `${model.label} (run ${model.id} · ${generationLabel(model)})` : shap.id}
      </div>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {sidesOf(pca, shap, model).map((s) => <Side key={s.method} {...s} />)}
      </div>
      <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '13px', color: 'var(--ifm-font-color-base)', opacity: 0.85, lineHeight: 1.65 }}>
        <strong style={{ color: '#34D399' }}>✓ These two results are complementary</strong> — they answer two different questions. PCA answers: <em>"what is the dominant source of variance?"</em> → temperature. XGBoost answers: <em>"what information best separates classes?"</em> → the SHAP ranking of {model ? model.label : 'this model'} (same feature generation as the PCA), led by {prettyFeature(shap.metrics.top[0].feature)}.
      </div>
      {model && <GaiaLeakNote run={model} style={{ marginTop: '8px' }} />}
    </div>
  );
}
