// ============================================
// LOCATIONS.JS — Cities, markets, sect halls within zones
// ============================================

const LOCATION_TYPE_LABELS = {
    city: 'City',
    market: 'Market',
    sect_hq: 'Sect Hall',
    outpost: 'Outpost',
    wilderness: 'Wilderness'
};

function ensureLocationState() {
    if (!G.currentLocation && typeof getDefaultLocationForZone === 'function') {
        const zone = G.currentZone || currentZone;
        G.currentLocation = getDefaultLocationForZone(zone);
    }
}

function getLocationDef(locationId) {
    return WORLD_LOCATIONS[locationId] || null;
}

function getLocationsInZone(zoneId) {
    return Object.values(WORLD_LOCATIONS)
        .filter(loc => loc.parentZone === zoneId)
        .sort((a, b) => {
            const order = { market: 0, city: 1, outpost: 2, sect_hq: 3, wilderness: 4 };
            return (order[a.type] ?? 5) - (order[b.type] ?? 5) || a.name.localeCompare(b.name);
        });
}

function getDefaultLocationForZone(zoneId) {
    const locs = getLocationsInZone(zoneId);
    return locs.find(l => l.isDefault)?.id || locs[0]?.id || null;
}

function getCurrentLocationId() {
    if (typeof isInHiddenSubZone === 'function' && isInHiddenSubZone()) return null;
    return G.currentLocation || null;
}

function getCurrentLocationDef() {
    const id = getCurrentLocationId();
    if (!id) return null;
    return getLocationDef(id);
}

function getLocationHomeForFactionNpc(npcId) {
    return Object.values(WORLD_LOCATIONS).find(loc => loc.factionNpcId === npcId) || null;
}

function isFactionNpcAtCurrentLocation(npcId) {
    const home = getLocationHomeForFactionNpc(npcId);
    if (!home) return true;
    return getCurrentLocationId() === home.id;
}

function getMarketKeyAtCurrentLocation() {
    const loc = getCurrentLocationDef();
    return loc?.marketKey || null;
}

function isMarketAtCurrentLocation() {
    return !!getMarketKeyAtCurrentLocation();
}

function getMerchantCatalogKey() {
    return getMarketKeyAtCurrentLocation() || null;
}

function travelToLocation(locationId) {
    const loc = getLocationDef(locationId);
    if (!loc) return { success: false, message: 'Unknown place.' };
    const zoneId = typeof getMainZoneId === 'function' ? getMainZoneId() : (G.currentZone || currentZone);
    if (zoneId !== loc.parentZone) {
        return { success: false, message: `You must be in ${ZONES[loc.parentZone]?.name || loc.parentZone} first.` };
    }
    if (typeof isInHiddenSubZone === 'function' && isInHiddenSubZone()) {
        return { success: false, message: 'Leave the sealed site before traveling locally.' };
    }
    if (G.realmIdx < (loc.minRealm || 0)) {
        const realmName = PATHS[G.path].realms[loc.minRealm] || `Realm ${(loc.minRealm || 0) + 1}`;
        return { success: false, message: `${loc.name} requires ${realmName} or higher.` };
    }
    if (getCurrentLocationId() === locationId) {
        return { success: false, message: `You are already at ${loc.name}.` };
    }
    const qiCost = 2 + Math.floor(Math.random() * 4);
    if (G.qi < qiCost) {
        return { success: false, message: `Need ${qiCost} Qi to travel locally.` };
    }
    const months = ACTION_MONTHS.localTravel || 2;
    if (!advanceTime(months, `Journey to ${loc.name}`)) {
        return { success: false, message: 'Your lifespan ends on the road.' };
    }
    G.qi -= qiCost;
    G.currentLocation = locationId;
    addLog(`📍 You arrive at ${loc.emoji} ${loc.name}.`);
    if (typeof tryCompleteFactionQuests === 'function') {
        tryCompleteFactionQuests('travel', { zone: loc.parentZone, locationId });
    }
    if (typeof tryRoadAmbientEncounter === 'function') tryRoadAmbientEncounter('localTravel');
    if (typeof fireSceneNoticesOnArrive === 'function') {
        fireSceneNoticesOnArrive({ locationId, zoneId: loc.parentZone });
    }
    return { success: true, message: `Arrived at ${loc.name}.` };
}

function renderZoneLocationsHtml(zoneId) {
    const locs = getLocationsInZone(zoneId);
    if (!locs.length) return '';
    const mainZone = typeof getMainZoneId === 'function' ? getMainZoneId() : (G.currentZone || currentZone);
    const inZone = mainZone === zoneId && !(typeof isInHiddenSubZone === 'function' && isInHiddenSubZone());
    const curLoc = getCurrentLocationId();
    let html = `<div class="zone-locations"><div class="zone-locations-title">📍 Places in ${ZONES[zoneId]?.name || zoneId}</div>`;
    locs.forEach(loc => {
        const typeLabel = LOCATION_TYPE_LABELS[loc.type] || loc.type;
        const tags = (loc.tags || []).map(t => `<span class="zone-guide-tag">${escapeHtml(t)}</span>`).join('');
        const isHere = inZone && curLoc === loc.id;
        let action = '';
        if (isHere) {
            action = `<div class="zone-location-here">You are here</div>`;
        } else if (inZone) {
            action = `<button type="button" class="zone-location-travel-btn" data-location-travel="${loc.id}">Walk here · ${ACTION_MONTHS.localTravel || 2}mo · Qi</button>`;
        } else {
            action = `<div class="zone-location-preview">Travel to the region first</div>`;
        }
        html += `<div class="zone-location-card${isHere ? ' zone-location-card--here' : ''}">
            <div class="zone-location-head">${loc.emoji} <strong>${escapeHtml(loc.name)}</strong> <span class="zone-location-type">${typeLabel}</span></div>
            <div class="zone-location-desc">${escapeHtml(loc.description)}</div>
            ${tags ? `<div class="zone-guide-tags">${tags}</div>` : ''}
            ${action}
        </div>`;
    });
    html += '</div>';
    return html;
}

