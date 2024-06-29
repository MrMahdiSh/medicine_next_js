/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  // basePath: "/medicine",
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
