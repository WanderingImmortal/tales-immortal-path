/**
 * Procedural lesser sect generator tests (headless).
 * Run: node scripts/test-procedural-lesser-sects.js
 */
const path = require('path');
const gen = require(path.join(__dirname, '..', 'prototype', 'procedural-lesser-sects'));
const { TEST_CATALOG } = gen;

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

function generate(seed, perZone) {
    return gen.generateLesserSects({
        seed,
        catalog: TEST_CATALOG,
        sectsPerZone: perZone ?? 2,
        worldAgeMonths: 600
    });
}

// Determinism
const a = generate(4242, 2);
const b = generate(4242, 2);
assert(JSON.stringify(a) === JSON.stringify(b), 'same seed produces identical JSON');

// Variation across seeds
const c = generate(1, 2);
const d = generate(2, 2);
assert(JSON.stringify(c) !== JSON.stringify(d), 'different seeds produce different worlds');

// Validation
const valid = gen.validateLesserSectState(a, TEST_CATALOG);
assert(valid.ok, `generated state validates (${valid.errors.join(', ') || 'clean'})`);

// Unique ids and names
const ids = new Set();
const names = new Set();
a.sects.forEach(s => {
    assert(!ids.has(s.id), `unique id ${s.id}`);
    ids.add(s.id);
    const nk = gen.normalizeNameKey(s.name);
    assert(!names.has(nk), `unique name ${s.name}`);
    names.add(nk);
});

// Authored names not used
TEST_CATALOG.blockedNames.forEach(blocked => {
    assert(
        !a.sects.some(s => gen.normalizeNameKey(s.name) === gen.normalizeNameKey(blocked)),
        `does not spawn authored name ${blocked}`
    );
});

// Member refs
a.sects.forEach(s => {
    assert(s.leaderNpcUid && s.members.some(m => m.uid === s.leaderNpcUid), `leader ref for ${s.id}`);
    s.memberNpcUids.forEach(uid => {
        assert(s.members.some(m => m.uid === uid), `member ${uid} embedded on ${s.id}`);
    });
});

// Realm caps
a.sects.forEach(s => {
    const cap = TEST_CATALOG.zoneLeaderRealmCap[s.zone];
    const leader = s.members.find(m => m.uid === s.leaderNpcUid);
    assert(leader.realmIdx <= cap, `leader realm ${leader.realmIdx} <= cap ${cap} in ${s.zone}`);
});

// Save round-trip
const cloned = gen.serializeLesserSectState(a);
const afterLoad = gen.validateLesserSectState(cloned, TEST_CATALOG);
assert(afterLoad.ok, 'save/load JSON round-trip validates');

// Merge does not duplicate on reload
const merged = gen.mergeLesserSectState(a, a);
assert(merged.sects.length === a.sects.length, 'merge same state does not duplicate sects');

// Time-only advance preserves roster
const advanced = gen.advanceLesserSectsTimeOnly(a, 12, TEST_CATALOG);
assert(advanced.sects.length === a.sects.length, 'time advance keeps sect count');
advanced.sects.forEach((s, i) => {
    assert(s.id === a.sects[i].id, `sect id stable after time ${s.id}`);
    assert(
        JSON.stringify(s.memberNpcUids) === JSON.stringify(a.sects[i].memberNpcUids),
        `member list stable for ${s.id}`
    );
});

// Game bridge file exists and references separate storage from worldSects
const bridge = require('fs').readFileSync(
    path.join(__dirname, '..', 'procedural-lesser-sects.js'),
    'utf8'
);
assert(bridge.includes('G.world.lesserSects'), 'bridge uses G.world.lesserSects');
assert(!bridge.includes('worldSects.push'), 'bridge does not write player worldSects');

if (failed) {
    console.error(`\n${failed} test(s) failed`);
    process.exit(1);
}
console.log('\nAll procedural lesser sect tests passed.');
