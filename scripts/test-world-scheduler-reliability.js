const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function game(storage = { snapshot: null }) {
    const errors = [];
    const context = vm.createContext({
        console: { ...console, error: (...args) => errors.push(args) },
        localStorage: {
            getItem: () => storage.snapshot,
            setItem: (_key, value) => { storage.snapshot = value; }
        },
        document: { getElementById: () => null }
    });
    for (const file of ['data.js', 'world-scheduler.js', 'advance-time-rules.js', 'core.js',
        'foundation.js', 'cultivation-tracks.js', 'forbidden.js', 'world.js', 'sect.js', 'sect-expand.js']) {
        vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
    }
    const run = code => vm.runInContext(code, context);
    run(`
        G.ageMonths = 240;
        G.receipts = [];
        addLog = () => {};
        ensureWorldNpcs = () => {};
        const advance = to => processWorldTime(G.ageMonths, to);
        const record = (data, event) => G.receipts.push([event.id, G.ageMonths]);
        const queue = (id, at, type = 'record') => scheduleWorldEvent(type, at, {}, { id });
        registerWorldEventHandler('record', record);
    `);
    return { run, json: code => JSON.parse(run(`JSON.stringify(${code})`)), storage, errors };
}

test('equal timestamps use ID order and reconsider newly scheduled or cancelled work', () => {
    const { run, json } = game();
    run(`
        registerWorldEventHandler('parent', (data, event) => {
            record(data, event);
            queue('b', G.ageMonths);
            cancelWorldEvents(row => row.id === 'c');
        });
        queue('c', 241);
        queue('d', 241);
        queue('a', 241, 'parent');
        advance(242);
    `);
    assert.deepEqual(json('G.receipts'), [['a', 241], ['b', 241], ['d', 241]]);
    assert.deepEqual(json('G.worldSchedule'), []);
});

test('the same ID cannot recur at one boundary, while a future recurrence can run', () => {
    const { run, json } = game();
    run(`
        let rejected;
        registerWorldEventHandler('loop', (data, event) => {
            record(data, event);
            rejected = queue(event.id, G.ageMonths, 'loop');
            if (G.ageMonths === 240) queue(event.id, 241, 'loop');
        });
        queue('loop', 240, 'loop');
        advance(240);
        advance(241);
    `);
    assert.deepEqual(json('G.receipts'), [['loop', 240], ['loop', 241]]);
    assert.equal(run('rejected'), null);
    assert.equal(run('queue("loop", 241, "loop")'), null);
    assert.equal(run('advance(241); G.receipts.length'), 2);
});

test('an unbounded chain of distinct same-date IDs is explicitly quarantined', () => {
    const { run, json, errors } = game();
    run(`
        let next = 0;
        registerWorldEventHandler('loop', (data, event) => {
            record(data, event);
            queue('recursive-' + ++next, G.ageMonths, 'loop');
        });
        queue('recursive-0', 240, 'loop');
        queue('future', 241);
        advance(242);
    `);
    assert.equal(run('G.receipts.length'), 129);
    assert.deepEqual(json('G.receipts.at(-1)'), ['future', 241]);
    assert.equal(run('getFailedWorldEvents()[0].reason'), 'chain_limit');
    assert.equal(run('getFailedWorldEvents()[0].at'), 240);
    assert.equal(errors.length, 1);
});

test('fractional timestamps stay distinct and bulk and partitioned advances agree', () => {
    const scenario = ends => {
        const { run, json } = game();
        run(`
            queue('z', 240.125);
            queue('a', 240.12500001);
            queue('c', 240.75);
            queue('b', 240.75);
            for (const end of ${JSON.stringify(ends)}) advance(end);
        `);
        return json('G.receipts');
    };
    const expected = [['z', 240.125], ['a', 240.12500001], ['b', 240.75], ['c', 240.75]];
    assert.deepEqual(scenario([241]), expected);
    assert.deepEqual(scenario([240.125, 240.5, 240.75, 241]), expected);
});

test('invalid and past timestamps are rejected without changing pending events', () => {
    const { run, json } = game();
    run('queue("ok", 240.5)');
    for (const at of ['NaN', 'Infinity', '-Infinity', '239.9', '"240.3"', 'null']) {
        assert.throws(() => run(`queue('bad', ${at})`), /finite timestamp/);
    }
    assert.deepEqual(json('G.worldSchedule.map(event => [event.id, event.at])'), [['ok', 240.5]]);
});

test('a partial handler failure is visible and never automatically replayed', () => {
    const { run, json, errors, storage } = game();
    run(`
        registerWorldEventHandler('unsafe', (data, event) => {
            record(data, event);
            queue('next', 241);
            throw new Error('partial mutation');
        });
        queue('unsafe', 241, 'unsafe');
        advance(243);
        saveState();
    `);
    assert.deepEqual(json('G.receipts'), [['unsafe', 241], ['next', 241]]);
    assert.equal(errors.length, 1);
    assert.equal(run('G.worldChronicle.at(-1).type'), 'world_event_failure');
    assert.equal(run('retryFailedWorldEvent("unsafe")'), false);

    const reload = game(storage);
    assert.equal(reload.run('loadState()'), true);
    assert.equal(reload.run('getFailedWorldEvents()[0].message'), 'partial mutation');
    assert.equal(reload.run('advance(245); G.receipts.length'), 2);
});

test('an explicitly replay-safe handler can be retried at the same date after repair', () => {
    const { run, json } = game();
    run(`
        registerWorldEventHandler('safe', () => { throw new Error('not ready'); }, { retrySafe: true });
        queue('retry', 240, 'safe');
        advance(240);
        registerWorldEventHandler('safe', record, { retrySafe: true });
    `);
    assert.equal(run('retryFailedWorldEvent("retry", 240)'), true);
    assert.equal(run('retryFailedWorldEvent("retry", 240)'), false);
    run('advance(240); advance(241)');
    assert.deepEqual(json('G.receipts'), [['retry', 240]]);
});

