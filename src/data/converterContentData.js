/**
 * Unique content data for Image-to-PDF and PDF-to-Image converter pages.
 * Each key maps to a route slug.
 */

export const IMAGE_TO_PDF_CONTENT = {
    'jpg-to-pdf': {
        intro: "JPG is the most common photograph format, and PDF is the most common document format. Combining them makes sense for countless real-world tasks — from compiling scanned receipts and invoices into a single file, to organizing travel documents, assignment submissions, or portfolio pages into a professional, easy-to-share PDF.",
        whyConvert: "Email attachments have file count limits, and sending 15 separate JPG files looks disorganized. A single PDF with those same 15 photos is easier to download, easier to print, and easier to archive. PDF also preserves the page order you intend, whereas separate image files can be sorted differently on different devices.",
        formatNote: "JPG uses lossy compression, which means each image already has some compression applied. When embedding JPGs into a PDF, the tool re-encodes them at your chosen quality setting. For the sharpest results, use a quality of 90% or above. Lower quality settings reduce file size but may introduce visible compression artifacts, especially on text-heavy scanned documents.",
        bestFor: "Scanned receipts, assignment photo submissions, insurance claim photos, product photography catalogs, and any collection of photographs that needs to be shared as a single document.",
        tips: [
            "Scan documents at the highest JPG quality your scanner supports before converting to PDF.",
            "Use the 'Auto' orientation mode to let the tool match each page's rotation to the image shape.",
            "For text-heavy scanned pages, keep quality at 90%+ to preserve readability."
        ],
        faqs: [
            { q: "Will my JPG photos lose quality when converted to PDF?", a: "The tool re-encodes images at your chosen quality level. At 90% or above, the difference from the original JPG is imperceptible for typical viewing and printing." },
            { q: "Can I combine JPG and PNG photos in the same PDF?", a: "Yes. The tool accepts any browser-supported image format. You can mix JPG, PNG, WebP, and other formats in a single PDF." }
        ]
    },
    'png-to-pdf': {
        intro: "PNG files are commonly used for screenshots, diagrams, charts, and graphics with text. Converting them to PDF is particularly useful when you need to compile multiple screenshots into a report, package design mockups for a client, or submit documentation that includes annotated images with crisp text edges.",
        whyConvert: "Unlike JPG, PNG preserves sharp text edges and supports transparency. When your source images are screenshots, flowcharts, or UI mockups, converting PNG to PDF maintains that text clarity in the final document. PDF is also the standard format most workplaces and institutions accept for submissions.",
        formatNote: "PNG is a lossless format, so source images start with maximum quality. During PDF embedding, the tool converts images to JPEG internally at your specified quality setting. For screenshots with small text, use 95% quality to preserve legibility. For photographs saved as PNG, 85-90% is sufficient.",
        bestFor: "Software documentation screenshots, annotated UI mockups, flowcharts and diagrams, design portfolio pages, and any graphics where text clarity is important.",
        tips: [
            "For screenshots with small text, set quality to 95% to keep text sharp in the PDF.",
            "Use 'Fit (no crop)' mode to ensure nothing is cut off — especially important for wide screenshots.",
            "PNG transparency will be replaced with a white background in the PDF since PDF pages are opaque."
        ],
        faqs: [
            { q: "Will PNG transparency be preserved in the PDF?", a: "No. PDF pages have a white background by default. Any transparent areas in your PNG will appear white in the final PDF." },
            { q: "Why are my PNG-to-PDF files larger than JPG-to-PDF?", a: "PNG source images are typically larger than JPGs. However, the PDF embedding process uses JPEG compression internally, so the final PDF size depends mainly on your quality setting, not the source format." }
        ]
    },
    'webp-to-pdf': {
        intro: "WebP images are increasingly common on the web, but many document workflows still require PDF. If you have downloaded product images, blog graphics, or reference screenshots in WebP format and need to compile them into a shareable document, this tool handles the conversion seamlessly without requiring you to first convert WebP to another format.",
        whyConvert: "WebP is excellent for web delivery but is not universally supported by document viewers, email clients, or print services. Converting WebP images directly to PDF lets you package web-sourced content into a universally readable document format without intermediate conversion steps.",
        formatNote: "WebP supports both lossy and lossless compression. Regardless of the original WebP compression type, the tool processes the decoded image data and re-encodes it as JPEG within the PDF at your chosen quality level.",
        bestFor: "Compiling web-downloaded reference images, creating lookbooks from e-commerce product photos, packaging blog visual content for offline sharing, and any workflow where web-sourced images need to become printable documents.",
        tips: [
            "If your WebP images were originally high-quality, use 90%+ quality to maintain detail in the PDF.",
            "WebP images from websites are often already compressed — avoid setting quality too low to prevent double-compression artifacts.",
            "Use A4 page size for standard document printing, or Letter size for US-standard printers."
        ],
        faqs: [
            { q: "Can this tool handle animated WebP files?", a: "The tool extracts the first frame of animated WebP images. For animated content, each frame would need to be extracted separately before conversion." },
            { q: "Do I need to convert WebP to JPG first before making a PDF?", a: "No. This tool accepts WebP images directly and converts them to PDF in a single step." }
        ]
    },
    'heic-to-pdf': {
        intro: "iPhones and iPads save photos in HEIC format by default. If you need to compile iPhone photos into a PDF — for an insurance claim, a property inspection report, or a photo album to share with someone who does not have an Apple device — this tool converts HEIC images directly to PDF without requiring any intermediate format conversion.",
        whyConvert: "HEIC files cannot be opened on many Windows computers and Android devices without additional software. By converting HEIC photos directly to PDF, you create a universally viewable document that works on any device, any operating system, and any PDF reader — while keeping all your photos organized in the correct order.",
        formatNote: "HEIC decoding happens entirely in your browser. The decoded image data is then embedded into the PDF as JPEG at your chosen quality setting. Since HEIC is already an efficiently compressed format, the resulting PDF may be slightly larger than the original HEIC files combined, but remains very practical for sharing.",
        bestFor: "iPhone photo albums, property inspection documentation, insurance claim photo bundles, vacation photo compilations, and any situation where iPhone photos need to be shared with non-Apple users.",
        tips: [
            "HEIC files from newer iPhones are typically high resolution (12MP+). The 'Fit' mode works well to display the full image on each page.",
            "Use 'Auto' orientation to let portrait and landscape iPhone photos rotate correctly on each PDF page.",
            "If the resulting PDF is too large, reduce the quality slider to 75-80% for a significant size reduction."
        ],
        faqs: [
            { q: "Can I convert Live Photos (HEIC) to PDF?", a: "The tool converts the still image portion of a Live Photo. The video/motion component of a Live Photo is not included in the PDF." },
            { q: "Why does HEIC-to-PDF conversion take longer than JPG?", a: "HEIC decoding requires additional processing steps compared to JPG. The browser needs to decode the HEIC container format before embedding the image data into the PDF." }
        ]
    },
    'gif-to-pdf': {
        intro: "GIF images are often used for simple graphics, diagrams, and legacy web content. Converting GIF files to PDF is useful when you need to include older graphics in a formal document, compile illustrated instructions, or archive GIF-based content in a universally readable format.",
        whyConvert: "GIF's 256-color limitation and older compression make it unsuitable for many modern workflows. However, many legacy documents, instructional diagrams, and archived graphics exist only as GIF files. Converting them to PDF preserves the content in a professional, printable format while making it easier to share and archive.",
        formatNote: "GIF images are limited to 256 colors per frame. When converted to PDF, the visual quality reflects this original limitation — the tool cannot add color information that wasn't in the original GIF. For animated GIFs, only the first frame is used.",
        bestFor: "Archiving legacy web graphics, compiling instructional diagram sets, packaging simple illustrations into printable documents, and converting older graphic assets into a shareable format.",
        tips: [
            "GIF files are typically small and simple, so quality settings above 85% will produce excellent results.",
            "For animated GIFs, only the first frame will appear in the PDF.",
            "GIF's limited color palette may cause some images to look banded — this is a characteristic of the source format, not the conversion."
        ],
        faqs: [
            { q: "Will animated GIF frames be included in the PDF?", a: "No. Only the first frame of each animated GIF is converted. Each GIF file becomes one page in the PDF." },
            { q: "Why does my GIF look banded or posterized in the PDF?", a: "GIF supports only 256 colors. Images with smooth gradients (like photographs) will show visible color banding. This is a limitation of the source format." }
        ]
    },
    'svg-to-pdf': {
        intro: "SVG files are vector graphics commonly used for logos, icons, and illustrations. Converting SVG to PDF is essential when you need to include vector artwork in a document, prepare print-ready files, or share designs with clients who may not have SVG-compatible software.",
        whyConvert: "While SVG is excellent for web use, many document workflows and print services require PDF. Converting SVG logos, illustrations, or technical diagrams to PDF ensures they can be viewed, printed, and archived using any standard PDF reader without requiring specialized design software.",
        formatNote: "SVG is a vector format, but the tool rasterizes it to pixels before embedding it in the PDF. For the sharpest results, the rasterized image quality depends on the original SVG's complexity and your quality setting. Simple logos and icons convert cleanly; very complex SVGs with thousands of paths may take slightly longer to process.",
        bestFor: "Brand asset documentation, logo sheets for clients, technical illustration compilations, icon reference PDFs, and preparing vector artwork for non-designer stakeholders.",
        tips: [
            "SVG files are resolution-independent, but the PDF will contain a rasterized version. Use 95%+ quality for maximum sharpness.",
            "If your SVG uses external fonts or linked images, they may not render correctly. Embed all resources in the SVG before converting.",
            "For multi-page brand guideline PDFs, combine multiple SVG logos and assets in one conversion."
        ],
        faqs: [
            { q: "Will SVG vector quality be preserved in the PDF?", a: "The tool rasterizes the SVG to pixels before embedding. The result is a high-quality raster image in the PDF, not a scalable vector. For professional print work requiring true vector PDF output, use dedicated design software." },
            { q: "Can I convert SVGs with embedded fonts?", a: "If the fonts are embedded within the SVG file itself, they will render correctly. SVGs that reference external font files may display with substitute fonts." }
        ]
    }
}

