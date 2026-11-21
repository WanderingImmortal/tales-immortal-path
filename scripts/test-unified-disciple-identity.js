const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function newGame() {
    const storage = new Map();
    const context = vm.createContext({
        localStorage: {
            setItem: (key, value) => storage.set(key, value),
            getItem: key => storage.get(key)
        },
        console
    });
    const run = source => vm.runInContext(source, context);
    const files = [
        'data.js', 'core.js', 'foundation.js', 'cultivation-tracks.js', 'forbidden.js',
        'world-scheduler.js', 'world.js', 'ambient-npcs.js', 'procedural-lesser-sects.js',
        'sect.js', 'sect-expand.js', 'sect-buildings.js', 'npc.js', 'quests.js', 'story-arcs.js'
    ];
    for (const file of files) {
        vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
    }
    run(`
        // DOM logging and quest UI are outside this simulation harness.
        addLog = () => {};
        generateSectQuest = () => {};
        openSectEventPopup = () => {};
        function findNpcQuest() { return null; }
        function ensureNpcQuestState() {}
        function ensureSectInventory() { G.sect.inventory ||= { stones: 0, materials: {}, items: [] }; }
        Math.random = (() => {
            let seed = 42;
            return () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 2 ** 32);
        })();
        G.fame = 100;
        G.ageMonths = 360;
        G.lifespanMonths = 960;
        G.currentZone = 'dustbone';
        G.sect = createEmptySectState();
        Object.assign(G.sect, { stage: 'founding', name: 'Pine Hall', renown: 1000 });
        ensureSectState();
        const originalAge = G.ageMonths;
        const npc = generateWorldNpc('dustbone', {
            name: 'Lin', roleId: 'wanderer', realmIdx: 0, focusTrack: 'dantian', allowRandomDemonic: false
        });
        Object.assign(npc, { talkCount: 10, ageMonths: 300, wanderDueMonths: null });
        npc.cultivation.dantian.growthProgress = 0;
        syncNpcCultivationLegacyFields(npc);
        G.worldNpcs.push(npc);
        const runRecruit = () => recruitWorldNpcToSect(npc);
    `);
    return run;
}

test('recruitment keeps the registered UID and character state and prevents duplicate or conflicting membership', () => {
    const run = newGame();
    assert.equal(run(`
        npc.personalities = ['ambitious', 'loyal'];
        npc.foundation = { ambitions: ['understand the Dao'] };
        npc.relationship = { trust: 14 };
        G.npcAmbitions = { [npc.uid]: { objective: 'cultivate' } };
        const before = JSON.stringify(npc);
        // Isolate the membership mutation from time effects tested below.
        advanceTime = () => true;
        runRecruit().success
    `), true);
    assert.equal(run(`
        const { sectTemperament, ...after } = npc;
        JSON.stringify(after) === before &&
            G.worldNpcs.length === 1 && getWorldNpcByUid(npc.uid) === npc &&
            Object.keys(getSectDiscipleMembership(npc.uid)).sort().join() === 'joinedMonths,role,uid' &&
            G.npcAmbitions[npc.uid].objective === 'cultivate'
    `), true);
    assert.equal(run('runRecruit().success'), false);
    assert.equal(run('getDiscipleCount()'), 1);
    assert.equal(run(`
        const namesake = { ...npc, uid: 'namesake' };
        G.worldNpcs.push(namesake);
        namesake.lesserSectId = 'lesser_sect';
        const rivalBlocked = !recruitWorldNpcToSect(namesake).success;
        delete namesake.lesserSectId;
        namesake.affiliationId = 'well_ring_lodge';
        const lodgeBlocked = !canRecruitWorldNpc(namesake);
        delete namesake.affiliationId;
        rivalBlocked && lodgeBlocked && recruitWorldNpcToSect(namesake).success
    `), true);
    assert.equal(run('getDiscipleCount()'), 2);
});

