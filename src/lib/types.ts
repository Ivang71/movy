export type MediaType = "movie" | "tv" | "anime";

export type RecencyTag = "recently_added" | "new_episode" | "coming_soon" | "new_season" | null;

export interface MediaItem {
  id: string;
  mediaType: MediaType;
  title: string;
  slug: string;
  /** TMDB poster path, e.g. "/abc.jpg" */
  poster: string | null;
  /** TMDB backdrop path */
  backdrop: string | null;
  /** TMDB title-treatment logo path */
  logo?: string | null;
  overview?: string | null;
  rating: number | null;
  year: string | null;
  releaseDate: string | null;
  genreIds: number[];
  tag?: RecencyTag;
  /** For upcoming-episode rails: "S1.E7" */
  episodeCode?: string | null;
  episodeAirDate?: string | null;
}

export interface Person {
  id: string;
  name: string;
  avatar: string | null;
  label: string | null;
}

export interface Season {
  id: string;
  seasonNumber: number;
  name: string;
  overview: string;
  airDate: string | null;
  episodeCount: number;
  poster: string | null;
}

export interface Episode {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  name: string;
  overview: string;
  airDate: string | null;
  runtime: number | null;
  still: string | null;
  rating: number | null;
}

export interface Details extends MediaItem {
  imdbId: string | null;
  originalTitle: string | null;
  /** Runtime in minutes */
  duration: number | null;
  certification: string | null;
  trailerId: string | null;
  genres: { id: number; name: string }[];
  cast: Person[];
  directors: Person[];
  writers: Person[];
  creators: Person[];
  seasons: Season[];
  recommendations: MediaItem[];
  status?: string | null;
  tagline?: string | null;
}

export interface HomeData {
  hero: MediaItem[];
  top10: MediaItem[];
  upcomingTv: MediaItem[];
  trending: MediaItem[];
  topRated: MediaItem[];
  recent4k: MediaItem[];
  streaming: Record<string, MediaItem[]>;
}

export interface BrowseFilters {
  genres?: string;
  year?: string;
  country?: string;
  sort?: "popular" | "rating" | "newest" | "oldest";
}

export interface BrowsePage {
  items: MediaItem[];
  page: number;
  totalPages: number;
}
