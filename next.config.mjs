/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.pixabay.com' },
      { protocol: 'https', hostname: 'inaturalist-open-data.s3.amazonaws.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'encrypted-tbn0.gstatic.com' },
    ],
    minimumCacheTTL: 3600, // seconds
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
  },
  experimental: {
    largePageDataBytes: 512000, // 500 KB
  },
};

export default nextConfig;
