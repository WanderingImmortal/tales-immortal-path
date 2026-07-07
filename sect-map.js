// ============================================
// SECT-MAP.JS — Illustrated sect grounds map & building views
// ============================================

function ensureSectGroundsView() {
    ensureSectState();
    if (!G.sect.groundsView) G.sect.groundsView = 'map';
    if (!G.sect.residence) {
        G.sect.residence = { level: 0, stash: [], lastRestMonths: null, formations: { slots: [] } };
    }
    if (G.sect.residence.level == null) G.sect.residence.level = isSectFounded() ? 0 : 0;
    if (!G.sect.residence.stash) G.sect.residence.stash = [];
    if (typeof ensureFormationState === 'function') ensureFormationState();
}

function setSectGroundsView(viewId) {
    ensureSectGroundsView();
    G.sect.groundsView = viewId || 'map';
}

function getResidenceLevel() {
    ensureSectGroundsView();
    return G.sect.residence.level || 0;
}

function getResidenceDef(level) {
    const lv = level != null ? level : getResidenceLevel();
    return SECT_RESIDENCE.levels[lv] || SECT_RESIDENCE.levels[0];
}

function getSectMapNodeDef(nodeId) {
    if (nodeId === 'residence') return { id: 'residence', name: SECT_RESIDENCE.name, emoji: SECT_RESIDENCE.emoji, type: 'residence' };
    if (nodeId === 'courtyard') return { id: 'courtyard', name: 'Courtyard', emoji: '⛩️', type: 'hub' };
    if (nodeId === 'inventory') return { id: 'inventory', name: 'Sect Stores', emoji: '📦', type: 'inventory' };
    const bld = SECT_BUILDINGS[nodeId];
    if (!bld) return null;
    return { id: bld.id, name: bld.name, emoji: bld.emoji, type: 'building', building: bld };
}

function isSectMapNodeLocked(nodeId) {
    if (nodeId === 'residence' || nodeId === 'courtyard' || nodeId === 'inventory') return false;
    const bld = SECT_BUILDINGS[nodeId];
    if (!bld) return true;
    return !meetsStageRequirement(bld.minStage);
}

function isSectMapNodeUnderConstruction(nodeId) {
    const c = G.sect?.construction;
    return c && c.buildingId === nodeId;
}

function hasSectMapNodeCollectable(nodeId) {
    return typeof hasSectBuildingCollectable === 'function' && hasSectBuildingCollectable(nodeId);
}

function getSectMapNodeLevel(nodeId) {
    if (nodeId === 'residence') return getResidenceLevel();
    if (nodeId === 'courtyard' || nodeId === 'inventory') return null;
    return typeof getBuildingLevel === 'function' ? getBuildingLevel(nodeId) : 0;
}

function getSectMapNodeTierClass(nodeId) {
    const lv = getSectMapNodeLevel(nodeId);
    if (lv == null) return 'tier-hub';
    if (isSectMapNodeUnderConstruction(nodeId)) return 'tier-building';
    if (isSectMapNodeLocked(nodeId)) return 'tier-locked';
    if (lv <= 0) return 'tier-scaffold';
    if (lv >= 3) return 'tier-max';
    return 'tier-built';
}

function renderSectGroundsHtml() {
    ensureSectGroundsView();
    const view = G.sect.groundsView || 'map';
    if (view === 'map') return renderSectMapHtml();
    if (view === 'courtyard') return renderSectCourtyardHtml();
    if (view === 'inventory') return renderSectInventoryPanelHtml();
    if (view === 'residence') return renderSectResidenceDetailHtml();
    if (SECT_BUILDINGS[view]) return renderSectBuildingDetailHtml(view);
    G.sect.groundsView = 'map';
    return renderSectMapHtml();
}

