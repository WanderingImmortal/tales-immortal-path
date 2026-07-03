// ============================================
// POST-IMMORTAL.JS — Immortal paths & Heavenly Court endgame
// ============================================

let _postImmortalTicksRegistered = false;

function ensurePostImmortalState() {
    if (!G.postImmortal) {
        G.postImmortal = {
            pathId: null,
            pathChosen: false,
            fallen: false,
            celestialFavor: 0,
            heavenlyCourt: {
                standing: 0,
                activeTasks: [],
                completedTasks: [],
                activeDecrees: [],
                chronicle: [],
                flags: {}
            }
        };
    }
    const pi = G.postImmortal;
    if (!pi.heavenlyCourt) {
        pi.heavenlyCourt = {
            standing: 0,
            activeTasks: [],
            completedTasks: [],
            activeDecrees: [],
            chronicle: [],
            flags: {}
        };
    }
    const hc = pi.heavenlyCourt;
    if (!hc.activeTasks) hc.activeTasks = [];
    if (!hc.completedTasks) hc.completedTasks = [];
    if (!hc.activeDecrees) hc.activeDecrees = [];
    if (!hc.chronicle) hc.chronicle = [];
    if (!hc.flags) hc.flags = {};
}

function isOnHeavenlyImmortalPath() {
    ensurePostImmortalState();
    return G.postImmortal.pathId === 'heavenly' && !G.postImmortal.fallen;
}

function getImmortalPathDef(pathId) {
    return IMMORTAL_PATHS[pathId] || null;
}

function getEligibleImmortalPaths() {
    ensureDaoAlignment();
    const align = G.daoAlignment;
    return Object.values(IMMORTAL_PATHS).filter(p => {
        if (p.implemented === false) return false;
        return align >= p.minAlignment && align <= p.maxAlignment;
    });
}

function canChooseImmortalPath(pathId) {
    if (!isImmortal() || G.gameOver) return false;
    ensurePostImmortalState();
    if (G.postImmortal.pathChosen) return false;
    const def = getImmortalPathDef(pathId);
    if (!def || def.implemented === false) return false;
    ensureDaoAlignment();
    return G.daoAlignment >= def.minAlignment && G.daoAlignment <= def.maxAlignment;
}

function getCelestialFavor() {
    ensurePostImmortalState();
    return G.postImmortal.celestialFavor || 0;
}

function clampCelestialFavor(val) {
    const b = HEAVENLY_COURT_BALANCE;
    return clamp(val, b.favorMin, b.favorMax);
}

function shiftCelestialFavor(delta, reason) {
    if (!delta || !isOnHeavenlyImmortalPath()) return 0;
    ensurePostImmortalState();
    const before = getCelestialFavor();
    const after = clampCelestialFavor(before + delta);
    G.postImmortal.celestialFavor = after;
    const actual = after - before;
    if (actual && reason) {
        addLog(`✨ Celestial Favor ${actual > 0 ? '+' : ''}${actual} — ${reason}. (${after} total)`);
    }
    if (after < HEAVENLY_COURT_BALANCE.fallThreshold) {
        executeHeavenlyFall('Your Celestial Favor has fallen below zero. Heaven strips your immortality.');
    }
    return actual;
}

function getHeavenlyCourtStanding() {
    ensurePostImmortalState();
    return G.postImmortal.heavenlyCourt.standing || 0;
}

function clampCourtStanding(val) {
    const b = HEAVENLY_COURT_BALANCE;
    return clamp(val, b.standingMin, b.standingMax);
}

function shiftHeavenlyCourtStanding(delta, reason) {
    if (!isOnHeavenlyImmortalPath()) return 0;
    ensurePostImmortalState();
    const before = getHeavenlyCourtStanding();
    const after = clampCourtStanding(before + delta);
    G.postImmortal.heavenlyCourt.standing = after;
    const actual = after - before;
    const rankBefore = getHeavenlyCourtRankForStanding(before);
    const rankAfter = getHeavenlyCourtRankForStanding(after);
    if (actual && reason) {
        addLog(`☁️ Court Standing ${actual > 0 ? '+' : ''}${actual} — ${reason}. (${rankAfter.label})`);
    }
    if (rankBefore.id !== rankAfter.id) {
        appendHeavenlyChronicleEntry({
            category: 'rank',
            emoji: rankAfter.emoji,
            title: `Promoted to ${rankAfter.label}`,
            text: reason || `Standing ${after}`
        });
        addLog(`${rankAfter.emoji} The Heavenly Court elevates you to ${rankAfter.label}!`);
    }
    return actual;
}

