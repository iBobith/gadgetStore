import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Ensure Turbopack uses the project directory as root so it doesn't
  // incorrectly infer a parent workspace (avoids content scanning issues).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
