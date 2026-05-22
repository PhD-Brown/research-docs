import React from "react";
import { ecosystemPrinciples } from "./content";
import styles from "./styles.module.css";

export default function EcosystemPrinciples() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.eyebrow}>Unifying principles</p>
          <h2 className={styles.sectionTitle}>What really holds the ecosystem together</h2>
        </div>
        <p className={styles.sectionNote}>
          These principles are the closest thing to a common research thesis across the three programs.
        </p>
      </div>

      <div className={styles.principleGrid}>
        {ecosystemPrinciples.map((principle) => (
          <article key={principle.title} className={styles.principleCard}>
            <h3 className={styles.principleTitle}>{principle.title}</h3>
            <p className={styles.principleDescription}>{principle.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
