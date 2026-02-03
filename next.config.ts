import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",        // static export
  trailingSlash: true,     // important for inner pages
  reactCompiler: true,
};

export default nextConfig;
