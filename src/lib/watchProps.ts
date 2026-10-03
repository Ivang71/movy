import type { GetServerSideProps } from "next";
import type { MediaType } from "./types";
import { getDetails, getSeasonEpisodes } from "./data";
import { getPageMessages } from "./i18n";
import type { WatchPageProps } from "@/components/watch/WatchPage";

/** Shared server-side loader for /movie, /tv and /anime detail routes. */
export function makeWatchProps(type: MediaType): GetServerSideProps<WatchPageProps> {
  return async ({ params, locale, res }) => {
    const parts = Array.isArray(params?.params) ? params!.params : [];
    const id = parts[0];
    if (!id || !/^\d+$/.test(id)) return { notFound: true };
    const details = await getDetails(type, id, locale);
    if (!details) return { notFound: true };
    const isTv = type !== "movie";
    const season = isTv ? Math.max(1, Number(parts[1] ?? details.seasons[0]?.seasonNumber ?? 1) || 1) : null;
    const episode = isTv ? Math.max(1, Number(parts[2] ?? 1) || 1) : null;
    const [episodes, messages] = await Promise.all([isTv && details.seasons.length ? getSeasonEpisodes(details.id, season ?? 1, locale) : Promise.resolve([]), getPageMessages(locale, ["WatchPage", "Player", "Download"])]);
    res.setHeader("Cache-Control", "public, s-maxage=1800, stale-while-revalidate=86400");
    return { props: { details, season, episode, episodes, messages } };
  };
}
