import { AVATAR_ICONS } from "@/lib/profile";
import type { Profile } from "@/lib/store";
import { cx } from "@/lib/format";

interface Props {
  profile: Pick<Profile, "name" | "color" | "avatar">;
  /** Tailwind size classes, e.g. "h-6 w-6". */
  className?: string;
  /** Rounded corners; the profile picker uses larger radii. */
  rounded?: string;
  textClass?: string;
}

/** Profile avatar: uploaded image, glyph on a gradient, or the first letter on a solid colour. */
export function Avatar({ profile, className = "h-6 w-6", rounded = "rounded-[7px]", textClass = "text-[11px]" }: Props) {
  const a = profile.avatar;
  if (a?.kind === "image") {
    return <img src={a.src} alt="" className={cx("shrink-0 object-cover", className, rounded)} draggable={false} />;
  }
  if (a?.kind === "icon") {
    const Icon = AVATAR_ICONS[a.icon];
    if (Icon)
      return (
        <span className={cx("flex shrink-0 items-center justify-center text-white", className, rounded)} style={{ background: `linear-gradient(135deg, ${a.color}, color-mix(in srgb, ${a.color} 55%, #05070a))` }} aria-hidden="true">
          <Icon className="h-[58%] w-[58%]" strokeWidth={2.2} />
        </span>
      );
  }
  return (
    <span className={cx("flex shrink-0 items-center justify-center font-bold text-white", className, rounded, textClass)} style={{ background: profile.color }} aria-hidden="true">
      {profile.name.slice(0, 1).toUpperCase()}
    </span>
  );
}
