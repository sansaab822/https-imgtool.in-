import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowRight, Grid3X3, Filter } from 'lucide-react';
import { categories, getToolsByCategory, type Tool } from '../data/tools';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [tools, setTools] = useState<Tool[]>([]);
  const [filteredTools, setFilteredTools] = useState<Tool[]>([]);
  const [filter, setFilter] = useState<'all' | 'tier1' | 'tier2' | 'tier3' | 'bonus'>('all');
  const category = categories.find(c => c.id === categoryId);

  useEffect(() => {
    if (categoryId) {
      const categoryTools = getToolsByCategory(categoryId);
      setTools(categoryTools);
      setFilteredTools(categoryTools);
    }
  }, [categoryId]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredTools(tools);
    } else {
      setFilteredTools(tools.filter(t => t.tier === filter));
    }
  }, [filter, tools]);

  if (!category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Category Not Found</h1>
          <Link to="/" className="text-blue-600 hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{category.name} - Free Online Tools | imgtool.in</title>
        <meta name="description" content={`Free ${category.name} tools online. 100+ tools - resize, edit, convert images. No registration required!`} />
        <meta name="keywords" content={`${category.name.toLowerCase()}, free tools, online ${category.name.toLowerCase()}, image tools`} />
        <link rel="canonical" href={`https://imgtool.in/category/${categoryId}`} />
      </Helmet>

      {/* Hero */}
      <section className={`bg-gradient-to-br ${category.color} py-16`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 text-white/80 mb-4">
            <Link to="/" className="hover:text-white">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-white">{category.name}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {category.name} Tools
          </h1>
          <p className="text-white/90 text-lg max-w-2xl">
            {tools.length}+ free {category.name.toLowerCase()} tools. 
            Process images instantly with no registration required.
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-2">
              <Grid3X3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-600 dark:text-gray-400">
                {filteredTools.length} tools available
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm"
              >
                <option value="all">All Tools</option>
                <option value="tier1">Most Popular</option>
                <option value="tier2">High Demand</option>
                <option value="tier3">Trending</option>
                <option value="bonus">AI Powered</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool) => (
              <Link
                key={tool.id}
                to={`/tool/${tool.slug}`}
                className="group bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
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

          {filteredTools.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 dark:text-gray-400">No tools found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Other Categories */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Explore Other Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.filter(c => c.id !== categoryId).map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
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
    </>
  );
};

export default CategoryPage;
