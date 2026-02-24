'use client';

import Image from 'next/image';
import { useState } from 'react';

/**
 * Optimized Image component with lazy loading and error handling
 * @param {string} src - Image source
 * @param {string} alt - Image alt text
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} className - CSS class
 * @param {boolean} priority - Preload image (use sparingly)
 */
export default function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  priority = false,
  ...props
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Default fallback image
  const fallbackImage = '/logo2.png';

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  return (
    <div className={`relative overflow-hidden bg-gray-200 ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-pulse" />
      )}
      <Image
        src={hasError ? fallbackImage : src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        loading={priority ? 'eager' : 'lazy'}
        onLoadingComplete={handleLoadingComplete}
        onError={handleError}
        className={`${isLoading ? 'blur-0' : ''} transition-all duration-300`}
        sizes={`(max-width: 640px) 100vw, 
                (max-width: 1024px) 80vw, 
                (max-width: 1280px) 60vw, 
                50vw`}
        quality={85}
        {...props}
      />
    </div>
  );
}
