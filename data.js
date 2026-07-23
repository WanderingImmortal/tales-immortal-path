// ============================================
// DATA.JS — All static game data
// ============================================

const PATHS = {
    qi: {
        name: "Qi Cultivation",
        realms: ["Qi Condensation", "Foundation Establishment", "Core Formation", "Nascent Soul", "Void Refinement", "Dao Seeking", "Immortal Ascension"],
        titles: ["Mortal Aspirant", "Earthbound Immortal", "Golden Core Disciple", "Soul Sovereign", "Void Walker", "Dao Seeker", "Transcendent One"],
        capstone: {
            button: "🏛️ Seal Dantian",
            settledAction: "Seal Dantian",
            peakAction: "Condense to Peak",
            meterLabel: "Dantian Progress",
            settledFlavor: "Qi settles into a workable seal — respectable, but not peak.",
            peakFlavor: "Dantian sealed at peak density — the realm holds firm."
        },
        base: { qi: 12, vitality: 4, spirit: 5, will: 3, hp: 70 },
        visions: [
            "You see a river of stars flowing through your meridians...",
            "The cosmos unfolds before you. You are but a speck, yet you contain infinite potential...",
            "Your dantian pulses with energy. The heavens themselves seem to lean in...",
            "A golden light fills your vision. You feel the weight of a thousand years...",
            "The fabric of reality grows thin. You see the threads of fate...",
            "The Dao whispers its secrets. You are so close to understanding...",
            "The gates of heaven open. You stand at the threshold of immortality..."
        ]
    },
    body: {
        name: "Body Cultivation",
        realms: ["Bronze Skin", "Iron Bones", "Jade Marrow", "Diamond Body", "Sage Flesh", "War God Physique", "Indestructible Vajra"],
        titles: ["Flesh Tempered", "Bone Forged", "Marrow Refined", "Diamond Shell", "Sage Vessel", "War God Incarnate", "Vajra Immortal"],
        capstone: {
            button: "🔥 Temper the Vessel",
            settledAction: "Temper the Vessel",
            peakAction: "Forge to Peak",
            meterLabel: "Vessel Progress",
            settledFlavor: "The flesh holds — tempered enough to advance, if not perfected.",
            peakFlavor: "The vessel is forged to peak — bone and sinew sing in unison."
        },
        base: { qi: 4, vitality: 12, spirit: 2, will: 4, hp: 140 },
        visions: [
            "Your bones crack and reform, each fracture forging them stronger...",
            "Blood boils in your veins. Every cell screams, then sings, then transforms...",
            "You feel each muscle fiber tear and reknit. Pain is the path...",
            "Your skin hardens to iron, then jade, then diamond...",
            "Flesh and bone become one. You are no longer human...",
            "The very air bends around your form. You are a force of nature...",
            "Your body becomes indestructible. The heavens themselves cannot break you..."
        ]
    },
    soul: {
        name: "Soul Cultivation",
        realms: ["Awakened Spirit", "Manifestation", "Spirit Confluence", "Soul Integration", "Transcendence", "Dao Heart", "Eternal Spirit"],
        titles: ["Spirit Awakened", "Soul Manifest", "Confluent Spirit", "Soul Integrator", "Transcendent Soul", "Heart of Dao", "Eternal Sage"],
        capstone: {
            button: "✨ Anchor the Soul",
            settledAction: "Anchor the Soul",
            peakAction: "Integrate to Peak",
            meterLabel: "Soul Progress",
            settledFlavor: "The soul is anchored — stable enough to step forward.",
            peakFlavor: "Soul and realm integrated at peak — nothing leaks between worlds."
        },
        base: { qi: 5, vitality: 5, spirit: 10, will: 8, hp: 80 },
        visions: [
            "Your consciousness expands beyond your flesh. You see the threads of fate...",
            "The world grows dim as your inner light blazes...",
            "You touch the minds of those around you. Their thoughts are as clear as your own...",
            "Your soul shatters and reforms, each piece more brilliant than the last...",
            "You see past, present, and future as one. Time loses meaning...",
            "The Dao calls to you. You answer not with your voice, but with your very being...",
            "You become one with the eternal. Immortality is not a gift — it is a choice..."
        ]
    }
};

/** Spirit track — same realm table as legacy soul path; UI label is "Spirit track", not a class. */
const SPIRIT_TRACK = PATHS.soul;

const TRAITS = [
    {
        id: 'heavenly_luck',
        name: "Heavenly Luck",
        emoji: '🍀',
        flavor: 'Fortune follows you like a faithful spirit — but heaven still demands its price.',
        upside: '+15% breakthrough · +10% perfect breakthrough odds',
        downside: '−10% tribulation resistance',
        desc: 'Fortune smiles on breakthroughs; tribulations find you less prepared.',
        bonus: {
            breakthroughPct: 15,
            perfectBreakPct: 10,
            tribulationResistPct: -10
        }
    },
    {
        id: 'ancient_bloodline',
        name: "Ancient Bloodline",
        emoji: '🩸',
        flavor: 'Ancestral qi stirs in your veins — old power, old pride, old blind spots.',
        upside: '+10% path combat resource (Breath / Stamina / Focus)',
        downside: '−10% Dao comprehension speed',
        desc: 'Your lineage empowers combat resources but dulls Dao insight.',
        bonus: {
            primaryResourcePct: 10,
            daoSpeedPct: -10
        }
    },
    {
        id: 'crippled_meridians',
        name: "Crippled Meridians",
        emoji: '🩹',
        flavor: 'Broken channels force ruthless efficiency — every drop of qi must count.',
        upside: '+20% Qi efficiency · +10% breakthrough chance',
        downside: '−20% Qi capacity · +10% tribulation severity',
        desc: 'You cultivate lean and break through hungry — the heavens test you harder.',
        bonus: {
            qiEfficiencyPct: 20,
            breakthroughPct: 10,
            maxQiPct: -20,
            tribulationSeverityPct: 10
        }
    },
    {
        id: 'lightning_attractor',
        name: "Lightning Attractor",
        emoji: '⚡',
        flavor: 'Thunder recognizes something in you — and never looks away.',
        upside: '+30% tribulation rewards · +10% lightning resistance',
        downside: 'Tribulations 30% more likely (earlier / harsher)',
        desc: 'Heavenly trials enrich you — if you survive their attention.',
        bonus: {
            tribulationRewardPct: 30,
            lightningResist: 10,
            tribulationLikelihoodPct: 30
        }
    },
    {
        id: 'immortals_disciple',
        name: "Immortal's Disciple",
        emoji: '📜',
        flavor: 'A master\'s legacy sleeps in your muscle memory before your first true lesson.',
        upside: 'Start with a random path technique at Adept mastery',
        downside: '−10% Fame gain',
        desc: 'You begin with forbidden knowledge — and a reputation still unearned.',
        bonus: {
            startAdeptTechnique: true,
            fameGainPct: -10
        }
    },
    {
        id: 'wandering_sage',
        name: "Wandering Sage",
        emoji: '🌿',
        flavor: 'The road is your scripture; every face a potential ally.',
        upside: '+20% exploration rewards · +10% NPC friendliness',
        downside: '−10% cultivation speed',
        desc: 'You thrive in the wilds and win hearts — but secluded cultivation suffers.',
        bonus: {
            exploreRewardPct: 20,
            npcFriendlinessPct: 10,
            cultivateSpeedPct: -10
        }
    },
    {
        id: 'cursed_scholar',
        name: "Cursed Scholar",
        emoji: '📖',
        flavor: 'Forbidden texts whisper in your dreams — insight at the cost of density.',
        upside: '+20% Dao comprehension speed · +10% technique effectiveness',
        downside: '−10% Qi Density · +10% tribulation severity',
        desc: 'You grasp the Dao swiftly — your dantian pays the toll.',
        bonus: {
            daoSpeedPct: 20,
            techniqueDmgPct: 10,
            qiDensityPct: -10,
            tribulationSeverityPct: 10
        }
    },
    {
        id: 'forgotten_heir',
        name: "Forgotten Heir",
        emoji: '👑',
        flavor: 'A fallen lineage left only echoes — and a debt the jianghu still remembers.',
        upside: 'Unlocks the Echoes of a Fallen Lineage quest chain',
        downside: '−10% starting Fame · +10% Renown costs',
        desc: 'Your past hunts you through a unique saga — glory costs more to reclaim.',
        bonus: {
            forgottenHeirQuest: true,
            startingFamePenalty: 10,
            renownCostPct: 10
        }
    }
];

const TRAIT_BY_ID = Object.fromEntries(TRAITS.map(t => [t.id, t]));

const TRAIT_CP_COSTS = {
    heavenly_luck: 2,
    ancient_bloodline: 2,
    crippled_meridians: 2,
    lightning_attractor: 2,
    immortals_disciple: 2,
    wandering_sage: 2,
    cursed_scholar: 2,
    forgotten_heir: 2
};

const CREATION_BASE_CP = 10;
const CREATION_MAX_TRAITS_DEFAULT = 1;
const CREATION_MAX_TRAITS_LEGACY = 2;
const CREATION_MAX_DRAWDACKS = 2;

// ===== SPIRIT ROOTS v2 — composition + grade (see docs/ideas/spiritual-roots-taxonomy-v2.md) =====

/** Classical five elements for root composition (deviants like lightning are separate). */
const SPIRIT_CLASSICAL_ELEMENTS = ['fire', 'water', 'wood', 'metal', 'earth'];

/** Composition sets innate ceiling (realm index); grade does NOT raise ceiling. */
const SPIRIT_ROOT_COMPOSITIONS = [
    {
        id: 'pentamixed',
        name: 'Pentamixed',
        cpCost: -1,
        elementCount: 5,
        innateCeilingRealmIdx: 1,
        heightLabel: 'Foundation Shore',
        compositionSpeedMult: 0.80,
        notes: 'Four or five elements in chaos — slowest, lowest innate height.',
        oracleLine: 'Five elements clash — your road likely ends at a sealed foundation unless heaven\'s verdict changes.'
    },
    {
        id: 'mixed',
        name: 'Mixed',
        cpCost: 0,
        elementCount: 3,
        innateCeilingRealmIdx: 2,
        heightLabel: 'Golden Core Gate',
        compositionSpeedMult: 0.92,
        notes: 'Three elements — most unlucky cultivators.',
        oracleLine: 'Heaven may permit a golden core — whether you survive to fill it is another matter.'
    },
    {
        id: 'dual',
        name: 'Dual',
        cpCost: 2,
        elementCount: 2,
        innateCeilingRealmIdx: 3,
        heightLabel: 'Nascent Soul Bridge',
        compositionSpeedMult: 1.0,
        notes: 'Two elements — flexible middle path.',
        oracleLine: 'A soul may yet emerge from the core — if the tribulation fire does not consume you first.'
    },
    {
        id: 'single',
        name: 'Single',
        cpCost: 4,
        elementCount: 1,
        innateCeilingRealmIdx: 4,
        heightLabel: 'Void Horizon',
        compositionSpeedMult: 1.05,
        notes: 'One pure element — focused, highest classical ceiling.',
        oracleLine: 'One flame, one road — the void horizon is your allotted height; beyond it, only rites may argue with heaven.'
    }
];

const SPIRIT_ROOT_COMPOSITION_BY_ID = Object.fromEntries(SPIRIT_ROOT_COMPOSITIONS.map(c => [c.id, c]));

/** Grade affects speed / trib odds only — NOT innate ceiling. */
const SPIRIT_ROOT_GRADES = [
    {
        id: 'inferior',
        name: 'Inferior',
        cpCost: 0,
        cultivateSpeedMult: 0.75,
        breakthroughBonus: -8,
        coreCondenseMult: 0.75,
        notes: 'Impure flow — slow and leaky.'
    },
    {
        id: 'common',
        name: 'Common',
        cpCost: 1,
        cultivateSpeedMult: 1.0,
        breakthroughBonus: 0,
        coreCondenseMult: 1.0,
        notes: 'Sect-acceptable baseline.'
    },
    {
        id: 'superior',
        name: 'Superior',
        cpCost: 3,
        cultivateSpeedMult: 1.18,
        breakthroughBonus: 5,
        coreCondenseMult: 1.08,
        notes: 'Inner-court quality root.'
    },
    {
        id: 'heavenly',
        name: 'Heavenly',
        cpCost: 7,
        cultivateSpeedMult: 1.35,
        breakthroughBonus: 10,
        coreCondenseMult: 1.15,
        requiresUnlock: 'heavenlyRoot',
        notes: 'Heaven-blessed — fast, not taller.',
        oracleSuffix: 'Heaven smiles upon your pace — your allotted height remains unchanged.'
    }
];

const SPIRIT_ROOT_GRADE_BY_ID = Object.fromEntries(SPIRIT_ROOT_GRADES.map(g => [g.id, g]));

/** Optional deviants at creation when meta-unlocked (in-run awakening is future work). */
const SPIRIT_ROOT_DEVIANTS = [
    {
        id: 'thunder',
        name: 'Thunder',
        cpCost: 3,
        requiresUnlock: 'mutantRoot',
        cultivateSpeedMult: 1.08,
        breakthroughBonus: 3,
        notes: 'Mutant lightning affinity — overlays classical root.'
    }
];

const SPIRIT_ROOT_DEVIANT_BY_ID = Object.fromEntries(SPIRIT_ROOT_DEVIANTS.map(d => [d.id, d]));

/** Innate height labels by ceiling realm index (for UI). */
const SPIRIT_INNATE_HEIGHT_LABELS = {
    0: 'Condensation Pool',
    1: 'Foundation Shore',
    2: 'Golden Core Gate',
    3: 'Nascent Soul Bridge',
    4: 'Void Horizon',
    5: 'Dao Threshold',
    6: 'Immortal Firmament'
};

// Legacy v1 presets — used only for save migration (see migrateSpiritRootV1 in talent.js).
const TALENT_ELEMENTS = ['fire', 'water', 'wood', 'metal', 'earth'];

const TALENT_GRADES = [
    {
        id: 'rootless',
        name: 'Rootless',
        cpCost: -2,
        cultivateSpeedMult: 0.45,
        breakthroughBonus: -15,
        coreCondenseMult: 0.6,
        naturalRealmCap: 1,
        notes: 'Core Formation nearly impossible without pills or events.',
        coreFeasibility: 'Unlikely in one lifetime without aid'
    },
    {
        id: 'mixed_inferior',
        name: 'Mixed Inferior',
        cpCost: 0,
        cultivateSpeedMult: 0.70,
        breakthroughBonus: -8,
        coreCondenseMult: 0.75,
        naturalRealmCap: 2,
        notes: 'Hard life; Core tight on lifespan.',
        coreFeasibility: 'Core possible but lifespan will pinch'
    },
    {
        id: 'single_inferior',
        name: 'Single Inferior',
        cpCost: 1,
        cultivateSpeedMult: 0.85,
        breakthroughBonus: -3,
        coreCondenseMult: 0.90,
        naturalRealmCap: 2,
        notes: 'Viable cultivator baseline-low.',
        coreFeasibility: 'Core achievable with discipline'
    },
    {
        id: 'single_superior',
        name: 'Single Superior',
        cpCost: 3,
        cultivateSpeedMult: 1.00,
        breakthroughBonus: 0,
        coreCondenseMult: 1.00,
        naturalRealmCap: 6,
        notes: 'Standard protagonist baseline.',
        coreFeasibility: 'Natural path to high realms'
    },
    {
        id: 'mutant',
        name: 'Mutant Root',
        cpCost: 5,
        cultivateSpeedMult: 1.20,
        breakthroughBonus: 5,
        coreCondenseMult: 1.10,
        naturalRealmCap: 6,
        requiresUnlock: 'mutantRoot',
        canBuyWithoutUnlock: true,
        notes: 'Rare spiritual mutation.',
        coreFeasibility: 'Strong condense aptitude'
    },
    {
        id: 'heavenly',
        name: 'Heavenly Root',
        cpCost: 7,
        cultivateSpeedMult: 1.35,
        breakthroughBonus: 10,
        coreCondenseMult: 1.15,
        naturalRealmCap: 6,
        requiresUnlock: 'heavenlyRoot',
        notes: 'Heaven-blessed aptitude.',
        coreFeasibility: 'Destined for the peak'
    }
];

const TALENT_BY_ID = Object.fromEntries(TALENT_GRADES.map(t => [t.id, t]));

const ORIGINS = [
    {
        id: 'village_orphan',
        name: 'Village Orphan',
        cpCost: 0,
        desc: 'A humble beginning — no debts, no patrons.',
        requiresUnlock: null
    },
    {
        id: 'merchant_heir',
        name: 'Merchant Heir',
        cpCost: 2,
        desc: '+40 spirit stones, −5% cultivate speed.',
        requiresUnlock: 'merchantHeir',
        startEffect: { stones: 40, cultivateSpeedPct: -5 }
    },
    {
        id: 'sect_reject',
        name: 'Sect Reject',
        cpCost: 1,
        desc: '+1 random common technique, −10 starting Fame.',
        requiresUnlock: 'sectReject',
        startEffect: { randomCommonTechnique: true, fame: -10 }
    },
    {
        id: 'fallen_noble',
        name: 'Fallen Noble',
        cpCost: 2,
        desc: '+15 Fame, −20 spirit stones.',
        requiresUnlock: 'fallenNoble',
        startEffect: { fame: 15, stones: -20 }
    }
];

const ORIGIN_BY_ID = Object.fromEntries(ORIGINS.map(o => [o.id, o]));

const CREATION_DRAWBACKS = [
    {
        id: 'sworn_enemy',
        name: 'Sworn Enemy',
        cpRefund: 2,
        desc: 'A deadly grudge follows you (+5% combat damage taken).',
        effect: { combatDamageTakenPct: 5 }
    },
    {
        id: 'frail_body',
        name: 'Frail Body',
        cpRefund: 1,
        desc: 'Your vessel is weak (−10% max HP).',
        effect: { maxHpPct: -10 }
    },
    {
        id: 'poor_memory',
        name: 'Poor Memory',
        cpRefund: 1,
        desc: 'Insights slip away (−10% Dao comprehension).',
        effect: { daoSpeedPct: -10 }
    },
    {
        id: 'hunted',
        name: 'Hunted',
        cpRefund: 2,
        desc: 'Bounty hunters whisper your name (−15 starting Fame).',
        effect: { fame: -15 }
    }
];

const DRAWBACK_BY_ID = Object.fromEntries(CREATION_DRAWBACKS.map(d => [d.id, d]));

const LEGACY_CARRY_PERKS = [
    { id: 'echo_of_qi', name: 'Echo of Qi', desc: '+5% cultivate speed next run.' },
    { id: 'echo_of_foundation', name: 'Echo of Foundation', desc: '+3 Foundation at run start.' },
    { id: 'echo_of_fortune', name: 'Echo of Fortune', desc: '+25 spirit stones next run.' },
    { id: 'echo_of_memory', name: 'Echo of Memory', desc: '+5% Dao comprehension next run.' }
];

const LEGACY_BONUS_CP = {
    bitter: 1,
    true: 2
};

const TECHNIQUE_POOL = [
    { name: "Heavenly Palm", path: "qi", element: "neutral", category: "attack", combatTier: "light", weaponType: "fist", baseDamage: 8, baseCost: 5, costType: "qi", rarity: "common", desc: "A classic palm strike channeling refined qi." },
    { name: "Iron Mountain Stance", path: "body", element: "earth", category: "defense", combatTier: "defense", weaponType: "fist", baseDamage: 5, baseCost: 3, costType: "qi", rarity: "common", desc: "Roots your stance like a mountain — absorb blows with tempered flesh." },
    { name: "Soul Severing Sword", path: "soul", school: "soul_condensation", element: "soul", category: "attack", combatTier: "medium", weaponType: "sword", techniqueQuality: "high", soulMassMin: 25, spiritDamage: true, baseDamage: 12, baseCost: 8, costType: "spirit", rarity: "common", desc: "A blade that cuts the soul." },
    { name: "Five Elements Fist", path: "qi", element: "elemental", category: "attack", combatTier: "medium", weaponType: "fist", setId: "five_elements", techniqueQuality: "high", intentReq: { weapon: "Fist", minStage: 1 }, affinityCycle: ["fire", "water", "earth", "wind", "lightning"], baseDamage: 10, baseCost: 6, costType: "qi", rarity: "uncommon", desc: "Cycles through five elemental strikes." },
    { name: "Scorching Palm", path: "qi", element: "fire", category: "attack", combatTier: "light", weaponType: "fist", setId: "five_elements", techniqueQuality: "mid", baseDamage: 9, baseCost: 5, costType: "qi", rarity: "uncommon", desc: "A palm strike wreathed in flame." },
    { name: "Tide Spiral", path: "qi", element: "water", category: "attack", combatTier: "light", weaponType: "fist", setId: "five_elements", techniqueQuality: "mid", baseDamage: 9, baseCost: 5, costType: "qi", rarity: "uncommon", desc: "Flowing water redirects force back at the foe." },
    { name: "Blood Refining Art", path: "body", element: "blood", category: "attack", combatTier: "medium", baseDamage: 12, baseCost: 5, costType: "qi", rarity: "uncommon", desc: "Drains life force from foes to mend your flesh." },
    { name: "Gentle Repression", path: "qi", element: "neutral", category: "utility", combatTier: "utility", weaponType: "fist", reqTalent: "cursed_scholar", baseDamage: 6, baseCost: 4, costType: "qi", rarity: "rare", desc: "Story art — suppress corruption and steady the meridians." },
    { name: "Void Step", path: "neutral", element: "neutral", category: "utility", combatTier: "utility", baseDamage: 0, baseCost: 4, costType: "qi", rarity: "rare", desc: "Evade the next attack." },
    { name: "Celestial Judgment", path: "qi", element: "lightning", category: "attack", combatTier: "heavy", techniqueQuality: "high", intentReq: { weapon: "Staff", minStage: 2 }, reqTalent: "lightning_attractor", baseDamage: 22, baseCost: 12, costType: "qi", rarity: "rare", desc: "A blast of heavenly lightning — devastating qi expenditure." },
    { name: "War God's Roar", path: "body", element: "earth", category: "attack", combatTier: "heavy", weaponType: "fist", techniqueQuality: "high", intentReq: { weapon: "Fist", minStage: 2 }, baseDamage: 20, baseCost: 8, costType: "qi", rarity: "rare", desc: "A roar that shatters bone — a costly finishing blow." },
    { name: "Soul Rend", path: "soul", school: "soul_condensation", element: "soul", category: "attack", combatTier: "heavy", techniqueQuality: "high", soulMassMin: 40, spiritDamage: true, baseDamage: 22, baseCost: 14, costType: "spirit", rarity: "rare", desc: "Tears the enemy's soul apart." },
    { name: "Frostbite Palm", path: "qi", element: "ice", category: "attack", combatTier: "medium", baseDamage: 14, baseCost: 7, costType: "qi", rarity: "rare", desc: "An icy palm strike that chills to the bone." },
    { name: "Mirror Step", path: "neutral", element: "neutral", category: "attack", combatTier: "heavy", techniqueQuality: "high", intentReq: { weapon: "Blade", minStage: 2 }, reqTalent: "immortals_disciple", baseDamage: 12, baseCost: 8, costType: "qi", rarity: "legendary", desc: "Strike through reflection — ignores enemy guard." },
    // —— Qi arts (expanded) ——
    { name: "Gale Spiral", path: "qi", element: "wind", category: "attack", combatTier: "light", weaponType: "fist", baseDamage: 9, baseCost: 5, costType: "qi", rarity: "common", desc: "A spiraling gust compressed into a palm strike." },
    { name: "Earth Pulse Palm", path: "qi", element: "earth", category: "attack", combatTier: "medium", weaponType: "fist", baseDamage: 11, baseCost: 6, costType: "qi", rarity: "common", desc: "Qi ripples through stone — steady, crushing force." },
    { name: "Storm Needle", path: "qi", element: "lightning", category: "attack", combatTier: "light", baseDamage: 10, baseCost: 6, costType: "qi", rarity: "uncommon", desc: "A needle-thin bolt that pierces meridian defenses." },
    { name: "Wind Blade Strike", path: "qi", element: "wind", category: "attack", combatTier: "medium", weaponType: "blade", setId: "sword_dominion", techniqueQuality: "high", intentReq: { weapon: "Blade", minStage: 1 }, baseDamage: 12, baseCost: 7, costType: "qi", rarity: "uncommon", desc: "Cutting wind shaped like a crescent blade." },
    { name: "Heavenly Sword Qi", path: "qi", element: "neutral", category: "attack", combatTier: "medium", weaponType: "sword", setId: "sword_dominion", techniqueQuality: "high", intentReq: { weapon: "Sword", minStage: 1 }, baseDamage: 13, baseCost: 7, costType: "qi", rarity: "uncommon", desc: "Condensed sword intent without a physical blade." },
    { name: "Meridian Flow", path: "qi", element: "neutral", category: "buff", combatTier: "buff", baseDamage: 3, baseCost: 4, costType: "qi", rarity: "common", desc: "Circulates qi through meridians — light recovery mid-fight." },
    { name: "Root-Vein Surge", path: "qi", element: "earth", category: "attack", combatTier: "medium", weaponType: "staff", baseDamage: 12, baseCost: 6, costType: "qi", rarity: "uncommon", desc: "Draws power from the continental spiritual veins." },
    { name: "Sandburrow Palm", path: "qi", element: "earth", category: "attack", combatTier: "light", weaponType: "fist", baseDamage: 10, baseCost: 5, costType: "qi", rarity: "uncommon", desc: "Burrowing sand qi that finds cracks in armor." },
    { name: "Glacier Heart Palm", path: "qi", element: "ice", category: "attack", combatTier: "medium", weaponType: "fist", techniqueQuality: "high", intentReq: { weapon: "Fist", minStage: 1 }, baseDamage: 14, baseCost: 7, costType: "qi", rarity: "rare", desc: "The frozen heart of a glacier spirit — numbing cold." },
    { name: "Demon Seal", path: "soul", school: "soul_condensation", element: "soul", category: "attack", combatTier: "medium", techniqueQuality: "high", soulMassMin: 20, spiritDamage: true, baseDamage: 15, baseCost: 10, costType: "spirit", rarity: "uncommon", desc: "Seals and damages demonic energy." },
    { name: "Phoenix Ascent Palm", path: "qi", element: "fire", category: "attack", combatTier: "heavy", weaponType: "fist", setId: "ember_fury", techniqueQuality: "high", intentReq: { weapon: "Fist", minStage: 2 }, baseDamage: 20, baseCost: 11, costType: "qi", rarity: "rare", desc: "Rising flame like a phoenix breaching the caldera sky." },
    { name: "Raging Ember Fist", path: "qi", element: "fire", category: "attack", combatTier: "light", weaponType: "fist", setId: "ember_fury", baseDamage: 10, baseCost: 5, costType: "qi", rarity: "uncommon", desc: "Volcanic embers packed into rapid strikes." },
    { name: "Cinder Volley", path: "qi", element: "fire", category: "attack", combatTier: "light", weaponType: "fist", setId: "ember_fury", baseDamage: 9, baseCost: 5, costType: "qi", rarity: "common", desc: "Scattered embers strike in rapid succession." },
    { name: "Maelstrom Lance", path: "qi", element: "water", category: "attack", combatTier: "medium", weaponType: "spear", techniqueQuality: "high", intentReq: { weapon: "Spear", minStage: 1 }, baseDamage: 13, baseCost: 7, costType: "qi", rarity: "rare", desc: "A spear of spiraling tide-force from the deep." },
    { name: "Void Rend", path: "qi", element: "void", category: "attack", combatTier: "medium", reqTalent: "ancient_bloodline", baseDamage: 13, baseCost: 8, costType: "qi", rarity: "rare", desc: "Tears a rift of nothingness through the enemy's guard." },
    // —— Body arts (expanded) ——
    { name: "Bone Tempering Stance", path: "body", element: "earth", category: "defense", combatTier: "defense", setId: "body_tempering", baseDamage: 5, baseCost: 3, costType: "qi", rarity: "common", desc: "Temper marrow and bone until blows glance off." },
    { name: "Crushing Fist", path: "body", element: "neutral", category: "attack", combatTier: "light", weaponType: "fist", setId: "body_tempering", baseDamage: 9, baseCost: 4, costType: "qi", rarity: "common", desc: "Raw physical force — no qi ornament, just impact." },
    { name: "Bronze Skin Palm", path: "body", element: "earth", category: "defense", combatTier: "defense", weaponType: "fist", setId: "body_tempering", reqPath: "body", reqRealm: 1, baseDamage: 6, baseCost: 4, costType: "qi", rarity: "uncommon", desc: "Flesh hardens to bronze — body cultivators only." },
    { name: "Sandstorm Body Art", path: "body", element: "earth", category: "attack", combatTier: "medium", weaponType: "fist", baseDamage: 12, baseCost: 6, costType: "qi", rarity: "uncommon", desc: "Desert winds and grit scour foes while you advance." },
    { name: "Viper Fang Strike", path: "body", element: "blood", category: "attack", combatTier: "light", baseDamage: 10, baseCost: 5, costType: "qi", rarity: "uncommon", desc: "A venomous strike that draws blood and feeds vitality." },
    { name: "Mountain Crash", path: "body", element: "earth", category: "attack", combatTier: "heavy", weaponType: "fist", techniqueQuality: "high", intentReq: { weapon: "Fist", minStage: 1 }, baseDamage: 19, baseCost: 9, costType: "qi", rarity: "rare", desc: "Your body becomes the mountain — a devastating slam." },
    { name: "Blood Aegis", path: "body", element: "blood", category: "buff", combatTier: "buff", baseDamage: 4, baseCost: 5, costType: "qi", rarity: "uncommon", desc: "Blood qi forms a brief protective membrane." },
    { name: "Staff Shatter", path: "body", element: "earth", category: "attack", combatTier: "medium", weaponType: "staff", techniqueQuality: "mid", baseDamage: 13, baseCost: 7, costType: "qi", rarity: "uncommon", desc: "Shatter a staff's worth of force through tempered limbs." },
    // —— Soul arts (expanded) ——
    { name: "Soul Lash", path: "soul", school: "soul_condensation", element: "soul", category: "attack", combatTier: "light", setId: "soul_suppression", soulMassMin: 10, spiritDamage: true, baseDamage: 11, baseCost: 7, costType: "spirit", rarity: "common", desc: "A whip of condensed soul force." },
    { name: "Phantom Blade", path: "soul", school: "soul_condensation", element: "soul", category: "attack", combatTier: "light", weaponType: "blade", setId: "sword_dominion", techniqueQuality: "high", soulMassMin: 30, spiritDamage: true, baseDamage: 10, baseCost: 7, costType: "spirit", rarity: "uncommon", desc: "A blade of spirit that passes through flesh to cut the soul." },
    { name: "Spirit Suppression Art", path: "soul", school: "soul_condensation", element: "soul", category: "attack", combatTier: "medium", setId: "soul_suppression", soulMassMin: 15, spiritDamage: true, baseDamage: 14, baseCost: 9, costType: "spirit", rarity: "uncommon", desc: "Suppresses the enemy's spirit, weakening their techniques." },
    { name: "Mind Sever", path: "soul", school: "soul_condensation", element: "soul", category: "attack", combatTier: "medium", setId: "soul_suppression", soulMassMin: 10, spiritDamage: true, baseDamage: 12, baseCost: 8, costType: "spirit", rarity: "uncommon", desc: "Severs the link between mind and body for an instant." },
    { name: "Ghost Spear Thrust", path: "soul", school: "soul_condensation", element: "soul", category: "attack", combatTier: "medium", weaponType: "spear", techniqueQuality: "mid", soulMassMin: 25, spiritDamage: true, baseDamage: 13, baseCost: 8, costType: "spirit", rarity: "uncommon", desc: "A spear of condensed soul force that pierces from afar." },
    { name: "Spectral Shield", path: "soul", school: "soul_condensation", element: "soul", category: "defense", combatTier: "defense", soulMassMin: 15, spiritDamage: true, baseDamage: 5, baseCost: 6, costType: "spirit", rarity: "uncommon", desc: "A barrier of soul energy that absorbs spiritual attacks." },
    { name: "Abyss Gaze", path: "soul", school: "soul_condensation", element: "soul", category: "attack", combatTier: "heavy", techniqueQuality: "high", soulMassMin: 50, spiritDamage: true, reqTalent: "cursed_scholar", baseDamage: 21, baseCost: 13, costType: "spirit", rarity: "rare", desc: "Lock eyes with the abyss — the enemy's soul trembles." },
    { name: "Soul Spike", path: "soul", school: "soul_condensation", element: "soul", category: "attack", combatTier: "medium", soulMassMin: 25, baseDamage: 14, baseCost: 9, costType: "spirit", rarity: "uncommon", spiritDamage: true, spiritBypassPhysiquePct: 0.50, desc: "A needle of condensed soul force — pierces flesh-guard, not spirit-guard." },
    { name: "Soul Search", path: "soul", school: "soul_condensation", element: "soul", category: "utility", combatTier: "utility", soulMassMin: 10, baseDamage: 0, baseCost: 6, costType: "spirit", rarity: "uncommon", desc: "Probe an enemy's interior in combat; sense hidden truths when exploring or speaking with others." },
    // —— Universal arts ——
    { name: "Quickfoot Art", path: "neutral", element: "wind", category: "utility", combatTier: "utility", baseDamage: 0, baseCost: 3, costType: "qi", rarity: "common", desc: "Light footwork — reposition before the enemy strikes." },
    { name: "Focused Breath", path: "neutral", element: "neutral", category: "buff", combatTier: "buff", baseDamage: 2, baseCost: 4, costType: "qi", rarity: "common", desc: "Center breath and intent — steady the next exchange." },
    { name: "Purifying Palm", path: "qi", element: "light", category: "attack", combatTier: "medium", weaponType: "fist", reqAlignment: 40, baseDamage: 11, baseCost: 6, costType: "qi", rarity: "uncommon", desc: "Righteous qi purges corruption from foe and self — only those in accord may learn it." },
    { name: "Blood Sever", path: "body", element: "blood", category: "attack", combatTier: "heavy", weaponType: "blade", reqAlignment: -40, baseDamage: 18, baseCost: 9, costType: "qi", rarity: "rare", desc: "Sever life force without mercy — the demonic path rewards the unrestrained." }
];

/**
 * Cultivation method grade ladder (manual quality).
 * Speed midpoints from docs/ideas/cultivation-manuals-framework.md.
 * Separate from combat TECHNIQUE_POOL — do not merge.
 */
const METHOD_GRADES = {
    crude:    { id: 'crude',    name: 'Crude',    speedMult: 0.80, rarity: 'common' },
    common:   { id: 'common',   name: 'Common',   speedMult: 1.00, rarity: 'common' },
    superior: { id: 'superior', name: 'Superior', speedMult: 1.18, rarity: 'uncommon' },
    peerless: { id: 'peerless', name: 'Peerless', speedMult: 1.38, rarity: 'legendary' }
};

const METHOD_GRADE_ORDER = ['crude', 'common', 'superior', 'peerless'];

const DEFAULT_CULTIVATION_METHOD_ID = 'basic_meditation_breath';

/**
 * Shared foundation natures (P2). Many methods can stamp the same nature.
 * Nature = defining trait after FE seal — NOT cultivate speed (method grade owns speed).
 */
const FOUNDATION_NATURES = {
    plain_balanced: {
        id: 'plain_balanced',
        name: 'Balanced Foundation',
        family: 'plain',
        desc: 'A clean, unadorned seal — no exotic aspect, steady qi.',
        // Modest: slightly cheaper neutral-element techniques
        effects: { neutralTechCostMult: 0.97 }
    },
    fire_aspected: {
        id: 'fire_aspected',
        name: 'Fire-Aspected Foundation',
        family: 'five_phase',
        desc: 'Heat settles in the dantian — fire arts bite harder.',
        effects: { elementDmgMult: { fire: 1.06 } }
    },
    thunder_tempered: {
        id: 'thunder_tempered',
        name: 'Thunder-Tempered Foundation',
        family: 'deviant',
        desc: 'Deviant lightning qi forged into the seal — strikes crack sharper.',
        effects: { dmgMult: 1.05 }
    },
    sword_inclined: {
        id: 'sword_inclined',
        name: 'Sword-Inclined Foundation',
        family: 'weapon_affinity',
        desc: 'Edge-tempered seal — affinity for sword intent, better at piercing guards.',
        effects: { armorPenPct: 0.10, intentEaseBonus: 0.1 }
    },
    blood_fiend: {
        id: 'blood_fiend',
        name: 'Blood-Fiend Foundation',
        family: 'path_alignment',
        desc: 'A stained seal that leaks killing aura — weaker hearts flinch.',
        effects: { dmgMult: 1.04, intimidation: true }
    }
};

const FOUNDATION_NATURE_BY_ID = FOUNDATION_NATURES;

/** Qi-track cultivation methods. Essence manuals land in later phases. */
const CULTIVATION_METHOD_POOL = [
    {
        id: 'basic_meditation_breath',
        name: 'Basic Meditation Breath',
        lineageId: 'meditation_breath_line',
        family: 'breathing',
        methodTier: 'mortal',
        methodGrade: 'crude',
        reqRealm: 0,
        rarity: 'common',
        elements: ['neutral'],
        essences: [],
        stampsNature: 'plain_balanced',
        rootFit: { pentamixed: 1, mixed: 1, dual: 1, single: 1 },
        profile: {
            gatherMult: 1.0,
            powerMult: 1.0,
            densityEfficiency: 1.0,
            stabilityBias: 0.1
        },
        infrastructure: null,
        comprehendMonths: 2,
        desc: 'Village pamphlet breathwork — inhale, hold, cycle. Slow, safe, and portable.'
    },
    {
        id: 'outer_sect_qi_cycling',
        name: 'Outer Sect Qi Cycling',
        lineageId: 'outer_sect_qi_line',
        family: 'circulation',
        methodTier: 'condensation',
        methodGrade: 'common',
        reqRealm: 0,
        rarity: 'common',
        elements: ['neutral'],
        essences: [],
        stampsNature: 'plain_balanced',
        rootFit: { pentamixed: 1, mixed: 1, dual: 1, single: 1 },
        profile: {
            gatherMult: 1.0,
            powerMult: 1.0,
            densityEfficiency: 1.0,
            stabilityBias: 0.05
        },
        infrastructure: null,
        comprehendMonths: 3,
        desc: 'Outer-court syllabus — steady meridian loops for condensation grind.'
    },
    {
        id: 'inner_court_meridian_cycle',
        name: 'Inner Court Meridian Cycle',
        lineageId: 'inner_court_meridian_line',
        family: 'circulation',
        methodTier: 'condensation',
        methodGrade: 'superior',
        reqRealm: 0,
        rarity: 'uncommon',
        elements: ['neutral'],
        essences: [],
        stampsNature: 'plain_balanced',
        rootFit: { pentamixed: 0.95, mixed: 1, dual: 1.05, single: 1.08 },
        profile: {
            gatherMult: 1.0,
            powerMult: 1.05,
            densityEfficiency: 1.05,
            stabilityBias: 0.08
        },
        infrastructure: null,
        comprehendMonths: 4,
        desc: 'Inner-court inheritance — tighter routes, cleaner gather, higher ceiling.'
    },
    {
        id: 'nine_turn_peerless_cycle',
        name: 'Nine Turn Peerless Cycle',
        lineageId: 'nine_turn_cycle_line',
        family: 'circulation',
        methodTier: 'foundation',
        methodGrade: 'peerless',
        reqRealm: 1,
        rarity: 'legendary',
        elements: ['neutral'],
        essences: [],
        stampsNature: 'plain_balanced',
        rootFit: { pentamixed: 0.9, mixed: 0.95, dual: 1.05, single: 1.1 },
        profile: {
            gatherMult: 1.0,
            powerMult: 1.1,
            densityEfficiency: 1.1,
            stabilityBias: 0.12
        },
        infrastructure: null,
        comprehendMonths: 8,
        desc: 'Ancestor\'s complete qi transmission — peerless portable gather with no array bill.'
    },
    {
        id: 'impure_meridian_breath',
        name: 'Impure Meridian Breath',
        lineageId: 'impure_meridian_line',
        family: 'breathing',
        methodTier: 'mortal',
        methodGrade: 'common',
        reqRealm: 0,
        rarity: 'common',
        elements: ['neutral'],
        essences: [],
        stampsNature: 'plain_balanced',
        rootFit: { pentamixed: 1.12, mixed: 1.05, dual: 0.95, single: 0.88 },
        profile: {
            gatherMult: 0.95,
            powerMult: 1.0,
            densityEfficiency: 0.95,
            stabilityBias: -0.02
        },
        infrastructure: null,
        comprehendMonths: 2,
        desc: 'Breathwork tuned for tangled roots — kinder to pentamixed, leakier for pure singles.'
    },
    {
        id: 'burning_breath_technique',
        name: 'Burning Breath Technique',
        lineageId: 'burning_breath_line',
        family: 'breathing',
        methodTier: 'mortal',
        methodGrade: 'common',
        reqRealm: 0,
        rarity: 'common',
        elements: ['fire'],
        essences: [],
        stampsNature: 'fire_aspected',
        rootFit: { fire: 1.08, water: 0.92, pentamixed: 1.0, mixed: 1.0, dual: 1.02, single: 1.05 },
        profile: {
            gatherMult: 1.0,
            powerMult: 1.0,
            densityEfficiency: 1.0,
            stabilityBias: 0.04
        },
        infrastructure: null,
        comprehendMonths: 2,
        desc: 'Inhale the world\'s scattered flame-qi; exhale the mundane. Cycle after cycle, heat gathers in the dantian until your qi carries fire\'s nature.',
        shopBlurb: 'Outer-court fire breathwork — cheap, common, and enough to forge a fire-aspected foundation if you commit.'
    }
];

const CULTIVATION_METHOD_BY_ID = Object.fromEntries(
    CULTIVATION_METHOD_POOL.map(m => [m.id, m])
);

const TECHNIQUE_COMBAT_TIERS = {
    utility: { label: 'Utility', poolPct: 0.10, minCost: 6, maxCost: 12 },
    light:   { label: 'Light', poolPct: 0.14, minCost: 8, maxCost: 16 },
    medium:  { label: 'Medium', poolPct: 0.22, minCost: 14, maxCost: 24 },
    heavy:   { label: 'Heavy', poolPct: 0.32, minCost: 22, maxCost: 40 },
    defense: { label: 'Defense', poolPct: 0.12, minCost: 8, maxCost: 18 },
    buff:    { label: 'Buff', poolPct: 0.10, minCost: 8, maxCost: 14 }
};

const TECHNIQUE_BALANCE = {
    statCoeff: 0.58,
    statCoeffLight: 0.52,
    statCoeffHeavy: 0.66,
    statCoeffUtility: 0.18,
    statCoeffBodyAttack: 0.48,
    statCoeffBodyHeavy: 0.62,
    statCoeffBodyLow: 0.14,
    realmBonus: 3,
    masteryPerTenUses: 1,
    daoDamageMult: 1.5,
    iceFromWaterDaoMult: 1.25,
    obsolescence: {
        gapMult: { 1: 0.58, 2: 0.40, 3: 0.28, 4: 0.22, 5: 0.18, 6: 0.15 },
        floor: 0.15,
        masteryGrandmaster: 0.10,
        masteryTranscendent: 0.05
    }
};

/** Cultivation tier of a manual — gates comprehension realm and base power band. */
const CULTIVATION_TIERS = {
    mortal:       { reqRealm: 0, emoji: '🪶', damageBand: [6, 9],  costBase: 3 },
    condensation: { reqRealm: 0, emoji: '💧', damageBand: [9, 13], costBase: 5 },
    foundation:   { reqRealm: 1, emoji: '🏛️', damageBand: [12, 17], costBase: 6 },
    core:         { reqRealm: 2, emoji: '🔮', damageBand: [16, 23], costBase: 8 },
    nascent:      { reqRealm: 3, emoji: '✨', damageBand: [21, 30], costBase: 10 },
    void:         { reqRealm: 4, emoji: '🌌', damageBand: [27, 36], costBase: 12 },
    dao_seeking:  { reqRealm: 5, emoji: '☯️', damageBand: [33, 44], costBase: 14 },
    immortal:     { reqRealm: 6, emoji: '👑', damageBand: [40, 52], costBase: 16 }
};

const CULTIVATION_TIER_ORDER = ['mortal', 'condensation', 'foundation', 'core', 'nascent', 'void', 'dao_seeking', 'immortal'];

const TECHNIQUE_CULTIVATION_TIERS = {
    'Quickfoot Art': 'mortal',
    'Focused Breath': 'mortal',
    'Cinder Volley': 'mortal',
    'Heavenly Palm': 'condensation',
    'Iron Mountain Stance': 'condensation',
    'Soul Severing Sword': 'condensation',
    'Gale Spiral': 'condensation',
    'Earth Pulse Palm': 'condensation',
    'Meridian Flow': 'condensation',
    'Crushing Fist': 'condensation',
    'Bone Tempering Stance': 'condensation',
    'Soul Lash': 'condensation',
    'Five Elements Fist': 'foundation',
    'Scorching Palm': 'foundation',
    'Tide Spiral': 'foundation',
    'Storm Needle': 'foundation',
    'Wind Blade Strike': 'foundation',
    'Heavenly Sword Qi': 'foundation',
    'Root-Vein Surge': 'foundation',
    'Sandburrow Palm': 'foundation',
    'Raging Ember Fist': 'foundation',
    'Blood Refining Art': 'foundation',
    'Demon Seal': 'foundation',
    'Bronze Skin Palm': 'foundation',
    'Sandstorm Body Art': 'foundation',
    'Viper Fang Strike': 'foundation',
    'Blood Aegis': 'foundation',
    'Phantom Blade': 'foundation',
    'Spirit Suppression Art': 'foundation',
    'Mind Sever': 'foundation',
    'Ghost Spear Thrust': 'foundation',
    'Spectral Shield': 'foundation',
    'Staff Shatter': 'foundation',
    'Frostbite Palm': 'core',
    'Glacier Heart Palm': 'core',
    'Void Rend': 'core',
    'Maelstrom Lance': 'core',
    'Mountain Crash': 'core',
    "War God's Roar": 'core',
    'Soul Rend': 'core',
    'Void Step': 'core',
    'Gentle Repression': 'core',
    'Phoenix Ascent Palm': 'nascent',
    'Abyss Gaze': 'nascent',
    'Celestial Judgment': 'dao_seeking',
    'Mirror Step': 'immortal'
};

const TECHNIQUE_COMBAT_DAMAGE_MULT = {
    light: 0.88,
    medium: 1.0,
    heavy: 1.34,
    defense: 0.62,
    buff: 0.48,
    utility: 0
};

const TECH_PATH_LABELS = {
    qi: "⚡ Qi Arts",
    body: "💪 Body Arts",
    soul: "🧠 Soul Arts",
    neutral: "◆ Universal"
};

const TECH_ELEMENT_LABELS = {
    fire: "🔥 Fire",
    water: "💧 Water",
    ice: "❄️ Ice",
    lightning: "⚡ Lightning",
    earth: "🌍 Earth",
    wind: "🌪️ Wind",
    void: "🌌 Void",
    soul: "👻 Soul",
    blood: "🩸 Blood",
    elemental: "☯️ Elemental",
    neutral: "◆ Neutral"
};

const TECH_CATEGORY_LABELS = {
    attack: "Offense",
    utility: "Utility",
    defense: "Defense",
    buff: "Buff"
};

const ELEMENT_DAO_MAP = {
    fire: 'phase_fire',
    water: 'phase_water',
    lightning: 'phase_metal',
    earth: 'phase_earth',
    wind: 'phase_wood',
    ice: 'phase_water'
};

// ===== AFFINITY & TECHNIQUE SETS =====
const AFFINITY_KEYS = ["fire", "water", "wind", "earth", "lightning", "void", "sword", "blade", "spear", "fist", "staff"];

const AFFINITY_LABELS = {
    fire: "🔥 Fire",
    water: "💧 Water",
    wind: "🌪️ Wind",
    earth: "🌍 Earth",
    lightning: "⚡ Lightning",
    void: "🌌 Void",
    sword: "⚔️ Sword",
    blade: "🗡️ Blade",
    spear: "🔱 Spear",
    fist: "👊 Fist",
    staff: "🪄 Staff"
};

const AFFINITY_TIER_NAMES = ["Initiate", "Adept", "Master", "Grandmaster", "Transcendent"];

const AFFINITY_TIER_THRESHOLDS = [0, 25, 50, 75, 100];

const AFFINITY_TIER_BONUSES = [
    { dmgMult: 0.02, costMult: 0, desc: "+2% damage" },
    { dmgMult: 0.05, costMult: 0, desc: "+5% damage" },
    { dmgMult: 0.08, costMult: 0.03, desc: "+8% damage, −3% technique cost" },
    { dmgMult: 0.12, costMult: 0.05, desc: "+12% damage, −5% technique cost" },
    { dmgMult: 0.18, costMult: 0.08, fireIgniteChance: 0.12, desc: "+18% damage, −8% cost, ignite chance (Fire)" }
];

const ELEMENT_TO_AFFINITY = {
    fire: "fire",
    water: "water",
    ice: "water",
    lightning: "lightning",
    earth: "earth",
    wind: "wind",
    void: "void"
};

const AFFINITY_BALANCE = {
    gainPerTechniqueUse: 1,
    maxPoints: 100
};

const TECHNIQUE_SETS = {
    five_elements: {
        id: "five_elements",
        name: "Five Elements Cycle",
        emoji: "☯️",
        techniques: ["Five Elements Fist", "Scorching Palm", "Tide Spiral"],
        bonuses: {
            2: { dmgMult: 0.05, desc: "+5% damage with set techniques" },
            3: {
                dmgMult: 0.10,
                costMult: 0.05,
                affinityGainBonus: 1,
                desc: "+10% set damage, −5% set cost, +1 affinity per elemental strike"
            }
        }
    },
    sword_dominion: {
        id: "sword_dominion",
        name: "Sword Dominion",
        emoji: "⚔️",
        techniques: ["Soul Severing Sword", "Phantom Blade", "Heavenly Sword Qi", "Wind Blade Strike"],
        bonuses: {
            2: { dmgMult: 0.06, desc: "+6% damage with sword and blade techniques" },
            3: { dmgMult: 0.10, costMult: 0.04, desc: "+10% set damage, −4% set cost" },
            4: { dmgMult: 0.15, costMult: 0.06, desc: "+15% set damage, −6% cost — blade intent perfected" }
        }
    },
    body_tempering: {
        id: "body_tempering",
        name: "Body Tempering Cycle",
        emoji: "💪",
        techniques: ["Iron Mountain Stance", "Bone Tempering Stance", "Crushing Fist", "Bronze Skin Palm"],
        bonuses: {
            2: { dmgMult: 0.04, desc: "+4% body technique damage" },
            3: { dmgMult: 0.08, costMult: 0.05, desc: "+8% set damage, −5% set cost" },
            4: { dmgMult: 0.12, costMult: 0.08, desc: "+12% set damage, −8% cost — flesh like forged iron" }
        }
    },
    soul_suppression: {
        id: "soul_suppression",
        name: "Soul Condensation",
        emoji: "💠",
        techniques: ["Demon Seal", "Spirit Suppression Art", "Soul Lash", "Mind Sever"],
        bonuses: {
            2: { dmgMult: 0.05, desc: "+5% condensation technique damage" },
            3: { dmgMult: 0.10, costMult: 0.05, desc: "+10% set damage, −5% spirit cost" },
            4: { dmgMult: 0.14, costMult: 0.08, desc: "+14% set damage, −8% spirit cost — interior weight dominates" }
        }
    },
    ember_fury: {
        id: "ember_fury",
        name: "Ember Fury",
        emoji: "🔥",
        techniques: ["Raging Ember Fist", "Cinder Volley", "Phoenix Ascent Palm"],
        bonuses: {
            2: { dmgMult: 0.06, desc: "+6% fire technique damage" },
            3: {
                dmgMult: 0.12,
                costMult: 0.05,
                affinityGainBonus: 1,
                desc: "+12% set damage, −5% cost, +1 fire affinity per strike"
            }
        }
    }
};

const PILL_TYPES = {
    spirit_gathering: {
        name: "Spirit Gathering Pill",
        emoji: "💊",
        desc: "Channels qi — boosts cultivation stats.",
        months: 1,
        apply() {
            const boost = 4 + Math.floor(Math.random() * 7) + G.realmIdx;
            G.qiDensity = (G.qiDensity || 0) + Math.round(boost * 0.06 * 10) / 10;
            G.qi = Math.min(getMaxQi(), G.qi + Math.floor(getMaxQi() * 0.25));
            clampCurrentQi();
            G.vitality += Math.floor(boost / 3);
            G.spirit += Math.floor(boost / 4);
            G.will += Math.floor(boost / 4);
            applyVitalityToMaxHp();
            G.hp = Math.min(G.maxHp, G.hp + 8 + Math.floor(boost / 2));
            if (G.qiExhausted && G.qi > 0) G.qiExhausted = false;
            return `+${(boost * 0.06).toFixed(1)} Density, dantian refilled, light heal.`;
        }
    },
    blood_recovery: {
        name: "Blood Recovery Pill",
        emoji: "❤️",
        desc: "Restores flesh — major HP recovery.",
        months: 1,
        apply() {
            const heal = Math.floor(G.maxHp * 0.35) + G.vitality + G.realmIdx * 3;
            const before = G.hp;
            G.hp = Math.min(G.maxHp, G.hp + heal);
            G.vitality += 1;
            applyVitalityToMaxHp();
            return `+${G.hp - before} HP, +1 Vitality.`;
        }
    },
    meridian_soothing: {
        name: "Meridian Soothing Pill",
        emoji: "☯️",
        desc: "Unblocks meridians — foundation and qi flow.",
        months: 2,
        apply() {
            grantFoundation(4);
            G.qi = Math.min(getMaxQi(), G.qi + 4 + G.realmIdx);
            clampCurrentQi();
            return `+4 Foundation, dantian +${4 + G.realmIdx} Qi.`;
        }
    },
    purifying_elixir: {
        name: "Purifying Elixir",
        emoji: "✨",
        desc: "Rare — mends cycle stain and steadies the spirit. Not a common shop pill.",
        months: 2,
        reqRealm: 3,
        apply() {
            const reduced = typeof reduceCorruption === 'function'
                ? reduceCorruption(6 + Math.floor(Math.random() * 6), 'purifying elixir')
                : 0;
            if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(2 + Math.floor(Math.random() * 3), 'purifying elixir');
            G.will += 2;
            return `cycle stain cleansed${reduced ? '' : ' (minimal)'}, +Will, spirit steadied.`;
        }
    },
    soul_nourishing: {
        name: "Soul Nourishing Pill",
        emoji: "🧠",
        desc: "Nourishes the spirit and soul shield.",
        months: 1,
        apply() {
            G.spirit += 4 + Math.floor(G.realmIdx / 2);
            G.will += 3 + Math.floor(G.realmIdx / 2);
            updateShield();
            if (G.path === 'soul') G.shield = G.maxShield;
            else if (G.path === 'qi') G.shield = Math.min(G.maxShield, G.shield + Math.floor(G.maxShield * 0.4));
            return `+Spirit/Will, barrier restored.`;
        }
    },
    foundation_stabilizing: {
        name: "Foundation Stabilizing Pill",
        emoji: "🏛️",
        desc: "Stabilizes your cultivation base before breakthroughs.",
        months: 3,
        apply() {
            grantFoundation(8);
            G.qi += 3;
            G.vitality += 2;
            applyVitalityToMaxHp();
            return `+8 Foundation, +3 Qi, +2 Vitality.`;
        }
    },
    scar_salve: {
        name: "Scar-Salve Pill",
        emoji: "🩹",
        desc: "Legendary elixir — dissolves one tribulation scar.",
        months: 2,
        apply() {
            const scars = typeof getActiveScars === 'function' ? getActiveScars() : [];
            if (!scars.length) return `No tribulation scars to heal.`;
            if (typeof healScarByMethod === 'function') {
                healScarByMethod('legendary_pill', scars[0].id);
                return `One tribulation scar fades from your body.`;
            }
            return `The pill's power finds no wound to mend.`;
        }
    }
};

const PILL_LOOT_WEIGHTS = [
    { id: "spirit_gathering", weight: 40 },
    { id: "blood_recovery", weight: 25 },
    { id: "meridian_soothing", weight: 15 },
    { id: "soul_nourishing", weight: 12 },
    { id: "foundation_stabilizing", weight: 8 }
];

const ENEMIES = [
    { name: "Feral Spirit Wolf", hp: 35, dmg: 4, minRealm: 0, zones: ['frostbite', 'emberwild'], element: 'wind',
        abilities: [
            { id: 'snap', weight: 50, telegraph: 'The wolf bares frost-caked fangs.', effect: { bonusDmgMult: 1.1 } },
            { id: 'circle', weight: 30, effect: { selfDefend: true, bonusDmgMult: 0.7, log: 'It circles, waiting for an opening.' } },
            { id: 'lunge', weight: 20, cooldown: 2, effect: { bonusDmgMult: 1.35, applyPlayer: { bleedTurns: 2, bleedDmgPct: 0.025 } } }
        ] },
    { name: "Corrupted Cultivator", hp: 50, dmg: 6, minRealm: 0, zones: ['dustbone', 'heartlands'], element: 'neutral',
        abilities: [
            { id: 'dark_pulse', weight: 45, telegraph: 'Corrupted qi gathers in their palm.', effect: { bonusDmgMult: 1.15 } },
            { id: 'guard', weight: 35, effect: { selfDefend: true, log: 'They raise a sloppy barrier.' } },
            { id: 'drain', weight: 20, cooldown: 3, effect: { bonusDmgMult: 0.9, applyPlayer: { slowResourceRegen: 1 } } }
        ] },
    { name: "Demon Beast", hp: 65, dmg: 7, minRealm: 1, zones: ['emberwild', 'dustbone'], element: 'fire',
        enrageThreshold: 0.4,
        abilities: [
            { id: 'claw', weight: 50, effect: { bonusDmgMult: 1.1 } },
            { id: 'roar', weight: 30, effect: { applyPlayer: { slowResourceRegen: 1 }, bonusDmgMult: 0.85, log: 'A demonic roar shakes your focus!' } },
            { id: 'charge', weight: 20, cooldown: 2, telegraph: 'The beast lowers its horns.', effect: { bonusDmgMult: 1.5, log: 'It charges with hellfire momentum!' } }
        ],
        enrageAbilities: [
            { id: 'rampage', weight: 60, effect: { bonusDmgMult: 1.4, extraHits: 1 } },
            { id: 'frenzy_claw', weight: 40, effect: { bonusDmgMult: 1.55 } }
        ] },
    { name: "Shadow Assassin", hp: 45, dmg: 8, minRealm: 1, zones: ['jade', 'heartlands'], element: 'wind',
        abilities: [
            { id: 'stab', weight: 45, effect: { bonusDmgMult: 1.2 } },
            { id: 'smoke', weight: 30, effect: { selfDefend: true, log: 'Smoke obscures their form.' } },
            { id: 'vitals', weight: 25, cooldown: 2, telegraph: 'A blade seeks your meridians.', effect: { bonusDmgMult: 1.35, applyPlayer: { bleedTurns: 2, bleedDmgPct: 0.035 } } }
        ] },
    { name: "Heavenly Tribulation Phantom", hp: 80, dmg: 9, minRealm: 2, zones: ['heartlands', 'frostbite'], element: 'soul',
        abilities: [
            { id: 'spirit_bolt', weight: 40, telegraph: 'Heavenly wrath condenses.', effect: { bonusDmgMult: 1.1, applyPlayer: { spiritDamage: true } } },
            { id: 'phase', weight: 35, effect: { selfDefend: true, noDamage: true, log: 'The phantom flickers out of reach.' } },
            { id: 'tribulation_strike', weight: 25, cooldown: 3, effect: { bonusDmgMult: 1.4, applyPlayer: { spiritDamage: true } } }
        ] },
    { name: "Nascent Soul Raider", hp: 110, dmg: 12, minRealm: 3, zones: ['jade', 'dustbone'], element: 'soul',
        abilities: [
            { id: 'soul_rend', weight: 45, effect: { bonusDmgMult: 1.15, applyPlayer: { spiritDamage: true } } },
            { id: 'barrier', weight: 30, effect: { selfDefend: true } },
            { id: 'harvest', weight: 25, cooldown: 3, effect: { bonusDmgMult: 1.25, stealStones: { min: 3, max: 8, chance: 0.6 } } }
        ] },
    { name: "Void Horror", hp: 140, dmg: 15, minRealm: 4, zones: ['emberwild', 'frostbite'], element: 'neutral',
        enrageThreshold: 0.35,
        abilities: [
            { id: 'void_lash', weight: 50, effect: { bonusDmgMult: 1.15 } },
            { id: 'consume', weight: 30, effect: { bonusDmgMult: 1.0, applyPlayer: { poisonTurns: 2, poisonDmgPct: 0.035 } } },
            { id: 'rift', weight: 20, cooldown: 3, telegraph: 'Reality tears around the horror.', effect: { bonusDmgMult: 1.45 } }
        ],
        enrageAbilities: [
            { id: 'void_maw', weight: 100, effect: { bonusDmgMult: 1.5, applyPlayer: { skipPlayerTurn: 1 } } }
        ] },
    { name: "Dao Seeker's Nemesis", hp: 170, dmg: 18, minRealm: 5, zones: ['heartlands'], element: 'neutral',
        abilities: [
            { id: 'counter_stance', weight: 35, effect: { selfDefend: true, log: 'Your nemesis reads your intent.' } },
            { id: 'dao_slash', weight: 40, telegraph: 'A blade of pure conviction falls.', effect: { bonusDmgMult: 1.2 } },
            { id: 'breakthrough', weight: 25, cooldown: 3, effect: { bonusDmgMult: 1.4, applyPlayer: { slowResourceRegen: 2 } } }
        ] },
    { name: "Immortal Realm Sentinel", hp: 200, dmg: 22, minRealm: 6, zones: ['heartlands', 'jade'], element: 'neutral',
        enrageThreshold: 0.3,
        abilities: [
            { id: 'sentinel_strike', weight: 40, effect: { bonusDmgMult: 1.15 } },
            { id: 'immortal_guard', weight: 35, effect: { selfDefend: true, healSelfPct: 0.05, log: 'Ancient armor mends itself.' } },
            { id: 'judgment', weight: 25, cooldown: 3, telegraph: 'The sentinel invokes heavenly judgment.', effect: { bonusDmgMult: 1.5 } }
        ],
        enrageAbilities: [
            { id: 'final_verdict', weight: 100, effect: { bonusDmgMult: 1.6, extraHits: 1 } }
        ] }
];

const ENEMY_ELEMENT_ICONS = {
    ice: '❄️', fire: '🔥', earth: '🌍', water: '💧', wind: '🌪️', soul: '👻', neutral: '⚔️', blood: '🩸'
};

const ENEMY_AFFIXES = {
    armored: { label: 'Armored', hpMult: 1.2, dmgMult: 0.9, desc: 'Heavy scales resist blows.' },
    frenzied: { label: 'Frenzied', hpMult: 0.85, dmgMult: 1.25, enrageThreshold: 0.5, desc: 'Wild and reckless.' },
    frostbound: { label: 'Frostbound', hpMult: 1.05, dmgMult: 1.0, element: 'ice', zones: ['frostbite'],
        desc: 'Ice clings to every movement.',
        abilities: [{ id: 'frost_aura', weight: 100, telegraph: 'Frost crawls across the ground.', effect: { applyPlayer: { slowResourceRegen: 1 }, bonusDmgMult: 1.05 } }] },
    scorched: { label: 'Scorched', hpMult: 0.95, dmgMult: 1.15, element: 'fire', zones: ['emberwild'],
        desc: 'Heat radiates from its hide.',
        abilities: [{ id: 'ember_burst', weight: 100, effect: { bonusDmgMult: 1.1, applyPlayer: { poisonTurns: 1, poisonDmgPct: 0.03 } } }] },
    venomous: { label: 'Venomous', hpMult: 0.95, dmgMult: 1.05, zones: ['dustbone', 'emberwild'], minRealm: 1,
        desc: 'Toxin drips from every strike.',
        abilities: [{ id: 'venom_touch', weight: 100, effect: { bonusDmgMult: 1.05, applyPlayer: { poisonTurns: 2, poisonDmgPct: 0.03 } } }] },
    tidal: { label: 'Tidal', hpMult: 1.1, dmgMult: 0.95, element: 'water', zones: ['jade'],
        desc: 'Power ebbs and flows like the sea.',
        abilities: [{ id: 'tide_pull', weight: 100, telegraph: 'A wave crashes inward.', effect: { stripShieldPct: 0.35, bonusDmgMult: 1.05 } }] },
    pack_leader: { label: 'Pack Leader', hpMult: 1.0, dmgMult: 1.1, traits: ['swarm'], zones: ['frostbite', 'emberwild'],
        desc: 'Commands lesser strikes alongside its own.' }
};

// Combat pacing — enemies scale with YOUR power so fights stay relevant at every realm
const COMBAT_BALANCE = {
    realmPowerBonus: 4,
    enemyHpPerRealm: 0,
    enemyHpFromPlayerMax: 0.55,
    enemyHpFromPlayerPower: 1.8,
    enemyMinHits: 4,
    enemyDmgPerRealm: 3,
    enemyDmgFromPlayerMax: 0.028,
    enemyDmgFromPlayerPower: 0.10,
    basicAttackScale: 0.55,
    basicAttackScaleQi: 0.85,
    basicAttackScaleBody: 0.78,
    basicAttackScaleSoul: 0.55,
    techniqueScale: 1.38,
    techniqueScaleBodyHeavy: 1.48,
    techniqueDefenseDmgMult: 0.45,
    combatRegenCap: 10,
    enemyTurnDelayMs: 550
};

const COMBAT_FLEE_BALANCE = {
    baseChance: 48,
    spiritScale: 2.2,
    realmBonus: 3,
    foundationPerPct: 10,
    bodyPenalty: -6,
    qiBonus: 6,
    soulWillScale: 1.5,
    rivalBonus: 12,
    minChance: 28,
    maxChance: 85,
    failRefundPct: 0.4
};

// Qi-path: Breath is combat circulation drawn from dantian Qi (Gather restores).
const COMBAT_QI_LINK = {
    startFloorPct: 0.4,
    victoryRefundPct: 0.06,
    skipTrials: true
};

/** Minimum realm to find or comprehend Dao fragments (Dao Seeking). */
const DAO_SEEKING_REALM_IDX = 5;

const TRAINABLE_PHYSIQUES = [
    { id: 'iron_body', name: "Iron Body", pro: "+5 Vitality", con: "-2 Spirit", type: "trainable",
        bonus: { vitality: 5, spirit: -2 }, focusLayers: ['skin', 'flesh', 'bones'],
        catalystCost: { spirit_herb: 3 } },
    { id: 'spirit_veins', name: "Spirit Veins", pro: "+5 Spirit", con: "-2 Vitality", type: "trainable",
        bonus: { spirit: 5, vitality: -2 }, focusLayers: ['meridians', 'blood', 'nerves'],
        catalystCost: { rare_herb: 1 } },
    { id: 'qi_sea', name: "Qi Sea", pro: "+5 Qi", con: "-2 Will", type: "trainable",
        bonus: { qi: 5, will: -2 }, focusLayers: ['organs', 'blood'],
        catalystCost: { spirit_herb: 2, jade_inlay: 1 } },
    { id: 'war_blood', name: "War Blood", pro: "+5 Will", con: "-2 Qi", type: "trainable",
        bonus: { will: 5, qi: -2 }, focusLayers: ['flesh', 'blood'],
        catalystCost: { demon_core: 1 } },
    { id: 'balanced_heart', name: "Balanced Heart", pro: "+2 all stats", con: "None", type: "trainable",
        bonus: { qi: 2, vitality: 2, spirit: 2, will: 2 }, focusLayers: ['skin', 'organs', 'meridians'],
        catalystCost: { rare_herb: 1, spirit_herb: 2 } }
];

/** Staged physique cultivation — refine in the Body Chamber over months, not one-click unlock. */
const PHYSIQUE_CULTIVATION_BALANCE = {
    maxStages: 4,
    stageNames: ['Tempering', 'Forging', 'Perfection', 'Transcendence'],
    standardRefine: { weeks: 6, progress: 12, label: 'Standard Refinement' },
    catalystRefine: { weeks: 3, progress: 22, label: 'Catalyst Refinement' },
    bodyActionProgress: 4,
    foundationPerStage: 1,
    foundationOnComplete: 3
};

const LEGENDARY_PHYSIQUES = [
    { name: "Thunder Soul", trial: "Survive 3 tribulations", bonus: { qi: 10, will: 5, lightningResist: 50 }, effectDesc: "+10 Qi · +5 Will · +50% lightning resist", type: "legendary" },
    { name: "Void Body", trial: "Enter and escape a spatial rift", bonus: { spirit: 10, evasion: 30 }, effectDesc: "+10 Spirit · +30% evasion", type: "legendary" },
    { name: "Phoenix Blood", trial: "Find and consume a Phoenix feather", bonus: { vitality: 10, regen: 50 }, effectDesc: "+10 Vitality · +50% HP regen", type: "legendary" },
    { name: "Dragon Scale", trial: "Defeat a Dragon-kin beast alone", bonus: { vitality: 15, defense: 30 }, effectDesc: "+15 Vitality · +30% defense", type: "legendary" }
];

const EVIL_PHYSIQUES = [
    { name: "Demon Heart", pro: "+100% Qi regen", con: "-50% Spirit, corruption risk", bonus: { qiRegenMult: 2, spirit: -5 }, type: "evil" },
    { name: "Blood Soul", pro: "+100% damage", con: "-50% HP, lose control", bonus: { dmgMult: 2, hp: -30 }, type: "evil" },
    { name: "Shadow Form", pro: "+100% evasion", con: "-50% defense, weakness to light", bonus: { evasion: 50, defense: -20 }, type: "evil" }
];

const ALL_PHYSIQUES = [...TRAINABLE_PHYSIQUES, ...LEGENDARY_PHYSIQUES, ...EVIL_PHYSIQUES];

const DAO_TIER_ORDER = ['primordial', 'fundamental', 'greater', 'lesser'];

const DAO_TAXONOMY = {
    wuji: {
        id: 'wuji', name: 'Wuji', tier: 'primordial', emoji: '☯️',
        desc: 'The undifferentiated Dao — all laws return here.',
        reqRealm: 6, reqFundamentals: 2,
        effects: { daoComprehensionPct: 10, allElementMult: 1.08 }
    },

    yin_yang: {
        id: 'yin_yang', name: 'Yin-Yang Dao', tier: 'fundamental', branch: 'balance', emoji: '☯️',
        mergeFrom: ['yin', 'yang'],
        desc: 'Soft and hard creation in balance.',
        qiPct: 0.08, spiritPct: 0.08, combatDmgPct: 5, alignmentDampenPct: 25
    },
    spacetime: {
        id: 'spacetime', name: 'Spacetime Dao', tier: 'fundamental', branch: 'void', emoji: '🌌',
        mergeFrom: ['space', 'time'],
        desc: 'Distance and duration are one law.',
        exploreBonusPct: 10, combatDmgPct: 8, evasionPct: 5
    },
    samsara: {
        id: 'samsara', name: 'Samsara Dao', tier: 'fundamental', branch: 'cycle', emoji: '♾️',
        mergeFrom: ['life', 'death'],
        desc: 'Life and death cycle without end.',
        hpRegenPct: 15, foundationPerCultivate: 1, decayResistPct: 20
    },
    five_phases: {
        id: 'five_phases', name: 'Five Phases Dao', tier: 'fundamental', branch: 'elements', emoji: '🔥',
        mergeFrom: ['phase_fire', 'phase_water', 'phase_earth', 'phase_metal', 'phase_wood'],
        mergeMin: 3,
        desc: 'The elements speak as one chorus.',
        elementMult: 1.35, combatDmgPct: 6
    },
    karma: {
        id: 'karma', name: 'Karma Dao', tier: 'fundamental', branch: 'karma', emoji: '⚖️',
        mergeFrom: ['karma_debt', 'karma_grace'],
        desc: 'Cause and consequence are written in the same ink.',
        seerUnlock: true, alignmentShiftMult: 1.25, tribulationInsightPct: 15
    },

    yin:       { id: 'yin', name: 'Yin', tier: 'greater', branch: 'balance', element: 'yin', mergeTarget: 'yin_yang', spiritPct: 0.05 },
    yang:      { id: 'yang', name: 'Yang', tier: 'greater', branch: 'balance', element: 'yang', mergeTarget: 'yin_yang', qiPct: 0.05 },
    space:     { id: 'space', name: 'Space', tier: 'greater', branch: 'void', element: 'space', mergeTarget: 'spacetime', evasionPct: 3 },
    time:      { id: 'time', name: 'Time', tier: 'greater', branch: 'void', element: 'time', mergeTarget: 'spacetime', slowResistPct: 10 },
    life:      { id: 'life', name: 'Life', tier: 'greater', branch: 'cycle', element: 'life', mergeTarget: 'samsara', hpRegenPct: 8 },
    death:     { id: 'death', name: 'Death', tier: 'greater', branch: 'cycle', element: 'death', mergeTarget: 'samsara', combatDmgPct: 4 },
    phase_fire:     { id: 'phase_fire', name: 'Phase of Fire', tier: 'greater', branch: 'elements', element: 'fire', mergeTarget: 'five_phases', elementMult: 1.25, igniteChance: 0.28 },
    phase_water:    { id: 'phase_water', name: 'Phase of Water', tier: 'greater', branch: 'elements', element: 'water', mergeTarget: 'five_phases', elementMult: 1.25, freezeChance: 0.24 },
    phase_earth:    { id: 'phase_earth', name: 'Phase of Earth', tier: 'greater', branch: 'elements', element: 'earth', mergeTarget: 'five_phases', elementMult: 1.25, rootChance: 0.20 },
    phase_metal:    { id: 'phase_metal', name: 'Phase of Metal', tier: 'greater', branch: 'elements', element: 'metal', mergeTarget: 'five_phases', elementMult: 1.20, armorPenPct: 0.10 },
    phase_wood:     { id: 'phase_wood', name: 'Phase of Wood', tier: 'greater', branch: 'elements', element: 'wood', mergeTarget: 'five_phases', elementMult: 1.20, regenPct: 5 },
    karma_debt:  { id: 'karma_debt', name: 'Karma of Debt', tier: 'greater', branch: 'karma', mergeTarget: 'karma', alignmentReadPct: 10 },
    karma_grace: { id: 'karma_grace', name: 'Karma of Grace', tier: 'greater', branch: 'karma', mergeTarget: 'karma', alignmentReadPct: 10 },

    lesser_fire:      { id: 'lesser_fire', name: 'Ember Insight', tier: 'lesser', branch: 'elements', element: 'fire', progressTo: 'phase_fire', progressGrant: 25, desc: '+20% fire damage for 10 turns (temporary)' },
    lesser_water:     { id: 'lesser_water', name: 'Tide Insight', tier: 'lesser', branch: 'elements', element: 'water', progressTo: 'phase_water', progressGrant: 25 },
    lesser_wind:      { id: 'lesser_wind', name: 'Gale Insight', tier: 'lesser', branch: 'elements', element: 'wind', progressTo: 'phase_wood', progressGrant: 15, desc: 'Wind is wood in motion' },
    lesser_earth:     { id: 'lesser_earth', name: 'Stone Insight', tier: 'lesser', branch: 'elements', element: 'earth', progressTo: 'phase_earth', progressGrant: 25 },
    lesser_lightning: { id: 'lesser_lightning', name: 'Thunder Insight', tier: 'lesser', branch: 'elements', element: 'lightning', progressTo: 'phase_metal', progressGrant: 15, desc: 'Lightning is metal heaven' },
    lesser_ashen:     { id: 'lesser_ashen', name: 'Ashen Cycle Fragment', tier: 'lesser', branch: 'cycle', progressTo: 'death', progressGrant: 20, forbiddenClear: 'ashen_garden' }
};

const DAO_LEGACY_MAP = {
    'Dao of Fire': 'phase_fire', 'Dao of Water': 'phase_water', 'Dao of Wind': 'phase_wood',
    'Dao of Earth': 'phase_earth', 'Dao of Lightning': 'phase_metal',
    'Yin': 'yin', 'Yang': 'yang', 'Space': 'space', 'Time': 'time', 'Life': 'life', 'Death': 'death',
    'Yin-Yang Dao': 'yin_yang', 'Void Dao': 'spacetime', 'Cycle Dao': 'samsara'
};

const DAO_LEGACY_FRAGMENT_MAP = {
    'Dao of Fire': 'Ember Insight',
    'Dao of Water': 'Tide Insight',
    'Dao of Wind': 'Gale Insight',
    'Dao of Earth': 'Stone Insight',
    'Dao of Lightning': 'Thunder Insight',
    'Fragment of the Ashen Cycle': 'Ashen Cycle Fragment'
};

const DAO_FRAGMENT_POOL = [
    { name: 'Ember Insight', daoId: 'lesser_fire', type: 'lesser', reqRealm: 5 },
    { name: 'Tide Insight', daoId: 'lesser_water', type: 'lesser', reqRealm: 5 },
    { name: 'Gale Insight', daoId: 'lesser_wind', type: 'lesser', reqRealm: 5 },
    { name: 'Stone Insight', daoId: 'lesser_earth', type: 'lesser', reqRealm: 5 },
    { name: 'Thunder Insight', daoId: 'lesser_lightning', type: 'lesser', reqRealm: 5 },
    { name: 'Ashen Cycle Fragment', daoId: 'lesser_ashen', type: 'lesser', reqRealm: 5, forbiddenClear: 'ashen_garden' },
    { name: 'Prime Insight: Yin', daoId: 'yin', type: 'greater', reqRealm: 6, requiresGreaterCount: 2 },
    { name: 'Prime Insight: Yang', daoId: 'yang', type: 'greater', reqRealm: 6, requiresGreaterCount: 2 },
    { name: 'Prime Insight: Space', daoId: 'space', type: 'greater', reqRealm: 6, requiresGreaterCount: 2 },
    { name: 'Prime Insight: Time', daoId: 'time', type: 'greater', reqRealm: 6, requiresGreaterCount: 2 },
    { name: 'Prime Insight: Life', daoId: 'life', type: 'greater', reqRealm: 6, requiresGreaterCount: 2 },
    { name: 'Prime Insight: Death', daoId: 'death', type: 'greater', reqRealm: 6, requiresGreaterCount: 2 },
    { name: 'Karma Thread: Debt', daoId: 'karma_debt', type: 'greater', reqRealm: 6, requiresFundamental: 0 },
    { name: 'Karma Thread: Grace', daoId: 'karma_grace', type: 'greater', reqRealm: 6, requiresFundamental: 0 }
];

const DAO_COMPREHENSION_BALANCE = {
    baseProgressPerSession: 18,
    foundationScale: 1.2,
    spiritScale: 0.8,
    willScale: 0.8,
    lesserToGreaterThreshold: 100,
    greaterToFundamentalMergeMonths: 12,
    mergeQiCost: 80,
    mergeSpiritCost: 40,
    wujiReqFundamentals: 2
};

const KARMA_SEER_BALANCE = {
    lifespanMonthsCost: 6,
    minKarmaGreater: 1,
    readingCooldownMonths: 24,
    hintPool: [
        { weight: 30, type: 'tendency', text: 'A weight gathers toward {zone} — not certainty, but pull.' },
        { weight: 25, type: 'warning', text: 'Your next tribulation will test {element} — prepare inwardly.' },
        { weight: 20, type: 'opportunity', text: 'A fragment of {branch} may surface if you seek in the wilds.' },
        { weight: 15, type: 'karma', text: 'Old deeds stir — alignment may shift if you repeat recent choices.' },
        { weight: 10, type: 'vague', text: 'The thread frays. Too many paths; the reading scatters.' }
    ],
    noHardFutures: true
};

/** @deprecated — use DAO_FRAGMENT_POOL + dao-taxonomy.js */
const DAO_FRAGMENTS = DAO_FRAGMENT_POOL.map(f => {
    const def = DAO_TAXONOMY[f.daoId];
    return {
        name: f.name,
        daoId: f.daoId,
        element: def?.element || def?.branch || 'neutral',
        type: f.type === 'greater' ? 'prime' : 'false',
        reqRealm: f.reqRealm,
        desc: def?.desc || '',
        forbiddenClear: f.forbiddenClear,
        requiresTrueDaos: f.requiresGreaterCount,
        primeName: f.type === 'greater' ? def?.name : undefined
    };
});

/** @deprecated — use DAO_TAXONOMY greater element daos */
const TRUE_DAOS = [
    { name: 'Dao of Fire', element: 'fire', type: 'true', desc: '+25% fire damage permanently, can ignite enemies' },
    { name: 'Dao of Water', element: 'water', type: 'true', desc: '+25% water damage permanently, can freeze enemies' },
    { name: 'Dao of Wind', element: 'wind', type: 'true', desc: 'Wood-phase insight — wind in motion' },
    { name: 'Dao of Earth', element: 'earth', type: 'true', desc: '+25% earth damage permanently, can root enemies' },
    { name: 'Dao of Lightning', element: 'lightning', type: 'true', desc: 'Metal-phase insight — thunder from heaven' }
];

/** @deprecated — use DAO_TAXONOMY greater balance/void/cycle daos */
const PRIME_DAOS = [
    { name: 'Yin', element: 'yin', type: 'prime', desc: '+Spirit, illusion/defense', mergeWith: 'Yang', mergeResult: 'Yin-Yang Dao' },
    { name: 'Yang', element: 'yang', type: 'prime', desc: '+Qi, offense/aggression', mergeWith: 'Yin', mergeResult: 'Yin-Yang Dao' },
    { name: 'Space', element: 'space', type: 'prime', desc: 'Teleport, spatial attacks', mergeWith: 'Time', mergeResult: 'Void Dao' },
    { name: 'Time', element: 'time', type: 'prime', desc: 'Slow enemies, speed self', mergeWith: 'Space', mergeResult: 'Void Dao' },
    { name: 'Life', element: 'life', type: 'prime', desc: 'Regeneration, healing', mergeWith: 'Death', mergeResult: 'Cycle Dao' },
    { name: 'Death', element: 'death', type: 'prime', desc: 'Damage, fear, decay', mergeWith: 'Life', mergeResult: 'Cycle Dao' }
];

/** @deprecated — use DAO_TAXONOMY fundamentals */
const MERGED_DAOS = {
    'Yin-Yang Dao': { name: 'Yin-Yang Dao', pair: ['Yin', 'Yang'], id: 'yin_yang', desc: DAO_TAXONOMY.yin_yang.desc, qiPct: 0.08, spiritPct: 0.08, combatDmgPct: 5, alignmentDampenPct: 25 },
    'Void Dao': { name: 'Void Dao', pair: ['Space', 'Time'], id: 'spacetime', desc: DAO_TAXONOMY.spacetime.desc, exploreBonusPct: 10, combatDmgPct: 8, evasionPct: 5 },
    'Cycle Dao': { name: 'Cycle Dao', pair: ['Life', 'Death'], id: 'samsara', desc: DAO_TAXONOMY.samsara.desc, hpRegenPct: 15, foundationPerCultivate: 1, decayResistPct: 20 },
    'Spacetime Dao': { name: 'Spacetime Dao', pair: ['Space', 'Time'], id: 'spacetime', desc: DAO_TAXONOMY.spacetime.desc, exploreBonusPct: 10, combatDmgPct: 8, evasionPct: 5 },
    'Samsara Dao': { name: 'Samsara Dao', pair: ['Life', 'Death'], id: 'samsara', desc: DAO_TAXONOMY.samsara.desc, hpRegenPct: 15, foundationPerCultivate: 1, decayResistPct: 20 },
    'Five Phases Dao': { name: 'Five Phases Dao', id: 'five_phases', desc: DAO_TAXONOMY.five_phases.desc, elementMult: 1.35, combatDmgPct: 6 },
    'Karma Dao': { name: 'Karma Dao', pair: ['Karma of Debt', 'Karma of Grace'], id: 'karma', desc: DAO_TAXONOMY.karma.desc, alignmentShiftMult: 1.25, tribulationInsightPct: 15 }
};

const DAO_MERGE_BALANCE = {
    qiCost: DAO_COMPREHENSION_BALANCE.mergeQiCost,
    spiritCost: DAO_COMPREHENSION_BALANCE.mergeSpiritCost,
    months: DAO_COMPREHENSION_BALANCE.greaterToFundamentalMergeMonths,
    foundationBonus: 15,
    fameReward: 20
};

const DAO_BRANCH_LABELS = {
    balance: 'Balance',
    void: 'Void',
    cycle: 'Cycle',
    elements: 'Elements',
    karma: 'Karma'
};

const WEAPON_TYPES = ["Sword", "Blade", "Spear", "Fist", "Staff"];

const INTENT_TIERS = [
    { name: "Sprout", uses: 0, bonus: 0 },
    { name: "Minor Success", uses: 10, bonus: 0.1 },
    { name: "Major Success", uses: 30, bonus: 0.2 },
    { name: "Perfection", uses: 60, bonus: 0.35 },
    { name: "Intent Domain", uses: 100, bonus: 0.5 }
];

const INTENT_TRACK_BY_PATH = {
    qi: { id: 'weaponIntent', label: 'Weapon Intent', emoji: '🗡️' }
    // body/soul tracks removed — Vessel Rules and Soul Mass are separate systems.
};

const INTENT_BALANCE = {
    inactiveUseRatio: 0.5,
    dividedHeartMinStage: 1,
    dividedHeartRefinementMult: 0.92,
    deepenBonusPerPick: 0.1,
    firstAwakenMonthDiscount: 0,
    slaughterAuraHpPct: 0.30,
    slaughterAuraDmgMult: 1.18,
    returningEdgeChance: 0.15,
    returningEdgeDmgMult: 0.45,
    circulatingGuardResourcePct: 0.05,
    concussiveRhythmEvery: 3,
    penetratingLineDefendMult: 0.65
};

/** Expand picks unlock arts in order per weapon (Minor / Major / Perfection breakpoints). */
const INTENT_EXPAND_ARTS = {
    Sword: [
        { id: 'returning_edge', name: 'Returning Edge', desc: 'Basics have a chance to strike twice.' },
        { id: 'blade_pressure', name: 'Blade Pressure', desc: 'Matching techniques gain stronger weapon synergy.' },
        { id: 'edge_domain', name: 'Edge Domain', desc: 'Basics always roll Returning Edge at half strength.' }
    ],
    Blade: [
        { id: 'slaughter_aura', name: 'Slaughter Aura', desc: 'Wounded foes take more damage from your basics.' },
        { id: 'blood_scent', name: 'Blood Scent', desc: 'Flee attempts against you are less reliable.' },
        { id: 'butcher_domain', name: 'Butcher Domain', desc: 'Slaughter Aura threshold widens.' }
    ],
    Spear: [
        { id: 'penetrating_line', name: 'Penetrating Line', desc: 'Basics pierce guarded foes more effectively.' },
        { id: 'reach_advantage', name: 'Reach Advantage', desc: 'Bonus damage when the enemy is slowed or shaken.' },
        { id: 'pierce_domain', name: 'Pierce Domain', desc: 'First basic each fight ignores guard entirely.' }
    ],
    Fist: [
        { id: 'concussive_rhythm', name: 'Concussive Rhythm', desc: 'Every third basic slows the enemy.' },
        { id: 'iron_knuckle', name: 'Iron Knuckle', desc: 'Basics cost less Stamina or Breath.' },
        { id: 'press_domain', name: 'Press Domain', desc: 'Slows last one turn longer.' }
    ],
    Staff: [
        { id: 'circulating_guard', name: 'Circulating Guard', desc: 'Basics restore a sliver of combat resource.' },
        { id: 'ward_pulse', name: 'Ward Pulse', desc: 'Defending restores more barrier or resource.' },
        { id: 'sanctuary_domain', name: 'Sanctuary Domain', desc: 'Circulating Guard doubled after you defend.' }
    ]
};

const INTENT_DOMAIN_MANIFESTATIONS = {
    Sword: 'Phantom sword-forms follow your blade.',
    Blade: 'An aura of slaughter unnerves wounded foes.',
    Spear: 'Piercing intent ignores half of enemy defense.',
    Fist: 'Shockwaves ripple from every strike.',
    Staff: 'An arcane ward circulates around you.'
};

// ===== ZONE LOOT TABLES =====
const ZONE_LOOT = {
    frostbite: {
        common: [
            { name: "Frost Core", type: "material", value: 3, desc: "A core of condensed ice energy." },
            { name: "Ice Herb", type: "herb", value: 2, desc: "A frost-touched medicinal herb." },
            { name: "Glacial Shard", type: "material", value: 4, desc: "A sharp shard of ancient ice." }
        ],
        rare: [
            { name: "Frozen Manual", type: "technique", value: 15, desc: "Ice-element technique (rare).", technique: "Frostbite Palm" },
            { name: "Glacier Heart Scripture", type: "technique", value: 22, desc: "Frostbite-exclusive ice art.", technique: "Glacier Heart Palm" },
            { name: "Yeti Hide", type: "material", value: 12, desc: "Thick, frost-resistant fur." },
            { name: "Rare Spirit Herb", type: "material", value: 14, desc: "A frost-hardened herb that nourishes marrow." }
        ],
        ultra: [
            { name: "Glacial Heart", type: "legendary_material", value: 50, desc: "The frozen core of a glacier spirit." }
        ],
        techniques: ["Glacier Heart Palm", "Frostbite Palm", "Gale Spiral"]
    },
    dustbone: {
        common: [
            { name: "Sand Silk", type: "material", value: 3, desc: "Fine silk woven from desert worms." },
            { name: "Sun Stone", type: "material", value: 2, desc: "A stone that absorbs sunlight." },
            { name: "Dust Root", type: "herb", value: 2, desc: "A deep-rooted desert plant." }
        ],
        rare: [
            { name: "Ancient Relic Fragment", type: "material", value: 15, desc: "A shard of a lost civilization." },
            { name: "Sandburrow Manual", type: "technique", value: 18, desc: "Dustbone-exclusive burrowing palm art.", technique: "Sandburrow Palm" },
            { name: "Sand Serpent Scale", type: "material", value: 12, desc: "A scale from a massive sand serpent." },
            { name: "Marrow Herb", type: "material", value: 14, desc: "Root that burrows deep as bone." }
        ],
        ultra: [
            { name: "Wandering Oasis Map", type: "legendary_material", value: 50, desc: "A map that leads to a moving oasis." }
        ],
        techniques: ["Sandburrow Palm", "Sandstorm Body Art", "Bronze Skin Palm", "Earth Pulse Palm"]
    },
    heartlands: {
        common: [
            { name: "Spirit Coin", type: "currency", value: 5, desc: "Standard currency in the Heartlands." },
            { name: "Dao Essence", type: "material", value: 4, desc: "A fragment of ambient Dao energy." },
            { name: "Jade Token", type: "material", value: 3, desc: "A small jade token used in the markets." }
        ],
        rare: [
            { name: "Sect Token", type: "material", value: 15, desc: "A token that grants access to a sect library." },
            { name: "Heavenly Pill", type: "pill", pillId: "spirit_gathering", value: 20, desc: "A pill that boosts Qi permanently." },
            { name: "Celestial Judgment Scroll", type: "technique", value: 25, desc: "A scroll of heavenly light.", technique: "Celestial Judgment" },
            { name: "Void Rend Scroll", type: "technique", value: 28, desc: "A scripture on tearing rifts in space.", technique: "Void Rend" },
            { name: "Root-Vein Manual", type: "technique", value: 20, desc: "Heartlands vein-cultivation art.", technique: "Root-Vein Surge" },
            { name: "Marrow Herb", type: "material", value: 16, desc: "A rare herb that seeps into bone marrow when refined." }
        ],
        ultra: [
            { name: "Dao Insight Fragment", type: "legendary_material", value: 50, desc: "A fragment of profound Dao understanding." }
        ],
        techniques: ["Root-Vein Surge", "Void Rend", "Heavenly Palm", "Storm Needle", "Meridian Flow"]
    },
    jade: {
        common: [
            { name: "Pearl Dust", type: "material", value: 3, desc: "Ground pearls used in elixirs." },
            { name: "Seaweed Elixir", type: "pill", pillId: "blood_recovery", value: 4, desc: "A healing elixir from the deep." },
            { name: "Coral Fragment", type: "material", value: 2, desc: "A piece of spirit-infused coral." }
        ],
        rare: [
            { name: "Storm Pearl", type: "material", value: 15, desc: "A pearl charged with storm energy." },
            { name: "Maelstrom Lance Manual", type: "technique", value: 22, desc: "Jade Coast-exclusive spear art.", technique: "Maelstrom Lance" },
            { name: "Pirate Manual", type: "technique", value: 18, desc: "A waterlogged combat manual.", technique: "Soul Severing Sword" }
        ],
        ultra: [
            { name: "Dragon Scale (Sea)", type: "legendary_material", value: 50, desc: "A scale from a sea dragon." }
        ],
        techniques: ["Maelstrom Lance", "Tide Spiral", "Ghost Spear Thrust", "Phantom Blade", "Abyss Gaze"]
    },
    emberwild: {
        common: [
            { name: "Ember Berry", type: "herb", value: 3, desc: "A spicy berry that grows near lava." },
            { name: "Venom Gland", type: "material", value: 3, desc: "A gland from a venomous jungle beast." },
            { name: "Volcanic Ash", type: "material", value: 2, desc: "Ash rich in fire energy." }
        ],
        rare: [
            { name: "Obsidian Shard", type: "material", value: 15, desc: "A shard of volcanic glass." },
            { name: "Beast Fury Manual", type: "technique", value: 18, desc: "Techniques carved into obsidian.", technique: "War God's Roar" },
            { name: "Phoenix Ascent Scroll", type: "technique", value: 24, desc: "Emberwild-exclusive flame art.", technique: "Phoenix Ascent Palm" },
            { name: "Rare Spirit Herb", type: "material", value: 14, desc: "Ash-fed herb prized for marrow refinement." },
            { name: "Demon Core", type: "material", value: 18, desc: "Condensed malice from a slain demonic beast." }
        ],
        ultra: [
            { name: "Phoenix Feather", type: "legendary_material", value: 50, desc: "A feather from a legendary phoenix." }
        ],
        techniques: ["Phoenix Ascent Palm", "Raging Ember Fist", "Cinder Volley", "Viper Fang Strike", "Blood Refining Art"]
    }
};

// Exploration loot tuning — only Frostbite had a technique before; all zones now have manuals + bonus roll
const EXPLORE_BALANCE = {
    ultraChance: 0.06,
    rareChance: 0.24,
    manualFindChance: 0.12,
    methodFindChance: 0.08
};

// Vitality contributes to max HP (path-specific — body cultivators benefit most)
const VITALITY_HP_RATIO = { qi: 0.5, body: 1.2, soul: 0.35 };

// Sidebar stat explanations (tooltips + stat guide popup)
const STAT_GUIDE = {
    qi: { label: 'Qi', emoji: '⚡', desc: 'Spiritual energy in your dantian. Spent on travel, techniques, and breakthroughs. Cultivate to refill toward your max.' },
    qiDensity: { label: 'Qi Density', emoji: '💧', desc: 'How refined your Qi is. Higher density boosts technique power and is required for consolidation peaks.' },
    vitality: { label: 'Vitality', emoji: '❤️', desc: 'Physical resilience. Raises max HP (especially for body cultivators) and helps survive combat and tribulations.' },
    spirit: { label: 'Spirit', emoji: '🧠', desc: 'Mental acuity and perception. Improves explore loot, dao comprehension, and some technique effects.' },
    will: { label: 'Will', emoji: '💪', desc: 'Determination and inner strength. Helps resist demonic influence, mental attacks, and tribulation pressure.' },
    hp: { label: 'HP', emoji: '❤️', desc: 'Health points. When depleted in combat you may fall. Recuperate or use pills to recover.' },
    shield: { label: 'Shield', emoji: '🛡️', desc: 'Protective barrier absorbing damage before HP. Regenerates slowly; some techniques and gear boost it.' },
    foundation: {
        label: 'Foundation',
        emoji: '🏛️',
        desc: 'Your cultivation base is rated Crude → Firm → Unshakable → Peerless — a quality grade, not a number. Stronger foundation improves breakthrough odds, max Qi, Qi density, meridian success, tribulation survival, technique power, and perfect-breakthrough chances. Raise it by gathering and expanding in the Qi chamber, opening meridians, sealing realms at peak, refining foundation (sacrificing a technique), and special events. Cracks weaken your grade until healed.'
    },
    lifespan: { label: 'Lifespan', emoji: '🕯️', desc: 'Years you may live before your soul scatters. Cultivation extends it; running out ends the journey unless you transcend.' },
    stones: { label: 'Spirit Stones', emoji: '💎', desc: 'Currency of cultivators. Buy techniques, pills, and gear at markets; pay for sect and crafting costs.' },
    consolidation: { label: 'Consolidation', emoji: '🏛️', desc: 'At realm peak, seclude to cement your foundation before breaking through. Perfect consolidation grants lasting bonuses.' },
    scarRisk: {
        label: 'Scar Risk',
        emoji: '🩸',
        desc: 'Accumulates during tribulation choices. Higher risk means a greater chance of gaining a permanent Tribulation Scar when the trial ends — even on success. Risky options and failed trials raise it; cautious choices can lower it.'
    },
    tribulationScar: {
        label: 'Tribulation Scar',
        emoji: '🩸',
        desc: 'A permanent mark from a failed or brutal tribulation. Each scar applies lasting debuffs (lower max Qi/HP/Spirit) and sometimes a compensating boon. Scars appear under Marks on your stats panel; some can heal over decades or through special dao enlightenment.'
    }
};

// Merchant hubs (zone id → catalog key)
const MERCHANT_ZONES = ["heartlands", "jade"];

const MERCHANT_CATALOG = {
    heartlands: {
        name: "Celestial Market",
        stock: [
            { technique: "Heavenly Palm", price: 45 },
            { technique: "Earth Pulse Palm", price: 50 },
            { technique: "Meridian Flow", price: 40 },
            { technique: "Five Elements Fist", price: 90 },
            { technique: "Scorching Palm", price: 75 },
            { technique: "Tide Spiral", price: 75 },
            { technique: "Storm Needle", price: 85 },
            { technique: "Root-Vein Surge", price: 95 },
            { technique: "Wind Blade Strike", price: 100 },
            { technique: "Frostbite Palm", price: 160 },
            { technique: "Celestial Judgment", price: 220 }
        ],
        methods: [
            { methodId: 'outer_sect_qi_cycling', price: 55 },
            { methodId: 'impure_meridian_breath', price: 48 },
            { methodId: 'burning_breath_technique', price: 50 },
            { methodId: 'inner_court_meridian_cycle', price: 140 }
        ],
        formations: [
            { formationId: 'qi_stabilizer', price: 85 },
            { formationId: 'iron_wall_ward', price: 95 },
            { formationId: 'vein_seal_ward', price: 160 }
        ],
        pills: [
            { id: "spirit_gathering", price: 25, qty: 2 },
            { id: "blood_recovery", price: 40, qty: 1 },
            { id: "foundation_stabilizing", price: 90, qty: 1, reqRealm: 2 }
        ]
    },
    jade: {
        name: "Tide Merchant Guild",
        stock: [
            { technique: "Crushing Fist", price: 45 },
            { technique: "Bone Tempering Stance", price: 50 },
            { technique: "Blood Aegis", price: 85 },
            { technique: "Mountain Crash", price: 175 },
            { technique: "Bronze Skin Palm", price: 120 },
            { technique: "Soul Lash", price: 55 },
            { technique: "Quickfoot Art", price: 35 },
            { technique: "Soul Severing Sword", price: 75 },
            { technique: "Phantom Blade", price: 90 },
            { technique: "Ghost Spear Thrust", price: 95 },
            { technique: "Demon Seal", price: 130 },
            { technique: "Spirit Suppression Art", price: 140 },
            { technique: "Void Step", price: 200 },
            { technique: "Spectral Shield", price: 110 },
            { technique: "Soul Search", price: 65 }
        ],
        methods: [
            { methodId: 'outer_sect_qi_cycling', price: 50 },
            { methodId: 'impure_meridian_breath', price: 45 }
        ],
        formations: [
            { formationId: 'qi_stabilizer', price: 80 },
            { formationId: 'iron_wall_ward', price: 90 },
            { formationId: 'vein_seal_ward', price: 150 }
        ],
        pills: [
            { id: "spirit_gathering", price: 22, qty: 2 },
            { id: "soul_nourishing", price: 45, qty: 1 },
            { id: "meridian_soothing", price: 55, qty: 1, reqRealm: 1 }
        ]
    }
};

// ===== NPCs =====
const NPCS = {
    wei_collector: {
        id: 'wei_collector',
        name: 'Wei the Collector',
        emoji: '🧳',
        title: 'Rumor Broker',
        personalities: ['cunning', 'charming'],
        strengthRealm: 5,
        occupation: 'Merchant & rumor broker',
        homeZone: 'heartlands',
        wanderZones: ['jade', 'dustbone', 'emberwild', 'frostbite'],
        greet: "I've traveled the Azure Sky Continent for two hundred years. I've seen things you wouldn't believe.",
        alignmentSweetSpot: { min: -29, max: 100 },
        alignmentColdBelow: -30,
        priceMult: { harmony: 0.88, favored: 0.92, neutral: 1.0, dissonant: 1.12, rebellious: 1.25 },
        rumorCost: { months: 2, stones: 8 },
        rumorCostCold: { months: 2, stones: 15 },
        talkWarm: [
            'Your qi flows cleanly. The markets whisper good things.',
            'Between us — the Heartlands hide more than sect elders admit.',
            'Bring me rare finds from the wastes. I pay fair coin to those the Dao favors.'
        ],
        talkNeutral: [
            'Coin speaks louder than cultivation here.',
            'I trade in rumors as much as herbs. Both spoil if you sit on them.',
            'Every forbidden place on this continent has a price — usually paid in silence.'
        ],
        talkCold: [
            'The heavens mark you as out of step. My prices reflect that.',
            'I still trade with you — but I keep one hand on my knife.',
            'Fix your relationship with the Dao before the world fixes it for you.'
        ],
        fameGreet: {
            low: 'Unknown face. Show me your stones.',
            mid: 'Word of {name} reaches even wandering merchants.',
            high: 'Even hermits know the name {name}. What do you need?'
        },
        stock: [
            { id: 'wei_herb_frost', type: 'inventory', items: ['Ice Herb', 'Ice Herb'], price: 22, label: 'Twin Frost Herbs', desc: 'Cold qi medicine from the wastes.' },
            { id: 'wei_herb_dust', type: 'inventory', items: ['Dust Root', 'Sun Stone'], price: 20, label: 'Desert Reagent Pack', desc: 'Dustbone curios for alchemists.' },
            { id: 'wei_material_shard', type: 'legendary_material', item: 'Glacial Shard', price: 75, reqRealm: 1, label: 'Glacial Shard', desc: 'Refinable legendary material.' },
            { id: 'wei_dao_frag', type: 'dao_fragment', price: 95, reqRealm: 5, label: 'Sealed Dao Fragment', desc: 'A false Dao insight in jade seals.' },
            { id: 'wei_pill_foundation', type: 'pill', pillId: 'foundation_stabilizing', qty: 1, price: 165, reqRealm: 2, label: 'Foundation Stabilizing Pill', desc: 'Premium breakthrough prep — rare even in the Heartlands.' },
            { id: 'wei_pill_scar', type: 'pill', pillId: 'scar_salve', qty: 1, price: 420, reqRealm: 3, oneTime: true, label: 'Scar-Salve Pill', desc: 'Legendary elixir that dissolves a tribulation scar.' },
            { id: 'wei_artifact_insight', type: 'inventory', items: ['Dao Insight Fragment'], price: 240, reqRealm: 3, oneTime: true, label: 'Dao Insight Fragment', desc: 'Profound understanding sealed in jade — refiners pay fortunes.' },
            { id: 'wei_artifact_lens', type: 'legendary_material', item: 'Celestial Lens', price: 340, reqRealm: 4, oneTime: true, label: 'Celestial Lens', desc: 'Observatory-grade artifact. The heavens recognize honest cultivators.' },
            { id: 'wei_tech_mirror', type: 'technique', technique: 'Mirror Step', price: 280, reqRealm: 2, oneTime: true, label: 'Mirror Step Manual', desc: 'Legendary reflection strike.' }
        ],
        memoryLines: {
            returnLong: 'We have not crossed paths in {duration}. The jianghu moves whether you do or not.',
            returnShort: 'Back so soon? The road must be treating you well.',
            repeatBuyer: 'You know how to spend coin on worthy curios. My finest stock awaits.',
            rumorHunter: 'You collect secrets like other men collect debts. I respect that.',
            familiar: 'Ah, {name}. Our dealings grow familiar — that is rare in two hundred years.'
        }
    },
    elder_hua: {
        id: 'elder_hua',
        name: 'Elder Hua',
        emoji: '📿',
        title: 'Guardian of the Celestial Observatory',
        personalities: ['wise', 'zealous'],
        strengthRealm: 6,
        occupation: 'Observatory guardian & lorekeeper',
        implemented: true,
        guardianGround: 'celestial_observatory',
        homeZone: 'heartlands',
        reqRealm: 2,
        alignmentMinWarm: 30,
        greet: 'The Dao is not a path. It is the destination. You have arrived.',
        greetObservatory: 'The tower watches all who climb. I merely read what it writes.',
        alignmentColdBelow: -29,
        talkWarm: [
            'The stars do not judge. They only record.',
            'Answer honestly under open sky, and the heavens may answer back.',
            'Every cultivator is a constellation unfinished.'
        ],
        talkNeutral: [
            'Sit. Listen. The wind carries more than noise.',
            'A riddle answered in haste is a lesson wasted.',
            'The Observatory asks what you dare not ask yourself.'
        ],
        talkCold: [
            'Your steps fall out of rhythm. The tower feels it.',
            'I will speak with you — but do not expect the stars to lie on your behalf.',
            'Harmony is not morality. It is honesty with the natural order.'
        ],
        fameGreet: {
            low: 'A stranger at the stair. The stars already know your name — do you?',
            mid: '{name}. Fame is a lantern — it shows the path, but also the shadows.',
            high: 'Even the heavens speak of {name}. The Observatory has been expecting you.'
        },
        starLore: [
            'The tower was raised before the first sect drew breath. It does not test power — it tests truth.',
            'Three truths unlock the stair: rumor, fragment, resonance. You know this already.',
            'Those who lie under open sky accumulate scrutiny. The stars are patient witnesses.'
        ],
        tests: [
            {
                id: 'empty_mind',
                riddle: 'What is full when it is empty, and empty when it is full?',
                choices: [
                    { label: 'A cultivator\'s dantian at breakthrough', correct: false, failLog: 'Elder Hua shakes his head. "Power is not the answer."' },
                    { label: 'The mind before thought arises', correct: true, log: 'Elder Hua smiles. "Before desire, the Dao is already complete."' },
                    { label: 'A market purse after spending', correct: false, failLog: '"Coin comes and goes. The Dao does not trade in stones."' }
                ]
            },
            {
                id: 'river_mountain',
                riddle: 'The river flows. The mountain stands. Which moves?',
                choices: [
                    { label: 'The river — it is never still', correct: false, failLog: '"Change is visible. That does not make it the whole truth."' },
                    { label: 'Both — and neither', correct: true, log: 'Elder Hua nods. "Form shifts. Stillness also moves. You see."' },
                    { label: 'Neither — only the observer moves', correct: false, failLog: '"Clever. But the heavens are not a trick of perspective alone."' }
                ]
            },
            {
                id: 'destination',
                riddle: 'If the Dao is the destination, why do we walk?',
                choices: [
                    { label: 'To grow strong enough to arrive', correct: false, failLog: '"Strength is a vessel, not the shore."' },
                    { label: 'Because we have already arrived — and forgotten', correct: true, log: 'Silence stretches. "Then remember. That is cultivation."' },
                    { label: 'Because the path is the punishment', correct: false, failLog: '"The Dao does not punish. It reveals."' }
                ]
            }
        ]
    },
    liang_chen: {
        id: 'liang_chen',
        name: 'Liang Chen',
        emoji: '⚔️',
        title: 'Ambitious Rival',
        personalities: ['ambitious', 'proud'],
        strengthScalesWithPlayer: true,
        strengthRealm: 1,
        occupation: 'Rival cultivator',
        implemented: true,
        storyArc: 'liang_chen_rival',
        homeZone: 'dustbone',
        zones: ['dustbone', 'jade', 'emberwild', 'heartlands'],
        reqRealm: 1,
        greet: "You think you're the only one climbing the peaks? I've been watching you.",
        talkWarm: [
            'The jianghu is wide enough for two rising stars — if we do not destroy each other first.',
            'Your foundation is solid. I respect that. Do not make me regret saying so.',
            'Perhaps the Dao wants us to sharpen each other like whetstones.'
        ],
        talkNeutral: [
            'Every breakthrough you make, I feel in my bones. We are tied somehow.',
            'Sect elders speak of "rival fate." I used to think it was superstition.',
            'Meet me where the world is dangerous. That is where cultivators prove themselves.'
        ],
        talkCold: [
            'Your alignment stinks of compromise. I will not walk beside that.',
            'One day we will settle this with blades. I look forward to it.',
            'Do not mistake my patience for friendship.'
        ],
        memoryLines: {
            returnShort: 'Back again? The peaks have not grown any shorter.',
            familiar: '{name}. Our paths cross too often for coincidence.'
        }
    },
    merchant_su: {
        id: 'merchant_su',
        name: 'Merchant Su',
        emoji: '🐫',
        title: 'Caravan Master',
        personalities: ['cunning', 'honorable'],
        strengthRealm: 0,
        occupation: 'Desert caravan leader',
        implemented: true,
        storyArc: 'dustbone_caravan',
        homeZone: 'dustbone',
        zones: ['dustbone'],
        reqRealm: 0,
        greet: 'Traveler — my caravan leaves for the Heartlands at dawn. The dunes are kinder in numbers.',
        talkWarm: [
            'Bandits fear cultivators. Demonic beasts do not. I need a guardian, not a guide.',
            'Pay is modest, but my gratitude lasts longer than stones.',
            'The Heartlands market pays triple what Dustbone offers.'
        ],
        talkNeutral: [
            'Every season someone vanishes on this route. I would prefer it not be my people.',
            'I carry silk, salt, and sealed herbs. All of it attracts trouble.',
            'You look capable. That is either a compliment or a warning.'
        ],
        talkCold: [
            'I trade with everyone — but I remember who steals when the sand turns red.',
            'If you seek easy coin without risk, look elsewhere.',
            'The desert does not forgive cowards or bandits.'
        ]
    },
    wei_ling: {
        id: 'wei_ling',
        name: 'Wei Ling',
        emoji: '🌸',
        title: 'Anxious Outer Disciple',
        personalities: ['loyal', 'honorable'],
        strengthRealm: 1,
        occupation: 'Disciple of the Verdant Tide Sect',
        implemented: true,
        storyArc: 'lost_disciple',
        homeZone: 'jade',
        zones: ['jade'],
        reqRealm: 0,
        greet: 'Forgive my intrusion — I have nowhere else to turn. My master ventured into the Emberwild weeks ago and never returned.',
        talkWarm: [
            'Every night I dream of smoke in the jungle. Something is wrong with his qi signature.',
            'The sect elders say he abandoned his post. I refuse to believe it.',
            'If you help me, I will remember your name when the jianghu speaks of you.'
        ],
        talkNeutral: [
            'Master Zhong taught me my first breathing form. I owe him everything.',
            'The Emberwild devours cultivators who lose their way. Please — be careful.',
            'I cannot enter the jungle alone. My realm is too low.'
        ],
        talkCold: [
            'You carry a disharmony the sect would notice. Still… I have no other choice.',
            'If you refuse, I will go myself, though it may kill me.',
            'The Dao tests us through those we love. I understand that now.'
        ],
        memoryLines: {
            returnShort: 'You returned. Did you find any sign of him?',
            familiar: '{name}, you are the only cultivator who listened when the sect would not.'
        }
    }
};

// ===== STORY QUESTS & ARCS =====
const QUEST_TYPES = {
    fetch: { label: 'Fetch', emoji: '📦' },
    kill: { label: 'Slay', emoji: '⚔️' },
    escort: { label: 'Escort', emoji: '🛡️' },
    investigation: { label: 'Investigation', emoji: '🔍' },
    rival: { label: 'Rival', emoji: '🗡️' },
    philosophical: { label: 'Philosophical', emoji: '☯️' },
    legacy: { label: 'Legacy', emoji: '📜' }
};

const STORY_ARC_BOSSES = {
    master_zhong: {
        id: 'master_zhong',
        name: 'Master Zhong (Corrupted)',
        emoji: '👹',
        realmIdx: 1,
        hpMult: 1.05,
        dmgMult: 1.0,
        intro: 'A figure lurches from the volcanic mist — robes scorched, eyes blank with demonic qi. "Ling…?" he rasps, then screams and attacks.',
        victoryLog: 'Master Zhong collapses, corruption flickering like dying embers.'
    },
    caravan_demon: {
        id: 'caravan_demon',
        name: 'Sand Devourer',
        emoji: '😈',
        realmIdx: 1,
        hpMult: 1.0,
        dmgMult: 0.95,
        intro: 'Demonic qi erupts from the dunes! A Sand Devourer lunges at Merchant Su\'s caravan while you travel.',
        victoryLog: 'The beast dissolves into ash. Merchant Su lives — for now.'
    },
    liang_chen_duel: {
        id: 'liang_chen_duel',
        name: 'Liang Chen',
        emoji: '⚔️',
        realmIdx: null,
        scalesWithPlayer: true,
        hpMult: 1.08,
        dmgMult: 1.05,
        intro: 'Liang Chen draws his blade. "No more words. The Dao will pick the stronger cultivator."',
        victoryLog: 'Liang Chen sheathes his weapon, breathing hard. "Not bad. Not bad at all."'
    },
    lineage_usurper: {
        id: 'lineage_usurper',
        name: 'Usurper of the Jade Seal',
        emoji: '🏴',
        realmIdx: 1,
        hpMult: 1.1,
        dmgMult: 1.05,
        intro: 'A cultivator in stolen clan regalia blocks the pier. "Your name died with your ancestors. Leave — or be forgotten again."',
        victoryLog: 'The usurper falls. The jade seal burns warm against your palm — yours again.'
    }
};

const STORY_ARC_CLUES = {
    lost_disciple_bloodied_robe: {
        id: 'lost_disciple_bloodied_robe',
        arcId: 'lost_disciple',
        name: 'Bloodied Sect Robe',
        desc: 'Verdant Tide embroidery — torn and stained with volcanic ash.',
        zone: 'emberwild'
    },
    lost_disciple_obsidian_shard: {
        id: 'lost_disciple_obsidian_shard',
        arcId: 'lost_disciple',
        name: 'Scorched Obsidian Shard',
        desc: 'Still warm. Master Zhong\'s qi signature clings to the glass.',
        zone: 'emberwild'
    },
    lost_disciple_herb_trail: {
        id: 'lost_disciple_herb_trail',
        arcId: 'lost_disciple',
        name: 'Crushed Ember Berries',
        desc: 'A trail of deliberately dropped herbs — someone wanted to be followed.',
        zone: 'emberwild'
    }
};

const STORY_ARCS = {
    lost_disciple: {
        id: 'lost_disciple',
        title: 'The Lost Disciple',
        questType: 'legacy',
        giverId: 'wei_ling',
        giverName: 'Wei Ling',
        startZone: 'jade',
        reqRealm: 0,
        stages: {
            1: {
                key: 'hook',
                name: 'The Hook',
                objective: 'Speak with Wei Ling in the Jade Tide Archipelago and accept her plea.',
                zoneHint: 'jade'
            },
            2: {
                key: 'investigation',
                name: 'The Investigation',
                objective: 'Explore the Emberwild Jungle and gather 2 clues about Master Zhong.',
                zoneHint: 'emberwild',
                cluesRequired: 2,
                clueIds: ['lost_disciple_bloodied_robe', 'lost_disciple_obsidian_shard', 'lost_disciple_herb_trail']
            },
            3: {
                key: 'confrontation',
                name: 'The Confrontation',
                objective: 'Face the corrupted Master Zhong in the Emberwild Jungle.',
                zoneHint: 'emberwild',
                bossId: 'master_zhong'
            },
            4: {
                key: 'resolution',
                name: 'The Resolution',
                objective: 'Decide Master Zhong\'s fate — and Wei Ling\'s future.',
                zoneHint: 'jade'
            }
        },
        resolutionChoices: [
            {
                id: 'purify',
                label: 'Purify his corruption with righteous qi',
                desc: 'Risk your meridians to burn out the demonic taint. (+Alignment, Wei Ling becomes ally)',
                requiresAlignment: 0,
                alignmentShift: 10,
                fate: 'ally',
                log: 'You channel pure qi into Master Zhong until the corruption screams away. He weeps. Wei Ling bows to you in gratitude.'
            },
            {
                id: 'mercy',
                label: 'Grant a merciful death',
                desc: 'End his suffering cleanly. (Neutral alignment, mixed outcome)',
                alignmentShift: -2,
                fate: 'grieving_ally',
                log: 'Master Zhong\'s eyes clear for a heartbeat. "Thank you," he whispers — then stillness. Wei Ling mourns, but does not blame you.'
            },
            {
                id: 'execute',
                label: 'Slay the corrupted master without hesitation',
                desc: 'He is beyond saving. (−Alignment, Wei Ling becomes rival)',
                alignmentShift: -10,
                fate: 'rival',
                log: 'Your strike is final. Wei Ling screams your name — grief hardening into hatred.'
            }
        ],
        rewards: {
            stage2: { foundation: 2 },
            stage3: { foundation: 3, fame: 5 },
            complete: { fame: 12, foundation: 5 },
            ally: { fame: 8, foundation: 4, technique: 'Gentle Repression' },
            rival: { fame: 3 }
        }
    },
    forgotten_heir: {
        id: 'forgotten_heir',
        title: 'Echoes of a Fallen Lineage',
        questType: 'legacy',
        traitOnly: 'forgotten_heir',
        giverId: null,
        giverName: 'Your Bloodline',
        startZone: 'dustbone',
        reqRealm: 0,
        stages: {
            1: {
                key: 'hook',
                name: 'Sealed Memory',
                objective: 'Explore the Dustbone Desert — a jade slip stirs in your qi sea.',
                zoneHint: 'dustbone'
            },
            2: {
                key: 'investigation',
                name: 'Heirloom Trail',
                objective: 'Explore the Frostbite Wastes to recover a clan heirloom.',
                zoneHint: 'frostbite'
            },
            3: {
                key: 'confrontation',
                name: 'The Usurper',
                objective: 'Confront the rival who stole your lineage seal in the Jade Tide Archipelago.',
                zoneHint: 'jade',
                bossId: 'lineage_usurper'
            },
            4: {
                key: 'resolution',
                name: 'Restored Name',
                objective: 'Decide what your reclaimed lineage means for the jianghu.',
                zoneHint: 'dustbone'
            }
        },
        resolutionChoices: [
            {
                id: 'restore_honor',
                label: 'Restore your clan\'s public honor',
                desc: '+Fame, +Respect, modest Renown',
                alignmentShift: 8,
                fate: 'honored',
                log: 'You proclaim your true name in the jianghu. Old debts are paid — new allies take notice.'
            },
            {
                id: 'shadow_heir',
                label: 'Rule from the shadows',
                desc: '+Stones, +Fear, hidden influence',
                alignmentShift: -5,
                fate: 'shadow',
                log: 'You reclaim the seal but keep your name buried. Power flows through whispers, not banners.'
            },
            {
                id: 'bury_past',
                label: 'Bury the past and walk free',
                desc: '+Foundation, +Will, no lineage bonus',
                alignmentShift: 0,
                fate: 'free',
                log: 'You destroy the seal. The weight of ancestry lifts — you are only yourself now.'
            }
        ],
        rewards: {
            stage2: { foundation: 2, stones: 8 },
            stage3: { foundation: 3, fame: 4 },
            complete: { fame: 10, foundation: 5 },
            honored: { fame: 12, foundation: 4 },
            shadow: { stones: 35, fame: 3 },
            free: { foundation: 8, will: 2 }
        }
    },
    dustbone_caravan: {
        id: 'dustbone_caravan',
        title: 'Caravan of the Dunes',
        questType: 'escort',
        giverId: 'merchant_su',
        giverName: 'Merchant Su',
        startZone: 'dustbone',
        reqRealm: 0,
        stages: {
            1: { key: 'hook', name: 'The Hook', objective: 'Accept Merchant Su\'s escort contract in Dustbone Desert.', zoneHint: 'dustbone' },
            2: { key: 'escort', name: 'The Road', objective: 'Travel to the Heavenly Heartlands while escorting the caravan.', zoneHint: 'heartlands' },
            3: { key: 'confrontation', name: 'The Ambush', objective: 'Defend the caravan from the demonic ambush on the route.', zoneHint: 'heartlands', bossId: 'caravan_demon' },
            4: { key: 'resolution', name: 'The Resolution', objective: 'Decide whether to honor the contract or seize the caravan\'s goods.', zoneHint: 'heartlands' }
        },
        resolutionChoices: [
            { id: 'protect', label: 'Honor the contract', desc: '+Alignment, merchant discount, +Fame', alignmentShift: 8, fate: 'ally', log: 'Merchant Su clasp your forearm. "The jianghu needs more cultivators like you."' },
            { id: 'betray', label: 'Seize the caravan goods', desc: 'Large stone reward, −Alignment, Su becomes hostile', alignmentShift: -15, fate: 'enemy', log: 'You take the silk and salt. Su escapes with curses on his lips — and a price on your head.' }
        ],
        rewards: {
            stage3: { fame: 4, foundation: 2 },
            complete: { fame: 8, foundation: 3 },
            ally: { fame: 5, stones: 10 },
            enemy: { stones: 45 }
        }
    },
    observatory_shard: {
        id: 'observatory_shard',
        title: 'Shard of the Observatory',
        questType: 'fetch',
        giverId: 'elder_hua',
        giverName: 'Elder Hua',
        startZone: 'heartlands',
        reqRealm: 2,
        requiresHua: true,
        stages: {
            1: { key: 'hook', name: 'The Request', objective: 'Speak with Elder Hua and accept the shard retrieval.', zoneHint: 'heartlands' },
            2: { key: 'delve', name: 'The Delve', objective: 'Clear the Celestial Observatory forbidden ground.', zoneHint: 'heartlands', forbiddenId: 'celestial_observatory' },
            3: { key: 'return', name: 'The Return', objective: 'Bring the Observatory Shard to Elder Hua.', zoneHint: 'heartlands' },
            4: { key: 'reward', name: 'Star-Touched', objective: 'Receive Elder Hua\'s blessing.', zoneHint: 'heartlands' }
        },
        rewards: {
            stage2: { foundation: 4 },
            complete: { fame: 10, foundation: 6, alignment: 5 },
            finish: { technique: 'Mirror Step', forbiddenClueBonus: true }
        }
    },
    liang_chen_rival: {
        id: 'liang_chen_rival',
        title: 'Rival\'s Ascent',
        questType: 'rival',
        giverId: 'liang_chen',
        giverName: 'Liang Chen',
        startZone: 'dustbone',
        reqRealm: 1,
        stages: {
            1: { key: 'hook', name: 'The Challenge', objective: 'Meet Liang Chen and accept his rivalry.', zoneHint: 'dustbone' },
            2: { key: 'debate', name: 'The Debate', objective: 'Answer Liang Chen\'s philosophical challenge.', zoneHint: 'jade' },
            3: { key: 'delve', name: 'The Delve', objective: 'Clear any forbidden ground together — or duel if you refuse.', zoneHint: 'dustbone', bossId: 'liang_chen_duel' },
            4: { key: 'resolution', name: 'The Verdict', objective: 'Invite Liang Chen to your sect or make a permanent enemy.', zoneHint: 'heartlands' }
        },
        debate: {
            riddle: 'Two cultivators climb the same mountain. One helps the other when they fall. Is that weakness or the Dao?',
            choices: [
                { label: 'Weakness — the strong walk alone', correct: false, alignmentShift: -3, log: 'Liang Chen scoffs. "Then you will die alone."' },
                { label: 'The Dao — strength without purpose is hollow', correct: true, alignmentShift: 5, log: 'Liang Chen pauses. "...Perhaps we are not so different."' },
                { label: 'Neither — it depends on the mountain', correct: false, alignmentShift: 2, log: 'Liang Chen shrugs. "Evading the question is its own answer."' }
            ]
        },
        resolutionChoices: [
            { id: 'recruit', label: 'Invite Liang Chen to your sect', desc: 'Named disciple, +Fame, rival becomes ally', alignmentShift: 5, fate: 'ally', log: 'Liang Chen kneels. "Your sect will rise — or we fall together."' },
            { id: 'rival', label: 'Reject his companionship', desc: 'Permanent rival — duels in the jianghu', alignmentShift: -3, fate: 'rival', log: 'Liang Chen smiles coldly. "Good. I prefer worthy enemies to false friends."' }
        ],
        rewards: {
            stage2: { foundation: 3 },
            stage3: { fame: 6, foundation: 4 },
            complete: { fame: 10, foundation: 5 },
            ally: { fame: 8 },
            rival: { fame: 4 }
        }
    },
    demonic_redemption: {
        id: 'demonic_redemption',
        title: 'Path of the Prodigy',
        questType: 'philosophical',
        giverId: null,
        giverName: 'Demonic Talent',
        startZone: null,
        reqRealm: 1,
        dynamic: true,
        stages: {
            1: { key: 'bargain', name: 'Dark Pact', objective: 'Strike a bargain with a Demonic Talent.', zoneHint: null },
            2: { key: 'escort', name: 'The Escort', objective: 'Travel with them to a forbidden zone without attacking.', zoneHint: null },
            3: { key: 'choice', name: 'The Crossroads', objective: 'Choose redemption or damnation.', zoneHint: null },
            4: { key: 'fate', name: 'Their Fate', objective: 'Outcome decided.', zoneHint: null }
        },
        resolutionChoices: [
            { id: 'redeem', label: 'Guide them back toward the righteous path', desc: '+Alignment, recruit as disciple', alignmentShift: 12, fate: 'disciple', log: 'The demonic qi recedes like a tide. They bow — not to heaven, but to the path you showed.' },
            { id: 'exploit', label: 'Use them, then cast them aside', desc: 'Stones + technique, −Alignment', alignmentShift: -12, fate: 'enemy', log: 'You take what you need. Their eyes promise revenge.' }
        ],
        rewards: {
            complete: { foundation: 4 },
            disciple: { fame: 6, foundation: 5 },
            enemy: { stones: 30, fame: 2 }
        }
    }
};

const LEGACY_QUEST_CHAIN = {
    requiredCount: 3,
    countArcIds: ['lost_disciple', 'dustbone_caravan', 'observatory_shard', 'liang_chen_rival'],
    reward: {
        fame: 15,
        foundation: 10,
        technique: 'Celestial Judgment',
        forbiddenClueBonus: true,
        log: 'Three saga-length quests completed — the heavens acknowledge your chronicle. Forbidden clues find you more readily.'
    }
};

const SECT_QUEST_DEFINITIONS = {
    tribulation_support: {
        id: 'tribulation_support',
        questType: 'legacy',
        title: 'Tribulation Support',
        emoji: '⚡',
        description: 'Disciples prepare ritual arrays and spirit incense to bolster the leader through heavenly tribulation.',
        objective: 'Launch the rite, then survive your next tribulation.',
        minStage: 'established',
        minDisciples: 2,
        months: 3,
        stonesCost: 20,
        completeOn: 'tribulation_pass',
        fame: 4,
        foundation: 3,
        stones: 15,
        renown: 5,
        respect: 2,
        weight: 0.9
    },
    resource_expedition: {
        id: 'resource_expedition',
        questType: 'fetch',
        title: 'Resource Expedition',
        emoji: '📦',
        description: 'Send disciples to gather ore, herbs, and spirit stones from the wilds.',
        objective: 'A month-long expedition to stock the sect vaults.',
        minStage: 'founding',
        minDisciples: 2,
        months: 5,
        stonesCost: 10,
        completeOn: 'manual',
        fame: 3,
        foundation: 2,
        stones: 25,
        renown: 3,
        materials: { spirit_herb: 3, iron_ore: 2 },
        weight: 1.1
    },
    rival_disruption: {
        id: 'rival_disruption',
        questType: 'rival',
        title: 'Rival Disruption',
        emoji: '🗡️',
        description: 'Strike at a hostile sect\'s supply lines before they gather strength.',
        objective: 'Launch the mission, then complete a successful raid on a hostile sect.',
        minStage: 'established',
        minDisciples: 2,
        requiresHostileRival: true,
        months: 4,
        stonesCost: 8,
        completeOn: 'raid',
        fame: 5,
        foundation: 2,
        stones: 18,
        renown: 6,
        fear: 2,
        weight: 0.85
    },
    beast_hunt: {
        id: 'beast_hunt',
        questType: 'kill',
        title: 'Beast Hunt',
        emoji: '🐯',
        description: 'A spirit beast threatens villages under your influence — disciples hunt it down.',
        objective: 'Launch the hunt, then win any combat while the quest is active.',
        minStage: 'founding',
        minDisciples: 1,
        months: 3,
        completeOn: 'combat',
        fame: 4,
        foundation: 2,
        stones: 14,
        renown: 3,
        materials: { demon_core: 1 },
        weight: 1
    },
    diplomatic_mission: {
        id: 'diplomatic_mission',
        questType: 'investigation',
        title: 'Diplomatic Mission',
        emoji: '🕊️',
        description: 'Envoys seek trade terms or a pact with another sect on the jianghu map.',
        objective: 'Launch envoys, then complete any diplomacy action on a world sect.',
        minStage: 'established',
        minDisciples: 1,
        requiresWorldSect: true,
        months: 4,
        stonesCost: 12,
        completeOn: 'diplomacy',
        fame: 3,
        foundation: 1,
        stones: 20,
        renown: 4,
        respect: 4,
        weight: 0.95
    },
    heritage_quest: {
        id: 'heritage_quest',
        questType: 'legacy',
        title: 'Heritage Quest',
        emoji: '📜',
        description: 'Honor the lineage — disciples retracing the deeds of past leaders.',
        objective: 'Hold a heritage rite (requires Generation 2+ or an enshrined heirloom).',
        minStage: 'founding',
        minGeneration: 2,
        minHeirlooms: 1,
        months: 6,
        stonesCost: 25,
        completeOn: 'manual',
        fame: 5,
        foundation: 5,
        stones: 10,
        renown: 6,
        respect: 3,
        weight: 0.7
    },
    sealed_site_survey: {
        id: 'sealed_site_survey',
        questType: 'investigation',
        title: 'Sealed Site Survey',
        emoji: '🔒',
        description: 'Disciples comb archives and wilds for rumors of pre-heaven sealed realms.',
        objective: 'Launch the survey, then explore any zone while the quest is active.',
        minStage: 'founding',
        minDisciples: 1,
        months: 4,
        stonesCost: 8,
        completeOn: 'explore',
        fame: 3,
        foundation: 2,
        stones: 12,
        renown: 4,
        grantZoneAncientClue: true,
        weight: 0.75
    }
};

const SECT_QUEST_BALANCE = {
    maxActive: 3,
    tickMonths: 24,
    randomChanceBase: 0.35,
    deadlineMonths: 48
};

const SECT_QUEST_POOL = Object.values(SECT_QUEST_DEFINITIONS);

const WORLD_EVENT_TEMPLATES = {
    wei_rumor_frostbite: {
        id: 'wei_rumor_frostbite',
        title: 'Wei\'s Frostbite Lead',
        questType: 'investigation',
        objective: 'Investigate Wei\'s rumor in the Frostbite Wastes within 24 months.',
        zone: 'frostbite',
        deadlineMonths: 24,
        giverName: 'Wei the Collector',
        rewards: { fame: 5, foundation: 3, stones: 15, alignment: 2, ancientClue: 'frost_sun_never_rises' }
    },
    wei_rumor_emberwild: {
        id: 'wei_rumor_emberwild',
        title: 'Wei\'s Emberwild Tip',
        questType: 'investigation',
        objective: 'Explore Emberwild after Wei\'s tip — within 24 months.',
        zone: 'emberwild',
        deadlineMonths: 24,
        giverName: 'Wei the Collector',
        rewards: { fame: 4, foundation: 2, stones: 12, alignment: 2, ancientClue: 'ember_ash_heart' }
    },
    wei_rumor_dustbone: {
        id: 'wei_rumor_dustbone',
        title: 'Wei\'s Desert Secret',
        questType: 'fetch',
        objective: 'Find a rare curio in Dustbone within 24 months.',
        zone: 'dustbone',
        deadlineMonths: 24,
        giverName: 'Wei the Collector',
        rewards: { fame: 4, foundation: 2, stones: 18, ancientClue: 'dune_whisper' }
    }
};

const NPC_DISPOSITION = {
    harmony: { label: 'Warm', emoji: '🌿' },
    favored: { label: 'Friendly', emoji: '🙂' },
    neutral: { label: 'Neutral', emoji: '😐' },
    dissonant: { label: 'Wary', emoji: '😒' },
    rebellious: { label: 'Cold', emoji: '😠' }
};

const NPC_BALANCE = {
    wanderRerollChance: 0.15,
    weiWanderIntervalMin: 18,
    weiWanderIntervalMax: 36,
    weiBackgroundLogChance: 0.7,
    rumorAlignmentHelp: 2,
    huaTestAlignment: 5,
    huaTestFoundation: 2,
    huaStarLoreAlignment: 2,
    familiarityPerTalk: 1,
    familiarityPerTrade: 2,
    familiarityPerRumor: 3,
    familiarityPerTest: 4
};

// ===== NPC ECOSYSTEM (roles, growth, world population) =====
const NPC_ROLES = {
    villager: {
        id: 'villager',
        label: 'Villager',
        emoji: '🌾',
        occupation: 'Mortal villager',
        cultivator: false,
        startRealmMin: 0,
        startRealmMax: 0,
        maxRealm: 0,
        growthRate: 0,
        breakthroughChance: 0,
        lifespanYears: 75
    },
    disciple: {
        id: 'disciple',
        label: 'Disciple',
        emoji: '📿',
        occupation: 'Sect disciple',
        startRealmMin: 0,
        startRealmMax: 1,
        maxRealm: 2,
        growthRate: 0.7,
        breakthroughChance: 0.32,
        lifespanUsesRealm: true
    },
    wanderer: {
        id: 'wanderer',
        label: 'Wanderer',
        emoji: '🧭',
        occupation: 'Roving cultivator',
        startRealmMin: 0,
        startRealmMax: 2,
        maxRealm: 3,
        growthRate: 1.0,
        breakthroughChance: 0.26,
        canWander: true,
        lifespanUsesRealm: true
    },
    hermit: {
        id: 'hermit',
        label: 'Hermit',
        emoji: '🏔️',
        occupation: 'Reclusive hermit',
        startRealmMin: 1,
        startRealmMax: 2,
        maxRealm: 3,
        growthRate: 0.55,
        breakthroughChance: 0.3,
        lifespanUsesRealm: true
    },
    sect_elder: {
        id: 'sect_elder',
        label: 'Sect Elder',
        emoji: '👴',
        occupation: 'Sect elder',
        startRealmMin: 3,
        startRealmMax: 4,
        maxRealm: 5,
        growthRate: 0.35,
        breakthroughChance: 0.2,
        lifespanUsesRealm: true
    },
    rival: {
        id: 'rival',
        label: 'Rival',
        emoji: '⚔️',
        occupation: 'Ambitious rival',
        scalesWithPlayer: true,
        maxRealmOffset: 2,
        growthRate: 1.1,
        breakthroughChance: 0.38,
        lifespanUsesRealm: true
    },
    demonic_talent: {
        id: 'demonic_talent',
        label: 'Demonic Talent',
        emoji: '😈',
        occupation: 'Heaven-defying prodigy',
        startRealmMin: 0,
        startRealmMax: 1,
        growthRate: 2.0,
        breakthroughChance: 0.55,
        lifespanUsesRealm: true
    }
};

const ZONE_NPC_ROLES = {
    dustbone: { villager: 35, wanderer: 28, disciple: 18, hermit: 12, sect_elder: 2, rival: 5 },
    frostbite: { villager: 20, wanderer: 25, hermit: 30, disciple: 15, sect_elder: 5, rival: 5 },
    jade: { villager: 25, wanderer: 30, disciple: 20, hermit: 10, sect_elder: 5, rival: 10 },
    emberwild: { wanderer: 30, hermit: 20, disciple: 15, villager: 15, rival: 15, sect_elder: 5 },
    heartlands: { disciple: 25, sect_elder: 25, wanderer: 20, villager: 10, hermit: 10, rival: 10 }
};

const NPC_ECOSYSTEM = {
    npcsPerZoneMin: 2,
    npcsPerZoneMax: 4,
    demonicSpawnChance: 0.001,
    demonicEmergenceYears: 10,
    growthMonthsPerBreakthrough: 120,
    demonicMaxRealmOffset: 2,
    demonicThreatCap: 24,
    demonicThreatPerGrowth: 2,
    demonicThreatLogThreshold: 25,
    wanderMoveIntervalMin: 24,
    wanderMoveIntervalMax: 48,
    personalityCountMin: 1,
    personalityCountMax: 2,
    elderDeathDemonicChance: 0.04,
    demonicConfrontThreatMin: 5,
    demonicBargainMinWill: 12,
    givenNames: [
        'Wei Ling', 'Chen Feng', 'Li Mei', 'Zhang Bao', 'Liu Yan', 'Zhao Yun', 'Xiao Han',
        'Shen Wei', 'Bai Hua', 'Tang Long', 'Guo Jing', 'Lin Shuang', 'He Rong', 'Ma Tian',
        'Song Yu', 'Qin Huo', 'Ye Qing', 'Fang Rui', 'Duo Lan', 'Han Zhi'
    ],
    surnames: ['Chen', 'Li', 'Wang', 'Zhang', 'Liu', 'Zhao', 'Lin', 'Huang', 'Wu', 'Xu']
};

const NPC_COMBAT_BALANCE = {
    rivalHpMult: 1.08,
    rivalDmgMult: 1.05,
    demonicHpMultBase: 1.15,
    demonicDmgMultBase: 1.12,
    demonicThreatHpScale: 0.025,
    demonicThreatDmgScale: 0.018,
    demonicThreatHpMax: 1.45,
    demonicThreatDmgMax: 1.28,
    npcMaxHitsToKill: 7,
    demonicMaxHitsToKill: 9,
    npcMaxHpPctPerHit: 0.10,
    demonicMaxHpPctPerHit: 0.11,
    rivalVictoryFame: 8,
    rivalVictoryFoundation: 4,
    demonicVictoryFame: 14,
    demonicVictoryFoundation: 6,
    demonicVictoryAlignment: -10,
    demonicBargainAlignment: -14,
    demonicBargainStones: 35,
    demonicBargainThreatDrop: 12,
    duelMinBehaviorWeight: 0.95,
    fleeFamePenalty: 3
};

const NPC_QUEST_TEMPLATES = {
    rival_duel: {
        type: 'rival_duel',
        title: 'Rival\'s Challenge',
        objective: 'Defeat them in a formal duel.',
        status: 'active'
    },
    demonic_confront: {
        type: 'demonic_confront',
        title: 'Heaven-Defying Prodigy',
        objective: 'Confront or bargain with the Demonic Talent.',
        status: 'active'
    },
    hua_guidance: {
        type: 'hua_guidance',
        title: 'Star Riddle',
        objective: 'Answer Elder Hua\'s philosophical test.',
        status: 'active'
    }
};

const NPC_ROLE_TALK = {
    villager: [
        'The sects quarrel over spirit veins. We mortals harvest what we can.',
        'I have no meridians worth mentioning. But I hear stories from travelers.',
        'If you seek power, the desert takes as much as it gives.'
    ],
    disciple: [
        'My sect drills the basics until the bones ache. It is the only way.',
        'Foundation is everything. I am still far from the peak.',
        'Have you seen any wandering merchants? We need pills for the outer disciples.'
    ],
    wanderer: [
        'The road teaches what closed doors cannot.',
        'I go where the qi stirs and leave before sect politics find me.',
        'Every zone has its own rhythm. You learn to listen.'
    ],
    hermit: [
        'Silence is a technique if you practice it long enough.',
        'I left the sects behind. The Dao does not require an audience.',
        'You carry much fame — or much dissonance. Both echo loudly.'
    ],
    sect_elder: [
        'Young cultivator, the heavens watch how you treat the weak.',
        'Your alignment speaks before your mouth does.',
        'Breakthrough without foundation is a debt the Dao always collects.'
    ],
    rival: [
        'Do not mistake my patience for weakness.',
        'I train while you sleep. The peak has room for only one of us.',
        'Your fame precedes you. Good — I prefer worthy opponents.'
    ],
    demonic_talent: [
        'The heavens wrote rules. I chose to edit them.',
        'You feel it too — the world bracing for something unnatural.',
        'Ally, enemy, or obstacle. Choose before I choose for you.'
    ]
};

const NPC_PERSONALITY_IDS = [
    'careful', 'bold', 'cowardly', 'vengeful', 'honorable', 'cunning', 'loyal', 'proud',
    'merciful', 'ambitious', 'wise', 'foolish', 'secretive', 'sorrowful', 'zealous', 'charming'
];

const NPC_PERSONALITY_CONFLICTS = {
    careful: ['bold', 'foolish'],
    bold: ['careful', 'cowardly'],
    cowardly: ['bold', 'proud', 'vengeful'],
    vengeful: ['merciful', 'cowardly'],
    honorable: ['cunning', 'foolish'],
    cunning: ['honorable', 'foolish'],
    loyal: ['ambitious'],
    proud: ['cowardly', 'merciful'],
    merciful: ['vengeful', 'proud', 'ambitious'],
    ambitious: ['loyal', 'merciful', 'sorrowful'],
    wise: ['foolish'],
    foolish: ['careful', 'honorable', 'cunning', 'wise'],
    secretive: ['charming'],
    sorrowful: ['ambitious', 'zealous'],
    zealous: ['cunning', 'sorrowful'],
    charming: ['secretive', 'vengeful']
};

const NPC_PERSONALITIES = {
    careful: {
        id: 'careful', label: 'Careful', emoji: '🐢',
        talk: ['I prefer to watch before I act.', 'One reckless step can undo ten years of cultivation.', 'Trust is earned in small measures.'],
        greet: 'Speak softly. The world listens.',
        behavior: { duelWeight: 0.4, questWeight: 0.9, tradeWeight: 1.1 },
        alignmentTalk: { dissonant: 'Your qi feels unstable — I will keep my distance.', favored: 'Steady steps. The Dao favors patience.' }
    },
    bold: {
        id: 'bold', label: 'Bold', emoji: '🔥',
        talk: ['Fortune favors those who strike first.', 'Hesitation is a technique for the dead.', 'If the path is blocked, break through it.'],
        greet: 'You look capable. Good — I despise boredom.',
        behavior: { duelWeight: 1.8, questWeight: 0.7, tradeWeight: 0.8 },
        alignmentTalk: { harmony: 'Your aura is bright. Prove it is not hollow.', rebellious: 'Chaos suits you. Perhaps we should test steel.' }
    },
    cowardly: {
        id: 'cowardly', label: 'Cowardly', emoji: '😰',
        talk: ['Please — I want no trouble.', 'The strong always say they mean no harm. Then blood follows.', 'I survive by knowing when to bow.'],
        greet: 'I… I mean no offense, senior.',
        behavior: { duelWeight: 0.2, questWeight: 0.5, tradeWeight: 0.6 },
        alignmentTalk: { rebellious: 'Stay back! I know what dissonance leads to!', favored: 'You seem… safe. That is rare.' }
    },
    vengeful: {
        id: 'vengeful', label: 'Vengeful', emoji: '🗡️',
        talk: ['Debts of blood are the only ones heaven never forgives.', 'I remember every slight.', 'Some wounds only close when the offender stops breathing.'],
        greet: 'Choose your words carefully. I do not forget.',
        behavior: { duelWeight: 1.6, questWeight: 0.6, tradeWeight: 0.5 },
        alignmentTalk: { rebellious: 'You walk like someone who has taken much. I understand.', favored: 'Even the righteous leave corpses in their wake.' }
    },
    honorable: {
        id: 'honorable', label: 'Honorable', emoji: '⚖️',
        talk: ['A cultivator without honor is a beast in robes.', 'I will not strike an unready foe.', 'Promises bind stronger than iron.'],
        greet: 'Greetings. I hope you come in peace.',
        behavior: { duelWeight: 1.0, questWeight: 1.2, tradeWeight: 1.0 },
        alignmentTalk: { harmony: 'Your alignment honors the natural order.', dissonant: 'You reek of shortcuts and stained karma.' }
    },
    cunning: {
        id: 'cunning', label: 'Cunning', emoji: '🦊',
        talk: ['Every conversation has a price — the trick is knowing who pays.', 'Truth is a blade. I choose when to draw it.', 'The obvious path is rarely the profitable one.'],
        greet: 'Ah. Another piece on the board.',
        behavior: { duelWeight: 0.7, questWeight: 1.0, tradeWeight: 1.4 },
        alignmentTalk: { favored: 'The Dao smiles on you. I wonder what that costs.', neutral: 'Neutral alignment — flexible. I respect that.' }
    },
    loyal: {
        id: 'loyal', label: 'Loyal', emoji: '🤝',
        talk: ['My sect may be gone, but my oath remains.', 'I do not abandon those who stood with me.', 'Loyalty outlasts realms.'],
        greet: 'If you are friend to my allies, we are friend.',
        behavior: { duelWeight: 0.6, questWeight: 1.3, tradeWeight: 1.0 },
        alignmentTalk: { harmony: 'You carry yourself like someone worth following.', rebellious: 'Even rebels need comrades. Choose yours wisely.' }
    },
    proud: {
        id: 'proud', label: 'Proud', emoji: '👑',
        talk: ['I bow to no one beneath the heavens.', 'Mediocrity is a choice I refuse.', 'Respect is given to strength — or torn from the weak.'],
        greet: 'You may speak. Do not waste my time.',
        behavior: { duelWeight: 1.5, questWeight: 0.5, tradeWeight: 0.7 },
        alignmentTalk: { favored: 'At least the heavens recognize your worth.', dissonant: 'You dare stand before me in that state?' }
    },
    merciful: {
        id: 'merciful', label: 'Merciful', emoji: '🕊️',
        talk: ['Every enemy was someone\'s child once.', 'Mercy is not weakness — it is discipline.', 'Spare a life when you can. Karma remembers.'],
        greet: 'May your path be gentle today.',
        behavior: { duelWeight: 0.3, questWeight: 1.4, tradeWeight: 1.0 },
        alignmentTalk: { harmony: 'Your alignment radiates compassion.', rebellious: 'Even you might yet be saved.' }
    },
    ambitious: {
        id: 'ambitious', label: 'Ambitious', emoji: '🐉',
        talk: ['The peak is crowded — I intend to stand alone upon it.', 'Sleep is for those who accept their ceiling.', 'Every ally is a ladder. Every rival, a stepping stone.'],
        greet: 'Move aside or keep pace.',
        behavior: { duelWeight: 1.7, questWeight: 0.8, tradeWeight: 0.9 },
        alignmentTalk: { favored: 'Good. The heavens reward hunger.', neutral: 'Undecided alignment — room to grow. I like that.' }
    },
    wise: {
        id: 'wise', label: 'Wise', emoji: '📖',
        talk: ['The Dao speaks in patterns, not proclamations.', 'Ask the right question and the answer often arrives unbidden.', 'Youth burns hot. Age learns to simmer.'],
        greet: 'Sit, if you have patience for wisdom.',
        behavior: { duelWeight: 0.5, questWeight: 1.5, tradeWeight: 0.8 },
        alignmentTalk: { harmony: 'You walk with quiet understanding.', dissonant: 'Dissonance clouds judgment. Listen more.' }
    },
    foolish: {
        id: 'foolish', label: 'Foolish', emoji: '🃏',
        talk: ['Breakthrough? I tried eating three pills at once!', 'My master said I lack… something. Focus?', 'The beast looked friendly! How was I to know?'],
        greet: 'Hey! You look important!',
        behavior: { duelWeight: 1.2, questWeight: 0.4, tradeWeight: 0.7 },
        alignmentTalk: { neutral: 'Dao Alignment? Is that a sect?', favored: 'Wow, you glow a little! Cool!' }
    },
    secretive: {
        id: 'secretive', label: 'Secretive', emoji: '🌑',
        talk: ['Some truths are safer buried.', 'I said too much already.', 'Names have power. I guard mine.'],
        greet: '…You found me.',
        behavior: { duelWeight: 0.6, questWeight: 0.8, tradeWeight: 0.5 },
        alignmentTalk: { rebellious: 'You carry secrets too. I smell them.', favored: 'The heavens know you. That is enough said.' }
    },
    sorrowful: {
        id: 'sorrowful', label: 'Sorrowful', emoji: '🌧️',
        talk: ['The rain remembers what people forget.', 'Joy is a season. Mine has passed.', 'I cultivate to outrun grief. It keeps pace.'],
        greet: 'Forgive my silence. Old pain lingers.',
        behavior: { duelWeight: 0.4, questWeight: 1.0, tradeWeight: 0.6 },
        alignmentTalk: { harmony: 'Your presence is… gentle. Thank you.', rebellious: 'Pain makes monsters of us all.' }
    },
    zealous: {
        id: 'zealous', label: 'Zealous', emoji: '☀️',
        talk: ['The Dao demands devotion!', 'Half-hearted cultivation is heresy.', 'I would burn my lifespan for one true insight.'],
        greet: 'The heavens watch! Do they find you worthy?',
        behavior: { duelWeight: 1.3, questWeight: 1.1, tradeWeight: 0.7 },
        alignmentTalk: { harmony: 'Righteous! The natural order sings through you!', rebellious: 'Repent — or be swept aside!' }
    },
    charming: {
        id: 'charming', label: 'Charming', emoji: '✨',
        talk: ['A smile opens more doors than a sword.', 'Come, friend — let us speak as equals.', 'Life is too short for ugly words.'],
        greet: 'What fortune — meeting you here!',
        behavior: { duelWeight: 0.5, questWeight: 1.0, tradeWeight: 1.3 },
        alignmentTalk: { favored: 'The world loves you today. I see why.', neutral: 'Even neutrality has its allure.' }
    }
};

const NPC_ROLE_PERSONALITY_BIAS = {
    villager: ['careful', 'charming', 'foolish', 'sorrowful', 'cowardly', 'merciful'],
    disciple: ['loyal', 'ambitious', 'honorable', 'zealous', 'foolish', 'bold'],
    wanderer: ['bold', 'cunning', 'secretive', 'wise', 'charming', 'careful'],
    hermit: ['wise', 'secretive', 'sorrowful', 'careful', 'zealous'],
    sect_elder: ['wise', 'honorable', 'proud', 'zealous', 'merciful'],
    rival: ['bold', 'ambitious', 'proud', 'vengeful', 'cunning'],
    demonic_talent: ['ambitious', 'vengeful', 'bold', 'zealous', 'cunning', 'proud']
};

// ===== AMBIENT NPCs (road strangers — lightweight until promoted) =====
const AMBIENT_NPC_CAPS = {
    perZone: 10,
    persistentGlobal: 100,
    spawnChanceTravel: 0.35,
    spawnChanceExplore: 0.30,
    spawnChanceLocalTravel: 0.28,
    activityRefreshChance: 0.05,
    crowdPerLocationMax: 10
};

const LOOK_AROUND_COUNTS = {
    market: { min: 5, max: 8 },
    city: { min: 4, max: 8 },
    outpost: { min: 2, max: 5 },
    sect_hq: { min: 1, max: 4 },
    wilderness: { min: 0, max: 2 },
    default: { min: 0, max: 3 }
};

const SCENE_NOTICE_COUNTS = {
    market: { min: 2, max: 3 },
    city: { min: 2, max: 3 },
    outpost: { min: 1, max: 2 },
    sect_hq: { min: 1, max: 2 },
    wilderness: { min: 1, max: 2 },
    default: { min: 1, max: 2 }
};

const SCENE_NOTICES = {
    disturbance: [
        'Shouting breaks out nearby — someone accuses a merchant of shorting spirit stones.',
        'A cultivator stumbles from an alley, robes torn, refusing to say who did it.',
        'Two disciples argue over a cracked jade slip; a crowd is forming.',
        'Guards hurry past toward a commotion you cannot yet see.',
        'A beast handler loses control of a pack beast; bystanders scatter.'
    ],
    out_of_place: [
        'A hooded figure stands in full noon sun without sweating — wrong, somehow.',
        'Sect robes where only mortals should trade. Someone important, or someone lost.',
        'Incense smoke in a place that should smell only of dust and sweat.',
        'Silence where the market should be loud — then noise again, as if nothing happened.',
        'Someone watches the road from a rooftop. Not a guard. Not a friend you recognize.'
    ],
    crowd: [
        'A crowd gathers in the square — preaching, or warning, you cannot tell yet.',
        'Caravaners clog the street, beasts and curses in equal measure.',
        'People press toward a stall where something rare is being unpacked.',
        'Children and idle cultivators chase the same rumor down the main road.'
    ],
    quiet: [
        'The path is empty. Even the wind seems to wait.',
        'Bird calls stop when you step forward. Nothing moves in the treeline.',
        'Old tracks cross the road — none of them recent.',
        'A cold patch of air where sunlight should be. The jianghu feels thin here.',
        'Distant thunder, but no cloud. You walk on alone.'
    ],
    mood: [
        'The place hums with ordinary life — for now.',
        'Smoke, voices, the clatter of commerce. Someone here needs something.',
        'Travelers eye each other the way cultivators do: measuring, not greeting.'
    ]
};

const SCENE_NOTICE_WEIGHTS = {
    market: { disturbance: 3, out_of_place: 2, crowd: 4, mood: 2, quiet: 0 },
    city: { disturbance: 3, out_of_place: 2, crowd: 3, mood: 2, quiet: 0 },
    outpost: { disturbance: 2, out_of_place: 2, crowd: 2, mood: 2, quiet: 1 },
    sect_hq: { disturbance: 1, out_of_place: 3, crowd: 1, mood: 2, quiet: 1 },
    wilderness: { disturbance: 1, out_of_place: 2, crowd: 0, mood: 0, quiet: 5 },
    default: { disturbance: 1, out_of_place: 1, crowd: 1, mood: 2, quiet: 2 }
};

const AMBIENT_DISPLAY_HINTS = [
    'dust-stained robes',
    'travel-worn cloak',
    'qi-tinted eyes',
    'a hooded face',
    'bandaged hands',
    'a heavy pack',
    'sect outer robes',
    'mud-caked boots',
    'incense on their clothes',
    'a wary glance'
];

const AMBIENT_ROLE_WORDS = {
    villager: 'villager',
    disciple: 'disciple',
    wanderer: 'wanderer',
    hermit: 'hermit',
    rival: 'rival',
    merchant: 'merchant'
};

const AMBIENT_ACTIVITIES = [
    { id: 'traveling_trade', flavorSeed: 'A {role} adjusts a heavy pack — goods bound for market.', typicalRoles: ['merchant', 'villager'] },
    { id: 'returning_home', flavorSeed: 'A traveler on the road home, unhurried but tired.', typicalRoles: ['villager', 'wanderer'] },
    { id: 'fleeing_trouble', flavorSeed: 'Someone keeps glancing over their shoulder as they walk.', typicalRoles: ['wanderer', 'disciple'] },
    { id: 'seeking_work', flavorSeed: 'A cultivator studies passing travelers — looking for hire or escort.', typicalRoles: ['wanderer', 'disciple'] },
    { id: 'patrol_duty', flavorSeed: 'A guarded figure walks with the posture of militia or clan security.', typicalRoles: ['disciple'] },
    { id: 'cultivating_roadside', flavorSeed: 'Someone meditates beside the path, qi faintly stirring.', typicalRoles: ['hermit', 'disciple'] },
    { id: 'injured_recovery', flavorSeed: 'A bandaged traveler rests by the road, jaw set against the pain.', typicalRoles: ['wanderer', 'villager'] },
    { id: 'pilgrimage', flavorSeed: 'A devout traveler carries shrine incense — destination still far.', typicalRoles: ['villager'] },
    { id: 'smuggling_run', flavorSeed: 'A hooded figure avoids the main road, sticking to the margins.', typicalRoles: ['wanderer', 'merchant'] },
    { id: 'beast_hunting', flavorSeed: 'Tracks in the dust — a hunter reads the ground as they walk.', typicalRoles: ['wanderer', 'rival'] },
    { id: 'herb_gathering', flavorSeed: 'Basket and blade — gathering spirit herbs from the roadside wilds.', typicalRoles: ['villager'] },
    { id: 'escorting_caravan', flavorSeed: 'Walking beside laden beasts, eyes on the horizon.', typicalRoles: ['merchant', 'disciple'] },
    { id: 'exiled_wandering', flavorSeed: 'Far from home, bitterness in every line of their posture.', typicalRoles: ['wanderer', 'hermit'] },
    { id: 'recruiting', flavorSeed: 'Someone watches cultivators pass with appraising eyes — sect outer disciple.', typicalRoles: ['disciple'] },
    { id: 'delivering_message', flavorSeed: 'Hurried steps, a sealed letter tucked against the chest.', typicalRoles: ['wanderer', 'disciple'] },
    { id: 'lost', flavorSeed: 'A traveler argues with a crude map, clearly in the wrong place.', typicalRoles: ['villager', 'wanderer'] },
    { id: 'celebrating', flavorSeed: 'Light step, barely contained grin — recent good fortune.', typicalRoles: ['disciple', 'wanderer'] },
    { id: 'mourning', flavorSeed: 'Quiet grief; funeral ashes or memorial token in hand.', typicalRoles: ['villager', 'sorrowful'] },
    { id: 'toll_avoidance', flavorSeed: 'Taking a rough detour to avoid the toll road.', typicalRoles: ['merchant', 'wanderer'] },
    { id: 'rumor_spreading', flavorSeed: 'Eager to speak with anyone passing — news from the road.', typicalRoles: ['villager', 'wanderer'] }
];

const AMBIENT_RECENT_BEATS = {
    traveling_trade: {
        cunning: 'Lost a cargo contract to a rival merchant last season.',
        default: 'Hauling goods between markets along the dusty routes.'
    },
    fleeing_trouble: {
        vengeful: 'Running from someone who owes a blood debt.',
        cowardly: 'Fled a dispute they want no part of.',
        default: 'Keeping ahead of trouble on the road.'
    },
    cultivating_roadside: {
        wise: 'Seeks breakthrough before winter closes the pass.',
        zealous: 'Refuses to break meditation until qi stirs.',
        default: 'Practices where the path meets open sky.'
    },
    returning_home: {
        sorrowful: 'Returns to a village that may not remember them.',
        default: 'Homeward bound after long months away.'
    },
    seeking_work: {
        ambitious: 'Hopes this journey leads to a patron sect.',
        default: 'Needs coin and will guard a caravan for pay.'
    },
    smuggling_run: {
        secretive: 'Carries something best left unmentioned.',
        cunning: 'Knows every back trail between toll stations.',
        default: 'Avoids main roads for reasons they will not say.'
    },
    beast_hunting: {
        bold: 'Tracking a beast that wounded a village elder.',
        default: 'Following spoor along the trade routes.'
    },
    mourning: {
        sorrowful: 'Carries ashes from a funeral on the western road.',
        default: 'Walks in quiet grief after a recent loss.'
    },
    rumor_spreading: {
        charming: 'Cannot resist sharing every scrap of road news.',
        default: 'Collects tales from every traveler they meet.'
    },
    lost: {
        foolish: 'Insists the map is correct — the road is wrong.',
        default: 'Clearly far from where they intended to be.'
    },
    default: {
        default: 'Recently seen along the roads of the jianghu.'
    }
};

// ===== WORLD NPC CONVERSE (v1.1 — jianghu talk) =====
const NPC_CONVERSE_BALANCE = {
    monthsCost: 1,
    impressionDecayPerMonth: 1,
    trustDecayPerMonth: 1,
    impressionMin: -100,
    impressionMax: 100,
    trustMin: -100,
    trustMax: 100,
    lightTopicCount: 2
};

const NPC_CONVERSE_TOPICS = [
    { id: 'why_here', label: 'What brings you out here?' },
    { id: 'not_passing', label: "You don't look like you're just passing through." },
    { id: 'names', label: 'Heard any names worth remembering?' }
];

const NPC_CONVERSE_PLAYER_LINES = {
    why_here: [
        { stance: 'warm', line: "Rough time on the road? I've seen worse — tell me what's going on." },
        { stance: 'pragmatic', line: "Everyone's running from something or toward something. Which are you?" },
        { stance: 'cold', line: "I haven't got long. Make it brief." }
    ],
    not_passing: [
        { stance: 'probe', line: "You're carrying yourself like someone waiting for something. Who?" },
        { stance: 'firm', line: "I've met enough cultivators to know when someone's measuring me. Don't." },
        { stance: 'cold', line: "If you're trouble, walk on. I didn't ask for a fight." }
    ],
    names: [
        { stance: 'warm', line: "I'll trade you — a name for a name." },
        { stance: 'pragmatic', line: "I'm not interested in gossip unless it pays." },
        { stance: 'cold', line: 'Names get people killed. Keep yours to yourself.' }
    ]
};

const NPC_CONVERSE_IMPRESSION_DELTAS = {
    warm: 4,
    pragmatic: 2,
    cold: -3,
    probe: 1,
    firm: 0
};

const NPC_CONVERSE_TRUST_DELTAS = {
    warm: 3,
    pragmatic: 1,
    cold: -2,
    probe: 0,
    firm: -1
};

const NPC_CONVERSE_SYNERGY_MODS = {
    schemer: { impressionGain: 0.55, trustGain: 0.35, warmTrust: 0.2 },
    silver_tongue: { impressionGain: 1.1, trustGain: 0.65, warmTrust: 0.5 },
    grudge_keeper: { impressionGain: 0.85, trustGain: 0.5, coldImpression: -2 },
    soft_survivor: { impressionGain: 1.15, trustGain: 1.2, warmTrust: 1.3 },
    righteous: { impressionGain: 0.9, trustGain: 0.8 },
    reluctant_dealer: { impressionGain: 1.0, trustGain: 0.7, pragmaticTrust: 1.2 }
};

const NPC_CONVERSE_REMEET_GREETS = {
    recent: [
        "Small world — I remember you from the road.",
        "We've spoken before. Say what you came to say."
    ],
    months: [
        "We've crossed paths before — some months back.",
        "I remember you. The jianghu isn't that large."
    ],
    seasons: [
        "Seasons pass quickly. I still recall meeting you on the road.",
        "You've aged in the way cultivators do. We have met before."
    ],
    warm: [
        "Good to see a familiar face out here.",
        "Ah — you again. I hoped the road would be kinder to you."
    ],
    cool: [
        "You again. I remember.",
        "I haven't forgotten our last conversation."
    ],
    wary: [
        "You. I remember what you said last time.",
        "Speak carefully. I have not forgotten you."
    ]
};

const NPC_BETRAYAL_BALANCE = {
    minMonthsAfterHook: 6,
    ambushChanceTravel: 0.32,
    ambushChanceExplore: 0.28,
    weakHpPct: 0.4,
    weakQiPct: 0.3,
    impressionTrustGapMin: 6,
    maxTrustForHook: 12,
    minImpressionForHook: 6,
    ambushFirstStrikeHpMin: 4,
    ambushFirstStrikeHpMax: 10,
    talkDownBaseChance: 0.22,
    talkDownCharmingBonus: 0.12,
    callbackBaseChance: 0.32,
    misleadingIntelChance: 0.38,
    trustIntelGapMin: 8
};

const NPC_CONVERSE_CALLBACKS = [
    {
        topicId: 'not_passing',
        requireFlag: 'dueledPlayer',
        synergies: ['grudge_keeper'],
        chance: 0.42,
        onceKey: 'callback_duel_not_passing',
        line: '"Still sore from our duel? Good — remember it."'
    },
    {
        topicId: 'not_passing',
        requireFlag: 'schemer_hook',
        synergies: ['schemer'],
        chance: 0.36,
        onceKey: 'callback_schemer_waiting',
        line: '"Still waiting for something worth my time. Perhaps that is you."'
    },
    {
        topicId: 'names',
        requireFlag: 'schemer_hook',
        synergies: ['schemer'],
        chance: 0.38,
        onceKey: 'callback_schemer_offer',
        line: '"That offer still stands — if you are listening."'
    },
    {
        topicId: 'names',
        minFame: 20,
        requireFlag: 'boasted_fame',
        chance: 0.34,
        onceKey: 'callback_fame_names',
        line: '"Everyone knows {name}. Including the wrong people."'
    },
    {
        topicId: 'why_here',
        requireActivity: 'fleeing_trouble',
        chance: 0.33,
        onceKey: 'callback_fleeing_beat',
        line: '"Still running. The road has long memory — as do I."'
    },
    {
        topicId: 'why_here',
        requireFlag: 'threatened',
        synergies: ['cowardly', 'soft_survivor'],
        chance: 0.3,
        onceKey: 'callback_threatened_why',
        line: '"You were sharp last time. I have not forgotten the tone."'
    }
];

// ===== TUTORIAL =====
const TUTORIAL_STEPS = {
    first_boot: {
        id: 'first_boot',
        title: 'First Steps',
        emoji: '🌱',
        highlight: '#btnCultivate',
        text: 'You have taken your first step on the path of cultivation. The world of the Azure Sky Continent awaits — but first, you must learn to walk.',
        learnMore: 'Your stats, actions, and the event log guide your journey. Cultivate to grow stronger, explore the zones, and watch your lifespan — every month spent is a choice.'
    },
    first_cultivate: {
        id: 'first_cultivate',
        title: 'Refining Qi',
        emoji: '🧘',
        highlight: '#btnCultivate',
        text: 'Cultivation refines your Qi Density — the purity and potency of your energy. Each session strengthens your foundation.',
        learnMore: 'Each cultivation session costs 6 months. You gain Qi Density, refill your dantian, and slowly improve secondary stats. Higher density means stronger techniques and breakthroughs.'
    },
    first_breakthrough: {
        id: 'first_breakthrough',
        title: 'Breaking Through',
        emoji: '🌀',
        highlight: '#btnBreakthrough',
        text: 'Your cultivation presses against the limits of your realm. To advance, you must face the Heavens\' trial.',
        learnMore: 'Breakthroughs cost 2 years and carry a risk of failure. Foundation, meridians, and consolidation all improve your odds. Failure costs time and may leave scars if tribulation follows.'
    },
    first_consolidation: {
        id: 'first_consolidation',
        title: 'Solid Foundation',
        emoji: '🏛️',
        highlight: '#btnConsolidate',
        text: 'You have reached the peak of your realm. To go further, you must first stabilize what you have built — your Foundation must be solid before you can ascend.',
        learnMore: 'Consolidation locks in your realm\'s gains: Foundation, max Qi, and density. Perfect consolidation at peak power grants the best bonuses. Most realms require consolidation before the next breakthrough.'
    },
    first_tribulation: {
        id: 'first_tribulation',
        title: 'Heaven\'s Trial',
        emoji: '⚡',
        highlight: null,
        text: 'The Heavens test the worthy. Survive, and you grow stronger. Fall, and you bear a scar.',
        learnMore: 'Tribulations have three phases: omen, trial, and combat or choice. Scars are permanent debuffs but can be healed through rare means. Dao Alignment and preparation shift the odds.'
    },
    first_alignment: {
        id: 'first_alignment',
        title: 'Dao Alignment',
        emoji: '☯️',
        highlight: '.alignment-meta',
        text: 'Your actions have shifted your Dao Alignment. The Dao is a natural law — not a moral judge.',
        learnMore: 'Alignment ranges from Rebellious to Harmony. It affects tribulation severity, breakthrough odds, NPC reactions, and prices — not "good" or "evil," but harmony with the natural order.'
    },
    first_npc: {
        id: 'first_npc',
        title: 'The Jianghu',
        emoji: '🧍',
        highlight: '#npcPresenceGroup',
        text: 'The world is filled with cultivators, villagers, and sages. Listen to them — they may offer wisdom, trade, or challenge.',
        learnMore: 'NPCs appear in the sidebar under Quests and Other People. Some wander, some offer tests or trade. Your Dao Alignment and fame change how they speak to you.'
    },
    unlock_factions: {
        id: 'unlock_factions',
        title: 'Faction Politics',
        emoji: '⚖️',
        highlight: '#btnFactions',
        text: 'You have walked the wilds and grown strong enough to matter. Zone factions now track your reputation — allies and rivals alike.',
        learnMore: 'Open Factions to see power structures in your region. Reputation shifts prices, quests, and how cultivators treat you.'
    },
    unlock_forbidden: {
        id: 'unlock_forbidden',
        title: 'Forbidden Grounds',
        emoji: '🌑',
        highlight: '#btnForbidden',
        text: 'A major realm on any refinement opens glimpses of forbidden realms — places where the Dao runs thin and treasures carry a price.',
        learnMore: 'Forbidden grounds cost time and carry risk. Dao fragments and rare loot await, but tribulation scars and alignment shifts are real.'
    }
};

const TUTORIAL_ORDER = [
    'first_boot', 'first_cultivate', 'first_breakthrough', 'first_consolidation',
    'first_tribulation', 'first_alignment', 'first_npc',
    'unlock_factions', 'unlock_forbidden'
];

// ===== TIME & LIFESPAN =====
const STARTING_AGE_YEARS = 16;
// Max lifespan in years at each cultivation realm (index = realmIdx)
const LIFESPAN_BY_REALM = [80, 120, 200, 400, 800, 2000, 99999];

// Months spent per action — forces meaningful choices, not button spam
const ACTION_MONTHS = {
    cultivate: 6,
    explore: 4,
    market: 2,
    pill: 1,
    recuperate: 3,
    recruit: 12,
    breakthrough: 24,
    combatStart: 2,
    combatRound: 1,
    travel: 8,
    localTravel: 2,
    meridian: 6,
    goldenNeedle: 12,
    hiddenMeridian: 24,
    physiqueTrain: 12,
    physiqueLegendary: 36,
    physiqueEvil: 18,
    intentChoose: 8,
    intentAwaken: 10,
    intentDeepen: 12,
    intentExpand: 12,
    intentSwitch: 1,
    intentRefine: 3,
    daoSearch: 6,
    daoComprehend: 18,
    forbiddenSearch: 6,
    forbiddenEnter: 12,
    consolidate: 3,
    interact: 1,
    lookAround: 1,
    npcConverse: 1,
    npcTrade: 2,
    npcRumor: 2,
    npcTest: 3,
    sectFound: 12,
    sectBuild: 6,
    ancientSearch: 4,
    ancientUnseal: 12,
    manualComprehend: 2,
    alignMeditate: 2,
    alignGoodDeed: 2,
    alignAtonement: 6,
    alignWickedPath: 2,
    alignDemonicImpulse: 3
};

const MANUAL_BALANCE = {
    defaultMonths: 2,
    monthsByRarity: {
        common: 1,
        uncommon: 2,
        rare: 3,
        legendary: 5
    },
    monthsByCultivationTier: {
        mortal: 1,
        condensation: 1,
        foundation: 2,
        core: 3,
        nascent: 4,
        void: 5,
        dao_seeking: 6,
        immortal: 8
    },
    consignByRarity: {
        common: 12,
        uncommon: 22,
        rare: 45,
        legendary: 90
    },
    defaultIntentDebuff: { dmgMult: 0.45, costMult: 1.25 }
};

const MANUAL_HALL_BALANCE = {
    studyMonthsMult: 3,
    renownByRarity: { common: 1, uncommon: 2, rare: 4, legendary: 8 },
    roleStudySpeed: { acolyte: 1, elder: 0.88, core: 0.78, successor: 0.68 },
    traitStudySpeed: { wise: 0.85, ambitious: 0.92, loyal: 1, generous: 1, mysterious: 0.9 }
};

/** Personal travel kit — worn gear is free; bag contents count against capacity. */
const METHOD_MANUAL_BALANCE = {
    defaultMonths: 2,
    monthsByGrade: {
        crude: 2,
        common: 3,
        superior: 4,
        peerless: 8
    },
    consignByGrade: {
        crude: 8,
        common: 14,
        superior: 28,
        peerless: 60
    },
    defaultConsign: 10
};

const TRAVEL_KIT_BALANCE = {
    baseCapacity: 8,
    manualUniqueWeight: 1,
    methodUniqueWeight: 1,
    pillWeight: 0.25,
    gearBagWeight: 1,
    curioWeight: 0.5,
    defaultMaterialWeight: 0.12,
    materialWeight: {
        spirit_herb: 0.1,
        iron_ore: 0.15,
        leather_scrap: 0.12,
        silk_thread: 0.08,
        jade_inlay: 0.25,
        demon_core: 0.3,
        celestial_silk: 0.2
    }
};

/** Home shelves at Leader's Quarters — bulk storage, scales with residence upgrades. */
const RESIDENCE_STASH_BALANCE = {
    capacityByLevel: [16, 28, 44, 64],
    stashAllManualsMax: 20
};

/** Spatial storage rings — expand travel kit capacity; materials weigh less inside. */
const SPATIAL_RING_BALANCE = {
    rings: {
        storage_ring: {
            id: 'storage_ring',
            name: 'Storage Ring',
            emoji: '💍',
            tier: 1,
            capacityBonus: 6,
            materialWeightMult: 0.65,
            reqRealm: 2,
            desc: 'A qi-bound ring that folds space around your travel bundle — +6 kit capacity, materials weigh 35% less.',
            craft: {
                months: 6,
                stones: 45,
                materials: { jade_inlay: 2, silk_thread: 4, spirit_herb: 6 }
            }
        },
        void_storage_ring: {
            id: 'void_storage_ring',
            name: 'Void Storage Ring',
            emoji: '🌀',
            tier: 2,
            capacityBonus: 14,
            materialWeightMult: 0.45,
            reqRealm: 3,
            requiresRing: 'storage_ring',
            desc: 'Rift-woven storage — +14 kit capacity, materials weigh 55% less. Replaces a Storage Ring.',
            craft: {
                months: 10,
                stones: 80,
                materials: { jade_inlay: 3, celestial_silk: 2, demon_core: 2 },
                consumesCurio: 'Dao Insight Fragment'
            }
        }
    }
};

/** Intent synergy tiers — mid = soft debuff, high = hard debuff without matching intent stage. */
const INTENT_TECHNIQUE_BALANCE = {
    low: { noMatchMult: 1, costMult: 1, matchBonus: 0.06, stageBonusPerTier: 0.025 },
    mid: { noMatchMult: 0.85, costMult: 1.08, matchBonus: 0.10, stageBonusPerTier: 0.035 },
    high: { noMatchMult: 0.45, costMult: 1.25, matchBonus: 0.15, stageBonusPerTier: 0.05 },
    wrongStageMult: 0.72
};

/** Apex arts — hard intent gate unless noted in pool. */
const HIGH_INTENT_TECHNIQUES = new Set([
    'Wind Blade Strike', 'Heavenly Sword Qi', 'Phantom Blade', 'Mountain Crash', 'Celestial Judgment',
    'Soul Severing Sword', 'War God\'s Roar', 'Phoenix Ascent Palm', 'Abyss Gaze', 'Soul Rend',
    'Glacier Heart Palm', 'Maelstrom Lance', 'Void Rend', 'Demon Seal', 'Five Elements Fist',
    'Mirror Step'
]);

// ===== ACTION UNLOCKS — realm & milestone gates (not age) =====
// minRealm uses realmIdx (0 = first realm). Milestones are set by play, not calendar age.
const MILESTONE_LABELS = {
    explored: 'Explore the wilds at least once',
    met_npc: 'Speak with someone on the path', // reserved for future gates (e.g. factions OR met_npc)
    passed_tribulation: 'Survive a heavenly tribulation'
};

const ACTION_UNLOCK_LABELS = {
    intent: 'Weapon Intent',
    physique: 'Physique',
    search: 'Probe Sealed Sites',
    factions: 'Factions',
    forbidden: 'Forbidden Grounds',
    sect: 'Sect',
    dao: 'Dao',
    recruit: 'Recruit'
};

const ACTION_UNLOCK_BUTTONS = {
    cultivate: 'btnCultivate',
    consolidate: 'btnConsolidate',
    breakthrough: 'btnBreakthrough',
    recuperate: 'btnRecuperate',
    meridian: 'btnMeridian',
    dao: 'btnDao',
    intent: 'btnIntent',
    tech: 'btnTech',
    pill: 'btnPill',
    inventory: 'btnInventory',
    explore: 'btnExplore',
    search: 'btnSearch',
    map: 'btnMap',
    market: 'btnMarket',
    combat: 'btnCombat',
    forbidden: 'btnForbidden',
    recruit: 'btnRecruit',
    sect: 'btnSect',
    factions: 'btnFactions'
};

const ACTION_UNLOCKS = {
    cultivate: {},
    consolidate: {},
    breakthrough: {},
    recuperate: {},
    explore: {},
    map: {},
    combat: {},
    tech: {},
    pill: {},
    inventory: {},
    market: {},
    meridian: {},
    intent: {
        minRealm: 1,
        hint: 'Foundation Establishment on the dantian path — awaken Weapon Intent.'
    },
    physique: {
        minRealm: 1,
        hint: 'Foundation Establishment — temper Physique.'
    },
    search: {
        minRealm: 1,
        hint: 'Reach the second realm on any refinement — sense sealed sites.'
    },
    factions: {
        minRealm: 1,
        milestones: ['explored'],
        hint: 'Explore once + second realm on any refinement.'
    },
    forbidden: {
        minRealm: 2,
        hint: 'Reach a major realm (any refinement) — forbidden grounds await.'
    },
    sect: {
        minRealm: 2,
        hint: 'Reach a major realm (any refinement) — found a sect.'
    },
    dao: {
        minRealm: typeof DAO_SEEKING_REALM_IDX !== 'undefined' ? DAO_SEEKING_REALM_IDX : 5,
        hint: 'Dao Seeking — pursue fragments.'
    },
    recruit: {
        customCheck: 'canRecruitDisciples',
        hint: 'Found your sect first.'
    }
};

// World scheduler — calendar intervals for off-screen jianghu events
const WORLD_TIME_BALANCE = {
    phoenixWarIntervalMonths: 24,
    phoenixWarExploitIntervalMonths: 18,
    chronicleMaxEntries: 80,
    chronicleSummaryMax: 3
};

// ===== WORLD LOCATIONS — cities, markets, sect halls within zones =====
const ZONE_MAP_LAYOUT = {
    frostbite: { cx: 50, cy: 14, rx: 14, ry: 9 },
    dustbone: { cx: 22, cy: 42, rx: 16, ry: 11 },
    heartlands: { cx: 50, cy: 40, rx: 17, ry: 12 },
    jade: { cx: 78, cy: 42, rx: 14, ry: 10 },
    emberwild: { cx: 50, cy: 72, rx: 15, ry: 10 }
};

/** Local map node positions — presentation only; WORLD_LOCATIONS is source of truth. */
const ZONE_LOCAL_LAYOUT = {
    dustbone: {
        theme: 'desert',
        nodes: {
            bone_crossroads: { x: 50, y: 55, layer: 2 },
            miraj_waystation: { x: 22, y: 48, layer: 1 },
            sunscar_camp: { x: 78, y: 35, layer: 1 },
            ashen_shrine: { x: 62, y: 78, layer: 1 }
        },
        paths: [
            { from: 'miraj_waystation', to: 'bone_crossroads' },
            { from: 'sunscar_camp', to: 'bone_crossroads' },
            { from: 'ashen_shrine', to: 'bone_crossroads' }
        ]
    },
    frostbite: {
        theme: 'frost',
        nodes: {
            frost_gate: { x: 50, y: 68, layer: 2 },
            frostpeak_monastery: { x: 50, y: 28, layer: 1 }
        },
        paths: [
            { from: 'frost_gate', to: 'frostpeak_monastery' }
        ]
    },
    heartlands: {
        theme: 'heartlands',
        nodes: {
            outer_heartlands: { x: 50, y: 48, layer: 2 },
            sword_sect_hall: { x: 26, y: 22, layer: 1 },
            jade_lotus_pavilion: { x: 74, y: 22, layer: 1 },
            void_temple_steps: { x: 20, y: 74, layer: 1 },
            celestial_market: { x: 50, y: 80, layer: 1 },
            phoenix_court: { x: 80, y: 74, layer: 1 }
        },
        paths: [
            { from: 'sword_sect_hall', to: 'outer_heartlands' },
            { from: 'jade_lotus_pavilion', to: 'outer_heartlands' },
            { from: 'void_temple_steps', to: 'outer_heartlands' },
            { from: 'celestial_market', to: 'outer_heartlands' },
            { from: 'phoenix_court', to: 'outer_heartlands' }
        ]
    },
    jade: {
        theme: 'coast',
        nodes: {
            tide_harbor: { x: 40, y: 58, layer: 2 },
            storm_dock: { x: 74, y: 58, layer: 1 },
            tidal_shrine: { x: 50, y: 26, layer: 1 }
        },
        paths: [
            { from: 'tidal_shrine', to: 'tide_harbor' },
            { from: 'tide_harbor', to: 'storm_dock' }
        ]
    },
    emberwild: {
        theme: 'jungle',
        nodes: {
            ashvein_village: { x: 35, y: 50, layer: 2 },
            beast_circle: { x: 68, y: 48, layer: 1 }
        },
        paths: [
            { from: 'ashvein_village', to: 'beast_circle' }
        ]
    }
};

const WORLD_LOCATIONS = {
    frost_gate: {
        id: 'frost_gate', parentZone: 'frostbite', type: 'city', isDefault: true,
        name: 'Frost Gate Outpost', emoji: '🏘️',
        description: 'The last warm hearth before the true Wastes — traders and frost hermits share the same fire.',
        lore: 'Walls of packed snow and spirit-iron guard a single market street. Beyond the gate, the cold owns everything.',
        tags: ['Rumors', 'Supplies']
    },
    frostpeak_monastery: {
        id: 'frostpeak_monastery', parentZone: 'frostbite', type: 'sect_hq',
        name: 'Frostpeak Monastery Gate', emoji: '🏔️',
        description: 'Stone steps climb into cloud and killing wind — the Frostpeak order judges all who seek entry.',
        lore: 'The monastery does not recruit. It tolerates those who endure.',
        factionNpcId: 'faction_frost_warden',
        tags: ['Frostpeak faction', 'Elder quests']
    },
    bone_crossroads: {
        id: 'bone_crossroads', parentZone: 'dustbone', type: 'city', isDefault: true,
        name: 'Bone Crossroads', emoji: '🏜️',
        description: 'Caravans meet where three dune-roads cross — the safest place in Dustbone for a lone cultivator.',
        lore: 'Bone totems mark graves of merchants who thought the desert was merely sand.',
        tags: ['Explore hub', 'Story NPCs', 'Caravans']
    },
    sunscar_camp: {
        id: 'sunscar_camp', parentZone: 'dustbone', type: 'sect_hq',
        name: 'Sunscar War-Camp', emoji: '☀️',
        description: 'Hide tents and iron braziers — the Sunscar Clan tests strength in open sand.',
        factionNpcId: 'faction_sunscar_chief',
        tags: ['Sunscar faction']
    },
    miraj_waystation: {
        id: 'miraj_waystation', parentZone: 'dustbone', type: 'outpost',
        name: 'Miraj Waystation', emoji: '🐪',
        description: 'Dune Riders water their beasts and tally caravan debts.',
        factionNpcId: 'faction_dune_elder',
        tags: ['Dune Riders', 'Trade routes']
    },
    ashen_shrine: {
        id: 'ashen_shrine', parentZone: 'dustbone', type: 'sect_hq',
        name: 'Ashen Priest Shrine', emoji: '🔥',
        description: 'Black flame never dies on the altar stones — omens are bought and sold here.',
        factionNpcId: 'faction_ashen_seer',
        tags: ['Ashen Priests', 'Omens']
    },
    outer_heartlands: {
        id: 'outer_heartlands', parentZone: 'heartlands', type: 'wilderness', isDefault: true,
        name: 'Outer Heartlands', emoji: '🌾',
        description: 'Spirit-rich fields and wandering disciples between the great sect peaks.',
        lore: 'Qi hangs thick enough to taste. Everyone here is someone — or will be someone\'s stepping stone.',
        tags: ['Explore', 'High loot']
    },
    celestial_market: {
        id: 'celestial_market', parentZone: 'heartlands', type: 'market',
        name: 'Celestial Market', emoji: '🏪',
        description: 'The continent\'s greatest open market — manuals, pills, and rumors from every sect.',
        marketKey: 'heartlands',
        tags: ['Market', 'Rare manuals']
    },
    sword_sect_hall: {
        id: 'sword_sect_hall', parentZone: 'heartlands', type: 'sect_hq',
        name: 'Celestial Sword Hall', emoji: '⚔️',
        description: 'Blade intent sharpens the air — disciples drill until stone groans.',
        factionNpcId: 'faction_sword_elder',
        tags: ['Celestial Sword']
    },
    jade_lotus_pavilion: {
        id: 'jade_lotus_pavilion', parentZone: 'heartlands', type: 'sect_hq',
        name: 'Jade Lotus Pavilion', emoji: '🪷',
        description: 'Silk screens and ledger desks — the Lotus trades in favors as much as stones.',
        factionNpcId: 'faction_lotus_envoy',
        tags: ['Jade Lotus', 'Market discount']
    },
    void_temple_steps: {
        id: 'void_temple_steps', parentZone: 'heartlands', type: 'sect_hq',
        name: 'Void Temple Steps', emoji: '🌌',
        description: 'Star charts line the ascending stairs; silence is the first lesson.',
        factionNpcId: 'faction_void_adept',
        tags: ['Void Temple']
    },
    phoenix_court: {
        id: 'phoenix_court', parentZone: 'heartlands', type: 'sect_hq',
        name: 'Golden Phoenix Court', emoji: '🔥',
        description: 'Banners of flame overlook the political heart of the Heartlands.',
        factionNpcId: 'faction_phoenix_herald',
        tags: ['Golden Phoenix', 'Phoenix Gambit']
    },
    tide_harbor: {
        id: 'tide_harbor', parentZone: 'jade', type: 'market', isDefault: true,
        name: 'Tide Harbor', emoji: '⚓',
        description: 'Mist, salt, and coin — the Guild counts every ship that docks.',
        marketKey: 'jade',
        tags: ['Market', 'Guild trade']
    },
    storm_dock: {
        id: 'storm_dock', parentZone: 'jade', type: 'sect_hq',
        name: 'Storm Dragon Dock', emoji: '🐉',
        description: 'War junks and tide-charts — the Fleet Captain holds court above the waterline.',
        factionNpcId: 'faction_storm_captain',
        tags: ['Storm Dragon']
    },
    tidal_shrine: {
        id: 'tidal_shrine', parentZone: 'jade', type: 'sect_hq',
        name: 'Tidal Lotus Shrine', emoji: '🪷',
        description: 'Coral lanterns light rituals for the drowned and the debtors.',
        factionNpcId: 'faction_tidal_shaman',
        tags: ['Tidal Lotus']
    },
    ashvein_village: {
        id: 'ashvein_village', parentZone: 'emberwild', type: 'city', isDefault: true,
        name: 'Ashvein Village', emoji: '🛖',
        description: 'A ring of huts around a geothermal vent — the jungle\'s last polite stop.',
        tags: ['Explore hub', 'Supplies']
    },
    beast_circle: {
        id: 'beast_circle', parentZone: 'emberwild', type: 'sect_hq',
        name: 'Emberwild Beast Circle', emoji: '🌿',
        description: 'Tamed beasts and wary keepers — respect the circle or join the mulch.',
        factionNpcId: 'faction_beast_keeper',
        tags: ['Emberwild Collective']
    }
};

// ===== SEALED ANCIENTS — hidden sub-zones =====
const HIDDEN_SUBZONES = {
    frozen_abyss: {
        id: 'frozen_abyss',
        parentZone: 'frostbite',
        name: 'Frozen Abyss',
        emoji: '🕳️',
        biome: 'Lightless Ice',
        description: 'A pit where sunlight dies — something ancient sleeps in the cold below.',
        lore: 'Even frost-path hermits refuse to descend. The array seals at the rim still hum with pre-heaven qi.',
        minRealm: 1,
        search: { base: 15, affinity: 'water', affinityBonus: 5, clueBonus: 10 },
        unseal: { months: 12, qi: 45, stones: 35, barrierLabel: 'Ninefold Frost Array' },
        ancientId: 'frostbound_sage'
    },
    whistling_dunes: {
        id: 'whistling_dunes',
        parentZone: 'dustbone',
        name: 'Whistling Dunes',
        emoji: '🌬️',
        biome: 'Singing Sands',
        description: 'Dunes that scream when the wind passes — a buried court lies beneath.',
        lore: 'Nomads say the whistling is a lullaby for a king who refused to die.',
        minRealm: 0,
        search: { base: 20, affinity: 'earth', affinityBonus: 5, clueBonus: 10 },
        unseal: { months: 10, qi: 30, stones: 25, barrierLabel: 'Sand-Buried Spirit Gate' },
        ancientId: 'dune_sovereign'
    },
    root_of_world: {
        id: 'root_of_world',
        parentZone: 'heartlands',
        name: 'Root of the World',
        emoji: '🌳',
        biome: 'Spiritual Nexus',
        description: 'Where continental veins converge — a root-chamber older than the nine sects.',
        lore: 'The Heartlands sects deny it exists. Their oldest formation texts disagree.',
        minRealm: 3,
        search: { base: 10, alignThreshold: 50, alignBonus: 10, clueBonus: 10 },
        unseal: { months: 18, qi: 60, stones: 50, barrierLabel: 'World-Root Seal' },
        ancientId: 'root_warden'
    },
    sunken_atoll: {
        id: 'sunken_atoll',
        parentZone: 'jade',
        name: 'Sunken Atoll',
        emoji: '🏝️',
        biome: 'Drowned Reef',
        description: 'A coral palace risen from the tide — sealed since the last dragon tide.',
        lore: 'Pearl divers who found the atoll came back speaking in rhymes no one understands.',
        minRealm: 0,
        search: { base: 25, affinity: 'water', affinityBonus: 5, clueBonus: 10 },
        unseal: { months: 10, qi: 35, stones: 30, barrierLabel: 'Coral Warding Ring' },
        ancientId: 'tide_sleeper'
    },
    ashvein_caldera: {
        id: 'ashvein_caldera',
        parentZone: 'emberwild',
        name: 'Ashvein Caldera',
        emoji: '🔥',
        biome: 'Volcanic Cradle',
        description: 'A caldera where ash rivers meet — a beast-guarded tomb of flame.',
        lore: 'The Emberwild tribes leave offerings at the rim. Something still eats them.',
        minRealm: 1,
        search: { base: 15, affinity: 'fire', affinityBonus: 5, clueBonus: 10 },
        unseal: { months: 14, qi: 40, stones: 28, barrierLabel: 'Ashvein Guardian Seal', requiresGuardian: true, guardianKey: 'ashvein_guardian_beast' },
        ancientId: 'caldera_heart'
    }
};

const ANCIENT_FORBIDDEN_CLUES = {
    mirror_lake: 'frost_sun_never_rises',
    sunken_temple: 'jade_drowned_crown',
    ashen_garden: 'ember_ash_heart',
    celestial_observatory: 'heartlands_root',
    iron_crucible: 'dune_whisper',
    silent_mountain: 'frost_sun_never_rises'
};

const NPC_ANCIENT_CLUE_HOOKS = {
    merchant_su: { zone: 'dustbone', clueId: 'dune_whisper', talkChance: 0.28 },
    elder_hua: { testId: 'destination', clueId: 'heartlands_root' },
    wei_collector: { zone: 'jade', clueId: 'jade_drowned_crown', talkChance: 0.22 }
};

const SUBZONE_LOOT = {
    frozen_abyss: {
        common: [
            { name: 'Abyss Ice Shard', type: 'material', value: 6, desc: 'Ice that has never seen sunlight.' },
            { name: 'Lightless Moss', type: 'herb', value: 4, desc: 'Grows only where stars cannot reach.' }
        ],
        rare: [
            { name: 'Sunless Pearl', type: 'legendary_material', value: 40, desc: 'A pearl formed in absolute dark.' },
            { name: 'Frozen Manual', type: 'technique', value: 18, technique: 'Glacier Heart Palm', desc: 'Ice-path scripture from the abyss.' }
        ],
        ultra: [
            { name: 'Pre-Heaven Frost Shard', type: 'legendary_material', value: 60, desc: 'A shard of the array that sealed the Sage.' }
        ],
        techniques: ['Glacier Heart Palm', 'Frostbite Palm', 'Gale Spiral']
    },
    whistling_dunes: {
        common: [
            { name: 'Singing Sand', type: 'material', value: 5, desc: 'Sand that hums when the wind passes.' },
            { name: 'Buried Bone Bead', type: 'material', value: 4, desc: 'A courtier\'s prayer bead from a lost dynasty.' }
        ],
        rare: [
            { name: 'Whistle Stone', type: 'legendary_material', value: 38, desc: 'Stone that echoes the buried king\'s voice.' },
            { name: 'Sandburrow Manual', type: 'technique', value: 18, technique: 'Sandburrow Palm', desc: 'Burrowing palm art from the singing dunes.' }
        ],
        ultra: [
            { name: 'Gilded Burial Mask', type: 'legendary_material', value: 55, desc: 'The Dune Sovereign\'s half-melted crown.' }
        ],
        techniques: ['Sandburrow Palm', 'Sandstorm Body Art']
    },
    root_of_world: {
        common: [
            { name: 'Vein Root Fiber', type: 'material', value: 6, desc: 'A thread of the continental spiritual root.' },
            { name: 'Nexus Dew', type: 'consumable', value: 5, desc: 'Condensed qi from where veins converge.' }
        ],
        rare: [
            { name: 'World-Root Splinter', type: 'legendary_material', value: 45, desc: 'A splinter of the root that predates sects.' },
            { name: 'Dao Essence', type: 'material', value: 14, desc: 'Pure understanding crystallized.' }
        ],
        ultra: [
            { name: 'Primordial Root Seed', type: 'legendary_material', value: 65, desc: 'Could grow a sect\'s formation array on its own.' }
        ],
        techniques: ['Root-Vein Surge', 'Heavenly Sword Qi', 'Storm Needle']
    },
    sunken_atoll: {
        common: [
            { name: 'Coral Script Fragment', type: 'material', value: 5, desc: 'Characters grown in living reef.' },
            { name: 'Tide Glass', type: 'material', value: 4, desc: 'Glass smoothed by a thousand tides.' }
        ],
        rare: [
            { name: 'Drowned Crown Coral', type: 'legendary_material', value: 42, desc: 'Coral shaped like a forgotten crown.' },
            { name: 'Maelstrom Lance Manual', type: 'technique', value: 20, technique: 'Maelstrom Lance', desc: 'Spear art from the drowned palace currents.' }
        ],
        ultra: [
            { name: 'Dragon-Tide Pearl', type: 'legendary_material', value: 58, desc: 'The Sleeper\'s dream made solid.' }
        ],
        techniques: ['Maelstrom Lance', 'Phantom Blade', 'Tide Spiral']
    },
    ashvein_caldera: {
        common: [
            { name: 'Ashvein Ember', type: 'material', value: 6, desc: 'Ember that never fully cools.' },
            { name: 'Volcanic Glass', type: 'material', value: 4, desc: 'Sharp glass from the caldera rim.' }
        ],
        rare: [
            { name: 'Caldera Heart Shard', type: 'legendary_material', value: 40, desc: 'A fragment of living flame.' },
            { name: 'Phoenix Ascent Scroll', type: 'technique', value: 20, technique: 'Phoenix Ascent Palm', desc: 'First flame-path teaching, ash-scorched.' }
        ],
        ultra: [
            { name: 'Primordial Ash Core', type: 'legendary_material', value: 62, desc: 'The Heart\'s breath crystallized.' }
        ],
        techniques: ['Phoenix Ascent Palm', 'Raging Ember Fist', 'Cinder Volley']
    }
};

const ANCIENT_CLUES = {
    frost_sun_never_rises: {
        id: 'frost_sun_never_rises',
        zone: 'frostbite',
        subZoneId: 'frozen_abyss',
        title: 'Dao Resonance Fragment',
        text: 'In the place where the sun never rises, something breathes beneath the ice.',
        flavor: 'The characters frost over as you read them.'
    },
    dune_whisper: {
        id: 'dune_whisper',
        zone: 'dustbone',
        subZoneId: 'whistling_dunes',
        title: 'Nomad Rumor',
        text: 'The sands sing where three bone spires point — follow the whistle at dusk.',
        flavor: 'A caravan guard scratched this into your travel token.'
    },
    heartlands_root: {
        id: 'heartlands_root',
        zone: 'heartlands',
        subZoneId: 'root_of_world',
        title: 'Sect Fragment',
        text: 'Where nine veins become one root, the old ones still dream.',
        flavor: 'Copied from a forbidden formation manual.'
    },
    jade_drowned_crown: {
        id: 'jade_drowned_crown',
        zone: 'jade',
        subZoneId: 'sunken_atoll',
        title: 'Pearl Diver\'s Tale',
        text: 'When the moon is thin, a crown of coral breaks the tide east of the Guild piers.',
        flavor: 'Salt-stained and smelling of deep water.'
    },
    ember_ash_heart: {
        id: 'ember_ash_heart',
        zone: 'emberwild',
        subZoneId: 'ashvein_caldera',
        title: 'Tribal Charcoal Sigil',
        text: 'The ash river bends where the volcano\'s heart still beats.',
        flavor: 'Warm to the touch despite the jungle chill.'
    }
};

const SEALED_ANCIENTS = {
    frostbound_sage: {
        id: 'frostbound_sage',
        name: 'The Frostbound Sage',
        emoji: '🧊',
        desc: 'A pre-heaven cultivator frozen mid-enlightenment — still conscious, still teaching.',
        log: '🧊 The Frostbound Sage opens one eye. "You carry warmth. Do not waste it."',
        bargain: {
            accept: {
                label: 'Accept the Sage\'s teaching',
                desc: 'Honor the frozen enlightenment — +Will, +Foundation, righteous path.',
                reward: { foundation: 6, fame: 10, will: 3 },
                alignment: 8
            },
            reject: {
                label: 'Drain the frozen enlightenment',
                desc: 'Steal pre-heaven insight — +Qi density, but the cold scars your dao.',
                reward: { foundation: 3, qiDensity: 1.2 },
                penalty: { daoAlignment: -12, maxHpBonus: -6 },
                alignment: -10
            }
        }
    },
    dune_sovereign: {
        id: 'dune_sovereign',
        name: 'The Dune Sovereign',
        emoji: '👑',
        desc: 'A desert king whose court was buried alive to cheat heavenly judgment.',
        log: '👑 Sand falls from a gilded mask. "Kneel, or inherit."',
        bargain: {
            accept: {
                label: 'Kneel and inherit the crown\'s duty',
                desc: 'Accept burial-king legacy — stones and fame, but heavy responsibility.',
                reward: { foundation: 4, fame: 10, stones: 50 },
                alignment: 5
            },
            reject: {
                label: 'Plunder the buried court',
                desc: 'Take the hoard and flee — great wealth, grave dao debt.',
                reward: { stones: 90, foundation: 2 },
                penalty: { daoAlignment: -15, fame: -5 },
                alignment: -12
            }
        }
    },
    root_warden: {
        id: 'root_warden',
        name: 'The Root Warden',
        emoji: '🌳',
        desc: 'A guardian bound to the continent\'s spiritual root since before sects existed.',
        log: '🌳 Roots part like curtains. "The world remembers those who listen."',
        bargain: {
            accept: {
                label: 'Listen to the World-Root',
                desc: 'Align with continental veins — spirit and foundation rise.',
                reward: { foundation: 8, fame: 12, spirit: 3 },
                alignment: 10
            },
            reject: {
                label: 'Sever a root vein for power',
                desc: 'Rip power from the nexus — density surges, alignment shatters.',
                reward: { qiDensity: 1.8, foundation: 4 },
                penalty: { daoAlignment: -18, spirit: -2 },
                alignment: -15
            }
        }
    },
    tide_sleeper: {
        id: 'tide_sleeper',
        name: 'The Tide Sleeper',
        emoji: '🐚',
        desc: 'A dragon-touched immortal dreaming the tides — wake them carefully.',
        log: '🐚 Bubbles rise in a pattern like scripture. The Sleeper stirs.',
        bargain: {
            accept: {
                label: 'Wake them with reverence',
                desc: 'Gentle awakening — balanced boons from the tide-dream.',
                reward: { foundation: 5, fame: 9, spirit: 2 },
                alignment: 6
            },
            reject: {
                label: 'Harvest the dream while they sleep',
                desc: 'Steal dragon-tide essence — spirit now, emptiness later.',
                reward: { spirit: 4, stones: 35 },
                penalty: { daoAlignment: -10, will: -2 },
                alignment: -8
            }
        }
    },
    caldera_heart: {
        id: 'caldera_heart',
        name: 'The Caldera Heart',
        emoji: '🔥',
        desc: 'Not a person — a living flame that once taught the first fire-path cultivators.',
        log: '🔥 Ash becomes light. The Heart speaks in crackling truths.',
        bargain: {
            accept: {
                label: 'Receive the First Flame\'s blessing',
                desc: 'Fire-path vitality and righteous fame.',
                reward: { foundation: 5, fame: 8, vitality: 3 },
                alignment: 5
            },
            reject: {
                label: 'Devour the living flame',
                desc: 'Consume the Heart — power now, your dao burns unevenly forever.',
                reward: { vitality: 5, qiDensity: 1.0, dmgMult: 0.05 },
                penalty: { daoAlignment: -14, maxHpBonus: -10 },
                alignment: -12
            }
        }
    }
};

const ANCIENTS_BALANCE = {
    clueExploreChance: 0.09,
    perceptionPerPercent: 2,
    perceptionCap: 12,
    famePerPercent: 0.4,
    fameCap: 8,
    searchQiCost: 12,
    searchMinRealm: 0,
    competitionPenaltyPerUnseal: 5,
    competitionPenaltyCap: 20,
    subzoneManualChance: 0.2,
    subzoneUltraChance: 0.08,
    subzoneRareChance: 0.26,
    npcTalkClueChance: 0.22
};

// ===== ZONE FACTIONS — Azure Sky Continent power structures =====
const FACTION_TIERS = [
    { id: 'hostile', label: 'Hostile', emoji: '💀', min: -100, max: -25 },
    { id: 'wary', label: 'Wary', emoji: '😐', min: -24, max: 14 },
    { id: 'known', label: 'Known', emoji: '🙂', min: 15, max: 29 },
    { id: 'friendly', label: 'Friendly', emoji: '🌿', min: 30, max: 59 },
    { id: 'allied', label: 'Allied', emoji: '⭐', min: 60, max: 100 }
];

const ZONE_FACTION_MECHANICS = {
    frostbite: {
        zoneId: 'frostbite',
        label: 'Isolation Penalty',
        emoji: '❄️',
        powerName: 'Frostpeak Monastery',
        whyNotConquered: 'The Wastes are barren — conquering them costs more than they are worth.',
        desc: 'Reclusive ascetics who ward the ice, not rule it. Outsiders must earn trust before trade or training.',
        implemented: true,
        isolationThreshold: 15,
        factionIds: ['frostpeak_monastery']
    },
    dustbone: {
        zoneId: 'dustbone',
        label: 'Tribal Favor',
        emoji: '🏜️',
        powerName: 'Sandveil Tribunal',
        whyNotConquered: 'The desert is vast and hostile; the tribes are masters of survival.',
        desc: 'Three tribes in a fragile alliance — Sunscar warriors, Dune Rider merchants, Ashen mystics.',
        implemented: true,
        exclusiveAllied: true,
        factionIds: ['sunscar_clan', 'dune_riders', 'ashen_priests']
    },
    heartlands: {
        zoneId: 'heartlands',
        label: 'Faction Reputation',
        emoji: '🏯',
        powerName: 'Four Powerhouse Sects',
        whyNotConquered: 'They are too busy watching each other to conquer the continent.',
        desc: 'Celestial Sword, Jade Lotus, Void Temple, and Golden Phoenix — a cold war of prestige and blades.',
        implemented: true,
        factionIds: ['celestial_sword', 'jade_lotus', 'void_temple', 'golden_phoenix']
    },
    jade: {
        zoneId: 'jade',
        label: 'Oceanic Favor',
        emoji: '🌊',
        powerName: 'Storm Dragon & Tidal Lotus',
        whyNotConquered: 'The sea equalizes power — Heartlands armies cannot project across the ocean.',
        desc: 'Twin rival sects who need each other to survive the archipelago tides.',
        implemented: true,
        factionIds: ['storm_dragon', 'tidal_lotus']
    },
    emberwild: {
        zoneId: 'emberwild',
        label: 'Beast Affinity',
        emoji: '🌋',
        powerName: 'Emberwild Collective',
        whyNotConquered: 'The jungle is actively hostile; the Collective is the jungle.',
        desc: 'Beast tamers, druids, and wild cultivators who serve the green, not a throne.',
        implemented: true,
        factionIds: ['emberwild_collective']
    }
};

const FACTION_DEFINITIONS = {
    frostpeak_monastery: {
        id: 'frostpeak_monastery', zone: 'frostbite', name: 'Frostpeak Monastery', emoji: '🏔️',
        type: 'ascetic', desc: 'Cold, distant wardens of the Wastes.',
        perks: { friendly: { coldResistPct: 5 }, allied: { coldResistPct: 10 } },
        ancientClueAt: 'friendly', ancientClueId: 'frost_sun_never_rises'
    },
    sunscar_clan: {
        id: 'sunscar_clan', zone: 'dustbone', name: 'Sunscar Clan', emoji: '☀️',
        type: 'warrior', desc: 'Desert warriors who bleed for honor.',
        rivals: ['dune_riders', 'ashen_priests'],
        perks: { friendly: { combatDmgPct: 5 }, allied: { combatDmgPct: 10 } }
    },
    dune_riders: {
        id: 'dune_riders', zone: 'dustbone', name: 'Dune Riders', emoji: '🐪',
        type: 'merchant', desc: 'Caravan masters of the singing sands.',
        rivals: ['sunscar_clan', 'ashen_priests'],
        perks: { friendly: { marketDiscountPct: 8 }, allied: { marketDiscountPct: 15, tradeIncomePct: 20 } }
    },
    ashen_priests: {
        id: 'ashen_priests', zone: 'dustbone', name: 'Ashen Priests', emoji: '🔥',
        type: 'mystic', desc: 'Mystics who read omens in bone-ash.',
        rivals: ['sunscar_clan', 'dune_riders'],
        perks: { friendly: { daoSpeedPct: 5 }, allied: { daoSpeedPct: 10 } }
    },
    celestial_sword: {
        id: 'celestial_sword', zone: 'heartlands', name: 'Celestial Sword Sect', emoji: '⚔️',
        type: 'combat', desc: 'Blade-first cultivators who measure worth in duels won.',
        rivals: ['golden_phoenix'], allies: ['jade_lotus'],
        perks: { friendly: { combatDmgPct: 5 }, allied: { combatDmgPct: 10 } },
        marketUnlock: { minTier: 'friendly', techniques: ['Heavenly Palm'] }
    },
    jade_lotus: {
        id: 'jade_lotus', zone: 'heartlands', name: 'Jade Lotus Sect', emoji: '🪷',
        type: 'politics', desc: 'Trade routes, influence, and political favor woven like silk.',
        rivals: ['golden_phoenix'], allies: ['celestial_sword', 'void_temple'],
        perks: { friendly: { marketDiscountPct: 10 }, allied: { marketDiscountPct: 18, tradeIncomePct: 8 } }
    },
    void_temple: {
        id: 'void_temple', zone: 'heartlands', name: 'Void Temple', emoji: '🌌',
        type: 'dao', desc: 'Esoteric scholars who guard pre-heaven knowledge — including sealed-site rumors.',
        rivals: ['golden_phoenix'], allies: ['jade_lotus'],
        perks: { friendly: { daoSpeedPct: 6 }, allied: { daoSpeedPct: 10 } },
        ancientClueAt: 'friendly', ancientClueId: 'heartlands_root'
    },
    golden_phoenix: {
        id: 'golden_phoenix', zone: 'heartlands', name: 'Golden Phoenix Sect', emoji: '🔥',
        type: 'ambitious', desc: 'Expansionists plotting to absorb the Jade Lotus — power at a cost.',
        rivals: ['jade_lotus', 'celestial_sword', 'void_temple'],
        perks: { friendly: { foundationBonus: 2 }, allied: { foundationBonus: 4, combatDmgPct: 5 } },
        alignmentCost: { friendly: -2, allied: -4 }
    },
    storm_dragon: {
        id: 'storm_dragon', zone: 'jade', name: 'Storm Dragon Sect', emoji: '🐉',
        type: 'warrior', desc: 'Controls the sea routes between islands.',
        rivals: ['tidal_lotus'], allies: ['tidal_lotus'],
        perks: { friendly: { exploreBonusPct: 5 }, allied: { exploreBonusPct: 12, combatDmgPct: 5 } },
        subZoneGate: { subZoneId: 'sunken_atoll', minRep: 25, searchBonus: 12 }
    },
    tidal_lotus: {
        id: 'tidal_lotus', zone: 'jade', name: 'Tidal Lotus Sect', emoji: '🪷',
        type: 'mystic', desc: 'Depth-dwelling mystics tied to the drowned reefs.',
        rivals: ['storm_dragon'], allies: ['storm_dragon'],
        perks: { friendly: { spiritBonus: 1 }, allied: { spiritBonus: 2, daoSpeedPct: 5 } },
        ancientClueAt: 'friendly', ancientClueId: 'jade_drowned_crown'
    },
    emberwild_collective: {
        id: 'emberwild_collective', zone: 'emberwild', name: 'Emberwild Collective', emoji: '🌿',
        type: 'primal', desc: 'Loose coalition of beast tamers and jungle druids.',
        perks: { friendly: { beastAffinityPct: 8 }, allied: { beastAffinityPct: 15, exploreBonusPct: 5 } },
        ancientClueAt: 'friendly', ancientClueId: 'ember_ash_heart'
    }
};

const FACTION_ACTIONS = {
    pay_respects: {
        id: 'pay_respects', label: 'Pay Respects', emoji: '🙏',
        months: 2, stones: 8, rep: 4, alignment: 2,
        desc: 'Formal courtesy at their gates.'
    },
    donate_resources: {
        id: 'donate_resources', label: 'Donate Resources', emoji: '💎',
        months: 1, stones: 30, rep: 10, alignment: 3,
        desc: 'Spirit stones and supplies for their halls.'
    },
    spread_rumors: {
        id: 'spread_rumors', label: 'Undermine Rival', emoji: '🗣️',
        months: 3, stones: 15, rep: 6, alignment: -4,
        rivalRep: -8, desc: 'Whisper against a rival sect — risky politics.'
    },
    offer_tribute: {
        id: 'offer_tribute', label: 'Offer Tribute', emoji: '🏆',
        months: 2, stones: 0, rep: 14, alignment: 3,
        requiresLegendary: true, factions: ['frostpeak_monastery'],
        desc: 'Present a legendary material to earn the Monastery\'s trust.'
    },
    offer_herbs: {
        id: 'offer_herbs', label: 'Offer Spirit Herbs', emoji: '🌿',
        months: 1, stones: 12, rep: 8, alignment: 4,
        factions: ['emberwild_collective'],
        desc: 'Rare herbs as a sign of respect for the jungle.'
    },
    broker_peace: {
        id: 'broker_peace', label: 'Broker Tribal Peace', emoji: '🕊️',
        months: 6, stones: 20, rep: 0, alignment: 8,
        zones: ['dustbone'], special: 'broker_peace',
        desc: 'Mediate between the three tribes — unlocks grand treaty.'
    },
    incite_rivalry: {
        id: 'incite_rivalry', label: 'Incite Tribal Rivalry', emoji: '⚔️',
        months: 3, stones: 10, rep: 5, alignment: -8,
        zones: ['dustbone'], special: 'incite_rivalry',
        desc: 'Pit tribes against each other for personal gain.'
    },
    petition_sea_route: {
        id: 'petition_sea_route', label: 'Petition Sea Route', emoji: '⛵',
        months: 2, stones: 15, rep: 6, alignment: 2,
        factions: ['storm_dragon'],
        desc: 'Request passage rights from the Storm Dragon Sect.'
    }
};

const FACTION_SECT_PACTS = {
    celestial_sword_covenant: {
        id: 'celestial_sword_covenant', factionId: 'celestial_sword',
        label: 'Blade Covenant', emoji: '⚔️',
        desc: 'Your sect swears to answer Sword Sect calls to arms.',
        minRep: 35, requiresSect: true, months: 6, stones: 40,
        effects: { combatDmgPct: 5, sectRenown: 5 }
    },
    jade_lotus_trade: {
        id: 'jade_lotus_trade', factionId: 'jade_lotus',
        label: 'Lotus Trade Accord', emoji: '🪷',
        desc: 'Formal trade pact with the Jade Lotus merchant houses.',
        minRep: 30, requiresSect: true, months: 4, stones: 35,
        effects: { tradeIncomePct: 10, marketDiscountPct: 5 }
    },
    void_temple_scholarship: {
        id: 'void_temple_scholarship', factionId: 'void_temple',
        label: 'Void Scholarship', emoji: '🌌',
        desc: 'Your disciples study at the Void Temple archives.',
        minRep: 40, requiresSect: true, months: 8, stones: 50,
        effects: { daoSpeedPct: 8, foundation: 3 }
    },
    storm_dragon_convoy: {
        id: 'storm_dragon_convoy', factionId: 'storm_dragon',
        label: 'Dragon Convoy Guard', emoji: '🐉',
        desc: 'Your sect escorts Storm Dragon trade fleets.',
        minRep: 30, requiresSect: true, months: 5, stones: 30,
        effects: { exploreBonusPct: 8, stones: 20 }
    },
    frostpeak_ice_covenant: {
        id: 'frostpeak_ice_covenant', factionId: 'frostpeak_monastery',
        label: 'Ice-Witness Covenant', emoji: '🏔️',
        desc: 'Your sect witnesses frost tribulations with the Monastery.',
        minRep: 35, requiresSect: true, months: 6, stones: 35,
        effects: { coldResistPct: 8, daoSpeedPct: 4 }
    },
    sunscar_blood_oath: {
        id: 'sunscar_blood_oath', factionId: 'sunscar_clan',
        label: 'Blood Oath', emoji: '☀️',
        desc: 'Your sect swears blood-oaths with the Sunscar warriors.',
        minRep: 35, requiresSect: true, months: 5, stones: 30,
        effects: { combatDmgPct: 6, sectRenown: 4 }
    },
    dune_caravan_accord: {
        id: 'dune_caravan_accord', factionId: 'dune_riders',
        label: 'Caravan Accord', emoji: '🐪',
        desc: 'Joint caravan rights across the singing sands.',
        minRep: 30, requiresSect: true, months: 4, stones: 30,
        effects: { tradeIncomePct: 12, marketDiscountPct: 6 }
    },
    ashen_omen_pact: {
        id: 'ashen_omen_pact', factionId: 'ashen_priests',
        label: 'Omen Pact', emoji: '🔥',
        desc: 'Ashen Priests read your sect\'s fate in bone-ash.',
        minRep: 35, requiresSect: true, months: 6, stones: 25,
        effects: { exploreBonusPct: 6, foundation: 2 }
    },
    tidal_reef_pact: {
        id: 'tidal_reef_pact', factionId: 'tidal_lotus',
        label: 'Reef Pact', emoji: '🪷',
        desc: 'Tidal Lotus shamans bless your sect\'s spirit.',
        minRep: 30, requiresSect: true, months: 5, stones: 35,
        effects: { spiritBonus: 2, daoSpeedPct: 5 }
    },
    emberwild_beast_truce: {
        id: 'emberwild_beast_truce', factionId: 'emberwild_collective',
        label: 'Beast Truce', emoji: '🌿',
        desc: 'Your sect walks the jungle without provoking the Collective.',
        minRep: 30, requiresSect: true, months: 4, stones: 25,
        effects: { beastAffinityPct: 10, exploreBonusPct: 5 }
    }
};

const FACTION_NPCS = {
    faction_frost_warden: {
        id: 'faction_frost_warden', factionId: 'frostpeak_monastery', zone: 'frostbite',
        name: 'Warden Yun', emoji: '🏔️', title: 'Monastery Gatekeeper',
        greet: 'The cold judges all who climb. State your purpose — if you have one.'
    },
    faction_sunscar_chief: {
        id: 'faction_sunscar_chief', factionId: 'sunscar_clan', zone: 'dustbone',
        name: 'Chief Rakhul', emoji: '☀️', title: 'Sunscar War-Chief',
        greet: 'The desert takes the weak. Prove you are not sand.'
    },
    faction_dune_elder: {
        id: 'faction_dune_elder', factionId: 'dune_riders', zone: 'dustbone',
        name: 'Elder Miraj', emoji: '🐪', title: 'Dune Riders Caravan Elder',
        greet: 'Coin opens many paths. Honor opens more.'
    },
    faction_ashen_seer: {
        id: 'faction_ashen_seer', factionId: 'ashen_priests', zone: 'dustbone',
        name: 'Seer Asha', emoji: '🔥', title: 'Ashen Priest Oracle',
        greet: 'The bones have spoken of you. I wonder if they lie.'
    },
    faction_sword_elder: {
        id: 'faction_sword_elder', factionId: 'celestial_sword', zone: 'heartlands',
        name: 'Elder Blade Feng', emoji: '⚔️', title: 'Celestial Sword Elder',
        greet: 'Draw your intent, not your sword — unless you must.'
    },
    faction_lotus_envoy: {
        id: 'faction_lotus_envoy', factionId: 'jade_lotus', zone: 'heartlands',
        name: 'Envoy Lin Mei', emoji: '🪷', title: 'Jade Lotus Trade Envoy',
        greet: 'Every favor has a price. I merely name mine early.'
    },
    faction_void_adept: {
        id: 'faction_void_adept', factionId: 'void_temple', zone: 'heartlands',
        name: 'Adept Silent Moon', emoji: '🌌', title: 'Void Temple Scholar',
        greet: 'Knowledge is a blade with no hilt. Handle with care.'
    },
    faction_phoenix_herald: {
        id: 'faction_phoenix_herald', factionId: 'golden_phoenix', zone: 'heartlands',
        name: 'Herald Jin Rao', emoji: '🔥', title: 'Golden Phoenix Herald',
        greet: 'The Phoenix rises. Will you rise with it — or be ash?'
    },
    faction_storm_captain: {
        id: 'faction_storm_captain', factionId: 'storm_dragon', zone: 'jade',
        name: 'Captain Lei', emoji: '🐉', title: 'Storm Dragon Fleet Captain',
        greet: 'The tide respects strength. The Dragon respects both.'
    },
    faction_tidal_shaman: {
        id: 'faction_tidal_shaman', factionId: 'tidal_lotus', zone: 'jade',
        name: 'Shaman Coral', emoji: '🪷', title: 'Tidal Lotus Depth Shaman',
        greet: 'The drowned remember what the living forget.'
    },
    faction_beast_keeper: {
        id: 'faction_beast_keeper', factionId: 'emberwild_collective', zone: 'emberwild',
        name: 'Keeper Moss', emoji: '🌿', title: 'Emberwild Beast Keeper',
        greet: 'The jungle listens. Make sure it hears respect.'
    }
};

const FACTION_QUESTS = {
    celestial_sword_trial: {
        id: 'celestial_sword_trial',
        factionId: 'celestial_sword',
        zone: 'heartlands',
        title: 'Celestial Trial',
        emoji: '⚔️',
        objective: 'Win a combat while in the Heartlands to prove your blade.',
        completeOn: 'combat',
        minRep: 0,
        months: 6,
        rewards: { rep: 12, fame: 4, foundation: 2, alignment: 3 }
    },
    jade_lotus_envoy: {
        id: 'jade_lotus_envoy',
        factionId: 'jade_lotus',
        zone: 'heartlands',
        title: 'Lotus Envoy',
        emoji: '🪷',
        objective: 'Complete a diplomacy action on any world sect while allied with trade interests.',
        completeOn: 'diplomacy',
        minRep: 10,
        months: 8,
        rewards: { rep: 10, fame: 3, stones: 25, alignment: 4 }
    },
    void_temple_lecture: {
        id: 'void_temple_lecture',
        factionId: 'void_temple',
        zone: 'heartlands',
        title: 'Void Lecture',
        emoji: '🌌',
        objective: 'Explore the Heartlands and meditate on a Dao lecture.',
        completeOn: 'explore',
        minRep: 5,
        months: 4,
        rewards: { rep: 8, foundation: 3, alignment: 5 }
    },
    golden_phoenix_fealty: {
        id: 'golden_phoenix_fealty',
        factionId: 'golden_phoenix',
        zone: 'heartlands',
        title: 'Phoenix Fealty',
        emoji: '🔥',
        objective: 'Raid a hostile world sect to impress the Golden Phoenix.',
        completeOn: 'raid',
        minRep: 0,
        months: 6,
        rewards: { rep: 14, fame: 5, alignment: -6 }
    },
    frostpeak_tribulation: {
        id: 'frostpeak_tribulation', factionId: 'frostpeak_monastery', zone: 'frostbite',
        title: 'Ice-Witnessed Tribulation', emoji: '🏔️',
        objective: 'Survive heavenly tribulation while in the Frostbite Wastes.',
        completeOn: 'tribulation_pass', minRep: 0, months: 24,
        rewards: { rep: 18, fame: 5, alignment: 5 }
    },
    dustbone_defend_caravan: {
        id: 'dustbone_defend_caravan', factionId: 'dune_riders', zone: 'dustbone',
        title: 'Caravan Defense', emoji: '🐪',
        objective: 'Win combat in Dustbone to defend tribal trade routes.',
        completeOn: 'combat', minRep: 5, months: 6,
        rewards: { rep: 10, stones: 20, alignment: 3 }
    },
    dustbone_broker_treaty: {
        id: 'dustbone_broker_treaty', factionId: 'ashen_priests', zone: 'dustbone',
        title: 'Grand Sandveil Treaty', emoji: '🕊️',
        objective: 'Broker peace between all three tribes (use Factions panel).',
        completeOn: 'manual', minRep: 20, months: 12,
        rewards: { rep: 15, fame: 8, alignment: 10 }
    },
    jade_sea_beast: {
        id: 'jade_sea_beast', factionId: 'storm_dragon', zone: 'jade',
        title: 'Leviathan Hunt', emoji: '🐉',
        objective: 'Win combat in the Archipelago during the sea beast crisis.',
        completeOn: 'combat', minRep: 10, months: 8,
        rewards: { rep: 12, fame: 6, foundation: 3 }
    },
    emberwild_hunt_corruption: {
        id: 'emberwild_hunt_corruption', factionId: 'emberwild_collective', zone: 'emberwild',
        title: 'Purify the Corrupted Beast', emoji: '🌿',
        objective: 'Win combat in Emberwild to slay the demonic beast.',
        completeOn: 'combat', minRep: 5, months: 10,
        rewards: { rep: 14, fame: 5, alignment: 6 }
    },
    elder_frost_paths: {
        id: 'elder_frost_paths', factionId: 'frostpeak_monastery', zone: 'frostbite',
        title: 'Paths of the Ice', emoji: '🏔️', elderOnly: true,
        objective: 'Explore the Frostbite Wastes while the Warden watches.',
        completeOn: 'explore', minRep: 30, months: 8,
        rewards: { rep: 10, fame: 3, alignment: 4 }
    },
    elder_sunscar_champion: {
        id: 'elder_sunscar_champion', factionId: 'sunscar_clan', zone: 'dustbone',
        title: 'Sunscar Champion', emoji: '☀️', elderOnly: true,
        objective: 'Win combat in Dustbone to prove your blade to the Chief.',
        completeOn: 'combat', minRep: 25, months: 6,
        rewards: { rep: 12, fame: 4, foundation: 2 }
    },
    elder_dune_convoy: {
        id: 'elder_dune_convoy', factionId: 'dune_riders', zone: 'dustbone',
        title: 'Caravan Escort', emoji: '🐪', elderOnly: true,
        objective: 'Explore Dustbone to escort a Dune Riders caravan.',
        completeOn: 'explore', minRep: 25, months: 6,
        rewards: { rep: 10, stones: 25, alignment: 3 }
    },
    elder_ashen_omen: {
        id: 'elder_ashen_omen', factionId: 'ashen_priests', zone: 'dustbone',
        title: 'Read the Omens', emoji: '🔥', elderOnly: true,
        objective: 'Explore Dustbone while the Seer reads your fate.',
        completeOn: 'explore', minRep: 30, months: 8,
        rewards: { rep: 10, alignment: 5, foundation: 2 }
    },
    elder_sword_audience: {
        id: 'elder_sword_audience', factionId: 'celestial_sword', zone: 'heartlands',
        title: 'Blade Audience', emoji: '⚔️', elderOnly: true,
        objective: 'Win combat in the Heartlands before Elder Feng.',
        completeOn: 'combat', minRep: 20, months: 6,
        rewards: { rep: 12, fame: 5, alignment: 3 }
    },
    elder_lotus_envoy: {
        id: 'elder_lotus_envoy', factionId: 'jade_lotus', zone: 'heartlands',
        title: 'Lotus Errand', emoji: '🪷', elderOnly: true,
        objective: 'Complete diplomacy with a world sect for Envoy Lin Mei.',
        completeOn: 'diplomacy', minRep: 25, months: 10,
        rewards: { rep: 12, stones: 30, alignment: 4 }
    },
    elder_void_archive: {
        id: 'elder_void_archive', factionId: 'void_temple', zone: 'heartlands',
        title: 'Void Archive Study', emoji: '🌌', elderOnly: true,
        objective: 'Explore the Heartlands after studying Void Temple archives.',
        completeOn: 'explore', minRep: 30, months: 8,
        rewards: { rep: 10, foundation: 4, alignment: 6 }
    },
    elder_phoenix_oath: {
        id: 'elder_phoenix_oath', factionId: 'golden_phoenix', zone: 'heartlands',
        title: 'Phoenix Oath', emoji: '🔥', elderOnly: true,
        objective: 'Raid a hostile world sect to impress the Phoenix Herald.',
        completeOn: 'raid', minRep: 20, months: 8,
        rewards: { rep: 14, fame: 6, alignment: -5 }
    },
    elder_storm_patrol: {
        id: 'elder_storm_patrol', factionId: 'storm_dragon', zone: 'jade',
        title: 'Storm Patrol', emoji: '🐉', elderOnly: true,
        objective: 'Win combat in the Archipelago on Storm Dragon patrol.',
        completeOn: 'combat', minRep: 25, months: 6,
        rewards: { rep: 12, fame: 4, foundation: 2 }
    },
    elder_tidal_depths: {
        id: 'elder_tidal_depths', factionId: 'tidal_lotus', zone: 'jade',
        title: 'Depths Meditation', emoji: '🪷', elderOnly: true,
        objective: 'Explore the Archipelago after Tidal Lotus meditation.',
        completeOn: 'explore', minRep: 25, months: 8,
        rewards: { rep: 10, spirit: 2, alignment: 4 }
    },
    elder_beast_walk: {
        id: 'elder_beast_walk', factionId: 'emberwild_collective', zone: 'emberwild',
        title: 'Respectful Walk', emoji: '🌿', elderOnly: true,
        objective: 'Explore Emberwild without slaying beasts (3 respectful walks).',
        completeOn: 'emberwild_respect', minRep: 25, months: 10,
        rewards: { rep: 14, alignment: 8, foundation: 2 }
    }
};

const FACTION_NPC_CLUE_HOOKS = {
    faction_void_adept: { clueId: 'heartlands_root', minRep: 30, talkChance: 0.35 },
    faction_storm_captain: { clueId: 'jade_drowned_crown', minRep: 25, talkChance: 0.3 },
    faction_beast_keeper: { clueId: 'ember_ash_heart', minRep: 25, talkChance: 0.28 },
    faction_frost_warden: { clueId: 'frost_sun_never_rises', minRep: 30, talkChance: 0.25 },
    faction_ashen_seer: { clueId: 'dune_whisper', minRep: 25, talkChance: 0.3 }
};

const FACTION_BALANCE = {
    repMin: -100,
    repMax: 100,
    rivalDrainPct: 0.35,
    exploreEventChance: 0.2,
    heartlandsExploreEventChance: 0.2,
    phoenixPlotMinRep: 22,
    phoenixPlotJadeMin: 10,
    seaBeastMinCombinedRep: 35,
    emberwildBeastKillPenalty: 8,
    emberwildRespectExploreBonus: 3,
    frostIsolationThreshold: 15
};

const FACTION_EXPLORE_EVENTS = {
    heartlands: [
        { id: 'sword_spar', factionId: 'celestial_sword', rep: 3, text: 'A Sword Sect outer disciple spars with you — respect is earned.', alignment: 1 },
        { id: 'lotus_tea', factionId: 'jade_lotus', rep: 4, text: 'Jade Lotus envoys share tea and trade gossip.', alignment: 2 },
        { id: 'void_fragment', factionId: 'void_temple', rep: 3, text: 'Void Temple acolytes trade a scripture fragment for your insight.', alignment: 3 },
        { id: 'phoenix_envoy', factionId: 'golden_phoenix', rep: 2, text: 'Golden Phoenix recruiters watch you — their smiles are sharp.', alignment: -1 },
        { id: 'sect_scandal', factionId: 'jade_lotus', rep: -4, rivalId: 'golden_phoenix', rivalRep: 3, text: 'You stumble into a Phoenix plot against the Lotus — choose your silence carefully.', alignment: -2 }
    ],
    frostbite: [
        { id: 'frost_patrol', factionId: 'frostpeak_monastery', rep: 2, text: 'Monastery patrols observe you without speaking — a test of patience.', alignment: 1 },
        { id: 'ice_hermit', factionId: 'frostpeak_monastery', rep: 4, text: 'A hermit shares frost-path insight after you endure the cold in silence.', alignment: 2 }
    ],
    dustbone: [
        { id: 'tribal_skirmish', factionId: 'sunscar_clan', rep: 3, rivalId: 'dune_riders', rivalRep: -2, text: 'You mediate a minor skirmish between Sunscar warriors and Dune Riders.', alignment: 2 },
        { id: 'omen_ash', factionId: 'ashen_priests', rep: 4, text: 'Ashen Priests read your fate in bone-ash — favorable omens.', alignment: 1 }
    ],
    jade: [
        { id: 'storm_patrol', factionId: 'storm_dragon', rep: 3, text: 'Storm Dragon patrol boats salute your passage.', alignment: 1 },
        { id: 'tidal_vision', factionId: 'tidal_lotus', rep: 3, text: 'Tidal Lotus shamans share a dream of drowned treasure.', alignment: 2 }
    ],
    emberwild: [
        { id: 'beast_truce', factionId: 'emberwild_collective', rep: 4, text: 'A beast keeper shows you how to walk without provoking the jungle.', alignment: 3 },
        { id: 'corruption_scent', factionId: 'emberwild_collective', rep: 2, text: 'The Collective warns of demonic corruption deeper in the green.', alignment: 1 }
    ]
};

const PHOENIX_WAR_STAGES = {
    1: { label: 'Rumors of War', desc: 'Golden Phoenix agents mobilize in the Heartlands.' },
    2: { label: 'Lotus Siege', desc: 'Jade Lotus outer halls are surrounded.' },
    3: { label: 'Open Conflict', desc: 'The cold war becomes blood — choose the victor.' }
};

const LOTUS_WAR_STAGES = {
    1: { label: 'Lotus Fortifies', desc: 'Jade Lotus seals their halls and calls in debts.' },
    2: { label: 'Phoenix Frustrated', desc: 'Golden Phoenix envoys rage — their plot unravels.' },
    3: { label: 'The Stand', desc: 'The Heartlands hold their breath — the Lotus must survive or fall.' }
};

const EXPLOIT_WAR_STAGES = {
    1: { label: 'Mutual Suspicion', desc: 'Both sects question your motives after the Gambit.' },
    2: { label: 'The Hunt', desc: 'Phoenix and Lotus envoys close in — someone sold you out.' },
    3: { label: 'Blackmail Window', desc: 'Secrets surface — profit or be exposed.' }
};

// ===== SECT SYSTEM =====
const SECT_STAGES = {
    wandering: {
        id: 'wandering',
        order: 0,
        label: 'Wandering Cultivator',
        emoji: '🚶',
        desc: 'No sect — you walk the path alone.',
        allowsRecruit: false,
        allowsBuildings: false,
        allowsConflicts: false
    },
    founding: {
        id: 'founding',
        order: 1,
        label: 'Founding Sect',
        emoji: '🏗️',
        desc: 'A name on the wind. Basic halls and first disciples.',
        allowsRecruit: true,
        allowsBuildings: true,
        allowsConflicts: false,
        next: 'established',
        advanceReq: { renown: 15, disciples: 2, buildingLevels: 1 }
    },
    established: {
        id: 'established',
        order: 2,
        label: 'Established Sect',
        emoji: '🏯',
        desc: 'Recognized locally. Passive income and advanced halls.',
        allowsRecruit: true,
        allowsBuildings: true,
        allowsConflicts: true,
        next: 'regional',
        advanceReq: { renown: 40, disciples: 5, realmIdx: 2 }
    },
    regional: {
        id: 'regional',
        order: 3,
        label: 'Regional Power',
        emoji: '⚔️',
        desc: 'Influence over a zone. Rivals take notice.',
        allowsRecruit: true,
        allowsBuildings: true,
        allowsConflicts: true,
        next: 'continental',
        advanceReq: { renown: 80, disciples: 8, realmIdx: 4 }
    },
    continental: {
        id: 'continental',
        order: 4,
        label: 'Continental Power',
        emoji: '🌏',
        desc: 'Known across Azure Sky. Wars and alliances matter.',
        allowsRecruit: true,
        allowsBuildings: true,
        allowsConflicts: true,
        next: 'heavenly',
        advanceReq: { renown: 150, disciples: 12, realmIdx: 5 }
    },
    heavenly: {
        id: 'heavenly',
        order: 5,
        label: 'Heavenly Sect',
        emoji: '✨',
        desc: 'Post-immortal influence. The continent kneels or rebels.',
        allowsRecruit: true,
        allowsBuildings: true,
        allowsConflicts: true
    }
};

const SECT_FOUNDING = {
    fameMin: 10,
    stones: 30,
    months: 12,
    renownGain: 5,
    fameGain: 3
};

const SECT_ALIGNMENT_TAGS = {
    righteous: { min: 40, label: 'Righteous Order', emoji: '☀️' },
    balanced: { min: -39, max: 39, label: 'Balanced Peak', emoji: '☯️' },
    demonic: { max: -40, label: 'Shadow Sect', emoji: '🌑' }
};

const SECT_DOCTRINES = {
    righteous: {
        id: 'righteous',
        label: 'Righteous Path',
        emoji: '☀️',
        subtitle: 'Heavenly Dao',
        desc: 'NPCs treat you with respect. Easier recruitment. +10% Renown gain.',
        renownMult: 1.1,
        incomeMult: 1,
        combatMult: 1,
        recruitTalkReduction: 1,
        tradePriceMult: 1,
        npcMoodShift: 1
    },
    balanced: {
        id: 'balanced',
        label: 'Balanced Path',
        emoji: '☯️',
        subtitle: 'Worldly Dao',
        desc: 'Neutral dealings with the jianghu. Better trade prices. +10% sect income.',
        renownMult: 1,
        incomeMult: 1.1,
        combatMult: 1,
        recruitTalkReduction: 0,
        tradePriceMult: 0.9,
        npcMoodShift: 0
    },
    shadow: {
        id: 'shadow',
        label: 'Shadow Path',
        emoji: '🌑',
        subtitle: 'Selfish Dao',
        desc: 'Suspicion from others. Easier intimidation. +10% combat power.',
        renownMult: 1,
        incomeMult: 1,
        combatMult: 1.1,
        recruitTalkReduction: 0,
        tradePriceMult: 1.12,
        npcMoodShift: -1,
        intimidateWillReduction: 2
    }
};

const SECT_REPUTATION_TIERS = {
    unknown: {
        id: 'unknown',
        label: 'Unknown',
        emoji: '❓',
        desc: 'The jianghu has not yet judged your sect.'
    },
    respected: {
        id: 'respected',
        label: 'Respected',
        emoji: '🌿',
        desc: 'Villages and honest cultivators speak well of you.',
        threshold: 12
    },
    feared: {
        id: 'feared',
        label: 'Feared',
        emoji: '😨',
        desc: 'Enemies hesitate before your banners.',
        threshold: 12
    },
    reviled: {
        id: 'reviled',
        label: 'Reviled',
        emoji: '💀',
        desc: 'Whispers of cruelty and broken oaths follow you.',
        threshold: 12
    }
};

const SECT_REPUTATION_DELTAS = {
    found_righteous: { respect: 4 },
    found_balanced: { respect: 1 },
    found_shadow: { fear: 3 },
    help_alignment: { respect: 2 },
    recruit_disciple: { respect: 2 },
    npc_recruit: { respect: 3 },
    sect_quest_complete: { respect: 2 },
    story_quest_help: { respect: 4 },
    promote_disciple: { respect: 1 },
    raid_rival: { fear: 4, respect: -1 },
    duel_victory_npc: { fear: 3, respect: 1 },
    sect_rival_victory: { fear: 5, respect: 2 },
    demonic_kill: { fear: 4, reviled: 2 },
    demonic_bargain: { reviled: 3, fear: 2 },
    flee_duel: { reviled: 2, respect: -2 },
    kill_world_npc: { fear: 3, reviled: 1 },
    doctrine_ceremony: { respect: -2, fear: 2 },
    diplomatic_alliance: { respect: 3 },
    declare_grudge: { fear: 4, respect: -2 },
    sect_event: {}
};

const DISCIPLE_ROLES = {
    acolyte: {
        id: 'acolyte',
        label: 'Acolyte',
        emoji: '📿',
        order: 0,
        desc: 'Gather resources and train basics.',
        incomeBonus: 1,
        promoteReq: { renown: 8, monthsServed: 24, next: 'elder' }
    },
    elder: {
        id: 'elder',
        label: 'Elder',
        emoji: '👴',
        order: 1,
        desc: 'Lead missions and teach juniors.',
        incomeBonus: 2,
        promoteReq: { renown: 20, monthsServed: 48, next: 'core' }
    },
    core: {
        id: 'core',
        label: 'Core Disciple',
        emoji: '⭐',
        order: 2,
        desc: 'Elite cultivator — sect champion candidate.',
        incomeBonus: 3,
        promoteReq: { renown: 50, monthsServed: 96, next: 'successor' }
    },
    successor: {
        id: 'successor',
        label: 'Successor',
        emoji: '👑',
        order: 3,
        desc: 'Heir to the sect mantle.',
        incomeBonus: 4
    }
};

const SECT_NPC_RECRUIT = {
    renownMin: 8,
    talkCountMin: 2,
    roles: ['disciple', 'wanderer']
};

const SECT_INFLUENCE = {
    exploreStoneBonus: 3,
    exploreFameBonus: 2,
    exploreFameChance: 0.22,
    cultivateBonusPct: 5,
    shiftMonths: 12,
    shiftRenownCost: 5
};

const SECT_RIVAL_PREFIXES = ['Crimson Peak', 'Iron Veil', 'Silent Moon', 'Thunder Gate', 'Jade Serpent', 'Ashen Lotus'];
const SECT_RIVAL_SUFFIXES = ['Sect', 'Hall', 'Pavilion', 'Gate'];

const SECT_WORLD_BALANCE = {
    spawnMin: 3,
    spawnMax: 5,
    growthIntervalMonths: 12,
    renownGrowthMin: 1,
    renownGrowthMax: 4,
    powerPerRenown: 0.45,
    powerPerStageOrder: 14,
    maxPowerAbovePlayerPct: 0.25,
    maxRenownAbovePlayerPct: 0.35,
    playerRenownSpawnMin: 0.45,
    playerRenownSpawnMax: 1.15,
    relationshipWeights: { neutral: 0.38, friendly: 0.32, hostile: 0.30 },
    stagePoolAtEstablished: ['founding', 'founding', 'established', 'established', 'regional']
};

const SECT_RELATIONSHIPS = {
    neutral: { id: 'neutral', label: 'Neutral', emoji: '⚖️', desc: 'Watching your rise with cautious interest.' },
    friendly: { id: 'friendly', label: 'Friendly', emoji: '🤝', desc: 'Open to trade and mutual aid.' },
    hostile: { id: 'hostile', label: 'Hostile', emoji: '⚔️', desc: 'Enmity declared — duels and raids possible.' }
};

const SECT_DOCTRINE_FRICTION = {
    matrix: {
        righteous: { righteous: 1.18, balanced: 1.0, shadow: 0.52 },
        balanced: { righteous: 0.92, balanced: 1.06, shadow: 0.88 },
        shadow: { righteous: 0.48, balanced: 0.82, shadow: 1.14 }
    },
    opposedPair: [['righteous', 'shadow']],
    pactBaseChance: 0.58,
    pactMonths: 4,
    pactRenownMin: 10,
    provokeMonths: 2,
    provokeRenownMin: 8,
    provokeAlwaysHostile: true,
    approachFailRespectLoss: 1
};

const SECT_WORLD_RELATIONS = {
    helpDriftBase: 0.36,
    helpDriftSameZoneBonus: 0.12,
    raidNeutralToHostileChance: 0.26,
    raidFriendlyToNeutralChance: 0.2,
    duelVictoryNeutralToHostileChance: 0.18,
    duelVictoryFriendlyToNeutralChance: 0.12,
    maxWitnessDrifts: 2,
    powerEventStrongRatio: 1.12,
    powerEventWeakRatio: 0.82,
    powerEventDominantRatio: 1.28
};

const SECT_CONFLICT_BALANCE = {
    duelVictoryRenown: 8,
    duelVictoryFame: 6,
    duelVictoryFoundation: 4,
    duelVictoryStones: 22,
    duelMonths: 2,
    raidMonths: 4,
    raidMinDisciples: 2,
    raidRenown: 4,
    raidStonesMin: 8,
    raidStonesMax: 18,
    allianceMonths: 48,
    allianceRenownCost: 6,
    rivalHpMult: 1.15,
    rivalDmgMult: 1.12
};

const SECT_BUILDINGS = {
    cultivation_hall: {
        id: 'cultivation_hall',
        name: 'Cultivation Hall',
        emoji: '🧘',
        desc: '+10% cultivation speed per level. Cultivate here to see your sect bonus breakdown.',
        effectKey: 'cultivationSpeedPct',
        effectPerLevel: 10,
        maxLevel: 3,
        minStage: 'founding',
        implemented: true,
        levels: [
            null,
            { stones: 25, materials: { spirit_herb: 2 }, months: 6, renown: 3 },
            { stones: 50, materials: { spirit_herb: 4, silk_thread: 2 }, months: 9, renown: 5 },
            { stones: 90, materials: { spirit_herb: 6, jade_inlay: 1 }, months: 12, renown: 8 }
        ]
    },
    alchemy_lab: {
        id: 'alchemy_lab',
        name: 'Alchemy Lab',
        emoji: '⚗️',
        desc: '+20% alchemy success per level (saves materials when forging).',
        effectKey: 'alchemySuccessPct',
        effectPerLevel: 20,
        maxLevel: 3,
        minStage: 'established',
        implemented: true,
        levels: [
            null,
            { stones: 40, materials: { spirit_herb: 4, demon_core: 1 }, months: 8, renown: 4 },
            { stones: 70, materials: { spirit_herb: 6, demon_core: 2 }, months: 10, renown: 6 },
            { stones: 120, materials: { spirit_herb: 8, jade_inlay: 2 }, months: 14, renown: 10 }
        ]
    },
    training_ground: {
        id: 'training_ground',
        name: 'Training Ground',
        emoji: '⚔️',
        desc: '+10% combat XP per level. Spar with disciples for technique mastery.',
        effectKey: 'combatXpPct',
        effectPerLevel: 10,
        maxLevel: 3,
        minStage: 'founding',
        implemented: true,
        levels: [
            null,
            { stones: 30, materials: { iron_ore: 4 }, months: 6, renown: 3 },
            { stones: 55, materials: { iron_ore: 6, leather_scrap: 3 }, months: 8, renown: 5 },
            { stones: 95, materials: { iron_ore: 8, demon_core: 1 }, months: 12, renown: 7 }
        ]
    },
    treasury: {
        id: 'treasury',
        name: 'Treasury',
        emoji: '💰',
        desc: '+10% disciple stone income per level. Tithe accumulates here — collect into sect stores.',
        effectKey: 'passiveIncomePct',
        effectPerLevel: 10,
        maxLevel: 3,
        minStage: 'established',
        implemented: true,
        levels: [
            null,
            { stones: 35, materials: { jade_inlay: 1 }, months: 6, renown: 4 },
            { stones: 60, materials: { jade_inlay: 2 }, months: 9, renown: 6 },
            { stones: 100, materials: { jade_inlay: 3, celestial_silk: 1 }, months: 12, renown: 9 }
        ]
    },
    library: {
        id: 'library',
        name: 'Library',
        emoji: '📚',
        desc: '+10% Dao comprehension speed per level (cultivation & merge).',
        effectKey: 'daoSpeedPct',
        effectPerLevel: 10,
        maxLevel: 3,
        minStage: 'established',
        implemented: true,
        levels: [
            null,
            { stones: 45, materials: { silk_thread: 4 }, months: 8, renown: 5 },
            { stones: 75, materials: { silk_thread: 6, spirit_herb: 4 }, months: 10, renown: 7 },
            { stones: 130, materials: { silk_thread: 8, celestial_silk: 1 }, months: 14, renown: 11 }
        ]
    },
    defense_array: {
        id: 'defense_array',
        name: 'Defense Array',
        emoji: '🛡️',
        desc: 'Reduces stone losses from sect events per level.',
        effectKey: 'defenseRating',
        effectPerLevel: 15,
        maxLevel: 3,
        minStage: 'regional',
        implemented: true,
        levels: [
            null,
            { stones: 50, materials: { iron_ore: 6, jade_inlay: 2 }, months: 10, renown: 6 },
            { stones: 85, materials: { iron_ore: 8, demon_core: 2 }, months: 12, renown: 9 },
            { stones: 140, materials: { iron_ore: 10, celestial_silk: 1 }, months: 16, renown: 12 }
        ]
    },
    beast_pen: {
        id: 'beast_pen',
        name: 'Beast Pen',
        emoji: '🐾',
        desc: '+10% chance per level to harvest beast parts when cultivating.',
        effectKey: 'beastMaterialChancePct',
        effectPerLevel: 10,
        maxLevel: 3,
        minStage: 'established',
        implemented: true,
        levels: [
            null,
            { stones: 35, materials: { leather_scrap: 3, iron_ore: 2 }, months: 7, renown: 4 },
            { stones: 65, materials: { leather_scrap: 5, demon_core: 1 }, months: 10, renown: 6 },
            { stones: 110, materials: { leather_scrap: 6, demon_core: 2 }, months: 13, renown: 9 }
        ]
    },
    spirit_garden: {
        id: 'spirit_garden',
        name: 'Spirit Garden',
        emoji: '🌸',
        desc: 'Yields spirit herbs on each cultivate (+1 herb per level).',
        effectKey: 'spiritHerbPerLevel',
        effectPerLevel: 1,
        maxLevel: 3,
        minStage: 'founding',
        implemented: true,
        levels: [
            null,
            { stones: 20, materials: { spirit_herb: 3 }, months: 5, renown: 2 },
            { stones: 45, materials: { spirit_herb: 5, silk_thread: 2 }, months: 7, renown: 4 },
            { stones: 80, materials: { spirit_herb: 8, jade_inlay: 1 }, months: 10, renown: 6 }
        ]
    },
    meditation_chamber: {
        id: 'meditation_chamber',
        name: 'Meditation Chamber',
        emoji: '🕯️',
        desc: '+8% Will and Spirit gains while cultivating per level.',
        effectKey: 'meditationStatPct',
        effectPerLevel: 8,
        maxLevel: 3,
        minStage: 'established',
        implemented: true,
        levels: [
            null,
            { stones: 30, materials: { silk_thread: 3, spirit_herb: 2 }, months: 6, renown: 3 },
            { stones: 55, materials: { silk_thread: 5, jade_inlay: 1 }, months: 9, renown: 5 },
            { stones: 95, materials: { silk_thread: 6, celestial_silk: 1 }, months: 12, renown: 8 }
        ]
    },
    armory: {
        id: 'armory',
        name: 'Armory',
        emoji: '🗡️',
        desc: '+5% sect combat power per level. +4% forge speed and +2% affix quality per level.',
        effectKey: 'armoryCombatPct',
        effectPerLevel: 5,
        extraEffects: [
            { effectKey: 'armoryForgePct', effectPerLevel: 4 },
            { effectKey: 'armoryForgeAffixPct', effectPerLevel: 2 }
        ],
        maxLevel: 3,
        minStage: 'established',
        implemented: true,
        levels: [
            null,
            { stones: 40, materials: { iron_ore: 5, leather_scrap: 2 }, months: 7, renown: 4 },
            { stones: 70, materials: { iron_ore: 8, demon_core: 1 }, months: 10, renown: 6 },
            { stones: 115, materials: { iron_ore: 10, jade_inlay: 2 }, months: 14, renown: 9 }
        ]
    },
    messenger_post: {
        id: 'messenger_post',
        name: 'Messenger Post',
        emoji: '📨',
        desc: '+6% diplomacy success per level when approaching sects.',
        effectKey: 'messengerDiplomacyPct',
        effectPerLevel: 6,
        maxLevel: 3,
        minStage: 'regional',
        implemented: true,
        levels: [
            null,
            { stones: 45, materials: { silk_thread: 4, jade_inlay: 1 }, months: 6, renown: 5 },
            { stones: 75, materials: { silk_thread: 6, celestial_silk: 1 }, months: 9, renown: 7 },
            { stones: 120, materials: { silk_thread: 8, celestial_silk: 2 }, months: 12, renown: 10 }
        ]
    },
    vault: {
        id: 'vault',
        name: 'Vault',
        emoji: '🏛️',
        desc: '+12% event stone protection per level. Deposit stones into protected sect stores.',
        effectKey: 'vaultStoneSavePct',
        effectPerLevel: 12,
        maxLevel: 3,
        minStage: 'founding',
        implemented: true,
        levels: [
            null,
            { stones: 28, materials: { iron_ore: 3, jade_inlay: 1 }, months: 6, renown: 3 },
            { stones: 55, materials: { iron_ore: 5, jade_inlay: 2 }, months: 8, renown: 5 },
            { stones: 95, materials: { iron_ore: 6, jade_inlay: 3 }, months: 11, renown: 7 }
        ]
    },
    disciple_hall: {
        id: 'disciple_hall',
        name: 'Disciple Hall',
        emoji: '📿',
        desc: 'Seat of disciple assignments and construction crews. +1 assignment slot per level.',
        effectKey: 'discipleAssignSlots',
        effectPerLevel: 1,
        maxLevel: 3,
        minStage: 'founding',
        implemented: true,
        levels: [
            null,
            { stones: 22, materials: { silk_thread: 2, spirit_herb: 2 }, months: 5, renown: 2 },
            { stones: 48, materials: { silk_thread: 4, spirit_herb: 4 }, months: 8, renown: 4 },
            { stones: 85, materials: { silk_thread: 6, jade_inlay: 2 }, months: 11, renown: 7 }
        ]
    },
    manual_hall: {
        id: 'manual_hall',
        name: 'Manual Hall',
        emoji: '📜',
        desc: 'Archive martial manuals for your sect. +6 collection slots and +1 disciple study slot per level.',
        effectKey: 'manualHallCapacity',
        effectPerLevel: 6,
        maxLevel: 3,
        minStage: 'founding',
        implemented: true,
        levels: [
            null,
            { stones: 24, materials: { silk_thread: 3, spirit_herb: 2 }, months: 5, renown: 2 },
            { stones: 50, materials: { silk_thread: 5, jade_inlay: 1 }, months: 8, renown: 4 },
            { stones: 88, materials: { silk_thread: 6, jade_inlay: 2 }, months: 11, renown: 6 }
        ],
        extraEffects: [{ effectKey: 'manualStudySlots', effectPerLevel: 1 }, { effectKey: 'studySpeedPct', effectPerLevel: 10 }]
    }
};

// ----- Sect grounds map, inventory, construction, residence -----
const SECT_CONSTRUCTION = {
    personalCapMonths: 6,
    modes: {
        personal: { id: 'personal', label: 'Oversee personally', emoji: '👷' },
        contractors: { id: 'contractors', label: 'Hire craftsmen', emoji: '🏗️' }
    }
};

const SECT_BUILDING_ACTIONS = {
    trainingSparMonths: 2,
    vaultDepositPresets: [10, 25, 50]
};

const SECT_INVENTORY_BALANCE = {
    baseCapacity: 50,
    vaultCapacityPerLevel: 30
};

const SECT_RESIDENCE = {
    id: 'residence',
    name: "Leader's Quarters",
    emoji: '🏠',
    maxLevel: 3,
    /** Formation slots unlocked at each residence level (index = level). */
    formationSlotsByLevel: [0, 1, 2, 3],
    levels: [
        { name: 'Makeshift Shelter', desc: 'A lean-to on the sect grounds. Personal shelves hold spare manuals and materials.' },
        { name: 'Inner Court Room', desc: 'A proper chamber — formation slot plus expanded home storage.' },
        { name: 'Spirit Pavilion', desc: 'Spirit-refined quarters with two formation slots and deep shelves.' },
        { name: 'Immortal Abode', desc: 'A peak dwelling — three formation slots and a vast personal archive.' }
    ],
    upgradeCosts: [
        null,
        { materials: { spirit_herb: 4, silk_thread: 2 }, months: 4, renown: 2 },
        { materials: { spirit_herb: 6, jade_inlay: 2, celestial_silk: 1 }, months: 8, renown: 5 },
        { materials: { spirit_herb: 8, jade_inlay: 3, celestial_silk: 2 }, months: 12, renown: 8 }
    ]
};

// ----- Formations (F1a fuel/switch/integrity + F1b shelf/decipher) -----
/** Shared courtyard upkeep numbers (per-formation defs may override). */
const FORMATION_F1A = {
    stonePerFuel: 1,
    defaultFuelCapacity: 24,
    defaultFuelPerMonth: 1,
    defaultLayFuel: 6,
    /** Integrity points lost per month while laid (neglect). */
    integrityDecayPerMonth: 1,
    integrityMax: 100,
    bands: {
        sharp: 70,
        fading: 35
    },
    /** Effect multipliers by integrity band (only while active + fueled). */
    effectMult: {
        sharp: 1,
        fading: 0.55,
        decayed: 0.2,
        scattered: 0
    },
    maintain: {
        stones: 4,
        materials: { spirit_herb: 1 },
        months: 1,
        restore: 35
    },
    fuelPresets: [3, 6, 12]
};

/** F1b learn pipeline (thin: acquire + decipher; no Trace yet). */
const FORMATION_F1B = {
    decipherMonthsByTier: { 1: 2, 2: 3, 3: 4 },
    decipherStonesByTier: { 1: 6, 2: 14, 3: 28 },
    masterTitles: {
        0: 'Uninitiated',
        1: 'Pattern Student',
        2: 'Inscriber',
        3: 'Formation Adept',
        4: 'Array Disciple'
    }
};

/** F2b: Formation Insight + master exams (Adept). */
const FORMATION_F2B = {
    /** Decipher / auto-grant may raise master tier up to this; Adept+ needs exam. */
    decipherMaxPromoteTier: 2,
    fi: {
        decipher: 5,
        lay: 8,
        maintain: 3,
        /** Per calendar month a laid pattern is active and fueled. */
        activeMonth: 0.5
    },
    exams: {
        3: {
            fromTier: 2,
            toTier: 3,
            fiCost: 36,
            months: 4,
            stones: 45,
            materials: { spirit_herb: 6, jade_inlay: 2, silk_thread: 3 },
            /** Soft gate — formation-mains can still attempt slightly early. */
            minRealmIdx: 1,
            cooldownMonths: 6,
            baseSuccess: 0.62,
            /** Extra success from FI above cost (capped). */
            fiSuccessBonusPerPoint: 0.004,
            fiSuccessBonusCap: 0.22,
            proofLabel: 'Adept proof inscription'
        }
        // 4 (Array Disciple) deferred until array-assist content exists
    }
};

const FORMATIONS = {
    spirit_gathering: {
        id: 'spirit_gathering',
        name: 'Spirit Gathering Formation',
        emoji: '🌀',
        desc: 'Draws ambient qi. +8% cultivation while running (courtyard or meditation chamber).',
        deploy: 'residence',
        anchors: ['residence', 'meditation_chamber'],
        formationTier: 1,
        minResidenceLevel: 1,
        effects: { cultivatePct: 8 },
        layCost: { months: 2, materials: { spirit_herb: 3, silk_thread: 1 } },
        fuelPerMonth: 1,
        fuelCapacity: 24,
        layFuel: 6,
        /** F1b: unread novice diagram when courtyard opens — not auto-comprehended. */
        starterUnreadOnResidenceLevel: 1
    },
    qi_stabilizer: {
        id: 'qi_stabilizer',
        name: 'Qi Stabilizer',
        emoji: '⚖️',
        desc: 'Steadies meridian flow. +4% cultivation and +1 Foundation while running (courtyard or meditation chamber).',
        deploy: 'residence',
        anchors: ['residence', 'meditation_chamber'],
        formationTier: 2,
        minResidenceLevel: 2,
        minBuildingLevelByAnchor: { meditation_chamber: 1 },
        effects: { cultivatePct: 4, foundationPerCultivate: 1 },
        layCost: { months: 3, materials: { spirit_herb: 4, jade_inlay: 1 } },
        fuelPerMonth: 1,
        fuelCapacity: 24,
        layFuel: 6
    },
    iron_wall_ward: {
        id: 'iron_wall_ward',
        name: 'Iron Wall Ward',
        emoji: '🛡️',
        desc: 'Perimeter ward for the Defense Array. Softens sect event stone losses while running — keep it off until you need it.',
        deploy: 'defense_array',
        anchors: ['defense_array'],
        formationTier: 2,
        implemented: true,
        effects: { defenseRating: 30 },
        layCost: { months: 3, materials: { iron_ore: 5, jade_inlay: 2 } },
        fuelPerMonth: 2,
        fuelCapacity: 24,
        layFuel: 4,
        /** Sect fantasy: wards stay ready, not roaring. */
        defaultActiveOnLay: false
    },
    vein_seal_ward: {
        id: 'vein_seal_ward',
        name: 'Vein Seal Ward',
        emoji: '🔒',
        desc: '3rd-tier perimeter seal. Stronger event protection while running — Adept work; expensive to keep lit.',
        deploy: 'defense_array',
        anchors: ['defense_array'],
        formationTier: 3,
        implemented: true,
        effects: { defenseRating: 55 },
        layCost: { months: 5, materials: { iron_ore: 8, jade_inlay: 3, demon_core: 1 } },
        fuelPerMonth: 3,
        fuelCapacity: 24,
        layFuel: 3,
        defaultActiveOnLay: false
    }
};

/** F2a: sect map nodes that host formation slots (1 slot once building exists). */
const FORMATION_ANCHORS = {
    residence: {
        id: 'residence',
        label: "Leader's Quarters",
        kind: 'residence'
    },
    meditation_chamber: {
        id: 'meditation_chamber',
        label: 'Meditation Chamber',
        kind: 'building',
        buildingId: 'meditation_chamber',
        hint: 'Gather and stabilise patterns amplify cultivation while running. Building Will/Spirit bonus still applies separately.'
    },
    defense_array: {
        id: 'defense_array',
        label: 'Defense Array',
        kind: 'building',
        buildingId: 'defense_array',
        hint: 'Ward patterns burn fuel while lit. Leave the mountain dark until a threat — building defense still helps a little when the ward is off.'
    }
};

const SECT_MAP_NODES = {
    residence: { id: 'residence', type: 'residence', x: 50, y: 62, layer: 2 },
    courtyard: { id: 'courtyard', type: 'hub', x: 50, y: 44, layer: 2 },
    inventory: { id: 'inventory', type: 'inventory', x: 92, y: 8, layer: 3 },
    defense_array: { id: 'defense_array', type: 'building', x: 18, y: 18, layer: 1 },
    messenger_post: { id: 'messenger_post', type: 'building', x: 82, y: 18, layer: 1 },
    armory: { id: 'armory', type: 'building', x: 22, y: 38, layer: 1 },
    treasury: { id: 'treasury', type: 'building', x: 78, y: 38, layer: 1 },
    training_ground: { id: 'training_ground', type: 'building', x: 28, y: 56, layer: 1 },
    cultivation_hall: { id: 'cultivation_hall', type: 'building', x: 42, y: 72, layer: 1 },
    spirit_garden: { id: 'spirit_garden', type: 'building', x: 58, y: 72, layer: 1 },
    disciple_hall: { id: 'disciple_hall', type: 'building', x: 50, y: 52, layer: 1 },
    library: { id: 'library', type: 'building', x: 72, y: 56, layer: 1 },
    manual_hall: { id: 'manual_hall', type: 'building', x: 64, y: 44, layer: 1 },
    meditation_chamber: { id: 'meditation_chamber', type: 'building', x: 38, y: 48, layer: 1 },
    beast_pen: { id: 'beast_pen', type: 'building', x: 62, y: 48, layer: 1 },
    alchemy_lab: { id: 'alchemy_lab', type: 'building', x: 50, y: 82, layer: 1 },
    vault: { id: 'vault', type: 'building', x: 50, y: 92, layer: 1 }
};

const SECT_CONFLICT_TYPES = {
    raid: { id: 'raid', label: 'Raid', emoji: '🏴', desc: 'Send disciples to seize resources.', minStage: 'established' },
    duel: { id: 'duel', label: 'Duel', emoji: '⚔️', desc: 'Face the rival champion.', minStage: 'established' },
    war: { id: 'war', label: 'War', emoji: '🔥', desc: 'Full-scale sect conflict.', minStage: 'regional' },
    alliance: { id: 'alliance', label: 'Alliance', emoji: '🤝', desc: 'Temporary pact with a rival.', minStage: 'established' }
};

const SECT_RECRUIT_NAMES = [
    'Wei Ling', 'Chen Feng', 'Li Mei', 'Zhang Bao', 'Liu Yan', 'Zhao Yun', 'Xiao Han',
    'Shen Wei', 'Bai Hua', 'Tang Long', 'Guo Jing', 'Lin Shuang', 'He Rong', 'Ma Tian'
];

// ----- Sect culture extras (reputation decay, ceremony, tier perks) -----
const SECT_REPUTATION_DECAY = {
    idleMonths: 12,
    respect: 1,
    fear: 1,
    reviled: 1,
    minBeforeDecay: 6
};

const SECT_DOCTRINE_CEREMONY = {
    minStage: 'regional',
    stones: 80,
    renown: 15,
    months: 18,
    reputationHit: { respect: -2, fear: 2 }
};

const SECT_REPUTATION_PERKS = {
    respected: {
        label: 'Villages speak well of you',
        exploreFameBonus: 1,
        recruitTalkReduction: 1
    },
    feared: {
        label: 'Enemies hesitate before your banners',
        combatMult: 1.05,
        npcMoodShift: -1
    },
    reviled: {
        label: 'Bounty hunters sniff at your trails',
        bountyChancePerYear: 0.15
    }
};

// ----- Disciple personality traits -----
const DISCIPLE_TRAITS = {
    loyal: {
        id: 'loyal', label: 'Loyal', emoji: '💛',
        desc: 'Sworn to the sect banner through feast and famine alike.',
        effectDesc: '+10% sect income',
        incomeMult: 1.1, combatMult: 1, growthMult: 1, eventTags: ['income']
    },
    ambitious: {
        id: 'ambitious', label: 'Ambitious', emoji: '🔥',
        desc: 'Hungers for rank, power, and a name carved into history.',
        effectDesc: '+20% promotion growth',
        incomeMult: 1, combatMult: 1, growthMult: 1.2, eventTags: ['growth']
    },
    lazy: {
        id: 'lazy', label: 'Lazy', emoji: '😴',
        desc: 'Prefers tea, shade, and excuses over morning drills.',
        effectDesc: '−10% sect income',
        incomeMult: 0.9, combatMult: 1, growthMult: 1, eventTags: []
    },
    brave: {
        id: 'brave', label: 'Brave', emoji: '🦁',
        desc: 'Steps forward when others step back.',
        effectDesc: '+10% combat; bolsters sect during crises',
        incomeMult: 1, combatMult: 1.1, growthMult: 1, eventTags: ['combat']
    },
    cowardly: {
        id: 'cowardly', label: 'Cowardly', emoji: '🐭',
        desc: 'Every shadow might hide a blade.',
        effectDesc: '−10% combat; weakens crisis response',
        incomeMult: 1, combatMult: 0.9, growthMult: 1, eventTags: []
    },
    wise: {
        id: 'wise', label: 'Wise', emoji: '🦉',
        desc: 'Reads the currents of qi, politics, and human nature.',
        effectDesc: '+10% growth; +1 Foundation per Wise disciple on cultivation events; −2 Renown to promote',
        incomeMult: 1, combatMult: 1, growthMult: 1.1,
        cultivateFoundationBonus: 1, promoteRenownReduction: 2, eventTags: ['cultivation']
    },
    stoic: {
        id: 'stoic', label: 'Stoic', emoji: '🗿',
        desc: 'Unshaken by hardship, insult, or sudden fortune.',
        effectDesc: '+3% income; +5% combat; softer stone losses from bad events',
        incomeMult: 1.03, combatMult: 1.05, growthMult: 1,
        eventStoneLossMult: 0.82, eventTags: ['combat']
    },
    generous: {
        id: 'generous', label: 'Generous', emoji: '🎁',
        desc: 'Gives freely to mortals, juniors, and passing beggars.',
        effectDesc: '−6% income; sect events grant +1 Respect per Generous disciple',
        incomeMult: 0.94, combatMult: 1, growthMult: 1,
        respectOnEvent: 1, eventTags: ['diplomacy']
    },
    jealous: {
        id: 'jealous', label: 'Jealous', emoji: '💢',
        desc: 'Covets praise, resources, and the master\'s attention.',
        effectDesc: '+12% growth; −3% income per disciple when 3+ sworn',
        incomeMult: 1, combatMult: 1, growthMult: 1.12,
        jealousMinDisciples: 3, incomeMultPerDisciple: -0.03, eventTags: ['growth']
    },
    driven: {
        id: 'driven', label: 'Driven', emoji: '⚡',
        desc: 'Sleeps little and brooks no excuse for failure.',
        effectDesc: '+22% growth; promotions need 18% less service time',
        incomeMult: 1, combatMult: 1, growthMult: 1.22,
        promoteMonthsMult: 0.82, eventTags: ['growth']
    },
    mysterious: {
        id: 'mysterious', label: 'Mysterious', emoji: '🔮',
        desc: 'Origins unknown; motives guessed at in whispers.',
        effectDesc: '18% chance per Mysterious disciple for +8 Stones after sect events',
        incomeMult: 1, combatMult: 1, growthMult: 1,
        eventMysteryBonus: 0.18, eventMysteryStones: 8, eventTags: []
    },
    gullible: {
        id: 'gullible', label: 'Gullible', emoji: '🪶',
        desc: 'Believes every sob story, forged letter, and smiling merchant.',
        effectDesc: '35% harsher stone losses from sect events',
        incomeMult: 1, combatMult: 1, growthMult: 1,
        eventStoneLossMult: 1.35, eventTags: []
    },
    fierce: {
        id: 'fierce', label: 'Fierce', emoji: '🐯',
        desc: 'Lives for the clash of blades and the roar of victory.',
        effectDesc: '+12% combat; raids gain +1 Renown per Fierce disciple; −4% income',
        incomeMult: 0.96, combatMult: 1.12, growthMult: 1,
        raidRenownBonus: 1, eventTags: ['combat']
    },
    stubborn: {
        id: 'stubborn', label: 'Stubborn', emoji: '🪨',
        desc: 'Will not bend to authority — only to proven results.',
        effectDesc: '+7% income; promotions need 25% more service time',
        incomeMult: 1.07, combatMult: 1, growthMult: 1,
        promoteMonthsMult: 1.25, eventTags: []
    },
    noble: {
        id: 'noble', label: 'Noble', emoji: '👑',
        desc: 'Carries themselves as though born to lead courts and sects.',
        effectDesc: '+5% income; promotions grant +2 Respect; +6% diplomacy success',
        incomeMult: 1.05, combatMult: 1, growthMult: 1,
        respectOnPromote: 2, diplomacyBonus: 0.06, eventTags: ['diplomacy']
    }
};

const DISCIPLE_TRAIT_POOL = Object.keys(DISCIPLE_TRAITS);

// ----- Random sect events (every 6 months) -----
const SECT_EVENT_BALANCE = {
    intervalMonths: 6,
    baseChance: 0.85
};

const SECT_EVENTS = {
    wanderer_join: {
        id: 'wanderer_join',
        title: 'Wandering Cultivator',
        text: 'A lone cultivator kneels at your gate, asking to swear oaths to your banner.',
        minStage: 'founding',
        weight: 1.2,
        choices: {
            accept: { label: 'Accept them', effects: { disciple: true, renown: 2, respect: 2 } },
            decline: { label: 'Turn them away', effects: { respect: -1 } }
        }
    },
    beast_tide: {
        id: 'beast_tide',
        title: 'Beast Tide',
        text: 'Spirit beasts surge toward your sect grounds. Disciples look to you for orders.',
        minStage: 'established',
        weight: 1,
        tags: ['combat'],
        choices: {
            fight: { label: 'Stand and fight', effects: { months: 2, stones: -10, renown: 5, fear: 2, respect: 2, combatCheck: true } },
            evacuate: { label: 'Evacuate disciples', effects: { months: 1, renown: -2, respect: 1 } },
            bribe: { label: 'Bribe with spirit stones', effects: { stones: -25, renown: 1 } }
        }
    },
    rival_challenge: {
        id: 'rival_challenge',
        title: 'Rival Challenge',
        text: 'A hostile sect sends a formal challenge — duel their champion or lose face.',
        minStage: 'established',
        weight: 0.9,
        requiresRival: true,
        choices: {
            accept: { label: 'Accept the duel', effects: { triggerDuel: true, renown: 2 } },
            negotiate: { label: 'Negotiate tribute', effects: { stones: -15, fear: 1, respect: -1 } },
            ignore: { label: 'Ignore them', effects: { renown: -3, respect: -3, fear: 1 } }
        }
    },
    herb_request: {
        id: 'herb_request',
        title: 'Disciple Breakthrough',
        text: 'A disciple begs for a rare spirit herb to break through a bottleneck.',
        minStage: 'founding',
        weight: 1.1,
        tags: ['cultivation'],
        requiresDisciple: true,
        choices: {
            help: { label: 'Provide the herb', effects: { stones: -12, respect: 3, renown: 2, foundation: 1, cultivationCheck: true, relationshipDrift: 'village_help' } },
            refuse: { label: 'Refuse', effects: { fear: 1, respect: -1 } }
        }
    },
    trade_caravan: {
        id: 'trade_caravan',
        title: 'Merchant Caravan',
        text: 'Traders offer a pact — escort fees for safe passage through your influence.',
        minStage: 'established',
        weight: 0.8,
        choices: {
            welcome: { label: 'Welcome them', effects: { stones: 18, respect: 2, renown: 1, relationshipDrift: 'village_help' } },
            tax: { label: 'Demand tribute', effects: { stones: 28, fear: 2, respect: -2 } }
        }
    },
    hegemon_demand: {
        id: 'hegemon_demand',
        title: 'Hegemon\'s Demand',
        text: '{rival} sends envoys — their power eclipses yours. They demand tribute or a public oath of deference.',
        minStage: 'established',
        weight: 0.75,
        powerCompare: 'stronger',
        powerRatio: 1.12,
        dynamicRival: true,
        choices: {
            pay: { label: 'Pay tribute (30 Stones)', effects: { stones: -30, renown: -2, fear: 1 } },
            defy: { label: 'Refuse publicly', effects: { renown: 4, fear: 3, respect: 2, relationshipDrift: 'defy_strong' } },
            negotiate: { label: 'Offer a limited pact', effects: { months: 3, stones: -12, respect: 1, renown: 1 } }
        }
    },
    weak_rival_tribute: {
        id: 'weak_rival_tribute',
        title: 'Lesser Sect Seeks Protection',
        text: '{rival} humbly offers yearly tribute if you shield them from bandits and beasts.',
        minStage: 'established',
        weight: 0.85,
        powerCompare: 'weaker',
        powerRatio: 0.82,
        dynamicRival: true,
        choices: {
            accept: { label: 'Accept vassalage', effects: { stones: 22, renown: 3, respect: 2, relationshipDrift: 'vassal_accept' } },
            decline: { label: 'Decline politely', effects: { respect: 1 } },
            exploit: { label: 'Demand harsh terms', effects: { stones: 35, fear: 3, respect: -2, reviled: 1 } }
        }
    },
    war_sect_mobilization: {
        id: 'war_sect_mobilization',
        title: 'War Sect Mobilizes',
        text: '{rival} marshals disciples on your border — a dominant hostile power testing your nerve.',
        minStage: 'established',
        weight: 0.65,
        powerCompare: 'dominant_hostile',
        powerRatio: 1.28,
        requiresRival: true,
        dynamicRival: true,
        tags: ['combat'],
        choices: {
            rally: { label: 'Rally disciples', effects: { months: 2, stones: -8, renown: 3, fear: 2, combatCheck: true } },
            appease: { label: 'Send gifts', effects: { stones: -20, renown: -1, fear: 1 } },
            duel: { label: 'Challenge their champion', effects: { triggerDuel: true, renown: 2 } }
        }
    }
};

// ----- Sect diplomacy (friendly allies vs grudge rivals) -----
const SECT_DIPLOMACY = {
    allianceRenownMin: 30,
    allianceRepTier: 'respected',
    grudgeRenownMin: 20,
    grudgeRepTier: 'feared',
    allianceIncomePct: 12,
    allianceMonths: 60,
    grudgeRaidMonths: 6,
    maxAlliedSects: 3,
    maxGrudgeSects: 4
};

const SECT_DIPLOMACY_ACTIONS = {
    trade_route: {
        id: 'trade_route',
        label: 'Trade Route',
        emoji: '🛤️',
        desc: 'Establish a caravan route for steady stone income.',
        effectDesc: '+4 Stones per cultivate while active (4 years).',
        minStage: 'established',
        targetRelations: ['friendly', 'neutral'],
        renownMin: 15,
        stonesCost: 20,
        months: 4,
        durationMonths: 48,
        activeField: 'tradeRouteUntilMonths',
        stonesPerCultivate: 4,
        renownReward: 2,
        respect: 2
    },
    mutual_defense: {
        id: 'mutual_defense',
        label: 'Mutual Defense Pact',
        emoji: '🛡️',
        desc: 'Pledge to defend one another against hostile sects.',
        effectDesc: '+8% combat power while hostile sects exist (6 years).',
        minStage: 'regional',
        targetRelations: ['friendly'],
        renownMin: 35,
        stonesCost: 30,
        months: 6,
        durationMonths: 72,
        activeField: 'defensePactUntilMonths',
        combatBonusPct: 8,
        renownReward: 3,
        respect: 3
    },
    espionage: {
        id: 'espionage',
        label: 'Espionage',
        emoji: '🕵️',
        desc: 'Plant spies to weaken a rival\'s readiness.',
        effectDesc: '−15% target power for duels; reveals exact stats (2 years).',
        minStage: 'established',
        targetRelations: ['hostile', 'neutral'],
        renownMin: 20,
        stonesCost: 25,
        months: 3,
        durationMonths: 24,
        activeField: 'espionageUntilMonths',
        powerMult: 0.85,
        successChance: 0.72,
        renownReward: 2,
        fear: 2,
        respect: -1
    },
    sanction: {
        id: 'sanction',
        label: 'Sanction',
        emoji: '⛔',
        desc: 'Cut a hostile sect off from jianghu trade.',
        effectDesc: 'Your raids vs them gain +25% stones; their renown stagnates (3 years).',
        minStage: 'established',
        targetRelations: ['hostile'],
        renownMin: 25,
        repTier: 'feared',
        stonesCost: 15,
        months: 4,
        durationMonths: 36,
        activeField: 'sanctionedUntilMonths',
        raidStoneBonusPct: 25,
        renownReward: 3,
        fear: 3,
        respect: -2
    },
    marriage_alliance: {
        id: 'marriage_alliance',
        label: 'Marriage Alliance',
        emoji: '💍',
        desc: 'Bind your sects through a marriage of heirs.',
        effectDesc: '+6% sect income; long-lasting friendship (10 years).',
        minStage: 'regional',
        targetRelations: ['friendly'],
        renownMin: 40,
        repTier: 'respected',
        stonesCost: 50,
        months: 8,
        durationMonths: 120,
        activeField: 'marriageAllianceUntilMonths',
        incomeBonusPct: 6,
        renownReward: 5,
        respect: 4
    }
};

const SECT_FRIENDLY_PREFIXES = ['Azure Cloud', 'Golden Lotus', 'Silver Stream', 'Harmony Peak', 'Verdant Gate'];
const SECT_FRIENDLY_SUFFIXES = ['Sect', 'Order', 'Monastery'];

// ----- Sect legacy (chronicle, heirlooms, legend, spirit) -----
const SECT_LEGACY = {
    chaosResourceLossPct: 0.5,
    successorAgeYears: 22,
    leaderRealmDrop: { successor: 0, core: 0, elder: 1, acolyte: 2 },
    statMult: { successor: 0.92, core: 0.82, elder: 0.72, acolyte: 0.62 },
    maxChronicleEntries: 50,
    maxHeirlooms: 12,
    heirloomBonusPerGeneration: 0.03,
    legendAgeYears: 100,
    legendRenownMult: 1.12,
    legendIncomePct: 8,
    legendRespectBonus: 6,
    spiritMinGeneration: 3
};

const SECT_SPIRIT = {
    id: 'ancestral_guardian',
    name: 'Ancestral Guardian Spirit',
    emoji: '👻',
    desc: 'An awakened protector bound to your lineage after three generations of leadership.',
    combatMult: 1.06,
    cultivateMult: 1.05,
    tribulationEasePct: 6,
    incomePct: 4
};

const SECT_HEIRLOOMS = {
    jade_seal: {
        id: 'jade_seal',
        name: 'Jade Leadership Seal',
        emoji: '📿',
        desc: '+5% sect income; grows +3% per generation passed down.',
        incomeMult: 1.05
    },
    war_banner: {
        id: 'war_banner',
        name: 'War Banner of the Gate',
        emoji: '🚩',
        desc: '+5% combat power; grows +3% per generation passed down.',
        combatMult: 1.05
    },
    scripture_stone: {
        id: 'scripture_stone',
        name: 'Scripture Stone',
        emoji: '📜',
        desc: '+3 Foundation on succession; +1 per generation the stone endured.',
        foundationBonus: 3,
        foundationPerGen: 1
    },
    ancestral_blade: {
        id: 'ancestral_blade',
        name: 'Ancestral Blade',
        emoji: '⚔️',
        desc: '+8 Renown preserved on succession; grows with each passing leader.',
        renownBonus: 8,
        renownBonusPerGen: 2
    },
    founders_compass: {
        id: 'founders_compass',
        name: "Founder's Compass",
        emoji: '🧭',
        desc: '+3% explore fame; +2% income per generation passed down.',
        exploreFameBonus: 1,
        incomeMult: 1.03,
        incomeMultPerGen: 0.02
    },
    bloodline_lamp: {
        id: 'bloodline_lamp',
        name: 'Bloodline Spirit Lamp',
        emoji: '🏮',
        desc: '+4% cultivation speed; glows brighter each generation (+2% per gen).',
        cultivateMult: 1.04,
        cultivateMultPerGen: 0.02
    },
    memorial_stele: {
        id: 'memorial_stele',
        name: 'Memorial Stele',
        emoji: '🪨',
        desc: '+2 Respect when passed to a new leader; +1 per generation enshrined.',
        respectOnSuccession: 2,
        respectPerGen: 1
    }
};

const SECT_TREASURES = SECT_HEIRLOOMS;

// ===== CULTIVATION BASE (Root / Flow / Stability pillars) =====

const CULTIVATION_BASE_BALANCE = {
    crackPenalty: 4,
    foundationGuideEffects: 'Improving foundation raises max Qi and Qi density, makes breakthroughs and meridians easier, softens tribulation severity, and strengthens techniques in combat.',
    grades: [
        {
            id: 'crude',
            min: 0,
            label: 'Crude',
            emoji: '🪨',
            playerDesc: 'Loose sand and shifting stone — your cultivation base has not yet taken shape.',
            playerEffects: 'Breakthroughs are risky; tribulations hit harder; meridians resist opening.'
        },
        {
            id: 'firm',
            min: 19,
            label: 'Firm',
            emoji: '🏛️',
            playerDesc: 'Bedrock holds beneath your dantian — enough to advance with confidence.',
            playerEffects: 'Reliable breakthrough footing; tribulations less punishing; meridians yield more readily.'
        },
        {
            id: 'unshakable',
            min: 33,
            label: 'Unshakable',
            emoji: '⛰️',
            playerDesc: 'Mountain-rooted — heaven\'s weight settles on you and finds no crack.',
            playerEffects: 'Strong breakthrough odds; high max Qi and density; tribulations bow slightly; techniques hit harder.'
        },
        {
            id: 'peerless',
            min: 46,
            label: 'Peerless',
            emoji: '🌟',
            playerDesc: 'A foundation others spend lifetimes chasing — the sect elders would envy this footing.',
            playerEffects: 'Peak cultivation base: best breakthrough and perfect-break odds, tribulation resilience, and combat technique power.'
        }
    ],
    pillarCapsByRealm: {
        0: { root: 18, flow: 18, stability: 16 },
        1: { root: 28, flow: 28, stability: 24 },
        2: { root: 36, flow: 36, stability: 32 },
        3: { root: 44, flow: 44, stability: 40 },
        4: { root: 52, flow: 52, stability: 48 },
        5: { root: 60, flow: 60, stability: 56 },
        6: { root: 72, flow: 72, stability: 68 }
    },
    pillarGrants: {
        gatherQiRoot: 0.25,
        expandDantianRoot: 1.5,
        densityMilestoneRoot: 1,
        densityMilestones: [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0],
        meridianOpenFlowFirst: 3,
        meridianOpenFlowEarly: 2.5,
        meridianOpenFlowLater: 2,
        meridianFailFlow: 0.25,
        perfectFoundationFlow: 2,
        peakGrindStability: 1,
        foundationLossPerCrack: 2
    },
    legacyMigration: {
        rootRatio: 0.35,
        flowRatio: 0.35
    }
};

// ===== QI CULTIVATION (capacity + density) =====

const QI_BALANCE = {
    maxQiBase: 10,
    maxQiPerRealm: 10,
    maxQiPerFoundation: 2,
    maxQiPerMeridian: 3,
    densityBase: 1,
    densityPerRealm: 1,
    densityPerFoundation: 0.2,
    breakthroughMaxQi: 8,
    cultivateDensityMin: 0.12,
    cultivateDensityMax: 0.32,
    cultivateFillRatio: 0.18,
    perfectConsolidateDensityBonus: 0.15,
    perfectConsolidateMaxQiBonus: 3
};

// ===== QI CULTIVATION CHAMBER =====
// Balance (phase 5): chamber replaces Cultivate on Qi path.
//   Gather ≈6× faster than legacy Cultivate per time on density (1 wk vs 6 mo) with lighter Qi fill.
//   Expand ≈ consolidation-scale capacity bumps, stone-gated + cooldown-limited.
//   Perfect Foundation = premium +2 foundation burst; technique sacrifice + 3 mo CD.
//   Condense Core = fast-track to Core Formation vs 24 mo Break, but peak + roll + tribulation tax.

const CHAMBER_BALANCE = {
    weeksPerMonth: 4,
    gatherQi: {
        weeks: 1,
        densityGainMin: 0.14,
        densityGainMax: 0.32,
        fillRatio: 0.11
    },
    expandDantian: { weeks: 2, stones: 25, maxQiBonusGain: 4, cooldownMonths: 2 },
    perfectFoundation: { weeks: 3, stones: 50, techniques: 1, foundationGain: 2, cooldownMonths: 3 },
    condenseCore: {
        months: 1,
        stones: 100,
        tribulations: 1,
        cooldownMonths: 6,
        targetRealmIdx: 1,
        minCondenseChance: 35,
        maxCondenseChance: 88,
        failFoundationLoss: 2,
        tribFailFoundationLoss: 4
    },
    densityBarHeadroom: 1.12,
    foundationBarHeadroom: 1.15,
    densityBarCapBase: 5,
    densityBarCapPerRealm: 2.5
};

// Qi chamber + main-panel cultivation action helpers (inline meta + tooltips)
const CULTIVATION_ACTION_GUIDE = {
    gatherQi: {
        label: 'Gather Qi',
        emoji: '🌬️',
        flavor: 'Draw heaven\'s breath into the void of your dantian.',
        desc: 'Raises Qi Density (technique power & peak requirements), refills dantian Qi toward max, and slowly builds Root. Qi-path combat draws Breath directly from your dantian — gather between fights to recover. Bonuses scale with sect, talents, and body cultivation.'
    },
    expandDantian: {
        label: 'Expand Dantian',
        emoji: '🏺',
        flavor: 'Widen the vessel so more Qi may dwell within.',
        desc: 'Permanently increases max Qi capacity. Also grants a burst of Root. Does not raise Density or Flow. Costs spirit stones; your dantian must stabilize between expansions.'
    },
    refineFoundation: {
        label: 'Refine Foundation',
        emoji: '🪨',
        flavor: 'Burn a technique into bedrock — anchor your Flow.',
        desc: 'Chamber grind between realm seals — separate from Seal Dantian capstones. Sacrifice a spare technique to strengthen the Flow (meridian) pillar. Requires stones and recovery time.'
    },
    condenseCore: {
        label: 'Condense Core',
        emoji: '💎',
        flavor: 'Compress peak Qi into a nascent golden core.',
        desc: 'At Foundation Establishment peak, attempt to form a golden core and advance to Core Formation. Then face heavenly tribulation. Failure cracks foundation; success is a major realm leap.'
    },
    cultivate: {
        label: 'Cultivate',
        emoji: '🧘',
        flavor: 'Choose where to refine yourself today.',
        desc: 'Open the cultivation hub — Qi, Body, or Soul chambers. Any path can be trained regardless of your primary path.'
    },
    sealDantian: {
        label: 'Seal Dantian',
        emoji: '🏛️',
        flavor: 'Cement your realm before reaching for the next.',
        desc: 'Realm capstone at Settled (80%+) or Peak (100%). Cements Stability (seal pillar), unlocks breakthrough, and perfect seals grant lasting bonuses. Distinct from chamber Refine Foundation.'
    },
    breakthrough: {
        label: 'Break Through',
        emoji: '🌀',
        flavor: 'Shatter the bottleneck and ascend.',
        desc: 'Attempt the next cultivation realm. Requires this realm to be sealed first. Success raises stats, max Qi, and lifespan. Odds depend on foundation, density, and consolidation tier.'
    },
    recuperate: {
        label: 'Recuperate',
        emoji: '🛌',
        flavor: 'Still the body and mend what combat has torn.',
        desc: 'Rest to heal HP and regenerate your protective barrier. Does not cultivate stats or Qi.'
    },
    vesselRules: {
        label: 'Vessel Rules',
        emoji: '⚖️',
        flavor: 'Swear a defining oath upon the flesh — one law, one vessel.',
        desc: 'Body path interior peak: swear a single Vessel Rule in the Body Chamber. Rules are self-imposed laws of the flesh — not cosmic Dao, not weapon intent. Release is voluntary but punishing.'
    }
};

// ===== VESSEL RULES (framework) =====

const VESSEL_RULE_BALANCE = {
    swearMonths: 6,
    releaseCooldownMonths: 12,
    abandonRegressRealm: true,
    progressionCompletePct: 100
};

const RULE_OF_BLOOD_BALANCE = {
    bloodiedHpPct: 0.65,
    bloodiedDamageTakenPct: 0.08,
    bloodiedDamageMult: 1.08,
    bloodiedDamageReductionPct: 0.10,
    sealStaminaCost: 4,
    sealBleedPauseTurns: 3,
    sealCooldownTurns: 4,
    backlashSlowChance: 0.35,
    backlashSlowTurns: 1,
    soulContestPctBase: 0.15,
    soulContestPctAtComplete: 0.25,
    progressionPerBloodiedWin: 8,
    progressionPerSeal: 3,
    progressionPerBloodChamberAction: 2
};

const RULE_OF_UNNAMED_BALANCE = {
    dissipateCostMult: 0.5,
    flowCap: 5,
    flowPerBasic: 1,
    flowDamagePerStack: 0.03,
    flowStaminaDiscountPerStack: 1,
    livingStrikeVesselScale: 0.04,
    livingStrikeVitalityScale: 0.06,
    stagnationAfterAttempts: 3,
    stagnationDamageMult: 0.85,
    stagnationStaminaCostBonus: 1,
    slipTechniqueDamageReduction: 0.12,
    soulSlipPctBase: 0.10,
    soulSlipPctAtComplete: 0.20,
    progressionPerFlowWin: 8,
    progressionPerBasicMilestone: 2,
    progressionPerBonesChamberAction: 2,
    basicMilestoneEvery: 15
};

const VESSEL_RULES = {
    blood: {
        id: 'blood',
        name: 'Rule of Blood',
        oath: 'Blood is not for mending. Blood is for serving the flesh.',
        emoji: '🩸',
        swearGate: { vesselRealmIdx: 2, bodyLayer: 'blood', bodyLayerPct: 50 },
        releaseWarning: 'You will regress to the start of your current vessel realm and lose all Rule progression. The flesh will not forgive this breach lightly.',
        implemented: true
    },
    unnamed: {
        id: 'unnamed',
        name: 'Rule of the Unnamed',
        oath: 'The apex is not the form perfected. It is the body that never stops moving.',
        emoji: '👊',
        swearGate: { vesselRealmIdx: 2, bodyLayer: 'bones', bodyLayerPct: 50 },
        releaseWarning: 'You will regress to the start of your current vessel realm and lose all Rule progression. Motion without law collapses into chaos.',
        implemented: true
    }
};

// ===== BODY CULTIVATION CHAMBER =====

const BODY_CHAMBER_LAYER_ORDER = ['skin', 'flesh', 'bones', 'organs', 'blood', 'meridians', 'nerves'];

const BODY_CHAMBER_LAYERS = {
    skin: { id: 'skin', label: 'Skin', emoji: '🛡️', unlockPrevPct: 0, color: '#c9a87c' },
    flesh: { id: 'flesh', label: 'Flesh', emoji: '💪', unlockPrevPct: 50, color: '#b87878' },
    bones: { id: 'bones', label: 'Bones', emoji: '🦴', unlockPrevPct: 50, color: '#e8e4dc' },
    organs: { id: 'organs', label: 'Organs', emoji: '🫀', unlockPrevPct: 50, color: '#8a5a7a' },
    blood: { id: 'blood', label: 'Blood', emoji: '🩸', unlockPrevPct: 50, color: '#a03030' },
    meridians: { id: 'meridians', label: 'Meridians', emoji: '☯️', unlockPrevPct: 50, color: '#c8a840' },
    nerves: { id: 'nerves', label: 'Nerves', emoji: '⚡', unlockPrevPct: 50, color: '#60c8c0' }
};

// Rough balance — stack limits, bonus caps, and tuned action values (full refine ≈ modest edge, not runaway)
const BODY_CHAMBER_BALANCE = {
    defaultMaxStacks: 3,
    subMaxStacks: 2,
    nervesFame: 5
};

const BODY_CHAMBER_BONUS_CAPS = {
    physicalDefensePct: 10, elementalResistPct: 10, maxHpPct: 12, physicalDamagePct: 10,
    techniqueEfficiencyPct: 10, hpRegenPct: 12, attackSpeedPct: 8, techniquePrecisionPct: 10,
    speedPct: 8, evasionPct: 8, mobilityPct: 6, stabilityPct: 6, flatHp: 15, resiliencePct: 10,
    posturePct: 8, willpowerPct: 10, fearResistPct: 10, qiEfficiencyPct: 10, staminaEfficiencyPct: 8,
    staminaRegenPct: 10, qiRegenPct: 12, poisonResistPct: 10, diseaseResistPct: 8, vitalityPct: 12,
    lifeStealPct: 6, lowHpDmgPct: 8, bloodDmgPct: 8, demonDmgPct: 8
};

const BODY_CHAMBER_ACTIONS = {
    skin: [
        { id: 'temper', label: 'Temper Skin', emoji: '🔥', weeks: 2, progress: 12,
            bonus: { physicalDefensePct: 1 }, desc: '+1% physical defense (max 3×)' },
        { id: 'harden', label: 'Harden Skin', emoji: '💎', weeks: 2, progress: 12,
            bonus: { elementalResistPct: 1 }, desc: '+1% elemental resistance (max 3×)' },
        { id: 'reinforce', label: 'Reinforce Skin', emoji: '❤️', weeks: 2, progress: 12,
            bonus: { maxHpPct: 1 }, desc: '+1% HP (max 3×)' }
    ],
    flesh: [
        { id: 'muscle', label: 'Strengthen Muscle', emoji: '💥', weeks: 2, progress: 12,
            bonus: { physicalDamagePct: 1 }, desc: '+1% physical damage (max 3×)' },
        { id: 'tendons', label: 'Reinforce Tendons', emoji: '🎯', weeks: 2, progress: 12,
            bonus: { techniqueEfficiencyPct: 1 }, desc: '+1% technique efficiency (max 3×)' },
        { id: 'enhance', label: 'Enhance Flesh', emoji: '🩹', weeks: 2, progress: 12,
            bonus: { hpRegenPct: 1 }, desc: '+1% HP regen (max 3×)' }
    ],
    bones: [
        { id: 'hands', label: 'Temper Hand Bones', emoji: '✋', weeks: 2, progress: 7,
            bonus: { attackSpeedPct: 1, techniquePrecisionPct: 1 }, desc: '+1% attack speed & precision (max 3×)' },
        { id: 'arms', label: 'Forge Arm Bones', emoji: '💪', weeks: 2, progress: 7,
            bonus: { physicalDamagePct: 1, physicalDefensePct: 1 }, desc: '+1% damage & defense (max 3×)' },
        { id: 'legs', label: 'Strengthen Leg Bones', emoji: '🦵', weeks: 2, progress: 7,
            bonus: { speedPct: 1, evasionPct: 1 }, desc: '+1% speed & evasion (max 3×)' },
        { id: 'feet', label: 'Harden Foot Bones', emoji: '🦶', weeks: 2, progress: 7,
            bonus: { mobilityPct: 1, stabilityPct: 1 }, desc: '+1% mobility & stability (max 3×)' },
        { id: 'ribs', label: 'Reinforce Ribs', emoji: '🛡️', weeks: 2, progress: 7,
            bonus: { flatHp: 3, resiliencePct: 1 }, desc: '+3 HP, +1% resilience (max 3×)' },
        { id: 'spine', label: 'Align Spine', emoji: '🦴', weeks: 2, progress: 7,
            bonus: { posturePct: 1, techniqueEfficiencyPct: 1 }, desc: '+1% posture & technique efficiency (max 3×)' },
        { id: 'skull', label: 'Temper Skull', emoji: '💀', weeks: 2, progress: 7,
            bonus: { willpowerPct: 1, fearResistPct: 1 }, desc: '+1% willpower & fear resist (max 3×)' },
        { id: 'marrow', label: 'Refine Marrow', emoji: '🩸', weeks: 3, progress: 10, sub: 'marrow',
            rareHerb: 1, bonus: { qiEfficiencyPct: 2, staminaEfficiencyPct: 1 },
            desc: '+2% Qi efficiency, +1% Stamina efficiency · 1 Rare Herb (max 2×)' }
    ],
    organs: [
        { id: 'heart', label: 'Strengthen Heart', emoji: '❤️', weeks: 3, progress: 9,
            bonus: { hpRegenPct: 2, vitalityPct: 1 }, desc: '+2% HP regen, +1% vitality (max 3×)' },
        { id: 'lungs', label: 'Expand Lungs', emoji: '🫁', weeks: 3, progress: 9,
            bonus: { qiRegenPct: 2, staminaRegenPct: 1 }, desc: '+2% Qi regen, +1% stamina regen (max 3×)' },
        { id: 'liver', label: 'Purify Liver', emoji: '🫘', weeks: 3, progress: 9,
            bonus: { poisonResistPct: 2, diseaseResistPct: 1 }, desc: '+2% poison resist, +1% disease resist (max 3×)' },
        { id: 'kidneys', label: 'Fortify Kidneys', emoji: '💧', weeks: 3, progress: 9,
            bonus: { vitalityPct: 2, maxHpPct: 1 }, desc: '+2% vitality, +1% HP (max 3×)' },
        { id: 'spleen', label: 'Harmonize Spleen', emoji: '🌾', weeks: 3, progress: 9,
            bonus: { staminaRegenPct: 1, hpRegenPct: 1, resiliencePct: 1 }, desc: '+1% stamina regen, HP regen & resilience (max 3×)' }
    ],
    blood: [
        { id: 'purify', label: 'Purify Blood', emoji: '🌊', weeks: 2, progress: 7,
            bonus: { hpRegenPct: 1, poisonResistPct: 1 }, desc: '+1% HP regen & poison resist (max 3×)' },
        { id: 'condense', label: 'Condense Blood Essence', emoji: '💉', weeks: 2, progress: 7,
            bonus: { physicalDamagePct: 1, vitalityPct: 1 }, desc: '+1% physical damage & vitality (max 3×)' },
        { id: 'vessels', label: 'Temper Blood Vessels', emoji: '🫀', weeks: 2, progress: 7,
            bonus: { maxHpPct: 1, resiliencePct: 1 }, desc: '+1% HP & resilience (max 3×)' },
        { id: 'circulate', label: 'Circulate True Blood', emoji: '🔄', weeks: 2, progress: 7,
            bonus: { staminaRegenPct: 1, hpRegenPct: 1 }, desc: '+1% stamina & HP regen (max 3×)' },
        { id: 'battle', label: 'Awaken Battle Blood', emoji: '⚔️', weeks: 2, progress: 7,
            bonus: { lowHpDmgPct: 1, lifeStealPct: 1 }, desc: '+1% low-HP damage & life steal (max 3×)' },
        { id: 'bloodline', label: 'Awaken Bloodline', emoji: '🐉', weeks: 3, progress: 10, sub: 'bloodline',
            materialCost: { demon_core: 1 },
            bonus: { bloodDmgPct: 2, demonDmgPct: 1, lifeStealPct: 1 },
            desc: '+2% blood tech damage, +1% demon damage & life steal · 1 Demon Core (max 2×)' }
    ],
    meridians: [
        { id: 'lung', meridianIndex: 0, label: 'Lung Channel', emoji: '🌬️', weeks: 2, progress: 6,
            bonus: { qiRegenPct: 1, qiEfficiencyPct: 1 }, desc: '+1% Qi regen & efficiency · opens Lung (max 3×)' },
        { id: 'large_intestine', meridianIndex: 1, label: 'Large Intestine Channel', emoji: '🌀', weeks: 2, progress: 6,
            bonus: { physicalDefensePct: 1 }, desc: '+1% physical defense · opens Large Intestine (max 3×)' },
        { id: 'stomach', meridianIndex: 2, label: 'Stomach Channel', emoji: '🔥', weeks: 2, progress: 6,
            bonus: { vitalityPct: 1, hpRegenPct: 1 }, desc: '+1% vitality & HP regen · opens Stomach (max 3×)' },
        { id: 'spleen', meridianIndex: 3, label: 'Spleen Channel', emoji: '💧', weeks: 2, progress: 6,
            bonus: { staminaRegenPct: 1, resiliencePct: 1 }, desc: '+1% stamina regen & resilience · opens Spleen (max 3×)' },
        { id: 'heart', meridianIndex: 4, label: 'Heart Channel', emoji: '❤️', weeks: 2, progress: 6,
            bonus: { willpowerPct: 1, techniqueEfficiencyPct: 1 }, desc: '+1% willpower & technique efficiency · opens Heart (max 3×)' },
        { id: 'small_intestine', meridianIndex: 5, label: 'Small Intestine Channel', emoji: '🫁', weeks: 2, progress: 6,
            bonus: { techniquePrecisionPct: 1 }, desc: '+1% technique precision · opens Small Intestine (max 3×)' },
        { id: 'bladder', meridianIndex: 6, label: 'Bladder Channel', emoji: '💎', weeks: 2, progress: 6,
            bonus: { speedPct: 1, evasionPct: 1 }, desc: '+1% speed & evasion · opens Bladder (max 3×)' },
        { id: 'kidney', meridianIndex: 7, label: 'Kidney Channel', emoji: '🧠', weeks: 2, progress: 6,
            bonus: { maxHpPct: 1, vitalityPct: 1 }, desc: '+1% HP & vitality · opens Kidney (max 3×)' },
        { id: 'pericardium', meridianIndex: 8, label: 'Pericardium Channel', emoji: '⚡', weeks: 2, progress: 6,
            bonus: { fearResistPct: 1, elementalResistPct: 1 }, desc: '+1% fear & elemental resist · opens Pericardium (max 3×)' },
        { id: 'triple_burner', meridianIndex: 9, label: 'Triple Burner Channel', emoji: '🌙', weeks: 2, progress: 6,
            bonus: { qiEfficiencyPct: 1, staminaEfficiencyPct: 1 }, desc: '+1% Qi & Stamina efficiency · opens Triple Burner (max 3×)' },
        { id: 'gallbladder', meridianIndex: 10, label: 'Gallbladder Channel', emoji: '☀️', weeks: 2, progress: 6,
            bonus: { physicalDamagePct: 1, attackSpeedPct: 1 }, desc: '+1% damage & attack speed · opens Gallbladder (max 3×)' },
        { id: 'liver', meridianIndex: 11, label: 'Liver Channel', emoji: '🌿', weeks: 2, progress: 6,
            bonus: { poisonResistPct: 1, diseaseResistPct: 1 }, desc: '+1% poison & disease resist · opens Liver (max 3×)' },
        { id: 'microcosmic', label: 'Microcosmic Orbit', emoji: '🌀', weeks: 3, progress: 10, sub: 'microcosmic',
            bonus: { qiRegenPct: 2, qiEfficiencyPct: 1, techniqueEfficiencyPct: 1 },
            desc: '+2% Qi regen, +1% Qi & technique efficiency (max 2×)' }
    ],
    nerves: [
        { id: 'nerve_sea', label: 'Refine the Nerve Sea', emoji: '⚡', weeks: 4, progress: 100, once: true,
            materialCost: { rare_herb: 1, jade_inlay: 1 },
            bonus: {
                evasionPct: 3, attackSpeedPct: 3, techniquePrecisionPct: 2,
                fearResistPct: 2, speedPct: 2, willpowerPct: 2
            },
            desc: 'One-time capstone — +3% evasion & attack speed, +2% precision, fear resist, speed & willpower' }
    ]
};

// ===== SOUL CULTIVATION CHAMBER =====

const SOUL_CHAMBER_LAYER_ORDER = [
    'awakened', 'clarity', 'purity', 'dao_heart', 'manifestation', 'void', 'transcendent'
];

const SOUL_CHAMBER_LAYERS = {
    awakened: { id: 'awakened', label: 'Soul Core', emoji: '✨', unlockPrevPct: 0, color: '#9b7fd4' },
    clarity: { id: 'clarity', label: 'Mind Lake', emoji: '🪞', unlockPrevPct: 50, color: '#7eb8e8' },
    purity: { id: 'purity', label: 'Will Forge', emoji: '⚔️', unlockPrevPct: 50, color: '#c8d0e0' },
    dao_heart: { id: 'dao_heart', label: 'Dao Mirror', emoji: '☯️', unlockPrevPct: 50, color: '#d4b85c' },
    manifestation: { id: 'manifestation', label: 'Outer Soul', emoji: '👁️', unlockPrevPct: 50, color: '#c86eb8' },
    void: { id: 'void', label: 'Void Touch', emoji: '🌌', unlockPrevPct: 50, color: '#4a6a8a' },
    transcendent: { id: 'transcendent', label: 'Soul Dominion', emoji: '🌟', unlockPrevPct: 50, color: '#f0e8d0' }
};

// ===== SOUL MASS (spirit interior) =====

const SOUL_MASS_BALANCE = {
    massPerTier: 25,
    maxTier: 4,
    apexProgressComplete: 100,
    baselineResistPerSpirit: 0.008,
    baselineResistPerWill: 0.01,
    baselineResistCap: 0.20,
    massDefenderPctPerMass: 0.004,
    massDefenderCap: 0.25,
    pressureMassMin: 10,
    pressureIntimidateBonusTurns: 1,
    weakInteriorSpiritWillSum: 12,
    hollowDebuffAfterOveruse: false,
    progressionPerCondense: 4,
    progressionPerPalaceAction: 2,
    progressionPerSpiritBreakthrough: 15,
    /** Pre–soul-birth latent mass cap (below hard minimum — cannot stockpile combat-ready weight). */
    latentMassCap: 9,
    /** Hard minimum active Soul Mass — legal floor for soul cultivation & techniques. */
    hardMinMass: 10,
    /** Soft minimum — settled nascent soul; spirit-focused players naturally clear this. */
    softMinMass: 25,
    /** Off-path soul birth: latent → active conversion rate when embryo born from dantian/vessel. */
    offPathConversionRate: 0.55,
    /** Spirit-track soul birth with some foundation progress. */
    spiritPathConversionRate: 1.0,
    /** Dantian/vessel birth but spirit track realm II+ invested. */
    partialSpiritConversionRate: 0.75,
    /** Hollow nascent: below hard min after birth — combat & mitigation penalties. */
    hollowMitigationMult: 0.5,
    hollowPowerMult: 0.65,
    /** Nascent: at hard min but below soft min. */
    nascentMitigationMult: 0.85,
    nascentPowerMult: 0.9,
};

const SOUL_MATURITY_LABELS = {
    hollow: 'Hollow Nascent',
    nascent: 'Nascent Soul',
    settled: 'Settled Soul',
    ascendant: 'Ascendant Soul'
};

const SOUL_MASS_TIERS = [
    { tier: 0, label: 'Unformed', massMin: 0 },
    { tier: 1, label: 'Condensed', massMin: 10 },
    { tier: 2, label: 'Weighted', massMin: 25 },
    { tier: 3, label: 'Dominant', massMin: 50 },
    { tier: 4, label: 'Apex', massMin: 75 },
];

const SOUL_CONDENSATION_BALANCE = {
    defaultMassMin: 10,
    enemyPhysiqueBypassPct: 0.35,
    soulSpikeBypassPct: 0.50,
    weakInteriorBonusPct: 0.20,
    weakInteriorStatSum: 14,
    offPathDamageMult: 0.82,
    offPathCostMult: 1.15,
    lowMassDamageMult: 0.70,
    lowMassCostMult: 1.20,
    searchCombatWeakTurns: 2,
    searchCombatDmgMult: 0.75,
    searchExploreBonusPct: 8,
    searchNpcInsightChance: 0.35,
};

const SOUL_CONDENSATION_MANUALS = [
    { technique: 'Soul Spike', massMin: 25, source: 'soul_palace', layer: 'awakened' },
    { technique: 'Soul Search', massMin: 10, source: 'market', zone: 'spirit_market' },
];

/** Soul Mass condensation — prelude + deep palace layers. */
const SOUL_PALACE_CONDENSE_ACTIONS = {
    prelude: [
        { id: 'condense_spirit', label: 'Condense Spirit', emoji: '💠', weeks: 3, massGain: 4, apexProgress: 4, maxStacks: 5,
            desc: 'Compress spirit foundation into latent weight — +4 latent mass (cap 9 pre-birth), +4% apex progress (max 5×)' }
    ],
    awakened: [
        { id: 'weigh_will', label: 'Weigh the Will', emoji: '⚖️', weeks: 4, massGain: 6, apexProgress: 2, maxStacks: 4,
            requiresLayerProgress: 25,
            desc: 'Press will into the soul core — +6 Soul Mass (requires 25% Soul Core, max 4×)' }
    ],
    clarity: [
        { id: 'settle_mass', label: 'Settle Mass', emoji: '🔮', weeks: 3, massGain: 5, apexProgress: 3, maxStacks: 3,
            desc: 'Anchor condensed spirit at the mind lake — +5 Soul Mass, +3% apex (max 3×)' }
    ]
};

/** Phase 1 spirit foundation — always available before soul birth. */
const SOUL_PALACE_PRELUDE_ACTIONS = [
    { id: 'sense_inward', label: 'Sense Inward', emoji: '🧘', weeks: 2, progress: 20,
        bonus: { willpowerPct: 2, fearResistPct: 2 },
        desc: 'Turn awareness inward — +2% willpower & fear resistance (max 3×)' },
    { id: 'steady_heart', label: 'Steady Heart', emoji: '💠', weeks: 2, progress: 20,
        bonus: { daoAlignmentPct: 2 },
        desc: 'Calm mortal spirit — +2% Dao Alignment (max 3×)' },
    { id: 'gather_essence', label: 'Gather Essence', emoji: '🌊', weeks: 2, progress: 20,
        bonus: { qiRegenPct: 1, staminaRegenPct: 1 },
        desc: 'Draw faint essence into the soul — +1% Qi & stamina regen (max 3×)' }
];

const SOUL_EMBRYO_AWAKEN_MESSAGES = {
    dantian: '🌟 The dantian births a Nascent Soul — the palace depths awaken.',
    vessel: '🌟 Vitality coils inward; a Vital Soul manifests — the palace depths awaken.',
    spirit: '🌟 Spirit reaches Soul Integration — the soul is born and palace depths awaken.'
};

const SOUL_EMBRYO_ORIGIN_PERKS = {
    dantian: { willpowerPct: 2 },
    vessel: { fearResistPct: 2 },
    spirit: { daoComprehensionPct: 2 }
};

const SOUL_CHAMBER_BALANCE = {
    defaultMaxStacks: 3,
    transcendentFame: 8
};

const SOUL_CHAMBER_BONUS_CAPS = {
    willpowerPct: 35,
    fearResistPct: 30,
    qiRegenPct: 25,
    staminaRegenPct: 25,
    daoComprehensionPct: 25,
    techniqueEfficiencyPct: 30,
    daoAlignmentPct: 40,
    qiEfficiencyPct: 20,
    staminaEfficiencyPct: 20
};

const SOUL_CHAMBER_ABILITIES = {
    awakened: [
        { id: 'soul_sense', label: 'Soul Sense', desc: '+10% dodge' },
        { id: 'soul_shield', label: 'Soul Shield', desc: 'Absorbs 30% of incoming damage' }
    ],
    clarity: [
        { id: 'insight', label: 'Insight', desc: '+15% critical hit chance' },
        { id: 'mind_shield', label: 'Mind Shield', desc: '+15% fear resistance' }
    ],
    purity: [
        { id: 'will_strike', label: 'Will Strike', desc: 'Bypasses physical defense' },
        { id: 'soul_burn', label: 'Soul Burn', desc: 'Applies soul damage over time' }
    ],
    dao_heart: [
        { id: 'dao_strike', label: 'Dao Strike', desc: 'Scales with Dao Alignment' },
        { id: 'soul_rend', label: 'Soul Rend', desc: 'Ignores all defenses' },
        { id: 'illusion', label: 'Illusion', desc: 'Distract the enemy' }
    ],
    manifestation: [
        { id: 'soul_clone', label: 'Soul Clone', desc: 'A clone fights for 2 turns' },
        { id: 'soul_prison', label: 'Soul Prison', desc: 'Trap enemy for 1 turn' }
    ],
    void: [
        { id: 'void_step', label: 'Void Step', desc: 'Teleport to avoid an attack' },
        { id: 'void_aura', label: 'Void Aura', desc: 'Enemies −20% damage and defense' }
    ],
    transcendent: [
        { id: 'transcendent_strike', label: 'Transcendent Strike', desc: 'Massive damage; ignores all defenses' },
        { id: 'soul_dominion', label: 'Soul Dominion', desc: 'Mind control for 1 turn' }
    ]
};

const SOUL_CHAMBER_ACTIONS = {
    awakened: [
        { id: 'sense_self', label: 'Sense Self', emoji: '🧘', weeks: 2, progress: 17,
            bonus: { willpowerPct: 2, fearResistPct: 2 },
            desc: '+2% willpower & fear resistance (max 3×)' },
        { id: 'gather_essence', label: 'Gather Essence', emoji: '🌊', weeks: 2, progress: 17,
            bonus: { qiRegenPct: 2, staminaRegenPct: 2 },
            desc: '+2% Qi & stamina regen (max 3×)' }
    ],
    clarity: [
        { id: 'purge_attachment', label: 'Purge Attachment', emoji: '🔥', weeks: 3, progress: 17,
            bonus: { daoComprehensionPct: 3 },
            desc: '+3% Dao comprehension speed (max 3×)' },
        { id: 'see_truth', label: 'See Truth', emoji: '👁️', weeks: 3, progress: 17,
            bonus: { techniqueEfficiencyPct: 3 },
            desc: '+3% technique efficiency (max 3×)' }
    ],
    purity: [
        { id: 'forge_will', label: 'Forge Will', emoji: '⚔️', weeks: 3, progress: 17,
            bonus: { willpowerPct: 5, fearResistPct: 3 },
            desc: '+5% willpower, +3% fear resistance (max 3×)' },
        { id: 'clarify_intent', label: 'Clarify Intent', emoji: '🎯', weeks: 3, progress: 17,
            bonus: { daoAlignmentPct: 5 },
            desc: '+5% Dao Alignment (max 3×)' }
    ],
    dao_heart: [
        { id: 'form_dao_heart', label: 'Form Dao Heart', emoji: '☯️', weeks: 4, progress: 17,
            bonus: { daoAlignmentPct: 10, willpowerPct: 5 },
            desc: '+10% Dao Alignment, +5% willpower (max 3×)' },
        { id: 'align_dao', label: 'Align with Dao', emoji: '🌀', weeks: 4, progress: 17,
            bonus: { daoComprehensionPct: 10, techniqueEfficiencyPct: 5 },
            desc: '+10% Dao comprehension, +5% technique efficiency (max 3×)' }
    ],
    manifestation: [
        { id: 'manifest_soul', label: 'Manifest Soul', emoji: '👁️', weeks: 4, progress: 17,
            materialCost: { rare_herb: 1 },
            bonus: { techniqueEfficiencyPct: 10, willpowerPct: 5 },
            desc: '+10% technique efficiency, +5% willpower · 1 Rare Herb (max 3×)' },
        { id: 'empower_soul', label: 'Empower Soul', emoji: '💫', weeks: 4, progress: 17,
            materialCost: { rare_herb: 1 },
            bonus: { daoAlignmentPct: 10, fearResistPct: 5 },
            desc: '+10% Dao Alignment, +5% fear resistance · 1 Rare Herb (max 3×)' }
    ],
    void: [
        { id: 'resonate_void', label: 'Resonate Void', emoji: '🌌', weeks: 5, progress: 17,
            bonus: { qiRegenPct: 10, staminaRegenPct: 10, qiEfficiencyPct: 5, staminaEfficiencyPct: 5 },
            desc: '+10% Qi/stamina regen, +5% efficiency (max 3×)' },
        { id: 'embrace_void', label: 'Embrace Void', emoji: '🕳️', weeks: 5, progress: 17,
            materialCost: { phoenix_ash: 1 },
            bonus: { techniqueEfficiencyPct: 10, willpowerPct: 5 },
            desc: '+10% technique efficiency, +5% willpower · 1 Legendary material (max 3×)' }
    ],
    transcendent: [
        { id: 'transcend_form', label: 'Transcend Form', emoji: '🌟', weeks: 6, progress: 17,
            bonus: { soulStatPct: 15 },
            desc: '+15% all soul-related stats (max 3×)' },
        { id: 'transcend_dao', label: 'Transcend Dao', emoji: '☀️', weeks: 6, progress: 17,
            requiresTrueDao: true,
            bonus: { daoAlignmentPct: 20, willpowerPct: 10 },
            desc: '+20% Dao Alignment, +10% willpower · requires a True Dao (max 3×)' }
    ]
};

// ===== REALM PROGRESS TIERS (breakthrough quality) =====
// Hasty tier stubbed — enable when cracked-foundation debuff + recovery hooks exist.

const REALM_PROGRESS_TIERS = {
    hastyPct: 55,
    settledPct: 80,
    peakPct: 100,
    hastyEnabled: false
};

/** Multipliers applied at seal time and breakthrough based on consolidation tier. */
const BREAKTHROUGH_TIER_SCALE = {
    hasty: {
        foundationMult: 0.5,
        maxQiMult: 0.6,
        densityMult: 0.6,
        lifespanMult: 0.7,
        tribulationSeverityBonus: 12,
        breakChancePenalty: -12,
        label: 'Hasty'
    },
    settled: {
        foundationMult: 0.75,
        maxQiMult: 0.85,
        densityMult: 0.85,
        lifespanMult: 0.85,
        tribulationSeverityBonus: 6,
        breakChancePenalty: -5,
        label: 'Settled'
    },
    peak: {
        foundationMult: 1,
        maxQiMult: 1,
        densityMult: 1,
        lifespanMult: 1,
        tribulationSeverityBonus: 0,
        breakChancePenalty: 0,
        label: 'Peak'
    },
    perfect: {
        foundationMult: 1,
        maxQiMult: 1,
        densityMult: 1,
        lifespanMult: 1,
        tribulationSeverityBonus: 0,
        breakChancePenalty: 0,
        label: 'Perfect'
    }
};

/** Short capstone grind from Settled (~80%) to Peak (100%) — not full chamber re-grind. */
const PEAK_GRIND_BY_PATH = {
    qi: { months: 2, progressBoost: 18, label: 'Condense to Peak' },
    body: { months: 1, progressBoost: 20, label: 'Forge to Peak' },
    soul: { months: 1, progressBoost: 20, label: 'Integrate to Peak' }
};

// ===== REALM CONSOLIDATION (Foundation mastery) =====

const CONSOLIDATION_BY_REALM = {
    0: {
        peakLabel: "Peak Qi Condensation",
        peak: { qiFillRatio: 0.85, minQiDensity: 1.35, minTotalStats: 16 },
        months: 3,
        stones: 0,
        foundationGain: 5,
        maxQiGain: 5,
        qiDensityGain: 0.4,
        flavor: "Qi settles like sediment into bedrock — your cultivation has a root.",
        perfect: {
            extraStones: 5,
            minMeridians: 2,
            bonusFoundation: 2,
            permanent: { breakthrough: 3 },
            flavor: "Your roots reach deeper than your peers dare imagine."
        }
    },
    1: {
        peakLabel: "Peak Foundation Establishment",
        peak: { qiFillRatio: 0.85, minQiDensity: 2.2, minTotalStats: 28, minMeridians: 1 },
        months: 5,
        stones: 10,
        foundationGain: 8,
        maxQiGain: 8,
        qiDensityGain: 0.55,
        flavor: "The foundation you laid will not crack under heaven's weight.",
        perfect: {
            extraStones: 5,
            minMeridians: 4,
            bonusFoundation: 3,
            permanent: { breakthrough: 4 },
            flavor: "Others build houses. You built a mountain."
        }
    },
    2: {
        peakLabel: "Peak Core Formation",
        peak: { qiFillRatio: 0.88, minQiDensity: 3.0, minTotalStats: 42, minMeridians: 3 },
        months: 7,
        stones: 20,
        sacrificeTechnique: true,
        foundationGain: 10,
        maxQiGain: 10,
        qiDensityGain: 0.7,
        flavor: "Your golden core hums in perfect stillness.",
        perfect: {
            extraStones: 10,
            bonusFoundation: 3,
            permanent: { breakthrough: 5, techniqueDmgPct: 0.05 },
            flavor: "The core's resonance will never fade."
        }
    },
    3: {
        peakLabel: "Peak Nascent Soul",
        peak: { qiFillRatio: 0.88, minQiDensity: 3.8, minTotalStats: 55, minMeridians: 5 },
        months: 10,
        stones: 30,
        miniTribulation: true,
        foundationGain: 12,
        maxQiGain: 12,
        qiDensityGain: 0.85,
        flavor: "Soul and realm move as one — you are ready to step beyond.",
        perfect: {
            extraStones: 15,
            bonusFoundation: 4,
            permanent: { breakthrough: 5, mentalResistPct: 0.08 },
            flavor: "The mini-tribulation left you tempered, not scarred."
        }
    },
    4: {
        peakLabel: "Peak Void Refinement",
        peak: { qiFillRatio: 0.90, minQiDensity: 4.6, minTotalStats: 70, minMeridians: 7 },
        months: 12,
        stones: 50,
        legendaryMaterial: true,
        foundationGain: 15,
        maxQiGain: 15,
        qiDensityGain: 1.0,
        flavor: "Void and self overlap — cultivation has nowhere left to leak.",
        perfect: {
            extraStones: 25,
            bonusFoundation: 5,
            permanent: { breakthrough: 6, daoSpeedPct: 0.05 },
            flavor: "You refined not just the void, but yourself."
        }
    },
    5: {
        peakLabel: "Peak Dao Seeking",
        peak: { qiFillRatio: 0.90, minQiDensity: 5.4, minTotalStats: 85, minMeridians: 9 },
        months: 15,
        stones: 100,
        daoFragment: true,
        foundationGain: 18,
        maxQiGain: 18,
        qiDensityGain: 1.2,
        flavor: "The Dao recognizes your footing before you take the next step.",
        perfect: {
            extraStones: 40,
            bonusFoundation: 5,
            permanent: { breakthrough: 8, allStatsPct: 0.05 },
            flavor: "Insight and foundation became indistinguishable."
        }
    }
};

// Silhouette colors per cultivation path
const CULTIVATOR_VISUAL = {
    qi:   { stroke: '#b8863a', fill: '#2a2018', glow: '184,134,58' },
    body: { stroke: '#d4845a', fill: '#281814', glow: '212,120,72' },
    soul: { stroke: '#a88ad4', fill: '#181424', glow: '154,122,212' }
};

// ===== COMBAT — path-specific resources & costs =====
const COMBAT_PATH = {
    qi: {
        resource: 'Breath',
        icon: '🌬️',
        cssClass: 'resource-breath',
        barColor: '#4ecdc4',
        shieldLabel: 'Qi Barrier',
        secondaryAction: 'defend',
        secondaryLabel: '🛡️ Defend',
        maxResource(g) {
            const cap = typeof getMaxQi === 'function' ? getMaxQi() : g.qi * 2;
            const foundation = typeof getEffectiveFoundationFromState === 'function'
                ? getEffectiveFoundationFromState(g) : (g.foundation || 0);
            const rootDepth = Math.floor(foundation / 5);
            return 25 + Math.floor(cap * 0.65) + g.realmIdx * 4 + rootDepth;
        },
        regen(g) {
            const dens = typeof getQiDensity === 'function' ? getQiDensity() : g.qi / 8;
            const foundation = typeof getEffectiveFoundationFromState === 'function'
                ? getEffectiveFoundationFromState(g) : (g.foundation || 0);
            const circulation = Math.floor(foundation / 15);
            return 2 + Math.floor(g.realmIdx / 3) + Math.floor(dens * 1.0) + circulation;
        },
        costs: { attack: 3, defend: 3, flee: 6, technique: 0, special: 4 }
    },
    body: {
        resource: 'Stamina',
        icon: '💢',
        cssClass: 'resource-stamina',
        barColor: '#e07050',
        shieldLabel: null,
        secondaryAction: 'fortify',
        secondaryLabel: '💪 Fortify',
        maxResource(g) {
            const foundation = typeof getEffectiveFoundationFromState === 'function'
                ? getEffectiveFoundationFromState(g) : (g.foundation || 0);
            const rootDepth = Math.floor(foundation / 6);
            return 40 + Math.floor(g.vitality * 2.5) + g.realmIdx * 3 + rootDepth;
        },
        regen(g) {
            const foundation = typeof getEffectiveFoundationFromState === 'function'
                ? getEffectiveFoundationFromState(g) : (g.foundation || 0);
            const circulation = Math.floor(foundation / 18);
            return 2 + Math.floor(g.realmIdx / 4) + Math.floor(g.vitality / 10) + circulation;
        },
        costs: { attack: 4, defend: 4, flee: 8, technique: 0, special: 12 }
    },
    soul: {
        resource: 'Focus',
        icon: '👁️',
        cssClass: 'resource-focus',
        barColor: '#a88ad4',
        shieldLabel: 'Soul Shield',
        secondaryAction: 'intimidate',
        secondaryLabel: '👁️ Intimidate',
        maxResource(g) {
            const foundation = typeof getEffectiveFoundationFromState === 'function'
                ? getEffectiveFoundationFromState(g) : (g.foundation || 0);
            const rootDepth = Math.floor(foundation / 8);
            return 22 + g.will * 2 + g.spirit + g.realmIdx * 3 + rootDepth;
        },
        regen(g) {
            const foundation = typeof getEffectiveFoundationFromState === 'function'
                ? getEffectiveFoundationFromState(g) : (g.foundation || 0);
            const circulation = Math.floor(foundation / 20);
            return 3 + Math.floor(g.will / 5) + Math.floor(g.realmIdx / 3) + circulation;
        },
        costs: { attack: 4, defend: 5, flee: 6, technique: 0, special: 10 }
    }
};

// ===== FORBIDDEN GROUNDS =====
const FORBIDDEN_BALANCE = {
    searchRealmMin: 2,
    enterRealmMin: 3,
    searchMonths: 6,
    enterMonths: 12,
    searchClueChance: 0.12,
    searchFragmentChance: 0.05,
    exploreFragmentChance: 0.04,
    mirrorDamageReduction: 0.70,
    mirrorPatternLength: 3,
    mirrorHpMult: 1.45,
    mirrorRegenPct: 0.05,
    mirrorRepeatDamageMult: 0.12,
    mirrorCopyDamageMult: 1.40,
    mirrorEchoPerStreak: 0.20,
    gardenDecayCap: 12,
    gardenDecayHigh: 6,
    gardenDecayCritical: 9,
    repeatableTrials: true,
    skipEnterTimeOnRepeat: true,
    crucibleWaves: 5,
    crucibleHpMult: 1.08,
    crucibleHpScalePerWave: 0.18,
    crucibleHpFromPlayerMaxPct: 0.32,
    crucibleMinHits: 5,
    crucibleMaxHitBudget: 6,
    crucibleMaxHpPlayerMult: 0.42,
    crucibleDmgMult: 1.15,
    crucibleDmgPerWave: 2,
    crucibleMaxDmgPctPerHit: 0.09,
    crucibleBetweenWaveResourcePct: 0.22,
    silenceCap: 10,
    silenceHigh: 5,
    silenceCritical: 8,
    silenceEchoThreshold: 6,
    silenceEchoHpPct: 0.12,
    silenceCombatNoiseAttack: 1,
    silenceCombatNoiseTechnique: 2,
    silenceCombatNoiseReduceDefend: 1,
    mawDoubtCap: 8,
    mawDoubtHigh: 4,
    mawDoubtCritical: 6,
    templeMaxLoops: 3,
    observatoryScrutinyCap: 5
};

const FORBIDDEN_GROUNDS = {
    mirror_lake: {
        name: "Mirror Lake",
        emoji: "🪞",
        zone: "heartlands",
        implemented: true,
        trialType: "mirror",
        clues: {
            rumor: "A sect elder murmurs of a lake that shows no sky — only the face of whoever stands at its shore.",
            fragment: { item: "Shard of Still Water", text: "The shard is cold as moonlight. A pavilion on water flickers in your mind." },
            resonance: "Your Dao stirs. Something beneath the Heartlands reflects your cultivation back — not as enemy, but as equal."
        },
        unlockText: "Three truths converge. At dawn the lake exists on no map — yet you know the way.",
        enterFlavor: "Mist parts. You stand at Mirror Lake. The water is perfectly still. Your reflection steps out."
    },
    silent_mountain: {
        name: "Silent Mountain",
        emoji: "🏔️",
        zone: "frostbite",
        implemented: true,
        trialType: "silence",
        clues: {
            rumor: "They say a peak in the wastes swallows every sound — and every cultivator who shouts.",
            fragment: { item: "Mute Bell Shard", text: "The bell makes no noise when struck. The mountain waits in silence." },
            resonance: "Wind ceases. Your Dao hears a mountain that refuses to speak."
        },
        unlockText: "Silence gathers. A path opens where sound dies.",
        enterFlavor: "Snow crunches once — then never again."
    },
    sunken_temple: {
        name: "Sunken Temple",
        emoji: "🏛️",
        zone: "jade",
        implemented: true,
        trialType: "temple",
        clues: {
            rumor: "Divers speak of a temple beneath the tides where time runs backward.",
            fragment: { item: "Sunken Hourglass Chip", text: "Sand flows upward in the chip. The temple remembers." },
            resonance: "Past and present blur. The temple calls across the loops."
        },
        unlockText: "The hourglass turns. A drowned gate reveals itself.",
        enterFlavor: "You descend through brine into air that should not exist."
    },
    ashen_garden: {
        name: "Ashen Garden",
        emoji: "🥀",
        zone: "emberwild",
        implemented: true,
        trialType: "garden",
        clues: {
            rumor: "Volcano ash hides a garden where flowers bloom from bones. None return unchanged.",
            fragment: { item: "Petal of Grey Bloom", text: "It crumbles at a touch, leaving ash and funeral incense on your palm." },
            resonance: "Life and death are not opposites here — they are negotiators. The garden waits."
        },
        unlockText: "The garden calls. Not to warriors — to those who know immortality is measured.",
        enterFlavor: "Black vines part. Pale flowers glow under volcanic ash. Your lifespan twitches with each breath."
    },
    whispering_maw: {
        name: "Whispering Maw",
        emoji: "👄",
        zone: "dustbone",
        implemented: true,
        trialType: "maw",
        clues: {
            rumor: "Madmen in the desert babble of a mouth in the sand that speaks only lies.",
            fragment: { item: "False Tongue Stone", text: "It whispers numbers that cannot be true." },
            resonance: "Your senses rebel. Truth and illusion trade places."
        },
        unlockText: "The Maw yawns. Reality wavers at its edge.",
        enterFlavor: "Teeth of stone rise from the dunes. Nothing here is what it seems."
    },
    iron_crucible: {
        name: "Iron Crucible",
        emoji: "🔥",
        zone: "emberwild",
        implemented: true,
        trialType: "crucible",
        clues: {
            rumor: "Smiths tell of a crater where cultivators are forged or broken.",
            fragment: { item: "Slag of the Crucible", text: "Still warm after centuries. It hungers for endurance." },
            resonance: "Pain becomes scripture. The Crucible tests what remains when hope is gone."
        },
        unlockText: "Heat without end. The Crucible opens to the worthy.",
        enterFlavor: "Air shimmers. Enemies without number wait inside."
    },
    celestial_observatory: {
        name: "Celestial Observatory",
        emoji: "🔭",
        zone: "heartlands",
        implemented: true,
        trialType: "observatory",
        clues: {
            rumor: "Star-readers whisper of a tower that asks questions only the honest can answer.",
            fragment: { item: "Star Chart Scrap", text: "Constellations rearrange when you look away." },
            resonance: "The void watches. Your journey is an open book to the heavens."
        },
        unlockText: "Stars align. A stairway climbs where sky meets soul.",
        enterFlavor: "You climb above the clouds. Something ancient awaits your answer."
    }
};

const ASHEN_GARDEN_INTRO =
    "The Ashen Garden trades in Decay — a withering of your life force. Each stack brings you closer to becoming part of the garden. " +
    "Reach 12 Decay and you are lost. At 6+ Decay, every step costs extra months of lifespan. " +
    "Patient choices usually cost more time but spare your life. Hasty or greedy choices save time — at a price.";

const ASHEN_GARDEN_NODES = [
    {
        text: "An ash-covered gate blocks the path inward. Funeral flowers bloom through the cracks. How do you pass?",
        choices: [
            {
                label: "Circle the wall slowly",
                flavor: "You walk the perimeter until the gate opens on its own — no force, no wound.",
                months: 9,
                decay: 0,
                log: "Patience spares your life force. The gate sighs open."
            },
            {
                label: "Force the gate open",
                flavor: "Bone splinters bite your palms. The garden accepts violence — and marks you for it.",
                months: 6,
                decay: 2,
                log: "You burst through. Quick, but Decay takes root in your meridians."
            },
            {
                label: "Read the inscription",
                flavor: "Ancient script describes the toll of this place. Understanding may spare you the worst of it.",
                months: 6,
                decay: 0,
                log: "The words settle in your heart. The gate opens without demanding blood.",
                require: { stat: "will", min: 6 },
                failLog: "The script blurs and twists. You stumble through blindly.",
                fail: { months: 9, decay: 1 }
            }
        ]
    },
    {
        text: "A fountain of grey water murmurs. It smells of memory and rot. It offers strength — for a cost.",
        choices: [
            {
                label: "Drink sparingly",
                flavor: "A single cup. Enough to heal, not enough to bind you to this place.",
                months: 6,
                decay: 0,
                log: "Warmth spreads through you. Your lifespan barely wavers.",
                hp: 15
            },
            {
                label: "Drink deep",
                flavor: "You gulp until the water runs dry. Power floods in — and Decay with it.",
                months: 6,
                decay: 2,
                log: "You feel mighty. Ash creeps through your veins.",
                hp: 30
            },
            {
                label: "Offer spirit stones",
                flavor: "You pour stones into the basin and let the fountain drink wealth instead of your life.",
                months: 12,
                decay: 0,
                log: "The waters calm. An old wound in your spirit closes — Decay eases.",
                stones: -10,
                decayBonus: -1
            }
        ]
    },
    {
        text: "A tree of white bark bears fruit that pulses like hearts. It is beautiful. That is the trap.",
        choices: [
            {
                label: "Pass without touching",
                flavor: "Some temptations are best left sleeping. You keep walking.",
                months: 6,
                decay: 0,
                log: "The fruit beats louder as you leave, then falls silent."
            },
            {
                label: "Harvest the fruit",
                flavor: "Sweetness on the tongue. Foundation grows — but the garden claims its toll.",
                months: 6,
                decay: 2,
                log: "Power lingers on your lips. Decay blooms in your dantian.",
                foundation: 3
            },
            {
                label: "Prune the dead branch",
                flavor: "You cut away death's finger from the living wood. Hard work, clean conscience.",
                months: 12,
                decay: 0,
                log: "Sap runs clear. The tree bows as if in thanks.",
                require: { stat: "vitality", min: 8 },
                failLog: "The branch snaps back and lashes you.",
                fail: { months: 9, decay: 2, hp: -10 }
            }
        ]
    },
    {
        text: "Two paths fork — one strewn with petals, one with bones. Both lead inward.",
        choices: [
            {
                label: "Path of petals",
                flavor: "Soft underfoot, fragrant air — too pleasant. Beauty here always hides rot.",
                months: 9,
                decay: 1,
                log: "The petals crumble to ash at your touch. A little of you crumbles too."
            },
            {
                label: "Path of bones",
                flavor: "Honest and harsh. You walk among the dead and feel no illusions.",
                months: 12,
                decay: 0,
                log: "Grim footing, but your life force stays steady."
            },
            {
                label: "Climb over the hedge",
                flavor: "Why walk the paths at all? You scramble over thorns to skip ahead.",
                months: 6,
                decay: 1,
                log: "Thorns rake your skin. You save time, not Decay.",
                require: { stat: "vitality", min: 10 },
                failLog: "The hedge throws you back bloody.",
                fail: { months: 9, decay: 2, hp: -15 }
            }
        ]
    },
    {
        text: "A ring lies on a corpse that is also a root. The garden watches to see what you value.",
        choices: [
            {
                label: "Leave the dead in peace",
                flavor: "Greed has no place here — or so you tell yourself.",
                months: 6,
                decay: 0,
                log: "The corpse-root stills. The garden notes your restraint."
            },
            {
                label: "Take the ring",
                flavor: "Cold gold, quick profit. The garden always collects its fee.",
                months: 3,
                decay: 3,
                log: "Stones fill your pouch. Decay fills the space they left.",
                stones: 25
            },
            {
                label: "Bury the remains",
                flavor: "You dig through ash until the dead are covered. Slow, sacred, clean.",
                months: 12,
                decay: 0,
                log: "The earth accepts them. Word of your deed will travel.",
                fame: 5
            }
        ]
    },
    {
        text: "The Heart of Ash blooms — a flower of black flame. One final toll before you may leave.",
        choices: [
            {
                label: "Approach with humility",
                flavor: "You kneel. The flame judges not your power, but your restraint.",
                months: 12,
                decay: 0,
                log: "The Heart opens. You pass with your life force intact.",
                final: true
            },
            {
                label: "Seize the heart by force",
                flavor: "You grab the flame. It does not burn — it devours years instead.",
                months: 6,
                decay: 3,
                log: "Power surges. Decay spikes. You survive — barely.",
                final: true
            },
            {
                label: "Offer a memory",
                flavor: "You surrender a piece of who you were. The garden accepts what cannot be bought.",
                months: 18,
                decay: 0,
                log: "Something precious leaves you. The Heart blooms in its place.",
                final: true,
                require: { stat: "spirit", min: 8 },
                failLog: "Your spirit falters. The Heart dims but does not yield.",
                fail: { months: 12, decay: 2, final: true }
            }
        ]
    }
];

const SILENT_MOUNTAIN_INTRO =
    "Silent Mountain devours Noise — every shout, every reckless strike. Keep Noise below 10 or the peak rejects you. " +
    "At 5+ Noise, the mountain's echo grows hungry. At 8+, each step costs extra lifespan. " +
    "Quiet choices cost time. Loud choices save months — but the mountain remembers.";

const SILENT_MOUNTAIN_NODES = [
    {
        text: "The trail vanishes into white silence. Your breath is the loudest thing here. How do you climb?",
        choices: [
            {
                label: "Climb in stillness",
                flavor: "One foot, then the next. No words. No wasted motion.",
                months: 9,
                noise: 0,
                log: "The mountain does not answer — but it allows you to pass."
            },
            {
                label: "Shout to prove you live",
                flavor: "Your voice dies instantly. Something cold takes notice.",
                months: 6,
                noise: 3,
                log: "Only your heartbeat returns. Noise coils in your chest."
            },
            {
                label: "Mark the path with qi",
                flavor: "A silent pulse in the snow — discipline, not clamor.",
                months: 6,
                noise: 0,
                log: "Qi flows without sound. The path remembers you.",
                require: { stat: "will", min: 6 },
                failLog: "Your qi sputters like a cough. The mountain adds to your Noise.",
                fail: { months: 9, noise: 2 }
            }
        ]
    },
    {
        text: "A cavern mouth yawns. Stalactites hang like mute bells. Light would crack the silence.",
        choices: [
            {
                label: "Cross in darkness",
                flavor: "Hands on stone. Breath measured. Nothing else.",
                months: 12,
                noise: 0,
                log: "Darkness passes through you like water."
            },
            {
                label: "Shatter a hanging shard",
                flavor: "A shortcut — and a thunderclap that never was.",
                months: 6,
                noise: 2,
                log: "The shard falls without sound. Your Noise does not."
            },
            {
                label: "Offer spirit stones",
                flavor: "Wealth given quietly. The cavern accepts tribute.",
                months: 9,
                noise: 0,
                log: "The stones vanish. The path ahead brightens without flame.",
                stones: -8,
                noiseBonus: -1
            }
        ]
    },
    {
        text: "Frozen monks sit in a ring, mouths open in eternal screams that make no sound. One block still stands.",
        choices: [
            {
                label: "Bow and pass",
                flavor: "Respect costs nothing loud.",
                months: 6,
                noise: 0,
                log: "The monks do not move. Neither does your Noise."
            },
            {
                label: "Strike the standing monk",
                flavor: "Ice explodes silently. Foundation hardens — Noise screams.",
                months: 6,
                noise: 3,
                log: "The statue crumbles. Your cultivation steels — the mountain marks you.",
                foundation: 4
            },
            {
                label: "Meditate among them",
                flavor: "Will against will, in perfect quiet.",
                months: 12,
                noise: 0,
                log: "Their silent agony becomes your lesson.",
                require: { stat: "will", min: 10 },
                failLog: "Their silence breaks your focus. Noise rises.",
                fail: { months: 9, noise: 2 }
            }
        ]
    },
    {
        text: "The final ridge. Wind that does not howl. Below, the world; above, the mute peak.",
        choices: [
            {
                label: "Crawl through the snow",
                flavor: "Humility is quieter than pride.",
                months: 9,
                noise: 0,
                log: "Cold bites. Noise does not."
            },
            {
                label: "Sprint the ridge",
                flavor: "Fast, reckless, loud in the language of motion.",
                months: 3,
                noise: 2,
                log: "You arrive breathless. The mountain counts every gasp."
            },
            {
                label: "Channel qi in silence",
                flavor: "Power without voice — the mountain's own language.",
                months: 6,
                noise: 0,
                log: "Qi moves like breath through frost.",
                require: { stat: "qi", min: 15 },
                failLog: "Your qi crackles. Noise spikes.",
                fail: { months: 9, noise: 2 }
            }
        ]
    },
    {
        text: "The summit. A warden of ice and absence waits. Or — if you are quiet enough — the peak offers peace without blood.",
        choices: [
            {
                label: "Become one with the silence",
                flavor: "No fight. Only stillness. Only for those the mountain trusts.",
                months: 12,
                noise: 0,
                log: "The warden fades. You stand alone with the sky.",
                final: true,
                require: { stat: "noiseMax", max: 4 },
                failLog: "Your Noise is too loud. The warden awakens.",
                fail: { months: 6, noise: 1, combat: true }
            },
            {
                label: "Face the Silent Warden",
                flavor: "Steel your breath. Every strike will echo inside you.",
                months: 6,
                noise: 0,
                log: "The warden rises. Sound dies between you.",
                combat: true
            },
            {
                label: "Turn back",
                flavor: "The mountain allows cowards to leave — once.",
                months: 3,
                noise: 0,
                log: "You descend. The peak keeps its secrets.",
                quit: true
            }
        ]
    }
];

const WHISPERING_MAW_INTRO =
    "The Whispering Maw is a wound in the desert where voices offer everything you want to hear. Doubt grows when you listen.";

const WHISPERING_MAW_NODES = [
    {
        id: "threshold",
        title: "Threshold of Lies",
        text: "Sand falls upward. A voice like your own says you were always meant to be a legend.",
        choices: [
            {
                label: "Answer honestly: I am still becoming.",
                flavor: "Truth is quiet here.",
                months: 2,
                doubt: -1,
                log: "The Maw hisses, disappointed."
            },
            {
                label: "Answer: I am already a legend.",
                flavor: "The lie tastes sweet.",
                months: 1,
                doubt: 2,
                fame: 5,
                log: "Echoes cheer. Your reflection grins too wide."
            },
            {
                label: "Stay silent",
                flavor: "Let the voice spend itself.",
                months: 3,
                doubt: 0,
                log: "Silence is the only currency the Maw respects."
            }
        ]
    },
    {
        id: "mirror_sand",
        title: "Mirror Sand",
        text: "The dunes show futures where you never failed. One path glitters with effortless breakthroughs.",
        choices: [
            {
                label: "Reject the easy path",
                flavor: "Breakthroughs without cost are traps.",
                months: 2,
                doubt: -1,
                log: "The glittering path crumbles."
            },
            {
                label: "Step onto the easy path",
                flavor: "Just for a moment.",
                months: 1,
                doubt: 2,
                qi: 40,
                log: "Qi floods in — and something hollow follows."
            },
            {
                label: "Study the illusion",
                flavor: "Learn how the Maw lies.",
                months: 3,
                doubt: 0,
                insight: 1,
                log: "You memorize the shape of false promise."
            }
        ]
    },
    {
        id: "hollow_offer",
        title: "Hollow Offer",
        text: "A figure offers a technique scroll that would make you untouchable. The ink smells of ash.",
        choices: [
            {
                label: "Refuse the scroll",
                flavor: "Power without foundation collapses.",
                months: 2,
                doubt: -1,
                log: "The figure dissolves into whispers."
            },
            {
                label: "Take the scroll",
                flavor: "Untouchable sounds nice.",
                months: 1,
                doubt: 3,
                stones: 30,
                log: "The scroll turns to sand in your pouch. The doubt remains."
            },
            {
                label: "Burn the scroll",
                flavor: "Fire clarifies.",
                months: 2,
                doubt: 0,
                hp: -8,
                log: "Ash spirals up. The Maw recoils."
            }
        ]
    },
    {
        id: "voice_heart",
        title: "Voice at the Heart",
        text: "At the center, every voice merges into one that knows your name and your fears.",
        choices: [
            {
                label: "Speak your true name and path",
                flavor: "Own what you are.",
                months: 2,
                doubt: -2,
                log: "The chorus falters. For a moment, only you speak."
            },
            {
                label: "Let the voices speak for you",
                flavor: "Easier to agree.",
                months: 1,
                doubt: 2,
                fame: 8,
                log: "They proclaim your greatness. You feel smaller."
            },
            {
                label: "Cover your ears and walk",
                flavor: "Physical honesty.",
                months: 3,
                doubt: 0,
                log: "Blood trickles. The heart of the Maw is close."
            }
        ]
    },
    {
        id: "heart",
        title: "Heart of the Maw",
        text: "The whispers stop. A hollow copy of you waits — or a clear exit if doubt has not eaten your resolve.",
        choices: [
            {
                label: "Speak without embellishment",
                flavor: "Low doubt: the Maw releases you.",
                months: 2,
                doubt: 0,
                log: "You speak plain truth. The desert exhales.",
                clearPeaceful: true,
                requiresLowDoubt: true
            },
            {
                label: "Fight the Hollow Lie",
                flavor: "High doubt: your reflection attacks.",
                months: 1,
                doubt: 0,
                log: "The Hollow Lie rises — every flattering word made flesh.",
                combat: "hollow_lie"
            },
            {
                label: "Flee the Maw",
                flavor: "Leave the wound open.",
                months: 2,
                doubt: 0,
                log: "You crawl out. The whispers follow for days.",
                quit: true
            }
        ]
    }
];

const SUNKEN_TEMPLE_INTRO =
    "The Sunken Temple drowned in jade waters but never forgot its rites. Wrong steps rewind time — the same bells, again.";

const SUNKEN_TEMPLE_NODES = [
    {
        id: "gate",
        title: "Sunken Gate",
        text: "Barnacles cling to scripture. Three stone fish swim in a circle — one direction feels older than the others.",
        choices: [
            {
                label: "Follow the fish clockwise",
                flavor: "The old rite.",
                months: 2,
                log: "The gate groans open. Water does not enter.",
                correct: true
            },
            {
                label: "Follow counter-clockwise",
                flavor: "Perhaps reversal is wisdom.",
                months: 1,
                log: "Bells toll. You stand at the gate again.",
                loop: true
            },
            {
                label: "Break the stone fish",
                flavor: "Force rarely respects rites.",
                months: 2,
                hp: -12,
                log: "Shards cut your palm. The gate opens anyway, grudgingly.",
                correct: true
            }
        ]
    },
    {
        id: "offering",
        title: "Hall of Offerings",
        text: "Altars demand tribute. A plaque reads: Give what you cannot spare, or give nothing and pass.",
        choices: [
            {
                label: "Offer spirit stones",
                flavor: "Wealth is easier to spare than self.",
                months: 2,
                stones: -25,
                log: "Stones sink into jade water. The hall brightens.",
                correct: true
            },
            {
                label: "Offer blood",
                flavor: "The temple smells of both.",
                months: 2,
                hp: -18,
                log: "Blood threads into the altar. Doors unlock.",
                correct: true
            },
            {
                label: "Offer a lie",
                flavor: "Promise eternal devotion.",
                months: 1,
                log: "The temple rejects you. Bells toll — the gate again.",
                loop: true
            }
        ]
    },
    {
        id: "scripture",
        title: "Flooded Scripture",
        text: "Half-drowned sutras list virtues in threes. One line is smeared — only 'Patience' and 'Clarity' remain legible.",
        choices: [
            {
                label: "Wait for the water to recede",
                flavor: "Patience.",
                months: 4,
                log: "The third virtue appears: Restraint. A path opens.",
                correct: true
            },
            {
                label: "Force the pages apart",
                flavor: "Clarity through violence.",
                months: 2,
                hp: -10,
                log: "Ink runs. Bells toll — the gate again.",
                loop: true
            },
            {
                label: "Memorize what remains",
                flavor: "Clarity without the third.",
                months: 3,
                insight: 1,
                log: "You learn much — but the temple is not satisfied.",
                loop: true
            }
        ]
    },
    {
        id: "bell",
        title: "Bell Chamber",
        text: "Seven bells, none labeled. A drowned priest's ghost mouths a count: three, then one, then three.",
        choices: [
            {
                label: "Ring: three, one, three",
                flavor: "Mimic the ghost.",
                months: 2,
                log: "Harmonics align. Stairs descend.",
                correct: true
            },
            {
                label: "Ring all seven at once",
                flavor: "Overwhelm the silence.",
                months: 1,
                log: "Cacophony. Bells toll — the gate again.",
                loop: true
            },
            {
                label: "Ring none — listen",
                flavor: "The ghost fades, disappointed.",
                months: 3,
                log: "Nothing. Bells toll — the gate again.",
                loop: true
            }
        ]
    },
    {
        id: "sanctum",
        title: "Jade Sanctum",
        text: "A pearl rests on a drowned throne. The loop ends here — if you have learned, or if you take what is offered.",
        choices: [
            {
                label: "Take the pearl with permission",
                flavor: "Ask the drowned priest.",
                months: 2,
                log: "The ghost nods. The pearl is yours.",
                clearPeaceful: true
            },
            {
                label: "Seize the pearl",
                flavor: "Loops taught you timing.",
                months: 1,
                hp: -15,
                log: "The throne fights back. You still win.",
                clearPeaceful: true
            },
            {
                label: "Leave the pearl, seal the temple",
                flavor: "Restraint, at last.",
                months: 3,
                insight: 2,
                log: "You seal the sanctum. The waters calm.",
                clearPeaceful: true
            }
        ]
    }
];

// ===== ZONE ENCOUNTERS (explore / travel) =====
const ENCOUNTER_BALANCE = {
    exploreChance: 0.38,
    travelChance: 0.22,
    combatRealmScale: true
};

const ZONE_ENCOUNTERS = {
    frostbite: [
        {
            id: "blizzard",
            title: "Whiteout",
            text: "A blizzard swallows the trail. Your breath freezes in the air.",
            choices: [
                { label: "Shelter in a cave", months: 2, foundation: 1, log: "You wait out the storm in silence." },
                { label: "Push through the snow", months: 2, hp: -12, stones: 8, log: "Frost bites deep, but you find a buried cache." },
                { label: "Meditate in the cold", months: 2, will: 2, log: "Pain becomes clarity. Your will hardens." }
            ]
        },
        {
            id: "frozen_ruins",
            title: "Frozen Ruins",
            text: "Ice-clad pillars mark a dead sect. Something still hums beneath the frost.",
            choices: [
                { label: "Search the ruins", months: 2, stones: 6, foundation: 1, log: "You salvage spirit stones from a cracked altar." },
                { label: "Disturb the guardian", months: 1, combat: "ice_guardian", log: "Frost animates — a guardian rises!" },
                { label: "Leave an offering", months: 1, stones: -5, fame: 2, log: "The ruins accept tribute. Word spreads of your respect." }
            ]
        },
        {
            id: "wolf_pack",
            title: "White Wolf Pack",
            text: "Yellow eyes circle you. The alpha has frost on its fangs.",
            choices: [
                { label: "Stand and fight", months: 1, combat: "wolf_pack", log: "The pack charges!" },
                { label: "Intimidate the alpha", months: 1, require: { stat: "will", min: 8 }, failLog: "They laugh with their eyes.", fail: { hp: -10, months: 1 }, stones: 4, fame: 3, log: "The alpha backs down. The pack disperses." },
                { label: "Flee across the ice", months: 2, hp: -6, log: "You escape, bleeding but alive." }
            ]
        },
        {
            id: "ice_wraith",
            title: "Ice Wraith",
            text: "A specter of killing frost drifts from a shattered ice spire. Your breath crystallizes before it reaches your lips.",
            choices: [
                { label: "Shatter the wraith", months: 1, combat: "ice_wraith", log: "Spirit frost lashes out — fight!" },
                { label: "Channel fire qi", months: 1, require: { stat: "qi", min: 15 }, failLog: "Your qi freezes solid.", fail: { hp: -12, months: 1 }, foundation: 1, log: "Heat drives the wraith back. You claim a shard of its core." },
                { label: "Retreat downwind", months: 2, hp: -4, log: "The wraith does not pursue. Your fingers numb for days." }
            ]
        }
    ],
    dustbone: [
        {
            id: "sandstorm",
            title: "Sandstorm",
            text: "The horizon vanishes in ochre fury. The dunes shift like a living thing.",
            choices: [
                { label: "Wait it out", months: 3, qi: 3, log: "You endure. The storm passes." },
                { label: "Charge through", months: 2, hp: -10, stones: 7, log: "Sand scours your skin. You find a buried chest." },
                { label: "Spend Qi to shield", months: 1, qi: -8, stones: 5, log: "Qi wraps you like silk. You emerge unscathed with loot." }
            ]
        },
        {
            id: "ancient_relic",
            title: "Ancient Relics",
            text: "Half-buried statues stare at a sky that forgot them.",
            choices: [
                { label: "Pry loose a relic", months: 2, stones: 10, hp: -5, log: "Gold and curse dust fall together." },
                { label: "Study the inscriptions", months: 3, foundation: 2, log: "Dead wisdom still teaches." },
                { label: "Walk away", months: 1, will: 1, log: "Some treasures cost more than stones." }
            ]
        },
        {
            id: "sand_serpent",
            title: "Sand Serpent",
            text: "The dune erupts. A serpent wide as a cart wheel uncoils.",
            choices: [
                { label: "Slay the beast", months: 1, combat: "sand_serpent", log: "The serpent hisses — fight!" },
                { label: "Offer spirit stones", months: 1, stones: -12, fame: 2, log: "It accepts tribute and sinks away." },
                { label: "Run", months: 2, hp: -8, log: "Its fangs graze your heel as you flee." }
            ]
        },
        {
            id: "scorpion_nest",
            title: "Scorpion Nest",
            text: "Chitin clicks beneath the sand. A nest of venom-tail scorpions surges from a buried burrow.",
            choices: [
                { label: "Crush the nest", months: 1, combat: "scorpion_nest", log: "The swarm boils up — fight!" },
                { label: "Flare qi to scatter them", months: 1, qi: -6, stones: 5, log: "The scorpions scatter. You grab what the nest guarded." },
                { label: "Back away slowly", months: 2, hp: -5, log: "One stinger finds your ankle before you clear the dunes." }
            ]
        }
    ],
    heartlands: [
        {
            id: "sect_tournament",
            title: "Sect Tournament",
            text: "Aerial platforms bloom over a valley. Disciples duel for glory.",
            choices: [
                { label: "Enter the ring", months: 2, combat: "tournament_rival", fame: 5, log: "The crowd roars. Your rival steps forward." },
                { label: "Watch and learn", months: 2, foundation: 2, spirit: 1, log: "You note three fatal openings in every form." },
                { label: "Decline politely", months: 1, log: "You are not ready — or so you claim." }
            ]
        },
        {
            id: "dao_lecture",
            title: "Dao Lecture",
            text: "An elder speaks to a thousand cultivators. Each word costs a year of lifespan to understand.",
            choices: [
                { label: "Listen in full", months: 3, spirit: 2, will: 2, foundation: 1, log: "Something clicks behind your eyes." },
                { label: "Challenge the elder", months: 2, require: { stat: "fame", min: 30 }, failLog: "The crowd jeers you out.", fail: { fame: -5, months: 1 }, combat: "elder_phantom", log: "The elder's phantom descends to test you." },
                { label: "Leave early", months: 1, log: "Half a Dao is still a hook in the mind." }
            ]
        },
        {
            id: "celestial_market",
            title: "Celestial Market",
            text: "Stalls sell pills that shouldn't exist and manuals that shouldn't be sold.",
            choices: [
                { label: "Browse the stalls", months: 2, pill: "spirit_gathering", log: "You acquire a rare pill at a fair price." },
                { label: "Haggle aggressively", months: 1, stones: 12, fame: -1, log: "You win the bargain. The merchant scowls." },
                { label: "Share tea with a merchant", months: 2, fame: 3, foundation: 1, log: "Connections matter in the Heartlands." }
            ]
        },
        {
            id: "sect_dispute",
            title: "Sect Dispute",
            text: "Two junior sects quarrel over a spiritual vein. Elders watch — they need a mediator, not a champion.",
            choices: [
                { label: "Mediate fairly", months: 2, require: { alignment: 50 }, fame: 4, foundation: 1, alignmentShift: 3, log: "Both sides accept your judgment. The Dao rewards impartiality." },
                { label: "Side with the stronger sect", months: 1, stones: 10, fame: -2, alignmentShift: -4, log: "Might makes right — you take your cut and move on." },
                { label: "Walk away", months: 1, log: "Their feud is not yours — yet." }
            ]
        },
        {
            id: "bandit_ambush",
            title: "Bandit Ambush",
            text: "Cultivators in rough sect robes block the road. Their leader twirls a notched blade.",
            choices: [
                { label: "Fight through", months: 1, combat: "bandit_ambush", log: "Steel flashes from the roadside!" },
                { label: "Pay the toll", months: 1, stones: -10, log: "They take your stones and melt into the wheat fields." },
                { label: "Intimidate them", months: 1, require: { stat: "fame", min: 15 }, failLog: "They call your bluff.", fail: { hp: -8, months: 1, combat: "bandit_ambush" }, fame: 2, log: "They scatter at the mention of your name." }
            ]
        }
    ],
    jade: [
        {
            id: "sea_beast",
            title: "Sea Beast Hunt",
            text: "Fishermen beg you to help slay a beast that broke their nets.",
            choices: [
                { label: "Join the hunt", months: 2, combat: "sea_beast", stones: 10, log: "The beast breaches — steel and spray!" },
                { label: "Sell them your spare gear", months: 1, stones: 6, log: "They pay well for your cast-offs." },
                { label: "Avoid the docks", months: 1, log: "Not every fight is yours." }
            ]
        },
        {
            id: "pirate_attack",
            title: "Pirate Attack",
            text: "Sails cut the mist. Pirates want your storage ring.",
            choices: [
                { label: "Fight the crew", months: 1, combat: "pirates", log: "Blades flash on wet wood!" },
                { label: "Pay tribute", months: 1, stones: -15, log: "They take your stones and vanish into fog." },
                { label: "Flee in a dinghy", months: 2, hp: -5, fame: -2, log: "You escape humiliated but breathing." }
            ]
        },
        {
            id: "merchant_fleet",
            title: "Merchant Fleet",
            text: "A guild fleet anchors for trade. Their holds smell of southern spices.",
            choices: [
                { label: "Trade fairly", months: 2, stones: 8, fame: 2, log: "Both sides profit." },
                { label: "Attempt a heist", months: 1, require: { stat: "spirit", min: 10 }, failLog: "Guards catch you.", fail: { hp: -15, fame: -8, months: 2 }, stones: 20, fame: -5, log: "You grab loot and run — wanted now." },
                { label: "Share cultivation tips", months: 2, fame: 4, foundation: 1, log: "Merchants spread your name across the isles." }
            ]
        }
    ],
    emberwild: [
        {
            id: "beast_tide",
            title: "Beast Tide",
            text: "A horn sounds. Hundreds of spirit beasts stampede through the canopy.",
            choices: [
                { label: "Hold the line", months: 2, combat: "beast_tide", log: "You stand against the tide!" },
                { label: "Climb above the canopy", months: 3, foundation: 1, log: "You wait out the frenzy in the heights." },
                { label: "Run with the herd", months: 2, hp: -10, stones: 5, log: "You survive by luck and scraped knees." }
            ]
        },
        {
            id: "venomroot",
            title: "Venomroot Swamp",
            text: "Purple roots pulse with toxin. Herbs here can kill or cure.",
            choices: [
                { label: "Harvest carefully", months: 2, pill: "blood_recovery", log: "You extract a potent healing draught." },
                { label: "Wade through", months: 1, hp: -14, stones: 6, log: "Poison burns, but a corpse yields loot." },
                { label: "Circle around", months: 3, log: "Patience keeps you whole." }
            ]
        },
        {
            id: "obsidian_temple",
            title: "Obsidian Temple",
            text: "Black glass reflects a temple that shouldn't exist in living jungle.",
            choices: [
                { label: "Pray at the altar", months: 2, foundation: 2, will: 1, log: "The temple accepts your sincerity." },
                { label: "Loot the offering bowl", months: 1, stones: 14, hp: -8, log: "The temple bites back." },
                { label: "Mark the location and leave", months: 1, fame: 1, log: "You will return when stronger." }
            ]
        },
        {
            id: "demonic_shrine",
            title: "Demonic Shrine",
            text: "A blood-stained altar hums in the deep jungle. Demonic cultivators have marked this place.",
            choices: [
                { label: "Desecrate the altar for power", months: 2, require: { alignmentMax: -30 }, stones: 12, alignmentShift: -5, log: "Dark qi floods your meridians — the shrine accepts your offering." },
                { label: "Purify the site", months: 3, require: { alignment: 40 }, fame: 3, alignmentShift: 4, log: "You cleanse the shrine. The jungle exhales." },
                { label: "Leave it undisturbed", months: 1, log: "Some places are best forgotten." }
            ]
        },
        {
            id: "obsidian_golem",
            title: "Obsidian Golem",
            text: "Volcanic glass animates into a hulking guardian. Its joints glow like embers.",
            choices: [
                { label: "Break the construct", months: 1, combat: "obsidian_golem", log: "The golem turns — obsidian fists rise!" },
                { label: "Circle to its blind side", months: 2, require: { stat: "spirit", min: 8 }, failLog: "It tracks you perfectly.", fail: { hp: -14, months: 1, combat: "obsidian_golem" }, stones: 8, log: "You find a crack in its carapace and claim its core." },
                { label: "Withdraw", months: 1, log: "Some guardians are not meant to be fought today." }
            ]
        }
    ]
};

const ENCOUNTER_ENEMIES = {
    ice_guardian: {
        name: "Frost Guardian", template: "Demon Beast", hpMult: 1.0, dmgMult: 0.95,
        zone: "frostbite", element: "ice",
        weakness: { fire: 1.25, ice: 0.75 },
        abilities: [
            { id: "ice_shield", weight: 35, telegraph: "Frost crawls up the guardian's limbs.", effect: { selfDefend: true, log: "A shell of ice hardens around it!" } },
            { id: "frost_breath", weight: 40, telegraph: "Killing cold exhales from its maw.", effect: { bonusDmgMult: 1.15, applyPlayer: { slowResourceRegen: 1 } } },
            { id: "shatter_rush", weight: 25, cooldown: 3, telegraph: "Ice crystals crack along its spine.", effect: { bonusDmgMult: 1.35 } }
        ],
        enrageThreshold: 0.3,
        enrageAbilities: [
            { id: "avalanche", weight: 100, telegraph: "The guardian's ice shell explodes outward!", effect: { bonusDmgMult: 1.45, applyPlayer: { slowResourceRegen: 2 } } }
        ],
        loot: { materials: { frost_essence: 1, glacial_shard: 1 }, chance: 0.65 }
    },
    wolf_pack: {
        name: "Alpha Frost Wolf", template: "Feral Spirit Wolf", hpMult: 1.1, dmgMult: 1.0,
        zone: "frostbite", element: "ice", traits: ["swarm"],
        abilities: [
            { id: "pack_bite", weight: 45, effect: { bonusDmgMult: 1.1, applyPlayer: { bleedTurns: 2, bleedDmgPct: 0.03 } } },
            { id: "alpha_howl", weight: 30, telegraph: "The alpha howls — the pack answers.", effect: { bonusDmgMult: 0.85, applyPlayer: { slowResourceRegen: 1 }, log: "Your nerves fray under the chorus!" } },
            { id: "frenzy", weight: 25, cooldown: 3, telegraph: "Blood-matted fur bristles.", effect: { bonusDmgMult: 1.3, extraHits: 1 } }
        ],
        enrageThreshold: 0.4,
        enrageAbilities: [
            { id: "pack_frenzy", weight: 100, effect: { bonusDmgMult: 1.35, extraHits: 1, applyPlayer: { bleedTurns: 3, bleedDmgPct: 0.035 } } }
        ],
        loot: { materials: { leather_scrap: 2, frost_essence: 1 }, chance: 0.7 }
    },
    sand_serpent: {
        name: "Sand Serpent", template: "Demon Beast", hpMult: 1.05, dmgMult: 1.05,
        zone: "dustbone", element: "earth",
        abilities: [
            { id: "burrow", weight: 30, telegraph: "The serpent dives beneath the sand…", effect: { selfDefend: true, noDamage: true, log: "It surfaces armored in grit!" } },
            { id: "venom_fang", weight: 40, telegraph: "Venom drips from its fangs.", effect: { bonusDmgMult: 1.3, applyPlayer: { poisonTurns: 2, poisonDmgPct: 0.04 } } },
            { id: "constrict", weight: 30, cooldown: 3, effect: { bonusDmgMult: 0.85, applyPlayer: { slowResourceRegen: 1, bleedTurns: 1, bleedDmgPct: 0.025 } } }
        ],
        loot: { materials: { leather_scrap: 1, silk_thread: 1 }, chance: 0.6 }
    },
    tournament_rival: {
        name: "Tournament Rival", template: "Corrupted Cultivator", hpMult: 1.0, dmgMult: 1.1,
        zone: "heartlands", element: "neutral",
        abilities: [
            { id: "rival_strike", weight: 40, telegraph: "Your rival's technique flares.", effect: { bonusDmgMult: 1.15 } },
            { id: "counter_guard", weight: 35, effect: { selfDefend: true, log: "They settle into a counter stance." } },
            { id: "secret_art", weight: 25, cooldown: 3, telegraph: "A forbidden palm technique unfolds.", effect: { bonusDmgMult: 1.4 } }
        ],
        loot: { materials: { spirit_herb: 1 }, chance: 0.5 }
    },
    elder_phantom: {
        name: "Elder's Phantom", template: "Heavenly Tribulation Phantom", hpMult: 0.95, dmgMult: 1.15,
        zone: "heartlands", element: "soul",
        abilities: [
            { id: "spirit_rend", weight: 40, telegraph: "The phantom's gaze pierces your soul.", effect: { bonusDmgMult: 1.1, applyPlayer: { spiritDamage: true } } },
            { id: "dao_test", weight: 30, telegraph: "Ancient will presses against yours.", effect: { willCheck: { min: 10, failSkip: 1 }, bonusDmgMult: 0.8 } },
            { id: "phantom_strike", weight: 30, cooldown: 2, effect: { bonusDmgMult: 1.35, applyPlayer: { spiritDamage: true } } }
        ],
        loot: { materials: { spirit_herb: 2 }, chance: 0.55 }
    },
    sea_beast: {
        name: "Tide Leviathan", template: "Demon Beast", hpMult: 1.15, dmgMult: 1.0,
        zone: "jade", element: "water",
        abilities: [
            { id: "tide_slam", weight: 40, effect: { bonusDmgMult: 1.15 } },
            { id: "tide_wave", weight: 35, telegraph: "A wall of water rises.", effect: { stripShieldPct: 0.45, bonusDmgMult: 1.05, log: "The wave strips your defenses!" } },
            { id: "deep_regen", weight: 25, cooldown: 3, telegraph: "The leviathan dives and surfaces renewed.", effect: { healSelfPct: 0.12, bonusDmgMult: 0.75, log: "Salt spray hisses as wounds close." } }
        ],
        loot: { materials: { silk_thread: 1, jade_inlay: 1 }, chance: 0.6 }
    },
    pirates: {
        name: "Jade Pirate Captain", template: "Shadow Assassin", hpMult: 1.0, dmgMult: 1.05,
        zone: "jade", element: "water",
        abilities: [
            { id: "cutlass", weight: 45, effect: { bonusDmgMult: 1.15 } },
            { id: "dirty_trick", weight: 30, telegraph: "The captain grins — too wide.", effect: { bonusDmgMult: 1.0, stealStones: { min: 2, max: 6, chance: 0.55 } } },
            { id: "smoke_bomb", weight: 25, cooldown: 3, telegraph: "A smoke pellet shatters at your feet.", effect: { selfDefend: true, applyPlayer: { slowResourceRegen: 1 }, log: "Acrid smoke fills your lungs!" } }
        ],
        enrageThreshold: 0.35,
        enrageAbilities: [
            { id: "last_stand", weight: 100, effect: { bonusDmgMult: 1.45, stealStones: { min: 3, max: 8, chance: 0.7 } } }
        ],
        loot: { materials: { iron_ore: 1, jade_inlay: 1 }, chance: 0.55 }
    },
    beast_tide: {
        name: "Beast Tide Alpha", template: "Demon Beast", hpMult: 1.2, dmgMult: 1.1,
        zone: "emberwild", element: "fire", traits: ["swarm"],
        abilities: [
            { id: "stampede", weight: 45, effect: { bonusDmgMult: 1.1, extraHits: 1 } },
            { id: "crushing_hoof", weight: 35, effect: { bonusDmgMult: 1.25 } },
            { id: "rally", weight: 20, cooldown: 3, telegraph: "The alpha bellows — the herd answers.", effect: { healSelfPct: 0.1, bonusDmgMult: 1.0, log: "Reinforcements surge at its side!" } }
        ],
        enrageThreshold: 0.5,
        enrageAbilities: [
            { id: "tide_frenzy", weight: 100, telegraph: "The beast tide reaches fever pitch!", effect: { bonusDmgMult: 1.35, extraHits: 2 } }
        ],
        loot: { materials: { demon_core: 1, leather_scrap: 2 }, chance: 0.65 }
    },
    ashvein_guardian_beast: {
        name: "Ashvein Warden Beast", template: "Demon Beast", hpMult: 1.4, dmgMult: 1.18, emoji: '🐲',
        zone: "emberwild", element: "fire",
        weakness: { water: 1.2, fire: 0.8 },
        abilities: [
            { id: "magma_claw", weight: 40, telegraph: "Molten veins pulse beneath its scales.", effect: { bonusDmgMult: 1.2, applyPlayer: { poisonTurns: 1, poisonDmgPct: 0.035 } } },
            { id: "warden_roar", weight: 35, effect: { applyPlayer: { slowResourceRegen: 2 }, bonusDmgMult: 1.05, log: "The roar shakes the caldera!" } },
            { id: "obsidian_hide", weight: 25, cooldown: 2, effect: { selfDefend: true, log: "Obsidian plates lock into place." } }
        ],
        enrageThreshold: 0.4,
        enrageAbilities: [
            { id: "caldera_awakening", weight: 100, telegraph: "Phase II — the Warden's true form erupts!", effect: { bonusDmgMult: 1.5, extraHits: 1, applyPlayer: { poisonTurns: 2, poisonDmgPct: 0.04 } } }
        ],
        loot: { materials: { phoenix_ash: 1, demon_core: 2 }, chance: 0.75 }
    },
    ice_wraith: {
        name: "Ice Wraith", template: "Heavenly Tribulation Phantom", hpMult: 0.9, dmgMult: 1.1,
        zone: "frostbite", element: "ice",
        weakness: { fire: 1.3, ice: 0.7 },
        abilities: [
            { id: "spirit_frost", weight: 45, telegraph: "Spectral frost needles toward your meridians.", effect: { bonusDmgMult: 1.1, applyPlayer: { spiritDamage: true } } },
            { id: "wraith_phase", weight: 30, effect: { selfDefend: true, noDamage: true, log: "The wraith dissolves into mist." } },
            { id: "killing_cold", weight: 25, cooldown: 2, effect: { bonusDmgMult: 1.35, applyPlayer: { spiritDamage: true, slowResourceRegen: 1 } } }
        ],
        loot: { materials: { frost_essence: 2, glacial_shard: 1 }, chance: 0.6 }
    },
    obsidian_golem: {
        name: "Obsidian Golem", template: "Demon Beast", hpMult: 1.25, dmgMult: 0.9,
        zone: "emberwild", element: "fire",
        weakness: { fire: 1.25, water: 0.85 },
        abilities: [
            { id: "obsidian_fist", weight: 40, effect: { bonusDmgMult: 1.1 } },
            { id: "glass_shell", weight: 35, telegraph: "Obsidian plates interlock.", effect: { selfDefend: true, log: "Its hide becomes near-impenetrable!" } },
            { id: "ember_core", weight: 25, cooldown: 3, telegraph: "The golem's core flares white-hot.", effect: { bonusDmgMult: 1.35, applyPlayer: { poisonTurns: 2, poisonDmgPct: 0.03 } } }
        ],
        loot: { materials: { iron_ore: 2, phoenix_ash: 1 }, chance: 0.6 }
    },
    scorpion_nest: {
        name: "Venomtail Swarm", template: "Feral Spirit Wolf", hpMult: 0.85, dmgMult: 1.0,
        zone: "dustbone", element: "earth", traits: ["swarm"],
        abilities: [
            { id: "stinger_volley", weight: 50, effect: { bonusDmgMult: 0.9, extraHits: 1, applyPlayer: { poisonTurns: 2, poisonDmgPct: 0.035 } } },
            { id: "burrow_swarm", weight: 30, telegraph: "Scorpions boil from the sand.", effect: { bonusDmgMult: 0.85, extraHits: 1 } },
            { id: "venom_spray", weight: 20, cooldown: 2, telegraph: "A cloud of venom mist erupts.", effect: { noDamage: true, applyPlayer: { poisonTurns: 3, poisonDmgPct: 0.03 }, log: "Toxin fills the air!" } }
        ],
        loot: { materials: { demon_core: 1, leather_scrap: 1 }, chance: 0.65 }
    },
    bandit_ambush: {
        name: "Roadside Bandit Chief", template: "Shadow Assassin", hpMult: 0.75, dmgMult: 1.15,
        zone: "heartlands", element: "neutral",
        abilities: [
            { id: "ambush_slash", weight: 50, telegraph: "The chief strikes from your blind spot!", effect: { bonusDmgMult: 1.25 } },
            { id: "throw_dirt", weight: 30, effect: { applyPlayer: { skipPlayerTurn: 1 }, bonusDmgMult: 0.7, log: "Dirt blinds you momentarily!" } },
            { id: "desperate_lunge", weight: 20, cooldown: 2, effect: { bonusDmgMult: 1.4, stealStones: { min: 2, max: 5, chance: 0.4 } } }
        ],
        loot: { materials: { iron_ore: 1, leather_scrap: 1 }, chance: 0.55 }
    }
};

// ===== GEAR & CRAFTING =====
const GEAR_SLOT_IDS = ['weapon', 'chestplate', 'helm', 'amulet', 'ring', 'boots'];

const GEAR_SLOT_LABELS = {
    weapon: 'Weapon',
    chestplate: 'Chestplate',
    helm: 'Helm',
    amulet: 'Amulet',
    ring: 'Ring',
    boots: 'Boots'
};

const CRAFT_MATERIALS = {
    iron_ore: { id: 'iron_ore', name: 'Iron Ore', tier: 'common', emoji: '⛏️' },
    leather_scrap: { id: 'leather_scrap', name: 'Leather Scrap', tier: 'common', emoji: '🟤' },
    spirit_herb: { id: 'spirit_herb', name: 'Spirit Herb', tier: 'common', emoji: '🌿' },
    silk_thread: { id: 'silk_thread', name: 'Silk Thread', tier: 'common', emoji: '🧵' },
    frost_essence: { id: 'frost_essence', name: 'Frost Essence', tier: 'uncommon', emoji: '❄️' },
    demon_core: { id: 'demon_core', name: 'Demon Core', tier: 'uncommon', emoji: '💠' },
    jade_inlay: { id: 'jade_inlay', name: 'Jade Inlay', tier: 'rare', emoji: '💎' },
    glacial_shard: { id: 'glacial_shard', name: 'Glacial Shard', tier: 'rare', emoji: '🧊' },
    phoenix_ash: { id: 'phoenix_ash', name: 'Phoenix Ash', tier: 'legendary', emoji: '🔥' },
    celestial_silk: { id: 'celestial_silk', name: 'Celestial Silk', tier: 'legendary', emoji: '✨' },
    rare_herb: { id: 'rare_herb', name: 'Rare Herb', tier: 'rare', emoji: '🌺' }
};

const EXPLORE_CRAFT_MATERIAL_MAP = {
    'Sand Silk': 'silk_thread',
    'Sun Stone': 'iron_ore',
    'Dust Root': 'spirit_herb',
    'Frost Core': 'frost_essence',
    'Ice Herb': 'spirit_herb',
    'Glacial Shard': 'glacial_shard',
    'Yeti Hide': 'leather_scrap',
    'Sand Serpent Scale': 'leather_scrap',
    'Dao Essence': 'spirit_herb',
    'Jade Token': 'jade_inlay',
    'Pearl Dust': 'silk_thread',
    'Ancient Relic Fragment': 'jade_inlay',
    'Marrow Herb': 'rare_herb',
    'Rare Spirit Herb': 'rare_herb',
    'Demon Core': 'demon_core',
    'Venom Gland': 'demon_core'
};

const PATH_STARTER_GEAR = {
    qi: 'qi_flow_robe',
    body: 'body_iron_girdle',
    soul: 'soul_meditation_cowl'
};

const GEAR_ITEMS = {
    rusty_qi_blade: {
        id: 'rusty_qi_blade', name: 'Rusty Qi Blade', slot: 'weapon', tier: 1, treasureType: 'weapon', weaponType: 'sword', gearSet: 'wandering_disciple', emoji: '🗡️',
        desc: 'A crude blade that channels ambient qi.',
        stats: { dmgPct: 6 },
        resonance: {
            qi: { maxQiBonus: 3, qiDensityBonus: 0.04 },
            body: { maxHpBonus: 4, defenseBonus: 1 },
            soul: { spirit: 1, will: 1, focusRegenBonus: 1 }
        }
    },
    leather_vest: {
        id: 'leather_vest', name: 'Leather Cultivator Vest', slot: 'chestplate', tier: 1, treasureType: 'armor', gearSet: 'wandering_disciple', emoji: '🦺',
        desc: 'Layered leather worn by wandering disciples.',
        stats: { defenseBonus: 4, maxHpBonus: 8 },
        resonance: {
            qi: { maxQiBonus: 2, qiDensityBonus: 0.03 },
            body: { maxHpBonus: 10, defenseBonus: 3, staminaRegenBonus: 1 },
            soul: { spirit: 1, will: 1 }
        }
    },
    cloth_headwrap: {
        id: 'cloth_headwrap', name: 'Cloth Headwrap', slot: 'helm', tier: 1, treasureType: 'armor', gearSet: 'wandering_disciple', emoji: '🧣',
        desc: 'Keeps sweat and stray qi out of the eyes.',
        stats: { defenseBonus: 2 },
        resonance: {
            qi: { qiDensityBonus: 0.05 },
            body: { defenseBonus: 2, maxHpBonus: 4 },
            soul: { will: 1, focusRegenBonus: 1 }
        }
    },
    jade_pendant: {
        id: 'jade_pendant', name: 'Jade Qi Pendant', slot: 'amulet', tier: 1, treasureType: 'artifact', gearSet: 'dao_seeker', emoji: '📿',
        desc: 'A pendant that steadies the dantian.',
        stats: { maxQiBonus: 6, qiDensityBonus: 0.06 },
        resonance: {
            qi: { maxQiBonus: 8, qiDensityBonus: 0.1 },
            body: { maxHpBonus: 6, staminaRegenBonus: 1 },
            soul: { spirit: 2, will: 1, daoSpeedPct: 3 }
        }
    },
    copper_band: {
        id: 'copper_band', name: 'Copper Spirit Band', slot: 'ring', tier: 1, treasureType: 'ring', emoji: '💍',
        desc: 'A ring that hums with faint spiritual resonance.',
        stats: { hpRegenBonus: 2, staminaRegenBonus: 1, focusRegenBonus: 1 },
        resonance: {
            qi: { maxQiBonus: 2, qiDensityBonus: 0.03 },
            body: { hpRegenBonus: 3, staminaRegenBonus: 2 },
            soul: { focusRegenBonus: 2, spirit: 1 }
        }
    },
    travel_sandals: {
        id: 'travel_sandals', name: 'Traveler\'s Sandals', slot: 'boots', tier: 1, treasureType: 'armor', gearSet: 'wandering_disciple', emoji: '👟',
        desc: 'Light footwear for long journeys between zones.',
        stats: { defenseBonus: 1, maxHpBonus: 4 },
        resonance: {
            qi: { maxQiBonus: 2 },
            body: { maxHpBonus: 6, staminaRegenBonus: 1 },
            soul: { will: 1, focusRegenBonus: 1 }
        }
    },
    qi_flow_robe: {
        id: 'qi_flow_robe', name: 'Qi Flow Robe', slot: 'chestplate', tier: 1, treasureType: 'armor', gearSet: 'dao_seeker', emoji: '👘',
        desc: 'Robes woven to guide qi through the meridians.',
        stats: { maxQiBonus: 5, qiDensityBonus: 0.08 },
        resonance: {
            qi: { maxQiBonus: 10, qiDensityBonus: 0.12 },
            body: { maxHpBonus: 4, defenseBonus: 2 },
            soul: { spirit: 1 }
        }
    },
    body_iron_girdle: {
        id: 'body_iron_girdle', name: 'Iron Body Girdle', slot: 'chestplate', tier: 1, treasureType: 'armor', emoji: '🛡️',
        desc: 'A reinforced girdle that anchors physical cultivation.',
        stats: { defenseBonus: 5, maxHpBonus: 12 },
        resonance: {
            qi: { maxQiBonus: 2, qiDensityBonus: 0.02 },
            body: { maxHpBonus: 16, defenseBonus: 4, staminaRegenBonus: 2 },
            soul: { will: 1 }
        }
    },
    soul_meditation_cowl: {
        id: 'soul_meditation_cowl', name: 'Meditation Cowl', slot: 'helm', tier: 1, treasureType: 'artifact', gearSet: 'dao_seeker', emoji: '🎭',
        desc: 'Shields the mind during soul cultivation.',
        stats: { spirit: 1, will: 2, focusRegenBonus: 2 },
        resonance: {
            qi: { qiDensityBonus: 0.04 },
            body: { maxHpBonus: 4 },
            soul: { spirit: 2, will: 3, focusRegenBonus: 3, daoSpeedPct: 4 }
        }
    },
    frostbite_saber: {
        id: 'frostbite_saber', name: 'Frostbite Saber', slot: 'weapon', tier: 2, treasureType: 'weapon', weaponType: 'saber', gearSet: 'frost_walker', emoji: '⚔️',
        desc: 'Cold qi lingers along the edge.',
        stats: { dmgPct: 10 },
        resonance: {
            qi: { maxQiBonus: 5, qiDensityBonus: 0.08 },
            body: { maxHpBonus: 6, defenseBonus: 2 },
            soul: { spirit: 2, will: 1, focusRegenBonus: 1 }
        }
    },
    spirit_weave_armor: {
        id: 'spirit_weave_armor', name: 'Spirit-Weave Armor', slot: 'chestplate', tier: 2, treasureType: 'armor', gearSet: 'frost_walker', emoji: '🥋',
        desc: 'Armor threaded with spiritual silk.',
        stats: { defenseBonus: 7, maxHpBonus: 14 },
        resonance: {
            qi: { maxQiBonus: 4, qiDensityBonus: 0.06 },
            body: { maxHpBonus: 18, defenseBonus: 4, staminaRegenBonus: 2 },
            soul: { spirit: 2, will: 2 }
        }
    },
    dao_insight_amulet: {
        id: 'dao_insight_amulet', name: 'Dao Insight Amulet', slot: 'amulet', tier: 3, treasureType: 'artifact', gearSet: 'dao_seeker', emoji: '🔮',
        desc: 'A rare artifact that quickens comprehension.',
        stats: { maxQiBonus: 10, qiDensityBonus: 0.1, daoSpeedPct: 8 },
        resonance: {
            qi: { maxQiBonus: 12, qiDensityBonus: 0.14, daoSpeedPct: 5 },
            body: { maxHpBonus: 8, staminaRegenBonus: 1 },
            soul: { spirit: 3, will: 2, daoSpeedPct: 10, focusRegenBonus: 2 }
        }
    },
    phoenix_plume_cloak: {
        id: 'phoenix_plume_cloak', name: 'Phoenix Plume Cloak', slot: 'chestplate', tier: 4, treasureType: 'armor', gearSet: 'dao_seeker', emoji: '🪶',
        desc: 'Woven from phoenix ash and celestial silk — warmth that never fades.',
        stats: { defenseBonus: 10, maxHpBonus: 22, hpRegenBonus: 4 },
        resonance: {
            qi: { maxQiBonus: 8, qiDensityBonus: 0.08 },
            body: { maxHpBonus: 20, defenseBonus: 5, staminaRegenBonus: 2 },
            soul: { spirit: 3, will: 2, focusRegenBonus: 2 }
        }
    },
    glacial_crown: {
        id: 'glacial_crown', name: 'Glacial Crown', slot: 'helm', tier: 4, treasureType: 'armor', gearSet: 'frost_walker', emoji: '👑',
        desc: 'A crown of eternal frost that sharpens the mind and blade alike.',
        stats: { defenseBonus: 6, will: 3, dmgPct: 4 },
        resonance: {
            qi: { maxQiBonus: 6, qiDensityBonus: 0.1 },
            body: { defenseBonus: 4, maxHpBonus: 12 },
            soul: { will: 4, focusRegenBonus: 3, daoSpeedPct: 6 }
        }
    },
    celestial_insight_ring: {
        id: 'celestial_insight_ring', name: 'Celestial Insight Ring', slot: 'ring', tier: 4, treasureType: 'ring', emoji: '💫',
        desc: 'A ring that catches starlight and turns it into comprehension.',
        stats: { maxQiBonus: 12, qiDensityBonus: 0.12, daoSpeedPct: 10, spirit: 2 },
        resonance: {
            qi: { maxQiBonus: 14, qiDensityBonus: 0.16, daoSpeedPct: 6 },
            body: { maxHpBonus: 10, staminaRegenBonus: 2 },
            soul: { spirit: 4, will: 3, daoSpeedPct: 12, focusRegenBonus: 3 }
        }
    }
};

const GEAR_CRAFT_RECIPES = {
    rusty_qi_blade: { tier: 1, months: 2, stones: 8, materials: { iron_ore: 2, leather_scrap: 1 } },
    leather_vest: { tier: 1, months: 2, stones: 6, materials: { leather_scrap: 3, silk_thread: 1 } },
    cloth_headwrap: { tier: 1, months: 1, stones: 4, materials: { silk_thread: 2, spirit_herb: 1 } },
    jade_pendant: { tier: 1, months: 2, stones: 10, materials: { spirit_herb: 2, jade_inlay: 1 } },
    copper_band: { tier: 1, months: 1, stones: 6, materials: { iron_ore: 1, spirit_herb: 1 } },
    travel_sandals: { tier: 1, months: 1, stones: 5, materials: { leather_scrap: 2, silk_thread: 1 } },
    frostbite_saber: { tier: 2, months: 4, stones: 25, materials: { iron_ore: 2, frost_essence: 2, demon_core: 1, glacial_shard: 1 } },
    spirit_weave_armor: { tier: 2, months: 4, stones: 30, materials: { silk_thread: 3, frost_essence: 2, demon_core: 1, leather_scrap: 2 } },
    dao_insight_amulet: { tier: 3, months: 6, stones: 60, materials: { jade_inlay: 2, glacial_shard: 2, demon_core: 2, phoenix_ash: 1 } }
};

const GEAR_DURABILITY = { base: 80, perTier: 20, combatWear: 3, brokenMult: 0.55 };

const GEAR_AFFIXES = {
    sharp: { id: 'sharp', label: 'Sharp', stats: { dmgPct: 4 } },
    steady: { id: 'steady', label: 'Steady', stats: { defenseBonus: 2, maxHpBonus: 4 } },
    flowing: { id: 'flowing', label: 'Flowing', stats: { maxQiBonus: 4, qiDensityBonus: 0.04 } },
    spirited: { id: 'spirited', label: 'Spirited', stats: { spirit: 1, focusRegenBonus: 1 } },
    resolute: { id: 'resolute', label: 'Resolute', stats: { will: 1, hpRegenBonus: 2 } },
    swift: { id: 'swift', label: 'Swift', stats: { daoSpeedPct: 3, staminaRegenBonus: 1 } },
    hardy: { id: 'hardy', label: 'Hardy', stats: { maxHpBonus: 8, defenseBonus: 2 } },
    piercing: { id: 'piercing', label: 'Piercing', stats: { dmgPct: 6 } }
};

const GEAR_AFFIX_ROLL = { 1: { min: 0, max: 1, chance2: 0 }, 2: { min: 0, max: 2, chance2: 0.35 }, 3: { min: 1, max: 2, chance2: 0.55 } };

const GEAR_SETS = {
    wandering_disciple: {
        id: 'wandering_disciple', name: 'Wandering Disciple', emoji: '🥾',
        bonuses: {
            2: { defenseBonus: 3, maxHpBonus: 6 },
            3: { hpRegenBonus: 3, staminaRegenBonus: 2 }
        }
    },
    frost_walker: {
        id: 'frost_walker', name: 'Frost Walker', emoji: '❄️',
        bonuses: {
            2: { dmgPct: 5, defenseBonus: 2 },
            3: { maxQiBonus: 8, qiDensityBonus: 0.06 }
        }
    },
    dao_seeker: {
        id: 'dao_seeker', name: 'Dao Seeker', emoji: '📿',
        bonuses: {
            2: { daoSpeedPct: 5, focusRegenBonus: 2 },
            3: { maxQiBonus: 10, spirit: 2, will: 2 }
        }
    }
};

const GEAR_REPAIR = { monthsPer10: 1, stonesPer10: 2, ironPer10: 1 };

const LEGENDARY_GEAR_RECIPES = {
    phoenix_plume_cloak: {
        output: 'phoenix_plume_cloak',
        tier: 4,
        months: 8,
        stones: 80,
        materials: { phoenix_ash: 2, celestial_silk: 1, silk_thread: 3 },
        consumesLegendary: 'Phoenix Feather'
    },
    glacial_crown: {
        output: 'glacial_crown',
        tier: 4,
        months: 8,
        stones: 75,
        materials: { glacial_shard: 2, frost_essence: 2, jade_inlay: 1 },
        consumesLegendary: 'Glacial Heart'
    },
    celestial_insight_ring: {
        output: 'celestial_insight_ring',
        tier: 4,
        months: 10,
        stones: 90,
        materials: { celestial_silk: 1, jade_inlay: 2, demon_core: 2 },
        consumesLegendary: 'Celestial Lens'
    }
};

const MERCHANT_GEAR_STOCK = {
    heartlands: [
        { gearId: 'rusty_qi_blade', price: 18, reqRealm: 0 },
        { gearId: 'leather_vest', price: 15, reqRealm: 0 },
        { gearId: 'cloth_headwrap', price: 10, reqRealm: 0 },
        { gearId: 'jade_pendant', price: 22, reqRealm: 0 },
        { gearId: 'copper_band', price: 14, reqRealm: 0 },
        { gearId: 'travel_sandals', price: 12, reqRealm: 0 }
    ],
    jade: [
        { gearId: 'rusty_qi_blade', price: 16, reqRealm: 0 },
        { gearId: 'leather_vest', price: 14, reqRealm: 0 },
        { gearId: 'jade_pendant', price: 20, reqRealm: 0 },
        { gearId: 'frostbite_saber', price: 55, reqRealm: 1 },
        { gearId: 'spirit_weave_armor', price: 65, reqRealm: 1 }
    ]
};

const LEGENDARY_REFINEMENTS = {
    "Glacial Heart": { months: 12, stones: 40, effect: { will: 2 }, log: "Cold clarity settles in your meridians." },
    "Wandering Oasis Map": { months: 10, stones: 30, effect: { spirit: 2 }, log: "You memorize routes no map should know." },
    "Dao Insight Fragment": { months: 14, stones: 50, effect: { foundation: 15 }, log: "A sliver of the Dao becomes yours." },
    "Dragon Scale (Sea)": { months: 12, stones: 45, effect: { vitality: 3, defenseBonus: 5 }, log: "Scale essence toughens your flesh." },
    "Phoenix Feather": { months: 14, stones: 50, effect: { regenBonus: 10, vitality: 2 }, log: "Warmth lingers — wounds close faster." },
    "Heartwood Ash": { months: 12, stones: 35, effect: { forbiddenLifespanMult: 0.03 }, log: "Ash teaches restraint with time." },
    "Crucible Slag": { months: 12, stones: 40, effect: { crucibleRegenMult: 0.05 }, log: "Slag remembers endurance." },
    "Peak Silence Stone": { months: 10, stones: 35, effect: { will: 3 }, log: "Silence becomes a weapon." },
    "Fragment of True Speech": { months: 10, stones: 35, effect: { mawDoubtResist: 1 }, log: "Truth sits heavier on your tongue." },
    "Jade Loop Pearl": { months: 12, stones: 40, effect: { spirit: 3 }, log: "The pearl holds a moment that never ends." },
    "Celestial Lens": { months: 14, stones: 55, effect: { fame: 10, foundation: 8 }, log: "The heavens recognize an honest cultivator." }
};

// ===== DAO ALIGNMENT =====
const DAO_ALIGNMENT = {
    min: -100,
    max: 100,
    breakPerPoint: 0.2,
    tribPerPoint: 0.002,
    scarRebelliousThreshold: -70,
    scarRebelliousMult: 2,
    tiers: [
        { id: 'harmony', label: 'In Harmony', min: 70 },
        { id: 'favored', label: 'Favored', min: 30 },
        { id: 'neutral', label: 'Neutral', min: -29 },
        { id: 'dissonant', label: 'Dissonant', min: -69 },
        { id: 'rebellious', label: 'Rebellious', min: -100 }
    ],
    shifts: {
        helpMin: 3,
        helpMax: 10,
        killInnocent: -10,
        forbiddenTechniqueMin: -15,
        forbiddenTechniqueMax: -30,
        evilPhysique: -30,
        trueDao: 15,
        tribulationComplete: 5
    },
    tierOmens: {
        harmony: '☯️ The Dao sings through you — heaven and earth move in quiet accord.',
        favored: '☯️ The natural order leans toward you; opportunities ripen in your path.',
        neutral: '☯️ You walk between harmony and dissonance — the Dao watches, neither blessing nor punishing.',
        dissonant: '☯️ The heavens grow restless. Your steps fall out of rhythm with the world.',
        rebellious: '☯️ Heaven itself recoils. Lightning gathers where you tread.'
    },
    extremeOmens: {
        harmony: '🌤️ You stand at the threshold of perfect accord — the heavens may intervene on your behalf.',
        rebellion: '⛈️ The Dao rejects your path — punishment may fall without warning.'
    },
    heavenly: {
        threshold: 90,
        blessingChance: 0.06,
        punishmentChance: 0.06
    },
    blessings: [
        {
            id: 'qi_surge',
            log: 'Heavenly Blessing — a surge of pure Qi fills your meridians!',
            apply() { G.qi = getMaxQi(); G.qiDensity = (G.qiDensity || 1) + 0.15; }
        },
        {
            id: 'foundation_gift',
            log: 'Heavenly Blessing — the Dao rewards your harmony with deeper Foundation!',
            apply() { grantFoundation(3); }
        },
        {
            id: 'spirit_clarity',
            log: 'Heavenly Blessing — clarity descends; Spirit and Will sharpen!',
            apply() { G.spirit += 2; G.will += 2; }
        },
        {
            id: 'stone_rain',
            log: 'Heavenly Blessing — spirit stones fall like dew from an unseen realm!',
            apply() { G.stones += 15 + Math.floor(Math.random() * 20); }
        },
        {
            id: 'life_extension',
            log: 'Heavenly Blessing — your lifespan stretches as the heavens grant reprieve!',
            apply() { G.lifespanMonths += 5 * 12; }
        }
    ],
    punishments: [
        {
            id: 'qi_drain',
            log: 'Heavenly Punishment — the Dao withdraws its favor; your Qi scatters!',
            apply() { G.qi = Math.max(1, Math.floor(G.qi * 0.6)); clampCurrentQi(); }
        },
        {
            id: 'foundation_crack',
            log: 'Heavenly Punishment — your Foundation cracks under heaven\'s displeasure!',
            apply() { loseFoundation(2); }
        },
        {
            id: 'spirit_wound',
            log: 'Heavenly Punishment — a silent wound strikes Spirit and Will!',
            apply() { G.spirit = Math.max(1, G.spirit - 2); G.will = Math.max(1, G.will - 2); }
        },
        {
            id: 'stone_loss',
            log: 'Heavenly Punishment — your wealth scatters like ash in a sudden gale!',
            apply() { G.stones = Math.max(0, G.stones - (10 + Math.floor(Math.random() * 15))); }
        },
        {
            id: 'corruption_sting',
            log: 'Heavenly Punishment — dissonance festers; corruption gnaws at your heart!',
            apply() { G.corruptionLevel = (G.corruptionLevel || 0) + 8; }
        }
    ],
    corruptionBlockHarmony: 50,
    corruptionDriftThreshold: 50,
    corruptionDriftPerCultivate: -1,
    tierEffects: {
        harmony: {
            perks: ['NPCs greet you warmly (+1 mood)', 'Corruption resists heavenly punishment', 'Righteous techniques unlock', 'Occasional free rumors'],
            npcMoodBonus: 1,
            corruptionResistPct: 25,
            heavenlyPunishmentMult: 0.5,
            npcRefusalChance: 0
        },
        favored: {
            perks: ['Slight NPC warmth', 'Reduced heavenly punishment chance', 'Good deeds resonate stronger'],
            npcMoodBonus: 0,
            corruptionResistPct: 10,
            heavenlyPunishmentMult: 0.75,
            npcRefusalChance: 0
        },
        neutral: {
            perks: ['No lockouts — walk either path', 'Weaker extremes than committed tiers'],
            npcMoodBonus: 0,
            corruptionResistPct: 0,
            heavenlyPunishmentMult: 1,
            npcRefusalChance: 0
        },
        dissonant: {
            perks: ['Demonic cultivators take interest', 'Demonic techniques unlock', 'Heavens grow restless'],
            npcMoodBonus: 0,
            demonicEncounterMult: 1.12,
            npcRefusalChance: 0.08
        },
        rebellious: {
            perks: ['NPCs may refuse interaction (25%)', 'Demonic encounters more frequent', 'Scar risk doubled (existing)', 'Blood arts unlock'],
            npcMoodBonus: -1,
            demonicEncounterMult: 1.25,
            npcRefusalChance: 0.25
        }
    },
    actions: [
        {
            id: 'meditate_dao_heart',
            label: 'Meditate on the Dao Heart',
            emoji: '🧘',
            desc: 'Contemplate your place in the natural order.',
            months: 2,
            spiritCost: 1,
            alignMin: -100,
            alignMax: 69,
            alignDelta: [2, 5],
            maxUsesPerRealm: 3
        },
        {
            id: 'good_deed',
            label: 'Perform a Good Deed',
            emoji: '🤝',
            desc: 'Donate stones and materials to those in need.',
            months: 2,
            stonesCost: 8,
            alignMin: -29,
            alignMax: 100,
            useHelpShift: true,
            maxUsesPerRealm: 3
        },
        {
            id: 'public_atonement',
            label: 'Public Atonement',
            emoji: '🙏',
            desc: 'Confess before the jianghu and seek mortal forgiveness (not a heavenly rite).',
            months: 6,
            fameCost: 5,
            alignMin: -69,
            alignMax: 29,
            alignDelta: [8, 15],
            tierOnly: ['dissonant', 'rebellious'],
            maxUsesPerRealm: 2
        },
        {
            id: 'walk_wicked_path',
            label: 'Walk the Wicked Path',
            emoji: '🌑',
            desc: 'Deliberately reject restraint and embrace selfish impulse.',
            months: 2,
            alignMin: -100,
            alignMax: 29,
            alignDelta: [-10, -5],
            maxUsesPerRealm: 3
        }
    ],
    sectSynergy: {
        righteous_harmony: { renownMultBonus: 0.15, helpShiftBonus: true, label: 'Righteous sect + Harmony alignment — renown and virtue compound.' },
        righteous_rebellious: { friction: true, label: 'Righteous sect + rebellious leader — disciples question your hypocrisy.' },
        shadow_low: { combatMultBonus: 0.08, label: 'Shadow sect + low alignment — combat power stacks.' },
        shadow_harmony: { intimidatePenalty: 2, label: 'Shadow sect + high alignment — inner conflict weakens intimidation.' },
        balanced: { alignmentDampenPct: 10, label: 'Balanced doctrine — alignment swings soften.' }
    }
};

// ===== HEAVENLY TRIBULATIONS =====
/** Breakthrough transition scripts — per-gate copy; expand choice pools later. */
const TRIBULATION_TRANSITIONS = {
    qc_to_fe: {
        id: 'qc_to_fe',
        label: 'Qi Condensation → Foundation',
        logLine: 'The first watershed — your foundation must endure the heavenly audit.',
        heavenQuestion: 'Can gathered qi settle into bedrock the ledger recognizes as Foundation?'
    },
    fe_to_gc: {
        id: 'fe_to_gc',
        label: 'Foundation → Golden Core',
        logLine: 'A nascent golden core forms — the Heavenly Order has not yet accepted you.',
        limbo: true
    },
    gc_to_ns: {
        id: 'gc_to_ns',
        label: 'Golden Core → Nascent Soul',
        logLine: 'The soul stirs within the core — lightning tests whether it may emerge.'
    },
    ns_to_void: {
        id: 'ns_to_void',
        label: 'Nascent Soul → Void Refinement',
        logLine: 'Identity thins at the void\'s edge — the sky seeks what remains of you.'
    },
    void_to_dao: {
        id: 'void_to_dao',
        label: 'Void Refinement → Dao Seeking',
        logLine: 'Law and self collide — heaven audits your claim to the next watershed.'
    },
    dao_to_immortal: {
        id: 'dao_to_immortal',
        label: 'Dao Seeking → Immortal Ascension',
        logLine: 'The final audit — transcendence or erasure under the lightning.'
    }
};

/** Per-transition tribulation scripts — v2 choice pools (expand gate by gate). */
const TRIBULATION_SCRIPTS = {
    qc_to_fe: {
        id: 'qc_to_fe',
        scriptedScars: true,
        flavor: {
            lightningOmen: 'Clouds churn without thunder. The gathered qi stirs — heaven asks whether it can settle into Foundation the ledger will recognize.',
            lightningTrial: 'The bolt does not test your meridians. It tests whether your qi has bedrock to stand on.',
            heartOmen: 'A figure wearing your unfinished self stands in the silence. It asks what you are willing to become.',
            heartTrial: 'The Heart Demon is not a monster yet — only the doubt that you deserve to leave mortality behind.',
            aftermath: 'The first storm passes. What foundation remains is yours to seal — or patch.'
        },
        choices: {
            omen: [
                {
                    id: 'draw_inward',
                    label: '☯️ Draw qi inward',
                    flavor: 'Still the breath. Let the gathered qi show its true weight.',
                    months: 2,
                    score: 2,
                    outcomeHint: 'Trial prep',
                    log: 'Qi settles. You face the audit with clearer breath.'
                },
                {
                    id: 'read_storm',
                    label: '👁️ Read the storm\'s pattern',
                    flavor: 'Study how heaven gathers force — forewarned is not forearmed, but less blind.',
                    months: 3,
                    score: 3,
                    outcomeHint: 'Trial prep · +Will helps',
                    require: { stat: 'will', min: 6 },
                    failLog: 'The pattern eludes you. The omen presses closer.',
                    fail: { score: 1, months: 2 },
                    log: 'You glimpse the audit\'s rhythm. The trial will not catch you entirely unaware.'
                }
            ],
            trial: [
                {
                    id: 'bedrock',
                    label: '🏛️ Stand on bedrock',
                    flavor: 'Root your qi as if the earth already accepted you. Stronger if you consolidated before breaking through.',
                    tribulationTypes: ['lightning'],
                    months: 5,
                    score: 2,
                    script: 'qc_bedrock',
                    outcomeHint: 'Strong if consolidated · Foundation crack if rushed',
                    log: 'You plant your will beneath the gathered qi. The ledger weighs your foundation.'
                },
                {
                    id: 'compress',
                    label: '🔮 Compress the dantian',
                    flavor: 'Force density until heaven must acknowledge the pressure — or the vessel splits.',
                    tribulationTypes: ['lightning'],
                    months: 5,
                    resistBonus: 4,
                    script: 'qc_compress',
                    outcomeHint: 'Qi density test · Qi Backlash scar on failure',
                    failScar: 'qi_backlash',
                    log: 'You compress qi until the sky answers with thunder.'
                },
                {
                    id: 'thunder',
                    label: '⚡ Meet the thunder openly',
                    flavor: 'Bold cultivators are rewarded — or erased. Always available.',
                    tribulationTypes: ['lightning'],
                    months: 3,
                    score: 1,
                    resistBonus: -2,
                    risk: 6,
                    script: 'qc_thunder',
                    outcomeHint: 'Risky · Scorched Flesh scar on failure',
                    failScar: 'scorched_flesh',
                    log: 'You refuse to hide. The first bolt is an answer, not a warning.'
                },
                {
                    id: 'name_fear',
                    label: '👤 Name the fear',
                    flavor: 'The shadow is young — speak to it before it learns your shape.',
                    tribulationTypes: ['heart_demon'],
                    months: 4,
                    score: 3,
                    outcomeHint: 'Soul trial · Weakened Soul scar on defeat',
                    combat: true,
                    failScar: 'weakened_soul',
                    log: 'You step toward the doubt wearing your face.'
                },
                {
                    id: 'reject_fear',
                    label: '🛡️ Reject the illusion',
                    flavor: 'Deny the shadow — a soul test for those with iron will.',
                    tribulationTypes: ['heart_demon'],
                    months: 4,
                    score: 1,
                    outcomeHint: 'Requires Will 7+ · Haunted Vision scar if wrong',
                    require: { stat: 'will', min: 7 },
                    failLog: 'The doubt is not an illusion. It strikes true.',
                    fail: { combat: true, months: 2, failScar: 'haunted_vision' },
                    log: 'You deny the shadow — it does not vanish, but wavers.'
                },
                {
                    id: 'embrace_shadow',
                    label: '🌑 Embrace the shadow',
                    flavor: 'Accept what you fear becoming — dangerous, but not cowardly.',
                    tribulationTypes: ['heart_demon'],
                    months: 3,
                    combat: true,
                    outcomeHint: 'Risky soul combat · Warped Will scar on defeat',
                    failScar: 'warped_will',
                    log: 'You open your arms. The Heart Demon rushes in.'
                }
            ],
            aftermath: [
                {
                    id: 'seal_breath',
                    label: '📜 Seal your breath',
                    flavor: 'Patience. Let the new realm settle before you walk the world as Foundation.',
                    months: 4,
                    outcomeHint: 'Safe recovery',
                    outcome: 'success',
                    log: 'You seal what the heavens allowed. Foundation is fragile — you treat it gently.'
                },
                {
                    id: 'seclude_heal',
                    label: '❤️ Seclude and heal',
                    flavor: 'The body remembers the audit even when the ledger moves on.',
                    months: 5,
                    outcomeHint: 'Heal HP · slower',
                    outcome: 'success',
                    log: 'You mend what the trial broke before facing the sect again.'
                }
            ]
        }
    }
};

const TRIBULATION_BALANCE = {
    minRealm: 1,
    baseSeverity: 10,
    severityPerRealm: 5,
    heavenTheftSeverityPerCount: 0.25,
    corruptionNoticedMult: 1.35,
    omenMonths: 3,
    trialMonths: 6,
    aftermathMonths: 4,
    transcendBaseChance: 0.07,
    scarBaseChancePassed: 0.10,
    scarBaseChanceFailed: 0.38,
    scarRiskPerPoint: 0.004,
    scarMaxChance: 0.72,
    scarTimeHealYears: 10,
    heartDemonHpMult: 0.92,
    heartDemonDmgMult: 0.88,
    heartDemonRealmScale: 0.12,
    successFame: 3,
    failureFoundationLoss: 2
};

const TRIBULATION_TYPES = {
    lightning: {
        id: "lightning",
        emoji: "⚡",
        name: "Lightning Tribulation",
        desc: "The heavens strike to test your vessel."
    },
    heart_demon: {
        id: "heart_demon",
        emoji: "👤",
        name: "Heart Demon Tribulation",
        desc: "A shadow self rises from your unresolved self."
    },
    dao_heart: { id: "dao_heart", emoji: "☯️", name: "Dao Heart Trial", desc: "Coming soon." },
    karmic: { id: "karmic", emoji: "🔗", name: "Karmic Reckoning", desc: "Coming soon." },
    heavenly_punishment: { id: "heavenly_punishment", emoji: "☄️", name: "Heavenly Punishment", desc: "Coming soon." }
};

const TRIBULATION_PATH_FLAVOR = {
    qi: {
        lightningOmen: "Clouds churn without thunder. Your meridians hum — the heavens ask whether your qi serves you, or you serve your qi.",
        lightningTrial: "Bolts seek the paths you left unguarded. Control is the only shield that endures.",
        heartOmen: "A figure wearing your face stands in the lightning. It knows every shortcut you ever took.",
        heartTrial: "The Heart Demon mirrors your cultivation path. Defeat it, or become it.",
        aftermath: "The storm passes. What remains — scar, clarity, or transcendence — is yours to claim."
    },
    body: {
        lightningOmen: "The sky bruises violet. Your flesh remembers every wound you never fully healed.",
        lightningTrial: "Lightning does not negotiate. Endure, or break.",
        heartOmen: "Your shadow flexes muscle you refused to train. It smiles with your jaw.",
        heartTrial: "Steel against steel — but the enemy knows your every habit.",
        aftermath: "Smoke rises from your skin. The next realm waits beyond the pain."
    },
    soul: {
        lightningOmen: "Thunder makes no sound. It gathers behind your eyes where doubt lives.",
        lightningTrial: "Will is tested before flesh. Anchor yourself, or scatter.",
        heartOmen: "Whispers that are yours and not yours. The Heart Demon speaks with your voice.",
        heartTrial: "Soul against soul — the cruelest mirror.",
        aftermath: "Silence returns. Something in you has changed shape forever."
    }
};

const TRIBULATION_SCARS = {
    unstable_foundation: {
        name: "Unstable Foundation",
        desc: "The ledger accepted you — but the bedrock shifted. Your foundation wobbles under stress.",
        log: "🩸 Unstable Foundation — the first watershed left hairline cracks in your root.",
        realmAtBreakthrough: 1,
        transitionIds: ['qc_to_fe'],
        down: { maxQiPct: -0.08 },
        up: { breakthroughPct: 0.05 },
        downLabel: "−8% max Qi",
        upLabel: "+5% breakthrough chance"
    },
    qi_backlash: {
        name: "Qi Backlash",
        desc: "Compressed too hard, too fast. Qi surges unpredictably — painful, but not without edge.",
        log: "🩸 Qi Backlash — the dantian remembers the pressure that nearly split it.",
        realmAtBreakthrough: 1,
        transitionIds: ['qc_to_fe'],
        tribulationTypes: ['lightning'],
        down: { maxQiPct: -0.12 },
        up: { qiRegenPct: 0.25 },
        downLabel: "−12% max Qi",
        upLabel: "+25% Qi recovery from cultivation"
    },
    cracked_core: {
        name: "Cracked Core",
        desc: "Your golden core fractured under heaven's weight. Qi leaks — but desperation sharpens your strikes.",
        log: "🩸 Cracked Core — the dantian will never be whole again. You adapt.",
        realmAtBreakthrough: 2,
        down: { maxQiPct: -0.15 },
        up: { lowHpDmgPct: 0.10 },
        downLabel: "−15% max Qi",
        upLabel: "+10% damage below half HP"
    },
    shattered_meridian: {
        name: "Shattered Meridian",
        desc: "A meridian burst during the trial. Circulation is crippled — yet what remains flows faster.",
        log: "🩸 Shattered Meridian — broken channels, surging recovery.",
        realmAtBreakthrough: 2,
        tribulationTypes: ["lightning"],
        down: { maxQiPct: -0.20 },
        up: { qiRegenPct: 0.50 },
        downLabel: "−20% max Qi",
        upLabel: "+50% Qi recovery from cultivation"
    },
    scorched_flesh: {
        name: "Scorched Flesh",
        desc: "Lightning charred your meridians into living armor. You are fragile — and harder to break.",
        log: "🩸 Scorched Flesh — burned skin, iron tolerance.",
        realmAtBreakthrough: 1,
        tribulationTypes: ["lightning"],
        down: { maxHpPct: -0.10 },
        up: { defenseBonusPct: 0.10 },
        downLabel: "−10% max HP",
        upLabel: "+10% physical defense"
    },
    weakened_soul: {
        name: "Weakened Soul",
        desc: "The Heart Demon took a piece of your spirit. What remains is guarded, wary, resilient.",
        log: "🩸 Weakened Soul — thinner spirit, thicker mental walls.",
        realmAtBreakthrough: 1,
        tribulationTypes: ["heart_demon"],
        down: { spiritPct: -0.15 },
        up: { mentalResistPct: 0.15 },
        downLabel: "−15% Spirit",
        upLabel: "+15% mental attack resistance"
    },
    haunted_vision: {
        name: "Haunted Vision",
        desc: "You see echoes of what was and what might have been. Your hands tremble — your feet do not.",
        log: "🩸 Haunted Vision — unreliable sight, uncanny reflexes.",
        realmAtBreakthrough: 1,
        tribulationTypes: ["heart_demon"],
        down: { accuracyPct: -0.05 },
        up: { evasionBonusPct: 0.10 },
        downLabel: "−5% attack accuracy",
        upLabel: "+10% dodge chance"
    },
    thunders_echo: {
        name: "Thunder's Echo",
        desc: "The bolt never truly left. Perception dulls — but lightning kneels before you now.",
        log: "🩸 Thunder's Echo — deafened senses, storm-touched flesh.",
        tribulationTypes: ["lightning"],
        realmAtBreakthrough: 3,
        down: { perceptionPct: -0.10 },
        up: { lightningResistPct: 0.10 },
        downLabel: "−10% tribulation perception",
        upLabel: "+10% lightning resistance"
    },
    warped_will: {
        name: "Warped Will",
        desc: "Fear carved grooves in your resolve. You bend — but you no longer break.",
        log: "🩸 Warped Will — fractured resolve, iron nerve.",
        realmAtBreakthrough: 1,
        tribulationTypes: ["heart_demon"],
        down: { willPct: -0.10 },
        up: { fearResistPct: 0.10 },
        downLabel: "−10% Will",
        upLabel: "+10% fear resistance"
    },
    cursed_blood: {
        name: "Cursed Blood",
        desc: "Tribulation blood turned sour. You heal slowly — yet demons taste your wrath.",
        log: "🩸 Cursed Blood — sluggish flesh, hungry blade.",
        realmAtBreakthrough: 2,
        down: { hpRegenPct: -0.10 },
        up: { demonDmgPct: 0.10 },
        downLabel: "−10% HP regeneration",
        upLabel: "+10% damage vs demonic foes"
    },
    fractured_dao: {
        name: "Fractured Dao",
        desc: "Insight came too fast and splintered. Comprehension limps — breakthroughs come easier.",
        log: "🩸 Fractured Dao — splintered insight, hungry heaven.",
        realmAtBreakthrough: 4,
        down: { daoSpeedPct: -0.10 },
        up: { breakthroughPct: 0.10 },
        downLabel: "−10% Dao study speed",
        upLabel: "+10% breakthrough chance"
    },
    lingering_grief: {
        name: "Lingering Grief",
        desc: "You survived what others did not. Fame fades — but the lonely still hear your name.",
        log: "🩸 Lingering Grief — quiet legend, open hearts.",
        realmAtBreakthrough: 3,
        down: { fameGainPct: -0.10 },
        up: { recruitChancePct: 0.10 },
        downLabel: "−10% Fame gained",
        upLabel: "+10% disciple recruitment chance"
    }
};

const SCAR_HEAL_METHODS = {
    legendary_pill: {
        name: "Legendary Scar-Salve Pill",
        desc: "A mythical pill that rewinds one tribulation wound.",
        itemId: "scar_salve"
    },
    dao_enlightenment: {
        name: "Dao Enlightenment",
        desc: "Perfect clarity dissolves one scar of the past."
    },
    sacrifice: {
        name: "Sacrifice",
        desc: "Burn a technique or treasure to erase one scar."
    },
    time: {
        name: "Time",
        desc: "Ten years of cultivation can mend what the heavens broke."
    }
};

const TRIBULATION_TRANSCENDS = {
    thunder_heart: {
        name: "Thunder Heart",
        desc: "Lightning and will fuse in your chest. Tribulation fire feels like kin.",
        bonus: { lightningResist: 30, will: 4, qi: 5 },
        log: "🌩️ TRANSCENDENCE — Thunder Heart! The heavens recognize you."
    },
    unified_self: {
        name: "Unified Self",
        desc: "The demon is not gone — it is seated. Self and shadow move as one.",
        bonus: { spirit: 5, will: 5, dmgMult: 0.1 },
        log: "✨ TRANSCENDENCE — Unified Self! The Heart Demon becomes strength."
    }
};

// ===== TRANSCENDENCE PERKS (perfect breakthrough blessings) =====

const TRANSCENDENCE_BALANCE = {
    perfectMargin: 18,
    minPerfectMargin: 5,
    foundationMarginPerPoint: 0.45,
    foundationPerfectPerPoint: 1.5,
    foundationPerfectCap: 40,
    foundationStabilizeMin: 12,
    foundationStabilizePerfectCap: 18,
    minBreakChanceForPerfect: 30,
    minRealm: 1,
    maxRealm: 6,
    offerCount: 3
};

const TRANSCENDENCE_PERKS = {
    unshakable_foundation: {
        id: "unshakable_foundation",
        realmIdx: 1,
        name: "Unshakable Foundation",
        desc: "Your roots run deeper than the sect's oldest mountain. Stat erosion struggles to take hold.",
        flavor: "Your foundation is so deep, it cannot be eroded.",
        effectLabel: "+20% resistance to stat debuffs",
        effects: { debuffResistPct: 0.20 }
    },
    meridian_prodigy: {
        id: "meridian_prodigy",
        realmIdx: 1,
        name: "Meridian Prodigy",
        desc: "Qi circulates as if the meridians were born open. Recovery comes naturally, even mid-battle.",
        flavor: "Your meridians hum with effortless flow.",
        effectLabel: "+10% Qi, Stamina, and Focus recovery",
        effects: { regenMultPct: 0.10 }
    },
    body_of_earth: {
        id: "body_of_earth",
        realmIdx: 1,
        name: "Body of the Earth",
        desc: "Flesh remembers stone. Blows that would shatter others merely settle on your skin.",
        flavor: "You stand unmoved, as mountains stand.",
        effectLabel: "+10% physical defense",
        effects: { defenseBonusPct: 0.10 }
    },
    golden_core_purity: {
        id: "golden_core_purity",
        realmIdx: 2,
        name: "Golden Core Purity",
        desc: "Techniques shine with uncorrupted core-light. Each form carries extra killing intent.",
        flavor: "Your core burns clean — techniques answer in gold.",
        effectLabel: "+15% technique damage",
        effects: { techniqueDmgPct: 0.15 }
    },
    core_resonance: {
        id: "core_resonance",
        realmIdx: 2,
        name: "Core Resonance",
        desc: "Qi expenditure harmonizes with intent. Forms cost less to express.",
        flavor: "Techniques flow without waste.",
        effectLabel: "+10% Qi efficiency (technique costs)",
        effects: { techniqueCostMult: -0.10 }
    },
    unbreakable_core: {
        id: "unbreakable_core",
        realmIdx: 2,
        name: "Unbreakable Core",
        desc: "Heaven itself could not crack your dantian. Core-fracturing wounds find no purchase.",
        flavor: "Your core holds — no fracture may linger.",
        effectLabel: "Immune to core-cracking effects",
        effects: { immuneCoreCrack: true }
    },
    souls_eye: {
        id: "souls_eye",
        realmIdx: 3,
        name: "Soul's Eye",
        desc: "The world reveals hidden threads to your nascent soul. Fortune favors your steps.",
        flavor: "You see what others walk past blind.",
        effectLabel: "+20% exploration outcomes",
        effects: { perceptionPct: 0.20 }
    },
    souls_embrace: {
        id: "souls_embrace",
        realmIdx: 3,
        name: "Soul's Embrace",
        desc: "Your soul wraps your flesh in quiet armor. Pain arrives softened.",
        flavor: "Harm washes over you like rain on deep water.",
        effectLabel: "+10% damage resistance",
        effects: { damageResistPct: 0.10 }
    },
    souls_wrath: {
        id: "souls_wrath",
        realmIdx: 3,
        name: "Soul's Wrath",
        desc: "Soul-path arts answer your fury with devastating clarity.",
        flavor: "Your soul techniques carry the weight of judgment.",
        effectLabel: "+15% Soul technique damage",
        effects: { soulTechDmgPct: 0.15 }
    },
    void_step: {
        id: "void_step",
        realmIdx: 4,
        name: "Void Step",
        desc: "You learn to sidestep causality for a heartbeat. One strike per battle finds only emptiness.",
        flavor: "You are here — and then you are not.",
        effectLabel: "Unlock Void Step in combat",
        effects: { voidStep: true }
    },
    void_siphon: {
        id: "void_siphon",
        realmIdx: 4,
        name: "Void Siphon",
        desc: "The void leaks sustenance back into you. Resources return faster after expenditure.",
        flavor: "The void feeds what it once took.",
        effectLabel: "+10% Qi, Stamina, and Focus recovery",
        effects: { regenMultPct: 0.10 }
    },
    void_sight: {
        id: "void_sight",
        realmIdx: 4,
        name: "Void Sight",
        desc: "Dao fragments align in your vision. Comprehension arrives in sudden, clear strokes.",
        flavor: "The Dao writes itself in void-light.",
        effectLabel: "+20% Dao comprehension speed",
        effects: { daoSpeedPct: 0.20 }
    },
    daos_echo: {
        id: "daos_echo",
        realmIdx: 5,
        name: "Dao's Echo",
        desc: "Every technique carries a trace of the Dao. Their echoes compound in power.",
        flavor: "Your arts ring with the Dao's aftervoice.",
        effectLabel: "+15% technique damage",
        effects: { techniqueDmgPct: 0.15 }
    },
    daos_clarity: {
        id: "daos_clarity",
        realmIdx: 5,
        name: "Dao's Clarity",
        desc: "Illusion falls away. Insight arrives without struggle.",
        flavor: "Clarity is your natural state.",
        effectLabel: "+25% Dao comprehension speed",
        effects: { daoSpeedPct: 0.25 }
    },
    daos_embrace: {
        id: "daos_embrace",
        realmIdx: 5,
        name: "Dao's Embrace",
        desc: "The Dao carries your intent. Techniques cost less because the path itself assists.",
        flavor: "The Dao pays part of every technique's price.",
        effectLabel: "−20% technique cost",
        effects: { techniqueCostMult: -0.20 }
    },
    heavenly_mandate: {
        id: "heavenly_mandate",
        realmIdx: 6,
        name: "Heavenly Mandate",
        desc: "Heaven recognizes your right to ascend. Tribulations temper rather than destroy.",
        flavor: "The heavens hesitate before they strike.",
        effectLabel: "+30% tribulation resistance",
        effects: { tribulationResistPct: 0.30 }
    },
    worldly_resonance: {
        id: "worldly_resonance",
        realmIdx: 6,
        name: "Worldly Resonance",
        desc: "All aspects of your cultivation resonate in harmony. Every stat sings louder.",
        flavor: "You and the world breathe as one.",
        effectLabel: "+20% all stats (effective)",
        effects: { allStatsPct: 0.20 }
    },
    selfish_truth: {
        id: "selfish_truth",
        realmIdx: 6,
        name: "Selfish Truth",
        desc: "You choose power over protection. Devastating force, at the cost of vulnerability.",
        flavor: "Truth is sharp — and it cuts both ways.",
        effectLabel: "+30% damage, −10% resistances",
        effects: { damagePct: 0.30, resistPct: -0.10 }
    }
};

const TRANSCENDENCE_REALM_POOLS = {
    1: ["unshakable_foundation", "meridian_prodigy", "body_of_earth"],
    2: ["golden_core_purity", "core_resonance", "unbreakable_core"],
    3: ["souls_eye", "souls_embrace", "souls_wrath"],
    4: ["void_step", "void_siphon", "void_sight"],
    5: ["daos_echo", "daos_clarity", "daos_embrace"],
    6: ["heavenly_mandate", "worldly_resonance", "selfish_truth"]
};
