#!/usr/bin/env node
// Vérifie tous les liens internes (a[href], img[src], iframe[src], link[href]) du site construit.
// Complète le contrôle natif de Docusaurus, qui ignore les <a href> bruts rendus par les composants React.
// Usage : node check-links.mjs [buildDir=website/build] [--base=/research-docs/] [--only=<sous-chaîne d'URL de page>]
//                               [--ignore=<lien>,<lien>] [--baseline=<rapport.json>] [--json]
//   --baseline : rapport produit par --json sur main ; seuls les couples (page, lien) NOUVEAUX font échouer.
//   --ignore   : liens cassés connus à ignorer (ex. /research-docs/blog,/research-docs/journal).
// Code de sortie : 0 = aucun lien cassé (ou aucun nouveau avec --baseline), 1 = liens cassés, 2 = build absent.
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find((x) => x.startsWith(`--${k}=`)); return a ? a.split('=').slice(1).join('=') : d; };
const buildDir = path.resolve(args.find((a) => !a.startsWith('--')) || 'website/build');
const base = opt('base', '/research-docs/');
const only = opt('only', null);
const asJson = args.includes('--json');
const ignore = new Set((opt('ignore', '') || '').split(',').filter(Boolean));
const baselineFile = opt('baseline', null);
const baseline = new Set();
if (baselineFile) {
  const b = JSON.parse(fs.readFileSync(baselineFile, 'utf8'));
  for (const r of b.broken) {
    // Un lien cassé sur > 50 pages de la baseline vient de la navbar/du footer : connu partout, y compris sur une page nouvelle.
    if (r.pages.length > 50) ignore.add(r.link.split('  ⇒  ')[0]);
    for (const p of r.pages) baseline.add(`${p}\t${r.link}`);
  }
}
if (!fs.existsSync(buildDir)) { console.error(`build introuvable : ${buildDir} (lancer npm run build)`); process.exit(2); }

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
// On ignore les HTML statiques (ex. figures Plotly dans img/) : ce ne sont pas des pages Docusaurus.
const htmlFiles = walk(buildDir).filter((f) => f.endsWith('.html') && !/^(img|assets)\//.test(path.relative(buildDir, f).split(path.sep).join('/')));

function pageUrlOf(file) {
  let rel = path.relative(buildDir, file).split(path.sep).join('/');
  if (rel === 'index.html') return base;
  rel = rel.replace(/\/index\.html$/, '/').replace(/\.html$/, '');
  return base + rel;
}
function existsForUrl(pathname) {
  if (!pathname.startsWith(base)) return false;
  let rel = decodeURIComponent(pathname.slice(base.length));
  const cands = rel === '' || rel.endsWith('/')
    ? [path.join(buildDir, rel, 'index.html')]
    : [path.join(buildDir, rel), path.join(buildDir, rel + '.html'), path.join(buildDir, rel, 'index.html')];
  return cands.some((c) => fs.existsSync(c) && fs.statSync(c).isFile());
}

// Le minifieur HTML de Docusaurus retire les guillemets : on accepte "x", 'x' et x.
const tagRe = /<(a|img|iframe|link|source)\b([^>]*)>/gi;
const attrRe = /\s(href|src)=(?:"([^"]*)"|'([^']*)'|([^\s>"']+))/i;
const broken = new Map(); // target -> Set(pages)
let checked = 0;
for (const f of htmlFiles) {
  const pageUrl = pageUrlOf(f);
  if (only && !pageUrl.includes(only)) continue;
  const html = fs.readFileSync(f, 'utf8');
  for (const t of html.matchAll(tagRe)) {
    const a = t[2].match(attrRe);
    if (!a) continue;
    const m = [null, t[1], a[1]];
    const raw = (a[2] ?? a[3] ?? a[4] ?? '').replace(/&amp;/g, '&');
    if (!raw || /^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(raw)) continue;
    if (m[1].toLowerCase() === 'link' && !/\.(css|png|ico|svg|xml)(\?|$)/.test(raw)) continue;
    let u;
    try { u = new URL(raw, 'http://x' + pageUrl); } catch { continue; }
    checked++;
    if (!existsForUrl(u.pathname)) {
      if (ignore.has(raw) || ignore.has(u.pathname)) continue;
      const key = `${raw}  ⇒  ${u.pathname}`;
      if (baseline.has(`${pageUrl}\t${key}`)) continue;
      if (!broken.has(key)) broken.set(key, new Set());
      broken.get(key).add(pageUrl);
    }
  }
}
const rows = [...broken.entries()].map(([k, s]) => ({ link: k, pages: [...s].sort() }));
if (asJson) { console.log(JSON.stringify({ checked, broken: rows }, null, 2)); }
else {
  console.log(`Liens internes vérifiés : ${checked} — cassés (uniques)${baselineFile ? ' NOUVEAUX vs baseline' : ''} : ${rows.length}`);
  for (const r of rows.sort((a, b) => b.pages.length - a.pages.length)) {
    const p = r.pages.length > 4 ? `${r.pages.slice(0, 3).join(', ')} … (+${r.pages.length - 3} pages)` : r.pages.join(', ');
    console.log(`✗ ${r.link}\n    sur : ${p}`);
  }
}
process.exit(rows.length ? 1 : 0);
