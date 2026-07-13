/**
 * Quick recursion audit for travel-kit / residence-stash / spatial-ring stack.
 * Run: node scripts/audit-storage-recursion.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');

function loadScript(relativePath) {
    const code = fs.readFileSync(path.join(root, relativePath), 'utf8');
    vm.runInThisContext(code, { filename: relativePath });
}

// Minimal globals
global.G = {
    sect: {
        stage: 'founding',
        name: 'Test Sect',
        renown: 0,
        discipleRecords: [],
        buildings: { manual_hall: 1 },
        residence: { level: 1, stash: [], lastRestMonths: null, formations: { slots: [] } },
        buildingMeta: { manual_hall: { collection: {}, studies: [] } },
        inventory: { stones: 0, materials: {}, items: [] }
    },
    path: 'qi',
    realmIdx: 2,
    stones: 100,
    techniques: [],
    manualShelf: {},
    materials: { spirit_herb: 10, jade_inlay: 5, silk_thread: 8 },
    pillStock: { spirit_gathering: 2 },
    gearBag: [],
    gearInstances: {},
    equipment: { weapon: null, chestplate: null, helm: null, amulet: null, ring: null, boots: null },
    inventory: [],
    disciples: [],
    travelRingId: null,
    inCombat: false,
    ageMonths: 0
};

global.PATHS = { qi: { realms: ['A', 'B', 'Core Formation', 'Nascent Soul'] } };
global.CRAFT_MATERIALS = {
    spirit_herb: { name: 'Spirit Herb', emoji: '🌿' },
    jade_inlay: { name: 'Jade Inlay', emoji: '💎' },
    silk_thread: { name: 'Silk Thread', emoji: '🧵' },
    celestial_silk: { name: 'Celestial Silk', emoji: '✨' },
    demon_core: { name: 'Demon Core', emoji: '👹' },
    iron_ore: { name: 'Iron Ore', emoji: '⛏️' }
};
global.PILL_TYPES = { spirit_gathering: { name: 'Spirit Gathering Pill', emoji: '💊' } };
global.TECHNIQUE_POOL = [{ name: 'Test Art', path: 'qi', element: 'fire', rarity: 'common', desc: 'test' }];
global.TECH_ELEMENT_LABELS = { fire: 'Fire' };
global.CULTIVATION_TIERS = { mortal: { reqRealm: 0 } };
global.TECHNIQUE_CULTIVATION_TIERS = { 'Test Art': 'mortal' };
global.MANUAL_BALANCE = { monthsByCultivationTier: { mortal: 1 }, monthsByRarity: { common: 1 }, consignByRarity: { common: 10 } };
global.SECT_BUILDINGS = { manual_hall: { id: 'manual_hall', implemented: true } };
global.SECT_STAGES = { founding: { label: 'Founding' }, wandering: { label: 'Wandering' } };
global.SECT_RESIDENCE = { levels: [{ name: 'Shelter' }], maxLevel: 3, formationSlotsByLevel: [0, 1, 2, 3] };
global.GEAR_SLOT_IDS = ['weapon', 'chestplate', 'helm', 'amulet', 'ring', 'boots'];
global.GEAR_ITEMS = {};

let callDepth = {};
function track(name, fn) {
    const orig = global[name];
    if (typeof orig !== 'function') return;
    global[name] = function (...args) {
        callDepth[name] = (callDepth[name] || 0) + 1;
        if (callDepth[name] > 40) throw new Error(`RECURSION: ${name} depth ${callDepth[name]}`);
        try { return orig.apply(this, args); }
        finally { callDepth[name]--; }
    };
}

global.addLog = () => {};
global.fullRender = () => {};
global.advanceTime = () => true;
global.actionBlocked = () => false;
global.escapeAttr = (s) => String(s);
global.escapeSectAttr = (s) => String(s);

// Load data constants via eval of relevant sections only — use pre-set globals from data.js keys
const dataJs = fs.readFileSync(path.join(root, 'data.js'), 'utf8');
const extractConst = (name) => {
    const m = dataJs.match(new RegExp(`const ${name} =[\\s\\S]*?;\\n`, 'm'));
    if (m) vm.runInThisContext(m[0], { filename: 'data-extract' });
};
['TRAVEL_KIT_BALANCE', 'RESIDENCE_STASH_BALANCE', 'SPATIAL_RING_BALANCE', 'MANUAL_HALL_BALANCE'].forEach(extractConst);

// Stub sect.js essentials
global.createEmptySectState = () => JSON.parse(JSON.stringify(global.G.sect));
global.isSectFounded = () => global.G.sect.stage !== 'wandering';
global.getResidenceLevel = () => global.G.sect.residence?.level || 0;
global.getBuildingLevel = (id) => global.G.sect.buildings?.[id] || 0;
global.getDiscipleByUid = () => null;
global.getDiscipleCount = () => 0;
global.meetsStageRequirement = () => true;

global.ensureSectState = function ensureSectState() {
    if (!global.G.sect) global.G.sect = createEmptySectState();
    if (typeof ensureResidenceStash === 'function') ensureResidenceStash();
};

global.ensureSectInventory = function ensureSectInventory() {
    ensureSectState();
    if (!global.G.sect.inventory) global.G.sect.inventory = { stones: 0, materials: {}, items: [] };
};

global.ensureGearState = function ensureGearState() {
    if (!global.G.materials) global.G.materials = {};
};
global.ensurePillStock = function ensurePillStock() {
    if (!global.G.pillStock) global.G.pillStock = {};
    Object.keys(global.PILL_TYPES).forEach(id => {
        if (global.G.pillStock[id] == null) global.G.pillStock[id] = 0;
    });
};
global.addCraftMaterial = function addCraftMaterial(matId, qty) {
    ensureGearState();
    qty = qty || 1;
    if (!global.CRAFT_MATERIALS[matId]) return false;
    if (typeof getTravelKitMaterialBlockReason === 'function') {
        const block = getTravelKitMaterialBlockReason(matId, qty);
        if (block) return false;
    }
    global.G.materials[matId] = (global.G.materials[matId] || 0) + qty;
    return true;
};

loadScript('techniques.js');
loadScript('travel-kit.js');
loadScript('spatial-ring.js');
loadScript('residence-stash.js');

[
    'ensureSectState', 'ensureResidenceStash', 'ensureTravelKit', 'ensureManualShelf',
    'getTravelKitUsed', 'getTravelKitCapacity', 'getTravelKitBreakdown',
    'getResidenceStashBreakdown', 'getResidenceStashLoad', 'renderTravelKitBarHtml',
    'renderResidenceStashPanelHtml', 'renderSpatialRingPanelHtml'
].forEach((n) => track(n, global[n]));

const tests = [
    ['ensureSectState()', () => ensureSectState()],
    ['ensureResidenceStash()', () => ensureResidenceStash()],
    ['getTravelKitBreakdown()', () => getTravelKitBreakdown()],
    ['getResidenceStashBreakdown()', () => getResidenceStashBreakdown()],
    ['grantManual(new)', () => grantManual('Test Art', { silent: true })],
    ['addCraftMaterial', () => addCraftMaterial('spirit_herb', 1)],
    ['renderTravelKitBarHtml', () => renderTravelKitBarHtml()],
    ['renderResidenceStashPanelHtml', () => renderResidenceStashPanelHtml()],
    ['renderSpatialRingPanelHtml', () => renderSpatialRingPanelHtml()],
    ['stashManualToResidence', () => {
        grantManual('Test Art', { silent: true });
        return stashManualToResidence('Test Art', 1);
    }],
    ['withdrawManualFromResidence', () => {
        ensureResidenceStash();
        G.sect.residence.stash.manuals['Test Art'] = { technique: 'Test Art', count: 1 };
        return withdrawManualFromResidence('Test Art', 1);
    }]
];

let passed = 0;
let failed = 0;
for (const [label, fn] of tests) {
    try {
        fn();
        console.log('OK  ', label);
        passed++;
    } catch (e) {
        console.log('FAIL', label, '-', e.message);
        failed++;
    }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
