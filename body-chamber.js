// ============================================
// BODY-CHAMBER.JS — Body Cultivation Chamber (layered physique refinement)
// ============================================
//
// PHASE PLAN
//   [x] Phase 1: UI (silhouette + tabs), Skin actions, progress / unlock system
//   [x] Phase 2: Flesh tab
//   [x] Phase 3: Bones tab (+ Marrow)
//   [x] Phase 4: Organs tab
//   [x] Phase 5: Blood tab (+ Bloodline)
//   [x] Phase 6: Meridians tab
//   [x] Phase 7: Nerves tab
//

const BODY_CHAMBER_BONUS_KEYS = [
    'physicalDefensePct', 'elementalResistPct', 'maxHpPct', 'physicalDamagePct',
    'techniqueEfficiencyPct', 'hpRegenPct', 'attackSpeedPct', 'techniquePrecisionPct',
    'speedPct', 'evasionPct', 'mobilityPct', 'stabilityPct', 'flatHp', 'resiliencePct',
    'posturePct', 'willpowerPct', 'fearResistPct', 'qiEfficiencyPct', 'staminaEfficiencyPct',
    'staminaRegenPct', 'qiRegenPct', 'poisonResistPct', 'diseaseResistPct', 'vitalityPct',
    'lifeStealPct', 'lowHpDmgPct', 'bloodDmgPct', 'demonDmgPct'
];

const BODY_CHAMBER_BONUS_LABELS = {
    physicalDefensePct: 'physical defense',
    elementalResistPct: 'elemental resistance',
    maxHpPct: 'HP',
    physicalDamagePct: 'physical damage',
    techniqueEfficiencyPct: 'technique efficiency',
    hpRegenPct: 'HP regen',
    attackSpeedPct: 'attack speed',
    techniquePrecisionPct: 'technique precision',
    speedPct: 'speed',
    evasionPct: 'evasion',
    mobilityPct: 'mobility',
    stabilityPct: 'stability',
    flatHp: 'HP',
    resiliencePct: 'resilience',
    posturePct: 'posture',
    willpowerPct: 'willpower',
    fearResistPct: 'fear resistance',
    qiEfficiencyPct: 'Qi efficiency',
    staminaEfficiencyPct: 'Stamina efficiency',
    staminaRegenPct: 'stamina regen',
    qiRegenPct: 'Qi regen',
    poisonResistPct: 'poison resist',
    diseaseResistPct: 'disease resist',
    vitalityPct: 'vitality',
    lifeStealPct: 'life steal',
    lowHpDmgPct: 'low-HP damage',
    bloodDmgPct: 'blood technique damage',
    demonDmgPct: 'demon damage'
};

const BODY_SUB_HINTS = {
    marrow: sub => `🔒 ${sub.label} unlocks at 50% Bones — the marrow will glow faint red.`,
    bloodline: sub => `🔒 ${sub.label} unlocks at 50% Blood — ancestral heat will pulse through your veins.`,
    microcosmic: sub => `🔒 ${sub.label} unlocks at 50% Meridians — golden light will trace your channels.`
};

const BODY_LAYER_TAB_DESC = {
    meridians: 'Circuit the twelve primary channels. The first refinement of each opens that meridian in your body.',
    nerves: 'The final gate. Refine the Nerve Sea once — lightning reflexes and spirit perception, never to be repeated.'
};

const BODY_SILHOUETTE_REGIONS = {
    head: { label: 'Head & Skull', boneAction: 'skull', layers: ['skin', 'flesh', 'nerves'] },
    spine: { label: 'Spine', boneAction: 'spine', layers: ['bones', 'meridians', 'nerves'] },
    ribs: { label: 'Torso & Ribs', boneAction: 'ribs', layers: ['skin', 'flesh', 'bones', 'organs', 'blood'] },
    'arm-l': { label: 'Left Arm', boneAction: 'arms', layers: ['skin', 'flesh'] },
    'arm-r': { label: 'Right Arm', boneAction: 'arms', layers: ['skin', 'flesh'] },
    'hand-l': { label: 'Left Hand', boneAction: 'hands', layers: ['skin'] },
    'hand-r': { label: 'Right Hand', boneAction: 'hands', layers: ['skin'] },
    'leg-l': { label: 'Left Leg', boneAction: 'legs', layers: ['skin', 'flesh'] },
    'leg-r': { label: 'Right Leg', boneAction: 'legs', layers: ['skin', 'flesh'] },
    'foot-l': { label: 'Left Foot', boneAction: 'feet', layers: ['skin'] },
    'foot-r': { label: 'Right Foot', boneAction: 'feet', layers: ['skin'] }
};

const BODY_GLOBAL_SIL_LAYERS = ['skin', 'flesh'];

const BODY_MUSCLE_DEFS = [
    // Chest — sternal pecs
    { id: 'pec-l', action: 'muscle', d: 'M 93,52 Q 86,58 88,72 Q 98,70 102,60 Q 100,52 93,52 Z' },
    { id: 'pec-r', action: 'muscle', d: 'M 113,52 Q 120,58 118,72 Q 108,70 104,60 Q 106,52 113,52 Z' },
    // Shoulders — delt cap over arm head
    { id: 'delt-l', action: 'muscle', d: 'M 92,40 Q 80,42 66,50 Q 56,58 58,68 Q 68,66 78,58 Q 88,50 94,44 Z' },
    { id: 'delt-r', action: 'muscle', d: 'M 114,40 Q 126,42 140,50 Q 150,58 148,68 Q 138,66 128,58 Q 118,50 112,44 Z' },
    // Arms — anterior upper & lower
    { id: 'bicep-l', action: 'muscle', d: 'M 64,56 Q 56,68 58,84 Q 70,82 74,66 Q 72,58 64,56 Z' },
    { id: 'bicep-r', action: 'muscle', d: 'M 142,56 Q 150,68 148,84 Q 136,82 132,66 Q 134,58 142,56 Z' },
    { id: 'forearm-l', action: 'muscle', d: 'M 58,86 Q 52,98 50,112 Q 62,110 68,96 Q 66,90 58,86 Z' },
    { id: 'forearm-r', action: 'muscle', d: 'M 148,86 Q 154,98 156,112 Q 144,110 138,96 Q 140,90 148,86 Z' },
    // Core — rectus block + flanks
    { id: 'abs-upper', action: 'enhance', d: 'M 93,56 L 113,56 Q 115,66 113,76 L 93,76 Q 91,66 93,56 Z' },
    { id: 'abs-mid', action: 'enhance', d: 'M 94,78 Q 103,76 112,78 L 111,88 Q 103,90 95,88 Z' },
    { id: 'abs-lower', action: 'enhance', d: 'M 95,90 Q 103,88 111,90 L 110,100 Q 103,102 96,100 Z' },
    { id: 'oblique-l', action: 'enhance', d: 'M 88,58 Q 80,70 82,88 Q 90,84 92,70 Q 90,62 88,58 Z' },
    { id: 'oblique-r', action: 'enhance', d: 'M 118,58 Q 126,70 124,88 Q 116,84 114,70 Q 116,62 118,58 Z' },
    { id: 'trap', action: 'enhance', d: 'M 88,30 Q 103,34 118,30 L 116,46 Q 103,50 90,46 Z' },
    // Legs — anterior thigh & shin
    { id: 'quad-l', action: 'muscle', d: 'M 88,106 Q 84,122 86,140 Q 100,138 102,122 Q 100,108 88,106 Z' },
    { id: 'quad-r', action: 'muscle', d: 'M 118,106 Q 122,122 120,140 Q 106,138 104,122 Q 106,108 118,106 Z' },
    { id: 'calf-l', action: 'muscle', d: 'M 84,146 Q 80,164 82,182 Q 96,178 98,160 Q 96,150 84,146 Z' },
    { id: 'calf-r', action: 'muscle', d: 'M 122,146 Q 126,164 124,182 Q 110,178 108,160 Q 110,150 122,146 Z' },
    { id: 'glute-l', action: 'muscle', d: 'M 86,100 Q 80,108 82,118 Q 94,114 98,104 Q 94,100 86,100 Z' },
    { id: 'glute-r', action: 'muscle', d: 'M 120,100 Q 126,108 124,118 Q 112,114 108,104 Q 112,100 120,100 Z' },
    // Tendons — sinew lines (rendered on top)
    { id: 'tendon-shoulder-l', action: 'tendons', kind: 'tendon', d: 'M 90,42 Q 76,48 62,56' },
    { id: 'tendon-shoulder-r', action: 'tendons', kind: 'tendon', d: 'M 116,42 Q 130,48 144,56' },
    { id: 'tendon-elbow-l', action: 'tendons', kind: 'tendon', d: 'M 60,82 Q 56,90 52,98' },
    { id: 'tendon-elbow-r', action: 'tendons', kind: 'tendon', d: 'M 146,82 Q 150,90 154,98' },
    { id: 'tendon-wrist-l', action: 'tendons', kind: 'tendon', d: 'M 52,112 Q 50,104 54,94' },
    { id: 'tendon-wrist-r', action: 'tendons', kind: 'tendon', d: 'M 154,112 Q 156,104 152,94' },
    { id: 'tendon-knee-l', action: 'tendons', kind: 'tendon', d: 'M 94,138 L 90,152' },
    { id: 'tendon-knee-r', action: 'tendons', kind: 'tendon', d: 'M 112,138 L 116,152' },
    { id: 'tendon-achilles-l', action: 'tendons', kind: 'tendon', d: 'M 90,170 Q 86,182 82,194' },
    { id: 'tendon-achilles-r', action: 'tendons', kind: 'tendon', d: 'M 116,170 Q 120,182 124,194' }
];

const BODY_MUSCLE_LAYOUT_VERSION = '3';

const BODY_FLESH_ACTION_MUSCLES = {
    'flesh:muscle': ['pec-l', 'pec-r', 'delt-l', 'delt-r', 'bicep-l', 'bicep-r', 'forearm-l', 'forearm-r', 'quad-l', 'quad-r', 'calf-l', 'calf-r', 'glute-l', 'glute-r'],
    'flesh:tendons': ['tendon-shoulder-l', 'tendon-shoulder-r', 'tendon-elbow-l', 'tendon-elbow-r', 'tendon-wrist-l', 'tendon-wrist-r', 'tendon-knee-l', 'tendon-knee-r', 'tendon-achilles-l', 'tendon-achilles-r'],
    'flesh:enhance': ['abs-upper', 'abs-mid', 'abs-lower', 'oblique-l', 'oblique-r', 'trap']
};

