// NPC travel — location, capability, and presence (world clock, existing map).
// Player travelToZone / travelToLocation stay player-only: they spend Qi, move
// G.currentLocation, and fire road encounters. This module shares the lower-level
// map (WORLD_LOCATIONS + ZONE_LOCAL_LAYOUT paths) and ACTION_MONTHS.localTravel.
// No second clock, no per-frame movement, no new settlements.

const NPC_TRAVEL_VERSION = 1;

/** Realm ladder indices shared with PATHS.qi.realms (0 Qi Condensation … 3 Nascent Soul). */
const NPC_TRAVEL_REALM = {
    lightBodyMin: 2, // Core Formation / Golden Core
    flightMin: 3 // Nascent Soul — true flight is generally unavailable before this
};

const NPC_TRAVEL_METHODS = ['walk', 'light_body', 'flight'];

const NPC_TRAVEL_METHOD_BASE = {
    walk: 0.8,
    light_body: 0.7,
    flight: 0.55
};

let _npcTravelGraph = null;

function npcTravelLocationDef(locationId) {
    if (!locationId) return null;
    if (typeof getLocationDef === 'function') {
        const def = getLocationDef(locationId);
        if (def) return def;
    }
    if (typeof WORLD_LOCATIONS !== 'undefined' && WORLD_LOCATIONS[locationId]) {
        return WORLD_LOCATIONS[locationId];
    }
    return null;
}

function getNpcTravelGraph() {
    if (_npcTravelGraph) return _npcTravelGraph;
    const adj = {};
    const layouts = typeof ZONE_LOCAL_LAYOUT !== 'undefined' ? ZONE_LOCAL_LAYOUT : {};
    Object.keys(layouts).forEach(zoneId => {
        const paths = (layouts[zoneId] && layouts[zoneId].paths) || [];
        paths.forEach(p => {
            if (!p || !p.from || !p.to) return;
            if (!adj[p.from]) adj[p.from] = [];
            if (!adj[p.to]) adj[p.to] = [];
            if (!adj[p.from].includes(p.to)) adj[p.from].push(p.to);
            if (!adj[p.to].includes(p.from)) adj[p.to].push(p.from);
        });
    });
    _npcTravelGraph = adj;
    return adj;
}

function resolveTravelNpc(npcOrId) {
    if (!npcOrId) return null;
    if (typeof npcOrId === 'object') return npcOrId;
    if (typeof findWorldNpcRecordByUid === 'function') return findWorldNpcRecordByUid(npcOrId);
    return null;
}

function touchNpcTravelRegistry() {
    if (typeof G === 'undefined') return null;
    if (!G.npcTravel || G.npcTravel.version !== NPC_TRAVEL_VERSION) {
        const prev = G.npcTravel && Array.isArray(G.npcTravel.activeUids) ? G.npcTravel.activeUids.slice() : [];
        G.npcTravel = { version: NPC_TRAVEL_VERSION, activeUids: prev };
    }
    if (!Array.isArray(G.npcTravel.activeUids)) G.npcTravel.activeUids = [];
    return G.npcTravel;
}

function trackNpcJourney(uid) {
    const reg = touchNpcTravelRegistry();
    if (!reg || !uid) return;
    if (!reg.activeUids.includes(uid)) reg.activeUids.push(uid);
}

function untrackNpcJourney(uid) {
    if (typeof G === 'undefined' || !G.npcTravel || !Array.isArray(G.npcTravel.activeUids)) return;
    G.npcTravel.activeUids = G.npcTravel.activeUids.filter(id => id !== uid);
}

function blankNpcTravelState(npc) {
    const home = npc && (npc.homeLocationId || npc.locationId) || null;
    return {
        status: 'present',
        locationId: home,
        originId: null,
        destinationId: null,
        purpose: null,
        method: null,
        departedAtMonths: null,
        arrivesAtMonths: null,
        arrivedAtMonths: null,
        arrivalApplied: false,
        completionCount: 0,
        fieldStayCount: 0,
        companions: [],
        scheduleId: null,
        familiarLocationIds: null,
        routeLocationIds: null,
        perceivedUncertainty: null,
        perceivedEffort: null,
        abortReason: null,
        lastArrival: null
    };
}

