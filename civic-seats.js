// Civic seats generator — docs/ideas/civic-seats-generator.md
// One engine + tier tables. Capitals/unique cities stay authored (generator off).

const CIVIC_SEAT_ROLES = {
    city_lord: {
        id: 'city_lord',
        title: 'City Lord',
        label: 'City Lord',
        isApex: true
    },
    warden: {
        id: 'warden',
        title: 'Captain of the Guard',
        label: 'Captain of the Guard'
    },
    market: {
        id: 'market',
        title: 'Market face',
        label: 'Market face'
    },
    inn: {
        id: 'inn',
        title: 'Innkeep',
        label: 'Innkeep'
    },
    jobs: {
        id: 'jobs',
        title: 'Jobs board',
        label: 'Jobs board'
    }
};

/** Default seat lists by settlement tier (city-tiers.md). */
const CIVIC_SEATS_BY_TIER = {
    4: ['city_lord', 'warden', 'market', 'inn', 'jobs'],
    3: ['city_lord', 'warden', 'market', 'inn', 'jobs'],
    2: ['city_lord', 'warden', 'market', 'inn', 'jobs'],
    // 1st / imperial: authored — generator off unless profile opts in
    1: [],
    imperial: []
};

const CIVIC_LEAN_POOL = ['graft', 'clean', 'merchant', 'martial', 'clerk'];

const CIVIC_FATE_SEEDS = ['stagnate', 'leave_up', 'wrong_enemy', 'age_out'];

/** Short rumor fragments keyed by holder lean — paired with seat name in buildSettlementCivicRumors(). */
const CIVIC_LEAN_RUMOR_FRAGMENTS = {
    graft: [
        'skims a coin off every fee that passes their desk',
        'never signs a paper without a second purse watching',
        'owes favors at the well — and collects them twice',
        'keeps two ledgers: one for the Registry, one for friends'
    ],
    clean: [
        'posts fines in public and means every word',
        'turned down a bribe loud enough for the whole bazaar to hear',
        'counts the guard roster personally each dawn',
        'made an enemy last month by refusing to look away'
    ],
    merchant: [
        'knows every caravan before it kicks up dust',
        'buys low from panicked sellers and never apologizes',
        'quotes prices like scripture — and still finds buyers',
        'lost money on a Miraj run and swears the road cheated them'
    ],
    martial: [
        'broke a quarry brawler\'s arm without drawing a blade',
        'walks the road at dusk when others hide indoors',
        'posted a bounty with their own coin just to send a message',
        'still carries grit under their nails from younger years'
    ],
    clerk: [
        'memorized every debt on the board before breakfast',
        'files complaints in triplicate and answers none of them quickly',
        'quotes Registry law when anyone raises their voice',
        'has not missed a rent tally in three seasons'
    ]
};

/** Zone culture packs — names + ticks. */
const CIVIC_CULTURE_PACKS = {
    dustbone: {
        id: 'dustbone',
        names: ['Mei', 'Jun', 'Sable', 'Orrin', 'Lian', 'Kest', 'Nara', 'Tobin', 'Yue', 'Hark', 'Sela', 'Rook', 'Liang', 'Wei', 'Qiao', 'Ren', 'Wen', 'Ke'],
        ticks: [
            'Chews grit between words.',
            'Never raises their voice at the well.',
            'Counts stones twice.',
            'Keeps a saltbrush sprig in their sash.',
            'Laughs once, dry as the dunes.',
            'Looks past you toward the road.',
            'Smells faintly of ironscar dust.',
            'Ends every order with "keep it quiet."',
            'Wipes their hands before taking coin.',
            'Knows every loader by nickname.'
        ],
        leanWeights: {
            city_lord: { graft: 3, clean: 1, merchant: 2, martial: 2, clerk: 1 },
            warden: { graft: 2, clean: 2, merchant: 1, martial: 4, clerk: 1 },
            market: { graft: 2, clean: 1, merchant: 5, martial: 1, clerk: 1 },
            inn: { graft: 1, clean: 2, merchant: 3, martial: 1, clerk: 2 },
            jobs: { graft: 2, clean: 2, merchant: 2, martial: 1, clerk: 3 }
        }
    }
};

/**
 * Settlement civic profiles. Capitals omit generateSeats (authored later).
 * hasJobs defaults true — crisis / exceptions can flip false later.
 */
