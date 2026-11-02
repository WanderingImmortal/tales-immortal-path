# Property-based alchemy (experimental prototype)

| Field | Value |
|-------|-------|
| **Status** | `building` (isolated prototype — no live integration) |
| **Blocked on** | Owner review of reaction model; mapping to `G.alchemy` / chamber UI |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent 2026-11-03 · `cursor/property-alchemy-prototype-002d` |
| **Updated** | 2026-11-03 |

## Intent

Replace lookup-table “recipe → pill roll” with a **small rule set** over reagent **properties** (spirit, polarity, volatility, stability, impurities, affinities). Players should **experiment → discover → record → improve → automate**, with failures that explain *why* rather than opaque percentage rolls.

This document covers **Phase 1 audit** of live alchemy plus **Phases 2–6** of the isolated prototype under `prototype/property-alchemy/`.

## Phase 1 — Audit of existing alchemy (unchanged in this PR)

| Area | Location | Notes for future property bridge |
|------|----------|----------------------------------|
| **State / save** | `ensureAlchemyState()` in `alchemy.js`; loaded from `core.js` | `G.alchemy`: skill XP, talents, cauldron, flame, `knownRecipes[]`, `materials{}`, `pillSupply{}`, craft counters. **No change** in prototype — good hook for journal + discovered tags later. |
| **Ingredients** | `ALCHEMY_MATERIALS` in `alchemy-data.js`; craft mats via `getAlchemyMaterialDef` | Flat ids + tier/emoji; **no intrinsic properties** today. Dustbone QC adds 10 named mats (`dust_root`, …) aligned with [`dustbone-qc-alchemy.md`](dustbone-qc-alchemy.md). Prototype uses separate `exp_*` ids to avoid save collision. |
| **Recipes / pills** | `ALCHEMY_RECIPES`, `PILL_TYPES` (via recipes’ `pillId`) | **Fixed** ingredient map → predefined `pillId`. Element tag drives flame/physique bonuses. |
| **Proficiency** | `ALCHEMY_SKILL_LEVELS`, `grantAlchemySkillXp`, tier unlocks | Success **percentage** stacking: tier base + skill + cauldron + flame + talents + physique + sect. Future: shift bonuses toward **observation quality**, stability control, automation slots — not gating combinations. |
| **Cauldron / flame** | `ALCHEMY_CAULDRONS`, `ALCHEMY_FLAMES` | Success + potency (cauldron); element-keyed flame bonuses. Future: **heat profile** + stability capacity instead of flat `%`. |
| **Refining loop** | `brewAlchemyPill()` | `advanceTime(recipe.months)` → remove mats → **single RNG** vs `getAlchemySuccessRate()` → `addPill(pillId)` or backlash. Partial mat recovery on fail. **No property mixing.** |
| **Economy** | `getPillSellPrice`, `pillSupply` decay | Supply-sensitive pricing; separate from refinement chemistry. |
| **UI** | `alchemy-chamber.js` | Recipe list, ingredient checkmarks, success %, brew button, animations. **No free-form reagent mixing.** |
| **Time** | `advanceTime` inside brew | Month cost per recipe; world clock pauses overlays via `world-clock.js`. Prototype accepts heat/order only — months can attach later per step. |
| **QC / starter** | `qc-depth.js` | Separate pouch paths for Dustbone mats; still recipe-driven. |

**Reusable infrastructure later:** chamber shell, time billing, material add/remove, skill XP grants (relabelled), cauldron/flame as **condition modifiers**, journal persisted under `G.alchemy.experimentalJournal` (not implemented here).

## Phase 2 — Minimal reaction model

### Properties (every reagent)

| Property | Role |
|----------|------|
| **spirit** | Energy content → potency scale |
| **yin / yang** | Polarity; imbalance + introduction order → strain |
| **volatility** | Heat-driven thermal drive |
| **stability** | Dampens strain (binder / foundation herbs) |
| **impurity** | Reduces effective spirit; gentle heat + **purify** affinity scrubs |
| **affinities** | `qi`, `heat`, `marrow`, `purify`, `toxicity` — continuous effect vector, not pill ids |

### Conditions

| Input | Values |
|-------|--------|
| **heat** | `gentle` (0.35), `medium` (0.65), `fierce` (0.95) |
| **introductionOrder** | `simultaneous`, `yin_first`, `yang_first` (partitions loads into phases) |
| **seed** | Optional; ±3% impurity scatter only |

### Rules (see `simulate.js`)

1. **Phases:** Loads merge into cauldron state; sequential orders apply yin-first or yang-first batches.
2. **Polarity strain:** `imbalance(yin,yang) × spirit × heat`, plus **introduction shock** when phases mix opposing poles.
3. **Thermal drive:** `volatility × heat²` — fierce heat punishes volatile catalysts.
4. **Damping:** `stability` and **purify** affinity reduce net strain; purify works best at gentle heat.
5. **Peak instability** accumulates; thresholds yield `refined`, `unstable_salvage`, `failed`, `rupture`.
6. **Product:** Affinities scaled by effective spirit (impurity-adjusted) → dominant affinity + graded potency/toxicity — **no recipe lookup table**.

