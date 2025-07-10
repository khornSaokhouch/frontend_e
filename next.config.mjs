/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**', // This allows any image path from the Google domain
      },
       {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000', // The port is important!
        pathname: '/storage/**', // Allows any image inside your storage folder
      },
    ],
  },
};

export default nextConfig;