function isNpcTravelBodyUnresolved(npc) {
    return !!(npc && npc.travel && npc.travel.status === 'unresolved');
}

/**
 * Recover malformed / legacy travel rows without inventing a second map.
 * Living NPCs stuck with no body are settled at a valid origin or marked unresolved.
 * Dead aborted travellers stay without a body (no return teleport).
 */
function recoverNpcTravelState(npc) {
    if (!npc || !npc.travel) return null;
    const t = npc.travel;
    const alive = npc.alive !== false;

    if (t.status === 'travelling') {
        const destOk = !!npcTravelLocationDef(t.destinationId);
        const originOk = !!npcTravelLocationDef(t.originId);
        if (!alive) {
            return abortNpcJourney(npc, 'dead');
        }
        if (!destOk) {
            return abortNpcJourney(npc, originOk ? 'invalid_destination' : 'invalid_travel_state');
        }
        if (!originOk) {
            // Still on the road toward a known place, but origin is gone — keep travelling
            // until arrival; settlement uses destination on completion.
            return t;
        }
        if (npc.uid) trackNpcJourney(npc.uid);
        return t;
    }

    if (t.status === 'aborted') {
        if (npc.uid) untrackNpcJourney(npc.uid);
        if (!alive) {
            t.locationId = null;
            t.arrivalApplied = true;
            return t;
        }
        // Legacy living abort with null body — settle or mark unresolved.
        if (!t.locationId || !npcTravelLocationDef(t.locationId)) {
            return settleOrUnresolvedAfterAbort(npc, t.abortReason || 'recovered_abort');
        }
        t.status = 'present';
        t.arrivalApplied = true;
        return t;
    }

    if (t.status === 'unresolved') {
        if (npc.uid) untrackNpcJourney(npc.uid);
        t.arrivalApplied = true;
        if (!alive) {
            t.status = 'aborted';
            t.locationId = null;
            t.abortReason = t.abortReason || 'dead';
            return t;
        }
        // Defined recovery: if the origin place exists again, settle there.
        if (npcTravelLocationDef(t.originId)) {
            return settleOrUnresolvedAfterAbort(npc, t.abortReason || 'recovered_unresolved');
        }
        t.locationId = null;
        return t;
    }

    // present / unknown
    if (!t.status) t.status = 'present';
    if (t.status === 'present' && !t.locationId) {
        t.locationId = npc.homeLocationId || npc.locationId || null;
    }
    if (npc.uid && t.status !== 'travelling') untrackNpcJourney(npc.uid);
    return t;
}

function ensureNpcTravelState(npc) {
    if (!npc) return null;
    if (!npc.travel || typeof npc.travel !== 'object') {
        npc.travel = blankNpcTravelState(npc);
    }
    const t = npc.travel;
    if (!t.status) t.status = 'present';
    if (!Array.isArray(t.companions)) t.companions = [];
    if (t.completionCount == null) t.completionCount = 0;
    if (t.fieldStayCount == null) t.fieldStayCount = 0;
    if (!Array.isArray(t.familiarLocationIds)) {
        const home = npc.homeLocationId || t.locationId;
        const ids = [];
        if (home) ids.push(home);
        const neighbors = (getNpcTravelGraph()[home] || []);
        neighbors.forEach(id => {
            if (!ids.includes(id)) ids.push(id);
        });
        t.familiarLocationIds = ids;
    }
    // Do not silently fill home onto aborted/unresolved bodies.
    recoverNpcTravelState(npc);
    return npc.travel;
}

function isNpcTravelling(npcOrId) {
    const npc = resolveTravelNpc(npcOrId);
    return !!(npc && npc.travel && npc.travel.status === 'travelling');
}

function getNpcSettledLocationId(npcOrId) {
    const npc = resolveTravelNpc(npcOrId);
    if (!npc) return null;
    if (!npc.travel) return npc.homeLocationId || npc.locationId || null;
    if (npc.travel.status === 'travelling' || npc.travel.status === 'unresolved') return null;
    if (npc.travel.status === 'aborted') return npc.travel.locationId || null;
    if (npc.travel.locationId) return npc.travel.locationId;
    return npc.homeLocationId || npc.locationId || null;
}