function getHeavenlyCourtRankForStanding(standing) {
    const ranks = HEAVENLY_COURT_RANKS;
    let rank = ranks[0];
    for (const r of ranks) {
        if (standing >= r.minStanding) rank = r;
    }
    return rank;
}

function getHeavenlyCourtRank() {
    return getHeavenlyCourtRankForStanding(getHeavenlyCourtStanding());
}

function getHeavenlyCourtRankIndex(rankId) {
    return HEAVENLY_COURT_RANKS.findIndex(r => r.id === rankId);
}

function hasHeavenlyCourtRank(rankId) {
    const need = getHeavenlyCourtRankIndex(rankId);
    if (need < 0) return true;
    const cur = getHeavenlyCourtRankIndex(getHeavenlyCourtRank().id);
    return cur >= need;
}

function appendHeavenlyChronicleEntry(entry) {
    ensurePostImmortalState();
    G.postImmortal.heavenlyCourt.chronicle.unshift({
        months: G.ageMonths,
        ageLabel: typeof formatYears === 'function' ? formatYears(G.ageMonths) : '',
        ...entry
    });
    if (G.postImmortal.heavenlyCourt.chronicle.length > 32) {
        G.postImmortal.heavenlyCourt.chronicle.length = 32;
    }
}

function chooseImmortalPath(pathId) {
    if (!canChooseImmortalPath(pathId)) {
        return { success: false, message: 'You cannot walk this path — your Dao Alignment forbids it.' };
    }
    const def = getImmortalPathDef(pathId);
    ensurePostImmortalState();
    G.postImmortal.pathId = pathId;
    G.postImmortal.pathChosen = true;
    G.postImmortal.fallen = false;
    if (pathId === 'heavenly') {
        G.postImmortal.celestialFavor = HEAVENLY_COURT_BALANCE.startingFavor;
        G.postImmortal.heavenlyCourt.standing = 0;
    }
    addLog(`${def.emoji} You choose the path of the ${def.name} — ${def.dao}.`);
    addLog(`   ↳ ${def.desc}`);
    if (typeof appendQuestJournalEntry === 'function') {
        appendQuestJournalEntry({
            kind: 'heavenly',
            emoji: def.emoji,
            title: `${def.name} — ${def.dao}`,
            text: def.desc
        });
    }
    if (pathId === 'heavenly') {
        addLog(`☁️ The Heavenly Court acknowledges you as a Novice. Seek Court Tasks to earn Celestial Favor.`);
        appendHeavenlyChronicleEntry({
            category: 'path',
            emoji: '☁️',
            title: 'Entered the Heavenly Court',
            text: 'Immortal Ascension opens the gates above — political intrigue awaits.'
        });
    }
    document.getElementById('immortalPathPopup')?.classList.remove('active');
    updateHeavenlyCourtButton();
    fullRender();
    return { success: true, message: `You walk the ${def.name} path.` };
}

function maybeOfferImmortalPathChoice() {
    if (!isImmortal() || G.gameOver) return;
    ensurePostImmortalState();
    if (G.postImmortal.pathChosen) return;
    if (G.inCombat || isTribulationActive() || (typeof isTranscendencePerkPending === 'function' && isTranscendencePerkPending())) return;
    setTimeout(() => {
        if (!G.postImmortal?.pathChosen) openImmortalPathPopup();
    }, 600);
}

function openImmortalPathPopup() {
    if (!isImmortal()) return;
    ensurePostImmortalState();
    if (G.postImmortal.pathChosen) return;
    renderImmortalPathPopup();
    document.getElementById('immortalPathPopup')?.classList.add('active');
}

function renderImmortalPathPopup() {
    const intro = document.getElementById('immortalPathIntro');
    const choices = document.getElementById('immortalPathChoices');
    if (!intro || !choices) return;
    ensureDaoAlignment();
    intro.textContent = `Immortality is yours — but the Dao demands a final choice. Your alignment (${formatDaoAlignmentDisplay()}) determines which path opens before you.`;
    const eligible = getEligibleImmortalPaths();
    if (!eligible.length) {
        intro.textContent += ' No path is fully open to you yet — raise or lower your Dao Alignment, or wait for future paths to unlock.';
    }
    choices.innerHTML = Object.values(IMMORTAL_PATHS).map(path => {
        const eligible = G.daoAlignment >= path.minAlignment && G.daoAlignment <= path.maxAlignment;
        const implemented = path.implemented !== false;
        const canPick = eligible && implemented && !G.postImmortal?.pathChosen;
        const lockReason = !implemented ? 'Coming in a future update'
            : !eligible ? `Requires alignment ${path.minAlignment} to ${path.maxAlignment}`
            : '';
        return `<button type="button" class="immortal-path-choice${canPick ? '' : ' locked'}" data-path-id="${path.id}" ${canPick ? '' : 'disabled'}>
            <span class="immortal-path-name">${path.emoji} ${path.name}</span>
            <span class="immortal-path-dao">${path.dao} · ${path.resource}</span>
            <span class="immortal-path-desc">${path.desc}</span>
            <span class="immortal-path-fall">⚠️ ${path.fallDesc}</span>
            ${lockReason ? `<span class="immortal-path-lock">${lockReason}</span>` : ''}
        </button>`;
    }).join('');
    choices.querySelectorAll('.immortal-path-choice:not(.locked)').forEach(btn => {
        btn.addEventListener('click', () => {
            const result = chooseImmortalPath(btn.dataset.pathId);
            if (!result.success && result.message) addLog(`🚫 ${result.message}`);
        });
    });
}

