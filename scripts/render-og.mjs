import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteDir = path.resolve(__dirname, '..');

const inputPath = path.resolve(siteDir, '../art 2/menu.jpg');
const fallbackPath = path.resolve(siteDir, 'public/art/menu.webp');
const outputPath = path.resolve(siteDir, 'public/og-image.jpg');

async function renderOg() {
  console.log('--- Rendering Link Preview (og-image.jpg) ---');

  const srcPath = fs.existsSync(inputPath) ? inputPath : fallbackPath;
  if (!fs.existsSync(srcPath)) {
    throw new Error(`Source image not found: ${srcPath}`);
  }
  console.log(`Source: ${srcPath}`);

  const TARGET_W = 1200;
  const TARGET_H = 630;

  // 1. Inspect source dimensions
  const meta = await sharp(srcPath).metadata();
  console.log(`Original dimensions: ${meta.width}x${meta.height}`);

  // We want to scale so height is 630
  // In cover crop: scale by max(TARGET_W / meta.width, TARGET_H / meta.height)
  const scale = Math.max(TARGET_W / meta.width, TARGET_H / meta.height);
  const scaledW = Math.round(meta.width * scale);
  const scaledH = Math.round(meta.height * scale);

  // Position crop so face at focusX ≈ 76% stays clearly in frame (e.g. target face around x ≈ 920px)
  const faceX = 0.76 * scaledW;
  let cropLeft = Math.round(faceX - 900);
  cropLeft = Math.max(0, Math.min(cropLeft, scaledW - TARGET_W));

  console.log(`Rescaling to ${scaledW}x${scaledH}, cropLeft = ${cropLeft}`);

  // Base background cropped to 1200x630
  const bgBuffer = await sharp(srcPath)
    .resize(scaledW, scaledH)
    .extract({ left: cropLeft, top: 0, width: TARGET_W, height: TARGET_H })
    .toBuffer();

  // 2. SVG overlay with dark left gradient and typography
  const svgOverlay = Buffer.from(`
    <svg width="${TARGET_W}" height="${TARGET_H}" viewBox="0 0 ${TARGET_W} ${TARGET_H}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Dark gradient for readability on the left -->
        <linearGradient id="darkSide" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#07060a" stop-opacity="0.95" />
          <stop offset="38%" stop-color="#07060a" stop-opacity="0.88" />
          <stop offset="55%" stop-color="#07060a" stop-opacity="0.55" />
          <stop offset="72%" stop-color="#07060a" stop-opacity="0.0" />
        </linearGradient>

        <linearGradient id="pinkOrange" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ff2e88" />
          <stop offset="100%" stop-color="#ff8a3d" />
        </linearGradient>

        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="3" stdDeviation="4" flood-color="#000000" flood-opacity="0.9" />
        </filter>
      </defs>

      <!-- Gradient rect covering left 75% -->
      <rect x="0" y="0" width="${TARGET_W}" height="${TARGET_H}" fill="url(#darkSide)" />

      <!-- Left decorative vice-pink bar -->
      <rect x="70" y="140" width="6" height="310" fill="#ff2e88" rx="3" />

      <!-- Typography Group -->
      <g filter="url(#shadow)">
        <!-- Small top category tag -->
        <text x="96" y="170"
          font-family="'Barlow Condensed', 'Segoe UI', Arial, sans-serif"
          font-weight="700"
          font-size="22"
          fill="#ff2e88"
          letter-spacing="4">
          PORTFOLIO · GAME EDITION
        </text>

        <!-- Main Title: DINESH KARTHICK -->
        <text x="94" y="248"
          font-family="'Anton', Impact, 'Arial Black', sans-serif"
          font-size="82"
          font-weight="900"
          fill="#ffffff"
          letter-spacing="2">
          DINESH KARTHICK
        </text>

        <!-- Script Subtitle: Full-Stack Developer -->
        <text x="98" y="315"
          font-family="'Yellowtail', 'Segoe Script', 'Brush Script MT', cursive, sans-serif"
          font-style="italic"
          font-size="44"
          fill="#ff2e88">
          Full-Stack Developer
        </text>

        <!-- Divider line -->
        <rect x="96" y="342" width="460" height="3" fill="url(#pinkOrange)" rx="1.5" />

        <!-- Stack Badges / Text: React · .NET · Azure -->
        <text x="98" y="388"
          font-family="'Barlow Condensed', 'Segoe UI', Arial, sans-serif"
          font-weight="700"
          font-size="28"
          fill="#b9b4ab"
          letter-spacing="3">
          REACT · .NET · AZURE · CLOUD
        </text>

        <!-- Domain Footer -->
        <text x="98" y="555"
          font-family="'Barlow Condensed', 'Segoe UI', Arial, sans-serif"
          font-weight="700"
          font-size="24"
          fill="#f2efe9"
          letter-spacing="2">
          dineshkarthickdurgadas.in
        </text>
      </g>
    </svg>
  `);

  // 3. Composite and write JPG
  const finalImage = await sharp(bgBuffer)
    .composite([{ input: svgOverlay, top: 0, left: 0 }])
    .jpeg({
      quality: 85,
      progressive: true,
      mozjpeg: true,
    })
    .withMetadata(false) // strip metadata
    .toBuffer();

  fs.writeFileSync(outputPath, finalImage);

  const stats = fs.statSync(outputPath);
  const sizeKb = (stats.size / 1024).toFixed(1);
  console.log(`Wrote ${outputPath} (${sizeKb} KB, ${TARGET_W}x${TARGET_H})`);

  if (stats.size > 300 * 1024) {
    console.warn(`WARNING: og-image.jpg is ${sizeKb} KB, expected < 300 KB`);
  } else {
    console.log(`Size check PASSED: ${sizeKb} KB < 300 KB`);
  }
}

renderOg().catch((err) => {
  console.error(err);
  process.exit(1);
});
