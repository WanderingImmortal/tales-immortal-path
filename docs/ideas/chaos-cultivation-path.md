# Chaos cultivation path

| Field | Value |
|-------|-------|
| **Status** | `designed` (partial — lost PC agent chat; realms + grotto masters TBD) |
| **Blocked on** | Immortal endgame fork; legacy meta flags; forbidden / grotto content |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chats, 2026-07-18–19; PC agent chat (lost — realms + grotto masters) |
| **Updated** | 2026-07-19 |

## Intent

Orthodox cultivation reaches **Immortal Ascension** — and that is not the true end. Heaven's ladder is **flawed**: the ascendant cannot reach, overcome, or exceed heaven on the ordered path alone. Something is missing.

**Chaos** is the suppressed alternative — not random destruction, but **pre-law / outside-law potential**: energy and technique from before (or beneath) heaven's registry. Grasping it is harder than destruction; **true creation** only becomes possible here.

**True creation** means making what heaven has **no authority over**: realms it cannot enter or affect, life bound only to the creator's rules, artifacts that can **wound heaven itself** (not stat sticks).

Player discovers the flaw at immortal endgame, then chooses: **reincarnate with knowledge** (chaos path unlocks on future runs) or **sacrifice the entire ordered path** in one life for a risky chaos initiation.

## Design notes

### True creation (definition)

Three tiers — only the last is chaos-gated:

| Tier | Heaven's relationship | Examples |
|------|----------------------|----------|
| **Imitation** | Uses heaven's matter & laws | Conjured gear, herbs, temporary constructs |
| **Domain** | Registered — heaven can audit / invade | Pocket realms with borrowed laws, spirit veins |
| **True creation** | **Outside authority** | Unregistered realm · sovereign life · heaven-wounding weapon |

**Design rule:** ordered immortals cap at imitation + borrowed domains. **True creation** requires chaos (or post-chaos transcendence).

### Creation vs destruction

- **Destruction** (ordered path): sever, suppress, unmake heaven's *works* — still heaven's language.
- **True creation** (chaos): originate what heaven never filed — harder, unstable, heaven fights back hardest.
- **Exceed heaven** (endgame): not fighting within the system — sovereignty or irrelevance.

> Heaven's path makes you immortal; chaos asks whether you still need heaven's permission.

### Immortal revelation (end of ordered path)

```text
Reach Immortal Ascension
        ↓
Heaven offers: Reincarnate (cycle) | Linger (Court — still inside heaven)  [see legacy.js stub]
        ↓
[Earned revelation] The path is flawed — cannot exceed heaven
        ↓
Fork:
  A) Reincarnate with knowledge → chaos path options at creation (meta unlock)
  B) Sacrifice entire path → burn ordered cultivation NOW; risky chaos grasp in this body
```

**Linger / Heavenly Court** may be the **comfort trap** — power inside heaven's game. Chaos is the walkout.

### Fork A — Reincarnate with knowledge

- Chronicle: *Ascended. Found heaven's ceiling.*
- Legacy flag (e.g. `chaosPathKnown`) unlocks chaos options on **future** creation screens.
- Player is **oriented**, not **completed** — still starts weak; chaos is a path, not a cheat code.
- **Pentamixed root** remains a red herring ("elements in chaos" ≠ chaos path).

### Fork B — Sacrifice the path (same-life)

- Wipe ordered progression: realms, techniques, dao, vessel rules, immortal status, etc.
- Retain: player knowledge, chronicle, maybe one scar perk (TBD).
- Initiation: grasp **pure chaos** — high fail → bitter death / cripple ending.
- Success: chaos cultivator in a body that already touched heaven — unstable, unprecedented.

### Broken path (scars from ordered cultivation)

Chaos after a full ordered run conflicts with:

