// ============================================
// UI.JS — Rendering, popups, display updates
// ============================================

function renderStatus() {
    const realm = getRealm();
    const title = getTitle();
    const fameLevel = getFameLevel();
    const openCount = getMeridianOpenCount();
    document.getElementById('realmDisplay').textContent = realm + (G.perfectCultivation ? ' 🌟' : '');
    document.getElementById('titleDisplay').textContent = '— ' + title;
    const ageEl = document.getElementById('ageDisplay');
    ageEl.textContent = formatYears(G.ageMonths);
    const lifeEl = document.getElementById('lifespanDisplay');
    const lifeBanner = document.getElementById('lifespanBanner');
    const lifeBannerText = document.getElementById('lifespanBannerText');
    if (isImmortal()) {
        lifeEl.textContent = 'Immortal';
        lifeEl.className = 'immortal';
        if (lifeBanner) lifeBanner.className = 'lifespan-banner immortal';
        if (lifeBannerText) lifeBannerText.textContent = 'Immortal — no mortal limit';
    } else {
        const remaining = getYearsRemaining();
        lifeEl.textContent = `${formatYears(G.lifespanMonths)} (${remaining} left)`;
        lifeEl.className = remaining <= 10 ? 'lifespan-critical' : remaining <= 25 ? 'lifespan-low' : '';
        if (lifeBanner) {
            lifeBanner.className = 'lifespan-banner'
                + (remaining <= 10 ? ' lifespan-critical' : remaining <= 25 ? ' lifespan-low' : '');
        }
        if (lifeBannerText) {
            lifeBannerText.textContent = remaining <= 10
                ? `⚠️ ${remaining} years left — cultivate or perish!`
                : `${formatYears(G.lifespanMonths)} total · ${remaining} years remaining`;
        }
    }
    document.getElementById('fameDisplay').textContent = G.fame + ' (' + fameLevel.title + ')';
    const alignEl = document.getElementById('daoAlignmentDisplay');
    const alignStatEl = document.getElementById('daoAlignmentStat');
    if (typeof formatDaoAlignmentDisplay === 'function') {
        const alignText = formatDaoAlignmentDisplay();
        const tierClass = typeof getDaoAlignmentTierClass === 'function' ? getDaoAlignmentTierClass() : '';
        if (alignEl) {
            alignEl.textContent = alignText;
            alignEl.className = tierClass;
        }
        if (alignStatEl) {
            alignStatEl.textContent = alignText;
            alignStatEl.className = 'value ' + tierClass;
        }
    }
    document.getElementById('sectNameDisplay').textContent = typeof getSectDisplayName === 'function'
        ? getSectDisplayName() : (G.sectName || 'None');
    const traitDef = typeof getPlayerTraitDef === 'function' ? getPlayerTraitDef() : G.trait;
    const traitLabel = traitDef ? `${traitDef.emoji || '🎭'} ${traitDef.name}` : '—';
    const traitTip = traitDef ? `${traitDef.flavor || traitDef.desc}\n${traitDef.upside || ''}\n${traitDef.downside || ''}` : '';
    const traitDisplay = document.getElementById('traitDisplay');
    if (traitDisplay) {
        traitDisplay.textContent = traitLabel;
        traitDisplay.title = traitTip;
    }
    const traitStat = document.getElementById('traitStatDisplay');
    if (traitStat) {
        traitStat.textContent = traitLabel;
        traitStat.title = traitTip;
    }
    document.getElementById('currentZoneStatus').textContent = (() => {
        if (typeof getPlaceDisplayLabel === 'function') return getPlaceDisplayLabel();
        const def = typeof getDisplayZoneDef === 'function' ? getDisplayZoneDef()
            : ZONES[typeof getActiveZoneId === 'function' ? getActiveZoneId() : currentZone];
        return def ? `${def.emoji} ${def.name}` : 'Unknown';
    })();
    document.getElementById('qiStat').textContent = G.qi + '/' + getMaxQi() + (G.qiExhausted ? ' ⚠️' : '');
    const densEl = document.getElementById('qiDensityStat');
    if (densEl) densEl.textContent = getQiDensity().toFixed(2);
    document.getElementById('vitStat').textContent = G.vitality;
    document.getElementById('spiStat').textContent = G.spirit;
    document.getElementById('wilStat').textContent = G.will;
    document.getElementById('hpStat').textContent = G.hp + '/' + (typeof getEffectiveMaxHp === 'function' ? getEffectiveMaxHp() : G.maxHp);
    document.getElementById('shieldStat').textContent = G.shield + '/' + G.maxShield;
    document.getElementById('stonesStat').textContent = G.stones;
    document.getElementById('pillsStat').textContent = getTotalPills();
    document.getElementById('techCountStat').textContent = G.techniques.length;
    document.getElementById('nextRealm').textContent = getNextRealm();
    document.getElementById('breakChance').textContent = Math.round(getBreakChance()) + '%';
    document.getElementById('foundationDisplay').textContent = G.foundation;
    const consolEl = document.getElementById('consolidationDisplay');
    if (consolEl && typeof getConsolidationStatusLabel === 'function') {
        consolEl.textContent = getConsolidationStatusLabel();
    }
    if (typeof getConsolidationProgressSummary === 'function') {
        const prog = getConsolidationProgressSummary();
        const meter = document.getElementById('consolidationMeter');
        const fill = document.getElementById('consolidationMeterFill');
        const label = document.getElementById('consolidationMeterLabel');
        const hint = document.getElementById('consolidationMeterHint');
        const meterTitle = document.getElementById('consolidationMeterTitle');
        if (meterTitle && typeof getPathCapstone === 'function') {
            meterTitle.textContent = getPathCapstone().meterLabel || 'Realm Progress';
        }
        if (meter) {
            meter.classList.toggle('hidden', !getConsolidationDef(G.realmIdx) && !prog.consolidated);
            meter.classList.toggle('ready', !!prog.ready && !prog.consolidated);
            meter.classList.toggle('consolidated', !!prog.consolidated);
            meter.classList.toggle('at-settled', !prog.consolidated && prog.pct >= (typeof REALM_PROGRESS_TIERS !== 'undefined' ? REALM_PROGRESS_TIERS.settledPct : 80));
            meter.classList.toggle('at-peak', !prog.consolidated && prog.pct >= (typeof REALM_PROGRESS_TIERS !== 'undefined' ? REALM_PROGRESS_TIERS.peakPct : 100));
        }
        if (fill) fill.style.width = `${prog.pct}%`;
        if (label) label.textContent = prog.label;
        if (hint) hint.textContent = prog.hint || '';
    }
    if (typeof STAT_GUIDE !== 'undefined') {
        const chipTips = {
            qiStat: STAT_GUIDE.qi,
            qiDensityStat: STAT_GUIDE.qiDensity,
            vitStat: STAT_GUIDE.vitality,
            spiStat: STAT_GUIDE.spirit,
            wilStat: STAT_GUIDE.will,
            hpStat: STAT_GUIDE.hp,
            shieldStat: STAT_GUIDE.shield
        };
        Object.entries(chipTips).forEach(([id, guide]) => {
            const el = document.getElementById(id);
            if (el && guide) {
                const chip = el.closest('.chip');
                if (chip) chip.title = `${guide.emoji} ${guide.label}: ${guide.desc}`;
            }
        });
    }
    const consolidateBtn = document.getElementById('btnConsolidate');
    if (consolidateBtn && typeof isRealmConsolidated === 'function') {
        consolidateBtn.disabled = isRealmConsolidated(G.realmIdx);
        const capstone = typeof getPathCapstone === 'function' ? getPathCapstone() : null;
        if (capstone) consolidateBtn.textContent = capstone.button;
        consolidateBtn.title = isRealmConsolidated(G.realmIdx)
            ? 'This realm is already sealed'
            : (capstone ? `${capstone.settledAction} at Settled (80%+) or ${capstone.peakAction} at Peak` : 'Seal realm for Foundation');
    }
    const cultivateBtn = document.getElementById('btnCultivate');
    if (cultivateBtn) {
        cultivateBtn.title = 'Choose Qi, Body, or Soul cultivation';
    }
    document.getElementById('discipleCountDisplay').textContent = G.disciples.length;
    document.getElementById('meridianDisplay').textContent = openCount + '/13';
    const tribCountEl = document.getElementById('tribulationCountDisplay');
    if (tribCountEl) tribCountEl.textContent = G.tribulationCount || 0;
    renderTribulationMarksPanel();
    renderTranscendencePerksPanel();
    const physEl = document.getElementById('physiqueDisplay');
    physEl.textContent = G.physique ? G.physique.name : 'None';
    const intentEl = document.getElementById('intentDisplay');
    const activeIntentUi = typeof getActiveIntent === 'function' ? getActiveIntent() : G.weaponIntent;
    if (intentEl) {
        if (activeIntentUi) {
            const tier = getIntentTier(activeIntentUi);
            const track = getIntentTrackForPath(G.path);
            intentEl.textContent = `${track.emoji} ${activeIntentUi.weapon} (${tier.name})`;
        } else {
            intentEl.textContent = 'None';
        }
    }
    const daoEl = document.getElementById('daoDisplay');
    const allDaos = [...G.trueDaos, ...G.mergedDaos];
    if (allDaos.length > 0) {
        daoEl.textContent = allDaos.slice(0, 2).join(', ');
    } else if (G.daoFragments.length > 0) {
        daoEl.textContent = `${G.daoFragments.length} fragments`;
    } else {
        daoEl.textContent = 'None';
    }
    document.getElementById('perfectDisplay').textContent = G.perfectCultivation ? '🌟 MYTHIC CULTIVATOR 🌟' : '';
    if (typeof renderSidebarGearStrip === 'function') renderSidebarGearStrip();
    renderScenePanel();
}

function renderSidebarGearStrip() {
    const el = document.getElementById('sidebarGearStrip');
    if (!el || typeof ensureGearState !== 'function') return;
    ensureGearState();
    const sets = typeof getActiveGearSetsDisplay === 'function' ? getActiveGearSetsDisplay() : [];
    const chips = GEAR_SLOT_IDS.map(slot => {
        const inst = typeof getEquippedInstance === 'function' ? getEquippedInstance(slot) : null;
        const def = inst ? getInstanceDef(inst) : null;
        const label = GEAR_SLOT_LABELS[slot]?.charAt(0) || slot.charAt(0).toUpperCase();
        const durPct = inst ? Math.round((inst.durability / Math.max(1, inst.maxDurability)) * 100) : 100;
        const durCls = durPct <= 20 ? ' gear-chip-worn' : '';
        if (!def) {
            return `<span class="gear-chip empty" title="${GEAR_SLOT_LABELS[slot] || slot}: empty">${label}</span>`;
        }
        return `<span class="gear-chip${durCls}" title="${GEAR_SLOT_LABELS[slot]}: ${formatInstanceName(inst)} (${durPct}%)">${def.emoji || label}</span>`;
    }).join('');
    const setLine = sets.length
        ? `<span class="gear-set-mini">${sets.map(s => `${s.setDef.emoji}${s.count}`).join(' ')}</span>`
        : '';
    el.innerHTML = chips + setLine;
}

function escapeAttr(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/</g, '&lt;');
}

