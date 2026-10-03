import type { MediaItem } from "./types";

export interface Room {
  id: string;
  name: string;
  isPrivate: boolean;
  password?: string;
  owner: string;
  video: MediaItem;
  season?: number;
  episode?: number;
  createdAt: number;
  participants: string[];
}

export interface ChatMessage {
  id: string;
  author: string;
  text: string;
  at: number;
  system?: boolean;
}

const KEY = "movy:v1:rooms";

export function loadRooms(): Room[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "[]") as Room[];
  } catch {
    return [];
  }
}

export function saveRooms(rooms: Room[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(rooms));
  } catch {
    /* noop */
  }
}

export function roomId(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

export function loadChat(id: string): ChatMessage[] {
  try {
    return JSON.parse(window.localStorage.getItem(`${KEY}:chat:${id}`) ?? "[]") as ChatMessage[];
  } catch {
    return [];
  }
}

export function saveChat(id: string, messages: ChatMessage[]) {
  try {
    window.localStorage.setItem(`${KEY}:chat:${id}`, JSON.stringify(messages.slice(-200)));
  } catch {
    /* noop */
  }
}
