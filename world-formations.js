// ============================================
// WORLD-FORMATIONS.JS — Persistent world installations
// Thin registry of physical formation installs owned by institutions/NPCs.
// Reuses FORMATIONS defs + slot-shaped operating state from formations.js.
// First install: Well-Ring Lodge courtyard Spirit Gathering (ambient-powered).
// ============================================

const WORLD_FORMATION_INSTALL_WELL_RING_GATHER = 'wr_courtyard_spirit_gathering';

const WORLD_FORMATION_WELL_RING_GATHER_DEF = {
    id: WORLD_FORMATION_INSTALL_WELL_RING_GATHER,
    formationId: 'spirit_gathering',
    locationId: 'redwell',
    siteLabel: 'Well-Ring meditation court',
    ownerKind: 'institution',
    ownerId: 'well_ring_lodge',
    powerMode: 'ambient',
    /** Starting integrity — Sharp band, but not pristine immortal work. */
    initialIntegrity: 88,
    initialActive: true,
    /**
     * Lore: unresolved. No Redwell grandmaster is implied.
     * Possibilities: second-hand diagram, visiting artisan, or an outer who left.
     */
    originUnresolved: true
};

/**
 * Inscription maintenance (ordinary upkeep of faded lines).
 * Not structural repair — decayed/scattered installs need deeper work (later PR).
 * Costs mirror personal-courtyard F1a maintain for early-game achievability.
 */
const WORLD_FORMATION_INSCRIPTION_MAINTAIN = {
    /** Minimum integrity (inclusive) for ordinary inscription maintenance. Below = decayed/scattered. */
    minIntegrityBandKey: 'fading',
    stones: 4,
    materials: { spirit_herb: 1 },
    months: 1,
    restore: 35
};

function getWorldFormationInscriptionMaintainConfig() {
    const cfg = typeof getFormationF1aConfig === 'function' ? getFormationF1aConfig() : null;
    const bandKey = WORLD_FORMATION_INSCRIPTION_MAINTAIN.minIntegrityBandKey || 'fading';
    const minIntegrity = cfg?.bands?.[bandKey] ?? 35;
    return {
        minIntegrity,
        stones: WORLD_FORMATION_INSCRIPTION_MAINTAIN.stones ?? cfg?.maintain?.stones ?? 4,
        materials: WORLD_FORMATION_INSCRIPTION_MAINTAIN.materials
            || cfg?.maintain?.materials
            || { spirit_herb: 1 },
        months: WORLD_FORMATION_INSCRIPTION_MAINTAIN.months ?? cfg?.maintain?.months ?? 1,
        restore: WORLD_FORMATION_INSCRIPTION_MAINTAIN.restore ?? cfg?.maintain?.restore ?? 35,
        integrityMax: cfg?.integrityMax ?? 100
    };
}

let _ensuringWorldFormations = false;

function ensureWorldFormationsState() {
    if (_ensuringWorldFormations) return G.worldFormations;
    _ensuringWorldFormations = true;
    try {
        if (!G.worldFormations || typeof G.worldFormations !== 'object') {
            G.worldFormations = { version: 1, byId: {} };
        }
        if (G.worldFormations.version == null) G.worldFormations.version = 1;
        if (!G.worldFormations.byId || typeof G.worldFormations.byId !== 'object') {
            G.worldFormations.byId = {};
        }
        ensureWellRingLodgeWorldFormation();
        return G.worldFormations;
    } finally {
        _ensuringWorldFormations = false;
    }
}

function getWorldFormationInstallation(installId) {
    ensureWorldFormationsState();
    return G.worldFormations.byId[installId] || null;
}

function listWorldFormationInstallations(filter) {
    ensureWorldFormationsState();
    const all = Object.values(G.worldFormations.byId || {});
    if (!filter) return all;
    return all.filter(inst => {
        if (filter.ownerId && inst.ownerId !== filter.ownerId) return false;
        if (filter.locationId && inst.locationId !== filter.locationId) return false;
        if (filter.ownerKind && inst.ownerKind !== filter.ownerKind) return false;
        return true;
    });
}

/**
 * Normalize operating fields onto a world installation (same shape as residence slots).
 * Does not invent a second copy of the pattern — only runtime state.
 */
