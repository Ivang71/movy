import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Eye, EyeOff, X } from "lucide-react";
import { useUi } from "@/components/layout/UiContext";
import { AVATAR_COLORS, useStore } from "@/lib/store";
import { BrandMark } from "@/components/ui/BrandMark";
import { cx } from "@/lib/format";

type Mode = "login" | "register";

export function AuthModal() {
  const t = useTranslations("Account");
  const { authOpen, closeAuth, toast } = useUi();
  const { profiles, createProfile, selectProfile } = useStore();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [color, setColor] = useState(AVATAR_COLORS[0]);
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeAuth();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [authOpen, closeAuth]);

  useEffect(() => {
    if (!authOpen) {
      setError(null);
      setPassword("");
      setConfirm("");
    }
  }, [authOpen]);

  if (!authOpen) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const clean = name.trim();
    if (clean.length < 2) {
      setError(t("name_required"));
      return;
    }
    if (mode === "register" && password !== confirm) {
      setError(t("unmatched_passwords"));
      return;
    }
    const existing = profiles.find((p) => p.name.toLowerCase() === clean.toLowerCase());
    if (existing) selectProfile(existing.id);
    else createProfile(clean, color);
    toast(t("welcome_back", { name: clean }));
    closeAuth();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm animate-page-enter md:items-center md:p-6" role="dialog" aria-modal="true" aria-label={t("my_account")} onMouseDown={(e) => e.target === e.currentTarget && closeAuth()}>
      <div className="control-3d relative w-full max-w-md rounded-t-[20px] p-6 text-text-hi shadow-2xl md:rounded-[20px] md:p-8 animate-pane-enter">
        <button type="button" onClick={closeAuth} className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-text-mid hover:bg-white/[0.07] hover:text-text-hi" aria-label="Close">
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-3">
          <BrandMark className="h-8 w-auto" />
          <h2 className="text-xl font-semibold">{mode === "login" ? t("login") : t("register")}</h2>
        </div>
        <p className="mt-2 text-[13px] text-text-mid">{t("sign_in_cta")}</p>

        <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
          <label className="flex flex-col gap-1.5 text-[12px] font-medium text-text-mid">
            {mode === "login" ? t("email_username") : t("username")}
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11 rounded-[12px] border border-white/10 bg-black/30 px-3.5 text-sm text-text-hi placeholder:text-text-mid/70 focus:border-primary/60 focus:outline-hidden"
              autoComplete="username"
              autoFocus
            />
          </label>
          <label className="flex flex-col gap-1.5 text-[12px] font-medium text-text-mid">
            {t("password")}
            <span className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={show ? "text" : "password"}
                className="h-11 w-full rounded-[12px] border border-white/10 bg-black/30 px-3.5 pr-11 text-sm text-text-hi focus:border-primary/60 focus:outline-hidden"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-text-mid hover:text-text-hi" aria-label={show ? "Hide password" : "Show password"}>
                {show ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </button>
            </span>
          </label>
          {mode === "register" ? (
            <>
              <label className="flex flex-col gap-1.5 text-[12px] font-medium text-text-mid">
                {t("confirm_password")}
                <input value={confirm} onChange={(e) => setConfirm(e.target.value)} type={show ? "text" : "password"} className="h-11 rounded-[12px] border border-white/10 bg-black/30 px-3.5 text-sm text-text-hi focus:border-primary/60 focus:outline-hidden" autoComplete="new-password" />
              </label>
              <div className="flex flex-col gap-1.5 text-[12px] font-medium text-text-mid">
                {t("pick_avatar")}
                <div className="flex flex-wrap gap-2">
                  {AVATAR_COLORS.map((c) => (
                    <button key={c} type="button" onClick={() => setColor(c)} aria-label={c} aria-pressed={color === c} className={cx("h-8 w-8 rounded-[9px] transition-transform", color === c ? "ring-2 ring-white ring-offset-2 ring-offset-[#161618] scale-105" : "hover:scale-105")} style={{ background: c }} />
                  ))}
                </div>
              </div>
            </>
          ) : null}
          {error ? <p className="text-[12.5px] text-accent-hi">{error}</p> : null}
          <button type="submit" className="mt-2 h-11 rounded-full bg-text-hi text-sm font-semibold text-[#05070a] transition-colors hover:bg-white">
            {mode === "login" ? t("login") : t("create_profile")}
          </button>
          {mode === "login" ? (
            <button type="button" className="self-start text-[12px] text-text-mid hover:text-text-hi" onClick={() => toast(t("local_note"))}>
              {t("forgot_password")}
            </button>
          ) : null}
        </form>

        <p className="mt-5 text-center text-[12.5px] text-text-mid">
          {mode === "login" ? t("no_account") : t("have_account")}{" "}
          <button type="button" className="font-semibold text-text-hi hover:text-primary" onClick={() => setMode(mode === "login" ? "register" : "login")}>
            {mode === "login" ? t("register") : t("login")}
          </button>
        </p>
        <p className="mt-3 text-center text-[11px] text-text-mid/80">{t("local_note")}</p>
      </div>
    </div>
  );
}