function getAvailableCourtTasks() {
    if (!isOnHeavenlyImmortalPath()) return [];
    const rank = getHeavenlyCourtRank().id;
    const activeIds = new Set((G.postImmortal.heavenlyCourt.activeTasks || []).map(t => t.taskId));
    const done = new Set(G.postImmortal.heavenlyCourt.completedTasks || []);
    return Object.values(HEAVENLY_COURT_TASKS).filter(t => {
        if (activeIds.has(t.id) || done.has(t.id)) return false;
        return hasHeavenlyCourtRank(t.minRank);
    });
}

function acceptCourtTask(taskId) {
    if (!isOnHeavenlyImmortalPath()) return { success: false, message: 'Only Heavenly Immortals serve the Court.' };
    const def = HEAVENLY_COURT_TASKS[taskId];
    if (!def) return { success: false, message: 'Unknown task.' };
    if (!hasHeavenlyCourtRank(def.minRank)) {
        return { success: false, message: `Requires Court rank: ${def.minRank}.` };
    }
    ensurePostImmortalState();
    const active = G.postImmortal.heavenlyCourt.activeTasks;
    if (active.some(t => t.taskId === taskId)) return { success: false, message: 'Already assigned.' };
    if (active.length >= 2) return { success: false, message: 'Complete a task before accepting another.' };
    active.push({
        taskId,
        acceptedAt: G.ageMonths,
        deadlineMonths: G.ageMonths + (def.months || 6)
    });
    if (typeof syncCourtTaskQuestLog === 'function') syncCourtTaskQuestLog(taskId);
    addLog(`☁️ Court Task accepted: ${def.emoji} ${def.title}`);
    addLog(`   ↳ ${def.objective}`);
    return { success: true, message: `Accepted: ${def.title}` };
}

function completeCourtTask(taskId, reason) {
    if (!isOnHeavenlyImmortalPath()) return false;
    const def = HEAVENLY_COURT_TASKS[taskId];
    if (!def) return false;
    ensurePostImmortalState();
    const hc = G.postImmortal.heavenlyCourt;
    const idx = hc.activeTasks.findIndex(t => t.taskId === taskId);
    if (idx < 0) return false;
    hc.activeTasks.splice(idx, 1);
    if (!hc.completedTasks.includes(taskId)) hc.completedTasks.push(taskId);
    const rw = def.rewards || {};
    if (rw.standing) shiftHeavenlyCourtStanding(rw.standing, reason || def.title);
    if (rw.favor) shiftCelestialFavor(rw.favor, reason || def.title);
    if (rw.alignment && typeof shiftDaoAlignment === 'function') shiftDaoAlignment(rw.alignment, `Court: ${def.title}`);
    if (rw.fame) {
        if (typeof addFame === 'function') addFame(rw.fame);
        else G.fame += rw.fame;
    }
    if (rw.foundation) G.foundation += rw.foundation;
    if (rw.stones) G.stones += rw.stones;
    addLog(`☁️ Court Task complete: ${def.emoji} ${def.title}`);
    appendHeavenlyChronicleEntry({
        category: 'task',
        emoji: def.emoji,
        title: def.title,
        text: reason || 'Task fulfilled.'
    });
    if (typeof removeCourtTaskQuestLog === 'function') removeCourtTaskQuestLog(taskId);
    return true;
}

function tryCompleteCourtTasks(trigger, context) {
    if (!isOnHeavenlyImmortalPath()) return;
    ensurePostImmortalState();
    const tasks = [...G.postImmortal.heavenlyCourt.activeTasks];
    tasks.forEach(at => {
        const def = HEAVENLY_COURT_TASKS[at.taskId];
        if (!def || def.completeOn !== trigger) return;
        if (def.zone && context?.zone && def.zone !== context.zone) return;
        completeCourtTask(at.taskId, def.objective);
    });
}

