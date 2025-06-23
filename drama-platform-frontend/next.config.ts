import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['picsum.photos', 'via.placeholder.com', 'example.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
