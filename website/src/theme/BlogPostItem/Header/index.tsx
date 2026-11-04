import React from 'react';
import Header from '@theme-original/BlogPostItem/Header';
import type HeaderType from '@theme/BlogPostItem/Header';
import type {WrapperProps} from '@docusaurus/types';
import {useBlogPost} from '@docusaurus/plugin-content-blog/client';

type Props = WrapperProps<typeof HeaderType>;

// Sur la page d'un billet, `src/theme/BlogPostPage` rend déjà son propre en-tête (titre en <h1>, auteur, date).
// L'en-tête du thème d'origine afficherait un second <h1> : on le supprime ici, et seulement ici (les pages de liste
// gardent l'en-tête d'origine).
export default function HeaderWrapper(props: Props): React.JSX.Element | null {
  const {isBlogPostPage} = useBlogPost();
  if (isBlogPostPage) {
    return null;
  }
  return <Header {...props} />;
}
