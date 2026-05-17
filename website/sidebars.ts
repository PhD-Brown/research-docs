import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  // ── Home & Atlas ──────────────────────────────────────────────────────────
  homeSidebar: [
    { type: "doc", id: "index", label: "🏠 Home" },
    { type: "doc", id: "ecosystem", label: "Research Ecosystem" },
    { type: "doc", id: "reading-paths", label: "Reading Paths" },
    {
      type: "category", label: "Atlas",
      items: [
        "atlas/index", "atlas/glossary", "atlas/acronyms",
        "atlas/methods-index", "atlas/datasets-index",
        "atlas/figures-index", "atlas/notebook-atlas", "atlas/repository-map",
      ],
    },
  ],

  // ── AstroSpectro ──────────────────────────────────────────────────────────
  astrospectroSidebar: [
    { type: "doc", id: "astrospectro/index", label: "🌟 AstroSpectro" },
    {
      type: "category", label: "Overview", collapsible: false,
      items: [
        "astrospectro/overview/index",
        "astrospectro/overview/scientific-motivation",
        "astrospectro/overview/key-results",
        "astrospectro/overview/project-map",
        "astrospectro/overview/current-status",
      ],
    },
    {
      type: "category", label: "Concepts & Architecture",
      items: [
        "astrospectro/concepts/index",
        "astrospectro/concepts/pipeline-philosophy",
        "astrospectro/concepts/spectro-only-mode",
        "astrospectro/concepts/data-lifecycle",
        "astrospectro/concepts/physical-purity",
        "astrospectro/concepts/reproducibility",
      ],
    },
    {
      type: "category", label: "Data & Datasets",
      items: [
        "astrospectro/data/index",
        "astrospectro/data/lamost-dr5",
        "astrospectro/data/gaia-dr3",
        "astrospectro/data/master-catalog",
        "astrospectro/data/feature-dataset",
        "astrospectro/data/feature-catalog",
        "astrospectro/data/class-taxonomy",
        "astrospectro/data/quality-filters",
        "astrospectro/data/dataset-versions",
      ],
    },
    {
      type: "category", label: "Core Pipeline",
      items: [
        "astrospectro/pipeline/index",
        "astrospectro/pipeline/preprocessing",
        "astrospectro/pipeline/peak-detection",
        "astrospectro/pipeline/feature-engineering",
        "astrospectro/pipeline/processing-pipeline",
        "astrospectro/pipeline/classification",
        "astrospectro/pipeline/master-pipeline",
        "astrospectro/pipeline/experiment-tracking",
      ],
    },
    {
      type: "category", label: "Dimensionality Reduction",
      items: [
        "astrospectro/dimred/index",
        "astrospectro/dimred/data-loader",
        "astrospectro/dimred/pca",
        "astrospectro/dimred/umap-hdbscan",
        "astrospectro/dimred/tsne",
        "astrospectro/dimred/autoencoder",
        "astrospectro/dimred/sensitivity",
        "astrospectro/dimred/comparison",
      ],
    },
    {
      type: "category", label: "Scientific Analysis",
      items: [
        "astrospectro/science/index",
        "astrospectro/science/validation",
        { type: "doc", id: "astrospectro/science/shap-interpretability", label: "⭐ SHAP Interpretability" },
        "astrospectro/science/classification-performance",
        "astrospectro/science/feature-physics",
        "astrospectro/science/fg-confusion",
        "astrospectro/science/limitations",
      ],
    },
    {
      type: "category", label: "Guides",
      items: [
        "astrospectro/guides/index",
        "astrospectro/guides/installation",
        "astrospectro/guides/quick-start",
        "astrospectro/guides/downloading-data",
        "astrospectro/guides/preprocessing",
        "astrospectro/guides/feature-extraction",
        "astrospectro/guides/model-training",
        "astrospectro/guides/visualization",
      ],
    },
    {
      type: "category", label: "API Reference",
      items: [
        "astrospectro/api/index",
        "astrospectro/api/preprocessor",
        "astrospectro/api/feature-engineer",
        "astrospectro/api/classifier",
        "astrospectro/api/master-pipeline",
        {
          type: "category", label: "Dimred sub-package",
          items: [
            "astrospectro/api/dimred/data-loader",
            "astrospectro/api/dimred/pca-analyzer",
            "astrospectro/api/dimred/embedding",
            "astrospectro/api/dimred/hdbscan-analyzer",
          ],
        },
      ],
    },
    {
      type: "category", label: "Community",
      items: [
        "astrospectro/community/roadmap",
        "astrospectro/community/contributing",
        "astrospectro/community/citing",
        "astrospectro/community/faq",
        "astrospectro/community/acknowledgements",
      ],
    },
  ],
};

export default sidebars;
