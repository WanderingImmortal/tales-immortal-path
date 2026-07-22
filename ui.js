// ============================================
// UI.JS — Rendering, popups, display updates
// ============================================

// Overlays where time-costing choices are common — show a compact lifespan chip.
const OVERLAY_LIFESPAN_IDS = [
    'cultivationHubOverlay',
    'qiChamberOverlay',
    'bodyChamberOverlay',
    'soulChamberOverlay',
    'alchemyChamberOverlay',
    'forgeChamberOverlay',
    'consolidatePopup',
    'breakthroughPopup',
    'meridianPopup',
    'tribulationOverlay'
];

function getLifespanUrgencyClass() {
    if (typeof isImmortal === 'function' && isImmortal()) return 'immortal';
    const remaining = typeof getYearsRemaining === 'function' ? getYearsRemaining() : 0;
    if (remaining <= 10) return 'lifespan-critical';
    if (remaining <= 25) return 'lifespan-low';
    return '';
}

function isOverlayLifespanVisible() {
    return OVERLAY_LIFESPAN_IDS.some(id => document.getElementById(id)?.classList.contains('active'));
}

function renderOverlayLifespanChip() {
    const chip = document.getElementById('overlayLifespanChip');
    const textEl = document.getElementById('overlayLifespanText');
    if (!chip || !textEl) return;

    if (!isOverlayLifespanVisible()) {
        chip.hidden = true;
        return;
    }

    chip.hidden = false;
    const urgency = getLifespanUrgencyClass();
    chip.className = 'overlay-lifespan-chip' + (urgency ? ` ${urgency}` : '');

    const age = typeof formatYears === 'function' ? formatYears(G.ageMonths) : `${G.ageMonths || 0}m`;
    if (urgency === 'immortal') {
        textEl.textContent = `Age ${age} · Immortal`;
        return;
    }
    const remaining = typeof getYearsRemaining === 'function' ? getYearsRemaining() : 0;
    textEl.textContent = `Age ${age} · ${remaining}y left`;
}

