// ============================================
// COMBAT-DAMAGE.JS — Phase A: stress systems + breaks
// One HP kill race + Flesh / Structure / Circulation / Core stress (enemy-only v1).
// ============================================

const COMBAT_DAMAGE_BALANCE = {
    breakThreshold: 100,
    stressScale: 1.35,
    stressMaxFloor: 80,
    stressMaxHpMult: 1.55,
    maxStructureOutcomes: 2,
    fleshBleedTurns: 4,
    fleshBleedDmgPct: 0.035,
    structureLegSlowTurns: 2,
    frameGuardWeaken: 0.18,
    circulationDmgMult: 0.82,
    coreDmgMult: 0.88
};

const WOUND_NATURE_STRESS = {
    crush: { flesh: 0.18, structure: 0.68, circulation: 0.09, core: 0.05 },
    slash: { flesh: 0.62, structure: 0.28, circulation: 0.06, core: 0.04 },
    needle: { flesh: 0.12, structure: 0.08, circulation: 0.72, core: 0.08 },
    pierce: { flesh: 0.22, structure: 0.18, circulation: 0.25, core: 0.35 },
    'soul-cut': { flesh: 0.08, structure: 0.07, circulation: 0.68, core: 0.17 }
};

/** Tribulation / environmental bolts — stub for Phase A+ integration. */
const TRIBULATION_STRESS_PROFILES = {
    sky_lightning: {
        nature: 'pierce',
        stress: { flesh: 0.22, structure: 0.12, circulation: 0.38, core: 0.28 },
        delivery: 'trib',
        tags: ['inner', 'trib']
    },
    heart_pressure: {
        nature: 'soul-cut',
        stress: { flesh: 0.05, structure: 0.05, circulation: 0.45, core: 0.45 },
        delivery: 'trib',
        tags: ['inner', 'trib']
    }
};

const COMBAT_STRESS_SYSTEMS = ['flesh', 'structure', 'circulation', 'core'];

function cloneStressWeights(weights) {
    return {
        flesh: weights.flesh || 0,
        structure: weights.structure || 0,
        circulation: weights.circulation || 0,
        core: weights.core || 0
    };
}

function getEquippedWeaponTypeForDamage() {
    if (typeof getEquippedInstance !== 'function' || typeof getInstanceDef !== 'function') return null;
    const def = getInstanceDef(getEquippedInstance('weapon'));
    return def?.weaponType || null;
}

function stressForNature(nature, combatTier) {
    const base = cloneStressWeights(WOUND_NATURE_STRESS[nature] || WOUND_NATURE_STRESS.slash);
    if (combatTier === 'heavy' && nature === 'crush') {
        base.structure = Math.min(0.85, base.structure + 0.08);
        base.flesh = Math.max(0.08, base.flesh - 0.05);
    } else if (combatTier === 'heavy' && nature === 'slash') {
        base.flesh = Math.min(0.78, base.flesh + 0.08);
    } else if (combatTier === 'heavy' && nature === 'pierce') {
        base.core = Math.min(0.5, base.core + 0.1);
    }
    return base;
}

function inferWoundNatureFromMeta(meta, techName) {
    const name = techName || '';
    if (meta.spiritDamage) return 'soul-cut';
    if (/needle|meridian|seal|flow|vein|suppression/i.test(name)) return 'needle';
    if (/rend|sever|judgment|spike|pierce|thrust|lance/i.test(name) && (meta.combatTier === 'heavy' || meta.weaponType === 'spear')) {
        return 'pierce';
    }
    const wt = meta.weaponType;
    if (wt === 'sword' || wt === 'blade') return 'slash';
    if (wt === 'spear') return 'pierce';
    if (wt === 'fist') return 'crush';
    if (wt === 'staff') {
        if (meta.element === 'lightning' || /judgment|vein/i.test(name)) return 'needle';
        return 'crush';
    }
    if (meta.path === 'body' || meta.category === 'attack' && meta.path === 'body') return 'crush';
    if (meta.path === 'soul') return 'soul-cut';
    if (meta.combatTier === 'heavy') return 'crush';
    return 'slash';
}

