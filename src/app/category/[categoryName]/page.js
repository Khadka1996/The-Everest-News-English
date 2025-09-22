"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { IoTimeOutline } from 'react-icons/io5';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import NavbarTop from '@/app/Components/Header/TopHeader';
import BottomHeader from '@/app/Components/Header/BottomHeader';
import Heading from '@/app/Components/Header/MiddleHeader';
import FooterBottom from '@/app/Components/Footer/FooterBottom';
import Photo from '@/app/Home/PhotoGallery';
import Videos from '@/app/ImageVideo/Video';
import Image from 'next/image';

const CategoryPage = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalArticles: 0,
    limit: 12
  });
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryName = pathname.split('/').pop();
  const currentPage = parseInt(searchParams.get('page')) || 1;

  // Skeleton Loading Component
  const CardSkeleton = () => {
    return (
      <div className="relative bg-gray-200 shadow-lg rounded-lg overflow-hidden">
        <div className="relative h-64">
          <div className="w-full h-full bg-gray-300 animate-pulse"></div>
          <div className="absolute top-4 left-4 bg-gray-400 bg-opacity-60 text-xs font-semibold py-1 px-3 rounded-lg flex items-center">
            <div className="w-20 h-4 bg-gray-300 rounded animate-pulse"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-black/2">
            <div className="h-6 bg-gray-300 rounded animate-pulse mb-2 w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded animate-pulse w-1/2"></div>
          </div>
        </div>
      </div>
    );
  };

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
            <Image
              className="rounded"
              src={`https://potal.theeverestnews.com/${advertisement.imagePath}`}
              alt="Advertisement"
              width={300}
              height={100}
            />
          </div>
        ))}
      </div>
    );
  };

  const Card = ({ article }) => {
    const timeAgo = formatDistanceToNow(parseISO(article.createdAt), { addSuffix: true });
    const imageUrl = `https://potal.theeverestnews.com/uploads/english/${article.photos[0]}`;

    const handleClick = async () => {
      try {
        await axios.put(`https://potal.theeverestnews.com/api/english/articles/increment-views/${article._id}`);
        router.push(`/article/${article._id}`);
      } catch (error) {
        console.error('Error incrementing views:', error);
      }
    };

    return (
      <div
        className="relative bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
        onClick={handleClick}
      >
        <div className="relative h-64">
          <img
            src={imageUrl}
            alt={article.headline}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
              console.error('Failed to load image:', imageUrl);
            }}
          />
          <div className="absolute top-4 left-4 bg-black bg-opacity-60 text-white text-xs font-semibold py-1 px-3 rounded-lg flex items-center">
            <IoTimeOutline className="mr-2" />
            <p>{timeAgo}</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-black/2">
            <h2 className="text-sx font-semibold text-white leading-tight shadow-lg">
              {article.headline}
            </h2>
          </div>
        </div>
      </div>
    );
  };

  // Fetch articles with pagination
  const fetchArticles = async (page = 1) => {
    setLoading(true);
    try {
      const category = categoryName.toLowerCase();
      const response = await axios.get(
        `https://potal.theeverestnews.com/api/english/category/${category}?page=${page}&limit=12`
      );
      
      if (response.data.success) {
        setArticles(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError('No articles found.');
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to fetch articles. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(currentPage);
  }, [categoryName, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      // Update URL without page reload
      const params = new URLSearchParams(searchParams);
      params.set('page', page.toString());
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  // Generate pagination buttons with smart range
  const getPaginationButtons = () => {
    const buttons = [];
    const { currentPage, totalPages } = pagination;
    
    // Always show first page
    if (currentPage > 2) {
      buttons.push(1);
      if (currentPage > 3) buttons.push('...');
    }
    
    // Show current page and surrounding pages
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      buttons.push(i);
    }
    
    // Always show last page
    if (currentPage < totalPages - 1) {
      if (currentPage < totalPages - 2) buttons.push('...');
      buttons.push(totalPages);
    }
    
    return buttons;
  };

  return (
    <>
      <NavbarTop />
      <Heading />
      <BottomHeader />
      
      <div className="mx-3 md:mx-10 lg:mx-18 py-6">
        <AdvertisementComponent position="english_top" />
        
        <div className="flex items-center mb-5 mt-5">
          <span className="flex-none block px-4 py-2.5 text-xl cursor-pointer rounded leading-none font-medium bg-[#25609A] text-white hover:bg-[#81BB6C] transition-colors duration-300">
            {categoryName} 
          </span>
          <span className="flex-grow block border-t border-[#25609A] ml-4"></span>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {loading ? (
            // Show skeleton loading while articles are loading
            Array.from({ length: 12 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))
          ) : articles.length > 0 ? (
            // Show actual articles when loaded
            articles.map((article) => (
              <Card key={article._id} article={article} />
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">No articles found for this category.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8 mb-5">
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>

              {/* Page Numbers */}
              {getPaginationButtons().map((page, index) => (
                <button
                  key={index}
                  onClick={() => typeof page === 'number' && handlePageChange(page)}
                  className={`w-10 h-10 rounded-lg ${
                    page === pagination.currentPage
                      ? 'bg-[#25609A] text-white border-2 border-[#7BB660]'
                      : page === '...'
                      ? 'bg-transparent cursor-default'
                      : 'bg-gray-200 hover:bg-gray-300'
                  } transition-colors`}
                  disabled={page === '...'}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        <AdvertisementComponent position="below_category" />
      </div>
      
      <Photo />
      <Videos />
      <FooterBottom />
    </>
  );
};

export default CategoryPage;