function normalizeWorldFormationInstallation(raw, seed) {
    if (!raw || typeof raw !== 'object') return null;
    const formationId = raw.formationId || seed?.formationId;
    const def = typeof getFormationDef === 'function' ? getFormationDef(formationId) : null;
    if (!def || def.implemented === false) return null;

    const cfg = typeof getFormationF1aConfig === 'function'
        ? getFormationF1aConfig()
        : { integrityMax: 100 };

    const integrityMax = cfg.integrityMax || 100;
    let integrity = Number(raw.integrity);
    if (!Number.isFinite(integrity)) integrity = seed?.initialIntegrity ?? integrityMax;
    integrity = Math.max(0, Math.min(integrityMax, integrity));
    const scattered = !!raw.scattered || integrity <= 0;
    const powerMode = raw.powerMode || seed?.powerMode || 'stones';

    let fuel = Number(raw.fuel);
    if (!Number.isFinite(fuel)) {
        fuel = powerMode === 'ambient'
            ? 0
            : (typeof getFormationLayFuel === 'function' ? getFormationLayFuel(def) : 6);
    }
    if (powerMode === 'ambient') fuel = 0;

    let active = scattered ? false : (raw.active != null ? !!raw.active : !!seed?.initialActive);
    if (scattered) active = false;

    return {
        id: raw.id || seed?.id,
        formationId,
        locationId: raw.locationId || seed?.locationId || null,
        siteLabel: raw.siteLabel || seed?.siteLabel || null,
        ownerKind: raw.ownerKind || seed?.ownerKind || null,
        ownerId: raw.ownerId || seed?.ownerId || null,
        powerMode,
        active,
        fuel: Math.max(0, fuel),
        integrity: scattered ? 0 : integrity,
        scattered,
        originUnresolved: raw.originUnresolved != null
            ? !!raw.originUnresolved
            : !!seed?.originUnresolved
    };
}

/**
 * Idempotent Well-Ring courtyard gather. Single authoritative record in G.worldFormations.byId.
 * Lodge org only stores the installation id pointer — never a second slot copy.
 */
function ensureWellRingLodgeWorldFormation() {
    if (typeof G === 'undefined') return null;
    if (!G.worldFormations || typeof G.worldFormations !== 'object') {
        G.worldFormations = { version: 1, byId: {} };
    }
    if (!G.worldFormations.byId) G.worldFormations.byId = {};

    const seed = WORLD_FORMATION_WELL_RING_GATHER_DEF;
    const existing = G.worldFormations.byId[seed.id];
    if (existing && typeof existing === 'object') {
        // Preserve object identity + operating state across ensures.
        // Do NOT reset integrity/active from seed defaults — that would undo world-time decay.
        if (!existing.id) existing.id = seed.id;
        if (!existing.formationId) existing.formationId = seed.formationId;
        if (!existing.locationId) existing.locationId = seed.locationId;
        if (!existing.siteLabel) existing.siteLabel = seed.siteLabel;
        if (!existing.ownerKind) existing.ownerKind = seed.ownerKind;
        if (!existing.ownerId) existing.ownerId = seed.ownerId;
        if (!existing.powerMode) existing.powerMode = seed.powerMode;
        if (existing.originUnresolved == null) existing.originUnresolved = true;
        // Only fill missing integrity (corrupt/partial saves) — never restore the starter 88.
        if (existing.integrity == null || !Number.isFinite(Number(existing.integrity))) {
            existing.integrity = seed.initialIntegrity;
        }
        if (existing.active == null) existing.active = !!seed.initialActive;
        if (existing.scattered || existing.integrity <= 0) {
            existing.scattered = true;
            existing.integrity = 0;
            existing.active = false;
        }
        if (existing.powerMode === 'ambient') existing.fuel = 0;
    } else {
        const normalized = normalizeWorldFormationInstallation({
            id: seed.id,
            formationId: seed.formationId,
            locationId: seed.locationId,
            siteLabel: seed.siteLabel,
            ownerKind: seed.ownerKind,
            ownerId: seed.ownerId,
            powerMode: seed.powerMode,
            active: seed.initialActive,
            integrity: seed.initialIntegrity,
            fuel: 0,
            scattered: false,
            originUnresolved: true
        }, seed);
        if (!normalized) return null;
        G.worldFormations.byId[seed.id] = normalized;
    }

    // Soft pointer on lodge org — ids only.
    if (G.wellRing?.lodge) {
        if (!Array.isArray(G.wellRing.lodge.formationInstallIds)) {
            G.wellRing.lodge.formationInstallIds = [];
        }
        if (!G.wellRing.lodge.formationInstallIds.includes(seed.id)) {
            G.wellRing.lodge.formationInstallIds.push(seed.id);
        }
    }
    return G.worldFormations.byId[seed.id];
}

