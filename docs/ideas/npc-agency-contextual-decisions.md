# NPC agency — Phase D (contextual decisions & Well-Ring accusation)

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | none for first pack; rumour / full thread packs deferred |
| **Issue** | none yet |
| **Chat / PR** | [PR #205](https://github.com/WanderingImmortal/tales-immortal-path/pull/205) · [#201](https://github.com/WanderingImmortal/tales-immortal-path/pull/201)–[#204](https://github.com/WanderingImmortal/tales-immortal-path/pull/204) |
| **Updated** | 2026-11-05 |

**Hub:** [`npc-agency-well-ring.md`](npc-agency-well-ring.md) · [`npc-agency-incidents-beliefs.md`](npc-agency-incidents-beliefs.md) · [`jianghu-situation-threads.md`](jianghu-situation-threads.md)

## Intent

First end-to-end autonomous social beat: an NPC evaluates a situation from **their own** knowledge, character, ties and authority; chooses an **intention**; an **outcome** is attempted separately; consequences persist. Well-Ring resource accusation is the first pack — the resolver and thread spine are reusable.

## Evidence layers (important)

| Layer | Meaning | Example |
|-------|---------|---------|
| **Incident facts** | Objective ledger — what happened | `facts.culpritId` |
| **Loss / misconduct belief** | Actor thinks stock is missing / something wrong | `claimTopic: 'loss'` |
| **Accused implication** | Actor’s subjective link to a **particular** person | culprit belief + implicating observation details |
| **Report strength** | How strong the secondhand accusation feels (`evidenceStrength`) | `weak` / `moderate` / `strong` |

Confirming missing resources must **not** raise confidence that a named accused stole them.

Only evidence that subjectively implicates the accused (e.g. `identifiedCulpritId` / `implicatesAccusedId` via `applySubjectiveAccusedImplication`) may strengthen a culprit belief. Objective `facts` are never consulted for that.

Incorrect but credible accusations remain allowed.

## Decision resolver (`npc-decisions.js`)

`resolveNpcContextualDecision(spec)` builds an actor context from:

- Effective personalities
- Foundation values / ambitions / convictions / attachments
- Tie stance toward the accused (if any)
- `getNpcKnownAboutIncident` (never objective `facts`)
- Institutional role / authority
- Accused availability, evidence strength, pressure

It scores pack-supplied option defs (soft weights — no “loyal always protects”), then picks among plausible eligible options (seeded RNG).

**`forceChoice`:** only when `developer` / `allowForceChoice` is set (developer scenario API). Natural gameplay strips forced choices. Forced intentions still respect **outcome** feasibility (e.g. accused unavailable → failure).

**Intention ≠ outcome.** Records live in `G.npcDecisions`.

### Known resolver gaps (future)

- Some foundation fields are stored but not yet weighted (`attachments`, `established_bonds`, `local_standing`, `no_need_for_heavens`)
- `resources` / `risks` on the decision context are placeholders
- Wei’s “important to Liang” flag in this pack is a **scenario flag**, not a persistent personal tie (lodge membership alone does not create one)

## Situation spine (`npc-situations.js`)

```
incident → thread → beat (scheduler) → decision → outcome → resolve/expire
```

Stores: `G.npcSituationThreads`, `G.npcSituationOutcomes`.

Beats use `scheduleWorldEvent('npc_situation_beat', …)` on the shared clock. A cheap `registerWorldTick('npcSituations')` expires overdue threads and runs the Well-Ring natural check — **no** global NPC-pair scans.

Active thread incident ids are pinned and hooked into `incidentIsReferenced` via `isIncidentReferencedBySituationThreads`.

**Active cap:** `maxActiveThreads` (8) — new active threads are rejected at `registerNpcSituationThread` / situation start when the cap is reached.

## Well-Ring pack: `well_ring_resource_accusation`

### Responses

| Id | Notes |
|----|-------|
| `ignore` | Inaction |
| `defer` | Delay / wait |
| `investigate` | Confirms **loss** belief; does **not** raise culprit confidence; does not reveal objective culprit |
| `speak_to_accused` | Needs accused available + belief |
| `warn` | Precautionary caution under weaker evidence — **not** a finding of guilt |
| `formal_discipline` | Hard gate: authority + available accused + **credible subjective implication** |

### Formal discipline thresholds (pack-local)

Documented constants:

- `evidenceStrength === 'strong'`
- culprit-belief `confidence >= 0.65` (`WELL_RING_FORMAL_DISCIPLINE_MIN_CONFIDENCE`)
- belief claim’s `culpritId` matches the accused under consideration

These evaluate Liang’s subjective knowledge only. They are **not** a universal rule that all future NPC punishments require objectively correct evidence — corruption / prejudice / deliberate injustice may be added later via explicit motivations.

### Developer entry

`startWellRingResourceAccusationScenario({ seed, forceChoice, evidenceStrength, liangBeliefConfidence, accusedId, trueCulpritId, accusedImportantToLiang, accusedAvailable, … })`

Same machinery as natural (`beginWellRingResourceAccusation`). Sets `developer` / `allowForceChoice` so `forceChoice` works for tests.

`applySubjectiveAccusedImplication({ observerId, incidentId, accusedId, details })` — strengthens culprit belief only when details implicate that accused.

### Natural trigger

- Every **6** months (check marker)
- Requires living hall master + lodge cast
- Does not require player presence or involvement
- **Only** reacts to real discovered-but-unreacted storehouse losses ([PR #207](https://github.com/WanderingImmortal/tales-immortal-path/pull/207)); misconduct reports open threads at report time
- Does **not** invent anonymous theft rumours without a corresponding world event
- Developer scenarios (`startWellRingResourceAccusationScenario`) remain available
- Never honours `forceChoice` on natural paths

## Player-facing

No new social UI. Results are developer-visible (`thread.meta.lastTrace`, decision/outcome stores). Private NPC-only runs do **not** auto-notify the player.

## Save / migration

`migrateNpcDecisionsForExistingSave` / `migrateNpcSituationsForExistingSave` — empty stores for old saves; re-pin active incidents; re-schedule pending beats idempotently. `decisionProcessed` prevents duplicate beats after load.

## Implemented vs deferred

**This PR:** generic resolver, thread/beat/outcome spine, Well-Ring accusation pack, natural + developer triggers, knowledge/discipline eligibility corrections, tests, docs.

**Deferred:** rumour fan-out, multi-beat political AI, sect governance, player quest mirrors, journal auto-lines, personality drift, succession, privileged disciple/child, injustice motivations, autonomous resource-theft sim.

## Implementation

- [`npc-decisions.js`](../../npc-decisions.js)
- [`npc-situations.js`](../../npc-situations.js)
- Retention hook in [`npc-incidents.js`](../../npc-incidents.js)
- Tests: `scripts/test-npc-contextual-decisions.js`
