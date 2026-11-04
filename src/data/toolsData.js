export const tools = [
    // ── Core Image Editors ──────────────────────────────────────
    { slug: 'batch-watermark-images', name: 'Batch Image Watermark Studio', category: 'editors', icon: 'fa-stamp', color: 'blue', description: 'Apply custom text, copyright presets, or PNG logo watermarks across multiple photos in batch. 100% in-browser.' },
    { slug: 'image-resizer', name: 'Image Resizer', category: 'editors', icon: 'fa-expand', color: 'blue', description: 'Resize images to custom dimensions, social media presets, or exact pixel sizes.' },
    { slug: 'image-compressor', name: 'Image Compressor', category: 'editors', icon: 'fa-compress-arrows-alt', color: 'orange', description: 'Reduce image file size with visual quality control or target exact KB limits.' },
    { slug: 'crop-image', name: 'Crop Image', category: 'editors', icon: 'fa-crop', color: 'pink', description: 'Crop images with aspect ratio presets and Rule of Thirds composition grid.' },
    { slug: 'bg-remover', name: 'Background Remover', category: 'editors', icon: 'fa-eraser', color: 'purple', description: 'Isolate subjects and remove image backgrounds automatically in your browser.' },
    { slug: 'image-enhancer', name: 'Image Enhancer', category: 'editors', icon: 'fa-sliders-h', color: 'yellow', description: 'Improve clarity, detail, sharpness, and contrast with category-tuned filters.' },
    { slug: 'image-to-art', name: 'Image to Art', category: 'editors', icon: 'fa-palette', color: 'purple', description: 'Transform everyday photographs into pencil sketches, watercolors, and artistic paintings.' },

    // ── Document & Official ID Photo Resizers (Protected & Unified) ──
    { slug: 'passport-size-photo', name: 'Passport Size Photo Maker', category: 'document-id-tools', icon: 'fa-id-card', color: 'blue', description: 'Format passport and visa photos with official country dimensions and printable A4 grid.' },
    { slug: 'pan-card-photo', name: 'PAN Card Photo Resizer', category: 'document-id-tools', icon: 'fa-id-card', color: 'orange', description: 'Resize photo and signature to exact PAN card 25×35mm (213×213px) for NSDL and UTIITSL.' },
    { slug: 'aadhaar-card-print-setting-a4', name: 'Aadhaar Card A4 Print Setting', category: 'document-id-tools', icon: 'fa-print', color: 'blue', description: 'Format and arrange Aadhaar card front and back at exact ISO ID-1 card dimensions on A4 paper.' },
    { slug: 'signature-to-transparent-png', name: 'Signature to Transparent PNG', category: 'document-id-tools', icon: 'fa-file-signature', color: 'teal', description: 'Extract signature from paper photo, remove paper background, and format for exam portals.' },
    { slug: 'government-photo-resizer', name: 'Government & Exam Photo Resizer', category: 'document-id-tools', icon: 'fa-graduation-cap', color: 'indigo', description: 'Resize photo and signature to exact portal specs for SSC, UPSC, IBPS, NEET, and Police exams.' },
    { slug: 'ssc-photo-date-adder', name: 'SSC Photo & Date Adder', category: 'document-id-tools', icon: 'fa-calendar-alt', color: 'blue', description: 'Add candidate name and date of photo overlay to meet official SSC recruitment guidelines.' },

    // ── PDF Tools (Protected & Expanded) ──────────────────────────
    { slug: 'pdf-crop', name: 'PDF Crop', category: 'pdf-tools', icon: 'fa-crop', color: 'red', description: 'Crop PDF page margins with interactive visual selection or precise millimeter margin controls.' },
    { slug: 'merge-pdf', name: 'Merge PDF', category: 'pdf-tools', icon: 'fa-object-group', color: 'red', description: 'Combine multiple PDF documents into one with thumbnail preview and drag-and-drop reordering.' },
    { slug: 'split-pdf', name: 'Split PDF & Extract Pages', category: 'pdf-tools', icon: 'fa-scissors', color: 'red', description: 'Split PDF into individual pages, extract custom page ranges, or delete unwanted sheets.' },
    { slug: 'pdf-to-jpg', name: 'PDF to JPG', category: 'pdf-tools', icon: 'fa-file-image', color: 'red', description: 'Extract high-resolution JPG images from individual PDF document pages.' },
    { slug: 'jpg-to-pdf', name: 'JPG to PDF Converter', category: 'pdf-tools', icon: 'fa-file-pdf', color: 'red', description: 'Combine JPG, PNG, and WebP images into a clean, printable PDF document.' },
    { slug: 'pdf-to-excel', name: 'PDF to Excel / CSV', category: 'pdf-tools', icon: 'fa-table', color: 'red', description: 'Detect and extract tabular data from PDF files directly into CSV and Excel spreadsheets.' },
    { slug: 'pdf-password-remover', name: 'PDF Password Remover', category: 'pdf-tools', icon: 'fa-unlock', color: 'red', description: 'Remove owner restriction passwords from PDF files you own without cloud server uploads.' },

    // ── 3D & Maker Utilities ─────────────────────────────────────
    { slug: '3d-text-to-stl-generator', name: '3D Text to STL Generator', category: 'special', icon: 'fa-cube', color: 'purple', description: 'Generate custom 3D text models and export print-ready binary STL files for 3D printers.' },
    { slug: 'svg-to-stl', name: 'SVG to STL Converter', category: 'special', icon: 'fa-cube', color: 'purple', description: 'Extrude 2D vector SVG graphics and logos into 3D printable STL meshes.' },

    // ── Developer & Privacy Utilities ─────────────────────────────
    { slug: 'image-dpi-converter', name: 'Image DPI Converter (300/600 DPI)', category: 'utility', icon: 'fa-print', color: 'indigo', description: 'Convert image resolution to 300 DPI or 600 DPI losslessly without re-compressing pixels.' },
    { slug: 'image-metadata-viewer', name: 'Image Metadata Viewer & EXIF Stripper', category: 'utility', icon: 'fa-info-circle', color: 'teal', description: 'Inspect hidden EXIF camera tags and strip GPS metadata losslessly to protect privacy.' },
    { slug: 'favicon-generator', name: 'Favicon & PWA Icon Generator', category: 'utility', icon: 'fa-star', color: 'orange', description: 'Generate all web favicon, iOS Apple Touch, and Android PWA icon sizes from a single logo.' },
    { slug: 'qr-code-generator', name: 'QR Code Generator', category: 'utility', icon: 'fa-qrcode', color: 'slate', description: 'Create high-resolution QR codes with custom colors and center logo support.' },

    // ── High-Demand Format Converters ─────────────────────────────
    { slug: 'image-converter', name: 'Universal Image Converter', category: 'converters', icon: 'fa-exchange-alt', color: 'indigo', description: 'Convert images between WebP, JPG, PNG, AVIF, BMP, and GIF formats in batch.' },
    { slug: 'heic-to-jpg', name: 'HEIC to JPG Converter', category: 'converters', icon: 'fa-mobile-alt', color: 'blue', description: 'Convert Apple iPhone HEIC and HEIF photos to universal JPG format in your browser.' },
    { slug: 'webp-to-jpg', name: 'WebP to JPG Converter', category: 'converters', icon: 'fa-file-code', color: 'emerald', description: 'Convert modern WebP images to standard JPG format for maximum software compatibility.' },
    { slug: 'png-to-jpg', name: 'PNG to JPG Converter', category: 'converters', icon: 'fa-image', color: 'blue', description: 'Convert PNG images with custom background color fill to lightweight JPG format.' },
    { slug: 'jpg-to-png', name: 'JPG to PNG Converter', category: 'converters', icon: 'fa-image', color: 'purple', description: 'Convert JPG photos to lossless PNG format for editing and graphics work.' },
    { slug: 'avif-to-jpg', name: 'AVIF to JPG Converter', category: 'converters', icon: 'fa-bolt', color: 'yellow', description: 'Convert next-generation AVIF images to universally viewable JPG format.' },

    // ── Directory Navigation ──────────────────────────────────────
    { slug: 'all-image-converters', name: 'All Tools Directory', category: 'editors', icon: 'fa-th-large', color: 'slate', description: 'Explore the full suite of client-side image and PDF utilities.' },
]

export const categories = [
    { id: 'editors', name: 'Image Editors', icon: 'fa-wand-magic-sparkles', color: 'blue' },
    { id: 'pdf-tools', name: 'PDF Utilities', icon: 'fa-file-pdf', color: 'red' },
    { id: 'document-id-tools', name: 'Passport & Exam Resizers', icon: 'fa-id-badge', color: 'teal' },
    { id: 'special', name: '3D & Maker Tools', icon: 'fa-cube', color: 'purple' },
    { id: 'utility', name: 'Developer & Privacy Utilities', icon: 'fa-shield-halved', color: 'indigo' },
    { id: 'converters', name: 'Image Converters', icon: 'fa-exchange-alt', color: 'emerald' },
]

export const getToolBySlug = (slug) => tools.find(t => t.slug === slug)
export const getToolsByCategory = (catId) => tools.filter(t => t.category === catId)
