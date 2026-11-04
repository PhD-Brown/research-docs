// src/components/astrovision/Fact.jsx
// Chiffre AstroVision en ligne, pour la prose : la valeur est lue dans facts.json au build, jamais recopiée
// (modèle : RunFact côté AstroSpectro). Clé introuvable ⇒ le build échoue.
//
// Usage (MDX) :
//   import Fact from '@site/src/components/astrovision/Fact';
//   DINOv2 reaches <Fact k="models.dinov2_ft.test.balanced_accuracy" format="pct" /> balanced accuracy.
//   The split holds <Fact k="split.train" format="int" /> training images.
//
// Props :
//   k       clé pointée de facts.json (voir _facts/astrovision/FACTS_INDEX.md)
//   format  'pct' | 'pctRaw' | 'num' | 'signed' | 'int' | 'sci' | 'raw' (défaut : 'int' si entier, sinon 'raw')
//   digits  nombre de décimales (défaut du format)
// Le titre (infobulle) donne la clé, le statut (calculé · notebook · figure · code) et la source.

import React from 'react';
import { requireFact, format, statusOf, sourceOf } from '@site/src/data/astrovision';

export default function Fact({ k, format: f, digits }) {
  const value = requireFact(k);
  const fm = f || (Number.isInteger(value) ? 'int' : 'raw');
  return <span title={`${k} · ${statusOf(k)} · ${sourceOf(k)}`}>{format(value, fm, digits)}</span>;
}
