/**
 * Body chamber silhouette / overlay fit audit (Phase 1+).
 * Run: node scripts/audit-body-overlay-fit.js
 *
 * Checks:
 *  1. sil-* part paths exist in index.html
 *  2. BODY_LANDMARKS + centreX === 104
 *  3. No legacy subtractive body-mask-* region masks
 *  4. Every real bone path (BODY_BONE_DEFS, both sides) is well-formed and sits inside #sil-shell
 *     with enough depth for its lit stroke (per-kind clearance) — FAILS the audit
 *  5. Chunks: every bone's `action` is a real Bones action in data.js (so refining one action only
 *     lights its own bones) and every action owns at least one bone
 *  6. Joint anchor bones (humeral head, elbow, wrist, hip, knee, ankle) land inside their sil-patch
 *  (sil-* capsule parts vs shell is still a warning only)
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { flattenPath, pointInPoly, signedClearance } = require('./lib/body-fit-geometry');
const { loadBodyBoneDefs } = require('./lib/body-bone-defs');
const { requiredClearance } = require('./lib/body-bone-clearance');

const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const bodyJs = fs.readFileSync(path.join(root, 'body-chamber.js'), 'utf8');

const PART_IDS = [
    'sil-head', 'sil-neck', 'sil-torso',
    'sil-upper-arm-l', 'sil-upper-arm-r',
    'sil-forearm-l', 'sil-forearm-r',
    'sil-hand-l', 'sil-hand-r',
    'sil-thigh-l', 'sil-thigh-r',
    'sil-shin-l', 'sil-shin-r',
    'sil-foot-l', 'sil-foot-r'
];

let failed = false;
function fail(msg) {
    console.error('FAIL:', msg);
    failed = true;
}
function ok(msg) {
    console.log('OK:', msg);
}

// —— 1. Part paths present ——
const partPaths = {};
for (const id of PART_IDS) {
    const re = new RegExp(`<path\\s+id="${id}"\\s+d="([^"]+)"`);
    const m = html.match(re);
    if (!m) fail(`missing <path id="${id}"> in index.html`);
    else partPaths[id] = m[1];
}
if (Object.keys(partPaths).length === PART_IDS.length) {
    ok(`${PART_IDS.length} silhouette part paths present`);
}

// —— 2. No legacy subtractive region masks ——
const legacyMasks = [...html.matchAll(/id="(body-mask-(?:head|spine|ribs|arm-l|arm-r|hand-l|hand-r|leg-l|leg-r|foot-l|foot-r))"/g)].map(m => m[1]);
if (legacyMasks.length) fail(`legacy subtractive masks still present: ${legacyMasks.join(', ')}`);
else ok('legacy subtractive region masks removed');

if (html.includes('id="body-silhouette-path"')) {
    fail('legacy #body-silhouette-path still present — parts should replace it');
} else {
    ok('legacy #body-silhouette-path removed');
}

if (!html.includes('id="body-mask-silhouette-only"')) {
    fail('missing body-mask-silhouette-only composite mask');
} else {
    ok('composite silhouette mask present');
}

// —— 3. BODY_LANDMARKS ——
const lmMatch = bodyJs.match(/const BODY_LANDMARKS\s*=\s*\{([\s\S]*?)\n\};/);
if (!lmMatch) {
    fail('BODY_LANDMARKS missing in body-chamber.js');
} else {
    let landmarks;
    try {
        landmarks = vm.runInNewContext('(' + lmMatch[0].replace(/^const BODY_LANDMARKS\s*=\s*/, '').replace(/;$/, '') + ')');
    } catch (e) {
        fail('BODY_LANDMARKS parse error: ' + e.message);
        landmarks = null;
    }
    if (landmarks) {
        if (landmarks.centreX !== 104) fail(`BODY_LANDMARKS.centreX is ${landmarks.centreX}, expected 104`);
        else ok('BODY_LANDMARKS.centreX === 104');
    }
}

// —— 4. Bone fit vs #sil-shell ——
const shellMatch = html.match(/id="sil-shell"\s+d="([^"]+)"/);
const shellPoly = shellMatch ? flattenPath(shellMatch[1], 6) : null;
if (!shellPoly) {
    fail('missing #sil-shell path in index.html');
} else {
    ok('bone fit uses traced #sil-shell (visible silhouette)');
}

const patchPolys = {};
for (const m of html.matchAll(/<path id="(sil-patch-[^"]+)" d="([^"]+)"/g)) {
    patchPolys[m[1]] = flattenPath(m[2], 8);
}

const { BODY_BONE_DEFS } = loadBodyBoneDefs();

