# Dao Seeking & Dao Manifestation

| Field | Value |
|-------|-------|
| **Status** | `designed` (philosophy) — **Seeking identity / terminology open** (owner 2026-08-02) |
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

## Why Dao Seeking exists (open — owner 2026-08-02)

### The worry

**Void Refinement** today risks feeling like **glorified Deity Transformation** until **void qi** and **void arts** ship — same stats, longer lifespan, no distinct verb. We should **not** repeat that with **Dao Seeking** = glorified VR with a dao panel bolted on.

If Seeking is only “VR but you can open a menu,” it does not deserve a watershed index.

### What each rung is *for* (orthogonal jobs)

| Idx | Realm | Job | Not this |
|-----|-------|-----|----------|
| 4 | Deity Transformation | **Civic-scale presence** — the jianghu names you | Bigger domain radius |
| 5 | Void Refinement | **Geometry** — void qi, passage, spatial authority | “Stronger DT” |
| 6 | Dao Seeking | **Epistemology** — read and accumulate **law** | “Stronger VR” |
| 7 | Dao Manifestation | **Ontology** — **be** a law locally | “More library slots” |

VR refines **where** you can stand in the world. Seeking refines **what rules you can read**. Manifestation refines **which rule wears your name**.

**Prerequisite to ship Seeking well:** VR must have its own verbs first (void qi, void arts, blink/passage claim). See [`realm-claims.md`](realm-claims.md) idx 5.

### How you *step into* Dao Seeking (lean)

Not “you got 30% stronger.” The breakthrough is **perceptual** — like QC’s Perception, not like GC’s Domain.

**Lean narrative:** Void refinement thins the self enough that you stop seeing only **space** and start seeing **seams in the rules** — where heaven’s patterns show through. Dao Seeking is the realm where that second sight becomes **stable enough to study**.

```text
DT  → presence in the mortal hierarchy
VR  → passage through space (void qi / void arts)
DS  → perception of law-lines + time to pursue comprehension
DM  → first successful WIELD — law anchors through you
```

**Breakthrough trigger (sketch):** tribulation + consolidation at VR peak **and** at least one **law-sign** witnessed (see terminology below) — you proved you can see the seam, not that you own a shard.

**Alternative (if Seeking feels redundant):** fold early pursuit into VR as a **sub-phase** (“void → rule-sight”), and only promote to **named Seeking realm** when the player **comprehends their first law**. Realm label follows proof, not the other way around. *Owner has not chosen — both parked.*

### Why comprehension gates at Seeking (not earlier)

**Wrong answer:** “Because the spreadsheet says `reqRealm: 5`.”

**Better answers (can combine):**

1. **Capacity** — below Seeking, holding a law-concept in the soul **shatters** or dissipates; NS/DT can *feel* wrongness at forbidden sites but not **retain** structure.
2. **Tease early, pursue late** — NS+ explore can surface **signs** (rumors, one-off visions, “thin dao” warnings). **Systematic** library grind (sessions, merge, panel) unlocks at Seeking.
3. **Seeking is the container** — the realm is not “dao turns on”; it is “you now have a **basin** whose whole job is comprehension,” like FE is the qi-chamber basin.

Avoid: VR patriarch and fresh Seeker feel identical except menu access.

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
- [ ] Seeking breakthrough: VR peak tribulation only, or require first **sign** witnessed?
- [ ] Collapse Seeking into VR sub-phase until first comprehension — yes/no?
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
