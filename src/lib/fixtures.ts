import type { BrowsePage, Details, HomeData, MediaItem } from "./types";
import home from "@/data/fixtures/home.json";
import browseMovie from "@/data/fixtures/browse-movie.json";
import browseTv from "@/data/fixtures/browse-tv.json";
import browseAnime from "@/data/fixtures/browse-anime.json";
import movie1458857 from "@/data/fixtures/movie-1458857.json";
import tv95350 from "@/data/fixtures/tv-95350.json";

export const fixtureHome = home as unknown as HomeData;

const browse: Record<string, BrowsePage & { upcomingTv: MediaItem[] }> = {
  movie: browseMovie as unknown as BrowsePage & { upcomingTv: MediaItem[] },
  tv: browseTv as unknown as BrowsePage & { upcomingTv: MediaItem[] },
  anime: browseAnime as unknown as BrowsePage & { upcomingTv: MediaItem[] },
};

const details: Record<string, Details> = {
  "movie:1458857": movie1458857 as unknown as Details,
  "tv:95350": tv95350 as unknown as Details,
  "anime:95350": { ...(tv95350 as unknown as Details), mediaType: "anime" },
};

/** Every distinct title we know about offline, used for search and for anime/genre filtering. */
export function fixtureCatalog(): MediaItem[] {
  const seen = new Map<string, MediaItem>();
  const push = (m: MediaItem) => {
    const key = `${m.mediaType}:${m.id}`;
    if (!seen.has(key)) seen.set(key, m);
  };
  const h = fixtureHome;
  [...h.hero, ...h.top10, ...h.trending, ...h.topRated, ...h.upcomingTv, ...h.recent4k].forEach(push);
  Object.values(h.streaming).forEach((list) => list.forEach(push));
  Object.values(browse).forEach((b) => b.items.forEach(push));
  Object.values(details).forEach((d) => d.recommendations.forEach(push));
  return [...seen.values()];
}

export function fixtureBrowse(type: string): BrowsePage & { upcomingTv: MediaItem[] } {
  if (type === "anime") {
    const anime = fixtureCatalog().filter((m) => m.mediaType === "tv" && m.genreIds.includes(16));
    return { items: anime.map((m) => ({ ...m, mediaType: "anime", slug: `/anime/${m.id}` })), page: 1, totalPages: 1, upcomingTv: [] };
  }
  return browse[type] ?? { items: [], page: 1, totalPages: 1, upcomingTv: [] };
}

export function fixtureDetails(type: string, id: string): Details | null {
  const direct = details[`${type}:${id}`];
  if (direct) return direct;
  // Build a thin details object from any catalog item we know about so links still resolve offline.
  const found = fixtureCatalog().find((m) => m.id === id && (m.mediaType === type || (type === "anime" && m.mediaType === "tv")));
  if (!found) return null;
  return {
    ...found,
    mediaType: type as Details["mediaType"],
    imdbId: null,
    originalTitle: null,
    duration: null,
    certification: null,
    trailerId: null,
    genres: [],
    cast: [],
    directors: [],
    writers: [],
    creators: [],
    seasons: [],
    recommendations: fixtureHome.trending.filter((m) => m.id !== id).slice(0, 12),
    status: null,
    tagline: null,
  };
}

export function fixtureSearch(query: string): MediaItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return fixtureCatalog()
    .filter((m) => m.title.toLowerCase().includes(q))
    .slice(0, 20);
}
