"use client";

import { useReducer, useEffect, useRef, useState } from "react";
import {
  LEVELS,
  BADGES,
  generateProblem,
  getProgressiveHints,
  GROWTH_MINDSET_CORRECT,
  GROWTH_MINDSET_WRONG,
  type LevelConfig,
  type Problem,
} from "@/lib/gameData";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Screen = "setup" | "home" | "map" | "playing" | "levelup";

interface GameState {
  screen: Screen;
  playerName: string;
  currentLevelId: number;
  xp: number;
  streak: number;
  dailyStreak: number;
  lastPlayedDate: string;
  totalCorrect: number;
  roundCorrect: number;
  roundAttempts: number;
  unlockedLevels: number[];
  earnedBadgeIds: string[];
  problem: Problem | null;
  feedback: "idle" | "correct" | "wrong";
  wrongOptions: string[];
  wrongAttempts: number;
  hintLevel: number;
  timerEnabled: boolean;
  timeLeft: number;
  xpGained: number;
  encouragement: string;
}

type Action =
  | { type: "SET_NAME"; name: string }
  | { type: "GO_HOME" }
  | { type: "GO_MAP" }
  | { type: "START_LEVEL"; levelId: number }
  | { type: "ANSWER"; option: string }
  | { type: "NEXT_QUESTION" }
  | { type: "ADVANCE_HINT" }
  | { type: "TOGGLE_TIMER" }
  | { type: "TICK_TIMER" }
  | { type: "FINISH_LEVELUP" }
  | { type: "LOAD"; state: Partial<GameState> };

// ─── Helpers ───────────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getLevel(id: number): LevelConfig {
  return LEVELS.find((l) => l.id === id) ?? LEVELS[0];
}

function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

function checkBadges(state: GameState, newXp: number, newStreak: number, newLevel: number): string[] {
  const earned = [...state.earnedBadgeIds];
  for (const b of BADGES) {
    if (earned.includes(b.id)) continue;
    if ("xpNeeded" in b && b.xpNeeded !== undefined && newXp >= b.xpNeeded) earned.push(b.id);
    if ("streakNeeded" in b && b.streakNeeded !== undefined && newStreak >= b.streakNeeded) earned.push(b.id);
    if ("levelNeeded" in b && b.levelNeeded !== undefined && newLevel >= b.levelNeeded) earned.push(b.id);
  }
  return earned;
}

// ─── Reducer ───────────────────────────────────────────────────────────────────

const TIMER_SECONDS = 30;

const INITIAL: GameState = {
  screen: "setup",
  playerName: "",
  currentLevelId: 1,
  xp: 0,
  streak: 0,
  dailyStreak: 1,
  lastPlayedDate: "",
  totalCorrect: 0,
  roundCorrect: 0,
  roundAttempts: 0,
  unlockedLevels: [1],
  earnedBadgeIds: [],
  problem: null,
  feedback: "idle",
  wrongOptions: [],
  wrongAttempts: 0,
  hintLevel: 0,
  timerEnabled: false,
  timeLeft: TIMER_SECONDS,
  xpGained: 0,
  encouragement: "",
};

function reducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case "LOAD":
      return { ...state, ...action.state };

    case "SET_NAME": {
      const today = todayISO();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yISO = yesterday.toISOString().split("T")[0];
      let dailyStreak = state.dailyStreak || 1;
      if (state.lastPlayedDate === yISO) dailyStreak += 1;
      else if (state.lastPlayedDate && state.lastPlayedDate !== today) dailyStreak = 1;
      return { ...state, playerName: action.name, screen: "home" as Screen, lastPlayedDate: today, dailyStreak };
    }

    case "GO_HOME":
      return { ...state, screen: "home", problem: null, feedback: "idle" };

    case "GO_MAP":
      return { ...state, screen: "map" };

    case "START_LEVEL": {
      const level = getLevel(action.levelId);
      const today = todayISO();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yISO = yesterday.toISOString().split("T")[0];
      let dailyStreak = state.dailyStreak || 1;
      if (state.lastPlayedDate === yISO) dailyStreak += 1;
      else if (state.lastPlayedDate && state.lastPlayedDate !== today) dailyStreak = 1;
      return {
        ...state,
        screen: "playing",
        currentLevelId: action.levelId,
        roundCorrect: 0,
        roundAttempts: 0,
        problem: generateProblem(level),
        feedback: "idle",
        wrongOptions: [],
        wrongAttempts: 0,
        hintLevel: 0,
        timeLeft: TIMER_SECONDS,
        xpGained: 0,
        lastPlayedDate: today,
        dailyStreak,
      };
    }

    case "ANSWER": {
      if (state.feedback === "correct" || !state.problem) return state;
      if (state.wrongOptions.includes(String(action.option))) return state;
      const level = getLevel(state.currentLevelId);
      const correct =
        String(action.option).trim().toLowerCase() ===
        String(state.problem.answer).trim().toLowerCase();

      if (correct) {
        const firstTry = state.wrongAttempts === 0;
        const speedBonus = state.timerEnabled && state.timeLeft > 20 ? 1.5 : 1;
        const streakMult = state.streak >= 4 ? 2 : state.streak >= 2 ? 1.5 : 1;
        const firstTryBonus = firstTry ? 1 : 0.7;
        const gained = Math.round(level.xpPerCorrect * streakMult * firstTryBonus * speedBonus);
        const newXp = state.xp + gained;
        const newStreak = firstTry ? state.streak + 1 : state.streak;
        const newCorrect = state.totalCorrect + 1;
        const newRound = state.roundCorrect + 1;
        const newAttempts = state.roundAttempts + 1;

        let newUnlocked = [...state.unlockedLevels];
        let nextScreen: Screen = "playing";
        if (newRound >= level.questionsPerRound) {
          const nextId = level.id + 1;
          if (nextId <= LEVELS.length && !newUnlocked.includes(nextId)) {
            newUnlocked.push(nextId);
          }
          nextScreen = "levelup";
        }

        const newBadges = checkBadges(state, newXp, newStreak, level.id);
        return {
          ...state,
          feedback: "correct",
          xp: newXp,
          streak: newStreak,
          totalCorrect: newCorrect,
          roundCorrect: newRound,
          roundAttempts: newAttempts,
          unlockedLevels: newUnlocked,
          earnedBadgeIds: newBadges,
          xpGained: gained,
          screen: nextScreen,
          encouragement: pick(GROWTH_MINDSET_CORRECT),
        };
      } else {
        const wrongAttempts = state.wrongAttempts + 1;
        return {
          ...state,
          feedback: "wrong",
          wrongOptions: [...state.wrongOptions, String(action.option)],
          wrongAttempts,
          roundAttempts: state.roundAttempts + 1,
          hintLevel: Math.min(wrongAttempts, 3),
          encouragement: pick(GROWTH_MINDSET_WRONG),
        };
      }
    }

    case "NEXT_QUESTION": {
      const level = getLevel(state.currentLevelId);
      return {
        ...state,
        problem: generateProblem(level),
        feedback: "idle",
        wrongOptions: [],
        wrongAttempts: 0,
        hintLevel: 0,
        timeLeft: TIMER_SECONDS,
        xpGained: 0,
      };
    }

    case "ADVANCE_HINT":
      return { ...state, hintLevel: Math.min(state.hintLevel + 1, 3) };

    case "TOGGLE_TIMER":
      return { ...state, timerEnabled: !state.timerEnabled, timeLeft: TIMER_SECONDS };

    case "TICK_TIMER": {
      if (state.feedback !== "idle" || !state.timerEnabled) return state;
      const newTime = state.timeLeft - 1;
      if (newTime <= 0) {
        return {
          ...state,
          timeLeft: 0,
          hintLevel: 3,
          feedback: "wrong",
          wrongAttempts: state.wrongAttempts + 1,
          roundAttempts: state.roundAttempts + 1,
          encouragement: "Tid er gået! Se svaret nedenfor 🕐",
        };
      }
      return { ...state, timeLeft: newTime };
    }

    case "FINISH_LEVELUP":
      return { ...state, screen: "home", feedback: "idle" };

    default:
      return state;
  }
}

// ─── Persistence ───────────────────────────────────────────────────────────────

const SAVE_KEY = "matematik-eventyr-v3";

function saveState(s: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify({
      playerName: s.playerName,
      currentLevelId: s.currentLevelId,
      xp: s.xp,
      streak: s.streak,
      dailyStreak: s.dailyStreak,
      lastPlayedDate: s.lastPlayedDate,
      totalCorrect: s.totalCorrect,
      unlockedLevels: s.unlockedLevels,
      earnedBadgeIds: s.earnedBadgeIds,
      timerEnabled: s.timerEnabled,
    }));
  } catch {}
}

function loadState(): Partial<GameState> | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<GameState>;
  } catch {
    return null;
  }
}

// ─── Sub-components ────────────────────────────────────────────────────────────

