// Contextual NPC decision resolver (NPC agency Phase D).
// Intention ≠ outcome. Operates on actor knowledge — never omniscient incident.facts.
// Reusable beyond Well-Ring; situation packs supply options + context.

const NPC_DECISION_VERSION = 1;

function ensureNpcDecisionState() {
    if (typeof G === 'undefined') return null;
    if (!G.npcDecisions || typeof G.npcDecisions !== 'object') {
        G.npcDecisions = { version: NPC_DECISION_VERSION, nextSeq: 1, byId: {}, byActor: {}, byThread: {} };
    }
    const s = G.npcDecisions;
    if (s.version == null) s.version = NPC_DECISION_VERSION;
    if (s.nextSeq == null) s.nextSeq = 1;
    if (!s.byId) s.byId = {};
    if (!s.byActor) s.byActor = {};
    if (!s.byThread) s.byThread = {};
    return s;
}

function allocateNpcDecisionId() {
    ensureNpcDecisionState();
    const seq = G.npcDecisions.nextSeq++;
    return `dec_${Math.floor(G.ageMonths || 0)}_${seq}`;
}

function cloneNpcDecisionRecord(obj) {
    return obj == null ? null : JSON.parse(JSON.stringify(obj));
}

function createNpcDecisionRng(seed) {
    let s = (seed == null ? Math.floor(Math.random() * 1e9) : seed) >>> 0;
    if (!s) s = 1;
    return function npcDecisionRng() {
        // xorshift32
        s ^= s << 13;
        s ^= s >>> 17;
        s ^= s << 5;
        return ((s >>> 0) % 10000) / 10000;
    };
}

function indexDecisionPush(map, key, id) {
    if (!key || !id) return;
    if (!map[key]) map[key] = [];
    if (!map[key].includes(id)) map[key].push(id);
}

function getNpcDecisionPersonalitySet(actorId) {
    if (typeof getEffectiveNpcPersonalities === 'function') {
        return getEffectiveNpcPersonalities(actorId) || [];
    }
    return [];
}

function foundationWeight(list, id) {
    if (!Array.isArray(list)) return 0;
    const hit = list.find(x => x && x.id === id);
    if (!hit) return 0;
    return Number(hit.weight != null ? hit.weight : hit.priority != null ? hit.priority : hit.strength) || 0;
}

function getNpcTieStanceToward(actorId, otherId) {
    if (!actorId || !otherId || typeof getNpcTiesFor !== 'function') {
        return { trust: 0, attachment: 0, tension: 0, hasTie: false };
    }
    const ties = getNpcTiesFor(actorId) || [];
    let best = null;
    ties.forEach(tie => {
        const persp = typeof getNpcTiePerspective === 'function'
            ? getNpcTiePerspective(tie, actorId)
            : null;
        if (!persp || !persp.other) return;
        const oid = persp.other.id || persp.other;
        if (String(oid) !== String(otherId) && String(oid).indexOf(String(otherId)) !== 0) return;
        if (!best || (persp.attachment || 0) > (best.attachment || 0)) {
            best = {
                trust: persp.trust || 0,
                attachment: persp.attachment || 0,
                tension: persp.tension || 0,
                hasTie: true,
                kinds: persp.kinds || []
            };
        }
    });
    return best || { trust: 0, attachment: 0, tension: 0, hasTie: false };
}

/**
 * Build a non-omniscient evaluation context for an actor facing a situation.
 * Does not read objective incident.facts into the decision payload.
 */
