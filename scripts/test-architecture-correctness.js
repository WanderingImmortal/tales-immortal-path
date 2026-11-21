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
