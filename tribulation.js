// ============================================
// TRIBULATION.JS — Multi-phase heavenly tribulations
// ============================================

function isTribulationActive() {
    return !!(G.tribulationState && G.tribulationState.active);
}

function isTribulationCombat() {
    return !!(G.tribulationCombat && G.inCombat);
}

function shouldTriggerTribulation() {
    const min = TRIBULATION_BALANCE.minRealm;
    if (G.realmIdx >= min) return true;
    const extra = getPlayerTraitBonus('tribulationLikelihoodPct', 0);
    if (extra > 0 && G.realmIdx >= min - 1) {
        return Math.random() < extra / 100;
    }
    return false;
}

function getTribulationSeverity() {
    let severity = TRIBULATION_BALANCE.baseSeverity + G.realmIdx * TRIBULATION_BALANCE.severityPerRealm;
    severity += getPlayerTraitBonus('tribulationSeverityPct', 0);
    if (G.trait?.bonus?.tribulation_risk) severity += G.trait.bonus.tribulation_risk;
    severity -= Math.floor(G.foundation / 4);
    severity -= Math.floor((G.lightningResist || 0) / 12);
    severity -= Math.floor(getScarLightningResistBonus() / 2);
    severity = Math.floor(severity * (1 - getScarDown('perceptionPct', 0)));
    if (typeof getTranscendenceTribulationResistPct === 'function') {
        severity = Math.floor(severity * (1 - getTranscendenceTribulationResistPct()));
    }
    if (typeof getDaoAlignmentTribulationSeverityMult === 'function') {
        severity = Math.floor(severity * getDaoAlignmentTribulationSeverityMult());
    }
    if (typeof getSectSpiritTribulationEasePct === 'function') {
        severity = Math.floor(severity * (1 - getSectSpiritTribulationEasePct() / 100));
    }
    if (typeof getPlayerTraitTribulationResistPct === 'function') {
        severity = Math.floor(severity * (1 - getPlayerTraitTribulationResistPct() / 100));
    }
    return Math.max(8, Math.floor(severity));
}

function pickTribulationType() {
    let heartChance = 0.42;
    if (G.path === 'soul') heartChance = 0.55;
    if (G.path === 'body') heartChance = 0.35;
    if (G.realmIdx % 2 === 1) heartChance += 0.12;
    return Math.random() < heartChance ? 'heart_demon' : 'lightning';
}

function getTribulationFlavor() {
    return TRIBULATION_PATH_FLAVOR[G.path] || TRIBULATION_PATH_FLAVOR.qi;
}

function getTribulationTypeDef(typeId) {
    return TRIBULATION_TYPES[typeId] || TRIBULATION_TYPES.lightning;
}

function startTribulation(breakStyle) {
    const type = pickTribulationType();
    G.tribulationState = {
        active: true,
        type,
        phase: 'omen',
        breakStyle: breakStyle || 'balanced',
        severity: getTribulationSeverity(),
        trialScore: 0,
        trialPassed: null,
        outcome: null,
        scarRisk: 0,
        choicesMade: []
    };
    addLog(`${getTribulationTypeDef(type).emoji} ${getTribulationTypeDef(type).name} descends upon ${G.name}!`);
    renderTribulationOverlay();
    document.getElementById('tribulationOverlay').classList.add('active');
    fullRender();
}

function tribulationAdvanceTime(months, label) {
    return advanceTime(months, label || 'Heavenly tribulation');
}

function getLightningResistPower() {
    if (G.path === 'body') {
        const vit = typeof getBodyChamberEffectiveVitality === 'function' ? getBodyChamberEffectiveVitality() : G.vitality;
        return vit * 2 + Math.floor(G.maxHp / 15);
    }
    if (G.path === 'soul') return G.will * 2 + G.spirit + Math.floor(G.realmIdx * 2);
    return G.qi + G.spirit + Math.floor(G.will * 0.8) + Math.floor(G.realmIdx * 2);
}

function getOmenChoices() {
    const flavor = getTribulationFlavor();
    const type = G.tribulationState.type;
    const intro = type === 'heart_demon' ? flavor.heartOmen : flavor.lightningOmen;
    const path = G.path;

    const choices = [
        {
            id: 'prepare',
            label: path === 'qi' ? '☯️ Circulate Qi in stillness' : path === 'body' ? '💪 Temper flesh before the sky breaks' : '🧠 Empty the mind, fill the will',
            flavor: intro,
            months: TRIBULATION_BALANCE.omenMonths,
            score: 3,
            scarRisk: -4,
            log: 'You prepare. The heavens take notice.'
        },
        {
            id: 'foundation',
            label: '🏛️ Reinforce your foundation',
            flavor: 'Slow, costly — but the storm may pass more gently.',
            months: TRIBULATION_BALANCE.omenMonths + 2,
            score: 4,
            scarRisk: -8,
            require: { stat: 'foundation', min: 8 },
            failLog: 'Your foundation trembles. The omen worsens.',
            fail: { score: 0, months: TRIBULATION_BALANCE.omenMonths, scarRisk: 12 },
            log: 'Foundation holds. You stand steadier than before.'
        },
        {
            id: 'rush',
            label: '⚡ Meet the heavens head-on',
            flavor: 'Bold cultivators are rewarded — or erased.',
            months: 1,
            score: 1,
            scarRisk: 22,
            log: 'You refuse to flinch. Arrogance has its price and its power.'
        }
    ];
    return choices;
}

