"use client";
import { useState, useEffect } from "react";
import ProfileScreen from "@/components/ProfileScreen";
import CityMap from "@/components/CityMap";
import MathGame from "@/components/MathGame";
import HeroPanel from "@/components/HeroPanel";
import QuestBoard from "@/components/QuestBoard";
import type { Profile } from "@/lib/types";
import type { HeroClass } from "@/lib/types";
import { ACHIEVEMENTS, getEarnedTitle, getUnlockedMounts, checkNewAchievements } from "@/lib/achievements";

const PROFILES_KEY = "ovebog-profiles-v1";
type AppView = "profiles" | "city" | "math-dungeon" | "hero-panel" | "quest-board";

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

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILES_KEY);
      if (raw) setProfiles(JSON.parse(raw));
    } catch {}
    setHydrated(true);
  }, []);

  const saveProfiles = (ps: Profile[]) => {
    setProfiles(ps);
    try { localStorage.setItem(PROFILES_KEY, JSON.stringify(ps)); } catch {}
  };

  const addProfile = (name: string, avatar: string, heroClass: HeroClass) => {
    const p: Profile = {
      id: Date.now().toString(),
      name, avatar, heroClass,
      mountId: "horse",
      titleId: "elev",
      achievementIds: [],
      mathXP: 0,
      mathDungeonFloor: 1,
      createdAt: new Date().toISOString(),
    };
    saveProfiles([...profiles, p]);
  };

  const updateProfile = (updated: Profile) => {
    saveProfiles(profiles.map((p) => p.id === updated.id ? updated : p));
    if (activeProfile?.id === updated.id) setActiveProfile(updated);
  };

  const deleteProfile = (id: string) => {
    saveProfiles(profiles.filter((p) => p.id !== id));
    if (activeProfile?.id === id) { setActiveProfile(null); setView("profiles"); }
  };

  const onFloorCleared = (floorId: number) => {
    if (!activeProfile) return;
    const newFloor = Math.max(activeProfile.mathDungeonFloor, floorId + 1);
    const earnedXP = floorId * 50;
    const newXP = activeProfile.mathXP + earnedXP;
    // Check for new achievements
    const freshAchievements = checkNewAchievements(activeProfile.achievementIds, newFloor, newXP);
    const newAchievementIds = [...activeProfile.achievementIds, ...freshAchievements.map((a) => a.id)];
    // Auto-update title and unlock mounts
    const earnedTitle = getEarnedTitle(newFloor);
    const updated: Profile = {
      ...activeProfile,
      mathXP: newXP,
      mathDungeonFloor: newFloor,
      achievementIds: newAchievementIds,
      titleId: earnedTitle.id,
    };
    updateProfile(updated);
    if (freshAchievements.length > 0) {
      setNewAchievements(freshAchievements);
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
          onSelect={(p) => { setActiveProfile(p); setView("city"); }}
          onAdd={addProfile}
          onDelete={deleteProfile}
        />
      )}

      {view === "city" && activeProfile && (
        <CityMap
          profile={activeProfile}
          onEnterDungeon={(id) => { if (id === "math") setView("math-dungeon"); }}
          onHeroPanel={() => setView("hero-panel")}
          onSwitchProfile={() => { setActiveProfile(null); setView("profiles"); }}
          onQuestBoard={() => setView("quest-board")}
        />
      )}

      {view === "math-dungeon" && activeProfile && (
        <MathGame
          profileId={activeProfile.id}
          playerName={activeProfile.name}
          dungeonFloor={activeProfile.mathDungeonFloor}
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
