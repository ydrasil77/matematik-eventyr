"use client";
import { useState, useEffect, useCallback } from "react";
import { getSubject, getSubjectLevel } from "@/lib/subjectData";
import type { SubjectId, SubjectQuestion } from "@/lib/subjectData";
import { useTTS } from "@/lib/useTTS";

interface Props {
  subjectId: SubjectId;
  startFloor: number;
  playerName: string;
  onFloorCleared: (floor: number, correct: number, attempts: number) => void;
  onBack: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Phase = "intro" | "question" | "feedback" | "complete";

export default function SubjectGame({ subjectId, startFloor, playerName, onFloorCleared, onBack }: Props) {
  const subject = getSubject(subjectId);
  const { speak } = useTTS();

  const [floor, setFloor] = useState(startFloor);
  const [phase, setPhase]   = useState<Phase>("intro");
  const [queue, setQueue]   = useState<SubjectQuestion[]>([]);
  const [qIdx, setQIdx]     = useState(0);
  const [correct, setCorrect]     = useState(0);
  const [attempts, setAttempts]   = useState(0);
  const [selected, setSelected]   = useState<number | null>(null);
  const [streak, setStreak] = useState(0);
  const [xpGained, setXpGained]   = useState(0);

  const level = getSubjectLevel(subjectId, floor);

  const startFloorQuestions = useCallback(() => {
    if (!level) return;
    const q = shuffle(level.questions).slice(0, 5);
    setQueue(q);
    setQIdx(0);
    setCorrect(0);
    setAttempts(0);
    setSelected(null);
    setPhase("question");
  }, [level]);

  useEffect(() => {
    if (phase === "intro") {
      const t = setTimeout(() => startFloorQuestions(), 1800);
      return () => clearTimeout(t);
    }
  }, [phase, startFloorQuestions]);

  if (!subject || !level) {
    return (
      <div className="h-dvh bg-slate-900 flex items-center justify-center flex-col gap-4 overflow-hidden">
        <p className="text-white text-2xl">Emnet er ikke tilgængeligt endnu.</p>
        <button onPointerDown={onBack} className="bg-yellow-400 text-black font-black px-6 py-3 rounded-2xl">← Tilbage</button>
      </div>
    );
  }

  const currentQ = queue[qIdx];
  const totalQ   = queue.length;
  const progress = totalQ > 0 ? qIdx / totalQ : 0;

  const handleAnswer = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === currentQ.a;
    const newAttempts = attempts + 1;
    const newCorrect  = correct + (isCorrect ? 1 : 0);
    setAttempts(newAttempts);
    if (isCorrect) {
      setCorrect(newCorrect);
      setStreak((s) => s + 1);
      setXpGained((x) => x + 20 + streak * 5);
      speak("Korrekt!");
    } else {
      setStreak(0);
      speak("Prøv igen næste gang!");
    }
    setPhase("feedback");
    setTimeout(() => {
      setSelected(null);
      if (qIdx + 1 >= totalQ) {
        setPhase("complete");
        onFloorCleared(floor, newCorrect, newAttempts);
      } else {
        setQIdx((i) => i + 1);
        setPhase("question");
      }
    }, 1400);
  };

  const nextFloor = () => {
    const nextF = floor + 1;
    const nextLevel = getSubjectLevel(subjectId, nextF);
    if (nextLevel) {
      setFloor(nextF);
      setXpGained(0);
      setStreak(0);
      setPhase("intro");
    } else {
      onBack();
    }
  };