const SETTLEMENT_CIVIC_PROFILES = {
    redwell: {
        settlementId: 'redwell',
        settlementTier: 4,
        culturePack: 'dustbone',
        hasJobs: true,
        generateSeats: true,
        displayName: 'Redwell',
        /** Map legacy Redwell seat ids → role ids */
        legacySeatMap: {
            redwell_city_lord: 'city_lord',
            redwell_warden: 'warden',
            redwell_bazaar: 'market',
            redwell_innkeep: 'inn',
            redwell_well_boss: 'jobs'
        },
        labelOverrides: {
            warden: 'Road warden',
            market: 'Bazaar face',
            jobs: 'Well boss'
        },
        overrides: {
            city_lord: { lean: 'graft' }
        }
    }
};

function getSettlementCivicProfile(settlementId) {
    return SETTLEMENT_CIVIC_PROFILES[settlementId] || null;
}

function settlementHasJobs(settlementId) {
    const p = getSettlementCivicProfile(settlementId);
    if (!p) return true;
    return p.hasJobs !== false;
}

function getCivicCulturePack(packId) {
    return CIVIC_CULTURE_PACKS[packId] || CIVIC_CULTURE_PACKS.dustbone;
}

function pickWeightedCivicLean(roleId, culturePack, forcedLean) {
    if (forcedLean && CIVIC_LEAN_POOL.includes(forcedLean)) return forcedLean;
    const weights = culturePack?.leanWeights?.[roleId] || {};
    const entries = CIVIC_LEAN_POOL.map(lean => ({ lean, w: weights[lean] || 1 }));
    const total = entries.reduce((s, e) => s + e.w, 0);
    let roll = Math.random() * total;
    for (const e of entries) {
        roll -= e.w;
        if (roll <= 0) return e.lean;
    }
    return 'clerk';
}

function rollCivicFateSeeds() {
    const shuffled = CIVIC_FATE_SEEDS.slice().sort(() => Math.random() - 0.5);
    const n = 1 + Math.floor(Math.random() * 2);
    return shuffled.slice(0, n);
}

function rollCivicHolder(roleId, profile, opts) {
    opts = opts || {};
    const pack = getCivicCulturePack(profile.culturePack);
    const isApex = !!CIVIC_SEAT_ROLES[roleId]?.isApex;
    const now = (typeof G !== 'undefined' ? G.ageMonths : 0) || 0;
    const forced = profile.overrides?.[roleId] || {};
    const ageYears = opts.ageYears != null
        ? opts.ageYears
        : (isApex ? (42 + Math.floor(Math.random() * 28)) : (28 + Math.floor(Math.random() * 30)));
    const deathAgeYears = opts.deathAgeYears != null
        ? opts.deathAgeYears
        : (isApex ? (110 + Math.floor(Math.random() * 40)) : (72 + Math.floor(Math.random() * 12)));
    const name = opts.name || pack.names[Math.floor(Math.random() * pack.names.length)];
    const tick = opts.tick || pack.ticks[Math.floor(Math.random() * pack.ticks.length)];
    return {
        name,
        ageYears,
        bornMonth: opts.bornMonth != null ? opts.bornMonth : (now - ageYears * 12),
        deathAgeYears,
        lean: pickWeightedCivicLean(roleId, pack, forced.lean || opts.lean),
        tick,
        fateSeeds: opts.fateSeeds || rollCivicFateSeeds()
    };
}

function ensureSettlementSeatsState() {
    if (typeof G === 'undefined') return null;
    if (!G.settlementSeats) G.settlementSeats = {};
    return G.settlementSeats;
}

function listCivicRolesForSettlement(settlementId) {
    const profile = getSettlementCivicProfile(settlementId);
    if (!profile || profile.generateSeats === false) return [];
    let roles = profile.seats;
    if (!roles || !roles.length) {
        const tier = profile.settlementTier || 4;
        roles = (CIVIC_SEATS_BY_TIER[tier] || CIVIC_SEATS_BY_TIER[4]).slice();
    }
    if (!settlementHasJobs(settlementId)) {
        roles = roles.filter(r => r !== 'jobs');
    }
    return roles;
}

