// ============================================
// CORE.JS — Game state, save/load, helpers
// ============================================

let G = {
    name: "Wandering Immortal",
    path: "qi",
    realmIdx: 0,
    qi: 10,
    qiDensity: 0,
    maxQiBonus: 0,
    vitality: 4,
    spirit: 5,
    will: 3,
    hp: 70,
    vitalityHpBonus: 0,
    maxHp: 70,
    shield: 0,
    maxShield: 0,
    stones: 20,
    pills: 3,
    pillStock: null,
    techniques: [],
    disciples: [],
    breakAttempts: 0,
    foundation: 0,
    cultivationBase: { root: 0, flow: 0, stability: 0 },
    foundationCracks: 0,
    fame: 0,
    trait: TRAITS[0],
    traits: [],
    talent: null,
    origin: null,
    creationDrawbacks: [],
    talentCapBypassed: false,
    log: [],
    gameOver: false,
    inCombat: false,
    defending: false,
    enemy: null,
    enemyMaxHp: 0,
    combatLog: [],
    combatResource: 0,
    maxCombatResource: 0,
    fortifyActive: false,
    mirrorTrial: false,
    crucibleTrial: false,
    crucibleRegenMult: 1,
    silenceTrial: false,
    silenceEchoResist: 0,
    mawTrial: false,
    mawDoubtResist: 0,
    combatPhase: 'player',
    combatTurnTimer: null,
    qiExhausted: false,
    forbiddenTitles: [],
    forbiddenLifespanMult: 1,
    sectName: null,
    sectTechs: [],
    sectPassiveIncome: 0,
    meridians: Array(13).fill(false),
    meridianAttempts: Array(13).fill(0),
    physique: null,
    physiqueCultivation: null,
    physiqueUnlocked: [],
    weaponIntent: null,
    weaponIntents: [],
    activeIntentWeapon: null,
    weaponIntentChoices: [],
    intentCombatState: null,
    daoFragments: [],
    trueDaos: [],
    primeDaos: [],
    mergedDaos: [],
    perfectCultivation: false,
    hasGoldenNeedle: false,
    hasAncientText: false,
    tribulationCount: 0,
    daoComprehensionAttempts: 0,
    corruptionLevel: 0,
    corruptionThreshold: 100,
    pendingIntentChoice: null,
    qiRegenMult: 1,
    dmgMult: 1,
    evasionBonus: 0,
    defenseBonus: 0,
    lightningResist: 0,
    regenBonus: 0,
    inventory: [],
    legendaryMaterials: [],
    equipment: null,
    gearInventory: null,
    gearInstances: null,
    gearBag: null,
    materials: null,
    gearMigrated: false,
    refinedLegendary: [],
    encounterState: null,
    encounterCombat: null,
    tribulationState: null,
    tribulationCombat: null,
    tribulationMarks: [],
    lastTribulationCue: null,
    transcendencePerks: [],
    transcendencePerkOffer: null,
    lastTranscendenceCue: null,
    realmConsolidation: {},
    consolidationBonuses: { breakthrough: 0, techniqueDmgPct: 0, daoSpeedPct: 0, allStatsPct: 0, mentalResistPct: 0 },
    affinities: null,
    fiveElementCycleIdx: 0,
    currentZone: "dustbone",
    currentLocation: "bone_crossroads",
    ageMonths: STARTING_AGE_YEARS * 12,
    lifespanMonths: LIFESPAN_BY_REALM[0] * 12,
    daoAlignment: 0,
    npcState: null,
    worldNpcs: [],
    nextDemonicEmergenceMonths: null,
    worldSchedule: [],
    worldChronicle: [],
    npcQuests: [],
    npcKillLog: [],
    npcCombat: null,
    storyArcState: null,
    npcRelationships: null,
    storyCombat: null,
    sectQuests: null,
    worldEventQuests: null,
    questJournal: null,
    legacyChain: null,
    questPerks: null,
    demonicRedemption: null,
    tutorialLog: null,
    sect: null,
    milestones: null,
    knownFormations: []
};

// ===== HELPERS =====
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

function getPlayerTraits() {
    if (G?.traits?.length) {
        return G.traits.map(t => {
            if (t.id && typeof TRAIT_BY_ID !== 'undefined') return TRAIT_BY_ID[t.id] || t;
            return t;
        }).filter(Boolean);
    }
    if (!G?.trait) return [];
    if (G.trait.id && typeof TRAIT_BY_ID !== 'undefined') return [TRAIT_BY_ID[G.trait.id] || G.trait];
    return [G.trait];
}

function getPlayerTraitDef() {
    const traits = getPlayerTraits();
    return traits.length ? traits[0] : null;
}

function getTraitBonus(key, fallback = 0) {
    return getPlayerTraitBonus(key, fallback);
}

function getPlayerTraitBonus(key, fallback = 0) {
    const traits = getPlayerTraits();
    let sum = 0;
    let found = false;
    for (const trait of traits) {
        const val = trait.bonus?.[key];
        if (val != null) {
            sum += val;
            found = true;
        }
    }
    if (found) return sum;
    return fallback;
}

function getPlayerTraitMultPct(key, fallbackPct = 0) {
    return 1 + (getPlayerTraitBonus(key, fallbackPct) / 100);
}

function getPlayerTraitTribulationResistPct() {
    return getPlayerTraitBonus('tribulationResistPct', 0);
}

function getPlayerTraitPerfectBreakBonus() {
    return getPlayerTraitBonus('perfectBreakPct', 0);
}

function scalePlayerRenownCost(base) {
    const cost = Math.max(0, base || 0);
    return Math.ceil(cost * getPlayerTraitMultPct('renownCostPct', 0));
}

function getPlayerTraitNpcMoodShift() {
    const pct = getPlayerTraitBonus('npcFriendlinessPct', 0);
    if (pct >= 15) return 1;
    if (pct > 0) return 1;
    if (pct <= -15) return -1;
    if (pct < 0) return -1;
    return 0;
}

