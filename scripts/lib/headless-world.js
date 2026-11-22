const { readFileSync } = require('node:fs');
const { createHash } = require('node:crypto');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '../..');
const scenario = 'ordinary-start';

function createWorld(seed, report, observeDispatch) {
    const storage = new Map();
    const timers = new Set();
    let timerId = 0;
    const defer = () => {
        timers.add(++timerId);
        return timerId;
    };
    const cancel = id => timers.delete(id);
    let begin;
    const elements = new Map([
        ['startBtn', { dataset: {}, addEventListener(type, callback) {
            if (type === 'click') begin = callback;
        } }],
        ['nameInput', { value: '' }],
        ['creation-screen', { style: {} }],
        ['game-screen', { style: {} }],
        ['load-error', { hidden: true }]
    ]);
    const context = vm.createContext({
        console: {
            log() {}, info() {}, debug() {},
            warn: (...args) => report('warnings', 'production-warning', args.join(' ')),
            error: (...args) => report('errors', 'production-error', args.join(' '))
        },
        navigator: { locks: { request: (_name, _options, acquired) => acquired({}) } },
        localStorage: {
            getItem: key => storage.get(key) ?? null,
            setItem: (key, value) => storage.set(key, String(value)),
            removeItem: key => storage.delete(key)
        },
        setTimeout: defer, clearTimeout: cancel,
        setInterval: defer, clearInterval: cancel,
        requestAnimationFrame: defer, cancelAnimationFrame: cancel,
        document: {
            addEventListener() {},
            querySelectorAll: () => [],
            documentElement: { classList: { toggle() {} } },
            getElementById: id => elements.get(id) ?? null
        },
        observeDispatch
    });
    context.window = context;
    const evaluate = source => vm.runInContext(source, context);
    evaluate(`
        Math.random = (() => {
            let state = ${seed};
            return () => ((state = (Math.imul(state, 1664525) + 1013904223) >>> 0) / 2 ** 32);
        })();
        Date = class extends Date {
            constructor(...args) { super(...(args.length ? args : [Date.now()])); }
            static now() { return 1700000000000; }
        };
    `);
    const html = readFileSync(path.join(root, 'index.html'), 'utf8');
    const scripts = Array.from(html.matchAll(/<script\s+src="([^"?]+)(?:\?[^"]*)?"><\/script>/g), match => match[1]);
    if (!scripts.includes('main.js')) throw new Error('Could not find production scripts in index.html.');
    for (const file of scripts) {
        vm.runInContext(readFileSync(path.join(root, file), 'utf8'), context, { filename: file });
    }
    evaluate(`
        // Keep fullRender's initialization and save side effects. Omit DOM-only output.
        renderLog = () => {};
        renderStatus = () => {};
        {
            const dispatch = fireWorldEvent;
            fireWorldEvent = event => {
                observeDispatch(event, G.ageMonths);
                return dispatch(event);
            };
        }
        saveOwnership.start(() => {}, reason => { throw new Error(reason); });
    `);
    evaluate('initGame()');
    if (!begin) throw new Error('Production initialization did not offer character creation.');
    begin();
    if (!storage.has('xianxia_save')) throw new Error('Production character creation did not save.');
    // The normal reload initializes the population and restores scheduler state.
    evaluate('initGame()');
    if (!elements.get('load-error').hidden) throw new Error('Production reload failed.');
    return { evaluate, deferredTimers: () => timers.size };
}

