#!/usr/bin/env node
/*
 * Captures Playwright des pages modifiées : thème clair/sombre × bureau/mobile.
 *
 * Usage (depuis la racine du dépôt, après `npm run build` dans website/) :
 *   node .claude/skills/docs-verify/scripts/screenshots.cjs <route> [<route> …] [--out=.screenshots] [--port=3210]
 *   <route> = chemin sans baseUrl, ex. docs/astrospectro/dimred/pca  ou  docs/atlas/page-style-guide
 *   Raccourci : --from-git=main  → déduit les routes des fichiers .md/.mdx de website/docs* modifiés depuis main.
 *
 * Le script lance `docusaurus serve` sur le build, prend 4 captures pleine page par route, puis signale :
 *   - les erreurs console / exceptions JS de la page ;
 *   - le débordement horizontal (scrollWidth > largeur de la fenêtre), surtout en mobile ;
 *   - les images non chargées (naturalWidth = 0).
 *   - les ressources locales non chargées (les ressources externes — polices, CDN — ne sont qu'un avertissement).
 * Code de sortie : 0 si aucun problème, 1 sinon, 2 si prérequis manquant.
 */
const { spawn, execSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');
const net = require('node:net');

let playwright;
try {
  playwright = require('playwright');
} catch {
  console.error('Playwright introuvable. Installer : npm i -D playwright && npx playwright install chromium');
  process.exit(2);
}
const { chromium, devices } = playwright;

const repo = path.resolve(__dirname, '../../../..');
const website = path.join(repo, 'website');
const args = process.argv.slice(2);
const opt = (k, d) => {
  const a = args.find((x) => x.startsWith(`--${k}=`));
  return a ? a.split('=').slice(1).join('=') : d;
};
const port = Number(opt('port', 3210));
const outDir = path.resolve(repo, opt('out', '.screenshots'));
const BASE = '/research-docs/';

function routesFromGit(ref) {
  const scope = 'website/docs website/docs-astrovision website/docs-xi';
  const changed = execSync(`git diff --name-only ${ref} -- ${scope}`, { cwd: repo }).toString()
    + execSync(`git ls-files --others --exclude-standard -- ${scope}`, { cwd: repo }).toString(); // pages nouvelles non suivies
  const files = [...new Set(changed.split('\n'))].filter((f) => /\.mdx?$/.test(f) && !/\/_/.test(f) && fs.existsSync(path.join(repo, f)));
  return files.map((f) => {
    let r = f.replace(/^website\//, '').replace(/\.mdx?$/, '').replace(/\/index$/, '');
    r = r.replace(/^docs-astrovision/, 'astrovision').replace(/^docs-xi/, 'xi-dark-energy');
    return r;
  });
}

let routes = args.filter((a) => !a.startsWith('--'));
const fromGit = opt('from-git', null);
if (fromGit) routes = routes.concat(routesFromGit(fromGit));
routes = [...new Set(routes.map((r) => r.replace(/^\/+/, '').replace(BASE.slice(1), '')))];
if (!routes.length) {
  console.error('Aucune route. Exemple : screenshots.cjs docs/astrospectro/dimred/pca  (ou --from-git=main)');
  process.exit(2);
}
if (!fs.existsSync(path.join(website, 'build'))) {
  console.error('website/build absent : lancer `npm run build` dans website/ d\'abord.');
  process.exit(2);
}

const waitPort = (p, ms = 30000) => new Promise((resolve, reject) => {
  const t0 = Date.now();
  const tryOnce = () => {
    const s = net.connect(p, '127.0.0.1', () => { s.end(); resolve(); });
    s.on('error', () => (Date.now() - t0 > ms ? reject(new Error('serveur injoignable')) : setTimeout(tryOnce, 300)));
  };
  tryOnce();
});

const VARIANTS = [
  { name: 'desktop', context: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } },
  { name: 'mobile', context: { ...devices['iPhone 13'] } },
];
const THEMES = ['light', 'dark'];

(async () => {
  const server = spawn('npx', ['docusaurus', 'serve', '--dir', 'build', '--port', String(port), '--no-open'], {
    cwd: website, stdio: 'ignore', detached: true,
  });
  const stop = () => { try { process.kill(-server.pid); } catch { /* déjà arrêté */ } };
  process.on('exit', stop);
  let problems = 0;
  try {
    await waitPort(port);
    fs.mkdirSync(outDir, { recursive: true });
    const browser = await chromium.launch();
    for (const route of routes) {
      const url = `http://127.0.0.1:${port}${BASE}${route}`;
      const slug = route.replace(/[\/]/g, '__') || 'home';
      for (const v of VARIANTS) {
        for (const theme of THEMES) {
          const ctx = await browser.newContext({ ...v.context, colorScheme: theme });
          await ctx.addInitScript((t) => { try { localStorage.setItem('theme', t); } catch { /* stockage indisponible */ } }, theme);
          const page = await ctx.newPage();
          const errors = [];
          page.on('pageerror', (e) => errors.push(`exception: ${e.message}`));
          const warnings = [];
          page.on('console', (m) => {
            // Les échecs de chargement sont traités via 'requestfailed' (qui donne l'URL).
            if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(`console: ${m.text()}`);
          });
          page.on('requestfailed', (r) => {
            const u = new URL(r.url());
            const msg = `${r.failure()?.errorText || 'échec'} : ${r.url()}`;
            // Ressource externe (polices, CDN KaTeX…) : avertissement seulement (réseau du poste).
            if (u.hostname === '127.0.0.1' || u.hostname === 'localhost') errors.push(`ressource locale : ${msg}`);
            else warnings.push(`ressource externe : ${msg}`);
          });
          const resp = await page.goto(url, { waitUntil: 'networkidle' });
          await page.waitForTimeout(400);
          // En émulation mobile, le viewport de mise en page s'élargit si le contenu déborde :
          // on compare donc à la largeur demandée, pas à window.innerWidth.
          const vw = page.viewportSize().width;
          const info = await page.evaluate((w) => ({
            theme: document.documentElement.getAttribute('data-theme'),
            overflow: Math.max(document.documentElement.scrollWidth, window.innerWidth) - w,
            culprits: [...document.querySelectorAll('.markdown > *, .markdown table, .markdown pre, .markdown img')]
              .filter((el) => el.getBoundingClientRect().right > w + 1)
              .slice(0, 5)
              .map((el) => `<${el.tagName.toLowerCase()}> « ${(el.textContent || el.getAttribute('src') || '').trim().slice(0, 40)} » (${Math.round(el.getBoundingClientRect().right)}px)`),
            brokenImgs: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.getAttribute('src')),
          }), vw);
          const file = path.join(outDir, `${slug}.${v.name}.${theme}.png`);
          await page.screenshot({ path: file, fullPage: true });
          const issues = [];
          if (!resp || resp.status() >= 400) issues.push(`HTTP ${resp ? resp.status() : '—'}`);
          if (info.theme !== theme) issues.push(`thème appliqué = ${info.theme}`);
          if (info.overflow > 1) issues.push(`débordement horizontal ${info.overflow}px${info.culprits.length ? ' — ' + info.culprits.join(' ; ') : ''}`);
          if (info.brokenImgs.length) issues.push(`images cassées : ${info.brokenImgs.join(', ')}`);
          issues.push(...errors);
          problems += issues.length;
          console.log(`${issues.length ? '✗' : '✓'} ${route} [${v.name}/${theme}] → ${path.relative(repo, file)}`);
          for (const i of issues) console.log(`    - ${i}`);
          for (const w of [...new Set(warnings)]) console.log(`    · (avertissement) ${w}`);
          await ctx.close();
        }
      }
    }
    await browser.close();
  } finally {
    stop();
  }
  console.log(`\n${routes.length} route(s) × 4 captures dans ${path.relative(repo, outDir)}/ — problèmes : ${problems}`);
  process.exit(problems ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