function renderSectMapHeaderHtml() {
    const stage = getSectStageDef();
    const docDef = getSectDoctrineDef();
    const infZone = getSectInfluenceZone();
    const infLabel = infZone && ZONES[infZone] ? `${ZONES[infZone].emoji} ${ZONES[infZone].name}` : null;
    const invUsed = typeof getSectInventoryUsed === 'function' ? getSectInventoryUsed() : 0;
    const invCap = typeof getSectInventoryCapacity === 'function' ? getSectInventoryCapacity() : 50;
    let html = `<div class="sect-map-header">`;
    html += `<div class="sect-panel-header">
        <div class="sect-stage-badge">${stage.emoji} ${stage.label}</div>
        ${docDef ? `<div class="sect-doctrine-tag">${docDef.emoji} ${docDef.label}</div>` : ''}
    </div>`;
    html += `<div class="sect-stat-grid sect-map-stat-grid">
        <div class="sect-stat"><span class="label">Renown</span><span class="value">${G.sect.renown || 0}</span></div>
        <div class="sect-stat"><span class="label">Disciples</span><span class="value">${getDiscipleCount()}</span></div>
        <div class="sect-stat"><span class="label">Income</span><span class="value">💎 ${getSectDiscipleIncome() || 0}</span></div>
        <div class="sect-stat sect-stat-clickable" data-sect-view="inventory" title="Open sect stores">
            <span class="label">Stores</span><span class="value">📦 ${invUsed}/${invCap}</span>
        </div>
    </div>`;
    if (infLabel) {
        html += `<div class="sect-influence-banner">🌏 Influence: <strong>${infLabel}</strong></div>`;
    }
    const c = G.sect.construction;
    if (c) {
        const def = getSectMapNodeDef(c.buildingId);
        const remain = Math.max(0, (c.completesAtMonths || 0) - G.ageMonths);
        html += `<div class="sect-construction-banner">🏗️ ${def?.emoji || ''} ${def?.name || c.buildingId} → Lv ${c.targetLevel}: <strong>${remain}mo</strong> remaining</div>`;
    }
    html += `</div>`;
    return html;
}

function renderSectMapHtml() {
    ensureSectGroundsView();
    let html = renderSectMapHeaderHtml();
    html += `<div class="sect-map-scene" role="img" aria-label="Sect grounds map">`;
    html += `<div class="sect-map-sky"></div>`;
    html += `<div class="sect-map-mountains"></div>`;
    html += `<div class="sect-map-mist"></div>`;
    html += `<div class="sect-map-ground"></div>`;
    html += `<div class="sect-map-paths"></div>`;
    html += `<div class="sect-map-nodes">`;

    Object.entries(SECT_MAP_NODES).forEach(([nodeId, pos]) => {
        const def = getSectMapNodeDef(nodeId);
        if (!def) return;
        const locked = isSectMapNodeLocked(nodeId);
        const lv = getSectMapNodeLevel(nodeId);
        const tier = getSectMapNodeTierClass(nodeId);
        const collect = hasSectMapNodeCollectable(nodeId);
        const building = def.type === 'building';
        const lvLabel = lv != null && building ? `Lv ${lv}` : '';
        const title = locked && building
            ? `${def.name} — Requires ${SECT_STAGES[SECT_BUILDINGS[nodeId].minStage]?.label || ''}`
            : `${def.name}${lvLabel ? ' · ' + lvLabel : ''}`;

        html += `<button type="button" class="sect-map-node ${tier}${collect ? ' has-collect' : ''}${locked ? ' is-locked' : ''}"
            data-sect-view="${nodeId}"
            style="left:${pos.x}%;top:${pos.y}%;z-index:${pos.layer || 1}"
            title="${escapeSectAttr(title)}">
            <span class="sect-map-node-icon">${def.emoji}</span>
            <span class="sect-map-node-label">${def.name}</span>
            ${lvLabel ? `<span class="sect-map-node-lv">${lvLabel}</span>` : ''}
            ${collect ? '<span class="sect-map-collect-dot"></span>' : ''}
            ${isSectMapNodeUnderConstruction(nodeId) ? '<span class="sect-map-scaffold">🚧</span>' : ''}
        </button>`;
    });

    html += `</div></div>`;
    html += `<p class="sect-hint sect-map-hint">Click a building to visit it. Courtyard holds disciples and sect affairs.</p>`;
    return html;
}

