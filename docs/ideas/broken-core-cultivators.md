# Broken Core cultivators

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | FE → Golden Core tribulation outcomes designed; NPC ecosystem at high realm |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent planning chat, 2026-07-18 |
| **Updated** | 2026-07-18 |

## Intent

Some cultivators **survive** Initial Core Formation tribulation but are left with a **terribly damaged golden core** — alive, sometimes still formidable, but with **no path to advance**. World flavour and rare NPC presence, not a main player loop.

For a **player** who lands in this state: little reason to keep climbing; optional endgame of **lasting world impact** (sect, legacy, story flags) then **reincarnate**. Mostly interesting as ambient tragedy in the setting.

## Design notes

### Pseudo-realm (player) — keep thin (owner 2026-07-22)

Limbo between FE and Golden Core is **not** a playable chapter. Tribulation hits **immediately** on Initial Core Formation (see `tribulation-per-realm-limbo.md`, `tribulation-system-rework.md`). Players do not **stay** in limbo — they pass, fail, or rarely exit **broken**.

**Broken Core** = the rarity: survived where they should not; door half-open; capped advancement. Primarily NPC tragedy; player edge case optional later.

### Broken Core outcome (sketch)

Distinct from **clean fail** (core shatters, regression) and **clean pass** (heaven accepts → Golden Core).

| Outcome | Fiction | Advancement |
|---------|---------|-------------|
| Pass | Core holds; heaven accepts | Golden Core realm |
| Fail (hard) | Core shatters | Regression / cracks / retry path |
| **Broken Core** | Survived tribulation; core formed but **fractured / incomplete** | **Capped** — no Nascent Soul path; maybe local power still high |

### NPCs (primary use)

- **Very rare** at Golden Core tier and above — wanderers, ruined elders, sect failures.
- Dialogue: bitterness, warnings, odd techniques born of desperation, rumours of fixes that don't work.
- Could appear in Heartlands markets, forbidden grounds, story arcs — not a faction hub.

### Player (edge case — optional, later)

- Might require specific tribulation choices / low foundation / “barely survived” branch.
- Gameplay: legacy actions, disciple shaping, world flags, **no realm progress** → reincarnation as sensible exit.
- Not a priority for v1; NPC flavour first.

## Prerequisites

- [ ] Tribulation outcome taxonomy (pass / fail / broken) for FE→GC
- [ ] Decide if player can ever become Broken Core or NPC-only
- [ ] Rare NPC spawn / story hooks at high realm

## Open questions

- Broken Core still counts as “Golden Core” for combat scaling, or weaker pseudo-tier?
- Can pills/forbidden grounds **theoretically** repair a broken core (quest bait) or truly no path?
- Alignment with existing `foundationCracks` / tribulation scars?
- Body/soul analogues (shattered vessel, fractured soul)?
- How do others **know** you're broken vs true Golden Core? → `spiritual-sense-cultivation-reading.md`

## Implementation crumbs

- `tribulation.js` — outcome branches, scar / failure handling
- `foundation.js` — cracks, grade caps
- `npcs` / `ambient-npcs.js` — rare high-realm roles
- `legacy.js` — reincarnation as exit for capped runs
