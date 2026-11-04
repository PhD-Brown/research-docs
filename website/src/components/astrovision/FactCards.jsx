// src/components/astrovision/FactCards.jsx
// Rangée de cartes « Key results » : chaque valeur est lue dans facts.json (aucun chiffre codé).
//
// Usage :
//   <FactCards cards={[
//     { k: 'models.dinov2_ft.test.balanced_accuracy', format: 'pct', label: 'Balanced accuracy',
//       context: 'DINOv2 fine-tuned · test set', accent: '#34D399' },
//     …
//   ]} />
// Props : cards = [{ k, format?, digits?, label, context?, accent? }]  (3 à 6 cartes, cf. page-style-guide §4.2)

import React from 'react';
import { requireFact, format, statusOf, sourceOf } from '@site/src/data/astrovision';
import styles from './styles.module.css';

export default function FactCards({ cards = [] }) {
  return (
    <div className={styles.cards}>
      {cards.map((c) => {
        const v = requireFact(c.k);
        const fm = c.format || (Number.isInteger(v) ? 'int' : 'raw');
        return (
          <div key={c.k + c.label} className={styles.card} style={c.accent ? { '--accent': c.accent } : undefined}>
            <div className={styles.cardValue} title={`${c.k} · ${statusOf(c.k)} · ${sourceOf(c.k)}`}>
              {format(v, fm, c.digits)}
            </div>
            <div className={styles.cardLabel}>{c.label}</div>
            {c.context ? <div className={styles.cardContext}>{c.context}</div> : null}
          </div>
        );
      })}
    </div>
  );
}
