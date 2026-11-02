import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteDir = path.resolve(__dirname, '..');

const cursorDir = path.resolve(siteDir, 'public/cursor');

const arrowSvg = path.join(cursorDir, 'arrow.svg');
const hoverSvg = path.join(cursorDir, 'arrow-hover.svg');

if (!fs.existsSync(arrowSvg) || !fs.existsSync(hoverSvg)) {
  throw new Error('SVG cursor files not found in public/cursor/');
}

async function run() {
  console.log('--- Generating Cursor PNG Fallbacks from SVG ---');

  // Rasterise arrow.svg
  const arrow32 = await sharp(arrowSvg, { density: 72 })
    .resize(32, 32)
    .png({ compressionLevel: 9 })
    .toBuffer();

  const arrow64 = await sharp(arrowSvg, { density: 144 })
    .resize(64, 64)
    .png({ compressionLevel: 9 })
    .toBuffer();

  // Rasterise arrow-hover.svg
  const hover32 = await sharp(hoverSvg, { density: 72 })
    .resize(32, 32)
    .png({ compressionLevel: 9 })
    .toBuffer();

  const hover64 = await sharp(hoverSvg, { density: 144 })
    .resize(64, 64)
    .png({ compressionLevel: 9 })
    .toBuffer();

  fs.writeFileSync(path.join(cursorDir, 'arrow-32.png'), arrow32);
  fs.writeFileSync(path.join(cursorDir, 'arrow-64.png'), arrow64);
  fs.writeFileSync(path.join(cursorDir, 'arrow-hover-32.png'), hover32);
  fs.writeFileSync(path.join(cursorDir, 'arrow-hover-64.png'), hover64);

  console.log('\n--- Generated Cursor PNG Files ---');
  console.log('arrow-32.png:       ', (arrow32.length / 1024).toFixed(2), 'KB');
  console.log('arrow-64.png:       ', (arrow64.length / 1024).toFixed(2), 'KB');
  console.log('arrow-hover-32.png: ', (hover32.length / 1024).toFixed(2), 'KB');
  console.log('arrow-hover-64.png: ', (hover64.length / 1024).toFixed(2), 'KB');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
