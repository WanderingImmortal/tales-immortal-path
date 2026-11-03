/**
 * Living world geography regression tests.
 * Run: node scripts/test-living-world-geography.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

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

const root = path.join(__dirname, '..');
const dataSrc = fs.readFileSync(path.join(root, 'data.js'), 'utf8');
const worldSrc = fs.readFileSync(path.join(root, 'world.js'), 'utf8');
const zMatch = worldSrc.match(/const ZONES = \{[\s\S]*?\n\};/);

const sandbox = { console };
vm.createContext(sandbox);
try {
    vm.runInContext(
        `${dataSrc}\n;this.__geoTest = { WORLD_GEOGRAPHY, WORLD_LOCATIONS, ZONE_LOCAL_LAYOUT };`,
        sandbox,
        { filename: 'data.js' }
    );
} catch (err) {
    fail(`data.js load: ${err.message}`);
    process.exit(1);
}
if (zMatch) {
    vm.runInContext(`${zMatch[0]}\n;this.__geoTest.ZONES = ZONES;`, sandbox, { filename: 'zones.js' });
}

const { WORLD_LOCATIONS, WORLD_GEOGRAPHY, ZONE_LOCAL_LAYOUT } = sandbox.__geoTest || {};
const zones = sandbox.__geoTest?.ZONES;

assert(WORLD_GEOGRAPHY?.continents, 'WORLD_GEOGRAPHY.continents defined');
assert(WORLD_GEOGRAPHY?.regionContinent, 'WORLD_GEOGRAPHY.regionContinent defined');

Object.keys(zones).forEach(regionId => {
    assert(!!WORLD_GEOGRAPHY.regionContinent[regionId], `region ${regionId} mapped to continent`);
});

Object.entries(WORLD_GEOGRAPHY.regionContinent).forEach(([regionId, contId]) => {
    const cont = WORLD_GEOGRAPHY.continents[contId];
    assert(cont && cont.regionIds.includes(regionId), `${regionId} listed on ${contId}`);
});

Object.values(WORLD_LOCATIONS).forEach(loc => {
    assert(!!zones[loc.parentZone], `location ${loc.id} parentZone ${loc.parentZone} valid`);
});

Object.entries(ZONE_LOCAL_LAYOUT).forEach(([zoneId, layout]) => {
    Object.keys(layout.nodes || {}).forEach(nodeId => {
        const def = WORLD_LOCATIONS[nodeId];
        assert(!!def, `layout node ${nodeId} in zone ${zoneId} exists in WORLD_LOCATIONS`);
        assert(def.parentZone === zoneId, `layout node ${nodeId} parentZone matches ${zoneId}`);
    });
    (layout.paths || []).forEach(p => {
        assert(WORLD_LOCATIONS[p.from], `path from ${p.from} exists`);
        assert(WORLD_LOCATIONS[p.to], `path to ${p.to} exists`);
    });
});

const dustboneNodes = Object.keys(ZONE_LOCAL_LAYOUT.dustbone?.nodes || {});
assert(dustboneNodes.length >= 15, `dustbone local map has expanded node count (${dustboneNodes.length})`);

const newSpots = [
    'brine_well_hamlet', 'salt_bloom_flats', 'whisper_marsh', 'scorpion_flats',
    'windcut_ridge', 'copper_vein_cut', 'red_dune_pass', 'fallen_pylon_ruins'
];
newSpots.forEach(id => {
    assert(!!WORLD_LOCATIONS[id], `starter expansion location ${id} authored`);
    assert(WORLD_LOCATIONS[id].resources?.length || WORLD_LOCATIONS[id].tags?.length, `${id} has tags or resources`);
});

// Generator + population reserved HQ option
const gen = require(path.join(root, 'prototype', 'procedural-lesser-sects'));
const catalog = gen.TEST_CATALOG;
const reserved = new Set(['ironscar_quarry']);
const a = gen.generateLesserSects({
    seed: 77,
    catalog,
    zones: ['dustbone'],
    sectsPerZone: 2,
    reservedHqIds: [...reserved]
});
a.sects.forEach(s => {
    assert(!reserved.has(s.headquartersLocationId), `reserved HQ not used for ${s.id}`);
});

if (failed) {
    console.error(`\n${failed} test(s) failed`);
    process.exit(1);
}
console.log('\nAll living world geography tests passed.');
