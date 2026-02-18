import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowRight, 
  Download, 
  Check, 
  AlertCircle,
  Sparkles,
  Zap,
  Shield,
  Clock
} from 'lucide-react';
import { getToolBySlug, categories } from '../data/tools';
import ImageUploader from '../components/tools/ImageUploader';

const ToolPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const tool = getToolBySlug(slug || '');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Tool Not Found</h1>
          <Link to="/" className="text-blue-600 hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  const category = categories.find(c => c.id === tool.category);

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl);
    setProcessedImage(null);
  };

  const handleProcess = async () => {
    if (!uploadedImage) return;
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setProcessedImage(uploadedImage);
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>{tool.metaTitle}</title>
        <meta name="description" content={tool.metaDescription} />
        <meta name="keywords" content={tool.keywords.join(', ')} />
        <link rel="canonical" href={`https://imgtool.in/tool/${tool.slug}`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={tool.name} />
        <meta property="og:description" content={tool.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://imgtool.in/tool/${tool.slug}`} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: tool.name,
            description: tool.description,
            url: `https://imgtool.in/tool/${tool.slug}`,
            applicationCategory: 'ImageProcessing',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'INR'
            }
          })}
        </script>
      </Helmet>

      {/* Breadcrumb */}
      <div className="bg-gray-100 dark:bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            {category && (
              <>
                <Link to={`/category/${category.id}`} className="hover:text-blue-600">{category.name}</Link>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
            <span className="text-gray-900 dark:text-white font-medium">{tool.name}</span>
          </div>
        </div>
      </div>

      {/* Tool Header */}
      <section className="bg-white dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r ${category?.color} text-white text-sm font-medium mb-6`}>
              <Sparkles className="w-4 h-4" />
              <span>Free Online Tool</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {tool.name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {tool.description}
            </p>
          </div>
        </div>
      </section>

      {/* Tool Interface */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Upload Area */}
            {!uploadedImage && (
              <div className="p-8">
                <ImageUploader onUpload={handleImageUpload} />
              </div>
            )}

            {/* Processing Area */}
            {uploadedImage && !processedImage && (
              <div className="p-8">
                <div className="mb-6">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    className="max-h-64 mx-auto rounded-lg"
                  />
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Change Image
                  </button>
                  <button
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        <span>Process Image</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Result Area */}
            {processedImage && (
              <div className="p-8">
                <div className="mb-6">
                  <img 
                    src={processedImage} 
                    alt="Processed" 
                    className="max-h-64 mx-auto rounded-lg"
                  />
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => {
                      setUploadedImage(null);
                      setProcessedImage(null);
                    }}
                    className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Start Over
                  </button>
                  <a
                    href={processedImage}
                    download={`imgtool-${tool.slug}.jpg`}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-colors flex items-center space-x-2"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Tool Features
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {tool.features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center flex-shrink-0">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-gray-700 dark:text-gray-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            How to Use
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tool.howToUse.map((step, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-xl p-6 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>
                <p className="text-gray-700 dark:text-gray-300">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {tool.faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  {faq.q}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 ml-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-900 rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">100% Secure</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Your images are never stored</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-900 rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Lightning Fast</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">Process in seconds</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 bg-white dark:bg-gray-900 rounded-xl p-6">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Always Free</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm">No hidden charges</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Tools */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            Related Tools
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                  <span className="text-white font-bold">{cat.name.charAt(0)}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white text-sm">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AdSense */}
      <section className="py-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-400 text-center mb-2">Advertisement</p>
            <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Google AdSense</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ToolPage;
