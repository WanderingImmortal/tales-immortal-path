// ============================================
// ALCHEMY-DATA.JS — Alchemy system constants
// ============================================

const ALCHEMY_PILL_TIERS = {
    mortal:       { id: 'mortal',       name: 'Mortal',       baseSuccess: 80, color: '#8a9a7a', emoji: '🟢' },
    earth:        { id: 'earth',        name: 'Earth',        baseSuccess: 60, color: '#a08050', emoji: '🟤' },
    heaven:       { id: 'heaven',       name: 'Heaven',       baseSuccess: 40, color: '#6090c0', emoji: '🔵' },
    dao:          { id: 'dao',          name: 'Dao',          baseSuccess: 20, color: '#9060c0', emoji: '🟣' },
    transcendent: { id: 'transcendent', name: 'Transcendent', baseSuccess: 10, color: '#d4a840', emoji: '🟡' }
};

const ALCHEMY_SKILL_LEVELS = [
    { id: 'apprentice',    name: 'Apprentice',    successBonus: 0,  xpRequired: 0,   recipeUnlocks: ['mortal'] },
    { id: 'disciple',      name: 'Disciple',      successBonus: 5,  xpRequired: 15,  recipeUnlocks: ['earth'] },
    { id: 'master',        name: 'Master',        successBonus: 12, xpRequired: 50,  recipeUnlocks: ['heaven'] },
    { id: 'grandmaster',   name: 'Grandmaster',   successBonus: 20, xpRequired: 120, recipeUnlocks: ['dao'] },
    { id: 'transcendent',  name: 'Transcendent',  successBonus: 30, xpRequired: 250, recipeUnlocks: ['transcendent'] }
];

const ALCHEMY_TALENTS = {
    awakened_cauldron: {
        id: 'awakened_cauldron',
        name: 'Awakened Cauldron',
        emoji: '⚗️',
        desc: 'Innate affinity with the crucible.',
        successBonus: 5,
        default: true,
        source: 'innate'
    },
    herb_sage: {
        id: 'herb_sage',
        name: 'Herb Sage',
        emoji: '🌿',
        desc: '+15% herb yield from exploration.',
        herbYieldBonus: 15,
        source: 'exploration'
    },
    flame_heart: {
        id: 'flame_heart',
        name: 'Flame Heart',
        emoji: '🔥',
        desc: '+10% success on fire-element pills.',
        firePillBonus: 10,
        source: 'quest'
    },
    tranquil_mind: {
        id: 'tranquil_mind',
        name: 'Tranquil Mind',
        emoji: '🧘',
        desc: 'Failure backlash reduced by 25%.',
        backlashReduction: 25,
        source: 'forbidden'
    },
    pill_sense: {
        id: 'pill_sense',
        name: 'Pill Sense',
        emoji: '👁️',
        desc: '+8% success rate on all pills.',
        successBonus: 8,
        source: 'forbidden'
    }
};

const ALCHEMY_PHYSIQUES = {
    phoenix_blood: {
        id: 'phoenix_blood',
        name: 'Phoenix Blood Physique',
        emoji: '🦅',
        desc: '+20% fire pill success. −10% HP and defense.',
        firePillBonus: 20,
        hpPenaltyPct: 10,
        defensePenaltyPct: 10
    },
    jade_marrow: {
        id: 'jade_marrow',
        name: 'Jade Marrow Physique',
        emoji: '💎',
        desc: '+15% earth pill success. −5% damage.',
        earthPillBonus: 15,
        dmgPenaltyPct: 5
    },
    void_essence: {
        id: 'void_essence',
        name: 'Void Essence Physique',
        emoji: '🌑',
        desc: '+15% dao pill success. −8% qi capacity.',
        daoPillBonus: 15,
        qiPenaltyPct: 8
    }
};

const ALCHEMY_CAULDRONS = [
    { id: 'iron',     name: 'Iron Cauldron',     emoji: '⚫', successBonus: 0,  potencyBonus: 0,  craftsRequired: 0 },
    { id: 'bronze',   name: 'Bronze Cauldron',   emoji: '🟤', successBonus: 3,  potencyBonus: 5,  craftsRequired: 10 },
    { id: 'silver',   name: 'Silver Cauldron',   emoji: '⚪', successBonus: 6,  potencyBonus: 10, craftsRequired: 30 },
    { id: 'gold',     name: 'Gold Cauldron',     emoji: '🟡', successBonus: 10, potencyBonus: 15, craftsRequired: 60 },
    { id: 'jade',     name: 'Jade Cauldron',     emoji: '💚', successBonus: 14, potencyBonus: 22, craftsRequired: 100 },
    { id: 'heavenly', name: 'Heavenly Cauldron', emoji: '✨', successBonus: 20, potencyBonus: 35, craftsRequired: 180 }
];

const ALCHEMY_FLAMES = [
    { id: 'mortal_flame',  name: 'Mortal Flame',  emoji: '🕯️', successBonus: 0,  default: true,
      bonuses: { neutral: 0 } },
    { id: 'fire_spirit',   name: 'Fire Spirit Flame', emoji: '🔥', successBonus: 3,
      bonuses: { fire: 10, neutral: 2 } },
    { id: 'frost_flame',   name: 'Frost Flame',   emoji: '❄️', successBonus: 3,
      bonuses: { water: 10, ice: 10 } },
    { id: 'void_flame',    name: 'Void Flame',    emoji: '🌑', successBonus: 5,
      bonuses: { dao: 12, void: 8 } },
    { id: 'heavenly_flame', name: 'Heavenly Flame', emoji: '☀️', successBonus: 8,
      bonuses: { heaven: 15, neutral: 5 } },
    { id: 'demonic_flame', name: 'Demonic Flame', emoji: '👹', successBonus: 6,
      bonuses: { demonic: 15, fire: 8 }, backlashMult: 1.3 }
];

