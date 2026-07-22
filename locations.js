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

/** Legacy card list — kept as fallback if a zone lacks ZONE_LOCAL_LAYOUT. */
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
            if (typeof mapPopupUi !== 'undefined') {
                mapPopupUi.selectedLocationId = this.dataset.locationTravel;
            }
            if (typeof renderMapPopup === 'function') renderMapPopup();
            fullRender();
        });
    });
}

function getLocalMapLayout(zoneId) {
    return (typeof ZONE_LOCAL_LAYOUT !== 'undefined' && ZONE_LOCAL_LAYOUT[zoneId]) || null;
}

function getLocalMapNodeTypeClass(loc) {
    if (!loc) return '';
    if (loc.type === 'city') return 'local-map-node--city';
    if (loc.type === 'market') return 'local-map-node--market';
    if (loc.type === 'sect_hq') return 'local-map-node--sect';
    if (loc.type === 'outpost') return 'local-map-node--outpost';
    if (loc.type === 'wilderness') return 'local-map-node--wilderness';
    return '';
}

function getLocalMapNodeBadge(loc) {
    if (!loc) return '';
    if (loc.type === 'market' || loc.marketKey) return '<span class="local-map-node-badge">🏪</span>';
    if (loc.type === 'sect_hq') return `<span class="local-map-node-badge">${loc.emoji || '🏯'}</span>`;
    return '';
}

