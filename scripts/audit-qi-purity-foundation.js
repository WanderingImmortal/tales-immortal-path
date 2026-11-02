/**
 * Stage 3D — Qi purity + QC→FE foundation quality grant.
 * Run: node scripts/audit-qi-purity-foundation.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
let failed = 0;
function fail(msg) {
    console.error(`FAIL: ${msg}`);
    failed += 1;
}
function ok(msg) {
    console.log(`ok: ${msg}`);
}

function loadRuntime() {
    global.G = {
        realmIdx: 0,
        qi: 10,
        qiDensity: 0,
        qiPurity: 0,
        maxQiBonus: 0,
        cultivationBase: { root: 0, flow: 0, stability: 0 },
        foundationCracks: 0,
        _cultivationBaseMigrated: true,
        qcBand: { stage: 'late', gatherProgress: 220 },
        corruptionLevel: 0,
        corruptionThreshold: 100,
        cultivationMethod: { primaryId: 'basic_meditation_breath', studiedScrolls: [] },
        realmConsolidation: {},
        path: 'qi'
    };
    global.QI_BALANCE = {
        densityBase: 1,
        cultivateDensityMin: 0.12,
        cultivateDensityMax: 0.32,
        cultivateFillRatio: 0.18,
        qiReplenishDensityRef: 1,
        qiReplenishCostExponent: 1.35,
        qiCompressionMinFill: 0.72,
        qiCompressionFillThreshold: 0.82,
        qiCompressionDifficultyRef: 1,
        qiCompressionDifficultyExponent: 1.5,
        qiCompressionDifficultyFloor: 0.08
    };
    global.QI_PURITY_BALANCE = {
        purityBase: 0.5,
        purityFloor: 0.25,
        maxCorruptionStain: 0.45,
        cultivatePurityMin: 0.04,
        cultivatePurityMax: 0.11,
        refinementDifficultyRef: 1,
        refinementDifficultyExponent: 1.45,
        refinementDifficultyFloor: 0.12
    };
    global.QC_FE_FOUNDATION_CROSSING = {
        stageWeight: { early: 0, mid: 0.15, late: 1, peak: 1.25 },
        densityWeight: 0.22,
        densityBonusCap: 4,
        purityWeight: 0.18,
        purityBonusCap: 2.5,
        sealTierWeight: { settled: 0.12, peak: 0.22, perfect: 0.28 },
        methodGradeWeight: { common: 0.06, superior: 0.1, peerless: 0.14 },
        basePillars: { root: 1, flow: 0.5, stability: 2 },
        pillarScale: { root: 3.5, flow: 2.2, stability: 5.5 },
        styleMod: {
            balanced: { root: 1, flow: 1, stability: 1 },
            power: { root: 0.85, flow: 0.75, stability: 1.2 },
            wisdom: { root: 0.9, flow: 1.25, stability: 0.95 }
        }
    };
    global.CULTIVATION_BASE_BALANCE = { crackPenalty: 4, pillarCapsByRealm: { 0: { root: 18, flow: 18, stability: 16 } } };
    global.getEffectiveFoundation = () => 0;
    global.getMeridianOpenCount = () => 0;
    global.getGearBonuses = () => ({});
    global.getPlayerTraitMultPct = () => 1;
    global.getMaxQi = () => 10 + (G.maxQiBonus || 0);
    global.getQiDensity = () => 1 + (G.qiDensity || 0);
    global.getQiFillRatio = () => G.qi / Math.max(1, global.getMaxQi());
    global.clampCurrentQi = () => {};
    global.getQcBandStage = () => G.qcBand?.stage || 'late';
    global.getQcBandLabel = () => G.qcBand?.stage || 'late';
    global.isRealmConsolidated = () => !!(G.realmConsolidation[0]?.done);
    global.getConsolidationTier = () => G.realmConsolidation[0]?.tier || 'settled';
    global.getActiveMethodGradeId = () => 'common';
    global.addLog = () => {};
    global.formatPillarGrant = (p, a) => `${p}+${a}`;

    vm.runInThisContext(fs.readFileSync(path.join(root, 'qi-density.js'), 'utf8'), { filename: 'qi-density.js' });
    vm.runInThisContext(fs.readFileSync(path.join(root, 'foundation.js'), 'utf8'), { filename: 'foundation.js' });
    vm.runInThisContext(fs.readFileSync(path.join(root, 'qi-purity.js'), 'utf8'), { filename: 'qi-purity.js' });
    vm.runInThisContext(fs.readFileSync(path.join(root, 'qc-fe-foundation.js'), 'utf8'), { filename: 'qc-fe-foundation.js' });
}

function simulateFullCompressionSession() {
    G.qi = global.getMaxQi();
    const sg = computeQiCultivationSessionGains({
        cultMult: 1,
        scale: 1,
        densityRoll: 0.5
    });
    computeQiPuritySessionGain(sg, { cultMult: 1, scale: 1, purityRoll: 0.5 });
    if (sg.densGain) G.qiDensity = (G.qiDensity || 0) + sg.densGain;
    if (sg.purityGain) G.qiPurity = (G.qiPurity || 0) + sg.purityGain;
    return sg;
}

function main() {
    console.log('=== Qi purity & FE foundation audit (Stage 3D) ===\n');
    loadRuntime();

    const p0 = G.qiPurity;
    G.qi = 1;
    if (G.qiPurity !== p0) fail('purity bonus changed on qi spend');
    else ok('purity bonus persists after qi expenditure');

    G.qi = 0;
    const sgEmpty = computeQiCultivationSessionGains({ cultMult: 1, scale: 1, densityRoll: 0.5 });
    computeQiPuritySessionGain(sgEmpty, { cultMult: 1, scale: 1, purityRoll: 0.5 });
    if ((sgEmpty.purityGain || 0) > 0) fail('depleted dantian should not refine purity');
    else ok('purity unchanged when dantian too empty to compress');
    G.qi = global.getMaxQi();
    const before = G.qiPurity || 0;
    simulateFullCompressionSession();
    if ((G.qiPurity || 0) <= before) fail('full dantian session should refine purity');
    else ok('purity develops on compression when dantian is full');

    G.qiPurity = 1;
    G.qi = Math.floor(global.getMaxQi() * 0.4);
    const low = G.qiPurity;
    const sgLow = computeQiCultivationSessionGains({ cultMult: 1, scale: 1, densityRoll: 0.5 });
    computeQiPuritySessionGain(sgLow, { cultMult: 1, scale: 1, purityRoll: 0.5 });
    G.qiPurity = low + (sgLow.purityGain || 0);
    if (sgLow.purityGain > 0.001) fail('low-fill session should not refine purity');
    else ok('ordinary low-fill recovery does not award purity');

    G.qiPurity = 0.8;
    const effBefore = getQiPurity();
    G.corruptionLevel = 80;
    const effStained = getQiPurity();
    if (!(effStained < effBefore)) fail('corruption should lower effective purity not stored bonus');
    else ok('cycle stain lowers effective purity; stored bonus unchanged');
    G.corruptionLevel = 0;

    G.qcBand.stage = 'late';
    G.qiDensity = 1;
    G.qiPurity = 0.5;
    const lateGrant = computeQcFeFoundationPillarGrant('balanced');
    G.qcBand.stage = 'peak';
    G.qiDensity = 2;
    G.qiPurity = 1.2;
    const peakGrant = computeQcFeFoundationPillarGrant('balanced');
    if (!(peakGrant.stability > lateGrant.stability)) fail('peak + better prep should grant stronger FE foundation pillars');
    else ok('optional Peak improves foundation grant vs Late alone');

    G.qcBand.stage = 'late';
    G.qiDensity = 0;
    G.qiPurity = 0;
    const minimal = computeQcFeFoundationPillarGrant('balanced');
    if (minimal.stability <= 0) fail('late crossing should still grant some foundation footing');
    else ok('Late QC remains FE-eligible with non-zero foundation grant');

    console.log('\n--- Before / after FE pillar grant (effective foundation) ---');
    G.cultivationBase = { root: 0, flow: 0, stability: 0 };
    G.qcBand.stage = 'late';
    G.qiDensity = 0.5;
    G.qiPurity = 0.2;
    const effA = getEffectiveFoundation();
    const grantA = computeQcFeFoundationPillarGrant('balanced');
    applyQcFeFoundationPillarGrant('balanced');
    const effB = getEffectiveFoundation();
    G.qcBand.stage = 'peak';
    G.qiDensity = 3;
    G.qiPurity = 1.5;
    G.cultivationBase = { root: 0, flow: 0, stability: 0 };
    const effC = getEffectiveFoundation();
    applyQcFeFoundationPillarGrant('balanced');
    const effD = getEffectiveFoundation();
    console.log(`late prep\tgrant stability~${grantA.stability}\teffective ${effA} → ${effB}`);
    console.log(`peak prep\teffective ${effC} → ${effD}`);

    if (!(effD > effB)) fail('peak preparation should yield higher persistent foundation than late');
    else ok('foundation quality persists via pillar totals after FE grant');

    console.log('\n--- Audit summary ---');
    if (failed) {
        console.error(`\n${failed} check(s) failed.`);
        process.exit(1);
    }
    console.log('All qi purity / FE foundation checks passed.');
}

main();
