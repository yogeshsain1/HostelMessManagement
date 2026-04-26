/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  swcMinify: true,
  webpack: (config, { isServer }) => {
    // Disable cache to avoid Windows/OneDrive file access issues
    if (isServer) {
      config.cache = false
    }
    return config
  },
}

export default nextConfig