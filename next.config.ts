/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: false, // disables Turbopack, falls back to Webpack
  },
};

export default nextConfig;
