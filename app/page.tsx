"use client";
import { useState, useEffect } from "react";
import ProfileScreen from "@/components/ProfileScreen";
import CityMap from "@/components/CityMap";
import MathGame from "@/components/MathGame";
import SubjectGame from "@/components/SubjectGame";
import HeroPanel from "@/components/HeroPanel";
import QuestBoard from "@/components/QuestBoard";
import type { Profile, MasteryTrackId } from "@/lib/types";
import type { HeroClass } from "@/lib/types";
import type { SubjectId } from "@/lib/subjectData";
import { normaliseProfile, levelFromXP } from "@/lib/types";
import { ACHIEVEMENTS, getEarnedTitle, checkNewAchievements } from "@/lib/achievements";
import { LEVELS } from "@/lib/gameData";
import { getQuestsForToday, MESTRINGS_STIER } from "@/lib/items";

type AppView = "profiles" | "city" | "math-dungeon" | "subject-dungeon" | "hero-panel" | "quest-board";

// Map level type → mastery track id
const TYPE_TO_TRACK: Partial<Record<string, MasteryTrackId>> = {
  addition: "plus",
  subtraction: "minus",
  multiplication: "gange",
  division: "dele",
  mixed: "blandet",
};

function AchievementToast({ achievements, onDone }: { achievements: typeof ACHIEVEMENTS; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 flex flex-col gap-3 pointer-events-none">
      {achievements.map((a) => (
        <div key={a.id}
          className="bg-yellow-400 text-black rounded-3xl px-6 py-4 flex items-center gap-4 shadow-2xl animate-slide-up">
          <span className="text-5xl select-none">{a.emoji}</span>
          <div>
            <p className="font-black text-xl">Bedrift optjent!</p>
            <p className="font-bold text-lg">{a.name}</p>
            <p className="text-sm opacity-80">{a.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeProfile, setActiveProfile] = useState<Profile | null>(null);
  const [view, setView] = useState<AppView>("profiles");
  const [newAchievements, setNewAchievements] = useState<typeof ACHIEVEMENTS>([]);
  const [hydrated, setHydrated] = useState(false);
  const [dungeonStartFloor, setDungeonStartFloor] = useState(1);
  const [activeSubjectId, setActiveSubjectId] = useState<SubjectId | null>(null);
  const [subjectStartFloor, setSubjectStartFloor] = useState(1);

  useEffect(() => {
    fetch("/api/profiles")
      .then((r) => r.json())
      .then((data: Partial<Profile>[]) => {
        const normalised = data.map((p) =>
          normaliseProfile(p as Partial<Profile> & { id: string; name: string })
        );
        setProfiles(normalised);
        setHydrated(true);
      })
      .catch(() => setHydrated(true));
  }, []);

  /** Refresh daily quests if the date has changed, then select the profile */
  const selectProfile = (p: Profile) => {
    const today = new Date().toISOString().split("T")[0];
    const refreshed = normaliseProfile(p);
    const newQuestIds = getQuestsForToday(refreshed.dailyQuestDate, refreshed.dailyQuestIds);
    const dateChanged = refreshed.dailyQuestDate !== today;
    if (dateChanged || refreshed.dailyQuestIds.length === 0) {
      const updated: Profile = {
        ...refreshed,
        dailyQuestDate: today,
        dailyQuestIds: newQuestIds,
        dailyQuestDoneIds: dateChanged ? [] : refreshed.dailyQuestDoneIds,
      };
      updateProfile(updated);
      setActiveProfile(updated);
    } else {
      setActiveProfile(refreshed);
    }
    setView("city");
  };

  const addProfile = (name: string, avatar: string, heroClass: HeroClass) => {
    const today = new Date().toISOString().split("T")[0];
    const questIds = getQuestsForToday("", []);
    const p: Profile = normaliseProfile({
      id: Date.now().toString(),
      name,
      avatar,
      heroClass,
      dailyQuestDate: today,
      dailyQuestIds: questIds,
      createdAt: new Date().toISOString(),
    });
    fetch("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    }).then(() => setProfiles((prev) => [...prev, p]));
  };

  const updateProfile = (updated: Profile) => {
    fetch("/api/profiles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    }).then(() => {
      setProfiles((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
      if (activeProfile?.id === updated.id) setActiveProfile(updated);
    });
  };

  const deleteProfile = (id: string) => {
    fetch(`/api/profiles?id=${id}`, { method: "DELETE" }).then(() => {
      setProfiles((prev) => prev.filter((p) => p.id !== id));
      if (activeProfile?.id === id) {
        setActiveProfile(null);
        setView("profiles");
      }
    });
  };

  const onFloorCleared = (floorId: number, roundCorrect: number, roundAttempts: number) => {
    if (!activeProfile) return;
    const newFloor = Math.max(activeProfile.mathDungeonFloor, floorId + 1);
    const earnedXP = floorId * 50;
    const earnedGold = floorId * 10;
    const newXP = activeProfile.mathXP + earnedXP;
    const newGold = (activeProfile.gold ?? 0) + earnedGold;
    const newLevel = levelFromXP(newXP);

    // Update mastery for the relevant operation type
    const level = LEVELS.find((l) => l.id === floorId);
    const trackId = level ? TYPE_TO_TRACK[level.type] ?? null : null;
    let masteries = { ...activeProfile.masteries };
    if (trackId && masteries[trackId] !== undefined) {
      const m = { ...masteries[trackId] };
      const accuracy = roundAttempts > 0 ? Math.round((roundCorrect / roundAttempts) * 100) : 0;
      m.totalAnswered = (m.totalAnswered ?? 0) + roundAttempts;
      m.totalCorrect = (m.totalCorrect ?? 0) + roundCorrect;
      if (accuracy === 100) m.bestStreak = Math.max(m.bestStreak ?? 0, roundCorrect);

      // Check for stage advancement
      if (m.stage < 5) {
        const sti = MESTRINGS_STIER.find((s) => s.id === trackId);
        const nextTrin = sti?.trin.find((t) => t.trin === m.stage + 1);
        if (nextTrin && m.totalCorrect >= nextTrin.rigtigeKrævet && accuracy >= nextTrin.nøjagtighedsKrævet) {
          m.stage += 1;
          m.totalCorrect = 0;
          m.totalAnswered = 0;
        }
      }
      masteries = { ...masteries, [trackId]: m };
    }

    // Check daily quest progress: floors cleared
    const dailyQuestDoneIds = [...(activeProfile.dailyQuestDoneIds ?? [])];
    const dailyQuestIds = activeProfile.dailyQuestIds ?? [];
    for (const qid of dailyQuestIds) {
      if (dailyQuestDoneIds.includes(qid)) continue;
      if (qid === "dq-1etage" || qid === "dq-3etager") {
        // Simple one-shot completion
        dailyQuestDoneIds.push(qid);
      }
    }

    // Check achievements
    const freshAchievements = checkNewAchievements(activeProfile.achievementIds, newFloor, newXP);
    const newAchievementIds = [...activeProfile.achievementIds, ...freshAchievements.map((a) => a.id)];
    const earnedTitle = getEarnedTitle(newFloor);

    const updated: Profile = {
      ...activeProfile,
      mathXP: newXP,
      level: newLevel,
      gold: newGold,
      mathDungeonFloor: newFloor,
      masteries,
      achievementIds: newAchievementIds,
      titleId: earnedTitle.id,
      dailyQuestDoneIds,
    };
    updateProfile(updated);
    if (freshAchievements.length > 0) {
      setNewAchievements(freshAchievements);
    }
  };

  const enterDungeon = (id: string, floor: number) => {
    if (id === "math") {
      setDungeonStartFloor(floor);
      setView("math-dungeon");
    } else {
      setActiveSubjectId(id as SubjectId);
      setSubjectStartFloor(floor);
      setView("subject-dungeon");
    }
  };

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-950 flex items-center justify-center">
        <div className="text-9xl animate-bounce select-none">🏰</div>
      </div>
    );
  }

  return (
    <>
      {newAchievements.length > 0 && (
        <AchievementToast achievements={newAchievements} onDone={() => setNewAchievements([])} />
      )}

      {(view === "profiles" || !activeProfile) && (
        <ProfileScreen
          profiles={profiles}
          onSelect={selectProfile}
          onAdd={addProfile}
          onDelete={deleteProfile}
        />
      )}

      {view === "city" && activeProfile && (
        <CityMap
          profile={activeProfile}
          onEnterDungeon={enterDungeon}
          onHeroPanel={() => setView("hero-panel")}
          onSwitchProfile={() => { setActiveProfile(null); setView("profiles"); }}
          onQuestBoard={() => setView("quest-board")}
        />
      )}

      {view === "subject-dungeon" && activeProfile && activeSubjectId && (
        <SubjectGame
          subjectId={activeSubjectId}
          startFloor={subjectStartFloor}
          playerName={activeProfile.name}
          onFloorCleared={(floor, correct, attempts) => {
            if (!activeProfile) return;
            const xp = floor * 30;
            const gold = floor * 5;
            const newXP = activeProfile.mathXP + xp;
            const updated: Profile = {
              ...activeProfile,
              mathXP: newXP,
              level: levelFromXP(newXP),
              gold: (activeProfile.gold ?? 0) + gold,
              subjectFloors: {
                ...activeProfile.subjectFloors,
                [activeSubjectId]: Math.max(
                  activeProfile.subjectFloors?.[activeSubjectId] ?? 1,
                  floor + 1
                ),
              },
            };
            updateProfile(updated);
          }}
          onBack={() => setView("city")}
        />
      )}

      {view === "math-dungeon" && activeProfile && (
        <MathGame
          profileId={activeProfile.id}
          playerName={activeProfile.name}
          dungeonFloor={dungeonStartFloor}
          dungeonMode={true}
          onFloorCleared={onFloorCleared}
          onBack={() => setView("city")}
        />
      )}

      {view === "hero-panel" && activeProfile && (
        <HeroPanel
          profile={activeProfile}
          onUpdate={updateProfile}
          onBack={() => setView("city")}
        />
      )}

      {view === "quest-board" && activeProfile && (
        <QuestBoard
          profile={activeProfile}
          onBack={() => setView("city")}
        />
      )}
    </>
  );
}
