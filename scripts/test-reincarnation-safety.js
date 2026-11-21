const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const runKey = 'xianxia_save';
const legacyKey = 'xianxia_legacy';

function storage() {
    return { values: new Map(), blocked: new Set(), calls: [] };
}

function game(disk = storage()) {
    const elements = new Map();
    const timers = [];
    let id = 0;
    const context = vm.createContext({
        console: { ...console, error() {} },
        crypto: { randomUUID: () => `run-${++id}` },
        setTimeout: callback => timers.push(callback),
        document: {
            addEventListener() {},
            getElementById(key) {
                if (!elements.has(key)) elements.set(key, { style: {}, hidden: true, textContent: '' });
                return elements.get(key);
            }
        },
        localStorage: {
            getItem(key) {
                disk.calls.push(['read', key]);
                if (disk.blocked.has(`read:${key}`)) throw new Error('Read denied');
                return disk.values.get(key) ?? null;
            },
            setItem(key, value) {
                disk.calls.push(['write', key]);
                if (disk.blocked.has(`write:${key}`)) throw new Error('Write denied');
                disk.values.set(key, value);
            },
            removeItem(key) {
                disk.calls.push(['remove', key]);
                if (disk.blocked.has(`remove:${key}`)) throw new Error('Removal denied');
                disk.values.delete(key);
            }
        }
    });
    for (const file of ['data.js', 'legacy.js', 'core.js', 'foundation.js', 'cultivation-tracks.js',
        'forbidden.js', 'world.js', 'main.js']) {
        vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
    }
    const run = code => vm.runInContext(code, context);
    run(`
        let creations = 0, rendered = 0, summaries = 0, catchUps = 0;
        setupCreation = () => { creations++; };
        resetCreationState = () => {};
        openReincarnationSummaryModal = () => { summaries++; };
        function fullRender() { rendered++; }
        function catchUpPlayerActivity() { catchUps++; }
        addLog = () => {};
        ensureWorldNpcs = () => {};
        seedWorldNpcsIfEmpty = () => {};
        isImmortal = () => true;
    `);
    return {
        run, disk, elements, timers,
        active: () => JSON.parse(disk.values.get(runKey) || 'null'),
        legacy: () => JSON.parse(disk.values.get(legacyKey) || 'null'),
        retry: () => elements.get('retry-load').onclick()
    };
}

test('bitter reincarnation journals the death before the delayed summary and grants CP once', () => {
    const g = game();
    assert.equal(g.run("G.name = 'Lin'; saveState()"), true);
    g.run('G.gameOver = true; triggerBitterReincarnation(); triggerBitterReincarnation()');
    assert.equal(g.timers.length, 1);
    assert.equal(g.active().reincarnationIntent.endType, 'bitter');
    assert.equal(g.legacy(), null);

    g.timers.shift()();
    assert.equal(g.active(), null);
    assert.equal(g.legacy().totalRuns, 1);
    assert.equal(g.legacy().bonusCP, 1);
    assert.equal(g.legacy().successfulReincarnations, 0);
    assert.equal(g.legacy().chronicle[0].name, 'Lin');
    assert.equal(g.run('creations === 1 && summaries === 1'), true);
    assert.equal(g.run('saveState()'), false);
    g.run('triggerBitterReincarnation(); triggerTrueReincarnation(null); processRunEnd()');
    assert.equal(g.legacy().totalRuns, 1);
});

test('reload before the bitter timer resumes the saved death without a second reward', () => {
    const g = game();
    g.run('G.gameOver = true; triggerBitterReincarnation()');
    const reload = game(g.disk);
    reload.run('initGame()');
    assert.equal(reload.active(), null);
    assert.equal(reload.legacy().bonusCP, 1);
    assert.equal(reload.run('catchUps === 0 && creations === 1'), true);
});