function renderSectCourtyardHtml() {
    const stage = getSectStageDef();
    const docDef = getSectDoctrineDef();
    let html = `<div class="sect-grounds-panel">`;
    html += `<div class="sect-grounds-breadcrumb">
        <button type="button" class="sect-bc-btn" data-sect-view="map">🗺️ Grounds</button>
        <span class="sect-bc-sep">›</span>
        <span>⛩️ Courtyard</span>
    </div>`;
    html += `<p class="sect-hint">The heart of ${G.sect.name || 'your sect'} — roster, advancement, and affairs.</p>`;

    if (docDef) {
        html += `<div class="sect-doctrine-display">${docDef.emoji} <strong>${docDef.label}</strong> · ${docDef.subtitle}</div>`;
        html += renderSectReputationMeterHtml();
    }

    const advBlock = getAdvanceSectBlockReason();
    if (stage.next) {
        const next = SECT_STAGES[stage.next];
        html += `<div class="sect-progress-block">
            <div class="sect-progress-label">Next: ${next.emoji} ${next.label}</div>
            <div class="sect-progress-hint">${advBlock || 'Ready to advance!'}</div>
            <button type="button" class="sect-action-btn" id="btnAdvanceSect" ${advBlock ? 'disabled' : ''}>⬆️ Advance Sect</button>
        </div>`;
    }

    if (getDiscipleCount()) {
        html += `<div class="sect-section-title">📿 Disciples</div><div class="sect-disciple-list">`;
        G.sect.discipleRecords.forEach(d => {
            const role = DISCIPLE_ROLES[d.role] || DISCIPLE_ROLES.acolyte;
            const traitDef = typeof getDiscipleTraitDef === 'function' ? getDiscipleTraitDef(d.trait) : null;
            const traitTip = traitDef
                ? escapeSectAttr(`${traitDef.desc}${traitDef.effectDesc ? ' — ' + traitDef.effectDesc : ''}`)
                : '';
            const served = Math.floor(getDiscipleMonthsServed(d) / 12);
            const promoteBlock = getPromoteBlockReason(d.uid);
            const canPromote = !promoteBlock && role.promoteReq;
            html += `<div class="sect-disciple-row">
                <div class="sect-disciple-info">
                    <span class="name">${role.emoji} ${d.name}${traitDef ? ` <span class="sect-trait-tag" title="${traitTip}">${traitDef.emoji} ${traitDef.label}</span>` : ''}</span>
                    <span class="role">${role.label} · ${served}y service</span>
                </div>
                ${canPromote
                    ? `<button type="button" class="sect-promote-btn" data-promote-disc="${d.uid}">↑ Promote</button>`
                    : ''}
            </div>`;
        });
        html += `</div>`;
    } else {
        html += `<p class="sect-hint">No disciples yet. Recruit from the main action bar once your fame spreads.</p>`;
    }

    if (meetsStageRequirement('regional')) {
        html += `<div class="sect-section-title">🌏 Zone Influence</div>`;
        html += `<button type="button" class="sect-action-btn" id="btnShiftInfluence">🌏 Shift Influence Here</button>`;
    }

    html += `</div>`;
    return html;
}