function applyPlayerTraitStartingEffects() {
    const traits = getPlayerTraits();
    let adeptGranted = false;
    let heirStarted = false;
    for (const trait of traits) {
        if (trait.bonus?.lightningResist) {
            G.lightningResist = (G.lightningResist || 0) + trait.bonus.lightningResist;
        }
        if (trait.bonus?.startingFamePenalty) {
            G.fame = Math.max(0, (G.fame || 0) - Math.max(1, Math.floor(trait.bonus.startingFamePenalty / 5)));
        }
        if (trait.bonus?.startAdeptTechnique && !adeptGranted && typeof grantRandomAdeptTechnique === 'function') {
            grantRandomAdeptTechnique();
            adeptGranted = true;
        }
        if (trait.bonus?.forgottenHeirQuest && !heirStarted && typeof tryStartTraitStoryArcs === 'function') {
            tryStartTraitStoryArcs();
            heirStarted = true;
        }
    }
}

function getMaxCultivationRealmIdx(path) {
    const p = path || (typeof G !== 'undefined' ? G.path : null) || 'qi';
    return Math.max(0, (PATHS[p]?.realms?.length || 7) - 1);
}

function getRealm() { return PATHS[G.path].realms[G.realmIdx] || "MAX"; }
function getTitle() { return PATHS[G.path].titles[G.realmIdx] || "Transcendent"; }

function getNextRealm() {
    const realms = PATHS[G.path].realms;
    return (G.realmIdx + 1 < realms.length) ? realms[G.realmIdx + 1] : "MAX";
}

function getBreakChance() {
    if (typeof ensureConsolidationState === 'function') ensureConsolidationState();
    const statMult = (typeof getTranscendenceStatMult === 'function' ? getTranscendenceStatMult() : 1)
        * (1 + (G.consolidationBonuses?.allStatsPct || 0));
    let base = 30 + getEffectiveFoundation() * 2 + (getCultivationPowerStat() + G.vitality + G.spirit + G.will) * 1.5 * statMult;
    base += getPlayerTraitBonus('breakthroughPct', 0);
    if (typeof getTalentBreakthroughBonus === 'function') base += getTalentBreakthroughBonus();
    if (G.trait?.bonus?.breakthrough) base += G.trait.bonus.breakthrough;
    base -= G.breakAttempts * 5;
    const openCount = G.meridians.filter(m => m).length;
    base += openCount * 2;
    if (typeof getScarBreakthroughBonus === 'function') base += getScarBreakthroughBonus();
    if (typeof getConsolidationBreakBonus === 'function') base += getConsolidationBreakBonus();
    if (typeof getDaoAlignmentBreakBonus === 'function') base += getDaoAlignmentBreakBonus();
    return Math.max(10, Math.min(95, base));
}

function addFame(amount) {
    let scaled = amount;
    if (amount > 0) scaled = Math.floor(amount * getPlayerTraitMultPct('fameGainPct', 0));
    const gained = Math.max(0, Math.floor(scaled * (typeof getScarFameMult === 'function' ? getScarFameMult() : 1)));
    G.fame += gained;
    return gained;
}

function getFameLevel() {
    if (G.fame < 10) return { title: "Unknown", maxRecruits: 0, bonus: 0 };
    if (G.fame < 30) return { title: "Recognized", maxRecruits: 2, bonus: 1 };
    if (G.fame < 60) return { title: "Respected", maxRecruits: 4, bonus: 2 };
    if (G.fame < 100) return { title: "Renowned", maxRecruits: 6, bonus: 4 };
    return { title: "Legendary", maxRecruits: 10, bonus: 6 };
}

function getMeridianOpenCount() { return G.meridians.filter(m => m).length; }

function getMaxQi() {
    const b = QI_BALANCE;
    const foundation = getEffectiveFoundation();
    const base = b.maxQiBase + G.realmIdx * b.maxQiPerRealm + foundation * b.maxQiPerFoundation
        + getMeridianOpenCount() * b.maxQiPerMeridian;
    let total = base + (G.maxQiBonus || 0);
    if (typeof getGearBonuses === 'function') total += getGearBonuses().maxQiBonus || 0;
    if (typeof getScarDown === 'function') total = Math.floor(total * (1 + getScarDown('maxQiPct', 0)));
    total = Math.floor(total * getPlayerTraitMultPct('maxQiPct', 0));
    return Math.max(5, total);
}

function getQiDensity() {
    const b = QI_BALANCE;
    const foundation = getEffectiveFoundation();
    const base = b.densityBase + G.realmIdx * b.densityPerRealm + foundation * b.densityPerFoundation;
    let total = base + (G.qiDensity || 0);
    if (typeof getGearBonuses === 'function') total += getGearBonuses().qiDensityBonus || 0;
    if (typeof getScarQiRegenMult === 'function') total *= getScarQiRegenMult();
    total *= getPlayerTraitMultPct('qiDensityPct', 0);
    return Math.max(0.5, Math.round(total * 100) / 100);
}

function clampCurrentQi() {
    const cap = getMaxQi();
    if (G.qi == null) G.qi = cap;
    if (G.qi > cap) G.qi = cap;
    if (G.qi <= 0) {
        G.qi = 0;
        G.qiExhausted = true;
    } else if (G.qiExhausted && G.qi > 0) {
        G.qiExhausted = false;
    }
}

function getQiFillRatio() {
    return G.qi / Math.max(1, getMaxQi());
}

function getCultivationPowerStat() {
    return getMaxQi() + getQiDensity() * 6;
}

function migrateTechniqueRenames() {
    if (!G.techniques?.length) return;
    G.techniques.forEach(t => {
        if (t.name === 'Iron Mountain Fist') {
            t.name = 'Iron Mountain Stance';
            t.category = 'defense';
            t.combatTier = 'defense';
            t.baseDamage = 5;
        }
        const tpl = getTechniqueTemplate(t.name);
        if (tpl) {
            if (!t.combatTier && tpl.combatTier) t.combatTier = tpl.combatTier;
            if (tpl.category && t.category === 'attack' && tpl.category !== 'attack' && t.name === 'Iron Mountain Stance') {
                t.category = tpl.category;
            }
        }
    });
    if (G.sectTechs?.length) {
        G.sectTechs = G.sectTechs.map(n => n === 'Iron Mountain Fist' ? 'Iron Mountain Stance' : n);
    }
}

