# Realm claims (abilities per watershed)

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | [`nine-realm-ladder.md`](nine-realm-ladder.md) for final indices; optional before 9-realm code land (7-realm subset) |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chats, 2026-07-19–21 |
| **Updated** | 2026-07-21 |

## Intent

Each mortal realm grants a **claim** — one identity players feel at breakthrough: a verb, a travel change, or world reaction. Not just bigger stats or unlocking an existing button without fanfare.

**Presentation:** breakthrough line + scene chip `✦ Domain` (example).  
**Three claim types:** Verb · Aura (world reaction) · Jurisdiction (where you can go).

Aligns with [`world-scale-and-travel.md`](world-scale-and-travel.md) and [`local-world-map-split.md`](local-world-map-split.md).

## Design notes

### Nine-realm claim table (qi path)

Uses indices from [`nine-realm-ladder.md`](nine-realm-ladder.md) (`0–8`).

| Idx | Realm | Claim | Verb / mechanic | Travel / world |
|-----|-------|-------|-----------------|----------------|
| 0 | Qi Condensation | **Perception** | Sense qi; mortals vs cultivators | Explore / NPC flavor |
| 1 | Foundation Establishment | **Anchor** | Intent, physique, sealed-site probe (existing) | Rooted — resist zone chip |
| 2 | Core Formation | **Domain** | Aura pressure; sect/forbidden (existing) | **Light Body** — local 2mo → 0–1mo |
| 3 | Nascent Soul | **Sovereignty** | Soul sense; projection (light) | **Sky Travel** — zone 8mo → 2–3mo |
| 4 | Deity Transformation | **Transformation** | Regional deity-presence; NPC defer | Pressure radius; not more flight |
| 5 | Void Refinement | **Passage** | Spatial authority | **Blink** between two local nodes; void skip on roads |
| 6 | Dao Seeking | **Law (seek)** | Dao panel (existing) | Law-sense — faction dao, thin forbidden |
| 7 | Dao Manifestation | **Law (wear)** | Embody one law locally | Muffle weak techniques; tribulation skew |
| 8 | Immortal Ascension | **Transcendence** | True reincarnation; immortal fork | Mortal travel trivial; above map loop |

**Half-Step Immortal** (peak before idx 8 breakthrough): see nine-realm-ladder — threshold at heaven’s gate; not a separate claim row.

### Flying split (owner confirmed direction)

| Realm | Flight flavor |
|-------|----------------|
| Golden Core (2) | **Light Body** — in-zone only |
| Nascent Soul (3) | **Sky Travel** — continent hops |
| Void (5) | **Blink** — between local nodes |
| Immortal (8) | Narrative / free — leave walk loop |

### Body & soul paths (same index, different skin)

Shared `realmIdx` gates; breakthrough text and chip name vary by `G.path`:

| Idx | Body skin | Soul skin |
|-----|-----------|-----------|
| 2 | Shockwave / intimidation | Soul pressure |
| 3 | Leap / bound crossing | Soul flight |
| 5 | Step through | Soul blink |

Mechanics can share one implementation.

### Aura examples (GC+)

- Weak NPCs flee or offer dialogue deferral
- Faction first-impression bonus
- Optional combat “intimidate” action
- Look Around finds higher-tier figures

### Integration with existing unlocks

Many claims **formalize** what exists:

| Existing | Claim home |
|----------|------------|
| Intent, physique, search @ FE | Anchor |
| Sect, forbidden @ Core | Domain |
| Dao @ Dao Seeking (idx 6) | Law (seek) |
| Heartlands `minRealm: 3` | Sovereignty jurisdiction |

Add **travel mults** and **breakthrough fanfare** as new work.

### Travel mult API (sketch)

```javascript
function getZoneTravelMonths(zoneId) {
  const base = ACTION_MONTHS.travel;
  return Math.max(1, Math.round(base * getRealmTravelMult('zone')));
}
function getLocalTravelMonths(locationId) {
  const base = ACTION_MONTHS.localTravel;
  return Math.max(0, Math.round(base * getRealmTravelMult('local')));
}
```

### Smallest shippable slice

1. Claim string on breakthrough + `G.realmClaims` or derive from `realmIdx`
2. GC local mult + NS zone mult
3. One pressure reaction (NPC or log)
4. Expand per realm over time

## Prerequisites

- [ ] Breakthrough / `fullRender` hook for claim announcement
- [ ] Travel functions in `world.js` + `locations.js`
- [ ] Nine-realm names in `PATHS` (or map 7→9 claims with gaps)

## Open questions

- [ ] Store claims explicitly vs derive from table?
- [ ] Body/soul paths get all 9 claims or subset?
- [ ] Link QC Perception to [`spiritual-sense-cultivation-reading.md`](spiritual-sense-cultivation-reading.md)?

## Implementation crumbs

- `data.js` — `ACTION_UNLOCKS`, `ACTION_MONTHS`, `PATHS.*.realms`
- `cultivation.js` / breakthrough flow
- `world.js`, `locations.js` — travel
- `ui.js` — `renderScenePanel` chip
- `npc.js`, `ambient-npcs.js` — pressure reactions
