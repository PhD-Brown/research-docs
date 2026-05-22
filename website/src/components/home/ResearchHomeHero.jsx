import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import { heroPrograms } from "./content";
import styles from "./styles.module.css";

function ActionButton({ to, children, variant = "primary" }) {
  return (
    <Link
      className={`${styles.heroButton} ${variant === "secondary" ? styles.heroButtonSecondary : styles.heroButtonPrimary}`}
      to={useBaseUrl(to)}
    >
      {children}
    </Link>
  );
}

function accentClass(name) {
  return styles[`miniProgram${name.charAt(0).toUpperCase() + name.slice(1)}`];
}

export default function ResearchHomeHero() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.pageIntro}>
        <p className={styles.pageKicker}>Home</p>
        <h1 className={styles.pageTitle}>Alex Baker · Research Documentation</h1>
        <p className={styles.pageLead}>
          Technical and scientific reference for my astrophysics, astro-ML,
          and computational physics research projects.
        </p>
      </div>

      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <p className={styles.heroEyebrow}>Technical library · scientific reference · reproducibility layer</p>
          <h2 className={styles.heroTitle}>
            One place to understand, reproduce, and extend my research
          </h2>
          <p className={styles.heroLead}>
            This home page is the editorial entry point to three open research programs:
            stellar spectroscopy, galaxy morphology, and Bayesian cosmology.
            It is designed to help visitors quickly understand what exists here,
            how the projects connect, and where to begin.
          </p>

          <div className={styles.heroActions}>
            <ActionButton to="/docs/astrospectro/">Explore AstroSpectro</ActionButton>
            <ActionButton to="/docs/ecosystem" variant="secondary">Browse the ecosystem</ActionButton>
          </div>
        </div>

        <div className={styles.heroPanel}>
          <div className={styles.heroPanelContent}>
            <span className={styles.heroPanelLabel}>Research programs</span>
            <div className={styles.miniProgramStack}>
              {heroPrograms.map((program) => (
                <div key={program.title} className={`${styles.miniProgramCard} ${accentClass(program.accent)}`}>
                  <strong>{program.title}</strong>
                  <span>{program.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
