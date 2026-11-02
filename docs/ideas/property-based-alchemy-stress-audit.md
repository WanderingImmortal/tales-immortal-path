# Property-based alchemy — stress test & rules audit

| Field | Value |
|-------|-------|
| **Status** | `building` (investigation complete — awaiting author review) |
| **Blocked on** | Owner decisions on gentle-heat dominance and purify scaling |
| **Issue** | none yet |
| **Chat / PR** | PR #191 follow-up · `cursor/alchemy-stress-audit-002d` |
| **Updated** | 2026-11-03 |
| **Prototype** | [`prototype/property-alchemy/`](../../prototype/property-alchemy/) · prior design: [`property-based-alchemy-prototype.md`](property-based-alchemy-prototype.md) |

## A. Current ruleset (Phase 1 audit)

### Reagent properties (fundamental)

Each reagent contributes **per unit** (linear in quantity):

| Property | Meaning in simulation |
|----------|------------------------|
| **spirit** | Total spiritual load; scales potency and polarity strain multiplier |
| **yin**, **yang** | Polarity charges; imbalance drives strain and introduction shock |
| **volatility** | Feeds **thermal drive** (~× heat²) |
| **stability** | Phase damping (×0.045 per total stability in cauldron) |
| **impurity** | Raw contaminant mass; reduced by purify scrub, then optional seed noise |
| **affinities** | `qi`, `heat`, `marrow`, `purify`, `toxicity` — summed in cauldron, scaled into product vector |

**Derived at load time (not stored on def):** `dominant` pole = `yin` if yin > 1.2× yang, `yang` if yang > 1.2× yin, else `neutral`.

### Universal interaction rules

1. **Introduction phases** — `simultaneous`: one phase. `yin_first` / `yang_first`: split loads by `dominant`; if either side empty, **fallback to single phase** (order has no effect).
2. **Per phase:** merge loads → compute `polarityImbalance`, **introduction shock** (phase index > 0), **thermal drive** = (volatility/units)×heat².
3. **Strain:** `polarityStrain + shockStrain + thermalDrive×0.38 − stabilityDamp − purifyDamp`.
4. **Instability** accumulates; **peakInstability** = max running total.
5. **Purify scrub:** `purifyAffinity × heat × (0.14 if heat < 0.55 else 0.05)` subtracted from impurity.
6. **Seed noise:** ±3% on impurity only (`seed` default 0).
7. **Product:** `spiritPotency = spirit × max(0.2, 1 − impurityRatio×0.65)`; affinities normalized to effects (purify ×0.08, toxicity includes peak×0.4).
8. **Outcome thresholds (peakInstability):** `>16` rupture, `>8.5` failed, `>4.2` unstable_salvage, else refined.
9. **Post-threshold modifiers:** failed/rupture crush qi/heat/marrow; unstable applies salvage factor from **stabilityMargin**.

### Heat and order

- **Heat** scales polarity strain, shock, thermal drive, and purify scrub efficiency (gentle favours scrub).
- **Order** only matters when both yin-first and yang-first buckets are non-empty after split; shock uses polarity of **newly added** charge vs cauldron totals.

### Special-case logic audit

| Kind | Finding |
|------|---------|
| **Reagent-id branches** | **None** in `simulate.js` — behaviour is property-driven only. |
| **Combination lookup** | **None** — no pair→pill table. |
| **Universal discontinuities** | Step thresholds at peak 4.2 / 8.5 / 16; purify scrub coefficient jumps at heat ≈ 0.55; failure/outcome tier jumps. |
| **Mechanically redundant?** | `stabilityMargin` affects grade and salvage factor but **not** outcome tier (outcome uses peak only). Stability still affects peak via damping. |

### No confirmed rule violations

Identical inputs → identical outputs (tested). Trace mode does not alter results (tested). No NaN/Infinity in 11 820 stress runs.

---

## B. Experimental coverage (Phase 2)

**Tooling:** `prototype/property-alchemy/stress-audit.js`, CLI `node scripts/stress-test-property-alchemy.js [--json]`.

| Bucket | Count | Variables |
|--------|------:|-----------|
| Single reagent | 360 | 10 ids × qty 1–4 × 3 heats × 3 orders |
| Pairs | 1 620 | C(10,2) × qty 1–2 each × heat × order |
| Triples | 8 640 | C(10,3) × qty 1–2 each × heat × order |
| Quad sample | 1 200 | Seeded random (seed 90210), qty 1–2, random heat/order |
| **Total** | **11 820** | All with `seed: 0` |

