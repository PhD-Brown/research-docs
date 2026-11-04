// src/components/astrovision/ClassTable.jsx
// Tableau « une ligne par classe Galaxy10 » : chaque colonne est un modèle de clé avec {slug}.
//
// Usage :
//   <ClassTable
//     columns={[
//       { header: 'N', path: 'dataset.by_class.{slug}.n', format: 'int' },
//       { header: 'Median g−r', path: 'dataset.by_class.{slug}.median_gr', format: 'num' },
//       { header: 'Blue cloud', path: 'dataset.by_class.{slug}.pct_blue_cloud', format: 'pct', digits: 0 },
//     ]}
//     highlight="disturbed"
//     caption="…" />
// Props : columns=[{header, path (avec {slug}), format?, digits?}], highlight? (slug), caption?

import React from 'react';
import { CLASSES, requireFact, forClass, format } from '@site/src/data/astrovision';
import styles from './styles.module.css';

export default function ClassTable({ columns = [], highlight, caption, labelHeader = 'Class' }) {
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
          {CLASSES.map((cls) => (
            <tr key={cls.slug} className={cls.slug === highlight ? styles.highlight : undefined}>
              <td>
                {cls.index} · {cls.name}
              </td>
              {columns.map((c) => {
                const key = forClass(c.path, cls);
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