test('the normal world clock ages and cultivates a recruit once per interval', () => {
    const run = newGame();
    assert.equal(run(`
        tickQuestSystems = () => {};
        runRecruit().success
    `), true);
    assert.equal(run(`
        const age = npc.ageMonths;
        const progress = npc.growthProgress;
        processWorldTime(G.ageMonths, G.ageMonths + 2);
        npc.ageMonths === age + 2 && npc.growthProgress === progress + 2 * npc.growthRate
    `), true);
    assert.equal(run(`
        Math.random = () => 0;
        npc.cultivation.dantian.growthProgress = NPC_ECOSYSTEM.growthMonthsPerBreakthrough - npc.growthRate;
        processWorldTime(G.ageMonths, G.ageMonths + 1);
        npc.realmIdx
    `), 1);
});

test('a dead NPC still in the world registry cannot join through either recruitment path', () => {
    const run = newGame();
    assert.equal(run(`
        npc.alive = false;
        advanceTime = () => { throw new Error('Ineligible recruitment advanced time'); };
        G.worldNpcs.includes(npc) && !canRecruitWorldNpc(npc) &&
            !runRecruit().success && !addSectDisciple(npc, 'acolyte') &&
            getDiscipleCount() === 0 && G.fame === 100
    `), true);
    assert.equal(run(`
        // Guard the membership write even if a lookup returns tombstones.
        getWorldNpcByUid = uid => G.worldNpcs.find(person => person.uid === uid);
        getRecruitWorldNpcBlockReason(npc) === 'They are gone.' &&
            !joinPlayerSect(npc, 'acolyte') && getDiscipleCount() === 0
    `), true);
});

test('death during recruitment stops the action without granting membership or rewards', () => {
    const run = newGame();
    assert.equal(run(`
        advanceTime = () => {
            npc.ageMonths = getWorldNpcLifespanMonths(npc) - 1;
            tickWorldNpcGrowth(1);
            return true;
        };
        !runRecruit().success && !npc.alive && G.fame === 100 && getDiscipleCount() === 0
    `), true);
});

test('promotion, studying, and death resolve membership by UID', () => {
    const run = newGame();
    assert.equal(run(`
        advanceTime = () => true;
        runRecruit();
        G.ageMonths += 120;
        const rankChanged = promoteDisciple(npc.uid).success;
        const membership = getSectDiscipleMembership(npc.uid);
        rankChanged && membership.role === DISCIPLE_ROLES.acolyte.promoteReq.next && npc.role === 'wanderer'
    `), true);
    assert.equal(run(`
        setNpcCultivationFocus(npc, 'vessel');
        G.sect.buildings.manual_hall = 1;
        ensureManualHallMeta();
        const [first, second] = TECHNIQUE_POOL;
        const hall = G.sect.buildingMeta.manual_hall;
        hall.collection[first.name] = { count: 1 };
        hall.collection[second.name] = { count: 1 };
        const assigned = assignDiscipleStudy(npc.uid, first.name).success;
        tickManualHallStudy(100);
        assigned && npc.knownTechniques.includes(first.name) && npc.cultivation.focusTrack === 'vessel' &&
            !membership.knownTechniques && !hall.collection[first.name]
    `), true);
    assert.equal(run(`
        const assignedAgain = assignDiscipleStudy(npc.uid, second.name).success;
        npc.ageMonths = getWorldNpcLifespanMonths(npc) - 1;
        tickWorldNpcGrowth(1);
        tickManualHallStudy(100);
        assignedAgain && !npc.alive && getDiscipleCount() === 0 &&
            G.disciples.length === 0 && getActiveManualStudies().length === 0 &&
            hall.collection[second.name].count === 1 &&
            !promoteDisciple(npc.uid).success && !assignDiscipleStudy(npc.uid, second.name).success
    `), true);
    assert.equal(run(`
        G.sectQuests = [{ status: 'active', deadlineMonths: G.ageMonths, title: 'Last mission' }];
        tickSectQuestGeneration(1);
        G.sectQuests[0].status
    `), 'failed');
});

test('membership and its authoritative NPC survive saving and loading', () => {
    const run = newGame();
    assert.equal(run(`
        advanceTime = () => true;
        runRecruit();
        npc.knownTechniques = ['Falling Leaf'];
        const uid = npc.uid;
        saveState();
        G.sect = null;
        G.worldNpcs = [];
        G.disciples = [];
        loadState()
    `), true);
    assert.equal(run(`
        getDiscipleCount() === 1 && G.disciples[0] === 'Lin' &&
            getDiscipleNpc(getSectDiscipleMembership(uid)) === getWorldNpcByUid(uid) &&
            getWorldNpcByUid(uid).knownTechniques[0] === 'Falling Leaf' &&
            G.worldNpcs.filter(person => person.uid === uid).length === 1
    `), true);
});

