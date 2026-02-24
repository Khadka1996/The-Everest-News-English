/** @type {import('next').NextConfig} */
const nextConfig = {
  // ========== PERFORMANCE OPTIMIZATIONS ==========
  reactStrictMode: true,
  compress: true,
  
  // ========== IMAGE OPTIMIZATION ==========
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.67',
        port: '5000',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'potal.theeverestnews.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },

  // ========== BUILD OPTIMIZATION ==========
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  generateEtags: true,
  
  // ========== TRAILING SLASHES ==========
  trailingSlash: false,

  // ========== EXPERIMENTAL FEATURES ==========
  experimental: {
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
      'react-icons',
    ],
  },
};

export default nextConfig;
