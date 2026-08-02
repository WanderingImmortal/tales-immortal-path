# Dao Seeking & Dao Manifestation

| Field | Value |
|-------|-------|
| **Status** | `designed` |
| **Blocked on** | Nine-realm indices in code; sword dao taxonomy; tribulation + breakthrough numbers |
| **Issue** | none yet |
| **Chat / PR** | Dao system world-building ([bc-e6d4167c](https://cursor.com/agents/bc-e6d4167c)); realm-claims expansion 2026-08-02 |
| **Updated** | 2026-08-02 |

## Intent

**Dao Seeking** (idx 6) and **Dao Manifestation** (idx 7) are two watersheds on the nine-realm ladder with different jobs:

- **Seeking** = comprehension realm — pursue **insights/threads**, build a **library** of laws you understand; passives stack.
- **Manifestation** = embodiment realm — **wield** one law at a time; the world reacts to *which* law you wear, not just how high your realm is.

Lesser dao is **specialization**, not weakness. Greater dao is **umbrella law** — harder to comprehend, bigger toolkit. Most Manifestation cultivators **started** by wielding a Lesser because directed paths are easier; specialists who never comprehend Greater are **valid** full Manifestation builds.

Realm claims for presentation: [`realm-claims.md`](realm-claims.md) idx 6–7.

---

## Why Dao Seeking exists (owner 2026-08-02)

### Acquisition realms — VR is the special case (owner 2026-08-02)

**Void Refinement** is intentionally an **acquisition realm**: breakthrough opens the void basin; early VR ≈ **DT Peak** until void qi / void arts are cultivated. That pattern is a **deliberate aside**, not the template for every watershed.

**Dao Seeking must not feel empty at entry.** These cultivators hold **major world positions** (sect patriarchs, vault elders, imperial ancients). If the realm takes millennia to comprehend and grants **no** immediate weight, treating them as apex players is silly.

| Realm | Breakthrough fantasy |
|-------|---------------------|
| **VR** | Permission basin — power **acquired inside** (unique) |
| **Seeking** | **Real jump** — lifespan + moderate power + **weight** on the board; comprehension **deepens** what you already received |
| **Manifestation** | First **wield** — embodiment basin on top of Seeking’s foundation |

```text
VR entry     → potential (void grind ahead)
Seeking entry → mandate (you are now a cosmic-grade actor; library grind deepens you)
Manifest entry → identity (which law wears your name)
```

### Seeking breakthrough package (owner direction — numbers TBD)

**At Peak VR tribulation → Dao Seeking**, the cultivator should receive **immediately**:

| Gift | Purpose |
|------|---------|
| **Lifespan jump** | Moderate — e.g. **~12–15k** band entry (not 30k); buys millennia of pursuit |
| **Moderate power bump** | Not “still VR peak” — combat-relevant edge, not full wield |
| **Board weight** | Capabilities matching office: law-sense, faction/heaven react, forbidden read, NPC deferral tier |
| **Comprehension access** | Dao panel, contemplation, pursuits — **opened**, not **filled** |

Comprehension over thousands of years **stacks and merges** — it does not gate the first sense that this person **matters**.

### Peak VR tribulation — **Glimpse + Rulebook Retaliation** (owner lean 2026-08-02)

Locked direction: see [`void-cosmology-and-refinement.md`](void-cosmology-and-refinement.md). Peak VR glimpses **law-layer**; heaven **retaliates** for trespass; survive → Seeking mandate (lifespan, power, weight).

**Optional combine:** **Script-Sight** (board-weight verbs) layered on Glimpse — not a separate tribulation type.

<details>
<summary>Archived brainstorm alternates (not owner lean)</summary>

#### B — Law Aperture · C — Heaven's Question · D — Script-Sight alone · E — Ambient Dao Draw

Parked alternates from early session; superseded by Glimpse + Retaliation unless owner revives.
</details>

### What each rung is *for*

| Idx | Realm | Job |
|-----|-------|-----|
| 4 | Deity Transformation | **Civic-scale presence** |
| 5 | Void Refinement | **Acquire void** — geometry, void qi, passage |
| 6 | Dao Seeking | **Acquire law-knowledge** — read, contemplate, merge |
| 7 | Dao Manifestation | **Acquire embodiment** — wield, impose, refine wear |

VR refines **where** you can stand. Seeking refines **what rules you can read**. Manifestation refines **which rule wears your name**.

### How you *step into* Dao Seeking

**Trigger:** Peak **Void Refinement** tribulation — the event that justifies the jump (see brainstorm above).

Breakthrough is **not** empty: **lifespan + moderate power + board weight** land immediately. Comprehension **deepens** the mandate; it does not create apex status from zero.

```text
DT  → presence in the mortal hierarchy
VR  → basin for void (acquisition — special case)
DS  → mandate on the cosmic board (jump, then library grind)
DM  → first wield (embodiment grind)
```

Fresh Seeker should **not** feel like “VR peak with homework” — they should feel like **someone heaven and the jianghu already account for**, even with an empty library.

---

## Terminology: retire “Dao Fragment” (owner 2026-08-02)

### Problem

**“Fragment of a dao”** sounds like a **heavenly treasure** — a literal shard you loot and meditate on. Dao in this game is **understood**, then **wielded**. “Comprehending a fragment of the rules of heaven” reads like **item meditation**, not cultivation insight.

Code today mixes names: `Ember Insight`, `Prime Insight: Yin`, `Ashen Cycle Fragment`, `G.daoState.fragments` — inconsistent.

### Lean vocabulary

| Old / code | Player-facing lean | What it actually is |
|------------|-------------------|---------------------|
| Dao fragment | **Insight** (lesser) or **Thread** (greater) | A **pursuit unlocked** — you may now contemplate this law |
| “Held fragments” | **Active pursuits** / **opened threads** | Not inventory weight; entries in your study list |
| Forbidden drop | **Sign** or **witnessing** | You **saw** the law express; contemplation is yours to do |
| Comprehend session | **Contemplation** / **seeking** | Meditation on the **idea**, no object required |

**Rare optional:** a **dao relic** (heavenly treasure) can **point** at a law or accelerate contemplation — catalyst, not the law itself. Genre flavor without making every law a loot drop.

### How you “get” an insight (no shard required)

| Source | Fantasy |
|--------|---------|
| Forbidden ground clear | You **witnessed** Phase of Fire bare at the caldera → *Ember Insight* pursuit opens |
| Tribulation scar | Heaven tested you with lightning → *Thunder Insight* thread appears |
| Seer / karma reading | Hint where to **go look**, not a drop |
| Duel vs law-wearer | You survived their imposition → echo of their **way** (dangerous) |
| Sect lineage | Taught **how to look**, not given a rock |

Gameplay: `G.daoState` might track `pursuits: []` (opened) vs `comprehended: []` (finished) — rename from `fragments` when implementing.

**UI copy lean:** “Seek insight” / “Contemplate thread” — not “You hold 3 fragments.”

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
- Hunt **pursuits / threads** (rename from `fragments` — see terminology), forbidden clears, seer readings — existing hooks

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

## Lifespan (open — ties to watershed doc)

Dao Seeking is **comprehension**, not “my body stores another twenty millennia on breakthrough.” Lifespan should follow **what you understand and wield**, not realm label alone.

| Beat | Lean |
|------|------|
| Enter Seeking | Modest extension over VR peak (~**12–15k** years — TBD) |
| Comprehend / merge milestones | Climb toward **~30k** band — milestones **not designed yet** |
| First **wield** (Manifestation) | **~45–50k** — the big immortal-adjacent contract |

Deep Seekers who never wield can still be **15k–30k** ambient legends; **~50k** is for law-wearers. Full table: [`nine-realm-ladder.md`](nine-realm-ladder.md) — Dao Seeking lifespan (open).

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
- [ ] Which comprehension beats grant lifespan extensions in Seeking?
- [x] **Peak VR tribulation** — **Glimpse + Rulebook Retaliation** (owner lean) — [`void-cosmology-and-refinement.md`](void-cosmology-and-refinement.md)
- [ ] Script-Sight combined with Glimpse for board-weight verbs — yes/no?
- [ ] Seeking breakthrough package: exact lifespan floor + combat/weight passives
- [x] ~~Collapse Seeking into VR sub-phase~~ — **retired**; acquisition realm at idx 6 (owner 2026-08-02)
- [ ] Rename `fragments` → `pursuits` / `threads` in code and copy

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
- [`upper-ladder-design-hub.md`](upper-ladder-design-hub.md) — session index + open-question queue
