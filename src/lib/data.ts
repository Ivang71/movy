/**
 * Data access layer. Uses TMDB when TMDB_API_KEY is configured and otherwise
 * falls back to the bundled snapshot so the site renders out of the box.
 */
import type { BrowseFilters, BrowsePage, Details, Episode, HomeData, MediaItem, MediaType } from "./types";
import * as tmdb from "./tmdb";
import { PROVIDERS } from "./providers";
import { fixtureBrowse, fixtureDetails, fixtureHome, fixtureSearch } from "./fixtures";

export const usingFixtures = (): boolean => !tmdb.hasTmdb();

export async function getHomeData(locale?: string): Promise<HomeData> {
  if (!tmdb.hasTmdb()) return fixtureHome;
  const [all, movies, shows, ratedMovies, ratedTv, recent, upcoming, ...networks] = await Promise.all([
    tmdb.trending("all", locale),
    tmdb.trending("movie", locale),
    tmdb.trending("tv", locale),
    tmdb.topRated("movie", locale),
    tmdb.topRated("tv", locale),
    tmdb.recentlyAdded(locale),
    tmdb.upcomingTv(locale),
    ...PROVIDERS.map((p) => tmdb.networkTv(p.network, locale).catch(() => [] as MediaItem[])),
  ]);
  // Hero needs logos: enrich the first five trending titles with their title treatment.
  const hero = await Promise.all(
    all.slice(0, 5).map(async (m, i) => {
      const d = await tmdb.details(m.mediaType, m.id, locale);
      return {
        ...m,
        logo: d?.logo ?? null,
        overview: d?.overview ?? m.overview,
        tag: i === 0 ? ("recently_added" as const) : d?.tag ?? null,
      };
    }),
  );
  const streaming: Record<string, MediaItem[]> = {};
  PROVIDERS.forEach((p, i) => {
    streaming[p.key] = networks[i] as MediaItem[];
  });
  return {
    hero,
    top10: all.slice(0, 10),
    trending: tmdb.interleave(movies, shows).slice(0, 24),
    topRated: tmdb.interleave(ratedMovies, ratedTv).slice(0, 24),
    recent4k: recent.slice(0, 24),
    upcomingTv: upcoming,
    streaming,
  };
}

export async function getBrowse(type: MediaType, filters: BrowseFilters, page: number, locale?: string): Promise<BrowsePage> {
  if (!tmdb.hasTmdb()) {
    const fx = fixtureBrowse(type);
    let items = fx.items;
    if (filters.genres) {
      const wanted = filters.genres.split(",").map(Number).filter(Boolean);
      if (wanted.length) items = items.filter((m) => m.genreIds.some((g) => wanted.includes(g)));
    }
    if (filters.year) items = items.filter((m) => m.year === filters.year);
    if (filters.sort === "rating") items = [...items].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    if (filters.sort === "newest") items = [...items].sort((a, b) => (b.releaseDate ?? "").localeCompare(a.releaseDate ?? ""));
    if (filters.sort === "oldest") items = [...items].sort((a, b) => (a.releaseDate ?? "").localeCompare(b.releaseDate ?? ""));
    return { items: page > 1 ? [] : items, page, totalPages: 1 };
  }
  return tmdb.discover(type, filters, page, locale);
}

export async function getNetworkTv(network: number, locale?: string): Promise<MediaItem[]> {
  if (!tmdb.hasTmdb()) {
    const idx = Math.max(0, PROVIDERS.findIndex((p) => p.network === network));
    const key = PROVIDERS[idx]?.key;
    return (key && fixtureHome.streaming[key]) || fixtureHome.streaming[PROVIDERS[0].key] || [];
  }
  return tmdb.networkTv(network, locale);
}

export async function getUpcomingTv(locale?: string): Promise<MediaItem[]> {
  if (!tmdb.hasTmdb()) return fixtureHome.upcomingTv;
  return tmdb.upcomingTv(locale);
}

export async function getDetails(type: MediaType, id: string, locale?: string): Promise<Details | null> {
  if (!tmdb.hasTmdb()) return fixtureDetails(type, id);
  return tmdb.details(type, id, locale);
}

export async function getSeasonEpisodes(id: string, seasonNumber: number, locale?: string): Promise<Episode[]> {
  if (!tmdb.hasTmdb()) {
    const d = fixtureDetails("tv", id);
    const season = d?.seasons.find((s) => s.seasonNumber === seasonNumber);
    if (!season) return [];
    // Offline: synthesise episode stubs from the season's episode count.
    return Array.from({ length: season.episodeCount }, (_, i) => ({
      id: `${id}-${seasonNumber}-${i + 1}`,
      episodeNumber: i + 1,
      seasonNumber,
      name: `Episode ${i + 1}`,
      overview: "",
      airDate: season.airDate,
      runtime: null,
      still: d?.backdrop ?? null,
      rating: null,
    }));
  }
  return tmdb.seasonEpisodes(id, seasonNumber, locale);
}

export async function search(query: string, locale?: string): Promise<MediaItem[]> {
  if (!query.trim()) return [];
  if (!tmdb.hasTmdb()) return fixtureSearch(query);
  return tmdb.searchMulti(query, locale);
}
