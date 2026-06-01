import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { readingPaths } from "./content";
import styles from "./styles.module.css";

export default function ResearchReadingPaths() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.sectionEyebrow}>Navigation</p>
          <h2 className={styles.sectionTitle}>Where to start</h2>
          <p className={styles.sectionSubnote}>
            Choose an entry point based on what you need from the documentation today.
          </p>
        </div>
      </div>

      <div className={styles.readingGrid}>
        {readingPaths.map((path) => (
          <article key={path.title} className={styles.readingCard}>
            <h3 className={styles.readingTitle}>{path.title}</h3>
            <p className={styles.readingDescription}>{path.description}</p>
            <Link className={styles.primaryInlineLink} to={useBaseUrl(path.to)}>
              {path.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
