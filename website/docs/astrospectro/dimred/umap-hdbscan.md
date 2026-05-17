---
title: "UMAP & HDBSCAN Clustering"
description: UMAP projection and unsupervised HDBSCAN clustering of the stellar spectral feature space.
sidebar_position: 2
---

# UMAP & HDBSCAN Clustering

UMAP projection and unsupervised HDBSCAN clustering of the stellar spectral feature space.

:::info Under construction
This page is actively being developed. Core content is added progressively.
:::

## What this page covers

- UMAP configuration: n_neighbors=15, min_dist=0.1, 91 PCA components
- Harvard sequence emerges without supervision
- HDBSCAN: 20 clusters, 6.14% noise, min_cluster_size=75
- Cluster physical interpretation (C11=main sequence G-K, C13=cool K dwarfs)
- Negative control: permuted features → no structure
- ρ(UMAP axis 1, T_eff)=+0.464

## See also

- [PCA](./pca)
- [t-SNE & Stability](./tsne)