// Organisation foundations — capability vs institution vs constraints vs public standing.
// Pure derivation (headless-testable) + save migration / public UI helpers.

const ORG_FOUNDATIONS_VERSION = 1;

const ORG_KIND_LABELS = {
    school: 'Cultivation school',
    hall: 'City hall',
    lesser_sect: 'Lesser sect'
};

const INSTITUTIONAL_MATURITY_LABELS = {
    nascent: 'Nascent institution',
    established: 'Established institution',
    rooted: 'Rooted institution'
};

function countMembersByRealm(members) {
    const counts = {};
    (members || []).forEach(m => {
        const r = m.realmIdx ?? 0;
        counts[r] = (counts[r] || 0) + 1;
    });
    return counts;
}

function getApexRealmIdx(members) {
    let max = 0;
    (members || []).forEach(m => {
        if ((m.realmIdx ?? 0) > max) max = m.realmIdx;
    });
    return max;
}

function countSuccessionDepth(members, apexRealm) {
    const threshold = Math.max(0, apexRealm - 1);
    return (members || []).filter(m => (m.realmIdx ?? 0) >= threshold && m.alive !== false).length;
}

function facilityTierFromLocation(loc) {
    if (!loc) return 0;
    if (loc.type === 'sect_hq') return 2;
    if (loc.type === 'city') return loc.cityTier === 1 ? 2 : (loc.cityTier === 4 ? 0 : 1);
    if (loc.type === 'outpost') return 1;
    if (loc.type === 'wilderness' && loc.resources?.length >= 2) return 1;
    return 0;
}

function combatBandFromMembers(members, doctrine) {
    const apex = getApexRealmIdx(members);
    const total = (members || []).reduce((s, m) => s + (m.realmIdx ?? 0), 0);
    let score = total + apex * 2;
    if (doctrine === 'shadow') score *= 1.08;
    if (doctrine === 'righteous') score *= 1.02;
    if (score <= 4) return 'minimal';
    if (score <= 10) return 'low';
    if (score <= 18) return 'moderate';
    return 'high';
}

function deriveInstitutionalMaturity(sect, context) {
    context = context || {};
    const members = sect.members || [];
    const ageMonths = Math.max(0, (context.worldAgeMonths ?? 0) - (sect.foundedAtMonths ?? 0));
    const apex = getApexRealmIdx(members);
    const successionDepth = countSuccessionDepth(members, apex);
    const facilityTier = context.facilityTier ?? 0;
    const memberCount = members.length;

    if (ageMonths >= 240 && memberCount >= 7 && successionDepth >= 2 && facilityTier >= 1) {
        return 'rooted';
    }
    if (ageMonths >= 72 && memberCount >= 5 && successionDepth >= 1) {
        return 'established';
    }
    return 'nascent';
}

function deriveOrgKind(sect, context) {
    if (sect.orgKind) return sect.orgKind;
    if (sect.size === 'school') return 'school';
    const loc = context.locationDef;
    if (loc?.type === 'city' && (loc.cityTier === 1 || loc.cityTier === 2)) return 'hall';
    return 'lesser_sect';
}

function deriveInheritances(sect, context) {
    const focus = sect.focus || 'dao';
    const apex = getApexRealmIdx(sect.members);
    const zoneCap = context.zoneLeaderRealmCap ?? 2;
    const publicCeiling = Math.min(zoneCap, Math.max(1, apex));
    const internalCeiling = Math.min(zoneCap + 1, publicCeiling + 1);

    const publicAssets = [{
        id: `${focus}_primer`,
        kind: 'method',
        label: `${sect.focusLabel || focus} primer manual`,
        ceilingRealmIdx: publicCeiling,
        access: 'Outer disciples — oath and service',
        grantsBreakthrough: false
    }];

    const internalAssets = [];
    if (internalCeiling > apex) {
        internalAssets.push({
            id: `${focus}_fragment`,
            kind: 'fragment',
            label: `Incomplete ${focus} inheritance`,
            ceilingRealmIdx: internalCeiling,
            usableByMaxRealmIdx: apex,
            access: 'Patriarch vault — rank and trust',
            grantsBreakthrough: false
        });
    }

    return { public: publicAssets, internal: internalAssets };
}

