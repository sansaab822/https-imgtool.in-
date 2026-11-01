/**
 * Comprehensive, original, high-value editorial articles for imgtool.in (2026 Edition).
 * Each post provides practical technical depth, step-by-step workflows, comparison tables,
 * and genuine real-world guidance without AI fluff.
 */

export const blogPosts = [
    {
        id: 1,
        slug: 'ultimate-guide-to-image-compression-2026',
        title: 'The Comprehensive Guide to Modern Image Compression: WebP, AVIF & JPEG in 2026',
        date: 'March 15, 2026',
        author: 'Sanjeev Kumar (Technical Lead)',
        excerpt: 'Understand the mechanics of lossy vs lossless compression, format efficiency curves between WebP, AVIF and JPEG, and how to hit strict upload KB limits without visual degradation.',
        seoDescription: 'Master modern image compression in 2026. Detailed benchmarks comparing AVIF, WebP, and JPEG, exact target KB algorithms, and Core Web Vitals optimization.',
        coverImage: '/images/tools/image-compressor-example.png',
        content: `
            <h2>Why Image Compression is the Foundation of Web Performance</h2>
            <p>According to the HTTP Archive, images account for over 52% of the average webpage's total payload. In 2026, where Google's Core Web Vitals heavily weight <strong>Largest Contentful Paint (LCP)</strong>—requiring main visual content to render within 2.5 seconds—serving raw, unoptimized images directly destroys search rankings and spikes visitor bounce rates.</p>

            <p>However, image compression is frequently misunderstood. Many creators mistakenly believe compression always ruins image clarity, or they rely on crude online tools that aggressively over-compress photos until faces and text turn into muddy pixel artifacts. True image optimization is the mathematical elimination of redundant data while preserving visual fidelity for human perception.</p>

            <h2>Lossless vs. Lossy Compression: The Technical Difference</h2>
            <p>Every compression algorithm operates under one of two core paradigms:</p>

            <h3>1. Lossless Compression (Statistical Redundancy Elimination)</h3>
            <p>Lossless compression rewrites the binary encoding of an image without altering a single pixel value. It operates similarly to a ZIP archive:</p>
            <ul>
                <li><strong>Metadata Stripping:</strong> Strips non-visual headers such as EXIF camera settings, GPS tags, maker notes, and embedded color profile descriptions (saving 5KB–50KB per file).</li>
                <li><strong>Huffman & Entropy Coding:</strong> Identifies recurring byte patterns and replaces them with shorter bit tokens.</li>
                <li><strong>Best Used For:</strong> Technical schematics, line art, medical imaging, vector-like PNG graphics, and archival photography where mathematical byte parity is required.</li>
            </ul>

            <h3>2. Lossy Compression (Perceptual Quantization)</h3>
            <p>Lossy compression permanently discards subtle visual data that the human eye (the human visual system, or HVS) is biologically incapable of distinguishing at normal viewing distances:</p>
            <ul>
                <li><strong>Chroma Subsampling:</strong> Human eyes possess roughly 120 million rod cells (sensitive to brightness/luminance) but only 6 to 7 million cone cells (sensitive to color/chrominance). Algorithms routinely downsample color channels by 50% (4:2:0 subsampling) with almost zero perceived quality degradation.</li>
                <li><strong>Discrete Cosine Transform (DCT):</strong> High-frequency detail—such as microscopic noise or slight gradients in a clear blue sky—is rounded off into coarser mathematical matrices.</li>
                <li><strong>Result:</strong> Reduces file size by 70% to 90% with imperceptible differences to human readers.</li>
            </ul>

            <h2>Format Efficiency Benchmarks (2026 Data)</h2>
            <p>Selecting the optimal format is just as critical as selecting the compression ratio. The table below illustrates the real-world efficiency of modern codecs when encoding a standard 4000×3000px high-resolution photograph:</p>

            <div class="overflow-x-auto my-6">
                <table class="w-full text-sm text-left border border-slate-200">
                    <thead class="bg-slate-100 font-bold">
                        <tr>
                            <th class="p-3 border-b">Format / Codec</th>
                            <th class="p-3 border-b">Avg. File Size (SSIM 0.95)</th>
                            <th class="p-3 border-b">Browser Support</th>
                            <th class="p-3 border-b">Key Strengths</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                        <tr>
                            <td class="p-3 font-semibold">AVIF (AV1 Image File)</td>
                            <td class="p-3 font-mono text-emerald-600 font-bold">185 KB (-52% vs JPEG)</td>
                            <td class="p-3">94% (Chrome, Safari, Firefox, Edge)</td>
                            <td class="p-3">Superior color depth (10/12-bit HDR), excellent grain retention at low bitrates.</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-semibold">WebP (Google WebP)</td>
                            <td class="p-3 font-mono text-blue-600 font-bold">260 KB (-32% vs JPEG)</td>
                            <td class="p-3">98% (Universal in all modern engines)</td>
                            <td class="p-3">Native alpha transparency support in lossy mode; fast encoding speed.</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-semibold">MozJPEG / Modern JPEG</td>
                            <td class="p-3 font-mono text-slate-700 font-bold">390 KB (Baseline)</td>
                            <td class="p-3">100% (Universal legacy compatibility)</td>
                            <td class="p-3">Opens on every digital frame, operating system, and legacy server in existence.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2>How to Hit Strict Portal Limits (e.g. 20KB, 50KB, 100KB)</h2>
            <p>One of the most frustrating digital tasks is applying for official exams, government portals, or corporate KYC verification where forms strictly enforce upload boundaries like <em>"File size must be between 20KB and 50KB."</em></p>

            <p>Standard compressors force you to guess slider percentages blindly. At 80%, the file is 58KB (rejected); at 70%, it drops to 18KB (also rejected for being below the minimum). To solve this, our free browser-based <a href="/image-compressor" class="text-blue-600 font-bold underline">Image Compressor</a> uses an automated binary search loop in client-side WebAssembly to iteratively calculate the exact mathematical quantization level required to land within your target range on the first attempt.</p>

            <h3>The Golden Workflow for Strict Document Uploads:</h3>
            <ol>
                <li><strong>Crop First, Compress Second:</strong> Never compress an uncropped 12-megapixel smartphone photo down to 30KB. Crop away background clutter using our <a href="/crop-image" class="text-blue-600 font-bold underline">Crop Image Tool</a> first.</li>
                <li><strong>Scale to Display Proportions:</strong> If an application requires a passport photo (typically 350×450px), use the <a href="/image-resizer" class="text-blue-600 font-bold underline">Image Resizer</a> to resize down from 4000px before compressing.</li>
                <li><strong>Verify Text Readability:</strong> If your photo contains scanned text or handwriting, verify that high-contrast strokes remain crisp before submitting.</li>
            </ol>
        `
    },
    {
        id: 2,
        slug: 'heic-vs-jpg-which-is-better',
        title: 'HEIC vs. JPG: The Complete Compatibility & Quality Comparison',
        date: 'March 12, 2026',
        author: 'Sanjeev Kumar (Technical Lead)',
        excerpt: 'Why iPhones default to HEIC, what makes High Efficiency Image Coding superior in color depth and compression, and how to safely convert HEIC to JPG without uploading private photos.',
        seoDescription: 'HEIC vs JPG compared in depth. Learn why Apple uses HEIC, device compatibility on Windows and Android, and how to convert HEIC to JPG securely.',
        coverImage: '/images/tools/image-resizer-example.png',
        content: `
            <h2>The Great Smartphone Photo Dilemma</h2>
            <p>If you own an iPhone (running iOS 11 or newer), your camera has quietly stopped shooting standard JPEGs. Instead, every snap you take is saved with a <code>.heic</code> file extension. Then, the moment you attempt to upload that photo to a government visa application, submit it to university portals, or open it on an older Windows PC, you are greeted with an error message: <em>"Unsupported file format."</em></p>

            <p>What is HEIC, why did Apple adopt it, and when should you convert it to standard JPG?</p>

            <h2>What is the HEIC Format?</h2>
            <p>HEIC stands for <strong>High Efficiency Image Container</strong>. It is the file format standard based on the HEVC (H.265) video codec, developed by the Moving Picture Experts Group (MPEG). Rather than being an entirely new format, it is a container that packages modern compressed image data.</p>

            <h3>The Technical Advantages of HEIC:</h3>
            <ul>
                <li><strong>50% File Size Reduction:</strong> A standard 12MP iPhone photograph captured in JPEG takes approximately 4.5MB of storage. The identical scene saved in HEIC consumes only 1.8MB to 2.2MB at equivalent or superior visual fidelity.</li>
                <li><strong>16-Bit Color Space vs. 8-Bit JPEG:</strong> JPEG is strictly limited to 8-bit color (representing 16.7 million colors). HEIC supports up to 16-bit color depth, capturing over a billion color gradations, eliminating the ugly color banding seen in sunsets and blue skies.</li>
                <li><strong>Image Sequences & Live Photos:</strong> A single HEIC container can hold multiple burst photos, exposure brackets, depth map metadata, and audio tracks in one lightweight file.</li>
            </ul>

            <h2>The Compatibility Matrix: Where HEIC Fails</h2>
            <p>Despite its technical brilliance, HEIC's widespread adoption has been severely hindered by licensing patents and slow enterprise legacy updates:</p>

            <div class="overflow-x-auto my-6">
                <table class="w-full text-sm text-left border border-slate-200">
                    <thead class="bg-slate-100 font-bold">
                        <tr>
                            <th class="p-3 border-b">Platform / Device</th>
                            <th class="p-3 border-b">Native HEIC Support?</th>
                            <th class="p-3 border-b">Notes</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                        <tr>
                            <td class="p-3 font-semibold">Apple Ecosystem (iOS, macOS)</td>
                            <td class="p-3 text-emerald-600 font-bold">100% Native</td>
                            <td class="p-3">Flawless hardware-accelerated rendering.</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-semibold">Windows 10 / 11</td>
                            <td class="p-3 text-amber-600 font-bold">Partial / Add-on Required</td>
                            <td class="p-3">Requires purchasing the "HEVC Video Extensions" from the Microsoft Store for native Photos viewing.</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-semibold">Government & University Portals</td>
                            <td class="p-3 text-red-600 font-bold">No Support (&lt;5%)</td>
                            <td class="p-3">Strictly reject HEIC; form upload validators specifically demand .jpg or .png.</td>
                        </tr>
                        <tr>
                            <td class="p-3 font-semibold">Android 9+</td>
                            <td class="p-3 text-emerald-600 font-bold">Native Support</td>
                            <td class="p-3">Supported natively in Google Photos and modern Samsung/Pixel gallery apps.</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h2>How to Convert HEIC to JPG Without Leaking Privacy</h2>
            <p>When searching for a quick way to convert iPhone photos for an online application, most people click on the first search result, which prompts them to upload their private family photos or identity cards to an unknown cloud server.</p>

            <p>Our dedicated <a href="/heic-to-jpg" class="text-blue-600 font-bold underline">HEIC to JPG Converter</a> executes entirely in your browser using client-side WebAssembly (<code>libheif</code> compiled to JS). Your photos are decoded directly in your computer's RAM and converted to pristine universal JPEGs with zero network data transmission.</p>
        `
    },
    {
        id: 3,
        slug: 'how-to-secure-pdf-files',
        title: 'Client-Side PDF Security & Management: A Practical Privacy Guide',
        date: 'March 8, 2026',
        author: 'Sanjeev Kumar (Technical Lead)',
        excerpt: 'Why cloud-based PDF mergers and splitters represent a severe privacy threat for tax and legal documents, and how browser memory sandboxing allows safe local PDF manipulation.',
        seoDescription: 'Learn how to manage and manipulate PDF documents securely. The dangers of cloud PDF tools and how client-side WebAssembly protects confidential documents.',
        coverImage: '/images/tools/merge-pdf-example.png',
        content: `
            <h2>The Hidden Risk in Everyday PDF Processing</h2>
            <p>PDF (Portable Document Format) is the universal global standard for transmitting sensitive paperwork: tax returns, real estate deeds, audited company balance sheets, medical diagnostic scans, and legal affidavits. Because managing PDFs frequently requires combining receipts or slicing out unwanted pages, millions of users search for free online PDF tools every day.</p>

            <p>What few people realize is what happens behind the scenes on traditional PDF conversion websites. When you drag and drop a 10-page tax return onto a cloud-based PDF merger:</p>
            <ol>
                <li>The complete unencrypted file is uploaded across the internet to a third-party server.</li>
                <li>The remote server saves your document to temporary cloud storage and runs a backend CLI utility.</li>
                <li>The processed file is stored on the server until an automated cron job deletes it (which could be hours or days later).</li>
                <li>If that server has misconfigured storage buckets or is breached, your Social Security number, financial transactions, and home address are completely exposed.</li>
            </ol>

            <h2>The Secure Alternative: Local Client-Side Execution</h2>
            <p>Modern web browsers have evolved into powerful computational environments. Thanks to modern WebAssembly and JavaScript engines, heavy document manipulation no longer requires remote cloud servers.</p>

            <p>IMG Tool's document suite (including <a href="/merge-pdf" class="text-blue-600 font-bold underline">Merge PDF</a>, <a href="/split-pdf" class="text-blue-600 font-bold underline">Split PDF</a>, and <a href="/pdf-crop" class="text-blue-600 font-bold underline">PDF Crop</a>) operates under a strict <strong>Zero-Upload Architectural Principle</strong>:</p>
            <ul>
                <li><strong>Mozilla PDF.js:</strong> Parses the document's binary object stream directly inside your browser tab to render visual thumbnails.</li>
                <li><strong>pdf-lib Engine:</strong> Slices, stitches, and restructures the cross-reference tables (XREF) of the PDF directly in local memory.</li>
                <li><strong>Local Blob Download:</strong> The finished document is generated via an in-memory <code>Blob URL</code>. If you disconnect your Wi-Fi after the page loads, the tool continues to function 100% offline.</li>
            </ul>

            <h2>Essential PDF Management Checklist for Professionals</h2>
            <div class="bg-slate-50 border border-slate-200 rounded-xl p-5 my-6 space-y-3">
                <h4 class="font-bold text-slate-800 text-sm"><i class="fas fa-clipboard-check text-emerald-500 mr-2"></i> Document Security Best Practices</h4>
                <p class="text-xs text-slate-600"><strong>1. Verify Network Calls:</strong> Open your browser's Developer Tools (F12) and check the "Network" tab. When using IMG Tool, notice that clicking Merge or Split produces zero outbound file uploads.</p>
                <p class="text-xs text-slate-600"><strong>2. Redact Before Merging:</strong> Black marker lines drawn on paper can sometimes be revealed through scanner contrast. Always inspect page thumbnails in <a href="/split-pdf" class="text-blue-600 underline">Split PDF</a> to ensure sensitive sections are completely deleted.</p>
                <p class="text-xs text-slate-600"><strong>3. Clean Scanner Borders:</strong> Use <a href="/pdf-crop" class="text-blue-600 underline">PDF Crop</a> to slice away dark scanner borders that waste black printer toner before distributing client documents.</p>
            </div>
        `
    },
    {
        id: 4,
        slug: 'best-image-formats-web-jpeg-vs-png-vs-webp',
        title: 'JPEG vs. PNG vs. WebP vs. AVIF: Choosing the Right Format for Web & Print',
        date: 'March 4, 2026',
        author: 'Sanjeev Kumar (Technical Lead)',
        excerpt: 'A comprehensive technical comparison of raster image formats. Learn when transparency requires PNG, why WebP has replaced JPEG for web delivery, and when AVIF wins.',
        seoDescription: 'Compare JPEG, PNG, WebP, and AVIF. Detailed guide on image formats, transparency handling, compression efficiency, and print requirements.',
        coverImage: '/images/tools/image-converter-example.png',
        content: `
            <h2>The Modern Image Format Landscape</h2>
            <p>Choosing the incorrect image format is one of the most common causes of bloated web pages and rejected document submissions. Save a company logo as a JPEG, and you end up with an ugly white box obscuring your background. Save a photographic portrait as an uncompressed PNG, and your file size balloons from 300KB to 6MB.</p>

            <p>Here is the definitive guide to choosing the right format for every scenario in 2026.</p>

            <h2>1. JPEG (Joint Photographic Experts Group)</h2>
            <p>JPEG has been the dominant photographic standard since 1992. It relies on lossy discrete cosine transform compression, making it exceptionally effective for continuous-tone photographs containing millions of subtle color transitions.</p>
            <ul>
                <li><strong>Best For:</strong> Real-world photography, print submissions (when set to 300 DPI via our <a href="/image-dpi-converter" class="text-blue-600 font-bold underline">Image DPI Converter</a>), and legacy platforms that reject newer web formats.</li>
                <li><strong>Crucial Limitation:</strong> <em>Zero support for transparency.</em> Any transparent pixel is automatically converted to solid white or black.</li>
            </ul>

            <h2>2. PNG (Portable Network Graphics)</h2>
            <p>PNG was engineered as an open-source replacement for GIF. It is a completely lossless format utilizing the Deflate compression algorithm, featuring full 8-bit alpha-channel transparency (256 levels of opacity per pixel).</p>
            <ul>
                <li><strong>Best For:</strong> Screenshots, vector logos, transparent signatures extracted with our <a href="/signature-to-transparent-png" class="text-blue-600 font-bold underline">Signature Extractor</a>, and UI graphics containing sharp high-contrast text.</li>
                <li><strong>Crucial Limitation:</strong> Extremely inefficient for photographs. A camera photo saved as PNG will be 4× to 8× larger than an equivalent WebP.</li>
            </ul>

            <h2>3. WebP (Google Next-Gen Format)</h2>
            <p>Introduced by Google and supported universally by all modern web browsers, WebP provides both lossy and lossless compression. Crucially, WebP supports <strong>transparent alpha channels in lossy mode</strong>, a capability JPEG completely lacks.</p>
            <ul>
                <li><strong>Best For:</strong> The primary default format for modern websites and web apps. Delivers 25%–35% smaller sizes than JPEG at identical visual quality.</li>
                <li><strong>Crucial Limitation:</strong> Some older desktop applications (like older versions of Microsoft Office or legacy photo viewers) cannot open WebP files natively.</li>
            </ul>

            <h2>4. AVIF (AV1 Image File Format)</h2>
            <p>AVIF is the newest open standard, derived from the royalty-free AV1 video codec. It offers the most aggressive compression curves in computer science today, cutting file sizes by up to 50% compared to JPEG while preserving fine grain and HDR highlights.</p>
            <ul>
                <li><strong>Best For:</strong> High-traffic web publishing where saving bandwidth and hitting Google's Core Web Vitals thresholds is top priority.</li>
                <li><strong>Crucial Limitation:</strong> Slower encoding times in web browsers and limited support in desktop image editors without plugins.</li>
            </ul>

            <h2>Quick Decision Matrix</h2>
            <div class="overflow-x-auto my-6">
                <table class="w-full text-sm text-left border border-slate-200">
                    <thead class="bg-slate-100 font-bold">
                        <tr>
                            <th class="p-3 border-b">Your Asset Type</th>
                            <th class="p-3 border-b">Recommended Format</th>
                            <th class="p-3 border-b">Recommended IMG Tool Utility</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                        <tr>
                            <td class="p-3 font-semibold">Handwritten Signature / Transparent Logo</td>
                            <td class="p-3 text-emerald-600 font-bold">PNG</td>
                            <td class="p-3"><a href="/signature-to-transparent-png" class="text-blue-600 underline">Signature to Transparent PNG</a></td>
                        </tr>
                        <tr>
                            <td class="p-3 font-semibold">Government / Exam Passport Photo</td>
                            <td class="p-3 text-blue-600 font-bold">JPEG (White Background)</td>
                            <td class="p-3"><a href="/passport-size-photo" class="text-blue-600 underline">Passport Photo Maker</a></td>
                        </tr>
                        <tr>
                            <td class="p-3 font-semibold">High-Traffic Website Hero Image</td>
                            <td class="p-3 text-indigo-600 font-bold">WebP or AVIF</td>
                            <td class="p-3"><a href="/image-converter" class="text-blue-600 underline">Universal Image Converter</a></td>
                        </tr>
                        <tr>
                            <td class="p-3 font-semibold">Academic Journal / Print Publication</td>
                            <td class="p-3 text-purple-600 font-bold">JPEG (300 DPI)</td>
                            <td class="p-3"><a href="/image-dpi-converter" class="text-blue-600 underline">Image DPI Converter</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `
    },
    {
        id: 5,
        slug: 'resize-images-social-media-platforms-2025',
        title: 'Social Media & Online Document Image Sizing Guide (2026 Edition)',
        date: 'February 28, 2026',
        author: 'Sanjeev Kumar (Technical Lead)',
        excerpt: 'The complete dimension and aspect ratio reference for 2026. Covers Instagram safe zones, LinkedIn header cropping behavior, YouTube banners, and official ID specifications.',
        seoDescription: 'Updated 2026 social media image dimensions cheat sheet. Exact pixel specifications for Instagram, LinkedIn, Facebook, YouTube, and government application photos.',
        coverImage: '/images/tools/social-resizer-example.png',
        content: `
            <h2>Why Aspect Ratios Matter More Than Pixel Dimensions</h2>
            <p>Every major digital platform uses algorithmic compression and automated cropping containers. If you upload a horizontal 16:9 photo to an Instagram grid post, Instagram forces it into a square (1:1) or vertical (4:5) frame, slicing off the sides and cutting off heads and critical branding text.</p>

            <p>To ensure your visual content displays with razor-sharp clarity without unexpected cropping, bookmark this verified 2026 dimension reference.</p>

            <h2>1. Instagram Specifications (2026)</h2>
            <p>Instagram has heavily shifted toward vertical screen real estate on mobile devices:</p>
            <ul>
                <li><strong>Feed Portrait Post (Maximum Real Estate):</strong> <code>1080 × 1350 pixels</code> (4:5 Aspect Ratio). This captures 25% more screen space than a square post, dramatically boosting engagement.</li>
                <li><strong>Feed Square Post:</strong> <code>1080 × 1080 pixels</code> (1:1 Aspect Ratio).</li>
                <li><strong>Stories &amp; Reels (Full Screen):</strong> <code>1080 × 1920 pixels</code> (9:16 Aspect Ratio). Keep text within the middle 1080×1420px zone to avoid overlap with profile handles and caption overlays.</li>
                <li><strong>Profile Picture:</strong> <code>320 × 320 pixels</code> (Rendered as a circle; keep focal face centered).</li>
            </ul>

            <h2>2. LinkedIn Dimensions (Personal &amp; Company Pages)</h2>
            <p>LinkedIn banners behave notoriously differently between desktop screens and mobile apps:</p>
            <ul>
                <li><strong>Personal Profile Background Banner:</strong> <code>1584 × 396 pixels</code> (4:1 Aspect Ratio). <em>Crucial Tip:</em> On desktop, your circular profile avatar overlaps the bottom-left corner. Always place headline text and company logos on the right half of the banner.</li>
                <li><strong>Company Page Cover Banner:</strong> <code>1128 × 191 pixels</code>.</li>
                <li><strong>Shared Feed Post Graphic:</strong> <code>1200 × 627 pixels</code> (1.91:1) or <code>1080 × 1080 pixels</code>.</li>
            </ul>

            <h2>3. YouTube Visual Assets</h2>
            <ul>
                <li><strong>Channel Header Art:</strong> <code>2560 × 1440 pixels</code>. The guaranteed "Safe Zone" that displays across TVs, desktops, and smartphones is the central <code>1546 × 423 pixel</code> rectangle.</li>
                <li><strong>Video Thumbnail:</strong> <code>1280 × 720 pixels</code> (Minimum 640px width; 16:9 ratio; under 2MB).</li>
            </ul>

            <h2>4. Official Government &amp; Identity Document Standards</h2>
            <p>Unlike social media where a 10px discrepancy is forgiven, government exam portals and visa databases automatically reject photographs that fail exact specifications:</p>

            <div class="overflow-x-auto my-6">
                <table class="w-full text-sm text-left border border-slate-200">
                    <thead class="bg-slate-100 font-bold">
                        <tr>
                            <th class="p-3 border-b">Document / Portal</th>
                            <th class="p-3 border-b">Exact Dimensions</th>
                            <th class="p-3 border-b">File Size Window</th>
                            <th class="p-3 border-b">Dedicated Tool</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-200">
                        <tr>
                            <td class="p-3 font-semibold">Standard International Passport</td>
                            <td class="p-3 font-mono">35 × 45 mm (300 DPI)</td>
                            <td class="p-3">Under 200 KB</td>
                            <td class="p-3"><a href="/passport-size-photo" class="text-blue-600 underline">Passport Photo Maker</a></td>
                        </tr>
                        <tr>
                            <td class="p-3 font-semibold">US Visa / Passport</td>
                            <td class="p-3 font-mono">2 × 2 inches (51 × 51 mm)</td>
                            <td class="p-3">Under 240 KB</td>
                            <td class="p-3"><a href="/passport-size-photo" class="text-blue-600 underline">Passport Photo Maker</a></td>
                        </tr>
                        <tr>
                            <td class="p-3 font-semibold">Indian PAN Card (NSDL/UTI)</td>
                            <td class="p-3 font-mono">25 × 35 mm (213 × 213 px)</td>
                            <td class="p-3">Under 50 KB</td>
                            <td class="p-3"><a href="/pan-card-photo" class="text-blue-600 underline">PAN Card Photo Resizer</a></td>
                        </tr>
                        <tr>
                            <td class="p-3 font-semibold">SSC / IBPS Official Signature</td>
                            <td class="p-3 font-mono">140 × 60 pixels</td>
                            <td class="p-3">10 KB – 20 KB</td>
                            <td class="p-3"><a href="/signature-to-transparent-png" class="text-blue-600 underline">Signature to PNG Maker</a></td>
                        </tr>
                        <tr>
                            <td class="p-3 font-semibold">Aadhaar Card A4 Sheet Print</td>
                            <td class="p-3 font-mono">85.6 × 54 mm (ISO ID-1)</td>
                            <td class="p-3">A4 Grid Layout</td>
                            <td class="p-3"><a href="/aadhaar-card-print-setting-a4" class="text-blue-600 underline">Aadhaar Print A4 Tool</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `
    }
]

export const getPostBySlug = (slug) => {
    return blogPosts.find((post) => post.slug === slug)
}
