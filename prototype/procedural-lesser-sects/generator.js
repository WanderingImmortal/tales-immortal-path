'use strict';

const { createRng } = require('./rng');

function normalizeNameKey(name) {
    return (name || '').trim().toLowerCase();
}

function hashSeedString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
        h ^= str.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function makeSectId(rng, seq) {
    const a = Math.floor(rng.next() * 0xffffff).toString(16).padStart(6, '0');
    return `lsect_${a}_${seq}`;
}

function makeNpcUid(rng, seq) {
    const a = Math.floor(rng.next() * 0xffffff).toString(16).padStart(6, '0');
    return `lsect_npc_${a}_${seq}`;
}

function pickUniqueName(rng, catalog, usedKeys) {
    const blocked = catalog.blockedNameKeys || [];
    for (let attempt = 0; attempt < 64; attempt++) {
        const prefix = rng.pick(catalog.prefixes);
        const suffix = rng.pick(catalog.suffixes);
        const name = `${prefix} ${suffix}`;
        const key = normalizeNameKey(name);
        if (blocked.includes(key)) continue;
        if (usedKeys.has(key)) continue;
        usedKeys.add(key);
        return name;
    }
    const fallback = `Hidden ${Math.floor(rng.next() * 9000 + 1000)} Gate`;
    usedKeys.add(normalizeNameKey(fallback));
    return fallback;
}

function pickHqLocation(rng, catalog, zoneId, usedHq) {
    const pool = (catalog.hqLocationsByZone?.[zoneId] || []).filter(id => !usedHq.has(id));
    const fallbackPool = catalog.hqLocationsByZone?.[zoneId] || [];
    const pick = pool.length ? rng.pick(pool) : rng.pick(fallbackPool);
    if (pick) usedHq.add(pick);
    return pick || null;
}

function rollMemberRealm(rng, leaderRealm, isFounder) {
    const cap = Math.max(0, leaderRealm);
    if (isFounder) return cap;
    const spread = rng.int(0, Math.max(0, cap - 1));
    return Math.max(0, cap - spread - (rng.chance(0.35) ? 0 : 1));
}

function buildMember(rng, catalog, zoneId, leaderRealm, role, seq, options) {
    options = options || {};
    const uid = options.uid || makeNpcUid(rng, seq);
    const name = options.name || rng.pick(catalog.recruitNames) || 'Disciple';
    const realmIdx = options.realmIdx != null
        ? options.realmIdx
        : rollMemberRealm(rng, leaderRealm, role === 'founder' || role === 'leader');
    return {
        uid,
        name,
        role,
        zone: zoneId,
        realmIdx,
        alive: true
    };
}

function pickFocus(rng, catalog) {
    return rng.pick(catalog.focuses) || { id: 'dao', label: 'Dao meditation', memberRole: 'hermit' };
}

function buildCulture(rng, catalog, focusId, doctrine) {
    const lines = catalog.cultureLines?.[focusId] || ['Members share a common oath.', 'Outsiders are watched carefully.'];
    const picked = [];
    const pool = lines.slice();
    while (pool.length && picked.length < 2) {
        const i = rng.int(0, pool.length - 1);
        picked.push(pool.splice(i, 1)[0]);
    }
    if (doctrine === 'righteous') picked.push('Charity is expected once per season.');
    if (doctrine === 'shadow') picked.push('Debts are collected quietly.');
    return picked;
}

function generateOneLesserSect(rng, catalog, zoneId, seq, ctx) {
    ctx = ctx || {};
    const usedNames = ctx.usedNames || new Set();
    const usedHq = ctx.usedHq || new Set();
    const cap = catalog.zoneLeaderRealmCap?.[zoneId] ?? 2;
    const leaderRealm = rng.int(Math.max(0, cap - 1), cap);
    const focus = pickFocus(rng, catalog);
    const doctrine = rng.pick(catalog.doctrines) || 'balanced';
    const name = pickUniqueName(rng, catalog, usedNames);
    const headquartersLocationId = pickHqLocation(rng, catalog, zoneId, usedHq);
    const memberCount = rng.int(3, 9);
    const founder = buildMember(rng, catalog, zoneId, leaderRealm, 'founder', seq * 10 + 1);
    founder.realmIdx = leaderRealm;
    const leader = { ...founder, role: 'leader' };
    const members = [leader];
    for (let m = 0; m < memberCount - 1; m++) {
        members.push(buildMember(
            rng,
            catalog,
            zoneId,
            leaderRealm,
            focus.memberRole || 'disciple',
            seq * 10 + m + 2
        ));
    }
    const foundedAtMonths = ctx.worldAgeMonths != null
        ? Math.max(0, ctx.worldAgeMonths - rng.int(24, 240))
        : rng.int(120, 3600);

    return {
        id: makeSectId(rng, seq),
        kind: 'lesser_sect',
        size: memberCount <= 5 ? 'school' : 'minor',
        name,
        zone: zoneId,
        headquartersLocationId,
        focus: focus.id,
        focusLabel: focus.label,
        doctrine,
        culture: buildCulture(rng, catalog, focus.id, doctrine),
        foundedAtMonths,
        founderNpcUid: founder.uid,
        leaderNpcUid: leader.uid,
        memberNpcUids: members.map(m => m.uid),
        members
    };
}