const BODY_BONE_DEFS = [
    { id: 'bone-skull', action: 'skull', kind: 'bone', d: 'M 91,6 Q 103,2 115,6 Q 118,16 115,24 Q 103,27 91,24 Q 88,16 91,6 Z' },
    { id: 'bone-spine', action: 'spine', kind: 'bone', d: 'M 101,26 L 105,26 L 104,94 L 102,94 Z' },
    { id: 'bone-spine-v1', action: 'spine', kind: 'bone-tick', d: 'M 99,34 L 107,34' },
    { id: 'bone-spine-v2', action: 'spine', kind: 'bone-tick', d: 'M 99,44 L 107,44' },
    { id: 'bone-spine-v3', action: 'spine', kind: 'bone-tick', d: 'M 99,54 L 107,54' },
    { id: 'bone-spine-v4', action: 'spine', kind: 'bone-tick', d: 'M 99,64 L 107,64' },
    { id: 'bone-spine-v5', action: 'spine', kind: 'bone-tick', d: 'M 99,74 L 107,74' },
    { id: 'bone-spine-v6', action: 'spine', kind: 'bone-tick', d: 'M 99,84 L 107,84' },
    { id: 'bone-rib-l1', action: 'ribs', kind: 'bone', d: 'M 102,40 Q 76,42 68,50' },
    { id: 'bone-rib-r1', action: 'ribs', kind: 'bone', d: 'M 104,40 Q 130,42 138,50' },
    { id: 'bone-rib-l2', action: 'ribs', kind: 'bone', d: 'M 102,50 Q 74,54 66,64' },
    { id: 'bone-rib-r2', action: 'ribs', kind: 'bone', d: 'M 104,50 Q 132,54 140,64' },
    { id: 'bone-rib-l3', action: 'ribs', kind: 'bone', d: 'M 102,60 Q 76,66 70,76' },
    { id: 'bone-rib-r3', action: 'ribs', kind: 'bone', d: 'M 104,60 Q 130,66 136,76' },
    { id: 'bone-rib-l4', action: 'ribs', kind: 'bone', d: 'M 102,70 Q 80,78 74,86' },
    { id: 'bone-rib-r4', action: 'ribs', kind: 'bone', d: 'M 104,70 Q 126,78 132,86' },
    { id: 'bone-humerus-l', action: 'arms', kind: 'bone', d: 'M 72,46 L 66,86' },
    { id: 'bone-humerus-r', action: 'arms', kind: 'bone', d: 'M 134,46 L 140,86' },
    { id: 'bone-radius-l', action: 'arms', kind: 'bone', d: 'M 64,50 L 56,96' },
    { id: 'bone-radius-r', action: 'arms', kind: 'bone', d: 'M 142,50 L 150,96' },
    { id: 'bone-hand-l', action: 'hands', kind: 'bone', d: 'M 52,98 L 58,108 M 54,100 L 56,112 M 50,104 L 60,114' },
    { id: 'bone-hand-r', action: 'hands', kind: 'bone', d: 'M 154,98 L 148,108 M 152,100 L 150,112 M 156,104 L 146,114' },
    { id: 'bone-femur-l', action: 'legs', kind: 'bone', d: 'M 92,100 L 88,140' },
    { id: 'bone-femur-r', action: 'legs', kind: 'bone', d: 'M 114,100 L 118,140' },
    { id: 'bone-tibia-l', action: 'legs', kind: 'bone', d: 'M 90,142 L 84,182' },
    { id: 'bone-tibia-r', action: 'legs', kind: 'bone', d: 'M 116,142 L 122,182' },
    { id: 'bone-foot-l', action: 'feet', kind: 'bone', d: 'M 78,184 L 88,196 M 82,186 L 92,198' },
    { id: 'bone-foot-r', action: 'feet', kind: 'bone', d: 'M 128,184 L 118,196 M 124,186 L 114,198' },
    { id: 'bone-marrow', action: 'marrow', kind: 'marrow', d: 'M 98,48 Q 103,44 108,48 Q 110,68 108,82 Q 103,86 98,82 Q 96,68 98,48 Z' }
];
const BODY_BONE_LAYOUT_VERSION = '1';
const BODY_BONE_ACTION_PARTS = {
    'bones:skull': ['bone-skull'],
    'bones:spine': ['bone-spine', 'bone-spine-v1', 'bone-spine-v2', 'bone-spine-v3', 'bone-spine-v4', 'bone-spine-v5', 'bone-spine-v6'],
    'bones:ribs': ['bone-rib-l1', 'bone-rib-r1', 'bone-rib-l2', 'bone-rib-r2', 'bone-rib-l3', 'bone-rib-r3', 'bone-rib-l4', 'bone-rib-r4'],
    'bones:arms': ['bone-humerus-l', 'bone-humerus-r', 'bone-radius-l', 'bone-radius-r'],
    'bones:hands': ['bone-hand-l', 'bone-hand-r'],
    'bones:legs': ['bone-femur-l', 'bone-femur-r', 'bone-tibia-l', 'bone-tibia-r'],
    'bones:feet': ['bone-foot-l', 'bone-foot-r'],
    'bones:marrow': ['bone-marrow']
};

const BODY_ORGAN_DEFS = [
    { id: 'organ-heart', action: 'heart', kind: 'organ', type: 'ellipse', cx: 103, cy: 54, rx: 9, ry: 10 },
    { id: 'organ-lung-l', action: 'lungs', kind: 'organ', type: 'ellipse', cx: 88, cy: 50, rx: 10, ry: 12 },
    { id: 'organ-lung-r', action: 'lungs', kind: 'organ', type: 'ellipse', cx: 118, cy: 50, rx: 10, ry: 12 },
    { id: 'organ-liver', action: 'liver', kind: 'organ', type: 'ellipse', cx: 114, cy: 78, rx: 9, ry: 7 },
    { id: 'organ-spleen', action: 'spleen', kind: 'organ', type: 'ellipse', cx: 90, cy: 74, rx: 7, ry: 6 },
    { id: 'organ-kidney-l', action: 'kidneys', kind: 'organ', type: 'ellipse', cx: 94, cy: 82, rx: 6, ry: 8 },
    { id: 'organ-kidney-r', action: 'kidneys', kind: 'organ', type: 'ellipse', cx: 112, cy: 82, rx: 6, ry: 8 }
];
const BODY_ORGAN_LAYOUT_VERSION = '1';
const BODY_ORGAN_ACTION_PARTS = {
    'organs:heart': ['organ-heart'],
    'organs:lungs': ['organ-lung-l', 'organ-lung-r'],
    'organs:liver': ['organ-liver'],
    'organs:kidneys': ['organ-kidney-l', 'organ-kidney-r'],
    'organs:spleen': ['organ-spleen']
};

const BODY_BLOOD_DEFS = [
    { id: 'blood-heart', action: 'vessels', kind: 'blood-core', type: 'ellipse', cx: 103, cy: 56, rx: 11, ry: 12 },
    { id: 'blood-aorta', action: 'vessels', kind: 'blood-line', d: 'M 103,68 L 103,90' },
    { id: 'blood-carotid-l', action: 'circulate', kind: 'blood-line', d: 'M 103,42 Q 92,38 88,28' },
    { id: 'blood-carotid-r', action: 'circulate', kind: 'blood-line', d: 'M 103,42 Q 114,38 118,28' },
    { id: 'blood-arm-l', action: 'circulate', kind: 'blood-line', d: 'M 103,48 Q 78,54 62,88' },
    { id: 'blood-arm-r', action: 'circulate', kind: 'blood-line', d: 'M 103,48 Q 128,54 144,88' },
    { id: 'blood-leg-l', action: 'circulate', kind: 'blood-line', d: 'M 103,90 Q 90,110 86,150' },
    { id: 'blood-leg-r', action: 'circulate', kind: 'blood-line', d: 'M 103,90 Q 116,110 120,150' },
    { id: 'blood-vein-l', action: 'purify', kind: 'blood-line', d: 'M 96,62 Q 84,72 80,88' },
    { id: 'blood-vein-r', action: 'purify', kind: 'blood-line', d: 'M 110,62 Q 122,72 126,88' },
    { id: 'blood-essence', action: 'condense', kind: 'blood-glow', type: 'ellipse', cx: 103, cy: 64, rx: 18, ry: 20 },
    { id: 'blood-battle-l', action: 'battle', kind: 'blood-line', d: 'M 100,76 Q 88,84 76,92' },
    { id: 'blood-battle-r', action: 'battle', kind: 'blood-line', d: 'M 106,76 Q 118,84 130,92' },
    { id: 'blood-lineage', action: 'bloodline', kind: 'blood-glow', d: 'M 103,56 Q 103,90 103,130 Q 90,150 103,170 Q 116,150 103,130' }
];
const BODY_BLOOD_LAYOUT_VERSION = '1';
const BODY_BLOOD_ACTION_PARTS = {
    'blood:purify': ['blood-vein-l', 'blood-vein-r'],
    'blood:condense': ['blood-essence'],
    'blood:vessels': ['blood-heart', 'blood-aorta'],
    'blood:circulate': ['blood-carotid-l', 'blood-carotid-r', 'blood-arm-l', 'blood-arm-r', 'blood-leg-l', 'blood-leg-r'],
    'blood:battle': ['blood-battle-l', 'blood-battle-r'],
    'blood:bloodline': ['blood-lineage']
};

const BODY_NERVE_DEFS = [
    { id: 'nerve-spine', d: 'M103 14 L103 195', sw: 1.8 },
    { id: 'nerve-arm-l', d: 'M103 48 L64 88', sw: 1.2 },
    { id: 'nerve-arm-r', d: 'M103 48 L142 88', sw: 1.2 },
    { id: 'nerve-leg-l', d: 'M103 88 L78 130', sw: 1.2 },
    { id: 'nerve-leg-r', d: 'M103 88 L128 130', sw: 1.2 },
    { id: 'nerve-neck-l', d: 'M103 36 L88 24', sw: 1.2 },
    { id: 'nerve-neck-r', d: 'M103 36 L118 24', sw: 1.2 },
    { id: 'nerve-palm-l', d: 'M78 130 Q 68 150 62 170', sw: 1 },
    { id: 'nerve-palm-r', d: 'M128 130 Q 138 150 144 170', sw: 1 }
];
const BODY_NERVE_LAYOUT_VERSION = '1';

const BODY_MERIDIAN_STAR_POINTS = [
    { index: 0, cx: 90, cy: 50, id: 'lung' },
    { index: 1, cx: 132, cy: 90, id: 'large_intestine' },
    { index: 2, cx: 103, cy: 74, id: 'stomach' },
    { index: 3, cx: 88, cy: 68, id: 'spleen' },
    { index: 4, cx: 103, cy: 54, id: 'heart' },
    { index: 5, cx: 62, cy: 52, id: 'small_intestine' },
    { index: 6, cx: 103, cy: 118, id: 'bladder' },
    { index: 7, cx: 96, cy: 82, id: 'kidney' },
    { index: 8, cx: 110, cy: 56, id: 'pericardium' },
    { index: 9, cx: 103, cy: 64, id: 'triple_burner' },
    { index: 10, cx: 148, cy: 38, id: 'gallbladder' },
    { index: 11, cx: 118, cy: 76, id: 'liver' }
];

const BODY_ACTION_TO_REGIONS = {
    'bones:hands': ['hand-l', 'hand-r'],
    'bones:arms': ['arm-l', 'arm-r'],
    'bones:legs': ['leg-l', 'leg-r'],
    'bones:feet': ['foot-l', 'foot-r'],
    'bones:ribs': ['ribs'],
    'bones:spine': ['spine'],
    'bones:skull': ['head'],
    'bones:marrow': ['spine', 'ribs']
};

let bodySilhouetteEventsBound = false;

function ensureBodyChamberState() {
    if (!G.bodyChamber) {
        G.bodyChamber = {
            activeTab: 'skin',
            layerProgress: {},
            actionCounts: {},
            bonuses: {},
            subUnlocked: { marrow: false, bloodline: false, microcosmic: false },
            nervesRefined: false
        };
    }
    BODY_CHAMBER_LAYER_ORDER.forEach(id => {
        if (G.bodyChamber.layerProgress[id] == null) G.bodyChamber.layerProgress[id] = 0;
    });
    if (!G.bodyChamber.bonuses) G.bodyChamber.bonuses = {};
    if (!G.bodyChamber.subUnlocked) G.bodyChamber.subUnlocked = { marrow: false, bloodline: false, microcosmic: false };
    if (G.bodyChamber.subUnlocked.microcosmic == null) G.bodyChamber.subUnlocked.microcosmic = false;
    BODY_CHAMBER_BONUS_KEYS.forEach(k => {
        if (G.bodyChamber.bonuses[k] == null) G.bodyChamber.bonuses[k] = 0;
    });
    if (G.bodyChamber.nervesRefined) G.bodyChamber.layerProgress.nerves = 100;
    if (G.bodyChamber.nervesRefined == null) G.bodyChamber.nervesRefined = false;
}

function isBodyNervesRefined() {
    ensureBodyChamberState();
    return !!G.bodyChamber.nervesRefined;
}

function getBodyChamberBonuses() {
    ensureBodyChamberState();
    return G.bodyChamber.bonuses;
}

function getBodyChamberBonus(key) {
    const raw = getBodyChamberBonuses()[key] || 0;
    const caps = typeof BODY_CHAMBER_BONUS_CAPS !== 'undefined' ? BODY_CHAMBER_BONUS_CAPS : null;
    const cap = caps?.[key];
    return cap != null ? Math.min(raw, cap) : raw;
}

function getBodyActionMaxStacks(action) {
    if (action.once) return 1;
    const bal = typeof BODY_CHAMBER_BALANCE !== 'undefined' ? BODY_CHAMBER_BALANCE : {};
    if (action.sub) return action.maxStacks || bal.subMaxStacks || 2;
    return action.maxStacks || bal.defaultMaxStacks || 3;
}

