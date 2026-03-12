"use client";
import { useState } from "react";
import type { Profile } from "@/lib/types";
import { useTTS } from "@/lib/useTTS";

interface Subject {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  gradient: string;
  available: boolean;
}

const SUBJECTS: Subject[] = [
  { id: "math",    name: "Matematik", emoji: "🧮", desc: "Tal, regning og geometri",      gradient: "from-violet-500 to-purple-700",  available: true  },
  { id: "reading", name: "Læsning",   emoji: "📖", desc: "Bogstaver og historier",        gradient: "from-sky-500 to-blue-700",       available: false },
  { id: "english", name: "Engelsk",   emoji: "🇬🇧", desc: "Learn English words!",         gradient: "from-red-500 to-rose-700",       available: false },
  { id: "german",  name: "Tysk",      emoji: "🇩🇪", desc: "Deutsch lernen!",              gradient: "from-yellow-500 to-amber-700",   available: false },
  { id: "french",  name: "Fransk",    emoji: "🇫🇷", desc: "Parler français!",             gradient: "from-blue-500 to-indigo-700",    available: false },
  { id: "biology", name: "Biologi",   emoji: "🌿", desc: "Planter, dyr og kroppen",      gradient: "from-green-500 to-emerald-700",  available: false },
  { id: "physics", name: "Fysik",     emoji: "⚡", desc: "Kraft, energi og lys",         gradient: "from-cyan-500 to-blue-700",      available: false },
  { id: "history", name: "Historie",  emoji: "🏛️", desc: "Vikinger og verdenshistorien", gradient: "from-orange-500 to-amber-700",   available: false },
];

interface Props {
  profile: Profile;
  onSubject: (id: string) => void;
  onBack: () => void;
}

export default function SubjectHub({ profile, onSubject, onBack }: Props) {
  const [toast, setToast] = useState<string | null>(null);
  const { speak } = useTTS();

  const handleSubject = (s: Subject) => {
    if (s.available) {
      onSubject(s.id);
    } else {
      speak(`${s.name} kommer snart!`);
      setToast(s.name);
      setTimeout(() => setToast(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col p-5">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onPointerDown={onBack}
          className="text-white bg-white/10 rounded-2xl px-5 py-5 text-2xl active:bg-white/20 select-none"
        >
          ←
        </button>
        <div className="flex items-center gap-4 flex-1">
          <div className="text-7xl select-none">{profile.avatar}</div>
          <div>
            <p className="text-white/60 text-lg">Hej,</p>
            <p className="text-white text-4xl font-black">{profile.name}!</p>
          </div>
        </div>
        <button
          onPointerDown={() => speak(`Hej ${profile.name}! Tryk på et fag for at lære noget nyt i dag!`)}
          className="text-white bg-white/10 rounded-2xl px-4 py-5 text-3xl active:bg-white/20 select-none"
        >
          🔊
        </button>
      </div>

      <p className="text-white/80 text-2xl mb-6 text-center font-bold">
        📚 Hvad vil du lære i dag?
      </p>

      {/* Subject grid */}
      <div className="grid grid-cols-2 gap-4">
        {SUBJECTS.map((s) => (
          <button
            key={s.id}
            onPointerDown={() => handleSubject(s)}
            className={`relative rounded-3xl p-6 text-left active:scale-95 transition-transform select-none bg-gradient-to-br ${s.gradient} shadow-xl`}
          >
            <div className="text-7xl mb-3 select-none">{s.emoji}</div>
            <div className="text-white font-black text-2xl">{s.name}</div>
            <div className="text-white/70 text-base mt-1">{s.desc}</div>
            <div className="mt-3">
              {s.available ? (
                <span className="bg-white/25 text-white text-sm font-bold px-3 py-1 rounded-full">
                  ✅ Spil nu!
                </span>
              ) : (
                <span className="bg-black/25 text-white/80 text-sm font-bold px-3 py-1 rounded-full">
                  🔜 Snart
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white rounded-3xl px-8 py-6 shadow-2xl animate-slide-up z-50 text-center">
          <p className="font-black text-2xl text-gray-800">{toast} 🔜</p>
          <p className="text-gray-500 text-lg mt-1">Vi arbejder på det!</p>
        </div>
      )}
    </div>
  );
}
