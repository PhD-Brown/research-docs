import React from "react";
import Link from "@docusaurus/Link";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

// ── Stats ─────────────────────────────────────────────────────────────────────
const STATS = [
  {
    value: "89.2 %",
    label: "Balanced accuracy",
    context: "v6 · test N = 60,947 · 5 classes",
    accent: "blue",
  },
  {
    value: "0.986",
    label: "ROC-AUC macro",
    context: "XGBoost + isotonic calibration",
    accent: "blue",
  },
  {
    value: "350k",
    label: "Spectra processed",
    context: "LAMOST DR5 × Gaia DR3 · run v6",
    accent: "neutral",
  },
  {
    value: "99",
    label: "Selected features",
    context: "From 207 engineered · spectro_only",
    accent: "neutral",
  },
];

// ── Sections ──────────────────────────────────────────────────────────────────
const SECTIONS = [
  {
    icon: "◉",
    label: "WHERE TO START",
    title: "Overview",
    description:
      "Scientific motivation, key results at a glance, project map, and current run status.",
    bullets: ["Central SHAP finding", "89.2 % balanced accuracy", "Project scope and datasets"],
    to: "/docs/astrospectro/overview",
    priority: false,
  },
  {
    icon: "⬡",
    label: "ARCHITECTURE",
    title: "Concepts & Architecture",
    description:
      "The design decisions that make AstroSpectro scientifically defensible and reproducible.",
    bullets: ["spectro_only=True mode", "Physical purity & leakage", "Data lifecycle"],
    to: "/docs/astrospectro/concepts",
    priority: false,
  },
  {
    icon: "◫",
    label: "INPUTS",
    title: "Data & Datasets",
    description:
      "LAMOST DR5 spectra, Gaia DR3 cross-match, and the 207-feature engineering catalogue.",
    bullets: ["LAMOST DR5 · 350k spectra", "Gaia DR3 via CDS XMatch", "Feature catalogue · 207 → 99"],
    to: "/docs/astrospectro/data",
    priority: false,
  },
  {
    icon: "▷",
    label: "PROCESSING",
    title: "Core Pipeline",
    description:
      "Step-by-step from raw FITS to trained classifier — preprocessing, peak detection, feature engineering, XGBoost.",
    bullets: ["Preprocessing · peak detection", "Feature engineering · selection", "XGBoost v6 · isotonic calibration"],
    to: "/docs/astrospectro/pipeline",
    priority: false,
  },
  {
    icon: "◈",
    label: "LATENT STRUCTURE",
    title: "Dimensionality Reduction",
    description:
      "Three complementary methods studied on the 183-feature space: linear, topological, and non-linear.",
    bullets: ["PCA · loadings · physical axes", "UMAP + HDBSCAN clusters", "t-SNE · Autoencoder (z=2)"],
    to: "/docs/astrospectro/dimred",
    priority: false,
  },
  {
    icon: "⭐",
    label: "CENTRAL CONTRIBUTION",
    title: "Scientific Analysis",
    description:
      "SHAP interpretability, classification performance, and scientific validation against Gaia DR3.",
    bullets: ["⭐ SHAP · Mg b #1 globally", "89.2 % balanced · ROC-AUC 0.986", "F/G confusion · limitations"],
    to: "/docs/astrospectro/science",
    priority: true,
  },
  {
    icon: "◧",
    label: "HOW-TO",
    title: "Guides",
    description:
      "Practical step-by-step guides to install, download data, train, and reproduce results.",
    bullets: ["Installation · quick start", "Gaia connection (CDS XMatch)", "Model training · visualization"],
    to: "/docs/astrospectro/guides",
    priority: false,
  },
  {
    icon: "{}",
    label: "REFERENCE",
    title: "API Reference",
    description:
      "Module-level documentation for Preprocessor, FeatureEngineer, Classifier, and the Dimred sub-package.",
    bullets: ["Preprocessor · FeatureEngineer", "SpectralClassifier · MasterPipeline", "Dimred sub-package"],
    to: "/docs/astrospectro/api",
    priority: false,
  },
  {
    icon: "◎",
    label: "PUBLICATION",
    title: "Community",
    description:
      "Roadmap, RNAAS manuscript status, citation format, and contribution guidelines.",
    bullets: ["Manuscript · RNAAS / A&A target", "Roadmap · Nov 2026 deadline", "Citing · roadmap · FAQ"],
    to: "/docs/astrospectro/community/roadmap",
    priority: false,
  },
];

// ── Run provenance ────────────────────────────────────────────────────────────
const RUN = {
  exp: "ST_350k_xgb_AFGKM_v6",
  saved: "20260522T161236Z",
  hash: "e752bb7ce5494364364f77a4200aa480",
  notes: "Full dataset retraining · 350k spectra · spectro_only · isotonic calibration",
};

// ── Components ────────────────────────────────────────────────────────────────

export function AstroSpectroStats() {
  return (
    <div className={styles.statsRow}>
      {STATS.map((s) => (
        <div
          key={s.label}
          className={`${styles.statCard} ${s.accent === "blue" ? styles.statAccentBlue : ""}`}
        >
          <span className={styles.statValue}>{s.value}</span>
          <span className={styles.statLabel}>{s.label}</span>
          <span className={styles.statContext}>{s.context}</span>
        </div>
      ))}
    </div>
  );
}

export function AstroSpectroSections() {
  return (
    <div className={styles.sectionsGrid}>
      {SECTIONS.map((s) => (
        <Link
          key={s.title}
          to={useBaseUrl(s.to)}
          className={`${styles.sectionCard} ${s.priority ? styles.sectionCardPriority : ""}`}
        >
          <div className={styles.sectionTop}>
            <span className={styles.sectionIcon}>{s.icon}</span>
            <span className={styles.sectionLabel}>{s.label}</span>
          </div>
          <h3 className={styles.sectionTitle}>{s.title}</h3>
          <p className={styles.sectionDescription}>{s.description}</p>
          <ul className={styles.sectionBullets}>
            {s.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <span className={styles.sectionCta}>Open section →</span>
        </Link>
      ))}
    </div>
  );
}

export function AstroSpectroRun() {
  return (
    <div className={styles.runBox}>
      <span className={styles.runLabel}>Current run</span>
      <div className={styles.runGrid}>
        <div className={styles.runItem}>
          <span className={styles.runKey}>Experiment</span>
          <code className={styles.runVal}>{RUN.exp}</code>
        </div>
        <div className={styles.runItem}>
          <span className={styles.runKey}>Saved (UTC)</span>
          <code className={styles.runVal}>{RUN.saved}</code>
        </div>
        <div className={styles.runItem}>
          <span className={styles.runKey}>MD5</span>
          <code className={styles.runVal}>{RUN.hash}</code>
        </div>
        <div className={styles.runItem}>
          <span className={styles.runKey}>Notes</span>
          <span className={styles.runVal}>{RUN.notes}</span>
        </div>
      </div>
    </div>
  );
}
