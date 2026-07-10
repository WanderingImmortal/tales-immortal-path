// ============================================
// SECT-BUILDINGS.JS — Per-building actions & yields
// ============================================

function ensureSectBuildingMeta() {
    ensureSectInventory();
    if (!G.sect.buildingMeta.treasury) {
        G.sect.buildingMeta.treasury = { pendingTithe: 0 };
    }
    if (!G.sect.buildingMeta.training_ground) {
        G.sect.buildingMeta.training_ground = { lastSparMonths: null };
    }
    if (typeof ensureManualHallMeta === 'function') ensureManualHallMeta();
}

// ----- Manual Hall — deposit manuals, disciple study -----

function ensureManualHallMeta() {
    ensureSectState();
    if (!G.sect.buildingMeta) G.sect.buildingMeta = {};
    if (!G.sect.buildingMeta.manual_hall) {
        G.sect.buildingMeta.manual_hall = { collection: {}, studies: [] };
    }
    const mh = G.sect.buildingMeta.manual_hall;
    if (!mh.collection) mh.collection = {};
    if (!mh.studies) mh.studies = [];
}

function ensureDiscipleKnownTechniques(disciple) {
    if (!disciple.knownTechniques) disciple.knownTechniques = [];
}

function getManualHallCapacity() {
    return typeof getSectBuildingBonus === 'function' ? getSectBuildingBonus('manualHallCapacity') : 0;
}

function getManualStudySlots() {
    return typeof getSectBuildingBonus === 'function' ? getSectBuildingBonus('manualStudySlots') : 0;
}

function countManualHallUnique() {
    ensureManualHallMeta();
    return Object.keys(G.sect.buildingMeta.manual_hall.collection).length;
}

function countManualHallCopies() {
    ensureManualHallMeta();
    return Object.values(G.sect.buildingMeta.manual_hall.collection)
        .reduce((n, e) => n + (e.count || 0), 0);
}

function getManualHallEntry(techName) {
    ensureManualHallMeta();
    return G.sect.buildingMeta.manual_hall.collection[techName] || null;
}

function getActiveManualStudies() {
    ensureManualHallMeta();
    return G.sect.buildingMeta.manual_hall.studies.slice();
}

function getDiscipleByUid(uid) {
    ensureSectState();
    return G.sect.discipleRecords.find(d => d.uid === uid) || null;
}

function isDiscipleStudying(discipleUid) {
    ensureManualHallMeta();
    return G.sect.buildingMeta.manual_hall.studies.some(s => s.discipleUid === discipleUid);
}

function getDiscipleStudySpeedMult(disciple) {
    const b = MANUAL_HALL_BALANCE;
    const roleMult = b.roleStudySpeed?.[disciple.role] ?? 1;
    const traitMult = b.traitStudySpeed?.[disciple.trait] ?? 1;
    const daoPct = typeof getSectBuildingBonus === 'function' ? getSectBuildingBonus('daoSpeedPct') : 0;
    const hallPct = typeof getSectBuildingBonus === 'function' ? getSectBuildingBonus('studySpeedPct') : 0;
    const sectMult = 1 + (daoPct + hallPct) / 100;
    return roleMult * traitMult * sectMult;
}

function getDiscipleStudyMonths(template) {
    if (!template || typeof getComprehendManualMonths !== 'function') return 6;
    const base = getComprehendManualMonths(template);
    const mult = MANUAL_HALL_BALANCE?.studyMonthsMult ?? 3;
    return Math.max(1, Math.ceil(base * mult));
}

function getDiscipleStudyBlockReason(discipleUid, techName) {
    if (getBuildingLevel('manual_hall') < 1) return 'Build the Manual Hall first.';
    const disciple = getDiscipleByUid(discipleUid);
    if (!disciple) return 'Disciple not found.';
    ensureDiscipleKnownTechniques(disciple);
    if (disciple.knownTechniques.includes(techName)) return `${disciple.name} already knows this art.`;
    if (isDiscipleStudying(discipleUid)) return `${disciple.name} is already studying.`;
    const entry = getManualHallEntry(techName);
    if (!entry || entry.count < 1) return 'No copy of that manual in the hall.';
    const active = getActiveManualStudies().length;
    const slots = getManualStudySlots();
    if (active >= slots) return `All ${slots} study slot${slots !== 1 ? 's' : ''} are occupied.`;
    const template = TECHNIQUE_POOL.find(t => t.name === techName);
    if (!template) return 'Unknown technique.';
    return null;
}

