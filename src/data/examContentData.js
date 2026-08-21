/**
 * examContentData.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Genuinely unique, exam-specific content for each Government Photo Resizer page.
 *
 * Each entry provides:
 *   intro       — Exam-specific opening paragraph (NOT a generic tool description)
 *   authority   — Conducting body name
 *   portalNote  — What portal / registration system is used
 *   requirements — Structured verified requirements table data
 *   whyMatters  — Unique paragraph on why specs matter for THIS exam
 *   preparationTips — Exam-specific photo preparation guidance
 *   commonMistakes  — Realistic mistakes specific to this exam context
 *   faqs        — 2–4 genuinely unique FAQs per exam
 *   relatedTools — Contextual internal links
 *   verificationNote — Disclaimer about checking official sources
 *
 * IMPORTANT:
 *   - Requirements are based on commonly observed portal specifications.
 *   - Where official sources are publicly documented, those are referenced.
 *   - Users are always advised to verify with the latest official notification.
 * ─────────────────────────────────────────────────────────────────────────────
 */

const EXAM_CONTENT = {

    'ssc-cgl-photo-resizer': {
        intro: 'SSC CGL (Combined Graduate Level) is one of India\'s most competitive exams conducted by the Staff Selection Commission for Group B and Group C posts across central government ministries. The online application through ssc.gov.in requires candidates to upload a scanned passport-size photograph that meets strict dimensional and file size criteria. Incorrect photo specifications are among the top reasons for application form rejection during the document verification stage.',
        authority: 'Staff Selection Commission (SSC)',
        portalNote: 'Registration is done on ssc.gov.in. The one-time registration (OTR) system stores your photo for use across multiple SSC exams.',
        requirements: [
            { label: 'Dimensions', value: '275 × 354 pixels' },
            { label: 'File Size', value: '20 KB – 50 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or light-coloured' },
            { label: 'Recency', value: 'Taken within last 3 months' },
            { label: 'Face Coverage', value: 'Face should cover about 50–75% of the frame' },
        ],
        whyMatters: 'SSC\'s OTR (One-Time Registration) system validates uploaded photos at the pixel level. A photo that is 276×354 or 275×355 can trigger a validation error. The system also checks file size — anything above 50KB is rejected outright. Since SSC CGL registration windows are typically short (2–3 weeks), getting rejected at the photo upload stage wastes valuable application time.',
        preparationTips: [
            'Get a fresh passport-size photo taken against a plain white background at any studio. Ask for the soft copy in maximum resolution.',
            'Ensure your face is centred, eyes are open, and ears are visible. Avoid wearing dark glasses or hats.',
            'If you\'re using a self-taken photo, use natural daylight near a window with a white wall behind you.',
            'SSC requires the same photo across CGL, CHSL, MTS, and GD if registered via OTR — prepare one good photo that meets 275×354 specs.',
        ],
        commonMistakes: [
            { mistake: 'Using a mobile selfie without cropping', detail: 'Phone cameras produce images in 3:4 or 16:9 ratios. SSC CGL requires a specific 275:354 aspect ratio. An uncropped selfie will be stretched or squeezed.' },
            { mistake: 'Photo with coloured or cluttered background', detail: 'Photos taken against coloured walls, curtains, or outdoor backgrounds are commonly rejected during verification.' },
            { mistake: 'Exceeding 50KB after compression', detail: 'High-resolution studio photos are typically 200KB+. Simply resizing without proper compression will still exceed the limit.' },
            { mistake: 'Uploading the same photo for photo and signature fields', detail: 'The signature upload has different dimensions (140×60px). Mixing up the two uploads is a common error.' },
        ],
        faqs: [
            { q: 'Is the SSC CGL photo specification the same for all SSC exams?', a: 'Most SSC exams (CGL, CHSL, MTS, CPO) now use the OTR system with 275×354px photo specs. However, signature dimensions differ. Always verify from the specific exam notification on ssc.gov.in.' },
            { q: 'Can I use the same photo for SSC CGL Tier 1 and Tier 2?', a: 'Yes. Once uploaded through OTR, the same photo is used across all tiers of the exam. You don\'t need to re-upload unless SSC asks for an update.' },
            { q: 'My photo was accepted during registration but rejected at document verification. Why?', a: 'The online system only checks dimensions and file size. At document verification, the examiner also checks photo recency, face visibility, background colour, and whether the photo matches your physical appearance.' },
        ],
        relatedTools: [
            { href: '/ssc-signature-resizer', label: 'SSC Signature Resizer (140×60px)' },
            { href: '/ssc-photo-date-adder', label: 'SSC Photo Date Stamp Adder' },
            { href: '/image-compressor', label: 'Image Compressor' },
        ],
        verificationNote: 'Photo specifications listed above are based on commonly observed requirements across recent SSC CGL notification cycles. SSC may update specifications — always verify from the latest notification on ssc.gov.in before uploading.',
    },

    'ssc-chsl-photo-signature-resizer': {
        intro: 'SSC CHSL (Combined Higher Secondary Level) recruits for LDC, DEO, PA/SA, and Sorting Assistant posts. The application process on ssc.gov.in requires uploading both a photograph and a scanned signature. This tool helps you resize your passport-size photo to the exact CHSL specification. For the signature, use the dedicated SSC Signature Resizer tool linked below.',
        authority: 'Staff Selection Commission (SSC)',
        portalNote: 'Applied through ssc.gov.in using the OTR (One-Time Registration) system. Both photo and signature are uploaded during registration.',
        requirements: [
            { label: 'Photo Dimensions', value: '275 × 354 pixels' },
            { label: 'Photo File Size', value: '20 KB – 50 KB' },
            { label: 'Signature Dimensions', value: '140 × 60 pixels (separate upload)' },
            { label: 'Signature File Size', value: '10 KB – 20 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White for photo; white paper for signature' },
        ],
        whyMatters: 'CHSL requires two separate uploads — photo and signature. The portal validates each independently. A common problem is accidentally compressing the signature below 10KB (making it unreadable) or uploading the photo in the signature field. Since CHSL is a 10+2 level exam with a large number of applicants, the registration window often sees server load issues, making it important to have your documents ready before the deadline rush.',
        preparationTips: [
            'Prepare your photo (275×354px) and signature (140×60px) as two separate files before starting the application.',
            'For the signature, sign on white paper with a black or dark blue pen, photograph it, and then resize.',
            'Avoid using digital/typed signatures — SSC requires a hand-written signature scan.',
            'Name your files clearly (e.g., "photo_chsl.jpg" and "signature_chsl.jpg") to avoid uploading the wrong file.',
        ],
        commonMistakes: [
            { mistake: 'Mixing up photo and signature uploads', detail: 'The form has separate upload buttons for photo and signature. Uploading a 275×354 photo in the 140×60 signature field (or vice versa) will cause a dimension mismatch error.' },
            { mistake: 'Signature on coloured or lined paper', detail: 'Sign on plain white unlined paper. Ruled notebook pages with blue/red lines may cause rejection during document verification.' },
            { mistake: 'Photo too dark or backlit', detail: 'Photos taken with a window or light source behind you create silhouette effects. Face should be evenly lit.' },
        ],
        faqs: [
            { q: 'Do I need to upload both photo and signature for SSC CHSL?', a: 'Yes. SSC CHSL requires both a passport-size photograph (275×354px, 20–50KB) and a scanned signature (140×60px, 10–20KB). Both are mandatory for application submission.' },
            { q: 'Can I update my CHSL photo after submitting the form?', a: 'Once the application is submitted, photo changes are generally not allowed. SSC may open a correction window — check the official notice. This is why it\'s important to upload the correct photo the first time.' },
            { q: 'Is the CHSL photo specification different from CGL?', a: 'No. Both SSC CGL and CHSL use the same OTR system with 275×354px photo specs and 140×60px signature specs.' },
        ],
        relatedTools: [
            { href: '/ssc-signature-resizer', label: 'SSC Signature Resizer (140×60px)' },
            { href: '/ssc-cgl-photo-resizer', label: 'SSC CGL Photo Resizer' },
            { href: '/image-compressor', label: 'Image Compressor' },
        ],
        verificationNote: 'Verify the latest photo and signature specifications from the official SSC CHSL notification on ssc.gov.in before uploading your application.',
    },

    'ssc-gd-photo-resizer': {
        intro: 'SSC GD Constable exam recruits for General Duty positions in BSF, CRPF, CISF, ITBP, SSB, and other paramilitary forces. The photo requirements for SSC GD differ from other SSC exams like CGL/CHSL — GD uses 200×230 pixel dimensions. Since SSC GD attracts millions of applicants each cycle, photo-related upload errors are extremely common during the registration rush.',
        authority: 'Staff Selection Commission (SSC)',
        portalNote: 'Applied through ssc.gov.in. SSC GD may use either the OTR system or a dedicated registration link depending on the notification cycle.',
        requirements: [
            { label: 'Dimensions', value: '200 × 230 pixels' },
            { label: 'File Size', value: '20 KB – 50 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or light-coloured' },
            { label: 'Attire Note', value: 'No caps, dark glasses, or face coverings' },
        ],
        whyMatters: 'SSC GD Constable is a physical-standards-heavy recruitment. Your uploaded photo is printed on the admit card and used for identity verification at the physical test centre. A blurry, distorted, or non-compliant photo can create identification problems during the PET/PST stage, potentially causing delays.',
        preparationTips: [
            'Since your photo will be checked during physical tests, ensure it closely matches your current appearance — avoid old or heavily edited photos.',
            'Get a clear, sharp photo with even lighting. The photo will be printed small on the admit card, so high contrast between your face and background helps.',
            'If you wear spectacles normally but will remove them for the physical test, it\'s better to submit a photo without spectacles to avoid identity confusion.',
        ],
        commonMistakes: [
            { mistake: 'Using CGL/CHSL photo dimensions', detail: 'SSC GD requires 200×230px, not 275×354px. If you\'ve previously prepared a photo for CGL, do NOT use the same file for GD — the dimensions are different.' },
            { mistake: 'Wearing a cap or covering head unnecessarily', detail: 'Unless for religious reasons, photos with caps are rejected. Since GD is a uniformed-service recruitment, the photo should show a clear view of your face and head.' },
            { mistake: 'Using a heavily filtered selfie', detail: 'Beauty filters, skin-smoothing, and colour-altering filters create a mismatch with your physical appearance and can cause verification issues.' },
        ],
        faqs: [
            { q: 'Why is SSC GD photo size different from SSC CGL?', a: 'SSC GD uses the standard IBPS-like 200×230px format, while CGL/CHSL use 275×354px. Different SSC exams may have different specifications depending on the registration portal setup.' },
            { q: 'Will my SSC GD photo be verified during the Physical Test?', a: 'Yes. Your photo is printed on the admit card and verified at the PET/PST venue. Ensure the photo is recent and matches your current appearance.' },
            { q: 'Can I use a phone camera photo for SSC GD?', a: 'Yes, provided it\'s clear, well-lit, against a white background, and properly cropped. Studio photos are preferred but not mandatory.' },
        ],
        relatedTools: [
            { href: '/ssc-signature-resizer', label: 'SSC Signature Resizer' },
            { href: '/passport-size-photo', label: 'Passport Size Photo Maker' },
            { href: '/image-compressor', label: 'Image Compressor' },
        ],
        verificationNote: 'SSC GD photo specifications may vary between notification cycles. Always verify from the latest SSC GD Constable notification on ssc.gov.in.',
    },

    'ssc-mts-photo-resizer': {
        intro: 'SSC MTS (Multi-Tasking Staff) is an entry-level central government exam for Group C non-technical posts. The SSC MTS application uses the same OTR system and photo specifications as CGL and CHSL — 275×354 pixels. MTS attracts a very large number of applicants, many of whom are first-time exam applicants unfamiliar with online photo upload requirements.',
        authority: 'Staff Selection Commission (SSC)',
        portalNote: 'Applied through ssc.gov.in via OTR. Photo is stored centrally and used for admit card printing.',
        requirements: [
            { label: 'Dimensions', value: '275 × 354 pixels' },
            { label: 'File Size', value: '20 KB – 50 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or light-coloured' },
        ],
        whyMatters: 'Many SSC MTS candidates are applying to a government exam online for the first time. The most common issue is not understanding the difference between pixel dimensions and file size — candidates often resize the image to be physically smaller on screen but the file remains above 50KB because resolution wasn\'t adjusted. This tool handles both dimension and compression automatically.',
        preparationTips: [
            'If you\'re a first-time applicant, visit a local photo studio and ask for a "passport size photo with soft copy." Most studios charge ₹20–50 for a digital copy.',
            'Ensure the digital copy is the original high-resolution file, not a photo-of-a-print. Photographing a printed passport photo with your phone produces poor results.',
            'If using the OTR system, the same photo will be used if you also apply for SSC CGL, CHSL, or CPO later.',
        ],
        commonMistakes: [
            { mistake: 'Photographing a printed passport photo with a phone', detail: 'This creates a "photo of a photo" with visible edges, shadows, and moiré patterns. Always use the original digital file from the studio.' },
            { mistake: 'Using a low-resolution photo from WhatsApp', detail: 'WhatsApp compresses images to roughly 100–200KB and reduces resolution. A photo received via WhatsApp may be too blurry when resized to 275×354px.' },
            { mistake: 'Applying for OTR with an old or mismatched photo', detail: 'Since OTR uses one photo for all SSC exams, an outdated photo can cause issues at document verification for any subsequent SSC exam.' },
        ],
        faqs: [
            { q: 'Is MTS photo size the same as CGL and CHSL?', a: 'Yes. SSC MTS, CGL, and CHSL all use 275×354px photo specs through the OTR system. If you\'ve already uploaded for CGL, the same photo applies to MTS.' },
            { q: 'I don\'t have a scanner. Can I use a phone camera?', a: 'Yes. Take a clear photo against a white wall with your phone, crop it to show only your face and upper shoulders, then use this tool to resize it to exactly 275×354px.' },
        ],
        relatedTools: [
            { href: '/ssc-cgl-photo-resizer', label: 'SSC CGL Photo Resizer' },
            { href: '/ssc-signature-resizer', label: 'SSC Signature Resizer' },
            { href: '/passport-size-photo', label: 'Passport Size Photo Maker' },
        ],
        verificationNote: 'Specifications are consistent with the OTR system used across SSC exams. Verify from the latest MTS notification on ssc.gov.in.',
    },

    'ssc-signature-resizer': {
        intro: 'SSC exams (CGL, CHSL, MTS, CPO, GD) require a scanned signature upload alongside the photograph. The signature must be exactly 140×60 pixels and between 10–20KB. This is a separate upload from the passport photo and has completely different dimensions. Many candidates struggle with signature uploads because the file size range is very narrow — just 10KB.',
        authority: 'Staff Selection Commission (SSC)',
        portalNote: 'Uploaded alongside the photo during OTR registration on ssc.gov.in.',
        requirements: [
            { label: 'Dimensions', value: '140 × 60 pixels' },
            { label: 'File Size', value: '10 KB – 20 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Ink Colour', value: 'Black or dark blue on white paper' },
            { label: 'Type', value: 'Hand-written only — no digital/typed signatures' },
        ],
        whyMatters: 'The 10–20KB range for signatures is one of the tightest file-size constraints across any government exam portal. At 140×60 pixels, the image is very small — just enough to show a readable signature. Over-compressing makes the signature unreadable, while under-compressing exceeds the 20KB limit. This tool uses a binary-search compression algorithm to hit the exact target range.',
        preparationTips: [
            'Sign on a clean white unlined paper using a black ball-point or gel pen. Press firmly for clear, dark strokes.',
            'Take a close-up photograph of only the signature — avoid capturing too much white space around it.',
            'Crop the image tightly around the signature before uploading to this tool. More white space means the signature appears smaller in the final 140×60 output.',
            'If your signature is very small, sign slightly larger than usual for better clarity at 140×60 resolution.',
        ],
        commonMistakes: [
            { mistake: 'Signing on lined/ruled paper', detail: 'Blue and red lines from ruled notebooks are visible in the scan and can cause rejection during document verification.' },
            { mistake: 'Too much white space around the signature', detail: 'If the crop includes too much blank paper, the actual signature becomes tiny and unreadable at 140×60px.' },
            { mistake: 'Using a light-coloured pen', detail: 'Light blue, pencil, or faded ink signatures become nearly invisible when compressed to 10–20KB at such a small resolution.' },
            { mistake: 'Trying to use a typed or digital signature', detail: 'SSC explicitly requires a hand-written signature. Typed text or digitally drawn signatures are not accepted.' },
        ],
        faqs: [
            { q: 'Can I use the same signature file for CGL, CHSL, and other SSC exams?', a: 'Yes. If registered through OTR, the same 140×60px signature is used across all SSC exams. Ensure it\'s your best, clearest signature.' },
            { q: 'My signature keeps getting rejected as "too large." What should I do?', a: 'Switch to JPG format if using PNG. PNG files for small images are often larger than JPG. This tool automatically targets the 10–20KB range using JPG compression.' },
            { q: 'Should my signature match my ID proof exactly?', a: 'Your uploaded signature should reasonably match the signature on your identity documents. Significant mismatches may cause issues at document verification.' },
        ],
        relatedTools: [
            { href: '/ssc-cgl-photo-resizer', label: 'SSC CGL Photo Resizer (275×354px)' },
            { href: '/ssc-gd-photo-resizer', label: 'SSC GD Photo Resizer' },
            { href: '/crop-image', label: 'Crop Image Tool' },
        ],
        verificationNote: 'Signature specifications (140×60px, 10–20KB) have been consistent across recent SSC exam cycles. Always verify from the latest exam notification.',
    },

    'ibps-po-photo-resizer': {
        intro: 'IBPS PO (Probationary Officer) is the gateway to officer-cadre positions in 11 participating public sector banks. The registration on ibps.in requires a passport-size photograph meeting 200×230 pixel specifications. IBPS uses the same photo for the online exam admit card, interview call letter, and final joining documents — making photo quality important throughout the selection process.',
        authority: 'Institute of Banking Personnel Selection (IBPS)',
        portalNote: 'Registration through ibps.in. IBPS uses its own registration system separate from SSC.',
        requirements: [
            { label: 'Dimensions', value: '200 × 230 pixels' },
            { label: 'File Size', value: '20 KB – 50 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or off-white' },
            { label: 'Recency', value: 'Taken within last 6 months' },
            { label: 'Face Coverage', value: '80% of photo should show face' },
        ],
        whyMatters: 'IBPS PO selection has three stages — Prelims, Mains, and Interview. The same photo appears on all admit cards and is verified at each stage. A low-quality or mismatched photo can create identification issues, especially at the interview stage where multiple identity checks are conducted. IBPS also prints your photo on the provisional allotment letter sent to the allotted bank.',
        preparationTips: [
            'Use a studio-quality passport photo with clear facial features. The photo should look professional as it follows you through to the bank joining process.',
            'Face should cover approximately 80% of the frame — this is higher face coverage than SSC exams.',
            'Avoid heavy make-up, accessories, or filters that alter your natural appearance.',
            'If you wear spectacles regularly, you can keep them on, but ensure there is no glare on the lenses.',
        ],
        commonMistakes: [
            { mistake: 'Using SSC-format 275×354px photo', detail: 'IBPS uses 200×230px, which has a different aspect ratio than SSC\'s 275×354px. A photo prepared for SSC will be visually distorted if force-fitted to IBPS dimensions.' },
            { mistake: 'Using a group photo crop', detail: 'Cropping yourself from a group photo results in low resolution and pixelation when resized to 200×230. Always use a dedicated portrait photo.' },
            { mistake: 'Photo older than 6 months', detail: 'IBPS specifies recent photographs. If your appearance has changed significantly (haircut, facial hair, spectacles), use an updated photo.' },
        ],
        faqs: [
            { q: 'Is IBPS PO photo size different from IBPS Clerk?', a: 'No. Both IBPS PO and IBPS Clerk use the same 200×230px, 20–50KB specification. You can use the same photo for both exams.' },
            { q: 'Will my IBPS PO photo be used at the bank joining stage?', a: 'Yes. The same photo is used on the provisional allotment letter and initial bank records. Use a professional, recent photograph.' },
            { q: 'Can I change my IBPS photo after form submission?', a: 'IBPS typically opens a brief edit window after the registration deadline. However, photo changes are not always guaranteed. Upload the correct photo on first attempt.' },
        ],
        relatedTools: [
            { href: '/ibps-clerk-photo-signature-resizer', label: 'IBPS Clerk Photo Resizer' },
            { href: '/sbi-po-photo-resizer', label: 'SBI PO Photo Resizer' },
            { href: '/image-compressor', label: 'Image Compressor' },
        ],
        verificationNote: 'Verify the latest photo specifications from the official IBPS PO notification on ibps.in before uploading.',
    },

    'ibps-clerk-photo-signature-resizer': {
        intro: 'IBPS Clerk exam recruits for clerical cadre positions in participating public sector banks. Like IBPS PO, the clerk registration also requires both a photograph and signature upload. The photo specifications are the same as IBPS PO (200×230px), but clerks should note that their photo will appear on the joining documents at the allotted bank branch.',
        authority: 'Institute of Banking Personnel Selection (IBPS)',
        portalNote: 'Applied through ibps.in. Both photo and signature are uploaded during online registration.',
        requirements: [
            { label: 'Photo Dimensions', value: '200 × 230 pixels' },
            { label: 'Photo File Size', value: '20 KB – 50 KB' },
            { label: 'Signature Dimensions', value: 'Typically 140 × 60 pixels' },
            { label: 'Signature File Size', value: '10 KB – 20 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
        ],
        whyMatters: 'IBPS Clerk involves Prelims and Mains stages with document verification. The uploaded photo and signature are checked at every stage. Since clerical positions require daily public interaction, banks prefer a clear, professional photograph. A blurry or non-compliant photo can delay the joining process even after selection.',
        preparationTips: [
            'Prepare both photo (200×230px) and signature files before starting registration — the IBPS server can timeout if you take too long during the upload process.',
            'Signature should be on white paper with a dark pen, scanned or photographed cleanly.',
            'Keep backup copies of both files in case you need to re-register or edit your application.',
        ],
        commonMistakes: [
            { mistake: 'Using signature on coloured paper', detail: 'Sign on plain white unruled paper. Yellow, blue, or lined paper backgrounds are visible in the compressed output.' },
            { mistake: 'Confusing IBPS Clerk and SSC Clerk photo specs', detail: 'There is no "SSC Clerk" exam. If you mean IBPS Clerk, the specs are 200×230px. SSC exams use 275×354px.' },
        ],
        faqs: [
            { q: 'Are IBPS Clerk and IBPS PO photo requirements the same?', a: 'Yes. Both use 200×230px photos and 140×60px signatures with the same file size limits. You can reuse the same files for both exams.' },
            { q: 'How long is the IBPS Clerk photo valid for?', a: 'IBPS typically requires photos taken within the last 6 months. If you\'re applying to multiple IBPS exams in the same cycle, one photo is sufficient.' },
        ],
        relatedTools: [
            { href: '/ibps-po-photo-resizer', label: 'IBPS PO Photo Resizer' },
            { href: '/ssc-signature-resizer', label: 'Signature Resizer (140×60px)' },
            { href: '/passport-size-photo', label: 'Passport Size Photo Maker' },
        ],
        verificationNote: 'Verify exact signature dimensions and photo specifications from the current IBPS Clerk notification on ibps.in.',
    },

    'ibps-rrb-photo-resizer': {
        intro: 'IBPS RRB (Regional Rural Banks) recruits Officers (Scale I, II, III) and Office Assistants for Regional Rural Banks across India. RRB positions are primarily posted in semi-urban and rural areas. The online application through ibps.in follows the same 200×230px photo specification as other IBPS exams, but candidates should be aware that RRB has separate registration for Officer and Assistant categories.',
        authority: 'Institute of Banking Personnel Selection (IBPS)',
        portalNote: 'Applied through ibps.in. Separate registration forms for RRB Officer and RRB Office Assistant.',
        requirements: [
            { label: 'Dimensions', value: '200 × 230 pixels' },
            { label: 'File Size', value: '20 KB – 50 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or light' },
        ],
        whyMatters: 'IBPS RRB posts are allotted to specific rural bank branches. Your photo appears on the allotment letter and is verified at the interview/joining location, which may be in a different state. A clear, identifiable photo is essential to avoid any mismatch issues during remote-location verification.',
        preparationTips: [
            'Use a clear, high-contrast photo since RRB admit cards are sometimes printed on lower-quality paper at exam centres.',
            'If applying for both RRB Officer and Office Assistant, you need separate applications but can use the same photo file.',
        ],
        commonMistakes: [
            { mistake: 'Applying for Officer and Assistant with different photos', detail: 'While using different photos isn\'t an error per se, if both applications are in the same cycle, consistent photos simplify document verification.' },
            { mistake: 'Low-resolution phone photo', detail: 'Since RRB photos are printed on admit cards at smaller sizes, low-resolution inputs become pixelated and hard to identify.' },
        ],
        faqs: [
            { q: 'Do I need separate photos for RRB Officer and RRB Office Assistant?', a: 'No. Both use the same 200×230px specification. You can use the same prepared photo file for both applications.' },
            { q: 'Is IBPS RRB photo specification different from IBPS PO/Clerk?', a: 'No. All IBPS exams use the same 200×230px, 20–50KB specification.' },
        ],
        relatedTools: [
            { href: '/ibps-po-photo-resizer', label: 'IBPS PO Photo Resizer' },
            { href: '/image-compressor', label: 'Image Compressor' },
        ],
        verificationNote: 'Verify from the latest IBPS RRB notification on ibps.in for any updates to photo specifications.',
    },

    'sbi-po-photo-resizer': {
        intro: 'SBI PO (Probationary Officer) is conducted directly by the State Bank of India for recruitment into the country\'s largest public sector bank. Unlike IBPS PO which covers multiple banks, SBI PO is exclusively for SBI. The registration is on sbi.co.in/careers and uses its own portal separate from IBPS. Photo specifications follow the 200×230px standard, but SBI may have additional guidelines about photo quality since PO candidates undergo a rigorous interview stage.',
        authority: 'State Bank of India (SBI)',
        portalNote: 'Registration through sbi.co.in/careers or the SBI recruitment portal. Separate from the IBPS system.',
        requirements: [
            { label: 'Dimensions', value: '200 × 230 pixels' },
            { label: 'File Size', value: '20 KB – 50 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or light' },
        ],
        whyMatters: 'SBI PO selection includes a Group Exercise and Interview round. The photo you upload during registration appears on all correspondence from SBI, including the final appointment letter. As India\'s largest bank, SBI\'s recruitment team reviews documents closely — a professional-looking photo creates a better impression throughout the process.',
        preparationTips: [
            'Use a formal, professional photograph — SBI PO is an officer-level recruitment, so treat it like a professional headshot.',
            'Ensure even lighting with no shadows on your face. Avoid flash photography that creates harsh shadows or red-eye.',
            'If you plan to apply for both SBI PO and IBPS PO in the same year, one well-prepared photo works for both.',
        ],
        commonMistakes: [
            { mistake: 'Using IBPS registration photo on SBI portal', detail: 'While specs are the same, you need to upload the photo separately on sbi.co.in — IBPS registration doesn\'t carry over to SBI.' },
            { mistake: 'Using a casual/vacation photo', detail: 'SBI PO is an officer-level position. Casual photos with sunglasses, hats, or informal attire may create a negative impression during interview document review.' },
        ],
        faqs: [
            { q: 'Is SBI PO photo specification the same as IBPS PO?', a: 'Yes, both use 200×230px at 20–50KB. However, SBI uses its own portal (sbi.co.in/careers) — you must upload separately.' },
            { q: 'Does SBI verify the photo at the interview stage?', a: 'Yes. SBI PO interview panels verify your identity using the uploaded photo. Ensure it\'s recent and matches your current appearance.' },
        ],
        relatedTools: [
            { href: '/sbi-clerk-photo-resizer', label: 'SBI Clerk Photo Resizer' },
            { href: '/ibps-po-photo-resizer', label: 'IBPS PO Photo Resizer' },
            { href: '/image-compressor', label: 'Image Compressor' },
        ],
        verificationNote: 'Verify the latest photo specifications from the official SBI PO recruitment notification on sbi.co.in/careers.',
    },

    'sbi-clerk-photo-resizer': {
        intro: 'SBI Clerk (Junior Associate — Customer Support & Sales) is recruited directly by SBI for branch-level positions. The registration is through SBI\'s own recruitment portal, not IBPS. Photo specifications are 200×230px, consistent with other banking exams. SBI Clerk attracts lakhs of applicants annually, and the registration process requires both a photograph and signature upload.',
        authority: 'State Bank of India (SBI)',
        portalNote: 'Applied through sbi.co.in/careers. Separate registration from IBPS Clerk.',
        requirements: [
            { label: 'Dimensions', value: '200 × 230 pixels' },
            { label: 'File Size', value: '20 KB – 50 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or light' },
        ],
        whyMatters: 'SBI Clerk is a high-volume recruitment. During peak registration days, the portal may be slow. Having your photo and documents pre-prepared saves time and avoids timeout errors during upload.',
        preparationTips: [
            'Prepare your photo and signature files in advance. SBI\'s portal can be slow during the first and last days of registration.',
            'Keep the file size close to 30–40KB for optimal quality within the 20–50KB range.',
            'If applying for both SBI Clerk and SBI PO, the same photo file can be used for both.',
        ],
        commonMistakes: [
            { mistake: 'Confusing SBI Clerk with IBPS Clerk', detail: 'SBI Clerk is recruited by SBI directly (sbi.co.in), while IBPS Clerk is for other public sector banks (ibps.in). You need separate applications and uploads.' },
            { mistake: 'Submitting application without uploading photo', detail: 'Some candidates fill the form and pay the fee but forget to upload the photo/signature, resulting in an incomplete application.' },
        ],
        faqs: [
            { q: 'Is SBI Clerk photo size different from SBI PO?', a: 'No. Both use the same 200×230px, 20–50KB specification through sbi.co.in/careers.' },
            { q: 'Can I use my IBPS Clerk photo for SBI Clerk?', a: 'If the photo meets 200×230px and 20–50KB specs and is recent, yes. However, you must upload it separately on the SBI portal.' },
        ],
        relatedTools: [
            { href: '/sbi-po-photo-resizer', label: 'SBI PO Photo Resizer' },
            { href: '/ibps-clerk-photo-signature-resizer', label: 'IBPS Clerk Photo Resizer' },
            { href: '/image-compressor', label: 'Image Compressor' },
        ],
        verificationNote: 'Check the latest SBI Clerk notification on sbi.co.in/careers for any updates to upload requirements.',
    },

    'upsc-photo-resizer': {
        intro: 'UPSC Civil Services Examination is India\'s premier competitive exam for IAS, IPS, IFS, and other All India Services. The application through upsconline.nic.in requires a photograph at 300×400 pixels — larger than most other government exam portals. UPSC also has a generous 20–100KB file size range, allowing higher quality photos. Given the prestige of the exam, photo quality standards are particularly important as the same photo appears on all official correspondence from the Commission.',
        authority: 'Union Public Service Commission (UPSC)',
        portalNote: 'Applied through upsconline.nic.in. UPSC uses its own dedicated portal separate from SSC or IBPS.',
        requirements: [
            { label: 'Dimensions', value: '300 × 400 pixels' },
            { label: 'File Size', value: '20 KB – 100 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or plain light colour' },
            { label: 'Face Coverage', value: 'Face should be clearly visible, centred' },
            { label: 'Recency', value: 'Recent passport-size photograph' },
        ],
        whyMatters: 'UPSC Civil Services has a multi-stage selection process spanning over a year — Prelims, Mains, and the Personality Test (Interview). The uploaded photo is used throughout all stages and appears on the final appointment orders. UPSC\'s 300×400px specification is larger than SSC (275×354) or IBPS (200×230), which means higher detail is visible. Any photo quality issues become more apparent at this resolution.',
        preparationTips: [
            'Get a high-quality studio photograph. Given the multi-year selection process, invest in a professional photo that presents well across all stages.',
            'UPSC\'s 20–100KB range is generous — aim for 60–80KB to maximise quality while staying within limits.',
            'The photo should be a standard passport-style photo: front-facing, neutral expression, ears visible.',
            'If you\'re applying for the first time, note that UPSC may allow limited attempts based on category — use a photo you\'re satisfied with long-term.',
        ],
        commonMistakes: [
            { mistake: 'Using a 200×230px banking-exam photo', detail: 'UPSC requires 300×400px. A 200×230 photo upscaled to 300×400 becomes blurry and pixelated.' },
            { mistake: 'Over-compressing to match SSC\'s 50KB limit', detail: 'UPSC allows up to 100KB. There\'s no need to compress as aggressively as SSC exams. Keep quality higher.' },
            { mistake: 'Inconsistent photos across Prelims and Mains', detail: 'If UPSC asks you to re-upload for Mains, use a recent photo but maintain a similar appearance to your Prelims photo to avoid identity verification delays.' },
        ],
        faqs: [
            { q: 'Why is UPSC photo size larger than SSC or IBPS?', a: 'UPSC uses 300×400 pixels (3:4 ratio) which allows more detail. This is because UPSC photos are used across extensive documentation including appointment orders for All India Services.' },
            { q: 'Can I use the same photo for UPSC Prelims and Mains?', a: 'Typically yes, if the photo is still recent. UPSC uses the Prelims registration data for Mains. You may be asked to upload again during the DAF (Detailed Application Form) for Mains.' },
            { q: 'Is there a specific dress code for the UPSC photo?', a: 'UPSC doesn\'t mandate formal attire in the photo. However, since this photo appears on All India Service appointment documents, most candidates prefer formal or semi-formal attire.' },
        ],
        relatedTools: [
            { href: '/passport-size-photo', label: 'Passport Size Photo Maker' },
            { href: '/image-compressor', label: 'Image Compressor' },
            { href: '/crop-image', label: 'Crop Image Tool' },
        ],
        verificationNote: 'UPSC photo specifications may be updated in the exam notification or the ORA (One-Time Registration) guidelines on upsconline.nic.in. Always verify before uploading.',
    },

    'neet-photo-resizer': {
        intro: 'NEET UG (National Eligibility cum Entrance Test) is the single entrance exam for undergraduate medical and dental admissions across India. Conducted by NTA (National Testing Agency), NEET registration on neet.nta.nic.in requires a larger photo than most government exams — 413×531 pixels, corresponding to a 3.5cm × 4.5cm passport photo at 300 DPI. The file size range of 10–200KB is also more generous than SSC or IBPS exams.',
        authority: 'National Testing Agency (NTA)',
        portalNote: 'Registration through neet.nta.nic.in. NTA uses its own portal for NEET, JEE Main, CUET, and other exams.',
        requirements: [
            { label: 'Dimensions', value: '413 × 531 pixels (3.5cm × 4.5cm at 300 DPI)' },
            { label: 'File Size', value: '10 KB – 200 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White background (mandatory for postcard-size photo)' },
            { label: 'Photo Type', value: 'Coloured passport-size, front facing' },
            { label: 'Date Requirement', value: 'Photo should have the date printed/written on it (as per some notification cycles)' },
        ],
        whyMatters: 'NEET is conducted at thousands of centres nationwide. Your photo is printed on the admit card and used for biometric verification at the exam centre. Since NEET is a single-day exam with no re-test (typically), getting the registration right on the first attempt is crucial. Additionally, medical college admission counselling uses the same NEET registration data — your photo follows you through to the counselling and admission process.',
        preparationTips: [
            'Get a 3.5cm × 4.5cm passport-size photo taken at a studio. Ask for the digital copy at maximum resolution.',
            'Some NEET notification cycles require a postcard-size photo (4" × 6") with your name and date written on it — this is a separate physical requirement, not the online upload.',
            'The 413×531 pixel specification is larger than SSC (275×354) or IBPS (200×230). Use a high-resolution original for best results.',
            'NTA may require photos with date printed on them in some cycles — check the specific year\'s notification.',
        ],
        commonMistakes: [
            { mistake: 'Using a 200×230px banking-exam photo', detail: 'NEET requires 413×531px — much larger than banking exams. Upscaling a smaller photo will result in visible pixelation.' },
            { mistake: 'Forgetting the date on the physical postcard photo', detail: 'While the online upload may not require a date, the physical postcard-size photo sent to NTA (in some cycles) requires date written on it.' },
            { mistake: 'Using a photo with non-white background', detail: 'NTA specifically requires a white background for NEET. Coloured backgrounds, even light ones, may cause rejection.' },
        ],
        faqs: [
            { q: 'Why is NEET photo size (413×531) different from other exams?', a: 'NEET uses 3.5cm × 4.5cm at 300 DPI, which translates to 413×531 pixels. This is the standard passport-photo size digitized at high resolution, allowing better quality for admit card printing.' },
            { q: 'Is the NEET photo used during medical admission counselling?', a: 'Yes. NEET registration data, including your photo, is used by MCC (Medical Counselling Committee) and state counselling authorities during the admission process.' },
            { q: 'Can I use a JEE Main photo for NEET?', a: 'No. JEE Main uses 200×230px while NEET uses 413×531px. The dimensions are different and cannot be interchanged.' },
        ],
        relatedTools: [
            { href: '/jee-main-photo-resizer', label: 'JEE Main Photo Resizer (200×230px)' },
            { href: '/passport-size-photo', label: 'Passport Size Photo Maker' },
            { href: '/image-compressor', label: 'Image Compressor' },
        ],
        verificationNote: 'NEET photo requirements may change between notification cycles. Always verify from the latest NTA NEET notification on neet.nta.nic.in.',
    },

    'jee-main-photo-resizer': {
        intro: 'JEE Main is conducted by NTA for admission to NITs, IIITs, and other centrally funded technical institutions. The registration on jeemain.nta.nic.in requires a 200×230 pixel photograph. JEE Main is offered twice a year (January and April sessions), and candidates can use the same or updated photo for each attempt. The photo specifications are the same as banking exams but different from JEE Advanced and NEET.',
        authority: 'National Testing Agency (NTA)',
        portalNote: 'Registration through jeemain.nta.nic.in. NTA portal shared with NEET and CUET.',
        requirements: [
            { label: 'Dimensions', value: '200 × 230 pixels' },
            { label: 'File Size', value: '10 KB – 40 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White background' },
        ],
        whyMatters: 'JEE Main admit cards are checked at exam centres along with valid photo ID. A clear photo helps avoid any identity issues on exam day. Since JEE Main score is also used for JoSAA counselling (for NIT/IIIT admissions), the same registration photo appears on counselling documents. Note the maximum file size is 40KB, tighter than IBPS\'s 50KB — make sure your file fits within this range.',
        preparationTips: [
            'JEE Main allows up to 40KB (not 50KB like banking exams). Be mindful of this tighter limit.',
            'If registering for both January and April sessions, you can update your photo for the second session if needed.',
            'Keep a plain white background. NTA\'s system may flag photos with coloured backgrounds.',
        ],
        commonMistakes: [
            { mistake: 'Using NEET photo (413×531) for JEE Main', detail: 'JEE Main requires 200×230px. NEET\'s 413×531 pixel photo will be rejected if uploaded directly — it must be resized.' },
            { mistake: 'Exceeding the 40KB limit', detail: 'JEE Main\'s max is 40KB, not 50KB. A photo compressed for banking exams (up to 50KB) may need further compression.' },
            { mistake: 'Using the same registration for both JEE Main sessions without review', detail: 'If your appearance has changed between January and April, update your photo for the second session.' },
        ],
        faqs: [
            { q: 'Is JEE Main photo size different from JEE Advanced?', a: 'JEE Advanced is conducted by an IIT and may have different photo specifications. The 200×230px specification applies to JEE Main (NTA). Check the JEE Advanced notification separately.' },
            { q: 'Can I use my JEE Main photo for NIT counselling?', a: 'Yes. JoSAA counselling for NITs uses your JEE Main registration data, including the uploaded photo.' },
        ],
        relatedTools: [
            { href: '/neet-photo-resizer', label: 'NEET Photo Resizer (413×531px)' },
            { href: '/image-compressor', label: 'Image Compressor' },
            { href: '/passport-size-photo', label: 'Passport Size Photo Maker' },
        ],
        verificationNote: 'JEE Main specifications can vary between sessions. Verify from the latest NTA notification on jeemain.nta.nic.in.',
    },

    'rrb-ntpc-photo-resizer': {
        intro: 'RRB NTPC (Non-Technical Popular Categories) recruits for various posts including Station Master, Goods Guard, Clerk, and other non-technical positions in Indian Railways. The application is through the respective Regional Railway Board website. Railway recruitment attracts millions of candidates, making photo compliance essential to avoid application rejection in the initial screening.',
        authority: 'Railway Recruitment Boards (RRBs)',
        portalNote: 'Applied through the respective RRB zone\'s website (e.g., rrbcdg.gov.in, rrbmumbai.gov.in). India has 21 RRBs.',
        requirements: [
            { label: 'Dimensions', value: '200 × 230 pixels' },
            { label: 'File Size', value: '20 KB – 50 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or light' },
        ],
        whyMatters: 'Railway exams have multiple stages including CBT (Computer Based Test), Skill Test, and Document Verification. Your photo is checked at each stage across different locations. Since candidates may be called to different cities for different stages, a clearly identifiable photo prevents mix-ups during multi-city verification.',
        preparationTips: [
            'RRB recruitment processes can span 1-2 years from application to joining. Use a recent, clear photo that will remain recognisable over time.',
            'Since RRB has 21 zones, your photo might be checked by different officials at different locations — consistency in appearance helps.',
        ],
        commonMistakes: [
            { mistake: 'Applying to wrong RRB zone', detail: 'While the photo spec is the same across zones, ensure you apply to the correct RRB. The photo upload happens on the specific zone\'s website.' },
            { mistake: 'Using a scanned physical passport photo instead of a digital file', detail: 'Scanning introduces moiré patterns and resolution loss. Use the original digital file from the studio.' },
        ],
        faqs: [
            { q: 'Is the photo specification same across all RRB zones?', a: 'Generally yes. All RRBs follow the Railway Board guidelines. However, always check the specific RRB\'s notification for your zone.' },
            { q: 'Can I use my SSC CGL photo for RRB NTPC?', a: 'No, SSC CGL uses 275×354px while RRB NTPC requires 200×230px. You need to resize for the correct specifications.' },
        ],
        relatedTools: [
            { href: '/passport-size-photo', label: 'Passport Size Photo Maker' },
            { href: '/image-compressor', label: 'Image Compressor' },
        ],
        verificationNote: 'Railway photo specifications are set by the Railway Board but may have zone-specific variations. Verify from your specific RRB zone\'s notification.',
    },

    'up-police-photo-resizer': {
        intro: 'UP Police (Uttar Pradesh Police) recruitment covers Constable, Sub-Inspector (SI), and other posts under UPPRPB (UP Police Recruitment and Promotion Board). The application portal uses 275×354 pixel photo specifications similar to SSC exams. UP Police recruitment is one of the largest state-level police recruitments in India, with physical standards tests conducted across the state.',
        authority: 'UP Police Recruitment and Promotion Board (UPPRPB)',
        portalNote: 'Applied through uppbpb.gov.in. Separate notifications for Constable and SI cadres.',
        requirements: [
            { label: 'Dimensions', value: '275 × 354 pixels' },
            { label: 'File Size', value: '20 KB – 50 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or light' },
        ],
        whyMatters: 'UP Police recruitment includes written test, physical tests (running, long jump, etc.), and document verification. Your photo is verified at the physical test grounds — a clear, recognisable photo is essential for identity verification in outdoor conditions.',
        preparationTips: [
            'Since verification happens outdoors at physical test centres, use a high-contrast photo with clear facial features.',
            'If you normally wear spectacles but will remove them for the physical test, consider submitting a photo without spectacles.',
        ],
        commonMistakes: [
            { mistake: 'Using a photo with helmet or cap', detail: 'Headwear (except for religious purposes) is not allowed in the application photo.' },
            { mistake: 'Using a filtered or edited photo', detail: 'Photo is matched to your physical appearance during PET. Heavily filtered photos cause identity mismatch.' },
        ],
        faqs: [
            { q: 'Is the UP Police photo spec same for Constable and SI?', a: 'Generally yes. Both use 275×354px specifications through the same UPPRPB portal. Check the specific notification for any differences.' },
            { q: 'Will my photo be checked during the physical test?', a: 'Yes. Identity verification at PET centres uses your uploaded photo printed on the admit card.' },
        ],
        relatedTools: [
            { href: '/ssc-cgl-photo-resizer', label: 'SSC CGL Photo Resizer (same dimensions)' },
            { href: '/passport-size-photo', label: 'Passport Size Photo Maker' },
        ],
        verificationNote: 'Verify specifications from the latest UPPRPB notification on uppbpb.gov.in.',
    },

    'bihar-police-photo-resizer': {
        intro: 'Bihar Police recruitment (Constable, SI, Fireman) is conducted by BPSSC (Bihar Police Subordinate Services Commission) and CSBC (Central Selection Board of Constable). The application uses 200×230px photo specifications. Bihar Police exams involve written tests followed by physical fitness tests and document verification across designated centres in Bihar.',
        authority: 'BPSSC / CSBC, Bihar',
        portalNote: 'Applied through bpssc.bih.nic.in (for SI/Sergeant) or csbc.bih.nic.in (for Constable/Fireman).',
        requirements: [
            { label: 'Dimensions', value: '200 × 230 pixels' },
            { label: 'File Size', value: '20 KB – 50 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or light' },
        ],
        whyMatters: 'Bihar Police recruitment has separate portals for different posts (BPSSC for SI, CSBC for Constable). While photo specs are generally the same, the upload process differs between portals. Having a correctly sized photo file ready prevents issues during registration on either portal.',
        preparationTips: [
            'Check whether your post falls under BPSSC or CSBC — they have separate registration portals.',
            'Bihar Police admit cards are verified at exam centres and PET grounds. Use a recent, clear photo.',
        ],
        commonMistakes: [
            { mistake: 'Applying on wrong portal', detail: 'SI/Sergeant applications go through BPSSC. Constable/Fireman go through CSBC. The portals are separate.' },
            { mistake: 'Using very old photo', detail: 'Physical test verifiers check if the admit card photo matches your current appearance.' },
        ],
        faqs: [
            { q: 'Is BPSSC and CSBC photo size the same?', a: 'Both typically use 200×230px specifications, though you should verify from the specific notification as portal requirements can differ.' },
            { q: 'Which portal do I use for Bihar Police Constable?', a: 'Bihar Police Constable recruitment is handled by CSBC (csbc.bih.nic.in), not BPSSC.' },
        ],
        relatedTools: [
            { href: '/up-police-photo-resizer', label: 'UP Police Photo Resizer' },
            { href: '/image-compressor', label: 'Image Compressor' },
        ],
        verificationNote: 'Verify from the latest BPSSC or CSBC notification for exact photo specifications.',
    },

    'rajasthan-police-photo-resizer': {
        intro: 'Rajasthan Police Constable and SI recruitment is conducted by the Rajasthan Police via their dedicated recruitment portal. The online application typically requires a 200×230px photograph. Rajasthan Police recruitment covers multiple posts including Constable (General/Driver/Band/Mounted), and the number of vacancies is usually in the thousands.',
        authority: 'Rajasthan Police',
        portalNote: 'Applied through police.rajasthan.gov.in or the designated recruitment portal.',
        requirements: [
            { label: 'Dimensions', value: '200 × 230 pixels' },
            { label: 'File Size', value: '20 KB – 50 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or light' },
        ],
        whyMatters: 'Rajasthan Police physical tests are conducted in hot, outdoor conditions. Your admit card photo must be clearly recognisable even when printed on standard paper. A high-contrast, well-lit photo ensures smooth identity verification at PET centres.',
        preparationTips: [
            'Use a clear, high-contrast studio photo for best admit card printing quality.',
            'Rajasthan Police recruitment can span several months — use a recent photo that reflects your current appearance.',
        ],
        commonMistakes: [
            { mistake: 'Low-resolution or blurry photo', detail: 'Admit cards printed at PET centres may use basic printers. Low-resolution photos become unrecognisable.' },
            { mistake: 'Photo with accessories', detail: 'Avoid wearing dark glasses, heavy jewellery, or head coverings (except religious) in the photo.' },
        ],
        faqs: [
            { q: 'Is Rajasthan Police photo size the same for Constable and SI?', a: 'Typically yes, but always verify from the specific recruitment notification. Different cadres may have separate portals.' },
        ],
        relatedTools: [
            { href: '/up-police-photo-resizer', label: 'UP Police Photo Resizer' },
            { href: '/passport-size-photo', label: 'Passport Size Photo Maker' },
        ],
        verificationNote: 'Verify from the latest Rajasthan Police recruitment notification on police.rajasthan.gov.in.',
    },

    'mp-police-photo-resizer': {
        intro: 'MP Police (Madhya Pradesh Police) recruitment for Constable and SI posts is conducted by the MP Professional Examination Board (MPPEB/Vyapam). The application portal typically requires a 200×230px photograph. MPPEB conducts multiple exams throughout the year, and the portal interface may vary between recruitment cycles.',
        authority: 'MP Professional Examination Board (MPPEB / Vyapam)',
        portalNote: 'Applied through peb.mp.gov.in (MPPEB/Vyapam portal).',
        requirements: [
            { label: 'Dimensions', value: '200 × 230 pixels' },
            { label: 'File Size', value: '20 KB – 50 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or light' },
        ],
        whyMatters: 'MPPEB uses a unified portal for multiple exams. If you\'re registered for other MPPEB exams as well, your photo may carry over. Ensure it meets the police recruitment specifications specifically.',
        preparationTips: [
            'MPPEB portal is used for multiple exams — verify that the photo specifications match the specific police recruitment notification.',
            'Keep a separate, correctly sized file ready rather than relying on previously uploaded photos on the portal.',
        ],
        commonMistakes: [
            { mistake: 'Assuming MPPEB specs are the same for all exams', detail: 'While commonly 200×230px for police posts, other MPPEB exams may have different specifications.' },
        ],
        faqs: [
            { q: 'Can I use my MPPEB profile photo for MP Police recruitment?', a: 'If the profile photo meets the specific police recruitment notification\'s requirements, it may be reusable. However, verify the dimensions and file size match.' },
        ],
        relatedTools: [
            { href: '/rajasthan-police-photo-resizer', label: 'Rajasthan Police Photo Resizer' },
            { href: '/image-compressor', label: 'Image Compressor' },
        ],
        verificationNote: 'Verify from the latest MP Police recruitment notification on peb.mp.gov.in.',
    },

    'ctet-photo-resizer': {
        intro: 'CTET (Central Teacher Eligibility Test) is conducted by CBSE for candidates aspiring to teach in central government schools (KVS, NVS, DSSSB, etc.). The registration on ctet.nic.in requires a 200×230px photograph. CTET qualification is now valid for life (as per 2021 policy change), making the registration photo a long-term document.',
        authority: 'Central Board of Secondary Education (CBSE)',
        portalNote: 'Applied through ctet.nic.in. CBSE manages the registration and exam.',
        requirements: [
            { label: 'Dimensions', value: '200 × 230 pixels' },
            { label: 'File Size', value: '20 KB – 50 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or light' },
        ],
        whyMatters: 'CTET qualification is now valid for life. Your photo appears on the CTET certificate/marksheet which you\'ll submit to various schools and recruitment agencies for years. A professional, clear photo is important for long-term use.',
        preparationTips: [
            'Since CTET qualification is now lifetime valid, use a professional-quality photo that you\'re comfortable having on your certificate permanently.',
            'The photo should be clear enough for printing on the CTET certificate, which schools may retain in your employee file.',
        ],
        commonMistakes: [
            { mistake: 'Using an old or informal photo', detail: 'Your CTET certificate is a lifelong professional document. Use a formal, recent photograph.' },
            { mistake: 'Confusing CTET and state TET specifications', detail: 'CTET (central) and state TETs may have different photo specifications. This tool is for CTET (ctet.nic.in) specifically.' },
        ],
        faqs: [
            { q: 'Is the CTET certificate photo the same as the registration photo?', a: 'Yes. The photo uploaded during CTET registration is used on the certificate/marksheet. Since CTET is now lifetime valid, this photo will be on your certificate permanently.' },
            { q: 'Can I use CTET certificate photo for KVS/NVS recruitment?', a: 'Your CTET certificate has the registration photo printed on it. For KVS/NVS applications, you\'ll need to upload a separate photo as per their specifications.' },
        ],
        relatedTools: [
            { href: '/passport-size-photo', label: 'Passport Size Photo Maker' },
            { href: '/image-compressor', label: 'Image Compressor' },
        ],
        verificationNote: 'Verify from the latest CTET notification on ctet.nic.in for current photo specifications.',
    },

    'gate-photo-resizer': {
        intro: 'GATE (Graduate Aptitude Test in Engineering) is conducted by IITs in rotation for admission to M.Tech/M.E. programs and PSU recruitment. GATE uses significantly larger photo dimensions — 480×640 pixels — compared to other government exams. The file size range is also different at 5–40KB, requiring careful compression to fit a high-resolution photo into a relatively small file.',
        authority: 'Organizing IIT (rotates annually among IITs)',
        portalNote: 'Applied through gate.iitX.ac.in (where X is the organizing IIT for that year). Portal changes with each GATE cycle.',
        requirements: [
            { label: 'Dimensions', value: '480 × 640 pixels' },
            { label: 'File Size', value: '5 KB – 40 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or plain' },
        ],
        whyMatters: 'GATE\'s 480×640px specification is the largest among common Indian exams — 4.6× larger than IBPS\'s 200×230px. However, the maximum file size is only 40KB, which means high JPEG compression is needed. This creates a challenging balance: the large dimensions require more pixels, but the small file size limit requires aggressive compression. This tool\'s binary-search algorithm is particularly useful here, finding the highest quality that fits within 40KB.',
        preparationTips: [
            'GATE uses a very large dimension (480×640) with a small max file size (40KB). Start with a high-quality original and let this tool find the optimal compression.',
            'Aim for the 30–35KB range to balance quality and file size compliance.',
            'The organizing IIT changes each year — check the current year\'s GATE portal for the exact upload interface.',
        ],
        commonMistakes: [
            { mistake: 'Using a 200×230px photo from banking exams', detail: 'GATE requires 480×640px. A 200×230 photo upscaled to this size becomes extremely pixelated.' },
            { mistake: 'Exceeding 40KB despite correct dimensions', detail: 'At 480×640 pixels, even moderate JPEG quality produces files over 40KB. This tool\'s compression algorithm handles this automatically.' },
            { mistake: 'Checking the wrong year\'s GATE portal', detail: 'Since the organizing IIT rotates, last year\'s portal URL may not work. Always access the current year\'s GATE portal.' },
        ],
        faqs: [
            { q: 'Why is GATE photo size (480×640) so much larger than other exams?', a: 'GATE is organized by IITs which follow different technical standards. The 480×640 specification (3:4 ratio at higher resolution) allows detailed photo printing on admit cards and scorecards used for PSU and M.Tech applications.' },
            { q: 'Is the GATE scorecard photo the same as the registration photo?', a: 'Yes. Your uploaded photo appears on the GATE scorecard, which is used for M.Tech admissions and PSU recruitment. Use a professional photo.' },
            { q: 'Can I use my GATE photo for IIT M.Tech admission?', a: 'The GATE scorecard contains your photo. IIT admission portals (COAP, CCMT) may ask for a separate photo upload with potentially different specifications.' },
        ],
        relatedTools: [
            { href: '/image-compressor', label: 'Image Compressor' },
            { href: '/passport-size-photo', label: 'Passport Size Photo Maker' },
            { href: '/crop-image', label: 'Crop Image Tool' },
        ],
        verificationNote: 'GATE specifications can vary with the organizing IIT. Verify from the current year\'s GATE notification and registration portal.',
    },

    'post-office-gds-photo-resizer': {
        intro: 'India Post GDS (Gramin Dak Sevak) recruitment is for branch-level postal service positions in rural areas. The application is through the India Post GDS portal (indiapostgdsonline.gov.in). GDS uses 200×230px photo specifications. This is one of the largest government recruitments by number of vacancies, often announcing 30,000–40,000+ posts in a single cycle.',
        authority: 'Department of Posts, Ministry of Communications',
        portalNote: 'Applied through indiapostgdsonline.gov.in. Separate portal from other government exam portals.',
        requirements: [
            { label: 'Dimensions', value: '200 × 230 pixels' },
            { label: 'File Size', value: '20 KB – 50 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or light' },
        ],
        whyMatters: 'GDS recruitment uses a merit-based selection (no written exam in recent cycles). Document verification is the primary selection stage, making photo compliance and clarity critical. Since GDS posts are in rural areas, document verification may happen at divisional postal offices with basic printing facilities.',
        preparationTips: [
            'GDS recruitment is merit-based (10th class marks). Ensure your documents, including the photo, are perfect since document verification is the main selection stage.',
            'Keep multiple copies of the same photo file — GDS applications sometimes require re-upload during correction windows.',
        ],
        commonMistakes: [
            { mistake: 'Not matching the photo with 10th class ID', detail: 'Since GDS selection is based on 10th marks, your photo should match the identity established in your 10th board records.' },
            { mistake: 'Using the wrong portal', detail: 'GDS has its own portal (indiapostgdsonline.gov.in) separate from regular India Post recruitment (indiapost.gov.in).' },
        ],
        faqs: [
            { q: 'Is there a written exam for GDS?', a: 'Recent GDS cycles use merit-based selection (10th marks) without a written exam. Photo and document verification are the primary screening stages.' },
            { q: 'Can I apply for GDS in multiple postal circles?', a: 'GDS recruitment is typically circle-specific. Check the notification for whether cross-circle applications are allowed.' },
        ],
        relatedTools: [
            { href: '/passport-size-photo', label: 'Passport Size Photo Maker' },
            { href: '/image-compressor', label: 'Image Compressor' },
        ],
        verificationNote: 'Verify from the latest India Post GDS notification on indiapostgdsonline.gov.in.',
    },

    'army-agniveer-photo-resizer': {
        intro: 'Indian Army Agniveer (Agnipath scheme) is the entry-level recruitment for the Indian Army. Agniveers serve for 4 years with the option of 25% being retained permanently. The online registration through joinindianarmy.nic.in requires a 200×230px photograph. Physical fitness is paramount in Army recruitment, and photo verification happens at rally grounds.',
        authority: 'Indian Army / Directorate General of Recruiting',
        portalNote: 'Applied through joinindianarmy.nic.in.',
        requirements: [
            { label: 'Dimensions', value: '200 × 230 pixels' },
            { label: 'File Size', value: '20 KB – 50 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or light' },
            { label: 'Attire', value: 'No military/camouflage clothing' },
        ],
        whyMatters: 'Army Agniveer recruitment involves rally-based physical tests conducted outdoors. Your photo is verified by Military Police at rally grounds in sometimes challenging conditions. A clear, high-contrast photo ensures quick and accurate identification.',
        preparationTips: [
            'Photo should show your natural appearance — no accessories, filters, or editing that could create identity confusion during rally verification.',
            'Avoid wearing sunglasses, caps, or military-style clothing in the photo.',
            'If you have distinctive features (birthmarks, scars), ensure they are visible in the photo as they are used for identification.',
        ],
        commonMistakes: [
            { mistake: 'Wearing military/camouflage clothing', detail: 'Do not wear military uniforms or camouflage patterns in your application photo. Civilian clothing only.' },
            { mistake: 'Using heavily edited photos', detail: 'Army verification is strict. Filtered photos that don\'t match your physical appearance will cause issues at the rally ground.' },
        ],
        faqs: [
            { q: 'Is Army Agniveer photo used at the rally ground?', a: 'Yes. Your photo is printed on the admit card and checked by Military Police at the rally ground for identity verification.' },
            { q: 'Can I use the same photo for Army and Navy Agniveer?', a: 'If both use 200×230px specs and the photo is recent, yes. However, register separately on each service\'s portal.' },
        ],
        relatedTools: [
            { href: '/navy-agniveer-photo-resizer', label: 'Navy Agniveer Photo Resizer' },
            { href: '/passport-size-photo', label: 'Passport Size Photo Maker' },
        ],
        verificationNote: 'Verify from the latest Agniveer notification on joinindianarmy.nic.in.',
    },

    'navy-agniveer-photo-resizer': {
        intro: 'Indian Navy Agniveer recruitment (Agnipath scheme) covers SSR (Senior Secondary Recruit) and MR (Matric Recruit) entries. Registration is through joinindiannavy.gov.in. The photo requirements follow the standard 200×230px specification. Navy Agniveer selection includes a written exam, physical fitness test, and medical examination.',
        authority: 'Indian Navy / Naval Headquarters',
        portalNote: 'Applied through joinindiannavy.gov.in. Separate portal from Army and Air Force.',
        requirements: [
            { label: 'Dimensions', value: '200 × 230 pixels' },
            { label: 'File Size', value: '20 KB – 50 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or light' },
        ],
        whyMatters: 'Navy Agniveer selection includes medical and physical tests where identity verification is conducted. The photo should clearly show your face for easy identification during multi-stage screening.',
        preparationTips: [
            'Use a clear, unedited photo showing your natural appearance. Navy medical screening is thorough, and your physical appearance must match the uploaded photo.',
            'Ensure ears are visible in the photo — this is common guidance for defence recruitment photos.',
        ],
        commonMistakes: [
            { mistake: 'Applying on the Army portal instead of Navy', detail: 'Army (joinindianarmy.nic.in) and Navy (joinindiannavy.gov.in) have separate portals. Ensure you\'re on the correct site.' },
            { mistake: 'Using a heavily filtered selfie', detail: 'Defence recruitment requires photos that closely match your physical appearance for multi-stage identity verification.' },
        ],
        faqs: [
            { q: 'Is the Navy Agniveer photo specification the same as Army Agniveer?', a: 'Both generally use 200×230px at 20–50KB. However, verify from the specific notification on joinindiannavy.gov.in.' },
            { q: 'Which Navy Agniveer entry should I apply for?', a: 'SSR requires 10+2 with Science, while MR requires 10th pass. Photo specifications are typically the same for both entries.' },
        ],
        relatedTools: [
            { href: '/army-agniveer-photo-resizer', label: 'Army Agniveer Photo Resizer' },
            { href: '/passport-size-photo', label: 'Passport Size Photo Maker' },
        ],
        verificationNote: 'Verify from the latest Navy Agniveer notification on joinindiannavy.gov.in.',
    },

    'mpsc-photo-resizer': {
        intro: 'MPSC (Maharashtra Public Service Commission) conducts state civil services and other competitive exams for Maharashtra state government positions. The application through mpsc.gov.in requires a 200×230px photograph. MPSC exams include State Services, Engineering Services, and various group exams for Maharashtra state administration.',
        authority: 'Maharashtra Public Service Commission (MPSC)',
        portalNote: 'Applied through mpsc.gov.in (or mpsconline.gov.in for online applications).',
        requirements: [
            { label: 'Dimensions', value: '200 × 230 pixels' },
            { label: 'File Size', value: '20 KB – 50 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or light' },
        ],
        whyMatters: 'MPSC State Services exam is Maharashtra\'s equivalent of UPSC at the state level. The selection process includes Prelims, Mains, and Interview stages. Your photo appears on all official correspondence from MPSC and is verified at each stage.',
        preparationTips: [
            'Use a professional photo suitable for state civil services — MPSC State Services exam leads to Deputy Collector, DSP, and other gazetted officer positions.',
            'MPSC portal may be in Marathi — ensure your photo file name uses only English characters to avoid upload issues.',
        ],
        commonMistakes: [
            { mistake: 'Using a UPSC-format 300×400px photo', detail: 'MPSC uses 200×230px, different from UPSC\'s 300×400px. Resize accordingly.' },
            { mistake: 'File name with special characters', detail: 'Use simple file names (e.g., "photo.jpg") without Marathi or special characters to avoid upload errors on the MPSC portal.' },
        ],
        faqs: [
            { q: 'Is MPSC photo size different from UPSC?', a: 'Yes. MPSC uses 200×230px while UPSC uses 300×400px. They are different commissions with different portal specifications.' },
            { q: 'Can I use the same photo for all MPSC exams?', a: 'If the specifications match across the exams you\'re applying for and the photo is recent, yes. MPSC may use a unified profile system for registered candidates.' },
        ],
        relatedTools: [
            { href: '/upsc-photo-resizer', label: 'UPSC Photo Resizer (300×400px)' },
            { href: '/image-compressor', label: 'Image Compressor' },
        ],
        verificationNote: 'Verify from the latest MPSC notification on mpsc.gov.in.',
    },

    'wbcs-photo-resizer': {
        intro: 'WBCS (West Bengal Civil Service) exam is conducted by the West Bengal Public Service Commission (WBPSC) for recruitment to state administrative, police, and other services. WBCS uses 300×400px photo specifications — the same as UPSC, and larger than most state exam portals. The file size range is 20–60KB.',
        authority: 'West Bengal Public Service Commission (WBPSC)',
        portalNote: 'Applied through wbpsc.gov.in or pscwbapplication.in.',
        requirements: [
            { label: 'Dimensions', value: '300 × 400 pixels' },
            { label: 'File Size', value: '20 KB – 60 KB' },
            { label: 'Format', value: 'JPEG / JPG' },
            { label: 'Background', value: 'White or light' },
        ],
        whyMatters: 'WBCS uses the same 300×400px dimensions as UPSC, which is unusual for a state exam. The larger size allows for more detail and better print quality on admit cards and certificates. The max file size (60KB) is also specific to WBCS — different from both UPSC\'s 100KB and banking exams\' 50KB.',
        preparationTips: [
            'WBCS uses 300×400px (same as UPSC) but with a tighter max file size of 60KB (vs UPSC\'s 100KB). This tool handles the compression automatically.',
            'Since WBCS leads to WBAS (WB Administrative Service), WB Police Service, and other gazetted posts, use a professional photograph.',
        ],
        commonMistakes: [
            { mistake: 'Using banking exam photo dimensions (200×230px)', detail: 'WBCS requires 300×400px, significantly larger than the standard 200×230px used by IBPS and many other exams.' },
            { mistake: 'Assuming UPSC\'s 100KB limit applies', detail: 'WBCS max file size is 60KB, not 100KB. A photo prepared for UPSC may exceed WBCS limits.' },
        ],
        faqs: [
            { q: 'Why does WBCS use the same dimensions as UPSC?', a: 'WBPSC follows a 300×400px standard similar to UPSC for their civil service exams. The file size limit (60KB) is different though — UPSC allows up to 100KB.' },
            { q: 'Can I use my UPSC photo for WBCS?', a: 'The dimensions match (300×400px), but ensure the file size is under 60KB. UPSC photos compressed for 100KB may need additional compression for WBCS.' },
        ],
        relatedTools: [
            { href: '/upsc-photo-resizer', label: 'UPSC Photo Resizer (300×400px, up to 100KB)' },
            { href: '/image-compressor', label: 'Image Compressor' },
        ],
        verificationNote: 'Verify from the latest WBCS notification on wbpsc.gov.in.',
    },

}

export { EXAM_CONTENT }
