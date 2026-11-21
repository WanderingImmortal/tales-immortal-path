const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function boot() {
    const context = vm.createContext({
        console,
        setTimeout: () => 1,
        clearTimeout: () => {},
        document: {
            getElementById: id => id === 'game-screen' ? { style: {} } : null,
            querySelectorAll: () => []
        },
        localStorage: {
            value: null,
            getItem() { return this.value; },
            setItem(_key, value) { this.value = value; }
        }
    });
    const scripts = [
        'data.js', 'world-scheduler.js', 'advance-time-rules.js', 'core.js', 'cultivation-tracks.js',
        'foundation.js', 'forbidden.js', 'world.js', 'passive-cultivation.js', 'player-activity.js',
        'time-playback.js', 'world-clock.js', 'seclusion-project.js'
    ];
    for (const file of scripts) {
        vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
    }
    const run = code => vm.runInContext(code, context);
    run(`
        G.ageMonths = 240;
        G.lifespanMonths = 960;
        G.currentZone = 'dustbone';
        G.payments = G.decay = G.annualGains = G.focusedGains = G.exploreGains = G.projectGains = 0;
        G.log = [];
        addLog = () => {};
        function fullRender() { saveState(); }
        function renderStats() {}
        function tickAlchemySupplyDecay(months) { G.decay += months; }
        function tickDwellingRent() {
            if (G.dwelling?.mode === 'rent' && G.ageMonths >= G.dwelling.rentPaidThroughMonth) {
                G.dwelling.mode = 'homeless';
            }
        }
        function tickWellRingCalendar() {
            G.payments = Math.floor(G.ageMonths) - 240;
        }
        runCultivateSession = options => {
            if (options.extraMult === 0.22) G.annualGains++;
            else if (!options.quiet) G.focusedGains++;
        };
        runExploreStanceWeek = () => G.exploreGains++;
        function finishThresholdJobProject() { G.projectGains++; }
        function isTribulationActive() { return !!G.tribulationState?.active; }
        function isTranscendencePerkPending() { return !!G.transcendencePerkOffer?.active; }
    `);
    return run;
}

test('paid, quiet and live advances produce the same ordinary passive time and shared obligations', () => {
    const paths = [
        "advanceTime(1, 'Outing')",
        "advanceTimeQuiet(1, 'Quiet travel')",
        'setWorldClockPaused(false); for (let i = 0; i < 4; i++) flushWorldClockWeek()'
    ];
    const actual = paths.map(advance => boot()(`
        ${advance};
        [G.ageMonths, G.payments, G.decay, G.passiveCultivation.weeksCirculated].join()
    `));
    assert.deepEqual(actual, ['241,1,1,4', '241,1,1,4', '241,1,1,4']);
});

test('fractional passive time survives save/load and dedicated work skips it', () => {
    assert.equal(boot()(`
        advanceTimeQuiet(0.1, 'Morning');
        const noEarlyReward = G.passiveCultivation.weeksCirculated === 0;
        saveState();
        G.passiveCultivation = null;
        const loaded = loadState();
        advanceTimeQuiet(0.125, 'Errand', { skipPassiveCirculation: true });
        advanceTime(0.15, 'Evening');
        saveState();
        loadState();
        noEarlyReward && loaded && G.passiveCultivation.weeksCirculated === 1 &&
            G.passiveCultivation.pendingMonths < 1e-9
    `), true);
});

test('mandatory event stops a larger paid advance at its boundary while ordinary events fire once', () => {
    assert.equal(boot()(`
        const order = [];
        registerWorldEventHandler('notice', ({ id }) => order.push(id));
        registerWorldEventHandler('decision', () => {
            order.push('choice');
            G.transcendencePerkOffer = { active: true };
        });
        scheduleWorldEvent('notice', 242, { id: 'first' });
        scheduleWorldEvent('decision', 244);
        scheduleWorldEvent('notice', 245, { id: 'later' });
        const completed = advanceTime(12, 'Long action');
        const stopped = !completed && G.ageMonths === 244 && G.decay === 4 && order.join() === 'first,choice';
        saveState();
        loadState();
        const stillPending = G.transcendencePerkOffer?.active;
        G.transcendencePerkOffer = null;
        advanceTimeQuiet(2, 'Resume');
        stopped && stillPending && order.join() === 'first,choice,later' && G.decay === 6
    `), true);
});

test('eviction interrupts a routine at the rent boundary before the next reward', () => {
    assert.equal(boot()(`
        G.dwelling = { mode: 'rent', rentPaidThroughMonth: 241.5 };
        startCultivationRoutine();
        const done = advanceTimeQuiet(5, 'Routine');
        !done && G.ageMonths === 241.5 && G.focusedGains === 1 &&
            getPlayerActivity() === null && G.playerActivityLast.status === 'blocked' &&
            !G.passiveCultivation?.weeksCirculated
    `), true);
});

