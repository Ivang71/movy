import { useState } from "react";
import { useTranslations } from "next-intl";
import { Search, X } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { MovieGrid } from "./MovieGrid";
import { MovieCard } from "./MovieCard";
import { cx } from "@/lib/format";

interface Props {
  heading: string;
  description: string;
  items: MediaItem[];
  progress?: Record<string, number>;
  onRemove: (item: MediaItem) => void;
  emptyHeading: string;
  emptyDescription: string;
  searchPlaceholder: string;
  noSearchResults: string;
  editLabel: string;
  doneLabel: string;
  extraActions?: React.ReactNode;
  countLabel?: string;
}

/** Shared grid for the watchlist and history pages with search and an edit mode. */
export function ListGrid({ heading, description, items, progress, onRemove, emptyHeading, emptyDescription, searchPlaceholder, noSearchResults, editLabel, doneLabel, extraActions, countLabel }: Props) {
  const t = useTranslations("Watchlist");
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState(false);
  const visible = q.trim() ? items.filter((m) => m.title.toLowerCase().includes(q.trim().toLowerCase())) : items;

  return (
    <div className="layout-container pt-[92px] md:pt-[112px]">
      <SectionHeader
        as="h1"
        title={heading}
        subtitle={countLabel ? `${description} · ${countLabel}` : description}
        aside={
          items.length ? (
            <>
              <label className="control-3d hidden h-9 items-center gap-2 rounded-[12px] px-3 sm:flex">
                <Search className="h-4 w-4 text-text-mid" aria-hidden="true" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={searchPlaceholder} className="w-40 bg-transparent text-[12.5px] text-text-hi placeholder:text-text-mid focus:outline-hidden" />
              </label>
              {extraActions}
              <button type="button" onClick={() => setEditing((e) => !e)} className={cx("control-3d inline-flex h-9 items-center rounded-[12px] px-3.5 text-[12.5px] font-medium", editing ? "text-primary" : "text-text-hi")}>
                {editing ? doneLabel : editLabel}
              </button>
            </>
          ) : null
        }
      />
      {!items.length ? (
        <div className="rounded-[16px] border border-dashed border-white/[0.12] py-24 text-center">
          <p className="text-lg font-semibold text-text-hi">{emptyHeading}</p>
          <p className="mt-1 text-sm text-text-mid">{emptyDescription}</p>
        </div>
      ) : !visible.length ? (
        <p className="py-20 text-center text-sm text-text-mid">{noSearchResults}</p>
      ) : (
        <MovieGrid>
          {visible.map((m) => (
            <div key={`${m.mediaType}:${m.id}`} className={cx("relative", editing && "animate-[jiggle_.45s_linear_infinite]")}>
              <MovieCard item={m} progress={progress?.[`${m.mediaType}:${m.id}`]} showWatchlist={false} />
              {editing ? (
                <button type="button" onClick={() => onRemove(m)} className="absolute -right-1.5 -top-1.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white shadow-lg" aria-label={t("remove")}>
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          ))}
        </MovieGrid>
      )}
      <style jsx global>{`
        @keyframes jiggle {
          0% {
            transform: translate(0, 0);
          }
          20% {
            transform: translate(0.55px, -0.35px);
          }
          40% {
            transform: translate(-0.45px, 0.4px);
          }
          60% {
            transform: translate(0.4px, 0.25px);
          }
          80% {
            transform: translate(-0.35px, -0.3px);
          }
          100% {
            transform: translate(0, 0);
          }
        }
      `}</style>
    </div>
  );
}