function getCivicSeatLabel(settlementId, roleId) {
    const profile = getSettlementCivicProfile(settlementId);
    if (profile?.labelOverrides?.[roleId]) return profile.labelOverrides[roleId];
    return CIVIC_SEAT_ROLES[roleId]?.label || roleId;
}

function getCivicSeatTitle(settlementId, roleId) {
    if (roleId === 'city_lord') {
        const holder = getSettlementSeatHolder(settlementId, 'city_lord');
        const name = holder?.name;
        return name ? `City Lord ${name}` : 'the City Lord';
    }
    const holder = getSettlementSeatHolder(settlementId, roleId);
    const label = getCivicSeatLabel(settlementId, roleId);
    return holder?.name ? `${label} ${holder.name}` : label;
}

let _ensuringSettlementSeats = false;

function getSettlementSeatHolder(settlementId, roleId) {
    if (!_ensuringSettlementSeats) ensureSettlementSeats(settlementId);
    return G.settlementSeats?.[settlementId]?.[roleId] || null;
}

function migrateLegacyCivicSeats(settlementId) {
    const profile = getSettlementCivicProfile(settlementId);
    if (!profile?.legacySeatMap || !G.civicSeats) return;
    ensureSettlementSeatsState();
    if (!G.settlementSeats[settlementId]) G.settlementSeats[settlementId] = {};
    const bag = G.settlementSeats[settlementId];
    Object.entries(profile.legacySeatMap).forEach(([legacyId, roleId]) => {
        const legacy = G.civicSeats[legacyId];
        if (!legacy || bag[roleId]) return;
        bag[roleId] = {
            name: legacy.name,
            ageYears: legacy.ageYears,
            bornMonth: legacy.bornMonth,
            deathAgeYears: legacy.deathAgeYears,
            lean: profile.overrides?.[roleId]?.lean || legacy.lean || null,
            tick: legacy.tick || null,
            fateSeeds: legacy.fateSeeds || null
        };
        // Fill missing generator fields on migrated holders
        if (!bag[roleId].lean || !bag[roleId].tick || !bag[roleId].fateSeeds) {
            const rolled = rollCivicHolder(roleId, profile, {
                name: bag[roleId].name,
                ageYears: bag[roleId].ageYears,
                bornMonth: bag[roleId].bornMonth,
                deathAgeYears: bag[roleId].deathAgeYears,
                lean: bag[roleId].lean,
                tick: bag[roleId].tick,
                fateSeeds: bag[roleId].fateSeeds
            });
            bag[roleId].lean = bag[roleId].lean || rolled.lean;
            bag[roleId].tick = bag[roleId].tick || rolled.tick;
            bag[roleId].fateSeeds = bag[roleId].fateSeeds || rolled.fateSeeds;
        }
    });
}

function syncLegacyCivicSeatMirror(settlementId) {
    const profile = getSettlementCivicProfile(settlementId);
    if (!profile?.legacySeatMap) return;
    if (!G.civicSeats) G.civicSeats = {};
    const bag = G.settlementSeats?.[settlementId];
    if (!bag) return;
    Object.entries(profile.legacySeatMap).forEach(([legacyId, roleId]) => {
        const holder = bag[roleId];
        if (!holder) return;
        G.civicSeats[legacyId] = {
            name: holder.name,
            ageYears: holder.ageYears,
            bornMonth: holder.bornMonth,
            deathAgeYears: holder.deathAgeYears,
            lean: holder.lean,
            tick: holder.tick,
            fateSeeds: holder.fateSeeds
        };
    });
}

