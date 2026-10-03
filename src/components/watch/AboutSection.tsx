import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import type { Details } from "@/lib/types";
import { formatLongDate, formatRuntime } from "@/lib/format";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function AboutSection({ details }: { details: Details }) {
  const t = useTranslations("WatchPage");
  const router = useRouter();
  const rows: { label: string; value: string }[] = [];
  const names = (p: Details["cast"]) => p.map((x) => x.name).join(", ");
  if (details.directors.length) rows.push({ label: t("directors"), value: names(details.directors) });
  if (details.writers.length) rows.push({ label: t("writers"), value: names(details.writers) });
  if (details.creators.length) rows.push({ label: t("creators"), value: names(details.creators) });
  if (details.originalTitle && details.originalTitle !== details.title) rows.push({ label: t("original_title"), value: details.originalTitle });
  const rel = formatLongDate(details.releaseDate, router.locale);
  if (rel) rows.push({ label: t("release"), value: rel });
  const rt = formatRuntime(details.duration);
  if (rt && details.mediaType === "movie") rows.push({ label: t("runtime"), value: rt });
  if (details.status) rows.push({ label: t("status"), value: details.status });
  if (!rows.length) return null;
  return (
    <section className="mt-9">
      <SectionHeader title={t("about", { title: details.title })} />
      <dl className="grid grid-cols-1 gap-x-10 gap-y-3 text-[13px] sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-0.5 border-l border-white/[0.08] pl-3">
            <dt className="text-[11px] font-medium uppercase tracking-wide text-text-mid">{r.label}</dt>
            <dd className="text-text-hi">{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