const ALCHEMY_REPUTATION_LEVELS = [
    { id: 'unknown',   name: 'Unknown',   xpRequired: 0,   priceMult: 1.0,  sellMult: 0.8 },
    { id: 'local',     name: 'Local',     xpRequired: 20,  priceMult: 1.1,  sellMult: 0.9 },
    { id: 'respected', name: 'Respected', xpRequired: 60,  priceMult: 1.25, sellMult: 1.0 },
    { id: 'master',    name: 'Master',    xpRequired: 140, priceMult: 1.45, sellMult: 1.15 },
    { id: 'legendary', name: 'Legendary', xpRequired: 300, priceMult: 1.7,  sellMult: 1.3 }
];

// Alchemy-specific materials (extends CRAFT_MATERIALS)
const ALCHEMY_MATERIALS = {
    spirit_dew:    { id: 'spirit_dew',    name: 'Spirit Dew',    tier: 'common',   emoji: '💧' },
    earth_marrow:  { id: 'earth_marrow',  name: 'Earth Marrow',  tier: 'uncommon', emoji: '🪨' },
    blood_crystal: { id: 'blood_crystal', name: 'Blood Crystal', tier: 'uncommon', emoji: '🔴' },
    soul_mist:     { id: 'soul_mist',     name: 'Soul Mist',     tier: 'uncommon', emoji: '💨' },
    foundation_root: { id: 'foundation_root', name: 'Foundation Root', tier: 'rare', emoji: '🌱' }
};

const ALCHEMY_RECIPES = {
    // —— Mortal Tier ——
    mortal_spirit_gathering: {
        id: 'mortal_spirit_gathering',
        pillId: 'spirit_gathering',
        tier: 'mortal',
        name: 'Spirit Gathering Pill',
        emoji: '💊',
        element: 'neutral',
        ingredients: { spirit_herb: 2, spirit_dew: 1 },
        months: 1,
        minSkill: 'apprentice',
        unlockByDefault: true,
        marketValue: 12,
        desc: 'Channels ambient qi into the dantian.'
    },
    mortal_blood_recovery: {
        id: 'mortal_blood_recovery',
        pillId: 'blood_recovery',
        tier: 'mortal',
        name: 'Blood Recovery Pill',
        emoji: '❤️',
        element: 'fire',
        ingredients: { spirit_herb: 1, blood_crystal: 1 },
        months: 1,
        minSkill: 'apprentice',
        unlockByDefault: true,
        marketValue: 15,
        desc: 'Restores flesh and vitality.'
    },
    mortal_soul_nourishing: {
        id: 'mortal_soul_nourishing',
        pillId: 'soul_nourishing',
        tier: 'mortal',
        name: 'Soul Nourishing Pill',
        emoji: '🧠',
        element: 'neutral',
        ingredients: { spirit_herb: 2, soul_mist: 1 },
        months: 1,
        minSkill: 'apprentice',
        unlockByDefault: true,
        marketValue: 14,
        desc: 'Nourishes spirit and soul barrier.'
    },
    // —— Earth Tier ——
    earth_meridian_soothing: {
        id: 'earth_meridian_soothing',
        pillId: 'meridian_soothing',
        tier: 'earth',
        name: 'Meridian Soothing Pill',
        emoji: '☯️',
        element: 'earth',
        ingredients: { spirit_herb: 3, earth_marrow: 2, rare_herb: 1 },
        months: 2,
        minSkill: 'disciple',
        unlockByDefault: false,
        marketValue: 35,
        desc: 'Unblocks meridians and strengthens foundation.'
    },
    earth_foundation_stabilizing: {
        id: 'earth_foundation_stabilizing',
        pillId: 'foundation_stabilizing',
        tier: 'earth',
        name: 'Foundation Stabilizing Pill',
        emoji: '🏛️',
        element: 'earth',
        ingredients: { earth_marrow: 2, foundation_root: 1, rare_herb: 2 },
        months: 3,
        minSkill: 'disciple',
        unlockByDefault: false,
        marketValue: 50,
        desc: 'Stabilizes cultivation base before breakthroughs.'
    },
    earth_qi_infusion: {
        id: 'earth_qi_infusion',
        pillId: 'spirit_gathering',
        tier: 'earth',
        name: 'Qi Infusion Pill',
        emoji: '💠',
        element: 'neutral',
        ingredients: { spirit_herb: 4, spirit_dew: 2, earth_marrow: 1, jade_inlay: 1 },
        months: 2,
        minSkill: 'disciple',
        unlockByDefault: false,
        marketValue: 40,
        potencyMult: 1.5,
        desc: 'A refined spirit gathering pill with greater potency.'
    }
};

const ALCHEMY_BALANCE = {
    maxSuccessRate: 95,
    minSuccessRate: 3,
    skillXpPerCraft: 1,
    skillXpPerSuccess: 2,
    reputationXpPerSuccess: 1,
    reputationXpPerSell: 1,
    supplyDecayPerMonth: 0.02,
    supplyPriceFactor: 0.15,
    failureBacklashHpPct: { mortal: 0.05, earth: 0.08, heaven: 0.12, dao: 0.18, transcendent: 0.25 },
    partialRecoveryChance: 0.15,
    cauldronExplosionChance: 0.03
};