function performCourtTaskVerdict(taskId, verdict) {
    const def = HEAVENLY_COURT_TASKS[taskId];
    if (!def || def.id !== 'judge_dispute') return { success: false, message: 'Invalid task.' };
    beginActionLog();
    if (!advanceTime(def.months || 3, 'Court deliberation')) {
        cancelActionLog();
        return { success: false, message: 'Your time ends...' };
    }
    let bonusStanding = 0;
    let bonusFavor = 0;
    if (verdict === 'mercy') {
        bonusFavor = 4;
        if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(6, 'merciful judgment');
    } else if (verdict === 'justice') {
        bonusStanding = 4;
        if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(3, 'just judgment');
    } else if (verdict === 'harsh') {
        bonusStanding = 2;
        bonusFavor = -3;
        if (typeof shiftDaoAlignment === 'function') shiftDaoAlignment(-5, 'harsh judgment');
    }
    completeCourtTask(taskId, `Verdict: ${verdict}`);
    if (bonusStanding) shiftHeavenlyCourtStanding(bonusStanding, 'judgment renown');
    if (bonusFavor) shiftCelestialFavor(bonusFavor, 'judgment consequence');
    commitActionLog();
    return { success: true, message: 'Judgment rendered.' };
}

function canIssueDecree(decreeId) {
    if (!isOnHeavenlyImmortalPath()) return { ok: false, reason: 'Not a Heavenly Immortal.' };
    const def = HEAVENLY_DECREES[decreeId];
    if (!def) return { ok: false, reason: 'Unknown decree.' };
    if (!hasHeavenlyCourtRank(def.minRank)) return { ok: false, reason: `Requires ${def.minRank}.` };
    if (def.requiresSect && typeof isSectFounded === 'function' && !isSectFounded()) {
        return { ok: false, reason: 'You must found a sect first.' };
    }
    if (getCelestialFavor() < def.favorCost) {
        return { ok: false, reason: `Need ${def.favorCost} Celestial Favor.` };
    }
    return { ok: true, def };
}

function issueHeavenlyDecree(decreeId, targetId) {
    const check = canIssueDecree(decreeId);
    if (!check.ok) return { success: false, message: check.reason };
    const def = check.def;
    beginActionLog();
    if (!advanceTime(def.months || 2, `Heavenly Decree: ${def.label}`)) {
        cancelActionLog();
        return { success: false, message: 'Interrupted.' };
    }
    shiftCelestialFavor(-def.favorCost, `Decree: ${def.label}`);
    const fx = def.effects || {};
    let msg = def.label;
    if (decreeId === 'bless_region' && targetId) {
        ensurePostImmortalState();
        G.postImmortal.heavenlyCourt.activeDecrees.push({
            decreeId,
            targetZone: targetId,
            expiresAt: G.ageMonths + (fx.durationMonths || 24),
            exploreBonusPct: fx.exploreBonusPct || 0
        });
        const z = ZONES[targetId];
        msg = `Blessed ${z?.name || targetId}`;
        addLog(`🌤️ Heavenly Decree — ${z?.emoji || ''} ${z?.name || targetId} flourishes under heaven's gaze.`);
    } else if (decreeId === 'curse_rival' && targetId) {
        if (typeof shiftFactionRep === 'function') {
            shiftFactionRep(targetId, fx.factionRepDelta || -15, `Heavenly curse: ${def.label}`);
        }
        msg = `Cursed ${getFactionDef(targetId)?.name || targetId}`;
        addLog(`⛈️ Heavenly Decree — disfavor falls upon ${getFactionDef(targetId)?.name || targetId}.`);
    } else if (decreeId === 'guide_disciple') {
        G.foundation += fx.foundation || 0;
        G.spirit += fx.spirit || 0;
        G.will += fx.will || 0;
        addLog(`📿 Heavenly Decree — celestial insight flows into your Dao.`);
    } else if (decreeId === 'punish_sinner') {
        if (fx.alignment && typeof shiftDaoAlignment === 'function') shiftDaoAlignment(fx.alignment, 'punishing corruption');
        if (fx.standing) shiftHeavenlyCourtStanding(fx.standing, 'righteous punishment');
        if (fx.corruptionReduce) G.corruptionLevel = Math.max(0, (G.corruptionLevel || 0) - fx.corruptionReduce);
        addLog(`⚡ Heavenly Decree — corruption is scourged from the land.`);
    } else if (decreeId === 'create_forbidden_ground') {
        if (fx.fame) {
            if (typeof addFame === 'function') addFame(fx.fame);
            else G.fame += fx.fame;
        }
        if (fx.foundation) G.foundation += fx.foundation;
        if (fx.stones) G.stones += fx.stones;
        addLog(`🌑 Heavenly Decree — a forbidden scar is sealed upon the world. Scholars will whisper of it for ages.`);
    } else if (decreeId === 'bless_sect') {
        if (typeof shiftSectReputation === 'function') shiftSectReputation('heavenly_blessing');
        if (fx.sectRenown && G.sect) G.sect.renown = (G.sect.renown || 0) + fx.sectRenown;
        if (fx.fame) {
            if (typeof addFame === 'function') addFame(fx.fame);
            else G.fame += fx.fame;
        }
        addLog(`🏯 Heavenly Decree — your sect is blessed by the Court.`);
    }
    appendHeavenlyChronicleEntry({
        category: 'decree',
        emoji: def.emoji,
        title: def.label,
        text: msg
    });
    commitActionLog();
    return { success: true, message: `Decree issued: ${def.label}` };
}

