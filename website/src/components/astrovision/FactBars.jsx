// src/components/astrovision/FactBars.jsx
// Barres horizontales comparant des valeurs lues dans facts.json (modèles, classes…).
//
// Usage (liste explicite) :
//   <FactBars title="Balanced accuracy (test)" format="pct"
//     items={[{ label: 'SimpleCNN', k: 'models.simplecnn.test.balanced_accuracy', accent: '#94A3B8' }, …]} />
// Usage (une barre par classe Galaxy10) :
//   <FactBars title="Recall per class" format="pct" digits={0} perClass="models.dinov2_ft.recall.{slug}" accent="#34D399" />
// Props : items | perClass, format, digits, max (défaut 1), accent, title

import React from 'react';
import { CLASSES, requireFact, forClass, format } from '@site/src/data/astrovision';
import styles from './styles.module.css';

export default function FactBars({ items, perClass, title, format: f = 'pct', digits, max = 1, accent }) {
  const rows = perClass
    ? CLASSES.map((c) => ({ label: `${c.index} · ${c.name}`, k: forClass(perClass, c), accent }))
    : items || [];
  return (
    <div className={styles.bars} role="list" aria-label={title}>
      {title ? <div className={styles.barsTitle}>{title}</div> : null}
      {rows.map((r) => {
        const v = requireFact(r.k);
        const pct = Math.max(0, Math.min(100, (v / max) * 100));
        return (
          <div key={r.k} className={styles.barRow} role="listitem" style={r.accent || accent ? { '--accent': r.accent || accent } : undefined}>
            <span className={styles.barLabel} title={r.label}>{r.label}</span>
            <span className={styles.barTrack}><span className={styles.barFill} style={{ width: `${pct}%`, display: 'block' }} /></span>
            <span className={styles.barValue} title={r.k}>{format(v, f, digits)}</span>
          </div>
        );
      })}
    </div>
  );
}
