import Link from "next/link";
import { useTranslations } from "next-intl";
import pkg from "../../../package.json";

export function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-[1] border-t border-white/[0.06]">
      <div className="layout-container flex flex-col gap-3 py-5 md:flex-row md:items-start md:justify-between md:gap-12 md:py-6">
        <p className="text-[11px] leading-[1.7] text-zinc-400 max-w-xl">{t("note")}</p>
        <div className="shrink-0 md:text-right">
          <p className="text-[11px] text-zinc-400">{t("rights", { year, version: pkg.version })}</p>
          <nav className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-zinc-400 md:justify-end" aria-label="Footer">
            <Link href="/help" className="underline underline-offset-2 hover:text-text-hi">
              {t("get_help")}
            </Link>
            <Link href="/legal/terms" className="underline underline-offset-2 hover:text-text-hi">
              {t("terms")}
            </Link>
            <Link href="/legal/privacy" className="underline underline-offset-2 hover:text-text-hi">
              {t("privacy")}
            </Link>
            <Link href="/legal/dmca" className="underline underline-offset-2 hover:text-text-hi">
              {t("dmca")}
            </Link>
            <a href="https://developer.themoviedb.org/docs" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-text-hi">
              {t("api")}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
