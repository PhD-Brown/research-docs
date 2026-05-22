import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { scientificQuestions } from "./content";
import styles from "./styles.module.css";

function accentClass(name) {
  return styles[`question${name.charAt(0).toUpperCase() + name.slice(1)}`];
}

export default function ScientificQuestionGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.eyebrow}>Scientific questions</p>
          <h2 className={styles.sectionTitle}>What each project is really asking</h2>
        </div>
        <p className={styles.sectionNote}>
          These are not just engineering objectives. Each project is anchored in a scientific question that gives
          the technical work its meaning.
        </p>
      </div>

      <div className={styles.questionGrid}>
        {scientificQuestions.map((item) => (
          <article key={item.project} className={`${styles.questionCard} ${accentClass(item.accent)}`}>
            <span className={styles.questionProject}>{item.project}</span>
            <h3 className={styles.questionTitle}>{item.question}</h3>
            <p className={styles.questionWhy}>{item.why}</p>
            <Link className={styles.primaryLink} to={useBaseUrl(item.to)}>
              Open overview
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
