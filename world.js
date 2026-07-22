// ============================================
// WORLD.JS — Map, zones, exploration, loot
// ============================================

const ZONES = {
    frostbite: {
        name: "Frostbite Wastes",
        emoji: "❄️",
        biome: "Eternal Winter",
        difficulty: "hard",
        minRealm: 1,
        description: "A frozen tundra where only the strong survive.",
        purpose: "Late-game frost loot, ice manuals, and high-risk forbidden grounds.",
        highlights: ["Ice & frost materials", "Hard explore encounters", "Frozen forbidden sites"],
        lore: "They say the Wastes were scoured bare when an immortal's tribulation froze the land for ten thousand years. Only frost-path cultivators and the desperate still walk here.",
        events: ["Blizzard", "Frozen Ruins", "White Wolf Pack"]
    },
    dustbone: {
        name: "Dustbone Desert",
        emoji: "🏜️",
        biome: "Scorched Sands",
        difficulty: "medium",
        minRealm: 0,
        description: "Endless dunes and the bones of fallen civilizations.",
        purpose: "Safe starting zone — explore for stones, basic materials, and story NPCs.",
        highlights: ["Starter explore loot", "Caravan & story quests", "No realm lock"],
        lore: "The bones of three dynasties lie under these sands. Merchants cross Dustbone because every dune hides something — relic, beast, or corpse with a manual in its ribs.",
        events: ["Sandstorm", "Ancient Relics", "Sand Serpent"]
    },
    heartlands: {
        name: "Heavenly Heartlands",
        emoji: "🏯",
        biome: "Rich Spiritual Energy",
        difficulty: "extreme",
        minRealm: 3,
        description: "The center of cultivation on the Azure Sky Continent.",
        purpose: "Endgame hub — Celestial Market, elite techniques, and sect prestige events.",
        highlights: ["🏪 Celestial Market", "Rare manuals & pills", "Highest-tier loot tables"],
        lore: "Nine great sects ring the Heartlands like petals around a lotus. Spiritual veins run so deep that Nascent Soul cultivators still feel the continent's heartbeat beneath their feet.",
        events: ["Sect Tournament", "Dao Lecture", "Celestial Market"]
    },
    jade: {
        name: "Jade Tide Archipelago",
        emoji: "🌊",
        biome: "Misty Isles",
        difficulty: "medium",
        minRealm: 0,
        description: "A chain of tropical islands where merchants and pirates thrive.",
        purpose: "Early market access — Tide Merchant Guild sells techniques, pills, and starter gear.",
        highlights: ["🏪 Tide Merchant Guild", "Sea beast loot", "Pirate & merchant events"],
        lore: "The Guild controls the tide-roads between islands. Their ledger holds debts from half the continent — and their vaults hold manuals the Heartlands sects would kill to suppress.",
        events: ["Sea Beast Hunt", "Pirate Attack", "Merchant Fleet"]
    },
    emberwild: {
        name: "Emberwild Jungle",
        emoji: "🌋",
        biome: "Volcanic Rainforest",
        difficulty: "hard",
        minRealm: 1,
        description: "A dense jungle teeming with life — and death.",
        purpose: "Mid-game materials, beast cores, and story clues (Lost Disciple arc).",
        highlights: ["Volcanic craft mats", "Story NPCs & quests", "Obsidian forbidden ground"],
        lore: "Ash falls like snow from vents that never sleep. Cultivators come for demon cores and leave as fertilizer — unless they learn the jungle's old rule: move fast, or don't move at all.",
        events: ["Beast Tide", "Venomroot Swamp", "Obsidian Temple"]
    }
};

let currentZone = "dustbone";

// ===== MAP FUNCTIONS =====
function actionMap() {
    if (G.gameOver) return;
    renderMapPopup();
    document.getElementById('mapPopup').classList.add('active');
}

function getActiveZoneId() {
    if (typeof isInHiddenSubZone === 'function' && isInHiddenSubZone()) {
        return G.ancients.activeSubZone;
    }
    return G.currentZone || currentZone;
}

function getMainZoneId() {
    const id = getActiveZoneId();
    if (typeof HIDDEN_SUBZONES !== 'undefined' && HIDDEN_SUBZONES[id]) {
        return HIDDEN_SUBZONES[id].parentZone;
    }
    return id;
}

function renderMapPopup() {
    const here = getActiveZoneId();
    const mainId = getMainZoneId();
    if (typeof mountContinentMap === 'function') mountContinentMap();
    const display = (typeof getDisplayZoneDef === 'function' ? getDisplayZoneDef() : null)
        || ZONES[here] || ZONES[mainId];
    const parent = ZONES[mainId];
    let label = typeof getPlaceDisplayLabel === 'function' ? getPlaceDisplayLabel() : (display ? `${display.emoji} ${display.name}` : here);
    if (HIDDEN_SUBZONES[here] && parent && typeof getPlaceDisplayLabel !== 'function') {
        label += ` (within ${parent.emoji} ${parent.name})`;
    }
    document.getElementById('currentZoneDisplay').textContent = `Current: ${label}`;
    if (HIDDEN_SUBZONES[here]) {
        showHiddenSubZoneGuide(here);
    } else {
        showZoneGuide(mainId);
    }
    if (typeof renderMapSubZoneBadges === 'function') renderMapSubZoneBadges();
}

function showHiddenSubZoneGuide(subZoneId) {
    const sub = HIDDEN_SUBZONES[subZoneId];
    const info = document.getElementById('zoneInfo');
    if (!sub || !info) return;

    const parent = sub.parentZone;
    document.querySelectorAll('.zone-card').forEach(card => {
        const z = card.dataset.zone;
        const selected = z === parent;
        card.style.borderColor = selected ? '#f1c40f' : '';
        card.style.boxShadow = selected ? '0 0 20px rgba(241,196,15,0.35)' : 'none';
    });

    const ancient = SEALED_ANCIENTS[sub.ancientId];
    let html = `
        <div class="zone-guide-header">${sub.emoji} <strong>${sub.name}</strong> · ${sub.biome}</div>
        <div class="zone-guide-purpose"><strong>Hidden realm:</strong> ${escapeHtml(sub.description)}</div>
        <div class="zone-guide-lore">${escapeHtml(sub.lore || '')}</div>
        <div class="zone-guide-tags"><span class="zone-guide-tag">🔒 Sealed Ancient Site</span></div>`;
    if (ancient) {
        html += `<div class="ancients-revealed-banner unsealed">✨ ${ancient.emoji} ${ancient.name} — ${escapeHtml(ancient.desc)}</div>`;
    }
    if (typeof renderAncientsZonePanelHtml === 'function') {
        html += renderAncientsZonePanelHtml(parent);
    }
    info.innerHTML = html;
    if (typeof bindAncientsZonePanelEvents === 'function') bindAncientsZonePanelEvents(info);
}