function renderLocalMapPathsSvg(layout) {
    if (!layout?.paths?.length || !layout.nodes) return '';
    let lines = '';
    layout.paths.forEach(p => {
        const a = layout.nodes[p.from];
        const b = layout.nodes[p.to];
        if (!a || !b) return;
        lines += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="local-map-path-line"/>`;
    });
    if (!lines) return '';
    return `<svg class="local-map-paths-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${lines}</svg>`;
}

function renderLocalMapHeaderHtml(zoneId, preview) {
    const zone = ZONES[zoneId];
    if (!zone) return '';
    const curLoc = !preview ? getCurrentLocationDef() : null;
    const hereLine = curLoc
        ? `Current: ${curLoc.emoji} ${escapeHtml(curLoc.name)}`
        : (preview ? 'Preview — not in this region' : 'Current: —');
    return `<div class="local-map-header-row">
        <div class="local-map-title">📍 ${zone.emoji} ${escapeHtml(zone.name)} — Local Map</div>
        <button type="button" class="local-map-world-btn" data-map-tab="world">← World</button>
    </div>
    <div class="local-map-current">${hereLine}</div>`;
}

function renderLocalMapSceneHtml(zoneId, preview) {
    const layout = getLocalMapLayout(zoneId);
    const zone = ZONES[zoneId];
    if (!layout) {
        const cards = renderZoneLocationsHtml(zoneId);
        return `<div class="local-map-fallback">
            <p class="local-map-fallback-hint">Illustrated local map for this region is coming soon. Places below still work.</p>
            ${cards}
        </div>`;
    }

    const mainZone = typeof getMainZoneId === 'function' ? getMainZoneId() : (G.currentZone || currentZone);
    const inZone = !preview && mainZone === zoneId && !(typeof isInHiddenSubZone === 'function' && isInHiddenSubZone());
    const curLoc = getCurrentLocationId();
    const selected = (typeof mapPopupUi !== 'undefined' && mapPopupUi.selectedLocationId) || null;
    const theme = layout.theme || 'default';
    const dense = Object.keys(layout.nodes).length >= 5;

    let html = `<div class="local-map-scene local-map-theme-${theme}${dense ? ' local-map-scene--dense' : ''}" role="img" aria-label="${escapeHtml(zone?.name || zoneId)} local map">`;
    html += `<div class="local-map-sky"></div>`;
    html += `<div class="local-map-ground"></div>`;
    html += `<div class="local-map-paths">${renderLocalMapPathsSvg(layout)}</div>`;
    html += `<div class="local-map-nodes">`;

    Object.entries(layout.nodes).forEach(([locId, pos]) => {
        const loc = getLocationDef(locId);
        if (!loc) return;
        const locked = G.realmIdx < (loc.minRealm || 0);
        const isHere = inZone && curLoc === locId;
        const isSelected = selected === locId;
        const typeClass = getLocalMapNodeTypeClass(loc);
        const realmName = locked
            ? (PATHS[G.path]?.realms[loc.minRealm] || `Realm ${(loc.minRealm || 0) + 1}`)
            : '';
        const title = locked
            ? `${loc.name} — Requires ${realmName}`
            : `${loc.name} · ${LOCATION_TYPE_LABELS[loc.type] || loc.type}`;
        html += `<button type="button" class="local-map-node ${typeClass}${isHere ? ' is-here' : ''}${isSelected ? ' is-selected' : ''}${locked ? ' is-locked' : ''}"
            data-local-location="${locId}"
            style="left:${pos.x}%;top:${pos.y}%;z-index:${pos.layer || 1}"
            title="${escapeHtml(title)}">
            <span class="local-map-node-icon">${loc.emoji}</span>
            <span class="local-map-node-label">${escapeHtml(loc.name)}</span>
            ${getLocalMapNodeBadge(loc)}
            ${isHere ? '<span class="local-map-here-pulse" aria-hidden="true"></span>' : ''}
        </button>`;
    });

    html += `</div></div>`;
    html += `<p class="local-map-hint">Click a place for details.${preview ? '' : ' Walk between places from the panel below.'}</p>`;
    return html;
}

function renderLocalLocationDetailHtml(zoneId, locationId, preview) {
    const zone = ZONES[zoneId];
    if (preview) {
        const banner = `<div class="local-map-preview-banner">Travel to ${zone?.emoji || ''} ${escapeHtml(zone?.name || 'this region')} first to walk here.</div>`;
        if (!locationId) {
            return `${banner}<div class="local-map-detail-empty">Click a place to read its lore.</div>`;
        }
    }

    const loc = getLocationDef(locationId);
    if (!loc) {
        return `<div class="local-map-detail-empty">Click a place on the local map.</div>`;
    }

    const typeLabel = LOCATION_TYPE_LABELS[loc.type] || loc.type;
    const tags = (loc.tags || []).map(t => `<span class="zone-guide-tag">${escapeHtml(t)}</span>`).join('');
    const mainZone = typeof getMainZoneId === 'function' ? getMainZoneId() : (G.currentZone || currentZone);
    const inZone = !preview && mainZone === zoneId && !(typeof isInHiddenSubZone === 'function' && isInHiddenSubZone());
    const isHere = inZone && getCurrentLocationId() === loc.id;
    const locked = G.realmIdx < (loc.minRealm || 0);
    const realmName = PATHS[G.path]?.realms[loc.minRealm] || `Realm ${(loc.minRealm || 0) + 1}`;

    let action = '';
    if (preview) {
        action = `<div class="zone-location-preview">Preview only — travel to the region to walk.</div>`;
    } else if (locked) {
        action = `<div class="zone-guide-locked">🔒 Requires ${realmName} or higher.</div>`;
    } else if (isHere) {
        const shortcuts = [];
        if (loc.marketKey) {
            shortcuts.push(`<button type="button" class="local-map-shortcut-btn" data-local-shortcut="market">🏪 Market</button>`);
        }
        if (loc.factionNpcId || loc.type === 'sect_hq') {
            shortcuts.push(`<button type="button" class="local-map-shortcut-btn" data-local-shortcut="factions">🏛️ Factions</button>`);
        }
        shortcuts.push(`<button type="button" class="local-map-shortcut-btn" data-local-shortcut="look">👁️ Look around</button>`);
        action = `<div class="zone-location-here">📍 You are here</div>
            <div class="local-map-shortcuts">${shortcuts.join('')}</div>
            <p class="local-map-detail-hint">Close the map to explore — or use a shortcut above.</p>`;
    } else if (inZone) {
        action = `<button type="button" class="zone-location-travel-btn" data-location-travel="${loc.id}">Walk here · ${ACTION_MONTHS.localTravel || 2}mo · Qi</button>`;
    } else {
        action = `<div class="zone-location-preview">Travel to the region first</div>`;
    }

    const previewBanner = preview
        ? `<div class="local-map-preview-banner">Travel to ${zone?.emoji || ''} ${escapeHtml(zone?.name || 'this region')} first to walk here.</div>`
        : '';

    return `${previewBanner}
        <div class="zone-location-head">${loc.emoji} <strong>${escapeHtml(loc.name)}</strong> <span class="zone-location-type">${typeLabel}</span></div>
        <div class="zone-location-desc">${escapeHtml(loc.description)}</div>
        ${loc.lore ? `<div class="zone-guide-lore">${escapeHtml(loc.lore)}</div>` : ''}
        ${tags ? `<div class="zone-guide-tags">${tags}</div>` : ''}
        ${action}`;
}

function mountLocalMap() {
    const headerEl = document.getElementById('localMapHeader');
    const sceneEl = document.getElementById('localMapScene');
    const detailEl = document.getElementById('localMapDetail');
    if (!headerEl || !sceneEl || !detailEl || typeof mapPopupUi === 'undefined') return;

    const zoneId = mapPopupUi.localZoneId || (typeof getMainZoneId === 'function' ? getMainZoneId() : (G.currentZone || currentZone));
    mapPopupUi.localZoneId = zoneId;
    const preview = !!mapPopupUi.previewMode;

    if (!mapPopupUi.selectedLocationId) {
        if (!preview) {
            mapPopupUi.selectedLocationId = getCurrentLocationId() || getDefaultLocationForZone(zoneId);
        } else {
            mapPopupUi.selectedLocationId = getDefaultLocationForZone(zoneId);
        }
    }

    headerEl.innerHTML = renderLocalMapHeaderHtml(zoneId, preview);
    sceneEl.innerHTML = renderLocalMapSceneHtml(zoneId, preview);
    detailEl.innerHTML = renderLocalLocationDetailHtml(zoneId, mapPopupUi.selectedLocationId, preview);

    headerEl.querySelector('[data-map-tab="world"]')?.addEventListener('click', () => {
        if (typeof setMapPopupTab === 'function') setMapPopupTab('world');
    });

    sceneEl.querySelectorAll('[data-local-location]').forEach(btn => {
        btn.addEventListener('click', function() {
            mapPopupUi.selectedLocationId = this.dataset.localLocation;
            mountLocalMap();
        });
    });

    bindZoneLocationEvents(detailEl);

    detailEl.querySelectorAll('[data-local-shortcut]').forEach(btn => {
        btn.addEventListener('click', function() {
            const kind = this.dataset.localShortcut;
            document.getElementById('mapPopup')?.classList.remove('active');
            if (kind === 'market' && typeof actionMarket === 'function') actionMarket();
            else if (kind === 'factions' && typeof actionFactions === 'function') actionFactions();
            else if (kind === 'look' && typeof actionLookAround === 'function') actionLookAround();
            else fullRender();
        });
    });
}

function renderContinentMapSvg() {
    const mainZone = typeof getMainZoneId === 'function' ? getMainZoneId() : (G.currentZone || currentZone);
    const selected = document.querySelector('.zone-map-region--selected')?.dataset?.zoneMap
        || (typeof mapPopupUi !== 'undefined' && mapPopupUi.worldSelectedZoneId)
        || mainZone;
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

    const infZone = typeof getSectInfluenceZone === 'function' ? getSectInfluenceZone() : null;
    if (infZone && ZONE_MAP_LAYOUT[infZone]) {
        const L = ZONE_MAP_LAYOUT[infZone];
        svg += `<ellipse class="map-influence-ring" cx="${L.cx}" cy="${L.cy}" rx="${L.rx + 2.2}" ry="${L.ry + 2.2}"
            fill="none" stroke="#6ab0e0" stroke-width="0.75" stroke-dasharray="2.2 1.4" opacity="0.9"/>`;
        svg += `<text x="${L.cx + L.rx - 1}" y="${L.cy - L.ry + 1}" text-anchor="middle" font-size="3.2" class="map-influence-mark">🌏</text>`;
    }

    const rivalByZone = {};
    if (typeof getWorldSectsInZone === 'function') {
        Object.keys(ZONE_MAP_LAYOUT).forEach(zId => {
            const list = getWorldSectsInZone(zId);
            if (list.length) rivalByZone[zId] = list;
        });
    } else if (G.sect?.worldSects?.length) {
        G.sect.worldSects.forEach(s => {
            if (!s?.zone || s.destroyed) return;
            if (!rivalByZone[s.zone]) rivalByZone[s.zone] = [];
            rivalByZone[s.zone].push(s);
        });
    }
    Object.entries(rivalByZone).forEach(([zId, sects]) => {
        const L = ZONE_MAP_LAYOUT[zId];
        if (!L) return;
        const shown = sects.slice(0, 3);
        shown.forEach((s, i) => {
            const ox = (i - (shown.length - 1) / 2) * 3.6;
            const cx = L.cx + ox;
            const cy = L.cy - L.ry + 1.5;
            const tip = (s.name || 'Rival sect').replace(/"/g, '');
            svg += `<circle class="map-rival-pin" cx="${cx}" cy="${cy}" r="1.35" fill="#c07070" stroke="#2a1010" stroke-width="0.35">
                <title>${tip}</title>
            </circle>`;
        });
        if (sects.length > 3) {
            svg += `<text x="${L.cx + 6}" y="${L.cy - L.ry + 2.2}" font-size="2.4" fill="#d08080">+${sects.length - 3}</text>`;
        }
    });

    svg += '</svg>';
    return svg;
}

function mountContinentMap() {
    const el = document.getElementById('continentMap');
    if (!el) return;
    el.innerHTML = renderContinentMapSvg()
        + `<div class="map-legend">🟡 You · 🌏 Your influence · 🔴 Other sects</div>`;
    el.querySelectorAll('.zone-map-region').forEach(region => {
        region.addEventListener('click', function() {
            const zoneId = this.dataset.zoneMap;
            if (typeof mapPopupUi !== 'undefined') mapPopupUi.worldSelectedZoneId = zoneId;
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
