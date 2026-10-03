import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import type { MediaItem } from "@/lib/types";
import { genreNames } from "@/lib/genres";
import { tmdbImage } from "@/lib/images";
import { formatRating, cx } from "@/lib/format";
import { mediaLabel } from "@/components/media/MovieCard";
import styles from "./HomeBanner.module.scss";

export function HeroFacts({ item, extra }: { item: MediaItem; extra?: React.ReactNode[] }) {
  const t = useTranslations("Home");
  const rating = formatRating(item.rating);
  const facts: React.ReactNode[] = [];
  if (rating) {
    facts.push(
      <span key="score" className={styles.score}>
        <Star className={cx("h-[14px] w-[14px]", styles.scoreStar)} aria-hidden="true" />
        <span className="tabular-nums">{rating}</span>
      </span>,
    );
  }
  if (extra) facts.push(...extra);
  if (item.year) facts.push(<span key="year" className="tabular-nums">{item.year}</span>);
  facts.push(<span key="type">{mediaLabel(t, item.mediaType)}</span>);
  genreNames(item.genreIds, item.mediaType, 2).forEach((g) => facts.push(<span key={g}>{g}</span>));
  return (
    <div className={styles.attributes}>
      {facts.map((f, i) => (
        <span key={i} className={styles.fact}>
          {i > 0 ? <span className={styles.factDot}>·</span> : null}
          {f}
        </span>
      ))}
    </div>
  );
}

export function HeroTitle({ item, className }: { item: MediaItem; className?: string }) {
  const [logoOk, setLogoOk] = useState(false);
  useEffect(() => setLogoOk(false), [item.logo]);
  const logo = tmdbImage(item.logo, "w500");
  return (
    <div className={cx(styles.titleBox, className)}>
      <h2 className={cx(styles.titleFallback, logoOk && styles.titleHidden)}>{item.title}</h2>
      {logo ? <img className={cx(styles.titleLogo, logoOk && styles.titleLogoVisible)} src={logo} alt="" loading="eager" decoding="async" onLoad={() => setLogoOk(true)} onError={() => setLogoOk(false)} /> : null}
    </div>
  );
}
