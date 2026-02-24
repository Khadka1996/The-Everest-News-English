import React, { useState, useEffect } from 'react';
import axios from 'axios';
import defaultPhoto from '../Components/assets/logo.png';
import API_URL from '../config';

const TrendingArticles = () => {
  const [trendingArticles, setTrendingArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrendingArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/english/trending`);
      setTrendingArticles(response.data.data);
    } catch (error) {
      console.error('Error fetching trending articles:', error);
      setError('Error fetching trending articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleArticleClick = async (articleId) => {
    try {
      await axios.put(`${API_URL}/api/english/articles/increment-views/${articleId}`);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error incrementing views:', error);
      setError('Error incrementing views. Please try again later.');
    }
  };

  useEffect(() => {
    fetchTrendingArticles();
  }, []);

  // Skeleton Loading Component
  const TrendingSkeleton = () => (
    <div className="flex items-center mt-5 border-b-[1px] border-gray-300 p-1">
      {/* Numbering skeleton */}
      <div className="absolute z-10 flex items-center justify-center h-6 w-6 rounded-full bg-gray-300 border-[3px] border-gray-400 top-[-10px] left-[-10px] shadow-md animate-pulse"></div>

      {/* Image skeleton */}
      <div className="relative w-20 h-20 flex-shrink-0">
        <div className="w-full h-full bg-gray-300 rounded-l shadow-sm animate-pulse"></div>
      </div>

      {/* Text skeleton */}
      <div className="ml-4 flex-grow">
        <div className="h-4 bg-gray-300 rounded animate-pulse mb-2 w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div className="trending-container mx-auto py-6 max-w-m p-3">
      {(trendingArticles.length > 0 || loading) && (
        <h2 className="text-2xl md:text-3xl pl-2 border-l-4 font-sans font-bold border-[#7BB660] dark:text-[#25609A]">
          Trending Articles
        </h2>
      )}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <div className="space-y-4">
        {loading ? (
          // Show skeleton loading while articles are loading
          Array.from({ length: 7 }).map((_, index) => (
            <TrendingSkeleton key={index} />
          ))
        ) : (
          // Show actual trending articles when loaded
          trendingArticles.slice(0, 7).map((article, index) => (
            <div
              key={article._id}
              onClick={() => handleArticleClick(article._id)}
              className="flex items-center mt-5 border-b-[1px] border-[#25609A] hover:border-[#7BB660] p-1 cursor-pointer transform hover:scale-100"
            >
              {/* Numbering with small circle */}
              <div className="absolute z-10 flex items-center justify-center h-6 w-6 rounded-full bg-[#25609A] border-[3px] border-[#7BB660] top-[-10px] left-[-10px] shadow-md text-white text-xs font-semibold">
                {index + 1}
              </div>

              {/* Larger Image */}
              <div className="relative w-20 h-20 flex-shrink-0">
                {article.photos && article.photos.length > 0 ? (
                  <img
                    src={`${API_URL}/uploads/english/${article.photos[0].split('/').pop()}`}
                    alt={`Photo ${index}`}
                    className="object-cover w-full h-full rounded-l shadow-sm"
                  />
                ) : (
                  <img
                    src={defaultPhoto}
                    alt="Default Logo"
                    className="object-cover w-full h-full rounded-l shadow-sm"
                  />
                )}
              </div>

              {/* Article Headline */}
              <div className="ml-4 flex-grow">
                <h3 className="text-base font-medium text-gray-800 line-clamp-2 hover:text-blue-600 transition-colors">
                  <a href={`/article/${article._id}`}>
                    {article.headline}
                  </a>
                </h3>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TrendingArticles;