function getTrialChoices() {
    const flavor = getTribulationFlavor();
    const type = G.tribulationState.type;

    if (type === 'heart_demon') {
        return [
            {
                id: 'face_demon',
                label: '👤 Face the Heart Demon',
                flavor: flavor.heartTrial,
                months: TRIBULATION_BALANCE.trialMonths,
                combat: true,
                scarRisk: 6,
                log: 'Your shadow steps forward. There is no running from yourself.'
            },
            {
                id: 'reject_demon',
                label: '🛡️ Reject the illusion',
                flavor: 'Deny the shadow — a soul test, not a sword test.',
                months: TRIBULATION_BALANCE.trialMonths,
                score: 0,
                scarRisk: 4,
                require: { stat: 'will', min: 8 + G.realmIdx },
                failLog: 'The demon is not an illusion. It strikes true.',
                fail: { combat: true, months: 2, scarRisk: 14 },
                log: 'The shadow wavers — but does not vanish. You must still fight.'
            }
        ];
    }

    const path = G.path;
    return [
        {
            id: 'barrier',
            label: path === 'qi' ? '🌬️ Raise a Qi barrier' : path === 'body' ? '💪 Brace and endure' : '👁️ Anchor the soul',
            flavor: flavor.lightningTrial,
            months: TRIBULATION_BALANCE.trialMonths,
            resistBonus: path === 'body' ? 6 : path === 'soul' ? 5 : 4,
            scarRisk: -2,
            log: 'You hold the line as lightning falls.'
        },
        {
            id: 'channel',
            label: '⚡ Channel the bolt through your meridians',
            flavor: 'Dangerous — failure burns, success forges.',
            months: TRIBULATION_BALANCE.trialMonths,
            resistBonus: 10,
            risk: 8,
            scarRisk: 18,
            log: 'Lightning runs through you like a river of fire.'
        },
        {
            id: 'pill_shield',
            label: '💊 Burn a pill for protection',
            flavor: 'External aid weakens the trial — but survival is its own Dao.',
            months: TRIBULATION_BALANCE.trialMonths - 1,
            resistBonus: 7,
            scarRisk: 8,
            requirePill: true,
            log: 'Medicinal smoke meets thunder. You survive — barely.'
        }
    ];
}

function getAftermathChoices() {
    const flavor = getTribulationFlavor();
    const passed = G.tribulationState.trialPassed;

    return [
        {
            id: 'heal',
            label: '❤️ Seclude and heal',
            flavor: flavor.aftermath,
            months: TRIBULATION_BALANCE.aftermathMonths + 2,
            scarRisk: -6,
            outcome: passed ? 'success' : 'failure_soft',
            log: passed ? 'You mend what the heavens broke.' : 'You crawl back from the edge.'
        },
        {
            id: 'transcend',
            label: '✨ Reach for transcendence',
            flavor: 'Rare cultivators turn catastrophe into apotheosis.',
            months: TRIBULATION_BALANCE.aftermathMonths + 1,
            scarRisk: 10,
            outcome: passed ? 'transcend' : 'failure',
            require: { stat: 'will', min: 10 + G.realmIdx },
            failLog: 'Your spirit falters. Transcendence slips away.',
            fail: { outcome: passed ? 'success' : 'failure', scarRisk: 6 },
            log: 'You reach beyond survival toward something greater.'
        },
        {
            id: 'consolidate',
            label: '📜 Consolidate your gains',
            flavor: 'Safe, slow — the path most walk.',
            months: TRIBULATION_BALANCE.aftermathMonths,
            scarRisk: -3,
            outcome: passed ? 'success' : 'failure_soft',
            log: 'You stabilize your new realm with patience.'
        }
    ];
}

function formatTribulationChoiceMeta(c) {
    const parts = [];
    const scarTip = STAT_GUIDE?.scarRisk?.desc || '';
    if (c.months) parts.push(`⏳ ${c.months} mo`);
    if (c.combat) parts.push('⚔️ Combat');
    if (c.require) {
        const statName = { will: 'Will', foundation: 'Foundation', spirit: 'Spirit' }[c.require.stat] || c.require.stat;
        parts.push(`📊 ${statName} ${c.require.min}+`);
    }
    if (c.requirePill) parts.push('💊 Uses 1 pill');
    if (c.outcome === 'transcend') parts.push('✨ Transcend chance');
    if (c.scarRisk > 0) parts.push(`<span class="scar-risk-tip" title="${scarTip}">🩸 +${c.scarRisk} scar risk</span>`);
    if (c.scarRisk < 0) parts.push(`<span class="scar-risk-tip" title="${scarTip}">🩸 ${c.scarRisk} scar risk</span>`);
    return parts.join(' · ') || 'Choose wisely';
}

