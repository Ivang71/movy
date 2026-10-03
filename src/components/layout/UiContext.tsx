import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface UiState {
  searchOpen: boolean;
  authOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  openAuth: () => void;
  closeAuth: () => void;
  toast: (message: string) => void;
  toastMessage: string | null;
}

const UiContext = createContext<UiState | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toast = useCallback((message: string) => {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage((m) => (m === message ? null : m)), 2400);
  }, []);

  const value = useMemo<UiState>(
    () => ({
      searchOpen,
      authOpen,
      openSearch: () => setSearchOpen(true),
      closeSearch: () => setSearchOpen(false),
      openAuth: () => setAuthOpen(true),
      closeAuth: () => setAuthOpen(false),
      toast,
      toastMessage,
    }),
    [searchOpen, authOpen, toast, toastMessage],
  );
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi(): UiState {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within UiProvider");
  return ctx;
}
