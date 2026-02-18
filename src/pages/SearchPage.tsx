import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, ArrowRight, X } from 'lucide-react';
import { searchTools, type Tool } from '../data/tools';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<Tool[]>([]);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (query) {
      const searchResults = searchTools(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <>
      <Helmet>
        <title>{query ? `Search: ${query}` : 'Search'} | imgtool.in</title>
        <meta name="description" content={`Search results for "${query}" - Free online image tools at imgtool.in`} />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* Search Header */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-8">
            Search Tools
          </h1>
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search 400+ image tools..."
              className="w-full px-6 py-4 pl-14 pr-12 rounded-2xl text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 border-0 focus:ring-4 focus:ring-white/30"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            {searchInput && (
              <button
                type="button"
                onClick={() => setSearchInput('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </form>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {query && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {results.length} results for "{query}"
              </h2>
            </div>
          )}

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((tool) => (
                <Link
                  key={tool.id}
                  to={`/tool/${tool.slug}`}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-lg font-bold">{tool.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                        {tool.name}
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 line-clamp-2">
                        {tool.description}
                      </p>
                      <div className="mt-3 flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium">
                        <span>Use Tool</span>
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try searching with different keywords
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Aadhaar', 'Passport', 'Compress', 'Background', 'Frame'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setSearchInput(suggestion);
                      setSearchParams({ q: suggestion });
                    }}
                    className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Search className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Start Searching
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Type above to search from 400+ image tools
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default SearchPage;
