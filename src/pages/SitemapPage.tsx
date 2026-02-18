import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { categories, tools } from '../data/tools';

const SitemapPage = () => {
  const toolsByCategory = categories.map(cat => ({
    ...cat,
    tools: tools.filter(t => t.category === cat.id).slice(0, 20),
  }));

  return (
    <>
      <Helmet>
        <title>Sitemap | imgtool.in - All Tools</title>
        <meta name="description" content="Complete sitemap of imgtool.in. Browse all 400+ free online image tools organized by category." />
        <link rel="canonical" href="https://imgtool.in/sitemap" />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sitemap
          </h1>
          <p className="text-xl text-blue-100">
            Browse all {tools.length}+ free online image tools
          </p>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Links
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {[
              { name: 'Home', href: '/' },
              { name: 'About', href: '/about' },
              { name: 'Contact', href: '/contact' },
              { name: 'Privacy', href: '/privacy' },
              { name: 'Terms', href: '/terms' },
              { name: 'Sitemap', href: '/sitemap' },
            ].map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-center text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                  <span className="text-white font-bold">{cat.name.charAt(0)}</span>
                </div>
                <span className="font-medium text-gray-900 dark:text-white">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Tools by Category */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
            All Tools
          </h2>
          <div className="space-y-12">
            {toolsByCategory.map((cat) => (
              <div key={cat.id}>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center mr-3`}>
                    <span className="text-white text-sm font-bold">{cat.name.charAt(0)}</span>
                  </div>
                  {cat.name}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {cat.tools.map((tool) => (
                    <Link
                      key={tool.id}
                      to={`/tool/${tool.slug}`}
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
                <Link
                  to={`/category/${cat.id}`}
                  className="inline-block mt-4 text-blue-600 hover:underline text-sm"
                >
                  View all {cat.name} tools →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Most Popular Tools
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
            {tools.filter(t => t.tier === 'tier1').slice(0, 24).map((tool) => (
              <Link
                key={tool.id}
                to={`/tool/${tool.slug}`}
                className="px-3 py-2 bg-white dark:bg-gray-900 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors truncate"
              >
                {tool.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default SitemapPage;
