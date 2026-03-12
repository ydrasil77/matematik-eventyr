export type HeroClass = "kriger" | "magiker" | "ranger" | "laerd";

export type MasteryTrackId = "plus" | "minus" | "gange" | "dele" | "tal" | "blandet";

export interface MasteryProgress {
  stage: number;           // 0 = ikke startet, 1-5 = trin, 5 = Mester
  totalAnswered: number;
  totalCorrect: number;
  bestStreak: number;
}

export type MasteriesMap = Record<MasteryTrackId, MasteryProgress>;

export interface EquippedItems {
  vaaben?: string;     // weapon slot
  rustning?: string;   // armor slot
  hjelm?: string;      // helmet slot
  tilbehoer?: string;  // accessory slot
}

export interface Profile {
  id: string;
  name: string;
  avatar: string;
  heroClass: HeroClass;

  // Progression
  level: number;
  mathXP: number;
  gold: number;
  mathDungeonFloor: number;

  // Titles & mounts
  mountId: string;
  titleId: string;

  // Achievements
  achievementIds: string[];

  // Items
  itemIds: string[];
  equippedItems: EquippedItems;
  openedChestIds: string[];

  // Mastery paths
  masteries: MasteriesMap;

  // Quests
  dailyQuestDate: string;        // ISO date of last daily refresh
  dailyQuestIds: string[];       // Current day's quest IDs
  dailyQuestDoneIds: string[];   // Completed quest IDs today
  completedQuestIds: string[];   // All-time completed quest IDs

  createdAt: string;
}

export const DEFAULT_MASTERIES: MasteriesMap = {
  plus:    { stage: 0, totalAnswered: 0, totalCorrect: 0, bestStreak: 0 },
  minus:   { stage: 0, totalAnswered: 0, totalCorrect: 0, bestStreak: 0 },
  gange:   { stage: 0, totalAnswered: 0, totalCorrect: 0, bestStreak: 0 },
  dele:    { stage: 0, totalAnswered: 0, totalCorrect: 0, bestStreak: 0 },
  tal:     { stage: 0, totalAnswered: 0, totalCorrect: 0, bestStreak: 0 },
  blandet: { stage: 0, totalAnswered: 0, totalCorrect: 0, bestStreak: 0 },
};

/** Fill missing fields for profiles saved before a schema change */
export function normaliseProfile(p: Partial<Profile> & { id: string; name: string }): Profile {
  return {
    level: 1,
    mathXP: 0,
    gold: 0,
    mathDungeonFloor: 1,
    avatar: "🧙",
    heroClass: "kriger",
    mountId: "horse",
    titleId: "elev",
    achievementIds: [],
    itemIds: [],
    equippedItems: {},
    openedChestIds: [],
    masteries: { ...DEFAULT_MASTERIES },
    dailyQuestDate: "",
    dailyQuestIds: [],
    dailyQuestDoneIds: [],
    completedQuestIds: [],
    createdAt: new Date().toISOString(),
    ...p,
    // Ensure masteries object has all keys even if some are missing
    masteries: {
      ...DEFAULT_MASTERIES,
      ...(p.masteries ?? {}),
    },
  } as Profile;
}

/** XP needed to reach given hero level */
export function xpForLevel(lvl: number): number {
  return Math.round(100 * lvl * (lvl + 1) / 2);
}

/** Returns new hero level for given total XP */
export function levelFromXP(xp: number): number {
  let lvl = 1;
  while (xpForLevel(lvl + 1) <= xp) lvl++;
  return Math.min(lvl, 50);
}

