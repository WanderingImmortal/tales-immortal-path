// Local NPC assignments use the shared calendar, travel registry, and resource stock.

const SECT_MISSION_TYPES = {
    gather: { label: 'Gather spirit herbs', workMonths: 1 },
    patrol: { label: 'Patrol headquarters', workMonths: 2 }
};
const SECT_MISSION_LIMIT = 1;
const SECT_MISSION_REVIEW_MONTHS = 3;

function ensureSectMissionDepartment() {
    return G.sect.missionDepartment ||= {
        elderUid: null, mode: 'direct', priority: 'gather', safety: 'routine',
        proposal: null, missions: [], nextMissionId: 1
    };
}

function getSectMissionElder() {
    const uid = G.sect?.missionDepartment?.elderUid;
    const elder = uid && getSectAffiliation(uid);
    return isFullSectElder(elder) ? getWorldNpcByUid(uid) : null;
}

function appointSectMissionElder(uid) {
    if (!isSectFounded() || G.gameOver || G.sectSuccessionActive) return false;
    if (!isFullSectElder(getSectAffiliation(uid)) || !getWorldNpcByUid(uid)) return false;
    const department = ensureSectMissionDepartment();
    if (department.elderUid) return false;
    department.elderUid = uid;
    return true;
}

function dismissSectMissionElder() {
    const department = G.sect?.missionDepartment;
    if (!department?.elderUid) return false;
    department.elderUid = null;
    setSectMissionMode('direct');
    return true;
}

function scheduleSectMissionReview() {
    scheduleWorldEvent('sect_mission_review', Math.ceil(G.ageMonths + SECT_MISSION_REVIEW_MONTHS), {}, {
        id: 'sect_mission_review', silent: true
    });
}

function setSectMissionMode(mode) {
    if (!isSectFounded() || !['direct', 'supervised', 'delegated'].includes(mode)) return false;
    if (mode !== 'direct' && !getSectMissionElder()) return false;
    const department = ensureSectMissionDepartment();
    department.mode = mode;
    department.proposal = null;
    if (mode === 'direct') cancelWorldEvents(event => event.id === 'sect_mission_review');
    else scheduleSectMissionReview();
    return true;
}

function setSectMissionPriorities(priority, safety) {
    if (!isSectFounded() || !Object.hasOwn(SECT_MISSION_TYPES, priority)
        || !['routine', 'gathering_only'].includes(safety)) return false;
    const department = ensureSectMissionDepartment();
    department.priority = priority;
    department.safety = safety;
    department.proposal = null;
    return true;
}

function getActiveSectMissions() {
    return (G.sect?.missionDepartment?.missions || []).filter(mission => mission.status === 'active');
}

function isNpcOnSectMission(uid) {
    return getActiveSectMissions().some(mission => mission.npcUid === uid);
}

function getSectMissionHeadquarters() {
    const founded = G.sect.foundedLocationId && getLocationDef(G.sect.foundedLocationId);
    return founded || getLocationDef(getDefaultLocationForZone(G.sect.foundedZone || 'dustbone'));
}

function isNpcLocalToSectHeadquarters(npc, hq) {
    const locationId = getNpcSettledLocationId(npc);
    return npc.zone === hq.parentZone && (!locationId || locationId === hq.id);
}

function getSectPatrolCapability(npc) {
    const cultivation = ensureNpcCultivation(npc);
    return Math.max(cultivation.dantian.realmIdx, cultivation.vessel.realmIdx);
}

function getSectPatrolRequirement(hq) {
    return Math.max(1, hq.minRealm || 0, ZONES[hq.parentZone]?.minRealm || 0);
}