function renderStatus() {
    const realm = getRealm();
    const title = getTitle();
    const fameLevel = getFameLevel();
    const openCount = getMeridianOpenCount();
    document.getElementById('realmDisplay').textContent = realm + (G.perfectCultivation ? ' 🌟' : '');
    document.getElementById('titleDisplay').textContent = '— ' + title;
    const trackStrip = document.getElementById('trackStrip');
    if (trackStrip && typeof getDantianRealm === 'function') {
        const embryoBadge = typeof hasSoulEmbryo === 'function' && hasSoulEmbryo()
            ? (typeof getSoulMaturityLabel === 'function' && getSoulMaturityLabel()
                ? ` · ✨ ${getSoulMaturityLabel()}`
                : ' · ✨ soul born')
            : '';
        const focus = typeof getFocusTrack === 'function' ? getFocusTrack() : 'dantian';
        const mark = t => t === focus ? '▸' : '·';
        trackStrip.textContent = `${mark('dantian')}⚡ ${getDantianRealm()}  ${mark('vessel')}💪 ${getVesselRealm()}  ${mark('spirit')}🧠 ${getSpiritRealm()}${embryoBadge}`;
    }
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
            alignEl.title = 'Click to open Dao Alignment panel';
        }
        if (alignStatEl) {
            alignStatEl.textContent = alignText;
            alignStatEl.className = 'value ' + tierClass;
        }
    }
    document.getElementById('sectNameDisplay').textContent = typeof getSectDisplayName === 'function'
        ? getSectDisplayName() : (G.sectName || 'None');
    const traits = typeof getPlayerTraits === 'function' ? getPlayerTraits() : (G.trait ? [G.trait] : []);
    const traitLabel = traits.length
        ? traits.map(t => `${t.emoji || '🎭'} ${t.name}`).join(' · ')
        : '—';
    const traitTip = traits.map(t => `${t.flavor || t.desc}\n${t.upside || ''}\n${t.downside || ''}`).join('\n\n');
    const talentDef = typeof getTalentDef === 'function' ? getTalentDef() : G.talent;
    const traitDisplay = document.getElementById('traitDisplay');
    if (traitDisplay) {
        const talentPrefix = talentDef ? `🌱 ${talentDef.name}` : '';
        traitDisplay.textContent = talentPrefix ? `${talentPrefix} · ${traitLabel}` : traitLabel;
        traitDisplay.title = [talentDef
            ? `Root: ${talentDef.name}${talentDef.elements?.length ? ' (' + talentDef.elements.join(', ') + ')' : talentDef.element ? ' (' + talentDef.element + ')' : ''}\nInnate height: ${talentDef.innateHeightLabel || '—'}`
            : '', traitTip].filter(Boolean).join('\n\n');
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
    if (typeof getFoundationPlayerLabel === 'function') {
        const foundationEl = document.getElementById('foundationDisplay');
        if (foundationEl) {
            const grade = typeof getFoundationGrade === 'function' ? getFoundationGrade() : null;
            foundationEl.textContent = getFoundationPlayerLabel();
            foundationEl.className = 'value' + (grade?.id ? ` foundation-grade-${grade.id}` : '');
            const foundationItem = foundationEl.closest('.stat-item');
            if (foundationItem && typeof getFoundationPlayerTooltip === 'function') {
                foundationItem.title = getFoundationPlayerTooltip();
            }
        }
    } else if (typeof getCultivationPillarSummary === 'function') {
        const fs = getCultivationPillarSummary();
        document.getElementById('foundationDisplay').textContent = fs.grade.label;
    } else {
        document.getElementById('foundationDisplay').textContent = getEffectiveFoundation();
    }
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
                if (chip) {
                    const tip = `${guide.emoji} ${guide.label}: ${guide.desc}`;
                    if (typeof setHoverTooltip === 'function') setHoverTooltip(chip, tip);
                    else chip.title = tip;
                }
            }
        });
    }
    const consolidateBtn = document.getElementById('btnConsolidate');
    if (consolidateBtn && typeof isRealmConsolidated === 'function') {
        consolidateBtn.disabled = isRealmConsolidated(G.realmIdx);
        const capstone = typeof getPathCapstone === 'function' ? getPathCapstone() : null;
        const sealGuide = typeof CULTIVATION_ACTION_GUIDE !== 'undefined' ? CULTIVATION_ACTION_GUIDE.sealDantian : null;
        if (capstone) consolidateBtn.textContent = capstone.button;
        const sealTip = isRealmConsolidated(G.realmIdx)
            ? 'This realm is already sealed'
            : (sealGuide?.desc || (capstone ? `${capstone.settledAction} at Settled (80%+) or ${capstone.peakAction} at Peak` : 'Seal realm for Foundation'));
        if (typeof setHoverTooltip === 'function') setHoverTooltip(consolidateBtn, sealTip);
        else consolidateBtn.title = sealTip;
    }
    const cultivateBtn = document.getElementById('btnCultivate');
    if (cultivateBtn) {
        const guide = typeof CULTIVATION_ACTION_GUIDE !== 'undefined' ? CULTIVATION_ACTION_GUIDE.cultivate : null;
        const tip = guide?.desc || 'Choose Qi, Body, or Soul cultivation';
        if (typeof setHoverTooltip === 'function') setHoverTooltip(cultivateBtn, tip);
        else cultivateBtn.title = tip;
    }
    const breakBtn = document.getElementById('btnBreakthrough');
    if (breakBtn) {
        const guide = typeof CULTIVATION_ACTION_GUIDE !== 'undefined' ? CULTIVATION_ACTION_GUIDE.breakthrough : null;
        const chance = typeof getBreakChance === 'function' ? getBreakChance() : null;
        const tip = guide?.desc
            ? `${guide.desc}${chance != null ? ` Current odds: ~${chance}%.` : ''}`
            : breakBtn.getAttribute('title') || '';
        if (typeof setHoverTooltip === 'function') setHoverTooltip(breakBtn, tip);
        else if (tip) breakBtn.title = tip;
    }
    const recuperateBtn = document.getElementById('btnRecuperate');
    if (recuperateBtn) {
        const guide = typeof CULTIVATION_ACTION_GUIDE !== 'undefined' ? CULTIVATION_ACTION_GUIDE.recuperate : null;
        const months = typeof ACTION_MONTHS !== 'undefined' ? ACTION_MONTHS.recuperate : 3;
        const tip = guide?.desc || `Rest ${months} months · heal HP & barrier`;
        if (typeof setHoverTooltip === 'function') setHoverTooltip(recuperateBtn, tip);
        else recuperateBtn.title = tip;
    }
    document.getElementById('discipleCountDisplay').textContent = G.disciples.length;
    document.getElementById('meridianDisplay').textContent = openCount + '/13';
    const tribCountEl = document.getElementById('tribulationCountDisplay');
    if (tribCountEl) tribCountEl.textContent = G.tribulationCount || 0;
    renderTribulationMarksPanel();
    renderTranscendencePerksPanel();
    const physEl = document.getElementById('physiqueDisplay');
    if (physEl) {
        if (typeof getPhysiqueCultivationStatusText === 'function' && isPhysiqueCultivationActive?.()) {
            physEl.textContent = getPhysiqueCultivationStatusText();
        } else {
            physEl.textContent = G.physique ? G.physique.name : 'None';
        }
    }
    const vesselRuleEl = document.getElementById('vesselRuleDisplay');
    if (vesselRuleEl) {
        if (typeof hasVesselRule === 'function' && hasVesselRule()) {
            const def = typeof getActiveVesselRuleDef === 'function' ? getActiveVesselRuleDef() : null;
            const pct = typeof getVesselRuleProgressionPct === 'function' ? Math.round(getVesselRuleProgressionPct()) : 0;
            vesselRuleEl.textContent = def
                ? `${def.emoji} ${def.name} (${pct}%)`
                : 'Sworn';
        } else {
            vesselRuleEl.textContent = '—';
        }
    }
    const intentEl = document.getElementById('intentDisplay');
    const activeIntentUi = typeof getActiveIntent === 'function' ? getActiveIntent() : G.weaponIntent;
    if (intentEl) {
        const track = getIntentTrackForPath('qi');
        if (activeIntentUi) {
            const tier = getIntentTier(activeIntentUi);
            const dormant = typeof isWeaponIntentPathActive === 'function' && !isWeaponIntentPathActive();
            intentEl.textContent = `${track.emoji} ${activeIntentUi.weapon} (${tier.name})${dormant ? ' · dormant' : ''}`;
        } else if (typeof isWeaponIntentPathActive === 'function' && isWeaponIntentPathActive()) {
            intentEl.textContent = 'None';
        } else {
            intentEl.textContent = '—';
        }
    }
    const soulMassEl = document.getElementById('soulMassDisplay');
    if (soulMassEl && typeof getSoulMass === 'function') {
        const hasEmbryo = typeof hasSoulEmbryo === 'function' && hasSoulEmbryo();
        const mass = getSoulMass();
        const latent = typeof getLatentSoulMass === 'function' ? getLatentSoulMass() : 0;
        if (hasEmbryo && mass > 0) {
            const tierLabel = typeof getSoulMassTierLabel === 'function' ? getSoulMassTierLabel() : '';
            const maturity = typeof getSoulMaturityLabel === 'function' ? getSoulMaturityLabel() : '';
            soulMassEl.textContent = `${mass} (${tierLabel})`;
            const weakHint = typeof isInteriorSoulWeak === 'function' && isInteriorSoulWeak() ? ' · thin interior' : '';
            soulMassEl.title = `Active Soul Mass${maturity ? ' · ' + maturity : ''}${weakHint}`;
        } else if (!hasEmbryo && latent > 0) {
            const cap = typeof getLatentMassCap === 'function' ? getLatentMassCap() : 9;
            soulMassEl.textContent = `${latent}/${cap} latent`;
            soulMassEl.title = 'Latent spirit weight — crystallizes at soul birth';
        } else {
            soulMassEl.textContent = '—';
            soulMassEl.title = hasEmbryo
                ? 'Condense spirit in the Soul Palace'
                : 'Condense latent weight in Spirit Foundation';
        }
    }
    const soulVulnEl = document.getElementById('soulVulnHint');
    if (soulVulnEl) {
        const showWeak = typeof isInteriorSoulWeak === 'function' && isInteriorSoulWeak();
        soulVulnEl.classList.toggle('hidden', !showWeak);
        if (showWeak) {
            soulVulnEl.textContent = 'Your interior soul is thin — soul strikes would wound deeply.';
        }
    }
    const daoEl = document.getElementById('daoDisplay');
    if (daoEl) {
        daoEl.textContent = typeof getDaoDisplaySummary === 'function'
            ? getDaoDisplaySummary()
            : 'None';
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
    document.getElementById('sceneFoundation').textContent = typeof getFoundationPlayerLabel === 'function'
        ? getFoundationPlayerLabel()
        : (typeof getFoundationDisplayText === 'function'
            ? getFoundationDisplayText()
            : String(getEffectiveFoundation()));
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
    if (typeof bindRoadEncounterEvents === 'function') bindRoadEncounterEvents();
    if (typeof bindBetrayalAmbushEvents === 'function') bindBetrayalAmbushEvents();
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

    if (G.enemy.intimidateTurns > 0) {
        document.getElementById('enemyName').textContent = G.enemy.name + ' (Shaken)';
    }

    renderEnemyCombatStatus();

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
        if (resText) {
            if (typeof isCombatQiLinked === 'function' && isCombatQiLinked() && typeof getMaxQi === 'function') {
                resText.textContent = `${G.combatResource}/${G.maxCombatResource} · Dantian ${G.qi}/${getMaxQi()}`;
            } else {
                resText.textContent = `${G.combatResource}/${G.maxCombatResource}`;
            }
        }
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

    setCombatInputEnabled(G.combatPhase === 'player');
    if (typeof updateFleeButton === 'function') updateFleeButton();
    renderCombatBonusBar();
    renderCombatLog();
    if (typeof updateVoidStepButton === 'function') updateVoidStepButton();
    if (typeof updateSealBloodButton === 'function') updateSealBloodButton();
    const skillBtn = document.getElementById('cbSkill');
    if (skillBtn && typeof isRuleOfUnnamedActive === 'function' && isRuleOfUnnamedActive() && G.inCombat) {
        skillBtn.title = 'Forms dissipate under your Rule — living motion only.';
    } else if (skillBtn) {
        skillBtn.title = '';
    }
}

