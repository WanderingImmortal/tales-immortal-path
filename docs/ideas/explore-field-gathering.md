# Explore — field gathering (materials)

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | Zone material tables; alchemy/forge/formation sinks |
| **Issue** | none yet |
| **Chat / PR** | Owner lock with [`qi-condensation-depth.md`](qi-condensation-depth.md) 2026-07-26 |
| **Updated** | 2026-07-26 |

## Intent

**Scrap** pity-stone / loot-lottery explore. Explore’s job is hunting **environmental materials** (herbs, ores, reagents) for alchemy, forging, and formations. QC **stones** come from jobs and market sell ([`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md)).

## Design notes

- Zone-flavored tables (Dustbone: Dust Root, Sun Stone, Sand Silk, …).
- Combat can still happen on the road; combat is not the stone faucet.
- Commerce cluster survey/delve can deepen this later ([`commerce-and-markets.md`](commerce-and-markets.md)).

## Prerequisites

- [ ] Replace empty-explore pity stones in `world.js` / explore handlers
- [ ] Material loot tables per zone

## Open questions

- Survey vs delve split timing
- Manual/technique drops — keep rare on delve, or move elsewhere?

## Implementation crumbs

`world.js` `actionExplore`, `ZONE_LOOT`, inventory material types
