"use client";
import { useState } from "react";
import type { Profile } from "@/lib/types";
import { xpForLevel, levelFromXP } from "@/lib/types";
import { MOUNTS, TITLES, ACHIEVEMENTS, HERO_CLASSES, getEarnedTitle, getUnlockedMounts } from "@/lib/achievements";
import { MESTRINGS_STIER, ITEMS, getItem, getQuest } from "@/lib/items";
import type { ItemSlot } from "@/lib/items";
import { useTTS } from "@/lib/useTTS";

interface Props {
  profile: Profile;
  onUpdate: (p: Profile) => void;
  onBack: () => void;
}

type Tab = "oversigt" | "udrustning" | "mestring" | "quests";

const RARITY_COLOR: Record<string, string> = {
  almindelig:  "bg-gray-700 text-gray-200",
  "sjælden":   "bg-blue-800 text-blue-200",
  episk:       "bg-purple-800 text-purple-200",
  legendarisk: "bg-yellow-700 text-yellow-200",
};

const SLOT_LABELS: Record<ItemSlot, string> = {
  vaaben:    "⚔️ Våben",
  rustning:  "🛡️ Rustning",
  hjelm:     "⛑️ Hjelm",
  tilbehoer: "💍 Tilbehør",
};

export default function HeroPanel({ profile, onUpdate, onBack }: Props) {
  const [tab, setTab] = useState<Tab>("oversigt");
  const { speak } = useTTS();

  const title        = getEarnedTitle(profile.mathDungeonFloor);
  const heroClass    = HERO_CLASSES.find((h) => h.id === profile.heroClass) ?? HERO_CLASSES[0];
  const currentMount = MOUNTS.find((m) => m.id === profile.mountId) ?? MOUNTS[0];
  const currentTitle = TITLES.find((t) => t.id === profile.titleId) ?? title;
  const unlockedMounts = getUnlockedMounts(profile.achievementIds ?? []);

  const mathXP      = profile.mathXP ?? 0;
  const gold        = profile.gold ?? 0;
  const heroLevel   = levelFromXP(mathXP);
  const currLevelXP = xpForLevel(heroLevel);
  const nextLevelXP = xpForLevel(heroLevel + 1);
  const levelPct    = Math.min(100, Math.round(((mathXP - currLevelXP) / Math.max(1, nextLevelXP - currLevelXP)) * 100));

  const itemIds           = profile.itemIds ?? [];
  const equippedItems     = profile.equippedItems ?? {};
  const masteries         = profile.masteries ?? {};
  const dailyQuestIds     = profile.dailyQuestIds ?? [];
  const dailyQuestDoneIds = profile.dailyQuestDoneIds ?? [];

  const ownedItems = ITEMS.filter((i) => itemIds.includes(i.id));

  const equipItem = (slot: ItemSlot, itemId: string) =>
    onUpdate({ ...profile, equippedItems: { ...equippedItems, [slot]: itemId } });

  const unequipSlot = (slot: ItemSlot) => {
    const next = { ...equippedItems };
    delete next[slot];
    onUpdate({ ...profile, equippedItems: next });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-purple-950 flex flex-col">

      {/* ── HEADER ── */}
      <div className="flex items-center gap-3 px-5 pt-5 pb-4">
        <button onPointerDown={onBack}
          className="text-white bg-white/10 rounded-2xl px-4 py-3 text-xl active:bg-white/20 select-none">
          ←
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-white font-black text-2xl">Helte-Panel</h1>
          <p className="text-white/50 text-sm truncate">{profile.name}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-yellow-400 font-black">💰 {gold}</span>
          <button onPointerDown={() => speak(`${profile.name}. Niveau ${heroLevel}. ${mathXP} XP. ${gold} guld.`)}
            className="text-2xl text-white p-2 bg-white/10 rounded-2xl active:bg-white/20 select-none">
            🔊
          </button>
        </div>
      </div>

      {/* ── HERO CARD ── */}
      <div className={`mx-4 mb-3 rounded-3xl p-4 bg-gradient-to-br ${heroClass.gradient} shadow-2xl`}>
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-center">
            <div className="text-6xl select-none">{profile.avatar}</div>
            <div className="text-4xl select-none -mt-2">{currentMount.emoji}</div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-xl truncate">{profile.name}</p>
            <p className="text-yellow-300 text-sm font-bold">{currentTitle.emoji} {currentTitle.label}</p>
            <p className="text-white/70 text-xs">{heroClass.emoji} {heroClass.name}</p>
            <div className="mt-1 flex gap-3 text-white/80 text-xs flex-wrap">
              <span>⭐ Niv. {heroLevel}</span>
              <span>⚔️ Etage {profile.mathDungeonFloor}</span>
              <span>💰 {gold}</span>
            </div>
          </div>
        </div>
        {/* XP Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>{mathXP} XP</span>
            <span>→ Niv. {heroLevel + 1}: {nextLevelXP} XP</span>
          </div>
          <div className="h-2.5 bg-black/30 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${levelPct}%` }} />
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-1 px-4 mb-3">
        {([
          ["oversigt",   "📊 Oversigt"],
          ["udrustning", "⚔️ Udrustning"],
          ["mestring",   "🏆 Mestring"],
          ["quests",     "📜 Quests"],
        ] as [Tab, string][]).map(([t, lbl]) => (
          <button key={t} onPointerDown={() => setTab(t)}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black select-none transition-colors ${
              tab === t ? "bg-yellow-400 text-black" : "bg-white/10 text-white/60 active:bg-white/20"
            }`}>
            {lbl}
          </button>
        ))}
      </div>

      {/* ── TAB CONTENT ── */}
      <div className="flex-1 overflow-y-auto px-4 pb-8 space-y-3">

        {/* ━━━━━━ OVERSIGT ━━━━━━ */}
        {tab === "oversigt" && (
          <>
            <div className="bg-white/10 rounded-3xl p-4">
              <p className="text-white/50 text-xs font-bold uppercase mb-3">Statistik</p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  ["⭐", "Niveau",      `${heroLevel}/50`],
                  ["✨", "Total XP",    `${mathXP}`],
                  ["💰", "Guld",        `${gold}`],
                  ["⚔️", "Dungeon",     `Etage ${profile.mathDungeonFloor}`],
                  ["🏅", "Bedrifter",   `${(profile.achievementIds ?? []).length}/${ACHIEVEMENTS.length}`],
                  ["👑", "Titel",        currentTitle.label],
                ] as [string, string, string][]).map(([e, l, v]) => (
                  <div key={l} className="bg-black/30 rounded-2xl p-3 text-center">
                    <div className="text-2xl mb-1 select-none">{e}</div>
                    <div className="text-white/40 text-xs">{l}</div>
                    <div className="text-white font-black text-sm">{v}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 rounded-3xl p-4">
              <p className="text-white/50 text-xs font-bold uppercase mb-2">Klasse-Evne</p>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{heroClass.emoji}</span>
                <div>
                  <p className="text-white font-bold">{heroClass.name}</p>
                  <p className="text-white/60 text-sm">{heroClass.bonus}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/10 rounded-3xl p-4">
              <p className="text-white/50 text-xs font-bold uppercase mb-2">Næste Titel</p>
              {(() => {
                const next = TITLES.find((t) => t.mathFloorRequired > profile.mathDungeonFloor);
                if (!next) return <p className="text-yellow-300 font-bold">🌟 Max niveau nået!</p>;
                const pct = Math.min(100, Math.round((profile.mathDungeonFloor / next.mathFloorRequired) * 100));
                return (
                  <>
                    <p className="text-white text-sm mb-2">{next.emoji} {next.label} — etage {next.mathFloorRequired}</p>
                    <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-yellow-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="text-white/50 text-xs mt-1">{profile.mathDungeonFloor}/{next.mathFloorRequired} etager</p>
                  </>
                );
              })()}
            </div>

            <div className="bg-white/10 rounded-3xl p-4">
              <p className="text-white/50 text-xs font-bold uppercase mb-3">Bedrifter</p>
              <div className="space-y-2">
                {ACHIEVEMENTS.map((a) => {
                  const earned = (profile.achievementIds ?? []).includes(a.id);
                  return (
                    <div key={a.id}
                      className={`flex items-center gap-3 p-3 rounded-2xl ${earned ? "bg-yellow-400/10 border border-yellow-400/30" : "bg-black/20 opacity-40"}`}>
                      <span className={`text-3xl ${earned ? "" : "grayscale"}`}>{a.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className={`font-bold text-sm ${earned ? "text-white" : "text-gray-500"}`}>{a.name}</p>
                        <p className="text-white/50 text-xs truncate">{a.desc}</p>
                      </div>
                      {earned ? <span className="text-green-400 shrink-0">✓</span> : <span className="text-gray-600 shrink-0">🔒</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ━━━━━━ UDRUSTNING ━━━━━━ */}
        {tab === "udrustning" && (
          <>
            <div className="bg-white/10 rounded-3xl p-4">
              <p className="text-white/50 text-xs font-bold uppercase mb-3">Udstyret nu</p>
              <div className="grid grid-cols-2 gap-3">
                {(["vaaben", "rustning", "hjelm", "tilbehoer"] as ItemSlot[]).map((slot) => {
                  const eqId = equippedItems[slot];
                  const item = eqId ? getItem(eqId) : undefined;
                  return (
                    <div key={slot}
                      className={`rounded-2xl p-3 ${item ? "bg-yellow-400/10 border border-yellow-400/30" : "bg-black/20 border border-white/10"}`}>
                      <p className="text-white/40 text-xs mb-2">{SLOT_LABELS[slot]}</p>
                      {item ? (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-3xl">{item.emoji}</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-white font-bold text-xs truncate">{item.name}</p>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full ${RARITY_COLOR[item.sjaeldenhed] ?? ""}`}>
                                {item.sjaeldenhed}
                              </span>
                            </div>
                          </div>
                          <p className="text-white/50 text-xs mt-1">
                            {item.xpBonus > 0 && `+${item.xpBonus}% XP  `}
                            {item.goldBonus > 0 && `+${item.goldBonus}% 💰 `}
                            {item.stribeBonus > 0 && `+${item.stribeBonus} 🔥`}
                          </p>
                          <button onPointerDown={() => unequipSlot(slot)}
                            className="text-xs text-red-400 mt-1.5 active:opacity-70">Fjern</button>
                        </>
                      ) : (
                        <p className="text-white/20 text-xs italic">Tom slot</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white/10 rounded-3xl p-4">
              <p className="text-white/50 text-xs font-bold uppercase mb-3">Inventar ({ownedItems.length})</p>
              {ownedItems.length === 0 ? (
                <p className="text-white/30 text-sm italic text-center py-6">
                  Ingen genstande endnu. Find kister i dungeonen! 🗺️
                </p>
              ) : (
                <div className="space-y-2">
                  {ownedItems.map((item) => {
                    const isEquipped = equippedItems[item.slot] === item.id;
                    return (
                      <div key={item.id}
                        className={`flex items-center gap-3 p-3 rounded-2xl ${isEquipped ? "bg-yellow-400/15 border border-yellow-300/40" : "bg-black/20"}`}>
                        <span className="text-3xl shrink-0">{item.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-white font-bold text-sm">{item.name}</p>
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${RARITY_COLOR[item.sjaeldenhed] ?? ""}`}>
                              {item.sjaeldenhed}
                            </span>
                          </div>
                          <p className="text-white/40 text-xs">{SLOT_LABELS[item.slot]}</p>
                          <p className="text-white/50 text-xs">
                            {item.xpBonus > 0 && `+${item.xpBonus}% XP  `}
                            {item.goldBonus > 0 && `+${item.goldBonus}% 💰  `}
                            {item.stribeBonus > 0 && `+${item.stribeBonus} 🔥`}
                          </p>
                        </div>
                        <div className="shrink-0">
                          {isEquipped ? (
                            <button onPointerDown={() => unequipSlot(item.slot)}
                              className="text-xs bg-red-800 text-red-200 px-2 py-1 rounded-xl active:opacity-70">Fjern</button>
                          ) : (
                            <button onPointerDown={() => equipItem(item.slot, item.id)}
                              className="text-xs bg-yellow-600 text-white px-2 py-1 rounded-xl active:opacity-70">Udstyrt</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white/10 rounded-3xl p-4">
              <p className="text-white/50 text-xs font-bold uppercase mb-3">Transportmiddel</p>
              {MOUNTS.map((m) => {
                const unlocked = unlockedMounts.some((u) => u.id === m.id);
                const active = profile.mountId === m.id;
                return (
                  <button key={m.id} disabled={!unlocked}
                    onPointerDown={() => { if (unlocked) onUpdate({ ...profile, mountId: m.id }); }}
                    className={`w-full flex items-center gap-4 p-3 mb-2 rounded-2xl select-none ${
                      active ? "bg-yellow-400/20 border-2 border-yellow-400" :
                      unlocked ? "bg-white/10 active:bg-white/20" : "bg-black/20 opacity-40"
                    }`}>
                    <span className="text-4xl">{m.emoji}</span>
                    <div className="flex-1 text-left">
                      <p className={`font-bold text-sm ${unlocked ? "text-white" : "text-gray-500"}`}>{m.name}</p>
                      <p className="text-white/40 text-xs">⚡ {m.speed}</p>
                    </div>
                    {active && <span className="text-yellow-400 font-black">✓</span>}
                    {!unlocked && <span className="text-xl">🔒</span>}
                  </button>
                );
              })}
            </div>

            <div className="bg-white/10 rounded-3xl p-4">
              <p className="text-white/50 text-xs font-bold uppercase mb-3">Titler</p>
              {TITLES.map((t) => {
                const unlocked = t.mathFloorRequired <= profile.mathDungeonFloor;
                const active = profile.titleId === t.id;
                return (
                  <button key={t.id} disabled={!unlocked}
                    onPointerDown={() => { if (unlocked) onUpdate({ ...profile, titleId: t.id }); }}
                    className={`w-full flex items-center gap-4 p-3 mb-2 rounded-2xl select-none ${
                      active ? "bg-yellow-400/20 border-2 border-yellow-400" :
                      unlocked ? "bg-white/10 active:bg-white/20" : "bg-black/20 opacity-40"
                    }`}>
                    <span className="text-4xl">{t.emoji}</span>
                    <div className="flex-1 text-left">
                      <p className={`font-bold text-sm ${unlocked ? "text-white" : "text-gray-500"}`}>{t.label}</p>
                      <p className="text-white/40 text-xs">Kræver etage {t.mathFloorRequired}</p>
                    </div>
                    {active && <span className="text-yellow-400 font-black">✓</span>}
                    {!unlocked && <span className="text-xl">🔒</span>}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ━━━━━━ MESTRINGS-STIER ━━━━━━ */}
        {tab === "mestring" && (
          <>
            <div className="bg-white/5 rounded-3xl p-4">
              <p className="text-white/50 text-sm text-center">
                Spil matematikens fæstning for at avancere på de 6 mestrings-stier. Hvert trin kræver korrekte svar med god nøjagtighed.
              </p>
            </div>
            {MESTRINGS_STIER.map((sti) => {
              const mast = masteries[sti.id as keyof typeof masteries];
              const stage         = mast?.stage ?? 0;
              const totalCorrect  = mast?.totalCorrect ?? 0;
              const totalAnswered = mast?.totalAnswered ?? 0;
              const accuracy      = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
              const currentTrinDef = sti.trin.find((t) => t.trin === stage + 1);
              const stagePct = stage >= 5 ? 100
                : currentTrinDef ? Math.min(100, Math.round((totalCorrect / currentTrinDef.rigtigeKrævet) * 100))
                : 0;
              const currentNavn  = stage >= 5 ? sti.trin[4].navn  : (sti.trin[stage]?.navn  ?? "Ikke startet");
              const currentEmoji = stage >= 5 ? sti.trin[4].emoji : (sti.trin[stage]?.emoji ?? "🌑");

              return (
                <div key={sti.id} className="bg-white/10 rounded-3xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-4xl select-none">{sti.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-white font-black text-base">{sti.navn}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold bg-gradient-to-r ${sti.farve} text-white shrink-0`}>
                          Trin {stage}/5
                        </span>
                      </div>
                      <p className="text-white/60 text-sm">{currentEmoji} {currentNavn}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 mb-2">
                    {sti.trin.map((t) => (
                      <div key={t.trin}
                        className={`flex-1 h-2 rounded-full ${stage >= t.trin ? `bg-gradient-to-r ${sti.farve}` : "bg-white/10"}`} />
                    ))}
                  </div>

                  {stage < 5 && currentTrinDef && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-white/40 mb-1">
                        <span>Mod: {currentTrinDef.navn} ({currentTrinDef.interval})</span>
                        <span>{Math.min(totalCorrect, currentTrinDef.rigtigeKrævet)}/{currentTrinDef.rigtigeKrævet}</span>
                      </div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full bg-gradient-to-r ${sti.farve} transition-all`}
                          style={{ width: `${stagePct}%` }} />
                      </div>
                      <p className="text-white/30 text-xs mt-1">Kræver {currentTrinDef.nøjagtighedsKrævet}% nøjagtighed</p>
                    </div>
                  )}

                  {stage >= 5 && (
                    <div className="mt-2 text-center">
                      <span className="text-yellow-400 font-black">🏆 MESTER opnået!</span>
                    </div>
                  )}

                  {totalAnswered > 0 && (
                    <div className="flex gap-3 mt-3 text-xs text-white/40 flex-wrap">
                      <span>✅ {totalCorrect} rigtige</span>
                      <span>·</span>
                      <span>📊 {accuracy}% nøjagtighed</span>
                      {(mast?.bestStreak ?? 0) > 0 && (
                        <>
                          <span>·</span>
                          <span>🔥 {mast.bestStreak} bedste stribe</span>
                        </>
                      )}
                    </div>
                  )}

                  <div className="mt-3 space-y-1">
                    {sti.trin.map((t) => (
                      <div key={t.trin}
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-xl text-xs ${stage >= t.trin ? "bg-white/10" : "bg-black/10 opacity-50"}`}>
                        <span>{stage >= t.trin ? t.emoji : "🔒"}</span>
                        <span className={stage >= t.trin ? "text-white" : "text-gray-500"}>{t.navn}</span>
                        <span className="ml-auto text-white/30">{t.interval}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ━━━━━━ DAGLIGE QUESTS ━━━━━━ */}
        {tab === "quests" && (
          <>
            {dailyQuestIds.length > 0 && (
              <div className="bg-white/5 rounded-2xl p-3 text-center">
                <p className="text-white/50 text-xs">
                  {dailyQuestDoneIds.length}/{dailyQuestIds.length} quests klaret i dag
                </p>
              </div>
            )}

            {dailyQuestIds.length === 0 ? (
              <div className="bg-white/10 rounded-3xl p-8 text-center">
                <p className="text-5xl mb-3">📜</p>
                <p className="text-white font-bold text-lg">Ingen quests i dag</p>
                <p className="text-white/40 text-sm mt-2">Vend tilbage for daglige quests!</p>
              </div>
            ) : (
              dailyQuestIds.map((qid) => {
                const quest = getQuest(qid);
                if (!quest) return null;
                const done = dailyQuestDoneIds.includes(qid);
                return (
                  <div key={qid}
                    className={`p-4 rounded-3xl ${done ? "bg-green-900/30 border border-green-400/30" : "bg-white/10"}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-4xl shrink-0">{quest.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-white font-black text-base">{quest.navn}</p>
                          {done && (
                            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full shrink-0">Klaret ✓</span>
                          )}
                        </div>
                        <p className="text-white/60 text-xs">{quest.beskrivelse}</p>
                        <div className="flex gap-3 mt-1 text-xs text-yellow-300">
                          <span>+{quest.xpBelønning} XP</span>
                          <span>·</span>
                          <span>+{quest.guldBelønning} 💰</span>
                        </div>
                      </div>
                    </div>
                    {!done && (
                      <div className="mt-3">
                        <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-400/40 rounded-full" style={{ width: "0%" }} />
                        </div>
                        <p className="text-white/30 text-xs mt-1 text-right">Spil for at gøre fremskridt</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {dailyQuestDoneIds.length > 0 && dailyQuestDoneIds.length >= dailyQuestIds.length && (
              <div className="bg-green-900/20 border border-green-400/30 rounded-3xl p-4 text-center">
                <p className="text-green-400 font-black text-lg">🎉 Alle daglige quests klaret!</p>
                <p className="text-green-400/60 text-xs mt-1">Kom tilbage i morgen for nye quests.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
