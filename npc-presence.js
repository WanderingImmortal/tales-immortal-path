// ============================================
// NPC-PRESENCE.JS — Scene notices, look around, crowd (v1.3)
// ============================================

function getLocationPresenceType(locationId) {
    const loc = locationId && typeof getLocationDef === 'function' ? getLocationDef(locationId) : null;
    if (loc?.type) return loc.type;
    const zoneId = typeof getMainZoneId === 'function' ? getMainZoneId() : (G.currentZone || currentZone);
    const zone = ZONES[zoneId];
    if (zone?.difficulty === 'hard' || zone?.difficulty === 'extreme') return 'wilderness';
    return 'default';
}

function pickWeightedSceneCategory(locType) {
    const weights = SCENE_NOTICE_WEIGHTS[locType] || SCENE_NOTICE_WEIGHTS.default;
    const entries = Object.entries(weights).filter(([, w]) => w > 0);
    const total = entries.reduce((s, [, w]) => s + w, 0);
    if (!total) return 'mood';
    let roll = Math.random() * total;
    for (const [cat, w] of entries) {
        roll -= w;
        if (roll <= 0) return cat;
    }
    return entries[0][0];
}

function pickSceneNoticeLine(category) {
    const pool = SCENE_NOTICES[category] || SCENE_NOTICES.mood;
    return pool[Math.floor(Math.random() * pool.length)];
}

function fireSceneNoticesOnArrive(context) {
    context = context || {};
    if (G.gameOver || G.inCombat) return;
    const locationId = context.locationId != null ? context.locationId : getCurrentLocationId();
    const loc = locationId ? getLocationDef(locationId) : null;
    const locType = getLocationPresenceType(locationId);
    const counts = SCENE_NOTICE_COUNTS[locType] || SCENE_NOTICE_COUNTS.default;
    const noticeCount = counts.min + Math.floor(Math.random() * (counts.max - counts.min + 1));
    const placeName = loc ? `${loc.emoji} ${loc.name}` : (ZONES[context.zoneId || G.currentZone]?.name || 'the area');

    const used = new Set();
    for (let i = 0; i < noticeCount; i++) {
        const category = pickWeightedSceneCategory(locType);
        let line = pickSceneNoticeLine(category);
        let guard = 0;
        while (used.has(line) && guard++ < 8) {
            line = pickSceneNoticeLine(pickWeightedSceneCategory(locType));
        }
        used.add(line);
        addLog({
            html: `👁️ At ${escapeHtml(placeName)}: ${escapeHtml(line)}`,
            cls: 'log-scene-notice'
        });
    }
}

function clearLocationCrowd(locationId) {
    if (!locationId || !G.worldNpcs?.length) return;
    G.worldNpcs.forEach(npc => {
        if (npc.alive && npc.state === 'ambient' && npc.crowdLocationId === locationId) {
            npc.alive = false;
        }
    });
}

function spawnCrowdAmbientNpc(zoneId, locationId) {
    const npc = spawnAmbientNpc(zoneId);
    if (npc) npc.crowdLocationId = locationId;
    return npc;
}

function rollLookAroundCount(locationId) {
    const locType = getLocationPresenceType(locationId);
    const band = LOOK_AROUND_COUNTS[locType] || LOOK_AROUND_COUNTS.default;
    return band.min + Math.floor(Math.random() * (band.max - band.min + 1));
}

function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function gatherUnmetWorldNpcCandidates(zoneId) {
    return (G.worldNpcs || []).filter(n =>
        n.alive && !n.met && n.state !== 'ambient' && n.zone === zoneId && !n.isDemonicTalent
    );
}

function buildCrowdSketch(npc) {
    if (typeof assembleAmbientFlavorLine === 'function' && (isAmbientNpc(npc) || npc.unnamed)) {
        const full = assembleAmbientFlavorLine(npc);
        const first = full.split('.')[0];
        return first.length > 100 ? first.slice(0, 97) + '…' : first;
    }
    const role = NPC_ROLES[npc.role] || NPC_ROLES.wanderer;
    const hints = ['nearby', 'by the road', 'watching passersby', 'at the edge of the crowd'];
    const hint = hints[Math.floor(Math.random() * hints.length)];
    return `A ${role.label.toLowerCase()} ${hint}`;
}

function getCrowdNpcList() {
    const uids = G.crowdSessionUids || [];
    return uids.map(uid => getWorldNpcByUid(uid)).filter(n => n && n.alive);
}

function getCrowdNpcCards() {
    return getCrowdNpcList().map(npc => ({
        id: worldNpcId(npc.uid),
        name: buildCrowdSketch(npc),
        emoji: '🧍',
        occupation: 'Stranger',
        familiarity: '',
        met: false,
        isCrowd: true
    }));
}

function approachCrowdNpc(uid) {
    const npc = getWorldNpcByUid(uid);
    if (!npc || !npc.alive) return;
    const zoneId = typeof getMainZoneId === 'function' ? getMainZoneId() : (G.currentZone || currentZone);
    const locationId = getCurrentLocationId();
    if (typeof maybePromoteAmbientNpc === 'function' && isAmbientNpc(npc)) {
        maybePromoteAmbientNpc(npc, { zoneId, locationId });
    } else if (!npc.met) {
        npc.met = true;
        if (!npc.metAtMonth) {
            npc.metAtMonth = G.ageMonths || 0;
            npc.metAtZone = zoneId;
            npc.metAtLocationId = locationId;
            if (!npc.recentBeat && typeof generateRecentBeat === 'function') {
                npc.recentBeat = generateRecentBeat(npc);
            }
            if (typeof ensureWorldNpcRelationship === 'function') ensureWorldNpcRelationship(npc);
        }
    }
    G.crowdSessionUids = null;
    npcUiMode = 'menu';
    if (typeof openNpcPopup === 'function') openNpcPopup(worldNpcId(npc.uid));
}

