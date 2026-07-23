// ============================================
// FORGE-DATA.JS — Forge progression constants
// ============================================

const FORGE_SKILL_LEVELS = [
    { id: 'apprentice', name: 'Apprentice Smith', affixBonus: 0,  monthsReductionPct: 0,  durabilityBonus: 0,  xpRequired: 0,  recipeUnlocks: [1] },
    { id: 'journeyman', name: 'Journeyman',       affixBonus: 8,  monthsReductionPct: 5,  durabilityBonus: 5,  xpRequired: 8,  recipeUnlocks: [2] },
    { id: 'artisan',    name: 'Artisan',          affixBonus: 15, monthsReductionPct: 10, durabilityBonus: 10, xpRequired: 25, recipeUnlocks: [3] },
    { id: 'master',     name: 'Master Smith',     affixBonus: 25, monthsReductionPct: 15, durabilityBonus: 15, xpRequired: 60, recipeUnlocks: [4] }
];

// Gear tier → minimum cultivation realm index (0-based). Same index on qi, body, and soul paths.
// Tier 1 = first realm (Qi Condensation / Bronze Skin / Awakened Spirit), etc.
// Body- and soul-specific gear lines are TBD; tier gates use the shared realm ladder for now.
const FORGE_TIER_REALM_INDEX = { 1: 0, 2: 1, 3: 2, 4: 3 };

const FORGE_ANVILS = [
    { id: 'iron',      name: 'Iron Anvil',      emoji: '⚫', affixBonus: 0,  monthsReductionPct: 0,  forgesRequired: 0 },
    { id: 'steel',     name: 'Steel Anvil',     emoji: '⚙️', affixBonus: 5,  monthsReductionPct: 3,  forgesRequired: 5 },
    { id: 'spirit',    name: 'Spirit Anvil',    emoji: '💠', affixBonus: 10, monthsReductionPct: 6,  forgesRequired: 15 },
    { id: 'celestial', name: 'Celestial Anvil', emoji: '✨', affixBonus: 18, monthsReductionPct: 10, forgesRequired: 40 }
];

const FORGE_BALANCE = {
    skillXpPerForge: 2,
    skillXpPerSuccess: 2,
    legendaryBaseSuccess: 70,
    legendarySkillBonus: 5
};
