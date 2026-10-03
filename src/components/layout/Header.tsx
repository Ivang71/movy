import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Clapperboard, Home, Search, Star, Tv, UserRound } from "lucide-react";
import { BrandMark } from "@/components/ui/BrandMark";
import { useUi } from "./UiContext";
import { useStore } from "@/lib/store";
import { ProfileMenu } from "@/components/auth/ProfileMenu";
import { Avatar } from "@/components/auth/Avatar";
import { cx } from "@/lib/format";

export const NAV_ITEMS = [
  { key: "home", href: "/", icon: Home, match: (p: string) => p === "/" },
  { key: "movie", href: "/browse/movie", icon: Clapperboard, match: (p: string) => p.startsWith("/browse/movie") || p.startsWith("/movie/") },
  { key: "tv", href: "/browse/tv", icon: Tv, match: (p: string) => p.startsWith("/browse/tv") || p.startsWith("/tv/") },
  { key: "anime", href: "/browse/anime", icon: Star, match: (p: string) => p.startsWith("/browse/anime") || p.startsWith("/anime/") },
] as const;

export function Header() {
  const t = useTranslations("Header");
  const router = useRouter();
  const { openSearch } = useUi();
  const { profile } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const [marker, setMarker] = useState<{ left: number; width: number } | null>(null);

  const path = router.asPath.split("?")[0];
  const activeIndex = NAV_ITEMS.findIndex((n) => n.match(path));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const active = el.querySelector<HTMLElement>("[data-active='true']");
    if (!active) {
      setMarker(null);
      return;
    }
    const measure = () => setMarker({ left: active.offsetLeft, width: active.offsetWidth });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [activeIndex, router.locale]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [router.asPath]);

  return (
    <header className="fixed left-0 right-0 top-0 z-40 pointer-events-none">
      <div
        className="absolute inset-x-0 top-0 h-20 md:h-24 pointer-events-none transition-opacity duration-250"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, rgba(5,7,10,0.92) 0%, rgba(5,7,10,0.55) 40%, rgba(5,7,10,0.3) 62%, rgba(5,7,10,0.13) 79%, rgba(5,7,10,0.04) 91%, rgba(5,7,10,0) 100%)",
          opacity: scrolled ? 1 : 0,
        }}
      />
      <div className="layout-container pointer-events-auto relative">
        <div className="flex items-center justify-between h-[68px] md:h-[80px]">
          <Link href="/" aria-label="Movy" className="relative z-10 shrink-0 drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)]">
            <BrandMark className="h-8 md:h-9 w-auto" />
          </Link>

          <nav className="header-search-cluster control-3d relative hidden md:flex items-center h-10 pl-1 pr-1 rounded-[12px]" aria-label="Main">
            <div className="relative h-10" ref={navRef}>
              <div className="relative flex items-center gap-0.5 h-10 whitespace-nowrap">
                {marker ? (
                  <span
                    className="absolute left-0 top-1 h-8 rounded-[8px] bg-white/[0.12] shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] transition-[transform,width] duration-300 ease-[cubic-bezier(.22,1,.36,1)]"
                    style={{ width: marker.width, transform: `translateX(${marker.left}px)` }}
                    aria-hidden="true"
                  />
                ) : null}
                {NAV_ITEMS.map((item, i) => {
                  const Icon = item.icon;
                  const active = i === activeIndex;
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      data-active={active}
                      className={cx(
                        "relative z-[1] inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] text-[13px] font-medium transition-colors duration-200",
                        active ? "text-white font-semibold" : "text-white/70 hover:text-white hover:bg-white/[0.07]",
                      )}
                    >
                      <Icon className="shrink-0 h-[15px] w-[15px]" aria-hidden="true" />
                      {t(item.key)}
                    </Link>
                  );
                })}
              </div>
            </div>
            <span className="w-px h-4 mx-1.5 shrink-0 bg-white/15" aria-hidden="true" />
            <button
              type="button"
              onClick={openSearch}
              aria-label={t("search")}
              className="flex items-center justify-center h-8 w-8 rounded-[8px] text-white/75 hover:text-white hover:bg-white/[0.07] transition-colors duration-200"
            >
              <Search className="h-[18px] w-[18px]" aria-hidden="true" />
            </button>
            <div className="relative profile-trigger" ref={menuRef}>
              <button
                type="button"
                aria-label={profile ? profile.name : t("login")}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center justify-center h-8 w-8 rounded-[8px] text-white/75 hover:text-white hover:bg-white/[0.07] transition-colors duration-200 overflow-visible"
              >
                {profile ? (
                  <Avatar profile={profile} />
                ) : (
                  <UserRound className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
              {menuOpen ? <ProfileMenu onClose={() => setMenuOpen(false)} /> : null}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
