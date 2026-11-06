# NPC travel, capability, and presence

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | none for this slice |
| **Issue** | none yet |
| **Chat / PR** | `cursor/npc-travel-presence` |
| **Updated** | 2026-11-06 |

## Intent

NPCs occupy real places. A journey takes world-clock time, depends on what that person can actually do, and keeps them off location-bound work until they arrive. The first loop is Wei Shun walking from Redwell to Dewcatch Scrub for spirit herbs, then coming home.

Player map travel stays the player action. NPCs do not spend the player's Qi or move `G.currentLocation`.

## Design notes

### What already existed

- Player place: `G.currentZone` + `G.currentLocation`.
- Places: `WORLD_LOCATIONS`. Local links: `ZONE_LOCAL_LAYOUT` paths (same graph the local map draws). Player local travel ignores the path graph and any same-zone place is one walk; NPC travel follows the paths.
- Player zone travel is a world-clock project (`travelToZone`, `ACTION_MONTHS.travel`). Player local travel bills `ACTION_MONTHS.localTravel` immediately. Both are player-only.
- Well-Ring cast stores `homeLocationId` (`redwell`) and `zone`. That home does not change when someone is on the road.
- Clock: `G.ageMonths` via `advanceTime` / `processWorldTime` / `registerWorldTick`. No second clock.

### Travel state (on the NPC)

`npc.travel` is the journey. `G.npcTravel.activeUids` lists who is on the road so the tick does not scan `G.worldNpcs`.

| Field | Meaning |
|-------|---------|
| `status` | `present`, `travelling`, or `aborted` |
| `locationId` | Settled place. Null while travelling or aborted — not either endpoint, and not a pass along the way |
| `originId` / `destinationId` | This leg |
| `purpose` | Why (`cultivation_resources`, `return_home`). Independent of method |
| `method` | `walk`, `light_body`, or `flight` |
| `departedAtMonths` / `arrivesAtMonths` | World clock |
| `arrivalApplied` / `completionCount` | Arrival runs once |
| `familiarLocationIds` | Home plus neighboring places, plus places already visited. Not hidden danger |
| `companions` / `scheduleId` | Empty hooks for later caravans and escorts |

### Capability

Methods come from realm and condition. They are ways of travelling, not new techniques or a transport inventory.

| Method | Who |
|--------|-----|
| `walk` | Living, not incapacitated. One local-map hop costs `ACTION_MONTHS.localTravel` (2 months). Duration is at least 1 |
| `light_body` | Realm index ≥ 2 (Core Formation / Golden Core). About half the walk, still at least 1 month |
| `flight` | Realm index ≥ 3 (Nascent Soul). About a quarter of the walk, still at least 1 month |

Injury blocks light-body and flight. Incapacitation blocks every method. A location `minRealm` blocks the route. Dead characters cannot depart, and a death on the road aborts the leg instead of arriving.

Flight being available does not mean it is chosen. Preference is scored from personality, pressure, and purpose. Ties prefer walking. A careful loyal Nascent Soul cultivator can still walk.

### Intent in this slice

Only purposes the current map can support:

- `cultivation_resources` — nearest worthwhile place whose tags or resources include herbs. From Redwell that is Dewcatch Scrub (one path). Salt Bloom Flats is farther. Copper Vein Cut is unfamiliar and usually not worth it.
- `return_home` — back to `homeLocationId` after the field stay should end.

Wei’s existing herb goal treats “seek herbs in a nearby field” as one option beside lodge duty and theft. Seeds still pick duty and theft. Departure does not count as a failed goal.

At the field he gathers into the existing spirit-herb pouch. If he is still short, and he is not careful or loyal, he can stay (capped). Otherwise he walks home. Reaching the herb batch still feeds the existing cultivation-progress grant; travel does not pause growth.

Judgement uses time, familiarity, personality, and goal pressure. It does not read encounter tables or zone danger.

### Presence

While `status === 'travelling'`, the NPC is not present at the lodge, the destination, or any pass on the route.

Blocked when the body is elsewhere:

- Lodge duty and storehouse theft (Well-Ring resource actions).
- In-person accusation actions (`speak_to_accused`, `warn`, `formal_discipline`). The thread stays active and retries at arrival, or expires on the existing situation clock. Investigate / ignore / defer do not require the accused’s body.
- World-NPC conversation when that NPC’s travel state says they are away.

Not blocked: observations and beliefs, long-term ambitions, cultivation progress from an herb batch, actions with no place requirement.

Home (`homeLocationId`) and lodge membership stay put.

### Clock

`registerWorldTick('npcTravel')` at priority 44, before situations (45) and ambition pursuit (46). A skip sets `G.ageMonths` and the tick completes any due leg once. Seclusion and playback already call `processWorldTime`, so they pick this up. No per-frame movement.

## Prerequisites

- [x] Persistent cast, decisions, ambitions, and the Well-Ring herb goal
- [x] Local map paths for Dustbone

## Open questions

- [ ] When should other cast members travel (Liang’s duties, a later merchant schedule)?
- [ ] Cross-zone legs: player zone travel is not a path in `ZONE_LOCAL_LAYOUT`. NPC zone travel needs an explicit link, not a new atlas.
- [ ] Caravans, escorts, companions, and route danger by region and authority — hooks only (`companions`, `scheduleId`, purpose/method split).

## Implementation crumbs

- `npc-travel.js` — state, routes, methods, tick, `inspectNpcTravel`
- `npc-ambitions.js` — `gather_field_herbs`
- `npc-situations.js` — defer in-person beats when the accused is away
- `well-ring-lodge.js`, `npc.js`, `npc-converse.js` — presence
- `scripts/test-npc-travel.js`
