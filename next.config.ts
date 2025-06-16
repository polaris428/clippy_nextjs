import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com'],
  },

  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
};

export default nextConfig;
