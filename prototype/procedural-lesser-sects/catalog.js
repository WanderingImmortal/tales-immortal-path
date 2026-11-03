'use strict';

/**
 * Static catalog for headless tests. Keep zone caps / blocked names aligned with data.js.
 */
const LESSER_SECT_ZONE_LEADER_REALM_CAP = {
    dustbone: 2,
    frostbite: 2,
    emberwild: 2,
    jade: 3,
    heartlands: 4
};

const LESSER_SECT_BLOCKED_NAMES = [
    'Frostpeak Monastery',
    'Sunscar Clan',
    'Dune Riders',
    'Ashen Priests',
    'Celestial Sword Sect',
    'Jade Lotus Sect',
    'Void Temple',
    'Golden Phoenix Sect',
    'Storm Dragon Sect',
    'Tidal Lotus Sect',
    'Emberwild Collective',
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

const LESSER_SECT_PREFIXES = [
    'Crimson Peak', 'Iron Veil', 'Thunder Gate', 'Jade Serpent', 'Ashen Lotus',
    'Broken Bell', 'Misty Pine', 'Copper Reed', 'Hidden Spring', 'Grey Crane',
    'Salt Wind', 'Bone Lantern', 'Quiet River', 'Scarlet Banner', 'Stone Mirror'
];

const LESSER_SECT_SUFFIXES = ['Sect', 'Hall', 'Pavilion', 'Gate', 'Monastery', 'School'];

const LESSER_SECT_FOCUS = [
    { id: 'sword', label: 'Sword cultivation', memberRole: 'disciple' },
    { id: 'alchemy', label: 'Alchemical refinement', memberRole: 'disciple' },
    { id: 'body', label: 'Body tempering', memberRole: 'disciple' },
    { id: 'formation', label: 'Formation arrays', memberRole: 'disciple' },
    { id: 'wandering', label: 'Loose wandering cultivators', memberRole: 'wanderer' },
    { id: 'dao', label: 'Dao meditation', memberRole: 'hermit' },
    { id: 'beast', label: 'Beast affinity', memberRole: 'wanderer' }
];

const LESSER_SECT_DOCTRINES = ['righteous', 'balanced', 'shadow'];

const LESSER_SECT_CULTURE_LINES = {
    sword: ['Duels settle disputes.', 'Blades are sharpened at dawn.', 'Guests must leave weapons sheathed.'],
    alchemy: ['Smoke never stops on refinement days.', 'Apprentices sleep beside the furnace.', 'Poison trials are logged in red ink.'],
    body: ['Morning runs on the ridge are mandatory.', 'Pain is spoken of as tuition.', 'Iron sand buckets line the courtyard.'],
    formation: ['Stones must not be moved without a seal.', 'Night patrols walk the array lines.', 'Maps are drawn backward on purpose.'],
    wandering: ['No fixed roster — only a ledger of oaths.', 'Members drift in and out by season.', 'The hall is more inn than temple.'],
    dao: ['Silence is kept for three hours after noon.', 'Debates happen only under moonlight.', 'Scripture copies are traded, not sold.'],
    beast: ['Beast pens outnumber dormitories.', 'Blood offerings are forbidden — only breath-sharing.', 'Feathers are sewn into sashes for rank.']
};

const TEST_CATALOG = {
    zones: Object.keys(LESSER_SECT_ZONE_LEADER_REALM_CAP),
    zoneLeaderRealmCap: LESSER_SECT_ZONE_LEADER_REALM_CAP,
    blockedNames: LESSER_SECT_BLOCKED_NAMES,
    blockedNameKeys: LESSER_SECT_BLOCKED_NAMES.map(n => n.toLowerCase()),
    prefixes: LESSER_SECT_PREFIXES,
    suffixes: LESSER_SECT_SUFFIXES,
    focuses: LESSER_SECT_FOCUS,
    doctrines: LESSER_SECT_DOCTRINES,
    cultureLines: LESSER_SECT_CULTURE_LINES,
    hqLocationsByZone: {
        dustbone: ['ironscar_quarry', 'dewcatch_scrub', 'bonehollow_caverns', 'miraj_waystation'],
        frostbite: ['frost_gate'],
        heartlands: ['outer_heartlands', 'celestial_market'],
        jade: ['tide_harbor'],
        emberwild: ['ashvein_village']
    },
    recruitNames: ['Lin Mei', 'Chen Bo', 'Zhao Hu', 'Shen Wei', 'Gu Yan', 'Han Rui', 'Lu Feng', 'Qiao Ming']
};

module.exports = {
    TEST_CATALOG,
    LESSER_SECT_ZONE_LEADER_REALM_CAP,
    LESSER_SECT_BLOCKED_NAMES
};
