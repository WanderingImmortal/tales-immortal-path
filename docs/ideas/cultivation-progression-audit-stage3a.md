# Cultivation progression audit — Stage 3A

| Field | Value |
|-------|-------|
| **Status** | `designed` (measurement complete; no balance changes) |
| **Blocked on** | Owner decisions in §6 before Stage 3B |
| **Harness** | `scripts/audit-cultivation-progression.js` |
| **Architecture hub** | [`time-pacing-cultivation-architecture.md`](./time-pacing-cultivation-architecture.md) |
| **Updated** | 2026-11-02 |

## Scope

Investigation only: formulas, deterministic measurement, NPC parity notes. No yield, root, lifespan, breakthrough, routine, or NPC-engine changes.

---

## Phase 1 — Implementation map

| System | Band progress (QC Mid/Late/Peak) | Qi density / fill (`runCultivateSession`) | Time billing |
|--------|----------------------------------|-------------------------------------------|--------------|
| **Passive week** | `getPassiveGatherUnits()` → `applyQcGatherBandProgress` | `yieldScale = 0.055 × getPassiveCultivationSupportMult()` | Living clock week or `tickPassiveCultivationForMonths` on billed advance (unless `skipPassiveCirculation`) |
| **Focused month** | `getFocusedGatherUnits()` | `yieldScale = 0.82 × getFocusedCultivationSupportMult()` | `advanceTime(1, …, { skipPassiveCirculation: true })` or clock project |
| **Chamber gather** | `getChamberGatherProgressUnits()` (= `getFocusedGatherUnits()/4`) | Separate `CHAMBER_BALANCE.gatherQi` density/fill × `getChamberCultivateMult()` | `advanceChamberWeeks` (skips passive batch) |
| **Long seclusion** | **None** | `runCultivateSession({ extraMult: 0.22, silent })` once per playback year | `processWorldTime` per year via seclusion project |

**Support stack (passive / gather units):** `bareBreathMult` (0.32 without formal manual) × `getTalentGatherMult()` (delegates to `getTalentCultivateMult()` = composition × grade) × dwelling × method × residence formation × sect × faction.

**Focused gather formula:** `max(0.5, focusedUnitsPerMonth × support × (focusedWeeksEquivalent/4))` with `focusedUnitsPerMonth=5.5`, `focusedWeeksEquivalent=6`.

**Spirit root (grade × pentamixed composition example):**

| Grade | `cultivateSpeedMult` (grade only) | Combined w/ pentamixed 0.80 |
|-------|-----------------------------------|-----------------------------|
| Inferior | 0.75 | 0.60 |
| Common | 1.00 | 0.80 |
| Superior | 1.18 | 0.944 |
| Heavenly | 1.35 | 1.08 |

**QC band thresholds** (`qc-depth.js`): Mid 90 · Late 220 · Peak 320 cumulative gather-units. **FE attempt gate:** `hasQcBandBreakthroughReady()` (Late or Peak band) plus separate consolidation/breakthrough rules in `consolidation.js` / `cultivation.js` (not simulated here).

**Lifespan:** `STARTING_AGE_YEARS = 16`, mortal/QC tier `LIFESPAN_BY_REALM[0] = 80` years.

**NPC growth** (`world.js` `tickWorldNpcGrowth`): `growthProgress += effectiveMonths × growthRate`; every `NPC_ECOSYSTEM.growthMonthsPerBreakthrough` (120) months roll `breakthroughChance`; **no QC band model**, no passive/focused/chamber split.

### Deliberate vs accidental

| Item | Assessment |
|------|------------|
| Seclusion omits QC bands | Deliberate quiet growth; misaligned with “seclusion = highest sustained qi efficiency” pillar unless band path added later |
| Chamber band ≈ ¼ focused units per week, ~same band/month as 4 passive weeks if per-tick floors equalize | See **0.5 gather floor** below — likely unintentional interaction |
| `getQcGatherProgressUnits()` legacy table (1.0–2.2) vs `getTalentGatherMult()` | Legacy path unused when `passive-cultivation.js` loaded |
| Passive density ~0 in bare-breath sim | `yieldScale` 0.055 × low support → density rounds to 0; band progress still advances via floor |
| Focused slower than passive to Mid in harness | **Not** because focused units/month &lt; passive — because **`applyQcGatherBandProgress` enforces `max(0.5, amount)` per call** while passive calls it **every week** |

---

## Phase 2 — Measured progression (baseline)

**Scenario:** pentamixed · inferior/common/superior/heavenly · bare breath · homeless · no sect/faction/formations · QC `realmIdx=0` · age 16 · lifespan 80y.

Run: `node scripts/audit-cultivation-progression.js`

### Gather-units per month (from live functions)

| Grade | Passive | Focused | Chamber | Seclusion |
|-------|---------|---------|---------|-----------|
| Inferior | 0.080 | 1.426 | 1.426 | 0 |
| Common | 0.083 | 1.901 | 1.901 | 0 |
| Superior | 0.098 | 2.243 | 2.243 | 0 |
| Heavenly | 0.112 | 2.566 | 2.566 | 0 |

*(Passive nominal units are below 0.5/week; see floor effect.)*

### Months to QC milestones (simulated with real tick functions)

**Mid (90 units)**

| Grade | Passive | Focused | Chamber |
|-------|---------|---------|---------|
| Inferior | 45 | 64 | 45 |
| Common | 45 | 48 | 45 |
| Superior | 45 | 41 | 40.3 |
| Heavenly | 45 | 36 | 35.3 |

**Late (220) — FE band gate opens**

