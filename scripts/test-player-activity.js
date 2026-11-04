/**
 * Player activity execution — committed session and repeatable cultivation.
 * Run: node scripts/test-player-activity.js
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

function assert(cond, msg) {
    if (!cond) fail(msg);
    else ok(msg);
}

function boot() {
    const awards = { n: 0, checks: 0 };
    const slices = [];
    const ctx = vm.createContext({
        G: {
            ageMonths: 0,
            lifespanMonths: 100000,
            gameOver: false,
            inCombat: false,
            dwelling: { mode: 'homeless' },
            worldClock: { paused: true, speed: 'normal', project: null, stance: null },
            worldSchedule: [],
            worldChronicle: [],
            playerActivity: null,
            playerActivityLast: null
        },
        WORLD_TIME_BALANCE: { chronicleMaxEntries: 80, chronicleSummaryMax: 3 },
        console,
        Math,
        Number,
        addLog: () => {},
        saveState: () => {},
        setWorldClockPaused: (paused) => { ctx.G.worldClock.paused = !!paused; },
        isWorldClockPlayRequested: () => !ctx.G.worldClock.paused,
        isImmortal: () => false,
        formatYears: () => '0y',
        formatDuration: (m) => `${m} mo`,
        getFocusedCultivateMonths: () => 1,
        finishFocusedCultivateProject: () => { awards.n += 1; },
        applySharedCalendarObligations: () => {
            if (ctx.G._evictAt != null && ctx.G.ageMonths + 1e-9 >= ctx.G._evictAt) {
                ctx.G.dwelling.mode = 'homeless';
            }
            if (ctx.G._fightAt != null && ctx.G.ageMonths + 1e-9 >= ctx.G._fightAt) {
                ctx.G.inCombat = true;
            }
            const month = Math.floor(ctx.G.ageMonths || 0);
            if (ctx.G._rentMark == null) ctx.G._rentMark = 0;
            if (month > ctx.G._rentMark) {
                ctx.G._rentCharges = (ctx.G._rentCharges || 0) + (month - ctx.G._rentMark);
                ctx.G._rentMark = month;
            }
        }
    });
    ctx.awards = awards;
    ctx.slices = slices;
    vm.runInContext(fs.readFileSync(path.join(root, 'world-scheduler.js'), 'utf8'), ctx);
    const realProcess = ctx.processWorldTime;
    ctx.processWorldTime = function (from, to, meta) {
        slices.push(to - from);
        return realProcess(from, to, meta);
    };
    vm.runInContext(fs.readFileSync(path.join(root, 'player-activity.js'), 'utf8'), ctx);
    vm.runInContext(fs.readFileSync(path.join(root, 'time-playback.js'), 'utf8'), ctx);
    return ctx;
}

// 1. Committed action completes after one month, not before.
{
    const ctx = boot();
    ctx.startCommittedFocusedCultivation();
    ctx.advanceTimeQuiet(0.5, 'calendar');
    assert(ctx.awards.n === 0 && ctx.getPlayerActivity(), 'half month does not finish the committed session');
    ctx.advanceTimeQuiet(0.5, 'calendar');
    assert(ctx.awards.n === 1, 'committed session awards once at one month');
    assert(!ctx.getPlayerActivity(), 'completion clears the activity');
    assert(ctx.G.playerActivityLast.status === 'completed', 'completion status is recorded');
    assert(ctx.G.worldClock.paused === true, 'completion pauses the calendar');
    ctx.advanceTimeQuiet(1, 'calendar');
    assert(ctx.awards.n === 1, 'further time does not award the committed session again');
}

// 2–3. Routine repeats until cancelled.
{
    const ctx = boot();
    ctx.G.dwelling.mode = 'owned';
    ctx.startCultivationRoutine();
    ctx.advanceTimeQuiet(3, 'calendar');
    assert(ctx.awards.n === 3, 'routine awards one focused session per month without extra clicks');
    assert(ctx.getPlayerActivity() && ctx.getPlayerActivity().kind === 'routine', 'routine stays authorised');
    ctx.cancelPlayerActivity();
    ctx.advanceTimeQuiet(2, 'calendar');
    assert(ctx.awards.n === 3, 'cancel stops later routine sessions');
    assert(ctx.G.playerActivityLast.status === 'cancelled', 'cancel status is recorded');
}

// 5. Eviction stops the practice before the next award.
{
    const ctx = boot();
    ctx.G.dwelling.mode = 'rent';
    ctx.G._evictAt = 3;
    ctx.startCultivationRoutine();
    assert(ctx.getPlayerActivity().invalidateIfEvicted === true, 'a rented room is part of the activity conditions');
    ctx.advanceTimeQuiet(4, 'calendar');
    assert(ctx.awards.n === 2, 'sessions before eviction are kept; the evicted month is not awarded');
    assert(!ctx.getPlayerActivity(), 'eviction stops the routine');
    assert(ctx.G.playerActivityLast.status === 'blocked', 'eviction is a blocked stop, not a new decision');
}

// Combat interrupts before the payout.
{
    const ctx = boot();
    ctx.G._fightAt = 1;
    ctx.startCommittedFocusedCultivation();
    ctx.advanceTimeQuiet(1, 'calendar');
    assert(ctx.awards.n === 0, 'combat at the deadline prevents the session reward');
    assert(ctx.G.playerActivityLast.status === 'interrupted', 'combat records an interruption');
}

// 6. Scheduled events still fire inside a segmented advance.
{
    const ctx = boot();
    const fired = [];
    ctx.registerWorldEventHandler('ping', (payload) => fired.push({ id: payload.id, age: ctx.G.ageMonths }));
    ctx.scheduleWorldEvent('ping', 3, { id: 'mid' }, { id: 'mid' });
    ctx.G.dwelling.mode = 'owned';
    ctx.startCultivationRoutine();
    ctx.advanceTimeQuiet(4, 'calendar');
    assert(fired.length === 1 && fired[0].id === 'mid' && fired[0].age === 3, 'a world event on a session boundary still fires at that month');
    assert(ctx.G.worldSchedule.length === 0, 'the event is consumed once');
}

// 7. Playback speed does not change rewards. Week steps match one jump for rent marks.
{
    const run = (speed, chunk) => {
        const ctx = boot();
        ctx.G.worldClock.speed = speed;
        ctx.G._rentMark = 0;
        ctx.G._rentCharges = 0;
        ctx.startCommittedFocusedCultivation();
        if (chunk === 1) ctx.advanceTimeQuiet(1, 'calendar');
        else {
            for (let i = 0; i < 4; i++) ctx.advanceTimeQuiet(0.25, 'calendar');
        }
        return { awards: ctx.awards.n, charges: ctx.G._rentCharges, age: ctx.G.ageMonths };
    };
    const slow = run('slow', 1);
    const fast = run('fast', 1);
    const weeks = run('normal', 0.25);
    assert(slow.awards === 1 && fast.awards === 1 && weeks.awards === 1, 'speed and week-sized steps award the session once');
    assert(slow.charges === fast.charges && slow.charges === weeks.charges, 'rent marks match for one jump and four weeks');
}

// 8. Save/load keeps an in-progress routine and does not repeat a finished session.
{
    const ctx = boot();
    ctx.G.dwelling.mode = 'owned';
    ctx.startCultivationRoutine();
    ctx.advanceTimeQuiet(0.4, 'calendar');
    const saved = JSON.parse(JSON.stringify({
        ageMonths: ctx.G.ageMonths,
        playerActivity: ctx.G.playerActivity,
        dwelling: ctx.G.dwelling
    }));
    const loaded = boot();
    loaded.G.ageMonths = saved.ageMonths;
    loaded.G.playerActivity = saved.playerActivity;
    loaded.G.dwelling = saved.dwelling;
    loaded.ensurePlayerActivityState();
    loaded.catchUpPlayerActivity();
    assert(loaded.awards.n === 0, 'reload before the session ends does not award it');
    loaded.advanceTimeQuiet(0.6, 'calendar');
    assert(loaded.awards.n === 1, 'the saved routine completes the pending session once');
    const mid = JSON.parse(JSON.stringify(loaded.G.playerActivity));
    loaded.G.playerActivity = JSON.parse(JSON.stringify(mid));
    loaded.catchUpPlayerActivity();
    assert(loaded.awards.n === 1, 'catch-up after a completed session does not pay it twice');
}

// Old saves have no activity field.
{
    const ctx = boot();
    delete ctx.G.playerActivity;
    ctx.ensurePlayerActivityState();
    ctx.catchUpPlayerActivity();
    assert(ctx.G.playerActivity == null && ctx.awards.n === 0, 'a save with no activity stays idle');
}

// 9. No activity: one slice. Seclusion entry still calls quiet advance.
{
    const ctx = boot();
    ctx.advanceTimeQuiet(12, 'Long seclusion');
    assert(ctx.slices.length === 1 && Math.abs(ctx.slices[0] - 12) < 1e-9, 'seclusion-sized quiet advance stays one slice without an activity');
    assert(ctx.awards.n === 0, 'quiet time alone does not grant a focused session');
    const seclusion = fs.readFileSync(path.join(root, 'seclusion-project.js'), 'utf8');
    const passive = fs.readFileSync(path.join(root, 'passive-cultivation.js'), 'utf8');
    assert(seclusion.includes('advanceTimeQuiet') || seclusion.includes('startTimePlayback'), 'seclusion still uses playback');
    assert(passive.includes('advanceTime('), 'paused focused cultivation still has the direct action path');
    assert(passive.includes('startCommittedFocusedCultivation'), 'a live calendar uses the committed activity');
}

// 10. A long jump is split on session boundaries.
{
    const ctx = boot();
    ctx.G.dwelling.mode = 'owned';
    ctx.startCultivationRoutine();
    ctx.advanceTimeQuiet(4, 'calendar');
    assert(ctx.slices.length === 4 && ctx.slices.every(n => Math.abs(n - 1) < 1e-9), 'four months with a monthly routine are four checked slices');
}

if (failed) {
    console.error(`\n${failed} player activity test(s) failed`);
    process.exit(1);
}
console.log('\nAll player activity tests passed.');