function getTribulationPhaseLabel(phase) {
    if (phase === 'omen') return 'Phase I — Omen';
    if (phase === 'trial') return 'Phase II — Trial';
    return 'Phase III — Aftermath';
}

function renderTribulationOverlay() {
    const state = G.tribulationState;
    if (!state) return;

    const typeDef = getTribulationTypeDef(state.type);
    const choices = state.phase === 'omen' ? getOmenChoices()
        : state.phase === 'trial' ? getTrialChoices()
            : getAftermathChoices();

    document.getElementById('tribulationTitle').textContent = `${typeDef.emoji} ${typeDef.name}`;
    document.getElementById('tribulationPhase').textContent = getTribulationPhaseLabel(state.phase);
    const scarRiskTip = STAT_GUIDE?.scarRisk?.desc || '';
    const scarLabel = STAT_GUIDE?.scarRisk?.label || 'Scar risk';
    document.getElementById('tribulationMeter').innerHTML =
        `Severity ${state.severity} · Trial score ${state.trialScore} · ` +
        `<span class="scar-risk-tip" title="${scarRiskTip}">🩸 ${scarLabel}: ${state.scarRisk || 0}</span>` +
        (typeof getDaoAlignmentTribulationModifierLabel === 'function' && getDaoAlignmentTribulationModifierLabel()
            ? ` · ${getDaoAlignmentTribulationModifierLabel()}`
            : '') +
        (state.trialPassed === true ? ' · Trial passed' : state.trialPassed === false ? ' · Trial failed' : '');

    const flavor = getTribulationFlavor();
    let text = typeDef.desc;
    if (state.phase === 'omen') text = state.type === 'heart_demon' ? flavor.heartOmen : flavor.lightningOmen;
    else if (state.phase === 'trial') text = state.type === 'heart_demon' ? flavor.heartTrial : flavor.lightningTrial;
    else text = flavor.aftermath;
    document.getElementById('tribulationText').textContent = text;

    const container = document.getElementById('tribulationChoices');
    container.innerHTML = choices.map((c, i) => {
        const flavorLine = c.flavor ? `<div class="tribulation-choice-flavor">${c.flavor}</div>` : '';
        return `<button type="button" class="popup-item tribulation-choice" data-idx="${i}">
            <div class="name">${c.label}</div>
            ${flavorLine}
            <div class="tribulation-choice-meta">${formatTribulationChoiceMeta(c)}</div>
        </button>`;
    }).join('');

    container.querySelectorAll('.tribulation-choice').forEach(btn => {
        btn.addEventListener('click', function() {
            tribulationChoose(parseInt(this.dataset.idx, 10));
        });
    });
}

function tribulationMeetsRequire(req) {
    if (!req) return true;
    return (G[req.stat] || 0) >= req.min;
}

function tribulationChoose(idx) {
    const state = G.tribulationState;
    if (!state) return;

    const choices = state.phase === 'omen' ? getOmenChoices()
        : state.phase === 'trial' ? getTrialChoices()
            : getAftermathChoices();
    const choice = choices[idx];
    if (!choice) return;

    if (state.phase === 'aftermath') {
        tribulationResolveAftermath(choice);
        return;
    }

    if (!tribulationMeetsRequire(choice.require)) {
        addLog(`⚡ ${choice.failLog || 'You are not ready.'}`);
        if (choice.fail) {
            tribulationApplyChoiceEffects(choice.fail, choice);
            if (state.phase === 'trial' && choice.fail.combat) {
                document.getElementById('tribulationOverlay').classList.remove('active');
                startHeartDemonCombat();
                fullRender();
                return;
            }
        } else {
            tribulationApplyChoiceEffects({ score: 0, months: choice.months || 2 }, choice);
        }
        if (state.phase === 'omen') {
            state.phase = 'trial';
            renderTribulationOverlay();
        }
        fullRender();
        return;
    }

    if (choice.requirePill && getTotalPills() <= 0) {
        addLog(`😅 No pills left to shield against the tribulation!`);
        fullRender();
        return;
    }

    if (choice.requirePill) {
        ensurePillStock();
        const pillId = Object.keys(G.pillStock).find(id => G.pillStock[id] > 0) || 'spirit_gathering';
        G.pillStock[pillId] = Math.max(0, (G.pillStock[pillId] || 0) - 1);
    }

    addLog(`${getTribulationTypeDef(state.type).emoji} ${choice.log}`);
    tribulationApplyChoiceEffects(choice, choice);

    if (state.phase === 'omen') {
        state.phase = 'trial';
        renderTribulationOverlay();
    } else if (state.phase === 'trial') {
        if (choice.combat || choice.fail?.combat) {
            document.getElementById('tribulationOverlay').classList.remove('active');
            startHeartDemonCombat();
        } else {
            resolveLightningTrial(choice);
            state.phase = 'aftermath';
            renderTribulationOverlay();
        }
    }
    fullRender();
}

