// ============================================
// QC-DEPTH.JS — Qi Condensation bands, Threshold life, qi-feel, travel caution
// Design: docs/ideas/qi-condensation-depth.md
// ============================================

const QC_BAND_STAGES = ['early', 'mid', 'late', 'peak'];
const QC_BAND_LABELS = {
    early: 'Early Qi Condensation',
    mid: 'Mid Qi Condensation',
    late: 'Late Qi Condensation',
    peak: 'Peak Qi Condensation'
};

/**
 * Gather progress thresholds (cumulative gather-units) to enter the named stage.
 * Tuned so inferior roots land Late ~40s with steady chamber work; better roots faster.
 */
const QC_BAND_THRESHOLDS = {
    mid: 90,
    late: 220,
    peak: 320
};

const QC_BAND_CAPACITY_BONUS = {
    mid: 4,
    late: 6,
    peak: 8
};

const QC_BAND_POWER_BONUS = {
    early: 0,
    mid: 2,
    late: 5,
    peak: 10
};

/** Place-scoped field sites — docs/ideas/explore-field-gathering.md */
const FIELD_SITE_DEFS = {
    dewcatch_scrub: {
        label: 'Dewcatch Scrub',
        commons: ['dust_viper', 'saltbrush_stalker', 'herb_thief'],
        elite: 'dew_catch_wight',
        eliteChance: 0.1,
        materials: [
            { id: 'dust_root', w: 32 }, { id: 'dawn_dew', w: 28 }, { id: 'saltbrush_tip', w: 22 },
            { id: 'marrow_thistle', w: 12 }
        ]
    },
    ironscar_quarry: {
        label: 'Ironscar Quarry',
        commons: ['claim_jumper', 'rock_lizard', 'slag_mite', 'redvein_shade'],
        elite: 'pit_brute',
        eliteChance: 0.12,
        materials: [
            { id: 'ironscar_grit', w: 35 }, { id: 'sun_stone', w: 18 }, { id: 'redvein_chip', w: 15 },
            { id: 'saltbrush_tip', w: 10 }
        ]
    },
    bonehollow_caverns: {
        label: 'Bonehollow Caverns',
        commons: ['bone_gnaw_rat', 'glowcap_skitter', 'marrow_leech', 'pin_haunt_remnant'],
        elite: 'hollow_ambusher',
        eliteChance: 0.14,
        materials: [
            { id: 'seep_dew', w: 30 }, { id: 'glowcap', w: 22 }, { id: 'bone_marrow_resin', w: 18 },
            { id: 'dust_root', w: 8 }
        ]
    }
};

const REDWELL_JOBS = [
    {
        id: 'well_attendant',
        name: 'Well Attendant',
        emoji: '💧',
        months: 1,
        payMin: 12,
        payMax: 22,
        risk: false,
        dryOutAfter: 5,
        flavor: 'Keep Redwell\'s deep well clear — quiet, necessary work.'
    },
    {
        id: 'loader',
        name: 'Grit Loader',
        emoji: '📦',
        months: 2,
        payMin: 18,
        payMax: 32,
        risk: false,
        dryOutAfter: 4,
        flavor: 'Haul Ironscar grit crates for the road stalls.'
    },
    {
        id: 'copyist',
        name: 'Letter Copyist',
        emoji: '📜',
        months: 2,
        payMin: 20,
        payMax: 34,
        risk: false,
        dryOutAfter: 3,
        flavor: 'Copy caravan letters and debt slips — no Registry pin work here.'
    },
    {
        id: 'sweeper',
        name: 'Bone-Marker Sweeper',
        emoji: '🧹',
        months: 1,
        payMin: 10,
        payMax: 18,
        risk: false,
        dryOutAfter: 6,
        flavor: 'Sweep oath-road markers before the next grit run.'
    },
    {
        id: 'short_escort',
        name: 'Scrub Escort',
        emoji: '🗡️',
        months: 3,
        payMin: 40,
        payMax: 70,
        risk: true,
        dryOutAfter: 2,
        flavor: 'Guard a short run toward Dewcatch. Bandits and beasts notice.'
    }
];
/** @deprecated alias — saves still use thresholdJobs key */
const THRESHOLD_JOBS = REDWELL_JOBS;

const REDWELL_RENT = { months: 1, cost: 8, label: 'Redwell Inn room' };
const REDWELL_BUY = { cost: 320, label: 'Sand-brick courtyard', reqRealm: 1 };
const THRESHOLD_RENT = REDWELL_RENT;
const THRESHOLD_BUY = REDWELL_BUY;

const REDWELL_RUMORS = [
    'Someone says the scrub edge is flush with dawn dew this season.',
    'A grit loader skipped town owing the Inn three months.',
    'Road dust toward Threshold — a caravan left without full escort.',
    'Ironscar claimed another claim-jumper; the Pit Brute rumor is back.',
    'The well boss wants quiet hands — fat loading work has dried up.',
    'A letter from the capital: Registry is counting pins again. Redwell shrugs.'
];

const REDWELL_BOUNTIES = [
    { id: 'grit_thief', name: 'Grit Thief', pay: 28, months: 2, risk: 0.35, flavor: 'Stole a crate off the quarry road.' },
    { id: 'road_cutter', name: 'Road Cutter', pay: 36, months: 3, risk: 0.45, flavor: 'Cuts purses between Redwell and the scrub.' },
    { id: 'debt_skip', name: 'Debt-Skipper', pay: 22, months: 2, risk: 0.25, flavor: 'Owes the Innkeep and fled to the dunes.' }
];

const REDWELL_SEAT_IDS = ['redwell_innkeep', 'redwell_bazaar', 'redwell_well_boss', 'redwell_warden'];
const REDWELL_SEAT_LABELS = {
    redwell_innkeep: 'Innkeep',
    redwell_bazaar: 'Bazaar face',
    redwell_well_boss: 'Well boss',
    redwell_warden: 'Road warden'
};
const REDWELL_NAME_POOL = [
    'Mei', 'Jun', 'Sable', 'Orrin', 'Lian', 'Kest', 'Nara', 'Tobin', 'Yue', 'Hark', 'Sela', 'Rook'
];

function ensureQcDepthState() {
    if (!G.qcBand) {
        G.qcBand = { stage: 'early', gatherProgress: 0, capacityGranted: { mid: false, late: false, peak: false } };
    }
    if (!G.qcBand.capacityGranted) G.qcBand.capacityGranted = { mid: false, late: false, peak: false };
    if (!G.thresholdJobs) G.thresholdJobs = { uses: {}, dryUntil: {} };
    if (!G.dwelling) {
        G.dwelling = { mode: 'homeless', settlementId: null, rentPaidThroughMonth: 0 };
    }
    // Migrate old Threshold lodging settlement id → Redwell
    if (G.dwelling.settlementId === 'bone_crossroads') {
        G.dwelling.settlementId = 'redwell';
    }
    if (!G.travelCautions) G.travelCautions = {};
    ensureRedwellMarketState();
    ensureRedwellSeats();
    // Early CSS lock before full action render (dao/forbidden default-hidden in HTML too).
    if (typeof document !== 'undefined' && document.documentElement) {
        const qc = typeof isQiCondensationRealm === 'function' && isQiCondensationRealm();
        document.documentElement.classList.toggle('at-qi-condensation', !!qc);
    }
}

function isQiCondensationRealm() {
    const idx = typeof getTrackRealmIdx === 'function'
        ? getTrackRealmIdx('dantian')
        : (G.realmIdx || 0);
    return idx === 0;
}

