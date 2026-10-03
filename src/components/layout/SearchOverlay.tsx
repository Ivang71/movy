import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Clock3, Search, X } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { useUi } from "./UiContext";
import { useStore } from "@/lib/store";
import { MovieCard } from "@/components/media/MovieCard";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cx } from "@/lib/format";

type Status = "idle" | "loading" | "done" | "error";

export function SearchOverlay() {
  const t = useTranslations("Search");
  const tb = useTranslations("Browse");
  const router = useRouter();
  const { searchOpen, closeSearch } = useUi();
  const { recentSearches, addRecentSearch, clearRecentSearches } = useStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [filter, setFilter] = useState<"all" | "movie" | "tv">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on route change / Escape, lock scroll while open.
  useEffect(() => {
    if (!searchOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeSearch();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [searchOpen, closeSearch]);

  useEffect(() => {
    const onRoute = () => closeSearch();
    router.events.on("routeChangeStart", onRoute);
    return () => router.events.off("routeChangeStart", onRoute);
  }, [router.events, closeSearch]);

  // Trending suggestions for the empty state.
  useEffect(() => {
    if (!searchOpen || trending.length) return;
    fetch(`/api/search?q=&locale=${router.locale ?? "en"}`)
      .then((r) => r.json())
      .then((d: { items: MediaItem[] }) => setTrending(d.items ?? []))
      .catch(() => undefined);
  }, [searchOpen, trending.length, router.locale]);

  // Debounced search.
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setStatus("idle");
      return;
    }
    setStatus("loading");
    const ctrl = new AbortController();
    const id = window.setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}&locale=${router.locale ?? "en"}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d: { items: MediaItem[] }) => {
          setResults(d.items ?? []);
          setStatus("done");
          addRecentSearch(q);
        })
        .catch((e) => {
          if (e?.name !== "AbortError") setStatus("error");
        });
    }, 320);
    return () => {
      window.clearTimeout(id);
      ctrl.abort();
    };
  }, [query, router.locale, addRecentSearch]);

  if (!searchOpen) return null;

  const visible = filter === "all" ? results : results.filter((r) => r.mediaType === filter);
  const hasQuery = query.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neo-bg/90 backdrop-blur-xl animate-page-enter" role="dialog" aria-modal="true" aria-label={t("search")}>
      <div className="layout-container pt-3 md:pt-4">
        <div className="flex items-center gap-3">
          <label className="control-3d flex h-12 flex-1 items-center gap-3 rounded-[14px] px-4 md:h-14">
            <Search className="h-5 w-5 shrink-0 text-text-mid" aria-hidden="true" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search_placeholder")}
              className="h-full w-full bg-transparent text-[15px] text-text-hi placeholder:text-text-mid focus:outline-hidden md:text-base"
              autoComplete="off"
              spellCheck={false}
              enterKeyHint="search"
            />
            {query ? (
              <button type="button" onClick={() => setQuery("")} className="rounded-full p-1 text-text-mid hover:text-text-hi" aria-label={t("clear")}>
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            ) : null}
          </label>
          <button type="button" onClick={closeSearch} className="control-3d flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] text-text-hi md:h-14 md:w-14" aria-label={t("close")}>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {hasQuery ? (
          <div className="mt-4 flex items-center gap-2">
            {(["all", "movie", "tv"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={cx(
                  "h-8 rounded-full px-3.5 text-[12.5px] font-medium transition-colors",
                  filter === f ? "bg-text-hi text-[#05070a]" : "control-3d text-text-mid hover:text-text-hi",
                )}
              >
                {f === "all" ? tb("all") : f === "movie" ? tb("movies") : tb("shows")}
              </button>
            ))}
            <span className="ml-auto text-[12.5px] text-text-mid">{status === "loading" ? t("searching") : status === "done" ? t("results_found", { count: visible.length }) : null}</span>
          </div>
        ) : null}
      </div>

      <div className="layout-container flex-1 overflow-y-auto scrollbar-styles pb-28 pt-6 md:pb-12 md:pt-8">
        {!hasQuery ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-text-hi md:text-3xl">{t("hero_title")}</h2>
              <p className="mt-1 text-sm text-text-mid">{t("hero_description")}</p>
            </div>
            {recentSearches.length ? (
              <div className="mb-8">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-text-hi">{t("recent")}</h3>
                  <button type="button" onClick={clearRecentSearches} className="text-[12px] text-text-mid hover:text-text-hi">
                    {t("clear")}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((q) => (
                    <button key={q} type="button" onClick={() => setQuery(q)} className="control-3d inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[12.5px] text-text-hi">
                      <Clock3 className="h-3.5 w-3.5 text-text-mid" aria-hidden="true" />
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            {trending.length ? (
              <section>
                <SectionHeader title={t("trending_today")} />
                <div className="grid grid-cols-3 gap-x-2 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
                  {trending.slice(0, 16).map((m) => (
                    <MovieCard key={`${m.mediaType}:${m.id}`} item={m} variant="poster" showWatchlist={false} />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        ) : status === "error" ? (
          <div className="py-20 text-center">
            <h3 className="text-lg font-semibold text-text-hi">{t("error_loading")}</h3>
            <p className="mt-1 text-sm text-text-mid">{t("try_again_later")}</p>
          </div>
        ) : status === "done" && visible.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="text-lg font-semibold text-text-hi">{t("no_results_title")}</h3>
            <p className="mx-auto mt-1 max-w-md text-sm text-text-mid">{t("no_results_description", { keyword: query.trim() })}</p>
          </div>
        ) : (
          <section>
            <SectionHeader title={t("search_results_for", { keyword: query.trim() })} />
            <div className={cx("grid grid-cols-3 gap-x-2 gap-y-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8", status === "loading" && "opacity-60 transition-opacity")}>
              {visible.map((m) => (
                <MovieCard key={`${m.mediaType}:${m.id}`} item={m} variant="poster" showWatchlist={false} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