function tribulationApplyChoiceEffects(effects, sourceChoice) {
    const state = G.tribulationState;
    const months = effects.months != null ? effects.months : (sourceChoice?.months || TRIBULATION_BALANCE.omenMonths);
    const label = `${getTribulationTypeDef(state.type).name} — ${getTribulationPhaseLabel(state.phase)}`;
    if (!tribulationAdvanceTime(months, label)) {
        finishTribulation();
        return;
    }
    if (effects.score != null) state.trialScore += effects.score;
    else if (sourceChoice?.score) state.trialScore += sourceChoice.score;
    if (effects.scarRisk != null) state.scarRisk = (state.scarRisk || 0) + effects.scarRisk;
    else if (sourceChoice?.scarRisk) state.scarRisk = (state.scarRisk || 0) + sourceChoice.scarRisk;
    if (sourceChoice?.id) state.choicesMade.push(sourceChoice.id);
}

function resolveLightningTrial(choice) {
    const state = G.tribulationState;
    let resist = getLightningResistPower();
    resist += (choice.resistBonus || 0);
    resist += state.trialScore * 2;
    resist += G.lightningResist || 0;
    resist += getScarLightningResistBonus();
    if (choice.risk) resist -= Math.floor(Math.random() * choice.risk);

    const passed = resist >= state.severity;
    state.trialPassed = passed;

    if (passed) {
        addLog(`🌩️ Lightning subsides! (${Math.round(resist)} vs ${state.severity})`);
        G.vitality += 1;
        G.will += 1;
        if (G.trait.bonus.tribulation_risk) {
            G.stones += 20 + G.realmIdx * 5;
            addLog(`💎 Heaven's gambler pays out: +${20 + G.realmIdx * 5} Stones!`);
        }
    } else {
        const gap = state.severity - resist;
        applyLightningDamage(gap);
        state.scarRisk = (state.scarRisk || 0) + 15;
        addLog(`💀 The bolt finds a gap in your defense! (${Math.round(resist)} vs ${state.severity})`);
    }
}

function applyLightningDamage(gap) {
    const raw = Math.max(3, Math.floor(gap));
    let dmg = typeof scaleStatDebuff === 'function' ? Math.max(1, scaleStatDebuff(raw)) : raw;
    const diseaseResist = typeof getBodyChamberDiseaseResistPct === 'function' ? getBodyChamberDiseaseResistPct() : 0;
    if (diseaseResist) dmg = Math.max(1, Math.floor(dmg * (1 - diseaseResist / 100)));
    G.qi = Math.max(1, G.qi - Math.floor(dmg / 2));
    G.vitality = Math.max(1, G.vitality - Math.floor(dmg / 2));
    G.spirit = Math.max(1, G.spirit - Math.floor(dmg / 3));
    G.will = Math.max(1, G.will - Math.floor(dmg / 3));
    G.hp = Math.max(1, G.hp - dmg * 2);
}

function startHeartDemonCombat() {
    const state = G.tribulationState;
    const scale = 1 + G.realmIdx * TRIBULATION_BALANCE.heartDemonRealmScale;
    let enemyHp = Math.floor(G.maxHp * TRIBULATION_BALANCE.heartDemonHpMult * scale);
    let enemyDmg = Math.floor((G.qi + G.vitality + G.spirit + G.will) * 0.35 * TRIBULATION_BALANCE.heartDemonDmgMult * scale);
    enemyDmg = Math.max(4, enemyDmg + G.realmIdx * 2);

    G.tribulationCombat = true;
    G.inCombat = true;
    G.defending = false;
    G.fortifyActive = false;
    G.combatLog = [];
    initCombatResource();
    updateShield();
    if (G.path === 'soul') G.shield = G.maxShield;

    G.enemy = {
        name: `Heart Demon — ${G.name}`,
        hp: enemyHp,
        maxHp: enemyHp,
        dmg: enemyDmg,
        originalDmg: enemyDmg,
        intimidateTurns: 0,
        isTribulation: true
    };
    G.enemyMaxHp = G.enemy.maxHp;

    addCombatLog(`👤 The Heart Demon manifests! (${enemyHp} HP)`);
    setupCombatActions();
    G.combatPhase = 'player';
    clearCombatTurnTimer();
    setCombatInputEnabled(true);
    updateCombatUI();
    document.getElementById('combatOverlay').classList.add('active');
}

function tribulationCombatVictory() {
    const state = G.tribulationState;
    G.inCombat = false;
    G.defending = false;
    G.tribulationCombat = null;
    document.getElementById('combatOverlay').classList.remove('active');
    G.enemy = null;

    state.trialPassed = true;
    state.trialScore += 4;
    addLog(`👤 The Heart Demon dissolves — defeated, not destroyed.`);
    addCombatLog(`✨ Heart Demon banished!`);

    state.phase = 'aftermath';
    document.getElementById('tribulationOverlay').classList.add('active');
    renderTribulationOverlay();
    fullRender();
}

