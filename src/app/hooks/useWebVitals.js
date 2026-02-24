'use client';

import { useEffect } from 'react';
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

/**
 * Hook to monitor Web Vitals and performance metrics
 * Reports metrics to backend for analysis
 */
export const useWebVitals = () => {
  useEffect(() => {
    // Collect Core Web Vitals
    getCLS((metric) => reportMetric('CLS', metric));
    getFID((metric) => reportMetric('FID', metric));
    getFCP((metric) => reportMetric('FCP', metric));
    getLCP((metric) => reportMetric('LCP', metric));
    getTTFB((metric) => reportMetric('TTFB', metric));
  }, []);
};

/**
 * Report metrics to backend
 */
const reportMetric = (name, metric) => {
  if (typeof window !== 'undefined') {
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name}:`, metric.value.toFixed(3));
    }

    // Optional: Send to analytics backend
    if (process.env.NEXT_PUBLIC_ANALYTICS_URL) {
      try {
        navigator.sendBeacon(process.env.NEXT_PUBLIC_ANALYTICS_URL, JSON.stringify({
          name,
          value: metric.value,
          rating: metric.rating,
          delta: metric.delta,
          id: metric.id,
        }));
      } catch (error) {
        console.error('Failed to report metric:', error);
      }
    }
  }
};

export default useWebVitals;