test('loading restores a matched recruit and preserves unmatched and name-only disciples', () => {
    const run = newGame();
    assert.equal(run(`
        const uid = npc.uid;
        npc.alive = false;
        npc.recruitedToSect = true;
        npc.impression = 12;
        npc.knownTechniques = ['Old art'];
        G._sectMigrated = true;
        delete G.sect.discipleIdentityVersion;
        G.disciples = ['Lin', 'Bo', 'Name only'];
        G.sect.discipleRecords = [
            { uid: 'disc_lin', name: 'Lin', role: 'core', trait: 'wise', joinedMonths: 220, knownTechniques: ['Hall art'] },
            { uid: 'disc_bo', name: 'Bo', role: 'acolyte', joinedMonths: 300 }
        ];
        G.sect.buildingMeta.manual_hall = {
            collection: {}, studies: [{ uid: 'study', discipleUid: 'disc_lin', discipleName: 'Lin', progressMonths: 3 }]
        };
        localStorage.setItem('xianxia_save', JSON.stringify(G));
        loadState()
    `), true);
    assert.equal(run(`
        const restored = getWorldNpcByUid(uid);
        const lin = getSectDiscipleMembership(uid);
        const study = getActiveManualStudies()[0];
        restored.impression === 12 && restored.ageMonths === 300 && !restored.recruitedToSect &&
            restored.knownTechniques.join() === 'Old art,Hall art' && restored.sectTemperament === 'wise' &&
            lin.joinedMonths === 220 && lin.role === 'core' && study.discipleUid === uid && study.progressMonths === 3 &&
            getWorldNpcByUid('disc_bo').name === 'Bo' && G.disciples.includes('Name only') &&
            getDiscipleCount() === 3
    `), true);
    assert.equal(run(`
        saveState();
        loadState() && getDiscipleCount() === 3 && G.worldNpcs.filter(person => person.uid === uid).length === 1
    `), true);
});


test('story recruitment reuses the redeemed NPC and gives Liang Chen one world identity', () => {
    const run = newGame();
    assert.equal(run(`
        advanceTime = () => true;
        function closeQuestPopup() {}
        function fullRender() {}
        function completeNpcQuestByGiver() {}
        function applyStoryArcRewards() {}
        function getStoryArcState(id) { return G.storyArcState[id]; }
        function shiftNpcRelationship() {}
        npc.role = 'demonic_talent';
        npc.isDemonicTalent = true;
        G.demonicRedemption = { status: 'active', stage: 3, targetUid: npc.uid };
        resolveDemonicRedemption('redeem');
        G.storyArcState = { liang_chen_rival: { liangFate: 'ally' } };
        applyArcCompletionExtras('liang_chen_rival', 'ally');
        const liang = getDiscipleNpc(getSectDiscipleMembership('liang_chen'));
        G.demonicRedemption.status === 'complete' && getDiscipleNpc(getSectDiscipleMembership(npc.uid)) === npc &&
            G.worldNpcs.length === 2 && getDiscipleCount() === 2 &&
            liang.name === NPCS.liang_chen.name && liang.personalities.join() === NPCS.liang_chen.personalities.join() &&
            !isNpcPresent('liang_chen', 'dustbone')
    `), true);
});

