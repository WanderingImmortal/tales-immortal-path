// ============================================
// TALENT.JS — Spiritual root / aptitude helpers
// ============================================

function getTalentDef() {
    if (!G?.talent?.id) return null;
    return typeof TALENT_BY_ID !== 'undefined' ? (TALENT_BY_ID[G.talent.id] || G.talent) : G.talent;
}

function ensureTalentState() {
    if (!G.talent && typeof TALENT_GRADES !== 'undefined') {
        G.talent = { ...TALENT_GRADES.find(t => t.id === 'single_superior') || TALENT_GRADES[3] };
    }
    if (G.talentCapBypassed == null) G.talentCapBypassed = false;
}

function getTalentCultivateMult() {
    ensureTalentState();
    const def = getTalentDef();
    return def?.cultivateSpeedMult ?? 1;
}

function getTalentBreakthroughBonus() {
    ensureTalentState();
    const def = getTalentDef();
    return def?.breakthroughBonus ?? 0;
}

function getTalentCoreCondenseMult() {
    ensureTalentState();
    const def = getTalentDef();
    return def?.coreCondenseMult ?? 1;
}

function getNaturalRealmCap() {
    ensureTalentState();
    if (G.talentCapBypassed) return 6;
    const def = getTalentDef();
    return def?.naturalRealmCap ?? 6;
}

function isRealmBlockedByTalent(targetRealmIdx) {
    if (G.talentCapBypassed) return false;
    const cap = getNaturalRealmCap();
    return targetRealmIdx > cap;
}

function getTalentRealmCapMessage() {
    return 'Your roots strain — external aid may be required.';
}

function getTalentRealmCapLabel() {
    const cap = getNaturalRealmCap();
    const path = G?.path || 'qi';
    const realms = PATHS[path]?.realms || [];
    return realms[cap] || `Realm ${cap}`;
}

function getTalentCoreFeasibilityLine() {
    const def = getTalentDef();
    return def?.coreFeasibility || '—';
}

function getTalentCultivateSpeedPct() {
    return Math.round(getTalentCultivateMult() * 100);
}

function rollTalentElement(talentId) {
    if (!['single_inferior', 'single_superior', 'mutant', 'heavenly'].includes(talentId)) return null;
    if (typeof TALENT_ELEMENTS === 'undefined' || !TALENT_ELEMENTS.length) return null;
    return TALENT_ELEMENTS[Math.floor(Math.random() * TALENT_ELEMENTS.length)];
}

function buildTalentFromGrade(gradeId) {
    const def = TALENT_BY_ID[gradeId];
    if (!def) return null;
    const element = rollTalentElement(gradeId);
    return {
        id: def.id,
        name: def.name,
        element: element || undefined,
        cultivateSpeedMult: def.cultivateSpeedMult,
        breakthroughBonus: def.breakthroughBonus,
        coreCondenseMult: def.coreCondenseMult,
        naturalRealmCap: def.naturalRealmCap
    };
}

function applyTalentStartingAffinity() {
    if (!G.talent?.element || !G.affinities) return;
    const el = G.talent.element;
    if (G.affinities[el] != null) {
        G.affinities[el] = Math.max(G.affinities[el] || 0, 5);
    }
}

function getOriginCultivateSpeedMult() {
    if (!G.origin?.id) return 1;
    const def = typeof ORIGIN_BY_ID !== 'undefined' ? ORIGIN_BY_ID[G.origin.id] : null;
    const pct = def?.startEffect?.cultivateSpeedPct || 0;
    return 1 + pct / 100;
}

function getDrawbackDaoSpeedMult() {
    let pct = 0;
    (G.creationDrawbacks || []).forEach(id => {
        const d = DRAWBACK_BY_ID?.[id];
        if (d?.effect?.daoSpeedPct) pct += d.effect.daoSpeedPct;
    });
    return 1 + pct / 100;
}

function getDrawbackMaxHpMult() {
    let pct = 0;
    (G.creationDrawbacks || []).forEach(id => {
        const d = DRAWBACK_BY_ID?.[id];
        if (d?.effect?.maxHpPct) pct += d.effect.maxHpPct;
    });
    return 1 + pct / 100;
}

function getDrawbackCombatDamageTakenMult() {
    let pct = 0;
    (G.creationDrawbacks || []).forEach(id => {
        const d = DRAWBACK_BY_ID?.[id];
        if (d?.effect?.combatDamageTakenPct) pct += d.effect.combatDamageTakenPct;
    });
    return 1 + pct / 100;
}

function getCombinedCultivateMult() {
    return getTalentCultivateMult() * getOriginCultivateSpeedMult();
}
