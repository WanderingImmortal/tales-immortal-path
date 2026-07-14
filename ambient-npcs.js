// ============================================
// AMBIENT-NPCS.JS — Road strangers (ambient → persistent)
// ============================================

function ensureAmbientNpcState() {
    if (!G.worldNpcs) G.worldNpcs = [];
    G.worldNpcs.forEach(npc => {
        if (!npc.state) {
            npc.state = npc.met ? 'persistent' : 'persistent';
        }
        if (npc.state === 'persistent' && npc.unnamed == null) {
            npc.unnamed = false;
        }
        if (npc.state === 'ambient') {
            if (!npc.activityId) npc.activityId = pickAmbientActivityForRole(npc.role)?.id || 'returning_home';
            if (npc.activitySinceMonth == null) npc.activitySinceMonth = G.ageMonths || 0;
            if (!npc.realmBand) npc.realmBand = rollAmbientRealmBand(npc.zone);
            if (npc.unnamed == null) npc.unnamed = true;
            if (!npc.name) npc.name = 'A stranger';
        }
        if (npc.state === 'persistent' && npc.history && npc.history.length > 12) {
            npc.history = npc.history.slice(-10);
        }
        if (typeof ensureWorldNpcRelationship === 'function') ensureWorldNpcRelationship(npc);
    });
}

function isAmbientNpc(npc) {
    return !!npc && npc.alive && npc.state === 'ambient';
}

function isPersistentWorldNpc(npc) {
    return !!npc && npc.alive && npc.state !== 'ambient';
}

function getAmbientNpcsInZone(zoneId) {
    ensureAmbientNpcState();
    return (G.worldNpcs || []).filter(n => n.alive && n.state === 'ambient' && n.zone === zoneId);
}

function getAmbientActivityById(activityId) {
    return AMBIENT_ACTIVITIES.find(a => a.id === activityId) || AMBIENT_ACTIVITIES[0];
}

function resolveAmbientRoleId(roleToken) {
    if (roleToken === 'merchant' || roleToken === 'sorrowful') return 'villager';
    return NPC_ROLES[roleToken] ? roleToken : 'wanderer';
}

function activityMatchesRole(activity, roleId) {
    return activity.typicalRoles.some(r => {
        if (r === 'sorrowful') return roleId === 'villager';
        return resolveAmbientRoleId(r) === roleId || r === roleId;
    });
}

function pickAmbientActivityForRole(roleId) {
    const matches = AMBIENT_ACTIVITIES.filter(a => activityMatchesRole(a, roleId));
    const pool = matches.length ? matches : AMBIENT_ACTIVITIES;
    return pool[Math.floor(Math.random() * pool.length)];
}

function rollAmbientRealmBand(zoneId) {
    const zone = ZONES[zoneId];
    const min = zone?.minRealm || 0;
    const bands = ['mortal', 'qc', 'foundation', 'core', 'nascent'];
    let idx = 0;
    if (min >= 4) idx = 4;
    else if (min >= 3) idx = 2 + Math.floor(Math.random() * 2);
    else if (min >= 2) idx = 1 + Math.floor(Math.random() * 2);
    else if (min >= 1) idx = Math.floor(Math.random() * 2);
    if (Math.random() < 0.2 && idx < bands.length - 1) idx += 1;
    return bands[Math.min(idx, bands.length - 1)];
}

function resolveRealmFromBand(realmBand) {
    switch (realmBand) {
        case 'mortal': return 0;
        case 'qc': return Math.random() < 0.5 ? 0 : 1;
        case 'foundation': return 1 + Math.floor(Math.random() * 2);
        case 'core': return 2 + Math.floor(Math.random() * 2);
        case 'nascent': return 3 + Math.floor(Math.random() * 2);
        default: return 0;
    }
}

function rollAmbientDisplayHint() {
    if (Math.random() < 0.35) return null;
    const pool = AMBIENT_DISPLAY_HINTS;
    return pool[Math.floor(Math.random() * pool.length)];
}

