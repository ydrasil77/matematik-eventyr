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
  floor?: number;
}

const CITY_X = "50%";
const CITY_Y = "46%";

const DUNGEON_NODES: DungeonNode[] = [
  { id: "math",     name: "Matematikens Fæstning", emoji: "🧮", x: "50%",  y: "80%",  available: true,  desc: "Tal, regning og algebra" },
  { id: "reading",  name: "Bogstavernes Tårn",     emoji: "📖", x: "12%",  y: "42%",  available: false, desc: "Læsning – kommer snart!" },
  { id: "history",  name: "Historiens Ruiner",     emoji: "🏛️", x: "88%",  y: "32%",  available: false, desc: "Historie – kommer snart!" },
  { id: "physics",  name: "Fysikkens Fyr",         emoji: "⚡", x: "82%",  y: "62%",  available: false, desc: "Fysik – kommer snart!"   },
  { id: "biology",  name: "Biologiens Skov",       emoji: "🌿", x: "18%",  y: "68%",  available: false, desc: "Biologi – kommer snart!" },
  { id: "language", name: "Sprogenes Portal",      emoji: "🌍", x: "50%",  y: "14%",  available: false, desc: "Sprog – kommer snart!"   },
];

const TREE_DECO = [
  { x: "5%",  y: "10%" }, { x: "20%", y: "5%"  }, { x: "35%", y: "8%"  },
  { x: "65%", y: "6%"  }, { x: "78%", y: "10%" }, { x: "92%", y: "8%"  },
  { x: "5%",  y: "25%" }, { x: "8%",  y: "58%" }, { x: "5%",  y: "80%" },
  { x: "92%", y: "48%" }, { x: "94%", y: "72%" }, { x: "90%", y: "86%" },
  { x: "30%", y: "92%" }, { x: "65%", y: "93%" }, { x: "78%", y: "89%" },
  { x: "25%", y: "28%" }, { x: "72%", y: "20%" }, { x: "40%", y: "30%" },
];

interface Props {
  profile: Profile;
  onEnterDungeon: (id: string) => void;
  onHeroPanel: () => void;
  onSwitchProfile: () => void;
  onQuestBoard: () => void;
}

export default function CityMap({ profile, onEnterDungeon, onHeroPanel, onSwitchProfile, onQuestBoard }: Props) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const { speak } = useTTS();
  const title = getEarnedTitle(profile.mathDungeonFloor);
  const mount = MOUNTS.find((m) => m.id === profile.mountId) ?? MOUNTS[0];

  const handleDungeon = (node: DungeonNode) => {
    if (node.available) {
      speak(`Går ind i ${node.name}!`);
      onEnterDungeon(node.id);
    } else {
      speak(`${node.name} er endnu ikke tilgængelig. Kom snart!`);
      setTooltip(node.id);
      setTimeout(() => setTooltip(null), 2200);
    }
  };

  const mathNode = DUNGEON_NODES.find((d) => d.id === "math")!;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-950 via-green-900 to-slate-900 flex flex-col overflow-hidden">

      {/* ── TOP BAR ── */}
      <div className="flex items-center gap-3 px-4 py-3 bg-black/40 border-b border-white/10 z-10">
        <button onPointerDown={onSwitchProfile}
          className="text-white/70 text-3xl p-2 rounded-2xl bg-white/10 active:bg-white/20 select-none">
          👤
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-4xl select-none">{profile.avatar}</span>
            <span className="text-2xl select-none">{mount.emoji}</span>
            <div>
              <p className="text-white font-black text-xl leading-tight">{profile.name}</p>
              <p className="text-yellow-300 text-base font-bold">{title.emoji} {title.label}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-white/60 text-sm">Etage</p>
          <p className="text-yellow-400 font-black text-2xl">{profile.mathDungeonFloor}/20</p>
        </div>
        <button onPointerDown={() => speak(`Hej ${profile.name}! Velkommen til Øvebyen! Vælg en dungeon for at starte et eventyr!`)}
          className="text-3xl p-2 rounded-2xl bg-white/10 active:bg-white/20 select-none text-white">
          🔊
        </button>
        <button onPointerDown={onHeroPanel}
          className="text-3xl p-2 rounded-2xl bg-yellow-500/20 active:bg-yellow-500/30 select-none text-yellow-300">
          🧙
        </button>
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

        {/* Paths (SVG lines from city to each dungeon) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
          {DUNGEON_NODES.map((node) => (
            <line
              key={node.id}
              x1={CITY_X} y1={CITY_Y}
              x2={node.x} y2={node.y}
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
            <button
              onPointerDown={() => handleDungeon(node)}
              className={`flex flex-col items-center group transition-transform active:scale-90 select-none`}
            >
              <div className={`relative rounded-3xl p-4 shadow-2xl border-2 ${
                node.available
                  ? "bg-gradient-to-b from-amber-700 to-amber-900 border-yellow-400 shadow-yellow-600/50"
                  : "bg-gray-900/80 border-gray-700"
              }`}>
                {node.available && (
                  <div className="absolute inset-0 rounded-3xl bg-yellow-400/15 animate-pulse" />
                )}
                <div className={`text-5xl select-none ${node.available ? "" : "grayscale opacity-50"}`}>
                  {node.emoji}
                </div>
                {/* Math floor indicator */}
                {node.id === "math" && (
                  <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs font-black rounded-full w-7 h-7 flex items-center justify-center border-2 border-white">
                    {profile.mathDungeonFloor}
                  </div>
                )}
                {!node.available && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-3xl">
                    <span className="text-2xl select-none opacity-60">🔒</span>
                  </div>
                )}
              </div>
              <div className={`mt-2 rounded-xl px-3 py-1 text-xs font-bold max-w-[100px] text-center leading-tight ${
                node.available ? "bg-yellow-400/90 text-black" : "bg-black/60 text-gray-400"
              }`}>
                {node.name.split(" ").slice(0, 2).join(" ")}
              </div>
            </button>

            {/* Tooltip for locked */}
            {tooltip === node.id && (
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-4 py-3 shadow-xl z-20 w-40 text-center animate-bounce-in">
                <p className="font-black text-gray-800 text-sm">{node.name}</p>
                <p className="text-gray-500 text-xs mt-1">🔜 Kommer snart!</p>
              </div>
            )}
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
          onPointerDown={() => onEnterDungeon("math")}
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black py-5 rounded-2xl text-xl shadow-xl active:scale-95 transition-transform select-none"
        >
          🧮 Ind i Dungeon! ⚔️
        </button>
        <button
          onPointerDown={onQuestBoard}
          className="bg-white/10 border border-white/20 text-white font-bold px-5 py-5 rounded-2xl text-2xl active:bg-white/20 select-none"
        >
          ⚔️
        </button>
      </div>
    </div>
  );
}
