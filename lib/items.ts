// ─── Items ────────────────────────────────────────────────────────────────────

export type ItemSjældenhed = "almindelig" | "sjælden" | "episk" | "legendarisk";
export type ItemSlot = "vaaben" | "rustning" | "hjelm" | "tilbehoer";

export interface Item {
  id: string;
  name: string;
  emoji: string;
  slot: ItemSlot;
  sjaeldenhed: ItemSjældenhed;
  desc: string;
  xpBonus: number;    // Procentvis XP-bonus
  goldBonus: number;  // Procentvis guld-bonus
  stribeBonus: number;// Ekstra stribe-tæller ved korrekt svar
  etagekrav: number;  // Min. dungeon-etage for at finde
}

export const ITEMS: Item[] = [
  // ── Våben ──────────────────────────────────────────────────────────────────
  {
    id: "traesvaerd",    name: "Trækoksværd",       emoji: "🗡️",  slot: "vaaben",
    sjaeldenhed: "almindelig",  desc: "Et solidt begyndersvær i træ.",
    xpBonus: 5,  goldBonus: 0,  stribeBonus: 0, etagekrav: 1,
  },
  {
    id: "jernsvaerd",    name: "Jernsværd",          emoji: "⚔️",  slot: "vaaben",
    sjaeldenhed: "almindelig",  desc: "Stærkt jernsværd. Giver ekstra XP.",
    xpBonus: 10, goldBonus: 0,  stribeBonus: 0, etagekrav: 3,
  },
  {
    id: "magiskstav",    name: "Magisk Stav",         emoji: "🪄",  slot: "vaaben",
    sjaeldenhed: "sjælden",     desc: "En glødende stav der forstærker striber.",
    xpBonus: 5,  goldBonus: 0,  stribeBonus: 1, etagekrav: 5,
  },
  {
    id: "guldbue",       name: "Guldebue",            emoji: "🏹",  slot: "vaaben",
    sjaeldenhed: "sjælden",     desc: "Præcis bue der giver guld ved hurtige svar.",
    xpBonus: 0,  goldBonus: 15, stribeBonus: 0, etagekrav: 7,
  },
  {
    id: "dragetand",     name: "Dragens Tand",         emoji: "🐉",  slot: "vaaben",
    sjaeldenhed: "episk",       desc: "Et frygteligt våben fra en drage.",
    xpBonus: 25, goldBonus: 10, stribeBonus: 1, etagekrav: 12,
  },
  {
    id: "excalibur",     name: "Excalibur",            emoji: "✨",  slot: "vaaben",
    sjaeldenhed: "legendarisk", desc: "Det legendariske sværd. Maks XP og guld.",
    xpBonus: 40, goldBonus: 20, stribeBonus: 2, etagekrav: 18,
  },
  // ── Rustning ───────────────────────────────────────────────────────────────
  {
    id: "laederrustning", name: "Læderrustning",      emoji: "🥋",  slot: "rustning",
    sjaeldenhed: "almindelig",  desc: "Let rustning, god til unge eventyrere.",
    xpBonus: 0,  goldBonus: 5,  stribeBonus: 0, etagekrav: 1,
  },
  {
    id: "ringbrynjerustning", name: "Ringbrynjerustning", emoji: "🛡️", slot: "rustning",
    sjaeldenhed: "almindelig",  desc: "Solid ringbrynjerustning.",
    xpBonus: 5,  goldBonus: 5,  stribeBonus: 0, etagekrav: 4,
  },
  {
    id: "magikerkappe",  name: "Magikerkappe",         emoji: "🧥",  slot: "rustning",
    sjaeldenhed: "sjælden",     desc: "En kappe der giver XP-bonus.",
    xpBonus: 15, goldBonus: 0,  stribeBonus: 0, etagekrav: 8,
  },
  {
    id: "pladepanser",   name: "Pladepanser",          emoji: "⚙️",  slot: "rustning",
    sjaeldenhed: "episk",       desc: "Tungt men kraftfuldt panser.",
    xpBonus: 10, goldBonus: 10, stribeBonus: 1, etagekrav: 14,
  },
  {
    id: "drageskaelrustning", name: "Drage-Skæl Rustning", emoji: "🐲", slot: "rustning",
    sjaeldenhed: "legendarisk", desc: "Lavet af dragens skæl. Uovertruffet bonus.",
    xpBonus: 30, goldBonus: 15, stribeBonus: 2, etagekrav: 19,
  },
  // ── Hjelm ──────────────────────────────────────────────────────────────────
  {
    id: "skindhat",      name: "Skindhat",             emoji: "🎩",  slot: "hjelm",
    sjaeldenhed: "almindelig",  desc: "En simpel hat.",
    xpBonus: 0,  goldBonus: 0,  stribeBonus: 0, etagekrav: 1,
  },
  {
    id: "jernhjelm",     name: "Jernhjelm",            emoji: "⛑️",  slot: "hjelm",
    sjaeldenhed: "almindelig",  desc: "Solid jernhjelm.",
    xpBonus: 5,  goldBonus: 0,  stribeBonus: 0, etagekrav: 2,
  },
  {
    id: "troldmandshat", name: "Troldmandshat",        emoji: "🧙",  slot: "hjelm",
    sjaeldenhed: "sjælden",     desc: "Klassisk troldmandshat. Giver ekstra XP.",
    xpBonus: 10, goldBonus: 0,  stribeBonus: 0, etagekrav: 6,
  },
  {
    id: "krystalkrone",  name: "Krystal Krone",         emoji: "👑",  slot: "hjelm",
    sjaeldenhed: "episk",       desc: "Krone lavet af krystaller. Flot og kraftfuld.",
    xpBonus: 20, goldBonus: 5,  stribeBonus: 1, etagekrav: 15,
  },
  {
    id: "stjernekrone",  name: "Stjernekrone",          emoji: "⭐",  slot: "hjelm",
    sjaeldenhed: "legendarisk", desc: "Smeddet af stjernelys selv.",
    xpBonus: 35, goldBonus: 20, stribeBonus: 2, etagekrav: 20,
  },
  // ── Tilbehør ───────────────────────────────────────────────────────────────
  {
    id: "lykkeamulet",   name: "Lykkeamulet",          emoji: "🍀",  slot: "tilbehoer",
    sjaeldenhed: "almindelig",  desc: "Giver lidt ekstra guld.",
    xpBonus: 0,  goldBonus: 10, stribeBonus: 0, etagekrav: 1,
  },
  {
    id: "xp-ring",       name: "XP-Ring",              emoji: "💍",  slot: "tilbehoer",
    sjaeldenhed: "sjælden",     desc: "En ring der øger XP-gevinst.",
    xpBonus: 20, goldBonus: 0,  stribeBonus: 0, etagekrav: 5,
  },
  {
    id: "stribe-aedelsten", name: "Stribe-Ædelsten",  emoji: "💎",  slot: "tilbehoer",
    sjaeldenhed: "episk",       desc: "En ædelsten der forstærker striber enormt.",
    xpBonus: 10, goldBonus: 10, stribeBonus: 2, etagekrav: 10,
  },
  {
    id: "visdomsvedhæng", name: "Visdoms-Vedhæng",    emoji: "🔮",  slot: "tilbehoer",
    sjaeldenhed: "episk",       desc: "Mystisk vedhæng der giver stor XP-bonus.",
    xpBonus: 25, goldBonus: 5,  stribeBonus: 1, etagekrav: 16,
  },
  {
    id: "uendelighedssten", name: "Uendelighedssten", emoji: "♾️",  slot: "tilbehoer",
    sjaeldenhed: "legendarisk", desc: "En sten med uendelig kraft.",
    xpBonus: 50, goldBonus: 25, stribeBonus: 3, etagekrav: 20,
  },
];