function escapeHtml(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function renderTribulationMarksPanel() {
    const el = document.getElementById('tribulationMarksDisplay');
    if (!el) return;

    if (!G.tribulationMarks || G.tribulationMarks.length === 0) {
        el.innerHTML = '<span class="mark-none">None</span>';
        return;
    }

    el.innerHTML = G.tribulationMarks.map(m => {
        const tip = typeof getMarkTooltipText === 'function'
            ? getMarkTooltipText(m.id, m.kind)
            : m.name;
        const cls = m.kind === 'transcend' ? 'mark-chip mark-transcend' : 'mark-chip mark-scar';
        const icon = m.kind === 'transcend' ? '✨' : '🩸';
        return `<button type="button" class="${cls}" data-mark-id="${m.id}" data-mark-kind="${m.kind}" title="${escapeAttr(tip)}">${icon} ${m.name}</button>`;
    }).join('');

    el.querySelectorAll('.mark-chip').forEach(btn => {
        btn.addEventListener('click', () => openMarkDetailPopup(btn.dataset.markId, btn.dataset.markKind));
    });
}

function renderTranscendencePerksPanel() {
    const el = document.getElementById('transcendencePerksDisplay');
    if (!el) return;

    const perks = G.transcendencePerks || [];
    if (!perks.length) {
        el.innerHTML = '<span class="mark-none">None</span>';
        return;
    }

    el.innerHTML = perks.map(p => {
        const tip = typeof getTranscendencePerkTooltip === 'function'
            ? getTranscendencePerkTooltip(p.id)
            : p.name;
        return `<button type="button" class="mark-chip mark-transcend-perk" data-perk-id="${p.id}" title="${escapeAttr(tip)}">🌟 ${p.name}</button>`;
    }).join('');

    el.querySelectorAll('.mark-transcend-perk').forEach(btn => {
        btn.addEventListener('click', () => {
            if (typeof openTranscendencePerkDetail === 'function') {
                openTranscendencePerkDetail(btn.dataset.perkId);
            }
        });
    });
}

function openMarkDetailPopup(markId, kind) {
    const def = typeof getTribulationMarkDef === 'function' ? getTribulationMarkDef(markId) : null;
    if (!def) return;

    const isTranscend = kind === 'transcend';
    document.getElementById('markDetailTitle').textContent =
        `${isTranscend ? '✨' : '🩸'} ${def.name}`;
    document.getElementById('markDetailKind').textContent =
        isTranscend ? 'Permanent Transcendence' : 'Permanent Scar';
    document.getElementById('markDetailFlavor').textContent = def.desc || '';

    let effectsHtml = '';
    if (isTranscend) {
        const ups = typeof formatTribulationEffects === 'function'
            ? formatTribulationEffects(def.bonus, 1)
            : [];
        if (ups.length) {
            effectsHtml += `<div class="mark-effect-block mark-effect-gift"><span class="mark-effect-label">Gift</span><span>${ups.join(' · ')}</span></div>`;
        }
    } else if (typeof formatScarEffectLabels === 'function') {
        const lines = formatScarEffectLabels(def);
        if (lines.some(l => l.startsWith('Cost:'))) {
            effectsHtml += `<div class="mark-effect-block mark-effect-cost"><span class="mark-effect-label">Cost</span><span>${lines.find(l => l.startsWith('Cost:')).replace('Cost: ', '')}</span></div>`;
        }
        if (lines.some(l => l.startsWith('Gift:'))) {
            effectsHtml += `<div class="mark-effect-block mark-effect-gift"><span class="mark-effect-label">Gift</span><span>${lines.find(l => l.startsWith('Gift:')).replace('Gift: ', '')}</span></div>`;
        }
    }
    if (!effectsHtml) {
        effectsHtml = '<div class="mark-effect-block"><span>Permanent cultivation mark.</span></div>';
    }
    document.getElementById('markDetailEffects').innerHTML = effectsHtml;
    document.getElementById('markDetailPopup').classList.add('active');
}

function renderTribulationCue() {
    const banner = document.getElementById('tribulationCueBanner');
    if (!banner) return;

    const cue = G.lastTribulationCue;
    if (!cue) {
        banner.classList.add('hidden');
        banner.innerHTML = '';
        return;
    }

    const typeClass = cue.type || 'default';
    let bodyHtml = '';
    if (cue.downs?.length || cue.ups?.length) {
        const parts = [];
        if (cue.flavor) parts.push(cue.flavor);
        if (cue.downs?.length) parts.push(`Cost: ${cue.downs.join(', ')}`);
        if (cue.ups?.length) parts.push(`Gift: ${cue.ups.join(', ')}`);
        bodyHtml = parts.join(' · ');
    } else {
        bodyHtml = cue.body || cue.flavor || '';
    }

    banner.className = `tribulation-cue cue-${typeClass}`;
    banner.innerHTML = `
        <div class="tribulation-cue-head">
            <span class="tribulation-cue-title">${cue.emoji || '⚡'} ${escapeHtml(cue.title || 'Tribulation')}</span>
            <button type="button" class="tribulation-cue-dismiss" id="tribulationCueDismiss" aria-label="Dismiss">✕</button>
        </div>
        <p class="tribulation-cue-body">${escapeHtml(bodyHtml)}</p>
        ${cue.markId ? `<button type="button" class="tribulation-cue-detail" data-mark-id="${cue.markId}" data-mark-kind="${cue.kind || 'scar'}">View mark details</button>` : ''}
    `;

    document.getElementById('tribulationCueDismiss')?.addEventListener('click', dismissTribulationCue);
    banner.querySelector('.tribulation-cue-detail')?.addEventListener('click', function() {
        openMarkDetailPopup(this.dataset.markId, this.dataset.markKind);
    });

    if (window._tribulationCueTimer) clearTimeout(window._tribulationCueTimer);
    window._tribulationCueTimer = setTimeout(dismissTribulationCue, 12000);
}

function dismissTribulationCue() {
    G.lastTribulationCue = null;
    const banner = document.getElementById('tribulationCueBanner');
    if (banner) {
        banner.classList.add('hidden');
        banner.innerHTML = '';
    }
    if (window._tribulationCueTimer) {
        clearTimeout(window._tribulationCueTimer);
        window._tribulationCueTimer = null;
    }
}

function renderScenePanel() {
    const zoneId = typeof getActiveZoneId === 'function' ? getActiveZoneId() : currentZone;
    const zone = typeof getDisplayZoneDef === 'function' ? getDisplayZoneDef() : ZONES[zoneId];
    const fameLevel = getFameLevel();
    const visions = PATHS[G.path].visions;
    const quote = visions[G.realmIdx % visions.length] || visions[0];

    renderCultivatorVisual();

    document.getElementById('sceneEmoji').textContent = locDef ? locDef.emoji : (zone ? zone.emoji : '🏔️');
    const locDef = typeof getCurrentLocationDef === 'function' ? getCurrentLocationDef() : null;
    document.getElementById('sceneZoneName').textContent = locDef ? locDef.name : (zone ? zone.name : 'Unknown');
    document.getElementById('sceneZoneBiome').textContent = locDef
        ? `${LOCATION_TYPE_LABELS[locDef.type] || locDef.type} · ${zone ? zone.biome : ''}`
        : (zone ? zone.biome : '');
    document.getElementById('sceneZoneDesc').textContent = locDef ? locDef.description : (zone ? zone.description : '');
    document.getElementById('sceneCultivator').textContent = G.name;
    const traitDef = typeof getPlayerTraitDef === 'function' ? getPlayerTraitDef() : G.trait;
    document.getElementById('scenePath').textContent = PATHS[G.path].name + (traitDef ? ' · ' + traitDef.name : '');
    document.getElementById('sceneBreakRealm').textContent = getNextRealm();
    const alignMod = typeof getDaoAlignmentBreakModifierLabel === 'function' ? getDaoAlignmentBreakModifierLabel() : '';
    document.getElementById('sceneBreakChance').textContent = Math.round(getBreakChance()) + '% chance' + (alignMod ? ' · ' + alignMod : '');
    document.getElementById('sceneSect').textContent = typeof getSectDisplayName === 'function'
        ? getSectDisplayName() : (G.sectName || 'None');
    document.getElementById('sceneDisciples').textContent = G.disciples.length + ' disciple' + (G.disciples.length === 1 ? '' : 's');
    const infEl = document.getElementById('sceneSectInfluence');
    if (infEl && typeof getSectInfluenceZone === 'function') {
        const zid = getSectInfluenceZone();
        if (zid && ZONES[zid]) {
            infEl.textContent = `Influence: ${ZONES[zid].emoji} ${ZONES[zid].name}`;
            infEl.style.display = '';
        } else {
            infEl.textContent = '';
            infEl.style.display = 'none';
        }
    }
    document.getElementById('sceneFoundation').textContent = G.foundation;
    const sceneFame = document.getElementById('sceneFame');
    if (sceneFame) {
        const consol = typeof getConsolidationStatusLabel === 'function' ? getConsolidationStatusLabel() : '';
        sceneFame.textContent = fameLevel.title + ' · ' + G.fame + ' fame' + (consol ? ' · ' + consol : '');
    }
    document.getElementById('sceneQuote').textContent = '"' + quote + '"';

    const factionEl = document.getElementById('sceneFaction');
    if (factionEl && typeof getFactionStatusLine === 'function') {
        const line = getFactionStatusLine();
        if (line) {
            factionEl.textContent = 'Factions: ' + line;
            factionEl.style.display = '';
        } else {
            factionEl.textContent = '';
            factionEl.style.display = 'none';
        }
    }

    const forbiddenEl = document.getElementById('sceneForbidden');
    if (forbiddenEl && typeof forbiddenDiscoveredCount === 'function') {
        ensureForbiddenState();
        forbiddenEl.textContent = forbiddenDiscoveredCount() + '/7 discovered · ' + forbiddenClearedCount() + '/7 cleared';
    }

    const npcCard = document.getElementById('sceneNpcCard');
    const npcEl = document.getElementById('sceneNpcs');
    if (npcCard && npcEl && typeof getNpcPresenceLabel === 'function') {
        const label = getNpcPresenceLabel(G.currentZone || currentZone);
        if (label) {
            npcCard.style.display = '';
            const wanderHint = typeof getWeiWanderHint === 'function' ? getWeiWanderHint() : '';
            npcEl.textContent = label + (wanderHint ? ` · ${wanderHint}` : '');
        } else {
            npcCard.style.display = 'none';
            npcEl.textContent = '—';
        }
    }

    const lastEl = document.getElementById('sceneLastEvent');
    if (lastEl) {
        lastEl.textContent = G.log.length > 0 ? G.log[0] : 'Your journey awaits...';
    }
}

function renderCultivatorVisual() {
    const container = document.getElementById('sceneVisual');
    if (!container) return;

    const path = G.path || 'qi';
    const realm = Math.min(6, Math.max(0, G.realmIdx || 0));
    const style = CULTIVATOR_VISUAL[path] || CULTIVATOR_VISUAL.qi;
    const fx = getCultivatorRealmEffects(path, realm, style);
    const pose = getCultivatorPose(path, realm, style);

    container.innerHTML =
        `<svg class="cultivator-silhouette path-${path} realm-${realm}" viewBox="0 0 120 140" xmlns="http://www.w3.org/2000/svg">` +
        fx.back + pose + fx.front +
        '</svg>';
}

function getCultivatorPose(path, realm, style) {
    const s = style.stroke;
    const f = style.fill;
    const hair = style.fill === '#181424' ? '#12101a' : '#1a1410';
    const sw = '1';
    const swHair = '0.8';

    function el(tag, attrs) {
        const parts = Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(' ');
        return `<${tag} ${parts}/>`;
    }

    function path(c, d, extra) {
        return `<path class="${c}" d="${d}" fill="${f}" stroke="${s}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"${extra || ''}/>`;
    }

    function strokePath(c, d, w) {
        return `<path class="${c}" d="${d}" fill="none" stroke="${s}" stroke-width="${w || sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
    }

    function buildQiFigure(lightShadow) {
        const shadowFill = lightShadow ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.32)';
        const shadowRx = lightShadow ? '20' : '24';
        return [
            el('ellipse', { class: 'silhouette-shadow', cx: '60', cy: '133', rx: shadowRx, ry: '3.5', fill: shadowFill }),
            path('sil-legs', 'M50 84 C44 92 42 102 46 110 C50 116 56 112 54 104 C52 96 50 88 50 84'),
            path('sil-legs', 'M70 84 C76 92 78 102 74 110 C70 116 64 112 66 104 C68 96 70 88 70 84'),
            path('sil-robe', 'M48 58 C46 68 44 78 46 86 C52 90 68 90 74 86 C76 78 74 68 72 58 C66 62 54 62 48 58'),
            path('sil-torso', 'M52 38 C56 36 64 36 68 38 L66 48 C64 50 56 50 54 48 Z'),
            strokePath('sil-collar', 'M50 38 Q60 42 70 38', '0.7'),
            path('sil-neck', 'M57 30 L55 38 L65 38 L63 30'),
            el('ellipse', { class: 'sil-head', cx: '60', cy: '23', rx: '7.5', ry: '9', fill: f, stroke: s, 'stroke-width': sw }),
            el('ellipse', { class: 'sil-hair', cx: '60', cy: '14', rx: '4.5', ry: '3.5', fill: hair, stroke: s, 'stroke-width': swHair }),
            path('sil-arm', 'M53 42 C46 48 40 56 36 66 C34 72 36 76 40 74 C44 68 48 58 52 50'),
            path('sil-arm', 'M67 42 C74 48 80 56 84 66 C86 72 84 76 80 74 C76 68 72 58 68 50'),
            el('circle', { class: 'sil-hand', cx: '37', cy: '73', r: '2.6', fill: f, stroke: s, 'stroke-width': '0.8' }),
            el('circle', { class: 'sil-hand', cx: '83', cy: '73', r: '2.6', fill: f, stroke: s, 'stroke-width': '0.8' })
        ].join('');
    }

    function buildBodyFigure() {
        return [
            el('ellipse', { class: 'silhouette-shadow', cx: '60', cy: '133', rx: '28', ry: '4', fill: 'rgba(0,0,0,0.38)' }),
            path('sil-legs', 'M42 86 C38 96 40 106 46 114 C52 120 58 116 56 106 C54 98 44 92 42 86'),
            path('sil-legs', 'M78 86 C82 96 80 106 74 114 C68 120 62 116 64 106 C66 98 76 92 78 86'),
            path('sil-robe', 'M40 60 C38 72 38 84 42 92 C52 98 68 98 78 92 C82 84 82 72 80 60 C70 66 50 66 40 60'),
            path('sil-torso', 'M44 36 C52 32 68 32 76 36 L74 52 C72 56 48 56 46 52 Z'),
            path('sil-neck', 'M56 28 L54 36 L66 36 L64 28'),
            el('ellipse', { class: 'sil-head', cx: '60', cy: '21', rx: '8.5', ry: '10', fill: f, stroke: s, 'stroke-width': sw }),
            path('sil-arm', 'M46 40 L38 72 C40 76 44 74 48 68 L52 52'),
            path('sil-arm', 'M74 40 L82 72 C80 76 76 74 72 68 L68 52'),
            el('circle', { class: 'sil-hand', cx: '37', cy: '74', r: '3', fill: f, stroke: s, 'stroke-width': '0.8' }),
            el('circle', { class: 'sil-hand', cx: '83', cy: '74', r: '3', fill: f, stroke: s, 'stroke-width': '0.8' })
        ].join('');
    }

    if (path === 'body') {
        return buildBodyFigure();
    }

    if (path === 'soul') {
        return `<g class="soul-figure">${buildQiFigure(true)}</g>`;
    }

    return buildQiFigure(false);
}

function getCultivatorRealmEffects(path, realm, style) {
    const g = style.glow;
    const cx = 60;
    const cy = 72;
    let back = '';
    let front = '';

    const glowRx = 36 + realm * 3;
    const glowRy = 40 + realm * 3;
    back += `<ellipse class="silhouette-glow" cx="${cx}" cy="${cy}" rx="${glowRx}" ry="${glowRy}" fill="rgba(${g},${0.06 + realm * 0.015})"/>`;

    if (realm >= 1) {
        back += `<circle class="realm-ring ring-inner" cx="${cx}" cy="${cy}" r="${30 + realm}" fill="none" stroke="rgba(${g},0.35)" stroke-width="1"/>`;
    }
    if (realm >= 2) {
        back += `<circle class="realm-ring ring-outer" cx="${cx}" cy="${cy}" r="${40 + realm * 2}" fill="none" stroke="rgba(${g},0.22)" stroke-width="0.8" stroke-dasharray="4 6"/>`;
    }
    if (realm >= 3) {
        const n = 3 + Math.floor(realm / 2);
        for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2;
            const r = 34 + realm * 2;
            back += `<circle class="orbit-particle" cx="${(cx + Math.cos(a) * r).toFixed(1)}" cy="${(cy + Math.sin(a) * r).toFixed(1)}" r="1.5" fill="rgba(${g},0.65)"/>`;
        }
    }
    if (realm >= 6) {
        back += `<circle class="realm-ring ring-transcendent" cx="${cx}" cy="${cy}" r="54" fill="none" stroke="rgba(${g},0.4)" stroke-width="1.5"/>`;
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            back += `<line class="radiance-line" x1="${cx}" y1="${cy}" x2="${(cx + Math.cos(a) * 56).toFixed(1)}" y2="${(cy + Math.sin(a) * 56).toFixed(1)}" stroke="rgba(${g},0.12)" stroke-width="1"/>`;
        }
    }

    if (realm >= 4) {
        front += `<ellipse class="realm-halo" cx="${cx}" cy="16" rx="${14 + realm}" ry="4" fill="none" stroke="rgba(${g},0.45)" stroke-width="1.2"/>`;
    }
    if (realm >= 5) {
        front += `<circle class="realm-crown" cx="${cx}" cy="10" r="2.5" fill="rgba(${g},0.5)"/>`;
    }

    if (path === 'qi') {
        if (realm >= 2) {
            front += `<circle class="qi-orb" cx="${cx}" cy="54" r="${3 + realm * 0.5}" fill="rgba(${g},0.3)" stroke="rgba(${g},0.5)" stroke-width="0.6"/>`;
        }
        if (realm >= 4) {
            front += `<path class="qi-flow" d="M60 46 Q52 56 60 62 Q68 56 60 46" fill="none" stroke="rgba(${g},0.25)" stroke-width="0.8"/>`;
        }
    } else if (path === 'body') {
        if (realm >= 1) {
            front += `<path class="body-accent" d="M52 38 L56 52 M68 38 L64 52" fill="none" stroke="rgba(${g},0.35)" stroke-width="1"/>`;
        }
        if (realm >= 3) {
            front += `<path class="body-plates" d="M46 36 Q60 32 74 36" fill="none" stroke="rgba(${g},0.3)" stroke-width="1.2"/>`;
        }
        if (realm >= 5) {
            front += `<path class="body-crack" d="M58 40 L62 48 M60 48 L58 54" fill="none" stroke="rgba(${g},0.25)" stroke-width="0.7"/>`;
        }
    } else if (path === 'soul') {
        if (realm >= 1) {
            front += `<circle class="soul-eye" cx="${cx}" cy="23" r="2" fill="rgba(${g},0.7)"/>`;
        }
        if (realm >= 2) {
            for (let i = 0; i < 2 + Math.min(realm, 4); i++) {
                const x = 18 + i * 22;
                front += `<path class="soul-wisp" d="M${x} 92 Q${x + 10} 78 ${x + 20} 90" fill="none" stroke="rgba(${g},0.22)" stroke-width="1"/>`;
            }
        }
        if (realm >= 4) {
            front += `<circle class="soul-aura-head" cx="${cx}" cy="23" r="14" fill="none" stroke="rgba(${g},0.15)" stroke-width="0.8"/>`;
        }
    }

    return { back, front };
}

function addLog(msg) {
    if (G._deferringLogs && G._actionLog) {
        if (!G._pendingActionMeta) G._pendingActionMeta = { time: '', world: '', extras: [] };
        const text = typeof msg === 'object' ? msg.html : msg;
        G._pendingActionMeta.extras.push(text);
        return;
    }
    const entry = typeof msg === 'object' ? msg : { html: msg, cls: '' };
    G.log.unshift(entry);
    if (G.log.length > 100) G.log.pop();
    renderLog();
    const lastEl = document.getElementById('sceneLastEvent');
    if (lastEl) {
        const plain = entry.html.replace(/<[^>]+>/g, '');
        lastEl.textContent = plain;
    }
}

function beginActionLog() {
    if (G._actionLog) cancelActionLog();
    G._actionLog = true;
    G._pendingActionMeta = null;
}

function cancelActionLog() {
    G._actionLog = false;
    G._pendingActionMeta = null;
    G._deferringLogs = false;
}

function queueActionLogSupplement(msg) {
    if (!msg) return;
    if (G._actionLog && G._pendingActionMeta) {
        if (!G._pendingActionMeta.extras) G._pendingActionMeta.extras = [];
        G._pendingActionMeta.extras.push(msg);
        return;
    }
    addLog(msg);
}

function timeCombatStart(outcomeMsg, activityLabel) {
    const months = ACTION_MONTHS.combatStart || 2;
    const activity = activityLabel || 'Seeking a worthy opponent';
    beginActionLog();
    if (!advanceTime(months, activity)) {
        cancelActionLog();
        return false;
    }
    commitActionLog(outcomeMsg || '⚔️ Battle is joined.');
    return true;
}

function logTimedResult(result) {
    if (!result?.message || result.logged) return;
    addLog(result.message);
}

function commitTimedResult(result, mainMsg) {
    if (mainMsg) commitActionLog(mainMsg);
    return { ...result, message: mainMsg || result?.message, logged: true };
}

function runTimedAction(months, activity, workFn) {
    beginActionLog();
    if (!advanceTime(months, activity)) {
        cancelActionLog();
        return { ok: false, dead: true };
    }
    const out = workFn();
    if (out?.cancelLog) {
        cancelActionLog();
        return { ok: false, ...(typeof out === 'object' ? out : {}) };
    }
    const msg = typeof out === 'string' ? out : out?.msg;
    if (msg) commitActionLog(msg);
    return { ok: true, ...(typeof out === 'object' ? out : {}) };
}

function commitActionLog(mainMsg) {
    const pending = G._pendingActionMeta;
    G._actionLog = false;
    G._pendingActionMeta = null;
    if (!pending?.time) {
        addLog(mainMsg);
        return;
    }
    const metaParts = [pending.time];
    if (pending.world) metaParts.push(pending.world);
    const html = `${mainMsg}<span class="log-meta">${metaParts.join(' · ')}</span>`;
    addLog({ html, cls: 'log-action' });
    if (pending.extras?.length) {
        pending.extras.forEach(line => addLog(line));
    }
}

function addCombatLog(msg, cls) {
    G.combatLog.unshift(typeof msg === 'object' ? msg : { html: msg, cls: cls || '' });
    if (G.combatLog.length > 50) G.combatLog.pop();
    renderCombatLog();
}

function renderCombatLog() {
    const el = document.getElementById('combatLog');
    if (!el) return;
    el.innerHTML = G.combatLog.map(entry => {
        if (typeof entry === 'string') return `<div class="entry">${entry}</div>`;
        const cls = entry.cls ? ` ${entry.cls}` : '';
        return `<div class="entry${cls}">${entry.html}</div>`;
    }).join('');
    el.scrollTop = 0;
}

function renderLog() {
    const el = document.getElementById('log');
    el.innerHTML = G.log.map(entry => {
        if (typeof entry === 'string') return `<div class="entry">${entry}</div>`;
        const cls = entry.cls ? ` ${entry.cls}` : '';
        return `<div class="entry${cls}">${entry.html}</div>`;
    }).join('');
    el.scrollTop = 0;
}

function getBarrierLabel() {
    if (G.path === 'soul') return 'Soul Shield';
    if (G.path === 'qi') return 'Qi Barrier';
    return 'Shield';
}

function logIncomingHit(info) {
    const rows = [];
    rows.push(`<div class="hit-enemy">${info.enemyName} strikes!</div>`);
    rows.push(`<div class="hit-row hit-incoming">Force: <b>${info.raw}</b></div>`);

    if (info.intimidateReduced > 0) {
        rows.push(`<div class="hit-row hit-mod">👁️ Intimidated: −${info.intimidateReduced}</div>`);
    }
    if (info.stance === 'fortify') {
        rows.push(`<div class="hit-row hit-stance">💪 Fortified: −${info.stanceBlocked} blocked</div>`);
    } else if (info.stance === 'defend') {
        rows.push(`<div class="hit-row hit-stance">🛡️ Guarded: −${info.stanceBlocked} blocked</div>`);
    }
    if (info.physiqueReduced > 0) {
        rows.push(`<div class="hit-row hit-mod">🧬 Physique: −${info.physiqueReduced}</div>`);
    }
    if (info.evaded) {
        rows.push(`<div class="hit-row hit-evade">🌀 <b>Evaded!</b> No damage taken.</div>`);
    } else {
        if (info.barrierAbsorbed > 0) {
            rows.push(`<div class="hit-row hit-barrier">🛡️ ${info.barrierLabel}: −${info.barrierAbsorbed} absorbed</div>`);
        }
        if (info.hpDamage > 0) {
            rows.push(`<div class="hit-row hit-hp">❤️ <b>HP: −${info.hpDamage}</b></div>`);
        } else if (info.barrierAbsorbed > 0 || info.stanceBlocked > 0) {
            rows.push(`<div class="hit-row hit-safe">✓ No HP lost</div>`);
        } else if (info.afterModifiers === 0) {
            rows.push(`<div class="hit-row hit-safe">✓ Fully negated</div>`);
        }
    }

    addCombatLog({ html: `<div class="hit-summary">${rows.join('')}</div>`, cls: 'entry-hit' });
    showCombatHitSummary(info);
    flashCombatDamage(info);
}

function showCombatHitSummary(info) {
    const el = document.getElementById('combatHitSummary');
    if (!el) return;
    if (info.evaded) {
        el.className = 'combat-hit-summary flash-evade';
        el.innerHTML = '🌀 Evaded — no damage';
    } else if (info.hpDamage > 0 && info.barrierAbsorbed > 0) {
        el.className = 'combat-hit-summary flash-mixed';
        el.innerHTML = `🛡️ −${info.barrierAbsorbed} barrier · ❤️ −${info.hpDamage} HP`;
    } else if (info.hpDamage > 0) {
        el.className = 'combat-hit-summary flash-hp';
        el.innerHTML = `❤️ −${info.hpDamage} HP`;
    } else if (info.barrierAbsorbed > 0) {
        el.className = 'combat-hit-summary flash-barrier';
        el.innerHTML = `🛡️ −${info.barrierAbsorbed} ${info.barrierLabel} — HP safe`;
    } else if (info.stanceBlocked > 0) {
        el.className = 'combat-hit-summary flash-block';
        el.innerHTML = `🛡️ Blocked −${info.stanceBlocked} — HP safe`;
    } else {
        el.className = 'combat-hit-summary';
        el.innerHTML = '';
        return;
    }
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => {
        el.className = 'combat-hit-summary';
        el.innerHTML = '';
    }, 3200);
}

function flashCombatDamage(info) {
    const hpBar = document.getElementById('playerHpBar');
    const shieldRow = document.getElementById('combatShieldRow');
    if (info.evaded) {
        hpBar?.classList.add('flash-evade');
        setTimeout(() => hpBar?.classList.remove('flash-evade'), 600);
        return;
    }
    if (info.barrierAbsorbed > 0 && shieldRow) {
        shieldRow.classList.add('flash-barrier');
        setTimeout(() => shieldRow.classList.remove('flash-barrier'), 600);
    }
    if (info.hpDamage > 0 && hpBar) {
        hpBar.classList.add('flash-hp');
        setTimeout(() => hpBar.classList.remove('flash-hp'), 600);
    }
}

function setCombatInputEnabled(enabled) {
    ['cbAttack', 'cbSecondary', 'cbSkill'].forEach(id => {
        const btn = document.getElementById(id);
        if (btn) btn.disabled = !enabled;
    });
    const fleeBtn = document.getElementById('cbFlee');
    if (fleeBtn && fleeBtn.style.opacity !== '0.4') fleeBtn.disabled = !enabled;
    const hint = document.getElementById('combatPhaseHint');
    if (hint) {
        hint.textContent = enabled ? '' : '⏳ Enemy turn…';
        hint.classList.toggle('active', !enabled);
    }
}

function updateCombatUI() {
    if (!G.enemy) return;
    const cfg = getCombatConfig();

    document.getElementById('enemyName').textContent = G.enemy.name;
    document.getElementById('enemyHp').textContent = Math.max(0, G.enemy.hp);
    document.getElementById('enemyMaxHp').textContent = G.enemyMaxHp;
    document.getElementById('playerHp').textContent = G.hp;
    document.getElementById('playerMaxHp').textContent = typeof getEffectiveMaxHp === 'function' ? getEffectiveMaxHp() : G.maxHp;
    document.getElementById('playerShield').textContent = G.shield;
    document.getElementById('playerMaxShield').textContent = G.maxShield;

    setBarWidth('enemyHpBar', G.enemy.hp, G.enemyMaxHp);
    setBarWidth('playerHpBar', G.hp, typeof getEffectiveMaxHp === 'function' ? getEffectiveMaxHp() : G.maxHp);

    const resPanel = document.getElementById('combatResourcePanel');
    const resTrack = document.getElementById('combatResourceTrack');
    const resIcon = document.getElementById('combatResourceIcon');
    const resName = document.getElementById('combatResourceName');
    const resText = document.getElementById('combatResourceText');

    if (resPanel && resTrack) {
        resTrack.className = 'combat-bar-track ' + cfg.cssClass;
        resTrack.style.setProperty('--resource-color', cfg.barColor);
        if (resIcon) resIcon.textContent = cfg.icon;
        if (resName) resName.textContent = cfg.resource;
        if (resText) resText.textContent = `${G.combatResource}/${G.maxCombatResource}`;
        setBarWidth('combatResourceBar', G.combatResource, G.maxCombatResource);
    }

    const shieldRow = document.getElementById('combatShieldRow');
    const shieldLabel = document.getElementById('combatShieldLabel');
    if (shieldRow) {
        if (G.path === 'body') {
            shieldRow.style.display = 'none';
        } else {
            shieldRow.style.display = 'flex';
            if (shieldLabel) {
                shieldLabel.textContent = (cfg.shieldLabel ? '🛡️ ' + cfg.shieldLabel : '🛡️ Shield');
            }
        }
    }

    if (G.enemy.intimidateTurns > 0) {
        document.getElementById('enemyName').textContent = G.enemy.name + ' (Shaken)';
    }

    setCombatInputEnabled(G.combatPhase === 'player');
    if (typeof updateFleeButton === 'function') updateFleeButton();
    renderCombatBonusBar();
    renderCombatLog();
    if (typeof updateVoidStepButton === 'function') updateVoidStepButton();
}

function renderCombatBonusBar() {
    const el = document.getElementById('combatBonusBar');
    if (!el) return;
    ensureAffinities();
    const chips = [];
    Object.values(TECHNIQUE_SETS).forEach(set => {
        const bonus = getSetBonusesForId(set.id);
        if (bonus) {
            chips.push(`<span class="combat-bonus-chip set-chip" title="${bonus.desc}">${set.emoji} ${set.name} (${countOwnedSetTechniques(set.id)}/${set.techniques.length})</span>`);
        }
    });
    getTopAffinities(3).forEach(({ key, points, tier }) => {
        chips.push(`<span class="combat-bonus-chip affinity-chip" title="${getAffinityTierBonus(points).desc}">${AFFINITY_LABELS[key]} ${tier}</span>`);
    });
    el.innerHTML = chips.length ? chips.join('') : '';
    el.style.display = chips.length ? 'flex' : 'none';
}

function setBarWidth(id, current, max) {
    const el = document.getElementById(id);
    if (!el) return;
    const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;
    el.style.width = pct + '%';
}

function fullRender() {
    if (typeof clampCurrentQi === 'function') clampCurrentQi();
    updateShield();
    renderStatus();
    renderLog();
    updateMarketButton();
    if (typeof updateSearchButton === 'function') updateSearchButton();
    if (typeof syncStoryNpcQuests === 'function') syncStoryNpcQuests();
    if (typeof syncStoryQuestLog === 'function') syncStoryQuestLog();
    renderQuestLogPanel();
    renderNpcPresencePanel();
    if (typeof processTutorialQueue === 'function') processTutorialQueue();
    if (typeof refreshTutorialHighlight === 'function') refreshTutorialHighlight();
    saveState();
}

// ===== POPUP RENDERERS =====
let techSortMode = 'path';

function renderTechItemHtml(tech) {
    const tier = getTechniqueTier(tech.uses || 0);
    const cost = getTechCost(tech);
    const dmg = G.inCombat ? calcCombatTechniqueDamage(tech) : getTechDamage(tech);
    const meta = getTechniqueMeta(tech);
    const pathIcon = meta.path === 'qi' ? '⚡' : meta.path === 'body' ? '💪' : meta.path === 'soul' ? '🧠' : '◆';
    const elemLabel = TECH_ELEMENT_LABELS[meta.element] || meta.element;
    const combatCost = G.inCombat ? getTechniqueCombatCost(tech) : null;
    const canAfford = !G.inCombat || combatCost == null || G.combatResource >= combatCost;
    const combatTierId = getTechniqueCombatTier(tech);
    const combatTierLabel = TECHNIQUE_COMBAT_TIERS[combatTierId]?.label || combatTierId;
    const cfg = G.inCombat ? getCombatConfig() : null;
    const bd = getTechDamageBreakdown(tech);
    const setDef = meta.setId ? TECHNIQUE_SETS[meta.setId] : null;
    const setBadge = setDef ? `<span class="tech-set-badge">${setDef.emoji} ${setDef.name}</span>` : '';
    const affKey = getTechniquePrimaryAffinityKey(tech);
    const affLine = affKey ? `<span class="tech-aff-tag">${AFFINITY_LABELS[affKey]} ${getAffinityTierName(G.affinities?.[affKey] || 0)}</span>` : '';
    const scaleHint = meta.category === 'utility' || meta.category === 'defense' || meta.category === 'buff'
        ? (TECH_CATEGORY_LABELS[meta.category] || meta.category)
        : `base ${bd.base}+stat ${bd.statPart}+realm ${bd.realmPart}${bd.mastery ? '+mas '+bd.mastery : ''}`;
    const multParts = [];
    if (bd.elementMult > 1) multParts.push('Dao ×' + bd.elementMult);
    if (bd.affinityMult > 1) multParts.push('Aff ×' + bd.affinityMult.toFixed(2));
    if (bd.setMult > 1) multParts.push('Set ×' + bd.setMult.toFixed(2));
    const multStr = multParts.length ? ' | ' + multParts.join(' · ') : '';
    const tierBadge = `<span class="tech-tier-badge tier-${combatTierId}">${combatTierLabel}</span>`;
    const costLine = G.inCombat
        ? `⚔️ ${dmg} dmg | ${cfg.icon} ${combatCost} ${cfg.resource}${canAfford ? '' : ' (insufficient)'}${multStr}`
        : `⚔️ ${dmg} dmg (${scaleHint}) | 💰 ${cost} ${tech.costType} | Uses: ${tech.uses || 0}${multStr}`;
    const affordClass = canAfford ? '' : ' tech-unaffordable';
    return `<div class="popup-item${affordClass}" data-tech="${tech.name}"${canAfford ? '' : ' data-unaffordable="1"'}>
        <div class="name">${pathIcon} ${tech.name} ${tierBadge} ${setBadge} <span style="color:#b8863a;font-size:12px;">[${tier.name}]</span></div>
        <div class="desc">${tech.desc} · ${elemLabel} · ${tech.rarity}${affLine ? ' · ' + affLine : ''}</div>
        <div class="meta">${costLine}</div>
    </div>`;
}

function renderAffinityPanel() {
    const el = document.getElementById('techAffinityPanel');
    if (!el) return;
    ensureAffinities();
    const highlight = ['fire', 'water', 'fist'];
    const top = getTopAffinities(8).map(a => a.key);
    const keys = [...new Set([...highlight, ...top])];
    const rows = keys.map(key => {
        const pts = G.affinities[key] || 0;
        if (pts === 0 && !highlight.includes(key)) return '';
        const tier = getAffinityTierName(pts);
        const bonus = getAffinityTierBonus(pts);
        return `<div class="affinity-row">
            <span class="affinity-label">${AFFINITY_LABELS[key]}</span>
            <span class="affinity-tier">${tier}</span>
            <div class="affinity-bar-track"><div class="affinity-bar-fill" style="width:${pts}%"></div></div>
            <span class="affinity-pts">${pts}/100</span>
            <span class="affinity-bonus">${bonus.desc}</span>
        </div>`;
    }).filter(Boolean).join('');
    el.innerHTML = `<div class="tech-panel-title">✨ Affinity</div>${rows || '<p class="tech-panel-empty">Use elemental or weapon techniques in combat to grow affinity.</p>'}`;
}

function renderSetResonancePanel() {
    const el = document.getElementById('techSetPanel');
    if (!el) return;
    const rows = Object.values(TECHNIQUE_SETS).map(set => {
        const owned = countOwnedSetTechniques(set.id);
        const bonus = getSetBonusesForId(set.id);
        const pips = set.techniques.map(name => {
            const has = G.techniques.some(t => t.name === name);
            return `<span class="set-pip${has ? ' owned' : ''}" title="${name}"></span>`;
        }).join('');
        const status = bonus ? bonus.desc : `${owned}/${set.techniques.length} techniques — learn 2+ for resonance`;
        return `<div class="set-row">
            <div class="set-row-head"><span>${set.emoji} ${set.name}</span><span class="set-count">${owned}/${set.techniques.length}</span></div>
            <div class="set-pips">${pips}</div>
            <div class="set-status">${status}</div>
        </div>`;
    }).join('');
    el.innerHTML = `<div class="tech-panel-title">🔗 Set Resonance</div>${rows}`;
}

function groupTechniquesForDisplay(techniques) {
    const groups = new Map();
    techniques.forEach(tech => {
        const meta = getTechniqueMeta(tech);
        let key, label;
        if (techSortMode === 'element') {
            key = meta.element;
            label = TECH_ELEMENT_LABELS[key] || meta.element;
        } else if (techSortMode === 'category') {
            key = meta.category;
            label = TECH_CATEGORY_LABELS[key] || meta.category;
        } else {
            key = meta.path;
            label = TECH_PATH_LABELS[key] || meta.path;
        }
        if (!groups.has(key)) groups.set(key, { key, label, items: [] });
        groups.get(key).items.push(tech);
    });

    const order = techSortMode === 'element'
        ? ['fire', 'water', 'ice', 'lightning', 'earth', 'soul', 'blood', 'elemental', 'neutral']
        : techSortMode === 'category'
            ? ['attack', 'utility']
            : ['qi', 'body', 'soul', 'neutral'];

    const playerPath = G.path;
    const sorted = [];
    if (techSortMode === 'path') {
        if (groups.has(playerPath)) sorted.push(groups.get(playerPath));
        order.forEach(k => {
            if (k !== playerPath && groups.has(k)) sorted.push(groups.get(k));
        });
    } else {
        order.forEach(k => { if (groups.has(k)) sorted.push(groups.get(k)); });
        groups.forEach(g => { if (!sorted.includes(g)) sorted.push(g); });
    }
    return sorted;
}

function renderTechPopup() {
    renderAffinityPanel();
    renderSetResonancePanel();
    const el = document.getElementById('techList');
    const sortBar = document.getElementById('techSortBar');
    if (sortBar) {
        sortBar.querySelectorAll('[data-tech-sort]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.techSort === techSortMode);
        });
    }
    if (G.techniques.length === 0) {
        el.innerHTML = `<div class="popup-empty">No techniques yet. Explore any zone for manuals, or visit a market in the Heartlands / Jade Archipelago.</div>`;
        return;
    }
    const groups = groupTechniquesForDisplay(G.techniques);
    el.innerHTML = groups.map(group => `
        <div class="tech-group">
            <div class="tech-group-header">${group.label} <span class="tech-group-count">${group.items.length}</span></div>
            ${group.items.map(t => renderTechItemHtml(t)).join('')}
        </div>
    `).join('');
    if (G.inCombat) {
        el.querySelectorAll('.popup-item').forEach(item => {
            item.addEventListener('click', function() {
                if (this.dataset.unaffordable === '1') return;
                combatUseTechnique(this.dataset.tech);
            });
        });
    }
}

function renderPillPopup() {
    const el = document.getElementById('pillList');
    if (!el) return;
    ensurePillStock();
    const entries = Object.entries(PILL_TYPES).filter(([id]) => (G.pillStock[id] || 0) > 0);
    if (entries.length === 0) {
        el.innerHTML = `<div class="popup-empty">No pills in your pouch. Explore or visit a market.</div>`;
        return;
    }
    el.innerHTML = entries.map(([id, pill]) => {
        const qty = G.pillStock[id];
        return `<div class="popup-item pill-row" data-pill="${id}">
            <div class="name">${pill.emoji} ${pill.name} <span style="color:#a09080;font-size:12px;">×${qty}</span></div>
            <div class="desc">${pill.desc}</div>
            <div class="meta">${pill.months} month${pill.months > 1 ? 's' : ''} to consume</div>
        </div>`;
    }).join('');
    el.querySelectorAll('[data-pill]').forEach(row => {
        row.addEventListener('click', function() {
            usePill(this.dataset.pill);
        });
    });
}

function renderMeridianPopup() {
    const grid = document.getElementById('meridianGrid');
    let html = '';
    for (let i = 0; i < 13; i++) {
        const open = G.meridians[i];
        const icon = getMeridianIcon(i);
        const name = getMeridianName(i);
        const isPerfect = open && getMeridianOpenCount() === 13;
        const cls = isPerfect ? 'meridian-cell perfect' : open ? 'meridian-cell open' : 'meridian-cell';
        html += `<div class="${cls}"><span class="icon">${icon}</span><span class="label">${name}</span></div>`;
    }
    grid.innerHTML = html;
    const actionEl = document.getElementById('meridianAction');
    const openCount = getMeridianOpenCount();
    let actions = `<div style="font-size:12px;color:#a09080;">Open meridians: ${openCount}/13</div>`;
    if (openCount < 11) {
        actions += `<button class="popup-item" id="senseMeridian" style="width:100%;text-align:center;margin-top:6px;"><div class="name">🔮 Sense & Open Meridian</div><div class="desc">Costs Qi, chance based on foundation</div></button>`;
    }
    if (openCount >= 11 && !G.meridians[11]) {
        if (G.hasGoldenNeedle) {
            actions += `<button class="popup-item" id="goldenNeedleBtn" style="width:100%;text-align:center;margin-top:6px;border-color:#f1c40f;"><div class="name">🌟 Golden Needle Set</div><div class="desc">Open the 12th meridian</div></button>`;
        } else {
            actions += `<div style="font-size:11px;color:#6a5a4a;margin-top:6px;">💡 You sense a 12th meridian... you need a Golden Needle Set.</div>`;
        }
    }
    if (openCount >= 12 && !G.meridians[12]) {
        if (G.hasAncientText) {
            actions += `<button class="popup-item" id="hidden13thBtn" style="width:100%;text-align:center;margin-top:6px;border-color:#8e44ad;"><div class="name">📜 Hidden 13th Meridian</div><div class="desc">Requires tribulation survival + ancient text</div></button>`;
        } else {
            actions += `<div style="font-size:11px;color:#6a5a4a;margin-top:6px;">💡 You sense a 13th meridian... you need an ancient text.</div>`;
        }
    }
    if (openCount === 13) {
        actions += `<div style="font-size:14px;color:#f1c40f;margin-top:8px;">🌟 All meridians open! Primordial Vessel complete!</div>`;
    }
    actionEl.innerHTML = actions;
    document.getElementById('senseMeridian')?.addEventListener('click', function() {
        const result = attemptOpenMeridian(getMeridianOpenCount());
        logTimedResult(result);
        renderMeridianPopup();
        fullRender();
    });
    document.getElementById('goldenNeedleBtn')?.addEventListener('click', function() {
        const result = attemptGoldenNeedle();
        logTimedResult(result);
        renderMeridianPopup();
        fullRender();
    });
    document.getElementById('hidden13thBtn')?.addEventListener('click', function() {
        const result = attemptHidden13th();
        logTimedResult(result);
        renderMeridianPopup();
        fullRender();
    });
}

function renderPhysiquePopup() {
    const el = document.getElementById('physiqueList');
    let html = '<div style="font-size:12px;color:#a09080;margin-bottom:6px;">Choose a physique to train or awaken.</div>';
    html += '<div style="font-size:13px;color:#b8863a;margin-top:6px;">━━ Trainable ──</div>';
    for (const p of TRAINABLE_PHYSIQUES) {
        const isActive = G.physique && G.physique.name === p.name;
        html += `<div class="popup-item" data-physique="${p.name}" style="${isActive ? 'border-color:#f1c40f;' : ''}">
            <div class="name">${isActive ? '✅ ' : ''}${p.name} <span style="font-size:11px;color:#6a5a4a;">[Trainable]</span></div>
            <div class="desc">${p.pro} | ${p.con}</div>
        </div>`;
    }
    html += '<div style="font-size:13px;color:#f1c40f;margin-top:8px;">━━ Legendary ──</div>';
    for (const p of LEGENDARY_PHYSIQUES) {
        const isActive = G.physique && G.physique.name === p.name;
        const effects = typeof formatPhysiqueEffectDesc === 'function' ? formatPhysiqueEffectDesc(p) : '';
        html += `<div class="popup-item" data-physique="${p.name}" style="${isActive ? 'border-color:#f1c40f;' : ''}">
            <div class="name">${isActive ? '✅ ' : ''}${p.name} <span style="font-size:11px;color:#f1c40f;">[Legendary]</span></div>
            <div class="desc">Trial: ${p.trial}</div>
            <div class="meta physique-effect">${effects}</div>
        </div>`;
    }
    html += '<div style="font-size:13px;color:#e74c3c;margin-top:8px;">━━ Evil ──</div>';
    for (const p of EVIL_PHYSIQUES) {
        const isActive = G.physique && G.physique.name === p.name;
        html += `<div class="popup-item" data-physique="${p.name}" style="${isActive ? 'border-color:#e74c3c;' : ''}">
            <div class="name">${isActive ? '✅ ' : ''}${p.name} <span style="font-size:11px;color:#e74c3c;">[Evil]</span></div>
            <div class="desc">${p.pro} | ${p.con}</div>
        </div>`;
    }
    el.innerHTML = html;
    el.querySelectorAll('.popup-item').forEach(item => {
        item.addEventListener('click', function() {
            const name = this.dataset.physique;
            const p = getPhysiqueByName(name);
            if (!p) return;
            let result;
            if (p.type === 'trainable') result = trainPhysique(name);
            else if (p.type === 'legendary') result = attemptLegendaryPhysique(name);
            else if (p.type === 'evil') result = attemptEvilPhysique(name);
            if (result) {
                logTimedResult(result);
                renderPhysiquePopup();
                fullRender();
            }
        });
    });
}

function renderIntentPopup() {
    const el = document.getElementById('intentList');
    if (!el) return;
    if (typeof ensureIntentState === 'function') ensureIntentState();
    const track = getIntentTrackForPath(G.path);
    let html = `<div style="font-size:12px;color:#a09080;margin-bottom:8px;">${track.emoji} ${track.label} — awaken multiple paths, but time and focus limit how far each refines.</div>`;

    if (G.weaponIntents?.length) {
        html += `<div class="tech-group"><div class="tech-group-header">Awakened <span class="tech-group-count">${G.weaponIntents.length}</span></div>`;
        for (const intent of G.weaponIntents) {
            const tier = getIntentTierForRecord(intent);
            const isActive = G.activeIntentWeapon === intent.weapon;
            const arts = getIntentExpandArtDefs(intent);
            const bonus = getIntentBonusForRecord(intent);
            html += `<div class="popup-item intent-row${isActive ? ' intent-active' : ''}" data-intent-weapon="${intent.weapon}">
                <div class="name">${isActive ? '★ ' : ''}${intent.weapon} — ${tier.name}</div>
                <div class="desc">${Math.floor(intent.uses)} uses · +${Math.round(bonus * 100)}% basics · ${getIntentDeepenCount(intent)} Deepen</div>
                <div class="meta">${arts.length ? 'Arts: ' + arts.map(a => a.name).join(', ') : 'No Expand arts yet'}${isActive ? ' · Active focus' : ''}</div>
            </div>`;
        }
        html += '</div>';
        html += `<button type="button" class="popup-item" id="intentRefineBtn" style="width:100%;text-align:center;margin-top:6px;">
            <div class="name">🧘 Refine Active Intent</div>
            <div class="desc">${ACTION_MONTHS.intentRefine} months — steady progress without combat</div>
        </button>`;
    }

    const awakened = new Set(G.weaponIntents.map(i => i.weapon));
    const available = WEAPON_TYPES.filter(w => !awakened.has(w));
    if (available.length) {
        html += `<div class="tech-group"><div class="tech-group-header">Awaken New</div>`;
        for (const w of available) {
            const months = G.weaponIntents.length === 0 ? ACTION_MONTHS.intentChoose : ACTION_MONTHS.intentAwaken;
            html += `<div class="popup-item" data-weapon="${w}">
                <div class="name">${track.emoji} ${w}</div>
                <div class="desc">${months} months — begin ${w} ${track.label}</div>
            </div>`;
        }
        html += '</div>';
    }

    if (G.weaponIntents.filter(i => getIntentTierIndex(i.uses) >= INTENT_BALANCE.dividedHeartMinStage).length >= 2) {
        html += `<div style="font-size:11px;color:#a08070;margin:8px 0;">☯ Divided heart — multiple refined intents progress slightly slower.</div>`;
    }

    if (G.pendingIntentChoice && G.activeIntentWeapon === G.pendingIntentChoice.weapon) {
        const pendingArt = getPendingExpandArt(G.pendingIntentChoice.weapon, G.pendingIntentChoice.tierIdx);
        html += `<div style="font-size:12px;color:#b8863a;margin-top:8px;">⚠️ ${G.pendingIntentChoice.weapon} reached ${G.pendingIntentChoice.tier} — choose for your <b>active</b> focus:</div>
            <button type="button" class="popup-item" id="intentDeepen" style="width:100%;text-align:center;margin-top:4px;">
                <div class="name">⬆️ Deepen</div>
                <div class="desc">${ACTION_MONTHS.intentDeepen} mo · +${Math.round(INTENT_BALANCE.deepenBonusPerPick * 100)}% basic damage</div>
            </button>
            <button type="button" class="popup-item" id="intentExpand" style="width:100%;text-align:center;margin-top:4px;">
                <div class="name">🔄 Expand</div>
                <div class="desc">${ACTION_MONTHS.intentExpand} mo · ${pendingArt ? pendingArt.name + ': ' + pendingArt.desc : 'New Intent Art'}</div>
            </button>`;
    }

    const active = getActiveIntent();
    if (active) {
        const manifestation = getIntentManifestation();
        if (manifestation) {
            html += `<div style="font-size:12px;color:#f1c40f;margin-top:8px;">🌟 ${manifestation}</div>`;
        }
    }

    el.innerHTML = html;

    el.querySelectorAll('[data-weapon]').forEach(item => {
        item.addEventListener('click', function() {
            const result = chooseWeaponIntent(this.dataset.weapon);
            logTimedResult(result);
            renderIntentPopup();
            fullRender();
        });
    });
    el.querySelectorAll('[data-intent-weapon]').forEach(item => {
        item.addEventListener('click', function() {
            const result = switchActiveIntent(this.dataset.intentWeapon);
            logTimedResult(result);
            renderIntentPopup();
            fullRender();
        });
    });
    document.getElementById('intentRefineBtn')?.addEventListener('click', function() {
        const result = refineActiveIntent();
        logTimedResult(result);
        renderIntentPopup();
        fullRender();
    });
    document.getElementById('intentDeepen')?.addEventListener('click', function() {
        const result = makeIntentChoice('deepen');
        logTimedResult(result);
        renderIntentPopup();
        fullRender();
    });
    document.getElementById('intentExpand')?.addEventListener('click', function() {
        const result = makeIntentChoice('expand');
        logTimedResult(result);
        renderIntentPopup();
        fullRender();
    });
}

function renderDaoPopup() {
    const el = document.getElementById('daoList');
    if (!el) return;
    const daoRealm = typeof getDaoFragmentReqRealm === 'function' ? getDaoFragmentReqRealm(null) : 5;
    const daoLabel = typeof getDaoSeekingRealmLabel === 'function' ? getDaoSeekingRealmLabel() : 'Dao Seeking';
    const daoLocked = G.realmIdx < daoRealm;
    let html = '';
    if (daoLocked) {
        html += `<div class="popup-empty">Reach ${daoLabel} to seek and comprehend Dao fragments.</div>`;
    }
    if (G.daoFragments.length > 0) {
        html += '<div style="font-size:13px;color:#b8863a;">📜 Dao Fragments:</div>';
        for (const f of G.daoFragments) {
            const fragment = DAO_FRAGMENTS.find(d => d.name === f);
            if (fragment) {
                html += `<div class="popup-item dao-fragment-item" data-fragment="${f}" style="cursor:pointer;">
                    <div class="name">${f}</div>
                    <div class="desc">${fragment.desc}</div>
                    <div class="meta">Click to comprehend · ${daoLabel}+</div>
                </div>`;
            }
        }
    } else if (!daoLocked) {
        html += '<div class="popup-empty">No Dao fragments found. Search below or explore forbidden grounds.</div>';
    }
    if (G.trueDaos.length > 0) {
        html += '<div style="font-size:13px;color:#8e44ad;margin-top:8px;">🌟 True Daos:</div>';
        for (const d of G.trueDaos) {
            const dao = TRUE_DAOS.find(t => t.name === d);
            if (dao) {
                html += `<div class="popup-item" style="border-color:#8e44ad;">
                    <div class="name">${dao.name} <span style="font-size:11px;color:#8e44ad;">[True]</span></div>
                    <div class="desc">${dao.desc}</div>
                </div>`;
            }
        }
    }
    if (G.primeDaos.length > 0) {
        html += '<div style="font-size:13px;color:#f1c40f;margin-top:8px;">🌌 Prime Daos:</div>';
        for (const d of G.primeDaos) {
            const dao = PRIME_DAOS.find(p => p.name === d);
            if (dao) {
                html += `<div class="popup-item" style="border-color:#f1c40f;">
                    <div class="name">${dao.name} <span style="font-size:11px;color:#f1c40f;">[Prime]</span></div>
                    <div class="desc">${dao.desc}</div>
                    <div class="meta">Can merge with ${dao.mergeWith} → ${dao.mergeResult}</div>
                </div>`;
            }
        }
    }
    if (G.mergedDaos.length > 0) {
        html += '<div style="font-size:13px;color:#e67e22;margin-top:8px;">🌀 Merged Daos:</div>';
        for (const d of G.mergedDaos) {
            const mdef = MERGED_DAOS[d];
            html += `<div class="popup-item" style="border-color:#e67e22;">
                <div class="name">${d} <span style="font-size:11px;color:#e67e22;">[Merged]</span></div>
                <div class="desc">${mdef?.desc || 'Supreme Dao Law'}</div>
            </div>`;
        }
    }
    const merges = typeof getAvailableDaoMerges === 'function' ? getAvailableDaoMerges() : [];
    if (merges.length) {
        html += '<div style="font-size:12px;color:#e67e22;margin-top:8px;">Supreme merges available:</div>';
        merges.forEach(def => {
            html += `<button type="button" class="popup-item dao-merge-btn" data-merge-dao="${escapeAttr(def.name)}" style="width:100%;text-align:left;margin-top:4px;border-color:#e67e22;">
                <div class="name">🌀 Merge ${def.pair.join(' + ')} → ${def.name}</div>
                <div class="desc">${def.desc} · ${DAO_MERGE_BALANCE.months}mo · ${DAO_MERGE_BALANCE.qiCost} Qi</div>
            </button>`;
        });
    }
    html += `<button class="popup-item" id="findFragmentBtn" style="width:100%;text-align:center;margin-top:8px;" ${daoLocked ? 'disabled' : ''}>
        <div class="name">🔍 Search for Dao Fragment</div>
        <div class="desc">${daoLocked ? `Requires ${daoLabel}` : 'Costs time and Qi'}</div>
    </button>`;
    el.innerHTML = html;
    document.getElementById('findFragmentBtn')?.addEventListener('click', function() {
        const result = findDaoFragment();
        logTimedResult(result);
        renderDaoPopup();
        fullRender();
    });
    el.querySelectorAll('.dao-merge-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = typeof mergeDaoPair === 'function' ? mergeDaoPair(this.dataset.mergeDao) : { success: false, message: 'Unavailable.' };
            logTimedResult(result);
            renderDaoPopup();
            fullRender();
        });
    });
    el.querySelectorAll('[data-fragment]').forEach(item => {
        item.addEventListener('click', function() {
            const name = this.dataset.fragment;
            if (G.realmIdx < daoRealm) {
                addLog(`You must reach ${daoLabel} to comprehend ${name}.`);
                return;
            }
            const result = comprehendDao(name);
            logTimedResult(result);
            renderDaoPopup();
            fullRender();
        });
    });
}

function renderSectPopup() {
    if (typeof ensureSectState === 'function') ensureSectState();
    const displayName = typeof getSectDisplayName === 'function' ? getSectDisplayName() : (G.sectName || 'Sect');
    document.getElementById('sectTitle').textContent = typeof isSectFounded === 'function' && isSectFounded()
        ? displayName
        : 'Sect — Found Your Legacy';
    const el = document.getElementById('sectInfo');
    let html = typeof renderSectPanelHtml === 'function' ? renderSectPanelHtml() : '';

    html += `<div class="sect-forge-divider"></div>`;
    html += `<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:14px;border-bottom:1px solid #1a1412;">
        <span style="color:#a09080;">Sect Leader</span><span style="color:#e8dcc8;">${G.name}</span></div>`;
    const fameLevel = getFameLevel();
    html += `<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:14px;border-bottom:1px solid #1a1412;">
        <span style="color:#a09080;">Fame</span><span style="color:#e8dcc8;">${G.fame} (${fameLevel.title})</span></div>`;
    html += `<div style="display:flex;justify-content:space-between;padding:4px 0;font-size:14px;border-bottom:1px solid #1a1412;">
        <span style="color:#a09080;">Technique Hall</span><span style="color:#e8dcc8;">${G.sectTechs.length} techniques</span></div>`;
    if (G.sectTechs.length > 0) {
        html += `<div style="margin-top:8px;border-top:1px solid #3a2a1a;padding-top:8px;"><span style="color:#a09080;font-size:12px;">Stored Techniques:</span>`;
        G.sectTechs.forEach(name => {
            const tech = G.techniques.find(t => t.name === name);
            if (tech) {
                const tier = getTechniqueTier(tech.uses || 0);
                html += `<div class="popup-item" style="margin:3px 0;padding:4px 8px;"><span class="name">${name}</span> <span style="font-size:11px;color:#6a5a4a;">[${tier.name}]</span></div>`;
            }
        });
        html += `</div>`;
    }

    const refineable = (G.legendaryMaterials || []).filter(m => LEGENDARY_REFINEMENTS[m]);
    if (refineable.length > 0) {
        html += `<div class="sect-forge-section"><div class="sect-forge-title">⚗️ Legendary Refinery</div>`;
        html += `<p class="sect-forge-hint">Refine materials once for permanent bonuses. Costs time + stones.</p>`;
        refineable.forEach(name => {
            const recipe = LEGENDARY_REFINEMENTS[name];
            const done = (G.refinedLegendary || []).includes(name);
            const btn = done
                ? `<span class="sect-forge-done">Refined</span>`
                : `<button type="button" class="sect-refine-btn" data-refine="${name.replace(/"/g, '&quot;')}">Refine · ${recipe.months}mo · ${recipe.stones}💎</button>`;
            html += `<div class="sect-forge-row"><span class="name">${name}</span>${btn}</div>`;
        });
        html += `</div>`;
    }

    const sectRecipes = typeof getCraftableRecipes === 'function' ? getCraftableRecipes() : [];
    const legRecipes = typeof getLegendaryGearRecipes === 'function' ? getLegendaryGearRecipes() : [];
    const forgeMult = typeof getSectForgeMonthsMult === 'function' ? getSectForgeMonthsMult() : 1;
    const discipleHint = G.disciples.length
        ? `Disciples speed forging (−${Math.round((1 - forgeMult) * 100)}% time).`
        : 'Recruit disciples to speed forging.';
    if (sectRecipes.length || legRecipes.length) {
        html += `<div class="sect-forge-section"><div class="sect-forge-title">🔨 Sect Forge</div>`;
        html += `<p class="sect-forge-hint">${discipleHint}</p>`;
        sectRecipes.forEach(({ id, def, recipe }) => {
            const check = canCraftGear(id);
            const months = Math.max(1, Math.ceil(recipe.months * forgeMult));
            html += `<div class="sect-forge-row${check.ok ? ' craft-ready' : ''}">
                <span class="name">${def.emoji} ${def.name} <span class="gear-tier">T${recipe.tier}</span></span>
                <button type="button" class="sect-refine-btn" data-sect-craft="${id}" ${check.ok ? '' : 'disabled'}>${months}mo · ${recipe.stones}💎</button>
            </div>`;
        });
        legRecipes.forEach(({ id, def, recipe }) => {
            const check = canCraftGear(id, { legendary: true });
            html += `<div class="sect-forge-row sect-forge-legend${check.ok ? ' craft-ready' : ''}">
                <span class="name">${def.emoji} ${def.name} <span class="gear-tier">Legendary</span></span>
                <button type="button" class="sect-refine-btn" data-leg-craft="${id}" ${check.ok ? '' : 'disabled'}>${recipe.months}mo · ${recipe.stones}💎</button>
            </div>`;
            if (recipe.consumesLegendary) {
                html += `<div class="sect-forge-sub">Uses ${recipe.consumesLegendary} · ${formatRecipeMaterials(recipe)}</div>`;
            }
        });
        html += `</div>`;
    }

    el.innerHTML = html;
    if (typeof bindSectPanelEvents === 'function') bindSectPanelEvents(el);
    el.querySelectorAll('[data-refine]').forEach(btn => {
        btn.addEventListener('click', function() {
            refineLegendaryMaterial(this.dataset.refine);
        });
    });
    el.querySelectorAll('[data-sect-craft]').forEach(btn => {
        btn.addEventListener('click', function() {
            if (typeof craftGearAtSect === 'function') craftGearAtSect(this.dataset.sectCraft);
        });
    });
    el.querySelectorAll('[data-leg-craft]').forEach(btn => {
        btn.addEventListener('click', function() {
            if (typeof craftLegendaryGear === 'function') craftLegendaryGear(this.dataset.legCraft);
        });
    });
}