function renderSectResidenceDetailHtml() {
    const lv = getResidenceLevel();
    const def = getResidenceDef(lv);
    const maxed = lv >= SECT_RESIDENCE.maxLevel;
    const nextCost = !maxed ? SECT_RESIDENCE.upgradeCosts[lv + 1] : null;
    let html = `<div class="sect-grounds-panel sect-building-detail">`;
    html += `<div class="sect-grounds-breadcrumb">
        <button type="button" class="sect-bc-btn" data-sect-view="map">🗺️ Grounds</button>
        <span class="sect-bc-sep">›</span>
        <span>${SECT_RESIDENCE.emoji} ${SECT_RESIDENCE.name}</span>
    </div>`;
    html += `<div class="sect-building-detail-head">
        <span class="sect-building-detail-emoji">${SECT_RESIDENCE.emoji}</span>
        <div>
            <h3 class="sect-building-detail-title">${def.name} <span class="sect-bld-lv">Lv ${lv}/${SECT_RESIDENCE.maxLevel}</span></h3>
            <p class="sect-building-desc">${def.desc}</p>
        </div>
    </div>`;

    html += `<div class="sect-building-actions">`;
    html += `<div class="sect-section-title">Your Quarters</div>`;
    html += `<p class="sect-hint">Your personal anchor on the grounds. Inscribe formations in the courtyard, then cultivate here for their blessing.</p>`;
    if (typeof renderResidenceFormationsHtml === 'function') {
        html += renderResidenceFormationsHtml();
    }
    html += `</div>`;

    if (!maxed && nextCost) {
        html += renderConstructionChoicesHtml('residence', lv + 1, nextCost);
    } else if (maxed) {
        html += `<div class="sect-max-tag sect-building-max">MAX</div>`;
    }
    html += `</div>`;
    return html;
}

function renderSectBuildingDetailHtml(buildingId) {
    const def = SECT_BUILDINGS[buildingId];
    if (!def) return '';
    const lv = getBuildingLevel(buildingId);
    const locked = !meetsStageRequirement(def.minStage);
    const maxed = lv >= def.maxLevel;
    const underBuild = isSectMapNodeUnderConstruction(buildingId);

    let html = `<div class="sect-grounds-panel sect-building-detail">`;
    html += `<div class="sect-grounds-breadcrumb">
        <button type="button" class="sect-bc-btn" data-sect-view="map">🗺️ Grounds</button>
        <span class="sect-bc-sep">›</span>
        <span>${def.emoji} ${def.name}</span>
    </div>`;

    html += `<div class="sect-building-detail-head">
        <span class="sect-building-detail-emoji">${def.emoji}</span>
        <div>
            <h3 class="sect-building-detail-title">${def.name} <span class="sect-bld-lv">Lv ${lv}/${def.maxLevel}</span></h3>
            <p class="sect-building-desc">${def.desc}</p>
        </div>
    </div>`;

    if (locked) {
        html += `<p class="sect-hint">🔒 Requires ${SECT_STAGES[def.minStage]?.label || def.minStage} sect stage.</p>`;
    } else if (underBuild) {
        const c = G.sect.construction;
        const remain = Math.max(0, (c.completesAtMonths || 0) - G.ageMonths);
        html += `<div class="sect-construction-banner">🚧 Under construction — <strong>${remain} months</strong> remaining.</div>`;
    } else {
        html += renderBuildingActionsHtml(buildingId, lv);
        if (!maxed) {
            const nextLevel = lv + 1;
            const cost = def.levels[nextLevel];
            if (cost) html += renderConstructionChoicesHtml(buildingId, nextLevel, cost);
        } else {
            html += `<div class="sect-max-tag sect-building-max">MAX</div>`;
        }
    }
    html += `</div>`;
    return html;
}

