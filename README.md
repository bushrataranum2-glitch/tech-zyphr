# ⚔️ QUESTME

> **"Your life. Your quests. Your evolution."**

QuestMe is a production-quality gamified real-life progression RPG web application where users turn real-world activities into quests, complete them to gain XP and currency, improve character attributes, unlock skills, defeat obstacle bosses, explore a fantasy/cyberpunk world, collect equipment, and evolve their character.

---

## 🌟 Core Product Vision

```
REAL-LIFE ACTION ➔ QUEST ➔ REWARD ➔ ATTRIBUTE ➔ SKILL ➔ HERO EVOLUTION ➔ WORLD EVOLUTION
```

Ordinary activities are transformed into an epic anime RPG journey:
- **Study Java / DSA for 90 minutes** ➔ **+150 XP**, **+40 Gold**, **+10 Intelligence**, **+5 Discipline**, strikes **153 DMG** to *Chronos the Devourer (Procrastination)*, advances active streak!
- **Level Up** triggers a cinematic celebration with audio fanfare, particle bursts, and unseals higher evolution stages, new world regions, and mastery skills.

---

## 🎨 Unique Creative Direction

- **Light + Bright + Premium UI**: Warm off-white (`#F8F9FD`), soft lavender (`#F5F3FF`), pale blue (`#F0F7FF`), subtle pink/violet, and light cream, accented with controlled neon cyan (`#06B6D4`), violet (`#8B5CF6`), and radiant gold (`#F59E0B`).
- **Dark Hero Character**: Bold, mature, powerful, stylish, cinematic cyberpunk anime protagonist in dark tactical cyber-armor with glowing energy runes and animated aura rings.
- **Web Audio API Sound Engine**: Zero-asset procedural synthesis for quest completion chimes, coin drops, boss slash impacts, skill unlocks, and level-up fanfares.

---

## ⚡ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React, Canvas Confetti, Web Audio API |
| **Backend** | Node.js, Express, TypeScript, REST API, JWT Authentication, Bcrypt Password Hashing |
| **Database** | SQLite via Prisma ORM (`questme.db`) — durable local SQL storage, atomic transactions |
| **AI System** | Quest Master neural mentor — context-aware advice with intelligent heuristic fallback |

---

## 🗺️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                 FRONTEND (Vite + React 18)                  │
│   Dashboard • Quests • Hero • Skills • Raids • Market       │
│   World Map • Legends • Growth Analytics • Quest Master     │
└──────────────┬───────────────────────────────▲──────────────┘
               │ Authenticated JWT             │ State & SFX
               ▼                               │
┌──────────────────────────────────────────────┴──────────────┐
│             EXPRESS REST API BACKEND (TypeScript)           │
│   /api/auth  •  /api/quests  •  /api/character  • /api/shop │
│   /api/bosses  •  /api/skills  •  /api/ai  •  /api/world    │
└──────────────┬───────────────────────────────▲──────────────┘
               │ Atomic Transactions           │ Query Results
               ▼                               │
┌──────────────────────────────────────────────┴──────────────┐
│           DURABLE PRISMA RELATIONAL DATABASE (SQLite)       │
│   Users, Characters, Attributes, Quests, Streaks, Skills    │
│   Bosses, Inventory, Transactions, Achievements, Regions    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎮 Game Progression & Balancing

### 1. Non-Linear Level Formula
$$\text{XP\_REQUIRED}(\text{Level}) = \lfloor 100 \times \text{Level}^{1.5} \rfloor$$
- **Level 1**: 100 XP
- **Level 2**: 282 XP
- **Level 5 (Awakened)**: 1,118 XP
- **Level 10 (Specialist)**: 3,162 XP
- **Level 20 (Elite)**: 8,944 XP
- **Level 30 (Master)**: 16,431 XP
- **Level 50 (Legend)**: 35,355 XP
- **Level 100 (Mythic)**: 100,000 XP

### 2. Server-Authoritative Difficulty Rewards
| Difficulty | XP Reward | Gold Reward | Primary Attribute | Discipline |
| :--- | :---: | :---: | :---: | :---: |
| **Easy** | +40 XP | +10 🪙 | +2 | +1 |
| **Normal** | +80 XP | +20 🪙 | +5 | +2 |
| **Hard** | +150 XP | +40 🪙 | +10 | +5 |
| **Epic** | +400 XP | +100 🪙 | +25 | +15 (+5 💎) |