function isNpcPhysicallyPresentAt(npcOrId, locationId) {
    const npc = resolveTravelNpc(npcOrId);
    if (!npc || npc.alive === false || !locationId) return false;
    if (isNpcTravelling(npc) || isNpcTravelBodyUnresolved(npc)) return false;
    return getNpcSettledLocationId(npc) === locationId;
}

/**
 * In-person availability. Untracked ids are not treated as absent —
 * situation packs still use their own flags for unnamed suspects.
 */
function isNpcAvailableForInPersonAt(npcOrId, locationId) {
    const npc = typeof npcOrId === 'object' ? npcOrId : resolveTravelNpc(npcOrId);
    if (!npc) return true;
    return isNpcPhysicallyPresentAt(npc, locationId);
}

function isNpcAvailableForLocationAction(npcOrId, locationId) {
    const npc = typeof npcOrId === 'object' ? npcOrId : resolveTravelNpc(npcOrId);
    if (!npc) return true;
    return isNpcPhysicallyPresentAt(npc, locationId);
}

function getNpcExpectedArrivalMonths(npcOrId) {
    const npc = resolveTravelNpc(npcOrId);
    if (!npc || !isNpcTravelling(npc)) return null;
    return npc.travel.arrivesAtMonths;
}

function findNpcTravelRoute(fromId, toId) {
    if (!fromId || !toId) return null;
    if (!npcTravelLocationDef(fromId) || !npcTravelLocationDef(toId)) return null;
    if (fromId === toId) return { locationIds: [fromId], hops: 0 };
    const adj = getNpcTravelGraph();
    const prev = {};
    prev[fromId] = null;
    const queue = [fromId];
    while (queue.length) {
        const cur = queue.shift();
        const nexts = adj[cur] || [];
        for (let i = 0; i < nexts.length; i++) {
            const n = nexts[i];
            if (Object.prototype.hasOwnProperty.call(prev, n)) continue;
            prev[n] = cur;
            if (n === toId) {
                const path = [toId];
                let c = toId;
                while (prev[c]) {
                    c = prev[c];
                    path.push(c);
                }
                path.reverse();
                return { locationIds: path, hops: path.length - 1 };
            }
            queue.push(n);
        }
    }
    return null;
}

function npcTravelWalkMonths(hops) {
    const perHop = (typeof ACTION_MONTHS !== 'undefined' && ACTION_MONTHS.localTravel) || 2;
    return Math.max(1, hops * perHop);
}

function npcTravelMethodMonths(methodId, walkMonths) {
    if (methodId === 'flight') return Math.max(1, Math.ceil(walkMonths * 0.25));
    if (methodId === 'light_body') return Math.max(1, Math.ceil(walkMonths * 0.5));
    return Math.max(1, walkMonths);
}

function npcTravelCondition(npc) {
    if (!npc || npc.alive === false) return 'dead';
    if (npc.incapacitated || npc.immobile) return 'incapacitated';
    if (npc.injured) return 'injured';
    return null;
}

function routeRealmBlock(npc, route) {
    if (!route) return null;
    const realm = npc && npc.realmIdx || 0;
    for (let i = 0; i < route.locationIds.length; i++) {
        const id = route.locationIds[i];
        const loc = npcTravelLocationDef(id);
        const need = loc && loc.minRealm ? loc.minRealm : 0;
        if (realm < need) return { locationId: id, minRealm: need };
    }
    return null;
}