test('unknown types and pending events survive reload and can recover in timestamp order', () => {
    const { run, storage } = game();
    run(`
        queue('unknown', 241, 'toString');
        queue('pending', 243.25);
        advance(242);
        saveState();
    `);
    const reload = game(storage);
    assert.equal(reload.run('loadState()'), true);
    assert.equal(reload.run('getFailedWorldEvents()[0].reason'), 'unknown_handler');
    assert.equal(reload.run('retryFailedWorldEvent("unknown")'), false);
    reload.run("registerWorldEventHandler('toString', record)");
    assert.equal(reload.run('retryFailedWorldEvent("unknown")'), true);
    reload.run('advance(244)');
    assert.deepEqual(reload.json('G.receipts'), [['unknown', 242], ['pending', 243.25]]);
});

test('a save taken inside a handler preserves an in-flight record and its queued successor', () => {
    const { run, storage } = game();
    run(`
        registerWorldEventHandler('recurring', (data, event) => {
            record(data, event);
            queue(event.id, 242);
            saveState();
        });
        queue('same-id', 241, 'recurring');
        advance(241);
    `);
    const reload = game(storage);
    assert.equal(reload.run('loadState()'), true);
    assert.equal(reload.run('getFailedWorldEvents()[0].reason'), 'interrupted_dispatch');
    assert.equal(reload.run('retryFailedWorldEvent("same-id")'), false);
    reload.run('advance(243)');
    assert.deepEqual(reload.json('G.receipts'), [['same-id', 241], ['same-id', 242]]);
});

test('overdue legacy work has original dates and drains without rewinding the calendar', () => {
    const { run, json, storage } = game();
    storage.snapshot = JSON.stringify({ name: 'Lin', ageMonths: 240, receipts: [], worldSchedule: [
        { id: 'later', type: 'record', at: 239 }, { id: 'earlier', type: 'record', at: 233.25 },
        { id: 'bad-date', type: 'record', at: null }
    ] });
    assert.equal(run('loadState()'), true);
    const restored = json(`G.worldSchedule.filter(event => ['later', 'earlier', 'bad-date'].includes(event.id))
        .map(event => event.at)`);
    assert.deepEqual(restored, [239, 233.25, null]);
    run('advance(240)');
    assert.deepEqual(json('G.receipts'), [['earlier', 240], ['later', 240]]);
    assert.equal(run('getFailedWorldEvents()[0].reason'), 'invalid_event');
});

test('nested scheduler and paid advances are rejected before additional ticks or clock changes', () => {
    const { run, json } = game();
    run(`
        G.elapsed = 0;
        let pauses = 0;
        function setWorldClockPaused() { pauses++; }
        registerWorldTick('accumulate', months => { G.elapsed += months; });
        registerWorldEventHandler('nested-direct', () => advance(250));
        registerWorldEventHandler('nested-paid', () => advanceTime(4, 'Nested action'));
        registerWorldEventHandler('nested-shared', () => advanceSharedWorldTime(4, 'Nested action'));
        queue('direct', 241, 'nested-direct');
        queue('paid', 241, 'nested-paid');
        queue('shared', 241, 'nested-shared');
        queue('later', 242);
        advance(243);
    `);
    assert.equal(run('G.elapsed === 3 && G.ageMonths === 243 && pauses === 0'), true);
    assert.deepEqual(json('G.receipts'), [['later', 242]]);
    assert.equal(run('getFailedWorldEvents().filter(event => event.reason === "handler_error").length'), 3);
});

test('a sect choice without a popup stays pending at its boundary and bills normal time on choice', () => {
    const { run } = game();
    assert.equal(run(`
        G.sect = createEmptySectState();
        Object.assign(G.sect, { name: 'Hall', stage: 'established', lastEventMonths: 240, renown: 20 });
        const due = getNextSectEventBoundary(240);
        rollSectEvent = () => SECT_EVENTS.beast_tide;
        resolveSectEventRival = () => null;
        tickSectSystems = tickSectRandomEvents;
        Math.random = () => 0;
        const completed = advanceTime(due - 240 + 5, 'Passing time');
        !completed && G.ageMonths === due && G.sect.pendingEvent?.eventId === 'beast_tide' &&
            G.sect.pendingEvent.atMonths === due && G.sect.renown === 20
    `), true);
    assert.equal(run(`
        applySectEventChoice('beast_tide', 'evacuate');
        const first = G.ageMonths;
        applySectEventChoice('beast_tide', 'evacuate');
        first === due + 1 && G.ageMonths === first && !G.sect.pendingEvent && G.sect.renown === 18
    `), true);
});

test('automatically generated IDs cannot overwrite distinct equal-time events', () => {
    const { run } = game();
    assert.equal(run(`
        Math.random = () => 0;
        const first = scheduleWorldEvent('record', 241);
        const second = scheduleWorldEvent('record', 241);
        advance(241);
        first !== second && G.receipts.length === 2
    `), true);
});

test('an unreadable save blocks scheduler retry and preserves the stored bytes', () => {
    const { run, storage } = game();
    run("queue('unknown', 240, 'missing'); advance(240); registerWorldEventHandler('missing', record)");
    storage.snapshot = '{broken';
    assert.equal(run('loadState()'), false);
    assert.equal(run('retryFailedWorldEvent("unknown") || saveState()'), false);
    assert.equal(storage.snapshot, '{broken');
});
