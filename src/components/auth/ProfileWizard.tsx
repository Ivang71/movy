import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Check, ImagePlus, Trash2 } from "lucide-react";
import { genreOptions } from "@/lib/genres";
import { AVATAR_COLORS, AVATAR_ICONS, PIN_LENGTH, emptyInterests, imageToAvatar, type AvatarSpec, type Interests } from "@/lib/profile";
import type { Profile } from "@/lib/store";
import { cx } from "@/lib/format";
import { PinPad } from "./PinPad";
import { Avatar } from "./Avatar";

type Step = "name" | "avatar" | "movie" | "tv" | "pin";
const ORDER: Step[] = ["name", "avatar", "movie", "tv", "pin"];

export interface WizardResult {
  name: string;
  color: string;
  avatar?: AvatarSpec;
  interests: Interests;
  /** undefined = leave as is, null = remove, string = the new 4-digit PIN (hashed by the caller). */
  pin?: string | null;
}

interface Props {
  /** Existing profile when editing. */
  initial?: Profile;
  startAt?: Step;
  existingNames: string[];
  onSubmit: (r: WizardResult) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function ProfileWizard({ initial, startAt = "name", existingNames, onSubmit, onCancel, onDelete }: Props) {
  const t = useTranslations("Account");
  const editing = Boolean(initial);
  const [step, setStep] = useState<Step>(startAt);
  const [name, setName] = useState(initial?.name ?? "");
  const [color, setColor] = useState(initial?.color ?? AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]);
  const [avatar, setAvatar] = useState<AvatarSpec | undefined>(initial?.avatar);
  const [interests, setInterests] = useState<Interests>(initial?.interests ?? emptyInterests());
  const [pin, setPin] = useState<string | null>(null);
  const [pinOff, setPinOff] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const file = useRef<HTMLInputElement>(null);

  const idx = ORDER.indexOf(step);
  const last = idx === ORDER.length - 1;
  const preview = { name: name || "?", color, avatar };

  const validate = (): boolean => {
    if (step === "name") {
      const clean = name.trim();
      if (clean.length < 2) return setError(t("name_required")), false;
      if (existingNames.some((n) => n.toLowerCase() === clean.toLowerCase() && n.toLowerCase() !== initial?.name.toLowerCase())) return setError(t("profile_name_taken")), false;
    }
    setError(null);
    return true;
  };

  const finish = (withPin: string | null) => {
    onSubmit({ name: name.trim(), color, avatar, interests, pin: pinOff ? null : (withPin ?? undefined) });
  };

  const next = () => {
    if (!validate()) return;
    if (last) finish(pin);
    else setStep(ORDER[idx + 1]);
  };
  const back = () => (idx === 0 || (editing && step === startAt) ? onCancel() : setStep(ORDER[idx - 1]));

  const toggleGenre = (kind: "movie" | "tv", id: number) =>
    setInterests((cur) => ({ ...cur, [kind]: cur[kind].includes(id) ? cur[kind].filter((g) => g !== id) : [...cur[kind], id] }));

  const upload = async (f?: File) => {
    if (!f) return;
    try {
      setAvatar({ kind: "image", src: await imageToAvatar(f) });
      setError(null);
    } catch {
      setError(t("upload_failed"));
    }
  };

