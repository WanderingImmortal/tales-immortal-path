/**
 * Stage 3E — Qi purity technique cost efficiency (not damage).
 * Run: node scripts/audit-qi-purity-technique.js
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

function loadRuntime() {
    global.G = {
        path: 'qi',
        realmIdx: 0,
        qi: 10,
        qiDensity: 0,
        qiPurity: 0,
        maxCombatResource: 20,
        corruptionLevel: 0,
        corruptionThreshold: 100,
        techniques: [{ name: 'Test Qi Strike', uses: 10, baseCost: 7, baseDamage: 10, costType: 'qi', category: 'attack', combatTier: 'medium' }],
        affinities: null
    };
    global.QI_PURITY_BALANCE = {
        purityBase: 0.5,
        purityFloor: 0.25,
        maxCorruptionStain: 0.45,
        cultivatePurityMin: 0.04,
        cultivatePurityMax: 0.11,
        purityCompressionFillThreshold: 0.88,
        techniqueCostPurityRef: 1,
        techniqueCostMaxReduction: 0.18,
        techniqueCostPurityExponent: 0.55
    };
    global.QI_BALANCE = {
        densityBase: 1,
        cultivateDensityMin: 0.12,
        cultivateDensityMax: 0.32,
        cultivateFillRatio: 0.18,
        qiReplenishDensityRef: 1,
        qiReplenishCostExponent: 1.35,
        qiCompressionMinFill: 0.72,
        qiCompressionFillThreshold: 0.82,
        qiCompressionDifficultyRef: 1,
        qiCompressionDifficultyExponent: 1.5,
        qiCompressionDifficultyFloor: 0.08
    };
    global.TECHNIQUE_COMBAT_TIERS = {
        medium: { poolPct: 0.22, minCost: 3, maxCost: 12 }
    };
    global.TECHNIQUE_BALANCE = { masteryPerTenUses: 1, realmBonus: 1 };
    global.getMaxQi = () => 10;
    global.getQiDensity = () => 1 + (G.qiDensity || 0);
    global.getQiFillRatio = () => G.qi / 10;
    global.getEffectiveFoundation = () => 0;
    global.getPlayerTraitMultPct = () => 1;
    global.getTechniqueMeta = (tech) => ({ path: 'qi', category: tech.category || 'attack', costType: tech.costType || 'qi' });
    global.getTechniqueTemplate = () => ({ costType: 'qi', element: 'neutral' });
    global.getTechniqueCombatTier = () => 'medium';
    global.getTechniqueTier = () => ({ name: 'Adept', bonusDmg: 0, bonusCost: 0.15 });
    global.getTechniqueAffinityCostMult = () => 1;
    global.getTechniqueSetCostMult = () => 1;
    global.getTechniqueIntentMatch = () => ({ costMult: 1, dmgMult: 1 });
    global.getTechniqueStatScale = () => 2;
    global.getTechniqueStatCoeff = () => 1;
    global.getTechniqueBaseStats = (t) => t;
    global.calcMaxCombatResource = () => 20;

    vm.runInThisContext(fs.readFileSync(path.join(root, 'qi-density.js'), 'utf8'), { filename: 'qi-density.js' });
    vm.runInThisContext(fs.readFileSync(path.join(root, 'qi-purity.js'), 'utf8'), { filename: 'qi-purity.js' });

    const combatCostFn = fs.readFileSync(path.join(root, 'combat.js'), 'utf8')
        .match(/function getTechniqueCombatCost\(tech\) \{[\s\S]*?\n\}/)[0];
    vm.runInThisContext(combatCostFn, { filename: 'combat-cost-extract.js' });

    const coreCostFn = fs.readFileSync(path.join(root, 'core.js'), 'utf8')
        .match(/function getTechCost\(tech\) \{[\s\S]*?\n\}/)[0];
    vm.runInThisContext(coreCostFn, { filename: 'getTechCost-extract.js' });
}

function main() {
    console.log('=== Qi purity technique cost audit (Stage 3E) ===\n');
    loadRuntime();
    const tech = G.techniques[0];
    const spiritTech = { name: 'Soul Cut', uses: 5, baseCost: 8, costType: 'spirit', category: 'attack', combatTier: 'medium' };

    G.qiPurity = 0;
    G.qiDensity = 0;
    const lowPurityCombat = getTechniqueCombatCost(tech);
    const lowPurityUi = getTechCost(tech);
    G.qiPurity = 2;
    G.qiDensity = 0;
    const highPurityCombat = getTechniqueCombatCost(tech);
    const highPurityUi = getTechCost(tech);
    if (!(highPurityCombat < lowPurityCombat)) fail('higher purity should reduce combat Qi technique cost');
    else ok('high purity lowers Qi technique combat cost');
    if (!(highPurityUi < lowPurityUi)) fail('getTechCost should reflect purity for Qi techniques');
    else ok('UI/out-of-combat getTechCost matches purity discount');

    G.qiPurity = 2;
    G.qiDensity = 3;
    const costHighDensity = getTechniqueCombatCost(tech);
    G.qiDensity = 0;
    const costLowDensity = getTechniqueCombatCost(tech);
    if (costHighDensity !== costLowDensity) fail('density should not change technique cost (purity-only effect)');
    else ok('equal purity: density does not affect technique cost');

    G.qiPurity = 0;
    G.qiDensity = 3;
    const costLowP = getTechniqueCombatCost(tech);
    G.qiPurity = 2;
    G.qiDensity = 3;
    const costHighP = getTechniqueCombatCost(tech);
    if (!(costHighP < costLowP)) fail('higher purity should reduce cost at same density');
    else ok('equal density: higher purity reduces cost');

    const spiritCost = getTechniqueCombatCost(spiritTech);
    G.qiPurity = 3;
    const spiritCostAfter = getTechniqueCombatCost(spiritTech);
    if (spiritCostAfter !== spiritCost) fail('spirit-cost techniques must ignore purity discount');
    else ok('spirit techniques unaffected by purity');

    const bonusBefore = G.qiPurity;
    G.qi = 0;
    getTechniqueCombatCost(tech);
    if (G.qiPurity !== bonusBefore) fail('technique cost calc must not mutate purity');
    else ok('purity persists through cost calculation / depletion context');

    G.qi = 10;
    const sgFull = computeQiCultivationSessionGains({ cultMult: 1, scale: 1, densityRoll: 0.5 });
    computeQiPuritySessionGain(sgFull, { cultMult: 1, scale: 1, purityRoll: 0.5 });
    G.qi = 7.6;
    const sgMid = computeQiCultivationSessionGains({ cultMult: 1, scale: 1, densityRoll: 0.5 });
    computeQiPuritySessionGain(sgMid, { cultMult: 1, scale: 1, purityRoll: 0.5 });
    if ((sgMid.densGain || 0) <= 0) fail('mid-fill (76%, between density 72–82% gate) should allow partial density');
    if ((sgMid.purityGain || 0) > 0.001) fail('purity should not gain below 88% fill (stricter than density)');
    if ((sgFull.purityGain || 0) <= 0) fail('full dantian should refine purity');
    else ok('purity progression stricter than density (88%+ fill)');

    console.log('\n--- Before / after examples (medium tier, baseCost 7, Adept mastery) ---');
    G.qiPurity = 0;
    G.qiDensity = 0;
    const exLow = getTechniqueCombatCost(tech);
    G.qiPurity = 1;
    const exMid = getTechniqueCombatCost(tech);
    G.qiPurity = 2.5;
    const exHigh = getTechniqueCombatCost(tech);
    console.log(`effective purity ~${getQiPurity().toFixed(2)}\tcombat cost ${exLow}`);
    G.qiPurity = 1;
    console.log(`effective purity ~${getQiPurity().toFixed(2)}\tcombat cost ${exMid}`);
    G.qiPurity = 2.5;
    console.log(`effective purity ~${getQiPurity().toFixed(2)}\tcombat cost ${exHigh}`);
    console.log(`mult at high purity: ${getQiPurityTechniqueCostMult(tech).toFixed(3)}`);

    console.log('\n--- Audit summary ---');
    if (failed) {
        console.error(`\n${failed} check(s) failed.`);
        process.exit(1);
    }
    console.log('All qi purity technique checks passed.');
}

main();
