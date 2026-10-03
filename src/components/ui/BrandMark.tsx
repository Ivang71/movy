import { cx } from "@/lib/format";

/**
 * Movy monogram: an "M" whose centre stroke is a play triangle.
 * Original artwork for this project.
 */
export function BrandMark({ className, title = "Movy" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cx("shrink-0", className)} role="img" aria-label={title}>
      <defs>
        <linearGradient id="movy-left" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0202b" />
          <stop offset="1" stopColor="#b80b14" />
        </linearGradient>
        <linearGradient id="movy-right" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3131d" />
          <stop offset="1" stopColor="#8a0a10" />
        </linearGradient>
        <linearGradient id="movy-play" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ff5a60" />
          <stop offset="1" stopColor="#d50c16" />
        </linearGradient>
      </defs>
      <path fill="url(#movy-left)" d="M6 8h18l10 22v62H6z" />
      <path fill="url(#movy-right)" d="M76 8h18v84H76V30z" />
      <path fill="url(#movy-play)" d="M24 8l26 48 26-48v30L50 84 24 38z" />
      <path fill="#05070a" opacity=".35" d="M34 30 50 60l16-30v12L50 72 34 42z" />
    </svg>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex items-center gap-2", className)}>
      <BrandMark className="h-6 w-auto" />
      <span className="text-[15px] font-semibold tracking-[0.18em] uppercase text-white">Movy</span>
    </span>
  );
}
