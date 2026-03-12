"use client";
import { useState } from "react";
import type { Profile } from "@/lib/types";
import {
  MOUNTS, TITLES, ACHIEVEMENTS, HERO_CLASSES,
  getEarnedTitle, getUnlockedMounts,
} from "@/lib/achievements";
import { useTTS } from "@/lib/useTTS";

interface Props {
  profile: Profile;
  onUpdate: (p: Profile) => void;
  onBack: () => void;
}

type Tab = "oversigt" | "udstyret" | "titler" | "bedrifter";

export default function HeroPanel({ profile, onUpdate, onBack }: Props) {
  const [tab, setTab] = useState<Tab>("oversigt");
  const { speak } = useTTS();
  const title = getEarnedTitle(profile.mathDungeonFloor);
  const heroClass = HERO_CLASSES.find((h) => h.id === profile.heroClass) ?? HERO_CLASSES[0];
  const unlockedMounts = getUnlockedMounts(profile.achievementIds);
  const unlockedTitles = TITLES.filter((t) => t.mathFloorRequired <= profile.mathDungeonFloor);
  const currentMount = MOUNTS.find((m) => m.id === profile.mountId) ?? MOUNTS[0];
  const currentTitle = TITLES.find((t) => t.id === profile.titleId) ?? title;

  const setMount = (id: string) => onUpdate({ ...profile, mountId: id });
  const setTitle = (id: string) => onUpdate({ ...profile, titleId: id });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-purple-950 flex flex-col">

      {/* Header */}
      <div className="flex items-center gap-4 px-5 pt-6 pb-4">
        <button onPointerDown={onBack}
          className="text-white bg-white/10 rounded-2xl px-5 py-5 text-2xl active:bg-white/20 select-none">
          ←
        </button>
        <div className="flex-1">
          <h1 className="text-white font-black text-3xl">Helte-Panel</h1>
          <p className="text-white/50 text-lg">{profile.name}</p>
        </div>
        <button onPointerDown={() => speak(`${profile.name}, ${currentTitle.label}. Matematiketage ${profile.mathDungeonFloor}. XP: ${profile.mathXP}.`)}
          className="text-3xl text-white p-3 bg-white/10 rounded-2xl active:bg-white/20 select-none">
          🔊
        </button>
      </div>

      {/* Hero card */}
      <div className={`mx-5 mb-4 rounded-3xl p-5 bg-gradient-to-br ${heroClass.gradient} shadow-2xl`}>
        <div className="flex items-center gap-5">
          <div className="flex flex-col items-center">
            <div className="text-8xl select-none">{profile.avatar}</div>
            <div className="text-5xl select-none -mt-3">{currentMount.emoji}</div>
          </div>
          <div className="flex-1">
            <p className="text-white font-black text-3xl">{profile.name}</p>
            <p className="text-yellow-300 text-xl font-bold">{currentTitle.emoji} {currentTitle.label}</p>
            <p className="text-white/70 text-lg">{heroClass.emoji} {heroClass.name}</p>
            <div className="mt-2 flex gap-3 text-white/80 text-base flex-wrap">
              <span>⚔️ Etage {profile.mathDungeonFloor}</span>
              <span>✨ {profile.mathXP} XP</span>
              <span>🏅 {profile.achievementIds.length} bedrifter</span>
            </div>
          </div>
        </div>
        <div className="mt-3 bg-black/20 rounded-2xl p-3">
          <p className="text-white/60 text-sm font-bold uppercase">Klasse-evne</p>
          <p className="text-white text-base mt-1">{heroClass.bonus}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-5 mb-4">
        {(["oversigt", "udstyret", "titler", "bedrifter"] as Tab[]).map((t) => (
          <button key={t} onPointerDown={() => setTab(t)}
            className={`flex-1 py-3 rounded-2xl text-sm font-black capitalize select-none transition-colors ${
              tab === t ? "bg-yellow-400 text-black" : "bg-white/10 text-white/70"
            }`}>
            {t === "oversigt" ? "📊" : t === "udstyret" ? "🐴" : t === "titler" ? "👑" : "🏅"}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-3">

        {tab === "oversigt" && (
          <>
            <div className="bg-white/10 rounded-3xl p-5">
              <p className="text-white/60 text-base font-bold uppercase mb-3">Statistik</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["🧮", "Matematik-Etage", `${profile.mathDungeonFloor}/20`],
                  ["✨", "Total XP",         `${profile.mathXP}`           ],
                  ["🏅", "Bedrifter",        `${profile.achievementIds.length}/${ACHIEVEMENTS.length}`],
                  ["👑", "Titel",            currentTitle.label            ],
                ].map(([e, l, v]) => (
                  <div key={l} className="bg-black/30 rounded-2xl p-4 text-center">
                    <div className="text-4xl mb-1 select-none">{e}</div>
                    <div className="text-white/50 text-xs">{l}</div>
                    <div className="text-white font-black text-lg">{v}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* XP progress */}
            <div className="bg-white/10 rounded-3xl p-5">
              <p className="text-white/60 text-base font-bold uppercase mb-2">Næste titel</p>
              {(() => {
                const next = TITLES.find((t) => t.mathFloorRequired > profile.mathDungeonFloor);
                if (!next) return <p className="text-yellow-300 font-bold text-lg">🌟 Max niveau nået!</p>;
                const pct = Math.min(100, Math.round((profile.mathDungeonFloor / next.mathFloorRequired) * 100));
                return (
                  <>
                    <p className="text-white text-base mb-2">{next.emoji} {next.label} — etage {next.mathFloorRequired}</p>
                    <div className="h-5 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-white/60 text-sm mt-1">{profile.mathDungeonFloor}/{next.mathFloorRequired} etager</p>
                  </>
                );
              })()}
            </div>
          </>
        )}

        {tab === "udstyret" && (
          <div className="space-y-3">
            <p className="text-white/60 text-base font-bold uppercase">Vælg dit transportmiddel</p>
            {MOUNTS.map((m) => {
              const unlocked = unlockedMounts.some((u) => u.id === m.id);
              const active = profile.mountId === m.id;
              return (
                <button key={m.id}
                  disabled={!unlocked}
                  onPointerDown={() => { if (unlocked) { setMount(m.id); speak(`${m.name} valgt!`); } }}
                  className={`w-full flex items-center gap-5 p-5 rounded-3xl select-none transition-all ${
                    active ? "bg-yellow-400/20 border-2 border-yellow-400" :
                    unlocked ? "bg-white/10 active:bg-white/20" : "bg-black/20 opacity-50"
                  }`}
                >
                  <div className="text-6xl select-none">{m.emoji}</div>
                  <div className="flex-1 text-left">
                    <p className={`font-black text-xl ${unlocked ? "text-white" : "text-gray-500"}`}>{m.name}</p>
                    <p className="text-white/60 text-base">⚡ {m.speed}</p>
                    {!unlocked && m.unlockAchievementId && (
                      <p className="text-gray-500 text-sm mt-1">
                        🔒 {ACHIEVEMENTS.find((a) => a.id === m.unlockAchievementId)?.desc}
                      </p>
                    )}
                  </div>
                  {active && <span className="text-yellow-400 font-black text-xl">✓ Aktiv</span>}
                </button>
              );
            })}
          </div>
        )}

        {tab === "titler" && (
          <div className="space-y-3">
            <p className="text-white/60 text-base font-bold uppercase">Dine titler</p>
            {TITLES.map((t) => {
              const unlocked = t.mathFloorRequired <= profile.mathDungeonFloor;
              const active = profile.titleId === t.id;
              return (
                <button key={t.id}
                  disabled={!unlocked}
                  onPointerDown={() => { if (unlocked) { setTitle(t.id); speak(`Titel ændret til ${t.label}!`); } }}
                  className={`w-full flex items-center gap-5 p-5 rounded-3xl select-none transition-all ${
                    active ? "bg-yellow-400/20 border-2 border-yellow-400" :
                    unlocked ? "bg-white/10 active:bg-white/20" : "bg-black/20 opacity-40"
                  }`}
                >
                  <div className="text-5xl select-none">{t.emoji}</div>
                  <div className="flex-1 text-left">
                    <p className={`font-black text-xl ${unlocked ? "text-white" : "text-gray-500"}`}>{t.label}</p>
                    <p className="text-white/50 text-base">Kræver etage {t.mathFloorRequired}</p>
                  </div>
                  {!unlocked && <span className="text-3xl select-none">🔒</span>}
                  {active && <span className="text-yellow-400 font-black text-xl">✓</span>}
                </button>
              );
            })}
          </div>
        )}

        {tab === "bedrifter" && (
          <div className="space-y-3">
            <p className="text-white/60 text-base font-bold uppercase">Bedrifter</p>
            {ACHIEVEMENTS.map((a) => {
              const earned = profile.achievementIds.includes(a.id);
              return (
                <div key={a.id}
                  className={`flex items-center gap-5 p-5 rounded-3xl ${earned ? "bg-yellow-400/10 border border-yellow-400/40" : "bg-black/20 opacity-50"}`}>
                  <div className={`text-5xl select-none ${earned ? "" : "grayscale"}`}>{a.emoji}</div>
                  <div className="flex-1">
                    <p className={`font-black text-xl ${earned ? "text-white" : "text-gray-500"}`}>{a.name}</p>
                    <p className="text-white/50 text-base">{a.desc}</p>
                    {earned && a.unlocksMount && (
                      <p className="text-yellow-400 text-sm mt-1">
                        🐴 {MOUNTS.find((m) => m.id === a.unlocksMount)?.name} låst op!
                      </p>
                    )}
                  </div>
                  {earned ? <span className="text-green-400 text-3xl">✓</span> : <span className="text-gray-600 text-3xl">🔒</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
