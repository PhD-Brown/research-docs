import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  astrovisionSidebar: [
    { type: "doc", id: "index", label: "🔭 AstroVision" },
    {
      type: "category", label: "Overview", collapsible: false,
      items: [
        "overview/index",
        "overview/scientific-motivation",
        "overview/key-results",
        "overview/link-to-astrospectro",
        "overview/project-structure",
      ],
    },
    {
      type: "category", label: "Data",
      items: [
        "data/index",
        "data/galaxy10-decals",
        "data/morphology-classes",
        "data/sdss-crossmatch",
        "data/data-preparation",
      ],
    },
    {
      type: "category", label: "Models & Methods",
      items: [
        "models/index",
        "models/baseline-cnn",
        "models/efficientnet",
        "models/dinov2-probing",
        "models/dinov2-finetuned",
        { type: "doc", id: "models/late-fusion", label: "⭐ Late-Fusion Multimodal" },
        "models/segmentation",
        "models/morphometry",
      ],
    },
    {
      type: "category", label: "Results",
      items: [
        "results/index",
        "results/benchmarking",
        { type: "doc", id: "results/evaluation-protocol", label: "📐 Evaluation Protocol" },
        "results/uncertainty",
        "results/attention-gradcam",
        "results/physical-interpretation",
        "results/limitations",
      ],
    },
    {
      type: "category", label: "Guides",
      items: [
        "guides/index",
        "guides/installation",
        "guides/train-classifier",
        "guides/run-gradcam",
        "guides/run-segmentation",
        "guides/compute-morphometry",
      ],
    },
    {
      type: "category", label: "API Reference",
      items: [
        "api/index",
        "api/models",
        "api/trainer",
        "api/morphometry",
        "api/gradcam",
        "api/crossmatcher",
      ],
    },
    {
      type: "category", label: "Community",
      items: [
        "community/citing",
        "community/roadmap",
      ],
    },
  ],
};

export default sidebars;
