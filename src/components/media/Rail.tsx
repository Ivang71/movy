import type { ReactNode } from "react";
import type { MediaItem } from "@/lib/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollRow } from "./ScrollRow";
import { MovieCard, type CardVariant } from "./MovieCard";
import { cx } from "@/lib/format";

interface Props {
  title: ReactNode;
  subtitle?: ReactNode;
  href?: string;
  items: MediaItem[];
  variant?: CardVariant;
  episodeMeta?: boolean;
  label?: string;
  ranked?: boolean;
  progress?: Record<string, number>;
  aside?: ReactNode;
  className?: string;
}

/** Mobile slides are 160px posters, desktop slides are 320px backdrops. */
export function slideClass(variant: CardVariant = "rail"): string {
  return variant === "poster" ? "w-[140px] xs:w-[150px] md:w-[180px] lg:w-[200px]" : "w-[160px] md:w-[320px]";
}

export function Rail({ title, subtitle, href, items, variant = "rail", episodeMeta, label, ranked, progress, aside, className }: Props) {
  if (!items.length) return null;
  return (
    <section className={className}>
      <SectionHeader title={title} subtitle={subtitle} href={href} aside={aside} />
      <ScrollRow label={typeof label === "string" ? label : undefined}>
        {items.map((item, i) => (
          <div key={`${item.mediaType}:${item.id}`} className={cx(slideClass(variant))}>
            <MovieCard item={item} variant={variant} episodeMeta={episodeMeta} rank={ranked ? i + 1 : undefined} progress={progress?.[`${item.mediaType}:${item.id}`]} priority={i < 4} />
          </div>
        ))}
      </ScrollRow>
    </section>
  );
}
