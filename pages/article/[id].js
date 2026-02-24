import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavbarTop from '@/app/Components/Header/TopHeader';
import MiddleHeader from '@/app/Components/Header/MiddleHeader';
import BottomHeader from '@/app/Components/Header/BottomHeader';
import Video from '@/app/ImageVideo/Video';
import FooterBottom from '@/app/Components/Footer/FooterBottom';
import '@/app/globals.css';
import ArticlePage from '@/app/articless/page';
import API_URL from '@/app/config';

const ServerPage = ({ initialData }) => {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(!initialData); // Set loading state based on initial data
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data again on the client side if not provided
    if (!data) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_URL}/api/english/${router.query.id}`);
          setData(response.data.data);
        } catch (err) {
          console.error('Error fetching article data:', err);
          setError('Failed to load article data.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [data, router.query.id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return (
      <div className="error-message">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  // Destructure data safely
  const { headline, content, photos } = data || {};

  // Validate headline and content
  if (!headline || !content) {
    return (
      <div className="error-message">
        <h2>Missing Data</h2>
        <p>Headline or content is missing.</p>
      </div>
    );
  }

  const handleShare = (platform) => {
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      messenger: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(window.location.href)}&app_id=123456789`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(headline)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${headline} - ${window.location.href}`)}`,
      instagram: `https://www.instagram.com/direct/new/?text=${encodeURIComponent(`${headline} - ${window.location.href}`)}`, // For Instagram direct messages
    };
    

    // Check if platform exists in shareUrls
    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank');
    }
  };

  const imageUri = photos?.length > 0 ? `${API_URL}/uploads/english/${photos[0].split('/').pop()}` : '';

  const stripHtmlTags = (html) => {
    return html.replace(/<[^>]+>/g, '');
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const cleanedContent = truncateText(stripHtmlTags(content), 160);

  return (
    <>
      <NavbarTop />
      <MiddleHeader />
      <BottomHeader />
      <Head>
        <title>{headline}</title>
        <meta name="description" content={cleanedContent} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://english.theeverestnews.com${router.asPath}`} />
        <meta property="og:title" content={headline} />
        <meta property="og:description" content={cleanedContent} />
        <meta property="og:image" content={imageUri} />
      </Head>
      <ArticlePage />
      <Video />
      <FooterBottom />
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { id } = context.params;
  let articleData = null;

  try {
    const response = await axios.get(`${API_URL}/api/english/${id}`);
    articleData = response.data.data || null;

    if (!articleData) {
      throw new Error('No data found');
    }
  } catch (error) {
    console.error('Error fetching article data:', error);
    // Return 404 if article not found
    if (error.response?.status === 404) {
      return { notFound: true };
    }
  }

  return {
    props: {
      initialData: articleData,
    },
  };
};

export default ServerPage;
