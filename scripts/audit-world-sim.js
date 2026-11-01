/**
 * Stage 2 world simulation consistency audit (no DOM).
 * Run: node scripts/audit-world-sim.js
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

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function loadWorldScheduler() {
    const ctx = vm.createContext({
        G: {
            ageMonths: 0,
            worldSchedule: [],
            worldChronicle: [],
            worldNpcs: []
        },
        WORLD_TIME_BALANCE: { chronicleMaxEntries: 80, chronicleSummaryMax: 3 },
        addLog: () => {},
        console
    });
    const src = fs.readFileSync(path.join(root, 'world-scheduler.js'), 'utf8');
    vm.runInContext(src, ctx, { filename: 'world-scheduler.js' });
    return ctx;
}

function bindSchedulerApi(ctx) {
    global.G = ctx.G;
    global.processWorldTime = (...args) => ctx.processWorldTime(...args);
    global.registerWorldEventHandler = (...args) => ctx.registerWorldEventHandler(...args);
    global.registerWorldTick = (...args) => ctx.registerWorldTick(...args);
    global.scheduleWorldEvent = (...args) => ctx.scheduleWorldEvent(...args);
}

/** Minimal NPC growth mirror (world.js rules) for death-cap tests. */
function tickNpcGrowthModel(npc, monthsPassed, lifespanMonths, useDeathCap) {
    if (!npc.alive) return;
    let effective = monthsPassed;
    if (useDeathCap) {
        effective = Math.min(monthsPassed, Math.max(0, lifespanMonths - npc.ageMonths));
    }
    if (effective <= 0) return;
    npc.ageMonths += effective;
    npc.growthProgress = (npc.growthProgress || 0) + effective;
    if (npc.ageMonths >= lifespanMonths) npc.alive = false;
}

// --- Test B: scheduled events fire once, at correct age, after ticks for that span ---
{
    bindSchedulerApi(loadWorldScheduler());
    let fireCount = 0;
    let ageAtFire = null;
    let npcAgeAtFire = null;
    registerWorldEventHandler('test_mid', () => {
        fireCount += 1;
        ageAtFire = G.ageMonths;
        npcAgeAtFire = G._npcAge;
    });
    registerWorldTick('test_npc_age', (delta) => {
        G._npcAge = (G._npcAge || 0) + delta;
    }, 1);
    scheduleWorldEvent('test_mid', 50, {}, { id: 'test_mid_50' });

    processWorldTime(0, 100, {});

    if (fireCount !== 1) fail(`scheduled event fired ${fireCount} times (expected 1)`);
    else ok('Test B — event fires exactly once');
    if (ageAtFire !== 50) fail(`event age ${ageAtFire} (expected 50)`);
    else ok('Test B — event at correct simulated date');
    if (npcAgeAtFire !== 50) fail(`npc tick age at event ${npcAgeAtFire} (expected 50 — ticks before handler)`);
    else ok('Test B — world ticks precede event at boundary');
    if (G._npcAge !== 100) fail(`final npc tick sum ${G._npcAge} (expected 100)`);
    else ok('Test B — full interval ticks after event');
}

// --- Test B2: one jump vs stepped jumps (deterministic tick) ---
{
    const run = (mode) => {
        bindSchedulerApi(loadWorldScheduler());
        G._sum = 0;
        registerWorldTick('acc', (delta) => { G._sum += delta; }, 1);
        G.worldSchedule = [];
        scheduleWorldEvent('noop', 50, {}, { id: 'n' });
        registerWorldEventHandler('noop', () => {});
        if (mode === 'batch') processWorldTime(0, 12, {});
        else if (mode === 'monthly') {
            for (let i = 0; i < 12; i++) processWorldTime(i, i + 1, {});
        } else if (mode === 'weekly') {
            for (let i = 0; i < 48; i++) processWorldTime(i * 0.25, (i + 1) * 0.25, {});
        }
        return G._sum;
    };
    const batch = run('batch');
    const monthly = run('monthly');
    const weekly = run('weekly');
    if (Math.abs(batch - 12) > 1e-6 || Math.abs(monthly - 12) > 1e-6 || Math.abs(weekly - 12) > 1e-6) {
        fail(`Test A delta sums batch=${batch} monthly=${monthly} weekly=${weekly}`);
    } else ok('Test A — batched vs stepped tick totals (deterministic accumulator)');
}

