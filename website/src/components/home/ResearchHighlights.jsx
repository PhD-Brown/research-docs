import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { highlightCards } from "./content";
import styles from "./styles.module.css";

function accentClass(name) {
  return styles[`highlight${name.charAt(0).toUpperCase() + name.slice(1)}`];
}

export default function ResearchHighlights() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.sectionEyebrow}>Why this documentation exists</p>
          <h2 className={styles.sectionTitle}>Scientific directions worth opening first</h2>
        </div>
        <p className={styles.sectionNote}>
          This site is not only a code manual. It is a scientific reference built around method,
          validation, interpretation, and reproducibility.
        </p>
      </div>

      <div className={styles.highlightGrid}>
        {highlightCards.map((card) => (
          <article
            key={card.title}
            className={`${styles.highlightCard} ${accentClass(card.accent)}`}
          >
            <span className={styles.highlightKicker}>{card.subtitle}</span>
            <h3 className={styles.highlightTitle}>{card.title}</h3>
            <p className={styles.highlightDescription}>{card.description}</p>
            <Link className={styles.primaryInlineLink} to={useBaseUrl(card.to)}>
              {card.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
