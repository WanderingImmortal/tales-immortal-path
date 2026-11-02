/**
 * Stage 3A — cultivation progression measurement (no DOM, no balance changes).
 * Uses real passive-cultivation + talent + actions.runCultivateSession + QC band rules.
 * Run: node scripts/audit-cultivation-progression.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const START_AGE_MONTHS = 16 * 12;
const LIFESPAN_QC_MONTHS = 80 * 12;
const MAX_SIM_MONTHS = 100 * 12;
const GRADES = ['inferior', 'common', 'superior', 'heavenly'];
const THRESHOLDS = { mid: 90, late: 220, peak: 320 };

let failed = 0;
function fail(msg) {
    console.error(`FAIL: ${msg}`);
    failed += 1;
}
function ok(msg) {
    console.log(`ok: ${msg}`);
}

/** Deterministic density roll for runCultivateSession (midpoint of min/max band). */
function installDeterministicRandom() {
    const orig = Math.random;
    Math.random = () => 0.5;
    return () => { Math.random = orig; };
}

function extractConst(dataJs, name) {
    const re = new RegExp(`const ${name} =[\\s\\S]*?;\\n`, 'm');
    const m = dataJs.match(re);
    if (!m) throw new Error(`Could not extract ${name} from data.js`);
    vm.runInThisContext(m[0], { filename: `data-${name}` });
}

