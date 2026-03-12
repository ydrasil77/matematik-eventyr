"use client";
import { useState } from "react";
import type { Profile } from "@/lib/types";
import type { HeroClass } from "@/lib/types";
import { HERO_CLASSES } from "@/lib/achievements";
import { useTTS } from "@/lib/useTTS";

const AVATARS = [
  "🦁", "🐯", "🦊", "🐸", "🦄", "🐉",
  "🌟", "🚀", "🎯", "🌈", "🦋", "🐬",
  "🦖", "🐧", "🦉", "🌺", "🐼", "🦓",
  "🧸", "🐊", "🦒", "🐙", "🦕", "🐳",
];

interface Props {
  profiles: Profile[];
  onSelect: (p: Profile) => void;
  onAdd: (name: string, avatar: string, heroClass: HeroClass) => void;
  onDelete: (id: string) => void;
}

export default function ProfileScreen({ profiles, onSelect, onAdd, onDelete }: Props) {
  const [step, setStep] = useState<"list" | "avatar" | "name" | "class">("list");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🦁");
  const [heroClass, setHeroClass] = useState<HeroClass>("kriger");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { speak } = useTTS();

  const submit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), avatar, heroClass);
    setName("");
    setAvatar("🦁");
    setHeroClass("kriger");
    setStep("list");
  };

  if (step === "avatar") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-600 to-pink-600 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
          <h2 className="text-4xl font-black text-gray-800 text-center mb-6">Vælg din avatar ✨</h2>
          <div className="grid grid-cols-4 gap-3 mb-6">
            {AVATARS.map((a) => (
              <button key={a} onPointerDown={() => setAvatar(a)}
                className={`text-5xl p-3 rounded-2xl transition-all select-none ${
                  avatar === a ? "bg-purple-100 ring-4 ring-purple-400 scale-110" : "bg-gray-50 active:scale-95"
                }`}>
                {a}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onPointerDown={() => setStep("list")}
              className="flex-1 bg-gray-100 text-gray-600 font-bold py-5 rounded-2xl text-xl active:scale-95 select-none">
              ← Tilbage
            </button>
            <button onPointerDown={() => setStep("name")}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-5 rounded-2xl text-xl shadow-lg active:scale-95 select-none">
              {avatar} Videre
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "name") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-600 to-pink-600 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-6">
            <div className="text-8xl mb-2 select-none">{avatar}</div>
            <h2 className="text-4xl font-black text-gray-800">Hvad hedder du?</h2>
          </div>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep("class")}
            placeholder="Dit navn..." maxLength={20} autoFocus
            className="w-full border-2 border-gray-200 rounded-2xl px-5 py-5 text-3xl focus:outline-none focus:border-purple-400 text-center font-bold"
          />
          <div className="flex gap-3 mt-6">
            <button onPointerDown={() => setStep("avatar")}
              className="flex-1 bg-gray-100 text-gray-600 font-bold py-5 rounded-2xl text-xl active:scale-95 select-none">
              ← Tilbage
            </button>
            <button onPointerDown={() => name.trim() && setStep("class")} disabled={!name.trim()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-5 rounded-2xl text-xl shadow-lg disabled:opacity-40 active:scale-95 select-none">
              Videre →
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "class") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-purple-950 flex flex-col p-6">
        <div className="text-center mb-6">
          <div className="text-7xl mb-2 select-none">{avatar}</div>
          <h2 className="text-4xl font-black text-white">{name}</h2>
          <p className="text-white/60 text-xl mt-1">Vælg din helteklasse</p>
        </div>
        <div className="flex flex-col gap-4 flex-1 overflow-y-auto">
          {HERO_CLASSES.map((hc) => (
            <button key={hc.id} onPointerDown={() => { setHeroClass(hc.id); speak(`${hc.name}. ${hc.bonus}`); }}
              className={`rounded-3xl p-5 text-left transition-all select-none bg-gradient-to-r ${hc.gradient} ${
                heroClass === hc.id ? "ring-4 ring-yellow-400 scale-[1.02] shadow-2xl" : "opacity-80"
              }`}>
              <div className="flex items-center gap-4">
                <div className="text-6xl select-none">{hc.emoji}</div>
                <div className="flex-1">
                  <p className="text-white font-black text-2xl">{hc.name}</p>
                  <p className="text-white/70 text-base">{hc.desc}</p>
                  <p className="text-yellow-300 text-base font-bold mt-1">⚡ {hc.bonus}</p>
                </div>
                {heroClass === hc.id && <span className="text-yellow-400 text-3xl">✓</span>}
              </div>
            </button>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button onPointerDown={() => setStep("name")}
            className="flex-1 bg-white/10 text-white font-bold py-5 rounded-2xl text-xl active:scale-95 select-none">
            ← Tilbage
          </button>
          <button onPointerDown={submit}
            className="flex-1 bg-yellow-400 text-black font-black py-5 rounded-2xl text-xl shadow-lg active:scale-95 select-none">
            {avatar} Opret helt!
          </button>
        </div>
      </div>
    );
  }

  // "list" step — main profile selection screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-600 via-purple-700 to-pink-700 flex flex-col p-6">
      <div className="text-center mb-10">
        <div className="text-9xl mb-4 animate-float select-none">🏰</div>
        <h1 className="text-6xl font-black text-white drop-shadow-lg">Øvebog</h1>
        <p className="text-2xl text-white/80 mt-3">Hvem vil på eventyr i dag? ⚔️</p>
      </div>

      <div className="flex flex-col gap-5 mb-8">
        {profiles.map((p) => (
          <div key={p.id} className="relative">
            {confirmDelete === p.id && (
              <div className="absolute inset-0 z-10 bg-red-500 rounded-3xl flex items-center justify-center gap-3 px-4">
                <span className="text-white font-bold text-xl flex-1">Slet {p.name}?</span>
                <button onPointerDown={() => { onDelete(p.id); setConfirmDelete(null); }}
                  className="bg-white text-red-600 font-black px-5 py-4 rounded-2xl text-xl active:scale-95 select-none">
                  Ja ✓
                </button>
                <button onPointerDown={() => setConfirmDelete(null)}
                  className="bg-white/30 text-white font-bold px-5 py-4 rounded-2xl text-xl active:scale-95 select-none">
                  Nej ✗
                </button>
              </div>
            )}
            <button onPointerDown={() => onSelect(p)}
              className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-3xl p-5 flex items-center gap-5 active:scale-95 transition-transform select-none">
              <div className="text-8xl select-none">{p.avatar}</div>
              <div className="text-left flex-1">
                <div className="text-3xl font-black text-white">{p.name}</div>
                <div className="text-white/70 text-lg mt-1">
                  Etage {p.mathDungeonFloor ?? 1}/20 · {p.mathXP ?? 0} XP ⚔️
                </div>
              </div>
              <button onPointerDown={(e) => { e.stopPropagation(); setConfirmDelete(p.id); }}
                className="text-white/50 text-3xl p-3 rounded-2xl active:text-red-300 select-none">
                🗑️
              </button>
            </button>
          </div>
        ))}
      </div>

      <button onPointerDown={() => setStep("avatar")}
        className="w-full bg-white text-purple-700 font-black py-7 rounded-3xl text-3xl shadow-xl active:scale-95 transition-transform select-none">
        + Ny helt
      </button>

      {profiles.length === 0 && (
        <p className="text-center text-white/60 text-xl mt-8">
          Ingen helte endnu. Opret din første helt! 👆
        </p>
      )}
    </div>
  );
}