**Excluded:** qty > 2 on multi-reagent mixes (except singles up to 4); 5+ reagent mixes; non-zero seeds in bulk sweep (seed behaviour spot-checked separately); live `G.alchemy` / inventory.

**Order sensitivity probes:** 5 fixed mixes × 3 heats × 3 orders = 15 comparison sets.

**Exploit probes:** heat A/B, Saltbrush stacking, grit+purifier bundle, Sun Stone qty 1–5, purify-dominant pair sample.

---

## C. Statistical findings

### Outcome distribution (11 820 runs)

| Outcome | Count | % |
|---------|------:|---:|
| refined | 10 021 | 84.8% |
| unstable_salvage | 1 199 | 10.1% |
| failed | 593 | 5.0% |
| rupture | 7 | 0.06% |
| errors | 0 | 0% |

### By heat (all failures are fierce; all gentle runs refined)

| Heat | refined | unstable | failed | rupture | n |
|------|--------:|---------:|-------:|--------:|---:|
| gentle | 3 929 | 0 | 0 | 0 | 3 929 |
| medium | 3 506 | 447 | 0 | 0 | 3 953 |
| fierce | 2 586 | 752 | 593 | 7 | 3 938 |

### Dominant affinity (all outcomes)

| Affinity | Count |
|----------|------:|
| qi | 5 405 |
| heat | 3 082 |
| marrow | 1 978 |
| purify | 1 355 |

Refined-only potency spreads: qi 0.1–9.4, heat 0.1–9.6, marrow 0.1–5.9, **purify 0.1–3.1** (lower ceiling due to ×0.08 scale).

### Reagent presence (high-potency refined rate)

| Reagent | High-potency refined rate* | Toxic failure rate |
|---------|---------------------------:|-------------------:|
| exp_foundation_root | 62.2% | 3.5% |
| exp_soul_mist | 52.8% | 7.1% |
| exp_dust_root | 49.3% | 3.7% |
| exp_sun_stone | 47.4% | 11.9% |
| exp_saltbrush | 23.7% | 3.0% |
| exp_ironscar_grit | 17.3% | 2.0% |

\*Potency ≥ 3 and outcome refined, among runs containing that reagent.

**Rarely useful:** none met the “&lt;2% high-potency refined with &gt;100 presence” filter — grit is weak but still present in many refined qi/marrow paths via dilution.

### Introduction order

- **6 / 15** probe sets changed **outcome tier** across simultaneous / yin_first / yang_first (same heat + reagents).
- Average peak instability spread within sets: **3.05** — order matters materially when phases split.

### Comparable products

Many distinct reagent sets map to the same **dominant** affinity with overlapping potency bands (e.g. qi refined spread 9.3). Multiple paths to qi/heat/marrow exist; **purify-dominant** refined products are reachable but capped lower.

---

## D. Dominant strategies (Phase 3)

Ranked by concern for “coherent world, not one correct button”:

1. **Gentle heat on everything safe** — In 3 929 gentle runs, **zero** unstable/failed/rupture. Reduces entire failure loop to optional roleplay unless players voluntarily use higher heat.
2. **Saltbrush + Dawn Dew (+ Foundation) prefix** — Stabiliser/purifier stack drives peakInstability to 0 for most volatile mixes; 3× Saltbrush with Sun+Blood shifts product toward **purify-dominant** with low toxicity (support becomes primary yield).
3. **Yin-first staging of purifiers before catalysts** — Combines with rule (1)–(2) to erase introduction shock; medium heat becomes “safe enough” for many pairs.
4. **Sun Stone quantity stacking at gentle heat** — Linear potency growth (qty 3 → 7.2 potency) while staying **refined**; medium heat locks same mix in **unstable_salvage** with *lower* potency — reward for gentle, not trade-off.
5. **Fierce heat as trap only** — In probes, fierce is rarely strictly better than gentle on toxicity/potency; it mainly triggers failure tiers (593 failed + 7 rupture in sweep).

**Stabiliser downside:** Adding Saltbrush can **lower** heat potency (dilution + purify-dominant shift) — confirmed in saltbrush_stack probe (heat potency 2.9 → 2.5 → purify 2.3). Trade-off exists but safety gain is larger.

