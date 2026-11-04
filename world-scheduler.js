// ============================================
// WORLD-SCHEDULER.JS — Central world clock & scheduled jianghu events
// ============================================

const WORLD_EVENT_HANDLERS = {};
const WORLD_TICKS = [];
let _worldSchedulerInited = false;
let _worldScheduleMigrated = false;

function registerWorldEventHandler(type, fn) {
    if (type && typeof fn === 'function') WORLD_EVENT_HANDLERS[type] = fn;
}

function registerWorldTick(id, fn, priority) {
    if (!id || typeof fn !== 'function') return;
    WORLD_TICKS.push({ id, fn, priority: priority != null ? priority : 50 });
}

function ensureWorldSchedulerState() {
    if (!G.worldSchedule) G.worldSchedule = [];
    if (!G.worldChronicle) G.worldChronicle = [];
}

function scheduleWorldEvent(type, atMonths, payload, opts) {
    ensureWorldSchedulerState();
    opts = opts || {};
    payload = payload || {};
    const at = Math.floor(atMonths);
    const id = opts.id || `${type}_${at}_${Math.random().toString(36).slice(2, 7)}`;
    G.worldSchedule = G.worldSchedule.filter(e => e.id !== id);
    G.worldSchedule.push({ id, type, at, payload, silent: !!opts.silent });
    G.worldSchedule.sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));
    return id;
}

function cancelWorldEvents(filterFn) {
    ensureWorldSchedulerState();
    if (typeof filterFn !== 'function') return;
    G.worldSchedule = G.worldSchedule.filter(e => !filterFn(e));
}

function hasScheduledWorldEvent(type, id) {
    ensureWorldSchedulerState();
    return G.worldSchedule.some(e => {
        if (type && e.type !== type) return false;
        if (id && e.id !== id) return false;
        return true;
    });
}

function appendWorldChronicle(entry) {
    ensureWorldSchedulerState();
    const row = {
        months: entry.months != null ? entry.months : (G.ageMonths || 0),
        emoji: entry.emoji || '🌍',
        summary: entry.summary || entry.text || '',
        text: entry.text || entry.summary || '',
        zoneId: entry.zoneId || null,
        type: entry.type || 'world'
    };
    if (!row.summary) return;
    G.worldChronicle.push(row);
    const cap = (typeof WORLD_TIME_BALANCE !== 'undefined' && WORLD_TIME_BALANCE.chronicleMaxEntries) || 80;
    while (G.worldChronicle.length > cap) G.worldChronicle.shift();
    if (G._worldChronicleBatch) G._worldChronicleBatch.push(row);
}

function beginWorldChronicleBatch() {
    G._worldChronicleBatch = [];
}

function endWorldChronicleBatch() {
    const batch = G._worldChronicleBatch || [];
    G._worldChronicleBatch = null;
    return batch;
}

function formatWorldChronicleLine(batch) {
    if (!batch?.length) return '';
    const cap = (typeof WORLD_TIME_BALANCE !== 'undefined' && WORLD_TIME_BALANCE.chronicleSummaryMax) || 3;
    const lines = batch.slice(0, cap).map(e => `${e.emoji} ${e.summary}`);
    const more = batch.length > cap ? ` (+${batch.length - cap})` : '';
    return `🌍 ${lines.join(' · ')}${more}`;
}

function emitWorldChronicleSummary(batch, context) {
    const line = formatWorldChronicleLine(batch);
    if (!line || !context?.activity) return line;
    addLog(`${line}`);
    return line;
}

function fireWorldEvent(ev) {
    const handler = WORLD_EVENT_HANDLERS[ev.type];
    if (!handler) return;
    const prevAge = G.ageMonths;
    if (Math.abs(G.ageMonths - ev.at) > 1e-6) G.ageMonths = ev.at;
    try {
        handler(ev.payload || {}, ev);
    } catch (err) {
        console.error('World event failed:', ev.type, err);
    } finally {
        G.ageMonths = prevAge;
    }
}

/**
 * Run registered world ticks for [fromMonths, toMonths].
 * Caller sets G.ageMonths to toMonths first so deadline-style ticks see the segment end.
 *
 * Future player routines should not add a second clock. Bill time with advanceTime
 * (a player decision) or advanceTimeQuiet (playback). Both call processWorldTime, which
 * segments on G.worldSchedule, then applySharedCalendarObligations (rent, lodge board).
 * Activity-specific gains stay on the caller: passive weeks, focused sessions, seclusion years.
 * Playback speed is the world-clock timer or the seclusion timer — not another simulation clock.
 * To interrupt a large advance, scheduleWorldEvent at the completion month; world-clock
 * projects still finish on the week loop when endsAtMonths has passed.
 */
function runWorldTicks(fromMonths, toMonths, context) {
    const delta = toMonths - fromMonths;
    if (delta <= 0) return;
    WORLD_TICKS.sort((a, b) => a.priority - b.priority).forEach(tick => {
        tick.fn(delta, fromMonths, toMonths, context || {});
    });
}

function pullScheduledEventsAfter(cursorMonths, endMonths) {
    ensureWorldSchedulerState();
    return G.worldSchedule
        .filter(e => e.at > cursorMonths + 1e-9 && e.at <= endMonths + 1e-9)
        .sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));
}