function evaluateNpcTravelMethods(npcOrId, destinationId) {
    const npc = resolveTravelNpc(npcOrId);
    let originId = null;
    if (npc && npc.travel && npc.travel.status === 'travelling' && npc.travel.originId) {
        originId = npc.travel.originId;
    } else if (npc) {
        originId = getNpcSettledLocationId(npc) || npc.homeLocationId || null;
    }
    const dest = npcTravelLocationDef(destinationId);
    const route = originId ? findNpcTravelRoute(originId, destinationId) : null;
    const realm = npc && npc.realmIdx || 0;
    const condition = npcTravelCondition(npc);
    const realmBlock = npc && route ? routeRealmBlock(npc, route) : null;
    const walkMonths = route && route.hops > 0 ? npcTravelWalkMonths(route.hops) : null;

    return NPC_TRAVEL_METHODS.map(id => {
        let eligible = true;
        let reason = null;
        if (!npc) {
            eligible = false;
            reason = 'No character.';
        } else if (condition === 'dead') {
            eligible = false;
            reason = 'Dead characters cannot travel.';
        } else if (!dest) {
            eligible = false;
            reason = 'Unknown place.';
        } else if (!route || route.hops < 1) {
            eligible = false;
            reason = route && route.hops === 0 ? 'Already at that place.' : 'No mapped route connects these places.';
        } else if (realmBlock) {
            eligible = false;
            reason = 'Route requires a higher realm.';
        } else if (condition === 'incapacitated') {
            eligible = false;
            reason = 'Physical condition prevents travel.';
        } else if (id === 'flight' && realm < NPC_TRAVEL_REALM.flightMin) {
            eligible = false;
            reason = 'True flight is generally unavailable before Nascent Soul.';
        } else if (id === 'light_body' && realm < NPC_TRAVEL_REALM.lightBodyMin) {
            eligible = false;
            reason = 'Light-body travel is unavailable before Core Formation.';
        } else if (condition === 'injured' && id !== 'walk') {
            eligible = false;
            reason = 'Physical condition prevents strenuous movement.';
        }
        const months = eligible && walkMonths != null ? npcTravelMethodMonths(id, walkMonths) : null;
        return {
            id,
            eligible,
            reason: eligible ? null : reason,
            months,
            hops: route ? route.hops : null
        };
    });
}

function scoreNpcTravelMethodPreference(npc, methodId, context) {
    context = context || {};
    const personalities = context.personalities || (npc && npc.personalities) || [];
    const pressure = context.pressure != null ? Number(context.pressure) : 0;
    const purpose = context.purpose || null;
    let score = NPC_TRAVEL_METHOD_BASE[methodId] != null ? NPC_TRAVEL_METHOD_BASE[methodId] : 0;
    const has = id => personalities.indexOf(id) !== -1;
    if (has('careful') && methodId === 'walk') score += 0.45;
    if (has('careful') && methodId === 'flight') score -= 0.25;
    if (has('loyal') && methodId === 'walk') score += 0.3;
    if (has('bold') && methodId === 'walk') score -= 0.15;
    if (has('bold') && methodId === 'flight') score += 0.45;
    if (has('bold') && methodId === 'light_body') score += 0.1;
    if (has('ambitious') && pressure >= 0.5) {
        if (methodId === 'flight') score += 0.25;
        if (methodId === 'light_body') score += 0.15;
    }
    if (purpose === 'return_home' && methodId === 'walk') score += 0.15;
    return score;
}

function chooseNpcTravelMethod(npcOrId, destinationId, context) {
    const npc = resolveTravelNpc(npcOrId);
    context = context || {};
    const options = evaluateNpcTravelMethods(npc, destinationId);
    const eligible = options.filter(o => o.eligible);
    if (!eligible.length) {
        return { ok: false, reason: 'no_method', options };
    }
    const ranked = eligible.map(o => ({
        id: o.id,
        months: o.months,
        hops: o.hops,
        preference: scoreNpcTravelMethodPreference(npc, o.id, context)
    }));
    const tie = { walk: 0, light_body: 1, flight: 2 };
    ranked.sort((a, b) => b.preference - a.preference || (tie[a.id] || 9) - (tie[b.id] || 9));
    return { ok: true, method: ranked[0].id, months: ranked[0].months, ranked, options };
}

function npcKnowsLocation(npc, locationId) {
    const t = npc && npc.travel;
    const familiar = t && Array.isArray(t.familiarLocationIds) ? t.familiarLocationIds : [];
    return familiar.indexOf(locationId) !== -1;
}

/**
 * Subjective worth. Uses time, capability, personality, and familiarity.
 * Does not read hidden encounter tables or zone danger ratings.
 */
