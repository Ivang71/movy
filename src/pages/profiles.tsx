import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Pencil, Plus, X } from "lucide-react";
import { getPageMessages } from "@/lib/i18n";
import { AVATAR_COLORS, useStore } from "@/lib/store";
import { Seo } from "@/components/layout/Seo";
import { cx } from "@/lib/format";

export default function ProfilesPage() {
  const t = useTranslations("Account");
  const tm = useTranslations("Meta");
  const router = useRouter();
  const { ready, profiles, profile, selectProfile, removeProfile, createProfile } = useStore();
  const [manage, setManage] = useState(false);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState(AVATAR_COLORS[1]);
  const [error, setError] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError(t("name_required"));
      return;
    }
    createProfile(name, color);
    setName("");
    setAdding(false);
    setError(null);
  };

  return (
    <>
      <Seo title={tm("profiles_title")} path="/profiles" noindex />
      <div className="layout-container flex min-h-dvh flex-col items-center justify-center py-28 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">{t("who_is_watching")}</h1>
        <p className="mt-3 text-sm text-text-mid">{t("local_note")}</p>
        <div className="mt-10 flex flex-wrap items-start justify-center gap-6 md:gap-8">
          {ready
            ? profiles.map((p) => (
                <div key={p.id} className="relative flex w-28 flex-col items-center gap-3 md:w-36">
                  <button
                    type="button"
                    onClick={() => {
                      selectProfile(p.id);
                      if (!manage) router.push("/");
                    }}
                    className={cx("group flex aspect-square w-full items-center justify-center rounded-[18px] text-4xl font-bold text-white transition-transform hover:scale-[1.04] md:text-5xl", profile?.id === p.id ? "ring-2 ring-white ring-offset-4 ring-offset-neo-bg" : "ring-1 ring-white/10")}
                    style={{ background: p.color }}
                    aria-label={p.name}
                  >
                    {p.name.slice(0, 1).toUpperCase()}
                  </button>
                  <span className="truncate text-sm text-text-hi">{p.name}</span>
                  {manage ? (
                    <button type="button" onClick={() => removeProfile(p.id)} className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-lg" aria-label={`Remove ${p.name}`}>
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ) : null}
                </div>
              ))
            : null}
          <button type="button" onClick={() => setAdding(true)} className="flex w-28 flex-col items-center gap-3 md:w-36">
            <span className="flex aspect-square w-full items-center justify-center rounded-[18px] border border-dashed border-white/20 bg-white/[0.03] text-text-mid transition-colors hover:border-white/40 hover:text-text-hi">
              <Plus className="h-10 w-10" aria-hidden="true" />
            </span>
            <span className="text-sm text-text-mid">{t("add_profile")}</span>
          </button>
        </div>
        {profiles.length ? (
          <button type="button" onClick={() => setManage((m) => !m)} className={cx("control-3d mt-12 inline-flex h-10 items-center gap-2 rounded-full px-5 text-[13px] font-medium", manage ? "text-primary" : "text-text-hi")}>
            <Pencil className="h-4 w-4" aria-hidden="true" />
            {manage ? t("switch_profile") : t("manage_profiles")}
          </button>
        ) : null}

        {adding ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" onMouseDown={(e) => e.target === e.currentTarget && setAdding(false)}>
            <form onSubmit={submit} className="control-3d w-full max-w-sm rounded-[20px] p-6 text-left animate-pane-enter">
              <h2 className="text-lg font-semibold text-text-hi">{t("add_profile")}</h2>
              <label className="mt-4 flex flex-col gap-1.5 text-[12px] font-medium text-text-mid">
                {t("profile_name")}
                <input autoFocus value={name} onChange={(e) => setName(e.target.value)} className="h-11 rounded-[12px] border border-white/10 bg-black/30 px-3.5 text-sm text-text-hi focus:border-primary/60 focus:outline-hidden" />
              </label>
              <p className="mt-4 text-[12px] font-medium text-text-mid">{t("pick_avatar")}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {AVATAR_COLORS.map((c) => (
                  <button key={c} type="button" onClick={() => setColor(c)} aria-pressed={color === c} aria-label={c} className={cx("h-9 w-9 rounded-[10px] transition-transform", color === c ? "ring-2 ring-white ring-offset-2 ring-offset-[#161618] scale-105" : "hover:scale-105")} style={{ background: c }} />
                ))}
              </div>
              {error ? <p className="mt-3 text-[12.5px] text-accent-hi">{error}</p> : null}
              <div className="mt-6 flex justify-end gap-2">
                <button type="button" onClick={() => setAdding(false)} className="control-3d h-10 rounded-full px-4 text-[13px] font-medium text-text-hi">
                  {t("back_to_avatars")}
                </button>
                <button type="submit" className="h-10 rounded-full bg-text-hi px-5 text-[13px] font-semibold text-[#05070a] hover:bg-white">
                  {t("create_profile")}
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({ props: { messages: await getPageMessages(locale) } });
