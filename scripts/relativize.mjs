// LWS path rule: every internal asset and link in dist/ must be relative.
// Astro emits root-relative URLs for bundled assets (/_astro/...), so after `astro build`
// this rewrites href, src, srcset, imagesrcset, poster, data-src and CSS url() values
// that start with a single "/" into paths relative to each file. Absolute https URLs
// (canonical, og:*, JSON-LD) are left alone on purpose. 404.html keeps root paths
// resolved through its <base href="/">, so it is rewritten relative to the root.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative, dirname, sep } from 'node:path';

const DIST = 'dist';
const files = [];
const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) {
      walk(p);
    } else if (/\.(html|css)$/.test(f)) files.push(p);
  }
};
walk(DIST);

const relFrom = (fromDir, target) => {
  const [path, rest = ''] = target.split(/(?=[?#])/);
  let r = relative(fromDir, join(DIST, path)).split(sep).join('/');
  if (path.endsWith('/')) r = r ? `${r}/` : './';
  if (!r) r = './';
  return r + rest;
};

let changed = 0;
let count = 0;
for (const file of files) {
  const isRootBase = file === join(DIST, '404.html');
  const fromDir = isRootBase ? DIST : dirname(file);
  const fix = (url) => {
    if (!url.startsWith('/') || url.startsWith('//')) return url;
    count++;
    return relFrom(fromDir, url);
  };
  let s = readFileSync(file, 'utf8');
  const before = s;
  if (file.endsWith('.html')) {
    s = s.replace(/\b(href|src|poster|data-src|action)=("|')(\/(?!\/)[^"']*)\2/g, (_m, a, q, u) => `${a}=${q}${fix(u)}${q}`);
    s = s.replace(/\b(srcset|imagesrcset)=("|')([^"']*)\2/g, (_m, a, q, list) =>
      `${a}=${q}${list.split(',').map((part) => part.trim().replace(/^(\S+)/, (u) => fix(u))).join(', ')}${q}`);
    // <base href="/"> in 404.html must stay as is
    s = s.replace(/<base href="\.\/"\s*\/?>/, '<base href="/">');
  }
  s = s.replace(/url\((["']?)(\/(?!\/)[^)"']+)\1\)/g, (_m, q, u) => `url(${q}${fix(u)}${q})`);
  if (s !== before) {
    writeFileSync(file, s);
    changed++;
  }
}

// Verify: nothing root-relative left in attributes.
const leftovers = [];
for (const file of files) {
  const s = readFileSync(file, 'utf8').replace('<base href="/">', '');
  const m = s.match(/\b(?:href|src|poster|data-src|srcset|imagesrcset)=["']\/(?!\/)[^"']*/g);
  if (m) leftovers.push(`${file}: ${m.slice(0, 3).join(' | ')}`);
}
console.log(`relativize: ${count} URL(s) rewritten in ${changed}/${files.length} files`);
if (leftovers.length) {
  console.log('root-relative leftovers:\n' + leftovers.join('\n'));
  process.exit(1);
}