function migrateQiSystem() {
    if (G._qiMigrated) return;
    if (G.qiDensity == null && G.maxQiBonus == null && G.qi != null) {
        const cap = getMaxQi();
        G.qiDensity = Math.max(0, Math.round(((G.qi || cap) / Math.max(cap, 1)) * 1.2 * 10) / 10);
        G.maxQiBonus = 0;
    }
    if (G.qiDensity == null) G.qiDensity = 0;
    if (G.maxQiBonus == null) G.maxQiBonus = 0;
    clampCurrentQi();
    G._qiMigrated = true;
}

function getMeridianName(index) {
    const names = ["Lung", "Large Intestine", "Stomach", "Spleen", "Heart", "Small Intestine", "Bladder", "Kidney", "Pericardium", "Triple Burner", "Gallbladder", "Liver", "Governor Vessel"];
    return names[index] || `Meridian ${index+1}`;
}

function getMeridianIcon(index) {
    const icons = ["🌬️", "🌀", "🔥", "💧", "❤️", "🫁", "💎", "🧠", "⚡", "🌙", "☀️", "🌿", "☯️"];
    return icons[index] || "☯️";
}

function applyVitalityToMaxHp() {
    const ratio = VITALITY_HP_RATIO[G.path] || 0.5;
    const target = Math.floor(G.vitality * ratio);
    if (G.vitalityHpBonus == null) G.vitalityHpBonus = target;
    const delta = target - G.vitalityHpBonus;
    if (delta === 0) return;
    G.vitalityHpBonus = target;
    G.maxHp += delta;
    if (delta > 0) G.hp += delta;
    else G.hp = Math.min(G.hp, G.maxHp);
    if (typeof getEffectiveMaxHpFromScars === 'function') {
        G.hp = Math.min(G.hp, getEffectiveMaxHpFromScars());
    }
}

function getTechniqueTemplate(name) {
    return TECHNIQUE_POOL.find(t => t.name === name);
}

function getTechniqueMeta(tech) {
    const tpl = getTechniqueTemplate(tech.name);
    if (typeof ensureTechniqueCultivationTiers === 'function') ensureTechniqueCultivationTiers();
    return {
        path: tech.path || tpl?.path || 'neutral',
        element: tech.element || tpl?.element || 'neutral',
        category: tech.category || tpl?.category || 'attack',
        combatTier: tech.combatTier || tpl?.combatTier || null,
        setId: tech.setId || tpl?.setId || null,
        weaponType: tech.weaponType || tpl?.weaponType || null,
        affinityCycle: tpl?.affinityCycle || null,
        cultivationTier: tpl?.cultivationTier || getTechniqueCultivationTierId?.(tech.name) || 'condensation',
        techniqueQuality: tpl?.techniqueQuality || null,
        intentReq: tpl?.intentReq || (typeof resolveIntentReq === 'function' ? resolveIntentReq(tpl) : null),
        reqTalent: tpl?.reqTalent || null
    };
}

function getTechniqueCombatTier(tech) {
    const meta = getTechniqueMeta(tech);
    if (meta.combatTier) return meta.combatTier;
    if (meta.category === 'utility') return 'utility';
    if (meta.category === 'defense') return 'defense';
    if (meta.category === 'buff') return 'buff';
    if (tech.rarity === 'legendary' || (tech.rarity === 'rare' && (tech.baseDamage || 0) >= 18)) return 'heavy';
    if (tech.rarity === 'common') return 'light';
    return 'medium';
}

function getTechniqueStatCoeff(tech) {
    const meta = getTechniqueMeta(tech);
    const b = TECHNIQUE_BALANCE;
    const path = meta.path === 'neutral' ? G.path : meta.path;
    const tier = getTechniqueCombatTier(tech);
    if (path === 'body') {
        if (meta.category === 'defense' || meta.category === 'buff' || meta.category === 'utility') {
            return b.statCoeffBodyLow;
        }
        if (tier === 'heavy') return b.statCoeffBodyHeavy;
        return b.statCoeffBodyAttack;
    }
    if (meta.category === 'utility' || meta.category === 'defense' || meta.category === 'buff') {
        return b.statCoeffUtility;
    }
    if (tier === 'heavy') return b.statCoeffHeavy;
    if (tier === 'light') return b.statCoeffLight;
    return b.statCoeff;
}

// ===== AFFINITY & SET RESONANCE =====

function createEmptyAffinities() {
    const affinities = {};
    AFFINITY_KEYS.forEach(k => { affinities[k] = 0; });
    return affinities;
}

function ensureAffinities() {
    if (!G.affinities) G.affinities = createEmptyAffinities();
    AFFINITY_KEYS.forEach(k => {
        if (G.affinities[k] == null) G.affinities[k] = 0;
    });
    if (G.fiveElementCycleIdx == null) G.fiveElementCycleIdx = 0;
}

function getAffinityTierIndex(points) {
    const p = Math.min(AFFINITY_BALANCE.maxPoints, Math.max(0, points || 0));
    if (p >= 100) return 4;
    if (p >= 75) return 3;
    if (p >= 50) return 2;
    if (p >= 25) return 1;
    return 0;
}

function getAffinityTierName(points) {
    return AFFINITY_TIER_NAMES[getAffinityTierIndex(points)];
}

function getAffinityTierBonus(points) {
    return AFFINITY_TIER_BONUSES[getAffinityTierIndex(points)];
}

function mapElementToAffinity(element) {
    return ELEMENT_TO_AFFINITY[element] || null;
}

function getTechniquePrimaryAffinityKey(tech) {
    const meta = getTechniqueMeta(tech);
    if (meta.affinityCycle && meta.affinityCycle.length) {
        return meta.affinityCycle[G.fiveElementCycleIdx % meta.affinityCycle.length];
    }
    return mapElementToAffinity(meta.element);
}