function getActiveDecreeExploreBonus(zoneId) {
    if (!isOnHeavenlyImmortalPath()) return 0;
    ensurePostImmortalState();
    let bonus = 0;
    (G.postImmortal.heavenlyCourt.activeDecrees || []).forEach(d => {
        if (d.decreeId === 'bless_region' && d.targetZone === zoneId) {
            bonus += d.exploreBonusPct || 0;
        }
    });
    return bonus;
}

function tickCourtDecreeExpiry() {
    if (!isOnHeavenlyImmortalPath()) return;
    ensurePostImmortalState();
    const now = G.ageMonths;
    const before = G.postImmortal.heavenlyCourt.activeDecrees.length;
    G.postImmortal.heavenlyCourt.activeDecrees = G.postImmortal.heavenlyCourt.activeDecrees.filter(d => {
        if (!d.expiresAt || d.expiresAt > now) return true;
        const z = ZONES[d.targetZone];
        addLog(`🌤️ The Court's blessing upon ${z?.name || d.targetZone} fades.`);
        return false;
    });
    if (before !== G.postImmortal.heavenlyCourt.activeDecrees.length) fullRender();
}

function tickCourtTaskDeadlines() {
    if (!isOnHeavenlyImmortalPath()) return;
    ensurePostImmortalState();
    G.postImmortal.heavenlyCourt.activeTasks = G.postImmortal.heavenlyCourt.activeTasks.filter(at => {
        if (!at.deadlineMonths || G.ageMonths < at.deadlineMonths) return true;
        const def = HEAVENLY_COURT_TASKS[at.taskId];
        addLog(`⏳ Court task expired: ${def?.title || at.taskId}`);
        shiftCelestialFavor(-5, 'failed Court duty');
        if (typeof removeCourtTaskQuestLog === 'function') removeCourtTaskQuestLog(at.taskId);
        return false;
    });
}

function maybeHeavenlyIntrigueEvent() {
    if (!isOnHeavenlyImmortalPath()) return;
    if (G.gameOver || G.inCombat || G.tribulationState?.active) return;
    if (G.postImmortal.heavenlyCourt.flags.intriguePending) return;
    const chance = HEAVENLY_COURT_BALANCE.intrigueChancePerTick;
    if (Math.random() >= chance) return;
    const pool = HEAVENLY_INTRIGUE_EVENTS;
    const ev = pool[Math.floor(Math.random() * pool.length)];
    G.postImmortal.heavenlyCourt.flags.intriguePending = ev.id;
    openHeavenlyIntriguePopup(ev);
}

function openHeavenlyIntriguePopup(ev) {
    const title = document.getElementById('heavenlyIntrigueTitle');
    const text = document.getElementById('heavenlyIntrigueText');
    const choices = document.getElementById('heavenlyIntrigueChoices');
    if (!title || !text || !choices || !ev) return;
    title.textContent = `${ev.emoji} ${ev.title}`;
    text.textContent = ev.text;
    choices.innerHTML = ev.choices.map(c => {
        return `<button type="button" class="heavenly-intrigue-choice" data-event-id="${ev.id}" data-choice-id="${c.id}">
            ${c.label}
        </button>`;
    }).join('');
    choices.querySelectorAll('.heavenly-intrigue-choice').forEach(btn => {
        btn.addEventListener('click', () => resolveHeavenlyIntrigue(btn.dataset.eventId, btn.dataset.choiceId));
    });
    document.getElementById('heavenlyIntriguePopup')?.classList.add('active');
}

