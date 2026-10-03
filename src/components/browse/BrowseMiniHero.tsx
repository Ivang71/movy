import { useEffect, useState } from "react";
import type { MediaItem } from "@/lib/types";
import { PosterMarquee } from "./PosterMarquee";
import { cx } from "@/lib/format";
import styles from "./BrowseMiniHero.module.scss";

interface Props {
  title: string;
  subtitle?: string;
  items: MediaItem[];
  glow?: string;
}

export function BrowseMiniHero({ title, subtitle, items, glow }: Props) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setOn(true));
    return () => window.cancelAnimationFrame(id);
  }, [title]);
  return (
    <section className={styles.hero} style={glow ? ({ "--hero-glow": glow } as React.CSSProperties) : undefined}>
      <div className={styles.wallWrap}>
        <PosterMarquee items={items} tracks={9} />
      </div>
      <div className={styles.wash} aria-hidden="true" />
      <div className={styles.content}>
        <div className="layout-container w-full">
          <div className={cx(styles.cluster, on && styles.on)}>
            <span className={styles.bar} aria-hidden="true" />
            <div className={styles.copy}>
              <div className={styles.copyInner}>
                <h1 className={styles.title}>{title}</h1>
                {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
