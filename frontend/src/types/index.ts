export type HeroGender = "MALE" | "FEMALE";

export type HeroClass =
  | "WARRIOR"
  | "SAGE"
  | "TECHMANCER"
  | "RANGER"
  | "MAGE"
  | "CREATOR";

export type QuestCategory =
  | "CAREER"
  | "STUDY"
  | "FITNESS"
  | "CODING"
  | "GROWTH"
  | "CREATIVITY"
  | "DISCIPLINE";

export type QuestDifficulty = "EASY" | "NORMAL" | "HARD" | "EPIC";

export type QuestType = "DAILY" | "MAIN" | "SIDE" | "EPIC";

export type ItemCategory =
  | "WEAPON"
  | "ARMOR"
  | "HELMET"
  | "GLOVES"
  | "BOOTS"
  | "ACCESSORY"
  | "AURA"
  | "FRAME"
  | "BACKGROUND"
  | "CONSUMABLE";

export type ItemRarity =
  | "COMMON"
  | "UNCOMMON"
  | "RARE"
  | "EPIC"
  | "LEGENDARY"
  | "MYTHIC";

export interface Attributes {
  strength: number;
  intelligence: number;
  dexterity: number;
  wisdom: number;
  charisma: number;
  discipline: number;
}

export interface Character {
  id: string;
  level: number;
  currentXp: number;
  requiredXp: number;
  progressPercent: number;
  title: string;
  evolutionStage: string;
  gold: number;
  crystals: number;
  tokens: number;
  heroClass: HeroClass;
  heroGender: HeroGender;
  name: string;
  baseAttributes: Attributes;
  gearBonuses: Attributes;
  totalAttributes: Attributes;
  streak?: {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string | null;
  };
  equippedGear: Array<{
    slot: ItemCategory;
    item: Item;
  }>;
  evolutionTimeline: Array<{
    minLevel: number;
    stage: string;
    title: string;
    isUnlocked: boolean;
  }>;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile?: {
    heroGender: HeroGender;
    heroClass: HeroClass;
    avatarUrl?: string;
    bio?: string;
    selectedGoals?: string;
  };
  character?: Character;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  type: QuestType;
  dueDate?: string | null;
  recurrence: string;
  estimatedMinutes: number;
  attributeAffected: string;
  xpReward: number;
  goldReward: number;
  bonusReward?: string | null;
  bossConnectionId?: string | null;
  isCompleted: boolean;
  completedAt?: string | null;
}

export interface Skill {
  id: string;
  branch: string;
  name: string;
  description: string;
  tier: number;
  requiredLevel: number;
  requiredAttr: string;
  requiredAttrVal: number;
  icon: string;
  statBonusParsed: Record<string, number>;
  isUnlocked: boolean;
  canUnlock: boolean;
  meetsLevel: boolean;
  meetsAttr: boolean;
  currentAttrVal: number;
}

export interface Boss {
  id: string;
  name: string;
  description: string;
  lore: string;
  maxHp: number;
  currentHp: number;
  hpPercent: number;
  level: number;
  difficulty: string;
  weaknessCategory: string;
  weaknessDesc: string;
  xpReward: number;
  goldReward: number;
  crystalsReward: number;
  specialReward?: string | null;
  imageUrl: string;
  isDefeated: boolean;
  timesDefeated: number;
  attacks?: Array<{
    questId: string;
    title: string;
    category: string;
    difficulty: string;
    damage: number;
    isWeaknessExploit: boolean;
  }>;
}

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  rarity: ItemRarity;
  price: number;
  currency: "GOLD" | "CRYSTAL" | "TOKEN";
  description: string;
  icon: string;
  statBonusParsed: Record<string, number>;
  isEquippable: boolean;
  isOwned?: boolean;
  isEquipped?: boolean;
  quantity?: number;
}

export interface Achievement {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  criteriaType: string;
  criteriaValue: number;
  crystalsReward: number;
  xpReward: number;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string | null;
  currentProgress: number;
  progressPercent: number;
}

export interface WorldRegion {
  id: string;
  code: string;
  name: string;
  theme: string;
  description: string;
  lore: string;
  unlockLevel: number;
  imageUrl: string;
  isUnlocked: boolean;
  isCurrent?: boolean;
}

export interface NotificationItem {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  reason: string;
  suggestedQuestTitle: string;
  category: QuestCategory;
  difficulty: QuestDifficulty;
  attribute: string;
  xpReward: number;
  goldReward: number;
  createdAt: string;
}

export interface QuestCompletionResult {
  questId: string;
  questTitle: string;
  xpEarned: number;
  goldEarned: number;
  attributeDelta: Record<string, number>;
  levelUp: {
    occurred: boolean;
    previousLevel: number;
    newLevel: number;
    newTitle: string;
    newStage: string;
    crystalsAwarded: number;
  };
  streak: {
    current: number;
    longest: number;
    milestoneHit?: {
      days: number;
      gold: number;
      crystals: number;
      badge: string;
    };
  };
  bossDamage: {
    dealt: number;
    bossName: string;
    remainingHp: number;
    defeated: boolean;
    bossRewards?: {
      xp: number;
      gold: number;
      crystals: number;
      specialReward?: string | null;
    };
  } | null;
  unlockedAchievements: Array<{
    code: string;
    name: string;
    description: string;
    crystalsReward: number;
  }>;
  unlockedRegions: Array<{
    code: string;
    name: string;
  }>;
}
