// ============================================
// MAIN.JS — Initialization & Event Binding
// ============================================

// ===== DAO FUNCTIONS (moved from actions for clarity) =====
function canFindDaoFragment(fragment) {
    if (G.realmIdx < getDaoFragmentReqRealm(fragment)) return false;
    if (!fragment.forbiddenClear) return true;
    ensureForbiddenState();
    return getGroundProgress(fragment.forbiddenClear).cleared;
}

function getDaoActionMonths(baseMonths) {
    let mult = typeof getScarDaoMonthsMult === 'function' ? getScarDaoMonthsMult() : 1;
    if (typeof getTranscendenceDaoSpeedMult === 'function') mult *= getTranscendenceDaoSpeedMult();
    if (typeof getConsolidationDaoSpeedMult === 'function') mult *= getConsolidationDaoSpeedMult();
    if (typeof getGearDaoSpeedMult === 'function') mult *= getGearDaoSpeedMult();
    mult *= getPlayerTraitMultPct('daoSpeedPct', 0);
    if (typeof getDrawbackDaoSpeedMult === 'function') mult *= getDrawbackDaoSpeedMult();
    if (typeof getLegacyDaoBonusMult === 'function') mult *= getLegacyDaoBonusMult();
    if (typeof getSoulChamberDaoComprehensionMult === 'function') mult *= getSoulChamberDaoComprehensionMult();
    return Math.max(1, Math.ceil(baseMonths / mult));
}

function findDaoFragment() {
    if (G.realmIdx < getDaoFragmentReqRealm(null)) {
        return { success: false, message: `You must reach ${getDaoSeekingRealmLabel()} before seeking Dao fragments.` };
    }
    const available = DAO_FRAGMENTS.filter(f => {
        if (G.daoFragments.includes(f.name)) return false;
        if (!canFindDaoFragment(f)) return false;
        if (f.type === 'prime') {
            if ((G.trueDaos?.length || 0) < (f.requiresTrueDaos || 2)) return false;
            if (G.realmIdx < (f.reqRealm || 6)) return false;
            if (f.primeName && G.primeDaos.includes(f.primeName)) return false;
        }
        return true;
    });
    if (available.length === 0) return { success: false, message: "No new fragments available." };
    beginActionLog();
    if (!advanceTime(getDaoActionMonths(ACTION_MONTHS.daoSearch), "Searching for Dao insight")) {
        cancelActionLog();
        return { success: false, message: "Your lifespan ends..." };
    }
    const fragment = available[Math.floor(Math.random() * available.length)];
    G.daoFragments.push(fragment.name);
    const msg = `📜 You find a Dao Fragment: ${fragment.name}. ${fragment.desc}`;
    if (G.trueDaos && G.trueDaos.length >= 1) rollForbiddenClueFromDao();
    commitActionLog(msg);
    return { success: true, message: msg, logged: true };
}

function comprehendDao(fragmentName) {
    const fragment = DAO_FRAGMENTS.find(f => f.name === fragmentName);
    if (!fragment) return { success: false, message: "Fragment not found." };
    if (!G.daoFragments.includes(fragmentName)) return { success: false, message: "You don't have this fragment." };
    if (G.realmIdx < getDaoFragmentReqRealm(fragment)) {
        return { success: false, message: `You must be ${getDaoSeekingRealmLabel()} or higher to comprehend fragments.` };
    }
    const cost = 30 + G.daoComprehensionAttempts * 5;
    if (G.qi < cost || G.spirit < Math.floor(cost / 2)) {
        return { success: false, message: `Need ${cost} Qi and ${Math.floor(cost/2)} Spirit.` };
    }
    beginActionLog();
    if (!advanceTime(getDaoActionMonths(ACTION_MONTHS.daoComprehend), "Comprehending the Dao")) {
        cancelActionLog();
        return { success: false, message: "Your lifespan ends..." };
    }
    G.qi -= cost;
    G.spirit -= Math.floor(cost / 2);
    G.daoComprehensionAttempts++;
    let chance = 30 + getEffectiveFoundation() * 2 + G.spirit * 1.5 + G.will * 1.5;
    if (typeof getSectBuildingBonus === 'function') chance += getSectBuildingBonus('daoSpeedPct');
    if (Math.random() * 100 < chance) {
        if (fragment.type === 'prime') {
            const primeName = fragment.primeName || PRIME_DAOS.find(p => p.element === fragment.element)?.name;
            if (primeName && !G.primeDaos.includes(primeName)) {
                G.primeDaos.push(primeName);
                G.daoFragments = G.daoFragments.filter(f => f !== fragmentName);
                grantFoundation(12);
                const fameAdded = typeof addFame === 'function' ? addFame(18) : (G.fame += 18, 18);
                const msg = `🌌 You comprehend Prime Dao: ${primeName}! +12 Foundation, +${fameAdded} Fame.`;
                commitActionLog(msg);
                return { success: true, message: msg, logged: true };
            }
        }
        const trueDao = TRUE_DAOS.find(d => d.element === fragment.element);
        if (trueDao && !G.trueDaos.includes(trueDao.name)) {
            G.trueDaos.push(trueDao.name);
            G.daoFragments = G.daoFragments.filter(f => f !== fragmentName);
            grantFoundation(10);
            const fameAdded = typeof addFame === 'function' ? addFame(15) : (G.fame += 15, 15);
            const msg = `🌟 You comprehend the ${trueDao.name}! ${trueDao.desc} +10 Foundation, +${fameAdded} Fame.`;
            if (typeof shiftDaoAlignment === 'function') {
                shiftDaoAlignment(DAO_ALIGNMENT.shifts.trueDao, 'comprehending True Dao');
            }
            if (typeof getActiveScars === 'function' && getActiveScars().length && typeof healScarByMethod === 'function') {
                healScarByMethod('dao_enlightenment', getActiveScars()[0].id);
            }
            commitActionLog(msg);
            return { success: true, message: msg, logged: true };
        }
        grantFoundation(5);
        const insightMsg = `📜 You gain insight but do not comprehend a new Dao. +5 Foundation.`;
        commitActionLog(insightMsg);
        return { success: true, message: insightMsg, logged: true };
    }
    const failMsg = `💫 The Dao eludes you. Try again later.`;
    commitActionLog(failMsg);
    return { success: false, message: failMsg, logged: true };
}

