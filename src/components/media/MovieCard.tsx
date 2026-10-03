import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { Bookmark, BookmarkCheck, Star } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { backdropSrcSet, posterSrcSet } from "@/lib/images";
import { formatRating, formatShortDate, cx } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useRouter } from "next/router";
import styles from "./MovieCard.module.scss";

export type CardVariant = "rail" | "poster" | "upcoming";

interface Props {
  item: MediaItem;
  variant?: CardVariant;
  /** Show "S1.E7 · Sep 27" instead of year and type (implied by the upcoming variant). */
  episodeMeta?: boolean;
  rank?: number;
  progress?: number;
  priority?: boolean;
  className?: string;
  showWatchlist?: boolean;
}

export function mediaLabel(t: ReturnType<typeof useTranslations<"Home">>, type: MediaItem["mediaType"]): string {
  if (type === "tv") return t("media_tv");
  if (type === "anime") return t("media_anime");
  return t("media_movie");
}

export function MovieCard({ item, variant = "rail", episodeMeta, rank, progress, priority, className, showWatchlist = true }: Props) {
  const t = useTranslations("Home");
  const router = useRouter();
  const { inWatchlist, toggleWatchlist } = useStore();
  const [loaded, setLoaded] = useState(false);
  const portrait = variant === "poster";
  const landscape = !portrait;

  // Desktop rails show the backdrop; mobile and poster variants show the poster.
  const posterImg = posterSrcSet(item.poster);
  const backdropImg = backdropSrcSet(item.backdrop);
  const rating = formatRating(item.rating);
  const saved = inWatchlist(item);

  const onToggle = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist(item);
  };

  const meta: React.ReactNode[] = [];
  if (rating) {
    meta.push(
      <span key="r" className="inline-flex items-center gap-1">
        <Star className="h-[11px] w-[11px] fill-primary text-primary" aria-hidden="true" />
        <span className="tabular-nums">{rating}</span>
      </span>,
    );
  }
  if ((variant === "upcoming" || episodeMeta) && item.episodeCode) {
    meta.push(
      <span key="e" className="tabular-nums text-accent-hi font-medium">
        {item.episodeCode}
      </span>,
    );
    const d = formatShortDate(item.episodeAirDate ?? item.releaseDate, router.locale);
    if (d) meta.push(<span key="d">{d}</span>);
  } else {
    if (item.year) meta.push(<span key="y" className="tabular-nums">{item.year}</span>);
    meta.push(<span key="t">{mediaLabel(t, item.mediaType)}</span>);
  }

  const tagLabel =
    item.tag === "recently_added"
      ? t("tag_recently_added")
      : item.tag === "new_episode"
        ? t("tag_new_episode")
        : item.tag === "coming_soon"
          ? t("tag_coming_soon")
          : item.tag === "new_season"
            ? t("tag_new_season")
            : null;

  return (
    <div className={cx("group", className)}>
      <div className={cx("w-full media-card media-card-vertical", styles.card, portrait ? styles.portrait : styles.landscape)}>
        <Link href={item.slug} aria-label={item.title}>
          <div className={styles.image}>
            <div className={styles.placeholder} aria-hidden="true" />
            {landscape && backdropImg ? (
              <picture>
                {posterImg ? <source media="(max-width: 767.98px)" srcSet={posterImg.srcSet} sizes="40vw" /> : null}
                <img
                  className={cx(styles.poster, loaded && styles.posterLoaded)}
                  src={backdropImg.src}
                  srcSet={backdropImg.srcSet}
                  sizes="(min-width: 768px) 320px, 40vw"
                  alt=""
                  loading={priority ? "eager" : "lazy"}
                  decoding="async"
                  onLoad={() => setLoaded(true)}
                />
              </picture>
            ) : posterImg ? (
              <img
                className={cx(styles.poster, loaded && styles.posterLoaded)}
                src={posterImg.src}
                srcSet={posterImg.srcSet}
                sizes="(min-width: 1024px) 200px, (min-width: 768px) 180px, 150px"
                alt=""
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                onLoad={() => setLoaded(true)}
              />
            ) : null}
            <div className={styles.filter} aria-hidden="true" />
            {rank ? (
              <div className={styles.rank} aria-label={`${t("top")} ${rank}`}>
                <span className={styles.rankLabel}>{t("top")}</span>
                <span className={styles.rankNum}>{rank}</span>
              </div>
            ) : null}
            {tagLabel && !progress ? (
              <div className={styles.tag}>
                <span className={styles.tagSolid}>{tagLabel}</span>
              </div>
            ) : null}
            {progress ? (
              <div className={styles.progress} aria-hidden="true">
                <div className={styles.progressBar} style={{ width: `${Math.round(progress * 100)}%` }} />
              </div>
            ) : null}
          </div>
          <div className="mt-2.5 px-0.5">
            <h3 className="text-[13px] font-medium leading-snug text-text-hi line-clamp-1 transition-colors duration-200 group-hover:text-primary">{item.title}</h3>
            <div className="flex items-center gap-1.5 mt-1 text-[11px] text-text-mid leading-none truncate">
              <span className="inline-flex items-center gap-1.5">
                {meta.map((m, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5">
                    {i > 0 ? <span className="text-white/20">·</span> : null}
                    {m}
                  </span>
                ))}
              </span>
            </div>
          </div>
        </Link>
        {showWatchlist ? (
          <button type="button" className={cx(styles.corner, saved && styles.cornerOn)} aria-pressed={saved} aria-label={saved ? "Remove from watchlist" : "Add to watchlist"} onClick={onToggle}>
            {saved ? <BookmarkCheck className="h-[15px] w-[15px] text-primary" aria-hidden="true" /> : <Bookmark className="h-[15px] w-[15px]" aria-hidden="true" />}
          </button>
        ) : null}
      </div>
    </div>
  );
}
