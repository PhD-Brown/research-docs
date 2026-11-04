---
title: SDSS DR16 Crossmatch
description: Positional cross-match of Galaxy10 DECaLS with SDSS DR16 through CDS XMatch — match rate, colours, stellar-population labels and the limits of the derived absolute magnitude.
sidebar_position: 4
---

import Fact from '@site/src/components/astrovision/Fact';
import FactCards from '@site/src/components/astrovision/FactCards';
import FactTable from '@site/src/components/astrovision/FactTable';
import FactProvenance from '@site/src/components/astrovision/FactProvenance';
import FigureGallery from '@site/src/components/FigureGallery';
import RelatedPages from '@site/src/components/RelatedPages';

{/* facts: facts.json crossmatch.* (data/master_synthesis.csv; csv_summaries.json for the 57 columns) · code: src/astrovision/crossmatcher.py · notebook 05 (complement: KS tests, Lasso) */}

export const xmFigures = [
  { src: '/img/astrovision/xm_overview.png', title: 'Cross-match overview', desc: 'Match statistics and colour distributions.' },
  { src: '/img/astrovision/xm_cmd.png', title: 'Colour–magnitude diagram', desc: 'g−r against absolute magnitude (galaxies with Mr).' },
  { src: '/img/astrovision/xm_color_by_class.png', title: 'Colour by class', desc: 'g−r distribution per morphology class.' },
  { src: '/img/astrovision/xm_populations.png', title: 'Stellar populations', desc: 'Blue cloud, green valley, red sequence by class.' },
  { src: '/img/astrovision/xm_class_summary.png', title: 'Class summary', desc: 'Per-class photometric summary.' },
  { src: '/img/astrovision/xm_bpt_proxy.png', title: 'BPT-like proxy', desc: 'Photometric colour proxy, not a spectral diagnostic.' },
];

# SDSS DR16 Crossmatch

`Galaxy10Crossmatcher` (`src/astrovision/crossmatcher.py`) matches each Galaxy10 position to **SDSS DR16** (`vizier:V/154/sdss16`) with the CDS XMatch service, in batches of 5,000 sources, and caches the result as a compressed CSV.

## Key results

<FactCards cards={[
  { k: 'crossmatch.n_matched', format: 'int', label: 'Galaxies matched', context: 'objID present · 3″ radius', accent: '#34D399' },
  { k: 'crossmatch.match_rate', format: 'pct', label: 'Match rate', context: 'of all Galaxy10 images', accent: '#38BDF8' },
  { k: 'crossmatch.n_with_zsp', format: 'int', label: 'With spectroscopic z', context: 'SDSS spectra', accent: '#F59E0B' },
  { k: 'crossmatch.median_gr', format: 'num', label: 'Median g−r', context: 'all matched galaxies', accent: '#A78BFA' },
]} />

:::warning[“5,651 matches” in older descriptions]
Some project descriptions quote 5,651 matched galaxies (<Fact k="crossmatch.n_with_mr" format="int" />, about a third of the dataset). That count is the number of galaxies with an **absolute magnitude**, which requires a spectroscopic redshift; it is not the match rate. The photometric match covers <Fact k="crossmatch.n_matched" format="int" /> galaxies.
:::

## Method

| Step | Detail |
|---|---|
| Catalogue | SDSS DR16 photometry via VizieR `V/154/sdss16` (<Fact k="crossmatch.max_ang_dist_arcsec" format="num" digits={2} />″ is the largest separation retained) |
| Radius | <Fact k="crossmatch.radius_arcsec" format="num" digits={1} />″ (`radius_as` default), nearest counterpart kept |
| Colours | u−g, g−r, r−i, i−z, u−r from the five SDSS magnitudes |
| Populations | blue cloud: u−r &lt; <Fact k="crossmatch.ur_blue_cloud_max" format="num" digits={2} />; red sequence: u−r &gt; <Fact k="crossmatch.ur_red_sequence_min" format="num" digits={2} />; green valley: in between |
| Absolute magnitude `Mr` | r minus a distance modulus from cz/H₀ with H₀ = 70 km/s/Mpc; uses `zsp`; galaxies without it get no `Mr` |

## Populations

<FactTable labelHeader="Population" columns={[{ header: 'Galaxies', format: 'int' }, { header: 'Share of matches', format: 'pct' }]} rows={[
  { label: 'Blue cloud', keys: ['crossmatch.population.blue_cloud.n', 'crossmatch.population.blue_cloud.share'] },
  { label: 'Green valley', keys: ['crossmatch.population.green_valley.n', 'crossmatch.population.green_valley.share'] },
  { label: 'Red sequence', keys: ['crossmatch.population.red_sequence.n', 'crossmatch.population.red_sequence.share'] },
]} caption="Source: data/master_synthesis.csv, column population. Per-class fractions: Morphology Classes page." />

Colour discriminates morphology: in pairwise Kolmogorov–Smirnov tests of the g−r distributions, <Fact k="crossmatch.ks_pairs_significant" format="int" /> of <Fact k="crossmatch.ks_pairs_total" format="int" /> class pairs differ at p &lt; 0.01 (notebook 05).

<FactProvenance prefixes={['crossmatch.ks_pairs_significant', 'crossmatch.lasso_gr']} />

:::caution[Limits of the derived quantities]
- `Mr` ignores K-corrections and extinction and assumes a Hubble-flow distance: it is a crude luminosity proxy, valid only for the galaxies with `zsp`.
- The match is positional only; at 3″ some counterparts may be neighbours rather than the target galaxy.
- The u−r thresholds are fixed constants in the code (attributed there to Baldry et al. 2004), not fitted to this sample.
:::

## Figures

<FigureGallery figures={xmFigures} columns={3} />

<RelatedPages pages={[
  { href: '/astrovision/data/morphology-classes', title: 'Morphology Classes', desc: 'Colour fractions per class', category: 'science' },
  { href: '/astrovision/results/physical-interpretation', title: 'Physical Interpretation', desc: 'What colour tells about DINOv2 features', category: 'science' },
  { href: '/astrovision/api/crossmatcher', title: 'crossmatcher.py', desc: 'API reference', category: 'api' },
]} />