function getBodyLayerProgress(layerId) {
    ensureBodyChamberState();
    return G.bodyChamber.layerProgress[layerId] || 0;
}

function getBodyRealmProgressPct() {
    if (typeof BODY_CHAMBER_LAYER_ORDER === 'undefined') return 0;
    return getChamberLayerPathProgressPct(BODY_CHAMBER_LAYER_ORDER, getBodyLayerProgress);
}

function applyBodyPeakGrindBoost(boost) {
    ensureBodyChamberState();
    const realmLayerIdx = Math.min(G.realmIdx, BODY_CHAMBER_LAYER_ORDER.length - 1);
    const layerId = BODY_CHAMBER_LAYER_ORDER[realmLayerIdx];
    const current = getBodyLayerProgress(layerId);
    G.bodyChamber.layerProgress[layerId] = Math.min(100, current + (boost || 20));
}

function getBodyLayerPrevId(layerId) {
    const idx = BODY_CHAMBER_LAYER_ORDER.indexOf(layerId);
    return idx > 0 ? BODY_CHAMBER_LAYER_ORDER[idx - 1] : null;
}

function isBodyLayerUnlocked(layerId) {
    const def = BODY_CHAMBER_LAYERS[layerId];
    if (!def) return false;
    const prev = getBodyLayerPrevId(layerId);
    if (!prev) return true;
    return getBodyLayerProgress(prev) >= (def.unlockPrevPct || 50);
}

function getBodyLayerActionCount(layerId, actionId) {
    ensureBodyChamberState();
    return G.bodyChamber.actionCounts[`${layerId}:${actionId}`] || 0;
}

function applyBodyChamberBonusDelta(bonus) {
    if (!bonus) return;
    ensureBodyChamberState();
    Object.entries(bonus).forEach(([key, val]) => {
        if (val) G.bodyChamber.bonuses[key] = (G.bodyChamber.bonuses[key] || 0) + val;
    });
}

function formatBodyBonusDelta(bonus) {
    if (!bonus) return '';
    return Object.entries(bonus).map(([key, val]) => {
        if (key === 'flatHp') return `+${val} HP`;
        const label = BODY_CHAMBER_BONUS_LABELS[key] || key;
        return `+${val}% ${label}`;
    }).join(', ');
}

function isBodySubUnlocked(subId, layerId) {
    if (subId === 'marrow' && layerId === 'bones') return getBodyLayerProgress('bones') >= 50;
    if (subId === 'bloodline' && layerId === 'blood') return getBodyLayerProgress('blood') >= 50;
    if (subId === 'microcosmic' && layerId === 'meridians') return getBodyLayerProgress('meridians') >= 50;
    return false;
}

function formatBodyMaterialCost(action) {
    const costs = action.materialCost || (action.rareHerb ? { rare_herb: action.rareHerb } : null);
    if (!costs) return '';
    return Object.entries(costs).map(([matId, qty]) => {
        const mat = typeof CRAFT_MATERIALS !== 'undefined' ? CRAFT_MATERIALS[matId] : null;
        return `${mat?.emoji || '⛏️'} ${qty} ${mat?.name || matId}`;
    }).join(', ');
}

function getBodyActionMaterialCosts(action) {
    if (action.materialCost) return action.materialCost;
    if (action.rareHerb) return { rare_herb: action.rareHerb };
    return null;
}

function getBodyActionBlockReason(layerId, action) {
    if (action.once && isBodyNervesRefined()) {
        return 'The Nerve Sea has already been refined.';
    }
    const maxStacks = getBodyActionMaxStacks(action);
    const count = getBodyLayerActionCount(layerId, action.id);
    if (count >= maxStacks) {
        return `${action.label} fully refined (${maxStacks}×).`;
    }
    if (action.sub && !isBodySubUnlocked(action.sub, layerId)) {
        return `${action.label} unlocks at 50% ${BODY_CHAMBER_LAYERS[layerId]?.label || layerId}.`;
    }
    const costs = getBodyActionMaterialCosts(action);
    if (costs) {
        for (const [matId, qty] of Object.entries(costs)) {
            const have = typeof getMaterialCount === 'function' ? getMaterialCount(matId) : 0;
            if (have < qty) {
                const mat = typeof CRAFT_MATERIALS !== 'undefined' ? CRAFT_MATERIALS[matId] : null;
                const hint = matId === 'rare_herb' ? ' Explore to find Marrow Herb.'
                    : matId === 'demon_core' ? ' Slay demonic beasts or explore Emberwild.'
                        : matId === 'jade_inlay' ? ' Explore Heartlands or Jade Coast for jade.'
                            : '';
                return `Need ${qty} ${mat?.name || matId} (have ${have}).${hint}`;
            }
        }
    }
    return null;
}

function isBodyMeridianOpen(index) {
    return !!(G.meridians && G.meridians[index]);
}

function openBodyChamberMeridian(index) {
    if (!G.meridians) G.meridians = Array(13).fill(false);
    if (G.meridians[index]) return false;
    G.meridians[index] = true;
    grantFoundation(1);
    if (typeof getMaxQi === 'function') {
        G.qi = Math.min(getMaxQi(), (G.qi || 0) + 2);
        if (typeof clampCurrentQi === 'function') clampCurrentQi();
    }
    if (index % 3 === 0) {
        G.vitality = (G.vitality || 0) + 1;
        G.spirit = (G.spirit || 0) + 1;
        G.will = (G.will || 0) + 1;
        if (typeof applyVitalityToMaxHp === 'function') applyVitalityToMaxHp();
    }
    if (typeof checkPerfectCultivation === 'function') checkPerfectCultivation();
    return true;
}

function bodyChamberActionBlocked() {
    return G.gameOver || G.inCombat
        || (typeof isTribulationActive === 'function' && isTribulationActive());
}

function openBodyChamber() {
    if (bodyChamberActionBlocked()) return;
    ensureBodyChamberState();
    G.inBodyChamber = true;
    document.getElementById('bodyChamberOverlay')?.classList.add('active');
    if (!isBodyLayerUnlocked(G.bodyChamber.activeTab)) {
        G.bodyChamber.activeTab = 'skin';
    }
    renderBodyChamberUI();
}

function closeBodyChamber() {
    G.inBodyChamber = false;
    document.getElementById('bodyChamberOverlay')?.classList.remove('active');
    fullRender();
}

function setBodyChamberTab(layerId) {
    if (!isBodyLayerUnlocked(layerId)) return;
    ensureBodyChamberState();
    G.bodyChamber.activeTab = layerId;
    renderBodyChamberUI();
}

function getBodyRegionBoneFill(regionId) {
    const reg = BODY_SILHOUETTE_REGIONS[regionId];
    if (!reg?.boneAction || !isBodyLayerUnlocked('bones')) return null;
    const action = BODY_CHAMBER_ACTIONS.bones?.find(a => a.id === reg.boneAction);
    if (!action) return null;
    const count = getBodyLayerActionCount('bones', reg.boneAction);
    const max = getBodyActionMaxStacks(action);
    return max ? count / max : 0;
}

function getBodyRegionRevealFill(regionId) {
    const tab = G.bodyChamber?.activeTab;
    if (tab === 'skin' && isBodyLayerUnlocked('skin')) return getBodySkinVisualFill();
    if (tab === 'flesh' && isBodyLayerUnlocked('flesh')) return getBodyLayerProgress('flesh') / 100;
    if (tab === 'bones' && isBodyLayerUnlocked('bones')) return getBodyLayerProgress('bones') / 100;
    if (tab === 'organs' && isBodyLayerUnlocked('organs')) return getBodyLayerProgress('organs') / 100;
    if (tab === 'blood' && isBodyLayerUnlocked('blood')) return getBodyLayerProgress('blood') / 100;
    if (tab === 'meridians' && isBodyLayerUnlocked('meridians')) return getBodyLayerProgress('meridians') / 100;
    if (tab === 'nerves' && isBodyLayerUnlocked('nerves')) {
        return isBodyNervesRefined() ? 1 : getBodyLayerProgress('nerves') / 100;
    }
    const reg = BODY_SILHOUETTE_REGIONS[regionId];
    if (!reg) return 0;
    let max = 0;
    const boneFill = getBodyRegionBoneFill(regionId);
    if (boneFill != null) max = Math.max(max, boneFill);
    (reg.layers || []).forEach(layerId => {
        if (!isBodyLayerUnlocked(layerId) || layerId === 'bones') return;
        let prog = layerId === 'nerves' && isBodyNervesRefined()
            ? 1
            : getBodyLayerProgress(layerId) / 100;
        if (layerId === 'skin') prog = getBodySkinVisualFill();
        max = Math.max(max, prog);
    });
    ['skin', 'flesh'].forEach(layerId => {
        if ((reg.layers || []).includes(layerId)) return;
        if (!isBodyLayerUnlocked(layerId)) return;
        const prog = layerId === 'skin'
            ? getBodySkinVisualFill()
            : getBodyLayerProgress(layerId) / 100;
        max = Math.max(max, prog);
    });
    return max;
}

function getBodySkinVisualFill() {
    const raw = getBodyLayerProgress('skin') / 100;
    return Math.min(0.52, 0.06 + raw * 0.4);
}

function getBodyRegionDominantLayer(regionId) {
    const tab = G.bodyChamber?.activeTab;
    if (tab === 'skin' && isBodyLayerUnlocked('skin')) {
        const skinProg = getBodySkinVisualFill();
        return { layerId: 'skin', progress: skinProg, color: BODY_CHAMBER_LAYERS.skin?.color || '#c9a87c' };
    }
    if (tab === 'flesh' && isBodyLayerUnlocked('flesh')) {
        const fleshProg = getBodyLayerProgress('flesh') / 100;
        return { layerId: 'flesh', progress: fleshProg, color: BODY_CHAMBER_LAYERS.flesh?.color || '#b87878' };
    }
    if (tab === 'bones' && isBodyLayerUnlocked('bones')) {
        const prog = getBodyLayerProgress('bones') / 100;
        return { layerId: 'bones', progress: prog, color: BODY_CHAMBER_LAYERS.bones?.color || '#e8e4dc' };
    }
    if (tab === 'organs' && isBodyLayerUnlocked('organs')) {
        const prog = getBodyLayerProgress('organs') / 100;
        return { layerId: 'organs', progress: prog, color: BODY_CHAMBER_LAYERS.organs?.color || '#8a5a7a' };
    }
    if (tab === 'blood' && isBodyLayerUnlocked('blood')) {
        const prog = getBodyLayerProgress('blood') / 100;
        return { layerId: 'blood', progress: prog, color: BODY_CHAMBER_LAYERS.blood?.color || '#a03030' };
    }
    if (tab === 'meridians' && isBodyLayerUnlocked('meridians')) {
        const prog = getBodyLayerProgress('meridians') / 100;
        return { layerId: 'meridians', progress: prog, color: BODY_CHAMBER_LAYERS.meridians?.color || '#c8a840' };
    }
    if (tab === 'nerves' && isBodyLayerUnlocked('nerves')) {
        const prog = isBodyNervesRefined() ? 1 : getBodyLayerProgress('nerves') / 100;
        return { layerId: 'nerves', progress: prog, color: BODY_CHAMBER_LAYERS.nerves?.color || '#60c8c0' };
    }
    const reg = BODY_SILHOUETTE_REGIONS[regionId];
    if (!reg) return { layerId: 'skin', progress: 0, color: BODY_CHAMBER_LAYERS.skin?.color || '#c9a87c' };
    let best = { layerId: 'skin', progress: 0, color: BODY_CHAMBER_LAYERS.skin?.color || '#c9a87c' };
    const boneFill = getBodyRegionBoneFill(regionId);
    if (boneFill != null && boneFill > best.progress) {
        best = { layerId: 'bones', progress: boneFill, color: BODY_CHAMBER_LAYERS.bones?.color || '#e8e4dc' };
    }
    (reg.layers || []).forEach(layerId => {
        if (!isBodyLayerUnlocked(layerId) || layerId === 'bones') return;
        let prog = layerId === 'nerves' && isBodyNervesRefined()
            ? 1
            : getBodyLayerProgress(layerId) / 100;
        if (layerId === 'skin') prog = getBodySkinVisualFill();
        if (prog > best.progress) {
            best = { layerId, progress: prog, color: BODY_CHAMBER_LAYERS[layerId]?.color || '#888' };
        }
    });
    ['skin', 'flesh'].forEach(layerId => {
        if ((reg.layers || []).includes(layerId)) return;
        if (!isBodyLayerUnlocked(layerId)) return;
        const prog = layerId === 'skin'
            ? getBodySkinVisualFill()
            : getBodyLayerProgress(layerId) / 100;
        if (prog > best.progress) {
            best = { layerId, progress: prog, color: BODY_CHAMBER_LAYERS[layerId]?.color || '#888' };
        }
    });
    return best;
}

