import type { MediaItem } from "@/lib/types";
import { tmdbImage } from "@/lib/images";
import { cx } from "@/lib/format";
import styles from "./PosterMarquee.module.scss";

interface Props {
  items: MediaItem[];
  tracks?: number;
  banner?: boolean;
  className?: string;
}

/** Infinite vertical poster wall used behind browse headers and the auth wall. */
export function PosterMarquee({ items, tracks = 6, banner, className }: Props) {
  const posters = items.filter((m) => m.poster);
  if (!posters.length) return null;
  const perTrack = Math.max(4, Math.ceil(posters.length / tracks));
  const columns = Array.from({ length: tracks }, (_, t) => {
    const slice: MediaItem[] = [];
    for (let i = 0; i < perTrack; i++) slice.push(posters[(t * perTrack + i) % posters.length]);
    return slice;
  });
  return (
    <div className={cx(styles.wall, banner && styles.banner, className)} aria-hidden="true">
      <div className={styles.row}>
        {columns.map((col, t) => (
          <div key={t} className={cx(styles.track, t % 2 === 1 && styles.reverse, t % 3 === 2 && styles.offset)} style={{ "--duration": `${36 + (t % 3) * 9}s` } as React.CSSProperties}>
            {[0, 1].map((dup) => (
              <div key={dup} className={styles.rail}>
                {col.map((m, i) => (
                  <div key={`${m.id}-${i}`} className={styles.poster}>
                    <img src={tmdbImage(m.poster, "w342") ?? ""} alt="" loading="lazy" decoding="async" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.fadeTop} />
      <div className={styles.fadeBottom} />
    </div>
  );
}
