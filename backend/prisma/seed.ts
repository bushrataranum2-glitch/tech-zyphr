import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding QuestMe master game database...");

  // 1. Seed World Regions
  const regions = [
    {
      code: "STARTING_OUTPOST",
      name: "The First Citadel",
      theme: "FOUNDATION",
      description: "A sanctuary where newly awakened heroes register their resolve.",
      lore: "Carved from ancient crystal monoliths, this outpost marks the threshold between ordinary reality and legend.",
      unlockLevel: 1,
      imageUrl: "/images/world/citadel.webp"
    },
    {
      code: "NEON_CITY",
      name: "Neo-Alexandria",
      theme: "TECH_CAREER",
      description: "A hyper-luminous cyber-metropolis governed by algorithmic discipline.",
      lore: "Glass towers pulse with holographic data streams. Here, coders and creators forge digital empires.",
      unlockLevel: 5,
      imageUrl: "/images/world/neon_city.webp"
    },
    {
      code: "ARCANE_ACADEMY",
      name: "Sanctum of Aethelgard",
      theme: "KNOWLEDGE",
      description: "A floating celestial academy of scholars, deep thinkers, and tacticians.",
      lore: "Shelves containing infinite scrolls hover in anti-gravity courtyards. Reading fuels the astral lamps.",
      unlockLevel: 10,
      imageUrl: "/images/world/academy.webp"
    },
    {
      code: "IRON_DISTRICT",
      name: "The Crucible of Titans",
      theme: "FITNESS",
      description: "A rugged industrial fortress forged for physical endurance and strength.",
      lore: "Steam vents roar as warriors push past their biological limits in heavy gravitational chambers.",
      unlockLevel: 15,
      imageUrl: "/images/world/iron_district.webp"
    },
    {
      code: "MYSTIC_FOREST",
      name: "Whispering Sylva",
      theme: "MENTAL_GROWTH",
      description: "An enchanted biome where bioluminescent flora harmonizes with inner peace.",
      lore: "Ancient spirits test your patience and emotional mastery beneath weeping violet willows.",
      unlockLevel: 20,
      imageUrl: "/images/world/forest.webp"
    },
    {
      code: "SKY_CITADEL",
      name: "Aetheria Ascendant",
      theme: "ADVANCED",
      description: "Floating islands crowned in golden rings where peak achievers congregate.",
      lore: "Only those who have conquered the deepest distractions may walk upon the cloud pavements.",
      unlockLevel: 30,
      imageUrl: "/images/world/sky_citadel.webp"
    },
    {
      code: "THE_VOID",
      name: "The Null Horizon",
      theme: "ENDGAME",
      description: "The edge of reality where pure entropy challenges long-term consistency.",
      lore: "A cosmic abyss where heroes confront the final existential shadow of inertia.",
      unlockLevel: 50,
      imageUrl: "/images/world/void.webp"
    }
  ];

  for (const reg of regions) {
    await prisma.worldRegion.upsert({
      where: { code: reg.code },
      update: reg,
      create: reg
    });
  }
  console.log(`✅ Seeded ${regions.length} World Regions.`);

  // 2. Seed Bosses
  const bosses = [
    {
      id: "boss-procrastination",
      name: "Chronos the Devourer (Procrastination)",
      description: "The time-eating shadow that whispers 'there is always tomorrow'.",
      lore: "Born from delayed intentions and unfinished drafts, Chronos drains vital momentum with its paralysis aura.",
      maxHp: 3000,
      level: 3,
      difficulty: "NORMAL",
      weaknessCategory: "DISCIPLINE",
      weaknessDesc: "Highly vulnerable to Discipline and Consistency quests completed before noon.",
      xpReward: 800,
      goldReward: 250,
      crystalsReward: 15,
      specialReward: "Chronos' Chronometer (Accessory)",
      imageUrl: "/images/bosses/procrastination.webp"
    },
    {
      id: "boss-distraction",
      name: "Sirens of the Infinite Feed (Distraction)",
      description: "A swarm of buzzing neon parasites that splinter human focus into shards.",
      lore: "Flashing iridescent notifications and algorithmic mirages lure heroes into endless scrolling stupor.",
      maxHp: 6000,
      level: 7,
      difficulty: "HARD",
      weaknessCategory: "STUDY",
      weaknessDesc: "Shattered by deep work sessions and uninterrupted study blocks.",
      xpReward: 1500,
      goldReward: 500,
      crystalsReward: 25,
      specialReward: "Aegis of Deep Focus (Helmet)",
      imageUrl: "/images/bosses/distraction.webp"
    },
    {
      id: "boss-self-doubt",
      name: "The Shadow Doppelgänger (Self-Doubt)",
      description: "A dark mirror entity reflecting your perceived failures and imposter syndrome.",
      lore: "It mimics your face and voice, murmuring that your efforts are pointless and your talents fraudulent.",
      maxHp: 9000,
      level: 12,
      difficulty: "HARD",
      weaknessCategory: "CODING",
      weaknessDesc: "Vulnerable to shipping concrete projects and solving challenging algorithmic puzzles.",
      xpReward: 2400,
      goldReward: 800,
      crystalsReward: 40,
      specialReward: "Mirror of True Valor (Aura)",
      imageUrl: "/images/bosses/self_doubt.webp"
    },
    {
      id: "boss-chaos",
      name: "Maelstrom of Entropy (Chaos)",
      description: "The disorderly storm that leaves workspaces tangled, routines broken, and desks messy.",
      lore: "Turbulent vortexes of unorganized files, missed appointments, and chaotic environments sap willpower.",
      maxHp: 12000,
      level: 18,
      difficulty: "EPIC",
      weaknessCategory: "DISCIPLINE",
      weaknessDesc: "Defeated through ritual cleaning, system organization, and daily routine adherence.",
      xpReward: 3500,
      goldReward: 1200,
      crystalsReward: 60,
      specialReward: "Order's Geometric Crest (Profile Frame)",
      imageUrl: "/images/bosses/chaos.webp"
    },
    {
      id: "boss-the-void",
      name: "Nihil the Abyssal Sloth (The Void)",
      description: "The ultimate cosmic dread of meaninglessness and chronic inaction.",
      lore: "A colossal gravitational singularity that pulls high-achieving mortals into apathy and surrender.",
      maxHp: 25000,
      level: 25,
      difficulty: "MYTHIC",
      weaknessCategory: "CAREER",
      weaknessDesc: "Devastated by high-impact real-world launches, portfolio shipping, and multi-week consistency.",
      xpReward: 8000,
      goldReward: 3000,
      crystalsReward: 150,
      specialReward: "Crown of the Awakened Sovereign (Helmet)",
      imageUrl: "/images/bosses/void.webp"
    }
  ];

  for (const b of bosses) {
    await prisma.boss.upsert({
      where: { id: b.id },
      update: b,
      create: b
    });
  }
  console.log(`✅ Seeded ${bosses.length} Boss Raids.`);

  // 3. Seed Skills across 6 branches
  const skills = [
    // COMBAT (Strength)
    {
      id: "skill-iron-will",
      branch: "COMBAT",
      name: "Iron Will",
      description: "Strengthens resistance against physical exhaustion and task abandonment.",
      tier: 1,
      requiredLevel: 1,
      requiredAttr: "STRENGTH",
      requiredAttrVal: 10,
      icon: "ShieldAlert",
      statBonus: JSON.stringify({ strength: 5, discipline: 3 })
    },
    {
      id: "skill-power-surge",
      branch: "COMBAT",
      name: "Power Surge",
      description: "Channel bursts of high-intensity physical drive into morning workouts.",
      tier: 2,
      requiredLevel: 5,
      requiredAttr: "STRENGTH",
      requiredAttrVal: 20,
      icon: "Zap",
      statBonus: JSON.stringify({ strength: 12, dexterity: 4 })
    },
    {
      id: "skill-titan-stride",
      branch: "COMBAT",
      name: "Titan Stride",
      description: "Unlocks relentless momentum during prolonged athletic exertion.",
      tier: 3,
      requiredLevel: 12,
      requiredAttr: "STRENGTH",
      requiredAttrVal: 40,
      icon: "Flame",
      statBonus: JSON.stringify({ strength: 25, discipline: 15 })
    },

    // INTELLECT (Coding & Logic)
    {
      id: "skill-focus-protocol",
      branch: "INTELLECT",
      name: "Focus Protocol",
      description: "Eliminates cognitive noise, accelerating syntax comprehension.",
      tier: 1,
      requiredLevel: 1,
      requiredAttr: "INTELLIGENCE",
      requiredAttrVal: 10,
      icon: "Cpu",
      statBonus: JSON.stringify({ intelligence: 5, discipline: 3 })
    },
    {
      id: "skill-algorithmic-clarity",
      branch: "INTELLECT",
      name: "Algorithmic Clarity",
      description: "Visualizes complex data structures effortlessly in working memory.",
      tier: 2,
      requiredLevel: 5,
      requiredAttr: "INTELLIGENCE",
      requiredAttrVal: 25,
      icon: "Terminal",
      statBonus: JSON.stringify({ intelligence: 14, wisdom: 6 })
    },
    {
      id: "skill-system-architect",
      branch: "INTELLECT",
      name: "System Architect",
      description: "Command complete understanding of distributed software architectures.",
      tier: 3,
      requiredLevel: 15,
      requiredAttr: "INTELLIGENCE",
      requiredAttrVal: 50,
      icon: "Network",
      statBonus: JSON.stringify({ intelligence: 30, discipline: 12 })
    },

    // WISDOM (Reading & Reflection)
    {
      id: "skill-mindful-observation",
      branch: "WISDOM",
      name: "Mindful Observation",
      description: "Calm the internal chatter to absorb philosophical insights deeply.",
      tier: 1,
      requiredLevel: 1,
      requiredAttr: "WISDOM",
      requiredAttrVal: 10,
      icon: "Eye",
      statBonus: JSON.stringify({ wisdom: 5, charisma: 2 })
    },
    {
      id: "skill-synaptic-retention",
      branch: "WISDOM",
      name: "Synaptic Retention",
      description: "Triples reading recall and crystallizes core mental models.",
      tier: 2,
      requiredLevel: 6,
      requiredAttr: "WISDOM",
      requiredAttrVal: 25,
      icon: "BookOpen",
      statBonus: JSON.stringify({ wisdom: 15, intelligence: 8 })
    },
    {
      id: "skill-stoic-sanctuary",
      branch: "WISDOM",
      name: "Stoic Sanctuary",
      description: "Emotional composure remains unshakeable under external pressure.",
      tier: 3,
      requiredLevel: 14,
      requiredAttr: "WISDOM",
      requiredAttrVal: 45,
      icon: "Feather",
      statBonus: JSON.stringify({ wisdom: 28, discipline: 14 })
    },

    // AGILITY (Dexterity & Speed)
    {
      id: "skill-quick-reflex",
      branch: "AGILITY",
      name: "Quick Reflex",
      description: "Swift transitions between context switches without losing baseline speed.",
      tier: 1,
      requiredLevel: 1,
      requiredAttr: "DEXTERITY",
      requiredAttrVal: 10,
      icon: "Wind",
      statBonus: JSON.stringify({ dexterity: 6, discipline: 2 })
    },
    {
      id: "skill-kinetic-flow",
      branch: "AGILITY",
      name: "Kinetic Flow",
      description: "Seamless synchronization of body and keyboard typing speed.",
      tier: 2,
      requiredLevel: 7,
      requiredAttr: "DEXTERITY",
      requiredAttrVal: 30,
      icon: "Activity",
      statBonus: JSON.stringify({ dexterity: 18, strength: 6 })
    },

    // CHARISMA (Social & Articulation)
    {
      id: "skill-resonant-voice",
      branch: "CHARISMA",
      name: "Resonant Voice",
      description: "Commands room attention during presentations and pitch meetings.",
      tier: 1,
      requiredLevel: 2,
      requiredAttr: "CHARISMA",
      requiredAttrVal: 12,
      icon: "Mic",
      statBonus: JSON.stringify({ charisma: 7, wisdom: 3 })
    },
    {
      id: "skill-magnetic-rapport",
      branch: "CHARISMA",
      name: "Magnetic Rapport",
      description: "Instantly aligns cross-functional team members toward a shared vision.",
      tier: 2,
      requiredLevel: 8,
      requiredAttr: "CHARISMA",
      requiredAttrVal: 28,
      icon: "Users",
      statBonus: JSON.stringify({ charisma: 16, intelligence: 6 })
    },

    // DISCIPLINE (Habits & Consistency)
    {
      id: "skill-habit-lock",
      branch: "DISCIPLINE",
      name: "Habit Lock",
      description: "Locks daily recurring routines into automatic subconscious execution.",
      tier: 1,
      requiredLevel: 1,
      requiredAttr: "DISCIPLINE",
      requiredAttrVal: 10,
      icon: "Clock",
      statBonus: JSON.stringify({ discipline: 8, strength: 2 })
    },
    {
      id: "skill-unbroken-streak",
      branch: "DISCIPLINE",
      name: "Unbroken Chain",
      description: "Reduces streak degradation risk and boosts streak XP multipliers.",
      tier: 2,
      requiredLevel: 5,
      requiredAttr: "DISCIPLINE",
      requiredAttrVal: 25,
      icon: "Link",
      statBonus: JSON.stringify({ discipline: 16, wisdom: 6 })
    },
    {
      id: "skill-sovereign-will",
      branch: "DISCIPLINE",
      name: "Sovereign Will",
      description: "Total mastery over procrastination and comfort seeking.",
      tier: 3,
      requiredLevel: 15,
      requiredAttr: "DISCIPLINE",
      requiredAttrVal: 50,
      icon: "Crown",
      statBonus: JSON.stringify({ discipline: 35, strength: 10, intelligence: 10 })
    }
  ];

  for (const s of skills) {
    await prisma.skill.upsert({
      where: { id: s.id },
      update: s,
      create: s
    });
  }
  console.log(`✅ Seeded ${skills.length} Skill Tree nodes.`);

  // 4. Seed Shop Items (30+ items)
  const items = [
    // Weapons
    {
      id: "item-neon-katana",
      name: "Neon Katana",
      category: "WEAPON",
      rarity: "EPIC",
      price: 350,
      currency: "GOLD",
      description: "A precision laser blade forged in Neo-Alexandria. Slices through bugs and sluggish thinking.",
      icon: "Sword",
      statBonus: JSON.stringify({ intelligence: 8, discipline: 5 }),
      isEquippable: true
    },
    {
      id: "item-void-cleaver",
      name: "Void Cleaver",
      category: "WEAPON",
      rarity: "LEGENDARY",
      price: 850,
      currency: "GOLD",
      description: "Infused with raw null-matter to deal double damage to entropy bosses.",
      icon: "Axe",
      statBonus: JSON.stringify({ strength: 16, discipline: 10 }),
      isEquippable: true
    },
    {
      id: "item-cyber-deck",
      name: "Cyberdeck Mk.VII",
      category: "WEAPON",
      rarity: "RARE",
      price: 220,
      currency: "GOLD",
      description: "Portable terminal allowing instantaneous neural terminal compilation.",
      icon: "Laptop",
      statBonus: JSON.stringify({ intelligence: 7, dexterity: 3 }),
      isEquippable: true
    },
    {
      id: "item-astral-staff",
      name: "Astral Scribe Staff",
      category: "WEAPON",
      rarity: "RARE",
      price: 200,
      currency: "GOLD",
      description: "Tipped with glowing starlight quartz that illuminates esoteric concepts.",
      icon: "Wand2",
      statBonus: JSON.stringify({ wisdom: 8, charisma: 4 }),
      isEquippable: true
    },
    {
      id: "item-chronos-blade",
      name: "Chronos Temporal Edge",
      category: "WEAPON",
      rarity: "MYTHIC",
      price: 80,
      currency: "CRYSTAL",
      description: "Rewrites time itself, allowing users to warp past mental friction.",
      icon: "Sparkles",
      statBonus: JSON.stringify({ strength: 20, intelligence: 20, discipline: 20 }),
      isEquippable: true
    },

    // Armors
    {
      id: "item-nanoweave-coat",
      name: "Nanoweave Trench Coat",
      category: "ARMOR",
      rarity: "RARE",
      price: 180,
      currency: "GOLD",
      description: "Sleek obsidian coat lined with cyan luminescent heat-dispersion circuits.",
      icon: "Shield",
      statBonus: JSON.stringify({ dexterity: 6, charisma: 6 }),
      isEquippable: true
    },
    {
      id: "item-aegis-cuirass",
      name: "Titan Aegis Cuirass",
      category: "ARMOR",
      rarity: "EPIC",
      price: 400,
      currency: "GOLD",
      description: "High-density poly-alloy forged in gravity pits. Repels cognitive fatigue.",
      icon: "ShieldCheck",
      statBonus: JSON.stringify({ strength: 12, discipline: 8 }),
      isEquippable: true
    },
    {
      id: "item-sorcerer-vestment",
      name: "Vestments of the Scholar",
      category: "ARMOR",
      rarity: "UNCOMMON",
      price: 120,
      currency: "GOLD",
      description: "Woven from silk blessed under lunar eclipses.",
      icon: "Shirt",
      statBonus: JSON.stringify({ wisdom: 5, intelligence: 3 }),
      isEquippable: true
    },
    {
      id: "item-void-exosuit",
      name: "Null-Exoskeleton",
      category: "ARMOR",
      rarity: "LEGENDARY",
      price: 900,
      currency: "GOLD",
      description: "Armor designed to survive the vacuum outside productive space.",
      icon: "ShieldAlert",
      statBonus: JSON.stringify({ discipline: 18, strength: 10 }),
      isEquippable: true
    },

    // Helmets
    {
      id: "item-neural-visor",
      name: "Neural HUD Visor",
      category: "HELMET",
      rarity: "UNCOMMON",
      price: 90,
      currency: "GOLD",
      description: "Holographic monocle highlighting daily priorities in glowing cyan font.",
      icon: "Glasses",
      statBonus: JSON.stringify({ intelligence: 4, discipline: 2 }),
      isEquippable: true
    },
    {
      id: "item-circlet-wisdom",
      name: "Circlet of the Serene Mind",
      category: "HELMET",
      rarity: "RARE",
      price: 240,
      currency: "GOLD",
      description: "Silver filigree with an amethyst stone that cools racing thoughts.",
      icon: "Crown",
      statBonus: JSON.stringify({ wisdom: 9, charisma: 3 }),
      isEquippable: true
    },
    {
      id: "item-cyber-helm",
      name: "Onyx Oni Mask",
      category: "HELMET",
      rarity: "EPIC",
      price: 450,
      currency: "GOLD",
      description: "A fearsome demonic cyberpunk battle mask that terrifies inner procrastination.",
      icon: "Smile",
      statBonus: JSON.stringify({ strength: 8, charisma: 8 }),
      isEquippable: true
    },

    // Gloves & Boots
    {
      id: "item-haptic-gloves",
      name: "Haptic Grip Gloves",
      category: "GLOVES",
      rarity: "COMMON",
      price: 60,
      currency: "GOLD",
      description: "Tactile feedback gloves for high-speed terminal typing.",
      icon: "Hand",
      statBonus: JSON.stringify({ dexterity: 3, intelligence: 2 }),
      isEquippable: true
    },
    {
      id: "item-kinetic-boots",
      name: "Vortex Stride Boots",
      category: "BOOTS",
      rarity: "RARE",
      price: 210,
      currency: "GOLD",
      description: "Lightweight mag-lev boots that make 10,000 daily steps feel weightless.",
      icon: "Footprints",
      statBonus: JSON.stringify({ dexterity: 8, strength: 4 }),
      isEquippable: true
    },

    // Auras & Cosmetics
    {
      id: "item-aura-cyan-circuit",
      name: "Cyan Circuit Aura",
      category: "AURA",
      rarity: "RARE",
      price: 300,
      currency: "GOLD",
      description: "Glowing digital rune rings continuously orbit your character silhouette.",
      icon: "CircleDot",
      statBonus: JSON.stringify({ intelligence: 5, charisma: 5 }),
      isEquippable: true
    },
    {
      id: "item-aura-violet-starlight",
      name: "Violet Starlight Aura",
      category: "AURA",
      rarity: "EPIC",
      price: 500,
      currency: "GOLD",
      description: "A cascade of cosmic amethyst embers floats upward from your steps.",
      icon: "Sparkle",
      statBonus: JSON.stringify({ wisdom: 7, charisma: 6 }),
      isEquippable: true
    },
    {
      id: "item-aura-infernal-flame",
      name: "Infernal Focus Flame",
      category: "AURA",
      rarity: "LEGENDARY",
      price: 50,
      currency: "CRYSTAL",
      description: "A fierce golden-amber aura radiating relentless determination.",
      icon: "Flame",
      statBonus: JSON.stringify({ discipline: 12, strength: 10 }),
      isEquippable: true
    },

    // Profile Frames & Backgrounds
    {
      id: "item-frame-neon-grid",
      name: "Neon Horizon Frame",
      category: "FRAME",
      rarity: "UNCOMMON",
      price: 150,
      currency: "GOLD",
      description: "A sleek geometric border pulsing with electric cyan and magenta lines.",
      icon: "Square",
      statBonus: JSON.stringify({ charisma: 4 }),
      isEquippable: true
    },
    {
      id: "item-frame-astral-gold",
      name: "Sovereign Gold Frame",
      category: "FRAME",
      rarity: "LEGENDARY",
      price: 45,
      currency: "CRYSTAL",
      description: "Gilded celestial filigree encrusted with starlight diamonds.",
      icon: "Gem",
      statBonus: JSON.stringify({ charisma: 12 }),
      isEquippable: true
    },
    {
      id: "item-bg-cyber-rooftop",
      name: "Neo-Alexandria Skyline",
      category: "BACKGROUND",
      rarity: "RARE",
      price: 250,
      currency: "GOLD",
      description: "Dusk skyline overlooking flying vehicles and glowing holographic towers.",
      icon: "Image",
      statBonus: JSON.stringify({ intelligence: 3, charisma: 4 }),
      isEquippable: true
    },
    {
      id: "item-bg-zen-garden",
      name: "Celestial Cherry Blossom",
      category: "BACKGROUND",
      rarity: "RARE",
      price: 250,
      currency: "GOLD",
      description: "Gentle pink petals drift across floating mossy stones under two moons.",
      icon: "Flower",
      statBonus: JSON.stringify({ wisdom: 5, charisma: 2 }),
      isEquippable: true
    },

    // Consumables
    {
      id: "item-elixir-focus",
      name: "Elixir of Laser Focus",
      category: "CONSUMABLE",
      rarity: "COMMON",
      price: 40,
      currency: "GOLD",
      description: "Restores mental freshness. Grants a 20% XP boost on your next completed quest.",
      icon: "Coffee",
      statBonus: JSON.stringify({ discipline: 2 }),
      isEquippable: false
    },
    {
      id: "item-potion-xp-surge",
      name: "Hyper-XP Catalyst",
      category: "CONSUMABLE",
      rarity: "RARE",
      price: 15,
      currency: "CRYSTAL",
      description: "Instantly awards 250 XP toward your next character level.",
      icon: "FlaskConical",
      statBonus: JSON.stringify({}),
      isEquippable: false
    }
  ];

  for (const it of items) {
    await prisma.item.upsert({
      where: { id: it.id },
      update: it,
      create: it
    });
  }
  console.log(`✅ Seeded ${items.length} Shop items.`);

  // 5. Seed Achievements (20+ badges)
  const achievements = [
    {
      code: "FIRST_BLOOD",
      name: "First Step into the Rift",
      category: "PROGRESS",
      description: "Complete your very first real-life quest.",
      criteriaType: "QUEST_COUNT",
      criteriaValue: 1,
      crystalsReward: 5,
      xpReward: 100,
      icon: "Flag"
    },
    {
      code: "TEN_QUESTS",
      name: "Novice Vanguard",
      category: "PROGRESS",
      description: "Complete 10 total quests.",
      criteriaType: "QUEST_COUNT",
      criteriaValue: 10,
      crystalsReward: 10,
      xpReward: 250,
      icon: "CheckCircle2"
    },
    {
      code: "FIFTY_QUESTS",
      name: "Seasoned Pathfinder",
      category: "PROGRESS",
      description: "Complete 50 total quests.",
      criteriaType: "QUEST_COUNT",
      criteriaValue: 50,
      crystalsReward: 25,
      xpReward: 750,
      icon: "Award"
    },
    {
      code: "CENTURY_MASTER",
      name: "The Century Club",
      category: "PROGRESS",
      description: "Conquer 100 real-world quests.",
      criteriaType: "QUEST_COUNT",
      criteriaValue: 100,
      crystalsReward: 50,
      xpReward: 2000,
      icon: "Trophy"
    },

    // Consistency / Streaks
    {
      code: "STREAK_3",
      name: "Spark of Habit",
      category: "CONSISTENCY",
      description: "Maintain a 3-day active streak.",
      criteriaType: "STREAK_DAYS",
      criteriaValue: 3,
      crystalsReward: 5,
      xpReward: 120,
      icon: "Flame"
    },
    {
      code: "STREAK_7",
      name: "Warrior of Seven",
      category: "CONSISTENCY",
      description: "Hold an unbroken 7-day streak.",
      criteriaType: "STREAK_DAYS",
      criteriaValue: 7,
      crystalsReward: 15,
      xpReward: 350,
      icon: "Sparkles"
    },
    {
      code: "STREAK_14",
      name: "Fortnight of Iron",
      category: "CONSISTENCY",
      description: "Reach an uninterrupted 14-day streak.",
      criteriaType: "STREAK_DAYS",
      criteriaValue: 14,
      crystalsReward: 30,
      xpReward: 800,
      icon: "Shield"
    },
    {
      code: "STREAK_30",
      name: "Unstoppable Force",
      category: "CONSISTENCY",
      description: "Transcend human excuses with a 30-day streak.",
      criteriaType: "STREAK_DAYS",
      criteriaValue: 30,
      crystalsReward: 75,
      xpReward: 2500,
      icon: "Crown"
    },

    // Level progression
    {
      code: "LEVEL_5",
      name: "Awakened Potential",
      category: "PROGRESS",
      description: "Reach Character Level 5.",
      criteriaType: "LEVEL_REACHED",
      criteriaValue: 5,
      crystalsReward: 10,
      xpReward: 300,
      icon: "ChevronsUp"
    },
    {
      code: "LEVEL_10",
      name: "Specialist Ascendant",
      category: "PROGRESS",
      description: "Reach Character Level 10.",
      criteriaType: "LEVEL_REACHED",
      criteriaValue: 10,
      crystalsReward: 20,
      xpReward: 800,
      icon: "Star"
    },
    {
      code: "LEVEL_20",
      name: "Elite Sovereign",
      category: "PROGRESS",
      description: "Reach Character Level 20.",
      criteriaType: "LEVEL_REACHED",
      criteriaValue: 20,
      crystalsReward: 40,
      xpReward: 1800,
      icon: "Sparkle"
    },

    // Boss Killers
    {
      code: "BOSS_FIRST",
      name: "Slayer of Inertia",
      category: "BOSSES",
      description: "Defeat your first obstacle boss raid.",
      criteriaType: "BOSS_DEFEATED",
      criteriaValue: 1,
      crystalsReward: 20,
      xpReward: 500,
      icon: "Skull"
    },
    {
      code: "BOSS_THREE",
      name: "Vanquisher of Inner Demons",
      category: "BOSSES",
      description: "Defeat 3 different obstacle bosses.",
      criteriaType: "BOSS_DEFEATED",
      criteriaValue: 3,
      crystalsReward: 50,
      xpReward: 1500,
      icon: "Crosshair"
    },

    // Economy
    {
      code: "GOLD_500",
      name: "Merchant of Resolve",
      category: "ECONOMY",
      description: "Accumulate 500 total Gold in your pouch.",
      criteriaType: "GOLD_EARNED",
      criteriaValue: 500,
      crystalsReward: 15,
      xpReward: 250,
      icon: "Coins"
    },
    {
      code: "GOLD_2000",
      name: "Tycoon of Discipline",
      category: "ECONOMY",
      description: "Accumulate 2,000 total Gold.",
      criteriaType: "GOLD_EARNED",
      criteriaValue: 2000,
      crystalsReward: 40,
      xpReward: 1000,
      icon: "Gem"
    }
  ];

  for (const ach of achievements) {
    await prisma.achievement.upsert({
      where: { code: ach.code },
      update: ach,
      create: ach
    });
  }
  console.log(`✅ Seeded ${achievements.length} Achievements.`);

  console.log("✨ Master database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
