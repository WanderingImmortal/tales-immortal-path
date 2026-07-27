# Living world clock (continuous calendar)

| Field | Value |
|-------|-------|
| **Status** | `building` (Phase 1) |
| **Blocked on** | none for Phase 1 spine |
| **Issue** | none yet |
| **Chat / PR** | `cursor/living-world-clock` |
| **Updated** | 2026-07-27 |

Sister: [`chronicle-and-projects.md`](chronicle-and-projects.md) (bounded seclusion playback). QC cultivate-on-clock parks until Phase 1–2.

## Intent

Replace shuttered “time only moves when you click” with a **soft real-time living calendar**: age can advance while Play is on; Pause freezes time for thinking. Fiction lifespan stays long; wall-clock sessions get shorter.

## Design notes (Phase 1 locks)

### Rates

| Preset | Rate |
|--------|------|
| Slow | 1 game week / 8 real seconds |
| **Normal** | **1 game week / 5 real seconds** |
| Fast | 1 game week / 2.5 real seconds |

Week chunk ≈ `1/4` month (`ageMonths`). Player digests stay **monthly** (no weekly log spam).

### Pause

- **Start Paused** on load / new game
- Dedicated Play/Pause (top-right clock bar) + **Space**
- Hard freeze: combat, tribulation, blocking overlays, creation screen, game over, tab blur, seclusion playback

### Time ownership

- **Play (live):** clock owns age; `advanceTime` month costs zeroed (action effects still run)
- **Paused:** legacy action month costs unchanged

### UI

Top-right clock bar: Play/Pause · Slow/Normal/Fast · age `Yy Mm`

### Perf

One `advanceTimeQuiet` per week flush (batched delta) — not per-day × NPC loops.

## Prerequisites

- [x] Owner Phase 1 locks
- [ ] Phase 1 ship (ticker + UI + advanceTime gate)
- [ ] Phase 2 rent/world sinks polish + migrate hot `advanceTime` paths
- [ ] Phase 3 QC cultivate stance on clock

## Open questions

- Merge lifespan chip with clock bar later?
- When to open Fast year-scale for immortals only?

## Implementation crumbs

`world-clock.js`, `time-playback.js` (`advanceTimeQuiet`), `core.js` (`advanceTime`), `index.html` clock bar, `main.js` / `ui.js`
