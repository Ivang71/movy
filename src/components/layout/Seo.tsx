import Head from "next/head";
import { useRouter } from "next/router";
import { LOCALES } from "@/lib/i18n";

interface Props {
  title: string;
  description?: string;
  path?: string;
  image?: string | null;
  noindex?: boolean;
  type?: "website" | "video.movie" | "video.tv_show";
}

const OG_LOCALE: Record<string, string> = { en: "en_US", pt: "pt_BR", es: "es_ES", de: "de_DE", fr: "fr_FR", ru: "ru_RU", tr: "tr_TR", id: "id_ID", it: "it_IT" };

export function Seo({ title, description, path, image, noindex, type = "website" }: Props) {
  const router = useRouter();
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const clean = (path ?? router.asPath).split("?")[0].split("#")[0];
  const localized = (l: string) => `${base}${l === "en" ? "" : `/${l}`}${clean === "/" ? "" : clean}` || base;
  const canonical = localized(router.locale ?? "en") || base;
  const img = image ?? `${base}/og.png`;
  return (
    <Head>
      <title>{title}</title>
      <meta name="title" content={title} />
      {description ? <meta name="description" content={description} /> : null}
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow"} />
      <link rel="canonical" href={canonical} />
      {LOCALES.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={localized(l) || base} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={localized("en") || base} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Movy" />
      <meta property="og:title" content={title} />
      {description ? <meta property="og:description" content={description} /> : null}
      <meta property="og:image" content={img} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={OG_LOCALE[router.locale ?? "en"] ?? "en_US"} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description ? <meta name="twitter:description" content={description} /> : null}
      <meta name="twitter:image" content={img} />
    </Head>
  );
}
