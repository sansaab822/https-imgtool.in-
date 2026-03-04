// Central registry of all tools for IMG Tool
export const tools = [
    // ── Modern Formats ──────────────────────────────────────────
    { slug: 'avif-to-jpg', name: 'AVIF to JPG', from: 'avif', to: 'jpg', category: 'modern-formats', icon: 'fa-file-image', color: 'indigo', description: 'Convert AVIF images to universal JPG format instantly.' },
    { slug: 'avif-to-png', name: 'AVIF to PNG', from: 'avif', to: 'png', category: 'modern-formats', icon: 'fa-file-image', color: 'indigo', description: 'Convert AVIF to lossless PNG format.' },
    { slug: 'avif-to-webp', name: 'AVIF to WebP', from: 'avif', to: 'webp', category: 'modern-formats', icon: 'fa-globe', color: 'green', description: 'Convert AVIF to Google\'s WebP format.' },
    { slug: 'heic-to-jpg', name: 'HEIC to JPG', from: 'heic', to: 'jpg', category: 'modern-formats', icon: 'fa-mobile-alt', color: 'blue', description: 'Convert iPhone HEIC photos to JPG instantly.' },
    { slug: 'heic-to-png', name: 'HEIC to PNG', from: 'heic', to: 'png', category: 'modern-formats', icon: 'fa-mobile-alt', color: 'blue', description: 'Convert HEIC to transparent PNG.' },
    { slug: 'heic-to-webp', name: 'HEIC to WebP', from: 'heic', to: 'webp', category: 'modern-formats', icon: 'fa-mobile-alt', color: 'blue', description: 'Optimize iPhone images for the web.' },
    { slug: 'heic-to-gif', name: 'HEIC to GIF', from: 'heic', to: 'gif', category: 'modern-formats', icon: 'fa-mobile-alt', color: 'blue', description: 'Convert HEIC images to animated GIF format.' },

    // ── Standard Converters: WebP ────────────────────────────────
    { slug: 'webp-to-jpg', name: 'WebP to JPG', from: 'webp', to: 'jpg', category: 'converters', icon: 'fa-file-image', color: 'green', description: 'Convert WebP to compatible JPG format.' },
    { slug: 'webp-to-png', name: 'WebP to PNG', from: 'webp', to: 'png', category: 'converters', icon: 'fa-file-image', color: 'green', description: 'Convert WebP to lossless PNG.' },
    { slug: 'webp-to-ico', name: 'WebP to ICO', from: 'webp', to: 'ico', category: 'converters', icon: 'fa-file-image', color: 'green', description: 'Convert WebP to ICO favicon format.' },
    { slug: 'webp-to-bmp', name: 'WebP to BMP', from: 'webp', to: 'bmp', category: 'converters', icon: 'fa-file-image', color: 'green', description: 'Convert WebP to BMP bitmap format.' },
    { slug: 'webp-to-tiff', name: 'WebP to TIFF', from: 'webp', to: 'tiff', category: 'converters', icon: 'fa-file-image', color: 'green', description: 'Convert WebP to TIFF format.' },
    { slug: 'webp-to-gif', name: 'WebP to GIF', from: 'webp', to: 'gif', category: 'converters', icon: 'fa-file-image', color: 'green', description: 'Convert WebP to GIF format.' },

    // ── Standard Converters: PNG ─────────────────────────────────
    { slug: 'png-to-jpg', name: 'PNG to JPG', from: 'png', to: 'jpg', category: 'converters', icon: 'fa-image', color: 'blue', description: 'Convert PNG to compressed JPG format.' },
    { slug: 'png-to-webp', name: 'PNG to WebP', from: 'png', to: 'webp', category: 'converters', icon: 'fa-image', color: 'blue', description: 'Convert PNG to modern WebP format.' },
    { slug: 'png-to-ico', name: 'PNG to ICO', from: 'png', to: 'ico', category: 'converters', icon: 'fa-image', color: 'blue', description: 'Convert PNG to ICO favicon.' },
    { slug: 'png-to-svg', name: 'PNG to SVG', from: 'png', to: 'svg', category: 'converters', icon: 'fa-image', color: 'blue', description: 'Trace PNG to scalable SVG vector.' },
    { slug: 'png-to-bmp', name: 'PNG to BMP', from: 'png', to: 'bmp', category: 'converters', icon: 'fa-image', color: 'blue', description: 'Convert PNG to BMP format.' },
    { slug: 'png-to-gif', name: 'PNG to GIF', from: 'png', to: 'gif', category: 'converters', icon: 'fa-image', color: 'blue', description: 'Convert PNG to animated GIF.' },
    { slug: 'png-to-tiff', name: 'PNG to TIFF', from: 'png', to: 'tiff', category: 'converters', icon: 'fa-image', color: 'blue', description: 'Convert PNG to TIFF format.' },
    { slug: 'png-to-avif', name: 'PNG to AVIF', from: 'png', to: 'avif', category: 'converters', icon: 'fa-image', color: 'blue', description: 'Convert PNG to modern AVIF format.' },
    { slug: 'png-to-pdf', name: 'PNG to PDF', from: 'png', to: 'pdf', category: 'pdf-tools', icon: 'fa-image', color: 'red', description: 'Convert PNG images to PDF document.' },

    // ── Standard Converters: JPG ─────────────────────────────────
    { slug: 'jpg-to-png', name: 'JPG to PNG', from: 'jpg', to: 'png', category: 'converters', icon: 'fa-file-image', color: 'orange', description: 'Convert JPG to lossless PNG format.' },
    { slug: 'jpg-to-webp', name: 'JPG to WebP', from: 'jpg', to: 'webp', category: 'converters', icon: 'fa-file-image', color: 'orange', description: 'Convert JPG to modern WebP format.' },
    { slug: 'jpg-to-ico', name: 'JPG to ICO', from: 'jpg', to: 'ico', category: 'converters', icon: 'fa-file-image', color: 'orange', description: 'Convert JPG to ICO favicon.' },
    { slug: 'jpg-to-svg', name: 'JPG to SVG', from: 'jpg', to: 'svg', category: 'converters', icon: 'fa-file-image', color: 'orange', description: 'Trace JPG to scalable SVG.' },
    { slug: 'jpg-to-bmp', name: 'JPG to BMP', from: 'jpg', to: 'bmp', category: 'converters', icon: 'fa-file-image', color: 'orange', description: 'Convert JPG to BMP format.' },
    { slug: 'jpg-to-gif', name: 'JPG to GIF', from: 'jpg', to: 'gif', category: 'converters', icon: 'fa-file-image', color: 'orange', description: 'Convert JPG to GIF format.' },
    { slug: 'jpg-to-tiff', name: 'JPG to TIFF', from: 'jpg', to: 'tiff', category: 'converters', icon: 'fa-file-image', color: 'orange', description: 'Convert JPG to TIFF format.' },
    { slug: 'jpg-to-avif', name: 'JPG to AVIF', from: 'jpg', to: 'avif', category: 'converters', icon: 'fa-file-image', color: 'orange', description: 'Convert JPG to modern AVIF format.' },
    { slug: 'jpg-to-pdf', name: 'JPG to PDF', from: 'jpg', to: 'pdf', category: 'pdf-tools', icon: 'fa-file-image', color: 'red', description: 'Convert JPG images to PDF document.' },

    // ── Standard Converters: BMP ─────────────────────────────────
    { slug: 'bmp-to-jpg', name: 'BMP to JPG', from: 'bmp', to: 'jpg', category: 'converters', icon: 'fa-file-image', color: 'slate', description: 'Convert BMP to JPG format.' },
    { slug: 'bmp-to-png', name: 'BMP to PNG', from: 'bmp', to: 'png', category: 'converters', icon: 'fa-file-image', color: 'slate', description: 'Convert BMP to PNG format.' },
    { slug: 'bmp-to-webp', name: 'BMP to WebP', from: 'bmp', to: 'webp', category: 'converters', icon: 'fa-file-image', color: 'slate', description: 'Convert BMP to modern WebP format.' },
    { slug: 'bmp-to-gif', name: 'BMP to GIF', from: 'bmp', to: 'gif', category: 'converters', icon: 'fa-file-image', color: 'slate', description: 'Convert BMP to GIF format.' },

    // ── Standard Converters: GIF ─────────────────────────────────
    { slug: 'gif-to-jpg', name: 'GIF to JPG', from: 'gif', to: 'jpg', category: 'converters', icon: 'fa-film', color: 'pink', description: 'Convert GIF to JPG format.' },
    { slug: 'gif-to-png', name: 'GIF to PNG', from: 'gif', to: 'png', category: 'converters', icon: 'fa-film', color: 'pink', description: 'Convert GIF to PNG format.' },
    { slug: 'gif-to-webp', name: 'GIF to WebP', from: 'gif', to: 'webp', category: 'converters', icon: 'fa-film', color: 'pink', description: 'Convert GIF to WebP format.' },
    { slug: 'gif-to-ico', name: 'GIF to ICO', from: 'gif', to: 'ico', category: 'converters', icon: 'fa-film', color: 'pink', description: 'Convert GIF to ICO favicon.' },
    { slug: 'gif-to-bmp', name: 'GIF to BMP', from: 'gif', to: 'bmp', category: 'converters', icon: 'fa-film', color: 'pink', description: 'Convert GIF to BMP format.' },
    { slug: 'gif-to-pdf', name: 'GIF to PDF', from: 'gif', to: 'pdf', category: 'pdf-tools', icon: 'fa-film', color: 'red', description: 'Convert GIF to PDF document.' },

    // ── Standard Converters: ICO ─────────────────────────────────
    { slug: 'ico-to-png', name: 'ICO to PNG', from: 'ico', to: 'png', category: 'converters', icon: 'fa-icons', color: 'teal', description: 'Convert ICO favicon to PNG.' },
    { slug: 'ico-to-jpg', name: 'ICO to JPG', from: 'ico', to: 'jpg', category: 'converters', icon: 'fa-icons', color: 'teal', description: 'Convert ICO favicon to JPG.' },
    { slug: 'ico-to-gif', name: 'ICO to GIF', from: 'ico', to: 'gif', category: 'converters', icon: 'fa-icons', color: 'teal', description: 'Convert ICO to GIF format.' },

    // ── Standard Converters: SVG ─────────────────────────────────
    { slug: 'svg-to-png', name: 'SVG to PNG', from: 'svg', to: 'png', category: 'converters', icon: 'fa-bezier-curve', color: 'violet', description: 'Convert SVG vector to PNG raster.' },
    { slug: 'svg-to-jpg', name: 'SVG to JPG', from: 'svg', to: 'jpg', category: 'converters', icon: 'fa-bezier-curve', color: 'violet', description: 'Convert SVG vector to JPG.' },
    { slug: 'svg-to-pdf', name: 'SVG to PDF', from: 'svg', to: 'pdf', category: 'pdf-tools', icon: 'fa-bezier-curve', color: 'red', description: 'Convert SVG to PDF document.' },

    // ── Standard Converters: TIFF ─────────────────────────────────
    { slug: 'tiff-to-jpg', name: 'TIFF to JPG', from: 'tiff', to: 'jpg', category: 'converters', icon: 'fa-file-image', color: 'yellow', description: 'Convert TIFF to JPG format.' },
    { slug: 'tiff-to-png', name: 'TIFF to PNG', from: 'tiff', to: 'png', category: 'converters', icon: 'fa-file-image', color: 'yellow', description: 'Convert TIFF to PNG format.' },
    { slug: 'tiff-to-webp', name: 'TIFF to WebP', from: 'tiff', to: 'webp', category: 'converters', icon: 'fa-file-image', color: 'yellow', description: 'Convert TIFF to modern WebP format.' },

    // ── Standard Converters: RAW/CR2 ─────────────────────────────
    { slug: 'raw-to-jpg', name: 'RAW to JPG', from: 'raw', to: 'jpg', category: 'converters', icon: 'fa-camera', color: 'slate', description: 'Convert RAW camera files to JPG format.' },
    { slug: 'cr2-to-jpg', name: 'CR2 to JPG', from: 'cr2', to: 'jpg', category: 'converters', icon: 'fa-camera', color: 'slate', description: 'Convert Canon CR2 RAW to JPG format.' },

    // ── PDF Tools ───────────────────────────────────────────────
    { slug: 'pdf-to-jpg', name: 'PDF to JPG', from: 'pdf', to: 'jpg', category: 'pdf-tools', icon: 'fa-file-pdf', color: 'red', description: 'Extract PDF pages as high-quality JPG images.' },
    { slug: 'pdf-to-png', name: 'PDF to PNG', from: 'pdf', to: 'png', category: 'pdf-tools', icon: 'fa-file-pdf', color: 'red', description: 'Convert PDF pages to PNG with transparency support.' },
    { slug: 'pdf-to-gif', name: 'PDF to GIF', from: 'pdf', to: 'gif', category: 'pdf-tools', icon: 'fa-file-pdf', color: 'red', description: 'Convert PDF pages to animated GIF.' },
    { slug: 'webp-to-pdf', name: 'WebP to PDF', from: 'webp', to: 'pdf', category: 'pdf-tools', icon: 'fa-file-image', color: 'red', description: 'Convert WebP images to PDF.' },
    { slug: 'heic-to-pdf', name: 'HEIC to PDF', from: 'heic', to: 'pdf', category: 'pdf-tools', icon: 'fa-mobile-alt', color: 'red', description: 'Convert HEIC photos to PDF.' },

    // ── Editors & Utilities ─────────────────────────────────────
    { slug: 'image-resizer', name: 'Image Resizer', category: 'editors', icon: 'fa-expand', color: 'cyan', description: 'Resize images by pixels, percentage, or presets.' },
    { slug: 'image-compressor', name: 'Image Compressor', category: 'editors', icon: 'fa-compress-arrows-alt', color: 'orange', description: 'Reduce file size without losing quality.' },
    { slug: 'crop-image', name: 'Crop Image', category: 'editors', icon: 'fa-crop', color: 'pink', description: 'Crop images with custom aspect ratios.' },
    { slug: 'bg-remover', name: 'Background Remover', category: 'editors', icon: 'fa-eraser', color: 'purple', description: 'Remove backgrounds from images automatically.' },
    { slug: 'image-enhancer', name: 'Image Enhancer', category: 'editors', icon: 'fa-sliders-h', color: 'yellow', description: 'Enhance image quality with advanced filters.' },
    { slug: 'image-to-art', name: 'Image to Art', category: 'editors', icon: 'fa-palette', color: 'purple', description: 'Transform photos into artistic masterpieces.' },
    { slug: 'passport-size-photo', name: 'Passport Photo', category: 'editors', icon: 'fa-id-card', color: 'blue', description: 'Create passport size photos instantly.' },
    { slug: 'image-converter', name: 'Image Converter', category: 'editors', icon: 'fa-exchange-alt', color: 'indigo', description: 'Universal image format converter.' },
    { slug: 'all-image-converters', name: 'All Tools', category: 'editors', icon: 'fa-th-large', color: 'slate', description: 'Browse all 70+ image tools.' },

    // ── Special Tools ────────────────────────────────────────────
    { slug: '3d-text-to-stl-generator', name: '3D Text to STL', category: 'special', icon: 'fa-cube', color: 'purple', description: 'Generate 3D text STL files for 3D printing.' },
    { slug: 'svg-to-stl', name: 'SVG to STL', category: 'special', icon: 'fa-cube', color: 'purple', description: 'Convert SVG designs to 3D STL format.' },
    { slug: 'pdf-crop', name: 'PDF Crop', category: 'pdf-tools', icon: 'fa-crop', color: 'red', description: 'Crop PDF pages with per-side margin control.' },
    { slug: 'merge-pdf', name: 'Merge PDF', category: 'pdf-tools', icon: 'fa-object-group', color: 'red', description: 'Combine multiple PDFs into one document.' },
    { slug: 'aadhaar-card-print-setting-a4', name: 'Aadhaar Print A4', category: 'special', icon: 'fa-print', color: 'blue', description: 'Print Aadhaar card with proper A4 settings.' },
    { slug: 'ssc-photo-date-adder', name: 'SSC Photo & Date', category: 'special', icon: 'fa-calendar-alt', color: 'blue', description: 'Add date to SSC exam photos professionally.' },
    { slug: 'pan-card-photo', name: 'PAN Card Photo', category: 'special', icon: 'fa-id-card', color: 'orange', description: 'Resize photo to exact PAN card 25×35mm size for NSDL/UTI applications.' },

    // ── Video Tools ──────────────────────────────────────────────
    { slug: 'video-compressor', name: 'Video Compressor', category: 'video-tools', icon: 'fa-compress-arrows-alt', color: 'violet', description: 'Reduce video file size without losing quality.' },
    { slug: 'video-converter', name: 'Video Converter', category: 'video-tools', icon: 'fa-exchange-alt', color: 'violet', description: 'Convert videos between MP4, WebM, and other formats.' },
    { slug: 'video-to-audio', name: 'Video to Audio', category: 'video-tools', icon: 'fa-music', color: 'violet', description: 'Extract audio track from any video file.' },
    { slug: 'video-trimmer', name: 'Video Trimmer', category: 'video-tools', icon: 'fa-cut', color: 'violet', description: 'Trim and cut video clips to the exact length you need.' },
    { slug: 'video-merger', name: 'Video Merger', category: 'video-tools', icon: 'fa-layer-group', color: 'violet', description: 'Merge multiple video clips into one seamless video.' },

    // ── PDF Tools (additions) ────────────────────────────────────
    { slug: 'pdf-to-excel', name: 'PDF to Excel/CSV', category: 'pdf-tools', icon: 'fa-table', color: 'red', description: 'Extract tables from PDF and convert to Excel or CSV.' },
    { slug: 'html-to-pdf', name: 'HTML/Markdown to PDF', category: 'pdf-tools', icon: 'fa-code', color: 'red', description: 'Convert HTML or Markdown text to a styled PDF.' },
    { slug: 'remove-pdf-watermark', name: 'Remove PDF Watermark', category: 'pdf-tools', icon: 'fa-tint-slash', color: 'red', description: 'Remove watermarks from scanned PDF pages.' },
    { slug: 'pdf-password-remover', name: 'PDF Password Remover', category: 'pdf-tools', icon: 'fa-unlock', color: 'red', description: 'Remove password protection from PDF files you own.' },

    // ── Utility Tools ────────────────────────────────────────────
    { slug: 'collage-maker', name: 'Collage Maker', category: 'utility', icon: 'fa-th', color: 'pink', description: 'Create beautiful photo collages with multiple layouts.' },
    { slug: 'favicon-generator', name: 'Favicon Generator', category: 'utility', icon: 'fa-star', color: 'orange', description: 'Generate favicon.ico and PNG icons from any image.' },
    { slug: 'image-metadata-viewer', name: 'Image Metadata Viewer', category: 'utility', icon: 'fa-info-circle', color: 'blue', description: 'View and edit EXIF metadata from images.' },
    { slug: 'color-palette-generator', name: 'Color Palette Generator', category: 'utility', icon: 'fa-palette', color: 'purple', description: 'Pick colors and generate beautiful palettes from images.' },
    { slug: 'worksheet-converter', name: 'Worksheet Converter', category: 'utility', icon: 'fa-file-excel', color: 'green', description: 'Convert between CSV, JSON, and Excel formats.' },
    { slug: 'text-to-handwriting', name: 'Text to Handwriting', category: 'utility', icon: 'fa-pen-fancy', color: 'indigo', description: 'Convert typed text into beautiful handwriting style.' },
    { slug: 'html-table-generator', name: 'HTML Table Generator', category: 'utility', icon: 'fa-border-all', color: 'teal', description: 'Generate HTML or Markdown tables from your data.' },

    // ── Image Editing Tools ──────────────────────────────────────
    { slug: 'combine-images-side-by-side', name: 'Combine Images Side by Side', category: 'image-editing', icon: 'fa-columns', color: 'blue', description: 'Combine two images side by side horizontally online.' },
    { slug: 'add-watermark-to-image', name: 'Add Watermark to Image', category: 'image-editing', icon: 'fa-copyright', color: 'cyan', description: 'Add transparent text or image watermark to photos.' },
    { slug: 'merge-images-vertically', name: 'Merge Images Vertically', category: 'image-editing', icon: 'fa-arrows-alt-v', color: 'blue', description: 'Stack and merge two images vertically online.' },
    { slug: 'blend-two-photos', name: 'Blend Two Photos', category: 'image-editing', icon: 'fa-adjust', color: 'purple', description: 'Blend and mix two photos together with opacity control.' },
    { slug: 'rotate-image-custom-angle', name: 'Rotate Image', category: 'image-editing', icon: 'fa-sync-alt', color: 'green', description: 'Rotate image by any custom angle online.' },
    { slug: 'flip-image-horizontally', name: 'Flip Image Mirror', category: 'image-editing', icon: 'fa-arrows-alt-h', color: 'teal', description: 'Flip image horizontally (mirror) or vertically.' },
    { slug: 'polaroid-photo-effect', name: 'Polaroid Photo Effect', category: 'image-editing', icon: 'fa-camera-retro', color: 'yellow', description: 'Turn any photo into a vintage Polaroid frame online.' },
    { slug: 'add-drop-shadow', name: 'Add Drop Shadow', category: 'image-editing', icon: 'fa-clone', color: 'slate', description: 'Add drop shadow effect to transparent PNG images.' },
    { slug: 'wet-floor-reflection', name: 'Wet Floor Reflection', category: 'image-editing', icon: 'fa-water', color: 'blue', description: 'Add a wet floor mirror reflection effect to images.' },
    { slug: 'zoomed-inset-image', name: 'Zoomed Inset Creator', category: 'image-editing', icon: 'fa-search-plus', color: 'orange', description: 'Create a zoomed inset/magnifier overlay on any image.' },
    { slug: 'instagram-safe-zones', name: 'Instagram Reel Safe Zones', category: 'image-editing', icon: 'fa-mobile-alt', color: 'pink', description: 'Add Instagram Reel safe zone overlay to your image.' },

    // ── Fun Effects ───────────────────────────────────────────────
    { slug: 'meme-generator', name: 'Meme Generator', category: 'fun-effects', icon: 'fa-laugh-squint', color: 'yellow', description: 'Add text and stickers to meme templates and photos.' },
    { slug: 'gif-maker', name: 'GIF Maker', category: 'fun-effects', icon: 'fa-film', color: 'pink', description: 'Create animated GIFs from a series of images.' },
    { slug: 'lego-art-generator', name: 'Lego / Block Art', category: 'fun-effects', icon: 'fa-th', color: 'red', description: 'Convert any image into a blocky Lego-style pixel art.' },
    { slug: 'warhol-poster-effect', name: 'Warhol Pop-Art Effect', category: 'fun-effects', icon: 'fa-palette', color: 'orange', description: 'Generate Andy Warhol style pop-art poster from a photo.' },
    { slug: 'emoji-mosaic', name: 'Emoji Mosaic', category: 'fun-effects', icon: 'fa-smile', color: 'yellow', description: 'Replace image pixels with matching emoji characters.' },
    { slug: 'jigsaw-puzzle-maker', name: 'Jigsaw Puzzle Maker', category: 'fun-effects', icon: 'fa-puzzle-piece', color: 'green', description: 'Slice any image into printable jigsaw puzzle pieces.' },
    { slug: 'face-morph', name: 'Face Morph / Blend', category: 'fun-effects', icon: 'fa-user-friends', color: 'purple', description: 'Blend and morph two faces together into one photo.' },
    { slug: 'sticker-add-virtual', name: 'Sticker Add to Photo', category: 'fun-effects', icon: 'fa-star', color: 'pink', description: 'Add fun stickers, hats, glasses and speech bubbles to photos.' },

    // ── AI Tools ─────────────────────────────────────────────────
    { slug: 'ai-denoiser', name: 'AI Denoiser', category: 'ai-tools', icon: 'fa-wind', color: 'indigo', description: 'Reduce image noise and blur using smart algorithms.' },
    { slug: 'ai-colorizer', name: 'AI Colorizer', category: 'ai-tools', icon: 'fa-fill-drip', color: 'purple', description: 'Colorize black-and-white photos using smart colorization.' },

    // ── Utility (additions) ───────────────────────────────────────
    { slug: 'qr-code-generator', name: 'QR Code Generator', category: 'utility', icon: 'fa-qrcode', color: 'slate', description: 'Generate QR codes with logo inside, custom colors and sizes.' },
]

export const categories = [
    { id: 'modern-formats', name: 'Modern Image Formats', icon: 'fa-bolt', color: 'yellow' },
    { id: 'converters', name: 'Standard Converters', icon: 'fa-exchange-alt', color: 'indigo' },
    { id: 'pdf-tools', name: 'PDF Tools', icon: 'fa-file-pdf', color: 'red' },
    { id: 'editors', name: 'Editors & Utilities', icon: 'fa-wand-magic-sparkles', color: 'purple' },
    { id: 'image-editing', name: 'Image Editing', icon: 'fa-edit', color: 'blue' },
    { id: 'fun-effects', name: 'Fun Effects', icon: 'fa-magic', color: 'pink' },
    { id: 'ai-tools', name: 'AI Tools', icon: 'fa-robot', color: 'indigo' },
    { id: 'special', name: 'Special Tools', icon: 'fa-star', color: 'orange' },
    { id: 'video-tools', name: 'Video Tools', icon: 'fa-video', color: 'violet' },
    { id: 'utility', name: 'Utility Tools', icon: 'fa-tools', color: 'teal' },
]

export const getToolBySlug = (slug) => tools.find(t => t.slug === slug)
export const getToolsByCategory = (catId) => tools.filter(t => t.category === catId)
