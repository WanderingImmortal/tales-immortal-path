# Qi purity in technique execution (Stage 3E)

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Parent** | [`qi-purity-foundation-stage3d.md`](./qi-purity-foundation-stage3d.md) · [`time-pacing-cultivation-architecture.md`](./time-pacing-cultivation-architecture.md) |
| **Updated** | 2026-11-03 |

## Step 1 — Audit (pre-change)

| Topic | Finding |
|-------|---------|
| **Purity** | `G.qiPurity` bonus; `getQiPurity()`; grows on compression sessions; persists through spend; FE pillar grant (PR #188) |
| **Density** | `G.qiDensity`; PR #187 refill/compression; scales `getTechniqueStatScale` / damage — **not** technique cost |
| **Combat technique cost** | Centralised in `getTechniqueCombatCost()` — tier pool, mastery, affinity/set, body chamber, intent, foundation nature |
| **UI / travel cost preview** | `getTechCost()` — tier + intent only (missing affinity/set until 3E align) |
| **Damage** | `getTechDamage` → `calcCombatTechniqueDamage`; density affects stat scale, not purity |
| **Control / efficiency elsewhere** | Body `qiEfficiencyPct`, `techniqueEfficiencyPct`; transcendence perks; set `costMult` — separate from purity |
| **NPC techniques** | Enemies use simplified turns; no `G.qiPurity` on NPCs yet — `getQiPurityFromState(g)` ready for parity |

**Gap:** Purity had no effect on ordinary Qi technique execution; purity and density both grew on the same compression gate.

## Step 2 — Identities (preserved)

- **Density** — concentration / potency; hurts refill; boosts technique **stat scale** (damage), not cost.
- **Purity** — refinement / control; **reduces Qi technique cost** (cap ~18%), not damage.
- **Foundation** — pillars / grade; unchanged this PR.

## Step 3 — Shipped integration

- `getQiPurityTechniqueCostMult(tech)` in `qi-purity.js` — applies to `costType: 'qi'` (and qi-path defaults); skips spirit.
- Wired into `getTechniqueCombatCost` and `getTechCost`.
- Diminishing returns: `maxReduction 18%` at high bonus purity.

## Step 4 — Progression tweak

- Purity gain requires **≥88% dantian fill** (and compression blend); density still starts ~72%.
- Allows density-first development; purity rewards near-full refinement passes.

## Step 5 — Tests

```bash
node scripts/audit-qi-purity-technique.js
```

## Future

- NPC `qiPurity` field + same cost mult
- Purity affecting misfire/control (not raw damage)
- Cultivation method refinement tracks
