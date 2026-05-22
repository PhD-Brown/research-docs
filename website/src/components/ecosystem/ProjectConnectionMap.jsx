import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { projectFlows } from "./content";
import styles from "./styles.module.css";

function accentClass(name) {
  return styles[`flow${name.charAt(0).toUpperCase() + name.slice(1)}`];
}

export default function ProjectConnectionMap() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.eyebrow}>Connection map</p>
          <h2 className={styles.sectionTitle}>How the projects connect</h2>
        </div>
        <p className={styles.sectionNote}>
          The ecosystem is not a loose collection of repos. It is a structured set of research programs
          connected by questions, methods, and scientific constraints.
        </p>
      </div>

      <div className={styles.flowGrid}>
        {projectFlows.map((flow, index) => (
          <article key={flow.project} className={`${styles.flowCard} ${accentClass(flow.accent)}`}>
            <div className={styles.flowStep}>0{index + 1}</div>
            <p className={styles.flowLabel}>Dataset / input</p>
            <h3 className={styles.flowDataset}>{flow.dataset}</h3>

            <div className={styles.flowArrow}>↓</div>

            <p className={styles.flowLabel}>Research program</p>
            <h3 className={styles.flowProject}>{flow.project}</h3>

            <div className={styles.flowArrow}>↓</div>

            <p className={styles.flowLabel}>Scientific outcome</p>
            <p className={styles.flowOutcome}>{flow.outcome}</p>

            <div className={styles.bridgeBox}>{flow.bridge}</div>

            <Link className={styles.primaryLink} to={useBaseUrl(flow.docsTo)}>
              Open project docs
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
