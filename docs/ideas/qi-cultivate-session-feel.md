# Qi cultivate — the sit you can see

| Field | Value |
|-------|-------|
| **Status** | `idea` (proposal — not an owner lock) |
| **Blocked on** | Owner read against existing locks in [`passive-cultivation-floor.md`](passive-cultivation-floor.md) and [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) |
| **Issue** | none yet |
| **Chat / PR** | Cloud design chat, 2026-09-27 |
| **Updated** | 2026-09-27 |

## Intent

Qi-path cultivation should feel like a person practicing a method in a place, over lived time. Qi, density, and band progress are what that practice leaves behind. The player can watch the sit or walk away; the yield is the same either way.

This does **not** replace the passive floor or the focused-session budget. It replaces the presentation: a Gather Qi click, or a month-long project that ends in one log line, both read as a faucet.

## Design notes

### What the player does today

- **Cultivate** opens the hub, then the Qi chamber.
- **Gather Qi** advances about a week and adds density, dantian fill, and QC band progress. The orb pulses once. The log is `+density`.
- **Focused cultivation** (the old Cultivate action) is a living-clock project of about a month. It finishes as one lump via `runFocusedCultivateSession`.
- **Night circulation** ticks in the background. A rare log says qi stirred.

The numbers move. The character does not. The manual is a caption (`Path: Burning Breath (×1.40 gather)`), not the thing being practiced. The room, the last fight, and the root are multipliers hidden in that number.

### Thesis

**You sit. The method moves through the body. The place and the body change how that breath looks. The world can break the door. When you stand, the store is deeper, and you saw why.**

Watching is not a minigame and not a bonus. Looking away lets the same clock project finish in the background at the same rate.

### The session

Focused cultivation and QC Gather Qi become one act: **close the door and circulate**.

- Start: the character settles. First breaths are clumsy. The opening line is the settling, not a stat grant.
- While the overlay is open, the existing month (or chamber week) is drawn as **breath cycles** on the living clock. The dantian fills in sips, using today's yield math (`getFocusedGatherUnits`, `getChamberGatherProgressUnits`, `runCultivateSession`). No extra qi for staying, clicking, or timing a breath.
- Leave the overlay: the `focused_cultivate` project continues. Come back and the sit is still in progress, further along.
- End: one line about **state**, with the number as a quiet suffix. Example: the store sits heavier than last month. Early is behind you. `+0.22 density` can follow; it is not the headline.

### What you see

Reuse the chamber stage and the body silhouette. The lower dantian is the shared landmark (see [`body-chamber-anatomy-rebuild.md`](body-chamber-anatomy-rebuild.md)).

| Condition | Picture |
|-----------|---------|
| **Bare breath** | Short, leaky, uneven threads. Cycles stutter. |
| **Named method** | A repeating path you can recognize. Burning Breath climbs and settles hot. Flowing Tide is a slow circuit. The path is the manual, not a tint on a generic orb. |
| **Manual grade** | Cleaner, longer, more even circulation. Grade stays a speed/efficiency axis; the player sees the cleanliness, not only `×1.4`. |
| **Root mismatch** | The path wants a hotter or heavier breath than the root feeds. A visible stall. Legal, leaky — same fiction as `rootFit`. |
| **Empty dantian** (after a fight) | First cycles are thin until the store recovers. Combat already tells the player to gather; the sit shows that recovery. |
| **Place** | Inn: thin ambient, door noise. Courtyard with a formation: rings around the sitter. Wilderness: open sky. Sect hall: a quiet shared rhythm, not a social sim. |
| **QC band** | Early reads as a spark, Mid as a reservoir, Late as a basin. Crossing a band changes the figure, not only the meter caption. |

Night circulation is the **same picture, dimmed** — on the clock or the character — so "cultivating" is a life state. Opening the chamber at night shows the thin cycle, not a dead orb waiting for a button.

### Snags

A snag is a thin breath with a named cause. It is not a choice menu.

