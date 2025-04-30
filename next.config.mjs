/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // You can add image domains if needed for external images
  images: {
    domains: [],
  },
  // Environment variables will be accessed through process.env instead of astro:env
  env: {
    API_URL: process.env.API_URL || "http://localhost:3000",
    BOT_INVITE_URL: process.env.BOT_INVITE_URL,
  },
};

export default nextConfig;
