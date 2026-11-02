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

function getChamberRefillGain(lockedBonus) {
    G.qiDensity = lockedBonus;
    const cfg = CHAMBER_BALANCE.gatherQi;
    return computeQiCultivationSessionGains({
        cultMult: 1,
        scale: 1,
        densityMin: cfg.densityGainMin,
        densityMax: cfg.densityGainMax,
        fillRatio: cfg.fillRatio,
        densityRoll: 0.5
    }).fillGain;
}

/**
 * Simulate weekly chamber gather from startQiPct → 100%.
 * @param {number} establishedBonus G.qiDensity locked for the run (refill-only measurement)
 */
function simulateRefillWeeks(establishedBonus, startQiPct) {
    G.qiDensity = establishedBonus;
    G.qi = Math.floor(getMaxQi() * startQiPct);
    clampCurrentQi();
    const cap = getMaxQi();
    const fillPerWeek = getChamberRefillGain(establishedBonus);
    const fillRaw = (cap * CHAMBER_BALANCE.gatherQi.fillRatio) / getQiReplenishEffortMult();
    const hitMinFloor = fillPerWeek <= 1 && fillRaw < 1;
    let weeks = 0;
    const maxWeeks = 50000;
    while (G.qi < cap && weeks < maxWeeks) {
        G.qi = Math.min(cap, G.qi + fillPerWeek);
        weeks += 1;
    }
    const completed = G.qi >= cap;
    const theoreticalWeeks = Math.ceil(cap / Math.max(fillRaw, 1e-6));
    return {
        weeks,
        completed,
        cappedByLimit: !completed && weeks >= maxWeeks,
        fillPerWeek,
        fillRaw: Math.round(fillRaw * 1000) / 1000,
        theoreticalWeeks,
        hitMinFloor
    };
}

function totalDensityFromBonus(bonus) {
    return Math.round((QI_BALANCE.densityBase + bonus) * 100) / 100;
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
    runCultivateSession({ yieldScale: 1, cultMult: 1 });
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

    G.qiDensity = 1;
    G.qi = getMaxQi();
    const loopStart = G.qiDensity;
    for (let i = 0; i < 40; i++) {
        G.qi = Math.max(1, Math.floor(getMaxQi() * 0.35));
        runCultivateSession({ yieldScale: 1, cultMult: 1 });
    }
    if (G.qiDensity > loopStart + 0.02) fail('spend/refill loop below compression threshold raised density');
    else ok('repeated spend + low-fill replenish does not rapidly increase density');

    G.qiDensity = 0;
    G.qi = Math.floor(getMaxQi() * 0.5);
    const midBonus = G.qiDensity;
    for (let i = 0; i < 8; i++) {
        G.qi = Math.max(1, G.qi - 3);
        runCultivateSession({ yieldScale: 0.5, cultMult: 1 });
    }
    if (G.qiDensity > midBonus + 0.05) fail('ordinary low-fill recovery loop raised density');
    else ok('ordinary recovery does not spam density increases');

    G.qi = 0;
    G.qiDensity = 2.5;
    const persistBonus = G.qiDensity;
    runCultivateSession({ yieldScale: 1, cultMult: 1 });
    if (G.qiDensity !== persistBonus) fail('established bonus changed after full depletion recovery');
    else ok('density persists after complete depletion and recovery');

    if (G.qcBand) G.qcBand.stage = 'mid';
    runCultivateSession({ yieldScale: 1, cultMult: 1 });
    if (G.qcBand.stage !== 'mid') fail('cultivation session regressed qc band stage');
    else ok('qi expenditure / recovery does not regress cultivation stage');

    G.qiDensity = 0;
    const mult1 = getQiReplenishEffortMult();
    G.qiDensity = 2;
    const mult2 = getQiReplenishEffortMult();
    if (!(mult2 > mult1)) fail('replenish effort mult should rise with density');
    else ok('technique modifiers path intact (replenish mult scales with density)');

    console.log('\n--- Recovery measurements (chamber gather, 0% → 100%) ---');
    console.log('Note: no 50-week test cap (limit is 50000). Equal weeks at high density usually means min 1 Qi/week floor.');
    G.maxQiBonus = 490;
    const cap = getMaxQi();
    const densityTargets = [1, 2, 3, 5, 10];
    console.log(`dantianCap=${cap}\ttotalDensity\treplenishMult\tfillRaw/wk\tfillActual/wk\tminFloor\tweeks\tcompleted\tcapped`);
    densityTargets.forEach(total => {
        const bonus = total - QI_BALANCE.densityBase;
        G.qiDensity = bonus;
        const mult = getQiReplenishEffortMult();
        const r = simulateRefillWeeks(bonus, 0);
        console.log([
            cap,
            total.toFixed(2),
            mult.toFixed(2),
            r.fillRaw,
            r.fillPerWeek,
            r.hitMinFloor ? 'yes' : 'no',
            r.weeks,
            r.completed ? 'yes' : 'no',
            r.cappedByLimit ? 'yes' : 'no'
        ].join('\t'));
        if (!r.completed) fail(`recovery sim did not reach 100% at density ${total} (weeks=${r.weeks})`);
    });
    G.maxQiBonus = 0;

    console.log('\n--- Small dantian (cap=50) — shows min-fill floor collapsing distinct times ---');
    G.maxQiBonus = 40;
    [3, 5].forEach(total => {
        const bonus = total - 1;
        const r = simulateRefillWeeks(bonus, 0);
        console.log(`total~${total}\tweeks=${r.weeks}\tfill/wk=${r.fillPerWeek}\tminFloor=${r.hitMinFloor}\tcompleted=${r.completed}`);
    });
    G.maxQiBonus = 0;

    G.qiDensity = 0;
    G.qi = 0;
    const pillBase = Math.floor(getMaxQi() * 0.25);
    const pillLow = applyQiReplenishAmount(pillBase);
    G.qiDensity = 3;
    const pillHigh = applyQiReplenishAmount(pillBase);
    if (!(pillHigh < pillLow)) fail('spirit pill refill should respect density cost');
    else ok('spirit gathering pill refill respects density cost (no free bypass)');

    console.log('\n--- Recovery bypass inventory (report only; intentional power stays) ---');
    const bypassNotes = [
        'qi_restore pill — sets G.qi = getMaxQi() (full bypass; premium item)',
        'meridian_soothing — flat +4+realmIdx Qi (no density cost)',
        'foundation_stabilizing — flat +3 Qi (no density cost)',
        'consolidation / seal — often G.qi = getMaxQi() (capstone refill)',
        'combat end-of-turn — getCombatResourceRegenGain() adds flat Qi/Breath (no density cost)',
        'Meridian Flow / technique refunds — combat-local, not cultivation recovery',
        'spirit_gathering pill — refill via applyQiReplenishAmount; density line separate',
        'QC store pills (Driftburst…) — band progress in QC; %Qi fallback without density cost',
        'Body chamber +2 Qi, meridian open +3 — small flat grants',
        'world effects / tribulation — assorted flat +/- Qi'
    ];
    bypassNotes.forEach(line => console.log(`· ${line}`));

    console.log('\n--- Audit summary ---');
    if (failed) {
        console.error(`\n${failed} check(s) failed.`);
        process.exit(1);
    }
    console.log('All qi density recovery checks passed.');
}

main();
