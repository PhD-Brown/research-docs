import React from 'react';

const MODELS = [
  { key: '"XGBoost"',           algo: 'XGBClassifier',              desc: 'Tree gradient boosting — AstroSpectro pipeline champion',                               color: '#34D399', badge: '87% BA', champion: true,  tag: 'Champion' },
  { key: '"LightGBM"',          algo: 'LGBMClassifier',             desc: 'Leaf-wise gradient boosting — very fast on large datasets',                             color: '#38BDF8', badge: null,     tag: 'Fast' },
  { key: '"CatBoost"',          algo: 'CatBoostClassifier',         desc: 'Ordered gradient boosting — native handling of missing and categorical values',         color: '#F59E0B', badge: null,     tag: 'Robust' },
  { key: '"ExtraTrees"',        algo: 'ExtraTreesClassifier',        desc: 'Extremely randomised trees — very fast, good diversification',                         color: '#FBBF24', badge: null,     tag: 'Fast' },
  { key: '"RandomForest"',      algo: 'RandomForestClassifier',      desc: 'Random forests — historical project baseline',                                         color: '#94A3B8', badge: null,     tag: 'Baseline' },
  { key: '"Ensemble"',          algo: 'VotingClassifier',            desc: 'Soft vote XGB + LightGBM + ExtraTrees — best generalisation',                         color: '#C084FC', badge: null,     tag: 'Combined' },
  { key: '"SVM"',               algo: 'SVC (calibrated)',            desc: 'Calibrated Support Vector Machine — good on small datasets, slow at scale',            color: '#FB923C', badge: null,     tag: 'Classic' },
  { key: '"MLP"',               algo: 'MLPClassifier',               desc: 'Dense multilayer network — lightweight neural alternative',                            color: '#F87171', badge: null,     tag: 'Neural' },
  { key: '"LogisticRegression"',algo: 'LR multiclass',               desc: 'OvR logistic regression — interpretable linear baseline',                             color: '#6EE7B7', badge: null,     tag: 'Linear' },
  { key: '"KNN"',               algo: 'KNeighborsClassifier',        desc: 'K nearest neighbours — useful for spectral structure analysis',                       color: '#67E8F9', badge: null,     tag: 'Geometric' },
  { key: '"LDA"',               algo: 'LinearDiscriminantAnalysis',  desc: 'Linear discriminant analysis — classic projective baseline',                          color: '#A3E635', badge: null,     tag: 'Classic' },
];

function ModelCard({ modelKey, algo, desc, color, badge, champion, tag }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? `${color}0e` : champion ? `${color}05` : 'var(--ifm-card-background-color)', border: `1px solid ${hov ? color + '55' : champion ? color + '35' : 'rgba(255,255,255,0.07)'}`, borderLeft: `3px solid ${color}`, borderRadius: '8px', padding: '12px 14px', transition: 'all 0.15s', boxShadow: champion ? `0 2px 12px ${color}18` : 'none', cursor: 'default', display: 'flex', flexDirection: 'column', gap: '6px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '6px' }}>
        <code style={{ fontSize: '12px', fontWeight: champion ? '800' : '600', color: color, background: `${color}14`, padding: '2px 7px', borderRadius: '4px', lineHeight: 1.4 }}>{modelKey}</code>
        <div style={{ display: 'flex', gap: '5px', flexShrink: 0 }}>
          {badge && (<div style={{ background: '#34D39918', border: '1px solid #34D39944', borderRadius: '12px', padding: '1px 8px', fontSize: '10px', fontWeight: '800', color: '#34D399', fontFamily: 'monospace' }}>{badge}</div>)}
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '4px', padding: '1px 6px', fontSize: '9.5px', color: 'var(--ifm-font-color-base)', opacity: 0.5 }}>{tag}</div>
        </div>
      </div>
      <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ifm-font-color-base)', opacity: 0.5 }}>{algo}</div>
      <div style={{ fontSize: '11.5px', color: 'var(--ifm-font-color-base)', opacity: hov ? 0.85 : 0.6, lineHeight: 1.4, transition: 'opacity 0.12s' }}>{desc}</div>
    </div>
  );
}

export default function ModelSelector() {
  return (
    <div style={{ margin: '24px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '10px' }}>
        {MODELS.map((m) => <ModelCard key={m.key} modelKey={m.key} {...m} />)}
      </div>
      <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '7px', fontSize: '12px', color: 'var(--ifm-font-color-base)', opacity: 0.8 }}>
        <strong style={{ color: '#34D399' }}>Switching models is trivial:</strong>
        {' '}<code>SpectralClassifier(model_type="LightGBM")</code> — the pipeline, tuning and W&B logging adapt automatically.
      </div>
    </div>
  );
}
