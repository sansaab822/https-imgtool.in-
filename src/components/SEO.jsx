import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://imgtool.in'

// ── Global structured data (injected once on every page) ─────────────────────
const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'IMG Tool',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description: 'Free online image & PDF tools. Convert, resize, compress, crop and edit images in your browser. 100% private — no upload to servers.',
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: `${SITE_URL}/contact-us`,
    },
    sameAs: [],
}

const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'IMG Tool',
    url: SITE_URL,
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
    },
}

// ─────────────────────────────────────────────────────────────────────────────

export default function SEO({
    title = 'IMG Tool - Free Online Image & PDF Tools',
    description = 'Convert, resize, compress, and edit images online for free. No upload needed — 100% client-side processing.',
    canonical,
    ogImage = `${SITE_URL}/og-home.png`,
    noIndex = false,
    schema = null, // optional per-page schema (WebApplication, HowTo, etc.)
}) {
    const fullTitle = title.includes('IMG Tool') ? title : `${title} | IMG Tool`
    const url = canonical ? `${SITE_URL}${canonical}` : `${SITE_URL}/`

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {noIndex && <meta name="robots" content="noindex,nofollow" />}
            {!noIndex && <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />}
            <link rel="canonical" href={url} />

            {/* Open Graph */}
            <meta property="og:site_name" content="IMG Tool" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:type" content="website" />
            <meta property="og:locale" content="en_US" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@imgtool_in" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />

            {/* Structured Data — Organization (every page) */}
            <script type="application/ld+json">
                {JSON.stringify(orgSchema)}
            </script>

            {/* Structured Data — WebSite + Sitelinks Searchbox (every page) */}
            <script type="application/ld+json">
                {JSON.stringify(webSiteSchema)}
            </script>

            {/* Structured Data — page-specific (optional) */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    )
}