// VisualAid – emoji grid for early levels
function VisualAid({ visual }: { visual: NonNullable<Problem["visual"]> }) {
  const maxShow = 10;
  const left = visual.left.slice(0, maxShow);
  const right = visual.right.slice(0, maxShow);
  return (
    <div className="flex items-center justify-center gap-3 flex-wrap my-3 p-3 bg-white/60 rounded-2xl border border-white">
      <div className="flex flex-wrap gap-1 justify-center max-w-[140px]">
        {left.map((e, i) => (
          <span key={i} className="text-3xl animate-bounce-in select-none" style={{ animationDelay: `${i * 40}ms` }}>
            {e}
          </span>
        ))}
      </div>
      <span className="text-4xl font-black text-gray-600 bg-white rounded-full w-12 h-12 flex items-center justify-center shadow select-none">
        {visual.op}
      </span>
      <div className="flex flex-wrap gap-1 justify-center max-w-[140px]">
        {right.map((e, i) => (
          <span
            key={i}
            className={`text-3xl animate-bounce-in select-none ${e === "❌" ? "opacity-40 grayscale" : ""}`}
            style={{ animationDelay: `${(left.length + i) * 40}ms` }}
          >
            {e}
          </span>
        ))}
      </div>
    </div>
  );
}

// NumberLine – for the negative numbers level
function NumberLine({ answer }: { answer: number }) {
  const min = -12, max = 12, total = max - min;
  const pct = ((answer - min) / total) * 100;
  const zeroPct = ((0 - min) / total) * 100;
  const ticks = [-10, -5, 0, 5, 10];
  return (
    <div className="my-3 px-4 select-none">
      <p className="text-xs text-gray-400 text-center mb-2">Tallinje 📏</p>
      <div className="relative h-10">
        {/* Line */}
        <div className="absolute top-1/2 w-full h-1 bg-gray-300 rounded-full -translate-y-1/2" />
        {/* Zero marker */}
        <div className="absolute top-0 h-full flex flex-col items-center" style={{ left: `${zeroPct}%`, transform: "translateX(-50%)" }}>
          <div className="w-0.5 h-full bg-gray-500" />
        </div>
        {/* Tick marks */}
        {ticks.map((n) => (
          <div key={n} className="absolute flex flex-col items-center" style={{ left: `${((n - min) / total) * 100}%`, transform: "translateX(-50%)", top: "60%" }}>
            <span className="text-xs text-gray-400">{n}</span>
          </div>
        ))}
        {/* Answer dot */}
        <div className="absolute -top-1 flex flex-col items-center animate-bounce-in"
          style={{ left: `${pct}%`, transform: "translateX(-50%)" }}>
          <div className="w-5 h-5 bg-purple-500 rounded-full shadow-lg ring-2 ring-white" />
        </div>
      </div>
    </div>
  );
}

