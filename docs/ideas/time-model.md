# Time model — lived journey + seclusion skips

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | Priority choice (deferred); lived mode needs enough location/NPC content density to feel like a journey |
| **Issue** | none yet |
| **Chat / PR** | `[L·WIP] Time model design` (local design chat, Jul 2026) |
| **Updated** | 2026-07-20 |

## Intent

Wandering Immortal is a **cultivation sim in a xianxia setting**. Time should support two complementary play modes on **one clock**, not fight them:

1. **Lived journey** — day-to-day exploration (walk a city, talk, market, poke side paths) so the game feels like traveling the jianghu.
2. **Seclusion / fast-forward** — closed-door cultivation or watching the world move over months–years, especially at higher realms when progress slows.

Players should be able to live interesting days *and* skip long spans without the whole game becoming either “talking costs a month” absurdity or a day-by-day slog through empty years.

## Design notes

### Current system (as of design chat)

- Canonical unit: **`G.ageMonths`** (`core.js` → `advanceTime(months, activity)`).
- All player actions and world ticks share that clock (`processWorldTime` in `world-scheduler.js`).
- Durations live mainly in **`ACTION_MONTHS`** (`data.js`) — comment: *forces meaningful choices, not button spam*.
- Chamber already uses **weeks → fractional months** (`chamber.js` / `CHAMBER_BALANCE.weeksPerMonth`); `formatDuration()` can show weeks for values &lt; 1 month.
- Pain point: social/local actions (e.g. `npcConverse: 1`, trade/rumor 2 mo) use the same “meaningful month” lever as cultivation, which breaks fiction.

### Philosophy (agreed direction)

These are **not opposing** systems. They are the same journey at two scales — how xianxia stories already work (scenes, then “three years later…”).

| Mode | Feel | Examples | Suggested scale |
|------|------|----------|-----------------|
| **Lived journey** | Dense, local | City wander, NPC chat, market, local walk | Days / weeks |
| **Errand / travel** | Short commitment | Zone travel, projects | Weeks / months |
| **Seclusion / skip** | Compress life | Closed-door cultivate, recuperate, “pass N years” | Months / years (player-picked at higher realms) |

**Design rule:** lived actions need **content density**; skip actions need **spectacle / world chronicle summary**.

### Preferred implementation path (minimal overhaul)

Do **not** switch the whole game to a day clock. Keep months as the engine unit; use day/week as display (and fractional months under the hood).

1. **Retune by action class**, not rewrite the clock — taxonomy + `ACTION_MONTHS` (and related costs), not a second calendar.
2. **Promote seclusion into an explicit time-skip verb** — e.g. closed-door cultivate for 1 month / 6 months / 1 year / 5 years / custom; power gain scaled by duration; world chronicle for the span. This is the higher-realm pacing valve.
3. **Optional later:** “Pass time” without cultivating (inn / sect wait) for pure world-watching when stuck.
4. **Optional later:** location time-batching (free/cheap actions while in town; one advance when leaving) if click-per-action still feels wrong.

Avoid:

- Global day-based clock (inflates every long action mentally).
- Making every micro-action free with no other anti-spam (use visit/session/cooldown — converse already charges once per session).
- Fully separate player-time vs world-time clocks unless free local actions need an “end of day” flush.

### Rough action-class targets (sketch, not final numbers)

| Category | Examples | Target feel |
|----------|----------|-------------|
| Micro / social | NPC converse, quick shop | 0–1 day, or free + session/visit gate |
| Local errand | City explore, local travel, pill/market | Days–~1 week |
| Commitment | Explore zone, cultivate block, dao work | Weeks–months |
| Epoch / skip | Breakthrough, physique, player seclusion | Months–years, often player-chosen |

### World / content dependency

Day-scale lived play only works if locations have enough to do (NPCs, rumors, jobs, ambient encounters, “while you were gone” beats after a skip). Time retune and world density should move together; empty maps + day costs just feel slower.

## Prerequisites

- [ ] Decide to prioritize time retune (currently deferred)
- [ ] Inventory current `ACTION_MONTHS` + hardcoded story months into action classes
- [ ] Confirm display convention (e.g. 4 weeks/month already; days per month TBD — often 30)
- [ ] Enough local location/NPC density for lived mode (parallel or prior content work)
- [ ] Seclusion duration UI + scaling rules for cultivate / optional idle wait
- [ ] Open a GitHub Issue for the first implementable chunk when ready (e.g. “retune social/local costs + duration display” before full seclusion picker)

## Open questions

- Exact days-per-month for display/math (30 vs chamber’s 4-week month only)?
- Should micro-actions advance the world in tiny ticks, or batch until leave-location / end-of-day?
- How does seclusion scale rewards vs fixed 6-month cultivate today — linear, diminishing, realm-gated max duration?
- Does “pass time” without cultivation exist at inns/sects, or only closed-door cultivate?
- Relationship decay / quest deadlines / sect construction — any special rules when many micro-actions use fractional months?

## Implementation crumbs

- `core.js` — `advanceTime`, `formatDuration`, `formatYears`, `G.ageMonths` / lifespan
- `data.js` — `ACTION_MONTHS`, `CHAMBER_BALANCE`, lifespan tables, world scheduler intervals
- `world-scheduler.js` — `processWorldTime` (world ticks on any advance)
- `chamber.js` — week ↔ month bridge (`advanceChamberWeeks`)
- `actions.js` / `cultivation.js` — secluded meditation, breakthrough durations
- `npc-converse.js` / `npc.js` — converse session time charge, trade/rumor costs
- `locations.js` / `world.js` — local vs zone travel costs
- `playtest-mode.js` — existing `fastTime` multiplier (related UX precedent)
- UI: action buttons already surface durations; action log uses `formatActionTimeMeta`
