import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Bookmark, ChevronLeft, ChevronRight, Link2, Plus, Trash2 } from "lucide-react";
import { getPageMessages } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Seo } from "@/components/layout/Seo";
import { AuthWall } from "@/components/auth/AuthWall";
import { ListGrid } from "@/components/media/ListGrid";
import { PageLoader } from "@/components/ui/BrandLoader";
import { useUi } from "@/components/layout/UiContext";
import { MAX_LISTS, MAX_NAME, encodeList, randomListName, validName } from "@/lib/lists";
import { cx } from "@/lib/format";

export default function WatchlistPage() {
  const t = useTranslations("Watchlist");
  const tm = useTranslations("Meta");
  const router = useRouter();
  const { ready, profile, lists, removeFromList, createList, renameList, deleteList, moveList } = useStore();
  const { toast } = useUi();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState("");
  const [rename, setRename] = useState("");
  const [error, setError] = useState<string | null>(null);

  const active = lists.find((l) => l.id === activeId) ?? lists[0] ?? null;
  useEffect(() => {
    if (active && active.id !== activeId) setActiveId(active.id);
  }, [active, activeId]);
  useEffect(() => setRename(active?.name ?? ""), [active?.id, active?.name]);

  const submitNew = (e: FormEvent) => {
    e.preventDefault();
    const res = createList(draft);
    if (!res.ok) return setError(res.reason === "limit" ? t("list_limit") : res.reason === "duplicate" ? t("name_taken") : t("name_invalid"));
    setActiveId(res.list.id);
    setCreating(false);
    setDraft("");
    setError(null);
  };

  const share = async () => {
    if (!active) return;
    const token = await encodeList(active);
    const prefix = router.locale && router.locale !== router.defaultLocale ? `/${router.locale}` : "";
    const url = `${window.location.origin}${prefix}/l/${token}`;
    try {
      await navigator.clipboard.writeText(url);
      toast(t("link_copied"));
    } catch {
      window.prompt(t("copy_link"), url);
    }
  };

  const saveName = () => {
    if (!active || rename.trim() === active.name) return;
    const res = renameList(active.id, rename);
    if (res !== "ok") {
      setError(res === "duplicate" ? t("name_taken") : t("name_invalid"));
      setRename(active.name);
    } else setError(null);
  };

  const tabs = (
    <div className="mb-6 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1" role="tablist" aria-label={t("heading")}>
      {lists.map((l) => (
        <button key={l.id} type="button" role="tab" aria-selected={l.id === active?.id} onClick={() => setActiveId(l.id)} className={cx("control-3d inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-4 text-[12.5px] font-medium transition-colors", l.id === active?.id ? "border-white/25 bg-white/[0.08] text-white" : "text-text-mid hover:text-text-hi")}>
          {l.name}
          <span className="tabular-nums text-text-mid/80">{l.items.length}</span>
        </button>
      ))}
      {lists.length < MAX_LISTS ? (
        creating ? (
          <form onSubmit={submitNew} className="flex shrink-0 items-center gap-2">
            <input autoFocus value={draft} onChange={(e) => (setDraft(e.target.value.slice(0, MAX_NAME)), setError(null))} placeholder={t("list_name_placeholder")} className="h-9 w-44 rounded-full border border-white/10 bg-black/30 px-4 text-[12.5px] text-text-hi placeholder:text-text-mid focus:border-primary/60 focus:outline-hidden" />
            <button type="button" onClick={() => setDraft(randomListName(lists.map((l) => l.name)))} className="control-3d h-9 shrink-0 rounded-full px-3 text-[12.5px] text-text-mid hover:text-text-hi">
              {t("randomize_name")}
            </button>
            <button type="submit" disabled={!validName(draft)} className="h-9 shrink-0 rounded-full bg-text-hi px-4 text-[12.5px] font-semibold text-[#05070a] disabled:opacity-50">
              {t("create_list")}
            </button>
          </form>
        ) : (
          <button type="button" onClick={() => setCreating(true)} className="control-3d inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[12.5px] font-medium text-text-hi">
            <Plus className="h-4 w-4" aria-hidden="true" />
            {t("new_list")}
          </button>
        )
      ) : null}
    </div>
  );

  const editBar = active ? (
    <div className="control-3d flex flex-wrap items-center gap-2 rounded-[14px] p-3">
      <label className="flex min-w-[200px] flex-1 items-center gap-2 text-[12px] font-medium text-text-mid">
        {t("rename_list")}
        <input value={rename} onChange={(e) => (setRename(e.target.value.slice(0, MAX_NAME)), setError(null))} onBlur={saveName} onKeyDown={(e) => e.key === "Enter" && (e.currentTarget.blur(), e.preventDefault())} className="h-9 min-w-0 flex-1 rounded-[10px] border border-white/10 bg-black/30 px-3 text-[13px] text-text-hi focus:border-primary/60 focus:outline-hidden" />
      </label>
      <div className="flex items-center gap-1" role="group" aria-label={t("reorder_list")}>
        <button type="button" onClick={() => moveList(active.id, -1)} disabled={lists[0]?.id === active.id} className="flex h-9 w-9 items-center justify-center rounded-[10px] text-text-hi hover:bg-white/[0.07] disabled:opacity-30" aria-label={t("move_left")}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => moveList(active.id, 1)} disabled={lists[lists.length - 1]?.id === active.id} className="flex h-9 w-9 items-center justify-center rounded-[10px] text-text-hi hover:bg-white/[0.07] disabled:opacity-30" aria-label={t("move_right")}>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
      <button type="button" onClick={() => window.confirm(t("wish_delete_list")) && deleteList(active.id)} className="inline-flex h-9 items-center gap-1.5 rounded-[10px] px-3 text-[12.5px] font-medium text-accent-hi hover:bg-white/[0.07]">
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        {t("delete_list")}
      </button>
      {error ? <p className="w-full text-[12.5px] text-accent-hi">{error}</p> : null}
    </div>
  ) : null;

  return (
    <>
      <Seo title={tm("watchlist_title")} description={t("watchlist_description")} path="/watchlist" noindex />
      {!ready ? (
        <PageLoader />
      ) : !profile ? (
        <AuthWall heading={t("heading")} description={t("watchlist_description")} icon={<Bookmark className="h-5 w-5" aria-hidden="true" />} />
      ) : (
        <ListGrid
          heading={t("heading")}
          description={t("watchlist_description")}
          countLabel={active ? t("items", { count: active.items.length }) : undefined}
          items={active?.items ?? []}
          topBar={lists.length || true ? tabs : null}
          editBar={editBar}
          extraActions={
            active ? (
              <button type="button" onClick={share} className="control-3d inline-flex h-9 items-center gap-1.5 rounded-[12px] px-3.5 text-[12.5px] font-medium text-text-hi">
                <Link2 className="h-4 w-4" aria-hidden="true" />
                {t("share_list")}
              </button>
            ) : null
          }
          onRemove={(m) => {
            if (!active) return;
            removeFromList(active.id, m);
            toast(t("removed_from", { list: active.name }));
          }}
          emptyHeading={lists.length ? t("list_empty") : t("not_found_heading")}
          emptyDescription={lists.length ? "" : t("not_found_desc")}
          searchPlaceholder={t("search_placeholder")}
          noSearchResults={t("no_search_results")}
          editLabel={t("edit_list")}
          doneLabel={t("done_editing")}
        />
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({ props: { messages: await getPageMessages(locale, ["Watchlist"]) } });
