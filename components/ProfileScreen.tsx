"use client";
import { useState } from "react";
import type { Profile, HeroClass } from "@/lib/types";
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
  onAdd: (name: string, avatar: string, heroClass: HeroClass, pin: string) => void;
  onDelete: (id: string) => void;
}

// ── PIN numpad (re-mounts via key to reset digits after error) ───────────────
function PinPad({ onPin }: { onPin: (pin: string) => void }) {
  const [digits, setDigits] = useState("");

  const add = (d: string) => {
    if (digits.length >= 4) return;
    const next = digits + d;
    setDigits(next);
    if (next.length === 4) onPin(next);
  };
  const del = () => setDigits((p) => p.slice(0, -1));

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Dot indicators */}
      <div className="flex gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`w-5 h-5 rounded-full border-2 transition-all duration-200 ${
            i < digits.length ? "bg-white border-white scale-110" : "bg-transparent border-white/40"
          }`} />
        ))}
      </div>
      {/* Number grid */}
      <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
        {["1","2","3","4","5","6","7","8","9"].map((d) => (
          <button key={d} onPointerDown={() => add(d)}
            className="bg-white/20 text-white font-black text-3xl py-4 rounded-2xl active:scale-90 active:bg-white/40 transition-transform select-none">
            {d}
          </button>
        ))}
        <button onPointerDown={del}
          className="bg-white/10 text-white/60 font-black text-2xl py-4 rounded-2xl active:scale-90 transition-transform select-none">
          ⌫
        </button>
        <button onPointerDown={() => add("0")}
          className="bg-white/20 text-white font-black text-3xl py-4 rounded-2xl active:scale-90 active:bg-white/40 transition-transform select-none">
          0
        </button>
        <div />
      </div>
    </div>
  );
}

export default function ProfileScreen({ profiles, onSelect, onAdd, onDelete }: Props) {
  const [step, setStep] = useState<"list" | "avatar" | "name" | "class" | "pin">("list");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("🦁");
  const [heroClass, setHeroClass] = useState<HeroClass>("kriger");

  // PIN overlay states
  const [pinFor, setPinFor] = useState<Profile | null>(null);
  const [deleteFor, setDeleteFor] = useState<Profile | null>(null);
  const [pinError, setPinError] = useState(false);
  const [pinErrKey, setPinErrKey] = useState(0);

  const { speak } = useTTS();

  const reset = () => {
    setName(""); setAvatar("🦁"); setHeroClass("kriger"); setStep("list");
  };

  const triggerError = () => {
    setPinError(true);
    setPinErrKey((k) => k + 1);
    setTimeout(() => setPinError(false), 1500);
  };

  const handleLoginPin = (pin: string) => {
    if (!pinFor) return;
    if (!pinFor.pin || pin === pinFor.pin) {
      onSelect(pinFor);
      setPinFor(null);
    } else {
      triggerError();
    }
  };

  const handleDeletePin = (pin: string) => {
    if (!deleteFor) return;
    if (!deleteFor.pin || pin === deleteFor.pin) {
      onDelete(deleteFor.id);
      setDeleteFor(null);
    } else {
      triggerError();
    }
  };

  // ── PIN login screen ────────────────────────────────────────────────────────
  if (pinFor) {
    return (
      <div className="h-dvh bg-gradient-to-br from-violet-600 via-purple-700 to-pink-700 flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="bg-white/15 backdrop-blur rounded-3xl p-6 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-5">
            <div className="text-6xl mb-2 select-none">{pinFor.avatar}</div>
            <h2 className="text-2xl font-black text-white">{pinFor.name}</h2>
            <p className={`text-sm mt-1 font-bold transition-all duration-200 ${pinError ? "text-red-300" : "text-white/70"}`}>
              {pinError ? "❌ Forkert kode – prøv igen" : "Skriv din 4-cifrede kode 🔐"}
            </p>
          </div>
          <PinPad key={`login-${pinErrKey}`} onPin={handleLoginPin} />
          <button onPointerDown={() => { setPinFor(null); setPinError(false); }}
            className="mt-5 w-full text-white/60 font-bold py-3 rounded-2xl active:text-white select-none text-lg">
            ← Tilbage
          </button>
        </div>
      </div>
    );
  }

  // ── PIN delete confirmation screen ──────────────────────────────────────────
  if (deleteFor) {
    return (
      <div className="h-dvh bg-gradient-to-br from-red-700 via-rose-800 to-red-900 flex flex-col items-center justify-center p-6 overflow-hidden">
        <div className="bg-white/15 backdrop-blur rounded-3xl p-6 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-5">
            <div className="text-6xl mb-2 select-none">{deleteFor.avatar}</div>
            <h2 className="text-2xl font-black text-white">Slet {deleteFor.name}?</h2>
            <p className="text-white/60 text-xs mt-0.5">Al fremgang slettes permanent</p>
            <p className={`text-sm mt-2 font-bold transition-all duration-200 ${pinError ? "text-red-300" : "text-white/70"}`}>
              {pinError ? "❌ Forkert kode – prøv igen" : "Bekræft med din kode for at slette"}
            </p>
          </div>
          <PinPad key={`delete-${pinErrKey}`} onPin={handleDeletePin} />
          <button onPointerDown={() => { setDeleteFor(null); setPinError(false); }}
            className="mt-5 w-full text-white/60 font-bold py-3 rounded-2xl active:text-white select-none text-lg">
            ← Annuller
          </button>
        </div>
      </div>
    );
  }

  // ── Avatar selection step ───────────────────────────────────────────────────
  if (step === "avatar") {
    return (
      <div className="h-dvh bg-gradient-to-br from-violet-500 via-purple-600 to-pink-600 flex flex-col items-center justify-center p-4 overflow-hidden">
        <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl">
          <h2 className="text-2xl font-black text-gray-800 text-center mb-4">Vælg din avatar ✨</h2>
          <div className="grid grid-cols-6 gap-2 mb-4">
            {AVATARS.map((a) => (
              <button key={a} onPointerDown={() => setAvatar(a)}
                className={`text-3xl p-2 rounded-xl transition-all select-none ${
                  avatar === a ? "bg-purple-100 ring-4 ring-purple-400 scale-110" : "bg-gray-50 active:scale-95"
                }`}>
                {a}
              </button>
            ))}
          </div>
          <div className="flex gap-3">
            <button onPointerDown={() => setStep("list")}
              className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl text-lg active:scale-95 select-none">
              ← Tilbage
            </button>
            <button onPointerDown={() => setStep("name")}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-4 rounded-2xl text-lg shadow-lg active:scale-95 select-none">
              {avatar} Videre
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Name step ───────────────────────────────────────────────────────────────
  if (step === "name") {
    return (
      <div className="h-dvh bg-gradient-to-br from-violet-500 via-purple-600 to-pink-600 flex flex-col items-center justify-center p-4 overflow-hidden">
        <div className="bg-white rounded-3xl p-5 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-4">
            <div className="text-6xl mb-2 select-none">{avatar}</div>
            <h2 className="text-2xl font-black text-gray-800">Hvad hedder du?</h2>
          </div>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && name.trim() && setStep("class")}
            placeholder="Dit navn..." maxLength={20} autoFocus
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 text-2xl focus:outline-none focus:border-purple-400 text-center font-bold"
          />
          <div className="flex gap-3 mt-4">
            <button onPointerDown={() => setStep("avatar")}
              className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl text-lg active:scale-95 select-none">
              ← Tilbage
            </button>
            <button onPointerDown={() => name.trim() && setStep("class")} disabled={!name.trim()}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black py-4 rounded-2xl text-lg shadow-lg disabled:opacity-40 active:scale-95 select-none">
              Videre →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Hero class step ─────────────────────────────────────────────────────────
  if (step === "class") {
    return (
      <div className="h-dvh bg-gradient-to-b from-slate-900 to-purple-950 flex flex-col p-4 overflow-hidden">
        <div className="text-center mb-3 flex-shrink-0">
          <div className="text-5xl mb-1 select-none">{avatar}</div>
          <h2 className="text-2xl font-black text-white">{name}</h2>
          <p className="text-white/60 text-base mt-0.5">Vælg din helteklasse</p>
        </div>
        <div className="flex flex-col gap-2 flex-1 min-h-0 overflow-y-auto">
          {HERO_CLASSES.map((hc) => (
            <button key={hc.id} onPointerDown={() => { setHeroClass(hc.id); speak(`${hc.name}. ${hc.bonus}`); }}
              className={`rounded-2xl p-3 text-left transition-all select-none bg-gradient-to-r ${hc.gradient} ${
                heroClass === hc.id ? "ring-4 ring-yellow-400 shadow-2xl" : "opacity-80"
              }`}>
              <div className="flex items-center gap-3">
                <div className="text-4xl select-none">{hc.emoji}</div>
                <div className="flex-1">
                  <p className="text-white font-black text-lg">{hc.name}</p>
                  <p className="text-white/70 text-sm">{hc.desc}</p>
                  <p className="text-yellow-300 text-sm font-bold">⚡ {hc.bonus}</p>
                </div>
                {heroClass === hc.id && <span className="text-yellow-400 text-2xl">✓</span>}
              </div>
            </button>
          ))}
        </div>
        <div className="flex gap-3 mt-3 flex-shrink-0">
          <button onPointerDown={() => setStep("name")}
            className="flex-1 bg-white/10 text-white font-bold py-4 rounded-2xl text-lg active:scale-95 select-none">
            ← Tilbage
          </button>
          <button onPointerDown={() => setStep("pin")}
            className="flex-1 bg-yellow-400 text-black font-black py-4 rounded-2xl text-lg shadow-lg active:scale-95 select-none">
            Videre →
          </button>
        </div>
      </div>
    );
  }

  // ── PIN creation step ───────────────────────────────────────────────────────
  if (step === "pin") {
    return (
      <div className="h-dvh bg-gradient-to-br from-violet-500 via-purple-600 to-pink-600 flex flex-col items-center justify-center p-4 overflow-hidden">
        <div className="bg-white/15 backdrop-blur rounded-3xl p-6 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-5">
            <div className="text-5xl mb-2 select-none">{avatar}</div>
            <h2 className="text-2xl font-black text-white">Vælg din hemmelige kode</h2>
            <p className="text-white/70 text-sm mt-1">4 tal du kan huske 🔐</p>
          </div>
          <PinPad onPin={(pin) => { onAdd(name.trim(), avatar, heroClass, pin); reset(); }} />
          <button onPointerDown={() => setStep("class")}
            className="mt-5 w-full text-white/60 font-bold py-3 rounded-2xl active:text-white select-none text-lg">
            ← Tilbage
          </button>
        </div>
      </div>
    );
  }

  // ── Profile list (main screen) ──────────────────────────────────────────────
  return (
    <div className="h-dvh bg-gradient-to-br from-violet-600 via-purple-700 to-pink-700 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="text-center pt-6 pb-3 px-6 flex-shrink-0">
        <div className="text-6xl mb-1 animate-float select-none">🏰</div>
        <h1 className="text-3xl font-black text-white drop-shadow-lg">Øvebog</h1>
        <p className="text-base text-white/80 mt-1">Hvem vil på eventyr i dag? ⚔️</p>
      </div>

      {/* Scrollable profile list */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-3 flex flex-col gap-3">
        {profiles.map((p) => (
          <div key={p.id} className="relative flex-shrink-0">
            <button onPointerDown={() => { if (!p.pin) { onSelect(p); } else { setPinFor(p); } }}
              className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-2xl p-4 flex items-center gap-4 active:scale-95 transition-transform select-none">
              <div className="text-5xl select-none">{p.avatar}</div>
              <div className="text-left flex-1">
                <div className="text-xl font-black text-white">{p.name}</div>
                <div className="text-white/70 text-sm mt-0.5">
                  Etage {p.mathDungeonFloor ?? 1}/20 · {p.mathXP ?? 0} XP ⚔️
                </div>
              </div>
              <div className="flex items-center gap-2">
                {p.pin && <span className="text-white/40 text-lg select-none">🔐</span>}
                <button onPointerDown={(e) => { e.stopPropagation(); setDeleteFor(p); }}
                  className="text-white/50 text-2xl p-2 rounded-xl active:text-red-300 select-none">
                  🗑️
                </button>
              </div>
            </button>
          </div>
        ))}
        {profiles.length === 0 && (
          <p className="text-center text-white/60 text-base mt-6">
            Ingen helte endnu. Opret din første helt! 👆
          </p>
        )}
      </div>

      {/* Fixed bottom button */}
      <div className="px-5 pb-6 pt-3 flex-shrink-0">
        <button onPointerDown={() => setStep("avatar")}
          className="w-full bg-white text-purple-700 font-black py-5 rounded-2xl text-2xl shadow-xl active:scale-95 transition-transform select-none">
          + Ny helt
        </button>
      </div>
    </div>
  );
}
