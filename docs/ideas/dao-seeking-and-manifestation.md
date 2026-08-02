# Dao Seeking & Dao Manifestation

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | Nine-realm indices in code; sword dao taxonomy; owner tune on Manifestation depth tiers |
| **Issue** | none yet |
| **Chat / PR** | Dao system world-building ([bc-e6d4167c](https://cursor.com/agents/bc-e6d4167c)); realm-claims expansion 2026-08-02 |
| **Updated** | 2026-08-02 |

## Intent

**Dao Seeking** (idx 6) and **Dao Manifestation** (idx 7) are two watersheds on the nine-realm ladder with different jobs:

- **Seeking** = comprehension realm — hunt fragments, build a **library** of laws you understand; passives stack.
- **Manifestation** = embodiment realm — **wield** one law at a time; the world reacts to *which* law you wear, not just how high your realm is.

Lesser dao is **specialization**, not weakness. Greater dao is **umbrella law** — harder to comprehend, bigger toolkit. Most Manifestation cultivators **started** by wielding a Lesser because directed paths are easier; specialists who never comprehend Greater are **valid** full Manifestation builds.

Realm claims for presentation: [`realm-claims.md`](realm-claims.md) idx 6–7.

---

## Realm roles (nine-realm target)

| Idx | Realm | Dao role | Player fantasy |
|-----|-------|----------|----------------|
| 6 | Dao Seeking | Hunt, comprehend, merge | "I read the rules — my library grows" |
| 7 | Dao Manifestation | Wield one active law | "The law is on my skin — space bends to it" |

**Manifestation gate:** first **wield** of a law enters Dao Manifestation. Floor: even a **Lesser way-law** counts (e.g. Light Sword Dao). Big breakthrough bump on first wield — not on merely comprehending Greater in the library.

**Half-Step / idx 8:** Manifestation depth and worn-law mastery feed tribulation / Court hooks; see [`nine-realm-ladder.md`](nine-realm-ladder.md).

---

## Lesser vs Greater (owner lock 2026-08-02)

| Tier | Philosophy | Comprehension | Gameplay lean |
|------|------------|---------------|---------------|
| **Lesser** | **Specialization** — a directed path | Easier to walk a narrow way | Personal hooks; signature style (e.g. Light Sword) |
| **Greater** | **Umbrella law** — encompasses related ways | Harder; not everyone can | Bigger toolkit, higher ceiling |
| **Fundamental** | Merged partitions (Yin+Yang → Yin-Yang) | Vertical trade-up | Consumes children on merge |
| **Primordial** | Top of tree | Endgame comprehension | Parked for immortal layer |

**Not:** Lesser = "weak dao you outgrow." **Yes:** Lesser = valid endgame identity; Greater = optional breadth.

---

## Two kinds of Lesser (reconcile with code)

Today `DAO_TAXONOMY` lesser entries are mostly **insight/fragment** types:

```text
Ember Insight → progressTo Phase of Fire (templated, element branch)
```

Design adds **way/style** lessers — personal, signature:

```text
Light Sword Dao — speed/agility specialization; deflection-style defense; not a fragment of Sword Dao stats
```

Both live under tier `lesser`; data distinguishes `kind: 'insight' | 'way'` (or branch tag) when implemented.

---

## Three layers: library · merge · wear

```text
Dao Seeking (idx 6)          Dao Manifestation (idx 7)
─────────────────────          ─────────────────────────
Library: comprehend many   →   Wear: ONE active law (swappable w/ cost)
Merge: vertical trade-up       Embody: local imposition on space
Passives stack (comprehended)  Aura: others sense WHICH law
```

### Library (Seeking)

- `G.daoState.comprehended` — ids fully comprehended
- `getActiveDaoEffects()` — passives from **all** comprehended laws stack while Seeking+
- Hunt fragments (`G.daoState.fragments`), forbidden clears, seer readings — existing hooks

### Merge (Seeking+, not anti-multidao)

- Partitions combine into **Fundamental** dao (e.g. Yin + Yang → Yin-Yang)
- **Consumes** child comprehensions — vertical trade-up, not "you can only pick one dao ever"
- Distinct from **wear**: merge is knowledge structure; wear is combat/world expression

### Wear (Manifestation)

- **One active worn law** at a time
- **Swappable with cost** — time, qi, tribulation scar, narrative gate (owner tune); **not** locked for life
- Worn law drives: local imposition, tribulation character, formation interaction, NPC/faction reactions
- Comprehended library remains; only **worn** law gets embodiment verbs

**Owner lock:** swappable with cost; one active. (Resolves open question in [`realm-claims.md`](realm-claims.md).)

---

## Manifestation depth (inside idx 7)

**Not** granted by equipping Greater alone. **Manifestation depth** = mastery with the **currently worn** law:

| Depth (draft names) | Feel |
|---------------------|------|
| **Wielded** | Law acknowledged; local skew |
| **Refined** | Reliable imposition; counters weak techniques |
| **Imposed** | Space answers; tribulation/heaven read your law |
| **Peak** | Specialist ceiling — can outplay raw Greater wearer who hasn't refined |

Greater law = **bigger toolkit / higher ceiling**; tier climbs through **refinement and what you can do**, not equip tier alone.

---

## Intent vs Dao (separate tracks)

- **Intent** (`intent.js`) — FE-era combat/social expression; own progression
- **Dao** (`dao-taxonomy.js`, `data.js` `DAO_TAXONOMY`) — Seeking/Manifestation library and wear
- Convergence at **Perfect Cultivation** / peak beats — **not** "intent becomes dao" automatically

---

## Worked example — Sword

| Dao | Tier | Role |
|-----|------|------|
| **Light Sword Dao** | Lesser (way) | Speed, agility, deflection defense; personal signature |
| **Heavy Sword Dao** | Lesser (way) | Power, commitment — different specialization |
| **Broken Sword Dao** | Lesser (way) | … (parked) |
| **Sword Dao** | Greater | Umbrella **cutting/separation** law; encompasses all sword-ways |

**Progression paths (both valid):**

1. **Specialist forever** — wield Light Sword at Manifestation; peak depth; never comprehend Sword Dao Greater
2. **Scholar path** — wield Light Sword first (easier gate); later comprehend and optionally **swap wear** to Sword Dao Greater for breadth

**Sect lore:** Celestial Sword Sect — First Sword tradition at Dao Manifestation ([`celestial-sword-sect.md`](celestial-sword-sect.md)).

**Code today:** sword dao **not** in `DAO_TAXONOMY` yet; element lessers only.

---

## Law-sense & world (Seeking verbs)

Tie to realm claim **Law (seek)** ([`realm-claims.md`](realm-claims.md)):

- Faction dao alignment readable before entering ground
- Tribulation lean preview from comprehended set
- Forbidden sites: "thin dao" / wrong-law warnings
- Bridge to immortal **legislation** preview ([`immortal-world-layer.md`](immortal-world-layer.md))

---

## Wear verbs (Manifestation)

Tie to realm claim **Law (wear)**:

- Local imposition — muffle weak techniques, skew environmental rules
- Others sense **which** law (not generic high-realm dread)
- Body/soul skins: law-forged flesh / law-bound soul ([`realm-claims.md`](realm-claims.md))
- Formation and domain interaction — worn law vs comprehended library

---

## Prerequisites

- [ ] Nine-realm migration — Dao Seeking idx 5→6, add Manifestation idx 7
- [ ] `G.daoState.wornLaw` (or equivalent) + swap cost rules
- [ ] Manifestation depth track per worn law id
- [ ] Lesser `kind` split: insight vs way-style entries
- [ ] Sword branch in `DAO_TAXONOMY` (content + Celestial Sword hooks)
- [ ] Breakthrough: first wield triggers Manifestation realm

## Open questions

- [ ] Exact swap cost curve (months? tribulation scar? one free swap per watershed?)
- [ ] Can you wear Fundamental/Primordial, or only Greater/Lesser ways?
- [ ] Manifestation depth — shared sub-states across all laws or per-law mastery map?
- [ ] Karma / seer integration from world-building chat ([bc-e6d4167c](https://cursor.com/agents/bc-e6d4167c)) — separate issue?
- [ ] Half-Step benefit from Peak worn depth vs breadth of library?

## Implementation crumbs

- `data.js` — `DAO_TAXONOMY`, `DAO_FRAGMENT_POOL`, `DAO_SEEKING_REALM_IDX`
- `dao-taxonomy.js` — `ensureDaoState`, `getActiveDaoEffects()`, comprehend/merge helpers
- `ui.js` — Dao panel (lesser/greater sections)
- `cultivation.js` — breakthrough realm idx; Manifestation gate on first wield
- `intent.js` — keep separate until Perfect Cultivation convergence designed

## Links

- [`realm-claims.md`](realm-claims.md) — idx 6–7 claims, travel, skins
- [`nine-realm-ladder.md`](nine-realm-ladder.md) — indices, dao order, half-step
- [`celestial-sword-sect.md`](celestial-sword-sect.md) — First Sword @ Manifestation
- [`immortal-world-layer.md`](immortal-world-layer.md) — legislation preview
- [`cultivation-realm-depth-pass.md`](cultivation-realm-depth-pass.md) — umbrella depth pass
