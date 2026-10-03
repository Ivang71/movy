import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Info, Megaphone, Play, Sparkles, Tv2 } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { heroSrcSet } from "@/lib/images";
import { cx } from "@/lib/format";
import { Button } from "@/components/ui/Button";
import { EASE_IN_OUT_SINE, EASE_OUT_CUBIC, cancelAnimations, parallaxOnScroll, prefersReducedMotion, setX, slideTo, staggerIn } from "@/lib/motion";
import { HeroFacts, HeroTitle } from "./HeroCopy";
import styles from "./HomeBanner.module.scss";

const AUTOPLAY_MS = 10_000;
const SLIDE_MS = 380;
const SWIPE_PX = 72;
const MOVE_PX = 10;
const MAX_SLIDES = 5;

/** The entrance animation only plays once per page load, not on every slide change. */
let introPlayed = false;

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

function Slide({ item, priority, interactive }: { item: MediaItem; priority: boolean; interactive: boolean }) {
  const t = useTranslations("Home");
  const img = heroSrcSet(item.backdrop);
  const tab = interactive ? undefined : -1;
  return (
    <>
      <div className={styles.backdropWrap} data-parallax>
        {img ? <img className={styles.backdropImg} src={img.src} srcSet={img.srcSet} sizes="100vw" alt={item.title} loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "low"} decoding="async" draggable={false} /> : null}
      </div>
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.content}>
        <div className="layout-container w-full">
          <div className={styles.stack}>
            <div data-hero-item>
              <HeroTitle item={item} />
              <HeroFacts item={item} />
              {item.overview ? <p className={styles.description}>{item.overview}</p> : null}
            </div>
            <div className={styles.ctaRow} data-hero-item>
              <Link href={`${item.slug}?play=true`} tabIndex={tab} draggable={false}>
                <Button variant="primary" className="md:px-7" icon={<Play className="h-5 w-5 fill-current md:h-[22px] md:w-[22px]" aria-hidden="true" />} tabIndex={-1}>
                  <span>{t("play")}</span>
                </Button>
                <span className="sr-only">{item.title}</span>
              </Link>
              <Link href={item.slug} tabIndex={tab} draggable={false}>
                <Button variant="glass" icon={<Info className="h-5 w-5 text-text-hi" aria-hidden="true" />} tabIndex={-1}>
                  <span>{t("more_info")}</span>
                </Button>
                <span className="sr-only">{item.title}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function HomeBanner({ slides: all }: { slides: MediaItem[] }) {
  const t = useTranslations("Home");
  const slides = useMemo(() => all.filter((s) => s.backdrop).slice(0, MAX_SLIDES), [all]);
  const count = slides.length;

  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [dragging, setDragging] = useState(false);

  const rootRef = useRef<HTMLElement>(null);
  const prevRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const isDown = useRef(false);
  const moved = useRef(false);
  const animating = useRef(false);
  const skipIntro = useRef(false);

  useEffect(() => setMounted(true), []);

  const current = slides[Math.min(index, Math.max(count - 1, 0))];
  const prevItem = mounted && count > 1 ? slides[(index - 1 + count) % count] : undefined;
  const nextItem = mounted && count > 1 ? slides[(index + 1) % count] : undefined;

  /** Place the three layers at -W, 0 and +W, offset by a drag distance. */
  const place = useCallback((dx = 0) => {
    const w = rootRef.current?.offsetWidth || 1;
    const d = Math.max(-w, Math.min(w, dx));
    setX(prevRef.current, -w + d);
    setX(curRef.current, d);
    setX(nextRef.current, w + d);
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      if (count <= 1 || animating.current) return;
      const w = rootRef.current?.offsetWidth || 1;
      const target = (index + dir + count) % count;
      const incoming = dir === 1 ? nextRef.current : prevRef.current;
      const outgoingFar = dir === 1 ? prevRef.current : nextRef.current;
      animating.current = true;
      skipIntro.current = true;
      cancelAnimations(prevRef.current, curRef.current, nextRef.current);
      slideTo(curRef.current, -(dir * w), { duration: SLIDE_MS, easing: EASE_IN_OUT_SINE });
      if (outgoingFar) slideTo(outgoingFar, -2 * dir * w, { duration: SLIDE_MS, easing: EASE_IN_OUT_SINE });
      slideTo(incoming, 0, { duration: SLIDE_MS, easing: EASE_IN_OUT_SINE, onComplete: () => setIndex(target) });
    },
    [count, index],
  );

  const goTo = useCallback(
    (i: number) => {
      if (count <= 1 || animating.current || i === index) return;
      const fwd = (i - index + count) % count;
      const back = (index - i + count) % count;
      if (fwd === 1) step(1);
      else if (back === 1) step(-1);
      else {
        skipIntro.current = true;
        setIndex(i);
      }
    },
    [count, index, step],
  );

  // Reset layer positions whenever the slide set changes.
  useLayoutEffect(() => {
    place(0);
    animating.current = false;
  }, [index, count, mounted, place]);

  useEffect(() => {
    const onResize = () => !isDown.current && !animating.current && place(0);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [place]);

  // Autoplay: skipped while hidden, dragging or mid-transition.
  useEffect(() => {
    if (count <= 1 || prefersReducedMotion()) return;
    const id = window.setInterval(() => {
      if (document.hidden || isDown.current || animating.current) return;
      step(1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [count, step, index]);

  // Staggered entrance for the visible copy; plays once, then only on jump-to-slide.
  useEffect(() => {
    const el = curRef.current;
    if (!el || !current) return;
    const items = Array.from(el.querySelectorAll<HTMLElement>("[data-hero-item]"));
    if (skipIntro.current || introPlayed || prefersReducedMotion()) {
      skipIntro.current = false;
      introPlayed = true;
      cancelAnimations(...items);
      items.forEach((i) => {
        i.style.opacity = "";
        i.style.transform = "";
      });
      return;
    }
    introPlayed = true;
    staggerIn(items);
  }, [current?.id]);

  // Backdrop parallax while scrolling past the billboard.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-parallax]"));
    return parallaxOnScroll(root, targets, 8);
  }, [index, count, mounted]);

  if (!current) return null;

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.button !== 0 || animating.current || count <= 1) return;
    if ((e.target as HTMLElement).closest("a, button")) return;
    isDown.current = true;
    moved.current = false;
    startX.current = e.clientX;
    setDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    cancelAnimations(prevRef.current, curRef.current, nextRef.current);
    place(0);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDown.current) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > MOVE_PX) moved.current = true;
    place(dx);
  };
  const release = (e: React.PointerEvent<HTMLElement>) => {
    if (!isDown.current) return;
    isDown.current = false;
    setDragging(false);
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) >= SWIPE_PX) {
      step(dx < 0 ? 1 : -1);
      return;
    }
    const w = rootRef.current?.offsetWidth || 1;
    slideTo(prevRef.current, -w, { duration: SLIDE_MS, easing: EASE_OUT_CUBIC });
    slideTo(curRef.current, 0, { duration: SLIDE_MS, easing: EASE_OUT_CUBIC });
    slideTo(nextRef.current, w, { duration: SLIDE_MS, easing: EASE_OUT_CUBIC });
  };

  return (
    <div className={styles.heroRoot}>
      <section
        ref={rootRef}
        className={cx(styles.billboard, dragging && styles.dragging, count <= 1 && styles.billboardStatic)}
        aria-label={current.title}
        aria-roledescription="carousel"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        onClickCapture={(e) => {
          if (moved.current) {
            e.preventDefault();
            e.stopPropagation();
            moved.current = false;
          }
        }}
        onDragStart={(e) => e.preventDefault()}
      >
        <div className={styles.track}>
          {prevItem ? (
            <div ref={prevRef} className={styles.slideLayer} aria-hidden="true">
              <Slide key={prevItem.id} item={prevItem} priority={false} interactive={false} />
            </div>
          ) : null}
          <div ref={curRef} className={cx(styles.slideLayer, styles.slideCurrent)}>
            <Slide key={current.id} item={current} priority interactive />
          </div>
          {nextItem ? (
            <div ref={nextRef} className={styles.slideLayer} aria-hidden="true">
              <Slide key={nextItem.id} item={nextItem} priority={false} interactive={false} />
            </div>
          ) : null}
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
                <button key={`${s.mediaType}:${s.id}`} type="button" role="tab" aria-selected={i === index} aria-label={s.title} className={cx(styles.marker, i === index && styles.markerActive)} onClick={() => goTo(i)} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