/**
 * Effect multiplier for a world install.
 * Ambient: active + integrity band (no fuel). Stones: same rules as residence slots.
 */
function getWorldFormationEffectMult(inst) {
    if (!inst || inst.scattered || inst.integrity <= 0) return 0;
    if (!inst.active) return 0;
    if (inst.powerMode === 'ambient') {
        const cfg = typeof getFormationF1aConfig === 'function'
            ? getFormationF1aConfig()
            : { effectMult: { sharp: 1, fading: 0.55, decayed: 0.2, scattered: 0 }, bands: { sharp: 70, fading: 35 } };
        const band = typeof getFormationIntegrityBand === 'function'
            ? getFormationIntegrityBand(inst.integrity)
            : (inst.integrity >= 70 ? 'sharp' : inst.integrity >= 35 ? 'fading' : 'decayed');
        return cfg.effectMult[band] ?? 0;
    }
    if (typeof getFormationEffectMultForSlot === 'function') {
        return getFormationEffectMultForSlot(inst);
    }
    return 0;
}

function isWorldFormationRunning(inst) {
    return getWorldFormationEffectMult(inst) > 0;
}

function getWorldFormationCultivatePct(inst) {
    if (!isWorldFormationRunning(inst)) return 0;
    const def = typeof getFormationDef === 'function' ? getFormationDef(inst.formationId) : null;
    const base = def?.effects?.cultivatePct || 0;
    const mult = getWorldFormationEffectMult(inst);
    return Math.round(base * mult * 10) / 10;
}

function getWellRingLodgeFormationInstallation() {
    ensureWorldFormationsState();
    return getWorldFormationInstallation(WORLD_FORMATION_INSTALL_WELL_RING_GATHER);
}

function getWellRingLodgeFormationCultivateMult() {
    const inst = getWellRingLodgeFormationInstallation();
    const pct = getWorldFormationCultivatePct(inst);
    return 1 + (pct || 0) / 100;
}

/**
 * NPC eligibility: living Well-Ring affiliate physically at lodge HQ.
 */
function isNpcEligibleForWellRingLodgeFormation(npc) {
    if (!npc || npc.alive === false) return false;
    const lodgeId = typeof WELL_RING_LODGE_ID !== 'undefined' ? WELL_RING_LODGE_ID : 'well_ring_lodge';
    if (npc.affiliationId !== lodgeId) return false;
    const home = typeof WELL_RING_HOME_LOCATION_ID !== 'undefined'
        ? WELL_RING_HOME_LOCATION_ID
        : 'redwell';
    if (typeof isNpcPhysicallyPresentAt === 'function') {
        return isNpcPhysicallyPresentAt(npc, home);
    }
    if (typeof isWellRingCastNpcPresent === 'function') {
        return isWellRingCastNpcPresent(npc, home);
    }
    if (npc.travel && (npc.travel.state === 'travelling' || npc.travel.enRoute)) return false;
    return (npc.homeLocationId || home) === home;
}

/**
 * Local cultivate support for an NPC — Well-Ring gather only when eligible + running.
 * Returns 1 when inapplicable (no global soup).
 */
function getNpcLocalFormationCultivateMult(npc) {
    if (!isNpcEligibleForWellRingLodgeFormation(npc)) return 1;
    return getWellRingLodgeFormationCultivateMult();
}

/**
 * Player: Well-Ring member at Redwell while the lodge court pattern is running.
 */
function getPlayerWellRingLodgeFormationCultivateMult() {
    if (typeof isWellRingMember === 'function' && !isWellRingMember()) return 1;
    if (typeof isAtRedwell === 'function' && !isAtRedwell()) return 1;
    const loc = typeof getCurrentLocationId === 'function' ? getCurrentLocationId() : G.currentLocation;
    if (loc && loc !== 'redwell') return 1;
    return getWellRingLodgeFormationCultivateMult();
}

/**
 * Observable description for visitors at the lodge — no exact counters.
 */
