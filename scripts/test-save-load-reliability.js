const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function game(raw = null) {
    const storage = { raw, writes: 0, readError: null, writeError: null };
    const errors = [];
    let noticeUpdates = 0;
    let retries = 0;
    const elements = new Map();
    for (const id of ['save-status', 'load-error', 'retry-load', 'creation-screen', 'game-screen']) {
        elements.set(id, { hidden: true, style: {} });
    }
    let noticeText = '';
    Object.defineProperty(elements.get('save-status'), 'textContent', {
        get: () => noticeText,
        set: value => { noticeUpdates++; noticeText = value; }
    });
    const context = vm.createContext({
        localStorage: {
            getItem() {
                if (storage.readError) throw storage.readError;
                return storage.raw;
            },
            setItem(key, value) {
                assert.equal(key, 'xianxia_save');
                storage.writes++;
                if (storage.writeError) throw storage.writeError;
                storage.raw = value;
            }
        },
        document: {
            addEventListener() {},
            getElementById: id => elements.get(id)
        },
        location: { reload() { retries++; } },
        console: { ...console, error: (...args) => errors.push(args) }
    });
    const files = ['data.js', 'core.js', 'foundation.js', 'cultivation-tracks.js',
        'forbidden.js', 'world.js', 'world-scheduler.js', 'main.js'];
    for (const file of files) {
        vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
    }
    const run = code => vm.runInContext(code, context);
    run(`
        const fixtureRoster = Object.keys(ZONES).flatMap(zone =>
            Array.from({ length: NPC_ECOSYSTEM.npcsPerZoneMin }, (_, i) => ({
                uid: zone + i, name: 'Resident', zone, alive: true, personalities: ['careful']
            })));
    `);
    return {
        run,
        storage, elements, errors,
        noticeUpdates: () => noticeUpdates,
        retries: () => retries
    };
}

test('public save and load round-trip progress and reload from clean defaults', () => {
    const { run, storage } = game();
    assert.equal(run("G.name = 'Lin'; G.stones = 75; G.worldNpcs = fixtureRoster; G.nextDemonicEmergenceMonths = 360; currentZone = 'jade'; saveState()"), true);
    const saved = storage.raw;
    assert.equal(run("G.stones = 1; G.runtimeOnly = true; currentZone = 'dustbone'; loadState()"), true);
    assert.equal(run("G.name === 'Lin' && G.stones === 75 && currentZone === 'jade' && G.runtimeOnly === undefined"), true);
    const first = run('JSON.stringify(G)');
    assert.equal(run('loadState()'), true);
    assert.equal(run('JSON.stringify(G)'), first);
    assert.equal(storage.raw, saved);
    assert.equal(storage.writes, 1);
});

test('failed writes preserve the previous save, report quota once and clear the notice when saving resumes', () => {
    const { run, storage, errors, elements, noticeUpdates } = game();
    assert.equal(run('G.stones = 20; saveState()'), true);
    const saved = storage.raw;
    storage.writeError = Object.assign(new Error('Quota reached'), { name: 'QuotaExceededError' });

    assert.equal(run('G.stones = 30; saveState()'), false);
    assert.equal(storage.raw, saved);
    assert.equal(run('getSaveLoadDiagnostics().saveFailure.name'), 'QuotaExceededError');
    assert.match(elements.get('save-status').textContent, /storage is full/);
    assert.equal(storage.writes, 2);
    assert.equal(run('saveState()'), false);
    assert.equal(storage.writes, 3);
    assert.equal(errors.length, 1);
    assert.equal(noticeUpdates(), 1);
    assert.equal(storage.raw, saved);

    storage.writeError = null;
    assert.equal(run('saveState()'), true);
    assert.equal(JSON.parse(storage.raw).stones, 30);
    assert.equal(run('getSaveLoadDiagnostics().saveFailure'), null);
    assert.equal(elements.get('save-status').hidden, true);
});

test('serialization failures are observable and leave the saved snapshot intact', () => {
    const { run, storage } = game();
    assert.equal(run('saveState()'), true);
    const saved = storage.raw;
    assert.equal(run('G.circular = G; saveState()'), false);
    assert.equal(run('getSaveLoadDiagnostics().saveFailure.stage'), 'serialize');
    assert.equal(storage.raw, saved);
    assert.equal(storage.writes, 1);
});

for (const [raw, stage] of [['', 'parse'], ['{bad', 'parse'], ['null', 'validate'],
    ['[]', 'validate'], ['{}', 'validate'], ['{"name":"Lin","worldNpcs":{}}', 'validate']]) {
    test(`load rejects ${JSON.stringify(raw)} at ${stage} and guards the slot`, () => {
        const { run, storage } = game(raw);
        assert.equal(run("const live = G; G.stones = 77; loadState()"), false);
        assert.equal(run('getSaveLoadDiagnostics().loadFailure.stage'), stage);
        assert.equal(run('G === live && G.stones === 77 && !saveState()'), true);
        assert.equal(storage.raw, raw);
        assert.equal(storage.writes, 0);
    });
}

