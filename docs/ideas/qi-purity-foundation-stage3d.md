# Qi purity & foundation quality (Stage 3D)

| Field | Value |
|-------|-------|
| **Status** | `shipped` |
| **Issue** | PR #188 |
| **Parent** | [`time-pacing-cultivation-architecture.md`](./time-pacing-cultivation-architecture.md) |
| **Updated** | 2026-11-02 |

## Pre-change audit

| Property | State / functions | Role today |
|----------|-------------------|------------|
| **Foundation quality** | `G.cultivationBase` (Root / Flow / Stability), `getEffectiveFoundation()`, grades Crude→Peerless | Breakthrough odds, max Qi, density base, combat, tribulation |
| **Qi density** | `G.qiDensity`, `getQiDensity()`, PR #187 refill/compression | Power concentration; persists through spend |
| **Qi purity** | *None* | Soul-chamber “purity” layer ≠ dantian purity; GC perk `golden_core_purity` only |
| **Cycle stain** | `G.corruptionLevel` | Tribulation severity; not tied to refinement stat |
| **QC → FE** | `hasQcBandBreakthroughReady()` (Late/Peak bands); `getBreakChance()` | Band gate only; break chance ignores density/purity/method |
| **FE entry** | `applyQcBreakthroughEntryBonuses(style)` | Max Qi / vit / spi posture only |
| **FE seal nature** | `stampFoundationNatureAtFeSeal()` at FE realm | Method lineage lock (separate from pillars) |
| **Realm seal** | QC has **no** consolidate seal; FE+ uses consolidation tiers | Peak optional at higher realms, not QC band |

**Gap:** Cultivation *quality* at the watershed (QC→FE) did not persist into foundation pillars; no dantian **purity** distinct from density.

## Shipped slice (PR #188)

1. **`G.qiPurity`** — established refinement bonus (like density). Grows on **compression** sessions (same fill gates as density); persists through Qi spend/depletion. **`getQiPurity()`** applies cycle-stain penalty to effective value only.
2. **`applyQcFeFoundationPillarGrant(style)`** — on **successful** QC→FE break (before tribulation), grants Root / Flow / Stability from preparation score: QC band (Late vs Peak), density & purity bonuses, optional QC seal tier, method grade. **Does not change break roll.**
3. UI chip + `STAT_GUIDE.qiPurity`.

## Measurements

```bash
node scripts/audit-qi-purity-foundation.js
```

Prints effective foundation before/after FE grant for Late vs Peak preparation profiles.

## Future (out of scope)

- Purity affecting technique efficiency or combat directly
- Golden Core / Nascent Soul foundation grades
- Foundation reconstruction rites
- Wiring purity into `getBreakChance()` (optional small nudge later)
- Full technique absorption/refinement/compression split
