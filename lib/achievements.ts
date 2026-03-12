import type { HeroClass } from "./types";

export interface HeroClassDef {
  id: HeroClass;
  name: string;
  emoji: string;
  desc: string;
  gradient: string;
  bonus: string;
}

export interface Mount {
  id: string;
  name: string;
  emoji: string;
  speed: string;
  unlockAchievementId: string | null;
}

export interface Title {
  id: string;
  label: string;
  emoji: string;
  mathFloorRequired: number;
}

export interface Achievement {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  mathFloor?: number;
  totalXP?: number;
  unlocksMount?: string;
  unlocksTitle?: string;
}

export const HERO_CLASSES: HeroClassDef[] = [
  {
    id: "kriger",
    name: "Kriger",
    emoji: "⚔️",
    desc: "Stærk og modig – angriber problemer direkte",
    gradient: "from-red-600 to-orange-700",
    bonus: "+10% XP ved første forsøg",
  },
  {
    id: "magiker",
    name: "Magiker",
    emoji: "🔮",
    desc: "Klog og eftertænksom – tip 1 er altid gratis",
    gradient: "from-purple-600 to-violet-800",
    bonus: "Første tip er gratis",
  },
  {
    id: "ranger",
    name: "Ranger",
    emoji: "🏹",
    desc: "Hurtig og præcis – belønnes for hurtighed",
    gradient: "from-green-600 to-emerald-800",
    bonus: "+20% XP for hurtige svar",
  },
  {
    id: "laerd",
    name: "Den Lærde",
    emoji: "📜",
    desc: "Visdomssøgende – lærer af fejl og forklaringer",
    gradient: "from-blue-600 to-indigo-800",
    bonus: "+5 XP bonus for hvert alternativt hint",
  },
];

export const MOUNTS: Mount[] = [
  { id: "horse",       name: "Hest",           emoji: "🐴", speed: "Normal",    unlockAchievementId: null },
  { id: "shiny-horse", name: "Skinnende Hest", emoji: "🌟🐴", speed: "Hurtig",  unlockAchievementId: "floor5" },
  { id: "wolf",        name: "Ulv",            emoji: "🐺", speed: "Hurtig",    unlockAchievementId: "floor10" },
  { id: "dragon",      name: "Drage",          emoji: "🐉", speed: "Lynhurtig", unlockAchievementId: "floor15" },
  { id: "pegasus",     name: "Pegasus",        emoji: "🦅", speed: "Lynhurtig", unlockAchievementId: "xp5000" },
];

export const TITLES: Title[] = [
  { id: "elev",        label: "Elev",               emoji: "🌱", mathFloorRequired: 0  },
  { id: "laerling",    label: "Lærling",             emoji: "📝", mathFloorRequired: 3  },
  { id: "udforskeren", label: "Udforsker",           emoji: "🗺️", mathFloorRequired: 5  },
  { id: "ridder",      label: "Regnets Ridder",      emoji: "⚔️", mathFloorRequired: 8  },
  { id: "troldmand",   label: "Algebra-Troldmand",   emoji: "🔮", mathFloorRequired: 11 },
  { id: "mester",      label: "Kalkulations-Mester", emoji: "🏆", mathFloorRequired: 15 },
  { id: "visdom",      label: "Visdomssøger",        emoji: "💡", mathFloorRequired: 18 },
  { id: "legende",     label: "Legenden",            emoji: "🌟", mathFloorRequired: 20 },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: "floor3",  name: "Rejsende",          emoji: "🗺️", desc: "Nå etage 3 i Matematikens Fæstning",   mathFloor: 3,  unlocksTitle: "laerling"    },
  { id: "floor5",  name: "Eventyreren",       emoji: "⚔️", desc: "Nå etage 5 – ridderrejsen begynder",   mathFloor: 5,  unlocksMount: "shiny-horse", unlocksTitle: "udforskeren" },
  { id: "floor8",  name: "Kampveteranen",     emoji: "🛡️", desc: "Nå etage 8 – en ægte veteran",         mathFloor: 8,  unlocksTitle: "ridder"       },
  { id: "floor10", name: "Dungeon-Mester",    emoji: "🔑", desc: "Nå etage 10 – halvvejs til toppen",    mathFloor: 10, unlocksMount: "wolf"         },
  { id: "floor15", name: "Drageridder",       emoji: "🐉", desc: "Nå etage 15 – tæm dragens kraft",      mathFloor: 15, unlocksMount: "dragon", unlocksTitle: "troldmand" },
  { id: "floor20", name: "Den Store Legende", emoji: "🌟", desc: "Gennemfør alle 20 etager!",             mathFloor: 20, unlocksTitle: "legende"      },
  { id: "xp5000",  name: "XP-Samler",         emoji: "💎", desc: "Tjen 5000 XP i matematik",             totalXP: 5000, unlocksMount: "pegasus"      },
];

export const DUNGEON_MONSTERS: Record<number, { name: string; emoji: string }> = {
  1:  { name: "Slim",          emoji: "🟢" },
  2:  { name: "Blå Slim",      emoji: "🔵" },
  3:  { name: "Rød Slim",      emoji: "🔴" },
  4:  { name: "Skelet",        emoji: "💀" },
  5:  { name: "Armeret Skelet",emoji: "☠️" },
  6:  { name: "Zombie",        emoji: "🧟" },
  7:  { name: "Troll",         emoji: "👹" },
  8:  { name: "Stor Troll",    emoji: "🗿" },
  9:  { name: "Sten-Golem",    emoji: "🪨" },
  10: { name: "Isdrake",       emoji: "🐲" },
  11: { name: "Ilddrake",      emoji: "🔥" },
  12: { name: "Stormdrake",    emoji: "⛈️" },
  13: { name: "Mørk Troldmand",emoji: "🧙" },
  14: { name: "Lich",          emoji: "💀✨" },
  15: { name: "Dæmonlord",     emoji: "😈" },
  16: { name: "Skyggeridder",  emoji: "🌑" },
  17: { name: "Afgrundsfyrste",emoji: "👑" },
  18: { name: "Tidsguddom",    emoji: "⏳" },
  19: { name: "Stjerneødsleren",emoji: "🌌" },
  20: { name: "Uendelighedens Vokter", emoji: "♾️" },
};

export function getEarnedTitle(mathFloor: number): Title {
  const earned = TITLES.filter((t) => t.mathFloorRequired <= mathFloor);
  return earned[earned.length - 1] ?? TITLES[0];
}

export function checkNewAchievements(
  current: string[],
  mathFloor: number,
  totalXP: number
): Achievement[] {
  return ACHIEVEMENTS.filter((a) => {
    if (current.includes(a.id)) return false;
    if (a.mathFloor !== undefined && mathFloor < a.mathFloor) return false;
    if (a.totalXP !== undefined && totalXP < a.totalXP) return false;
    return true;
  });
}

export function getUnlockedMounts(achievementIds: string[]): Mount[] {
  return MOUNTS.filter(
    (m) => m.unlockAchievementId === null || achievementIds.includes(m.unlockAchievementId)
  );
}
