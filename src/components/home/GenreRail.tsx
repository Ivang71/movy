import Link from "next/link";
import { useTranslations } from "next-intl";
import type { MediaItem } from "@/lib/types";
import { POPULAR_GENRES, type GenreTile } from "@/lib/genres";
import { tmdbImage } from "@/lib/images";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollRow } from "@/components/media/ScrollRow";
import { cx } from "@/lib/format";
import styles from "./GenreRail.module.scss";

export function GenreCard({ genre, wallpaper, fluid }: { genre: GenreTile; wallpaper?: string | null; fluid?: boolean }) {
  const src = tmdbImage(wallpaper, "w780");
  return (
    <Link href={`/browse/movie?genres=${genre.movieGenre}`} className={cx(styles.card, fluid && styles.fluid)} style={{ "--genre-accent": genre.accent } as React.CSSProperties} aria-label={genre.label}>
      {src ? <img className={styles.wallpaper} src={src} alt="" loading="lazy" decoding="async" /> : null}
      <span className={styles.wash} aria-hidden="true" />
      <p className={styles.label}>{genre.label}</p>
    </Link>
  );
}

/** Picks a backdrop for each genre from the titles already on the page. */
export function pickWallpapers(pool: MediaItem[]): Record<string, string | null> {
  const used = new Set<string>();
  const out: Record<string, string | null> = {};
  for (const g of POPULAR_GENRES) {
    const hit = pool.find((m) => m.backdrop && !used.has(m.backdrop) && (m.genreIds.includes(g.movieGenre) || m.genreIds.includes(g.tvGenre)));
    if (hit?.backdrop) used.add(hit.backdrop);
    out[g.key] = hit?.backdrop ?? null;
  }
  return out;
}

export function GenreRail({ pool }: { pool: MediaItem[] }) {
  const t = useTranslations("Home");
  const wallpapers = pickWallpapers(pool);
  return (
    <section>
      <SectionHeader title={t("genres")} subtitle={t("genres_subtitle")} href="/browse/movie" />
      <ScrollRow label={t("genres")}>
        {POPULAR_GENRES.map((g) => (
          <div key={g.key} className="w-auto">
            <GenreCard genre={g} wallpaper={wallpapers[g.key]} />
          </div>
        ))}
      </ScrollRow>
    </section>
  );
}