function renderStatGuidePopup() {
    const list = document.getElementById('statGuideList');
    if (!list || typeof STAT_GUIDE === 'undefined') return;
    list.innerHTML = Object.values(STAT_GUIDE).map(g =>
        `<div class="stat-guide-row">
            <div class="stat-guide-label">${g.emoji} ${g.label}</div>
            <div class="stat-guide-desc">${g.desc}</div>
        </div>`
    ).join('');
}

function actionStatGuide() {
    renderStatGuidePopup();
    document.getElementById('statGuidePopup')?.classList.add('active');
}

function renderInventoryPopup() {
    ensureGearState();
    const list = document.getElementById('inventoryList');
    const summary = document.getElementById('inventorySummary');
    const slotsEl = document.getElementById('gearSlotsGrid');
    if (!list) return;

    const items = G.inventory || [];
    const legend = G.legendaryMaterials || [];
    const refined = G.refinedLegendary || [];
    const gearBonuses = typeof getGearBonuses === 'function' ? getGearBonuses() : null;
    const matCount = Object.values(G.materials || {}).reduce((s, n) => s + n, 0);
    const gearCount = typeof getGearBagCount === 'function' ? getGearBagCount() : 0;
    const equippedCount = GEAR_SLOT_IDS.filter(s => G.equipment[s]).length;

    if (summary) {
        const resonance = typeof getPathResonanceLabel === 'function' ? getPathResonanceLabel() : '';
        summary.textContent = `${gearCount} in bag · ${equippedCount} equipped · ${matCount} materials · ${items.length} curios · ${legend.length} legendary`
            + (resonance ? ` · ${resonance} resonance` : '');
    }

    const bonusPanel = document.getElementById('gearBonusPanel');
    if (bonusPanel && typeof formatGearBonusPanelHtml === 'function') {
        bonusPanel.innerHTML = formatGearBonusPanelHtml();
    }

    const setRows = typeof getActiveGearSetsDisplay === 'function' ? getActiveGearSetsDisplay() : [];

    if (slotsEl) {
        slotsEl.innerHTML = (setRows.length ? `<div class="gear-set-panel">${setRows.map(s => {
            const b2 = s.setDef.bonuses?.[2] ? '2pc ✓' : '';
            const b3 = s.setDef.bonuses?.[3] ? (s.active3 ? '3pc ✓' : '3pc') : '';
            return `<span class="gear-set-tag${s.active2 ? ' active' : ''}">${s.setDef.emoji} ${s.setDef.name} ${s.count}/${Object.values(GEAR_ITEMS).filter(g => g.gearSet === s.setDef.id).length} ${b2} ${b3}</span>`;
        }).join('')}</div>` : '')
        + GEAR_SLOT_IDS.map(slot => {
            const inst = typeof getEquippedInstance === 'function' ? getEquippedInstance(slot) : null;
            const def = inst ? getInstanceDef(inst) : null;
            const label = GEAR_SLOT_LABELS[slot] || slot;
            const resonance = def ? formatGearResonanceLine(def) : '';
            const aff = inst ? formatAffixLine(inst) : '';
            const dur = inst ? formatDurabilityLine(inst) : '';
            const repairCost = inst ? getRepairCost(inst) : null;
            return `<div class="gear-slot-card${def ? ' equipped' : ''}">
                <div class="gear-slot-label">${label}</div>
                <div class="gear-slot-item">${def ? `${def.emoji} ${formatInstanceName(inst)}` : '— Empty —'}</div>
                ${aff ? `<div class="gear-slot-aff">${aff}</div>` : ''}
                ${resonance ? `<div class="gear-slot-res">${getPathResonanceLabel()} resonance: ${resonance}</div>` : ''}
                ${dur}
                <div class="gear-slot-actions">
                    ${def ? `<button type="button" class="gear-slot-btn" data-gear-unequip="${slot}">Unequip</button>` : ''}
                    ${repairCost ? `<button type="button" class="gear-slot-btn gear-repair-btn" data-gear-repair="${inst.uid}">Repair · ${repairCost.months}mo · ${repairCost.stones}💎</button>` : ''}
                </div>
            </div>`;
        }).join('');
        slotsEl.querySelectorAll('[data-gear-unequip]').forEach(btn => {
            btn.onclick = function() {
                const result = unequipGear(this.dataset.gearUnequip);
                if (result.message) addLog(`🎒 ${result.message}`);
                renderInventoryPopup();
                fullRender();
            };
        });
        slotsEl.querySelectorAll('[data-gear-repair]').forEach(btn => {
            btn.onclick = function() {
                const result = repairGear(this.dataset.gearRepair);
                if (result.message) logTimedResult(result);
                renderInventoryPopup();
                fullRender();
            };
        });
    }

    let html = '';

    const matEntries = Object.entries(G.materials || {}).filter(([, qty]) => qty > 0);
    if (matEntries.length) {
        html += `<div class="inventory-section-title inventory-section-owned sticky-section">⛏️ Your Materials <span class="section-badge owned-badge">${matCount} total</span></div>`;
        html += `<div class="inventory-owned-grid">`;
        html += matEntries.map(([matId, qty]) => {
            const mat = CRAFT_MATERIALS[matId];
            return `<div class="inventory-mat-chip"><span class="mat-chip-name">${mat?.emoji || '◆'} ${mat?.name || matId}</span><span class="mat-chip-qty">×${qty}</span></div>`;
        }).join('');
        html += `</div>`;
    }

    if (typeof getCraftableRecipes === 'function') {
        const recipes = getCraftableRecipes();
        const ready = recipes.filter(({ id }) => canCraftGear(id).ok);
        const blocked = recipes.filter(({ id }) => !canCraftGear(id).ok);
        if (ready.length) {
            html += `<div class="inventory-section-title inventory-section-craft sticky-section">✅ Ready to Craft <span class="section-badge craft-ready-badge">${ready.length}</span></div>`;
            html += ready.map(({ id, def, recipe }) =>
                `<div class="popup-item inventory-row gear-craft-row craft-ready" data-craft-gear="${id}" style="cursor:pointer;">
                    <div class="name">${def.emoji} ${def.name} <span class="gear-tier">T${recipe.tier}</span> <span class="craft-status ready">CRAFT NOW</span></div>
                    <div class="desc">${def.desc}</div>
                    <div class="desc gear-recipe-meta">${recipe.months} mo · ${recipe.stones} stones · ${formatRecipeMaterials(recipe)}</div>
                </div>`
            ).join('');
        }
        if (blocked.length) {
            html += `<div class="inventory-section-title inventory-section-needs sticky-section">🔨 Recipes (need materials) <span class="section-badge needs-badge">${blocked.length}</span></div>`;
            html += blocked.map(({ id, def, recipe }) => {
                const check = canCraftGear(id);
                return `<div class="popup-item inventory-row gear-craft-row needs-materials" title="${escapeAttr(check.reason || '')}">
                    <div class="name">${def.emoji} ${def.name} <span class="gear-tier">T${recipe.tier}</span> <span class="craft-status blocked">MISSING MATS</span></div>
                    <div class="desc">${def.desc}</div>
                    <div class="desc gear-recipe-meta">${recipe.months} mo · ${recipe.stones} stones · ${formatRecipeMaterials(recipe)}</div>
                </div>`;
            }).join('');
        }
    }

    const bagUids = G.gearBag || [];
    if (bagUids.length) {
        html += `<div class="inventory-section-title sticky-section">🎒 Gear Bag <span class="section-badge">${bagUids.length}</span></div>`;
        html += bagUids.map(uid => {
            const inst = getGearInstance(uid);
            const def = getInstanceDef(inst);
            if (!def) return '';
            const res = formatGearResonanceLine(def);
            const compare = compareGearStats(uid, def.slot);
            const compareHtml = formatCompareHtml(compare);
            const repairCost = getRepairCost(inst);
            return `<div class="popup-item inventory-row gear-row">
                <div class="name">${def.emoji} ${formatInstanceName(inst)}</div>
                <div class="desc">${def.desc}${inst.affixes?.length ? `<br><span class="gear-aff-line">Affixes: ${formatAffixLine(inst)}</span>` : ''}${res ? `<br><span class="gear-res-line">${getPathResonanceLabel()} resonance: ${res}</span>` : ''}<br>${formatDurabilityLine(inst)}</div>
                <div class="gear-compare-line">${compareHtml}</div>
                <div class="gear-row-actions">
                    <button type="button" class="gear-equip-btn" data-gear-equip="${uid}">Equip</button>
                    ${repairCost ? `<button type="button" class="gear-repair-btn" data-gear-repair-bag="${uid}">Repair</button>` : ''}
                </div>
            </div>`;
        }).join('');
    }

    if (items.length > 0) {
        html += `<div class="inventory-section-title">📦 Clues &amp; Curios</div>`;
        html += items.map(name =>
            `<div class="popup-item inventory-row"><span class="name">${name}</span><span class="desc">Forbidden clue or exploration find</span></div>`
        ).join('');
    }
    if (legend.length > 0) {
        html += `<div class="inventory-section-title">🏆 Legendary Materials</div>`;
        html += legend.map(name => {
            const recipe = LEGENDARY_REFINEMENTS[name];
            const done = refined.includes(name);
            let desc = recipe ? `Refine at Sect Hall · ${recipe.months} months, ${recipe.stones} stones` : 'Rare treasure';
            if (done) desc = 'Refined — bonus claimed';
            return `<div class="popup-item inventory-row${done ? ' refined' : ''}"><span class="name">${name}</span><span class="desc">${desc}</span></div>`;
        }).join('');
    }
    if (!html) {
        html = `<div class="popup-empty">Explore for materials, forge gear below, or clear forbidden grounds for treasures.</div>`;
    }
    list.innerHTML = html;

    list.querySelectorAll('[data-gear-equip]').forEach(btn => {
        btn.onclick = function() {
            const result = equipGear(this.dataset.gearEquip);
            if (result.message) addLog(`🎒 ${result.message}`);
            renderInventoryPopup();
            fullRender();
        };
    });
    list.querySelectorAll('[data-gear-repair-bag]').forEach(btn => {
        btn.onclick = function() {
            const result = repairGear(this.dataset.gearRepairBag);
            if (result.message) logTimedResult(result);
            renderInventoryPopup();
            fullRender();
        };
    });
    list.querySelectorAll('[data-craft-gear]').forEach(row => {
        row.onclick = function() {
            craftGear(this.dataset.craftGear);
        };
    });
}

