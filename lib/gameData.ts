// ─── Types ────────────────────────────────────────────────────────────────────

export type ProblemType =
  | "addition"
  | "subtraction"
  | "mixed"
  | "multiplication"
  | "division"
  | "fractions"
  | "decimals"
  | "percentages"
  | "negatives"
  | "algebra_1"
  | "algebra_2"
  | "quadratic"
  | "statistics"
  | "probability"
  | "derivatives";

export interface LevelConfig {
  id: number;
  name: string;
  emoji: string;
  gradient: string;
  cardBg: string;
  btnClass: string;
  grade: string;
  description: string;
  realWorldContext: string;
  xpRequired: number;
  xpPerCorrect: number;
  questionsPerRound: number;
  type: ProblemType;
  min: number;
  max: number;
  showVisual: boolean;
}

export interface Problem {
  question: string;
  visual: { left: string[]; right: string[]; op: string } | null;
  scenario: string;
  answer: number | string;
  options: (number | string)[];
  hint: string;
  explanation: string;
  scenarioEmoji: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rand(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function intOptions(answer: number, lo = 0, hi = 999): (number | string)[] {
  const set = new Set<number>([answer]);
  for (const off of shuffle([1, -1, 2, -2, 3, 4, -3, 5, -4])) {
    if (set.size >= 4) break;
    const v = answer + off;
    if (v >= lo && v <= hi) set.add(v);
  }
  while (set.size < 4) {
    const v = rand(Math.max(lo, answer - 5), Math.min(hi, answer + 5));
    set.add(v);
  }
  return shuffle(Array.from(set));
}

const OBJECTS = [
  { s: "æble", p: "æbler", e: "🍎" },
  { s: "stjerne", p: "stjerner", e: "⭐" },
  { s: "kage", p: "kager", e: "🍰" },
  { s: "bold", p: "bolde", e: "⚽" },
  { s: "fugl", p: "fugle", e: "🐦" },
  { s: "blomst", p: "blomster", e: "🌸" },
  { s: "blyant", p: "blyanter", e: "✏️" },
  { s: "ballon", p: "balloner", e: "🎈" },
  { s: "fisk", p: "fisk", e: "🐟" },
  { s: "is", p: "is", e: "🍦" },
];

function obj() {
  return OBJECTS[rand(0, OBJECTS.length - 1)];
}

// ─── Level configurations ─────────────────────────────────────────────────────

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: "Tælle-Stjerne",
    emoji: "🌟",
    gradient: "from-yellow-300 to-orange-400",
    cardBg: "bg-orange-50",
    btnClass: "bg-orange-400 hover:bg-orange-500 active:scale-95",
    grade: "1. klasse",
    description: "Lær at lægge tal sammen op til 5",
    realWorldContext: "Tæl frugter, legetøj og venner! 🍎",
    xpRequired: 0,
    xpPerCorrect: 10,
    questionsPerRound: 5,
    type: "addition",
    min: 1,
    max: 5,
    showVisual: true,
  },
  {
    id: 2,
    name: "Plus-Pioner",
    emoji: "🌈",
    gradient: "from-pink-300 to-rose-400",
    cardBg: "bg-rose-50",
    btnClass: "bg-rose-400 hover:bg-rose-500 active:scale-95",
    grade: "1. klasse",
    description: "Lær at lægge tal sammen op til 10",
    realWorldContext: "Tæl bolde og kager! 🍰",
    xpRequired: 50,
    xpPerCorrect: 15,
    questionsPerRound: 5,
    type: "addition",
    min: 1,
    max: 10,
    showVisual: true,
  },
  {
    id: 3,
    name: "Minus-Magiker",
    emoji: "🔮",
    gradient: "from-violet-300 to-purple-400",
    cardBg: "bg-violet-50",
    btnClass: "bg-purple-400 hover:bg-purple-500 active:scale-95",
    grade: "1. klasse",
    description: "Lær at trække fra op til 5",
    realWorldContext: "Spis småkager – hvad er der tilbage? 🍪",
    xpRequired: 125,
    xpPerCorrect: 15,
    questionsPerRound: 5,
    type: "subtraction",
    min: 1,
    max: 5,
    showVisual: true,
  },
  {
    id: 4,
    name: "Træk-Trolden",
    emoji: "🧙",
    gradient: "from-blue-300 to-indigo-400",
    cardBg: "bg-indigo-50",
    btnClass: "bg-indigo-400 hover:bg-indigo-500 active:scale-95",
    grade: "1. klasse",
    description: "Træk fra op til 10",
    realWorldContext: "Del godbidder med venner! 🎁",
    xpRequired: 200,
    xpPerCorrect: 20,
    questionsPerRound: 6,
    type: "subtraction",
    min: 1,
    max: 10,
    showVisual: true,
  },
  {
    id: 5,
    name: "Bland-Mesteren",
    emoji: "⚡",
    gradient: "from-teal-300 to-cyan-400",
    cardBg: "bg-teal-50",
    btnClass: "bg-teal-500 hover:bg-teal-600 active:scale-95",
    grade: "1.–2. klasse",
    description: "Plus og minus blandet op til 10",
    realWorldContext: "Hverdagsregning i butikken! 🛍️",
    xpRequired: 320,
    xpPerCorrect: 20,
    questionsPerRound: 6,
    type: "mixed",
    min: 1,
    max: 10,
    showVisual: true,
  },
  {
    id: 6,
    name: "Tyve-Titan",
    emoji: "🦁",
    gradient: "from-amber-400 to-orange-500",
    cardBg: "bg-amber-50",
    btnClass: "bg-amber-500 hover:bg-amber-600 active:scale-95",
    grade: "2. klasse",
    description: "Regn med tal op til 20",
    realWorldContext: "Tæl mønter og pengesedler! 💰",
    xpRequired: 440,
    xpPerCorrect: 25,
    questionsPerRound: 6,
    type: "mixed",
    min: 1,
    max: 20,
    showVisual: false,
  },
  {
    id: 7,
    name: "Hundrede-Ridder",
    emoji: "🏰",
    gradient: "from-green-400 to-emerald-500",
    cardBg: "bg-emerald-50",
    btnClass: "bg-emerald-500 hover:bg-emerald-600 active:scale-95",
    grade: "2.–3. klasse",
    description: "Regn med tal op til 100",
    realWorldContext: "Opskrifter og afstande i naturen! 🌲",
    xpRequired: 590,
    xpPerCorrect: 25,
    questionsPerRound: 7,
    type: "mixed",
    min: 5,
    max: 50,
    showVisual: false,
  },
  {
    id: 8,
    name: "Gange-Guerrilla",
    emoji: "✖️",
    gradient: "from-red-400 to-pink-500",
    cardBg: "bg-red-50",
    btnClass: "bg-pink-500 hover:bg-pink-600 active:scale-95",
    grade: "3. klasse",
    description: "Lær gangetabeller 1–5",
    realWorldContext: "Beregn priser og mængder! 🛒",
    xpRequired: 765,
    xpPerCorrect: 30,
    questionsPerRound: 7,
    type: "multiplication",
    min: 1,
    max: 5,
    showVisual: false,
  },
  {
    id: 9,
    name: "Gange-Guru",
    emoji: "🎯",
    gradient: "from-purple-500 to-indigo-600",
    cardBg: "bg-purple-50",
    btnClass: "bg-indigo-600 hover:bg-indigo-700 active:scale-95",
    grade: "3.–4. klasse",
    description: "Mestrer gangetabeller 1–10",
    realWorldContext: "Areal og fliser i dit hjem! 🏠",
    xpRequired: 975,
    xpPerCorrect: 30,
    questionsPerRound: 8,
    type: "multiplication",
    min: 2,
    max: 10,
    showVisual: false,
  },
  {
    id: 10,
    name: "Dele-Detektiv",
    emoji: "🔍",
    gradient: "from-sky-400 to-blue-500",
    cardBg: "bg-sky-50",
    btnClass: "bg-blue-500 hover:bg-blue-600 active:scale-95",
    grade: "4. klasse",
    description: "Division og ligedeling",
    realWorldContext: "Del pizza og slik retfærdigt! 🍕",
    xpRequired: 1215,
    xpPerCorrect: 35,
    questionsPerRound: 8,
    type: "division",
    min: 2,
    max: 10,
    showVisual: false,
  },
  {
    id: 11,
    name: "Brøke-Bageren",
    emoji: "🍕",
    gradient: "from-yellow-400 to-amber-500",
    cardBg: "bg-yellow-50",
    btnClass: "bg-amber-500 hover:bg-amber-600 active:scale-95",
    grade: "5. klasse",
    description: "Forstå brøker og procent",
    realWorldContext: "Ret og uret del af en pizza! 🍫",
    xpRequired: 1495,
    xpPerCorrect: 40,
    questionsPerRound: 8,
    type: "fractions",
    min: 1,
    max: 10,
    showVisual: false,
  },
  {
    id: 12,
    name: "Decimal-Dragen",
    emoji: "🐉",
    gradient: "from-teal-400 to-green-500",
    cardBg: "bg-teal-50",
    btnClass: "bg-green-500 hover:bg-green-600 active:scale-95",
    grade: "5.–6. klasse",
    description: "Regn med decimaltal",
    realWorldContext: "Priser, afstande og måleenheder! 📏",
    xpRequired: 1815,
    xpPerCorrect: 40,
    questionsPerRound: 8,
    type: "decimals",
    min: 1,
    max: 9,
    showVisual: false,
  },
  {
    id: 13,
    name: "Procent-Pionér",
    emoji: "💯",
    gradient: "from-rose-400 to-red-500",
    cardBg: "bg-rose-50",
    btnClass: "bg-red-500 hover:bg-red-600 active:scale-95",
    grade: "6. klasse",
    description: "Procentregning",
    realWorldContext: "Rabatter, moms og tilbud i butikken! 🏷️",
    xpRequired: 2175,
    xpPerCorrect: 45,
    questionsPerRound: 8,
    type: "percentages",
    min: 10,
    max: 100,
    showVisual: false,
  },
  {
    id: 14,
    name: "Minus-Magnet",
    emoji: "❄️",
    gradient: "from-blue-400 to-cyan-500",
    cardBg: "bg-blue-50",
    btnClass: "bg-cyan-600 hover:bg-cyan-700 active:scale-95",
    grade: "7. klasse",
    description: "Negative tal og tallinje",
    realWorldContext: "Temperaturer, gæld og havniveau! 🌡️",
    xpRequired: 2580,
    xpPerCorrect: 50,
    questionsPerRound: 8,
    type: "negatives",
    min: -10,
    max: 10,
    showVisual: false,
  },
  {
    id: 15,
    name: "Algebra-Alkymist",
    emoji: "⚗️",
    gradient: "from-violet-500 to-purple-600",
    cardBg: "bg-violet-50",
    btnClass: "bg-purple-600 hover:bg-purple-700 active:scale-95",
    grade: "8. klasse",
    description: "Løs simple ligninger med x",
    realWorldContext: "Find ukendte i priser og aldre! 🧩",
    xpRequired: 3030,
    xpPerCorrect: 55,
    questionsPerRound: 8,
    type: "algebra_1",
    min: 1,
    max: 20,
    showVisual: false,
  },
  {
    id: 16,
    name: "Ligning-Lord",
    emoji: "👑",
    gradient: "from-amber-500 to-yellow-600",
    cardBg: "bg-amber-50",
    btnClass: "bg-yellow-600 hover:bg-yellow-700 active:scale-95",
    grade: "8.–9. klasse",
    description: "To-trins ligninger",
    realWorldContext: "Abonnementer, løn og økonomi! 📱",
    xpRequired: 3525,
    xpPerCorrect: 60,
    questionsPerRound: 8,
    type: "algebra_2",
    min: 1,
    max: 10,
    showVisual: false,
  },
  {
    id: 17,
    name: "Kvadrat-Kvant",
    emoji: "🎭",
    gradient: "from-pink-500 to-rose-600",
    cardBg: "bg-pink-50",
    btnClass: "bg-rose-600 hover:bg-rose-700 active:scale-95",
    grade: "9. klasse",
    description: "Andengradsligninger (x²)",
    realWorldContext: "Kastet objekter og optimal produktion! 🚀",
    xpRequired: 4065,
    xpPerCorrect: 65,
    questionsPerRound: 7,
    type: "quadratic",
    min: 1,
    max: 8,
    showVisual: false,
  },
  {
    id: 18,
    name: "Statistik-Strateg",
    emoji: "📊",
    gradient: "from-indigo-500 to-blue-600",
    cardBg: "bg-indigo-50",
    btnClass: "bg-blue-600 hover:bg-blue-700 active:scale-95",
    grade: "Gymnasium",
    description: "Gennemsnit og median",
    realWorldContext: "Analyser karakterer, sport og forskning! 🔭",
    xpRequired: 4645,
    xpPerCorrect: 70,
    questionsPerRound: 7,
    type: "statistics",
    min: 1,
    max: 20,
    showVisual: false,
  },
  {
    id: 19,
    name: "Sandsynligheds-Sage",
    emoji: "🎲",
    gradient: "from-emerald-500 to-teal-600",
    cardBg: "bg-emerald-50",
    btnClass: "bg-teal-600 hover:bg-teal-700 active:scale-95",
    grade: "Gymnasium",
    description: "Sandsynlighedsregning",
    realWorldContext: "Beregn odds i kortspil og forsikring! 🎰",
    xpRequired: 5265,
    xpPerCorrect: 75,
    questionsPerRound: 7,
    type: "probability",
    min: 1,
    max: 20,
    showVisual: false,
  },
  {
    id: 20,
    name: "Kalkulus-Kongen",
    emoji: "🧮",
    gradient: "from-gray-700 to-slate-900",
    cardBg: "bg-slate-50",
    btnClass: "bg-slate-700 hover:bg-slate-800 active:scale-95",
    grade: "Videregående uddannelse",
    description: "Differentiering og kalkulus",
    realWorldContext: "Hastigheder i fysik og økonomi! 📈",
    xpRequired: 5925,
    xpPerCorrect: 100,
    questionsPerRound: 6,
    type: "derivatives",
    min: 2,
    max: 5,
    showVisual: false,
  },
];

