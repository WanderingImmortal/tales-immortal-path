# Dustbone starter gameplay (hub)

| Field | Value |
|-------|-------|
| **Status** | `designed` (index — children hold detail) |
| **Blocked on** | varies per child |
| **Issue** | none yet |
| **Chat / PR** | Owner direction 2026-07-28 · [PR #89](https://github.com/WanderingImmortal/tales-immortal-path/pull/89) |
| **Updated** | 2026-07-28 |

## Intent

Make **Dustbone / Threshold** a **real starting game** — enough loops that QC years feel like a place you *live*, not a tutorial hallway before the “real” zones. Expand features **here first**; Frostbite / Emberwild / Heartlands / etc. get the same treatment later, one basin at a time.

This doc is an **index + cut line**, not the recipe book. Alchemy, explore sites, jobs, and cultivate polish stay in child docs.

**Not this hub:** full mortal life-sim ladder continent-wide ([`mortal-life-sim-cluster.md`](mortal-life-sim-cluster.md)), FE redesign, other-zone flora books.

## Cut line — “decent QC gameplay”

A player who stays in Dustbone through Late/Peak QC should be able to:

| Loop | What “enough” means | Child doc |
|------|---------------------|-----------|
| **Live in Threshold** | Market basics, hub jobs, rent/buy room, rest | [`qi-condensation-depth.md`](qi-condensation-depth.md), [`settlement-lore.md`](settlement-lore.md), [`personal-residence.md`](personal-residence.md) |
| **Gather qi** | Stance cultivate (slow baseline) + interrupts lean | [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md), clock (shipped) |
| **Hunt mats / fight** | Three field sites, unique enemies, 1 elite each | [`explore-field-gathering.md`](explore-field-gathering.md) |
| **Brew / use pills** | Qi Pill + Driftburst / Sunscar Burst / Marrowfall; 10 reagents; tribe fame | [`dustbone-qc-alchemy.md`](dustbone-qc-alchemy.md) |
| **Fund the life** | Jobs + sell goods (not explore stones) | QC depth + commerce stubs |
| **Pace** | Inferior Late ~40–44, Peak ~45–50 (playtest) | [`qi-condensation-depth.md`](qi-condensation-depth.md) |
| **Leave when ready** | Soft danger to other zones; no hard lock | QC depth travel |

**Later inside Dustbone (not required for “decent”):** full Miraj/tribe life-sim polish, field bosses (“go deeper”), hire guards, economy stone tiers, Formations Guild depth.

## Child map

| Doc | Scope inside this hub |
|-----|------------------------|
| [`dustbone-qc-alchemy.md`](dustbone-qc-alchemy.md) | **Only** reagents, recipes, guild/tribe alchemy society for QC Dustbone |
| [`explore-field-gathering.md`](explore-field-gathering.md) | Field triangle + enemies + material explore remake (Dustbone first) |
| [`qi-condensation-depth.md`](qi-condensation-depth.md) | QC bands, Threshold starter life cut, pacing |
| [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) | Cultivate-on-clock Phase 3 (pills + interrupts) |
| [`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md) | Why the desert / Law of Dust |
| [`dustbone-surroundings-later.md`](dustbone-surroundings-later.md) | Miraj / camps polish **after** hub loops feel good |
| [`creation-path-guilds.md`](creation-path-guilds.md) | Alchemy guild HQ elsewhere; Threshold = branch |

## Suggested build order (Dustbone only)

1. Field sites live on map (travel + danger labels)
2. Named mat drops + enemy pools / elites
3. Alchemy: 10 mats + Qi Pill + three store-fills (effects on QC store)
4. Stance weekly store drip (slow) + cultivate interrupts thin
5. Pacing playtest (pill vs stance balance)
6. Tribe vendor flavor (who sells Driftburst / Burst / Marrowfall) — thin NPCs ok
7. Then: go deeper / field bosses, surroundings life-sim, next zone book

## Prerequisites

- [x] Owner: expand Dustbone starter totality before other zones’ full books
- [x] Alchemy names + society lean parked
- [ ] Implement chunks via Issues (don’t boil the ocean in one PR)
- [ ] Other zones: copy this hub pattern when Dustbone feels decent

## Open questions

- Thin forge use of quarry mats in QC Dustbone, or alchemy-only until forge pass?
- How much tribe camp gameplay before “decent” (talk only vs buy specialty pills)?

## Implementation crumbs

Many files — follow children. Hub itself is docs-only index.
