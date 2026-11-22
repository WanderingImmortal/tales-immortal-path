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
        'foundation.js', 'qi-density.js', 'forbidden.js', 'world.js', 'passive-cultivation.js', 'player-activity.js',
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
        G.partialGains = 0;
        G.bandGains = 0;
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
            if (options.circulationOnly) G.partialGains += options.yieldScale;
            else if (options.extraMult === 0.22) G.annualGains++;
            else if (!options.quiet) G.focusedGains++;
        };
        function isQiCondensationRealm() { return true; }
        function applyQcGatherBandProgress(gain) { G.bandGains += gain; }
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

test('an eleven-month seclusion interruption pays proportional circulation once and keeps annual milestones', () => {
    assert.equal(boot()(`
        registerWorldEventHandler('tribulation', () => { G.tribulationState = { active: true }; });
        scheduleWorldEvent('tribulation', 263);
        startSeclusionProject(10);
        const unrelatedBlocked = !advanceTime(1, 'Unrelated work') && G.ageMonths === 240;
        const yearUnits = getSeclusionYearGatherUnits();
        runPlaybackYearTick();
        const first = G.ageMonths === 252 && G.annualGains === 1 && G.bandGains === yearUnits;
        runPlaybackYearTick();
        const interrupted = G.ageMonths === 263 && G.annualGains === 1 &&
            G.partialGains === 11 / 12 && Math.abs(G.bandGains - yearUnits * (1 + 11 / 12)) < 1e-9 &&
            !isTimePlaybackActive() && G.decay === 23 && !G.passiveCultivation?.weeksCirculated;
        const savedBand = G.bandGains;
        const loaded = loadState();
        runPlaybackYearTick();
        unrelatedBlocked && first && interrupted && loaded && G.bandGains === savedBand && G.partialGains === 11 / 12
    `), true);
});