function showZoneGuide(zoneId) {
    const zone = ZONES[zoneId];
    const info = document.getElementById('zoneInfo');
    if (!zone || !info) return;

    const mainHere = getMainZoneId();
    document.querySelectorAll('.zone-map-region').forEach(region => {
        const z = region.dataset.zoneMap;
        region.classList.toggle('zone-map-region--selected', z === zoneId);
        region.classList.toggle('zone-map-region--here', z === mainHere);
    });

    const locked = G.realmIdx < zone.minRealm;
    const realmName = PATHS[G.path].realms[zone.minRealm] || `Realm ${zone.minRealm + 1}`;
    const marketLine = (typeof getLocationsInZone === 'function' ? getLocationsInZone(zoneId).some(l => l.marketKey) : isMerchantZone(zoneId))
        ? `<div class="zone-guide-tag market">🏪 Market in this region</div>`
        : '';
    const highlights = (zone.highlights || []).map(h =>
        `<span class="zone-guide-tag">${escapeHtml(h)}</span>`
    ).join('');

    let travelBtn = '';
    const hereMain = getMainZoneId();
    if (zoneId === hereMain && !(typeof isInHiddenSubZone === 'function' && isInHiddenSubZone())) {
        travelBtn = `<div class="zone-guide-here">📍 You are in this region.</div>`;
    } else if (locked) {
        travelBtn = `<div class="zone-guide-locked">🔒 Requires ${realmName} or higher.</div>`;
    } else {
        travelBtn = `<button type="button" class="zone-travel-btn" data-zone-travel="${zoneId}">🗺️ Travel here · ${ACTION_MONTHS.travel} months · costs Qi</button>`;
    }

    const locationsHtml = typeof renderZoneLocationsHtml === 'function' ? renderZoneLocationsHtml(zoneId) : '';

    info.innerHTML = `
        <div class="zone-guide-header">${zone.emoji} <strong>${zone.name}</strong> · ${zone.biome}</div>
        <div class="zone-guide-purpose"><strong>Why go:</strong> ${escapeHtml(zone.purpose || zone.description)}</div>
        <div class="zone-guide-lore">${escapeHtml(zone.lore || zone.description)}</div>
        <div class="zone-guide-tags">${marketLine}${highlights}</div>
        ${travelBtn}
        ${locationsHtml}
        ${typeof renderAncientsZonePanelHtml === 'function' ? renderAncientsZonePanelHtml(zoneId) : ''}
    `;

    info.querySelector('[data-zone-travel]')?.addEventListener('click', function() {
        travelToZone(this.dataset.zoneTravel);
    });
    if (typeof bindZoneLocationEvents === 'function') bindZoneLocationEvents(info);
    if (typeof bindAncientsZonePanelEvents === 'function') bindAncientsZonePanelEvents(info);
}

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function travelToZone(zoneId) {
    const zone = ZONES[zoneId];
    if (!zone) return;
    const hereMain = getMainZoneId();
    const inSub = typeof isInHiddenSubZone === 'function' && isInHiddenSubZone();
    if (zoneId === hereMain && !inSub) {
        showZoneGuide(zoneId);
        return;
    }
    if (G.realmIdx < zone.minRealm) {
        showZoneGuide(zoneId);
        return;
    }
    const cost = 5 + Math.floor(Math.random() * 10);
    if (G.qi < cost) {
        addLog(`😅 Not enough Qi to travel — need ${cost}.`);
        showZoneGuide(zoneId);
        fullRender();
        return;
    }
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.travel, `Journey to ${zone.name}`)) { cancelActionLog(); fullRender(); return; }
    G.qi -= cost;
    const prevZone = currentZone;
    if (typeof exitHiddenSubZone === 'function' && inSub) {
        G.ancients.activeSubZone = null;
    }
    currentZone = zoneId;
    G.currentZone = zoneId;
    if (typeof resetSoulSearchExploreBonus === 'function') resetSoulSearchExploreBonus();
    let msg = `🗺️ You travel to the ${zone.emoji} ${zone.name}`;
    if (typeof getDefaultLocationForZone === 'function') {
        G.currentLocation = getDefaultLocationForZone(zoneId);
        const loc = typeof getLocationDef === 'function' ? getLocationDef(G.currentLocation) : null;
        if (loc) msg += ` — arrive at ${loc.emoji} ${loc.name}`;
    }
    const event = zone.events[Math.floor(Math.random() * zone.events.length)];
    msg += `. You encounter: ${event}`;
    commitActionLog(msg + '.');
    if (typeof onTravelForStoryQuests === 'function') onTravelForStoryQuests(prevZone, zoneId);
    if (typeof tryAdvanceDemonicRedemptionOnTravel === 'function') tryAdvanceDemonicRedemptionOnTravel();
    if (!tryStartZoneEncounter('travel')) {
        const reward = 2 + Math.floor(Math.random() * 5) + G.realmIdx;
        G.stones += reward;
        addLog(`💎 +${reward} Stones from exploration.`);
    }
    if (typeof tryRoadAmbientEncounter === 'function') tryRoadAmbientEncounter('travel');
    if (typeof tryNpcBetrayalAmbush === 'function') tryNpcBetrayalAmbush('travel');
    if (typeof fireSceneNoticesOnArrive === 'function') {
        fireSceneNoticesOnArrive({ locationId: G.currentLocation, zoneId });
    }
    renderMapPopup();
    fullRender();
}

function bindMapEvents() {
    document.getElementById('mapClose').addEventListener('click', function() {
        document.getElementById('mapPopup').classList.remove('active');
    });
}

// ===== EXPLORE =====

function getZoneTechniquePool(zoneId) {
    const table = ZONE_LOOT[zoneId];
    if (!table) return [];
    const fromList = (table.techniques || []).map(name => ({
        name: `${name} Manual`,
        type: 'technique',
        value: 15,
        technique: name
    }));
    const fromRare = (table.rare || []).filter(item => item.type === 'technique');
    const seen = new Set();
    return [...fromRare, ...fromList].filter(item => {
        const key = item.technique || item.name;
        if (seen.has(key)) return false;
        seen.add(key);
        const techName = item.technique || item.name;
        const template = TECHNIQUE_POOL.find(t => t.name === techName);
        if (template && typeof canRandomGrantTechnique === 'function' && !canRandomGrantTechnique(template)) {
            return false;
        }
        return true;
    });
}