function getTechniqueWeaponAffinityKey(tech) {
    const meta = getTechniqueMeta(tech);
    if (meta.weaponType && AFFINITY_KEYS.includes(meta.weaponType)) return meta.weaponType;
    if (G.weaponIntent && meta.category === 'attack') {
        const active = typeof getActiveIntent === 'function' ? getActiveIntent() : G.weaponIntent;
        const w = (active?.weapon || G.weaponIntent?.weapon || '').toLowerCase();
        if (AFFINITY_KEYS.includes(w)) return w;
    }
    return null;
}

function resolveTechniqueAffinityGains(tech) {
    ensureAffinities();
    const meta = getTechniqueMeta(tech);
    const gains = [];
    let gainAmount = AFFINITY_BALANCE.gainPerTechniqueUse;
    const setBonus = getTechniqueSetBonuses(tech);
    if (setBonus?.affinityGainBonus) gainAmount += setBonus.affinityGainBonus;

    if (meta.affinityCycle && meta.affinityCycle.length) {
        const key = meta.affinityCycle[G.fiveElementCycleIdx % meta.affinityCycle.length];
        G.fiveElementCycleIdx = (G.fiveElementCycleIdx + 1) % meta.affinityCycle.length;
        gains.push({ key, amount: gainAmount, cycle: true });
    } else {
        const elKey = mapElementToAffinity(meta.element);
        if (elKey) gains.push({ key: elKey, amount: gainAmount });
    }

    const weaponKey = getTechniqueWeaponAffinityKey(tech);
    if (weaponKey && !gains.some(g => g.key === weaponKey)) {
        gains.push({ key: weaponKey, amount: gainAmount });
    }
    return gains;
}

function grantTechniqueAffinity(tech, logFn) {
    const log = logFn || addLog;
    const gains = resolveTechniqueAffinityGains(tech);
    gains.forEach(({ key, amount, cycle }) => {
        const before = G.affinities[key] || 0;
        const beforeTier = getAffinityTierIndex(before);
        G.affinities[key] = Math.min(AFFINITY_BALANCE.maxPoints, before + amount);
        const afterTier = getAffinityTierIndex(G.affinities[key]);
        const label = AFFINITY_LABELS[key] || key;
        if (afterTier > beforeTier) {
            log(`🌟 ${label} Affinity — ${AFFINITY_TIER_NAMES[afterTier]}! (${G.affinities[key]}/100)`);
        } else if (cycle) {
            log(`✨ ${label} +${amount} (cycle · ${G.affinities[key]}/100)`);
        } else {
            log(`✨ ${label} +${amount} (${G.affinities[key]}/100)`);
        }
    });
}

function countOwnedSetTechniques(setId) {
    const set = TECHNIQUE_SETS[setId];
    if (!set) return 0;
    return set.techniques.filter(name => G.techniques.some(t => t.name === name)).length;
}

function getSetResonanceTier(setId) {
    const set = TECHNIQUE_SETS[setId];
    if (!set) return 0;
    const owned = countOwnedSetTechniques(setId);
    if (owned >= set.techniques.length) return set.techniques.length;
    if (owned >= 3) return 3;
    if (owned >= 2) return 2;
    return owned;
}

function getSetBonusesForId(setId) {
    const set = TECHNIQUE_SETS[setId];
    if (!set) return null;
    const tier = getSetResonanceTier(setId);
    if (tier >= set.techniques.length && set.bonuses.full) return set.bonuses.full;
    if (tier >= 3 && set.bonuses[3]) return set.bonuses[3];
    if (tier >= 2 && set.bonuses[2]) return set.bonuses[2];
    return null;
}

function getTechniqueSetBonuses(tech) {
    const meta = getTechniqueMeta(tech);
    if (!meta.setId) return null;
    return getSetBonusesForId(meta.setId);
}

function getActiveSetResonanceSummary() {
    ensureAffinities();
    return Object.values(TECHNIQUE_SETS).map(set => {
        const owned = countOwnedSetTechniques(set.id);
        const tier = getSetResonanceTier(set.id);
        const bonus = getSetBonusesForId(set.id);
        return { set, owned, tier, bonus, total: set.techniques.length };
    }).filter(s => s.owned > 0 || s.tier >= 2);
}

function getTechniqueAffinityDamageMult(tech) {
    ensureAffinities();
    let mult = 1;
    const elKey = getTechniquePrimaryAffinityKey(tech);
    if (elKey) mult += getAffinityTierBonus(G.affinities[elKey]).dmgMult;
    const weaponKey = getTechniqueWeaponAffinityKey(tech);
    if (weaponKey && weaponKey !== elKey) {
        mult += getAffinityTierBonus(G.affinities[weaponKey]).dmgMult;
    }
    return mult;
}

function getTechniqueAffinityCostMult(tech) {
    ensureAffinities();
    let reduction = 0;
    const elKey = getTechniquePrimaryAffinityKey(tech);
    if (elKey) reduction += getAffinityTierBonus(G.affinities[elKey]).costMult;
    const weaponKey = getTechniqueWeaponAffinityKey(tech);
    if (weaponKey && weaponKey !== elKey) {
        reduction += getAffinityTierBonus(G.affinities[weaponKey]).costMult;
    }
    return Math.max(0.5, 1 - reduction);
}

function getTechniqueSetDamageMult(tech) {
    const bonus = getTechniqueSetBonuses(tech);
    if (!bonus?.dmgMult) return 1;
    return 1 + bonus.dmgMult;
}

function getTechniqueSetCostMult(tech) {
    const bonus = getTechniqueSetBonuses(tech);
    if (!bonus?.costMult) return 1;
    return Math.max(0.5, 1 - bonus.costMult);
}

function rollFireIgniteBonus(tech) {
    const elKey = getTechniquePrimaryAffinityKey(tech);
    if (elKey !== 'fire') return 0;
    const tierBonus = getAffinityTierBonus(G.affinities.fire);
    if (!tierBonus.fireIgniteChance) return 0;
    if (Math.random() >= tierBonus.fireIgniteChance) return 0;
    return Math.max(2, Math.floor(G.maxHp * 0.04));
}