function countBy(records, keyFor) {
    const counts = Object.create(null);
    for (const record of records) {
        const key = keyFor(record) ?? 'unknown';
        counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
}

function snapshot(state, elapsedMonths) {
    const npcs = state.worldNpcs;
    const alive = npcs.filter(npc => npc.alive);
    const schedule = state.worldSchedule;
    const hall = state.sect?.buildingMeta?.manual_hall;
    const missions = state.sect?.missionDepartment?.missions;
    const sources = state.world?.resourceSources?.byId;
    return {
        elapsedMonths,
        calendarMonth: state.ageMonths,
        player: {
            locationId: state.currentLocation ?? null,
            lifespanMonths: state.lifespanMonths ?? null,
            stones: state.stones,
            sectStage: state.sect?.stage ?? null
        },
        npcs: {
            total: npcs.length,
            persistent: npcs.filter(npc => npc.state === 'persistent').length,
            alive: alive.length,
            dead: npcs.filter(npc => npc.alive === false).length,
            aliveByRecordedRegion: countBy(alive, npc => npc.zone),
            aliveByFocusRealmIndex: countBy(alive, npc =>
                npc.cultivation?.[npc.cultivation.focusTrack]?.realmIdx ?? npc.realmIdx),
            travelling: alive.filter(npc => npc.travel?.status === 'travelling').length,
            hallStudies: hall?.studies?.length ?? null,
            sectMissions: missions?.filter(item => item.status === 'active').length ?? null
        },
        organizations: {
            worldSects: state.sect?.worldSects?.length ?? null,
            worldSectRelationships: state.sect?.worldSects
                ? countBy(state.sect.worldSects, sect => sect.relationship) : null,
            factionReputation: state.factions?.reputation ?? null
        },
        economy: {
            redwellMarket: state.redwellMarket ?? null,
            resourceStock: sources
                ? Object.fromEntries(Object.entries(sources).map(([id, source]) => [id, source.stock])) : null
        },
        schedule: {
            pending: schedule.filter(event => !event.failure && !event.dispatching).length,
            quarantined: schedule.filter(event => event.failure).length
        },
        stateHash: createHash('sha256').update(JSON.stringify(state)).digest('hex')
    };
}

function checkState(state, report) {
    const error = (code, message) => report('errors', code, message);
    const uids = new Set();
    for (const npc of state.worldNpcs) {
        if (typeof npc.alive !== 'boolean') error('npc-liveness', `Invalid alive flag for NPC ${npc.uid}`);
        if (!npc.alive) continue;
        if (!npc.uid || uids.has(npc.uid)) error('live-npc-uid', `Missing or duplicate live NPC UID: ${npc.uid}`);
        uids.add(npc.uid);
    }
    for (const [name, stock] of [['materials', state.materials], ['pillStock', state.pillStock]]) {
        for (const [item, count] of Object.entries(stock || {})) {
            if (!Number.isFinite(count) || count < 0) error('inventory-count', `${name}.${item}: ${count}`);
        }
    }
    const activeMissions = state.sect?.missionDepartment?.missions?.filter(mission => mission.status === 'active') || [];
    const studies = state.sect?.buildingMeta?.manual_hall?.studies || [];
    for (const activity of [...activeMissions, ...studies]) {
        const uid = activity.npcUid ?? activity.discipleUid;
        if (!uids.has(uid)) error('activity-actor', `Active assignment references unavailable NPC ${uid}`);
    }
    for (const event of state.worldSchedule) {
        if (!Number.isFinite(event.at) || event.at < 0) error('event-timestamp', `Event ${event.id}: ${event.at}`);
        if (event.failure) {
            error('event-quarantined', `Event ${event.id} (${event.type}, due ${event.at}): ${event.failure.message}`);
        }
    }
}

function simulateWorld({ seed = 42, months = 12, checkpoint = 12 } = {}, prepare) {
    if (!Number.isInteger(seed) || seed < 0 || seed > 0xffffffff) {
        throw new RangeError('Seed must be an unsigned 32-bit integer.');
    }
    if (!Number.isSafeInteger(months) || months < 0 || !Number.isSafeInteger(checkpoint) || checkpoint < 1) {
        throw new RangeError('Duration must be a nonnegative whole month count and checkpoint a positive whole month count.');
    }
    const started = process.hrtime.bigint();
    const result = {
        schemaVersion: 1,
        configuration: { scenario, seed, months, checkpointMonths: checkpoint, stepMonths: 1 },
        initial: null,
        checkpoints: [],
        final: null,
        diagnostics: { dispatches: [], errors: [], warnings: [], deferredTimers: null },
        status: 'error',
        interruption: null
    };
    let state;
    let startMonth;
    let phase = 'initialize';
    let world;
    const occurrences = new Set();
    const report = (kind, code, message, calendarMonth = state?.ageMonths ?? null) => {
        result.diagnostics[kind].push({ code, calendarMonth, message });
    };
    const observeDispatch = ({ id, type, at }, calendarMonth) => {
        const key = JSON.stringify([id, at]);
        if (occurrences.has(key)) {
            report('errors', 'duplicate-dispatch', `Event ${id} dispatched twice for ${at}.`, calendarMonth);
        }
        occurrences.add(key);
        result.diagnostics.dispatches.push({ id, type, scheduledMonth: at, calendarMonth });
    };
    const readState = () => {
        state = JSON.parse(world.evaluate('JSON.stringify(G)'));
        if (!Number.isFinite(state.ageMonths) || state.ageMonths < 0) {
            throw new Error(`Invalid calendar month: ${state.ageMonths}`);
        }
        checkState(state, report);
    };

    try {
        world = createWorld(seed, report, observeDispatch);
        prepare?.(world.evaluate);
        readState();
        startMonth = state.ageMonths;
        if (!Number.isSafeInteger(startMonth + months)) throw new Error('Duration exceeds the supported calendar range.');
        result.initial = snapshot(state, 0);
        phase = 'advance';
        for (let month = 1; month <= months && !result.diagnostics.errors.length; month++) {
            const prior = state.ageMonths;
            const complete = world.evaluate("advanceSharedWorldTime(1, 'Headless idle', { quiet: true }).complete");
            readState();
            if (state.ageMonths < prior || state.ageMonths > prior + 1 || (complete && state.ageMonths !== prior + 1)) {
                report('errors', 'calendar-step', `Unexpected calendar advance from ${prior} to ${state.ageMonths}.`);
            }
            if (!complete) {
                result.interruption = {
                    calendarMonth: state.ageMonths,
                    reason: world.evaluate("getPlayerTimeAttention() || getWorldClockProjectStopReason() || 'The shared time advance stopped.'")
                };
                break;
            }
            if (month % checkpoint === 0 && month < months) {
                result.checkpoints.push(snapshot(state, month));
            }
        }
        result.final = snapshot(state, state.ageMonths - startMonth);
        result.status = result.diagnostics.errors.length ? 'error' : result.interruption ? 'interrupted' : 'completed';
    } catch (error) {
        report('errors', phase, error.message);
        // A malformed state can make snapshot construction itself fail.
        result.final = result.checkpoints.at(-1) ?? result.initial;
    }
    result.diagnostics.deferredTimers = world?.deferredTimers() ?? null;
    result.executionMs = Number(process.hrtime.bigint() - started) / 1e6;
    return result;
}

module.exports = { simulateWorld };