function renderForbiddenPopup() {
    ensureForbiddenState();
    const list = document.getElementById('forbiddenList');
    const summary = document.getElementById('forbiddenSummary');
    const hint = document.getElementById('forbiddenHint');
    if (!list) return;

    const discovered = forbiddenDiscoveredCount();
    const cleared = forbiddenClearedCount();
    if (summary) summary.textContent = `${discovered}/7 discovered · ${cleared}/7 cleared`;

    const zone = ZONES[currentZone];
    const zoneGrounds = groundsInZone(currentZone);
    if (hint) {
        if (G.realmIdx < FORBIDDEN_BALANCE.searchRealmMin) {
            hint.textContent = 'Reach Core Formation to search for forbidden legends.';
        } else if (zoneGrounds.length === 0) {
            hint.textContent = `No forbidden grounds are tied to ${zone ? zone.name : 'this zone'}. Travel elsewhere.`;
        } else {
            hint.textContent = `In ${zone.name}: Search for clues, then enter at Nascent Soul when unlocked.`;
        }
    }

    list.innerHTML = Object.entries(FORBIDDEN_GROUNDS).map(([id, g]) => {
        const p = getGroundProgress(id);
        const clues = clueCount(p);
        const cluePips = ['rumor', 'fragment', 'resonance'].map(k =>
            `<span class="clue-pip${p[k] ? ' found' : ''}" title="${k}"></span>`
        ).join('');

        let status = 'Unknown';
        if (p.cleared && FORBIDDEN_BALANCE.repeatableTrials) status = '✓ Cleared · Replayable';
        else if (p.cleared) status = '✓ Cleared';
        else if (p.unlocked) status = 'Ready to enter';
        else if (clues > 0) status = `Clues ${clues}/3`;

        const zoneName = ZONES[g.zone] ? ZONES[g.zone].name : g.zone;
        const canEnter = p.unlocked && g.implemented && (!p.cleared || FORBIDDEN_BALANCE.repeatableTrials);
        const enterLabel = p.cleared && FORBIDDEN_BALANCE.repeatableTrials ? 'Enter Again' : 'Enter';
        const enterBtn = canEnter
            ? `<button type="button" class="forbidden-enter-btn" data-enter="${id}">${enterLabel}</button>`
            : (!g.implemented && clues > 0 ? `<span class="forbidden-soon">Coming soon</span>` : '');

        return `<div class="forbidden-row">
            <div class="forbidden-row-head">
                <span>${g.emoji} ${g.name}</span>
                <span class="forbidden-status">${status}</span>
            </div>
            <div class="forbidden-row-meta">${zoneName} · ${cluePips}</div>
            ${enterBtn}
        </div>`;
    }).join('');

    list.querySelectorAll('[data-enter]').forEach(btn => {
        btn.addEventListener('click', function() {
            enterForbiddenGround(this.dataset.enter);
        });
    });
}

