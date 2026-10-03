import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Copy, Crown, LogOut, Send, Users } from "lucide-react";
import { getPageMessages } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useUi } from "@/components/layout/UiContext";
import { loadChat, loadRooms, saveChat, saveRooms, type ChatMessage, type Room } from "@/lib/rooms";
import { Seo } from "@/components/layout/Seo";
import { PageLoader } from "@/components/ui/BrandLoader";
import { tmdbImage } from "@/lib/images";
import { cx } from "@/lib/format";

export default function WatchPartyRoom() {
  const t = useTranslations("WatchParty");
  const tp = useTranslations("Player");
  const router = useRouter();
  const id = String(router.query.roomId ?? "").toUpperCase();
  const { profile, ready } = useStore();
  const { toast } = useUi();
  const [room, setRoom] = useState<Room | null | undefined>(undefined);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const [text, setText] = useState("");
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    const r = loadRooms().find((x) => x.id === id) ?? null;
    setRoom(r);
    if (r) {
      const existing = loadChat(id);
      setChat(existing);
      if (profile && !r.participants.includes(profile.name)) {
        const updated = { ...r, participants: [...r.participants, profile.name] };
        saveRooms(loadRooms().map((x) => (x.id === id ? updated : x)));
        setRoom(updated);
        const sys: ChatMessage = { id: `${Date.now()}`, author: profile.name, text: t("user_joined"), at: Date.now(), system: true };
        const next = [...existing, sys];
        setChat(next);
        saveChat(id, next);
      }
    }
  }, [id, profile, t]);

  useEffect(() => {
    bottom.current?.scrollIntoView({ block: "end" });
  }, [chat.length]);

  if (!ready || room === undefined) return <PageLoader />;
  if (!room) {
    return (
      <div className="layout-container flex min-h-dvh flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold text-text-hi">{t("room_not_found")}</h1>
        <Link href="/watchparty" className="mt-5 control-3d inline-flex h-10 items-center rounded-full px-5 text-[13px] font-medium text-text-hi">
          {t("back")}
        </Link>
      </div>
    );
  }

  const isOwner = profile?.name === room.owner;
  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !profile) return;
    const msg: ChatMessage = { id: `${Date.now()}${Math.random().toString(36).slice(2, 5)}`, author: profile.name, text: text.trim(), at: Date.now() };
    const next = [...chat, msg];
    setChat(next);
    saveChat(room.id, next);
    setText("");
  };
  const leave = () => {
    if (!window.confirm(t("leave_room_confirmation").replace(/<[^>]+>/g, ""))) return;
    const rooms = loadRooms();
    if (isOwner || room.participants.length <= 1) saveRooms(rooms.filter((r) => r.id !== room.id));
    else saveRooms(rooms.map((r) => (r.id === room.id ? { ...r, participants: r.participants.filter((p) => p !== profile?.name) } : r)));
    router.push("/watchparty");
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(room.id);
      toast(t("room_id_copied"));
    } catch {
      toast(room.id);
    }
  };
  const backdrop = tmdbImage(room.video.backdrop, "w1280");
  const watchHref = `${room.video.slug}${room.season ? `/${room.season}/${room.episode ?? 1}` : ""}?play=true`;

  return (
    <>
      <Seo title={`${room.name} · ${t("watch_party")}`} path={`/watchparty/${room.id}`} noindex />
      <div className="layout-container pt-[84px] md:pt-[100px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <p className="text-[11px] font-medium uppercase tracking-wide text-text-mid">{t("watch_party")}</p>
            <h1 className="truncate text-2xl font-semibold text-text-hi">{room.name}</h1>
            <p className="text-[13px] text-text-mid">{isOwner ? t("you_are_owner") : t("only_owner_controls")}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={copy} className="control-3d inline-flex h-9 items-center gap-1.5 rounded-[12px] px-3.5 text-[12.5px] font-medium text-text-hi">
              <Copy className="h-4 w-4" aria-hidden="true" />
              {t("copy_room_id")} <span className="font-mono text-text-mid">{room.id}</span>
            </button>
            <button type="button" onClick={leave} className="control-3d inline-flex h-9 items-center gap-1.5 rounded-[12px] px-3.5 text-[12.5px] font-medium text-accent-hi">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              {t("leave_room")}
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="relative aspect-video overflow-hidden rounded-[14px] border border-white/[0.08] bg-black">
              {backdrop ? <img src={backdrop} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" /> : null}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 p-5">
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-text-mid">{tp("watching")}</p>
                  <h2 className="truncate text-xl font-semibold text-white">
                    {room.video.title}
                    {room.season ? <span className="text-text-mid"> · S{room.season} E{room.episode ?? 1}</span> : null}
                  </h2>
                </div>
                <Link href={watchHref} className="inline-flex h-10 items-center rounded-full bg-text-hi px-5 text-[13px] font-semibold text-[#05070a] hover:bg-white">
                  {tp("servers")}
                </Link>
              </div>
            </div>
            <p className="mt-3 text-[12px] text-text-mid">{t("offline_note")}</p>
          </div>

          <aside className="flex h-[520px] flex-col overflow-hidden rounded-[14px] border border-white/[0.08] bg-surface-1/70 lg:h-auto">
            <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-3">
              <h2 className="text-sm font-semibold text-text-hi">{t("chat")}</h2>
              <span className="inline-flex items-center gap-1.5 text-[12px] text-text-mid">
                <Users className="h-4 w-4" aria-hidden="true" />
                {room.participants.length} {t("participants")}
              </span>
            </div>
            <ul className="flex flex-wrap gap-1.5 border-b border-white/[0.06] px-4 py-2">
              {room.participants.map((p) => (
                <li key={p} className="inline-flex items-center gap-1 rounded-full bg-white/[0.06] px-2 py-0.5 text-[11.5px] text-text-hi">
                  {p === room.owner ? <Crown className="h-3 w-3 text-amber-400" aria-hidden="true" /> : null}
                  {p === profile?.name ? t("you") : p}
                </li>
              ))}
            </ul>
            <div className="flex-1 space-y-3 overflow-y-auto scrollbar-styles px-4 py-3">
              {!chat.length ? <p className="py-10 text-center text-[13px] text-text-mid">{t("start_chatting")}</p> : null}
              {chat.map((m) => (
                <div key={m.id} className={cx("text-[13px]", m.system && "text-center text-[12px] text-text-mid")}>
                  {m.system ? (
                    <span>
                      {m.author} {m.text}
                    </span>
                  ) : (
                    <>
                      <span className={cx("font-semibold", m.author === profile?.name ? "text-primary" : "text-text-hi")}>{m.author === profile?.name ? t("you") : m.author}</span>
                      <span className="text-text-hi/90"> {m.text}</span>
                    </>
                  )}
                </div>
              ))}
              <div ref={bottom} />
            </div>
            <form onSubmit={send} className="flex items-center gap-2 border-t border-white/[0.06] p-3">
              <input value={text} onChange={(e) => setText(e.target.value)} placeholder={t("type_message")} className="h-10 flex-1 rounded-[10px] border border-white/10 bg-black/30 px-3 text-sm text-text-hi placeholder:text-text-mid/70 focus:border-primary/60 focus:outline-hidden" />
              <button type="submit" className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-text-hi text-[#05070a] hover:bg-white" aria-label="Send">
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </aside>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({ props: { messages: await getPageMessages(locale, ["WatchParty", "Player"]) } });
