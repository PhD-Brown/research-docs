import React from 'react';
import clsx from 'clsx';
import {HtmlClassNameProvider, ThemeClassNames} from '@docusaurus/theme-common';
import {BlogPostProvider, useBlogPost} from '@docusaurus/plugin-content-blog/client';
import BlogLayout from '@theme/BlogLayout';
import BlogPostItem from '@theme/BlogPostItem';
import BlogPostPaginator from '@theme/BlogPostPaginator';
import BlogPostPageMetadata from '@theme/BlogPostPage/Metadata';
import TOC from '@theme/TOC';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/BlogPostPage';
import styles from './styles.module.css';

function BlogPostPageContent({children}: {children: React.ReactNode}): React.JSX.Element {
  // CORRECTION 1 : Extraction du frontMatter directement depuis useBlogPost
  const {metadata, toc, frontMatter} = useBlogPost();
  const {nextItem, prevItem, title, description, date, readingTime, tags} = metadata;
  const {
    hide_table_of_contents: hideTOC,
    toc_min_heading_level: tocMin,
    toc_max_heading_level: tocMax,
    image: coverImage,
  } = frontMatter;

  // Extraction des infos de l'auteur
  const author = metadata.authors?.[0] || {
    name: 'Alex Baker',
    title: 'Étudiant en physique',
    url: 'https://github.com/PhD-Brown',
    imageUrl: '/research-docs/img/authors/alex.png',
  };

  // Logique des pastilles de couleur
  const primaryTag = tags[0]?.label || 'Research';
  let projectColorClass = styles.accentDefault;
  if (primaryTag.toLowerCase().includes('astrospectro')) projectColorClass = styles.accentAstroSpectro;
  if (primaryTag.toLowerCase().includes('astrovision')) projectColorClass = styles.accentAstroVision;
  if (primaryTag.toLowerCase().includes('xi')) projectColorClass = styles.accentXi;

  const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <BlogLayout
      toc={
        !hideTOC && toc.length > 0 ? (
          <TOC toc={toc} minHeadingLevel={tocMin} maxHeadingLevel={tocMax} className={styles.customToc} />
        ) : undefined
      }
    >
      <div className={styles.pageContainer}>
        {/* Lien de retour */}
        <Link to="/journal" className={styles.backLink}>
          <span className={styles.arrow}>←</span> Retour au Journal
        </Link>

        {/* En-tête de l'article */}
        <header className={styles.articleHeader}>
          <span className={clsx(styles.projectPill, projectColorClass)}>
            {primaryTag}
          </span>
          <h1 className={styles.articleTitle}>{title}</h1>
          {description && <p className={styles.articleDescription}>{description}</p>}

          <div className={styles.authorBlock}>
            <img 
              src={String((author as any).imageURL || (author as any).imageUrl || '/research-docs/img/authors/alex.png')}
              alt={author.name} 
              className={styles.authorAvatar}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://github.com/PhD-Brown.png';
              }}
            />
            <div className={styles.authorMeta}>
              <div className={styles.authorNameRow}>
                <a href={author.url} target="_blank" rel="noopener noreferrer" className={styles.authorName}>
                  {author.name}
                </a>
              </div>
              <div className={styles.authorSubtitle}>{author.title}</div>
              <div className={styles.articleMetaDetails}>
                <span className={styles.metaDate}>{formattedDate}</span>
                <span className={styles.metaSeparator}>•</span>
                <span className={styles.metaReadingTime}>
                  {readingTime ? `${Math.ceil(readingTime)} min de lecture` : 'Quelques minutes'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Image de couverture */}
        {coverImage && (
          <div className={clsx(styles.coverImageContainer, projectColorClass)}>
            <img src={coverImage} alt={title} className={styles.coverImage} />
          </div>
        )}

        {/* Corps du texte Markdown */}
        <article className={styles.markdownContent}>
          <BlogPostItem>{children}</BlogPostItem>
        </article>

        {/* Pagination */}
        {(nextItem || prevItem) && (
          <div className={styles.paginatorWrapper}>
            <BlogPostPaginator nextItem={nextItem} prevItem={prevItem} />
          </div>
        )}
      </div>
    </BlogLayout>
  );
}

export default function BlogPostPage(props: Props): React.JSX.Element {
  // CORRECTION 2 : On extrait le contenu sous forme de composant React
  const BlogPostContent = props.content; 
  
  return (
    <BlogPostProvider content={props.content} isBlogPostPage>
      <HtmlClassNameProvider className={clsx(ThemeClassNames.wrapper.blogPages, ThemeClassNames.page.blogPostPage)}>
        <BlogPostPageMetadata />
        <BlogPostPageContent>
          {/* Et on le rend ici au lieu du props.children ! */}
          <BlogPostContent /> 
        </BlogPostPageContent>
      </HtmlClassNameProvider>
    </BlogPostProvider>
  );
}