// --- Test C: NPC death caps living progression within skip ---
{
    const lifespan = 100;
    const skip = 60;
    const startAge = 80;
    const withCap = { alive: true, ageMonths: startAge, growthProgress: 0 };
    tickNpcGrowthModel(withCap, skip, lifespan, true);
    const noCap = { alive: true, ageMonths: startAge, growthProgress: 0 };
    tickNpcGrowthModel(noCap, skip, lifespan, false);
    if (withCap.alive || withCap.ageMonths !== lifespan) fail('Test C — capped model should die at lifespan');
    else ok('Test C — death at lifespan');
    if (withCap.growthProgress !== 20) fail(`Test C — capped growth ${withCap.growthProgress} (expected 20 alive months)`);
    else ok('Test C — growth only for alive months in skip');
    if (noCap.growthProgress !== 60) fail('Test C — uncapped model growth 60 documents pre-fix inconsistency');
    else ok('Test C — uncapped skip documents aggregate bug class (model)');

    const npcCtx = vm.createContext({
        G: { worldNpcs: [{ alive: true, ageMonths: 80, growthProgress: 0, realmIdx: 0, role: 'wanderer', zone: 'jade' }] },
        NPC_ECOSYSTEM: { growthMonthsPerBreakthrough: 120, demonicThreatPerGrowth: 2, demonicThreatCap: 24, demonicThreatLogThreshold: 25 },
        NPC_ROLES: { wanderer: { growthRate: 1, breakthroughChance: 0, cultivator: true } },
        LIFESPAN_BY_REALM: [80, 120, 300].map(y => y * 12),
        ZONES: { jade: { name: 'Jade' } },
        addLog: () => {},
        console
    });
    const worldJs = fs.readFileSync(path.join(root, 'world.js'), 'utf8');
    const fnMatch = worldJs.match(/function tickWorldNpcGrowth[\s\S]*?\nfunction tickWorldNpcWander/);
    vm.runInContext(
        'function getWorldNpcMaxRealm() { return 8; }\n'
        + 'function getWorldNpcLifespanMonths() { return 100; }\n'
        + 'function canWorldNpcGrow() { return true; }\n'
        + 'function clampWorldNpcProgress() {}\n'
        + 'function killWorldNpc(npc) { npc.alive = false; }\n'
        + fnMatch[0].replace(/\nfunction tickWorldNpcWander$/, ''),
        npcCtx,
        { filename: 'tickWorldNpcGrowth-extract' }
    );
    npcCtx.tickWorldNpcGrowth(60);
    const npc = npcCtx.G.worldNpcs[0];
    if (npc.alive !== false || npc.growthProgress !== 20) {
        fail(`Test C — world.js tick growth ${npc.growthProgress} alive=${npc.alive}`);
    } else ok('Test C — world.js tickWorldNpcGrowth caps at lifespan');
    npc.alive = false;
    npc.growthProgress = 5;
    npcCtx.tickWorldNpcGrowth(24);
    if (npc.growthProgress !== 5) fail('Test C — dead NPC should not gain progress');
    else ok('Test C — dead NPC does not progress');
}

// --- Test D: order — event handler sees post-tick state at boundary ---
{
    bindSchedulerApi(loadWorldScheduler());
    G._orderLog = [];
    registerWorldTick('log_tick', (delta, from, to) => {
        G._orderLog.push(`tick:${from}->${to}`);
    }, 1);
    scheduleWorldEvent('order', 30, {}, { id: 'ord' });
    registerWorldEventHandler('order', () => {
        G._orderLog.push(`event@${G.ageMonths}`);
    });
    processWorldTime(0, 60, {});
    const expect = ['tick:0->30', 'event@30', 'tick:30->60'];
    if (JSON.stringify(G._orderLog) !== JSON.stringify(expect)) {
        fail(`Test D order ${JSON.stringify(G._orderLog)} expected ${JSON.stringify(expect)}`);
    } else ok('Test D — tick → event → tick order at schedule boundary');
}

