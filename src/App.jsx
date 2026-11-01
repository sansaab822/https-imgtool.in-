import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

// Static & Core Pages
const HomePage = lazy(() => import('./pages/HomePage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const ContactUs = lazy(() => import('./pages/ContactUs'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const Disclaimer = lazy(() => import('./pages/Disclaimer'))
const NotFound = lazy(() => import('./pages/NotFound'))
const AllToolsPage = lazy(() => import('./pages/AllToolsPage'))

// ── 1. Core Editors ──
const ImageResizer = lazy(() => import('./tools/ImageResizer'))
const ImageCompressor = lazy(() => import('./tools/ImageCompressor'))
const CropImage = lazy(() => import('./tools/CropImage'))
const BgRemover = lazy(() => import('./tools/BgRemover'))
const ImageEnhancer = lazy(() => import('./tools/ImageEnhancer'))

// ── 2. Official ID & Document Tools ──
const PassportPhoto = lazy(() => import('./tools/PassportPhoto'))
const PanCardPhoto = lazy(() => import('./tools/PanCardPhoto'))
const AadhaarPrint = lazy(() => import('./tools/AadhaarPrint'))
const SignatureToTransparentPng = lazy(() => import('./tools/SignatureToTransparentPng'))
const DocumentPhotoResizer = lazy(() => import('./tools/DocumentPhotoResizer'))
const SscPhoto = lazy(() => import('./tools/SscPhoto'))
const GovernmentPhotoResizer = lazy(() => import('./tools/GovernmentPhotoResizer'))

// ── 3. PDF Tools ──
const PdfCrop = lazy(() => import('./tools/PdfCrop'))
const MergePdf = lazy(() => import('./tools/MergePdf'))
const SplitPdf = lazy(() => import('./tools/SplitPdf'))
const PdfToImage = lazy(() => import('./tools/PdfToImage'))
const ImageToPdf = lazy(() => import('./tools/ImageToPdf'))
const PdfPasswordRemover = lazy(() => import('./tools/PdfPasswordRemover'))

// ── 4. Technical & Web Utilities ──
const ImageDpiConverter = lazy(() => import('./tools/ImageDpiConverter'))
const ImageMetadataViewer = lazy(() => import('./tools/ImageMetadataViewer'))
const FaviconGenerator = lazy(() => import('./tools/FaviconGenerator'))
const ColorPaletteGenerator = lazy(() => import('./tools/ColorPaletteGenerator'))
const QRCodeGenerator = lazy(() => import('./tools/QRCodeGenerator'))
const ThreeDTextStl = lazy(() => import('./tools/ThreeDTextStl'))
const SvgToStl = lazy(() => import('./tools/SvgToStl'))

// ── 5. Essential Image Editing ──
const AddWatermark = lazy(() => import('./tools/AddWatermark'))
const CombineImagesSideBySide = lazy(() => import('./tools/CombineImagesSideBySide'))
const RotateImage = lazy(() => import('./tools/RotateImage'))
const FlipImage = lazy(() => import('./tools/FlipImage'))

// ── 6. Converters ──
const ImageConverter = lazy(() => import('./tools/ImageConverter'))

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50">
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
          {/* Core Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/all-image-converters" element={<AllToolsPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/disclaimer" element={<Disclaimer />} />

          {/* Blog */}
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog.html" element={<BlogPage />} />

          {/* 1. Core Editors */}
          <Route path="/image-resizer" element={<ImageResizer />} />
          <Route path="/image-compressor" element={<ImageCompressor />} />
          <Route path="/crop-image" element={<CropImage />} />
          <Route path="/bg-remover" element={<BgRemover />} />
          <Route path="/image-enhancer" element={<ImageEnhancer />} />

          {/* 2. Official ID & Document Tools (Protected) */}
          <Route path="/passport-size-photo" element={<PassportPhoto />} />
          <Route path="/pan-card-photo" element={<PanCardPhoto />} />
          <Route path="/aadhaar-card-print-setting-a4" element={<AadhaarPrint />} />
          <Route path="/signature-to-transparent-png" element={<SignatureToTransparentPng />} />
          <Route path="/extract-signature-from-image" element={<SignatureToTransparentPng />} />
          <Route path="/signature-resize-140x60" element={<DocumentPhotoResizer slug="signature-resize-140x60" docName="Signature" width={140} height={60} minKb={10} maxKb={20} note="Official 140×60px exam signature specification" />} />
          <Route path="/ssc-photo-date-adder" element={<SscPhoto />} />
          <Route path="/government-photo-resizer" element={<GovernmentPhotoResizer slug="government-photo-resizer" examName="Govt Exam" width={200} height={230} minKb={20} maxKb={50} extraInfo="Universal Government Exam Photo & Signature Resizer" />} />

          {/* 3. PDF Tools */}
          <Route path="/pdf-crop" element={<PdfCrop />} />
          <Route path="/merge-pdf" element={<MergePdf />} />
          <Route path="/split-pdf" element={<SplitPdf />} />
          <Route path="/delete-pdf-pages" element={<SplitPdf />} />
          <Route path="/extract-pdf-pages" element={<SplitPdf />} />
          <Route path="/pdf-to-jpg" element={<PdfToImage from="pdf" to="jpg" />} />
          <Route path="/pdf-to-png" element={<PdfToImage from="pdf" to="png" />} />
          <Route path="/jpg-to-pdf" element={<ImageToPdf from="jpg" />} />
          <Route path="/png-to-pdf" element={<ImageToPdf from="png" />} />
          <Route path="/webp-to-pdf" element={<ImageToPdf from="webp" />} />
          <Route path="/pdf-password-remover" element={<PdfPasswordRemover />} />

          {/* 4. Technical & Web Utilities */}
          <Route path="/image-dpi-converter" element={<ImageDpiConverter />} />
          <Route path="/convert-image-to-300-dpi" element={<ImageDpiConverter />} />
          <Route path="/image-metadata-viewer" element={<ImageMetadataViewer />} />
          <Route path="/remove-exif-data" element={<ImageMetadataViewer />} />
          <Route path="/favicon-generator" element={<FaviconGenerator />} />
          <Route path="/color-palette-generator" element={<ColorPaletteGenerator />} />
          <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
          <Route path="/3d-text-to-stl-generator" element={<ThreeDTextStl />} />
          <Route path="/svg-to-stl" element={<SvgToStl />} />

          {/* 5. Essential Image Editing */}
          <Route path="/add-watermark-to-image" element={<AddWatermark />} />
          <Route path="/combine-images-side-by-side" element={<CombineImagesSideBySide />} />
          <Route path="/rotate-image-custom-angle" element={<RotateImage />} />
          <Route path="/flip-image-horizontally" element={<FlipImage />} />

          {/* 6. Universal Image Converters & Primary Hubs */}
          <Route path="/image-converter" element={<ImageConverter from="any" to="jpg" />} />
          <Route path="/heic-to-jpg" element={<ImageConverter from="heic" to="jpg" />} />
          <Route path="/heic-to-png" element={<ImageConverter from="heic" to="png" />} />
          <Route path="/webp-to-jpg" element={<ImageConverter from="webp" to="jpg" />} />
          <Route path="/webp-to-png" element={<ImageConverter from="webp" to="png" />} />
          <Route path="/png-to-jpg" element={<ImageConverter from="png" to="jpg" />} />
          <Route path="/png-to-webp" element={<ImageConverter from="png" to="webp" />} />
          <Route path="/jpg-to-png" element={<ImageConverter from="jpg" to="png" />} />
          <Route path="/jpg-to-webp" element={<ImageConverter from="jpg" to="webp" />} />
          <Route path="/avif-to-jpg" element={<ImageConverter from="avif" to="jpg" />} />
          <Route path="/avif-to-png" element={<ImageConverter from="avif" to="png" />} />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