function renderTutorialLogPopup() {
    const list = document.getElementById('tutorialLogList');
    if (!list || typeof getTutorialLogEntries !== 'function') return;

    const entries = getTutorialLogEntries();
    const doneCount = entries.filter(e => e.completed).length;

    const summary = document.getElementById('tutorialLogSummary');
    if (summary) summary.textContent = `${doneCount}/${entries.length} lessons learned`;

    list.innerHTML = entries.map(entry => {
        const status = entry.completed ? '✓' : '○';
        const cls = entry.completed ? 'tutorial-log-done' : 'tutorial-log-pending';
        const when = entry.completedMonths != null ? ` · ${formatYears(entry.completedMonths)}` : '';
        return `<button type="button" class="tutorial-log-item ${cls}" data-tutorial-id="${entry.id}">
            <span class="tutorial-log-status">${status}</span>
            <span class="tutorial-log-label">${entry.def.emoji} ${entry.def.title}${when}</span>
        </button>`;
    }).join('');

    list.querySelectorAll('.tutorial-log-item').forEach(btn => {
        btn.onclick = function() {
            const id = this.dataset.tutorialId;
            closeTutorialLog();
            if (typeof showTutorialPopup === 'function') showTutorialPopup(id, true);
        };
    });
}

function renderQuestJournalPopup(tabId) {
    tabId = tabId || window._journalTab || 'all';
    window._journalTab = tabId;
    const list = document.getElementById('questJournalList');
    const hint = document.getElementById('questJournalHint');
    if (!list) return;

    document.querySelectorAll('#questJournalTabs .journal-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.journalTab === tabId);
    });

    if (tabId === 'ancient' && typeof getSealedSitesChronicleSummary === 'function') {
        const summary = getSealedSitesChronicleSummary();
        const statusLabel = { hidden: 'Undiscovered', revealed: 'Entrance found', unsealed: 'Unsealed' };
        if (hint) {
            hint.textContent = `${summary.clueCount} clues · ${summary.unsealedCount}/5 unsealed${summary.penalty ? ` · −${summary.penalty}% search competition` : ''}`;
        }
        let html = '<div class="sealed-sites-grid">';
        summary.sites.forEach(site => {
            const parent = ZONES[site.parentZone]?.name || site.parentZone;
            html += `<div class="sealed-site-card status-${site.status}">
                <div class="sealed-site-head">${site.emoji} ${site.name}</div>
                <div class="sealed-site-meta">${parent} · ${statusLabel[site.status] || site.status}${site.hasClue ? ' · 📜 clue' : ''}</div>
                ${site.ancientName ? `<div class="sealed-site-ancient">${site.status === 'unsealed' ? '✨' : '🔒'} ${site.ancientName}${site.bargain ? ` · ${site.bargain === 'accept' ? 'honored' : 'plundered'}` : ''}</div>` : ''}
            </div>`;
        });
        html += '</div>';
        const chronicle = (G.ancients?.chronicle || []).slice(0, 16);
        if (chronicle.length) {
            html += '<div class="sealed-chronicle-title">Site Log</div>';
            html += chronicle.map(e => `<div class="quest-journal-entry journal-done">
                <div class="quest-journal-title">${e.title}</div>
                <div class="quest-journal-meta">${e.status || 'logged'}${e.ageLabel ? ` · ${e.ageLabel}` : ''}</div>
                ${e.text ? `<div class="quest-journal-objective">${e.text}</div>` : ''}
            </div>`).join('');
        } else {
            html += '<p class="quest-journal-empty">No sealed-site events yet — explore, speak with NPCs, and search the wilds.</p>';
        }
        list.innerHTML = html;
        return;
    }

    if (tabId === 'faction' && typeof getZoneFactionMechanic === 'function') {
        if (hint) hint.textContent = 'Reputation with the Azure Sky\'s power structures.';
        let html = '';
        Object.values(ZONE_FACTION_MECHANICS).forEach(mech => {
            if (!mech?.implemented) return;
            html += `<div class="factions-mechanic" style="margin-bottom:10px;">${mech.emoji} <strong>${ZONES[mech.zoneId]?.name || mech.zoneId}</strong> — ${mech.powerName}</div>`;
            if (typeof renderFactionMechanicBanner === 'function') html += renderFactionMechanicBanner(mech.zoneId);
            mech.factionIds.forEach(fid => {
                const def = FACTION_DEFINITIONS[fid];
                if (!def) return;
                const tier = typeof getFactionTier === 'function' ? getFactionTier(fid) : { emoji: '', label: '' };
                const rep = typeof getFactionRep === 'function' ? getFactionRep(fid) : 0;
                html += `<div class="quest-journal-entry journal-done">
                    <div class="quest-journal-title">${def.emoji} ${def.name}</div>
                    <div class="quest-journal-meta">${tier.emoji} ${tier.label} · ${rep} rep</div>
                </div>`;
            });
        });
        list.innerHTML = html || '<p class="quest-journal-empty">No faction standing yet — explore the Azure Sky Continent.</p>';
        return;
    }

    if (tabId === 'faction-chronicle' && typeof getFactionChronicleSummary === 'function') {
        const summary = getFactionChronicleSummary();
        if (hint) {
            hint.textContent = `${summary.allied} allied · ${summary.pacts} sect pacts · ${summary.eventCount} events logged`;
        }
        let html = '';
        if (summary.highlights.length) {
            html += '<div class="faction-chronicle-highlights">';
            summary.highlights.forEach(h => {
                html += `<span class="faction-chronicle-chip">${h.emoji} ${h.label}</span>`;
            });
            html += '</div>';
        }
        if (summary.zoneStandings.length) {
            html += '<div class="faction-chronicle-zones">';
            summary.zoneStandings.forEach(z => {
                const zoneName = ZONES[z.zoneId]?.name || z.zoneId;
                html += `<div class="faction-chronicle-zone-card">
                    <div class="faction-chronicle-zone-head">${z.emoji} ${zoneName}</div>
                    <div class="faction-chronicle-zone-meta">${z.label} · strongest: ${z.topFaction} (${z.topTier}, ${z.topRep} rep)</div>
                </div>`;
            });
            html += '</div>';
        }
        const chronicle = (G.factions?.chronicle || []).slice(0, 20);
        if (chronicle.length) {
            html += '<div class="faction-chronicle-title">Political Log</div>';
            html += chronicle.map(e => {
                const zoneName = e.zoneId && ZONES[e.zoneId] ? ZONES[e.zoneId].name : '';
                const catLabel = e.category ? e.category.charAt(0).toUpperCase() + e.category.slice(1) : '';
                return `<div class="quest-journal-entry journal-done faction-chronicle-entry cat-${e.category || 'logged'}">
                    <div class="quest-journal-title">${e.emoji || '📜'} ${e.title}</div>
                    <div class="quest-journal-meta">${catLabel}${e.status ? ` · ${e.status}` : ''}${e.ageLabel ? ` · ${e.ageLabel}` : ''}${zoneName ? ` · ${zoneName}` : ''}</div>
                    ${e.text ? `<div class="quest-journal-objective">${e.text}</div>` : ''}
                </div>`;
            }).join('');
        } else {
            html += '<p class="quest-journal-empty">No political events yet — earn reputation, broker treaties, and shape the continent\'s fate.</p>';
        }
        list.innerHTML = html;
        return;
    }

    const entries = typeof getQuestJournalEntries === 'function' ? getQuestJournalEntries() : [];
    const filtered = tabId === 'all' ? entries : entries.filter(e => {
        if (tabId === 'active') return e.status === 'active';
        return e.kind === tabId || (tabId === 'arc' && e.kind === 'legacy');
    });
    const legacy = G.legacyChain?.unlocked ? ' · 🌟 Legacy chain unlocked' : '';
    const chainCount = G.legacyChain?.completedArcIds?.length || 0;
    if (hint) {
        hint.textContent = `${chainCount} arcs logged${legacy} · ${G.disciples?.length || 0} disciples may assign sect duties.`;
    }
    if (!filtered.length) {
        list.innerHTML = '<p class="quest-journal-empty">Nothing in this chronicle tab yet.</p>';
        return;
    }
    list.innerHTML = filtered.slice(0, 24).map(e => {
        const age = e.ageLabel || (e.months != null && typeof formatYears === 'function' ? formatYears(e.months) : '');
        const statusCls = e.status === 'complete' || e.status === 'unlocked' || e.status === 'logged' ? 'journal-done' : e.status === 'failed' ? 'journal-failed' : 'journal-active';
        const stage = e.stageName ? ` · ${e.stageName}` : e.stage ? ` · Stage ${e.stage}` : '';
        const kindLabel = e.kind === 'ancient' ? 'sealed site' : (e.kind || 'quest');
        return `<div class="quest-journal-entry ${statusCls}">
            <div class="quest-journal-title">${e.title}${stage}</div>
            <div class="quest-journal-meta">${kindLabel}${age ? ` · ${age}` : ''}${e.resolution ? ` · ${e.resolution}` : ''}</div>
            ${e.objective ? `<div class="quest-journal-objective">${e.objective}</div>` : ''}
        </div>`;
    }).join('');
}

