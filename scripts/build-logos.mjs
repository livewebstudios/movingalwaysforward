// Rasterizes the three logo SVG copies (full, white, mark) into retina PNGs so pages
// do not ship the 150KB vector twice. Run once: node scripts/build-logos.mjs
import sharp from 'sharp';
const dir = new URL('../src/assets/brand/', import.meta.url).pathname;
await sharp(dir + 'logo-full.svg').resize(360).png().toFile(dir + 'logo-full-2x.png');
await sharp(dir + 'logo-white.svg').resize(400).png().toFile(dir + 'logo-white-2x.png');
await sharp(dir + 'logo-mark.svg').resize(192).png().toFile(dir + 'logo-mark-2x.png');
console.log('logo rasters written');
