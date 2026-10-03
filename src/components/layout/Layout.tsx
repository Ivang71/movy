import { type ReactNode } from "react";
import { useRouter } from "next/router";
import { Header } from "./Header";
import { Dock } from "./Dock";
import { Footer } from "./Footer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { AuthModal } from "@/components/auth/AuthModal";
import { Toast } from "@/components/ui/Toast";
import { ListPicker } from "@/components/watch/ListPicker";

export function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <>
      <Header />
      <Dock />
      <div>
        <div className="overflow-x-hidden scrollbar-styles">
          <div className="relative flex flex-col min-h-dvh">
            <main key={router.pathname} className="relative z-[1] flex-1 animate-page-enter pb-28 md:pb-8 md:pt-0">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </div>
      <SearchOverlay />
      <AuthModal />
      <ListPicker />
      <Toast />
    </>
  );
}
