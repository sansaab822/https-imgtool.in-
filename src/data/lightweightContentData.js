export const lightweightContentData = {
    // ── Core Image Editors (Batch 1) ──
    'image-resizer': {
        title: 'Image Resizer',
        whatItDoes: 'Changes the dimensions of your image to exact pixel sizes using local browser processing.',
        whenToUse: 'Use this when a website requires a specific width and height, or when preparing photos for social media headers and posts.',
        howToUse: 'Upload your image, choose a social media preset (like Instagram or YouTube), or enter a custom width and height. You can select the output format (JPG, PNG, or WebP).',
        tips: 'The tool offers three modes: "Fit" scales the image to fit the box without cutting anything off, "Fill" fills the box but crops the edges, and "Stretch" ignores proportions to perfectly match the dimensions.'
    },
    'image-compressor': {
        title: 'Image Compressor',
        whatItDoes: 'Reduces the file size of your images entirely in your browser without uploading to a server.',
        whenToUse: 'Use this to speed up your website, save storage space, or shrink photos to meet strict upload limits (like "under 200KB").',
        howToUse: 'Upload one or multiple images. You can use the Quality slider (Light, Balanced, Maximum) or specify an exact target size (e.g., 200 KB). Download the results individually or as a ZIP file.',
        limitations: 'Compression involves a trade-off. Extreme compression will introduce visible blocky artifacts. Use the before/after slider on the results to ensure the quality remains acceptable.'
    },
    'crop-image': {
        title: 'Crop Image',
        whatItDoes: 'Allows you to cut away the outer edges of a photo to reframe the subject.',
        whenToUse: 'Use this to remove distractions, change the composition, or force a photo into a specific shape like a square (1:1).',
        howToUse: 'Drag the handles on the image to select the crop area. You can use the "Transform" tools to rotate or flip the image before cropping.',
        tips: 'Click one of the ratio buttons (like 16:9 or 1:1) to lock the crop box proportions. Select "Free" if you want to draw a custom shape without ratio constraints.'
    },
    'bg-remover': {
        title: 'Background Remover',
        whatItDoes: 'Isolates the main subject of your photo and deletes the background, leaving it transparent or replacing it with a color.',
        whenToUse: 'Essential for creating clean product photos for e-commerce, making YouTube thumbnails, or designing graphics.',
        howToUse: 'Upload your photo and wait for the AI to process it. Once removed, you can download it as a transparent PNG, or select a solid color or gradient background before downloading.',
        limitations: 'The tool uses a lightweight WebAssembly AI model that runs locally in your browser, meaning your image data is not uploaded to any external server. However, an active internet connection is required the first time you use it so the browser can download the necessary model files. It may occasionally struggle with complex edges like loose hair against a similar-colored background.'
    },
    'image-enhancer': {
        title: 'Image Enhancer',
        whatItDoes: 'Applies automated multi-scale sharpening, denoising, and color correction based on the type of photo.',
        whenToUse: 'Use this to quickly improve dull, slightly soft, or poorly lit photos without needing professional editing software.',
        howToUse: 'Upload your image and select the category that best matches it (Portrait, Object, Scenery, Pets, or Text). The tool will automatically calculate the best brightness, contrast, and sharpening filters for that category.',
        limitations: 'This tool filters and improves existing pixels; it cannot miraculously restore destroyed details, unblur severe motion blur, or increase the actual resolution of the image.'
    },

    // ── Image Editing Tools ──
    'combine-images-side-by-side': {
        title: 'Combine Images Side by Side',
        whatItDoes: 'This tool stitches two images together horizontally to create a single side-by-side comparison image.',
        whenToUse: 'Use this to create "Before and After" shots, comparing two products, or making split-screen collages for social media.',
        howToUse: 'Upload your left image and right image. The tool automatically resizes them to match heights, then merges them side-by-side. You can download the combined photo.',
        tips: 'For the most realistic results, try to use images with similar lighting and subject framing so the side-by-side comparison looks natural.'
    },
    'add-watermark-to-image': {
        title: 'Add Watermark to Photo',
        whatItDoes: 'Allows you to overlay a custom text or logo watermark onto your images to protect your copyright.',
        whenToUse: 'Essential for photographers, artists, and creators who want to share their work online without it being stolen or used uncredited.',
        howToUse: 'Upload your base image, then enter your watermark text or upload a transparent PNG logo. Adjust the opacity (transparency) and position before generating.',
        limitations: 'Remember that watermarks placed near the very edge can be easily cropped out. Place it near the center or across key details for better protection.'
    },
    'merge-images-vertically': {
        title: 'Merge Images Vertically',
        whatItDoes: 'Stacks two images on top of each other, creating a single tall image.',
        whenToUse: 'Useful for creating tall infographics, stacking memes, or combining screenshots of long documents.',
        howToUse: 'Upload the top image and the bottom image. The tool will adjust their widths to match and stitch them vertically.'
    },
    'blend-two-photos': {
        title: 'Blend Two Photos Together',
        whatItDoes: 'Mixes two images by overlaying them and adjusting their transparency (opacity).',
        whenToUse: 'Use this to create artistic double exposures, ghost effects, or subtle background textures.',
        tips: 'Using a high-contrast black and white photo as the base and a colorful texture (like a galaxy or forest) on top usually yields a strong double-exposure result.'
    },
    'rotate-image-custom-angle': {
        title: 'Rotate Image by Custom Angle',
        whatItDoes: 'Rotates your image precisely by any degree (not just 90 or 180 degrees).',
        whenToUse: 'Use this to straighten crooked horizons in landscape photos or to create angled artistic compositions.',
        howToUse: 'Upload your photo and use the slider to adjust the rotation angle from 0 to 360 degrees. The background space created by rotation will be transparent (if saved as PNG) or white (if saved as JPG).'
    },
    'flip-image-horizontally': {
        title: 'Flip or Mirror Image',
        whatItDoes: 'Flips your image horizontally (left-to-right mirror effect) or vertically (upside down).',
        whenToUse: 'Useful for correcting inverted selfies, fixing text that reads backward, or creating symmetrical mirror art.',
        tips: 'If you flip an image that contains text (like a t-shirt logo), the text will become unreadable. Use this tool mainly for portraits or landscapes.'
    },
    'polaroid-photo-effect': {
        title: 'Polaroid Frame Effect',
        whatItDoes: 'Wraps your photo in a classic vintage Polaroid-style white frame with bottom padding.',
        whenToUse: 'Adds a nostalgic, retro aesthetic to your photos for Instagram feeds, scrapbooking, or printing.',
        howToUse: 'The tool automatically scales your image and applies the characteristic thick white border and shadow. You can optionally add a caption to the bottom.'
    },
    'add-drop-shadow': {
        title: 'Add Drop Shadow to PNG',
        whatItDoes: 'Applies a clean, customizable drop shadow to objects with transparent backgrounds.',
        whenToUse: 'Use this for e-commerce product shots, UI elements, or graphic design assets that need to pop off the page.',
        limitations: 'Your uploaded image MUST have a transparent background (PNG format) for the shadow to wrap around the object. If you upload a JPG, the shadow will just apply to the rectangular border.'
    },
    'wet-floor-reflection': {
        title: 'Wet Floor Reflection Effect',
        whatItDoes: 'Creates a fading, mirrored reflection below your subject, simulating a polished glass or wet floor.',
        whenToUse: 'Commonly used in professional product photography (like electronics or jewelry) to give a premium, studio-lit feel.',
        tips: 'This effect works best on objects isolated on transparent backgrounds (PNG). A flat-bottomed subject will look most realistic.'
    },
    'zoomed-inset-image': {
        title: 'Zoomed Inset Magnifier',
        whatItDoes: 'Creates a small circular overlay that magnifies a specific detail of your main image.',
        whenToUse: 'Use this for product tutorials, highlighting a hidden detail, or showing macro textures in a larger scene.',
        howToUse: 'Upload your image, click on the area you want to magnify, and adjust the zoom level. The tool will place a magnifier lens effect over that spot.'
    },
    'instagram-safe-zones': {
        title: 'Instagram Reel Safe Zones Checker',
        whatItDoes: 'Overlays a template showing the UI elements (like, comment, share buttons, and captions) of Instagram Reels/TikTok.',
        whenToUse: 'Use this before posting a Reel or short video to ensure your important text or subject isn\'t covered by the app\'s interface.',
        tips: 'Keep all crucial text within the center bounds. The bottom 20% and right edge are usually covered by captions and engagement buttons.'
    },

    // ── Fun Effects ──
    'meme-generator': {
        title: 'Free Online Meme Generator',
        whatItDoes: 'Adds classic Impact-font text with black strokes to any image, letting you create custom memes.',
        whenToUse: 'Whenever you want to create a quick reaction image or internet joke to share on social media.',
        tips: 'Keep your text short and punchy. The classic meme format uses all-caps white text with a black outline, which ensures readability on both dark and light backgrounds.'
    },
    'gif-maker': {
        title: 'Animated GIF Maker',
        whatItDoes: 'Combines a sequence of still images into a moving, animated GIF file.',
        whenToUse: 'Use this to create stop-motion animations, simple slideshows, or reaction GIFs from burst photos.',
        limitations: 'GIFs are restricted to 256 colors. Complex photos may appear slightly grainy when converted to GIF, which is normal for the format. For high-quality video, consider MP4 instead.'
    },
    'lego-art-generator': {
        title: 'Lego / Block Art Generator',
        whatItDoes: 'Pixelates your photo and applies a 3D stud texture to make it look like a Lego or toy block mosaic.',
        whenToUse: 'A fun filter for avatars, profile pictures, or turning landscapes into blocky 8-bit art.',
        howToUse: 'Upload any image and adjust the block size. Smaller blocks give more detail, while larger blocks give a more stylized, abstract toy look.'
    },
    'warhol-poster-effect': {
        title: 'Andy Warhol Pop-Art Effect',
        whatItDoes: 'Transforms a single photo into a 2x2 grid with high-contrast, wildly different color palettes.',
        whenToUse: 'Use this to create retro, 1960s Pop Art posters from portraits or simple objects.',
        tips: 'This effect works optimal on high-contrast portraits with simple, uncluttered backgrounds.'
    },
    'emoji-mosaic': {
        title: 'Emoji Mosaic Generator',
        whatItDoes: 'Replaces the pixels of your image with hundreds of tiny emojis that closely match the original colors.',
        whenToUse: 'Creates fascinating, interactive-looking art pieces where zooming in reveals individual emojis.',
        limitations: 'Because emojis are relatively large, small or highly detailed text in your original image will become completely unreadable. Use bold, simple subjects.'
    },
    'jigsaw-puzzle-maker': {
        title: 'Jigsaw Puzzle Maker',
        whatItDoes: 'Overlays a jigsaw puzzle cut pattern onto your photo, dividing it into puzzle pieces.',
        whenToUse: 'Use this to create custom printable puzzles, social media grids, or visual effects.',
        tips: 'You can choose between different puzzle complexities (e.g., 4x4 vs 10x10). The downloaded image can be printed on cardstock and physically cut along the lines.'
    },
    'face-morph': {
        title: 'Face Morph & Blend',
        whatItDoes: 'Aligns and blends two different faces together into a single composite face.',
        whenToUse: 'Fun for seeing what a combination of two celebrities, or you and a family member, would look like.',
        howToUse: 'Upload two forward-facing portraits. For the best result, both subjects should be facing the camera straight-on with similar expressions.'
    },
    'sticker-add-virtual': {
        title: 'Add Virtual Stickers to Photo',
        whatItDoes: 'Lets you drag, drop, scale, and rotate fun clip-art stickers (like sunglasses, hats, or speech bubbles) onto your photo.',
        whenToUse: 'Use this to create party photos, hide a photobomber, or add comic-book flair to a picture.',
        tips: 'You can use the rotate handle on the stickers to angle them Accurately onto a tilted head.'
    },

    // ── AI Tools ──
    'ai-denoiser': {
        title: 'AI Image Denoiser & Smoother',
        whatItDoes: 'Uses advanced canvas smoothing and noise-reduction algorithms to remove grain and color noise from low-light photos.',
        whenToUse: 'Use this on photos taken at night, in dark rooms, or with high ISO settings that appear grainy or speckled.',
        limitations: 'Heavy denoising can sometimes soften fine details (like hair or fabric textures). Adjust the strength slider to find the balance between smooth skin and retaining detail.'
    },
    'ai-colorizer': {
        title: 'Black & White Photo Colorizer',
        whatItDoes: 'Applies neural colorization patterns to infer and add color to grayscale or vintage black-and-white photos.',
        whenToUse: 'Bringing old family archives, historical photos, or artistic B&W shots to life with realistic color tones.',
        limitations: 'AI colorization is an educated guess based on shading and textures; it cannot know the true historical colors (e.g., the exact color of a vintage dress).'
    },
    'ai-old-photo-restorer': {
        title: 'Old Photo Restorer',
        whatItDoes: 'Cleans up scratches, dust, and sepia fading from vintage photographs using intelligent canvas filters.',
        whenToUse: 'Use this when digitizing old physical photo albums that have suffered from wear and tear over the decades.',
        howToUse: 'Scan or take a high-quality, glare-free picture of your old photo first. Upload it here, and the tool will attempt to balance the contrast and smooth out minor scratches.'
    }
};
