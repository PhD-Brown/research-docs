---
title: "t-SNE & Stability Analysis"
description: t-SNE projection and Procrustes stability analysis compared to UMAP.
sidebar_position: 3
---

# t-SNE & Stability Analysis

t-SNE projection and Procrustes stability analysis compared to UMAP.

:::info Under construction
This page is actively being developed. Core content is added progressively.
:::

## What this page covers

- t-SNE configuration: perplexity=30, init='pca', 1000 iterations
- Archipelago structure vs UMAP continent
- Procrustes stability: t-SNE 60× more stable than UMAP
- dP(UMAP)=3.0×10⁻², dP(t-SNE)=5.0×10⁻⁴
- Sensitivity to perplexity: robust in [15,50]

## See also

- [UMAP & HDBSCAN](./umap-hdbscan)
- [Comparison](./comparison)