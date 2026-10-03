import type { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import { getMessages, pickNamespaces } from "@/lib/i18n";
import { Seo } from "@/components/layout/Seo";
import { NoSignal } from "@/components/errors/NoSignal";

export default function ServerError() {
  const t = useTranslations("InternalServerPage");
  return (
    <>
      <Seo title={`${t("heading")} - Movy`} noindex />
      <NoSignal heading={t("heading")} description={t("desc")} code={t("code")} homeLabel={t("goHome")} />
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: { bare: true, messages: pickNamespaces(await getMessages(locale), ["Meta", "InternalServerPage"]) },
});