Causes already exist as multipliers and gates: no manual, poor dwelling, no formation, root mismatch, qi exhausted, meridian not open yet. The session says which one bit this cycle. You sit through it (that breath counted less) or you change the condition in the world: rest, pill, room, formation, manual. No Steady / Force / Aided picker — that lock in [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) stays.

### Interrupts

Drama is the knock, not meditation flavor. Grudge and exposed-dwelling bandit (same doc) **cut the breath** on screen, then the scene. Resume is mid-practice, one disturbed cycle, then the rhythm returns. Assassin stays parked.

### What stays a separate deed

Expand dantian, refine foundation, and condense core are not the daily loop. At QC, capacity still grows from band settles; Gather is the only ongoing act, and that act is the sit. When a later realm has a real deed (widen the vessel, burn a technique in, compress a core), it is a short scene of that deed, not another faucet. FE's gather step in [`qi-foundation-establishment-redesign.md`](qi-foundation-establishment-redesign.md) ("eventually via active breathing/cultivation technique") is this same sit, continued — not a second system.

### Explicitly out

- Rhythm or timing minigame. Player skill would replace root, manual, and place.
- Posture or intensity picker.
- Extra yield for clicking during the session.
- Flavor-text roulette that does not change the picture.
- A new yield curve. Passive floor and focused budget stay until a playtest asks to retune them.

### Relation to existing locks

| Lock | This proposal |
|------|----------------|
| Passive nights + focused sessions ([`passive-cultivation-floor.md`](passive-cultivation-floor.md)) | Kept. This is how the focused sit (and the dim night) **look**. |
| No postures ([`qc-cultivate-excitement.md`](qc-cultivate-excitement.md)) | Kept. Variety is method, place, body, and interrupts. |
| Simple toggle / removed stance drip | The clock project remains the time model. The toggle stops being the whole fantasy. |
| QC is gather-and-store, not mist→liquid ([`qi-condensation-depth.md`](qi-condensation-depth.md)) | Kept. The picture is a store deepening, not condensation. |
| One primary method ([`technique-driven-cultivation.md`](technique-driven-cultivation.md)) | The method becomes the circulation you watch. |

## Second pass — the feel layer is not enough on its own

Review of everything above, 2026-09-27. The presentation holds up; on its own it does not answer the worry that started this ("a button gets spammed; anti-spam feels restrictive for no in-game reason; pure passive is not something you are *doing*").

### Where the spam worry actually sits

Time is **already** the anti-spam. Every Gather Qi burns a week of a finite lifespan, and the yield is time-bound. Clicking fast buys nothing.

It feels spammy because it is the **dominant** move. Nothing in the sit ever says *stop, the answer is outside this room*. So the fix is not a cooldown and not an animation. It is that cultivation should **run out of road** on its own and point at the world.

### Honest limits of the session view

| Claim above | Problem |
|-------------|---------|
| "The sit is the fantasy" | A prettier bar is still a bar. The player gets one round of delight, then stops looking, and it is a toggle again — with the art budget spent. |
| "Snags name their cause" | You *read* a label after deciding to sit. The decision already happened. |
| "No yield change in v1" | Correct as a safety rail, but it leaves the loop with **zero decisions**. Postures are locked out (rightly), and nothing replaced them. |
| Breath-picture matrix (bare / grade / mismatch / place / band) | Too much art up front. Ship method color, cycle length, one stall. Drop sect-hall ambience. |

### Three mechanics that give the loop decisions — no posture picker, no new yield curve

**1. Bottlenecks with a named key.** Approaching a band edge, progress decays to a crawl and the game says what is missing: a denser place, a pill, a better manual, a teaching, an unopened meridian. You can always grind through slowly (root stays the floor — no hard wall), but the efficient move is to **leave the room for a reason the fiction supplies**. This is the diegetic anti-spam. It is also exactly the existing lock "aids buy calendar back" made visible, and it finally gives pills the job [`qc-cultivate-excitement.md`](qc-cultivate-excitement.md) wants them to have. Xianxia progress is punctuated — stuck, seek, break — and today's bands arrive automatically instead.