function tribulationCombatDefeat() {
    const state = G.tribulationState;
    G.inCombat = false;
    G.defending = false;
    G.tribulationCombat = null;
    document.getElementById('combatOverlay').classList.remove('active');
    G.enemy = null;

    state.trialPassed = false;
    state.scarRisk = (state.scarRisk || 0) + 20;
    G.hp = Math.max(1, Math.floor(G.maxHp * 0.25));
    G.qi = Math.max(1, G.qi - 5 - G.realmIdx);
    G.will = Math.max(1, G.will - 2);
    addLog(`👤 The Heart Demon drives you to your knees. The trial is lost — but you live.`);
    addCombatLog(`💀 Heart Demon overwhelms you...`);

    state.phase = 'aftermath';
    document.getElementById('tribulationOverlay').classList.add('active');
    renderTribulationOverlay();
    fullRender();
}

function tribulationResolveAftermath(choice) {
    const state = G.tribulationState;
    let outcome = choice.outcome;

    if (!tribulationMeetsRequire(choice.require)) {
        addLog(`⚡ ${choice.failLog || 'Transcendence eludes you.'}`);
        outcome = choice.fail?.outcome || (state.trialPassed ? 'success' : 'failure_soft');
    } else {
        addLog(`${getTribulationTypeDef(state.type).emoji} ${choice.log}`);
    }

    if (!tribulationAdvanceTime(choice.months || TRIBULATION_BALANCE.aftermathMonths, `${getTribulationTypeDef(state.type).name} — Aftermath`)) {
        finishTribulation();
        return;
    }

    if (choice.id === 'heal') {
        const heal = Math.floor(G.maxHp * (state.trialPassed ? 0.45 : 0.2));
        G.hp = Math.min(G.maxHp, G.hp + heal);
        addLog(`❤️ You recover ${heal} HP in seclusion.`);
    }

    state.outcome = outcome;
    applyTribulationOutcome(outcome, choice);
    finishTribulation();
}

// ===== SCAR SYSTEM (playstyle modifiers) =====

const OLD_SCAR_MIGRATION = {
    lightning_brand: 'scorched_flesh',
    demon_echo: 'haunted_vision'
};

function getActiveScars() {
    return (G.tribulationMarks || []).filter(m => m.kind === 'scar');
}

function migrateLegacyScars() {
    if (!G.tribulationMarks) return;
    G.tribulationMarks = G.tribulationMarks.map(m => {
        if (m.kind !== 'scar') return m;
        const newId = OLD_SCAR_MIGRATION[m.id] || (TRIBULATION_SCARS[m.id] ? m.id : null);
        if (!newId) return m;
        const def = TRIBULATION_SCARS[newId];
        return { ...m, id: newId, name: def.name };
    }).filter(m => m.kind !== 'scar' || TRIBULATION_SCARS[m.id]);
}

function sumScarEffect(bucket, key, fallback = 0) {
    let total = 0;
    getActiveScars().forEach(m => {
        if (typeof shouldIgnoreCoreCrackScar === 'function' && shouldIgnoreCoreCrackScar(m.id)) return;
        const def = TRIBULATION_SCARS[m.id];
        const block = def?.[bucket];
        if (block && block[key] != null) total += block[key];
    });
    return total || fallback;
}

function getScarDown(key, fallback = 0) {
    const base = sumScarEffect('down', key, fallback);
    const mult = typeof getDaoAlignmentScarMult === 'function' ? getDaoAlignmentScarMult() : 1;
    return base * mult;
}
function getScarUp(key, fallback = 0) { return sumScarEffect('up', key, fallback); }

function getQiCapacity() {
    return getMaxQi();
}

function clampQiToScarCap() {
    clampCurrentQi();
}

function getEffectiveMaxHpFromScars() {
    return Math.max(20, Math.floor(G.maxHp * (1 + getScarDown('maxHpPct', 0))));
}

function getEffectiveSpiritFromScars() {
    return Math.max(1, Math.floor(G.spirit * (1 + getScarDown('spiritPct', 0))));
}

function getEffectiveWillFromScars() {
    let w = Math.max(1, Math.floor(G.will * (1 + getScarDown('willPct', 0))));
    if (typeof getBodyChamberWillBonus === 'function') w += getBodyChamberWillBonus();
    if (typeof getSoulChamberWillBonus === 'function') w += getSoulChamberWillBonus();
    return w;
}

function getScarCombatDamageMult() {
    let mult = 1;
    const maxHp = typeof getEffectiveMaxHpFromScars === 'function' ? getEffectiveMaxHpFromScars() : G.maxHp;
    if (G.hp / Math.max(1, maxHp) < 0.5) mult += getScarUp('lowHpDmgPct', 0);
    if (G.enemy && isDemonicEnemy(G.enemy.name)) mult += getScarUp('demonDmgPct', 0);
    return mult;
}

