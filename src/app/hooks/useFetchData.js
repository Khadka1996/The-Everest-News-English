import useSWR from 'swr';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://potal.theeverestnews.com/';

// Optimized fetcher with caching
const fetcher = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 10000, // 10 second timeout
    });
    return response.data;
  } catch (error) {
    console.error('Fetch error:', error.message);
    throw error;
  }
};

/**
 * Custom hook for fetching data with SWR
 * Provides automatic caching, deduplication, and revalidation
 * @param {string} endpoint - API endpoint (e.g., '/api/english/all')
 * @param {object} options - SWR options
 */
export const useFetchData = (endpoint, options = {}) => {
  const url = endpoint ? `${API_URL}${endpoint}` : null;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    revalidateIfStale: false,
    dedupingInterval: 60000, // 1 minute deduping
    focusThrottleInterval: 300000, // 5 minutes focus throttle
    errorRetryCount: 3,
    errorRetryInterval: 5000,
    ...options,
  });

  return {
    data,
    error,
    isLoading,
    mutate,
  };
};

/**
 * Optimized axios instance with interceptors
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Add any common headers
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default useFetchData;