function getWellRingLodgeFormationObservationLine() {
    const inst = getWellRingLodgeFormationInstallation();
    if (!inst) return '';
    if (inst.scattered || inst.integrity <= 0) {
        return 'In the meditation court the old gather lines have scattered — bare flagstones, no draw.';
    }
    if (!inst.active) {
        return 'A quiet Spirit Gathering diagram lies inscribed around the meditation court — the switch is dark.';
    }
    if (inst.powerMode !== 'ambient' && (inst.fuel || 0) <= 0) {
        return 'The court formation is switched on but starved — no qi walks the lines.';
    }
    const band = typeof getFormationIntegrityBand === 'function'
        ? getFormationIntegrityBand(inst.integrity)
        : 'sharp';
    if (band === 'sharp') {
        return 'A modest Spirit Gathering pattern hums around the meditation court — ambient qi leaning inward.';
    }
    if (band === 'fading') {
        return 'The court\'s gather formation still pulls a little, but the inscriptions look worn.';
    }
    return 'Faded gather lines cling to the meditation court — barely holding a thin draw.';
}

// ---------------------------------------------------------------------------
// Inscription maintenance / institutional service permission (PR #213)
// ---------------------------------------------------------------------------

/**
 * Centralised institutional service permission.
 * Today: Well-Ring members may perform inscription_maintain on lodge installs.
 * Extensible later for commissions / employment without rewriting action APIs.
 *
 * @returns {{ ok: boolean, reason: string|null, permissionKind: string|null }}
 */
function getWorldFormationServicePermission(installId, serviceKind) {
    const inst = getWorldFormationInstallation(installId);
    if (!inst) {
        return { ok: false, reason: 'No formation installation here.', permissionKind: null };
    }
    const kind = serviceKind || 'inscription_maintain';
    if (kind !== 'inscription_maintain') {
        return { ok: false, reason: 'That service is not available yet.', permissionKind: null };
    }

    if (inst.ownerKind === 'institution' && inst.ownerId === 'well_ring_lodge') {
        if (typeof isWellRingMember === 'function' && !isWellRingMember()) {
            return {
                ok: false,
                reason: 'Only Well-Ring members may tend the lodge court formation.',
                permissionKind: null
            };
        }
        return { ok: true, reason: null, permissionKind: 'well_ring_member' };
    }

    return { ok: false, reason: 'You have no authority to tend this installation.', permissionKind: null };
}

/** Pattern familiarity for ordinary inscription work — deciphered diagram, not master rank. */
function hasWorldFormationInscriptionFamiliarity(formationId) {
    if (typeof isFormationDeciphered === 'function') {
        return !!isFormationDeciphered(formationId);
    }
    if (typeof knowsFormation === 'function') return !!knowsFormation(formationId);
    return !!(G.knownFormations || []).includes(formationId);
}

function isPlayerAtWorldFormationSite(inst) {
    if (!inst?.locationId) return false;
    if (typeof actionBlocked === 'function' && actionBlocked()) return false;
    if (G.inCombat) return false;
    const loc = typeof getCurrentLocationId === 'function'
        ? getCurrentLocationId()
        : (G.currentLocation || null);
    return loc === inst.locationId;
}

function getWorldFormationConditionLabel(inst) {
    if (!inst || inst.scattered || inst.integrity <= 0) return 'scattered';
    const band = typeof getFormationIntegrityBand === 'function'
        ? getFormationIntegrityBand(inst.integrity)
        : 'sharp';
    if (band === 'sharp') return 'healthy';
    if (band === 'fading') return 'worn';
    return 'severely_deteriorated';
}

/**
 * Grounded inspect result — no raw integrity/fuel counters.
 */