function renderEnemyCombatStatus() {
    const row = document.getElementById('enemyStatusRow');
    const tele = document.getElementById('enemyTelegraph');
    if (!row || !G.enemy) return;
    const e = G.enemy;
    const chips = [];
    if (e.element && typeof ENEMY_ELEMENT_ICONS !== 'undefined') {
        const icon = ENEMY_ELEMENT_ICONS[e.element] || '⚔️';
        chips.push(`<span class="enemy-status-chip element-chip" title="Element: ${e.element}">${icon} ${e.element}</span>`);
    }
    (e.affixes || []).forEach(id => {
        const affix = typeof ENEMY_AFFIXES !== 'undefined' ? ENEMY_AFFIXES[id] : null;
        if (affix) chips.push(`<span class="enemy-status-chip affix-chip" title="${affix.desc || affix.label}">${affix.label}</span>`);
    });
    if (e.defending) chips.push('<span class="enemy-status-chip guard-chip">🛡️ Guarding</span>');
    if (typeof isEnemyEnraged === 'function' && isEnemyEnraged(e)) {
        chips.push('<span class="enemy-status-chip enrage-chip">🔥 Enraged</span>');
    }
    if (e.chargeTurns > 0) chips.push('<span class="enemy-status-chip charge-chip">⏳ Charging</span>');
    if (e.traits && e.traits.includes('swarm')) chips.push('<span class="enemy-status-chip swarm-chip">🐾 Swarm</span>');
    if (e.weakness) {
        const weakKeys = Object.entries(e.weakness).filter(([, mult]) => mult > 1).map(([k]) => k);
        if (weakKeys.length) chips.push(`<span class="enemy-status-chip weak-chip" title="Weak to ${weakKeys.join(', ')}">⚡ Weak: ${weakKeys.join('/')}</span>`);
    }
    row.innerHTML = chips.join('');
    row.style.display = chips.length ? 'flex' : 'none';
    if (tele) {
        const action = e.lastAction;
        const showTele = action && action.length > 3;
        tele.textContent = showTele ? action : '';
        tele.style.display = showTele ? 'block' : 'none';
    }
}