function rollExploreLoot(zoneId) {
    const lootTable = ZONE_LOOT[zoneId];
    if (!lootTable) return null;

    const techPool = getZoneTechniquePool(zoneId);
    if (techPool.length && Math.random() < EXPLORE_BALANCE.manualFindChance) {
        return techPool[Math.floor(Math.random() * techPool.length)];
    }

    if (typeof rollExploreMethodLoot === 'function') {
        const methodLoot = rollExploreMethodLoot();
        if (methodLoot) return methodLoot;
    }

    const roll = Math.random();
    if (roll < EXPLORE_BALANCE.ultraChance && lootTable.ultra?.length) {
        return lootTable.ultra[Math.floor(Math.random() * lootTable.ultra.length)];
    }
    if (roll < EXPLORE_BALANCE.ultraChance + EXPLORE_BALANCE.rareChance && lootTable.rare?.length) {
        return lootTable.rare[Math.floor(Math.random() * lootTable.rare.length)];
    }
    return lootTable.common[Math.floor(Math.random() * lootTable.common.length)];
}

function applyExploreRewardMult(value) {
    if (!value) return 0;
    let mult = getPlayerTraitMultPct('exploreRewardPct', 0);
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : (G.currentZone || currentZone);
    if (typeof getFactionExploreBonusMult === 'function') {
        mult *= getFactionExploreBonusMult(zoneId);
    }
    if (typeof getPlaytestStoneMult === 'function') {
        mult *= getPlaytestStoneMult();
    }
    return Math.max(0, Math.ceil(value * mult));
}

function applyExploreLoot(loot) {
    if (!loot) return;
    if (loot.type === "technique") {
        const techName = loot.technique || loot.name;
        const template = TECHNIQUE_POOL.find(t => t.name === techName);
        if (template && typeof grantManual === 'function') {
            grantManual(techName, { silent: true, source: typeof getLootZoneId === 'function' ? getLootZoneId() : G.currentZone });
            addLog(`📜 Manual found: ${techName}! Check your travel kit in Inventory.`);
        } else {
            const soldFor = applyExploreRewardMult(loot.value || 5);
            G.stones += soldFor;
            addLog(`💎 You sell ${loot.name} for ${soldFor} Stones.`);
        }
    } else if (loot.type === "cultivation_method") {
        const methodId = loot.methodId;
        const method = typeof getCultivationMethodDef === 'function' ? getCultivationMethodDef(methodId) : null;
        if (method && typeof grantMethodScroll === 'function') {
            const got = grantMethodScroll(methodId, {
                silent: true,
                source: typeof getLootZoneId === 'function' ? getLootZoneId() : G.currentZone
            });
            if (got) addLog(`📘 Cultivation scroll found: ${method.name}! Check Inventory → Cultivation scrolls.`);
            else addLog(`📘 Found ${method.name}, but your travel kit is full.`);
        }
    } else if (loot.type === "pill") {
        const pillId = loot.pillId || rollRandomPillId();
        addPill(pillId, 1);
        const pill = PILL_TYPES[pillId];
        addLog(`💊 Found ${pill ? pill.name : 'a pill'}!`);
    } else if (loot.type === "consumable") {
        addPill(rollRandomPillId(), 1);
        addLog(`💊 You found a cultivation pill!`);
    } else if (loot.type === "currency") {
        const stones = applyExploreRewardMult(loot.value);
        G.stones += stones;
        addLog(`💎 +${stones} Stones`);
    } else if (loot.type === "legendary_material") {
        if (!G.legendaryMaterials) G.legendaryMaterials = [];
        G.legendaryMaterials.push(loot.name);
        addLog(`🏆 Legendary Material acquired: ${loot.name}!`);
    } else if (loot.type === "material") {
        if (typeof applyExploreCraftMaterial === 'function' && applyExploreCraftMaterial(loot.name)) {
            G.stones += Math.floor((loot.value || 2) / 2);
        } else {
            if (!G.inventory) G.inventory = [];
            G.inventory.push(loot.name);
            G.stones += Math.floor((loot.value || 2) / 2);
            addLog(`📦 ${loot.name} added to inventory.`);
        }
    } else {
        if (!G.inventory) G.inventory = [];
        G.inventory.push(loot.name);
        G.stones += Math.floor((loot.value || 2) / 2);
        addLog(`📦 ${loot.name} added to inventory.`);
    }
}

function isMerchantZone(zoneId) {
    if (typeof isMarketAtCurrentLocation === 'function' && isMarketAtCurrentLocation()) return true;
    return false;
}

function actionMarket() {
    if (G.gameOver || G.inCombat) return;
    if (!isMerchantZone()) {
        const hint = typeof getLocationsInZone === 'function'
            ? getLocationsInZone(getMainZoneId()).filter(l => l.marketKey).map(l => l.name).join(' or ')
            : 'Celestial Market or Tide Harbor';
        addLog(`🏪 No market here. Walk to ${hint || 'a market district'}.`);
        fullRender();
        return;
    }
    renderMerchantPopup();
    document.getElementById('merchantPopup').classList.add('active');
}

function buyCultivationMethod(methodId) {
    const zoneId = typeof getMerchantCatalogKey === 'function' ? getMerchantCatalogKey() : getActiveZoneId();
    const catalog = zoneId ? MERCHANT_CATALOG[zoneId] : null;
    if (!catalog?.methods?.length) return;
    const item = catalog.methods.find(s => s.methodId === methodId);
    if (!item) return;
    const method = typeof getCultivationMethodDef === 'function' ? getCultivationMethodDef(methodId) : null;
    if (!method) return;
    const reqRealm = item.reqRealm ?? method.reqRealm ?? 0;
    if (G.realmIdx < reqRealm) {
        const realmName = PATHS[G.path]?.realms[reqRealm] || `realm ${reqRealm + 1}`;
        addLog(`📘 ${method.name} requires ${realmName} or higher.`);
        fullRender();
        return;
    }
    const priceMult = typeof getFactionMarketPriceMult === 'function' ? getFactionMarketPriceMult(zoneId) : 1;
    const finalPrice = Math.max(1, Math.floor(item.price * priceMult));
    if (G.stones < finalPrice) {
        addLog(`💎 Need ${finalPrice} Stones for ${method.name}. You have ${G.stones}.`);
        fullRender();
        return;
    }
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.market, `Buying ${method.name} at the market`)) {
        cancelActionLog();
        fullRender();
        return;
    }
    G.stones -= finalPrice;
    const got = typeof grantMethodScroll === 'function' && grantMethodScroll(methodId, { silent: true, source: 'market' });
    const discountNote = finalPrice < item.price ? ` (favor discount: −${item.price - finalPrice})` : '';
    const note = got ? ' — shelved under Cultivation scrolls' : ' — kit full, purchase failed';
    if (!got) G.stones += finalPrice;
    commitActionLog(got
        ? `🏪 Purchased cultivation scroll: ${method.name} for ${finalPrice} Stones${discountNote}${note}.`
        : `🏪 Could not stow ${method.name} — travel kit full. Stones refunded.`);
    if (typeof renderMerchantPopup === 'function') renderMerchantPopup();
    fullRender();
}

