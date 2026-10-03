import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { useTranslations } from "next-intl";
import { Bookmark, BookmarkCheck, Star, Volume2, VolumeX } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { backdropSrcSet, posterSrcSet } from "@/lib/images";
import { formatRating, formatShortDate, cx } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useUi } from "@/components/layout/UiContext";
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

/** Trailer ids already looked up this session (null means "no trailer"). */
const trailerCache = new Map<string, Promise<string | null>>();

function lookupTrailer(item: MediaItem, locale: string): Promise<string | null> {
  const key = `${item.mediaType}:${item.id}:${locale}`;
  let hit = trailerCache.get(key);
  if (!hit) {
    hit = fetch(`/api/trailer?type=${item.mediaType}&id=${item.id}&locale=${locale}`)
      .then((r) => r.json())
      .then((d: { key: string | null }) => d.key)
      .catch(() => null);
    trailerCache.set(key, hit);
  }
  return hit;
}

const HOVER_DELAY_MS = 900;
const canHoverPlay = () => typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 768px)").matches;

export function mediaLabel(t: ReturnType<typeof useTranslations<"Home">>, type: MediaItem["mediaType"]): string {
  if (type === "tv") return t("media_tv");
  if (type === "anime") return t("media_anime");
  return t("media_movie");
}

export function MovieCard({ item, variant = "rail", episodeMeta, rank, progress, priority, className, showWatchlist = true }: Props) {
  const t = useTranslations("Home");
  const router = useRouter();
  const { profile, inWatchlist, toggleWatchlist } = useStore();
  const { openAuth, toast } = useUi();
  const [loaded, setLoaded] = useState(false);
  const portrait = variant === "poster";
  const landscape = !portrait;

  // Desktop rails show the backdrop; mobile and poster variants show the poster.
  const posterImg = posterSrcSet(item.poster);
  const backdropImg = backdropSrcSet(item.backdrop);
  const rating = formatRating(item.rating);
  const saved = inWatchlist(item);

  // Hover trailer: starts after a short dwell, muted, with a corner mute toggle.
  const [wantTrailer, setWantTrailer] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [trailerReady, setTrailerReady] = useState(false);
  const [muted, setMuted] = useState(true);
  const dwell = useRef<number | null>(null);
  const frame = useRef<HTMLIFrameElement>(null);

  const onEnter = () => {
    if (!canHoverPlay() || variant === "poster") return;
    dwell.current = window.setTimeout(() => setWantTrailer(true), HOVER_DELAY_MS);
  };
  const onLeave = () => {
    if (dwell.current) window.clearTimeout(dwell.current);
    dwell.current = null;
    setWantTrailer(false);
    setTrailerReady(false);
    setMuted(true);
  };
  useEffect(() => {
    if (!wantTrailer) return;
    let alive = true;
    lookupTrailer(item, router.locale ?? "en").then((k) => alive && setTrailerKey(k));
    return () => {
      alive = false;
    };
  }, [wantTrailer, item, router.locale]);
  useEffect(() => () => void (dwell.current && window.clearTimeout(dwell.current)), []);

  const toggleMute = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = !muted;
    setMuted(next);
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: next ? "mute" : "unMute", args: [] }), "*");
  };
  const playing = wantTrailer && Boolean(trailerKey);

  const onToggle = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!profile) {
      openAuth();
      return;
    }
    toast(toggleWatchlist(item) ? t("watchlist_added") : t("watchlist_removed"));
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
    <div className={cx("group", className)} onMouseEnter={onEnter} onMouseLeave={onLeave}>
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
            {playing ? (
              <div className={cx(styles.trailerWrapper, trailerReady && styles.trailerWrapperOn)} aria-hidden="true">
                <iframe
                  ref={frame}
                  className={styles.trailerIframe}
                  title=""
                  tabIndex={-1}
                  allow="autoplay; encrypted-media"
                  src={`https://www.youtube-nocookie.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&loop=1&playlist=${trailerKey}&modestbranding=1&playsinline=1&rel=0&enablejsapi=1`}
                  onLoad={() => setTrailerReady(true)}
                />
              </div>
            ) : null}
            {wantTrailer && (!trailerKey || !trailerReady) && trailerKey !== null ? (
              <div className={styles.trailerLoader} aria-hidden="true">
                <span className={styles.trailerLoaderSpinner} />
              </div>
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
        {playing && trailerReady ? (
          <button type="button" className={cx(styles.corner, styles.cornerOn, styles.muteBtn)} aria-label={muted ? t("unmute") : t("mute")} aria-pressed={!muted} onClick={toggleMute}>
            {muted ? <VolumeX className="h-[15px] w-[15px]" aria-hidden="true" /> : <Volume2 className="h-[15px] w-[15px]" aria-hidden="true" />}
          </button>
        ) : showWatchlist ? (
          <button type="button" className={cx(styles.corner, saved && styles.cornerOn)} aria-pressed={saved} aria-label={saved ? "Remove from watchlist" : "Add to watchlist"} onClick={onToggle}>
            {saved ? <BookmarkCheck className="h-[15px] w-[15px] text-primary" aria-hidden="true" /> : <Bookmark className="h-[15px] w-[15px]" aria-hidden="true" />}
          </button>
        ) : null}
      </div>
    </div>
  );
}