function rollTrueDaoCombatEffects(tech) {
    const fx = { bonusDmg: 0, skipTurns: 0, slowTurns: 0, root: false, log: '' };
    if (!G.trueDaos?.length || !tech) return fx;
    const el = getTechniquePrimaryAffinityKey(tech);
    const tryProc = (daoName, chance) => G.trueDaos.includes(daoName) && Math.random() < chance;

    if (el === 'fire' && tryProc('Dao of Fire', 0.28)) {
        fx.bonusDmg = Math.max(2, Math.floor(G.maxHp * 0.05));
        fx.log = '🔥 True Dao of Fire ignites!';
    } else if (el === 'water' && tryProc('Dao of Water', 0.24)) {
        fx.bonusDmg = Math.max(2, Math.floor(G.maxHp * 0.03));
        fx.skipTurns = 1;
        fx.log = '💧 True Dao of Water freezes their meridians!';
    } else if (el === 'lightning' && tryProc('Dao of Lightning', 0.22)) {
        fx.bonusDmg = Math.max(2, Math.floor(G.maxHp * 0.04));
        fx.skipTurns = 1;
        fx.log = '⚡ True Dao of Lightning stuns them rigid!';
    } else if (el === 'wind' && tryProc('Dao of Wind', 0.2)) {
        fx.slowTurns = 2;
        fx.log = '🌪️ True Dao of Wind shears their momentum!';
    } else if (el === 'earth' && tryProc('Dao of Earth', 0.2)) {
        fx.root = true;
        fx.log = '🪨 True Dao of Earth roots them in place!';
    }
    return fx;
}

/** @deprecated use rollTrueDaoCombatEffects */
function rollTrueDaoCombatBonus(tech) {
    return rollTrueDaoCombatEffects(tech).bonusDmg;
}

function getTopAffinities(limit) {
    ensureAffinities();
    return AFFINITY_KEYS
        .map(key => ({ key, points: G.affinities[key] || 0, tier: getAffinityTierName(G.affinities[key] || 0) }))
        .filter(a => a.points > 0)
        .sort((a, b) => b.points - a.points)
        .slice(0, limit || 5);
}

function getTechniqueStatScale(tech) {
    const meta = getTechniqueMeta(tech);
    const path = meta.path === 'neutral' ? G.path : meta.path;
    if (path === 'soul') return (G.will + G.spirit) / 2;
    if (path === 'body') return G.vitality * 1.5 + getQiDensity() * 0.5;
    return getQiDensity() * 1.2 + G.will * 0.3;
}

function getElementDamageMult(element) {
    if (!element || element === 'neutral' || element === 'elemental' || element === 'blood') return 1;
    const daoName = ELEMENT_DAO_MAP[element];
    if (!daoName) return 1;
    if (G.trueDaos && G.trueDaos.includes(daoName)) {
        return element === 'ice' ? TECHNIQUE_BALANCE.iceFromWaterDaoMult : TECHNIQUE_BALANCE.daoDamageMult;
    }
    return 1;
}

function ensurePillStock() {
    if (!G.pillStock) {
        G.pillStock = {};
        Object.keys(PILL_TYPES).forEach(id => { G.pillStock[id] = 0; });
        if (G.pills > 0) G.pillStock.spirit_gathering = G.pills;
        else G.pillStock.spirit_gathering = 3;
        G.pillStock.blood_recovery = 1;
    }
    Object.keys(PILL_TYPES).forEach(id => {
        if (G.pillStock[id] == null) G.pillStock[id] = 0;
    });
}

function getTotalPills() {
    ensurePillStock();
    return Object.values(G.pillStock).reduce((sum, n) => sum + (n || 0), 0);
}

function addPill(id, qty) {
    if (!PILL_TYPES[id]) return false;
    ensurePillStock();
    qty = qty || 1;
    if (typeof getTravelKitPillBlockReason === 'function') {
        const block = getTravelKitPillBlockReason(qty);
        if (block) {
            if (typeof addLog === 'function') addLog(`🎒 ${block}`);
            return false;
        }
    }
    G.pillStock[id] = (G.pillStock[id] || 0) + qty;
    return true;
}

function rollRandomPillId() {
    const total = PILL_LOOT_WEIGHTS.reduce((s, p) => s + p.weight, 0);
    let roll = Math.random() * total;
    for (const entry of PILL_LOOT_WEIGHTS) {
        roll -= entry.weight;
        if (roll <= 0) return entry.id;
    }
    return PILL_LOOT_WEIGHTS[0].id;
}

function getTechniqueByName(name) {
    return G.techniques.find(t => t.name === name);
}

function getTechniqueTier(uses) {
    if (uses >= 50) return { name: "Transcendent", bonusDmg: 0.55, bonusCost: 0.40 };
    if (uses >= 30) return { name: "Grandmaster", bonusDmg: 0.25, bonusCost: 0.25 };
    if (uses >= 15) return { name: "Master", bonusDmg: 0.25, bonusCost: 0 };
    if (uses >= 5) return { name: "Adept", bonusDmg: 0, bonusCost: 0.15 };
    return { name: "Initiate", bonusDmg: 0, bonusCost: 0 };
}

function getTechCost(tech) {
    const tier = getTechniqueTier(tech.uses || 0);
    const base = typeof getTechniqueBaseStats === 'function' ? getTechniqueBaseStats(tech).baseCost : tech.baseCost;
    let cost = base * (1 - tier.bonusCost);
    if (typeof getTechniqueIntentMatch === 'function') {
        cost *= getTechniqueIntentMatch(tech).costMult;
    }
    return Math.max(1, Math.round(cost));
}

