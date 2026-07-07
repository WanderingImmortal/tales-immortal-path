// ============================================
// TECHNIQUES.JS — Manual shelf, comprehension, combat viability
// ============================================

function ensureManualShelf() {
    if (!G.manualShelf) G.manualShelf = {};
}

function migrateTechniqueManuals() {
    ensureManualShelf();
}

function getManualShelfEntry(techName) {
    ensureManualShelf();
    return G.manualShelf[techName] || null;
}

function countManualShelfTotal() {
    ensureManualShelf();
    return Object.values(G.manualShelf).reduce((n, e) => n + (e.count || 0), 0);
}

function getTechniqueTrackLabel(template) {
    if (!template) return 'Technique';
    if (template.path === 'body') return 'Martial';
    if (template.path === 'soul') return 'Soul';
    if (template.path === 'qi') return 'Qi';
    return 'Technique';
}

function canLearnTechnique(template) {
    if (!template) return false;
    if (template.reqPath && G.path !== template.reqPath) return false;
    if (template.reqRealm != null && G.realmIdx < template.reqRealm) return false;
    if (template.reqTechnique && !G.techniques.some(t => t.name === template.reqTechnique)) return false;
    return true;
}

function grantManual(techName, opts) {
    const template = TECHNIQUE_POOL.find(t => t.name === techName);
    if (!template) return false;
    ensureManualShelf();
    const entry = G.manualShelf[techName];
    if (entry) {
        entry.count = (entry.count || 1) + 1;
    } else {
        G.manualShelf[techName] = {
            technique: techName,
            count: 1,
            quality: 'clean',
            source: opts?.source || null
        };
    }
    if (!opts?.silent) {
        const track = getTechniqueTrackLabel(template);
        addLog(`📜 ${track} manual shelved: ${techName}.`);
    }
    return true;
}

function getComprehendBlockReason(template) {
    if (!template) return 'Unknown manual.';
    if (G.techniques.some(t => t.name === template.name)) return 'Already comprehended.';
    if (!getManualShelfEntry(template.name)) return 'No manual on your shelf.';
    if (template.path === 'body' && G.path !== 'body') {
        return 'Martial arts require the body path — shelve or consign, but you cannot comprehend this art.';
    }
    if (template.reqPath && G.path !== template.reqPath) {
        return `Requires ${template.reqPath} cultivation path.`;
    }
    if (template.reqRealm != null && G.realmIdx < template.reqRealm) {
        const realmName = PATHS[G.path]?.realms[template.reqRealm] || `realm ${template.reqRealm + 1}`;
        return `Requires ${realmName} or higher.`;
    }
    if (template.reqTechnique && !G.techniques.some(t => t.name === template.reqTechnique)) {
        return `Requires ${template.reqTechnique} first.`;
    }
    if (G.inCombat) return 'Cannot study during combat.';
    if (typeof actionBlocked === 'function' && actionBlocked()) return 'You cannot study manuals right now.';
    return null;
}

function canComprehendManual(techName) {
    const template = TECHNIQUE_POOL.find(t => t.name === techName);
    return !getComprehendBlockReason(template);
}

function getComprehendManualMonths(template) {
    const b = MANUAL_BALANCE;
    const rarity = template?.rarity || 'common';
    return b.monthsByRarity[rarity] ?? b.defaultMonths;
}

function removeManualFromShelf(techName, qty) {
    ensureManualShelf();
    const entry = G.manualShelf[techName];
    if (!entry) return;
    entry.count -= qty || 1;
    if (entry.count <= 0) delete G.manualShelf[techName];
}

function getManualConsignPrice(template) {
    const b = MANUAL_BALANCE.consignByRarity;
    return b[template.rarity] || 8;
}

function consignManual(techName) {
    const entry = getManualShelfEntry(techName);
    const template = TECHNIQUE_POOL.find(t => t.name === techName);
    if (!entry || !template) return false;
    if (G.inCombat) {
        addLog('📜 Cannot consign manuals during combat.');
        fullRender();
        return false;
    }
    const price = getManualConsignPrice(template);
    removeManualFromShelf(techName, 1);
    G.stones += price;
    addLog(`💎 Consigned a ${techName} manual for ${price} Stones.`);
    fullRender();
    return true;
}

function comprehendManual(techName) {
    const template = TECHNIQUE_POOL.find(t => t.name === techName);
    const block = getComprehendBlockReason(template);
    if (block) {
        addLog(`📜 ${block}`);
        fullRender();
        return false;
    }
    const months = getComprehendManualMonths(template);
    beginActionLog();
    if (!advanceTime(months, `Comprehending ${techName}`)) {
        cancelActionLog();
        fullRender();
        return false;
    }
    const learned = learnTechnique(techName, { silent: true });
    if (!learned) {
        commitActionLog(`📜 ${months} months studying ${techName} — insight slips away. The manual remains.`);
        fullRender();
        return false;
    }
    removeManualFromShelf(techName, 1);
    const track = getTechniqueTrackLabel(template);
    commitActionLog(`📜 ${track} art comprehended: ${techName}! (${months} mo)`);
    fullRender();
    return true;
}

/** Combat + UI viability — body arts fail off-path; intent gates debuff later-tier arts. */
function getTechniqueCombatViability(tech) {
    const meta = getTechniqueMeta(tech);
    const template = TECHNIQUE_POOL.find(t => t.name === tech.name);
    const result = { usable: true, dmgMult: 1, costMult: 1, warnIcon: '', warnText: '' };

    if (meta.path === 'body' && G.path !== 'body') {
        return {
            usable: false,
            dmgMult: 0,
            costMult: 1,
            warnIcon: '💪',
            warnText: 'Martial art — requires body cultivation.'
        };
    }

    if (template?.intentReq && typeof getActiveIntent === 'function' && typeof getIntentTierIndex === 'function') {
        const req = template.intentReq;
        const active = getActiveIntent();
        const stage = active ? getIntentTierIndex(active.uses) : -1;
        const weaponMatch = active && active.weapon === req.weapon;
        const stageOk = stage >= (req.minStage ?? 0);
        if (!weaponMatch || !stageOk) {
            const debuff = template.intentDebuff || MANUAL_BALANCE.defaultIntentDebuff;
            result.dmgMult *= debuff.dmgMult ?? 0.45;
            result.costMult *= debuff.costMult ?? 1.25;
            result.warnIcon = '🗡️';
            const stageName = INTENT_TIERS[req.minStage]?.name || 'higher';
            result.warnText = `Weak without ${req.weapon} intent (${stageName}+).`;
        }
    }

    return result;
}

function getTechniqueViabilityBadge(tech) {
    const v = getTechniqueCombatViability(tech);
    if (!v.usable) return `<span class="tech-viability-warn" title="${v.warnText}">${v.warnIcon} ✕</span>`;
    if (v.warnIcon) return `<span class="tech-viability-warn" title="${v.warnText}">${v.warnIcon} ⚠</span>`;
    return '';
}
