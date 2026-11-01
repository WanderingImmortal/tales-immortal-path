/**
 * Load the real BODY_BONE_DEFS (traced skeleton chunks) from body-chamber.js + body-skeleton-art.js
 * without a DOM, so audits/renders see the same geometry the game draws.
 */
'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..', '..');

function loadBodyBoneDefs() {
    const src = fs.readFileSync(path.join(root, 'body-chamber.js'), 'utf8');
    const art = fs.readFileSync(path.join(root, 'body-skeleton-art.js'), 'utf8');
    const startIdx = src.indexOf('const BODY_BONE_CHUNK_ORDER');
    const endIdx = src.indexOf('const BODY_BONE_LAYOUT_VERSION');
    if (startIdx < 0 || endIdx < 0) throw new Error('bone def block not found in body-chamber.js');
    const code = `${art}\n${src.slice(startIdx, endIdx)}\n;({ BODY_BONE_DEFS, BODY_BONE_CHUNK_ORDER, BODY_SKELETON_ART })`;
    return vm.runInNewContext(code);
}

module.exports = { loadBodyBoneDefs };