function renderBuildingActionsHtml(buildingId, lv) {
    if (lv <= 0) return `<p class="sect-hint">Construct this building to unlock its powers.</p>`;
    let html = `<div class="sect-building-actions">`;

    if (buildingId === 'spirit_garden') {
        const pending = typeof getSpiritGardenPendingHerbs === 'function' ? getSpiritGardenPendingHerbs() : 0;
        html += `<div class="sect-section-title">🌸 Harvest</div>`;
        html += `<p class="sect-hint">Herbs accumulate while you cultivate. Collect them into sect stores.</p>`;
        html += `<div class="sect-harvest-display">Ready: <strong>${pending}</strong> spirit herb${pending !== 1 ? 's' : ''}</div>`;
        html += `<button type="button" class="sect-action-btn" id="btnHarvestGarden" ${pending <= 0 ? 'disabled' : ''}>🌸 Harvest to Sect Stores</button>`;
    }

    if (buildingId === 'treasury') {
        const pending = typeof getTreasuryPendingTithe === 'function' ? getTreasuryPendingTithe() : 0;
        const income = typeof getSectDiscipleIncome === 'function' ? getSectDiscipleIncome() : 0;
        const fameBonus = typeof getFameLevel === 'function' ? getFameLevel().bonus : 0;
        const bonus = typeof getSectBuildingBonus === 'function' ? getSectBuildingBonus('passiveIncomePct') : 0;
        html += `<div class="sect-section-title">💰 Tithe Chest</div>`;
        html += `<p class="sect-hint">Disciple offerings accumulate when you cultivate (+${bonus}% treasury bonus). Collect stones into sect stores.</p>`;
        html += `<div class="sect-harvest-display">Ready: <strong>${pending}</strong>💎 · Rate: ${income + fameBonus}/cultivate</div>`;
        html += `<button type="button" class="sect-action-btn" id="btnCollectTithe" ${pending <= 0 ? 'disabled' : ''}>💰 Collect Tithe</button>`;
    }

    if (buildingId === 'vault') {
        const stored = G.sect?.inventory?.stones || 0;
        const protect = typeof getVaultProtectionPct === 'function' ? getVaultProtectionPct() : 0;
        const cap = typeof getSectInventoryCapacity === 'function' ? getSectInventoryCapacity() : 50;
        html += `<div class="sect-section-title">🏛️ Vault</div>`;
        html += `<p class="sect-hint">Stones in sect stores are safe from sect event losses. Event losses softened by <strong>${protect}%</strong> on personal stones.</p>`;
        html += `<div class="sect-harvest-display">Sect stores: <strong>${stored}</strong>💎 · Capacity: ${cap}</div>`;
        html += `<div class="sect-deposit-row">`;
        html += `<span class="sect-hint">You carry: ${G.stones || 0}💎</span>`;
        (SECT_BUILDING_ACTIONS?.vaultDepositPresets || [10, 25, 50]).forEach(amt => {
            html += `<button type="button" class="sect-deposit-btn" data-vault-deposit="${amt}" ${(G.stones || 0) < amt ? 'disabled' : ''}>${amt}💎</button>`;
        });
        html += `<button type="button" class="sect-deposit-btn" data-vault-deposit="all" ${!(G.stones > 0) ? 'disabled' : ''}>All</button>`;
        html += `</div>`;
    }

    if (buildingId === 'training_ground') {
        const pct = typeof getSectBuildingBonus === 'function' ? getSectBuildingBonus('combatXpPct') : 0;
        const months = SECT_BUILDING_ACTIONS?.trainingSparMonths || 2;
        html += `<div class="sect-section-title">⚔️ Spar</div>`;
        html += `<p class="sect-hint">Drill with your disciples. Wins technique mastery (+${pct}% training bonus).</p>`;
        html += `<button type="button" class="sect-action-btn" id="btnTrainingSpar">⚔️ Spar (${months} months)</button>`;
    }

    if (buildingId === 'cultivation_hall') {
        html += `<div class="sect-section-title">🧘 Sect Cultivation</div>`;
        html += `<p class="sect-hint">Cultivate within the hall — disciple training expands in a future update.</p>`;
        html += renderSectCultivationBreakdownHtml();
        html += `<button type="button" class="sect-action-btn" id="btnHallCultivate">🧘 Cultivate here (${ACTION_MONTHS.cultivate} months)</button>`;
    }

    if (buildingId === 'disciple_hall') {
        const assignSlots = typeof getSectBuildingBonus === 'function' ? getSectBuildingBonus('discipleAssignSlots') : lv;
        const studySlots = typeof getManualStudySlots === 'function' ? getManualStudySlots() : 0;
        html += `<div class="sect-section-title">📿 Assignments</div>`;
        html += `<p class="sect-hint">Construction crew slots: <strong>${assignSlots}</strong>. Manual study uses the <strong>Manual Hall</strong> (${studySlots} slot${studySlots !== 1 ? 's' : ''}).</p>`;
    }

    if (buildingId === 'manual_hall') {
        html += typeof renderManualHallPanelHtml === 'function' ? renderManualHallPanelHtml() : '';
    }

    html += `</div>`;
    return html;
}

