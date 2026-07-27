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

const THRESHOLD_JOBS = [
    {
        id: 'loader',
        name: 'Caravan Loader',
        emoji: '📦',
        months: 2,
        payMin: 18,
        payMax: 32,
        risk: false,
        dryOutAfter: 4,
        flavor: 'Haul crates for the Dune Riders under Threshold\'s walls.'
    },
    {
        id: 'copyist',
        name: 'Registry Copyist',
        emoji: '📜',
        months: 2,
        payMin: 22,
        payMax: 36,
        risk: false,
        dryOutAfter: 3,
        flavor: 'Copy census slips so the pin stays quiet.'
    },
    {
        id: 'well_attendant',
        name: 'Well Attendant',
        emoji: '💧',
        months: 1,
        payMin: 12,
        payMax: 22,
        risk: false,
        dryOutAfter: 5,
        flavor: 'Keep the Order Anchor spring clear — quiet, necessary work.'
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
        flavor: 'Sweep oath-road totems before the next caravan arrives.'
    },
    {
        id: 'short_escort',
        name: 'Dune Escort',
        emoji: '🗡️',
        months: 3,
        payMin: 40,
        payMax: 70,
        risk: true,
        dryOutAfter: 2,
        flavor: 'Guard a short run to Miraj. Bandits and beasts notice.'
    }
];

const THRESHOLD_RENT = { months: 1, cost: 8, label: 'Rented room' };
const THRESHOLD_BUY = { cost: 420, label: 'Courtyard house' };

