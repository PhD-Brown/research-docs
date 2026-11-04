// src/components/astrovision/FactProvenance.jsx
// Mention de provenance des chiffres d'un bloc : s'affiche tant que des valeurs du bloc viennent de sorties de
// notebook / figures / constantes du code (et non de fichiers de _facts/), et disparaît d'elle-même quand elles
// sont remplacées par des valeurs calculées (voir _facts/astrovision/FACTS_INDEX.md §0 et §6).
//
// Usage :  <FactProvenance prefixes={['models', 'unet']} />     // aucun préfixe = tout facts.json
import React from 'react';
import { statusesFor } from '@site/src/data/astrovision';
import styles from './styles.module.css';

export default function FactProvenance({ prefixes = [] }) {
  const s = statusesFor(prefixes);
  const nb = (s.notebook || 0) + (s.figure || 0);
  if (!nb) return null;
  return (
    <div className={styles.prov}>
      <span aria-hidden="true">ⓘ</span>
      <span>
        <strong>Provenance.</strong> Model scores in this section are copied from the output cells of the AstroVision
        notebooks (and, for DINOv2 per-class recall, read from an exported figure). The documentation data pack contains
        no metrics file for them, so they cannot be re-derived from the pack; the cell of origin is listed for each value in{' '}
        <code>_facts/astrovision/FACTS_INDEX.md</code> §3 and shown when hovering over a number.
      </span>
    </div>
  );
}
