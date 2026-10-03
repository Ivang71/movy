import type { AbstractIntlMessages } from "next-intl";

export const LOCALES = ["en", "pt", "es", "de", "fr", "ru", "tr", "id", "it"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
  de: "Deutsch",
  fr: "Français",
  ru: "Русский",
  tr: "Türkçe",
  id: "Bahasa Indonesia",
  it: "Italiano",
};

type Messages = Record<string, unknown>;

function deepMerge(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [k, v] of Object.entries(override)) {
    const b = out[k];
    if (v && typeof v === "object" && !Array.isArray(v) && b && typeof b === "object" && !Array.isArray(b)) {
      out[k] = deepMerge(b as Messages, v as Messages);
    } else {
      out[k] = v;
    }
  }
  return out;
}

/** Loads a locale's catalog, falling back to English for any missing key. */
export async function getMessages(locale: string | undefined): Promise<AbstractIntlMessages> {
  const en = (await import("../../messages/en.json")).default as Messages;
  const target = (LOCALES as readonly string[]).includes(locale ?? "") ? (locale as Locale) : "en";
  if (target === "en") return en as AbstractIntlMessages;
  try {
    const extra = (await import(`../../messages/${target}.json`)).default as Messages;
    return deepMerge(en, extra) as AbstractIntlMessages;
  } catch {
    return en as AbstractIntlMessages;
  }
}

export function pickNamespaces(messages: AbstractIntlMessages, namespaces: string[]): AbstractIntlMessages {
  const out: Messages = {};
  for (const ns of namespaces) if (ns in messages) out[ns] = (messages as Messages)[ns];
  return out as AbstractIntlMessages;
}

/** Namespaces every page needs for the shared layout (header, dock, footer, search, auth). */
export const BASE_NAMESPACES = ["Meta", "Header", "Footer", "Account", "Home", "Search", "Browse"];

export async function getPageMessages(locale: string | undefined, extra: string[] = []): Promise<Record<string, unknown>> {
  const all = await getMessages(locale);
  return pickNamespaces(all, [...BASE_NAMESPACES, ...extra]) as Record<string, unknown>;
}
