import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { ctas } from "./content";
import styles from "./styles.module.css";

export default function EcosystemCTA() {
  return (
    <section className={`${styles.section} ${styles.lastSection}`}>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.eyebrow}>Continue exploring</p>
          <h2 className={styles.sectionTitle}>Choose your next entry point</h2>
        </div>
        <p className={styles.sectionNote}>
          Once the ecosystem map is clear, the best next step is to move toward a specific project or reading mode.
        </p>
      </div>

      <div className={styles.ctaGrid}>
        {ctas.map((cta) => (
          <article key={cta.title} className={styles.ctaCard}>
            <h3 className={styles.ctaTitle}>{cta.title}</h3>
            <p className={styles.ctaDescription}>{cta.description}</p>
            <Link className={styles.primaryLink} to={useBaseUrl(cta.to)}>
              Go there
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
