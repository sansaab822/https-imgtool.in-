import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';
import { getPopularTools } from '../data/tools';

const NotFoundPage = () => {
  const popularTools = getPopularTools().slice(0, 8);

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | imgtool.in</title>
        <meta name="description" content="The page you are looking for does not exist. Explore our 400+ free online image tools." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-6xl font-bold text-white">404</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Oops! The page you are looking for does not exist or has been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Popular Tools */}
          <div className="text-left">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
              Popular Tools You Might Like
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {popularTools.map((tool) => (
                <Link
                  key={tool.id}
                  to={`/tool/${tool.slug}`}
                  className="px-4 py-3 bg-white dark:bg-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors text-center"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Suggestion */}
          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
            <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400 mb-2">
              <Search className="w-5 h-5" />
              <span className="font-medium">Looking for something specific?</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Try searching for the tool you need
            </p>
            <Link
              to="/search"
              className="inline-block px-6 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Search Tools
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFoundPage;
