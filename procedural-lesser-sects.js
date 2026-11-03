// Procedural lesser sects — G.world.lesserSects (separate from player worldSects rivals).
// Generator core lives in prototype/procedural-lesser-sects (Node tests + sandbox bundle).

const LESSER_SECT_AUTHORED_NAME_BLOCKLIST = [
    'Imperial Clan',
    'Yin Maiden Sect',
    'Yin Maiden Palace',
    'Mad Monks of Vajra Ridge',
    'Vajra Ridge',
    'Heavenly Demon Cult',
    'Soul Cult',
    'Feng Du',
    'Dustbone Tribunal',
    'Sandveil Tribunal'
];

const LESSER_SECT_ZONE_LEADER_REALM_CAP = {
    dustbone: 2,
    frostbite: 2,
    emberwild: 2,
    jade: 3,
    heartlands: 4
};

function ensureWorldRoot() {
    if (typeof G === 'undefined') return;
    if (!G.world) G.world = {};
    if (!G.world.lesserSects) {
        G.world.lesserSects = { version: 1, seed: null, generatedAtMonths: 0, sects: [] };
    }
    if (!Array.isArray(G.world.lesserSects.sects)) G.world.lesserSects.sects = [];
}

function buildLesserSectCatalogFromGame() {
    const zones = Object.keys(typeof ZONES !== 'undefined' ? ZONES : LESSER_SECT_ZONE_LEADER_REALM_CAP);
    const blockedNames = [];
    if (typeof FACTION_DEFINITIONS !== 'undefined') {
        Object.values(FACTION_DEFINITIONS).forEach(def => {
            if (def?.name) blockedNames.push(def.name);
        });
    }
    LESSER_SECT_AUTHORED_NAME_BLOCKLIST.forEach(n => blockedNames.push(n));

    const hqLocationsByZone = {};
    const allLocationIdsByZone = {};
    if (typeof WORLD_LOCATIONS !== 'undefined') {
        Object.values(WORLD_LOCATIONS).forEach(loc => {
            if (!loc?.id || !loc.parentZone) return;
            const zone = loc.parentZone;
            if (!allLocationIdsByZone[zone]) allLocationIdsByZone[zone] = [];
            allLocationIdsByZone[zone].push(loc.id);
            const isAuthoredFactionHq = loc.type === 'sect_hq' && loc.factionNpcId;
            const okForLesser =
                !isAuthoredFactionHq
                && ['wilderness', 'city', 'outpost', 'market'].includes(loc.type);
            if (okForLesser) {
                if (!hqLocationsByZone[zone]) hqLocationsByZone[zone] = [];
                hqLocationsByZone[zone].push(loc.id);
            }
        });
    }

    zones.forEach(z => {
        if (!hqLocationsByZone[z]?.length) {
            hqLocationsByZone[z] = (allLocationIdsByZone[z] || []).slice(0, 3);
        }
    });

    return {
        zones,
        zoneLeaderRealmCap: LESSER_SECT_ZONE_LEADER_REALM_CAP,
        blockedNames,
        blockedNameKeys: blockedNames.map(n => n.trim().toLowerCase()),
        prefixes: typeof SECT_RIVAL_PREFIXES !== 'undefined'
            ? SECT_RIVAL_PREFIXES.concat([
                'Broken Bell', 'Misty Pine', 'Copper Reed', 'Hidden Spring', 'Grey Crane',
                'Salt Wind', 'Bone Lantern', 'Quiet River', 'Scarlet Banner', 'Stone Mirror'
            ])
            : [],
        suffixes: typeof SECT_RIVAL_SUFFIXES !== 'undefined'
            ? SECT_RIVAL_SUFFIXES.concat(['Monastery', 'School'])
            : ['Sect', 'Hall'],
        focuses: [
            { id: 'sword', label: 'Sword cultivation', memberRole: 'disciple' },
            { id: 'alchemy', label: 'Alchemical refinement', memberRole: 'disciple' },
            { id: 'body', label: 'Body tempering', memberRole: 'disciple' },
            { id: 'formation', label: 'Formation arrays', memberRole: 'disciple' },
            { id: 'wandering', label: 'Loose wandering cultivators', memberRole: 'wanderer' },
            { id: 'dao', label: 'Dao meditation', memberRole: 'hermit' },
            { id: 'beast', label: 'Beast affinity', memberRole: 'wanderer' }
        ],
        doctrines: Object.keys(typeof SECT_DOCTRINES !== 'undefined' ? SECT_DOCTRINES : { balanced: {} }),
        cultureLines: {
            sword: ['Duels settle disputes.', 'Blades are sharpened at dawn.', 'Guests must leave weapons sheathed.'],
            alchemy: ['Smoke never stops on refinement days.', 'Apprentices sleep beside the furnace.', 'Poison trials are logged in red ink.'],
            body: ['Morning runs on the ridge are mandatory.', 'Pain is spoken of as tuition.', 'Iron sand buckets line the courtyard.'],
            formation: ['Stones must not be moved without a seal.', 'Night patrols walk the array lines.', 'Maps are drawn backward on purpose.'],
            wandering: ['No fixed roster — only a ledger of oaths.', 'Members drift in and out by season.', 'The hall is more inn than temple.'],
            dao: ['Silence is kept for three hours after noon.', 'Debates happen only under moonlight.', 'Scripture copies are traded, not sold.'],
            beast: ['Beast pens outnumber dormitories.', 'Blood offerings are forbidden — only breath-sharing.', 'Feathers are sewn into sashes for rank.']
        },
        hqLocationsByZone,
        allLocationIdsByZone,
        recruitNames: typeof SECT_RECRUIT_NAMES !== 'undefined' ? SECT_RECRUIT_NAMES : ['Lin Mei', 'Chen Bo']
    };
}

