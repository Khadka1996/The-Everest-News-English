import { Inter, Poppins } from 'next/font/google';

// Optimize fonts - Local fonts are better for performance
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  preload: true,
});

/**
 * Performance-optimized font configuration
 * Use display: 'swap' to prevent FOUT (Flash of Unstyled Text)
 */
export const fontConfig = {
  inter,
  poppins,
  className: `${inter.variable} ${poppins.variable}`,
};

export default fontConfig;
