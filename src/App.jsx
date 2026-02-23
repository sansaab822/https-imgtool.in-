import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'

// Pages
const HomePage = lazy(() => import('./pages/HomePage'))
const AllToolsPage = lazy(() => import('./pages/AllToolsPage'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const ContactUs = lazy(() => import('./pages/ContactUs'))
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'))
const TermsOfService = lazy(() => import('./pages/TermsOfService'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
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

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Layout>
  )
}
