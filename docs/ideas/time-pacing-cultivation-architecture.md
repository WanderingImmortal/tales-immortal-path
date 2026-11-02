# Time, pacing & cultivation architecture

| Field | Value |
|-------|-------|
| **Status** | `building` (Stage 3A audit complete) |
| **Blocked on** | Owner decisions in Stage 3A §6 before 3B balance implementation |
| **Issue** | none yet |
| **Chat / PR** | Stage 1 PR #183 · Stage 2 PR #184 · Stage 3A audit doc |
| **Updated** | 2026-11-02 |

## Intent

One authoritative world timeline (`G.ageMonths`); active play, routines, and seclusion share `processWorldTime`. Cultivation balance changes are staged separately from billing and world-sim fixes.

---

## Stage 1 — Consistent time billing (shipped, PR #183)

**Rule:** Action duration does not depend on Play/Pause. Pausing stops automatic week flushes only.

| Piece | Role |
|-------|------|
| `advance-time-rules.js` | `resolveBillableAdvanceMonths`, `shouldPauseLivingClockForPlayerAdvance` |
| `core.js` `advanceTime` | Bills months; pauses living calendar on player advances; `skipPassiveCirculation` for dedicated qi sessions |
| `scripts/audit-time-billing.js` | Billing regression audit |

See git history for full billing model and passive-batch notes.

---

## Stage 2 — World simulation consistency (shipped)

### Processing order (after Stage 2)

`processWorldTime(from, to)` in `world-scheduler.js`:

1. Walk the interval in **segments** bounded by the next scheduled event in `(cursor, to]`, or `to` if none.
2. For each segment `[cursor, segmentEnd]`: run **`runWorldTicks`** (all `WORLD_TICKS` with that delta), set `G.ageMonths = segmentEnd`.
3. **Fire** all schedule events with `at === segmentEnd` (removed from `G.worldSchedule`), with world state already advanced to that date.
4. Repeat until `cursor === to`.

`advanceTime` / `advanceTimeQuiet` still call `processWorldTime` once per billed span; seclusion playback uses the same spine per year step.

`flushWorldSchedule(from, to)` remains a **legacy events-only** helper (no ticks) for callers that only need to fire handlers.

### Confirmed issues fixed

| Issue | Was | Fix |
|-------|-----|-----|
| **Schedule vs ticks order** | All due events fired, then one full-interval tick with `from→to` | Segment at event boundaries; ticks before events at each boundary |
| **NPC lifespan vs long skip** | Full `monthsPassed` applied to age/growth before death check | `effectiveMonths = min(monthsPassed, lifespan - age)`; progression credited for effective alive time, then death |

### Intentional abstractions (unchanged)

- **Aggregate NPC cultivation** — `growthProgress += effectiveMonths * rate` with random breakthrough rolls; not stepwise day sim. Large skips may differ **stochastically** from many small skips (same expected class, not identical rolls).
- **Ambient NPCs** — skipped in `tickWorldNpcGrowth` (`state === 'ambient'`).
- **`tickNpcWorld`** — stub; no per-NPC detail sim.
- **Sect / faction / quest ticks** — still receive one `delta` per segment (or full span if no events); no new micro-routines.
- **Relationship decay** — aggregate `monthsPassed * decayPerMonth` per segment (acceptable approximation).

### Large skips & performance

- Segmentation adds one tick pass per **scheduled event** in the interval, not per month/week.
- `scripts/audit-world-sim.js` **Test F** samples 1 / 10 / 100 year jumps with ~80 NPCs + growth tick (see CI/pre-pr output for ms).
- No per-NPC per-week loops for the whole population.

### Remaining limitations

- Events that **mutate** progression rules mid-span do not automatically subdivide ticks beyond schedule boundaries (no new event types added this stage).
- **`fireWorldEvent`** still restores `G.ageMonths` after handlers when handlers temporarily adjust age (legacy); handlers should rely on world state at `ev.at` after segment ticks.
- **Stochastic** systems (NPC breakthrough rolls, ambient refresh chances) may differ between one large jump and many small jumps.
- **Player cultivation** during seclusion vs active play — Stage 3; Stage 2 tests world/NPC age and deterministic tick sums only.

### Tests

```bash
node scripts/audit-world-sim.js   # schedule order, NPC lifespan, stepped vs batch ticks, perf sample
node scripts/audit-time-billing.js
```

Both are run from `scripts/pre-pr-check.sh`.

---

## Stage 3A — Cultivation progression audit (measurement only)

**Deliverables:** [`cultivation-progression-audit-stage3a.md`](./cultivation-progression-audit-stage3a.md) · `scripts/audit-cultivation-progression.js`

### Summary findings

| Topic | Result |
|-------|--------|
| **Harness** | Deterministic Node sim using real `passive-cultivation`, `runCultivateSession`, seclusion year hook, QC band rules |
| **Seclusion** | No QC band progress; ~0.22× cultivate mult per year — **not** competitive with passive/focused/chamber for realm bands |
| **Focused vs passive** | Nominal ~18× units/month (inferior), but **`applyQcGatherBandProgress` `max(0.5, …)` per weekly passive tick** makes passive/chamber **faster to Mid/Late/Peak** for inferior/common |
| **Chamber** | Same band months as passive when floor dominates; **much higher density** than bare passive |
| **Batch vs step** | Passive batch matches weekly ticks |
| **NPC** | Aggregate `growthProgress`/120mo rolls — **no QC bands**, no root parity |

### Measured baseline (pentamixed · bare breath · homeless · age 16)

| Milestone | Inferior passive (mo / age) | Inferior focused | Notes |
|-----------|----------------------------|------------------|-------|
| Late (FE band gate) | 110 / ~25y | 155 / ~29y | ~54y lifespan left at Late (passive) |
| Peak | 160 / ~29y | 225 / ~35y | Design anchor ~50–60y FE **not** matched at current floor + thresholds |

Run measurements: `node scripts/audit-cultivation-progression.js`

### Stage 3B (not started — needs owner approval)

See audit doc §5–§6: floor rule, seclusion band policy, pacing anchors, then optional `CULTIVATION_ACTIVITY_PROFILES` + NPC calibration.

---

## Stage 3+ (after 3B)

- Routines on living clock
- Fractional social `ACTION_MONTHS` when paused

---

## Pre–Stage 1 reference

See PR #182 / git history for original architecture review and risks matrix.