function resolveHeavenlyIntrigue(eventId, choiceId) {
    const ev = HEAVENLY_INTRIGUE_EVENTS.find(e => e.id === eventId);
    const choice = ev?.choices?.find(c => c.id === choiceId);
    if (!ev || !choice) return;
    document.getElementById('heavenlyIntriguePopup')?.classList.remove('active');
    ensurePostImmortalState();
    G.postImmortal.heavenlyCourt.flags.intriguePending = null;
    beginActionLog();
    if (choice.months) advanceTime(choice.months, 'Court intrigue');
    if (choice.favor) shiftCelestialFavor(choice.favor, ev.title);
    if (choice.standing) shiftHeavenlyCourtStanding(choice.standing, ev.title);
    if (choice.alignment && typeof shiftDaoAlignment === 'function') shiftDaoAlignment(choice.alignment, ev.title);
    if (choice.stones) G.stones = Math.max(0, G.stones + choice.stones);
    if (choice.factionId && choice.factionRep && typeof shiftFactionRep === 'function') {
        shiftFactionRep(choice.factionId, choice.factionRep, ev.title);
    }
    appendHeavenlyChronicleEntry({
        category: 'intrigue',
        emoji: ev.emoji,
        title: ev.title,
        text: choice.label
    });
    addLog(`${ev.emoji} ${ev.title} — you chose: ${choice.label}`);
    commitActionLog();
    fullRender();
}

function executeHeavenlyFall(reason) {
    if (G.postImmortal?.fallen) return;
    ensurePostImmortalState();
    G.postImmortal.fallen = true;
    G.postImmortal.pathId = null;
    const castRealm = HEAVENLY_COURT_BALANCE.castDownRealmIdx;
    if (G.realmIdx >= castRealm) {
        G.realmIdx = castRealm;
        G.lifespanMonths = getLifespanForRealm(G.realmIdx);
    }
    addLog(`💔 CAST DOWN FROM HEAVEN — ${reason || 'Heaven withdraws its mandate.'}`);
    addLog(`   ↳ Your immortality is stripped. You are reborn as a mortal cultivator of ${getRealm()}.`);
    addLog(`   ↳ Lifespan restored: ${formatYears(G.lifespanMonths)} remaining.`);
    if (typeof appendQuestJournalEntry === 'function') {
        appendQuestJournalEntry({
            kind: 'heavenly',
            emoji: '💔',
            title: 'Cast Down from Heaven',
            text: reason || 'Celestial Favor exhausted — mortal again.'
        });
    }
    appendHeavenlyChronicleEntry({
        category: 'fall',
        emoji: '💔',
        title: 'Cast Down',
        text: reason || ''
    });
    updateHeavenlyCourtButton();
    fullRender();
}

function syncCourtTaskQuestLog(taskId) {
    const def = HEAVENLY_COURT_TASKS[taskId];
    if (!def || typeof findNpcQuest !== 'function' || typeof addNpcQuest !== 'function') return;
    const qid = `court_${taskId}`;
    if (findNpcQuest(q => q.id === qid)) return;
    addNpcQuest({
        id: qid,
        title: `${def.emoji} Court: ${def.title}`,
        objective: def.objective,
        status: 'active',
        giver: 'Heavenly Court'
    });
}

function removeCourtTaskQuestLog(taskId) {
    if (typeof findNpcQuest !== 'function') return;
    const q = findNpcQuest(x => x.id === `court_${taskId}`);
    if (q) q.status = 'completed';
}