function getAvailableDaoMerges() {
    return Object.values(MERGED_DAOS).filter(def => {
        if (G.mergedDaos.includes(def.name)) return false;
        return def.pair.every(p => G.primeDaos.includes(p));
    });
}

function mergeDaoPair(mergedName) {
    const def = MERGED_DAOS[mergedName];
    if (!def) return { success: false, message: 'Unknown supreme Dao.' };
    if (G.mergedDaos.includes(def.name)) return { success: false, message: 'Already merged.' };
    if (!def.pair.every(p => G.primeDaos.includes(p))) {
        return { success: false, message: `Need both ${def.pair.join(' and ')} Prime Daos.` };
    }
    const bal = DAO_MERGE_BALANCE;
    if (G.qi < bal.qiCost || G.spirit < bal.spiritCost) {
        return { success: false, message: `Need ${bal.qiCost} Qi and ${bal.spiritCost} Spirit.` };
    }
    beginActionLog();
    if (!advanceTime(bal.months, `Merging into ${def.name}`)) {
        cancelActionLog();
        return { success: false, message: 'Your lifespan ends during the merge.' };
    }
    G.qi -= bal.qiCost;
    G.spirit -= bal.spiritCost;
    let chance = bal.baseChance + getEffectiveFoundation() * 1.2 + G.spirit * 0.8;
    if (typeof getSectBuildingBonus === 'function') chance += getSectBuildingBonus('daoSpeedPct');
    if (Math.random() * 100 >= chance) {
        const failMsg = `💫 The merge collapses — the supreme Dao slips away.`;
        commitActionLog(failMsg);
        return { success: false, message: failMsg, logged: true };
    }
    def.pair.forEach(p => {
        G.primeDaos = G.primeDaos.filter(n => n !== p);
    });
    G.mergedDaos.push(def.name);
    grantFoundation(bal.foundationBonus || 0);
    const fameAdded = typeof addFame === 'function' ? addFame(bal.fameReward || 0) : (G.fame += (bal.fameReward || 0), bal.fameReward || 0);
    const msg = `🌀 SUPREME DAO — ${def.name}! ${def.desc} +${bal.foundationBonus} Foundation, +${fameAdded} Fame.`;
    if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(8, 'merging supreme Daos');
    commitActionLog(msg);
    return { success: true, message: msg, logged: true };
}

// ===== TECHNIQUE FUNCTION =====
function learnTechnique(techName, opts) {
    const template = TECHNIQUE_POOL.find(t => t.name === techName);
    if (!template) return false;
    if (G.techniques.some(t => t.name === techName)) {
        if (!opts?.silent) addLog(`📜 You already know ${techName}.`);
        return false;
    }
    const newTech = {
        name: template.name,
        path: template.path,
        element: template.element || 'neutral',
        category: template.category || 'attack',
        combatTier: template.combatTier || null,
        setId: template.setId || null,
        weaponType: template.weaponType || null,
        baseDamage: template.baseDamage,
        baseCost: template.baseCost,
        costType: template.costType,
        rarity: template.rarity,
        desc: template.desc,
        uses: 0
    };
    G.techniques.push(newTech);
    if (!opts?.silent) addLog(`📜 You learned ${techName}! (${template.rarity})`);
    return true;
}

function useTechnique(techName) {
    const tech = getTechniqueByName(techName);
    if (!tech) return { error: "Technique not found." };
    const cost = getTechCost(tech);
    if (tech.costType === "qi" && G.qi < cost) return { error: "Not enough Qi!" };
    if (tech.costType === "spirit" && G.spirit < cost) return { error: "Not enough Spirit!" };
    if (tech.costType === "qi") G.qi -= cost;
    else if (tech.costType === "spirit") G.spirit -= cost;
    tech.uses = (tech.uses || 0) + 1;
    if (!G.sectTechs.includes(techName) && tech.uses >= 3) {
        G.sectTechs.push(techName);
        addLog(`🏯 ${techName} added to sect technique hall!`);
    }
    const dmg = getTechDamage(tech);
    const tier = getTechniqueTier(tech.uses);
    if (G.weaponIntent) useWeaponIntent();
    return { damage: dmg, tier: tier.name, cost: cost };
}