// ─── Problem generator ────────────────────────────────────────────────────────

export function generateProblem(level: LevelConfig): Problem {
  const o = obj();

  switch (level.type) {
    // ── Addition ──────────────────────────────────────────────────────────────
    case "addition": {
      const a = rand(level.min, Math.max(level.min, Math.floor(level.max * 0.7)));
      const b = rand(level.min, Math.max(level.min, level.max - a));
      const answer = a + b;
      const visual = level.showVisual
        ? { left: Array(a).fill(o.e), right: Array(b).fill(o.e), op: "+" }
        : null;
      const scenarios = [
        `Du har ${a} ${o.p} ${o.e} og får ${b} mere. Hvor mange ${o.p} har du nu?`,
        `Der er ${a} ${o.p} på bordet. ${b} mere kommer til. Hvor mange er der nu?`,
        `Du samler ${a} ${o.p} og finder ${b} mere. Hvor mange har du i alt?`,
      ];
      return {
        question: `${a} + ${b} = ?`,
        visual,
        scenario: scenarios[rand(0, scenarios.length - 1)],
        answer,
        options: intOptions(answer, 0, level.max + 5),
        hint: `Prøv at tælle videre fra ${a}: ${a}, ${a + 1}... tæl ${b} skridt fremad!`,
        explanation: `${a} + ${b} = ${answer}. Hvis du lægger ${a} og ${b} sammen, får du ${answer}.`,
        scenarioEmoji: o.e,
      };
    }

    // ── Subtraction ───────────────────────────────────────────────────────────
    case "subtraction": {
      const a = rand(Math.max(level.min + 1, 2), level.max);
      const b = rand(1, a - 1);
      const answer = a - b;
      const visual = level.showVisual
        ? { left: Array(a).fill(o.e), right: Array(b).fill("❌"), op: "-" }
        : null;
      const scenarios = [
        `Du har ${a} ${o.p} ${o.e} og spiser ${b}. Hvor mange er der tilbage?`,
        `Der er ${a} ${o.p}. ${b} forsvinder. Hvor mange er der tilbage?`,
        `Du har ${a} ${o.p} og giver ${b} til en ven. Hvor mange har du nu?`,
      ];
      return {
        question: `${a} - ${b} = ?`,
        visual,
        scenario: scenarios[rand(0, scenarios.length - 1)],
        answer,
        options: intOptions(answer, 0, level.max),
        hint: `Start med ${a} og tæl ${b} baglæns: ${a}, ${a - 1}...`,
        explanation: `${a} - ${b} = ${answer}. Vi starter med ${a} og fjerner ${b}, og der er ${answer} tilbage.`,
        scenarioEmoji: o.e,
      };
    }

    // ── Mixed ─────────────────────────────────────────────────────────────────
    case "mixed": {
      return generateProblem({
        ...level,
        type: rand(0, 1) === 0 ? "addition" : "subtraction",
      });
    }

    // ── Multiplication ────────────────────────────────────────────────────────
    case "multiplication": {
      const a = rand(2, level.max);
      const b = rand(2, level.max);
      const answer = a * b;
      const scenarios = [
        `Du har ${a} poser ${o.e}. I hver pose er der ${b} ${o.p}. Hvor mange ${o.p} er der i alt?`,
        `${a} børn har ${b} ${o.p} hver. Hvor mange ${o.p} er der tilsammen?`,
        `Du planter ${a} rækker med ${b} ${o.p} i hver. Hvor mange ${o.p} er der?`,
      ];
      return {
        question: `${a} × ${b} = ?`,
        visual: null,
        scenario: scenarios[rand(0, scenarios.length - 1)],
        answer,
        options: intOptions(answer, 1, 120),
        hint: `${a} × ${b} betyder ${b} lagt sammen ${a} gange: ${Array(a)
          .fill(b)
          .join(" + ")} = ?`,
        explanation: `${a} × ${b} = ${answer}. Det er det samme som ${b} + ${b}... i alt ${a} gange.`,
        scenarioEmoji: o.e,
      };
    }

    // ── Division ──────────────────────────────────────────────────────────────
    case "division": {
      const b = rand(2, level.max);
      const answer = rand(2, level.max);
      const a = b * answer;
      const scenarios = [
        `Du har ${a} ${o.p} ${o.e} og vil dele dem til ${b} børn. Hvor mange får hvert barn?`,
        `${a} ${o.p} fordeles ligeligt i ${b} kurve. Hvor mange er i hver kurv?`,
        `Del ${a} ${o.p} til ${b} venner. Hvad får hver?`,
      ];
      return {
        question: `${a} ÷ ${b} = ?`,
        visual: null,
        scenario: scenarios[rand(0, scenarios.length - 1)],
        answer,
        options: intOptions(answer, 1, 20),
        hint: `Hvad gange ${b} giver ${a}? Det er svaret! (${b} × ? = ${a})`,
        explanation: `${a} ÷ ${b} = ${answer}. ${a} delt i ${b} lige store grupper giver ${answer} i hver gruppe.`,
        scenarioEmoji: o.e,
      };
    }

    // ── Fractions → % ─────────────────────────────────────────────────────────
    case "fractions": {
      const denoms = [2, 3, 4, 5, 8, 10];
      const denom = denoms[rand(0, denoms.length - 1)];
      const num = rand(1, denom - 1);
      const pct = Math.round((num / denom) * 100);
      const distractors = [pct + 5, pct - 5, pct + 10, pct - 10, pct + 15, pct - 15].filter(
        (v) => v >= 0 && v <= 100 && v !== pct
      );
      const scenarios = [
        `En pizza 🍕 er skåret i ${denom} stykker. Du spiser ${num} stykker. Hvad er ${num}/${denom} i procent?`,
        `En chokoladebar 🍫 har ${denom} stykker. Du spiser ${num}. Hvad svarer det til i %?`,
      ];
      return {
        question: `${num}/${denom} = ?%`,
        visual: null,
        scenario: scenarios[rand(0, 1)],
        answer: pct,
        options: shuffle([pct, ...distractors.slice(0, 3)]),
        hint: `Del ${num} med ${denom}: ${num} ÷ ${denom} = ${(num / denom).toFixed(2)}. Gang med 100 for %.`,
        explanation: `${num}/${denom} = ${num} ÷ ${denom} ≈ ${(num / denom).toFixed(2)} = ${pct}%`,
        scenarioEmoji: "🍕",
      };
    }

    // ── Decimals ──────────────────────────────────────────────────────────────
    case "decimals": {
      const a = rand(1, 9) * 0.1;
      const b = rand(1, 9) * 0.1;
      const raw = Math.round((a + b) * 10) / 10;
      const rawStr = raw.toFixed(1);
      const opts: string[] = [rawStr];
      const offsets = [0.1, -0.1, 0.2, -0.2, 0.3];
      for (const off of offsets) {
        if (opts.length >= 4) break;
        const v = Math.round((raw + off) * 10) / 10;
        const vs = v.toFixed(1);
        if (v > 0 && !opts.includes(vs)) opts.push(vs);
      }
      while (opts.length < 4) opts.push((raw + opts.length * 0.1).toFixed(1));
      const scenarios = [
        `Du løber ${a.toFixed(1)} km og derefter ${b.toFixed(1)} km mere. Hvor langt løber du i alt?`,
        `En flaske indeholder ${a.toFixed(1)} liter og en anden ${b.toFixed(1)} liter. Hvad er det tilsammen?`,
      ];
      return {
        question: `${a.toFixed(1)} + ${b.toFixed(1)} = ?`,
        visual: null,
        scenario: scenarios[rand(0, 1)],
        answer: rawStr,
        options: shuffle(opts),
        hint: `Tael decimalerne separat: ${Math.round(a * 10) + Math.round(b * 10)} tiendedele = ${raw.toFixed(1)}`,
        explanation: `${a.toFixed(1)} + ${b.toFixed(1)} = ${raw.toFixed(1)}. Sæt kommaet rigtigt!`,
        scenarioEmoji: "🏃",
      };
    }

    // ── Percentages ───────────────────────────────────────────────────────────
    case "percentages": {
      const pcts = [10, 20, 25, 50, 75];
      const pct = pcts[rand(0, pcts.length - 1)];
      const totals = [100, 200, 80, 40, 120, 60, 400];
      const total = totals[rand(0, totals.length - 1)];
      const answer = (pct / 100) * total;
      const scenarios = [
        `En vare koster ${total} kr. Den er sat ned med ${pct}%. Hvad er rabatbeløbet? 🏷️`,
        `Der er ${total} elever på skolen. ${pct}% er piger. Hvor mange piger er der?`,
        `Du sparer ${pct}% af dine lommepenge på ${total} kr. Hvad sparer du?`,
      ];
      return {
        question: `${pct}% af ${total} = ?`,
        visual: null,
        scenario: scenarios[rand(0, scenarios.length - 1)],
        answer,
        options: intOptions(answer, 0, total),
        hint: `${pct}% = ${pct}/100. Beregn: ${pct} × ${total} ÷ 100`,
        explanation: `${pct}% af ${total} = (${pct} ÷ 100) × ${total} = ${answer}`,
        scenarioEmoji: "🛒",
      };
    }

    // ── Negatives ─────────────────────────────────────────────────────────────
    case "negatives": {
      const a = rand(-8, 4);
      const b = rand(1, 8);
      const answer = a - b;
      const scenarios = [
        `Det er ${a}°C udenfor. Temperaturen falder med ${b} grader. Hvad er temperaturen nu? 🌡️`,
        `Du skylder banken ${Math.abs(Math.min(a, 0))} kr. (${a} kr.) og bruger ${b} kr. mere. Hvad er din saldo?`,
      ];
      return {
        question: `${a} − ${b} = ?`,
        visual: null,
        scenario: scenarios[rand(0, 0)],
        answer,
        options: shuffle([answer, answer + 1, answer - 1, answer + 2]),
        hint: `Tallinje: start ved ${a}, gå ${b} skridt til venstre → hvad lander du på?`,
        explanation: `${a} − ${b} = ${answer}. Vi bevæger os ${b} til venstre på tallinjen fra ${a}.`,
        scenarioEmoji: "🌡️",
      };
    }

    // ── Algebra 1-trins ───────────────────────────────────────────────────────
    case "algebra_1": {
      const x = rand(1, 15);
      const b = rand(1, 10);
      const sum = x + b;
      const flip = rand(0, 1) === 0;
      const scenarios = [
        `En eske vejer x kg. Med ${b} kg ekstra er vægten ${sum} kg. Hvad vejer esken? 📦`,
        `Du har et ukendt antal ${o.p} plus ${b} mere = ${sum} i alt. Hvad er det ukendte antal? ${o.e}`,
      ];
      return {
        question: flip ? `${sum} − x = ${b}  →  x = ?` : `x + ${b} = ${sum}  →  x = ?`,
        visual: null,
        scenario: scenarios[rand(0, 1)],
        answer: x,
        options: intOptions(x, 1, 20),
        hint: `Isoler x: træk ${b} fra begge sider af lighedstegnet. ${sum} − ${b} = ?`,
        explanation: `x + ${b} = ${sum}  →  x = ${sum} − ${b} = ${x}`,
        scenarioEmoji: "🧩",
      };
    }

    // ── Algebra 2-trins ───────────────────────────────────────────────────────
    case "algebra_2": {
      const x = rand(1, 10);
      const a = rand(2, 5);
      const b = rand(1, 10);
      const sum = a * x + b;
      return {
        question: `${a}x + ${b} = ${sum}  →  x = ?`,
        visual: null,
        scenario: `Et mobil-abonnement koster ${b} kr. plus ${a} kr. per GB. Du betaler ${sum} kr. Hvor mange GB brugte du? 📱`,
        answer: x,
        options: intOptions(x, 1, 15),
        hint: `Trin 1: Træk ${b} fra begge sider → ${a}x = ${sum - b}. Trin 2: Del med ${a} → x = ${x}`,
        explanation: `${a}x + ${b} = ${sum}  →  ${a}x = ${sum - b}  →  x = ${sum - b} ÷ ${a} = ${x}`,
        scenarioEmoji: "📱",
      };
    }

    // ── Quadratic ─────────────────────────────────────────────────────────────
    case "quadratic": {
      const r1 = rand(1, level.max);
      const r2 = rand(1, level.max);
      const bCoef = -(r1 + r2);
      const cCoef = r1 * r2;
      const bStr = bCoef < 0 ? `${bCoef}x` : `+${bCoef}x`;
      const cStr = cCoef < 0 ? `${cCoef}` : `+${cCoef}`;
      const ansStr = r1 === r2 ? `x = ${r1}` : `x = ${r1} eller x = ${r2}`;
      const opts = [
        ansStr,
        `x = ${r1 + 1} eller x = ${r2}`,
        `x = ${r1} eller x = ${r2 + 1}`,
        `x = ${r1 + 1} eller x = ${r2 + 1}`,
      ];
      return {
        question: `x² ${bStr} ${cStr} = 0  →  x = ?`,
        visual: null,
        scenario: `En bold kastes op. Dens højde (meter) er h(t) = t²${bStr}${cStr}. Hvornår rammer den jorden (h = 0)? ⚽`,
        answer: ansStr,
        options: shuffle(opts),
        hint: `Find to tal der giver ${cCoef} som produkt og ${-(bCoef)} som sum. (x − ${r1})(x − ${r2}) = 0`,
        explanation: `x² ${bStr} ${cStr} = (x − ${r1})(x − ${r2}) = 0  →  x = ${r1} eller x = ${r2}`,
        scenarioEmoji: "⚽",
      };
    }

    // ── Statistics ────────────────────────────────────────────────────────────
    case "statistics": {
      const n = rand(4, 7);
      const nums = Array.from({ length: n }, () => rand(1, 20));
      const sorted = [...nums].sort((a, b) => a - b);
      const sum = nums.reduce((acc, v) => acc + v, 0);
      const mean = Math.round((sum / n) * 10) / 10;
      const median =
        n % 2 === 0
          ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
          : sorted[Math.floor(n / 2)];
      const useMean = rand(0, 1) === 0;
      const ans = useMean ? mean : median;
      const ansStr = ans.toFixed(1);
      const distract = [ans + 0.5, ans - 0.5, ans + 1, ans - 1]
        .filter((v) => v !== ans && v > 0)
        .map((v) => v.toFixed(1));
      return {
        question: useMean
          ? `Hvad er gennemsnittet af: ${nums.join(", ")}?`
          : `Hvad er medianen af (sorteret): ${sorted.join(", ")}?`,
        visual: null,
        scenario: useMean
          ? `Dine karakterer dette semester er: ${nums.join(", ")}. Hvad er dit gennemsnit? 📚`
          : `Testresultater sorteret: ${sorted.join(", ")}. Hvad er midterværdien? 📊`,
        answer: ansStr,
        options: shuffle([ansStr, ...distract.slice(0, 3)]),
        hint: useMean
          ? `Læg alle tal sammen (${sum}) og del med antal tal (${n}): ${sum} ÷ ${n}`
          : `Sorteret: ${sorted.join(", ")} → find det/de midterste tal`,
        explanation: useMean
          ? `Gennemsnit = (${nums.join("+")}) ÷ ${n} = ${sum} ÷ ${n} = ${mean.toFixed(1)}`
          : `Median af ${sorted.join(", ")} = ${median.toFixed(1)}`,
        scenarioEmoji: "📊",
      };
    }

    // ── Probability ───────────────────────────────────────────────────────────
    case "probability": {
      const total = rand(5, 20);
      const favorable = rand(1, total - 1);
      const pct = Math.round((favorable / total) * 100);
      const distracts = [pct + 5, pct - 5, pct + 10, pct - 10].filter(
        (v) => v >= 0 && v <= 100 && v !== pct
      );
      const slices = total - favorable;
      const scenarios = [
        `I en pose med ${total} bolde er ${favorable} røde og ${slices} blå. Hvad er sandsynligheden for at trække en rød bold? (i %) 🎱`,
        `I en klasse med ${total} elever er ${favorable} fra Aarhus. Hvad er sandsynligheden (%) for en tilfældig elev er derfra?`,
      ];
      return {
        question: `P = ${favorable}/${total} ≈ ?%`,
        visual: null,
        scenario: scenarios[rand(0, 1)],
        answer: pct,
        options: shuffle([pct, ...distracts.slice(0, 3)]),
        hint: `Sandsynlighed = gunstige udfald ÷ alle udfald = ${favorable} ÷ ${total} × 100`,
        explanation: `P = ${favorable}/${total} = ${(favorable / total).toFixed(3)} ≈ ${pct}%`,
        scenarioEmoji: "🎲",
      };
    }

    // ── Derivatives ───────────────────────────────────────────────────────────
    case "derivatives": {
      const n = rand(2, level.max);
      const coef = rand(1, 5);
      const ansCoef = coef * n;
      const ansPow = n - 1;
      const fnStr = `f(x) = ${coef === 1 ? "" : coef}x^${n}`;
      const ansStr =
        ansPow === 0
          ? `${ansCoef}`
          : ansPow === 1
          ? `${ansCoef}x`
          : `${ansCoef}x^${ansPow}`;
      const opts = [
        ansStr,
        ansPow === 1 ? `${ansCoef + 1}x` : `${ansCoef + 1}x^${ansPow}`,
        `${coef}x^${n + 1}`,
        `${ansCoef}x^${ansPow + 1}`,
      ];
      const scenarios = [
        `En bils position er ${fnStr} meter. Hvad er bilens hastighed? (f′(x) = ?) 🚗`,
        `Et firmas overskud er ${fnStr} kr. Find marginaloverskuddet (f′(x)). 📈`,
      ];
      return {
        question: `${fnStr}  →  f′(x) = ?`,
        visual: null,
        scenario: scenarios[rand(0, 1)],
        answer: ansStr,
        options: shuffle(opts),
        hint: `Potensreglen: d/dx[ax^n] = n·ax^(n−1). Her: ${n} × ${coef}x^(${n}−1)`,
        explanation: `f′(x) = ${n} × ${coef}x^${n - 1} = ${ansStr}`,
        scenarioEmoji: "📈",
      };
    }

    default:
      return generateProblem({ ...level, type: "addition" });
  }
}

