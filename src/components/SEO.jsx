import { Helmet } from 'react-helmet-async'

export default function SEO({
    title = 'IMG Tool - Free Online Image & PDF Tools',
    description = 'Convert, resize, compress, and edit images online for free. No upload needed — 100% client-side processing.',
    canonical,
    ogImage = 'https://imgtool.in/image/og-home.webp',
    noIndex = false,
}) {
    const fullTitle = title.includes('IMG Tool') ? title : `${title} - IMG Tool`
    const url = canonical ? `https://imgtool.in${canonical}` : 'https://imgtool.in/'

    return (
        <Helmet>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {noIndex && <meta name="robots" content="noindex,nofollow" />}
            <link rel="canonical" href={url} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={ogImage} />
        </Helmet>
    )
}