function openQuestJournal() {
    if (typeof renderQuestJournalPopup === 'function') renderQuestJournalPopup(window._journalTab || 'all');
    document.getElementById('questJournalPopup')?.classList.add('active');
}

function showCombatVictoryPopup(opts) {
    opts = opts || {};
    const popup = document.getElementById('combatRewardPopup');
    if (!popup) return;
    document.getElementById('combatRewardTitle').textContent = opts.title || '⚔️ Victory';
    const sub = document.getElementById('combatRewardSub');
    if (sub) {
        sub.textContent = opts.subtitle || (opts.enemyName ? `You defeated ${opts.enemyName}.` : 'Combat won.');
    }
    const list = document.getElementById('combatRewardList');
    if (list) {
        const lines = opts.rewards || [];
        list.innerHTML = lines.length
            ? lines.map(r => `<li>${r}</li>`).join('')
            : '<li class="muted">Victory secured.</li>';
    }
    popup.classList.add('active');
}

function closeCombatRewardPopup() {
    document.getElementById('combatRewardPopup')?.classList.remove('active');
}

function renderQuestLogPanel() {
    const list = document.getElementById('questLogList');
    if (!list) return;
    const getQuests = typeof getRecentQuests === 'function' ? getRecentQuests : getRecentNpcQuests;
    if (typeof getQuests !== 'function') return;

    const quests = getQuests(6);
    if (!quests.length) {
        list.innerHTML = '<p class="quest-log-empty">No active quests.</p>';
        return;
    }

    list.innerHTML = quests.map(q => {
        const statusClass = q.status === 'active' ? 'quest-active' : q.status === 'complete' ? 'quest-complete' : 'quest-failed';
        const icon = q.status === 'complete' ? '✓' : q.status === 'failed' ? '✗' : (q.typeEmoji || '◆');
        const zoneName = ZONES[q.zoneHint]?.name || q.zoneHint || '';
        const stageLine = q.stageName ? `${q.stageName}` : '';
        const meta = [q.giverName, zoneName, stageLine].filter(Boolean).join(' · ');
        const hint = q.status === 'active' && typeof getQuestProgressHint === 'function' ? getQuestProgressHint(q) : '';
        const hintLine = hint ? `<div class="quest-log-hint">💡 ${hint}</div>` : '';
        return `<button type="button" class="quest-log-item ${statusClass}" data-quest-id="${q.id}" title="${q.objective}">
            <div class="quest-log-title">${icon} ${q.title}</div>
            <div class="quest-log-meta">${meta}${q.typeLabel ? ` · ${q.typeLabel}` : ''}</div>
            <div class="quest-log-objective">${q.objective}</div>
            ${hintLine}
        </button>`;
    }).join('');

    list.querySelectorAll('.quest-log-item').forEach(btn => {
        btn.onclick = function() {
            if (typeof focusNpcQuest === 'function') focusNpcQuest(this.dataset.questId);
        };
    });
}

