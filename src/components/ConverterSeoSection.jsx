// Unique SEO content for each image converter slug
const FORMAT_META = {
    jpg: { full: 'JPEG', desc: 'the most widely used lossy photo format on the web', uses: 'photography, websites, social media, and email attachments', pro: 'universal compatibility and small file sizes', con: 'lossy compression that discards some image data', ext: '.jpg or .jpeg' },
    jpeg: { full: 'JPEG', desc: 'the most widely used lossy photo format on the web', uses: 'photography, websites, social media, and email attachments', pro: 'universal compatibility and small file sizes', con: 'lossy compression that discards some image data', ext: '.jpg or .jpeg' },
    png: { full: 'PNG', desc: 'a lossless raster format that supports full transparency', uses: 'logos, UI graphics, screenshots, and web design', pro: 'pixel-perfect lossless quality and transparency support', con: 'larger file size than JPG for photographs', ext: '.png' },
    webp: { full: 'WebP', desc: "Google's modern web format that beats JPG and PNG in size", uses: 'web images, e-commerce product photos, and blog media', pro: '25-35% smaller than equivalent JPG at the same quality', con: 'not fully supported in very old browsers or editors', ext: '.webp' },
    avif: { full: 'AVIF', desc: 'the newest image format based on the AV1 video codec', uses: 'next-gen web delivery, streaming thumbnails, and HDR images', pro: 'up to 50% smaller than JPG with stunning visual quality', con: 'limited support in older software and some operating systems', ext: '.avif' },
    bmp: { full: 'BMP', desc: 'the classic uncompressed Windows bitmap format', uses: 'legacy Windows software, printer drivers, and raw image analysis', pro: 'no compression artifacts and total pixel accuracy', con: 'extremely large file sizes with no built-in compression', ext: '.bmp' },
    gif: { full: 'GIF', desc: 'the iconic format that supports simple animation and 256 colors', uses: 'short animations, reaction memes, and simple web graphics', pro: 'animation support and universal browser compatibility', con: 'limited to 256 colors, poor for high-detail photographs', ext: '.gif' },
    tiff: { full: 'TIFF', desc: 'a professional-grade archival format used in print publishing', uses: 'professional photography, publishing, and desktop archiving', pro: 'lossless quality with support for layers and metadata', con: 'very large files, unsuitable for web delivery or email', ext: '.tif or .tiff' },
    ico: { full: 'ICO', desc: 'the Windows icon format used for app and browser favicons', uses: 'website favicons, Windows application icons, and taskbar icons', pro: 'can contain multiple sizes in one file for crisp display at any size', con: 'limited to small sizes and not suited for general-purpose images', ext: '.ico' },
    svg: { full: 'SVG', desc: 'a resolution-independent vector format based on XML markup', uses: 'logos, icons, illustrations, and scalable web graphics', pro: 'infinitely scalable without any quality loss at any resolution', con: 'not suitable for complex photographs or detailed raster artwork', ext: '.svg' },
    heic: { full: 'HEIC', desc: "Apple's High Efficiency Image Container, the default iPhone format", uses: 'iPhone photos, iOS screenshots, and Apple ecosystem files', pro: 'images are roughly half the size of equivalent JPEG files', con: 'poor support on Windows and Android without additional software', ext: '.heic' },
    raw: { full: 'RAW', desc: 'unprocessed sensor data captured by digital cameras', uses: 'professional photography workflows and photo editing', pro: 'maximum exposure data for post-processing and color grading', con: 'massive files requiring specialized software to open', ext: '.raw' },
    cr2: { full: 'CR2', desc: "Canon's proprietary RAW camera format", uses: "professional Canon DSLR photography and studio workflows", pro: 'contains full unprocessed sensor data for maximum editing latitude', con: "proprietary format requiring Canon's software or converters", ext: '.cr2' },
    pdf: { full: 'PDF', desc: 'the universal document format that preserves layout across all devices', uses: 'documents, reports, e-books, and cross-platform file sharing', pro: 'consistent rendering on any device, OS, or software', con: 'images inside are often compressed and not ideal for photo editing', ext: '.pdf' },
}

