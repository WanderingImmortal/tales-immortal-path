# Dustbone QC alchemy (named reagents + mortal book)

| Field | Value |
|-------|-------|
| **Status** | `designed` (reagents + axes locked; store-fill **names TBD owner**) |
| **Blocked on** | Field sites dropping these mats; cultivate timed-buff plumbing; store-fill pill hook |
| **Issue** | none yet |
| **Chat / PR** | Design chat 2026-07-27 · re-parked 2026-07-28 (branch hop lost uncommitted docs) |
| **Updated** | 2026-07-28 |

Sisters: [`explore-field-gathering.md`](explore-field-gathering.md) · [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) · [`qi-condensation-depth.md`](qi-condensation-depth.md)

## Intent

Dustbone mortal alchemy is a **local book**: named herbs and ores from Dewcatch Scrub, Ironscar Quarry, and Bonehollow Caverns. Strong expensive **store-fill** pills are an active alternate to AFK Cultivate stance. One universal easy **Qi Restore Pill** tops up spendable qi only. Timed gather buffs stay mild.

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

Pills are not gear — jobs change by realm.

| Axis | Means |
|------|--------|
| **Tier** | Realm band the pill is *for* (Tier 1 = QC) |
| **Grade** | Craft quality — multi on recipe **base** at creation |
| **Recipe base** | Designed strength of the formula for its **job** |

Compare within **job family** only (restore vs restore; store-fill vs store-fill). Different jobs do not rank against each other. Soft same-job rule: higher-tier recipe bases serve higher realms; grade never skips realm fitness.

Today’s Mortal/Earth/Heaven brew bands in code are the **old** model — migrate later. This book = **Tier 1**.

## Named reagent catalog — exactly 10

### Dewcatch Scrub (4)

| Id | Name | Scarcity | Why |
|----|------|----------|-----|
| `dust_root` | Dust Root | common | Default binder; store-sip base; also Qi Pill |
| `saltbrush_tip` | Saltbrush Tip | common | Clears muddy qi; tames mineral burn |
| `dawn_dew` | Dawn Dew | common | Gentle carrier |
| `marrow_thistle` | Marrow Thistle | uncommon | Thicker scrub qi; headroom |

### Ironscar Quarry (3)

| Id | Name | Scarcity | Why |
|----|------|----------|-----|
| `ironscar_grit` | Ironscar Grit | common | Cheap mineral weight |
| `sun_stone` | Sun Stone | uncommon | Day-fire catalyst |
| `redvein_chip` | Redvein Chip | uncommon | Heat without full Sun Stone; headroom |

### Bonehollow Caverns (3)

| Id | Name | Scarcity | Why |
|----|------|----------|-----|
| `seep_dew` | Seep Dew | common | Dense carrier — settles qi |
| `glowcap` | Glowcap | uncommon | Quiet / deep-breath signature |
| `bone_marrow_resin` | Bone Marrow Resin | uncommon | Heavy store packing |

## Recipes — Tier 1 (QC)

Anchor: inferior chamber Gather ≈ **1 progress unit / week**.

### Universal restore (locked name 2026-07-28)

| Pill | Shorthand | Effect | Recipe | Notes |
|------|-----------|--------|--------|-------|
| **Qi Restore Pill** | **Qi Pill** | Refill spendable `G.qi` toward current max only. **No** `gatherProgress`. **No** max-qi bump. | Easy commons — same formula **every zone** (Dustbone: `dust_root`×1 + `dawn_dew`×1; other zones swap local common herb+dew ids that map to the same recipe, or shared staple ids) | What most cultivators mean by “a Qi Pill.” Clever opposite of store-fills. |

Fits current qi system: `G.qi` / `getMaxQi()` is the spendable tank (travel, techniques, combat). QC Store is separate.

### A — Instant store-fill (strong / expensive) — **names TBD owner**

Working titles until owner pass:

| Working title | Feel | Ingredients | Base units (inferior weeks) |
|---------------|------|-------------|----------------------------|
| *(was Dustroot Sip)* | Cheapest burst | `dust_root`×2, `dawn_dew`×1 | **~5** |
| *(was Suntemper Pellet)* | Sharp quarry dump | `sun_stone`×1, `ironscar_grit`×2, `saltbrush_tip`×1 | **~15** |
| *(was Marrow Sink Pill)* | Heavy cave settle | `bone_marrow_resin`×2, `seep_dew`×2, `glowcap`×1, `dust_root`×2 | **~40** — **mat-expensive** on purpose |

Still not one-pill leave-QC (Late 220 / Peak 320). Marrow: rare investment (cave haul per brew + steep market if sold).

### B — Timed gather buffs (mild)

| Working title | Buff target | Ingredients |
|---------------|-------------|-------------|
| Steady Dust Incense | +10–15% gather, long | `dust_root`×3, `dawn_dew`×1 |
| Sunscar Cycle Pill | +25–35% gather, short | `sun_stone`×2, `dust_root`×1 |
| Hollow Breath Pill | +20% gather, medium + lower interrupt chance | `bone_marrow_resin`×1, `glowcap`×1, `seep_dew`×1 |

### Parked

Permanent capacity pills · auto-cultivate background · other-zone flora books · field-boss “go deeper” · combat HP beyond blood recovery

## Prerequisites

- [x] Reagent catalog (10) · tier/grade/recipe axes · AFK lean · Qi Restore Pill name
- [ ] Owner names for 3 store-fills (+ optional timed-buff names)
- [ ] Field sites + loot/enemy pools ([`explore-field-gathering.md`](explore-field-gathering.md))
- [ ] Wire weekly stance `gatherProgress` drip (slow) + store-fill apply hook
- [ ] Issue when building

## Open questions

- Exact ~5 / ~15 / ~40 after pacing playtest
- Stance weekly units under 1 so pills clearly win on speed
- Universal Qi Pill: one shared mat pair worldwide vs per-zone herb+dew aliases into same `pillId`
- Forge share of quarry ores

## Implementation crumbs

`alchemy-data.js`, `data.js` `PILL_TYPES`, `qc-depth.js` gather progress, `world-clock.js` stance ticks, explore site tables
