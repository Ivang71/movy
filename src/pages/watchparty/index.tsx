import type { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, KeyRound, Lock, PlusCircle, RefreshCw, Search, Users, Video } from "lucide-react";
import type { MediaItem } from "@/lib/types";
import { getPageMessages } from "@/lib/i18n";
import { useStore } from "@/lib/store";
import { useUi } from "@/components/layout/UiContext";
import { loadRooms, roomId, saveRooms, type Room } from "@/lib/rooms";
import { Seo } from "@/components/layout/Seo";
import { posterSrcSet } from "@/lib/images";
import { cx } from "@/lib/format";

type Step = "lobby" | "pick" | "configure" | "join";

export default function WatchPartyLobby() {
  const t = useTranslations("WatchParty");
  const tm = useTranslations("Meta");
  const router = useRouter();
  const { profile } = useStore();
  const { openAuth } = useUi();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [step, setStep] = useState<Step>("lobby");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MediaItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [video, setVideo] = useState<MediaItem | null>(null);
  const [name, setName] = useState("");
  const [isPrivate, setPrivate] = useState(false);
  const [password, setPassword] = useState("");
  const [joinId, setJoinId] = useState("");
  const [joinPw, setJoinPw] = useState("");
  const [error, setError] = useState<string | null>(null);

  const refresh = () => setRooms(loadRooms());
  useEffect(refresh, []);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    setSearching(true);
    const id = window.setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}&locale=${router.locale ?? "en"}`)
        .then((r) => r.json())
        .then((d: { items: MediaItem[] }) => setResults(d.items ?? []))
        .finally(() => setSearching(false));
    }, 320);
    return () => window.clearTimeout(id);
  }, [query, router.locale]);

  const requireProfile = (next: () => void) => {
    if (!profile) {
      openAuth();
      return;
    }
    next();
  };

  const create = (e: FormEvent) => {
    e.preventDefault();
    if (!video || !profile) return;
    if (isPrivate && !password) {
      setError(t("password_required_for_private"));
      return;
    }
    const room: Room = {
      id: roomId(),
      name: name.trim() || t("room_name_placeholder"),
      isPrivate,
      password: isPrivate ? password : undefined,
      owner: profile.name,
      video,
      season: video.mediaType !== "movie" ? 1 : undefined,
      episode: video.mediaType !== "movie" ? 1 : undefined,
      createdAt: Date.now(),
      participants: [profile.name],
    };
    saveRooms([room, ...loadRooms()]);
    router.push(`/watchparty/${room.id}`);
  };

  const join = (e: FormEvent) => {
    e.preventDefault();
    const room = loadRooms().find((r) => r.id === joinId.trim().toUpperCase());
    if (!room || (room.isPrivate && room.password !== joinPw)) {
      setError(t("room_not_found"));
      return;
    }
    router.push(`/watchparty/${room.id}`);
  };

  const publicRooms = rooms.filter((r) => !r.isPrivate);

  return (
    <>
      <Seo title={tm("watchparty_title")} description={t("watch_together_description")} path="/watchparty" />
      <div className="layout-container pt-[92px] md:pt-[112px]">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div className="flex gap-2.5">
            <span className="mt-1 w-[3px] self-stretch bg-primary" aria-hidden="true" />
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{t("watch_party")}</h1>
              <p className="mt-1 text-sm text-text-mid">{t("watch_together_description")}</p>
            </div>
          </div>
          <p className="text-[12px] text-text-mid/80">{t("offline_note")}</p>
        </div>

        {step === "lobby" ? (
          <>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <button type="button" onClick={() => requireProfile(() => setStep("pick"))} className="group control-3d flex items-center gap-4 rounded-[18px] p-5 text-left transition-transform hover:-translate-y-0.5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-primary/15 text-primary">
                  <PlusCircle className="h-6 w-6" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-base font-semibold text-text-hi">{t("create_watch_party")}</span>
                  <span className="block text-[13px] text-text-mid">{t("select_video")} → {t("configure_room")}</span>
                </span>
              </button>
              <button type="button" onClick={() => requireProfile(() => setStep("join"))} className="group control-3d flex items-center gap-4 rounded-[18px] p-5 text-left transition-transform hover:-translate-y-0.5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-white/[0.06] text-text-hi">
                  <KeyRound className="h-6 w-6" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-base font-semibold text-text-hi">{t("join_watch_party")}</span>
                  <span className="block text-[13px] text-text-mid">{t("join_by_room_id")}</span>
                </span>
              </button>
            </div>

            <section className="mt-12">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex gap-2.5">
                  <span className="mt-0.5 w-[3px] self-stretch bg-primary" aria-hidden="true" />
                  <h2 className="text-xl font-semibold text-text-hi md:text-2xl">{t("public_rooms")}</h2>
                </div>
                <button type="button" onClick={refresh} className="control-3d inline-flex h-9 items-center gap-1.5 rounded-[12px] px-3.5 text-[12.5px] font-medium text-text-hi">
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  {t("refresh")}
                </button>
              </div>
              {publicRooms.length ? (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {publicRooms.map((r) => {
                    const poster = posterSrcSet(r.video.poster);
                    return (
                      <button key={r.id} type="button" onClick={() => router.push(`/watchparty/${r.id}`)} className="control-3d flex gap-3 rounded-[16px] p-3 text-left">
                        <span className="relative aspect-[2/3] w-16 shrink-0 overflow-hidden rounded-[8px] bg-surface-2">{poster ? <img src={poster.src} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-text-hi">{r.name}</span>
                          <span className="block truncate text-[12px] text-text-mid">
                            {t("watching")}: {r.video.title}
                          </span>
                          <span className="mt-2 flex items-center gap-3 text-[11.5px] text-text-mid">
                            <span className="inline-flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" aria-hidden="true" />
                              {r.participants.length}
                            </span>
                            <span>
                              {t("by")} {r.owner}
                            </span>
                            <span className="ml-auto font-mono text-text-hi/70">{r.id}</span>
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-[16px] border border-dashed border-white/[0.12] py-16 text-center">
                  <Video className="mx-auto h-8 w-8 text-text-mid" aria-hidden="true" />
                  <p className="mt-3 text-base font-semibold text-text-hi">{t("no_public_rooms")}</p>
                  <p className="mt-1 text-sm text-text-mid">{t("create_room_instead")}</p>
                  <button type="button" onClick={() => requireProfile(() => setStep("pick"))} className="mt-5 inline-flex h-10 items-center rounded-full bg-text-hi px-5 text-[13px] font-semibold text-[#05070a] hover:bg-white">
                    {t("create_first_room")}
                  </button>
                </div>
              )}
            </section>
          </>
        ) : null}

        {step !== "lobby" ? (
          <button type="button" onClick={() => setStep(step === "configure" ? "pick" : "lobby")} className="mt-8 inline-flex items-center gap-1.5 text-[13px] text-text-mid hover:text-text-hi">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            {t("back")}
          </button>
        ) : null}

        {step === "pick" ? (
          <section className="mt-4 max-w-2xl">
            <h2 className="text-xl font-semibold text-text-hi">{t("select_video")}</h2>
            <p className="mt-1 text-sm text-text-mid">{t("search_hint")}</p>
            <label className="control-3d mt-4 flex h-12 items-center gap-3 rounded-[14px] px-4">
              <Search className="h-5 w-5 text-text-mid" aria-hidden="true" />
              <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("search_prompt")} className="h-full w-full bg-transparent text-sm text-text-hi placeholder:text-text-mid focus:outline-hidden" />
            </label>
            <ul className="mt-4 flex flex-col divide-y divide-white/[0.06] overflow-hidden rounded-[14px] border border-white/[0.06]">
              {searching ? <li className="p-4 text-sm text-text-mid">{t("searching")}…</li> : null}
              {!searching && query && !results.length ? <li className="p-4 text-sm text-text-mid">{t("try_another_search")}</li> : null}
              {results.slice(0, 10).map((m) => {
                const poster = posterSrcSet(m.poster);
                return (
                  <li key={`${m.mediaType}:${m.id}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setVideo(m);
                        setStep("configure");
                      }}
                      className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-white/[0.04]"
                    >
                      <span className="relative aspect-[2/3] w-10 shrink-0 overflow-hidden rounded-[6px] bg-surface-2">{poster ? <img src={poster.src} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}</span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-text-hi">{m.title}</span>
                        <span className="block text-[12px] text-text-mid">
                          {m.year} · {m.mediaType === "movie" ? t("movie") : m.mediaType === "anime" ? t("anime") : t("tv")}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}

        {step === "configure" && video ? (
          <form onSubmit={create} className="mt-4 max-w-xl">
            <h2 className="text-xl font-semibold text-text-hi">{t("configure_room")}</h2>
            <div className="control-3d mt-4 flex items-center gap-3 rounded-[14px] p-3">
              <span className="relative aspect-[2/3] w-12 overflow-hidden rounded-[6px] bg-surface-2">{posterSrcSet(video.poster) ? <img src={posterSrcSet(video.poster)!.src} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-text-hi">{video.title}</span>
                <span className="block text-[12px] text-text-mid">{video.year}</span>
              </span>
              <button type="button" onClick={() => setStep("pick")} className="text-[12.5px] font-medium text-text-mid hover:text-text-hi">
                {t("change")}
              </button>
            </div>
            <label className="mt-5 flex flex-col gap-1.5 text-[12px] font-medium text-text-mid">
              {t("room_name")}
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("room_name_placeholder")} className="h-11 rounded-[12px] border border-white/10 bg-black/30 px-3.5 text-sm text-text-hi placeholder:text-text-mid/60 focus:border-primary/60 focus:outline-hidden" />
              <span className="text-[11px] font-normal">{t("room_name_hint")}</span>
            </label>
            <label className="mt-5 flex items-start gap-3">
              <input type="checkbox" checked={isPrivate} onChange={(e) => setPrivate(e.target.checked)} className="mt-1 h-4 w-4 accent-[#dc2626]" />
              <span>
                <span className="flex items-center gap-1.5 text-sm font-medium text-text-hi">
                  <Lock className="h-4 w-4 text-text-mid" aria-hidden="true" />
                  {t("private_room")}
                </span>
                <span className="block text-[12px] text-text-mid">{t("private_room_hint")}</span>
              </span>
            </label>
            {isPrivate ? (
              <label className="mt-4 flex flex-col gap-1.5 text-[12px] font-medium text-text-mid">
                {t("password")}
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("password_placeholder")} className="h-11 rounded-[12px] border border-white/10 bg-black/30 px-3.5 text-sm text-text-hi placeholder:text-text-mid/60 focus:border-primary/60 focus:outline-hidden" />
              </label>
            ) : null}
            {error ? <p className="mt-3 text-[12.5px] text-accent-hi">{error}</p> : null}
            <button type="submit" className="mt-6 inline-flex h-11 items-center rounded-full bg-text-hi px-6 text-sm font-semibold text-[#05070a] hover:bg-white">
              {t("create_room")}
            </button>
          </form>
        ) : null}

        {step === "join" ? (
          <form onSubmit={join} className="mt-4 max-w-md">
            <h2 className="text-xl font-semibold text-text-hi">{t("join_by_room_id")}</h2>
            <label className="mt-4 flex flex-col gap-1.5 text-[12px] font-medium text-text-mid">
              {t("room_id")}
              <input autoFocus value={joinId} onChange={(e) => setJoinId(e.target.value.toUpperCase())} placeholder={t("room_id_placeholder")} className="h-11 rounded-[12px] border border-white/10 bg-black/30 px-3.5 font-mono text-sm uppercase tracking-widest text-text-hi placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-text-mid/60 focus:border-primary/60 focus:outline-hidden" />
            </label>
            <label className="mt-4 flex flex-col gap-1.5 text-[12px] font-medium text-text-mid">
              {t("password")} <span className="font-normal">({t("optional")})</span>
              <input value={joinPw} onChange={(e) => setJoinPw(e.target.value)} className="h-11 rounded-[12px] border border-white/10 bg-black/30 px-3.5 text-sm text-text-hi focus:border-primary/60 focus:outline-hidden" />
            </label>
            {error ? <p className="mt-3 text-[12.5px] text-accent-hi">{error}</p> : null}
            <button type="submit" className="mt-6 inline-flex h-11 items-center rounded-full bg-text-hi px-6 text-sm font-semibold text-[#05070a] hover:bg-white">
              {t("join_room")}
            </button>
          </form>
        ) : null}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => ({ props: { messages: await getPageMessages(locale, ["WatchParty"]) } });
