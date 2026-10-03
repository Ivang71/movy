import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

/** Thin red bar along the top edge that trickles during client-side navigation. */
export function RouteProgress() {
  const router = useRouter();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | null>(null);
  const hide = useRef<number | null>(null);

  useEffect(() => {
    const stopTrickle = () => {
      if (timer.current) window.clearInterval(timer.current);
      timer.current = null;
    };
    const start = () => {
      if (hide.current) window.clearTimeout(hide.current);
      stopTrickle();
      setVisible(true);
      setWidth(8);
      timer.current = window.setInterval(() => {
        setWidth((w) => (w >= 90 ? w : w + (90 - w) * (0.08 + Math.random() * 0.1)));
      }, 220);
    };
    const done = () => {
      stopTrickle();
      setWidth(100);
      hide.current = window.setTimeout(() => {
        setVisible(false);
        window.setTimeout(() => setWidth(0), 250);
      }, 180);
    };
    router.events.on("routeChangeStart", start);
    router.events.on("routeChangeComplete", done);
    router.events.on("routeChangeError", done);
    return () => {
      router.events.off("routeChangeStart", start);
      router.events.off("routeChangeComplete", done);
      router.events.off("routeChangeError", done);
      stopTrickle();
      if (hide.current) window.clearTimeout(hide.current);
    };
  }, [router.events]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[1031] h-[2px]" style={{ opacity: visible ? 1 : 0, transition: "opacity 0.25s ease" }}>
      <div className="relative h-full bg-primary" style={{ width: `${width}%`, transition: width === 0 ? "none" : "width 0.22s ease-out" }}>
        <span className="absolute right-0 block h-full w-[100px]" style={{ opacity: 1, transform: "rotate(3deg) translateY(-4px)", boxShadow: "0 0 10px var(--primary), 0 0 5px var(--primary)" }} />
      </div>
    </div>
  );
}