function renderCombatBonusBar() {
    const el = document.getElementById('combatBonusBar');
    if (!el) return;
    ensureAffinities();
    const chips = [];
    if (G.combatStatus) {
        const cs = G.combatStatus;
        if (cs.poisonTurns > 0) chips.push(`<span class="combat-bonus-chip debuff-chip" title="Poison damage each turn">☠️ Poison (${cs.poisonTurns})</span>`);
        if (cs.bleedTurns > 0) chips.push(`<span class="combat-bonus-chip debuff-chip" title="Bleed damage each turn">🩸 Bleed (${cs.bleedTurns})</span>`);
        if (cs.slowResourceRegenTurns > 0) chips.push(`<span class="combat-bonus-chip debuff-chip" title="Reduced resource recovery">🐌 Slowed (${cs.slowResourceRegenTurns})</span>`);
    }
    if (typeof isBloodied === 'function' && isBloodied()) {
        chips.push(`<span class="combat-bonus-chip bloodied-chip" title="Rule of Blood — modest combat upside">🩸 Bloodied</span>`);
    }
    if (G.vesselRuleCombat?.bloodSealedTurns > 0) {
        chips.push(`<span class="combat-bonus-chip buff-chip" title="Bleed ticks paused">🩸 Sealed (${G.vesselRuleCombat.bloodSealedTurns})</span>`);
    }
    if (typeof isRuleOfUnnamedActive === 'function' && isRuleOfUnnamedActive() && G.inCombat) {
        const flow = typeof getFlowStacks === 'function' ? getFlowStacks() : (G.vesselRuleCombat?.flowStacks || 0);
        const flowCap = typeof RULE_OF_UNNAMED_BALANCE !== 'undefined' ? RULE_OF_UNNAMED_BALANCE.flowCap : 5;
        chips.push(`<span class="combat-bonus-chip flow-chip" title="Rule of the Unnamed — motion builds rhythm">👊 Flow ${flow}/${flowCap}</span>`);
        if (typeof isStagnationActive === 'function' && isStagnationActive()) {
            chips.push(`<span class="combat-bonus-chip debuff-chip" title="Clinging to forms stiffens motion">👊 Stagnation</span>`);
        }
    }
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
    if (typeof renderActionUnlocks === 'function') renderActionUnlocks();
    if (typeof updateSearchButton === 'function') updateSearchButton();
    if (typeof syncStoryNpcQuests === 'function') syncStoryNpcQuests();
    if (typeof syncStoryQuestLog === 'function') syncStoryQuestLog();
    renderQuestLogPanel();
    renderNpcPresencePanel();
    if (typeof processTutorialQueue === 'function') processTutorialQueue();
    if (typeof refreshTutorialHighlight === 'function') refreshTutorialHighlight();
    renderOverlayLifespanChip();
    const reincBtn = document.getElementById('btnTrueReincarnation');
    if (reincBtn) reincBtn.style.display = (typeof isImmortal === 'function' && isImmortal()) ? '' : 'none';
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
    if (bd.obsoleteMult < 1) multParts.push('Age ×' + bd.obsoleteMult.toFixed(2));
    const intentMatch = typeof getTechniqueIntentMatch === 'function' ? getTechniqueIntentMatch(tech) : null;
    if (intentMatch?.matched && intentMatch.bonus > 0) multParts.push('Intent +' + Math.round(intentMatch.bonus * 100) + '%');
    else if (intentMatch?.warnText) multParts.push('Intent ⚠');
    const multStr = multParts.length ? ' | ' + multParts.join(' · ') : '';
    const tierBadge = `<span class="tech-tier-badge tier-${combatTierId}">${combatTierLabel}</span>`;
    const cultTierLabel = typeof getCultivationTierLabel === 'function'
        ? getCultivationTierLabel(meta.cultivationTier, meta.path)
        : '';
    const cultBadge = cultTierLabel ? `<span class="tech-cultivation-tier">${cultTierLabel}</span>` : '';
    const condensationBadge = meta.school === 'soul_condensation'
        ? '<span class="tech-set-badge">💠 Condensation</span>' : '';
    const gateHint = typeof getSoulCondensationGateHint === 'function'
        ? getSoulCondensationGateHint(TECHNIQUE_POOL.find(t => t.name === tech.name))
        : '';
    const gateLine = gateHint ? ` · <span style="color:#9b8fd4;">${gateHint}</span>` : '';
    const intentHint = typeof getTechniqueIntentHint === 'function'
        ? getTechniqueIntentHint(TECHNIQUE_POOL.find(t => t.name === tech.name))
        : '';
    const intentLine = intentHint ? ` · ${intentHint}` : '';
    const costLine = G.inCombat
        ? `⚔️ ${dmg} dmg | ${cfg.icon} ${combatCost} ${cfg.resource}${canAfford ? '' : ' (insufficient)'}${multStr}`
        : `⚔️ ${dmg} dmg (${scaleHint}) | 💰 ${cost} ${tech.costType} | Uses: ${tech.uses || 0}${multStr}`;
    const affordClass = canAfford ? '' : ' tech-unaffordable';
    const viabilityBadge = typeof getTechniqueViabilityBadge === 'function' ? getTechniqueViabilityBadge(tech) : '';
    return `<div class="popup-item${affordClass}" data-tech="${tech.name}"${canAfford ? '' : ' data-unaffordable="1"'}>
        <div class="name">${pathIcon} ${tech.name} ${viabilityBadge} ${cultBadge} ${condensationBadge} ${tierBadge} ${setBadge} <span style="color:#b8863a;font-size:12px;">[${tier.name}]</span></div>
        <div class="desc">${tech.desc} · ${elemLabel} · ${tech.rarity}${intentLine}${gateLine}${affLine ? ' · ' + affLine : ''}</div>
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
        ? ['fire', 'water', 'ice', 'lightning', 'earth', 'wind', 'void', 'soul', 'blood', 'elemental', 'neutral']
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
        const kitHint = typeof countManualShelfTotal === 'function' && countManualShelfTotal() > 0
            ? ' Open <strong>Inventory</strong> to comprehend manuals in your travel kit.'
            : ' Explore any zone for manuals, or visit a market in the Heartlands / Jade Archipelago.';
        el.innerHTML = `<div class="popup-empty">No techniques comprehended yet.${kitHint}</div>`;
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

function renderPhysiquePanel(containerEl, options) {
    options = options || {};
    const el = typeof containerEl === 'string' ? document.getElementById(containerEl) : containerEl;
    if (!el) return;

    const inChamber = !!options.inChamber;
    const itemClass = inChamber ? 'body-physique-item' : 'popup-item';
    const sectionClass = inChamber ? 'body-physique-section-label' : '';
    const sectionStyle = inChamber ? '' : 'font-size:13px;';

    if (typeof ensurePhysiqueCultivationState === 'function') ensurePhysiqueCultivationState();

    const locked = typeof isActionUnlocked === 'function' && !isActionUnlocked('physique');
    if (locked) {
        const reason = typeof getActionUnlockReason === 'function' ? getActionUnlockReason('physique') : 'Physique cultivation locked.';
        el.innerHTML = `<p class="body-physique-locked">🔒 ${reason}</p>`;
        return;
    }

    const activeProject = isPhysiqueCultivationActive?.();
    const showTrainable = !options.hideTrainable && (!activeProject || !options.skipTrainableWhenActive);

    const refresh = () => {
        if (typeof options.onUpdate === 'function') options.onUpdate();
        else renderPhysiquePanel(el, options);
    };

    let html = '';
    if (inChamber) {
        html += '<div class="body-physique-manage-title">🧬 Physiques</div>';
        html += '<p class="body-physique-manage-hint">Trainable physiques are long-term chamber projects — weak at first, full power when perfected.</p>';
    } else {
        html += '<div style="font-size:12px;color:#a09080;margin-bottom:6px;">Trainable physiques are long-term Body Chamber projects — weak at first, full power when perfected.</div>';
    }

    if (activeProject && options.skipTrainableWhenActive) {
        const status = getPhysiqueCultivationStatusText?.() || '';
        html += `<div class="${itemClass} body-physique-active-note" style="border-color:#9b59b6;margin-bottom:8px;">
            <div class="name">🔮 Active project</div>
            <div class="desc">${status}</div>
            <div class="meta">Use refinement below, or layer work on focus regions.</div>
        </div>`;
    }

    if (showTrainable) {
        html += `<div class="${sectionClass}" style="${sectionStyle}color:#b8863a;margin-top:6px;">━━ Trainable ──</div>`;
        for (const p of TRAINABLE_PHYSIQUES) {
            const pid = p.id || getPhysiqueId?.(p.name);
            const isEquipped = G.physique && (G.physique.name === p.name || G.physique.id === pid);
            const isCultivating = G.physiqueCultivation?.id === pid;
            const isDone = isPhysiqueCompleted?.(pid);
            let tag = '[Begin]';
            if (isDone) tag = isEquipped ? '[Equipped]' : '[Perfected]';
            else if (isCultivating) tag = '[Refining]';
            const border = isEquipped || isCultivating ? 'border-color:#f1c40f;' : '';
            html += `<button type="button" class="${itemClass}" data-physique="${p.name}" data-physique-id="${pid}" style="${border}">
                <div class="name">${isEquipped ? '✅ ' : isCultivating ? '🔮 ' : ''}${p.name} <span class="body-physique-tag">${tag}</span></div>
                <div class="desc">${p.pro} | ${p.con}</div>
                ${isCultivating ? `<div class="meta">${getPhysiqueCultivationStatusText?.() || ''}</div>` : ''}
            </button>`;
        }
    }

    html += `<div class="${sectionClass}" style="${sectionStyle}color:#f1c40f;margin-top:8px;">━━ Legendary ──</div>`;
    for (const p of LEGENDARY_PHYSIQUES) {
        const isActive = G.physique && G.physique.name === p.name;
        const effects = typeof formatPhysiqueEffectDesc === 'function' ? formatPhysiqueEffectDesc(p) : '';
        html += `<button type="button" class="${itemClass}" data-physique="${p.name}" style="${isActive ? 'border-color:#f1c40f;' : ''}">
            <div class="name">${isActive ? '✅ ' : ''}${p.name} <span class="body-physique-tag legendary">[Legendary]</span></div>
            <div class="desc">Trial: ${p.trial}</div>
            <div class="meta physique-effect">${effects}</div>
        </button>`;
    }

    html += `<div class="${sectionClass}" style="${sectionStyle}color:#e74c3c;margin-top:8px;">━━ Evil ──</div>`;
    for (const p of EVIL_PHYSIQUES) {
        const isActive = G.physique && G.physique.name === p.name;
        html += `<button type="button" class="${itemClass}" data-physique="${p.name}" style="${isActive ? 'border-color:#e74c3c;' : ''}">
            <div class="name">${isActive ? '✅ ' : ''}${p.name} <span class="body-physique-tag evil">[Evil]</span></div>
            <div class="desc">${p.pro} | ${p.con}</div>
        </button>`;
    }

    if (G.physique) {
        html += `<button type="button" class="${itemClass} body-physique-unequip" id="physiqueUnequipBtn">
            <div class="name">Unequip ${G.physique.name}</div>
        </button>`;
    }

    el.innerHTML = html;

    el.querySelectorAll(`[data-physique]`).forEach(item => {
        item.addEventListener('click', function() {
            if (typeof guardAction === 'function' && !guardAction('physique')) return;
            const name = this.dataset.physique;
            const p = getPhysiqueByName(name);
            if (!p) return;
            let result;
            if (p.type === 'trainable') result = trainPhysique(name);
            else if (p.type === 'legendary') result = attemptLegendaryPhysique(name);
            else if (p.type === 'evil') result = attemptEvilPhysique(name);
            if (result) {
                logTimedResult(result);
                refresh();
                if (typeof fullRender === 'function') fullRender();
            }
        });
    });

    el.querySelector('#physiqueUnequipBtn')?.addEventListener('click', function() {
        const result = typeof unequipPhysique === 'function' ? unequipPhysique() : null;
        if (result) {
            logTimedResult(result);
            refresh();
            if (typeof fullRender === 'function') fullRender();
        }
    });
}

/** @deprecated Popup removed — physiques live in Body Chamber. */
function renderPhysiquePopup() {
    const el = document.getElementById('physiqueList');
    if (el) renderPhysiquePanel(el, { inChamber: false });
}

function renderIntentPopup() {
    const el = document.getElementById('intentList');
    if (!el) return;
    if (typeof ensureIntentState === 'function') ensureIntentState();
    const track = getIntentTrackForPath('qi');
    const pathActive = typeof isWeaponIntentPathActive === 'function' && isWeaponIntentPathActive();
    let html = `<div style="font-size:12px;color:#a09080;margin-bottom:8px;">${track.emoji} ${track.label} — awaken multiple paths, but time and focus limit how far each refines.</div>`;
    if (!pathActive) {
        html += `<div style="font-size:12px;color:#b8863a;margin-bottom:8px;">Your weapon intents sleep while your focus is elsewhere. Return to the dantian path to cultivate them.</div>`;
    }

    if (G.weaponIntents?.length) {
        html += `<div class="tech-group"><div class="tech-group-header">Awakened <span class="tech-group-count">${G.weaponIntents.length}</span></div>`;
        for (const intent of G.weaponIntents) {
            const tier = getIntentTierForRecord(intent);
            const isActive = G.activeIntentWeapon === intent.weapon;
            const arts = getIntentExpandArtDefs(intent);
            const bonus = getIntentBonusForRecord(intent);
            const rowClass = pathActive ? 'intent-row' : 'intent-row intent-dormant';
            html += `<div class="popup-item ${rowClass}${isActive ? ' intent-active' : ''}"${pathActive ? ` data-intent-weapon="${intent.weapon}"` : ''}>
                <div class="name">${isActive ? '★ ' : ''}${intent.weapon} — ${tier.name}</div>
                <div class="desc">${Math.floor(intent.uses)} uses · +${Math.round(bonus * 100)}% basics · ${getIntentDeepenCount(intent)} Deepen</div>
                <div class="meta">${arts.length ? 'Arts: ' + arts.map(a => a.name).join(', ') : 'No Expand arts yet'}${isActive ? ' · Active focus' : ''}${!pathActive ? ' · Dormant' : ''}</div>
            </div>`;
        }
        html += '</div>';
        if (pathActive) {
            html += `<button type="button" class="popup-item" id="intentRefineBtn" style="width:100%;text-align:center;margin-top:6px;">
                <div class="name">🧘 Refine Active Intent</div>
                <div class="desc">${ACTION_MONTHS.intentRefine} months — steady progress without combat</div>
            </button>`;
        }
    }

    const awakened = new Set(G.weaponIntents.map(i => i.weapon));
    const available = WEAPON_TYPES.filter(w => !awakened.has(w));
    if (pathActive && available.length) {
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

    if (pathActive && G.pendingIntentChoice && G.activeIntentWeapon === G.pendingIntentChoice.weapon) {
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
    ensureDaoState();
    const daoRealm = typeof getDaoFragmentReqRealm === 'function' ? getDaoFragmentReqRealm(null) : 5;
    const daoLabel = typeof getDaoSeekingRealmLabel === 'function' ? getDaoSeekingRealmLabel() : 'Dao Seeking';
    const daoLocked = G.realmIdx < daoRealm;
    let html = '';
    if (daoLocked) {
        html += `<div class="popup-empty">Reach ${daoLabel} to seek and comprehend Dao fragments.</div>`;
    }

    const branchOrder = ['balance', 'void', 'cycle', 'elements', 'karma'];
    const tierSections = [
        { tier: 'primordial', title: '☯️ Primordial', color: '#9b59b6' },
        { tier: 'fundamental', title: '🌀 Fundamental', color: '#e67e22' },
        { tier: 'greater', title: '🌌 Greater', color: '#f1c40f' },
        { tier: 'lesser', title: '📜 Lesser', color: '#b8863a' }
    ];

    tierSections.forEach(section => {
        if (section.tier === 'primordial') {
            const wuji = DAO_TAXONOMY.wuji;
            const locked = countComprehendedTier('fundamental') < (wuji.reqFundamentals || 2);
            html += `<div style="font-size:13px;color:${section.color};margin-top:10px;">${section.title}</div>`;
            if (isDaoComprehended('wuji')) {
                html += `<div class="popup-item" style="border-color:${section.color};"><div class="name">${wuji.emoji} ${wuji.name}</div><div class="desc">${wuji.desc}</div></div>`;
            } else if (locked) {
                html += `<div class="popup-empty">Reunify ${wuji.reqFundamentals || 2} fundamental laws to approach Wuji.</div>`;
            } else if (canAttainWuji()) {
                html += `<button type="button" class="popup-item dao-wuji-btn" style="width:100%;text-align:left;border-color:${section.color};"><div class="name">${wuji.emoji} Attain ${wuji.name}</div><div class="desc">${wuji.desc}</div></button>`;
            }
            return;
        }

        const defs = Object.values(DAO_TAXONOMY).filter(d => d.tier === section.tier);
        const owned = defs.filter(d => isDaoComprehended(d.id));
        const inProgress = defs.filter(d => !isDaoComprehended(d.id) && getDaoComprehensionProgress(d.id) > 0);
        const fragments = section.tier === 'lesser'
            ? G.daoState.fragments.map(name => ({ name, entry: getDaoFragmentPoolEntry(name) })).filter(f => f.entry && getDaoDef(f.entry.daoId)?.tier === 'lesser')
            : [];

        if (!owned.length && !inProgress.length && !fragments.length) return;

        html += `<div style="font-size:13px;color:${section.color};margin-top:10px;">${section.title}</div>`;

        branchOrder.forEach(branch => {
            const branchOwned = owned.filter(d => d.branch === branch);
            const branchProgress = inProgress.filter(d => d.branch === branch);
            const branchFrags = fragments.filter(f => getDaoDef(f.entry.daoId)?.branch === branch);
            if (!branchOwned.length && !branchProgress.length && !branchFrags.length) return;
            html += `<div style="font-size:11px;color:#888;margin:4px 0 2px;">${DAO_BRANCH_LABELS[branch] || branch}</div>`;
            branchOwned.forEach(d => {
                html += `<div class="popup-item" style="border-color:${section.color};"><div class="name">${d.emoji || '◆'} ${d.name}</div><div class="desc">${d.desc || ''}</div></div>`;
            });
            branchProgress.forEach(d => {
                const pct = getDaoComprehensionProgress(d.id);
                html += `<div class="popup-item" style="border-color:${section.color};"><div class="name">${d.name}</div><div class="desc">Comprehension ${pct}%</div><div style="background:#333;height:6px;border-radius:3px;margin-top:4px;"><div style="background:${section.color};width:${pct}%;height:100%;border-radius:3px;"></div></div></div>`;
            });
            branchFrags.forEach(f => {
                const def = getDaoDef(f.entry.daoId);
                const pct = getDaoComprehensionProgress(f.entry.daoId);
                html += `<div class="popup-item dao-fragment-item" data-fragment="${escapeAttr(f.name)}" style="cursor:pointer;border-color:${section.color};">
                    <div class="name">${f.name}</div>
                    <div class="desc">${def?.desc || ''}</div>
                    <div class="meta">Click to comprehend · ${pct}%</div>
                    <div style="background:#333;height:6px;border-radius:3px;margin-top:4px;"><div style="background:${section.color};width:${pct}%;height:100%;border-radius:3px;"></div></div>
                </div>`;
            });
        });
    });

    const merges = typeof getAvailableDaoMerges === 'function' ? getAvailableDaoMerges() : [];
    if (merges.length) {
        html += '<div style="font-size:12px;color:#e67e22;margin-top:8px;">Fundamental reunifications available:</div>';
        merges.forEach(def => {
            const fromNames = (def.mergeFrom || []).map(id => getDaoDef(id)?.name || id);
            const min = def.mergeMin || fromNames.length;
            html += `<button type="button" class="popup-item dao-merge-btn" data-merge-dao="${escapeAttr(def.id)}" style="width:100%;text-align:left;margin-top:4px;border-color:#e67e22;">
                <div class="name">🌀 Reunify ${fromNames.slice(0, min).join(' + ')} → ${def.name}</div>
                <div class="desc">${def.desc} · ${DAO_MERGE_BALANCE.months}mo · ${DAO_MERGE_BALANCE.qiCost} Qi · ${DAO_MERGE_BALANCE.spiritCost} Spirit</div>
            </button>`;
        });
    }

    const greaterFrags = G.daoState.fragments.filter(name => {
        const entry = getDaoFragmentPoolEntry(name);
        return entry && getDaoDef(entry.daoId)?.tier === 'greater';
    });
    if (greaterFrags.length) {
        html += '<div style="font-size:12px;color:#f1c40f;margin-top:8px;">Greater insights held:</div>';
        greaterFrags.forEach(name => {
            const entry = getDaoFragmentPoolEntry(name);
            const def = getDaoDef(entry.daoId);
            const pct = getDaoComprehensionProgress(entry.daoId);
            html += `<div class="popup-item dao-fragment-item" data-fragment="${escapeAttr(name)}" style="cursor:pointer;border-color:#f1c40f;">
                <div class="name">${name}</div>
                <div class="desc">${def?.desc || ''}</div>
                <div class="meta">Click to comprehend · ${pct}%</div>
            </div>`;
        });
    }

    if (!G.daoState.fragments.length && !daoLocked) {
        html += '<div class="popup-empty">No Dao fragments held. Seek insight below, explore, or visit forbidden grounds.</div>';
    }

    html += `<button class="popup-item" id="findFragmentBtn" style="width:100%;text-align:center;margin-top:8px;" ${daoLocked ? 'disabled' : ''}>
        <div class="name">📜 Seek Dao Insight</div>
        <div class="desc">${daoLocked ? `Requires ${daoLabel}` : 'Costs time and Qi — not sealed sites or forbidden grounds'}</div>
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
            const result = typeof mergeDaoFundamental === 'function'
                ? mergeDaoFundamental(this.dataset.mergeDao)
                : (typeof mergeDaoPair === 'function' ? mergeDaoPair(this.dataset.mergeDao) : { success: false, message: 'Unavailable.' });
            logTimedResult(result);
            renderDaoPopup();
            fullRender();
        });
    });
    el.querySelectorAll('.dao-wuji-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = typeof attainWuji === 'function' ? attainWuji() : { success: false, message: 'Unavailable.' };
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
    const founded = typeof isSectFounded === 'function' && isSectFounded();
    const useMap = typeof isMapSectTabOpen === 'function' && isMapSectTabOpen();
    const mapEl = document.getElementById('mapSectInfo');
    const popupEl = document.getElementById('sectInfo');
    const el = useMap && mapEl ? mapEl : popupEl;
    if (!el) return;

    if (!useMap) {
        const title = document.getElementById('sectTitle');
        if (title) title.textContent = founded ? displayName : 'Sect — Found Your Legacy';
    }

    if (useMap && !founded) {
        el.innerHTML = `<div class="map-sect-empty">
            <p class="sect-hint">You have not founded a sect yet.</p>
            <button type="button" class="zone-local-map-btn" id="btnMapFoundSect">🏯 Found your sect</button>
        </div>`;
        el.querySelector('#btnMapFoundSect')?.addEventListener('click', () => {
            document.getElementById('mapPopup')?.classList.remove('active');
            if (typeof mapPopupUi !== 'undefined') mapPopupUi.tab = 'world';
            renderSectPopup();
            document.getElementById('sectPopup')?.classList.add('active');
        });
        return;
    }

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
    if (sectRecipes.length || legRecipes.length) {
        const readyCount = sectRecipes.filter(({ id }) => canCraftGear(id).ok).length;
        html += `<div class="sect-forge-section"><div class="sect-forge-title">🔨 Sect Forge</div>`;
        html += `<p class="sect-forge-hint">${readyCount ? `${readyCount} recipes ready.` : 'Gather materials to forge gear.'} Use the Forge Chamber for full crafting, repair, and progression.</p>`;
        html += `<button type="button" class="sect-refine-btn sect-open-forge-btn" id="sectOpenForge">🔨 Open Forge Chamber</button>`;
        html += `</div>`;
    }

    el.innerHTML = html;
    if (typeof bindSectPanelEvents === 'function') bindSectPanelEvents(el);
    el.querySelectorAll('[data-refine]').forEach(btn => {
        btn.addEventListener('click', function() {
            refineLegendaryMaterial(this.dataset.refine);
        });
    });
    el.querySelector('#sectOpenForge')?.addEventListener('click', () => {
        document.getElementById('sectPopup')?.classList.remove('active');
        document.getElementById('mapPopup')?.classList.remove('active');
        if (typeof openForgeChamber === 'function') openForgeChamber({ atSect: true });
    });
}

