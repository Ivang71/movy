import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Inter, Press_Start_2P } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { Layout } from "@/components/layout/Layout";
import { UiProvider } from "@/components/layout/UiContext";
import { RouteProgress } from "@/components/layout/RouteProgress";
import { StoreProvider } from "@/lib/store";

const inter = Inter({ subsets: ["latin", "latin-ext", "cyrillic"], variable: "--font-inter", display: "swap" });
const pressStart = Press_Start_2P({ weight: "400", subsets: ["latin"], variable: "--font-press-start", display: "swap" });

type PageProps = { messages?: Record<string, unknown>; bare?: boolean };

export default function App({ Component, pageProps }: AppProps<PageProps>) {
  const router = useRouter();
  const locale = router.locale ?? "en";
  const bare = Boolean(pageProps.bare);
  return (
    <NextIntlClientProvider locale={locale} messages={pageProps.messages ?? {}} timeZone="UTC" onError={() => undefined} getMessageFallback={({ key }) => key.split(".").pop() ?? key}>
      <style jsx global>{`
        :root {
          --font-inter: ${inter.style.fontFamily};
          --font-press-start: ${pressStart.style.fontFamily};
        }
      `}</style>
      <div className={`${inter.variable} ${pressStart.variable} font-sans`}>
        <StoreProvider>
          <UiProvider>
            <RouteProgress />
            {bare ? (
              <Component {...pageProps} />
            ) : (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            )}
          </UiProvider>
        </StoreProvider>
      </div>
    </NextIntlClientProvider>
  );
}
