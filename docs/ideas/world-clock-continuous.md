# Living world clock (continuous calendar)

| Field | Value |
|-------|-------|
| **Status** | `building` (Phase 2 on PR #86) |
| **Blocked on** | none |
| **Issue** | none yet |
| **Chat / PR** | [PR #86](https://github.com/WanderingImmortal/tales-immortal-path/pull/86) · `cursor/world-clock-phase-2` |
| **Updated** | 2026-07-27 |

Sister: [`chronicle-and-projects.md`](chronicle-and-projects.md) (bounded seclusion playback). QC cultivate polish / Practice Session = Phase 3.

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

Top-right clock bar: Play/Pause · Slow/Normal/Fast · activity · age `Yy Mm` (left of cultivator silhouette)

### Perf

One `advanceTimeQuiet` per week flush (batched delta) — not per-day × NPC loops.

---

## Phase 2 locks (owner 2026-07-27) — shipping

### Monthly digests

One quiet diary line per month while live (`⏳ A month passes…`).

### Action taxonomy

| Kind | Feel | Examples |
|------|------|----------|
| **Stance / toggle** | On while clock runs; fractional yield each week | Cultivate (gather qi); Explore (forage) |
| **Timed project** | Start → busy N months → done; locks you | Threshold jobs; travel |
| **Instant / moment** | No calendar cost | Market buy, pill, converse, trade, Look around |
| **Transit** | Locked on the road until arrival | Map travel |
| **Seek → event** | Short wait → encounter → clock pauses | Fight — **1 week** seek |

### Rent / upkeep

- Auto-pay each month while renting
- Warning when stones cover **≤3 months** of upkeep

### World calendar (parked)

Top-of-screen world date — later.

---

## Prerequisites

- [x] Owner Phase 1 locks
- [x] Phase 1 ship (ticker + UI + advanceTime gate) — PR #85
- [x] Phase 2 monthly digests + rent warn + stance/project/instant/transit (this pass)
- [ ] Phase 3 QC cultivate polish — see [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) (no postures; pill buffs; reasoned interrupts)

## Open questions

- Merge lifespan chip with clock bar later?
- When to open Fast year-scale for immortals only?
- World date format (era name vs plain year/month)?
- Explore deeper redesign — parked
- Fight system redesign — parked (interim: 1 week seek)
- Road bandits / travel random events — parked (may share DNA with cultivate interrupts)

Sister Phase 3: [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md)