function planSectMission(uid, type, routine = false) {
    const blocked = message => ({ message });
    if (!isSectFounded() || G.gameOver || G.sectSuccessionActive) return blocked('An active sect leader is required.');
    if (!Object.hasOwn(SECT_MISSION_TYPES, type)) return blocked('Choose a mission type.');
    if (getActiveSectMissions().length >= SECT_MISSION_LIMIT) return blocked('The sect already has an active assignment.');
    const npc = getDiscipleNpc(getSectDiscipleMembership(uid));
    if (!npc || npc.state === 'ambient') return blocked('Choose a living disciple.');
    if (isDiscipleStudying(uid) || isNpcOnSectMission(uid) || isNpcTravelling(npc)
        || isNpcTravelBodyUnresolved(npc) || npcTravelCondition(npc)) {
        return blocked('That disciple is occupied or unable to undertake field work.');
    }
    const hq = getSectMissionHeadquarters();
    if (!hq) return blocked('A mapped headquarters is required.');
    if (!isNpcLocalToSectHeadquarters(npc, hq)) {
        return blocked('That disciple is away from headquarters.');
    }
    if (routine && ['hard', 'extreme'].includes(ZONES[hq.parentZone]?.difficulty)) {
        return blocked('The Mission Elder avoids dangerous regions.');
    }
    if (type === 'patrol') {
        if (routine && getSectPatrolCapability(npc) < getSectPatrolRequirement(hq)) {
            return blocked('The disciple lacks the cultivation for a routine patrol.');
        }
        return { npc, hq, destination: hq, walkMonths: 0 };
    }

    if (routine && !canAddToSectInventory(1)) return blocked('The sect stores are full.');
    for (const source of listResourceSources({ resourceId: 'spirit_herb', skipProcess: true })) {
        if (source.type === RESOURCE_SOURCE_TYPES.ABSTRACT_REWARD) continue;
        const destination = getLocationDef(source.locationId);
        if (destination?.parentZone !== hq.parentZone) continue;
        if (hq.id === destination.id) return { npc, hq, destination, source, walkMonths: 0 };
        const route = findNpcTravelRoute(hq.id, destination.id);
        if (route?.hops === 1 && !routeRealmBlock(npc, route)) {
            return { npc, hq, destination, source, walkMonths: npcTravelWalkMonths(route.hops) };
        }
    }
    return blocked('There is no reachable herb source at headquarters or one road away.');
}

function scheduleSectMissionStep(mission, atMonths) {
    mission.nextAtMonths = Math.ceil(atMonths);
    scheduleWorldEvent('sect_mission_step', mission.nextAtMonths, { missionId: mission.id }, {
        id: mission.id, silent: true
    });
}

function assignSectMission(uid, type, routine = false) {
    const plan = planSectMission(uid, type, routine);
    if (plan.message) return { success: false, message: plan.message };
    const { npc, hq, destination, source, walkMonths } = plan;
    const department = ensureSectMissionDepartment();
    const start = G.ageMonths;
    const workMonths = SECT_MISSION_TYPES[type].workMonths;
    const mission = {
        id: `sect_assignment_${department.nextMissionId++}`, type, npcUid: uid, npcName: npc.name,
        headquartersId: hq.id, destinationId: destination.id, sourceId: source?.id ?? null,
        startedMonths: start, expectedAtMonths: Math.ceil(start + walkMonths) + workMonths + walkMonths,
        status: 'active', phase: walkMonths ? 'outbound' : 'work'
    };
    // Otherwise unplaced NPCs report to headquarters within their current zone.
    const needsLocalPlacement = !getNpcSettledLocationId(npc);
    if (needsLocalPlacement) {
        npc.locationId = hq.id;
        mission.temporaryPlacement = true;
    }
    if (walkMonths) {
        const journey = beginNpcJourney(npc, { destinationId: destination.id, method: 'walk', purpose: 'sect_mission' });
        if (!journey.ok) {
            if (needsLocalPlacement) delete npc.locationId;
            return { success: false, message: journey.message };
        }
        scheduleSectMissionStep(mission, journey.arrivesAtMonths);
    } else {
        scheduleSectMissionStep(mission, start + workMonths);
    }
    department.missions.push(mission);
    const message = `${npc.name} began ${SECT_MISSION_TYPES[type].label.toLowerCase()} at ${destination.name}.`;
    addLog(message);
    return { success: true, message, mission };
}

