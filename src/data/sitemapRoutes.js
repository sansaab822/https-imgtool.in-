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
    'ssc-cgl-photo-resizer', 'ssc-chsl-photo-signature-resizer', 'ssc-gd-photo-resizer',
    'ssc-mts-photo-resizer', 'ssc-signature-resizer', 'ibps-po-photo-resizer',
    'ibps-clerk-photo-signature-resizer', 'ibps-rrb-photo-resizer',
    'sbi-po-photo-resizer', 'sbi-clerk-photo-resizer', 'upsc-photo-resizer',
    'neet-photo-resizer', 'jee-main-photo-resizer', 'rrb-ntpc-photo-resizer',
    'up-police-photo-resizer', 'bihar-police-photo-resizer',
    'rajasthan-police-photo-resizer', 'mp-police-photo-resizer',
    'ctet-photo-resizer', 'gate-photo-resizer', 'post-office-gds-photo-resizer',
    'army-agniveer-photo-resizer', 'navy-agniveer-photo-resizer',
    'mpsc-photo-resizer', 'wbcs-photo-resizer',
    'compress-image-to-30kb', 'compress-image-to-40kb', 'compress-image-to-60kb',
    'compress-image-to-70kb', 'compress-image-to-80kb', 'compress-image-to-120kb',
    'compress-image-to-150kb', 'compress-image-20kb-30kb', 'compress-image-under-100kb',
    'whatsapp-dp-resize', 'whatsapp-status-photo-resize', 'instagram-profile-photo-resize',
    'instagram-post-resize', 'instagram-reels-thumbnail-resize',
    'facebook-profile-photo-resize', 'facebook-cover-photo-resize',
    'linkedin-profile-photo-resize', 'linkedin-banner-resize',
    'twitter-profile-photo-resize', 'youtube-channel-art-resize',
    'aadhaar-photo-resizer', 'voter-id-photo-resizer', 'driving-licence-photo-resizer',
    'visa-photo-resizer', 'resume-photo-resizer', 'thumb-impression-resizer',
    'handwritten-declaration-resizer', 'signature-resize-140x60',
    'passport-size-photo', 'pan-card-photo', 'ssc-photo-date-adder',
    'aadhaar-card-print-setting-a4', 'image-compressor', 'image-resizer',
    '3d-text-to-stl-generator', 'svg-to-stl', 'qr-code-generator',
    'collage-maker', 'text-to-handwriting', 'meme-generator', 'gif-maker',
    'combine-images-side-by-side', 'add-watermark-to-image',
    'merge-images-vertically', 'rotate-image-custom-angle',
    'flip-image-horizontally', 'instagram-safe-zones',
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
    {
        loc: '/all-image-converters',
        lastmod: TODAY,
        changefreq: 'weekly',
        priority: 0.8,
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
    {
        loc: '/blog/resize-photo-signature-govt-exam',
        lastmod: '2025-12-28',
        changefreq: 'monthly',
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
    { loc: '/about-us', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.5 },
    { loc: '/contact-us', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.5 },
    { loc: '/privacy-policy', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.5 },
    { loc: '/terms-of-service', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.5 },
]

// ─── Exports ──────────────────────────────────────────────────────────────────
export { routes, BASE_URL };
