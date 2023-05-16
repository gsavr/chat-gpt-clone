/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  //to make sure user picture shows up
  images: {
    domains: ["lh3.googleusercontent.com", "s.gravatar.com"],
  },
};

module.exports = nextConfig;
