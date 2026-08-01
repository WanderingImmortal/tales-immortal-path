# QC technique pamphlet pool (Dustbone / Redwell)

| Field | Value |
|-------|-------|
| **Status** | `designed` (cultivate methods locked; combat techs separate) |
| **Blocked on** | — |
| **Issue** | none yet |
| **Chat / PR** | Redwell living-board park 2026-07-28 · Dustbone pamphlets 2026-08-01 |
| **Updated** | 2026-08-01 |

**Why:** [`redwell-starter-city.md`](redwell-starter-city.md) bazaar draws **2–3 QC pamphlets** from a **pool**. Seasonal redraws need enough entries that the shelf feels alive.

## Intent

Enough **Qi Condensation–usable** cultivation methods that seasonal/caravan **redraws** surprise the player without selling FE+ goods in Redwell. Volume sells the world; not every pamphlet needs to be a standout optimal pick.

**Combat techniques** stay thin until damage-depth pass — cultivate-only for bazaar method pool.

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

All `reqRealm: 0`, **common** grade, mortal tier — plausible QC paths, not trap picks.

## Design notes

- **Realm gate:** QC only on Redwell shelf.
- **Pool size:** 10 methods → 3 slot draws stay varied across years.
- Owned manuals: prefer not re-drawing as forced purchases ([`redwell-starter-city.md`](redwell-starter-city.md) stock rules).
- Later: hand-crafted standout arts; rare slots (`storm_heart_breath`, edge/crimson) optional caravan extras.

## Prerequisites

- [x] Content pass: Dustbone 4 + generic 6 in `REDWELL_METHOD_POOL`
- [x] Method defs in `CULTIVATION_METHOD_POOL`
- [ ] Playtest bazaar redraw feel over multiple seasons

## Open questions

- Combat techniques in `REDWELL_TECH_POOL` — after damage system pass
- Seasonal rare: `storm_heart_breath` / deviant pamphlets at Redwell?

## Implementation crumbs

`data.js` `CULTIVATION_METHOD_POOL`, `REDWELL_METHOD_POOL`, `qc-depth.js` `ensureRedwellMarketState`, [`cultivation-manuals-framework.md`](cultivation-manuals-framework.md).
