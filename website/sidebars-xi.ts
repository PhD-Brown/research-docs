import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  xiSidebar: [
    { type: "doc", id: "index", label: "ξ Dark Energy · BAO MCMC" },
    {
      type: "category", label: "Overview", collapsible: false,
      items: [
        "overview/index",
        "overview/scientific-motivation",
        "overview/models",
        "overview/key-findings",
      ],
    },
    {
      type: "category", label: "Data",
      items: [
        "data/index",
        "data/pantheon-shoes",
        "data/desi-dr2-bao",
        "data/covariance",
      ],
    },
    {
      type: "category", label: "Inference Pipeline",
      items: [
        "inference/index",
        "inference/likelihood",
        { type: "doc", id: "inference/priors", label: "📊 Prior Specification" },
        "inference/mcmc-setup",
        "inference/convergence",
        "inference/model-comparison",
      ],
    },
    {
      type: "category", label: "Results",
      items: [
        "results/index",
        "results/parameter-constraints",
        "results/corner-plots",
        "results/oscillation",
        { type: "doc", id: "results/caveats", label: "⚠️ Known Limitations" },
      ],
    },
    {
      type: "category", label: "Reproducibility",
      items: [
        "reproducibility/index",
        "reproducibility/installation",
        "reproducibility/quick-run",
        "reproducibility/outputs",
      ],
    },
    {
      type: "category", label: "API Reference",
      items: [
        "api/index",
        "api/models",
        "api/likelihood",
        "api/diagnostics",
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
