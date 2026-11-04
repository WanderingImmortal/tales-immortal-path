# Time and NPC state consistency

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | none |
| **Issue** | none yet |
| **Chat / PR** | `cursor/time-npc-consistency` |
| **Updated** | 2026-11-04 |

## Intent

One world clock, one NPC life record. Ordinary time — play, a billed action, or seclusion — should move the same shared world. What the player is doing still changes their own cultivation. This pass does not add routines, recruitment, or sect ecology.

## Audit — how time actually advances

There is one simulation clock: `G.ageMonths`, advanced by `processWorldTime` in `world-scheduler.js`. Playback speed (world-clock weeks, seclusion year animation) only decides how often that function is called.

| Entry | What runs |
|-------|-----------|
| `advanceTime` | Player actions. `processWorldTime`, alchemy supply decay, `applySharedCalendarObligations` (rent, Well-Ring board), then passive circulation unless `skipPassiveCirculation`. |
| `advanceTimeQuiet` | World-clock weeks and long seclusion years. Same world ticks, alchemy decay, and shared obligations. No passive circulation. |
| `flushWorldClockWeek` | Calls `advanceTimeQuiet(0.25)`, then the stance week: passive cultivation, explore stance, project completion. |
| Dedicated cultivation, chamber, breakthrough seclusion | `advanceTime` with `skipPassiveCirculation`, plus that activity's own session. |
| Long seclusion | One quiet year at a time, then `applySeclusionYearGains`. Pause, speed, and early exit stay on the playback timer. |

`processWorldTime` walks `[from, to]` in segments that stop at the next `G.worldSchedule` event. For each segment it sets `G.ageMonths` to the segment end, runs `WORLD_TICKS`, then fires events due at that instant.

Registered ticks, in order: scar healing, alignment, `tickNpcWorld` (stub), quests, ambient NPCs and relationships, `tickWorldNpcGrowth`, player-sect systems, faction quest deadlines, faction systems.

Already consistent before this pass:

- NPC age and growth inside a long skip stop at lifespan (`tickWorldNpcGrowth`).
- Scheduled events fire once, after ticks for the span that ends on their date.
- Alchemy supply decay already ran on both loud and quiet advances.
- `advanceLesserSectsTimeOnly` is not on the scheduler. Calling it from a tick would age roster snapshots separately from `G.worldNpcs`.
- Ambient NPCs are skipped by growth. Breakthrough rolls stay random; one long roll loop is not guaranteed to match many short rolls even when the months match.

## Audit — who owns NPC state

Three organisation records stay separate:

| Record | Mutable life | This pass |
|--------|----------------|-----------|
| `G.worldNpcs` | Age, realm, alive, zone | Authoritative for anyone registered there |
| `G.world.lesserSects[].members` | Identity: uid, name, role, founding snapshot | Not rewritten when the NPC changes |
| `G.sect` world rivals | `power`, `renown`, `stage`, `relationship` | Still `tickWorldSectGrowth`. No member roster |
| `FACTION_DEFINITIONS` | Authored great powers | Not generated as lesser sects |

Lesser-sect generation copies each member into `G.worldNpcs` once, keyed by `uid` and `lesserSectId`. After that, `tickWorldNpcGrowth` was updating the NPC while `sect.members` and the cached `organization` profile kept the founding realm. Dead members still counted in apex and combat band (`countSuccessionDepth` already ignored them).

Affiliation changes are not a live system. Lesser-sect NPCs are registered with `wanderDueMonths: null`, so the wander tick does not move them. Zone on the NPC is what capability reads if something else changes it later.

## Fixes

- Capability, maturity headcount, and the public map brief resolve realm, age, zone, and alive from `G.worldNpcs` by uid (`resolveOrganizationMembers`). The roster snapshot is left alone. Dead members do not add living combat capability.
- `processWorldTime` sets `G.ageMonths` before ticks, so construction completion and faction deadlines see the segment end inside a large advance.
- Player-rival growth applies one step per 12-month interval crossed (`catchUpIntervalMarks`), so a 10-year jump matches ten yearly steps. This is catch-up of the existing tick, not new sect ecology.
- Rent and the Well-Ring board run from both `advanceTime` and `advanceTimeQuiet`. The board steps once per floored month (`calendarMonthSteps`), including across a multi-month jump, and does not step again on every clock week inside the same month.

## Still different on purpose

- Clock weeks grant passive cultivation. Quiet playback does not.
- Dedicated cultivation and breakthrough seclusion skip passive and apply their own session.
- Long seclusion applies `applySeclusionYearGains` once per year.
- Working, resting, and secluded years are not the same player outcome. They do share world ticks and upkeep.

## Limitations

- NPC breakthroughs are still one random roll per filled progress bar. Matching the month total does not match every roll.
- The Well-Ring tournament is one `tournamentDue` flag, not a queue of missed years.
- `tickDwellingRent` treats a stored `rentPaidThroughMonth` of `0` as "start from now" (`0` is falsy). Starting a rental sets the mark to the current month + 1.
- No recruitment, succession, or autonomous lesser-sect growth. A dead leader stays the named leader and contributes no living power; nobody is promoted.
- `G.worldClock.project` still completes on the week loop after `endsAtMonths`. It is not a scheduled world event, so a single `advanceTime` that jumps past the end does not run the project completion handler until the calendar week loop runs.
- The `organization` blob saved on a lesser sect can be stale. The map brief re-derives when `G.worldNpcs` is present.

## Future routine integration

Do not add a second clock. A routine should:

1. Bill months with `advanceTime` (a player-chosen action; pauses the living calendar) or `advanceTimeQuiet` (playback).
2. Let `processWorldTime` apply NPC growth, player-sect ticks, and scheduled events.
3. Let `applySharedCalendarObligations` apply rent and the lodge board.
4. Apply only that activity's reward on the caller (passive week, focused session, or seclusion year).
5. To pause playback when something must be decided, `scheduleWorldEvent(type, atMonth)` at the completion month. Handlers run at that date even inside a large jump. Use `G.worldClock.project` only for short jobs that already finish on the week loop.
6. Read lesser-sect strength with `deriveOrganizationProfile(sect, { worldNpcs: G.worldNpcs, worldAgeMonths: G.ageMonths })`. Do not copy realm back onto `sect.members`.

## Tests

```bash
node scripts/test-time-npc-consistency.js
node scripts/test-org-foundations.js
node scripts/audit-world-sim.js
```
