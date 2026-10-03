const TMDB_IMG = "https://image.tmdb.org/t/p";

export type PosterSize = "w185" | "w342" | "w500" | "w780" | "original";
export type BackdropSize = "w300" | "w780" | "w1280" | "original";
export type ProfileSize = "w185" | "w342" | "h632";
export type LogoSize = "w300" | "w500" | "original";

const proxy = process.env.NEXT_PUBLIC_IMAGE_PROXY ?? "";

/** Build an image URL from a TMDB path. Optionally routed through an image proxy. */
export function tmdbImage(path: string | null | undefined, size: string): string | null {
  if (!path) return null;
  // TMDB only serves vector logos at the original size.
  const effective = path.toLowerCase().endsWith(".svg") ? "original" : size;
  const url = `${TMDB_IMG}/${effective}${path}`;
  if (!proxy) return url;
  return `${proxy}${encodeURIComponent(url)}`;
}

export function posterSrcSet(path: string | null | undefined): { src: string; srcSet: string } | null {
  const src = tmdbImage(path, "w342");
  if (!src) return null;
  return {
    src,
    srcSet: `${tmdbImage(path, "w185")} 185w, ${tmdbImage(path, "w342")} 342w, ${tmdbImage(path, "w500")} 500w`,
  };
}

export function backdropSrcSet(path: string | null | undefined): { src: string; srcSet: string } | null {
  const src = tmdbImage(path, "w780");
  if (!src) return null;
  return {
    src,
    srcSet: `${tmdbImage(path, "w300")} 300w, ${tmdbImage(path, "w780")} 780w, ${tmdbImage(path, "w1280")} 1280w`,
  };
}

export function heroSrcSet(path: string | null | undefined): { src: string; srcSet: string } | null {
  const src = tmdbImage(path, "w1280");
  if (!src) return null;
  return {
    src,
    srcSet: `${tmdbImage(path, "w780")} 780w, ${tmdbImage(path, "w1280")} 1280w, ${tmdbImage(path, "original")} 1920w`,
  };
}
