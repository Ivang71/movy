import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { MediaItem } from "./types";
import { MAX_ITEMS, MAX_LISTS, itemKey, newListId, validName, type WatchList } from "./lists";
import { AVATAR_COLORS, MAX_PROFILES, type AvatarSpec, type Interests } from "./profile";

export { AVATAR_COLORS };

export interface Profile {
  id: string;
  name: string;
  color: string;
  avatar?: AvatarSpec;
  /** Salted SHA-256 of the 4-digit PIN, when the profile is locked. */
  pinHash?: string;
  interests?: Interests;
  createdAt: number;
}

export interface HistoryEntry {
  item: MediaItem;
  progress: number;
  watchedAt: number;
  season?: number;
  episode?: number;
}


interface StoreState {
  ready: boolean;
  profiles: Profile[];
  profile: Profile | null;
  createProfile: (name: string, color: string, extra?: Partial<Pick<Profile, "avatar" | "pinHash" | "interests">>) => Profile | null;
  updateProfile: (id: string, patch: Partial<Omit<Profile, "id" | "createdAt">>) => void;
  selectProfile: (id: string) => void;
  removeProfile: (id: string) => void;
  logout: () => void;
  /** Every title across all lists, de-duplicated. */
  watchlist: MediaItem[];
  lists: WatchList[];
  inWatchlist: (item: Pick<MediaItem, "id" | "mediaType">) => boolean;
  inList: (listId: string, item: Pick<MediaItem, "id" | "mediaType">) => boolean;
  /** Quick add/remove on the first list, creating one if needed. Returns true when added. */
  toggleWatchlist: (item: MediaItem) => boolean;
  removeFromWatchlist: (item: Pick<MediaItem, "id" | "mediaType">) => void;
  createList: (name: string, items?: MediaItem[]) => { ok: true; list: WatchList } | { ok: false; reason: "invalid" | "limit" | "duplicate" };
  renameList: (id: string, name: string) => "ok" | "invalid" | "duplicate";
  deleteList: (id: string) => void;
  moveList: (id: string, dir: -1 | 1) => void;
  addToList: (id: string, item: MediaItem) => "ok" | "full" | "exists";
  removeFromList: (id: string, item: Pick<MediaItem, "id" | "mediaType">) => void;
  history: HistoryEntry[];
  addHistory: (item: MediaItem, progress?: number, season?: number, episode?: number) => void;
  removeHistory: (item: Pick<MediaItem, "id" | "mediaType">) => void;
  clearHistory: () => void;
  recentSearches: string[];
  addRecentSearch: (q: string) => void;
  clearRecentSearches: () => void;
}

const StoreContext = createContext<StoreState | null>(null);

