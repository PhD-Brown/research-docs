import React, { useMemo, useState } from "react";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import clsx from "clsx";
import styles from "./styles.module.css";

type TagLike = string | { label?: string; permalink?: string; title?: string };
type ItemLike = any;

type PostCardData = {
  id: string;
  title: string;
  description: string;
  permalink: string;
  date: string;
  readingTime: string;
  tags: string[];
  project: string;
  cover?: string | null;
  featured: boolean;
};

const PROJECT_ORDER = ["AstroSpectro", "AstroVision", "Xi Dark Energy"];
const FILTER_ORDER = [
  "All posts",
  "AstroSpectro",
  "AstroVision",
  "Xi Dark Energy",
  "Documentation",
  "Methods",
  "Results",
  "Infrastructure",
  "Milestone",
];

function normalizeTag(tag: TagLike): string {
  if (typeof tag === "string") return tag.trim();
  if (tag?.label) return String(tag.label).trim();
  if (tag?.title) return String(tag.title).trim();
  if (tag?.permalink) {
    const raw = String(tag.permalink).split("/").filter(Boolean).pop() || "Post";
    return raw.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
  }
  return "Post";
}

function pickProject(tags: string[]): string {
  const match = PROJECT_ORDER.find((project) =>
    tags.some((tag) => tag.toLowerCase() === project.toLowerCase())
  );
  return match || "Research";
}

function readingTimeLabel(value: any): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `${Math.max(1, Math.round(value))} min read`;
  }
  return "";
}

function extractPost(item: ItemLike, index: number): PostCardData {
  const content = item?.content ?? item ?? {};
  const metadata = content?.metadata ?? {};
  const frontMatter = content?.frontMatter ?? metadata?.frontMatter ?? {};

  const tagsRaw = metadata?.tags ?? frontMatter?.tags ?? [];
  const tags = Array.isArray(tagsRaw) ? tagsRaw.map(normalizeTag) : [];

  const title =
    metadata?.title ??
    frontMatter?.title ??
    `Untitled post ${index + 1}`;

  const description =
    metadata?.description ??
    frontMatter?.description ??
    content?.description ??
    "";

  const permalink =
    metadata?.permalink ??
    frontMatter?.slug ??
    "#";

  const date =
    metadata?.formattedDate ??
    metadata?.date ??
    "";

  const readingTime =
    readingTimeLabel(metadata?.readingTime) ||
    readingTimeLabel(frontMatter?.readingTime);

  const cover =
    frontMatter?.image ??
    metadata?.image ??
    null;

  const featured = tags.some((tag) => tag.toLowerCase() === "featured");
  const project = pickProject(tags);

  return {
    id: `${title}-${index}`,
    title,
    description,
    permalink,
    date,
    readingTime,
    tags,
    project,
    cover,
    featured,
  };
}

function unique<T>(values: T[]): T[] {
  return Array.from(new Set(values));
}

function projectClass(project: string) {
  if (project === "AstroSpectro") return styles.projectAstroSpectro;
  if (project === "AstroVision") return styles.projectAstroVision;
  if (project === "Xi Dark Energy") return styles.projectXi;
  return styles.projectResearch;
}

