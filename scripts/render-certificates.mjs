import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as mupdf from 'mupdf';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteDir = path.resolve(__dirname, '..');

// CLI args for source override
const args = process.argv.slice(2);
const srcArgIndex = args.indexOf('--src');
const customSrc = srcArgIndex !== -1 ? args[srcArgIndex + 1] : null;

const certsInputDir = customSrc
  ? path.resolve(process.cwd(), customSrc)
  : path.resolve(siteDir, '../Certificates');

const fallbackInputDir = path.resolve(siteDir, 'public/certificates');
const outputDir = path.resolve(siteDir, 'src/assets/certs');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read certificate list from single shared JSON source of truth
const certsPath = path.resolve(siteDir, 'src/data/certificates.json');
const CERTIFICATE_LIST = JSON.parse(fs.readFileSync(certsPath, 'utf8'));

function findSourceFile(item) {
  if (item.srcName) {
    const primaryPath = path.join(certsInputDir, item.srcName);
    if (fs.existsSync(primaryPath)) return primaryPath;
  }

  const slugPath = path.join(certsInputDir, `${item.preview}.pdf`);
  if (fs.existsSync(slugPath)) return slugPath;

  const fallbackPath = path.join(fallbackInputDir, `${item.preview}.pdf`);
  if (fs.existsSync(fallbackPath)) return fallbackPath;

  return null;
}

async function renderCertificates() {
  console.log('--- Rendering Certificate Previews ---');
  console.log(`Source dir: ${certsInputDir}`);
  console.log(`Output dir: ${outputDir}`);

  let successCount = 0;
  const errors = [];

  for (const item of CERTIFICATE_LIST) {
    const srcPath = findSourceFile(item);
    if (!srcPath) {
      const err = `Missing PDF for "${item.preview}" (expected "${item.srcName || item.preview + '.pdf'}")`;
      console.error(`✕ ERROR: ${err}`);
      errors.push(err);
      continue;
    }

    let doc = null;
    let page = null;
    let pixmap = null;

    try {
      const pdfBytes = fs.readFileSync(srcPath);
      doc = mupdf.Document.openDocument(pdfBytes, 'application/pdf');
      page = doc.loadPage(0);
      const bounds = page.getBounds();
      const pageWidth = bounds[2] - bounds[0];

      // Target 1400 px wide
      const targetWidth = 1400;
      const scale = targetWidth / pageWidth;
      pixmap = page.toPixmap(
        mupdf.Matrix.scale(scale, scale),
        mupdf.ColorSpace.DeviceRGB,
        false
      );
      const pngBuffer = Buffer.from(pixmap.asPNG());

      const meta = await sharp(pngBuffer).metadata();
      const width = meta.width || targetWidth;
      const height = meta.height || 1000;

      // Diagonal -30° tiled watermark every ~240 px (dual layer: dark 0.11 + light offset 0.10) + bottom footer strip
      const watermarkSvg = Buffer.from(`
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="wm" width="650" height="240" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
              <text x="30" y="70" font-family="'Barlow Condensed', Arial, sans-serif" font-weight="bold" font-size="26" fill="#000000" fill-opacity="0.11" letter-spacing="1.5">DINESH KARTHICK D · PORTFOLIO PREVIEW · NOT FOR REUSE</text>
              <text x="31" y="71" font-family="'Barlow Condensed', Arial, sans-serif" font-weight="bold" font-size="26" fill="#ffffff" fill-opacity="0.10" letter-spacing="1.5">DINESH KARTHICK D · PORTFOLIO PREVIEW · NOT FOR REUSE</text>
              <text x="350" y="190" font-family="'Barlow Condensed', Arial, sans-serif" font-weight="bold" font-size="26" fill="#000000" fill-opacity="0.11" letter-spacing="1.5">DINESH KARTHICK D · PORTFOLIO PREVIEW · NOT FOR REUSE</text>
              <text x="351" y="191" font-family="'Barlow Condensed', Arial, sans-serif" font-weight="bold" font-size="26" fill="#ffffff" fill-opacity="0.10" letter-spacing="1.5">DINESH KARTHICK D · PORTFOLIO PREVIEW · NOT FOR REUSE</text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wm)" />
          <rect x="0" y="${height - 30}" width="${width}" height="30" fill="#07060a" fill-opacity="0.94" />
          <text x="${width / 2}" y="${height - 10}" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="#b9b4ab" text-anchor="middle" letter-spacing="1">Preview only — verify the original at the issuer</text>
        </svg>
      `);

      const outPath = path.join(outputDir, `${item.preview}.webp`);
      const finalWebp = await sharp(pngBuffer)
        .composite([{ input: watermarkSvg }])
        .webp({ quality: 72 })
        .toBuffer();

      fs.writeFileSync(outPath, finalWebp);
      const kb = Math.round(finalWebp.length / 1024);
      console.log(`✓ Rendered ${item.preview}.webp (${kb} KB)`);
      successCount++;
    } catch (e) {
      console.error(`✕ Failed to render ${item.preview}:`, e);
      errors.push(`${item.preview}: ${e.message}`);
    } finally {
      // Clean up mupdf objects to prevent memory leaks
      try {
        if (pixmap && typeof pixmap.destroy === 'function') pixmap.destroy();
        if (page && typeof page.destroy === 'function') page.destroy();
        if (doc && typeof doc.destroy === 'function') doc.destroy();
      } catch {
        // ignore
      }
    }
  }

  console.log(`\nDone: ${successCount}/${CERTIFICATE_LIST.length} certificates rendered successfully.`);
  if (errors.length > 0) {
    console.error(`Encountered ${errors.length} errors:`, errors);
    process.exit(1);
  }
}

renderCertificates().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
