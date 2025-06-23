'use client';

import { useEffect, useState } from 'react';
import { dramaApi, categoryApi, searchApi, type Drama, type Category } from '@/lib/api';
import { Search, Play, Star, Eye, Clock, TrendingUp } from 'lucide-react';
import DramaCover from '../components/DramaCover';

export default function HomePage() {
  const [hotDramas, setHotDramas] = useState<Drama[]>([]);
  const [newDramas, setNewDramas] = useState<Drama[]>([]);
  const [trendingDramas, setTrendingDramas] = useState<Drama[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [popularSearches, setPopularSearches] = useState<Array<{ keyword: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hotRes, newRes, trendingRes, categoriesRes, popularRes] = await Promise.all([
          dramaApi.getHot(8),
          dramaApi.getNew(8),
          dramaApi.getTrending(8),
          categoryApi.getList(),
          searchApi.getPopular(10)
        ]);

        setHotDramas(hotRes.data.data);
        setNewDramas(newRes.data.data);
        setTrendingDramas(trendingRes.data.data);
        setCategories(categoriesRes.data.data);
        setPopularSearches(popularRes.data.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">短剧平台</h1>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索短剧、演员、导演..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1.5 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                >
                  搜索
                </button>
              </div>
            </div>

            <nav className="flex space-x-4">
              <a href="/rankings" className="text-gray-700 hover:text-blue-600">榜单</a>
              <a href="/categories" className="text-gray-700 hover:text-blue-600">分类</a>
              <a href="/login" className="text-gray-700 hover:text-blue-600">登录</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">热门分类</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <a
                key={category._id}
                href={`/category/${category.name}`}
                className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow"
                style={{ borderTop: `4px solid ${category.color}` }}
              >
                <div className="text-lg font-medium text-gray-900">{category.name}</div>
                <div className="text-sm text-gray-500">{category.dramaCount || 0} 部</div>
              </a>
            ))}
          </div>
        </section>

        {/* Hot Dramas */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="mr-2 h-6 w-6 text-red-500" />
              热门推荐
            </h2>
            <a href="/hot" className="text-blue-600 hover:text-blue-800">查看更多 →</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {hotDramas.map((drama) => (
              <DramaCard key={drama._id} drama={drama} />
            ))}
          </div>
        </section>

        {/* New Dramas */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Star className="mr-2 h-6 w-6 text-green-500" />
              最新上线
            </h2>
            <a href="/new" className="text-blue-600 hover:text-blue-800">查看更多 →</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {newDramas.map((drama) => (
              <DramaCard key={drama._id} drama={drama} />
            ))}
          </div>
        </section>

        {/* Trending Dramas */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Clock className="mr-2 h-6 w-6 text-purple-500" />
              趋势榜单
            </h2>
            <a href="/trending" className="text-blue-600 hover:text-blue-800">查看更多 →</a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
            {trendingDramas.map((drama) => (
              <DramaCard key={drama._id} drama={drama} />
            ))}
          </div>
        </section>

        {/* Popular Searches */}
        {popularSearches.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">热门搜索</h2>
            <div className="bg-white rounded-lg p-6">
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => (
                  <a
                    key={index}
                    href={`/search?q=${encodeURIComponent(search.keyword)}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 transition-colors"
                  >
                    {search.keyword}
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 短剧平台. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Drama Card Component
function DramaCard({ drama }: { drama: Drama }) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = (e: any) => {
    console.error('Image failed to load:', drama.poster, e);
    console.error('Error details:', e.target?.src, e.target?.naturalWidth, e.target?.naturalHeight);
    setImageError(true);
  };

  const handleImageLoad = (e: any) => {
    console.log('Image loaded successfully:', drama.poster);
    console.log('Image dimensions:', e.target?.naturalWidth, 'x', e.target?.naturalHeight);
    setImageLoaded(true);
  };

  // 调试：输出drama数据
  console.log('Drama data:', { title: drama.title, poster: drama.poster });

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative">
        {/* 使用内嵌SVG组件 */}
        <DramaCover
          dramaId={drama.poster}
          title={drama.title}
          category={drama.category}
          rating={drama.rating}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          {drama.isHot && (
            <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">热门</span>
          )}
          {drama.isNew && (
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs ml-1">新剧</span>
          )}
        </div>
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs flex items-center">
          <Play className="h-3 w-3 mr-1" />
          {drama.episodes}集
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{drama.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{drama.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span>{drama.rating.toFixed(1)}</span>
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-1" />
            <span>{(drama.viewCount / 10000).toFixed(1)}万</span>
          </div>
        </div>
        
        <div className="mt-3">
          <a
            href={`/drama/${drama._id}`}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <Play className="h-4 w-4 mr-1" />
            立即观看
          </a>
        </div>
      </div>
    </div>
  );
}
