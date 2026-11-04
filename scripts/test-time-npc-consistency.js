/**
 * Time advancement and NPC/org consistency.
 * Run: node scripts/test-time-npc-consistency.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const org = require(path.join(root, 'org-foundations.js'));
const gen = require(path.join(root, 'prototype', 'procedural-lesser-sects'));

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

function read(name) {
    return fs.readFileSync(path.join(root, name), 'utf8');
}

function extractUntil(src, startName, nextName) {
    const start = src.indexOf('function ' + startName);
    const end = src.indexOf('function ' + nextName);
    if (start < 0 || end < 0 || end <= start) throw new Error(`extract ${startName}`);
    return src.slice(start, end);
}

// --- 1 & 2. Authoritative NPC realm and death drive living capability ---
{
    const sect = {
        id: 'ls_test',
        name: 'Misty Pine Hall',
        kind: 'lesser_sect',
        size: 'minor',
        focus: 'sword',
        focusLabel: 'Sword cultivation',
        doctrine: 'balanced',
        foundedAtMonths: 100,
        leaderNpcUid: 'm1',
        members: [
            { uid: 'm1', name: 'Lin', role: 'leader', realmIdx: 0, alive: true },
            { uid: 'm2', name: 'Bo', role: 'disciple', realmIdx: 0, alive: true }
        ]
    };
    const npcs = [
        { uid: 'm1', name: 'Lin', realmIdx: 2, ageMonths: 480, zone: 'dustbone', alive: true, lesserSectId: 'ls_test' },
        { uid: 'm2', name: 'Bo', realmIdx: 1, ageMonths: 300, zone: 'dustbone', alive: true, lesserSectId: 'ls_test' }
    ];
    const ctx = { worldNpcs: npcs, worldAgeMonths: 600, zoneLeaderRealmCap: 2, facilityTier: 1 };
    const advanced = org.deriveOrganizationProfile(sect, ctx);
    assert(advanced.capability.apexRealmIdx === 2, 'NPC realm advancement raises org apex');
    assert(advanced.capability.memberCount === 2, 'living members still counted');
    assert(sect.members[0].realmIdx === 0, 'roster snapshot realm is not rewritten');
    assert(advanced.capability.byRealm[2] === 1 && advanced.capability.byRealm[1] === 1, 'capability bands follow current NPC realms');

    npcs[0].alive = false;
    npcs[0].realmIdx = 4;
    const afterDeath = org.deriveOrganizationProfile(sect, ctx);
    assert(afterDeath.capability.memberCount === 1, 'deceased member leaves the living roster count');
    assert(afterDeath.capability.apexRealmIdx === 1, 'deceased member does not set living apex');
    assert(afterDeath.capability.combatBand === 'minimal', 'deceased high realm does not raise living combat band');
    assert(!afterDeath.capability.byRealm[4], 'dead realm is absent from living realm counts');

    const brief = org.getPublicOrganizationBrief(sect, ctx);
    assert(brief.leaderRealmLabel === 'deceased', 'public brief marks a dead leader');
    assert(brief.memberCount === 1, 'public roster count follows living capability');

    const saved = JSON.parse(JSON.stringify({ sect, npcs, organizationVersion: advanced.version }));
    const reloaded = org.deriveOrganizationProfile(saved.sect, {
        worldNpcs: saved.npcs,
        worldAgeMonths: 600,
        zoneLeaderRealmCap: 2
    });
    assert(saved.sect.members[0].uid === saved.npcs[0].uid, 'save/load keeps membership uid');
    assert(saved.npcs[0].lesserSectId === saved.sect.id, 'save/load keeps sect id on the NPC');
    assert(reloaded.capability.apexRealmIdx === afterDeath.capability.apexRealmIdx, 'reloaded capability matches pre-save living state');
    assert(reloaded.capability.memberCount === 1, 'reloaded living count ignores the deceased member');
}

// --- 6. Authored names, player rivals, and procedural sects stay distinct ---
{
    const generated = gen.generateLesserSects({
        seed: 199,
        catalog: gen.TEST_CATALOG,
        zones: ['dustbone'],
        sectsPerZone: 2,
        worldAgeMonths: 400
    });
    assert(generated.sects.every(s => s.kind === 'lesser_sect'), 'procedural records stay lesser sects');
    assert(generated.sects.every(s => s.relationship == null && s.power == null), 'procedural sects do not use player-rival power fields');
    const blocked = gen.LESSER_SECT_BLOCKED_NAMES || gen.TEST_CATALOG.blockedNames || [];
    blocked.forEach(name => {
        assert(
            !generated.sects.some(s => String(s.name).toLowerCase() === String(name).toLowerCase()),
            `procedural gen does not take authored name ${name}`
        );
    });

    const playerRival = {
        id: 'world_rival',
        name: 'Iron Veil Sect',
        relationship: 'hostile',
        power: 40,
        renown: 12,
        stage: 'established'
    };
    const rivalProfile = org.deriveOrganizationProfile(playerRival, {
        worldAgeMonths: 400,
        worldNpcs: [{ uid: 'stranger', realmIdx: 5, alive: true }]
    });
    assert(rivalProfile.capability.memberCount === 0, 'unrelated NPCs do not join a player rival record');
    assert(playerRival.power === 40 && playerRival.relationship === 'hostile', 'player rival fields stay on their own record');

    const school = org.deriveOrganizationProfile({
        size: 'school',
        focus: 'dao',
        doctrine: 'balanced',
        foundedAtMonths: 500,
        members: [{ uid: 'a', realmIdx: 1, role: 'leader' }],
        leaderNpcUid: 'a'
    }, { worldAgeMonths: 520, zoneLeaderRealmCap: 2 });
    assert(school.orgKind === 'school', 'school-sized orgs keep the school classification');
    assert(school.growthConstraints.some(c => c.code === 'school_scale'), 'school constraint remains');
}

// --- Shared time helpers: short steps vs one long jump ---
{
    const rules = read('advance-time-rules.js');
    const ctx = vm.createContext({ Math, Number, console });
    vm.runInContext(rules, ctx);

    const steppedMonths = (() => {
        let last = 0;
        let steps = 0;
        for (let m = 1; m <= 120; m++) {
            const mark = ctx.calendarMonthSteps(last, m);
            steps += mark.steps;
            last = mark.nextMark;
        }
        return steps;
    })();
    const batchMonths = ctx.calendarMonthSteps(0, 120);
    assert(steppedMonths === 120 && batchMonths.steps === 120, '120 monthly steps match one 120-month board span');

    const steppedWeeks = (() => {
        let last = 0;
        let steps = 0;
        for (let w = 1; w <= 48; w++) {
            const mark = ctx.calendarMonthSteps(last, w * 0.25);
            steps += mark.steps;
            last = mark.nextMark;
        }
        return steps;
    })();
    assert(steppedWeeks === ctx.calendarMonthSteps(0, 12).steps, '48 week-steps match one 12-month board span');

    const fresh = ctx.calendarMonthSteps(-1, 240);
    assert(fresh.uninitialized === true && fresh.steps === 0, 'first board mark does not backfill historical months');

    const yearly = (() => {
        let last = 0;
        let steps = 0;
        for (let y = 1; y <= 10; y++) {
            const mark = ctx.catchUpIntervalMarks(last, y * 12, 12, 800);
            steps += mark.steps;
            last = mark.nextMark;
        }
        return steps;
    })();
    const jumped = ctx.catchUpIntervalMarks(0, 120, 12, 800);
    assert(yearly === 10 && jumped.steps === 10 && jumped.nextMark === 120, '10 yearly rival intervals match one 10-year jump');
}

// --- Rent and lodge board: week steps vs one jump ---
{
    const rentSrc = extractUntil(read('qc-depth.js'), 'tickDwellingRent()', 'getDwellingRestMult');
    const boardSrc = extractUntil(read('qc-depth.js'), 'tickWellRingCalendar()', 'actionWellRingJoin');
    const rules = read('advance-time-rules.js');

    function rentLeft(mode) {
        const ctx = vm.createContext({
            G: {
                stones: 500,
                ageMonths: 100,
                dwelling: { mode: 'rent', rentPaidThroughMonth: 100, settlementId: 'redwell' }
            },
            REDWELL_RENT: { cost: 8 },
            ensureQcDepthState: () => {},
            addLog: () => {},
            maybeWarnDwellingRentRunway: () => {},
            console
        });
        vm.runInContext(rentSrc, ctx);
        if (mode === 'batch') {
            ctx.G.ageMonths = 112;
            ctx.tickDwellingRent();
        } else {
            for (let w = 1; w <= 48; w++) {
                ctx.G.ageMonths = 100 + w * 0.25;
                ctx.tickDwellingRent();
            }
        }
        return ctx.G.stones;
    }
    assert(rentLeft('weeks') === rentLeft('batch'), 'rent charged for 12 months matches 48 weekly checks');

    function boardMerit(mode) {
        const ctx = vm.createContext({
            G: {
                ageMonths: 0,
                _quietTime: false,
                wellRing: {
                    member: true,
                    merit: 10,
                    rivalMerit: 4,
                    lastMissionMonth: 0,
                    lastBoardMonth: 0,
                    lastTournamentYear: 0,
                    tournamentDue: false
                }
            },
            Math: { floor: Math.floor, random: () => 0 },
            Number,
            ensureWellRingState: () => {},
            getWellRingPlayerRank: () => 1,
            addLog: () => {},
            console
        });
        vm.runInContext(rules, ctx);
        vm.runInContext(boardSrc, ctx);
        if (mode === 'batch') {
            ctx.G.ageMonths = 36;
            ctx.tickWellRingCalendar();
        } else if (mode === 'months') {
            for (let m = 1; m <= 36; m++) {
                ctx.G.ageMonths = m;
                ctx.tickWellRingCalendar();
            }
        } else {
            for (let w = 1; w <= 144; w++) {
                ctx.G.ageMonths = w * 0.25;
                ctx.tickWellRingCalendar();
            }
        }
        return ctx.G.wellRing.rivalMerit;
    }
    const byMonth = boardMerit('months');
    const byWeek = boardMerit('weeks');
    const byJump = boardMerit('batch');
    assert(byMonth === byJump && byWeek === byJump, `lodge board merit matches across paths (${byMonth}, ${byWeek}, ${byJump})`);
}

// --- Chronological schedule: events and age-dependent ticks during a large jump ---
{
    const ctx = vm.createContext({
        G: { ageMonths: 0, worldSchedule: [], worldChronicle: [], worldNpcs: [] },
        WORLD_TIME_BALANCE: { chronicleMaxEntries: 80, chronicleSummaryMax: 3 },
        addLog: () => {},
        console
    });
    vm.runInContext(read('world-scheduler.js'), ctx);
    const fired = [];
    const agesSeen = [];
    ctx.registerWorldTick('deadline', () => {
        agesSeen.push(ctx.G.ageMonths);
        if (ctx.G.ageMonths >= 25) ctx.G._deadlineHit = true;
    }, 1);
    ctx.registerWorldEventHandler('ping', (payload) => {
        fired.push(payload.id);
    });
    ctx.scheduleWorldEvent('ping', 10, { id: 'a' }, { id: 'ev-a' });
    ctx.scheduleWorldEvent('ping', 40, { id: 'b' }, { id: 'ev-b' });
    ctx.scheduleWorldEvent('ping', 90, { id: 'c' }, { id: 'ev-c' });
    ctx.processWorldTime(0, 100, {});
    assert(JSON.stringify(fired) === JSON.stringify(['a', 'b', 'c']), `large jump fires events in order (${fired.join(',')})`);
    assert(ctx.G.worldSchedule.length === 0, 'fired events are removed');
    assert(agesSeen.includes(10) && agesSeen.includes(40) && agesSeen.includes(90) && agesSeen.includes(100),
        `ticks see segment end ages (${agesSeen.join(',')})`);
    assert(ctx.G._deadlineHit === true, 'age-based deadline is visible during the same large advance');

    const short = vm.createContext({
        G: { ageMonths: 0, worldSchedule: [], worldChronicle: [] },
        WORLD_TIME_BALANCE: { chronicleMaxEntries: 80, chronicleSummaryMax: 3 },
        addLog: () => {},
        console
    });
    vm.runInContext(read('world-scheduler.js'), short);
    let shortSum = 0;
    short.registerWorldTick('acc', (delta) => { shortSum += delta; }, 1);
    short.processWorldTime(0, 1, {});
    assert(Math.abs(shortSum - 1) < 1e-9, 'one-month advance still ticks one month');
}

// --- NPC growth progress: one jump vs monthly steps (no random breakthroughs) ---
{
    function grow(mode) {
        const ctx = vm.createContext({
            G: {
                ageMonths: 0,
                worldNpcs: [{
                    uid: 'n1',
                    alive: true,
                    ageMonths: 200,
                    growthProgress: 0,
                    growthRate: 1,
                    realmIdx: 0,
                    role: 'disciple',
                    zone: 'dustbone',
                    state: 'persistent'
                }]
            },
            NPC_ECOSYSTEM: { growthMonthsPerBreakthrough: 120, demonicThreatPerGrowth: 2, demonicThreatCap: 24, demonicThreatLogThreshold: 25 },
            NPC_ROLES: { disciple: { growthRate: 1, breakthroughChance: 0, cultivator: true } },
            ZONES: { dustbone: { name: 'Dustbone' } },
            getWorldNpcMaxRealm: () => 8,
            getWorldNpcLifespanMonths: () => 800 * 12,
            canWorldNpcGrow: () => true,
            clampWorldNpcProgress: () => {},
            tickWorldNpcWander: () => {},
            killWorldNpc: (npc) => { npc.alive = false; },
            Math,
            console
        });
        const fn = extractUntil(read('world.js'), 'tickWorldNpcGrowth(', 'tickWorldNpcWander');
        vm.runInContext(fn, ctx);
        if (mode === 'batch') ctx.tickWorldNpcGrowth(24);
        else {
            for (let i = 0; i < 24; i++) ctx.tickWorldNpcGrowth(1);
        }
        return ctx.G.worldNpcs[0].growthProgress;
    }
    assert(grow('batch') === grow('months'), 'NPC growth progress matches for 24 months in one jump or 24 steps');
}

// --- Activity split stays: passive, seclusion, and shared obligations ---
{
    const core = read('core.js');
    const quiet = read('time-playback.js');
    const clock = read('world-clock.js');
    const seclusion = read('seclusion-project.js');
    assert(core.includes('applySharedCalendarObligations'), 'player advances apply shared calendar obligations');
    assert(quiet.includes('applySharedCalendarObligations'), 'quiet playback applies shared calendar obligations');
    assert(core.includes('skipPassiveCirculation'), 'dedicated actions can skip passive circulation');
    assert(!quiet.includes('tickPassiveCultivation'), 'quiet playback does not grant passive cultivation');
    assert(clock.includes('tickPassiveCultivationWeek'), 'living calendar weeks still grant passive cultivation');
    assert(seclusion.includes('applySeclusionYearGains'), 'seclusion keeps its own yearly cultivation hook');
    assert(!read('world-clock.js').includes('tickDwellingRent()'), 'clock week does not charge rent a second time');
}

if (failed) {
    console.error(`\n${failed} time/NPC consistency test(s) failed`);
    process.exit(1);
}
console.log('\nAll time/NPC consistency tests passed.');