function renderHeavenlyCourtPopup() {
    const container = document.getElementById('heavenlyCourtInfo');
    if (!container) return;
    if (!isOnHeavenlyImmortalPath()) {
        container.innerHTML = '<div class="heavenly-court-locked">Walk the Heavenly Immortal path to serve the Court.</div>';
        return;
    }
    ensurePostImmortalState();
    const rank = getHeavenlyCourtRank();
    const favor = getCelestialFavor();
    const standing = getHeavenlyCourtStanding();
    const pathDef = getImmortalPathDef('heavenly');

    let html = `<div class="heavenly-court-banner">
        <div class="heavenly-court-title">☁️ Heavenly Court</div>
        <div class="heavenly-court-rank">${rank.emoji} <strong>${rank.label}</strong> · Standing ${standing}</div>
        <div class="heavenly-court-resource">${pathDef.resourceEmoji} <strong>${pathDef.resource}:</strong> ${favor}
            ${favor <= 10 ? ' <span class="heavenly-court-warn">⚠️ Low favor — risk of cast down!</span>' : ''}
        </div>
        <div class="heavenly-court-conflict">${pathDef.conflict}</div>
    </div>`;

    const activeTasks = G.postImmortal.heavenlyCourt.activeTasks || [];
    html += `<div class="heavenly-court-section"><div class="heavenly-court-section-title">📜 Active Court Tasks</div>`;
    if (!activeTasks.length) {
        html += `<p class="heavenly-court-empty">No active assignments.</p>`;
    } else {
        activeTasks.forEach(at => {
            const def = HEAVENLY_COURT_TASKS[at.taskId];
            if (!def) return;
            const deadline = at.deadlineMonths ? formatYears(at.deadlineMonths) : '—';
            html += `<div class="heavenly-court-task-card">
                <div class="heavenly-court-task-title">${def.emoji} ${def.title}</div>
                <div class="heavenly-court-task-obj">${def.objective}</div>
                <div class="heavenly-court-task-meta">Due by age ${deadline}</div>`;
            if (def.completeOn === 'manual' && def.id === 'judge_dispute') {
                html += `<div class="heavenly-court-verdict-row">
                    <button type="button" class="heavenly-verdict-btn" data-verdict="mercy" data-task="${def.id}">Mercy</button>
                    <button type="button" class="heavenly-verdict-btn" data-verdict="justice" data-task="${def.id}">Justice</button>
                    <button type="button" class="heavenly-verdict-btn" data-verdict="harsh" data-task="${def.id}">Harsh</button>
                </div>`;
            }
            html += `</div>`;
        });
    }
    html += `</div>`;

    const available = getAvailableCourtTasks();
    if (available.length) {
        html += `<div class="heavenly-court-section"><div class="heavenly-court-section-title">📋 Available Tasks</div><div class="heavenly-court-task-actions">`;
        available.forEach(t => {
            html += `<button type="button" class="heavenly-court-task-btn" data-court-task="${t.id}">${t.emoji} ${t.title}</button>`;
        });
        html += `</div></div>`;
    }

    html += `<div class="heavenly-court-section"><div class="heavenly-court-section-title">📜 Heavenly Decrees</div>
        <p class="heavenly-court-hint">World-altering commands. Each costs Celestial Favor.</p>`;
    Object.values(HEAVENLY_DECREES).forEach(d => {
        const check = canIssueDecree(d.id);
        const rankOk = hasHeavenlyCourtRank(d.minRank);
        html += `<div class="heavenly-decree-card${check.ok ? '' : ' disabled'}">
            <div class="heavenly-decree-title">${d.emoji} ${d.label} <span class="heavenly-decree-cost">−${d.favorCost} Favor</span></div>
            <div class="heavenly-decree-desc">${d.desc}</div>
            <div class="heavenly-decree-meta">Rank: ${d.minRank}${d.requiresSect ? ' · Sect required' : ''}</div>`;
        if (check.ok) {
            if (d.id === 'bless_region') {
                html += `<div class="heavenly-decree-targets">`;
                ['heartlands', 'jade', 'dustbone', 'frostbite', 'emberwild'].forEach(zid => {
                    const z = ZONES[zid];
                    html += `<button type="button" class="heavenly-decree-btn" data-decree="${d.id}" data-target="${zid}">${z?.emoji || ''} ${z?.name || zid}</button>`;
                });
                html += `</div>`;
            } else if (d.id === 'curse_rival') {
                html += `<div class="heavenly-decree-targets">`;
                ['golden_phoenix', 'jade_lotus', 'celestial_sword', 'void_temple'].forEach(fid => {
                    const f = getFactionDef(fid);
                    html += `<button type="button" class="heavenly-decree-btn" data-decree="${d.id}" data-target="${fid}">${f?.emoji || ''} ${f?.name || fid}</button>`;
                });
                html += `</div>`;
            } else {
                html += `<button type="button" class="heavenly-decree-btn" data-decree="${d.id}">${d.emoji} Issue Decree</button>`;
            }
        } else if (!rankOk) {
            html += `<div class="heavenly-decree-lock">Requires ${d.minRank}</div>`;
        }
        html += `</div>`;
    });
    html += `</div>`;

    const chronicle = G.postImmortal.heavenlyCourt.chronicle || [];
    if (chronicle.length) {
        html += `<div class="heavenly-court-section"><div class="heavenly-court-section-title">📖 Court Chronicle</div>`;
        chronicle.slice(0, 8).forEach(e => {
            html += `<div class="heavenly-chronicle-row">${e.emoji || '☁️'} <strong>${e.title}</strong> — ${e.text} <span class="heavenly-chronicle-age">(${e.ageLabel})</span></div>`;
        });
        html += `</div>`;
    }

    const ranks = HEAVENLY_COURT_RANKS;
    html += `<div class="heavenly-court-section"><div class="heavenly-court-section-title">👑 Court Ranks</div><div class="heavenly-rank-ladder">`;
    ranks.forEach(r => {
        const cur = rank.id === r.id ? ' current' : standing >= r.minStanding ? ' attained' : '';
        html += `<div class="heavenly-rank-step${cur}">${r.emoji} ${r.label} (${r.minStanding}+)</div>`;
    });
    html += `</div></div>`;

    container.innerHTML = html;
    bindHeavenlyCourtPopupEvents(container);
}