function renderNpcPresencePanel() {
    const list = document.getElementById('npcPresenceList');
    if (!list || typeof getPresentNpcCards !== 'function') return;

    const cards = getPresentNpcCards(G.currentZone || currentZone);
    if (!cards.length) {
        const hint = getNpcPresenceHint();
        list.innerHTML = hint
            ? `<p class="npc-presence-empty">No one here right now.</p><p class="npc-presence-hint">${hint}</p>`
            : '<p class="npc-presence-empty">No one notable nearby.</p>';
        return;
    }

    list.innerHTML = cards.map(c => {
        const famLine = c.met && c.familiarity !== 'Stranger no longer'
            ? `<div class="npc-presence-fam">${c.familiarity}</div>`
            : '';
        const personalityLine = c.personalities
            ? `<div class="npc-presence-personality">${c.personalities}</div>`
            : '';
        return `<button type="button" class="npc-presence-card" data-npc-id="${c.id}" title="Speak with ${c.name}">
            <div class="npc-presence-head">${c.emoji} ${c.name}</div>
            <div class="npc-presence-title">${c.occupation}</div>
            ${personalityLine}
            <div class="npc-presence-meta">
                <span class="npc-disposition disposition-${c.dispositionMood}">${c.disposition}</span>
                <span class="npc-strength">${c.strength}</span>
            </div>
            ${famLine}
        </button>`;
    }).join('');

    list.querySelectorAll('.npc-presence-card').forEach(btn => {
        btn.onclick = function() {
            if (typeof actionBlocked === 'function' && actionBlocked()) return;
            openNpcPopup(this.dataset.npcId);
        };
    });
}

