const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function game(files) {
    const storage = new Map();
    const context = vm.createContext({
        localStorage: {
            setItem: (key, value) => storage.set(key, value),
            getItem: key => storage.get(key)
        },
        console
    });
    for (const file of files) {
        vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
    }
    return code => vm.runInContext(code, context);
}

for (const [legacyPath, track] of [['qi', 'dantian'], ['body', 'vessel'], ['soul', 'spirit']]) {
    test(`legacy ${legacyPath} cultivation survives migration and repeat loads`, () => {
        const run = game(['data.js', 'core.js', 'foundation.js', 'cultivation-tracks.js', 'forbidden.js', 'world.js']);
        const state = JSON.parse(run(`
            // Exercise a load hook that reads cultivation before the migration runs.
            function ensureTalentState() { ensureCultivationTracksState(); }
            const fixture = { ...G, path: '${legacyPath}', realmIdx: 3, realmConsolidation: { 3: { defense: 12 } }, qi: 12 };
            delete fixture.cultivation;
            delete fixture._cultivationTracksMigrated;
            localStorage.setItem('xianxia_save', JSON.stringify(fixture));
            const snapshot = () => ({
                loaded: loadState(), path: G.path, realm: G.realmIdx, qi: G.qi,
                focus: G.cultivation.focusTrack, consolidation: G.cultivation.${track}.consolidation
            });
            const first = snapshot();
            const second = snapshot();
            saveState();
            JSON.stringify([first, second, snapshot()])
        `));
        const expected = {
            loaded: true, path: legacyPath, realm: 3, qi: 12, focus: track, consolidation: { 3: { defense: 12 } }
        };
        assert.deepEqual(state, [expected, expected, expected]);
    });
}

test('modern save keeps all tracks when legacy mirrors disagree', () => {
    const run = game(['data.js', 'core.js', 'foundation.js', 'cultivation-tracks.js', 'forbidden.js', 'world.js']);
    const state = JSON.parse(run(`
        const cultivation = {
            dantian: { realmIdx: 2, consolidation: {} },
            vessel: { realmIdx: 3, consolidation: { 3: { defense: 12 } } },
            spirit: { realmIdx: 1, consolidation: { 1: { focus: 9 } } },
            focusTrack: 'vessel', soulEmbryo: true, soulEmbryoOrigin: 'vessel'
        };
        localStorage.setItem('xianxia_save', JSON.stringify({
            ...G, cultivation, path: 'qi', realmIdx: 0, realmConsolidation: {},
            _cultivationTracksMigrated: true, mortalLadderVersion: MORTAL_LADDER_SAVE_VERSION
        }));
        const loaded = loadState();
        JSON.stringify({ loaded, unchanged: JSON.stringify(G.cultivation) === JSON.stringify(cultivation),
            path: G.path, realm: G.realmIdx, consolidation: G.realmConsolidation })
    `));
    assert.deepEqual(state, { loaded: true, unchanged: true, path: 'body', realm: 3, consolidation: { 3: { defense: 12 } } });
});

function sectStorage() {
    const run = game(['data.js', 'core.js', 'gear.js', 'travel-kit.js', 'sect.js', 'sect-inventory.js']);
    run(`
        addLog = () => {};
        G.sect = { inventory: { materials: { spirit_herb: 3 } } };
        const withdraw = qty => withdrawSectInventoryMaterial('spirit_herb', qty);
        const counts = () => [getSectMaterialCount('spirit_herb'), getMaterialCount('spirit_herb')];
    `);
    return run;
}

test('sect withdrawals preserve stock on full-kit rejection, including retries', () => {
    const run = sectStorage();
    assert.equal(run(`
        G.inventory = Array(Math.ceil(getTravelKitCapacity() / TRAVEL_KIT_BALANCE.curioWeight)).fill('curio');
        JSON.stringify([withdraw(2), withdraw(2), counts()])
    `), '[0,0,[3,0]]');
    assert.equal(run(`G.inventory = []; JSON.stringify([withdraw(2), counts()])`), '[2,[1,2]]');
});

test('sect withdrawal credits only available stock and cannot withdraw it twice', () => {
    const run = sectStorage();
    assert.equal(run('JSON.stringify([withdraw(2), withdraw(2), withdraw(2), counts()])'), '[2,1,0,[0,3]]');
});

function npcNearExpiry(monthsUntilAttempt, roll) {
    const run = game(['data.js', 'core.js', 'cultivation-tracks.js', 'world.js']);
    run(`
        addLog = () => {};
        let attempts = 0;
        Math.random = () => { attempts++; return ${roll}; };
        const npc = { alive: true, role: 'wanderer', realmIdx: 0, growthRate: 1,
            growthProgress: NPC_ECOSYSTEM.growthMonthsPerBreakthrough - ${monthsUntilAttempt} };
        G.realmIdx = 2;
        const originalLifespan = getWorldNpcLifespanMonths(npc);
        npc.ageMonths = originalLifespan - 10;
        G.worldNpcs = [npc];
        const result = () => JSON.stringify({
            alive: npc.alive, monthsPastOldLifespan: npc.ageMonths - originalLifespan,
            realm: npc.realmIdx, attempts
        });
    `);
    return run;
}

test('an NPC that breaks through before expiry survives bulk and stepped time', () => {
    const bulk = npcNearExpiry(1, 0);
    const stepped = npcNearExpiry(1, 0);
    const expected = { alive: true, monthsPastOldLifespan: 2, realm: 1, attempts: 1 };
    assert.deepEqual(JSON.parse(bulk('tickWorldNpcGrowth(12); result()')), expected);
    assert.deepEqual(JSON.parse(stepped('for (let i = 0; i < 48; i++) tickWorldNpcGrowth(0.25); result()')), expected);
});

test('a failed near-death breakthrough consumes the attempt and the NPC dies at expiry', () => {
    const run = npcNearExpiry(1, 0.99);
    assert.deepEqual(JSON.parse(run('tickWorldNpcGrowth(12); tickWorldNpcGrowth(120); result()')),
        { alive: false, monthsPastOldLifespan: 0, realm: 0, attempts: 1 });
});

for (const [when, months] of [['at', 10], ['after', 11]]) {
    test(`an NPC cannot attempt a breakthrough ${when} lifespan expiry`, () => {
        const bulk = npcNearExpiry(months, 0);
        const stepped = npcNearExpiry(months, 0);
        const expected = { alive: false, monthsPastOldLifespan: 0, realm: 0, attempts: 0 };
        assert.deepEqual(JSON.parse(bulk('tickWorldNpcGrowth(12); result()')), expected);
        assert.deepEqual(JSON.parse(stepped('for (let i = 0; i < 12; i++) tickWorldNpcGrowth(1); result()')), expected);
    });
}