function ensureSettlementSeats(settlementId) {
    if (!settlementId || typeof G === 'undefined') return null;
    const profile = getSettlementCivicProfile(settlementId);
    if (!profile || profile.generateSeats === false) return null;
    if (_ensuringSettlementSeats) return G.settlementSeats?.[settlementId] || null;

    _ensuringSettlementSeats = true;
    try {
        ensureSettlementSeatsState();
        migrateLegacyCivicSeats(settlementId);
        if (!G.settlementSeats[settlementId]) G.settlementSeats[settlementId] = {};
        const bag = G.settlementSeats[settlementId];
        const now = G.ageMonths || 0;
        const roles = listCivicRolesForSettlement(settlementId);

        roles.forEach(roleId => {
            let holder = bag[roleId];
            const isApex = !!CIVIC_SEAT_ROLES[roleId]?.isApex;
            if (!holder) {
                bag[roleId] = rollCivicHolder(roleId, profile);
                return;
            }
            // Keep age in sync
            holder.ageYears = Math.floor((now - (holder.bornMonth || 0)) / 12);
            if (holder.deathAgeYears == null) {
                holder.deathAgeYears = isApex
                    ? (110 + Math.floor(Math.random() * 40))
                    : (72 + Math.floor(Math.random() * 12));
            }
            if (!holder.lean || !holder.tick || !holder.fateSeeds) {
                const fill = rollCivicHolder(roleId, profile, {
                    name: holder.name,
                    ageYears: holder.ageYears,
                    bornMonth: holder.bornMonth,
                    deathAgeYears: holder.deathAgeYears,
                    lean: holder.lean,
                    tick: holder.tick,
                    fateSeeds: holder.fateSeeds
                });
                holder.lean = holder.lean || fill.lean;
                holder.tick = holder.tick || fill.tick;
                holder.fateSeeds = holder.fateSeeds || fill.fateSeeds;
            }
            if (holder.ageYears >= holder.deathAgeYears) {
                const old = holder.name;
                const oldLean = holder.lean;
                bag[roleId] = rollCivicHolder(roleId, profile, {
                    ageYears: isApex ? (40 + Math.floor(Math.random() * 25)) : (24 + Math.floor(Math.random() * 20))
                });
                const label = getCivicSeatLabel(settlementId, roleId);
                const place = profile.displayName || settlementId;
                const newName = bag[roleId].name;
                if (typeof appendWorldChronicle === 'function') {
                    const summary = roleId === 'city_lord'
                        ? `City Lord ${old} left the seat in ${place}. ${newName} holds the office now.`
                        : `${label} ${old} stepped down in ${place}. ${newName} took the seat.`;
                    appendWorldChronicle({
                        emoji: '🏛️',
                        type: 'civic',
                        zoneId: settlementId,
                        summary
                    });
                }
                if (typeof addLog === 'function') {
                    if (roleId === 'city_lord') {
                        addLog(`🏜️ City Lord ${old} is gone from the seat. ${newName} holds ${place} now — same office, new face.`);
                    } else {
                        addLog(`🏜️ ${label}: ${old} is gone. ${newName} holds the seat now.`);
                    }
                }
                if (settlementId === 'redwell' && G.redwellLord) {
                    G.redwellLord.met = false;
                    G.redwellLord.thanksGiven = false;
                    G.redwellLord.successionSeen = true;
                    G.redwellLord.lastSuccession = {
                        roleId,
                        label,
                        oldName: old,
                        newName,
                        month: G.ageMonths || 0
                    };
                }
                // Preserve Redwell graft lean on lord when profile forces it
                if (profile.overrides?.[roleId]?.lean) {
                    bag[roleId].lean = profile.overrides[roleId].lean;
                } else if (oldLean && Math.random() < 0.35) {
                    // Slight institutional continuity
                    bag[roleId].lean = oldLean;
                }
            }
        });

        syncLegacyCivicSeatMirror(settlementId);
        return bag;
    } finally {
        _ensuringSettlementSeats = false;
    }
}

/** Redwell adapter — keeps existing call sites working. */
function ensureRedwellSeats() {
    ensureSettlementSeats('redwell');
}

function getRedwellSeatName(seatId) {
    ensureRedwellSeats();
    const profile = getSettlementCivicProfile('redwell');
    const roleId = profile?.legacySeatMap?.[seatId];
    if (roleId) {
        return getSettlementSeatHolder('redwell', roleId)?.name || 'someone';
    }
    return G.civicSeats?.[seatId]?.name || 'someone';
}

function getRedwellCityLordName() {
    ensureRedwellSeats();
    return getCivicSeatTitle('redwell', 'city_lord');
}

function getRedwellSeatTick(seatId) {
    ensureRedwellSeats();
    const profile = getSettlementCivicProfile('redwell');
    const roleId = profile?.legacySeatMap?.[seatId];
    if (!roleId) return null;
    return getSettlementSeatHolder('redwell', roleId)?.tick || null;
}

function getRedwellSeatLean(seatId) {
    ensureRedwellSeats();
    const profile = getSettlementCivicProfile('redwell');
    const roleId = profile?.legacySeatMap?.[seatId];
    if (!roleId) return null;
    return getSettlementSeatHolder('redwell', roleId)?.lean || null;
}