test('cancellation just before a deadline earns no focused reward and keeps the passive remainder', () => {
    assert.equal(boot()(`
        advanceTimeQuiet(0.125, 'Walk');
        startCommittedFocusedCultivation();
        advanceTimeQuiet(0.99, 'Focus');
        cancelPlayerActivity();
        advanceTimeQuiet(0.125, 'Walk');
        G.focusedGains === 0 && G.passiveCultivation.weeksCirculated === 1 &&
            G.playerActivityLast.status === 'cancelled'
    `), true);
});

test('travel and cultivation cannot overlap, and a same-boundary ambush prevents a project reward', () => {
    assert.equal(boot()(`
        const travel = startWorldClockProject({ id: 'travel', kind: 'transit', durationMonths: 1 });
        const blocked = !startCultivationRoutine() && !advanceTime(1, 'Focused cultivation') &&
            !startTimePlayback({ years: 3 }).success;
        cancelWorldClockProject('travel');
        startCommittedFocusedCultivation();
        const inverseBlocked = !startWorldClockProject({ id: 'travel', kind: 'transit', durationMonths: 1 });
        cancelPlayerActivity();
        startWorldClockProject({ id: 'threshold_job', kind: 'job', durationMonths: 1 });
        registerWorldEventHandler('ambush', () => { G.inCombat = true; });
        scheduleWorldEvent('ambush', 241);
        const done = advanceTimeQuiet(3, 'Job');
        travel && blocked && inverseBlocked && !done && G.ageMonths === 241 &&
            G.projectGains === 0 && !getWorldClockProject() && G.worldClock.paused
    `), true);
});

test('a live project completes against its own fractional deadline exactly once', () => {
    assert.equal(boot()(`
        startWorldClockProject({ id: 'threshold_job', kind: 'job', durationMonths: 0.375 });
        setWorldClockPaused(false);
        flushWorldClockWeek();
        const incomplete = G.projectGains === 0;
        flushWorldClockWeek();
        const deadline = G.ageMonths;
        flushWorldClockWeek();
        incomplete && deadline === 240.375 && G.projectGains === 1 && !getWorldClockProject()
    `), true);
});

test('a seclusion interruption partway through the second year keeps the completed year only', () => {
    assert.equal(boot()(`
        registerWorldEventHandler('tribulation', () => { G.tribulationState = { active: true }; });
        scheduleWorldEvent('tribulation', 257);
        startSeclusionProject(10);
        runPlaybackYearTick();
        const first = G.ageMonths === 252 && G.annualGains === 1;
        runPlaybackYearTick();
        first && G.ageMonths === 257 && G.annualGains === 1 && !isTimePlaybackActive() &&
            G.decay === 17 && !G.passiveCultivation?.weeksCirculated
    `), true);
});

test('seclusion reaches lifespan exhaustion exactly without an annual award or later event', () => {
    assert.equal(boot()(`
        startSeclusionProject(10);
        G.lifespanMonths = 243;
        registerWorldEventHandler('after_death', () => { G.afterDeath = true; });
        scheduleWorldEvent('after_death', 244);
        runPlaybackYearTick();
        G.gameOver && G.ageMonths === 243 && G.annualGains === 0 && !isTimePlaybackActive() &&
            G.decay === 3 && !G.afterDeath && hasScheduledWorldEvent('after_death')
    `), true);
});

test('exploration pays no weekly yield when interrupted, and interrupted projects stay cleared on load', () => {
    assert.equal(boot()(`
        ensureWorldClockState();
        G.worldClock.stance = 'explore';
        setWorldClockPaused(false);
        G.lifespanMonths = 240.125;
        flushWorldClockWeek();
        const explored = G.exploreGains;
        const passive = G.passiveCultivation.weeksCirculated;
        const endedAt = G.ageMonths;
        G.gameOver = false;
        G.lifespanMonths = 960;
        startWorldClockProject({ id: 'threshold_job', kind: 'job', durationMonths: 1 });
        G.inCombat = true;
        saveState();
        const loaded = loadState();
        loaded && !getWorldClockProject() && G.projectGains === 0 && !G.worldClock.stance &&
            explored === 0 && passive === 0 && endedAt === 240.125
    `), true);
});

test('succession at a focused deadline preserves the choice and blocks the old leader payout', () => {
    assert.equal(boot()(`
        function trySectLeaderSuccessionOnDeath() {
            G.sectSuccessionActive = true;
            G.lifespanMonths += 1;
            return true;
        }
        G.lifespanMonths = 241;
        startCommittedFocusedCultivation();
        const completed = advanceTimeQuiet(4, 'Focus');
        !completed && G.ageMonths === 241 && G.sectSuccessionActive && !G.gameOver &&
            G.focusedGains === 0 && !getPlayerActivity()
    `), true);
});

test('a job stops when its facility closes during a larger advance', () => {
    assert.equal(boot()(`
        function getThresholdJobFacilityBlock() { return G.boardClosed ? 'The work board closed.' : null; }
        startWorldClockProject({ id: 'threshold_job', kind: 'job', durationMonths: 3 });
        registerWorldEventHandler('close_board', () => { G.boardClosed = true; });
        scheduleWorldEvent('close_board', 241);
        const completed = advanceTimeQuiet(6, 'Job');
        !completed && G.ageMonths === 241 && G.projectGains === 0 && !getWorldClockProject()
    `), true);
});
