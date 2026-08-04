# QC technique pamphlet pool (Dustbone / Redwell)

| Field | Value |
|-------|-------|
| **Status** | `shipped` (v1 — methods + QC combat shelf) |
| **Blocked on** | Playtest redraw feel; rare deviant slots later |
| **Issue** | none |
| **Chat / PR** | `cursor/qc-pamphlet-pool` · Redwell living-board park 2026-07-28 |
| **Updated** | 2026-08-04 |

**Why:** [`redwell-starter-city.md`](redwell-starter-city.md) bazaar draws **3 methods + 2 combat techs** from pools. Seasonal redraws need enough entries that the shelf feels alive.

## Intent

Enough **Qi Condensation–usable** cultivation methods (and a thin combat shelf) that seasonal/caravan **redraws** surprise the player without selling FE+ goods in Redwell.

## Redwell method pool (10)

### Generic syllabus (6)

| methodId | Notes |
|----------|--------|
| `outer_sect_qi_cycling` | Outer-court neutral circulation |
| `impure_meridian_breath` | Pentamixed-friendly |
| `burning_breath_technique` | Fire-aspected |
| `stone_root_breath` | Earth-aspected |
| `flowing_tide_breath` | Water-aspected |
| `verdant_breath_technique` | Wood-aspected |

### Dustbone street syllabus (4)

| methodId | Name | Stamp | Flavor |
|----------|------|-------|--------|
| `redwell_well_breath` | Redwell Well Breath | plain_balanced | Inn / well apprentices |
| `saltbrush_road_breath` | Saltbrush Road Breath | earth_aspected | Dewcatch scrub herders |
| `ironscar_loader_cycle` | Ironscar Loader's Cycle | earth_aspected | Quarry haul rhythm |
| `dune_rest_circulation` | Dune Rest Circulation | plain_balanced | Miraj caravan handout |

All `reqRealm: 0`, **common** grade, mortal tier.

## Redwell combat tech pool (10)

QC-usable only — **no** Bronze Skin (FE / body-path). Sandburrow demoted to condensation so Redwell can honestly sell it.

| Technique | Tier | Notes |
|-----------|------|--------|
| Grit Palm | mortal | New — Ironscar street |
| Well-Road Guard | mortal | New — Redwell defense |
| Dust Step | mortal | New — caravan utility |
| Quickfoot Art | mortal | Existing |
| Focused Breath | mortal | Existing |
| Saltbrush Snap | condensation | New — scrub |
| Sandburrow Palm | condensation | Dustbone signature |
| Crushing Fist | condensation | Existing |
| Earth Pulse Palm | condensation | Existing |
| Meridian Flow | condensation | Existing |

## Design notes

- **Realm gate:** QC only on Redwell shelf.
- Owned manuals: prefer not re-drawing as forced purchases.
- Later: rare deviant slots (`storm_heart_breath`, edge/crimson) as caravan extras.

## Prerequisites

- [x] Content pass: Dustbone 4 + generic 6 methods
- [x] Method defs in `CULTIVATION_METHOD_POOL`
- [x] Combat shelf QC-only + Dustbone street pamphlets
- [ ] Playtest bazaar redraw feel over multiple seasons

## Open questions

- Seasonal rare: `storm_heart_breath` / deviant pamphlets at Redwell?

## Implementation crumbs

`data.js` `CULTIVATION_METHOD_POOL`, `REDWELL_METHOD_POOL`, `REDWELL_TECH_POOL`, `TECHNIQUE_POOL`, `TECHNIQUE_CULTIVATION_TIERS`, `qc-depth.js` `ensureRedwellMarketState`.
