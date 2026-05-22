import React from "react";
import { themes } from "./content";
import styles from "./styles.module.css";

export default function CrossProjectThemes() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.eyebrow}>Shared themes</p>
          <h2 className={styles.sectionTitle}>Common themes across projects</h2>
        </div>
        <p className={styles.sectionNote}>
          These themes are the connective tissue of the ecosystem. They explain why the projects belong together
          even when the data, methods, and scales are different.
        </p>
      </div>

      <div className={styles.themeGrid}>
        {themes.map((theme) => (
          <article key={theme.title} className={styles.themeCard}>
            <h3 className={styles.themeTitle}>{theme.title}</h3>
            <p className={styles.themeSummary}>{theme.summary}</p>
            <div className={styles.themeRows}>
              {theme.rows.map((row) => (
                <div key={`${theme.title}-${row.project}`} className={styles.themeRow}>
                  <span className={styles.themeProject}>{row.project}</span>
                  <span className={styles.themeValue}>{row.value}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
