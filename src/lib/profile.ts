import { Bird, Bot, Cat, Crown, Dog, Fish, Flame, Gamepad2, Ghost, Heart, Moon, Music, Popcorn, Rabbit, Rocket, Skull, Star, Sun, Swords, Zap, type LucideIcon } from "lucide-react";

export type AvatarSpec = { kind: "icon"; icon: string; color: string } | { kind: "image"; src: string };

export const AVATAR_ICONS: Record<string, LucideIcon> = {
  ghost: Ghost,
  rocket: Rocket,
  cat: Cat,
  dog: Dog,
  bird: Bird,
  fish: Fish,
  rabbit: Rabbit,
  skull: Skull,
  bot: Bot,
  crown: Crown,
  flame: Flame,
  heart: Heart,
  moon: Moon,
  sun: Sun,
  star: Star,
  zap: Zap,
  popcorn: Popcorn,
  gamepad: Gamepad2,
  music: Music,
  swords: Swords,
};

export const AVATAR_COLORS = ["#dc2626", "#2563eb", "#059669", "#d97706", "#7c3aed", "#db2777", "#0891b2", "#4b5563"];

export const MAX_PROFILES = 5;
export const PIN_LENGTH = 4;

export interface Interests {
  movie: number[];
  tv: number[];
}

export const emptyInterests = (): Interests => ({ movie: [], tv: [] });

/** SHA-256 of `salt:pin`, hex encoded. Falls back to a plain string where WebCrypto is unavailable. */
export async function hashPin(pin: string, salt: string): Promise<string> {
  const data = `${salt}:${pin}`;
  if (typeof crypto === "undefined" || !crypto.subtle) return `plain:${data}`;
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(data));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Resize an uploaded image to a small square data URL so it fits comfortably in localStorage. */
export function imageToAvatar(file: File, size = 160): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) return reject(new Error("not an image"));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("no canvas"));
      const side = Math.min(img.width, img.height);
      ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("could not read image"));
    };
    img.src = url;
  });
}
