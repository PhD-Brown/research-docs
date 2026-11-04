import React, { useEffect, useRef } from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import { getReferenceRun, fmt, leakNote, shortName, generationLabel, LEAK_AUDIT_PATH } from '@site/src/data/astrospectro';
import { getFact as avFact, fmt as avFmt, CLASSES as AV_CLASSES } from '@site/src/data/astrovision';
import { getProtocol, fmt as xiFmt, MODELS as XI_MODELS } from '@site/src/data/xi';

// ── Animated star field ───────────────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    let stars = [];

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      stars = Array.from({ length: 280 }, () => ({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        r:       Math.random() * 1.4 + 0.3,
        base:    Math.random() * 0.6 + 0.15,
        phase:   Math.random() * Math.PI * 2,
        speed:   Math.random() * 0.018 + 0.006,
        // subtle colour tint — most white, few warm/cool
        hue:     Math.random() < 0.15 ? (Math.random() < 0.5 ? 200 : 35) : 0,
        sat:     Math.random() < 0.15 ? 80 : 0,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.phase += s.speed;
        const alpha = s.base + Math.sin(s.phase) * (s.base * 0.5);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.sat > 0
          ? `hsla(${s.hue}, ${s.sat}%, 90%, ${alpha})`
          : `rgba(255,255,255,${alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className={styles.starCanvas} aria-hidden />;
}

// ── Data ──────────────────────────────────────────────────────────────────────
// Aucun chiffre de résultat n'est codé ici : tout vient de runs.json (AstroSpectro), astrovision/facts.json et
// xi/facts.json (générés depuis _facts/ — voir CLAUDE.md, décision éditoriale n° 4).
const spectro = getReferenceRun('classifier');   // XGBoost v6, G2 — porte le drapeau « fuite Gaia »
const shap = getReferenceRun('shap');
const xi = getProtocol('protocol1b');

const compactK = (n) => `${Math.round(n / 1000)}k`;
const ordinal = (n) => ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth'][n] || `#${n}`;
const shapRank = (feature) => (shap.metrics.top.find((t) => t.feature === feature) || {}).rank;

const GAIA_COLS = spectro.features.gaia_photometric;
const SPECTRO_LEAK = leakNote(spectro);          // 'v6 · includes 4 Gaia/photometric features — see Data Leakage Audit'
const VISION_FUSION = fmt.pct(avFact('models.fusion.test.balanced_accuracy'));

const PROJECTS = [
  {
    glyph:   '✦',
    name:    'AstroSpectro',
    accent:  '#4B9FE1',
    tag:     'Stellar Spectroscopy · ML',
    blurb:   'Interpretable machine-learning pipeline for stellar spectral classification using LAMOST DR5 × Gaia DR3.',
    stats:   [[compactK(spectro.n.processed), 'spectra'], [String(spectro.features.selected), 'selected features'], [fmt.pct(spectro.metrics.balanced_accuracy), 'balanced accuracy']],
    note:    SPECTRO_LEAK,
    finding: 'Mg b & Ca II K > Balmer (SHAP)',
    href:    '/research-docs/docs/astrospectro/overview',
  },
  {
    glyph:   '◎',
    name:    'AstroVision',
    accent:  '#A78BFA',
    tag:     'Galaxy Morphology · Deep Learning',
    blurb:   'Late-fusion multimodal classifier combining DINOv2 visual features, morphometrics, and SDSS photometry.',
    stats:   [[avFmt.int(avFact('dataset.n_images')), 'galaxy images'], [String(AV_CLASSES.length), 'morphology classes'], [avFmt.pct(avFact('models.dinov2_ft.test.balanced_accuracy')), 'DINOv2 fine-tuned bal. acc.']],
    note:    `Best image-only model. Late fusion reaches ${VISION_FUSION} on a different split — not a modality gain.`,
    finding: `DINOv2 features predict g−r colour (Lasso, CV R² = ${avFmt.num(avFact('crossmatch.lasso_gr.r2_mean'), 3)})`,
    href:    '/research-docs/astrovision/overview',
  },
  {
    glyph:   'ξ',
    name:    'Dark Energy · BAO MCMC',
    accent:  '#FB923C',
    tag:     'Cosmological Inference · Bayesian',
    blurb:   'Reproducible Bayesian MCMC pipeline comparing ΛCDM, CPL, and Ξosc dark-energy models.',
    stats:   [[xiFmt.int(xi.data.n_sne), 'SN Ia (Pantheon+SH0ES)'], [String(xi.data.n_bao), 'DESI DR2 BAO pts'], [String(XI_MODELS.length), 'dark energy models']],
    finding: 'Explicit limitation documentation',
    href:    '/research-docs/xi-dark-energy/overview',
  },
];

const STATS = [
  { n: `${compactK(spectro.n.processed)}+`, label: 'spectra\nprocessed' },
  { n: String(spectro.features.selected),    label: 'selected\nfeatures' },
  { n: fmt.pct(spectro.metrics.balanced_accuracy), label: 'AstroSpectro\nbalanced acc.*' },
  { n: avFmt.pct(avFact('models.dinov2_ft.test.balanced_accuracy')), label: 'AstroVision\nbalanced acc.\n(DINOv2 fine-tuned)' },
];

const PATHS = [
  { q: 'Understand the scientific motivation', href: '/research-docs/docs/ecosystem',                                          label: 'Research Ecosystem' },
  { q: 'Reproduce an AstroSpectro pipeline',   href: '/research-docs/docs/astrospectro/guides/quick-start',                    label: 'Quick Start' },
  { q: 'Deep dive into the SHAP finding',       href: '/research-docs/docs/astrospectro/science/shap-interpretability',         label: 'SHAP Analysis' },
  { q: 'Explore galaxy morphology models',      href: '/research-docs/astrovision/models/',                                     label: 'AstroVision Models' },
  { q: 'Browse all methods across projects',    href: '/research-docs/docs/atlas/methods-index',                                label: 'Methods Index' },
  { q: 'Look up a term or acronym',             href: '/research-docs/docs/atlas/glossary',                                     label: 'Glossary' },
];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title="Research Documentation"
      description="Technical and scientific reference for astrophysics, astro-ML, and computational physics."
    >
      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <StarField />
        {/* nebula glows */}
        <div className={styles.nebula1} aria-hidden />
        <div className={styles.nebula2} aria-hidden />
        <div className={styles.nebula3} aria-hidden />

        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Alex Baker · Research Documentation</p>

          <h1 className={styles.heroTitle}>
            Interpretable machine&nbsp;learning<br />
            <em>for observational astrophysics</em>
          </h1>

          <p className={styles.heroSub}>
            Three open-source research projects at the intersection of stellar&nbsp;spectroscopy,
            galaxy&nbsp;morphology, and Bayesian&nbsp;cosmology.
          </p>

          <div className={styles.heroCtas}>
            <Link className={styles.ctaPrimary} to="/research-docs/docs/astrospectro/overview">
              Explore AstroSpectro
            </Link>
            <Link className={styles.ctaSecondary} to="/research-docs/docs">
              Browse all projects
            </Link>
          </div>
        </div>

        <div className={styles.scrollHint} aria-hidden>
          <span />
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────── */}
      <div className={styles.statsBar}>
        {STATS.map(s => (
          <div key={s.n} className={styles.statItem}>
            <span className={styles.statNum}>{s.n}</span>
            <span className={styles.statLbl}>{s.label}</span>
          </div>
        ))}
      </div>

      <p className={styles.statsNote}>
        * AstroSpectro: XGBoost {shortName(spectro)} ({fmt.int(spectro.n.processed)} spectra) includes {GAIA_COLS.length} Gaia/photometric features, so its metrics are not purely spectroscopic;{' '}
        <Link to={LEAK_AUDIT_PATH}>see the Data Leakage Audit</Link>.
      </p>

      {/* ── PROJECT CARDS ────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Three research projects</h2>
          <div className={styles.projectGrid}>
            {PROJECTS.map(p => (
              <Link
                key={p.name}
                to={p.href}
                className={styles.card}
                style={{ '--accent': p.accent }}
              >
                <div className={styles.cardGlow} aria-hidden />
                <div className={styles.cardTop}>
                  <span className={styles.cardGlyph} style={{ color: p.accent }}>{p.glyph}</span>
                  <span className={styles.cardTag}>{p.tag}</span>
                </div>
                <h3 className={styles.cardName}>{p.name}</h3>
                <p className={styles.cardBlurb}>{p.blurb}</p>
                <div className={styles.cardStats}>
                  {p.stats.map(([val, lbl]) => (
                    <div key={lbl} className={styles.cardStat}>
                      <span className={styles.cardStatNum}>{val}</span>
                      <span className={styles.cardStatLbl}>{lbl}</span>
                    </div>
                  ))}
                </div>
                {p.note && <p className={styles.cardNote}>{p.note}</p>}
                <div className={styles.cardFinding}>
                  <span className={styles.findingLabel}>Key finding</span>
                  <span className={styles.findingText}>{p.finding}</span>
                </div>
                <div className={styles.cardFooter}>
                  Read the docs <span className={styles.arrow}>→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHAP SPOTLIGHT ───────────────────────────────────────────── */}
      <section className={styles.spotlight}>
        <div className={styles.container}>
          <div className={styles.spotlightInner}>
            <p className={styles.spotlightTag}>⭐ Key Scientific Finding · AstroSpectro · SHAP Interpretability · {shortName(spectro)} · {generationLabel(spectro)}</p>
            <blockquote className={styles.spotlightQuote}>
              "SHAP analysis of the XGBoost classifier ({compactK(spectro.n.processed)} spectra, ROC-AUC&nbsp;{fmt.num(spectro.metrics.roc_auc_macro)})
              reveals that Mg&nbsp;b equivalent width ranks {ordinal(shapRank('feature_Mg_b_eq_width'))} globally, Ca&nbsp;II&nbsp;K{' '}
              {ordinal(shapRank('feature_CaIIK_eq_width'))} — metallicity-sensitive features dominate over classical Balmer temperature
              indicators in the learned classification structure. {fmt.pct(shap.metrics.physical_share)} of feature
              importance derives from physically interpretable spectroscopic descriptors."
            </blockquote>
            <p className={styles.spotlightCaveat}>
              Caveat: {shortName(spectro)} includes {GAIA_COLS.length} Gaia/photometric features ({GAIA_COLS.join(', ')}), which hold {fmt.pct(shap.metrics.gaia_photometric_share)} of the
              total importance — <Link to={LEAK_AUDIT_PATH}>see the Data Leakage Audit</Link>.
            </p>
            <Link
              to="/research-docs/docs/astrospectro/science/shap-interpretability"
              className={styles.spotlightLink}
            >
              Read the full SHAP analysis →
            </Link>
          </div>
        </div>
      </section>

      {/* ── READING PATHS ────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Where to start</h2>
          <div className={styles.pathGrid}>
            {PATHS.map(p => (
              <Link key={p.q} to={p.href} className={styles.pathCard}>
                <p className={styles.pathQ}>{p.q}</p>
                <p className={styles.pathLink}>{p.label} →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ECOSYSTEM NOTE ───────────────────────────────────────────── */}
      <section className={styles.ecosystemNote}>
        <div className={styles.container}>
          <div className={styles.noteGrid}>
            {[
              { icon: '◉', title: 'Personal site', text: 'Who I am, why these projects exist, publications, CV.', href: 'https://phd-brown.github.io', cta: 'phd-brown.github.io →' },
              { icon: '◈', title: 'This site', text: 'How the projects work, how to reproduce them, results in detail.', href: '/research-docs/docs', cta: 'Browse docs →' },
              { icon: '◇', title: 'GitHub repos', text: 'Project entry points — README, code, releases.', href: 'https://github.com/PhD-Brown', cta: 'github.com/PhD-Brown →' },
            ].map(n => (
              <Link key={n.title} to={n.href} className={styles.noteCard}>
                <span className={styles.noteIcon}>{n.icon}</span>
                <h4 className={styles.noteTitle}>{n.title}</h4>
                <p className={styles.noteText}>{n.text}</p>
                <p className={styles.noteCta}>{n.cta}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER STRIP ─────────────────────────────────────────────── */}
      <div className={styles.footerStrip}>
        {[
          { label: 'Personal Site', href: 'https://phd-brown.github.io' },
          { label: 'GitHub',        href: 'https://github.com/PhD-Brown' },
          { label: 'ORCID',         href: 'https://orcid.org/0009-0007-3242-1829' },
          { label: 'Contact',       href: 'mailto:albak1@ulaval.ca' },
        ].map((l, i, a) => (
          <React.Fragment key={l.label}>
            <Link to={l.href} className={styles.footerLink}>{l.label}</Link>
            {i < a.length - 1 && <span className={styles.footerDot}>·</span>}
          </React.Fragment>
        ))}
      </div>

    </Layout>
  );
}