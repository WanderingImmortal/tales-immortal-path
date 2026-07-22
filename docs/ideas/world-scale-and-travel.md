# World scale & travel philosophy

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | [`nine-realm-ladder.md`](nine-realm-ladder.md) for full travel table; [`realm-claims.md`](realm-claims.md) for implementation |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chats, 2026-07-18–20 |
| **Updated** | 2026-07-21 |

## Intent

Resolve the xianxia disconnect: powerful cultivators should **feel** vast, but the playable map stays **curated** (5 zones + local places). Geography serves **lifespan choices**, not literal continent simulation.

> **The playable map is a cultivator's world at human scale; power compresses distance and unlocks spheres — it does not inflate the atlas.**

## Design notes

### Three layers of “vast”

| Layer | What “vast” means | Implementation |
|-------|-------------------|----------------|
| **Lore** | Nine continents, planes, chaos realms | Text, chronicle, NPC, future upper nine |
| **Mortal play** | 5 spheres + local places + sealed sites | [`local-world-map-split.md`](local-world-map-split.md) |
| **Immortal play** | Jurisdiction, laws, true creation | [`immortal-world-layer.md`](immortal-world-layer.md), [`chaos-cultivation-path.md`](chaos-cultivation-path.md) |

Do **not** fix vastness by adding 50 zones. Fix **friction curve** as realm rises.

### Zones = spheres, not equal counties

| Zone | Sphere role |
|------|-------------|
| Dustbone / Jade | Early mortal & trader world |
| Frostbite / Emberwild | Mid danger & materials |
| Heartlands | Endgame sect politics |
| Hidden sub-zones | Depth within a sphere |

### Power compresses distance (mortal map)

Same 5 regions; **travel months** and **local walk** scale down by realm claim:

| Band | Zone travel (baseline 8mo) | Local walk (baseline 2mo) |
|------|----------------------------|---------------------------|
| Pre–Golden Core | Full | Full walk |
| Golden Core | — | Light Body (≈0–1mo) |
| Nascent Soul+ | Sky Travel (≈2–3mo) | Trivial in-zone |
| Void+ | Blink between nodes | Optional skip encounters |
| Immortal (mortal) | Trivial / narrative | Above walking loop |

Details: [`realm-claims.md`](realm-claims.md).

### Mass destruction

Not terrain deformation. Use:

- Tribulation scars, sect wars, faction gambits
- Chronicle + zone flags (`zoneScars`, event pools)
- Hidden realm collapse / new entrance

### Ascendant stops walking

At immortal mortal-cap, loop shifts from **geography** to **jurisdiction** (edicts, Works). See immortal-world-layer doc. Chaos path adds true creation Works.

### What NOT to do

- Simulate every league of the cultivation world on one map
- Free instant travel at high realm without replacing with new endgame loop
- Let QC players fly before local map matters

## Prerequisites

- [ ] [`local-world-map-split.md`](local-world-map-split.md)
- [ ] [`realm-claims.md`](realm-claims.md) travel mults
- [ ] Nine-realm ladder landed (indices for claim gates)

## Open questions

- [ ] Expose travel mult in action help popover?
- [ ] Narrative line on breakthrough when friction drops?

## Implementation crumbs

- `data.js` — `ACTION_MONTHS.travel`, `ACTION_MONTHS.localTravel`
- `world.js` — `travelToZone`, `actionExplore`
- `locations.js` — `travelToLocation`
- `core.js` — `getEffectiveRealmTier` / path-aware realm for claims