// ===== CREATION (CP budget + legacy) =====
const creationState = {
    selectedPath: 'qi',
    selectedTalent: 'single_superior',
    selectedTraits: new Set(),
    selectedOrigin: 'village_orphan',
    selectedDrawbacks: new Set()
};

function resetCreationState() {
    creationState.selectedPath = 'qi';
    creationState.selectedTalent = 'single_superior';
    creationState.selectedTraits = new Set();
    creationState.selectedOrigin = 'village_orphan';
    creationState.selectedDrawbacks = new Set();
    const pathOptions = document.getElementById('pathOptions');
    if (pathOptions) {
        pathOptions.querySelectorAll('.popup-item').forEach(el => {
            el.classList.toggle('selected', el.dataset.path === 'qi');
        });
    }
}

function calcCreationSpend() {
    let spent = 0;
    const talent = TALENT_BY_ID[creationState.selectedTalent];
    if (talent) spent += talent.cpCost;
    creationState.selectedTraits.forEach(id => {
        spent += TRAIT_CP_COSTS[id] || 0;
    });
    const origin = ORIGIN_BY_ID[creationState.selectedOrigin];
    if (origin) spent += origin.cpCost;
    creationState.selectedDrawbacks.forEach(id => {
        const d = DRAWBACK_BY_ID[id];
        if (d) spent -= d.cpRefund;
    });
    return spent;
}

function getCreationRemainingCP() {
    return getCreationTotalCP() - calcCreationSpend();
}

function isTalentSelectable(talentId) {
    const def = TALENT_BY_ID[talentId];
    if (!def) return false;
    if (talentId === 'heavenly' && typeof isHeavenlyRootLocked === 'function' && isHeavenlyRootLocked()) return false;
    return true;
}

function getCreationValidationHint() {
    if (!creationState.selectedTalent) return 'Select a spiritual root.';
    if (getCreationRemainingCP() < 0) return 'Not enough Creation Points.';
    return '';
}

function updateCreationUI() {
    const total = getCreationTotalCP();
    const remaining = getCreationRemainingCP();
    const totalEl = document.getElementById('cpTotalDisplay');
    const remainEl = document.getElementById('cpRemainingDisplay');
    if (totalEl) totalEl.textContent = String(total);
    if (remainEl) {
        remainEl.textContent = String(remaining);
        const bar = document.getElementById('creationCpBar');
        if (bar) bar.classList.toggle('cp-negative', remaining < 0);
    }
    const previewRemain = document.getElementById('previewRemainingCp');
    if (previewRemain) previewRemain.textContent = String(remaining);
    const talentDef = TALENT_BY_ID[creationState.selectedTalent];
    const path = creationState.selectedPath || 'qi';
    const realms = PATHS[path]?.realms || [];
    const capIdx = talentDef?.naturalRealmCap ?? 6;
    const previewSpeed = document.getElementById('previewCultivateSpeed');
    if (previewSpeed && talentDef) {
        const originDef = ORIGIN_BY_ID[creationState.selectedOrigin];
        const originPct = originDef?.startEffect?.cultivateSpeedPct || 0;
        const speed = Math.round((talentDef.cultivateSpeedMult || 1) * (1 + originPct / 100) * 100);
        previewSpeed.textContent = `${speed}%`;
    }
    const previewCap = document.getElementById('previewRealmCap');
    if (previewCap) previewCap.textContent = realms[capIdx] || `Realm ${capIdx}`;
    const previewCore = document.getElementById('previewCoreFeasibility');
    if (previewCore) previewCore.textContent = talentDef?.coreFeasibility || '—';
    const hint = document.getElementById('creationValidationHint');
    if (hint) hint.textContent = getCreationValidationHint();
    const startBtn = document.getElementById('startBtn');
    if (startBtn) startBtn.disabled = !!getCreationValidationHint();
    const slotLabel = document.getElementById('traitSlotLabel');
    if (slotLabel) slotLabel.textContent = `(optional, max ${getMaxTraitSlots()})`;
}

function renderCreationTalents() {
    const container = document.getElementById('talentOptions');
    if (!container || typeof TALENT_GRADES === 'undefined') return;
    container.innerHTML = TALENT_GRADES.map(t => {
        const selected = t.id === creationState.selectedTalent ? ' selected' : '';
        const locked = !isTalentSelectable(t.id) ? ' locked' : '';
        const costLabel = t.cpCost < 0 ? `Refunds ${Math.abs(t.cpCost)} CP` : `${t.cpCost} CP`;
        const tip = `${t.notes}\n${costLabel}`;
        return `<button type="button" class="popup-item trait-card${selected}${locked}" data-talent="${t.id}" title="${tip.replace(/"/g, '&quot;')}">
            <div class="name">${t.name}</div>
            <div class="desc">${t.notes}</div>
            <div class="cp-tag">${costLabel}</div>
        </button>`;
    }).join('');
}