function finishSectMission(mission, success, outcome) {
    if (mission.status !== 'active') return;
    mission.status = success ? 'completed' : 'failed';
    mission.finishedMonths = G.ageMonths;
    mission.outcome = outcome;
    mission.phase = null;
    mission.nextAtMonths = null;
    cancelWorldEvents(event => event.id === mission.id);
    if (success) creditSectContribution(mission.npcUid, 1);
    const npc = getWorldNpcByUid(mission.npcUid);
    if (!success && npc?.travel?.purpose === 'sect_mission' && isNpcTravelling(npc)) {
        cancelNpcJourney(npc, 'sect_mission_ended');
    }
    if (mission.temporaryPlacement && npc?.locationId === mission.headquartersId) {
        delete npc.locationId;
        if (npc.travel?.purpose === 'sect_mission' && npc.travel.status === 'present'
            && npc.travel.locationId === mission.headquartersId) npc.travel.locationId = null;
    }
    const summary = `${npc?.name || mission.npcName} · ${outcome}`;
    addLog(summary);
    if (typeof appendWorldChronicle === 'function') {
        appendWorldChronicle({ emoji: '📋', summary, type: 'sect_mission' });
    }
    const department = ensureSectMissionDepartment();
    const history = department.missions.filter(item => item.status !== 'active');
    if (history.length > 20) {
        const discarded = new Set(history.slice(0, -20));
        department.missions = department.missions.filter(item => !discarded.has(item));
    }
}

function resolveSectMissionStep({ missionId }) {
    const mission = getActiveSectMissions().find(item => item.id === missionId);
    if (!mission || G.ageMonths < mission.nextAtMonths) return;
    const npc = getDiscipleNpc(getSectDiscipleMembership(mission.npcUid));
    if (!npc || !isSectFounded() || G.gameOver || npcTravelCondition(npc)) {
        finishSectMission(mission, false, 'Assignment ended because the disciple became unavailable.');
        return;
    }
    const returning = mission.phase === 'return';
    const target = returning ? mission.headquartersId : mission.destinationId;
    if (!isNpcPhysicallyPresentAt(npc, target)) {
        finishSectMission(mission, false, 'The disciple did not reach the assignment site.');
        return;
    }
    if (mission.phase === 'outbound') {
        mission.phase = 'work';
        scheduleSectMissionStep(mission, G.ageMonths + SECT_MISSION_TYPES[mission.type].workMonths);
        return;
    }
    if (mission.type === 'patrol') {
        const hq = getLocationDef(mission.headquartersId);
        const cleared = hq && getSectPatrolCapability(npc) >= getSectPatrolRequirement(hq);
        if (cleared) {
            addSectRenown(1);
            finishSectMission(mission, true, 'Local roads patrolled. The sect earned renown.');
        } else {
            const hadRenown = G.sect.renown > 0;
            addSectRenown(-1);
            finishSectMission(mission, false, hadRenown
                ? 'The patrol withdrew from trouble on the road. The sect lost 1 Renown.'
                : 'The patrol withdrew from trouble on the road.');
        }
        return;
    }
    if (!returning) {
        const result = transferFromResourceSource({
            sourceId: mission.sourceId, resourceId: 'spirit_herb', amount: 1, actorId: npc.uid,
            requireLocationId: mission.destinationId, acquisitionKey: mission.id,
            receiver: { kind: 'sect_mission_cargo', credit: amount => { mission.herbs = amount; } }
        });
        if (!result.ok) mission.gatherFailure = 'The disciple could not collect herbs from the patch.';
        if (mission.destinationId !== mission.headquartersId) {
            const journey = beginNpcJourney(npc, {
                destinationId: mission.headquartersId, method: 'walk', purpose: 'sect_mission'
            });
            if (!journey.ok) {
                finishSectMission(mission, false, 'The disciple could not make the return journey.');
                return;
            }
            mission.phase = 'return';
            scheduleSectMissionStep(mission, journey.arrivesAtMonths);
            return;
        }
    }
    if (mission.gatherFailure) finishSectMission(mission, false, mission.gatherFailure);
    else if (addSectInventoryMaterial('spirit_herb', mission.herbs) > 0) {
        finishSectMission(mission, true, `Delivered ${mission.herbs} Spirit Herb to the sect stores.`);
    } else finishSectMission(mission, false, 'Sect stores were full and could not accept the herbs.');
}