function getTechDamage(tech) {
    const tier = getTechniqueTier(tech.uses || 0);
    const meta = getTechniqueMeta(tech);
    const baseStats = typeof getTechniqueBaseStats === 'function' ? getTechniqueBaseStats(tech) : tech;
    const mastery = Math.floor((tech.uses || 0) / 10) * TECHNIQUE_BALANCE.masteryPerTenUses;
    const statPart = Math.floor(getTechniqueStatScale(tech) * getTechniqueStatCoeff(tech));
    const realmPart = G.realmIdx * TECHNIQUE_BALANCE.realmBonus;
    let dmg = baseStats.baseDamage + mastery + statPart + realmPart;
    dmg *= (1 + tier.bonusDmg);
    dmg *= getElementDamageMult(meta.element);
    dmg *= getTechniqueAffinityDamageMult(tech);
    dmg *= getTechniqueSetDamageMult(tech);
    if (typeof getTechniqueObsolescenceMult === 'function') dmg *= getTechniqueObsolescenceMult(tech);
    if (G.weaponIntent) dmg *= (1 + getIntentBonus());
    if (typeof getTechniqueIntentMatch === 'function') {
        const intent = getTechniqueIntentMatch(tech);
        if (intent.dmgMult !== 1) dmg *= intent.dmgMult;
    }
    if (G.dmgMult > 1) dmg *= G.dmgMult;
    dmg *= getPlayerTraitMultPct('techniqueDmgPct', 0);
    const baseDmg = baseStats.baseDamage;
    return Math.max(baseDmg === 0 ? 0 : 1, Math.round(dmg));
}

function getTechDamageBreakdown(tech) {
    const tier = getTechniqueTier(tech.uses || 0);
    const meta = getTechniqueMeta(tech);
    const baseStats = typeof getTechniqueBaseStats === 'function' ? getTechniqueBaseStats(tech) : tech;
    const mastery = Math.floor((tech.uses || 0) / 10) * TECHNIQUE_BALANCE.masteryPerTenUses;
    const statPart = Math.floor(getTechniqueStatScale(tech) * getTechniqueStatCoeff(tech));
    const realmPart = G.realmIdx * TECHNIQUE_BALANCE.realmBonus;
    const elementMult = getElementDamageMult(meta.element);
    const affinityMult = getTechniqueAffinityDamageMult(tech);
    const setMult = getTechniqueSetDamageMult(tech);
    const obsoleteMult = typeof getTechniqueObsolescenceMult === 'function' ? getTechniqueObsolescenceMult(tech) : 1;
    return {
        base: baseStats.baseDamage,
        mastery,
        statPart,
        realmPart,
        tier: tier.name,
        elementMult,
        affinityMult,
        setMult,
        obsoleteMult,
        cultivationTier: meta.cultivationTier
    };
}

function getPhysiqueByName(name) {
    return ALL_PHYSIQUES.find(p => p.name === name);
}

function getPhysiqueById(id) {
    if (!id) return null;
    const trainable = typeof TRAINABLE_PHYSIQUES !== 'undefined'
        ? TRAINABLE_PHYSIQUES.find(p => p.id === id) : null;
    return trainable || null;
}

function formatPhysiqueEffectDesc(p) {
    if (!p) return '';
    if (p.effectDesc) return p.effectDesc;
    if (p.pro) return `${p.pro}${p.con && p.con !== 'None' ? ' · ' + p.con : ''}`;
    const b = p.bonus || {};
    const parts = [];
    if (b.qi) parts.push(`${b.qi > 0 ? '+' : ''}${b.qi} Qi`);
    if (b.vitality) parts.push(`${b.vitality > 0 ? '+' : ''}${b.vitality} Vitality`);
    if (b.spirit) parts.push(`${b.spirit > 0 ? '+' : ''}${b.spirit} Spirit`);
    if (b.will) parts.push(`${b.will > 0 ? '+' : ''}${b.will} Will`);
    if (b.lightningResist) parts.push(`+${b.lightningResist}% lightning resist`);
    if (b.evasion) parts.push(`+${b.evasion}% evasion`);
    if (b.defense) parts.push(`${b.defense > 0 ? '+' : ''}${b.defense}% defense`);
    if (b.regen) parts.push(`+${b.regen}% HP regen`);
    if (b.qiRegenMult) parts.push(`+${Math.round((b.qiRegenMult - 1) * 100)}% Qi regen`);
    if (b.dmgMult) parts.push(`+${Math.round((b.dmgMult - 1) * 100)}% damage`);
    if (b.hp) parts.push(`${b.hp}% max HP`);
    return parts.join(' · ') || 'Unique awakening bonus';
}

function getDaoFragmentReqRealm(fragment) {
    if (!fragment) return typeof DAO_SEEKING_REALM_IDX !== 'undefined' ? DAO_SEEKING_REALM_IDX : 5;
    return fragment.reqRealm ?? (typeof DAO_SEEKING_REALM_IDX !== 'undefined' ? DAO_SEEKING_REALM_IDX : 5);
}

function getDaoSeekingRealmLabel() {
    const idx = typeof DAO_SEEKING_REALM_IDX !== 'undefined' ? DAO_SEEKING_REALM_IDX : 5;
    const path = PATHS[G.path] || PATHS.qi;
    return path.realms[idx] || 'Dao Seeking';
}

function getIntentTier(usesOrIntent) {
    if (typeof getIntentTierForRecord === 'function' && usesOrIntent && typeof usesOrIntent === 'object') {
        return getIntentTierForRecord(usesOrIntent);
    }
    const uses = typeof usesOrIntent === 'number' ? usesOrIntent : 0;
    let tier = INTENT_TIERS[0];
    for (const t of INTENT_TIERS) {
        if (uses >= t.uses) tier = t;
    }
    return tier;
}

// ===== TIME & LIFESPAN =====
function getLifespanForRealm(realmIdx) {
    const years = LIFESPAN_BY_REALM[Math.min(realmIdx, LIFESPAN_BY_REALM.length - 1)];
    return years * 12;
}

function isImmortal() {
    return G.realmIdx >= PATHS[G.path].realms.length - 1;
}

function formatYears(months) {
    const years = Math.floor(months / 12);
    const rem = months % 12;
    if (rem === 0) return `${years}y`;
    return `${years}y ${rem}m`;
}

function getYearsRemaining() {
    if (isImmortal()) return Infinity;
    return Math.max(0, Math.floor((G.lifespanMonths - G.ageMonths) / 12));
}

function formatDuration(months) {
    if (months > 0 && months < 1) {
        const weeks = Math.round(months * (typeof CHAMBER_BALANCE !== 'undefined' ? CHAMBER_BALANCE.weeksPerMonth : 4));
        return weeks === 1 ? '1 week' : `${weeks} weeks`;
    }
    if (months < 12) return months === 1 ? "1 month" : `${months} months`;
    const y = Math.floor(months / 12);
    const m = months % 12;
    if (m === 0) return y === 1 ? "1 year" : `${y} years`;
    return `${y}y ${m}m`;
}