function buildNpcDecisionContext(spec) {
    spec = spec || {};
    const actorId = spec.actorId;
    if (!actorId) return null;

    const foundation = typeof getNpcCharacterFoundation === 'function'
        ? getNpcCharacterFoundation(actorId)
        : null;
    const personalities = getNpcDecisionPersonalitySet(actorId);
    const values = foundation?.values || (typeof getNpcFoundationValues === 'function' ? getNpcFoundationValues(actorId) : []) || [];
    const ambitions = foundation?.ambitions || (typeof getNpcFoundationAmbitions === 'function' ? getNpcFoundationAmbitions(actorId) : []) || [];
    const convictions = foundation?.convictions || (typeof getNpcFoundationConvictions === 'function' ? getNpcFoundationConvictions(actorId) : []) || [];
    const attachments = foundation?.attachments || (typeof getNpcFoundationAttachments === 'function' ? getNpcFoundationAttachments(actorId) : []) || [];

    const incidentId = spec.incidentId || null;
    const known = (incidentId && typeof getNpcKnownAboutIncident === 'function')
        ? getNpcKnownAboutIncident(actorId, incidentId)
        : { beliefs: [], observations: [], primaryBelief: null };

    const accusedId = spec.accusedId || known.primaryBelief?.claim?.culpritId || null;
    const tieToAccused = accusedId ? getNpcTieStanceToward(actorId, accusedId) : { trust: 0, attachment: 0, tension: 0, hasTie: false };

    const beliefConf = known.primaryBelief ? (known.primaryBelief.confidence || 0) : 0;
    const evidenceStrength = spec.evidenceStrength || (beliefConf >= 0.7 ? 'strong' : beliefConf >= 0.4 ? 'moderate' : 'weak');

    return {
        actorId,
        incidentId,
        accusedId,
        personalities: personalities.slice(),
        values,
        ambitions,
        convictions,
        attachments,
        known: {
            beliefCount: (known.beliefs || []).length,
            observationCount: (known.observations || []).length,
            primaryClaim: known.primaryBelief ? cloneNpcDecisionRecord(known.primaryBelief.claim) : null,
            primaryConfidence: beliefConf,
            claimTopic: known.primaryBelief?.claimTopic || null
        },
        tieToAccused,
        institutionalRole: spec.institutionalRole || null,
        authority: !!spec.authority,
        accusedAvailable: spec.accusedAvailable !== false,
        accusedImportant: spec.accusedImportant != null
            ? !!spec.accusedImportant
            : !!(tieToAccused.hasTie && (tieToAccused.attachment || 0) >= 0.45),
        evidenceStrength,
        pressure: Number(spec.pressure) || 0,
        resources: spec.resources || {},
        risks: spec.risks || {},
        availableOptionIds: Array.isArray(spec.availableOptionIds) ? spec.availableOptionIds.slice() : null
    };
}

function hasPersonality(ctx, id) {
    return (ctx.personalities || []).includes(id);
}

/**
 * Score a catalog of response options. Packs pass option defs with id + baseScore.
 * Returns ranked options with eligibility + factor traces.
 */
