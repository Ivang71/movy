import Link from "next/link";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, PlayCircle } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { backdropSrcSet, posterSrcSet, tmdbImage } from "@/lib/images";
import { genreNames } from "@/lib/genres";
import { formatRating, cx } from "@/lib/format";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollRow } from "@/components/media/ScrollRow";
import { MovieCard, mediaLabel } from "@/components/media/MovieCard";
import { slideClass } from "@/components/media/Rail";
import styles from "./Top10.module.scss";

function useTrailer(item: MediaItem | null, locale: string | undefined) {
  const [key, setKey] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    if (!item) return;
    let alive = true;
    setKey(undefined);
    fetch(`/api/trailer?type=${item.mediaType}&id=${item.id}&locale=${locale ?? "en"}`)
      .then((r) => r.json())
      .then((d: { key: string | null }) => alive && setKey(d.key))
      .catch(() => alive && setKey(null));
    return () => {
      alive = false;
    };
  }, [item, locale]);
  return key;
}

function TrailerPane({ item, open, onClose, locale }: { item: MediaItem; open: boolean; onClose: () => void; locale?: string }) {
  const t = useTranslations("Home");
  const key = useTrailer(open ? item : null, locale);
  return (
    <div className={cx(styles.trailerPane, open && styles.trailerPaneOpen)} aria-hidden={!open}>
      {open ? (
        key === undefined ? (
          <span className={styles.trailerSpinner} aria-hidden="true" />
        ) : key ? (
          <iframe
            className={styles.trailerVideo}
            src={`https://www.youtube-nocookie.com/embed/${key}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1&loop=1&playlist=${key}`}
            title={item.title}
            allow="autoplay; encrypted-media"
          />
        ) : (
          <div className={styles.trailerEmpty}>{item.title}</div>
        )
      ) : null}
      <button type="button" className={cx("control-3d", styles.trailerBack)} aria-label={t("close_trailer")} onClick={onClose}>
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function RankBadge({ rank, right }: { rank: number; right?: boolean }) {
  const t = useTranslations("Home");
  return (
    <span className={cx(styles.rankBadge, right && styles.rankBadgeRight)}>
      <span className={styles.rankLabel}>{t("top")}</span>
      <span className={styles.rankNum}>{rank}</span>
    </span>
  );
}

function CardMeta({ item }: { item: MediaItem }) {
  const t = useTranslations("Home");
  const rating = formatRating(item.rating);
  return (
    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-text-mid leading-none truncate">
      {rating ? (
        <span className="inline-flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="h-[11px] w-[11px] fill-primary text-primary" aria-hidden="true">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="tabular-nums">{rating}</span>
        </span>
      ) : null}
      {item.year ? (
        <>
          <span className="text-white/20">·</span>
          <span className="tabular-nums">{item.year}</span>
        </>
      ) : null}
      <span className="text-white/20">·</span>
      <span>{mediaLabel(t, item.mediaType)}</span>
    </div>
  );
}

function WideCard({ item, locale }: { item: MediaItem; locale?: string }) {
  const t = useTranslations("Home");
  const [open, setOpen] = useState(false);
  const [logoOk, setLogoOk] = useState(true);
  const img = backdropSrcSet(item.backdrop);
  return (
    <div className="group w-[552px] lg:w-[612px]">
      <article className={styles.wideCard}>
        {img ? <img className={styles.wideBackdrop} src={img.src} srcSet={img.srcSet} sizes="612px" alt="" loading="eager" decoding="async" /> : null}
        <div className={styles.wideWash} aria-hidden="true" />
        <RankBadge rank={1} />
        <Link href={item.slug} className={styles.wideBody} aria-label={item.title}>
          {item.logo && logoOk ? <img className={styles.wideLogo} src={tmdbImage(item.logo, "w300") ?? ""} alt={item.title} loading="lazy" decoding="async" onError={() => setLogoOk(false)} /> : <h3 className={styles.wideTitle}>{item.title}</h3>}
          {item.overview ? <p className={styles.plot}>{item.overview}</p> : null}
        </Link>
        <button type="button" className={cx("control-3d", styles.trailerBtn, styles.wideTrailerBtn)} onClick={() => setOpen(true)}>
          <PlayCircle className="h-4 w-4" aria-hidden="true" />
          {t("see_trailer")}
        </button>
        <TrailerPane item={item} open={open} onClose={() => setOpen(false)} locale={locale} />
      </article>
      <Link href={item.slug} className="block mt-2.5 px-0.5">
        <h3 className="text-[13px] font-medium leading-snug text-text-hi line-clamp-1 transition-colors duration-200 group-hover:text-primary">{item.title}</h3>
        <CardMeta item={item} />
      </Link>
    </div>
  );
}

function FeatureCard({ item, locale }: { item: MediaItem; locale?: string }) {
  const t = useTranslations("Home");
  const [open, setOpen] = useState(false);
  const poster = posterSrcSet(item.poster);
  const back = backdropSrcSet(item.backdrop);
  const rating = formatRating(item.rating);
  const genres = genreNames(item.genreIds, item.mediaType, 2);
  return (
    <article className={styles.featureCard}>
      <span className={styles.wallpaper} aria-hidden="true">
        {back ? <img src={back.src} alt="" loading="lazy" decoding="async" /> : null}
      </span>
      <RankBadge rank={1} right />
      <Link href={item.slug} className={styles.body} aria-label={item.title}>
        <div className={styles.featureRow}>
          <div className={styles.poster}>{poster ? <img src={poster.src} srcSet={poster.srcSet} sizes="108px" alt="" loading="lazy" decoding="async" /> : null}</div>
          <div className={styles.info}>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.meta}>
              {[rating ? `★ ${rating}` : null, item.year, mediaLabel(t, item.mediaType), ...genres].filter(Boolean).join(" · ")}
            </p>
            {item.overview ? <p className={cx(styles.plot, styles.featurePlot)}>{item.overview}</p> : null}
          </div>
        </div>
      </Link>
      <button type="button" className={cx("control-3d relative z-[1] self-start", styles.trailerBtn)} onClick={() => setOpen(true)}>
        <PlayCircle className="h-4 w-4" aria-hidden="true" />
        {t("see_trailer")}
      </button>
      <TrailerPane item={item} open={open} onClose={() => setOpen(false)} locale={locale} />
    </article>
  );
}

export function Top10({ items, locale }: { items: MediaItem[]; locale?: string }) {
  const t = useTranslations("Home");
  if (!items.length) return null;
  const [first, ...rest] = items;
  return (
    <section>
      <SectionHeader title={t("popular")} subtitle={t("popular_subtitle")} />
      {/* Small screens: feature card then a poster rail */}
      <div className="lg:hidden">
        <FeatureCard item={first} locale={locale} />
        <ScrollRow label={t("popular")}>
          {rest.map((item, i) => (
            <div key={`${item.mediaType}:${item.id}`} className={slideClass("poster")}>
              <MovieCard item={item} variant="poster" rank={i + 2} />
            </div>
          ))}
        </ScrollRow>
      </div>
      {/* Large screens: wide card inline with the poster rail */}
      <div className="hidden lg:block">
        <ScrollRow label={t("popular")} bleed={false}>
          <WideCard item={first} locale={locale} />
          {rest.map((item, i) => (
            <div key={`${item.mediaType}:${item.id}`} className={slideClass("poster")}>
              <MovieCard item={item} variant="poster" rank={i + 2} />
            </div>
          ))}
        </ScrollRow>
      </div>
    </section>
  );
}