/**
 * @param {object} options
 * @param {number} options.seed
 * @param {object} options.catalog
 * @param {number} [options.sectsPerZone=2]
 * @param {string[]} [options.zones] subset
 * @param {number} [options.worldAgeMonths=0]
 */
function generateLesserSects(options) {
    options = options || {};
    const catalog = options.catalog;
    if (!catalog) throw new Error('generateLesserSects requires catalog');

    const seed = (options.seed != null ? options.seed : Date.now()) >>> 0;
    const rng = createRng(seed);
    const zones = options.zones?.length
        ? options.zones.filter(z => catalog.zones.includes(z))
        : catalog.zones.slice();
    const perZone = Math.max(1, options.sectsPerZone ?? 2);
    const usedNames = new Set(
        (catalog.blockedNames || []).map(normalizeNameKey)
    );
    const usedHq = new Set(options.reservedHqIds || []);
    const sects = [];
    let seq = 0;

    zones.forEach(zoneId => {
        for (let i = 0; i < perZone; i++) {
            sects.push(generateOneLesserSect(rng, catalog, zoneId, seq++, {
                usedNames,
                usedHq,
                worldAgeMonths: options.worldAgeMonths
            }));
        }
    });

    return {
        seed,
        generatedAtMonths: options.worldAgeMonths ?? 0,
        version: 1,
        sects
    };
}

function validateLesserSectState(state, catalog) {
    const errors = [];
    if (!state || !Array.isArray(state.sects)) {
        errors.push('missing sects array');
        return { ok: false, errors };
    }
    const ids = new Set();
    const names = new Set();
    const blocked = new Set((catalog.blockedNameKeys || []).map(normalizeNameKey));

    state.sects.forEach((sect, idx) => {
        if (!sect.id) errors.push(`sect[${idx}] missing id`);
        else if (ids.has(sect.id)) errors.push(`duplicate id ${sect.id}`);
        else ids.add(sect.id);

        const nk = normalizeNameKey(sect.name);
        if (!sect.name) errors.push(`sect[${idx}] missing name`);
        else if (blocked.has(nk)) errors.push(`sect[${idx}] uses blocked authored name ${sect.name}`);
        else if (names.has(nk)) errors.push(`duplicate name ${sect.name}`);
        else names.add(nk);

        if (!catalog.zones.includes(sect.zone)) errors.push(`sect ${sect.id} invalid zone ${sect.zone}`);

        const hqPool = catalog.hqLocationsByZone?.[sect.zone] || [];
        const allLocs = catalog.allLocationIdsByZone?.[sect.zone];
        if (!sect.headquartersLocationId) errors.push(`sect ${sect.id} missing HQ`);
        else if (allLocs?.length) {
            if (!allLocs.includes(sect.headquartersLocationId)) {
                errors.push(`sect ${sect.id} HQ ${sect.headquartersLocationId} not in zone`);
            }
        } else if (hqPool.length && !hqPool.includes(sect.headquartersLocationId)) {
            errors.push(`sect ${sect.id} HQ ${sect.headquartersLocationId} not in zone pool`);
        }

        const cap = catalog.zoneLeaderRealmCap?.[sect.zone] ?? 2;
        const leader = sect.members?.find(m => m.uid === sect.leaderNpcUid);
        if (!leader) errors.push(`sect ${sect.id} leader ref missing`);
        else if (leader.realmIdx > cap) errors.push(`sect ${sect.id} leader realm ${leader.realmIdx} above cap ${cap}`);

        (sect.memberNpcUids || []).forEach(uid => {
            if (!sect.members?.some(m => m.uid === uid)) {
                errors.push(`sect ${sect.id} member uid ${uid} not in members`);
            }
        });
    });

    return { ok: errors.length === 0, errors };
}

/** Time-only advance: bump member ages only; sect roster unchanged. */
function advanceLesserSectsTimeOnly(state, months, catalog) {
    if (!state?.sects?.length || months <= 0) return state;
    const next = JSON.parse(JSON.stringify(state));
    next.generatedAtMonths = (next.generatedAtMonths || 0) + months;
    next.sects.forEach(sect => {
        sect.members?.forEach(m => {
            m.ageMonths = (m.ageMonths || 240) + months;
        });
    });
    const check = validateLesserSectState(next, catalog);
    if (!check.ok) throw new Error(`integrity after time advance: ${check.errors.join('; ')}`);
    return next;
}

function serializeLesserSectState(state) {
    return JSON.parse(JSON.stringify(state));
}

function mergeLesserSectState(existing, incoming) {
    if (!existing?.sects?.length) return incoming;
    if (!incoming?.sects?.length) return existing;
    const byId = new Map(existing.sects.map(s => [s.id, s]));
    incoming.sects.forEach(s => {
        if (!byId.has(s.id)) byId.set(s.id, s);
    });
    return {
        ...incoming,
        sects: [...byId.values()]
    };
}

module.exports = {
    createRng,
    hashSeedString,
    generateLesserSects,
    validateLesserSectState,
    advanceLesserSectsTimeOnly,
    serializeLesserSectState,
    mergeLesserSectState,
    normalizeNameKey
};
