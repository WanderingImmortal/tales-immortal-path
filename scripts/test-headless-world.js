const assert = require('node:assert/strict');
const { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } = require('node:fs');
const { tmpdir } = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { simulateWorld } = require('./lib/headless-world');
const { runCli } = require('./simulate-world');

test('the same seed reproduces production state and diagnostics without checkpoint effects', () => {
    const options = { seed: 42, months: 6, checkpoint: 2 };
    const { executionMs, ...first } = simulateWorld(options);
    const { executionMs: repeatedMs, ...second } = simulateWorld(options);
    assert.ok(executionMs >= 0 && repeatedMs >= 0);
    assert.deepEqual(first, second);
    assert.equal(first.status, 'completed');
    assert.deepEqual(first.diagnostics.errors, []);
    assert.ok(first.initial.npcs.total > 0);
    assert.deepEqual(first.checkpoints.map(snapshot => snapshot.elapsedMonths), [2, 4]);
    assert.equal(first.final.calendarMonth - first.initial.calendarMonth, 6);
    assert.equal(simulateWorld({ ...options, checkpoint: 1 }).final.stateHash, first.final.stateHash);

    const other = simulateWorld({ ...options, seed: 43 });
    assert.equal(other.status, 'completed');
    assert.notDeepEqual(other.initial.economy.redwellMarket, first.initial.economy.redwellMarket);
});

test('production scheduling drains events by timestamp and ID exactly once', () => {
    const result = simulateWorld({ months: 2, checkpoint: 1 }, evaluate => evaluate(`
        registerWorldEventHandler('harness_probe', () => {});
        scheduleWorldEvent('harness_probe', G.ageMonths + 0.75, {}, { id: 'later' });
        scheduleWorldEvent('harness_probe', G.ageMonths + 0.25, {}, { id: 'b' });
        scheduleWorldEvent('harness_probe', G.ageMonths + 0.25, {}, { id: 'a' });
    `));
    assert.equal(result.status, 'completed');
    const events = result.diagnostics.dispatches.filter(event => event.type === 'harness_probe');
    assert.deepEqual(events.map(event => event.id), ['a', 'b', 'later']);
    assert.deepEqual(events.map(event => event.calendarMonth - result.initial.calendarMonth), [0.25, 0.25, 0.75]);
    assert.ok(events.every(event => event.scheduledMonth === event.calendarMonth));
});

test('a mandatory production attention boundary interrupts the requested span', () => {
    const result = simulateWorld({ months: 6, checkpoint: 1 }, evaluate => evaluate(`
        registerWorldEventHandler('harness_attention', () => { G.sect.pendingEvent = { eventId: 'probe' }; });
        scheduleWorldEvent('harness_attention', G.ageMonths + 1.5, {}, { id: 'attention' });
    `));
    assert.equal(result.status, 'interrupted');
    assert.equal(result.final.elapsedMonths, 1.5);
    assert.deepEqual(result.checkpoints.map(snapshot => snapshot.elapsedMonths), [1]);
    assert.match(result.interruption.reason, /sect decision/i);
});

test('quarantined scheduler work and corrupt state are visible as errors', () => {
    const failure = simulateWorld({ months: 2 }, evaluate => evaluate(`
        registerWorldEventHandler('harness_fault', () => { throw new Error('Controlled handler fault'); });
        scheduleWorldEvent('harness_fault', G.ageMonths + 0.5, {}, { id: 'broken-event' });
    `));
    assert.equal(failure.status, 'error');
    assert.ok(failure.diagnostics.errors.some(error => error.code === 'event-quarantined'
        && /broken-event.*Controlled handler fault/.test(error.message)));
    assert.equal(failure.final.schedule.quarantined, 1);

    const invalid = simulateWorld({ months: 1 }, evaluate => evaluate(`
        const existing = G.worldNpcs.find(npc => npc.alive);
        G.worldNpcs.push({ ...existing });
        G.pillStock.spirit_gathering = -1;
    `));
    assert.equal(invalid.status, 'error');
    assert.equal(invalid.final.elapsedMonths, 0);
    assert.deepEqual(invalid.diagnostics.errors.map(error => error.code), ['live-npc-uid', 'inventory-count']);
});

test('CLI emits JSON without touching a save in the working directory and reports bad input', () => {
    const directory = mkdtempSync(path.join(tmpdir(), 'wi-headless-'));
    try {
        const save = path.join(directory, 'xianxia_save');
        writeFileSync(save, 'sentinel');
        const run = (args, simulate) => {
            let stdout = '';
            let stderr = '';
            const status = runCli(args, {
                stdout: { write: value => { stdout += value; } },
                stderr: { write: value => { stderr += value; } }
            }, simulate);
            return { status, stdout, stderr };
        };
        const success = run(['--years', '1', '--output', path.join(directory, 'report.json')]);
        assert.equal(success.status, 0, success.stderr);
        assert.equal(JSON.parse(readFileSync(path.join(directory, 'report.json'), 'utf8')).final.elapsedMonths, 12);
        assert.equal(readFileSync(save, 'utf8'), 'sentinel');
        assert.deepEqual(readdirSync(directory).sort(), ['report.json', 'xianxia_save']);

        const refused = run(['--months', '0', '--output', save]);
        assert.equal(refused.status, 1);
        assert.match(refused.stderr, /World simulation:.*xianxia_save/);
        assert.equal(readFileSync(save, 'utf8'), 'sentinel');
        const invalid = run(['--months', '1', '--years', '1']);
        assert.equal(invalid.status, 1);
        assert.match(invalid.stderr, /either --months or --years/);
        const failed = run(['--months', '1'], options => simulateWorld(options, evaluate => evaluate(`
            scheduleWorldEvent('missing_handler', G.ageMonths + 0.5, {}, { id: 'cli-fault' });
        `)));
        assert.equal(failed.status, 1);
        assert.ok(JSON.parse(failed.stdout).diagnostics.errors.some(error =>
            error.code === 'event-quarantined' && error.message.includes('cli-fault')));
    } finally {
        rmSync(directory, { recursive: true, force: true });
    }
});