  // ── INTRO ──
  if (phase === "intro") {
    return (
      <div className={`h-dvh bg-gradient-to-b ${subject.gradient.replace("from-", "from-").replace("to-", "to-")} flex flex-col items-center justify-center p-6 gap-4 overflow-hidden`}>
        <div className="text-6xl animate-bounce select-none">{level.emoji}</div>
        <div className="text-center">
          <p className="text-white/70 text-sm font-bold">{subject.emoji} {subject.name}</p>
          <h1 className="text-white font-black text-2xl mt-1">{level.name}</h1>
          <p className="text-white/60 text-xs mt-1">{level.grade}</p>
          <p className="text-white/80 text-sm mt-1">{level.desc}</p>
        </div>
        <div className="bg-black/20 rounded-2xl px-6 py-2">
          <p className="text-white font-bold text-base">Etage {floor} / 10</p>
        </div>
        <div className="flex gap-1">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full ${i < floor ? "bg-yellow-400" : "bg-white/20"}`} />
          ))}
        </div>
        <p className="text-white/50 text-sm animate-pulse">Gør klar…</p>
      </div>
    );
  }

  // ── COMPLETE ──
  if (phase === "complete") {
    const pct = totalQ > 0 ? Math.round((correct / totalQ) * 100) : 0;
    const star = pct >= 80 ? "🌟" : pct >= 60 ? "⭐" : "💫";
    const hasNext = !!getSubjectLevel(subjectId, floor + 1);
    return (
      <div className={`h-dvh bg-gradient-to-b ${subject.gradient} flex flex-col items-center justify-center p-6 gap-4 overflow-hidden`}>
        <div className="text-6xl select-none animate-bounce">{star}</div>
        <h1 className="text-white font-black text-2xl text-center">Etage {floor} klaret!</h1>
        <div className="bg-black/30 rounded-2xl p-4 w-full max-w-xs space-y-2">
          <div className="flex justify-between text-white">
            <span>✅ Rigtige svar</span>
            <span className="font-black">{correct}/{totalQ}</span>
          </div>
          <div className="flex justify-between text-white">
            <span>📊 Nøjagtighed</span>
            <span className="font-black">{pct}%</span>
          </div>
          <div className="flex justify-between text-yellow-300">
            <span>✨ XP optjent</span>
            <span className="font-black">+{xpGained}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {hasNext && (
            <button onPointerDown={nextFloor}
              className="bg-yellow-400 text-black font-black py-4 rounded-2xl text-xl active:scale-95 transition-transform select-none">
              Næste etage →
            </button>
          )}
          <button onPointerDown={onBack}
            className="bg-white/20 text-white font-bold py-4 rounded-2xl text-lg active:scale-95 transition-transform select-none">
            ← Tilbage til kortet
          </button>
        </div>
      </div>
    );
  }

  // ── QUESTION ──
  if (!currentQ) return null;
  return (
    <div className={`h-dvh bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-4 pb-2 flex-shrink-0">
        <button onPointerDown={onBack}
          className="bg-white/10 text-white rounded-2xl px-4 py-3 text-xl active:bg-white/20 select-none">←</button>
        <div className="flex-1">
          <p className="text-white/50 text-xs">{subject.emoji} {subject.name} · Etage {floor}</p>
          <p className="text-white font-black text-sm">{level.name}</p>
        </div>
        <div className="text-right">
          <p className="text-yellow-400 font-black text-base">{qIdx + 1}/{totalQ}</p>
          {streak >= 2 && <p className="text-orange-400 text-xs font-bold">🔥 {streak} stribe!</p>}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-white/10 mx-4 rounded-full overflow-hidden mb-3 flex-shrink-0">
        <div className={`h-full bg-gradient-to-r ${subject.gradient} rounded-full transition-all duration-500`}
          style={{ width: `${progress * 100}%` }} />
      </div>

      {/* Question card */}
      <div className="mx-4 bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-4 mb-3 shadow-2xl border border-white/10 flex-shrink-0">
        <div className="text-4xl text-center mb-2 select-none">{level.emoji}</div>
        <p className="text-white font-bold text-lg text-center leading-tight">{currentQ.q}</p>
      </div>

      {/* Answer options */}
      <div className="px-4 grid grid-cols-2 gap-3 flex-1">
        {currentQ.opts.map((opt, i) => {
          let style = "bg-white/10 border-white/20 text-white active:scale-95";
          if (selected !== null) {
            if (i === currentQ.a) style = "bg-green-500 border-green-400 text-white scale-105";
            else if (i === selected) style = "bg-red-500 border-red-400 text-white";
            else style = "bg-white/5 border-white/10 text-white/40";
          }
          return (
            <button
              key={i}
              onPointerDown={() => handleAnswer(i)}
              disabled={selected !== null}
              className={`border-2 rounded-2xl flex items-center justify-center font-bold text-base text-center transition-all select-none ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {selected !== null && phase === "feedback" && (
        <div className={`mx-4 mt-2 mb-4 rounded-2xl p-3 text-center font-black text-lg flex-shrink-0 ${selected === currentQ.a ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
          {selected === currentQ.a
            ? `✅ Korrekt! ${streak >= 2 ? `🔥 ${streak} i træk!` : ""}`
            : `❌ Svaret var: ${currentQ.opts[currentQ.a]}`}
        </div>
      )}
    </div>
  );
}
