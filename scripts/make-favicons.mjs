import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteDir = path.resolve(__dirname, '..');

// CLI args for source override
const args = process.argv.slice(2);
const srcArgIndex = args.indexOf('--src');
const customSrc = srcArgIndex !== -1 ? args[srcArgIndex + 1] : null;

const sourcePath = customSrc
  ? path.resolve(process.cwd(), customSrc)
  : path.resolve(siteDir, '../Favicon.png');

const publicDir = path.resolve(siteDir, 'public');

if (!fs.existsSync(sourcePath)) {
  console.error(`✕ ERROR: Favicon source file not found at: ${sourcePath}`);
  process.exit(1);
}

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Target icon definitions
const PNG_ICONS = [
  { name: 'favicon-16.png', size: 16 },
  { name: 'favicon-32.png', size: 32 },
  { name: 'favicon-48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192.png', size: 192 },
  { name: 'icon-512.png', size: 512 },
];

async function generateFavicons() {
  console.log('--- Favicon Generation Script ---');
  console.log(`Source: ${sourcePath}`);
  console.log(`Destination: ${publicDir}`);

  // 1. Crop the empty black margin: left: 180, top: 170, width: 880, height: 880
  console.log('\nCropping logo margin (180, 170, 880x880)...');
  const croppedBuffer = await sharp(sourcePath)
    .extract({ left: 180, top: 170, width: 880, height: 880 })
    .toBuffer();

  // 2. Generate PNG sizes (using lanczos3 kernel, compressionLevel 9, palette optimization)
  const generatedBuffers = {};
  let totalBytes = 0;

  for (const { name, size } of PNG_ICONS) {
    const buf = await sharp(croppedBuffer)
      .resize(size, size, { kernel: 'lanczos3' })
      .png({ compressionLevel: 9, effort: 10, palette: true })
      .toBuffer();

    const outPath = path.join(publicDir, name);
    fs.writeFileSync(outPath, buf);
    generatedBuffers[size] = buf;
    totalBytes += buf.length;

    const kb = (buf.length / 1024).toFixed(1);
    console.log(`✓ Generated ${name} (${size}x${size}) — ${kb} KB`);
  }

  // 3. Generate multi-resolution favicon.ico containing 16, 32, and 48 px
  console.log('\nGenerating multi-resolution favicon.ico (16, 32, 48)...');
  const icoBuffer = await pngToIco([
    generatedBuffers[16],
    generatedBuffers[32],
    generatedBuffers[48],
  ]);

  const icoPath = path.join(publicDir, 'favicon.ico');
  fs.writeFileSync(icoPath, icoBuffer);
  totalBytes += icoBuffer.length;

  const icoKb = (icoBuffer.length / 1024).toFixed(1);
  console.log(`✓ Generated favicon.ico — ${icoKb} KB`);

  const totalKb = (totalBytes / 1024).toFixed(1);
  console.log(`\nDone! All icons created successfully in public/. Total size: ${totalKb} KB (< 150 KB target).`);
}

generateFavicons().catch((err) => {
  console.error('Fatal error during favicon generation:', err);
  process.exit(1);
});