const SLUG_INTRO = {
    'heic-to-jpg': "Every iPhone photo you take is saved in HEIC format — a brilliant space-saver on your device but a nightmare when you try to share it with someone on Windows, post it to a website, or upload it to a legacy photo service. HEIC files are simply not supported everywhere yet. Converting them to JPG immediately solves that compatibility problem without any visible loss of quality for everyday viewing.",
    'heic-to-png': "HEIC images from iPhones look great on Apple devices, but many creative apps, websites, and design tools still refuse to open them. Converting HEIC to PNG gives you a lossless, transparency-capable image file that works flawlessly in Photoshop, Figma, Canva, WordPress, and any browser without extra plugins or conversion steps in the future.",
    'heic-to-webp': "The combination of HEIC and WebP represents two different sides of modern efficiency. HEIC is Apple's storage format optimized for your camera roll, while WebP is Google's delivery format optimized for your website. Converting iPhone photos directly to WebP for web publishing is the fastest path from camera to optimized online image.",
    'heic-to-gif': "Turning a live iPhone photo or burst sequence captured in HEIC into an animated GIF has never been simpler. Whether you want a short looping reaction image for social media or a fun clip from a vacation, converting your HEIC to GIF gives it the animation magic that works everywhere.",
    'webp-to-jpg': "WebP is fantastic for web performance, but when you download an image from a modern website and try to open it in Windows Photo Viewer, your printer software, or a legacy editing tool, you often hit a wall. Converting WebP to JPG takes a few seconds and gives you a universally compatible photo file you can open, edit, and share with any software in the world.",
    'webp-to-png': "WebP images look great on websites but become a source of frustration the moment you try to use them in design software that doesn't yet recognize the format. PNG is the universal language of digital graphics — transparent, lossless, and accepted everywhere from document editors to photo tools to social platforms.",
    'webp-to-bmp': "BMP files are far from glamorous, but they are exactly what certain Windows applications, legacy print drivers, and industrial software expect as input. If your workflow requires uncompressed raw image data, converting your WebP to BMP gives you pixel-perfect fidelity with no compression artifacts at all.",
    'webp-to-tiff': "Professional print workflows at magazines, publishing houses, and large-format print shops often demand TIFF files because of their lossless quality and rich color data. Converting a WebP source image to TIFF is a simple way to meet those professional specifications without starting your creative process over.",
    'webp-to-gif': "Social media is obsessed with short animated loops, and GIF is still the format that works everywhere — Twitter, Reddit, Slack, Discord, and messaging apps all display GIFs natively. If you have a WebP sequence or image you want to animate or simply share as a static but widely-compatible file, this conversion is the cleanest path.",
    'png-to-jpg': "PNG files keep every single pixel perfectly, which is great for quality but terrible for storage and bandwidth. A logo or UI screenshot saved as PNG can easily be ten times larger than the same image saved as JPG. For photos and images going on websites, social platforms, or in emails, JPG is nearly always the smarter choice for size.",
    'png-to-webp': "PNG to WebP is one of the smartest conversions you can make for your website. Switching your image library from PNG to WebP typically cuts page weight by 25-40%, which directly improves loading speeds, Core Web Vitals scores, and user experience — especially on mobile connections.",
    'png-to-bmp': "Some software environments — particularly embedded systems, legacy Windows applications, and industrial machinery interfaces — require BMP as their native image input. Converting PNG to BMP gives those systems exactly what they need: a raw, uncompressed grid of pixel color values.",
    'png-to-gif': "PNG images are great for sharp graphics, but they cannot animate. Converting a PNG to GIF is useful for many reasons: fitting a graphic into a platform that only accepts GIF uploads, creating a simple background-transparent image for email, or preparing sticker-style art for messaging platforms that prefer GIF over PNG.",
    'png-to-tiff': "TIFF is the gold standard for image files that will be professionally scanned, processed, or printed. Converting PNG artwork, illustrations, or documentation screenshots to TIFF ensures they meet the specifications required by commercial printers, archival software, and document management systems.",
    'png-to-avif': "AVIF is the newest and most efficient image format available today. Converting PNG to AVIF can reduce file sizes by 50% or more while maintaining equivalent or even better visual quality. For websites targeting modern browsers, it's a dramatic improvement in performance without sacrificing sharpness.",
    'jpg-to-png': "Sometimes you need a photo in a format that supports transparency or lossless editing. JPG files re-compress every time you save them, slowly degrading quality over multiple editing passes. Converting to PNG stops that cycle and gives you a clean canvas for graphic work, overlays, or any workflow that requires a transparent background layer.",
    'jpg-to-webp': "JPG to WebP is perhaps the most impactful conversion you can make for your website speed. Google PageSpeed, Lighthouse, and every major SEO tool actively penalizes sites that serve JPG files when WebP equivalents could be offered. A single bulk conversion can eliminate dozens of PageSpeed warnings instantly.",
    'jpg-to-bmp': "Need raw pixel data without compression? Certain scanner drivers, OCR engines, and barcode-processing software require BMP input because they cannot handle compressed formats like JPG. Converting your JPG source to BMP gives those systems exactly the raw image data they are designed to work with.",
    'jpg-to-gif': "GIFs are everywhere in modern digital communication — messenger apps, social platforms, and comment sections. Converting a JPG photo to GIF trades some color depth for universal compatibility and the ability to be shared as an inline animated image in platforms that support it. It's especially popular for simple reaction images and memes.",
    'jpg-to-tiff': "When a client hands you a JPG but your print shop demands TIFF, the conversion takes seconds but makes the difference between a rejected submission and a perfect print run. TIFF preserves every tonal detail of the photograph in a lossless container trusted across the entire professional print industry.",
    'jpg-to-avif': "Your JPG library is likely huge. Switching to AVIF means keeping the same visual quality while cutting the file sizes in half. For photographers with hundreds of web images, or e-commerce stores with thousands of product photos, bulk converting to AVIF translates directly into faster page loads and lower hosting bandwidth costs.",
    'bmp-to-jpg': "BMP files are enormous. A simple 1920×1080 screenshot saved as BMP can easily exceed 6 megabytes. The same image in JPG fits into around 300 kilobytes with no perceptible quality difference for viewing. Converting BMP to JPG is one of the fastest ways to reclaim storage space and make your image files actually usable online.",
    'bmp-to-png': "BMP and PNG are both popular choices when you need pixel precision, but PNG achieves the same lossless quality using significantly smarter compression. Moving from BMP to PNG reduces your file sizes dramatically while keeping every single pixel identical — a clear upgrade with zero downsides for most workflows.",
    'bmp-to-webp': "If you have a library of BMP files and want to publish them online, WebP is the obvious upgrade path. You will get dramatically smaller files, good browser support, and a format specifically engineered for fast, high-quality web delivery — all without the pixel data loss that JPG introduces.",
    'bmp-to-gif': "Converting an uncompressed BMP to the compact, indexed GIF format is one of the most dramatic file size reductions you will ever experience in image conversion. For simple graphics, logos, and flat-color illustrations, the visual difference is minimal while the size difference can be in the hundreds of megabytes for collections.",
    'bmp-to-avif': "BMP to AVIF is an extreme leap in compression efficiency. AVIF was designed to replace formats like JPG and PNG, and going from the uncompressed world of BMP straight to the hyper-compressed world of AVIF produces files that are orders of magnitude smaller — perfect for modernizing legacy software assets or archiving old collections.",
    'gif-to-jpg': "GIF's 256-color limitation often makes photos look washed out and posterized. Converting a still GIF frame to JPG gives you access to full 16-million color photographic reproduction, making the image look natural and rich again — especially for faces, landscapes, and anything with smooth color gradients.",
    'gif-to-png': "PNG is far superior to GIF for static images that need sharp edges and full-color accuracy. If you have a GIF that was intended as a logo or icon but it looked banded or dithered, converting it to PNG often instantly improves its clarity and color accuracy without losing the transparency.",
    'gif-to-webp': "GIF files are heavy for animations and limited for static images. WebP supports both static images and animations at a fraction of GIF's file size. Converting GIF to WebP for modern web use makes your site faster without giving up the animation feature your users expect.",
    'gif-to-bmp': "Sometimes legacy tools, old-school Windows applications, or industrial imaging systems require BMP files specifically. Converting a GIF — which is indexed and compressed — back to an uncompressed BMP gives these systems the raw pixel data they need to function correctly.",
    'tiff-to-jpg': "TIFF files are beautiful for archiving and printing, but they are far too large to email, upload to social media, or embed in a presentation. Converting a TIFF to JPG reduces a 50MB print file to a 2MB shareable image in seconds, making your professional photography instantly distributable.",
    'tiff-to-png': "TIFF and PNG are both high-quality formats, but PNG is far more widely accepted by design software, web platforms, and document editors. If a client's design tool won't open your TIFF, converting to PNG almost always solves the problem immediately without any meaningful quality loss.",
    'tiff-to-webp': "Print-ready TIFF files are rarely suitable for web use without conversion. WebP gives you the closest equivalent to TIFF quality that a browser can deliver, at a fraction of the file size. It's the recommended output format for photographers building portfolio sites with maximum quality and minimum page weight.",
    'avif-to-jpg': "AVIF is cutting-edge, but compatibility is still limited in photo editors, desktop apps, and older operating systems. Converting AVIF to JPG gives you a universally compatible photo that works literally everywhere — from old smartphones to professional editing suites to government form upload fields.",
    'avif-to-png': "AVIF to PNG conversion is useful when you need to edit a next-gen web image using traditional design software. Photoshop, GIMP, and most editors don't natively support AVIF yet. PNG gives you lossless quality you can freely edit, composite, and re-export as many times as needed.",
    'avif-to-webp': "Both AVIF and WebP are modern web-optimized formats, but WebP is significantly more compatible across browsers, operating systems, and CMS platforms. Converting AVIF to WebP is a practical compatibility compromise that still gives you much better compression than traditional JPG or PNG.",
    'ico-to-jpg': "ICO files contain icon graphics, often in very small sizes, that sometimes need to be extracted and used as regular images. Converting an ICO to JPG lets you use favicon art or application icons in documents, presentations, and design projects where only regular photo formats are accepted.",
    'ico-to-png': "PNG is the natural output format for icons because it preserves the transparency that makes icons look crisp on any background color. Converting ICO to PNG gives you a clean, transparent-background image that works perfectly in email signatures, HTML image tags, and any design tool.",
    'ico-to-gif': "Converting ICO to GIF is useful for legacy web environments that display small icon graphics as GIFs in toolbars or UI elements. While PNG is the modern choice, GIF support goes back to the earliest days of the web, making it a reliable fallback.",
    'svg-to-png': "SVG is fantastic for web development and scalable design, but when you need to paste your logo into a Word document, upload it to a platform that doesn't support SVG, or include it in a social media post, PNG is the necessary format. Converting SVG to PNG gives you a high-resolution raster version at exactly the size you need.",
    'svg-to-jpg': "SVGs are vector files — they scale infinitely but can't always be used as-is in non-web contexts. Converting an SVG logo or icon to JPG produces a raster image compatible with virtually every software in existence, from Microsoft Office to email clients to photo printing services.",
    'raw-to-jpg': "RAW files are the fullest expression of what your camera captured, but they require specialized software to open. Converting RAW to JPG produces a beautiful, ready-to-use photo that works in every viewer, editor, and social platform. It's the essential final step in any professional photo editing workflow.",
    'cr2-to-jpg': "Canon RAW files contain all the rich detail your camera sensor captured, but sharing them requires recipients to have compatible software. Converting CR2 to JPG compresses that data into a universally readable photo that you can share with clients, upload to online galleries, or import into any editor.",
    'pdf-to-jpg': "PDF pages are designed for text and print, but converting them to JPG images makes each page shareable, viewable in any gallery app, and uploadable to any platform that accepts photos. It's especially useful for converting scanned documents, certificates, and presentations into image-first workflows.",
    'pdf-to-png': "Converting PDF pages to PNG gives you lossless raster images of each page with transparency support. This is perfect for document review workflows, extracting diagrams from research papers, or converting scanned certificates into images you can use in presentations.",
    'pdf-to-gif': "PDF to GIF conversion is a niche but useful workflow for quickly creating animated previews of multi-page documents, or for sharing a single page of a document on platforms that only support image formats.",
}

