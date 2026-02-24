import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { IoTimeOutline} from 'react-icons/io5';
import API_URL from '../config';
import { IoMdPhotos } from "react-icons/io";

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

const Card = ({ id, headline, imageUrl, createdAt, onClick }) => {
  const timeAgo = formatDistanceToNow(parseISO(createdAt), { addSuffix: true });

  return (
    <div
      className="relative bg-black shadow-lg rounded-lg overflow-hidden cursor-pointer"
      onClick={() => onClick(id)}
    >
      <div className="relative h-80">
        <img
          src={imageUrl}
          alt={headline}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={() => console.error('Failed to load image:', imageUrl)}
        />
        {/* Photo Icon inside the image */}
        <div className="absolute inset-0 flex items-start justify-end bg-[#25609A] bg-opacity-20 hover:bg-opacity-70 transition-colors duration-300">
        <IoMdPhotos className="text-white text-5xl" />
        </div>
        {/* Time Ago Tag */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white text-xs font-semibold py-1 px-3 rounded-lg flex items-center">
          <IoTimeOutline className="mr-2 text-black" />
          <p>{timeAgo}</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent">
          <h2 className="text-l font-semibold text-white leading-tight shadow-lg">
            {headline}
          </h2>
        </div>
      </div>
    </div>
  );
};

const PhotoGallery = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/english/category/photogallery`);
        if (response.data.success) {
          const sortedArticles = response.data.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5); // Limit to 4 articles
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

  return (
    <>
    <div className="mr-2 ml-2 py-2">
      <div className="mb-6 mt-2">
        <AdvertisementComponent position="english_photogallery" />
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {articles.length > 0 && (
        <div
          onClick={() => window.location.href = 'category/photogallery'}
          className="flex items-center mb-5"
        >
          <span className="flex-none block px-4 py-2.5 text-xl cursor-pointer rounded leading-none font-medium bg-[#25609A] text-white hover:bg-[#81BB6C] transition-colors duration-300">
            Photo Gallery
          </span>
          <span className="flex-grow block border-t border-[#25609A] ml-4"></span>
        </div>
      )}
      <div className='bg-[#73B85D]'>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-2  ">
        {articles.map((article) => {
          const imageUrl = `${API_URL}/uploads/english/${article.photos[0]}`;
          return (
            <Card
              key={article._id}
              id={article._id}
              headline={article.headline}
              imageUrl={imageUrl}
              createdAt={article.createdAt}
              onClick={handleArticleClick}
            />
          );
        })}
      </div>
      
    </div>
   
    </div>
     <AdvertisementComponent position="english_videogallery" />
     </>
  );
};

export default PhotoGallery;
