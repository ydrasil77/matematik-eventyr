"use client";
import { useState } from "react";
import type { Profile } from "@/lib/types";
import { MOUNTS, TITLES, getEarnedTitle } from "@/lib/achievements";
import { useTTS } from "@/lib/useTTS";

interface DungeonNode {
  id: string;
  name: string;
  emoji: string;
  x: string;
  y: string;
  available: boolean;
  desc: string;
}

const CITY_X = "50%";
const CITY_Y = "46%";

const DUNGEON_NODES: DungeonNode[] = [
  { id: "math",     name: "Matematikens Fæstning", emoji: "🧮", x: "50%",  y: "80%",  available: true,  desc: "Tal, regning og algebra" },
  { id: "reading",  name: "Bogstavernes Tårn",  emoji: "📖", x: "12%",  y: "42%",  available: true, desc: "Bogstaver & læsning" },
  { id: "history",  name: "Historiens Ruiner",  emoji: "🏛️", x: "88%",  y: "32%",  available: true, desc: "Danmarks & verdens historie" },
  { id: "physics",  name: "Fysikkens Fyr",      emoji: "⚡", x: "82%",  y: "62%",  available: true, desc: "Fysik & natur" },
  { id: "biology",  name: "Biologiens Skov",    emoji: "🌿", x: "18%",  y: "68%",  available: true, desc: "Dyr, planter & kroppen" },
  { id: "language", name: "Sprogenes Portal",   emoji: "🌍", x: "50%",  y: "14%",  available: true, desc: "Engelsk & sprog" },
];

const TREE_DECO = [
  { x: "5%",  y: "10%" }, { x: "20%", y: "5%"  }, { x: "35%", y: "8%"  },
  { x: "65%", y: "6%"  }, { x: "78%", y: "10%" }, { x: "92%", y: "8%"  },
  { x: "5%",  y: "25%" }, { x: "8%",  y: "58%" }, { x: "5%",  y: "80%" },
  { x: "92%", y: "48%" }, { x: "94%", y: "72%" }, { x: "90%", y: "86%" },
  { x: "30%", y: "92%" }, { x: "65%", y: "93%" }, { x: "78%", y: "89%" },
  { x: "25%", y: "28%" }, { x: "72%", y: "20%" }, { x: "40%", y: "30%" },
];

const ETAGE_MONSTER: Record<number, { emoji: string; name: string }> = {
   1: { emoji: "🟢", name: "Grøn Slim" },      2: { emoji: "🦇", name: "Flagermus" },
   3: { emoji: "💀", name: "Skelet" },          4: { emoji: "🐺", name: "Ulv" },
   5: { emoji: "🧟", name: "Zombie" },          6: { emoji: "👹", name: "Trolden" },
   7: { emoji: "🧌", name: "Kæmpen" },          8: { emoji: "🐲", name: "Drageunge" },
   9: { emoji: "🐉", name: "Blå Drage" },      10: { emoji: "🧙", name: "Mørkets Troldmand" },
  11: { emoji: "🧛", name: "Vampyr" },         12: { emoji: "☠️", name: "Liket" },
  13: { emoji: "😈", name: "Dæmon" },          14: { emoji: "🦂", name: "Giftscorpion" },
  15: { emoji: "👿", name: "Ældre Dæmon" },    16: { emoji: "🔮", name: "Sjæl-Troldkvinde" },
  17: { emoji: "💀", name: "Arkylisk Lich" },  18: { emoji: "🌑", name: "Mørkets Vogter" },
  19: { emoji: "⚡", name: "Stormlord" },       20: { emoji: "👑", name: "Lich-Kongen" },
};

interface Props {
  profile: Profile;
  onEnterDungeon: (id: string, floor: number) => void;
  onHeroPanel: () => void;
  onSwitchProfile: () => void;
  onQuestBoard: () => void;
}

