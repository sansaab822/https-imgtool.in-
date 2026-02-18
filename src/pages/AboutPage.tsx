import { Helmet } from 'react-helmet-async';
import { Heart, Zap, Shield, Users, Target, Award } from 'lucide-react';

const AboutPage = () => {
  const values = [
    {
      icon: Zap,
      title: 'Speed',
      description: 'We believe in lightning-fast processing. Every tool is optimized for instant results.',
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Your privacy is paramount. Images are processed securely and never stored.',
    },
    {
      icon: Heart,
      title: 'Accessibility',
      description: 'Free tools for everyone. No registration, no hidden charges, no limits.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Built for India, by Indians. We understand your unique needs.',
    },
  ];

  const stats = [
    { value: '400+', label: 'Free Tools' },
    { value: '10M+', label: 'Happy Users' },
    { value: '50M+', label: 'Images Processed' },
    { value: '4.9', label: 'User Rating' },
  ];

  return (
    <>
      <Helmet>
        <title>About Us | imgtool.in - India's #1 Image Tools Platform</title>
        <meta name="description" content="Learn about imgtool.in - India's most trusted free online image tools platform. 400+ tools for government documents, exams, weddings, and more." />
        <link rel="canonical" href="https://imgtool.in/about" />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About imgtool.in
          </h1>
          <p className="text-xl text-blue-100">
            India's most trusted free online image tools platform. 
            Built with love for 1.4 billion Indians.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Target className="w-16 h-16 mx-auto mb-6 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Our Mission
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            At imgtool.in, our mission is simple: to make image processing accessible to every Indian. 
            Whether you need a passport photo for your first job, resizing images for government exams, 
            or creating beautiful frames for festivals - we are here to help. All our tools are 100% free, 
            require no registration, and work instantly.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Our Story
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              imgtool.in was born from a simple observation: millions of Indians struggle with basic image 
              processing needs. From resizing photos for Aadhaar cards to creating perfect passport photos, 
              the existing solutions were either too expensive, too complicated, or simply not designed for 
              Indian requirements.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed mb-6">
              In 2024, we set out to change that. Starting with just 10 tools, we quickly grew to 400+ 
              specialized tools catering to every need - government documents, competitive exams, weddings, 
              festivals, social media, and more.
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">
              Today, imgtool.in serves millions of users every month, helping them process images quickly, 
              securely, and completely free of cost. We are proud to be India's #1 image tools platform, 
              and we are just getting started.
            </p>
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 mx-auto mb-6 text-yellow-500" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            Recognized & Trusted
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            imgtool.in has been featured in leading publications and trusted by millions of users across India.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Featured in Times of India', 'Product Hunt Top 10', 'Google for Startups', 'Digital India Initiative'].map((badge) => (
              <span
                key={badge}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-700 dark:text-gray-300 text-sm font-medium"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutPage;
