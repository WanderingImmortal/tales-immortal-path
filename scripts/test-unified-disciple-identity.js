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
        'data.js', 'core.js', 'foundation.js', 'forbidden.js', 'world-scheduler.js', 'world.js',
        'sect.js', 'sect-expand.js', 'sect-buildings.js', 'npc.js', 'story-arcs.js'
    ];
    for (const file of files) {
        vm.runInContext(fs.readFileSync(path.join(__dirname, '..', file), 'utf8'), context, { filename: file });
    }
    run(`
        // DOM logging and quest UI are outside this simulation harness.
        addLog = () => {};
        generateSectQuest = () => {};
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
            name: 'Lin', roleId: 'wanderer', realmIdx: 0, allowRandomDemonic: false
        });
        Object.assign(npc, { talkCount: 10, ageMonths: 300, wanderDueMonths: null, growthProgress: 0 });
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
        npc.growthProgress = NPC_ECOSYSTEM.growthMonthsPerBreakthrough - npc.growthRate;
        processWorldTime(G.ageMonths, G.ageMonths + 1);
        npc.realmIdx
    `), 1);
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
        G.sect.buildings.manual_hall = 1;
        ensureManualHallMeta();
        const [first, second] = TECHNIQUE_POOL;
        const hall = G.sect.buildingMeta.manual_hall;
        hall.collection[first.name] = { count: 1 };
        hall.collection[second.name] = { count: 1 };
        const assigned = assignDiscipleStudy(npc.uid, first.name).success;
        tickManualHallStudy(100);
        assigned && npc.knownTechniques.includes(first.name) &&
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

test('succession takes control of the chosen living disciple and clears their study', () => {
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
        applySectSuccession(npc.uid);
        G.sect.leaderNpcUid === npc.uid && G.name === npc.name &&
            !getWorldNpcByUid(npc.uid) && !getSectDiscipleMembership(npc.uid) &&
            getDiscipleCount() === 1 && getDiscipleMonthsServed(other) === 24 &&
            getActiveManualStudies().length === 0
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
