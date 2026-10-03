import type { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import { Bookmark } from "lucide-react";
import { getPageMessages } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { Seo } from "@/components/layout/Seo";
import { AuthWall } from "@/components/auth/AuthWall";
import { ListGrid } from "@/components/media/ListGrid";
import { useUi } from "@/components/layout/UiContext";

export default function WatchlistPage() {
  const t = useTranslations("Watchlist");
  const tm = useTranslations("Meta");
  const { ready, profile, watchlist, removeFromWatchlist } = useStore();
  const { toast } = useUi();
  return (
    <>
      <Seo title={tm("watchlist_title")} description={t("watchlist_description")} path="/watchlist" noindex />
      {!ready ? (
        <div className="min-h-dvh" />
      ) : !profile ? (
        <AuthWall heading={t("heading")} description={t("watchlist_description")} icon={<Bookmark className="h-5 w-5" aria-hidden="true" />} />
      ) : (
        <ListGrid
          heading={t("heading")}
          description={t("watchlist_description")}
          countLabel={t("items", { count: watchlist.length })}
          items={watchlist}
          onRemove={(m) => {
            removeFromWatchlist(m);
            toast(t("remove"));
          }}
          emptyHeading={t("not_found_heading")}
          emptyDescription={t("not_found_desc")}
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
