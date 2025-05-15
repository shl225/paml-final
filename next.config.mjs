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
  experimental: {
    // instrumentationHook: false,
    turbo: {                   
      trace: false,            
    },
  },
  webpack(config) {
    console.debug("[webpack] applying watcher-ignore rules")
    config.watchOptions = {
      ...(config.watchOptions || {}),
      ignored: [
        "**/*.joblib",
        "**/*.parquet",
        "**/*.pkl",
        "**/__pycache__/**",
        "**/backend/**",
        "**/models/**",
      ],
    }
    return config
  },
}

export default nextConfig