const partOffenders = [];
for (const id of PART_IDS) {
    const d = partPaths[id];
    if (!d || !shellPoly) continue;
    let worst = Infinity;
    for (const [x, y] of flattenPath(d, 6)) {
        worst = Math.min(worst, signedClearance(x, y, [shellPoly]));
    }
    if (worst < 1.8) partOffenders.push({ id, clearance: +worst.toFixed(2) });
}
if (partOffenders.length) {
    console.log(`\nPart vs shell (${partOffenders.length} under margin — warn only; parts are hit regions, not display):`);
    partOffenders.slice(0, 8).forEach(o => console.log(`  - ${o.id}: ${o.clearance}`));
} else if (shellPoly) {
    ok('sampled sil-* parts inside #sil-shell margin');
}

const offenders = [];
let measured = 0;
if (shellPoly) {
    for (const bone of BODY_BONE_DEFS) {
        const pts = flattenPath(bone.d, 8);
        if (!pts.length || pts.some(([x, y]) => !Number.isFinite(x) || !Number.isFinite(y))) {
            fail(`${bone.id}: malformed path d (NaN / truncated segment)`);
            continue;
        }
        measured++;
        const need = requiredClearance(bone.kind);
        let worst = Infinity;
        let worstPt = null;
        for (const [x, y] of pts) {
            const clr = signedClearance(x, y, [shellPoly]);
            if (clr < worst) { worst = clr; worstPt = [x, y]; }
        }
        if (worst < need) {
            offenders.push({ id: bone.id, clearance: +worst.toFixed(2), need, at: `(${worstPt[0].toFixed(1)},${worstPt[1].toFixed(1)})` });
        }
    }
}

console.log(`\nBone fit vs #sil-shell (${measured} bone paths, per-kind lit-stroke clearance):`);
if (!offenders.length) {
    ok('all bones inside #sil-shell with stroke clearance');
} else {
    offenders.sort((a, b) => a.clearance - b.clearance);
    offenders.slice(0, 16).forEach(o => console.log(`  - ${o.id}: clearance ${o.clearance} < ${o.need} at ${o.at}`));
    fail(`${offenders.length} bone(s) outside / too close to #sil-shell — re-fit (node scripts/fit-body-bones-to-shell.js, node scripts/render-body-bone-fit.js)`);
}

// —— 5. Refinement chunks ——
const dataJs = fs.readFileSync(path.join(root, 'data.js'), 'utf8');
const actionsBlock = dataJs.match(/const BODY_CHAMBER_ACTIONS\s*=\s*\{[\s\S]*?\n\};/)?.[0] || '';
const bonesBlock = actionsBlock.match(/\n    bones:\s*\[([\s\S]*?)\n    \]/)?.[1] || '';
const boneActionIds = [...bonesBlock.matchAll(/\{ id: '([a-z]+)'/g)].map(m => m[1]);
const chunkBones = {};
for (const b of BODY_BONE_DEFS) (chunkBones[b.action] = chunkBones[b.action] || []).push(b.id);
if (!boneActionIds.length) {
    fail('could not read bones actions from data.js BODY_CHAMBER_ACTIONS');
} else {
    const unknown = Object.keys(chunkBones).filter(a => !boneActionIds.includes(a));
    const empty = boneActionIds.filter(a => !chunkBones[a]);
    if (unknown.length) fail(`bone defs use unknown action(s): ${unknown.join(', ')}`);
    if (empty.length) fail(`bones action(s) with no bone paths: ${empty.join(', ')}`);
    if (!unknown.length && !empty.length) {
        ok('refinement chunks: ' + boneActionIds.map(a => `${a}=${chunkBones[a].length}`).join(' '));
    }
}

// —— 6. Joint anchors land inside their patch ——
const JOINT_ANCHORS = [
    ['humerus-head', 'shoulder'], ['elbow', 'elbow'], ['carpals', 'wrist'],
    ['femur-head', 'hip'], ['patella', 'knee'], ['tarsals', 'ankle']
];
let jointBad = 0;
for (const [boneId, joint] of JOINT_ANCHORS) {
    for (const side of ['l', 'r']) {
        const bone = BODY_BONE_DEFS.find(b => b.id === `bone-${boneId}-${side}`);
        const patch = patchPolys[`sil-patch-${joint}-${side}`];
        if (!bone || !patch) { fail(`joint anchor ${boneId}-${side} / patch ${joint}-${side} missing`); jointBad++; continue; }
        const pts = flattenPath(bone.d, 8);
        const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
        const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
        if (!pointInPoly(cx, cy, patch)) {
            fail(`${bone.id} centre (${cx.toFixed(1)},${cy.toFixed(1)}) is outside sil-patch-${joint}-${side}`);
            jointBad++;
        }
    }
}
if (!jointBad) ok('joint anchor bones sit inside their sil-patch discs');

console.log('');
if (failed) {
    console.error('Body overlay fit audit FAILED.');
    process.exit(1);
}
console.log('Body overlay fit audit passed.');
process.exit(0);
