# NPC agency — Phase B (foundations & sparse ties)

| Field | Value |
|-------|-------|
| **Status** | `building` (Phase B shipped; personality sync in #203) |
| **Blocked on** | Phase C building — [`npc-agency-incidents-beliefs.md`](npc-agency-incidents-beliefs.md) |
| **Issue** | none yet |
| **Chat / PR** | [PR #202](https://github.com/WanderingImmortal/tales-immortal-path/pull/202) · consistency [`npc-personality-consistency.md`](npc-personality-consistency.md) |
| **Updated** | 2026-11-05 |

**Hub:** [`npc-agency-well-ring.md`](npc-agency-well-ring.md) · [`jianghu-situation-threads.md`](jianghu-situation-threads.md)

## Intent

Stable character foundations (values, ambitions, convictions, attachments) plus sparse NPC–NPC ties — data and APIs only. No decision resolver, incidents, or personality drift.

## Schema crumbs

### Foundation (authored catalog or procedural blob)

- `personalities[]` — catalogue **defaults** only; effective traits = live `npc.personalities` / story defs ([`npc-personality-consistency.md`](npc-personality-consistency.md))
- `values[{ id, weight 0–1 }]`
- `ambitions[{ id, priority 0–1 }]`
- `convictions[{ id, strength 0–1 }]`
- `attachments[{ id, kind, strength, label? }]`
- Authored: `NPC_CHARACTER_FOUNDATIONS[actorId]` (e.g. `wr_master_liang`)
- Procedural: `npc.foundation` generated once from existing personalities; never rerolled on ensure

### Tie (`G.npcTies`)

- Sparse `byId` + `byParticipant` index (no N×N matrix)
- `kinds[]`: family, friendship, rivalry, patronage, mentorship, institutional_obligation, personal_loyalty, hostility
- Participants: world uid, story id, or deferred `seat:settlement:role`
- Asymmetric `stance[participantId] = { trust, attachment, tension, notes }`

### Canonical seed

- `tie_wr_liang_redwell_city_lord` — institutional mutual-benefit with seat ref (no fabricated lord NPC; no personal friendship)
- **No** Wei Shun ↔ Liang personal tie from lodge membership alone

## Explicitly not Phase B

Incidents, beliefs, chooser, jealousy, tick decay, succession, child, FE quality combat wiring, UI redesign.

## Implementation

- [`npc-foundations.js`](../../npc-foundations.js)
- [`npc-ties.js`](../../npc-ties.js)
- Tests: `scripts/test-npc-foundations-ties.js`