function assessNpcJourneyWorth(npcOrId, destinationId, context) {
    const npc = resolveTravelNpc(npcOrId);
    context = context || {};
    const purpose = context.purpose || null;
    if (!npc || npc.alive === false) {
        return { worthwhile: false, reason: 'unavailable', unfamiliar: false, months: null };
    }
    ensureNpcTravelState(npc);
    const originId = getNpcSettledLocationId(npc) || npc.homeLocationId;
    if (originId === destinationId) {
        return { worthwhile: true, reason: 'already_there', unfamiliar: false, months: 0, hops: 0 };
    }
    const route = findNpcTravelRoute(originId, destinationId);
    if (!npcTravelLocationDef(destinationId)) {
        return { worthwhile: false, reason: 'unknown_destination', unfamiliar: true, months: null };
    }
    if (!route) {
        return { worthwhile: false, reason: 'no_route', unfamiliar: !npcKnowsLocation(npc, destinationId), months: null };
    }
    const choice = chooseNpcTravelMethod(npc, destinationId, context);
    if (!choice.ok) {
        const blocked = (choice.options || []).find(o => o.reason);
        return {
            worthwhile: false,
            reason: choice.reason || 'no_method',
            detail: blocked ? blocked.reason : null,
            unfamiliar: !npcKnowsLocation(npc, destinationId),
            months: null,
            hops: route.hops
        };
    }
    const months = choice.months;
    const unfamiliar = !npcKnowsLocation(npc, destinationId);
    const personalities = npc.personalities || [];
    let score = 0.55;
    if (purpose === 'cultivation_resources') score += 0.2;
    if (purpose === 'return_home') score += 0.35;
    if (personalities.indexOf('ambitious') !== -1) score += 0.1;
    if (personalities.indexOf('careful') !== -1) score -= 0.05;
    if (months > 2) score -= Math.min(0.3, (months - 2) * 0.05);
    if (unfamiliar) score -= 0.35;
    const pressure = context.pressure != null ? Number(context.pressure) : 0;
    if (pressure >= 0.5 && purpose === 'cultivation_resources') score += 0.08;
    return {
        worthwhile: score >= 0.45,
        reason: score >= 0.45 ? 'worth_the_road' : 'not_worth_the_road',
        score,
        unfamiliar,
        months,
        hops: route.hops,
        method: choice.method,
        perceivedEffort: route.hops,
        perceivedUncertainty: unfamiliar ? 0.6 : 0.15
    };
}

function locationOffersGatheredHerbs(loc) {
    if (!loc) return false;
    const tags = (loc.tags || []).map(t => String(t).toLowerCase());
    if (tags.indexOf('herbs') !== -1) return true;
    const resources = loc.resources || [];
    return resources.indexOf('herbs') !== -1;
}

function findNpcDestinationForPurpose(npcOrId, purpose) {
    const npc = resolveTravelNpc(npcOrId);
    if (!npc || npc.alive === false) return null;
    ensureNpcTravelState(npc);
    if (purpose !== 'cultivation_resources') return null;
    const originId = getNpcSettledLocationId(npc) || npc.homeLocationId;
    if (!originId) return null;
    const here = npcTravelLocationDef(originId);
    if (locationOffersGatheredHerbs(here)) {
        return {
            locationId: originId,
            alreadyThere: true,
            route: { locationIds: [originId], hops: 0 },
            assessment: { worthwhile: true, reason: 'already_there', unfamiliar: false, months: 0, hops: 0 }
        };
    }
    const ids = typeof WORLD_LOCATIONS !== 'undefined' ? Object.keys(WORLD_LOCATIONS) : [];
    let best = null;
    ids.forEach(id => {
        const loc = npcTravelLocationDef(id);
        if (!locationOffersGatheredHerbs(loc)) return;
        const route = findNpcTravelRoute(originId, id);
        if (!route || route.hops < 1) return;
        const assessment = assessNpcJourneyWorth(npc, id, { purpose: 'cultivation_resources' });
        if (!assessment.worthwhile) return;
        if (!best || route.hops < best.route.hops || (route.hops === best.route.hops && id < best.locationId)) {
            best = { locationId: id, alreadyThere: false, route, assessment };
        }
    });
    return best;
}

