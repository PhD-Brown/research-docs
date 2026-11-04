// src/components/GaiaLeakNote.jsx
// Mention courte de fuite Gaia (FACTS_INDEX §1.1, décision éditoriale n° 1) pour tout bloc qui cite un run
// dont les features utilisées contiennent des colonnes Gaia/photométriques (drapeau `gaia_leak` de runs.json).
// Ne rend rien si le run n'a pas de fuite.
//
// Usage :
//   <GaiaLeakNote />                       // run de référence 'classifier' (registre FACTS_INDEX.md)
//   <GaiaLeakNote run="20260522T161236Z" /> // identifiant, clé de registre ou objet run
//   <GaiaLeakNote style={{ marginTop: 8 }} />

import React from 'react';
import Link from '@docusaurus/Link';
import { leakNote, LEAK_AUDIT_PATH } from '@site/src/data/astrospectro';

export default function GaiaLeakNote({ run, style }) {
  const text = leakNote(run);
  if (!text) return null;
  const [lead] = text.split(' — ');
  return (
    <div
      style={{
        display: 'flex',
        gap: '6px',
        alignItems: 'baseline',
        fontSize: '11.5px',
        lineHeight: 1.45,
        color: 'var(--ifm-font-color-base)',
        ...style,
      }}
    >
      <span style={{ color: '#F59E0B', flexShrink: 0 }} aria-hidden="true">⚠</span>
      <span style={{ opacity: 0.8 }}>
        {lead} — see <Link to={LEAK_AUDIT_PATH}>Data Leakage Audit</Link>
      </span>
    </div>
  );
}