/** Root-aware gather units toward Mid/Late/Peak (inferior ≈ slower). */
function getQcGatherProgressUnits() {
    let units = 1;
    if (typeof getTalentGatherMult === 'function') units *= getTalentGatherMult();
    else if (G.talent?.rootGrade) {
        const g = String(G.talent.rootGrade).toLowerCase();
        if (g.includes('heaven') || g.includes('immortal')) units *= 2.2;
        else if (g.includes('superior') || g.includes('high')) units *= 1.6;
        else if (g.includes('medium') || g.includes('average')) units *= 1.25;
        else units *= 1.0; // inferior / unknown
    }
    if (typeof getCultivationMethodGatherMult === 'function') {
        units *= Math.max(0.85, getCultivationMethodGatherMult());
    }
    return Math.max(0.5, units);
}

function getQcBandStage() {
    ensureQcDepthState();
    if (!isQiCondensationRealm()) return null;
    return G.qcBand.stage || 'early';
}

function getQcBandLabel() {
    const stage = getQcBandStage();
    return stage ? (QC_BAND_LABELS[stage] || stage) : null;
}

function getQcBandPowerBonus() {
    const stage = getQcBandStage();
    if (!stage) return 0;
    return QC_BAND_POWER_BONUS[stage] || 0;
}

function hasQcBandBreakthroughReady() {
    const stage = getQcBandStage();
    return stage === 'late' || stage === 'peak';
}

function isQcAtPeakBand() {
    return getQcBandStage() === 'peak';
}

/** Call after each successful Gather Qi while in QC. */
function applyQcGatherBandProgress(amount) {
    if (!isQiCondensationRealm()) return null;
    ensureQcDepthState();
    const base = amount != null ? amount : getQcGatherProgressUnits();
    const gain = Math.max(0.5, Number(base) || getQcGatherProgressUnits());
    G.qcBand.gatherProgress = (G.qcBand.gatherProgress || 0) + gain;
    return maybeAdvanceQcBand();
}

function getQcBandProgressPct() {
    if (!isQiCondensationRealm()) return 0;
    ensureQcDepthState();
    const stage = G.qcBand.stage || 'early';
    const prog = G.qcBand.gatherProgress || 0;
    const order = QC_BAND_STAGES;
    const idx = order.indexOf(stage);
    const next = order[idx + 1];
    if (!next) return 100;
    const prevThresh = stage === 'early' ? 0 : (QC_BAND_THRESHOLDS[stage] || 0);
    const nextThresh = QC_BAND_THRESHOLDS[next] || prevThresh + 1;
    const span = Math.max(1, nextThresh - prevThresh);
    return Math.min(100, Math.floor(((prog - prevThresh) / span) * 100));
}

function maybeAdvanceQcBand() {
    ensureQcDepthState();
    const prog = G.qcBand.gatherProgress || 0;
    const order = QC_BAND_STAGES;
    let stage = G.qcBand.stage || 'early';
    let advanced = null;

    const tryEnter = (next) => {
        if (order.indexOf(stage) >= order.indexOf(next)) return;
        if (prog < QC_BAND_THRESHOLDS[next]) return;
        stage = next;
        advanced = next;
        grantQcBandCapacity(next);
        addLog(`✨ Mini-breakthrough — ${QC_BAND_LABELS[next]}. Your dantian holds more; the store settles thicker.`);
    };

    tryEnter('mid');
    tryEnter('late');
    tryEnter('peak');
    G.qcBand.stage = stage;
    return advanced;
}

function grantQcBandCapacity(stage) {
    ensureQcDepthState();
    if (G.qcBand.capacityGranted[stage]) return;
    const bonus = QC_BAND_CAPACITY_BONUS[stage] || 0;
    if (bonus > 0) {
        G.maxQiBonus = (G.maxQiBonus || 0) + bonus;
        G.qcBand.capacityGranted[stage] = true;
        if (typeof clampCurrentQi === 'function') {
            G.qi = Math.min(getMaxQi(), (G.qi || 0) + bonus);
            clampCurrentQi();
        }
        addLog(`🌬️ Dantian capacity +${bonus} Max Qi.`);
    }
}

// ----- Redwell seats / market / hub -----

function isAtRedwell() {
    const loc = typeof getCurrentLocationId === 'function' ? getCurrentLocationId() : G.currentLocation;
    return loc === 'redwell';
}

/** @deprecated use isAtRedwell — kept for button wiring */
function isAtThresholdCity() {
    return isAtRedwell();
}

function isAtDwellingSettlement() {
    ensureQcDepthState();
    if (!G.dwelling?.settlementId) return isAtRedwell();
    const loc = typeof getCurrentLocationId === 'function' ? getCurrentLocationId() : G.currentLocation;
    return loc === G.dwelling.settlementId;
}

function rollRedwellPersonName() {
    const pool = REDWELL_NAME_POOL;
    return pool[Math.floor(Math.random() * pool.length)];
}

function ensureRedwellSeats() {
    if (!G.civicSeats) G.civicSeats = {};
    const now = G.ageMonths || 0;
    REDWELL_SEAT_IDS.forEach(seatId => {
        let holder = G.civicSeats[seatId];
        if (!holder) {
            const ageYears = 28 + Math.floor(Math.random() * 30);
            G.civicSeats[seatId] = {
                name: rollRedwellPersonName(),
                ageYears,
                bornMonth: now - ageYears * 12,
                deathAgeYears: 72 + Math.floor(Math.random() * 12)
            };
            return;
        }
        const ageYears = Math.floor((now - (holder.bornMonth || 0)) / 12);
        holder.ageYears = ageYears;
        if (holder.deathAgeYears == null) holder.deathAgeYears = 72 + Math.floor(Math.random() * 12);
        if (ageYears >= holder.deathAgeYears) {
            const old = holder.name;
            const ageNew = 24 + Math.floor(Math.random() * 20);
            G.civicSeats[seatId] = {
                name: rollRedwellPersonName(),
                ageYears: ageNew,
                bornMonth: now - ageNew * 12,
                deathAgeYears: 72 + Math.floor(Math.random() * 12)
            };
            if (typeof addLog === 'function') {
                addLog(`🏜️ ${REDWELL_SEAT_LABELS[seatId] || seatId}: ${old} is gone. ${G.civicSeats[seatId].name} holds the seat now.`);
            }
        }
    });
}

function getRedwellSeatName(seatId) {
    ensureRedwellSeats();
    return G.civicSeats?.[seatId]?.name || 'someone';
}

function playerOwnsMethod(methodId) {
    if (typeof getCultivationMethodShelf === 'function') {
        const shelf = getCultivationMethodShelf();
        if (shelf?.some?.(e => e.methodId === methodId || e.id === methodId)) return true;
    }
    if (G.cultivationMethod?.id === methodId || G.cultivationMethod?.methodId === methodId) return true;
    if (G.methodShelf?.some?.(e => e.methodId === methodId || e.id === methodId)) return true;
    return false;
}

function playerOwnsTechniqueName(name) {
    if (!name) return false;
    if (G.techniques?.some?.(t => t === name || t.name === name)) return true;
    if (G.knownTechniques?.some?.(t => t === name || t.name === name)) return true;
    return false;
}

function pickRedwellPoolSlots(pool, count, ownedFn, keyFn) {
    const unused = pool.filter(item => !ownedFn(keyFn(item)));
    const src = unused.length ? unused : pool.slice();
    const shuffled = src.slice().sort(() => Math.random() - 0.5);
    const out = [];
    const seen = new Set();
    for (const item of shuffled) {
        const k = keyFn(item);
        if (seen.has(k)) continue;
        seen.add(k);
        out.push({ ...item });
        if (out.length >= count) break;
    }
    return out;
}