function renderStatGuidePopup() {
    const list = document.getElementById('statGuideList');
    if (!list || typeof STAT_GUIDE === 'undefined') return;
    let html = Object.values(STAT_GUIDE).map(g =>
        `<div class="stat-guide-row">
            <div class="stat-guide-label">${g.emoji} ${g.label}</div>
            <div class="stat-guide-desc">${g.desc}</div>
        </div>`
    ).join('');
    const grades = typeof CULTIVATION_BASE_BALANCE !== 'undefined' ? CULTIVATION_BASE_BALANCE.grades : null;
    if (grades?.length) {
        const gradeLines = grades.map(g =>
            `<strong>${g.emoji} ${g.label}</strong> — ${g.playerDesc || ''}${g.playerEffects ? ' ' + g.playerEffects : ''}`
        ).join('<br>');
        html += `<div class="stat-guide-row">
            <div class="stat-guide-label">🏛️ Foundation grades</div>
            <div class="stat-guide-desc">${gradeLines}</div>
        </div>`;
    }
    list.innerHTML = html;
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
    const kitPanel = document.getElementById('travelKitPanel');
    if (!list) return;

    if (kitPanel && typeof renderTravelKitBarHtml === 'function') {
        kitPanel.innerHTML = renderTravelKitBarHtml();
        if (typeof renderSpatialRingPanelHtml === 'function') {
            kitPanel.innerHTML += renderSpatialRingPanelHtml();
        }
    }

    const items = G.inventory || [];
    const legend = G.legendaryMaterials || [];
    const refined = G.refinedLegendary || [];
    const matCount = Object.values(G.materials || {}).reduce((s, n) => s + n, 0);
    const gearCount = typeof getGearBagCount === 'function' ? getGearBagCount() : 0;
    const equippedCount = GEAR_SLOT_IDS.filter(s => G.equipment[s]).length;
    const manualCount = typeof countManualShelfTotal === 'function' ? countManualShelfTotal() : 0;
    const methodCount = typeof countMethodShelfTotal === 'function' ? countMethodShelfTotal() : 0;
    const kitBd = typeof getTravelKitBreakdown === 'function' ? getTravelKitBreakdown() : null;

    if (summary) {
        const kitLine = kitBd
            ? `Kit ${formatTravelKitLoad(kitBd.total)}/${kitBd.capacity}`
            : '';
        summary.textContent = [kitLine, `${gearCount} spare gear · ${equippedCount} worn · ${matCount} materials · ${manualCount} combat manuals · ${methodCount} cultivation scrolls · ${items.length} curios`]
            .filter(Boolean).join(' · ');
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

    if (typeof renderMethodShelfHtml === 'function') {
        html += `<div class="inventory-section-title sticky-section">📘 Cultivation scrolls <span class="section-badge">${methodCount}</span></div>`;
        html += renderMethodShelfHtml();
    }

    if (typeof renderTravelKitManualsHtml === 'function') {
        html += `<div class="inventory-section-title sticky-section">📜 Travel Kit — Combat manuals <span class="section-badge">${manualCount}</span></div>`;
        html += renderTravelKitManualsHtml();
    }

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
        html += `<div class="inventory-section-title inventory-section-craft sticky-section">🔨 Forging <span class="section-badge craft-ready-badge">${ready.length} ready</span></div>`;
        html += `<div class="inventory-forge-cta">
            <p class="inventory-forge-hint">${ready.length ? `${ready.length} recipes ready to forge.` : `${recipes.length} recipes — explore for materials.`}</p>
            <button type="button" class="inventory-forge-btn" id="inventoryOpenForge">Open Forge Chamber →</button>
        </div>`;
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

    if (typeof bindMethodShelfActions === 'function') bindMethodShelfActions(list);
    if (typeof bindTravelKitManualActions === 'function') bindTravelKitManualActions(list);
    if (typeof bindSpatialRingActions === 'function') bindSpatialRingActions(kitPanel || list);

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
    list.querySelector('#inventoryOpenForge')?.addEventListener('click', () => {
        document.getElementById('inventoryPopup')?.classList.remove('active');
        if (typeof openForgeChamber === 'function') openForgeChamber();
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
        if (getForbiddenRealmGate() < FORBIDDEN_BALANCE.searchRealmMin) {
            const needRealm = typeof formatGateRealmRequirement === 'function'
                ? formatGateRealmRequirement(FORBIDDEN_BALANCE.searchRealmMin)
                : 'a major realm on any refinement';
            hint.textContent = `Reach ${needRealm} to search for forbidden legends.`;
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
    tabId = tabId || window._journalTab || 'active';
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

    const entries = typeof getQuestJournalEntries === 'function' ? getQuestJournalEntries() : [];
    const filtered = entries.filter(e => {
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

function openQuestJournal(tabId) {
    tabId = tabId || window._journalTab || 'active';
    window._journalTab = tabId;
    if (typeof renderQuestJournalPopup === 'function') renderQuestJournalPopup(tabId);
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

    const count = typeof getActiveQuestCount === 'function' ? getActiveQuestCount() : 0;
    if (!count) {
        list.innerHTML = '<p class="quest-log-empty">No active quests.</p>';
        return;
    }

    const top = typeof getTopPriorityQuest === 'function' ? getTopPriorityQuest() : null;
    const countLabel = count === 1 ? '1 active quest' : `${count} active quests`;
    let html = `<p class="quest-log-summary">${countLabel}</p>`;

    if (top) {
        const icon = top.typeEmoji || '◆';
        const zoneName = ZONES[top.zoneHint]?.name || top.zoneHint || '';
        const meta = [top.giverName, zoneName, top.stageName].filter(Boolean).join(' · ');
        const hint = typeof getQuestProgressHint === 'function' ? getQuestProgressHint(top) : '';
        const hintLine = hint ? `<div class="quest-log-hint">💡 ${hint}</div>` : '';
        html += `<button type="button" class="quest-log-item quest-active" data-quest-id="${top.id}" title="${top.objective || top.title}">
            <div class="quest-log-title">${icon} ${top.title}</div>
            <div class="quest-log-meta">${meta}${top.typeLabel ? ` · ${top.typeLabel}` : ''}</div>
            ${top.objective ? `<div class="quest-log-objective">${top.objective}</div>` : ''}
            ${hintLine}
        </button>`;
    }

    list.innerHTML = html;

    list.querySelectorAll('.quest-log-item').forEach(btn => {
        btn.onclick = function() {
            if (typeof focusNpcQuest === 'function') focusNpcQuest(this.dataset.questId);
        };
    });
}

function renderNpcPresencePanel() {
    const list = document.getElementById('npcPresenceList');
    if (!list || typeof getPresentNpcCards !== 'function') return;

    const cards = typeof getKnownNpcCards === 'function'
        ? getKnownNpcCards(G.currentZone || currentZone)
        : getPresentNpcCards(G.currentZone || currentZone);
    if (!cards.length) {
        const hint = getNpcPresenceHint();
        list.innerHTML = hint
            ? `<p class="npc-presence-empty">You do not know anyone here yet.</p><p class="npc-presence-hint">${hint}</p>`
            : '<p class="npc-presence-empty">You do not know anyone here yet. Look around or walk the roads.</p>';
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
    let html = '';

    if (catalog.methods?.length) {
        html += `<div class="tech-group-header">📘 Cultivation scrolls</div>`;
        html += catalog.methods.map(item => {
            const method = typeof getCultivationMethodDef === 'function'
                ? getCultivationMethodDef(item.methodId)
                : null;
            if (!method) return '';
            const reqRealm = item.reqRealm ?? method.reqRealm ?? 0;
            const locked = G.realmIdx < reqRealm;
            const studied = typeof hasStudiedCultivationMethod === 'function'
                && hasStudiedCultivationMethod(method.id);
            const finalPrice = Math.max(1, Math.floor(item.price * priceMult));
            const canBuy = !locked && G.stones >= finalPrice;
            const realmName = PATHS[G.path].realms[reqRealm] || `Realm ${reqRealm + 1}`;
            const grade = typeof getMethodGradeDef === 'function'
                ? (getMethodGradeDef(method.methodGrade)?.name || method.methodGrade)
                : method.methodGrade;
            let status = locked ? `Need ${realmName}` : `${finalPrice} Stones · Cultivation scroll · ${grade}`;
            if (studied) status = `Studied · ${status}`;
            if (!locked && finalPrice < item.price) status += ` (was ${item.price})`;
            if (canBuy) status += ' · Click to buy';
            return `<div class="popup-item merchant-row${canBuy ? ' can-buy' : ''}" data-buy-method="${escapeAttr(method.id)}" style="${canBuy ? 'cursor:pointer;' : 'opacity:0.65;'}">
                <div class="name">📘 ${method.name}${studied ? ' <span style="color:#7a9a7a;font-size:11px;">(studied)</span>' : ''}</div>
                <div class="desc">${method.desc} · ${grade}</div>
                <div class="desc" style="margin-top:4px;color:${canBuy ? '#d4a860' : '#a09080'};">${status}</div>
            </div>`;
        }).join('');
        html += `<div class="tech-group-header" style="margin-top:12px;">📜 Combat manuals</div>`;
    }

    html += catalog.stock.map(item => {
        const template = TECHNIQUE_POOL.find(t => t.name === item.technique);
        const owned = G.techniques.some(t => t.name === item.technique);
        const reqRealm = typeof getMarketTechniqueReqRealm === 'function'
            ? getMarketTechniqueReqRealm(item.technique)
            : (item.reqRealm ?? 0);
        const locked = G.realmIdx < reqRealm;
        const talentBlock = template ? getTechniqueTalentBlockReason(template) : null;
        const bodyManual = template?.path === 'body' && G.path !== 'body';
        const factionLocked = typeof isMarketTechniqueUnlocked === 'function' && !isMarketTechniqueUnlocked(item.technique, zoneId);
        const massBlock = template && typeof getSoulCondensationMassBlockReason === 'function'
            ? getSoulCondensationMassBlockReason(template) : null;
        const finalPrice = Math.max(1, Math.floor(item.price * priceMult));
        const canBuy = !locked && !factionLocked && !massBlock && G.stones >= finalPrice;
        const realmName = PATHS[G.path].realms[reqRealm] || `Realm ${reqRealm + 1}`;
        let status = locked ? `Need ${realmName}` : massBlock
            ? massBlock
            : talentBlock
            ? `${talentBlock} to comprehend`
            : bodyManual
            ? 'Manual · body path to comprehend'
            : factionLocked
            ? (typeof getMarketTechniqueLockReason === 'function' ? getMarketTechniqueLockReason(item.technique, zoneId) : 'Faction locked')
            : `${finalPrice} Stones · Manual`;
        if (owned) status = `Known · ${status}`;
        if (!locked && finalPrice < item.price) status += ` (was ${item.price})`;
        if (canBuy) status += ' · Click to buy';
        return `<div class="popup-item merchant-row${canBuy ? ' can-buy' : ''}" data-buy="${escapeAttr(item.technique)}" style="${canBuy ? 'cursor:pointer;' : 'opacity:0.65;'}">
            <div class="name">📜 ${item.technique}${owned ? ' <span style="color:#7a9a7a;font-size:11px;">(known)</span>' : ''}</div>
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

    list.querySelectorAll('[data-buy-method]').forEach(row => {
        row.addEventListener('click', function() {
            if (typeof buyCultivationMethod === 'function') buyCultivationMethod(this.dataset.buyMethod);
        });
    });
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

function renderAlignmentPopup() {
    const container = document.getElementById('alignmentInfo');
    const hint = document.getElementById('alignmentHint');
    if (!container || typeof getDaoAlignmentTier !== 'function') return;
    ensureAlignmentState();

    const tier = getDaoAlignmentTier();
    const effTier = typeof getEffectiveDaoAlignmentTier === 'function' ? getEffectiveDaoAlignmentTier() : tier;
    const prog = typeof getDaoAlignmentProgress === 'function' ? getDaoAlignmentProgress() : null;
    const fx = typeof getDaoAlignmentTierEffects === 'function' ? getDaoAlignmentTierEffects() : {};
    const corruption = G.corruptionLevel || 0;
    const corruptionMax = G.corruptionThreshold || 100;

    if (hint) hint.textContent = 'The heavens weigh your deeds — not as morality, but as harmony with the natural order.';

    let html = `<div class="alignment-header ${getDaoAlignmentTierClass()}">
        <div class="alignment-value">${formatDaoAlignmentValue()}</div>
        <div class="alignment-tier">${tier.label}${effTier.id !== tier.id ? ' <span class="alignment-tier-cap">(perks capped)</span>' : ''}</div>
    </div>`;

    if (prog?.next) {
        const pct = Math.round(prog.progress * 100);
        const nextLabel = prog.next.label;
        html += `<div class="alignment-progress-wrap">
            <div class="alignment-progress-bar"><div class="alignment-progress-fill" style="width:${pct}%"></div></div>
            <div class="alignment-progress-label">${pct}% toward ${nextLabel}</div>
        </div>`;
    }

    if (corruption > 0) {
        const corrPct = Math.min(100, Math.round((corruption / corruptionMax) * 100));
        html += `<div class="alignment-corruption-wrap">
            <div class="alignment-corruption-label">🩸 Corruption ${corruption}/${corruptionMax}</div>
            <div class="alignment-progress-bar corruption-bar"><div class="alignment-progress-fill corruption-fill" style="width:${corrPct}%"></div></div>
            ${corruption >= (DAO_ALIGNMENT.corruptionDriftThreshold || 50) ? '<div class="alignment-corruption-warn">High corruption drifts alignment downward when cultivating.</div>' : ''}
        </div>`;
    }

    const omen = typeof getHeavenlyAlignmentOmenReadout === 'function' ? getHeavenlyAlignmentOmenReadout() : null;
    if (omen) {
        html += `<div class="alignment-omen alignment-omen-${omen.type}">🌤️ Omen: ${omen.label}</div>`;
    }

    html += `<div class="alignment-section-title">Tier Effects</div><ul class="alignment-perks">`;
    (fx.perks || []).forEach(p => { html += `<li>${p}</li>`; });
    html += `</ul>`;
    html += `<div class="alignment-modifiers">
        <span>${typeof getDaoAlignmentBreakModifierLabel === 'function' ? getDaoAlignmentBreakModifierLabel() || '—' : '—'}</span>
        <span>${typeof getDaoAlignmentTribulationModifierLabel === 'function' ? getDaoAlignmentTribulationModifierLabel() || '—' : '—'}</span>
    </div>`;

    const synergy = typeof getSectDoctrineAlignmentSynergy === 'function' ? getSectDoctrineAlignmentSynergy() : null;
    if (synergy?.label) {
        html += `<div class="alignment-synergy">🏯 Sect synergy: ${synergy.label}</div>`;
    }

    if (G.pendingAlignmentFriction) {
        const ev = G.pendingAlignmentFriction;
        html += `<div class="alignment-friction">
            <div class="alignment-section-title">⚠️ ${ev.title}</div>
            <p>${ev.text}</p>
            <div class="alignment-friction-choices">`;
        ev.choices.forEach(c => {
            html += `<button type="button" class="alignment-action-btn alignment-friction-btn" data-alignment-friction="${c.id}">${c.label}</button>`;
        });
        html += `</div></div>`;
    }

    html += `<div class="alignment-section-title">Recent Shifts</div>`;
    if (G.alignmentLog?.length) {
        html += `<div class="alignment-log">`;
        G.alignmentLog.forEach(entry => {
            const sign = entry.delta > 0 ? '+' : '';
            html += `<div class="alignment-log-entry"><span class="alignment-log-delta">${sign}${entry.delta}</span> ${entry.reason}</div>`;
        });
        html += `</div>`;
    } else {
        html += `<p class="alignment-empty">No shifts recorded yet — your deeds will write themselves here.</p>`;
    }

    html += `<div class="alignment-section-title">Walk Your Path</div><div class="alignment-actions">`;
    (DAO_ALIGNMENT.actions || []).forEach(action => {
        const block = typeof getAlignmentActionBlockReason === 'function' ? getAlignmentActionBlockReason(action) : null;
        const months = typeof getAlignmentActionMonths === 'function' ? getAlignmentActionMonths(action) : action.months;
        const costs = [];
        if (action.stonesCost) costs.push(`💎 ${action.stonesCost}`);
        if (action.spiritCost) costs.push(`✨ ${action.spiritCost} Spirit`);
        if (action.fameCost) costs.push(`⭐ ${action.fameCost} Fame`);
        html += `<button type="button" class="alignment-action-btn${block ? ' disabled' : ''}" data-alignment-action="${action.id}" ${block ? `disabled title="${block.replace(/"/g, '&quot;')}"` : ''}>
            <div class="name">${action.emoji} ${action.label}</div>
            <div class="desc">${action.desc}</div>
            <div class="desc">⏳ ${months} mo${costs.length ? ' · ' + costs.join(' · ') : ''}</div>
            ${block ? `<div class="alignment-action-block">${block}</div>` : ''}
        </button>`;
    });
    html += `</div>`;

    container.innerHTML = html;
    bindAlignmentPopupEvents(container);
}

function bindAlignmentPopupEvents(container) {
    container.querySelectorAll('[data-alignment-action]').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.disabled) return;
            const result = typeof performAlignmentAction === 'function'
                ? performAlignmentAction(this.dataset.alignmentAction)
                : { success: false, message: 'Unavailable.' };
            if (result.message && !result.success) addLog(`☯️ ${result.message}`);
            renderAlignmentPopup();
            fullRender();
        });
    });
    container.querySelectorAll('[data-alignment-friction]').forEach(btn => {
        btn.addEventListener('click', function() {
            const result = typeof resolveAlignmentFriction === 'function'
                ? resolveAlignmentFriction(this.dataset.alignmentFriction)
                : { success: false };
            if (result.message) addLog(`☯️ ${result.message}`);
            renderAlignmentPopup();
            fullRender();
        });
    });
}