function bindHeavenlyCourtPopupEvents(container) {
    container.querySelectorAll('[data-court-task]').forEach(btn => {
        btn.addEventListener('click', () => {
            const result = acceptCourtTask(btn.dataset.courtTask);
            if (result.message) addLog(result.success ? `☁️ ${result.message}` : `🚫 ${result.message}`);
            renderHeavenlyCourtPopup();
            fullRender();
        });
    });
    container.querySelectorAll('.heavenly-verdict-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const result = performCourtTaskVerdict(btn.dataset.task, btn.dataset.verdict);
            if (result.message) addLog(result.success ? `☁️ ${result.message}` : `🚫 ${result.message}`);
            renderHeavenlyCourtPopup();
            fullRender();
        });
    });
    container.querySelectorAll('.heavenly-decree-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const result = issueHeavenlyDecree(btn.dataset.decree, btn.dataset.target || null);
            if (result.message) addLog(result.success ? `☁️ ${result.message}` : `🚫 ${result.message}`);
            renderHeavenlyCourtPopup();
            fullRender();
        });
    });
}

function actionHeavenlyCourt() {
    if (G.gameOver || G.inCombat) return;
    if (!isOnHeavenlyImmortalPath()) {
        if (isImmortal() && !G.postImmortal?.pathChosen) {
            openImmortalPathPopup();
        } else {
            addLog('☁️ Only Heavenly Immortals may enter the Court.');
        }
        return;
    }
    renderHeavenlyCourtPopup();
    document.getElementById('heavenlyCourtPopup')?.classList.add('active');
}

function updateHeavenlyCourtButton() {
    const btn = document.getElementById('btnHeavenlyCourt');
    if (!btn) return;
    const show = isImmortal() && (isOnHeavenlyImmortalPath() || !G.postImmortal?.pathChosen);
    btn.style.display = show ? '' : 'none';
    if (isOnHeavenlyImmortalPath()) {
        btn.title = `Heavenly Court — ${getHeavenlyCourtRank().label} · ${getCelestialFavor()} Favor`;
    } else if (isImmortal()) {
        btn.title = 'Choose your Immortal path';
    }
}

function renderPostImmortalStatus() {
    const el = document.getElementById('postImmortalDisplay');
    const chip = document.getElementById('celestialFavorChip');
    updateHeavenlyCourtButton();
    if (!el && !chip) return;
    ensurePostImmortalState();
    if (isOnHeavenlyImmortalPath()) {
        const rank = getHeavenlyCourtRank();
        const text = `${rank.emoji} ${rank.label} · ✨${getCelestialFavor()} Favor`;
        if (el) {
            el.textContent = text;
            el.className = 'post-immortal-status heavenly';
        }
        if (chip) {
            chip.style.display = '';
            chip.querySelector('.chip-value').textContent = getCelestialFavor();
        }
    } else if (G.postImmortal.pathChosen && G.postImmortal.fallen) {
        if (el) {
            el.textContent = '💔 Cast down — mortal again';
            el.className = 'post-immortal-status fallen';
        }
        if (chip) chip.style.display = 'none';
    } else if (isImmortal() && !G.postImmortal.pathChosen) {
        if (el) {
            el.textContent = '☯️ Choose your Immortal path';
            el.className = 'post-immortal-status pending';
        }
        if (chip) chip.style.display = 'none';
    } else {
        if (el) {
            el.textContent = '';
            el.className = 'post-immortal-status';
        }
        if (chip) chip.style.display = 'none';
    }
}

function onExploreForPostImmortal(zoneId) {
    tryCompleteCourtTasks('explore', { zone: zoneId });
}

function onCombatForPostImmortal() {
    const zoneId = typeof getLootZoneId === 'function' ? getLootZoneId() : (G.currentZone || currentZone);
    tryCompleteCourtTasks('combat', { zone: zoneId });
}

function tickPostImmortalSystems(delta) {
    if (!isOnHeavenlyImmortalPath()) return;
    tickCourtTaskDeadlines();
    tickCourtDecreeExpiry();
    maybeHeavenlyIntrigueEvent();
}

function initPostImmortalRegistries() {
    if (_postImmortalTicksRegistered) return;
    _postImmortalTicksRegistered = true;
    if (typeof registerWorldTick === 'function') {
        registerWorldTick('postImmortal', (delta) => tickPostImmortalSystems(delta), 75);
    }
}

function migratePostImmortalState() {
    ensurePostImmortalState();
    if (isImmortal() && !G.postImmortal.pathChosen && !G.postImmortal._offeredOnLoad) {
        G.postImmortal._offeredOnLoad = true;
        maybeOfferImmortalPathChoice();
    }
}