function ensureRedwellMarketState(forceSeason) {
    if (!G.redwellMarket) {
        G.redwellMarket = {
            methodSlots: [],
            techSlots: [],
            pillLeft: {},
            stapleLeft: {},
            lastMonthRestock: -1,
            lastSeasonRestock: -1
        };
    }
    const m = G.redwellMarket;
    const now = G.ageMonths || 0;
    const season = Math.floor(now / 3);
    if (!m.methodSlots?.length || forceSeason || m.lastSeasonRestock !== season) {
        const methods = (typeof REDWELL_METHOD_POOL !== 'undefined' ? REDWELL_METHOD_POOL : []);
        const techs = (typeof REDWELL_TECH_POOL !== 'undefined' ? REDWELL_TECH_POOL : []);
        m.methodSlots = pickRedwellPoolSlots(methods, 3, playerOwnsMethod, i => i.methodId);
        m.techSlots = pickRedwellPoolSlots(techs, 2, playerOwnsTechniqueName, i => i.technique);
        m.lastSeasonRestock = season;
    }
    if (m.lastMonthRestock !== now) {
        m.pillLeft = { spirit_gathering: 3, blood_recovery: 2 };
        m.stapleLeft = { travel_ration: 5, grit_kit: 3 };
        m.lastMonthRestock = now;
    }
    return m;
}

function getResolvedMerchantCatalog(catalogKey) {
    const key = catalogKey || (typeof getMerchantCatalogKey === 'function' ? getMerchantCatalogKey() : null);
    if (!key || typeof MERCHANT_CATALOG === 'undefined') return null;
    const base = MERCHANT_CATALOG[key];
    if (!base) return null;
    if (key !== 'redwell') return base;
    const m = ensureRedwellMarketState();
    const pills = (base.pills || []).map(p => ({
        ...p,
        qty: 1,
        stockLeft: m.pillLeft[p.id] != null ? m.pillLeft[p.id] : (p.qty || 1)
    })).filter(p => p.stockLeft > 0);
    const staples = (base.staples || []).map(s => ({
        ...s,
        stockLeft: m.stapleLeft[s.id] != null ? m.stapleLeft[s.id] : 3
    })).filter(s => s.stockLeft > 0);
    return {
        ...base,
        methods: m.methodSlots || [],
        stock: m.techSlots || [],
        formations: [],
        pills,
        staples
    };
}

function consumeRedwellMarketBuy(kind, id) {
    const m = ensureRedwellMarketState();
    if (kind === 'pill') {
        m.pillLeft[id] = Math.max(0, (m.pillLeft[id] || 0) - 1);
    } else if (kind === 'staple') {
        m.stapleLeft[id] = Math.max(0, (m.stapleLeft[id] || 0) - 1);
    } else if (kind === 'method') {
        m.methodSlots = (m.methodSlots || []).filter(x => x.methodId !== id);
    } else if (kind === 'tech') {
        m.techSlots = (m.techSlots || []).filter(x => x.technique !== id);
    }
}

function actionRedwellRumor() {
    if (G.gameOver || G.inCombat) return;
    if (!isAtRedwell()) {
        addLog('🍺 Rumors pool in Redwell Inn\'s common room.');
        fullRender();
        return;
    }
    const cost = 2;
    if ((G.stones || 0) < cost) {
        addLog(`🍺 Need ${cost} Stones for a drink and an ear.`);
        fullRender();
        return;
    }
    G.stones -= cost;
    const line = REDWELL_RUMORS[Math.floor(Math.random() * REDWELL_RUMORS.length)];
    addLog(`🍺 ${getRedwellSeatName('redwell_innkeep')} pours. Rumor: ${line}`);
    fullRender();
}

function openRedwellBountyBoard() {
    if (G.gameOver || G.inCombat) return;
    if (!isAtRedwell()) {
        addLog('🗡️ Low bounties are posted in Redwell Inn.');
        fullRender();
        return;
    }
    const list = document.getElementById('thresholdJobsList');
    const popup = document.getElementById('thresholdJobsPopup');
    const title = popup?.querySelector('h2');
    if (title) title.textContent = '🗡️ Redwell Bounty Board';
    if (!list || !popup) {
        actionRedwellBounty(REDWELL_BOUNTIES[0].id);
        return;
    }
    list.innerHTML = REDWELL_BOUNTIES.map(b => `
        <div class="popup-item can-buy" data-redwell-bounty="${b.id}" style="cursor:pointer;">
            <div class="name">🗡️ ${b.name}</div>
            <div class="desc">${b.flavor}</div>
            <div class="desc" style="margin-top:4px;color:#d4a860;">${b.months} mo · ~${b.pay} Stones · Risk · Click to hunt</div>
        </div>`).join('');
    list.querySelectorAll('[data-redwell-bounty]').forEach(row => {
        row.addEventListener('click', () => {
            popup.classList.remove('active');
            actionRedwellBounty(row.getAttribute('data-redwell-bounty'));
        });
    });
    popup.classList.add('active');
}

function actionRedwellBounty(bountyId) {
    if (G.gameOver || G.inCombat) return;
    if (!isAtRedwell()) return;
    const b = REDWELL_BOUNTIES.find(x => x.id === bountyId);
    if (!b) return;
    beginActionLog();
    if (!advanceTime(b.months, `Hunting bounty: ${b.name}`)) {
        cancelActionLog();
        fullRender();
        return;
    }
    let pay = b.pay;
    let note = '';
    if (Math.random() < b.risk) {
        const dmg = 3 + Math.floor(Math.random() * 5);
        G.hp = Math.max(1, (G.hp || 1) - dmg);
        pay = Math.floor(pay * 0.7);
        note = ` A scuffle costs you ${dmg} HP.`;
    } else {
        note = ' Clean catch.';
    }
    G.stones = (G.stones || 0) + pay;
    commitActionLog(`🗡️ Bounty — ${b.name}: +${pay} Stones.${note} ${getRedwellSeatName('redwell_warden')} nods.`);
    fullRender();
}

// ----- Redwell jobs -----

function getThresholdJobDef(jobId) {
    return REDWELL_JOBS.find(j => j.id === jobId) || null;
}

function isThresholdJobDry(jobId) {
    ensureQcDepthState();
    const until = G.thresholdJobs.dryUntil[jobId] || 0;
    const now = G.ageMonths || 0;
    return now < until;
}

function actionThresholdWork(jobId) {
    if (G.gameOver || G.inCombat) return;
    ensureQcDepthState();
    if (!isAtRedwell()) {
        addLog('👷 Work boards are in Redwell. Walk there first.');
        fullRender();
        return;
    }
    if (typeof getWorldClockBusyReason === 'function') {
        const busy = getWorldClockBusyReason();
        if (busy) {
            addLog(`🔒 ${busy}`);
            fullRender();
            return;
        }
    }
    const job = getThresholdJobDef(jobId);
    if (!job) return;
    if (isThresholdJobDry(jobId)) {
        addLog(`👷 No ${job.name} work right now — that kind of job has run dry. Try another, or cultivate.`);
        fullRender();
        return;
    }
    // Live calendar: timed job project
    if (typeof isWorldClockLive === 'function' && isWorldClockLive() && typeof startWorldClockProject === 'function') {
        startWorldClockProject({
            id: 'threshold_job',
            kind: 'job',
            label: job.name,
            durationMonths: job.months,
            payload: { jobId },
            startLog: `👷 You take ${job.name} — about ${job.months} month${job.months === 1 ? '' : 's'} of work.`
        });
        document.getElementById('thresholdJobsPopup')?.classList.remove('active');
        fullRender();
        return;
    }
    beginActionLog();
    if (!advanceTime(job.months, job.name)) {
        cancelActionLog();
        fullRender();
        return;
    }
    applyThresholdJobResult(jobId, { commit: true });
}