- Comprehended fundamental laws (must contradict / unlearn)
- Tribulation scars, transcendence perks (heaven's brand)
- Sect, fame, alignment (orthodoxy ties)
- Sealed realms, rigid foundation (resists unformed chaos qi)

Reincarnation **cleans the vessel** but costs a run. Sacrifice **keeps one life's context** but burns the board.

### Chaos realms — **TBD (lost from PC chat)**

> Owner had chaos realms **somewhat mapped out** in a prior agent session on PC. Recover and paste below.

**Placeholder structure** (fill when found):

| Realm id | Name | Role / law | Heaven relationship | Discovery |
|----------|------|------------|---------------------|-----------|
| `???` | ??? | ??? | Outside registry / partial registry | ??? |
| `???` | ??? | ??? | ??? | ??? |
| `???` | ??? | ??? | ??? | ??? |

Design intent for chaos realms:

- Not "zone 6 on the continent" — **planes or folds** outside heavenly jurisdiction.
- May connect to immortal-layer UI (jurisdiction view), not mortal local map walk.
- Leaks / instability in mortal world as consequence.

### Hidden grotto masters — **TBD (lost from PC chat)**

> Owner had **2–3 hidden grotto masters** sketched (partial chaos walkers). Recover and paste below.

**Design rule:** grotto masters never **complete** chaos. They glimpsed it, paid a price, left warnings or fragments. Foreshadow ascendant revelation.

**Placeholder structure** (fill when found):

| Master id | Name | Location / grotto | What they walked | What they left | Warning |
|-----------|------|-------------------|------------------|----------------|---------|
| `???` | ??? | ??? | Partial chaos / pre-heaven | Manual fragment, realm clue, weapon ruin | ??? |
| `???` | ??? | ??? | ??? | ??? | ??? |
| `???` | ??? | ??? | ??? | ??? | ??? |

**Existing hooks to tie grotto masters to:**

- Sealed ancients (`ancients.js`, `HIDDEN_SUBZONES`) — bargains, pre-heaven qi lore (e.g. Frost array text).
- Hermit NPCs, hidden subzones, forbidden grounds — manual fragments that don't fit elemental dao branches.
- Ambient / world NPCs — reclusive master in a sealed site.

### Chaos path vs other systems

| System | Relationship |
|--------|--------------|
| **Wuji** (`dao-taxonomy.js`) | Reunifies heaven's laws **inside** the order. Chaos **predates or exceeds** the set — not the same endpoint. |
| **Chaos Physique** (`spiritual-roots-taxonomy-v2.md`) | Likely **capstone** body for chaos initiates — meta / late unlock, not starter. |
| **Fundamental laws** | Ordered comprehension is **incompatible** with raw chaos until resolved (unlearn, contradict, or transcend). |
| **True reincarnation** (`legacy.js`) | Extend modal with revelation fork; `Heavenly Court awaits, stub` → trap or parallel to chaos linger. |
| **World impact (immortal layer)** | True creation Works live here — realms, sovereign life, heaven-wounding artifacts. |
| **Pentamixed root** | Weak baseline; **not** the hidden chaos path. |

### Immortal power tiers (ordered vs chaos)

| Tier | Ordered ascendant | Chaos ascendant |
|------|-------------------|-----------------|
| Influence | Bless / curse regions, seal breaches | Same + unregistered leaks |
| Legislation | Emphasize / weaken heaven's laws | Unmake law **binding** |
| Creation | Imitation, borrowed domains | **True creation** Works |
| Destruction | Sever heaven's works | Unmake heaven's **authority** in a scope |
| Transcendence | Wuji sage? | Exceed — heaven irrelevant |

### UI / map (future)

- Mortal: world + local map (separate brainstorm).
- Immortal ordered: jurisdiction view, edicts, borrowed domains.
- Immortal chaos: **Works** tab (true creation), **Active Realms**, **Heaven's Response** (audits, tribunals).
- Chaos realms: not mortal walk nodes — plane / instance layer.

## Prerequisites

- [ ] Immortal endgame revelation UI (extend true reincarnation / ascension moment)
- [ ] Legacy meta flag for `chaosPathKnown` (or equivalent)
- [ ] Creation screen hook for chaos unlock (see `creation-screen-redesign.md`)
- [ ] Recover lost PC notes: chaos realms map, 2–3 grotto masters
- [ ] Forbidden / grotto content pipeline for master fragments
- [ ] Distinction from pentamixed root in creation copy

## Open questions

- [ ] Does **Linger (Heavenly Court)** remain as deliberate trap vs cut?
- [ ] Sacrifice path: exact reset list vs retained (techniques? dao? sect?)?
- [ ] Chaos at creation: separate root, manual, track, or initiation-only mid-run?
- [ ] One true-creation **Work** per life, or multiple with escalating heaven response?
- [ ] Can non-chaos ascendants **steal** incomplete chaos techniques (high risk, hollow results)?
- [ ] Grotto masters: unique NPCs vs reskin sealed ancients?

## Implementation crumbs

- `legacy.js` — `openTrueReincarnationChoice`, `triggerTrueReincarnation`, Heavenly Court stub
- `core.js` — `isImmortal()`
- `dao-taxonomy.js` — Wuji, fundamental laws, primordial tier
- `ancients.js` — hidden subzones, chronicle, bargains
- `spiritual-roots-taxonomy-v2.md` — Chaos Physique, deviant / legendary constitution
- `world-scheduler.js` — delayed heaven response to true creation
- `forbidden.js` — hidden paths, fragment manuals
- `data.js` — pre-heaven qi lore (Frost array), `LEGACY_CARRY_PERKS` (extend for chaos echo?)

## Recovery checklist (owner)

When the PC chat or notes resurface, fill in:

1. **Chaos realms** table + any layout / connection diagram
2. **Grotto masters** table (names, locations, partial-walk lore, loot/warnings)
3. Any named techniques, weapons, or initiation trial steps from that session
