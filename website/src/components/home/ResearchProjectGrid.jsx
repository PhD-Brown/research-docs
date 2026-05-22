import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { projectCards } from "./content";
import styles from "./styles.module.css";

function accentClass(name) {
  return styles[`projectCard${name.charAt(0).toUpperCase() + name.slice(1)}`];
}

export default function ResearchProjectGrid() {
  return (
    <section className={styles.section}>
      <div className={styles.sectionHead}>
        <div>
          <p className={styles.sectionEyebrow}>Projects</p>
          <h2 className={styles.sectionTitle}>Three research programs</h2>
        </div>
        <p className={styles.sectionNote}>
          Each project has its own scientific identity, documentation logic, and repository surface.
        </p>
      </div>

      <div className={styles.projectGrid}>
        {projectCards.map((project) => (
          <article
            key={project.title}
            className={`${styles.projectCard} ${accentClass(project.accent)}`}
          >
            <div className={styles.projectGlow} />
            <div className={styles.projectCardInner}>
              <div className={styles.projectTop}>
                <span className={styles.projectEyebrow}>{project.eyebrow}</span>
                <span className={styles.projectStatus}>{project.status}</span>
              </div>

              <h3 className={styles.projectTitle}>{project.title}</h3>
              <p className={styles.projectDescription}>{project.description}</p>

              <ul className={styles.projectList}>
                {project.bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className={styles.projectActions}>
                <Link className={styles.primaryInlineLink} to={useBaseUrl(project.docsTo)}>
                  Open docs
                </Link>
                <Link className={styles.secondaryInlineLink} to={project.repoHref}>
                  GitHub ↗
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
