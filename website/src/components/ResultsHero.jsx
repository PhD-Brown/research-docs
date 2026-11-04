import React from 'react';
import GaiaLeakNote from './GaiaLeakNote';
import { getReferenceRun, fmt, mean, generationLabel, prettyFeature } from '@site/src/data/astrospectro';

// Cartes calculées depuis runs.json (scripts/build_runs_data.py). Deux groupes distincts pour ne jamais
// mélanger les générations de données (CLAUDE.md, règle 2) : réduction de dimension (G1) et classification (G2).
//
// Usage :
//   <ResultsHero />   // runs de référence du registre (pca, umap_tsne, autoencoder, classifier, shap)

function dimredCards() {
  const pca = getReferenceRun('pca');
  const um = getReferenceRun('umap_tsne');
  const ae = getReferenceRun('autoencoder');
  const pm = pca.metrics;
  const rho = pm.gaia_spearman.PC1;
  const seeds = (xs) => xs.filter((s) => s.seed !== 0).map((s) => s.d);
  const umapMean = mean(seeds(um.metrics.procrustes_umap));
  const tsneMean = mean(seeds(um.metrics.procrustes_tsne));
  const tsne = um.parameters.tsne;
  return [
    {
      axis: 'PCA',
      headline: 'PC1 = Thermal axis',
      metric: fmt.signed(rho.teff_gspphot),
      metricLabel: 'ρ(PC1, Teff)',
      details: [`${fmt.pct(pm.variance[0])} variance · λ₁ = ${fmt.num(pm.eigenvalues[0], 2)}`, `${pm.n_components_for_variance['95pct']} components → 95% variance`, `ρ(PC1, BP−RP) = ${fmt.signed(rho.bp_rp)}`],
      color: '#38BDF8',
      badge: 'Linear',
    },
    {
      axis: 'UMAP',
      headline: 'Harvard sequence emergent',
      metric: String(um.metrics.hdbscan.n_clusters),
      metricLabel: 'HDBSCAN clusters',
      details: ['Continuous continent structure', 'Dwarfs / giants separated without labels', `ρ(ax.1, Teff) = ${ae.metrics.rho_axis1_teff.UMAP}`],
      color: '#F59E0B',
      badge: 'Topological',
    },
    {
      axis: 't-SNE',
      headline: `${Math.round(umapMean / tsneMean)}× more reproducible`,
      metric: fmt.sci(tsneMean),
      metricLabel: 'mean Procrustes dP (seeds 1–4)',
      details: [`init='${tsne.init}' → maximum stability`, 'Archipelago of compact clusters', `Perplexity ${tsne.perplexity} — optimal [15,50]`],
      color: '#A78BFA',
      badge: 'Probabilistic',
    },
  ];
}

function classifierCards() {
  const clf = getReferenceRun('classifier');
  const shap = getReferenceRun('shap');
  const cm = clf.metrics;
  const sm = shap.metrics;
  return [
    {
      axis: 'XGBoost',
      headline: `${fmt.pct(cm.balanced_accuracy)} balanced accuracy`,
      metric: fmt.num(cm.roc_auc_macro),
      metricLabel: 'ROC-AUC macro',
      details: [clf.label, `F1 macro ${fmt.num(cm.f1_macro)} · accuracy ${fmt.pct(cm.accuracy)}`, `Test set N = ${fmt.int(clf.n.test)}`],
      color: '#34D399',
      badge: 'Supervised',
    },
    {
      axis: 'SHAP',
      headline: 'Spectroscopy-driven decisions',
      metric: fmt.pct(sm.physical_share),
      metricLabel: 'share of Σ|SHAP| from spectroscopic features',
      details: [`Top 3: ${sm.top.slice(0, 3).map((f) => prettyFeature(f.feature)).join(' · ')}`, `${sm.top30_physical}/30 top features are spectroscopic`, `Gaia/photometric: ${fmt.pct(sm.gaia_photometric_share)} of Σ|SHAP|`],
      color: '#C084FC',
      badge: 'Interpretability',
    },
  ];
}

function GroupLabel({ title, sub }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px', margin: '0 0 8px' }}>
      <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--ifm-font-color-base)', opacity: 0.75 }}>{title}</span>
      <span style={{ fontSize: '11px', fontFamily: 'var(--ifm-font-family-monospace)', color: 'var(--ifm-font-color-base)', opacity: 0.55 }}>{sub}</span>
    </div>
  );
}

function ResultCard({ axis, headline, metric, metricLabel, details, color, badge }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ background: hov ? `${color}0e` : 'var(--ifm-card-background-color)', border: `1px solid ${hov ? color + '55' : color + '25'}`, borderTop: `4px solid ${color}`, borderRadius: '10px', padding: '18px', transition: 'all 0.15s', boxShadow: hov ? `0 6px 24px ${color}15` : 'none', cursor: 'default', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '60px', background: `radial-gradient(ellipse at 50% -10%, ${color}18, transparent)`, opacity: hov ? 1 : 0, transition: 'opacity 0.2s', pointerEvents: 'none' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: '900', fontSize: '16px', color: color, lineHeight: 1 }}>{axis}</div>
        <div style={{ background: `${color}18`, border: `1px solid ${color}35`, borderRadius: '4px', padding: '2px 7px', fontSize: '10px', fontWeight: '700', color: color, fontFamily: 'monospace' }}>{badge}</div>
      </div>
      <div style={{ fontWeight: '700', fontSize: '14px', color: 'var(--ifm-font-color-base)', lineHeight: 1.3 }}>{headline}</div>
      <div style={{ textAlign: 'center', padding: '10px 0 8px' }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '34px', fontWeight: '900', color: color, lineHeight: 1, letterSpacing: '-1px' }}>{metric}</div>
        <div style={{ fontSize: '10px', opacity: 0.5, marginTop: '4px', color: 'var(--ifm-font-color-base)' }}>{metricLabel}</div>
      </div>
      <div style={{ borderTop: `1px solid ${color}18`, paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {details.map((d, i) => (
          <div key={i} style={{ display: 'flex', gap: '6px', fontSize: '11px', color: 'var(--ifm-font-color-base)', opacity: 0.6, lineHeight: 1.4 }}>
            <span style={{ color: color, flexShrink: 0, opacity: 0.7 }}>›</span>{d}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultsHero() {
  const clf = getReferenceRun('classifier');
  const pca = getReferenceRun('pca');
  const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' };
  return (
    <div style={{ margin: '28px 0' }}>
      <GroupLabel title="Dimensionality reduction" sub={generationLabel(pca)} />
      <div style={grid}>
        {dimredCards().map((r) => <ResultCard key={r.axis} {...r} />)}
      </div>
      <div style={{ marginTop: '18px' }}>
        <GroupLabel title="Classification" sub={`reference run ${clf.id} · ${generationLabel(clf)}`} />
      </div>
      <div style={grid}>
        {classifierCards().map((r) => <ResultCard key={r.axis} {...r} />)}
      </div>
      <GaiaLeakNote run={clf} style={{ marginTop: '8px' }} />
    </div>
  );
}