function finishThresholdJobProject(jobId) {
    applyThresholdJobResult(jobId, { commit: false });
}

function applyThresholdJobResult(jobId, opts) {
    opts = opts || {};
    ensureQcDepthState();
    const job = getThresholdJobDef(jobId);
    if (!job) {
        addLog('👷 That job is gone.');
        return;
    }
    let pay = job.payMin + Math.floor(Math.random() * (job.payMax - job.payMin + 1));
    let eventLine = '';
    if (job.risk) {
        const roll = Math.random();
        if (roll < 0.55) {
            eventLine = ' Quiet run — the dunes stay kind.';
        } else if (roll < 0.75) {
            pay = Math.floor(pay * 1.25);
            eventLine = ' A merchant tips you for sharp eyes.';
        } else if (roll < 0.9) {
            const dmg = 2 + Math.floor(Math.random() * 4);
            G.hp = Math.max(1, (G.hp || 1) - dmg);
            pay = Math.floor(pay * 0.7);
            eventLine = ` Bandits test the line — you bleed (${dmg} HP) but finish the run.`;
        } else {
            pay = Math.floor(pay * 0.4);
            eventLine = ' A sand beast scatters the escort — thin pay, harder lessons.';
        }
    }
    G.stones = (G.stones || 0) + pay;
    const uses = (G.thresholdJobs.uses[jobId] || 0) + 1;
    G.thresholdJobs.uses[jobId] = uses;
    if (uses >= (job.dryOutAfter || 99)) {
        G.thresholdJobs.uses[jobId] = 0;
        G.thresholdJobs.dryUntil[jobId] = (G.ageMonths || 0) + 8 + Math.floor(Math.random() * 8);
        eventLine += ' That work has run dry for a while.';
    }
    const line = `👷 ${job.name}: +${pay} Stones.${eventLine}`;
    if (opts.commit && typeof commitActionLog === 'function') commitActionLog(line);
    else addLog(line);
    if (typeof maybeWarnDwellingRentRunway === 'function') maybeWarnDwellingRentRunway();
    fullRender();
}

function openThresholdJobsPopup() {
    if (G.gameOver || G.inCombat) return;
    ensureQcDepthState();
    if (!isAtRedwell()) {
        addLog('👷 Job boards are posted in Redwell.');
        fullRender();
        return;
    }
    const list = document.getElementById('thresholdJobsList');
    const popup = document.getElementById('thresholdJobsPopup');
    const title = popup?.querySelector('h2');
    if (title) title.textContent = '👷 Redwell Work Boards';
    if (!list || !popup) {
        const job = REDWELL_JOBS.find(j => !isThresholdJobDry(j.id)) || REDWELL_JOBS[0];
        actionThresholdWork(job.id);
        return;
    }
    const boss = getRedwellSeatName('redwell_well_boss');
    list.innerHTML = `<div class="desc" style="margin-bottom:8px;">${boss} posts what work still pays.</div>` + REDWELL_JOBS.map(job => {
        const dry = isThresholdJobDry(job.id);
        const pay = `${job.payMin}–${job.payMax}`;
        const risk = job.risk ? ' · Risk' : '';
        const status = dry ? 'No work of this kind right now' : `${job.months} mo · ${pay} Stones${risk} · Click to work`;
        return `<div class="popup-item${dry ? '' : ' can-buy'}" data-threshold-job="${job.id}" style="${dry ? 'opacity:0.55;' : 'cursor:pointer;'}">
            <div class="name">${job.emoji} ${job.name}</div>
            <div class="desc">${job.flavor}</div>
            <div class="desc" style="margin-top:4px;color:#d4a860;">${status}</div>
        </div>`;
    }).join('');
    list.querySelectorAll('[data-threshold-job]').forEach(row => {
        row.addEventListener('click', () => {
            const id = row.getAttribute('data-threshold-job');
            if (isThresholdJobDry(id)) return;
            popup.classList.remove('active');
            actionThresholdWork(id);
        });
    });
    popup.classList.add('active');
}

// ----- Dwelling (Redwell Inn / courtyard) -----

function actionRentThresholdRoom() {
    if (G.gameOver || G.inCombat) return;
    ensureQcDepthState();
    if (!isAtRedwell()) {
        addLog('🏠 Rooms to rent are at Redwell Inn.');
        fullRender();
        return;
    }
    if (G.dwelling.mode === 'owned') {
        addLog('🏠 You already own a courtyard in Redwell.');
        fullRender();
        return;
    }
    if (G.dwelling.mode === 'rent') {
        addLog('🏠 You already rent a room. Pay comes due with the months.');
        fullRender();
        return;
    }
    if ((G.stones || 0) < REDWELL_RENT.cost) {
        addLog(`🏠 Need ${REDWELL_RENT.cost} Stones for the first month's rent.`);
        fullRender();
        return;
    }
    G.stones -= REDWELL_RENT.cost;
    G.dwelling.mode = 'rent';
    G.dwelling.settlementId = 'redwell';
    G.dwelling.rentPaidThroughMonth = (G.ageMonths || 0) + 1;
    addLog(`🏠 ${getRedwellSeatName('redwell_innkeep')} takes your coin. You rent a room at Redwell Inn (−${REDWELL_RENT.cost} Stones).`);
    fullRender();
}

function actionBuyThresholdCourtyard() {
    if (G.gameOver || G.inCombat) return;
    ensureQcDepthState();
    if (!isAtRedwell()) {
        addLog('🏠 The sand-brick courtyard for sale is in Redwell.');
        fullRender();
        return;
    }
    const req = REDWELL_BUY.reqRealm || 1;
    if ((G.realmIdx || 0) < req) {
        addLog('🏠 The courtyard seller only deals with Foundation cultivators — come back when you\'ve broken through.');
        fullRender();
        return;
    }
    if (G.dwelling.mode === 'owned') {
        addLog('🏠 You already own a courtyard.');
        fullRender();
        return;
    }
    if ((G.stones || 0) < REDWELL_BUY.cost) {
        addLog(`🏠 The courtyard costs ${REDWELL_BUY.cost} Stones (have ${G.stones || 0}). A long grind — or keep renting.`);
        fullRender();
        return;
    }
    G.stones -= REDWELL_BUY.cost;
    G.dwelling.mode = 'owned';
    G.dwelling.settlementId = 'redwell';
    G.dwelling.rentPaidThroughMonth = 0;
    ensureDwellingStash();
    addLog(`🏠 You buy a sand-brick courtyard on Redwell\'s quiet edge (−${REDWELL_BUY.cost} Stones). Roof, chest, no rent — no cultivate boost. Open Lodge for your home.`);
    fullRender();
}

function tickDwellingRent() {
    ensureQcDepthState();
    if (G.dwelling.mode !== 'rent') return;
    const now = G.ageMonths || 0;
    let paidThrough = G.dwelling.rentPaidThroughMonth || now;
    let charged = 0;
    while (paidThrough <= now) {
        if ((G.stones || 0) < REDWELL_RENT.cost) {
            G.dwelling.mode = 'homeless';
            G.dwelling.settlementId = null;
            G.dwelling.rentPaidThroughMonth = paidThrough;
            addLog('🏠 You cannot pay rent — turned out onto Redwell\'s streets.');
            return;
        }
        G.stones -= REDWELL_RENT.cost;
        charged += 1;
        paidThrough += 1;
    }
    G.dwelling.rentPaidThroughMonth = paidThrough;
    if (charged === 1) addLog(`🏠 Rent due — ${REDWELL_RENT.cost} Stones for your Redwell Inn room.`);
    else if (charged > 1) addLog(`🏠 Rent for ${charged} months — ${charged * REDWELL_RENT.cost} Stones.`);
    if (typeof maybeWarnDwellingRentRunway === 'function') maybeWarnDwellingRentRunway();
}