function openCrowdPopup() {
    const cards = getCrowdNpcCards();
    if (!cards.length) return;
    npcUiTarget = null;
    npcUiMode = 'crowd';
    renderNpcPopup();
    document.getElementById('npcPopup')?.classList.add('active');
}

function actionLookAround() {
    if (G.gameOver || G.inCombat) return;
    if (typeof actionBlocked === 'function' && actionBlocked()) return;
    if (typeof isInHiddenSubZone === 'function' && isInHiddenSubZone()) {
        addLog('👁️ Now is not the time to linger and look around.');
        fullRender();
        return;
    }

    const zoneId = typeof getMainZoneId === 'function' ? getMainZoneId() : (G.currentZone || currentZone);
    const locationId = getCurrentLocationId();
    const loc = locationId ? getLocationDef(locationId) : null;
    const placeLabel = loc ? `${loc.emoji} ${loc.name}` : (ZONES[zoneId]?.name || zoneId);

    beginActionLog();
    const months = ACTION_MONTHS.lookAround || ACTION_MONTHS.interact || 1;
    if (!advanceTime(months, `Looking around ${placeLabel}`)) {
        cancelActionLog();
        fullRender();
        return;
    }

    if (locationId) clearLocationCrowd(locationId);

    let target = rollLookAroundCount(locationId);
    const crowd = [];
    const unmet = shuffleArray(gatherUnmetWorldNpcCandidates(zoneId));
    unmet.slice(0, Math.min(2, target)).forEach(npc => {
        if (locationId) npc.crowdLocationId = locationId;
        crowd.push(npc);
    });
    while (crowd.length < target) {
        const spawned = locationId
            ? spawnCrowdAmbientNpc(zoneId, locationId)
            : spawnAmbientNpc(zoneId);
        if (!spawned) break;
        crowd.push(spawned);
    }

    G.crowdSessionUids = crowd.map(n => n.uid);

    if (!crowd.length) {
        commitActionLog(`👁️ You look around ${placeLabel} — nothing catches your eye.`);
        fullRender();
        return;
    }

    commitActionLog(`👁️ You scan ${placeLabel} — ${crowd.length} figure${crowd.length === 1 ? '' : 's'} stand out from the noise.`);
    openCrowdPopup();
    fullRender();
}

function isNpcKnownToPlayer(entry) {
    if (entry.type === 'story') {
        ensureNpcState();
        return !!getNpcRecord(entry.id)?.met;
    }
    if (entry.type === 'world') {
        const npc = entry.npc;
        return !!npc?.met || npc?.metAtMonth != null;
    }
    if (entry.type === 'faction') {
        return true;
    }
    return false;
}

function getKnownNpcEntries(zoneId) {
    return getPresentNpcEntries(zoneId).filter(isNpcKnownToPlayer);
}

function getKnownNpcCards(zoneId) {
    return getKnownNpcEntries(zoneId).map(entry => {
        if (entry.type === 'faction') {
            const def = typeof getFactionNpcDef === 'function' ? getFactionNpcDef(entry.id) : null;
            const fdef = def && typeof getFactionDef === 'function' ? getFactionDef(def.factionId) : null;
            const tier = def && typeof getFactionTier === 'function' ? getFactionTier(def.factionId) : null;
            return {
                id: entry.id,
                name: def?.name || entry.id,
                emoji: def?.emoji || '🏯',
                occupation: def?.title || 'Faction Elder',
                familiarity: tier ? `${tier.label} · ${getFactionRep(def.factionId)} rep` : '',
                met: true
            };
        }
        if (entry.type === 'story') {
            return {
                id: entry.id,
                name: getNpcDef(entry.id).name,
                emoji: getNpcDef(entry.id).emoji,
                occupation: getNpcOccupation(entry.id),
                disposition: getNpcDispositionLabel(entry.id),
                dispositionMood: getNpcAlignmentMood(entry.id),
                strength: getNpcStrengthLabel(entry.id),
                familiarity: getNpcFamiliarityLabel(entry.id),
                met: true
            };
        }
        const n = entry.npc;
        const role = NPC_ROLES[n.role] || NPC_ROLES.wanderer;
        return {
            id: entry.id,
            name: n.name,
            emoji: n.isDemonicTalent ? '😈' : role.emoji,
            occupation: role.occupation,
            personalities: formatPersonalityLabels(n),
            disposition: getWorldNpcDispositionLabel(n),
            dispositionMood: getWorldNpcAlignmentMood(n),
            strength: getWorldNpcStrengthLabel(n),
            familiarity: typeof getWorldNpcImpressionLabel === 'function'
                ? `${getWorldNpcImpressionLabel(n)}${n.talkCount >= 3 ? ' · Known' : n.talkCount >= 1 ? ' · Spoken' : ''}`
                : (n.talkCount >= 5 ? 'Familiar' : 'Recognized'),
            met: true
        };
    });
}
