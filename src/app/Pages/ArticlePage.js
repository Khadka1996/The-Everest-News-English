import React, { Suspense, lazy } from 'react';

// Lazy load the sections in the desired sequence
const Homes = lazy(() => import('../Home/Homes'));
const Politics = lazy(() => import('../Home/Politics'));
const Tourism = lazy(() => import('../Home/Tourism'));
const Economics = lazy(() => import('../Home/Economics'));
const Lifestyle = lazy(() => import('../Home/Lifestile'));
const Sports = lazy(() => import('../Home/Sports'));
const International = lazy(() => import('../Home/International'));
const Science = lazy(() => import('../Home/Science'));
const Entertainment = lazy(() => import('../Home/Society'));
const PhotoGallery = lazy(() => import('../Home/PhotoGallery'));
const Videos = lazy(() => import('../ImageVideo/Video'));

// Empty fallback since skeleton loading is handled within each component
const EmptyFallback = () => null;

const ArticlePage = () => {
  return (
    <div>
      {/* Display Homes section at the top */}
      <Suspense fallback={<EmptyFallback />}>
        <Homes />
      </Suspense>

      {/* Display Politics section */}
     

      {/* Display Tourism section */}
      <Suspense fallback={<EmptyFallback />}>
        <Tourism />
      </Suspense>

      

      {/* Display Economics section */}
      <Suspense fallback={<EmptyFallback />}>
        <Economics />
      </Suspense>

       <Suspense fallback={<EmptyFallback />}>
        <Politics />
      </Suspense>

      {/* Display Lifestyle section */}
      <Suspense fallback={<EmptyFallback />}>
        <Lifestyle />
      </Suspense>

      {/* Display Sports section */}
      <Suspense fallback={<EmptyFallback />}>
        <Sports />
      </Suspense>

      {/* Display International section */}
      <Suspense fallback={<EmptyFallback />}>
        <International />
      </Suspense>

      {/* Display Science section */}
      <Suspense fallback={<EmptyFallback />}>
        <Science />
      </Suspense>

      {/* Display Entertainment section */}
      <Suspense fallback={<EmptyFallback />}>
        <Entertainment />
      </Suspense>

      {/* Display Photo Gallery */}
      <Suspense fallback={<EmptyFallback />}>
        <PhotoGallery />
      </Suspense>

      {/* Display Videos section */}
      <Suspense fallback={<EmptyFallback />}>
        <Videos />
      </Suspense>
    </div>
  );
};

export default ArticlePage;