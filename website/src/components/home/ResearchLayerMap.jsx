import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { layerCards } from "./content";
import styles from "./styles.module.css";

function LayerLink({ kind, to, children }) {
  if (kind === "external") {
    return (
      <Link className={styles.layerLink} to={to}>
        {children} ↗
      </Link>
    );
  }

  return (
    <Link className={styles.layerLink} to={useBaseUrl(to)}>
      {children}
    </Link>
  );
}

export default function ResearchLayerMap() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.sectionEyebrow}>Architecture</p>
          <h2 className={styles.sectionTitle}>How this site is organised</h2>
        </div>
        <p className={styles.sectionNote}>
          The ecosystem is intentionally split into three complementary layers.
        </p>
      </div>

      <div className={styles.layerGrid}>
        {layerCards.map((layer, index) => (
          <article key={layer.title} className={styles.layerCard}>
            <div className={styles.layerBadge}>{index + 1}</div>
            <h3 className={styles.layerTitle}>{layer.title}</h3>
            <p className={styles.layerLabel}>{layer.label}</p>
            <p className={styles.layerDescription}>{layer.description}</p>
            <LayerLink kind={layer.kind} to={layer.to}>
              Go there
            </LayerLink>
          </article>
        ))}
      </div>
    </section>
  );
}
