/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // You can add image domains if needed for external images
  images: {
    domains: ["ddragon.leagueoflegends.com"],
  },
  // Environment variables will be accessed through process.env instead of astro:env
  env: {
    API_URL: "https://8818cad887f0.ngrok-free.app",
    BOT_INVITE_URL:
      "https://discord.com/oauth2/authorize?client_id=1316056047936471133&permissions=8&integration_type=0&scope=bot",
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "ngrok-skip-browser-warning",
            value: "true",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