function ensureQcDepthState() {
    if (!G.qcBand) {
        G.qcBand = { stage: 'early', gatherProgress: 0, capacityGranted: { mid: false, late: false, peak: false } };
    }
    if (!G.qcBand.capacityGranted) G.qcBand.capacityGranted = { mid: false, late: false, peak: false };
    if (!G.thresholdJobs) G.thresholdJobs = { uses: {}, dryUntil: {} };
    if (!G.dwelling) {
        G.dwelling = { mode: 'homeless', settlementId: null, rentPaidThroughMonth: 0 };
    }
    if (!G.travelCautions) G.travelCautions = {};
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

// ----- Threshold jobs -----

function isAtThresholdCity() {
    const loc = typeof getCurrentLocationId === 'function' ? getCurrentLocationId() : G.currentLocation;
    return loc === 'bone_crossroads' || (!loc && (G.currentZone || currentZone) === 'dustbone');
}

function getThresholdJobDef(jobId) {
    return THRESHOLD_JOBS.find(j => j.id === jobId) || null;
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
    if (!isAtThresholdCity()) {
        addLog('👷 Work boards are at Threshold City. Walk there first.');
        fullRender();
        return;
    }
    const job = getThresholdJobDef(jobId);
    if (!job) return;
    if (isThresholdJobDry(jobId)) {
        addLog(`👷 No ${job.name} work right now — that kind of job has run dry. Try another, or cultivate.`);
        fullRender();
        return;
    }
    beginActionLog();
    if (!advanceTime(job.months, job.name)) {
        cancelActionLog();
        fullRender();
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
    commitActionLog(`👷 ${job.name}: +${pay} Stones.${eventLine}`);
    fullRender();
}

function openThresholdJobsPopup() {
    if (G.gameOver || G.inCombat) return;
    ensureQcDepthState();
    if (!isAtThresholdCity()) {
        addLog('👷 Job boards are posted in Threshold City.');
        fullRender();
        return;
    }
    const list = document.getElementById('thresholdJobsList');
    const popup = document.getElementById('thresholdJobsPopup');
    if (!list || !popup) {
        // Fallback: run first available steady job
        const job = THRESHOLD_JOBS.find(j => !isThresholdJobDry(j.id)) || THRESHOLD_JOBS[0];
        actionThresholdWork(job.id);
        return;
    }
    list.innerHTML = THRESHOLD_JOBS.map(job => {
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

// ----- Dwelling -----

function actionRentThresholdRoom() {
    if (G.gameOver || G.inCombat) return;
    ensureQcDepthState();
    if (!isAtThresholdCity()) {
        addLog('🏠 Rooms to rent are in Threshold City.');
        fullRender();
        return;
    }
    if (G.dwelling.mode === 'owned') {
        addLog('🏠 You already own a courtyard here.');
        fullRender();
        return;
    }
    if (G.dwelling.mode === 'rent') {
        addLog('🏠 You already rent a room. Pay comes due with the months.');
        fullRender();
        return;
    }
    if ((G.stones || 0) < THRESHOLD_RENT.cost) {
        addLog(`🏠 Need ${THRESHOLD_RENT.cost} Stones for the first month's rent.`);
        fullRender();
        return;
    }
    G.stones -= THRESHOLD_RENT.cost;
    G.dwelling.mode = 'rent';
    G.dwelling.settlementId = 'bone_crossroads';
    G.dwelling.rentPaidThroughMonth = (G.ageMonths || 0) + 1;
    addLog(`🏠 You rent a room in Threshold City (−${THRESHOLD_RENT.cost} Stones). A place to rest and cultivate.`);
    fullRender();
}

function actionBuyThresholdCourtyard() {
    if (G.gameOver || G.inCombat) return;
    ensureQcDepthState();
    if (!isAtThresholdCity()) {
        addLog('🏠 Courtyards for sale are in Threshold City.');
        fullRender();
        return;
    }
    if (G.dwelling.mode === 'owned') {
        addLog('🏠 You already own a courtyard.');
        fullRender();
        return;
    }
    if ((G.stones || 0) < THRESHOLD_BUY.cost) {
        addLog(`🏠 The courtyard costs ${THRESHOLD_BUY.cost} Stones (have ${G.stones || 0}). A long grind — or keep renting.`);
        fullRender();
        return;
    }
    G.stones -= THRESHOLD_BUY.cost;
    G.dwelling.mode = 'owned';
    G.dwelling.settlementId = 'bone_crossroads';
    G.dwelling.rentPaidThroughMonth = 0;
    ensureDwellingStash();
    addLog(`🏠 You buy a courtyard house in Threshold City (−${THRESHOLD_BUY.cost} Stones). Open Lodge to enter your home.`);
    fullRender();
}

function tickDwellingRent() {
    ensureQcDepthState();
    if (G.dwelling.mode !== 'rent') return;
    const now = G.ageMonths || 0;
    let paidThrough = G.dwelling.rentPaidThroughMonth || now;
    let charged = 0;
    while (paidThrough <= now) {
        if ((G.stones || 0) < THRESHOLD_RENT.cost) {
            G.dwelling.mode = 'homeless';
            G.dwelling.settlementId = null;
            G.dwelling.rentPaidThroughMonth = paidThrough;
            addLog('🏠 You cannot pay rent — turned out onto the Threshold streets.');
            return;
        }
        G.stones -= THRESHOLD_RENT.cost;
        charged += 1;
        paidThrough += 1;
    }
    G.dwelling.rentPaidThroughMonth = paidThrough;
    if (charged === 1) addLog(`🏠 Rent due — ${THRESHOLD_RENT.cost} Stones for your Threshold room.`);
    else if (charged > 1) addLog(`🏠 Rent for ${charged} months — ${charged * THRESHOLD_RENT.cost} Stones.`);
}

function getDwellingRestMult() {
    ensureQcDepthState();
    if (G.dwelling.mode === 'owned') return 1.12;
    if (G.dwelling.mode === 'rent') return 1.06;
    return 0.92;
}

function getDwellingStatusLine() {
    ensureQcDepthState();
    if (G.dwelling.mode === 'owned') return `🏠 ${THRESHOLD_BUY.label} (owned)`;
    if (G.dwelling.mode === 'rent') return `🏠 ${THRESHOLD_RENT.label} (rent ${THRESHOLD_RENT.cost}/mo)`;
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
    const title = owned ? THRESHOLD_BUY.label : THRESHOLD_RENT.label;
    const fiction = owned
        ? 'Your courtyard under the Law of Dust — a personal anchor. Rest here heals better than street sleep.'
        : 'A rented room in Threshold City. Rent comes due with the months. Rest is steadier than the street.';

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

    body.innerHTML = `
        <div class="desc" style="margin-bottom:8px;"><strong>${title}</strong> · Threshold City</div>
        <div class="desc" style="margin-bottom:10px;">${fiction}</div>
        <div class="desc" style="margin-bottom:12px;">Rest bonus: <strong>${restPct}</strong> HP from Recuperate / Rest here${rent ? ` · Rent ${THRESHOLD_RENT.cost} Stones/mo` : ''}.</div>
        <button type="button" class="zone-travel-btn" id="dwellingRestBtn">🛌 Rest here</button>
        ${rent ? `<button type="button" class="zone-travel-btn" id="dwellingBuyBtn" style="margin-top:8px;">Buy courtyard · ${THRESHOLD_BUY.cost} Stones</button>` : ''}
        ${stashHtml}
    `;

    document.getElementById('dwellingRestBtn')?.addEventListener('click', () => {
        if (!isAtThresholdCity()) {
            addLog('🏠 Your lodging is in Threshold City — travel back to rest there.');
            return;
        }
        popup.classList.remove('active');
        if (typeof actionRecuperate === 'function') actionRecuperate();
    });
    document.getElementById('dwellingBuyBtn')?.addEventListener('click', () => {
        popup.classList.remove('active');
        actionBuyThresholdCourtyard();
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
        if (isAtThresholdCity()) actionRentThresholdRoom();
        return;
    }
    ensureQcDepthState();
    const housed = G.dwelling.mode === 'rent' || G.dwelling.mode === 'owned';
    if (housed) {
        const title = popup.querySelector('h2');
        if (title) title.textContent = G.dwelling.mode === 'owned' ? '🏠 Your Courtyard' : '🏠 Your Room';
        renderDwellingHomeBody(body, popup);
        popup.classList.add('active');
        return;
    }
    const title = popup.querySelector('h2');
    if (title) title.textContent = '🏠 Lodging';
    const status = getDwellingStatusLine();
    body.innerHTML = `
        <div class="desc" style="margin-bottom:10px;">${status}</div>
        <div class="desc" style="margin-bottom:12px;">Threshold City — rent a room, or grind toward a courtyard. Homeless is allowed; rest suffers a little.</div>
        <button type="button" class="zone-travel-btn" id="dwellingRentBtn">Rent room · ${THRESHOLD_RENT.cost} Stones</button>
        <button type="button" class="zone-travel-btn" id="dwellingBuyBtn" style="margin-top:8px;">Buy courtyard · ${THRESHOLD_BUY.cost} Stones</button>
    `;
    document.getElementById('dwellingRentBtn')?.addEventListener('click', () => {
        popup.classList.remove('active');
        actionRentThresholdRoom();
    });
    document.getElementById('dwellingBuyBtn')?.addEventListener('click', () => {
        popup.classList.remove('active');
        actionBuyThresholdCourtyard();
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
            ? 'Gather fills your Qi Store bar · Capacity rises on band mini-breakthroughs · Break Through from Late+'
            : 'Density = refinement · Capacity = max Qi · Foundation = cultivation base quality (Crude → Peerless)';
    }

    renderChamberQcBandMeter();
}

/** Explore miss → field reagents (not pity stones). */
function rollExploreFieldMaterial(zoneId) {
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
