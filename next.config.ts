import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  images: {
    remotePatterns: [
      // Demo & development — Unsplash
      { protocol: 'https', hostname: 'images.unsplash.com' },
      // Future: Cloudinary, S3, Vercel Blob
      { protocol: 'https', hostname: '**.cloudinary.com' },
      { protocol: 'https', hostname: '**.amazonaws.com' },
      { protocol: 'https', hostname: '**.vercel-storage.com' },
      { protocol: 'https', hostname: '**.public.blob.vercel-storage.com' },
      // Supabase
      { protocol: 'https', hostname: 'ztjepxsuiwuxdktpdzmm.supabase.co' },
    ],
  },
};

export default nextConfig;