function beginNpcJourney(npcOrId, spec) {
    spec = spec || {};
    const npc = resolveTravelNpc(npcOrId);
    if (!npc || npc.alive === false) {
        return { ok: false, reason: 'dead', message: 'Dead characters cannot travel.' };
    }
    if (isNpcTravelling(npc)) {
        return { ok: false, reason: 'already_travelling', message: 'Already on the road.' };
    }
    const destinationId = spec.destinationId;
    const dest = npcTravelLocationDef(destinationId);
    if (!dest) {
        return { ok: false, reason: 'unknown_destination', message: 'Unknown place.' };
    }
    ensureNpcTravelState(npc);
    const originId = getNpcSettledLocationId(npc) || npc.homeLocationId;
    if (!originId || !npcTravelLocationDef(originId)) {
        return { ok: false, reason: 'unknown_origin', message: 'No current place to depart from.' };
    }
    if (originId === destinationId) {
        return { ok: false, reason: 'already_there', message: 'Already at that place.' };
    }
    const route = findNpcTravelRoute(originId, destinationId);
    if (!route) {
        return { ok: false, reason: 'no_route', message: 'No mapped route connects these places.' };
    }
    const realmBlock = routeRealmBlock(npc, route);
    if (realmBlock) {
        return {
            ok: false,
            reason: 'route_restricted',
            message: 'Route requires a higher realm.',
            minRealm: realmBlock.minRealm,
            locationId: realmBlock.locationId
        };
    }
    const context = {
        purpose: spec.purpose || null,
        pressure: spec.pressure,
        personalities: npc.personalities
    };
    let methodId = spec.method || null;
    let months = null;
    const evaluated = evaluateNpcTravelMethods(npc, destinationId);
    if (methodId) {
        const row = evaluated.find(o => o.id === methodId);
        if (!row || !row.eligible) {
            return {
                ok: false,
                reason: 'method_unavailable',
                method: methodId,
                message: row && row.reason ? row.reason : 'That way of travelling is unavailable.',
                options: evaluated
            };
        }
        months = row.months;
    } else {
        const choice = chooseNpcTravelMethod(npc, destinationId, context);
        if (!choice.ok) {
            return { ok: false, reason: 'no_method', message: 'No available way to make this journey.', options: evaluated };
        }
        methodId = choice.method;
        months = choice.months;
    }
    if (!(months > 0)) {
        return { ok: false, reason: 'zero_duration', message: 'Travel duration must be meaningful.' };
    }
    const now = G.ageMonths || 0;
    const worth = assessNpcJourneyWorth(npc, destinationId, context);
    const travel = npc.travel;
    travel.status = 'travelling';
    travel.locationId = null;
    travel.originId = originId;
    travel.destinationId = destinationId;
    travel.purpose = spec.purpose || null;
    travel.method = methodId;
    travel.departedAtMonths = now;
    travel.arrivesAtMonths = now + months;
    travel.arrivedAtMonths = null;
    travel.arrivalApplied = false;
    travel.abortReason = null;
    travel.routeLocationIds = route.locationIds.slice();
    travel.perceivedEffort = route.hops;
    travel.perceivedUncertainty = worth.perceivedUncertainty != null ? worth.perceivedUncertainty : (worth.unfamiliar ? 0.6 : 0.15);
    travel.companions = [];
    travel.scheduleId = null;
    if (npc.uid) trackNpcJourney(npc.uid);
    return {
        ok: true,
        reason: 'departed',
        message: 'Departed.',
        months,
        method: methodId,
        originId,
        destinationId,
        arrivesAtMonths: travel.arrivesAtMonths,
        purpose: travel.purpose
    };
}

/**
 * Prefer settling at the journey origin — not homeLocationId — when aborting a living traveller.
 * Death stays terminal with no body placement.
 */
