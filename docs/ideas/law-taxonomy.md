# Law taxonomy — primordial vs dao vs everything else

| Field | Value |
|-------|-------|
| **Status** | `idea` (owner direction — 2026-08-02) |
| **Blocked on** | Owner lock on in-world terms (hanzi); cosmology depth pass |
| **Issue** | none yet |
| **Chat / PR** | Cloud agent design chat, 2026-08-02 |
| **Updated** | 2026-08-02 |

## Intent

Saying **“yin law reigns supreme”** (Sunless Scar), **“Law of Dust”** (Dustbone), and **“wear a law”** (Dao Manifestation) in the same breath **collapses different layers**. Players and agents need a **stack** — older fundamental rules at the bottom, cultivator dao on top, politics and personal oaths at the human scale.

**Not designing Law of Dust vs chaos here** — see parked note in [`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md).

Related: [`frostbite-origin.md`](frostbite-origin.md), [`realm-claims.md`](realm-claims.md), [`chaos-cultivation-path.md`](chaos-cultivation-path.md), [`post-immortal-cosmology.md`](post-immortal-cosmology.md), [`void-temple-sect.md`](void-temple-sect.md).

## The problem

| Phrase in docs | Sounds like | Actually is (today) |
|----------------|-------------|---------------------|
| “Yin law supreme” | Same as Phoenix flame dao | **Axis-level rule** at a geographic point |
| “Law of Dust” | Primordial entropy | **Completed basin legislation** (Pinwright) |
| “Wear a law” @ Dao Manifestation | Environmental physics | **One cultivator’s embodied dao** |
| “Charter law” | Cosmic | **Imperial politics** |
| “Vessel Rule” | Cosmic | **Self-imposed body oath** (player) |

Without labels, **absolute yin** and **Law of Dust** feel like the same category as **Sword Dao** — they aren’t.

## Proposed stack (five layers)

Use **design English** in agent docs; lock **in-world hanzi** later.

```text
┌─────────────────────────────────────────────────────────┐
│ 5 · Mortal law     — charter, registry, tribal truce    │
├─────────────────────────────────────────────────────────┤
│ 4 · Personal oath  — vessel rules, blood oaths, vows    │
├─────────────────────────────────────────────────────────┤
│ 3 · Embodied dao   — cultivator WEARS one law (realm 7) │
├─────────────────────────────────────────────────────────┤
│ 2 · Regional statute — completed LOCAL rules (basin etc.) │
├─────────────────────────────────────────────────────────┤
│ 1 · Axis / primordial — yin, yang, void… pre-Dao physics│
│     (+ artifact fields that RUN an axis at a point)     │
└─────────────────────────────────────────────────────────┘
```

### Layer 1 — **Axis laws** (primordial / fundamental)

| | |
|--|--|
| **Design term** | **Axis law** or **primordial law** |
| **Working hanzi** | **理则** (principle-rule) or **元理** — *not locked* |
| **What** | Old **infrastructure** of reality — yin and yang as **lanes**, not moods. Pre-Dao, pre-sect. |
| **Who runs it** | **Nobody** — or pre-heaven **objects** that **couple** to an axis (Sunless Mirror → absolute yin at pole) |
| **Feel** | “Physics of the cultivation world” — daylight fails because **yin axis wins there**, not because someone is cultivating ice |
| **Examples** | Sunless Scar apex ([`frostbite-origin.md`](frostbite-origin.md)); continental ward grid nodes; firmament shell ([`void-temple-sect.md`](void-temple-sect.md)) |
| **Player verb** | **Endure, avoid, harmonize** — you don’t “comprehend” axis law like a technique |

**Absolute yin** belongs here — **yin inversion** at the scar is axis behavior, not “a cultivator’s yin dao.”

### Layer 2 — **Regional statutes** (basin / local completed rules)

| | |
|--|--|
| **Design term** | **Regional statute** or **basin law** |
| **Working hanzi** | **地律** (earth-law / local law) — *not locked* |
| **What** | A **finished legislative act** in a **bounded region** — environmental rule **after** someone (or something) **completed** a dao in that basin |
| **Who runs it** | The **land itself** once complete — triggers, thresholds, discharge (cascades) |
| **Feel** | “This desert has a receipt” — **Law of Dust** lives here, **not** in layer 1 vocabulary |
| **Examples** | Law of Dust / Return-to-Dust ([`dustbone-dynasties-entropy-lore.md`](dustbone-dynasties-entropy-lore.md)) |
| **Player verb** | **Live under threshold** — different fantasy from standing in absolute yin |

**Why it confuses:** also called “law,” also reshapes landscape — but it’s **authored + basin-scoped**, not axis primordial. Pinwright **wrote** a statute; the mirror **anchors** an axis.

*Do not resolve Pinwright / chaos here — parked elsewhere.*

### Layer 3 — **Embodied dao laws** (cultivator-worn)

| | |
|--|--|
| **Design term** | **Embodied dao** or **worn law** |
| **Working hanzi** | **显法** / **戴法** — *not locked* |
| **What** | At **Dao Manifestation** (idx 7), a cultivator **embodies one dao** as a **personal law** — Sword, Phoenix flame, etc. |
| **Who runs it** | **The cultivator** — portable **jurisdiction** around their dao lane |
| **Feel** | “His sword line cuts reality” — **identity**, not continent geology |
| **Examples** | Sword Immortal’s line; Phoenix flame law; Phoenix Nine Ascents [#6 Law Ignition](golden-phoenix-sect.md) |
| **Player verb** | **Seek, comprehend, wear** — cultivation ladder fantasy |

**Distinct from axis:** worn law **dies or sleeps** when the cultivator dies (unless legacy array). Axis at Sunless Scar **outlives** every sect.

### Layer 4 — **Personal oaths** (self-bound)

| | |
|--|--|
| **Design term** | **Personal oath** / **vessel rule** |
| **What** | **Self-imposed** law on **your** body or soul — not cosmic |
| **Code** | `VESSEL_RULES` — already documented as *not cosmic Dao* (`data.js` body chamber) |
| **Examples** | Rule of Blood, Rule of the Unnamed |

### Layer 5 — **Mortal law** (charter & custom)

| | |
|--|--|
| **Design term** | **Charter law**, registry, tribal truce |
| **What** | Paper, oaths between powers, imperial mandate — **no cultivation physics** |
| **Examples** | Phoenix Gambit, Sandveil Treaty, Registry building caps |

## How to talk in docs (agent rule)

| When writing… | Use layer | Avoid calling it… |
|---------------|-----------|-------------------|
| Sunless Scar, yin inversion | **Axis law** (+ artifact coupling) | “yin dao” or “ice dao” alone |
| Law of Dust, cascades | **Regional statute** / **basin law** | “primordial entropy” without qualifier |
| Dao Manifestation patriarch | **Embodied dao** / **worn law** | “axis” |
| Imperial charter | **Mortal law** | “dao” |
| Body chamber oath | **Personal oath** | “law of the flesh” = cosmic |

## Sunless Scar × taxonomy

| Piece | Layer |
|-------|-------|
| **Absolute yin** at pole | **Axis** — yin lane supreme; yang inverts |
| **Sunless Mirror** | **Pre-heaven artifact** that **couples** to yin axis at a **point** — not the axis itself, but the **anchor** |
| **Bleed / reshaped landscape** | Axis **field** propagating over distance (gradient into law) |
| **Yin palace cultivators** | **Harmonize** with axis + teach **embodied yin dao** (layer 3) — two different things in one sect |

## Dustbone × taxonomy (labels only — no chaos digression)

| Piece | Layer |
|-------|-------|
| **Law of Dust** | **Regional statute** (basin completed) |
| **Pinwright** | Author of statute, not axis |
| **Sand** | **Discharge** of statute + cascade, not primordial sand |

## Chaos path × taxonomy (pointer)

Chaos endgame = **unwrite / author** at a layer **above or beside** orthodox dao — possibly touching **axis** (Progenitor), not the same as **wearing** Phoenix flame law. Detail in [`chaos-cultivation-path.md`](chaos-cultivation-path.md) when owner returns.

## Open questions

- [ ] Lock hanzi: **理则** vs **元理** vs **天道法则** for layer 1 — player-facing shorter term?
- [ ] Is **firmament** layer 1 or its own **shell law** between layers 1 and 2?
- [ ] Can **embodied dao** at peak **distort** a regional statute, or only axis + Progenitor-tier?
- [ ] UI: do ancient clues tag layer (“axis scar”, “basin statute”) for player clarity?
- [ ] Rename doc headings: “Law of Dust” → always “basin statute (Law of Dust)” in new writing?

## Implementation crumbs (later)

- Glossary string table for UI / chronicle tags
- `ANCIENT_CLUES` optional `lawLayer: 'axis' | 'basin' | …`
- Realm-claims doc cross-link at Dao Manifestation row
