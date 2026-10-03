import type { MediaType } from "./types";

export const MOVIE_GENRES: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

export const TV_GENRES: Record<number, string> = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
};

export function genreName(id: number, mediaType: MediaType): string | null {
  if (mediaType === "movie") return MOVIE_GENRES[id] ?? TV_GENRES[id] ?? null;
  return TV_GENRES[id] ?? MOVIE_GENRES[id] ?? null;
}

export function genreNames(ids: number[], mediaType: MediaType, limit = 2): string[] {
  const out: string[] = [];
  for (const id of ids) {
    const n = genreName(id, mediaType);
    if (n && !out.includes(n)) out.push(n);
    if (out.length >= limit) break;
  }
  return out;
}

export function genreOptions(mediaType: MediaType): { id: number; name: string }[] {
  const src = mediaType === "movie" ? MOVIE_GENRES : TV_GENRES;
  return Object.entries(src)
    .map(([id, name]) => ({ id: Number(id), name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Curated "Popular genres" rail. Accent colours are our own palette. */
export interface GenreTile {
  key: string;
  label: string;
  accent: string;
  movieGenre: number;
  tvGenre: number;
}

export const POPULAR_GENRES: GenreTile[] = [
  { key: "comedy", label: "Comedy", accent: "#1f6f8b", movieGenre: 35, tvGenre: 35 },
  { key: "action", label: "Action", accent: "#c2261b", movieGenre: 28, tvGenre: 10759 },
  { key: "drama", label: "Drama", accent: "#0f7a6b", movieGenre: 18, tvGenre: 18 },
  { key: "horror", label: "Horror", accent: "#6b1c8f", movieGenre: 27, tvGenre: 9648 },
  { key: "romance", label: "Romance", accent: "#b3123f", movieGenre: 10749, tvGenre: 18 },
  { key: "scifi", label: "Science Fiction", accent: "#1b4ea8", movieGenre: 878, tvGenre: 10765 },
  { key: "thriller", label: "Thriller", accent: "#3b3f8f", movieGenre: 53, tvGenre: 80 },
  { key: "animation", label: "Animation", accent: "#c76d12", movieGenre: 16, tvGenre: 16 },
  { key: "documentary", label: "Documentary", accent: "#5a6b2f", movieGenre: 99, tvGenre: 99 },
  { key: "family", label: "Family", accent: "#b8860b", movieGenre: 10751, tvGenre: 10751 },
  { key: "crime", label: "Crime", accent: "#4a1d1d", movieGenre: 80, tvGenre: 80 },
  { key: "war", label: "War & Politics", accent: "#2f4f4f", movieGenre: 10752, tvGenre: 10768 },
];
