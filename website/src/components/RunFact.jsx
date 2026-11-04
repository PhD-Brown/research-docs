// src/components/RunFact.jsx
// Chiffre de run en ligne, pour la prose des pages : la valeur est lue dans runs.json au build, jamais recopiée.
//
// Usage (MDX) :
//   import RunFact from '@site/src/components/RunFact';
//   The reference model reaches <RunFact run="classifier" path="metrics.balanced_accuracy" format="pct" /> balanced accuracy.
//   PCA keeps <RunFact run="pca" path="metrics.n_components_for_variance.95pct" /> components.
//
// Props :
//   run     clé du registre (classifier, pca…) ou identifiant de run (défaut 'classifier')
//   path    chemin pointé dans l'objet run (ex. 'metrics.roc_auc_macro', 'n.test', 'metrics.per_class.M.f1')
//   format  'pct' | 'num' | 'signed' | 'int' | 'sci' | 'seconds' | 'raw' (défaut 'raw' ; 'int' si entier)
//   digits  nombre de décimales (défaut du format)
// Un chemin introuvable fait échouer le build (erreur explicite) plutôt que d'afficher une valeur fausse.

import React from 'react';
import { resolveRun, fmt } from '@site/src/data/astrospectro';

export default function RunFact({ run = 'classifier', path, format, digits }) {
  const r = resolveRun(run, 'classifier');
  const value = String(path || '').split('.').reduce((o, k) => (o == null ? undefined : o[k]), r);
  if (value === undefined || value === null) {
    throw new Error(`[RunFact] ${r.id} : chemin « ${path} » introuvable dans runs.json`);
  }
  const f = format || (Number.isInteger(value) ? 'int' : 'raw');
  const text = f === 'raw' || !fmt[f] ? String(value) : digits !== undefined ? fmt[f](value, digits) : fmt[f](value);
  return <span title={`${r.id} · ${path}`}>{text}</span>;
}
