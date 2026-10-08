# Enemy tier scaling (zone bands)

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | none for v1 random encounters |
| **Issue** | none yet |
| **Chat / PR** | `cursor/enemy-tier-scaling-38d2` |
| **Updated** | 2026-10-08 |

## Intent

Random fights should feel **xianxia-local**: a zone’s wilderness spawns enemies from fixed **cultivation tiers** (humans by realm band, beasts by grade, spirits/other by their own tier tag), not from how much Qi Density the player farmed this session. Over-leveled cultivators in starter regions should eventually feel **invincible**; Heartlands should stay lethal because its **tier band** is wide and high.

## Design notes

### Tier axis (v1)

- Numeric **tier 0–6** aligned with player `realmIdx` / realm names (`ENEMY_TIER_BALANCE.tiers`).
- Each row in `ENEMIES` has `tier` + `kind` (`human` | `beast` | `spirit`). Template `hp`/`dmg` are **shape** multipliers vs a reference human (50 HP / 6 dmg).
- **Zone bands:** `encounterTierMin` / `encounterTierMax` on `ZONES` (fallback: `dangerRealm` ±1). Roll tier inside band (skew toward lower tier), then pick a template in-zone matching that tier.

### Stats

- `calcEnemyHp` / `calcEnemyDamage` for `context: 'normal'` → baseline[tier] × shape × small variance. **No** player power, max HP, or “min hits to kill” floor.
- **Crucible / trials** keep player-linked scaling (endurance tests).
- **Bosses / scripted** fights can pass explicit `calcContext.tier` or override HP in their def.

### Future (not v1)

- Separate tier tables per `kind` (beast grade names vs human realm labels in UI).
- Zone-specific pools only containing one kind (e.g. beast-only Frostbite packs).
- Tier shown in combat log / sense readout.
- Re-tune `ENCOUNTER_ENEMIES` and sect hunt tables to pin tiers explicitly.
- Hook enemy ATB to tier baseline instead of final dmg if tempo still drifts.

## Prerequisites

- [x] Tier baselines in `data.js`
- [x] Zone encounter bands
- [x] Random encounter pick + stat calc
- [ ] Playtest: QC gather-spam in Dustbone vs Core in Heartlands
- [ ] Audit scripted combats for accidental power scaling expectations

## Open questions

- Should Jade / Dustbone ever spawn tier 2 as a rare “wandering expert” event?
- Do we want **player realm** to raise the zone’s *effective* max tier when exploring (dynamic world) or stay purely geographic?

## Implementation crumbs

- `ENEMY_TIER_BALANCE`, `ENEMIES[].tier` — `data.js`
- `getZoneEncounterTierRange`, `pickEnemyTemplate`, `calcEnemyHp` — `combat.js`
- `ZONES[].encounterTierMin/Max` — `world.js`