function getDwellingRestMult() {
    ensureQcDepthState();
    if (G.dwelling.mode === 'owned') return 1.12;
    if (G.dwelling.mode === 'rent') return 1.06;
    return 0.92;
}

function getDwellingStatusLine() {
    ensureQcDepthState();
    if (G.dwelling.mode === 'owned') return `🏠 ${REDWELL_BUY.label} (owned)`;
    if (G.dwelling.mode === 'rent') return `🏠 ${REDWELL_RENT.label} (rent ${REDWELL_RENT.cost}/mo)`;
    return '🏠 Homeless';
}

const DWELLING_STASH_CAP = 12;

function ensureDwellingStash() {
    ensureQcDepthState();
    if (!G.dwelling.stash) G.dwelling.stash = { materials: {} };
    if (!G.dwelling.stash.materials) G.dwelling.stash.materials = {};
    return G.dwelling.stash;
}

function getDwellingStashLoad() {
    const mats = ensureDwellingStash().materials;
    return Object.values(mats).reduce((s, n) => s + (Number(n) || 0), 0);
}

function dwellingStashDepositMaterial(matId, qty) {
    qty = Math.max(1, Math.floor(qty || 1));
    if (G.dwelling?.mode !== 'owned') return { ok: false, message: 'Only an owned courtyard has a chest.' };
    if (typeof ensureAlchemyState === 'function') ensureAlchemyState();
    const have = G.alchemy?.materials?.[matId] || 0;
    if (have < qty) return { ok: false, message: 'Not enough of that reagent on you.' };
    if (getDwellingStashLoad() + qty > DWELLING_STASH_CAP) {
        return { ok: false, message: `Courtyard chest full (${getDwellingStashLoad()}/${DWELLING_STASH_CAP}).` };
    }
    G.alchemy.materials[matId] = have - qty;
    if (G.alchemy.materials[matId] <= 0) delete G.alchemy.materials[matId];
    const stash = ensureDwellingStash();
    stash.materials[matId] = (stash.materials[matId] || 0) + qty;
    const label = (typeof ALCHEMY_MATERIALS !== 'undefined' && ALCHEMY_MATERIALS[matId]?.name) || matId;
    return { ok: true, message: `Stashed ${qty}× ${label} in the courtyard chest.` };
}

function dwellingStashWithdrawMaterial(matId, qty) {
    qty = Math.max(1, Math.floor(qty || 1));
    const stash = ensureDwellingStash();
    const have = stash.materials[matId] || 0;
    if (have < qty) return { ok: false, message: 'Not in the chest.' };
    if (typeof ensureAlchemyState === 'function') ensureAlchemyState();
    stash.materials[matId] = have - qty;
    if (stash.materials[matId] <= 0) delete stash.materials[matId];
    G.alchemy.materials[matId] = (G.alchemy.materials[matId] || 0) + qty;
    const label = (typeof ALCHEMY_MATERIALS !== 'undefined' && ALCHEMY_MATERIALS[matId]?.name) || matId;
    return { ok: true, message: `Took ${qty}× ${label} from the chest.` };
}

function renderDwellingHomeBody(body, popup) {
    ensureQcDepthState();
    const owned = G.dwelling.mode === 'owned';
    const rent = G.dwelling.mode === 'rent';
    const restPct = owned ? '+12%' : '+6%';
    const title = owned ? REDWELL_BUY.label : REDWELL_RENT.label;
    const innkeep = getRedwellSeatName('redwell_innkeep');
    const fiction = owned
        ? 'Your sand-brick yard on Redwell\'s quiet edge — half-dead shade tree, reagent lean-to, cistern on the town well. Rest is steadier here. Cultivation speed still comes from manuals and formations, not the house.'
        : `A rented room at Redwell Inn. ${innkeep} keeps the common room downstairs. Rent comes due with the months.`;

    let stashHtml = '';
    if (owned) {
        ensureDwellingStash();
        const load = getDwellingStashLoad();
        const matEntries = Object.entries(G.dwelling.stash.materials || {});
        const pouch = (typeof ensureAlchemyState === 'function' ? (ensureAlchemyState(), G.alchemy?.materials) : G.alchemy?.materials) || {};
        const pouchEntries = Object.entries(pouch).filter(([, n]) => n > 0).slice(0, 8);
        stashHtml = `
            <div class="desc" style="margin:12px 0 6px;"><strong>Courtyard chest</strong> · ${load}/${DWELLING_STASH_CAP}</div>
            <div id="dwellingStashList" style="font-size:12px;color:#b0a090;margin-bottom:8px;">
                ${matEntries.length
                    ? matEntries.map(([id, n]) => {
                        const label = (typeof ALCHEMY_MATERIALS !== 'undefined' && ALCHEMY_MATERIALS[id]?.name) || id;
                        return `<div style="display:flex;justify-content:space-between;gap:8px;margin:4px 0;">
                            <span>${label} ×${n}</span>
                            <button type="button" class="zone-travel-btn dwelling-stash-out" data-mat="${id}" style="padding:2px 8px;font-size:11px;">Take 1</button>
                        </div>`;
                    }).join('')
                    : '<em>Empty — stash reagents from your pouch.</em>'}
            </div>
            ${pouchEntries.length ? `<div class="desc" style="margin-bottom:4px;">From pouch:</div>
                ${pouchEntries.map(([id, n]) => {
                    const label = (typeof ALCHEMY_MATERIALS !== 'undefined' && ALCHEMY_MATERIALS[id]?.name) || id;
                    return `<button type="button" class="zone-travel-btn dwelling-stash-in" data-mat="${id}" style="margin:2px 4px 2px 0;padding:4px 8px;font-size:11px;">Stash 1× ${label} (${n})</button>`;
                }).join('')}` : '<div class="desc">No reagents on you to stash.</div>'}
        `;
    }

    const feBuy = (G.realmIdx || 0) >= (REDWELL_BUY.reqRealm || 1);
    const buyLabel = feBuy
        ? `Buy courtyard · ${REDWELL_BUY.cost} Stones`
        : `Buy courtyard · FE required (${REDWELL_BUY.cost} Stones)`;

    body.innerHTML = `
        <div class="desc" style="margin-bottom:8px;"><strong>${title}</strong> · Redwell</div>
        <div class="desc" style="margin-bottom:10px;">${fiction}</div>
        <div class="desc" style="margin-bottom:12px;">Rest bonus: <strong>${restPct}</strong> HP from Recuperate / Rest here${rent ? ` · Rent ${REDWELL_RENT.cost} Stones/mo` : ''}.</div>
        <button type="button" class="zone-travel-btn" id="dwellingRestBtn">🛌 Rest here</button>
        ${rent ? `<button type="button" class="zone-travel-btn" id="dwellingBuyBtn" style="margin-top:8px;" ${feBuy ? '' : 'disabled'}>${buyLabel}</button>` : ''}
        <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
            <button type="button" class="zone-travel-btn" id="dwellingRumorBtn" style="padding:6px 10px;font-size:12px;">🍺 Drink / rumor · 2 Stones</button>
            <button type="button" class="zone-travel-btn" id="dwellingBountyBtn" style="padding:6px 10px;font-size:12px;">🗡️ Bounty board</button>
        </div>
        ${stashHtml}
    `;

    document.getElementById('dwellingRestBtn')?.addEventListener('click', () => {
        if (!isAtDwellingSettlement()) {
            addLog('🏠 Your lodging is in Redwell — travel back to rest there.');
            return;
        }
        popup.classList.remove('active');
        if (typeof actionRecuperate === 'function') actionRecuperate();
    });
    document.getElementById('dwellingBuyBtn')?.addEventListener('click', () => {
        popup.classList.remove('active');
        actionBuyThresholdCourtyard();
    });
    document.getElementById('dwellingRumorBtn')?.addEventListener('click', () => {
        actionRedwellRumor();
    });
    document.getElementById('dwellingBountyBtn')?.addEventListener('click', () => {
        popup.classList.remove('active');
        openRedwellBountyBoard();
    });
    body.querySelectorAll('.dwelling-stash-in').forEach(btn => {
        btn.addEventListener('click', () => {
            const res = dwellingStashDepositMaterial(btn.dataset.mat, 1);
            addLog(res.ok ? `🏠 ${res.message}` : `🏠 ${res.message}`);
            openDwellingPopup();
        });
    });
    body.querySelectorAll('.dwelling-stash-out').forEach(btn => {
        btn.addEventListener('click', () => {
            const res = dwellingStashWithdrawMaterial(btn.dataset.mat, 1);
            addLog(res.ok ? `🏠 ${res.message}` : `🏠 ${res.message}`);
            openDwellingPopup();
        });
    });
}

