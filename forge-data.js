// ============================================
// FORGE-DATA.JS — Forge progression constants
// ============================================

const FORGE_SKILL_LEVELS = [
    { id: 'apprentice', name: 'Apprentice Smith', affixBonus: 0,  monthsReductionPct: 0,  durabilityBonus: 0,  xpRequired: 0 },
    { id: 'journeyman', name: 'Journeyman',       affixBonus: 8,  monthsReductionPct: 5,  durabilityBonus: 5,  xpRequired: 8 },
    { id: 'artisan',    name: 'Artisan',          affixBonus: 15, monthsReductionPct: 10, durabilityBonus: 10, xpRequired: 25 },
    { id: 'master',     name: 'Master Smith',     affixBonus: 25, monthsReductionPct: 15, durabilityBonus: 15, xpRequired: 60 }
];

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