function formatActionTimeMeta(months, remainStr) {
    return `${formatDuration(months)} · Age ${formatYears(G.ageMonths)} · ${remainStr}`;
}

function advanceTime(months, activity) {
    if (months <= 0) return true;
    if (G.gameOver) return false;
    if (typeof applyPlaytestTimeMonths === 'function') {
        months = applyPlaytestTimeMonths(months);
    }
    if (G.forbiddenLifespanMult && G.forbiddenLifespanMult > 1 && months >= 1) {
        months = Math.max(1, Math.floor(months / G.forbiddenLifespanMult));
    }
    const fromMonths = G.ageMonths;
    const toMonths = fromMonths + months;
    const deferLogs = !!G._actionLog;
    if (deferLogs) G._deferringLogs = true;
    let chronicleBatch = [];
    if (typeof processWorldTime === 'function') {
        chronicleBatch = processWorldTime(fromMonths, toMonths, { activity, months }) || [];
    } else {
        if (typeof processWorldTimeLegacy === 'function') {
            chronicleBatch = processWorldTimeLegacy(fromMonths, toMonths) || [];
        }
        G.ageMonths = toMonths;
    }
    if (typeof tickAlchemySupplyDecay === 'function') tickAlchemySupplyDecay(months);
    if (deferLogs) G._deferringLogs = false;
    const remaining = getYearsRemaining();
    const remainStr = isImmortal() ? 'immortal' : `${remaining}y left`;
    const timeMeta = formatActionTimeMeta(months, remainStr);
    const worldMeta = typeof formatWorldChronicleLine === 'function'
        ? formatWorldChronicleLine(chronicleBatch)
        : '';
    if (G._actionLog) {
        const extras = G._pendingActionMeta?.extras || [];
        G._pendingActionMeta = { time: timeMeta, world: worldMeta, extras };
    } else {
        let line = `⏳ ${activity} — ${timeMeta}.`;
        if (worldMeta) line += ` ${worldMeta}`;
        addLog(line);
    }
    if (!isImmortal() && G.ageMonths >= G.lifespanMonths) {
        if (typeof trySectLeaderSuccessionOnDeath === 'function' && trySectLeaderSuccessionOnDeath()) {
            return true;
        }
        G.gameOver = true;
        addLog(`💀 Your lifespan ends at ${formatYears(G.lifespanMonths)}. The Dao remains unclaimed...`);
        if (typeof triggerBitterReincarnation === 'function') {
            setTimeout(() => triggerBitterReincarnation(), 600);
        }
        return false;
    }
    return true;
}

function extendLifespanOnBreakthrough(tier) {
    const newCap = getLifespanForRealm(G.realmIdx);
    if (newCap <= G.lifespanMonths) return;
    const scale = typeof getBreakthroughTierScale === 'function' && tier
        ? getBreakthroughTierScale(tier).lifespanMult
        : 1;
    const gainedMonths = Math.floor((newCap - G.lifespanMonths) * scale);
    if (gainedMonths <= 0) return;
    G.lifespanMonths += gainedMonths;
    const gainedYears = Math.floor(gainedMonths / 12);
    if (isImmortal()) {
        addLog(`✨ You transcend mortal lifespan! Old age can no longer claim you.`);
    } else {
        const tierLabel = tier && typeof getBreakthroughTierScale === 'function'
            ? getBreakthroughTierScale(tier).label
            : null;
        const tierNote = tierLabel && tier !== 'peak' && tier !== 'perfect' ? ` (${tierLabel} seal)` : '';
        addLog(`🌿 Breakthrough extends your life by ${gainedYears} years${tierNote}! Lifespan: ${formatYears(G.lifespanMonths)}.`);
    }
}

function initLifespan() {
    G.ageMonths = STARTING_AGE_YEARS * 12;
    G.lifespanMonths = getLifespanForRealm(0);
}

// ===== SAVE / LOAD =====
function saveState() {
    G.currentZone = currentZone;
    try { localStorage.setItem('xianxia_save', JSON.stringify(G)); } catch(e) {}
}

