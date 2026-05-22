export const projectCards = [
  {
    accent: "astrospectro",
    eyebrow: "stellar spectroscopy · interpretable ML",
    title: "AstroSpectro",
    description:
      "A physics-first research program for stellar spectral classification, feature engineering, interpretability, and latent-structure analysis from LAMOST DR5 spectra.",
    status: "primary program",
    bullets: [
      "LAMOST DR5 × Gaia DR3 ecosystem",
      "Interpretability, validation, and reproducibility",
      "Dimensionality reduction as scientific analysis",
    ],
    docsTo: "/docs/astrospectro/",
    repoHref: "https://github.com/PhD-Brown/AstroSpectro",
  },
  {
    accent: "astrovision",
    eyebrow: "galaxy morphology · representation learning",
    title: "AstroVision",
    description:
      "A multimodal deep-learning project for galaxy morphology, uncertainty-aware classification, and the physical interpretation of visual representations.",
    status: "active companion project",
    bullets: [
      "Galaxy imaging and morphology",
      "DINOv2, morphometrics, and multimodal fusion",
      "A bridge toward cross-modal astro-AI",
    ],
    docsTo: "/astrovision/overview/",
    repoHref: "https://github.com/PhD-Brown/AstroVision",
  },
  {
    accent: "xi",
    eyebrow: "cosmology · bayesian inference",
    title: "ξ Dark Energy",
    description:
      "A reproducible Bayesian inference pipeline comparing dark-energy model families with supernovae and BAO measurements in an explicitly exploratory framework.",
    status: "exploratory research track",
    bullets: [
      "ΛCDM, CPL, and oscillating dark-energy models",
      "Transparent inference assumptions and caveats",
      "Reproducible MCMC workflow",
    ],
    docsTo: "/xi-dark-energy/overview/",
    repoHref: "https://github.com/PhD-Brown/xi-dark-energy-bao-mcmc",
  },
];

export const heroPrograms = [
  {
    accent: "astrospectro",
    title: "AstroSpectro",
    description: "stellar spectra, physics, interpretability",
  },
  {
    accent: "astrovision",
    title: "AstroVision",
    description: "galaxy morphology, imaging, multimodal learning",
  },
  {
    accent: "xi",
    title: "ξ Dark Energy",
    description: "cosmology, inference, transparent caveats",
  },
];

export const layerCards = [
  {
    title: "Personal site",
    label: "Narrative hub",
    description:
      "Who I am, why these projects exist, and how they fit into my broader academic and research trajectory.",
    to: "https://phd-brown.github.io",
    kind: "external",
  },
  {
    title: "This documentation site",
    label: "Technical reference",
    description:
      "How the projects work, what they contain, how they are organised, and where to start for methods, data, results, and reproducibility.",
    to: "/docs/ecosystem",
    kind: "internal",
  },
  {
    title: "GitHub repositories",
    label: "Project entry points",
    description:
      "Code, releases, notebooks, readmes, and repository-level context for each research program.",
    to: "https://github.com/PhD-Brown",
    kind: "external",
  },
];

export const readingPaths = [
  {
    title: "I’m new here",
    description:
      "Start with the ecosystem map, understand how the three projects relate, then choose a project overview.",
    to: "/docs/ecosystem",
    cta: "Open Research Ecosystem",
  },
  {
    title: "I want results first",
    description:
      "Jump directly into the strongest scientific directions, current findings, and high-level project takeaways.",
    to: "/docs/astrospectro/",
    cta: "Start with AstroSpectro",
  },
  {
    title: "I want to reproduce something",
    description:
      "Use the guided reading paths and section roots to move quickly from architecture to implementation and practical workflows.",
    to: "/docs/reading-paths",
    cta: "See Reading Paths",
  },
  {
    title: "I need concepts and definitions",
    description:
      "Use the atlas and section overviews to recover terminology, structure, and cross-project reference material.",
    to: "/docs/atlas/",
    cta: "Browse the Atlas",
  },
];

export const highlightCards = [
  {
    accent: "astrospectro",
    title: "AstroSpectro",
    subtitle: "Interpretable stellar spectroscopy",
    description:
      "The central direction is not only performance, but understanding what physically meaningful structure modern models learn from stellar spectra.",
    to: "/docs/astrospectro/",
    cta: "Explore the project",
  },
  {
    accent: "astrovision",
    title: "AstroVision",
    subtitle: "Morphology as representation learning",
    description:
      "AstroVision extends the ecosystem into galaxy imaging, uncertainty-aware classification, and multimodal visual representations with astrophysical meaning.",
    to: "/astrovision/overview/",
    cta: "Open AstroVision docs",
  },
  {
    accent: "xi",
    title: "ξ Dark Energy",
    subtitle: "Transparent exploratory cosmology",
    description:
      "The cosmology branch emphasizes explicit assumptions, reproducible inference, and careful documentation of what remains exploratory or unresolved.",
    to: "/xi-dark-energy/overview/",
    cta: "Open ξ Dark Energy docs",
  },
];

export const browseCards = [
  {
    title: "Research ecosystem",
    description:
      "See how the three projects relate intellectually, scientifically, and technically.",
    to: "/docs/ecosystem",
  },
  {
    title: "Reading paths",
    description:
      "Choose a path by persona: supervisor, reproducer, student, or future Alex.",
    to: "/docs/reading-paths",
  },
  {
    title: "Data & feature reference",
    description:
      "Jump into structured dataset and feature documentation, starting from AstroSpectro.",
    to: "/docs/astrospectro/data/feature-dataset",
  },
  {
    title: "Atlas",
    description:
      "Use the cross-project reference layer for terms, maps, and high-level navigation.",
    to: "/docs/atlas/",
  },
];