function deriveGrowthConstraints(sect, context) {
    const constraints = [];
    const members = sect.members || [];
    const apex = getApexRealmIdx(members);
    const zoneCap = context.zoneLeaderRealmCap ?? 2;
    const maturity = context.institutionalMaturity || deriveInstitutionalMaturity(sect, context);
    const orgKind = context.orgKind || deriveOrgKind(sect, context);
    const loc = context.locationDef;
    const abundance = loc?.resourceProfile?.abundance;

    if (orgKind === 'school') {
        constraints.push({
            code: 'school_scale',
            label: 'Hall-scale roster — not a mountain sect charter',
            blocksAscension: true,
            category: 'classification'
        });
    }

    if (maturity === 'nascent') {
        constraints.push({
            code: 'institution_youth',
            label: 'Administrative depth still forming',
            blocksAscension: true,
            category: 'institution'
        });
    }

    if (apex >= zoneCap) {
        constraints.push({
            code: 'regional_vein_ceiling',
            label: 'Local veins and talent pool thin above current apex',
            blocksAscension: true,
            category: 'environment'
        });
    }

    if (abundance === 'sparse' || abundance === 'low') {
        constraints.push({
            code: 'resource_scarcity',
            label: 'Sparse materials for expansion or array work',
            blocksAscension: true,
            category: 'resources'
        });
    }

    if (members.length < 6) {
        constraints.push({
            code: 'talent_pool',
            label: 'Too few disciples to sustain outer court rotation',
            blocksAscension: true,
            category: 'talent'
        });
    }

    return constraints;
}

function derivePoliticalStanding(sect, context) {
    const capability = context.capability || {};
    const foundation = context.foundation || {};
    const maturity = context.institutionalMaturity || 'nascent';
    const apex = capability.apexRealmIdx ?? 0;

    let publicRenown = 5 + (sect.members?.length || 0) * 2;
    if (maturity === 'established') publicRenown += 8;
    if (maturity === 'rooted') publicRenown += 14;
    publicRenown = Math.min(60, publicRenown);

    const actualBand = capability.combatBand || 'low';
    const bandRank = { minimal: 0, low: 1, moderate: 2, high: 3 };
    let perceivedRank = bandRank[actualBand] ?? 1;
    if (foundation.rumorShield) perceivedRank = Math.min(3, perceivedRank + 1);
    const perceivedThreatBand = ['minimal', 'low', 'moderate', 'high'][perceivedRank];

    return {
        publicRenown,
        perceivedThreatBand,
        actualThreatBand: actualBand,
        rumorNote: foundation.rumorShield || null,
        patronFactionId: null,
        alliances: []
    };
}

function resolveOrganizationMembers(sect, context) {
    const roster = (sect && sect.members) || [];
    const npcs = context && context.worldNpcs;
    if (!Array.isArray(npcs)) return roster.map(m => ({ ...m }));
    const byUid = new Map();
    npcs.forEach(n => {
        if (n && n.uid) byUid.set(n.uid, n);
    });
    return roster.map(m => {
        const npc = byUid.get(m.uid);
        if (!npc) return { ...m };
        return {
            ...m,
            name: npc.name != null ? npc.name : m.name,
            realmIdx: npc.realmIdx != null ? npc.realmIdx : (m.realmIdx ?? 0),
            ageMonths: npc.ageMonths != null ? npc.ageMonths : m.ageMonths,
            zone: npc.zone != null ? npc.zone : m.zone,
            alive: npc.alive !== false
        };
    });
}

