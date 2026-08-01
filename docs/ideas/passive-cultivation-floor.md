# Passive cultivation floor & focused sessions

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | playtest tune (inferior bare → Peak QC calendar) |
| **Issue** | none yet |
| **Chat / PR** | design chat 2026-08-01 · `cursor/passive-cultivation-e198` |
| **Updated** | 2026-08-01 |

## Intent

Cultivation is **ambient** (night circulation) plus **intentional** (focused sessions). Root defines the **floor** without aids — manuals, formations, dwelling, pills **buy calendar back**. No single canonical breakthrough age.

## Design notes (owner lock 2026-08-01)

### Two layers

| Layer | Fiction | Mechanism |
|-------|---------|-----------|
| **Passive** | Cycles before bed each night | Auto each calendar week while alive |
| **Focused** | Close the door; trance / chamber | Qi Chamber gather, quarters cultivate, `actionFocusedCultivate` (1 mo project) |

### Floor (inferior, bare breath, no aids)

- Passive-only may **not** finish QC before mortal lifespan without world systems.
- Tuning anchor: ~**70 years** passive-only inferior to Peak QC gather progress (not a guarantee — a floor threat).
- **Engaged play** (manual + dwelling + focused sessions + pills/formations) pulls toward a playable window — tune via reference loadout, not fixed age tables.

### No technique at start

New characters begin **bare qi circulation** (`primaryId: null`). First manual from Redwell / explore sets `bareCirculation: false`.

### Removed

- Cultivate **stance toggle** (weeks of hands-on marginal drip). Explore stance unchanged.

### Aid stack (passive + focused)

- Spirit root (`getTalentGatherMult`)
- Formal manual (`getCultivationMethodGatherMult`)
- Dwelling (homeless / rent / owned)
- Residence formations (`getResidenceFormationCultivateMult`)
- Sect / faction mults (focused full session side effects)

## Prerequisites

- [x] Owner design lock
- [x] `passive-cultivation.js` + world-clock weekly hook
- [x] Bare circulation on new game
- [ ] Playtest inferior bare vs pamphlet + focused pace
- [ ] Pill timed gather buffs (qc-cultivate-excitement Phase 3) wire to focused mult

## Open questions

- Exact passive/focused constants after Redwell playtest
- Interrupts during focused sessions (grudge / bandit) — sister `qc-cultivate-excitement.md`

## Implementation crumbs

- `passive-cultivation.js` — balance, ticks, focused session
- `world-clock.js` — weekly passive; `focused_cultivate` project
- `core.js` — `tickPassiveCultivationForMonths` on paused `advanceTime`
- `cultivation-methods.js` — bare state, `setCultivationMethodPrimary` clears bare
- `chamber.js` — `getChamberGatherProgressUnits`
