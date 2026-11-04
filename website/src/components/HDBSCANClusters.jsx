// src/components/HDBSCANClusters.jsx
// Clusters HDBSCAN du run UMAP/t-SNE de référence (runs.json : metrics.hdbscan). Les identifiants et
// tailles viennent du run ; les étiquettes de population (« G-K main sequence »…) sont une lecture
// qualitative du run G1. Les plages Teff / log g par cluster n'ont pas de source dans _facts : retirées.
//
// Usage : <HDBSCANClusters />

import React from 'react';
import { getReferenceRun, fmt } from '@site/src/data/astrospectro';

const UM = getReferenceRun('umap_tsne');
const HD = UM.metrics.hdbscan;
const COLORS = ['#F59E0B', '#FB923C', '#FBBF24', '#A3E635', '#34D399', '#38BDF8', '#60A5FA', '#818CF8', '#A78BFA', '#C084FC', '#E879F9', '#FB7185'];
// Lecture qualitative (run G1) : identifiants de cluster → population. Sans effet si l'identifiant est absent.
const POPULATIONS = { 11: 'G-K main sequence', 13: 'Cool K dwarfs', 19: 'Subgiants / RGB base', 12: 'Subgiants / RGB base', 1: 'Subgiants / RGB base' };

const CLUSTERS = Object.entries(HD.largest_clusters)
  .map(([id, n]) => ({ id: `C${id}`, n, pop: POPULATIONS[id] || null }))
  .sort((a, b) => b.n - a.n)
  .map((c, i) => ({ ...c, color: COLORS[i % COLORS.length] }));

const MAX_N = CLUSTERS[0].n;

const HR_GROUPS = [
  { ids: [19, 1, 12], pop: 'Subgiants / RGB base', color: '#38BDF8', note: 'Strengthened Ca II · weakened Balmer → lower surface radiation pressure' },
  { ids: [13],        pop: 'Cool K dwarfs',        color: '#FB923C', note: 'Most populated cluster with clear physical identity' },
  { ids: [11],        pop: 'G-K main sequence',    color: '#F59E0B', note: 'Dominant cluster — reference population of the main sequence' },
]
  .filter((g) => g.ids.every((id) => String(id) in HD.largest_clusters))
  .map((g) => ({ ...g, clusters: g.ids.map((id) => `C${id}`).join(', '), }));

function ClusterBar({ cluster, maxN }) {
  const [hov, setHov] = React.useState(false);
  const pct = (cluster.n / maxN) * 100;

  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 0' }}>
      <div style={{ width: '32px', fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', fontWeight: '700', color: cluster.color, flexShrink: 0, textAlign: 'right' }}>{cluster.id}</div>
      <div style={{ flex: 1, height: '18px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: hov ? cluster.color : `${cluster.color}bb`, borderRadius: '4px', transition: 'background 0.15s, width 0.4s ease', display: 'flex', alignItems: 'center', paddingLeft: '8px', minWidth: '4px' }}>
          {pct > 12 && (<span style={{ fontSize: '11px', fontWeight: '700', color: '#000', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{cluster.n.toLocaleString('en-US')}</span>)}
        </div>
        {pct <= 12 && (<span style={{ position: 'absolute', left: `calc(${pct}% + 6px)`, top: '50%', transform: 'translateY(-50%)', fontSize: '11px', fontFamily: 'monospace', color: 'var(--ifm-font-color-base)', opacity: 0.6, whiteSpace: 'nowrap' }}>{cluster.n.toLocaleString('en-US')}</span>)}
      </div>
      {cluster.pop && (<div style={{ fontSize: '11px', color: cluster.color, opacity: 0.75, flexShrink: 0, maxWidth: '160px', fontStyle: 'italic', display: hov ? 'block' : 'none' }}>{cluster.pop}</div>)}
    </div>
  );
}

export default function HDBSCANClusters() {
  return (
    <div style={{ margin: '24px 0' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Clusters',   value: String(HD.n_clusters), color: '#F59E0B' },
          { label: 'Noise',      value: fmt.int(HD.n_noise), sub: fmt.pctRaw(HD.pct_noise, 2), color: '#F87171' },
          { label: `Cluster ${CLUSTERS[0].id}`, value: fmt.int(CLUSTERS[0].n), sub: 'stars', color: CLUSTERS[0].color },
          { label: `Cluster ${CLUSTERS[1].id}`, value: fmt.int(CLUSTERS[1].n), sub: 'stars', color: CLUSTERS[1].color },
        ].map((s) => (
          <div key={s.label} style={{ background: 'var(--ifm-card-background-color)', border: `1px solid ${s.color}28`, borderLeft: `3px solid ${s.color}`, borderRadius: '7px', padding: '10px 14px' }}>
            <div style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: '800', color: s.color, lineHeight: 1.1 }}>{s.value}</div>
            <div style={{ fontSize: '11px', opacity: 0.55, marginTop: '2px' }}>{s.label}{s.sub ? ` (${s.sub})` : ''}</div>
          </div>
        ))}
      </div>

      <div style={{ background: 'var(--ifm-card-background-color)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '18px 20px', marginBottom: '20px' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', opacity: 0.5, marginBottom: '14px', color: 'var(--ifm-font-color-base)' }}>
          Top {CLUSTERS.length} clusters — population (stars)
        </div>
        {CLUSTERS.map((c) => (<ClusterBar key={c.id} cluster={c} maxN={MAX_N} />))}
        <div style={{ marginTop: '12px', fontSize: '11px', opacity: 0.35, fontFamily: 'monospace', color: 'var(--ifm-font-color-base)' }}>
          min_cluster_size={HD.params.min_cluster_size} · min_samples={HD.params.min_samples} · noise excluded from this chart
        </div>
      </div>

      <div style={{ background: 'rgba(56,189,248,0.04)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '10px', padding: '18px 20px' }}>
        <div style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.07em', color: '#38BDF8', opacity: 0.8, marginBottom: '14px' }}>
          Location on the HR diagram (Teff × log g × Gaia DR3)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {HR_GROUPS.map((g) => (
            <div key={g.clusters} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: '12px', alignItems: 'center', padding: '10px 12px', background: `${g.color}0c`, border: `1px solid ${g.color}25`, borderRadius: '7px' }}>
              <div style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: '800', color: g.color }}>{g.clusters}</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--ifm-font-color-base)', marginBottom: '2px' }}>{g.pop}</div>
                <div style={{ fontSize: '11px', opacity: 0.5, fontStyle: 'italic', color: 'var(--ifm-font-color-base)' }}>{g.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
