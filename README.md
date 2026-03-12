# Matematik Eventyr 🏰

An interactive, gamified math learning app for children — built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**.

Inspired by the visual style of Heroes of Might & Magic III, children explore a fantasy city, battle monsters in math dungeons, and level up their hero as they learn.

---

## Features

- **📚 Math Dungeons** — Answer math questions to defeat monsters and advance through dungeon floors. Supports addition, subtraction, multiplication, and division across adjustable difficulty levels.
- **🗺️ City Map** — A HoMM3-style overworld where players navigate between buildings (Dungeon, Hero Panel, Quest Board, etc.).
- **🦸 Hero System** — Choose a hero class (Warrior, Mage, Ranger, Paladin), pick an avatar, and earn XP, gold, and titles as you play. Track stats and achievements in the Hero Panel.
- **📋 Quest Board** — Create quests and join co-op rooms with other players via `BroadcastChannel`.
- **🔊 Text-to-Speech** — All questions and answers can be read aloud in natural Danish using the Web Speech API, with smart voice selection that prioritises `da-DK` voices.
- **👤 Multi-Profile Support** — Multiple player profiles stored in `localStorage`, each with their own hero progression.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install & Run

```bash
git clone https://github.com/ydrasil77/matematik-eventyr.git
cd matematik-eventyr
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
app/
  page.tsx          # Root page — multi-screen orchestration
  layout.tsx        # HTML shell + global styles
components/
  ProfileScreen.tsx # Profile selection & hero creation flow
  CityMap.tsx       # HoMM3-style city overworld
  MathGame.tsx      # Core math game with dungeon mode
  HeroPanel.tsx     # Hero stats, equipment, titles, achievements
  QuestBoard.tsx    # Quest creation & co-op room system
lib/
  types.ts          # Shared TypeScript types (Profile, HeroClass, …)
  achievements.ts   # Hero classes, mounts, titles, achievements, monsters
  gameData.ts       # Math question generators per subject/difficulty
  useTTS.ts         # Web Speech API hook with Danish voice selection
```

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org/) | React framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| Web Speech API | Text-to-speech in Danish |
| localStorage | Persistent player profiles |
| BroadcastChannel | Cross-tab co-op rooms |

---

## License

MIT