export default function BlogListPage(props: any): JSX.Element {
  const items = Array.isArray(props?.items) ? props.items : [];
  const allPosts = useMemo(() => items.map(extractPost), [items]);

  const autoFeatured = useMemo(() => {
    const tagged = allPosts.filter((post) => post.featured);
    if (tagged.length >= 2) return tagged.slice(0, 2);
    return allPosts.slice(0, 2);
  }, [allPosts]);

  const filterValues = useMemo(() => {
    const dynamic = unique(
      allPosts.flatMap((post) => post.tags).filter((tag) =>
        ["Documentation", "Methods", "Results", "Infrastructure", "Milestone"].includes(tag)
      )
    );

    const ordered = FILTER_ORDER.filter((tag) =>
      tag === "All posts" || allPosts.some((post) => post.project === tag || post.tags.includes(tag))
    );

    return unique([...ordered, ...dynamic]);
  }, [allPosts]);

  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All posts");

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const haystack = `${post.title} ${post.description} ${post.tags.join(" ")} ${post.project}`.toLowerCase();
      const queryMatch = haystack.includes(query.toLowerCase());

      const filterMatch =
        activeFilter === "All posts" ||
        post.project === activeFilter ||
        post.tags.includes(activeFilter);

      return queryMatch && filterMatch;
    });
  }, [allPosts, query, activeFilter]);

  const featuredIds = new Set(autoFeatured.map((post) => post.id));
  const featuredPosts =
    activeFilter === "All posts" && query.trim() === ""
      ? autoFeatured
      : [];

  const gridPosts =
    featuredPosts.length > 0
      ? filteredPosts.filter((post) => !featuredIds.has(post.id))
      : filteredPosts;

  const totalPosts = allPosts.length;

  return (
    <Layout
      title="Journal"
      description="Research notes, milestones, methods, and project evolution."
    >
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={clsx("container", styles.heroInner)}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>Alex Baker · Research Journal</p>
              <h1 className={styles.heroTitle}>Research notes, milestones, and methods</h1>
              <p className={styles.heroLead}>
                A high-end research journal across AstroSpectro, AstroVision, documentation work,
                and Bayesian cosmology — written as an evolving lab notebook with publication-grade intent.
              </p>
            </div>

            <div className={styles.searchWrap}>
              <label htmlFor="journal-search" className={styles.searchLabel}>
                Search journal entries
              </label>
              <input
                id="journal-search"
                className={styles.searchInput}
                type="search"
                placeholder="Search by title, topic, or tag..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        <section className={styles.metaBar}>
          <div className={clsx("container", styles.metaInner)}>
            <div className={styles.metaChip}>
              <span className={styles.metaValue}>{totalPosts}</span>
              <span className={styles.metaLabel}>posts on this page</span>
            </div>
            <div className={styles.metaChip}>
              <span className={styles.metaValue}>3</span>
              <span className={styles.metaLabel}>research programs</span>
            </div>
            <div className={styles.metaChip}>
              <span className={styles.metaValue}>Live</span>
              <span className={styles.metaLabel}>journal system</span>
            </div>
          </div>
        </section>

        {featuredPosts.length > 0 && (
          <section className={styles.section}>
            <div className="container">
              <div className={styles.sectionHead}>
                <h2 className={styles.sectionTitle}>Featured entries</h2>
                <p className={styles.sectionNote}>Pinned by recency or `featured` tag</p>
              </div>

              <div className={styles.featuredGrid}>
                {featuredPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={post.permalink}
                    className={clsx(styles.featuredCard, projectClass(post.project))}
                  >
                    <div
                      className={styles.cover}
                      style={
                        post.cover
                          ? { backgroundImage: `linear-gradient(180deg, rgba(6,10,22,0.1), rgba(6,10,22,0.75)), url(${post.cover})` }
                          : undefined
                      }
                    />
                    <div className={styles.cardBody}>
                      <div className={styles.cardMeta}>
                        <span className={styles.projectPill}>{post.project}</span>
                        {post.date && <span className={styles.metaText}>{post.date}</span>}
                        {post.readingTime && <span className={styles.metaText}>{post.readingTime}</span>}
                      </div>
                      <h3 className={styles.cardTitle}>{post.title}</h3>
                      {post.description && <p className={styles.cardDesc}>{post.description}</p>}
                      <div className={styles.cardFooter}>Read entry →</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>Browse the journal</h2>
              <p className={styles.sectionNote}>Filter by project or entry type</p>
            </div>

            <div className={styles.filters}>
              {filterValues.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={clsx(styles.filterPill, activeFilter === filter && styles.filterPillActive)}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>

            {filteredPosts.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No posts match this filter</h3>
                <p>Try another tag or clear the search query.</p>
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={() => {
                    setQuery("");
                    setActiveFilter("All posts");
                  }}
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <div className={styles.grid}>
                {gridPosts.map((post) => (
                  <Link
                    key={post.id}
                    to={post.permalink}
                    className={clsx(styles.postCard, projectClass(post.project))}
                  >
                    <div
                      className={styles.cardCoverSmall}
                      style={
                        post.cover
                          ? { backgroundImage: `linear-gradient(180deg, rgba(8,12,28,0.08), rgba(8,12,28,0.7)), url(${post.cover})` }
                          : undefined
                      }
                    />
                    <div className={styles.cardBody}>
                      <div className={styles.cardMeta}>
                        <span className={styles.projectPill}>{post.project}</span>
                        {post.date && <span className={styles.metaText}>{post.date}</span>}
                      </div>

                      <h3 className={styles.cardTitleSmall}>{post.title}</h3>

                      {post.description && (
                        <p className={styles.cardDescSmall}>{post.description}</p>
                      )}

                      {post.tags.length > 0 && (
                        <div className={styles.tagRow}>
                          {post.tags.slice(0, 4).map((tag) => (
                            <span key={`${post.id}-${tag}`} className={styles.tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className={styles.cardFooter}>Read more →</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </Layout>
  );
}