const FORMAT_FAQ = {
    'heic': [
        { q: "Why can't Windows open HEIC files?", a: "HEIC uses the High Efficiency Video Coding standard that Windows doesn't support natively without a paid codec. Conversion to JPG or PNG is the easiest fix." },
        { q: "Do iPhone photos lose quality when converted from HEIC?", a: "At quality settings above 85%, the visual difference between HEIC and JPG is invisible to the human eye in normal viewing conditions. You keep all the practical detail." },
        { q: "Can I convert HEIC in bulk?", a: "Yes. Our converter lets you upload multiple HEIC files and download all results as a ZIP in one step." },
    ],
    'webp': [
        { q: "Why does my website use WebP images?", a: "Web developers choose WebP because it loads faster than JPG and PNG at the same visual quality, improving Core Web Vitals and SEO rankings." },
        { q: "Can I edit a WebP file in Photoshop?", a: "Newer versions of Photoshop support WebP, but older versions need a plugin or you can convert to PNG first for full editing compatibility." },
        { q: "Does WebP support transparency?", a: "Yes, WebP supports alpha channel transparency just like PNG, making it a strong choice for logos and UI elements on the web." },
    ],
    'png': [
        { q: "When should I use PNG instead of JPG?", a: "Use PNG for graphics with text, logos, screenshots, or any image needing a transparent background. Use JPG for photos where file size matters more than pixel perfection." },
        { q: "Does PNG compression lose quality?", a: "No. PNG uses lossless compression, meaning no pixel data is ever discarded. Every save is identical to the original source." },
        { q: "Are PNG files too large for web use?", a: "PNG can be large for photos, but for graphics and logos it is perfectly appropriate. For photos on the web, convert to WebP or JPG instead." },
    ],
    'jpg': [
        { q: "Does saving a JPG multiple times degrade it?", a: "Yes. Each time you open and re-save a JPG, it is re-compressed and loses a small amount of detail. Work in PNG or TIFF and convert to JPG only as the final step." },
        { q: "What JPG quality setting should I use for websites?", a: "For web images, quality 75-85 is the sweet spot — hard to distinguish from 100% quality at typical screen sizes but significantly smaller in file size." },
        { q: "Can JPG files have transparent backgrounds?", a: "No. JPG does not support transparency. Use PNG or WebP if you need see-through sections in your image." },
    ],
    'bmp': [
        { q: "Why are BMP files so large?", a: "BMP stores every pixel's color value with no compression at all. A 1920×1080 image in BMP takes about 6MB versus 300KB in JPG." },
        { q: "Is BMP still used today?", a: "Yes, primarily in legacy Windows software, industrial machinery, and systems that require raw pixel data without the complexity of compressed formats." },
        { q: "Should I use BMP for general image storage?", a: "No. For archiving, use PNG (lossless and much smaller). For sharing, use JPG or WebP. BMP is only appropriate when software specifically demands it." },
    ],
    'gif': [
        { q: "Why does my GIF photo look posterized?", a: "GIF only supports 256 colors per frame, which causes complex gradients in photos to look banded. Use JPG or PNG for photographs instead." },
        { q: "Can I convert a GIF animation to another format while keeping the animation?", a: "Our tool converts individual frames. WebP also supports animation if you need a web-friendly animated format — check our WebP converter." },
        { q: "Is GIF being replaced by other formats?", a: "WebP and AVIF can replicate GIF animation at 10x smaller file sizes. However, GIF remains the most universally supported animated image format in messaging apps." },
    ],
    'tiff': [
        { q: "When is TIFF better than PNG for archiving?", a: "TIFF supports layers, multiple pages, and rich professional metadata (EXIF, ICC profiles) that PNG doesn't. It's the standard for print publishing archives." },
        { q: "Can I email a TIFF file?", a: "Not practically. TIFF files are often 50-300MB. Convert to JPG for emailing or sharing — quality remains excellent for typical viewing." },
        { q: "Do web browsers support TIFF?", a: "Generally no. Safari has partial TIFF support, but for the web you should convert TIFF to WebP, PNG, or JPG." },
    ],
    'avif': [
        { q: "Is AVIF better than WebP?", a: "In most benchmarks, AVIF produces smaller files at equivalent quality. However, WebP has broader browser and software support, making it the safer practical choice for most websites right now." },
        { q: "Which browsers support AVIF?", a: "Chrome, Firefox, Edge, and Safari (version 16+) support AVIF. Very old browsers and most desktop applications still don't, which is why conversion tools are valuable." },
        { q: "Is AVIF lossless?", a: "AVIF supports both lossy and lossless modes, unlike JPG which is lossy-only. For maximum quality, lossless AVIF is an excellent archival choice." },
    ],
    'svg': [
        { q: "Why doesn't my SVG look the same after converting to PNG?", a: "If your SVG uses fonts, external images, or relative paths, some elements may not render correctly unless embedded. For best results, flatten and embed all resources before converting." },
        { q: "At what resolution should I export SVG to PNG?", a: "For web use, 1x or 2x (for Retina displays) is sufficient. For print, export at 300 DPI equivalent — use our resizer to set exact pixel dimensions." },
        { q: "Can I convert an SVG with animations to PNG?", a: "Converting an animated SVG to PNG captures only the first frame (static state). SVG animations require a browser or SVG-aware viewer to play correctly." },
    ],
    'ico': [
        { q: "What size should my favicon ICO be?", a: "Standard favicon ICOs contain 16×16, 32×32, and 48×48 pixel versions inside a single file. Modern browsers prefer 32×32 for tab displays." },
        { q: "Can I convert any image to ICO for a favicon?", a: "Yes, but results look best when you start with a simple, high-contrast logo or icon rather than a complex photograph. Simple shapes read clearly at small sizes." },
        { q: "What's the difference between ICO and PNG favicons?", a: "ICO is the original favicon format supported by all browsers including very old ones. PNG favicons work in modern browsers. For maximum compatibility, use ICO." },
    ],
    'raw': [
        { q: "Should I shoot in RAW or JPG?", a: "Shoot in RAW for maximum editing flexibility. Convert to JPG when you are ready to share or publish. RAW gives you access to exposure data that JPG permanently discards." },
        { q: "Can I recover overexposed areas from a RAW file?", a: "Often yes. RAW files retain up to 3 stops of recoverable highlight data that JPG-processed images permanently clip to pure white." },
        { q: "Why are RAW files different for each camera brand?", a: "Each manufacturer implements their own RAW format to capture proprietary sensor metadata and color science. That's why Canon uses CR2/CR3, Nikon uses NEF, Sony uses ARW, etc." },
    ],
}

