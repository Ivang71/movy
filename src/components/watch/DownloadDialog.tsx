import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Download, X } from "lucide-react";
import type { Details } from "@/lib/types";
import { PLAYBACK_SOURCES, type DownloadOption } from "@/lib/sources";
import { DOWNLOAD_LIMIT, downloadsLeft, formatDuration, recordDownload } from "@/lib/downloads";
import { cx } from "@/lib/format";

/** Quality and subtitle picker for downloads. Empty until a source with download support is registered. */
export function DownloadDialog({ details, onClose }: { details: Details; onClose: () => void }) {
  const t = useTranslations("Download");
  const [options, setOptions] = useState<DownloadOption[] | null>(null);
  const [quality, setQuality] = useState<string | null>(null);
  const [lang, setLang] = useState<string>("");
  const [allowance, setAllowance] = useState(() => ({ left: DOWNLOAD_LIMIT, resetsInMs: null as number | null }));

  useEffect(() => {
    setAllowance(downloadsLeft());
    let alive = true;
    Promise.all(
      PLAYBACK_SOURCES.filter((s) => s.downloads).map((s) =>
        s.downloads!({ type: details.mediaType, id: details.id, imdbId: details.imdbId }).catch(() => [] as DownloadOption[]),
      ),
    ).then((all) => {
      if (!alive) return;
      const flat = all.flat();
      setOptions(flat);
      setQuality(flat[0]?.quality ?? null);
    });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => {
      alive = false;
      document.removeEventListener("keydown", onKey);
    };
  }, [details, onClose]);

  const chosen = options?.find((o) => o.quality === quality) ?? null;
  const limited = allowance.left <= 0;

  const start = () => {
    if (!chosen || limited) return;
    recordDownload();
    setAllowance(downloadsLeft());
    window.open(chosen.url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-page-enter md:items-center md:p-6" role="dialog" aria-modal="true" aria-label={t("title")} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="control-3d relative w-full max-w-md rounded-t-[20px] p-6 text-text-hi shadow-2xl animate-pane-enter md:rounded-[20px]">
        <button type="button" onClick={onClose} className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full text-text-mid hover:bg-white/[0.07] hover:text-text-hi" aria-label={t("close")}>
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/[0.06]">
            <Download className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">{t("title")}</h2>
            <p className="truncate text-[13px] text-text-mid">{details.title}</p>
          </div>
        </div>

        {options === null ? (
          <div className="flex justify-center py-10">
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" aria-hidden="true" />
          </div>
        ) : !options.length ? (
          <div className="mt-6 rounded-[14px] border border-dashed border-white/[0.12] p-5 text-center">
            <p className="text-sm font-medium text-text-hi">{t("download_not_available")}</p>
            <p className="mt-1 text-[12.5px] text-text-mid">{t("no_source_hint")}</p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-5">
            <div>
              <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-text-mid">{t("select_quality")}</p>
              <div className="flex flex-wrap gap-2">
                {options.map((o) => (
                  <button key={o.quality} type="button" onClick={() => setQuality(o.quality)} aria-pressed={o.quality === quality} className={cx("h-9 rounded-full border px-4 text-[13px] font-medium transition-colors", o.quality === quality ? "border-white/40 bg-white text-[#05070a]" : "control-3d text-text-hi")}>
                    {o.quality}
                  </button>
                ))}
              </div>
            </div>
            {chosen?.subtitles?.length ? (
              <label className="flex flex-col gap-2 text-[12px] font-medium uppercase tracking-wide text-text-mid">
                {t("select_language")}
                <select value={lang} onChange={(e) => setLang(e.target.value)} className="h-11 rounded-[12px] border border-white/10 bg-black/30 px-3 text-sm normal-case tracking-normal text-text-hi focus:border-primary/60 focus:outline-hidden">
                  <option value="">{t("no_subtitles")}</option>
                  {chosen.subtitles.map((c) => (
                    <option key={c} value={c}>
                      {new Intl.DisplayNames(undefined, { type: "language" }).of(c) ?? c}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <button type="button" onClick={start} disabled={limited} className="inline-flex h-11 items-center justify-center rounded-full bg-text-hi text-sm font-semibold text-[#05070a] transition-colors hover:bg-white disabled:opacity-50">
              {limited ? t("download_limit_reached") : t("start")}
            </button>
          </div>
        )}

        <div className="mt-5 border-t border-white/[0.08] pt-4 text-[12px] text-text-mid">
          <p>{t("download_limit_notice")}</p>
          <p className="mt-1 text-text-hi/80">
            {t("downloads_left", { count: allowance.left, limit: DOWNLOAD_LIMIT })}
            {limited && allowance.resetsInMs ? ` · ${t("downloads_resets_in", { time: formatDuration(allowance.resetsInMs) })}` : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
