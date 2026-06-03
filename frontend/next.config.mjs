/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development'

const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Allow Cloudinary images and local dev media
      "img-src 'self' data: blob: https://res.cloudinary.com http://localhost:8000 http://127.0.0.1:8000",
      // Allow inline styles for Tailwind/Framer Motion, self scripts
      "style-src 'self' 'unsafe-inline'",
      // Dev allows eval for HMR; production locks down
      isDev ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" : "script-src 'self'",
      // API backend connections
      "connect-src 'self' http://localhost:8000 http://127.0.0.1:8000 https://*.onrender.com",
      // No iframes
      "frame-ancestors 'none'",
      // Fonts from self only
      "font-src 'self'",
    ].join('; '),
  },
]

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
    ],
  },
}

export default nextConfig
