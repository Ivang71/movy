import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Details, Episode, MediaItem } from "@/lib/types";
import { tmdbImage } from "@/lib/images";
import { Seo } from "@/components/layout/Seo";
import { WatchHero } from "./WatchHero";
import { Player } from "./Player";
import { Episodes } from "./Episodes";
import { CastRail } from "./CastRail";
import { AboutSection } from "./AboutSection";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MovieGrid } from "@/components/media/MovieGrid";
import { MovieCard } from "@/components/media/MovieCard";
import { Rail } from "@/components/media/Rail";
import { useStore } from "@/lib/store";

export interface WatchPageProps {
  details: Details;
  season: number | null;
  episode: number | null;
  episodes: Episode[];
  messages: Record<string, unknown>;
}

export function WatchPage({ details, season: initialSeason, episode: initialEpisode, episodes: initialEpisodes }: WatchPageProps) {
  const t = useTranslations("WatchPage");
  const router = useRouter();
  const { profile, addHistory } = useStore();
  const isTv = details.mediaType !== "movie";
  const playing = router.query.play === "true";
  const [season, setSeason] = useState(initialSeason ?? 1);
  const [episodes, setEpisodes] = useState<Episode[]>(initialEpisodes);
  const [loadingEps, setLoadingEps] = useState(false);
  const [visibleRecs, setVisibleRecs] = useState(12);
  const logged = useRef<string | null>(null);

  const basePath = `/${details.mediaType}/${details.id}`;

  useEffect(() => {
    setSeason(initialSeason ?? 1);
    setEpisodes(initialEpisodes);
  }, [initialSeason, initialEpisodes, details.id]);

  const changeSeason = useCallback(
    async (n: number) => {
      setSeason(n);
      setLoadingEps(true);
      try {
        const res = await fetch(`/api/episodes?id=${details.id}&season=${n}&locale=${router.locale ?? "en"}`);
        const data = (await res.json()) as { episodes: Episode[] };
        setEpisodes(data.episodes ?? []);
      } finally {
        setLoadingEps(false);
      }
    },
    [details.id, router.locale],
  );

  const play = useCallback(
    (s?: number, e?: number) => {
      const path = isTv ? `${basePath}/${s ?? season}/${e ?? initialEpisode ?? 1}` : basePath;
      router.push({ pathname: path, query: { play: "true" } }, undefined, { shallow: false, scroll: true });
    },
    [basePath, isTv, season, initialEpisode, router],
  );

  const closePlayer = () => router.push(isTv && initialSeason ? `${basePath}/${initialSeason}/${initialEpisode ?? 1}` : basePath, undefined, { shallow: true, scroll: true });

  // Record watch history when playback starts.
  useEffect(() => {
    if (!playing || !profile) return;
    const key = `${details.id}:${season}:${initialEpisode ?? 0}`;
    if (logged.current === key) return;
    logged.current = key;
    const item: MediaItem = { ...details };
    addHistory(item, 0.1, isTv ? (initialSeason ?? season) : undefined, isTv ? (initialEpisode ?? 1) : undefined);
  }, [playing, profile, details, season, initialSeason, initialEpisode, isTv, addHistory]);

  const metaTitle = `${details.title} | Movy`;
  const ogImage = tmdbImage(details.backdrop, "w1280");

  return (
    <>
      <Seo title={metaTitle} description={details.overview ?? undefined} path={basePath} image={ogImage} type={isTv ? "video.tv_show" : "video.movie"} />
      {playing ? (
        <Player details={details} season={isTv ? (initialSeason ?? season) : undefined} episode={isTv ? (initialEpisode ?? 1) : undefined} episodes={episodes} onClose={closePlayer} onSelectEpisode={(s, e) => play(s, e)} />
      ) : (
        <WatchHero details={details} onPlay={() => play()} />
      )}
      <div className="layout-container z-[1] w-full pb-4 lg:pb-20">
        {isTv && details.seasons.length ? <Episodes details={details} season={season} episodes={episodes} onSeason={changeSeason} onEpisode={(s, e) => play(s, e)} activeEpisode={playing ? (initialEpisode ?? undefined) : undefined} loading={loadingEps} /> : null}
        <CastRail cast={details.cast} />
        <AboutSection details={details} />
        {details.recommendations.length ? (
          <div className="mt-14">
            <div className="md:hidden">
              <Rail title={t("you_may_like")} subtitle={t("you_may_like_subtitle")} items={details.recommendations} />
            </div>
            <section className="hidden md:block">
              <SectionHeader title={t("you_may_like")} subtitle={t("you_may_like_subtitle")} />
              <MovieGrid>
                {details.recommendations.slice(0, visibleRecs).map((m) => (
                  <MovieCard key={`${m.mediaType}:${m.id}`} item={m} />
                ))}
              </MovieGrid>
              {details.recommendations.length > visibleRecs ? (
                <div className="mt-8 flex justify-center">
                  <button type="button" onClick={() => setVisibleRecs((v) => v + 12)} className="control-3d inline-flex h-10 items-center rounded-full px-6 text-[13px] font-medium text-text-hi">
                    {t("load_more")}
                  </button>
                </div>
              ) : null}
            </section>
          </div>
        ) : null}
      </div>
    </>
  );
}