| Grade | Passive | Focused | Chamber |
|-------|---------|---------|---------|
| Inferior | 110 (~25.2y) | 155 (~28.9y) | 110 (~25.2y) |
| Common | 110 | 116 | 110 |
| Superior | 110 | 99 | 98.3 |
| Heavenly | 110 | 86 | 85.8 |

**Peak (320)**

| Grade | Passive | Focused | Chamber |
|-------|---------|---------|---------|
| Inferior | 160 (~29.3y) | 225 (~34.8y) | 160 (~29.3y) |
| Common | 160 (~29.3y) | 169 (~30.1y) | 160 |
| Superior | 160 | 143 | 142.8 |
| Heavenly | 160 | 125 | 124.8 |

**Remaining lifespan at Peak (passive/chamber):** ~50 years (age ~29). **At FE eligibility (Late):** ~54 years remaining (age ~25).

**Seclusion (40y):** gather progress 0, Early band, density ~1.2 (inferior)–2.0 (heavenly), **not FE-ready**.

### Breakthrough separation

This audit measures **cultivation accumulation** and **QC band gates** only. FE success still requires consolidation density/foundation/rolls — not computed here.

---

## Phase 3 — Efficiency comparison

| Question | Finding |
|----------|---------|
| Seclusion vs passive QC bands | Seclusion **does not** advance bands; 40y seclusion leaves player Early QC |
| Focused vs passive | Nominal **~18×** gather-units/month (inferior), but **simulated passive wins to Mid/Late/Peak** for inferior/common because **4× weekly `max(0.5, …)` calls** beat **1× monthly focused gain** until focused units exceed ~2/month (superior/heavenly eventually win) |
| Chamber vs passive | **Same band months** as passive for inferior/common (weekly floor 0.5 dominates); chamber adds **large density** side path (e.g. ~90 density at Peak vs ~0 passive density in bare-breath) |
| Overlapping rewards | Stage 1 `skipPassiveCirculation` prevents passive batch on focused/chamber/breakthrough advances — **no double passive+focused on same months** |
| Batch vs stepped passive | **Identical** (12mo batch vs 48 weekly ticks) |
| Spirit root consistency | Single stack via `getTalentCultivateMult` for both session and gather when talent.js loaded |

### Exploit / inconsistency highlight

```246:252:qc-depth.js
function applyQcGatherBandProgress(amount) {
    ...
    const gain = Math.max(0.5, Number(base) || getQcGatherProgressUnits());
```

With bare-breath passive `getPassiveGatherUnits()` ≈ 0.02–0.09/week, **each week still credits 0.5 band units**. That yields ~**2 units/month passive** effective, not the nominal ~0.08. Focused sessions credit ~1.4–2.6 once per month → **slower than “idle circulation”** for weaker roots.

---

## Phase 4 — NPC parity

| Dimension | Player (QC) | NPC (`wanderer`, rate 1.0, BT chance 0.26) |
|-----------|-------------|---------------------------------------------|
| Progress model | QC gather bands + density | Abstract `growthProgress` → realm index |
| 40y alive time | Passive: **960 band units**, Peak, FE-ready band | Example seed: **realmIdx 0** (rolls may fail); **480 progress credit**, 4×120mo cycles |
| Spirit root | Explicit grade/composition | **Not modeled** per NPC |
| Seclusion / chamber | Distinct actions | **Not available** |

Background NPCs use cheap aggregation; parity with player **QC depth is not attempted today**. Calibration idea for 3B+: express NPC monthly “cultivation credit” in **equivalent gather-units** or share one `creditCultivationProgress(units, source)` used by player bands and NPC realm steps.

---

## Phase 5 — Recommendations

### Unified cultivation activity model (proposal)

1. **One progress ledger** for QC bands: always add **raw gather-units** (no hidden per-call floor, or floor applied once per month max).
2. **Activity profile** per action: `{ bandUnits, sessionYieldScale, densityPolicy, billsMonths, skipPassive }` — seclusion must declare band policy explicitly.
3. **Seclusion:** either add band credit consistent with design pillar, or document as “density-only retreat” and tune `extraMult`/year count separately.
4. **Chamber:** keep extra density path; align band/week with focused equivalence **after** floor fix.

### Owner decisions (approval required)

1. **Remove or relocate `max(0.5, amount)` floor** — global fix vs per-activity minimum?
2. **Target QC pacing** for pentamixed inferior bare-breath: design note ~FE by 50–60y vs current **~25y Late / ~29y Peak** (with floor) — which anchor is authoritative?
3. **Seclusion role:** full QC progression, partial, or density-only?
4. **Should passive weekly density** remain negligible at bare breath, or should density and bands scale together?

### Stage 3B incremental plan (implementation — not started)

1. Fix measurement regressions: harness asserts expected **nominal** rates once floor decision landed.
2. Introduce `CULTIVATION_ACTIVITY_PROFILES` (read-only config) mirroring audit table — no yield changes until approved.
3. Align seclusion year hook with chosen band policy.
4. Optional: NPC `growthProgress` scaling factor derived from harness “equivalent units/month” table.
5. Re-run full audit + update this doc; only then tune `PASSIVE_CULTIVATION_BALANCE` / thresholds if owner approves.

---

## Harness limits

- Loads `talent.js`, `passive-cultivation.js`, `seclusion-project.js`, `actions.js` (`runCultivateSession`) under Node stubs; QC band functions mirrored from `qc-depth.js` (logic-equivalent slice).
- Random density rolls fixed at `0.5` for determinism.
- Does not load full `chamber.js` UI path; chamber gather uses same band + balance constants as production gather handler.
- Does not simulate FE breakthrough probability or consolidation minima.
