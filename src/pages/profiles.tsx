import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Lock, Pencil, Plus } from "lucide-react";
import { getPageMessages } from "@/lib/i18n";
import { MAX_PROFILES, hashPin } from "@/lib/profile";
import { useStore, type Profile } from "@/lib/store";
import { useUi } from "@/components/layout/UiContext";
import { Seo } from "@/components/layout/Seo";
import { Avatar } from "@/components/auth/Avatar";
import { PinDialog } from "@/components/auth/PinDialog";
import { ProfileWizard, type WizardResult } from "@/components/auth/ProfileWizard";
import { PageLoader } from "@/components/ui/BrandLoader";
import { cx } from "@/lib/format";

type View = { mode: "pick" } | { mode: "create" } | { mode: "edit"; id: string; startAt?: "name" | "avatar" };

export default function ProfilesPage() {
  const t = useTranslations("Account");
  const tm = useTranslations("Meta");
  const router = useRouter();
  const { ready, profiles, profile, selectProfile, removeProfile, createProfile, updateProfile } = useStore();
  const { toast } = useUi();
  const [view, setView] = useState<View>({ mode: "pick" });
  const [manage, setManage] = useState(false);
  const [locked, setLocked] = useState<Profile | null>(null);

  // Arriving from sign-up: continue setup of the profile that was just created.
  useEffect(() => {
    const id = router.query.setup;
    if (ready && typeof id === "string" && profiles.some((p) => p.id === id)) setView({ mode: "edit", id, startAt: "avatar" });
  }, [ready, router.query.setup, profiles]);

  const open = (p: Profile) => {
    if (manage) return setView({ mode: "edit", id: p.id });
    if (p.pinHash && p.id !== profile?.id) return setLocked(p);
    selectProfile(p.id);
    router.push("/");
  };

  const submitCreate = async (r: WizardResult) => {
    const made = createProfile(r.name, r.color, { avatar: r.avatar, interests: r.interests });
    if (!made) return toast(t("profile_limit"));
    if (r.pin) updateProfile(made.id, { pinHash: await hashPin(r.pin, made.id) });
    toast(t("profile_saved"));
    router.push("/");
  };

  const submitEdit = async (id: string, r: WizardResult) => {
    const pinPatch = r.pin === null ? { pinHash: undefined } : r.pin ? { pinHash: await hashPin(r.pin, id) } : {};
    updateProfile(id, { name: r.name, color: r.color, avatar: r.avatar, interests: r.interests, ...pinPatch });
    toast(t("profile_saved"));
    setView({ mode: "pick" });
    setManage(false);
    if (router.query.setup) router.replace("/profiles", undefined, { shallow: true });
  };

  if (!ready) return <PageLoader />;

  const names = profiles.map((p) => p.name);
  const editing = view.mode === "edit" ? profiles.find((p) => p.id === view.id) : undefined;

  return (
    <>
      <Seo title={tm("profiles_title")} path="/profiles" noindex />
      <div className="layout-container flex min-h-dvh flex-col items-center justify-center py-28 text-center">
        {view.mode === "create" ? (
          <ProfileWizard existingNames={names} onSubmit={(r) => void submitCreate(r)} onCancel={() => setView({ mode: "pick" })} />
        ) : view.mode === "edit" && editing ? (
          <ProfileWizard
            key={editing.id}
            initial={editing}
            startAt={view.startAt}
            existingNames={names}
            onSubmit={(r) => void submitEdit(editing.id, r)}
            onCancel={() => {
              setView({ mode: "pick" });
              if (router.query.setup) router.replace("/profiles", undefined, { shallow: true });
            }}
            onDelete={() => {
              if (!window.confirm(t("delete_profile_confirm"))) return;
              removeProfile(editing.id);
              toast(t("profile_deleted"));
              setView({ mode: "pick" });
            }}
          />
        ) : (
          <>
            <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">{t("who_is_watching")}</h1>
            <p className="mt-3 text-sm text-text-mid">{t("local_note")}</p>
            <div className="mt-10 flex flex-wrap items-start justify-center gap-6 md:gap-8">
              {profiles.map((p) => (
                <div key={p.id} className="relative flex w-28 flex-col items-center gap-3 md:w-36">
                  <button type="button" onClick={() => open(p)} className={cx("group relative aspect-square w-full overflow-hidden rounded-[18px] transition-transform hover:scale-[1.04]", profile?.id === p.id ? "ring-2 ring-white ring-offset-4 ring-offset-neo-bg" : "ring-1 ring-white/10")} aria-label={p.name}>
                    <Avatar profile={p} className="h-full w-full" rounded="rounded-[18px]" textClass="text-4xl md:text-5xl" />
                    {manage ? (
                      <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-white">
                        <Pencil className="h-7 w-7" aria-hidden="true" />
                      </span>
                    ) : null}
                    {p.pinHash && !manage ? (
                      <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white">
                        <Lock className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </button>
                  <span className="max-w-full truncate text-sm text-text-hi">{p.name}</span>
                </div>
              ))}
              {profiles.length < MAX_PROFILES ? (
                <button type="button" onClick={() => setView({ mode: "create" })} className="flex w-28 flex-col items-center gap-3 md:w-36">
                  <span className="flex aspect-square w-full items-center justify-center rounded-[18px] border border-dashed border-white/20 bg-white/[0.03] text-text-mid transition-colors hover:border-white/40 hover:text-text-hi">
                    <Plus className="h-10 w-10" aria-hidden="true" />
                  </span>
                  <span className="text-sm text-text-mid">{t("add_profile")}</span>
                </button>
              ) : (
                <p className="w-full text-[12.5px] text-text-mid">{t("profile_limit")}</p>
              )}
            </div>
            {profiles.length ? (
              <button type="button" onClick={() => setManage((m) => !m)} className={cx("control-3d mt-12 inline-flex h-10 items-center gap-2 rounded-full px-5 text-[13px] font-medium", manage ? "text-primary" : "text-text-hi")}>
                <Pencil className="h-4 w-4" aria-hidden="true" />
                {manage ? t("done") : t("manage_profiles")}
              </button>
            ) : null}
          </>
        )}
      </div>
      {locked ? (
        <PinDialog
          profile={locked}
          onClose={() => setLocked(null)}
          onVerified={() => {
            selectProfile(locked.id);
            setLocked(null);
            router.push("/");
          }}
        />
      ) : null}
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({ props: { messages: await getPageMessages(locale) } });
