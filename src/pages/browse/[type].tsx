import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { BrowseFilters, BrowsePage, MediaItem, MediaType } from "@/lib/types";
import { getBrowse, getHomeData } from "@/lib/data";
import { getPageMessages } from "@/lib/i18n";
import { Seo } from "@/components/layout/Seo";
import { BrowseMiniHero } from "@/components/browse/BrowseMiniHero";
import { FilterBar } from "@/components/browse/FilterBar";
import { MovieGrid } from "@/components/media/MovieGrid";
import { MovieCard } from "@/components/media/MovieCard";
import { Rail } from "@/components/media/Rail";
import { cx } from "@/lib/format";

interface Props {
  type: MediaType;
  initial: BrowsePage;
  filters: BrowseFilters;
  rail: MediaItem[];
  wall: MediaItem[];
  messages: Record<string, unknown>;
}

const GLOW: Record<MediaType, string> = {
  movie: "rgba(220, 38, 38, 0.3)",
  tv: "rgba(37, 99, 235, 0.3)",
  anime: "rgba(217, 70, 239, 0.28)",
};

function toQuery(f: BrowseFilters): Record<string, string> {
  const q: Record<string, string> = {};
  if (f.genres) q.genres = f.genres;
  if (f.year) q.year = f.year;
  if (f.country) q.country = f.country;
  if (f.sort && f.sort !== "popular") q.sort = f.sort;
  return q;
}

export default function BrowsePageView({ type, initial, filters: initialFilters, rail, wall }: Props) {
  const t = useTranslations("Browse");
  const th = useTranslations("Home");
  const tm = useTranslations("Meta");
  const router = useRouter();
  const [filters, setFilters] = useState<BrowseFilters>(initialFilters);
  const [items, setItems] = useState<MediaItem[]>(initial.items);
  const [page, setPage] = useState(initial.page);
  const [totalPages, setTotalPages] = useState(initial.totalPages);
  const [loading, setLoading] = useState(false);
  const sentinel = useRef<HTMLDivElement>(null);
  const reqId = useRef(0);

  useEffect(() => {
    setFilters(initialFilters);
    setItems(initial.items);
    setPage(initial.page);
    setTotalPages(initial.totalPages);
  }, [initial, initialFilters]);

  const fetchPage = useCallback(
    async (f: BrowseFilters, p: number, replace: boolean) => {
      const id = ++reqId.current;
      setLoading(true);
      try {
        const q = new URLSearchParams({ type, page: String(p), locale: router.locale ?? "en", ...toQuery(f) });
        const res = await fetch(`/api/browse?${q.toString()}`);
        const data = (await res.json()) as BrowsePage;
        if (id !== reqId.current) return;
        setItems((prev) => (replace ? data.items : [...prev, ...data.items.filter((m) => !prev.some((x) => x.id === m.id && x.mediaType === m.mediaType))]));
        setPage(data.page);
        setTotalPages(data.totalPages);
      } finally {
        if (id === reqId.current) setLoading(false);
      }
    },
    [type, router.locale],
  );

  const onChange = (next: BrowseFilters) => {
    setFilters(next);
    router.replace({ pathname: `/browse/${type}`, query: toQuery(next) }, undefined, { shallow: true, scroll: false });
    fetchPage(next, 1, true);
  };

  const loadMore = useCallback(() => {
    if (loading || page >= totalPages) return;
    fetchPage(filters, page + 1, false);
  }, [loading, page, totalPages, filters, fetchPage]);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => entries[0].isIntersecting && loadMore(), { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  const title = type === "movie" ? t("movies") : type === "tv" ? t("shows") : t("anime");
  const subtitle = type === "movie" ? t("movies_subtitle") : type === "tv" ? t("shows_subtitle") : t("anime_subtitle");
  const metaTitle = type === "movie" ? tm("movies_title") : type === "tv" ? tm("shows_title") : tm("anime_title");

  return (
    <>
      <Seo title={metaTitle} description={subtitle} path={`/browse/${type}`} />
      <BrowseMiniHero title={title} subtitle={subtitle} items={wall} glow={GLOW[type]} />
      <div className="layout-container mt-2 flex flex-col gap-10 md:gap-12">
        {rail.length ? (
          type === "tv" ? (
            <Rail title={th("upcoming_tv")} subtitle={th("upcoming_tv_subtitle")} items={rail} variant="poster" episodeMeta />
          ) : (
            <Rail title={th("trending")} subtitle={th("trending_subtitle")} items={rail} />
          )
        ) : null}
        <section key={type} className="animate-pane-enter">
          <FilterBar type={type} filters={filters} onChange={onChange} count={items.length} />
          <div className={cx("mt-6 transition-opacity", loading && items.length === 0 && "opacity-50")}>
            {items.length ? (
              <MovieGrid>
                {items.map((m, i) => (
                  <MovieCard key={`${m.mediaType}:${m.id}`} item={m} priority={i < 8} />
                ))}
              </MovieGrid>
            ) : !loading ? (
              <div className="py-24 text-center">
                <p className="text-lg font-semibold text-text-hi">{t("not_found")}</p>
                <button type="button" onClick={() => onChange({ sort: "popular" })} className="mt-4 control-3d inline-flex h-9 items-center rounded-full px-4 text-[13px] font-medium text-text-hi">
                  {t("reset")}
                </button>
              </div>
            ) : null}
          </div>
          <div ref={sentinel} className="h-px" aria-hidden="true" />
          <div className="mt-8 flex justify-center">
            {page < totalPages ? (
              <button type="button" onClick={loadMore} disabled={loading} className="control-3d inline-flex h-10 items-center rounded-full px-6 text-[13px] font-medium text-text-hi disabled:opacity-60">
                {loading ? t("loading") : t("load_more")}
              </button>
            ) : loading ? (
              <span className="text-[13px] text-text-mid">{t("loading")}</span>
            ) : null}
          </div>
        </section>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, query, locale, res }) => {
  const type = String(params?.type) as MediaType;
  if (!["movie", "tv", "anime"].includes(type)) return { notFound: true };
  const str = (v: string | string[] | undefined) => (typeof v === "string" && v ? v : undefined);
  const filters: BrowseFilters = {
    genres: str(query.genres),
    year: str(query.year),
    country: str(query.country),
    sort: (str(query.sort) as BrowseFilters["sort"]) ?? "popular",
  };
  const [initial, home, messages] = await Promise.all([getBrowse(type, filters, 1, locale), getHomeData(locale), getPageMessages(locale)]);
  const rail = type === "tv" ? home.upcomingTv : type === "movie" ? home.trending : [];
  const wallSource = type === "anime" ? [...initial.items, ...home.trending] : type === "tv" ? [...home.upcomingTv, ...home.topRated] : [...home.trending, ...home.topRated, ...home.recent4k];
  const wall = wallSource.filter((m) => m.poster).slice(0, 36);
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
  return { props: { type, initial, filters: JSON.parse(JSON.stringify(filters)), rail, wall, messages } };
};