function rollAmbientNpcRole(zoneId) {
    let roleId = rollNpcRoleForZone(zoneId);
    if (roleId === 'sect_elder' || roleId === 'demonic_talent') roleId = 'wanderer';
    return roleId;
}

function pickAmbientOriginDestination(zoneId) {
    const locs = typeof getLocationsInZone === 'function' ? getLocationsInZone(zoneId) : [];
    if (locs.length < 2) {
        const one = locs[0]?.id || null;
        return { originLocationId: one, destinationLocationId: one };
    }
    let origin = locs[Math.floor(Math.random() * locs.length)].id;
    let dest = locs[Math.floor(Math.random() * locs.length)].id;
    let guard = 0;
    while (dest === origin && guard++ < 6) {
        dest = locs[Math.floor(Math.random() * locs.length)].id;
    }
    return { originLocationId: origin, destinationLocationId: dest };
}

function rollPersistentNpcName() {
    if (Math.random() < 0.55) {
        return NPC_ECOSYSTEM.givenNames[Math.floor(Math.random() * NPC_ECOSYSTEM.givenNames.length)];
    }
    const surname = NPC_ECOSYSTEM.surnames[Math.floor(Math.random() * NPC_ECOSYSTEM.surnames.length)];
    const given = NPC_ECOSYSTEM.givenNames[Math.floor(Math.random() * NPC_ECOSYSTEM.givenNames.length)];
    const part = given.includes(' ') ? given.split(' ').pop() : given;
    return `${surname} ${part}`;
}

function getActivityRoleWord(npc, activity) {
    const activityRoles = activity.typicalRoles || [];
    if (activityRoles.includes('merchant') && (npc.role === 'villager' || activity.id === 'traveling_trade' || activity.id === 'smuggling_run')) {
        return AMBIENT_ROLE_WORDS.merchant;
    }
    return AMBIENT_ROLE_WORDS[npc.role] || (NPC_ROLES[npc.role]?.label || 'traveler').toLowerCase();
}

function getLocationName(locationId) {
    if (!locationId) return 'the crossroads';
    const loc = typeof getLocationDef === 'function' ? getLocationDef(locationId) : null;
    return loc ? loc.name.toLowerCase() : 'the crossroads';
}

function assembleAmbientFlavorLine(npc) {
    const activity = getAmbientActivityById(npc.activityId);
    const zoneName = ZONES[npc.zone]?.name || npc.zone;
    let line = activity.flavorSeed
        .replace(/\{role\}/g, getActivityRoleWord(npc, activity))
        .replace(/\{origin\}/g, getLocationName(npc.originLocationId))
        .replace(/\{destination\}/g, getLocationName(npc.destinationLocationId))
        .replace(/\{zone\}/g, zoneName);

    if (!/^[A-Z]/.test(line)) line = line.charAt(0).toUpperCase() + line.slice(1);

    const extras = [];
    if (npc.destinationLocationId && (activity.id === 'traveling_trade' || activity.id === 'returning_home' || activity.id === 'pilgrimage')) {
        extras.push(`headed toward ${getLocationName(npc.destinationLocationId)}`);
    }
    if (npc.displayHint) extras.push(npc.displayHint);
    ensureNpcPersonalities(npc);
    const pers = (npc.personalities || []).map(id => getPersonalityDef(id)?.label).filter(Boolean);
    if (pers.length) extras.push(`They seem ${pers[0].toLowerCase()}.`);

    if (extras.length) {
        const tail = extras.join(', ');
        line = line.replace(/\.$/, '') + (line.endsWith('.') ? '' : '.');
        if (!line.endsWith('.')) line += '.';
        line += ` ${tail.charAt(0).toUpperCase() + tail.slice(1)}${tail.endsWith('.') ? '' : '.'}`;
    }
    return line;
}

function generateRecentBeat(npc) {
    const activityId = npc.activityId || 'default';
    const table = AMBIENT_RECENT_BEATS[activityId] || AMBIENT_RECENT_BEATS.default;
    const personality = (npc.personalities || [])[0];
    if (personality && table[personality]) return table[personality];
    return table.default || AMBIENT_RECENT_BEATS.default.default;
}