function isDemonicEnemy(name) {
    if (!name) return false;
    const n = name.toLowerCase();
    return n.includes('demon') || n.includes('corrupt') || n.includes('devil') || n.includes('maw') || n.includes('phantom');
}

function getScarEvasionBonus() {
    return Math.round(getScarUp('evasionBonusPct', 0) * 100);
}

function getScarDefenseBonus() {
    return Math.round(getScarUp('defenseBonusPct', 0) * 100);
}

function getScarLightningResistBonus() {
    return Math.round(getScarUp('lightningResistPct', 0) * 100);
}

function getScarBreakthroughBonus() {
    return Math.round(getScarUp('breakthroughPct', 0) * 100);
}

function getScarFameMult() {
    return Math.max(0.5, 1 + getScarDown('fameGainPct', 0));
}

function getScarDaoMonthsMult() {
    return Math.max(0.5, 1 + getScarDown('daoSpeedPct', 0));
}

function getScarHpRegenMult() {
    return Math.max(0.5, 1 + getScarDown('hpRegenPct', 0));
}

function getScarQiRegenMult() {
    return 1 + getScarUp('qiRegenPct', 0);
}

function getScarPerceptionPenalty() {
    return getScarDown('perceptionPct', 0);
}

function rollScarAccuracyMiss() {
    const miss = -getScarDown('accuracyPct', 0);
    return miss > 0 && Math.random() < miss;
}

function getScarFearResistMult() {
    return 1 + getScarUp('fearResistPct', 0);
}

function getScarMentalResistMult() {
    return 1 + getScarUp('mentalResistPct', 0);
}

function rollRecruitWithScars() {
    const bonus = getScarUp('recruitChancePct', 0);
    return Math.random() < (0.85 + bonus);
}

function getScarRollChance(state) {
    if (state.transcendSucceeded) return 0;
    const passed = state.trialPassed;
    let chance = passed
        ? TRIBULATION_BALANCE.scarBaseChancePassed
        : TRIBULATION_BALANCE.scarBaseChanceFailed;
    chance += (state.scarRisk || 0) * TRIBULATION_BALANCE.scarRiskPerPoint;
    if (G.trait?.bonus?.tribulation_risk) chance += 0.06;
    chance += getPlayerTraitBonus('tribulationSeverityPct', 0) / 200;
    if (typeof getTranscendenceTribulationResistPct === 'function') {
        chance *= (1 - getTranscendenceTribulationResistPct());
    }
    return clamp(chance, 0.02, TRIBULATION_BALANCE.scarMaxChance);
}

function getEligibleScarsForRoll(state) {
    const realm = G.realmIdx;
    const type = state.type;
    const owned = new Set(getActiveScars().map(s => s.id));
    const pool = [];

    Object.entries(TRIBULATION_SCARS).forEach(([id, def]) => {
        if (owned.has(id)) return;
        if (id === 'cracked_core' && typeof hasTranscendencePerk === 'function' && hasTranscendencePerk('unbreakable_core')) return;
        if (def.realmAtBreakthrough != null && def.realmAtBreakthrough !== realm) return;
        if (def.tribulationTypes && !def.tribulationTypes.includes(type)) return;
        let weight = 1;
        if (def.realmAtBreakthrough === realm) weight = 4;
        if (def.tribulationTypes?.includes(type)) weight += 1;
        pool.push({ id, weight });
    });

    if (!pool.length) {
        Object.keys(TRIBULATION_SCARS).forEach(id => {
            if (!owned.has(id)) pool.push({ id, weight: 1 });
        });
    }
    return pool;
}

function pickWeightedScar(pool) {
    const total = pool.reduce((s, p) => s + p.weight, 0);
    let roll = Math.random() * total;
    for (const entry of pool) {
        roll -= entry.weight;
        if (roll <= 0) return entry.id;
    }
    return pool[0].id;
}

function maybeRollTribulationScar(state) {
    if (!state || state.scarRolled) return;
    state.scarRolled = true;
    const chance = getScarRollChance(state);
    if (Math.random() >= chance) {
        if (chance >= 0.25) {
            addLog(`🩸 You bear the trial's wounds — but no permanent scar forms (${Math.round(chance * 100)}% risk endured).`);
        }
        return;
    }
    const pool = getEligibleScarsForRoll(state);
    if (!pool.length) return;
    const scarId = pickWeightedScar(pool);
    applyTribulationScar(scarId);
}

function applyTribulationScar(scarId) {
    return applyTribulationMark(scarId, TRIBULATION_SCARS, 'scar');
}

function removeTribulationScar(scarId, method) {
    const idx = (G.tribulationMarks || []).findIndex(m => m.id === scarId && m.kind === 'scar');
    if (idx < 0) return false;
    const def = TRIBULATION_SCARS[scarId];
    const name = def?.name || scarId;
    G.tribulationMarks.splice(idx, 1);
    const methodLabel = SCAR_HEAL_METHODS[method]?.name || method;
    addLog(`✨ ${name} fades — healed through ${methodLabel}.`);
    clampQiToScarCap();
    G.hp = Math.min(G.hp, getEffectiveMaxHpFromScars());
    return true;
}