function renderCreationTraits() {
    const container = document.getElementById('traitOptions');
    if (!container || typeof TRAITS === 'undefined') return;
    const maxSlots = getMaxTraitSlots();
    container.innerHTML = TRAITS.map(t => {
        const selected = creationState.selectedTraits.has(t.id) ? ' selected' : '';
        const cost = TRAIT_CP_COSTS[t.id] || 0;
        const tip = `${t.flavor}\n${t.upside}\n${t.downside}`;
        return `<button type="button" class="popup-item trait-card${selected}" data-trait="${t.id}" title="${tip.replace(/"/g, '&quot;')}">
            <div class="name">${t.emoji} ${t.name}</div>
            <div class="desc trait-upside">${t.upside}</div>
            <div class="cp-tag">${cost} CP</div>
        </button>`;
    }).join('');
    container.dataset.maxSlots = String(maxSlots);
}

function renderCreationOrigins() {
    const container = document.getElementById('originOptions');
    if (!container || typeof ORIGINS === 'undefined') return;
    container.innerHTML = ORIGINS.map(o => {
        const selected = o.id === creationState.selectedOrigin ? ' selected' : '';
        const locked = !isOriginUnlocked(o.id) ? ' locked' : '';
        const costLabel = o.cpCost === 0 ? 'Free' : `${o.cpCost} CP`;
        return `<button type="button" class="popup-item trait-card${selected}${locked}" data-origin="${o.id}">
            <div class="name">${o.name}</div>
            <div class="desc">${o.desc}</div>
            <div class="cp-tag">${costLabel}</div>
        </button>`;
    }).join('');
}

function renderCreationDrawbacks() {
    const container = document.getElementById('drawbackOptions');
    if (!container || typeof CREATION_DRAWBACKS === 'undefined') return;
    container.innerHTML = CREATION_DRAWBACKS.map(d => {
        const selected = creationState.selectedDrawbacks.has(d.id) ? ' selected' : '';
        return `<button type="button" class="popup-item trait-card refund${selected}" data-drawback="${d.id}">
            <div class="name">${d.name}</div>
            <div class="desc">${d.desc}</div>
            <div class="cp-tag">+${d.cpRefund} CP</div>
        </button>`;
    }).join('');
}

function applyOriginEffects() {
    const def = ORIGIN_BY_ID[G.origin?.id || 'village_orphan'];
    if (!def?.startEffect) return;
    const fx = def.startEffect;
    if (fx.stones) G.stones = Math.max(0, (G.stones || 0) + fx.stones);
    if (fx.fame) G.fame = Math.max(0, (G.fame || 0) + fx.fame);
    if (fx.randomCommonTechnique) {
        const pool = TECHNIQUE_POOL.filter(t =>
            (t.path === G.path || t.path === 'neutral') && t.rarity === 'common' && t.category !== 'utility'
        );
        if (pool.length) {
            const pick = pool[Math.floor(Math.random() * pool.length)];
            learnTechnique(pick.name);
            addLog(`📜 Origin technique: ${pick.name}.`);
        }
    }
}

function applyDrawbackStartingEffects() {
    (G.creationDrawbacks || []).forEach(id => {
        const d = DRAWBACK_BY_ID[id];
        if (d?.effect?.fame) G.fame = Math.max(0, (G.fame || 0) + d.effect.fame);
    });
}