// ─── Badge definitions ────────────────────────────────────────────────────────

export const BADGES = [
  { id: "first", label: "Første skridt!", emoji: "👣", xpNeeded: 10 },
  { id: "streak3", label: "Hat trick!", emoji: "🎩", streakNeeded: 3 },
  { id: "streak5", label: "Ildspitter!", emoji: "🔥", streakNeeded: 5 },
  { id: "level5", label: "Halvvejs til guldmedalje!", emoji: "🥉", levelNeeded: 5 },
  { id: "level10", label: "Matematik-helt!", emoji: "🦸", levelNeeded: 10 },
  { id: "level15", label: "Algebra-ridder!", emoji: "⚔️", levelNeeded: 15 },
  { id: "level20", label: "Kalkulus-Kongen!", emoji: "👑", levelNeeded: 20 },
  { id: "xp1000", label: "1000 XP-mester!", emoji: "💎", xpNeeded: 1000 },
  { id: "xp5000", label: "5000 XP-legende!", emoji: "🌟", xpNeeded: 5000 },
];

export const ENCOURAGEMENTS_CORRECT = [
  "Fantastisk! 🎉",
  "Du er en stjerne! ⭐",
  "Super godt! 🚀",
  "Perfekt! 🎯",
  "Vidunderligt! 🌟",
  "Bravo! 🏆",
  "Fremragende! 💪",
  "Wow, du er skarp! 🔥",
];

