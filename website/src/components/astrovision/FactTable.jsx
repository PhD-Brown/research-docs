// src/components/astrovision/FactTable.jsx
// Tableau dont chaque cellule numérique est lue dans facts.json.
//
// Usage :
//   <FactTable
//     labelHeader="Model"
//     columns={[{ header: 'Accuracy', format: 'pct' }, { header: 'Balanced acc.', format: 'pct' }]}
//     rows={[
//       { label: 'SimpleCNN', keys: ['models.simplecnn.test.accuracy', 'models.simplecnn.test.balanced_accuracy'] },
//       { label: 'DINOv2 fine-tuned', highlight: true, keys: [...] },
//       { label: 'Random baseline', keys: [null, null], text: ['—', '—'] },   // cellule vide / texte libre
//     ]}
//     caption="Test set, seed 42." />
// Props : columns=[{header, format?, digits?}], rows=[{label, keys:[clé|null], text?:[…], highlight?}], labelHeader, caption
// Un `text[i]` remplace la cellule i lorsque keys[i] est null (texte qualitatif, jamais un chiffre de résultat).

import React from 'react';
import { requireFact, format } from '@site/src/data/astrovision';
import styles from './styles.module.css';

export default function FactTable({ columns = [], rows = [], labelHeader = '', caption }) {
  return (
    <div className={styles.tableWrap}>
      <table>
        <thead>
          <tr>
            <th>{labelHeader}</th>
            {columns.map((c) => (
              <th key={c.header} className={styles.num}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className={r.highlight ? styles.highlight : undefined}>
              <td>{r.label}</td>
              {columns.map((c, i) => {
                const key = r.keys ? r.keys[i] : null;
                if (!key) return <td key={c.header} className={styles.num}>{r.text && r.text[i] !== undefined ? r.text[i] : '—'}</td>;
                const v = requireFact(key);
                const f = c.format || (Number.isInteger(v) ? 'int' : 'raw');
                return (
                  <td key={c.header} className={styles.num} title={key}>
                    {format(v, f, c.digits)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {caption ? <div className={styles.caption}>{caption}</div> : null}
    </div>
  );
}