function getBodyRegionFill(regionId) {
    return getBodyRegionRevealFill(regionId);
}

function isBodyRegionRelevantToTab(regionId, tab) {
    const reg = BODY_SILHOUETTE_REGIONS[regionId];
    if (!reg) return false;
    if (tab === 'meridians' || tab === 'nerves') return false;
    if (BODY_GLOBAL_SIL_LAYERS.includes(tab)) return true;
    if (tab === 'bones' && reg.boneAction) return true;
    if (tab === 'organs' || tab === 'blood') return regionId === 'ribs';
    return reg.layers?.includes(tab);
}

function shouldDimBodyRegion(regionId, tab) {
    if (tab === 'meridians' || tab === 'nerves') return true;
    return !isBodyRegionRelevantToTab(regionId, tab);
}

function getBodyRegionAccentColor(regionId) {
    return getBodyRegionDominantLayer(regionId).color;
}

function isBodyMeridianStarLit(index) {
    if (isBodyMeridianOpen(index)) return true;
    const actions = BODY_CHAMBER_ACTIONS.meridians;
    if (!actions) return false;
    const action = actions.find(a => a.meridianIndex === index);
    if (!action) return false;
    return getBodyLayerActionCount('meridians', action.id) > 0;
}

function renderBodyMeridianStars() {
    const group = document.getElementById('bodySilMeridianStars');
    if (!group) return;
    if (!group.dataset.built) {
        BODY_MERIDIAN_STAR_POINTS.forEach(pt => {
            const star = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            star.setAttribute('class', 'body-sil-meridian-star');
            star.setAttribute('data-meridian-index', String(pt.index));
            star.setAttribute('data-meridian-id', pt.id);
            star.setAttribute('cx', String(pt.cx));
            star.setAttribute('cy', String(pt.cy));
            star.setAttribute('r', '2.2');
            const action = BODY_CHAMBER_ACTIONS.meridians?.find(a => a.meridianIndex === pt.index);
            star.setAttribute('title', action?.label || pt.id);
            group.appendChild(star);
        });
        group.dataset.built = '1';
    }
    applyBodyLayerOverlayState(group, 'meridians');
    if (group.hidden) return;
    group.querySelectorAll('.body-sil-meridian-star').forEach(star => {
        const index = parseInt(star.getAttribute('data-meridian-index'), 10);
        const lit = isBodyMeridianStarLit(index);
        const count = (() => {
            const action = BODY_CHAMBER_ACTIONS.meridians?.find(a => a.meridianIndex === index);
            return action ? getBodyLayerActionCount('meridians', action.id) : 0;
        })();
        const starFill = lit ? Math.min(1, 0.35 + count * 0.22) : 0;
        star.classList.toggle('lit', lit);
        star.classList.toggle('open', isBodyMeridianOpen(index));
        star.style.setProperty('--star-fill', starFill.toFixed(2));
        star.setAttribute('r', lit ? String(2.2 + starFill * 1.8) : '1.6');
    });
}

function renderBodyNerveLines() {
    renderBodyNerveOverlay();
}

function getBodyMuscleFill(muscleDef) {
    if (!isBodyLayerUnlocked('flesh')) return 0;
    const action = BODY_CHAMBER_ACTIONS.flesh?.find(a => a.id === muscleDef.action);
    const count = getBodyLayerActionCount('flesh', muscleDef.action);
    const max = action ? getBodyActionMaxStacks(action) : 3;
    const actionFill = max > 0 ? Math.min(1, count / max) : 0;
    const layerFill = getBodyLayerProgress('flesh') / 100;
    let fill = Math.min(1, actionFill * 0.8 + layerFill * 0.25);
    if (G.bodyChamber?.activeTab === 'flesh' && fill < 0.22) fill = 0.22;
    return fill;
}

function getBodyTendonFill() {
    if (!isBodyLayerUnlocked('flesh')) return 0;
    const action = BODY_CHAMBER_ACTIONS.flesh?.find(a => a.id === 'tendons');
    const count = getBodyLayerActionCount('flesh', 'tendons');
    const max = action ? getBodyActionMaxStacks(action) : 3;
    const actionFill = max > 0 ? Math.min(1, count / max) : 0;
    const layerFill = getBodyLayerProgress('flesh') / 100;
    return Math.min(1, actionFill * 0.9 + layerFill * 0.12);
}

function isBodyTendonsMaxed() {
    const action = BODY_CHAMBER_ACTIONS.flesh?.find(a => a.id === 'tendons');
    if (!action) return false;
    return getBodyLayerActionCount('flesh', 'tendons') >= getBodyActionMaxStacks(action);
}

function getBodyActiveTab() {
    return G.bodyChamber?.activeTab || 'skin';
}

function isBodyTabActive(layerId) {
    return getBodyActiveTab() === layerId;
}

function getBodyActionFill(layerId, actionId) {
    if (!isBodyLayerUnlocked(layerId)) return 0;
    const action = BODY_CHAMBER_ACTIONS[layerId]?.find(a => a.id === actionId);
    const count = getBodyLayerActionCount(layerId, actionId);
    const max = action ? getBodyActionMaxStacks(action) : 3;
    const actionFill = max > 0 ? Math.min(1, count / max) : 0;
    const layerFill = getBodyLayerProgress(layerId) / 100;
    let fill = Math.min(1, actionFill * 0.85 + layerFill * 0.12);
    if (isBodyTabActive(layerId) && fill < 0.2) fill = 0.2;
    return fill;
}

function applyBodyLayerOverlayState(group, layerId) {
    if (!group) return;
    const unlocked = isBodyLayerUnlocked(layerId);
    const active = isBodyTabActive(layerId);
    const progress = layerId === 'nerves' && isBodyNervesRefined()
        ? 100
        : getBodyLayerProgress(layerId);
    const def = BODY_CHAMBER_LAYERS[layerId];
    const glow = Math.min(1, progress / 100);
    group.style.setProperty('--body-layer-fill', glow.toFixed(2));
    group.style.setProperty('--body-layer-color', def?.color || '#c9a87c');
    group.classList.toggle('body-sil-overlay-unlocked', unlocked);
    group.classList.toggle('body-sil-overlay-active', active);
    group.classList.toggle('body-sil-overlay-mid', progress >= 50);
    group.classList.toggle('body-sil-overlay-complete', progress >= 100);
    group.hidden = !unlocked || !active;
}

function setBodyOverlayPartState(el, fill, active) {
    el.style.setProperty('--part-fill', fill.toFixed(2));
    const show = active || fill >= 0.1;
    el.classList.toggle('lit', show);
    el.classList.toggle('mid', fill >= 0.45);
    el.classList.toggle('complete', fill >= 0.85);
    el.classList.toggle('guide', active && fill < 0.1);
}

function renderBodySkinUnified() {
    const group = document.getElementById('bodySilSkinUnified');
    const wrap = document.getElementById('bodySilhouetteWrap');
    if (!group || !wrap) return;
    const onSkinTab = isBodyTabActive('skin');
    const skinRaw = getBodyLayerProgress('skin') / 100;
    const visualFill = getBodySkinVisualFill();
    const color = BODY_CHAMBER_LAYERS.skin?.color || '#c9a87c';
    wrap.classList.toggle('body-sil-tab-skin', onSkinTab);
    wrap.classList.toggle('body-sil-skin-complete', skinRaw >= 0.99);
    group.style.setProperty('--skin-fill', visualFill.toFixed(2));
    group.style.setProperty('--skin-raw', skinRaw.toFixed(2));
    group.style.setProperty('--skin-color', color);
    group.hidden = !isBodyLayerUnlocked('skin') || !onSkinTab;
}

function renderBodyMuscleOverlay() {
    const group = document.getElementById('bodySilFleshMuscles');
    if (!group) return;
    const unlocked = isBodyLayerUnlocked('flesh');
    const progress = getBodyLayerProgress('flesh');
    const def = BODY_CHAMBER_LAYERS.flesh;
    const layerFill = Math.min(1, progress / 100);
    const active = G.bodyChamber?.activeTab === 'flesh';
    group.style.setProperty('--body-layer-fill', layerFill.toFixed(2));
    group.style.setProperty('--body-layer-color', def?.color || '#b87878');
    group.classList.toggle('body-sil-overlay-unlocked', unlocked);
    group.classList.toggle('body-sil-overlay-active', active);
    group.classList.toggle('body-sil-overlay-mid', progress >= 50);
    group.classList.toggle('body-sil-overlay-complete', progress >= 100);
    const tendonFill = getBodyTendonFill();
    const tendonsMaxed = isBodyTendonsMaxed();
    group.classList.toggle('body-sil-tendons-started', tendonFill >= 0.1);
    group.classList.toggle('body-sil-tendons-refined', tendonsMaxed || tendonFill >= 0.95);
    group.hidden = !unlocked || !isBodyTabActive('flesh');
    group.style.opacity = unlocked && isBodyTabActive('flesh') ? '1' : '0';
    if (group.dataset.muscleLayout !== BODY_MUSCLE_LAYOUT_VERSION) {
        group.replaceChildren();
        group.dataset.muscleLayout = BODY_MUSCLE_LAYOUT_VERSION;
        delete group.dataset.built;
    }
    if (!group.dataset.built) {
        BODY_MUSCLE_DEFS.forEach(m => {
            const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            el.setAttribute('class', m.kind === 'tendon' ? 'body-sil-tendon' : 'body-sil-muscle');
            el.setAttribute('data-muscle-id', m.id);
            el.setAttribute('data-flesh-action', m.action);
            el.setAttribute('d', m.d);
            if (m.kind === 'tendon') {
                el.setAttribute('fill', 'none');
                el.setAttribute('stroke-linecap', 'round');
            }
            group.appendChild(el);
        });
        group.dataset.built = '1';
    }
    group.querySelectorAll('.body-sil-muscle, .body-sil-tendon').forEach(el => {
        const muscleId = el.getAttribute('data-muscle-id');
        const muscleDef = BODY_MUSCLE_DEFS.find(m => m.id === muscleId);
        if (!muscleDef) return;
        if (muscleDef.kind === 'tendon') {
            const fill = tendonFill;
            el.style.setProperty('--tendon-fill', fill.toFixed(2));
            el.style.setProperty('--muscle-fill', fill.toFixed(2));
            el.classList.toggle('lit', fill >= 0.08);
            el.classList.toggle('mid', fill >= 0.4);
            el.classList.toggle('complete', fill >= 0.75);
            el.classList.toggle('refined', tendonsMaxed || fill >= 0.95);
            el.classList.toggle('guide', active && fill < 0.1);
            el.style.visibility = fill < 0.05 && !active ? 'hidden' : 'visible';
            return;
        }
        const fill = getBodyMuscleFill(muscleDef);
        el.style.setProperty('--muscle-fill', fill.toFixed(2));
        const showBase = active || fill >= 0.12;
        el.classList.toggle('lit', showBase);
        el.classList.toggle('mid', fill >= 0.45);
        el.classList.toggle('complete', fill >= 0.85);
    });
}

