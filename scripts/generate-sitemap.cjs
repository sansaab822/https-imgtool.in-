#!/usr/bin/env node
/**
 * generate-sitemap.cjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Reads src/data/sitemapRoutes.js and writes public/sitemap.xml.
 *
 * Usage:
 *   node scripts/generate-sitemap.cjs
 *
 * This script is automatically run as part of `npm run build`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const fs = require('fs');
const path = require('path');

// Load route data (CommonJS-exported from sitemapRoutes.js)
const { routes, BASE_URL } = require('../src/data/sitemapRoutes.js');

const TODAY = new Date().toISOString().split('T')[0];

function esc(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function buildUrl(entry) {
    const lastmod = entry.lastmod || TODAY;
    const changefreq = entry.changefreq || 'monthly';
    const priority = typeof entry.priority === 'number'
        ? entry.priority.toFixed(1)
        : '0.5';

    let xml = `\n    <url>\n`;
    xml += `        <loc>${esc(BASE_URL + entry.loc)}</loc>\n`;
    xml += `        <lastmod>${esc(lastmod)}</lastmod>\n`;
    xml += `        <changefreq>${esc(changefreq)}</changefreq>\n`;
    xml += `        <priority>${priority}</priority>\n`;

    if (entry.image) {
        xml += `        <image:image>\n`;
        xml += `            <image:loc>${esc(entry.image.loc)}</image:loc>\n`;
        xml += `            <image:title>${esc(entry.image.title)}</image:title>\n`;
        xml += `        </image:image>\n`;
    }

    xml += `    </url>`;
    return xml;
}

function generate() {
    const urlBlocks = routes.map(buildUrl).join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd
        http://www.google.com/schemas/sitemap-image/1.1
        http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd">
${urlBlocks}

</urlset>
`;

    const outPath = path.resolve(__dirname, '../public/sitemap.xml');
    fs.writeFileSync(outPath, xml, 'utf8');

    console.log(`✅  sitemap.xml generated — ${routes.length} URLs → ${outPath}`);
}

generate();
