# Time and NPC state consistency

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | none |
| **Issue** | none yet |
| **Chat / PR** | [PR #199](https://github.com/WanderingImmortal/tales-immortal-path/pull/199) · `cursor/time-npc-consistency` |
| **Updated** | 2026-11-04 |

## Intent

One world clock, one NPC life record. Ordinary time — play, a billed action, or seclusion — should move the same shared world. What the player is doing still changes their own cultivation. This pass does not add routines, recruitment, or sect ecology.

## Audit — how time actually advances

There is one simulation clock: `G.ageMonths`, advanced by `processWorldTime` in `world-scheduler.js`. Playback speed (world-clock weeks, seclusion year animation) only decides how often that function is called.

| Entry | What runs |
|-------|-----------|
| `advanceTime` / `advanceTimeQuiet` | Both use shared elapsed-time accounting for world ticks, alchemy decay, rent, Well-Ring obligations, and passive circulation. Paid actions apply action-time modifiers. Quiet calls request exact calendar spans. |
| `flushWorldClockWeek` | Requests a quiet quarter-month, capped by the active project deadline. The Explore stance pays only after an uninterrupted week. |
| Dedicated cultivation | Skips passive circulation for its own elapsed span. Completed focused sessions use the existing payout. |
| Long seclusion | Requests quiet calendar time with passive circulation suppressed. Each complete, uninterrupted year earns the existing annual session. A partial year records elapsed time without an annual payout. |

The scheduler breaks spans on world events, rent dates, Well-Ring month boundaries, and lifespan. Player activity and project deadlines also bound advances. Ordinary scheduled events continue in chronological order. Combat, encounter choices, tribulations, mandatory choices, and succession stop new work at the boundary where they become active.

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

- Ordinary elapsed time accumulates fractional passive weeks across advances and saves.
- Dedicated cultivation and breakthrough seclusion skip passive and apply their own session.
- Long seclusion applies `applySeclusionYearGains` once per year.
- Working, resting, and secluded years are not the same player outcome. They do share world ticks and upkeep.

## Limitations

- NPC breakthroughs are still one random roll per filled progress bar. Matching the month total does not match every roll.
- The Well-Ring tournament is one `tournamentDue` flag, not a queue of missed years.
- `tickDwellingRent` treats a stored `rentPaidThroughMonth` of `0` as "start from now" (`0` is falsy). Starting a rental sets the mark to the current month + 1.
- Timed projects settle on their existing clock deadline. An incompatible paid action is blocked while a project or cultivation activity owns that time.
- NPC background cultivation intentionally continues during trips, study, and missions. Sect missions exclude Manual Hall study and incompatible travel, but the Manual Hall has no presence or travel-time requirement of its own. A later NPC scheduler can separate future dedicated training from background progression and handle existing assignments explicitly.
- Unscheduled stochastic ticks can still sample differently when spans are split differently. Scheduled events use their stored dates.
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
node scripts/test-time-interruptions.js
node scripts/test-org-foundations.js
node scripts/audit-world-sim.js
```
