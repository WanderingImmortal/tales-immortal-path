// Living world population — generated locations + lesser sect placement (PR #196 integration).

function ensureWorldPopulationState() {
    if (typeof ensureWorldRoot === 'function') ensureWorldRoot();
    else if (typeof G !== 'undefined') {
        if (!G.world) G.world = {};
    }
    if (!G.world.geography) {
        G.world.geography = { version: 1, populationSeed: null, initialized: false };
    }
    if (!G.world.generatedLocations) G.world.generatedLocations = { byId: {} };
    if (!G.world.locationMeta) G.world.locationMeta = {};
}

function hashPopulationSeed(str) {
    let h = 2166136261;
    const s = String(str || 'wandering');
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function getReservedLesserSectHqIds() {
    const reserved = new Set();
    if (G.world?.locationMeta) {
        Object.entries(G.world.locationMeta).forEach(([locId, meta]) => {
            if (meta?.lesserSectId) reserved.add(locId);
        });
    }
    (G.world?.lesserSects?.sects || []).forEach(s => {
        if (s.headquartersLocationId) reserved.add(s.headquartersLocationId);
    });
    return reserved;
}

function countLesserSectHqSlotsForZone(zoneId) {
    if (typeof buildLesserSectCatalogFromGame !== 'function') return 0;
    const catalog = buildLesserSectCatalogFromGame();
    const pool = catalog.hqLocationsByZone?.[zoneId] || [];
    const reserved = getReservedLesserSectHqIds();
    return pool.filter(id => !reserved.has(id)).length;
}

function computeLesserSectsPerZone(zoneId) {
    const slots = countLesserSectHqSlotsForZone(zoneId);
    if (slots <= 0) return 0;
    return Math.max(1, Math.min(4, Math.floor(slots / 3)));
}

function registerLesserSectLocationMeta(state) {
    if (!state?.sects) return;
    state.sects.forEach(sect => {
        const locId = sect.headquartersLocationId;
        if (!locId) return;
        G.world.locationMeta[locId] = {
            lesserSectId: sect.id,
            lesserSectName: sect.name,
            focus: sect.focus,
            claim: null,
            controllerFactionId: null
        };
    });
}

function ensureDustboneLesserSectPopulation() {
    if (typeof LesserSectGen === 'undefined' || typeof buildLesserSectCatalogFromGame !== 'function') return;
    ensureWorldPopulationState();
    if (G.world.geography.initialized) return;

    const seed = G.world.geography.populationSeed != null
        ? G.world.geography.populationSeed
        : hashPopulationSeed(G.name || 'dustbone_starter');
    G.world.geography.populationSeed = seed;

    const perZone = computeLesserSectsPerZone('dustbone');
    if (perZone <= 0) {
        G.world.geography.initialized = true;
        return;
    }

    const catalog = buildLesserSectCatalogFromGame();
    const state = LesserSectGen.generateLesserSects({
        seed,
        catalog,
        zones: ['dustbone'],
        sectsPerZone: perZone,
        worldAgeMonths: G.ageMonths || 0,
        reservedHqIds: [...getReservedLesserSectHqIds()]
    });
    G.world.lesserSects = state;
    if (typeof registerLesserSectNpcsOnWorld === 'function') registerLesserSectNpcsOnWorld(state);
    if (typeof migrateOrganizationProfilesForExistingSave === 'function') {
        migrateOrganizationProfilesForExistingSave();
    } else if (typeof enrichLesserSectOrganization === 'function') {
        G.world.lesserSects.sects = state.sects.map(sect =>
            enrichLesserSectOrganization(sect, buildOrganizationContextForSect(sect))
        );
    }
    registerLesserSectLocationMeta(state);
    G.world.geography.initialized = true;
}

function ensureWorldPopulation() {
    ensureWorldPopulationState();
    ensureDustboneLesserSectPopulation();
}

function migrateWorldPopulationForExistingSave() {
    ensureWorldPopulationState();
    if (!G.world.geography.initialized) ensureWorldPopulation();
}

function getGeneratedLocationDef(locationId) {
    return G.world?.generatedLocations?.byId?.[locationId] || null;
}

function getLesserSectAtLocation(locationId) {
    if (!locationId) return null;
    const meta = G.world?.locationMeta?.[locationId];
    if (meta?.lesserSectId && typeof getLesserSectById === 'function') {
        return getLesserSectById(meta.lesserSectId);
    }
    if (typeof getLesserSectsList === 'function') {
        return getLesserSectsList().find(s => s.headquartersLocationId === locationId) || null;
    }
    return null;
}

function validateWorldPopulationIntegrity() {
    const errors = [];
    const sects = G.world?.lesserSects?.sects || [];
    const hqUse = new Map();
    sects.forEach(s => {
        const hq = s.headquartersLocationId;
        if (!hq) {
            errors.push(`sect ${s.id} missing HQ`);
            return;
        }
        const def = typeof getLocationDef === 'function' ? getLocationDef(hq) : null;
        if (!def) errors.push(`sect ${s.id} HQ ${hq} unknown`);
        if (hqUse.has(hq)) errors.push(`duplicate HQ ${hq}`);
        hqUse.set(hq, s.id);
        if (def?.factionNpcId) errors.push(`sect ${s.id} HQ ${hq} is authored faction HQ`);
    });
    return { ok: errors.length === 0, errors };
}