export function getItem(id: string): Item | undefined {
  return ITEMS.find((i) => i.id === id);
}

/** Total bonus from equipped items */
export function getEquipmentBonus(equippedIds: (string | undefined)[]): {
  xpBonus: number;
  goldBonus: number;
  stribeBonus: number;
} {
  let xpBonus = 0, goldBonus = 0, stribeBonus = 0;
  for (const id of equippedIds) {
    if (!id) continue;
    const item = getItem(id);
    if (!item) continue;
    xpBonus += item.xpBonus;
    goldBonus += item.goldBonus;
    stribeBonus += item.stribeBonus;
  }
  return { xpBonus, goldBonus, stribeBonus };
}

// ─── Kister ────────────────────────────────────────────────────────────────────

export interface Kiste {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  etagekrav: number;
  muligeGenstande: string[]; // item IDs der kan droppes
  goldMin: number;
  goldMax: number;
}

export const KISTER: Kiste[] = [
  {
    id: "begynderkiste", name: "Begynderkiste",       emoji: "📦",
    desc: "En simpel kiste med grundlæggende udstyr.",
    etagekrav: 1,  goldMin: 10, goldMax: 30,
    muligeGenstande: ["traesvaerd", "laederrustning", "skindhat", "lykkeamulet"],
  },
  {
    id: "jernkiste",     name: "Jernkiste",            emoji: "🗃️",
    desc: "Solid kiste med jernudstyr.",
    etagekrav: 3,  goldMin: 25, goldMax: 60,
    muligeGenstande: ["jernsvaerd", "ringbrynjerustning", "jernhjelm", "lykkeamulet"],
  },
  {
    id: "magiskkiste",   name: "Magisk Kiste",          emoji: "✨",
    desc: "Kiste der gløder af magi.",
    etagekrav: 5,  goldMin: 50, goldMax: 100,
    muligeGenstande: ["magiskstav", "magikerkappe", "troldmandshat", "xp-ring"],
  },
  {
    id: "guldkiste",     name: "Guldkiste",            emoji: "💰",
    desc: "Sprængt med guld og sjældent udstyr.",
    etagekrav: 8,  goldMin: 80, goldMax: 150,
    muligeGenstande: ["guldbue", "magikerkappe", "xp-ring", "stribe-aedelsten"],
  },
  {
    id: "drage-kiste",   name: "Drage-Kiste",          emoji: "🐉",
    desc: "Kiste fra en besejret drage.",
    etagekrav: 12, goldMin: 120, goldMax: 200,
    muligeGenstande: ["dragetand", "pladepanser", "krystalkrone", "stribe-aedelsten"],
  },
  {
    id: "legendariskkiste", name: "Legendarisk Kiste", emoji: "🌟",
    desc: "Den ultimative kiste med legendarisk udstyr.",
    etagekrav: 18, goldMin: 200, goldMax: 500,
    muligeGenstande: ["excalibur", "drageskaelrustning", "stjernekrone", "uendelighedssten"],
  },
];

