import Link from "next/link";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/ui/BrandMark";
import styles from "./NoSignal.module.scss";

interface Props {
  heading: string;
  description: string;
  code: string;
  homeLabel: string;
}

/** Full-screen "no signal" test pattern used by the 404 and 500 pages. */
export function NoSignal({ heading, description, code, homeLabel }: Props) {
  const [seconds, setSeconds] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const bars = Array.from({ length: 7 });
  return (
    <div className={styles.screen}>
      <div className={styles.columns} aria-hidden="true">
        {bars.map((_, i) => (
          <span key={i} className={styles.bar} />
        ))}
      </div>
      <div className={styles.glitches} aria-hidden="true">
        {Array.from({ length: 5 }).map((_, g) => (
          <div key={g} className={styles.glitch}>
            <div className={styles.columns}>
              {bars.map((_, i) => (
                <span key={i} className={styles.bar} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className={styles.tracking} aria-hidden="true">
        {bars.map((_, i) => (
          <span key={i} />
        ))}
      </div>
      <div className={styles.scanlines} aria-hidden="true" />
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <Link href="/" className={styles.brand}>
        <BrandMark className="h-6 w-auto" />
        <span className={styles.brandName}>Movy</span>
      </Link>
      <div className={styles.osd}>
        <h1 className={styles.title} data-text={heading}>
          {heading}
        </h1>
      </div>
      <footer className={styles.footer}>
        <p className={styles.code}>{code}</p>
        <p className={styles.copy}>
          <span>{description}</span>
          <Link href="/" className={styles.home}>
            {homeLabel}
          </Link>
          <span className={styles.play} aria-hidden="true" />
        </p>
        <p className={styles.timer}>
          {mm}:{ss}
        </p>
      </footer>
    </div>
  );
}
