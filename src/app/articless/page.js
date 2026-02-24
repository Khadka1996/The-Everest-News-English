"use client"
import React, { useState, useEffect } from "react";
import { FaClock, FaFacebook, FaWhatsapp, FaFacebookMessenger, FaShareAlt, FaInstagram  } from 'react-icons/fa';
import { BsTwitterX } from "react-icons/bs";
import YouTube from 'react-youtube';
import { useParams } from "next/navigation";
import { formatDistanceToNow, parseISO } from 'date-fns';
import axios from "axios";
import Readmore from "../Home/Readmore";
import Image from "next/image";
import API_URL from '../config';

const ArticlePage = () => {
  const { id } = useParams();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAd, setShowAd] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        console.log(`Fetching article from: ${API_URL}/api/english/${id}`);
        const response = await axios.get(`${API_URL}/api/english/${id}`, {
          timeout: 10000,
          headers: { 'Content-Type': 'application/json' }
        });
        console.log('Article fetched:', response.data);
        setArticle(response.data.data || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching article data:", error.message);
        console.error("API URL:", API_URL);
        console.error("Article ID:", id);
        setError(error);
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleAdClose = () => {
    setShowAd(false);
  };

  const handleShare = async (platform) => {
    let shareUrl = '';
    const headline = article?.headline || '';
    const url = encodeURIComponent(window.location.href);

    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'messenger':
        shareUrl = `https://www.facebook.com/dialog/send?link=${url}&app_id=123456789`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${encodeURIComponent(headline)}`;
        break;
        case 'instagram':
          shareUrl = `https://www.instagram.com/direct/new/?text=${encodeURIComponent(`${headline} - ${window.location.href}`)}`;
          break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${headline} - ${window.location.href}`)}`;
        break;
      default:
        return;
    }

    try {
      window.open(shareUrl, '_blank');
      await axios.post(`${API_URL}/api/english/articles/${id}/share`, {
        platform,
      });
    } catch (error) {
      console.error(`Error sharing on ${platform}:`, error);
    }
  };

  const opts = {
    height: '400',
    width: '700',
    playerVars: {
      autoplay: 0,
    },
  };

  // Skeleton Loading Components
  const ArticleSkeleton = () => {
    return (
      <div className="mx-3 md:mx-10 lg:mx-20 flex flex-col md:flex-row gap-4">
        <div className="md:w-3/4">
          <div className="mt-6">
            <AdvertisementSkeleton />
          </div>
          <div className="my-5">
            {/* Headline Skeleton */}
            <div className="h-8 bg-gray-300 rounded animate-pulse mb-4 w-3/4"></div>
            {/* Subheadline Skeleton */}
            <div className="h-6 bg-gray-300 rounded animate-pulse mb-6 w-full"></div>
            
            {/* Meta info Skeleton */}
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 bg-gray-300 rounded animate-pulse w-32"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-gray-300 rounded animate-pulse w-24"></div>
                <div className="h-6 bg-gray-300 rounded animate-pulse w-6"></div>
                <div className="h-6 bg-gray-300 rounded animate-pulse w-6"></div>
                <div className="h-6 bg-gray-300 rounded animate-pulse w-6"></div>
                <div className="h-6 bg-gray-300 rounded animate-pulse w-6"></div>
              </div>
            </div>
            
            <div className="h-px bg-gray-300 my-4"></div>
            
            {/* Image Skeleton */}
            <div className="flex justify-center mb-4">
              <div className="w-full h-64 bg-gray-300 rounded animate-pulse"></div>
            </div>
            
            {/* Content Skeleton */}
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-2/3"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
              <div className="h-4 bg-gray-300 rounded animate-pulse w-3/4"></div>
            </div>
            
            {/* YouTube Skeleton */}
            <div className="my-6">
              <div className="w-full h-64 bg-gray-300 rounded animate-pulse"></div>
            </div>
            
            {/* Tags Skeleton */}
            <div className="text-center mt-5">
              <div className="h-4 bg-gray-300 rounded animate-pulse w-32 mx-auto"></div>
            </div>
          </div>
        </div>
        <div className="md:w-1/4 flex flex-col space-y-4">
          <AdvertisementSkeleton />
        </div>
      </div>
    );
  };

  const AdvertisementSkeleton = () => {
    return (
      <div className="flex flex-col justify-center items-center">
        <div className="w-full h-32 bg-gray-300 rounded animate-pulse mb-2"></div>
      </div>
    );
  };

  const AdvertisementComponent = ({ position }) => {
    const [advertisements, setAdvertisements] = useState([]);
    const [adLoading, setAdLoading] = useState(true);

    useEffect(() => {
      const fetchAdvertisements = async () => {
        try {
          const response = await axios.get(`${API_URL}/api/advertisements/${position}`);
          // Handle both array and object response formats
          const ads = Array.isArray(response.data) ? response.data : (response.data.advertisements || []);
          setAdvertisements(ads);
        } catch (error) {
          // Silently handle errors - it's okay if no ads exist for this position
          console.warn(`No advertisements found for position: ${position}`);
          setAdvertisements([]);
        } finally {
          setAdLoading(false);
        }
      };

      if (position) {
        fetchAdvertisements();
      } else {
        setAdLoading(false);
      }
    }, [position]);

    const handleAdvertisementClick = (websiteLink) => {
      try {
        const trimmedLink = websiteLink.trim();
        window.open(trimmedLink.match(/^https?:\/\//i) ? trimmedLink : `http://${trimmedLink}`, '_blank');
      } catch (error) {
        console.error('Error opening link:', error);
      }
    };

    if (adLoading) {
      return <AdvertisementSkeleton />;
    }

    return (
      <div className='flex flex-col justify-center items-center'>
        {advertisements.length > 0 && (
          <div>
            {advertisements.map((ad) => (
              <div key={ad._id} onClick={() => handleAdvertisementClick(ad.websiteLink)}>
                <Image
                 className='rounded mb-2' 
                 src={`${API_URL}/${ad.imagePath}`} 
                 alt="Advertisement"
                 width={300}
                 height={100}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*(?:\/|v=)|[^\/]*\/))([^"&?\/\s]{11})/);
    return match ? match[1] : '';
  };

  const timeAgo = article ? formatDistanceToNow(parseISO(article.createdAt), { addSuffix: true }) : '';

  const imageUri = article?.photos?.[0] ? `${API_URL}/uploads/english/${article.photos[0].split('/').pop()}` : '';

  if (loading) return <ArticleSkeleton />;
  if (error) return <p className="text-red-500 text-center py-8">Error loading article.</p>;
  
  return (
    <>
      <div className="mx-3 md:mx-10 lg:mx-20 flex flex-col md:flex-row gap-4">
        <div className="md:w-3/4">
          <div className="mt-6">
            <AdvertisementComponent position="english_top" />
          </div>
          {article && (
            <div className="my-5">
              <h1 className="text-3xl font-bold mb-2">{article.headline}</h1>
              <h4 className="text-lg text-gray-700 mb-4">{article.subheadline}</h4>
              <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600 flex items-center">
                  <FaClock className="mr-1" /> {new Date(article.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </p>
                <div className="flex items-center space-x-2">
                  <p className="text-gray-600 flex items-center">
                    Share <FaShareAlt />
                    {article.shareCount}
                  </p>
                  <button onClick={() => handleShare('facebook')} style={{ color: '#1877F2', fontSize: '24px' }}><FaFacebook /></button>
                  <button onClick={() => handleShare('messenger')} style={{ color: '#00B2FF', fontSize: '24px' }}><FaFacebookMessenger /></button>
                  <button onClick={() => handleShare('twitter')} style={{ color: '#000000', fontSize: '24px' }}><BsTwitterX /></button>
                  <button onClick={() => handleShare('whatsapp')} style={{ color: '#25D366', fontSize: '24px' }}><FaWhatsapp /></button>
                  <button onClick={() => handleShare('instagram')} style={{ color: '#E4405F', fontSize: '24px' }}><FaInstagram /></button>
                </div>
              </div>
              <hr className="my-4" />
              {article.photos?.length > 0 && (
                <div className="flex justify-center">
                  {article.photos.map((photo, index) => (
                    <Image
                      key={index}
                      src={`${API_URL}/uploads/english/${photo.split('/').pop()}`}
                      alt={`Photo ${index}`}
                      layout="responsive"
                      width={16}
                      height={9}
                      className="w-full rounded mb-4"
                    />
                  ))}
                </div>
              )}
              <div className="">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
              {article.youtubeLink && (
                <div className="my-6">
                  <YouTube videoId={getYouTubeVideoId(article.youtubeLink)} opts={opts} />
                </div>
              )}
              {article.tags && article.tags.length > 0 && (
                <div className="text-center mt-5">
                  <p>
                    Tags: {article.tags.map((tag, index) => (
                      <span key={index} className="inline-block px-2 py-1 border border-blue-600 rounded-lg mx-1 text-blue-600">
                        #{tag}{index < article.tags.length - 1 && ','}
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="md:w-1/4 flex flex-col space-y-4">
          <AdvertisementComponent position="english_sidebar1" />
        </div>
      </div>
      <Readmore />
    </>
  );
};

export default ArticlePage;