test('a failed interrupted seclusion checkpoint retains the last settled year and can be retried', () => {
    const run = boot();
    assert.equal(run(`
        G.name = 'Lin';
        registerWorldEventHandler('tribulation', () => {
            G.tribulationState = { active: true };
            fullRender();
        });
        scheduleWorldEvent('tribulation', 263, {}, { id: 'retreat-interruption' });
        startSeclusionProject(10);
        runPlaybackYearTick();
        const settled = localStorage.value;
        const writes = [];
        const write = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            const snapshot = JSON.parse(value);
            writes.push([snapshot.ageMonths, snapshot.partialGains]);
            if (snapshot.partialGains) {
                const error = new Error('Storage full');
                error.name = 'QuotaExceededError';
                throw error;
            }
            write.call(this, key, value);
        };
        runPlaybackYearTick();
        JSON.parse(settled).ageMonths
    `), 252);
    assert.equal(run('localStorage.value === settled'), true,
        'a snapshot without the proportional reward must never replace the previous checkpoint');
    const saved = run('localStorage.value');
    assert.equal(boot()(`
        localStorage.value = ${JSON.stringify(saved)};
        loadState() && G.ageMonths === 252 && G.annualGains === 1 && G.partialGains === 0
    `), true);
    assert.equal(run('writes.length > 0 && writes.every(([age, gain]) => age === 263 && gain === 11 / 12)'), true);
    assert.equal(run(`
        localStorage.setItem = write;
        saveState() && loadState()
    `), true);
    run('runPlaybackYearTick()');
    assert.equal(run('G.ageMonths'), 263);
    assert.equal(run('G.partialGains'), 11 / 12);
    assert.equal(run('G.annualGains'), 1);
    assert.equal(run('G.decay'), 23);
    assert.equal(run('G.tribulationState.active && !isTimePlaybackActive()'), true);
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

test('small ordinary spans and a large span award the same passive weeks at fractional boundaries', () => {
    const small = boot();
    const large = boot();
    const stats = '[G.passiveCultivation.weeksCirculated, G.passiveCultivation.pendingMonths.toFixed(8), G.bandGains.toFixed(8)].join()';
    assert.equal(small(`
        for (let i = 0; i < 100; i++) advanceTimeQuiet(0.013, 'Small span');
        ${stats}
    `), large(`
        advanceTimeQuiet(1.3, 'Large span');
        ${stats}
    `));
});

test('an interruption raised by the world tick preserves ordinary passive time already earned', () => {
    assert.equal(boot()(`
        advanceTimeQuiet(0.125, 'Walk');
        registerWorldTick('omen', () => { G.tribulationState = { active: true }; });
        const interrupted = !advanceTimeQuiet(0.125, 'Walk') && G.ageMonths === 240.25 &&
            G.passiveCultivation.weeksCirculated === 1 && G.passiveCultivation.pendingMonths === 0;
        const blocked = !advanceTimeQuiet(1, 'Walk');
        interrupted && blocked && G.ageMonths === 240.25 && G.passiveCultivation.weeksCirculated === 1
    `), true);
});

test('cancellation inside a larger advance stops at its event and preserves the cancelled status', () => {
    assert.equal(boot()(`
        startCommittedFocusedCultivation();
        const dates = [];
        registerWorldEventHandler('cancel_focus', () => { dates.push(G.ageMonths); cancelPlayerActivity(); });
        registerWorldEventHandler('later', () => dates.push(G.ageMonths));
        scheduleWorldEvent('cancel_focus', 241);
        scheduleWorldEvent('later', 242);
        const done = advanceTimeQuiet(8, 'Focus');
        const cancelled = !done && G.ageMonths === 241 && G.focusedGains === 0 &&
            G.playerActivityLast.status === 'cancelled' && dates.join() === '241';
        advanceTimeQuiet(1, 'New activity');
        cancelled && dates.join() === '241,242' && G.focusedGains === 0
    `), true);
});

test('cancelling an unfinished project at a scheduled boundary stops the rest of the requested span', () => {
    assert.equal(boot()(`
        startWorldClockProject({ id: 'threshold_job', durationMonths: 4 });
        registerWorldEventHandler('cancel_job', () => cancelWorldClockProject('threshold_job'));
        scheduleWorldEvent('cancel_job', 241);
        const done = advanceTimeQuiet(8, 'Job');
        !done && G.ageMonths === 241 && G.projectGains === 0 && !getWorldClockProject()
    `), true);
});

test('ordinary paid actions cannot bypass a pending decision while an explicit choice may bill time', () => {
    assert.equal(boot()(`
        G.transcendencePerkOffer = { active: true };
        const blocked = !advanceTime(1, 'Unrelated work') && G.ageMonths === 240;
        const choice = advanceTime(1, 'Resolve decision', { allowCurrentAttention: true });
        blocked && choice && G.ageMonths === 241
    `), true);
});

test('a job whose work board was lost on a saved date is removed on load', () => {
    assert.equal(boot()(`
        function getThresholdJobFacilityBlock() { return G.boardClosed ? 'The work board closed.' : null; }
        startWorldClockProject({ id: 'threshold_job', durationMonths: 2 });
        G.boardClosed = true;
        saveState();
        loadState() && !getWorldClockProject() && G.projectGains === 0 && G.ageMonths === 240
    `), true);
});

test('partial-year Qi refill rounds down instead of exceeding the full-session amount', () => {
    assert.equal(boot()(`
        getMaxQi = () => 100;
        getQiReplenishEffortMult = () => 1;
        getQiCompressionSessionBlend = () => 0;
        const full = computeQiCultivationSessionGains({ fillRatio: 0.019 });
        const partial = computeQiCultivationSessionGains({ fillRatio: 0.019, scale: 11 / 12, roundFillDown: true });
        const tiny = computeQiCultivationSessionGains({ fillRatio: 0.019, scale: 1 / 12, roundFillDown: true });
        full.fillGain === 1 && partial.fillGain <= full.fillGain && tiny.fillGain === 0
    `), true);
});

test('a failed action reports time already spent even if its caller cancels the action log', () => {
    assert.equal(boot()(`
        const messages = [];
        addLog = message => messages.push(message);
        function cancelActionLog() { G._actionLog = false; G._pendingActionMeta = null; }
        registerWorldEventHandler('ambush', () => { G.inCombat = true; });
        scheduleWorldEvent('ambush', 241);
        G._actionLog = true;
        const completed = advanceTime(3, 'Repairing gear');
        cancelActionLog();
        !completed && G.ageMonths === 241 && messages.some(message => message.includes('Repairing gear stopped after 1 month'))
    `), true);
});
