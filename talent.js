// ============================================
// TALENT.JS — Spiritual root v2 (composition + grade)
// ============================================

const SPIRIT_ROOT_V1_MIGRATION = {
    rootless: { composition: 'pentamixed', grade: 'inferior' },
    mixed_inferior: { composition: 'mixed', grade: 'inferior' },
    single_inferior: { composition: 'single', grade: 'inferior' },
    single_superior: { composition: 'single', grade: 'superior' },
    mutant: { composition: 'single', grade: 'superior', deviant: 'thunder' },
    heavenly: { composition: 'single', grade: 'heavenly' }
};

function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function rollSpiritRootElements(compositionId) {
    const comp = SPIRIT_ROOT_COMPOSITION_BY_ID?.[compositionId];
    const pool = typeof SPIRIT_CLASSICAL_ELEMENTS !== 'undefined' ? SPIRIT_CLASSICAL_ELEMENTS : TALENT_ELEMENTS;
    if (!comp || !pool?.length) return [];
    const count = Math.min(comp.elementCount, pool.length);
    return shuffleArray(pool).slice(0, count);
}

function formatSpiritRootElements(elements) {
    if (!elements?.length) return '';
    if (elements.length === 1) return elements[0];
    return elements.join(' · ');
}

function buildSpiritRootName(compositionId, gradeId, deviantId) {
    const comp = SPIRIT_ROOT_COMPOSITION_BY_ID?.[compositionId];
    const grade = SPIRIT_ROOT_GRADE_BY_ID?.[gradeId];
    const deviant = deviantId ? SPIRIT_ROOT_DEVIANT_BY_ID?.[deviantId] : null;
    const base = [comp?.name, grade?.name].filter(Boolean).join(' ');
    return deviant ? `${base} (${deviant.name})` : base;
}

function computeSpiritRootProfile(compositionId, gradeId, deviantId, basinBonus) {
    const comp = SPIRIT_ROOT_COMPOSITION_BY_ID?.[compositionId] || SPIRIT_ROOT_COMPOSITIONS?.[0];
    const grade = SPIRIT_ROOT_GRADE_BY_ID?.[gradeId] || SPIRIT_ROOT_GRADE_BY_ID?.common;
    const deviant = deviantId ? SPIRIT_ROOT_DEVIANT_BY_ID?.[deviantId] : null;
    const bonus = basinBonus || 0;
    const innateCeilingRealmIdx = comp.innateCeilingRealmIdx;
    const naturalRealmCap = Math.min(6, innateCeilingRealmIdx + bonus);
    let cultivateSpeedMult = (comp.compositionSpeedMult || 1) * (grade.cultivateSpeedMult || 1);
    let breakthroughBonus = grade.breakthroughBonus || 0;
    let coreCondenseMult = grade.coreCondenseMult || 1;
    if (deviant) {
        cultivateSpeedMult *= deviant.cultivateSpeedMult || 1;
        breakthroughBonus += deviant.breakthroughBonus || 0;
    }
    return {
        innateCeilingRealmIdx,
        innateHeightLabel: comp.heightLabel,
        naturalRealmCap,
        cultivateSpeedMult,
        breakthroughBonus,
        coreCondenseMult,
        oracleLine: grade.oracleSuffix ? `${comp.oracleLine} ${grade.oracleSuffix}` : comp.oracleLine
    };
}

function buildSpiritRoot(options) {
    const composition = options?.composition || 'pentamixed';
    const grade = options?.grade || 'inferior';
    const deviant = options?.deviant || null;
    const basinBonus = options?.basinBonus || 0;
    const elements = options?.elements?.length
        ? options.elements.slice()
        : rollSpiritRootElements(composition);
    const profile = computeSpiritRootProfile(composition, grade, deviant, basinBonus);
    return {
        version: 2,
        composition,
        grade,
        elements,
        deviant,
        basinBonus,
        rootAscensions: options?.rootAscensions ? options.rootAscensions.slice() : [],
        name: buildSpiritRootName(composition, grade, deviant),
        element: elements[0] || undefined,
        ...profile
    };
}

function migrateSpiritRootV1(talent) {
    if (!talent) return buildSpiritRoot({ composition: 'pentamixed', grade: 'inferior' });
    if (talent.version === 2 && talent.composition && talent.grade) {
        return buildSpiritRoot({
            composition: talent.composition,
            grade: talent.grade,
            elements: talent.elements,
            deviant: talent.deviant,
            basinBonus: talent.basinBonus,
            rootAscensions: talent.rootAscensions
        });
    }
    const mapped = SPIRIT_ROOT_V1_MIGRATION[talent.id];
    if (mapped) {
        return buildSpiritRoot({
            composition: mapped.composition,
            grade: mapped.grade,
            deviant: mapped.deviant || null,
            elements: talent.element ? [talent.element] : undefined,
            basinBonus: talent.basinBonus || 0
        });
    }
    return buildSpiritRoot({
        composition: 'single',
        grade: 'common',
        elements: talent.element ? [talent.element] : undefined,
        basinBonus: talent.basinBonus || 0
    });
}