test('true reincarnation recovers a selected perk after a failed legacy write and reload', () => {
    const g = game();
    g.disk.values.set(legacyKey, JSON.stringify({ totalRuns: 4, bonusCP: 7,
        successfulReincarnations: 1, unlocks: { secondTraitSlot: true }, chronicle: [] }));
    g.run("G.name = 'Lin'; saveState()");
    const originalLegacy = g.disk.values.get(legacyKey);
    g.disk.blocked.add(`write:${legacyKey}`);
    assert.equal(g.run("triggerTrueReincarnation('echo_of_fortune')"), false);
    assert.equal(g.active().reincarnationIntent.carryPerkId, 'echo_of_fortune');
    assert.equal(g.disk.values.get(legacyKey), originalLegacy);
    assert.equal(g.run('creations'), 0);

    const reload = game(g.disk);
    reload.run('initGame()');
    assert.equal(reload.run('catchUps === 0 && creations === 0'), true);
    assert.equal(reload.elements.get('load-error').hidden, false);
    reload.disk.blocked.clear();
    reload.retry();
    assert.equal(reload.active(), null);
    assert.equal(reload.legacy().bonusCP, 9);
    assert.equal(reload.legacy().totalRuns, 5);
    assert.equal(reload.legacy().successfulReincarnations, 2);
    assert.equal(reload.legacy().unlocks.heavenlyRoot, true);
    assert.equal(reload.legacy().pendingCarryPerk, 'echo_of_fortune');
    assert.equal(reload.legacy().chronicle.length, 1);
    assert.equal(reload.run('creations'), 1);
});

test('failed run removal retries with the committed life ID and does not award twice', () => {
    const g = game();
    g.disk.blocked.add(`remove:${runKey}`);
    assert.equal(g.run("triggerTrueReincarnation('echo_of_memory')"), false);
    const before = g.disk.values.get(legacyKey);
    assert.deepEqual(g.legacy().completedRunIds, [g.active().runId]);
    assert.equal(g.legacy().bonusCP, 2);
    assert.equal(g.run('creations'), 0);
    assert.equal(g.run('processRunEnd()'), null);
    assert.equal(g.disk.values.get(legacyKey), before);
    const reload = game(g.disk);
    reload.disk.blocked.clear();
    reload.run('initGame()');
    assert.equal(reload.active(), null);
    assert.equal(reload.disk.values.get(legacyKey), before);
    assert.equal(reload.run('creations === 1 && catchUps === 0'), true);
});

test('failed initial journal write leaves old save unchanged and retries the selection in memory', () => {
    const g = game();
    g.run('saveState()');
    const oldSave = g.disk.values.get(runKey);
    g.disk.blocked.add(`write:${runKey}`);
    assert.equal(g.run("triggerTrueReincarnation('echo_of_qi')"), false);
    assert.equal(g.disk.values.get(runKey), oldSave);
    assert.equal(g.legacy(), null);
    g.disk.blocked.clear();
    g.retry();
    assert.equal(g.active(), null);
    assert.equal(g.legacy().pendingCarryPerk, 'echo_of_qi');
});

test('unsaved carry application does not consume entitlement and a draft retry grants it only once', () => {
    const g = game();
    g.disk.values.set(legacyKey, JSON.stringify({ pendingCarryPerk: 'echo_of_fortune' }));
    assert.equal(g.run("loadLegacy(); G.stones = 20; applyPendingCarryPerk(); applyPendingCarryPerk(); G.stones"), 45);
    assert.equal(g.legacy().pendingCarryPerk, 'echo_of_fortune');
    g.disk.blocked.add(`write:${runKey}`);
    g.run('saveCarriedLifeAndEnter()');
    assert.equal(g.active(), null);
    assert.equal(g.run('rendered'), 0);
    assert.equal(g.legacy().pendingCarryPerk, 'echo_of_fortune');
    g.disk.blocked.clear();
    g.retry();
    assert.equal(g.active().stones, 45);
    assert.equal(g.legacy().pendingCarryPerk, null);
    assert.equal(g.run('rendered'), 1);
});

test('reload after committing the new life but before legacy cleanup consumes the receipt without reapplying', () => {
    const g = game();
    g.disk.values.set(legacyKey, JSON.stringify({
        pendingCarryPerk: 'echo_of_fortune', pendingCarryToken: 'previous-life', bonusCP: 2
    }));
    g.run('loadLegacy(); applyPendingCarryPerk()');
    g.disk.blocked.add(`write:${legacyKey}`);
    assert.equal(g.run('saveState()'), true);
    assert.equal(g.active().stones, 45);
    assert.equal(g.legacy().pendingCarryPerk, 'echo_of_fortune');

    const reload = game(g.disk);
    reload.disk.blocked.clear();
    reload.run('initGame()');
    assert.equal(reload.legacy().pendingCarryPerk, null);
    assert.equal(reload.legacy().bonusCP, 2);
    assert.equal(reload.run('loadState(); applyPendingCarryPerk(); G.stones'), 45);
    assert.equal(reload.run('loadState(); applyPendingCarryPerk(); G.stones'), 45);
});