## Phase 3 — Experimental reagents (10)

Defined in `prototype/property-alchemy/reagents.js` (`exp_*` ids):

| Id | Name | Role |
|----|------|------|
| `exp_dawn_dew` | Dawn Dew | Carrier, stabiliser |
| `exp_dust_root` | Dust Root | Qi binder, mild impurity |
| `exp_foundation_root` | Foundation Root | High qi + stability |
| `exp_saltbrush` | Saltbrush Tip | Purifier / stabiliser |
| `exp_marrow_thistle` | Marrow Thistle | Marrow affinity, yin |
| `exp_sun_stone` | Sun Stone | Yang catalyst, volatile |
| `exp_blood_crystal` | Blood Crystal | Volatile yang, heat |
| `exp_soul_mist` | Soul Mist | Yin spirit, clash with yang |
| `exp_ironscar_grit` | Ironscar Grit | Heavy impurity, mineral |
| `exp_glowcap` | Glowcap | Yin qi + marrow |

## Phase 4 — Harness results (emergent, not scripted)

Run: `node scripts/test-property-alchemy.js` (includes harness assertions).

| Scenario | Evidence |
|----------|----------|
| **Similar qi paths** | Foundation+Dawn vs Dust+Saltbrush+Dawn → both `refined`, dominant **qi**, potencies ~2.5 vs ~2.1 |
| **Heat changes fate** | Sun Stone + Soul Mist, yang-first: **gentle → refined** (potency 3); **fierce → rupture** (potency 0.6, toxicity 14.6) |
| **Stabiliser rescue** | Sun + Blood: peak instability **3.87 → 0** with double Saltbrush, yin-first |
| **Process saves grit** | Grit + 3× Sun fierce → **unstable_salvage** (toxicity 4.3); gentle purifier-first → **refined** (toxicity 0.5) |
| **Failure informs retry** | Triple volatile fierce → **failed** with adjustment hints; gentle staged run → **refined** (peak 0 vs 14.3) |

Changing **quantities** continuously shifts potency (tested) — outcomes are not keyed by combination id.

## Phase 5 — Recipe journal (data only)

`journal.js`: `createAlchemyJournal()`, `recordExperiment()`, `saveFormulaFromEntry()`, `verifyFormulaReproducible()`.

- Stores reagents, conditions, phase log, observations, product vector, diagnostics.
- **`discovered[reagentId]`** holds player-facing tags (`yin_leaning`, `purifying`, …) — **not** full stat sheets.
- Saved formulas replay deterministically (tested).

No player UI in this PR.

## Phase 6 — Validation summary

### What worked

- Small property set produces **differentiable** outcomes and readable failure hints.
- **Heat** and **introduction order** materially change results without special-case code.
- Multiple ingredient sets can converge on similar **qi** or **heat** profiles via affinities.
- Journal structure separates objective defs vs discovered knowledge.

### What did not / limits

- Only **10** reagents; no elemental flame/cauldron/skills yet.
- Product is a **continuous vector**, not named pills — mapping to `PILL_TYPES` needs design.
- Threshold tuning is hand-set; narrow bands can flip outcomes (exploit: farm instability edge for salvage xp if tied to rewards).
- **Purify** + gentle heat can trivialize impurity-heavy grit unless heat costs time or caps scrub per pass.
- Sequential phases use coarse yin/yang dominance — neutral reagents always land in second phase.

### Known exploits to watch

- Spam gentle + saltbrush to strip impurity on any mix without opportunity cost.
- Double yang-first shock stacking if phase count increases without cauldron capacity limit.
- Seeded impurity noise is cosmetic; remove or tie to skill if used in production.

### Recommended next small step (after owner OK)

1. **Bridge one live material** (e.g. `dawn_dew`) to an `exp_*` property map in data — still no brew UI change.
2. Add **read-only “lab notes” panel** in alchemy chamber calling `simulateRefinement` offline (no inventory mutation).
3. Persist journal under `G.alchemy.labJournal` with migrate-on-load.

Do **not** replace `brewAlchemyPill` until pill mapping and pacing are agreed.

## Implementation crumbs

| Prototype | Future live hook |
|-----------|------------------|
| `simulateRefinement` | New `resolveAlchemyMixture` command (headless) |
| `journal.js` | `G.alchemy.journal` + chamber “Record formula” |
| Heat / order | Cauldron + flame defs → condition struct |
| Skill XP | Grant on **discovery** tags and stable grades, not only on `%` roll |

## Open questions

- How should continuous `effects.qi` map to existing `qi_restore` / store-fill pills?
- One refinement session = one `advanceTime` block or multi-step with interrupts?
- Should instability rupture consume cauldron durability?