function bindZoneLocationEvents(container) {
    if (!container) return;
    container.querySelectorAll('[data-location-travel]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = travelToLocation(this.dataset.locationTravel);
            addLog(result.message);
            if (typeof renderMapPopup === 'function') renderMapPopup();
            fullRender();
        });
    });
}

function renderContinentMapSvg() {
    const mainZone = typeof getMainZoneId === 'function' ? getMainZoneId() : (G.currentZone || currentZone);
    const selected = document.querySelector('.zone-map-region--selected')?.dataset?.zoneMap || mainZone;
    let svg = `<svg class="continent-map-svg" viewBox="0 0 100 86" role="img" aria-label="Azure Sky Continent map">
        <defs>
            <linearGradient id="mapSea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#1a2838"/>
                <stop offset="100%" stop-color="#0e1620"/>
            </linearGradient>
            <linearGradient id="mapLand" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stop-color="#2a3a2a"/>
                <stop offset="100%" stop-color="#1a2418"/>
            </linearGradient>
        </defs>
        <rect width="100" height="86" fill="url(#mapSea)" rx="4"/>
        <ellipse cx="50" cy="44" rx="38" ry="30" fill="url(#mapLand)" stroke="#4a5a42" stroke-width="0.6" opacity="0.95"/>`;

    Object.entries(ZONE_MAP_LAYOUT).forEach(([zoneId, layout]) => {
        const zone = ZONES[zoneId];
        if (!zone) return;
        const isHere = mainZone === zoneId;
        const isSelected = selected === zoneId;
        const locked = G.realmIdx < zone.minRealm;
        const fill = locked ? '#2a2a2a' : (isHere ? '#3a5a3a' : '#2a3a32');
        const stroke = isSelected ? '#f1c40f' : (isHere ? '#8aba6a' : '#5a6a52');
        const sw = isSelected ? 1.2 : 0.7;
        svg += `<g class="zone-map-region${isHere ? ' zone-map-region--here' : ''}${isSelected ? ' zone-map-region--selected' : ''}${locked ? ' zone-map-region--locked' : ''}" data-zone-map="${zoneId}" style="cursor:pointer">
            <ellipse cx="${layout.cx}" cy="${layout.cy}" rx="${layout.rx}" ry="${layout.ry}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" opacity="${locked ? 0.55 : 0.92}"/>
            <text x="${layout.cx}" y="${layout.cy - 2}" text-anchor="middle" class="zone-map-emoji" font-size="5">${zone.emoji}</text>
            <text x="${layout.cx}" y="${layout.cy + 5}" text-anchor="middle" class="zone-map-label" font-size="2.8" fill="#d8e8d0">${zone.name.split(' ')[0]}</text>
        </g>`;
    });

    const hereLayout = ZONE_MAP_LAYOUT[mainZone];
    if (hereLayout && !(typeof isInHiddenSubZone === 'function' && isInHiddenSubZone())) {
        const loc = getCurrentLocationDef();
        const pinY = hereLayout.cy + (loc?.type === 'sect_hq' ? 4 : loc?.type === 'market' ? -4 : 0);
        svg += `<circle class="map-you-are-here" cx="${hereLayout.cx}" cy="${pinY}" r="1.8" fill="#f1c40f" stroke="#2a2010" stroke-width="0.4">
            <animate attributeName="r" values="1.5;2.2;1.5" dur="2.5s" repeatCount="indefinite"/>
        </circle>`;
    }

    svg += '</svg>';
    return svg;
}

function mountContinentMap() {
    const el = document.getElementById('continentMap');
    if (!el) return;
    el.innerHTML = renderContinentMapSvg();
    el.querySelectorAll('.zone-map-region').forEach(region => {
        region.addEventListener('click', function() {
            const zoneId = this.dataset.zoneMap;
            el.querySelectorAll('.zone-map-region').forEach(r => r.classList.remove('zone-map-region--selected'));
            this.classList.add('zone-map-region--selected');
            if (typeof showZoneGuide === 'function') showZoneGuide(zoneId);
        });
    });
}

function getPlaceDisplayLabel() {
    if (typeof isInHiddenSubZone === 'function' && isInHiddenSubZone()) {
        const sub = HIDDEN_SUBZONES[getActiveZoneId()];
        if (sub) return `${sub.emoji} ${sub.name}`;
    }
    const loc = getCurrentLocationDef();
    const zone = ZONES[G.currentZone || currentZone];
    if (loc && zone) return `${loc.emoji} ${loc.name} · ${zone.emoji} ${zone.name}`;
    if (zone) return `${zone.emoji} ${zone.name}`;
    return 'Unknown';
}
