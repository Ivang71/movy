import type { GetServerSideProps } from "next";
import { LOCALES } from "@/lib/i18n";

const STATIC = ["", "/browse/movie", "/browse/tv", "/browse/anime", "/watchparty", "/help", "/legal/terms", "/legal/privacy", "/legal/dmca"];

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const now = new Date().toISOString();
  const urls = STATIC.flatMap((p) =>
    LOCALES.map((l) => `${base}${l === "en" ? "" : `/${l}`}${p}`),
  );
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map((u) => `<url><loc>${u}</loc><lastmod>${now}</lastmod><changefreq>daily</changefreq><priority>${u.endsWith(base) ? "1" : "0.8"}</priority></url>`)
    .join("\n")}\n</urlset>`;
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=604800");
  res.write(body);
  res.end();
  return { props: {} };
};

export default function Sitemap() {
  return null;
}
