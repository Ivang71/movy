import type { BrowseFilters, BrowsePage, Details, Episode, MediaItem, MediaType, Person, Season } from "./types";
import { yearOf } from "./format";

const API = "https://api.themoviedb.org/3";

export function tmdbKey(): string | null {
  const k = process.env.TMDB_API_KEY?.trim();
  return k ? k : null;
}

export function hasTmdb(): boolean {
  return Boolean(tmdbKey());
}

export const LOCALE_TO_TMDB: Record<string, string> = {
  en: "en-US",
  pt: "pt-BR",
  es: "es-ES",
  de: "de-DE",
  fr: "fr-FR",
  ru: "ru-RU",
  tr: "tr-TR",
  id: "id-ID",
  it: "it-IT",
};

export function tmdbLanguage(locale?: string): string {
  return LOCALE_TO_TMDB[locale ?? "en"] ?? "en-US";
}

async function get<T>(path: string, params: Record<string, string | number | undefined> = {}): Promise<T> {
  const key = tmdbKey();
  if (!key) throw new Error("TMDB_API_KEY is not configured");
  const url = new URL(`${API}${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") url.searchParams.set(k, String(v));
  }
  const headers: Record<string, string> = { accept: "application/json" };
  if (key.startsWith("eyJ")) headers.authorization = `Bearer ${key}`;
  else url.searchParams.set("api_key", key);
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`TMDB ${res.status} for ${path}`);
  return (await res.json()) as T;
}

/* ---------- raw TMDB shapes (only the fields we read) ---------- */
interface RawMedia {
  id: number;
  media_type?: string;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
}

interface RawPaged<T> {
  page: number;
  total_pages: number;
  results: T[];
}

export function mapMedia(raw: RawMedia, forced?: MediaType): MediaItem {
  const mediaType: MediaType = forced ?? (raw.media_type === "tv" || raw.name ? "tv" : "movie");
  const releaseDate = raw.release_date || raw.first_air_date || null;
  return {
    id: String(raw.id),
    mediaType,
    title: raw.title || raw.name || raw.original_title || raw.original_name || "",
    slug: `/${mediaType}/${raw.id}`,
    poster: raw.poster_path ?? null,
    backdrop: raw.backdrop_path ?? null,
    overview: raw.overview || null,
    rating: raw.vote_average && raw.vote_average > 0 ? Math.round(raw.vote_average * 10) / 10 : null,
    year: yearOf(releaseDate),
    releaseDate,
    genreIds: raw.genre_ids ?? raw.genres?.map((g) => g.id) ?? [],
    tag: null,
  };
}

function interleave<T>(a: T[], b: T[]): T[] {
  const out: T[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
}

function onlyWithArt(items: MediaItem[]): MediaItem[] {
  return items.filter((m) => m.poster && m.backdrop);
}

/* ---------- lists ---------- */
export async function trending(kind: "all" | "movie" | "tv", locale?: string): Promise<MediaItem[]> {
  const data = await get<RawPaged<RawMedia>>(`/trending/${kind}/week`, { language: tmdbLanguage(locale) });
  return onlyWithArt(data.results.filter((r) => r.media_type !== "person").map((r) => mapMedia(r)));
}

export async function topRated(kind: "movie" | "tv", locale?: string): Promise<MediaItem[]> {
  const data = await get<RawPaged<RawMedia>>(`/${kind}/top_rated`, { language: tmdbLanguage(locale) });
  return onlyWithArt(data.results.map((r) => mapMedia(r, kind)));
}

export async function recentlyAdded(locale?: string): Promise<MediaItem[]> {
  const today = new Date().toISOString().slice(0, 10);
  const data = await get<RawPaged<RawMedia>>("/discover/movie", {
    language: tmdbLanguage(locale),
    sort_by: "primary_release_date.desc",
    "primary_release_date.lte": today,
    "vote_count.gte": 40,
    include_adult: "false",
  });
  return onlyWithArt(data.results.map((r) => mapMedia(r, "movie"))).map((m, i) => (i < 4 ? { ...m, tag: "recently_added" } : m));
}

interface RawOnAir extends RawMedia {
  next_episode_to_air?: { season_number: number; episode_number: number; air_date: string } | null;
  last_episode_to_air?: { season_number: number; episode_number: number; air_date: string } | null;
}

export async function upcomingTv(locale?: string): Promise<MediaItem[]> {
  const data = await get<RawPaged<RawOnAir>>("/tv/on_the_air", { language: tmdbLanguage(locale) });
  const items = onlyWithArt(data.results.map((r) => mapMedia(r, "tv")));
  // Fetch episode info for the first 16 shows in parallel so the rail can show "S1.E7 · Sep 27".
  const enriched = await Promise.all(
    items.slice(0, 16).map(async (m) => {
      try {
        const d = await get<RawOnAir>(`/tv/${m.id}`, { language: tmdbLanguage(locale) });
        const ep = d.next_episode_to_air ?? d.last_episode_to_air ?? null;
        return {
          ...m,
          episodeCode: ep ? `S${ep.season_number}.E${ep.episode_number}` : null,
          episodeAirDate: ep?.air_date ?? null,
          tag: d.next_episode_to_air ? ("new_episode" as const) : null,
        };
      } catch {
        return m;
      }
    }),
  );
  return enriched;
}

export async function networkTv(network: number, locale?: string): Promise<MediaItem[]> {
  const data = await get<RawPaged<RawMedia>>("/discover/tv", {
    language: tmdbLanguage(locale),
    with_networks: network,
    sort_by: "popularity.desc",
  });
  return onlyWithArt(data.results.map((r) => mapMedia(r, "tv")));
}

const SORT_MAP: Record<string, { movie: string; tv: string }> = {
  popular: { movie: "popularity.desc", tv: "popularity.desc" },
  rating: { movie: "vote_average.desc", tv: "vote_average.desc" },
  newest: { movie: "primary_release_date.desc", tv: "first_air_date.desc" },
  oldest: { movie: "primary_release_date.asc", tv: "first_air_date.asc" },
};

export async function discover(type: MediaType, filters: BrowseFilters, page: number, locale?: string): Promise<BrowsePage> {
  const kind = type === "movie" ? "movie" : "tv";
  const sort = SORT_MAP[filters.sort ?? "popular"] ?? SORT_MAP.popular;
  const params: Record<string, string | number | undefined> = {
    language: tmdbLanguage(locale),
    page,
    sort_by: sort[kind],
    include_adult: "false",
    "vote_count.gte": filters.sort === "rating" ? 300 : 20,
  };
  const genres = [filters.genres, type === "anime" ? "16" : undefined].filter(Boolean).join(",");
  if (genres) params.with_genres = genres;
  if (type === "anime") {
    params.with_original_language = "ja";
  }
  if (filters.year) {
    if (kind === "movie") params.primary_release_year = filters.year;
    else params.first_air_date_year = filters.year;
  }
  if (filters.country) params.with_origin_country = filters.country;
  const data = await get<RawPaged<RawMedia>>(`/discover/${kind}`, params);
  const items = onlyWithArt(data.results.map((r) => mapMedia(r, kind))).map((m) =>
    type === "anime" ? { ...m, mediaType: "anime" as const, slug: `/anime/${m.id}` } : m,
  );
  return { items, page: data.page, totalPages: Math.min(data.total_pages, 500) };
}

export async function searchMulti(query: string, locale?: string): Promise<MediaItem[]> {
  const data = await get<RawPaged<RawMedia>>("/search/multi", { query, language: tmdbLanguage(locale), include_adult: "false" });
  return data.results
    .filter((r) => r.media_type === "movie" || r.media_type === "tv")
    .map((r) => mapMedia(r))
    .filter((m) => m.poster);
}

/* ---------- details ---------- */
interface RawCredits {
  cast?: { id: number; name: string; profile_path: string | null; character?: string; known_for_department?: string }[];
  crew?: { id: number; name: string; profile_path: string | null; job?: string }[];
}
interface RawDetails extends RawMedia {
  runtime?: number;
  episode_run_time?: number[];
  status?: string;
  tagline?: string;
  imdb_id?: string;
  external_ids?: { imdb_id?: string };
  credits?: RawCredits;
  aggregate_credits?: RawCredits;
  videos?: { results: { key: string; site: string; type: string; official?: boolean }[] };
  images?: { logos?: { file_path: string; iso_639_1: string | null }[] };
  release_dates?: { results: { iso_3166_1: string; release_dates: { certification: string }[] }[] };
  content_ratings?: { results: { iso_3166_1: string; rating: string }[] };
  recommendations?: RawPaged<RawMedia>;
  similar?: RawPaged<RawMedia>;
  seasons?: { id: number; season_number: number; name: string; overview: string; air_date: string | null; episode_count: number; poster_path: string | null }[];
  created_by?: { id: number; name: string; profile_path: string | null }[];
}

function pickTrailer(videos?: RawDetails["videos"]): string | null {
  const list = videos?.results?.filter((v) => v.site === "YouTube") ?? [];
  const official = list.find((v) => v.type === "Trailer" && v.official) ?? list.find((v) => v.type === "Trailer") ?? list.find((v) => v.type === "Teaser");
  return official?.key ?? null;
}

function pickLogo(images?: RawDetails["images"], lang = "en"): string | null {
  const logos = images?.logos ?? [];
  const l = logos.find((x) => x.iso_639_1 === lang) ?? logos.find((x) => x.iso_639_1 === "en") ?? logos.find((x) => !x.iso_639_1) ?? logos[0];
  return l?.file_path ?? null;
}

function pickCertification(d: RawDetails): string | null {
  if (d.release_dates) {
    const us = d.release_dates.results.find((r) => r.iso_3166_1 === "US");
    const cert = us?.release_dates.find((x) => x.certification)?.certification;
    if (cert) return cert;
  }
  if (d.content_ratings) {
    const us = d.content_ratings.results.find((r) => r.iso_3166_1 === "US");
    if (us?.rating) return us.rating;
  }
  return null;
}

function person(p: { id: number; name: string; profile_path: string | null }, label: string | null): Person {
  return { id: String(p.id), name: p.name, avatar: p.profile_path, label };
}

export async function details(type: MediaType, id: string, locale?: string): Promise<Details | null> {
  const kind = type === "movie" ? "movie" : "tv";
  const lang = tmdbLanguage(locale);
  let d: RawDetails;
  try {
    d = await get<RawDetails>(`/${kind}/${id}`, {
      language: lang,
      append_to_response:
        kind === "movie"
          ? "credits,videos,images,release_dates,recommendations,similar,external_ids"
          : "aggregate_credits,videos,images,content_ratings,recommendations,similar,external_ids",
      include_image_language: `${lang.slice(0, 2)},en,null`,
    });
  } catch {
    return null;
  }
  const base = mapMedia(d, kind);
  const credits = d.credits ?? d.aggregate_credits;
  const cast = (credits?.cast ?? []).slice(0, 16).map((c) => person(c, c.character ?? c.known_for_department ?? null));
  const crew = credits?.crew ?? [];
  const seasons: Season[] = (d.seasons ?? [])
    .filter((s) => s.season_number > 0)
    .map((s) => ({
      id: String(s.id),
      seasonNumber: s.season_number,
      name: s.name,
      overview: s.overview,
      airDate: s.air_date,
      episodeCount: s.episode_count,
      poster: s.poster_path,
    }));
  const recs = onlyWithArt([...(d.recommendations?.results ?? []), ...(d.similar?.results ?? [])].map((r) => mapMedia(r, kind))).filter(
    (m) => m.id !== String(d.id),
  );
  return {
    ...base,
    mediaType: type,
    slug: `/${type}/${d.id}`,
    logo: pickLogo(d.images, lang.slice(0, 2)),
    genreIds: d.genres?.map((g) => g.id) ?? [],
    imdbId: d.imdb_id ?? d.external_ids?.imdb_id ?? null,
    originalTitle: d.original_title ?? d.original_name ?? null,
    duration: d.runtime ?? d.episode_run_time?.[0] ?? null,
    certification: pickCertification(d),
    trailerId: pickTrailer(d.videos),
    genres: d.genres ?? [],
    cast,
    directors: crew.filter((c) => c.job === "Director").slice(0, 3).map((c) => person(c, "Director")),
    writers: crew.filter((c) => c.job === "Writer" || c.job === "Screenplay").slice(0, 3).map((c) => person(c, "Writer")),
    creators: (d.created_by ?? []).map((c) => person(c, "Creator")),
    seasons,
    recommendations: recs,
    status: d.status ?? null,
    tagline: d.tagline ?? null,
    tag: kind === "tv" && d.status === "Returning Series" ? "new_episode" : null,
  };
}

interface RawSeason {
  episodes: {
    id: number;
    episode_number: number;
    season_number: number;
    name: string;
    overview: string;
    air_date: string | null;
    runtime: number | null;
    still_path: string | null;
    vote_average: number;
  }[];
}

export async function seasonEpisodes(id: string, seasonNumber: number, locale?: string): Promise<Episode[]> {
  try {
    const s = await get<RawSeason>(`/tv/${id}/season/${seasonNumber}`, { language: tmdbLanguage(locale) });
    return s.episodes.map((e) => ({
      id: String(e.id),
      episodeNumber: e.episode_number,
      seasonNumber: e.season_number,
      name: e.name,
      overview: e.overview,
      airDate: e.air_date,
      runtime: e.runtime,
      still: e.still_path,
      rating: e.vote_average > 0 ? Math.round(e.vote_average * 10) / 10 : null,
    }));
  } catch {
    return [];
  }
}

export { interleave };
