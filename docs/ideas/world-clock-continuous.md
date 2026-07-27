# Living world clock (continuous calendar)

| Field | Value |
|-------|-------|
| **Status** | `building` (Phase 1 shipped on PR; Phase 2 designed) |
| **Blocked on** | none for Phase 2 spine |
| **Issue** | none yet |
| **Chat / PR** | [PR #85](https://github.com/WanderingImmortal/tales-immortal-path/pull/85) · `cursor/living-world-clock` |
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

Week chunk ≈ `1/4` month (`ageMonths`).

### Pause

- **Start Paused** on load / new game
- Dedicated Play/Pause (top-right clock bar) + **Space**
- Hard freeze: combat, tribulation, blocking overlays, creation screen, game over, tab blur, seclusion playback

### Time ownership (Phase 1)

- **Play (live):** clock owns age; `advanceTime` month costs zeroed (action effects still run)
- **Paused:** legacy action month costs unchanged

### UI

Top-right clock bar: Play/Pause · Slow/Normal/Fast · age `Yy Mm` (sits left of cultivator silhouette)

### Perf

One `advanceTimeQuiet` per week flush (batched delta) — not per-day × NPC loops.

---

## Phase 2 locks (owner 2026-07-27)

### Monthly digests

**A — one quiet diary line per month** while live (e.g. “A month passes…”), not only-on-events and not a toast panel.

### Action model (migration direction)

Two families replace “every click spends months”:

| Kind | Feel | Examples |
|------|------|----------|
| **Stance / toggle** | Turn on; keeps going while clock runs; turn off when done | Gathering qi / cultivate stance |
| **Timed project** | Start once; you are “doing X” for N months; ends when duration completes | A job that takes 5 months |

Phase 2 starts the migration (hot paths + clear UI for “currently doing”). Full QC Practice Session polish is still Phase 3.

### Rent / upkeep

- **Auto-pay** each month while renting
- **Warning** when stones only cover a few more months of upkeep (soft heads-up, not a hard pause)

### World calendar (parked idea — not Phase 2 must)

Owner note: a **world date / calendar line** at the top of the screen could feel good later (era + year/month). May merge with or sit beside the clock bar / lifespan chip. Spec before build.

---

## Prerequisites

- [x] Owner Phase 1 locks
- [x] Phase 1 ship (ticker + UI + advanceTime gate) — PR #85
- [ ] Phase 2 monthly digests + rent warn + action stance/project start
- [ ] Phase 3 QC cultivate stance on clock

## Open questions

- Merge lifespan chip with clock bar later?
- When to open Fast year-scale for immortals only?
- World date format (era name vs plain year/month)?
- How many months of rent runway triggers the warning (recommend: ≤3)?

## Implementation crumbs

`world-clock.js`, `time-playback.js` (`advanceTimeQuiet`), `core.js` (`advanceTime`), `index.html` clock bar, `main.js` / `ui.js`