function inspectWorldFormationInstallation(installId) {
    ensureWorldFormationsState();
    const id = installId || WORLD_FORMATION_INSTALL_WELL_RING_GATHER;
    const inst = getWorldFormationInstallation(id);
    if (!inst) {
        return {
            ok: false,
            message: 'You find no formation to inspect.',
            recognized: false,
            operating: false,
            condition: null,
            canMaintain: false,
            maintainBlock: 'No installation.',
            needsStructuralRepair: false
        };
    }

    const def = typeof getFormationDef === 'function' ? getFormationDef(inst.formationId) : null;
    const recognized = hasWorldFormationInscriptionFamiliarity(inst.formationId);
    const condition = getWorldFormationConditionLabel(inst);
    const operating = isWorldFormationRunning(inst);
    const maintainCfg = getWorldFormationInscriptionMaintainConfig();
    const needsStructuralRepair = !!(inst.scattered || inst.integrity < maintainCfg.minIntegrity);
    const maintainBlock = getWorldFormationInscriptionMaintainBlockReason(id);

    let perception = getWellRingLodgeFormationObservationLine();
    if (inst.id !== WORLD_FORMATION_INSTALL_WELL_RING_GATHER) {
        perception = operating
            ? 'Qi walks a laid pattern here.'
            : 'A formation is laid, but it is not drawing.';
    }

    let knowledgeNote = '';
    if (!recognized) {
        knowledgeNote = 'You sense a formation needs attention, but the lines are opaque to you.';
    } else if (needsStructuralRepair) {
        knowledgeNote = `${def?.emoji || '☯️'} ${def?.name || 'Formation'} — the inscriptions are too far gone for ordinary maintenance. Structural repair is required.`;
    } else if (condition === 'healthy' && inst.integrity >= maintainCfg.integrityMax) {
        knowledgeNote = `${def?.emoji || '☯️'} ${def?.name || 'Formation'} — the lines are already sharp.`;
    } else if (recognized) {
        knowledgeNote = `${def?.emoji || '☯️'} ${def?.name || 'Formation'} — you could retrace the worn lines if permitted.`;
    }

    return {
        ok: true,
        installId: inst.id,
        formationId: inst.formationId,
        siteLabel: inst.siteLabel || null,
        recognized,
        name: recognized ? (def?.name || inst.formationId) : null,
        emoji: recognized ? (def?.emoji || '☯️') : null,
        operating,
        condition,
        perception,
        knowledgeNote,
        canMaintain: !maintainBlock,
        maintainBlock,
        needsStructuralRepair,
        permission: getWorldFormationServicePermission(id, 'inscription_maintain')
    };
}

function getWorldFormationInscriptionMaintainBlockReason(installId) {
    if (typeof actionBlocked === 'function' && actionBlocked()) {
        return 'You cannot tend formations right now.';
    }
    if (G.inCombat) return 'Cannot maintain a formation during combat.';
    if (G.gameOver) return 'Your path has ended.';

    const id = installId || WORLD_FORMATION_INSTALL_WELL_RING_GATHER;
    const inst = getWorldFormationInstallation(id);
    if (!inst) return 'No formation installation here.';

    if (!isPlayerAtWorldFormationSite(inst)) {
        return 'Travel to the formation\'s site before tending it.';
    }

    const perm = getWorldFormationServicePermission(id, 'inscription_maintain');
    if (!perm.ok) return perm.reason;

    if (!hasWorldFormationInscriptionFamiliarity(inst.formationId)) {
        return 'You do not know this pattern well enough to retrace its inscriptions.';
    }

    const cfg = getWorldFormationInscriptionMaintainConfig();
    if (inst.scattered || inst.integrity <= 0) {
        return 'The pattern is scattered — ordinary maintenance cannot restore it. Structural repair is required.';
    }
    if (inst.integrity < cfg.minIntegrity) {
        return 'The inscriptions are too badly deteriorated for ordinary maintenance. Structural repair is required.';
    }
    if (inst.integrity >= cfg.integrityMax) {
        return 'The lines are already sharp — no inscription maintenance needed.';
    }

    if ((G.stones || 0) < (cfg.stones || 0)) {
        return `Need ${cfg.stones} Spirit Stones for inscription chalk and focus.`;
    }
    if (cfg.materials && typeof getConstructionMaterialsBlock === 'function') {
        const matBlock = getConstructionMaterialsBlock({ materials: cfg.materials });
        if (matBlock) return matBlock;
    } else if (cfg.materials) {
        for (const [matId, qty] of Object.entries(cfg.materials)) {
            const have = typeof getMaterialCount === 'function'
                ? getMaterialCount(matId)
                : (G.materials?.[matId] || 0);
            if (have < qty) return `Need ${qty}× ${matId}.`;
        }
    }
    return null;
}

/**
 * Perform ordinary inscription maintenance on a world installation.
 * Consumes materials/stones, advances time once, restores bounded integrity.
 * Does not replace the authoritative install record. Cannot revive scattered/decayed.
 */
