import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { ArrowDownUp, LayoutGrid, List, Play, Search, X } from "lucide-react";
import type { Details, Episode } from "@/lib/types";
import { tmdbImage } from "@/lib/images";
import { formatLongDate, formatRuntime, cx } from "@/lib/format";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface Props {
  details: Details;
  season: number;
  episodes: Episode[];
  onSeason: (n: number) => void;
  onEpisode: (season: number, episode: number) => void;
  activeEpisode?: number;
  loading?: boolean;
}

export function Episodes({ details, season, episodes, onSeason, onEpisode, activeEpisode, loading }: Props) {
  const t = useTranslations("WatchPage");
  const router = useRouter();
  const [view, setView] = useState<"list" | "cards">("list");
  const [asc, setAsc] = useState(true);
  const [searching, setSearching] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    try {
      const v = window.localStorage.getItem("movy:v1:episodeView");
      if (v === "cards" || v === "list") setView(v);
    } catch {
      /* noop */
    }
  }, []);
  const setViewPersist = (v: "list" | "cards") => {
    setView(v);
    try {
      window.localStorage.setItem("movy:v1:episodeView", v);
    } catch {
      /* noop */
    }
  };

  const visible = useMemo(() => {
    let list = episodes;
    if (q.trim()) {
      const needle = q.trim().toLowerCase();
      list = list.filter((e) => e.name.toLowerCase().includes(needle) || String(e.episodeNumber) === needle);
    }
    return asc ? list : [...list].reverse();
  }, [episodes, q, asc]);

  const seasonObj = details.seasons.find((s) => s.seasonNumber === season);
  const title = seasonObj && seasonObj.name && !/^season \d+$/i.test(seasonObj.name) ? seasonObj.name : t("season_n", { n: season });

  return (
    <section className="mt-9">
      <SectionHeader
        title={title}
        subtitle={episodes.length ? t("season_episodes", { count: episodes.length }) : undefined}
        aside={
          <>
            <div className={cx("control-3d flex h-9 items-center overflow-hidden rounded-[12px] text-[12.5px] font-medium text-text-hi transition-[width]", searching ? "w-56 px-2" : "w-9 justify-center")}>
              {searching ? (
                <>
                  <Search className="h-4 w-4 shrink-0 text-text-mid" aria-hidden="true" />
                  <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search_episode")} className="h-full w-full bg-transparent px-2 text-[12.5px] text-text-hi placeholder:text-text-mid focus:outline-hidden" />
                  <button
                    type="button"
                    onClick={() => {
                      setQ("");
                      setSearching(false);
                    }}
                    className="text-text-mid hover:text-text-hi"
                    aria-label="Close search"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setSearching(true)} className="flex h-full w-full items-center justify-center text-text-mid hover:text-text-hi" aria-label={t("search_episode")}>
                  <Search className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
            <button type="button" onClick={() => setAsc((a) => !a)} className="control-3d flex h-9 w-9 items-center justify-center rounded-[12px] text-text-mid transition-colors hover:text-primary" aria-label={t("toggle_sort")}>
              <ArrowDownUp className="h-4 w-4" aria-hidden="true" />
            </button>
            <div className="control-3d flex h-9 shrink-0 items-center rounded-[12px] p-0.5" role="group" aria-label={t("episode_layout")}>
              <button type="button" onClick={() => setViewPersist("list")} aria-pressed={view === "list"} className={cx("relative flex h-8 w-8 items-center justify-center rounded-[10px] transition-colors", view === "list" ? "bg-white/[0.1] text-text-hi" : "text-text-mid hover:text-text-hi")} aria-label={t("view_list")}>
                <List className="h-4 w-4" aria-hidden="true" />
              </button>
              <button type="button" onClick={() => setViewPersist("cards")} aria-pressed={view === "cards"} className={cx("relative flex h-8 w-8 items-center justify-center rounded-[10px] transition-colors", view === "cards" ? "bg-white/[0.1] text-text-hi" : "text-text-mid hover:text-text-hi")} aria-label={t("view_cards")}>
                <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </>
        }
      />
      {details.seasons.length > 1 ? (
        <div className="mb-5 flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {details.seasons.map((s) => (
            <button key={s.id} type="button" onClick={() => onSeason(s.seasonNumber)} className={cx("control-3d h-9 shrink-0 rounded-full px-4 text-[12.5px] font-medium transition-colors", s.seasonNumber === season ? "text-white border-white/25 bg-white/[0.08]" : "text-text-mid hover:text-text-hi")}>
              {t("season_n", { n: s.seasonNumber })}
              <span className="ml-1.5 text-text-mid/80">{s.episodeCount}</span>
            </button>
          ))}
        </div>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" aria-hidden="true" />
        </div>
      ) : !visible.length ? (
        <p className="py-10 text-center text-sm text-text-mid">{t("no_episodes")}</p>
      ) : view === "list" ? (
        <ol className="flex flex-col divide-y divide-white/[0.06] rounded-[14px] border border-white/[0.06] bg-surface-1/60">
          {visible.map((e) => {
            const still = tmdbImage(e.still, "w300");
            const active = e.episodeNumber === activeEpisode;
            return (
              <li key={e.id}>
                <button type="button" onClick={() => onEpisode(season, e.episodeNumber)} className={cx("group flex w-full items-center gap-4 p-3 text-left transition-colors hover:bg-white/[0.04] md:p-4", active && "bg-white/[0.06]")}>
                  <span className="w-6 shrink-0 text-center text-sm font-semibold tabular-nums text-text-mid">{e.episodeNumber}</span>
                  <span className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-[8px] bg-surface-2 md:w-40">
                    {still ? <img src={still} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" decoding="async" /> : null}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                      <Play className="h-6 w-6 fill-white text-white" aria-hidden="true" />
                    </span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="truncate text-[14px] font-semibold text-text-hi">{e.name || t("episode_n", { n: e.episodeNumber })}</span>
                      <span className="shrink-0 text-[11.5px] text-text-mid tabular-nums">{[formatRuntime(e.runtime), formatLongDate(e.airDate, router.locale)].filter(Boolean).join(" · ")}</span>
                    </span>
                    {e.overview ? <span className="mt-1 line-clamp-2 block text-[12.5px] leading-relaxed text-text-mid">{e.overview}</span> : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="grid grid-cols-2 gap-x-1.5 gap-y-5 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((e) => {
            const still = tmdbImage(e.still, "w780");
            const active = e.episodeNumber === activeEpisode;
            return (
              <button key={e.id} type="button" onClick={() => onEpisode(season, e.episodeNumber)} className="group text-left">
                <span className={cx("relative block aspect-video overflow-hidden rounded-[10px] border bg-surface-1 transition-colors", active ? "border-primary/60" : "border-border-subtle group-hover:border-white/20")}>
                  {still ? <img src={still} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" decoding="async" /> : null}
                  <span className="absolute left-2 top-2 rounded-[6px] bg-black/60 px-1.5 py-0.5 text-[11px] font-semibold text-white tabular-nums">E{e.episodeNumber}</span>
                  <span className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity group-hover:opacity-100">
                    <Play className="h-8 w-8 fill-white text-white" aria-hidden="true" />
                  </span>
                </span>
                <span className="mt-2 block truncate text-[13px] font-medium text-text-hi">{e.name || t("episode_n", { n: e.episodeNumber })}</span>
                <span className="mt-0.5 block text-[11px] text-text-mid">{[formatRuntime(e.runtime), formatLongDate(e.airDate, router.locale)].filter(Boolean).join(" · ")}</span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
