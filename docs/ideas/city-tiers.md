# City tiers (civic ladder)

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | Settlement rename pass; `SETTLEMENT_PROFILES` when markets/jobs ship |
| **Issue** | none yet |
| **Chat / PR** | Owner lock 2026-07-26 with QC depth |
| **Updated** | 2026-08-02 |

## Intent

Cities have a **civic power tier** separate from cultivation realm of the player. Naming must read as cities (not Waystation/Crossroads). Default cities are **not** unorganized sects — thin apex, trade, law.

Cross-links: [`qi-condensation-depth.md`](qi-condensation-depth.md), [`settlement-lore.md`](settlement-lore.md), [`imperial-city-tianjing.md`](imperial-city-tianjing.md), [`sect-power-pyramid-and-schools.md`](sect-power-pyramid-and-schools.md), [`creation-path-guilds.md`](creation-path-guilds.md), [`civic-seats-generator.md`](civic-seats-generator.md).

## Design notes

### Ladder

Each numbered tier ≈ **one realm of civic apex** below the one above. Stop around GC/NS — no Void/Dao civic tier band.

| Tier | Civic apex (lean) | Role |
|------|-------------------|------|
| **Imperial** | Court special (wider top) | **Exactly one:** Longcheng |
| **1st** | Lord ~**DT**; optional **VR** vault elder | Best outside imperial |
| **2nd** | Lord ~**NS** | Strong regional |
| **3rd** | Lord ~**GC** | Ordinary zone capitals |
| **4th** | Lord ~**FE** / strong QC peak | Frontier towns |
| **Outpost / camp** | n/a | Waystation, War-Camp, Shrine |

**Dustbone civic ladder (2026-07-28):** **Redwell** = **4th-tier** spawn hub ([`redwell-starter-city.md`](redwell-starter-city.md)); unnamed **mid city** = **3rd**; **Threshold City** (id `bone_crossroads`) = **1st-tier capital** + organised chaos under **Law of Dust**. Joint Sandveil Tribunal; tribe HQs elsewhere → stationed civic apex a notch below a classic 1st-tier City Lord. Zone strategic power (survivors / tribe spines) stays high enough that Heartlands cannot casually annex. See [`dustbone-living-board.md`](dustbone-living-board.md).

**DT contextual pressure:** At Deity Transformation, how much weight you can throw depends on **this table** vs your realm — see [`realm-claims.md`](realm-claims.md) idx 4. Redwell = lord/shadow lord; Threshold = peer; Longcheng = respectable mid-tier, not summit.

### Cities vs sects

Sects have organized depth (NS face, DT elders, VR patriarch, vault). Cities have trade + thin apex. Exception: a few **unique** near-sect-strong unorganized cities — rare spikes, not the 1st-tier template.

### Naming convention

| Type | Sounds like | Avoid as city name |
|------|-------------|-------------------|
| City | Town / Oasis / Hold / proper name + City | Crossroads, Waystation, Post, Camp alone |
| Outpost | Waystation, Post, Relay | Calling it City in UI |
| Camp / shrine | War-Camp, Shrine | Implying civic market |

UI: always show type chip `City` / `Outpost` / `Camp`.

### Zone power ≠ settlement tier

Outer zones keep big players (Dao Wars survivors, etc.) so annexation is costly. Humble streets + high deterrence can coexist.

## Prerequisites

- [x] Owner ladder + Threshold as 1st-tier
- [ ] Wire `settlementTier` on `WORLD_LOCATIONS` when useful
- [ ] Player-facing rename Bone Crossroads → Threshold City in data/UI

## Open questions

- Exact 1st-tier city list beyond Threshold + Tide Harbor candidates
- Formations Guild HQ city placement

## Implementation crumbs

`WORLD_LOCATIONS`, `settlement-lore.md`, display name overrides in `ui.js` / `locations.js`