function maintainWorldFormationInscription(installId) {
    const id = installId || WORLD_FORMATION_INSTALL_WELL_RING_GATHER;
    const block = getWorldFormationInscriptionMaintainBlockReason(id);
    if (block) return { success: false, message: block };

    const instRef = getWorldFormationInstallation(id);
    const def = typeof getFormationDef === 'function' ? getFormationDef(instRef.formationId) : null;
    const cfg = getWorldFormationInscriptionMaintainConfig();
    const months = cfg.months || 1;
    const stones = cfg.stones || 0;
    const materials = cfg.materials || {};

    if (Object.keys(materials).length && typeof removeCraftMaterials === 'function') {
        if (!removeCraftMaterials(materials)) {
            return { success: false, message: 'Missing materials.' };
        }
    }
    if (stones > 0) G.stones -= stones;

    const label = `Maintaining ${def?.name || 'formation'} inscriptions`;
    if (typeof advanceTime !== 'function' || !advanceTime(months, label)) {
        if (Object.keys(materials).length && typeof addCraftMaterial === 'function') {
            for (const [matId, qty] of Object.entries(materials)) addCraftMaterial(matId, qty);
        }
        if (stones > 0) G.stones += stones;
        return { success: false, message: 'Your lifespan ends before the touch-up completes.' };
    }

    // Re-resolve after time advance (ticks may have decayed integrity during the month).
    // Must be the same authoritative byId record — never a replaced copy.
    const live = getWorldFormationInstallation(id);
    if (!live || live !== instRef) {
        return { success: false, message: 'The installation record changed unexpectedly during the work.' };
    }
    if (live.scattered || live.integrity < cfg.minIntegrity) {
        return {
            success: false,
            message: 'While you worked, the pattern slipped beyond ordinary maintenance. Materials were spent.'
        };
    }

    const before = live.integrity;
    live.integrity = Math.min(cfg.integrityMax, live.integrity + (cfg.restore || 35));
    live.scattered = false;
    // Ambient installs stay as they were for active; do not force-on.
    const band = typeof getFormationIntegrityBand === 'function'
        ? getFormationIntegrityBand(live.integrity)
        : 'sharp';
    const bandLabel = typeof getFormationIntegrityLabel === 'function'
        ? getFormationIntegrityLabel(band)
        : band;

    let fiNote = '';
    if (typeof grantFormationInsight === 'function') {
        const fiGain = (typeof getFormationF2bConfig === 'function'
            ? getFormationF2bConfig().fi?.maintain
            : null) ?? 3;
        if (fiGain > 0) {
            grantFormationInsight(fiGain);
            fiNote = ` (+${fiGain} FI)`;
        }
    }

    return {
        success: true,
        message: `${def?.emoji || '☯️'} ${def?.name || 'Formation'} inscriptions refreshed at the ${live.siteLabel || 'site'} (${bandLabel}).${fiNote}`,
        before,
        after: live.integrity,
        installId: live.id
    };
}

function renderWellRingFormationServiceHtml() {
    const inspect = inspectWorldFormationInstallation(WORLD_FORMATION_INSTALL_WELL_RING_GATHER);
    if (!inspect.ok) return '';

    const cfg = getWorldFormationInscriptionMaintainConfig();
    const costBits = [];
    if (cfg.months) costBits.push(`${cfg.months} mo`);
    if (cfg.stones) costBits.push(`${cfg.stones}💎`);
    if (cfg.materials) {
        Object.entries(cfg.materials).forEach(([matId, qty]) => {
            const mat = typeof CRAFT_MATERIALS !== 'undefined' ? CRAFT_MATERIALS[matId] : null;
            costBits.push(`${qty}× ${mat?.name || matId}`);
        });
    }
    const costHint = costBits.join(' · ');

    let condLabel = 'unknown';
    if (inspect.condition === 'healthy') condLabel = 'healthy';
    else if (inspect.condition === 'worn') condLabel = 'worn';
    else if (inspect.condition === 'severely_deteriorated') condLabel = 'severely deteriorated';
    else if (inspect.condition === 'scattered') condLabel = 'scattered';

    let html = `<div class="tech-group-header" style="margin-top:10px;">☯️ Meditation court formation</div>`;
    html += `<div class="desc" style="margin-bottom:6px;color:#a09080;">${inspect.perception}</div>`;
    if (inspect.knowledgeNote) {
        html += `<div class="desc" style="margin-bottom:6px;">${inspect.knowledgeNote}</div>`;
    }
    if (inspect.recognized) {
        html += `<div class="desc" style="margin-bottom:8px;">Condition: <b>${condLabel}</b> · ${inspect.operating ? 'Operating' : 'Not drawing'}</div>`;
    } else {
        html += `<div class="desc" style="margin-bottom:8px;">Condition: <b>${condLabel}</b> (pattern unclear to you)</div>`;
    }

    const block = inspect.maintainBlock;
    const can = inspect.canMaintain;
    html += `<div class="popup-item${can ? ' can-buy' : ''}" id="wellRingFormationMaintainBtn" style="${can ? 'cursor:pointer;' : 'opacity:0.65;'}">
        <div class="name">🖌️ Maintain inscriptions</div>
        <div class="desc">${can
            ? `Retrace worn lines · ${costHint}`
            : (block || 'Cannot maintain')}</div>
    </div>`;
    return html;
}