function scoreNpcDecisionOptions(ctx, optionDefs) {
    const out = [];
    (optionDefs || []).forEach(def => {
        if (!def || !def.id) return;
        if (ctx.availableOptionIds && !ctx.availableOptionIds.includes(def.id)) return;

        const factors = [];
        let score = def.baseScore != null ? def.baseScore : 1;
        let eligible = true;

        if (typeof def.eligible === 'function') {
            eligible = !!def.eligible(ctx);
        } else if (def.requiresAuthority && !ctx.authority) {
            eligible = false;
            factors.push({ id: 'no_authority', delta: 0, note: 'lacks institutional authority' });
        }
        if (def.requiresAccusedAvailable && !ctx.accusedAvailable) {
            eligible = false;
            factors.push({ id: 'accused_unavailable', delta: 0, note: 'accused not available' });
        }
        if (def.requiresBelief && !ctx.known.primaryClaim) {
            eligible = false;
            factors.push({ id: 'no_belief', delta: 0, note: 'no belief about the matter' });
        }

        // Soft character influences — boosts/penalties, never hard locks (except eligibility).
        if (hasPersonality(ctx, 'careful')) {
            if (def.tags?.includes('cautious')) { score += 0.35; factors.push({ id: 'careful_cautious', delta: 0.35 }); }
            if (def.tags?.includes('harsh')) { score -= 0.25; factors.push({ id: 'careful_against_harsh', delta: -0.25 }); }
        }
        if (hasPersonality(ctx, 'loyal')) {
            if (ctx.accusedImportant && def.tags?.includes('protect_own')) {
                score += 0.4;
                factors.push({ id: 'loyal_to_own', delta: 0.4 });
            }
            if (ctx.accusedImportant && def.tags?.includes('harsh')) {
                score -= 0.35;
                factors.push({ id: 'loyal_against_harsh_own', delta: -0.35 });
            }
        }
        if (hasPersonality(ctx, 'pragmatic') || foundationWeight(ctx.values, 'pragmatism') >= 0.5) {
            if (def.tags?.includes('practical')) { score += 0.3; factors.push({ id: 'pragmatism', delta: 0.3 }); }
            if (def.tags?.includes('spectacle')) { score -= 0.2; factors.push({ id: 'anti_spectacle', delta: -0.2 }); }
        }

        const lodgeLegacy = foundationWeight(ctx.values, 'lodge_legacy');
        if (lodgeLegacy >= 0.6) {
            if (def.tags?.includes('protect_institution')) {
                score += 0.35 * lodgeLegacy;
                factors.push({ id: 'lodge_legacy', delta: +(0.35 * lodgeLegacy).toFixed(3) });
            }
        }
        const security = foundationWeight(ctx.values, 'personal_security');
        if (security >= 0.6 && def.tags?.includes('cautious')) {
            score += 0.2 * security;
            factors.push({ id: 'security', delta: +(0.2 * security).toFixed(3) });
        }
        const ownPeople = foundationWeight(ctx.values, 'own_people');
        if (ownPeople >= 0.6 && ctx.accusedImportant && def.tags?.includes('protect_own')) {
            score += 0.25 * ownPeople;
            factors.push({ id: 'own_people', delta: +(0.25 * ownPeople).toFixed(3) });
        }

        const negotiate = foundationWeight(ctx.convictions, 'negotiate_to_preserve');
        if (negotiate >= 0.6) {
            if (def.tags?.includes('negotiate')) { score += 0.3 * negotiate; factors.push({ id: 'negotiate', delta: +(0.3 * negotiate).toFixed(3) }); }
            if (def.tags?.includes('harsh') && ctx.evidenceStrength !== 'strong') {
                score -= 0.4 * negotiate;
                factors.push({ id: 'negotiate_blocks_weak_harsh', delta: -(0.4 * negotiate).toFixed(3) });
            }
        }
        const loyaltyEarned = foundationWeight(ctx.convictions, 'loyalty_is_earned');
        if (loyaltyEarned >= 0.5 && ctx.accusedImportant && def.tags?.includes('harsh')) {
            // Loyalty does not guarantee protection — only softens when evidence is weak.
            if (ctx.evidenceStrength === 'weak') {
                score -= 0.2 * loyaltyEarned;
                factors.push({ id: 'loyalty_earned_weak_evidence', delta: -(0.2 * loyaltyEarned).toFixed(3) });
            } else if (ctx.evidenceStrength === 'strong') {
                score += 0.15 * loyaltyEarned;
                factors.push({ id: 'loyalty_earned_allows_consequence', delta: +(0.15 * loyaltyEarned).toFixed(3) });
            }
        }

        const preserve = foundationWeight(ctx.ambitions, 'preserve_well_ring');
        if (preserve >= 0.5 && def.tags?.includes('protect_institution')) {
            score += 0.25 * preserve;
            factors.push({ id: 'preserve_ambition', delta: +(0.25 * preserve).toFixed(3) });
        }

        // Tie stance
        if (ctx.tieToAccused.hasTie) {
            const att = ctx.tieToAccused.attachment || 0;
            const ten = ctx.tieToAccused.tension || 0;
            const tru = ctx.tieToAccused.trust || 0;
            if (def.tags?.includes('harsh')) {
                score -= att * 0.5;
                score += ten * 0.45;
                factors.push({ id: 'tie_harsh_mod', delta: +((-att * 0.5) + (ten * 0.45)).toFixed(3) });
            }
            if (def.tags?.includes('protect_own')) {
                score += (att + tru) * 0.35;
                factors.push({ id: 'tie_protect_mod', delta: +((att + tru) * 0.35).toFixed(3) });
            }
        }

        // Belief / evidence
        const conf = ctx.known.primaryConfidence || 0;
        if (def.tags?.includes('needs_certainty')) {
            if (conf < 0.35 || ctx.evidenceStrength === 'weak') {
                score -= 0.55;
                factors.push({ id: 'uncertain_evidence', delta: -0.55 });
            } else if (ctx.evidenceStrength === 'strong' && conf >= 0.65) {
                score += 0.45;
                factors.push({ id: 'strong_evidence', delta: 0.45 });
            }
        }
        if (def.tags?.includes('inaction') && conf < 0.4) {
            score += 0.25;
            factors.push({ id: 'uncertain_favors_inaction', delta: 0.25 });
        }
        if (def.tags?.includes('investigate') && conf < 0.7) {
            score += 0.35;
            factors.push({ id: 'investigate_when_unsure', delta: 0.35 });
        }

        if (ctx.pressure >= 0.6 && def.tags?.includes('inaction')) {
            score -= 0.3 * ctx.pressure;
            factors.push({ id: 'pressure_against_inaction', delta: -(0.3 * ctx.pressure).toFixed(3) });
        }

        if (typeof def.scoreHook === 'function') {
            const hooked = def.scoreHook(ctx, score, factors) || {};
            if (hooked.score != null) score = hooked.score;
            if (hooked.eligible != null) eligible = !!hooked.eligible;
        }

        out.push({
            id: def.id,
            label: def.label || def.id,
            eligible,
            score: Math.round(score * 1000) / 1000,
            tags: (def.tags || []).slice(),
            factors
        });
    });
    return out.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}

/**
 * Pick among eligible options. Randomness varies among plausible choices;
 * never selects ineligible options in ordinary play.
 * forceChoice only applies when allowForceChoice is true (developer/test).
 */
