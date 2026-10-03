import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { cx } from "@/lib/format";

interface Props {
  title: ReactNode;
  subtitle?: ReactNode;
  href?: string;
  aside?: ReactNode;
  className?: string;
  as?: "h2" | "h1";
}

export function SectionHeader({ title, subtitle, href, aside, className, as: Tag = "h2" }: Props) {
  const heading = <Tag className={cx("text-xl md:text-2xl font-semibold truncate", !href && "text-text-hi")}>{title}</Tag>;
  return (
    <div className={cx("flex items-start justify-between gap-4 mb-5", className)}>
      <div className="flex min-w-0 gap-2.5">
        <span className="mt-0.5 w-[3px] self-stretch min-h-[1.15em] bg-primary shrink-0" aria-hidden="true" />
        <div className="min-w-0">
          {href ? (
            <Link href={href} className="group/rowtitle inline-flex max-w-full items-center gap-1 text-text-hi">
              {heading}
              <ChevronRight className="h-5 w-5 shrink-0 text-text-mid transition-transform duration-200 group-hover/rowtitle:translate-x-0.5 group-hover/rowtitle:text-text-hi" aria-hidden="true" />
            </Link>
          ) : (
            heading
          )}
          {subtitle ? <p className="mt-0.5 text-[13px] md:text-sm text-text-mid line-clamp-2">{subtitle}</p> : null}
        </div>
      </div>
      {aside ? <div className="flex shrink-0 items-center gap-2">{aside}</div> : null}
    </div>
  );
}