function actionWellRingFormationMaintain() {
    if (G.gameOver || G.inCombat) return;
    const res = maintainWorldFormationInscription(WORLD_FORMATION_INSTALL_WELL_RING_GATHER);
    if (typeof addLog === 'function') addLog(res.success ? `☯️ ${res.message}` : `🔒 ${res.message}`);
    if (typeof fullRender === 'function') fullRender();
    if (typeof openWellRingPopup === 'function') openWellRingPopup();
}

/**
 * Monthly lifecycle for world installs. Ambient: integrity neglect only (no stone burn).
 * Stones: integrity + fuel burn. No auto-refill. No FI grants to the player.
 */
function tickWorldFormationInstallations(monthsPassed) {
    if (!monthsPassed || monthsPassed <= 0) return;
    ensureWorldFormationsState();
    const cfg = typeof getFormationF1aConfig === 'function'
        ? getFormationF1aConfig()
        : { integrityDecayPerMonth: 1, integrityMax: 100 };
    const decay = cfg.integrityDecayPerMonth || 1;

    Object.keys(G.worldFormations.byId || {}).forEach(id => {
        const inst = G.worldFormations.byId[id];
        if (!inst) return;
        const def = typeof getFormationDef === 'function' ? getFormationDef(inst.formationId) : null;
        if (!def) return;

        if (inst.scattered || inst.integrity <= 0) {
            inst.scattered = true;
            inst.integrity = 0;
            inst.active = false;
            return;
        }

        inst.integrity = Math.max(0, inst.integrity - decay * monthsPassed);
        if (inst.integrity <= 0) {
            inst.integrity = 0;
            inst.scattered = true;
            inst.active = false;
            return;
        }

        if (inst.powerMode === 'ambient') {
            // Ambient: no spirit-stone consumption. Fuel stays 0.
            inst.fuel = 0;
            return;
        }

        if (inst.active) {
            const burn = (typeof getFormationFuelPerMonth === 'function'
                ? getFormationFuelPerMonth(def)
                : (def.fuelPerMonth || 1)) * monthsPassed;
            if (burn > 0 && inst.fuel > 0) {
                inst.fuel = Math.max(0, inst.fuel - burn);
            }
        }
    });
}

function setWorldFormationActive(installId, active) {
    const inst = getWorldFormationInstallation(installId);
    if (!inst) return { success: false, message: 'Unknown installation.' };
    if (inst.scattered || inst.integrity <= 0) {
        return { success: false, message: 'Pattern is scattered.' };
    }
    if (active && inst.powerMode !== 'ambient' && (inst.fuel || 0) <= 0) {
        return { success: false, message: 'No fuel.' };
    }
    inst.active = !!active;
    return { success: true, message: active ? 'Activated.' : 'Shut down.' };
}

function migrateWorldFormationsForExistingSave() {
    ensureWorldFormationsState();
}

let _worldFormationsTickRegistered = false;
if (typeof registerWorldTick === 'function' && !_worldFormationsTickRegistered) {
    // Before worldNpcs growth (40) so growth sees current operating state.
    _worldFormationsTickRegistered = true;
    registerWorldTick('worldFormations', (delta) => {
        tickWorldFormationInstallations(delta);
    }, 38);
}