test('late migration failure rolls back nested state and zone, suppresses writes and permits retry', () => {
    const { run, storage } = game();
    const raw = run(`JSON.stringify({
        name: 'Lin', path: 'body', realmIdx: 3, ageMonths: 240, currentZone: 'jade',
        realmConsolidation: { 3: { defense: 9 } },
        worldNpcs: fixtureRoster, nextDemonicEmergenceMonths: 360,
        worldSchedule: [{ id: 'old', type: 'ordinary', at: 200 }]
    })`);
    storage.raw = raw;
    assert.equal(run(`
        const live = G;
        const liveTechniques = G.techniques;
        let catchUps = 0;
        function catchUpPlayerActivity() { catchUps++; }
        function ensureLocationState() {
            G.techniques.push({ name: 'candidate only' });
            if (saveState()) throw new Error('Unexpected migration write');
            throw new Error('Test migration failure');
        }
        loadState()
    `), false);
    assert.equal(run('G === live && G.techniques === liveTechniques && G.techniques.length === 0 && currentZone === "dustbone" && catchUps === 0'), true);
    assert.equal(run('getSaveLoadDiagnostics().loadFailure.message'), 'Test migration failure');
    assert.equal(run('saveState()'), false);
    assert.equal(storage.raw, raw);
    assert.equal(storage.writes, 0);

    assert.equal(run('ensureLocationState = () => {}; loadState()'), true);
    assert.equal(run(`G.name === 'Lin' && currentZone === 'jade' && G.path === 'body' &&
        G.cultivation.vessel.realmIdx === 3 && G.realmConsolidation[3].defense === 9 &&
        G.worldSchedule.find(event => event.id === 'old').at === 242 && catchUps === 1`), true);
    const first = run('JSON.stringify(G)');
    assert.equal(run('loadState()'), true);
    assert.equal(run('JSON.stringify(G)'), first);
    assert.equal(storage.raw, raw);
    assert.equal(storage.writes, 0);
    assert.equal(run('saveState()'), true);
});

test('activity catch-up can save after migration commits', () => {
    const { run, storage } = game('{"name":"Lin","stones":30}');
    assert.equal(run(`
        let catchUpSaved = null;
        function catchUpPlayerActivity() { G.stones += 5; catchUpSaved = saveState(); }
        loadState() && catchUpSaved
    `), true);
    assert.equal(JSON.parse(storage.raw).stones, 35);
    assert.equal(storage.writes, 1);
});

test('failed boot shows recovery and skips creation, rendering and activity catch-up', () => {
    const raw = '{broken';
    const { run, storage, elements, retries } = game(raw);
    run(`
        let started = 0;
        function setupCreation() { started++; saveState(); }
        function fullRender() { started++; saveState(); }
        function catchUpPlayerActivity() { started++; saveState(); }
        initGame();
    `);
    assert.equal(run('started'), 0);
    assert.equal(elements.get('creation-screen').style.display, 'none');
    assert.equal(elements.get('game-screen').style.display, 'none');
    assert.equal(elements.get('load-error').hidden, false);
    elements.get('retry-load').onclick();
    assert.equal(retries(), 1);
    assert.equal(run('saveState()'), false);
    assert.equal(storage.raw, raw);
    assert.equal(storage.writes, 0);
});

test('an unreadable storage slot blocks saving, while a missing slot starts creation', () => {
    const { run, storage } = game();
    storage.readError = Object.assign(new Error('Storage denied'), { name: 'SecurityError' });
    assert.equal(run('loadState()'), false);
    assert.equal(run('getSaveLoadDiagnostics().loadFailure.stage'), 'read');
    assert.equal(run('saveState()'), false);
    assert.equal(storage.writes, 0);

    storage.readError = null;
    run('let creations = 0; function setupCreation() { creations++; } initGame();');
    assert.equal(run('creations'), 1);
    assert.equal(run('getSaveLoadDiagnostics().loadFailure'), null);
    assert.equal(run('saveState()'), true);
});

test('successful boot still settles activity, sanitizes UI locks and autosaves', () => {
    const { run, storage, elements } = game('{"name":"Lin","stones":30,"inCombat":true}');
    run(`
        const bootSteps = [];
        addLog = () => {};
        function catchUpPlayerActivity() { bootSteps.push('catch up'); }
        function sanitizeOrphanedUiLocks() { bootSteps.push('sanitize'); G.inCombat = false; }
        function fullRender() { bootSteps.push('render'); saveState(); }
        initGame();
    `);
    assert.equal(run('bootSteps.join(",")'), 'catch up,sanitize,render');
    assert.equal(elements.get('creation-screen').style.display, 'none');
    assert.equal(elements.get('game-screen').style.display, 'flex');
    assert.equal(elements.get('load-error').hidden, true);
    assert.equal(JSON.parse(storage.raw).inCombat, false);
    assert.equal(storage.writes, 1);
});