export function aabneKiste(kiste: Kiste, rand: (min: number, max: number) => number): {
  guld: number;
  genstand: Item;
} {
  const guld = rand(kiste.goldMin, kiste.goldMax);
  const itemId = kiste.muligeGenstande[rand(0, kiste.muligeGenstande.length - 1)];
  return { guld, genstand: ITEMS.find((i) => i.id === itemId)! };
}

// ─── Mestrings-Stier ───────────────────────────────────────────────────────────

export interface MestringsTrin {
  trin: number;           // 1-5
  navn: string;
  emoji: string;
  beskrivelse: string;
  rigtigeKrævet: number;  // Antal rigtige for at rykke op
  nøjagtighedsKrævet: number; // 0-100
  interval: string;       // "1–10" etc.
  min: number;
  max: number;
  type: "addition" | "subtraction" | "multiplication" | "division" | "mixed";
}

export interface MestringsSti {
  id: string;
  navn: string;
  emoji: string;
  farve: string;
  trin: MestringsTrin[];
}

export const MESTRINGS_STIER: MestringsSti[] = [
  {
    id: "plus",
    navn: "Plus-Vejen",
    emoji: "➕",
    farve: "from-green-500 to-emerald-600",
    trin: [
      { trin: 1, navn: "Tælle-Ven",         emoji: "🌱", beskrivelse: "Lær addition 1–5",      rigtigeKrævet: 10, nøjagtighedsKrævet: 80, interval: "1–5",    min: 1, max: 5,    type: "addition" },
      { trin: 2, navn: "Plus-Pioner",        emoji: "📝", beskrivelse: "Addition op til 10",    rigtigeKrævet: 15, nøjagtighedsKrævet: 80, interval: "1–10",   min: 1, max: 10,   type: "addition" },
      { trin: 3, navn: "Additions-Ridder",   emoji: "⚔️", beskrivelse: "Addition op til 20",    rigtigeKrævet: 20, nøjagtighedsKrævet: 85, interval: "1–20",   min: 1, max: 20,   type: "addition" },
      { trin: 4, navn: "Hundrede-Helt",      emoji: "💪", beskrivelse: "Addition op til 100",   rigtigeKrævet: 25, nøjagtighedsKrævet: 85, interval: "1–100",  min: 1, max: 100,  type: "addition" },
      { trin: 5, navn: "Plus-Mester",        emoji: "🏆", beskrivelse: "Addition op til 1000",  rigtigeKrævet: 30, nøjagtighedsKrævet: 90, interval: "1–1000", min: 1, max: 1000, type: "addition" },
    ],
  },
  {
    id: "minus",
    navn: "Minus-Vejen",
    emoji: "➖",
    farve: "from-orange-500 to-red-600",
    trin: [
      { trin: 1, navn: "Træk-Lærling",       emoji: "🌱", beskrivelse: "Subtraktion 1–5",       rigtigeKrævet: 10, nøjagtighedsKrævet: 80, interval: "1–5",    min: 1, max: 5,    type: "subtraction" },
      { trin: 2, navn: "Minus-Pioner",        emoji: "📝", beskrivelse: "Subtraktion til 10",    rigtigeKrævet: 15, nøjagtighedsKrævet: 80, interval: "1–10",   min: 1, max: 10,   type: "subtraction" },
      { trin: 3, navn: "Minus-Ridder",        emoji: "⚔️", beskrivelse: "Subtraktion til 20",    rigtigeKrævet: 20, nøjagtighedsKrævet: 85, interval: "1–20",   min: 1, max: 20,   type: "subtraction" },
      { trin: 4, navn: "Minus-Helt",          emoji: "💪", beskrivelse: "Subtraktion til 100",   rigtigeKrævet: 25, nøjagtighedsKrævet: 85, interval: "1–100",  min: 1, max: 100,  type: "subtraction" },
      { trin: 5, navn: "Minus-Mester",        emoji: "🏆", beskrivelse: "Subtraktion til 1000",  rigtigeKrævet: 30, nøjagtighedsKrævet: 90, interval: "1–1000", min: 1, max: 1000, type: "subtraction" },
    ],
  },
  {
    id: "gange",
    navn: "Gange-Vejen",
    emoji: "✖️",
    farve: "from-purple-500 to-violet-700",
    trin: [
      { trin: 1, navn: "Gange-Lærling",     emoji: "🌱", beskrivelse: "1–4 gangetabel",          rigtigeKrævet: 10, nøjagtighedsKrævet: 80, interval: "1–4",  min: 1, max: 4,  type: "multiplication" },
      { trin: 2, navn: "Tabel-Pioner",      emoji: "📝", beskrivelse: "1–6 gangetabel",          rigtigeKrævet: 15, nøjagtighedsKrævet: 80, interval: "1–6",  min: 1, max: 6,  type: "multiplication" },
      { trin: 3, navn: "Tabel-Ridder",      emoji: "⚔️", beskrivelse: "1–10 gangetabel",         rigtigeKrævet: 20, nøjagtighedsKrævet: 85, interval: "1–10", min: 1, max: 10, type: "multiplication" },
      { trin: 4, navn: "Tabel-Ekspert",     emoji: "💪", beskrivelse: "1–12 gangetabel",         rigtigeKrævet: 25, nøjagtighedsKrævet: 85, interval: "1–12", min: 1, max: 12, type: "multiplication" },
      { trin: 5, navn: "Gange-Mester",      emoji: "🏆", beskrivelse: "Gangetabeller til 20",    rigtigeKrævet: 30, nøjagtighedsKrævet: 90, interval: "1–20", min: 1, max: 20, type: "multiplication" },
    ],
  },
  {
    id: "dele",
    navn: "Dele-Vejen",
    emoji: "➗",
    farve: "from-sky-500 to-blue-700",
    trin: [
      { trin: 1, navn: "Dele-Lærling",      emoji: "🌱", beskrivelse: "Division med 1–4",        rigtigeKrævet: 10, nøjagtighedsKrævet: 80, interval: "1–4",  min: 1, max: 4,  type: "division" },
      { trin: 2, navn: "Del-Pioner",        emoji: "📝", beskrivelse: "Division med 1–6",        rigtigeKrævet: 15, nøjagtighedsKrævet: 80, interval: "1–6",  min: 1, max: 6,  type: "division" },
      { trin: 3, navn: "Dele-Ridder",       emoji: "⚔️", beskrivelse: "Division med 1–10",       rigtigeKrævet: 20, nøjagtighedsKrævet: 85, interval: "1–10", min: 1, max: 10, type: "division" },
      { trin: 4, navn: "Dele-Ekspert",      emoji: "💪", beskrivelse: "Division med 1–12",       rigtigeKrævet: 25, nøjagtighedsKrævet: 85, interval: "1–12", min: 1, max: 12, type: "division" },
      { trin: 5, navn: "Dele-Mester",       emoji: "🏆", beskrivelse: "Division med 1–20",       rigtigeKrævet: 30, nøjagtighedsKrævet: 90, interval: "1–20", min: 1, max: 20, type: "division" },
    ],
  },
  {
    id: "tal",
    navn: "Tal-Vejen",
    emoji: "🔢",
    farve: "from-yellow-500 to-amber-600",
    trin: [
      { trin: 1, navn: "Tal-Lærling",       emoji: "🌱", beskrivelse: "Bland tal op til 20",     rigtigeKrævet: 10, nøjagtighedsKrævet: 80, interval: "1–20",   min: 1, max: 20,   type: "mixed" },
      { trin: 2, navn: "Tal-Pioner",        emoji: "📝", beskrivelse: "Bland tal op til 50",     rigtigeKrævet: 15, nøjagtighedsKrævet: 80, interval: "1–50",   min: 1, max: 50,   type: "mixed" },
      { trin: 3, navn: "Tal-Ridder",        emoji: "⚔️", beskrivelse: "Bland tal op til 100",    rigtigeKrævet: 20, nøjagtighedsKrævet: 85, interval: "1–100",  min: 1, max: 100,  type: "mixed" },
      { trin: 4, navn: "Tal-Ekspert",       emoji: "💪", beskrivelse: "Bland tal op til 500",    rigtigeKrævet: 25, nøjagtighedsKrævet: 85, interval: "1–500",  min: 1, max: 500,  type: "mixed" },
      { trin: 5, navn: "Tal-Mester",        emoji: "🏆", beskrivelse: "Bland tal op til 1000",   rigtigeKrævet: 30, nøjagtighedsKrævet: 90, interval: "1–1000", min: 1, max: 1000, type: "mixed" },
    ],
  },
  {
    id: "blandet",
    navn: "Blandet-Vejen",
    emoji: "🎯",
    farve: "from-pink-500 to-rose-700",
    trin: [
      { trin: 1, navn: "Blandet-Lærling",  emoji: "🌱", beskrivelse: "Alle regnearter til 10",   rigtigeKrævet: 10, nøjagtighedsKrævet: 80, interval: "1–10",   min: 1, max: 10,   type: "mixed" },
      { trin: 2, navn: "Mix-Pioner",       emoji: "📝", beskrivelse: "Alle regnearter til 20",   rigtigeKrævet: 15, nøjagtighedsKrævet: 80, interval: "1–20",   min: 1, max: 20,   type: "mixed" },
      { trin: 3, navn: "Regner",           emoji: "⚔️", beskrivelse: "Alle regnearter til 50",   rigtigeKrævet: 20, nøjagtighedsKrævet: 85, interval: "1–50",   min: 1, max: 50,   type: "mixed" },
      { trin: 4, navn: "Regner-Ekspert",   emoji: "💪", beskrivelse: "Alle regnearter til 100",  rigtigeKrævet: 25, nøjagtighedsKrævet: 85, interval: "1–100",  min: 1, max: 100,  type: "mixed" },
      { trin: 5, navn: "Alle-Mester",      emoji: "🏆", beskrivelse: "Alle regnearter til 1000", rigtigeKrævet: 30, nøjagtighedsKrævet: 90, interval: "1–1000", min: 1, max: 1000, type: "mixed" },
    ],
  },
];