function buildAttackProfileTags(meta, nature, combatTier, techName) {
    const tags = ['outer'];
    if (meta.spiritDamage || meta.element === 'soul') tags.push('inner');
    if (meta.weaponType === 'staff' || meta.weaponType === 'spear') tags.push('twoHand');
    if (combatTier === 'heavy' && (nature === 'crush' || /crash|mountain|shatter|roar/i.test(techName || ''))) {
        tags.push('sweep');
    }
    if (nature === 'pierce' && combatTier === 'heavy') tags.push('execute');
    return tags;
}

function buildAttackProfileFromBasic() {
    const path = G.path;
    let nature = 'slash';
    if (path === 'body') nature = 'crush';
    else if (path === 'soul') nature = 'soul-cut';
    else {
        const wt = getEquippedWeaponTypeForDamage();
        if (wt === 'fist') nature = 'crush';
        else if (wt === 'spear') nature = 'pierce';
        else if (wt === 'staff') nature = 'crush';
        else if (wt === 'blade' || wt === 'sword') nature = 'slash';
    }
    return {
        hp: 0,
        nature,
        stress: stressForNature(nature, 'light'),
        delivery: path === 'soul' ? 'soul' : 'melee',
        tags: buildAttackProfileTags({ path, spiritDamage: path === 'soul' }, nature, 'light', '')
    };
}

function buildAttackProfileFromTechnique(tech) {
    if (!tech) return buildAttackProfileFromBasic();
    const meta = typeof getTechniqueMeta === 'function' ? getTechniqueMeta(tech) : {};
    const combatTier = typeof getTechniqueCombatTier === 'function' ? getTechniqueCombatTier(tech) : 'medium';
    const nature = inferWoundNatureFromMeta(meta, tech.name);
    return {
        hp: 0,
        nature,
        stress: stressForNature(nature, combatTier),
        delivery: meta.spiritDamage ? 'soul' : 'melee',
        tags: buildAttackProfileTags(meta, nature, combatTier, tech.name)
    };
}

function buildTribulationAttackProfile(profileId, hp) {
    const tpl = TRIBULATION_STRESS_PROFILES[profileId] || TRIBULATION_STRESS_PROFILES.sky_lightning;
    return {
        hp: hp || 0,
        nature: tpl.nature,
        stress: cloneStressWeights(tpl.stress),
        delivery: tpl.delivery || 'trib',
        tags: (tpl.tags || ['trib']).slice()
    };
}

function ensureEnemyWoundState(enemy) {
    if (!enemy) return null;
    if (enemy.woundState) return enemy.woundState;
    const stressMax = Math.max(
        COMBAT_DAMAGE_BALANCE.stressMaxFloor,
        Math.floor((enemy.maxHp || enemy.hp || 30) * COMBAT_DAMAGE_BALANCE.stressMaxHpMult)
    );
    const stress = {};
    COMBAT_STRESS_SYSTEMS.forEach(sys => { stress[sys] = 0; });
    enemy.woundState = {
        stress,
        stressMax,
        breaks: { flesh: false, structure: false, circulation: false, core: false },
        structureOutcomes: [],
        structureOutcome: null,
        bleeding: false,
        bleedTurnsLeft: 0
    };
    return enemy.woundState;
}

function initEnemyWoundState(enemy) {
    ensureEnemyWoundState(enemy);
}

function pickStructureOutcome(enemy, profile) {
    const ws = ensureEnemyWoundState(enemy);
    const slots = ['arm', 'leg', 'frame'];
    const available = slots.filter(s => !ws.structureOutcomes.includes(s));
    if (!available.length) return null;

    const weights = {};
    available.forEach(s => { weights[s] = 1; });
    const tags = profile.tags || [];
    if (tags.includes('sweep') || profile.nature === 'slash') weights.leg = (weights.leg || 1) + 2;
    if (tags.includes('twoHand') || profile.nature === 'crush') weights.arm = (weights.arm || 1) + 1.5;
    if (profile.nature === 'crush' && !tags.includes('sweep')) weights.frame = (weights.frame || 1) + 1.2;
    if (tags.includes('execute')) weights.arm = (weights.arm || 1) + 1;

    const total = Object.values(weights).reduce((a, b) => a + b, 0);
    let roll = Math.random() * total;
    for (const slot of available) {
        roll -= weights[slot] || 0;
        if (roll <= 0) return slot;
    }
    return available[available.length - 1];
}

