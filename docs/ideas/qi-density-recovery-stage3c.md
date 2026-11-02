# Qi density, compression & recovery (Stage 3C)

| Field | Value |
|-------|-------|
| **Status** | `shipped` |
| **Issue** | PR #187 |
| **Parent** | [`time-pacing-cultivation-architecture.md`](./time-pacing-cultivation-architecture.md) |
| **Updated** | 2026-11-02 |

## Pre-change audit (authoritative state)

| Topic | Variables / functions | Behaviour |
|-------|----------------------|-----------|
| Current Qi | `G.qi`, `clampCurrentQi`, `G.qiExhausted` | Capacity-limited; 0 sets exhausted flag |
| Max Qi | `getMaxQi()`, `G.maxQiBonus`, meridians, gear | Separate from density |
| Established bonus | `G.qiDensity` | Added by gather/cultivate/seal/consolidation/pills/events; **not** cleared on spend |
| Total density | `getQiDensity()` | `QI_BALANCE.densityBase` + realm + foundation + `G.qiDensity` + gear; scars multiply via `getScarQiRegenMult` (legacy quirk) |
| Cultivate / gather | `runCultivateSession`, `chamberGatherQi` | Same session added random density **and** % max Qi fill |
| Passive / focused | `passive-cultivation.js` → `runCultivateSession` | Fractional yield; band progress separate (`qc-depth.js`) |
| Seclusion | `applySeclusionYearGains` | Quiet `runCultivateSession` + band units |
| Techniques | `getCultivationMethodGatherMult`, chamber `getChamberCultivateMult` | Speed/efficiency only; no compression split |
| Combat Qi | `combat.js` technique costs | Reduces `G.qi` only |
| Breakthrough / seal | `consolidation.js` | Adds density bonus; refills dantian on seal |
| Purity / foundation | Foundation grade vs `G.qiDensity` | Separate systems (not merged) |

**Incoherence addressed:** Refill rate ignored established density; low dantian sessions still raised density, enabling spend/refill density loops.

## Model (shipped)

1. **Persistence** — `G.qiDensity` unchanged by ordinary `G.qi` spend or empty dantian.
2. **Replenish cost** — `fillGain ∝ 1 / getQiReplenishEffortMult()` where mult = `(getQiDensity()/ref)^exponent`.
3. **Compression** — Density gain from sessions × `getQiCompressionDifficultyMult()` × fill blend (0 below 72% fill; 1 at ≥82%).
4. **Realm advances** — Consolidation/seal density grants unchanged; no automatic density loss on breakthrough.

## Measurements

Run:

```bash
node scripts/audit-qi-density-recovery.js
```

The script prints chamber-gather **weeks to refill 0→100%** at several established bonuses (inferior root, bare mult=1).

## Future extensions (out of scope)

- Technique stats for absorption vs refinement vs compression
- Formations / medicines that modify replenish mult without skipping cost
- Fix scar qi-regen conflated with density display
- Full meridian-pill economy vs density-priced refill