function renderBodyBoneOverlay() {
    const group = document.getElementById('bodySilBones');
    if (!group) return;
    applyBodyLayerOverlayState(group, 'bones');
    if (!isBodyTabActive('bones')) return;
    const active = true;
    if (group.dataset.boneLayout !== BODY_BONE_LAYOUT_VERSION) {
        group.replaceChildren();
        BODY_BONE_DEFS.forEach(b => {
            const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            el.setAttribute('class', `body-sil-bone body-sil-bone-${b.kind}`);
            el.setAttribute('data-bone-id', b.id);
            el.setAttribute('data-bone-action', b.action);
            el.setAttribute('d', b.d);
            if (b.kind !== 'marrow') {
                el.setAttribute('fill', 'none');
                el.setAttribute('stroke-linecap', 'round');
                el.setAttribute('stroke-linejoin', 'round');
            }
            group.appendChild(el);
        });
        group.dataset.boneLayout = BODY_BONE_LAYOUT_VERSION;
    }
    group.querySelectorAll('.body-sil-bone').forEach(el => {
        const boneId = el.getAttribute('data-bone-id');
        const boneDef = BODY_BONE_DEFS.find(b => b.id === boneId);
        if (!boneDef) return;
        const fill = getBodyActionFill('bones', boneDef.action);
        setBodyOverlayPartState(el, fill, active);
        if (boneDef.kind === 'marrow') {
            el.style.visibility = fill < 0.1 ? 'hidden' : 'visible';
        }
    });
}

function renderBodyOrganOverlay() {
    const group = document.getElementById('bodySilOrgans');
    if (!group) return;
    applyBodyLayerOverlayState(group, 'organs');
    if (!isBodyTabActive('organs')) return;
    const active = true;
    if (group.dataset.organLayout !== BODY_ORGAN_LAYOUT_VERSION) {
        group.replaceChildren();
        BODY_ORGAN_DEFS.forEach(o => {
            let el;
            if (o.type === 'ellipse') {
                el = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
                el.setAttribute('cx', String(o.cx));
                el.setAttribute('cy', String(o.cy));
                el.setAttribute('rx', String(o.rx));
                el.setAttribute('ry', String(o.ry));
            } else {
                el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                el.setAttribute('d', o.d);
            }
            el.setAttribute('class', 'body-sil-organ');
            el.setAttribute('data-organ-id', o.id);
            el.setAttribute('data-organ-action', o.action);
            group.appendChild(el);
        });
        group.dataset.organLayout = BODY_ORGAN_LAYOUT_VERSION;
    }
    group.querySelectorAll('.body-sil-organ').forEach(el => {
        const organId = el.getAttribute('data-organ-id');
        const organDef = BODY_ORGAN_DEFS.find(o => o.id === organId);
        if (!organDef) return;
        setBodyOverlayPartState(el, getBodyActionFill('organs', organDef.action), active);
    });
}

function renderBodyBloodOverlay() {
    const group = document.getElementById('bodySilBlood');
    if (!group) return;
    applyBodyLayerOverlayState(group, 'blood');
    if (!isBodyTabActive('blood')) return;
    const active = true;
    if (group.dataset.bloodLayout !== BODY_BLOOD_LAYOUT_VERSION) {
        group.replaceChildren();
        BODY_BLOOD_DEFS.forEach(b => {
            let el;
            if (b.type === 'ellipse') {
                el = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse');
                el.setAttribute('cx', String(b.cx));
                el.setAttribute('cy', String(b.cy));
                el.setAttribute('rx', String(b.rx));
                el.setAttribute('ry', String(b.ry));
            } else {
                el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                el.setAttribute('d', b.d);
                if (b.kind === 'blood-line') {
                    el.setAttribute('fill', 'none');
                    el.setAttribute('stroke-linecap', 'round');
                }
            }
            el.setAttribute('class', `body-sil-blood body-sil-${b.kind}`);
            el.setAttribute('data-blood-id', b.id);
            el.setAttribute('data-blood-action', b.action);
            group.appendChild(el);
        });
        group.dataset.bloodLayout = BODY_BLOOD_LAYOUT_VERSION;
    }
    group.querySelectorAll('.body-sil-blood').forEach(el => {
        const bloodId = el.getAttribute('data-blood-id');
        const bloodDef = BODY_BLOOD_DEFS.find(b => b.id === bloodId);
        if (!bloodDef) return;
        const fill = getBodyActionFill('blood', bloodDef.action);
        setBodyOverlayPartState(el, fill, active);
        if (bloodDef.kind === 'blood-glow' && bloodDef.action === 'bloodline') {
            el.style.visibility = getBodyLayerActionCount('blood', 'bloodline') > 0 ? 'visible' : 'hidden';
        }
    });
}

function renderBodyMeridianChannels() {
    const group = document.getElementById('bodySilMeridianChannels');
    if (!group) return;
    if (!isBodyTabActive('meridians')) {
        group.hidden = true;
        return;
    }
    group.hidden = !isBodyLayerUnlocked('meridians');
    if (group.hidden) return;
    if (!group.dataset.built) {
        BODY_MERIDIAN_STAR_POINTS.forEach(pt => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('class', 'body-sil-meridian-channel');
            line.setAttribute('data-meridian-index', String(pt.index));
            line.setAttribute('x1', '103');
            line.setAttribute('y1', '36');
            line.setAttribute('x2', String(pt.cx));
            line.setAttribute('y2', String(pt.cy));
            group.appendChild(line);
        });
        const orbit = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        orbit.setAttribute('class', 'body-sil-meridian-orbit');
        orbit.setAttribute('d', 'M 103,28 Q 118,64 103,100 Q 88,64 103,28');
        orbit.setAttribute('fill', 'none');
        group.appendChild(orbit);
        group.dataset.built = '1';
    }
    const microcosmic = getBodyLayerActionCount('meridians', 'microcosmic') > 0;
    group.querySelectorAll('.body-sil-meridian-channel').forEach(line => {
        const index = parseInt(line.getAttribute('data-meridian-index'), 10);
        const lit = isBodyMeridianStarLit(index);
        line.classList.toggle('lit', lit);
        line.style.setProperty('--channel-fill', lit ? '0.85' : '0.15');
    });
    const orbit = group.querySelector('.body-sil-meridian-orbit');
    if (orbit) {
        orbit.classList.toggle('lit', microcosmic);
        orbit.style.setProperty('--channel-fill', microcosmic ? '1' : '0');
    }
}

function renderBodyNerveOverlay() {
    const group = document.getElementById('bodySilNerves');
    if (!group) return;
    const refined = isBodyNervesRefined();
    applyBodyLayerOverlayState(group, 'nerves');
    group.classList.toggle('body-sil-nerves-refined', refined);
    if (!isBodyTabActive('nerves')) return;
    if (group.dataset.nerveLayout !== BODY_NERVE_LAYOUT_VERSION) {
        group.replaceChildren();
        BODY_NERVE_DEFS.forEach(n => {
            const el = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            el.setAttribute('class', 'body-sil-nerve-line');
            el.setAttribute('data-nerve-id', n.id);
            el.setAttribute('d', n.d);
            el.setAttribute('fill', 'none');
            el.setAttribute('stroke-linecap', 'round');
            el.setAttribute('stroke-width', String(n.sw));
            group.appendChild(el);
        });
        group.dataset.nerveLayout = BODY_NERVE_LAYOUT_VERSION;
    }
    const fill = refined ? 1 : getBodyLayerProgress('nerves') / 100;
    group.querySelectorAll('.body-sil-nerve-line').forEach(el => {
        el.style.setProperty('--part-fill', fill.toFixed(2));
        el.classList.toggle('lit', fill >= 0.1);
        el.classList.toggle('complete', refined);
    });
}

function pulseBodyOverlayPart(groupId, partId, attr, pulseClass) {
    const el = document.querySelector(`#${groupId} [${attr}="${partId}"]`);
    if (!el) return;
    el.classList.remove(pulseClass);
    void el.offsetWidth;
    el.classList.add(pulseClass);
    setTimeout(() => el.classList.remove(pulseClass), 900);
}

function pulseBodyMuscle(muscleId) {
    const el = document.querySelector(`#bodySilFleshMuscles [data-muscle-id="${muscleId}"]`);
    if (!el) return;
    const isTendon = el.classList.contains('body-sil-tendon');
    const pulseClass = isTendon ? 'body-sil-tendon-pulse' : 'body-sil-muscle-pulse';
    el.classList.remove('body-sil-muscle-pulse', 'body-sil-tendon-pulse');
    void el.offsetWidth;
    el.classList.add(pulseClass);
    setTimeout(() => el.classList.remove(pulseClass), 900);
}

function getBodyRegionTooltip(regionId) {
    const reg = BODY_SILHOUETTE_REGIONS[regionId];
    if (!reg) return '';
    const fillPct = Math.round(getBodyRegionRevealFill(regionId) * 100);
    const dominant = getBodyRegionDominantLayer(regionId);
    const layerLabel = BODY_CHAMBER_LAYERS[dominant.layerId]?.label || dominant.layerId;
    const lines = [`${reg.label} — ${fillPct}% refined`, `Strongest layer: ${layerLabel}`];
    const boneFill = getBodyRegionBoneFill(regionId);
    if (boneFill != null && isBodyLayerUnlocked('bones')) {
        const action = BODY_CHAMBER_ACTIONS.bones?.find(a => a.id === reg.boneAction);
        const count = getBodyLayerActionCount('bones', reg.boneAction);
        const max = action ? getBodyActionMaxStacks(action) : 3;
        lines.push(`Bones: ${action?.label || reg.boneAction} ×${count}/${max}`);
    }
    return lines.join('\n');
}

function focusBodyRegion(regionId) {
    const reg = BODY_SILHOUETTE_REGIONS[regionId];
    if (!reg) return;
    ensureBodyChamberState();
    const active = G.bodyChamber.activeTab;
    if (active === 'bones' && reg.boneAction) {
        highlightBodyChamberAction('bones', reg.boneAction);
        return;
    }
    if (isBodyRegionRelevantToTab(regionId, active)) return;
    if (reg.boneAction && isBodyLayerUnlocked('bones')) {
        setBodyChamberTab('bones');
        highlightBodyChamberAction('bones', reg.boneAction);
        return;
    }
    for (const layerId of reg.layers || []) {
        if (isBodyLayerUnlocked(layerId)) {
            if (layerId !== active) setBodyChamberTab(layerId);
            if (layerId === 'bones' && reg.boneAction) highlightBodyChamberAction('bones', reg.boneAction);
            return;
        }
    }
}

function highlightBodyChamberAction(layerId, actionId) {
    document.querySelectorAll('.body-chamber-action-highlight').forEach(el => {
        el.classList.remove('body-chamber-action-highlight');
    });
    const btn = document.querySelector(
        `.body-chamber-action-btn[data-layer="${layerId}"][data-action="${actionId}"]`
    );
    if (!btn) return;
    btn.classList.add('body-chamber-action-highlight');
    btn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    setTimeout(() => btn.classList.remove('body-chamber-action-highlight'), 2200);
}

function showBodySilTooltip(regionEl, evt) {
    const tip = document.getElementById('bodySilTooltip');
    if (!tip || !regionEl) return;
    const regionId = regionEl.dataset.region;
    tip.textContent = getBodyRegionTooltip(regionId);
    tip.hidden = false;
    const wrap = document.getElementById('bodySilhouetteWrap');
    if (!wrap) return;
    const wrapRect = wrap.getBoundingClientRect();
    const x = evt.clientX - wrapRect.left;
    const y = evt.clientY - wrapRect.top;
    tip.style.left = `${Math.min(Math.max(x + 12, 8), wrapRect.width - 8)}px`;
    tip.style.top = `${Math.max(y - 8, 8)}px`;
}

function hideBodySilTooltip() {
    const tip = document.getElementById('bodySilTooltip');
    if (tip) tip.hidden = true;
}

function renderBodySilhouette() {
    const active = getBodyActiveTab();
    const wrap = document.getElementById('bodySilhouetteWrap');
    if (wrap) {
        wrap.dataset.activeLayer = active;
        wrap.classList.add('body-sil-isolated');
        BODY_CHAMBER_LAYER_ORDER.forEach(id => wrap.classList.toggle(`body-sil-tab-${id}`, id === active));
    }
    document.querySelectorAll('.body-sil-region').forEach(el => {
        const regionId = el.dataset.region;
        const reg = BODY_SILHOUETTE_REGIONS[regionId];
        if (!reg) return;
        const fill = getBodyRegionRevealFill(regionId);
        const dominant = getBodyRegionDominantLayer(regionId);
        el.style.setProperty('--region-fill', fill.toFixed(2));
        el.style.setProperty('--region-color', dominant.color);
        el.style.setProperty('--region-layer', dominant.layerId);
        el.setAttribute('aria-label', `${reg.label}: ${Math.round(fill * 100)}% refined`);
    });
    renderBodySkinUnified();
    renderBodyMuscleOverlay();
    renderBodyBoneOverlay();
    renderBodyOrganOverlay();
    renderBodyBloodOverlay();
    renderBodyMeridianStars();
    renderBodyMeridianChannels();
    renderBodyNerveOverlay();
}

