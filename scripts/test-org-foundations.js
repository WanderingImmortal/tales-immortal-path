/**
 * Organisation foundations tests (capability vs institution vs constraints).
 * Run: node scripts/test-org-foundations.js
 */
const path = require('path');
const org = require(path.join(__dirname, '..', 'org-foundations.js'));
const gen = require(path.join(__dirname, '..', 'prototype', 'procedural-lesser-sects'));

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

const ctxBase = { worldAgeMonths: 600, zoneLeaderRealmCap: 2, facilityTier: 0 };

const highFounderSect = {
    id: 'test_sect',
    size: 'minor',
    focus: 'sword',
    focusLabel: 'Sword cultivation',
    doctrine: 'balanced',
    foundedAtMonths: 580,
    members: [
        { uid: 'a', name: 'Apex', role: 'leader', realmIdx: 2 },
        { uid: 'b', name: 'D1', role: 'disciple', realmIdx: 0 },
        { uid: 'c', name: 'D2', role: 'disciple', realmIdx: 0 }
    ],
    leaderNpcUid: 'a'
};

const profileHigh = org.deriveOrganizationProfile(highFounderSect, ctxBase);
assert(profileHigh.capability.apexRealmIdx === 2, 'capability tracks apex realm');
assert(profileHigh.institutionalMaturity === 'nascent', 'GC-level founder does not auto-mature institution');

const rootedSect = {
    ...highFounderSect,
    foundedAtMonths: 200,
    members: [
        { uid: 'a', name: 'Leader', role: 'leader', realmIdx: 2 },
        { uid: 'b', name: 'E1', role: 'disciple', realmIdx: 1 },
        { uid: 'c', name: 'E2', role: 'disciple', realmIdx: 1 },
        { uid: 'd', name: 'D1', role: 'disciple', realmIdx: 0 },
        { uid: 'e', name: 'D2', role: 'disciple', realmIdx: 0 },
        { uid: 'f', name: 'D3', role: 'disciple', realmIdx: 0 },
        { uid: 'g', name: 'D4', role: 'disciple', realmIdx: 0 }
    ]
};
const profileRooted = org.deriveOrganizationProfile(rootedSect, { ...ctxBase, facilityTier: 1 });
assert(profileRooted.institutionalMaturity === 'rooted', 'maturity from age, depth, and facilities — not leader alone');

const afterLoss = org.deriveOrganizationAfterMemberLoss(rootedSect, 'a', { ...ctxBase, facilityTier: 1 });
assert(afterLoss.profile.foundation.stabilityScore > 40, 'institution retains stability after losing apex');
assert(afterLoss.profile.capability.apexRealmIdx < 2, 'capability drops when strongest member leaves');
assert(afterLoss.profile.inheritances.internal.length > 0, 'inheritances remain as assets');

(afterLoss.profile.inheritances.public || []).concat(afterLoss.profile.inheritances.internal || []).forEach(asset => {
    assert(asset.grantsBreakthrough === false, `inheritance ${asset.id} does not auto-grant breakthrough`);
});

assert(!org.canAscendOrganization(profileHigh), 'resource/talent constraints block ascension for nascent org');
const relieved = org.applyExceptionalGrowthRelief(profileHigh, 'regional_vein_ceiling');
assert(org.canAscendOrganization(relieved) || relieved.growthConstraints.length < profileHigh.growthConstraints.length,
    'exceptional relief can remove a growth constraint');

const schoolSect = { ...highFounderSect, size: 'school' };
const schoolProfile = org.deriveOrganizationProfile(schoolSect, ctxBase);
assert(schoolProfile.orgKind === 'school', 'school size maps to school org kind');
assert(schoolProfile.growthConstraints.some(c => c.code === 'school_scale'), 'school classification constraint present');

const generated = gen.generateLesserSects({ seed: 42, catalog: gen.TEST_CATALOG, zones: ['dustbone'], sectsPerZone: 2 });
generated.sects.forEach(s => {
    const p = org.deriveOrganizationProfile(s, { worldAgeMonths: 600, zoneLeaderRealmCap: 2, facilityTier: 1 });
    assert(p.capability.apexRealmIdx <= 2, `generated sect ${s.id} apex within zone cap`);
});

const enriched = org.enrichLesserSectOrganization(generated.sects[0], { worldAgeMonths: 600, zoneLeaderRealmCap: 2 });
const brief = org.getPublicOrganizationBrief(enriched);
assert(brief && brief.name, 'public brief available');
const briefJson = JSON.stringify(brief);
assert(!briefJson.includes('fragment'), 'public brief omits internal fragment labels');
assert(!briefJson.includes('vault'), 'public brief omits vault wording');

const hqMap = new Map();
generated.sects.forEach(s => {
    assert(s.headquartersLocationId, 'HQ id present');
    assert(!hqMap.has(s.headquartersLocationId), `unique HQ ${s.headquartersLocationId}`);
    hqMap.set(s.headquartersLocationId, s.id);
});

const roundTrip = JSON.parse(JSON.stringify(enriched));
assert(roundTrip.organization.version === org.ORG_FOUNDATIONS_VERSION, 'organization survives JSON round trip');

if (failed) {
    console.error(`\n${failed} test(s) failed`);
    process.exit(1);
}
console.log('\nAll organisation foundation tests passed.');
