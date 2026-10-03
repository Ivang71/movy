import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Film, Server, X } from "lucide-react";
import type { Details, Episode } from "@/lib/types";
import { PLAYBACK_SOURCES } from "@/lib/sources";
import { tmdbImage } from "@/lib/images";
import { cx } from "@/lib/format";

interface Props {
  details: Details;
  season?: number;
  episode?: number;
  episodes?: Episode[];
  onClose: () => void;
  onSelectEpisode?: (season: number, episode: number) => void;
}

const PREF_KEY = "movy:v1:server";

export function Player({ details, season, episode, episodes = [], onClose, onSelectEpisode }: Props) {
  const t = useTranslations("Player");
  const sources = useMemo(
    () => PLAYBACK_SOURCES.map((s) => ({ ...s, url: s.embed({ type: details.mediaType, id: details.id, imdbId: details.imdbId, season, episode }) })).filter((s) => s.url),
    [details, season, episode],
  );
  const [serverKey, setServerKey] = useState<string | null>(null);
  const [mode, setMode] = useState<"server" | "trailer">(sources.length ? "server" : "trailer");

  useEffect(() => {
    try {
      const pref = window.localStorage.getItem(PREF_KEY);
      setServerKey(pref && sources.some((s) => s.key === pref) ? pref : (sources[0]?.key ?? null));
    } catch {
      setServerKey(sources[0]?.key ?? null);
    }
  }, [sources]);

  const current = sources.find((s) => s.key === serverKey) ?? sources[0];
  const pick = (key: string) => {
    setServerKey(key);
    setMode("server");
    try {
      window.localStorage.setItem(PREF_KEY, key);
    } catch {
      /* noop */
    }
  };

  const isTv = details.mediaType !== "movie";
  const idx = episodes.findIndex((e) => e.episodeNumber === episode);
  const prev = idx > 0 ? episodes[idx - 1] : null;
  const next = idx >= 0 && idx < episodes.length - 1 ? episodes[idx + 1] : null;
  const backdrop = tmdbImage(details.backdrop, "w1280");

  return (
    <section className="relative z-[2] pt-[68px] md:pt-[80px]" aria-label={t("watching")}>
      <div className="layout-container">
        <div className="relative aspect-video w-full overflow-hidden rounded-[14px] border border-white/[0.08] bg-black shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]">
          {mode === "server" && current?.url ? (
            <iframe src={current.url} title={details.title} className="absolute inset-0 h-full w-full" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowFullScreen referrerPolicy="origin" />
          ) : mode === "trailer" && details.trailerId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${details.trailerId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
              title={`${details.title} – ${t("trailer")}`}
              className="absolute inset-0 h-full w-full"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0">
              {backdrop ? <img src={backdrop} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" /> : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                <Server className="mb-3 h-8 w-8 text-text-mid" aria-hidden="true" />
                <h2 className="text-lg font-semibold text-text-hi md:text-xl">{t("no_sources_title")}</h2>
                <p className="mt-2 max-w-md text-[13px] text-text-mid">{t("no_sources_body")}</p>
                {details.trailerId ? (
                  <button type="button" onClick={() => setMode("trailer")} className="control-3d mt-5 inline-flex h-10 items-center gap-2 rounded-full px-5 text-[13px] font-medium text-text-hi">
                    <Film className="h-4 w-4" aria-hidden="true" />
                    {t("watch_trailer")}
                  </button>
                ) : null}
              </div>
            </div>
          )}
          <button type="button" onClick={onClose} className="control-3d absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-white" aria-label={t("close")}>
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-text-mid">{t("watching")}</p>
            <h2 className="truncate text-lg font-semibold text-text-hi md:text-xl">
              {details.title}
              {isTv && season && episode ? (
                <span className="text-text-mid font-medium">
                  {" "}
                  · {t("season")} {season}, {t("episode")} {episode}
                  {episodes[idx]?.name ? ` · ${episodes[idx].name}` : ""}
                </span>
              ) : null}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isTv && onSelectEpisode && season ? (
              <>
                {prev ? (
                  <button type="button" onClick={() => onSelectEpisode(season, prev.episodeNumber)} className="control-3d inline-flex h-9 items-center gap-1 rounded-full px-3 text-[12.5px] font-medium text-text-hi" aria-label="Previous episode">
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />E{prev.episodeNumber}
                  </button>
                ) : null}
                {next ? (
                  <button type="button" onClick={() => onSelectEpisode(season, next.episodeNumber)} className="control-3d inline-flex h-9 items-center gap-1 rounded-full px-3 text-[12.5px] font-medium text-text-hi" aria-label="Next episode">
                    E{next.episodeNumber}
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ) : null}
              </>
            ) : null}
            <div className="control-3d flex h-9 items-center gap-0.5 rounded-[12px] p-0.5" role="group" aria-label={t("servers")}>
              <span className="px-2 text-[11px] font-medium uppercase tracking-wide text-text-mid">{t("servers")}</span>
              {sources.map((s) => (
                <button key={s.key} type="button" onClick={() => pick(s.key)} className={cx("h-8 rounded-[10px] px-3 text-[12.5px] font-medium transition-colors", mode === "server" && s.key === serverKey ? "bg-white/[0.12] text-white" : "text-text-mid hover:text-text-hi")} title={s.note}>
                  {s.label}
                </button>
              ))}
              {details.trailerId ? (
                <button type="button" onClick={() => setMode("trailer")} className={cx("h-8 rounded-[10px] px-3 text-[12.5px] font-medium transition-colors", mode === "trailer" ? "bg-white/[0.12] text-white" : "text-text-mid hover:text-text-hi")}>
                  {t("trailer")}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
