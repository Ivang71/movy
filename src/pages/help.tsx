import type { GetStaticProps } from "next";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronDown, LifeBuoy } from "lucide-react";
import { getPageMessages } from "@/lib/i18n";
import { Seo } from "@/components/layout/Seo";

const GROUPS: { key: string; questions: string[] }[] = [
  { key: "about", questions: ["what", "host", "data"] },
  { key: "playback", questions: ["servers", "quality"] },
  { key: "account", questions: ["profiles", "sync"] },
  { key: "party", questions: ["party"] },
  { key: "legal", questions: ["remove"] },
];

export default function HelpPage() {
  const t = useTranslations("Help");
  const tm = useTranslations("Meta");
  return (
    <>
      <Seo title={tm("help_title")} description={t("subtitle")} path="/help" />
      <div className="layout-container max-w-4xl pt-[92px] md:pt-[112px]">
        <div className="flex gap-2.5">
          <span className="mt-1 w-[3px] self-stretch bg-primary" aria-hidden="true" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{t("title")}</h1>
            <p className="mt-1 text-sm text-text-mid">{t("subtitle")}</p>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-10">
          {GROUPS.map((g) => (
            <section key={g.key}>
              <h2 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-mid">{t(`group_${g.key}`)}</h2>
              <div className="overflow-hidden rounded-[14px] border border-white/[0.08] bg-surface-1/60 divide-y divide-white/[0.06]">
                {g.questions.map((q) => (
                  <details key={q} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15px] font-medium text-text-hi transition-colors hover:bg-white/[0.03] [&::-webkit-details-marker]:hidden">
                      {t(`q_${q}`)}
                      <ChevronDown className="h-4 w-4 shrink-0 text-text-mid transition-transform group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="px-5 pb-5 text-[14px] leading-relaxed text-text-mid">{t(`a_${q}`)}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start gap-3 rounded-[16px] border border-white/[0.08] bg-surface-1/60 p-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <LifeBuoy className="h-6 w-6 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium text-text-hi">{t("still_stuck")}</p>
          </div>
          <Link href="/legal/dmca" className="control-3d inline-flex h-10 items-center rounded-full px-5 text-[13px] font-medium text-text-hi">
            {t("get_in_touch")}
          </Link>
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({ props: { messages: await getPageMessages(locale, ["Help"]) } });
