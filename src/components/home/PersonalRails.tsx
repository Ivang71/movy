import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { MediaItem } from "@/lib/types";
import { useStore } from "@/lib/store";
import { Rail } from "@/components/media/Rail";
import { itemKey } from "@/lib/lists";

async function getItems(url: string): Promise<MediaItem[]> {
  try {
    const r = await fetch(url);
    const d = (await r.json()) as { items?: MediaItem[] };
    return d.items ?? [];
  } catch {
    return [];
  }
}

function interleave<T>(a: T[], b: T[]): T[] {
  const out: T[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (i < a.length) out.push(a[i]);
    if (i < b.length) out.push(b[i]);
  }
  return out;
}

/** "For you" and "Because you watched" rails, shown to profiles that have interests or history. */
export function PersonalRails() {
  const t = useTranslations("Home");
  const router = useRouter();
  const locale = router.locale ?? "en";
  const { ready, profile, history } = useStore();
  const [forYou, setForYou] = useState<MediaItem[]>([]);
  const [because, setBecause] = useState<{ title: string; items: MediaItem[] } | null>(null);

  const interests = profile?.interests;
  const interestKey = `${interests?.movie.join("|") ?? ""}/${interests?.tv.join("|") ?? ""}`;
  const lastWatched = history[0]?.item;
  const seen = useMemo(() => new Set(history.map((h) => itemKey(h.item))), [history]);

  useEffect(() => {
    if (!ready || !profile) return setForYou([]);
    const movie = interests?.movie ?? [];
    const tv = interests?.tv ?? [];
    if (!movie.length && !tv.length) return setForYou([]);
    let alive = true;
    Promise.all([
      movie.length ? getItems(`/api/browse?type=movie&genres=${encodeURIComponent(movie.join("|"))}&locale=${locale}`) : Promise.resolve([]),
      tv.length ? getItems(`/api/browse?type=tv&genres=${encodeURIComponent(tv.join("|"))}&locale=${locale}`) : Promise.resolve([]),
    ]).then(([m, s]) => alive && setForYou(interleave(m, s).filter((x) => !seen.has(itemKey(x))).slice(0, 20)));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, profile?.id, interestKey, locale]);

  useEffect(() => {
    if (!ready || !profile || !lastWatched) return setBecause(null);
    let alive = true;
    getItems(`/api/recommendations?type=${lastWatched.mediaType}&id=${lastWatched.id}&locale=${locale}`).then((items) => {
      if (alive) setBecause(items.length ? { title: lastWatched.title, items: items.filter((x) => !seen.has(itemKey(x))) } : null);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, profile?.id, lastWatched?.id, lastWatched?.mediaType, locale]);

  if (!profile) return null;
  return (
    <>
      {forYou.length ? <Rail title={t("foryou")} subtitle={t("foryou_subtitle")} items={forYou} /> : null}
      {because?.items.length ? <Rail title={`${t("because_you_watched")} ${because.title}`} items={because.items} /> : null}
    </>
  );
}
