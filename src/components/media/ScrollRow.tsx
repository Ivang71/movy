import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import styles from "./ScrollRow.module.scss";
import { cx } from "@/lib/format";

interface Props {
  children: ReactNode;
  label?: string;
  /** Lets the track bleed into the page gutter on small screens. */
  bleed?: boolean;
  className?: string;
}

/** Horizontal, drag-to-scroll track with edge fades and hover arrows. */
export function ScrollRow({ children, label, bleed = true, className }: Props) {
  const t = useTranslations("Home");
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(true);
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure, children]);

  const scrollBy = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(240, el.clientWidth * 0.85), behavior: "smooth" });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const el = trackRef.current;
    if (!el) return;
    drag.current = { x: e.clientX, left: el.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!drag.current || !el) return;
    const dx = e.clientX - drag.current.x;
    if (!drag.current.moved && Math.abs(dx) < 6) return;
    if (!drag.current.moved) {
      drag.current.moved = true;
      setDragging(true);
      el.setPointerCapture(e.pointerId);
    }
    el.scrollLeft = drag.current.left - dx;
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (drag.current?.moved && el) {
      // swallow the click that follows a drag
      const stop = (ev: Event) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
      el.addEventListener("click", stop, { capture: true, once: true });
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* noop */
      }
    }
    drag.current = null;
    setDragging(false);
  };

  return (
    <div className={cx(styles.row, bleed && styles.bleed, className)} data-at-start={atStart} data-at-end={atEnd}>
      <div
        ref={trackRef}
        className={styles.track}
        role="group"
        aria-label={label}
        tabIndex={0}
        data-dragging={dragging}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={(e) => drag.current && endDrag(e)}
      >
        <span className={cx(styles.sentinel, styles.sentinelStart)} aria-hidden="true" />
        {children}
        <span className={cx(styles.sentinel, styles.sentinelEnd)} aria-hidden="true" />
      </div>
      <button type="button" className={cx(styles.arrow, styles.arrowPrev)} aria-label={t("scroll_back")} onClick={() => scrollBy(-1)} disabled={atStart}>
        <ChevronLeft className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
      </button>
      <button type="button" className={cx(styles.arrow, styles.arrowNext)} aria-label={t("scroll_forward")} onClick={() => scrollBy(1)} disabled={atEnd}>
        <ChevronRight className="h-7 w-7" strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  );
}
