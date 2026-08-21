export const COMPRESS_CONTENT = {
    'compress-image-20kb-30kb': {
        intro: "Targeting the narrow 20KB to 30KB file size range can be tricky. This exact bracket is frequently required by Indian recruitment portals (such as IBPS and SBI) for signature and thumb impression uploads. Our tool accurately targets 25KB as the sweet spot, ensuring your image is neither rejected for being too small nor too large.",
        practicalGuidance: "For files this small, the original dimensions matter. If you try to compress a 4K photograph down to 25KB, the result will be highly pixelated or blurred. It is best to first crop the image closely to the subject (like a face or signature) and optionally reduce its dimensions before compression.",
        whenItMatters: "Portals with a 20-30KB strict range use automated validators. An image of 19.9KB or 30.1KB will trigger an immediate error. Aiming for the middle (25KB) guarantees successful processing.",
        commonMistakes: [
            { mistake: "Starting with a massive image", detail: "Compressing a 10MB photo straight to 25KB causes severe quality loss. Use our Image Resizer first to bring the dimensions down." },
            { mistake: "Using PNG instead of JPG", detail: "PNG is a lossless format and struggles to compress to such tiny sizes. Switching to JPG almost always provides better quality at 25KB." }
        ],
        faqs: [
            { q: "What if my compressed image is still rejected?", a: "Ensure your image is exactly in JPG format, as some portals strictly forbid PNG or WebP even if the file size is correct." },
            { q: "Why did my image become blurry?", a: "Squeezing complex details into 25KB reduces visual data. To preserve clarity, crop out unnecessary background before compressing." }
        ]
    },
    'compress-image-to-30kb': {
        intro: "A 30KB file size limit is a standard constraint for many digital application forms, particularly for candidate signatures, thumbprints, or small passport photographs. Our utility compresses your image to fit comfortably under this 30KB threshold while minimizing visual artifacts.",
        practicalGuidance: "To achieve the best results at 30KB, select the JPG format. JPG uses a compression algorithm optimized for photographs and smooth gradients. For line art or text (like a scanned signature), PNG might work, but it often exceeds the 30KB limit, making JPG the safer choice.",
        whenItMatters: "Websites enforce a 30KB maximum to save server storage and ensure fast loading times for thousands of applicants. Exceeding this limit, even by 1KB, usually results in a 'File Too Large' error.",
        commonMistakes: [
            { mistake: "Leaving too much white space", detail: "Extra white space around a signature wastes precious kilobytes. Crop the image tightly before compressing." },
            { mistake: "Ignoring the minimum size requirement", detail: "Many portals that ask for 'Max 30KB' also have a hidden minimum (like 10KB). Make sure the final output isn't too small." }
        ],
        faqs: [
            { q: "Can I compress any image to 30KB?", a: "Yes, but large or highly detailed photos will lose significant quality. It's best used for small dimensions like signatures (140x60px)." },
            { q: "Is the final size exactly 30KB?", a: "The tool targets slightly below 30KB (usually around 28-29KB) to ensure it securely passes strict upload validators." }
        ]
    },
    'compress-image-to-40kb': {
        intro: "Compressing your image to 40KB is often required for secondary document uploads, state-level examination forms, and specific academic portals. This tool helps you seamlessly shrink your photograph or scanned document to meet the 40KB requirement.",
        practicalGuidance: "At 40KB, you have slightly more leeway for image quality compared to 20KB or 30KB limits. However, if your source image is larger than 2 Megabytes, you may still notice compression artifacts. Consider reducing the physical dimensions (width and height) to around 400x400 pixels to maintain better clarity.",
        whenItMatters: "Admissions and state job portals use 40KB as a middle-ground limit—small enough to store cheaply, but large enough to keep faces recognizable on admit cards.",
        commonMistakes: [
            { mistake: "Uploading a dark photo", detail: "Dark areas often compress poorly and show 'blocky' artifacts. Ensure your original photo is well-lit before compressing to 40KB." },
            { mistake: "Using third-party messaging apps first", detail: "Images forwarded through messaging apps are already heavily compressed. Re-compressing them to 40KB can ruin the quality completely. Always use the original camera file." }
        ],
        faqs: [
            { q: "Will the dimensions of my photo change?", a: "No. This tool only reduces the file size (in kilobytes). The width and height in pixels remain exactly as you uploaded them." },
            { q: "How do I know if the quality is acceptable?", a: "Always use the preview feature before downloading. Ensure facial features or text remain legible." }
        ]
    },
    'compress-image-to-60kb': {
        intro: "A 60KB limit is a generous size for passport photographs but a strict one for scanned documents like ID proofs or marksheets. Whether you are applying for a university or updating a profile, this tool efficiently compresses your image to just under 60KB.",
        practicalGuidance: "If you are compressing a scanned document (like an Aadhaar card or marksheet) to 60KB, legibility is your main concern. Convert the image to grayscale before compression if color isn't strictly required, as black-and-white images compress much more efficiently.",
        whenItMatters: "Many public service commissions (like WBCS) specify file sizes up to 60KB for candidate photographs. A file measuring 60.5KB will be instantly rejected by their database validators.",
        commonMistakes: [
            { mistake: "Compressing high-resolution scans", detail: "Scanning a document at 600 DPI and trying to compress it to 60KB will result in illegible text. Scan at 150-200 DPI instead." },
            { mistake: "Not verifying text readability", detail: "Always zoom in on the compressed image to ensure that crucial information like names, dates, and ID numbers can still be read clearly." }
        ],
        faqs: [
            { q: "Is 60KB enough for a clear ID proof?", a: "Yes, provided the original image is cropped to just the card itself and scanned at a reasonable resolution (like 150 DPI)." },
            { q: "Can I use PNG for 60KB compression?", a: "It is possible for simple images, but JPG is strongly recommended for scanned documents or photos to stay under 60KB without losing too much detail." }
        ]
    },
    'compress-image-to-70kb': {
        intro: "The 70KB limit is specifically used by certain specialized application portals and older legacy systems. This tool safely compresses your digital photo or scanned file to meet the 70KB requirement without unnecessary quality degradation.",
        practicalGuidance: "At 70KB, you can comfortably maintain a high-quality passport photo. The algorithm will dynamically find the best JPEG quality setting (usually between 60% and 85%) that fits just under the 70KB threshold.",
        whenItMatters: "Targeting exactly 70KB ensures you utilize the maximum allowed data limit for your image, resulting in the best possible clarity for the reviewer or automated OCR systems.",
        commonMistakes: [
            { mistake: "Uploading full-page documents", detail: "A full A4 page compressed to 70KB will likely have unreadable text. Crop the document to only the necessary sections." },
            { mistake: "Repeated compression", detail: "Avoid compressing an image to 70KB, downloading it, and compressing it again. This causes 'generation loss' and ruins the file." }
        ],
        faqs: [
            { q: "How accurate is the 70KB targeting?", a: "The tool aims for a target size of around 68-69KB, ensuring it safely passes validators checking for '< 70KB'." },
            { q: "What if my image is already smaller than 70KB?", a: "If your image is, for example, 45KB, you do not need to compress it further unless a strict minimum is also required." }
        ]
    },
    'compress-image-to-80kb': {
        intro: "Compressing an image to 80KB provides an excellent balance between low file size and high visual clarity. This limit is frequently seen in various corporate job applications and academic registration portals for uploading profile pictures.",
        practicalGuidance: "Because 80KB allows for a decent amount of image data, you can often leave your photo at higher resolutions (e.g., 600x600 pixels) and still achieve a crisp result. If the tool struggles to reach 80KB without blurring, simply crop out unnecessary background elements.",
        whenItMatters: "When an application allows up to 80KB, they expect a photo that is clear enough to be printed on a physical ID card or admit card without pixelation.",
        commonMistakes: [
            { mistake: "Ignoring format guidelines", detail: "Even if your image is perfectly compressed to 80KB, uploading a WebP file to a system that only accepts JPG will cause a failure." },
            { mistake: "Adding borders or frames", detail: "Decorative borders increase file size unnecessarily. Keep the image clean and focused on the subject." }
        ],
        faqs: [
            { q: "Will an 80KB photo look pixelated on a computer screen?", a: "Generally, no. For a standard passport-size dimensions, 80KB is more than enough data to look perfectly sharp on digital displays." },
            { q: "Can I use this for signatures?", a: "Yes, but 80KB is usually much larger than necessary for a signature. Check if the portal has a lower maximum limit (like 20KB) for signatures." }
        ]
    },
    'compress-image-under-100kb': {
        intro: "The 'Under 100KB' requirement is one of the most universal standards on the internet. From government portals like UPSC to private job boards, keeping your photo or document below 100KB ensures fast uploads and universal compatibility.",
        practicalGuidance: "When aiming for under 100KB, our tool targets approximately 90KB. This provides a safety buffer. You can usually maintain excellent quality for photographs and acceptable quality for half-page scanned documents (like an ID card front and back).",
        whenItMatters: "Most web servers impose a strict 100KB (or 102,400 bytes) limit to prevent server overload. An image that is exactly 100.1KB will be rejected.",
        commonMistakes: [
            { mistake: "Saving as PNG for photos", detail: "PNG files are often 3x to 5x larger than JPGs. A photo that is 300KB in PNG format will easily drop below 100KB when converted to JPG." },
            { mistake: "Using an uncropped phone photo", detail: "Modern smartphone cameras take 5MB+ photos. Always crop the photo down to the subject before attempting to compress it under 100KB." }
        ],
        faqs: [
            { q: "Is 100KB good enough to print?", a: "For small prints like a passport photo or an ID card, yes. For a full A4 print, 100KB will look blurry." },
            { q: "Why did the tool output a 92KB file instead of 100KB?", a: "We target slightly below the absolute maximum to guarantee it passes the strictest portal validators, which sometimes calculate kilobytes differently." }
        ]
    },
    'compress-image-to-120kb': {
        intro: "A 120KB limit is typically utilized for uploading high-quality digital signatures, complex thumb impressions, or slightly larger scanned documents (like a graduation certificate). This tool compresses your files while retaining maximum readability.",
        practicalGuidance: "At 120KB, you can safely use PNG format if your image is mostly text or line art (like a signature). For photographs or complex scans with many colors, JPG remains the most efficient choice.",
        whenItMatters: "When uploading certificates or marksheets, the reviewing officer must be able to read the grades and seal. Utilizing the full 120KB allowance ensures that tiny text remains legible.",
        commonMistakes: [
            { mistake: "Compressing heavily textured backgrounds", detail: "Backgrounds like wooden tables or bedsheets behind a scanned document consume a massive amount of data. Crop them out so the 120KB budget is spent entirely on the document itself." },
            { mistake: "Using low contrast originals", detail: "A faded signature compressed to 120KB might vanish completely. Enhance the contrast of the original image before compressing." }
        ],
        faqs: [
            { q: "Can a full A4 marksheet fit into 120KB?", a: "Yes, but you should convert it to grayscale (black and white) and ensure it is cropped perfectly to the edges of the paper." },
            { q: "Is the compression lossless?", a: "If you choose PNG, the process is lossless but may struggle to hit the size limit. If you choose JPG, the compression is 'lossy' but optimized to minimize visual degradation." }
        ]
    },
    'compress-image-to-150kb': {
        intro: "Compressing to 150KB is often the requirement for full-page scanned documents, detailed resumes, or high-resolution profile photos on professional networks. This generous limit allows for excellent image fidelity.",
        practicalGuidance: "Since 150KB offers a large data allowance, focus on maintaining the physical dimensions of your document. A resolution of 800x1200 pixels usually fits comfortably within 150KB while keeping all text sharp and easily readable.",
        whenItMatters: "Portals requesting 150KB files usually deal with critical verification documents. A blurry upload could lead to application rejection. Our tool prioritizes quality, searching for the best possible setting that respects the 150KB boundary.",
        commonMistakes: [
            { mistake: "Over-compressing unnecessarily", detail: "If a portal asks for 'Max 150KB', do not try to compress it down to 30KB just to be safe. You will lose quality. Let the tool target 140-150KB for the best result." },
            { mistake: "Scanning in full color", detail: "Color data takes up significant space. If the document is just black text on white paper, convert it to black-and-white to keep the file size low and the text sharp." }
        ],
        faqs: [
            { q: "Will this tool change my file from PDF to JPG?", a: "No, this specific tool only accepts and outputs image files (JPG, PNG, WebP). If you need to process a PDF, use our PDF tools instead." },
            { q: "How can I ensure my document remains readable?", a: "Always use the on-screen preview. If the text looks blurry, try cropping the image to remove unnecessary margins, then compress again." }
        ]
    }
}
