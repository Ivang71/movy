import Head from "next/head";
import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import type { HomeData } from "@/lib/types";
import { getHomeData } from "@/lib/data";
import { getMessages, pickNamespaces } from "@/lib/i18n";
import { HomeBanner } from "@/components/home/HomeBanner";
import { Top10 } from "@/components/home/Top10";
import { Rail } from "@/components/media/Rail";
import { StreamingRail } from "@/components/home/StreamingRail";
import { GenreRail } from "@/components/home/GenreRail";
import { PersonalRails } from "@/components/home/PersonalRails";
import { useStore } from "@/lib/store";
import { Seo } from "@/components/layout/Seo";

interface Props {
  data: HomeData;
  messages: Record<string, unknown>;
}

export default function HomePage({ data }: Props) {
  const t = useTranslations("Home");
  const tm = useTranslations("Meta");
  const router = useRouter();
  const { ready, profile, history, watchlist } = useStore();

  const continueWatching = ready && profile ? history.filter((h) => h.progress < 0.95).slice(0, 12).map((h) => h.item) : [];
  const progress = Object.fromEntries(history.map((h) => [`${h.item.mediaType}:${h.item.id}`, h.progress]));

  return (
    <>
      <Seo title={tm("title")} description={tm("description")} path="/" />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebSite", name: "Movy", alternateName: ["movy"], url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000" }) }}
        />
      </Head>
      <h1 className="sr-only">{tm("title")}</h1>
      <HomeBanner slides={data.hero} />
      <div className="layout-container flex flex-col gap-12 md:gap-16 mt-10 md:mt-14">
        {continueWatching.length ? <Rail title={t("continueWatching")} subtitle={t("continueWatching_subtitle")} href="/history" items={continueWatching} progress={progress} /> : null}
        <Top10 items={data.top10} locale={router.locale} />
        <Rail title={t("upcoming_tv")} subtitle={t("upcoming_tv_subtitle")} href="/browse/tv" items={data.upcomingTv} variant="upcoming" />
        <Rail title={t("trending")} subtitle={t("trending_subtitle")} items={data.trending} />
        <PersonalRails />
        {ready && profile && watchlist.length ? <Rail title={t("watchlist")} subtitle={t("watchlist_subtitle")} href="/watchlist" items={watchlist.slice(0, 12)} /> : null}
      </div>
      <div className="layout-container flex flex-col gap-12 md:gap-16 mt-12 md:mt-16">
        <StreamingRail initial={data.streaming} />
        <Rail title={t("recently_added_4k")} subtitle={t("recently_added_4k_subtitle")} href="/browse/movie?sort=newest" items={data.recent4k} />
        <Rail title={t("top_rated")} subtitle={t("top_rated_subtitle")} items={data.topRated} />
        <GenreRail pool={[...data.trending, ...data.topRated, ...data.recent4k, ...data.top10]} />
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async ({ locale }) => {
  const [data, messages] = await Promise.all([getHomeData(locale), getMessages(locale)]);
  return {
    props: { data, messages: pickNamespaces(messages, ["Meta", "Header", "Home", "Browse", "Search", "Account", "Footer", "Watchlist", "History"]) as Record<string, unknown> },
    revalidate: 1800,
  };
};
