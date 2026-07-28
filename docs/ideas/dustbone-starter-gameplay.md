# Dustbone starter gameplay (hub)

| Field | Value |
|-------|-------|
| **Status** | `designed` (index — children hold detail) |
| **Blocked on** | varies per child |
| **Issue** | none yet |
| **Chat / PR** | Owner direction 2026-07-28 · living-board / Redwell park |
| **Updated** | 2026-07-28 |

## Intent

Make **Dustbone** a **real starting game** — enough loops that QC years feel like a place you *live*, not a tutorial hallway. Expand features **here first**; other zones later, one basin at a time.

**Home is Redwell (4th-tier), not Threshold.** Threshold is the capital — visit weight, not default spawn. Zone vision: [`dustbone-living-board.md`](dustbone-living-board.md). Town inventory: [`redwell-starter-city.md`](redwell-starter-city.md).

This doc is an **index + cut line**. Detail stays in children.

**Not this hub:** full mortal life-sim continent-wide ([`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md)), FE redesign, other-zone flora books, Taiwu-grade NPC social.

## Cut line — “decent QC gameplay”

A player who stays in Dustbone through Late/Peak QC should be able to:

| Loop | What “enough” means | Child doc |
|------|---------------------|-----------|
| **Live in Redwell** | Bazaar basics, jobs, Redwell Inn rent, FE courtyard, rumors/bounties | [`redwell-starter-city.md`](redwell-starter-city.md), [`personal-residence.md`](personal-residence.md) |
| **Gather qi** | Stance cultivate (slow baseline) + interrupts lean — **manuals + formations** for speed, not house % | [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md), clock |
| **Hunt mats / fight** | Field sites from Redwell (Ironscar, Dewcatch; Bonehollow soon) | [`explore-field-gathering.md`](explore-field-gathering.md) |
| **Brew / use pills** | Qi Pill + store-fills; 10 reagents | [`dustbone-qc-alchemy.md`](dustbone-qc-alchemy.md) |
| **Fund the life** | Jobs + sell goods (not explore stones) | Redwell + commerce stubs |
| **Pace** | Inferior Late ~40–44, Peak ~45–50 (playtest) | [`qi-condensation-depth.md`](qi-condensation-depth.md) |
| **Leave when ready** | Soft danger; visit Threshold and feel small | [`dustbone-living-board.md`](dustbone-living-board.md) |

**Later (not required for decent):** mid city, full Miraj/tribe polish, field bosses, Threshold life-sim depth, hire guards, economy stone tiers.

## Child map

| Doc | Scope |
|-----|--------|
| [`dustbone-living-board.md`](dustbone-living-board.md) | Zone vision — three cities, geopolitics, seats, board weight |
| [`redwell-starter-city.md`](redwell-starter-city.md) | **Build first** — Redwell v1 inventory |
| [`qc-technique-pamphlet-pool.md`](qc-technique-pamphlet-pool.md) | QC pamphlet variety for bazaar pool draws |
| [`dustbone-qc-alchemy.md`](dustbone-qc-alchemy.md) | Reagents/recipes (**restore from `cursor/dustbone-qc-alchemy-docs` / PR #89 if missing on this branch**) |
| [`explore-field-gathering.md`](explore-field-gathering.md) | Field triangle + enemies |
| [`qi-condensation-depth.md`](qi-condensation-depth.md) | QC bands, pacing (hub life retargeted to Redwell) |
| [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) | Cultivate-on-clock Phase 3 |
| [`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md) | Law of Dust / dynasties |
| [`dustbone-surroundings-later.md`](dustbone-surroundings-later.md) | Miraj / camps **after** Redwell |
| [`creation-path-guilds.md`](creation-path-guilds.md) | Alchemy guild; Threshold = branch |

## Suggested build order (Dustbone)

1. **Redwell** location + spawn + Inn/courtyard/bazaar/jobs/seats ([`redwell-starter-city.md`](redwell-starter-city.md))  
2. Nearby fields (Ironscar + Dewcatch) live on map  
3. Alchemy close-loop  
4. **Parallel:** QC pamphlet pool content ([`qc-technique-pamphlet-pool.md`](qc-technique-pamphlet-pool.md))  
5. Clock pulse / job dry-up / market restock feel  
6. Threshold thin visit  
7. Mid city → camps → bosses  

## Prerequisites

- [x] Owner: Redwell + living board designed
- [ ] Implement via Issues (don’t boil ocean in one PR)
- [ ] Other zones: copy hub pattern when Dustbone feels decent

## Open questions

- Thin forge use of quarry mats in QC, or alchemy-only until forge pass?
- Mid city name

## Implementation crumbs

Follow children. Hub is docs-only index.