// ─── Daglige Quests ────────────────────────────────────────────────────────────

export type QuestType = "daglig" | "tilfældig";

export interface Quest {
  id: string;
  navn: string;
  emoji: string;
  beskrivelse: string;
  type: QuestType;
  mål: number;
  xpBelønning: number;
  guldBelønning: number;
  fremskridtsType: "rigtige" | "stribe" | "etage" | "mestringTrin";
}

export const DAGLIGE_QUESTS: Quest[] = [
  { id: "dq-10rigtige",  navn: "Daglig Øvelse",          emoji: "📝", beskrivelse: "Besvar 10 spørgsmål rigtigt i dag.",      type: "daglig",    mål: 10, xpBelønning: 100, guldBelønning: 20,  fremskridtsType: "rigtige" },
  { id: "dq-20rigtige",  navn: "Matematiker for en Dag", emoji: "🧮", beskrivelse: "Besvar 20 spørgsmål rigtigt i dag.",      type: "daglig",    mål: 20, xpBelønning: 200, guldBelønning: 35,  fremskridtsType: "rigtige" },
  { id: "dq-5stribe",    navn: "Stribe-Jæger",           emoji: "🔥", beskrivelse: "Få en stribe på 5 rigtige svar i træk.",  type: "daglig",    mål: 5,  xpBelønning: 150, guldBelønning: 30,  fremskridtsType: "stribe" },
  { id: "dq-1etage",     navn: "Dungeon-Rydder",         emoji: "⚔️", beskrivelse: "Gennemfør 1 dungeon-etage i dag.",        type: "daglig",    mål: 1,  xpBelønning: 200, guldBelønning: 50,  fremskridtsType: "etage" },
  { id: "dq-fejlfri",    navn: "Fejlfri Runde",          emoji: "✨", beskrivelse: "Gennemfør en hel runde uden fejl.",       type: "daglig",    mål: 1,  xpBelønning: 250, guldBelønning: 40,  fremskridtsType: "rigtige" },
  { id: "dq-3etager",    navn: "Dungeon-Helt",           emoji: "🏆", beskrivelse: "Gennemfør 3 dungeon-etager i dag.",       type: "daglig",    mål: 3,  xpBelønning: 350, guldBelønning: 75,  fremskridtsType: "etage" },
  { id: "dq-10stribe",   navn: "Ild-Stregen",            emoji: "💥", beskrivelse: "Opnå en stribe på 10 rigtige.",           type: "daglig",    mål: 10, xpBelønning: 400, guldBelønning: 80,  fremskridtsType: "stribe" },
  { id: "dq-30rigtige",  navn: "Super Øver",             emoji: "⭐", beskrivelse: "Besvar 30 spørgsmål rigtigt i dag.",      type: "daglig",    mål: 30, xpBelønning: 300, guldBelønning: 55,  fremskridtsType: "rigtige" },
];

