/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  serverRuntimeConfig: {
    apiURL: process.env.API_URL,
    appSecret: process.env.APP_SECRET,
  },
  publicRuntimeConfig: {
    authMessage: process.env.NEXT_PUBLIC_SECRET_DATA,
    authURL: process.env.NEXTAUTH_URL,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
  },
};

module.exports = nextConfig;
