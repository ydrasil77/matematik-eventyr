"use client";
import { useState, useEffect, useRef } from "react";
import type { Profile } from "@/lib/types";
import { useTTS } from "@/lib/useTTS";
import { ACHIEVEMENTS, getEarnedTitle, MOUNTS, checkNewAchievements } from "@/lib/achievements";

interface Quest {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  dungeonFloor: number;
  message: string;
  type: "help" | "coop";
  roomCode?: string;
  createdAt: number;
}

interface CoopRoom {
  code: string;
  hostId: string;
  hostName: string;
  hostAvatar: string;
  dungeonFloor: number;
  members: { id: string; name: string; avatar: string }[];
}

const QUESTS_KEY = "ovebog-quests-v1";
const CHANNEL_NAME = "ovebog-coop-v1";

interface Props {
  profile: Profile;
  onBack: () => void;
  onEnterCoop?: (roomCode: string, dungeonFloor: number) => void;
}

export default function QuestBoard({ profile, onBack, onEnterCoop }: Props) {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [tab, setTab] = useState<"quests" | "coop">("quests");
  const [showCreateQuest, setShowCreateQuest] = useState(false);
  const [questMessage, setQuestMessage] = useState("");
  const [questFloor, setQuestFloor] = useState(profile.mathDungeonFloor || 1);
  const [questType, setQuestType] = useState<"help" | "coop">("help");
  const [coopRoom, setCoopRoom] = useState<CoopRoom | null>(null);
  const [roomCode, setRoomCode] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const channelRef = useRef<BroadcastChannel | null>(null);
  const { speak } = useTTS();

  useEffect(() => {
    loadQuests();
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      const ch = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current = ch;
      ch.onmessage = (e) => {
        const { type, payload } = e.data;
        if (type === "room-update" && coopRoom?.code === payload.code) {
          setCoopRoom(payload);
        }
        if (type === "quest-added") {
          loadQuests();
        }
      };
      return () => ch.close();
    }
  }, []);

  const loadQuests = () => {
    try {
      const raw = localStorage.getItem(QUESTS_KEY);
      const all: Quest[] = raw ? JSON.parse(raw) : [];
      const recent = all.filter((q) => Date.now() - q.createdAt < 24 * 60 * 60 * 1000);
      setQuests(recent);
    } catch {}
  };

  const saveQuests = (list: Quest[]) => {
    setQuests(list);
    try { localStorage.setItem(QUESTS_KEY, JSON.stringify(list)); } catch {}
  };

  const createQuest = () => {
    if (!questMessage.trim()) return;
    const code = Math.random().toString(36).slice(2, 7).toUpperCase();
    const q: Quest = {
      id: Date.now().toString(),
      authorId: profile.id,
      authorName: profile.name,
      authorAvatar: profile.avatar,
      dungeonFloor: questFloor,
      message: questMessage.trim(),
      type: questType,
      roomCode: questType === "coop" ? code : undefined,
      createdAt: Date.now(),
    };
    saveQuests([...quests, q]);
    channelRef.current?.postMessage({ type: "quest-added", payload: q });
    setQuestMessage("");
    setShowCreateQuest(false);
    speak("Dit quest er oprettet!");
  };

  const deleteQuest = (id: string) => {
    saveQuests(quests.filter((q) => q.id !== id));
    speak("Quest slettet.");
  };

  const createCoopRoom = () => {
    const code = Math.random().toString(36).slice(2, 7).toUpperCase();
    const room: CoopRoom = {
      code,
      hostId: profile.id,
      hostName: profile.name,
      hostAvatar: profile.avatar,
      dungeonFloor: profile.mathDungeonFloor || 1,
      members: [{ id: profile.id, name: profile.name, avatar: profile.avatar }],
    };
    setCoopRoom(room);
    setRoomCode(code);
    channelRef.current?.postMessage({ type: "room-update", payload: room });
    speak(`Rum oprettet! Koden er ${code.split("").join(", ")}.`);
  };

  const joinCoopRoom = () => {
    if (!joinCode.trim()) return;
    const code = joinCode.trim().toUpperCase();
    channelRef.current?.postMessage({
      type: "join-room",
      payload: { code, member: { id: profile.id, name: profile.name, avatar: profile.avatar } },
    });
    speak(`Forsøger at tilslutte rum ${code}…`);
    setJoinCode("");
  };

  const title = getEarnedTitle(profile.mathDungeonFloor);
  const currentMount = MOUNTS.find((m) => m.id === profile.mountId) ?? MOUNTS[0];

  const myQuests = quests.filter((q) => q.authorId === profile.id);
  const othersQuests = quests.filter((q) => q.authorId !== profile.id);

  return (
    <div className="h-dvh bg-gradient-to-b from-slate-900 via-amber-950/30 to-slate-900 flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center gap-4 px-5 pt-6 pb-4">
        <button onPointerDown={onBack}
          className="text-white bg-white/10 rounded-2xl px-5 py-5 text-2xl active:bg-white/20 select-none">
          ←
        </button>
        <div className="flex-1">
          <h1 className="text-white font-black text-3xl">⚔️ Questbræt</h1>
          <p className="text-white/50 text-lg">Hjælp andre på eventyr</p>
        </div>
        <button onPointerDown={() => speak("Questbrættet. Her kan du hjælpe andre helte eller rejse i fælles dungeons.")}
          className="text-3xl text-white p-3 bg-white/10 rounded-2xl active:bg-white/20 select-none">
          🔊
        </button>
      </div>

      {/* Profile mini card */}
      <div className="mx-5 mb-4 bg-white/10 rounded-2xl p-4 flex items-center gap-4">
        <div className="text-5xl select-none">{profile.avatar}{currentMount.emoji}</div>
        <div>
          <p className="text-white font-bold text-xl">{profile.name}</p>
          <p className="text-yellow-300 text-base">{title.emoji} {title.label} · Etage {profile.mathDungeonFloor}</p>
        </div>
        <div className="ml-auto">
          <button onPointerDown={() => { setShowCreateQuest(true); speak("Opret et nyt quest."); }}
            className="bg-yellow-400 text-black font-black text-lg px-5 py-3 rounded-2xl active:scale-95 select-none">
            + Quest
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-5 mb-4">
        {(["quests", "coop"] as const).map((t) => (
          <button key={t} onPointerDown={() => setTab(t)}
            className={`flex-1 py-4 rounded-2xl text-lg font-black select-none ${
              tab === t ? "bg-yellow-400 text-black" : "bg-white/10 text-white/70"
            }`}>
            {t === "quests" ? "📜 Quests" : "🤝 Co-op"}
          </button>
        ))}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-6">

        {/* Create quest modal */}
        {showCreateQuest && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-end">
            <div className="bg-slate-800 w-full rounded-t-3xl p-6 space-y-5">
              <h2 className="text-white font-black text-2xl">📜 Nyt Quest</h2>
              <div className="flex gap-3">
                {(["help", "coop"] as const).map((t) => (
                  <button key={t} onPointerDown={() => setQuestType(t)}
                    className={`flex-1 py-4 rounded-2xl text-base font-bold select-none ${
                      questType === t ? "bg-yellow-400 text-black" : "bg-white/10 text-white"
                    }`}>
                    {t === "help" ? "🙏 Brug for hjælp" : "🤝 Co-op rejse"}
                  </button>
                ))}
              </div>
              <div>
                <p className="text-white/60 text-sm mb-2">Matematik-etage</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onPointerDown={() => setQuestFloor(n)}
                      className={`flex-1 py-3 rounded-xl text-base font-black select-none ${
                        questFloor === n ? "bg-yellow-400 text-black" : "bg-white/10 text-white"
                      }`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-white/60 text-sm mb-2">Besked</p>
                <textarea
                  value={questMessage}
                  onChange={(e) => setQuestMessage(e.target.value)}
                  placeholder="Jeg er siddet fast på plus-opgaverne…"
                  rows={3}
                  className="w-full bg-white/10 text-white rounded-2xl p-4 text-base placeholder-white/30 resize-none outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button onPointerDown={() => setShowCreateQuest(false)}
                  className="flex-1 bg-white/10 text-white py-5 rounded-2xl text-xl font-bold select-none">
                  Annuller
                </button>
                <button onPointerDown={createQuest}
                  className="flex-1 bg-yellow-400 text-black py-5 rounded-2xl text-xl font-black select-none">
                  Opret
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "quests" && (
          <div className="space-y-4">
            {/* My quests */}
            {myQuests.length > 0 && (
              <div>
                <p className="text-white/50 text-sm font-bold uppercase mb-3">Dine quests</p>
                {myQuests.map((q) => (
                  <QuestCard key={q.id} quest={q} isOwn onDelete={() => deleteQuest(q.id)} />
                ))}
              </div>
            )}
            {/* Others' quests */}
            {othersQuests.length > 0 ? (
              <div>
                <p className="text-white/50 text-sm font-bold uppercase mb-3">Åbne quests</p>
                {othersQuests.map((q) => (
                  <QuestCard key={q.id} quest={q} onAccept={() => speak(`${q.authorName} beder om hjælp på etage ${q.dungeonFloor}. God tur!`)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-8xl mb-4 select-none">📜</div>
                <p className="text-white/50 text-xl">Ingen åbne quests</p>
                <p className="text-white/30 text-base mt-2">Vær den første til at bede om hjælp!</p>
              </div>
            )}
          </div>
        )}

        {tab === "coop" && (
          <div className="space-y-5">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-5">
              <p className="text-amber-400 font-bold text-lg">🌐 Flerplayer via netværk</p>
              <p className="text-white/60 text-base mt-2">
                Co-op på tværs af enheder på samme WiFi kommer snart. Lige nu kan{" "}
                <strong className="text-white">faner i samme browser</strong> spille sammen.
              </p>
            </div>

            {coopRoom ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-3xl p-6">
                <p className="text-green-400 font-black text-2xl mb-1">Rum oprettet!</p>
                <p className="text-white/60 text-base mb-4">Del denne kode med din ven:</p>
                <div className="text-center">
                  <div className="bg-black/40 rounded-2xl py-5 px-8 inline-block">
                    <p className="text-yellow-400 font-black text-5xl tracking-widest">{roomCode}</p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <p className="text-white/60 text-base">Deltagere ({coopRoom.members.length}/4):</p>
                  {coopRoom.members.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 bg-white/10 rounded-2xl p-3">
                      <span className="text-4xl select-none">{m.avatar}</span>
                      <span className="text-white font-bold text-xl">{m.name}</span>
                    </div>
                  ))}
                </div>
                {coopRoom.members.length >= 2 && (
                  <button onPointerDown={() => { onEnterCoop?.(roomCode, coopRoom.dungeonFloor); speak("Eventyret begynder!"); }}
                    className="w-full mt-5 py-6 bg-green-500 text-white font-black text-2xl rounded-3xl active:scale-95 select-none">
                    🚀 Start Co-op Dungeon!
                  </button>
                )}
              </div>
            ) : (
              <>
                <button onPointerDown={() => { createCoopRoom(); speak("Rum oprettet. Del koden med din ven."); }}
                  className="w-full py-7 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black text-2xl rounded-3xl active:scale-95 select-none shadow-xl">
                  🤝 Opret Co-op Rum
                </button>
                <div className="flex gap-3">
                  <input
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="RUM KODE"
                    maxLength={5}
                    className="flex-1 bg-white/10 text-white text-center text-xl font-black rounded-2xl py-5 outline-none placeholder-white/30 tracking-widest"
                  />
                  <button onPointerDown={joinCoopRoom}
                    className="px-7 py-5 bg-blue-600 text-white font-black text-xl rounded-2xl active:scale-95 select-none">
                    Tilslut
                  </button>
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function QuestCard({ quest, isOwn, onDelete, onAccept }: {
  quest: Quest;
  isOwn?: boolean;
  onDelete?: () => void;
  onAccept?: () => void;
}) {
  return (
    <div className={`rounded-3xl p-5 mb-3 ${quest.type === "coop" ? "bg-purple-600/20 border border-purple-500/30" : "bg-amber-600/20 border border-amber-500/30"}`}>
      <div className="flex items-start gap-4">
        <div className="text-5xl select-none">{quest.authorAvatar}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-white font-bold text-xl">{quest.authorName}</span>
            <span className={`text-sm px-2 py-0.5 rounded-full font-bold ${quest.type === "coop" ? "bg-purple-500/40 text-purple-300" : "bg-amber-500/40 text-amber-300"}`}>
              {quest.type === "coop" ? "🤝 Co-op" : "🙏 Hjælp"}
            </span>
          </div>
          <p className="text-white/50 text-sm mb-2">🗺️ Etage {quest.dungeonFloor}</p>
          <p className="text-white text-base">{quest.message}</p>
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        {isOwn ? (
          <button onPointerDown={onDelete}
            className="flex-1 py-3 bg-red-600/50 text-white rounded-2xl text-base font-bold select-none active:bg-red-600/80">
            🗑️ Slet
          </button>
        ) : (
          <button onPointerDown={onAccept}
            className="flex-1 py-4 bg-yellow-400 text-black rounded-2xl text-lg font-black select-none active:scale-95">
            {quest.type === "coop" ? "🤝 Tilslut" : "⚔️ Hjælp!"}
          </button>
        )}
      </div>
    </div>
  );
}