function depositManualToHall(techName, qty) {
    if (getBuildingLevel('manual_hall') < 1) {
        return { success: false, message: 'Build the Manual Hall first.' };
    }
    const template = TECHNIQUE_POOL.find(t => t.name === techName);
    if (!template) return { success: false, message: 'Unknown manual.' };
    const shelfEntry = typeof getManualShelfEntry === 'function' ? getManualShelfEntry(techName) : null;
    const amount = Math.min(qty || 1, shelfEntry?.count || 0);
    if (amount <= 0) return { success: false, message: 'No copies in your travel kit.' };
    ensureManualHallMeta();
    const collection = G.sect.buildingMeta.manual_hall.collection;
    const isNew = !collection[techName];
    const cap = getManualHallCapacity();
    if (isNew && countManualHallUnique() >= cap) {
        return { success: false, message: `Hall archive full (${cap} unique titles). Upgrade or withdraw manuals.` };
    }
    if (typeof removeManualFromShelf === 'function') removeManualFromShelf(techName, amount);
    if (collection[techName]) {
        collection[techName].count += amount;
    } else {
        collection[techName] = {
            technique: techName,
            count: amount,
            quality: shelfEntry?.quality || 'clean',
            source: shelfEntry?.source || null
        };
    }
    return {
        success: true,
        message: `Deposited ${amount}× ${techName} into the Manual Hall.`,
        deposited: amount
    };
}

function withdrawManualFromHall(techName, qty) {
    if (getBuildingLevel('manual_hall') < 1) {
        return { success: false, message: 'Build the Manual Hall first.' };
    }
    ensureManualHallMeta();
    const entry = getManualHallEntry(techName);
    const amount = Math.min(qty || 1, entry?.count || 0);
    if (amount <= 0) return { success: false, message: 'No copies in the hall.' };
    if (getActiveManualStudies().some(s => s.techName === techName)) {
        return { success: false, message: 'Cannot withdraw — a disciple is studying this manual.' };
    }
    entry.count -= amount;
    if (entry.count <= 0) delete G.sect.buildingMeta.manual_hall.collection[techName];
    if (typeof grantManual === 'function') {
        for (let i = 0; i < amount; i++) grantManual(techName, { silent: true });
    }
    return {
        success: true,
        message: `Withdrew ${amount}× ${techName} to your travel kit.`,
        withdrawn: amount
    };
}