function settleOrUnresolvedAfterAbort(npc, reason) {
    const travel = npc.travel;
    const originId = travel.originId;
    const originOk = !!npcTravelLocationDef(originId);
    travel.arrivalApplied = true;
    travel.arrivedAtMonths = null;
    travel.abortReason = reason || 'aborted';
    if (npc.uid) untrackNpcJourney(npc.uid);

    if (npc.alive === false) {
        travel.status = 'aborted';
        travel.locationId = null;
        return travel;
    }

    if (originOk) {
        travel.status = 'present';
        travel.locationId = originId;
        const origin = npcTravelLocationDef(originId);
        if (origin && origin.parentZone) npc.zone = origin.parentZone;
        travel.lastAbort = {
            atMonths: G.ageMonths || 0,
            reason: travel.abortReason,
            settledLocationId: originId
        };
        return travel;
    }

    travel.status = 'unresolved';
    travel.locationId = null;
    travel.lastAbort = {
        atMonths: G.ageMonths || 0,
        reason: travel.abortReason,
        settledLocationId: null
    };
    return travel;
}

function abortNpcJourney(npc, reason) {
    if (!npc || !npc.travel) return null;
    if (npc.travel.status !== 'travelling' && npc.travel.status !== 'unresolved') {
        // Allow recovery re-entry only when already aborted with no body.
        if (!(npc.travel.status === 'aborted' && npc.alive !== false && !npc.travel.locationId)) {
            return null;
        }
    }
    if (npc.travel.status === 'travelling' || npc.travel.status === 'unresolved') {
        // Mark journey finished so it cannot complete later.
        npc.travel.arrivalApplied = true;
    }
    return settleOrUnresolvedAfterAbort(npc, reason || 'aborted');
}

/** Living NPC cancels an active journey — settles at origin when possible. */
function cancelNpcJourney(npcOrId, reason) {
    const npc = resolveTravelNpc(npcOrId);
    if (!npc) return { ok: false, reason: 'missing_npc' };
    if (npc.alive === false) return { ok: false, reason: 'dead' };
    ensureNpcTravelState(npc);
    if (!npc.travel || npc.travel.status !== 'travelling') {
        return { ok: false, reason: 'not_travelling' };
    }
    const travel = abortNpcJourney(npc, reason || 'cancelled');
    return {
        ok: true,
        status: travel.status,
        locationId: travel.locationId,
        abortReason: travel.abortReason
    };
}

function completeNpcJourney(npc) {
    const travel = npc.travel;
    const destId = travel.destinationId;
    const dest = npcTravelLocationDef(destId);
    if (!dest) {
        abortNpcJourney(npc, 'invalid_destination');
        return null;
    }
    travel.arrivalApplied = true;
    travel.status = 'present';
    travel.locationId = destId;
    travel.arrivedAtMonths = travel.arrivesAtMonths;
    travel.completionCount = (travel.completionCount || 0) + 1;
    travel.abortReason = null;
    travel.lastArrival = {
        atMonths: travel.arrivedAtMonths,
        locationId: destId,
        originId: travel.originId,
        purpose: travel.purpose,
        method: travel.method
    };
    if (dest.parentZone) npc.zone = dest.parentZone;
    if (travel.familiarLocationIds && destId && travel.familiarLocationIds.indexOf(destId) === -1) {
        travel.familiarLocationIds.push(destId);
    }
    const home = npc.homeLocationId || null;
    if (home && destId === home) travel.fieldStayCount = 0;
    if (npc.uid) untrackNpcJourney(npc.uid);
    return travel.lastArrival;
}

function resolveNpcTravelForActor(npcOrId, nowMonths) {
    const npc = resolveTravelNpc(npcOrId);
    if (!npc || !npc.travel) return { changed: false };
    ensureNpcTravelState(npc);

    if (npc.travel.status !== 'travelling') {
        return { changed: false };
    }
    if (npc.alive === false) {
        abortNpcJourney(npc, 'dead');
        return { changed: true, aborted: true, reason: 'dead' };
    }
    if (!npcTravelLocationDef(npc.travel.destinationId)) {
        abortNpcJourney(npc, 'invalid_destination');
        return { changed: true, aborted: true, reason: 'invalid_destination' };
    }
    const now = nowMonths != null ? nowMonths : (G.ageMonths || 0);
    if (now + 1e-9 < npc.travel.arrivesAtMonths) {
        return { changed: false, pending: true };
    }
    if (npc.travel.arrivalApplied) {
        return { changed: false, duplicate: true };
    }
    const arrival = completeNpcJourney(npc);
    if (!arrival) {
        return { changed: true, aborted: true, reason: npc.travel.abortReason || 'invalid_destination' };
    }
    return { changed: true, arrived: true, arrival };
}