function renderBodyChamberTabs() {
    const nav = document.getElementById('bodyChamberTabs');
    if (!nav) return;
    nav.replaceChildren();
    BODY_CHAMBER_LAYER_ORDER.forEach(layerId => {
        const def = BODY_CHAMBER_LAYERS[layerId];
        const unlocked = isBodyLayerUnlocked(layerId);
        const progress = layerId === 'nerves' && isBodyNervesRefined()
            ? 100
            : Math.round(getBodyLayerProgress(layerId));
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'body-chamber-tab' + (layerId === G.bodyChamber.activeTab ? ' active' : '')
            + (unlocked ? '' : ' locked');
        btn.disabled = !unlocked;
        btn.innerHTML = `${def.emoji} ${def.label}<span class="body-tab-pct">${unlocked ? progress + '%' : '🔒'}</span>`;
        btn.title = unlocked
            ? `${def.label}: ${progress}% refined`
            : `Unlock at ${def.unlockPrevPct}% of ${BODY_CHAMBER_LAYERS[getBodyLayerPrevId(layerId)]?.label || 'previous layer'}`;
        btn.addEventListener('click', () => setBodyChamberTab(layerId));
        nav.appendChild(btn);
    });
}

function renderBodyChamberActions() {
    const panel = document.getElementById('bodyChamberActions');
    if (!panel) return;
    const tab = G.bodyChamber.activeTab;
    const def = BODY_CHAMBER_LAYERS[tab];
    const actions = BODY_CHAMBER_ACTIONS[tab];
    panel.replaceChildren();
    const head = document.createElement('div');
    head.className = 'body-chamber-tab-head';
    head.innerHTML = `<h3>${def.emoji} ${def.label}</h3><p class="body-chamber-tab-desc">${BODY_LAYER_TAB_DESC[tab] || 'Refine this layer of your physical form.'}</p>`;
    panel.appendChild(head);
    if (!actions?.length) {
        const stub = document.createElement('p');
        stub.className = 'body-chamber-stub';
        stub.textContent = `${def.label} cultivation actions arrive in a future phase.`;
        panel.appendChild(stub);
        return;
    }
    if (tab === 'nerves' && isBodyNervesRefined()) {
        const done = document.createElement('div');
        done.className = 'body-chamber-complete-banner';
        done.innerHTML = '<span class="body-complete-emoji">⚡</span><div><strong>Nerve Sea refined</strong>'
            + '<p>Lightning reflexes and spirit perception are yours. The body chamber\'s final gate stands open.</p></div>';
        panel.appendChild(done);
        return;
    }
    const standard = actions.filter(a => !a.sub);
    const subs = actions.filter(a => a.sub);
    standard.forEach(action => appendBodyActionButton(panel, tab, action));
    const lockedSub = subs.find(a => !isBodySubUnlocked(a.sub, tab));
    const unlockedSubs = subs.filter(a => isBodySubUnlocked(a.sub, tab));
    if (lockedSub && !unlockedSubs.length) {
        const hint = document.createElement('p');
        hint.className = 'body-chamber-sub-hint';
        const hintFn = BODY_SUB_HINTS[lockedSub.sub];
        hint.textContent = hintFn ? hintFn(lockedSub)
            : `🔒 ${lockedSub.label} unlocks at 50% ${def.label}.`;
        panel.appendChild(hint);
    }
    if (unlockedSubs.length) {
        const subHead = document.createElement('div');
        subHead.className = 'body-chamber-sub-head';
        subHead.textContent = 'Sub-Systems';
        panel.appendChild(subHead);
        unlockedSubs.forEach(action => appendBodyActionButton(panel, tab, action, true));
    }
}

function appendBodyActionButton(panel, layerId, action, isSub) {
    const count = getBodyLayerActionCount(layerId, action.id);
    const block = getBodyActionBlockReason(layerId, action);
    const wrap = document.createElement('div');
    wrap.className = 'action-card-wrap body-chamber-action-wrap';
    const btn = document.createElement('button');
    btn.type = 'button';
    const maxStacks = getBodyActionMaxStacks(action);
    const atMax = count >= maxStacks;
    btn.className = 'body-chamber-action-btn'
        + (isSub ? ' body-chamber-action-sub' : '')
        + (action.once ? ' body-chamber-action-once' : '')
        + (atMax ? ' body-chamber-action-maxed' : '');
    btn.dataset.layer = layerId;
    btn.dataset.action = action.id;
    btn.disabled = bodyChamberActionBlocked() || !!block;
    const flavor = typeof getBodyActionFlavor === 'function'
        ? getBodyActionFlavor(layerId, action)
        : action.desc;
    if (typeof setHoverTooltip === 'function') setHoverTooltip(btn, block || action.desc);
    else btn.title = block || action.desc;
    btn.innerHTML = `<span class="body-action-label">${action.emoji} ${action.label}</span>`
        + `<span class="body-action-meta body-action-flavor">${block ? block : flavor}</span>`;
    btn.addEventListener('click', () => runBodyChamberAction(layerId, action.id));
    wrap.appendChild(btn);
    if (typeof createActionHelpBtn === 'function') {
        wrap.appendChild(createActionHelpBtn({
            className: 'body-chamber-action-help',
            title: `${action.emoji} ${action.label}`,
            desc: action.desc,
            getBlock: () => getBodyActionBlockReason(layerId, action),
            getStats: () => formatBodyChamberActionStats(layerId, action)
        }));
    }
    panel.appendChild(wrap);
}

let _bodyVesselRuleReleaseConfirmOpen = false;

function renderBodyVesselRuleSection() {
    const panel = document.getElementById('bodyVesselRuleSection');
    if (!panel || typeof ensureVesselRuleState !== 'function') return;
    ensureVesselRuleState();
    panel.replaceChildren();
    _bodyVesselRuleReleaseConfirmOpen = false;

    const head = document.createElement('div');
    head.className = 'body-vessel-rule-head';
    head.innerHTML = '<strong>⚖️ Vessel Rule</strong>'
        + '<span class="body-vessel-rule-sub">One sworn oath upon the flesh — defining, hard to change.</span>';
    panel.appendChild(head);
    if (typeof createActionHelpBtn === 'function') {
        const guide = typeof CULTIVATION_ACTION_GUIDE !== 'undefined' ? CULTIVATION_ACTION_GUIDE.vesselRules : null;
        if (guide) {
            head.appendChild(createActionHelpBtn({
                className: 'body-vessel-rule-help',
                title: `${guide.emoji} ${guide.label}`,
                desc: guide.desc,
                stats: [guide.flavor]
            }));
        }
    }

    if (hasVesselRule()) {
        renderBodyVesselRuleActive(panel);
    } else {
        renderBodyVesselRuleSwearList(panel);
    }
}

function renderBodyVesselRuleActive(panel) {
    const def = getActiveVesselRuleDef();
    if (!def) return;
    const pct = Math.round(getVesselRuleProgressionPct());
    const card = document.createElement('div');
    card.className = 'body-vessel-rule-card body-vessel-rule-active';
    let mechanicsHtml = '';
    if (def.implemented && def.id === 'blood') {
        const bal = typeof RULE_OF_BLOOD_BALANCE !== 'undefined' ? RULE_OF_BLOOD_BALANCE : null;
        const soulPct = typeof getVesselRuleSoulContestPct === 'function'
            ? Math.round(getVesselRuleSoulContestPct() * 100) : 0;
        const bloodiedHp = bal ? Math.round(bal.bloodiedHpPct * 100) : 65;
        const dmgBoost = bal ? Math.round((bal.bloodiedDamageMult - 1) * 100) : 8;
        const drPct = bal ? Math.round(bal.bloodiedDamageReductionPct * 100) : 10;
        mechanicsHtml = `<div class="body-vessel-rule-mechanics">
            <p><strong>Bloodied</strong> — below ~${bloodiedHp}% HP, bleeding, or heavy damage this fight: +${dmgBoost}% strike damage, −${drPct}% damage taken.</p>
            <p><strong>Seal Blood</strong> — combat action: stop bleed ticks without healing. Costs stamina; short cooldown.</p>
            <p><strong>Sacrifice</strong> — no HP regen or healing in combat while sworn.</p>
            <p class="body-vessel-rule-soul">Soul contest: ${soulPct}% (scales with progression)</p>
        </div>`;
    } else if (!def.implemented) {
        mechanicsHtml = '<p class="body-vessel-rule-stub">Rule sworn — mechanics arrive in a future update.</p>';
    }
    card.innerHTML = `<div class="body-vessel-rule-name">${def.emoji} ${def.name}</div>`
        + `<blockquote class="body-vessel-rule-oath">"${def.oath}"</blockquote>`
        + `<div class="body-vessel-rule-progress-label">Rule progression — ${pct}%</div>`
        + `<div class="body-chamber-bar-track body-vessel-rule-progress-track">`
        + `<div class="body-chamber-bar-fill body-vessel-rule-progress-fill" style="width:${pct}%"></div></div>`
        + mechanicsHtml;
    panel.appendChild(card);

    const releaseWrap = document.createElement('div');
    releaseWrap.className = 'body-vessel-rule-release-wrap';
    const releaseBtn = document.createElement('button');
    releaseBtn.type = 'button';
    releaseBtn.className = 'body-chamber-action-btn body-vessel-rule-release-btn';
    releaseBtn.textContent = '💔 Release Rule';
    releaseBtn.disabled = vesselRuleActionBlocked();
    releaseBtn.addEventListener('click', () => showBodyVesselRuleReleaseConfirm(releaseWrap));
    releaseWrap.appendChild(releaseBtn);
    panel.appendChild(releaseWrap);
}

function showBodyVesselRuleReleaseConfirm(releaseWrap) {
    if (_bodyVesselRuleReleaseConfirmOpen) return;
    const check = canReleaseVesselRule();
    if (!check.ok) {
        addLog(`⚖️ ${check.reason}`);
        return;
    }
    const def = getActiveVesselRuleDef();
    _bodyVesselRuleReleaseConfirmOpen = true;
    const confirm = document.createElement('div');
    confirm.className = 'body-vessel-rule-confirm';
    confirm.innerHTML = `<p class="body-vessel-rule-confirm-warn">${def?.releaseWarning || 'You will regress to the start of your current vessel realm and lose all Rule progression.'}</p>`
        + `<p class="body-vessel-rule-confirm-detail">You will regress to the start of your current vessel realm and lose all Rule progression.</p>`
        + `<div class="body-vessel-rule-confirm-btns">`
        + `<button type="button" class="body-vessel-rule-confirm-yes">Break the oath</button>`
        + `<button type="button" class="body-vessel-rule-confirm-no">Keep the Rule</button>`
        + `</div>`;
    releaseWrap.appendChild(confirm);
    confirm.querySelector('.body-vessel-rule-confirm-yes')?.addEventListener('click', () => {
        _bodyVesselRuleReleaseConfirmOpen = false;
        const result = releaseVesselRule();
        if (result?.message && !result.logged) addLog(result.message);
        renderBodyChamberUI();
        fullRender();
    });
    confirm.querySelector('.body-vessel-rule-confirm-no')?.addEventListener('click', () => {
        _bodyVesselRuleReleaseConfirmOpen = false;
        confirm.remove();
    });
}

