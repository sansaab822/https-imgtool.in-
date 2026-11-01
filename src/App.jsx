import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'

// Pages
import HomePage from './pages/HomePage'
const AllToolsPage = lazy(() => import('./pages/AllToolsPage'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const ContactUs = lazy(() => import('./pages/ContactUs'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const Disclaimer = lazy(() => import('./pages/Disclaimer'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Core Image Editors
const ImageConverter = lazy(() => import('./tools/ImageConverter'))
const ImageResizer = lazy(() => import('./tools/ImageResizer'))
const ImageCompressor = lazy(() => import('./tools/ImageCompressor'))
const CropImage = lazy(() => import('./tools/CropImage'))
const BgRemover = lazy(() => import('./tools/BgRemover'))
const ImageEnhancer = lazy(() => import('./tools/ImageEnhancer'))
const ImageToArt = lazy(() => import('./tools/ImageToArt'))

// Document & Official ID Photo Tools (Protected & Unified)
const PassportPhoto = lazy(() => import('./tools/PassportPhoto'))
const PanCardPhoto = lazy(() => import('./tools/PanCardPhoto'))
const AadhaarPrint = lazy(() => import('./tools/AadhaarPrint'))
const SignatureToTransparentPng = lazy(() => import('./tools/SignatureToTransparentPng'))
const GovernmentPhotoResizer = lazy(() => import('./tools/GovernmentPhotoResizer'))
const SscPhoto = lazy(() => import('./tools/SscPhoto'))

// PDF Tools (Protected & Expanded)
const PdfCrop = lazy(() => import('./tools/PdfCrop'))
const MergePdf = lazy(() => import('./tools/MergePdf'))
const SplitPdf = lazy(() => import('./tools/SplitPdf'))
const PdfToImage = lazy(() => import('./tools/PdfToImage'))
const ImageToPdf = lazy(() => import('./tools/ImageToPdf'))
const PdfToExcel = lazy(() => import('./tools/PdfToExcel'))
const PdfPasswordRemover = lazy(() => import('./tools/PdfPasswordRemover'))

// 3D & Maker Tools
const ThreeDTextStl = lazy(() => import('./tools/ThreeDTextStl'))
const SvgToStl = lazy(() => import('./tools/SvgToStl'))

// Developer & Privacy Utilities
const ImageDpiConverter = lazy(() => import('./tools/ImageDpiConverter'))
const ImageMetadataViewer = lazy(() => import('./tools/ImageMetadataViewer'))
const FaviconGenerator = lazy(() => import('./tools/FaviconGenerator'))
const QRCodeGenerator = lazy(() => import('./tools/QRCodeGenerator'))

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
          {/* Static & Content Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/all-image-converters" element={<AllToolsPage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/blog.html" element={<BlogPage />} />

          {/* ── Core Image Editors ── */}
          <Route path="/image-resizer" element={<ImageResizer />} />
          <Route path="/image-compressor" element={<ImageCompressor />} />
          <Route path="/crop-image" element={<CropImage />} />
          <Route path="/bg-remover" element={<BgRemover />} />
          <Route path="/image-enhancer" element={<ImageEnhancer />} />
          <Route path="/image-to-art" element={<ImageToArt />} />

          {/* ── Document & ID Photo Tools (Protected) ── */}
          <Route path="/passport-size-photo" element={<PassportPhoto />} />
          <Route path="/pan-card-photo" element={<PanCardPhoto />} />
          <Route path="/aadhaar-card-print-setting-a4" element={<AadhaarPrint />} />
          <Route path="/signature-to-transparent-png" element={<SignatureToTransparentPng />} />
          <Route path="/extract-signature-from-image" element={<SignatureToTransparentPng />} />
          <Route path="/government-photo-resizer" element={<GovernmentPhotoResizer />} />
          <Route path="/ssc-photo-date-adder" element={<SscPhoto />} />

          {/* ── PDF Tools (Protected & Expanded) ── */}
          <Route path="/pdf-crop" element={<PdfCrop />} />
          <Route path="/merge-pdf" element={<MergePdf />} />
          <Route path="/split-pdf" element={<SplitPdf />} />
          <Route path="/extract-pdf-pages" element={<SplitPdf />} />
          <Route path="/delete-pdf-pages" element={<SplitPdf />} />
          <Route path="/pdf-to-jpg" element={<PdfToImage from="pdf" to="jpg" />} />
          <Route path="/pdf-to-png" element={<PdfToImage from="pdf" to="png" />} />
          <Route path="/pdf-to-gif" element={<PdfToImage from="pdf" to="gif" />} />
          <Route path="/jpg-to-pdf" element={<ImageToPdf from="jpg" />} />
          <Route path="/png-to-pdf" element={<ImageToPdf from="png" />} />
          <Route path="/webp-to-pdf" element={<ImageToPdf from="webp" />} />
          <Route path="/heic-to-pdf" element={<ImageToPdf from="heic" />} />
          <Route path="/pdf-to-excel" element={<PdfToExcel />} />
          <Route path="/pdf-password-remover" element={<PdfPasswordRemover />} />

          {/* ── 3D & Maker Tools ── */}
          <Route path="/3d-text-to-stl-generator" element={<ThreeDTextStl />} />
          <Route path="/svg-to-stl" element={<SvgToStl />} />

          {/* ── Developer & Privacy Utilities ── */}
          <Route path="/image-dpi-converter" element={<ImageDpiConverter />} />
          <Route path="/convert-image-to-300-dpi" element={<ImageDpiConverter />} />
          <Route path="/image-metadata-viewer" element={<ImageMetadataViewer />} />
          <Route path="/favicon-generator" element={<FaviconGenerator />} />
          <Route path="/qr-code-generator" element={<QRCodeGenerator />} />

          {/* ── Curated High-Demand Format Converters ── */}
          <Route path="/image-converter" element={<ImageConverter />} />
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

          {/* ── Client-Side Graceful Redirects for Consolidated / Retired Routes ── */}
          {/* Exam doorway clones -> Unified Government Photo Resizer */}
          {[
            '/ssc-cgl-photo-resizer', '/ssc-chsl-photo-signature-resizer', '/ssc-gd-photo-resizer',
            '/ssc-mts-photo-resizer', '/ibps-po-photo-resizer', '/ibps-clerk-photo-signature-resizer',
            '/ibps-rrb-photo-resizer', '/sbi-po-photo-resizer', '/sbi-clerk-photo-resizer',
            '/upsc-photo-resizer', '/neet-photo-resizer', '/jee-main-photo-resizer',
            '/rrb-ntpc-photo-resizer', '/up-police-photo-resizer', '/bihar-police-photo-resizer',
            '/rajasthan-police-photo-resizer', '/mp-police-photo-resizer', '/ctet-photo-resizer',
            '/gate-photo-resizer', '/post-office-gds-photo-resizer', '/army-agniveer-photo-resizer',
            '/navy-agniveer-photo-resizer', '/mpsc-photo-resizer', '/wbcs-photo-resizer',
            '/aadhaar-photo-resizer', '/voter-id-photo-resizer', '/driving-licence-photo-resizer',
            '/visa-photo-resizer', '/resume-photo-resizer', '/thumb-impression-resizer',
            '/handwritten-declaration-resizer'
          ].map(path => (
            <Route key={path} path={path} element={<Navigate to="/government-photo-resizer" replace />} />
          ))}

          {/* Signature resizers -> Signature to Transparent PNG */}
          {['/ssc-signature-resizer', '/signature-resize-140x60'].map(path => (
            <Route key={path} path={path} element={<Navigate to="/signature-to-transparent-png" replace />} />
          ))}

          {/* Compress-to-exact-KB doorway pages -> Image Compressor */}
          {[
            '/compress-image-to-30kb', '/compress-image-to-40kb', '/compress-image-to-60kb',
            '/compress-image-to-70kb', '/compress-image-to-80kb', '/compress-image-to-120kb',
            '/compress-image-to-150kb', '/compress-image-20kb-30kb', '/compress-image-under-100kb'
          ].map(path => (
            <Route key={path} path={path} element={<Navigate to="/image-compressor" replace />} />
          ))}

          {/* Social media resizer doorway pages -> Image Resizer */}
          {[
            '/whatsapp-dp-resize', '/whatsapp-status-photo-resize', '/instagram-profile-photo-resize',
            '/instagram-post-resize', '/instagram-reels-thumbnail-resize', '/facebook-profile-photo-resize',
            '/facebook-cover-photo-resize', '/linkedin-profile-photo-resize', '/linkedin-banner-resize',
            '/twitter-profile-photo-resize', '/youtube-channel-art-resize'
          ].map(path => (
            <Route key={path} path={path} element={<Navigate to="/image-resizer" replace />} />
          ))}

          {/* Retired low-traffic converter permutations -> Universal converter */}
          {[
            '/bmp-to-jpg', '/bmp-to-png', '/bmp-to-webp', '/bmp-to-gif',
            '/gif-to-jpg', '/gif-to-png', '/gif-to-webp', '/gif-to-ico', '/gif-to-bmp',
            '/ico-to-png', '/ico-to-jpg', '/ico-to-gif',
            '/svg-to-png', '/svg-to-jpg', '/svg-to-pdf',
            '/tiff-to-jpg', '/tiff-to-png', '/tiff-to-webp',
            '/png-to-ico', '/png-to-bmp', '/png-to-gif', '/png-to-tiff', '/png-to-avif',
            '/jpg-to-ico', '/jpg-to-bmp', '/jpg-to-gif', '/jpg-to-tiff', '/jpg-to-avif',
            '/webp-to-ico', '/webp-to-bmp', '/webp-to-tiff', '/webp-to-gif',
            '/avif-to-webp', '/heic-to-webp', '/heic-to-gif'
          ].map(path => (
            <Route key={path} path={path} element={<Navigate to="/image-converter" replace />} />
          ))}

          {/* 404 Catch-All */}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