export default function CityMap({ profile, onEnterDungeon, onHeroPanel, onSwitchProfile, onQuestBoard }: Props) {
  const [pickerNode, setPickerNode] = useState<DungeonNode | null>(null);
  const { speak } = useTTS();
  const title = getEarnedTitle(profile.mathDungeonFloor);
  const mount = MOUNTS.find((m) => m.id === profile.mountId) ?? MOUNTS[0];
  const gold = profile.gold ?? 0;
  const maxFloor = profile.mathDungeonFloor;
  const dailyDone = (profile.dailyQuestDoneIds ?? []).length;
  const dailyTotal = (profile.dailyQuestIds ?? []).length;

  const handleDungeon = (node: DungeonNode) => {
    speak(`${node.name}! Vælg hvilken etage du vil kæmpe på!`);
    setPickerNode(node);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 via-green-900 to-slate-900 flex flex-col overflow-hidden">

      {/* ── TOP BAR ── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-black/40 border-b border-white/10 z-10">
        <button onPointerDown={onSwitchProfile}
          className="text-white/70 text-3xl p-2 rounded-2xl bg-white/10 active:bg-white/20 select-none">
          👤
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-3xl select-none">{profile.avatar}</span>
            <span className="text-2xl select-none">{mount.emoji}</span>
            <div className="min-w-0">
              <p className="text-white font-black text-lg leading-tight truncate">{profile.name}</p>
              <p className="text-yellow-300 text-sm font-bold">{title.emoji} {title.label}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="bg-yellow-500/20 rounded-xl px-2 py-1">
            <span className="text-yellow-300 font-black text-sm">💰 {gold}</span>
          </div>
          <div className="text-right">
            <p className="text-white/50 text-xs">Etage</p>
            <p className="text-yellow-400 font-black text-xl">{maxFloor}/20</p>
          </div>
          <button onPointerDown={() => speak(`Hej ${profile.name}! Etage ${maxFloor}. ${gold} guld. Vælg en dungeon!`)}
            className="text-2xl p-2 rounded-2xl bg-white/10 active:bg-white/20 select-none text-white">
            🔊
          </button>
          <button onPointerDown={onHeroPanel}
            className="text-2xl p-2 rounded-2xl bg-yellow-500/20 active:bg-yellow-500/30 select-none text-yellow-300">
            🧙
          </button>
        </div>
      </div>

      {/* ── MAP AREA ── */}
      <div className="flex-1 relative overflow-hidden" style={{ minHeight: 420 }}>

        {/* Decorative trees */}
        {TREE_DECO.map((t, i) => (
          <div key={i} className="absolute pointer-events-none select-none text-2xl opacity-60"
            style={{ left: t.x, top: t.y, transform: "translate(-50%, -50%)" }}>
            🌲
          </div>
        ))}

        {/* Paths */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {DUNGEON_NODES.map((node) => (
            <line key={node.id}
              x1={CITY_X} y1={CITY_Y} x2={node.x} y2={node.y}
              stroke={node.available ? "rgba(253,224,71,0.5)" : "rgba(255,255,255,0.12)"}
              strokeWidth={node.available ? "3" : "2"}
              strokeDasharray={node.available ? "0" : "8 6"}
            />
          ))}
        </svg>

        {/* City / Castle (center) */}
        <div className="absolute z-10 flex flex-col items-center"
          style={{ left: CITY_X, top: CITY_Y, transform: "translate(-50%, -50%)" }}>
          <div className="relative">
            <div className="text-8xl animate-float select-none drop-shadow-2xl">🏰</div>
            <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-ping" style={{ animationDuration: "3s" }} />
          </div>
          <div className="mt-1 bg-yellow-500/80 backdrop-blur rounded-2xl px-4 py-1.5 shadow-lg">
            <p className="text-black font-black text-base">⚔️ Øvebyen</p>
          </div>
        </div>

        {/* Dungeon nodes */}
        {DUNGEON_NODES.map((node) => (
          <div key={node.id} className="absolute z-10"
            style={{ left: node.x, top: node.y, transform: "translate(-50%, -50%)" }}>
            <button onPointerDown={() => handleDungeon(node)}
              className="flex flex-col items-center group transition-transform active:scale-90 select-none">
              <div className="relative rounded-3xl p-4 shadow-2xl border-2 bg-gradient-to-b from-amber-700 to-amber-900 border-yellow-400 shadow-yellow-600/50">
                <div className="absolute inset-0 rounded-3xl bg-yellow-400/15 animate-pulse" />
                <div className="text-5xl select-none">
                  {node.emoji}
                </div>
                {node.id === "math" ? (
                  <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-black rounded-full w-7 h-7 flex items-center justify-center border-2 border-white">
                    {maxFloor}
                  </div>
                ) : (
                  <div className="absolute -top-2 -right-2 bg-slate-700 text-white text-xs font-black rounded-full w-7 h-7 flex items-center justify-center border-2 border-white">
                    {profile.subjectFloors?.[node.id] ?? 1}
                  </div>
                )}
              </div>
              <div className="mt-2 rounded-xl px-3 py-1 text-xs font-bold max-w-[100px] text-center leading-tight bg-yellow-400/90 text-black">
                {node.name.split(" ").slice(0, 2).join(" ")}
              </div>
            </button>
          </div>
        ))}

        {/* Hero token on map */}
        <div className="absolute z-10 animate-bounce-in"
          style={{ left: "50%", top: "60%", transform: "translate(-50%, -50%)" }}>
          <div className="flex flex-col items-center">
            <div className="text-4xl select-none drop-shadow-lg">{profile.avatar}</div>
            <div className="text-2xl select-none -mt-1">{mount.emoji}</div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="flex gap-3 px-4 py-3 bg-black/40 border-t border-white/10">
        <button
          onPointerDown={() => setPickerNode(DUNGEON_NODES.find((n) => n.id === "math") ?? DUNGEON_NODES[0])}
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black py-5 rounded-2xl text-xl shadow-xl active:scale-95 transition-transform select-none"
        >
          🧮 Ind i Dungeon! ⚔️
        </button>
        <button
          onPointerDown={onQuestBoard}
          className={`relative bg-white/10 border border-white/20 text-white font-bold px-5 py-5 rounded-2xl text-2xl active:bg-white/20 select-none ${dailyTotal > 0 ? "border-yellow-400/40" : ""}`}
        >
          📜
          {dailyTotal > 0 && dailyDone < dailyTotal && (
            <span className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
              {dailyTotal - dailyDone}
            </span>
          )}
          {dailyDone > 0 && dailyDone >= dailyTotal && (
            <span className="absolute -top-1.5 -right-1.5 bg-green-400 text-black text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
              ✓
            </span>
          )}
        </button>
      </div>

      {/* ── FLOOR PICKER MODAL ── */}
      {pickerNode && (() => {
        const isMath = pickerNode.id === "math";
        const totalFloors = isMath ? 20 : 10;
        const nodeMax = isMath
          ? maxFloor
          : (profile.subjectFloors?.[pickerNode.id] ?? 1);
        return (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm"
            onPointerDown={(e) => { if (e.target === e.currentTarget) setPickerNode(null); }}>
            <div className="bg-slate-900 rounded-t-3xl w-full max-w-lg p-5 pb-8 animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-black text-2xl">{pickerNode.emoji} {pickerNode.name}</h2>
                <button onPointerDown={() => setPickerNode(null)}
                  className="text-white/50 text-3xl active:text-white select-none">✕</button>
              </div>
              <p className="text-white/50 text-sm mb-4">
                Du har nået etage {nodeMax}. Vælg hvilken etage du vil kæmpe på:
              </p>
              <div className="grid grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1">
                {Array.from({ length: totalFloors }, (_, i) => i + 1).map((floor) => {
                  const monster = isMath ? (ETAGE_MONSTER[floor] ?? { emoji: "👹", name: "Uhyre" }) : { emoji: pickerNode.emoji, name: `Etage ${floor}` };
                  const isMax = floor === nodeMax;
                  const isLocked = floor > nodeMax;
                  return (
                    <button
                      key={floor}
                      disabled={isLocked}
                      onPointerDown={() => {
                        if (isLocked) return;
                        setPickerNode(null);
                        onEnterDungeon(pickerNode.id, floor);
                      }}
                      className={`flex flex-col items-center p-2 rounded-2xl text-center transition-all active:scale-95 select-none ${
                        isLocked
                          ? "bg-white/5 border border-white/5 opacity-30 cursor-not-allowed"
                          : isMax
                          ? "bg-yellow-400/20 border-2 border-yellow-400 ring-2 ring-yellow-400/40"
                          : "bg-white/10 active:bg-white/20 border border-white/10"
                      }`}
                    >
                      <span className="text-2xl leading-none">{isLocked ? "🔒" : monster.emoji}</span>
                      <span className="text-white font-black text-sm mt-1">E{floor}</span>
                      {isMax && !isLocked && <span className="text-yellow-400 text-xs font-bold">Max</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