function checkScarTimeHealing() {
    const years = TRIBULATION_BALANCE.scarTimeHealYears;
    const scars = getActiveScars().filter(m => {
        const age = G.ageMonths - (m.gainedAtMonths || 0);
        return age >= years * 12;
    });
    if (scars.length) removeTribulationScar(scars[0].id, 'time');
}

function healScarByMethod(method, scarId) {
    if (!getActiveScars().some(m => m.id === scarId)) return { success: false, message: 'Scar not found.' };
    if (method === 'sacrifice') {
        if (!G.techniques.length) return { success: false, message: 'You have nothing left to sacrifice.' };
        const tech = G.techniques.pop();
        removeTribulationScar(scarId, 'sacrifice');
        addLog(`🔥 You burn the memory of ${tech.name} to erase a scar.`);
        return { success: true, message: `Sacrificed ${tech.name}. Scar removed.` };
    }
    removeTribulationScar(scarId, method);
    return { success: true, message: 'Scar removed.' };
}

function getTribulationMarkDef(markId) {
    return TRIBULATION_SCARS[markId] || TRIBULATION_TRANSCENDS[markId] || null;
}

const TRIBULATION_EFFECT_LABELS = {
    qi: 'Qi',
    vitality: 'Vitality',
    spirit: 'Spirit',
    will: 'Will',
    maxHp: 'Max HP',
    lightningResist: 'Lightning resist',
    dmgMult: 'Damage',
    defenseBonus: 'Defense',
    regenBonus: 'Regen'
};

function formatTribulationEffects(effects, sign) {
    if (!effects) return [];
    return Object.entries(effects).map(([key, val]) => {
        const label = TRIBULATION_EFFECT_LABELS[key] || key;
        if (key === 'dmgMult') {
            const pct = Math.round(val * 100);
            return `${sign > 0 ? '+' : '−'}${pct}% ${label}`;
        }
        const n = sign > 0 ? val : Math.abs(val);
        return `${sign > 0 ? '+' : '−'}${n} ${label}`;
    });
}

function formatScarEffectLabels(def) {
    const lines = [];
    if (def.downLabel) lines.push('Cost: ' + def.downLabel);
    if (def.upLabel) lines.push('Gift: ' + def.upLabel);
    return lines;
}

function getMarkTooltipText(markId, kind) {
    const def = getTribulationMarkDef(markId);
    if (!def) return markId;
    const lines = [def.desc || def.name];
    if (kind === 'scar') {
        lines.push(...formatScarEffectLabels(def));
    } else {
        const ups = formatTribulationEffects(def.bonus, 1);
        if (ups.length) lines.push('Gift: ' + ups.join(', '));
    }
    return lines.join(' · ');
}

function setTribulationCue(cue) {
    G.lastTribulationCue = cue;
}

function applyTribulationOutcome(outcome, choice) {
    const state = G.tribulationState;
    const style = state.breakStyle || 'balanced';
    const passed = state.trialPassed;

    if (outcome === 'transcend' && passed) {
        const chance = TRIBULATION_BALANCE.transcendBaseChance + state.trialScore * 0.015 + (style === 'wisdom' ? 0.03 : 0);
        if (Math.random() < chance) {
            const key = state.type === 'heart_demon' ? 'unified_self' : 'thunder_heart';
            state.transcendSucceeded = true;
            applyTribulationMark(key, TRIBULATION_TRANSCENDS, 'transcend');
            applyTribulationSuccessBonus(style, true);
            if (typeof addFame === 'function') addFame(8 + G.realmIdx * 2);
            else G.fame += 8 + G.realmIdx * 2;
            G.tribulationCount++;
            if (typeof recordMilestone === 'function') recordMilestone('passed_tribulation');
            return;
        }
        addLog(`✨ TRANSCENDENCE FAILED — you reach for apotheosis, but the heavens withhold it.`);
        addLog(`   ↳ You still weather the tribulation with lesser gains.`);
        setTribulationCue({
            type: 'transcend_fail',
            title: 'Transcendence Eluded',
            emoji: '✨',
            body: 'You brushed the threshold of apotheosis, but could not cross. The tribulation still ends in survival — not ascension.'
        });
        outcome = 'success';
    }

    if (outcome === 'success' || outcome === 'failure_soft') {
        if (passed) {
            applyTribulationSuccessBonus(style, false);
            G.tribulationCount++;
            if (typeof recordMilestone === 'function') recordMilestone('passed_tribulation');
        } else {
            applyTribulationFailurePenalty(outcome === 'failure_soft');
        }
        return;
    }

    if (outcome === 'failure') {
        applyTribulationFailurePenalty(false);
    }
}

