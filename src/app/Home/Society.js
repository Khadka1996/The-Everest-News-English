import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { IoTimeOutline } from 'react-icons/io5';

const AdvertisementComponent = ({ position }) => {
  const [advertisements, setAdvertisements] = useState([]);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await axios.get(`https://potal.theeverestnews.com/api/advertisements/${position}`);
        setAdvertisements(response.data.advertisements);
      } catch (error) {
        console.error(`Error fetching ${position} advertisements:`, error);
      }
    };

    fetchAdvertisements();
  }, [position]);

  const handleAdvertisementClick = (websiteLink) => {
    try {
      const trimmedLink = websiteLink.trim();
      const formattedLink = trimmedLink.match(/^https?:\/\//i) ? trimmedLink : `http://${trimmedLink}`;
      window.open(formattedLink, '_blank');
    } catch (error) {
      console.error('Error opening link:', error);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center">
      {advertisements.map((advertisement, index) => (
        <div key={index} className="advertisement cursor-pointer" onClick={() => handleAdvertisementClick(advertisement.websiteLink)}>
          <img className="rounded" src={`https://potal.theeverestnews.com/${advertisement.imagePath}`} alt="Advertisement" />
        </div>
      ))}
    </div>
  );
};

// Skeleton Loading Component
const CardSkeleton = () => {
  return (
    <div className="relative bg-gray-200 shadow-lg rounded-lg overflow-hidden">
      <div className="relative h-64">
        <div className="w-full h-full bg-gray-300 animate-pulse"></div>
        <div className="absolute top-4 left-4 bg-gray-400 bg-opacity-60 text-xs font-semibold py-1 px-3 rounded-lg flex items-center">
          <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="absolute top-4 right-4 bg-gray-400 bg-opacity-70 text-xs font-semibold py-1 px-3 rounded-lg">
          <div className="w-16 h-4 bg-gray-300 rounded animate-pulse"></div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-black/2">
          <div className="h-6 bg-gray-300 rounded animate-pulse mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

const Card = ({ id, headline, imageUrl, createdAt, category, onClick, onCategoryClick }) => {
  const timeAgo = formatDistanceToNow(parseISO(createdAt), { addSuffix: true });

  return (
    <div
      className="relative bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
      onClick={() => onClick(id)}
    >
      <div className="relative h-64">
        <img
          src={imageUrl}
          alt={headline}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={() => console.error('Failed to load image:', imageUrl)}
        />
        <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white text-xs font-semibold py-1 px-3 rounded-lg flex items-center">
          <IoTimeOutline className="mr-2" />
          <p>{timeAgo}</p>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onCategoryClick(category);
          }}
          className="absolute top-4 right-4 bg-[#25609A] bg-opacity-70 text-white text-xs font-semibold py-1 px-3 rounded-lg cursor-pointer hover:bg-opacity-90"
        >
          {category.toUpperCase()}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-black/2">
          <h2 className="text-sx font-semibold text-white leading-tight shadow-lg">
            {headline}
          </h2>
        </div>
      </div>
    </div>
  );
};

const Society = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://potal.theeverestnews.com/api/english/category/society');
        if (response.data.success) {
          const sortedArticles = response.data.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 6);
          setArticles(sortedArticles);
          console.log('Fetched and sorted articles:', sortedArticles);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to fetch articles. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleArticleClick = async (id) => {
    try {
      await axios.put(`https://potal.theeverestnews.com/api/english/articles/increment-views/${id}`);
      router.push(`/article/${id}`);
    } catch (error) {
      console.error('Error incrementing views:', error);
      setError('Error incrementing views. Please try again later.');
    }
  };

  const handleCategoryClick = (category) => {
    router.push(`category/${category}`);
  };

  return (
    <div className="mx-3 md:mx-10 lg:mx-18 py-6">
      <div className="mb-6 mt-2">
        <AdvertisementComponent position="english_society" />
      </div>
      
      {error && <p className="text-red-500">{error}</p>}
      
      {articles.length > 0 && (
        <div
          onClick={() => window.location.href = 'category/society'}
          className="flex items-center mb-5"
        >
          <span className="flex-none block px-4 py-2.5 text-xl cursor-pointer rounded leading-none font-medium bg-[#25609A] text-white hover:bg-[#81BB6C] transition-colors duration-300">
            Society
          </span>
          <span className="flex-grow block border-t border-[#25609A] ml-4"></span>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {loading ? (
          // Show skeleton loading while articles are loading
          Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))
        ) : (
          // Show actual articles when loaded
          articles.map((article) => {
            const imageUrl = `https://potal.theeverestnews.com/uploads/english/${article.photos[0]}`;
            return (
              <Card
                key={article._id}
                id={article._id}
                headline={article.headline}
                imageUrl={imageUrl}
                createdAt={article.createdAt}
                category={article.category}
                onClick={handleArticleClick}
                onCategoryClick={handleCategoryClick}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default Society;