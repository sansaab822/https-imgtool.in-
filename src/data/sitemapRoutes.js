/**
 * sitemapRoutes.js
 * ─────────────────────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH for all sitemap URLs.
 *
 * When you add a new tool / page:
 *   1. Add a route here.
 *   2. Run `npm run generate:sitemap`  (or just `npm run build`).
 *   3. Commit the updated public/sitemap.xml.
 *
 * Fields:
 *   loc          – path relative to https://imgtool.in  (starts with /)
 *   lastmod      – ISO date string OR omit to auto-use today's date
 *   changefreq   – always | daily | weekly | monthly
 *   priority     – 0.0 – 1.0
 *   image        – optional { loc: full URL, title: string }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { blogPosts } from './blogData.js';

const BASE_URL = 'https://imgtool.in';
const TODAY = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

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
    // PREMIUM / VIRAL TOOLS  (high priority)
    // ──────────────────────────────────────────────────────────────────
    {
        loc: '/3d-text-to-stl-generator',
        lastmod: '2025-11-30',
        changefreq: 'daily',
        priority: 0.9,
        image: {
            loc: `${BASE_URL}/image/og-3d-text.jpg`,
            title: '3D Text to STL Generator for 3D Printing',
        },
    },
    {
        loc: '/svg-to-stl',
        lastmod: '2025-12-24',
        changefreq: 'daily',
        priority: 0.9,
        image: {
            loc: `${BASE_URL}/image/og-3d-text.jpg`,
            title: 'Turn vectors into high-fidelity 3D models. Best for logos, text, and intricate designs.',
        },
    },
    {
        loc: '/aadhaar-card-print-setting-a4',
        lastmod: '2025-11-30',
        changefreq: 'daily',
        priority: 0.9,
        image: {
            loc: `${BASE_URL}/image/og-id-print-pro.webp`,
            title: 'Aadhaar Card Print Setting A4 Online',
        },
    },
    {
        loc: '/ssc-photo-date-adder',
        lastmod: '2025-11-30',
        changefreq: 'daily',
        priority: 0.9,
        image: {
            loc: `${BASE_URL}/image/og-ssc-tool.webp`,
            title: 'SSC Photo Date Adder and Resizer',
        },
    },
    {
        loc: '/pan-card-photo',
        lastmod: '2026-03-03',
        changefreq: 'weekly',
        priority: 0.9,
        image: {
            loc: `${BASE_URL}/images/tools/pan-card-photo-tool.png`,
            title: 'PAN Card Photo Resizer — Resize to 25×35mm NSDL/UTI Size Online',
        },
    },
    {
        loc: '/passport-size-photo',
        lastmod: '2025-11-30',
        changefreq: 'weekly',
        priority: 0.9,
        image: {
            loc: `${BASE_URL}/image/og-passport-photo.webp`,
            title: 'Passport Size Photo Maker — Make 2x2 inch photo online',
        },
    },

    // ──────────────────────────────────────────────────────────────────
    // IMAGE EDITORS
    // ──────────────────────────────────────────────────────────────────
    {
        loc: '/image-to-art',
        lastmod: '2025-11-30',
        changefreq: 'weekly',
        priority: 0.8,
    },
    {
        loc: '/image-compressor',
        lastmod: '2025-11-30',
        changefreq: 'weekly',
        priority: 0.8,
    },
    {
        loc: '/image-resizer',
        lastmod: '2025-11-30',
        changefreq: 'weekly',
        priority: 0.8,
    },
    {
        loc: '/crop-image',
        lastmod: '2025-11-30',
        changefreq: 'weekly',
        priority: 0.8,
    },
    {
        loc: '/image-enhancer',
        lastmod: '2025-11-30',
        changefreq: 'weekly',
        priority: 0.8,
    },
    {
        loc: '/bg-remover',
        lastmod: '2025-11-30',
        changefreq: 'weekly',
        priority: 0.8,
    },

    // ──────────────────────────────────────────────────────────────────
    // PDF TOOLS
    // ──────────────────────────────────────────────────────────────────
    { loc: '/pdf-to-jpg', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.8 },
    { loc: '/pdf-to-png', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.8 },
    { loc: '/pdf-to-gif', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/jpg-to-pdf', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/png-to-pdf', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/webp-to-pdf', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/heic-to-pdf', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/gif-to-pdf', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/svg-to-pdf', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/pdf-crop', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/merge-pdf', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },

    // ──────────────────────────────────────────────────────────────────
    // CONVERTERS — JPG
    // ──────────────────────────────────────────────────────────────────
    { loc: '/jpg-to-png', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/jpg-to-gif', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/jpg-to-webp', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/jpg-to-tiff', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/jpg-to-ico', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/jpg-to-svg', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/jpg-to-bmp', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/jpg-to-avif', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },

    // ──────────────────────────────────────────────────────────────────
    // CONVERTERS — PNG
    // ──────────────────────────────────────────────────────────────────
    { loc: '/png-to-jpg', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/png-to-gif', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/png-to-webp', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/png-to-avif', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/png-to-bmp', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/png-to-tiff', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/png-to-ico', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/png-to-svg', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },

    // ──────────────────────────────────────────────────────────────────
    // CONVERTERS — WebP
    // ──────────────────────────────────────────────────────────────────
    { loc: '/webp-to-jpg', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/webp-to-png', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/webp-to-gif', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/webp-to-bmp', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/webp-to-tiff', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/webp-to-ico', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },

    // ──────────────────────────────────────────────────────────────────
    // CONVERTERS — HEIC
    // ──────────────────────────────────────────────────────────────────
    { loc: '/heic-to-jpg', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/heic-to-png', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/heic-to-webp', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/heic-to-gif', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },

    // ──────────────────────────────────────────────────────────────────
    // CONVERTERS — GIF
    // ──────────────────────────────────────────────────────────────────
    { loc: '/gif-to-jpg', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/gif-to-png', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/gif-to-webp', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/gif-to-bmp', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/gif-to-ico', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },

    // ──────────────────────────────────────────────────────────────────
    // CONVERTERS — BMP
    // ──────────────────────────────────────────────────────────────────
    { loc: '/bmp-to-jpg', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/bmp-to-png', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/bmp-to-gif', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/bmp-to-webp', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },

    // ──────────────────────────────────────────────────────────────────
    // CONVERTERS — TIFF
    // ──────────────────────────────────────────────────────────────────
    { loc: '/tiff-to-jpg', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/tiff-to-png', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/tiff-to-webp', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },

    // ──────────────────────────────────────────────────────────────────
    // CONVERTERS — ICO
    // ──────────────────────────────────────────────────────────────────
    { loc: '/ico-to-jpg', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/ico-to-png', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },
    { loc: '/ico-to-gif', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },

    // ──────────────────────────────────────────────────────────────────
    // CONVERTERS — SVG
    // ──────────────────────────────────────────────────────────────────
    { loc: '/svg-to-png', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/svg-to-jpg', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },

    // ──────────────────────────────────────────────────────────────────
    // CONVERTERS — AVIF
    // ──────────────────────────────────────────────────────────────────
    { loc: '/avif-to-jpg', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/avif-to-png', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/avif-to-webp', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },

    // ──────────────────────────────────────────────────────────────────
    // CONVERTERS — RAW / CR2
    // ──────────────────────────────────────────────────────────────────
    { loc: '/raw-to-jpg', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.7 },
    { loc: '/cr2-to-jpg', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.6 },

    // ──────────────────────────────────────────────────────────────────
    // BLOG POSTS
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

    // ──────────────────────────────────────────────────────────────────
    // LEGAL / STATIC PAGES
    // ──────────────────────────────────────────────────────────────────
    { loc: '/about-us', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.5 },
    { loc: '/contact-us', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.5 },
    { loc: '/privacy-policy', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.5 },
    { loc: '/terms-of-service', lastmod: '2025-11-30', changefreq: 'monthly', priority: 0.5 },

    // ──────────────────────────────────────────────────────────────────
    // VIDEO TOOLS (new category)
    // ──────────────────────────────────────────────────────────────────
    { loc: '/video-compressor', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },
    { loc: '/video-converter', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },
    { loc: '/video-to-audio', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },
    { loc: '/video-trimmer', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },
    { loc: '/video-merger', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },

    // ──────────────────────────────────────────────────────────────────
    // NEW PDF TOOLS
    // ──────────────────────────────────────────────────────────────────
    { loc: '/pdf-to-excel', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: '/html-to-pdf', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: '/remove-pdf-watermark', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: '/pdf-password-remover', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },

    // ──────────────────────────────────────────────────────────────────
    // UTILITY TOOLS (new category)
    // ──────────────────────────────────────────────────────────────────
    { loc: '/collage-maker', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },
    { loc: '/favicon-generator', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: '/image-metadata-viewer', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: '/color-palette-generator', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: '/worksheet-converter', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: '/text-to-handwriting', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },
    { loc: '/html-table-generator', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },

    // ──────────────────────────────────────────────────────────────────
    // IMAGE EDITING TOOLS
    // ──────────────────────────────────────────────────────────────────
    { loc: '/combine-images-side-by-side', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },
    { loc: '/add-watermark-to-image', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },
    { loc: '/merge-images-vertically', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },
    { loc: '/blend-two-photos', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: '/rotate-image-custom-angle', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },
    { loc: '/flip-image-horizontally', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },
    { loc: '/polaroid-photo-effect', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: '/add-drop-shadow', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: '/wet-floor-reflection', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: '/zoomed-inset-image', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: '/instagram-safe-zones', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },

    // ──────────────────────────────────────────────────────────────────
    // FUN EFFECTS TOOLS
    // ──────────────────────────────────────────────────────────────────
    { loc: '/meme-generator', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },
    { loc: '/gif-maker', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },
    { loc: '/lego-art-generator', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: '/warhol-poster-effect', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: '/emoji-mosaic', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: '/jigsaw-puzzle-maker', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: '/face-morph', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },
    { loc: '/sticker-add-virtual', lastmod: TODAY, changefreq: 'weekly', priority: 0.8 },

    // ──────────────────────────────────────────────────────────────────
    // AI TOOLS
    // ──────────────────────────────────────────────────────────────────
    { loc: '/ai-denoiser', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },
    { loc: '/ai-colorizer', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },

    // ──────────────────────────────────────────────────────────────────
    // UTILITY - QR CODE
    // ──────────────────────────────────────────────────────────────────
    { loc: '/qr-code-generator', lastmod: TODAY, changefreq: 'weekly', priority: 0.9 },

    // ──────────────────────────────────────────────────────────────────
    // DYNAMIC BLOG POSTS
    // ──────────────────────────────────────────────────────────────────
    ...blogPosts.map(post => ({
        loc: `/blog/${post.slug}`,
        lastmod: TODAY, // In a real DB this would be post.lastmod
        changefreq: 'monthly',
        priority: 0.8,
        image: {
            loc: `${BASE_URL}${post.coverImage}`,
            title: post.title
        }
    }))
];

// ─── Exports ──────────────────────────────────────────────────────────────────
// ESM named exports — used by the generator script and any future React utils.
export { routes, BASE_URL };

