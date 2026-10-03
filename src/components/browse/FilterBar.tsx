import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Check, ChevronDown, RotateCcw } from "lucide-react";
import type { BrowseFilters, MediaType } from "@/lib/types";
import { genreOptions } from "@/lib/genres";
import { cx } from "@/lib/format";

export const COUNTRIES: { code: string; name: string }[] = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "KR", name: "South Korea" },
  { code: "JP", name: "Japan" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "IN", name: "India" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "CN", name: "China" },
  { code: "TR", name: "Türkiye" },
  { code: "RU", name: "Russia" },
  { code: "ID", name: "Indonesia" },
  { code: "AR", name: "Argentina" },
  { code: "SE", name: "Sweden" },
  { code: "DK", name: "Denmark" },
];

function Pill({ label, active, open, onClick, children, align = "left" }: { label: ReactNode; active?: boolean; open: boolean; onClick: () => void; children: ReactNode; align?: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={onClick}
        aria-expanded={open}
        className={cx(
          "control-3d inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-[12.5px] font-medium transition-colors",
          active ? "text-text-hi border-white/20" : "text-text-hi/85",
        )}
      >
        {label}
        <ChevronDown className={cx("h-3.5 w-3.5 text-text-mid transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open ? <div className={cx("control-3d absolute top-11 z-30 max-h-80 w-60 overflow-y-auto scrollbar-styles rounded-[14px] p-1.5 shadow-2xl animate-pane-enter", align === "right" ? "right-0" : "left-0")}>{children}</div> : null}
    </div>
  );
}

function Option({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" onClick={onClick} className={cx("flex h-9 w-full items-center justify-between rounded-[9px] px-2.5 text-left text-[13px] transition-colors", selected ? "bg-white/[0.1] text-white" : "text-white/80 hover:bg-white/[0.06] hover:text-white")}>
      <span className="truncate">{children}</span>
      {selected ? <Check className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" /> : null}
    </button>
  );
}

interface Props {
  type: MediaType;
  filters: BrowseFilters;
  onChange: (next: BrowseFilters) => void;
  count?: number;
}

export function FilterBar({ type, filters, onChange, count }: Props) {
  const t = useTranslations("Browse");
  const [open, setOpen] = useState<null | "genres" | "year" | "country" | "sort">(null);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !wrap.current?.contains(e.target as Node) && setOpen(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const genres = genreOptions(type === "movie" ? "movie" : "tv");
  const selectedGenres = (filters.genres ?? "").split(",").filter(Boolean);
  const thisYear = new Date().getFullYear();
  const years = Array.from({ length: thisYear - 1949 }, (_, i) => String(thisYear + 1 - i));
  const sorts: { key: NonNullable<BrowseFilters["sort"]>; label: string }[] = [
    { key: "popular", label: t("sort_popular") },
    { key: "rating", label: t("sort_rating") },
    { key: "newest", label: t("sort_newest") },
    { key: "oldest", label: t("sort_oldest") },
  ];
  const active = Boolean(filters.genres || filters.year || filters.country || (filters.sort && filters.sort !== "popular"));
  const toggle = (k: typeof open) => setOpen((o) => (o === k ? null : k));

  const genreLabel = selectedGenres.length ? `${t("genres")} · ${selectedGenres.length}` : t("genres");

  return (
    <div ref={wrap} className="flex flex-wrap items-center gap-2">
      <Pill label={genreLabel} active={selectedGenres.length > 0} open={open === "genres"} onClick={() => toggle("genres")}>
        {genres.map((g) => {
          const sel = selectedGenres.includes(String(g.id));
          return (
            <Option
              key={g.id}
              selected={sel}
              onClick={() => {
                const next = sel ? selectedGenres.filter((x) => x !== String(g.id)) : [...selectedGenres, String(g.id)];
                onChange({ ...filters, genres: next.join(",") || undefined });
              }}
            >
              {g.name}
            </Option>
          );
        })}
      </Pill>
      <Pill label={filters.year ?? t("years")} active={Boolean(filters.year)} open={open === "year"} onClick={() => toggle("year")}>
        <Option selected={!filters.year} onClick={() => onChange({ ...filters, year: undefined })}>
          {t("all")}
        </Option>
        {years.map((y) => (
          <Option key={y} selected={filters.year === y} onClick={() => onChange({ ...filters, year: y })}>
            {y}
          </Option>
        ))}
      </Pill>
      <Pill label={COUNTRIES.find((c) => c.code === filters.country)?.name ?? t("countries")} active={Boolean(filters.country)} open={open === "country"} onClick={() => toggle("country")}>
        <Option selected={!filters.country} onClick={() => onChange({ ...filters, country: undefined })}>
          {t("all")}
        </Option>
        {COUNTRIES.map((c) => (
          <Option key={c.code} selected={filters.country === c.code} onClick={() => onChange({ ...filters, country: c.code })}>
            {c.name}
          </Option>
        ))}
      </Pill>
      {active ? (
        <button type="button" onClick={() => onChange({ sort: "popular" })} className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-medium text-text-mid transition-colors hover:text-text-hi">
          <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
          {t("reset")}
        </button>
      ) : null}
      <div className="ml-auto flex items-center gap-3">
        {typeof count === "number" && count > 0 ? <span className="hidden text-[12.5px] text-text-mid sm:inline">{t("results", { count })}</span> : null}
        <Pill label={sorts.find((s) => s.key === (filters.sort ?? "popular"))?.label ?? t("sort_by")} open={open === "sort"} onClick={() => toggle("sort")} align="right">
          {sorts.map((s) => (
            <Option key={s.key} selected={(filters.sort ?? "popular") === s.key} onClick={() => onChange({ ...filters, sort: s.key })}>
              {s.label}
            </Option>
          ))}
        </Pill>
      </div>
    </div>
  );
}
