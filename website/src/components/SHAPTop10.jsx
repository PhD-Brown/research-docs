// src/components/SHAPTop10.jsx
// Top-10 SHAP (mean |SHAP|) d'un run SHAP de runs.json, coloré par famille (colonne `family` du CSV du pipeline).
//
// Usage :
//   <SHAPTop10 />                                              // SHAP de référence (registre FACTS_INDEX.md)
//   <SHAPTop10 run="shap/features_20260305T174836Z" />         // autre run SHAP

import React from 'react';
import GaiaLeakNote from './GaiaLeakNote';
import { resolveRun, getRun, fmt, prettyFeature, generationLabel } from '@site/src/data/astrospectro';

const PALETTE = ['#C084FC', '#60A5FA', '#34D399', '#F59E0B', '#FB7185', '#38BDF8', '#A3E635', '#F472B6', '#FBBF24', '#94A3B8'];

function familyColors(features) {
  const out = {};
  features.forEach((f) => { if (!(f.family in out)) out[f.family] = PALETTE[Object.keys(out).length % PALETTE.length]; });
  return out;
}

export default function SHAPTop10({ run: runProp }) {
  const [hov, setHov] = React.useState(null);
  const shap = resolveRun(runProp, 'shap');
  const model = shap.model_run ? getRun(shap.model_run) : null;
  const sm = shap.metrics;
  const SHAP_FEATURES = sm.top.slice(0, 10).map((f) => ({
    rank: String(f.rank), name: prettyFeature(f.feature), family: f.family, importance: f.mean_abs_shap,
    note: `${f.feature} · ${f.category}`,
  }));
  const FAMILY_COLORS = familyColors(SHAP_FEATURES);
  const maxVal = Math.max(...SHAP_FEATURES.map(f => f.importance));

  return (
    <div style={{ margin: '28px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '16px 18px', background: 'rgba(192,132,252,0.08)', border: '1px solid rgba(192,132,252,0.3)', borderRadius: '10px', marginBottom: '20px' }}>
        <div style={{ fontFamily: 'monospace', fontSize: '28px', color: '#C084FC', lineHeight: 1, flexShrink: 0 }}>⚡</div>
        <div>
          <div style={{ fontWeight: '800', fontSize: '14px', color: '#C084FC', marginBottom: '4px' }}>
            Top SHAP feature — {SHAP_FEATURES[0].name} ({SHAP_FEATURES[0].family})
          </div>
          <div style={{ fontSize: '13px', color: 'var(--ifm-font-color-base)', opacity: 0.8, lineHeight: 1.5 }}>
            The top 10 span <strong>{Object.keys(FAMILY_COLORS).length} feature families</strong>; spectroscopic features carry <strong>{fmt.pct(sm.physical_share)}</strong> of the total mean |SHAP|{model ? <> for <code>{model.label}</code></> : null}.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
        {Object.entries(FAMILY_COLORS).map(([fam, col]) => {
          const count = SHAP_FEATURES.filter(f => f.family === fam).length;
          return (
            <div key={fam} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: col }} />
              <span style={{ fontSize: '12px', fontWeight: '600', color: col }}>{fam} ({count} in top-10)</span>
            </div>
          );
        })}
        <div style={{ marginLeft: 'auto', fontSize: '10px', opacity: 0.35, color: 'var(--ifm-font-color-base)', alignSelf: 'center' }}>
          mean |SHAP| — {model ? `model run ${model.id} · ${generationLabel(model)}` : shap.id}
        </div>
      </div>

      <div style={{ background: 'var(--ifm-card-background-color)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '28px 180px 1fr 80px', gap: '10px', padding: '8px 14px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {['#', 'Feature', 'SHAP Importance', 'Family'].map((h) => (
            <div key={h} style={{ fontSize: '9.5px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', opacity: 0.35, color: 'var(--ifm-font-color-base)' }}>{h}</div>
          ))}
        </div>

        {SHAP_FEATURES.map((f, i) => {
          const color = FAMILY_COLORS[f.family];
          const barWidth = (f.importance / maxVal) * 100;
          const isHov = hov === i;
          const isTop5Ca = Number(f.rank) <= 3;
          return (
            <div key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} style={{ display: 'grid', gridTemplateColumns: '28px 180px 1fr 80px', gap: '10px', padding: '9px 14px', alignItems: 'center', borderBottom: i < SHAP_FEATURES.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none', background: isHov ? `${color}0c` : isTop5Ca ? 'rgba(192,132,252,0.03)' : 'transparent', transition: 'background 0.1s', cursor: 'default' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '700', color: color, opacity: isHov ? 1 : 0.65 }}>{f.rank}</div>
              <div>
                <div style={{ fontSize: '12.5px', fontFamily: 'monospace', fontWeight: isTop5Ca ? '700' : '400', color: isHov ? color : 'var(--ifm-font-color-base)', transition: 'color 0.1s' }}>{f.name}</div>
                {isHov && (<div style={{ fontSize: '10px', opacity: 0.5, marginTop: '2px', color: 'var(--ifm-font-color-base)' }}>{f.note}</div>)}
              </div>
              <div style={{ height: '16px', background: 'rgba(255,255,255,0.04)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${barWidth}%`, height: '100%', background: isHov ? color : `${color}cc`, borderRadius: '4px', transition: 'background 0.1s', display: 'flex', alignItems: 'center', paddingLeft: '6px' }}>
                  {barWidth > 15 && (<span style={{ fontSize: '10px', fontFamily: 'monospace', fontWeight: '700', color: '#000' }}>{f.importance.toFixed(2)}</span>)}
                </div>
              </div>
              <div style={{ background: `${color}18`, border: `1px solid ${color}35`, borderRadius: '4px', padding: '2px 8px', fontSize: '10px', fontWeight: '700', color: color, textAlign: 'center', whiteSpace: 'nowrap' }}>{f.family}</div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(96,165,250,0.05)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: '7px', fontSize: '11.5px', color: 'var(--ifm-font-color-base)', opacity: 0.8 }}>
        <strong style={{ color: '#60A5FA' }}>{sm.top30_physical}/30</strong> of the 30 most important features (SHAP top-30) are spectroscopic; they carry <strong style={{ color: '#60A5FA' }}>{fmt.pct(sm.physical_share)}</strong> of the total mean |SHAP|. Hover bars to see the pipeline name of each feature.
      </div>
      {model && <GaiaLeakNote run={model} style={{ marginTop: '8px' }} />}
    </div>
  );
}
