# NPC agency — emergent action → reaction chain

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | none for first slice |
| **Issue** | none yet |
| **Chat / PR** | [PR #207](https://github.com/WanderingImmortal/tales-immortal-path/pull/207) · [#205](https://github.com/WanderingImmortal/tales-immortal-path/pull/205)–[#206](https://github.com/WanderingImmortal/tales-immortal-path/pull/206) |
| **Updated** | 2026-11-06 |

**Hub:** [`npc-agency-ambitions-goals.md`](npc-agency-ambitions-goals.md) · [`npc-agency-contextual-decisions.md`](npc-agency-contextual-decisions.md) · [`npc-agency-incidents-beliefs.md`](npc-agency-incidents-beliefs.md)

## Intent

Connect Wei’s autonomous cultivation pursuit (#206) to Liang’s situational responses (#205) so an NPC can change the world and another can react from **what they actually know** — without scripting a theft-and-punishment storyline or manufacturing guilt.

## Causal chain (not a script)

```
Wei pursues resource goal
  → attempt (duty | theft)
  → success / fail / detect (objective resolution)
  → physical storehouse loss (may be undiscovered)
  → later routine inspection discovers missing stock (no culprit)
     OR detection report gives Liang a subjective suspect
  → Well-Ring situation thread (loss-focused or accused)
  → Liang contextual decision (ignore / defer / investigate / …)
  → outcome (intention ≠ guarantee)
```

## Layer distinctions

| Layer | Store | Notes |
|-------|-------|-------|
| Long-term ambition fulfilment | `G.npcAmbitions` | Realm target only (#206) |
| Short-term goal completion | `G.npcGoals` | Herb batch ≠ ambition fulfilment |
| Physical world loss | `G.wellRing.storehouse` | Stock can fall before anyone notices |
| Objective incident | `G.npcIncidents` | `facts.culpritId` never enters decisions |
| Observations / beliefs | `G.npcObservations` / `G.npcBeliefs` | Actor-specific |
| Subjective action difficulty | ambition perception | Scoring only (#206) |
| Objective action resolution | ambition executor RNG | Success / detect |
| Social decision / outcome | `G.npcDecisions` / situations | #205 machinery |

## Physical losses

`G.wellRing.storehouse`:

- `herbStock` — minimal counter (not a full inventory)
- `lossesById` — `{ amount, incidentId, trueCulpritId, discovered, reactionThreadId, … }`
- `pendingDiscoveryIds` — undiscovered losses
- `trueCulpritId` is **tooling/objective only** — decision resolvers must not read it

Successful theft records a loss. Failed theft does not. Undetected success does **not** inform Liang.

## Discovery

`registerWorldTick('wellRingStorehouse')` — every **3** months, **55%** chance to notice **one** pending loss (not same month as theft). Establishes missing stock only.

`forceDiscoverWellRingStorehouseLoss` — developer/test.

## Observations & beliefs

- Discovery → Liang **loss** observation/belief (`missingStock`); **no** culprit claim
- Detection report → existing moderate rumour belief about a suspect + emergent situation
- Direct implication → `applySubjectiveAccusedImplication` only when subjective details name someone
- Incorrect but credible accusations remain allowed

## Liang’s response

`notifyWellRingStorehouseLossDiscovered` / `notifyWellRingMisconductReport` → `beginWellRingResourceAccusation` (loss-focused or accused).

Reuses #205 options: ignore, defer, investigate, speak, warn, formal_discipline (discipline still gated by subjective implication).

## Developer interface

`runWellRingActionReactionScenario(kind, options)`:

| Kind | Intent |
|------|--------|
| `theft_undetected_never_discovered` | Loss exists; Liang unaware |
| `theft_undetected_later_discovery` | Delayed discovery; culprit unknown |
| `theft_directly_observed` | Credible identification of Wei |
| `theft_failed_no_witness` | No loss; Liang unaware |
| `suspicion_innocent_disciple` | Wrong accused possible |
| `liang_learns_loss_inaction` | Inaction legitimate |

`forceTheftOutcome` / `forceChoice` only when `developer: true`.

## Known limitations

- Well-Ring / Wei–Liang slice only
- No rumour propagation or stealth sim
- Fallback natural accusation may still invent a weak anonymous rumour when no real loss exists
- Storehouse is a counter + loss ledger, not an economy

## Implementation

- [`well-ring-lodge.js`](../../well-ring-lodge.js) — storehouse ledger + inspection tick
- [`npc-ambitions.js`](../../npc-ambitions.js) — theft → loss; detection → misconduct notify
- [`npc-situations.js`](../../npc-situations.js) — discovery/report hooks + scenarios
- Tests: `scripts/test-npc-action-reaction-chain.js`
