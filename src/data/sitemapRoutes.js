/**
 * sitemapRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * AUTOMATIC sitemap — tools are pulled directly from toolsData.js.
 *
 * When you add a new tool:
 *   1. Add it to src/data/toolsData.js  ← ONLY thing you need to do
 *   2. Run `npm run generate:sitemap` (or `npm run build`)
 *   3. Commit the updated public/sitemap.xml
 *
 * Static pages (homepage, blog, legal) are still listed manually below.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { tools } from './toolsData.js';
import { blogPosts } from './blogData.js';

const BASE_URL = 'https://imgtool.in';
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

// ── Priority map: give specific slugs a higher priority ───────────────────────
const HIGH_PRIORITY_SLUGS = new Set([
    'batch-watermark-images',
    'image-resizer',
    'image-compressor',
    'crop-image',
    'bg-remover',
    'passport-size-photo',
    'pan-card-photo',
    'aadhaar-card-print-setting-a4',
    'signature-to-transparent-png',
    'government-photo-resizer',
    'ssc-photo-date-adder',
    'pdf-crop',
    'merge-pdf',
    'split-pdf',
    'image-dpi-converter',
    'image-metadata-viewer',
    'heic-to-jpg',
    'webp-to-jpg',
    'favicon-generator',
    'qr-code-generator',
    '3d-text-to-stl-generator',
    'svg-to-stl',
])

// Auto-generate tool entries from toolsData ───────────────────────────────────
const toolRoutes = tools.map(tool => ({
    loc: `/${tool.slug}`,
    lastmod: TODAY,
    changefreq: 'weekly',
    priority: HIGH_PRIORITY_SLUGS.has(tool.slug) ? 0.9 : 0.8,
}))

const routes = [

    // ──────────────────────────────────────────────────────────────────
    // CORE PAGES
    // ──────────────────────────────────────────────────────────────────
    {
        loc: '/',
        lastmod: TODAY,
        changefreq: 'daily',
        priority: 1.0,
    },
    // ──────────────────────────────────────────────────────────────────
    // ALL TOOLS — auto-generated from toolsData.js
    // ──────────────────────────────────────────────────────────────────
    ...toolRoutes,

    // ──────────────────────────────────────────────────────────────────
    // BLOG
    // ──────────────────────────────────────────────────────────────────
    {
        loc: '/blog',
        lastmod: TODAY,
        changefreq: 'weekly',
        priority: 0.6,
    },
    ...blogPosts.map(post => ({
        loc: `/blog/${post.slug}`,
        lastmod: TODAY,
        changefreq: 'monthly',
        priority: 0.8,
        image: {
            loc: `${BASE_URL}${post.coverImage}`,
            title: post.title
        }
    })),

    // ──────────────────────────────────────────────────────────────────
    // LEGAL / STATIC PAGES
    // ──────────────────────────────────────────────────────────────────
    { loc: '/about-us', lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: '/contact-us', lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: '/privacy-policy', lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: '/terms-of-service', lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
    { loc: '/disclaimer', lastmod: TODAY, changefreq: 'monthly', priority: 0.5 },
]

// ─── Exports ──────────────────────────────────────────────────────────────────
export { routes, BASE_URL };