function tickNpcTravel() {
    const reg = touchNpcTravelRegistry();
    if (!reg) return;
    const now = G.ageMonths || 0;
    const uids = reg.activeUids.slice();
    for (let i = 0; i < uids.length; i++) {
        const npc = resolveTravelNpc(uids[i]);
        if (!npc) {
            untrackNpcJourney(uids[i]);
            continue;
        }
        ensureNpcTravelState(npc);
        resolveNpcTravelForActor(npc, now);
    }
}

function describeNpcPresenceRestrictions(npc) {
    const lodge = (npc && npc.homeLocationId)
        || (typeof WELL_RING_HOME_LOCATION_ID !== 'undefined' ? WELL_RING_HOME_LOCATION_ID : null);
    const unresolved = isNpcTravelBodyUnresolved(npc);
    return {
        travelling: isNpcTravelling(npc),
        unresolved,
        settledLocationId: getNpcSettledLocationId(npc),
        lodgeDuty: lodge ? isNpcAvailableForLocationAction(npc, lodge) : false,
        storehouseTheft: lodge ? isNpcAvailableForLocationAction(npc, lodge) : false,
        inPersonAtLodge: lodge ? isNpcAvailableForInPersonAt(npc, lodge) : (!isNpcTravelling(npc) && !unresolved)
    };
}

function inspectNpcTravel(actorId) {
    const npc = resolveTravelNpc(actorId);
    if (!npc) {
        return { actorId, missing: true };
    }
    ensureNpcTravelState(npc);
    const travel = npc.travel;
    const purposeDest = travel.status === 'travelling'
        ? null
        : findNpcDestinationForPurpose(npc, 'cultivation_resources');
    const dest = travel.destinationId
        || (purposeDest && purposeDest.locationId)
        || (travel.lastArrival && travel.lastArrival.locationId)
        || null;
    const options = dest ? evaluateNpcTravelMethods(npc, dest) : [];
    let choice = null;
    if (dest && travel.status !== 'travelling') {
        choice = chooseNpcTravelMethod(npc, dest, { purpose: travel.purpose, personalities: npc.personalities });
    }
    return {
        actorId: npc.uid || actorId,
        alive: npc.alive !== false,
        realmIdx: npc.realmIdx,
        status: travel.status,
        locationId: (travel.status === 'travelling' || travel.status === 'unresolved')
            ? null
            : travel.locationId,
        inTransit: travel.status === 'travelling',
        unresolved: travel.status === 'unresolved',
        originId: travel.originId,
        destinationId: travel.destinationId,
        purpose: travel.purpose,
        method: travel.method,
        departedAtMonths: travel.departedAtMonths,
        arrivesAtMonths: travel.arrivesAtMonths,
        arrivedAtMonths: travel.arrivedAtMonths,
        completionCount: travel.completionCount || 0,
        routeLocationIds: travel.routeLocationIds || null,
        perceivedUncertainty: travel.perceivedUncertainty,
        perceivedEffort: travel.perceivedEffort,
        fieldStayCount: travel.fieldStayCount || 0,
        companions: (travel.companions || []).slice(),
        scheduleId: travel.scheduleId || null,
        abortReason: travel.abortReason || null,
        lastAbort: travel.lastAbort ? JSON.parse(JSON.stringify(travel.lastAbort)) : null,
        lastArrival: travel.lastArrival ? JSON.parse(JSON.stringify(travel.lastArrival)) : null,
        options,
        choice,
        presence: describeNpcPresenceRestrictions(npc)
    };
}

if (typeof registerWorldTick === 'function') {
    registerWorldTick('npcTravel', () => {
        tickNpcTravel();
    }, 44);
}