function applyTribulationSuccessBonus(style, isTranscend) {
    const bonus = 2 + Math.floor(G.realmIdx / 2) + (isTranscend ? 3 : 0);
    const fameBase = TRIBULATION_BALANCE.successFame + G.realmIdx;
    const fameScaled = Math.ceil(fameBase * getPlayerTraitMultPct('tribulationRewardPct', 0));
    const fameAdded = typeof addFame === 'function' ? addFame(fameScaled) : (G.fame += fameScaled, fameScaled);
    const statMult = getPlayerTraitMultPct('tribulationRewardPct', 0);
    G.qi += Math.floor(bonus * statMult);
    G.vitality += Math.floor((bonus / 2) * statMult);
    G.spirit += Math.floor((bonus / 2) * statMult);
    G.will += Math.floor((bonus / 2) * statMult);
    G.foundation += Math.max(2, Math.floor(2 * statMult));
    addLog(`🌟 Tribulation weathered! +${Math.floor(bonus * statMult)} stats, +${fameAdded} Fame, +${Math.max(2, Math.floor(2 * statMult))} Foundation.`);
    if (typeof tryCompleteSectQuests === 'function') tryCompleteSectQuests('tribulation_pass');
    if (typeof onTribulationForFactions === 'function') onTribulationForFactions();
    if (typeof shiftDaoAlignment === 'function') {
        shiftDaoAlignment(DAO_ALIGNMENT.shifts.tribulationComplete, 'weathering tribulation');
    }
}

function applyTribulationFailurePenalty(soft) {
    const rawLoss = soft ? 1 : 2;
    const loss = typeof scaleStatDebuff === 'function' ? Math.max(1, scaleStatDebuff(rawLoss)) : rawLoss;
    G.qi = Math.max(1, G.qi - loss - G.realmIdx);
    G.vitality = Math.max(1, G.vitality - loss);
    G.spirit = Math.max(1, G.spirit - loss);
    G.will = Math.max(1, G.will - loss);
    G.foundation = Math.max(0, G.foundation - (typeof scaleStatDebuff === 'function' ? Math.max(1, scaleStatDebuff(TRIBULATION_BALANCE.failureFoundationLoss)) : TRIBULATION_BALANCE.failureFoundationLoss));
    addLog(soft ? `💢 The tribulation leaves you shaken. Minor stat loss.` : `💀 The tribulation cripples your foundation. Heavy losses.`);
}

function applyTribulationMark(markId, pool, kind) {
    if (!G.tribulationMarks) G.tribulationMarks = [];
    if (G.tribulationMarks.some(m => m.id === markId)) return false;
    const def = pool[markId];
    if (!def) return false;

    G.tribulationMarks.push({
        id: markId,
        name: def.name,
        kind,
        gainedAtMonths: G.ageMonths,
        gainedAtRealm: G.realmIdx
    });

    if (kind === 'transcend') {
        applyTribulationStatDelta(def.bonus, 1);
    } else {
        clampQiToScarCap();
        if (getScarDown('maxHpPct', 0) < 0) {
            G.hp = Math.min(G.hp, getEffectiveMaxHpFromScars());
        }
    }

    addLog(def.log);
    const effectLines = kind === 'scar' ? formatScarEffectLabels(def) : formatTribulationEffects(def.bonus, 1).map(u => 'Gift: ' + u);
    effectLines.forEach(line => addLog(`   ↳ ${line}`));

    setTribulationCue({
        type: kind === 'transcend' ? 'transcend_success' : 'scar_gained',
        title: def.name,
        emoji: kind === 'transcend' ? '✨' : '🩸',
        markId,
        kind,
        flavor: def.desc,
        body: effectLines.join(' · ')
    });
    return true;
}

function applyTribulationStatDelta(effects, sign) {
    if (!effects) return;
    Object.entries(effects).forEach(([key, val]) => {
        const delta = sign * val;
        if (key === 'maxHp') {
            G.maxHp = Math.max(20, G.maxHp + delta);
            G.hp = Math.min(G.hp, G.maxHp);
            applyVitalityToMaxHp();
        } else if (key === 'dmgMult') {
            G.dmgMult = Math.max(0.5, (G.dmgMult || 1) + delta);
        } else if (key === 'lightningResist') {
            G.lightningResist = (G.lightningResist || 0) + delta;
        } else if (key === 'defenseBonus') {
            G.defenseBonus = (G.defenseBonus || 0) + delta;
        } else if (key === 'regenBonus') {
            G.regenBonus = (G.regenBonus || 0) + delta;
        } else if (G[key] != null) {
            G[key] = Math.max(1, G[key] + delta);
        }
    });
}

function finishTribulation() {
    const state = G.tribulationState;
    if (G.chamberCondensePending?.formed && state) {
        G.chamberCondensePending.tribulationPassed = !!state.trialPassed;
    }
    if (state) maybeRollTribulationScar(state);
    document.getElementById('tribulationOverlay')?.classList.remove('active');
    G.tribulationState = null;
    G.tribulationCombat = null;
    if (typeof resolveChamberCondenseAfterTribulation === 'function') {
        resolveChamberCondenseAfterTribulation();
    }
    checkPerfectCultivation();
    saveState();
    fullRender();
    renderTribulationCue();
}
