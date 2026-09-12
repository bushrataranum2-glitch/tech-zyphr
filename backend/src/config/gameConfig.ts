export interface DifficultyReward {
  xp: number;
  gold: number;
  primaryAttr: number;
  discipline: number;
}

export const DIFFICULTY_REWARDS: Record<string, DifficultyReward> = {
  EASY: { xp: 40, gold: 10, primaryAttr: 2, discipline: 1 },
  NORMAL: { xp: 80, gold: 20, primaryAttr: 5, discipline: 2 },
  HARD: { xp: 150, gold: 40, primaryAttr: 10, discipline: 5 },
  EPIC: { xp: 400, gold: 100, primaryAttr: 25, discipline: 15 },
};

export const EVOLUTION_STAGES = [
  { minLevel: 1, stage: "Novice", title: "Novice Adventurer" },
  { minLevel: 5, stage: "Awakened", title: "Awakened Seeker" },
  { minLevel: 10, stage: "Specialist", title: "Specialist Vanguard" },
  { minLevel: 20, stage: "Elite", title: "Elite Champion" },
  { minLevel: 30, stage: "Master", title: "Grand Master" },
  { minLevel: 50, stage: "Legend", title: "Living Legend" },
  { minLevel: 100, stage: "Mythic", title: "Mythic Sovereign" },
];

export function getXpRequiredForLevel(level: number): number {
  if (level <= 0) return 100;
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function getEvolutionStageForLevel(level: number) {
  let matched = EVOLUTION_STAGES[0];
  for (const stage of EVOLUTION_STAGES) {
    if (level >= stage.minLevel) {
      matched = stage;
    }
  }
  return matched;
}

export const STREAK_MILESTONES: Record<number, { gold: number; crystals: number; badge: string }> = {
  3: { gold: 25, crystals: 2, badge: "SPARK_OF_CONSISTENCY" },
  7: { gold: 50, crystals: 5, badge: "WARRIOR_OF_SEVEN" },
  14: { gold: 100, crystals: 10, badge: "FORTNIGHT_CHAMPION" },
  30: { gold: 250, crystals: 25, badge: "UNSTOPPABLE_FORCE" },
  60: { gold: 500, crystals: 50, badge: "HABIT_TITAN" },
  100: { gold: 1000, crystals: 100, badge: "CENTURY_MASTER" },
};
