/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'backend-e-rpi0.onrender.com',
        port: '',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'f005.backblazeb2.com',
        port: '',
        pathname: '/file/laravel-images-b2/**',
      },
      {
        protocol: 'https',
        hostname: 'laravel-images-b2.s3.us-east-005.backblazeb2.com',
        port: '',
        pathname: '/category_images/**',
      },
      {
        protocol: 'https',
        hostname: 'laravel-images-b2.s3.us-east-005.backblazeb2.com',
        port: '',
        pathname: '/profile_images/**',
      },
    ],
  },
};

export default nextConfig;
