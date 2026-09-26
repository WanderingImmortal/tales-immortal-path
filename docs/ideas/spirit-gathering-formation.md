# Spirit Gathering — first playtest pattern

| Field | Value |
|-------|-------|
| **Status** | `designed` (playtest card — not a new system) |
| **Blocked on** | none for courtyard test; chamber copy / hall stacking can wait |
| **Issue** | none yet |
| **Chat / PR** | 2026-09-26 formations audit — [PR #129](https://github.com/WanderingImmortal/tales-immortal-path/pull/129) |
| **Updated** | 2026-09-26 |

Engine: [`formations-and-arrays.md`](formations-and-arrays.md). This file is **one** blueprint filled in so the three axes (switch / fuel / integrity) can be felt. Do not add ranks, arrays, or other patterns until this card has been played.

---

## Intent

The novice gather diagram. You inscribe your courtyard so ambient qi runs thicker **here**. It is infrastructure, not a combat ward and not a second Cultivation Hall.

Playtest question: **does on / fuel / fade read as three different things**, and is +8% gather thick enough to notice over a season?

---

## What is already in the game

Live id: `spirit_gathering` in `FORMATIONS` (`data.js`). Wired through `formations.js`.

### Blueprint (code today)

| Field | Live value | In the grammar? |
|-------|------------|-----------------|
| Name / emoji | Spirit Gathering Formation / 🌀 | yes |
| Primary | *(missing)* — behaves as **Gather** | no |
| Primitives | *(missing)* | no |
| `formationTier` | **1** (QC band) | yes |
| `formationGrade` | *(missing)* — treat as **common** | no |
| Anchors | `residence`, `meditation_chamber` | yes |
| `minResidenceLevel` | 1 | yes |
| Lay | 2 mo · 3 spirit herb · 1 silk thread | yes |
| Fuel | 1 / month · cap 24 · lay with 6 | yes |
| On lay | **Active + fueled** (courtyard default) | yes |
| Effect | `cultivatePct: 8` while running | yes — see [What +8% hits](#what-8-hits-live) |
| Acquire | Unread manual at residence lv 1 (`starterUnreadOnResidenceLevel`) | yes |
| Decipher | 2 mo · 6 stones · +5 FI · may promote to Pattern Student | yes |
| Master gate | tier ≥ 1 to lay | yes |
| Sect gate | Must found a sect + have quarters to **lay**. Decipher does not need a sect. | yes |

Shared F1a (not unique to this pattern): 1 stone per fuel unit; integrity −1 / month laid; Sharp ≥ 70 (×1), Fading ≥ 35 (×0.55), Decayed (×0.2), Scattered (0); Maintain 1 mo · 4 stones · 1 herb → +35 integrity.

No Trace. Lay always succeeds. No grade, no first-lay fail, no hire, no command talisman.

### What +8% hits (live)

`cultivatePct` becomes `1 + pct/100`, then:

| Surface | Applies? | How |
|---------|----------|-----|
| Night circulation (passive) | **Yes** | `getPassiveCultivationSupportMult` × `getResidenceFormationCultivateMult()` |
| Focused cultivate / Cultivate at quarters | **Yes, and quarters double-counts** | Support already includes the residence %; quarters also passes it as `extraMult` |
| Qi chamber Gather | **Chamber copy only** | Chamber pattern rides `getSectCultivationMult()` — courtyard copy does **not** enter the chamber formula directly, but passive support still includes courtyard % for band progress helpers that use it |
| Cultivation Hall % | **Separate add** | Hall is `cultivationSpeedPct` (+10% / building level) inside `getSectCultivationMult`. Different knob, same “you cultivate faster” soup |
| Two copies (courtyard **and** chamber) | **Stacks** | 8% + 8% = 16% before integrity |

Foundation: **none**. That is Qi Stabilizer. Combat: **none**.

### Playtest read (live numbers)

| Dial | Feel |
|------|------|
| Fuel 1 / mo, cap 24, 1 stone / unit | ~1 stone a month to stay lit. Tank is two years. Cheap on purpose (novice gather). |
| Integrity −1 / mo from 100 | ~30 months to Fading (output → 4.4%). ~65 months to Decayed. ~100 months to scatter if you never Maintain. |
| Maintain +35 | One afternoon every couple of years if you care. |
| +8% Sharp | Modest. You will feel **starve / fade / switch** more than the 8% unless you watch a log or compare a season with it off. |

---

## Design notes (this pattern, locked for playtest)

### Identity

| Field | Lock |
|-------|------|
| **Primary** | Gather |
| **Primitives** | **Sink** (outer ring) · **Channel** (lines in) · **Pool** (courtyard eye) |
| **Tier / grade** | 1st / **common** |
| **Manual** | Intact unread starter. Elder-traced gift — still must Decipher. |
| **Job sentence** | *Qi is thicker in this courtyard while the pattern is lit and fed.* |

Not a ward. Not a foundation aid. Not a hall replacement.

### One site for the first test

**Playtest on the courtyard only.** Same blueprint may stay legal at the meditation chamber in data, but the test is: one slot, one pattern, three axes.

If you also lay it in the chamber during the test, treat that as a **known cheat** (two gathers stacking). After the courtyard test: **same blueprint at two anchors does not add** — best running copy wins, or courtyard = personal / chamber = when you sit in the chamber. Pick then. Do not pick during this test.

### What the bonus is

- **+8% gather support**, once, while Sharp + on + fueled.
- Integrity multiplies that 8% (Fading 4.4%, Decayed 1.6%, Scattered 0).
- Hits **night circulation** and **one** focused/quarters session — **never twice**.
- Does **not** add Foundation.
- Cultivation Hall % may still exist as building staff. UI should say **Running: Spirit Gathering +8%** vs **Hall +10%** as two lines, not one melted number. Hall is out of scope to retune here.

### Three axes (expected player reads)

| You do | You should think |
|--------|------------------|
| Shut down | Pattern still there; qi goes back to thin; fuel stops burning |
| Let fuel hit 0 with switch on | **Starved** — inert until you add stones. Lines still Sharp. |
| Ignore Maintain for ~2.5 years | **Fading** — still on, still burning fuel, blessing halved. Touch-up, not relight. |
| Ignore to 0 integrity | **Scattered** — Clear and Lay again. Fuel in the tank does not save you. |

If those four sentences are not obvious in the residence UI, the pattern is not done — do not add a second formation.

### Numbers (keep for first run)

Do not retune +8% / fuel / integrity on the same pass as the stacking fix. First question is **readability**, not balance.

If after a season you cannot tell it is on without reading the status row, *then* bump (e.g. 12–15%) or make the log say the running name more often. That is a second pass.

### Out of scope (do not sneak in)

Trace, exam, hire, chamber stacking rule implementation, hall replacement, essence gather, combat, grade variants, a second courtyard pattern.

---

## How to find it (especially phone)

Formations are **not** on the ⛩️ Courtyard hub. That room is disciples and sect affairs. The word “courtyard” in the pattern text means the **slots on your quarters page**.

**Inner Court Room** is not a second map pin. It is the **name of residence level 1** (after Makeshift Shelter). The map node is always **🏠 Leader's Quarters**.

On **main today**, the illustrated grounds map stacks pins on a phone — Quarters is easy to miss. Workaround: open 🏯 **Sect**, then hunt for the 🏠 pin **below** the courtyard pin (same column), or scroll the sheet and try again. Fix: [PR #130](https://github.com/WanderingImmortal/tales-immortal-path/pull/130) flattens the map to a list and adds a **Quarters** chip.

Path once you can tap it:

1. Found a sect → 🏯 Sect → **Leader's Quarters**
2. If the title says Makeshift Shelter, upgrade at the bottom of that page → **Inner Court Room**
3. Scroll: **Formation Shelf** (unread Spirit Gathering) then **Courtyard Formations** (slot 1)

## Playtest script

1. Found a sect, upgrade to Inner Court Room. Unread gather should appear on the shelf — not already known.
2. Decipher (2 mo, 6 stones). You become Pattern Student if you were 0.
3. Inscribe courtyard slot (2 mo, herbs + silk). It should come on, fuel ~6/24, Sharp, **Running**.
4. Night-cycle or Cultivate at quarters. Log should mention the formation **once**.
5. **Shut down.** Next cultivate / a week of nights: no +8%, fuel not falling.
6. Activate, burn or wait until fuel 0. Status **On · Starved**. No blessing. Add 6 mo fuel. Blessing returns without relaying.
7. Leave it Sharp and wait (or debug-set integrity to 60). Status **Fading**, blessing ~half. Maintain. Back toward Sharp.
8. Optional: debug-set integrity 0. Scattered. Clear + Lay. Do not expect fuel to resurrect it.

Pass: you can explain switch vs fuel vs integrity in one breath, and you never saw the +8% applied twice on one quarters session.

---

## Prerequisites

- [x] Engine F1a/F1b on main (fuel / switch / integrity / shelf)
- [ ] Quarters cultivate applies gather % **once** (live bug — fix when implementing this card)
- [ ] Playtest on courtyard only (owner)
- [ ] After test: chamber / hall stacking rule (best-wins vs personal vs chamber-only)

## Open questions

- [ ] Is +8% visible enough over a Dustbone season, or only the axes?
- [ ] After test: courtyard gather vs Cultivation Hall — keep both labeled, or hall becomes “staff + this pattern”?
- [ ] Chamber copy: same 8% when you sit there, or a slightly stronger hall-scale gather?

## Implementation crumbs

- `data.js` — `FORMATIONS.spirit_gathering` (add `primary`, `primitives`, `formationGrade` when coding)
- `formations.js` — `actionResidenceCultivate` `extraMult` double-count; `getResidenceFormationCultivateMult`
- `passive-cultivation.js` — night circulation already reads courtyard %
- `sect.js` — chamber % via `getSectCultivationMult` (ignore for first test)
- Residence UI — `renderResidenceFormationsHtml` / `formatFormationSlotStatusHtml`
