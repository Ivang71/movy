import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Info, Megaphone, Play, Sparkles, Tv2 } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { heroSrcSet } from "@/lib/images";
import { cx } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { HeroFacts, HeroTitle } from "./HeroCopy";
import styles from "./HomeBanner.module.scss";

const INTERVAL = 8000;

function Callout({ item }: { item: MediaItem }) {
  const t = useTranslations("Home");
  if (!item.tag) return null;
  const Icon = item.tag === "new_episode" ? Tv2 : item.tag === "coming_soon" ? Sparkles : Megaphone;
  const label = item.tag === "new_episode" ? t("tag_new_episode") : item.tag === "coming_soon" ? t("tag_coming_soon") : item.tag === "new_season" ? t("tag_new_season") : t("tag_recently_added");
  return (
    <span className={styles.pill}>
      <span className={styles.pillIcon}>
        <Icon className="h-full w-full" strokeWidth={2.4} aria-hidden="true" />
      </span>
      <span className={styles.pillLabel}>{label}</span>
    </span>
  );
}

function Slide({ item, current, priority }: { item: MediaItem; current: boolean; priority: boolean }) {
  const t = useTranslations("Home");
  const img = heroSrcSet(item.backdrop);
  return (
    <div className={cx(styles.slide, current && styles.slideCurrent)} aria-hidden={!current}>
      <div className={styles.backdropWrap}>
        {img ? <img className={styles.backdropImg} src={img.src} srcSet={img.srcSet} sizes="100vw" alt={item.title} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} decoding="async" /> : null}
      </div>
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.content}>
        <div className="layout-container w-full">
          <div className={styles.stack}>
            <div>
              <HeroTitle item={item} />
              <HeroFacts item={item} />
              {item.overview ? <p className={styles.description}>{item.overview}</p> : null}
            </div>
            <div className={styles.ctaRow}>
              <Link href={`${item.slug}?play=true`} tabIndex={current ? 0 : -1}>
                <Button variant="primary" className="md:px-7" icon={<Play className="h-5 w-5 fill-current md:h-[22px] md:w-[22px]" aria-hidden="true" />} tabIndex={-1}>
                  <span>{t("play")}</span>
                </Button>
                <span className="sr-only">{item.title}</span>
              </Link>
              <Link href={item.slug} tabIndex={current ? 0 : -1}>
                <Button variant="glass" icon={<Info className="h-5 w-5 text-text-hi" aria-hidden="true" />} tabIndex={-1}>
                  <span>{t("more_info")}</span>
                </Button>
                <span className="sr-only">{item.title}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeBanner({ slides }: { slides: MediaItem[] }) {
  const t = useTranslations("Home");
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; y: number } | null>(null);
  const count = slides.length;

  const go = useCallback((n: number) => setIndex((i) => (n + count) % count), [count]);

  useEffect(() => {
    if (count < 2 || paused) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % count), INTERVAL);
    return () => window.clearInterval(id);
  }, [count, paused, index]);

  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  if (!count) return null;
  const current = slides[index];

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!start.current) return;
    if (Math.abs(e.clientX - start.current.x) > 10 && Math.abs(e.clientX - start.current.x) > Math.abs(e.clientY - start.current.y)) setDragging(true);
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    start.current = null;
    if (dragging) {
      // swallow the click that follows a swipe
      const el = e.currentTarget as HTMLElement;
      el.addEventListener(
        "click",
        (ev) => {
          ev.stopPropagation();
          ev.preventDefault();
        },
        { capture: true, once: true },
      );
    }
    setDragging(false);
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
  };

  return (
    <div className={styles.heroRoot}>
      <section
        className={cx(styles.billboard, dragging && styles.dragging)}
        aria-label={current.title}
        aria-roledescription="carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          start.current = null;
          setDragging(false);
        }}
      >
        <div className={styles.track}>
          {slides.map((s, i) => (
            <Slide key={`${s.mediaType}:${s.id}`} item={s} current={i === index} priority={i === 0} />
          ))}
        </div>
      </section>
      <div className={styles.seamFade} aria-hidden="true" />
      <div className={styles.calloutsTop}>
        <div className="layout-container flex h-full w-full items-center justify-end">
          <Callout item={current} />
        </div>
      </div>
      <div className={styles.bottomChrome}>
        <div className="layout-container w-full">
          <div className={styles.bottomBar}>
            <div className={styles.calloutsBottom}>
              <Callout item={current} />
            </div>
            <div className={styles.markers} role="tablist" aria-label={t("hero_slides")}>
              {slides.map((s, i) => (
                <button key={`${s.mediaType}:${s.id}`} type="button" role="tab" aria-selected={i === index} aria-label={s.title} className={cx(styles.marker, i === index && styles.markerActive)} onClick={() => go(i)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