test('succession uses the NPC realm and age while preserving calendar dates', () => {
    const run = newGame();
    assert.equal(run(`
        advanceTime = () => true;
        runRecruit();
        G.sect.buildings.manual_hall = 1;
        ensureManualHallMeta();
        const manual = TECHNIQUE_POOL[0].name;
        G.sect.buildingMeta.manual_hall.collection[manual] = { count: 1 };
        assignDiscipleStudy(npc.uid, manual);
        const other = addSectDisciple('Other', 'acolyte');
        G.ageMonths += 24;
        npc.cultivation.dantian.realmIdx = 2;
        npc.cultivation.vessel.realmIdx = 3;
        npc.cultivation.spirit.realmIdx = 1;
        setNpcCultivationFocus(npc, 'vessel');
        setTrackRealmIdx('vessel', 4);
        setTrackRealmIdx('dantian', 5);
        setFocusTrack('vessel');
        const calendarMonth = G.ageMonths;
        const joinedMonth = other.joinedMonths;
        const npcLifespan = getWorldNpcLifespanMonths(npc);
        const eventMonth = calendarMonth + 2;
        const firings = [];
        registerWorldEventHandler('succession_test', () => firings.push(G.ageMonths));
        scheduleWorldEvent('succession_test', eventMonth);
        applySectSuccession(npc.uid);
        G.sect.leaderNpcUid === npc.uid && G.name === npc.name &&
            !getWorldNpcByUid(npc.uid) && !getSectDiscipleMembership(npc.uid) &&
            getDiscipleCount() === 1 && getDiscipleMonthsServed(other) === 24 &&
            other.joinedMonths === joinedMonth && G.ageMonths === calendarMonth &&
            getPlayerAgeMonths() === npc.ageMonths && getPlayerLifespanMonths() === npcLifespan &&
            G.lifespanMonths - G.ageMonths === npcLifespan - npc.ageMonths &&
            getFocusTrack() === 'vessel' && getEffectiveRealmTier() === 3 &&
            getTrackRealmIdx('dantian') === 2 && getTrackRealmIdx('vessel') === 3 && getTrackRealmIdx('spirit') === 1 &&
            getActiveManualStudies().length === 0
    `), true);
    assert.equal(run(`
        tickQuestSystems = () => {};
        processWorldTime(calendarMonth, eventMonth + 1);
        firings.join() === String(eventMonth) && getPlayerAgeMonths() === npc.ageMonths + 3
    `), true);
    assert.equal(run(`
        setTrackRealmIdx('vessel', 4);
        extendLifespanOnBreakthrough();
        getPlayerLifespanMonths() === getLifespanForRealm(4)
    `), true);
    assert.equal(run(`
        saveState();
        const birthMonth = G.playerBirthMonth;
        G.playerBirthMonth = 0;
        loadState() && G.playerBirthMonth === birthMonth &&
            getPlayerAgeMonths() === npc.ageMonths + 3 && getFocusTrack() === 'vessel' &&
            getTrackRealmIdx('dantian') === 2 && getTrackRealmIdx('vessel') === 4 &&
            getTrackRealmIdx('spirit') === 1
    `), true);
});

test('ambiguous legacy recruits preserve the disciple without reviving a guessed identity', () => {
    const run = newGame();
    assert.equal(run(`
        npc.alive = false;
        npc.recruitedToSect = true;
        const second = { ...npc, uid: 'second-legacy-lin' };
        G.worldNpcs.push(second);
        delete G.sect.discipleIdentityVersion;
        G.sect.discipleRecords = [{ uid: 'disc_lin', name: 'Lin', role: 'inner', joinedMonths: 230 }];
        G.disciples = ['Lin'];
        migrateSectForExistingSave();
        const member = getSectDiscipleMembership('disc_lin');
        !npc.alive && !second.alive && getDiscipleCount() === 1 &&
            member.role === 'inner' && member.joinedMonths === 230 && getDiscipleNpc(member).name === 'Lin'
    `), true);
});

test('procedural NPCs start with realm and progress on their chosen focus', () => {
    const run = newGame();
    assert.equal(run(`
        const focuses = new Set();
        for (let i = 0; i < 24; i++) {
            const person = generateWorldNpc('dustbone', { roleId: 'wanderer', realmIdx: 1, allowRandomDemonic: false });
            const { focusTrack, dantian } = person.cultivation;
            const focused = person.cultivation[focusTrack];
            const otherTracks = CULTIVATION_TRACKS.filter(track => track !== focusTrack);
            if (focused.realmIdx !== 1 || focused.growthProgress < 0 || focused.growthProgress >= 40 ||
                person.realmIdx !== dantian.realmIdx || person.growthProgress !== dantian.growthProgress ||
                otherTracks.some(track => person.cultivation[track].realmIdx || person.cultivation[track].growthProgress)) {
                throw new Error('Unexpected starting cultivation for ' + focusTrack);
            }
            focuses.add(focusTrack);
        }
        [...focuses].sort().join()
    `), 'dantian,spirit,vessel');
});