function updateMarketButton() {
    const btn = document.getElementById('btnMarket');
    if (!btn) return;
    const open = isMerchantZone();
    const loc = typeof getCurrentLocationDef === 'function' ? getCurrentLocationDef() : null;
    btn.disabled = !open;
    btn.title = open
        ? `${ACTION_MONTHS.market || 2} months · buy techniques at ${loc?.name || 'the market'}`
        : 'Walk to Celestial Market (Heartlands) or Tide Harbor (Jade)';
    btn.style.opacity = open ? '' : '0.45';
}

function renderMerchantPopup() {
    const list = document.getElementById('merchantList');
    const title = document.getElementById('merchantTitle');
    const hint = document.getElementById('merchantHint');
    if (!list) return;
    const zoneId = typeof getMerchantCatalogKey === 'function' ? getMerchantCatalogKey() : (typeof getActiveZoneId === 'function' ? getActiveZoneId() : (G.currentZone || currentZone));
    const catalog = zoneId ? MERCHANT_CATALOG[zoneId] : null;
    if (!catalog) {
        list.innerHTML = `<div class="popup-empty">No market here.</div>`;
        return;
    }
    if (title) title.textContent = catalog.name;
    if (hint) {
        const discount = typeof getFactionMarketPriceMult === 'function' ? getFactionMarketPriceMult(zoneId) : 1;
        const discountNote = discount < 1 ? ` · 🪷 ${Math.round((1 - discount) * 100)}% faction discount` : '';
        hint.textContent = `${G.stones} Stones · ${catalog.name}${discountNote} · Click an item to buy`;
    }

    const priceMult = typeof getFactionMarketPriceMult === 'function' ? getFactionMarketPriceMult(zoneId) : 1;
    let html = catalog.stock.map(item => {
        const template = TECHNIQUE_POOL.find(t => t.name === item.technique);
        const owned = G.techniques.some(t => t.name === item.technique);
        const locked = G.realmIdx < item.reqRealm;
        const factionLocked = typeof isMarketTechniqueUnlocked === 'function' && !isMarketTechniqueUnlocked(item.technique, zoneId);
        const finalPrice = Math.max(1, Math.floor(item.price * priceMult));
        const canBuy = !owned && !locked && !factionLocked && G.stones >= finalPrice;
        const realmName = PATHS[G.path].realms[item.reqRealm] || `Realm ${item.reqRealm + 1}`;
        let status = owned ? 'Known' : locked ? `Need ${realmName}` : factionLocked
            ? (typeof getMarketTechniqueLockReason === 'function' ? getMarketTechniqueLockReason(item.technique, zoneId) : 'Faction locked')
            : `${finalPrice} Stones`;
        if (!owned && !locked && finalPrice < item.price) status += ` (was ${item.price})`;
        if (canBuy) status += ' · Click to buy';
        return `<div class="popup-item merchant-row${owned ? ' owned' : ''}${canBuy ? ' can-buy' : ''}" data-buy="${escapeAttr(item.technique)}" style="${canBuy ? 'cursor:pointer;' : 'opacity:0.65;'}">
            <div class="name">${item.technique}</div>
            <div class="desc">${template ? template.desc : ''} · ${template ? template.rarity : ''}</div>
            <div class="desc" style="margin-top:4px;color:${canBuy ? '#d4a860' : '#a09080'};">${status}</div>
        </div>`;
    }).join('');

    if (catalog.pills?.length) {
        html += `<div class="tech-group-header" style="margin-top:12px;">💊 Pills</div>`;
        html += catalog.pills.map(item => {
            const pill = PILL_TYPES[item.id];
            if (!pill) return '';
            const locked = item.reqRealm != null && G.realmIdx < item.reqRealm;
            const canBuy = !locked && G.stones >= item.price;
            const status = (locked ? `Need ${PATHS[G.path].realms[item.reqRealm]}` : `${item.price} Stones · ×${item.qty || 1}`)
                + (canBuy ? ' · Click to buy' : '');
            return `<div class="popup-item merchant-row${canBuy ? ' can-buy' : ''}" data-buy-pill="${item.id}" style="${canBuy ? 'cursor:pointer;' : 'opacity:0.65;'}">
                <div class="name">${pill.emoji} ${pill.name}</div>
                <div class="desc">${pill.desc}</div>
                <div class="desc" style="margin-top:4px;color:${canBuy ? '#d4a860' : '#a09080'};">${status}</div>
            </div>`;
        }).join('');
    }

    const gearStock = MERCHANT_GEAR_STOCK?.[zoneId];
    if (gearStock?.length) {
        html += `<div class="tech-group-header" style="margin-top:12px;">⚔️ Gear</div>`;
        html += gearStock.map(item => {
            const def = GEAR_ITEMS[item.gearId];
            if (!def) return '';
            const locked = item.reqRealm != null && G.realmIdx < item.reqRealm;
            const canBuy = !locked && G.stones >= item.price;
            const realmName = PATHS[G.path].realms[item.reqRealm] || `Realm ${item.reqRealm + 1}`;
            const status = (locked ? `Need ${realmName}` : `${item.price} Stones`)
                + (canBuy ? ' · Click to buy' : '');
            return `<div class="popup-item merchant-row${canBuy ? ' can-buy' : ''}" data-buy-gear="${item.gearId}" style="${canBuy ? 'cursor:pointer;' : 'opacity:0.65;'}">
                <div class="name">${def.emoji} ${def.name}</div>
                <div class="desc">${def.desc} · T${def.tier || 1}</div>
                <div class="desc" style="margin-top:4px;color:${canBuy ? '#d4a860' : '#a09080'};">${status}</div>
            </div>`;
        }).join('');
    }

    list.innerHTML = html;

    list.querySelectorAll('[data-buy]').forEach(row => {
        row.addEventListener('click', function() {
            buyTechnique(this.dataset.buy);
        });
    });
    list.querySelectorAll('[data-buy-pill]').forEach(row => {
        row.addEventListener('click', function() {
            buyPill(this.dataset.buyPill);
        });
    });
    list.querySelectorAll('[data-buy-gear]').forEach(row => {
        row.addEventListener('click', function() {
            const result = buyMerchantGear(this.dataset.buyGear);
            if (result.message) logTimedResult(result);
            renderMerchantPopup();
            fullRender();
        });
    });
}