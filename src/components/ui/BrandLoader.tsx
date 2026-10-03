import { BrandMark } from "./BrandMark";
import { cx } from "@/lib/format";
import styles from "./BrandLoader.module.scss";

/** Breathing logo shown while a page or panel is loading. */
export function BrandLoader({ className, label = "Loading" }: { className?: string; label?: string }) {
  return (
    <span className={cx(styles.wrap, className)} role="status" aria-label={label}>
      <BrandMark className={styles.mark} title="" />
    </span>
  );
}

/** Centered full-height variant used for whole-page waits. */
export function PageLoader() {
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <BrandLoader />
    </div>
  );
}
