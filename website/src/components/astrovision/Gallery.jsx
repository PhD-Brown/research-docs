// src/components/astrovision/Gallery.jsx
// Enveloppe de @site/src/components/FigureGallery qui contourne un défaut du composant partagé : ses vignettes restent
// à opacity 0 quand l'image a fini de charger AVANT l'hydratation React (l'événement `load` est alors perdu).
// Ici, au montage, on affiche les images déjà chargées et on écoute `load` pour les autres.
// À supprimer quand FigureGallery sera corrigé (utiliser alors FigureGallery directement).
//
// Usage (identique à FigureGallery) :
//   import FigureGallery from '@site/src/components/astrovision/Gallery';
//   <FigureGallery figures={[{ src: '/img/astrovision/x.png', title, desc }]} columns={3} />

import React from 'react';
import FigureGallery from '@site/src/components/FigureGallery';

export default function Gallery(props) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const root = ref.current;
    if (!root) return undefined;
    const cleanups = [];
    root.querySelectorAll('img').forEach((img) => {
      const show = () => {
        img.style.opacity = '1';
      };
      if (img.complete && img.naturalWidth > 0) show();
      else {
        img.addEventListener('load', show, { once: true });
        cleanups.push(() => img.removeEventListener('load', show));
      }
    });
    return () => cleanups.forEach((f) => f());
  }, []);
  return (
    <div ref={ref}>
      <FigureGallery {...props} />
    </div>
  );
}
