import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { LockKeyhole } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { useUi } from "@/components/layout/UiContext";
import { PosterMarquee } from "@/components/browse/PosterMarquee";
import styles from "./AuthWall.module.scss";

interface Props {
  heading: string;
  description: string;
  icon?: React.ReactNode;
}

export function AuthWall({ heading, description, icon }: Props) {
  const t = useTranslations("Account");
  const { openAuth } = useUi();
  const [wall, setWall] = useState<MediaItem[]>([]);
  useEffect(() => {
    fetch("/api/search?q=")
      .then((r) => r.json())
      .then((d: { items: MediaItem[] }) => setWall(d.items ?? []))
      .catch(() => undefined);
  }, []);
  return (
    <section className={styles.wall} aria-label={heading}>
      <div className={styles.dots} aria-hidden="true" />
      <div className={styles.mobileMarquee}>
        <PosterMarquee items={wall} tracks={4} banner />
      </div>
      <div className={styles.desktopWall}>
        <PosterMarquee items={wall} tracks={7} />
      </div>
      <div className="layout-container relative z-[2] flex flex-1 items-center pb-10 pt-6 lg:pt-28">
        <div className="max-w-lg">
          <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.04] text-text-hi">{icon ?? <LockKeyhole className="h-5 w-5" aria-hidden="true" />}</div>
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{heading}</h1>
          <p className="mt-2 text-[15px] text-text-mid">{description}</p>
          <div className="mt-8 rounded-[16px] border border-white/[0.08] bg-surface-1/70 p-5 backdrop-blur-sm">
            <p className="text-sm font-semibold text-text-hi">{t("not_authenticated")}</p>
            <p className="mt-1 text-[13px] text-text-mid">{t("sign_in_cta")}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={openAuth} className="inline-flex h-10 items-center rounded-full bg-text-hi px-6 text-[13px] font-semibold text-[#05070a] transition-colors hover:bg-white">
                {t("login")}
              </button>
              <button type="button" onClick={openAuth} className="control-3d inline-flex h-10 items-center rounded-full px-5 text-[13px] font-medium text-text-hi">
                {t("register")}
              </button>
            </div>
            <p className="mt-3 text-[11px] text-text-mid/80">{t("local_note")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