function loadState() {
    try {
        const raw = localStorage.getItem('xianxia_save');
        if (raw) {
            const data = JSON.parse(raw);
            Object.assign(G, data);
            if (G.trait && !G.trait.id && typeof TRAITS !== 'undefined') {
                const match = TRAITS.find(t => t.name === G.trait.name);
                if (match) G.trait = match;
            }
            if (!G.traits?.length && G.trait) G.traits = [G.trait];
            if (typeof ensureTalentState === 'function') ensureTalentState();
            if (!G.creationDrawbacks) G.creationDrawbacks = [];
            if (!G.techniques) G.techniques = [];
            if (!G.disciples) G.disciples = [];
            if (!G.log) G.log = [];
            if (!G.combatLog) G.combatLog = [];
            if (!G.sectTechs) G.sectTechs = [];
            if (!G.meridians) G.meridians = Array(13).fill(false);
            if (!G.meridianAttempts) G.meridianAttempts = Array(13).fill(0);
            if (!G.physiqueUnlocked) G.physiqueUnlocked = [];
            if (typeof ensurePhysiqueCultivationState === 'function') ensurePhysiqueCultivationState();
            if (typeof migratePhysiqueCultivationForExistingSave === 'function') migratePhysiqueCultivationForExistingSave();
            if (typeof syncPhysiqueBonuses === 'function') syncPhysiqueBonuses();
            if (!G.daoFragments) G.daoFragments = [];
            if (!G.trueDaos) G.trueDaos = [];
            if (!G.primeDaos) G.primeDaos = [];
            if (!G.mergedDaos) G.mergedDaos = [];
            if (!G.weaponIntentChoices) G.weaponIntentChoices = [];
            if (!G.weaponIntents) G.weaponIntents = [];
            if (G.activeIntentWeapon == null) G.activeIntentWeapon = null;
            if (typeof ensureIntentState === 'function') ensureIntentState();
            if (!G.inventory) G.inventory = [];
            if (!G.legendaryMaterials) G.legendaryMaterials = [];
            if (typeof ensureGearState === 'function') ensureGearState();
            if (!G.refinedLegendary) G.refinedLegendary = [];
            if (G.encounterState === undefined) G.encounterState = null;
            if (G.encounterCombat === undefined) G.encounterCombat = null;
            if (G.ancientGuardianCombat === undefined) G.ancientGuardianCombat = null;
            if (G.tribulationState === undefined) G.tribulationState = null;
            if (G.tribulationCombat === undefined) G.tribulationCombat = null;
            if (!G.tribulationMarks) G.tribulationMarks = [];
            if (!G.transcendencePerks) G.transcendencePerks = [];
            G.transcendencePerkOffer = null;
            G.lastTribulationCue = null;
            G.lastTranscendenceCue = null;
            if (typeof migrateConsolidationState === 'function') migrateConsolidationState();
            else if (typeof ensureConsolidationState === 'function') ensureConsolidationState();
            if (typeof ensureCultivationBaseState === 'function') ensureCultivationBaseState();
            if (typeof migrateCultivationBaseFromLegacy === 'function') migrateCultivationBaseFromLegacy();
            if (typeof migrateQiSystem === 'function') migrateQiSystem();
            if (typeof migrateTechniqueRenames === 'function') migrateTechniqueRenames();
            if (typeof migrateTechniqueManuals === 'function') migrateTechniqueManuals();
            if (typeof migrateLegacyScars === 'function') migrateLegacyScars();
            if (G.daoAlignment == null) G.daoAlignment = 0;
            if (typeof ensureDaoAlignment === 'function') ensureDaoAlignment();
            if (typeof ensureNpcState === 'function') ensureNpcState();
            if (typeof ensureWorldNpcs === 'function') ensureWorldNpcs();
            if (G.worldNpcs == null) G.worldNpcs = [];
            if (G.nextDemonicEmergenceMonths == null && typeof scheduleNextDemonicEmergence === 'function') {
                scheduleNextDemonicEmergence();
            }
            if (!G.worldSchedule) G.worldSchedule = [];
            if (!G.worldChronicle) G.worldChronicle = [];
            if (typeof migrateWorldScheduleFromLegacy === 'function') migrateWorldScheduleFromLegacy();
            if (typeof ensureNpcQuestState === 'function') ensureNpcQuestState();
            if (typeof ensureStoryQuestState === 'function') ensureStoryQuestState();
            if (typeof ensureExtendedQuestState === 'function') ensureExtendedQuestState();
            if (typeof syncStoryNpcQuests === 'function') syncStoryNpcQuests();
            if (typeof syncStoryQuestLog === 'function') syncStoryQuestLog();
            if (typeof ensureTutorialState === 'function') ensureTutorialState();
            if (typeof migrateTutorialForExistingSave === 'function') migrateTutorialForExistingSave();
            if (typeof ensureGearState === 'function') ensureGearState();
            if (typeof migrateGearForExistingSave === 'function') migrateGearForExistingSave();
            if (typeof ensureAlchemyState === 'function') ensureAlchemyState();
            if (typeof migrateAlchemyForExistingSave === 'function') migrateAlchemyForExistingSave();
            if (typeof ensureSectState === 'function') ensureSectState();
            if (typeof migrateSectForExistingSave === 'function') migrateSectForExistingSave();
            if (typeof migrateFormationsForExistingSave === 'function') migrateFormationsForExistingSave();
            if (typeof migrateMilestonesFromLegacy === 'function') migrateMilestonesFromLegacy();
            if (typeof initActionUnlockSnapshot === 'function') initActionUnlockSnapshot();
            if (typeof ensureAncientsState === 'function') ensureAncientsState();
            if (typeof ensureFactionState === 'function') ensureFactionState();
            ensureAffinities();
            if (!G.maxHp) G.maxHp = G.hp || 70;
            if (G.currentZone) currentZone = G.currentZone;
            else G.currentZone = currentZone;
            if (typeof getDefaultLocationForZone === 'function') {
                if (!G.currentLocation) G.currentLocation = getDefaultLocationForZone(G.currentZone || currentZone);
            }
            if (typeof ensureLocationState === 'function') ensureLocationState();
            if (G.ageMonths == null) G.ageMonths = STARTING_AGE_YEARS * 12;
            if (G.combatResource == null) G.combatResource = 0;
            if (G.maxCombatResource == null) G.maxCombatResource = 0;
            if (G.fortifyActive == null) G.fortifyActive = false;
            if (G.qiExhausted == null) G.qiExhausted = false;
            if (!G.forbiddenTitles) G.forbiddenTitles = [];
            if (G.forbiddenLifespanMult == null) G.forbiddenLifespanMult = 1;
            if (G.mirrorTrial == null) G.mirrorTrial = false;
            if (G.crucibleTrial == null) G.crucibleTrial = false;
            if (G.crucibleRegenMult == null) G.crucibleRegenMult = 1;
            if (G.silenceTrial == null) G.silenceTrial = false;
            if (G.silenceEchoResist == null) G.silenceEchoResist = 0;
            if (G.mawTrial == null) G.mawTrial = false;
            if (G.mawDoubtResist == null) G.mawDoubtResist = 0;
            if (G.combatPhase == null) G.combatPhase = 'player';
            if (G.vitalityHpBonus == null) G.vitalityHpBonus = 0;
            ensurePillStock();
            applyVitalityToMaxHp();
            ensureForbiddenState();
            DAO_FRAGMENTS.filter(f => f.forbiddenClear).forEach(f => {
                if (G.daoFragments.includes(f.name) && !getGroundProgress(f.forbiddenClear).cleared) {
                    G.daoFragments = G.daoFragments.filter(d => d !== f.name);
                }
            });
            return true;
        }
    } catch(e) {}
    return false;
}

function resetGame() {
    if (!confirm("Reset your cultivation journey? All progress lost.")) return;
    localStorage.removeItem('xianxia_save');
    location.reload();
}