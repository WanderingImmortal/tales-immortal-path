# NPC agency — Phase D (contextual decisions & Well-Ring accusation)

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | none for first pack; rumour / full thread packs deferred |
| **Issue** | none yet |
| **Chat / PR** | `cursor/npc-contextual-decisions` · [#201](https://github.com/WanderingImmortal/tales-immortal-path/pull/201)–[#204](https://github.com/WanderingImmortal/tales-immortal-path/pull/204) |
| **Updated** | 2026-11-05 |

**Hub:** [`npc-agency-well-ring.md`](npc-agency-well-ring.md) · [`npc-agency-incidents-beliefs.md`](npc-agency-incidents-beliefs.md) · [`jianghu-situation-threads.md`](jianghu-situation-threads.md)

## Intent

First end-to-end autonomous social beat: an NPC evaluates a situation from **their own** knowledge, character, ties and authority; chooses an **intention**; an **outcome** is attempted separately; consequences persist. Well-Ring resource accusation is the first pack — the resolver and thread spine are reusable.

## Decision resolver (`npc-decisions.js`)

`resolveNpcContextualDecision(spec)` builds an actor context from:

- Effective personalities
- Foundation values / ambitions / convictions / attachments
- Tie stance toward the accused (if any)
- `getNpcKnownAboutIncident` (never objective `facts`)
- Institutional role / authority
- Accused availability, evidence strength, pressure

It scores pack-supplied option defs (soft weights — no “loyal always protects”), then picks among plausible eligible options (seeded RNG). Developer `forceChoice` may select an ineligible intention so outcome gates can be tested.

**Intention ≠ outcome.** Records live in `G.npcDecisions`.

## Situation spine (`npc-situations.js`)

```
incident → thread → beat (scheduler) → decision → outcome → resolve/expire
```

Stores: `G.npcSituationThreads`, `G.npcSituationOutcomes`.

Beats use `scheduleWorldEvent('npc_situation_beat', …)` on the shared clock. A cheap `registerWorldTick('npcSituations')` expires overdue threads and runs the Well-Ring natural check — **no** global NPC-pair scans.

Active thread incident ids are pinned and hooked into `incidentIsReferenced` via `isIncidentReferencedBySituationThreads`.

## Well-Ring pack: `well_ring_resource_accusation`

### Responses

| Id | Notes |
|----|-------|
| `ignore` | Inaction |
| `defer` | Delay / wait |
| `investigate` | Confirms loss; **does not** reveal objective culprit |
| `speak_to_accused` | Needs accused available + belief |
| `warn` | Quiet warning; may nudge rival merit if Wei |
| `formal_discipline` | Needs authority + available accused; may create consequence incident |

### Developer entry

`startWellRingResourceAccusationScenario({ seed, forceChoice, evidenceStrength, liangBeliefConfidence, accusedId, trueCulpritId, accusedImportantToLiang, accusedAvailable, … })`

Same machinery as natural (`beginWellRingResourceAccusation`).

### Natural trigger

- Every **6** months (check marker), **8%** chance if eligible
- Requires living hall master + lodge cast; no active thread of this template; **48**-month cooldown after a natural spawn
- Does not require player presence or involvement
- Default accuse `wr_unknown_outer` with weak evidence (Wei is **not** auto-guilty)

## Player-facing

No new social UI. Results are developer-visible (`thread.meta.lastTrace`, decision/outcome stores). Private NPC-only runs do **not** auto-notify the player.

## Save / migration

`migrateNpcDecisionsForExistingSave` / `migrateNpcSituationsForExistingSave` — empty stores for old saves; re-pin active incidents; re-schedule pending beats idempotently. `decisionProcessed` prevents duplicate beats after load.

## Implemented vs deferred

**This PR:** generic resolver, thread/beat/outcome spine, Well-Ring accusation pack, natural + developer triggers, tests, docs.

**Deferred:** rumour fan-out, multi-beat political AI, sect governance, player quest mirrors, journal auto-lines, personality drift, succession, privileged disciple/child.

## Implementation

- [`npc-decisions.js`](../../npc-decisions.js)
- [`npc-situations.js`](../../npc-situations.js)
- Retention hook in [`npc-incidents.js`](../../npc-incidents.js)
- Tests: `scripts/test-npc-contextual-decisions.js`