function renderBodyVesselRuleSwearList(panel) {
    if (typeof VESSEL_RULES === 'undefined') return;
    if (isVesselRuleCooldownActive()) {
        const months = getVesselRuleCooldownRemainingMonths();
        const hint = document.createElement('p');
        hint.className = 'body-vessel-rule-cooldown';
        hint.textContent = `The flesh still remembers your broken oath — ${months} months before you may swear again.`;
        panel.appendChild(hint);
        return;
    }
    const list = document.createElement('div');
    list.className = 'body-vessel-rule-list';
    Object.values(VESSEL_RULES).forEach(rule => {
        const gate = canSwearVesselRule(rule.id);
        const gateDetail = checkVesselRuleSwearGate(rule.id);
        const unlocked = gateDetail.ok && !hasVesselRule();
        const card = document.createElement('div');
        card.className = 'body-vessel-rule-card' + (unlocked ? '' : ' locked');
        const bal = typeof VESSEL_RULE_BALANCE !== 'undefined' ? VESSEL_RULE_BALANCE : { swearMonths: 6 };
        const statusLine = unlocked
            ? `${formatVesselRuleGateReason(rule.swearGate)} — ready`
            : (gate.reason || gateDetail.reason || formatVesselRuleGateReason(rule.swearGate));
        card.innerHTML = `<div class="body-vessel-rule-name">${rule.emoji} ${rule.name}${unlocked ? '' : ' 🔒'}</div>`
            + `<p class="body-vessel-rule-oath-preview">"${rule.oath}"</p>`
            + `<p class="body-vessel-rule-gate">${statusLine}</p>`;
        if (unlocked) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'body-chamber-action-btn body-vessel-rule-swear-btn';
            btn.disabled = bodyChamberActionBlocked() || !gate.ok;
            btn.innerHTML = `<span class="body-action-label">⚖️ Swear ${rule.name}</span>`
                + `<span class="body-action-meta">${bal.swearMonths} months</span>`;
            btn.addEventListener('click', () => {
                const result = swearVesselRule(rule.id);
                if (result?.message && !result.logged) addLog(result.message);
                renderBodyChamberUI();
                fullRender();
            });
            card.appendChild(btn);
        }
        list.appendChild(card);
    });
    panel.appendChild(list);
}

function renderBodyPhysiqueProject() {
    const panel = document.getElementById('bodyPhysiqueProject');
    if (!panel || typeof ensurePhysiqueCultivationState !== 'function') return;
    ensurePhysiqueCultivationState();
    const pc = G.physiqueCultivation;
    if (!pc.id) {
        panel.hidden = true;
        panel.replaceChildren();
        return;
    }
    const def = typeof getPhysiqueDefById === 'function' ? getPhysiqueDefById(pc.id) : null;
    if (!def) {
        panel.hidden = true;
        return;
    }
    panel.hidden = false;
    const bal = typeof getPhysiqueCultivationBalance === 'function' ? getPhysiqueCultivationBalance() : {};
    const stageName = typeof getPhysiqueStageName === 'function' ? getPhysiqueStageName(pc.stage) : `Stage ${pc.stage}`;
    const mult = typeof getPhysiqueBonusMultiplier === 'function'
        ? Math.round(getPhysiqueBonusMultiplier(pc.stage, pc.progress) * 100) : 0;
    const std = bal.standardRefine || { weeks: 6, progress: 12, label: 'Standard Refinement' };
    const cat = bal.catalystRefine || { weeks: 3, progress: 22, label: 'Catalyst Refinement' };
    const catalystCost = typeof getPhysiqueCatalystCost === 'function' ? getPhysiqueCatalystCost(def) : null;
    const matLine = typeof formatPhysiqueMaterialCost === 'function' ? formatPhysiqueMaterialCost(catalystCost) : '';
    const stdBlock = typeof getPhysiqueRefineBlockReason === 'function' ? getPhysiqueRefineBlockReason('standard') : null;
    const catBlock = typeof getPhysiqueRefineBlockReason === 'function' ? getPhysiqueRefineBlockReason('catalyst') : null;
    const layers = (def.focusLayers || []).map(id => BODY_CHAMBER_LAYERS[id]?.label || id).join(', ');
    panel.innerHTML = `<div class="body-physique-project-head">
            <strong>🧬 Physique Project — ${def.name}</strong>
            <span class="body-physique-stage">${stageName} · Stage ${pc.stage}/${bal.maxStages || 4} · ${Math.round(pc.progress)}% · ~${mult}% power</span>
        </div>
        <div class="body-chamber-bar-track body-physique-progress-track"><div class="body-chamber-bar-fill body-physique-progress-fill" style="width:${Math.min(100, pc.progress)}%"></div></div>
        <p class="body-physique-focus">Layer work on ${layers} also advances this project (+${bal.bodyActionProgress || 4}% each).</p>
        <div class="body-physique-refine-btns">
            <button type="button" class="body-chamber-action-btn body-physique-refine-btn" id="bodyPhysiqueRefineStd" ${stdBlock ? 'disabled' : ''} title="${stdBlock || std.label}">
                <span class="body-action-label">🧘 ${std.label || 'Standard Refinement'}</span>
                <span class="body-action-meta">+${std.progress}% · ${std.weeks} wk</span>
            </button>
            <button type="button" class="body-chamber-action-btn body-physique-refine-btn body-physique-catalyst-btn" id="bodyPhysiqueRefineCat" ${catBlock ? 'disabled' : ''} title="${catBlock || cat.label}">
                <span class="body-action-label">⚗️ ${cat.label || 'Catalyst Refinement'}</span>
                <span class="body-action-meta">+${cat.progress}% · ${cat.weeks} wk${matLine ? ' · ' + matLine : ''}</span>
            </button>
        </div>`;
    document.getElementById('bodyPhysiqueRefineStd')?.addEventListener('click', () => {
        const result = typeof refinePhysiqueStandard === 'function' ? refinePhysiqueStandard() : null;
        if (result?.message && !result.logged) addLog(result.message);
        renderBodyChamberUI();
        fullRender();
    });
    document.getElementById('bodyPhysiqueRefineCat')?.addEventListener('click', () => {
        const result = typeof refinePhysiqueCatalyst === 'function' ? refinePhysiqueCatalyst() : null;
        if (result?.message && !result.logged) addLog(result.message);
        renderBodyChamberUI();
        fullRender();
    });
}

function renderBodyChamberUI() {
    if (!G.inBodyChamber) return;
    ensureBodyChamberState();
    renderBodyPhysiqueProject();
    if (typeof renderBodyVesselRuleSection === 'function') renderBodyVesselRuleSection();
    const tab = G.bodyChamber.activeTab;
    const progress = tab === 'nerves' && isBodyNervesRefined() ? 100 : getBodyLayerProgress(tab);
    const def = BODY_CHAMBER_LAYERS[tab];
    const label = document.getElementById('bodyLayerProgressLabel');
    const bar = document.getElementById('bodyLayerProgressBar');
    if (label) label.textContent = `${def.label} — ${Math.round(progress)}%`;
    if (bar) bar.style.width = `${Math.min(100, progress)}%`;
    if (bar) bar.style.background = `linear-gradient(90deg, ${def.color}88, ${def.color})`;
    renderBodyChamberTabs();
    renderBodyChamberActions();
    renderBodySilhouette();
    const summary = document.getElementById('bodyChamberBonusSummary');
    if (summary) {
        const b = getBodyChamberBonuses();
        const parts = [];
        if (isBodyNervesRefined()) parts.push('⚡ Nerve Sea');
        if (b.physicalDefensePct) parts.push(`🛡️ ${b.physicalDefensePct}% def`);
        if (b.elementalResistPct) parts.push(`💎 ${b.elementalResistPct}% elem`);
        if (b.maxHpPct) parts.push(`❤️ ${b.maxHpPct}% HP`);
        if (b.physicalDamagePct) parts.push(`💥 ${b.physicalDamagePct}% dmg`);
        if (b.techniqueEfficiencyPct) parts.push(`🎯 ${b.techniqueEfficiencyPct}% tech`);
        if (b.hpRegenPct) parts.push(`🩹 ${b.hpRegenPct}% regen`);
        if (b.evasionPct) parts.push(`💨 ${b.evasionPct}% eva`);
        if (b.flatHp) parts.push(`+${b.flatHp} HP`);
        if (b.qiEfficiencyPct) parts.push(`⚡ ${b.qiEfficiencyPct}% Qi eff`);
        if (b.vitalityPct) parts.push(`💪 ${b.vitalityPct}% vit`);
        if (b.poisonResistPct) parts.push(`🐍 ${b.poisonResistPct}% poison`);
        if (b.qiRegenPct) parts.push(`🌬️ ${b.qiRegenPct}% Qi regen`);
        if (b.lifeStealPct) parts.push(`🩸 ${b.lifeStealPct}% steal`);
        if (b.bloodDmgPct) parts.push(`🐉 ${b.bloodDmgPct}% blood`);
        summary.textContent = parts.length ? parts.join(' · ') : 'No body refinements yet.';
    }
}

function runBodyChamberAction(layerId, actionId) {
    if (bodyChamberActionBlocked()) return;
    if (!isBodyLayerUnlocked(layerId)) return;
    const actions = BODY_CHAMBER_ACTIONS[layerId];
    const action = actions?.find(a => a.id === actionId);
    if (!action) return;
    const block = getBodyActionBlockReason(layerId, action);
    if (block) {
        addLog(`💪 ${block}`);
        renderBodyChamberUI();
        return;
    }
    ensureBodyChamberState();
    const prevProgress = G.bodyChamber.layerProgress[layerId] || 0;
    beginActionLog();
    if (!advanceChamberWeeks(action.weeks, `${action.label} — ${BODY_CHAMBER_LAYERS[layerId].label}`)) {
        cancelActionLog();
        renderBodyChamberUI();
        return;
    }
    const materialCosts = getBodyActionMaterialCosts(action);
    if (materialCosts) {
        if (typeof removeCraftMaterials !== 'function' || !removeCraftMaterials(materialCosts)) {
            cancelActionLog();
            addLog('💪 Required materials missing — refinement fails.');
            renderBodyChamberUI();
            return;
        }
    }
    applyBodyChamberBonusDelta(action.bonus);
    let meridianOpened = false;
    if (action.meridianIndex != null) {
        meridianOpened = openBodyChamberMeridian(action.meridianIndex);
    }
    const key = `${layerId}:${actionId}`;
    G.bodyChamber.actionCounts[key] = (G.bodyChamber.actionCounts[key] || 0) + 1;
    G.bodyChamber.layerProgress[layerId] = Math.min(100,
        (G.bodyChamber.layerProgress[layerId] || 0) + (action.progress || 10));
    if (action.once && layerId === 'nerves') {
        G.bodyChamber.nervesRefined = true;
        G.bodyChamber.layerProgress.nerves = 100;
    }
    triggerBodySilhouettePulse(layerId, actionId);
    const layerPct = Math.round(G.bodyChamber.layerProgress[layerId]);
    const bonusText = formatBodyBonusDelta(action.bonus);
    let msg = `💪 ${action.label} complete. ${bonusText} · ${BODY_CHAMBER_LAYERS[layerId].label} ${layerPct}%.`;
    if (meridianOpened && action.meridianIndex != null) {
        const mName = typeof getMeridianName === 'function' ? getMeridianName(action.meridianIndex) : 'Meridian';
        const mIcon = typeof getMeridianIcon === 'function' ? getMeridianIcon(action.meridianIndex) : '☯️';
        const maxQi = typeof getMaxQi === 'function' ? getMaxQi() : G.maxQi;
        msg += ` ${mIcon} ${mName} channel opened! Max Qi → ${maxQi}.`;
    }
    if (prevProgress < 50 && layerPct >= 50) {
        const nextIdx = BODY_CHAMBER_LAYER_ORDER.indexOf(layerId) + 1;
        if (nextIdx < BODY_CHAMBER_LAYER_ORDER.length) {
            const nextDef = BODY_CHAMBER_LAYERS[BODY_CHAMBER_LAYER_ORDER[nextIdx]];
            msg += ` ${nextDef.emoji} ${nextDef.label} layer unlocked!`;
        }
        if (layerId === 'bones' && action.sub !== 'marrow') {
            msg += ' 🩸 Marrow sub-system unlocked!';
            G.bodyChamber.subUnlocked.marrow = true;
        }
        if (layerId === 'blood' && action.sub !== 'bloodline') {
            msg += ' 🐉 Bloodline sub-system unlocked!';
            G.bodyChamber.subUnlocked.bloodline = true;
        }
        if (layerId === 'meridians' && action.sub !== 'microcosmic') {
            msg += ' 🌀 Microcosmic Orbit unlocked!';
            G.bodyChamber.subUnlocked.microcosmic = true;
        }
    }
    if (action.sub === 'marrow') G.bodyChamber.subUnlocked.marrow = true;
    if (action.sub === 'bloodline') G.bodyChamber.subUnlocked.bloodline = true;
    if (action.sub === 'microcosmic') G.bodyChamber.subUnlocked.microcosmic = true;
    if (action.once && layerId === 'nerves') {
        msg += ' ⚡ The Nerve Sea is refined — your body cultivation reaches its apex!';
        const fameGain = (typeof BODY_CHAMBER_BALANCE !== 'undefined' ? BODY_CHAMBER_BALANCE.nervesFame : null) || 5;
        if (typeof addFame === 'function') addFame(fameGain);
        else G.fame = (G.fame || 0) + fameGain;
    }
    const physiqueNote = typeof onBodyChamberPhysiqueHook === 'function' ? onBodyChamberPhysiqueHook(layerId) : null;
    if (physiqueNote) msg += ` ${physiqueNote}`;
    if (layerId === 'blood' && typeof isRuleOfBloodActive === 'function' && isRuleOfBloodActive()) {
        const bloodBal = typeof RULE_OF_BLOOD_BALANCE !== 'undefined' ? RULE_OF_BLOOD_BALANCE : null;
        if (bloodBal && typeof grantVesselRuleProgression === 'function') {
            grantVesselRuleProgression(bloodBal.progressionPerBloodChamberAction, 'bloodChamber');
        }
    }
    commitActionLog(msg);
    if (G.hp != null && typeof getEffectiveMaxHp === 'function') {
        G.hp = Math.min(getEffectiveMaxHp(), G.hp);
    }
    renderBodyChamberUI();
    fullRender();
}

