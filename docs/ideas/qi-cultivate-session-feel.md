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

## Prerequisites

- [ ] Owner: accept or reject this as the feel layer on top of passive + focused (no yield change in v1)
- [ ] Living clock focused project still the time spine
- [ ] Chamber stage + body silhouette available to share a seated pose and dantian landmark

## Open questions

- Does "sit" replace the Gather Qi button entirely at QC, or does Gather Qi remain a short week-sized sit inside the chamber while the month-long close-the-door stays the quarters action? Proposal: one act, two durations (a week in the chamber, a month closed-door), same scene.
- How literal should the breath path be before it becomes unreadable on a phone? Start with method color, cycle length, and leak/stall — not a labeled meridian diagram.
- Sect hall "others cultivating" — ambient only, or skip until sect life can support it?

## Implementation crumbs

- `chamber.js` — `chamberGatherQi`, `renderChamberUI`, `triggerChamberAnim`; chamber core is already a fill/glow meter
- `passive-cultivation.js` — `actionFocusedCultivate`, `runFocusedCultivateSession`, `getChamberGatherProgressUnits`
- `world-clock.js` — `focused_cultivate` project
- `index.html` / `style.css` — `#qiChamberOverlay`, `.chamber-core`, body silhouette in the body chamber
- `cultivation-methods.js` — primary method, bare circulation, gather mult
- QC band meter — `qc-depth.js` `renderChamberQcBandMeter`

### Smallest slice if built later

1. Session view on focused cultivate at QC: seated figure, method-colored breath, fill across the month, **same numbers**.
2. Gather Qi becomes "sit" (starts that scene for a chamber week).
3. One named snag: empty dantian or bare vs manual.
4. End line leads with state.
5. Later: room dressing, interrupt cuts the breath, band changes the figure, night circulation is the dim version on the clock.