function buyTechnique(techName) {
    const zoneId = typeof getMerchantCatalogKey === 'function' ? getMerchantCatalogKey() : getActiveZoneId();
    const catalog = zoneId ? MERCHANT_CATALOG[zoneId] : null;
    if (!catalog) return;
    const item = catalog.stock.find(s => s.technique === techName);
    if (!item) return;
    const template = TECHNIQUE_POOL.find(t => t.name === techName);
    const reqRealm = typeof getMarketTechniqueReqRealm === 'function'
        ? getMarketTechniqueReqRealm(techName)
        : (item.reqRealm ?? 0);
    if (G.realmIdx < reqRealm) {
        const realmName = PATHS[G.path]?.realms[reqRealm] || `realm ${reqRealm + 1}`;
        addLog(`📜 ${techName} requires ${realmName} or higher.`);
        fullRender();
        return;
    }
    if (typeof isMarketTechniqueUnlocked === 'function' && !isMarketTechniqueUnlocked(techName, zoneId)) {
        const reason = typeof getMarketTechniqueLockReason === 'function' ? getMarketTechniqueLockReason(techName, zoneId) : 'Faction standing required.';
        addLog(`🏪 ${techName} locked — ${reason}`);
        fullRender();
        return;
    }
    const priceMult = typeof getFactionMarketPriceMult === 'function' ? getFactionMarketPriceMult(zoneId) : 1;
    const finalPrice = Math.max(1, Math.floor(item.price * priceMult));
    if (G.stones < finalPrice) {
        addLog(`💎 Need ${finalPrice} Stones for ${techName}. You have ${G.stones}.`);
        fullRender();
        return;
    }
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.market, `Studying ${techName} at the market`)) {
        cancelActionLog();
        fullRender();
        return;
    }
    G.stones -= finalPrice;
    const gotManual = typeof grantManual === 'function' && grantManual(techName, { silent: true });
    const discountNote = finalPrice < item.price ? ` (Jade Lotus favor: −${item.price - finalPrice})` : '';
    const learnNote = gotManual ? ' — manual shelved' : '';
    commitActionLog(`🏪 Purchased ${techName} manual for ${finalPrice} Stones${discountNote}${learnNote}.`);
    renderMerchantPopup();
    fullRender();
}

function actionExplore() {
    if (G.gameOver || G.inCombat) return;
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : (G.currentZone || currentZone);
    const zone = ZONES[zoneId];
    if (!zone) return;
    const inSub = typeof isInHiddenSubZone === 'function' && isInHiddenSubZone();
    const subDef = inSub && typeof HIDDEN_SUBZONES !== 'undefined' ? HIDDEN_SUBZONES[getActiveZoneId()] : null;
    const locDef = !inSub && typeof getCurrentLocationDef === 'function' ? getCurrentLocationDef() : null;
    const placeLabel = subDef ? `${subDef.emoji} ${subDef.name}`
        : locDef ? `${locDef.emoji} ${locDef.name}`
        : `${zone.emoji} ${zone.name}`;
    beginActionLog();
    if (!advanceTime(ACTION_MONTHS.explore, `Exploring ${placeLabel}`)) { cancelActionLog(); fullRender(); return; }
    const eventName = zone.events[Math.floor(Math.random() * zone.events.length)];
    commitActionLog(`🗺️ Exploring ${placeLabel} — You encounter: ${eventName}`);

    if (tryStartZoneEncounter('explore')) {
        rollForbiddenClueFromExplore();
        if (typeof rollAncientClueFromExplore === 'function') rollAncientClueFromExplore(zoneId);
        if (typeof onExploreForStoryQuests === 'function') onExploreForStoryQuests(zoneId);
        if (typeof recordMilestone === 'function') recordMilestone('explored');
        fullRender();
        return;
    }

    const loot = typeof rollExploreLootWithPerception === 'function'
        ? rollExploreLootWithPerception(zoneId)
        : rollExploreLoot(zoneId);
    const subLoot = inSub && typeof rollSubZoneExploreLoot === 'function'
        ? rollSubZoneExploreLoot(getActiveZoneId())
        : null;
    const finalLoot = subLoot || loot;
    if (finalLoot) {
        if (finalLoot.type === 'technique') {
            addLog(`📜 Manual discovery: ${finalLoot.technique || finalLoot.name}!`);
        } else if (finalLoot.type === 'legendary_material') {
            addLog(`🌟 ULTRA-RARE FIND: ${finalLoot.name}!`);
        } else if (finalLoot.value >= 12 || finalLoot.type === 'consumable') {
            addLog(`✨ Rare find: ${finalLoot.name}!`);
        } else {
            addLog(`📦 You find: ${finalLoot.name}`);
        }
        applyExploreLoot(finalLoot);
        if (subLoot) addLog(`🔒 Hidden realm treasure from the sealed site.`);
    } else {
        const reward = applyExploreRewardMult(2 + Math.floor(Math.random() * 5) + G.realmIdx);
        let soulSearchMult = typeof getSoulSearchExploreRollMult === 'function' ? getSoulSearchExploreRollMult() : 1;
        let bonusStones = 0;
        if (typeof getSectExploreBonus === 'function') {
            const inf = getSectExploreBonus(zoneId);
            if (inf) bonusStones = inf.exploreStoneBonus || 0;
        }
        G.stones += Math.max(0, Math.floor((reward + bonusStones) * soulSearchMult));
        let msg = `💎 +${Math.max(0, Math.floor(reward * soulSearchMult))} Stones`;
        if (bonusStones) msg += ` (+${bonusStones} sect influence)`;
        addLog(msg + '.');
        if (typeof getSectExploreBonus === 'function') {
            const inf = getSectExploreBonus(zoneId);
            if (inf && Math.random() < (inf.exploreFameChance || 0)) {
                let fameBonus = inf.exploreFameBonus || 2;
                if (typeof getSectPerkExploreFameBonus === 'function') fameBonus += getSectPerkExploreFameBonus();
                G.fame += fameBonus;
                addLog(`🌏 Your sect's influence spreads — +${fameBonus} Fame.`);
            }
        }
        if (typeof getSectPerkExploreFameBonus === 'function' && getSectPerkExploreFameBonus() > 0 && Math.random() < 0.12) {
            const perkFame = getSectPerkExploreFameBonus();
            G.fame += perkFame;
            addLog(`🌿 Respected in the villages — +${perkFame} Fame.`);
            if (typeof applyWorldSectRelationshipDrift === 'function') {
                applyWorldSectRelationshipDrift('village_help', { zone: zoneId });
            }
        }
    }
    if (zone.difficulty === "hard" || zone.difficulty === "extreme") {
        if (Math.random() < 0.25) {
            let dmg = 3 + Math.floor(Math.random() * 6);
            if (zoneId === 'frostbite' && typeof getFactionColdResistPct === 'function') {
                const resist = getFactionColdResistPct(zoneId);
                dmg = Math.max(1, Math.floor(dmg * (1 - resist / 100)));
            }
            G.hp = Math.max(1, G.hp - dmg);
            addLog(`💢 The harsh environment wounds you. -${dmg} HP.`);
        }
    }
    if (zone.difficulty === "extreme" && G.realmIdx < 4) {
        addLog(`⚠️ The Heavenly Heartlands are dangerous for your level. Stay vigilant.`);
    }
    rollForbiddenClueFromExplore();
    if (typeof rollAncientClueFromExplore === 'function') rollAncientClueFromExplore(zoneId);
    if (typeof onExploreForFactions === 'function') onExploreForFactions(zoneId);
    if (typeof onExploreForStoryQuests === 'function') onExploreForStoryQuests(zoneId);
    if (typeof recordMilestone === 'function') recordMilestone('explored');
    if (typeof tryRollAlchemyMaterialFromExplore === 'function') tryRollAlchemyMaterialFromExplore();
    if (typeof tryRoadAmbientEncounter === 'function') tryRoadAmbientEncounter('explore');
    if (typeof tryNpcBetrayalAmbush === 'function') tryNpcBetrayalAmbush('explore');
    fullRender();
}

