import { useRouter } from "next/router";
import { useState } from "react";
import { useTranslations } from "next-intl";
import type { MediaItem } from "@/lib/types";
import { PROVIDERS, type Provider } from "@/lib/providers";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollRow } from "@/components/media/ScrollRow";
import { MovieCard } from "@/components/media/MovieCard";
import { slideClass } from "@/components/media/Rail";
import { cx } from "@/lib/format";
import styles from "./StreamingRail.module.scss";

function Wordmark({ p }: { p: Provider }) {
  if (p.mark === "prime")
    return (
      <span className={cx(styles.mark, styles.prime)}>
        <span>prime</span>
        <span>video</span>
      </span>
    );
  const label = p.mark === "hulu" ? "hulu" : p.mark === "netflix" ? "NETFLIX" : p.mark === "hbo" ? "HBO Max" : p.label;
  return <span className={cx(styles.mark, styles[p.mark])}>{label}</span>;
}

export function StreamingRail({ initial }: { initial: Record<string, MediaItem[]> }) {
  const t = useTranslations("Home");
  const router = useRouter();
  const [active, setActive] = useState(PROVIDERS[0].key);
  const [lists, setLists] = useState<Record<string, MediaItem[]>>(initial);
  const [loading, setLoading] = useState(false);
  const provider = PROVIDERS.find((p) => p.key === active) ?? PROVIDERS[0];
  const items = lists[active] ?? [];

  const select = async (p: Provider) => {
    setActive(p.key);
    if ((lists[p.key] ?? []).length) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/browse?type=tv&network=${p.network}&locale=${router.locale ?? "en"}`);
      const data = (await res.json()) as { items: MediaItem[] };
      setLists((prev) => ({ ...prev, [p.key]: data.items ?? [] }));
    } catch {
      /* keep empty */
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <SectionHeader
        title={
          <span className="inline-flex items-baseline gap-2 flex-wrap">
            <span>{t("only_on")}</span>
            <span style={{ color: provider.text }}>{provider.label}</span>
          </span>
        }
        subtitle={t("only_on_subtitle")}
      />
      <div className={styles.rail} role="group" aria-label={t("streaming_providers")}>
        {PROVIDERS.map((p) => (
          <button
            key={p.key}
            type="button"
            aria-label={p.label}
            aria-pressed={p.key === active}
            className={cx(styles.tile, p.key === active && styles.tileActive)}
            style={{ "--brand-soft": p.soft } as React.CSSProperties}
            onClick={() => select(p)}
          >
            <Wordmark p={p} />
          </button>
        ))}
      </div>
      <div key={active} className={cx("animate-fade-in mt-6", loading && "opacity-60")}>
        {items.length ? (
          <ScrollRow label={provider.label}>
            {items.map((item, i) => (
              <div key={`${item.mediaType}:${item.id}`} className={slideClass("rail")}>
                <MovieCard item={item} priority={i < 4} />
              </div>
            ))}
          </ScrollRow>
        ) : (
          <div className="grid grid-cols-2 gap-x-1.5 gap-y-6 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] rounded-[10px] border border-border-subtle bg-surface-1 md:aspect-video" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
