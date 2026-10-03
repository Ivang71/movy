import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { Bookmark, Globe, History, LogOut, UserRound, Users, Video } from "lucide-react";
import { useStore } from "@/lib/store";
import { useUi } from "@/components/layout/UiContext";
import { LOCALES, LOCALE_LABELS } from "@/lib/i18n";
import { cx } from "@/lib/format";

export function ProfileMenu({ onClose }: { onClose: () => void }) {
  const t = useTranslations("Account");
  const th = useTranslations("Header");
  const router = useRouter();
  const { profile, logout } = useStore();
  const { openAuth } = useUi();

  const links = [
    { href: "/watchlist", label: th("watchlist"), icon: Bookmark },
    { href: "/history", label: th("history"), icon: History },
    { href: "/watchparty", label: th("watchparty"), icon: Video },
    { href: "/profiles", label: th("profiles"), icon: Users },
  ];

  return (
    <div className="control-3d absolute right-0 top-11 z-50 w-72 overflow-hidden rounded-[14px] p-2 text-text-hi shadow-2xl animate-pane-enter" role="menu">
      {profile ? (
        <div className="flex items-center gap-3 px-2 py-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-[10px] text-sm font-bold text-white" style={{ background: profile.color }}>
            {profile.name.slice(0, 1).toUpperCase()}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{profile.name}</p>
            <p className="text-[11px] text-text-mid">{t("local_note")}</p>
          </div>
        </div>
      ) : (
        <div className="px-2 py-2">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-white/[0.06] text-text-mid">
              <UserRound className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{t("not_authenticated")}</p>
              <p className="text-[11px] text-text-mid">{t("need_authentication")}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              openAuth();
            }}
            className="mt-3 flex h-9 w-full items-center justify-center rounded-[10px] bg-text-hi text-[13px] font-semibold text-[#05070a] transition-colors hover:bg-white"
          >
            {t("login")}
          </button>
        </div>
      )}
      <div className="my-1 h-px bg-white/[0.08]" />
      <ul className="py-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} role="menuitem" className="flex h-9 items-center gap-2.5 rounded-[9px] px-2 text-[13px] text-white/80 transition-colors hover:bg-white/[0.07] hover:text-white">
              <l.icon className="h-4 w-4 text-text-mid" aria-hidden="true" />
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="my-1 h-px bg-white/[0.08]" />
      <div className="px-2 py-1.5">
        <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-text-mid">
          <Globe className="h-3.5 w-3.5" aria-hidden="true" />
          {th("language")}
        </p>
        <div className="grid grid-cols-3 gap-1">
          {LOCALES.map((l) => (
            <Link
              key={l}
              href={router.asPath}
              locale={l}
              className={cx("rounded-[7px] px-2 py-1 text-center text-[11.5px] transition-colors", router.locale === l ? "bg-white/[0.12] text-white" : "text-white/70 hover:bg-white/[0.07] hover:text-white")}
            >
              {LOCALE_LABELS[l]}
            </Link>
          ))}
        </div>
      </div>
      {profile ? (
        <>
          <div className="my-1 h-px bg-white/[0.08]" />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              logout();
              onClose();
            }}
            className="flex h-9 w-full items-center gap-2.5 rounded-[9px] px-2 text-[13px] text-white/80 transition-colors hover:bg-white/[0.07] hover:text-white"
          >
            <LogOut className="h-4 w-4 text-text-mid" aria-hidden="true" />
            {t("logout")}
          </button>
        </>
      ) : null}
    </div>
  );
}
