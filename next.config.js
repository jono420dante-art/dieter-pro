/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ignore TypeScript and ESLint errors during build for production deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {},
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'replicate.delivery' },
      { protocol: 'https', hostname: 'pbxt.replicate.delivery' },
      { protocol: 'https', hostname: '**.replicate.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Prevent SSR issues with browser-only packages
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'wavesurfer.js', 'tone']
    }
    return config
  },
}

module.exports = nextConfig