function getLesserSectGeneratorApi() {
    if (typeof LesserSectGen !== 'undefined') return LesserSectGen;
    return null;
}

function registerLesserSectNpcsOnWorld(state) {
    if (typeof G === 'undefined' || !state?.sects) return;
    if (!G.worldNpcs) G.worldNpcs = [];
    const existing = new Set(G.worldNpcs.map(n => n.uid));
    state.sects.forEach(sect => {
        (sect.members || []).forEach(m => {
            if (existing.has(m.uid)) return;
            G.worldNpcs.push({
                uid: m.uid,
                name: m.name,
                role: m.role === 'founder' || m.role === 'leader' ? 'sect_elder' : (sect.focus === 'wandering' ? 'wanderer' : 'disciple'),
                zone: m.zone || sect.zone,
                realmIdx: m.realmIdx ?? 0,
                ageMonths: m.ageMonths ?? 240,
                growthProgress: 0,
                growthRate: 0.4,
                isDemonicTalent: false,
                demonicThreat: 0,
                demonicMet: false,
                alive: true,
                met: false,
                talkCount: 0,
                spawnedAtMonths: sect.foundedAtMonths || G.ageMonths || 0,
                wanderDueMonths: null,
                lesserSectId: sect.id
            });
            existing.add(m.uid);
        });
    });
}

function generateLesserSectsForGame(options) {
    options = options || {};
    const api = getLesserSectGeneratorApi();
    if (!api?.generateLesserSects) {
        throw new Error('LesserSectGen bundle not loaded');
    }
    const catalog = buildLesserSectCatalogFromGame();
    const worldAgeMonths = options.worldAgeMonths != null ? options.worldAgeMonths : (G?.ageMonths || 0);
    const state = api.generateLesserSects({
        seed: options.seed,
        catalog,
        sectsPerZone: options.sectsPerZone ?? 2,
        zones: options.zones,
        worldAgeMonths
    });
    if (options.registerNpcs !== false) registerLesserSectNpcsOnWorld(state);
    return state;
}

function applyLesserSectGeneration(options) {
    ensureWorldRoot();
    const replace = options?.replace !== false;
    const state = generateLesserSectsForGame(options);
    if (replace) {
        G.world.lesserSects = state;
    } else {
        G.world.lesserSects = apiMergeLesserSectState(G.world.lesserSects, state);
    }
    if (typeof saveState === 'function' && options?.persist) saveState();
    return G.world.lesserSects;
}

function apiMergeLesserSectState(existing, incoming) {
    const api = getLesserSectGeneratorApi();
    if (api?.mergeLesserSectState) return api.mergeLesserSectState(existing, incoming);
    return incoming;
}

function validateGameLesserSects() {
    const api = getLesserSectGeneratorApi();
    if (!api?.validateLesserSectState) return { ok: true, errors: [] };
    ensureWorldRoot();
    return api.validateLesserSectState(G.world.lesserSects, buildLesserSectCatalogFromGame());
}

function advanceGameLesserSectsTimeOnly(months) {
    const api = getLesserSectGeneratorApi();
    if (!api?.advanceLesserSectsTimeOnly) return;
    ensureWorldRoot();
    G.world.lesserSects = api.advanceLesserSectsTimeOnly(
        G.world.lesserSects,
        months,
        buildLesserSectCatalogFromGame()
    );
}

function migrateLesserSectsForExistingSave() {
    ensureWorldRoot();
}

function getLesserSectsList() {
    ensureWorldRoot();
    return G.world.lesserSects.sects || [];
}

function getLesserSectById(id) {
    return getLesserSectsList().find(s => s.id === id) || null;
}
