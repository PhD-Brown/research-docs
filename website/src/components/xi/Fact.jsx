// src/components/xi/Fact.jsx
// Chiffre ξ en ligne, pour la prose : la valeur est lue dans facts.json au build, jamais recopiée.
//
// Usage (MDX) :
//   import Fact from '@site/src/components/xi/Fact';
//   ε = <Fact path="models.Xi_osc.params.eps.median" digits={3} />
//   <Fact path="run.nsteps" format="int" /> steps
//   prior ε < <Fact path="config.priors.eps.1" digits={1} />
//
// Props :
//   path      chemin pointé dans le protocole (ex. 'models.CPL.aic'), ou 'config.…' pour la configuration du code
//   protocol  clé du registre (défaut 'protocol1b')
//   format    'num' (défaut si non entier) | 'signed' | 'int' | 'sigma' | 'raw'
//   digits    décimales (défaut 3 ; 2 pour 'sigma')
// Un chemin introuvable fait échouer le build plutôt que d'afficher une valeur fausse.

import React from 'react';
import { resolve, fmt } from '@site/src/data/xi';

export default function Fact({ path, protocol = 'protocol1b', format, digits }) {
  const value = resolve(path, protocol);
  const f = format || (typeof value === 'number' ? (Number.isInteger(value) ? 'int' : 'num') : 'raw');
  const text = f === 'raw' || !fmt[f] ? String(value) : digits !== undefined ? fmt[f](value, digits) : fmt[f](value);
  return <span title={`${protocol} · ${path}`}>{text}</span>;
}
