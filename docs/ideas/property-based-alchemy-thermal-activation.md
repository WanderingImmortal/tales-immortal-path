# Property-based alchemy — heat activation & material transformation (PR #192)

| Field | Value |
|-------|-------|
| **Status** | `building` (prototype only — awaiting author review) |
| **Blocked on** | Owner review before live bridge |
| **Issue** | none yet |
| **Chat / PR** | `cursor/heat-activation-alchemy-002d` |
| **Updated** | 2026-11-03 |
| **Prior** | [#190 prototype](property-based-alchemy-prototype.md) · [#191 audit](property-based-alchemy-stress-audit.md) |

## Revised thermal rules

### Derived thermal profile (per reagent, no id-specific branches)

From intrinsic properties (`impurity`, `spirit`, `volatility`, `stability`, affinities):

| Derived field | Meaning |
|---------------|---------|
| **activationThreshold** | Heat (0–1) needed to begin releasing bound essence |
| **toleranceMax** | Heat where overburn converts activated mass to degradation |
| **extractionWidth** | Smoothstep width for activation ramp |

Implementation: `prototype/property-alchemy/thermal.js` → `deriveThermalProfile()`.

### Per thermal pass (conserving spirit)

On current **bound** slice at heat `h`:

1. **activation** = smoothstep(threshold → threshold+width, h)
2. **overheat** = smoothstep(tolerance−width → tolerance, h)
3. **remainBound** = 1 − activation (still locked in matrix)
4. **releaseEfficiency** = activation × (1 − overheat) → joins **released** (reactive) pool
5. **degradeFraction** = activation × overheat → **degraded** pool (affinities broken down; toxicity retained)

Spirit is conserved: bound + released + degraded = input (tested).

### Refinement flow

1. Register inputs → per-reagent **bound** buckets.
2. For each introduction **phase**, run optional **heatStages[]** (sequential thermal passes).
3. **Reactive chemistry** (instability) uses **released** essence + **phase volatility** (whole charge heated).
4. **Condensation** builds **product** from **released** affinities only.
5. **process.outcome** from peak instability; **product.suitability** from impurity/toxicity/potency separately.

### Multi-stage heat (internal)

Input: `heatStages: ['fierce', 'gentle']` — runs passes in order within each phase (future multi-step UI hook).

Legacy single `heat` = one pass per phase.

## Material conservation

| Pool | Meaning |
|------|---------|
| **released** | Reactive essence available for mixing / condensation |
| **bound** | Unextracted matrix (reusable in a later refinement pass) |
| **degraded** | Thermally broken mass (residual hazard / slag; affinity-poor) |
| **residual** | bound + degraded after run (salvage hook) |

Failed **process** does not zero **residual** — e.g. fierce yang clash may **rupture** while leaving large **degraded** + **bound** spirit.

## Before / after (stress highlights)

Full sweep: `node scripts/stress-test-property-alchemy.js` (11 820 cases).

| Metric | PR #191 legacy | PR #192 thermal |
|--------|----------------|-----------------|
| Single-reagent ×3 heats (30 runs) refined | 26 | 23 |
| … unstable / failed / rupture | 3 / 1 / 0 | 4 / 2 / 1 |
| **Gentle heat** (3929 runs) failed+rupture | **0** | **0** (still safest band) |
| **Medium** failed+rupture | 0 | 333 |
| **Fierce** failed+rupture | 600 | **1273** |
| Overall refined rate | ~84.8% | ~65.5% |

Gentle is **no longer strictly superior on potency** for all materials: delicate herbs **lose qi** when overheated; minerals may **require medium** to release essence; catalysts need heat but risk **process** failure.

Quick compare script: `node scripts/compare-thermal-model.js`

## Required demonstrations (harness)

`node scripts/test-property-alchemy-thermal.js` — scenarios A–E in `thermal-harness.js`.

## Known limitations

- **Gentle band** still has ~zero process failures in bulk sweep — safer, not universally stronger.
- **Fierce** on minerals can convert everything to **degraded** with zero **released** (needs staged heat or medium for extraction).
- Product **potency** can be low while **residual** still carries affinity mass (intentional separation).
- Purify scrub still favours gentle condensation (not reworked in this PR).

## Future compatibility

| Future feature | Hook |
|----------------|------|
| Multi-stage refining UI | `heatStages[]` per phase |
| Salvage economy | `material.residual` / `byReagent` buckets |
| Intermediate items | `released` / `bound` as inventory objects |
| Recipe journal | `journal` entries now store `process` + `material` |
| Knowledge vs truth | sim = full material; UI shows observations only |
| Research automation | batch experiments over harness |

## Validation

```bash
node scripts/test-property-alchemy.js
node scripts/test-property-alchemy-thermal.js
node scripts/test-property-alchemy-audit.js
node scripts/stress-test-property-alchemy.js
node scripts/explain-property-alchemy-refinement.js '{"reagents":[{"reagentId":"exp_ironscar_grit","qty":2}],"heat":"medium","trace":true}'
```
