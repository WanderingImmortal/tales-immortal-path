// World → Continent → Region (zone) → Local place — map navigation helpers.

function getWorldGeography() {
    return typeof WORLD_GEOGRAPHY !== 'undefined' ? WORLD_GEOGRAPHY : null;
}

function getContinentIdForRegion(regionId) {
    const geo = getWorldGeography();
    return geo?.regionContinent?.[regionId] || null;
}

function getContinentDef(continentId) {
    const geo = getWorldGeography();
    return geo?.continents?.[continentId] || null;
}

function getRegionDisplayName(regionId) {
    const geo = getWorldGeography();
    if (geo?.regionTitles?.[regionId]) return geo.regionTitles[regionId];
    return ZONES[regionId]?.name || regionId;
}

function getGeographyBreadcrumbHtml(regionId) {
    const geo = getWorldGeography();
    if (!geo) return '';
    const continentId = getContinentIdForRegion(regionId);
    const continent = continentId ? getContinentDef(continentId) : null;
    const regionName = getRegionDisplayName(regionId);
    const parts = [
        `<span class="geo-crumb">${escapeHtml(geo.worldName || 'World')}</span>`
    ];
    if (continent) {
        parts.push(`<span class="geo-crumb">${continent.emoji} ${escapeHtml(continent.name)}</span>`);
    }
    parts.push(`<span class="geo-crumb geo-crumb--here">${ZONES[regionId]?.emoji || ''} ${escapeHtml(regionName)}</span>`);
    return `<div class="geo-breadcrumb" aria-label="Geography">${parts.join('<span class="geo-sep">›</span>')}</div>`;
}

function ensureMapGeographyUi() {
    if (typeof mapPopupUi === 'undefined') return;
    const main = typeof getMainZoneId === 'function' ? getMainZoneId() : (G.currentZone || currentZone);
    if (!mapPopupUi.continentId) {
        mapPopupUi.continentId = getContinentIdForRegion(main) || 'azure_sky';
    }
}

function getGeoMapElements() {
    const onContinentTab = typeof mapPopupUi !== 'undefined' && mapPopupUi.tab === 'continent';
    return {
        el: document.getElementById(onContinentTab ? 'continentMapInner' : 'continentMap'),
        info: document.getElementById(onContinentTab ? 'zoneInfoContinent' : 'zoneInfo')
    };
}

function mountWorldGeographyOverview() {
    ensureMapGeographyUi();
    const { el, info } = getGeoMapElements();
    if (!el) return;
    const geo = getWorldGeography();
    if (!geo?.continents) {
        if (typeof mountContinentMap === 'function') mountContinentMap();
        return;
    }
    const main = typeof getMainZoneId === 'function' ? getMainZoneId() : (G.currentZone || currentZone);
    const hereContinent = getContinentIdForRegion(main);

    let html = `<div class="world-geo-overview">
        <p class="world-geo-intro">${escapeHtml(geo.worldName)} — choose a continent to see its regions.</p>
        <div class="world-geo-continent-grid">`;
    Object.values(geo.continents).forEach(cont => {
        const isHere = cont.id === hereContinent;
        html += `<button type="button" class="world-geo-continent-card${isHere ? ' is-here' : ''}" data-continent-id="${cont.id}">
            <span class="world-geo-continent-emoji">${cont.emoji}</span>
            <span class="world-geo-continent-name">${escapeHtml(cont.name)}</span>
            <span class="world-geo-continent-meta">${cont.regionIds.length} region${cont.regionIds.length === 1 ? '' : 's'}${isHere ? ' · you are here' : ''}</span>
            <span class="world-geo-continent-blurb">${escapeHtml(cont.blurb || '')}</span>
        </button>`;
    });
    html += '</div></div>';
    el.innerHTML = html;

    el.querySelectorAll('[data-continent-id]').forEach(btn => {
        btn.addEventListener('click', () => {
            mapPopupUi.continentId = btn.dataset.continentId;
            if (typeof setMapPopupTab === 'function') setMapPopupTab('continent', { continentId: btn.dataset.continentId });
        });
    });

    if (info) {
        info.innerHTML = `<div class="zone-guide-header">🌍 <strong>${escapeHtml(geo.worldName)}</strong></div>
            <div class="zone-guide-purpose">Tap a continent, then a region. Walk places on the <strong>Local</strong> tab.</div>
            ${getGeographyBreadcrumbHtml(main)}`;
    }
}

