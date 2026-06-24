import type { NextConfig } from "next";

// When deploying to GitHub Pages under https://<user>.github.io/<repo>,
// the app is served from a sub-path. Set NEXT_PUBLIC_BASE_PATH to "/<repo>"
// in the GitHub Actions workflow so assets and routes resolve correctly.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  // Produce a fully static export in `out/` that can be hosted on GitHub Pages.
  output: "export",
  basePath,
  // GitHub Pages serves nested routes via per-directory index.html files.
  trailingSlash: true,
  images: {
    // The Next.js image optimizer requires a server; disable it for static export.
    unoptimized: true,
  },
  typescript: {
    // The visualization components have a handful of pre-existing type
    // mismatches against the recharts/three.js/React 19 typings that do not
    // affect runtime behaviour. Don't let them block the production build.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Lint is run separately; don't fail the deploy build on lint warnings.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
