# Immortal world layer (ordered path)

| Field | Value |
|-------|-------|
| **Status** | `designed` (partial — MVP scope TBD) |
| **Blocked on** | Mortal Immortal Ascension (`idx 8`); [`nine-realm-ladder.md`](nine-realm-ladder.md); legacy / Heavenly Court stub |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chats, 2026-07-18–21 |
| **Updated** | 2026-07-21 |

## Intent

After **Immortal Ascension** on the ordered path, gameplay shifts from **walking the mortal map** to **shaping jurisdictions** — qi tides, laws, scheduled consequences. Not stronger mortal gameplay; a new loop.

**Chaos path** (true creation, exceed heaven) extends this in [`chaos-cultivation-path.md`](chaos-cultivation-path.md). This doc covers **ordered** ascendants still inside heaven’s game.

> **Immortal gameplay is legislating reality until heaven has no authority over you** — chaos is when you succeed.

## Design notes

### Mortal vs immortal loop

| | Mortal (0–8) | Ordered immortal |
|--|--------------|------------------|
| Map | Walk, local, zone travel | **Jurisdiction view** — 5 spheres as cards |
| Time | Months per action | Edicts, multi-year **Works** |
| Power | Claims, compression | Zone modifiers, law emphasis |
| End | Half-Step → Immortal | Linger at Court vs reincarnate |

### Heavenly Court / Linger (existing stub)

`legacy.js` — *“Heavenly Court awaits, stub”* on true reincarnation modal.

- **Reincarnate** — meta loop (carry perks)
- **Linger** — enter **Court** layer (ordered immortal MVP)
- **Chaos revelation** — flawed path; see chaos doc (may replace or supplement Court as “trap”)

### Power tiers (ordered only)

| Tier | Examples | Heaven |
|------|----------|--------|
| **Influence** | Bless qi tide; suppress disaster; awaken sealed site | Tolerates |
| **Legislation** | Emphasize/weaken law in region; shift tribulation character | Resists |
| **Domain creation** | Spirit vein; **borrowed-law** pocket realm | Rival legislator |
| **Destruction** | Sever law binding; unmake registered realm | Hostile audit |

**True creation** (unregistered realm, sovereign life, heaven-wounding weapon) → **chaos path only**.

### Action categories (manage depth)

| Category | Reversible? | Scope |
|----------|-------------|-------|
| **Edicts** | Mostly yes | Regional, smaller |
| **Works** | Hard to undo | Multi-phase projects (decades) |
| **Taboos** | Irreversible | One per life; world-remembering |

Don’t show all tiers day one — unlock with dao comprehension / court standing.

### World state (implementation sketch)

```javascript
// Meta or per-save immortal flags
G.worldLaws = { fire: 0, cycle: 0, karma: 0, ... }; // -100..+100 emphasis per zone?
G.zoneModifiers = { dustbone: { qiMult: 1, scar: null }, ... };
G.heavenAttention = 0; // triggers scheduler events
```

Propagate to mortal play: cultivate mult, explore, faction events, chronicle.

### Heaven fights back

- `world-scheduler.js` — delayed tribunals, envoy, rival ascendant
- Chronicle + faction reactions bundled with major Works
- Not a single debuff — **event chains**

### UI sketch

```text
[ Mortal World | Celestial Court ]   (Local tab when incarnated / visiting)

Mortal World (read-only or edict targets):
  [Dustbone] [Jade] [Frostbite] [Heartlands] [Emberwild]
  Active: +10% qi (blessing), Scar: Palm Pass collapsed

Court:
  Edicts · Works in progress · Heaven's Response queue
```

### MVP slice (when building)

Long **Works** use the project + time-playback shell — see [`chronicle-and-projects.md`](chronicle-and-projects.md).

1. Linger opens Court stub panel
2. 2–3 edicts (bless one zone qi, suppress one law, trigger one world event)
3. Mortal zones show modifier tags + chronicle
4. Reincarnate still works

## Prerequisites

- [ ] `isImmortal()` at idx 8
- [ ] Extend true reincarnation modal
- [ ] Zone modifier hooks in explore/cultivate (read mults)

## Open questions

- [ ] Court vs chaos revelation — same screen or branch?
- [ ] Can ascendant **visit** mortal map as avatar?
- [ ] Persist edicts across true reincarnation (legacy)?

## Implementation crumbs

- `legacy.js` — `openTrueReincarnationChoice`, `triggerTrueReincarnation`
- `world-scheduler.js`, `world.js` — zones
- `dao-taxonomy.js` — laws, Wuji
- `factions-expand.js` — political reactions
- `chaos-cultivation-path.md` — exceed heaven layer
