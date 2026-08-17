import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray package-lock.json in ~/coding otherwise
  // makes Turbopack infer the parent directory as the root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
