/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // For Google Sign-In Avatars
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      // For Local Laravel Backend (php artisan serve)
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      // For Production Laravel Backend (e.g., on Render) - if serving files directly
      {
        protocol: 'https',
        hostname: 'backend-e-rpi0.onrender.com',
        pathname: '/storage/**',
      },
      // For Backblaze B2 S3-Compatible URLs (This is the most important one for production)
      {
        protocol: 'https',
        hostname: 'laravel-images-b2.s3.us-east-005.backblazeb2.com',
        pathname: '/**', // Use '/**' to allow any path in the bucket
      },
      // Optional: For Backblaze Friendly URLs (less common for temp URLs)
      {
        protocol: 'https',
        hostname: 'f005.backblazeb2.com',
        pathname: '/file/laravel-images-b2/**',
      },
    ],
  },
};

export default nextConfig;