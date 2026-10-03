import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["en", "pt", "es", "de", "fr", "ru", "tr", "id", "it"],
    defaultLocale: "en",
    localeDetection: false,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "wsrv.nl" },
    ],
  },
  sassOptions: {
    silenceDeprecations: ["legacy-js-api"],
  },
  headers: async () => [
    {
      source: "/:path*",
      headers: [{ key: "X-Frame-Options", value: "DENY" }],
    },
  ],
};

export default nextConfig;
