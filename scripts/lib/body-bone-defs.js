/**
 * Load the real BODY_BONE_DEFS (axial + mirrored side defs) from body-chamber.js
 * without a DOM, so audits/renders see the same geometry the game draws.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..', '..');

function loadBodyBoneDefs() {
    const src = fs.readFileSync(path.join(root, 'body-chamber.js'), 'utf8');
    const lm = src.match(/const BODY_LANDMARKS\s*=\s*\{[\s\S]*?\n\};/)[0];
    const startIdx = src.indexOf('const BODY_SKELETON_CENTER_X');
    const endIdx = src.indexOf('const BODY_BONE_BY_ID');
    if (startIdx < 0 || endIdx < 0) throw new Error('bone def block not found in body-chamber.js');
    const code = `${lm}\n${src.slice(startIdx, endIdx)}\n;({ BODY_BONE_DEFS, BODY_BONE_SIDE_DEFS, BODY_BONE_AXIAL_DEFS, BODY_LANDMARKS })`;
    return vm.runInNewContext(code);
}

module.exports = { loadBodyBoneDefs };
