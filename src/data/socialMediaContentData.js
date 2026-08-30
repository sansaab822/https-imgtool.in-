export const SOCIAL_CONTENT = {
    'whatsapp-dp-resize': {
        intro: "Your WhatsApp display picture (DP) is displayed as a small circular crop in chats and contact lists. WhatsApp renders it at approximately 500×500 pixels. Uploading a square image at this size ensures the circular crop is clean, with no unexpected cutoff of your face or important details.",
        whyMatters: "WhatsApp auto-crops every DP into a circle. If your original photo is rectangular or off-center, the circular mask can cut off important parts of the image — like the top of your head or a companion standing beside you. A properly centered 500×500px square gives you full control over what appears inside that circle.",
        preparationTips: [
            "Center the subject (face or logo) in the middle of the frame, leaving some margin on all sides for the circular crop.",
            "Avoid placing important elements (text, faces) in the corners — they will be cropped by the circular mask.",
            "Use a clean, uncluttered background so the small thumbnail remains readable at chat-list size.",
            "JPG format works well for photos; use PNG only if your DP is a logo with a transparent or solid background."
        ],
        commonMistakes: [
            { mistake: "Using a group photo", detail: "At DP size, individual faces become too small to recognize. Use a tightly cropped headshot or a simple graphic instead." },
            { mistake: "Placing text near the edges", detail: "The circular crop will cut off any text near the corners of a square image. Keep text well within the center area." }
        ],
        faqs: [
            { q: "Will this affect my WhatsApp image quality?", a: "WhatsApp applies its own compression after upload. By starting with a sharp 500×500px image, you minimize the quality loss from that re-compression." },
            { q: "Can I use a landscape photo as my WhatsApp DP?", a: "Yes, but use the 'Cover' fit mode so the image fills the 500×500 square. The top and bottom edges of your landscape photo will be cropped." }
        ],
        relatedTools: [
            { href: "/crop-image", label: "Crop Image" },
            { href: "/image-compressor", label: "Compress Image" }
        ]
    },
    'whatsapp-status-photo-resize': {
        intro: "WhatsApp Status photos are displayed in a full-screen vertical format on mobile devices. The recommended resolution is 750×1334 pixels (a 9:16 portrait aspect ratio), which matches the display area on most smartphones. Uploading at this exact size prevents WhatsApp from auto-scaling or cropping your image.",
        whyMatters: "When a status image doesn't match the vertical aspect ratio, WhatsApp either adds blurred background bars or zooms and crops the image to fill the screen. This often cuts off parts of the image or reduces sharpness. A correctly sized 750×1334px image fills the entire status screen cleanly.",
        preparationTips: [
            "Use a vertical (portrait) orientation photo for the best result.",
            "Leave some breathing room at the top and bottom — the status bar and reply area may overlap your image on some devices.",
            "High-contrast images and bold text work best since status viewers typically glance quickly.",
            "Avoid very dark images — they can blend into the status UI on dark-mode devices."
        ],
        commonMistakes: [
            { mistake: "Uploading a landscape photo", detail: "A horizontal photo will appear with large blurred bars above and below it, wasting most of the screen space." },
            { mistake: "Placing important text at the very bottom", detail: "The 'Reply' bar overlaps the bottom portion of the status on most phones, hiding any text placed there." }
        ],
        faqs: [
            { q: "Why does my status photo look blurry?", a: "WhatsApp compresses status images. Starting with a larger, sharper source image (at 750×1334px) helps retain more detail after compression." },
            { q: "Can I use this for WhatsApp Business status?", a: "Yes. WhatsApp Business uses the same status display dimensions as regular WhatsApp." }
        ],
        relatedTools: [
            { href: "/whatsapp-dp-resize", label: "WhatsApp DP Resize" },
            { href: "/image-compressor", label: "Compress Image" }
        ]
    },
    'instagram-profile-photo-resize': {
        intro: "Instagram displays profile photos at 110×110 pixels on the app. Though Instagram stores a larger version internally, what users actually see in the feed, stories ring, and profile header is this small circular thumbnail. Uploading a sharp, well-centered 110×110px image ensures your profile picture looks crisp at the displayed size.",
        whyMatters: "Instagram crops every profile photo into a circle. At just 110×110px, there is very little room for detail. A blurry, off-center, or cluttered profile image will look messy at this tiny size. Preparing your image at the exact dimensions lets you control precisely what appears inside that circle.",
        preparationTips: [
            "Use a tightly cropped headshot or a simple logo — detailed backgrounds disappear at 110px.",
            "Center the subject precisely, accounting for the circular mask that removes corners.",
            "Choose high-contrast colors so your profile picture stands out in the feed and stories ring.",
            "PNG format is preferred for logos; JPG works fine for photographs."
        ],
        commonMistakes: [
            { mistake: "Using a full-body photo", detail: "At 110×110px, a full-body shot makes the face nearly invisible. Crop tightly to the head and shoulders." },
            { mistake: "Including fine text", detail: "Text that is readable on a large image becomes completely illegible at 110px. Avoid text in profile photos." }
        ],
        faqs: [
            { q: "Should I upload a higher resolution image to Instagram?", a: "Instagram will resize any image to fit its display. Uploading at exactly 110×110px gives you pixel-level control over the final circular crop." },
            { q: "Why does my Instagram profile pic look blurry?", a: "If your source image is much larger, Instagram's downscaling may produce blur. A pre-resized 110×110px image avoids that extra processing." }
        ],
        relatedTools: [
            { href: "/instagram-post-resize", label: "Instagram Post Resize" },
            { href: "/crop-image", label: "Crop Image" }
        ]
    },
    'instagram-post-resize': {
        intro: "Instagram's classic square post format uses 1080×1080 pixels. While Instagram now supports portrait and landscape posts, the square format remains the most consistent across feed layouts, previews, and the profile grid. This tool resizes your photo to the exact 1080×1080px square.",
        whyMatters: "Your profile grid on Instagram shows all posts as square thumbnails regardless of the original orientation. A post designed as a square ensures the most important part of your image is always visible in the grid preview without unexpected cropping.",
        preparationTips: [
            "Keep the main subject centered — Instagram's grid preview crops from the center of the image.",
            "Use vibrant, high-contrast visuals since Instagram compresses uploads; high-contrast images survive compression better.",
            "If adding text overlays, ensure they are large enough to read on mobile screens (most Instagram usage is on phones).",
            "Use 'Cover' mode for landscape photos to fill the square, or 'Fit' mode to show the entire image with background padding."
        ],
        commonMistakes: [
            { mistake: "Ignoring the grid preview", detail: "A tall portrait post looks great individually but may get awkwardly cropped in the profile grid. Design with both views in mind." },
            { mistake: "Using very low-resolution source images", detail: "Instagram displays feed posts at 1080px wide. Source images below 600px will appear noticeably pixelated." }
        ],
        faqs: [
            { q: "Does Instagram still prefer square posts?", a: "Instagram supports multiple aspect ratios, but the profile grid always shows square thumbnails. Square posts give you the most control over how they appear everywhere." },
            { q: "What format should I use for Instagram posts?", a: "JPG at high quality (90%+) is ideal for photographs. Use PNG if your post has text with sharp edges or logos with flat colors." }
        ],
        relatedTools: [
            { href: "/instagram-reels-thumbnail-resize", label: "Reels Thumbnail Resize" },
            { href: "/instagram-profile-photo-resize", label: "Instagram Profile Photo" }
        ]
    },
    'instagram-reels-thumbnail-resize': {
        intro: "Instagram Reels uses a 9:16 vertical format at 1080×1920 pixels. This is the same aspect ratio as a full-screen smartphone display. A custom Reels thumbnail at this exact size ensures your cover image fills the screen without any black bars or unexpected cropping when viewers browse the Reels tab.",
        whyMatters: "The Reels tab shows thumbnails in a portrait grid. If your thumbnail doesn't match the 9:16 ratio, Instagram auto-crops it from the center, potentially cutting off text overlays, faces, or the most engaging part of your content. A purpose-designed 1080×1920px thumbnail lets you control the first impression.",
        preparationTips: [
            "Keep key text and faces in the center 50% of the image — the top and bottom areas may be partially obscured by UI elements.",
            "Use bold, readable fonts — small text disappears on the tiny grid previews in the Reels tab.",
            "Bright, high-saturation thumbnails tend to attract more taps in the Reels grid.",
            "Avoid critical content in the bottom 15% — Instagram's Reels interface overlaps audio info, likes and comment icons there."
        ],
        commonMistakes: [
            { mistake: "Using a horizontal image", detail: "A landscape image will have large black bars above and below it in the vertical Reels format, looking unprofessional." },
            { mistake: "Placing the main subject at the very top or bottom", detail: "Instagram's UI elements (username, music info, action buttons) overlay the edges. The safe zone is the center portion of the screen." }
        ],
        faqs: [
            { q: "Can I change my Reels thumbnail after posting?", a: "Yes, Instagram allows you to edit the cover image of a Reel after publishing. Prepare a custom 1080×1920px thumbnail and select it as the cover." },
            { q: "Is this the same size as Instagram Stories?", a: "Yes, both Stories and Reels use the 1080×1920px (9:16) format for full-screen vertical content." }
        ],
        relatedTools: [
            { href: "/instagram-post-resize", label: "Instagram Post Resize" },
            { href: "/image-resizer", label: "General Image Resizer" }
        ]
    },
    'facebook-profile-photo-resize': {
        intro: "Facebook displays profile photos at 170×170 pixels on desktop and 128×128 pixels on mobile. The image is always rendered as a circle. Uploading a clean, centered 170×170px image gives you the best control over how your profile appears across all Facebook surfaces — timeline, comments, Messenger, and search results.",
        whyMatters: "Your Facebook profile photo appears in dozens of places: next to every comment you make, in Messenger threads, in search results, and on your timeline. At 170px, details are small. A blurry or poorly cropped photo can make your profile look neglected, especially in professional or business contexts.",
        preparationTips: [
            "Use a simple headshot or logo — complex backgrounds become noise at 170px.",
            "Center the face or logo precisely, accounting for the circular crop that removes all four corners.",
            "Ensure good lighting and contrast so the small thumbnail remains recognizable.",
            "For business pages, your logo should fill most of the 170×170 space with minimal padding."
        ],
        commonMistakes: [
            { mistake: "Using the same image as your cover photo", detail: "Cover photos are wide landscape images. Directly using one as a profile photo results in a heavily cropped, unrecognizable result." },
            { mistake: "Forgetting the mobile view", detail: "Facebook shows profile photos at 128px on phones, even smaller than desktop. Test that your image remains clear at that size." }
        ],
        faqs: [
            { q: "Does Facebook accept PNG profile photos?", a: "Yes. PNG works well for logos with flat colors. For photographs, JPG typically produces smaller files with comparable visual quality." },
            { q: "What happens if I upload a larger image?", a: "Facebook will resize it. However, their resizing may not center the crop where you want it. Pre-sizing to 170×170px gives you full control." }
        ],
        relatedTools: [
            { href: "/facebook-cover-photo-resize", label: "Facebook Cover Photo" },
            { href: "/crop-image", label: "Crop Image" }
        ]
    },
    'facebook-cover-photo-resize': {
        intro: "The Facebook cover photo spans the full width of your profile or page at 851×315 pixels on desktop. On mobile, the visible area is narrower (approximately 640×360px), and the image is center-cropped. This tool resizes your image to the standard 851×315px desktop dimensions.",
        whyMatters: "The cover photo is the largest visual element on any Facebook profile or page. An incorrectly sized cover image will either appear blurry (if too small) or get awkwardly auto-cropped (if the wrong aspect ratio). The desktop and mobile crops are different, so the center of the image is the only guaranteed safe zone.",
        preparationTips: [
            "Keep important elements (text, faces, logos) in the center — the left edge is partially covered by the profile picture on desktop.",
            "Avoid placing text or critical details in the leftmost 170px on desktop, as your profile photo overlaps that area.",
            "Design for both desktop (851×315) and mobile (center crop) by keeping key content in the middle third.",
            "Use a simple, bold visual — fine details and small text are not readable at cover photo size on most screens."
        ],
        commonMistakes: [
            { mistake: "Placing important text on the left side", detail: "Your profile picture overlaps the lower-left area of the cover photo on desktop. Any text or faces there will be hidden." },
            { mistake: "Using a portrait-oriented image", detail: "A tall image will be heavily cropped to fit the wide 851×315 landscape format, likely cutting off most of the content." }
        ],
        faqs: [
            { q: "Why does my cover photo look different on phone vs desktop?", a: "Facebook crops the cover photo differently on mobile — it shows a taller, narrower center section. Design important content for the center of the image." },
            { q: "What file size should my Facebook cover be?", a: "Facebook recommends keeping it under 100KB for fastest loading. Use our Image Compressor if your file is too large after resizing." }
        ],
        relatedTools: [
            { href: "/facebook-profile-photo-resize", label: "Facebook Profile Photo" },
            { href: "/image-compressor", label: "Compress Image" }
        ]
    },
    'linkedin-profile-photo-resize': {
        intro: "LinkedIn displays profile photos at 400×400 pixels. Your LinkedIn photo appears alongside every post, comment, connection request, and message you send. In a professional networking context, a polished, correctly sized headshot can influence first impressions from recruiters, clients, and colleagues.",
        whyMatters: "LinkedIn is a professional platform where profile photos serve as your visual identity. A pixelated, poorly cropped, or incorrectly sized photo can undermine credibility. LinkedIn renders the photo as a circle, so precise centering at 400×400px ensures your headshot looks clean and professional.",
        preparationTips: [
            "Use a professional headshot with a neutral or light background — busy backgrounds distract at small sizes.",
            "Frame the shot from the shoulders up, with your face occupying roughly 60-70% of the frame area.",
            "Ensure even, professional lighting — LinkedIn photos often appear in search results and emails at very small sizes.",
            "Dress as you would for the role you're targeting — your LinkedIn photo is effectively your digital first impression."
        ],
        commonMistakes: [
            { mistake: "Using a casual selfie", detail: "LinkedIn is a professional network. A beach selfie or party photo may hurt credibility with recruiters and business contacts." },
            { mistake: "Including other people in the frame", detail: "Your profile photo should contain only you. Group photos make it unclear who the profile belongs to." }
        ],
        faqs: [
            { q: "Does LinkedIn crop the photo into a circle?", a: "Yes. LinkedIn displays all profile photos as circles. Center your face in the square frame so the circular crop looks natural." },
            { q: "What background works best for LinkedIn?", a: "A solid, neutral-colored background (white, light gray, soft blue) keeps the focus on your face and looks professional across all devices." }
        ],
        relatedTools: [
            { href: "/linkedin-banner-resize", label: "LinkedIn Banner Resize" },
            { href: "/crop-image", label: "Crop Image" }
        ]
    },
    'linkedin-banner-resize': {
        intro: "The LinkedIn banner (background photo) sits behind your profile photo at the top of your profile page. Its recommended size is 1584×396 pixels — a very wide, thin landscape format. A custom banner is an opportunity to showcase your professional brand, company, or area of expertise.",
        whyMatters: "The default gray LinkedIn banner is a missed opportunity. A custom banner immediately signals professionalism and intentionality. However, if the image isn't sized correctly, LinkedIn will crop it unpredictably, potentially cutting off text, logos, or other important elements.",
        preparationTips: [
            "Include your job title, company name, or a professional tagline — but keep text large and in the center.",
            "Use brand colors consistently with your other professional materials for a cohesive look.",
            "Avoid small text — the banner is displayed at varying widths across desktop, tablet, and mobile.",
            "Keep the most important content in the center 60% of the image — edges may be cropped on different screen sizes."
        ],
        commonMistakes: [
            { mistake: "Placing text at the very bottom", detail: "Your profile photo and name overlap the bottom-left area of the banner on desktop. Anything placed there will be hidden." },
            { mistake: "Using a busy photograph with no clear focal point", detail: "At 1584×396px, the banner is extremely wide and thin. Complex scenes become confusing at this aspect ratio. Use simple, bold visuals." }
        ],
        faqs: [
            { q: "Will my LinkedIn banner look the same on mobile?", a: "No. Mobile devices show a taller crop of the center portion. Always preview your banner on both desktop and mobile after uploading." },
            { q: "What file format is best for LinkedIn banners?", a: "JPG works well for photographic banners. If your banner uses flat colors and sharp text (like a brand graphic), PNG will keep edges crisper." }
        ],
        relatedTools: [
            { href: "/linkedin-profile-photo-resize", label: "LinkedIn Profile Photo" },
            { href: "/image-resizer", label: "General Image Resizer" }
        ]
    },
    'twitter-profile-photo-resize': {
        intro: "Twitter (now X) displays profile photos at 400×400 pixels, rendered as a circle. Your profile photo appears next to every tweet, reply, retweet, and DM. On a fast-scrolling timeline, a clear and distinctive 400×400px profile image helps followers instantly recognize your posts.",
        whyMatters: "On Twitter/X, users scroll quickly through hundreds of tweets. Your profile photo is one of the primary ways people identify your posts at a glance. A blurry, generic, or incorrectly cropped photo makes your account less recognizable and can reduce engagement.",
        preparationTips: [
            "Use a distinctive, high-contrast image — it needs to be recognizable at timeline size (about 48px).",
            "Center the subject tightly within the frame, accounting for the circular crop.",
            "For personal accounts, a clear headshot works best. For brands, use your logo with minimal padding.",
            "Avoid trendy filters that reduce contrast — they make the small thumbnail harder to identify."
        ],
        commonMistakes: [
            { mistake: "Using a dark image on dark mode", detail: "Many Twitter/X users use dark mode. A dark profile photo blends into the dark background and becomes nearly invisible." },
            { mistake: "Including your username as text in the photo", detail: "Your @handle already appears next to your photo. Adding it to the image wastes the limited visual space." }
        ],
        faqs: [
            { q: "Does Twitter/X still use circular profile photos?", a: "Yes. As of the latest interface, profile photos are displayed as circles. Prepare your image accordingly with center-focused composition." },
            { q: "What happens to animated GIF profile pictures?", a: "Twitter/X previously supported animated profile pictures but this feature has been modified over time. A static 400×400px image is the most reliable option." }
        ],
        relatedTools: [
            { href: "/crop-image", label: "Crop Image" },
            { href: "/image-compressor", label: "Compress Image" }
        ]
    },
    'youtube-channel-art-resize': {
        intro: "YouTube Channel Art (banner) uses a maximum canvas of 2560×1440 pixels, but the visible area varies dramatically across devices — from a thin strip on desktop to a taller crop on TV screens. The guaranteed safe zone where content is always visible is only 1235×338 pixels in the center. This tool resizes your image to the full 2560×1440px canvas.",
        whyMatters: "YouTube's channel banner is the most prominent visual branding element on your channel page. Because it displays at different crops on TVs, desktops, tablets, and phones, an improperly designed banner will show critical text or imagery on one device but hide it on another.",
        preparationTips: [
            "Design all critical content (channel name, tagline, schedule) within the center 1235×338px safe area.",
            "Use the outer areas for decorative elements that can be cropped without losing meaning.",
            "Test your banner on multiple devices after uploading — YouTube provides a preview tool during upload.",
            "Avoid fine text or detailed imagery in the edges — they may be cropped entirely on mobile."
        ],
        commonMistakes: [
            { mistake: "Placing important text in the corners", detail: "The corners of the 2560×1440 canvas are only visible on TV displays. Desktop and mobile users will never see content placed there." },
            { mistake: "Using an image smaller than 2048×1152", detail: "YouTube requires a minimum of 2048×1152px. Smaller images will be rejected during upload." }
        ],
        faqs: [
            { q: "What is the YouTube banner safe area?", a: "The safe area is approximately 1235×338 pixels centered within the 2560×1440 canvas. All text and logos should be placed within this region to be visible on all devices." },
            { q: "Can I use a photograph as channel art?", a: "Yes, but keep in mind the extreme landscape aspect ratio (16:9). A standard photograph may need creative cropping or a graphic overlay to fill the space meaningfully." }
        ],
        relatedTools: [
            { href: "/image-resizer", label: "General Image Resizer" },
            { href: "/crop-image", label: "Crop Image" }
        ]
    }
}