function mountContinentRegionMap(continentId) {
    ensureMapGeographyUi();
    const { el, info } = getGeoMapElements();
    if (!el) return;
    const cont = getContinentDef(continentId);
    if (!cont) {
        mountWorldGeographyOverview();
        return;
    }
    mapPopupUi.continentId = continentId;
    const mainZone = typeof getMainZoneId === 'function' ? getMainZoneId() : (G.currentZone || currentZone);
    const selected = mapPopupUi.worldSelectedZoneId || mainZone;

    let svg = `<svg class="continent-map-svg continent-map-svg--regional" viewBox="0 0 100 86" role="img" aria-label="${escapeHtml(cont.name)}">
        <rect width="100" height="86" fill="#0e1620" rx="4"/>
        <text x="50" y="8" text-anchor="middle" font-size="3.2" fill="#a0b0a0">${cont.emoji} ${cont.name}</text>`;

    cont.regionIds.forEach((zoneId, idx) => {
        const layout = ZONE_MAP_LAYOUT[zoneId];
        const zone = ZONES[zoneId];
        if (!layout || !zone) return;
        const isHere = mainZone === zoneId;
        const isSelected = selected === zoneId;
        const locked = G.realmIdx < zone.minRealm;
        const fill = locked ? '#2a2a2a' : (isHere ? '#3a5a3a' : '#2a3a32');
        const stroke = isSelected ? '#f1c40f' : (isHere ? '#8aba6a' : '#5a6a52');
        const label = getRegionDisplayName(zoneId).split(' ')[0];
        svg += `<g class="zone-map-region${isHere ? ' zone-map-region--here' : ''}${isSelected ? ' zone-map-region--selected' : ''}${locked ? ' zone-map-region--locked' : ''}" data-zone-map="${zoneId}">
            <ellipse cx="${layout.cx}" cy="${layout.cy + 4}" rx="${layout.rx}" ry="${layout.ry}" fill="${fill}" stroke="${stroke}" stroke-width="${isSelected ? 1.2 : 0.7}" opacity="${locked ? 0.55 : 0.92}"/>
            <text x="${layout.cx}" y="${layout.cy + 2}" text-anchor="middle" font-size="5">${zone.emoji}</text>
            <text x="${layout.cx}" y="${layout.cy + 9}" text-anchor="middle" font-size="2.6" fill="#d8e8d0">${label}</text>
        </g>`;
    });

    svg += '</svg>';
    el.innerHTML = `<div class="continent-map-toolbar">
        <button type="button" class="local-map-world-btn" data-map-tab="world">← World</button>
        <span class="continent-map-title">${cont.emoji} ${escapeHtml(cont.name)}</span>
    </div>${svg}<div class="map-legend">Tap a region for travel info · 🟡 pin on your region when on Local/World legacy view</div>`;

    el.querySelector('[data-map-tab="world"]')?.addEventListener('click', () => {
        if (typeof setMapPopupTab === 'function') setMapPopupTab('world');
    });

    el.querySelectorAll('.zone-map-region').forEach(region => {
        region.addEventListener('click', function() {
            const zoneId = this.dataset.zoneMap;
            mapPopupUi.worldSelectedZoneId = zoneId;
            el.querySelectorAll('.zone-map-region').forEach(r => r.classList.remove('zone-map-region--selected'));
            this.classList.add('zone-map-region--selected');
            if (typeof showZoneGuide === 'function') showZoneGuide(zoneId);
        });
    });

    const guideZone = mapPopupUi.worldSelectedZoneId || mainZone;
    if (typeof showZoneGuide === 'function') showZoneGuide(guideZone);
}

function validateWorldGeographyData() {
    const errors = [];
    const geo = getWorldGeography();
    if (!geo) {
        errors.push('WORLD_GEOGRAPHY missing');
        return { ok: false, errors };
    }
    Object.keys(ZONES).forEach(regionId => {
        if (!geo.regionContinent[regionId]) errors.push(`region ${regionId} missing continent mapping`);
    });
    Object.entries(geo.regionContinent).forEach(([regionId, contId]) => {
        const cont = geo.continents[contId];
        if (!cont) errors.push(`unknown continent ${contId} for ${regionId}`);
        else if (!cont.regionIds.includes(regionId)) errors.push(`${regionId} not listed on ${contId}`);
    });
    return { ok: errors.length === 0, errors };
}
