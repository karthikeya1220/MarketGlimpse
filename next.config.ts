import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Performance
  compress: true,
  poweredByHeader: false,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.finnhub.io',
      }
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://s3.tradingview.com https://s3.tradingview.com https://www.tradingview.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://static.finnhub.io https://*.googleusercontent.com",
              "font-src 'self'",
              "connect-src 'self' https://finnhub.io https://generativelanguage.googleapis.com https://*.mongodb.net",
              "frame-src https://s3.tradingview.com",
            ].join('; '),
          },
        ],
      },
    ];
  },

  typedRoutes: true,
};

export default nextConfig;
