import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteDir = path.resolve(__dirname, '..');

const args = process.argv.slice(2);
const srcArgIndex = args.indexOf('--src');
const customSrc = srcArgIndex !== -1 ? args[srcArgIndex + 1] : (args[0] && !args[0].startsWith('-') ? args[0] : null);

let artDir;
if (customSrc) {
  if (path.isAbsolute(customSrc)) {
    artDir = customSrc;
  } else if (fs.existsSync(path.resolve(process.cwd(), customSrc))) {
    artDir = path.resolve(process.cwd(), customSrc);
  } else {
    artDir = path.resolve(siteDir, customSrc);
  }
} else {
  artDir = path.resolve(siteDir, '../art 2');
}

const outputDir = path.resolve(siteDir, 'public/art');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const KEYS = [
  'menu',
  'about',
  'skills',
  'projects',
  'experience',
  'achievements',
  'academy',
  'contact',
  'mission-complete',
];

async function run() {
  console.log('--- Still Artwork Rendering Script ---');
  console.log(`Source dir: ${artDir}`);
  console.log(`Output dir: ${outputDir}`);

  if (!fs.existsSync(artDir)) {
    throw new Error(`Source folder ${artDir} not found.`);
  }

  const results = [];

  for (const key of KEYS) {
    const srcJpg = path.join(artDir, `${key}.jpg`);
    if (!fs.existsSync(srcJpg)) {
      console.warn(`File ${srcJpg} not found, skipping.`);
      continue;
    }

    const out2560 = path.join(outputDir, `${key}.webp`);
    const out1280 = path.join(outputDir, `${key}-1280.webp`);

    console.log(`Rendering [${key}]...`);

    // 2560px wide, quality 78, stripped metadata
    await sharp(srcJpg)
      .resize({ width: 2560, withoutEnlargement: true })
      .webp({ quality: 78 })
      .toFile(out2560);

    // 1280px wide, quality 76, stripped metadata
    await sharp(srcJpg)
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 76 })
      .toFile(out1280);

    const size2560 = fs.statSync(out2560).size;
    const size1280 = fs.statSync(out1280).size;

    results.push({
      key,
      size2560: (size2560 / 1024).toFixed(1) + ' KB',
      size1280: (size1280 / 1024).toFixed(1) + ' KB',
    });
  }

  console.log('\n--- Rendered WebP Stills Report ---');
  console.table(results);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