function loadCultivationRuntime() {
    const dataJs = fs.readFileSync(path.join(root, 'data.js'), 'utf8');
    [
        'SPIRIT_ROOT_COMPOSITIONS',
        'SPIRIT_ROOT_COMPOSITION_BY_ID',
        'SPIRIT_ROOT_GRADES',
        'SPIRIT_ROOT_GRADE_BY_ID',
        'STARTING_AGE_YEARS',
        'LIFESPAN_BY_REALM',
        'NPC_ECOSYSTEM',
        'NPC_ROLES'
    ].forEach(n => extractConst(dataJs, n));

    // Pin exact balance objects (data.js regex extract breaks on nested semicolons).
    global.QI_BALANCE = {
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
    global.CHAMBER_BALANCE = {
        weeksPerMonth: 4,
        gatherQi: {
            weeks: 1,
            densityGainMin: 0.14,
            densityGainMax: 0.32,
            fillRatio: 0.11
        }
    };
    vm.runInThisContext('var QI_BALANCE = global.QI_BALANCE; var CHAMBER_BALANCE = global.CHAMBER_BALANCE;', { filename: 'balance-bridge' });

    global.G = {};
    global.PATHS = { qi: { realms: ['Qi Condensation', 'Foundation Establishment'] } };
    global.MAX_MORTAL_REALM_IDX = 8;
    global.TALENT_ELEMENTS = ['fire', 'water', 'wood', 'metal', 'earth'];
    global.SPIRIT_CLASSICAL_ELEMENTS = global.TALENT_ELEMENTS;
    global.addLog = () => {};
    global.fullRender = () => {};
    global.advanceTime = () => true;
    global.getEffectiveRealmTier = () => global.G.realmIdx || 0;
    global.getFocusTrack = () => 'dantian';
    global.getTrackRealmIdx = () => global.G.realmIdx || 0;
    global.getEffectiveFoundation = () => 0;
    global.getMeridianOpenCount = () => 0;
    global.getPlayerTraitMultPct = () => 1;
    global.getSectCultivationMult = () => 1;
    global.getFactionCultivateMult = () => 1;
    global.getLegacyCultivateBonusMult = () => 1;
    global.getCultivationMethodGatherMult = () => 1;
    global.getResidenceFormationCultivateMult = () => 1;
    global.getGearBonuses = () => ({});
    global.getScarDown = () => 0;
    global.applyVitalityToMaxHp = () => {};
    global.applySectCultivateBuildingEffects = () => [];
    global.getLegacyPathForTrack = () => 'qi';
    global.getEffectiveMaxHp = () => global.G.maxHp || 100;
    global.isTimePlaybackActive = () => false;
    global.isTribulationActive = () => false;
    global.ensureCultivationMethodState = () => {
        if (!global.G.cultivationMethod) global.G.cultivationMethod = { primaryId: 'basic_meditation_breath', studiedScrolls: [] };
    };
    global.getCultivationMethodDef = () => null;
    global.BARE_CIRCULATION_METHOD_IDS = new Set(['basic_meditation_breath']);

    global.getMaxQi = function getMaxQi() {
        const b = QI_BALANCE;
        const base = b.maxQiBase + (global.G.realmIdx || 0) * b.maxQiPerRealm;
        return Math.max(5, base + (global.G.maxQiBonus || 0));
    };
    global.clampCurrentQi = () => {};
    global.getQiDensity = () => (global.G.qiDensity || 0) + global.QI_BALANCE.densityBase;

    vm.runInThisContext(fs.readFileSync(path.join(root, 'talent.js'), 'utf8'), { filename: 'talent.js' });
    vm.runInThisContext(fs.readFileSync(path.join(root, 'passive-cultivation.js'), 'utf8'), { filename: 'passive-cultivation.js' });
    vm.runInThisContext(fs.readFileSync(path.join(root, 'seclusion-project.js'), 'utf8'), { filename: 'seclusion-project.js' });

    const bandSrc = `
const QC_BAND_STAGES = ['early', 'mid', 'late', 'peak'];
const QC_BAND_LABELS = { early: 'Early', mid: 'Mid', late: 'Late', peak: 'Peak' };
const QC_BAND_THRESHOLDS = ${JSON.stringify(THRESHOLDS)};
const QC_BAND_CAPACITY_BONUS = { mid: 4, late: 6, peak: 8 };

function ensureQcDepthState() {
    if (!G.qcBand) {
        G.qcBand = { stage: 'early', gatherProgress: 0, capacityGranted: { mid: false, late: false, peak: false } };
    }
    if (!G.qcBand.capacityGranted) G.qcBand.capacityGranted = { mid: false, late: false, peak: false };
    if (!G.dwelling) G.dwelling = { mode: 'homeless', settlementId: null, rentPaidThroughMonth: 0 };
}

function isQiCondensationRealm() {
    if (typeof getFocusTrack === 'function') {
        if (getFocusTrack() !== 'dantian') return false;
        return typeof getTrackRealmIdx === 'function' ? getTrackRealmIdx('dantian') === 0 : (G.realmIdx || 0) === 0;
    }
    if (G.path === 'body' || G.path === 'soul') return false;
    return (G.realmIdx || 0) === 0;
}

function getQcBandStage() {
    ensureQcDepthState();
    if (!isQiCondensationRealm()) return null;
    return G.qcBand.stage || 'early';
}

function hasQcBandBreakthroughReady() {
    const stage = getQcBandStage();
    return stage === 'late' || stage === 'peak';
}

function maybeAdvanceQcBand() {
    ensureQcDepthState();
    const prog = G.qcBand.gatherProgress || 0;
    const order = QC_BAND_STAGES;
    let stage = G.qcBand.stage || 'early';
    let advanced = null;
    const tryEnter = (next) => {
        if (order.indexOf(stage) >= order.indexOf(next)) return;
        if (prog < QC_BAND_THRESHOLDS[next]) return;
        stage = next;
        advanced = next;
    };
    tryEnter('mid');
    tryEnter('late');
    tryEnter('peak');
    G.qcBand.stage = stage;
    return advanced;
}

function applyQcGatherBandProgress(amount) {
    if (!isQiCondensationRealm()) return null;
    ensureQcDepthState();
    const base = amount != null ? amount : 0;
    const gain = Math.max(0.5, Number(base) || 0);
    G.qcBand.gatherProgress = (G.qcBand.gatherProgress || 0) + gain;
    return maybeAdvanceQcBand();
}
`;
    vm.runInThisContext(bandSrc, { filename: 'qc-band-extract.js' });

    vm.runInThisContext(fs.readFileSync(path.join(root, 'actions.js'), 'utf8'), { filename: 'actions.js' });
}

function freshPlayer(gradeId, dwellingMode) {
    G = global.G = {
        path: 'qi',
        realmIdx: 0,
        ageMonths: START_AGE_MONTHS,
        lifespanMonths: LIFESPAN_QC_MONTHS,
        qi: 10,
        qiDensity: 0,
        maxQiBonus: 0,
        vitality: 10,
        spirit: 10,
        will: 10,
        hp: 100,
        maxHp: 100,
        meridians: [],
        dwelling: { mode: dwellingMode || 'homeless' },
        cultivationMethod: { primaryId: 'basic_meditation_breath', studiedScrolls: [] },
        methodShelf: {},
        passiveCultivation: { weeksCirculated: 0, focusedSessions: 0 },
        gameOver: false,
        inCombat: false,
        disciples: []
    };
    G.talent = buildSpiritRoot({
        composition: 'pentamixed',
        grade: gradeId,
        elements: ['fire', 'water', 'wood', 'metal', 'earth']
    });
    ensureQcDepthState();
    return G;
}

function yearsRemainingMonths() {
    return Math.max(0, G.lifespanMonths - G.ageMonths);
}

function yearsRemainingYears() {
    return Math.floor(yearsRemainingMonths() / 12);
}

function stageReached(thresholdKey) {
    const order = ['early', 'mid', 'late', 'peak'];
    const cur = G.qcBand.stage || 'early';
    const target = thresholdKey === 'mid' ? 'mid' : thresholdKey === 'late' ? 'late' : 'peak';
    return order.indexOf(cur) >= order.indexOf(target);
}

function simulateSeclusionYears(gradeId, years) {
    freshPlayer(gradeId);
    const restoreRandom = installDeterministicRandom();
    for (let y = 0; y < years; y++) {
        applySeclusionYearGains();
        G.ageMonths += 12;
        if (G.ageMonths >= G.lifespanMonths) break;
    }
    restoreRandom();
    return {
        gradeId,
        lifestyle: 'seclusion',
        gatherProgress: G.qcBand.gatherProgress || 0,
        stage: G.qcBand.stage,
        ageYears: Math.round((G.ageMonths / 12) * 10) / 10,
        yearsLeft: yearsRemainingYears(),
        qiDensity: Math.round((G.qiDensity || 0) * 100) / 100,
        feEligible: hasQcBandBreakthroughReady()
    };
}

function simulateUntilMilestone(lifestyle, gradeId, milestone) {
    freshPlayer(gradeId);
    const restoreRandom = installDeterministicRandom();
    const target = THRESHOLDS[milestone];
    let guard = 0;

    const stepPassiveWeek = () => {
        tickPassiveCultivationWeek();
        G.ageMonths += 0.25;
    };
    const stepFocusedMonth = () => {
        runFocusedCultivateSession({ logPrefix: 'focused' });
        G.ageMonths += 1;
    };
    const stepChamberWeek = () => {
        const cultMult = typeof getCombinedCultivateMult === 'function' ? getCombinedCultivateMult() : 1;
        const cfg = CHAMBER_BALANCE.gatherQi;
        const densGainRaw = cfg.densityGainMin + 0.5 * (cfg.densityGainMax - cfg.densityGainMin);
        G.qiDensity = (G.qiDensity || 0) + Math.round(densGainRaw * cultMult * 100) / 100;
        const fillGain = Math.max(1, Math.floor(getMaxQi() * cfg.fillRatio * cultMult));
        G.qi = Math.min(getMaxQi(), (G.qi || 0) + fillGain);
        applyQcGatherBandProgress(getChamberGatherProgressUnits());
        G.ageMonths += 0.25;
    };
    const stepSeclusionYear = () => {
        applySeclusionYearGains();
        G.ageMonths += 12;
    };

    const step = {
        passive: stepPassiveWeek,
        focused: stepFocusedMonth,
        chamber: stepChamberWeek,
        seclusion: stepSeclusionYear
    }[lifestyle];

    if (!step) throw new Error(`unknown lifestyle ${lifestyle}`);

    while ((G.qcBand.gatherProgress || 0) < target && G.ageMonths < START_AGE_MONTHS + MAX_SIM_MONTHS && guard++ < 500000) {
        step();
        if (G.ageMonths >= G.lifespanMonths) break;
    }
    restoreRandom();

    const hit = (G.qcBand.gatherProgress || 0) >= target || stageReached(milestone);
    return {
        gradeId,
        lifestyle,
        milestone,
        hit,
        gatherProgress: Math.round((G.qcBand.gatherProgress || 0) * 100) / 100,
        stage: G.qcBand.stage,
        ageYears: Math.round((G.ageMonths / 12) * 10) / 10,
        yearsLeft: yearsRemainingYears(),
        qiDensity: Math.round((G.qiDensity || 0) * 100) / 100,
        monthsSimulated: Math.round((G.ageMonths - START_AGE_MONTHS) * 100) / 100,
        feEligible: hasQcBandBreakthroughReady()
    };
}

function unitsPerMonth(lifestyle, gradeId) {
    freshPlayer(gradeId);
    if (lifestyle === 'passive') return getPassiveGatherUnits() * 4;
    if (lifestyle === 'focused') return getFocusedGatherUnits();
    if (lifestyle === 'chamber') return getChamberGatherProgressUnits() * 4;
    if (lifestyle === 'seclusion') return 0;
    return 0;
}

function simulateNpcMonths(months, growthRate, breakthroughChance, seed) {
    let rng = seed;
    const rand = () => {
        rng = (rng * 1103515245 + 12345) & 0x7fffffff;
        return rng / 0x7fffffff;
    };
    const base = NPC_ECOSYSTEM.growthMonthsPerBreakthrough;
    let realmIdx = 0;
    let growthProgress = 0;
    let ageMonths = START_AGE_MONTHS;
    const lifespanMonths = LIFESPAN_BY_REALM[0] * 12;
    let effective = 0;
    let remaining = months;
    while (remaining > 0 && ageMonths < lifespanMonths) {
        const alive = Math.max(0, lifespanMonths - ageMonths);
        const chunk = Math.min(remaining, alive);
        if (chunk <= 0) break;
        ageMonths += chunk;
        effective += chunk;
        growthProgress += chunk * growthRate;
        while (growthProgress >= base && realmIdx < 1) {
            growthProgress -= base;
            if (rand() < breakthroughChance) realmIdx += 1;
        }
        remaining -= chunk;
    }
    return { realmIdx, ageMonths, effectiveMonths: effective, growthProgress };
}

function comparePassiveBatchVsStepped(gradeId) {
    freshPlayer(gradeId);
    const restoreRandom = installDeterministicRandom();
    tickPassiveCultivationForMonths(12);
    const batchProgress = G.qcBand.gatherProgress;
    const batchWeeks = G.passiveCultivation.weeksCirculated;

    freshPlayer(gradeId);
    installDeterministicRandom();
    for (let i = 0; i < 48; i++) tickPassiveCultivationWeek();
    const steppedProgress = G.qcBand.gatherProgress;
    const steppedWeeks = G.passiveCultivation.weeksCirculated;
    restoreRandom();
    return { batchProgress, steppedProgress, batchWeeks, steppedWeeks };
}

// --- Load runtime ---
loadCultivationRuntime();

// --- Sanity: spirit root mults feed both gather and session paths ---
{
    freshPlayer('inferior');
    const infCult = getCombinedCultivateMult();
    const infGather = getTalentGatherMult();
    freshPlayer('superior');
    const supCult = getCombinedCultivateMult();
    const supGather = getTalentGatherMult();
    if (!(supCult > infCult && supGather > infGather)) {
        fail('superior root should beat inferior on cultivate + gather mults');
    } else ok('spirit root mult ordering (inferior vs superior)');
}

// --- Batch vs stepped passive ---
{
    const { batchProgress, steppedProgress, batchWeeks, steppedWeeks } = comparePassiveBatchVsStepped('common');
    if (batchWeeks !== 48 || steppedWeeks !== 48) fail(`passive week count batch=${batchWeeks} stepped=${steppedWeeks}`);
    else if (Math.abs(batchProgress - steppedProgress) > 1e-6) fail(`passive progress batch=${batchProgress} stepped=${steppedProgress}`);
    else ok('passive batch (12mo) matches 48 weekly ticks');
}

// --- Measure progression table ---
console.log('\n=== Stage 3A baseline scenario ===');
console.log('pentamixed composition · bare breath · homeless · no sect/faction/formations · QC realm 0 · start age 16 · lifespan 80y\n');

const lifestyles = ['passive', 'focused', 'chamber', 'seclusion'];
const milestones = ['mid', 'late', 'peak'];

console.log('--- QC gather-units per month (theory from live functions) ---');
console.log('grade\tpassive\tfocused\tchamber\tseclusion');
for (const g of GRADES) {
    const row = lifestyles.map(l => unitsPerMonth(l, g).toFixed(3));
    console.log(`${g}\t${row.join('\t')}`);
}

console.log('\n--- Months to QC milestones (band gather; seclusion band N/A) ---');
for (const milestone of milestones) {
    console.log(`\n>> ${milestone.toUpperCase()} (threshold ${THRESHOLDS[milestone]} units)`);
    console.log('grade\tlifestyle\tmonths\tage\tyears_left\tstage\tfe_eligible\tdensity');
    for (const g of GRADES) {
        for (const life of lifestyles) {
            if (life === 'seclusion') {
                continue;
            }
            const r = simulateUntilMilestone(life, g, milestone);
            console.log(`${g}\t${life}\t${r.monthsSimulated.toFixed(1)}\t${r.ageYears}\t${r.yearsLeft}\t${r.stage}\t${r.feEligible}\t${r.qiDensity}`);
        }
    }
}

console.log('\n--- Seclusion (no QC band progress): qi density after N years ---');
console.log('grade\tyears\tage\tyears_left\tgather\tstage\tdensity\tfe_eligible');
for (const g of GRADES) {
    for (const years of [10, 20, 40]) {
        const r = simulateSeclusionYears(g, years);
        console.log(`${g}\t${years}\t${r.ageYears}\t${r.yearsLeft}\t${r.gatherProgress}\t${r.stage}\t${r.qiDensity}\t${r.feEligible}`);
    }
}

console.log('\n--- Relative efficiency vs passive (inferior, units/month) ---');
{
    freshPlayer('inferior');
    const passiveU = getPassiveGatherUnits() * 4;
    const focusedU = getFocusedGatherUnits();
    const chamberU = getChamberGatherProgressUnits() * 4;
    console.log(`passive baseline: ${passiveU.toFixed(4)} units/mo`);
    console.log(`focused: ${focusedU.toFixed(4)} (${(focusedU / passiveU).toFixed(2)}×)`);
    console.log(`chamber gather: ${chamberU.toFixed(4)} (${(chamberU / passiveU).toFixed(2)}× passive)`);
    console.log(`seclusion: 0 band units/mo; qi session uses extraMult 0.22 only (no yieldScale)`);
}

console.log('\n--- NPC wanderer vs player passive (inferior, 480 mo / 40y alive time) ---');
{
    const role = NPC_ROLES.wanderer;
    const npc = simulateNpcMonths(480, role.growthRate, role.breakthroughChance, 42);
    freshPlayer('inferior');
    const restoreRandom = installDeterministicRandom();
    for (let i = 0; i < 480 * 4; i++) tickPassiveCultivationWeek();
    restoreRandom();
    console.log(`player QC gather after 40y passive: ${G.qcBand.gatherProgress.toFixed(1)} units, stage=${G.qcBand.stage}, FE-ready=${hasQcBandBreakthroughReady()}`);
    console.log(`NPC wanderer after 40y: realmIdx=${npc.realmIdx} (QC depth not modeled), growthProgress remainder=${npc.growthProgress.toFixed(0)} / ${NPC_ECOSYSTEM.growthMonthsPerBreakthrough}`);
}

console.log('\n--- Formula notes (audit) ---');
console.log('- Passive: band += getPassiveGatherUnits()/wk; qi += runCultivateSession(yieldScale=0.055×support)');
console.log('- Focused: band += getFocusedGatherUnits(); qi += runCultivateSession(yieldScale=0.82×focusedSupport); advanceTime skips passive batch');
console.log('- Chamber: band += getChamberGatherProgressUnits() (= focusedUnits/4); separate CHAMBER_BALANCE density/fill');
console.log('- Seclusion: runCultivateSession(extraMult=0.22) per year only — no applyQcGatherBandProgress');
console.log('- Spirit root: getTalentGatherMult delegates to getTalentCultivateMult when talent.js loaded (grade × composition speed)');

if (failed) {
    console.error(`\n${failed} check(s) failed.`);
    process.exit(1);
}
console.log('\nCultivation progression audit complete (measurement only).');