function openDwellingPopup() {
    const popup = document.getElementById('dwellingPopup');
    const body = document.getElementById('dwellingBody');
    if (!popup || !body) {
        if (isAtRedwell()) actionRentThresholdRoom();
        return;
    }
    ensureQcDepthState();
    const housed = G.dwelling.mode === 'rent' || G.dwelling.mode === 'owned';
    if (housed) {
        const title = popup.querySelector('h2');
        if (title) title.textContent = G.dwelling.mode === 'owned' ? '🏠 Your Courtyard' : '🏠 Redwell Inn';
        renderDwellingHomeBody(body, popup);
        popup.classList.add('active');
        return;
    }
    const title = popup.querySelector('h2');
    if (title) title.textContent = '🏠 Redwell Inn';
    const status = getDwellingStatusLine();
    const feBuy = (G.realmIdx || 0) >= (REDWELL_BUY.reqRealm || 1);
    const buyLabel = feBuy
        ? `Buy courtyard · ${REDWELL_BUY.cost} Stones`
        : `Buy courtyard · FE required (${REDWELL_BUY.cost} Stones)`;
    body.innerHTML = `
        <div class="desc" style="margin-bottom:10px;">${status}</div>
        <div class="desc" style="margin-bottom:12px;">Redwell — rent a room at the Inn, or (at Foundation) buy the sand-brick courtyard. Homeless is allowed; rest suffers a little.</div>
        <button type="button" class="zone-travel-btn" id="dwellingRentBtn">Rent room · ${REDWELL_RENT.cost} Stones</button>
        <button type="button" class="zone-travel-btn" id="dwellingBuyBtn" style="margin-top:8px;" ${feBuy ? '' : 'disabled'}>${buyLabel}</button>
        <div style="margin-top:12px;display:flex;flex-wrap:wrap;gap:6px;">
            <button type="button" class="zone-travel-btn" id="dwellingRumorBtn" style="padding:6px 10px;font-size:12px;">🍺 Drink / rumor · 2 Stones</button>
            <button type="button" class="zone-travel-btn" id="dwellingBountyBtn" style="padding:6px 10px;font-size:12px;">🗡️ Bounty board</button>
        </div>
    `;
    document.getElementById('dwellingRentBtn')?.addEventListener('click', () => {
        popup.classList.remove('active');
        actionRentThresholdRoom();
    });
    document.getElementById('dwellingBuyBtn')?.addEventListener('click', () => {
        popup.classList.remove('active');
        actionBuyThresholdCourtyard();
    });
    document.getElementById('dwellingRumorBtn')?.addEventListener('click', () => {
        actionRedwellRumor();
    });
    document.getElementById('dwellingBountyBtn')?.addEventListener('click', () => {
        popup.classList.remove('active');
        openRedwellBountyBoard();
    });
    popup.classList.add('active');
}

// ----- Qi-feel -----

function getPlayerQiPresenceScore() {
    let score = (G.realmIdx || 0) * 20;
    score += getQcBandPowerBonus();
    if (typeof getEffectiveFoundation === 'function') score += getEffectiveFoundation() * 1.5;
    if (typeof getQiDensity === 'function') score += getQiDensity() * 2;
    score += (G.power || 0) * 0.5;
    return score;
}

function getNpcQiPresenceScore(npc) {
    if (!npc) return 0;
    if (npc.isMortal || npc.mortal || npc.occupation === 'Mortal villager') return 0;
    const realm = npc.strengthRealm != null ? npc.strengthRealm
        : (npc.realmIdx != null ? npc.realmIdx : 0);
    let score = realm * 20 + 8;
    if (npc.power) score += npc.power * 0.5;
    if (npc.qiDensity) score += npc.qiDensity * 2;
    return score;
}

function describeQiFeelVsNpc(npc) {
    if (!npc) return null;
    if (npc.isMortal || npc.mortal || (npc.occupation && /villager|mortal/i.test(npc.occupation) && npc.strengthRealm == null)) {
        return 'Their presence is blank of cultivator qi — mortal.';
    }
    const yours = getPlayerQiPresenceScore();
    const theirs = getNpcQiPresenceScore(npc);
    if (theirs <= 0) return 'You feel no qi store in them — mortal, or deeply veiled.';
    const ratio = theirs / Math.max(1, yours);
    let cmp;
    if (ratio >= 1.6) cmp = 'Their qi feels much heavier than yours.';
    else if (ratio >= 1.2) cmp = 'Their qi feels denser than yours.';
    else if (ratio >= 0.85) cmp = 'Their qi feels about even with yours.';
    else if (ratio >= 0.55) cmp = 'Their qi feels thinner than yours.';
    else cmp = 'Their qi feels faint beside yours.';
    let element = '';
    const el = npc.element || npc.affinity || npc.rootElement;
    if (el && el !== 'neutral') {
        const hints = {
            fire: 'a dry heat under the breath',
            water: 'a damp water chill',
            wood: 'a green, growing pull',
            metal: 'a sharp metal bite',
            earth: 'a heavy earth stillness',
            wind: 'a restless wind edge',
            thunder: 'a storm-prickle',
            soul: 'a ghost-thin pressure'
        };
        element = hints[el] ? ` Faint hint — ${hints[el]}.` : '';
    }
    return cmp + element;
}

function logQiFeelForNpc(npc) {
    if (!isQiCondensationRealm() && (G.realmIdx || 0) > 2) return;
    const line = describeQiFeelVsNpc(npc);
    if (line) addLog(`👁️ Qi-feel: ${line}`);
}

// ----- Travel caution -----

function getZoneDangerRealm(zone) {
    if (!zone) return 0;
    return zone.dangerRealm != null ? zone.dangerRealm : (zone.minRealm || 0);
}

function zoneIsAboveStation(zoneId) {
    const zone = typeof ZONES !== 'undefined' ? ZONES[zoneId] : null;
    if (!zone) return false;
    return (G.realmIdx || 0) < getZoneDangerRealm(zone);
}

function confirmTravelAboveStation(zoneId) {
    ensureQcDepthState();
    if (!zoneIsAboveStation(zoneId)) return true;
    if (G.travelCautions[zoneId]) return true;
    const zone = ZONES[zoneId];
    const ok = confirm(
        `${zone?.emoji || ''} ${zone?.name || zoneId}\n\n` +
        `Reaching above your station is a good way to die. Be careful in such places.\n\n` +
        `Travel anyway?`
    );
    if (ok) G.travelCautions[zoneId] = true;
    return ok;
}