function deriveOrganizationProfile(sect, context) {
    context = context || {};
    if (!sect) return null;

    const resolved = resolveOrganizationMembers(sect, context);
    const members = resolved.filter(m => m.alive !== false);
    const view = Object.assign({}, sect, { members });

    const apexRealmIdx = getApexRealmIdx(members);
    const locationDef = context.locationDef || null;
    const facilityTier = context.facilityTier ?? facilityTierFromLocation(locationDef);
    const worldAgeMonths = context.worldAgeMonths ?? 0;
    const ageMonths = Math.max(0, worldAgeMonths - (sect.foundedAtMonths ?? 0));

    const orgKind = deriveOrgKind(view, { locationDef });
    const institutionalMaturity = deriveInstitutionalMaturity(view, {
        worldAgeMonths,
        facilityTier
    });

    const capability = {
        apexRealmIdx,
        memberCount: members.length,
        elderDepth: countSuccessionDepth(members, apexRealmIdx),
        combatBand: combatBandFromMembers(members, sect.doctrine),
        byRealm: countMembersByRealm(members)
    };

    const foundation = {
        institutionalMaturity,
        ageMonths,
        facilityTier,
        successionDepth: capability.elderDepth,
        stabilityScore: Math.min(100, 30 + ageMonths / 6 + facilityTier * 8 + capability.elderDepth * 5),
        rumorShield: ageMonths >= 120 && institutionalMaturity !== 'nascent'
            ? 'Elders still speak of a protector who might answer an insult'
            : null
    };

    const inheritances = deriveInheritances(view, {
        zoneLeaderRealmCap: context.zoneLeaderRealmCap
    });

    const growthConstraints = deriveGrowthConstraints(view, {
        institutionalMaturity,
        orgKind,
        locationDef,
        zoneLeaderRealmCap: context.zoneLeaderRealmCap
    });

    const standing = derivePoliticalStanding(view, {
        capability,
        foundation,
        institutionalMaturity
    });

    return {
        version: ORG_FOUNDATIONS_VERSION,
        orgKind,
        orgKindLabel: ORG_KIND_LABELS[orgKind] || orgKind,
        institutionalMaturity,
        institutionalMaturityLabel: INSTITUTIONAL_MATURITY_LABELS[institutionalMaturity] || institutionalMaturity,
        capability,
        foundation,
        inheritances,
        growthConstraints,
        standing
    };
}

/** Remove a member but keep institutional assets (decline scenario). */
function deriveOrganizationAfterMemberLoss(sect, lostUid, context) {
    const nextMembers = (sect.members || []).filter(m => m.uid !== lostUid);
    const nextSect = { ...sect, members: nextMembers };
    if (nextSect.leaderNpcUid === lostUid) {
        const sorted = nextMembers.slice().sort((a, b) => (b.realmIdx ?? 0) - (a.realmIdx ?? 0));
        nextSect.leaderNpcUid = sorted[0]?.uid || null;
    }
    const profile = deriveOrganizationProfile(nextSect, context);
    return { sect: nextSect, profile };
}

function canAscendOrganization(profile) {
    if (!profile?.growthConstraints?.length) return true;
    return !profile.growthConstraints.some(c => c.blocksAscension);
}

function applyExceptionalGrowthRelief(profile, reliefCode) {
    const next = JSON.parse(JSON.stringify(profile));
    next.growthConstraints = (next.growthConstraints || []).filter(c => c.code !== reliefCode);
    next.foundation = next.foundation || {};
    next.foundation.lastException = reliefCode;
    return next;
}

function enrichLesserSectOrganization(sect, context) {
    const profile = deriveOrganizationProfile(sect, context);
    return { ...sect, organization: profile, organizationVersion: ORG_FOUNDATIONS_VERSION };
}

function buildOrganizationContextForSect(sect) {
    const locId = sect.headquartersLocationId;
    const locationDef = typeof getLocationDef === 'function' ? getLocationDef(locId) : null;
    const zoneCap = typeof LESSER_SECT_ZONE_LEADER_REALM_CAP !== 'undefined'
        ? (LESSER_SECT_ZONE_LEADER_REALM_CAP[sect.zone] ?? 2)
        : 2;
    return {
        locationDef,
        zoneLeaderRealmCap: zoneCap,
        worldAgeMonths: typeof G !== 'undefined' ? (G.ageMonths || 0) : 0,
        worldNpcs: (typeof G !== 'undefined' && Array.isArray(G.worldNpcs)) ? G.worldNpcs : null
    };
}

function migrateOrganizationProfilesForExistingSave() {
    if (typeof ensureWorldRoot === 'function') ensureWorldRoot();
    const sects = G.world?.lesserSects?.sects;
    if (!sects?.length) return;
    G.world.lesserSects.sects = sects.map(sect => {
        if (sect.organization?.version === ORG_FOUNDATIONS_VERSION) return sect;
        return enrichLesserSectOrganization(sect, buildOrganizationContextForSect(sect));
    });
}

