# NPC agency — Phase C (incidents & imperfect knowledge)

| Field | Value |
|-------|-------|
| **Status** | `building` (Phase C shipped; Phase D consumes this) |
| **Blocked on** | rumour deferred; chooser/threads — [`npc-agency-contextual-decisions.md`](npc-agency-contextual-decisions.md) |
| **Issue** | none yet |
| **Chat / PR** | [PR #204](https://github.com/WanderingImmortal/tales-immortal-path/pull/204) · Phase A [#201](https://github.com/WanderingImmortal/tales-immortal-path/pull/201) · Phase B [#202](https://github.com/WanderingImmortal/tales-immortal-path/pull/202) · consistency [#203](https://github.com/WanderingImmortal/tales-immortal-path/pull/203) |
| **Updated** | 2026-11-05 |

**Hub:** [`npc-agency-well-ring.md`](npc-agency-well-ring.md) · [`npc-agency-foundations-ties.md`](npc-agency-foundations-ties.md) · [`jianghu-situation-threads.md`](jianghu-situation-threads.md)

## Intent

Persist significant world incidents as **objective** records, plus per-NPC **observations** and **beliefs** that may be partial, wrong, or contradictory. Future decision logic must read an actor’s knowledge view — never the objective ledger as memory.

## Information boundaries

| Layer | Meaning | Who may read |
|-------|---------|--------------|
| **Incident** | What actually happened (`facts`) | Tooling, tests, future situation-thread engine |
| **Observation** | What one NPC perceived or was told | That observer + APIs keyed by observer id |
| **Belief** | What one NPC currently accepts / suspects | That believer + `getNpcKnownAboutIncident` |

Proximity alone does **not** grant knowledge. Creating an incident grants knowledge to **no one**. NPCs must not learn by querying `getNpcIncidentObjective`.

## Schemas

### Incident (`G.npcIncidents`)

```
{
  version, nextSeq,
  byId: { [id]: Incident },
  order: string[],
  archived: { [id]: Incident }
}
```

Incident fields:

| Field | Notes |
|-------|-------|
| `id` | Stable unique id (`inc_<months>_<seq>` or caller-supplied) |
| `type` | `theft`, `slight`, `insult`, `robbery`, `kill`, `humiliation_public`, `betrayal`, `spare`, `assault`, `dispute`, `other` |
| `atMonths` | Shared world clock (`G.ageMonths`) |
| `zoneId` / `locationId` / `orgId` | Optional place / institution |
| `severity` | 1–5 |
| `participants[]` | `{ id, role, kind? }` — world uid / story id / `player` / `unknown` |
| `facts` | **Objective only** — not universal knowledge |
| `relatedIncidentIds` | Optional graph links |
| `pinned` | Skip archive eligibility |
| `archived` | Soft archive flag when moved to `archived` |

### Observation (`G.npcObservations`)

| Field | Notes |
|-------|-------|
| `id` | `obs_<months>_<seq>` |
| `observerId` | NPC uid / id |
| `incidentId` | Reference |
| `atMonths` | Observation time |
| `source` | e.g. `direct`, `report` |
| `direct` / `secondhand` | Derived flags |
| `details` | Partial / possibly inaccurate payload — **not** a full copy of `facts` |
| `confidence` | 0–1 |

Created only via `recordNpcObservation` (no automatic witness fan-out).

### Belief (`G.npcBeliefs`)

| Field | Notes |
|-------|-------|
| `id` | `bel_<months>_<seq>` |
| `believerId` | NPC uid / id |
| `incidentId` | Optional subject |
| `claimTopic` | e.g. `culprit`, `outcome`, `what`, `general` |
| `claim` | Structured proposition the NPC accepts |
| `confidence` | 0–1 |
| `source` / `sourceObservationIds` | Provenance |
| `conflictsWith` | Keys of conflicting claims (same believer + topic) |
| `updatedAtMonths` / `createdAtMonths` | Shared clock |

Beliefs are **not** auto-corrected from objective `facts`.

## Public APIs

| API | Role |
|-----|------|
| `createNpcIncident(spec)` | Objective record; no knowledge grant |
| `getNpcIncidentObjective(id)` | Omniscient read — **not** for NPC memory |
| `listNpcIncidents(options)` | Filter tooling |
| `recordNpcObservation(spec)` | Explicit partial observation |
| `getNpcObservationsFor` / `OfIncident` | Lookup |
| `formNpcBelief(spec)` / `updateNpcBelief(id, patch, { mode })` | Explicit belief form/update |
| `getNpcBeliefsFor` / `getNpcBeliefAboutIncident` | Actor beliefs |
| `getNpcKnownAboutIncident(believerId, incidentId)` | **Safe** decision view (beliefs + own observations only) |
| `npcKnowsAboutIncident` | Boolean isolation helper |
| `pruneNpcIncidentLedger` | Retention |
| `migrateNpcIncidentsForExistingSave` | Idempotent load migrate |
| `createWellRingTheftKnowledgeExample` | Dev/test fixture (not a quest) |

### Belief update modes

- `evidence` (default): replace claim only if incoming confidence ≥ existing; weaker claims append to `conflictsWith`
- `reinforce`: same claim raises confidence; conflicting claim needs clear margin
- `force`: caller override

## Retention

`NPC_INCIDENT_RETENTION`:

- Soft-archive mild unreferenced incidents older than `archiveOlderThanMonths`
- Cap active (`maxActiveIncidents`) by archiving oldest eligible
- Cap archived; drop only unreferenced archives
- Observations / beliefs capped; cited observations kept preferentially
- **Never** delete incidents still referenced by observations, beliefs, pins, or `relatedIncidentIds`

## Well-Ring fixture

`createWellRingTheftKnowledgeExample()`:

1. Objective theft at the lodge (`culpritId` on `facts`)
2. Wei Shun direct partial observation (sash colour; may not identify face)
3. Wei belief that may name the **wrong** culprit
4. Master Liang knows **nothing** unless an explicit report/observation is recorded

Uses existing cast ids (`wr_wei_shun`, `wr_master_liang`) — no new thief NPC.

## Save / migration

- Old saves: `migrateNpcIncidentsForExistingSave` creates empty stores; foundations / ties / personalities untouched
- New records JSON-persist on `G.npcIncidents` / `npcObservations` / `npcBeliefs`
- Repeated migrate rebuilds indexes only (idempotent)
- Stable caller ids (`inc_wr_theft_example`, …) do not collide on reload
- Missing / dead participant ids are stored as strings; lookups tolerate absence

## Implemented vs deferred

**This PR:** ledger, observations, beliefs, APIs, retention, fixture, tests, docs.

**Deferred:** autonomous NPC decisions, rumour propagation, automatic witness detection, situation threads, jealousy/favouritism, psychological belief revision, global event log / second clock.

## Future integration

- Situation threads ([`jianghu-situation-threads.md`](jianghu-situation-threads.md)) should spawn from / attach to incident ids and read per-actor knowledge via `getNpcKnownAboutIncident`
- Rumour systems should write observations/beliefs explicitly — never broadcast objective `facts`
- Chooser / agency resolver (later phase) consumes beliefs + foundations + ties

## Implementation

- [`npc-incidents.js`](../../npc-incidents.js)
- Wire: `core.js` defaults + load migrate · `main.js` new-game clear · `index.html` script after ties
- Tests: `scripts/test-npc-incidents-beliefs.js`
