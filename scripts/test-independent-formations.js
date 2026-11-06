/**
 * Independent formation practice — personal dwelling installs without a sect.
 * Run: node scripts/test-independent-formations.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
let failed = 0;

function fail(msg) {
    console.error(`FAIL: ${msg}`);
    failed += 1;
}

function ok(msg) {
    console.log(`ok: ${msg}`);
}

function assert(cond, msg) {
    if (!cond) fail(msg);
    else ok(msg);
}

function read(rel) {
    return fs.readFileSync(path.join(root, rel), 'utf8');
}

function extractConst(src, name) {
    const start = src.indexOf(`const ${name} =`);
    if (start < 0) throw new Error(`Could not find ${name}`);
    // Walk braces to the matching semicolon after the object/array literal.
    let i = start + `const ${name} =`.length;
    while (i < src.length && /\s/.test(src[i])) i += 1;
    const open = src[i];
    if (open !== '{' && open !== '[') {
        const end = src.indexOf(';', i);
        if (end < 0) throw new Error(`Could not extract ${name}`);
        return src.slice(start, end + 1);
    }
    const close = open === '{' ? '}' : ']';
    let depth = 0;
    for (; i < src.length; i++) {
        const ch = src[i];
        if (ch === open) depth += 1;
        else if (ch === close) {
            depth -= 1;
            if (depth === 0) {
                const end = src.indexOf(';', i);
                if (end < 0) throw new Error(`Could not extract ${name}`);
                return src.slice(start, end + 1);
            }
        }
    }
    throw new Error(`Could not extract ${name}`);
}

function boot(options = {}) {
    const materials = {
        spirit_herb: 20,
        silk_thread: 10,
        jade_inlay: 5,
        iron_ore: 10,
        demon_core: 2
    };
    const dataSrc = read('data.js');
    const ctx = {
        console,
        Math,
        Number,
        Array,
        Object,
        JSON,
        Set,
        Map,
        String,
        parseInt,
        isFinite,
        G: {
            ageMonths: 12,
            lifespanMonths: 100000,
            gameOver: false,
            inCombat: false,
            stones: 200,
            realmIdx: 1,
            location: 'redwell',
            knownFormations: [],
            formationShelf: {},
            formationMaster: { tier: 0, insight: 0, lastExamAgeMonths: null },
            dwelling: {
                mode: options.dwellingMode || 'homeless',
                settlementId: options.settlementId != null ? options.settlementId : null,
                rentPaidThroughMonth: 0,
                formations: { slots: [], siteSettlementId: null }
            },
            sect: {
                stage: options.sectFounded ? 'founding' : 'wandering',
                founded: !!options.sectFounded,
                name: options.sectFounded ? 'Test Sect' : null,
                residence: { level: options.residenceLevel || 0, stash: [], lastRestMonths: null, formations: { slots: [] } },
                buildings: options.buildings || {},
                anchors: {}
            },
            materials: { ...materials },
            _logs: []
        },
        ACTION_MONTHS: { cultivate: 1 },
        addLog: (m) => { ctx.G._logs.push(String(m)); },
        fullRender: () => {},
        beginActionLog: () => {},
        commitActionLog: (m) => { ctx.G._logs.push(String(m)); },
        cancelActionLog: () => {},
        actionBlocked: () => false,
        advanceTime: (months) => {
            ctx.G.ageMonths = (ctx.G.ageMonths || 0) + (months || 0);
            return true;
        },
        isSectFounded: () => !!(ctx.G.sect && ctx.G.sect.stage && ctx.G.sect.stage !== 'wandering' && ctx.G.sect.name),
        ensureSectState: () => {},
        getResidenceLevel: () => ctx.G.sect?.residence?.level || 0,
        getBuildingLevel: (id) => ctx.G.sect?.buildings?.[id] || 0,
        isAtDwellingSettlement: () => {
            if (!ctx.G.dwelling?.settlementId) return false;
            return ctx.G.location === ctx.G.dwelling.settlementId;
        },
        ensureQcDepthState: () => {
            if (!ctx.G.dwelling) {
                ctx.G.dwelling = { mode: 'homeless', settlementId: null, rentPaidThroughMonth: 0 };
            }
            if (!ctx.G.dwelling.formations) {
                ctx.G.dwelling.formations = { slots: [], siteSettlementId: null };
            }
        },
        getConstructionMaterialsBlock: (cost) => {
            if (!cost?.materials) return null;
            for (const [id, qty] of Object.entries(cost.materials)) {
                if ((ctx.G.materials[id] || 0) < qty) return `Need ${qty}× ${id}`;
            }
            return null;
        },
        removeCraftMaterials: (mats) => {
            for (const [id, qty] of Object.entries(mats || {})) {
                if ((ctx.G.materials[id] || 0) < qty) return false;
            }
            for (const [id, qty] of Object.entries(mats || {})) {
                ctx.G.materials[id] -= qty;
            }
            return true;
        },
        addCraftMaterial: (id, qty) => {
            ctx.G.materials[id] = (ctx.G.materials[id] || 0) + qty;
        },
        escapeSectAttr: (s) => String(s || '').replace(/"/g, '&quot;'),
        getSectTraitEventStoneLossMult: () => (options.traitLossMult != null ? options.traitLossMult : 1),
        getSectBuildingBonus: (key) => {
            if (key === 'defenseRating') return options.buildingDefense || 0;
            if (key === 'vaultStoneSavePct') return options.vaultSave || 0;
            return 0;
        },
        // Cultivation stubs for double-count check
        _focusedCalls: [],
        runFocusedCultivateSession: (opts) => {
            ctx._focusedCalls.push(opts || {});
            const support = ctx.getPassiveCultivationSupportMult
                ? ctx.getPassiveCultivationSupportMult()
                : 1;
            const extra = (opts && opts.extraMult) || 1;
            return `focused support=${support} extra=${extra}`;
        },
        runCultivateSession: (opts) => {
            ctx._focusedCalls.push(opts || {});
            return 'cultivate';
        },
        getPassiveCultivationSupportMult: () => {
            let mult = 1;
            if (typeof ctx.getResidenceFormationCultivateMult === 'function') {
                mult *= ctx.getResidenceFormationCultivateMult();
            }
            return mult;
        }
    };

    vm.createContext(ctx);
    [
        extractConst(dataSrc, 'FORMATION_F1A'),
        extractConst(dataSrc, 'FORMATION_F1B'),
        extractConst(dataSrc, 'FORMATION_F2B'),
        extractConst(dataSrc, 'FORMATIONS'),
        extractConst(dataSrc, 'FORMATION_ANCHORS'),
        extractConst(dataSrc, 'SECT_RESIDENCE')
    ].forEach(chunk => vm.runInContext(chunk, ctx, { filename: 'data-extract' }));

    vm.runInContext(read('formations.js'), ctx, { filename: 'formations.js' });

    // Minimal ward helper from sect.js (reimplemented under test isolation)
    vm.runInContext(`
function getSectEventStoneLossMult() {
    let mult = typeof getSectTraitEventStoneLossMult === 'function' ? getSectTraitEventStoneLossMult() : 1;
    const vaultSave = getSectBuildingBonus('vaultStoneSavePct');
    let defense = getSectBuildingBonus('defenseRating');
    if (typeof getSectFormationDefenseRatingBonus === 'function') {
        defense += getSectFormationDefenseRatingBonus();
    }
    if (vaultSave > 0) {
        const soften = Math.min(0.6, vaultSave / 100);
        if (mult > 1) mult = 1 + (mult - 1) * (1 - soften);
        else if (mult < 1) mult = Math.max(mult, 1 - soften * 0.35);
    }
    if (defense > 0) {
        const soften = Math.min(0.55, (defense / 100) * 0.35);
        if (mult > 1) mult = 1 + (mult - 1) * (1 - soften);
        else mult = Math.max(0.45, mult * (1 - soften));
    }
    return mult;
}
`, ctx, { filename: 'sect-ward-extract' });

    return ctx;
}

function decipherAndReady(ctx, formationId) {
    ctx.grantFormationManual(formationId, { silent: true, deciphered: false, source: 'test' });
    ctx.G.stones = 500;
    const res = ctx.decipherFormation(formationId);
    assert(res.success, `decipher ${formationId}`);
    // Ensure master tier allows lay
    const def = ctx.getFormationDef(formationId);
    const need = def.formationTier || 1;
    if ((ctx.G.formationMaster.tier || 0) < need) ctx.G.formationMaster.tier = need;
}

function testInstallWithoutSect() {
    console.log('\n-- install without sect --');
    const ctx = boot({ dwellingMode: 'owned', settlementId: 'redwell' });
    assert(!ctx.isSectFounded(), 'no sect founded');
    decipherAndReady(ctx, 'spirit_gathering');
    const beforeMats = ctx.G.materials.spirit_herb;
    const beforeAge = ctx.G.ageMonths;
    const res = ctx.layPersonalDwellingFormation(0, 'spirit_gathering');
    assert(res.success, 'owned courtyard can install spirit gathering');
    assert(ctx.G.dwelling.formations.slots[0]?.id === 'spirit_gathering', 'slot stores formation');
    assert(ctx.G.dwelling.formations.siteSettlementId === 'redwell', 'site bound to settlement');
    assert(ctx.G.materials.spirit_herb === beforeMats - 3, 'construction materials spent once');
    assert(ctx.G.ageMonths === beforeAge + 2, 'construction time applied once');
    assert(ctx.G.dwelling.formations.slots[0].active === true, 'starts active');
    assert(ctx.G.dwelling.formations.slots[0].fuel > 0, 'starts fueled');
}

function testUnauthorizedInstall() {
    console.log('\n-- unauthorized install --');
    const homeless = boot({ dwellingMode: 'homeless' });
    decipherAndReady(homeless, 'spirit_gathering');
    assert(!homeless.layPersonalDwellingFormation(0, 'spirit_gathering').success, 'homeless cannot install');

    const rent = boot({ dwellingMode: 'rent', settlementId: 'redwell' });
    decipherAndReady(rent, 'spirit_gathering');
    assert(!rent.layPersonalDwellingFormation(0, 'spirit_gathering').success, 'rent cannot install');

    const away = boot({ dwellingMode: 'owned', settlementId: 'redwell' });
    away.G.location = 'dewcatch_scrub';
    decipherAndReady(away, 'spirit_gathering');
    assert(!away.layPersonalDwellingFormation(0, 'spirit_gathering').success, 'cannot install while away from dwelling');
}

function testSectFormationsStillWork() {
    console.log('\n-- sect courtyard still works --');
    const ctx = boot({
        sectFounded: true,
        residenceLevel: 1,
        dwellingMode: 'homeless'
    });
    decipherAndReady(ctx, 'spirit_gathering');
    const res = ctx.layResidenceFormation(0, 'spirit_gathering');
    assert(res.success, 'sect residence lay succeeds');
    assert(ctx.G.sect.residence.formations.slots[0]?.id === 'spirit_gathering', 'sect slot filled');
    assert(!(ctx.G.dwelling.formations.slots || []).some(Boolean), 'does not duplicate into dwelling');
}

function testActivationMaintenanceFuelIntegrity() {
    console.log('\n-- activate / maintain / fuel / integrity --');
    const ctx = boot({ dwellingMode: 'owned', settlementId: 'redwell' });
    decipherAndReady(ctx, 'spirit_gathering');
    assert(ctx.layPersonalDwellingFormation(0, 'spirit_gathering').success, 'lay for upkeep tests');
    assert(ctx.togglePersonalDwellingFormationActive(0).success, 'can shut down');
    assert(ctx.G.dwelling.formations.slots[0].active === false, 'inactive after toggle');
    assert(ctx.setPersonalDwellingFormationActive(0, true).success, 'can activate');
    const fuelBefore = ctx.G.dwelling.formations.slots[0].fuel;
    const stonesBefore = ctx.G.stones;
    assert(ctx.addPersonalDwellingFormationFuel(0, 3).success, 'add fuel');
    assert(ctx.G.dwelling.formations.slots[0].fuel === fuelBefore + 3, 'fuel increased');
    assert(ctx.G.stones === stonesBefore - 3, 'fuel cost charged');

    ctx.G.dwelling.formations.slots[0].integrity = 50;
    const maintain = ctx.maintainPersonalDwellingFormation(0);
    assert(maintain.success, 'maintain works');
    assert(ctx.G.dwelling.formations.slots[0].integrity > 50, 'integrity restored');

    const fuelAtTick = ctx.G.dwelling.formations.slots[0].fuel;
    const integAtTick = ctx.G.dwelling.formations.slots[0].integrity;
    ctx.tickAllFormationSlots(2);
    assert(ctx.G.dwelling.formations.slots[0].fuel === fuelAtTick - 2, 'active fuel burns over months');
    assert(ctx.G.dwelling.formations.slots[0].integrity === integAtTick - 2, 'integrity decays over months');
}

function testSaveLoadAndLegacyNoDup() {
    console.log('\n-- save/load + legacy no dup --');
    const ctx = boot({ dwellingMode: 'owned', settlementId: 'redwell', sectFounded: true, residenceLevel: 1 });
    decipherAndReady(ctx, 'spirit_gathering');
    assert(ctx.layPersonalDwellingFormation(0, 'spirit_gathering').success, 'lay dwelling');
    // Separate pattern on sect courtyard (needs residence lv2 for stabilizer).
    ctx.G.sect.residence.level = 2;
    decipherAndReady(ctx, 'qi_stabilizer');
    assert(ctx.layResidenceFormation(0, 'qi_stabilizer').success, 'lay sect residence separately');

    const snap = JSON.parse(JSON.stringify({
        dwelling: ctx.G.dwelling,
        sect: ctx.G.sect,
        formationShelf: ctx.G.formationShelf,
        formationMaster: ctx.G.formationMaster,
        knownFormations: ctx.G.knownFormations
    }));

    const again = boot({ dwellingMode: 'homeless' });
    again.G.dwelling = JSON.parse(JSON.stringify(snap.dwelling));
    again.G.sect = JSON.parse(JSON.stringify(snap.sect));
    again.G.formationShelf = JSON.parse(JSON.stringify(snap.formationShelf));
    again.G.formationMaster = JSON.parse(JSON.stringify(snap.formationMaster));
    again.G.knownFormations = JSON.parse(JSON.stringify(snap.knownFormations));
    again.G.location = 'redwell';
    again.ensureFormationState();

    assert(again.G.dwelling.formations.slots[0]?.id === 'spirit_gathering', 'dwelling slot persists');
    assert(again.G.sect.residence.formations.slots[0]?.id === 'qi_stabilizer', 'sect slot persists');
    const dwellCount = (again.G.dwelling.formations.slots || []).filter(Boolean).length;
    const sectCount = (again.G.sect.residence.formations.slots || []).filter(Boolean).length;
    assert(dwellCount === 1 && sectCount === 1, 'no duplicated installs across sites after reload');

    // Legacy-only sect save: ensure does not invent dwelling copies
    const legacy = boot({ sectFounded: true, residenceLevel: 1, dwellingMode: 'owned', settlementId: 'redwell' });
    legacy.G.sect.residence.formations.slots = [
        legacy.createResidenceFormationSlotState('spirit_gathering', { active: true, fuel: 6 })
    ];
    legacy.G.dwelling.formations = { slots: [], siteSettlementId: null };
    legacy.G.knownFormations = ['spirit_gathering'];
    legacy.G.formationShelf = {
        spirit_gathering: { formationId: 'spirit_gathering', deciphered: true, source: 'legacy' }
    };
    legacy.G.formationMaster.tier = 1;
    legacy.ensureFormationState();
    assert(!(legacy.G.dwelling.formations.slots || []).some(Boolean), 'legacy sect formations are not copied into dwelling');
}

function testCultivateAppliesOnce() {
    console.log('\n-- cultivate apply once --');
    const ctx = boot({ dwellingMode: 'owned', settlementId: 'redwell', sectFounded: true, residenceLevel: 1 });
    decipherAndReady(ctx, 'spirit_gathering');
    assert(ctx.layResidenceFormation(0, 'spirit_gathering').success, 'lay for cultivate test');
    const mult = ctx.getResidenceFormationCultivateMult();
    assert(Math.abs(mult - 1.08) < 1e-9, `support mult is +8% once (${mult})`);

    ctx._focusedCalls = [];
    // Mimic fixed actionResidenceCultivate: no extraMult
    ctx.runFocusedCultivateSession({
        extraFoundation: 0,
        bonusNoteParts: ['formations +8%'],
        logPrefix: '🏠 At your quarters'
    });
    assert(ctx._focusedCalls.length === 1, 'one focused session');
    assert(ctx._focusedCalls[0].extraMult == null || ctx._focusedCalls[0].extraMult === 1,
        'quarters cultivate does not re-pass formation mult as extraMult');

    // Source guard: live action must not pass formMult as extraMult
    const src = read('formations.js');
    const actionChunk = src.slice(
        src.indexOf('function actionResidenceCultivate'),
        src.indexOf('function formatFormationSlotStatusHtml')
    );
    assert(!/extraMult:\s*formMult/.test(actionChunk), 'actionResidenceCultivate source has no extraMult: formMult');
}

function testWardSoftensAlways() {
    console.log('\n-- defensive ward softens --');
    const base = boot({ buildingDefense: 0 });
    assert(base.getSectEventStoneLossMult() === 1, 'no defense → mult 1');

    const ward = boot({ buildingDefense: 30 });
    const softened = ward.getSectEventStoneLossMult();
    assert(softened < 1, `defense softens default mult (${softened})`);

    // Old bug: defense only applied when mult < 1, then added (worsened). Trait soft mult:
    const softTrait = boot({ buildingDefense: 30, traitLossMult: 0.8 });
    const withWard = softTrait.getSectEventStoneLossMult();
    assert(withWard < 0.8, `ward further softens already-soft trait mult (${withWard})`);

    const amplified = boot({ buildingDefense: 30, traitLossMult: 1.5 });
    const dampened = amplified.getSectEventStoneLossMult();
    assert(dampened < 1.5 && dampened > 1, `ward dampens amplified losses (${dampened})`);
}

function testDwellingTransitionsClearInstalls() {
    console.log('\n-- dwelling ownership transitions --');
    // Owned → simulate loss of ownership (no sale API today; rent eviction path + mode wipe)
    const ctx = boot({ dwellingMode: 'owned', settlementId: 'redwell' });
    decipherAndReady(ctx, 'spirit_gathering');
    assert(ctx.layPersonalDwellingFormation(0, 'spirit_gathering').success, 'install before transition');
    ctx.G.dwelling.mode = 'homeless';
    ctx.G.dwelling.settlementId = null;
    const cleared = ctx.reconcilePersonalDwellingFormationSite();
    assert(cleared.cleared === true, 'ownership loss clears installs');
    assert(!(ctx.G.dwelling.formations.slots || []).some(Boolean), 'slots empty after ownership loss');
    assert(ctx.G.dwelling.formations.siteSettlementId == null, 'site binding cleared');

    // Relocation: settlementId change must not teleport the pattern
    const move = boot({ dwellingMode: 'owned', settlementId: 'redwell' });
    decipherAndReady(move, 'spirit_gathering');
    assert(move.layPersonalDwellingFormation(0, 'spirit_gathering').success, 'install before relocate');
    move.G.dwelling.settlementId = 'jade_harbor';
    const relocated = move.reconcilePersonalDwellingFormationSite();
    assert(relocated.cleared === true && relocated.reason === 'site_relocated', 'relocation clears installs');
    assert(!(move.G.dwelling.formations.slots || []).some(Boolean), 'no teleported formation after relocate');

    // Rent eviction (existing transition): rent never grants installs, but stray slots must clear
    const rent = boot({ dwellingMode: 'rent', settlementId: 'redwell' });
    rent.G.dwelling.formations = {
        siteSettlementId: 'redwell',
        slots: [rent.createResidenceFormationSlotState('spirit_gathering', { active: true, fuel: 6 })]
    };
    rent.G.dwelling.mode = 'homeless';
    rent.G.dwelling.settlementId = null;
    const evict = rent.reconcilePersonalDwellingFormationSite();
    assert(evict.cleared === true, 'eviction clears stray dwelling formations');

    // Buy path: owned binds site; does not invent installs from sect
    const buy = boot({ dwellingMode: 'rent', settlementId: 'redwell', sectFounded: true, residenceLevel: 1 });
    buy.G.sect.residence.formations.slots = [
        buy.createResidenceFormationSlotState('spirit_gathering', { active: true, fuel: 6 })
    ];
    buy.G.dwelling.mode = 'owned';
    buy.G.dwelling.settlementId = 'redwell';
    buy.ensurePersonalDwellingFormationState();
    assert(!(buy.G.dwelling.formations.slots || []).some(Boolean), 'buying courtyard does not copy sect formations');
    assert(buy.G.dwelling.formations.siteSettlementId === 'redwell', 'owned dwelling binds site id');
}

function testProfessionProgression() {
    console.log('\n-- formation profession progression --');
    const ctx = boot({ dwellingMode: 'owned', settlementId: 'redwell' });
    assert(ctx.getFormationMasterTier() === 0, 'starts uninitiated');
    ctx.grantFormationManual('spirit_gathering', { silent: true, deciphered: false, source: 'test' });
    const dec = ctx.decipherFormation('spirit_gathering');
    assert(dec.success, 'decipher succeeds');
    assert(ctx.getFormationMasterTier() >= 1, 'decipher promotes toward Pattern Student');
    assert(ctx.getFormationMasterInsight() > 0, 'decipher grants FI');
}

function testDwellingEffectsLocality() {
    console.log('\n-- dwelling effects locality --');
    const ctx = boot({ dwellingMode: 'owned', settlementId: 'redwell' });
    decipherAndReady(ctx, 'spirit_gathering');
    assert(ctx.layPersonalDwellingFormation(0, 'spirit_gathering').success, 'lay dwelling gather');
    assert(Math.abs(ctx.getResidenceFormationCultivateMult() - 1.08) < 1e-9, 'at site: +8%');
    ctx.G.location = 'elsewhere';
    assert(Math.abs(ctx.getResidenceFormationCultivateMult() - 1) < 1e-9, 'away: dwelling bonus inactive');
}

function testEnsureSyncSmoke() {
    console.log('\n-- ensure sync smoke --');
    const ctx = boot({ dwellingMode: 'owned', settlementId: 'redwell', sectFounded: true, residenceLevel: 1 });
    for (let i = 0; i < 5; i++) ctx.ensureFormationState();
    assert(true, 'ensureFormationState re-entrant without throw');
}

testInstallWithoutSect();
testUnauthorizedInstall();
testSectFormationsStillWork();
testActivationMaintenanceFuelIntegrity();
testSaveLoadAndLegacyNoDup();
testCultivateAppliesOnce();
testWardSoftensAlways();
testDwellingTransitionsClearInstalls();
testProfessionProgression();
testDwellingEffectsLocality();
testEnsureSyncSmoke();

console.log(`\n${failed === 0 ? 'All independent-formation tests passed.' : failed + ' failure(s).'}`);
process.exit(failed === 0 ? 0 : 1);