for (const [perk, value] of [
    ['echo_of_qi', 'G._legacyCultivateBonusPct === 5'],
    ['echo_of_foundation', 'G.cultivationBase.stability === 3'],
    ['echo_of_memory', 'G._legacyDaoBonusPct === 5']
]) {
    test(`legacy ${perk} keeps its existing effect across application and reload`, () => {
        const g = game();
        g.disk.values.set(legacyKey, JSON.stringify({ pendingCarryPerk: perk }));
        assert.equal(g.run(`loadLegacy(); applyPendingCarryPerk(); applyPendingCarryPerk(); ${value}`), true);
        assert.equal(g.legacy().pendingCarryPerk, perk);
        assert.equal(g.run('saveState()'), true);
        assert.equal(g.legacy().pendingCarryPerk, null);
        assert.equal(g.run(`loadState(); applyPendingCarryPerk(); ${value}`), true);
    });
}

test('legacy read and parse failures preserve committed or unreadable data and block creation', () => {
    const g = game();
    g.disk.values.set(legacyKey, JSON.stringify({ bonusCP: 8 }));
    g.run('loadLegacy(); saveState()');
    const oldRun = g.disk.values.get(runKey);
    g.disk.blocked.add(`read:${legacyKey}`);
    g.run('initGame()');
    assert.equal(g.run('getLegacyBonusCP() === 8 && creations === 0 && legacyFailure.stage === "read"'), true);
    assert.equal(g.legacy().bonusCP, 8);
    assert.equal(g.run('G.stones += 10; saveState()'), false);
    assert.equal(g.disk.values.get(runKey), oldRun);
    g.disk.blocked.clear();
    g.disk.values.set(legacyKey, '{broken');
    g.run('initGame()');
    assert.equal(g.run('getLegacyBonusCP() === 8 && creations === 0 && legacyFailure.stage === "parse"'), true);
    assert.equal(g.disk.values.get(legacyKey), '{broken');
});

test('unrecognized transition data is retained and ordinary load recovery blocks writes', () => {
    const g = game();
    const raw = JSON.stringify({ name: 'Lin', runId: 'old', reincarnationIntent: { version: 2 } });
    g.disk.values.set(runKey, raw);
    g.run('initGame()');
    assert.equal(g.run('getSaveLoadDiagnostics().loadFailure.stage'), 'validate');
    assert.equal(g.run('creations === 0 && !saveState()'), true);
    assert.equal(g.disk.values.get(runKey), raw);
    assert.equal(g.legacy(), null);
});

test('normal true reincarnation upgrades a pre-ID run and can finish without a perk', () => {
    const g = game();
    g.disk.values.set(runKey, JSON.stringify({ name: 'Lin', path: 'qi' }));
    assert.equal(g.run('loadState(); triggerTrueReincarnation(null)'), true);
    assert.equal(g.active(), null);
    assert.equal(g.legacy().bonusCP, 2);
    assert.equal(g.legacy().successfulReincarnations, 1);
    assert.equal(g.legacy().unlocks.secondTraitSlot, true);
    assert.equal(g.legacy().unlocks.fallenNoble, true);
    assert.equal(g.legacy().pendingCarryPerk, null);
    assert.equal(g.legacy().completedRunIds.length, 1);
});

test('failed new-life save followed by reload leaves the entitlement for character creation', () => {
    const g = game();
    g.disk.values.set(legacyKey, JSON.stringify({ pendingCarryPerk: 'echo_of_fortune' }));
    g.disk.blocked.add(`write:${runKey}`);
    g.run('loadLegacy(); applyPendingCarryPerk(); saveCarriedLifeAndEnter()');

    const reload = game(g.disk);
    reload.disk.blocked.clear();
    reload.run('initGame()');
    assert.equal(reload.run('creations'), 1);
    assert.equal(reload.run('applyPendingCarryPerk(); G.stones'), 45);
    reload.run('saveCarriedLifeAndEnter()');
    assert.equal(reload.active().stones, 45);
    assert.equal(reload.legacy().pendingCarryPerk, null);
});

test('replaying an older completed journal after another life cannot award it again', () => {
    const g = game();
    g.disk.blocked.add(`remove:${runKey}`);
    g.run('triggerTrueReincarnation(null)');
    const staleJournal = g.disk.values.get(runKey);
    g.disk.blocked.clear();
    g.retry();
    g.run('G = createInitialGameState(); triggerTrueReincarnation(null)');
    const committed = g.disk.values.get(legacyKey);
    assert.equal(g.legacy().bonusCP, 4);
    assert.equal(g.legacy().completedRunIds.length, 2);

    g.disk.values.set(runKey, staleJournal);
    game(g.disk).run('initGame()');
    assert.equal(g.active(), null);
    assert.equal(g.disk.values.get(legacyKey), committed);
});
