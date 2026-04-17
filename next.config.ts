import type { NextConfig } from "next";

const ytmusicApiBaseUrl =
  process.env.YTMUSIC_API_BASE_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    remotePatterns: [new URL("https://i.scdn.co/image/**")],
  },
  output: "standalone",
  // eslint-disable-next-line require-await
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        // Prevents MIME type sniffing, reducing the risk of malicious file
        // uploads.
        { key: "X-Content-Type-Options", value: "nosniff" },
        // Protects against clickjacking attacks by preventing your site from
        // being embedded in iframes.
        { key: "X-Frame-Options", value: "DENY" },
        // Controls how much referrer information is included with requests,
        // balancing security and functionality.
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
    {
      source: "/service-worker.js",
      headers: [
        // Ensures the service worker is interpreted correctly as JavaScript.
        { key: "Content-Type", value: "application/javascript; charset=utf-8" },
        // Prevents caching of the service worker, ensuring users always get
        // the latest version.
        { key: "Cache-Control", value: "no-cache, no-store, must-revalidate" },
        // Implements a strict Content Security Policy for the service worker,
        // only allowing scripts from the same origin.
        {
          key: "Content-Security-Policy",
          value: "default-src 'self'; script-src 'self'",
        },
      ],
    },
  ],
  // eslint-disable-next-line require-await
  rewrites: async () => {
    return [
      {
        source: "/api/ytmusic/:path*",
        destination: `${ytmusicApiBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