function enrichAllLesserSectOrganizations(state) {
    if (!state?.sects) return state;
    return {
        ...state,
        sects: state.sects.map(sect => enrichLesserSectOrganization(sect, {
            locationDef: null,
            zoneLeaderRealmCap: 2,
            worldAgeMonths: state.generatedAtMonths || 0
        }))
    };
}

function getPublicOrganizationBrief(sect, context) {
    if (!sect) return null;
    if (!context && typeof buildOrganizationContextForSect === 'function') {
        context = buildOrganizationContextForSect(sect);
    }
    context = context || {};
    const org = Array.isArray(context.worldNpcs)
        ? deriveOrganizationProfile(sect, context)
        : (sect.organization || deriveOrganizationProfile(sect, context));
    if (!org) return null;

    const resolved = resolveOrganizationMembers(sect, context);
    const leader = resolved.find(m => m.uid === sect.leaderNpcUid);
    const leaderName = leader?.name || 'Unknown leader';
    const leaderDead = !!(leader && leader.alive === false);
    const leaderRealm = leader?.realmIdx ?? org.capability?.apexRealmIdx ?? 0;
    const realmLabel = leaderDead
        ? 'deceased'
        : (typeof PATHS !== 'undefined' && G?.path
            ? (PATHS[G.path]?.realms[leaderRealm] || `Realm ${leaderRealm + 1}`)
            : `Realm idx ${leaderRealm}`);

    const publicMethods = (org.inheritances?.public || []).map(a => a.label).join('; ');

    return {
        name: sect.name,
        orgKindLabel: org.orgKindLabel,
        maturityLabel: org.institutionalMaturityLabel,
        focusLabel: sect.focusLabel || sect.focus,
        leaderName,
        leaderRealmLabel: realmLabel,
        memberCount: org.capability?.memberCount ?? sect.members?.length ?? 0,
        publicRenown: org.standing?.publicRenown ?? 0,
        perceivedThreat: org.standing?.perceivedThreatBand ?? 'low',
        rumorNote: org.standing?.rumorNote || '',
        publicInheritancesLabel: publicMethods || 'Outer primer only (rumored)',
        growthSummary: (org.growthConstraints || []).slice(0, 2).map(c => c.label).join(' · ')
    };
}

function renderPublicOrganizationHtml(sect) {
    const brief = getPublicOrganizationBrief(sect);
    if (!brief) return '';

    return `<div class="local-lesser-sect-panel local-org-public-panel">
        <strong>🏯 ${escapeHtml(brief.name)}</strong>
        <div class="local-lesser-sect-meta">${escapeHtml(brief.orgKindLabel)} · ${escapeHtml(brief.maturityLabel)}</div>
        <ul class="local-org-public-list">
            <li><strong>Leader (known):</strong> ${escapeHtml(brief.leaderName)} — ${escapeHtml(brief.leaderRealmLabel)}</li>
            <li><strong>Roster (public estimate):</strong> ~${brief.memberCount} cultivators</li>
            <li><strong>Focus:</strong> ${escapeHtml(brief.focusLabel || '')}</li>
            <li><strong>Standing:</strong> renown ${brief.publicRenown} · perceived threat ${escapeHtml(brief.perceivedThreat)}</li>
            <li><strong>Known manuals:</strong> ${escapeHtml(brief.publicInheritancesLabel)}</li>
            ${brief.rumorNote ? `<li><strong>Jianghu talk:</strong> ${escapeHtml(brief.rumorNote)}</li>` : ''}
            ${brief.growthSummary ? `<li><strong>Local limits (whispered):</strong> ${escapeHtml(brief.growthSummary)}</li>` : ''}
        </ul>
        <p class="local-org-disclaimer">What you see is what travelers repeat — not vault inventories or hidden elders.</p>
    </div>`;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ORG_FOUNDATIONS_VERSION,
        deriveOrganizationProfile,
        deriveOrganizationAfterMemberLoss,
        enrichLesserSectOrganization,
        resolveOrganizationMembers,
        canAscendOrganization,
        applyExceptionalGrowthRelief,
        getPublicOrganizationBrief,
        deriveInstitutionalMaturity,
        getApexRealmIdx
    };
}
