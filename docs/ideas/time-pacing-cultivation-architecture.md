# Time, pacing & cultivation architecture

| Field | Value |
|-------|-------|
| **Status** | `building` (Stage 1 time billing shipped) |
| **Blocked on** | Owner review → Issue for cultivation activity profiles (Stage 2) |
| **Issue** | none yet |
| **Chat / PR** | Stage 1 PR (time billing) · original review Nov 2026 |
| **Updated** | 2026-11-01 |

## Intent

One authoritative world timeline (`G.ageMonths`); active play, routines, and seclusion share `processWorldTime`. Cultivation balance changes are staged separately from billing fixes.

---

## Stage 1 — Consistent time billing (implemented)

### Rule

**Action duration does not depend on Play/Pause.** Pausing stops automatic week flushes only.

### Code

| Piece | Role |
|-------|------|
| `advance-time-rules.js` | Pure helpers: `resolveBillableAdvanceMonths`, `shouldPauseLivingClockForPlayerAdvance` |
| `core.js` `advanceTime` | Always bills resolved months; pauses living calendar on player advances with `months > 0` |
| `passive-cultivation.js` | `tickPassiveCultivationForMonths` runs for all billed `advanceTime` jumps (removed live skip) |
| `world-clock.js` | `spendActionMonths` delegates to `advanceTime` (removed `instantWhileLive`) |
| `scripts/audit-time-billing.js` | Node audit for billing contracts |

### Billing model

| Kind | Who advances age |
|------|------------------|
| Instant (`months === 0` or `opts.free`) | No age change |
| Player action (`advanceTime`, default `timeSource: 'player'`) | Billed months via `processWorldTime`; **pauses** living calendar first |
| Living calendar week | `advanceTimeQuiet` in `flushWorldClockWeek` (unchanged) |
| Timed project | Calendar weeks until `endsAtMonths`; completion handler **does not** re-bill |
| Seclusion playback | `advanceTimeQuiet` per year (unchanged this stage) |

### Deliberately unchanged (Stage 1)

- Cultivation yield multipliers, seclusion `extraMult`, NPC `tickWorldNpcGrowth` rates
- `ACTION_MONTHS` values
- Live-only **project** UX for travel / jobs / focused cultivate (same total duration as paused `advanceTime`)
- Chamber overlays still allow calendar ticks **when Play is on and no billed action**; each billed chamber week pauses Play (anti double-count)

### Known follow-ups (later stages)

- Routines (`G.worldClock.routine`)
- Seclusion real interrupts via `worldSchedule`
- `applyCultivationActivity` profile consolidation
- Fractional social costs when paused (`time-model.md`)

### Tests

```bash
node scripts/audit-time-billing.js
```

---

## Pre–Stage 1 reference (architecture review)

See git history / PR #182 for full Phase 1–4 review (current vs recommended architecture, risks, test matrix). Stage 2+ items there remain valid; billing zeroing called out in that doc is **removed** as of Stage 1.
