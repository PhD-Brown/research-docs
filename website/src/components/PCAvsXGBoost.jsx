import React from 'react';

const SIDES = [
  {
    method: 'PCA',
    goal: 'Direction of maximum variance',
    color: '#38BDF8',
    topFeature: 'Balmer lines',
    topFeatureColor: '#60A5FA',
    topFeatureSub: 'Hα, Hβ, Hγ… PC1 = 31.5%',
    result: 'Temperature T_eff',
    resultMetric: 'ρ(PC1, Teff) = +0.831',
    interpretation: 'Spectra vary mostly in Teff between O and M types. Balmer is the most variable in variance space.',
    nature: 'Unsupervised',
    icon: '∑',
    bullets: [
      'Maximises total variance',
      'Balmer dominates → PC1 thermal',
      'Temperature = variance source #1',
      'No labels used',
    ],
  },
  {
    method: 'XGBoost',
    goal: 'Optimal decision boundary',
    color: '#F59E0B',
    topFeature: 'Ca II H&K lines',
    topFeatureColor: '#C084FC',
    topFeatureSub: 'Ca K, Ca H (SHAP ranks 1-5)',
    result: 'Metallicity + gravity',
    resultMetric: 'Ca II dominates SHAP top-5',
    interpretation: 'To distinguish classes, Ca II and Mg b are more discriminant than Balmer — metallicity separates spectral types better than temperature alone.',
    nature: 'Supervised',
    icon: '⟂',
    bullets: [
      'Minimises classification error',
      'Ca II dominates → discriminability',
      'Metallicity = best separator',
      'Spectral type labels used',
    ],
  },
];

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

export default function PCAvsXGBoost() {
  return (
    <div style={{ margin: '28px 0' }}>
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {SIDES.map((s) => <Side key={s.method} {...s} />)}
      </div>
      <div style={{ padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '13px', color: 'var(--ifm-font-color-base)', opacity: 0.85, lineHeight: 1.65 }}>
        <strong style={{ color: '#34D399' }}>✓ These two results are consistent and complementary</strong> — they answer two different questions. PCA answers: <em>"what is the dominant source of variance?"</em> → temperature. XGBoost answers: <em>"what information best separates classes?"</em> → metallicity via Ca II. The fact that both supervised and unsupervised approaches converge on the same physical structure confirms the validity of the 183 features.
      </div>
    </div>
  );
}