**2. Give seclusion its stakes back.** `seclusion-project.js` already has a year picker, time playback, and a highlight reel. But it runs `runCultivateSession({ extraMult: 0.22 })` — **long seclusion is currently the worst way to cultivate**, which is backwards for the genre. Sitting thirty years should be the strongest *and* the scariest: you emerge to a world that moved. Debts came due, a rival ranked up, the sect exam passed, the herb wilted, someone died. The machinery exists; it needs real world consequences instead of eight canned flavor lines. This is the single biggest feel win available and it is mostly wiring existing systems together.

**3. Preparation is where the choice lives.** Before the sit: where (inn, courtyard with a formation, spirit site), with what (pill, stones), following what (manual), in what condition (injured, empty dantian). Show the forecast, then play the sit. The decision happens **before**, where the money is — so the no-posture lock stays intact and cultivation plugs into the Redwell economy and the unbuilt [`cultivation-sites-and-claims.md`](cultivation-sites-and-claims.md).

### One act, one dial

Resolves the open question below. Cultivation is a single verb with a length the player sets:

| Length | Fiction | Existing hook |
|--------|---------|---------------|
| A week | Top up the dantian before a fight | chamber Gather Qi |
| Months | Close the door and work | `focused_cultivate` project |
| Years | Seclusion — the gamble | `seclusion-project.js` |

Same scene, same math, three scales of risk. Combat already tells the player to gather; that is the short one earning its place.

### Suggested order (inverts the slice list below)

1. Bottlenecks — cheapest, changes behavior, supplies the in-game reason to stop.
2. Seclusion stakes — reuses built machinery, biggest drama return.
3. Session view — now worth the art, because there is something to watch *about*.

### Deliberately not proposed

**Qi deviation / backlash.** There is no deviation mechanic in the repo today and the locks lean against inventing punishment. If the owner wants risk, the only place it belongs is **forcing** a bottleneck — an opt-in gamble, never the default sit.

## Prerequisites

- [ ] Owner: accept or reject this as the feel layer on top of passive + focused (no yield change in v1)
- [ ] Owner: accept or reject the second-pass mechanics (bottlenecks, seclusion stakes, preparation forecast)
- [ ] Living clock focused project still the time spine
- [ ] Chamber stage + body silhouette available to share a seated pose and dantian landmark

## Open questions

- ~~Does "sit" replace the Gather Qi button at QC, or stay a separate chamber week?~~ Answered in the second pass: one act, one length dial (week / months / years).
- If seclusion becomes the strongest cultivation, what stops it from eating the game? Likely answer: bottlenecks — you cannot sit past a wall you have no key for.
- How literal should the breath path be before it becomes unreadable on a phone? Start with method color, cycle length, and leak/stall — not a labeled meridian diagram.
- Sect hall "others cultivating" — ambient only, or skip until sect life can support it?

## Implementation crumbs

- `chamber.js` — `chamberGatherQi`, `renderChamberUI`, `triggerChamberAnim`; chamber core is already a fill/glow meter
- `passive-cultivation.js` — `actionFocusedCultivate`, `runFocusedCultivateSession`, `getChamberGatherProgressUnits`
- `world-clock.js` — `focused_cultivate` project
- `index.html` / `style.css` — `#qiChamberOverlay`, `.chamber-core`, body silhouette in the body chamber
- `cultivation-methods.js` — primary method, bare circulation, gather mult
- QC band meter — `qc-depth.js` `renderChamberQcBandMeter`
- `seclusion-project.js` — year picker, `startTimePlayback`, highlight reel, `applySeclusionYearGains` (the ×0.22 to revisit)

### Smallest slice if built later

1. Session view on focused cultivate at QC: seated figure, method-colored breath, fill across the month, **same numbers**.
2. Gather Qi becomes "sit" (starts that scene for a chamber week).
3. One named snag: empty dantian or bare vs manual.
4. End line leads with state.
5. Later: room dressing, interrupt cuts the breath, band changes the figure, night circulation is the dim version on the clock.
