# Dustbone QC alchemy (named reagents + mortal book)

| Field | Value |
|-------|-------|
| **Status** | `designed` (names + society lean locked) |
| **Blocked on** | Field sites dropping these mats; cultivate timed-buff plumbing; store-fill pill hook |
| **Issue** | none yet |
| **Chat / PR** | Design chat 2026-07-27 · re-parked 2026-07-28 · names lock · [PR #89](https://github.com/WanderingImmortal/tales-immortal-path/pull/89) |
| **Updated** | 2026-07-28 |

Sisters: [`explore-field-gathering.md`](explore-field-gathering.md) · [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) · [`qi-condensation-depth.md`](qi-condensation-depth.md)

## Intent

Dustbone mortal alchemy is a **local book**: named herbs and ores from Dewcatch Scrub, Ironscar Quarry, and Bonehollow Caverns. Strong expensive **store-fill** pills are an active alternate to AFK Cultivate stance. One universal easy **Qi Restore Pill** tops up spendable qi only. Timed gather buffs stay mild. Tribe specialties keep the three big jumps from all living only in Threshold’s bazaar.

## Growth doctrine (dao of alchemy is limitless)

| Rule | Practice |
|------|----------|
| **Closed books** | One book at a time. Dustbone QC v1 = these **10** reagents + recipes below. |
| **Need-gated adds** | New named reagent only when a new recipe/site needs a signature no existing mat can honestly provide. |
| **Zone books** | Other zones = separate catalogs later. |
| **Realm books** | FE+ Dustbone = new book, not bloating the QC 10. |
| **Living catalog** | Lists live in idea docs; code ids follow. |
| **Reuse before invent** | Prefer a new recipe from the existing 10 before adding #11. |

## Cultivation boredom / AFK (owner + playtest 2026-07-27)

Stance + ticking clock can feel AFK. **Lean:** stance = slow free baseline; **explore → brew → strong store-fills** = active path; interrupts push back on long unbroken stance ([`qc-cultivate-excitement.md`](qc-cultivate-excitement.md)). Timed buffs stay mild so incense+AFK is not the win.

## Pill tier vs grade vs recipe strength

| Axis | Means |
|------|--------|
| **Tier** | Realm band the pill is *for* (Tier 1 = QC) |
| **Grade** | Craft quality — multi on recipe **base** at creation |
| **Recipe base** | Designed strength of the formula for its **job** |

Compare within **job family** only. Soft same-job rule across realms; grade never skips realm fitness. Old Mortal/Earth/Heaven brew bands in code migrate later. This book = **Tier 1**.

## Named reagent catalog — exactly 10

### Dewcatch Scrub (4)

| Id | Name | Scarcity | Why |
|----|------|----------|-----|
| `dust_root` | Dust Root | common | Default binder; Driftburst / Qi Pill |
| `saltbrush_tip` | Saltbrush Tip | common | Clears muddy qi; tames mineral burn |
| `dawn_dew` | Dawn Dew | common | Gentle carrier |
| `marrow_thistle` | Marrow Thistle | uncommon | Headroom |

### Ironscar Quarry (3)

| Id | Name | Scarcity | Why |
|----|------|----------|-----|
| `ironscar_grit` | Ironscar Grit | common | Cheap mineral weight |
| `sun_stone` | Sun Stone | uncommon | Day-fire catalyst — Sunscar Burst |
| `redvein_chip` | Redvein Chip | uncommon | Headroom |

### Bonehollow Caverns (3)

| Id | Name | Scarcity | Why |
|----|------|----------|-----|
| `seep_dew` | Seep Dew | common | Dense carrier |
| `glowcap` | Glowcap | uncommon | Marrowfall signature |
| `bone_marrow_resin` | Bone Marrow Resin | uncommon | Heavy store packing |

## Dustbone alchemy society (owner lean 2026-07-28)

Alchemy Guild **HQ** = imperial ([`creation-path-guilds.md`](creation-path-guilds.md)). Dustbone = **branch in Threshold City** (exams, Qi Pill trade, recipe registration). Tribes are makers/feeders — signature store-fills are **not** all native Threshold bazaar stock.

| Actor | Role | Scale | Specialty |
|-------|------|-------|-----------|
| **Guild branch (Threshold)** | Standards, teaching, registered recipes, buy when mats arrive | Formal, mixed | Stamp of trust — not sole source of all three |
| **Dune Riders (Miraj)** | Caravan medicine | High volume, small | **Qi Pills** + **Driftburst Pill** |
| **Sunscar** | Warrior fuel | Medium, fierce | **Sunscar Burst Pill** |
| **Ashen** | Rite denseness | Low volume, expensive | **Marrowfall Pill** |
| **Player** | Field sites → brew or buy | — | Same recipes; fiction = who is famous for which |

Open: branch NPC/building; Sunscar outsider sales; Ashen price flavor (no blood mats in v1).

## Recipes — Tier 1 (QC)

Anchor: inferior chamber Gather ≈ **1 progress unit / week**.

### Universal restore (locked)

| Pill | Shorthand | Effect | Recipe |
|------|-----------|--------|--------|
| **Qi Restore Pill** | **Qi Pill** | Refill `G.qi` toward current max only. No store progress. No max-qi bump. | Commons every zone (Dustbone: `dust_root`×1 + `dawn_dew`×1) |

### Instant store-fill (locked names 2026-07-28)

| Pill | Units | Tribe fame | Feel | Ingredients |
|------|-------|------------|------|-------------|
| **Driftburst Pill** | ~5 | Dune Riders | Small explosive shove into the store | `dust_root`×2, `dawn_dew`×1 |
| **Sunscar Burst Pill** | ~15 | Sunscar | Hot mid dump — quarry temper | `sun_stone`×1, `ironscar_grit`×2, `saltbrush_tip`×1 |
| **Marrowfall Pill** | ~40 | Ashen | Heavy settle — expensive cave haul | `bone_marrow_resin`×2, `seep_dew`×2, `glowcap`×1, `dust_root`×2 |

Still not one-pill leave-QC (Late 220 / Peak 320).

### Timed gather buffs (mild) — names later

| Working title | Buff | Ingredients |
|---------------|------|-------------|
| Steady Dust Incense | +10–15% gather, long | `dust_root`×3, `dawn_dew`×1 |
| Sunscar Cycle Pill | +25–35% gather, short | `sun_stone`×2, `dust_root`×1 |
| Hollow Breath Pill | +20% gather, medium + lower interrupt chance | `bone_marrow_resin`×1, `glowcap`×1, `seep_dew`×1 |

### Parked

Permanent capacity pills · auto-cultivate background · other-zone flora · field-boss “go deeper” · combat HP beyond blood recovery

## Prerequisites

- [x] Reagents (10) · axes · AFK lean · Qi Restore Pill
- [x] Driftburst / Sunscar Burst / Marrowfall · society lean
- [ ] Timed-buff names (optional)
- [ ] Field sites + loot/enemies ([`explore-field-gathering.md`](explore-field-gathering.md))
- [ ] Stance `gatherProgress` drip + store-fill apply hook
- [ ] Issue when building

## Open questions

- Exact ~5 / ~15 / ~40 after pacing playtest
- Stance weekly units under 1 so pills clearly win on speed
- Qi Pill: shared mats vs per-zone aliases → same `pillId`
- Forge share of quarry ores

## Implementation crumbs

`alchemy-data.js`, `data.js` `PILL_TYPES` (`qi_restore`, `driftburst`, `sunscar_burst`, `marrowfall`), `qc-depth.js`, `world-clock.js`, explore site tables
