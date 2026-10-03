import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Seo } from "./Seo";

export interface LegalSection {
  heading: string;
  body: ReactNode;
}

export function LegalPage({ title, path, sections }: { title: string; path: string; sections: LegalSection[] }) {
  const t = useTranslations("Legal");
  return (
    <>
      <Seo title={`${title} - Movy`} path={path} />
      <article className="layout-container max-w-3xl pt-[92px] md:pt-[112px]">
        <div className="flex gap-2.5">
          <span className="mt-1 w-[3px] self-stretch bg-primary" aria-hidden="true" />
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h1>
            <p className="mt-1 text-sm text-text-mid">{t("last_updated", { year: new Date().getFullYear() })}</p>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-8 text-[14.5px] leading-relaxed text-text-mid">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="mb-2 text-lg font-semibold text-text-hi">{s.heading}</h2>
              <div className="flex flex-col gap-3">{s.body}</div>
            </section>
          ))}
          <p className="border-t border-white/[0.08] pt-6 text-[13px]">{t("contact_hint")}</p>
        </div>
      </article>
    </>
  );
}
