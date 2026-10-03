import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getPageMessages } from "@/lib/i18n";
import { decodeList, MAX_NAME, type WatchList } from "@/lib/lists";
import { useStore } from "@/lib/store";
import { useUi } from "@/components/layout/UiContext";
import { Seo } from "@/components/layout/Seo";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { PageLoader } from "@/components/ui/BrandLoader";
import { MovieGrid } from "@/components/media/MovieGrid";
import { MovieCard } from "@/components/media/MovieCard";

type Shared = Pick<WatchList, "name" | "items">;

/** Read-only view of a list shared by link; the list itself travels in the URL token. */
export default function SharedListPage() {
  const t = useTranslations("Watchlist");
  const router = useRouter();
  const { profile, lists, createList } = useStore();
  const { openAuth, toast } = useUi();
  const [list, setList] = useState<Shared | null | undefined>(undefined);
  const token = String(router.query.token ?? "");

  useEffect(() => {
    if (!token) return;
    decodeList(token).then(setList);
  }, [token]);

  const save = () => {
    if (!list) return;
    if (!profile) return openAuth();
    let name = list.name;
    for (let n = 2; lists.some((l) => l.name.toLowerCase() === name.toLowerCase()) && n < 50; n++) name = `${list.name.slice(0, MAX_NAME - 3)} ${n}`;
    const res = createList(name, list.items);
    if (res.ok) {
      toast(t("saved_list"));
      router.push("/watchlist");
    } else toast(res.reason === "limit" ? t("list_limit") : t("name_invalid"));
  };

  if (list === undefined) return <PageLoader />;
  if (!list)
    return (
      <div className="layout-container flex min-h-dvh flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold text-text-hi">{t("invalid_link")}</h1>
        <p className="mt-2 text-sm text-text-mid">{t("invalid_link_desc")}</p>
        <Link href="/watchlist" className="control-3d mt-6 inline-flex h-10 items-center rounded-full px-5 text-[13px] font-medium text-text-hi">
          {t("back_to_watchlist")}
        </Link>
      </div>
    );
  return (
    <>
      <Seo title={`${list.name} - Movy`} noindex />
      <div className="layout-container pt-[92px] md:pt-[112px]">
        <SectionHeader
          as="h1"
          title={list.name}
          subtitle={`${t("shared_list_subtitle")} · ${t("items", { count: list.items.length })}`}
          aside={
            <button type="button" onClick={save} className="inline-flex h-9 items-center rounded-full bg-text-hi px-5 text-[12.5px] font-semibold text-[#05070a] transition-colors hover:bg-white">
              {t("save_to_my_lists")}
            </button>
          }
        />
        <MovieGrid>
          {list.items.map((m) => (
            <MovieCard key={`${m.mediaType}:${m.id}`} item={m} variant="poster" showWatchlist={false} />
          ))}
        </MovieGrid>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({ props: { messages: await getPageMessages(locale, ["Watchlist"]) } });
