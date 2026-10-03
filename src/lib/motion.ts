/** Shared motion helpers: Web Animations based transforms with a CSS fallback. */

export const EASE_IN_OUT_SINE = "cubic-bezier(0.455, 0.03, 0.515, 0.955)";
export const EASE_OUT_CUBIC = "cubic-bezier(0.215, 0.61, 0.355, 1)";
export const EASE_ENTER = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

export const translate = (x: number, y = 0): string => `translate3d(${x}px, ${y}px, 0)`;

export function cancelAnimations(...els: Array<HTMLElement | null | undefined>): void {
  for (const el of els) {
    if (el && typeof el.getAnimations === "function") el.getAnimations().forEach((a) => a.cancel());
  }
}

/** Set a layer's horizontal offset immediately, cancelling any running animation. */
export function setX(el: HTMLElement | null | undefined, x: number): void {
  if (!el) return;
  cancelAnimations(el);
  el.style.transform = translate(x);
}

function currentX(el: HTMLElement): number {
  const t = getComputedStyle(el).transform;
  if (!t || t === "none") return 0;
  const m = /matrix(?:3d)?\(([^)]+)\)/.exec(t);
  if (!m) return 0;
  const v = m[1].split(",").map((n) => parseFloat(n.trim()));
  return v.length === 16 ? v[12] : v[4] || 0;
}

/** Animate a layer from wherever it is now to `to`. */
export function slideTo(el: HTMLElement | null | undefined, to: number, opts: { duration: number; easing?: string; onComplete?: () => void }): void {
  if (!el) return;
  const { duration, easing = EASE_IN_OUT_SINE, onComplete } = opts;
  const from = currentX(el);
  cancelAnimations(el);
  el.style.transform = translate(from);
  if (typeof el.animate !== "function") {
    el.style.transform = translate(to);
    onComplete?.();
    return;
  }
  const anim = el.animate([{ transform: translate(from) }, { transform: translate(to) }], { duration, easing, fill: "forwards" });
  anim.onfinish = () => {
    el.style.transform = translate(to);
    anim.cancel();
    onComplete?.();
  };
}

/** Fade-and-rise entrance with a stagger, used for hero copy. */
export function staggerIn(els: HTMLElement[], { duration = 700, delay = 120, stagger = 80 } = {}): void {
  cancelAnimations(...els);
  els.forEach((el, i) => {
    if (typeof el.animate !== "function") return;
    el.style.opacity = "0";
    el.style.transform = translate(0, 16);
    const anim = el.animate([{ opacity: 0, transform: translate(0, 16) }, { opacity: 1, transform: translate(0, 0) }], {
      duration,
      delay: delay + i * stagger,
      easing: EASE_ENTER,
      fill: "forwards",
    });
    anim.onfinish = () => {
      el.style.opacity = "";
      el.style.transform = "";
      anim.cancel();
    };
  });
}

/** Parallax: translate `targets` upward by up to `maxPercent` as `root` scrolls off the top. */
export function parallaxOnScroll(root: HTMLElement, targets: HTMLElement[], maxPercent = 8): () => void {
  let raf = 0;
  const apply = () => {
    raf = 0;
    const r = root.getBoundingClientRect();
    const h = r.height || 1;
    const y = -maxPercent * Math.min(1, Math.max(0, -r.top / h));
    targets.forEach((t) => (t.style.transform = `translate3d(0, ${y}%, 0)`));
  };
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(apply);
  };
  apply();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  return () => {
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    targets.forEach((t) => (t.style.transform = ""));
  };
}

export const prefersReducedMotion = (): boolean => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
