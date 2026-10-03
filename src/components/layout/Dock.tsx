import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { Search, UserRound } from "lucide-react";
import { NAV_ITEMS } from "./Header";
import { useUi } from "./UiContext";
import { useStore } from "@/lib/store";
import { Avatar } from "@/components/auth/Avatar";
import styles from "./Dock.module.scss";
import { cx } from "@/lib/format";

/** Mobile bottom navigation dock. */
export function Dock() {
  const t = useTranslations("Header");
  const router = useRouter();
  const { openSearch, openAuth } = useUi();
  const { profile } = useStore();
  const path = router.asPath.split("?")[0];
  const activeIndex = NAV_ITEMS.findIndex((n) => n.match(path));
  // item width 44 + gap 12
  const markerX = activeIndex >= 0 ? activeIndex * 56 : -200;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 pointer-events-none md:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="pointer-events-auto">
        <div className={styles.dockOuter}>
          <div className={styles.dockPanel} role="toolbar" aria-label={t("dock_label")}>
            <span className={styles.marker} style={{ transform: `translateX(calc(0.55rem + ${markerX}px))`, opacity: activeIndex >= 0 ? 1 : 0 }} aria-hidden="true" />
            {NAV_ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.key}
                  role="button"
                  tabIndex={0}
                  aria-label={t(item.key)}
                  className={cx(styles.dockItem, i === activeIndex && styles.active)}
                  onClick={() => router.push(item.href)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && router.push(item.href)}
                >
                  <div className={styles.dockIcon}>
                    <Icon className="h-[22px] w-[22px]" aria-hidden="true" />
                  </div>
                </div>
              );
            })}
            <span className={styles.divider} aria-hidden="true" />
            <div role="button" tabIndex={0} aria-label={t("search")} className={styles.dockItem} onClick={openSearch} onKeyDown={(e) => e.key === "Enter" && openSearch()}>
              <div className={styles.dockIcon}>
                <Search className="h-[22px] w-[22px]" aria-hidden="true" />
              </div>
            </div>
            <div
              role="button"
              tabIndex={0}
              aria-label={profile ? profile.name : t("login")}
              className={cx(styles.dockItem, "profile-trigger")}
              onClick={() => (profile ? router.push("/profiles") : openAuth())}
              onKeyDown={(e) => e.key === "Enter" && (profile ? router.push("/profiles") : openAuth())}
            >
              <div className={styles.dockIcon}>
                {profile ? (
                  <Avatar profile={profile} className="h-7 w-7" rounded="rounded-[8px]" textClass="text-[12px]" />
                ) : (
                  <UserRound className="h-[22px] w-[22px]" aria-hidden="true" />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