### 3. Obstacle Boss Raids
Bosses embody real-world friction and are damaged when you complete related quests:
- **Chronos the Devourer (Procrastination)** — 3,000 HP • Weakness: `DISCIPLINE` (1.5x damage)
- **Sirens of the Infinite Feed (Distraction)** — 6,000 HP • Weakness: `STUDY`
- **The Shadow Doppelgänger (Self-Doubt)** — 9,000 HP • Weakness: `CODING`
- **Maelstrom of Entropy (Chaos)** — 12,000 HP • Weakness: `DISCIPLINE`
- **Nihil the Abyssal Sloth (The Void)** — 25,000 HP • Weakness: `CAREER`

### 4. Hero Classes & Attributes
- **Warrior**: Primary `Strength`, Secondary `Discipline`
- **Sage**: Primary `Intelligence`, Secondary `Wisdom`
- **Techmancer**: Primary `Intelligence`, Secondary `Creativity`
- **Ranger**: Primary `Dexterity`, Secondary `Endurance`
- **Mage**: Primary `Wisdom`, Secondary `Creativity`
- **Creator**: Primary `Creativity`, Secondary `Charisma`

---

## 🤖 AI Quest Master

- **Role**: Wise cyberpunk-fantasy mentor embedded inside Neo-Alexandria.
- **Adaptive Daily Quests**: Identifies your weakest attribute and automatically recommends a tailored challenge.
- **Interactive Mentoring**: Answers tactical questions ("*How can I defeat this boss?*", "*Which skill should I unlock?*").
- **Authoritative Security**: The AI cannot manipulate user XP, Gold, or stats directly; all rewards are verified and committed by the backend engine.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation
```bash
# 1. Clone repository
git clone <repo-url>
cd hack

# 2. Install backend dependencies
npm --prefix backend install

# 3. Install frontend dependencies
npm --prefix frontend install

# 4. Initialize database schema & seed RPG content
npm --prefix backend run prisma:push
npm --prefix backend run prisma:seed
```

### Environment Configuration
Copy `.env.example` to `.env` and `backend/.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DATABASE_URL="file:./prisma/questme.db"
JWT_SECRET="questme_super_secret_jwt_key_2026_rpg_evolution"
AI_API_KEY="" # Optional Gemini/OpenAI API key
```

### Running in Development
In two separate terminals:
```bash
# Terminal 1: Start Backend Server (http://localhost:5000)
npm run dev:backend

# Terminal 2: Start Frontend App (http://localhost:5173)
npm run dev:frontend
```

### Production Build
```bash
# Build backend
npm run build:backend

# Build frontend
npm run build:frontend
```

---

## 🧪 Automated Verification Test Suite

Run the built-in end-to-end integration and HTTP test suites:
```bash
# Verify atomic progression, level-up, boss damage, and persistence:
node backend/node_modules/tsx/dist/cli.mjs backend/src/testIntegration.ts

# Verify HTTP REST API endpoints:
node backend/node_modules/tsx/dist/cli.mjs backend/src/testHttpEndpoints.ts
```

---

## 🏆 Hackathon Walkthrough Demo Guide

| Step | Screen | Action | Expected Result |
| :---: | :--- | :--- | :--- |
| **1** | Landing | Open `http://localhost:5173` | Shows "Your Life. Your Quests. Your Evolution." with Hero showcase. |
| **2** | Onboarding | Click "Start Your Journey" | 6-step wizard: Choose Hero Gender (Male/Female), Class (Techmancer), Goals, Difficulty. |
| **3** | Character Reveal | Enter Name & Credentials | Hero character card generated with class starter stats. |
| **4** | Dashboard | Arrive at Command Center | Displays Hero Level 1, 6 attribute progress bars, Today's starter quests, Active Raid Boss. |
| **5** | Quests | Click "+ New Quest" | Create *"Complete 2 Java problems"*, Hard difficulty, Coding category. |
| **6** | Complete Quest | Click checkbox on new quest | 11-step sequence: animated check, +150 XP floater, +40 Gold floater, INT & DISC increase. |
| **7** | Level Up! | Trigger level threshold | Cinematic celebration modal with audio fanfare, +5 Crystals awarded! |
| **8** | Skills | Navigate to "Skill Tree" | Unlock *"Focus Protocol"* in the Intellect branch; permanent stat boosts applied. |
| **9** | Boss Raid | Navigate to "Raids" | Observe *Chronos the Devourer* damaged by completed coding quest. |
| **10** | Market | Navigate to "Market" | Purchase *"Neon Katana"* with earned Gold; click "Equip" to boost character stats. |
| **11** | World Map | Navigate to "World" | Observe newly unsealed biomes (Neo-Alexandria, Sanctum of Aethelgard). |
| **12** | Quest Master | Navigate to "Quest Master" | Ask *"What should I focus on today?"* and accept recommended daily quest. |
| **13** | Persistence | Refresh page or re-login | 100% of stats, level, inventory, and streak remain preserved in SQLite! |

---

## 📄 License
MIT © 2026 QuestMe Core Engine