test('authored and demonic Qi specialists retain their starting realms', () => {
    const run = newGame();
    assert.equal(run(`
        setTrackRealmIdx('dantian', 2);
        const authored = createSectDiscipleNpc('Liang Chen', null, 'liang_chen');
        const demonic = generateWorldNpc('dustbone', { roleId: 'demonic_talent', forceDemonic: true, realmIdx: 1 });
        authored.cultivation.focusTrack === 'dantian' && authored.realmIdx === 2 &&
            authored.cultivation.dantian.realmIdx === 2 && demonic.cultivation.focusTrack === 'dantian' &&
            demonic.realmIdx === 1 && demonic.cultivation.dantian.realmIdx === 1
    `), true);
});

test('a legacy NPC keeps its realm and growth as Qi even above its current growth ceiling', () => {
    const run = newGame();
    assert.equal(run(`
        const uid = npc.uid;
        delete npc.cultivation;
        Object.assign(npc, { realmIdx: 4, growthProgress: 83.5, knownTechniques: ['Falling Leaf'] });
        G.mortalLadderVersion = 7;
        G._nineRealmLadderMigrated = false;
        localStorage.setItem('xianxia_save', JSON.stringify(G));
        if (!loadState()) throw new Error('Legacy save did not load');
        const restored = getWorldNpcByUid(uid);
        const c = restored.cultivation;
        c.focusTrack === 'dantian' && restored.realmIdx === 5 && c.dantian.realmIdx === 5 &&
            restored.growthProgress === 83.5 && c.dantian.growthProgress === 83.5 &&
            c.vessel.realmIdx === 0 && c.spirit.realmIdx === 0 && !canWorldNpcGrow(restored) &&
            restored.knownTechniques.join() === 'Falling Leaf'
    `), true);
});

test('growth follows a recruit’s focus and advances all three tracks independently', () => {
    const run = newGame();
    assert.equal(run(`
        advanceTime = () => true;
        runRecruit();
        const base = NPC_ECOSYSTEM.growthMonthsPerBreakthrough;
        const age = npc.ageMonths;
        addNpcCultivationProgress(npc, 'dantian', base - 1);
        setNpcCultivationFocus(npc, 'vessel');
        addNpcCultivationProgress(npc, 'vessel', base - 1);
        Math.random = () => 0;
        tickWorldNpcGrowth(2);
        const tracks = npc.cultivation;
        const bodyAdvanced = tracks.vessel.realmIdx === 1 && tracks.vessel.growthProgress === 1 &&
            tracks.dantian.realmIdx === 0 && tracks.dantian.growthProgress === base - 1 &&
            tracks.spirit.realmIdx === 0 && tracks.spirit.growthProgress === 0 && npc.realmIdx === 0;
        setNpcCultivationFocus(npc, 'dantian');
        tickWorldNpcGrowth(3);
        const qiAdvanced = tracks.dantian.realmIdx === 1 && tracks.dantian.growthProgress === 2 &&
            tracks.vessel.realmIdx === 1 && tracks.vessel.growthProgress === 1 && npc.realmIdx === 1;
        setNpcCultivationFocus(npc, 'spirit');
        addNpcCultivationProgress(npc, 'spirit', base - 1);
        const invalidFocusRejected = !setNpcCultivationFocus(npc, 'alchemy');
        tickWorldNpcGrowth(4);
        bodyAdvanced && qiAdvanced && invalidFocusRejected && tracks.focusTrack === 'spirit' &&
            tracks.spirit.realmIdx === 1 && tracks.spirit.growthProgress === 3 &&
            tracks.dantian.growthProgress === 2 && tracks.vessel.growthProgress === 1 &&
            npc.ageMonths === age + 9 && npc.growthProgress === 2 &&
            getDiscipleNpc(getSectDiscipleMembership(npc.uid)) === npc
    `), true);
});

