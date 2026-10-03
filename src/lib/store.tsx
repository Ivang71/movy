import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { MediaItem } from "./types";

export interface Profile {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export interface HistoryEntry {
  item: MediaItem;
  progress: number;
  watchedAt: number;
  season?: number;
  episode?: number;
}

export const AVATAR_COLORS = ["#dc2626", "#2563eb", "#059669", "#d97706", "#7c3aed", "#db2777", "#0891b2", "#4b5563"];

interface StoreState {
  ready: boolean;
  profiles: Profile[];
  profile: Profile | null;
  createProfile: (name: string, color: string) => Profile;
  selectProfile: (id: string) => void;
  removeProfile: (id: string) => void;
  logout: () => void;
  watchlist: MediaItem[];
  inWatchlist: (item: Pick<MediaItem, "id" | "mediaType">) => boolean;
  toggleWatchlist: (item: MediaItem) => boolean;
  removeFromWatchlist: (item: Pick<MediaItem, "id" | "mediaType">) => void;
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
  const [watchlist, setWatchlist] = useState<MediaItem[]>([]);
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
      setWatchlist([]);
      setHistory([]);
      return;
    }
    setWatchlist(read<MediaItem[]>(`watchlist:${activeId}`, []));
    setHistory(read<HistoryEntry[]>(`history:${activeId}`, []));
  }, [activeId, ready]);

  const persistProfiles = (next: Profile[]) => {
    setProfiles(next);
    write("profiles", next);
  };

  const createProfile = useCallback(
    (name: string, color: string): Profile => {
      const p: Profile = { id: `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`, name: name.trim(), color, createdAt: Date.now() };
      const next = [...profiles, p];
      persistProfiles(next);
      setActiveId(p.id);
      write("active", p.id);
      return p;
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

  const inWatchlist = useCallback((item: Pick<MediaItem, "id" | "mediaType">) => watchlist.some((w) => keyOf(w) === keyOf(item)), [watchlist]);

  const toggleWatchlist = useCallback(
    (item: MediaItem): boolean => {
      if (!activeId) return false;
      const exists = watchlist.some((w) => keyOf(w) === keyOf(item));
      const next = exists ? watchlist.filter((w) => keyOf(w) !== keyOf(item)) : [{ ...item, episodeCode: null, episodeAirDate: null, tag: null }, ...watchlist];
      setWatchlist(next);
      write(`watchlist:${activeId}`, next);
      return !exists;
    },
    [activeId, watchlist],
  );

  const removeFromWatchlist = useCallback(
    (item: Pick<MediaItem, "id" | "mediaType">) => {
      if (!activeId) return;
      const next = watchlist.filter((w) => keyOf(w) !== keyOf(item));
      setWatchlist(next);
      write(`watchlist:${activeId}`, next);
    },
    [activeId, watchlist],
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
      selectProfile,
      removeProfile,
      logout,
      watchlist,
      inWatchlist,
      toggleWatchlist,
      removeFromWatchlist,
      history,
      addHistory,
      removeHistory,
      clearHistory,
      recentSearches,
      addRecentSearch,
      clearRecentSearches,
    }),
    [ready, profiles, activeId, createProfile, selectProfile, removeProfile, logout, watchlist, inWatchlist, toggleWatchlist, removeFromWatchlist, history, addHistory, removeHistory, clearHistory, recentSearches, addRecentSearch, clearRecentSearches],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
