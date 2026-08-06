# Upper ladder design hub (VR · Seeking · Manifest)

| Field | Value |
|-------|-------|
| **Status** | `designed` (partial — owner locks + open queue) |
| **Blocked on** | Nine-realm code migration; void qi/arts; tribulation scripts |
| **Issue** | none yet |
| **Chat / PR** | Cloud design pass 2026-08-02; PR [#100](https://github.com/WanderingImmortal/tales-immortal-path/pull/100) |
| **Updated** | 2026-08-02 |

## Intent

Single index for the **2026-08-02 upper-ladder design session** — realm claims idx 4–7, nine-realm lifespans, dao philosophy, void cosmology, VR→Seeking tribulation. So chat is not the source of truth.

---

## Doc map

| Topic | Primary doc |
|-------|-------------|
| Per-realm claims, travel, DT civic pressure | [`realm-claims.md`](realm-claims.md) |
| Nine indices, lifespan table, world presence | [`nine-realm-ladder.md`](nine-realm-ladder.md) |
| Basin grind vs lifespan anchors | [`watershed-realms-lifespan-pacing.md`](watershed-realms-lifespan-pacing.md) |
| Dao library / merge / wear, Lesser vs Greater, sword example | [`dao-seeking-and-manifestation.md`](dao-seeking-and-manifestation.md) |
| Void layers, VR acquisition, Glimpse + Retaliation | [`void-cosmology-and-refinement.md`](void-cosmology-and-refinement.md) |
| Void Temple prep vs solo trespass | [`void-temple-sect.md`](void-temple-sect.md) |
| Per-transition tribulation identity | [`tribulation-per-realm-limbo.md`](tribulation-per-realm-limbo.md) |
| Umbrella depth pass | [`cultivation-realm-depth-pass.md`](cultivation-realm-depth-pass.md) |

---

## Owner locks (2026-08-02)

### Realms & claims

- **Nine-realm ladder** — QC→FE→GC→NS→**DT**→VR→Seek→Manifest→Immortal (idx 0–8).
- **Deity Transformation (idx 4)** — **contextual civic pressure** by settlement tier, not flat radius or more flight ([`city-tiers.md`](city-tiers.md)).
- **VR (idx 5)** — **acquisition realm** only: breakthrough ≈ DT Peak until **void qi** / **void arts** cultivated inside.
- **Seeking (idx 6)** — **mandate at breakthrough** (lifespan + moderate power + board weight); library deepens over millennia — not empty at entry.
- **Manifestation (idx 7)** — gate on **first wield**; one active worn law, **swappable with cost**.

### Lifespan (xianxia scale)

- **FE 120**, **GC 300–500** (band), **NS 1k–1.5k**, **DT 2k–3k**, **VR 5k / 7.5k / 10k** (5k = half of 10k aesthetic).
- **Seeking** — modest entry ~12–15k; climb toward **~30k** via comprehension milestones (TBD); **Manifest ~45–50k** on wield.
- In-basin **+year milestones** deferred until GC+ substage milestones exist.

### Dao

- **Lesser** = specialization; **Greater** = umbrella law; specialist Manifestation builds valid.
- Retire **“dao fragment”** player copy → **insights / threads / pursuits**; acquisition via **witnessing signs**, not looting shards.
- **Intent** and **dao** stay separate until Perfect Cultivation convergence.

### Void

- **Layer split authoritative** — interstitial, void qi, firmament, outer void, pockets, law-layer ([`void-cosmology-and-refinement.md`](void-cosmology-and-refinement.md)).
- **Peak VR → Seeking:** **Glimpse** law-layer in action → **Rulebook Retaliation** (trespass, **not a test**).
- **Solo retaliation**; survival = full prep (cultivation foundation, arrays, equipment, pills, karma).
- **Void Temple** — efficient void cultivation; better **DT→VR** survival; **cannot** sit Seeking retaliation for you.

### Parked for later

- **Golden Phoenix Void Hollowing** — great-sect pass (elders, relics, history).
- **Sword dao taxonomy** in `DAO_TAXONOMY` — content pass with Celestial Sword.
- **Code:** nine-realm migration, `fragments` → `pursuits` rename.

---

## Open questions (consolidated)

### Lifespan & pacing

- [ ] GC+ in-basin milestone **+years** — amounts when consolidate/substage milestones designed
- [ ] Which **comprehension beats** extend Seeking lifespan? (first Greater? Fundamental merge?)
- [ ] Deep Seek **~30k without wield** — valid tragedy plateau?
- [ ] Manifest perfected — flat **50k** or **55k** before Immortal?

### VR → Seeking tribulation

- [ ] **Rulebook Retaliation** — single phase or multi (glimpse → strike → stabilize lens)?
- [ ] **Preparation scoring** — how arrays / gear / pills modify survival
- [ ] Void Temple **DT→VR** rite — how much survival bonus without trivializing?
- [ ] Glimpse — always visual, or path-dependent (e.g. sword cultivator “cuts” veil)?
- [ ] NPC patriarchs — all survived retaliation, or rare **inherited script-sight** by sect rite?
- [ ] Seeking breakthrough — exact **lifespan floor** and **combat/weight** passives list
- [ ] Combine **Script-Sight** (board weight) with Glimpse, or Glimpse alone enough?

### Dao system

- [ ] Worn-law **swap cost** curve
- [ ] Wear **Fundamental/Primordial**, or only Greater/Lesser ways?
- [ ] Manifestation **depth** — shared sub-states vs per-law mastery map
- [ ] Karma / seer hooks from [bc-e6d4167c](https://cursor.com/agents/bc-e6d4167c)
- [ ] **Half-Step** vs peak worn depth vs library breadth

### Realm claims & ladder

- [ ] **Half-Step Immortal** model A vs B ([`nine-realm-ladder.md`](nine-realm-ladder.md))
- [ ] Claims stored explicitly vs derived from table?
- [ ] Body/soul **9 skins** at launch or subset?
- [ ] GC combat **qi-lock** — v1 or v2?
- [ ] Manifestation gate **immortal legislation** preview?
- [ ] Upper celestial nine — mirror mortal nine or fresh names?

### Implementation (when building)

- [ ] Nine-realm `PATHS`, `LIFESPAN_BY_REALM[9]`, `reqRealm` audit, save migration
- [ ] Void qi resource + void arts verbs before Seeking content ships
- [ ] `TRIBULATION_TYPES` / transition key `VR→Seeking`

---

## Resolved this session

- [x] DT idx 4 name — Deity Transformation
- [x] DT pressure — contextual by civic tier
- [x] Manifestation worn law — one active, swappable with cost
- [x] VR early ≈ DT Peak — intentional acquisition realm
- [x] Seeking must confer breakthrough weight — not VR-style empty entry
- [x] VR lifespan floor — 5,000 years
- [x] Void layer split + coherence rule
- [x] Retaliation = trespass, solo, full-prep foundation
- [x] Void Temple prepares, does not proxy retaliation
- [x] Retire “collapse Seeking into VR sub-phase” alternative