function renderConstructionChoicesHtml(targetId, targetLevel, cost) {
    const months = cost.months || ACTION_MONTHS.sectBuild;
    const canPersonal = months <= SECT_CONSTRUCTION.personalCapMonths;
    const block = typeof getConstructionBlockReason === 'function'
        ? getConstructionBlockReason(targetId, targetLevel, cost)
        : null;
    const active = G.sect?.construction;
    const busy = active && !block;

    let html = `<div class="sect-construction-block">`;
    html += `<div class="sect-section-title">🏗️ Upgrade to Level ${targetLevel}</div>`;
    html += `<div class="sect-building-cost">${typeof formatConstructionCost === 'function' ? formatConstructionCost(cost) : ''} · ${months} months</div>`;

    if (busy) {
        html += `<p class="sect-hint">Another project is already underway.</p>`;
    } else if (block) {
        html += `<p class="sect-hint sect-construction-blocked">${escapeSectAttr(block)}</p>`;
    } else {
        if (canPersonal) {
            html += `<button type="button" class="sect-action-btn sect-build-btn" data-build-target="${targetId}" data-build-level="${targetLevel}" data-build-mode="personal">
                👷 Oversee personally — ${months}mo lifespan · materials only
            </button>`;
        } else {
            html += `<p class="sect-hint">Too large to oversee alone (${months}mo). Hire craftsmen to build in the background.</p>`;
        }
        const stoneCost = cost.stones || 0;
        html += `<button type="button" class="sect-action-btn sect-build-btn" data-build-target="${targetId}" data-build-level="${targetLevel}" data-build-mode="contractors">
            🏗️ Hire craftsmen — ${months}mo background${stoneCost ? ` · ${stoneCost}💎` : ''} + materials
        </button>`;
    }
    html += `</div>`;
    return html;
}

