import type { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import { History, Trash2 } from "lucide-react";
import { getPageMessages } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Seo } from "@/components/layout/Seo";
import { PageLoader } from "@/components/ui/BrandLoader";
import { AuthWall } from "@/components/auth/AuthWall";
import { ListGrid } from "@/components/media/ListGrid";

export default function HistoryPage() {
  const t = useTranslations("History");
  const tm = useTranslations("Meta");
  const { ready, profile, history, removeHistory, clearHistory } = useStore();
  const progress = Object.fromEntries(history.map((h) => [`${h.item.mediaType}:${h.item.id}`, h.progress]));
  return (
    <>
      <Seo title={tm("history_title")} description={t("watch_history_description")} path="/history" noindex />
      {!ready ? (
        <PageLoader />
      ) : !profile ? (
        <AuthWall heading={t("watch_history")} description={t("watch_history_description")} icon={<History className="h-5 w-5" aria-hidden="true" />} />
      ) : (
        <ListGrid
          heading={t("watch_history")}
          description={t("watch_history_description")}
          items={history.map((h) => h.item)}
          progress={progress}
          onRemove={(m) => removeHistory(m)}
          emptyHeading={t("no_watch_history_found")}
          emptyDescription={t("no_watch_history_desc")}
          searchPlaceholder={t("search_placeholder")}
          noSearchResults={t("no_search_results")}
          editLabel={t("edit_history")}
          doneLabel={t("done_editing")}
          extraActions={
            <button type="button" onClick={() => window.confirm(t("wish_clear_all_history")) && clearHistory()} className="control-3d inline-flex h-9 items-center gap-1.5 rounded-[12px] px-3.5 text-[12.5px] font-medium text-text-hi hover:text-accent-hi">
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              {t("clear_all_history")}
            </button>
          }
        />
      )}
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({ props: { messages: await getPageMessages(locale, ["History", "Watchlist"]) } });
