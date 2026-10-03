import type { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import { getPageMessages } from "@/lib/i18n";
import { LegalPage } from "@/components/layout/LegalPage";

export default function PrivacyPage() {
  const t = useTranslations("Legal");
  return (
    <LegalPage
      title={t("privacy_title")}
      path="/legal/privacy"
      sections={[
        { heading: "What we store", body: <p>Nothing about you is stored on a server by default. Profiles, the watchlist, watch history, recent searches and watch-party rooms live in your browser's local storage and never leave your device.</p> },
        { heading: "Requests we make", body: <p>Pages request artwork from TMDB's image servers and may embed trailers from YouTube. Those services receive your IP address and standard browser headers when the assets load. Playback providers you add yourself have their own policies.</p> },
        { heading: "Cookies and analytics", body: <p>The site does not set tracking cookies and ships without analytics. Your hosting platform may add request logs of its own.</p> },
        { heading: "Deleting your data", body: <p>Remove a profile from the Profiles page, or clear site data in your browser, to erase everything stored locally.</p> },
      ]}
    />
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({ props: { messages: await getPageMessages(locale, ["Legal"]) } });
