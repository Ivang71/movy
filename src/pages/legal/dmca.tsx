import type { GetStaticProps } from "next";
import { useTranslations } from "next-intl";
import { getPageMessages } from "@/lib/i18n";
import { LegalPage } from "@/components/layout/LegalPage";

export default function DmcaPage() {
  const t = useTranslations("Legal");
  return (
    <LegalPage
      title={t("dmca_title")}
      path="/legal/dmca"
      sections={[
        { heading: "Scope", body: <p>This site does not host, upload or store video files. It displays metadata and artwork provided by TMDB and embeds official trailers from YouTube. Operators who connect their own playback providers are responsible for the rights to that content.</p> },
        {
          heading: "Reporting a concern",
          body: (
            <>
              <p>If you believe material reachable through a deployment of this site infringes your rights, send a notice to the operator of that deployment with:</p>
              <ul className="list-disc space-y-1 pl-5">
                <li>Identification of the work you believe is infringed.</li>
                <li>The exact URL on this site where it appears.</li>
                <li>Your contact details and a statement, under penalty of perjury, that you are authorised to act for the rights holder.</li>
              </ul>
              <p>Artwork and metadata corrections should be submitted to TMDB directly, since that is where the catalog is maintained.</p>
            </>
          ),
        },
        { heading: "Counter notices", body: <p>If content you posted was removed in error, you may send a counter notice with the same identifying information and a statement that you have a good-faith belief the removal was a mistake.</p> },
      ]}
    />
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({ props: { messages: await getPageMessages(locale, ["Legal"]) } });