function setupCreation(refreshOnly) {
    if (typeof loadLegacy === 'function') loadLegacy();
    renderLegacyChroniclePanel(document.getElementById('legacyChroniclePanel'));
    renderCreationTalents();
    renderCreationTraits();
    renderCreationOrigins();
    renderCreationDrawbacks();
    updateCreationUI();

    if (refreshOnly) return;

    const pathOptions = document.getElementById('pathOptions');
    if (pathOptions && !pathOptions.dataset.bound) {
        pathOptions.dataset.bound = '1';
        pathOptions.addEventListener('click', function(e) {
            const card = e.target.closest('.popup-item[data-path]');
            if (!card || !pathOptions.contains(card)) return;
            pathOptions.querySelectorAll('.popup-item').forEach(el => el.classList.remove('selected'));
            card.classList.add('selected');
            creationState.selectedPath = card.dataset.path;
            updateCreationUI();
        });
    }

    const talentOptions = document.getElementById('talentOptions');
    if (talentOptions && !talentOptions.dataset.bound) {
        talentOptions.dataset.bound = '1';
        talentOptions.addEventListener('click', function(e) {
            const card = e.target.closest('.popup-item[data-talent]');
            if (!card || card.classList.contains('locked') || !talentOptions.contains(card)) return;
            talentOptions.querySelectorAll('.popup-item').forEach(el => el.classList.remove('selected'));
            card.classList.add('selected');
            creationState.selectedTalent = card.dataset.talent;
            updateCreationUI();
        });
    }

    const traitOptions = document.getElementById('traitOptions');
    if (traitOptions && !traitOptions.dataset.bound) {
        traitOptions.dataset.bound = '1';
        traitOptions.addEventListener('click', function(e) {
            const card = e.target.closest('.popup-item[data-trait]');
            if (!card || !traitOptions.contains(card)) return;
            const id = card.dataset.trait;
            const maxSlots = getMaxTraitSlots();
            if (creationState.selectedTraits.has(id)) {
                creationState.selectedTraits.delete(id);
                card.classList.remove('selected');
            } else {
                if (creationState.selectedTraits.size >= maxSlots) return;
                creationState.selectedTraits.add(id);
                card.classList.add('selected');
            }
            updateCreationUI();
        });
    }

    const originOptions = document.getElementById('originOptions');
    if (originOptions && !originOptions.dataset.bound) {
        originOptions.dataset.bound = '1';
        originOptions.addEventListener('click', function(e) {
            const card = e.target.closest('.popup-item[data-origin]');
            if (!card || card.classList.contains('locked') || !originOptions.contains(card)) return;
            originOptions.querySelectorAll('.popup-item').forEach(el => el.classList.remove('selected'));
            card.classList.add('selected');
            creationState.selectedOrigin = card.dataset.origin;
            updateCreationUI();
        });
    }

    const drawbackOptions = document.getElementById('drawbackOptions');
    if (drawbackOptions && !drawbackOptions.dataset.bound) {
        drawbackOptions.dataset.bound = '1';
        drawbackOptions.addEventListener('click', function(e) {
            const card = e.target.closest('.popup-item[data-drawback]');
            if (!card || !drawbackOptions.contains(card)) return;
            const id = card.dataset.drawback;
            const max = typeof CREATION_MAX_DRAWDACKS !== 'undefined' ? CREATION_MAX_DRAWDACKS : 2;
            if (creationState.selectedDrawbacks.has(id)) {
                creationState.selectedDrawbacks.delete(id);
                card.classList.remove('selected');
            } else {
                if (creationState.selectedDrawbacks.size >= max) return;
                creationState.selectedDrawbacks.add(id);
                card.classList.add('selected');
            }
            updateCreationUI();
        });
    }

    const startBtn = document.getElementById('startBtn');
    if (startBtn && !startBtn.dataset.bound) {
        startBtn.dataset.bound = '1';
        startBtn.addEventListener('click', function() {
            if (getCreationValidationHint()) return;
            const name = document.getElementById('nameInput').value.trim() || 'Wandering Immortal';
            G.name = name;
            G.path = creationState.selectedPath;
            G.talent = buildTalentFromGrade(creationState.selectedTalent);
            G.talentCapBypassed = false;
            G.origin = { id: creationState.selectedOrigin, name: ORIGIN_BY_ID[creationState.selectedOrigin]?.name };
            G.creationDrawbacks = [...creationState.selectedDrawbacks];
            const traitIds = [...creationState.selectedTraits];
            G.traits = traitIds.map(id => TRAIT_BY_ID[id]).filter(Boolean);
            G.trait = G.traits[0] || null;
            G._reincarnationHandled = false;
            G.gameOver = false;
        const base = PATHS[G.path].base;
        G.qiDensity = 0;
        G.maxQiBonus = Math.max(0, (base.qi || 10) - QI_BALANCE.maxQiBase);
        G.vitality = base.vitality;
        G.spirit = base.spirit;
        G.will = base.will;
        G.qi = getMaxQi();
        clampCurrentQi();
        G.maxHp = base.hp || 70;
        G.hp = G.maxHp;
        G.vitalityHpBonus = 0;
        applyVitalityToMaxHp();
        G.foundation = 0;
        G.cultivationBase = { root: 0, flow: 0, stability: 0 };
        G.cultivationMilestones = { density: {} };
        G.foundationCracks = 0;
        G._cultivationBaseMigrated = true;
        G.breakAttempts = 0;
        G.qiExhausted = false;
        G.combatResource = 0;
        G.maxCombatResource = 0;
        G.fortifyActive = false;
        G.mirrorTrial = false;
        G.crucibleTrial = false;
        G.crucibleRegenMult = 1;
        G.silenceTrial = false;
        G.silenceEchoResist = 0;
        G.mawTrial = false;
        G.mawDoubtResist = 0;
        G.forbiddenTitles = [];
        G.forbiddenLifespanMult = 1;
        G.forbidden = { grounds: createEmptyForbiddenGrounds(), activeTrial: null, trialState: null };
        G.fame = 0;
        G.disciples = [];
        G.techniques = [];
        G.sectTechs = [];
        G.sect = null;
        if (typeof ensureSectState === 'function') ensureSectState();
        G.ancients = null;
        if (typeof ensureAncientsState === 'function') ensureAncientsState();
        G.factions = null;
        if (typeof ensureFactionState === 'function') ensureFactionState();
        G.sectPassiveIncome = 0;
        G.meridians = Array(13).fill(false);
        G.meridianAttempts = Array(13).fill(0);
        G.physique = null;
        G.physiqueCultivation = null;
        if (typeof ensurePhysiqueCultivationState === 'function') ensurePhysiqueCultivationState();
        G.physiqueUnlocked = [];
        G.weaponIntent = null;
        G.weaponIntents = [];
        G.activeIntentWeapon = null;
        G.weaponIntentChoices = [];
        G.intentCombatState = null;
        G.daoFragments = [];
        G.trueDaos = [];
        G.primeDaos = [];
        G.mergedDaos = [];
        G.perfectCultivation = false;
        G.hasGoldenNeedle = false;
        G.hasAncientText = false;
        G.tribulationCount = 0;
        G.daoComprehensionAttempts = 0;
        G.corruptionLevel = 0;
        G.pendingIntentChoice = null;
        G.qiRegenMult = 1;
        G.dmgMult = 1;
        G.evasionBonus = 0;
        G.defenseBonus = 0;
        G.lightningResist = 0;
        G.regenBonus = 0;
        G.inventory = [];
        G.legendaryMaterials = [];
        G.equipment = null;
        G.gearInventory = null;
        G.gearInstances = null;
        G.gearBag = null;
        G.materials = null;
        G.gearMigrated = false;
        G.refinedLegendary = [];
        G.encounterState = null;
        G.encounterCombat = null;
        G.tribulationState = null;
        G.tribulationCombat = null;
        G.tribulationMarks = [];
        G.lastTribulationCue = null;
        G.transcendencePerks = [];
        G.realmConsolidation = {};
        G.consolidationBonuses = { breakthrough: 0, techniqueDmgPct: 0, daoSpeedPct: 0, allStatsPct: 0, mentalResistPct: 0 };
        G._consolidationMigrated = false;
        G._qiMigrated = true;
        G.daoAlignment = 0;
        G.npcState = null;
        G.worldNpcs = [];
        G.nextDemonicEmergenceMonths = null;
        G.worldSchedule = [];
        G.worldChronicle = [];
        G.npcQuests = [];
        G.npcKillLog = [];
        G.npcCombat = null;
        G.storyArcState = null;
        G.npcRelationships = null;
        G.storyCombat = null;
        G.sectQuests = null;
        G.worldEventQuests = null;
        G.questJournal = null;
        G.legacyChain = null;
        G.questPerks = null;
        G.demonicRedemption = null;
        G.tutorialLog = null;
        G.milestones = null;
        G._pendingTribulationStyle = null;
        G.affinities = null;
        G.fiveElementCycleIdx = 0;
        G.realmIdx = 0;
        currentZone = 'dustbone';
        G.currentZone = 'dustbone';
        G.currentLocation = typeof getDefaultLocationForZone === 'function' ? getDefaultLocationForZone('dustbone') : 'bone_crossroads';
        initLifespan();
        ensureAffinities();
        if (typeof applyTalentStartingAffinity === 'function') applyTalentStartingAffinity();
        G.log = [];
        G.stones = typeof getPlaytestStartingStones === 'function' ? getPlaytestStartingStones() : 20;
        G.pills = 0;
        G.pillStock = { spirit_gathering: 3, blood_recovery: 1, meridian_soothing: 0, soul_nourishing: 0, foundation_stabilizing: 0 };
        applyOriginEffects();
        applyDrawbackStartingEffects();
        if (typeof applyPendingCarryPerk === 'function') applyPendingCarryPerk();
        if (typeof applyPlayerTraitStartingEffects === 'function') applyPlayerTraitStartingEffects();
        updateShield();
        addLog(`🌟 Welcome, ${G.name}. You begin as a wandering cultivator.`);
        addLog(`🧘 Path: ${PATHS[G.path].name} — 🌱 ${G.talent.name}${G.talent.element ? ' (' + G.talent.element + ')' : ''}`);
        if (G.traits.length) {
            addLog(`🎭 Traits: ${G.traits.map(t => `${t.emoji || ''} ${t.name}`).join(', ')}`);
        }
        if (G.origin?.name) addLog(`📜 Origin: ${G.origin.name}`);
        if (G.creationDrawbacks?.length) {
            addLog(`⚠️ Drawbacks: ${G.creationDrawbacks.map(id => DRAWBACK_BY_ID[id]?.name || id).join(', ')}`);
        }
        addLog(`⏳ You are ${STARTING_AGE_YEARS} years old with ${LIFESPAN_BY_REALM[0]} years ahead. Cultivation may extend your life.`);
        addLog(`🚶 You begin without a sect. Earn Fame, then found your legacy from the Sect panel.`);
        if (typeof grantStarterGear === 'function') grantStarterGear();
        if (typeof grantStarterAlchemyMaterials === 'function') grantStarterAlchemyMaterials();
        document.getElementById('creation-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'flex';
        fullRender();
        if (typeof initActionUnlockSnapshot === 'function') initActionUnlockSnapshot();
        saveState();
        setTimeout(function() {
            if (typeof triggerTutorial === 'function') triggerTutorial('first_boot');
        }, 500);
        });
    }
}

function grantRandomAdeptTechnique() {
    const pool = TECHNIQUE_POOL.filter(t => (t.path === G.path || t.path === 'neutral') && t.category !== 'utility');
    if (!pool.length) return null;
    const template = pool[Math.floor(Math.random() * pool.length)];
    if (!learnTechnique(template.name)) return null;
    const tech = G.techniques.find(t => t.name === template.name);
    if (tech) tech.uses = 5;
    addLog(`📜 Your master's legacy awakens: ${template.name} (Adept).`);
    return template.name;
}


// ===== INIT =====
function initGame() {
    if (typeof loadLegacy === 'function') loadLegacy();
    ensureForbiddenState();
    const loaded = loadState();
    if (typeof ensureSectState === 'function') ensureSectState();
    if (typeof ensureAncientsState === 'function') ensureAncientsState();
    if (typeof ensureFactionState === 'function') ensureFactionState();
    if (typeof ensureNpcState === 'function') ensureNpcState();
    if (typeof seedWorldNpcsIfEmpty === 'function') seedWorldNpcsIfEmpty();
    if (typeof tickNpcWorld === 'function') tickNpcWorld(0);
    if (typeof bindTutorialEvents === 'function') bindTutorialEvents();
    if (typeof ensureChamberState === 'function') ensureChamberState();
    if (typeof ensureBodyChamberState === 'function') ensureBodyChamberState();
    if (typeof ensureAlchemyState === 'function') ensureAlchemyState();
    if (loaded && G.name && G.path) {
        document.getElementById('creation-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'flex';
        addLog(`📜 Welcome back, ${G.name}. Your journey continues.`);
        if (G.ancients?.pendingBargain && typeof openAncientBargainPopup === 'function') {
            setTimeout(() => openAncientBargainPopup(G.ancients.pendingBargain), 600);
        }
        fullRender();
    } else {
        setupCreation();
    }
}

// ===== EVENT BINDING =====
document.addEventListener('DOMContentLoaded', function() {
    // Core buttons
    document.getElementById('btnCultivate').addEventListener('click', () => {
        if (typeof openCultivationHub === 'function') openCultivationHub();
        else if (typeof openQiChamber === 'function') openQiChamber();
        else actionCultivate();
    });
    document.getElementById('btnConsolidate').addEventListener('click', actionConsolidate);
    document.getElementById('btnExplore').addEventListener('click', actionExplore);
    document.getElementById('btnSearch').addEventListener('click', actionSearch);
    document.getElementById('btnBreakthrough').addEventListener('click', openBreakthrough);
    document.getElementById('btnPill').addEventListener('click', actionPill);
    document.getElementById('btnRecuperate').addEventListener('click', actionRecuperate);
    document.getElementById('btnRecruit').addEventListener('click', actionRecruit);
    document.getElementById('btnSect').addEventListener('click', actionSect);
    document.getElementById('btnFactions').addEventListener('click', actionFactionsWrapper);
    document.getElementById('btnMap').addEventListener('click', actionMap);
    document.getElementById('btnMarket').addEventListener('click', actionMarket);
    document.getElementById('btnCombat').addEventListener('click', actionCombat);
    document.getElementById('btnTech').addEventListener('click', actionTech);
    document.getElementById('btnReset').addEventListener('click', resetGame);
    document.getElementById('btnTrueReincarnation')?.addEventListener('click', () => {
        if (typeof openTrueReincarnationChoice === 'function') openTrueReincarnationChoice();
    });

    document.getElementById('btnMeridian').addEventListener('click', actionMeridian);
    document.getElementById('btnPhysique').addEventListener('click', actionPhysique);
    document.getElementById('btnIntent').addEventListener('click', actionIntent);
    document.getElementById('btnDao').addEventListener('click', actionDao);
    document.getElementById('btnInventory').addEventListener('click', actionInventory);
    document.getElementById('btnAlchemy')?.addEventListener('click', () => {
        if (typeof actionAlchemy === 'function') actionAlchemy();
    });
    document.getElementById('sidebarGearStrip')?.addEventListener('click', actionInventory);
    document.getElementById('btnForbidden').addEventListener('click', actionForbidden);

    // Map events
    bindMapEvents();
    if (typeof initChamberEvents === 'function') initChamberEvents();
    if (typeof initBodyChamberEvents === 'function') initBodyChamberEvents();
    if (typeof initSoulChamberEvents === 'function') initSoulChamberEvents();
    if (typeof initCultivationHubEvents === 'function') initCultivationHubEvents();
    if (typeof initAlchemyChamberEvents === 'function') initAlchemyChamberEvents();
    if (typeof initPlaytestFeedback === 'function') initPlaytestFeedback();
    if (typeof initPlaytestMode === 'function') initPlaytestMode();

    // Popup close buttons
    document.getElementById('techClose').addEventListener('click', function() {
        document.getElementById('techPopup').classList.remove('active');
    });
    document.getElementById('techSortBar')?.querySelectorAll('[data-tech-sort]').forEach(btn => {
        btn.addEventListener('click', function() {
            techSortMode = this.dataset.techSort;
            renderTechPopup();
        });
    });
    document.getElementById('pillClose')?.addEventListener('click', function() {
        document.getElementById('pillPopup').classList.remove('active');
    });
    document.getElementById('sectClose').addEventListener('click', function() {
        document.getElementById('sectPopup').classList.remove('active');
    });
    document.getElementById('meridianClose').addEventListener('click', function() {
        document.getElementById('meridianPopup').classList.remove('active');
    });
    document.getElementById('physiqueClose').addEventListener('click', function() {
        document.getElementById('physiquePopup').classList.remove('active');
    });
    document.getElementById('intentClose').addEventListener('click', function() {
        document.getElementById('intentPopup').classList.remove('active');
    });
    document.getElementById('daoClose').addEventListener('click', function() {
        document.getElementById('daoPopup').classList.remove('active');
    });
    document.getElementById('mapClose').addEventListener('click', function() {
        document.getElementById('mapPopup').classList.remove('active');
    });
    document.getElementById('merchantClose')?.addEventListener('click', function() {
        document.getElementById('merchantPopup').classList.remove('active');
    });
    document.getElementById('npcClose')?.addEventListener('click', closeNpcPopup);

    // Combat buttons
    document.getElementById('cbAttack').addEventListener('click', combatAttack);
    document.getElementById('cbSecondary').addEventListener('click', combatSecondary);
    document.getElementById('cbSkill').addEventListener('click', combatSkill);
    document.getElementById('cbFlee').addEventListener('click', combatFlee);
    document.getElementById('cbVoidStep').addEventListener('click', combatVoidStep);

    // Breakthrough buttons
    document.getElementById('btBalanced').addEventListener('click', () => executeBreakthrough('balanced'));
    document.getElementById('btPower').addEventListener('click', () => executeBreakthrough('power'));
    document.getElementById('btWisdom').addEventListener('click', () => executeBreakthrough('wisdom'));
    document.getElementById('btCancel').addEventListener('click', closeBreakthrough);

    // Event log expand/collapse
    document.getElementById('btnLogExpand').addEventListener('click', toggleLogExpand);

    // Advanced stats toggle
    document.getElementById('btnStatsToggle').addEventListener('click', toggleAdvancedStats);
    document.getElementById('btnStatGuide')?.addEventListener('click', () => {
        if (typeof actionStatGuide === 'function') actionStatGuide();
    });
    document.getElementById('statGuideClose')?.addEventListener('click', () => {
        document.getElementById('statGuidePopup')?.classList.remove('active');
    });

    document.getElementById('forbiddenClose')?.addEventListener('click', () => {
        document.getElementById('forbiddenPopup').classList.remove('active');
    });
    document.getElementById('btnForbiddenSearch')?.addEventListener('click', actionForbiddenSearch);
    document.getElementById('gardenQuit')?.addEventListener('click', gardenQuitTrial);
    document.getElementById('silenceQuit')?.addEventListener('click', silenceQuitTrial);
    document.getElementById('mawQuit')?.addEventListener('click', mawQuitTrial);
    document.getElementById('templeQuit')?.addEventListener('click', templeQuitTrial);
    document.getElementById('observatoryQuit')?.addEventListener('click', observatoryQuitTrial);
    document.getElementById('encounterQuit')?.addEventListener('click', encounterQuit);
    document.getElementById('questPopupClose')?.addEventListener('click', () => {
        if (typeof closeQuestPopup === 'function') closeQuestPopup();
    });
    document.getElementById('combatRewardClose')?.addEventListener('click', () => {
        if (typeof closeCombatRewardPopup === 'function') closeCombatRewardPopup();
    });
    document.getElementById('btnQuestJournal')?.addEventListener('click', () => {
        if (typeof openQuestJournal === 'function') openQuestJournal();
    });
    document.getElementById('questJournalClose')?.addEventListener('click', () => {
        document.getElementById('questJournalPopup')?.classList.remove('active');
    });
    document.querySelectorAll('#questJournalTabs .journal-tab').forEach(btn => {
        btn.addEventListener('click', function() {
            if (typeof renderQuestJournalPopup === 'function') renderQuestJournalPopup(this.dataset.journalTab);
        });
    });
    document.getElementById('ancientBargainClose')?.addEventListener('click', () => {
        if (G.ancients?.pendingBargain && typeof resolveAncientBargain === 'function') {
            resolveAncientBargain(G.ancients.pendingBargain, 'accept');
        }
        document.getElementById('ancientBargainPopup')?.classList.remove('active');
        fullRender();
    });
    document.getElementById('factionsClose')?.addEventListener('click', () => {
        document.getElementById('factionsPopup')?.classList.remove('active');
    });
    document.getElementById('inventoryClose')?.addEventListener('click', () => {
        document.getElementById('inventoryPopup').classList.remove('active');
    });
    document.getElementById('markDetailClose')?.addEventListener('click', () => {
        document.getElementById('markDetailPopup').classList.remove('active');
    });
    document.getElementById('consolidateClose')?.addEventListener('click', () => {
        document.getElementById('consolidatePopup').classList.remove('active');
    });
    document.getElementById('consolidateConfirm')?.addEventListener('click', () => {
        const tech = document.getElementById('consolidateTechSelect')?.value || null;
        executeConsolidation({ perfect: false, sacrificeTechnique: tech || null });
    });
    document.getElementById('consolidatePerfect')?.addEventListener('click', () => {
        const tech = document.getElementById('consolidateTechSelect')?.value || null;
        executeConsolidation({ perfect: true, sacrificeTechnique: tech || null });
    });
    document.getElementById('consolidatePeakGrind')?.addEventListener('click', () => {
        executePeakGrind();
    });

    // Start the game
    initGame();
});

function toggleAdvancedStats() {
    const panel = document.getElementById('advancedStats');
    const btn = document.getElementById('btnStatsToggle');
    const open = panel.classList.toggle('open');
    btn.textContent = open ? 'Less stats ▲' : 'More stats ▼';
}

function toggleLogExpand() {
    const panel = document.getElementById('logPanel');
    const btn = document.getElementById('btnLogExpand');
    const expanded = panel.classList.toggle('expanded');
    btn.textContent = expanded ? '⬇ Collapse' : '⬆ Expand';
    btn.title = expanded ? 'Collapse log' : 'Expand log';
    if (!expanded) {
        const log = document.getElementById('log');
        log.scrollTop = 0;
    }
}