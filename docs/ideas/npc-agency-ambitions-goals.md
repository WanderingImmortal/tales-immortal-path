# NPC agency — Phase E (ambitions & goal pursuit)

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | none for first slice |
| **Issue** | none yet |
| **Chat / PR** | `cursor/npc-ambitions-goals` · [#201](https://github.com/WanderingImmortal/tales-immortal-path/pull/201)–[#205](https://github.com/WanderingImmortal/tales-immortal-path/pull/205) |
| **Updated** | 2026-11-05 |

**Hub:** [`npc-agency-well-ring.md`](npc-agency-well-ring.md) · [`npc-agency-contextual-decisions.md`](npc-agency-contextual-decisions.md)

## Intent

Connect foundations → runtime ambitions → actionable goals → contextual action choice → real consequences. First vertical slice: **Wei Shun** pursues cultivation advancement by acquiring spirit herbs through lodge duty or risky theft.

## Runtime schemas

### Ambition (`G.npcAmbitions`)

| Field | Notes |
|-------|-------|
| `id`, `actorId`, `type` | Stable runtime identity |
| `priority`, `commitment`, `perceivedFeasibility` | 0–1 |
| `status` | `active` · `suspended` · `fulfilled` · `abandoned` |
| `origin` | e.g. `foundation_seed` |
| `foundationRef` | Points at foundation ambition id — **does not mutate** foundations |
| `target`, `progress`, `historyRefs` | Optional |
| `lastReconsiderAtMonths` | Shared clock |

Foundation ambitions in `npc-foundations.js` remain authored/procedural character data.

### Goal (`G.npcGoals`)

Parent ambition, `type` (e.g. `acquire_cultivation_resources`), `target`, `constraints`, attempt counters, status.

### Attempts (`G.npcGoalAttempts`)

Bounded per-actor history of action attempts (decision id, effects, success).

### Minimal resources

`npc.cultivationPouch.spiritHerbs` — smallest coherent pouch for this slice (not a full NPC economy).

## Goal generation

When Wei has an active `cultivation_advancement` ambition and herbs &lt; need (3), create/keep `acquire_cultivation_resources`. When herbs ≥ need, consume a batch → `growthProgress` boost → complete goal → bump ambition progress.

## Actions (executable)

| Action | Preconditions | Consequences |
|--------|---------------|--------------|
| `earn_lodge_duty` | Alive Wei | +1 rival lodge merit; chance of 1 herb stipend |
| `steal_lodge_storehouse` | Alive Wei | Success: +2 herbs + theft incident; may fail; may be detected → Liang report/belief (**not** auto accusation thread, **not** omniscient dump) |

Selection uses `resolveNpcContextualDecision` with Wei personalities (ambitious/bold soft-boost theft).

## Scheduling

- Shared clock via `registerWorldTick('npcAmbitions')`
- Every **4** months, **22%** chance, focused **Wei only**
- **3**-month attempt cooldown; in-flight guard; no global NPC scans
- Developer: `startWeiShunCultivationPursuitScenario({ seed, forceAction, startingHerbs })`
- Inspect: `inspectNpcAmbitionRuntime(actorId)` (developer-facing)

## Reconsideration (minimal)

Success nudges feasibility up; failure down slightly. Abandon/suspend only after repeated failure **and** low commitment/feasibility. One miss does not erase ambition.

## Known limitations

- Only Wei cultivation slice activated from foundations
- No full NPC economy / GOAP / personality evolution
- Natural theft does not auto-start Well-Ring accusation situations (incident + optional report only)
- Some foundation fields still unused by the decision resolver (#205)

## Implementation

- [`npc-ambitions.js`](../../npc-ambitions.js)
- Tests: `scripts/test-npc-ambitions-goals.js`