function applyFleshBreak(enemy, logs) {
    const ws = ensureEnemyWoundState(enemy);
    if (ws.breaks.flesh) return;
    ws.breaks.flesh = true;
    ws.bleeding = true;
    ws.bleedTurnsLeft = COMBAT_DAMAGE_BALANCE.fleshBleedTurns;
    const name = typeof stripEnemyDisplayPrefix === 'function'
        ? stripEnemyDisplayPrefix(enemy.name)
        : enemy.name;
    logs.push(`🩸 ${name}'s flesh gives — they bleed heavily!`);
}

function applyStructureBreak(enemy, profile, logs) {
    const ws = ensureEnemyWoundState(enemy);
    if (ws.breaks.structure && ws.structureOutcomes.length >= COMBAT_DAMAGE_BALANCE.maxStructureOutcomes) return;
    if (ws.structureOutcomes.length >= COMBAT_DAMAGE_BALANCE.maxStructureOutcomes) return;

    const outcome = pickStructureOutcome(enemy, profile);
    if (!outcome) return;

    ws.breaks.structure = true;
    ws.structureOutcome = outcome;
    ws.structureOutcomes.push(outcome);
    const name = typeof stripEnemyDisplayPrefix === 'function'
        ? stripEnemyDisplayPrefix(enemy.name)
        : enemy.name;

    if (outcome === 'arm') {
        logs.push(`💥 ${name}'s arm hangs wrong — two-handed blows are beyond them!`);
    } else if (outcome === 'leg') {
        enemy.slowTurns = Math.max(enemy.slowTurns || 0, COMBAT_DAMAGE_BALANCE.structureLegSlowTurns);
        logs.push(`🦴 ${name}'s leg buckles — they can barely keep footing!`);
    } else {
        logs.push(`🏚️ ${name}'s frame cracks — their guard will not hold!`);
    }
}

function applyCirculationBreak(enemy, logs) {
    const ws = ensureEnemyWoundState(enemy);
    if (ws.breaks.circulation) return;
    ws.breaks.circulation = true;
    const name = typeof stripEnemyDisplayPrefix === 'function'
        ? stripEnemyDisplayPrefix(enemy.name)
        : enemy.name;
    logs.push(`☯️ ${name}'s meridians seize — their strikes lose cohesion!`);
}

function applyCoreBreak(enemy, logs) {
    const ws = ensureEnemyWoundState(enemy);
    if (ws.breaks.core) return;
    ws.breaks.core = true;
    const name = typeof stripEnemyDisplayPrefix === 'function'
        ? stripEnemyDisplayPrefix(enemy.name)
        : enemy.name;
    logs.push(`💠 ${name}'s core shudders — will alone keeps them standing!`);
}

function applySystemBreak(enemy, system, profile, logs) {
    const ws = ensureEnemyWoundState(enemy);
    ws.stress[system] = ws.stressMax;
    if (system === 'flesh') applyFleshBreak(enemy, logs);
    else if (system === 'structure') applyStructureBreak(enemy, profile, logs);
    else if (system === 'circulation') applyCirculationBreak(enemy, logs);
    else if (system === 'core') applyCoreBreak(enemy, logs);
}

function resolveCombatHit(profile, enemy) {
    const logs = [];
    if (!enemy || !profile || profile.hp <= 0) return { hpDealt: 0, logs };

    const ws = ensureEnemyWoundState(enemy);
    const scale = COMBAT_DAMAGE_BALANCE.stressScale;
    const threshold = Math.min(ws.stressMax, COMBAT_DAMAGE_BALANCE.breakThreshold);

    COMBAT_STRESS_SYSTEMS.forEach(system => {
        if (ws.breaks[system]) return;
        const weight = profile.stress?.[system] || 0;
        if (weight <= 0) return;
        ws.stress[system] += profile.hp * weight * scale;
        if (ws.stress[system] >= threshold) {
            applySystemBreak(enemy, system, profile, logs);
        }
    });

    return { hpDealt: profile.hp, logs };
}