export const PDF_TO_IMAGE_CONTENT = {
    'pdf-to-jpg': {
        intro: "Converting PDF pages to JPG is the most practical way to extract document content as shareable images. JPG produces compact files that work everywhere — in email attachments, social media posts, messaging apps, and image galleries. If you need to share a specific page from a report, certificate, or presentation without sending the entire PDF, JPG extraction is the fastest solution.",
        whyConvert: "Many platforms do not accept PDF uploads. Social media, messaging apps, and most online forms require image formats like JPG. Extracting PDF pages as JPG creates universally compatible files that can be shared, embedded, or uploaded anywhere images are accepted.",
        formatNote: "JPG uses lossy compression, which means file sizes are small but there is a slight quality trade-off. For text-heavy documents, use 150 DPI or 300 DPI to keep text readable. For photo-heavy PDFs, 150 DPI usually provides sufficient quality at a reasonable file size.",
        tips: [
            "Use 150 DPI for standard web and email usage — it balances quality and file size well.",
            "Use 300 DPI only when you need print-quality images or need to zoom into fine details.",
            "Select specific pages instead of converting the entire document to save time and storage."
        ],
        faqs: [
            { q: "Why does my extracted JPG look blurry?", a: "This usually happens when using 72 DPI for text-heavy documents. Switch to 150 DPI or 300 DPI for sharper text rendering." },
            { q: "Can I extract specific pages instead of the whole PDF?", a: "Yes. The tool shows thumbnails of all pages and lets you select individual pages to convert. You don't need to export every page." }
        ]
    },
    'pdf-to-png': {
        intro: "Converting PDF pages to PNG gives you lossless, pixel-perfect images of each page. PNG is the preferred format when you need to extract diagrams, charts, technical drawings, or any content where text sharpness and fine detail matter more than file size. PNG also preserves clean edges on text, making it ideal for documentation and presentation workflows.",
        whyConvert: "When extracting content from technical documents, research papers, or design files, JPG compression can blur fine lines and text edges. PNG preserves every pixel exactly as rendered, making it the right choice for academic citations, UI documentation, and any context where visual fidelity is more important than file size.",
        formatNote: "PNG files are significantly larger than JPG for the same content because PNG uses lossless compression. A single 300 DPI page can easily exceed 5MB in PNG format. If file size is a concern and the content is primarily photographs, consider using JPG instead.",
        tips: [
            "Use PNG for pages containing diagrams, charts, code snippets, or small text where sharpness is critical.",
            "For photographic content, JPG produces much smaller files with negligible visual difference.",
            "At 300 DPI, PNG files can be very large. Use 150 DPI for a good balance of quality and size."
        ],
        faqs: [
            { q: "Why are my PNG files so much larger than JPG?", a: "PNG is lossless — it preserves every pixel without compression artifacts. This comes at the cost of larger file sizes. For most web and sharing purposes, JPG is more practical." },
            { q: "When should I choose PNG over JPG for PDF extraction?", a: "Choose PNG when the document contains fine text, code, technical diagrams, or any content where compression artifacts would be problematic. For photographs and general documents, JPG is usually sufficient." }
        ]
    },
    'pdf-to-gif': {
        intro: "Converting PDF pages to GIF is useful for creating quick previews of document pages, preparing simple graphics for legacy web platforms, or extracting basic diagrams from documents. While GIF is limited to 256 colors, it works well for simple text documents, forms, and monochrome content.",
        whyConvert: "Some legacy systems, email templates, and older web platforms specifically require GIF format. Converting a PDF page to GIF creates a lightweight, universally supported image that works even in the most basic image viewers and HTML email clients.",
        formatNote: "GIF supports only 256 colors per image. This means photographic PDF pages will lose color accuracy and may show visible banding. However, for black-and-white text documents, simple forms, and monochrome diagrams, GIF produces very compact files with acceptable quality.",
        tips: [
            "GIF works best for simple, text-heavy, or monochrome PDF pages.",
            "For colorful or photographic PDFs, use JPG instead to preserve color accuracy.",
            "72 DPI is usually sufficient for GIF since the format's color limitation already constrains quality."
        ],
        faqs: [
            { q: "Why does my PDF page look banded or discolored as a GIF?", a: "GIF supports only 256 colors. Pages with photographs, gradients, or complex color schemes will show visible color reduction. Use JPG or PNG for full-color content." },
            { q: "Can I create an animated GIF from multiple PDF pages?", a: "This tool exports each page as a separate static GIF image. To create an animated GIF from multiple pages, you would need to use a GIF animation tool after exporting." }
        ]
    }
}