// TimerBar
function TimerBar({ timeLeft }: { timeLeft: number }) {
  const pct = (timeLeft / TIMER_SECONDS) * 100;
  const color = timeLeft > 15 ? "bg-green-400" : timeLeft > 7 ? "bg-yellow-400" : "bg-red-400 animate-pulse";
  return (
    <div className="mb-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-white/70 text-xs">⏱️ {timeLeft}s</span>
        {timeLeft <= 7 && <span className="text-red-200 text-xs font-bold animate-pulse">Skynd dig!</span>}
      </div>
      <div className="h-2.5 bg-white/20 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-1000`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// XP bar
function XPBar({ xp, levelConfig }: { xp: number; levelConfig: LevelConfig }) {
  const nextLevel = LEVELS.find((l) => l.id === levelConfig.id + 1);
  const lo = levelConfig.xpRequired;
  const hi = nextLevel ? nextLevel.xpRequired : lo + 500;
  const pct = Math.min(100, Math.max(0, Math.round(((xp - lo) / (hi - lo)) * 100)));
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>{xp} XP</span>
        <span>{hi} XP målet</span>
      </div>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${levelConfig.gradient} transition-all duration-700 relative`}
          style={{ width: `${pct}%` }}
        >
          {pct > 15 && (
            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold select-none">
              {pct}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Confetti burst
function Confetti() {
  const pieces = [
    { color: "bg-yellow-400", anim: "animate-confetti-1", left: "10%" },
    { color: "bg-pink-400", anim: "animate-confetti-2", left: "25%" },
    { color: "bg-blue-400", anim: "animate-confetti-1", left: "40%" },
    { color: "bg-green-400", anim: "animate-confetti-3", left: "55%" },
    { color: "bg-purple-400", anim: "animate-confetti-2", left: "70%" },
    { color: "bg-red-400", anim: "animate-confetti-1", left: "85%" },
    { color: "bg-orange-400", anim: "animate-confetti-3", left: "15%" },
    { color: "bg-teal-400", anim: "animate-confetti-2", left: "60%" },
    { color: "bg-indigo-400", anim: "animate-confetti-1", left: "45%" },
    { color: "bg-rose-400", anim: "animate-confetti-3", left: "80%" },
    { color: "bg-cyan-400", anim: "animate-confetti-2", left: "30%" },
    { color: "bg-lime-400", anim: "animate-confetti-1", left: "90%" },
  ];
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p, i) => (
        <div
          key={i}
          className={`absolute top-0 w-4 h-4 rounded-sm ${p.color} ${p.anim}`}
          style={{ left: p.left, animationDelay: `${i * 70}ms` }}
        />
      ))}
    </div>
  );
}

// ─── Screens ───────────────────────────────────────────────────────────────────

function SetupScreen({ dispatch }: { dispatch: React.Dispatch<Action> }) {
  const [name, setName] = useState("");
  const submit = () => name.trim() && dispatch({ type: "SET_NAME", name: name.trim() });
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-6">
      <div className="animate-bounce-in text-center mb-8">
        <div className="text-8xl mb-4 animate-float select-none">🧮</div>
        <h1 className="text-5xl font-black text-white drop-shadow-lg">MathQuest</h1>
        <p className="text-xl text-white/80 mt-2">Fra 1. klasse til universitetet! 🚀</p>
      </div>
      <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-sm animate-slide-up">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Hvad hedder du? 👋</h2>
        <p className="text-gray-500 text-center text-sm mb-1">Dit navn gemmes til din fremgang</p>
        <p className="text-purple-500 text-center text-xs mb-6 italic">
          "Din hjerne kan altid blive bedre til matematik!" 🧠
        </p>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Skriv dit navn..."
          maxLength={20}
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 text-lg focus:outline-none focus:border-purple-400 transition-colors"
          autoFocus
        />
        <button
          onPointerDown={submit}
          disabled={!name.trim()}
          className="mt-4 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-5 rounded-2xl text-xl shadow-lg disabled:opacity-40 transition-transform active:scale-95 select-none"
        >
          Start eventyret! 🎯
        </button>
      </div>
    </div>
  );
}

function HomeScreen({ state, dispatch }: { state: GameState; dispatch: React.Dispatch<Action> }) {
  const level = getLevel(state.currentLevelId);
  const today = todayISO();
  const isReturning = state.lastPlayedDate !== "" && state.lastPlayedDate !== today;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${level.gradient} flex flex-col p-4 sm:p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="bg-white/20 backdrop-blur rounded-2xl px-4 py-2">
          <span className="text-white font-bold select-none">👤 {state.playerName}</span>
        </div>
        <div className="flex gap-2">
          <div className="bg-white/20 backdrop-blur rounded-2xl px-3 py-2 flex items-center gap-1 select-none">
            <span>📅</span>
            <span className="text-white font-bold text-sm">{state.dailyStreak}d</span>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-2xl px-3 py-2 flex items-center gap-1 select-none">
            <span>🔥</span>
            <span className="text-white font-bold text-sm">{state.streak}</span>
          </div>
        </div>
      </div>

      {/* Returning user welcome (distributed practice) */}
      {isReturning && (
        <div className="bg-white/20 backdrop-blur rounded-2xl p-3 mb-4 animate-slide-up text-center">
          <p className="text-white font-bold">🎉 Velkommen tilbage, {state.playerName}!</p>
          <p className="text-white/80 text-sm mt-1">
            {state.dailyStreak > 1
              ? `${state.dailyStreak} dage i træk – konsistens er nøglen! 🔑`
              : "Korte daglige sessioner er bedst for hukommelsen! 🧠"}
          </p>
        </div>
      )}

      {/* Level card */}
      <div className="bg-white rounded-3xl p-5 shadow-2xl mb-4 animate-slide-up">
        <div className="flex items-center gap-4 mb-3">
          <div className="text-6xl animate-float select-none">{level.emoji}</div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{level.grade}</p>
            <h2 className="text-xl font-black text-gray-800">{level.name}</h2>
            <p className="text-gray-500 text-sm mt-0.5">{level.description}</p>
          </div>
        </div>
        <XPBar xp={state.xp} levelConfig={level} />
        <div className="mt-2 flex items-center gap-3 text-sm text-gray-500 flex-wrap select-none">
          <span>✅ {state.totalCorrect} rigtige</span>
          <span>·</span>
          <span>🏆 {state.unlockedLevels.length}/{LEVELS.length} niveauer</span>
        </div>
      </div>

      {/* Real-world context (contextualize principle) */}
      <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mb-4 text-white text-sm">
        <p className="font-bold text-xs uppercase tracking-wide mb-1 text-white/60 select-none">I den virkelige verden</p>
        <p>{level.realWorldContext}</p>
      </div>

      {/* Badges */}
      {state.earnedBadgeIds.length > 0 && (
        <div className="bg-white/20 backdrop-blur rounded-2xl p-3 mb-4">
          <p className="text-white font-bold text-xs uppercase mb-2 select-none">🏅 Dine badges</p>
          <div className="flex flex-wrap gap-2">
            {state.earnedBadgeIds.map((id) => {
              const badge = BADGES.find((b) => b.id === id);
              return badge ? (
                <span key={id} className="bg-white/30 rounded-xl px-3 py-1 text-white text-xs select-none">
                  {badge.emoji} {badge.label}
                </span>
              ) : null;
            })}
          </div>
        </div>
      )}

      {/* Growth mindset quote */}
      <div className="bg-white/10 rounded-2xl p-3 mb-4 text-white/80 text-xs text-center italic">
        🧠 "Matematiske evner er ikke medfødte – de bygges op gennem øvelse og vedholdenhed."
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 mt-auto">
        <button
          onPointerDown={() => dispatch({ type: "START_LEVEL", levelId: state.currentLevelId })}
          className="w-full bg-white text-gray-800 font-black py-5 rounded-2xl text-xl shadow-xl active:scale-95 transition-transform select-none"
        >
          {level.emoji} Spil nu! → {level.name}
        </button>
        <button
          onPointerDown={() => dispatch({ type: "GO_MAP" })}
          className="w-full bg-white/20 backdrop-blur text-white font-bold py-4 rounded-2xl text-lg active:bg-white/30 transition-colors select-none"
        >
          🗺️ Se alle niveauer
        </button>
      </div>
    </div>
  );
}

function LevelMapScreen({ state, dispatch }: { state: GameState; dispatch: React.Dispatch<Action> }) {
  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <button
          onPointerDown={() => dispatch({ type: "GO_HOME" })}
          className="text-white bg-white/10 rounded-xl px-4 py-3 active:bg-white/20 select-none text-lg"
        >
          ← Tilbage
        </button>
        <h1 className="text-xl font-black text-white select-none">🗺️ Verdenskortet</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {LEVELS.map((level) => {
          const unlocked = state.unlockedLevels.includes(level.id);
          const current = state.currentLevelId === level.id;
          return (
            <button
              key={level.id}
              disabled={!unlocked}
              onPointerDown={() => { if (unlocked) dispatch({ type: "START_LEVEL", levelId: level.id }); }}
              className={`rounded-2xl p-4 text-left transition-transform select-none ${
                unlocked
                  ? `bg-gradient-to-r ${level.gradient} active:scale-95 shadow-lg`
                  : "bg-gray-800 opacity-40 cursor-not-allowed"
              } ${current ? "ring-4 ring-white ring-offset-2 ring-offset-gray-900" : ""}`}
            >
              <div className="flex items-center gap-3">
                <span className="text-4xl select-none">{unlocked ? level.emoji : "🔒"}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`font-black text-base truncate ${unlocked ? "text-white" : "text-gray-500"}`}>
                      {level.name}
                    </span>
                    {current && (
                      <span className="bg-white text-gray-800 text-xs font-bold px-2 py-0.5 rounded-full shrink-0 select-none">
                        Aktiv
                      </span>
                    )}
                  </div>
                  <span className={`text-sm ${unlocked ? "text-white/80" : "text-gray-600"}`}>
                    {level.grade} · {level.description}
                  </span>
                  {!unlocked && (
                    <span className="text-xs text-gray-500 block mt-0.5">{level.xpRequired} XP krævet</span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PlayingScreen({ state, dispatch }: { state: GameState; dispatch: React.Dispatch<Action> }) {
  const level = getLevel(state.currentLevelId);
  const { problem, feedback } = state;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown timer
  useEffect(() => {
    if (!state.timerEnabled || feedback !== "idle") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = setInterval(() => dispatch({ type: "TICK_TIMER" }), 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.timerEnabled, feedback, state.problem]);

  if (!problem) return null;

  const hints = getProgressiveHints(problem);
  const roundPct = Math.round((state.roundCorrect / level.questionsPerRound) * 100);
  const isNegativeLevel = level.type === "negatives";

  function optionState(optStr: string): "default" | "wrong" | "correct" {
    if (state.wrongOptions.includes(optStr)) return "wrong";
    if (feedback === "correct" && optStr === String(problem!.answer)) return "correct";
    return "default";
  }

  function optionClass(optStr: string): string {
    const s = optionState(optStr);
    if (s === "correct") return "bg-green-400 text-white ring-4 ring-green-200 scale-105 shadow-lg";
    if (s === "wrong") return "bg-gray-200 text-gray-400 cursor-not-allowed line-through opacity-60";
    return `${level.btnClass} text-white active:scale-95 shadow-md`;
  }

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${level.gradient} p-4 sm:p-6`}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <button
          onPointerDown={() => dispatch({ type: "GO_HOME" })}
          className="bg-white/20 backdrop-blur text-white font-bold px-4 py-3 rounded-xl active:bg-white/30 text-sm select-none"
        >
          ← Hjem
        </button>
        <div className="flex items-center gap-2">
          <div className="bg-white/20 backdrop-blur rounded-xl px-3 py-2 flex items-center gap-1 select-none">
            <span>🔥</span>
            <span className="text-white font-bold text-sm">{state.streak}</span>
          </div>
          <div className="bg-white/20 backdrop-blur rounded-xl px-3 py-2 select-none">
            <span className="text-white font-bold text-sm">{state.xp} XP</span>
          </div>
          {/* Timer toggle */}
          <button
            onPointerDown={() => dispatch({ type: "TOGGLE_TIMER" })}
            title={state.timerEnabled ? "Slå timer fra" : "Slå timer til (bonus XP for hurtigt svar)"}
            className={`rounded-xl px-3 py-2 text-sm font-bold select-none transition-colors ${
              state.timerEnabled ? "bg-yellow-300 text-yellow-900" : "bg-white/20 text-white"
            }`}
          >
            ⏱️
          </button>
        </div>
      </div>

      {/* Round progress */}
      <div className="mb-3">
        <div className="flex justify-between text-white/70 text-xs mb-1 select-none">
          <span>{level.name}</span>
          <span>{state.roundCorrect}/{level.questionsPerRound}</span>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${roundPct}%` }} />
        </div>
      </div>

      {/* Timer bar (timed practice) */}
      {state.timerEnabled && <TimerBar timeLeft={state.timeLeft} />}

      {/* Problem card */}
      <div
        className={`bg-white rounded-3xl p-5 shadow-2xl mb-4 flex-1 flex flex-col ${level.cardBg} ${
          feedback === "correct"
            ? "ring-4 ring-green-400 animate-bounce-in"
            : state.wrongOptions.length > 0
            ? "ring-2 ring-orange-300 animate-shake"
            : "animate-slide-up"
        }`}
      >
        {/* Scenario (real-world context) */}
        <p className="text-gray-600 text-base leading-relaxed mb-3">{problem.scenario}</p>

        {/* Visual aid – emoji grid */}
        {problem.visual && <VisualAid visual={problem.visual} />}

        {/* Number line for negatives (visual thinking) */}
        {isNegativeLevel && feedback === "correct" && typeof problem.answer === "number" && (
          <NumberLine answer={problem.answer} />
        )}

        {/* Main question */}
        <div className="text-center my-4 flex-1 flex items-center justify-center">
          <span className="text-4xl sm:text-5xl font-black text-gray-800 tracking-tight math-display select-none">
            {problem.question}
          </span>
        </div>

        {/* Correct feedback */}
        {feedback === "correct" && (
          <div className="space-y-2 mt-2">
            <p className="text-center font-black text-xl text-green-600 select-none">{state.encouragement}</p>
            {state.xpGained > 0 && (
              <div className="text-center text-green-500 font-bold animate-xp-flash select-none">
                +{state.xpGained} XP
                {state.wrongAttempts === 0 && " ✨ Første forsøg!"}
                {state.streak >= 3 && " 🔥 Stribe!"}
                {state.timerEnabled && state.timeLeft > 20 && " ⚡ Hurtig!"}
              </div>
            )}
            {/* Error analysis / explanation always shown */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-3 text-green-800 text-sm animate-slide-up">
              <span className="font-bold">✅ Forklaring: </span>{problem.explanation}
            </div>
          </div>
        )}

        {/* Wrong feedback – growth mindset framing */}
        {feedback === "wrong" && (
          <div className="space-y-2 mt-2">
            <p className="text-center font-bold text-base text-orange-600 animate-slide-up select-none">
              {state.encouragement}
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-amber-800 text-xs animate-slide-up">
              🧠 <strong>Fejl = læring:</strong> Hvert forkert forsøg bygger nye nerveforbindelser i din hjerne!
            </div>
          </div>
        )}

        {/* Progressive hints (scaffolding) */}
        {state.hintLevel >= 1 && (
          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-2xl p-3 text-blue-800 text-sm animate-slide-up">
            <span className="font-bold">💡 Tip 1: </span>{hints[0]}
          </div>
        )}
        {state.hintLevel >= 2 && (
          <div className="mt-2 bg-indigo-50 border border-indigo-200 rounded-2xl p-3 text-indigo-800 text-sm animate-slide-up">
            <span className="font-bold">💡 Tip 2: </span>{hints[1]}
          </div>
        )}
        {state.hintLevel >= 3 && (
          <div className="mt-2 bg-purple-50 border border-purple-200 rounded-2xl p-3 text-purple-800 text-sm animate-slide-up">
            <span className="font-bold">🔍 Fuld løsning: </span>
            <strong>{String(problem.answer)}</strong> — {problem.explanation}
          </div>
        )}
      </div>

      {/* Answer buttons or Next */}
      {feedback !== "correct" ? (
        <>
          <div className="grid grid-cols-2 gap-3 mb-2">
            {problem.options.map((opt, i) => {
              const optStr = String(opt);
              const os = optionState(optStr);
              return (
                <button
                  key={i}
                  disabled={os === "wrong" || os === "correct"}
                  onPointerDown={() => { if (os === "default") dispatch({ type: "ANSWER", option: optStr }); }}
                  className={`py-5 rounded-2xl text-xl font-black transition-all select-none ${optionClass(optStr)}`}
                >
                  {os === "wrong" ? "✗ " : ""}{optStr}
                </button>
              );
            })}
          </div>
          {/* Progressive hint button */}
          {state.hintLevel < 3 && (
            <button
              onPointerDown={() => dispatch({ type: "ADVANCE_HINT" })}
              className="w-full text-white/70 text-sm py-3 active:text-white select-none"
            >
              {state.hintLevel === 0
                ? "💡 Vis tip"
                : state.hintLevel === 1
                ? "💡 Mere hjælp"
                : "🔍 Vis svaret"}
            </button>
          )}
        </>
      ) : (
        <>
          <Confetti />
          <button
            onPointerDown={() => dispatch({ type: "NEXT_QUESTION" })}
            className="w-full bg-white text-gray-800 font-black py-5 rounded-2xl text-xl shadow-xl active:scale-95 transition-transform animate-bounce-in select-none"
          >
            Næste spørgsmål ➡️
          </button>
        </>
      )}
    </div>
  );
}

function LevelUpScreen({ state, dispatch }: { state: GameState; dispatch: React.Dispatch<Action> }) {
  const level = getLevel(state.currentLevelId);
  const nextLevel = LEVELS.find((l) => l.id === state.currentLevelId + 1);
  const newBadge = BADGES.find((b) => state.earnedBadgeIds.includes(b.id));

  // Self-efficacy: show accuracy for this round
  const accuracy = state.roundAttempts > 0
    ? Math.round((state.roundCorrect / state.roundAttempts) * 100)
    : 100;
  const accuracyMsg =
    accuracy === 100 ? "Fejlfri runde! Imponerende! 🏆"
    : accuracy >= 80 ? "Fremragende præcision! Bliv ved! 💪"
    : accuracy >= 60 ? "Godt klaret! Øvelse gør mester. 📚"
    : "Fejl er en del af læringen – du er stærkere nu! 🌱";

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center bg-gradient-to-br ${level.gradient} p-6`}>
      <Confetti />
      <div className="text-center animate-bounce-in mb-4">
        <div className="text-8xl mb-3 animate-star-spin select-none">{level.emoji}</div>
        <h1 className="text-4xl font-black text-white drop-shadow-lg">Niveau gennemført! 🎉</h1>
        <p className="text-lg text-white/90 font-bold mt-1 select-none">{level.name}</p>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-2xl mb-4 w-full max-w-sm animate-slide-up">
        {/* Accuracy + self-efficacy message */}
        <div className="text-center mb-4">
          <div className="text-5xl mb-2 select-none">
            {accuracy === 100 ? "🏆" : accuracy >= 80 ? "⭐" : accuracy >= 60 ? "📚" : "🌱"}
          </div>
          <div className={`text-4xl font-black mb-1 ${accuracy >= 80 ? "text-green-500" : accuracy >= 60 ? "text-amber-500" : "text-blue-500"}`}>
            {accuracy}%
          </div>
          <p className="text-gray-500 text-sm">nøjagtighed</p>
          <p className="text-gray-700 text-sm mt-2 font-medium">{accuracyMsg}</p>
        </div>

        <div className="h-px bg-gray-100 my-3" />

        <div className="flex justify-around text-center">
          <div>
            <div className="text-2xl font-black text-purple-600 select-none">{state.xp}</div>
            <div className="text-xs text-gray-400">XP</div>
          </div>
          <div>
            <div className="text-2xl font-black text-green-500 select-none">{state.totalCorrect}</div>
            <div className="text-xs text-gray-400">Rigtige</div>
          </div>
          <div>
            <div className="text-2xl font-black text-orange-500 select-none">{state.dailyStreak}</div>
            <div className="text-xs text-gray-400">Dage</div>
          </div>
        </div>

        {/* Growth mindset brain science note */}
        <div className="mt-3 bg-purple-50 border border-purple-100 rounded-2xl p-3 text-purple-700 text-xs text-center">
          🧠 <em>Din hjerne er plastisk – den vokser med hvert problem du løser!</em>
        </div>

        {newBadge && (
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-2xl p-3 text-center animate-wiggle">
            <p className="text-3xl select-none">{newBadge.emoji}</p>
            <p className="font-bold text-yellow-700 mt-1">Ny badge: {newBadge.label}</p>
          </div>
        )}
      </div>

      {/* Distributed practice nudge */}
      <div className="bg-white/20 backdrop-blur rounded-2xl p-3 mb-4 w-full max-w-sm text-center">
        <p className="text-white text-sm font-medium">
          📅 Kom tilbage <strong>i morgen</strong> for at fortsætte din {state.dailyStreak + 1}-dages stribe!
        </p>
        <p className="text-white/60 text-xs mt-1">Forskning viser: korte daglige sessioner er bedre end lange sjældne.</p>
      </div>

      {/* Unlocked next level card */}
      {nextLevel && state.unlockedLevels.includes(nextLevel.id) && (
        <div className={`bg-gradient-to-r ${nextLevel.gradient} rounded-2xl p-4 mb-4 w-full max-w-sm shadow-lg animate-slide-up`}>
          <p className="text-white text-xs font-semibold mb-1 select-none">🔓 Nyt niveau låst op!</p>
          <div className="flex items-center gap-3">
            <span className="text-4xl select-none">{nextLevel.emoji}</span>
            <div>
              <p className="text-white font-bold">{nextLevel.name}</p>
              <p className="text-white/80 text-sm">{nextLevel.grade} · {nextLevel.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 w-full max-w-sm">
        {nextLevel && state.unlockedLevels.includes(nextLevel.id) && (
          <button
            onPointerDown={() => dispatch({ type: "START_LEVEL", levelId: nextLevel.id })}
            className="w-full bg-white text-gray-800 font-black py-4 rounded-2xl text-xl shadow-xl active:scale-95 transition-transform select-none"
          >
            {nextLevel.emoji} Prøv {nextLevel.name}!
          </button>
        )}
        <button
          onPointerDown={() => dispatch({ type: "FINISH_LEVELUP" })}
          className="w-full bg-white/20 backdrop-blur text-white font-bold py-4 rounded-2xl text-lg active:bg-white/30 select-none"
        >
          🏠 Hjem
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function MathGame() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const [hydrated, setHydrated] = useState(false);

  // Load saved state on mount
  useEffect(() => {
    const saved = loadState();
    if (saved && saved.playerName) {
      dispatch({
        type: "LOAD",
        state: { ...saved, screen: "home" as Screen },
      });
    }
    setHydrated(true);
  }, []);

  // Persist on every state change
  useEffect(() => {
    if (hydrated && state.playerName) {
      saveState(state);
    }
  }, [state, hydrated]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-400 to-purple-500">
        <div className="text-white text-6xl animate-bounce select-none">🧮</div>
      </div>
    );
  }

  switch (state.screen) {
    case "setup":
      return <SetupScreen dispatch={dispatch} />;
    case "home":
      return <HomeScreen state={state} dispatch={dispatch} />;
    case "map":
      return <LevelMapScreen state={state} dispatch={dispatch} />;
    case "playing":
      return <PlayingScreen state={state} dispatch={dispatch} />;
    case "levelup":
      return <LevelUpScreen state={state} dispatch={dispatch} />;
    default:
      return <SetupScreen dispatch={dispatch} />;
  }
}
