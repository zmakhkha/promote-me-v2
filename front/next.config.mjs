/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors
  },
  reactStrictMode: false, // Disable React Strict Mode (optional)
//   output: 'export', // ✨ Export as a static SPA
  trailingSlash: true, // Optional: ensures clean URLs like /about/index.html
};

export default nextConfig;