const KEY = "movy:v1";
const keyOf = (item: Pick<MediaItem, "id" | "mediaType">) => `${item.mediaType === "anime" ? "tv" : item.mediaType}:${item.id}`;

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(`${KEY}:${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(`${KEY}:${key}`, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [lists, setLists] = useState<WatchList[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  // Hydrate from localStorage once on the client.
  useEffect(() => {
    const p = read<Profile[]>("profiles", []);
    const active = read<string | null>("active", null);
    setProfiles(p);
    setActiveId(active && p.some((x) => x.id === active) ? active : null);
    setRecentSearches(read<string[]>("recent", []));
    setReady(true);
  }, []);

  // Load per-profile lists when the active profile changes.
  useEffect(() => {
    if (!ready) return;
    if (!activeId) {
      setLists([]);
      setHistory([]);
      return;
    }
    const stored = read<WatchList[] | null>(`lists:${activeId}`, null);
    if (stored) {
      setLists(stored);
    } else {
      // Migrate the single watchlist from before lists existed.
      const legacy = read<MediaItem[]>(`watchlist:${activeId}`, []);
      setLists(legacy.length ? [{ id: newListId(), name: "Watchlist", createdAt: Date.now(), items: legacy }] : []);
    }
    setHistory(read<HistoryEntry[]>(`history:${activeId}`, []));
  }, [activeId, ready]);

  const persistProfiles = (next: Profile[]) => {
    setProfiles(next);
    write("profiles", next);
  };

  const createProfile = useCallback(
    (name: string, color: string, extra: Partial<Pick<Profile, "avatar" | "pinHash" | "interests">> = {}): Profile | null => {
      if (profiles.length >= MAX_PROFILES) return null;
      const p: Profile = { id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, name: name.trim(), color, createdAt: Date.now(), ...extra };
      const next = [...profiles, p];
      persistProfiles(next);
      setActiveId(p.id);
      write("active", p.id);
      return p;
    },
    [profiles],
  );

  const updateProfile = useCallback(
    (id: string, patch: Partial<Omit<Profile, "id" | "createdAt">>) => {
      persistProfiles(profiles.map((p) => (p.id === id ? { ...p, ...patch } : p)));
    },
    [profiles],
  );

  const selectProfile = useCallback(
    (id: string) => {
      if (!profiles.some((p) => p.id === id)) return;
      setActiveId(id);
      write("active", id);
    },
    [profiles],
  );

  const removeProfile = useCallback(
    (id: string) => {
      const next = profiles.filter((p) => p.id !== id);
      persistProfiles(next);
      try {
        window.localStorage.removeItem(`${KEY}:watchlist:${id}`);
        window.localStorage.removeItem(`${KEY}:lists:${id}`);
        window.localStorage.removeItem(`${KEY}:history:${id}`);
      } catch {
        /* noop */
      }
      if (activeId === id) {
        setActiveId(null);
        write("active", null);
      }
    },
    [profiles, activeId],
  );

  const logout = useCallback(() => {
    setActiveId(null);
    write("active", null);
  }, []);

  const commitLists = useCallback(
    (next: WatchList[]) => {
      setLists(next);
      if (activeId) write(`lists:${activeId}`, next);
    },
    [activeId],
  );

  const watchlist = useMemo(() => {
    const seen = new Set<string>();
    const out: MediaItem[] = [];
    for (const l of lists) for (const m of l.items) if (!seen.has(itemKey(m))) (seen.add(itemKey(m)), out.push(m));
    return out;
  }, [lists]);

  const slim = (item: MediaItem): MediaItem => ({ ...item, episodeCode: null, episodeAirDate: null, tag: null, overview: null });

  const inWatchlist = useCallback((item: Pick<MediaItem, "id" | "mediaType">) => lists.some((l) => l.items.some((m) => itemKey(m) === itemKey(item))), [lists]);
  const inList = useCallback((listId: string, item: Pick<MediaItem, "id" | "mediaType">) => lists.find((l) => l.id === listId)?.items.some((m) => itemKey(m) === itemKey(item)) ?? false, [lists]);

  const createList = useCallback<StoreState["createList"]>(
    (name, items = []) => {
      const clean = name.trim().replace(/\s+/g, " ");
      if (!validName(clean)) return { ok: false, reason: "invalid" };
      if (lists.length >= MAX_LISTS) return { ok: false, reason: "limit" };
      if (lists.some((l) => l.name.toLowerCase() === clean.toLowerCase())) return { ok: false, reason: "duplicate" };
      const list: WatchList = { id: newListId(), name: clean, createdAt: Date.now(), items: items.slice(0, MAX_ITEMS).map(slim) };
      commitLists([...lists, list]);
      return { ok: true, list };
    },
    [lists, commitLists],
  );

  const renameList = useCallback<StoreState["renameList"]>(
    (id, name) => {
      const clean = name.trim().replace(/\s+/g, " ");
      if (!validName(clean)) return "invalid";
      if (lists.some((l) => l.id !== id && l.name.toLowerCase() === clean.toLowerCase())) return "duplicate";
      commitLists(lists.map((l) => (l.id === id ? { ...l, name: clean } : l)));
      return "ok";
    },
    [lists, commitLists],
  );

  const deleteList = useCallback((id: string) => commitLists(lists.filter((l) => l.id !== id)), [lists, commitLists]);

  const moveList = useCallback(
    (id: string, dir: -1 | 1) => {
      const i = lists.findIndex((l) => l.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= lists.length) return;
      const next = [...lists];
      [next[i], next[j]] = [next[j], next[i]];
      commitLists(next);
    },
    [lists, commitLists],
  );

  const addToList = useCallback<StoreState["addToList"]>(
    (id, item) => {
      const list = lists.find((l) => l.id === id);
      if (!list) return "exists";
      if (list.items.some((m) => itemKey(m) === itemKey(item))) return "exists";
      if (list.items.length >= MAX_ITEMS) return "full";
      commitLists(lists.map((l) => (l.id === id ? { ...l, items: [slim(item), ...l.items] } : l)));
      return "ok";
    },
    [lists, commitLists],
  );

  const removeFromList = useCallback(
    (id: string, item: Pick<MediaItem, "id" | "mediaType">) => commitLists(lists.map((l) => (l.id === id ? { ...l, items: l.items.filter((m) => itemKey(m) !== itemKey(item)) } : l))),
    [lists, commitLists],
  );

  const toggleWatchlist = useCallback(
    (item: MediaItem): boolean => {
      if (!activeId) return false;
      if (inWatchlist(item)) {
        commitLists(lists.map((l) => ({ ...l, items: l.items.filter((m) => itemKey(m) !== itemKey(item)) })));
        return false;
      }
      if (!lists.length) {
        commitLists([{ id: newListId(), name: "Watchlist", createdAt: Date.now(), items: [slim(item)] }]);
        return true;
      }
      return addToList(lists[0].id, item) === "ok";
    },
    [activeId, lists, inWatchlist, commitLists, addToList],
  );

  const removeFromWatchlist = useCallback(
    (item: Pick<MediaItem, "id" | "mediaType">) => commitLists(lists.map((l) => ({ ...l, items: l.items.filter((m) => itemKey(m) !== itemKey(item)) }))),
    [lists, commitLists],
  );

  const addHistory = useCallback(
    (item: MediaItem, progress = 0.05, season?: number, episode?: number) => {
      if (!activeId) return;
      const entry: HistoryEntry = { item: { ...item, tag: null, episodeCode: null, episodeAirDate: null }, progress, watchedAt: Date.now(), season, episode };
      const next = [entry, ...history.filter((h) => keyOf(h.item) !== keyOf(item))].slice(0, 100);
      setHistory(next);
      write(`history:${activeId}`, next);
    },
    [activeId, history],
  );

  const removeHistory = useCallback(
    (item: Pick<MediaItem, "id" | "mediaType">) => {
      if (!activeId) return;
      const next = history.filter((h) => keyOf(h.item) !== keyOf(item));
      setHistory(next);
      write(`history:${activeId}`, next);
    },
    [activeId, history],
  );

  const clearHistory = useCallback(() => {
    if (!activeId) return;
    setHistory([]);
    write(`history:${activeId}`, []);
  }, [activeId]);

  const addRecentSearch = useCallback((q: string) => {
    const clean = q.trim();
    if (!clean) return;
    setRecentSearches((prev) => {
      const next = [clean, ...prev.filter((x) => x.toLowerCase() !== clean.toLowerCase())].slice(0, 6);
      write("recent", next);
      return next;
    });
  }, []);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    write("recent", []);
  }, []);

  const value = useMemo<StoreState>(
    () => ({
      ready,
      profiles,
      profile: profiles.find((p) => p.id === activeId) ?? null,
      createProfile,
      updateProfile,
      selectProfile,
      removeProfile,
      logout,
      watchlist,
      lists,
      inWatchlist,
      inList,
      toggleWatchlist,
      removeFromWatchlist,
      createList,
      renameList,
      deleteList,
      moveList,
      addToList,
      removeFromList,
      history,
      addHistory,
      removeHistory,
      clearHistory,
      recentSearches,
      addRecentSearch,
      clearRecentSearches,
    }),
    [ready, profiles, activeId, createProfile, updateProfile, selectProfile, removeProfile, logout, watchlist, lists, inWatchlist, inList, toggleWatchlist, removeFromWatchlist, createList, renameList, deleteList, moveList, addToList, removeFromList, history, addHistory, removeHistory, clearHistory, recentSearches, addRecentSearch, clearRecentSearches],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
