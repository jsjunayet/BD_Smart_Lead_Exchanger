import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverActions: {
    bodySizeLimit: "10mb", // Increase this limit as needed (e.g., 10mb or more)
  },
  images: {
    domains: ["example.com", "res.cloudinary.com"],
  },
};

export default nextConfig;
