// Home Page Component
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  Zap, 
  Shield, 
  Clock, 
  Heart,
  Star,
  TrendingUp,
  Award
} from 'lucide-react';
import { categories, getFeaturedTools, getPopularTools } from '../data/tools';

const HomePage = () => {
  const featuredTools = getFeaturedTools();
  const popularTools = getPopularTools();

  const stats = [
    { value: '400+', label: 'Free Tools', icon: Zap },
    { value: '10M+', label: 'Users Served', icon: Heart },
    { value: '50M+', label: 'Images Processed', icon: Star },
    { value: '99.9%', label: 'Uptime', icon: Shield },
  ];

  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process images in seconds with our optimized cloud infrastructure.',
    },
    {
      icon: Shield,
      title: '100% Secure',
      description: 'Your images are processed securely and never stored on our servers.',
    },
    {
      icon: Clock,
      title: 'Always Free',
      description: 'No hidden charges, no registration required. Free forever.',
    },
    {
      icon: Heart,
      title: 'Made for India',
      description: 'Specialized tools for Indian government docs, exams, and festivals.',
    },
  ];

  return (
    <>
      <Helmet>
        <title>imgtool.in - 400+ Free Online Image Tools | Photo Editor, Resizer, Converter</title>
        <meta name="description" content="Free online image tools for India. Resize photos for Aadhaar, PAN, Passport, Exams. 400+ tools - Image compressor, converter, background remover, frames, and more. No registration!" />
        <meta name="keywords" content="image tools, photo resizer, image compressor, aadhaar photo, passport photo, pan card photo, exam photo, free online tools" />
        <link rel="canonical" href="https://imgtool.in" />
        
        {/* Open Graph */}
        <meta property="og:title" content="imgtool.in - 400+ Free Online Image Tools" />
        <meta property="og:description" content="Free online image tools for India. Resize photos for Aadhaar, PAN, Passport, Exams." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://imgtool.in" />
        <meta property="og:image" content="https://imgtool.in/og-image.jpg" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="imgtool.in - 400+ Free Online Image Tools" />
        <meta name="twitter:description" content="Free online image tools for India. Resize photos for Aadhaar, PAN, Passport, Exams." />
        <meta name="twitter:image" content="https://imgtool.in/twitter-image.jpg" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'imgtool.in',
            url: 'https://imgtool.in',
            description: '400+ Free Online Image Tools for India',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://imgtool.in/search?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          })}
        </script>
      </Helmet>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">India's #1 Image Tools Platform</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              400+ Free Online{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Image Tools
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Resize photos for Aadhaar, PAN, Passport, Exams. Compress, convert, edit images. 
              No registration required!
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/category/government"
                className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Explore Tools</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/tool/free-passport-size-photo-maker-india"
                className="w-full sm:w-auto px-8 py-4 bg-blue-700/50 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-blue-700/70 transition-colors border border-blue-400/30"
              >
                Popular: Passport Photo
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <stat.icon className="w-8 h-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Browse by Category
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Find the perfect tool for your needs. From government documents to social media, 
              we have got you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className="text-white text-2xl font-bold">{cat.name.charAt(0)}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {cat.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {cat.id === 'government' && 'Aadhaar, PAN, Passport, Voter ID'}
                  {cat.id === 'exam' && 'SSC, Bank, Railway, UPSC, NEET'}
                  {cat.id === 'wedding' && 'Biodata, Invitations, Frames'}
                  {cat.id === 'festival' && 'Diwali, Holi, Eid, Christmas'}
                  {cat.id === 'social' && 'WhatsApp, Instagram, Facebook'}
                  {cat.id === 'ai' && 'Background Remove, Enhance, Generate'}
                  {cat.id === 'convert' && 'JPG, PNG, PDF, Compress'}
                  {cat.id === 'edit' && 'Crop, Resize, Filter, Effects'}
                </p>
                <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Tools Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Featured Tools
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Most popular tools used by millions
              </p>
            </div>
            <Link
              to="/sitemap"
              className="hidden sm:flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {featuredTools.slice(0, 12).map((tool) => (
              <Link
                key={tool.id}
                to={`/tool/${tool.slug}`}
                className="group bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">{tool.name.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {tool.name}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Trending Now
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Tools that are trending this week
              </p>
            </div>
            <div className="flex items-center space-x-2 text-orange-500">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Hot</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {popularTools.slice(12, 24).map((tool) => (
              <Link
                key={tool.id}
                to={`/tool/${tool.slug}`}
                className="group bg-gray-50 dark:bg-gray-800 rounded-xl p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{tool.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-medium text-gray-900 dark:text-white text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                    {tool.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose imgtool.in?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We are India's most trusted image tools platform. Here's why millions choose us.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Images?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join millions of users who trust imgtool.in for their image processing needs.
            100% free, no registration required.
          </p>
          <Link
            to="/"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
          >
            <span>Get Started Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* AdSense Placeholder */}
      <section className="py-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-400 text-center mb-2">Advertisement</p>
            <div className="h-24 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">Google AdSense Banner</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
