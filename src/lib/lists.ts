import type { MediaItem } from "./types";

export interface WatchList {
  id: string;
  name: string;
  createdAt: number;
  items: MediaItem[];
}

export const MAX_LISTS = 20;
export const MAX_ITEMS = 100;
export const MAX_NAME = 30;

/** Letters, numbers and single spaces, 1–30 characters. */
export const NAME_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N} ]{0,29}$/u;

export function validName(name: string): boolean {
  return NAME_PATTERN.test(name.trim());
}

const ADJECTIVES = ["Cozy", "Midnight", "Golden", "Lazy", "Neon", "Quiet", "Velvet", "Electric", "Sunday", "Cosmic", "Rainy", "Crimson", "Lucky", "Retro", "Wild", "Silver"];
const NOUNS = ["Popcorn", "Marathon", "Matinee", "Couch", "Reel", "Premiere", "Trailer", "Cinema", "Binge", "Encore", "Spotlight", "Credits", "Sequel", "Backlot", "Projector", "Cliffhanger"];

export function randomListName(taken: string[] = []): string {
  for (let i = 0; i < 20; i++) {
    const name = `${ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)]} ${NOUNS[Math.floor(Math.random() * NOUNS.length)]}`;
    if (!taken.some((t) => t.toLowerCase() === name.toLowerCase())) return name;
  }
  return `List ${Math.floor(Math.random() * 900 + 100)}`;
}

export const itemKey = (m: Pick<MediaItem, "id" | "mediaType">): string => `${m.mediaType === "anime" ? "tv" : m.mediaType}:${m.id}`;

export const newListId = (): string => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/* ---------- share links (no backend: the list travels inside the URL) ---------- */

interface Packed {
  n: string;
  i: Array<[string, string, string, string | null, number | null, string | null]>;
}

const TYPE_CODE: Record<string, string> = { movie: "m", tv: "t", anime: "a" };
const CODE_TYPE: Record<string, MediaItem["mediaType"]> = { m: "movie", t: "tv", a: "anime" };

const b64url = (bytes: Uint8Array): string => {
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64url = (s: string): Uint8Array => {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

async function pipe(bytes: Uint8Array, stream: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const out = new Response(new Blob([bytes as BlobPart]).stream().pipeThrough(stream));
  return new Uint8Array(await out.arrayBuffer());
}

export async function encodeList(list: Pick<WatchList, "name" | "items">): Promise<string> {
  const packed: Packed = {
    n: list.name,
    i: list.items.map((m) => [TYPE_CODE[m.mediaType] ?? "m", m.id, m.title, m.poster?.replace(/^\//, "") ?? null, m.rating, m.year]),
  };
  const raw = new TextEncoder().encode(JSON.stringify(packed));
  if (typeof CompressionStream === "undefined") return `r${b64url(raw)}`;
  return `z${b64url(await pipe(raw, new CompressionStream("deflate-raw")))}`;
}

export async function decodeList(token: string): Promise<Pick<WatchList, "name" | "items"> | null> {
  try {
    const kind = token[0];
    const body = fromB64url(token.slice(1));
    const raw = kind === "z" ? await pipe(body, new DecompressionStream("deflate-raw")) : body;
    const packed = JSON.parse(new TextDecoder().decode(raw)) as Packed;
    if (typeof packed.n !== "string" || !Array.isArray(packed.i)) return null;
    const items: MediaItem[] = packed.i.slice(0, MAX_ITEMS).map(([t, id, title, poster, rating, year]) => {
      const mediaType = CODE_TYPE[t] ?? "movie";
      return {
        id: String(id),
        mediaType,
        title: String(title),
        slug: `/${mediaType}/${id}`,
        poster: poster ? `/${poster}` : null,
        backdrop: null,
        rating,
        year,
        releaseDate: null,
        genreIds: [],
      };
    });
    return { name: packed.n.slice(0, MAX_NAME), items };
  } catch {
    return null;
  }
}
