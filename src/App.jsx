import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

// Pages
import HomePage from './pages/HomePage'
const AllToolsPage = lazy(() => import('./pages/AllToolsPage'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const ContactUs = lazy(() => import('./pages/ContactUs'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Tool Components
const ImageConverter = lazy(() => import('./tools/ImageConverter'))
const ImageResizer = lazy(() => import('./tools/ImageResizer'))
const ImageCompressor = lazy(() => import('./tools/ImageCompressor'))
const CropImage = lazy(() => import('./tools/CropImage'))
const BgRemover = lazy(() => import('./tools/BgRemover'))
const ImageEnhancer = lazy(() => import('./tools/ImageEnhancer'))
const ImageToArt = lazy(() => import('./tools/ImageToArt'))
const PassportPhoto = lazy(() => import('./tools/PassportPhoto'))
const PdfToImage = lazy(() => import('./tools/PdfToImage'))
const ImageToPdf = lazy(() => import('./tools/ImageToPdf'))
const PdfCrop = lazy(() => import('./tools/PdfCrop'))
const MergePdf = lazy(() => import('./tools/MergePdf'))
const ThreeDTextStl = lazy(() => import('./tools/ThreeDTextStl'))
const SvgToStl = lazy(() => import('./tools/SvgToStl'))
const AadhaarPrint = lazy(() => import('./tools/AadhaarPrint'))
const SscPhoto = lazy(() => import('./tools/SscPhoto'))
const PanCardPhoto = lazy(() => import('./tools/PanCardPhoto'))

// Video Tools
const VideoCompressor = lazy(() => import('./tools/VideoCompressor'))
const VideoConverter = lazy(() => import('./tools/VideoConverter'))
const VideoToAudio = lazy(() => import('./tools/VideoToAudio'))
const VideoTrimmer = lazy(() => import('./tools/VideoTrimmer'))
const VideoMerger = lazy(() => import('./tools/VideoMerger'))

// New PDF Tools
const PdfToExcel = lazy(() => import('./tools/PdfToExcel'))
const HtmlToPdf = lazy(() => import('./tools/HtmlToPdf'))
const RemovePdfWatermark = lazy(() => import('./tools/RemovePdfWatermark'))
const PdfPasswordRemover = lazy(() => import('./tools/PdfPasswordRemover'))

// Utility Tools
const CollageMaker = lazy(() => import('./tools/CollageMaker'))
const FaviconGenerator = lazy(() => import('./tools/FaviconGenerator'))
const ImageMetadataViewer = lazy(() => import('./tools/ImageMetadataViewer'))
const ColorPaletteGenerator = lazy(() => import('./tools/ColorPaletteGenerator'))
const WorksheetConverter = lazy(() => import('./tools/WorksheetConverter'))
const TextToHandwriting = lazy(() => import('./tools/TextToHandwriting'))
const HtmlTableGenerator = lazy(() => import('./tools/HtmlTableGenerator'))
const QRCodeGenerator = lazy(() => import('./tools/QRCodeGenerator'))

// Image Editing
const CombineImagesSideBySide = lazy(() => import('./tools/CombineImagesSideBySide'))
const AddWatermark = lazy(() => import('./tools/AddWatermark'))
const MergeImagesVertically = lazy(() => import('./tools/MergeImagesVertically'))
const BlendTwoPhotos = lazy(() => import('./tools/BlendTwoPhotos'))
const RotateImage = lazy(() => import('./tools/RotateImage'))
const FlipImage = lazy(() => import('./tools/FlipImage'))
const PolaroidEffect = lazy(() => import('./tools/PolaroidEffect'))
const AddDropShadow = lazy(() => import('./tools/AddDropShadow'))
const WetFloorReflection = lazy(() => import('./tools/WetFloorReflection'))
const ZoomedInset = lazy(() => import('./tools/ZoomedInset'))
const InstagramSafeZones = lazy(() => import('./tools/InstagramSafeZones'))

// Fun Effects
const MemeGenerator = lazy(() => import('./tools/MemeGenerator'))
const GifMaker = lazy(() => import('./tools/GifMaker'))
const LegoArtGenerator = lazy(() => import('./tools/LegoArtGenerator'))
const WarholPosterEffect = lazy(() => import('./tools/WarholPosterEffect'))
const EmojiMosaic = lazy(() => import('./tools/EmojiMosaic'))
const JigsawPuzzleMaker = lazy(() => import('./tools/JigsawPuzzleMaker'))
const FaceMorph = lazy(() => import('./tools/FaceMorph'))
const StickerAddVirtual = lazy(() => import('./tools/StickerAddVirtual'))

// AI Tools
const AIDenoiser = lazy(() => import('./tools/AIDenoiser'))
const AIColorizer = lazy(() => import('./tools/AIColorizer'))

// New Shared Category Tools
const GovernmentPhotoResizer = lazy(() => import('./tools/GovernmentPhotoResizer'))
const CompressToSize = lazy(() => import('./tools/CompressToSize'))
const SocialMediaResizer = lazy(() => import('./tools/SocialMediaResizer'))
const DocumentPhotoResizer = lazy(() => import('./tools/DocumentPhotoResizer'))
const Loader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 text-sm font-medium">Loading tool...</p>
    </div>
  </div>
)

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Home & Static Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/all-image-converters" element={<AllToolsPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog.html" element={<BlogPage />} />

          {/* Editors */}
          <Route path="/image-resizer" element={<ImageResizer />} />
          <Route path="/image-compressor" element={<ImageCompressor />} />
          <Route path="/crop-image" element={<CropImage />} />
          <Route path="/bg-remover" element={<BgRemover />} />
          <Route path="/image-enhancer" element={<ImageEnhancer />} />
          <Route path="/image-to-art" element={<ImageToArt />} />
          <Route path="/passport-size-photo" element={<PassportPhoto />} />
          <Route path="/image-converter" element={<ImageConverter from="jpg" to="png" />} />

          {/* Special */}
          <Route path="/3d-text-to-stl-generator" element={<ThreeDTextStl />} />
          <Route path="/svg-to-stl" element={<SvgToStl />} />
          <Route path="/aadhaar-card-print-setting-a4" element={<AadhaarPrint />} />
          <Route path="/ssc-photo-date-adder" element={<SscPhoto />} />
          <Route path="/pan-card-photo" element={<PanCardPhoto />} />

          {/* PDF Tools */}
          <Route path="/pdf-to-jpg" element={<PdfToImage to="jpg" />} />
          <Route path="/pdf-to-png" element={<PdfToImage to="png" />} />
          <Route path="/pdf-to-gif" element={<PdfToImage to="gif" />} />
          <Route path="/jpg-to-pdf" element={<ImageToPdf from="jpg" />} />
          <Route path="/png-to-pdf" element={<ImageToPdf from="png" />} />
          <Route path="/webp-to-pdf" element={<ImageToPdf from="webp" />} />
          <Route path="/heic-to-pdf" element={<ImageToPdf from="heic" />} />
          <Route path="/gif-to-pdf" element={<ImageToPdf from="gif" />} />
          <Route path="/svg-to-pdf" element={<ImageToPdf from="svg" />} />
          <Route path="/pdf-crop" element={<PdfCrop />} />
          <Route path="/merge-pdf" element={<MergePdf />} />

          {/* Modern Format Converters */}
          <Route path="/avif-to-jpg" element={<ImageConverter from="avif" to="jpg" />} />
          <Route path="/avif-to-png" element={<ImageConverter from="avif" to="png" />} />
          <Route path="/avif-to-webp" element={<ImageConverter from="avif" to="webp" />} />
          <Route path="/heic-to-jpg" element={<ImageConverter from="heic" to="jpg" />} />
          <Route path="/heic-to-png" element={<ImageConverter from="heic" to="png" />} />
          <Route path="/heic-to-webp" element={<ImageConverter from="heic" to="webp" />} />
          <Route path="/heic-to-gif" element={<ImageConverter from="heic" to="gif" />} />

          {/* WebP Converters */}
          <Route path="/webp-to-jpg" element={<ImageConverter from="webp" to="jpg" />} />
          <Route path="/webp-to-png" element={<ImageConverter from="webp" to="png" />} />
          <Route path="/webp-to-ico" element={<ImageConverter from="webp" to="ico" />} />
          <Route path="/webp-to-bmp" element={<ImageConverter from="webp" to="bmp" />} />
          <Route path="/webp-to-tiff" element={<ImageConverter from="webp" to="tiff" />} />
          <Route path="/webp-to-gif" element={<ImageConverter from="webp" to="gif" />} />

          {/* PNG Converters */}
          <Route path="/png-to-jpg" element={<ImageConverter from="png" to="jpg" />} />
          <Route path="/png-to-webp" element={<ImageConverter from="png" to="webp" />} />
          <Route path="/png-to-ico" element={<ImageConverter from="png" to="ico" />} />
          <Route path="/png-to-svg" element={<ImageConverter from="png" to="svg" />} />
          <Route path="/png-to-bmp" element={<ImageConverter from="png" to="bmp" />} />
          <Route path="/png-to-gif" element={<ImageConverter from="png" to="gif" />} />
          <Route path="/png-to-tiff" element={<ImageConverter from="png" to="tiff" />} />
          <Route path="/png-to-avif" element={<ImageConverter from="png" to="avif" />} />

          {/* JPG Converters */}
          <Route path="/jpg-to-png" element={<ImageConverter from="jpg" to="png" />} />
          <Route path="/jpg-to-webp" element={<ImageConverter from="jpg" to="webp" />} />
          <Route path="/jpg-to-ico" element={<ImageConverter from="jpg" to="ico" />} />
          <Route path="/jpg-to-svg" element={<ImageConverter from="jpg" to="svg" />} />
          <Route path="/jpg-to-bmp" element={<ImageConverter from="jpg" to="bmp" />} />
          <Route path="/jpg-to-gif" element={<ImageConverter from="jpg" to="gif" />} />
          <Route path="/jpg-to-tiff" element={<ImageConverter from="jpg" to="tiff" />} />
          <Route path="/jpg-to-avif" element={<ImageConverter from="jpg" to="avif" />} />

          {/* BMP Converters */}
          <Route path="/bmp-to-jpg" element={<ImageConverter from="bmp" to="jpg" />} />
          <Route path="/bmp-to-png" element={<ImageConverter from="bmp" to="png" />} />
          <Route path="/bmp-to-webp" element={<ImageConverter from="bmp" to="webp" />} />
          <Route path="/bmp-to-gif" element={<ImageConverter from="bmp" to="gif" />} />

          {/* GIF Converters */}
          <Route path="/gif-to-jpg" element={<ImageConverter from="gif" to="jpg" />} />
          <Route path="/gif-to-png" element={<ImageConverter from="gif" to="png" />} />
          <Route path="/gif-to-webp" element={<ImageConverter from="gif" to="webp" />} />
          <Route path="/gif-to-ico" element={<ImageConverter from="gif" to="ico" />} />
          <Route path="/gif-to-bmp" element={<ImageConverter from="gif" to="bmp" />} />

          {/* ICO Converters */}
          <Route path="/ico-to-png" element={<ImageConverter from="ico" to="png" />} />
          <Route path="/ico-to-jpg" element={<ImageConverter from="ico" to="jpg" />} />
          <Route path="/ico-to-gif" element={<ImageConverter from="ico" to="gif" />} />

          {/* SVG Converters */}
          <Route path="/svg-to-png" element={<ImageConverter from="svg" to="png" />} />
          <Route path="/svg-to-jpg" element={<ImageConverter from="svg" to="jpg" />} />

          {/* TIFF Converters */}
          <Route path="/tiff-to-jpg" element={<ImageConverter from="tiff" to="jpg" />} />
          <Route path="/tiff-to-png" element={<ImageConverter from="tiff" to="png" />} />
          <Route path="/tiff-to-webp" element={<ImageConverter from="tiff" to="webp" />} />

          {/* RAW/CR2 */}
          <Route path="/raw-to-jpg" element={<ImageConverter from="raw" to="jpg" />} />
          <Route path="/cr2-to-jpg" element={<ImageConverter from="cr2" to="jpg" />} />

          {/* Video Tools */}
          <Route path="/video-compressor" element={<VideoCompressor />} />
          <Route path="/video-converter" element={<VideoConverter />} />
          <Route path="/video-to-audio" element={<VideoToAudio />} />
          <Route path="/video-trimmer" element={<VideoTrimmer />} />
          <Route path="/video-merger" element={<VideoMerger />} />

          {/* New PDF Tools */}
          <Route path="/pdf-to-excel" element={<PdfToExcel />} />
          <Route path="/html-to-pdf" element={<HtmlToPdf />} />
          <Route path="/remove-pdf-watermark" element={<RemovePdfWatermark />} />
          <Route path="/pdf-password-remover" element={<PdfPasswordRemover />} />

          {/* Utility Tools */}
          <Route path="/collage-maker" element={<CollageMaker />} />
          <Route path="/favicon-generator" element={<FaviconGenerator />} />
          <Route path="/image-metadata-viewer" element={<ImageMetadataViewer />} />
          <Route path="/color-palette-generator" element={<ColorPaletteGenerator />} />
          <Route path="/worksheet-converter" element={<WorksheetConverter />} />
          <Route path="/text-to-handwriting" element={<TextToHandwriting />} />
          <Route path="/html-table-generator" element={<HtmlTableGenerator />} />
          <Route path="/qr-code-generator" element={<QRCodeGenerator />} />

          {/* Image Editing Tools */}
          <Route path="/combine-images-side-by-side" element={<CombineImagesSideBySide />} />
          <Route path="/add-watermark-to-image" element={<AddWatermark />} />
          <Route path="/merge-images-vertically" element={<MergeImagesVertically />} />
          <Route path="/blend-two-photos" element={<BlendTwoPhotos />} />
          <Route path="/rotate-image-custom-angle" element={<RotateImage />} />
          <Route path="/flip-image-horizontally" element={<FlipImage />} />
          <Route path="/polaroid-photo-effect" element={<PolaroidEffect />} />
          <Route path="/add-drop-shadow" element={<AddDropShadow />} />
          <Route path="/wet-floor-reflection" element={<WetFloorReflection />} />
          <Route path="/zoomed-inset-image" element={<ZoomedInset />} />
          <Route path="/instagram-safe-zones" element={<InstagramSafeZones />} />

          {/* Fun Effects Tools */}
          <Route path="/meme-generator" element={<MemeGenerator />} />
          <Route path="/gif-maker" element={<GifMaker />} />
          <Route path="/lego-art-generator" element={<LegoArtGenerator />} />
          <Route path="/warhol-poster-effect" element={<WarholPosterEffect />} />
          <Route path="/emoji-mosaic" element={<EmojiMosaic />} />
          <Route path="/jigsaw-puzzle-maker" element={<JigsawPuzzleMaker />} />
          <Route path="/face-morph" element={<FaceMorph />} />
          <Route path="/sticker-add-virtual" element={<StickerAddVirtual />} />

          {/* AI Tools */}
          <Route path="/ai-denoiser" element={<AIDenoiser />} />
          <Route path="/ai-colorizer" element={<AIColorizer />} />

          {/* ── Govt Exam Photo Resizers ── */}
          <Route path="/ssc-cgl-photo-resizer" element={<GovernmentPhotoResizer slug="ssc-cgl-photo-resizer" examName="SSC CGL" width={275} height={354} minKb={20} maxKb={50} extraInfo="Staff Selection Commission — Combined Graduate Level" />} />
          <Route path="/ssc-chsl-photo-signature-resizer" element={<GovernmentPhotoResizer slug="ssc-chsl-photo-signature-resizer" examName="SSC CHSL" width={275} height={354} minKb={20} maxKb={50} extraInfo="Combined Higher Secondary Level — also resize signature to 140×60px" />} />
          <Route path="/ssc-gd-photo-resizer" element={<GovernmentPhotoResizer slug="ssc-gd-photo-resizer" examName="SSC GD Constable" width={200} height={230} minKb={20} maxKb={50} extraInfo="General Duty Constable photo specification" />} />
          <Route path="/ssc-mts-photo-resizer" element={<GovernmentPhotoResizer slug="ssc-mts-photo-resizer" examName="SSC MTS" width={275} height={354} minKb={20} maxKb={50} extraInfo="Multi-Tasking Staff exam photo format" />} />
          <Route path="/ssc-signature-resizer" element={<GovernmentPhotoResizer slug="ssc-signature-resizer" examName="SSC Signature" width={140} height={60} minKb={10} maxKb={20} isSignature={true} extraInfo="SSC Signature — official portal spec 140×60px, 10–20KB" />} />
          <Route path="/ibps-po-photo-resizer" element={<GovernmentPhotoResizer slug="ibps-po-photo-resizer" examName="IBPS PO" width={200} height={230} minKb={20} maxKb={50} extraInfo="IBPS Probationary Officer photo spec" />} />
          <Route path="/ibps-clerk-photo-signature-resizer" element={<GovernmentPhotoResizer slug="ibps-clerk-photo-signature-resizer" examName="IBPS Clerk" width={200} height={230} minKb={20} maxKb={50} extraInfo="IBPS Clerk photo — also resize signature to 140×60px" />} />
          <Route path="/ibps-rrb-photo-resizer" element={<GovernmentPhotoResizer slug="ibps-rrb-photo-resizer" examName="IBPS RRB" width={200} height={230} minKb={20} maxKb={50} extraInfo="Regional Rural Banks photo specification" />} />
          <Route path="/sbi-po-photo-resizer" element={<GovernmentPhotoResizer slug="sbi-po-photo-resizer" examName="SBI PO" width={200} height={230} minKb={20} maxKb={50} extraInfo="State Bank of India — Probationary Officer" />} />
          <Route path="/sbi-clerk-photo-resizer" element={<GovernmentPhotoResizer slug="sbi-clerk-photo-resizer" examName="SBI Clerk" width={200} height={230} minKb={20} maxKb={50} extraInfo="SBI Junior Associate (Customer Support & Sales)" />} />
          <Route path="/upsc-photo-resizer" element={<GovernmentPhotoResizer slug="upsc-photo-resizer" examName="UPSC Civil Services" width={300} height={400} minKb={20} maxKb={100} extraInfo="Union Public Service Commission — IAS, IPS, IFS aspirants" />} />
          <Route path="/neet-photo-resizer" element={<GovernmentPhotoResizer slug="neet-photo-resizer" examName="NEET UG" width={413} height={531} minKb={10} maxKb={200} extraInfo="NTA NEET photo — 3.5×4.5cm, coloured passport size" />} />
          <Route path="/jee-main-photo-resizer" element={<GovernmentPhotoResizer slug="jee-main-photo-resizer" examName="JEE Main" width={200} height={230} minKb={10} maxKb={40} extraInfo="NTA JEE Main portal exact specification" />} />
          <Route path="/rrb-ntpc-photo-resizer" element={<GovernmentPhotoResizer slug="rrb-ntpc-photo-resizer" examName="RRB NTPC" width={200} height={230} minKb={20} maxKb={50} extraInfo="Railway Recruitment Board — Non-Technical Popular Categories" />} />
          <Route path="/up-police-photo-resizer" element={<GovernmentPhotoResizer slug="up-police-photo-resizer" examName="UP Police" width={275} height={354} minKb={20} maxKb={50} extraInfo="Uttar Pradesh Police Constable/SI photo specs" />} />
          <Route path="/bihar-police-photo-resizer" element={<GovernmentPhotoResizer slug="bihar-police-photo-resizer" examName="Bihar Police" width={200} height={230} minKb={20} maxKb={50} extraInfo="Bihar Police BPSSC portal photo specification" />} />
          <Route path="/rajasthan-police-photo-resizer" element={<GovernmentPhotoResizer slug="rajasthan-police-photo-resizer" examName="Rajasthan Police" width={200} height={230} minKb={20} maxKb={50} extraInfo="Rajasthan Police Constable/SI portal photo specs" />} />
          <Route path="/mp-police-photo-resizer" element={<GovernmentPhotoResizer slug="mp-police-photo-resizer" examName="MP Police" width={200} height={230} minKb={20} maxKb={50} extraInfo="Madhya Pradesh Police portal photo specification" />} />
          <Route path="/ctet-photo-resizer" element={<GovernmentPhotoResizer slug="ctet-photo-resizer" examName="CTET" width={200} height={230} minKb={20} maxKb={50} extraInfo="Central Teacher Eligibility Test — NIC portal specs" />} />
          <Route path="/gate-photo-resizer" element={<GovernmentPhotoResizer slug="gate-photo-resizer" examName="GATE" width={480} height={640} minKb={5} maxKb={40} extraInfo="Graduate Aptitude Test in Engineering — IIT portal" />} />
          <Route path="/post-office-gds-photo-resizer" element={<GovernmentPhotoResizer slug="post-office-gds-photo-resizer" examName="Post Office GDS" width={200} height={230} minKb={20} maxKb={50} extraInfo="Gramin Dak Sevak portal photo specification" />} />
          <Route path="/army-agniveer-photo-resizer" element={<GovernmentPhotoResizer slug="army-agniveer-photo-resizer" examName="Army Agniveer" width={200} height={230} minKb={20} maxKb={50} extraInfo="Indian Army Agniveer recruitment photo specs" />} />
          <Route path="/navy-agniveer-photo-resizer" element={<GovernmentPhotoResizer slug="navy-agniveer-photo-resizer" examName="Navy Agniveer" width={200} height={230} minKb={20} maxKb={50} extraInfo="Indian Navy Agniveer recruitment photo specs" />} />
          <Route path="/mpsc-photo-resizer" element={<GovernmentPhotoResizer slug="mpsc-photo-resizer" examName="MPSC" width={200} height={230} minKb={20} maxKb={50} extraInfo="Maharashtra Public Service Commission portal specs" />} />
          <Route path="/wbcs-photo-resizer" element={<GovernmentPhotoResizer slug="wbcs-photo-resizer" examName="WBCS" width={300} height={400} minKb={20} maxKb={60} extraInfo="West Bengal Civil Service photo specification" />} />

          {/* ── Compress to Exact Size ── */}
          <Route path="/compress-image-to-30kb" element={<CompressToSize slug="compress-image-to-30kb" targetKb={30} minKb={27} maxKb={30} />} />
          <Route path="/compress-image-to-40kb" element={<CompressToSize slug="compress-image-to-40kb" targetKb={40} minKb={36} maxKb={40} />} />
          <Route path="/compress-image-to-60kb" element={<CompressToSize slug="compress-image-to-60kb" targetKb={60} minKb={55} maxKb={60} />} />
          <Route path="/compress-image-to-70kb" element={<CompressToSize slug="compress-image-to-70kb" targetKb={70} minKb={65} maxKb={70} />} />
          <Route path="/compress-image-to-80kb" element={<CompressToSize slug="compress-image-to-80kb" targetKb={80} minKb={74} maxKb={80} />} />
          <Route path="/compress-image-to-120kb" element={<CompressToSize slug="compress-image-to-120kb" targetKb={120} minKb={110} maxKb={120} />} />
          <Route path="/compress-image-to-150kb" element={<CompressToSize slug="compress-image-to-150kb" targetKb={150} minKb={138} maxKb={150} />} />
          <Route path="/compress-image-20kb-30kb" element={<CompressToSize slug="compress-image-20kb-30kb" targetKb={25} minKb={20} maxKb={30} />} />

          {/* ── Social Media Resizers ── */}
          <Route path="/whatsapp-dp-resize" element={<SocialMediaResizer slug="whatsapp-dp-resize" platform="WhatsApp" mediaType="DP" width={500} height={500} tips={['Use PNG for logos/graphics', 'Square photos work best', 'Avoid very dark backgrounds']} />} />
          <Route path="/whatsapp-status-photo-resize" element={<SocialMediaResizer slug="whatsapp-status-photo-resize" platform="WhatsApp" mediaType="Status" width={750} height={1334} tips={['Portrait orientation is ideal', 'Leave space at top and bottom', 'Avoid text near edges']} />} />
          <Route path="/instagram-profile-photo-resize" element={<SocialMediaResizer slug="instagram-profile-photo-resize" platform="Instagram" mediaType="Profile Photo" width={110} height={110} tips={['Center your face', 'Avoid tiny text in the photo', 'Instagram will display it as a circle']} />} />
          <Route path="/instagram-post-resize" element={<SocialMediaResizer slug="instagram-post-resize" platform="Instagram" mediaType="Post" width={1080} height={1080} tips={['Square format performs best', 'Use high-contrast visuals', 'Keep important elements centered']} />} />
          <Route path="/instagram-reels-thumbnail-resize" element={<SocialMediaResizer slug="instagram-reels-thumbnail-resize" platform="Instagram" mediaType="Reels Thumbnail" width={1080} height={1920} tips={['Portrait orientation required', 'Keep text in the safe zone (middle 50%)', 'Bright thumbnails get more clicks']} />} />
          <Route path="/facebook-profile-photo-resize" element={<SocialMediaResizer slug="facebook-profile-photo-resize" platform="Facebook" mediaType="Profile Photo" width={170} height={170} tips={['Displays as a circle on desktop', 'Centered face works best', 'PNG for logos, JPG for photos']} />} />
          <Route path="/facebook-cover-photo-resize" element={<SocialMediaResizer slug="facebook-cover-photo-resize" platform="Facebook" mediaType="Cover Photo" width={851} height={315} tips={['Avoid faces/text at the left edge (overlapped by profile pic)', 'Use simple, bold visuals', 'Regularly update your cover for engagement']} />} />
          <Route path="/linkedin-profile-photo-resize" element={<SocialMediaResizer slug="linkedin-profile-photo-resize" platform="LinkedIn" mediaType="Profile Photo" width={400} height={400} tips={['Professional headshot works best', 'Light, neutral background recommended', 'Displays as a circle']} />} />
          <Route path="/linkedin-banner-resize" element={<SocialMediaResizer slug="linkedin-banner-resize" platform="LinkedIn" mediaType="Banner" width={1584} height={396} tips={['Add your job title or company', 'Avoid small text', 'Use brand colors for consistency']} />} />
          <Route path="/twitter-profile-photo-resize" element={<SocialMediaResizer slug="twitter-profile-photo-resize" platform="Twitter/X" mediaType="Profile Photo" width={400} height={400} tips={['Displays as a circle', 'Keep key elements centered', 'PNG preferred for logos']} />} />
          <Route path="/youtube-channel-art-resize" element={<SocialMediaResizer slug="youtube-channel-art-resize" platform="YouTube" mediaType="Channel Art" width={2560} height={1440} tips={['Design for the safe zone (1235x338px center)', 'Your art appears on TVs, phones & desktops', 'Avoid important content near edges']} />} />

          {/* ── Document & ID Photo Resizers ── */}
          <Route path="/aadhaar-photo-resizer" element={<DocumentPhotoResizer slug="aadhaar-photo-resizer" docName="Aadhaar Card" width={200} height={230} minKb={10} maxKb={50} note="UIDAI Aadhaar update/enrollment photo format" />} />
          <Route path="/voter-id-photo-resizer" element={<DocumentPhotoResizer slug="voter-id-photo-resizer" docName="Voter ID" width={200} height={230} minKb={10} maxKb={50} note="Election Commission of India voter enrollment photo" />} />
          <Route path="/driving-licence-photo-resizer" element={<DocumentPhotoResizer slug="driving-licence-photo-resizer" docName="Driving Licence" width={200} height={230} minKb={10} maxKb={50} note="Sarathi/RTO portal driving licence photo" />} />
          <Route path="/visa-photo-resizer" element={<DocumentPhotoResizer slug="visa-photo-resizer" docName="Visa Photo" width={413} height={531} minKb={10} maxKb={240} note="Standard 2×2 inch (51×51mm) — US, UK, Canada, Schengen" />} />
          <Route path="/resume-photo-resizer" element={<DocumentPhotoResizer slug="resume-photo-resizer" docName="Resume/CV" width={413} height={531} minKb={10} maxKb={50} note="Indian CV/resume photo — 3.5×4.5cm, under 50KB" />} />
          <Route path="/thumb-impression-resizer" element={<DocumentPhotoResizer slug="thumb-impression-resizer" docName="Thumb Impression" width={240} height={240} minKb={20} maxKb={50} note="IBPS/SBI thumb impression — 240×240px, 20–50KB" />} />
          <Route path="/handwritten-declaration-resizer" element={<DocumentPhotoResizer slug="handwritten-declaration-resizer" docName="Handwritten Declaration" width={800} height={400} minKb={10} maxKb={100} note="Bank exam handwritten declaration — 800×400px" />} />
          <Route path="/signature-resize-140x60" element={<DocumentPhotoResizer slug="signature-resize-140x60" docName="Signature" width={140} height={60} minKb={10} maxKb={20} note="Standard exam signature size — 140×60px, 10–20KB" />} />
          <Route path="/compress-image-under-100kb" element={<CompressToSize slug="compress-image-under-100kb" targetKb={90} minKb={10} maxKb={100} seoTitle="Compress Image Under 100KB — Free Online Tool" seoDesc="Compress any image to under 100KB for online form submissions. Free, private, browser-based." />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
