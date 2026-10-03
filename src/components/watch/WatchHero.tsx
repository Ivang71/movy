import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { ArrowBigDown, ArrowBigUp, Bookmark, BookmarkCheck, Download, Play } from "lucide-react";
import type { Details } from "@/lib/types";
import { heroSrcSet } from "@/lib/images";
import { formatRuntime, cx } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { HeroTitle } from "@/components/home/HeroCopy";
import { AgeRatingBadge } from "./AgeRatingBadge";
import { useStore } from "@/lib/store";
import { useUi } from "@/components/layout/UiContext";
import styles from "@/components/home/HomeBanner.module.scss";

interface Props {
  details: Details;
  onPlay: () => void;
}

export function WatchHero({ details, onPlay }: Props) {
  const t = useTranslations("WatchPage");
  const tp = useTranslations("Player");
  const router = useRouter();
  const { profile, inWatchlist, toggleWatchlist } = useStore();
  const { openAuth, toast } = useUi();
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const img = heroSrcSet(details.backdrop);
  const saved = inWatchlist(details);
  const rating = details.rating ? details.rating.toFixed(1) : null;
  const seasons = details.mediaType !== "movie" ? details.seasons.length : 0;

  const facts: React.ReactNode[] = [];
  if (rating)
    facts.push(
      <span key="score" className={styles.score}>
        <svg viewBox="0 0 24 24" className={cx("h-[14px] w-[14px]", styles.scoreStar)} aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span className="tabular-nums">{rating}</span>
      </span>,
    );
  facts.push(
    <span key="votes" className="inline-flex items-center gap-2" aria-label={t("community_votes")}>
      <button type="button" aria-label={t("upvote")} aria-pressed={vote === "up"} onClick={() => setVote((v) => (v === "up" ? null : "up"))} className={cx("inline-flex items-center gap-1 rounded-md px-1 transition-colors hover:text-white", vote === "up" && "text-emerald-400")}>
        <ArrowBigUp className="h-4 w-4" aria-hidden="true" />
        <span className="tabular-nums text-[13px]">{vote === "up" ? 1 : 0}</span>
      </button>
      <button type="button" aria-label={t("downvote")} aria-pressed={vote === "down"} onClick={() => setVote((v) => (v === "down" ? null : "down"))} className={cx("inline-flex items-center gap-1 rounded-md px-1 transition-colors hover:text-white", vote === "down" && "text-accent-hi")}>
        <ArrowBigDown className="h-4 w-4" aria-hidden="true" />
        <span className="tabular-nums text-[13px]">{vote === "down" ? 1 : 0}</span>
      </button>
    </span>,
  );
  if (details.year) facts.push(<span key="year" className="tabular-nums">{details.year}</span>);
  if (details.mediaType === "movie") {
    const rt = formatRuntime(details.duration);
    if (rt) facts.push(<span key="rt" className="tabular-nums">{rt}</span>);
  } else if (seasons) {
    facts.push(<span key="seasons">{seasons === 1 ? `1 ${tp("season")}` : `${seasons} ${tp("seasons")}`}</span>);
  }
  if (details.certification) facts.push(<AgeRatingBadge key="cert" rating={details.certification} />);

  const onList = () => {
    if (!profile) {
      openAuth();
      return;
    }
    const added = toggleWatchlist(details);
    toast(added ? t("saved_to_list") : t("removed_from_list"));
  };

  return (
    <div className={styles.heroRoot}>
      <section className={styles.billboard} style={{ cursor: "default" }} aria-label={details.title}>
        <div className={styles.track}>
          <div className={cx(styles.slide, styles.slideCurrent)}>
            <div className={styles.backdropWrap}>{img ? <img className={styles.backdropImg} src={img.src} srcSet={img.srcSet} sizes="100vw" alt={details.title} loading="eager" fetchPriority="high" decoding="async" /> : null}</div>
            <div className={styles.vignette} aria-hidden="true" />
            <div className={cx(styles.content, styles.contentDetails)}>
              <div className="layout-container w-full">
                <div className={styles.stack}>
                  <h1 className="sr-only">{details.title}</h1>
                  <HeroTitle item={details} />
                  <div className={styles.attributes}>
                    {facts.map((f, i) => (
                      <span key={i} className={styles.fact}>
                        {i > 0 ? <span className={styles.factDot}>·</span> : null}
                        {f}
                      </span>
                    ))}
                  </div>
                  {details.genres.length ? (
                    <p className={styles.genres}>
                      {details.genres.slice(0, 3).map((g, i) => (
                        <span key={g.name} className="inline-flex items-center">
                          {i > 0 ? <span className={styles.genreDot}>·</span> : null}
                          {g.name}
                        </span>
                      ))}
                    </p>
                  ) : null}
                  {details.overview ? <p className={styles.description}>{details.overview}</p> : null}
                  <div className={cx(styles.ctaRow, "flex-wrap min-h-10 md:min-h-11")}>
                    <Button variant="primary" className="md:px-7" onClick={onPlay} icon={<Play className="h-5 w-5 fill-current md:h-[22px] md:w-[22px]" aria-hidden="true" />}>
                      <span>{t("play")}</span>
                    </Button>
                    <Button variant="glass" className="text-[12px] md:text-[13px]" onClick={onList} icon={saved ? <BookmarkCheck className="h-[18px] w-[18px] text-primary" aria-hidden="true" /> : <Bookmark className="h-[18px] w-[18px]" aria-hidden="true" />}>
                      <span className="truncate">{saved ? t("remove_from_list") : t("add_to_list")}</span>
                    </Button>
                    {details.mediaType === "movie" ? (
                      <Button variant="glass" className="text-[12px] md:text-[13px]" onClick={() => toast(tp("no_sources_title"))} icon={<Download className="h-[18px] w-[18px]" aria-hidden="true" />}>
                        <span className="truncate">{t("download")}</span>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className={styles.seamFade} aria-hidden="true" />
      <span className="sr-only">{router.asPath}</span>
    </div>
  );
}