  const titleKey = { name: "profile_create_title", avatar: "profile_avatar_title", movie: "profile_movie_interests_title", tv: "profile_tv_interests_title", pin: "profile_pin_title" }[step];
  const subKey = { name: "profile_create_sub", avatar: "profile_avatar_sub", movie: "profile_movie_interests_sub", tv: "profile_tv_interests_sub", pin: "profile_pin_sub" }[step];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {ORDER.map((s, i) => (
          <span key={s} className={cx("h-1 rounded-full transition-all", i === idx ? "w-8 bg-primary" : i < idx ? "w-4 bg-white/50" : "w-4 bg-white/15")} />
        ))}
      </div>
      <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.14em] text-text-mid">{t("step_of", { n: idx + 1, total: ORDER.length })}</p>
      <div className="mt-6">
        <Avatar profile={preview} className="h-24 w-24" rounded="rounded-[22px]" textClass="text-4xl" />
      </div>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-4xl">{editing && step === "name" ? t("edit_profile") : t(titleKey)}</h1>
      <p className="mt-2 max-w-md text-sm text-text-mid">{t(subKey)}</p>

      <div className="mt-8 w-full">
        {step === "name" ? (
          <input autoFocus value={name} onChange={(e) => (setName(e.target.value.slice(0, 20)), setError(null))} onKeyDown={(e) => e.key === "Enter" && next()} placeholder={t("profile_name_placeholder")} className="mx-auto block h-12 w-full max-w-sm rounded-[14px] border border-white/10 bg-black/30 px-4 text-center text-base text-text-hi placeholder:text-text-mid/70 focus:border-primary/60 focus:outline-hidden" />
        ) : null}

        {step === "avatar" ? (
          <div className="flex flex-col items-center gap-6">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-mid">{t("classics")}</p>
              <div className="grid grid-cols-5 gap-3 sm:grid-cols-10">
                {Object.keys(AVATAR_ICONS).map((key) => {
                  const on = avatar?.kind === "icon" && avatar.icon === key;
                  return (
                    <button key={key} type="button" onClick={() => setAvatar({ kind: "icon", icon: key, color })} aria-pressed={on} aria-label={key} className={cx("rounded-[14px] transition-transform hover:scale-105", on && "ring-2 ring-white ring-offset-2 ring-offset-neo-bg")}>
                      <Avatar profile={{ name: key, color, avatar: { kind: "icon", icon: key, color } }} className="h-12 w-12" rounded="rounded-[14px]" />
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-mid">{t("avatar_colour")}</p>
              <div className="flex flex-wrap justify-center gap-2.5">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={c}
                    aria-pressed={color === c}
                    onClick={() => {
                      setColor(c);
                      if (avatar?.kind === "icon") setAvatar({ ...avatar, color: c });
                    }}
                    className={cx("h-9 w-9 rounded-[10px] transition-transform", color === c ? "scale-105 ring-2 ring-white ring-offset-2 ring-offset-neo-bg" : "hover:scale-105")}
                    style={{ background: c }}
                  />
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input ref={file} type="file" accept="image/*" className="sr-only" onChange={(e) => upload(e.target.files?.[0])} />
              <button type="button" onClick={() => file.current?.click()} className="control-3d inline-flex h-10 items-center gap-2 rounded-full px-5 text-[13px] font-medium text-text-hi">
                <ImagePlus className="h-4 w-4" aria-hidden="true" />
                {avatar?.kind === "image" ? t("change_avatar") : t("upload_avatar")}
              </button>
              {avatar ? (
                <button type="button" onClick={() => setAvatar(undefined)} className="inline-flex h-10 items-center rounded-full px-4 text-[13px] text-text-mid hover:text-text-hi">
                  {t("reset")}
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {step === "movie" || step === "tv" ? (
          <div>
            <div className="flex flex-wrap justify-center gap-2.5">
              {genreOptions(step).map((g) => {
                const on = interests[step].includes(g.id);
                return (
                  <button key={g.id} type="button" onClick={() => toggleGenre(step, g.id)} aria-pressed={on} className={cx("inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-[13px] font-medium transition-colors", on ? "border-white/40 bg-white text-[#05070a]" : "control-3d text-text-hi")}>
                    {on ? <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" /> : null}
                    {g.name}
                  </button>
                );
              })}
            </div>
            <p className="mt-4 text-[12.5px] text-text-mid">{t("interests_selected", { count: interests[step].length })}</p>
          </div>
        ) : null}

        {step === "pin" ? (
          <div className="flex flex-col items-center gap-4">
            {initial?.pinHash && !pinOff ? (
              <>
                <p className="text-[13px] text-text-hi">{t("pin_set")}</p>
                <button type="button" onClick={() => setPinOff(true)} className="control-3d inline-flex h-10 items-center gap-2 rounded-full px-5 text-[13px] font-medium text-accent-hi">
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  {t("pin_disable")}
                </button>
              </>
            ) : null}
            {!initial?.pinHash || pinOff ? (
              <PinPad
                label={t("pin_label")}
                autoFocus={false}
                onComplete={(p) => {
                  setPin(p);
                  setPinOff(false);
                }}
              />
            ) : null}
            {pin ? <p className="text-[12.5px] text-emerald-400">{t("pin_set")}</p> : null}
            <p className="text-[12px] text-text-mid/80">{t("pin_length_hint", { n: PIN_LENGTH })}</p>
          </div>
        ) : null}

        <p className="mt-4 h-5 text-[12.5px] text-accent-hi" role="alert">
          {error ?? ""}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button type="button" onClick={back} className="control-3d inline-flex h-11 items-center gap-2 rounded-full px-5 text-[13px] font-medium text-text-hi">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {idx === 0 || (editing && step === startAt) ? t("cancel") : t("back_step")}
        </button>
        {step === "movie" || step === "tv" || step === "pin" ? (
          <button type="button" onClick={() => (last ? finish(null) : setStep(ORDER[idx + 1]))} className="inline-flex h-11 items-center rounded-full px-4 text-[13px] text-text-mid hover:text-text-hi">
            {t("skip_step")}
          </button>
        ) : null}
        <button type="button" onClick={next} className="inline-flex h-11 items-center rounded-full bg-text-hi px-7 text-[13px] font-semibold text-[#05070a] transition-colors hover:bg-white">
          {last ? (editing ? t("save_changes") : t("finish_step")) : t("continue_step")}
        </button>
      </div>
      {editing && onDelete ? (
        <button type="button" onClick={onDelete} className="mt-8 inline-flex items-center gap-1.5 text-[12.5px] text-text-mid transition-colors hover:text-accent-hi">
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {t("delete_profile")}
        </button>
      ) : null}
    </div>
  );
}