function getEnemyGuardDamageMult(baseMult) {
    let mult = baseMult == null ? 0.45 : baseMult;
    const ws = G.enemy?.woundState;
    if (ws?.structureOutcome === 'frame') {
        mult = Math.min(0.75, mult + COMBAT_DAMAGE_BALANCE.frameGuardWeaken);
    }
    return mult;
}

function getEnemyWoundDamageMult(enemy) {
    const ws = enemy?.woundState;
    if (!ws) return 1;
    let mult = 1;
    if (ws.breaks.circulation) mult *= COMBAT_DAMAGE_BALANCE.circulationDmgMult;
    if (ws.breaks.core) mult *= COMBAT_DAMAGE_BALANCE.coreDmgMult;
    return mult;
}

function getEnemyWoundStatusChips(enemy) {
    const ws = enemy?.woundState;
    if (!ws) return [];
    const chips = [];
    if (ws.bleeding) chips.push({ cls: 'wound-bleed-chip', label: '🩸 Bleeding', title: 'Bleed damage each turn' });
    if (ws.structureOutcome === 'arm') chips.push({ cls: 'wound-structure-chip', label: '💥 Arm broken', title: 'Structure break — arm' });
    if (ws.structureOutcome === 'leg') chips.push({ cls: 'wound-structure-chip', label: '🦴 Leg ruined', title: 'Structure break — mobility' });
    if (ws.structureOutcome === 'frame') chips.push({ cls: 'wound-structure-chip', label: '🏚️ Frame broken', title: 'Structure break — guard weakened' });
    if (ws.breaks.circulation) chips.push({ cls: 'wound-inner-chip', label: '☯️ Meridians sealed', title: 'Circulation break' });
    if (ws.breaks.core) chips.push({ cls: 'wound-inner-chip', label: '💠 Core cracked', title: 'Core break' });
    return chips;
}

function processEnemyWoundTurnStart(enemy) {
    if (!enemy?.woundState?.bleeding) return false;
    const ws = enemy.woundState;
    const bleedDmg = Math.max(1, Math.floor((enemy.maxHp || enemy.hp) * COMBAT_DAMAGE_BALANCE.fleshBleedDmgPct));
    enemy.hp -= bleedDmg;
    ws.bleedTurnsLeft = (ws.bleedTurnsLeft || 0) - 1;
    const name = typeof stripEnemyDisplayPrefix === 'function'
        ? stripEnemyDisplayPrefix(enemy.name)
        : enemy.name;
    if (typeof addCombatLog === 'function') {
        addCombatLog(`🩸 ${name} bleeds for ${bleedDmg} damage!`, 'entry-hp');
    }
    if (ws.bleedTurnsLeft <= 0) {
        ws.bleeding = false;
        if (typeof addCombatLog === 'function') addCombatLog(`🩸 The bleeding stops.`, 'entry-mod');
    }
    return bleedDmg > 0;
}

/**
 * Apply HP damage to the current enemy and run stress / break resolution.
 * @returns {{ hpApplied: number, logs: string[] }}
 */
function dealPlayerDamageToEnemy(rawHp, profileOrBuilder) {
    if (!G.enemy || rawHp <= 0) return { hpApplied: 0, logs: [] };

    let profile = typeof profileOrBuilder === 'function' ? profileOrBuilder() : profileOrBuilder;
    if (!profile) profile = buildAttackProfileFromBasic();
    profile = Object.assign({}, profile, { hp: rawHp });

    const hit = resolveCombatHit(profile, G.enemy);
    const hpApplied = typeof applyMirrorDamageToReflection === 'function'
        ? applyMirrorDamageToReflection(rawHp)
        : rawHp;
    G.enemy.hp -= hpApplied;

    if (typeof checkEnemyEnrage === 'function') checkEnemyEnrage(G.enemy);

    return { hpApplied, logs: hit.logs || [] };
}
