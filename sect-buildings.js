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
}

function getTreasuryPendingTithe() {
    ensureSectBuildingMeta();
    return G.sect.buildingMeta.treasury?.pendingTithe || 0;
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
    const totalMult = typeof getSectCultivationMult === 'function' ? getSectCultivationMult() : 1;
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
