import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const siteDir = path.resolve(__dirname, '..');

const routesPath = path.resolve(siteDir, 'src/data/routes.ts');
const sitePath = path.resolve(siteDir, 'src/data/site.ts');
const outputPath = path.resolve(siteDir, 'public/sitemap.xml');

async function generateSitemap() {
  console.log('--- Generating sitemap.xml ---');

  let siteUrl = 'https://dineshkarthickdurgadas.in';
  if (fs.existsSync(sitePath)) {
    const siteContent = fs.readFileSync(sitePath, 'utf8');
    const match = siteContent.match(/SITE_URL\s*=\s*['"]([^'"]+)['"]/);
    if (match) {
      siteUrl = match[1].replace(/\/+$/, '');
    }
  }

  const routesContent = fs.readFileSync(routesPath, 'utf8');
  // Match path: '/...'
  const matches = [...routesContent.matchAll(/path:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);

  // Expected canonical list of paths
  const desiredOrder = [
    '/',
    '/about',
    '/skills',
    '/projects',
    '/experience',
    '/achievements',
    '/academy',
    '/contact',
  ];

  const uniquePaths = Array.from(new Set(matches.filter((p) => desiredOrder.includes(p))));

  // Sort by desiredOrder
  uniquePaths.sort((a, b) => desiredOrder.indexOf(a) - desiredOrder.indexOf(b));

  const today = new Date().toISOString().split('T')[0];

  const xmlEntries = uniquePaths.map((p) => {
    const loc = p === '/' ? `${siteUrl}/` : `${siteUrl}${p}`;
    const priority = p === '/' ? '1.0' : p === '/projects' || p === '/skills' ? '0.9' : '0.8';
    const changefreq = p === '/' ? 'weekly' : 'monthly';

    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  });

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlEntries.join('\n')}
</urlset>
`;

  fs.writeFileSync(outputPath, xmlContent, 'utf8');
  console.log(`Generated ${outputPath} with ${uniquePaths.length} URLs.`);
}

generateSitemap().catch((err) => {
  console.error(err);
  process.exit(1);
});
