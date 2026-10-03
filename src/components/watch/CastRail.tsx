import { useTranslations } from "next-intl";
import { UserRound } from "lucide-react";
import type { Person } from "@/lib/types";
import { tmdbImage } from "@/lib/images";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollRow } from "@/components/media/ScrollRow";

export function CastRail({ cast }: { cast: Person[] }) {
  const t = useTranslations("WatchPage");
  if (!cast.length) return null;
  return (
    <section className="mt-9">
      <SectionHeader title={t("actors")} subtitle={t("actors_subtitle")} />
      <ScrollRow label={t("actors")}>
        {cast.map((p) => {
          const src = tmdbImage(p.avatar, "w342");
          return (
            <div key={p.id} className="w-[118px] sm:w-[132px] md:w-[140px] xl:w-[148px]">
              <article className="group flex flex-col gap-1.5">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[10px] bg-white/[0.03]">
                  {src ? (
                    <img src={src} alt={p.name} className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.045]" loading="lazy" decoding="async" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/30">
                      <UserRound className="h-[42%] w-[42%]" aria-hidden="true" />
                    </div>
                  )}
                </div>
                <div className="min-h-[2.4em] px-px">
                  <p className="line-clamp-2 text-[13px] font-semibold leading-tight text-white/95">{p.name}</p>
                  {p.label ? <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-white/60">{p.label}</p> : null}
                </div>
              </article>
            </div>
          );
        })}
      </ScrollRow>
    </section>
  );
}
