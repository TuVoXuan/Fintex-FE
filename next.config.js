/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PORT: process.env.PORT,
  },
  swcMinify: true,
}

module.exports = nextConfig
