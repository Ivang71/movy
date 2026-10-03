import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/** Responsive card grid: 2 → 3 (1024) → 4 (1400) → 5 (1700) → 6 (2000) columns. */
export function MovieGrid({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx("grid grid-cols-2 gap-x-1.5 gap-y-6 min-[1024px]:grid-cols-3 min-[1400px]:grid-cols-4 min-[1700px]:grid-cols-5 min-[2000px]:grid-cols-6", className)}>{children}</div>;
}
