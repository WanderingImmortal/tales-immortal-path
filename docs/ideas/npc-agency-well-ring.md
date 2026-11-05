# NPC agency — Well-Ring Phase A (persistent cast)

| Field | Value |
|-------|-------|
| **Status** | `building` (Phase A) |
| **Blocked on** | Phase B+ (ties, incidents, chooser) — not started |
| **Issue** | none yet |
| **Chat / PR** | NPC Agency audit · `cursor/well-ring-lodge-npcs` |
| **Updated** | 2026-11-05 |

**Hub:** [`jianghu-situation-threads.md`](jianghu-situation-threads.md) · [`dustbone-lesser-sects.md`](dustbone-lesser-sects.md) · [`dustbone-living-board.md`](dustbone-living-board.md)

## Intent

Turn Well-Ring Lodge named faces into stable `G.worldNpcs` so later social systems (ties, incidents, beliefs, chooser) have real actors. Player lodge UX stays on `G.wellRing`. No social decision-making in Phase A.

## Design notes

### Phase A (this PR) — shipped shape

| Face | Stable uid | Lodge role | Notes |
|------|------------|------------|-------|
| Master Liang | `wr_master_liang` | `hall_master` | **Not** story NPC `liang_chen` |
| Wei Shun | `wr_wei_shun` | `outer_rival` | Ranking rival; board merit on `npc.lodgeMerit` |

- File: [`well-ring-lodge.js`](../../well-ring-lodge.js)
- Affiliation: `affiliationId: 'well_ring_lodge'` + `G.wellRing.lodge` thin org adapter (not a full procedural lesser-sect conversion)
- Life authority: `G.worldNpcs` via existing `tickWorldNpcGrowth` (no second clock)
- Presence: `homeLocationId: 'redwell'` — only listed when player is at Redwell and NPC is alive
- Merit: Wei Shun `lodgeMerit` authoritative after ensure; `G.wellRing.rivalMerit` mirrored for old saves / board scalar callers
- Dead master fallback: UI may say "the lodge steward"; no succession sim yet
- Outer Ke / Yue / Hark remain **flavor board fillers**, not NPCs

### Explicitly not Phase A

- Privileged disciple / kin son
- Values, ambitions, ties, incidents, beliefs, `chooseNpcResponse`
- Situation threads
- Preferential treatment / jealousy storyline
- Full `well_ring_lodge` lesser-sect generator record
- Lodge succession politics

### Later phases (parked)

| Phase | Goal |
|-------|------|
| B | Sparse ties + authored foundations |
| C | Incident ledger + beliefs |
| D | `chooseNpcResponse` + Well-Ring pack |
| E | Off-screen threads + interest-set LOD |
| F | Preferential treatment wired to agents |

## Prerequisites

- [x] Well-Ring player mini-game ([`dustbone-lesser-sects.md`](dustbone-lesser-sects.md))
- [x] World NPC vitals + scheduler ([`time-npc-state-consistency.md`](time-npc-state-consistency.md))
- [ ] Phase B ties (next)

## Open questions

- When to promote `G.wellRing.lodge` into a real `G.world.lesserSects` entry without colliding with procedural Dustbone halls
- Whether Outer Ke/Yue/Hark ever become thin NPCs or stay fakes

## Implementation crumbs

- `ensureWellRingLodgeCast` / `migrateWellRingLodgeForExistingSave`
- `ensureWellRingState` → cast ensure (idempotent)
- `getWellRingRivalMerit` / `adjustWellRingRivalMerit`
- Presence filter in `getPresentNpcEntries` (`homeLocationId`)
- Tests: `scripts/test-well-ring-lodge-npcs.js`