function bindSectGroundsEvents(container) {
    if (!container) return;
    container.querySelectorAll('[data-sect-view]').forEach(el => {
        el.addEventListener('click', function() {
            setSectGroundsView(this.dataset.sectView);
            if (typeof renderSectPopup === 'function') renderSectPopup();
        });
    });
    container.querySelector('#btnHarvestGarden')?.addEventListener('click', () => {
        const result = typeof collectSpiritGardenHerbs === 'function' ? collectSpiritGardenHerbs() : { success: false };
        if (result.message) addLog(result.success ? `🌸 ${result.message}` : `🌸 ${result.message}`);
        if (typeof renderSectPopup === 'function') renderSectPopup();
        fullRender();
    });
    container.querySelector('#btnCollectTithe')?.addEventListener('click', () => {
        const result = typeof collectTreasuryTithe === 'function' ? collectTreasuryTithe() : { success: false };
        if (result.message) addLog(result.success ? `💰 ${result.message}` : `💰 ${result.message}`);
        if (typeof renderSectPopup === 'function') renderSectPopup();
        fullRender();
    });
    container.querySelectorAll('[data-vault-deposit]').forEach(btn => {
        btn.addEventListener('click', function() {
            const raw = this.dataset.vaultDeposit;
            const amount = raw === 'all' ? (G.stones || 0) : parseInt(raw, 10);
            const result = typeof depositVaultStones === 'function' ? depositVaultStones(amount) : { success: false };
            if (result.message) addLog(result.success ? `🏛️ ${result.message}` : `🏛️ ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelector('#btnTrainingSpar')?.addEventListener('click', () => {
        const result = typeof actionTrainingGroundSpar === 'function' ? actionTrainingGroundSpar() : { success: false };
        if (result.message) addLog(result.success ? `⚔️ ${result.message}` : `⚔️ ${result.message}`);
        if (typeof renderSectPopup === 'function') renderSectPopup();
        fullRender();
    });
    container.querySelector('#btnHallCultivate')?.addEventListener('click', () => {
        if (typeof actionCultivationHallCultivate === 'function') actionCultivationHallCultivate();
    });
    container.querySelector('#btnResidenceCultivate')?.addEventListener('click', () => {
        document.getElementById('sectPopup')?.classList.remove('active');
        if (typeof actionResidenceCultivate === 'function') actionResidenceCultivate();
    });
    container.querySelectorAll('[data-formation-lay]').forEach(btn => {
        btn.addEventListener('click', function() {
            const slot = parseInt(this.dataset.formationSlot, 10);
            const formationId = this.dataset.formationLay;
            const result = typeof layResidenceFormation === 'function'
                ? layResidenceFormation(slot, formationId)
                : { success: false, message: 'Formations unavailable.' };
            if (result.message) addLog(result.success ? `☯️ ${result.message}` : `☯️ ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-formation-clear]').forEach(btn => {
        btn.addEventListener('click', function() {
            const slot = parseInt(this.dataset.formationClear, 10);
            const result = typeof clearResidenceFormationSlot === 'function'
                ? clearResidenceFormationSlot(slot)
                : { success: false, message: 'Formations unavailable.' };
            if (result.message) addLog(result.success ? `☯️ ${result.message}` : `☯️ ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('.sect-build-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = typeof startSectConstruction === 'function'
                ? startSectConstruction(this.dataset.buildTarget, parseInt(this.dataset.buildLevel, 10), this.dataset.buildMode)
                : { success: false, message: 'Construction unavailable.' };
            if (result.message) addLog(result.success ? `🏗️ ${result.message}` : `🏗️ ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('.sect-inventory-withdraw').forEach(btn => {
        btn.addEventListener('click', function() {
            let result;
            if (this.dataset.withdrawStones) {
                const n = parseInt(this.dataset.withdrawStones, 10);
                const taken = typeof withdrawSectInventoryStones === 'function' ? withdrawSectInventoryStones(n) : 0;
                result = { success: taken > 0, message: taken > 0 ? `Withdrew ${taken} stones.` : 'Nothing to withdraw.' };
            } else if (this.dataset.withdrawMat) {
                const taken = typeof withdrawSectInventoryMaterial === 'function'
                    ? withdrawSectInventoryMaterial(this.dataset.withdrawMat, parseInt(this.dataset.withdrawQty, 10))
                    : 0;
                const mat = CRAFT_MATERIALS[this.dataset.withdrawMat];
                result = { success: taken > 0, message: taken > 0 ? `Withdrew ${taken}× ${mat?.name || this.dataset.withdrawMat}.` : 'Nothing to withdraw.' };
            }
            if (result?.message) addLog(result.success ? `📦 ${result.message}` : `📦 ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-deposit-hall]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = typeof depositManualToHall === 'function'
                ? depositManualToHall(this.dataset.depositHall, 1)
                : { success: false, message: 'Manual Hall unavailable.' };
            if (result.message) addLog(result.success ? `📜 ${result.message}` : `📜 ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-withdraw-hall]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = typeof withdrawManualFromHall === 'function'
                ? withdrawManualFromHall(this.dataset.withdrawHall, 1)
                : { success: false, message: 'Manual Hall unavailable.' };
            if (result.message) addLog(result.success ? `📜 ${result.message}` : `📜 ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-cancel-study]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = typeof cancelDiscipleStudy === 'function'
                ? cancelDiscipleStudy(this.dataset.cancelStudy)
                : { success: false, message: 'Manual Hall unavailable.' };
            if (result.message) addLog(result.success ? `📜 ${result.message}` : `📜 ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelector('#btnAssignStudy')?.addEventListener('click', () => {
        const discipleUid = container.querySelector('#manualHallDiscipleSelect')?.value;
        const techName = container.querySelector('#manualHallTechSelect')?.value;
        const result = typeof assignDiscipleStudy === 'function'
            ? assignDiscipleStudy(discipleUid, techName)
            : { success: false, message: 'Manual Hall unavailable.' };
        if (result.message) addLog(result.success ? `📜 ${result.message}` : `📜 ${result.message}`);
        if (typeof renderSectPopup === 'function') renderSectPopup();
        fullRender();
    });
}