function enforceAmbientCap(zoneId) {
    const cap = AMBIENT_NPC_CAPS.perZone;
    const ambient = getAmbientNpcsInZone(zoneId)
        .sort((a, b) => (a.activitySinceMonth || 0) - (b.activitySinceMonth || 0) || (a.spawnedAtMonths || 0) - (b.spawnedAtMonths || 0));
    while (ambient.length > cap) {
        const victim = ambient.shift();
        if (victim) victim.alive = false;
    }
}

function enforcePersistentCap() {
    const cap = AMBIENT_NPC_CAPS.persistentGlobal;
    const promoted = (G.worldNpcs || []).filter(n => n.alive && n.state === 'persistent' && n.metAtMonth != null);
    if (promoted.length <= cap) return;
    const sorted = promoted.sort((a, b) => {
        const imp = (a.impression || 0) - (b.impression || 0);
        if (imp !== 0) return imp;
        return (a.talkCount || 0) - (b.talkCount || 0);
    });
    while (sorted.length > cap) {
        const victim = sorted.shift();
        if (victim && (victim.talkCount || 0) < 2) victim.alive = false;
        else break;
    }
}

function spawnAmbientNpc(zoneId) {
    ensureAmbientNpcState();
    if (getAmbientNpcsInZone(zoneId).length >= AMBIENT_NPC_CAPS.perZone) {
        enforceAmbientCap(zoneId);
        if (getAmbientNpcsInZone(zoneId).length >= AMBIENT_NPC_CAPS.perZone) return null;
    }
    const roleId = rollAmbientNpcRole(zoneId);
    const activity = pickAmbientActivityForRole(roleId);
    const { originLocationId, destinationLocationId } = pickAmbientOriginDestination(zoneId);
    const uid = `wn_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
    const npc = {
        uid,
        name: 'A stranger',
        role: roleId,
        zone: zoneId,
        state: 'ambient',
        activityId: activity.id,
        activitySinceMonth: G.ageMonths || 0,
        originLocationId,
        destinationLocationId,
        realmBand: rollAmbientRealmBand(zoneId),
        displayHint: rollAmbientDisplayHint(),
        unnamed: true,
        realmIdx: 0,
        ageMonths: (18 + Math.floor(Math.random() * 25)) * 12,
        growthProgress: 0,
        growthRate: 0,
        alive: true,
        met: false,
        talkCount: 0,
        spawnedAtMonths: G.ageMonths || 0,
        wanderDueMonths: null,
        isDemonicTalent: false,
        demonicThreat: 0,
        demonicMet: false
    };
    ensureNpcPersonalities(npc);
    if (activity.typicalRoles.includes('sorrowful') && !npc.personalities.includes('sorrowful') && Math.random() < 0.6) {
        if (npc.personalities.length >= 2) npc.personalities[0] = 'sorrowful';
        else npc.personalities.push('sorrowful');
    }
    G.worldNpcs.push(npc);
    enforceAmbientCap(zoneId);
    return npc;
}

function promoteAmbientToPersistent(npc, context) {
    if (!npc || !isAmbientNpc(npc)) return npc;
    context = context || {};
    npc.name = rollPersistentNpcName();
    npc.unnamed = false;
    npc.realmIdx = resolveRealmFromBand(npc.realmBand);
    npc.recentBeat = generateRecentBeat(npc);
    npc.metAtMonth = G.ageMonths || 0;
    npc.metAtZone = context.zoneId || npc.zone;
    npc.metAtLocationId = context.locationId != null ? context.locationId : (G.currentLocation || null);
    npc.impression = 0;
    npc.trust = 0;
    npc.history = [{ month: G.ageMonths || 0, text: 'First met on the road.' }];
    npc.state = 'persistent';
    npc.met = true;
    npc.metBefore = true;
    const role = NPC_ROLES[npc.role] || NPC_ROLES.wanderer;
    npc.growthRate = role.growthRate || 0;
    npc.growthProgress = Math.floor(Math.random() * 40);
    if (role.canWander) {
        npc.wanderDueMonths = (G.ageMonths || 0) + pickWorldNpcWanderInterval();
    }
    clampWorldNpcProgress(npc);
    enforcePersistentCap();
    return npc;
}

function showRoadEncounter(npc) {
    if (!npc || !isAmbientNpc(npc)) return;
    G.pendingRoadEncounter = npc.uid;
    const flavor = assembleAmbientFlavorLine(npc);
    addLog({
        html: `🚶 On the road: ${escapeHtml(flavor)}<div class="road-encounter-actions">
            <button type="button" class="road-enc-btn" data-road-talk="${npc.uid}">Stop and talk</button>
            <button type="button" class="road-enc-btn road-enc-btn--muted" data-road-continue="${npc.uid}">Continue</button>
        </div>`,
        cls: 'log-road-encounter'
    });
    bindRoadEncounterEvents();
}

function bindRoadEncounterEvents() {
    document.querySelectorAll('[data-road-talk]').forEach(btn => {
        btn.onclick = function() {
            const uid = this.dataset.roadTalk;
            const npc = getWorldNpcByUid(uid);
            if (!npc || !isAmbientNpc(npc)) return;
            promoteAmbientToPersistent(npc, {
                zoneId: npc.zone,
                locationId: typeof getCurrentLocationId === 'function' ? getCurrentLocationId() : G.currentLocation
            });
            G.pendingRoadEncounter = null;
            addLog(`🧍 You stop to speak with ${npc.name}.`);
            if (typeof openNpcPopup === 'function') openNpcPopup(worldNpcId(npc.uid));
            else fullRender();
        };
    });
    document.querySelectorAll('[data-road-continue]').forEach(btn => {
        btn.onclick = function() {
            G.pendingRoadEncounter = null;
            addLog('🚶 You continue on your way.');
            fullRender();
        };
    });
}

function tryRoadAmbientEncounter(source) {
    if (G.gameOver || G.inCombat) return false;
    if (typeof isTribulationActive === 'function' && isTribulationActive()) return false;
    ensureAmbientNpcState();
    const zoneId = typeof getMainZoneId === 'function' ? getMainZoneId() : (G.currentZone || currentZone);
    if (!zoneId || !ZONES[zoneId]) return false;

    let chance = AMBIENT_NPC_CAPS.spawnChanceExplore;
    let maxSpawn = 1;
    if (source === 'travel') {
        chance = AMBIENT_NPC_CAPS.spawnChanceTravel;
        maxSpawn = 2;
    } else if (source === 'localTravel') {
        chance = AMBIENT_NPC_CAPS.spawnChanceLocalTravel;
    }
    if (Math.random() >= chance) return false;

    const spawnCount = maxSpawn > 1 && Math.random() < 0.35 ? 2 : 1;
    let shown = null;
    for (let i = 0; i < spawnCount; i++) {
        const npc = spawnAmbientNpc(zoneId);
        if (npc) shown = npc;
    }
    if (shown) {
        showRoadEncounter(shown);
        return true;
    }
    return false;
}

function tickAmbientNpcs(monthsPassed) {
    if (!G.worldNpcs?.length) return;
    ensureAmbientNpcState();
    G.worldNpcs.forEach(npc => {
        if (!npc.alive || npc.state !== 'ambient') return;
        if (Math.random() < AMBIENT_NPC_CAPS.activityRefreshChance) {
            const activity = pickAmbientActivityForRole(npc.role);
            npc.activityId = activity.id;
            npc.activitySinceMonth = G.ageMonths || 0;
        }
        if (Math.random() < 0.02 && npc.destinationLocationId) {
            const locs = typeof getLocationsInZone === 'function' ? getLocationsInZone(npc.zone) : [];
            if (locs.length > 1) {
                const pick = locs[Math.floor(Math.random() * locs.length)];
                if (pick) npc.destinationLocationId = pick.id;
            }
        }
    });
}

function maybePromoteAmbientNpc(npc, context) {
    if (isAmbientNpc(npc)) promoteAmbientToPersistent(npc, context);
    return npc;
}