test('track focus, fractional progress and learned arts survive save and load', () => {
    const run = newGame();
    assert.equal(run(`
        advanceTime = () => true;
        runRecruit();
        npc.cultivation.vessel.realmIdx = 2;
        npc.cultivation.spirit.realmIdx = 1;
        setNpcCultivationFocus(npc, 'spirit');
        addNpcCultivationProgress(npc, 'vessel', 22.5);
        addNpcCultivationProgress(npc, 'spirit', 37.75);
        npc.knownTechniques = ['Falling Leaf'];
        const uid = npc.uid;
        const expected = JSON.stringify(npc.cultivation);
        saveState();
        G.worldNpcs = [];
        if (!loadState()) throw new Error('NPC tracks did not load');
        const restored = getDiscipleNpc(getSectDiscipleMembership(uid));
        JSON.stringify(restored.cultivation) === expected &&
            restored.knownTechniques.join() === 'Falling Leaf' && restored.realmIdx === 0
    `), true);
});

test('the strongest track sets lifespan while combat keeps the Qi baseline and text names each path', () => {
    const run = newGame();
    assert.equal(run(`
        npc.cultivation.vessel.realmIdx = 2;
        npc.cultivation.spirit.realmIdx = 1;
        setNpcCultivationFocus(npc, 'vessel');
        const qiOnly = { realmIdx: npc.realmIdx };
        const sameCombat = JSON.stringify(calcNpcCombatStats(npc, 'rival')) ===
            JSON.stringify(calcNpcCombatStats(qiOnly, 'rival'));
        setTrackRealmIdx('spirit', 3);
        setFocusTrack('spirit');
        const observation = getWorldNpcObserveText(npc);
        const correctNames = observation.includes('Qi: ' + PATHS.qi.realms[0]) &&
            observation.includes('Body: ' + PATHS.body.realms[2]) &&
            observation.includes('Soul: ' + PATHS.soul.realms[1]) &&
            getWorldNpcStrengthLabel(npc).includes('Peer · Qi: ' + PATHS.qi.realms[0]);
        npc.ageMonths = getLifespanForRealm(0);
        const longLife = getWorldNpcLifespanMonths(npc) === getLifespanForRealm(2);
        tickWorldNpcGrowth(1);
        const survivedQiLimit = npc.alive && npc.ageMonths === getLifespanForRealm(0) + 1;
        npc.ageMonths = getLifespanForRealm(2) - 1;
        tickWorldNpcGrowth(2);
        sameCombat && correctNames && longLife && survivedQiLimit &&
            !npc.alive && npc.ageMonths === getLifespanForRealm(2)
    `), true);
});

test('ambient promotion and lesser-sect registration initialize the world NPC tracks once', () => {
    const run = newGame();
    assert.equal(run(`
        const stranger = spawnAmbientNpc('dustbone');
        const stateBefore = stranger.cultivation;
        setNpcCultivationFocus(stranger, 'spirit');
        stranger.role = 'wanderer';
        stranger.realmBand = 'foundation';
        promoteAmbientToPersistent(stranger);
        const promoted = stranger.state === 'persistent' && stranger.cultivation === stateBefore &&
            stranger.cultivation.focusTrack === 'spirit' &&
            stranger.cultivation.spirit.realmIdx >= 1 && stranger.cultivation.dantian.realmIdx === 0 &&
            stranger.realmIdx === 0 && stranger.growthProgress === 0;
        const lesserSect = { sects: [{
            id: 'pine_branch', zone: 'dustbone',
            members: [{ uid: 'pine_member', name: 'Bo', role: 'disciple', realmIdx: 2 }]
        }] };
        registerLesserSectNpcsOnWorld(lesserSect);
        const member = getWorldNpcByUid('pine_member');
        setNpcCultivationFocus(member, 'vessel');
        addNpcCultivationProgress(member, 'vessel', 14);
        registerLesserSectNpcsOnWorld(lesserSect);
        promoted && getWorldNpcByUid('pine_member') === member &&
            member.cultivation.dantian.realmIdx === 2 &&
            member.cultivation.focusTrack === 'vessel' && member.cultivation.vessel.growthProgress === 14
    `), true);
});
