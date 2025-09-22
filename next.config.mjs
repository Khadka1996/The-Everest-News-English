/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',       // Define the protocol
          hostname: 'potal.theeverestnews.com',  // The domain name for your images
          pathname: '/**',         // Matches all image paths
        },
      ],
    },
  };
  
  export default nextConfig;
  