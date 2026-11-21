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
        <div class="sect-stat sect-stat-clickable" data-sect-view="residence" title="Open your quarters — formations live here">
            <span class="label">Quarters</span><span class="value">${SECT_RESIDENCE.emoji} ${getResidenceDef().name}</span>
        </div>
        <div class="sect-stat sect-stat-clickable" data-sect-view="inventory" title="Open sect stores">
            <span class="label">Stores</span><span class="value">📦 ${invUsed}/${invCap}</span>
        </div>
    </div>`;
    const foundedNear = typeof getSectFoundedNearLabel === 'function' ? getSectFoundedNearLabel() : null;
    if (foundedNear) {
        html += `<div class="sect-founded-banner">📍 Founded near <strong>${foundedNear}</strong></div>`;
    }
    if (infLabel) {
        html += `<div class="sect-influence-banner">🌏 Influence: <strong>${infLabel}</strong></div>`;
    }
    if (typeof getSectDoctrineAlignmentSynergy === 'function') {
        const synergy = getSectDoctrineAlignmentSynergy();
        if (synergy?.label) {
            html += `<div class="sect-alignment-synergy-banner">☯️ ${synergy.label}</div>`;
        }
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
    html += `<p class="sect-hint sect-map-hint">Tap a building to visit it. Formations are at <strong>Leader's Quarters</strong> (not the Courtyard hub). Courtyard is disciples and sect affairs.</p>`;
    return html;
}

function renderSectPoliciesHtml() {
    const policies = ensureSectPolicies();
    return `<div class="sect-section-title">Sect Policies</div>` +
        Object.entries(SECT_POLICY_OPTIONS).map(([key, policy]) => `
            <div class="sect-action-block">
                <label>${policy.label}
                    <select class="manual-hall-select" data-sect-policy="${key}">
                        ${Object.entries(policy.choices).map(([value, label]) =>
                            `<option value="${value}"${policies[key] === value ? ' selected' : ''}>${label}</option>`
                        ).join('')}
                    </select>
                </label>
                <p class="sect-hint">${policy.hint}</p>
            </div>`
        ).join('');
}

function renderOtherSectAffiliationsHtml() {
    const affiliates = getActiveSectAffiliations().filter(member => !isRankedSectMember(member));
    if (!affiliates.length) return '';
    return `<div class="sect-section-title">Other Affiliates</div><div class="sect-disciple-list">` +
        affiliates.map(member => {
            const npc = getWorldNpcByUid(member.uid);
            if (!npc) return '';
            if (member.affiliation === 'full') {
                return `<div class="sect-disciple-row"><div class="sect-disciple-info">
                    <span class="name">${escapeSectAttr(npc.name)}</span>
                    <span class="role">${isFullSectElder(member) ? 'Full-member elder' : 'Full member'} · ${SECT_MEMBER_POSITIONS[member.position]}</span>
                    ${renderSectMemberServiceHtml(member)}
                </div></div>`;
            }
            const { service, compensationStones, endsAtMonths } = member.agreement;
            const duration = endsAtMonths == null ? 'Open-ended' : `${formatDuration(endsAtMonths - G.ageMonths)} remaining`;
            return `<div class="sect-disciple-row"><div class="sect-disciple-info">
                <span class="name">${escapeSectAttr(npc.name)}</span>
                <span class="role">Guest Elder · ${escapeSectAttr(service)}</span>
                <span class="role">${compensationStones} Spirit Stones agreed · ${duration}</span>
            </div></div>`;
        }).join('') + '</div>';
}

function renderSectMemberServiceHtml(member) {
    return `<span class="role">${member.lifetimeContribution} lifetime contributions · ${member.meritBalance} merit available</span>
        ${member.duties.length ? `<span class="role">Duties · ${escapeSectAttr(member.duties.join(', '))}</span>` : ''}`;
}

