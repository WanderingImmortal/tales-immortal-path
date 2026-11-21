// ============================================
// WORLD-SCHEDULER.JS — Central world clock & scheduled jianghu events
// ============================================

const WORLD_EVENT_HANDLERS = Object.create(null);
const WORLD_EVENT_RETRY_SAFE = new Set();
const MAX_WORLD_EVENTS_PER_BOUNDARY = 128;
let worldTimeProcessing = false;

function assertWorldTimeAvailable() {
    if (worldTimeProcessing) throw new Error('A world-time advance is already in progress.');
}
const WORLD_TICKS = [];
let _worldSchedulerInited = false;
const migratedWorldSchedules = new WeakSet();

function registerWorldEventHandler(type, fn, { retrySafe = false } = {}) {
    if (!type || typeof fn !== 'function') return;
    WORLD_EVENT_HANDLERS[type] = fn;
    if (retrySafe) WORLD_EVENT_RETRY_SAFE.add(type);
    else WORLD_EVENT_RETRY_SAFE.delete(type);
}

function registerWorldTick(id, fn, priority) {
    if (!id || typeof fn !== 'function') return;
    WORLD_TICKS.push({ id, fn, priority: priority != null ? priority : 50 });
}

function ensureWorldSchedulerState() {
    if (!G.worldSchedule) G.worldSchedule = [];
    if (!G.worldChronicle) G.worldChronicle = [];
}