function getFaqKey(from, to) {
    if (FORMAT_FAQ[from]) return from
    if (FORMAT_FAQ[to]) return to
    return 'jpg'
}

export default function ConverterSeoSection({ from, to, slug, fromName, toName }) {
    const fromMeta = FORMAT_META[from] || FORMAT_META.jpg
    const toMeta = FORMAT_META[to] || FORMAT_META.jpg
    const intro = SLUG_INTRO[slug]
    const faqKey = getFaqKey(from, to)
    const faqs = FORMAT_FAQ[faqKey] || FORMAT_FAQ.jpg

    return (
        <div className="seo-content mt-12 bg-white rounded-xl border border-slate-200 p-8 shadow-sm">
            <div className="prose prose-slate max-w-none text-sm text-slate-600 space-y-5">
                <h2 className="text-2xl font-bold text-slate-800">{fromName} to {toName} Converter — Complete Guide</h2>

                {intro ? (
                    <p>{intro}</p>
                ) : (
                    <p>
                        Converting {fromName} to {toName} is one of those tasks that sounds technical but is actually straightforward once you have the right tool. {fromMeta.full} is {fromMeta.desc}, commonly used for {fromMeta.uses}. Its biggest strength is {fromMeta.pro}, but {fromMeta.con} can sometimes make it the wrong format for the job at hand. {toMeta.full}, on the other hand, is {toMeta.desc} — and making the switch takes seconds on imgtool.in without installing any software or uploading your files to a remote server.
                    </p>
                )}

                <p>
                    All processing happens directly inside your web browser using modern JavaScript APIs. Your original {fromName} files never leave your device, which means your photos, designs, and documents remain completely private. Once you close the browser tab, everything is automatically cleared from memory. No account, no subscription, no upload limits.
                </p>

                <h3 className="text-lg font-bold text-slate-800 mt-6">Why Convert from {fromName} to {toName}?</h3>
                <p>
                    {fromMeta.full} files are excellent for {fromMeta.uses}, and their key advantage is {fromMeta.pro}. However, {fromMeta.con} sometimes creates compatibility or workflow issues. {toMeta.full} solves exactly those problems: it is {toMeta.desc}, which makes it ideal for {toMeta.uses}. Its most important benefit is {toMeta.pro}.
                </p>
                <p>
                    Common real-world scenarios where this conversion is needed include: sharing images across platforms with different format requirements, reducing file sizes before web publishing, meeting the format specifications of printing services, and opening images in software that doesn't support the original format. In every case, a fast and reliable browser-based converter like this one eliminates the need for additional software.
                </p>

                <h3 className="text-lg font-bold text-slate-800 mt-6">How to Convert {fromName} to {toName} in 3 Steps</h3>
                <div className="bg-slate-50 rounded-xl p-5 space-y-3 border border-slate-100">
                    <div className="flex gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-xs mt-0.5">1</span>
                        <p><strong>Upload your {fromName} file</strong> — Click the upload area or drag and drop your file directly. You can add multiple files at once for batch conversion. The tool accepts files with the {fromMeta.ext} extension.</p>
                    </div>
                    <div className="flex gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-xs mt-0.5">2</span>
                        <p><strong>Adjust settings if needed</strong> — For formats like JPG and WebP, you can set the output quality level. You can also resize the image during conversion to get exactly the dimensions you need without a separate step.</p>
                    </div>
                    <div className="flex gap-3 text-sm">
                        <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0 text-xs mt-0.5">3</span>
                        <p><strong>Click Convert and download</strong> — Your browser processes the conversion instantly. Download individual files or grab everything at once as a ZIP archive ready for use in any {toMeta.full}-compatible application.</p>
                    </div>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mt-6">Practical Tips for Best Results</h3>
                <p>
                    Before converting, consider whether you need the highest quality or the smallest possible file. For photographs going on a website, a quality setting of 80-85 is virtually indistinguishable from 100% but dramatically reduces file size. For documents, screenshots, and graphics with text, use 90+ or choose a lossless format like PNG to keep edges sharp and text legible.
                </p>
                <p>
                    If your image contains a transparent background and you are converting to a format that doesn't support transparency (like JPG), the transparent areas will be filled with white by default. If you need to preserve transparency, choose PNG or WebP as your output format. You can also use our <a href="/bg-remover" className="text-blue-600 hover:underline">Background Remover</a> before or after conversion to clean up any background artifacts.
                </p>
                <p>
                    For batch conversions of large image libraries, process files in smaller groups if you notice any browser slowdown. Modern browsers handle dozens of conversions simultaneously without issue, but very large RAW or TIFF files (over 50MB each) may benefit from being processed individually to avoid memory pressure.
                </p>

                <h3 className="text-lg font-bold text-slate-800 mt-8 pt-6 border-t border-slate-100">Frequently Asked Questions</h3>
                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <div key={i}>
                            <h4 className="font-bold text-slate-700">{faq.q}</h4>
                            <p className="mt-1">{faq.a}</p>
                        </div>
                    ))}
                    <div>
                        <h4 className="font-bold text-slate-700">Are my files safe when using this converter?</h4>
                        <p className="mt-1">Completely. All conversion work happens inside your own browser using JavaScript — no file is ever uploaded to any server. Your images stay on your device throughout the entire process and are cleared automatically when you leave the page.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-700">How many files can I convert at one time?</h4>
                        <p className="mt-1">There's no hard limit on file count. You can upload dozens of images in one batch and download them all as a single ZIP file. Practical limits depend on your device's available RAM rather than any server-side restriction.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
