# Upper celestial nine realms

| Field | Value |
|-------|-------|
| **Status** | `idea` |
| **Blocked on** | Mortal nine realms shipped; [`immortal-world-layer.md`](immortal-world-layer.md); [`chaos-cultivation-path.md`](chaos-cultivation-path.md) revelation |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chats, 2026-07-19–21 |
| **Updated** | 2026-07-21 |

## Intent

**Second nine-realm ladder** on a **celestial / upper plane** — not more zones on the Azure Sky Continent. Mortal `Immortal Ascension` (idx 8) opens the door; celestial realm 1 begins a new board.

Mirror mortal structure (early / mid / late thirds) with **fresh names and mechanics** — not copy-paste of Dustbone→Heartlands.

Chaos path and true creation may span or exceed this layer; see chaos doc.

## Design notes

### Layer cake

```text
MORTAL 9 (0–8)     Azure Sky · walk/local map · lifespan months
       ↓ Immortal Ascension / Linger
CELESTIAL 9 (0–8)  Heavenly Court plane · jurisdiction play · new claims
       ↓ (TBD)
CHAOS / SOVEREIGN  Exceed heaven — optional endgame
```

### Relationship to existing stubs

| Doc | Role |
|-----|------|
| `nine-realm-ladder.md` | Mortal indices, Half-Step, Deity Transformation |
| `immortal-world-layer.md` | Court UI, edicts, Works on mortal jurisdictions |
| `chaos-cultivation-path.md` | Flawed path; true creation; chaos realms (TBD) |

### Open design (not fleshed)

- [ ] Celestial realm names (9)
- [ ] Celestial claims parallel to `realm-claims.md`?
- [ ] Separate save state `G.celestialRealmIdx` vs extend `realmIdx`
- [ ] Map UI: new plane tab vs Court sub-panel
- [ ] True reincarnation drops back to mortal 0 with memory?

### Owner note

Park one-pager until mortal nine + immortal Court MVP exist. Recover any PC chat notes on upper realms into this file when found.

## Prerequisites

- [ ] Mortal nine-realm implementation
- [ ] Heavenly Court / linger MVP
- [ ] Chaos revelation fork (defines who reaches celestial vs reincarnates)

## Implementation crumbs

- `legacy.js` — Heavenly Court stub
- `PATHS` — pattern for second ladder
- `isImmortal()` — may need `isMortalImmortal()` vs `celestialRealmIdx`