function compareWorldEvents(a, b) {
    return a.at - b.at || (a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
}

function isPendingWorldEvent(event) {
    return !!event && !event.failure && !event.dispatching;
}

function scheduleWorldEvent(type, atMonths, payload, opts = {}) {
    if (typeof type !== 'string' || !type) throw new TypeError('Expected a world event type.');
    if (!Number.isFinite(atMonths) || atMonths < (G.ageMonths ?? 0) || atMonths < 0) {
        throw new RangeError('World events require a finite timestamp at or after the current month.');
    }
    ensureWorldSchedulerState();
    const boundaryIds = G.worldEventBoundary?.at === atMonths ? G.worldEventBoundary.ids : [];
    let id = opts?.id;
    if (id == null) {
        const base = `${type}_${atMonths}_${Math.random().toString(36).slice(2, 7)}`;
        id = base;
        for (let suffix = 1; boundaryIds?.includes?.(id) || G.worldSchedule.some(row => row?.id === id); suffix++) {
            id = `${base}_${suffix}`;
        }
    }
    if (typeof id !== 'string' || !id) throw new TypeError('Expected a world event ID.');
    if (boundaryIds?.includes?.(id)) return null;
    // Upsert pending work only. An in-flight or quarantined occurrence keeps its record.
    cancelWorldEvents(event => event.id === id);
    G.worldSchedule.push({ id, type, at: atMonths, payload: payload || {}, silent: !!opts?.silent });
    return id;
}

function cancelWorldEvents(filterFn) {
    ensureWorldSchedulerState();
    if (typeof filterFn !== 'function') return;
    G.worldSchedule = G.worldSchedule.filter(event => !isPendingWorldEvent(event) || !filterFn(event));
}

function hasScheduledWorldEvent(type, id) {
    ensureWorldSchedulerState();
    return G.worldSchedule.some(e => {
        if (!e || e.dispatching) return false;
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

function quarantineWorldEvent(event, reason, message) {
    delete event.dispatching;
    delete event.retryRequested;
    event.failure = { reason, message, atMonths: G.ageMonths };
}

function reportWorldEventFailure(event) {
    console.error(`World event ${event.id} (${event.type}) quarantined:`, event.failure.message);
    appendWorldChronicle({
        type: 'world_event_failure', emoji: '⚠️',
        summary: `World event ${event.type} paused (${event.failure.reason}).`
    });
}

function getFailedWorldEvents() {
    ensureWorldSchedulerState();
    return G.worldSchedule.filter(event => event?.failure)
        .map(({ id, type, at, failure }) => ({ id, type, at, ...failure }));
}

// Unknown handlers never ran. Other handlers may be retried only if explicitly replay-safe.
function retryFailedWorldEvent(id, at) {
    assertWorldTimeAvailable();
    if (typeof getSaveLoadDiagnostics === 'function' && getSaveLoadDiagnostics().loadFailure) return false;
    ensureWorldSchedulerState();
    const matches = G.worldSchedule.filter(event => event?.id === id && event.failure
        && (at === undefined || at === event.at));
    if (matches.length !== 1) return false;
    const [event] = matches;
    const reason = event.failure.reason;
    if (!WORLD_EVENT_HANDLERS[event.type]
        || (reason !== 'unknown_handler' && !(['handler_error', 'interrupted_dispatch'].includes(reason)
            && WORLD_EVENT_RETRY_SAFE.has(event.type)))
        || G.worldSchedule.some(other => isPendingWorldEvent(other) && other.id === id)) return false;
    delete event.failure;
    event.retryRequested = true;
    return true;
}

function fireWorldEvent(event) {
    const handler = WORLD_EVENT_HANDLERS[event.type];
    if (!handler) {
        quarantineWorldEvent(event, 'unknown_handler', 'No handler is registered for this event type.');
        reportWorldEventFailure(event);
        return;
    }
    event.dispatching = true;
    const age = G.ageMonths;
    try {
        handler(event.payload || {}, event);
        G.worldSchedule = G.worldSchedule.filter(row => row !== event);
    } catch (error) {
        G.ageMonths = age;
        quarantineWorldEvent(event, 'handler_error', error?.message || String(error));
        reportWorldEventFailure(event);
    } finally {
        G.ageMonths = age;
    }
}

/**
 * Run registered world ticks for [fromMonths, toMonths].
 * Caller sets G.ageMonths to toMonths first so deadline-style ticks see the segment end.
 *
 * Future player routines should not add a second clock. Bill time with advanceTime
 * (a player decision) or advanceTimeQuiet (playback). Both call processWorldTime, which
 * segments on G.worldSchedule and optional calendar boundaries. The caller can account for
 * elapsed time and stop after an event that requires the player's attention.
 * Playback speed changes how often callers request time on this same calendar.
 */
function runWorldTicks(fromMonths, toMonths, context) {
    const delta = toMonths - fromMonths;
    if (delta <= 0) return;
    WORLD_TICKS.sort((a, b) => a.priority - b.priority).forEach(tick => {
        tick.fn(delta, fromMonths, toMonths, context || {});
    });
}

function pullScheduledEventsThrough(endMonths) {
    return G.worldSchedule.filter(event => isPendingWorldEvent(event) && event.at <= endMonths)
        .sort(compareWorldEvents);
}

function fireScheduledEventsAtBoundary(boundaryMonths) {
    let due = pullScheduledEventsThrough(boundaryMonths);
    if (!due.length) return;
    if (G.worldEventBoundary?.at !== boundaryMonths) {
        G.worldEventBoundary = { at: boundaryMonths, ids: [], count: 0 };
    }
    const boundary = G.worldEventBoundary;
    while (due.length && boundary.count < MAX_WORLD_EVENTS_PER_BOUNDARY) {
        const [event] = due;
        boundary.count++;
        if (boundary.ids.includes(event.id) && !event.retryRequested) {
            quarantineWorldEvent(event, 'duplicate_occurrence', 'This ID was already dispatched at this boundary.');
            reportWorldEventFailure(event);
        } else {
            if (!boundary.ids.includes(event.id)) boundary.ids.push(event.id);
            delete event.retryRequested;
            fireWorldEvent(event);
        }
        // Handlers can add or cancel work. Re-select by requested timestamp and ID.
        due = pullScheduledEventsThrough(boundaryMonths);
    }
    if (due.length) {
        for (const event of due) {
            quarantineWorldEvent(event, 'chain_limit', 'The same-boundary dispatch limit was reached.');
        }
        reportWorldEventFailure(due[0]);
    }
}

function migrateWorldScheduleFromLegacy() {
    if (migratedWorldSchedules.has(G)) return;
    ensureWorldSchedulerState();
    const now = G.ageMonths ?? 0;
    const boundary = G.worldEventBoundary;
    if (boundary != null && (!Number.isFinite(boundary.at) || !Array.isArray(boundary.ids)
        || !boundary.ids.every(id => typeof id === 'string') || !Number.isSafeInteger(boundary.count)
        || boundary.count < boundary.ids.length || boundary.count > MAX_WORLD_EVENTS_PER_BOUNDARY)) {
        throw new TypeError('Invalid saved world event boundary.');
    }
    G.worldSchedule = G.worldSchedule.map(event => {
        if (!event || typeof event.id !== 'string' || !event.id || typeof event.type !== 'string'
            || !event.type || !Number.isFinite(event.at) || event.at < 0) {
            if (event?.failure?.reason === 'invalid_event') return event;
            const invalid = event && typeof event === 'object' ? { ...event } : { raw: event };
            quarantineWorldEvent(invalid, 'invalid_event', 'Invalid saved event ID, type, or timestamp.');
            reportWorldEventFailure(invalid);
            return invalid;
        }
        if (event.dispatching) {
            quarantineWorldEvent(event, 'interrupted_dispatch', 'Saved during dispatch. Effects may already have been applied.');
            reportWorldEventFailure(event);
        }
        return event;
    });
    if (Number.isFinite(G.nextDemonicEmergenceMonths)
        && !hasScheduledWorldEvent('demonic_emergence', 'demonic_emergence_next')) {
        scheduleWorldEvent('demonic_emergence', Math.max(now, G.nextDemonicEmergenceMonths), {}, { id: 'demonic_emergence_next' });
    }
    if (typeof ensureWeiWanderScheduled === 'function') ensureWeiWanderScheduled();
    if (typeof ensurePhoenixWarScheduled === 'function') ensurePhoenixWarScheduled();
    migratedWorldSchedules.add(G);
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

function runCalendarWorldStep(context, step) {
    if (!context.quiet) return step();
    const quiet = G._quietTime;
    const defer = G._deferringLogs;
    G._quietTime = G._deferringLogs = true;
    try {
        return step();
    } finally {
        G._quietTime = quiet;
        G._deferringLogs = defer;
    }
}

function processWorldTime(fromMonths, toMonths, context = {}) {
    assertWorldTimeAvailable();
    if (!Number.isFinite(fromMonths) || !Number.isFinite(toMonths) || toMonths < fromMonths) {
        throw new RangeError('Invalid world-time interval.');
    }
    context ||= {};
    worldTimeProcessing = true;
    try {
        initWorldSchedulerRegistries();
        ensureWorldSchedulerState();
        migrateWorldScheduleFromLegacy();
        beginWorldChronicleBatch();
        let cursor = fromMonths;
        G.ageMonths = cursor;
        // Legacy overdue work runs at the current calendar date in original timestamp order.
        runCalendarWorldStep(context, () => fireScheduledEventsAtBoundary(cursor));
        while (cursor < toMonths && !context.shouldStop?.()) {
            const due = pullScheduledEventsThrough(toMonths);
            const studyBoundary = typeof getNextManualHallStudyBoundary === 'function'
                ? getNextManualHallStudyBoundary(cursor) : Infinity;
            const activityBoundary = context.nextBoundary?.(cursor) ?? Infinity;
            const segmentEnd = Math.min(toMonths, due[0]?.at ?? Infinity, studyBoundary, activityBoundary);
            if (segmentEnd <= cursor) break;

            G.ageMonths = segmentEnd;
            runCalendarWorldStep(context, () => runWorldTicks(cursor, segmentEnd, context));
            context.onElapsed?.(segmentEnd - cursor);
            runCalendarWorldStep(context, () => fireScheduledEventsAtBoundary(segmentEnd));
            cursor = segmentEnd;
        }
        G.ageMonths = cursor;
        return endWorldChronicleBatch();
    } finally {
        worldTimeProcessing = false;
        G._worldChronicleBatch = null;
    }
}