// --- Test E: seclusion-style yearly steps vs one jump (world tick sum only) ---
{
    bindSchedulerApi(loadWorldScheduler());
    registerWorldTick('acc', (delta) => { G._sum = (G._sum || 0) + delta; }, 1);
    processWorldTime(0, 60, {});
    const oneJump = G._sum;
    bindSchedulerApi(loadWorldScheduler());
    registerWorldTick('acc', (delta) => { G._sum = (G._sum || 0) + delta; }, 1);
    for (let y = 0; y < 5; y++) processWorldTime(y * 12, (y + 1) * 12, {});
    if (oneJump !== 60 || G._sum !== 60) fail(`Test E seclusion steps sum ${G._sum} vs one jump ${oneJump}`);
    else ok('Test E — multi-year stepped vs single advance (deterministic ticks)');
}

// --- Test F: performance (representative) ---
{
    const perfCtx = loadWorldScheduler();
    bindSchedulerApi(perfCtx);
    perfCtx.NPC_ECOSYSTEM = { growthMonthsPerBreakthrough: 120, demonicThreatPerGrowth: 2, demonicThreatCap: 24, demonicThreatLogThreshold: 25 };
    perfCtx.NPC_ROLES = { wanderer: { growthRate: 1, breakthroughChance: 0, cultivator: true } };
    perfCtx.LIFESPAN_BY_REALM = [80, 120, 300].map(y => y * 12);
    perfCtx.ZONES = { jade: { name: 'Jade' } };
    perfCtx.getWorldNpcMaxRealm = () => 8;
    perfCtx.getWorldNpcLifespanMonths = () => 120 * 12;
    perfCtx.canWorldNpcGrow = () => true;
    perfCtx.clampWorldNpcProgress = () => {};
    perfCtx.tickWorldNpcWander = () => {};
    perfCtx.killWorldNpc = (npc) => { npc.alive = false; };
    G.worldNpcs = Array.from({ length: 80 }, (_, i) => ({
        id: `n${i}`,
        alive: true,
        ageMonths: 200 + i,
        growthProgress: 0,
        realmIdx: 1,
        role: 'wanderer',
        zone: 'jade',
        state: 'persistent'
    }));
    const worldJs = fs.readFileSync(path.join(root, 'world.js'), 'utf8');
    const fnMatch = worldJs.match(/function tickWorldNpcGrowth[\s\S]*?\nfunction tickWorldNpcWander/);
    if (fnMatch) {
        vm.runInContext(fnMatch[0].replace(/\nfunction tickWorldNpcWander$/, ''), perfCtx, { filename: 'tickWorldNpcGrowth-extract' });
        registerWorldTick('worldNpcs', (delta) => perfCtx.tickWorldNpcGrowth(delta), 40);
    }

    const bench = (months, label) => {
        G.ageMonths = 0;
        G.worldSchedule = [];
        const t0 = process.hrtime.bigint();
        processWorldTime(0, months, { quiet: true });
        const ms = Number(process.hrtime.bigint() - t0) / 1e6;
        console.log(`perf: ${label} (${months} mo) ${ms.toFixed(2)} ms`);
        return ms;
    };
    bench(12, '1 year');
    bench(120, '10 years');
    bench(1200, '100 years');
    ok('Test F — performance sampled (see perf lines above)');
}

// --- PR #183 regression: time billing rules still load ---
{
    const rulesSrc = fs.readFileSync(path.join(root, 'advance-time-rules.js'), 'utf8');
    vm.runInThisContext(rulesSrc, { filename: 'advance-time-rules.js' });
    if (resolveBillableAdvanceMonths(6, {}) !== 6) fail('PR183 regression — billing months');
    else ok('PR #183 billing rules unchanged');
}

if (failed) {
    console.error(`\n${failed} world sim check(s) failed.`);
    process.exit(1);
}
console.log('\nAll world simulation audits passed.');
