# Combat reaction sandbox (experimental prototype)

| Field | Value |
|-------|-------|
| **Status** | `shipped` (dev-only prototype) |
| **Code** | [`prototype/combat-sandbox/`](../../prototype/combat-sandbox/) |
| **Tests** | `node scripts/test-combat-sandbox.js` |
| **Updated** | 2026-11-04 |

## Purpose

Playtest whether **player-chosen techniques, movement, timing, commitment, and reactions** can produce engaging exchanges — without replacing turn-based production combat or touching save data.

## Mechanics (summary)

- **Time:** fixed `dt = 0.05s`; deterministic with seeded AI RNG.
- **Space:** continuous 2D positions; grid overlay is visual only.
- **Attacks:** Quick / Heavy / Thrust with prep → exec (impact) → recovery.
- **Reactions:** Evade, Block, Parry, Counter — each consumes time after **detection + reaction latency**.
- **Detection:** simple telegraph when opponent enters attack prep; undetected strikes do not offer reaction UI.
- **Impossible defense:** UI may offer a reaction even when physics cannot complete it; log explains *detected but too slow* vs *failed attempt* vs *success*.

## Mobile playtest (v1)

- Route: **`/sandbox/combat/`** — touch targets, tap move / tap opponent to close, pinch/+− zoom.
- Arena stays visible above action dock; tuning and log live in `<details>` panels.
- Auto-pause on reaction decisions (default on).
- Linked from main app playtest dev tools; no character creation required.
- Bundle committed at `sandbox/combat/combat-sandbox-bundle.js` for Netlify/static preview.

## Limitations (v1)

- No spirit implements, domains, anatomy targeting, or equipment.
- AI is heuristic, not production NPC combat.
- Parry/counter windows are tuned for feel, not final balance.
- Re-run `node scripts/bundle-combat-sandbox-lab.js` after sim edits.

## Integration considerations (if promoted later)

| Topic | Prototype | Production today |
|-------|-----------|------------------|
| Time model | Real-time continuous | Discrete turns + resource pools |
| Hit resolution | Geometry + phases | `calcCombatTechniqueDamage` + optional `combat-spine` stress |
| Stats | Sandbox params only | `G` stats, gear, chambers |
| Migration cost | High — needs client mode or parallel encounter type | Keep sandbox until parity spec exists |

**Rule:** Do not import sandbox constants into `data.js` or `combat.js` without an explicit design pass and owner approval.

## Follow-up experiments

- Link sandbox params to first-realm audit personas (qualitative only).
- Blind opponent telegraph variants (test perception rules).
- Record/replay input tapes for playtest sessions.
