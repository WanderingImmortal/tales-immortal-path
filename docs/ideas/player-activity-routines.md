# Player activity routines

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | none |
| **Issue** | none yet |
| **Chat / PR** | `cursor/player-activity-routines` |
| **Updated** | 2026-11-05 |

## Intent

The player decides what to pursue. The living calendar carries out the repetition. A committed session or an authorised cultivation routine runs at Slow, Normal, or Fast, and stops when it completes, the player cancels it, or the conditions that made it valid are gone.

## Audit (what already existed)

- Time is `G.ageMonths`. `processWorldTime` (`world-scheduler.js`) is the only sim clock. `advanceTime` (`core.js`) and `advanceTimeQuiet` (`time-playback.js`) both go through it.
- The clock bar (`world-clock.js`) already has Play/Pause and Slow / Normal / Fast. Week length is 0.25 month. Speed only changes how fast weeks flush.
- Clock projects (`fight_seek`, travel, jobs, and the old `focused_cultivate` project) complete after a week flush. They do not recheck inside a large jump.
- Focused cultivation (`passive-cultivation.js`) is one session of `getFocusedCultivateMonths()` (1 month). With the clock paused it still jumps that month immediately. With the clock live it used to start a clock project and pay once at the end. Passive circulation on calendar weeks is unchanged.
- Rent and lodge catch up after a jump (`tickDwellingRent`, Well-Ring). They do not rewind age. A second pass in the same month does not bill again.
- Combat, tribulation, a pending perk, and seclusion playback already hard-freeze the clock. Ordinary chronicle events do not.

## What this branch adds

`G.playerActivity` is not a second clock. `advanceMonthsInActivitySlices` splits a span only when a running activity has a check sooner than the requested end. With nothing running, the span stays one slice.

- **Committed:** Focused cultivation, one session. Started from the cultivation hub (“Focus for 1 month”) or from the live-clock cultivate action. Pays once through `finishFocusedCultivateProject`, then pauses the calendar.
- **Routine:** “Keep cultivating” repeats that same session. It does not pick a new goal. It keeps going until cancel, block, or an attention interrupt.
- **Stops:** `completed`, `cancelled`, `interrupted` (combat, tribulation, a pending choice, seclusion playback), `blocked` (journey over, or a rented room lost before the next payout). Ordinary world events do not interrupt.
- Rent loss is checked after that slice’s obligations and before the payout. Earlier sessions in the same jump still pay. Rent math is untouched.
- The panel sits on the clock bar: name, target, progress, paused/running, Cancel.
- Saves store `G.playerActivity`. Load validates it and catch-up runs after the rest of load, capped at 48 due sessions, so a due session is not paid twice and a missing field on an old save stays idle.

## Deferred

- No calendar editor, no new speeds, no body-tempering or manual activities, no NPC routines, no encounter framework.
- Other clock projects (travel, jobs, seeking a fight) are unchanged. An old in-progress `focused_cultivate` clock project can still finish on the week loop; new starts use `G.playerActivity` instead, so the two are not started together.
- Passive circulation on calendar weeks stays as it was. This is not a cultivation rebalance.
- Catch-up on load pays at most 48 overdue sessions, then the next time advance continues the rest.

## Implementation crumbs

`player-activity.js`, `advanceTime` / `loadState` in `core.js`, `advanceTimeQuiet` in `time-playback.js`, clock busy label and panel hook in `world-clock.js`, live cultivate redirect in `passive-cultivation.js`, hub buttons in `index.html`. Tests: `scripts/test-player-activity.js`.
