import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { browseCards } from "./content";
import styles from "./styles.module.css";

export default function ResearchBrowseGrid() {
  return (
    <section className={`${styles.section} ${styles.lastSection}`}>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.sectionEyebrow}>Browse by type</p>
          <h2 className={styles.sectionTitle}>Use the site like a library, not just a sidebar</h2>
          <p className={styles.sectionSubnote}>
            These shortcuts help visitors move across projects by intent, not only by folder structure.
          </p>
        </div>
      </div>

      <div className={styles.browseGrid}>
        {browseCards.map((card) => (
          <Link key={card.title} className={styles.browseCard} to={useBaseUrl(card.to)}>
            <h3 className={styles.browseTitle}>{card.title}</h3>
            <p className={styles.browseDescription}>{card.description}</p>
            <span className={styles.secondaryInlineLink}>Open section</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