function pickNpcDecisionOption(scored, rng, options) {
    options = options || {};
    const rngFn = typeof rng === 'function' ? rng : createNpcDecisionRng(rng);
    const eligible = scored.filter(o => o.eligible);
    if (!eligible.length) return null;

    if (options.forceChoice && options.allowForceChoice) {
        // Developer/test only — may select an ineligible intention so outcome gates can be tested.
        // Outcome feasibility is still enforced separately (e.g. accused unavailable).
        const forced = scored.find(o => o.id === options.forceChoice) ||
            eligible.find(o => o.id === options.forceChoice);
        if (forced) return forced;
    }

    const floor = options.scoreFloor != null ? options.scoreFloor : 0.15;
    const top = eligible[0].score;
    const pool = eligible.filter(o => o.score >= Math.max(floor, top - (options.plausibleMargin != null ? options.plausibleMargin : 0.85)));
    const weights = pool.map(o => Math.max(0.05, o.score));
    const sum = weights.reduce((a, b) => a + b, 0);
    let roll = rngFn() * sum;
    for (let i = 0; i < pool.length; i++) {
        roll -= weights[i];
        if (roll <= 0) return pool[i];
    }
    return pool[pool.length - 1];
}

/**
 * Resolve a contextual decision. Returns intention record (not an outcome).
 */
function resolveNpcContextualDecision(spec) {
    spec = spec || {};
    ensureNpcDecisionState();
    const ctx = buildNpcDecisionContext(spec);
    if (!ctx) return null;

    const optionDefs = spec.optionDefs || [];
    const scored = scoreNpcDecisionOptions(ctx, optionDefs);
    const rng = createNpcDecisionRng(spec.seed);
    const allowForceChoice = !!(spec.allowForceChoice || spec.developer);
    const chosen = pickNpcDecisionOption(scored, rng, {
        forceChoice: allowForceChoice ? spec.forceChoice : null,
        allowForceChoice,
        scoreFloor: spec.scoreFloor,
        plausibleMargin: spec.plausibleMargin
    });

    const id = spec.id || allocateNpcDecisionId();
    const decision = {
        id,
        version: NPC_DECISION_VERSION,
        actorId: ctx.actorId,
        threadId: spec.threadId || null,
        incidentId: ctx.incidentId,
        atMonths: G.ageMonths || 0,
        // Intention only — outcomes recorded separately.
        status: 'chosen',
        chosen: chosen ? chosen.id : 'inaction',
        chosenLabel: chosen ? chosen.label : 'Inaction',
        optionsConsidered: scored.map(o => ({
            id: o.id,
            eligible: o.eligible,
            score: o.score,
            factors: o.factors
        })),
        factors: chosen ? chosen.factors : [{ id: 'no_eligible', note: 'no eligible options' }],
        // Non-omniscient snapshot for traces / tests
        knowledgeSnapshot: cloneNpcDecisionRecord(ctx.known),
        contextSnapshot: {
            accusedId: ctx.accusedId,
            accusedAvailable: ctx.accusedAvailable,
            accusedImportant: ctx.accusedImportant,
            evidenceStrength: ctx.evidenceStrength,
            authority: ctx.authority,
            institutionalRole: ctx.institutionalRole,
            pressure: ctx.pressure,
            personalities: ctx.personalities.slice(),
            tieToAccused: cloneNpcDecisionRecord(ctx.tieToAccused)
        },
        seed: spec.seed != null ? spec.seed : null,
        outcomeId: null
    };

    G.npcDecisions.byId[id] = decision;
    indexDecisionPush(G.npcDecisions.byActor, decision.actorId, id);
    if (decision.threadId) indexDecisionPush(G.npcDecisions.byThread, decision.threadId, id);
    return cloneNpcDecisionRecord(decision);
}

function getNpcDecision(decisionId) {
    ensureNpcDecisionState();
    return cloneNpcDecisionRecord(G.npcDecisions.byId[decisionId]);
}

function getNpcDecisionsFor(actorId) {
    ensureNpcDecisionState();
    const ids = G.npcDecisions.byActor[actorId] || [];
    return ids.map(id => G.npcDecisions.byId[id]).filter(Boolean).map(cloneNpcDecisionRecord);
}

function markNpcDecisionAttempted(decisionId, outcomeId) {
    ensureNpcDecisionState();
    const d = G.npcDecisions.byId[decisionId];
    if (!d) return null;
    d.status = 'attempted';
    if (outcomeId) d.outcomeId = outcomeId;
    return cloneNpcDecisionRecord(d);
}

function markNpcDecisionCompleted(decisionId, outcomeId) {
    ensureNpcDecisionState();
    const d = G.npcDecisions.byId[decisionId];
    if (!d) return null;
    d.status = 'completed';
    if (outcomeId) d.outcomeId = outcomeId;
    return cloneNpcDecisionRecord(d);
}

function migrateNpcDecisionsForExistingSave() {
    ensureNpcDecisionState();
}
