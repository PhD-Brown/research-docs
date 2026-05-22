export const projectFlows = [
  {
    accent: "astrospectro",
    dataset: "LAMOST DR5 spectra",
    project: "AstroSpectro",
    outcome: "Stellar classification, feature engineering, SHAP, and latent-structure analysis",
    bridge: "Bridge question: what physical information do learned spectral features actually encode?",
    docsTo: "/docs/astrospectro/",
  },
  {
    accent: "astrovision",
    dataset: "Galaxy10 DECaLS",
    project: "AstroVision",
    outcome: "Morphological classification, representation learning, multimodal fusion, and physical structure analysis",
    bridge: "Shared concern: can learned visual representations become physically meaningful astronomy tools?",
    docsTo: "/astrovision/overview/",
  },
  {
    accent: "xi",
    dataset: "Pantheon+SH0ES + DESI",
    project: "ξ Dark Energy",
    outcome: "Bayesian model comparison, parameter inference, diagnostics, and explicit cosmological caveats",
    bridge: "Shared methodology: transparent Bayesian inference, reproducibility, and explicit uncertainty handling",
    docsTo: "/xi-dark-energy/overview/",
  },
];

export const themes = [
  {
    title: "Interpretability",
    summary: "Each project tries to open the black box, but in a project-specific way.",
    rows: [
      { project: "AstroSpectro", value: "SHAP-driven spectral interpretation and feature-level astrophysical reading" },
      { project: "AstroVision", value: "Attention maps, visual saliency, and morphology-aware representation analysis" },
      { project: "ξ Dark Energy", value: "Explicit caveats, model transparency, and interpretation through posterior structure" },
    ],
  },
  {
    title: "Uncertainty",
    summary: "Predictions and conclusions matter only if uncertainty is made visible and discussable.",
    rows: [
      { project: "AstroSpectro", value: "Confidence-aware classification and robustness-oriented evaluation" },
      { project: "AstroVision", value: "Uncertainty-aware deep learning through dropout, calibration, and multimodal caution" },
      { project: "ξ Dark Energy", value: "Posterior asymmetry, parameter degeneracy, and model-sensitivity diagnostics" },
    ],
  },
  {
    title: "Reproducibility",
    summary: "Every branch of the ecosystem is designed to leave behind a traceable research path.",
    rows: [
      { project: "AstroSpectro", value: "Tracked experiments, versioned notebooks, and documented pipelines" },
      { project: "AstroVision", value: "Versioned analysis notebooks, controlled training workflows, and modular experimentation" },
      { project: "ξ Dark Energy", value: "Reproducible MCMC pipeline, diagnostics, and explicit run structure" },
    ],
  },
  {
    title: "Physical grounding",
    summary: "The final criterion is not only performance, but scientific meaning.",
    rows: [
      { project: "AstroSpectro", value: "Physics-based spectroscopic descriptors and stellar-domain interpretation" },
      { project: "AstroVision", value: "Galaxy morphology, morphometrics, and visually meaningful structure" },
      { project: "ξ Dark Energy", value: "Physically motivated cosmological parameterisations and observational constraints" },
    ],
  },
];

export const scientificQuestions = [
  {
    accent: "astrospectro",
    project: "AstroSpectro",
    question: "What physical information do modern machine-learning models actually learn from stellar spectra?",
    why: "The project is built around the idea that interpretability only matters scientifically if learned structure can be tied back to astrophysical signal.",
    to: "/docs/astrospectro/",
  },
  {
    accent: "astrovision",
    project: "AstroVision",
    question: "Can self-supervised visual representations trained outside astronomy capture physically meaningful galaxy structure?",
    why: "AstroVision tests whether modern visual encoders can become more than classifiers: tools for representation, morphology, and scientific interpretation.",
    to: "/astrovision/overview/",
  },
  {
    accent: "xi",
    project: "ξ Dark Energy",
    question: "How do alternative dark-energy parameterisations behave under current observational constraints?",
    why: "The cosmology branch explores model behaviour carefully, with transparency about what is constrained, what remains ambiguous, and what stays exploratory.",
    to: "/xi-dark-energy/overview/",
  },
];

export const ecosystemPrinciples = [
  {
    title: "Scientific ML, not benchmark chasing",
    description:
      "The ecosystem values scientific understanding, physical relevance, and interpretability more than leaderboard-style optimisation.",
  },
  {
    title: "Reproducibility as a research requirement",
    description:
      "Pipelines, notebooks, and decisions should remain intelligible, rerunnable, and useful to a future collaborator — or to future Alex.",
  },
  {
    title: "Physical meaning over black-box convenience",
    description:
      "Methods are selected not only because they work, but because they can be argued for scientifically and linked back to the problem domain.",
  },
  {
    title: "Cross-project transfer of methods",
    description:
      "The three projects are distinct, but they cross-pollinate through shared themes: interpretability, uncertainty, representation, and Bayesian reasoning.",
  },
];

export const ctas = [
  {
    title: "Open AstroSpectro",
    description: "Start with the flagship spectroscopy program and its scientific documentation.",
    to: "/docs/astrospectro/",
  },
  {
    title: "Read the journal",
    description: "See how the ecosystem evolves over time through milestones, notes, and design decisions.",
    to: "/journal",
  },
  {
    title: "Follow a reading path",
    description: "Use guided entry points based on what you want to learn or reproduce.",
    to: "/docs/reading-paths",
  },
];