// ----- Progressive action UI -----

function setActionButtonHidden(btn, hide) {
    if (!btn) return;
    btn.hidden = !!hide;
    btn.classList.toggle('action-realm-hidden', !!hide);
    if (hide) {
        btn.setAttribute('aria-hidden', 'true');
        btn.style.setProperty('display', 'none', 'important');
    } else {
        btn.removeAttribute('aria-hidden');
        btn.style.removeProperty('display');
    }
    const wrap = btn.closest('.action-with-help');
    if (wrap) {
        wrap.hidden = !!hide;
        wrap.classList.toggle('action-realm-hidden', !!hide);
        if (hide) wrap.style.setProperty('display', 'none', 'important');
        else wrap.style.removeProperty('display');
    }
}

function applyQcProgressiveActionUi() {
    // Belt-and-suspenders: html class + hard hide. Never force-show Dao/Forbidden when leaving QC
    // (distance policy may still require them hidden at early FE).
    const qc = typeof isQiCondensationRealm === 'function' && isQiCondensationRealm();
    document.documentElement.classList.toggle('at-qi-condensation', !!qc);

    const sealBtn = document.getElementById('btnConsolidate');
    const sealHelp = document.getElementById('helpConsolidate');
    setActionButtonHidden(sealBtn, qc);
    if (sealHelp) {
        sealHelp.hidden = !!qc;
        if (qc) sealHelp.style.setProperty('display', 'none', 'important');
        else sealHelp.style.removeProperty('display');
    }

    if (qc) {
        setActionButtonHidden(document.getElementById('btnDao'), true);
        setActionButtonHidden(document.getElementById('btnForbidden'), true);
        setActionButtonHidden(document.getElementById('btnMeridian'), true);
    } else if (typeof applyActionShowPolicy === 'function' && typeof ACTION_UNLOCK_BUTTONS !== 'undefined') {
        ['dao', 'forbidden', 'meridian'].forEach(actionId => {
            const btn = document.getElementById(ACTION_UNLOCK_BUTTONS[actionId]);
            if (btn) applyActionShowPolicy(btn, actionId);
        });
    }

    const breakBtn = document.getElementById('btnBreakthrough');
    const breakWrap = breakBtn?.closest('.action-with-help');
    if (qc) {
        const stage = getQcBandStage();
        const showBreak = stage === 'mid' || stage === 'late' || stage === 'peak';
        if (breakWrap) {
            breakWrap.hidden = !showBreak;
            breakWrap.classList.toggle('action-realm-hidden', !showBreak);
            if (showBreak) breakWrap.style.removeProperty('display');
            else breakWrap.style.setProperty('display', 'none', 'important');
        }
        if (breakBtn && showBreak && !hasQcBandBreakthroughReady()) {
            breakBtn.classList.add('action-locked');
            breakBtn.disabled = true;
            breakBtn.title = '🔒 Reach Late Qi Condensation by gathering qi, then Break Through.';
        }
    } else if (breakWrap) {
        breakWrap.hidden = false;
        breakWrap.classList.remove('action-realm-hidden');
        breakWrap.style.removeProperty('display');
    }
}

function renderQcBandChip() {
    const el = document.getElementById('qcBandChip');
    if (!el) return;
    const label = getQcBandLabel();
    if (!label || !isQiCondensationRealm()) {
        el.style.display = 'none';
        return;
    }
    el.style.display = '';
    const pct = getQcBandProgressPct();
    const stage = getQcBandStage();
    const nextHint = stage === 'peak' ? 'Peak' : `→ ${QC_BAND_LABELS[{ early: 'mid', mid: 'late', late: 'peak' }[stage]] || ''}`;
    el.textContent = stage === 'peak'
        ? `✦ ${label}`
        : `✦ ${label} · ${pct}% ${nextHint}`;
}

function getQcOverallBandFillPct() {
    if (!isQiCondensationRealm()) return 0;
    ensureQcDepthState();
    const prog = G.qcBand.gatherProgress || 0;
    const peak = QC_BAND_THRESHOLDS.peak || 1;
    return Math.min(100, Math.floor((prog / peak) * 100));
}

function renderChamberQcBandMeter() {
    const meter = document.getElementById('chamberBandMeter');
    if (!meter) return;
    const qc = isQiCondensationRealm();
    meter.hidden = !qc;
    if (!qc) return;

    const summary = typeof getQcBandMeterSummary === 'function' ? getQcBandMeterSummary() : null;
    const labelEl = document.getElementById('chamberBandMeterLabel');
    const hintEl = document.getElementById('chamberBandMeterHint');
    const fillEl = document.getElementById('chamberBandMeterFill');
    const stage = getQcBandStage();
    const overall = getQcOverallBandFillPct();
    const within = getQcBandProgressPct();

    if (labelEl) {
        labelEl.textContent = stage === 'peak'
            ? (summary?.label || 'Peak Qi Condensation')
            : `${summary?.label || getQcBandLabel()} · ${within}%`;
    }
    if (hintEl) hintEl.textContent = summary?.hint || 'Gather Qi to deepen your store.';
    if (fillEl) fillEl.style.width = `${overall}%`;

    meter.classList.toggle('ready', !!summary?.ready);
    meter.classList.toggle('at-late', stage === 'late' || stage === 'peak');
    meter.classList.toggle('at-peak', stage === 'peak');
}

function applyQcChamberVerbVisibility() {
    const hide = isQiCondensationRealm();
    const shell = document.querySelector('#qiChamberOverlay .chamber-shell');
    if (shell) shell.classList.toggle('chamber-qc-mode', hide);

    ['chamberExpandDantian', 'chamberPerfectFoundation', 'chamberCondenseCore'].forEach(id => {
        const btn = document.getElementById(id);
        const wrap = btn?.closest('.chamber-action-wrap');
        if (wrap) wrap.style.display = hide ? 'none' : '';
        else if (btn) btn.style.display = hide ? 'none' : '';
    });

    const gatherWrap = document.getElementById('chamberGatherQi')?.closest('.chamber-action-wrap');
    if (gatherWrap) {
        gatherWrap.classList.toggle('chamber-action-wrap-gather-solo', hide);
    }

    const foundationStat = document.querySelector('#qiChamberOverlay .chamber-stat-foundation');
    if (foundationStat) foundationStat.style.display = hide ? 'none' : '';

    const subtitle = document.querySelector('#qiChamberOverlay .chamber-subtitle');
    if (subtitle) {
        subtitle.textContent = hide
            ? 'Gather and store qi. Capacity grows when your store settles into a deeper band.'
            : 'The void hums. Your dantian awaits.';
    }

    const hint = document.getElementById('chamberStatsHint');
    if (hint) {
        hint.textContent = hide
            ? 'Night circulation fills your store slowly — gather in the chamber for focused progress.'
            : 'Density = refinement · Capacity = max Qi · Foundation = cultivation base quality (Crude → Peerless)';
    }

    renderChamberQcBandMeter();
}

/** @deprecated — use getPassiveGatherUnits from passive-cultivation.js */
function getQcStanceGatherUnits() {
    return typeof getPassiveGatherUnits === 'function' ? getPassiveGatherUnits() : 0.15;
}

