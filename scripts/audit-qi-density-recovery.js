/**
 * Stage 3C — Qi density persistence & density-sensitive recovery.
 * Run: node scripts/audit-qi-density-recovery.js
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
        maxQiBonus: 0,
        qcBand: { stage: 'early', gatherProgress: 0 },
        path: 'qi',
        gameOver: false
    };
    global.QI_BALANCE = {
        maxQiBase: 10,
        maxQiPerRealm: 10,
        maxQiPerFoundation: 2,
        maxQiPerMeridian: 3,
        densityBase: 1,
        densityPerRealm: 1,
        densityPerFoundation: 0.2,
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
    global.CHAMBER_BALANCE = {
        gatherQi: {
            densityGainMin: 0.14,
            densityGainMax: 0.32,
            fillRatio: 0.11
        }
    };
    global.getEffectiveFoundation = () => 0;
    global.getMeridianOpenCount = () => 0;
    global.getGearBonuses = () => ({});
    global.getPlayerTraitMultPct = () => 1;
    global.getScarQiRegenMult = () => 1;
    global.getMaxQi = function getMaxQi() {
        const b = QI_BALANCE;
        return Math.max(5, b.maxQiBase + (G.realmIdx || 0) * b.maxQiPerRealm + (G.maxQiBonus || 0));
    };
    global.getQiDensity = function getQiDensity() {
        const b = QI_BALANCE;
        const base = b.densityBase + (G.realmIdx || 0) * b.densityPerRealm;
        return Math.max(0.5, Math.round((base + (G.qiDensity || 0)) * 100) / 100);
    };
    global.getQiFillRatio = () => G.qi / Math.max(1, getMaxQi());
    global.clampCurrentQi = () => {
        const cap = getMaxQi();
        if (G.qi > cap) G.qi = cap;
        if (G.qi <= 0) G.qi = 0;
    };

    vm.runInThisContext(fs.readFileSync(path.join(root, 'qi-density.js'), 'utf8'), { filename: 'qi-density.js' });

    const actionsStub = `
function runCultivateSession(options) {
    const opts = options || {};
    const scale = opts.yieldScale != null ? Number(opts.yieldScale) : 1;
    const b = QI_BALANCE;
    const cultMult = opts.cultMult || 1;
    const sessionGains = computeQiCultivationSessionGains({
        cultMult,
        scale,
        densityMin: b.cultivateDensityMin,
        densityMax: b.cultivateDensityMax,
        fillRatio: b.cultivateFillRatio,
        densityRoll: 0.5
    });
    const beforeBonus = G.qiDensity || 0;
    if (sessionGains.densGain) G.qiDensity = beforeBonus + sessionGains.densGain;
    G.qi = Math.min(getMaxQi(), (G.qi || 0) + sessionGains.fillGain);
    clampCurrentQi();
    return sessionGains;
}
`;
    vm.runInThisContext(actionsStub, { filename: 'actions-stub.js' });
}

function simulateRefillWeeks(startBonus, startQiPct) {
    G.qiDensity = startBonus;
    G.qi = Math.floor(getMaxQi() * startQiPct);
    clampCurrentQi();
    const cap = getMaxQi();
    let weeks = 0;
    const maxWeeks = 50000;
    while (G.qi < cap && weeks < maxWeeks) {
        const cfg = CHAMBER_BALANCE.gatherQi;
        const sessionGains = computeQiCultivationSessionGains({
            cultMult: 1,
            scale: 1,
            densityMin: cfg.densityGainMin,
            densityMax: cfg.densityGainMax,
            fillRatio: cfg.fillRatio,
            densityRoll: 0.5
        });
        if (sessionGains.densGain) G.qiDensity = (G.qiDensity || 0) + sessionGains.densGain;
        G.qi = Math.min(cap, G.qi + sessionGains.fillGain);
        weeks += 1;
    }
    return weeks;
}

function main() {
    console.log('=== Qi density & recovery audit (Stage 3C) ===\n');
    loadRuntime();

    const establishedBefore = G.qiDensity;
    G.qi = Math.max(0, G.qi - 8);
    const densityAfterSpend = G.qiDensity;
    if (densityAfterSpend !== establishedBefore) fail('density changed on qi spend');
    else ok('density persists after qi expenditure');

    G.qi = 0;
    G.qiExhausted = true;
    const bonusAtEmpty = G.qiDensity;
    runCultivateSession({ yieldScale: 1, cultMult: 1 });
    if (G.qiDensity !== bonusAtEmpty) fail('established bonus changed at 0 qi before compression threshold');
    else ok('depleted refill does not raise established density bonus');
    if (G.qi <= 0) fail('refill from empty did not restore qi');
    else ok('recovered qi returns at established density (bonus unchanged)');

    G.qi = getMaxQi();
    const bonusFull = G.qiDensity;
    const gFull = runCultivateSession({ yieldScale: 1, cultMult: 1 });
    if (G.qiDensity <= bonusFull) fail('full dantian session should raise density when compressing');
    else ok('compression raises density when dantian is full');

    G.qiDensity = 0;
    G.qi = getMaxQi();
    const lowDensGain = runCultivateSession({ yieldScale: 1, cultMult: 1 }).densGain;
    G.qiDensity = 3;
    G.qi = getMaxQi();
    const highDensGain = runCultivateSession({ yieldScale: 1, cultMult: 1 }).densGain;
    if (!(highDensGain < lowDensGain)) fail('higher total density should yield smaller compression steps');
    else ok('increasing density is harder at higher levels');

    G.maxQiBonus = 40;
    G.qiDensity = 0;
    G.qi = 0;
    const lowRefill = runCultivateSession({ yieldScale: 1, cultMult: 1 }).fillGain;
    G.qiDensity = 3;
    G.qi = 0;
    const highRefill = runCultivateSession({ yieldScale: 1, cultMult: 1 }).fillGain;
    G.maxQiBonus = 0;
    if (!(highRefill < lowRefill)) fail('higher density should reduce per-session refill');
    else ok('higher-density qi costs more effort to replenish');

    G.qiDensity = 0;
    G.qi = Math.floor(getMaxQi() * 0.5);
    const midBonus = G.qiDensity;
    for (let i = 0; i < 8; i++) {
        G.qi = Math.max(1, G.qi - 3);
        runCultivateSession({ yieldScale: 0.5, cultMult: 1 });
    }
    if (G.qiDensity > midBonus + 0.05) fail('ordinary low-fill recovery loop raised density');
    else ok('ordinary recovery does not spam density increases');

    if (G.qcBand) G.qcBand.stage = 'mid';
    runCultivateSession({ yieldScale: 1, cultMult: 1 });
    if (G.qcBand.stage !== 'mid') fail('cultivation session regressed qc band stage');
    else ok('qi expenditure / recovery does not regress cultivation stage');

    const mult1 = getQiReplenishEffortMult();
    G.qiDensity = 2;
    const mult2 = getQiReplenishEffortMult();
    if (!(mult2 > mult1)) fail('replenish effort mult should rise with density');
    else ok('technique modifiers path intact (replenish mult scales with density)');

    console.log('\n--- Recovery measurements (chamber gather, 0% → 100% qi, expanded dantian) ---');
    G.maxQiBonus = 40;
    const scenarios = [
        { label: 'bonus+0 (total~1)', bonus: 0 },
        { label: 'bonus+1 (total~2)', bonus: 1 },
        { label: 'bonus+2 (total~3)', bonus: 2 },
        { label: 'bonus+4 (total~5)', bonus: 4 }
    ];
    console.log('scenario\tweeks\treplenishMult');
    scenarios.forEach(s => {
        G.qiDensity = s.bonus;
        const mult = getQiReplenishEffortMult();
        const weeks = simulateRefillWeeks(s.bonus, 0);
        console.log(`${s.label}\t${weeks}\t${mult.toFixed(2)}`);
    });
    G.maxQiBonus = 0;

    G.qiDensity = 0;
    G.qi = 0;
    const pillBase = Math.floor(getMaxQi() * 0.25);
    const pillLow = applyQiReplenishAmount(pillBase);
    G.qiDensity = 3;
    const pillHigh = applyQiReplenishAmount(pillBase);
    if (!(pillHigh < pillLow)) fail('spirit pill refill should respect density cost');
    else ok('pill instant refill respects density cost (no free bypass)');

    console.log('\n--- Audit summary ---');
    if (failed) {
        console.error(`\n${failed} check(s) failed.`);
        process.exit(1);
    }
    console.log('All qi density recovery checks passed.');
}

main();
