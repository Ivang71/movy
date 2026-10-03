import type { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import { getPageMessages } from "@/lib/i18n";
import { LegalPage } from "@/components/layout/LegalPage";

export default function TermsPage() {
  const t = useTranslations("Legal");
  return (
    <LegalPage
      title={t("terms_title")}
      path="/legal/terms"
      sections={[
        { heading: "1. What this site is", body: <p>Movy is a catalog interface. It displays information about movies, series and anime, such as titles, artwork, ratings and release dates, and provides a player shell that site operators may connect to their own licensed sources. The project ships without any video sources.</p> },
        { heading: "2. Acceptable use", body: <p>Use the site for personal, non-commercial browsing. Do not attempt to disrupt the service, scrape it at abusive rates, or connect it to content you do not have the rights to distribute.</p> },
        { heading: "3. Profiles and local data", body: <p>Profiles, watchlists, history and watch-party rooms are stored in your browser. You are responsible for the device you use; clearing site data removes this information permanently.</p> },
        { heading: "4. Third-party data", body: <p>Metadata and images are provided by The Movie Database (TMDB) under their terms of use. Trailers are embedded from YouTube and are subject to YouTube's terms. This product uses the TMDB API but is not endorsed or certified by TMDB.</p> },
        { heading: "5. Changes", body: <p>These terms may be updated from time to time. Continued use of the site after a change means you accept the updated terms.</p> },
      ]}
    />
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({ props: { messages: await getPageMessages(locale, ["Legal"]) } });