function pulseBodyRegionShapes(regionId) {
    const el = document.querySelector(`.body-sil-region[data-region="${regionId}"]`);
    if (!el) return;
    const shape = el.querySelector('.body-sil-shape');
    if (!shape) return;
    shape.classList.remove('body-sil-shape-pulse');
    void shape.offsetWidth;
    shape.classList.add('body-sil-shape-pulse');
    setTimeout(() => shape.classList.remove('body-sil-shape-pulse'), 900);
}

function pulseBodySkinUnified() {
    const shape = document.querySelector('.body-sil-skin-full');
    if (!shape) return;
    shape.classList.remove('body-sil-shape-pulse');
    void shape.offsetWidth;
    shape.classList.add('body-sil-shape-pulse');
    setTimeout(() => shape.classList.remove('body-sil-shape-pulse'), 900);
}

function pulseBodyMeridianStar(index) {
    const star = document.querySelector(`.body-sil-meridian-star[data-meridian-index="${index}"]`);
    if (!star) return;
    star.classList.remove('body-sil-star-pulse');
    void star.offsetWidth;
    star.classList.add('body-sil-star-pulse');
    setTimeout(() => star.classList.remove('body-sil-star-pulse'), 900);
}

function triggerBodySilhouettePulse(layerId, actionId) {
    const key = actionId ? `${layerId}:${actionId}` : null;
    if (layerId === 'meridians' && actionId) {
        const action = BODY_CHAMBER_ACTIONS.meridians?.find(a => a.id === actionId);
        if (action?.meridianIndex != null) {
            pulseBodyMeridianStar(action.meridianIndex);
            return;
        }
    }
    if (layerId === 'nerves') {
        document.querySelectorAll('#bodySilNerves .body-sil-nerve-line').forEach(line => {
            line.classList.remove('body-sil-shape-pulse');
            void line.offsetWidth;
            line.classList.add('body-sil-shape-pulse');
            setTimeout(() => line.classList.remove('body-sil-shape-pulse'), 900);
        });
        return;
    }
    if (layerId === 'flesh' && actionId) {
        const muscleIds = BODY_FLESH_ACTION_MUSCLES[`flesh:${actionId}`];
        if (muscleIds?.length) {
            muscleIds.forEach(id => pulseBodyMuscle(id));
            return;
        }
    }
    if (layerId === 'skin') {
        pulseBodySkinUnified();
        return;
    }
    if (layerId === 'bones' && actionId) {
        const parts = BODY_BONE_ACTION_PARTS[`bones:${actionId}`];
        if (parts?.length) {
            parts.forEach(id => pulseBodyOverlayPart('bodySilBones', id, 'data-bone-id', 'body-sil-bone-pulse'));
            return;
        }
    }
    if (layerId === 'organs' && actionId) {
        const parts = BODY_ORGAN_ACTION_PARTS[`organs:${actionId}`];
        if (parts?.length) {
            parts.forEach(id => pulseBodyOverlayPart('bodySilOrgans', id, 'data-organ-id', 'body-sil-organ-pulse'));
            return;
        }
    }
    if (layerId === 'blood' && actionId) {
        const parts = BODY_BLOOD_ACTION_PARTS[`blood:${actionId}`];
        if (parts?.length) {
            parts.forEach(id => pulseBodyOverlayPart('bodySilBlood', id, 'data-blood-id', 'body-sil-blood-pulse'));
            return;
        }
    }
    if (layerId === 'meridians' && actionId === 'microcosmic') {
        const orbit = document.querySelector('.body-sil-meridian-orbit');
        if (orbit) {
            orbit.classList.remove('body-sil-star-pulse');
            void orbit.offsetWidth;
            orbit.classList.add('body-sil-star-pulse');
            setTimeout(() => orbit.classList.remove('body-sil-star-pulse'), 900);
        }
        return;
    }
    let regions = key && BODY_ACTION_TO_REGIONS[key];
    if (!regions) return;
    if (regions?.length) {
        regions.forEach(regionId => pulseBodyRegionShapes(regionId));
    }
}

// ----- Combat / stat hooks -----

function getBodyChamberDefensePct() {
    return getBodyChamberBonus('physicalDefensePct') + getBodyChamberBonus('resiliencePct');
}

function getBodyChamberEvasionBonus() {
    return getBodyChamberBonus('evasionPct')
        + Math.floor(getBodyChamberBonus('speedPct') * 0.35)
        + Math.floor(getBodyChamberBonus('mobilityPct') * 0.3);
}

function getBodyChamberFlatHp() {
    return getBodyChamberBonus('flatHp');
}

function getBodyChamberTechniqueCostMult() {
    const reduce = getBodyChamberBonus('staminaEfficiencyPct')
        + getBodyChamberBonus('qiEfficiencyPct')
        + getBodyChamberBonus('attackSpeedPct') * 0.5;
    return Math.max(0.75, 1 - reduce / 250);
}

function getBodyChamberTechniquePrecisionMult() {
    const bonus = getBodyChamberBonus('techniquePrecisionPct') + getBodyChamberBonus('posturePct') * 0.35;
    return 1 + bonus / 100;
}

function getBodyChamberWillBonus() {
    return Math.floor(getBodyChamberBonus('willpowerPct') / 3);
}

function getBodyChamberFearResistPct() {
    return getBodyChamberBonus('fearResistPct');
}

function getBodyChamberQiEfficiencyMult() {
    return 1 + getBodyChamberBonus('qiEfficiencyPct') / 100;
}

function getBodyChamberElementalResistPct() {
    return getBodyChamberBonus('elementalResistPct');
}

function getBodyChamberMaxHpMult() {
    return 1 + getBodyChamberBonus('maxHpPct') / 100;
}

function getBodyChamberPhysicalDmgMult() {
    return 1 + getBodyChamberBonus('physicalDamagePct') / 100;
}

function getBodyChamberTechniqueEfficiencyMult() {
    return 1 + getBodyChamberBonus('techniqueEfficiencyPct') / 100;
}

function getBodyChamberHpRegenMult() {
    return 1 + getBodyChamberBonus('hpRegenPct') / 100;
}

function getBodyChamberVitalityMult() {
    return 1 + getBodyChamberBonus('vitalityPct') / 100;
}

function getBodyChamberEffectiveVitality() {
    return Math.max(1, Math.floor(G.vitality * getBodyChamberVitalityMult()));
}

function getBodyChamberQiRegenMult() {
    return 1 + getBodyChamberBonus('qiRegenPct') / 100;
}

function getBodyChamberStaminaRegenMult() {
    return 1 + getBodyChamberBonus('staminaRegenPct') / 100;
}

function getBodyChamberPoisonResistPct() {
    return getBodyChamberBonus('poisonResistPct');
}

function getBodyChamberDiseaseResistPct() {
    return getBodyChamberBonus('diseaseResistPct');
}

function isPoisonSourceEnemy(enemy) {
    if (!enemy?.name) return false;
    return /venom|poison|serpent|snake|toxic|miasma/i.test(enemy.name);
}

function getBodyChamberCombatDmgMult() {
    let mult = 1;
    const hpCap = typeof getEffectiveMaxHp === 'function' ? getEffectiveMaxHp() : G.maxHp;
    if (G.hp / Math.max(1, hpCap) < 0.5 && getBodyChamberBonus('lowHpDmgPct')) {
        mult += getBodyChamberBonus('lowHpDmgPct') / 100;
    }
    if (G.enemy && typeof isDemonicEnemy === 'function' && isDemonicEnemy(G.enemy.name) && getBodyChamberBonus('demonDmgPct')) {
        mult += getBodyChamberBonus('demonDmgPct') / 100;
    }
    return mult;
}

function getBodyChamberBloodTechniqueMult(tech) {
    if (!tech || !getBodyChamberBonus('bloodDmgPct')) return 1;
    const meta = typeof getTechniqueMeta === 'function' ? getTechniqueMeta(tech) : null;
    if (meta?.element !== 'blood') return 1;
    return 1 + getBodyChamberBonus('bloodDmgPct') / 100;
}

function applyBodyChamberLifeSteal(dmg) {
    const pct = getBodyChamberBonus('lifeStealPct');
    if (!pct || dmg < 1) return 0;
    const heal = Math.max(1, Math.floor(dmg * pct / 100));
    if (G.inCombat && typeof tryCombatPlayerHeal === 'function') {
        return tryCombatPlayerHeal(heal, { lifesteal: true });
    }
    const hpCap = typeof getEffectiveMaxHp === 'function' ? getEffectiveMaxHp() : G.maxHp;
    const hpBefore = G.hp;
    G.hp = Math.min(hpCap, G.hp + heal);
    return G.hp - hpBefore;
}

function applyBodyChamberPhysicalDmg(dmg, tech) {
    if (!dmg || dmg < 1) return dmg;
    if (typeof getBodyChamberPhysicalDmgMult !== 'function') return dmg;
    const mult = getBodyChamberPhysicalDmgMult();
    if (mult <= 1) return dmg;
    if (!tech) return Math.max(1, Math.floor(dmg * mult));
    const meta = typeof getTechniqueMeta === 'function' ? getTechniqueMeta(tech) : null;
    if (meta?.path === 'body' || meta?.path === 'neutral') {
        return Math.max(1, Math.floor(dmg * mult));
    }
    return dmg;
}

function initBodySilhouetteEvents() {
    const wrap = document.getElementById('bodySilhouetteWrap');
    if (!wrap || bodySilhouetteEventsBound) return;
    bodySilhouetteEventsBound = true;
    wrap.addEventListener('click', e => {
        const region = e.target.closest('.body-sil-region');
        if (region) focusBodyRegion(region.dataset.region);
    });
    wrap.addEventListener('mouseover', e => {
        const region = e.target.closest('.body-sil-region');
        if (region) showBodySilTooltip(region, e);
    });
    wrap.addEventListener('mouseout', e => {
        if (!e.relatedTarget?.closest?.('.body-sil-region')) hideBodySilTooltip();
    });
    wrap.addEventListener('keydown', e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const region = e.target.closest('.body-sil-region');
        if (!region) return;
        e.preventDefault();
        focusBodyRegion(region.dataset.region);
    });
}

function initBodyChamberEvents() {
    document.getElementById('bodyChamberReturn')?.addEventListener('click', closeBodyChamber);
    initBodySilhouetteEvents();
}