function renderSectMissionsHtml() {
    const department = ensureSectMissionDepartment();
    const elder = getSectMissionElder();
    const hq = getSectMissionHeadquarters();
    const options = (choices, selected) => Object.entries(choices).map(([value, label]) =>
        `<option value="${value}" ${value === selected ? 'selected' : ''}>${label}</option>`
    ).join('');
    let html = `<div class="sect-section-title">Sect Assignments</div>
        <p class="sect-hint">One active assignment. Gathering uses stocked herb sites at headquarters or one road away. Patrols take two months.</p>`;
    if (hq) {
        html += `<p class="sect-hint">Patrol readiness requires Qi or Body at tier ${getSectPatrolRequirement(hq) + 1}.</p>`;
    }
    if (elder) {
        html += `<div class="sect-disciple-row"><span>Mission Elder · ${escapeSectAttr(elder.name)}</span>
            <button type="button" class="sect-action-btn" data-mission-action="dismiss">Dismiss</button></div>`;
    } else {
        html += '<p class="sect-hint">Appoint a full-member elder to unlock supervision and delegation.</p>';
        getActiveSectAffiliations().filter(isFullSectElder).forEach(member => {
            const npc = getWorldNpcByUid(member.uid);
            if (npc) html += `<button type="button" class="sect-action-btn" data-mission-action="appoint"
                data-mission-uid="${escapeSectAttr(member.uid)}">Appoint ${escapeSectAttr(npc.name)}</button>`;
        });
    }

    html += `<div class="sect-action-block"><label>Management
        <select class="manual-hall-select" data-mission-setting="mode">${options({
            direct: 'Direct', ...(elder ? { supervised: 'Supervised', delegated: 'Delegated' } : {})
        }, department.mode)}</select></label></div>`;
    if (elder && department.mode !== 'direct') {
        html += `<div class="sect-action-block">
            <label>Routine priority <select class="manual-hall-select" data-mission-setting="priority">${options({
                gather: 'Gathering first', patrol: 'Patrol first'
            }, department.priority)}</select></label>
            <label>Safety <select class="manual-hall-select" data-mission-setting="safety">${options({
                routine: 'Routine local work', gathering_only: 'Gathering only'
            }, department.safety)}</select></label>
        </div>`;
    }

    if (department.proposal) {
        const { npcUid, type } = department.proposal;
        const name = getWorldNpcByUid(npcUid)?.name || 'Unavailable disciple';
        html += `<div class="sect-action-block"><p>Proposal · ${escapeSectAttr(name)} · ${SECT_MISSION_TYPES[type].label}</p>
            <button type="button" class="sect-action-btn" data-mission-action="approve">Approve</button>
            <button type="button" class="sect-action-btn" data-mission-action="decline">Decline</button>
        </div>`;
    }

    const active = getActiveSectMissions();
    if (!active.length) {
        const plans = [];
        for (const member of getSectDiscipleMemberships()) {
            for (const [type, def] of Object.entries(SECT_MISSION_TYPES)) {
                const plan = planSectMission(member.uid, type);
                if (!plan.npc) continue;
                plans.push(`<option value="${escapeSectAttr(member.uid)}" data-mission-type="${type}">
                    ${escapeSectAttr(plan.npc.name)} · ${def.label} · ${escapeSectAttr(plan.destination.name)}
                </option>`);
            }
        }
        if (plans.length) html += `<div class="sect-action-block"><label>Direct assignment
            <select class="manual-hall-select" id="sectMissionPlan">${plans.join('')}</select></label>
            <button type="button" class="sect-action-btn" data-mission-action="assign">Assign</button></div>`;
        else html += '<p class="sect-hint">Assignments require an available disciple at headquarters and a reachable work site.</p>';
    }
    const history = department.missions.filter(mission => mission.status !== 'active').slice(-6).reverse();
    for (const mission of [...active, ...history]) {
        const name = getWorldNpcByUid(mission.npcUid)?.name || mission.npcName;
        const location = getLocationDef(mission.destinationId)?.name || mission.destinationId;
        const detail = mission.status === 'active'
            ? `${mission.phase === 'work' ? 'Working' : mission.phase === 'outbound' ? 'Travelling' : 'Returning'} · ${formatDuration(Math.max(0, mission.expectedAtMonths - G.ageMonths))} remaining`
            : `${mission.status === 'completed' ? 'Completed' : 'Failed'} · ${mission.outcome}`;
        html += `<div class="sect-disciple-row"><div class="sect-disciple-info">
            <span class="name">${escapeSectAttr(name)} · ${SECT_MISSION_TYPES[mission.type].label}</span>
            <span class="role">${escapeSectAttr(location)} · ${escapeSectAttr(detail)}</span>
        </div></div>`;
    }
    return html;
}