function fireScheduledEventsAtBoundary(cursorMonths, boundaryMonths) {
    const atBoundary = G.worldSchedule.filter(
        e => e.at > cursorMonths + 1e-9 && Math.abs(e.at - boundaryMonths) < 1e-6
    );
    if (!atBoundary.length) return;
    atBoundary.sort((a, b) => a.id.localeCompare(b.id));
    G.worldSchedule = G.worldSchedule.filter(e => !atBoundary.some(f => f.id === e.id));
    G.ageMonths = boundaryMonths;
    for (const ev of atBoundary) fireWorldEvent(ev);
}

/** Fire due schedule events in (from, to] without advancing world ticks (legacy helper). */
function flushWorldSchedule(fromMonths, toMonths) {
    ensureWorldSchedulerState();
    if (toMonths <= fromMonths) return;
    const due = G.worldSchedule.filter(e => e.at > fromMonths && e.at <= toMonths);
    G.worldSchedule = G.worldSchedule.filter(e => e.at <= fromMonths || e.at > toMonths);
    due.sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));
    for (const ev of due) fireWorldEvent(ev);
}

function migrateWorldScheduleFromLegacy() {
    if (_worldScheduleMigrated) return;
    _worldScheduleMigrated = true;
    ensureWorldSchedulerState();
    const now = G.ageMonths || 0;
    if (G.nextDemonicEmergenceMonths != null && G.nextDemonicEmergenceMonths <= now) {
        G.nextDemonicEmergenceMonths = now + 6;
    }
    if (G.nextDemonicEmergenceMonths != null && !hasScheduledWorldEvent('demonic_emergence', 'demonic_emergence_next')) {
        scheduleWorldEvent('demonic_emergence', G.nextDemonicEmergenceMonths, {}, { id: 'demonic_emergence_next' });
    }
    if (typeof ensureWeiWanderScheduled === 'function') ensureWeiWanderScheduled();
    if (typeof ensurePhoenixWarScheduled === 'function') ensurePhoenixWarScheduled();
    G.worldSchedule.forEach(e => {
        if (e.at <= now) e.at = now + Math.max(1, Math.floor((e.type === 'phoenix_war_advance' ? 12 : 2)));
    });
    G.worldSchedule.sort((a, b) => a.at - b.at || a.id.localeCompare(b.id));
}

function initWorldSchedulerRegistries() {
    if (_worldSchedulerInited) return;
    _worldSchedulerInited = true;

    registerWorldTick('scars', () => {
        if (typeof checkScarTimeHealing === 'function') checkScarTimeHealing();
    }, 5);
    registerWorldTick('alignment', () => {
        if (typeof maybeHeavenlyAlignmentEvent === 'function') maybeHeavenlyAlignmentEvent();
    }, 10);
    registerWorldTick('npc', (delta) => {
        if (typeof tickNpcWorld === 'function') tickNpcWorld(delta);
    }, 20);
    registerWorldTick('quests', (delta) => {
        if (typeof tickQuestSystems === 'function') tickQuestSystems(delta);
    }, 30);
    registerWorldTick('ambientNpcs', (delta) => {
        if (typeof tickAmbientNpcs === 'function') tickAmbientNpcs(delta);
        if (typeof tickWorldNpcRelationships === 'function') tickWorldNpcRelationships(delta);
    }, 35);
    registerWorldTick('worldNpcs', (delta) => {
        if (typeof tickWorldNpcGrowth === 'function') tickWorldNpcGrowth(delta);
    }, 40);
    registerWorldTick('sect', (delta) => {
        if (typeof tickSectSystems === 'function') tickSectSystems(delta);
    }, 50);
    registerWorldTick('factionDeadlines', () => {
        if (typeof tickFactionQuestDeadlines === 'function') tickFactionQuestDeadlines();
    }, 60);
    registerWorldTick('factions', (delta) => {
        if (typeof tickFactionSystems === 'function') tickFactionSystems(delta);
    }, 70);
}

function processWorldTime(fromMonths, toMonths, context) {
    initWorldSchedulerRegistries();
    ensureWorldSchedulerState();
    migrateWorldScheduleFromLegacy();
    beginWorldChronicleBatch();
    context = context || {};
    let cursor = fromMonths;
    const end = toMonths;
    while (cursor < end - 1e-9) {
        const due = pullScheduledEventsAfter(cursor, end);
        const segmentEnd = due.length ? due[0].at : end;
        if (segmentEnd > cursor + 1e-9) {
            G.ageMonths = segmentEnd;
            runWorldTicks(cursor, segmentEnd, context);
        }
        fireScheduledEventsAtBoundary(cursor, segmentEnd);
        cursor = segmentEnd;
    }
    if (cursor < end - 1e-9) {
        G.ageMonths = end;
        runWorldTicks(cursor, end, context);
    }
    G.ageMonths = end;
    return endWorldChronicleBatch();
}

function processWorldTimeLegacy(fromMonths, toMonths) {
    const delta = toMonths - fromMonths;
    if (typeof checkScarTimeHealing === 'function') checkScarTimeHealing();
    if (typeof maybeHeavenlyAlignmentEvent === 'function') maybeHeavenlyAlignmentEvent();
    if (typeof tickNpcWorld === 'function') tickNpcWorld(delta);
    if (typeof tickQuestSystems === 'function') tickQuestSystems(delta);
    if (typeof tickWorldNpcGrowth === 'function') tickWorldNpcGrowth(delta);
    if (typeof tickSectSystems === 'function') tickSectSystems(delta);
    if (typeof tickFactionQuestDeadlines === 'function') tickFactionQuestDeadlines();
    if (typeof tickFactionSystems === 'function') tickFactionSystems(delta);
    if (typeof maybeDemonicEmergence === 'function') maybeDemonicEmergence();
    return [];
}
