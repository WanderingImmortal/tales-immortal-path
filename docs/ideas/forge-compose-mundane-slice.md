# Forge compose — Mundane tier slice

| Field | Value |
|-------|-------|
| **Status** | `building` |
| **Blocked on** | Playtest feedback on bands / UX |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent — compose Mundane forge |
| **Updated** | 2026-10-06 |

## Intent

Replace fixed tier-1 forge recipes with **pattern + core material + optional aux materials → one gear instance**. Prove the loop at **Mundane** (tier 1 / Qi Condensation) before higher tiers. Weapon damage uses **flat** values on instances; legacy `%` gear still works on old items.

## Tier label ladder (gear)

Mundane → Tempered → Treasure → Spiritual → Celestial → Silent → Dao → Law → Immortal (tiers 8–9 formal copy: armaments). This slice implements **Mundane** only.

## Compose rules (v1)

- **Patterns:** sword, chest, helm, boots, fist wraps (leather core on fist only).
- **Core families:** metal (iron), hide (leather), wood (heartwood splint), crystal (spirit crystal).
- **Aux:** optional, up to 2 — bonuses stack; **core-only** forge applies ~72% to martial stats (same feel as forging without “flesh around the spine”).
- **Grade:** rolled on forge (simple weights toward Common).
- **Merchants:** sell materials, not pre-made Mundane gear (T2 gear on Jade merchant unchanged for now).
- **Starters:** mortal-grade sword + robe (below Mundane crafted power).

## Proof checks

- [ ] Different core/aux → different inspect stats
- [ ] Grade varies on forge
- [ ] Flat damage visible in combat vs mortal starter sword
- [ ] Core-only weaker than core + aux
- [ ] Saves load composed instances

## Implementation

- `forge-compose-data.js` — patterns, cores, aux, weights
- `forge-compose.js` — resolve, craft, preview
- `forge-chamber.js` — Mundane compose tab
- `gear.js` / `combat.js` — flat damage, effective slot/def for composed gear
