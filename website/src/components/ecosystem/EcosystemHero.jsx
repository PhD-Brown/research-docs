import React from "react";
import styles from "./styles.module.css";

export default function EcosystemHero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Research program map</p>
          <h2 className={styles.heroTitle}>Three projects, one coherent scientific direction</h2>
          <p className={styles.heroLead}>
            The ecosystem connects stellar spectroscopy, galaxy morphology, and Bayesian cosmology
            through a shared philosophy: physics-grounded, interpretable, reproducible machine learning
            and inference for astronomy.
          </p>
        </div>

        <div className={styles.heroBadges}>
          <span className={`${styles.badge} ${styles.badgeBlue}`}>Physics-grounded</span>
          <span className={`${styles.badge} ${styles.badgeViolet}`}>Interpretable</span>
          <span className={`${styles.badge} ${styles.badgeOrange}`}>Reproducible</span>
        </div>
      </div>
    </section>
  );
}