function ensureTalentState() {
    if (G.talentCapBypassed == null) G.talentCapBypassed = false;
    if (G.basinTierBonus == null && G.talent?.basinBonus != null) G.basinTierBonus = G.talent.basinBonus;
    if (G.basinTierBonus == null) G.basinTierBonus = 0;
    if (!G.talent) {
        G.talent = buildSpiritRoot({ composition: 'pentamixed', grade: 'inferior' });
        return;
    }
    if (G.talent.version !== 2 || !G.talent.composition || !G.talent.grade) {
        G.talent = migrateSpiritRootV1(G.talent);
    }
    if (G.talent.basinBonus !== G.basinTierBonus) {
        G.talent = buildSpiritRoot({
            composition: G.talent.composition,
            grade: G.talent.grade,
            elements: G.talent.elements,
            deviant: G.talent.deviant,
            basinBonus: G.basinTierBonus,
            rootAscensions: G.talent.rootAscensions
        });
    }
}

function getTalentDef() {
    ensureTalentState();
    return G.talent || null;
}

function getSpiritRootComposition() {
    return getTalentDef()?.composition || 'pentamixed';
}

function getSpiritRootGrade() {
    return getTalentDef()?.grade || 'inferior';
}

function getInnateCeilingRealmIdx() {
    const def = getTalentDef();
    return def?.innateCeilingRealmIdx ?? 1;
}

function getInnateHeightLabel() {
    const def = getTalentDef();
    if (def?.innateHeightLabel) return def.innateHeightLabel;
    const idx = getInnateCeilingRealmIdx();
    return SPIRIT_INNATE_HEIGHT_LABELS?.[idx] || `Height ${idx}`;
}

function getOracleLine() {
    return getTalentDef()?.oracleLine || '—';
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
    return getOracleLine();
}

function getTalentCultivateSpeedPct() {
    return Math.round(getTalentCultivateMult() * 100);
}

/** @deprecated v1 — use buildSpiritRoot */
function buildTalentFromGrade(gradeId) {
    const mapped = SPIRIT_ROOT_V1_MIGRATION[gradeId];
    if (mapped) {
        return buildSpiritRoot({
            composition: mapped.composition,
            grade: mapped.grade,
            deviant: mapped.deviant || null
        });
    }
    return buildSpiritRoot({ composition: 'single', grade: 'common' });
}

function mapSpiritElementToAffinityKey(element) {
    const proxy = { wood: 'wind', metal: 'lightning' };
    return proxy[element] || element;
}

function applyTalentStartingAffinity() {
    const def = getTalentDef();
    if (!def?.elements?.length || !G.affinities) return;
    def.elements.forEach(el => {
        const key = mapSpiritElementToAffinityKey(el);
        if (G.affinities[key] != null) {
            G.affinities[key] = Math.max(G.affinities[key] || 0, def.elements.length === 1 ? 8 : 5);
        }
    });
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

function isSpiritRootGradeSelectable(gradeId) {
    const def = SPIRIT_ROOT_GRADE_BY_ID?.[gradeId];
    if (!def) return false;
    if (gradeId === 'heavenly' && typeof isHeavenlyRootLocked === 'function' && isHeavenlyRootLocked()) {
        return false;
    }
    if (def.requiresUnlock && typeof Legacy !== 'undefined') {
        return !!Legacy?.unlocks?.[def.requiresUnlock];
    }
    return true;
}

function isSpiritRootDeviantSelectable(deviantId) {
    if (!deviantId) return true;
    const def = SPIRIT_ROOT_DEVIANT_BY_ID?.[deviantId];
    if (!def) return false;
    if (def.requiresUnlock) return !!Legacy?.unlocks?.[def.requiresUnlock];
    return true;
}

function previewSpiritRoot(compositionId, gradeId, deviantId, originId, previewElements) {
    const root = buildSpiritRoot({
        composition: compositionId,
        grade: gradeId,
        deviant: deviantId || null,
        elements: previewElements?.length ? previewElements : undefined
    });
    const originDef = typeof ORIGIN_BY_ID !== 'undefined' ? ORIGIN_BY_ID[originId] : null;
    const originPct = originDef?.startEffect?.cultivateSpeedPct || 0;
    const speedPct = Math.round(root.cultivateSpeedMult * (1 + originPct / 100) * 100);
    return {
        name: root.name,
        innateHeightLabel: root.innateHeightLabel,
        innateCeilingRealmIdx: root.innateCeilingRealmIdx,
        naturalRealmCap: root.naturalRealmCap,
        oracleLine: root.oracleLine,
        speedPct,
        elements: root.elements
    };
}
