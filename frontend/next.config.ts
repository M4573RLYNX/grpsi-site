import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Images uploaded through the admin are stored in Vercel Blob.
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
};

export default nextConfig;
