import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Check, Dices, Plus, X } from "lucide-react";
import { useUi } from "@/components/layout/UiContext";
import { useStore } from "@/lib/store";
import { MAX_ITEMS, MAX_LISTS, MAX_NAME, randomListName, validName } from "@/lib/lists";
import { cx } from "@/lib/format";

/** Dialog for choosing which lists a title belongs to, with inline list creation. */
export function ListPicker() {
  const t = useTranslations("Watchlist");
  const { listPickerItem: item, closeListPicker, toast } = useUi();
  const { lists, inList, addToList, removeFromList, createList } = useStore();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!item) return;
    setName("");
    setError(null);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeListPicker();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [item, closeListPicker]);

  if (!item) return null;

  const toggle = (id: string, listName: string) => {
    if (inList(id, item)) {
      removeFromList(id, item);
      toast(t("removed_from", { list: listName }));
      return;
    }
    const res = addToList(id, item);
    if (res === "full") toast(t("list_full"));
    else if (res === "ok") toast(t("added_to", { list: listName }));
  };

  const create = (e: FormEvent) => {
    e.preventDefault();
    if (!validName(name)) return setError(t("name_invalid"));
    const res = createList(name, [item]);
    if (!res.ok) return setError(res.reason === "limit" ? t("list_limit") : res.reason === "duplicate" ? t("name_taken") : t("name_invalid"));
    toast(t("added_to", { list: res.list.name }));
    closeListPicker();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-page-enter md:items-center md:p-6" role="dialog" aria-modal="true" aria-label={t("add_to_list")} onMouseDown={(e) => e.target === e.currentTarget && closeListPicker()}>
      <div className="control-3d relative flex max-h-[85dvh] w-full max-w-md flex-col rounded-t-[20px] p-5 text-text-hi shadow-2xl animate-pane-enter md:rounded-[20px] md:p-6">
        <button type="button" onClick={closeListPicker} className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full text-text-mid hover:bg-white/[0.07] hover:text-text-hi" aria-label="Close">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <h2 className="pr-8 text-lg font-semibold">{t("add_to_list")}</h2>
        <p className="mt-0.5 truncate pr-8 text-[13px] text-text-mid">{t("add_to_list_subtitle", { title: item.title })}</p>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto scrollbar-styles">
          {lists.length ? (
            <ul className="flex flex-col gap-1">
              {lists.map((l) => {
                const on = inList(l.id, item);
                const full = !on && l.items.length >= MAX_ITEMS;
                return (
                  <li key={l.id}>
                    <button type="button" disabled={full} onClick={() => toggle(l.id, l.name)} aria-pressed={on} className="flex h-12 w-full items-center gap-3 rounded-[12px] px-3 text-left transition-colors hover:bg-white/[0.06] disabled:opacity-50">
                      <span className={cx("flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors", on ? "border-primary bg-primary text-white" : "border-white/25")}>{on ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : null}</span>
                      <span className="min-w-0 flex-1 truncate text-sm font-medium">{l.name}</span>
                      <span className="shrink-0 text-[12px] tabular-nums text-text-mid">
                        {l.items.length}/{MAX_ITEMS}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="py-6 text-center text-[13px] text-text-mid">{t("no_lists_yet")}</p>
          )}
        </div>

        {lists.length < MAX_LISTS ? (
          <form onSubmit={create} className="mt-4 border-t border-white/[0.08] pt-4">
            <p className="mb-2 text-[12px] font-medium uppercase tracking-wide text-text-mid">{t("create_new_list")}</p>
            <div className="flex items-center gap-2">
              <label className="flex h-11 min-w-0 flex-1 items-center rounded-[12px] border border-white/10 bg-black/30 pr-1 focus-within:border-primary/60">
                <input value={name} onChange={(e) => (setName(e.target.value.slice(0, MAX_NAME)), setError(null))} placeholder={t("list_name_placeholder")} className="h-full min-w-0 flex-1 bg-transparent px-3.5 text-sm text-text-hi placeholder:text-text-mid/70 focus:outline-hidden" maxLength={MAX_NAME} />
                <button type="button" onClick={() => (setName(randomListName(lists.map((l) => l.name))), setError(null))} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] text-text-mid transition-colors hover:bg-white/[0.07] hover:text-text-hi" aria-label={t("randomize_name")} title={t("randomize_name")}>
                  <Dices className="h-[18px] w-[18px]" aria-hidden="true" />
                </button>
              </label>
              <button type="submit" className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full bg-text-hi px-4 text-[13px] font-semibold text-[#05070a] transition-colors hover:bg-white">
                <Plus className="h-4 w-4" aria-hidden="true" />
                {t("create_list")}
              </button>
            </div>
            {error ? <p className="mt-2 text-[12.5px] text-accent-hi">{error}</p> : null}
          </form>
        ) : (
          <p className="mt-4 border-t border-white/[0.08] pt-4 text-[12.5px] text-text-mid">{t("list_limit")}</p>
        )}
      </div>
    </div>
  );
}
