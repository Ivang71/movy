import { cx } from "@/lib/format";

export function AgeRatingBadge({ rating, size = "sm", className }: { rating: string | null | undefined; size?: "sm" | "md"; className?: string }) {
  if (!rating) return null;
  return (
    <span
      aria-label={rating}
      className={cx(
        "inline-flex shrink-0 items-center justify-center rounded-[2px] border border-white/70 font-bold leading-none tracking-[0.06em] text-white whitespace-nowrap select-none",
        size === "sm" ? "h-[18px] px-[5px] text-[9px]" : "h-[22px] px-1.5 text-[11px]",
        className,
      )}
    >
      {rating}
    </span>
  );
}