export const ENCOURAGEMENTS_WRONG = [
  "Næsten! Prøv igen 💪",
  "Det var tæt på! 🤔",
  "Du kan godt! Prøv én gang til 🌟",
  "Fejl er læring! Igen! 🎓",
  "Næsten der! 💡",
  "Fortvivl ikke – prøv igen! ✨",
];

// ─── Growth Mindset messages ───────────────────────────────────────────────────

export const GROWTH_MINDSET_CORRECT = [
  "Din hjerne er vokset! 🧠✨",
  "Øvelse gør mester! Du beviser det! 🏆",
  "Dygtighed bygges ét svar ad gangen! ⭐",
  "Se hvor langt du er kommet! 🚀",
  "Matematik er en færdighed du KAN lære! 💪",
  "Fremragende – og du er ikke færdig endnu! 🌱",
  "Din indsats betaler sig! 🎯",
  "Hvert rigtigt svar styrker dit matematiske sind! 🔥",
  "Du tænker som en matematiker! 🧮",
  "Fantastisk! Hjernens nervebaner vokser! 💡",
];

export const GROWTH_MINDSET_WRONG = [
  "Fejl er din hjerne der arbejder hårdest! 🧠",
  "Endnu ikke – men du er tættere på! 💪",
  "Hvert forsøg gør dig stærkere! 🌱",
  "Matematik kræver øvelse – prøv igen! 🎯",
  "Denne fejl er del af din læring! ✨",
  "Fejl = ny viden. Prøv en anden mulighed! 🔍",
  "Din hjerne laver nye forbindelser nu! 🧠💡",
  "Vedholdenhed er matematikeres superkraft! 🦸",
];

// ─── Progressive Hints ─────────────────────────────────────────────────────────

export function getProgressiveHints(problem: Problem): [string, string, string] {
  const hint1 = problem.hint;

  // Level 2: narrowing hint based on answer type
  let hint2: string;
  if (typeof problem.answer === "number") {
    const a = problem.answer;
    hint2 = a > 0
      ? `Svaret er et positivt tal. Prøv at udelukke muligheder der virker for store eller for små.`
      : a < 0
      ? `Svaret er et negativt tal (under 0). Tænk på tallinjen til venstre for nul.`
      : `Svaret er nul – intet til overs og intet ekstra.`;
  } else {
    hint2 = `Prøv at sammenligne hver svarmulighed med spørgsmålet trin for trin.`;
  }

  // Level 3: reveal + full explanation
  const hint3 = `Svaret er: ${problem.answer}. ${problem.explanation}`;

  return [hint1, hint2, hint3];
}
