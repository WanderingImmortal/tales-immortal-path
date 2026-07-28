# Explore — field gathering (materials)

| Field | Value |
|-------|-------|
| **Status** | `designed` (place + enemy locks 2026-07-27; re-parked 2026-07-28) |
| **Blocked on** | Place-scoped loot + enemy pools; named mats ([`dustbone-qc-alchemy.md`](dustbone-qc-alchemy.md)) |
| **Issue** | none yet |
| **Chat / PR** | Owner lock with QC depth 2026-07-26 · remake + field triangle 2026-07-27 |
| **Updated** | 2026-07-28 |

**Hub:** [`dustbone-starter-gameplay.md`](dustbone-starter-gameplay.md) — field triangle is one starter loop, not the whole Dustbone pass.

## Intent

Explore’s job is hunting **different places** for **different loot** and fighting what lives there. Loot tables stay. Scrap pity-stone lottery. QC stones = jobs + sell. Threshold City is a **hub**, not a combat forage zone.

## Dustbone field sites v1

| Site | Job | Danger | Loot | Elite |
|------|-----|--------|------|-------|
| **Ironscar Quarry** | Metals | Safe → Wild (deeper) | Sun Stone, grit, redvein | **Pit Brute** |
| **Bonehollow Caverns** | Training + cave mats | Wild → Deadly (deeper) | Seep dew, glowcap, marrow resin | **Hollow Ambusher** |
| **Dewcatch Scrub** | Herbs | Safe (edge) → Wild | Dust Root, dawn dew, thistle | **Dew-Catch Wight** |

Tribe camps (Miraj / Sunscar / Ashen) stay social for now. **Go deeper → field boss** = later (separate from elites).

### Enemy pools (1 elite each)

**Scrub commons:** Dust Viper, Saltbrush Stalker, Herb Thief · **elite:** Dew-Catch Wight  
**Quarry commons:** Claim-Jumper, Rock Lizard, Slag Mite, Redvein Shade · **elite:** Pit Brute  
**Cave commons:** Bone-Gnaw Rat, Glowcap Skitter, Marrow Leech, Pin-Haunt Remnant · **elite:** Hollow Ambusher  

No shared templates across sites. Threat bands predictable on map/travel confirm.

### Alchemy link

Named reagent ids and Qi Restore Pill / store-fills: [`dustbone-qc-alchemy.md`](dustbone-qc-alchemy.md).

## Prerequisites

- [ ] `WORLD_LOCATIONS` for three field sites
- [ ] Place loot tables + enemy pools + elite roll
- [ ] Strip explore stone/currency lottery leftovers

## Open questions

- Final display names for quarry / caverns / scrub
- Field boss “go deeper” design (owner return)
- Survey vs Delve UI timing

## Implementation crumbs

`world.js`, `locations.js`, `data.js` `ZONE_LOOT` / encounters / `ENEMIES`, `qc-depth.js` field materials