// ===== ZONE ENCOUNTERS =====

function rollZoneEncounter(zoneId) {
    const pool = ZONE_ENCOUNTERS[zoneId];
    if (!pool || pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
}

function tryStartZoneEncounter(source) {
    if (G.gameOver || G.inCombat || (typeof isTribulationActive === 'function' && isTribulationActive())) return false;
    let chance = source === 'travel' ? ENCOUNTER_BALANCE.travelChance : ENCOUNTER_BALANCE.exploreChance;
    if (typeof getDaoAlignmentEncounterChanceMult === 'function') {
        chance *= getDaoAlignmentEncounterChanceMult();
    }
    if (Math.random() >= chance) return false;
    const encounter = rollZoneEncounter(currentZone);
    if (!encounter) return false;
    startZoneEncounter(encounter, source);
    return true;
}

function startZoneEncounter(encounter, source) {
    G.encounterState = { encounter, source, pending: null };
    addLog(`⚡ ${encounter.title}!`);
    renderEncounterOverlay();
    document.getElementById('encounterOverlay').classList.add('active');
}

function formatEncounterChoiceMeta(c) {
    const parts = [];
    if (c.months) parts.push(`⏳ ${c.months} mo`);
    if (c.combat) parts.push('⚔️ Combat');
    if (c.hp) parts.push(c.hp > 0 ? `❤️ +${c.hp} HP` : `❤️ ${c.hp} HP`);
    if (c.stones) parts.push(`💎 ${c.stones > 0 ? '+' : ''}${c.stones} stones`);
    if (c.fame) parts.push(`🌟 ${c.fame > 0 ? '+' : ''}${c.fame} Fame`);
    if (c.foundation) parts.push(`⭐ +${c.foundation} Foundation`);
    if (c.qi) parts.push(c.qi > 0 ? `⚡ +${c.qi} Qi` : `⚡ ${c.qi} Qi`);
    if (c.will) parts.push(`💪 +${c.will} Will`);
    if (c.spirit) parts.push(`✨ +${c.spirit} Spirit`);
    if (c.pill) parts.push('💊 Pill reward');
    if (c.require) {
        if (c.require.alignment != null) parts.push(`☯️ Align ${c.require.alignment}+`);
        else if (c.require.alignmentMax != null) parts.push(`☯️ Align ≤${c.require.alignmentMax}`);
        else {
            const statName = { will: 'Will', spirit: 'Spirit', fame: 'Fame' }[c.require.stat] || c.require.stat;
            parts.push(`📊 ${statName} ${c.require.min}+`);
        }
    }
    return parts.join(' · ') || 'Choose wisely';
}

function renderEncounterOverlay() {
    const state = G.encounterState;
    if (!state) return;
    const enc = state.encounter;
    document.getElementById('encounterTitle').textContent = `⚡ ${enc.title}`;
    document.getElementById('encounterText').textContent = enc.text;
    const choices = document.getElementById('encounterChoices');
    choices.innerHTML = enc.choices.map((c, i) => {
        const flavor = c.flavor ? `<div class="encounter-choice-flavor">${c.flavor}</div>` : '';
        return `<button type="button" class="popup-item encounter-choice" data-idx="${i}">
            <div class="name">${c.label}</div>
            ${flavor}
            <div class="encounter-choice-meta">${formatEncounterChoiceMeta(c)}</div>
        </button>`;
    }).join('');
    choices.querySelectorAll('.encounter-choice').forEach(btn => {
        btn.addEventListener('click', function() {
            encounterChoose(parseInt(this.dataset.idx, 10));
        });
    });
}

function encounterMeetsRequire(req) {
    if (!req) return true;
    if (req.alignment != null && (G.daoAlignment || 0) < req.alignment) return false;
    if (req.alignmentMax != null && (G.daoAlignment || 0) > req.alignmentMax) return false;
    const val = G[req.stat] || 0;
    return val >= req.min;
}

function closeEncounterOverlay() {
    document.getElementById('encounterOverlay')?.classList.remove('active');
    G.encounterState = null;
}

function encounterChoose(idx) {
    const state = G.encounterState;
    if (!state) return;
    const choice = state.encounter.choices[idx];
    if (!choice) return;

    if (!encounterMeetsRequire(choice.require)) {
        const failEffects = { ...(choice.fail || { months: choice.months || 2, hp: -5 }) };
        failEffects.log = choice.failLog || 'You are not ready for this.';
        encounterApplyEffects(failEffects, false);
        fullRender();
        return;
    }

    if (choice.combat) {
        state.pending = { ...choice };
        delete state.pending.combat;
        document.getElementById('encounterOverlay').classList.remove('active');
        startEncounterCombat(choice.combat);
        fullRender();
        return;
    }
    encounterApplyEffects(choice, true);
    fullRender();
}

function formatEncounterOutcomeMessage(effects) {
    let msg = effects.log ? `⚡ ${effects.log}` : '⚡ The encounter resolves.';
    const bits = [];
    if (effects.hp) bits.push(`${effects.hp > 0 ? '+' : ''}${effects.hp} HP`);
    if (effects.stones) bits.push(`${effects.stones > 0 ? '+' : ''}${effects.stones} Stones`);
    if (effects.fame) bits.push(`${effects.fame > 0 ? '+' : ''}${effects.fame} Fame`);
    if (effects.foundation) bits.push(`+${effects.foundation} Foundation`);
    if (effects.qi) bits.push(`${effects.qi > 0 ? '+' : ''}${effects.qi} Qi`);
    if (effects.will) bits.push(`+${effects.will} Will`);
    if (effects.spirit) bits.push(`+${effects.spirit} Spirit`);
    if (effects.pill) bits.push('pill reward');
    if (bits.length) msg += ` (${bits.join(', ')})`;
    return msg;
}

function encounterApplyEffects(effects, closeOverlay) {
    const state = G.encounterState;
    let months = effects.months || 2;
    if (G.forbiddenLifespanMult && G.forbiddenLifespanMult > 1) {
        months = Math.max(1, Math.floor(months / G.forbiddenLifespanMult));
    }
    const label = state?.encounter?.title || effects.log || 'Zone encounter';
    beginActionLog();
    if (!advanceTime(months, label)) {
        cancelActionLog();
        closeEncounterOverlay();
        fullRender();
        return;
    }

    if (effects.hp) G.hp = clamp(G.hp + effects.hp, 1, G.maxHp);
    if (effects.stones) G.stones = Math.max(0, G.stones + effects.stones);
    if (effects.fame) G.fame = Math.max(0, G.fame + effects.fame);
    if (effects.foundation) grantFoundation(effects.foundation);
    if (effects.qi) G.qi = Math.max(0, G.qi + effects.qi);
    if (effects.will) G.will += effects.will;
    if (effects.spirit) G.spirit += effects.spirit;
    if (effects.pill) addPill(effects.pill, 1);
    if (effects.alignmentShift && typeof shiftDaoAlignment === 'function') {
        shiftDaoAlignment(effects.alignmentShift, state?.encounter?.title || 'zone encounter');
    }
    if (effects.corruptionGain) {
        G.corruptionLevel = (G.corruptionLevel || 0) + effects.corruptionGain;
        addLog(`🩸 Corruption +${effects.corruptionGain}.`);
    }

    commitActionLog(formatEncounterOutcomeMessage(effects));

    if (closeOverlay !== false) closeEncounterOverlay();
}

function isEncounterCombat() {
    return !!(G.encounterCombat && G.inCombat);
}

function startEncounterCombat(combatKey) {
    const def = ENCOUNTER_ENEMIES[combatKey];
    if (!def) return;
    const template = ENEMIES.find(e => e.name === def.template) || ENEMIES[Math.min(G.realmIdx, ENEMIES.length - 1)];

    G.encounterCombat = combatKey;
    G.inCombat = true;
    G.defending = false;
    G.fortifyActive = false;
    G.combatLog = [];
    initCombatStatus();
    initCombatResource();
    updateShield();
    if (G.path === 'soul') G.shield = G.maxShield;

    G.enemy = buildEnemyFromDef(def, template, { extraFlags: { isEncounter: true } });
    if (def.emoji) G.enemy.name = `${def.emoji} ${def.name}`;
    G.enemyMaxHp = G.enemy.maxHp;

    addCombatLog(`⚡ ${def.name} appears! (${G.enemy.hp} HP)`);
    if (typeof isCombatQiLinked === 'function' && isCombatQiLinked()) {
        const pool = getQiLinkedCombatStartPool();
        addCombatLog(`🌬️ Breath ${G.combatResource}/${G.maxCombatResource} drawn from dantian (${pool.currentQi}/${pool.maxQi} Qi).`);
    }
    setupCombatActions();
    G.combatPhase = 'player';
    clearCombatTurnTimer();
    setCombatInputEnabled(true);
    updateCombatUI();
    document.getElementById('combatOverlay').classList.add('active');
}

function encounterCombatVictory() {
    const state = G.encounterState;
    const combatKey = G.encounterCombat;
    const lootLines = typeof grantEncounterCombatLoot === 'function' ? grantEncounterCombatLoot(combatKey) : [];
    if (typeof finalizeCombatQiDrain === 'function') finalizeCombatQiDrain({ victory: true });
    G.inCombat = false;
    G.defending = false;
    G.encounterCombat = null;
    clearCombatStatus();
    document.getElementById('combatOverlay').classList.remove('active');
    G.enemy = null;
    addCombatLog(`💀 Encounter won!`);
    if (state?.pending) {
        encounterApplyEffects(state.pending, true);
        if (lootLines.length) {
            addLog(`📦 Spoils: ${lootLines.join(', ')}`);
        }
    } else {
        const stones = 5 + G.realmIdx * 2;
        G.stones += stones;
        grantFoundation(2);
        addLog(`⚡ Victory spoils: +${stones} Stones, +2 Foundation.`);
        if (lootLines.length) addLog(`📦 Materials: ${lootLines.join(', ')}`);
        if (typeof showCombatVictoryPopup === 'function') {
            const rewards = [`💎 +${stones} Spirit Stones`, '🏛️ +2 Foundation', ...lootLines];
            showCombatVictoryPopup({
                enemyName: ENCOUNTER_ENEMIES[combatKey]?.name || 'Encounter foe',
                subtitle: 'You survived the wild encounter.',
                rewards
            });
        }
        closeEncounterOverlay();
    }
    fullRender();
}

function encounterCombatDefeat() {
    G.hp = Math.max(1, 1);
    if (typeof finalizeCombatQiDrain === 'function') finalizeCombatQiDrain({ victory: false });
    G.inCombat = false;
    G.defending = false;
    G.encounterCombat = null;
    document.getElementById('combatOverlay').classList.remove('active');
    G.enemy = null;
    addLog(`⚡ You retreat, battered but alive.`);
    closeEncounterOverlay();
    fullRender();
}

function encounterQuit() {
    closeEncounterOverlay();
    addLog(`⚡ You withdraw from the encounter.`);
    fullRender();
}

// ===== WORLD NPC ECOSYSTEM =====

function worldNpcId(uid) {
    return `world:${uid}`;
}

function parseWorldNpcId(id) {
    return id && id.startsWith('world:') ? id.slice(6) : null;
}

function isWorldNpcId(id) {
    return !!id && id.startsWith('world:');
}

function personalitiesConflict(a, b) {
    if (a === b) return true;
    const list = NPC_PERSONALITY_CONFLICTS[a];
    return !!(list && list.includes(b));
}

function filterPersonalityPool(pool, picked) {
    return pool.filter(id => !picked.some(p => personalitiesConflict(p, id)));
}

function rollNpcPersonalities(npc) {
    const count = NPC_ECOSYSTEM.personalityCountMin
        + Math.floor(Math.random() * (NPC_ECOSYSTEM.personalityCountMax - NPC_ECOSYSTEM.personalityCountMin + 1));
    const bias = NPC_ROLE_PERSONALITY_BIAS[npc.role] || NPC_PERSONALITY_IDS;
    let pool = [...bias];
    NPC_PERSONALITY_IDS.forEach(id => {
        if (!pool.includes(id)) pool.push(id);
    });
    const picked = [];
    while (picked.length < count && pool.length) {
        pool = filterPersonalityPool(pool, picked);
        if (!pool.length) break;
        const idx = Math.floor(Math.random() * pool.length);
        const id = pool.splice(idx, 1)[0];
        picked.push(id);
    }
    if (npc.isDemonicTalent && !picked.includes('vengeful') && Math.random() < 0.4) {
        if (picked.length >= count) picked[0] = 'vengeful';
        else picked.push('vengeful');
    }
    return picked;
}

function ensureNpcPersonalities(npc) {
    if (!npc.personalities?.length) npc.personalities = rollNpcPersonalities(npc);
    return npc.personalities;
}

function ensureWorldNpcs() {
    if (!G.worldNpcs) G.worldNpcs = [];
    if (typeof ensureAmbientNpcState === 'function') ensureAmbientNpcState();
    if (!G.nextDemonicEmergenceMonths) scheduleNextDemonicEmergence();
    G.worldNpcs.forEach(n => {
        if (n.alive) {
            if (!n.state) n.state = 'persistent';
            if (n.state === 'persistent' && n.unnamed == null) n.unnamed = false;
            ensureNpcPersonalities(n);
            clampWorldNpcProgress(n);
        }
    });
    const zoneIds = Object.keys(ZONES);
    zoneIds.forEach(zoneId => {
        const count = G.worldNpcs.filter(n => n.alive && n.zone === zoneId).length;
        const min = NPC_ECOSYSTEM.npcsPerZoneMin;
        if (count < min) {
            for (let i = count; i < min; i++) {
                G.worldNpcs.push(generateWorldNpc(zoneId));
            }
        }
    });
}

function scheduleNextDemonicEmergence() {
    const years = NPC_ECOSYSTEM.demonicEmergenceYears;
    const at = (G.ageMonths || 0) + years * 12;
    G.nextDemonicEmergenceMonths = at;
    if (typeof scheduleWorldEvent === 'function') {
        scheduleWorldEvent('demonic_emergence', at, {}, { id: 'demonic_emergence_next' });
    }
}

function rollWorldNpcName() {
    const pool = NPC_ECOSYSTEM.givenNames;
    return pool[Math.floor(Math.random() * pool.length)];
}

function rollNpcRoleForZone(zoneId) {
    const weights = ZONE_NPC_ROLES[zoneId] || ZONE_NPC_ROLES.dustbone;
    const total = Object.values(weights).reduce((s, w) => s + w, 0);
    let roll = Math.random() * total;
    for (const [roleId, weight] of Object.entries(weights)) {
        roll -= weight;
        if (roll <= 0) return roleId;
    }
    return 'wanderer';
}

function rollWorldNpcStartRealm(role) {
    if (role.scalesWithPlayer) {
        return Math.max(0, G.realmIdx + (Math.random() < 0.5 ? 0 : 1));
    }
    const min = role.startRealmMin ?? 0;
    const max = role.startRealmMax ?? min;
    return min + Math.floor(Math.random() * (max - min + 1));
}

function generateWorldNpc(zoneId, options) {
    options = options || {};
    let roleId = options.roleId || rollNpcRoleForZone(zoneId);
    let isDemonic = !!options.forceDemonic;
    if (!isDemonic && Math.random() < NPC_ECOSYSTEM.demonicSpawnChance) {
        isDemonic = true;
        roleId = 'demonic_talent';
    }
    const role = NPC_ROLES[roleId] || NPC_ROLES.wanderer;
    const uid = `wn_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
    const realmIdx = options.realmIdx != null ? options.realmIdx : rollWorldNpcStartRealm(role);
    const ageYears = role.cultivator === false
        ? 18 + Math.floor(Math.random() * 40)
        : 16 + Math.floor(Math.random() * 20) + realmIdx * 8;
    const npc = {
        uid,
        name: options.name || rollWorldNpcName(),
        role: roleId,
        zone: zoneId,
        realmIdx,
        ageMonths: ageYears * 12,
        growthProgress: Math.floor(Math.random() * 40),
        growthRate: isDemonic ? NPC_ROLES.demonic_talent.growthRate : role.growthRate,
        isDemonicTalent: isDemonic,
        demonicThreat: isDemonic ? 5 : 0,
        demonicMet: false,
        alive: true,
        met: false,
        talkCount: 0,
        spawnedAtMonths: G.ageMonths || 0,
        wanderDueMonths: role.canWander
            ? (G.ageMonths || 0) + pickWorldNpcWanderInterval()
            : null
    };
    if (options.personalities?.length) npc.personalities = options.personalities.slice();
    else ensureNpcPersonalities(npc);
    return npc;
}

function pickWorldNpcWanderInterval() {
    const e = NPC_ECOSYSTEM;
    return e.wanderMoveIntervalMin + Math.floor(Math.random() * (e.wanderMoveIntervalMax - e.wanderMoveIntervalMin + 1));
}

function getWorldNpcByUid(uid) {
    return (G.worldNpcs || []).find(n => n.uid === uid && n.alive);
}

function getWorldNpcById(id) {
    const uid = parseWorldNpcId(id);
    return uid ? getWorldNpcByUid(uid) : null;
}

function getWorldNpcsInZone(zoneId) {
    ensureWorldNpcs();
    return (G.worldNpcs || []).filter(n => n.alive && n.zone === zoneId);
}

function getWorldNpcMaxRealm(npc) {
    const cap = typeof getMaxCultivationRealmIdx === 'function' ? getMaxCultivationRealmIdx() : 6;
    const role = NPC_ROLES[npc.role] || NPC_ROLES.wanderer;
    let max;
    if (npc.isDemonicTalent) {
        max = G.realmIdx + (NPC_ECOSYSTEM.demonicMaxRealmOffset ?? 2);
    } else if (role.scalesWithPlayer) {
        max = G.realmIdx + (role.maxRealmOffset || 2);
    } else {
        max = role.maxRealm ?? 0;
    }
    return clamp(max, 0, cap);
}

function getWorldNpcThreatCap() {
    return NPC_ECOSYSTEM.demonicThreatCap ?? 36;
}

function clampWorldNpcProgress(npc) {
    if (!npc) return;
    const maxRealm = getWorldNpcMaxRealm(npc);
    if (npc.realmIdx > maxRealm) npc.realmIdx = maxRealm;
    const threatCap = getWorldNpcThreatCap();
    if ((npc.demonicThreat || 0) > threatCap) npc.demonicThreat = threatCap;
}

function getWorldNpcLifespanMonths(npc) {
    const role = NPC_ROLES[npc.role] || NPC_ROLES.villager;
    if (role.cultivator === false) return (role.lifespanYears || 75) * 12;
    if (role.lifespanUsesRealm) return LIFESPAN_BY_REALM[Math.min(npc.realmIdx, LIFESPAN_BY_REALM.length - 1)] * 12;
    return 80 * 12;
}

function canWorldNpcGrow(npc) {
    if (!npc.alive) return false;
    const role = NPC_ROLES[npc.role] || NPC_ROLES.villager;
    if (role.cultivator === false || role.growthRate <= 0) return false;
    return npc.realmIdx < getWorldNpcMaxRealm(npc);
}

function tickWorldNpcGrowth(monthsPassed) {
    if (!G.worldNpcs?.length) return;
    const base = NPC_ECOSYSTEM.growthMonthsPerBreakthrough;
    G.worldNpcs.forEach(npc => {
        if (!npc.alive) return;
        if (npc.state === 'ambient') return;
        npc.ageMonths += monthsPassed;
        if (npc.ageMonths >= getWorldNpcLifespanMonths(npc)) {
            killWorldNpc(npc, 'old age');
            return;
        }
        if (!canWorldNpcGrow(npc)) {
            if (npc.isDemonicTalent && !npc.demonicMet) {
                const threatCap = getWorldNpcThreatCap();
                npc.demonicThreat = Math.min(
                    threatCap,
                    (npc.demonicThreat || 0) + Math.floor(monthsPassed / 12) * NPC_ECOSYSTEM.demonicThreatPerGrowth
                );
            }
            clampWorldNpcProgress(npc);
            return;
        }
        const role = NPC_ROLES[npc.role] || NPC_ROLES.wanderer;
        const rate = npc.growthRate || role.growthRate || 1;
        npc.growthProgress += monthsPassed * rate;
        while (npc.growthProgress >= base && canWorldNpcGrow(npc)) {
            npc.growthProgress -= base;
            if (Math.random() < (role.breakthroughChance || 0.25)) {
                const prev = npc.realmIdx;
                npc.realmIdx = Math.min(npc.realmIdx + 1, getWorldNpcMaxRealm(npc));
                if (npc.isDemonicTalent && !npc.demonicMet) {
                    const threatCap = getWorldNpcThreatCap();
                    npc.demonicThreat = Math.min(
                        threatCap,
                        (npc.demonicThreat || 0) + NPC_ECOSYSTEM.demonicThreatPerGrowth
                    );
                    if (npc.demonicThreat >= NPC_ECOSYSTEM.demonicThreatLogThreshold && prev < npc.realmIdx) {
                        maybeLogDemonicThreat(npc);
                    }
                }
            }
        }
        clampWorldNpcProgress(npc);
        tickWorldNpcWander(npc);
    });
}

function tickWorldNpcWander(npc) {
    const role = NPC_ROLES[npc.role];
    if (!role?.canWander || !npc.wanderDueMonths) return;
    if (G.ageMonths < npc.wanderDueMonths) return;
    const zones = Object.keys(ZONES).filter(z => z !== npc.zone);
    if (!zones.length) return;
    npc.zone = zones[Math.floor(Math.random() * zones.length)];
    npc.wanderDueMonths = G.ageMonths + pickWorldNpcWanderInterval();
}

function killWorldNpc(npc, reason) {
    const wasElder = npc.role === 'sect_elder';
    if (reason === 'combat' && typeof recordWorldNpcKill === 'function') {
        recordWorldNpcKill(npc, reason);
    }
    npc.alive = false;
    if (npc.met || npc.isDemonicTalent) {
        const zoneName = ZONES[npc.zone]?.name || npc.zone;
        addLog(`💀 ${npc.name} (${NPC_ROLES[npc.role]?.label || npc.role}) passed from ${reason} in the ${zoneName}.`);
    }
    if (wasElder && reason === 'combat' && Math.random() < NPC_ECOSYSTEM.elderDeathDemonicChance) {
        spawnVengeanceDemonicTalent(npc.zone, npc.name);
    }
}

function spawnVengeanceDemonicTalent(zoneId, fallenName) {
    const npc = generateWorldNpc(zoneId, {
        forceDemonic: true,
        roleId: 'demonic_talent',
        personalities: ['vengeful', 'ambitious']
    });
    npc.name = rollWorldNpcName();
    G.worldNpcs.push(npc);
    addLog(`😈 ${fallenName}'s death births a Demonic Talent — ${npc.name} rises on pure will for revenge!`);
}

function maybeLogDemonicThreat(npc) {
    if (npc._threatLogged) return;
    npc._threatLogged = true;
    const realm = getNpcRealmName(npc.realmIdx);
    addLog(`😈 A Demonic Talent grows unchecked — ${npc.name} reaches ${realm} (${ZONES[npc.zone]?.name || npc.zone}).`);
}

function fireDemonicEmergenceEvent() {
    const zoneIds = Object.keys(ZONES);
    const zoneId = zoneIds[Math.floor(Math.random() * zoneIds.length)];
    const npc = generateWorldNpc(zoneId, { forceDemonic: true, roleId: 'demonic_talent' });
    G.worldNpcs.push(npc);
    scheduleNextDemonicEmergence();
    const zoneName = ZONES[zoneId]?.name || zoneId;
    addLog(`😈 HEAVEN TREMBLES — a Demonic Talent emerges in the ${zoneName}: ${npc.name}.`);
    if (typeof appendWorldChronicle === 'function') {
        appendWorldChronicle({
            emoji: '😈',
            summary: `A Demonic Talent emerges in ${zoneName}`,
            text: `${npc.name} rises in the ${zoneName}.`,
            zoneId,
            type: 'demonic_emergence'
        });
    }
}

function maybeDemonicEmergence() {
    if (!G.nextDemonicEmergenceMonths || G.ageMonths < G.nextDemonicEmergenceMonths) return;
    fireDemonicEmergenceEvent();
}

if (typeof registerWorldEventHandler === 'function') {
    registerWorldEventHandler('demonic_emergence', fireDemonicEmergenceEvent);
}

function seedWorldNpcsIfEmpty() {
    if (G.worldNpcs?.length) return;
    ensureWorldNpcs();
}