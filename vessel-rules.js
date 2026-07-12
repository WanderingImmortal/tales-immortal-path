// ============================================
// VESSEL-RULES.JS — One sworn physical oath per vessel (framework shell)
// ============================================
//
// Dantian → Weapon Intent; Vessel → Vessel Rules; Spirit → Soul Mass (future).
// Blood and Unnamed mechanics arrive in follow-up PRs — this module owns swear/release,
// progression meter, Perfect Cultivation stub, and combat hook placeholders.

/** Map legacy/alternate layer ids to Body Chamber keys. */
function normalizeVesselRuleBodyLayer(layerId) {
    if (layerId === 'bone') return 'bones';
    return layerId;
}

function ensureVesselRuleState() {
    if (G.vesselRule === undefined) G.vesselRule = null;
    if (G.vesselRuleCooldownUntilMonth == null) G.vesselRuleCooldownUntilMonth = 0;
    if (!G.vesselRule) return;
    if (!G.vesselRule.progression) G.vesselRule.progression = {};
    if (G.vesselRule.progressionPct == null) G.vesselRule.progressionPct = 0;
    if (G.vesselRule.swornAtMonth == null) G.vesselRule.swornAtMonth = G.ageMonths || 0;
}

function hasVesselRule() {
    ensureVesselRuleState();
    return !!(G.vesselRule && G.vesselRule.id);
}

function getVesselRuleId() {
    return hasVesselRule() ? G.vesselRule.id : null;
}

function getVesselRuleDef(id) {
    if (!id || typeof VESSEL_RULES === 'undefined') return null;
    return VESSEL_RULES[id] || null;
}

function getActiveVesselRuleDef() {
    const id = getVesselRuleId();
    return id ? getVesselRuleDef(id) : null;
}

function isVesselRuleCooldownActive() {
    ensureVesselRuleState();
    return (G.vesselRuleCooldownUntilMonth || 0) > (G.ageMonths || 0);
}

function getVesselRuleCooldownRemainingMonths() {
    if (!isVesselRuleCooldownActive()) return 0;
    return Math.max(0, (G.vesselRuleCooldownUntilMonth || 0) - (G.ageMonths || 0));
}

function formatVesselRuleGateReason(gate) {
    if (!gate) return 'Requirements unknown.';
    const pathData = typeof PATHS !== 'undefined' ? PATHS.body : null;
    const realmName = pathData?.realms?.[gate.vesselRealmIdx] || `vessel realm ${gate.vesselRealmIdx + 1}`;
    const layerId = normalizeVesselRuleBodyLayer(gate.bodyLayer);
    const layer = typeof BODY_CHAMBER_LAYERS !== 'undefined' ? BODY_CHAMBER_LAYERS[layerId] : null;
    const layerLabel = layer?.label || layerId || 'body layer';
    return `Requires ${realmName} and ${gate.bodyLayerPct}% ${layerLabel} refinement`;
}

function checkVesselRuleSwearGate(ruleId) {
    const def = getVesselRuleDef(ruleId);
    if (!def) return { ok: false, reason: 'Unknown rule.' };
    const gate = def.swearGate;
    if (!gate) return { ok: true };

    const vesselIdx = typeof getTrackRealmIdx === 'function' ? getTrackRealmIdx('vessel') : 0;
    if (vesselIdx < (gate.vesselRealmIdx ?? 0)) {
        return { ok: false, reason: formatVesselRuleGateReason(gate) };
    }

    const layerId = normalizeVesselRuleBodyLayer(gate.bodyLayer);
    const layerPct = typeof getBodyLayerProgress === 'function' ? getBodyLayerProgress(layerId) : 0;
    if (layerPct < (gate.bodyLayerPct ?? 0)) {
        return { ok: false, reason: formatVesselRuleGateReason(gate) };
    }
    return { ok: true };
}

function canSwearVesselRule(ruleId) {
    ensureVesselRuleState();
    if (vesselRuleActionBlocked()) {
        return { ok: false, reason: 'Cannot swear a Vessel Rule during combat or tribulation.' };
    }
    if (hasVesselRule()) {
        return { ok: false, reason: 'You already bear a sworn Vessel Rule.' };
    }
    if (isVesselRuleCooldownActive()) {
        const months = getVesselRuleCooldownRemainingMonths();
        const years = (months / 12).toFixed(1).replace(/\.0$/, '');
        return { ok: false, reason: `The flesh still remembers your broken oath — wait ${months} months (${years} years).` };
    }
    const def = getVesselRuleDef(ruleId);
    if (!def) return { ok: false, reason: 'Unknown rule.' };
    const gate = checkVesselRuleSwearGate(ruleId);
    if (!gate.ok) return gate;
    return { ok: true };
}