function assignDiscipleStudy(discipleUid, techName) {
    const block = getDiscipleStudyBlockReason(discipleUid, techName);
    if (block) return { success: false, message: block };
    const disciple = getDiscipleByUid(discipleUid);
    const template = TECHNIQUE_POOL.find(t => t.name === techName);
    const totalMonths = getDiscipleStudyMonths(template);
    ensureManualHallMeta();
    const study = {
        uid: `study_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
        discipleUid,
        discipleName: disciple.name,
        techName,
        progressMonths: 0,
        totalMonths,
        startedMonths: G.ageMonths || 0
    };
    G.sect.buildingMeta.manual_hall.studies.push(study);
    const monthsLabel = Math.ceil(totalMonths / getDiscipleStudySpeedMult(disciple));
    return {
        success: true,
        message: `${disciple.name} begins studying ${techName} (~${monthsLabel} months).`,
        study
    };
}

function cancelDiscipleStudy(studyUid) {
    ensureManualHallMeta();
    const studies = G.sect.buildingMeta.manual_hall.studies;
    const idx = studies.findIndex(s => s.uid === studyUid);
    if (idx < 0) return { success: false, message: 'Study assignment not found.' };
    const study = studies[idx];
    studies.splice(idx, 1);
    return {
        success: true,
        message: `${study.discipleName} stops studying ${study.techName}. Progress lost.`
    };
}

function completeDiscipleStudy(study) {
    const disciple = getDiscipleByUid(study.discipleUid);
    if (!disciple) return;
    ensureDiscipleKnownTechniques(disciple);
    if (!disciple.knownTechniques.includes(study.techName)) {
        disciple.knownTechniques.push(study.techName);
    }
    ensureManualHallMeta();
    const entry = getManualHallEntry(study.techName);
    if (entry) {
        entry.count -= 1;
        if (entry.count <= 0) delete G.sect.buildingMeta.manual_hall.collection[study.techName];
    }
    const template = TECHNIQUE_POOL.find(t => t.name === study.techName);
    const renownGain = MANUAL_HALL_BALANCE?.renownByRarity?.[template?.rarity] ?? 1;
    G.sect.renown = (G.sect.renown || 0) + renownGain;
    if (G.sect.chronicle) {
        G.sect.chronicle.push({ months: G.ageMonths || 0, text: `${disciple.name} mastered ${study.techName} from the hall archives.` });
    }
    addLog(`📜 ${disciple.name} completes study of ${study.techName}! +${renownGain} sect renown.`);
}

function tickManualHallStudy(monthsPassed) {
    if (!isSectFounded() || monthsPassed <= 0) return;
    if (getBuildingLevel('manual_hall') < 1) return;
    ensureManualHallMeta();
    const studies = G.sect.buildingMeta.manual_hall.studies;
    if (!studies.length) return;
    const completed = [];
    studies.forEach(study => {
        const disciple = getDiscipleByUid(study.discipleUid);
        if (!disciple) {
            completed.push(study.uid);
            return;
        }
        study.progressMonths += monthsPassed * getDiscipleStudySpeedMult(disciple);
        if (study.progressMonths >= study.totalMonths) completed.push(study.uid);
    });
    completed.forEach(uid => {
        const idx = studies.findIndex(s => s.uid === uid);
        if (idx < 0) return;
        const study = studies[idx];
        studies.splice(idx, 1);
        completeDiscipleStudy(study);
    });
}

function getSectDiscipleKnownArtsCount() {
    ensureSectState();
    let n = 0;
    G.sect.discipleRecords.forEach(d => {
        ensureDiscipleKnownTechniques(d);
        n += d.knownTechniques.length;
    });
    return n;
}

function renderManualHallPanelHtml() {
    ensureManualHallMeta();
    const cap = getManualHallCapacity();
    const slots = getManualStudySlots();
    const unique = countManualHallUnique();
    const copies = countManualHallCopies();
    const studies = getActiveManualStudies();
    const daoPct = typeof getSectBuildingBonus === 'function' ? getSectBuildingBonus('daoSpeedPct') : 0;
    const speedPct = typeof getSectBuildingBonus === 'function' ? getSectBuildingBonus('studySpeedPct') : 0;

    let html = `<div class="sect-section-title">📜 Sect Archive</div>`;
    html += `<p class="sect-hint">Deposit spare manuals from your travel kit. Disciples study in the background as time passes — Library (+${daoPct}% speed) and hall upgrades (+${speedPct}%) accelerate progress.</p>`;
    html += `<div class="sect-harvest-display">Archive: <strong>${unique}/${cap}</strong> titles · <strong>${copies}</strong> copies · Study slots: <strong>${studies.length}/${slots}</strong></div>`;

    if (studies.length) {
        html += `<div class="sect-section-title sect-subsection">📖 Active Studies</div>`;
        studies.forEach(study => {
            const disciple = getDiscipleByUid(study.discipleUid);
            const speed = disciple ? getDiscipleStudySpeedMult(disciple) : 1;
            const pct = Math.min(100, Math.floor((study.progressMonths / study.totalMonths) * 100));
            const remain = Math.max(0, Math.ceil((study.totalMonths - study.progressMonths) / speed));
            html += `<div class="manual-hall-study-row">
                <div class="manual-hall-study-head"><strong>${escapeSectAttr(study.discipleName)}</strong> · ${escapeSectAttr(study.techName)}</div>
                <div class="manual-hall-progress"><div class="manual-hall-progress-fill" style="width:${pct}%"></div></div>
                <div class="manual-hall-study-meta">${pct}% · ~${remain}mo left</div>
                <button type="button" class="sect-action-btn sect-action-btn-sm" data-cancel-study="${escapeSectAttr(study.uid)}">Cancel study</button>
            </div>`;
        });
    } else if (slots > 0) {
        html += `<p class="sect-hint">No active studies — assign a disciple below.</p>`;
    }

    const collection = Object.values(G.sect.buildingMeta.manual_hall.collection)
        .sort((a, b) => a.technique.localeCompare(b.technique));
    html += `<div class="sect-section-title sect-subsection">🏛️ Hall Collection</div>`;
    if (!collection.length) {
        html += `<p class="sect-hint">No manuals deposited yet.</p>`;
    } else {
        collection.forEach(entry => {
            const template = TECHNIQUE_POOL.find(t => t.name === entry.technique);
            const countBadge = entry.count > 1 ? ` ×${entry.count}` : '';
            const studying = studies.some(s => s.techName === entry.technique);
            html += `<div class="manual-hall-collection-row">
                <span class="manual-hall-title">${escapeSectAttr(entry.technique)}${countBadge}</span>
                <span class="manual-hall-meta">${template?.rarity || ''}</span>
                <button type="button" class="sect-deposit-btn" data-withdraw-hall="${escapeSectAttr(entry.technique)}" ${studying ? 'disabled title="In use by a studying disciple"' : ''}>Withdraw</button>
            </div>`;
        });
    }

    if (typeof ensureManualShelf === 'function') ensureManualShelf();
    const shelfEntries = typeof G !== 'undefined' && G.manualShelf
        ? Object.values(G.manualShelf).sort((a, b) => a.technique.localeCompare(b.technique))
        : [];
    html += `<div class="sect-section-title sect-subsection">📚 Deposit from Shelf</div>`;
    if (!shelfEntries.length) {
        html += `<p class="sect-hint">Your travel kit is empty — explore or visit markets to find manuals.</p>`;
    } else {
        shelfEntries.forEach(entry => {
            const template = TECHNIQUE_POOL.find(t => t.name === entry.technique);
            const countBadge = entry.count > 1 ? ` ×${entry.count}` : '';
            const atCap = !getManualHallEntry(entry.technique) && countManualHallUnique() >= cap;
            html += `<div class="manual-hall-collection-row">
                <span class="manual-hall-title">${escapeSectAttr(entry.technique)}${countBadge}</span>
                <span class="manual-hall-meta">${template?.rarity || ''}</span>
                <button type="button" class="sect-deposit-btn" data-deposit-hall="${escapeSectAttr(entry.technique)}" ${atCap ? 'disabled title="Archive full"' : ''}>Deposit</button>
            </div>`;
        });
    }

    ensureSectState();
    const freeDisciples = G.sect.discipleRecords.filter(d => !isDiscipleStudying(d.uid));
    const hallManuals = collection.filter(e => e.count > 0);
    if (freeDisciples.length && hallManuals.length && studies.length < slots) {
        html += `<div class="sect-section-title sect-subsection">🧑‍🎓 Assign Study</div>`;
        html += `<div class="manual-hall-assign-row">`;
        html += `<select id="manualHallDiscipleSelect" class="manual-hall-select">`;
        freeDisciples.forEach(d => {
            const roleDef = DISCIPLE_ROLES[d.role];
            html += `<option value="${escapeSectAttr(d.uid)}">${escapeSectAttr(d.name)} (${roleDef?.label || d.role})</option>`;
        });
        html += `</select>`;
        html += `<select id="manualHallTechSelect" class="manual-hall-select">`;
        hallManuals.forEach(entry => {
            html += `<option value="${escapeSectAttr(entry.technique)}">${escapeSectAttr(entry.technique)}</option>`;
        });
        html += `</select>`;
        html += `<button type="button" class="sect-action-btn" id="btnAssignStudy">📖 Begin Study</button>`;
        html += `</div>`;
    } else if (G.sect.discipleRecords.length && !freeDisciples.length) {
        html += `<p class="sect-hint">All disciples are currently studying.</p>`;
    } else if (!G.sect.discipleRecords.length) {
        html += `<p class="sect-hint">Recruit disciples to assign manual study.</p>`;
    }

    const artsCount = getSectDiscipleKnownArtsCount();
    if (artsCount > 0) {
        html += `<div class="sect-section-title sect-subsection">✦ Disciple Arts (${artsCount})</div>`;
        G.sect.discipleRecords.forEach(d => {
            ensureDiscipleKnownTechniques(d);
            if (!d.knownTechniques.length) return;
            html += `<div class="manual-hall-disciple-arts"><strong>${escapeSectAttr(d.name)}</strong>: ${d.knownTechniques.map(n => escapeSectAttr(n)).join(', ')}</div>`;
        });
    }

    return html;
}

function getTreasuryPendingTithe() {
    ensureSectBuildingMeta();
    return G.sect.buildingMeta.treasury?.pendingTithe || 0;
}

/** Disciple tithe banked per cultivate when treasury is built (0 without disciples). */
function getTreasuryTithePerCultivate() {
    if (!G.disciples?.length) return 0;
    const income = typeof getSectDiscipleIncome === 'function' ? getSectDiscipleIncome() : G.disciples.length;
    const fameBonus = typeof getFameLevel === 'function' ? getFameLevel().bonus : 0;
    return income + fameBonus;
}

function addTreasuryPendingTithe(amount) {
    ensureSectBuildingMeta();
    if (!amount) return;
    G.sect.buildingMeta.treasury.pendingTithe = getTreasuryPendingTithe() + amount;
}

function collectTreasuryTithe() {
    ensureSectBuildingMeta();
    const pending = getTreasuryPendingTithe();
    if (pending <= 0) return { success: false, message: 'The tithe chest is empty.' };
    const added = addSectInventoryStones(pending);
    if (added <= 0) return { success: false, message: 'Sect stores are full.' };
    G.sect.buildingMeta.treasury.pendingTithe = pending - added;
    return {
        success: true,
        message: `Collected ${added} stones from the tithe chest into sect stores.`,
        collected: added
    };
}

function depositVaultStones(amount) {
    ensureSectInventory();
    if (getBuildingLevel('vault') < 1) {
        return { success: false, message: 'Build the Vault first.' };
    }
    const have = G.stones || 0;
    const deposit = Math.min(have, Math.max(0, amount || have));
    if (deposit <= 0) return { success: false, message: 'No stones to deposit.' };
    const added = addSectInventoryStones(deposit);
    if (added <= 0) return { success: false, message: 'Sect stores are full.' };
    G.stones = have - added;
    return {
        success: true,
        message: `Deposited ${added} stones into the vault. Protected from sect events.`,
        deposited: added
    };
}

function getVaultProtectionPct() {
    return typeof getSectBuildingBonus === 'function' ? getSectBuildingBonus('vaultStoneSavePct') : 0;
}

function getSectCultivationBreakdown() {
    const rows = [];
    const hallPct = typeof getSectBuildingBonus === 'function' ? getSectBuildingBonus('cultivationSpeedPct') : 0;
    const daoPct = typeof getSectBuildingBonus === 'function' ? getSectBuildingBonus('daoSpeedPct') : 0;
    if (hallPct > 0) rows.push({ label: 'Cultivation Hall', value: `+${hallPct}%`, emoji: '🧘' });
    if (daoPct > 0) rows.push({ label: 'Library (Dao)', value: `+${daoPct}%`, emoji: '📚' });
    if (typeof isInSectInfluenceZone === 'function'
        && isInSectInfluenceZone(typeof getActiveZoneId === 'function' ? getActiveZoneId() : G.currentZone)) {
        rows.push({ label: 'Zone influence', value: `+${SECT_INFLUENCE.cultivateBonusPct}%`, emoji: '🌏' });
    }
    const factionMult = typeof getFactionCultivateMult === 'function' ? getFactionCultivateMult() : 1;
    if (factionMult > 1) {
        rows.push({ label: 'Faction', value: `+${Math.round((factionMult - 1) * 100)}%`, emoji: '🏳️' });
    }
    if (typeof getSectHeirloomBonuses === 'function') {
        const h = getSectHeirloomBonuses().cultivateMult;
        if (h > 1) rows.push({ label: 'Heirlooms', value: `+${Math.round((h - 1) * 100)}%`, emoji: '🏺' });
    }
    if (typeof getSectSpiritCultivateMult === 'function') {
        const s = getSectSpiritCultivateMult();
        if (s > 1) rows.push({ label: 'Sect spirit', value: `+${Math.round((s - 1) * 100)}%`, emoji: '👻' });
    }
    const totalMult = (typeof getSectCultivationMult === 'function' ? getSectCultivationMult() : 1)
        * (typeof getFactionCultivateMult === 'function' ? getFactionCultivateMult() : 1);
    return { rows, totalMult, totalPct: Math.round((totalMult - 1) * 100) };
}

function actionTrainingGroundSpar() {
    if (typeof actionBlocked === 'function' && actionBlocked()) {
        return { success: false, message: 'You cannot spar right now.' };
    }
    if (getBuildingLevel('training_ground') < 1) {
        return { success: false, message: 'Build the Training Ground first.' };
    }
    const months = SECT_BUILDING_ACTIONS?.trainingSparMonths || 2;
    if (!advanceTime(months, 'Sparring at the Training Ground')) {
        return { success: false, message: 'Your lifespan ends mid-spar.' };
    }
    ensureSectBuildingMeta();
    G.sect.buildingMeta.training_ground.lastSparMonths = G.ageMonths;
    const uses = typeof applyTrainingGroundCombatXp === 'function' ? applyTrainingGroundCombatXp() : 0;
    const pct = typeof getSectBuildingBonus === 'function' ? getSectBuildingBonus('combatXpPct') : 0;
    return {
        success: true,
        message: uses > 0
            ? `Spar complete! Technique mastery +${uses} uses (${pct}% training bonus).`
            : `Spar complete! (${pct}% training bonus — learn a technique to gain mastery).`
    };
}

function actionCultivationHallCultivate() {
    if (typeof actionBlocked === 'function' && actionBlocked()) {
        return { success: false, message: 'You cannot cultivate right now.' };
    }
    if (getBuildingLevel('cultivation_hall') < 1) {
        return { success: false, message: 'Build the Cultivation Hall first.' };
    }
    document.getElementById('sectPopup')?.classList.remove('active');
    if (typeof actionCultivate === 'function') actionCultivate();
    return { success: true };
}

function hasSectBuildingCollectable(buildingId) {
    if (buildingId === 'spirit_garden' && typeof getSpiritGardenPendingHerbs === 'function') {
        return getSpiritGardenPendingHerbs() > 0;
    }
    if (buildingId === 'treasury' && typeof getTreasuryPendingTithe === 'function') {
        return getTreasuryPendingTithe() > 0;
    }
    return false;
}

function renderSectCultivationBreakdownHtml() {
    const bd = getSectCultivationBreakdown();
    if (!bd.rows.length) {
        return `<p class="sect-hint">No sect cultivation bonuses yet. Upgrade the hall to amplify your sessions.</p>`;
    }
    let html = `<ul class="sect-breakdown-list">`;
    bd.rows.forEach(row => {
        html += `<li><span>${row.emoji} ${row.label}</span><span class="sect-breakdown-val">${row.value}</span></li>`;
    });
    html += `</ul>`;
    html += `<div class="sect-breakdown-total">Combined sect bonus: <strong>+${bd.totalPct}%</strong></div>`;
    return html;
}