/** Missing SLUG_INTRO entries for ImageConverter pages */
export const MISSING_CONVERTER_INTROS = {
    'webp-to-ico': "Website favicons are typically expected in ICO format for maximum browser compatibility, including older versions of Internet Explorer. If your logo or icon exists only as a WebP file — common when working with modern web assets — converting it to ICO lets you create a proper favicon that works across all browsers, including those that don't support WebP.",
    'png-to-ico': "Creating a favicon for your website usually requires an ICO file. If your logo is in PNG format, converting it to ICO produces a proper multi-resolution icon file that browsers use for tab icons, bookmarks, and shortcut thumbnails. ICO files can contain multiple sizes (16×16 to 256×256) in a single file, ensuring your icon looks sharp at every display size.",
    'png-to-svg': "Converting a PNG raster image to SVG vector format is useful when you need a scalable version of a logo, icon, or simple graphic. Note that this conversion traces the pixel data into vector paths — it works well for simple shapes, logos with solid colors, and line art, but complex photographs will not produce useful SVG output.",
    'jpg-to-ico': "If your website logo exists only as a JPG photograph, converting it to ICO format creates a compatible favicon file. Keep in mind that favicons are displayed at very small sizes (16–48 pixels), so complex photographs will look unclear at icon size. Simple, high-contrast images with bold shapes work best as favicons.",
    'jpg-to-svg': "Converting a JPG photograph to SVG vector format uses image tracing to approximate the pixel data with vector paths. This works reasonably well for simple graphics, logos, and illustrations with distinct edges, but detailed photographs will produce very large SVG files with limited practical benefit. For photographs, raster formats (JPG, PNG, WebP) remain the better choice."
}