function bindSectMissionPanelEvents(container) {
    const refresh = () => {
        saveState();
        if (typeof renderSectPopup === 'function') renderSectPopup();
    };
    container.querySelectorAll('[data-mission-setting]').forEach(select => {
        select.addEventListener('change', () => {
            const mode = select.dataset.missionSetting === 'mode';
            const changed = mode ? setSectMissionMode(select.value) : setSectMissionPriorities(
                container.querySelector('[data-mission-setting="priority"]').value,
                container.querySelector('[data-mission-setting="safety"]').value
            );
            if (changed) refresh();
        });
    });
    const actions = {
        appoint: button => appointSectMissionElder(button.dataset.missionUid),
        dismiss: () => dismissSectMissionElder(),
        approve: () => decideSectMissionProposal(true),
        decline: () => decideSectMissionProposal(false),
        assign: () => {
            const option = container.querySelector('#sectMissionPlan')?.selectedOptions[0];
            return option && assignSectMission(option.value, option.dataset.missionType);
        }
    };
    container.querySelectorAll('[data-mission-action]').forEach(button => {
        button.addEventListener('click', () => {
            const result = actions[button.dataset.missionAction]?.(button);
            if (result?.message && (!result.success || button.dataset.missionAction === 'decline')) addLog(result.message);
            refresh();
        });
    });
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
    html += `<p class="sect-hint">The heart of ${G.sect.name || 'your sect'} — roster, advancement, and affairs. Formations are inscribed at your quarters, not here.</p>`;
    html += `<button type="button" class="sect-action-btn" data-sect-view="residence">${SECT_RESIDENCE.emoji} Open Leader's Quarters</button>`;

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
        html += `<div class="sect-section-title">📿 Disciples</div>
            <p class="sect-hint">${escapeSectAttr(describeSectGraduationRule())}</p><div class="sect-disciple-list">`;
        getSectDiscipleMemberships().forEach(d => {
            const npc = getDiscipleNpc(d);
            if (!npc) return;
            const role = DISCIPLE_ROLES[d.rank] || DISCIPLE_ROLES.acolyte;
            const traitDef = typeof getDiscipleTraitDef === 'function' ? getDiscipleTraitDef(npc.sectTemperament) : null;
            const traitTip = traitDef
                ? escapeSectAttr(`${traitDef.desc}${traitDef.effectDesc ? ' — ' + traitDef.effectDesc : ''}`)
                : '';
            const served = Math.floor(getDiscipleMonthsServed(d) / 12);
            const promoteBlock = getPromoteBlockReason(d.uid);
            const canPromote = !promoteBlock && role.promoteReq;
            const graduationBlock = getSectGraduationBlockReason(d.uid);
            html += `<div class="sect-disciple-row">
                <div class="sect-disciple-info">
                    <span class="name">${role.emoji} ${escapeSectAttr(npc.name)}${traitDef ? ` <span class="sect-trait-tag" title="${traitTip}">${traitDef.emoji} ${traitDef.label}</span>` : ''}</span>
                    <span class="role">${role.label}${d.position === 'disciple' ? '' : ' · ' + SECT_MEMBER_POSITIONS[d.position]} · ${served}y service</span>
                    ${renderSectMemberServiceHtml(d)}
                </div>
                ${canPromote
                    ? `<button type="button" class="sect-promote-btn" data-promote-disc="${escapeSectAttr(d.uid)}">↑ Promote</button>`
                    : ''}
                <button type="button" class="sect-action-btn" data-graduate-disciple="${escapeSectAttr(d.uid)}"
                    ${graduationBlock ? `disabled title="${escapeSectAttr(graduationBlock)}"` : ''}>Graduate as Elder</button>
                ${graduationBlock ? `<span class="role">${escapeSectAttr(graduationBlock)}</span>` : ''}
            </div>`;
        });
        html += `</div>`;
    } else {
        html += `<p class="sect-hint">No disciples yet. Recruit from the main action bar once your fame spreads.</p>`;
    }

    html += renderOtherSectAffiliationsHtml();
    html += renderSectMissionsHtml();
    html += renderSectPoliciesHtml();

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
    html += `<p class="sect-hint">Your personal rooms on the grounds. The formation shelf, Decipher, and courtyard slots live on this page. Upgrade to <strong>Inner Court Room</strong> (residence lv 1) for the first slot and the unread Spirit Gathering manual.</p>`;
    if (typeof renderResidenceFormationsHtml === 'function') {
        html += renderResidenceFormationsHtml();
    }
    if (typeof renderResidenceStashPanelHtml === 'function') {
        html += renderResidenceStashPanelHtml();
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
        const titheRate = typeof getTreasuryTithePerCultivate === 'function' ? getTreasuryTithePerCultivate() : 0;
        const bonus = typeof getSectBuildingBonus === 'function' ? getSectBuildingBonus('passiveIncomePct') : 0;
        html += `<div class="sect-section-title">💰 Tithe Chest</div>`;
        html += `<p class="sect-hint">Disciple offerings accumulate when you cultivate (+${bonus}% treasury bonus). Collect stones into sect stores.</p>`;
        html += `<div class="sect-harvest-display">Ready: <strong>${pending}</strong>💎 · Rate: ${titheRate}/cultivate</div>`;
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

    if (buildingId === 'armory') {
        const forgePct = typeof getArmoryForgeMonthsPct === 'function' ? getArmoryForgeMonthsPct() : 0;
        const affixPct = typeof getSectBuildingBonus === 'function' ? (getSectBuildingBonus('armoryForgeAffixPct') || 0) : 0;
        const combatPct = typeof getSectBuildingBonus === 'function' ? (getSectBuildingBonus('armoryCombatPct') || 0) : 0;
        html += `<div class="sect-section-title">🔨 Forge</div>`;
        html += `<p class="sect-hint">Armory bonuses: −${forgePct}% forge time, +${affixPct}% affix quality, +${combatPct}% sect combat.</p>`;
        html += `<button type="button" class="sect-action-btn" id="btnArmoryForge">🔨 Open Forge Chamber</button>`;
    }

    if (buildingId === 'meditation_chamber' || buildingId === 'defense_array') {
        if (typeof renderSectAnchorFormationsHtml === 'function') {
            html += renderSectAnchorFormationsHtml(buildingId);
        }
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
    bindSectMissionPanelEvents(container);
    container.querySelectorAll('[data-graduate-disciple]').forEach(button => {
        button.addEventListener('click', () => {
            const result = graduateSectDisciple(button.dataset.graduateDisciple);
            addLog(result.message);
            saveState();
            if (typeof renderSectPopup === 'function') renderSectPopup();
        });
    });
    container.querySelectorAll('[data-sect-policy]').forEach(select => {
        select.addEventListener('change', function() {
            if (!setSectPolicy(this.dataset.sectPolicy, this.value)) return;
            saveState();
            if (typeof renderSectPopup === 'function') renderSectPopup();
        });
    });
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
        document.getElementById('mapPopup')?.classList.remove('active');
        if (typeof actionResidenceCultivate === 'function') actionResidenceCultivate();
    });
    container.querySelector('#btnArmoryForge')?.addEventListener('click', () => {
        document.getElementById('sectPopup')?.classList.remove('active');
        document.getElementById('mapPopup')?.classList.remove('active');
        if (typeof openForgeChamber === 'function') openForgeChamber({ atSect: true });
    });
    container.querySelectorAll('[data-formation-lay]').forEach(btn => {
        btn.addEventListener('click', function() {
            const slot = parseInt(this.dataset.formationSlot, 10);
            const formationId = this.dataset.formationLay;
            const anchorId = this.dataset.anchorId;
            const result = anchorId && typeof laySectAnchorFormation === 'function'
                ? laySectAnchorFormation(anchorId, slot, formationId)
                : (typeof layResidenceFormation === 'function'
                    ? layResidenceFormation(slot, formationId)
                    : { success: false, message: 'Formations unavailable.' });
            if (result.message) addLog(result.success ? `☯️ ${result.message}` : `☯️ ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-formation-clear]').forEach(btn => {
        btn.addEventListener('click', function() {
            const slot = parseInt(this.dataset.formationClear, 10);
            const anchorId = this.dataset.anchorId;
            const result = anchorId && typeof clearSectAnchorFormationSlot === 'function'
                ? clearSectAnchorFormationSlot(anchorId, slot)
                : (typeof clearResidenceFormationSlot === 'function'
                    ? clearResidenceFormationSlot(slot)
                    : { success: false, message: 'Formations unavailable.' });
            if (result.message) addLog(result.success ? `☯️ ${result.message}` : `☯️ ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-formation-toggle]').forEach(btn => {
        btn.addEventListener('click', function() {
            const slot = parseInt(this.dataset.formationToggle, 10);
            const anchorId = this.dataset.anchorId;
            const result = anchorId && typeof toggleSectAnchorFormationActive === 'function'
                ? toggleSectAnchorFormationActive(anchorId, slot)
                : (typeof toggleResidenceFormationActive === 'function'
                    ? toggleResidenceFormationActive(slot)
                    : { success: false, message: 'Formations unavailable.' });
            if (result.message) addLog(result.success ? `☯️ ${result.message}` : `☯️ ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-formation-fuel]').forEach(btn => {
        btn.addEventListener('click', function() {
            const slot = parseInt(this.dataset.formationFuel, 10);
            const units = parseInt(this.dataset.fuelUnits, 10);
            const anchorId = this.dataset.anchorId;
            const result = anchorId && typeof addSectAnchorFormationFuel === 'function'
                ? addSectAnchorFormationFuel(anchorId, slot, units)
                : (typeof addResidenceFormationFuel === 'function'
                    ? addResidenceFormationFuel(slot, units)
                    : { success: false, message: 'Formations unavailable.' });
            if (result.message) addLog(result.success ? `☯️ ${result.message}` : `☯️ ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-formation-maintain]').forEach(btn => {
        btn.addEventListener('click', function() {
            const slot = parseInt(this.dataset.formationMaintain, 10);
            const anchorId = this.dataset.anchorId;
            const result = anchorId && typeof maintainSectAnchorFormation === 'function'
                ? maintainSectAnchorFormation(anchorId, slot)
                : (typeof maintainResidenceFormation === 'function'
                    ? maintainResidenceFormation(slot)
                    : { success: false, message: 'Formations unavailable.' });
            if (result.message) addLog(result.success ? `☯️ ${result.message}` : `☯️ ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-formation-decipher]').forEach(btn => {
        btn.addEventListener('click', function() {
            const formationId = this.dataset.formationDecipher;
            const result = typeof decipherFormation === 'function'
                ? decipherFormation(formationId)
                : { success: false, message: 'Formations unavailable.' };
            if (result.message) addLog(result.success ? `📜 ${result.message}` : `📜 ${result.message}`);
            if (typeof renderSectPopup === 'function') renderSectPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-formation-exam]').forEach(btn => {
        btn.addEventListener('click', function() {
            const toTier = parseInt(this.dataset.formationExam, 10);
            const result = typeof attemptFormationMasterExam === 'function'
                ? attemptFormationMasterExam(toTier)
                : { success: false, message: 'Exams unavailable.' };
            if (result.message) addLog(result.success ? `🎓 ${result.message}` : `🎓 ${result.message}`);
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
    if (typeof bindResidenceStashEvents === 'function') bindResidenceStashEvents(container);
}