/** Store-fill pills (Driftburst / Sunscar Burst / Marrowfall). */
function applyQcStoreFillPill(units, label) {
    if (!isQiCondensationRealm()) {
        const fill = Math.floor(getMaxQi() * Math.min(0.35, units * 0.01));
        G.qi = Math.min(getMaxQi(), (G.qi || 0) + fill);
        clampCurrentQi();
        return `Qi stirs (+${fill}) — store bands need QC realm.`;
    }
    const before = G.qcBand?.gatherProgress || 0;
    applyQcGatherBandProgress(units);
    const after = G.qcBand?.gatherProgress || 0;
    const gained = Math.round((after - before) * 10) / 10;
    const bandNote = typeof getQcBandLabel === 'function' ? getQcBandLabel() : '';
    return `Store +${gained} progress (${bandNote || 'qi store'} now ${Math.round(after)}).`;
}

function getFieldSiteId() {
    const loc = typeof getCurrentLocationId === 'function' ? getCurrentLocationId() : null;
    if (loc && FIELD_SITE_DEFS[loc]) return loc;
    return null;
}

function rollFieldSiteMaterial(siteId) {
    const def = FIELD_SITE_DEFS[siteId];
    if (!def?.materials?.length) return false;
    const pool = def.materials;
    const total = pool.reduce((s, p) => s + p.w, 0);
    let roll = Math.random() * total;
    let chosen = pool[0].id;
    for (const entry of pool) {
        roll -= entry.w;
        if (roll <= 0) { chosen = entry.id; break; }
    }
    const qty = Math.random() < 0.14 ? 2 : 1;
    if (typeof ensureAlchemyState === 'function') ensureAlchemyState();
    if (typeof addAlchemyMaterial === 'function' && addAlchemyMaterial(chosen, qty)) {
        const mat = typeof getAlchemyMaterialDef === 'function' ? getAlchemyMaterialDef(chosen) : ALCHEMY_MATERIALS?.[chosen];
        addLog(`🌿 ${def.label}: +${qty} ${mat?.emoji || ''} ${mat?.name || chosen}.`);
        return true;
    }
    addLog(`🌿 ${def.label} — traces of reagents, nothing pocketable.`);
    return false;
}

function tryStartFieldSiteCombat(source) {
    if (G.gameOver || G.inCombat || (typeof isTribulationActive === 'function' && isTribulationActive())) return false;
    const siteId = getFieldSiteId();
    const def = siteId ? FIELD_SITE_DEFS[siteId] : null;
    if (!def) return false;
    let chance = source === 'travel' ? (ENCOUNTER_BALANCE?.travelChance || 0.22) : (ENCOUNTER_BALANCE?.exploreChance || 0.28);
    if (typeof getDaoAlignmentEncounterChanceMult === 'function') chance *= getDaoAlignmentEncounterChanceMult();
    if (Math.random() >= chance) return false;
    const eliteRoll = def.elite && Math.random() < (def.eliteChance || 0.12);
    const combatKey = eliteRoll
        ? def.elite
        : def.commons[Math.floor(Math.random() * def.commons.length)];
    if (!combatKey || !ENCOUNTER_ENEMIES?.[combatKey]) return false;
    if (typeof startEncounterCombat === 'function') {
        addLog(`⚔️ ${ENCOUNTER_ENEMIES[combatKey].name} — ${def.label}!`);
        startEncounterCombat(combatKey);
        return true;
    }
    return false;
}

/** Explore miss → field reagents (not pity stones). */
function rollExploreFieldMaterial(zoneId) {
    const siteId = getFieldSiteId();
    if (siteId) return rollFieldSiteMaterial(siteId);
    const z = zoneId || (typeof getLootZoneId === 'function' ? getLootZoneId() : (G.currentZone || currentZone));
    const zonePools = {
        dustbone: [
            { id: 'spirit_herb', w: 28 }, { id: 'iron_ore', w: 22 }, { id: 'silk_thread', w: 18 },
            { id: 'leather_scrap', w: 14 }, { id: 'spirit_dew', w: 10 }, { id: 'earth_marrow', w: 5 }, { id: 'rare_herb', w: 3 }
        ],
        jade: [
            { id: 'spirit_herb', w: 22 }, { id: 'silk_thread', w: 20 }, { id: 'jade_inlay', w: 8 },
            { id: 'spirit_dew', w: 16 }, { id: 'soul_mist', w: 10 }, { id: 'leather_scrap', w: 14 }, { id: 'rare_herb', w: 6 }
        ],
        emberwild: [
            { id: 'spirit_herb', w: 20 }, { id: 'demon_core', w: 10 }, { id: 'leather_scrap', w: 18 },
            { id: 'blood_crystal', w: 14 }, { id: 'iron_ore', w: 16 }, { id: 'phoenix_ash', w: 2 }, { id: 'rare_herb', w: 8 }
        ],
        frostbite: [
            { id: 'frost_essence', w: 18 }, { id: 'spirit_herb', w: 20 }, { id: 'glacial_shard', w: 8 },
            { id: 'leather_scrap', w: 16 }, { id: 'iron_ore', w: 14 }, { id: 'spirit_dew', w: 12 }, { id: 'rare_herb', w: 6 }
        ],
        heartlands: [
            { id: 'spirit_herb', w: 22 }, { id: 'spirit_dew', w: 18 }, { id: 'foundation_root', w: 6 },
            { id: 'jade_inlay', w: 8 }, { id: 'iron_ore', w: 14 }, { id: 'rare_herb', w: 10 }, { id: 'earth_marrow', w: 8 }
        ]
    };
    const pool = zonePools[z] || zonePools.dustbone;
    const total = pool.reduce((s, p) => s + p.w, 0);
    let roll = Math.random() * total;
    let chosen = pool[0].id;
    for (const entry of pool) {
        roll -= entry.w;
        if (roll <= 0) { chosen = entry.id; break; }
    }
    const qty = Math.random() < 0.18 ? 2 : 1;
    if (typeof ALCHEMY_MATERIALS !== 'undefined' && ALCHEMY_MATERIALS[chosen] && typeof addAlchemyMaterial === 'function') {
        if (typeof ensureAlchemyState === 'function') ensureAlchemyState();
        addAlchemyMaterial(chosen, qty);
        const mat = typeof getAlchemyMaterialDef === 'function' ? getAlchemyMaterialDef(chosen) : ALCHEMY_MATERIALS[chosen];
        addLog(`🌿 Field gather: +${qty} ${mat?.emoji || ''} ${mat?.name || chosen}.`);
        return true;
    }
    if (typeof CRAFT_MATERIALS !== 'undefined' && CRAFT_MATERIALS[chosen] && typeof addCraftMaterial === 'function') {
        addCraftMaterial(chosen, qty);
        const mat = CRAFT_MATERIALS[chosen];
        addLog(`⛏️ Field gather: +${qty} ${mat.emoji || ''} ${mat.name}.`);
        return true;
    }
    addLog('🌿 You search the wilds — traces of reagents, nothing you can pocket.');
    return false;
}

function getQcBandMeterSummary() {
    if (!isQiCondensationRealm()) return null;
    ensureQcDepthState();
    const stage = getQcBandStage();
    const pct = getQcBandProgressPct();
    const label = getQcBandLabel();
    let hint = 'Gather Qi to deepen your store.';
    if (!hasFormalCultivationMethod?.()) {
        hint = 'Bare breath circulates each night — slow. Buy a manual at Redwell, then gather here for focused progress.';
    }
    if (stage === 'late') hint = 'Break Through when ready — or keep gathering toward Peak.';
    if (stage === 'peak') hint = 'Peak store — Break Through for a harder tribulation, more power from this realm.';
    if (stage === 'mid') hint = 'Mid store holding — gather toward Late to unlock Break Through.';
    if (stage === 'early') hint = 'Early draws — gather until the store settles into Mid.';
    return {
        pct: stage === 'peak' ? 100 : pct,
        label: label || 'Qi Condensation',
        hint,
        ready: hasQcBandBreakthroughReady(),
        consolidated: false
    };
}