**Purification:** Gentle scrub can leave **impurityRatio &gt; 1** (grit bundles) while still **refined** because instability stays 0 — impurities affect potency but not failure.

**Fierce advantage (narrow):** Theoretically higher thermal drive could enable alternate routes if damping were insufficient; in practice **gentle dominates** on both safety and potency for sampled catalysts.

---

## E. Emergent behaviour (five traced examples)

Use: `node scripts/explain-property-alchemy-refinement.js '<json>'` (developer-only).

### 1. Heat gate on yang–yin pair

**Input:** Sun Stone + Soul Mist, `yang_first`, gentle vs fierce.

| | gentle | fierce |
|---|--------|--------|
| Outcome | refined | rupture |
| Potency | 3.0 | ~0.6 |
| Peak | ~2.3 | ~16.5 |

**Causal chain (fierce):** yang phase loads cauldron → yin phase triggers **introduction_shock** → **thermal_pressure** from volatility×heat² → **destabilisation** exceeds damp → **outcome_threshold** rupture → **product_collapse**.

### 2. Convergent qi paths

Foundation+Dawn vs Dust+Saltbrush+Dawn (gentle, simultaneous): both **refined**, dominant **qi**, potency ~2.5 vs ~2.1 — different reagents, shared stabilising/purifying dynamics.

### 3. Saltbrush tames catalysts

Sun + Blood medium simultaneous: peak ~3.87, refined heat ~3.6. Add 2× Saltbrush yin-first: peak **0**, toxicity 0.4 — **stabilisation** events each phase, introduction shock absorbed.

### 4. Process over composition (grit)

Ironscar Grit 2 + Sun 3 fierce: **unstable_salvage**, toxicity 4.3. Same grit with Saltbrush+Dawn gentle yin-first: **refined**, toxicity 0.5, dominant purify — **purify_scrub** at gentle heat despite high impurity ratio.

### 5. Failed experiment → adjusted retry

Sun + 2× Blood + 2× Soul, fierce yang-first: **failed**, peak ~14.3, diagnostics suggest stabiliser + lower heat. Staged gentle run with Saltbrush+Dawn: **refined**, peak 0 — same rules, no scripted outcome id.

---

## F. Inconsistencies and weaknesses

| Type | Item |
|------|------|
| **Balance problem** | Gentle heat never fails in 3 929-run slice — risk/reward for heat settings is one-sided. |
| **Balance problem** | Sun Stone: gentle strictly better potency + tier than medium for solo stacks. |
| **Mechanical bias** | Purify affinity capped lower in product formula (×0.08) — purify-dominant pills weak vs qi/heat. |
| **Design question** | Should high impurityRatio (&gt;1) block refined tier even at peakInstability 0? |
| **Design question** | Is “support reagent becomes main product” (Saltbrush → purify dominant) desirable? |
| **Missing mechanic** | No time/cost for heat or phases — dominant strategy has no opportunity cost. |
| **Not a violation** | Step thresholds create discrete jumps — intentional but opaque to players. |
| **Not a violation** | Neutral reagents always second phase — predictable quirk, not id-specific cheat. |

---

## G. Recommendations (future PRs — do not implement here)

1. **Heat must carry cost or risk trade-off** — e.g. gentle costs more time; fierce required for certain affinity activation; or gentle caps potency on volatile mixes. *Highest priority.*
2. **Instability coupling to impurity** — high impurityRatio adds strain or blocks “refined” unless purify phase clears a fraction. *High.*
3. **Normalize purify product scale** — align ×0.08 with other affinities or treat purify as non-dominant buff only. *Medium.*
4. **Medium heat niche** — scrub efficiency curve without making gentle strictly safer and stronger. *Medium.*
5. **Cauldron capacity / phase limits** — prevent infinite Saltbrush stacking from zeroing peak every time. *Lower.*

---

## Validation

```bash
node scripts/test-property-alchemy.js
node scripts/test-property-alchemy-audit.js
node scripts/stress-test-property-alchemy.js
```

Developer trace (no player UI):

```bash
node scripts/explain-property-alchemy-refinement.js '{"reagents":[{"reagentId":"exp_sun_stone","qty":1},{"reagentId":"exp_soul_mist","qty":1}],"heat":"fierce","introductionOrder":"yang_first"}'
```