function endSectMissionMembership(uid) {
    const department = G.sect?.missionDepartment;
    if (!department) return;
    for (const mission of getActiveSectMissions()) {
        if (mission.npcUid === uid) finishSectMission(mission, false, 'The assigned disciple left the roster.');
    }
    if (department.proposal?.npcUid === uid) department.proposal = null;
    if (department.elderUid === uid) dismissSectMissionElder();
}

function closeSectMissionDepartment() {
    const department = G.sect?.missionDepartment;
    if (!department) return;
    for (const mission of getActiveSectMissions()) finishSectMission(mission, false, 'The sect collapsed.');
    department.proposal = null;
    department.elderUid = null;
    setSectMissionMode('direct');
}

function reviewSectMissions() {
    const department = G.sect?.missionDepartment;
    if (!department || department.mode === 'direct' || !isSectFounded() || G.gameOver) return;
    const elder = getSectMissionElder();
    if (!elder) {
        dismissSectMissionElder();
        return;
    }
    scheduleSectMissionReview();
    const hq = getSectMissionHeadquarters();
    if (!hq || G.sectSuccessionActive || department.proposal || getActiveSectMissions().length >= SECT_MISSION_LIMIT
        || npcTravelCondition(elder) || isNpcTravelling(elder) || isNpcTravelBodyUnresolved(elder)
        || isDiscipleStudying(elder.uid) || !isNpcLocalToSectHeadquarters(elder, hq)) return;
    const priorities = department.safety === 'gathering_only' ? ['gather']
        : [department.priority, department.priority === 'gather' ? 'patrol' : 'gather'];
    for (const type of priorities) {
        const carefulPatrol = type === 'patrol' && elder.personalities?.includes('careful');
        const candidates = getSectDiscipleMemberships()
            .map(member => planSectMission(member.uid, type, true))
            .filter(plan => plan.npc)
            .map(plan => ({ ...plan, capability: getSectPatrolCapability(plan.npc) }))
            .filter(plan => !carefulPatrol || plan.capability > getSectPatrolRequirement(plan.hq));
        candidates.sort((a, b) => b.capability - a.capability || a.npc.uid.localeCompare(b.npc.uid));
        const npc = candidates[0]?.npc;
        if (!npc) continue;
        if (department.mode === 'supervised') {
            department.proposal = { type, npcUid: npc.uid };
            addLog(`${elder.name} proposed a sect assignment for ${npc.name}.`);
        } else assignSectMission(npc.uid, type, true);
        return;
    }
}

function decideSectMissionProposal(approve) {
    const department = G.sect?.missionDepartment;
    if (department?.mode !== 'supervised' || !department.proposal || !getSectMissionElder()) {
        return { success: false, message: 'No proposal is available.' };
    }
    const proposal = department.proposal;
    department.proposal = null;
    if (!approve) return { success: true, message: 'Proposal declined.' };
    return assignSectMission(proposal.npcUid, proposal.type, true);
}

registerWorldEventHandler('sect_mission_step', resolveSectMissionStep);
registerWorldEventHandler('sect_mission_review', reviewSectMissions);
