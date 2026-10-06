// ============================================
// FORGE-COMPOSE-DATA.JS — Mundane compose tables
// ============================================

const GEAR_TIER_LABELS = {
    0: 'mortal',
    1: 'mundane',
    2: 'tempered',
    3: 'treasure',
    4: 'spiritual',
    5: 'celestial',
    6: 'silent',
    7: 'dao',
    8: 'law',
    9: 'immortal'
};

const FORGE_COMPOSE_BALANCE = {
    mundaneMonths: 2,
    mundaneStones: 8,
    coreMaterialQty: 2,
    auxMaterialQty: 1,
    maxAuxSlots: 2,
    coreOnlyStatMult: 0.72,
    gradeWeights: [
        { id: 'inferior', weight: 18 },
        { id: 'common', weight: 52 },
        { id: 'superior', weight: 26 },
        { id: 'supreme', weight: 4 }
    ]
};

/** Pattern = slot + shape; core must list pattern id in allowedPatterns. */
const FORGE_PATTERNS = {
    sword: {
        id: 'sword',
        label: 'Sword',
        emoji: '🗡️',
        slot: 'weapon',
        weaponType: 'sword',
        noun: 'sword'
    },
    fist_wrap: {
        id: 'fist_wrap',
        label: 'Fist wraps',
        emoji: '🥊',
        slot: 'weapon',
        weaponType: 'fist',
        noun: 'fist wraps'
    },
    chest: {
        id: 'chest',
        label: 'Chest armor',
        emoji: '🦺',
        slot: 'chestplate',
        weaponType: null,
        noun: 'vest'
    },
    helm: {
        id: 'helm',
        label: 'Headgear',
        emoji: '🧣',
        slot: 'helm',
        weaponType: null,
        noun: 'headwrap'
    },
    boots: {
        id: 'boots',
        label: 'Boots',
        emoji: '👟',
        slot: 'boots',
        weaponType: null,
        noun: 'sandals'
    }
};

/** Core = spine material (inventory mat id). Values are rolled before grade mult. */
const FORGE_CORE_MATERIALS = {
    iron_ore: {
        id: 'iron_ore',
        family: 'metal',
        label: 'Iron',
        allowedPatterns: ['sword', 'chest', 'helm', 'boots', 'fist_wrap'],
        martial: {
            flatDmg: [4, 7],
            defenseBonus: [0, 2],
            maxHpBonus: [0, 4]
        }
    },
    leather_scrap: {
        id: 'leather_scrap',
        family: 'hide',
        label: 'Hide',
        allowedPatterns: ['chest', 'helm', 'boots', 'fist_wrap'],
        martial: {
            flatDmg: [2, 5],
            defenseBonus: [3, 6],
            maxHpBonus: [6, 12]
        }
    },
    heartwood_splint: {
        id: 'heartwood_splint',
        family: 'wood',
        label: 'Heartwood',
        allowedPatterns: ['sword', 'chest', 'helm', 'boots'],
        martial: {
            flatDmg: [3, 6],
            defenseBonus: [2, 4],
            maxHpBonus: [4, 8],
            maxQiBonus: [2, 5],
            qiDensityBonus: [0.02, 0.04]
        }
    },
    spirit_crystal: {
        id: 'spirit_crystal',
        family: 'crystal',
        label: 'Spirit crystal',
        allowedPatterns: ['sword', 'helm', 'boots', 'fist_wrap'],
        martial: {
            flatDmg: [3, 6],
            defenseBonus: [1, 3],
            maxHpBonus: [2, 6],
            maxQiBonus: [3, 6],
            qiDensityBonus: [0.03, 0.05]
        }
    }
};

/** Aux = flesh around the core; optional but improves totals. */
const FORGE_AUX_MATERIALS = {
    silk_thread: {
        id: 'silk_thread',
        martial: { defenseBonus: 1, maxHpBonus: 2, flatDmg: 0 }
    },
    spirit_herb: {
        id: 'spirit_herb',
        martial: { maxQiBonus: 2, qiDensityBonus: 0.02, flatDmg: 1 }
    },
    leather_scrap: {
        id: 'leather_scrap',
        martial: { defenseBonus: 1, maxHpBonus: 3, flatDmg: 0 }
    },
    iron_ore: {
        id: 'iron_ore',
        martial: { flatDmg: 1, defenseBonus: 1, maxHpBonus: 0 }
    }
};
