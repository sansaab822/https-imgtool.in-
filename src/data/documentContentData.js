export const documentContentData = {
    'aadhaar-photo-resizer': {
        title: 'Aadhaar Card Photo Resizer & Maker Online',
        intro: 'The official UIDAI portal requires a clear, passport-style photograph for Aadhaar Card updates and enrollments. Using an incorrectly sized photo can lead to application delays or rejection. Our Aadhaar Card Photo Resizer automatically crops and compresses your photo to the exact 200×230 pixel dimensions and file size required.',
        useCases: [
            'New Aadhaar enrollment applications',
            'Updating your Aadhaar photograph online',
            'SSUP (Self Service Update Portal) submissions'
        ],
        prepGuide: 'Ensure you are facing forward with a neutral expression. Use a plain white or light-colored background. No glasses with glare or hats should be worn.',
        sizeExplanation: 'Aadhaar applications typically require a 200×230 pixel JPG image, keeping the file size under 50KB to ensure smooth uploading.',
        faqs: [
            { q: 'Is the 200x230 size mandatory for Aadhaar?', a: 'Yes, the UIDAI system expects this specific dimension for digital uploads to avoid stretching or distortion.' },
            { q: 'Can I use a selfie?', a: 'It is highly recommended to use a proper passport-style photo rather than a casual selfie to ensure approval.' }
        ]
    },
    'voter-id-photo-resizer': {
        title: 'Voter ID (EPIC) Photo Resizer Online',
        intro: 'Applying for a new Voter ID (EPIC) or correcting details via the NVSP (National Voter\'s Service Portal) requires a photograph that meets strict Election Commission guidelines. This tool instantly resizes your image to the required specifications.',
        useCases: [
            'New Voter ID registration (Form 6)',
            'Correction of entries (Form 8)',
            'Replacement of EPIC card'
        ],
        prepGuide: 'The photo must show your full face clearly. The background should be a solid, light color (preferably white). Both ears should be visible.',
        sizeExplanation: 'For the NVSP portal, the standard requirement is a 3.5cm x 4.5cm photo (digitally roughly 200×230 to 250×320 pixels) with a file size under 100KB.',
        faqs: [
            { q: 'What is the maximum file size for Voter ID upload?', a: 'The NVSP portal generally requires the file size to be less than 100KB. This tool automatically compresses it.' },
            { q: 'Does the background have to be white?', a: 'While light blue or grey is sometimes accepted, a plain white background is the safest choice for Voter ID photos.' }
        ]
    },
    'driving-licence-photo-resizer': {
        title: 'Driving Licence Photo Resizer Online',
        intro: 'Uploading your photo and signature to the Parivahan Sewa portal (Sarathi) is a crucial step in getting your Learner\'s or Permanent Driving Licence in India. This tool formats your photo to the exact dimensions needed for RTO online applications.',
        useCases: [
            'Learner\'s Licence application',
            'Permanent Driving Licence application',
            'Driving Licence renewal or address change'
        ],
        prepGuide: 'Take a clear, recent photo in good lighting. Look directly at the camera. Do not wear sunglasses or tinted lenses.',
        sizeExplanation: 'Parivahan portal typically requires a passport-sized photo (approx 276×354 pixels) keeping the size strictly between 10KB and 20KB.',
        faqs: [
            { q: 'Why did the Parivahan portal reject my photo?', a: 'Most rejections happen if the file size is over 20KB or if the dimensions are incorrect. This tool locks the size strictly below 20KB.' },
            { q: 'Can I resize my signature here too?', a: 'This page is for the photograph. We have a separate tool specifically for the 140x60 signature resizing.' }
        ]
    },
    'visa-photo-resizer': {
        title: 'Visa Photo Resizer & Cropper Online',
        intro: 'Different countries have unique photo requirements for Visa applications. Whether you are applying for a US Visa (2x2 inches), Schengen Visa (35x45mm), or an Indian e-Visa, our tool helps you resize your photograph accurately for digital submission.',
        useCases: [
            'US, UK, and Schengen Visa applications',
            'Indian e-Visa digital upload',
            'Passport renewal digital applications'
        ],
        prepGuide: 'Visa photos have the strictest rules. You must have a plain white background, neutral facial expression, no glasses (for US Visas), and good lighting with no shadows on your face.',
        sizeExplanation: 'Dimensions vary by country (e.g., 600x600 pixels for US, 350x350 for Indian e-Visa). The tool will output the exact pixel dimensions you select.',
        faqs: [
            { q: 'Does this check if my photo meets Visa requirements?', a: 'This tool resizes and compresses the file to the correct digital dimensions. You must still ensure the photo content (background, expression) meets the embassy\'s rules.' },
            { q: 'What is the standard US Visa photo size?', a: 'The US requires a square photo, exactly 2x2 inches, which translates to 600x600 pixels minimum for digital uploads.' }
        ]
    },
    'resume-photo-resizer': {
        title: 'Resume & CV Photo Resizer',
        intro: 'A professional photograph on your Resume, CV, or LinkedIn profile creates a strong first impression. Our Resume Photo Resizer ensures your headshot is perfectly cropped, scaled, and optimized without losing quality, making your application look polished.',
        useCases: [
            'Adding a photo to a PDF or Word Resume',
            'Job portal profile pictures',
            'Corporate directory headshots'
        ],
        prepGuide: 'Wear professional attire. Use a clean, uncluttered background. Smile naturally and ensure good, even lighting on your face.',
        sizeExplanation: 'A standard resume photo is usually a 3:4 aspect ratio (like 300x400 pixels) and should be lightweight (under 100KB) so your resume document is easy to email.',
        faqs: [
            { q: 'Should I include a photo on my resume?', a: 'It depends on the country and industry. In many European and Asian countries, it is standard. In the US, it is generally discouraged unless specifically requested.' },
            { q: 'What is the best format for a resume photo?', a: 'JPG is best as it keeps the file size small, ensuring your final PDF resume remains email-friendly.' }
        ]
    },
    'thumb-impression-resizer': {
        title: 'Thumb Impression Resizer for Online Forms',
        intro: 'Many government exams (SSC, IBPS, UPSC) and official applications require you to upload a digital scan of your left thumb impression (LTI). This tool resizes your thumb impression image to the exact dimensions and KB limits required by these portals.',
        useCases: [
            'IBPS and SBI Bank Exam applications',
            'SSC (CGL, CHSL, MTS) form filling',
            'Railway (RRB) and State Govt exams'
        ],
        prepGuide: 'Use blue or black ink on a blank white paper. Do not smudge. Scan or photograph it in good lighting so the ridges are clearly visible.',
        sizeExplanation: 'Thumb impressions usually require a smaller dimension (like 200x230 or 140x60 pixels) and a strict file size limit, often between 10KB and 20KB.',
        faqs: [
            { q: 'Should I use blue or black ink?', a: 'Most portals accept both, but blue ink is often preferred as it clearly distinguishes the original from a photocopy. Always check the specific exam notification.' },
            { q: 'My image is blurry after resizing, is that okay?', a: 'The lines/ridges of your thumbprint must remain visible. If it is too blurry, try taking a closer, sharper photo of the impression before resizing.' }
        ]
    },
    'handwritten-declaration-resizer': {
        title: 'Handwritten Declaration Resizer Online',
        intro: 'Bank exams (IBPS, SBI) and various other recruitment portals require a scanned handwritten declaration to verify your handwriting. This tool resizes and compresses your declaration image to match their strict upload guidelines.',
        useCases: [
            'IBPS PO, Clerk, SO applications',
            'SBI PO and Clerk registrations',
            'Other banking and insurance exams'
        ],
        prepGuide: 'Write the exact text given in the official notification on white, unruled paper. Use black ink. Write clearly in your normal handwriting (do not use ALL CAPS).',
        sizeExplanation: 'Declarations require larger dimensions (typically 800x400 pixels) and usually have a file size limit between 50KB and 100KB.',
        faqs: [
            { q: 'Can I write the declaration in capital letters?', a: 'No. Official guidelines strictly state that handwritten declarations must not be in capital letters. It will be rejected.', },
            { q: 'What is the exact IBPS declaration size?', a: 'IBPS typically requires 800 x 400 pixels and a file size between 50KB and 100KB. This tool is pre-set to handle this.' }
        ]
    },
    'signature-resize-140x60': {
        title: 'Signature Photo Resizer (140x60 pixels)',
        intro: 'A digital signature is mandatory for almost every online application, from SSC and IBPS exams to PAN card and Driving Licence applications. The most common requirement is a 140x60 pixel dimension. This tool perfectly crops and compresses your signature to fit these exact rules.',
        useCases: [
            'SSC, IBPS, UPSC exam forms',
            'PAN Card and Aadhaar online updates',
            'Parivahan (Driving Licence) applications'
        ],
        prepGuide: 'Sign on a plain white, unruled paper using a black ink pen. Ensure the signature is not too small. Take a photo directly from above to avoid perspective distortion.',
        sizeExplanation: 'The standard 140x60 pixel ratio ensures your signature looks wide and natural. The file size is usually restricted to 10KB - 20KB.',
        faqs: [
            { q: 'Is it better to use black or blue ink for signatures?', a: 'Black ink is strongly recommended by almost all government portals as it scans and prints much clearer than blue.', },
            { q: 'How do I avoid my signature getting cut off?', a: 'The tool will show you a cropping box. Adjust the box so your entire signature fits inside it before hitting the resize button.' }
        ]
    }
};