/** Rumor lines pulled from live civic seat holders (name + lean + tick). */
function buildSettlementCivicRumors(settlementId) {
    const profile = getSettlementCivicProfile(settlementId);
    if (!profile?.generateSeats) return [];
    ensureSettlementSeats(settlementId);
    const rumors = [];
    const roles = listCivicRolesForSettlement(settlementId);
    roles.forEach(roleId => {
        const holder = getSettlementSeatHolder(settlementId, roleId);
        if (!holder?.name) return;
        const label = getCivicSeatLabel(settlementId, roleId);
        const lean = holder.lean && CIVIC_LEAN_RUMOR_FRAGMENTS[holder.lean]
            ? holder.lean
            : 'clerk';
        const frags = CIVIC_LEAN_RUMOR_FRAGMENTS[lean];
        const frag = frags[Math.floor(Math.random() * frags.length)];
        rumors.push(`${label} ${holder.name} ${frag}.`);
        if (holder.tick) {
            rumors.push(`At the Inn: "${label} ${holder.name} — ${holder.tick}"`);
        }
    });
    const lordState = settlementId === 'redwell' ? G.redwellLord : null;
    if (lordState?.lastSuccession?.newName) {
        const s = lordState.lastSuccession;
        const monthsAgo = Math.max(0, (G.ageMonths || 0) - (s.month || 0));
        if (monthsAgo <= 36) {
            if (s.roleId === 'city_lord') {
                rumors.push(`Since City Lord ${s.oldName} left, ${s.newName} runs a tighter or looser purse — depends who you ask.`);
            } else {
                rumors.push(`${s.label} ${s.oldName} is already forgotten. ${s.newName} sets the tone now.`);
            }
        }
    }
    return rumors;
}

function buildRedwellCivicRumors() {
    return buildSettlementCivicRumors('redwell');
}

/** Bazaar face lean nudges buy prices at settlement markets (content hook, not a full economy sim). */
function getSettlementMarketLeanMult(settlementId) {
    const profile = getSettlementCivicProfile(settlementId);
    if (!profile?.generateSeats) return 1;
    const lean = getSettlementSeatHolder(settlementId, 'market')?.lean;
    const table = {
        graft: 1.08,
        clean: 0.97,
        merchant: 0.96,
        martial: 1.02,
        clerk: 1.0
    };
    return table[lean] || 1;
}

function getSettlementMarketLeanPriceNote(settlementId) {
    const lean = getSettlementSeatHolder(settlementId, 'market')?.lean;
    if (lean === 'graft') return 'prices run a little rich';
    if (lean === 'clean') return 'posted prices are fair';
    if (lean === 'merchant') return 'haggling is useless here';
    if (lean === 'martial') return 'stall fees are stiff';
    return '';
}

/** Well boss lean nudges job payouts — martial favors risky escort runs. */
function getSettlementJobsLeanMult(settlementId, jobId) {
    const profile = getSettlementCivicProfile(settlementId);
    if (!profile?.generateSeats) return 1;
    const lean = getSettlementSeatHolder(settlementId, 'jobs')?.lean;
    const job = typeof getThresholdJobDef === 'function' ? getThresholdJobDef(jobId) : null;
    const risky = !!(job?.risk || jobId === 'short_escort');
    const table = {
        graft: 0.92,
        clean: 1.02,
        merchant: 0.98,
        martial: risky ? 1.06 : 1.0,
        clerk: 1.03
    };
    return table[lean] || 1;
}

function getSettlementJobsLeanPayNote(settlementId, mult) {
    if (mult < 0.95) return 'Well boss clipped the tally.';
    if (mult > 1.01) return 'Fair count — pays what was posted.';
    return '';
}

/** Age civic holders on world time — succession runs inside ensureSettlementSeats. */
function tickCivicSeats(delta) {
    if (!delta || delta <= 0 || typeof G === 'undefined') return;
    Object.keys(SETTLEMENT_CIVIC_PROFILES).forEach(settlementId => {
        const profile = SETTLEMENT_CIVIC_PROFILES[settlementId];
        if (profile?.generateSeats) ensureSettlementSeats(settlementId);
    });
}
