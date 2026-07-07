/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"], // Allows Next.js to optimize and render your Cloudinary images
  },
};

module.exports = nextConfig;
