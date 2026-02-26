import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow, parseISO } from 'date-fns';
import API_URL from '../config'; 



const AdvertisementComponent = ({ position }) => {
  const [advertisements, setAdvertisements] = useState([]);

  useEffect(() => {
    const fetchAdvertisements = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/advertisements/${position}`);
        const ads = Array.isArray(response.data) ? response.data : (response.data.advertisements || []);
        setAdvertisements(ads);
      } catch (error) {
        console.warn(`No advertisements for position: ${position}`);
        setAdvertisements([]);
      }
    };

    if (position) {
      fetchAdvertisements();
    }
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
          <img className="rounded" src={`${API_URL}/${advertisement.imagePath}`} alt="Advertisement" />
        </div>
      ))}
    </div>
  );
};
const Card = ({ id, headline, imageUrl, createdAt, category, onClick, onCategoryClick }) => {
  const timeAgo = formatDistanceToNow(parseISO(createdAt), { addSuffix: true });

  return (
    <div
      className="relative bg-white shadow-md rounded-lg overflow-hidden cursor-pointer hover:shadow-lg"
      onClick={() => onClick(id)}
    >
      <div className="relative h-52 bg-gray-300">
        <img
          src={imageUrl}
          alt={headline}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => console.error('Failed to load image:', imageUrl)}
        />
        <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white text-xs font-semibold py-1 px-2 rounded text-center">
          <p>{timeAgo}</p>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
            onCategoryClick(category);
          }}
          className="absolute top-2 right-2 bg-[#25609A] text-white text-xs font-semibold py-1 px-2 rounded cursor-pointer hover:bg-[#1a3f5a]"
        >
          {category.toUpperCase()}
        </div>
      </div>
      <div className="p-3">
        <h2 className="text-sm font-bold text-gray-800 line-clamp-2 hover:text-[#25609A]">
          {headline}
        </h2>
      </div>
    </div>
  );
};

const Readmore = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/english/all`);
        if (response.data.success) {
          const sortedArticles = response.data.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 12);
          setArticles(sortedArticles);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
        setError('Failed to fetch articles. Please try again later.');
      }
    };

    fetchArticles();
  }, []);

  const handleArticleClick = async (id) => {
    try {
      await axios.put(`${API_URL}/api/english/articles/increment-views/${id}`);
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
    <div className="mx-3 md:mx-10 lg:mx-18 py-8">
      <div className="mb-6">
        <AdvertisementComponent position="english_top2" />
      </div>
      
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      {articles.length > 0 && (
        <div className="mb-6">
          <h2 className="text-3xl font-extrabold text-white bg-gradient-to-r from-[#25609A] to-[#1a3f5a] py-3 px-6 rounded-lg shadow-md text-center">
            Read More
          </h2>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {articles.map((article) => {
          const imageUrl = `${API_URL}/uploads/english/${article.photos[0]}`;
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
        })}
      </div>
    </div>
  );
};

export default Readmore;