function swearVesselRule(ruleId) {
    const check = canSwearVesselRule(ruleId);
    if (!check.ok) return { success: false, message: check.reason };

    const def = getVesselRuleDef(ruleId);
    const bal = typeof VESSEL_RULE_BALANCE !== 'undefined' ? VESSEL_RULE_BALANCE : { swearMonths: 6 };
    const months = bal.swearMonths || 6;

    beginActionLog();
    if (!advanceTime(months, `Swearing the ${def.name}`)) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends...' };
    }

    G.vesselRule = {
        id: ruleId,
        swornAtMonth: G.ageMonths,
        progression: {},
        progressionPct: 0
    };
    ensureVesselRuleState();

    const mechanicsNote = def.implemented
        ? ''
        : ' Rule sworn — full mechanics arrive in a future update.';
    const msg = `${def.emoji} You swear the ${def.name}. "${def.oath}"${mechanicsNote}`;
    commitActionLog(msg);
    if (typeof checkPerfectCultivation === 'function') checkPerfectCultivation();
    return { success: true, message: msg, logged: true };
}

function canReleaseVesselRule() {
    ensureVesselRuleState();
    if (!hasVesselRule()) {
        return { ok: false, reason: 'No Vessel Rule to release.' };
    }
    if (vesselRuleActionBlocked()) {
        return { ok: false, reason: 'Cannot release a Vessel Rule during combat or tribulation.' };
    }
    return { ok: true };
}

function applyVesselRuleAbandonPunishment() {
    const bal = typeof VESSEL_RULE_BALANCE !== 'undefined' ? VESSEL_RULE_BALANCE : {};
    if (bal.abandonRegressRealm && typeof regressVesselTrackToCurrentRealmStart === 'function') {
        regressVesselTrackToCurrentRealmStart();
    }
    // Cooldown blocks re-swear until this month — no extra time cost on release.
    const cooldownMonths = bal.releaseCooldownMonths || 12;
    G.vesselRuleCooldownUntilMonth = (G.ageMonths || 0) + cooldownMonths;
}

function releaseVesselRule() {
    const check = canReleaseVesselRule();
    if (!check.ok) return { success: false, message: check.reason };

    const def = getActiveVesselRuleDef();
    const ruleName = def?.name || 'Vessel Rule';
    const realmName = typeof getVesselRealm === 'function' ? getVesselRealm() : 'your vessel realm';
    const cooldownMonths = (typeof VESSEL_RULE_BALANCE !== 'undefined'
        ? VESSEL_RULE_BALANCE.releaseCooldownMonths : 12) || 12;

    applyVesselRuleAbandonPunishment();
    G.vesselRule = null;
    ensureVesselRuleState();

    const msg = `💔 You break the ${ruleName}. The flesh recoils — cast back to the start of ${realmName}, `
        + `all Rule progression lost. ${cooldownMonths} months must pass before another oath may be sworn.`;
    addLog(msg);
    if (typeof checkPerfectCultivation === 'function') checkPerfectCultivation();
    if (typeof fullRender === 'function') fullRender();
    return { success: true, message: msg, logged: true };
}

function getVesselRuleProgressionPct() {
    if (!hasVesselRule()) return 0;
    return Math.min(100, Math.max(0, G.vesselRule.progressionPct || 0));
}

function grantVesselRuleProgression(amount, source) {
    if (!hasVesselRule() || !amount) return 0;
    const before = getVesselRuleProgressionPct();
    const complete = typeof VESSEL_RULE_BALANCE !== 'undefined'
        ? (VESSEL_RULE_BALANCE.progressionCompletePct ?? 100)
        : 100;
    G.vesselRule.progressionPct = Math.min(complete, before + amount);
    if (source && G.vesselRule.progression) {
        G.vesselRule.progression[source] = (G.vesselRule.progression[source] || 0) + amount;
    }
    if (G.vesselRule.progressionPct >= complete && before < complete) {
        addLog(`⚖️ Your Vessel Rule nears its apex — the oath is fulfilled in flesh.`);
        if (typeof checkPerfectCultivation === 'function') checkPerfectCultivation();
    }
    return G.vesselRule.progressionPct - before;
}

function isVesselRuleProgressionComplete() {
    if (!hasVesselRule()) return false;
    const complete = typeof VESSEL_RULE_BALANCE !== 'undefined'
        ? (VESSEL_RULE_BALANCE.progressionCompletePct ?? 100)
        : 100;
    return getVesselRuleProgressionPct() >= complete;
}

function hasVesselInteriorPeak() {
    return hasVesselRule() && isVesselRuleProgressionComplete();
}

function getVesselRuleSoulContestPct() {
    return 0;
}

function vesselRuleActionBlocked() {
    return G.gameOver || G.inCombat
        || (typeof isTribulationActive === 'function' && isTribulationActive());
}

// Combat hooks — no-op until Blood / Unnamed PRs wire mechanics.
function onCombatStartVesselRule() {}

function onPlayerDamagedVesselRule(_dmg, _opts) {}
