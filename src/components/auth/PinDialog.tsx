import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Lock, X } from "lucide-react";
import type { Profile } from "@/lib/store";
import { hashPin } from "@/lib/profile";
import { PinPad } from "./PinPad";
import { Avatar } from "./Avatar";

/** Asks for a locked profile's PIN before it can be opened. */
export function PinDialog({ profile, onVerified, onClose }: { profile: Profile; onVerified: () => void; onClose: () => void }) {
  const t = useTranslations("Account");
  const [tick, setTick] = useState(0);
  const [wrong, setWrong] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const check = async (pin: string) => {
    if ((await hashPin(pin, profile.id)) === profile.pinHash) onVerified();
    else {
      setWrong(true);
      setTick((n) => n + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-page-enter" role="dialog" aria-modal="true" aria-label={t("pin_enter_title")} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="control-3d relative w-full max-w-sm rounded-[20px] p-7 text-center shadow-2xl animate-pane-enter">
        <button type="button" onClick={onClose} className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-full text-text-mid hover:bg-white/[0.07] hover:text-text-hi" aria-label={t("cancel")}>
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="mx-auto flex w-fit flex-col items-center gap-3">
          <div className="relative">
            <Avatar profile={profile} className="h-20 w-20" rounded="rounded-[18px]" textClass="text-3xl" />
            <span className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-neo-bg text-text-hi">
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </div>
          <h2 className="text-lg font-semibold text-text-hi">{t("pin_enter_title")}</h2>
        </div>
        <p className="mt-1 text-[13px] text-text-mid">{t("pin_verify_sub", { name: profile.name })}</p>
        <div className="mt-6">
          <PinPad label={t("pin_label")} onComplete={check} errorTick={tick} />
        </div>
        <p className="mt-4 h-5 text-[12.5px] text-accent-hi" role="alert">
          {wrong ? t("pin_wrong") : ""}
        </p>
      </div>
    </div>
  );
}