export const TILFAELDIGE_QUESTS: Quest[] = [
  { id: "tq-etage5",     navn: "Dungeon-Eventyr",        emoji: "🏰", beskrivelse: "Nå etage 5 i dungeonen.",                type: "tilfældig", mål: 5,  xpBelønning: 300, guldBelønning: 80,  fremskridtsType: "etage" },
  { id: "tq-etage10",    navn: "Dybere ned",             emoji: "🌑", beskrivelse: "Nå etage 10 i dungeonen.",               type: "tilfældig", mål: 10, xpBelønning: 500, guldBelønning: 120, fremskridtsType: "etage" },
  { id: "tq-50rigtige",  navn: "Matematikchampion",      emoji: "🥇", beskrivelse: "Besvar 50 spørgsmål rigtigt totalt.",    type: "tilfældig", mål: 50, xpBelønning: 400, guldBelønning: 90,  fremskridtsType: "rigtige" },
  { id: "tq-mestringTrin", navn: "Mestrings-Opnår",    emoji: "🌟", beskrivelse: "Opnå et nyt mestringsniveau.",            type: "tilfældig", mål: 1,  xpBelønning: 600, guldBelønning: 150, fremskridtsType: "mestringTrin" },
];

/** Pick 3 random daily quests for today */
export function pickDailyQuests(): string[] {
  const shuffled = [...DAGLIGE_QUESTS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map((q) => q.id);
}

export function getQuest(id: string): Quest | undefined {
  return [...DAGLIGE_QUESTS, ...TILFAELDIGE_QUESTS].find((q) => q.id === id);
}

// All quest IDs for today's refresh check
export function getQuestsForToday(lastDate: string, lastIds: string[]): string[] {
  const today = new Date().toISOString().split("T")[0];
  if (lastDate === today && lastIds.length > 0) return lastIds;
  return pickDailyQuests();
}
